import { User, Product, Order, Contact } from "../types";
import { formatBengaliDate } from "../utils/cards";

export interface DashboardViewProps {
  user: User;
  libraryProducts: Product[];
  allFreeProducts: Product[];
  userOrders: Order[];
  allProducts?: Product[];
  allOrders?: Order[];
  allLeads?: Contact[];
  totalSpins?: number;
  activeTab?: string;
  message?: string;
  error?: string;
}

export function dashboardView({
  user,
  libraryProducts,
  allFreeProducts,
  userOrders,
  allProducts = [],
  allOrders = [],
  allLeads = [],
  totalSpins = 0,
  activeTab = "library",
  message = "",
  error = "",
}: DashboardViewProps): string {
  const uncollectedFree = allFreeProducts.filter(
    (fp) => !libraryProducts.some((lp) => lp.id === fp.id)
  );

  const totalRevenue = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  return `
<div class="dash-shell">
  
  <!-- LEFT SIDEBAR -->
  <aside class="dash-sidebar">
    <div class="dash-brand-box">
      <div class="dash-logo-badge">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
      </div>
      <div>
        <div class="dash-brand-title">notabene<span style="color:#a78bfa">.saas</span></div>
        <div class="dash-brand-sub">লাইব্রেরি</div>
      </div>
    </div>

    <nav class="dash-nav">
      <div class="dash-nav-group-title">আমার সংগ্রহ</div>
      <a href="/dashboard/?tab=library" class="dash-nav-item ${activeTab === "library" ? "is-active" : ""}">
        <span class="dash-nav-icon">📚</span>
        <span>লাইব্রেরি</span>
        <span class="dash-nav-pill">${libraryProducts.length}</span>
      </a>
      <a href="https://wa.me/8801711583165" target="_blank" rel="noopener" class="dash-nav-item">
        <span class="dash-nav-icon">💬</span>
        <span>সাপোর্ট গ্রুপ</span>
      </a>

      <div class="dash-nav-group-title" style="margin-top:20px">আরও নিন</div>
      <a href="/products/?price=free" class="dash-nav-item">
        <span class="dash-nav-icon">🎁</span>
        <span>ফ্রি নিন</span>
        ${uncollectedFree.length > 0 ? `<span class="dash-nav-pill" style="background:#16a34a">${uncollectedFree.length}টি নতুন</span>` : ""}
      </a>
      <a href="/courses/" class="dash-nav-item">
        <span class="dash-nav-icon">🚀</span>
        <span>আরও শিখুন</span>
      </a>

      <div class="dash-nav-group-title" style="margin-top:20px">অ্যাকাউন্ট</div>
      <a href="/dashboard/?tab=orders" class="dash-nav-item ${activeTab === "orders" ? "is-active" : ""}">
        <span class="dash-nav-icon">📄</span>
        <span>অর্ডার</span>
        <span class="dash-nav-pill">${userOrders.length}</span>
      </a>

      ${
        user.role === "admin"
          ? `
      <div class="dash-nav-group-title" style="margin-top:20px;color:#a78bfa">👑 অ্যাডমিন প্যানেল</div>
      <a href="/dashboard/?tab=admin-products" class="dash-nav-item ${activeTab === "admin-products" ? "is-active" : ""}">
        <span class="dash-nav-icon">➕</span>
        <span>প্রোডাক্ট যোগ করুন</span>
        <span class="dash-nav-pill" style="background:#7c6af7">${allProducts.length}</span>
      </a>
      <a href="/dashboard/?tab=admin" class="dash-nav-item ${activeTab === "admin" ? "is-active" : ""}">
        <span class="dash-nav-icon">📊</span>
        <span>এনালিটিক্স</span>
      </a>
      <a href="/dashboard/?tab=admin-leads" class="dash-nav-item ${activeTab === "admin-leads" ? "is-active" : ""}">
        <span class="dash-nav-icon">📬</span>
        <span>লিডস ও বার্তা</span>
        <span class="dash-nav-pill" style="background:#7c6af7">${allLeads.length}</span>
      </a>
      `
          : ""
      }
    </nav>

    <div class="dash-sidebar-foot">
      <a href="/" class="dash-nav-item">
        <span class="dash-nav-icon">🏠</span>
        <span>মূল সাইটে যান</span>
      </a>
      <a href="/auth/logout" class="dash-nav-item" style="color:#ef4444">
        <span class="dash-nav-icon">↪️</span>
        <span>লগআউট</span>
      </a>
    </div>
  </aside>

  <!-- MAIN VIEWPORT -->
  <main class="dash-main">
    
    <!-- TOP BAR -->
    <header class="dash-topbar">
      <h1 class="dash-top-heading">${activeTab === "admin-products" ? "ডিজিটাল প্রোডাক্ট ম্যানেজমেন্ট" : activeTab === "admin" ? "অ্যাডমিন এনালিটিক্স" : activeTab === "orders" ? "আমার অর্ডারসমূহ" : activeTab === "admin-leads" ? "গ্রাহক লিডস ও বার্তা" : "আমার লাইব্রেরি"}</h1>
      
      <div class="dash-topbar-actions">
        <div class="dash-lang-pill">
          <span class="is-active">বাং</span>
          <span>EN</span>
        </div>

        <a href="/payments/checkout/bundle/" class="dash-circle-btn" aria-label="Cart" title="কার্ট">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </a>

        <button type="button" class="dash-circle-btn" id="dashThemeToggle" aria-label="Theme toggle" title="Theme toggle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>
        </button>

        <div class="dash-user-chip">
          <div class="dash-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
          <span style="font-size:14px;font-weight:600">${escapeHtml(user.name.split(" ")[0])}</span>
        </div>
      </div>
    </header>

    <!-- TAB: LIBRARY (DEFAULT) -->
    ${
      activeTab === "library"
        ? `
    <!-- PROMOTIONAL GRADIENT BANNER -->
    <div class="dash-promo-banner">
      <div class="dash-promo-content">
        <span class="dash-promo-badge">⏳ ভর্তি চলবে আর ১১ দিন</span>
        <h2 class="dash-promo-title">Modern AI Powered Fullstack Development</h2>
        <p class="dash-promo-desc">
          Python + Django + Automation + AI Workflow + Local LLM + ChatGPT + Claude দিয়ে Real World Project Based LIVE Course!
        </p>
      </div>
      <div class="dash-promo-thumb">
        <img src="/media/courses/covers/AI_Mission_Briefing__10x_Faster_Developer.jpg" alt="Course" style="width:130px;height:75px;object-fit:cover;border-radius:8px">
        <a href="/courses/ai-powered-python-django-automation-developer/" class="dash-promo-btn">বিস্তারিত দেখুন →</a>
      </div>
    </div>

    <!-- USER GREETING -->
    <div class="dash-greet-box">
      <h2 class="dash-greet-title">স্বাগতম, ${escapeHtml(user.name)}</h2>
      <p class="dash-greet-sub">
        আপনার সংগ্রহে <b>${libraryProducts.length}টি</b> আইটেম আছে — যখন খুশি পড়ুন বা ডাউনলোড করুন।
      </p>
    </div>

    <!-- 4 METRIC CARDS -->
    <div class="dash-stats-grid">
      <div class="dash-stat-card">
        <div class="dash-stat-left">
          <div class="dash-stat-num">${libraryProducts.length}</div>
          <div class="dash-stat-lbl">আপনার আইটেম</div>
        </div>
        <div class="dash-stat-icon-wrap" style="background:rgba(124,106,247,.15);color:#7c6af7">
          📚
        </div>
      </div>

      <div class="dash-stat-card">
        <div class="dash-stat-left">
          <div class="dash-stat-num">${uncollectedFree.length}</div>
          <div class="dash-stat-lbl">ফ্রি নিতে পারেন</div>
        </div>
        <div class="dash-stat-icon-wrap" style="background:rgba(234,88,12,.15);color:#ea580c">
          🎁
        </div>
      </div>

      <div class="dash-stat-card">
        <div class="dash-stat-left">
          <div class="dash-stat-num">১</div>
          <div class="dash-stat-lbl">সাপোর্ট গ্রুপ</div>
        </div>
        <div class="dash-stat-icon-wrap" style="background:rgba(14,165,233,.15);color:#0ea5e9">
          💬
        </div>
      </div>

      <div class="dash-stat-card">
        <div class="dash-stat-left">
          <div class="dash-stat-num">৬</div>
          <div class="dash-stat-lbl">নতুন শেখার সুযোগ</div>
        </div>
        <div class="dash-stat-icon-wrap" style="background:rgba(236,72,153,.15);color:#ec4899">
          🚀
        </div>
      </div>
    </div>

    <!-- DIGITAL PRODUCTS COLLECTION -->
    <div class="dash-section-head">
      <h3 style="font-size:18px;font-weight:700;margin:0">আমার সংরক্ষিত প্রোডাক্ট ও বইসমূহ</h3>
      <a href="/products/" class="dash-link">আরও প্রোডাক্ট খুঁজুন →</a>
    </div>

    ${
      libraryProducts.length > 0
        ? `
    <div class="nb-prod-grid">
      ${libraryProducts
        .map(
          (p) => `
        <article class="nb-prod-card">
          <div class="nb-prod-card__top">
            <h4 class="nb-prod-card__title">${escapeHtml(p.title)}</h4>
          </div>
          <div class="nb-prod-card__bottom">
            <div class="nb-prod-card__meta">
              <span class="nb-prod-card__badge">${escapeHtml(p.category || "ডিজিটাল")}</span>
              <span class="nb-prod-card__date">${formatBengaliDate(p.created_at)}</span>
            </div>
            <p class="nb-prod-card__desc">${escapeHtml(p.description || "ডিজিটাল প্রোডাক্ট সংগ্রহ করুন ও ডাউনলোড করুন।")}</p>
            <div class="nb-prod-card__actions">
              <a href="${escapeHtml(p.download_url || p.cover_image || "#")}" download target="_blank" rel="noopener" class="nb-btn-download">
                📥 ডাউনলোড
              </a>
              <a href="/products/${p.slug}/" class="nb-btn-save" title="বিস্তারিত">
                📖 পড়ুন
              </a>
            </div>
          </div>
        </article>
      `
        )
        .join("")}
    </div>
    `
        : `
    <div style="background:var(--bg2);border:1px dashed var(--bd);border-radius:14px;padding:48px 24px;text-align:center">
      <div style="font-size:48px;margin-bottom:12px">📚</div>
      <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">আপনার লাইব্রেরিতে এখনও কোনো আইটেম নেই</h3>
      <p style="color:var(--tx2);font-size:14px;margin-bottom:20px">ফ্রি বই ও রিসোর্সগুলো আপনার সংগ্রহে এক ক্লিকেই যুক্ত করতে পারেন।</p>
      <a href="/products/?price=free" class="bp">🎁 ফ্রি প্রোডাক্টগুলো দেখুন</a>
    </div>
    `
    }
    `
        : ""
    }

    <!-- TAB: USER ORDERS -->
    ${
      activeTab === "orders"
        ? `
    <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:24px;margin-top:20px">
      <h3 style="font-size:18px;font-weight:700;margin:0 0 16px">আপনার অর্ডারসমূহ (${userOrders.length})</h3>
      ${
        userOrders.length > 0
          ? `
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
          <thead>
            <tr style="border-bottom:1px solid var(--bd);color:var(--tx3)">
              <th style="padding:10px">অর্ডার ID</th>
              <th style="padding:10px">তারিখ</th>
              <th style="padding:10px">পেমেন্ট মাধ্যম</th>
              <th style="padding:10px">মোট টাকা</th>
              <th style="padding:10px">স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            ${userOrders
              .map(
                (o) => `
              <tr style="border-bottom:1px solid var(--bd)">
                <td style="padding:10px;font-family:var(--ff-mono);color:var(--ac);font-weight:600">${escapeHtml(o.order_id)}</td>
                <td style="padding:10px;font-size:12px;color:var(--tx3)">${escapeHtml(o.created_at || "")}</td>
                <td style="padding:10px;text-transform:uppercase">${escapeHtml(o.payment_method)}</td>
                <td style="padding:10px;font-weight:700;color:#16a34a">৳${o.total}</td>
                <td style="padding:10px"><span class="tg" style="border-color:#16a34a;color:#16a34a">${escapeHtml(o.status)}</span></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
      `
          : `<p style="color:var(--tx3);font-size:14px;margin:0">আপনার এখনও কোনো অর্ডারের রেকর্ড নেই।</p>`
      }
    </div>
    `
        : ""
    }

    <!-- TAB: ADMIN PRODUCTS MANAGEMENT -->
    ${
      activeTab === "admin-products" && user.role === "admin"
        ? `
    <div style="margin-top:10px">
      ${
        message
          ? `<div style="background:rgba(34,197,94,0.12);border:1px solid #16a34a;color:#16a34a;padding:12px 16px;border-radius:10px;margin-bottom:20px;font-weight:600">✓ ${escapeHtml(message)}</div>`
          : ""
      }
      ${
        error
          ? `<div style="background:rgba(239,68,68,0.12);border:1px solid #ef4444;color:#ef4444;padding:12px 16px;border-radius:10px;margin-bottom:20px;font-weight:600">⚠️ ${escapeHtml(error)}</div>`
          : ""
      }

      <div style="background:#12161f;border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:28px;box-shadow:0 8px 30px rgba(0,0,0,0.3);margin-bottom:32px">
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:20px;border-bottom:1px solid rgba(255,255,255,0.06);padding-bottom:16px">
          <div style="width:42px;height:42px;border-radius:10px;background:rgba(124,106,247,0.15);color:#7c6af7;display:flex;align-items:center;justify-content:center;font-size:22px">📦</div>
          <div>
            <h2 style="font-size:19px;font-weight:700;margin:0;color:#ffffff">নতুন ডিজিটাল প্রোডাক্ট যুক্ত করুন</h2>
            <p style="font-size:13px;color:#8b949e;margin:3px 0 0">প্রোডাক্টের নাম, ক্যাটাগরি, বিবরণী ও ডাউনলোড লিঙ্ক দিয়ে সহজেই পাবলিশ করুন</p>
          </div>
        </div>

        <form method="post" action="/admin/products/add" style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          
          <!-- ১। প্রোডাক্টের নাম -->
          <div style="grid-column: span 1">
            <label style="display:block;font-size:13.5px;font-weight:600;margin-bottom:8px;color:#cbd5e1">
              ১। প্রোডাক্টের নাম <span style="color:#ef4444">*</span>
            </label>
            <input type="text" name="title" required placeholder="উদা: আলাদা আকাশ বা পাইথন অটোমেশন গাইড" style="width:100%;box-sizing:border-box;padding:12px 14px;background:#0d1117;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#ffffff;font-size:14px">
          </div>

          <!-- ২। ক্যাটাগরি -->
          <div style="grid-column: span 1">
            <label style="display:block;font-size:13.5px;font-weight:600;margin-bottom:8px;color:#cbd5e1">
              ২। ক্যাটাগরি <span style="color:#ef4444">*</span>
            </label>
            <input type="text" name="category" required placeholder="উদা: কবিতা, ইবুক, প্লাগিন্স, টেমপ্লেট" value="কবিতা" style="width:100%;box-sizing:border-box;padding:12px 14px;background:#0d1117;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#ffffff;font-size:14px">
          </div>

          <!-- ৩। বিবরণী -->
          <div style="grid-column: span 2">
            <label style="display:block;font-size:13.5px;font-weight:600;margin-bottom:8px;color:#cbd5e1">
              ৩। বিবরণী <span style="color:#ef4444">*</span>
            </label>
            <textarea name="description" rows="3" required placeholder="প্রোডাক্টের সংক্ষিপ্ত বিবরণী লিখুন..." style="width:100%;box-sizing:border-box;padding:12px 14px;background:#0d1117;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#ffffff;font-size:14px;font-family:inherit;resize:vertical"></textarea>
          </div>

          <!-- ৪। ডাউনলোড লিঙ্ক -->
          <div style="grid-column: span 2">
            <label style="display:block;font-size:13.5px;font-weight:600;margin-bottom:8px;color:#cbd5e1">
              ৪। ডাউনলোড লিঙ্ক <span style="color:#ef4444">*</span>
            </label>
            <input type="url" name="download_url" required placeholder="https://drive.google.com/... বা ফাইলের ডাউনলোড লিঙ্ক" style="width:100%;box-sizing:border-box;padding:12px 14px;background:#0d1117;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#ffffff;font-size:14px">
          </div>

          <div style="grid-column: span 2;display:flex;justify-content:flex-end;margin-top:4px">
            <button type="submit" class="dash-btn-primary" style="padding:12px 28px;font-size:14px;font-weight:700;border:none;cursor:pointer;display:inline-flex;align-items:center;gap:8px">
              <span>➕ প্রোডাক্ট পাবলিশ করুন</span>
            </button>
          </div>
        </form>
      </div>

      <div style="margin-top:28px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
          <h3 style="font-size:18px;font-weight:700;margin:0;color:#ffffff">লাইভ ডিজিটাল প্রোডাক্টসমূহ (${allProducts.length}টি)</h3>
          <a href="/products/" target="_blank" class="dash-link">সব প্রোডাক্ট পেইজ দেখুন ↗</a>
        </div>
        <div class="nb-prod-grid">
          ${allProducts
            .map(
              (p) => `
            <div class="nb-prod-card">
              <div class="nb-prod-card__top">
                <h4 class="nb-prod-card__title">${escapeHtml(p.title)}</h4>
              </div>
              <div class="nb-prod-card__bottom">
                <div class="nb-prod-card__meta">
                  <span class="nb-prod-card__badge">${escapeHtml(p.category || "ডিজিটাল")}</span>
                  <span class="nb-prod-card__date">${formatBengaliDate(p.created_at)}</span>
                </div>
                <p class="nb-prod-card__desc">${escapeHtml(p.description || "ডিজিটাল প্রোডাক্ট")}</p>
                <div style="display:flex;gap:8px;align-items:center;margin-top:auto">
                  <a href="${escapeHtml(p.download_url || "#")}" download target="_blank" rel="noopener" class="nb-btn-download" style="font-size:12px;padding:7px 12px">
                    📥 ডাউনলোড
                  </a>
                  <form method="post" action="/admin/products/delete" onsubmit="return confirm('আপনি কি নিশ্চিত এই প্রোডাক্টটি মুছে ফেলতে চান?');" style="margin:0">
                    <input type="hidden" name="productId" value="${p.id}">
                    <button type="submit" style="padding:7px 12px;color:#ef4444;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.1);border-radius:8px;font-size:12px;font-weight:600;cursor:pointer">
                      🗑️ মুছুন
                    </button>
                  </form>
                </div>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- TAB: ADMIN ANALYTICS -->
    ${
      activeTab === "admin" && user.role === "admin"
        ? `
    <div style="margin-top:20px">
      <div class="dash-stats-grid">
        <div class="dash-stat-card">
          <div class="dash-stat-left">
            <div class="dash-stat-num">${allOrders.length}</div>
            <div class="dash-stat-lbl">মোট অর্ডার</div>
          </div>
          <div class="dash-stat-icon-wrap" style="background:rgba(124,106,247,.15);color:#7c6af7">📦</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-left">
            <div class="dash-stat-num" style="color:#16a34a">৳${totalRevenue.toLocaleString()}</div>
            <div class="dash-stat-lbl">মোট রেভিনিউ</div>
          </div>
          <div class="dash-stat-icon-wrap" style="background:rgba(34,197,94,.15);color:#16a34a">💰</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-left">
            <div class="dash-stat-num">${allLeads.length}</div>
            <div class="dash-stat-lbl">CRM লিডস</div>
          </div>
          <div class="dash-stat-icon-wrap" style="background:rgba(14,165,233,.15);color:#0ea5e9">📬</div>
        </div>
        <div class="dash-stat-card">
          <div class="dash-stat-left">
            <div class="dash-stat-num">${allOrders.length}</div>
            <div class="dash-stat-lbl">সফল অর্ডার</div>
          </div>
          <div class="dash-stat-icon-wrap" style="background:rgba(234,88,12,.15);color:#ea580c">📦</div>
        </div>
      </div>

      <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:24px;margin-top:24px">
        <h3 style="font-size:18px;font-weight:700;margin:0 0 16px">সাম্প্রতিক গ্রাহক অর্ডারসমূহ</h3>
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
            <thead>
              <tr style="border-bottom:1px solid var(--bd);color:var(--tx3)">
                <th style="padding:10px">ID</th>
                <th style="padding:10px">গ্রাহকের নাম ও ইমেইল</th>
                <th style="padding:10px">পেমেন্ট</th>
                <th style="padding:10px">TrxID</th>
                <th style="padding:10px">মোট</th>
                <th style="padding:10px">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              ${allOrders
                .slice(0, 10)
                .map(
                  (o) => `
                <tr style="border-bottom:1px solid var(--bd)">
                  <td style="padding:10px;font-family:var(--ff-mono);color:var(--ac);font-weight:600">${escapeHtml(o.order_id)}</td>
                  <td style="padding:10px">
                    <b>${escapeHtml(o.customer_name)}</b><br>
                    <span style="font-size:12px;color:var(--tx3)">${escapeHtml(o.customer_email)} · ${escapeHtml(o.customer_phone)}</span>
                  </td>
                  <td style="padding:10px;text-transform:uppercase">${escapeHtml(o.payment_method)}</td>
                  <td style="padding:10px;font-family:var(--ff-mono);font-size:12px">${escapeHtml(o.transaction_id || "-")}</td>
                  <td style="padding:10px;font-weight:700;color:#16a34a">৳${o.total}</td>
                  <td style="padding:10px"><span class="tg" style="border-color:#16a34a;color:#16a34a">${escapeHtml(o.status)}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    `
        : ""
    }

    <!-- TAB: ADMIN LEADS -->
    ${
      activeTab === "admin-leads" && user.role === "admin"
        ? `
    <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:24px;margin-top:20px">
      <h3 style="font-size:18px;font-weight:700;margin:0 0 16px">গ্রাহক অনুসন্ধান ও মেসেজ (${allLeads.length})</h3>
      <div style="overflow-x:auto">
        <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
          <thead>
            <tr style="border-bottom:1px solid var(--bd);color:var(--tx3)">
              <th style="padding:10px">তারিখ</th>
              <th style="padding:10px">নাম</th>
              <th style="padding:10px">ইমেইল</th>
              <th style="padding:10px">প্যাকেজ</th>
              <th style="padding:10px">বার্তা</th>
            </tr>
          </thead>
          <tbody>
            ${allLeads
              .map(
                (l) => `
              <tr style="border-bottom:1px solid var(--bd)">
                <td style="padding:10px;font-size:12px;color:var(--tx3)">${escapeHtml(l.created_at || "")}</td>
                <td style="padding:10px;font-weight:600">${escapeHtml(l.name)}</td>
                <td style="padding:10px;font-family:var(--ff-mono);font-size:13px">${escapeHtml(l.email)}</td>
                <td style="padding:10px"><span class="tg">${escapeHtml(l.package || "General")}</span></td>
                <td style="padding:10px;max-width:300px">${escapeHtml(l.message)}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </div>
    `
        : ""
    }

  </main>
</div>

<style>
/* Dashboard Layout Styling precisely matched to User Screenshot */
.dash-shell {
  display: flex;
  min-height: 100vh;
  background-color: #0b0e14;
  color: #e6edf3;
  font-family: 'Hind Siliguri', 'Space Grotesk', sans-serif;
}

/* Sidebar */
.dash-sidebar {
  width: 240px;
  background-color: #0f131a;
  border-right: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  padding: 20px 16px;
}

.dash-brand-box {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 20px;
}

.dash-logo-badge {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c6af7, #2dd4bf);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 14px rgba(124,106,247,0.35);
}

.dash-brand-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.3px;
  color: #ffffff;
}

.dash-brand-sub {
  font-size: 11px;
  color: #8b949e;
}

.dash-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.dash-nav-group-title {
  font-size: 11px;
  text-transform: uppercase;
  color: #6e7681;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 4px 10px;
}

.dash-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  color: #c9d1d9;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;
}

.dash-nav-item:hover {
  background-color: rgba(255,255,255,0.05);
  color: #ffffff;
}

.dash-nav-item.is-active {
  background-color: #1e2238;
  color: #ffffff;
  font-weight: 600;
}

.dash-nav-icon {
  font-size: 16px;
}

.dash-nav-pill {
  margin-left: auto;
  font-size: 11px;
  font-weight: 700;
  background: #232742;
  color: #a78bfa;
  padding: 2px 7px;
  border-radius: 12px;
}

.dash-sidebar-foot {
  padding-top: 16px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Main Content Area */
.dash-main {
  flex: 1;
  padding: 24px 32px 60px;
  overflow-y: auto;
}

/* Topbar */
.dash-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dash-top-heading {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #ffffff;
}

.dash-topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dash-lang-pill {
  background: #161b22;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 3px 6px;
  display: flex;
  gap: 4px;
  font-size: 12px;
}

.dash-lang-pill span {
  padding: 3px 8px;
  border-radius: 14px;
  cursor: pointer;
  color: #8b949e;
}

.dash-lang-pill span.is-active {
  background: #238636;
  color: #ffffff;
  font-weight: 700;
}

.dash-circle-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #161b22;
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9d1d9;
  cursor: pointer;
  text-decoration: none;
}

.dash-user-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #161b22;
  border: 1px solid rgba(255,255,255,0.1);
  padding: 4px 12px 4px 5px;
  border-radius: 20px;
}

.dash-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c6af7, #ec4899);
  color: #ffffff;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Promo Banner */
.dash-promo-banner {
  background: linear-gradient(100deg, #5b21b6 0%, #7c3aed 50%, #db2777 100%);
  border-radius: 14px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
  box-shadow: 0 10px 30px rgba(91,33,182,0.3);
}

.dash-promo-content {
  flex: 1;
}

.dash-promo-badge {
  display: inline-block;
  background: rgba(0,0,0,0.3);
  color: #fde047;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  margin-bottom: 8px;
}

.dash-promo-title {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 6px;
}

.dash-promo-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.9);
  margin: 0;
  line-height: 1.5;
}

.dash-promo-thumb {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.dash-promo-btn {
  background: #ffffff;
  color: #5b21b6;
  font-weight: 700;
  font-size: 12px;
  padding: 6px 14px;
  border-radius: 20px;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* Greeting */
.dash-greet-box {
  margin-bottom: 20px;
}

.dash-greet-title {
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px;
}

.dash-greet-sub {
  font-size: 14px;
  color: #8b949e;
  margin: 0;
}

/* 4 Metric Stats */
.dash-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.dash-stat-card {
  background: #12161f;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dash-stat-num {
  font-size: 26px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.1;
}

.dash-stat-lbl {
  font-size: 12px;
  color: #8b949e;
  margin-top: 4px;
}

.dash-stat-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* Section Head */
.dash-section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.dash-link {
  color: #a78bfa;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

/* Library Grid */
.dash-lib-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
}

.dash-product-card {
  background: #12161f;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.dash-product-card:hover {
  transform: translateY(-3px);
  border-color: rgba(124,106,247,0.4);
}

.dash-prod-media {
  position: relative;
  width: 100%;
  height: 140px;
  background: #161b22;
}

.dash-prod-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dash-prod-tag {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(4px);
  color: #ffffff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 6px;
}

.dash-prod-body {
  padding: 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.dash-prod-title {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 14px;
  line-height: 1.4;
  flex: 1;
}

.dash-prod-actions {
  display: flex;
  gap: 8px;
}

.dash-btn-primary {
  flex: 1;
  background: #7c6af7;
  color: #ffffff;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  transition: background 0.15s;
}

.dash-btn-primary:hover {
  background: #6a57e3;
}

.dash-btn-outline {
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  color: #c9d1d9;
  padding: 7px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 900px) {
  .dash-shell {
    flex-direction: column;
  }
  .dash-sidebar {
    width: 100%;
  }
  .dash-stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
