/* DV Plugin: Web Search. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-ws';
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
      tile.innerHTML = svg('M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5') + '<span>Web Search</span>';
      grid.appendChild(tile);
      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Web Search');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Web Search</h2><div style="width:48px"></div></header><div class="' + P + '-body">' + '<div class="' + P + '-sr"><input id="' + P + '-in" type="text" placeholder="Search for anything" autocomplete="off" enterkeyhint="search"><button class="' + P + '-go" id="' + P + '-go" aria-label="Search Wikipedia">' + svg('M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM21 21l-5-5') + '</button></div><p class="' + P + '-h">Open the full web search</p><div class="' + P + '-r"><button data-e="brave">Brave</button><button data-e="google">Google</button><button data-e="ddg">DuckDuckGo</button></div><p class="' + P + '-note">Wikipedia results appear here. Tap the search icon for Wikipedia. The other three open in your browser, since they cannot be shown inside an app without a private key.</p><div id="' + P + '-out" style="display:flex;flex-direction:column;gap:16px"></div>' + '</div>';
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
      var ENG = { brave: 'https://search.brave.com/search?q=', google: 'https://www.google.com/search?q=', ddg: 'https://duckduckgo.com/?q=' };
      var query = function () { return $('in').value.trim(); };
      page.querySelectorAll('[data-e]').forEach(function (b) {
        b.onclick = function () {
          var q = query(); if (!q) return dlg('Search Needed', 'Type what you want to search for.');
          if (!navigator.onLine) return dlg('Offline', 'You are offline. Searching needs an internet connection.');
          busy(true);
          setTimeout(function () { busy(false); window.open(ENG[b.getAttribute('data-e')] + encodeURIComponent(q), '_blank', 'noopener'); }, 700);
        };
      });
      var plain = function (h) { var t = document.createElement('textarea'); t.innerHTML = String(h).replace(/<[^>]+>/g, ''); return t.value; };
      var wiki = async function () {
        var q = query();
        if (!q) return dlg('Search Needed', 'Type what you want to search for.');
        if (!navigator.onLine) return dlg('Offline', 'You are offline. Searching needs an internet connection.');
        busy(true);
        try {
          var r = await fetch('https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + encodeURIComponent(q) + '&srlimit=8&format=json&origin=*');
          if (!r.ok) throw new Error('Wikipedia search is unavailable.');
          var j = await r.json(), hits = (j.query && j.query.search) || [], o = $('out');
          o.innerHTML = hits.length ? hits.map(function (x) { return '<div class="' + P + '-res ' + P + '-hit"><b>' + esc(x.title) + '</b><span>' + esc(plain(x.snippet)) + '...</span><button data-id="' + x.pageid + '">Open article</button></div>'; }).join('') : '<div class="' + P + '-res"><p class="' + P + '-note">No Wikipedia results for "' + esc(q) + '". Try the web search buttons above.</p></div>';
          o.querySelectorAll('[data-id]').forEach(function (b) { b.onclick = function () { window.open('https://en.wikipedia.org/?curid=' + b.getAttribute('data-id'), '_blank', 'noopener'); }; });
          o.scrollIntoView({ behavior: 'smooth' });
        } catch (e) { dlg('Search', navigator.onLine ? e.message : 'You are offline. Searching needs an internet connection.'); }
        finally { busy(false); }
      };
      $('go').onclick = wiki;
      $('in').addEventListener('keydown', function (e) { if (e.key === 'Enter') wiki(); });
    } catch (err) { console.warn('Web Search plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
