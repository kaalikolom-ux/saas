import { Product } from "../types";

export function formatBengaliDate(dateStr?: string): string {
  if (!dateStr) return "৯/১১/২০২৬";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "৯/১১/২০২৬";
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const bnNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    const toBn = (n: number) =>
      String(n)
        .split("")
        .map((c) => bnNums[parseInt(c, 10)] ?? c)
        .join("");
    return `${toBn(day)}/${toBn(month)}/${toBn(year)}`;
  } catch {
    return "৯/১১/২০২৬";
  }
}

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderProductCard(p: Product, isSaved: boolean = false): string {
  const downloadLink = p.download_url || p.cover_image || "#";
  const desc = p.description || "ডিজিটাল প্রোডাক্ট সংগ্রহ করুন ও যেকোনো সময় ডাউনলোড করুন।";
  const dateFormatted = formatBengaliDate(p.created_at);

  return `
<article class="nb-prod-card rv">
  <!-- Top Section: Product Name only, no image -->
  <div class="nb-prod-card__top">
    <h3 class="nb-prod-card__title">${escapeHtml(p.title)}</h3>
  </div>

  <!-- Bottom Section: Category, Date, Short Description, and Actions -->
  <div class="nb-prod-card__bottom">
    <div class="nb-prod-card__meta">
      <span class="nb-prod-card__badge">${escapeHtml(p.category || "ডিজিটাল")}</span>
      <span class="nb-prod-card__date">${dateFormatted}</span>
    </div>

    <p class="nb-prod-card__desc">${escapeHtml(desc)}</p>

    <div class="nb-prod-card__actions">
      <a href="${escapeHtml(downloadLink)}" download target="_blank" rel="noopener" class="nb-btn-download">
        📥 ডাউনলোড
      </a>
      <form method="post" action="/api/library/add" style="margin:0">
        <input type="hidden" name="productId" value="${p.id}">
        <button type="submit" class="nb-btn-save" title="${isSaved ? "আপনার লাইব্রেরিতে আছে" : "লাইব্রেরিতে সেভ করুন"}">
          ${isSaved ? "✓ সেভড" : "💾 সেভ"}
        </button>
      </form>
    </div>
  </div>
</article>
`;
}
