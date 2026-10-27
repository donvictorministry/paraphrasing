/* DV Plugin: Translator. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-tr';
  function init() {
    try {
      var grid = document.querySelector('.feature-grid');
      if (!/Android/i.test(navigator.userAgent) || !grid || document.getElementById(P + '-tile')) return;
      var $ = function (id) { return document.getElementById(P + '-' + id); };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      var LANGS = [['en', 'English'], ['es', 'Spanish'], ['fr', 'French'], ['de', 'German'], ['pt', 'Portuguese'], ['it', 'Italian'], ['ar', 'Arabic'], ['hi', 'Hindi'], ['sw', 'Swahili'], ['ha', 'Hausa'], ['yo', 'Yoruba'], ['ig', 'Igbo'], ['zh-CN', 'Chinese'], ['ja', 'Japanese'], ['ru', 'Russian'], ['tr', 'Turkish']];
      var opts = function (auto) { return (auto ? '<option value="Autodetect">Detect language</option>' : '') + LANGS.map(function (l) { return '<option value="' + l[0] + '">' + l[1] + '</option>'; }).join(''); };

      var style = document.createElement('style');
      style.textContent =
        '.' + P + '-tile{background:var(--surface-color,#F8F9FA);border:1px solid var(--outline-color,#E0E0E0);border-radius:20px;padding:16px 12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;cursor:pointer;min-height:110px;color:var(--text-color,#121212);font:600 19px Roboto,sans-serif}' +
        '.' + P + '-tile:active{background:var(--primary-ripple,rgba(223,30,90,.2));border-color:var(--primary,#DF1E5A)}' +
        '.' + P + '-tile svg{width:32px;height:32px;fill:none;stroke:var(--primary,#DF1E5A);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
        '.' + P + '-page{position:fixed;inset:0;width:100dvw;height:100dvh;background:var(--bg-color,#fff);color:var(--text-color,#121212);z-index:16000;display:flex;flex-direction:column;transform:translateX(100%);visibility:hidden;transition:transform .3s,visibility .3s;font:19px Roboto,sans-serif}' +
        '.' + P + '-page.open{transform:none;visibility:visible}' +
        '.' + P + '-bar{height:64px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:var(--surface-color,#F8F9FA);border-bottom:1px solid var(--outline-color,#E0E0E0);flex-shrink:0}' +
        '.' + P + '-bar h2{font-size:21px;font-weight:700;flex:1;text-align:center;margin:0}' +
        '.' + P + '-bar button{width:48px;height:48px;border:0;border-radius:50%;background:transparent;color:inherit;display:grid;place-items:center;cursor:pointer}' +
        '.' + P + '-bar svg,.' + P + '-swap svg{width:28px;height:28px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
        '.' + P + '-body{flex:1;overflow:auto;padding:20px 16px;display:flex;flex-direction:column;gap:16px}' +
        '.' + P + '-row{display:flex;align-items:flex-end;gap:8px}.' + P + '-row label{flex:1;display:flex;flex-direction:column;gap:4px;font-size:16px;font-weight:600;min-width:0}' +
        '.' + P + '-swap{width:48px;height:48px;border:1px solid var(--outline-color,#E0E0E0);border-radius:50%;background:transparent;color:inherit;display:grid;place-items:center;flex-shrink:0;cursor:pointer}' +
        '.' + P + '-page select,.' + P + '-page textarea{width:100%;padding:12px;border:1px solid var(--outline-color,#E0E0E0);border-radius:12px;background:var(--surface-color,#F8F9FA);color:inherit;font:19px Roboto,sans-serif}' +
        '.' + P + '-page textarea{min-height:160px;resize:vertical}' +
        '.' + P + '-go{background:var(--primary,#DF1E5A);color:#fff;border:0;border-radius:12px;padding:14px;font:700 19px Roboto,sans-serif;cursor:pointer}' +
        '.' + P + '-res{background:var(--surface-color,#F8F9FA);border:1px solid var(--outline-color,#E0E0E0);border-radius:20px;padding:16px;display:flex;flex-direction:column;gap:12px;overflow-wrap:anywhere;line-height:1.5}' +
        '.' + P + '-acts{display:flex;gap:8px;border-top:1px solid var(--outline-color,#E0E0E0);padding-top:10px}' +
        '.' + P + '-acts button{flex:1 1 0;min-width:0;padding:10px 4px;border:1px solid var(--outline-color,#E0E0E0);border-radius:12px;background:var(--bg-color,#fff);color:inherit;font:600 16px Roboto,sans-serif;cursor:pointer}' +
        '.' + P + '-acts .' + P + '-ed{background:var(--primary,#DF1E5A);border-color:var(--primary,#DF1E5A);color:#fff}' +
        '.' + P + '-dlg{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:160000;padding:24px}' +
        '.' + P + '-card{background:var(--surface-color,#F8F9FA);color:var(--text-color,#121212);border:1px solid var(--outline-color,#E0E0E0);border-radius:28px;padding:24px;width:100%;font:19px Roboto,sans-serif}' +
        '.' + P + '-card h3{margin:0 0 12px;font-size:22px}.' + P + '-card p{margin:0 0 16px;line-height:1.5;overflow-wrap:anywhere}' +
        '.' + P + '-spin{position:fixed;inset:0;background:rgba(0,0,0,.4);display:none;align-items:center;justify-content:center;z-index:170000}' +
        '.' + P + '-spin.on{display:flex}.' + P + '-spin i{width:56px;height:56px;border:6px solid #fff;border-top-color:var(--primary,#DF1E5A);border-radius:50%;animation:' + P + 'sp .8s linear infinite}@keyframes ' + P + 'sp{to{transform:rotate(360deg)}}';
      document.head.appendChild(style);

      var svg = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button');
      tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M4 6h9M8.5 4v2M6 6c0 4 3 7 6.500 8M12 6c-1 4-3.500 7-7 8.500M13 20l4-9 4 9M14.500 17h5') + '<span>Translator</span>';
      grid.appendChild(tile);

      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Translator');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Translator</h2><div style="width:48px"></div></header>' +
        '<div class="' + P + '-body"><div class="' + P + '-row"><label>From<select id="' + P + '-from">' + opts(true) + '</select></label><button class="' + P + '-swap" id="' + P + '-swap" aria-label="Swap languages">' + svg('M4 8h14l-3-3M20 16H6l3 3') + '</button><label>To<select id="' + P + '-to">' + opts(false) + '</select></label></div>' +
        '<textarea id="' + P + '-in" placeholder="Enter or paste text to translate"></textarea><button class="' + P + '-go" id="' + P + '-go">Translate</button><div id="' + P + '-out"></div></div>';
      document.body.appendChild(page);
      var spin = document.createElement('div'); spin.className = P + '-spin'; spin.innerHTML = '<i></i>'; document.body.appendChild(spin);
      $('to').value = 'es';

      var busy = function (on) { var h = document.getElementById('screen-center-spinner'); if (h) h.classList.toggle('active', on); else spin.classList.toggle('on', on); };
      var dlg = function (t, m) {
        var d = document.createElement('div'); d.className = P + '-dlg';
        d.innerHTML = '<div class="' + P + '-card" role="dialog" aria-modal="true"><h3>' + esc(t) + '</h3><p>' + esc(m) + '</p><div style="text-align:right"><button class="' + P + '-go" style="padding:12px 24px">OK</button></div></div>';
        d.querySelector('button').onclick = function () { d.remove(); }; document.body.appendChild(d);
      };
      var copy = function (t) { try { navigator.clipboard.writeText(t).then(function () { dlg('Copied', 'Translation copied to clipboard.'); }, function () { dlg('Copy Failed', 'Clipboard access was blocked.'); }); } catch (e) { dlg('Copy Failed', 'Clipboard access was blocked.'); } };
      var editor = function () { return document.getElementById('main-editor'); };
      var decode = function (s) { var t = document.createElement('textarea'); t.innerHTML = s; return t.value; };

      var isOpen = false;
      var open = function () {
        var ed = editor(), sel = ed && ed.selectionStart !== ed.selectionEnd ? ed.value.slice(ed.selectionStart, ed.selectionEnd) : '';
        if (ed) $('in').value = sel || ed.value;
        $('out').innerHTML = ''; page.classList.add('open'); isOpen = true; history.pushState({ dvp: P }, '');
      };
      var close = function () { page.classList.remove('open'); isOpen = false; };
      tile.onclick = open;
      $('back').onclick = function () { history.back(); };
      window.addEventListener('popstate', function () { if (isOpen) close(); });
      $('swap').onclick = function () { var f = $('from').value, t = $('to').value; if (f === 'Autodetect') return; $('from').value = t; $('to').value = f; };

      var chunks = function (t) {
        var parts = t.split(/(?<=[.!?\n])\s+/), out = [], cur = '';
        parts.forEach(function (p) { while (p.length > 450) { out.push(p.slice(0, 450)); p = p.slice(450); } if ((cur + ' ' + p).length > 450) { out.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p; });
        if (cur) out.push(cur); return out;
      };
      $('go').onclick = async function () {
        var text = $('in').value.trim(), from = $('from').value, to = $('to').value;
        if (!text) return dlg('Text Required', 'Enter some text to translate.');
        if (from === to) return dlg('Same Language', 'Choose two different languages.');
        if (!navigator.onLine) return dlg('Offline', 'You are offline. Translation needs an internet connection.');
        busy(true);
        try {
          var res = [], parts = chunks(text);
          for (var i = 0; i < parts.length; i++) {
            var r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(parts[i]) + '&langpair=' + encodeURIComponent(from + '|' + to));
            if (!r.ok) throw new Error('The translation service is unavailable.');
            var j = await r.json();
            if (j.quotaFinished || String(j.responseStatus) === '429') throw new Error('The free daily translation limit has been reached. Try again tomorrow.');
            if (String(j.responseStatus) !== '200') throw new Error(j.responseDetails || 'Translation failed.');
            res.push(decode(j.responseData.translatedText));
          }
          var out = res.join(' '), box = $('out');
          box.innerHTML = '<div class="' + P + '-res"><p style="margin:0">' + esc(out) + '</p><div class="' + P + '-acts"><button data-a="c">Copy</button><button data-a="s">Share</button>' + (editor() ? '<button data-a="e" class="' + P + '-ed">Editor</button>' : '') + '</div></div>';
          box.querySelector('[data-a=c]').onclick = function () { copy(out); };
          box.querySelector('[data-a=s]').onclick = function () { if (navigator.share) navigator.share({ title: 'Translation', text: out }).catch(function () {}); else copy(out); };
          var eb = box.querySelector('[data-a=e]');
          if (eb) eb.onclick = function () { var ed = editor(); ed.value = out; ed.dispatchEvent(new Event('input')); history.back(); };
        } catch (e) { dlg('Translator', navigator.onLine ? e.message : 'You are offline. Translation needs an internet connection.'); }
        finally { busy(false); }
      };
    } catch (err) { console.warn('Translator plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
