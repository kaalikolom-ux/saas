import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { Env, Product, Course, Project, BlogPost, Contact, Order } from "./types";
import { layout } from "./views/layout";
import { homeView } from "./views/home";
import { productsView } from "./views/products";
import { productDetailView } from "./views/product-detail";
import { coursesView } from "./views/courses";
import { courseDetailView } from "./views/course-detail";
import { projectsView } from "./views/projects";
import { projectDetailView } from "./views/project-detail";
import { servicesView, pricingView } from "./views/services";
import { blogView, blogDetailView } from "./views/blog";
import { checkoutView, CheckoutItem } from "./views/checkout";
import { orderSuccessView } from "./views/order-success";
import { dashboardView } from "./views/dashboard";

const app = new Hono<{ Bindings: Env }>();

// ── Static Assets Fallback ──────────────────────────────────────────────────
app.use("*", async (c, next) => {
  if (c.env.ASSETS) {
    const url = new URL(c.req.url);
    if (url.pathname.startsWith("/static/") || url.pathname.startsWith("/media/")) {
      const assetResponse = await c.env.ASSETS.fetch(c.req.raw);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }
  }
  await next();
});

// ── Home Page ───────────────────────────────────────────────────────────────
app.get("/", async (c) => {
  const db = c.env.DB;
  const [productsRes, projectsRes, blogsRes] = await Promise.all([
    db.prepare("SELECT * FROM products ORDER BY is_featured DESC, id ASC").all<Product>(),
    db.prepare("SELECT * FROM projects ORDER BY id ASC").all<Project>(),
    db.prepare("SELECT * FROM blog_posts ORDER BY id DESC").all<BlogPost>(),
  ]);

  const html = layout({
    title: "Ifte Samul — Django Developer & AI Automation Engineer",
    description: "Software Engineer with 4+ years of experience in Django, Python, JavaScript, and React. Based in Dhaka, Bangladesh.",
    canonical: "https://iftesamulohy.com/",
    activeNav: "home",
    content: homeView({
      products: productsRes.results || [],
      projects: projectsRes.results || [],
      blogs: blogsRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Contact / CRM Submission (HTMX & standard POST) ─────────────────────────
app.post("/crm/contact/", async (c) => {
  const db = c.env.DB;
  const body = await c.req.parseBody();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const subject = String(body.subject || "Project Inquiry").trim();
  const pkg = String(body.package || "General").trim();
  const message = String(body.message || "").trim();

  if (!name || !email || !message) {
    return c.html(
      `<div class="alert alert-danger" style="background:rgba(239,68,68,.12);border:1px solid #ef4444;border-radius:8px;padding:14px;color:#ef4444;margin-bottom:16px">
        ⚠️ অনুগ্রহ করে নাম, ইমেইল এবং বার্তা সঠিকভাবে লিখুন।
      </div>`,
      400
    );
  }

  await db
    .prepare(
      "INSERT INTO contacts (name, email, subject, package, message, status) VALUES (?, ?, ?, ?, ?, 'new')"
    )
    .bind(name, email, subject, pkg, message)
    .run();

  return c.html(
    `<div class="alert alert-success" style="background:rgba(34,197,94,.12);border:1px solid #16a34a;border-radius:8px;padding:14px;color:#16a34a;margin-bottom:16px">
      ✓ ধন্যবাদ <b>${escapeHtml(name)}</b>! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমি ২৪ ঘণ্টার মধ্যে আপনার সাথে যোগাযোগ করব।
    </div>`
  );
});

// Also accept POST / as the contact form handler for HTMX
app.post("/", async (c) => {
  return app.request("/crm/contact/", c.req.raw);
});

// ── Products Catalog ────────────────────────────────────────────────────────
app.get("/products/", async (c) => {
  const db = c.env.DB;
  const priceFilter = c.req.query("price") || "all";
  const searchQ = c.req.query("q") || "";

  const productsRes = await db
    .prepare("SELECT * FROM products ORDER BY is_featured DESC, id ASC")
    .all<Product>();

  const html = layout({
    title: "ডিজিটাল প্রোডাক্ট — Ifte Samul",
    description: "বই, স্ক্রিপ্ট আর টেমপ্লেট — বাস্তব কাজ থেকে বানানো।",
    canonical: "https://iftesamulohy.com/products/",
    activeNav: "products",
    content: productsView({
      products: productsRes.results || [],
      currentFilter: priceFilter,
      searchQuery: searchQ,
    }),
  });

  return c.html(html);
});

// ── Product Detail ──────────────────────────────────────────────────────────
app.get("/products/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");

  const product = await db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .bind(slug)
    .first<Product>();

  if (!product) {
    return c.html(layout({ content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>প্রোডাক্টটি পাওয়া যায়নি</h1><a href='/products/' class='bp' style='margin-top:16px;display:inline-block'>সকল প্রোডাক্ট দেখুন</a></div>" }), 404);
  }

  const relatedRes = await db
    .prepare("SELECT * FROM products WHERE slug != ? ORDER BY RANDOM() LIMIT 3")
    .bind(slug)
    .all<Product>();

  const html = layout({
    title: `${product.title} — Ifte Samul`,
    description: product.description || product.title,
    canonical: `https://iftesamulohy.com/products/${product.slug}/`,
    activeNav: "products",
    content: productDetailView({
      product,
      relatedProducts: relatedRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Courses Catalog ─────────────────────────────────────────────────────────
app.get("/courses/", async (c) => {
  const db = c.env.DB;
  const coursesRes = await db.prepare("SELECT * FROM courses ORDER BY id ASC").all<Course>();

  const html = layout({
    title: "কোর্স ও মাস্টারক্লাস — Ifte Samul",
    description: "হাতে-কলমে শেখো — বাস্তব প্রজেক্ট থেকে বানানো কোর্স।",
    canonical: "https://iftesamulohy.com/courses/",
    activeNav: "courses",
    content: coursesView({
      courses: coursesRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Course Detail ───────────────────────────────────────────────────────────
app.get("/courses/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");

  const course = await db
    .prepare("SELECT * FROM courses WHERE slug = ?")
    .bind(slug)
    .first<Course>();

  if (!course) {
    return c.html(layout({ content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>কোর্সটি পাওয়া যায়নি</h1><a href='/courses/' class='bp' style='margin-top:16px;display:inline-block'>সকল কোর্স দেখুন</a></div>" }), 404);
  }

  const html = layout({
    title: `${course.title} — Ifte Samul`,
    description: course.subtitle || course.description || course.title,
    canonical: `https://iftesamulohy.com/courses/${course.slug}/`,
    activeNav: "courses",
    content: courseDetailView({ course }),
  });

  return c.html(html);
});

// ── Projects Catalog ────────────────────────────────────────────────────────
app.get("/projects/", async (c) => {
  const db = c.env.DB;
  const cat = c.req.query("cat") || "all";
  const projectsRes = await db.prepare("SELECT * FROM projects ORDER BY id ASC").all<Project>();

  const html = layout({
    title: "Projects Portfolio — Ifte Samul",
    description: "Featured full-stack software and automation projects built by Ifte Samul.",
    canonical: "https://iftesamulohy.com/projects/",
    activeNav: "projects",
    content: projectsView({
      projects: projectsRes.results || [],
      currentCategory: cat,
    }),
  });

  return c.html(html);
});

// ── Project Detail ──────────────────────────────────────────────────────────
app.get("/projects/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");

  const project = await db
    .prepare("SELECT * FROM projects WHERE slug = ?")
    .bind(slug)
    .first<Project>();

  if (!project) {
    return c.html(layout({ content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>প্রজেক্টটি পাওয়া যায়নি</h1><a href='/projects/' class='bp' style='margin-top:16px;display:inline-block'>সকল প্রজেক্ট দেখুন</a></div>" }), 404);
  }

  const relatedRes = await db
    .prepare("SELECT * FROM projects WHERE slug != ? ORDER BY RANDOM() LIMIT 3")
    .bind(slug)
    .all<Project>();

  const html = layout({
    title: `${project.title} — Project Case Study`,
    description: project.summary || project.title,
    canonical: `https://iftesamulohy.com/projects/${project.slug}/`,
    activeNav: "projects",
    content: projectDetailView({
      project,
      relatedProjects: relatedRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Services & Pricing ──────────────────────────────────────────────────────
app.get("/services/", (c) => {
  return c.html(
    layout({
      title: "Services & Expertise — Ifte Samul",
      description: "Custom Django, Python, AI Automation, and Cloudflare development services.",
      canonical: "https://iftesamulohy.com/services/",
      activeNav: "services",
      content: servicesView(),
    })
  );
});

app.get("/services/pricing/", (c) => {
  return c.html(
    layout({
      title: "Flexible Packages & Pricing — Ifte Samul",
      description: "Hourly support, full stack projects, and AI automation pricing.",
      canonical: "https://iftesamulohy.com/services/pricing/",
      activeNav: "pricing",
      content: pricingView(),
    })
  );
});

// ── Blog ────────────────────────────────────────────────────────────────────
app.get("/blog/", async (c) => {
  const db = c.env.DB;
  const cat = c.req.query("cat") || "all";
  const searchQ = c.req.query("q") || "";

  const postsRes = await db
    .prepare("SELECT * FROM blog_posts ORDER BY id DESC")
    .all<BlogPost>();

  const html = layout({
    title: "From The Blog — Ifte Samul",
    description: "Practical guides, tutorials and insights on Django, AI automation, and system architecture.",
    canonical: "https://iftesamulohy.com/blog/",
    activeNav: "blog",
    content: blogView({
      posts: postsRes.results || [],
      currentCategory: cat,
      searchQuery: searchQ,
    }),
  });

  return c.html(html);
});

app.get("/blog/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");

  const post = await db
    .prepare("SELECT * FROM blog_posts WHERE slug = ?")
    .bind(slug)
    .first<BlogPost>();

  if (!post) {
    return c.html(layout({ content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>নিবন্ধটি পাওয়া যায়নি</h1><a href='/blog/' class='bp' style='margin-top:16px;display:inline-block'>সকল ব্লগ নিবন্ধ দেখুন</a></div>" }), 404);
  }

  const relatedRes = await db
    .prepare("SELECT * FROM blog_posts WHERE slug != ? LIMIT 2")
    .bind(slug)
    .all<BlogPost>();

  const html = layout({
    title: `${post.title} — Ifte Samul`,
    description: post.summary,
    canonical: `https://iftesamulohy.com/blog/${post.slug}/`,
    activeNav: "blog",
    content: blogDetailView(post, relatedRes.results || []),
  });

  return c.html(html);
});

// ── Offers & Wheel Spinner API ──────────────────────────────────────────────
app.get("/offers/popup-data/", (c) => {
  return c.json({
    mode: "spinner",
    min_items: 2,
    valid_days: 3,
    heading: "একসাথে কিনলে বাড়তি ছাড়! 🎉",
    subheading: "একাধিক বই একসাথে নিন, ছাড় পান আরও বেশি।",
    segments: [
      { label: "৫% ছাড়", value_percent: 5, color: "#22d3ee", index: 0 },
      { label: "১০% ছাড়", value_percent: 10, color: "#34d399", index: 1 },
      { label: "১৫% ছাড়", value_percent: 15, color: "#a78bfa", index: 2 },
      { label: "২০% ছাড়", value_percent: 20, color: "#fbbf24", index: 3 },
      { label: "২৫% ছাড়", value_percent: 25, color: "#f472b6", index: 4 },
      { label: "৩০% ছাড়", value_percent: 30, color: "#7c6af7", index: 5 },
      { label: "৫০% ছাড়", value_percent: 50, color: "#f87171", index: 6 },
      { label: "৭৫% ছাড়", value_percent: 75, color: "#fb923c", index: 7 },
      { label: "১০০% ছাড়", value_percent: 100, color: "#facc15", index: 8 },
    ],
    show: true,
    campaign_id: 1,
  });
});

app.post("/offers/spin/", async (c) => {
  const db = c.env.DB;
  // Weighted probabilistic wheel spin: index 3 (20%) or index 5 (30%)
  const luckyPicks = [
    { index: 3, pct: 20 },
    { index: 4, pct: 25 },
    { index: 5, pct: 30 },
  ];
  const pick = luckyPicks[Math.floor(Math.random() * luckyPicks.length)];

  // Record spin in D1
  await db
    .prepare("INSERT INTO spins (campaign_id, segment_index, discount_percent) VALUES (1, ?, ?)")
    .bind(pick.index, pick.pct)
    .run();

  setCookie(c, "spin_discount", String(pick.pct), {
    maxAge: 86400 * 3,
    path: "/",
    sameSite: "Lax",
  });

  const productsRes = await db
    .prepare("SELECT slug, title, price, discounted_price FROM products WHERE discounted_price > 0 ORDER BY price DESC")
    .all<Product>();

  return c.json({
    segment_index: pick.index,
    percent: pick.pct,
    products: productsRes.results || [],
  });
});

app.post("/offers/dismiss/", (c) => {
  return c.json({ ok: true });
});

// ── Checkout & Payments ─────────────────────────────────────────────────────
app.get("/payments/checkout/bundle/", async (c) => {
  const db = c.env.DB;
  const itemsJsonRaw = c.req.query("items_json") || "";
  let itemsToResolve: { item_type?: string; type?: string; slug: string }[] = [];

  try {
    if (itemsJsonRaw) {
      itemsToResolve = JSON.parse(itemsJsonRaw);
    }
  } catch {}

  const resolvedItems: CheckoutItem[] = [];
  for (const item of itemsToResolve) {
    const slug = item.slug;
    if (item.type === "course" || item.item_type === "course") {
      const course = await db.prepare("SELECT * FROM courses WHERE slug = ?").bind(slug).first<Course>();
      if (course) {
        resolvedItems.push({
          type: "course",
          slug: course.slug,
          title: course.title,
          price: course.price,
          discounted_price: course.discounted_price,
          cover_image: course.cover_image,
        });
      }
    } else {
      const product = await db.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first<Product>();
      if (product) {
        resolvedItems.push({
          type: "product",
          slug: product.slug,
          title: product.title,
          price: product.price,
          discounted_price: product.discounted_price,
          cover_image: product.cover_image,
        });
      }
    }
  }

  const spinDiscount = parseInt(getCookie(c, "spin_discount") || "0", 10);

  const html = layout({
    title: "বান্ডেল চেকআউট — Ifte Samul",
    activeNav: "products",
    content: checkoutView({ items: resolvedItems, spinDiscountPercent: spinDiscount }),
  });

  return c.html(html);
});

app.get("/payments/checkout/product/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");
  const product = await db.prepare("SELECT * FROM products WHERE slug = ?").bind(slug).first<Product>();

  if (!product) {
    return c.redirect("/products/");
  }

  const items: CheckoutItem[] = [
    {
      type: "product",
      slug: product.slug,
      title: product.title,
      price: product.price,
      discounted_price: product.discounted_price,
      cover_image: product.cover_image,
    },
  ];

  const html = layout({
    title: `চেকআউট — ${product.title}`,
    activeNav: "products",
    content: checkoutView({ items }),
  });

  return c.html(html);
});

app.get("/payments/checkout/course/:slug/", async (c) => {
  const db = c.env.DB;
  const slug = c.req.param("slug");
  const course = await db.prepare("SELECT * FROM courses WHERE slug = ?").bind(slug).first<Course>();

  if (!course) {
    return c.redirect("/courses/");
  }

  const items: CheckoutItem[] = [
    {
      type: "course",
      slug: course.slug,
      title: course.title,
      price: course.price,
      discounted_price: course.discounted_price,
      cover_image: course.cover_image,
    },
  ];

  const html = layout({
    title: `এনরোলমেন্ট চেকআউট — ${course.title}`,
    activeNav: "courses",
    content: checkoutView({ items }),
  });

  return c.html(html);
});

app.post("/payments/checkout/submit", async (c) => {
  const db = c.env.DB;
  const body = await c.req.parseBody();

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const phone = String(body.phone || "").trim();
  const paymentMethod = String(body.payment_method || "bkash").trim();
  const senderNumber = String(body.sender_number || "").trim();
  const trxId = String(body.transaction_id || "").trim();
  const itemsJson = String(body.items_json || "[]").trim();
  const subtotal = parseInt(String(body.subtotal || "0"), 10);
  const discount = parseInt(String(body.discount || "0"), 10);
  const total = parseInt(String(body.total || "0"), 10);

  await db
    .prepare(
      `INSERT INTO orders (order_id, customer_name, customer_email, customer_phone, payment_method, sender_number, transaction_id, items_json, subtotal, discount, total, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')`
    )
    .bind(orderId, name, email, phone, paymentMethod, senderNumber, trxId, itemsJson, subtotal, discount, total)
    .run();

  return c.redirect(`/payments/checkout/success/${orderId}`);
});

app.get("/payments/checkout/success/:orderId", async (c) => {
  const db = c.env.DB;
  const orderId = c.req.param("orderId");

  const order = await db.prepare("SELECT * FROM orders WHERE order_id = ?").bind(orderId).first<Order>();
  if (!order) {
    return c.redirect("/dashboard/");
  }

  let itemsParsed: { type: string; slug: string }[] = [];
  try {
    itemsParsed = JSON.parse(order.items_json);
  } catch {}

  const resolvedItems: (Product | Course)[] = [];
  for (const item of itemsParsed) {
    if (item.type === "course") {
      const course = await db.prepare("SELECT * FROM courses WHERE slug = ?").bind(item.slug).first<Course>();
      if (course) resolvedItems.push(course);
    } else {
      const prod = await db.prepare("SELECT * FROM products WHERE slug = ?").bind(item.slug).first<Product>();
      if (prod) resolvedItems.push(prod);
    }
  }

  const html = layout({
    title: `অর্ডার নিশ্চিত হয়েছে (${order.order_id}) — Ifte Samul`,
    content: orderSuccessView({ order, resolvedItems }),
  });

  return c.html(html);
});

// ── Dashboard & Admin Analytics ─────────────────────────────────────────────
app.get("/dashboard/", async (c) => {
  const db = c.env.DB;
  const userEmail = c.req.query("email") || "";

  let userOrders: Order[] = [];
  if (userEmail) {
    const userRes = await db
      .prepare("SELECT * FROM orders WHERE customer_email = ? OR customer_phone = ? ORDER BY id DESC")
      .bind(userEmail, userEmail)
      .all<Order>();
    userOrders = userRes.results || [];
  }

  const [ordersRes, leadsRes, productsRes, spinsRes] = await Promise.all([
    db.prepare("SELECT * FROM orders ORDER BY id DESC").all<Order>(),
    db.prepare("SELECT * FROM contacts ORDER BY id DESC").all<Contact>(),
    db.prepare("SELECT * FROM products ORDER BY id ASC").all<Product>(),
    db.prepare("SELECT COUNT(*) as count FROM spins").first<{ count: number }>(),
  ]);

  const orders = ordersRes.results || [];
  const leads = leadsRes.results || [];
  const products = productsRes.results || [];
  const totalRevenue = orders.reduce((sum: number, o: Order) => sum + (o.total || 0), 0);
  const totalSpins = spinsRes?.count || 0;

  const html = layout({
    title: "Dashboard & Admin Portal — Ifte Samul",
    activeNav: "dashboard",
    content: dashboardView({
      orders,
      leads,
      products,
      totalRevenue,
      totalSpins,
      userEmail,
      userOrders,
    }),
  });

  return c.html(html);
});

// ── REST API Endpoints ──────────────────────────────────────────────────────
app.get("/api/products", async (c) => {
  const db = c.env.DB;
  const res = await db.prepare("SELECT * FROM products").all<Product>();
  return c.json(res.results || []);
});

app.get("/api/projects", async (c) => {
  const db = c.env.DB;
  const res = await db.prepare("SELECT * FROM projects").all<Project>();
  return c.json(res.results || []);
});

app.get("/api/orders", async (c) => {
  const db = c.env.DB;
  const res = await db.prepare("SELECT * FROM orders ORDER BY id DESC").all<Order>();
  return c.json(res.results || []);
});

app.get("/api/leads", async (c) => {
  const db = c.env.DB;
  const res = await db.prepare("SELECT * FROM contacts ORDER BY id DESC").all<Contact>();
  return c.json(res.results || []);
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export default app;
