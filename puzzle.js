/* DV Plugin: Human Check (puzzle.js). Self-contained. Delete this file and its script tag to remove it.
   Shows one short, one-tap or one-swipe puzzle before the app, chosen at random so each visit feels different.
   HONESTY NOTE: this is a client-side friction gate. It blocks casual rushing, scripted clicks and synthetic events,
   but the logic ships in this file, so a determined bot can read it. Real bot protection needs a server-side check
   (for example Cloudflare Turnstile). Android phones only; the app's own desktop blocker handles other devices. */
(function () {
  'use strict';
  try {
    if (!/Android/i.test(navigator.userAgent)) return;
    var P = 'dvp-pz', KEY = 'dvp-pz-ok', LAST = 'dvp-pz-last';
    try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}

    var css =
      '#' + P + '{position:fixed;inset:0;width:100dvw;height:100dvh;z-index:2147483000;display:flex;align-items:center;justify-content:center;background:var(--bg-color,#fff);color:var(--text-color,#121212);font:19px Roboto,sans-serif;overflow:hidden;touch-action:manipulation}' +
      '#' + P + ' *{box-sizing:border-box;font-family:inherit}' +
      '.' + P + '-blob{position:absolute;width:90dvw;height:90dvw;border-radius:50%;background:radial-gradient(circle,rgba(223,30,90,.30),rgba(223,30,90,0) 68%);animation:' + P + '-float 14s ease-in-out infinite alternate}' +
      '.' + P + '-b1{top:-30dvw;left:-25dvw}.' + P + '-b2{bottom:-35dvw;right:-30dvw;animation-delay:-6s;animation-duration:18s}' +
      '@keyframes ' + P + '-float{to{transform:translate(12dvw,8dvh) scale(1.12)}}' +
      '.' + P + '-card{position:relative;width:calc(100% - 40px);background:var(--bg-color,#fff);border:1px solid var(--outline-color,#E0E0E0);border-radius:28px;padding:28px 20px 24px;text-align:center;box-shadow:0 16px 48px rgba(223,30,90,.18);animation:' + P + '-in .5s cubic-bezier(.2,.8,.2,1)}' +
      '@keyframes ' + P + '-in{from{opacity:0;transform:translateY(24px) scale(.97)}}' +
      '.' + P + '-brand{display:flex;align-items:center;justify-content:center;gap:10px;font-weight:800;color:var(--primary,#DF1E5A);margin-bottom:6px}' +
      '.' + P + '-logo{width:40px;height:40px;border-radius:50%;background:var(--primary,#DF1E5A);display:grid;place-items:center}' +
      '.' + P + '-logo svg{width:22px;height:22px;stroke:#fff;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
      '.' + P + '-badge{display:inline-flex;align-items:center;gap:6px;font-size:16px;font-weight:700;padding:4px 14px;border-radius:999px;background:var(--primary-ripple,rgba(223,30,90,.2));color:var(--primary,#DF1E5A);margin:8px 0 18px}' +
      '.' + P + '-q{font-size:27px;font-weight:900;line-height:1.25;margin:0 0 22px}' +
      '.' + P + '-fb{min-height:28px;margin-top:16px;font-weight:700;color:var(--error,#B3261E)}.' + P + '-fb.ok{color:var(--success,#146C2E)}' +
      '.' + P + '-track{position:relative;height:68px;border-radius:34px;background:var(--surface-color,#F8F9FA);border:2px solid var(--outline-color,#E0E0E0);overflow:hidden;touch-action:none;user-select:none}' +
      '.' + P + '-fill{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--primary-ripple,rgba(223,30,90,.2))}' +
      '.' + P + '-hint{position:absolute;inset:0;display:grid;place-items:center;font-weight:700;opacity:.7;padding-left:56px}' +
      '.' + P + '-knob{position:absolute;left:4px;top:4px;width:56px;height:56px;border-radius:50%;border:0;background:var(--primary,#DF1E5A);display:grid;place-items:center;touch-action:none;cursor:grab}' +
      '.' + P + '-knob svg,.' + P + '-pen svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}' +
      '.' + P + '-stage{position:relative;height:220px;touch-action:none;user-select:none}' +
      '.' + P + '-page{position:absolute;right:6px;top:6px;width:116px;height:150px;border-radius:14px;border:3px dashed var(--primary,#DF1E5A);display:grid;place-items:center;background:var(--surface-color,#F8F9FA)}' +
      '.' + P + '-page svg{width:44px;height:44px;fill:none;stroke:var(--primary,#DF1E5A);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.6}' +
      '.' + P + '-pen{position:absolute;left:6px;bottom:6px;width:68px;height:68px;border-radius:50%;background:var(--primary,#DF1E5A);display:grid;place-items:center;border:0;touch-action:none;cursor:grab;box-shadow:0 8px 20px rgba(223,30,90,.35)}' +
      '.' + P + '-snap{transition:transform .25s cubic-bezier(.2,.8,.2,1),width .25s}' +
      '.' + P + '-shake{animation:' + P + '-sh .35s}@keyframes ' + P + '-sh{25%{transform:translateX(-9px)}75%{transform:translateX(9px)}}' +
      '.' + P + '-spin{display:grid;place-items:center}.' + P + '-spin i{width:56px;height:56px;border:6px solid var(--primary-ripple,rgba(223,30,90,.2));border-top-color:var(--primary,#DF1E5A);border-radius:50%;animation:' + P + '-rot .8s linear infinite}' +
      '@keyframes ' + P + '-rot{to{transform:rotate(360deg)}}' +
      '@media (prefers-reduced-motion:reduce){#' + P + ' *{animation-duration:.01s!important;transition-duration:.01s!important}#' + P + ' .' + P + '-spin i{animation-duration:.8s!important}}';

    var I = {
      pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3', book: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM8 8h7', quote: 'M7 17h3l2-4V7H6v6h3M15 17h3l2-4V7h-6v6h3',
      check: 'M5 12l5 5 9-10', star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z', bolt: 'M13 2L5 14h6l-1 8 8-12h-6z',
      arrow: 'M5 12h14M13 6l6 6-6 6', key: 'M8 11a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM11 13l9-9M17 7l3 3M14 10l2 2', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3', frame: 'M4 4h16v16H4zM8 8h8v8H8z', cloud: 'M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1A4 4 0 0 0 7 18z', plane: 'M3 11l18-8-8 18-2-8z', bookmark: 'M7 3h10v18l-5-4-5 4z', shelf: 'M3 20h18M5 20V9h4v11M11 20V5h4v15M17 20V11h2v9', battery: 'M3 8h15v8H3zM18 11h3v2h-3', box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z', doc: 'M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h6'
    };
    var svg = function (k) { return '<svg viewBox="0 0 24 24"><path d="' + I[k] + '"/></svg>'; };
    var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };


    var host, card, box, fb, t0, wrongs = 0, curId = '';
    var settle = function (ok, quiet) {
      if (ok) return unlock();
      wrongs++; card.classList.remove(P + '-shake'); void card.offsetWidth; card.classList.add(P + '-shake');
      fb.textContent = quiet ? '' : 'Not quite. Here is a different one.';
      setTimeout(function () { show(); }, 700);
    };
    var human = function (e) { return !e || e.isTrusted !== false; };
    var tap = function (el, fn) { el.addEventListener('click', function (e) { if (Date.now() - t0 < 700 || !human(e)) return settle(false, true); fn(e); }); };

    var slideP = function (title, ico, hint) {
      return function () {
        box.innerHTML = '<p class="' + P + '-q">' + title + '</p><div class="' + P + '-track"><div class="' + P + '-fill"></div><div class="' + P + '-hint">' + hint + '</div><button class="' + P + '-knob" aria-label="' + hint + '">' + svg(ico) + '</button></div>';
        var track = box.querySelector('.' + P + '-track'), knob = box.querySelector('.' + P + '-knob'), fill = box.querySelector('.' + P + '-fill');
        var x = 0, sx = 0, max = 0, on = false, t1 = 0, mv = 0, tries = 0;
        var put = function (v) { x = v; knob.style.transform = 'translateX(' + v + 'px)'; fill.style.width = (v + 32) + 'px'; };
        knob.addEventListener('pointerdown', function (e) { on = true; mv = 0; t1 = Date.now(); max = track.clientWidth - knob.offsetWidth - 8; sx = e.clientX - x; knob.classList.remove(P + '-snap'); fill.classList.remove(P + '-snap'); knob.setPointerCapture(e.pointerId); });
        knob.addEventListener('pointermove', function (e) { if (!on) return; mv++; put(Math.max(0, Math.min(max, e.clientX - sx))); });
        var end = function (e) {
          if (!on) return; on = false; knob.classList.add(P + '-snap'); fill.classList.add(P + '-snap');
          if (x >= max * 0.96) { if (Date.now() - t1 >= 350 && mv >= 4 && human(e) && Date.now() - t0 >= 700) return settle(true); return settle(false, true); }
          if (mv >= 4 && ++tries >= 2) return settle(false);
          put(0);
        };
        knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
      };
    };
    var dragP = function (title, piece, target) {
      return function () {
        box.innerHTML = '<p class="' + P + '-q">' + title + '</p><div class="' + P + '-stage"><div class="' + P + '-page">' + svg(target) + '</div><button class="' + P + '-pen" aria-label="' + title + '">' + svg(piece) + '</button></div>';
        var pen = box.querySelector('.' + P + '-pen'), pg = box.querySelector('.' + P + '-page');
        var x = 0, y = 0, sx = 0, sy = 0, on = false, t1 = 0, mv = 0, tries = 0;
        var put = function (a, b) { x = a; y = b; pen.style.transform = 'translate(' + a + 'px,' + b + 'px)'; };
        pen.addEventListener('pointerdown', function (e) { on = true; mv = 0; t1 = Date.now(); sx = e.clientX - x; sy = e.clientY - y; pen.classList.remove(P + '-snap'); pen.setPointerCapture(e.pointerId); });
        pen.addEventListener('pointermove', function (e) { if (on) { mv++; put(e.clientX - sx, e.clientY - sy); } });
        var end = function (e) {
          if (!on) return; on = false; pen.classList.add(P + '-snap');
          var a = pen.getBoundingClientRect(), b = pg.getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height / 2;
          if (cx > b.left - 10 && cx < b.right + 10 && cy > b.top - 10 && cy < b.bottom + 10) {
            if (Date.now() - t1 >= 350 && mv >= 4 && human(e) && Date.now() - t0 >= 700) { put(x + (b.left + b.width / 2) - cx, y + (b.top + b.height / 2) - cy); return setTimeout(function () { settle(true); }, 260); }
            return settle(false, true);
          }
          if (mv >= 4 && ++tries >= 2) return settle(false);
          put(0, 0);
        };
        pen.addEventListener('pointerup', end); pen.addEventListener('pointercancel', end);
      };
    };
    var TYPES = {
      slide1: slideP('Slide to verify', 'arrow', 'Slide to verify'), slide2: slideP('Slide to unlock', 'lock', 'Slide to unlock'),
      slide3: slideP('Slide to send', 'plane', 'Slide to send'), slide4: slideP('Slide to start writing', 'pen', 'Slide to start'),
      slide5: slideP('Slide to open the book', 'book', 'Slide to open'), slide6: slideP('Slide to save', 'check', 'Slide to save'),
      slide7: slideP('Slide to power up', 'bolt', 'Slide to power up'), slide8: slideP('Slide to publish', 'doc', 'Slide to publish'),
      drag1: dragP('Drag the pen onto the page', 'pen', 'doc'), drag2: dragP('Drag the key to the lock', 'key', 'lock'),
      drag3: dragP('Drag the star into the frame', 'star', 'frame'), drag4: dragP('Drag the plane to the cloud', 'plane', 'cloud'),
      drag5: dragP('Drag the book to the shelf', 'book', 'shelf'), drag6: dragP('Drag the bolt to the battery', 'bolt', 'battery'),
      drag7: dragP('Drag the check into the box', 'check', 'box'), drag8: dragP('Drag the bookmark into the book', 'bookmark', 'book')
    };

    var bag = [];
    var show = function () {
      if (!bag.length) { bag = shuffle(Object.keys(TYPES)); if (bag.length > 1 && bag[bag.length - 1] === curId) bag.reverse(); }
      var last = ''; try { last = localStorage.getItem(LAST) || ''; } catch (e) {}
      if (bag.length > 1 && bag[bag.length - 1] === last) bag.unshift(bag.pop());
      curId = bag.pop(); try { localStorage.setItem(LAST, curId); } catch (e) {}
      box.innerHTML = ''; fb.textContent = ''; fb.className = P + '-fb'; t0 = Date.now(); TYPES[curId]();
    };
    var finished = false;
    var unlock = function () {
      if (finished) return; finished = true;
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      card.style.display = 'none';
      var sp = document.createElement('div'); sp.className = P + '-spin'; sp.setAttribute('role', 'status'); sp.setAttribute('aria-label', 'Loading'); sp.innerHTML = '<i></i>';
      host.appendChild(sp);
      setTimeout(function () {
        host.style.transition = 'opacity .35s'; host.style.opacity = '0';
        setTimeout(function () { host.remove(); var a = document.getElementById('app-root'); if (a) a.removeAttribute('inert'); document.documentElement.style.overflow = ''; document.body.style.overflow = ''; }, 380);
      }, 5000);
    };

    var build = function () {
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
      host = document.createElement('div'); host.id = P; host.setAttribute('role', 'dialog'); host.setAttribute('aria-modal', 'true'); host.setAttribute('aria-label', 'Human check');
      host.innerHTML = '<div class="' + P + '-blob ' + P + '-b1"></div><div class="' + P + '-blob ' + P + '-b2"></div><div class="' + P + '-card"><div class="' + P + '-brand"><span class="' + P + '-logo"><svg viewBox="0 0 24 24"><path d="' + I.pen + '"/></svg></span>DV-Writing Assistant</div><span class="' + P + '-badge"><svg viewBox="0 0 24 24" style="width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="' + I.shield + '"/></svg>Quick human check</span><div id="' + P + '-box"></div><div class="' + P + '-fb" id="' + P + '-fb" role="status" aria-live="polite"></div></div>';
      document.body.appendChild(host); card = host.querySelector('.' + P + '-card'); box = document.getElementById(P + '-box'); fb = document.getElementById(P + '-fb');
      document.documentElement.style.overflow = 'hidden'; document.body.style.overflow = 'hidden';
      var a = document.getElementById('app-root'); if (a) a.setAttribute('inert', '');
      show('');
    };
    if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
  } catch (err) { console.warn('Human check plugin disabled:', err); }
})();
