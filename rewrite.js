/**
 * Sentence-level rewrite engine (offline, no network).
 * Produces four distinct alternatives: Standard, Fluent, Formal, Concise.
 */
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const low = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const matchCase = (from, to) => (from[0] !== from[0].toLowerCase() ? cap(to) : to);
const apply = (s, rules) => rules.reduce((t, [re, to]) => t.replace(re, (m) => (typeof to === 'function' ? to(m) : matchCase(m, to))), s);
const tidy = (s) => cap(s.replace(/\s{2,}/g, ' ').replace(/\s+([,.;!?])/g, '$1').replace(/,\s*,/g, ',').trim());
const sentences = (t) => t.replace(/\s+/g, ' ').trim().split(/(?<=[.!?])\s+/).filter(Boolean);

const STANDARD = [[/\bimportant\b/gi, 'key'], [/\bbig\b/gi, 'large'], [/\beasy\b/gi, 'straightforward'], [/\bstart(s|ed)?\b/gi, (m) => matchCase(m, 'begin' + (m.toLowerCase().endsWith('s') ? 's' : m.toLowerCase().endsWith('ed') ? 'ning' : ''))], [/\bshows\b/gi, 'demonstrates'], [/\bhelps\b/gi, 'supports'], [/\bgood\b/gi, 'strong'], [/\bbad\b/gi, 'poor'], [/\bmany\b/gi, 'plenty of'], [/\bfast\b/gi, 'quick']];
const FLUENT_WORDS = [[/\bhowever,/gi, 'that said,'], [/\btherefore,?/gi, 'as a result,'], [/\bmoreover,/gi, 'what is more,'], [/\bfurthermore,/gi, 'in addition,'], [/\balso,/gi, 'in addition,'], [/\ba lot of\b/gi, 'plenty of'], [/\bvery important\b/gi, 'vital'], [/\bmake sure\b/gi, 'ensure'], [/\bfind out\b/gi, 'discover'], [/\blook at\b/gi, 'examine']];
const FORMAL = [[/\bcan't\b/gi, 'cannot'], [/\bwon't\b/gi, 'will not'], [/\bdon't\b/gi, 'do not'], [/\bdoesn't\b/gi, 'does not'], [/\bdidn't\b/gi, 'did not'], [/\bisn't\b/gi, 'is not'], [/\baren't\b/gi, 'are not'], [/\bwasn't\b/gi, 'was not'], [/\bcouldn't\b/gi, 'could not'], [/\bshouldn't\b/gi, 'should not'], [/\bwouldn't\b/gi, 'would not'], [/\bit's\b/gi, 'it is'], [/\bthat's\b/gi, 'that is'], [/\bthere's\b/gi, 'there is'], [/\bI'm\b/g, 'I am'], [/\b(we|they|you)'re\b/gi, (m) => m.replace("'re", ' are')], [/\b(I|we|they|you)'ve\b/gi, (m) => m.replace("'ve", ' have')], [/\blet's\b/gi, 'let us'], [/\bneed to\b/gi, 'must'], [/\bhelp(s)?\b/gi, (m) => matchCase(m, m.toLowerCase().endsWith('s') ? 'assists' : 'assist')], [/\bshows\b/gi, 'demonstrates'], [/\bshow\b/gi, 'demonstrate'], [/\buses\b/gi, 'utilizes'], [/\buse\b/gi, 'utilize'], [/\bbuy\b/gi, 'purchase'], [/\bget\b/gi, 'obtain'], [/\bthink\b/gi, 'believe'], [/\bkids\b/gi, 'children'], [/\benough\b/gi, 'sufficient'], [/\bbig\b/gi, 'substantial'], [/\bvery (\w+)/gi, (m) => 'highly ' + m.slice(5)], [/, but /gi, '; however, '], [/\bstart\b/gi, 'commence']];
const CONCISE = [[/\b(in order to)\b/gi, 'to'], [/\bdue to the fact that\b/gi, 'because'], [/\bat this point in time\b/gi, 'now'], [/\ba large number of\b/gi, 'many'], [/\bin the event that\b/gi, 'if'], [/\b(has|have) the ability to\b/gi, 'can'], [/\b(is|are) able to\b/gi, 'can'], [/\bit is important to note that\s*/gi, ''], [/\bin spite of the fact that\b/gi, 'although'], [/\bfor the purpose of\b/gi, 'to'], [/\beach and every\b/gi, 'every'], [/\bwhether or not\b/gi, 'whether'], [/\b(I think that|in my opinion,?|I believe that)\s*/gi, ''], [/\b(really|very|quite|basically|actually|just|simply|literally|honestly)\s+/gi, '']];

function standard(s) {
  const t = apply(s, STANDARD);
  const m = t.match(/^(.{45,}?), and (.+)$/);
  return m ? tidy(m[1] + '. ' + cap(m[2])) : tidy(t);
}
function fluent(s) {
  let t = s;
  const end = (t.match(/[.!?]$/) || [''])[0];
  const body = t.replace(/[.!?]$/, '');
  let m;
  if ((m = body.match(/^(Although|While|Because|Since|If|When|After|Before) ([^,]{4,}), (.+)$/i))) t = cap(m[3]) + ' ' + low(m[1]) + ' ' + m[2] + end;
  else if ((m = body.match(/^(.{8,}?), but (.+)$/i))) t = 'Although ' + low(m[1]) + ', ' + m[2] + end;
  else if ((m = body.match(/^(.{8,}?) because (.+)$/i))) t = 'Because ' + m[2] + ', ' + low(m[1]) + end;
  return tidy(apply(t, FLUENT_WORDS));
}
const formal = (s) => tidy(apply(s, FORMAL));
const concise = (s) => tidy(apply(s, CONCISE));

export function buildAlternatives(text) {
  const parts = sentences(text);
  const run = (fn) => parts.map(fn).join(' ');
  const out = [
    { label: 'Standard', text: run(standard) },
    { label: 'Fluent', text: run(fluent) },
    { label: 'Formal', text: run(formal) },
    { label: 'Concise', text: run(concise) }
  ];
  // Guarantee distinct results: if a style produced nothing new, layer another style on top.
  const seen = new Set([text.trim().toLowerCase()]);
  const extra = [formal, standard, fluent, concise];
  out.forEach((o, i) => {
    let k = 0;
    while (seen.has(o.text.toLowerCase()) && k < 4) {
      o.text = sentences(o.text).map(extra[(i + k + 1) % 4]).join(' ');
      k++;
    }
    seen.add(o.text.toLowerCase());
  });
  return out;
}
