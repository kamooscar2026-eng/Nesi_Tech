const CACHE_NAME = "nesi-tech-v3-final";
const FILES_TO_CACHE = ["./","./index.html","./logo.png","./manifest.json"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES_TO_CACHE)));
  self.skipWaiting();
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>{if(k!==CACHE_NAME) return caches.delete(k)}))));
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match("./index.html"))));
});
