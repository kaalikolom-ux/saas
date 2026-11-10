import { Project } from "../types";

export interface ProjectsViewProps {
  projects: Project[];
  currentCategory?: string;
}

export function projectsView({ projects, currentCategory = "all" }: ProjectsViewProps): string {
  let filtered = projects;
  if (currentCategory !== "all") {
    const cat = currentCategory.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.category && p.category.toLowerCase().includes(cat)) ||
        (p.tags && p.tags.toLowerCase().includes(cat)) ||
        (p.description && p.description.toLowerCase().includes(cat))
    );
  }

  return `
<section class="sp" style="padding-top:40px">
  <div class="container">
    <div class="sh" style="margin-bottom:28px">
      <div class="lbl" style="justify-content:center">Portfolio</div>
      <h1 class="stitle rv" style="font-size:clamp(28px,3.5vw,42px)">What I've Built</h1>
      <p class="sdesc rv" style="max-width:540px;margin:0 auto">A collection of web applications, AI automation tools, and production SaaS products delivered for clients worldwide.</p>
    </div>

    <!-- FILTER PILLS -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:32px">
      <a href="/projects/" class="pill ${currentCategory === "all" ? "active" : ""}" style="${currentCategory === "all" ? "border-color:var(--ac);color:var(--ac2)" : ""}">All Projects (${projects.length})</a>
      <a href="/projects/?cat=django" class="pill ${currentCategory === "django" ? "active" : ""}" style="${currentCategory === "django" ? "border-color:var(--ac);color:var(--ac2)" : ""}">Django</a>
      <a href="/projects/?cat=ai" class="pill ${currentCategory === "ai" ? "active" : ""}" style="${currentCategory === "ai" ? "border-color:var(--ac);color:var(--ac2)" : ""}">AI &amp; Automation</a>
      <a href="/projects/?cat=management" class="pill ${currentCategory === "management" ? "active" : ""}" style="${currentCategory === "management" ? "border-color:var(--ac);color:var(--ac2)" : ""}">Management Systems</a>
      <a href="/projects/?cat=saas" class="pill ${currentCategory === "saas" ? "active" : ""}" style="${currentCategory === "saas" ? "border-color:var(--ac);color:var(--ac2)" : ""}">SaaS Platforms</a>
    </div>

    <div class="pjg">
      ${filtered
        .map(
          (p) => `
        <a href="/projects/${p.slug}/" class="pjc rv" style="text-decoration:none;color:inherit">
          <div class="pjt pt1">${p.icon || "📊"}</div>
          <div class="pjb">
            <div class="pjn">${escapeHtml(p.title)}</div>
            <div class="pjd">${escapeHtml(p.summary || p.description || "")}</div>
            <div class="ttgs">
              ${(p.tags ? p.tags.split(",") : ["Django", "Python", "Cloudflare"])
                .slice(0, 3)
                .map((t) => `<span class="ttg">${escapeHtml(t.trim())}</span>`)
                .join("")}
            </div>
          </div>
        </a>
      `
        )
        .join("")}
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
