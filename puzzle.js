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
      '.' + P + '-q{font-size:22px;font-weight:800;line-height:1.35;margin:0 0 20px}' +
      '.' + P + '-fb{min-height:28px;margin-top:16px;font-weight:700;color:var(--error,#B3261E)}.' + P + '-fb.ok{color:var(--success,#146C2E)}' +
      '.' + P + '-opts{display:flex;flex-direction:column;gap:12px}' +
      '.' + P + '-btn{width:100%;padding:16px;border:2px solid var(--outline-color,#E0E0E0);border-radius:16px;background:var(--surface-color,#F8F9FA);color:inherit;font-size:19px;font-weight:700;cursor:pointer;transition:transform .12s,border-color .12s}' +
      '.' + P + '-btn:active{transform:scale(.97);border-color:var(--primary,#DF1E5A);background:var(--primary-ripple,rgba(223,30,90,.2))}' +
      '.' + P + '-words{display:flex;flex-wrap:wrap;justify-content:center;gap:10px}.' + P + '-words .' + P + '-btn{width:auto;padding:12px 16px}' +
      '.' + P + '-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.' + P + '-tile{aspect-ratio:1;display:grid;place-items:center;padding:0}' +
      '.' + P + '-tile svg{width:44px;height:44px;fill:none;stroke:var(--primary,#DF1E5A);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
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
      '.' + P + '-row{display:flex;gap:12px}.' + P + '-row .' + P + '-btn{flex:1;font-size:26px;padding:18px 8px}' +
      '.' + P + '-count{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;margin-bottom:20px}.' + P + '-count svg{width:40px;height:40px;fill:none;stroke:var(--primary,#DF1E5A);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
      '.' + P + '-sent{font-size:22px;font-weight:700;margin:0 0 20px;line-height:1.4}' +
      '.' + P + '-spin{display:grid;place-items:center}.' + P + '-spin i{width:56px;height:56px;border:6px solid var(--primary-ripple,rgba(223,30,90,.2));border-top-color:var(--primary,#DF1E5A);border-radius:50%;animation:' + P + '-rot .8s linear infinite}' +
      '@keyframes ' + P + '-rot{to{transform:rotate(360deg)}}' +
      '@media (prefers-reduced-motion:reduce){#' + P + ' *{animation-duration:.01s!important;transition-duration:.01s!important}#' + P + ' .' + P + '-spin i{animation-duration:.8s!important}}';

    var I = {
      pen: 'M4 20l4-1 11-11-3-3L5 16zM14 6l3 3', book: 'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM8 8h7', quote: 'M7 17h3l2-4V7H6v6h3M15 17h3l2-4V7h-6v6h3',
      check: 'M5 12l5 5 9-10', star: 'M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z', bolt: 'M13 2L5 14h6l-1 8 8-12h-6z',
      arrow: 'M5 12h14M13 6l6 6-6 6', shield: 'M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z', doc: 'M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h6'
    };
    var svg = function (k) { return '<svg viewBox="0 0 24 24"><path d="' + I[k] + '"/></svg>'; };
    var shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
    var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

    var SENT = [['Always proofread the paragraph before you publish', 'paragraph', 'paragragh'], ['Clear writing is definitely worth the effort', 'definitely', 'definately'], ['Good grammar builds trust with every reader', 'grammar', 'grammer'], ['Please separate each idea into its own sentence', 'separate', 'seperate'], ['Your first draft is only the beginning', 'beginning', 'begining'], ['It is necessary to cite every source', 'necessary', 'neccessary'], ['We all receive feedback to grow as writers', 'receive', 'recieve'], ['Strong writing starts with one clear idea', 'writing', 'writting']];
    var GRAM = [['She does not like cold tea.', 'She do not like cold tea.'], ['Their plan is ready for review.', 'There plan is ready for review.'], ['I would like to go there tomorrow.', 'I would like to go their tomorrow.'], ['The team has finished its report.', 'The team have finished it report.'], ['Your answer is better than mine.', 'Your answer is better then mine.'], ['It is a pleasure to meet you.', 'Its a pleasure to meet you.']];

    var host, card, box, fb, t0, wrongs = 0, lockUntil = 0, curId = '';
    var settle = function (ok, quiet) {
      if (Date.now() < lockUntil) return;
      if (ok) return unlock();
      wrongs++; card.classList.remove(P + '-shake'); void card.offsetWidth; card.classList.add(P + '-shake');
      if (wrongs >= 6) { lockUntil = Date.now() + 15000; fb.textContent = 'Take a breath. A new puzzle is coming in a moment.'; return setTimeout(function () { wrongs = 3; show(curId); }, 15000); }
      fb.textContent = quiet ? '' : 'Not quite. Here is a fresh one.';
      setTimeout(function () { show(curId); }, 700);
    };
    var human = function (e) { return !e || e.isTrusted !== false; };
    var tap = function (el, fn) { el.addEventListener('click', function (e) { if (Date.now() - t0 < 700 || !human(e)) return settle(false, true); fn(e); }); };

    var TYPES = {
      typo: function () {
        var s = SENT[Math.floor(Math.random() * SENT.length)];
        box.innerHTML = '<p class="' + P + '-q">Tap the misspelled word</p><div class="' + P + '-words">' + s[0].split(' ').map(function (w) { return '<button class="' + P + '-btn" data-bad="' + (w === s[1] ? 1 : 0) + '">' + esc(w === s[1] ? s[2] : w) + '</button>'; }).join('') + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-bad') === '1'); }); });
      },
      grammar: function () {
        var g = GRAM[Math.floor(Math.random() * GRAM.length)];
        box.innerHTML = '<p class="' + P + '-q">Which sentence is correct?</p><div class="' + P + '-opts">' + shuffle([[g[0], 1], [g[1], 0]]).map(function (o) { return '<button class="' + P + '-btn" data-ok="' + o[1] + '">' + esc(o[0]) + '</button>'; }).join('') + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-ok') === '1'); }); });
      },
      odd: function () {
        var keys = shuffle(['pen', 'book', 'quote', 'star', 'bolt', 'check']), base = keys[0], odd = keys[1], pos = Math.floor(Math.random() * 6), h = '';
        for (var i = 0; i < 6; i++) h += '<button class="' + P + '-btn ' + P + '-tile" data-ok="' + (i === pos ? 1 : 0) + '" aria-label="icon">' + svg(i === pos ? odd : base) + '</button>';
        box.innerHTML = '<p class="' + P + '-q">Tap the one that is different</p><div class="' + P + '-grid">' + h + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-ok') === '1'); }); });
      },
      punct: function () {
        var S = [['What time does the class start', '?'], ['Please close the door behind you', '.'], ['That was an amazing performance', '!'], ['Where did you put the notes', '?'], ['We finished the report on time', '.'], ['Congratulations on your promotion', '!']], q = S[Math.floor(Math.random() * S.length)];
        box.innerHTML = '<p class="' + P + '-q">Pick the right ending mark</p><p class="' + P + '-sent">' + esc(q[0]) + ' ___</p><div class="' + P + '-row">' + shuffle(['.', '?', '!']).map(function (m) { return '<button class="' + P + '-btn" data-ok="' + (m === q[1] ? 1 : 0) + '" aria-label="' + (m === '.' ? 'period' : m === '?' ? 'question mark' : 'exclamation mark') + '">' + m + '</button>'; }).join('') + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-ok') === '1'); }); });
      },
      count: function () {
        var n = 3 + Math.floor(Math.random() * 4), pens = '', nums = [n], k;
        for (k = 0; k < n; k++) pens += svg('pen');
        while (nums.length < 4) { k = 2 + Math.floor(Math.random() * 7); if (nums.indexOf(k) < 0) nums.push(k); }
        box.innerHTML = '<p class="' + P + '-q">How many pens do you see?</p><div class="' + P + '-count">' + pens + '</div><div class="' + P + '-row">' + shuffle(nums).map(function (v) { return '<button class="' + P + '-btn" data-ok="' + (v === n ? 1 : 0) + '">' + v + '</button>'; }).join('') + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-ok') === '1'); }); });
      },
      synonym: function () {
        var W = [['happy', 'joyful', ['angry', 'tired']], ['quick', 'fast', ['slow', 'heavy']], ['begin', 'start', ['finish', 'pause']], ['big', 'large', ['tiny', 'quiet']], ['clear', 'obvious', ['hidden', 'broken']], ['smart', 'clever', ['careless', 'distant']]], w = W[Math.floor(Math.random() * W.length)];
        box.innerHTML = '<p class="' + P + '-q">Tap the word that means "' + w[0] + '"</p><div class="' + P + '-opts">' + shuffle([[w[1], 1], [w[2][0], 0], [w[2][1], 0]]).map(function (o) { return '<button class="' + P + '-btn" data-ok="' + o[1] + '">' + o[0] + '</button>'; }).join('') + '</div>';
        box.querySelectorAll('button').forEach(function (b) { tap(b, function () { settle(b.getAttribute('data-ok') === '1'); }); });
      },
      slide: function () {
        box.innerHTML = '<p class="' + P + '-q">Slide to confirm you are human</p><div class="' + P + '-track"><div class="' + P + '-fill"></div><div class="' + P + '-hint">Slide to verify</div><button class="' + P + '-knob" aria-label="Slide to verify">' + svg('arrow') + '</button></div>';
        var track = box.querySelector('.' + P + '-track'), knob = box.querySelector('.' + P + '-knob'), fill = box.querySelector('.' + P + '-fill');
        var x = 0, sx = 0, max = 0, on = false, t1 = 0, mv = 0;
        var put = function (v) { x = v; knob.style.transform = 'translateX(' + v + 'px)'; fill.style.width = (v + 32) + 'px'; };
        knob.addEventListener('pointerdown', function (e) { on = true; mv = 0; t1 = Date.now(); max = track.clientWidth - knob.offsetWidth - 8; sx = e.clientX - x; knob.classList.remove(P + '-snap'); fill.classList.remove(P + '-snap'); knob.setPointerCapture(e.pointerId); });
        knob.addEventListener('pointermove', function (e) { if (!on) return; mv++; put(Math.max(0, Math.min(max, e.clientX - sx))); });
        var end = function (e) {
          if (!on) return; on = false; knob.classList.add(P + '-snap'); fill.classList.add(P + '-snap');
          if (x >= max * 0.96) { if (Date.now() - t1 >= 350 && mv >= 4 && human(e) && Date.now() - t0 >= 700) return settle(true); return settle(false, true); }
          put(0);
        };
        knob.addEventListener('pointerup', end); knob.addEventListener('pointercancel', end);
      },
      drag: function () {
        box.innerHTML = '<p class="' + P + '-q">Drag the pen onto the page</p><div class="' + P + '-stage"><div class="' + P + '-page">' + svg('doc') + '</div><button class="' + P + '-pen" aria-label="Pen">' + svg('pen') + '</button></div>';
        var pen = box.querySelector('.' + P + '-pen'), pg = box.querySelector('.' + P + '-page');
        var x = 0, y = 0, sx = 0, sy = 0, on = false, t1 = 0, mv = 0;
        var put = function (a, b) { x = a; y = b; pen.style.transform = 'translate(' + a + 'px,' + b + 'px)'; };
        pen.addEventListener('pointerdown', function (e) { on = true; mv = 0; t1 = Date.now(); sx = e.clientX - x; sy = e.clientY - y; pen.classList.remove(P + '-snap'); pen.setPointerCapture(e.pointerId); });
        pen.addEventListener('pointermove', function (e) { if (on) { mv++; put(e.clientX - sx, e.clientY - sy); } });
        var end = function (e) {
          if (!on) return; on = false; pen.classList.add(P + '-snap');
          var a = pen.getBoundingClientRect(), b = pg.getBoundingClientRect(), cx = a.left + a.width / 2, cy = a.top + a.height / 2;
          if (cx > b.left && cx < b.right && cy > b.top && cy < b.bottom) { if (Date.now() - t1 >= 350 && mv >= 4 && human(e) && Date.now() - t0 >= 700) return settle(true); return settle(false, true); }
          put(0, 0);
        };
        pen.addEventListener('pointerup', end); pen.addEventListener('pointercancel', end);
      }
    };

    var show = function (avoid) {
      var ids = Object.keys(TYPES), last = ''; try { last = localStorage.getItem(LAST) || ''; } catch (e) {}
      var pool = ids.filter(function (k) { return k !== avoid && k !== last; }); pool = pool.length ? pool : ids;
      curId = pool[Math.floor(Math.random() * pool.length)]; try { localStorage.setItem(LAST, curId); } catch (e) {}
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
