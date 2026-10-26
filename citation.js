async function fetchMeta(q){q=q.trim();
if(/^10\.\d{4,}\//.test(q)||q.includes('doi.org/')){const d=q.replace(/^.*doi\.org\//,'');const r=await fetch('https://api.crossref.org/works/'+encodeURIComponent(d));if(!r.ok)throw new Error('DOI not found.');const m=(await r.json()).message;
return{authors:(m.author||[]).map(a=>({f:a.family||'',g:a.given||''})),year:(m.issued['date-parts'][0]||[])[0]||'n.d.',title:(m.title||[''])[0],container:(m['container-title']||[''])[0],vol:m.volume,iss:m.issue,pages:m.page,pub:m.publisher,url:m.DOI?'https://doi.org/'+m.DOI:''}}
const i=q.replace(/[^0-9Xx]/g,'');const r=await fetch('https://openlibrary.org/api/books?bibkeys=ISBN:'+i+'&format=json&jscmd=data');const j=(await r.json())['ISBN:'+i];if(!j)throw new Error('No book found for that ISBN.');
return{authors:(j.authors||[]).map(a=>{const p=a.name.split(' ');return{f:p.pop(),g:p.join(' ')}}),year:(j.publish_date||'').match(/\d{4}/)?.[0]||'n.d.',title:j.title,pub:(j.publishers||[{}])[0].name,url:j.url}}
const ini=g=>g.split(/\s+/).filter(Boolean).map(x=>x[0]+'.').join(' ');
function apa(m){const a=m.authors.map(x=>x.f+', '+ini(x.g)).join(', ')||m.title;const t=m.container?m.title+'. '+m.container+(m.vol?', '+m.vol:'')+(m.iss?'('+m.iss+')':'')+(m.pages?', '+m.pages:''):m.title+'. '+(m.pub||'');return a+' ('+m.year+'). '+t+'. '+(m.url||'')}
function mla(m){const x=m.authors[0];const a=x?x.f+', '+x.g+(m.authors.length>1?', et al':''):'';return (a?a+'. ':'')+'"'+m.title+'." '+(m.container||m.pub||'')+', '+m.year+'. '+(m.url||'')}
