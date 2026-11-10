/* Premium spin-the-wheel. The server decides the prize (POST spin returns segment_index);
   this file only draws the campaign's wheel and animates it onto that segment. */
(function () {
  'use strict';
  var C = window.PPS;
  var pill = document.getElementById('ppsPill'), dlg = document.getElementById('ppsDlg');
  if (!C || !pill || !dlg || typeof dlg.showModal !== 'function') return;
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var BN = '০১২৩৪৫৬৭৮৯';
  function bn(n) { return String(n).replace(/\d/g, function (d) { return BN[+d]; }); }
  function q(s) { return dlg.querySelector(s); }
  function csrf() { var m = document.cookie.match(/(?:^|; )csrftoken=([^;]+)/); return m ? decodeURIComponent(m[1]) : ''; }
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }
  function tk(n) { return '৳' + Number(n).toLocaleString('en-US'); }

  var rot = q('[data-pps-rot]'), go = q('[data-pps-go]'), disc = q('.pps-disc'), ptr = q('.pps-pointer');
  var segs = [], slice = 0, angle = 0, busy = false, data = null, sound = false, actx = null, dismissed = false;
  var pillLabel = pill.querySelector('[data-pps-pill-label]'), won = pill.classList.contains('is-won');

  /* ── rolling 24h countdown (before a spin) ───────────────────────────
     Same localStorage key + rule as the classic offer fab (offers.js): the first
     visit starts a 24h window; when it runs out it rolls forward another 24h
     from the old deadline, so a reload never resets it early. */
  var DL_KEY = 'offer_fab_deadline_v1', DAY = 864e5, deadline = 0, clockT = 0;
  function currentDeadline() {
    var now = Date.now();
    if (!deadline) try { deadline = parseInt(localStorage.getItem(DL_KEY), 10) || 0; } catch (e) {}
    if (!deadline || deadline - now > DAY) deadline = now + DAY;
    else if (deadline <= now) deadline += Math.ceil((now - deadline + 1) / DAY) * DAY;
    try { localStorage.setItem(DL_KEY, String(deadline)); } catch (e) {}
    return deadline;
  }
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function clock() {
    var t = Math.floor(Math.max(0, currentDeadline() - Date.now()) / 1000),
        txt = bn(two(Math.floor(t / 3600)) + ':' + two(Math.floor(t / 60) % 60) + ':' + two(t % 60));
    [].forEach.call(document.querySelectorAll('[data-pps-clock]'), function (el) { el.textContent = txt; });
  }
  function showClock(on) {
    pill.querySelector('[data-pps-pill-timer]').hidden = !on;
    q('[data-pps-timer]').hidden = !on;
    clearInterval(clockT);
    if (on) { clock(); clockT = setInterval(clock, 1000); }
  }
  showClock(!won);

  /* ── wheel ───────────────────────────────────────────────────────── */
  function pt(r, a) { a = a * Math.PI / 180; return (r * Math.sin(a)).toFixed(2) + ' ' + (-r * Math.cos(a)).toFixed(2); }
  function ink(hex) {
    var h = (hex || '#888').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&');
    var c = [0, 2, 4].map(function (i) { var v = parseInt(h.substr(i, 2), 16) / 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    return (.2126 * c[0] + .7152 * c[1] + .0722 * c[2]) > .35 ? '#0D1117' : '#FFFFFF';
  }
  function draw(list) {
    segs = list; slice = 360 / list.length;
    var out = '';
    list.forEach(function (s, i) {
      var a = i * slice, b = a + slice, mid = a + slice / 2,
          col = /^#[0-9a-f]{3,8}$/i.test(s.color || '') ? s.color : '#2DD4BF', words = esc(s.label).split(' ');
      out += '<path d="M0 0L' + pt(100, a) + 'A100 100 0 ' + (slice > 180 ? 1 : 0) + ' 1 ' + pt(100, b) + 'Z" fill="' + col + '"/>' +
        // Lower half: turn the label 180° so it never reads upside down.
        '<g transform="rotate(' + mid + ')"><text y="-70" fill="' + ink(col) + '" text-anchor="middle"' +
        (mid > 90 && mid < 270 ? ' transform="rotate(180 0 -64)"' : '') + '>' +
        '<tspan x="0" font-size="15" font-weight="700">' + words[0] + '</tspan>' +
        (words[1] ? '<tspan x="0" dy="14" font-size="10">' + words.slice(1).join(' ') + '</tspan>' : '') + '</text></g>';
    });
    rot.innerHTML = out + '<circle r="100" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/>';
    setAngle(angle);
  }
  function setAngle(a) { angle = a; rot.setAttribute('transform', 'rotate(' + a.toFixed(2) + ')'); }
  function under(a) { return Math.floor((((-a) % 360) + 360) % 360 / slice); }

  function tick() {
    ptr.classList.remove('is-tick'); void ptr.getBoundingClientRect(); ptr.classList.add('is-tick');
    if (!sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = 1400; g.gain.setValueAtTime(.06, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, actx.currentTime + .05);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + .05);
    } catch (e) { sound = false; }
  }

  /* Ease: long deceleration to slightly past the target, then settle back. */
  function animateTo(target, done) {
    if (RM) { setAngle(target); done(); return; }
    var from = angle, over = slice * .12, dur = 5200, t0 = performance.now(), last = under(from), fin = false;
    function finish() { if (fin) return; fin = true; setAngle(target); done(); }
    setTimeout(finish, dur + 400);                       // never hang, even if frames stall
    (function step(now) {
      if (fin) return;
      var p = Math.min((now - t0) / dur, 1), a;
      if (p < .9) { var k = p / .9; a = from + (target + over - from) * (1 - Math.pow(1 - k, 4)); }
      else { var k2 = (p - .9) / .1; a = target + over * (1 - (1 - Math.cos(Math.PI * k2)) / 2); }
      setAngle(a);
      var u = under(a); if (u !== last) { last = u; tick(); }
      if (p < 1) requestAnimationFrame(step); else finish();
    })(t0);
  }
  function targetFor(i) {
    var centre = i * slice + slice / 2, jitter = (Math.random() - .5) * slice * .6;
    var base = angle + 360 * 5;
    return base + ((((-centre + jitter) - base) % 360) + 360) % 360;
  }

  /* ── server calls ────────────────────────────────────────────────── */
  function get(url) {
    return fetch(url, { credentials: 'same-origin', headers: { 'X-Requested-With': 'fetch' } })
      .then(function (r) { if (!r.ok) throw r; return r.json(); });
  }
  function post(url) {
    return fetch(url, { method: 'POST', credentials: 'same-origin',
      headers: { 'X-CSRFToken': csrf(), 'X-Requested-With': 'fetch' } })
      .then(function (r) { if (!r.ok) throw r; return r.json(); });
  }
  function dismiss() { if (dismissed) return; dismissed = true; post(C.dismiss).catch(function () {}); }
  function err(on) { q('[data-pps-err]').hidden = !on; }

  function spin() {
    if (busy || !segs.length) return;
    busy = true; go.disabled = true; err(false);
    post(C.spin).then(function (res) {
      animateTo(targetFor(res.segment_index || 0), function () { result(res.percent, res.products || []); });
    }).catch(function () { busy = false; go.disabled = false; err(true); });
  }

  /* ── result ──────────────────────────────────────────────────────── */
  function result(pct, products) {
    busy = false;
    q('[data-pps-step="wheel"]').hidden = true;
    var box = q('[data-pps-step="result"]'); box.hidden = false;
    var won = pct > 0;
    q('[data-pps-kicker]').textContent = won ? 'অভিনন্দন!' : 'এবার হলো না';
    q('[data-pps-won]').textContent = won ? 'তুমি পেয়েছ ' + bn(pct) + '% ছাড়' : 'পরের বার নিশ্চয়ই হবে!';
    q('[data-pps-explain]').textContent = won
      ? 'যেকোনো ' + bn(minN()) + 'টি বা বেশি প্রোডাক্ট একসাথে কিনলে চেকআউটে ছাড়টা নিজে থেকেই কেটে যাবে — কোনো কোড লাগবে না।' +
        (data && data.valid_days ? ' স্পিনের পর ' + bn(data.valid_days) + ' দিন পর্যন্ত কার্যকর।' : '')
      : 'মন খারাপ কোরো না — আমাদের প্রোডাক্টগুলো এমনিতেও কাজের।';
    pillLabel.textContent = won ? 'তোমার ছাড়: ' + bn(pct) + '%' : 'স্পিন করে ছাড় নাও';
    pill.classList.toggle('is-won', won);
    showClock(!won);
    q('[data-pps-soft]').hidden = won;
    picks(won ? products : [], pct);
    q('[data-pps-won]').focus({ preventScroll: true });
    if (won) { confetti(); if (navigator.vibrate) try { navigator.vibrate([30, 40, 30]); } catch (e) {} }
  }
  // Fewest books that unlock the discount — OfferCampaign.min_items (2+).
  function minN() { return Math.max(2, (data && data.min_items) || 2); }
  function picks(products, pct) {
    var wrap = q('[data-pps-picks]'), list = q('[data-pps-list]'), buy = q('[data-pps-buy]'), min = minN();
    wrap.hidden = products.length < min;
    q('[data-pps-picks-h]').textContent = 'যেকোনো ' + bn(min) + 'টি বা বেশি বেছে নাও';
    list.innerHTML = '';
    products.forEach(function (p) {
      var li = document.createElement('li'), id = 'pps-' + p.slug;
      li.innerHTML = '<input type="checkbox" checked id="' + id + '"><label for="' + id + '"><span class="pps-list__t"></span>' +
        '<span class="pps-list__p"><b>' + tk(p.discounted_price) + '</b>' +
        (Number(p.price) > Number(p.discounted_price) ? '<s>' + tk(p.price) + '</s>' : '') + '</span></label>';
      li.querySelector('.pps-list__t').textContent = p.title;
      li.querySelector('input')._p = p;
      list.appendChild(li);
    });
    function chosen() { return [].slice.call(list.querySelectorAll('input:checked')).map(function (i) { return i._p; }); }
    list.onchange = function () {
      var sel = chosen(), n = sel.length;
      buy.disabled = n < min;
      sum(sel, pct);
      q('[data-pps-buylabel]').textContent = n >= min ? 'এই ছাড়ে কিনে ফেলো (' + bn(n) + 'টি)' : 'এই ছাড়ে কিনে ফেলো';
    };
    list.onchange();                                   // everything starts ticked
    buy.onclick = function () {
      // Same contract as static/js/bundle.js / offers.js: bundle_v1 + items_json.
      var sel = chosen(); if (sel.length < min) return;
      try { localStorage.setItem('bundle_v1', JSON.stringify(sel.map(function (p) {
        return { type: 'product', slug: p.slug, title: p.title, price: p.discounted_price }; }))); } catch (e) {}
      location.href = (window.BUNDLE_CHECKOUT_URL || '/checkout/bundle/') + '?items_json=' +
        encodeURIComponent(JSON.stringify(sel.map(function (p) { return { item_type: 'product', slug: p.slug }; })));
    };
  }

  /* What the bundle checkout will charge for this selection — same rule as
     BundleCheckoutView: list prices added up, % off, floored to a whole Taka. */
  function sum(sel, pct) {
    var paisa = sel.reduce(function (a, p) { return a + Math.round(Number(p.price) * 100); }, 0),
        on = sel.length >= minN() && pct > 0,
        total = on ? Math.floor(paisa * (100 - pct) / 10000) : paisa / 100,
        sub = paisa / 100, off = sub - total;
    q('[data-pps-count]').textContent = '(' + bn(sel.length) + 'টি)';
    q('[data-pps-subtotal]').textContent = tk(sub);
    q('[data-pps-pct]').textContent = '(' + bn(pct) + '%)';
    q('[data-pps-off]').textContent = on ? '−' + tk(off) : '—';
    q('[data-pps-total]').textContent = tk(total);
    var save = q('[data-pps-save]');
    save.textContent = on ? 'তুমি বাঁচাচ্ছ ' + tk(off) : 'ছাড় পেতে কমপক্ষে ' + bn(minN()) + 'টি বেছে নাও';
    save.classList.toggle('is-hint', !on);
  }

  function confetti() {
    if (RM) return;
    var cv = q('.pps-confetti'), r = cv.getBoundingClientRect(), x = cv.getContext && cv.getContext('2d');
    if (!x) return;
    cv.width = r.width; cv.height = r.height;
    var cols = ['#2DD4BF', '#FBBF24', '#F472B6', '#A78BFA', '#34D399'], ps = [];
    for (var i = 0; i < 110; i++) ps.push({ x: r.width / 2, y: r.height * .35, vx: (Math.random() - .5) * 9,
      vy: -Math.random() * 9 - 3, s: 4 + Math.random() * 5, c: cols[i % 5], a: Math.random() * 6 });
    var t0 = performance.now();
    (function f(now) {
      var t = (now - t0) / 1600; x.clearRect(0, 0, cv.width, cv.height);
      if (t >= 1) return;
      ps.forEach(function (p) {
        p.vy += .28; p.x += p.vx; p.y += p.vy; p.a += .2;
        x.globalAlpha = 1 - t; x.fillStyle = p.c;
        x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
      });
      requestAnimationFrame(f);
    })(t0);
  }

  /* ── open / close ────────────────────────────────────────────────── */
  function open(manual) {
    return get(C.data + (manual ? '?manual=1' : '')).then(function (d) {
      if (!d.show || d.mode !== 'spinner') return false;
      data = d;
      if (d.heading) q('[data-pps-heading]').textContent = d.heading;
      q('[data-pps-sub]').textContent = d.subheading || 'একসাথে ' + bn(minN()) + 'টি বা বেশি প্রোডাক্ট কিনলে এই ছাড় পাবে।';
      draw(d.segments || []);
      if (d.already_spun) result(d.discount_percent, d.products || []);
      else { q('[data-pps-step="wheel"]').hidden = false; q('[data-pps-step="result"]').hidden = true; go.disabled = false; }
      if (!dlg.open) dlg.showModal();
      if (!d.already_spun) go.focus();
      return true;
    }).catch(function () { return false; });
  }
  pill.addEventListener('click', function () { open(true); });
  q('.pps-close').addEventListener('click', function () { dlg.close(); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', function () { dismiss(); pill.focus({ preventScroll: true }); });
  go.addEventListener('click', spin);
  var mute = q('.pps-mute');
  mute.addEventListener('click', function () {
    sound = !sound; mute.setAttribute('aria-pressed', sound ? 'true' : 'false');
    mute.setAttribute('aria-label', sound ? 'শব্দ বন্ধ করো' : 'শব্দ চালু করো');
  });

  /* Drag / flick the wheel to spin */
  var drag = null;
  function ang(e) { var b = disc.getBoundingClientRect(); return Math.atan2(e.clientX - (b.left + b.width / 2), -(e.clientY - (b.top + b.height / 2))) * 180 / Math.PI; }
  disc.addEventListener('pointerdown', function (e) { if (busy) return; drag = { a: ang(e), start: angle, moved: 0 }; disc.setPointerCapture(e.pointerId); });
  disc.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var d = ang(e) - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360;
    drag.moved = d; setAngle(drag.start + d);
  });
  function release() { if (!drag) return; var m = Math.abs(drag.moved); drag = null; if (m > 15) spin(); }
  disc.addEventListener('pointerup', release);
  disc.addEventListener('pointercancel', release);

  /* Keep the pill above whatever bar sits at the bottom of this page (product
     page buy bar, checkout pay bar, classic sticky CTA, bundle bar). */
  var BARS = '#ppBar, #coBar, .il-sticky, .sticky-cta, #bundleStickyBar, .mbn';
  function lift() {
    var h = 0;
    [].forEach.call(document.querySelectorAll(BARS), function (b) {
      var cs = getComputedStyle(b), r = b.getBoundingClientRect();
      if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return;
      if (r.bottom >= innerHeight - 2 && r.top < innerHeight - 2) h = Math.max(h, innerHeight - r.top);
    });
    document.documentElement.style.setProperty('--ppl-lift', Math.round(h) + 'px');
  }
  var lt = 0;
  function soon() { clearTimeout(lt); lt = setTimeout(lift, 120); }
  window.addEventListener('scroll', soon, { passive: true });
  window.addEventListener('resize', soon);
  if ('MutationObserver' in window) new MutationObserver(soon).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
  lift();

  /* Auto-open once per visitor: right away on the product list / a product page
     (C.soon), elsewhere only after real engagement (20s or half the page). */
  if (C.auto && C.soon) {
    setTimeout(function () {
      if (document.querySelector('dialog[open]')) return;
      open(false).then(function (shown) { if (shown) dismiss(); });
    }, 1200);
  } else if (C.auto) {
    var fired = false;
    var fire = function () {
      if (fired || document.querySelector('dialog[open]')) return;
      fired = true; window.removeEventListener('scroll', onScroll);
      open(false).then(function (shown) { if (shown) dismiss(); });
    };
    var onScroll = function () {
      var h = document.documentElement;
      if ((h.scrollTop + innerHeight) / h.scrollHeight >= .5) fire();
    };
    setTimeout(fire, 20000);
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
