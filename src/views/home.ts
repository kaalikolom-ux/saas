import { Product, Project, BlogPost, User } from "../types";
import { renderProductCard } from "../utils/cards";

export interface HomeProps {
  products: Product[];
  projects: Project[];
  blogs: BlogPost[];
  user?: User | null;
}

export function homeView({ products, projects, blogs, user = null }: HomeProps): string {
  const featuredProducts = products.slice(0, 6);
  const freeProducts = products.filter((p) => p.discounted_price === 0).slice(0, 6);

  return `
<!-- HERO -->
<section id="hero">
  <div class="container">
    <div class="hg">
      <div>
        <div class="hey rv"><div class="dg"></div>ডিজিটাল প্রোডাক্ট ও প্লাগিন্স স্টোর</div>
        <p style="font-size:17px;color:var(--tx2);margin-bottom:6px" class="rv">Welcome to</p>
        <h1 class="hname rv"><span class="ag">notabene</span><span style="color:#7c6af7">.saas</span> 🚀</h1>
        <p class="hsub rv">সেরা প্রোগ্রামিং ইবুক, অটোমেশন প্লাগিন্স ও ডেভেলপার রিসোর্স</p>
        <p class="hdesc rv">বাস্তব কাজের অভিজ্ঞতা থেকে তৈরি বাংলা প্রোগ্রামিং বই, ফুলস্ট্যাক কোড টেমপ্লেট এবং অটোমেশন স্ক্রিপ্ট। পছন্দের প্রোডাক্ট সরাসরি লাইব্রেরিতে সেভ করে রাখুন এবং যেকোনো সময় ডাউনলোড করুন।</p>
        
        <div class="pills rv">
          <span class="pill"><span class="pd" style="background:#7c6af7"></span>📚 ডিজিটাল ইবুক</span>
          <span class="pill"><span class="pd" style="background:#2dd4bf"></span>⚡ অটোমেশন প্লাগিন্স</span>
          <span class="pill"><span class="pd" style="background:#3776AB"></span>🐍 Python &amp; Django</span>
          <span class="pill"><span class="pd" style="background:#F7DF1E"></span>🟨 JavaScript</span>
          <span class="pill"><span class="pd" style="background:#16a34a"></span>🎁 ১০০% ফ্রি রিসোর্স</span>
        </div>
        
        <div class="hbtns rv">
          <a href="/products/" class="bp">🛍️ সব প্রোডাক্ট দেখুন</a>
          <a href="/products/?price=free" class="bs">🎁 ফ্রি রিসোর্স সংগ্রহ করুন</a>
          ${
            user
              ? `<a href="/dashboard/" class="bs">📚 আমার লাইব্রেরি (${escapeHtml(user.name.split(" ")[0])})</a>`
              : `<a href="/auth/login" class="bs">🔑 লগইন করুন</a>`
          }
        </div>

        <div class="hstats rv">
          <div class="si"><span class="sn" data-target="12" data-suffix="+">12+</span><div class="sl">ডিজিটাল প্রোডাক্ট</div></div>
          <div class="si"><span class="sn" data-target="5" data-suffix="">5</span><div class="sl">সম্পূর্ণ ফ্রি গাইড</div></div>
          <div class="si"><span class="sn" data-target="1200" data-suffix="+">1.2K+</span><div class="sl">সন্তুষ্ট গ্রাহক</div></div>
          <div class="si"><span class="sn" data-target="100" data-suffix="%">100%</span><div class="sl">লাইফটাইম অ্যাক্সেস</div></div>
        </div>
      </div>
      <div class="hr rvr">
        <div class="avf">
          <div class="avd"></div>
          <div><div class="avt">notabene.saas প্ল্যাটফর্ম</div><div class="avs">তাত্ক্ষণিক ডাউনলোড ও আজীবন সংগ্রহ</div></div>
        </div>
        <div class="term" style="margin-top:52px">
          <div class="tb2"><div class="tc tc-r"></div><div class="tc tc-y"></div><div class="tc tc-g"></div><div class="tl2">notabene@saas ~ terminal</div></div>
          <div class="tbody">
            <div><span class="tpr">$</span><span class="tcm"> notabene search --free</span></div>
            <span class="tog">Found 5 free developer ebooks &amp; prompt packs!</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="tcm"> notabene library:sync</span></div>
            <span class="toc">Syncing saved PDFs &amp; plugins to user dashboard...<br>&nbsp;✓ Instant offline download enabled</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="tcm"> status</span></div>
            <span class="tog">notabene.saas is running on Cloudflare Edge ⚡</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="cur"></span></div>
          </div>
        </div>
        <div class="fbs">
          <div class="fb" style="color:var(--ac);font-weight:700">nb</div>
          <div class="fb">📚</div><div class="fb">⚡</div>
          <div class="fb" style="color:var(--tx2)">&lt;/&gt;</div>
        </div>
      </div>
    </div>
  </div>
  <div class="sd"><div class="sr2">↓</div><span>scroll</span></div>
</section>

<!-- DIGITAL PRODUCTS SHOWCASE -->
<section id="products" class="sp">
  <div class="container">
    <div class="sr">
      <div>
        <div class="lbl">ডিজিটাল স্টোর</div>
        <h2 class="stitle rv" style="font-size:clamp(22px,2.5vw,32px);margin-bottom:0">জনপ্রিয় ডিজিটাল প্রোডাক্ট</h2>
      </div>
      <a href="/products/" class="va">সবগুলো প্রোডাক্ট দেখুন →</a>
    </div>
    <div class="nb-prod-grid">
      ${featuredProducts.map((p) => renderProductCard(p)).join("")}
    </div>
  </div>
</section>

<!-- FREE RESOURCES SECTION -->
<section class="sp" style="background:var(--bg2);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)">
  <div class="container">
    <div class="sr">
      <div>
        <div class="lbl">বিনামূল্যে সংগ্রহ</div>
        <h2 class="stitle rv" style="font-size:clamp(22px,2.5vw,32px);margin-bottom:0">১০০% ফ্রি রিসোর্স ও চিটশিট</h2>
      </div>
      <a href="/products/?price=free" class="va">সকল ফ্রি আইটেম →</a>
    </div>
    <div class="nb-prod-grid">
      ${freeProducts.map((p) => renderProductCard(p)).join("")}
    </div>
  </div>
</section>
  </div>
</section>

<!-- HOW IT WORKS (SAVE & DOWNLOAD) -->
<section class="sp">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">কিভাবে কাজ করে</div>
      <h2 class="stitle rv">খুব সহজেই সেভ ও ডাউনলোড করুন</h2>
      <p class="sdesc rv" style="max-width:540px;margin:0 auto">notabene.saas-এ যেকোনো ভিজিটর লগইন করে আজীবনের জন্য তার পছন্দের প্রোডাক্ট লাইব্রেরিতে সংরক্ষণ করতে পারেন।</p>
    </div>
    <div class="svg">
      <div class="svc rv">
        <div class="svci">🔑</div>
        <div class="svcn">১. লগইন বা সাইনআপ করুন</div>
        <div class="svcd">মাত্র কয়েক সেকেন্ডে ইমেইল দিয়ে নিজের অ্যাকাউন্ট খুলুন অথবা লগইন করুন।</div>
      </div>
      <div class="svc rv">
        <div class="svci">📚</div>
        <div class="svcn">২. প্রোডাক্ট পছন্দ করুন</div>
        <div class="svcd">ফ্রি ইবুক, প্লাগিন্স বা চিটশিট বেছে নিন, অথবা পেইড বান্ডেল কিনুন।</div>
      </div>
      <div class="svc rv">
        <div class="svci">💾</div>
        <div class="svcn">৩. লাইব্রেরিতে সেভ করুন</div>
        <div class="svcd">এক ক্লিকেই প্রোডাক্টটি আপনার ব্যক্তিগত লাইব্রেরি ড্যাশবোর্ডে সংরক্ষিত হয়ে যাবে।</div>
      </div>
      <div class="svc rv">
        <div class="svci">📥</div>
        <div class="svcn">৪. যখন খুশি ডাউনলোড করুন</div>
        <div class="svcd">মোবাইল, ল্যাপটপ বা ট্যাবলেট থেকে আজীবন যেকোনো সময় অফলাইনে পড়ার জন্য ডাউনলোড করুন।</div>
      </div>
    </div>
    <div style="text-align:center;margin-top:40px">
      <a href="/dashboard/" class="bp">আমার লাইব্রেরিতে ঢুকুন →</a>
    </div>
  </div>
</section>

<!-- TRAINING COURSE BANNER -->
<section class="sp" style="background:var(--bg2);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)">
  <div class="container">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;align-items:center">
      <div>
        <div class="lbl">ফ্ল্যাগশিপ মাস্টারক্লাস</div>
        <h2 style="font-size:clamp(24px,3vw,36px);margin-bottom:12px;font-weight:700">Modern AI Powered Fullstack Development</h2>
        <p style="color:var(--tx2);font-size:16px;line-height:1.7;margin-bottom:20px">
          Python, Django, Automation, AI Workflow, Local LLM, ChatGPT এবং Claude দিয়ে ৪ মাসের লাইভ প্রজেক্ট-ভিত্তিক ইনটেনসিভ ট্রেনিং।
        </p>
        <div style="display:flex;gap:16px;align-items:center">
          <a href="/courses/ai-powered-python-django-automation-developer/" class="bp">কোর্স সিলেবাস ও বিস্তারিত →</a>
          <span style="font-size:18px;font-weight:700;color:var(--ac)">৳৭,৫০০ <s style="font-size:14px;color:var(--tx3)">৳১৫,০০০</s></span>
        </div>
      </div>
      <div>
        <img src="/media/courses/covers/AI_Mission_Briefing__10x_Faster_Developer.jpg" alt="Course Cover" style="width:100%;border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.35)">
      </div>
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" class="sp">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">যোগাযোগ ও সাপোর্ট</div>
      <h2 class="stitle rv">কোনো প্রশ্ন বা সহায়তা প্রয়োজন?</h2>
      <p class="sdesc rv" style="max-width:500px;margin:0 auto">ডিজিটাল প্রোডাক্ট, কোর্স অথবা কাস্টম প্রজেক্ট নিয়ে যেকোনো পরামর্শের জন্য বার্তা পাঠান।</p>
    </div>
    <div class="cg">
      <div class="rvl">
        <div class="cinfo">
          <div class="cit"><div class="cii">📞</div><div><div class="cil">WhatsApp Helpline</div><div class="civ">+8801711583165</div></div></div>
          <div class="cit"><div class="cii">📧</div><div><div class="cil">Email Support</div><div class="civ">notabene.inc@gmail.com</div></div></div>
          <div class="cit"><div class="cii">🟢</div><div><div class="cil">Service Status</div><div class="civ" style="color:var(--gr)">Cloudflare D1 Live · 24/7 Active</div></div></div>
        </div>
      </div>
      <div class="rvr">
        <form hx-post="/crm/contact/" hx-target="#form-result" hx-swap="innerHTML" class="cf" id="contactForm">
          <div id="form-result"></div>
          <div class="frow">
            <div class="fg">
              <label class="flbl">আপনার নাম *</label>
              <input type="text" name="name" class="fi" placeholder="নাম লিখুন" required>
            </div>
            <div class="fg">
              <label class="flbl">ইমেইল *</label>
              <input type="email" name="email" class="fi" placeholder="apnar@email.com" required>
            </div>
          </div>
          <div class="fg">
            <label class="flbl">বিষয়</label>
            <input type="text" name="subject" class="fi" placeholder="প্রোডাক্ট বা অর্ডার সংক্রান্ত...">
          </div>
          <div class="fg">
            <label class="flbl">বার্তা *</label>
            <textarea name="message" class="fi" rows="4" placeholder="আপনার প্রশ্ন বা মতামত বিস্তারিত লিখুন..." required style="resize:vertical"></textarea>
          </div>
          <button type="submit" class="bp btn-full" style="padding:14px;font-size:15px">⚡ বার্তা পাঠান</button>
        </form>
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
