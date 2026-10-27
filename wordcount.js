/* DV Plugin: Word Count (standalone). Own composer, own storage, no link to the main editor.
   Delete this file and its script tag to remove it; nothing else in the app changes. */
(function () {
  'use strict';
  var P = 'dvp-wc';
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
        '';
      var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

      var svg = function (d, fill) { return '<svg viewBox="0 0 24 24"' + (fill ? ' style="fill:currentColor;stroke:none"' : '') + '><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button'); tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M5 5h14M5 10h14M5 15h9M5 20h5') + '<span>Word Count</span>'; grid.appendChild(tile);
      var page = document.createElement('section'); page.className = P + '-page'; page.setAttribute('aria-label', 'Word Count');
      page.innerHTML =
        '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Word Count</h2>' +
        '<button id="' + P + '-dots" aria-label="Details"><svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg></button></header>' +
        '<textarea class="' + P + '-ta" id="' + P + '-ta" placeholder="Paste or write your text here" autocapitalize="sentences" spellcheck="true"></textarea>' +
        '<button class="' + P + '-status" id="' + P + '-status"><span id="' + P + '-st"></span><span>Details</span></button>' +
        '<div class="' + P + '-scrim" id="' + P + '-scrim"></div>' +
        '<aside class="' + P + '-sh" id="' + P + '-sh" aria-label="Details"><header><h3>Word Count details</h3><button class="' + P + '-x" id="' + P + '-x" aria-label="Close">' + svg('M6 6l12 12M18 6L6 18') + '</button></header><div class="' + P + '-sb" id="' + P + '-sb"></div>' +
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
      var STOP = 'the and for are was were not but you your our with this that have has had from they them their there then than which what when where will would could should about into over also been being its just like more most much only other some such very can all any one two out how who why too use'.split(' ');
      var analyze = function (t) {
        var w = wordsOf(t), lw = w.map(function (x) { return x.toLowerCase(); }), sp = spans(t), freq = {}, uniq = {}, letters = 0, longest = 0;
        lw.forEach(function (x) { uniq[x] = 1; letters += x.replace(/[^\p{L}\p{N}]/gu, '').length; if (x.length > 2 && STOP.indexOf(x) < 0) freq[x] = (freq[x] || 0) + 1; });
        sp.forEach(function (s) { if (s.w > longest) longest = s.w; });
        var top = Object.keys(freq).map(function (k) { return [k, freq[k]]; }).filter(function (p) { return p[1] > 1; }).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 8);
        return { words: w.length, chars: t.length, nospace: t.replace(/\s/g, '').length, sent: sp.length, para: t.split(/\n+/).filter(function (p) { return wordsOf(p).length; }).length, uniq: Object.keys(uniq).length, letters: letters, longest: longest, top: top };
      };
      var fmt = function (min) { var s = Math.round(min * 60); if (s < 60) return s + ' sec'; var m = Math.floor(s / 60), r = s % 60; return m + ' min' + (r ? ' ' + r + ' sec' : ''); };
      var status = function (t) { var a = analyze(t); return num(a.words) + ' words \u00b7 ' + num(a.chars) + ' characters'; };
      var bindPanel = function () {};
      var render = function (t, scope) {
        var a = analyze(t), c = function (n, l) { return '<div class="' + P + '-stat"><b>' + n + '</b><span>' + l + '</span></div>'; };
        var top = a.top.length ? a.top.map(function (p) { return '<div class="' + P + '-m"><span>' + esc(p[0]) + '</span><div><i style="width:' + Math.round(p[1] / a.top[0][1] * 100) + '%"></i></div><em>' + p[1] + '</em></div>'; }).join('') : '<p class="' + P + '-note">No repeated words yet.</p>';
        return '<p class="' + P + '-scope">' + esc(scope) + '</p><div class="' + P + '-hero"><b>' + num(a.words) + '</b><span>words</span></div><div class="' + P + '-grid">' +
          c(num(a.chars), 'Characters') + c(num(a.nospace), 'No spaces') + c(num(a.sent), 'Sentences') + c(num(a.para), 'Paragraphs') +
          c(fmt(a.words / 238), 'Reading time') + c(fmt(a.words / 130), 'Speaking time') +
          c(a.sent ? (a.words / a.sent).toFixed(1) : '0', 'Words per sentence') + c(num(a.longest), 'Longest sentence') +
          c(num(a.uniq), 'Unique words') + c(a.words ? Math.round(a.uniq / a.words * 100) + '%' : '0%', 'Word variety') +
          c(a.words ? (a.letters / a.words).toFixed(1) : '0', 'Letters per word') + c(a.words ? Math.round(a.chars / Math.max(a.words, 1)) : '0', 'Chars per word') +
          '</div><h4 class="' + P + '-h">Most used words</h4>' + top + '<p class="' + P + '-note">Reading time uses 238 words a minute and speaking time 130.</p>';
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
    } catch (err) { console.warn('Word Count plugin disabled:', err); }
  }
  var api = {};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
