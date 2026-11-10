import { Order, Product, Course } from "../types";

export interface OrderSuccessProps {
  order: Order;
  resolvedItems: (Product | Course)[];
}

export function orderSuccessView({ order, resolvedItems }: OrderSuccessProps): string {
  return `
<div class="container" style="max-width:720px;padding:60px 20px">
  <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:36px;text-align:center">
    
    <div style="width:64px;height:64px;border-radius:50%;background:rgba(34,197,94,.15);color:#16a34a;display:inline-flex;align-items:center;justify-content:center;font-size:32px;margin-bottom:16px">
      ✓
    </div>

    <h1 style="font-size:clamp(24px,3vw,32px);font-weight:700;margin:0 0 8px">অর্ডার সফল হয়েছে! 🎉</h1>
    <p style="color:var(--tx2);font-size:15px;margin-bottom:24px">
      ধন্যবাদ, <b>${escapeHtml(order.customer_name)}</b>! তোমার পেমেন্ট রেকর্ড হয়েছে এবং কনফার্মেশন পাঠানো হয়েছে <b>${escapeHtml(order.customer_email)}</b> ঠিকানায়।
    </p>

    <!-- ORDER RECEIPT DETAILS -->
    <div style="background:var(--bg);border:1px solid var(--bd);border-radius:12px;padding:20px;text-align:left;margin-bottom:28px">
      <div style="display:flex;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid var(--bd);margin-bottom:12px">
        <span style="color:var(--tx3);font-size:13px">অর্ডার নম্বর</span>
        <b style="font-family:var(--ff-mono);color:var(--ac)">${escapeHtml(order.order_id)}</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding-bottom:12px;border-bottom:1px solid var(--bd);margin-bottom:12px">
        <span style="color:var(--tx3);font-size:13px">পেমেন্ট মাধ্যম</span>
        <b style="text-transform:uppercase">${escapeHtml(order.payment_method)} (${escapeHtml(order.transaction_id || "Direct")})</b>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <span style="color:var(--tx3);font-size:13px">পরিশোধিত মোট মূল্য</span>
        <b style="font-size:18px;color:#16a34a">৳${order.total}</b>
      </div>
    </div>

    <!-- DOWNLOADS SECTION -->
    <div style="text-align:left;margin-bottom:32px">
      <h3 style="font-size:18px;font-weight:700;margin-bottom:14px">তোমার কেনা ফাইল ও রিসোর্স:</h3>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${resolvedItems
          .map(
            (item) => `
          <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:14px 18px">
            <div style="display:flex;align-items:center;gap:12px">
              <img src="${item.cover_image}" alt="${escapeHtml(item.title)}" width="48" height="48" style="object-fit:cover;border-radius:6px">
              <div>
                <b style="font-size:15px;display:block">${escapeHtml(item.title)}</b>
                <span style="font-size:12px;color:var(--tx3)">PDF Ebook · Full Lifetime Access</span>
              </div>
            </div>
            <a href="${item.cover_image}" download class="pp-btn pp-btn--primary" style="padding:8px 14px;font-size:13px;text-decoration:none">
              📥 ডাউনলোড PDF
            </a>
          </div>
        `
          )
          .join("")}
      </div>
    </div>

    <div style="display:flex;gap:12px;justify-content:center">
      <a href="/dashboard/" class="bp">তোমার লাইব্রেরিতে যাও →</a>
      <a href="/products/" class="bs">আরও প্রোডাক্ট দেখো</a>
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
