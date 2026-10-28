/* DV Plugin: Home Headline. Self-contained. Delete this file and its script tag and the original headline returns.
   Shows one of 7 hand-written headlines per browser session. A shuffled set guarantees all seven are seen before any repeats,
   and the same headline never appears twice in a row. */
(function () {
  'use strict';
  try {
    var h = document.querySelector('.hero-banner h2');
    if (!h) return;
    var LINES = [
      'Your next draft starts here',
      'Give your ideas a voice',
      'Write it clear. Make it count.',
      'Turn rough thoughts into polished words',
      'Where good writing gets better',
      'Say it simply. Say it well.',
      'Every great paper begins with one line'
    ];
    var SKEY = 'dvp-hl-session', BKEY = 'dvp-hl-bag', LKEY = 'dvp-hl-last';
    var shown = null;
    try { shown = sessionStorage.getItem(SKEY); } catch (e) {}
    if (shown === null || !LINES[+shown]) {
      var bag = [], last = -1;
      try { bag = JSON.parse(localStorage.getItem(BKEY) || '[]') || []; last = +(localStorage.getItem(LKEY) || -1); } catch (e) {}
      bag = bag.filter(function (i) { return LINES[i] !== undefined; });
      if (!bag.length) {
        bag = LINES.map(function (_, i) { return i; });
        for (var i = bag.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = bag[i]; bag[i] = bag[j]; bag[j] = t; }
        if (bag[bag.length - 1] === last) bag.unshift(bag.pop());
      }
      shown = bag.pop();
      try { localStorage.setItem(BKEY, JSON.stringify(bag)); localStorage.setItem(LKEY, String(shown)); sessionStorage.setItem(SKEY, String(shown)); } catch (e) {}
    }
    h.textContent = LINES[+shown];
  } catch (err) { console.warn('Headline plugin disabled:', err); }
})();
