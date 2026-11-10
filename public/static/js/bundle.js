/**
 * static/js/bundle.js
 * "Buy several products/courses in one checkout" — client-side selection only.
 *
 * Loaded globally (templates/base.html) so the sticky bar can appear on any
 * page, even one with no [data-bundle-toggle] of its own. Selection lives in
 * localStorage purely for instant UI (item count, running total) — the
 * server never trusts it: BundleCheckoutView re-resolves every {item_type,
 * slug} against the database and reprices from there (see
 * apps/payments/views.py _resolve_bundle_items). A tampered selection can
 * change which real items end up in the cart, never what they cost.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'bundle_v1';
  var MAX_ITEMS = 20;
  // Set by templates/base.html via {% url 'checkout_bundle' %} — apps.payments's
  // URLs are mounted under a prefix (/payments/...), so this must never be
  // hardcoded here; the fallback only covers the (currently untrue) case of
  // that prefix disappearing entirely.
  var CHECKOUT_URL = window.BUNDLE_CHECKOUT_URL || '/checkout/bundle/';
  // One item has no bundle: it goes to that item's own checkout. Same reason as
  // above: a template-set URL, with ITEM_TYPE / ITEM_SLUG to fill in.
  var ITEM_CHECKOUT_URL = window.ITEM_CHECKOUT_URL || '';
  var SHOP_URL = window.SHOP_URL || '/';

  function readSelection() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function writeSelection(list) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
    } catch (e) { /* private mode / storage full — selection just won't persist */ }
  }

  function isSelected(list, type, slug) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].type === type && list[i].slug === slug) return true;
    }
    return false;
  }

  function toggleItem(type, slug, title, price) {
    var list = readSelection();
    if (isSelected(list, type, slug)) {
      list = list.filter(function (it) { return !(it.type === type && it.slug === slug); });
    } else if (list.length < MAX_ITEMS) {
      list.push({ type: type, slug: slug, title: title, price: price });
    }
    writeSelection(list);
  }

  function bn(n) { return String(n).replace(/\d/g, function (d) { return '০১২৩৪৫৬৭৮৯'[+d]; }); }

  function clearSelection() {
    writeSelection([]);
  }

  // ── Styles — self-contained, no existing CSS file touched ────────────────
  function injectStyles() {
    if (document.getElementById('bundleStyles')) return;
    var css =
      /* Corner badge (product/course thumbnails) — an opaque light chip so the
         icon reads clearly over ANY thumbnail, dark ones included; an SVG
         (not an emoji) so its color can actually be controlled. */
      '.bundle-toggle{position:absolute;top:8px;right:8px;z-index:2;display:inline-flex;' +
      'align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;' +
      'background:rgba(255,255,255,.96);color:#372e6b;' +
      'box-shadow:0 2px 10px rgba(0,0,0,.35),0 0 0 1.5px rgba(255,255,255,.5);' +
      'cursor:pointer;border:none;' +
      'transition:transform .18s cubic-bezier(.34,1.56,.64,1),background .18s,color .18s,box-shadow .18s;' +
      'animation:bundlePeek 2.2s ease-in-out 1;animation-delay:.6s;animation-fill-mode:both}' +
      '.bundle-toggle svg{width:19px;height:19px;pointer-events:none;position:relative;z-index:1}' +
      '.bundle-toggle:hover{transform:scale(1.12)}' +
      '.bundle-toggle input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}' +
      '.bundle-toggle.is-on{background:#7c6af7;color:#fff;' +
      'box-shadow:0 2px 16px rgba(124,106,247,.65),0 0 0 1.5px rgba(255,255,255,.5);' +
      'animation:bundlePop .4s cubic-bezier(.34,1.56,.64,1)}' +
      /* Left-corner variant — for cards (dashboard "more from the store")
         that already put a "ফ্রি"/discount badge at top-right. */
      '.bundle-toggle--corner-left{left:8px;right:auto}' +
      /* In the cart: a tick on the corner of the filled button. */
      '.bundle-toggle.is-on::after{content:"\\2713";position:absolute;top:-3px;right:-3px;width:16px;height:16px;' +
      'border-radius:50%;background:#16a34a;color:#fff;font-size:10px;font-weight:700;line-height:16px;text-align:center}' +
      '@keyframes bundlePop{0%{transform:scale(.6)}55%{transform:scale(1.22)}100%{transform:scale(1)}}' +
      '@keyframes bundlePeek{0%,100%{transform:scale(1)}12%{transform:scale(1.22)}22%{transform:scale(.94)}30%{transform:scale(1.08)}38%{transform:scale(1)}}' +
      '@media (prefers-reduced-motion:reduce){.bundle-toggle{animation:none}.bundle-toggle.is-on{animation:none}}' +
      /* Tooltip — a single shared element positioned in JS (see showTooltip
         below), NOT a CSS ::after on the badge itself: both card wrappers
         (.pdc in products.html, the course card in courses.html) clip
         overflow, which would silently hide a tooltip anchored to a badge
         that sits inside them. position:fixed + JS-computed coordinates
         escapes that clipping entirely. */
      '.bundle-tip{position:fixed;z-index:9999;max-width:180px;white-space:normal;' +
      'text-align:center;background:#1a1730;color:#fff;font-size:11.5px;font-weight:600;' +
      'line-height:1.45;padding:8px 11px;border-radius:9px;box-shadow:0 8px 22px rgba(0,0,0,.4);' +
      'opacity:0;visibility:hidden;transform:translateY(5px);pointer-events:none;' +
      'transition:opacity .2s,transform .2s;font-family:inherit}' +
      '.bundle-tip.bundle-tip--show{opacity:1;visibility:visible;transform:translateY(0)}' +
      /* Sticky selection bar — a floating card, bottom centre, with its own
         light/dark tokens (it renders on every page, premium or not). */
      '.bundle-bar{--bb-bg:rgba(17,24,33,.9);--bb-bd:rgba(148,163,184,.2);--bb-tx:#E6EDF3;--bb-tx2:#AAB6C4;' +
      '--bb-ac:#2DD4BF;--bb-on:#04211D;position:fixed;left:50%;bottom:calc(12px + env(safe-area-inset-bottom));z-index:500;' +
      'width:min(640px,calc(100vw - 24px));display:flex;align-items:center;gap:12px;padding:10px 10px 10px 12px;' +
      'transform:translateX(-50%);background:var(--bb-bg);color:var(--bb-tx);border:1px solid var(--bb-bd);border-radius:18px;' +
      '-webkit-backdrop-filter:blur(16px) saturate(140%);backdrop-filter:blur(16px) saturate(140%);' +
      'box-shadow:0 1px 0 rgba(255,255,255,.05) inset,0 24px 50px -18px rgba(0,0,0,.65);' +
      "font-family:'Hind Siliguri',var(--fn,'Space Grotesk'),system-ui,sans-serif}" +
      'html[data-theme="light"] .bundle-bar{--bb-bg:rgba(255,255,255,.92);--bb-bd:rgba(15,23,42,.10);--bb-tx:#0F172A;' +
      '--bb-tx2:#475569;--bb-ac:#0F766E;--bb-on:#FFFFFF;box-shadow:0 20px 44px -20px rgba(15,23,42,.4)}' +
      '.bundle-bar--in{animation:bbIn .4s cubic-bezier(.2,.8,.2,1) both}' +
      '@keyframes bbIn{from{opacity:0;transform:translate(-50%,24px)}to{opacity:1;transform:translate(-50%,0)}}' +
      '.bundle-bar__ic{position:relative;flex:0 0 44px;width:44px;height:44px;border-radius:14px;display:flex;' +
      'align-items:center;justify-content:center;color:var(--bb-ac);background:rgba(45,212,191,.12)}' +
      '.bundle-bar__ic svg{width:22px;height:22px}' +
      '.bundle-bar__n{position:absolute;top:-6px;right:-6px;min-width:20px;height:20px;padding:0 5px;border-radius:999px;' +
      'font-size:12px;font-weight:700;line-height:20px;text-align:center;color:var(--bb-on);background:var(--bb-ac)}' +
      '.bundle-bar__info{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.35}' +
      '.bundle-bar__label{font-size:14px;font-weight:600;color:var(--bb-tx);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
      '.bundle-bar__total{font-size:13px;color:var(--bb-tx2)}' +
      '.bundle-bar__total b{font-size:16px;color:var(--bb-tx);font-variant-numeric:tabular-nums}' +
      '.bundle-bar__btn{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 18px;border:0;border-radius:12px;' +
      'cursor:pointer;font-weight:700;font-size:15px;font-family:inherit;color:var(--bb-on);background:var(--bb-ac);white-space:nowrap;' +
      'box-shadow:0 10px 24px -10px var(--bb-ac);transition:transform .2s,box-shadow .2s}' +
      '.bundle-bar__btn:hover{transform:translateY(-1px)}' +
      '.bundle-bar__btn svg{width:18px;height:18px}' +
      '.bundle-bar__clear{min-height:44px;padding:0 12px;border:1px solid var(--bb-bd);border-radius:12px;cursor:pointer;' +
      'background:transparent;color:var(--bb-tx2);font-size:14px;font-family:inherit;transition:color .2s,border-color .2s}' +
      '.bundle-bar__clear:hover{color:var(--bb-tx);border-color:var(--bb-tx2)}' +
      '.bundle-bar button:focus-visible{outline:2px solid var(--bb-ac);outline-offset:2px}' +
      '@media (prefers-reduced-motion:reduce){.bundle-bar--in{animation:none}.bundle-bar__btn{transition:none}}' +
      /* Count on every cart button (header, bottom menu, library). */
      '[data-cart-open]{position:relative}' +
      '.cart-badge{position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 4px;box-sizing:border-box;border-radius:999px;' +
      'background:#ef4444;color:#fff;font-size:11px;font-weight:700;line-height:18px;text-align:center;pointer-events:none}' +
      '.cart-badge[hidden]{display:none}' +
      '.cart-badge--bump{animation:bundlePop .4s cubic-bezier(.34,1.56,.64,1)}' +
      /* Cart panel: slides in from the right, with the bar's own light/dark tokens. */
      '.cart-scrim{position:fixed;inset:0;z-index:10010;background:rgba(0,0,0,.55);opacity:0;transition:opacity .2s}' +
      '.cart-scrim.is-open{opacity:1}' +
      '.cart-panel{--bb-bg:#111821;--bb-bd:rgba(148,163,184,.2);--bb-tx:#E6EDF3;--bb-tx2:#AAB6C4;--bb-ac:#2DD4BF;--bb-on:#04211D;' +
      'position:fixed;top:0;right:0;bottom:0;z-index:10011;width:min(420px,100vw);display:flex;flex-direction:column;' +
      'background:var(--bb-bg);color:var(--bb-tx);border-left:1px solid var(--bb-bd);transform:translateX(100%);transition:transform .25s cubic-bezier(.2,.8,.2,1);' +
      "font-family:'Hind Siliguri',var(--fn,'Space Grotesk'),system-ui,sans-serif}" +
      '.cart-panel.is-open{transform:none}' +
      'html[data-theme="light"] .cart-panel{--bb-bg:#fff;--bb-bd:rgba(15,23,42,.12);--bb-tx:#0F172A;--bb-tx2:#475569;--bb-ac:#0F766E;--bb-on:#fff}' +
      '.cart-panel__head{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid var(--bb-bd)}' +
      '.cart-panel__head h2{margin:0;font-size:18px;font-weight:700;color:var(--bb-tx)}' +
      '.cart-panel button{font-family:inherit}' +
      '.cart-panel__x{width:40px;height:40px;border:0;border-radius:10px;background:none;color:var(--bb-tx2);font-size:24px;line-height:1;cursor:pointer}' +
      '.cart-panel__list{flex:1;overflow-y:auto;margin:0;padding:6px 18px;list-style:none}' +
      '.cart-line{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--bb-bd)}' +
      '.cart-line__info{flex:1;min-width:0}' +
      '.cart-line__title{display:block;font-size:15px;font-weight:600;line-height:1.4;color:var(--bb-tx);overflow-wrap:anywhere}' +
      '.cart-line__kind{font-size:12.5px;color:var(--bb-tx2)}' +
      '.cart-line__price{font-weight:700;white-space:nowrap;font-variant-numeric:tabular-nums}' +
      '.cart-line__rm{min-height:40px;padding:0 10px;border:1px solid var(--bb-bd);border-radius:10px;background:none;color:var(--bb-tx2);font-size:13px;cursor:pointer}' +
      '.cart-panel__foot{padding:14px 18px calc(14px + env(safe-area-inset-bottom));border-top:1px solid var(--bb-bd)}' +
      '.cart-panel__total{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px;color:var(--bb-tx2);font-size:14px}' +
      '.cart-panel__total b{font-size:20px;color:var(--bb-tx);font-variant-numeric:tabular-nums}' +
      '.cart-panel__go{width:100%;min-height:48px;border:0;border-radius:12px;background:var(--bb-ac);color:var(--bb-on);font-size:16px;font-weight:700;cursor:pointer}' +
      '.cart-panel__empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;text-align:center;color:var(--bb-tx2);font-size:15px}' +
      '.cart-panel__shop{display:inline-block;padding:11px 20px;border-radius:12px;background:var(--bb-ac);color:var(--bb-on);font-weight:700;text-decoration:none}' +
      '.cart-panel button:focus-visible,.cart-panel a:focus-visible{outline:2px solid var(--bb-ac);outline-offset:2px}' +
      /* "Added" note, so a first tap on a card clearly did something. */
      '.cart-toast{position:fixed;left:50%;bottom:calc(16px + var(--mbn-h,0px) + var(--bundle-bar-h,0px) + env(safe-area-inset-bottom));z-index:9998;' +
      'display:flex;align-items:center;gap:12px;padding:9px 10px 9px 16px;border-radius:12px;background:#1a1730;color:#fff;font-size:14px;font-weight:600;white-space:nowrap;' +
      "box-shadow:0 10px 26px rgba(0,0,0,.4);transform:translateX(-50%);font-family:'Hind Siliguri',var(--fn,'Space Grotesk'),system-ui,sans-serif}" +
      '.cart-toast button{min-height:34px;padding:0 12px;border:0;border-radius:8px;background:#2DD4BF;color:#04211D;font:inherit;font-weight:700;cursor:pointer}' +
      '@media (prefers-reduced-motion:reduce){.cart-panel,.cart-scrim{transition:none}.cart-badge--bump{animation:none}}';
    var style = document.createElement('style');
    style.id = 'bundleStyles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  // ── Tooltip — one shared element, positioned in JS ─────────────────────
  // (see the .bundle-tip CSS comment above for why this can't be a plain
  // CSS ::after on the badge itself)
  var tipEl = null;

  function tooltipEl() {
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'bundle-tip';
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }

  function showTooltip(target) {
    var text = target.getAttribute('data-tooltip');
    if (!text) return;
    var tip = tooltipEl();
    tip.textContent = text;
    // Measure with the tip already positioned (off-screen-safe defaults)
    // before placement, since offsetWidth/Height are 0 until it has a box.
    tip.style.left = '-9999px';
    tip.style.top = '-9999px';
    tip.classList.add('bundle-tip--show');
    var rect = target.getBoundingClientRect();
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = rect.left + rect.width / 2 - tw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
    var top = rect.top - th - 10;
    if (top < 8) top = rect.bottom + 10;  // no room above -> flip below
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }

  function hideTooltip() {
    if (tipEl) tipEl.classList.remove('bundle-tip--show');
  }

  function wireTooltips() {
    // mouseover/mouseout bubble (unlike mouseenter/mouseleave), so one
    // delegated pair here covers every current AND future [data-tooltip].
    document.addEventListener('mouseover', function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (el) showTooltip(el);
    });
    document.addEventListener('mouseout', function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (!el) return;
      var related = e.relatedTarget;
      if (related && el.contains(related)) return;  // still inside the same badge
      hideTooltip();
    });
    document.addEventListener('focusin', function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (el) showTooltip(el);
    });
    document.addEventListener('focusout', function (e) {
      var el = e.target.closest && e.target.closest('[data-tooltip]');
      if (el) hideTooltip();
    });
  }

  // A tooltip's first appearance is timing-sensitive (CSS :hover/mouseover
  // never fires on touch devices), so ONE corner badge on the page gets a
  // brief unprompted peek shortly after load — same idea as the WhatsApp/
  // Messenger FAB peek already on every page (templates/base.html) — then
  // settles back to hover/focus-only for the rest of the visit. Only the
  // first badge, not every one, so a whole grid of cards doesn't light up
  // with tooltips at once.
  function peekTooltip() {
    var first = document.querySelector('.bundle-toggle[data-tooltip]');
    if (!first) return;
    setTimeout(function () {
      showTooltip(first);
      setTimeout(hideTooltip, 2600);
    }, 1500);
  }

  // ── Sticky bar ─────────────────────────────────────────────────────────
  // Same width as .mbn in main.css: phones use the cart buttons instead.
  var phone = window.matchMedia('(max-width:767px)');

  function renderBar() {
    var list = readSelection();
    var bar = document.getElementById('bundleStickyBar');
    // Not on a checkout page (#coForm): there it would only cover the page's
    // own pay button, and on the bundle checkout it repeats the order itself.
    if (list.length < 2 || phone.matches || document.getElementById('coForm')) {
      if (bar) bar.remove();
      document.documentElement.style.removeProperty('--bundle-bar-h');
      return;
    }
    var total = 0;
    for (var i = 0; i < list.length; i++) total += parseFloat(list[i].price) || 0;

    var fresh = !bar;
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'bundleStickyBar';
      bar.className = 'bundle-bar bundle-bar--in';
      bar.setAttribute('role', 'region');
      bar.setAttribute('aria-label', 'একসাথে কেনার তালিকা');
      document.body.appendChild(bar);
    }
    var n = bn(list.length);
    var whole = Math.round(total) === total;
    bar.innerHTML =
      '<span class="bundle-bar__ic" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>' +
        '<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>' +
        '<span class="bundle-bar__n">' + n + '</span></span>' +
      '<div class="bundle-bar__info" aria-live="polite">' +
        '<span class="bundle-bar__label">' + n + 'টি প্রোডাক্ট বাছাই হয়েছে</span>' +
        '<span class="bundle-bar__total">মোট <b>৳' + (whole ? total.toLocaleString('en-US') : total.toFixed(2)) + '</b></span></div>' +
      '<button type="button" class="bundle-bar__btn" id="bundleCheckoutBtn">একসাথে কিনো' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></button>' +
      '<button type="button" class="bundle-bar__clear" id="bundleClearBtn">মুছো</button>';
    if (fresh) setTimeout(function () { bar.classList.remove('bundle-bar--in'); }, 450);
    // Lets floating buttons (chat FAB, spinner pill) sit above the bar.
    document.documentElement.style.setProperty('--bundle-bar-h', (bar.offsetHeight + 12) + 'px');

    document.getElementById('bundleCheckoutBtn').addEventListener('click', goToCheckout);
    document.getElementById('bundleClearBtn').addEventListener('click', function () {
      clearSelection();
      refresh();
    });
  }

  function goToCheckout() {
    var list = readSelection();
    if (!list.length) return;
    if (list.length === 1) {
      window.location.href = ITEM_CHECKOUT_URL
        .replace('ITEM_TYPE', encodeURIComponent(list[0].type))
        .replace('ITEM_SLUG', encodeURIComponent(list[0].slug));
      return;
    }
    // A plain GET with the selection in the query string — not a POST — so
    // the checkout page's own name/email form loads with nothing filled in
    // yet and no spurious "please fill in your name and email" error. The
    // server re-resolves and reprices every item from the DB regardless of
    // what this query string says (see _resolve_bundle_items).
    var payload = JSON.stringify(list.map(function (it) {
      return { item_type: it.type, slug: it.slug };
    }));
    window.location.href = CHECKOUT_URL + '?items_json=' + encodeURIComponent(payload);
  }

  // ── Cart panel + count badges ──────────────────────────────────────────
  var panel = null, scrim = null, openedFrom = null;

  function money(n) {
    return '৳' + (Math.round(n) === n ? n.toLocaleString('en-US') : n.toFixed(2));
  }

  function renderCounts(bump) {
    var n = readSelection().length;
    var badges = document.querySelectorAll('[data-cart-count]');
    for (var i = 0; i < badges.length; i++) {
      badges[i].textContent = bn(n);
      badges[i].hidden = !n;
      badges[i].classList.remove('cart-badge--bump');
      if (bump) { void badges[i].offsetWidth; badges[i].classList.add('cart-badge--bump'); }
    }
  }

  function make(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) el.className = cls;
    if (text !== undefined) el.textContent = text;   // titles never go through innerHTML
    return el;
  }

  function renderPanel() {
    if (!panel) return;
    var list = readSelection(), total = 0;
    panel.textContent = '';

    var head = make('div', 'cart-panel__head');
    var title = make('h2', '', 'তোমার কার্ট');
    title.id = 'cartPanelTitle';
    var x = make('button', 'cart-panel__x', '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'বন্ধ করো');
    x.addEventListener('click', closeCart);
    head.appendChild(title);
    head.appendChild(x);
    panel.appendChild(head);

    if (!list.length) {
      var empty = make('div', 'cart-panel__empty');
      empty.appendChild(make('p', '', 'কার্ট এখন খালি। পছন্দের বই বা কোর্সের কার্ট বাটনে চাপ দাও।'));
      var shop = make('a', 'cart-panel__shop', 'প্রোডাক্ট দেখো');
      shop.href = SHOP_URL;
      empty.appendChild(shop);
      panel.appendChild(empty);
      return;
    }

    var ul = make('ul', 'cart-panel__list');
    list.forEach(function (it) {
      var price = parseFloat(it.price) || 0;
      total += price;
      var li = make('li', 'cart-line');
      var info = make('div', 'cart-line__info');
      info.appendChild(make('span', 'cart-line__title', it.title || it.slug));
      info.appendChild(make('span', 'cart-line__kind', it.type === 'course' ? 'কোর্স' : 'প্রোডাক্ট'));
      var rm = make('button', 'cart-line__rm', 'বাদ দাও');
      rm.type = 'button';
      rm.setAttribute('aria-label', (it.title || it.slug) + ' বাদ দাও');
      rm.addEventListener('click', function () {
        toggleItem(it.type, it.slug);
        refresh();
        var close = panel.querySelector('.cart-panel__x');
        if (close) close.focus();
      });
      li.appendChild(info);
      li.appendChild(make('span', 'cart-line__price', price ? money(price) : 'ফ্রি'));
      li.appendChild(rm);
      ul.appendChild(li);
    });
    panel.appendChild(ul);

    var foot = make('div', 'cart-panel__foot');
    var sum = make('div', 'cart-panel__total');
    sum.appendChild(make('span', '', 'মোট ' + bn(list.length) + 'টি'));
    sum.appendChild(make('b', '', money(total)));
    var go = make('button', 'cart-panel__go', 'চেকআউট করো');
    go.type = 'button';
    go.addEventListener('click', goToCheckout);
    foot.appendChild(sum);
    foot.appendChild(go);
    panel.appendChild(foot);
  }

  function onCartKey(e) {
    if (e.key === 'Escape') closeCart();
  }

  function openCart(from) {
    if (panel) return;
    hideToast();
    openedFrom = from || null;
    scrim = make('div', 'cart-scrim');
    scrim.addEventListener('click', closeCart);
    panel = make('aside', 'cart-panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'cartPanelTitle');
    renderPanel();
    document.body.appendChild(scrim);
    document.body.appendChild(panel);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onCartKey);
    void panel.offsetWidth;   // so the slide-in runs
    scrim.classList.add('is-open');
    panel.classList.add('is-open');
    panel.querySelector('.cart-panel__x').focus();
  }

  function closeCart() {
    if (!panel) return;
    panel.remove();
    scrim.remove();
    panel = scrim = null;
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onCartKey);
    if (openedFrom) openedFrom.focus();
  }

  var toastEl = null, toastTimer = 0;

  function hideToast() {
    clearTimeout(toastTimer);
    if (toastEl) { toastEl.remove(); toastEl = null; }
  }

  function showAdded() {
    hideToast();
    toastEl = make('div', 'cart-toast');
    toastEl.setAttribute('role', 'status');
    toastEl.appendChild(make('span', '', 'কার্টে যোগ হয়েছে'));
    var view = make('button', '', 'কার্ট দেখো');
    view.type = 'button';
    view.addEventListener('click', function () { openCart(); });
    toastEl.appendChild(view);
    document.body.appendChild(toastEl);
    toastTimer = setTimeout(hideToast, 3000);
  }

  // The thank-you page lists what was just bought: it leaves the cart.
  function dropBought() {
    var el = document.getElementById('cartBought');
    if (!el) return;
    var bought;
    try { bought = JSON.parse(el.textContent); } catch (e) { return; }
    if (!bought.length) return;
    writeSelection(readSelection().filter(function (it) { return !isSelected(bought, it.type, it.slug); }));
  }

  function refresh(bump) {
    syncToggles();
    renderBar();
    renderCounts(bump);
    renderPanel();
  }

  // ── Keep every [data-bundle-toggle] on the page in sync with storage ───
  function syncToggles() {
    var list = readSelection();
    var toggles = document.querySelectorAll('[data-bundle-toggle]');
    for (var i = 0; i < toggles.length; i++) {
      var el = toggles[i];
      var on = isSelected(list, el.getAttribute('data-item-type'), el.getAttribute('data-item-slug'));
      var input = el.querySelector('input[type=checkbox]');
      if (input) input.checked = on;
      el.classList.toggle('is-on', on);
    }
  }

  function onToggleClick(e) {
    var el = e.target.closest ? e.target.closest('[data-bundle-toggle]') : null;
    if (!el) return;
    // Stops both the checkbox's native toggle (we manage `checked` ourselves
    // in syncToggles) and, on a listing-page card, the enclosing <a>'s
    // navigation — this element is always a sibling of the buy link, never
    // inside it, except on products.html/courses.html where the whole card
    // IS the link.
    e.preventDefault();
    e.stopPropagation();
    var type = el.getAttribute('data-item-type'), slug = el.getAttribute('data-item-slug');
    var added = !isSelected(readSelection(), type, slug);
    toggleItem(
      type,
      slug,
      el.getAttribute('data-item-title') || '',
      el.getAttribute('data-item-price') || '0'
    );
    refresh(added);
    if (added && isSelected(readSelection(), type, slug)) showAdded(); else hideToast();
  }

  function onCartButton(e) {
    var btn = e.target.closest ? e.target.closest('[data-cart-open]') : null;
    if (btn) openCart(btn);
  }

  function init() {
    injectStyles();
    dropBought();
    document.addEventListener('click', onToggleClick, true);
    document.addEventListener('click', onCartButton);
    // Another tab changed the cart, or the browser restored this page from history.
    window.addEventListener('storage', function (e) { if (e.key === STORAGE_KEY) refresh(); });
    window.addEventListener('pageshow', function (e) { if (e.persisted) refresh(); });
    if (phone.addEventListener) phone.addEventListener('change', renderBar);   // rotating a tablet
    // Cards swapped in by HTMX (premium /products/ filters) need their state.
    document.addEventListener('htmx:afterSwap', syncToggles);
    wireTooltips();
    refresh();
    peekTooltip();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
