export function servicesView(): string {
  return `
<section class="sp" style="padding-top:40px">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">What I Offer</div>
      <h1 class="stitle rv" style="font-size:clamp(28px,3.5vw,42px)">Services &amp; Expertise</h1>
      <p class="sdesc rv" style="max-width:540px;margin:0 auto">From architectural design to full-scale deployment, I build robust, high-performance web systems tailored to your business goals.</p>
    </div>

    <div class="svg">
      <div class="svc rv">
        <div class="svci">⚡</div>
        <div class="svcn">Django Web Development</div>
        <div class="svcd">Production-grade Django applications built to scale — custom SaaS, multi-tenant portals, online marketplaces, and enterprise business tools with clean, modular architecture.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🤖</div>
        <div class="svcn">AI &amp; Automation Systems</div>
        <div class="svcd">Autonomous LLM agents, intelligent conversational bots, lead qualification pipelines, data extraction bots, and automated business workflows with Python and modern AI APIs.</div>
      </div>
      <div class="svc rv">
        <div class="svci">📈</div>
        <div class="svcn">Meta Ads + CAPI Integration</div>
        <div class="svcd">Server-side conversion tracking, Meta Pixel implementation, and Conversions API (CAPI) setup to eliminate ad tracking loss and maximize your advertising ROI.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🔌</div>
        <div class="svcn">REST API &amp; Serverless</div>
        <div class="svcd">Django REST Framework, FastAPI, and Cloudflare Workers serverless APIs with JWT authentication, OpenAPI specs, rate limiting, and millisecond edge responses.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🐋</div>
        <div class="svcn">DevOps &amp; Infrastructure</div>
        <div class="svcd">Docker containerization, Nginx configuration, CI/CD automated pipelines, and cloud hosting on AWS, Cloudflare, DigitalOcean, or Hetzner.</div>
      </div>
      <div class="svc rv">
        <div class="svci">🛡️</div>
        <div class="svcn">Performance Audits &amp; Tuning</div>
        <div class="svcd">PostgreSQL query optimization, Redis caching strategies, code reviews, security hardening, and eliminating technical debt in legacy codebases.</div>
      </div>
    </div>

    <div style="text-align:center;margin-top:48px">
      <a href="/services/pricing/" class="bp">View Pricing Packages →</a>
      <a href="/#contact" class="bs" style="margin-left:12px">Schedule a Consultation</a>
    </div>
  </div>
</section>
`;
}

export function pricingView(): string {
  return `
<section class="sp" style="padding-top:40px">
  <div class="container">
    <div class="sh">
      <div class="lbl" style="justify-content:center">Transparent Pricing</div>
      <h1 class="stitle rv" style="font-size:clamp(28px,3.5vw,42px)">Flexible Packages</h1>
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
        <a href="/#contact" class="prb ol">Book Hours</a>
      </div>
      
      <div class="prc feat rv">
        <div class="pp2">Most Popular</div>
        <div class="prpl">Full Stack Project</div>
        <div class="prsb">Complete web application built to spec</div>
        <div class="prpr">৳50,000 <span class="pru">/ project</span></div>
        <div class="prdv"></div>
        <ul class="prft">
          <li><span class="prch">✓</span>Complete Django application</li>
          <li><span class="prch">✓</span>PostgreSQL / Cloudflare D1 setup</li>
          <li><span class="prch">✓</span>Admin panel configuration</li>
          <li><span class="prch">✓</span>Celery / Worker background tasks</li>
          <li><span class="prch">✓</span>Docker production deployment</li>
          <li><span class="prch">✓</span>14 days post-launch support</li>
          <li><span class="prch">✓</span>Source code + documentation</li>
          <li><span class="prch">✓</span>2-week delivery guarantee</li>
        </ul>
        <a href="/#contact" class="prb sl2">⚡ Hire Now</a>
      </div>
      
      <div class="prc rv">
        <div class="prpl">AI Automation System</div>
        <div class="prsb">Django + AI integration for your business</div>
        <div class="prpr">৳80,000 <span class="pru">/ system</span></div>
        <div class="prdv"></div>
        <ul class="prft">
          <li><span class="prch">✓</span>Full Stack Project (everything above)</li>
          <li><span class="prch">✓</span>GPT-4 / Claude / Gemini integration</li>
          <li><span class="prch">✓</span>Custom AI workflow &amp; agent design</li>
          <li><span class="prch">✓</span>Meta CAPI conversion tracking</li>
          <li><span class="prch">✓</span>30 days post-launch support</li>
          <li><span class="prch">✓</span>Performance analytics setup</li>
          <li><span class="prch">✓</span>Training session included</li>
          <li><span class="prch">✓</span>Priority WhatsApp &amp; Call communication</li>
        </ul>
        <a href="/#contact" class="prb ol">Get Started</a>
      </div>
    </div>
  </div>
</section>
`;
}
