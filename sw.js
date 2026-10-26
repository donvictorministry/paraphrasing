const C='dvwa-v1',F=['./','index.html','styles.css','app.js','language-tool.js','citation.js','paraphrase.js','summarize.js','manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>{if(new URL(e.request.url).origin!==location.origin)return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
