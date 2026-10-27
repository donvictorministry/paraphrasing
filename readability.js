/* DV Plugin: Readability (standalone). Own composer, own storage, no link to the main editor.
   Delete this file and its script tag to remove it; nothing else in the app changes. */
(function () {
  'use strict';
  var P = 'dvp-rd';
  function init() {
    try {
      var grid = document.querySelector('.feature-grid');
      if (!/Android/i.test(navigator.userAgent) || !grid || document.getElementById(P + '-tile')) return;
      var $ = function (id) { return document.getElementById(P + '-' + id); };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      var num = function (n) { return Number(n).toLocaleString(); };
      var V = function (n, f) { return 'var(--' + n + ',' + f + ')'; };

      var css =
        '.' + P + '-tile{background:' + V('surface-color', '#F8F9FA') + ';border:1px solid ' + V('outline-color', '#E0E0E0') + ';border-radius:20px;padding:16px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;cursor:pointer;min-height:110px;color:' + V('text-color', '#121212') + ';font:600 19px Roboto,sans-serif}' +
        '.' + P + '-tile:active{background:' + V('primary-ripple', 'rgba(223,30,90,.2)') + ';border-color:' + V('primary', '#DF1E5A') + '}' +
        '.' + P + '-tile svg,.' + P + '-bar svg,.' + P + '-sh svg{width:30px;height:30px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
        '.' + P + '-tile svg{width:32px;height:32px;stroke:' + V('primary', '#DF1E5A') + '}' +
        '.' + P + '-page{position:fixed;inset:0;width:100dvw;height:100dvh;background:' + V('bg-color', '#fff') + ';color:' + V('text-color', '#121212') + ';z-index:16000;display:flex;flex-direction:column;transform:translateX(100%);visibility:hidden;transition:transform .3s,visibility .3s;font:19px Roboto,sans-serif;overflow:hidden}' +
        '.' + P + '-page *{box-sizing:border-box;font-family:inherit}.' + P + '-page.open{transform:none;visibility:visible}' +
        '.' + P + '-bar{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 8px;background:' + V('surface-color', '#F8F9FA') + ';border-bottom:1px solid ' + V('outline-color', '#E0E0E0') + ';flex-shrink:0}' +
        '.' + P + '-bar h2{font-size:21px;font-weight:700;flex:1;text-align:center;margin:0}' +
        '.' + P + '-bar button,.' + P + '-sh button.' + P + '-x{width:48px;height:48px;border:0;border-radius:50%;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}' +
        '.' + P + '-bar svg{fill:currentColor;stroke:none}.' + P + '-bar button:first-child svg{fill:none;stroke:currentColor}' +
        '.' + P + '-ta{flex:1;width:100%;border:0;outline:0;resize:none;padding:20px 16px;background:transparent;color:inherit;font:19px/1.7 Roboto,sans-serif}' +
        '.' + P + '-status{border:0;border-top:1px solid ' + V('outline-color', '#E0E0E0') + ';background:' + V('surface-color', '#F8F9FA') + ';color:inherit;font:600 16px Roboto,sans-serif;padding:14px 16px;display:flex;justify-content:space-between;gap:12px;text-align:left;cursor:pointer;flex-shrink:0}' +
        '.' + P + '-status span:last-child{color:' + V('primary', '#DF1E5A') + '}' +
        '.' + P + '-scrim{position:absolute;inset:0;background:rgba(0,0,0,.45);opacity:0;pointer-events:none;transition:opacity .3s}.' + P + '-scrim.on{opacity:1;pointer-events:auto}' +
        '.' + P + '-sh{position:absolute;top:0;right:0;bottom:0;width:90dvw;background:' + V('bg-color', '#fff') + ';box-shadow:-8px 0 32px rgba(0,0,0,.25);transform:translateX(105%);transition:transform .3s cubic-bezier(.2,.8,.2,1);display:flex;flex-direction:column}.' + P + '-sh.on{transform:none}' +
        '.' + P + '-sh header{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 8px 0 16px;border-bottom:1px solid ' + V('outline-color', '#E0E0E0') + ';flex-shrink:0}.' + P + '-sh h3{margin:0;font-size:21px}' +
        '.' + P + '-sb{flex:1;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:14px}' +
        '.' + P + '-sf{display:flex;gap:10px;padding:12px 16px;border-top:1px solid ' + V('outline-color', '#E0E0E0') + ';flex-shrink:0}' +
        '.' + P + '-sf button{flex:1;padding:14px 8px;border-radius:12px;border:1px solid ' + V('outline-color', '#E0E0E0') + ';background:transparent;color:inherit;font:700 19px Roboto,sans-serif;cursor:pointer}.' + P + '-sf button:first-child{background:' + V('primary', '#DF1E5A') + ';border-color:' + V('primary', '#DF1E5A') + ';color:#fff}' +
        '.' + P + '-scope{margin:0;font-size:16px;font-weight:700;color:' + V('primary', '#DF1E5A') + '}' +
        '.' + P + '-hero{background:linear-gradient(135deg,' + V('primary', '#DF1E5A') + ',#7A0F32);color:#fff;border-radius:20px;padding:20px;text-align:center;display:flex;flex-direction:column;gap:2px}.' + P + '-hero b{font-size:52px;line-height:1.1}.' + P + '-hero span{font-size:19px;font-weight:600}' +
        '.' + P + '-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}' +
        '.' + P + '-stat{border:1px solid ' + V('outline-color', '#E0E0E0') + ';border-radius:16px;padding:14px 10px;background:' + V('surface-color', '#F8F9FA') + ';display:flex;flex-direction:column;gap:2px}.' + P + '-stat b{font-size:24px;color:' + V('primary', '#DF1E5A') + '}.' + P + '-stat span{font-size:16px;font-weight:600}' +
        '.' + P + '-h{margin:6px 0 0;font-size:19px;font-weight:800}.' + P + '-note{margin:0;font-size:19px;opacity:.8;line-height:1.5}' +
        '.' + P + '-m{display:grid;grid-template-columns:96px 1fr 40px;gap:8px;align-items:center;font-size:16px}.' + P + '-m div{height:10px;border-radius:5px;background:' + V('primary-ripple', 'rgba(223,30,90,.2)') + ';overflow:hidden}.' + P + '-m i{display:block;height:100%;background:' + V('primary', '#DF1E5A') + ';border-radius:5px}.' + P + '-m em{font-style:normal;font-weight:700;text-align:right}' +
        '.' + P + '-dlg{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:160000;padding:24px}' +
        '.' + P + '-card{background:' + V('surface-color', '#F8F9FA') + ';color:' + V('text-color', '#121212') + ';border:1px solid ' + V('outline-color', '#E0E0E0') + ';border-radius:28px;padding:24px;width:100%;font:19px Roboto,sans-serif}.' + P + '-card h3{margin:0 0 12px;font-size:22px}.' + P + '-card p{margin:0 0 16px;line-height:1.5}.' + P + '-card div{display:flex;justify-content:flex-end;gap:10px}' +
        '.' + P + '-card button{padding:12px 22px;border-radius:12px;border:1px solid ' + V('outline-color', '#E0E0E0') + ';background:transparent;color:inherit;font:700 19px Roboto,sans-serif;cursor:pointer}.' + P + '-card button.' + P + '-p{background:' + V('primary', '#DF1E5A') + ';border-color:' + V('primary', '#DF1E5A') + ';color:#fff}' +
        '.' + P + '-gauge{position:relative;height:12px;border-radius:6px;background:linear-gradient(90deg,#B3261E,#F5A524,#146C2E)}.' + P + '-gauge i{position:absolute;top:-5px;width:6px;height:22px;margin-left:-3px;border-radius:3px;background:' + V('text-color', '#121212') + ';border:2px solid ' + V('bg-color', '#fff') + '}' +
        '.' + P + '-jump{text-align:left;padding:12px;border:1px solid ' + V('outline-color', '#E0E0E0') + ';border-radius:14px;background:' + V('surface-color', '#F8F9FA') + ';color:inherit;font:19px/1.4 Roboto,sans-serif;cursor:pointer}.' + P + '-jump b{display:block;font-size:16px;color:' + V('primary', '#DF1E5A') + ';margin-bottom:2px}';
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

      var svg = function (d, fill) { return '<svg viewBox="0 0 24 24"' + (fill ? ' style="fill:currentColor;stroke:none"' : '') + '><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button'); tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M4 5h16M4 10h16M4 15h10M16 18l2 2 4-5') + '<span>Readability</span>'; grid.appendChild(tile);
      var page = document.createElement('section'); page.className = P + '-page'; page.setAttribute('aria-label', 'Readability');
      page.innerHTML =
        '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Readability</h2>' +
        '<button id="' + P + '-dots" aria-label="Details"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button></header>' +
        '<textarea class="' + P + '-ta" id="' + P + '-ta" placeholder="Paste or write your text here" autocapitalize="sentences" spellcheck="true"></textarea>' +
        '<button class="' + P + '-status" id="' + P + '-status"><span id="' + P + '-st"></span><span>Details</span></button>' +
        '<div class="' + P + '-scrim" id="' + P + '-scrim"></div>' +
        '<aside class="' + P + '-sh" id="' + P + '-sh" aria-label="Details"><header><h3>Readability details</h3><button class="' + P + '-x" id="' + P + '-x" aria-label="Close">' + svg('M6 6l12 12M18 6L6 18') + '</button></header><div class="' + P + '-sb" id="' + P + '-sb"></div>' +
        '<div class="' + P + '-sf"><button id="' + P + '-copy">Copy text</button><button id="' + P + '-clear">Clear</button></div></aside>';
      document.body.appendChild(page);
      var ta = $('ta'), sh = $('sh'), scrim = $('scrim');

      var dlg = function (t, m, confirm) {
        return new Promise(function (res) {
          var d = document.createElement('div'); d.className = P + '-dlg';
          d.innerHTML = '<div class="' + P + '-card" role="dialog" aria-modal="true"><h3>' + esc(t) + '</h3><p>' + esc(m) + '</p><div>' + (confirm ? '<button data-v="0">Cancel</button>' : '') + '<button class="' + P + '-p" data-v="1">OK</button></div></div>';
          d.querySelectorAll('button').forEach(function (b) { b.onclick = function () { d.remove(); res(b.getAttribute('data-v') === '1'); }; });
          document.body.appendChild(d);
        });
      };

      /* ---------- shared text helpers ---------- */
      var wordRe = /[\p{L}\p{N}]+(?:['\u2019-][\p{L}\p{N}]+)*/gu;
      var wordsOf = function (t) { return t.match(wordRe) || []; };
      var guard = function (t) {
        return t.replace(/\b(?:Mr|Mrs|Ms|Dr|Prof|St|vs|etc|Fig|No)\./gi, function (m) { return m.slice(0, -1) + '\u0003'; })
                .replace(/\b(?:[a-z]\.){2,}/gi, function (m) { return m.replace(/\./g, '\u0003'); })
                .replace(/(\d)\.(\d)/g, '$1\u0003$2');
      };
      var spans = function (t) {
        var g = guard(t), re = /[^.!?\n]+[.!?]*["')\]]*/g, m, out = [];
        while ((m = re.exec(g))) { var w = wordsOf(m[0]).length; if (w) { var lead = m[0].match(/^\s*/)[0].length; out.push({ s: m.index + lead, e: m.index + m[0].length, w: w }); } }
        return out;
      };

      /* ---------- plugin-specific analysis ---------- */
      var syl = function (w) {
        w = w.toLowerCase().replace(/[^a-z]/g, ''); if (!w) return 0; if (w.length <= 3) return 1;
        w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, ''); var m = w.match(/[aeiouy]{1,2}/g); return Math.max(1, m ? m.length : 1);
      };
      var analyze = function (t) {
        var w = wordsOf(t), sp = spans(t), sy = 0, hard = 0, passive = (t.match(/\b(?:is|are|was|were|be|been|being)\s+(?:\w+ly\s+)?\w+(?:ed|en)\b/gi) || []).length;
        w.forEach(function (x) { var n = syl(x); sy += n; if (n >= 3) hard++; });
        var wps = sp.length ? w.length / sp.length : 0, spw = w.length ? sy / w.length : 0;
        var ease = w.length && sp.length ? 206.835 - 1.015 * wps - 84.6 * spw : 0, grade = w.length && sp.length ? Math.max(0, 0.39 * wps + 11.8 * spw - 15.59) : 0;
        return { words: w.length, sent: sp.length, wps: wps, spw: spw, ease: Math.max(0, Math.min(100, ease)), grade: grade, hard: hard, passive: passive, long: sp.filter(function (s) { return s.w > 25; }).sort(function (a, b) { return b.w - a.w; }) };
      };
      var label = function (s) { return s >= 90 ? 'Very easy' : s >= 80 ? 'Easy' : s >= 70 ? 'Fairly easy' : s >= 60 ? 'Plain English' : s >= 50 ? 'Fairly difficult' : s >= 30 ? 'Difficult' : 'Very difficult'; };
      var status = function (t) { var a = analyze(t); return a.words < 5 ? 'Write at least 5 words' : 'Reading ease ' + Math.round(a.ease) + ' \u00b7 Grade ' + a.grade.toFixed(1); };
      var lastLong = [];
      var bindPanel = function () {
        $('sb').querySelectorAll('.' + P + '-jump').forEach(function (b) {
          b.onclick = function () { var s = lastLong[+b.getAttribute('data-i')]; history.back(); setTimeout(function () { var o = api.base(); api.ta.focus(); api.ta.setSelectionRange(o + s.s, o + s.e); }, 350); };
        });
      };
      var render = function (t, scope) {
        var a = analyze(t), c = function (n, l) { return '<div class="' + P + '-stat"><b>' + n + '</b><span>' + l + '</span></div>'; };
        if (a.words < 5) return '<p class="' + P + '-scope">' + esc(scope) + '</p><p class="' + P + '-note">Write or paste at least 5 words to see your readability score.</p>';
        var pos = Math.round(a.ease), spans2 = a.long, tips = [];
        lastLong = spans2.slice(0, 5).map(function (x) { return { s: x.s, e: x.e, w: x.w }; });
        if (a.ease < 60) tips.push('Aim for a score of 60 or more for a general audience.');
        if (a.wps > 20) tips.push('Your sentences average ' + a.wps.toFixed(1) + ' words. Try to stay near 15 to 20.');
        if (spans2.length) tips.push('Split the long sentences listed below.');
        if (a.hard / a.words > 0.15) tips.push('About ' + Math.round(a.hard / a.words * 100) + '% of your words are complex. Swap some for simpler ones.');
        if (a.passive > 2) tips.push('Possible passive voice appears ' + a.passive + ' times. Active verbs read faster.');
        if (!tips.length) tips.push('Nicely balanced. Your text should read comfortably.');
        var list = lastLong.map(function (x, i) { var txt = t.slice(x.s, x.e).trim(); return '<button class="' + P + '-jump" data-i="' + i + '"><b>' + x.w + ' words</b>' + esc(txt.length > 90 ? txt.slice(0, 90) + '...' : txt) + '</button>'; }).join('');
        return '<p class="' + P + '-scope">' + esc(scope) + '</p><div class="' + P + '-hero"><b>' + pos + '</b><span>' + label(a.ease) + ' (Flesch reading ease)</span></div>' +
          '<div class="' + P + '-gauge"><i style="left:' + pos + '%"></i></div><div class="' + P + '-grid">' +
          c(a.grade.toFixed(1), 'Grade level') + c(a.wps.toFixed(1), 'Words per sentence') + c(a.spw.toFixed(2), 'Syllables per word') + c(Math.round(a.hard / a.words * 100) + '%', 'Complex words') +
          c(spans2.length, 'Long sentences (25+)') + c(a.passive, 'Possible passive') + '</div>' +
          '<h4 class="' + P + '-h">Suggestions</h4>' + tips.map(function (x) { return '<p class="' + P + '-note">' + esc(x) + '</p>'; }).join('') +
          (list ? '<h4 class="' + P + '-h">Longest sentences (tap to find)</h4>' + list : '') +
          '<p class="' + P + '-note">English text only. Syllable counts are estimates.</p>';
      };

      /* ------------------------------------------------ */

      var base = 0;
      var current = function () {
        var s = ta.selectionStart, e = ta.selectionEnd;
        if (s !== e) { base = s; return { t: ta.value.slice(s, e), scope: 'Selection: ' + num(wordsOf(ta.value.slice(s, e)).length) + ' of ' + num(wordsOf(ta.value).length) + ' words' }; }
        base = 0; return { t: ta.value, scope: 'Whole document' };
      };
      var layers = [], refreshT = 0, saveT = 0;
      var refresh = function () { var c = current(); $('st').textContent = status(c.t); if (sh.classList.contains('on')) { $('sb').innerHTML = render(c.t, c.scope); bindPanel(); } };
      var later = function () { clearTimeout(refreshT); refreshT = setTimeout(refresh, 150); };

      var DB = P + '-db';
      var idb = function (mode, fn) {
        return new Promise(function (res, rej) {
          var r = indexedDB.open(DB, 1);
          r.onupgradeneeded = function () { r.result.createObjectStore('d'); };
          r.onerror = function () { rej(r.error); };
          r.onsuccess = function () { var tx = r.result.transaction('d', mode), q = fn(tx.objectStore('d')); tx.oncomplete = function () { res(q && q.result); }; tx.onerror = function () { rej(tx.error); }; };
        });
      };
      var persist = function () { clearTimeout(saveT); saveT = setTimeout(function () { idb('readwrite', function (s) { return s.put(ta.value, 'text'); }).catch(function () {}); }, 500); };
      idb('readonly', function (s) { return s.get('text'); }).then(function (v) { if (v && !ta.value) { ta.value = v; } refresh(); }).catch(refresh);

      ta.addEventListener('input', function () { later(); persist(); });
      ['keyup', 'touchend', 'mouseup'].forEach(function (ev) { ta.addEventListener(ev, later); });
      document.addEventListener('selectionchange', function () { if (document.activeElement === ta) later(); });

      var openSheet = function () { var c = current(); $('sb').innerHTML = render(c.t, c.scope); bindPanel(); sh.classList.add('on'); scrim.classList.add('on'); layers.push('sh'); history.pushState({ dvp: P }, ''); };
      var closeSheetUi = function () { sh.classList.remove('on'); scrim.classList.remove('on'); };
      tile.onclick = function () { page.classList.add('open'); layers.push('pg'); history.pushState({ dvp: P }, ''); refresh(); };
      $('back').onclick = function () { history.back(); };
      $('x').onclick = scrim.onclick = function () { history.back(); };
      $('dots').onclick = $('status').onclick = openSheet;
      window.addEventListener('popstate', function () { var l = layers.pop(); if (l === 'sh') closeSheetUi(); else if (l === 'pg') page.classList.remove('open'); });
      api.close = function () { history.back(); };
      $('copy').onclick = function () { try { navigator.clipboard.writeText(ta.value).then(function () { dlg('Copied', 'Your text was copied to the clipboard.'); }, function () { dlg('Copy Failed', 'Clipboard access was blocked.'); }); } catch (e) { dlg('Copy Failed', 'Clipboard access was blocked.'); } };
      $('clear').onclick = function () { if (!ta.value) return; dlg('Clear text', 'Delete everything in this composer?', true).then(function (ok) { if (ok) { ta.value = ''; persist(); refresh(); } }); };
      api.ta = ta; api.base = function () { return base; };
    } catch (err) { console.warn('Readability plugin disabled:', err); }
  }
  var api = {};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
