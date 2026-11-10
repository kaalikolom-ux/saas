import { Order, Contact, Product } from "../types";

export interface DashboardProps {
  orders: Order[];
  leads: Contact[];
  products: Product[];
  totalRevenue: number;
  totalSpins: number;
  userEmail?: string;
  userOrders?: Order[];
}

export function dashboardView({
  orders,
  leads,
  products,
  totalRevenue,
  totalSpins,
  userEmail = "",
  userOrders = [],
}: DashboardProps): string {
  return `
<section class="sp" style="padding-top:40px">
  <div class="container" style="max-width:1040px">
    
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:32px;flex-wrap:wrap;gap:16px">
      <div>
        <p class="pp-kicker" style="margin:0">কাস্টমার পোর্টাল ও ড্যাশবোর্ড</p>
        <h1 style="font-size:clamp(26px,3vw,36px);font-weight:700;margin:4px 0 0">তোমার লাইব্রেরি ও অর্ডার ট্র্যাকিং</h1>
      </div>
      <div style="display:flex;gap:10px">
        <a href="#customerLookup" class="bs" style="font-size:13px">অর্ডার খুঁজুন</a>
        <a href="#adminSection" class="bp" style="font-size:13px">⚙️ অ্যাডমিন প্যানেল</a>
      </div>
    </div>

    <!-- CUSTOMER ORDER LOOKUP SECTION -->
    <div id="customerLookup" style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:28px;margin-bottom:40px">
      <h2 style="font-size:20px;font-weight:700;margin:0 0 8px">আপনার কেনা বই ও প্রোডাক্ট দেখুন</h2>
      <p style="color:var(--tx2);font-size:14px;margin-bottom:20px">যে ইমেইল বা ফোন নম্বর দিয়ে অর্ডার করেছিলেন, তা লিখে সার্চ করুন:</p>

      <form method="get" action="/dashboard/" style="display:flex;gap:12px;max-width:540px;margin-bottom:24px">
        <input type="text" name="email" value="${escapeHtml(userEmail)}" placeholder="apnar@email.com অথবা মোবাইল নম্বর..." class="fi" style="flex:1" required>
        <button type="submit" class="bp" style="white-space:nowrap">খুঁজুন</button>
      </form>

      ${
        userEmail && userOrders.length > 0
          ? `
      <div>
        <h3 style="font-size:17px;font-weight:600;margin-bottom:14px;color:#16a34a">
          ✓ ${userOrders.length}টি অর্ডার পাওয়া গেছে (${escapeHtml(userEmail)})
        </h3>
        <div style="display:flex;flex-direction:column;gap:14px">
          ${userOrders
            .map(
              (o) => `
            <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px">
                <div>
                  <b style="font-family:var(--ff-mono);color:var(--ac);font-size:15px">${escapeHtml(o.order_id)}</b>
                  <span style="font-size:13px;color:var(--tx3);margin-left:8px">${escapeHtml(o.created_at)}</span>
                </div>
                <div>
                  <span class="tg" style="border-color:#16a34a;color:#16a34a">${escapeHtml(o.status)}</span>
                  <b style="font-size:16px;margin-left:10px">৳${o.total}</b>
                </div>
              </div>
              <div style="font-size:14px;color:var(--tx2);line-height:1.6">
                <b>আইটেমসমূহ:</b> ${escapeHtml(o.items_json)}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
      `
          : userEmail
          ? `<p style="color:var(--tx3);font-size:14px">এই ইমেইলে কোনো সক্রিয় অর্ডার পাওয়া যায়নি। অনুগ্রহ করে চেকআউটের সময় ব্যবহৃত ইমেইল ঠিকানাটি ঠিকভাবে লিখুন।</p>`
          : ""
      }
    </div>

    <!-- ADMIN OVERVIEW SECTION -->
    <div id="adminSection" style="padding-top:20px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
        <h2 style="font-size:22px;font-weight:700;margin:0">অ্যাডমিন এনালিটিক্স ও সিস্টেম স্ট্যাটাস (Cloudflare D1)</h2>
        <span class="pill" style="border-color:var(--ac);color:var(--ac)">D1 Live: 5b2e6ecd-b1af-464e-8da5-1e5f3e58c4f8</span>
      </div>

      <!-- STATS METRIC CARDS -->
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:32px">
        <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:20px">
          <div style="color:var(--tx3);font-size:13px;font-weight:600;margin-bottom:6px">মোট অর্ডার</div>
          <div style="font-size:32px;font-weight:700;color:var(--tx)">${orders.length}</div>
          <div style="font-size:12px;color:var(--tx3);margin-top:4px">Completed checkouts</div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:20px">
          <div style="color:var(--tx3);font-size:13px;font-weight:600;margin-bottom:6px">মোট রেভিনিউ</div>
          <div style="font-size:32px;font-weight:700;color:#16a34a">৳${totalRevenue.toLocaleString()}</div>
          <div style="font-size:12px;color:var(--tx3);margin-top:4px">via bKash, Nagad &amp; Rocket</div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:20px">
          <div style="color:var(--tx3);font-size:13px;font-weight:600;margin-bottom:6px">ক্লায়েন্ট লিডস (CRM)</div>
          <div style="font-size:32px;font-weight:700;color:var(--ac)">${leads.length}</div>
          <div style="font-size:12px;color:var(--tx3);margin-top:4px">Project inquiries in D1</div>
        </div>
        <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:20px">
          <div style="color:var(--tx3);font-size:13px;font-weight:600;margin-bottom:6px">ছাড়ের চাকা স্পিন</div>
          <div style="font-size:32px;font-weight:700;color:#f59e0b">${totalSpins}</div>
          <div style="font-size:12px;color:var(--tx3);margin-top:4px">Engaged visitors</div>
        </div>
      </div>

      <!-- RECENT CRM LEADS -->
      <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:24px;margin-bottom:32px">
        <h3 style="font-size:18px;font-weight:700;margin:0 0 16px">সর্বশেষ ক্লায়েন্ট অনুসন্ধান (CRM Leads)</h3>
        ${
          leads.length > 0
            ? `
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
            <thead>
              <tr style="border-bottom:1px solid var(--bd);color:var(--tx3)">
                <th style="padding:10px">তারিখ</th>
                <th style="padding:10px">নাম</th>
                <th style="padding:10px">ইমেইল</th>
                <th style="padding:10px">প্যাকেজ</th>
                <th style="padding:10px">মেসেজ</th>
                <th style="padding:10px">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              ${leads
                .slice(0, 10)
                .map(
                  (l) => `
                <tr style="border-bottom:1px solid var(--bd)">
                  <td style="padding:10px;white-space:nowrap;font-size:12px;color:var(--tx3)">${escapeHtml(l.created_at || "")}</td>
                  <td style="padding:10px;font-weight:600">${escapeHtml(l.name)}</td>
                  <td style="padding:10px;font-family:var(--ff-mono);font-size:13px">${escapeHtml(l.email)}</td>
                  <td style="padding:10px"><span class="tg">${escapeHtml(l.package || "General")}</span></td>
                  <td style="padding:10px;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${escapeHtml(l.message)}</td>
                  <td style="padding:10px"><span class="tg" style="border-color:#16a34a;color:#16a34a">${escapeHtml(l.status || "new")}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
        `
            : `<p style="color:var(--tx3);font-size:14px;margin:0">এখনও কোনো লিড জমা পড়েনি। হোমপেজের ফর্ম থেকে টেস্ট সাবমিট করতে পারেন।</p>`
        }
      </div>

      <!-- RECENT ORDERS -->
      <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:12px;padding:24px">
        <h3 style="font-size:18px;font-weight:700;margin:0 0 16px">সর্বশেষ অর্ডারসমূহ (Orders)</h3>
        ${
          orders.length > 0
            ? `
        <div style="overflow-x:auto">
          <table style="width:100%;border-collapse:collapse;font-size:14px;text-align:left">
            <thead>
              <tr style="border-bottom:1px solid var(--bd);color:var(--tx3)">
                <th style="padding:10px">অর্ডার ID</th>
                <th style="padding:10px">তারিখ</th>
                <th style="padding:10px">গ্রাহক</th>
                <th style="padding:10px">পেমেন্ট</th>
                <th style="padding:10px">TrxID</th>
                <th style="padding:10px">মোট টাকা</th>
                <th style="padding:10px">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody>
              ${orders
                .slice(0, 10)
                .map(
                  (o) => `
                <tr style="border-bottom:1px solid var(--bd)">
                  <td style="padding:10px;font-family:var(--ff-mono);color:var(--ac);font-weight:600">${escapeHtml(o.order_id)}</td>
                  <td style="padding:10px;white-space:nowrap;font-size:12px;color:var(--tx3)">${escapeHtml(o.created_at || "")}</td>
                  <td style="padding:10px">
                    <b>${escapeHtml(o.customer_name)}</b><br>
                    <span style="font-size:12px;color:var(--tx3)">${escapeHtml(o.customer_email)}</span>
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
        `
            : `<p style="color:var(--tx3);font-size:14px;margin:0">এখনও কোনো অর্ডার রেকর্ড হয়নি। চেকআউট পেজ থেকে টেস্ট অর্ডার দিতে পারেন।</p>`
        }
      </div>

    </div>

  </div>
</section>
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
