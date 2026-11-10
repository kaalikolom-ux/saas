import { User } from "../types";

export interface LayoutProps {
  title?: string;
  description?: string;
  canonical?: string;
  activeNav?: string;
  user?: User | null;
  content: string;
}

export function layout({
  title = "notabene.saas — ডিজিটাল প্রোডাক্ট, ইবুক ও প্লাগিন্স প্ল্যাটফর্ম",
  description = "notabene.saas — সেরা ডিজিটাল প্রোডাক্ট, প্রোগ্রামিং ইবুক, অটোমেশন প্লাগিন্স ও ডেভেলপার রিসোর্স। বিনামূল্যে সংগ্রহ করুন অথবা কিনে নিন।",
  canonical = "https://saas.notabeneinc.workers.dev/",
  activeNav = "",
  user = null,
  content,
}: LayoutProps): string {
  return `<!DOCTYPE html>
<html lang="bn" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script>
  (function(){try{var t=localStorage.getItem('theme');if(!t){t='dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();
  </script>
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${escapeHtml(canonical)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${escapeHtml(canonical)}">
  <meta name="twitter:card" content="summary_large_image">
  
  <link rel="stylesheet" href="/static/css/main.css?v=1794073230">
  <link rel="stylesheet" href="/static/css/pp_spinner.css?v=1791912745">
  <link rel="stylesheet" href="/static/css/product_premium.css?v=1794072261">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Hind+Siliguri:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script src="https://unpkg.com/htmx.org@1.9.12" defer></script>
  <style>
    /* notabene.saas text logo styling */
    .brand-text-logo {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      color: var(--tx);
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .brand-badge-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c6af7, #2dd4bf);
      box-shadow: 0 0 10px rgba(124,106,247,0.6);
      display: inline-block;
    }
    .brand-accent {
      color: #7c6af7;
    }
  </style>
</head>
<body>

  <!-- Header -->
  <header class="hdr">
    <div class="hwrap">
      <a href="/" class="brand-text-logo">
        <span class="brand-badge-dot"></span>
        <span>notabene<span class="brand-accent">.saas</span></span>
      </a>
      <nav class="nav">
        <a href="/products/" class="nl ${activeNav === 'products' ? 'active' : ''}">ডিজিটাল প্রোডাক্ট</a>
        <a href="/products/?price=free" class="nl ${activeNav === 'free' ? 'active' : ''}">🎁 ফ্রি সংগ্রহ</a>
        <a href="/courses/" class="nl ${activeNav === 'courses' ? 'active' : ''}">কোর্স ও ট্রেনিং</a>
        <a href="/projects/" class="nl ${activeNav === 'projects' ? 'active' : ''}">প্রজেক্টস</a>
        <a href="/blog/" class="nl ${activeNav === 'blog' ? 'active' : ''}">ব্লগ</a>
        <a href="/dashboard/" class="nl ${activeNav === 'dashboard' ? 'active' : ''}">
          📚 লাইব্রেরি
        </a>
      </nav>
      <div class="hact">
        <button class="tht" id="themeToggle" aria-label="Toggle theme" title="Toggle theme">
          <svg class="ti" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </button>

        ${
          user
            ? `
          <a href="/dashboard/" class="hb" style="padding:7px 14px;display:inline-flex;align-items:center;gap:6px">
            <span>👤 ${escapeHtml(user.name.split(" ")[0])}</span>
          </a>
          <a href="/auth/logout" class="bs" style="padding:7px 12px;font-size:13px" title="লগআউট">লগআউট</a>
        `
            : `
          <a href="/auth/login" class="hb" style="padding:7px 16px">লগইন</a>
        `
        }

        <button class="mb" id="menuToggle" aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>

  <!-- Mobile Navigation -->
  <div class="mnav" id="mobNav">
    <div class="mnavi">
      <a href="/products/" class="mnl">ডিজিটাল প্রোডাক্ট</a>
      <a href="/products/?price=free" class="mnl">🎁 ফ্রি প্রোডাক্ট</a>
      <a href="/courses/" class="mnl">কোর্স ও ট্রেনিং</a>
      <a href="/projects/" class="mnl">প্রজেক্টস</a>
      <a href="/blog/" class="mnl">ব্লগ</a>
      <a href="/dashboard/" class="mnl">📚 লাইব্রেরি</a>
      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--bd)">
        ${
          user
            ? `<div style="margin-bottom:10px;font-weight:600">👤 ${escapeHtml(user.name)}</div>
               <a href="/auth/logout" class="bs" style="display:block;text-align:center">লগআউট</a>`
            : `<a href="/auth/login" class="hb" style="display:block;text-align:center">লগইন করুন</a>`
        }
      </div>
    </div>
  </div>

  <!-- Main Content -->
  <main>
    ${content}
  </main>

  <!-- Footer -->
  <footer class="ft">
    <div class="container">
      <div class="ftg">
        <div class="ftb">
          <a href="/" class="brand-text-logo" style="margin-bottom:12px;display:inline-flex">
            <span class="brand-badge-dot"></span>
            <span>notabene<span class="brand-accent">.saas</span></span>
          </a>
          <p class="ftd">ডিজিটাল প্রোডাক্ট, প্রোগ্রামিং ইবুক, অটোমেশন প্লাগিন্স ও ডেভেলপার রিসোর্সের বিশ্বস্ত প্ল্যাটফর্ম। যখন খুশি পড়ুন, সেভ করে রাখুন এবং নিজের প্রজেক্টে ব্যবহার করুন।</p>
          <div class="fts">
            <a href="https://github.com/kaalikolom-ux/saas" target="_blank" rel="noopener" class="si" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a href="mailto:notabene.inc@gmail.com" class="si" aria-label="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </a>
            <a href="https://wa.me/8801711583165" target="_blank" rel="noopener" class="si" aria-label="WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>
        <div class="ftcol">
          <div class="fth">ডিজিটাল প্রোডাক্ট</div>
          <a href="/products/" class="ftl">সকল প্রোডাক্ট</a>
          <a href="/products/?price=free" class="ftl">ফ্রি রিসোর্স ও গাইড</a>
          <a href="/products/git-o-github/" class="ftl">Git ও GitHub ইবুক</a>
          <a href="/products/jadur-shohor-js/" class="ftl">জাদুর শহর JS</a>
          <a href="/products/database-gochano/" class="ftl">ডেটাবেজ গোছানো</a>
        </div>
        <div class="ftcol">
          <div class="fth">লার্নিং ও কোডিং</div>
          <a href="/courses/" class="ftl">লাইভ মাস্টারক্লাস</a>
          <a href="/projects/" class="ftl">ওপেনসোর্স প্রজেক্ট</a>
          <a href="/blog/" class="ftl">টেক ব্লগ ও টিপস</a>
          <a href="/services/pricing/" class="ftl">কাস্টম ডেভেলপমেন্ট</a>
        </div>
        <div class="ftcol">
          <div class="fth">অ্যাকাউন্ট</div>
          <a href="/dashboard/" class="ftl">আমার লাইব্রেরি</a>
          <a href="/auth/login" class="ftl">লগইন / সাইনআপ</a>
          <a href="/dashboard/?tab=orders" class="ftl">অর্ডার ইতিহাস</a>
          <a href="/#contact" class="ftl">হেল্প ও সাপোর্ট</a>
        </div>
      </div>
      <div class="ftcp">
        <div>© 2026 notabene.saas. All rights reserved. Powered by Cloudflare D1.</div>
        <div style="display:flex;gap:16px">
          <a href="/dashboard/" class="ftl" style="margin:0">লাইব্রেরি</a>
          <a href="/products/?price=free" class="ftl" style="margin:0">ফ্রি নিন</a>
          <a href="/#contact" class="ftl" style="margin:0">সাপোর্ট</a>
        </div>
      </div>
    </div>
  </footer>

  <!-- Floating Action Buttons -->
  <div class="fab-stack" id="fabStack">
    <a href="https://wa.me/8801711583165" target="_blank" rel="noopener" class="fab fab--wa" aria-label="Chat on WhatsApp" title="WhatsApp Chat">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </a>
    <button type="button" class="sctop" id="sctop" aria-label="Scroll to top" title="Scroll to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
    </button>
  </div>

  <!-- Spinner Floating Pill Button -->
  <button type="button" class="pps-pill" id="ppsPill" aria-haspopup="dialog" aria-controls="ppsDlg" aria-label="ছাড়ের চাকা খোলো">
    <span class="pps-pill__sparkle" aria-hidden="true">🎉</span>
    <span class="pps-pill__txt" data-pps-pill-label>স্পিন করে ছাড় নাও</span>
    <span class="pps-pill__timer" data-pps-pill-timer><svg class="pp-ic" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><b data-pps-clock>--:--:--</b></span>
  </button>

  <!-- Spinner Dialog Modal -->
  <dialog class="pps-dlg" id="ppsDlg" aria-labelledby="ppsTitle">
    <div class="pps-sheet">
      <button type="button" class="pps-close" data-pps-close aria-label="বন্ধ করো">
        <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <div class="pps-step" data-pps-step="wheel">
        <p class="pp-kicker">ভাগ্যের চাকা</p>
        <h2 class="pp-h2 pps-h" id="ppsTitle" data-pps-heading>চাকা ঘোরাও, ছাড় জেতো</h2>
        <p class="pps-sub" data-pps-subheading>একাধিক বই একসাথে নাও, চেকআউটে ছাড় নিজে থেকেই কেটে যাবে।</p>
        <p class="pps-timer" data-pps-timer><svg class="pp-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>অফার শেষ হবে</span> <b data-pps-clock>--:--:--</b></p>
        <div class="pps-wheel">
          <svg class="pps-pointer" viewBox="0 0 40 44" aria-hidden="true"><path d="M20 42 4 8a16 16 0 1 1 32 0Z"/></svg>
          <svg class="pps-disc" viewBox="-110 -110 220 220" role="img" aria-label="ছাড়ের চাকা"><g data-pps-rot></g></svg>
          <button type="button" class="pps-go" data-pps-go>ঘোরাও</button>
        </div>
        <p class="pps-hint">চাকাটা টেনে ছেড়ে দিলেও ঘুরবে</p>
      </div>

      <div class="pps-step" data-pps-step="result" hidden>
        <canvas class="pps-confetti" aria-hidden="true"></canvas>
        <p class="pp-kicker" data-pps-kicker>অভিনন্দন!</p>
        <h2 class="pp-h2 pps-h" data-pps-won tabindex="-1"></h2>
        <p class="pps-sub" data-pps-explain></p>
        <div class="pps-picks" data-pps-picks hidden>
          <p class="pps-picks__h" data-pps-picks-h>যেকোনো ২টি বা বেশি বেছে নাও</p>
          <ul class="pps-list" data-pps-list></ul>
          <dl class="pps-sum" data-pps-sum aria-live="polite">
            <div><dt>মোট দাম <span data-pps-count></span></dt><dd data-pps-subtotal></dd></div>
            <div class="pps-sum__off"><dt>স্পিনের ছাড় <span data-pps-pct></span></dt><dd data-pps-off></dd></div>
            <div class="pps-sum__total"><dt>তুমি দেবে</dt><dd data-pps-total></dd></div>
            <p class="pps-sum__save" data-pps-save></p>
          </dl>
          <button type="button" class="pp-btn pp-btn--primary pp-btn--lg pp-btn--block" data-pps-buy disabled>
            <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg><span data-pps-buylabel>এই ছাড়ে কিনে ফেলো</span>
          </button>
        </div>
        <a class="pp-btn pp-btn--ghost pp-btn--block pps-soft" data-pps-soft href="/products/" hidden>প্রোডাক্টগুলো দেখো</a>
      </div>

      <p class="pps-err" role="alert" data-pps-err hidden>এই মুহূর্তে চাকা ঘোরানো যাচ্ছে না — একটু পরে আবার চেষ্টা করো।</p>
    </div>
  </dialog>

  <!-- Global scripts setup -->
  <script>
  window.BUNDLE_CHECKOUT_URL = "/payments/checkout/bundle/";
  window.ITEM_CHECKOUT_URL = "/payments/checkout/ITEM_TYPE/ITEM_SLUG/";
  window.SHOP_URL = "/products/";
  window.PPS = {
    data: "/offers/popup-data/",
    spin: "/offers/spin/",
    dismiss: "/offers/dismiss/",
    auto: true,
    soon: false
  };
  </script>

  <script src="/static/js/pp_spinner.js?v=1794072261" defer></script>
  <script src="/static/js/bundle.js?v=1794077047" defer></script>
  <script src="/static/js/main.js?v=1783192237" defer></script>

  <script>
  // Mobile navigation and scroll top handling
  document.addEventListener('DOMContentLoaded', function() {
    var mt = document.getElementById('menuToggle');
    var mn = document.getElementById('mobNav');
    if (mt && mn) {
      mt.addEventListener('click', function() {
        mn.classList.toggle('is-open');
      });
    }
    var st = document.getElementById('sctop');
    if (st) {
      window.addEventListener('scroll', function() {
        if (window.scrollY > 300) st.classList.add('is-visible');
        else st.classList.remove('is-visible');
      });
      st.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
