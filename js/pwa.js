/* ===================== PWA: service worker, thông báo bản mới, cài app ===================== */
(function () {
  // Android/Chrome: giữ lời mời cài app để hiện nút "Cài app" trong Cài đặt
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); window.__bip = e; });
  window.addEventListener('appinstalled', () => { window.__bip = null; });

  if (!('serviceWorker' in navigator)) return;
  let reg = null, asked = false, reloading = false;

  function showUpdate(w) {
    if (!w || document.getElementById('updbar')) return;
    const b = document.createElement('button');
    b.id = 'updbar'; b.className = 'updbar'; b.type = 'button';
    b.innerHTML = (typeof ic === 'function' ? ic('sparkle') + ' ' : '') + 'Có bản mới, chạm để cập nhật';
    b.addEventListener('click', () => {
      asked = true; b.disabled = true; b.textContent = 'Đang cập nhật…';
      try { store.now(); } catch (e) { }
      w.postMessage({ type: 'SKIP_WAITING' });
      setTimeout(() => { if (!reloading) location.reload(); }, 4000);
    });
    document.body.appendChild(b);
  }
  function watch(r) {
    if (r.waiting && navigator.serviceWorker.controller) showUpdate(r.waiting);
    r.addEventListener('updatefound', () => {
      const w = r.installing; if (!w) return;
      w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w); });
    });
  }
  // Chỉ tải lại khi chính người dùng bấm cập nhật (lần cài đầu không tải lại)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!asked || reloading) return;
    reloading = true; location.reload();
  });

  window.pwaCheckUpdate = async manual => {
    if (!reg) { if (manual) toast('Bản offline chưa sẵn sàng, mở lại app sau ít phút'); return; }
    try {
      await reg.update();
      if (!manual) return;
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      else if (reg.installing) toast('Đang tải bản mới…');
      else toast('Đang dùng bản mới nhất');
    } catch (e) { if (manual) toast('Không kiểm tra được, có thể đang mất mạng'); }
  };

  function start() {
    navigator.serviceWorker.register('./sw.js', { scope: './' })
      .then(r => { reg = r; watch(r); })
      .catch(e => console.warn('Không đăng ký được service worker:', e && e.message));
  }
  if (document.readyState === 'complete') start(); else window.addEventListener('load', start);

  // App mở lâu trên màn hình chính ít khi tải lại trang: hỏi bản mới mỗi lần quay lại app và mỗi giờ
  document.addEventListener('visibilitychange', () => { if (!document.hidden && reg) reg.update().catch(() => { }); });
  setInterval(() => { if (reg && !document.hidden) reg.update().catch(() => { }); }, 36e5);
})();
