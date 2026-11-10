import { Course } from "../types";

export interface CourseDetailProps {
  course: Course;
}

export function courseDetailView({ course }: CourseDetailProps): string {
  return `
<script>document.documentElement.classList.add('pp-js');</script>
<div class="pp-premium" id="pp">

  <!-- BREADCRUMBS -->
  <div class="pp-wrap" style="padding-top:24px;padding-bottom:12px">
    <nav style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--tx3)">
      <a href="/" style="color:var(--tx2);text-decoration:none">হোম</a>
      <span>/</span>
      <a href="/courses/" style="color:var(--tx2);text-decoration:none">কোর্স</a>
      <span>/</span>
      <span style="color:var(--tx)">${escapeHtml(course.title)}</span>
    </nav>
  </div>

  <!-- COURSE HERO -->
  <section class="pp-hero" style="padding-bottom:40px">
    <div class="pp-wrap pp-hero__grid">
      <div class="pp-hero__cover">
        <img src="${course.cover_image}" alt="${escapeHtml(course.title)}" style="width:100%;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.4)">
      </div>
      <div class="pp-hero__content">
        <div class="pp-badge-row">
          <span class="pp-badge pp-badge--hot">🔥 নতুন ব্যাচ ওপেন</span>
          <span class="pp-badge">৪ মাসের ইনটেনসিভ প্রোগ্রাম</span>
          <span class="pp-badge" style="background:rgba(34,197,94,.1);color:#16a34a">৫টি সিট বাকি</span>
        </div>

        <h1 class="pp-h1">${escapeHtml(course.title)}</h1>
        <p class="pp-lede">${escapeHtml(course.subtitle || course.description || "")}</p>

        <div class="pp-price-box">
          <div class="pp-price">
            <span class="pp-price__cur">৳${course.discounted_price}</span>
            <span class="pp-price__was">৳${course.price}</span>
          </div>
          <p class="pp-save">৫০% আর্লি-বার্ড ডিসকাউন্ট! আজই জয়েন করলে ৳৭,৫০০ টাকা ছাড়।</p>
        </div>

        <div class="pp-actions" style="margin:24px 0">
          <a href="/payments/checkout/course/${course.slug}/" class="pp-btn pp-btn--primary pp-btn--lg" style="display:inline-flex;align-items:center;gap:10px">
            <svg class="pp-ic" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            এখনই ভর্তি হও (৳৭,৫০০)
          </a>
        </div>

        <ul class="pp-perks" style="list-style:none;padding:0;margin:20px 0;display:grid;grid-template-columns:1fr 1fr;gap:12px;font-size:14px">
          <li>📅 মোট ৪ মাস (৩ মাস লার্নিং + ১ মাস রিয়েল কাজ)</li>
          <li>👥 ছোট ব্যাচ — সরাসরি মেন্টরশিপ ও কোড রিভিউ</li>
          <li>⚡ পাইথন, জ্যাঙ্গো, এইচটিএমএক্স ও এআই এজেন্টস</li>
          <li>💼 কোর্স শেষে বাস্তব ক্লায়েন্ট প্রজেক্ট সার্টিফিকেশন</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- CURRICULUM -->
  <section class="pp-section" style="padding:60px 0;background:var(--bg2);border-top:1px solid var(--bd)">
    <div class="pp-wrap">
      <div style="text-align:center;max-width:650px;margin:0 auto 40px">
        <p class="pp-kicker">সিলেবাস ও রোবস্ট রোডম্যাপ</p>
        <h2 class="pp-h2">ধাপে ধাপে শূন্য থেকে প্রো লেভেল ডেভেলপমেন্ট</h2>
        <p style="color:var(--tx2);font-size:15px;margin-top:8px">কোনো থিওরি নয় — প্রথম দিন থেকেই কোড লেখা এবং প্রোডাকশন এনভায়রনমেন্টে ডেপ্লয়মেন্ট।</p>
      </div>

      <div style="display:grid;gap:16px;max-width:850px;margin:0 auto">
        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:18px;font-weight:600">১ম মাস: Core Python, Data Structures &amp; Architecture</h3>
            <span class="tg">সপ্তাহ ১-৪</span>
          </div>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6;margin:0">
            Pythonic Best Practices, Advanced OOP, Asynchronous Python, Typing, Unit Testing, Algorithm Thinking, এবং প্রোজেক্ট স্ট্রাকচারিং।
          </p>
        </div>

        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:18px;font-weight:600">২য় মাস: Production Django, ORM Optimization &amp; HTMX</h3>
            <span class="tg">সপ্তাহ ৫-৮</span>
          </div>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6;margin:0">
            Django Models, Custom Managers, Complex Queries, N+1 Optimization, Postgres Indexing, HTMX + Alpine.js রিয়েক্টিভ ফ্রন্টএন্ড, এবং Celery + Redis ব্যাকগ্রাউন্ড টাস্ক।
          </p>
        </div>

        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:18px;font-weight:600">৩য় মাস: Autonomous AI Agents &amp; Cloudflare Edge</h3>
            <span class="tg">সপ্তাহ ৯-১২</span>
          </div>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6;margin:0">
            LLM Tool Calling, Autonomous Agent Architectures, Function Executions, Cloudflare D1 / Workers ডেপ্লয়মেন্ট, ডকার কন্টেইনারাইজেশন, এবং Meta Conversions API (CAPI)।
          </p>
        </div>

        <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <h3 style="font-size:18px;font-weight:600">৪র্থ মাস: The Strike Team — Live Client Delivery</h3>
            <span class="tg" style="border-color:var(--ac);color:var(--ac)">সপ্তাহ ১৩-১৬</span>
          </div>
          <p style="color:var(--tx2);font-size:14px;line-height:1.6;margin:0">
            সরাসরি বাস্তব আন্তর্জাতিক ক্লায়েন্ট প্রজেক্টে দলবদ্ধভাবে কাজ। রিয়েল স্পেক্স, কোড রিভিউ, প্রোডাকশন ডেপ্লয়, এবং লাইভ কেস স্টাডি।
          </p>
        </div>
      </div>
    </div>
  </section>

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
