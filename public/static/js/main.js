/* ===================== OHY.DEV — MAIN JS ===================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll reveal ──────────────────────────────────────────── */
  const allRv = document.querySelectorAll('.rv,.rvl,.rvr');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('vis'), i * 55);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  allRv.forEach(el => obs.observe(el));

  /* ── Counter animation ──────────────────────────────────────── */
  function runCounters() {
    document.querySelectorAll('.sn').forEach(el => {
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const start  = performance.now();
      const dur    = 1600;
      function step(now) {
        const p    = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  const statsEl = document.querySelector('.hstats');
  if (statsEl) {
    const co = new IntersectionObserver(e => {
      if (e[0].isIntersecting) { runCounters(); co.disconnect(); }
    }, { threshold: .5 });
    co.observe(statsEl);
  }

  /* ── Skill bars ─────────────────────────────────────────────── */
  const sg = document.getElementById('skillsGrid');
  if (sg) {
    const so = new IntersectionObserver(e => {
      if (e[0].isIntersecting) {
        sg.querySelectorAll('.skfill').forEach(b =>
          setTimeout(() => b.style.width = b.dataset.width + '%', 200));
        so.disconnect();
      }
    }, { threshold: .15 });
    so.observe(sg);
  }

  /* ── Nav scroll effect ──────────────────────────────────────── */
  const navbar  = document.getElementById('navbar');
  const sctop   = document.getElementById('sctop');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 40);
    if (sctop)  sctop.classList.toggle('show', y > 400);
  }, { passive: true });

  /* ── Active nav on scroll ───────────────────────────────────── */
  const secs = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let cur = '';
    secs.forEach(s => { if (window.scrollY >= s.offsetTop - 80) cur = s.id; });
    document.querySelectorAll('.nl a').forEach(a => {
      const href = a.getAttribute('href') || '';
      a.classList.toggle('active',
        href === '#' + cur || (cur === '' && (href === '#' || href === '/')));
    });
  }, { passive: true });

  /* ── Theme toggle (light / dark) ────────────────────────────── */
  const ttLabel = document.querySelector('.theme-toggle-mm .tt-label');
  function syncThemeLabel() {
    if (!ttLabel) return;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ttLabel.textContent = isLight ? 'Switch to dark' : 'Switch to light';
  }
  function toggleTheme() {
    const cur  = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const next = cur === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncThemeLabel();
  }
  syncThemeLabel();
  const themeBtn   = document.getElementById('themeToggle');
  const themeBtnMM = document.getElementById('themeToggleMM');
  if (themeBtn)   themeBtn.addEventListener('click', toggleTheme);
  if (themeBtnMM) themeBtnMM.addEventListener('click', toggleTheme);

  /* ── Mobile menu ────────────────────────────────────────────── */
  const hbtn  = document.getElementById('hbtn');
  const mmenu = document.getElementById('mmenu');
  if (hbtn && mmenu) {
    hbtn.addEventListener('click', () => {
      hbtn.classList.toggle('open');
      mmenu.classList.toggle('open');
    });
  }
  window.cmm = function() {
    if (hbtn)  hbtn.classList.remove('open');
    if (mmenu) mmenu.classList.remove('open');
  };

  /* ── Smooth scroll ──────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  /* ── Card hover radial glow ─────────────────────────────────── */
  document.querySelectorAll('.svc,.pjc,.pdc,.testc,.blc,.prc,.skc').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
      const y = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
      const isFeat = card.classList.contains('feat');
      card.style.background = isFeat
        ? `radial-gradient(circle at ${x}% ${y}%, rgba(124,106,247,.18), transparent 60%), linear-gradient(160deg,rgba(124,106,247,.08),rgba(34,211,238,.04),var(--bg2))`
        : `radial-gradient(circle at ${x}% ${y}%, rgba(124,106,247,.1), transparent 55%)`;
    });
    card.addEventListener('mouseleave', () => { card.style.background = ''; });
  });

  /* ── GSAP parallax (optional, only if GSAP loaded) ─────────── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.orb1', { yPercent: 20, ease: 'none', scrollTrigger: { scrub: 1.5 } });
    gsap.to('.orb2', { yPercent: -15, ease: 'none', scrollTrigger: { scrub: 2 } });
  }

  /* ── Landing spotlight video (autoplay when scrolled into view) ─ */
  (function initSpotlight() {
    const players = document.querySelectorAll('.spot-player');
    if (!players.length) return;

    // Browsers block un-muted autoplay until the user has interacted with the
    // page. So the video autoplays muted, and the moment the visitor does
    // ANYTHING (tap / click / key) we switch sound on automatically — no extra
    // click needed. The 🔊 toggle lets them turn it back off.
    let interacted = false;

    /* ---------- YouTube (via IFrame API for real sound control) ---------- */
    const ytEls = [...players].filter(p => p.dataset.kind === 'youtube');
    const yt = new Map(); // el -> YT.Player

    function syncBtn(el) {
      const p = yt.get(el), btn = el.querySelector('.spot-sound');
      if (!p || !btn) return;
      let muted = true;
      try { muted = p.isMuted(); } catch (e) {}
      btn.classList.toggle('off', muted);
      btn.innerHTML = muted ? '🔇 <span>সাউন্ড বন্ধ</span>' : '🔊 <span>সাউন্ড চালু</span>';
    }
    function soundOn(el) {
      const p = yt.get(el); if (!p) return;
      try { p.unMute(); p.setVolume(100); } catch (e) {}
      syncBtn(el);
    }

    function buildYT(el) {
      if (yt.has(el) || !window.YT || !YT.Player) return;
      const holder = document.createElement('div');
      el.insertBefore(holder, el.firstChild);
      yt.set(el, new YT.Player(holder, {
        videoId: el.dataset.vid,
        playerVars: { autoplay: 0, mute: 0, controls: 1, rel: 0,
                      modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
        events: {
          onReady: () => { el._ready = true; if (el._want) playYT(el); },
          onStateChange: (e) => {
            const poster = el.querySelector('.spot-poster');
            if (e.data === YT.PlayerState.PLAYING && poster) poster.style.display = 'none';
            syncBtn(el);
          }
        }
      }));
    }
    function playYT(el) {
      const p = yt.get(el);
      if (!p || !el._ready) { el._want = true; return; }
      if (el._userOff) { try { p.mute(); p.playVideo(); } catch (e) {} syncBtn(el); return; }
      // Sound ON by default — try to start with audio right away.
      try { p.unMute(); p.setVolume(100); p.playVideo(); } catch (e) {}
      syncBtn(el);
      // If the browser refused un-muted autoplay the video won't be playing a
      // moment later — fall back to muted so it at least runs, then the first
      // user gesture flips sound back on.
      clearTimeout(el._chk);
      el._chk = setTimeout(() => {
        let st = -1;
        try { st = p.getPlayerState(); } catch (e) {}
        if (st !== YT.PlayerState.PLAYING && !el._userOff) {
          try { p.mute(); p.playVideo(); } catch (e) {}
          syncBtn(el);
        }
      }, 700);
    }
    function pauseYT(el) {
      const p = yt.get(el);
      if (p) { try { p.pauseVideo(); } catch (e) {} }
    }

    // First interaction anywhere → flip sound on for every video not muted by hand.
    function onFirstGesture() {
      interacted = true;
      ytEls.forEach(el => { if (!el._userOff) soundOn(el); });
    }
    ['pointerdown', 'touchstart', 'keydown'].forEach(ev =>
      window.addEventListener(ev, onFirstGesture, { once: true, passive: true }));

    if (ytEls.length) {
      if (!window.YT) {
        const s = document.createElement('script');
        s.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(s);
      }
      const ready = () => ytEls.forEach(buildYT);
      if (window.YT && YT.Player) ready();
      else {
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => { if (prev) prev(); ready(); };
      }
      ytEls.forEach(el => {
        const poster = el.querySelector('.spot-poster');
        if (poster) poster.addEventListener('click', () => { interacted = true; el._userOff = false; playYT(el); });
        const btn = el.querySelector('.spot-sound');
        if (btn) btn.addEventListener('click', () => {
          const p = yt.get(el); if (!p) return;
          let muted = true;
          try { muted = p.isMuted(); } catch (e) {}
          if (muted) { el._userOff = false; interacted = true; soundOn(el); }
          else { el._userOff = true; try { p.mute(); } catch (e) {} syncBtn(el); }
        });
      });
    }

    /* ---------- Facebook / other embeds (lazy iframe) ---------- */
    function buildFrame(el) {
      if (el._frame) return;
      const src = el.dataset.src;
      const f = document.createElement('iframe');
      f.src = /autoplay=/.test(src) ? src
        : src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
      f.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';
      f.allowFullscreen = true;
      el.appendChild(f);
      el._frame = f;
      const poster = el.querySelector('.spot-poster');
      if (poster) poster.style.display = 'none';
    }
    function killFrame(el) {   // stop stray audio once it scrolls away
      if (el._frame) { el._frame.remove(); el._frame = null; }
    }

    /* ---------- One observer drives play/pause for all ---------- */
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        const el = e.target, inView = e.isIntersecting && e.intersectionRatio >= 0.5;
        if (el.dataset.kind === 'youtube') { inView ? playYT(el) : pauseYT(el); }
        else { inView ? buildFrame(el) : killFrame(el); }
      });
    }, { threshold: [0, 0.5] });
    players.forEach(el => io.observe(el));
  })();

  /* ── HTMX event feedback ────────────────────────────────────── */
  document.body.addEventListener('htmx:afterRequest', (e) => {
    const btn = e.target.querySelector('.fsub');
    if (btn && e.detail.successful) {
      btn.textContent = '✓ Sent!';
      btn.style.background = 'linear-gradient(135deg,var(--gr),#16a34a)';
      setTimeout(() => {
        btn.textContent = '🚀 Send Message';
        btn.style.background = '';
      }, 3000);
    }
  });

});
