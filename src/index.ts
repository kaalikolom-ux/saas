import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { Env, Product, Course, Project, BlogPost, Contact, Order, User } from "./types";
import { hashPassword, verifyPassword, createSession, getUserFromSession, deleteSession } from "./utils/auth";
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
import { loginView, registerView } from "./views/auth";

type Variables = {
  user: User | null;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// ── Session Middleware ──────────────────────────────────────────────────────
app.use("*", async (c, next) => {
  const sessionId = getCookie(c, "notabene_session") || "";
  let user: User | null = null;
  if (sessionId && c.env.DB) {
    user = await getUserFromSession(c.env.DB, sessionId);
  }
  c.set("user", user);

  // Static Assets Fallback
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

// ── Auth Routes ─────────────────────────────────────────────────────────────
app.get("/auth/login", (c) => {
  const user = c.get("user");
  if (user) return c.redirect("/dashboard/");
  const next = c.req.query("next") || "/dashboard/";

  const html = layout({
    title: "লগইন — notabene.saas",
    user,
    content: loginView({ next }),
  });
  return c.html(html);
});

app.post("/auth/login", async (c) => {
  const db = c.env.DB;
  const body = await c.req.parseBody();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();
  const nextUrl = String(body.next || "/dashboard/");

  if (!email || !password) {
    return c.html(
      layout({
        title: "লগইন — notabene.saas",
        content: loginView({ error: "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দিন।", email, next: nextUrl }),
      }),
      400
    );
  }

  const user = await db
    .prepare("SELECT * FROM users WHERE LOWER(email) = ?")
    .bind(email)
    .first<User>();

  if (!user) {
    return c.html(
      layout({
        title: "লগইন — notabene.saas",
        content: loginView({ error: "এই ইমেইলে কোনো অ্যাকাউন্ট পাওয়া যায়নি।", email, next: nextUrl }),
      }),
      401
    );
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    return c.html(
      layout({
        title: "লগইন — notabene.saas",
        content: loginView({ error: "ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।", email, next: nextUrl }),
      }),
      401
    );
  }

  const sessionId = await createSession(db, user.id);
  setCookie(c, "notabene_session", sessionId, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
    sameSite: "Lax",
    httpOnly: true,
  });

  return c.redirect(nextUrl);
});

app.get("/auth/register", (c) => {
  const user = c.get("user");
  if (user) return c.redirect("/dashboard/");

  const html = layout({
    title: "সাইনআপ — notabene.saas",
    user,
    content: registerView({}),
  });
  return c.html(html);
});

app.post("/auth/register", async (c) => {
  const db = c.env.DB;
  const body = await c.req.parseBody();
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "").trim();

  if (!name || !email || !password || password.length < 6) {
    return c.html(
      layout({
        title: "সাইনআপ — notabene.saas",
        content: registerView({
          error: "সব তথ্য পূরণ করুন এবং পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
          name,
          email,
        }),
      }),
      400
    );
  }

  const existing = await db
    .prepare("SELECT id FROM users WHERE LOWER(email) = ?")
    .bind(email)
    .first<{ id: number }>();

  if (existing) {
    return c.html(
      layout({
        title: "সাইনআপ — notabene.saas",
        content: registerView({
          error: "এই ইমেইল দিয়ে ইতিমধ্যে একটি অ্যাকাউন্ট রয়েছে। লগইন করুন।",
          name,
          email,
        }),
      }),
      400
    );
  }

  const passHash = await hashPassword(password);
  const insertRes = await db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'user')")
    .bind(name, email, passHash)
    .run();

  const userRes = await db
    .prepare("SELECT * FROM users WHERE LOWER(email) = ?")
    .bind(email)
    .first<User>();

  if (userRes) {
    // Seed initial free starter ebooks into new user's library
    const freeProds = await db
      .prepare("SELECT id FROM products WHERE discounted_price = 0 LIMIT 3")
      .all<{ id: number }>();
    if (freeProds.results) {
      for (const p of freeProds.results) {
        await db
          .prepare("INSERT OR IGNORE INTO user_library (user_id, product_id, acquired_type) VALUES (?, ?, 'free')")
          .bind(userRes.id, p.id)
          .run();
      }
    }

    const sessionId = await createSession(db, userRes.id);
    setCookie(c, "notabene_session", sessionId, {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      sameSite: "Lax",
      httpOnly: true,
    });
  }

  return c.redirect("/dashboard/");
});

app.get("/auth/logout", async (c) => {
  const sessionId = getCookie(c, "notabene_session") || "";
  if (sessionId && c.env.DB) {
    await deleteSession(c.env.DB, sessionId);
  }
  deleteCookie(c, "notabene_session");
  return c.redirect("/");
});

// ── Save Product to User Library ───────────────────────────────────────────
app.post("/api/library/add", async (c) => {
  const user = c.get("user");
  const db = c.env.DB;
  const body = await c.req.parseBody();
  const productId = parseInt(String(body.product_id || "0"), 10);

  if (!user) {
    return c.redirect("/auth/login?next=/dashboard/");
  }

  if (productId > 0) {
    await db
      .prepare(
        "INSERT OR IGNORE INTO user_library (user_id, product_id, acquired_type) VALUES (?, ?, 'saved')"
      )
      .bind(user.id, productId)
      .run();
  }

  return c.redirect("/dashboard/");
});

// ── Home Page ───────────────────────────────────────────────────────────────
app.get("/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const [productsRes, projectsRes, blogsRes] = await Promise.all([
    db.prepare("SELECT * FROM products ORDER BY is_featured DESC, id ASC").all<Product>(),
    db.prepare("SELECT * FROM projects ORDER BY id ASC").all<Project>(),
    db.prepare("SELECT * FROM blog_posts ORDER BY id DESC").all<BlogPost>(),
  ]);

  const html = layout({
    title: "notabene.saas — ডিজিটাল প্রোডাক্ট, ইবুক ও প্লাগিন্স প্ল্যাটফর্ম",
    description: "বাস্তব কাজের অভিজ্ঞতা থেকে তৈরি বাংলা প্রোগ্রামিং বই, ফুলস্ট্যাক কোড টেমপ্লেট এবং অটোমেশন স্ক্রিপ্ট।",
    canonical: "https://saas.notabeneinc.workers.dev/",
    activeNav: "home",
    user,
    content: homeView({
      products: productsRes.results || [],
      projects: projectsRes.results || [],
      blogs: blogsRes.results || [],
      user,
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
  const subject = String(body.subject || "Product Inquiry").trim();
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
      ✓ ধন্যবাদ <b>${escapeHtml(name)}</b>! আপনার বার্তাটি সফলভাবে পাঠানো হয়েছে। আমরা দ্রুত যোগাযোগ করব।
    </div>`
  );
});

app.post("/", async (c) => {
  return app.request("/crm/contact/", c.req.raw);
});

// ── Products Catalog ────────────────────────────────────────────────────────
app.get("/products/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const priceFilter = c.req.query("price") || "all";
  const searchQ = c.req.query("q") || "";

  const productsRes = await db
    .prepare("SELECT * FROM products ORDER BY is_featured DESC, id ASC")
    .all<Product>();

  let savedProductIds: number[] = [];
  if (user) {
    const savedRes = await db
      .prepare("SELECT product_id FROM user_library WHERE user_id = ?")
      .bind(user.id)
      .all<{ product_id: number }>();
    if (savedRes.results) {
      savedProductIds = savedRes.results.map((r) => r.product_id);
    }
  }

  const html = layout({
    title: "ডিজিটাল প্রোডাক্ট — notabene.saas",
    description: "বই, প্লাগিন্স আর টেমপ্লেট — বাস্তব কাজ থেকে বানানো।",
    canonical: "https://saas.notabeneinc.workers.dev/products/",
    activeNav: priceFilter === "free" ? "free" : "products",
    user,
    content: productsView({
      products: productsRes.results || [],
      currentFilter: priceFilter,
      searchQuery: searchQ,
      user,
      savedProductIds,
    }),
  });

  return c.html(html);
});

// ── Product Detail ──────────────────────────────────────────────────────────
app.get("/products/:slug/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const slug = c.req.param("slug");

  const product = await db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .bind(slug)
    .first<Product>();

  if (!product) {
    return c.html(layout({ user, content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>প্রোডাক্টটি পাওয়া যায়নি</h1><a href='/products/' class='bp' style='margin-top:16px;display:inline-block'>সকল প্রোডাক্ট দেখুন</a></div>" }), 404);
  }

  let isSaved = false;
  if (user) {
    const savedItem = await db
      .prepare("SELECT id FROM user_library WHERE user_id = ? AND product_id = ?")
      .bind(user.id, product.id)
      .first<{ id: number }>();
    if (savedItem) isSaved = true;
  }

  const relatedRes = await db
    .prepare("SELECT * FROM products WHERE slug != ? ORDER BY RANDOM() LIMIT 3")
    .bind(slug)
    .all<Product>();

  const html = layout({
    title: `${product.title} — notabene.saas`,
    description: product.description || product.title,
    canonical: `https://saas.notabeneinc.workers.dev/products/${product.slug}/`,
    activeNav: "products",
    user,
    content: productDetailView({
      product,
      relatedProducts: relatedRes.results || [],
      user,
      isSaved,
    }),
  });

  return c.html(html);
});

// ── Courses Catalog ─────────────────────────────────────────────────────────
app.get("/courses/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const coursesRes = await db.prepare("SELECT * FROM courses ORDER BY id ASC").all<Course>();

  const html = layout({
    title: "কোর্স ও মাস্টারক্লাস — notabene.saas",
    description: "হাতে-কলমে শিখুন — বাস্তব প্রজেক্ট থেকে বানানো কোর্স।",
    canonical: "https://saas.notabeneinc.workers.dev/courses/",
    activeNav: "courses",
    user,
    content: coursesView({
      courses: coursesRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Course Detail ───────────────────────────────────────────────────────────
app.get("/courses/:slug/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const slug = c.req.param("slug");

  const course = await db
    .prepare("SELECT * FROM courses WHERE slug = ?")
    .bind(slug)
    .first<Course>();

  if (!course) {
    return c.html(layout({ user, content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>কোর্সটি পাওয়া যায়নি</h1><a href='/courses/' class='bp' style='margin-top:16px;display:inline-block'>সকল কোর্স দেখুন</a></div>" }), 404);
  }

  const html = layout({
    title: `${course.title} — notabene.saas`,
    description: course.subtitle || course.description || course.title,
    canonical: `https://saas.notabeneinc.workers.dev/courses/${course.slug}/`,
    activeNav: "courses",
    user,
    content: courseDetailView({ course }),
  });

  return c.html(html);
});

// ── Projects Catalog ────────────────────────────────────────────────────────
app.get("/projects/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const cat = c.req.query("cat") || "all";
  const projectsRes = await db.prepare("SELECT * FROM projects ORDER BY id ASC").all<Project>();

  const html = layout({
    title: "Projects Portfolio — notabene.saas",
    description: "Featured full-stack software and automation projects.",
    canonical: "https://saas.notabeneinc.workers.dev/projects/",
    activeNav: "projects",
    user,
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
  const user = c.get("user");
  const slug = c.req.param("slug");

  const project = await db
    .prepare("SELECT * FROM projects WHERE slug = ?")
    .bind(slug)
    .first<Project>();

  if (!project) {
    return c.html(layout({ user, content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>প্রজেক্টটি পাওয়া যায়নি</h1><a href='/projects/' class='bp' style='margin-top:16px;display:inline-block'>সকল প্রজেক্ট দেখুন</a></div>" }), 404);
  }

  const relatedRes = await db
    .prepare("SELECT * FROM projects WHERE slug != ? ORDER BY RANDOM() LIMIT 3")
    .bind(slug)
    .all<Project>();

  const html = layout({
    title: `${project.title} — notabene.saas`,
    description: project.summary || project.title,
    canonical: `https://saas.notabeneinc.workers.dev/projects/${project.slug}/`,
    activeNav: "projects",
    user,
    content: projectDetailView({
      project,
      relatedProjects: relatedRes.results || [],
    }),
  });

  return c.html(html);
});

// ── Services & Pricing ──────────────────────────────────────────────────────
app.get("/services/", (c) => {
  const user = c.get("user");
  return c.html(
    layout({
      title: "Services & Expertise — notabene.saas",
      description: "Custom Django, Python, AI Automation, and Cloudflare development services.",
      canonical: "https://saas.notabeneinc.workers.dev/services/",
      activeNav: "services",
      user,
      content: servicesView(),
    })
  );
});

app.get("/services/pricing/", (c) => {
  const user = c.get("user");
  return c.html(
    layout({
      title: "Flexible Packages & Pricing — notabene.saas",
      description: "Hourly support, full stack projects, and AI automation pricing.",
      canonical: "https://saas.notabeneinc.workers.dev/services/pricing/",
      activeNav: "pricing",
      user,
      content: pricingView(),
    })
  );
});

// ── Blog ────────────────────────────────────────────────────────────────────
app.get("/blog/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const cat = c.req.query("cat") || "all";
  const searchQ = c.req.query("q") || "";

  const postsRes = await db
    .prepare("SELECT * FROM blog_posts ORDER BY id DESC")
    .all<BlogPost>();

  const html = layout({
    title: "From The Blog — notabene.saas",
    description: "Practical guides, tutorials and insights on Django, AI automation, and system architecture.",
    canonical: "https://saas.notabeneinc.workers.dev/blog/",
    activeNav: "blog",
    user,
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
  const user = c.get("user");
  const slug = c.req.param("slug");

  const post = await db
    .prepare("SELECT * FROM blog_posts WHERE slug = ?")
    .bind(slug)
    .first<BlogPost>();

  if (!post) {
    return c.html(layout({ user, content: "<div class='container' style='padding:80px 20px;text-align:center'><h1>নিবন্ধটি পাওয়া যায়নি</h1><a href='/blog/' class='bp' style='margin-top:16px;display:inline-block'>সকল ব্লগ নিবন্ধ দেখুন</a></div>" }), 404);
  }

  const relatedRes = await db
    .prepare("SELECT * FROM blog_posts WHERE slug != ? LIMIT 2")
    .bind(slug)
    .all<BlogPost>();

  const html = layout({
    title: `${post.title} — notabene.saas`,
    description: post.summary,
    canonical: `https://saas.notabeneinc.workers.dev/blog/${post.slug}/`,
    activeNav: "blog",
    user,
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
  const luckyPicks = [
    { index: 3, pct: 20 },
    { index: 4, pct: 25 },
    { index: 5, pct: 30 },
  ];
  const pick = luckyPicks[Math.floor(Math.random() * luckyPicks.length)];

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
  const user = c.get("user");
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
    title: "বান্ডেল চেকআউট — notabene.saas",
    activeNav: "products",
    user,
    content: checkoutView({ items: resolvedItems, spinDiscountPercent: spinDiscount }),
  });

  return c.html(html);
});

app.get("/payments/checkout/product/:slug/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
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
    user,
    content: checkoutView({ items }),
  });

  return c.html(html);
});

app.get("/payments/checkout/course/:slug/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
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
    user,
    content: checkoutView({ items }),
  });

  return c.html(html);
});

app.post("/payments/checkout/submit", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const body = await c.req.parseBody();

  const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
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

  // If customer is logged in or user exists by email, sync purchased items into their library!
  let targetUserId = user?.id;
  if (!targetUserId) {
    const matchedUser = await db
      .prepare("SELECT id FROM users WHERE LOWER(email) = ?")
      .bind(email)
      .first<{ id: number }>();
    if (matchedUser) targetUserId = matchedUser.id;
  }

  if (targetUserId) {
    try {
      const itemsList = JSON.parse(itemsJson);
      for (const item of itemsList) {
        if (item.type !== "course") {
          const prod = await db
            .prepare("SELECT id FROM products WHERE slug = ?")
            .bind(item.slug)
            .first<{ id: number }>();
          if (prod) {
            await db
              .prepare(
                "INSERT OR IGNORE INTO user_library (user_id, product_id, acquired_type) VALUES (?, ?, 'purchased')"
              )
              .bind(targetUserId, prod.id)
              .run();
          }
        }
      }
    } catch {}
  }

  return c.redirect(`/payments/checkout/success/${orderId}`);
});

app.get("/payments/checkout/success/:orderId", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
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
    title: `অর্ডার নিশ্চিত হয়েছে (${order.order_id}) — notabene.saas`,
    user,
    content: orderSuccessView({ order, resolvedItems }),
  });

  return c.html(html);
});

// ── Customer Library & Admin Dashboard (Matching User Screenshot!) ──────────
app.get("/dashboard/", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  const tab = c.req.query("tab") || "library";

  // If user is not logged in, redirect to login
  if (!user) {
    return c.redirect("/auth/login?next=/dashboard/");
  }

  // Fetch user's saved/acquired products
  const libRes = await db
    .prepare(
      `SELECT p.* FROM products p
       JOIN user_library ul ON ul.product_id = p.id
       WHERE ul.user_id = ?
       ORDER BY ul.id DESC`
    )
    .bind(user.id)
    .all<Product>();

  const allFreeRes = await db
    .prepare("SELECT * FROM products WHERE discounted_price = 0")
    .all<Product>();

  const userOrdersRes = await db
    .prepare("SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY id DESC")
    .bind(user.email.toLowerCase())
    .all<Order>();

  let allOrders: Order[] = [];
  let allLeads: Contact[] = [];
  let totalSpins = 0;

  if (user.role === "admin") {
    const [allOrd, allLd, spCnt] = await Promise.all([
      db.prepare("SELECT * FROM orders ORDER BY id DESC").all<Order>(),
      db.prepare("SELECT * FROM contacts ORDER BY id DESC").all<Contact>(),
      db.prepare("SELECT COUNT(*) as count FROM spins").first<{ count: number }>(),
    ]);
    allOrders = allOrd.results || [];
    allLeads = allLd.results || [];
    totalSpins = spCnt?.count || 0;
  }

  const html = layout({
    title: "আমার লাইব্রেরি — notabene.saas",
    activeNav: "dashboard",
    user,
    content: dashboardView({
      user,
      libraryProducts: libRes.results || [],
      allFreeProducts: allFreeRes.results || [],
      userOrders: userOrdersRes.results || [],
      allOrders,
      allLeads,
      totalSpins,
      activeTab: tab,
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

app.get("/api/orders", async (c) => {
  const db = c.env.DB;
  const user = c.get("user");
  if (!user || user.role !== "admin") {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const res = await db.prepare("SELECT * FROM orders ORDER BY id DESC").all<Order>();
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
