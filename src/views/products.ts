import { Product, User } from "../types";
import { renderProductCard } from "../utils/cards";

export interface ProductsViewProps {
  products: Product[];
  currentFilter?: string;
  searchQuery?: string;
  user?: User | null;
  savedProductIds?: number[];
}

export function productsView({
  products,
  currentFilter = "all",
  searchQuery = "",
  user = null,
  savedProductIds = [],
}: ProductsViewProps): string {
  let filtered = products;
  if (currentFilter === "free") {
    filtered = filtered.filter((p) => p.discounted_price === 0);
  } else if (currentFilter === "paid") {
    filtered = filtered.filter((p) => p.discounted_price > 0);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }

  const freeCount = products.filter((p) => p.discounted_price === 0).length;
  const paidCount = products.filter((p) => p.discounted_price > 0).length;

  return `
<script>document.documentElement.classList.add('pp-js');</script>
<div class="pp-premium ppl" id="pp">

  <section class="ppl-hero" aria-labelledby="pplH">
    <div class="pp-wrap">
      <p class="pp-kicker">ডিজিটাল প্রোডাক্ট ও রিসোর্স</p>
      <h1 class="pp-h1 ppl-h1" id="pplH">বই, প্লাগিন্স আর টেমপ্লেট — বাস্তব কাজ থেকে বানানো</h1>
      <p class="pp-lede">পছন্দমতো সংগ্রহ করুন, নিজের অ্যাকাউন্টে সেভ রাখুন এবং যেকোনো সময় ডাউনলোড করুন।</p>
      
      <ul class="ppl-stats">
        <li><b>${products.length}</b><span>টি প্রোডাক্ট</span></li>
        <li><b>${freeCount}</b><span>টি একদম ফ্রি</span></li>
        ${
          user
            ? `<li><b style="color:#a78bfa">${savedProductIds.length}</b><span>টি আপনার লাইব্রেরিতে সেভ করা</span></li>`
            : `<li><a href="/auth/login" style="color:#a78bfa;font-weight:700">লগইন করুন</a><span>লাইব্রেরি সিঙ্ক করতে</span></li>`
        }
      </ul>
    </div>
  </section>

  <span class="ppl-sentinel" aria-hidden="true"></span>
  <form class="ppl-bar" id="pplForm" method="get" action="/products/" role="search" aria-label="প্রোডাক্ট ফিল্টার">
    <div class="pp-wrap ppl-bar__in">
      <div class="ppl-row">
        <fieldset class="ppl-seg" role="radiogroup" aria-label="দাম অনুযায়ী">
          <legend class="sr-only">দাম অনুযায়ী</legend>
          <span class="ppl-seg__ind" aria-hidden="true"></span>
          
          <label>
            <input type="radio" name="price" value="all" ${currentFilter === "all" ? "checked" : ""} onchange="this.form.submit()">
            <span>সব <i id="cnt-price-all">${products.length}</i></span>
          </label>
          <label>
            <input type="radio" name="price" value="free" ${currentFilter === "free" ? "checked" : ""} onchange="this.form.submit()">
            <span>ফ্রি <i id="cnt-price-free">${freeCount}</i></span>
          </label>
          <label>
            <input type="radio" name="price" value="paid" ${currentFilter === "paid" ? "checked" : ""} onchange="this.form.submit()">
            <span>পেইড <i id="cnt-price-paid">${paidCount}</i></span>
          </label>
        </fieldset>
        
        <div class="ppl-tools">
          <div class="ppl-search" data-ppl-search>
            <button type="submit" class="pp-iconbtn ppl-search__btn" aria-label="খোঁজো">
              <svg class="pp-ic" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </button>
            <label class="sr-only" for="pplQ">নাম বা বিবরণে খোঁজো</label>
            <input id="pplQ" type="search" name="q" value="${escapeHtml(searchQuery)}" placeholder="খোঁজো…" autocomplete="off" maxlength="80">
          </div>
        </div>
      </div>
    </div>
  </form>

  <div class="pp-wrap ppl-shell" id="pplResults">
    <div class="nb-prod-grid">
      ${filtered.map((p) => renderProductCard(p, savedProductIds.includes(p.id))).join("")}
    </div>
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
