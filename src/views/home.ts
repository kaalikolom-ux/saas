import { Product, Project, BlogPost } from "../types";

export interface HomeProps {
  products: Product[];
  projects: Project[];
  blogs: BlogPost[];
}

export function homeView({ products, projects, blogs }: HomeProps): string {
  const featuredProducts = products.filter((p) => p.is_featured || p.price > 0).slice(0, 6);
  const featuredProjects = projects.slice(0, 6);

  return `
<!-- HERO -->
<section id="hero">
  <div class="container">
    <div class="hg">
      <div>
        <div class="hey rv"><div class="dg"></div>Available for new projects</div>
        <p style="font-size:17px;color:var(--tx2);margin-bottom:6px" class="rv">Hi, I'm</p>
        <h1 class="hname rv"><span class="ag">Ifte Samul</span> 👋</h1>
        <p class="hsub rv">Sr. Software Engineer &amp; AI Automation Specialist</p>
        <p class="hdesc rv">Full stack developer with 6+ years of experience in Python, Django, HTMX, React, and Cloudflare. I build production-grade web applications, autonomous AI agent workflows, and scalable systems delivering high impact on time and within budget.</p>
        <div class="pills rv">
          <span class="pill"><span class="pd" style="background:#3776AB"></span>🐍 Python</span>
          <span class="pill"><span class="pd" style="background:#092E20"></span>⚡ Django</span>
          <span class="pill"><span class="pd" style="background:#61DAFB"></span>⚛️ React</span>
          <span class="pill"><span class="pd" style="background:#F7DF1E"></span>🟨 JavaScript</span>
          <span class="pill"><span class="pd" style="background:#336791"></span>🗄️ PostgreSQL</span>
          <span class="pill"><span class="pd" style="background:#F38020"></span>☁️ Cloudflare D1</span>
          <span class="pill"><span class="pd" style="background:#FF9900"></span>☁️ AWS</span>
          <span class="pill"><span class="pd" style="background:#37B24D"></span>🔄 Celery</span>
          <span class="pill"><span class="pd" style="background:#2496ED"></span>🐋 Docker</span>
        </div>
        <div class="hbtns rv">
          <a href="#contact" class="bp">⚡ Hire Me</a>
          <a href="/products/" class="bs">📚 Explore Products</a>
          <a href="/courses/" class="bs">🎓 Training Program</a>
        </div>
        <div class="hstats rv">
          <div class="si"><span class="sn" data-target="6" data-suffix="+">6+</span><div class="sl">Years Experience</div></div>
          <div class="si"><span class="sn" data-target="50" data-suffix="+">50+</span><div class="sl">Projects Built</div></div>
          <div class="si"><span class="sn" data-target="1000" data-suffix="+">1.2K+</span><div class="sl">Ebook Readers</div></div>
          <div class="si"><span class="sn" data-target="99" data-suffix="%">99%</span><div class="sl">Client Satisfaction</div></div>
        </div>
      </div>
      <div class="hr rvr">
        <div class="avf">
          <div class="avd"></div>
          <div><div class="avt">Available for work</div><div class="avs">Open to new opportunities & consulting.</div></div>
        </div>
        <div class="term" style="margin-top:52px">
          <div class="tb2"><div class="tc tc-r"></div><div class="tc tc-y"></div><div class="tc tc-g"></div><div class="tl2">ohy@dev ~ terminal</div></div>
          <div class="tbody">
            <div><span class="tpr">$</span><span class="tcm"> whoami</span></div>
            <span class="tog">Ifte Samul Ohy</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="tcm"> skills --all</span></div>
            <span class="toc">Django, Python, HTMX, Alpine, Cloudflare D1,<br>&nbsp;PostgreSQL, Redis, Docker, AI Agents</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="tcm"> status</span></div>
            <span class="tog">Building high-converting SaaS &amp;<br>&nbsp;helping developers level up 🚀</span>
            <div style="margin-top:8px"><span class="tpr">$</span><span class="cur"></span></div>
          </div>
        </div>
        <div class="fbs">
          <div class="fb" style="color:var(--ac);font-weight:700">dj</div>
          <div class="fb">🐍</div><div class="fb">⚡</div>
          <div class="fb" style="color:var(--tx2)">&lt;/&gt;</div>
        </div>
      </div>
    </div>
  </div>
  <div class="sd"><div class="sr2">↓</div><span>scroll</span></div>
</section>

<!-- SERVICES -->
<section id="services" class="sp">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">What I Do</div>
      <h2 class="stitle rv">Services &amp; Expertise</h2>
      <p class="sdesc rv" style="max-width:540px;margin:0 auto">Custom web development, business automation, and high-performance engineering tailored to your growth.</p>
    </div>
    <div class="svg">
      <div class="svc rv">
        <div class="svci">⚡</div>
        <div class="svcn">Django Web Development</div>
        <div class="svcd">Production-grade Django apps built to scale — SaaS, portals, marketplaces, and custom business tools with zero technical debt.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🤖</div>
        <div class="svcn">AI &amp; Automation Systems</div>
        <div class="svcd">Autonomous LLM agents, chatbots, lead qualification pipelines, data extraction bots, and workflow automation with Python.</div>
      </div>
      <div class="svc rv">
        <div class="svci">📈</div>
        <div class="svcn">Meta Ads + CAPI Setup</div>
        <div class="svcd">Server-side conversion tracking, Meta Pixel implementation, and Conversions API integration to maximise your ad return on investment.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🔌</div>
        <div class="svcn">REST API &amp; Serverless</div>
        <div class="svcd">Django REST Framework, FastAPI, and Cloudflare Workers APIs — JWT auth, OpenAPI docs, rate limiting, and millisecond latencies.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🐋</div>
        <div class="svcn">DevOps &amp; Cloudflare D1</div>
        <div class="svcd">Docker + Nginx production setup, CI/CD pipelines, serverless SQL with Cloudflare D1, and multi-region edge deployment.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🛡️</div>
        <div class="svcn">System Audits &amp; Optimization</div>
        <div class="svcd">Database query optimization, Redis caching strategies, security reviews, and legacy codebase refactoring.</div>
      </div>
    </div>
  </div>
</section>

<!-- PRICING -->
<section id="pricing" class="sp" style="background:linear-gradient(180deg,transparent,rgba(124,106,247,.02),transparent)">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">Hire Me</div>
      <h2 class="stitle rv">Flexible Packages</h2>
      <p class="sdesc rv" style="max-width:440px;margin:0 auto">Transparent pricing. No hidden fees. Pick the package that fits your needs.</p>
    </div>
    <div class="prg">
      <div class="prc rv">
        <div class="prpl">Hourly Support</div>
        <div class="prsb">Bug fixes, small features, consultations</div>
        <div class="prpr">৳1,500 <span class="pru">/ hour</span></div>
        <div class="prdv"></div>
        <ul class="prft">
          <li><span class="prch">✓</span>Quick turnaround (same day)</li>
          <li><span class="prch">✓</span>Bug fixes and small features</li>
          <li><span class="prch">✓</span>Code review and consultation</li>
          <li><span class="prch">✓</span>WhatsApp communication</li>
          <li><span class="prch">✓</span>No minimum hours</li>
          <li><span class="prch">✓</span>Dedicated project manager</li>
        </ul>
        <a href="#contact" class="prb ol">Book Hours</a>
      </div>
      
      <div class="prc feat rv">
        <div class="pp2">Most Popular</div>
        <div class="prpl">Full Stack Project</div>
        <div class="prsb">Complete web application built to spec</div>
        <div class="prpr">৳50,000 <span class="pru">/ project</span></div>
        <div class="prdv"></div>
        <ul class="prft">
          <li><span class="prch">✓</span>Complete Django / Fullstack application</li>
          <li><span class="prch">✓</span>PostgreSQL / Cloudflare D1 setup</li>
          <li><span class="prch">✓</span>Admin panel configuration</li>
          <li><span class="prch">✓</span>Background task queue</li>
          <li><span class="prch">✓</span>Production cloud deployment</li>
          <li><span class="prch">✓</span>14 days post-launch support</li>
          <li><span class="prch">✓</span>Source code + documentation</li>
          <li><span class="prch">✓</span>2-week delivery guarantee</li>
        </ul>
        <a href="#contact" class="prb sl2">⚡ Hire Now</a>
      </div>
      
      <div class="prc rv">
        <div class="prpl">AI Automation System</div>
        <div class="prsb">Django + AI integration for your business</div>
        <div class="prpr">৳80,000 <span class="pru">/ system</span></div>
        <div class="prdv"></div>
        <ul class="prft">
          <li><span class="prch">✓</span>Full Stack Project (everything above)</li>
          <li><span class="prch">✓</span>GPT-4 / Claude / Gemini integration</li>
          <li><span class="prch">✓</span>Custom autonomous AI workflow design</li>
          <li><span class="prch">✓</span>Meta CAPI conversion tracking</li>
          <li><span class="prch">✓</span>30 days post-launch support</li>
          <li><span class="prch">✓</span>Performance analytics setup</li>
          <li><span class="prch">✓</span>Training session included</li>
          <li><span class="prch">✓</span>Priority WhatsApp &amp; Call communication</li>
        </ul>
        <a href="#contact" class="prb ol">Get Started</a>
      </div>
    </div>
  </div>
</section>

<!-- FEATURED PROJECTS -->
<section id="projects" class="sp">
  <div class="container">
    <div class="sr">
      <div>
        <div class="lbl">Featured Projects</div>
        <h2 class="stitle rv" style="font-size:clamp(22px,2.5vw,32px);margin-bottom:0">What I've Built</h2>
      </div>
      <a href="/projects/" class="va">View All Projects →</a>
    </div>
    <div class="pjg">
      ${featuredProjects
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

<!-- DIGITAL PRODUCTS -->
<section id="products" class="sp">
  <div class="container">
    <div class="sr">
      <div>
        <div class="lbl">My Products</div>
        <h2 class="stitle rv" style="font-size:clamp(22px,2.5vw,32px);margin-bottom:0">Digital Products</h2>
      </div>
      <a href="/products/" class="va">View All →</a>
    </div>
    <div class="pdg">
      ${featuredProducts
        .map(
          (p) => `
        <div class="pdc rv" style="position:relative">
          <button type="button" class="bundle-toggle" data-bundle-toggle
                  data-bundle-type="product" data-bundle-slug="${p.slug}"
                  data-bundle-title="${escapeHtml(p.title)}" data-bundle-price="${p.discounted_price}"
                  aria-label="Add ${escapeHtml(p.title)} to bundle">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <a href="/products/${p.slug}/" style="display:block;text-decoration:none;color:inherit">
            <div class="pdcv pc1">
              <img src="${p.cover_image}" alt="${escapeHtml(p.title)}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
            </div>
            <div class="pdb">
              <div class="pdn">${escapeHtml(p.title)}</div>
              <div class="pdt">${escapeHtml(p.description || "")}</div>
              <div class="pdf">
                <span>
                  ${
                    p.price > p.discounted_price
                      ? `<span style="font-size:.8em;color:var(--tx3);text-decoration:line-through;margin-right:6px">৳${p.price}</span>`
                      : ""
                  }
                  <span class="pdp">৳${p.discounted_price}</span>
                </span>
                <span class="buyb">Buy Now</span>
              </div>
            </div>
          </a>
        </div>
      `
        )
        .join("")}
    </div>
  </div>
</section>

<!-- TRAINING COURSE BANNER -->
<section class="sp" style="background:var(--bg2);border-top:1px solid var(--bd);border-bottom:1px solid var(--bd)">
  <div class="container">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:32px;align-items:center">
      <div>
        <div class="lbl">Flagship Masterclass</div>
        <h2 style="font-size:clamp(24px,3vw,36px);margin-bottom:12px;font-weight:700">Modern AI Powered Fullstack Development</h2>
        <p style="color:var(--tx2);font-size:16px;line-height:1.7;margin-bottom:20px">
          এটা কোনো সাধারণ ভিডিও কোর্স না — ৪ মাসের ইনটেনসিভ ট্রেনিং। ৩ মাস প্রফেশনাল স্কিল শেখা, আর ১ মাস সরাসরি লাইভ ক্লায়েন্ট প্রজেক্ট ডেলিভারি।
        </p>
        <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
          <span class="pill">⏱️ ৪ মাস মেয়াদী</span>
          <span class="pill">💻 লাইভ কোডিং সেশন</span>
          <span class="pill">🚀 সরাসরি ক্লায়েন্ট প্রজেক্ট</span>
          <span class="pill">🏷️ ৫০% সীমিত ছাড়</span>
        </div>
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

<!-- TESTIMONIALS -->
<section id="testimonials" class="sp">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">What Clients Say</div>
      <h2 class="stitle rv">Client Testimonials</h2>
    </div>
    <div class="testg">
      <div class="testc rv">
        <div class="testq">"</div>
        <div class="tsts">★★★★★</div>
        <p class="testt">Ohy delivered our Django SaaS in record time. Clean architecture, incredible communication, and zero bugs at launch. He is our go-to engineer.</p>
        <div class="testa">
          <div class="testav" style="background:linear-gradient(135deg,var(--ac),#6254d8)">AH</div>
          <div><div class="testn">Ahmed Karim</div><div class="testl">Cairo, Egypt</div></div>
        </div>
      </div>
      <div class="testc rv">
        <div class="testq">"</div>
        <div class="tsts">★★★★★</div>
        <p class="testt">Built an AI-powered lead gen and workflow system for our digital agency. Monthly revenue increased 40% in the first 30 days. Highly recommended!</p>
        <div class="testa">
          <div class="testav" style="background:linear-gradient(135deg,var(--ac),#6254d8)">SO</div>
          <div><div class="testn">Sofia Andersen</div><div class="testl">Copenhagen, Denmark</div></div>
        </div>
      </div>
      <div class="testc rv">
        <div class="testq">"</div>
        <div class="tsts">★★★★★</div>
        <p class="testt">The e-commerce and Meta CAPI automation scripts saved us 20 hours a week. His deep understanding of backend engineering and prompt delivery is unmatched.</p>
        <div class="testa">
          <div class="testav" style="background:linear-gradient(135deg,var(--ac),#6254d8)">RK</div>
          <div><div class="testn">Rafiqul Islam</div><div class="testl">Dhaka, Bangladesh</div></div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- BLOG -->
<section id="blog" class="sp">
  <div class="container">
    <div class="sr">
      <div>
        <div class="lbl">Latest Articles</div>
        <h2 class="stitle rv" style="font-size:clamp(22px,2.5vw,32px);margin-bottom:0">From The Blog</h2>
      </div>
      <a href="/blog/" class="va">View All Posts →</a>
    </div>
    <div class="blg">
      ${blogs
        .slice(0, 3)
        .map(
          (b) => `
        <a href="/blog/${b.slug}/" class="blc rv" style="text-decoration:none;color:inherit">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">
            <span class="tg">${escapeHtml(b.category)}</span>
            <span style="font-size:12px;color:var(--tx3)">${escapeHtml(b.publish_date)}</span>
            <span style="font-size:12px;color:var(--tx3)">· ${escapeHtml(b.read_time)}</span>
          </div>
          <h3 style="font-size:17px;font-weight:600;margin-bottom:8px;line-height:1.4">${escapeHtml(b.title)}</h3>
          <p style="font-size:14px;color:var(--tx2);line-height:1.6;margin-bottom:16px">${escapeHtml(b.summary)}</p>
          <div style="font-size:13px;color:var(--ac);font-weight:600">Read Article →</div>
        </a>
      `
        )
        .join("")}
    </div>
  </div>
</section>

<!-- CONTACT -->
<section id="contact" class="sp">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">Get In Touch</div>
      <h2 class="stitle rv">Let's Work Together</h2>
      <p class="sdesc rv" style="max-width:500px;margin:0 auto">Have a project or looking for consulting? Send a message and let's get building.</p>
    </div>
    <div class="cg">
      <div class="rvl">
        <div class="cinfo">
          <div class="cit"><div class="cii">📞</div><div><div class="cil">Phone / WhatsApp</div><div class="civ">+8801797418758</div></div></div>
          <div class="cit"><div class="cii">📧</div><div><div class="cil">Email</div><div class="civ">ifte.samul@gmail.com</div></div></div>
          <div class="cit"><div class="cii">📍</div><div><div class="cil">Location</div><div class="civ">Paterbag, Dhaka 1236, Bangladesh</div></div></div>
          <div class="cit"><div class="cii">🟢</div><div><div class="cil">Availability</div><div class="civ" style="color:var(--gr)">Available 24/7 · Open to work</div></div></div>
        </div>
      </div>
      <div class="rvr">
        <form hx-post="/crm/contact/" hx-target="#form-result" hx-swap="innerHTML" class="cf" id="contactForm">
          <div id="form-result"></div>
          <div class="frow">
            <div class="fg">
              <label class="flbl">Your Name *</label>
              <input type="text" name="name" class="fi" placeholder="John Doe" required>
            </div>
            <div class="fg">
              <label class="flbl">Email *</label>
              <input type="email" name="email" class="fi" placeholder="john@example.com" required>
            </div>
          </div>
          <div class="frow">
            <div class="fg">
              <label class="flbl">Subject</label>
              <input type="text" name="subject" class="fi" placeholder="Project inquiry...">
            </div>
            <div class="fg">
              <label class="flbl">Package Interest</label>
              <select name="package" class="fi">
                <option value="Hourly Support">Hourly Support (৳1,500/hr)</option>
                <option value="Full Stack Project" selected>Full Stack Project (৳50,000)</option>
                <option value="AI Automation System">AI Automation System (৳80,000)</option>
                <option value="Masterclass Training">Masterclass Training (৳7,500)</option>
                <option value="Custom Consultation">Custom Consultation</option>
              </select>
            </div>
          </div>
          <div class="fg">
            <label class="flbl">Your Message *</label>
            <textarea name="message" class="fi" rows="4" placeholder="Tell me about your project, timeline, and goals..." required style="resize:vertical"></textarea>
          </div>
          <button type="submit" class="bp btn-full" style="padding:14px;font-size:15px">⚡ Send Message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section id="cta" class="sp">
  <div class="container">
    <div class="ctab rv">
      <h2 class="ctati">Have a Project in Mind?</h2>
      <p class="ctasb">Let's build something exceptional together. Fast delivery, clean code, scalable architecture.</p>
      <div class="ctabs">
        <a href="#contact" class="bp">⚡ Hire Me Now</a>
        <a href="https://wa.me/8801797418758" class="wab" target="_blank" rel="noopener">💬 Chat on WhatsApp</a>
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
