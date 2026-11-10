export interface AuthProps {
  error?: string;
  success?: string;
  email?: string;
  next?: string;
}

export function loginView({ error = "", success = "", email = "", next = "/dashboard/" }: AuthProps): string {
  return `
<div class="container" style="max-width:440px;padding:100px 20px 60px">
  <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:36px;box-shadow:0 12px 40px rgba(0,0,0,.35)">
    
    <div style="text-align:center;margin-bottom:24px">
      <div class="brand-text-logo" style="margin-bottom:12px;display:inline-flex;font-size:24px">
        <span class="brand-badge-dot"></span>
        <span>notabene<span class="brand-accent">.saas</span></span>
      </div>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 6px">আপনার অ্যাকাউন্টে ঢুকুন</h1>
      <p style="color:var(--tx2);font-size:14px;margin:0">সংগ্রহের সব বই, প্লাগিন্স ও ফাইল দেখতে লগইন করুন</p>
    </div>

    ${
      error
        ? `<div style="background:rgba(239,68,68,.12);border:1px solid #ef4444;border-radius:8px;padding:12px;color:#ef4444;font-size:14px;margin-bottom:20px;text-align:center">⚠️ ${escapeHtml(error)}</div>`
        : ""
    }
    ${
      success
        ? `<div style="background:rgba(34,197,94,.12);border:1px solid #16a34a;border-radius:8px;padding:12px;color:#16a34a;font-size:14px;margin-bottom:20px;text-align:center">✓ ${escapeHtml(success)}</div>`
        : ""
    }

    <form method="post" action="/auth/login">
      <input type="hidden" name="next" value="${escapeHtml(next)}">
      
      <div style="margin-bottom:16px">
        <label for="email" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">ইমেইল ঠিকানা</label>
        <input type="email" id="email" name="email" value="${escapeHtml(email)}" placeholder="apnar@email.com" class="fi" style="width:100%" required>
      </div>

      <div style="margin-bottom:20px">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px">
          <label for="password" style="font-size:14px;font-weight:600">পাসওয়ার্ড</label>
        </div>
        <input type="password" id="password" name="password" placeholder="••••••••••••" class="fi" style="width:100%" required>
      </div>

      <button type="submit" class="bp btn-full" style="padding:14px;font-size:15px;font-weight:700">লগইন করুন</button>
    </form>

    <div style="background:rgba(124,106,247,.08);border:1px dashed var(--ac);border-radius:10px;padding:14px;margin-top:24px;font-size:13px;line-height:1.6">
      <div style="font-weight:700;color:var(--ac);margin-bottom:4px">👑 অ্যাডমিন অ্যাকাউন্ট তথ্য:</div>
      <div><b>ইমেইল:</b> <code>notabene.inc@gmail.com</code></div>
      <div><b>পাসওয়ার্ড:</b> <code>nIncttps;(/)+88@1711583165ninC</code></div>
    </div>

    <div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid var(--bd);font-size:14px;color:var(--tx2)">
      নতুন ইউজার? <a href="/auth/register" style="color:var(--ac);font-weight:600;text-decoration:none">অ্যাকাউন্ট তৈরি করুন →</a>
    </div>

  </div>
</div>
`;
}

export function registerView({ error = "", name = "", email = "" }: AuthProps & { name?: string }): string {
  return `
<div class="container" style="max-width:440px;padding:100px 20px 60px">
  <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:16px;padding:36px;box-shadow:0 12px 40px rgba(0,0,0,.35)">
    
    <div style="text-align:center;margin-bottom:24px">
      <div class="brand-text-logo" style="margin-bottom:12px;display:inline-flex;font-size:24px">
        <span class="brand-badge-dot"></span>
        <span>notabene<span class="brand-accent">.saas</span></span>
      </div>
      <h1 style="font-size:22px;font-weight:700;margin:0 0 6px">নতুন অ্যাকাউন্ট খুলুন</h1>
      <p style="color:var(--tx2);font-size:14px;margin:0">ফ্রি ও পেইড ডিজিটাল প্রোডাক্ট নিজের লাইব্রেরিতে সেভ করুন</p>
    </div>

    ${
      error
        ? `<div style="background:rgba(239,68,68,.12);border:1px solid #ef4444;border-radius:8px;padding:12px;color:#ef4444;font-size:14px;margin-bottom:20px;text-align:center">⚠️ ${escapeHtml(error)}</div>`
        : ""
    }

    <form method="post" action="/auth/register">
      <div style="margin-bottom:16px">
        <label for="regName" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">আপনার পুরো নাম</label>
        <input type="text" id="regName" name="name" value="${escapeHtml(name)}" placeholder="যেমন: আহমেদ আলম" class="fi" style="width:100%" required>
      </div>

      <div style="margin-bottom:16px">
        <label for="regEmail" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">ইমেইল ঠিকানা</label>
        <input type="email" id="regEmail" name="email" value="${escapeHtml(email)}" placeholder="apnar@email.com" class="fi" style="width:100%" required>
      </div>

      <div style="margin-bottom:20px">
        <label for="regPassword" style="display:block;margin-bottom:6px;font-size:14px;font-weight:600">পাসওয়ার্ড</label>
        <input type="password" id="regPassword" name="password" placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড" class="fi" style="width:100%" required minlength="6">
      </div>

      <button type="submit" class="bp btn-full" style="padding:14px;font-size:15px;font-weight:700">অ্যাকাউন্ট তৈরি করুন ও লাইব্রেরিতে ঢুকুন</button>
    </form>

    <div style="text-align:center;margin-top:24px;padding-top:20px;border-top:1px solid var(--bd);font-size:14px;color:var(--tx2)">
      আগে থেকেই অ্যাকাউন্ট আছে? <a href="/auth/login" style="color:var(--ac);font-weight:600;text-decoration:none">লগইন করুন →</a>
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
