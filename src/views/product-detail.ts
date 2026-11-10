import { Product, User } from "../types";

export interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
  user?: User | null;
  isSaved?: boolean;
}

export function productDetailView({ product, relatedProducts, user = null, isSaved = false }: ProductDetailProps): string {
  const discountPct =
    product.price > product.discounted_price
      ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
      : 0;

  return `
<script>document.documentElement.classList.add('pp-js');</script>
<div class="pp-premium" id="pp">

  <!-- BREADCRUMBS -->
  <div class="pp-wrap" style="padding-top:24px;padding-bottom:12px">
    <nav style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--tx3)">
      <a href="/" style="color:var(--tx2);text-decoration:none">হোম</a>
      <span>/</span>
      <a href="/products/" style="color:var(--tx2);text-decoration:none">ডিজিটাল প্রোডাক্ট</a>
      <span>/</span>
      <span style="color:var(--tx)">${escapeHtml(product.title)}</span>
    </nav>
  </div>

  <!-- HERO SECTION -->
  <section class="pp-hero" aria-labelledby="pp-title">
    <div class="pp-wrap pp-hero__grid">
      
      <div class="pp-hero__cover">
        <div class="pp-book">
          <div class="pp-book__3d">
            <img class="pp-book__img" src="${product.cover_image}" alt="${escapeHtml(product.title)}"
                 width="600" height="849" fetchpriority="high" decoding="async">
          </div>
        </div>
      </div>

      <div class="pp-hero__content">
        <div class="pp-badge-row">
          <span class="pp-badge">${product.badge || (product.discounted_price === 0 ? "ফ্রি রিসোর্স" : "ডিজিটাল প্রোডাক্ট")}</span>
          ${discountPct > 0 ? `<span class="pp-badge pp-badge--hot">🔥 ${discountPct}% বিশেষ ছাড়</span>` : ""}
          <span class="pp-badge" style="background:rgba(34,197,94,.1);color:#16a34a">⭐⭐⭐⭐⭐ ৪.৯ (রেটিং)</span>
        </div>

        <h1 class="pp-h1" id="pp-title">${escapeHtml(product.title)}</h1>
        <p class="pp-lede">${escapeHtml(product.description || "")}</p>

        <div class="pp-price-box">
          <div class="pp-price">
            ${
              product.discounted_price === 0
                ? `<span class="pp-price__cur">ফ্রি</span>`
                : `<span class="pp-price__cur">৳${product.discounted_price}</span>`
            }
            ${
              product.price > product.discounted_price
                ? `<span class="pp-price__was">৳${product.price}</span>`
                : ""
            }
          </div>
          ${
            product.price > product.discounted_price
              ? `<p class="pp-save">আজই অর্ডার করলে সরাসরি বাঁচাচ্ছেন ৳${product.price - product.discounted_price} টাকা!</p>`
              : ""
          }
        </div>

        <div class="pp-actions" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin:24px 0">
          ${
            product.discounted_price === 0
              ? `
            <form method="post" action="/api/library/add" style="margin:0">
              <input type="hidden" name="product_id" value="${product.id}">
              <button type="submit" class="pp-btn pp-btn--primary pp-btn--lg" style="display:inline-flex;align-items:center;gap:10px">
                <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                ${isSaved ? "✓ আপনার লাইব্রেরিতে সেভ করা (ড্যাশবোর্ডে দেখুন)" : "📥 লাইব্রেরিতে সেভ করুন ও ডাউনলোড নিন"}
              </button>
            </form>
            <a href="${product.cover_image}" download class="pp-btn pp-btn--ghost pp-btn--lg">
              সরাসরি ফাইল ডাউনলোড
            </a>
          `
              : `
            <a href="/payments/checkout/product/${product.slug}/" class="pp-btn pp-btn--primary pp-btn--lg" style="display:inline-flex;align-items:center;gap:10px">
              <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              এখনই কিনুন (৳${product.discounted_price})
            </a>

            <label class="bundle-toggle" data-bundle-toggle data-item-type="product"
                   data-item-slug="${product.slug}" data-item-title="${escapeHtml(product.title)}"
                   data-item-price="${product.discounted_price}"
                   style="position:relative;top:auto;right:auto;width:44px;height:44px"
                   data-tooltip="বান্ডেল কার্টে যোগ করো">
              <input type="checkbox" aria-label="কার্টে যোগ করো">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </label>
          `
          }
        </div>

        <ul class="pp-perks" style="list-style:none;padding:0;margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px">
          <li style="display:flex;align-items:center;gap:8px">✅ ইনস্ট্যান্ট অ্যাক্সেস ও আজীবন ডাউনলোড</li>
          <li style="display:flex;align-items:center;gap:8px">✅ মোবাইল ও ট্যাবলেটে পড়ার উপযোগী PDF</li>
          <li style="display:flex;align-items:center;gap:8px">✅ রিয়েল কোড ও প্র্যাকটিক্যাল এক্সাম্পল</li>
          <li style="display:flex;align-items:center;gap:8px">✅ বিকাশ, নগদ ও রকেটে সহজ পেমেন্ট</li>
        </ul>

      </div>
    </div>
  </section>

  <!-- HIGHLIGHTS / WHAT YOU GET -->
  <section class="pp-section" style="padding:60px 0;border-top:1px solid var(--bd);background:var(--bg2)">
    <div class="pp-wrap">
      <div style="text-align:center;max-width:600px;margin:0 auto 40px">
        <p class="pp-kicker">প্রোডাক্টের বৈশিষ্ট্য</p>
        <h2 class="pp-h2">মুখস্থ নয়, সরাসরি কাজের উপযোগী দক্ষতা</h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">🎯</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">বাস্তব প্রজেক্ট কোড</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">প্রতিটি বিষয়ের সাথে রয়েছে সরাসরি প্রজেক্টে ব্যবহারের মতো কোড ও টিপস, যা প্রোডাকশন সিস্টেমে কাজ করে।</p>
        </div>
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">💾</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">ব্যক্তিগত লাইব্রেরি সিঙ্ক</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">আপনার অ্যাকাউন্টে যুক্ত থাকা প্রতিটি বই ও প্লাগিন্স যেকোনো সময় লাইব্রেরি ড্যাশবোর্ড থেকে ডাউনলোড করা যাবে।</p>
        </div>
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">🚀</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">দ্রুত শেখার গ্যারান্টি</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">সহজ বাংলায় ধাপে ধাপে জটিল অ্যালগরিদম ও টুলস ব্যাখ্যা করা, যাতে নতুনদের জন্যও বুঝতে কোনো কষ্ট না হয়।</p>
        </div>
      </div>
    </div>
  </section>

  <!-- RELATED PRODUCTS -->
  ${
    relatedProducts.length > 0
      ? `
  <section class="pp-section" style="padding:60px 0;border-top:1px solid var(--bd)">
    <div class="pp-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">
        <h2 class="pp-h2" style="margin:0">সম্পর্কিত অন্যান্য প্রোডাক্ট</h2>
        <a href="/products/" style="color:var(--ac);text-decoration:none;font-weight:600;font-size:14px">সবগুলো দেখুন →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px">
        ${relatedProducts
          .slice(0, 3)
          .map(
            (rp) => `
          <a href="/products/${rp.slug}/" style="display:block;background:var(--bg2);border:1px solid var(--bd);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit">
            <img src="${rp.cover_image}" alt="${escapeHtml(rp.title)}" style="width:100%;height:160px;object-fit:cover">
            <div style="padding:16px">
              <h4 style="font-size:16px;font-weight:600;margin-bottom:8px">${escapeHtml(rp.title)}</h4>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-weight:700;color:var(--ac)">${rp.discounted_price === 0 ? "ফ্রি" : `৳${rp.discounted_price}`}</span>
                <span style="font-size:13px;color:var(--tx3)">বিস্তারিত →</span>
              </div>
            </div>
          </a>
        `
          )
          .join("")}
      </div>
    </div>
  </section>
  `
      : ""
  }

</div>
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
