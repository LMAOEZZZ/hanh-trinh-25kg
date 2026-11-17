/* Service worker của Hành Trình -25kg.
   Mỗi lần sửa bất kỳ file nào của app: tăng VERSION (v1 → v2 …) để máy người dùng nhận bản mới.
   Service worker chỉ giữ file của app trong bộ nhớ đệm, KHÔNG đụng tới dữ liệu (localStorage, IndexedDB). */
const VERSION = 'v5';
const PREFIX = 'hanh-trinh-25kg-';
const CACHE = PREFIX + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/fonts.css',
  './css/app.css',
  './js/data.js',
  './js/econ.js',
  './js/gfx.js',
  './js/pets.js',
  './js/wear.js',
  './js/scenes.js',
  './js/icons.js',
  './js/exart.js',
  './js/camp.js',
  './js/gacha.js',
  './js/app.js',
  './js/pwa.js',
  './fonts/baloo-2-latin-600-normal.woff2',
  './fonts/baloo-2-latin-700-normal.woff2',
  './fonts/baloo-2-latin-800-normal.woff2',
  './fonts/baloo-2-vietnamese-600-normal.woff2',
  './fonts/baloo-2-vietnamese-700-normal.woff2',
  './fonts/baloo-2-vietnamese-800-normal.woff2',
  './icons/favicon.svg',
  './icons/favicon-32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' để lấy file mới từ máy chủ, bỏ qua bộ nhớ đệm HTTP (GitHub Pages để 10 phút)
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith(PREFIX) && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // Mở app (kể cả có #tab hay ?query): luôn trả về vỏ app trong bộ nhớ đệm, chạy được khi mất mạng
  if (req.mode === 'navigate') {
    const scope = new URL(self.registration.scope).pathname;
    const isApp = url.pathname === scope || url.pathname === scope + 'index.html';
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const shell = async () => (await c.match('./index.html')) || (await c.match('./'));
      if (isApp) return (await shell()) || fetch(req);
      try { return await fetch(req); } catch (err) { return (await shell()) || Response.error(); }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    return fetch(req);
  })());
});
