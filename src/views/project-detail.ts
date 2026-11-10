import { Project } from "../types";

export interface ProjectDetailProps {
  project: Project;
  relatedProjects: Project[];
}

export function projectDetailView({ project, relatedProjects }: ProjectDetailProps): string {
  const tagsList = project.tags
    ? project.tags.split(",").map((t) => t.trim())
    : ["Python", "Django", "PostgreSQL", "Cloudflare", "Docker"];

  return `
<section class="sp" style="padding-top:40px">
  <div class="container" style="max-width:860px">
    
    <!-- BREADCRUMBS -->
    <nav style="display:flex;align-items:center;gap:8px;font-size:14px;color:var(--tx3);margin-bottom:24px">
      <a href="/" style="color:var(--tx2);text-decoration:none">হোম</a>
      <span>/</span>
      <a href="/projects/" style="color:var(--tx2);text-decoration:none">Projects</a>
      <span>/</span>
      <span style="color:var(--tx)">${escapeHtml(project.title)}</span>
    </nav>

    <div style="background:var(--bg2);border:1px solid var(--bd);border-radius:14px;padding:32px;margin-bottom:32px">
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px">
        <div style="font-size:40px">${project.icon || "📊"}</div>
        <div>
          <h1 style="font-size:clamp(24px,3vw,34px);font-weight:700;margin:0 0 6px">${escapeHtml(project.title)}</h1>
          <span class="tg">${escapeHtml(project.category || "Full Stack Application")}</span>
        </div>
      </div>

      <p style="font-size:16px;color:var(--tx2);line-height:1.7;margin-bottom:24px">
        ${escapeHtml(project.description || project.summary || "")}
      </p>

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:24px">
        ${tagsList.map((t) => `<span class="pill">⚡ ${escapeHtml(t)}</span>`).join("")}
      </div>

      <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;padding-top:16px;border-top:1px solid var(--bd)">
        <a href="#contact" class="bp">⚡ Request Similar Project</a>
        <a href="https://github.com/iftesamulohy" target="_blank" rel="noopener" class="bs">GitHub Profile →</a>
      </div>
    </div>

    <!-- ARCHITECTURE HIGHLIGHTS -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;margin-bottom:40px">
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
        <div style="font-size:24px;margin-bottom:8px">🚀 Performance</div>
        <p style="font-size:14px;color:var(--tx2);line-height:1.6;margin:0">Optimized query patterns, response latencies under 50ms, and zero layout shift.</p>
      </div>
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
        <div style="font-size:24px;margin-bottom:8px">🛡️ Security</div>
        <p style="font-size:14px;color:var(--tx2);line-height:1.6;margin:0">CSRF protection, strict CORS headers, sanitized inputs, and role-based permissions.</p>
      </div>
      <div style="background:var(--bg);border:1px solid var(--bd);border-radius:10px;padding:20px">
        <div style="font-size:24px;margin-bottom:8px">📈 Scalability</div>
        <p style="font-size:14px;color:var(--tx2);line-height:1.6;margin:0">Stateless backend architecture ready for horizontal scaling and multi-region deployment.</p>
      </div>
    </div>

    <!-- MORE PROJECTS -->
    ${
      relatedProjects.length > 0
        ? `
    <div style="padding-top:20px;border-top:1px solid var(--bd)">
      <h3 style="font-size:20px;font-weight:600;margin-bottom:16px">More Projects</h3>
      <div class="pjg">
        ${relatedProjects
          .slice(0, 3)
          .map(
            (rp) => `
          <a href="/projects/${rp.slug}/" class="pjc rv" style="text-decoration:none;color:inherit">
            <div class="pjt pt1">${rp.icon || "📊"}</div>
            <div class="pjb">
              <div class="pjn">${escapeHtml(rp.title)}</div>
              <div class="pjd">${escapeHtml(rp.summary || "")}</div>
            </div>
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
