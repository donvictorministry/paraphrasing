/* DV Plugin: Cover Letter. Self-contained. Delete this file and its script tag to remove the feature. */
(function () {
  'use strict';
  var P = 'dvp-cl';
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
      tile.innerHTML = svg('M7 3h8l4 4v14H7zM15 3v4h4M10 12h6M10 16h6') + '<span>Cover Letter</span>';
      grid.appendChild(tile);
      var page = document.createElement('section');
      page.className = P + '-page'; page.setAttribute('aria-label', 'Cover Letter');
      page.innerHTML = '<header class="' + P + '-bar"><button id="' + P + '-back" aria-label="Back">' + svg('M15 5l-7 7 7 7') + '</button><h2>Cover Letter</h2><div style="width:48px"></div></header><div class="' + P + '-body">' + '<p class="' + P + '-note">A template-based draft. Review it and make it personal before sending.</p>' +
        '<label class="' + P + '-f">Your name *<input id="' + P + '-name" type="text" autocomplete="name"></label>' +
        '<label class="' + P + '-f">Job title *<input id="' + P + '-role" type="text" placeholder="e.g. Marketing Assistant"></label>' +
        '<label class="' + P + '-f">Company *<input id="' + P + '-co" type="text"></label>' +
        '<label class="' + P + '-f">Hiring manager (optional)<input id="' + P + '-mgr" type="text" placeholder="Leave empty for Hiring Manager"></label>' +
        '<label class="' + P + '-f">Years of experience (optional)<input id="' + P + '-yrs" type="number" min="0" inputmode="numeric"></label>' +
        '<label class="' + P + '-f">Top skills, separated by commas<input id="' + P + '-skills" type="text" placeholder="e.g. writing, teamwork, Excel"></label>' +
        '<label class="' + P + '-f">A key achievement (optional)<textarea id="' + P + '-win" placeholder="e.g. I grew our newsletter audience by 40% in six months"></textarea></label>' +
        '<label class="' + P + '-f">Why this company? (optional)<textarea id="' + P + '-why" placeholder="e.g. of its focus on education"></textarea></label>' +
        '<label class="' + P + '-f">Tone<select id="' + P + '-tone"><option value="professional">Professional</option><option value="enthusiastic">Enthusiastic</option><option value="concise">Concise</option></select></label>' +
        '<button class="' + P + '-go" id="' + P + '-go">Generate Cover Letter</button>' + + '<div id="' + P + '-out" style="display:flex;flex-direction:column;gap:16px"></div></div>';
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
      var val = function (id) { return $(id).value.trim(); };
      var strip = function (s) { return s.replace(/[.\s]+$/, ''); };
      var list = function (a) { return a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]; };
      $('go').onclick = function () {
        var name = val('name'), role = val('role'), co = val('co');
        if (!name || !role || !co) return dlg('Details Needed', 'Please fill in your name, the job title and the company.');
        var mgr = val('mgr'), yrs = parseInt(val('yrs'), 10), tone = $('tone').value;
        var skills = val('skills').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
        var win = strip(val('win')), why = strip(val('why'));
        var sk = skills.length ? 'strong skills in ' + list(skills) : 'a strong work ethic and a commitment to quality';
        var ex = yrs > 0 ? 'With ' + yrs + (yrs === 1 ? ' year' : ' years') + ' of experience, I bring ' + sk + ' to the role.' : 'I bring ' + sk + ' to the role.';
        var p1 = tone === 'enthusiastic' ? 'I was excited to see the ' + role + ' opening at ' + co + ', and I am eager to apply. ' + ex
          : tone === 'concise' ? 'I am applying for the ' + role + ' position at ' + co + '. ' + ex
          : 'I am writing to express my interest in the ' + role + ' position at ' + co + '. ' + ex;
        var p2 = win ? 'A highlight of my work: ' + win + '.' : 'I take pride in delivering dependable results, learning quickly and working well with others.';
        var p3 = why ? 'I am drawn to ' + co + ' because ' + why + '.' : (tone === 'concise' ? '' : 'I admire the work ' + co + ' does and would value the chance to contribute to your team.');
        var p4 = tone === 'enthusiastic' ? 'Thank you for considering my application. I would love the chance to talk about how I can contribute.'
          : tone === 'concise' ? 'Thank you for your consideration. I look forward to hearing from you.'
          : 'Thank you for your time and consideration. I would welcome the opportunity to discuss how my background can support your team.';
        var letter = ['Dear ' + (mgr || 'Hiring Manager') + ',', p1, p2, p3, p4, 'Sincerely,\n' + name].filter(Boolean).join('\n\n');
        var box = $('out');
        box.innerHTML = '<div class="' + P + '-res"><textarea class="' + P + '-tall" id="' + P + '-letter">' + esc(letter) + '</textarea></div>';
        actions(box.firstChild, function () { return $('letter').value; });
        box.scrollIntoView({ behavior: 'smooth' });
      };
    } catch (err) { console.warn('Cover Letter plugin disabled:', err); }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
