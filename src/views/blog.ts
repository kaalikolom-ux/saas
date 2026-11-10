import { BlogPost } from "../types";

export interface BlogViewProps {
  posts: BlogPost[];
  currentCategory?: string;
  searchQuery?: string;
}

export function blogView({ posts, currentCategory = "all", searchQuery = "" }: BlogViewProps): string {
  let filtered = posts;
  if (currentCategory !== "all") {
    filtered = filtered.filter((p) => p.category.toLowerCase() === currentCategory.toLowerCase());
  }
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (p) => p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
    );
  }

  return `
<section class="sp" style="padding-top:40px">
  <div class="container">
    <div class="sh" style="margin-bottom:28px">
      <div class="lbl" style="justify-content:center">Tech Insights</div>
      <h1 class="stitle rv" style="font-size:clamp(28px,3.5vw,42px)">From The Blog</h1>
      <p class="sdesc rv" style="max-width:520px;margin:0 auto">Practical guides, tutorials and insights on Django, Python, HTMX, AI automation, and system engineering.</p>
    </div>

    <!-- CATEGORIES -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px">
      <a href="/blog/" class="pill ${currentCategory === "all" ? "active" : ""}" style="${currentCategory === "all" ? "border-color:var(--ac);color:var(--ac2)" : ""}">All Articles</a>
      <a href="/blog/?cat=django" class="pill ${currentCategory === "django" ? "active" : ""}" style="${currentCategory === "django" ? "border-color:var(--ac);color:var(--ac2)" : ""}">Django</a>
      <a href="/blog/?cat=ai-automation" class="pill ${currentCategory === "ai-automation" ? "active" : ""}" style="${currentCategory === "ai-automation" ? "border-color:var(--ac);color:var(--ac2)" : ""}">AI &amp; Automation</a>
      <a href="/blog/?cat=devops" class="pill ${currentCategory === "devops" ? "active" : ""}" style="${currentCategory === "devops" ? "border-color:var(--ac);color:var(--ac2)" : ""}">DevOps</a>
      <a href="/blog/?cat=freelancing" class="pill ${currentCategory === "freelancing" ? "active" : ""}" style="${currentCategory === "freelancing" ? "border-color:var(--ac);color:var(--ac2)" : ""}">Freelancing</a>
    </div>

    <!-- SEARCH -->
    <div style="max-width:540px;margin:0 auto 40px">
      <form method="get" action="/blog/">
        <input type="text" placeholder="Search articles..." name="q" value="${escapeHtml(searchQuery)}"
               style="width:100%;background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:12px 16px;font-size:14px;color:var(--tx);font-family:var(--fn);outline:none;transition:border-color .2s">
      </form>
    </div>

    <!-- ARTICLES GRID -->
    <div class="blg">
      ${
        filtered.length > 0
          ? filtered
              .map(
                (p) => `
        <a href="/blog/${p.slug}/" class="blc rv" style="text-decoration:none;color:inherit">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span class="tg">${escapeHtml(p.category)}</span>
            <span style="font-size:12px;color:var(--tx3)">${escapeHtml(p.publish_date)}</span>
            <span style="font-size:12px;color:var(--tx3)">· ${escapeHtml(p.read_time)}</span>
          </div>
          <h3 style="font-size:18px;font-weight:600;margin-bottom:8px;line-height:1.4">${escapeHtml(p.title)}</h3>
          <p style="font-size:14px;color:var(--tx2);line-height:1.6;margin-bottom:16px">${escapeHtml(p.summary)}</p>
          <div style="font-size:13px;color:var(--ac);font-weight:600">Read Article →</div>
        </a>
      `
              )
              .join("")
          : `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--tx3)">No articles found matching your criteria.</div>`
      }
    </div>
  </div>
</section>
`;
}

export function blogDetailView(post: BlogPost, related: BlogPost[]): string {
  return `
<section class="sp" style="padding-top:40px">
  <div class="container" style="max-width:760px">
    <nav style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--tx3);margin-bottom:24px">
      <a href="/" style="color:var(--tx2);text-decoration:none">হোম</a>
      <span>/</span>
      <a href="/blog/" style="color:var(--tx2);text-decoration:none">Blog</a>
      <span>/</span>
      <span style="color:var(--tx)">${escapeHtml(post.title)}</span>
    </nav>

    <div style="margin-bottom:24px">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px">
        <span class="tg">${escapeHtml(post.category)}</span>
        <span style="font-size:13px;color:var(--tx3)">Published: ${escapeHtml(post.publish_date)}</span>
        <span style="font-size:13px;color:var(--tx3)">· ${escapeHtml(post.read_time)} read</span>
      </div>
      <h1 style="font-size:clamp(26px,3.5vw,38px);font-weight:700;line-height:1.3;margin-bottom:16px">${escapeHtml(post.title)}</h1>
      <p style="font-size:17px;color:var(--tx2);line-height:1.7;border-left:3px solid var(--ac);padding-left:16px">${escapeHtml(post.summary)}</p>
    </div>

    <div style="font-size:16px;line-height:1.8;color:var(--tx);padding-top:20px;border-top:1px solid var(--bd);margin-bottom:48px">
      <p>Building high-performing software requires deep intentionality. In production architectures, every decision—from ORM query evaluation to edge cache configuration—directly impacts both user experience and infrastructure cost.</p>
      
      <h2 style="font-size:22px;font-weight:700;margin:32px 0 16px">Key Architectural Takeaways</h2>
      <p>When structuring full-stack systems, we prioritize simplicity without sacrificing capability. By leveraging server-driven reactivity (HTMX, Alpine) paired with modern relational backends, you eliminate synchronization bugs that typically plague decoupled client-server setups.</p>
      
      <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:10px;padding:20px;margin:24px 0">
        <h4 style="margin:0 0 8px;font-size:16px">💡 Pro Tip</h4>
        <p style="margin:0;font-size:14px;color:var(--tx2)">Always profile database execution before adding caching layers. 90% of latency bottlenecks can be solved with proper indexing and compound foreign keys.</p>
      </div>

      <p>${escapeHtml(post.content)}</p>
    </div>

    ${
      related.length > 0
        ? `
    <div style="padding-top:28px;border-top:1px solid var(--bd)">
      <h3 style="font-size:20px;font-weight:600;margin-bottom:16px">Related Articles</h3>
      <div class="blg">
        ${related
          .slice(0, 2)
          .map(
            (r) => `
          <a href="/blog/${r.slug}/" class="blc rv" style="text-decoration:none;color:inherit">
            <span class="tg">${escapeHtml(r.category)}</span>
            <h4 style="font-size:16px;font-weight:600;margin:8px 0 4px">${escapeHtml(r.title)}</h4>
            <p style="font-size:13px;color:var(--tx2);margin:0">${escapeHtml(r.summary)}</p>
          </a>
        `
          )
          .join("")}
      </div>
    </div>
    `
        : ""
    }
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
