/* DV Plugin: Synonyms. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-sy';
  function init() {
    try {
      var grid = document.querySelector('.feature-grid');
      if (!/Android/i.test(navigator.userAgent) || !grid || document.getElementById(P + '-tile')) return;
      var $ = function (id) { return document.getElementById(P + '-' + id); };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      var cap = function (s) { return s.charAt(0).toUpperCase() + s.slice(1); };

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
        '.' + P + '-chips{display:flex;flex-wrap:wrap;gap:8px}.' + P + '-chip{padding:8px 16px;border:1px solid var(--outline-color,#E0E0E0);border-radius:999px;background:var(--bg-color,#fff);color:inherit;font:600 19px Roboto,sans-serif;cursor:pointer}.' + P + '-chip:active{background:var(--primary-ripple,rgba(223,30,90,.2))}.' + P + '-h{font-size:16px;font-weight:700;color:var(--primary,#DF1E5A);margin:0}.' + P + '-hint{font-size:19px;opacity:.8;margin:0}';
      document.head.appendChild(style);

      var svg = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button');
      tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M4 8h14l-3-3M20 16H6l3 3') + '<span>Synonyms</span>';
      grid.appendChild(tile);

      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Synonyms');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Synonyms</h2><div style="width:48px"></div></header>' +
        '<div class="' + P + '-body"><p class="' + P + '-hint" id="' + P + '-hint">Select a word in the editor, then open Synonyms to swap it in one tap. Or type any word below.</p>' +
        '<input id="' + P + '-in" type="text" placeholder="Type a word" autocapitalize="none" autocomplete="off"><button class="' + P + '-go" id="' + P + '-go">Find Synonyms</button><div id="' + P + '-out" style="display:flex;flex-direction:column;gap:16px"></div></div>';
      document.body.appendChild(page);
      var spin = document.createElement('div'); spin.className = P + '-spin'; spin.innerHTML = '<i></i>'; document.body.appendChild(spin);

      var busy = function (on) { var h = document.getElementById('screen-center-spinner'); if (h) h.classList.toggle('active', on); else spin.classList.toggle('on', on); };
      var dlg = function (t, m) {
        var d = document.createElement('div'); d.className = P + '-dlg';
        d.innerHTML = '<div class="' + P + '-card" role="dialog" aria-modal="true"><h3>' + esc(t) + '</h3><p>' + esc(m) + '</p><div style="text-align:right"><button class="' + P + '-go" style="padding:12px 24px">OK</button></div></div>';
        d.querySelector('button').onclick = function () { d.remove(); }; document.body.appendChild(d);
      };
      var copy = function (t) { try { navigator.clipboard.writeText(t).then(function () { dlg('Copied', 'Word copied to clipboard.'); }, function () { dlg('Copy Failed', 'Clipboard access was blocked.'); }); } catch (e) { dlg('Copy Failed', 'Clipboard access was blocked.'); } };
      var editor = function () { return document.getElementById('main-editor'); };
      var sel = null, isOpen = false;
      var close = function () { page.classList.remove('open'); isOpen = false; };
      var choose = function (w) {
        var ed = editor();
        if (sel && ed) { var rep = /^[A-Z]/.test(sel.t) ? cap(w) : w; ed.value = ed.value.slice(0, sel.s) + rep + ed.value.slice(sel.e); ed.dispatchEvent(new Event('input')); history.back(); }
        else copy(w);
      };
      var group = function (title, words) {
        if (!words.length) return '';
        return '<div><p class="' + P + '-h">' + title + '</p><div class="' + P + '-chips">' + words.map(function (w) { return '<button class="' + P + '-chip" data-w="' + esc(w) + '">' + esc(w) + '</button>'; }).join('') + '</div></div>';
      };
      var find = async function () {
        var w = $('in').value.trim().split(/\s+/)[0].toLowerCase();
        if (!w) return dlg('Word Required', 'Type a word first.');
        if (!navigator.onLine) return dlg('Offline', 'You are offline. Synonyms need an internet connection.');
        busy(true);
        try {
          var q = encodeURIComponent(w);
          var rs = await Promise.all([fetch('https://api.datamuse.com/words?rel_syn=' + q + '&max=30'), fetch('https://api.datamuse.com/words?ml=' + q + '&max=30')]);
          if (!rs[0].ok || !rs[1].ok) throw new Error('The synonym service is unavailable.');
          var syn = (await rs[0].json()).map(function (x) { return x.word; });
          var rel = (await rs[1].json()).map(function (x) { return x.word; }).filter(function (x) { return x !== w && syn.indexOf(x) < 0; }).slice(0, 20);
          var box = $('out');
          box.innerHTML = group('Synonyms', syn) + group('Related words', rel) || '';
          if (!syn.length && !rel.length) box.innerHTML = '<p>No results for "' + esc(w) + '". Try another word.</p>';
          box.querySelectorAll('.' + P + '-chip').forEach(function (b) { b.onclick = function () { choose(b.getAttribute('data-w')); }; });
        } catch (e) { dlg('Synonyms', navigator.onLine ? e.message : 'You are offline. Synonyms need an internet connection.'); }
        finally { busy(false); }
      };
      var open = function () {
        var ed = editor(), w = ''; sel = null;
        if (ed && ed.selectionStart !== ed.selectionEnd) {
          var t = ed.value.slice(ed.selectionStart, ed.selectionEnd);
          if (/^[A-Za-z'-]+$/.test(t.trim()) && t === t.trim()) { w = t; sel = { s: ed.selectionStart, e: ed.selectionEnd, t: t }; }
        }
        $('in').value = w; $('out').innerHTML = ''; page.classList.add('open'); isOpen = true; history.pushState({ dvp: P }, '');
        if (w) find();
      };
      tile.onclick = open;
      $('back').onclick = function () { history.back(); };
      window.addEventListener('popstate', function () { if (isOpen) close(); });
      $('go').onclick = find;
      $('in').addEventListener('keydown', function (e) { if (e.key === 'Enter') find(); });
    } catch (err) { console.warn('Synonyms plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
