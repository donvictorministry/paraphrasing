/* DV Plugin: Dictionary. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-dc';
  function init() {
    try {
      var grid = document.querySelector('.feature-grid');
      if (!/Android/i.test(navigator.userAgent) || !grid || document.getElementById(P + '-tile')) return;
      var $ = function (id) { return document.getElementById(P + '-' + id); };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
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
        '.' + P + '-page select,.' + P + '-page input,.' + P + '-page textarea{width:100%;padding:12px;border:1px solid var(--outline-color,#E0E0E0);border-radius:12px;background:var(--surface-color,#F8F9FA);color:inherit;font:19px Roboto,sans-serif}' +
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
        '.' + P + '-spin.on{display:flex}.' + P + '-spin i{width:56px;height:56px;border:6px solid #fff;border-top-color:var(--primary,#DF1E5A);border-radius:50%;animation:' + P + 'sp .8s linear infinite}@keyframes ' + P + 'sp{to{transform:rotate(360deg)}}' +
        '.' + P + '-h{margin:0;font-size:16px;font-weight:700;color:var(--primary,#DF1E5A)}' +
        '.' + P + '-chips{display:flex;flex-wrap:wrap;gap:8px}.' + P + '-chip{padding:8px 16px;border:1px solid var(--outline-color,#E0E0E0);border-radius:999px;background:var(--bg-color,#fff);color:inherit;font:600 19px Roboto,sans-serif;cursor:pointer}.' + P + '-chip:active{background:var(--primary-ripple,rgba(223,30,90,.2))}' +
        '.' + P + '-note{margin:0;font-size:19px;opacity:.8;line-height:1.5}.' + P + '-top{display:flex;align-items:center;justify-content:space-between;gap:12px}' +
        '.' + P + '-word{font-size:30px;font-weight:900;overflow-wrap:anywhere}.' + P + '-ph{font-size:19px;opacity:.8}' +
        '.' + P + '-listen{width:52px;height:52px;border:0;border-radius:50%;background:var(--primary,#DF1E5A);display:grid;place-items:center;cursor:pointer;flex-shrink:0}.' + P + '-listen svg{width:28px;height:28px;fill:none;stroke:#fff;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}' +
        '.' + P + '-pos{align-self:flex-start;font-size:16px;font-weight:700;color:var(--primary,#DF1E5A);background:var(--primary-ripple,rgba(223,30,90,.2));border-radius:999px;padding:4px 14px}' +
        '.' + P + '-res ol{margin:0;padding-left:24px;display:flex;flex-direction:column;gap:10px}.' + P + '-ex{font-style:italic;opacity:.8;margin-top:2px}' +
        '.' + P + '-r{display:flex;gap:8px}.' + P + '-r button{flex:1 1 0;min-width:0;padding:12px 4px;border:1px solid var(--outline-color,#E0E0E0);border-radius:12px;background:var(--surface-color,#F8F9FA);color:inherit;font:700 16px Roboto,sans-serif;cursor:pointer}' +
        '.' + P + '-hit{display:flex;flex-direction:column;gap:6px;text-align:left}.' + P + '-hit b{font-size:21px}.' + P + '-hit button{align-self:flex-start;padding:10px 18px;border:0;border-radius:12px;background:var(--primary,#DF1E5A);color:#fff;font:700 16px Roboto,sans-serif;cursor:pointer}';
      style.textContent += '.' + P + '-sr{display:flex;gap:8px;align-items:stretch}.' + P + '-sr input{flex:1;min-width:0}.' + P + '-sr .' + P + '-go{width:60px;padding:0;display:grid;place-items:center;flex-shrink:0}.' + P + '-sr .' + P + '-go svg{width:26px;height:26px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}';
      document.head.appendChild(style);
      var svg = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button');
      tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M5 5a2 2 0 0 1 2-2h11v16H7a2 2 0 0 0-2 2zM5 19V5M9 8h5') + '<span>Dictionary</span>';
      grid.appendChild(tile);
      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Dictionary');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Dictionary</h2><div style="width:48px"></div></header><div class="' + P + '-body">' + '<div class="' + P + '-sr"><input id="' + P + '-in" type="text" placeholder="Type a word" autocapitalize="none" autocomplete="off" spellcheck="false" enterkeyhint="search"><button class="' + P + '-go" id="' + P + '-go" aria-label="Look up">' + svg('M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5') + '</button></div><div id="' + P + '-recent" style="display:flex;flex-direction:column;gap:8px"></div><div id="' + P + '-out" style="display:flex;flex-direction:column;gap:16px"></div>' + '</div>';
      document.body.appendChild(page);
      var spin = document.createElement('div'); spin.className = P + '-spin'; spin.innerHTML = '<i></i>'; document.body.appendChild(spin);
      var busy = function (on) { var h = document.getElementById('screen-center-spinner'); if (h) h.classList.toggle('active', on); else spin.classList.toggle('on', on); };
      var dlg = function (t, m) {
        var d = document.createElement('div'); d.className = P + '-dlg';
        d.innerHTML = '<div class="' + P + '-card" role="dialog" aria-modal="true"><h3>' + esc(t) + '</h3><p>' + esc(m) + '</p><div style="text-align:right"><button class="' + P + '-go" style="padding:12px 24px">OK</button></div></div>';
        d.querySelector('button').onclick = function () { d.remove(); }; document.body.appendChild(d);
      };
      var isOpen = false;
      var close = function () { page.classList.remove('open'); isOpen = false; };
      tile.onclick = function () { page.classList.add('open'); isOpen = true; history.pushState({ dvp: P }, ''); };
      $('back').onclick = function () { history.back(); };
      window.addEventListener('popstate', function () { if (isOpen) close(); });
      var RK = 'dvp-dc-recent', recent = [];
      try { recent = JSON.parse(localStorage.getItem(RK) || '[]') || []; } catch (e) {}
      var chip = function (w) { return '<button class="' + P + '-chip" data-w="' + esc(w) + '">' + esc(w) + '</button>'; };
      var bindChips = function (root) { root.querySelectorAll('.' + P + '-chip').forEach(function (b) { b.onclick = function () { $('in').value = b.getAttribute('data-w'); look(); }; }); };
      var drawRecent = function () { var r = $('recent'); r.innerHTML = recent.length ? '<p class="' + P + '-h">Recent searches</p><div class="' + P + '-chips">' + recent.map(chip).join('') + '</div>' : ''; bindChips(r); };
      var remember = function (w) { recent = [w].concat(recent.filter(function (x) { return x !== w; })).slice(0, 8); try { localStorage.setItem(RK, JSON.stringify(recent)); } catch (e) {} drawRecent(); };
      var speak = function (w) { try { var u = new SpeechSynthesisUtterance(w); u.lang = 'en-US'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) { dlg('Listen', 'Pronunciation is not available on this device.'); } };
      var group = function (title, words) { return words.length ? '<p class="' + P + '-h">' + title + '</p><div class="' + P + '-chips">' + words.slice(0, 8).map(chip).join('') + '</div>' : ''; };
      var show = function (data) {
        var e = data[0], ph = '', audio = '';
        data.forEach(function (en) { (en.phonetics || []).forEach(function (x) { if (!ph && x.text) ph = x.text; if (!audio && x.audio) audio = x.audio.indexOf('//') === 0 ? 'https:' + x.audio : x.audio; }); });
        ph = ph || e.phonetic || '';
        var h = '<div class="' + P + '-res"><div class="' + P + '-top"><div><div class="' + P + '-word">' + esc(e.word) + '</div><div class="' + P + '-ph">' + esc(ph) + '</div></div><button class="' + P + '-listen" id="' + P + '-listen" aria-label="Listen">' + svg('M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.500 6.500a8 8 0 0 1 0 11') + '</button></div></div>';
        data.forEach(function (en) { (en.meanings || []).forEach(function (m) {
          var syn = (m.synonyms || []).concat.apply([], (m.definitions || []).map(function (d) { return d.synonyms || []; })), ant = (m.antonyms || []).concat.apply([], (m.definitions || []).map(function (d) { return d.antonyms || []; }));
          h += '<div class="' + P + '-res"><span class="' + P + '-pos">' + esc(m.partOfSpeech || 'word') + '</span><ol>' + (m.definitions || []).slice(0, 4).map(function (d) { return '<li>' + esc(d.definition) + (d.example ? '<div class="' + P + '-ex">"' + esc(d.example) + '"</div>' : '') + '</li>'; }).join('') + '</ol>' + group('Synonyms', syn.filter(function (x, i) { return syn.indexOf(x) === i; })) + group('Antonyms', ant.filter(function (x, i) { return ant.indexOf(x) === i; })) + '</div>';
        }); });
        var o = $('out'); o.innerHTML = h; bindChips(o);
        $('listen').onclick = function () { if (audio) { try { var a = new Audio(audio); a.play().catch(function () { speak(e.word); }); } catch (x) { speak(e.word); } } else speak(e.word); };
        o.scrollIntoView({ behavior: 'smooth' });
      };
      var look = async function () {
        var w = $('in').value.trim().toLowerCase().split(/\s+/)[0];
        if (!w) return dlg('Word Needed', 'Type a word to look up.');
        if (!navigator.onLine) return dlg('Offline', 'You are offline. The dictionary needs an internet connection.');
        busy(true);
        try {
          var r = await fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + encodeURIComponent(w));
          if (r.status === 404) { $('out').innerHTML = '<div class="' + P + '-res"><p class="' + P + '-note">No definition found for "' + esc(w) + '". Check the spelling or try another word.</p></div>'; return; }
          if (!r.ok) throw new Error('The dictionary service is unavailable.');
          var data = await r.json();
          if (!Array.isArray(data) || !data.length) throw new Error('No definition was returned.');
          remember(w); show(data);
        } catch (e) { dlg('Dictionary', navigator.onLine ? e.message : 'You are offline. The dictionary needs an internet connection.'); }
        finally { busy(false); }
      };
      $('go').onclick = look;
      $('in').addEventListener('keydown', function (e) { if (e.key === 'Enter') look(); });
      drawRecent();
    } catch (err) { console.warn('Dictionary plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
