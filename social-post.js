/* DV Plugin: Social Post. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-sp';
  function init() {
    try {
      var grid = document.querySelector('.feature-grid');
      if (!/Android/i.test(navigator.userAgent) || !grid || document.getElementById(P + '-tile')) return;
      var $ = function (id) { return document.getElementById(P + '-' + id); };
      var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
      var low = function (s) { return s.charAt(0).toLowerCase() + s.slice(1); };
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
        '.' + P + '-page select,.' + P + '-page input:not([type=checkbox]),.' + P + '-page textarea{width:100%;padding:12px;border:1px solid var(--outline-color,#E0E0E0);border-radius:12px;background:var(--surface-color,#F8F9FA);color:inherit;font:19px Roboto,sans-serif}' +
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
        '.' + P + '-f{display:flex;flex-direction:column;gap:4px;font-size:16px;font-weight:600}' +
        '.' + P + '-chk{display:flex;align-items:center;gap:12px;font-size:19px;font-weight:500}.' + P + '-chk input{width:24px;height:24px;accent-color:var(--primary,#DF1E5A);flex-shrink:0}' +
        '.' + P + '-note{font-size:19px;opacity:.8;margin:0}.' + P + '-lbl{align-self:flex-start;font-size:16px;font-weight:700;color:var(--primary,#DF1E5A);background:var(--primary-ripple,rgba(223,30,90,.2));border-radius:999px;padding:4px 14px}' +
        '.' + P + '-cnt{font-size:16px;opacity:.8;margin:0}.' + P + '-page textarea.' + P + '-tall{min-height:320px}';
      document.head.appendChild(style);
      var svg = function (d) { return '<svg viewBox="0 0 24 24"><path d="' + d + '"/></svg>'; };
      var tile = document.createElement('button');
      tile.id = P + '-tile'; tile.className = P + '-tile';
      tile.innerHTML = svg('M5 9h14M5 15h14M10 4L8 20M16 4l-2 16') + '<span>Social Post</span>';
      grid.appendChild(tile);
      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Social Post');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Social Post</h2><div style="width:48px"></div></header><div class="' + P + '-body">' + '<p class="' + P + '-note">Template-based drafts in three styles. Edit them before posting.</p>' +
        '<label class="' + P + '-f">What do you want to post about? *<textarea id="' + P + '-topic" placeholder="Describe your update, offer or message in a sentence or two"></textarea></label>' +
        '<label class="' + P + '-f">Platform<select id="' + P + '-plat"><option>Facebook</option><option>Instagram</option><option>X</option><option>LinkedIn</option><option>WhatsApp</option></select></label>' +
        '<label class="' + P + '-f">Tone<select id="' + P + '-tone"><option value="friendly">Friendly</option><option value="professional">Professional</option><option value="excited">Excited</option><option value="inspirational">Inspirational</option></select></label>' +
        '<label class="' + P + '-chk"><input type="checkbox" id="' + P + '-tags" checked>Add hashtags</label>' +
        '<label class="' + P + '-chk"><input type="checkbox" id="' + P + '-cta" checked>Add a call to action</label>' +
        '<button class="' + P + '-go" id="' + P + '-go">Write Posts</button>' + + '<div id="' + P + '-out" style="display:flex;flex-direction:column;gap:16px"></div></div>';
      document.body.appendChild(page);
      var dlg = function (t, m) {
        var d = document.createElement('div'); d.className = P + '-dlg';
        d.innerHTML = '<div class="' + P + '-card" role="dialog" aria-modal="true"><h3>' + esc(t) + '</h3><p>' + esc(m) + '</p><div style="text-align:right"><button class="' + P + '-go" style="padding:12px 24px">OK</button></div></div>';
        d.querySelector('button').onclick = function () { d.remove(); }; document.body.appendChild(d);
      };
      var copy = function (t) { try { navigator.clipboard.writeText(t).then(function () { dlg('Copied', 'Text copied to clipboard.'); }, function () { dlg('Copy Failed', 'Clipboard access was blocked.'); }); } catch (e) { dlg('Copy Failed', 'Clipboard access was blocked.'); } };
      var editor = function () { return document.getElementById('main-editor'); };
      var isOpen = false;
      var close = function () { page.classList.remove('open'); isOpen = false; };
      tile.onclick = function () { page.classList.add('open'); isOpen = true; history.pushState({ dvp: P }, ''); };
      $('back').onclick = function () { history.back(); };
      window.addEventListener('popstate', function () { if (isOpen) close(); });
      var actions = function (box, getText) {
        var ed = document.getElementById('main-editor');
        box.insertAdjacentHTML('beforeend', '<div class="' + P + '-acts"><button data-a="c">Copy</button><button data-a="s">Share</button>' + (ed ? '<button data-a="e" class="' + P + '-ed">Editor</button>' : '') + '</div>');
        box.querySelector('[data-a=c]').onclick = function () { copy(getText()); };
        box.querySelector('[data-a=s]').onclick = function () { var t = getText(); if (navigator.share) navigator.share({ text: t }).catch(function () {}); else copy(t); };
        var eb = box.querySelector('[data-a=e]');
        if (eb) eb.onclick = function () { ed.value = getText(); ed.dispatchEvent(new Event('input')); history.back(); };
      };
      var HOOKS = { friendly: ['Quick update:', 'Just sharing this with you:', 'Here is something worth knowing:'], professional: ['An update worth sharing:', 'Key point:', 'Sharing an insight:'], excited: ['Big news!', 'We are thrilled to share this:', 'Get ready for this:'], inspirational: ['A thought for today:', 'Something to remember:', 'A reminder for all of us:'] };
      var CTA = { open: ['Tell us what you think in the comments.', 'Share your thoughts below.', 'Let us know what you think.'], short: ['Reply and tell us what you think.', 'Share this with someone who needs it.', 'Let us know your thoughts.'] };
      var PLAT = { Facebook: { tags: 3, cta: 'open' }, Instagram: { tags: 8, cta: 'open' }, X: { tags: 2, cta: 'short', max: 280 }, LinkedIn: { tags: 3, cta: 'open' }, WhatsApp: { tags: 0, cta: 'short' } };
      var STOP = 'about after again also because been before being between both could does doing during each from have here into just like more most much only other over same some such than that their them then there these they this those very want what when where which while will with would your our you and the for are was were not but can all any its has had'.split(' ');
      var keywords = function (t) {
        var seen = {}, out = [];
        (t.toLowerCase().match(/[a-z]{4,}/g) || []).forEach(function (w) { if (STOP.indexOf(w) < 0 && !seen[w]) { seen[w] = 1; out.push(w); } });
        return out;
      };
      var cut = function (s, n) { if (s.length <= n) return s; var c = s.slice(0, n - 3), i = c.lastIndexOf(' '); return (i > 20 ? c.slice(0, i) : c) + '...'; };
      $('plat').onchange = function () { $('tags').checked = PLAT[$('plat').value].tags > 0; };
      $('go').onclick = function () {
        var topic = $('topic').value.trim().replace(/[ \t]+/g, ' ');
        if (!topic) return dlg('Message Needed', 'Describe what you want to post about.');
        var pl = $('plat').value, cfg = PLAT[pl], tone = $('tone').value, hooks = HOOKS[tone], kw = keywords(topic);
        var tags = $('tags').checked && cfg.tags ? kw.slice(0, cfg.tags).map(function (w) { return '#' + w.charAt(0).toUpperCase() + w.slice(1); }).join(' ') : '';
        var wantCta = $('cta').checked, ctas = CTA[cfg.cta];
        var first = (topic.match(/^[^.!?\n]+[.!?]?/) || [topic])[0].trim();
        var body = pl === 'LinkedIn' ? topic.replace(/\n+/g, '\n\n') : topic.replace(/\n+/g, ' ');
        var asm = function (parts) { return parts.filter(Boolean).join('\n\n'); };
        var variants = [
          ['Classic', function (useCta, useTags) { return asm([hooks[0] + ' ' + low(body.charAt(0)) + body.slice(1) === '' ? '' : hooks[0], body, useCta && wantCta ? ctas[0] : '', useTags ? tags : '']); }],
          ['Short', function (useCta, useTags) { return asm([cut(first, 140), useCta && wantCta ? ctas[1] : '', useTags ? tags : '']); }],
          ['Question', function (useCta, useTags) { return asm([kw.length ? 'Have you thought about ' + kw[0] + ' lately?' : 'What do you think?', body, useCta && wantCta ? ctas[2] : '', useTags ? tags : '']); }]
        ];
        var box = $('out'); box.innerHTML = '';
        variants.forEach(function (v) {
          var text = v[1](true, true);
          if (cfg.max && text.length > cfg.max) text = v[1](true, false);
          if (cfg.max && text.length > cfg.max) text = v[1](false, false);
          if (cfg.max && text.length > cfg.max) text = cut(text, cfg.max);
          var card = document.createElement('div'); card.className = P + '-res';
          card.innerHTML = '<span class="' + P + '-lbl">' + v[0] + '</span><textarea>' + esc(text) + '</textarea><p class="' + P + '-cnt"></p>';
          var ta = card.querySelector('textarea'), cnt = card.querySelector('.' + P + '-cnt');
          var upd = function () { cnt.textContent = ta.value.length + (cfg.max ? ' / ' + cfg.max : '') + ' characters'; cnt.style.color = cfg.max && ta.value.length > cfg.max ? 'var(--error,#B3261E)' : ''; };
          ta.oninput = upd; upd();
          actions(card, function () { return ta.value; });
          box.appendChild(card);
        });
        box.scrollIntoView({ behavior: 'smooth' });
      };
    } catch (err) { console.warn('Social Post plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
