import { Product } from "../types";

export interface ProductDetailProps {
  product: Product;
  relatedProducts: Product[];
}

export function productDetailView({ product, relatedProducts }: ProductDetailProps): string {
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
          <span class="pp-badge">${product.badge || "ইবুক / গাইড"}</span>
          ${discountPct > 0 ? `<span class="pp-badge pp-badge--hot">🔥 ${discountPct}% বিশেষ ছাড়</span>` : ""}
          <span class="pp-badge" style="background:rgba(34,197,94,.1);color:#16a34a">⭐⭐⭐⭐⭐ ৪.৯ (১৮+ রিভিউ)</span>
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
              ? `<p class="pp-save">আজই কিনলে তুমি সরাসরি বাঁচাচ্ছ ৳${product.price - product.discounted_price} টাকা!</p>`
              : ""
          }
        </div>

        <div class="pp-actions" style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin:24px 0">
          <a href="/payments/checkout/product/${product.slug}/" class="pp-btn pp-btn--primary pp-btn--lg" style="display:inline-flex;align-items:center;gap:10px">
            <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            ${product.discounted_price === 0 ? "ফ্রি ডাউনলোড নাও" : "সরাসরি কিনে ফেলো"}
          </a>

          <label class="bundle-toggle" data-bundle-toggle data-item-type="product"
                 data-item-slug="${product.slug}" data-item-title="${escapeHtml(product.title)}"
                 data-item-price="${product.discounted_price}"
                 style="position:relative;top:auto;right:auto;width:44px;height:44px"
                 data-tooltip="বান্ডেল কার্টে যোগ করো">
            <input type="checkbox" aria-label="কার্টে যোগ করো">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          </label>
        </div>

        <ul class="pp-perks" style="list-style:none;padding:0;margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px">
          <li style="display:flex;align-items:center;gap:8px">✅ ইনস্ট্যান্ট অ্যাক্সেস ও আজীবন ডাউনলোড</li>
          <li style="display:flex;align-items:center;gap:8px">✅ মোবাইল ও ট্যাবলেটে পড়ার উপযোগী PDF</li>
          <li style="display:flex;align-items:center;gap:8px">✅ বাস্তব প্রজেক্ট ও রিয়েল কোড এক্সাম্পল</li>
          <li style="display:flex;align-items:center;gap:8px">✅ বিকাশ, নগদ ও রকেটে সহজ পেমেন্ট</li>
        </ul>

      </div>
    </div>
  </section>

  <!-- HIGHLIGHTS / WHAT YOU GET -->
  <section class="pp-section" style="padding:60px 0;border-top:1px solid var(--bd);background:var(--bg2)">
    <div class="pp-wrap">
      <div style="text-align:center;max-width:600px;margin:0 auto 40px">
        <p class="pp-kicker">বইয়ের ভেতরে যা যা পাবে</p>
        <h2 class="pp-h2">মুখস্থ নয়, সরাসরি হাতে-কলমে শেখা</h2>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px">
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">🎯</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">১০০% বাস্তব উদাহরণ</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">বইয়ের প্রতিটি কনসেপ্টের সাথে রয়েছে রিয়েল ওয়ার্ল্ড প্রজেক্ট সিনারিও, যাতে বোঝার সাথে সাথেই নিজে নিজে কোড করতে পারো।</p>
        </div>
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">🛠️</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">ভুল শোধরানোর টেকনিক</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">কাজ করতে গিয়ে কী কী এরর হয়, কেন হয়, আর কীভাবে মাথা ঠান্ডা রেখে নিজেই সমাধান করবে তা বিস্তারিত বোঝানো হয়েছে।</p>
        </div>
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:24px">
          <div style="font-size:28px;margin-bottom:12px">👥</div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px">টিমে কাজের আসল নিয়ম</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6">একা কাজ করা আর আন্তর্জাতিক সফটওয়্যার টিমে কাজ করার মধ্যে বিশাল পার্থক্য। কীভাবে সিনিয়রদের মতো কাজ করবে তা আলোচনা করা হয়েছে।</p>
        </div>
      </div>
    </div>
  </section>

  <!-- AUTHOR SECTION -->
  <section class="pp-section" style="padding:60px 0;border-top:1px solid var(--bd)">
    <div class="pp-wrap" style="max-width:800px">
      <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
        <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--ac),#372e6b);display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:700">
          IS
        </div>
        <div style="flex:1">
          <p class="pp-kicker" style="margin:0">লেখক ও মেন্টর</p>
          <h3 style="font-size:22px;font-weight:700;margin:4px 0">ইফতে সামুল ওহী</h3>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6;margin:0">
            সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার ও এআই অটোমেশন বিশেষজ্ঞ। ৪+ বছরের ইন্ডাস্ট্রি অভিজ্ঞতায় Django, Python, HTMX, এবং Cloudflare ইকোসিস্টেমে অসংখ্য জটিল সফটওয়্যার ও অটোমেশন সিস্টেম তৈরি করেছেন।
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- RELATED PRODUCTS -->
  ${
    relatedProducts.length > 0
      ? `
  <section class="pp-section" style="padding:60px 0;border-top:1px solid var(--bd);background:var(--bg2)">
    <div class="pp-wrap">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px">
        <h2 class="pp-h2" style="margin:0">আরও দরকারী বই ও রিসোর্স</h2>
        <a href="/products/" style="color:var(--ac);text-decoration:none;font-weight:600;font-size:14px">সবগুলো দেখো →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px">
        ${relatedProducts
          .slice(0, 3)
          .map(
            (rp) => `
          <a href="/products/${rp.slug}/" style="display:block;background:var(--bg);border:1px solid var(--bd);border-radius:12px;overflow:hidden;text-decoration:none;color:inherit">
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
