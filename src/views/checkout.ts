export interface CheckoutItem {
  type: "product" | "course";
  slug: string;
  title: string;
  price: number;
  discounted_price: number;
  cover_image: string;
}

export interface CheckoutViewProps {
  items: CheckoutItem[];
  spinDiscountPercent?: number;
}

export function checkoutView({ items, spinDiscountPercent = 0 }: CheckoutViewProps): string {
  if (items.length === 0) {
    return `
    <div class="container" style="padding:80px 20px;text-align:center">
      <div style="font-size:48px;margin-bottom:16px">🛒</div>
      <h1 style="font-size:26px;font-weight:700;margin-bottom:12px">তোমার কার্ট খালি</h1>
      <p style="color:var(--tx2);margin-bottom:24px">কার্টে কোনো প্রোডাক্ট বা বই পাওয়া যায়নি।</p>
      <a href="/products/" class="bp">প্রোডাক্টগুলো দেখো →</a>
    </div>
    `;
  }

  const subtotal = items.reduce((sum, item) => sum + item.discounted_price, 0);
  const spinDiscountAmount = spinDiscountPercent > 0 ? Math.round((subtotal * spinDiscountPercent) / 100) : 0;
  const finalTotal = Math.max(0, subtotal - spinDiscountAmount);

  return `
<script>document.documentElement.classList.add('pp-js');</script>
<div class="pp-premium co" id="co">
  <div class="pp-wrap co-grid">

    <!-- ORDER SUMMARY ASIDE -->
    <aside class="co-sum" aria-label="অর্ডার সারাংশ">
      <div class="co-sum__body" id="coSumBody" style="display:block">
        <h3 style="font-size:18px;font-weight:700;margin-bottom:16px">অর্ডার সারাংশ (${items.length}টি আইটেম)</h3>
        
        <div style="display:flex;flex-direction:column;gap:12px;margin-bottom:20px">
          ${items
            .map(
              (item) => `
            <div class="co-item">
              <img class="co-item__img" src="${item.cover_image}" alt="${escapeHtml(item.title)}" width="64" height="64" style="object-fit:cover;border-radius:6px">
              <div class="co-item__meta">
                <p class="pp-kicker" style="margin:0">${item.type === "course" ? "লাইভ ট্রেনিং" : "Ebook / PDF"}</p>
                <p class="co-item__title" style="margin:4px 0 0;font-weight:600">${escapeHtml(item.title)}</p>
                <span style="font-weight:700;color:var(--ac);font-size:14px">৳${item.discounted_price}</span>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <ul class="co-lines" style="list-style:none;padding:0;margin:0 0 16px;border-top:1px solid var(--bd);padding-top:12px">
          <li style="display:flex;justify-content:space-between;margin-bottom:8px">
            <span>মোট সাবটোটাল</span>
            <span>৳${subtotal}</span>
          </li>
          ${
            spinDiscountPercent > 0
              ? `
          <li style="display:flex;justify-content:space-between;margin-bottom:8px;color:#16a34a;font-weight:600">
            <span>স্পিনের বিশেষ ছাড় (${spinDiscountPercent}%)</span>
            <span>−৳${spinDiscountAmount}</span>
          </li>
          `
              : ""
          }
        </ul>

        <div class="co-total" style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-top:2px dashed var(--bd);border-bottom:2px dashed var(--bd);margin-bottom:16px">
          <span style="font-size:17px;font-weight:700">তুমি দেবে</span>
          <b style="font-size:22px;color:var(--ac)">৳${finalTotal}</b>
        </div>

        <p class="co-onetime" style="font-size:13px;color:var(--tx2);display:flex;align-items:center;gap:6px">
          <svg class="pp-ic pp-ic--sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>
          এককালীন পেমেন্ট · আজীবন অ্যাক্সেস
        </p>
      </div>
    </aside>

    <!-- CHECKOUT FORM MAIN -->
    <section class="co-main" aria-labelledby="coH">
      <h1 class="pp-h2 co-h1" id="coH">নিরাপদ চেকআউট</h1>
      <p class="co-sub">তথ্য পূরণ করো এবং পেমেন্ট নিশ্চিত করো — ইমেইলে সাথে সাথে ডাউনলোড লিংক চলে যাবে।</p>

      <form method="post" action="/payments/checkout/submit" id="coForm">
        <input type="hidden" name="items_json" value="${escapeHtml(JSON.stringify(items.map((i) => ({ type: i.type, slug: i.slug }))))}">
        <input type="hidden" name="subtotal" value="${subtotal}">
        <input type="hidden" name="discount" value="${spinDiscountAmount}">
        <input type="hidden" name="total" value="${finalTotal}">

        <!-- CUSTOMER DETAILS -->
        <fieldset class="co-card co-fields" style="border:1px solid var(--bd);border-radius:12px;padding:24px;margin-bottom:24px">
          <legend class="co-legend" style="font-size:16px;font-weight:700;padding:0 8px">তোমার তথ্য</legend>

          <div class="co-field" style="margin-bottom:16px">
            <label for="coName" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">পুরো নাম *</label>
            <input id="coName" type="text" name="name" required placeholder="যেমন: রহিম উদ্দিন" class="fi" style="width:100%">
          </div>

          <div class="co-field" style="margin-bottom:16px">
            <label for="coEmail" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">ইমেইল ঠিকানা *</label>
            <input id="coEmail" type="email" name="email" required placeholder="rahim@gmail.com" class="fi" style="width:100%">
            <p class="co-hint" style="font-size:12px;color:var(--tx3);margin-top:4px">এই ইমেইলে কেনা সব ডিজিটাল ফাইলের ডাউনলোড লিংক পাঠানো হবে।</p>
          </div>

          <div class="co-field" style="margin-bottom:8px">
            <label for="coPhone" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">মোবাইল নম্বর *</label>
            <input id="coPhone" type="tel" name="phone" required placeholder="01XXXXXXXXX" class="fi" style="width:100%">
          </div>
        </fieldset>

        <!-- PAYMENT DETAILS -->
        <fieldset class="co-card co-fields" style="border:1px solid var(--bd);border-radius:12px;padding:24px;margin-bottom:24px">
          <legend class="co-legend" style="font-size:16px;font-weight:700;padding:0 8px">পেমেন্ট মাধ্যম বেছে নাও</legend>

          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:20px">
            <label style="border:1px solid var(--bd);border-radius:8px;padding:12px;text-align:center;cursor:pointer;display:block">
              <input type="radio" name="payment_method" value="bkash" checked style="margin-right:6px">
              <b style="color:#d82365">bKash</b>
            </label>
            <label style="border:1px solid var(--bd);border-radius:8px;padding:12px;text-align:center;cursor:pointer;display:block">
              <input type="radio" name="payment_method" value="nagad" style="margin-right:6px">
              <b style="color:#f7921e">Nagad</b>
            </label>
            <label style="border:1px solid var(--bd);border-radius:8px;padding:12px;text-align:center;cursor:pointer;display:block">
              <input type="radio" name="payment_method" value="rocket" style="margin-right:6px">
              <b style="color:#8c3494">Rocket</b>
            </label>
            <label style="border:1px solid var(--bd);border-radius:8px;padding:12px;text-align:center;cursor:pointer;display:block">
              <input type="radio" name="payment_method" value="card" style="margin-right:6px">
              <b>Card / Bank</b>
            </label>
          </div>

          <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:8px;padding:16px;margin-bottom:20px;font-size:14px;line-height:1.6">
            <p style="margin:0 0 6px;font-weight:600">পেমেন্ট করার নিয়ম:</p>
            <p style="margin:0">১. বিকাশ বা নগদে 'Send Money' করে <b>01797418758</b> নম্বরে <b>৳${finalTotal}</b> টাকা পাঠাও।</p>
            <p style="margin:4px 0 0">২. টাকা পাঠানোর পর নিচের ঘরে তোমার পাঠানো নম্বর এবং Transaction ID (TrxID) লিখে সাবমিট করো।</p>
          </div>

          <div class="frow" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
            <div class="co-field">
              <label style="display:block;margin-bottom:6px;font-size:13px;font-weight:600">যে নম্বর থেকে টাকা পাঠিয়েছ *</label>
              <input type="tel" name="sender_number" required placeholder="01XXXXXXXXX" class="fi" style="width:100%">
            </div>
            <div class="co-field">
              <label style="display:block;margin-bottom:6px;font-size:13px;font-weight:600">Transaction ID (TrxID) *</label>
              <input type="text" name="transaction_id" required placeholder="যেমন: BKG894J21" class="fi" style="width:100%">
            </div>
          </div>
        </fieldset>

        <button type="submit" class="bp btn-full" style="padding:16px;font-size:16px;font-weight:700">
          🔒 অর্ডার সম্পূর্ণ করো (৳${finalTotal})
        </button>
      </form>
    </section>

  </div>
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
