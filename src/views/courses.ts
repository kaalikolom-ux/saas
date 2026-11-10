import { Course } from "../types";

export interface CoursesViewProps {
  courses: Course[];
}

export function coursesView({ courses }: CoursesViewProps): string {
  return `
<script>document.documentElement.classList.add('pp-js');</script>
<div class="pp-premium ppl" id="pp">

  <section class="ppl-hero" aria-labelledby="pplH">
    <div class="pp-wrap">
      <p class="pp-kicker">কোর্স ও মাস্টারক্লাস</p>
      <h1 class="pp-h1 ppl-h1" id="pplH">হাতে-কলমে শেখো — বাস্তব প্রজেক্ট থেকে বানানো ট্রেনিং</h1>
      <p class="pp-lede">শুধু ভিডিও দেখে মুখস্থ করা না — সরাসরি ইন্ডাস্ট্রি স্ট্যান্ডার্ড কোড ও লাইভ ক্লায়েন্ট কাজ।</p>
      
      <ul class="ppl-stats">
        <li><b>${courses.length}</b><span>টি ফ্ল্যাগশিপ কোর্স</span></li>
        <li><b>১</b><span>টি লাইভ ব্যাচ চলমান</span></li>
      </ul>
    </div>
  </section>

  <div class="pp-wrap ppl-shell" id="pplResults" style="padding-top:30px">
    <div class="ppl-grid">
      ${courses
        .map((c, idx) => {
          const discountPct =
            c.price > c.discounted_price ? Math.round(((c.price - c.discounted_price) / c.price) * 100) : 0;
          return `
        <article class="ppl-card ppl-card--wide pp-rv" style="--i:${idx}">
          <div class="ppl-card__media">
            <img src="${c.cover_image}" alt="${escapeHtml(c.title)}" width="640" height="360" fetchpriority="high" decoding="async">
            <span class="ppl-tag">লাইভ ট্রেনিং</span>
            ${discountPct > 0 ? `<span class="ppl-flags"><span class="ppl-flag">−${discountPct}%</span></span>` : ""}
            <label class="bundle-toggle" data-bundle-toggle data-item-type="course"
                   data-item-slug="${c.slug}" data-item-title="${escapeHtml(c.title)}"
                   data-item-price="${c.discounted_price}"
                   data-tooltip="বান্ডেলে যোগ করো">
              <input type="checkbox" aria-label="${escapeHtml(c.title)} — বান্ডেলে যোগ করো">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </label>
          </div>
          <div class="ppl-card__body">
            <p class="pp-kicker">৪ মাসের লাইভ ট্রেনিং</p>
            <h3 class="ppl-card__title">
              <a class="ppl-card__link" href="/courses/${c.slug}/">${escapeHtml(c.title)}</a>
            </h3>
            <p class="ppl-card__desc">${escapeHtml(c.subtitle || c.description || "")}</p>
            <div class="ppl-card__foot">
              <div class="ppl-price">
                <b>৳${c.discounted_price}</b>
                ${c.price > c.discounted_price ? `<s>৳${c.price}</s>` : ""}
              </div>
              <a class="ppl-cta" href="/courses/${c.slug}/">
                কোর্স সিলেবাস দেখো
                <svg class="pp-ic pp-ic--sm" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            </div>
          </div>
        </article>
      `;
        })
        .join("")}
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
