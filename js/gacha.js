/* ===================== VÒNG QUAY SỬ THI (bản 4) =====================
   Mỗi ngày 1 lượt, chỉ mở khi xong HẾT mục trong ngày (kể cả mục phụ) và đã chốt ngày.
   Không cộng dồn lượt cho ngày bỏ lỡ; hôm qua đủ điều kiện mà chưa quay thì quay bù được (như chốt bù).
   Ô Sử thi luôn là con "nổi bật": xoay vòng lần lượt qua các con chưa có, theo số lượt quay (không theo lịch).
   Bảo hiểm: quay (pity − 1) lượt liền chưa ra Sử thi thì lượt kế tiếp chắc chắn ra.
   File này nạp trước app.js; mọi hàm chỉ đọc state/derive… lúc được gọi. */
const GA = ECON.gacha;
const GSLOT = GA.slots.map(([k, w, m, c]) => ({ k, w, m, c }));
const GSLOT_BY = Object.fromEntries(GSLOT.map(x => [x.k, x]));
const G_TOTAL_W = GSLOT.reduce((a, x) => a + x.w, 0);
// Ô xếp theo độ hiếm giảm dần, chạy theo chiều kim đồng hồ từ góc trên trái
const G_RING = ['epic', 'item', 'shield', 'x2', 'meatL', 'coinL', 'meatS', 'coinS'];
const G_POS = [[1, 1], [1, 2], [1, 3], [2, 3], [3, 3], [3, 2], [3, 1], [2, 1]];
const G_RAR = { epic: 4, chest: 4, item: 3, itemDup: 3, shield: 2, shieldDup: 2, x2: 2, meatL: 1, coinL: 1, meatS: 0, coinS: 0 };
const G_BASE = { chest: 'epic', itemDup: 'item', shieldDup: 'shield' };
const gPct = k => Math.round(GSLOT_BY[k].w * 100 / G_TOTAL_W);
const GACHA_BLANK = () => ({ n: 0, pity: 0, rot: 0, days: {}, x2: {} });

function gachaSanitize(s) {
  const g = s.gacha && typeof s.gacha === 'object' && !Array.isArray(s.gacha) ? s.gacha : GACHA_BLANK();
  g.n = Math.max(0, Math.floor(+g.n || 0)); g.pity = Math.min(GA.pity - 1, Math.max(0, Math.floor(+g.pity || 0)));
  g.rot = Math.max(0, Math.floor(+g.rot || 0)) % EPICS.length;
  ['days', 'x2'].forEach(k => { if (!g[k] || typeof g[k] !== 'object' || Array.isArray(g[k])) g[k] = {}; });
  s.gacha = g;
}

/* ----- Sử thi chưa có: chỉ hiện bóng (bản 6) -----
   Con chưa sở hữu ở mọi chỗ chỉ là bóng đen viền sáng, tên "???", vẫn lộ hệ và nhãn Sử thi làm gợi ý.
   Hình màu và tên chỉ hiện ở màn ra Sử thi (epicReveal) và sau khi đã có. aura = thêm quầng cầu vồng quay chậm sau bóng. */
const EPIC_HIDDEN = 'Sử thi bí ẩn';
const epicSil = (id, aura) => `<span class="ep-sil${aura ? ' aura' : ''}">${petSVG(id, 1, { sil: true })}</span>`;

/* ----- Trạng thái ----- */
const epicOwnedN = () => EPICS.filter(p => state.pets[p.id]).length;
function featuredEpic() {
  const g = state.gacha, n = EPICS.length;
  for (let k = 0; k < n; k++) { const p = EPICS[(g.rot + k) % n]; if (!state.pets[p.id]) return p; }
  return null;
}
// Thứ tự các con sẽ nổi bật ở những lượt tới
function epicQueue() {
  const g = state.gacha, n = EPICS.length, out = [];
  for (let k = 0; k < n; k++) { const p = EPICS[(g.rot + k) % n]; if (!state.pets[p.id]) out.push(p); }
  return out;
}
const x2Of = ds => (state.gacha && state.gacha.x2[ds]) || 0;
const meatMult = ds => 1 + x2Of(ds);
// Chuỗi ngày quay liền nhau dài nhất
function spinRun() {
  const ds = Object.keys(state.gacha.days).sort(); let best = 0, cur = 0, prev = null;
  ds.forEach(d => { cur = prev && diff(prev, d) === 1 ? cur + 1 : 1; best = Math.max(best, cur); prev = d; });
  return best;
}
// Một ngày có quay được không, và vì sao chưa
function spinStatus(ds, D) {
  D = D || derive();
  const idx = diff(state.startDate, ds), rec = state.gacha.days[ds] || null;
  const inWin = idx >= 0 && (ds === D.T || ds === D.Y);
  const committed = isCommitted(ds);
  const left = idx >= 0 ? itemsFor(ds).filter(x => !itemDone(ds, x.k)) : [];
  return { ds, idx, rec, spun: !!rec, inWin, committed, left, ok: inWin && !rec && committed && !left.length };
}
// Lượt quay đang chờ: hôm qua (quay bù) trước, rồi hôm nay
function pendingSpins(D) {
  D = D || derive();
  return [D.Y, D.T].map(ds => spinStatus(ds, D)).filter(s => s.ok);
}
const hasSpin = D => pendingSpins(D).length > 0;

/* ----- Quay: kết quả ghi ngay vào dữ liệu rồi mới chạy hiệu ứng ----- */
function pickSlot() {
  let r = Math.random() * G_TOTAL_W;
  for (const x of GSLOT) { r -= x.w; if (r < 0) return x.k; }
  return GSLOT[GSLOT.length - 1].k;
}
function doSpin(ds) {
  const D = derive(), st = spinStatus(ds, D);
  if (!st.ok) return null;
  const g = state.gacha, feat = featuredEpic(), forced = g.pity >= GA.pity - 1;
  const key = forced ? 'epic' : pickSlot();
  const res = { k: key, t: Date.now(), f: feat ? feat.id : null, p: g.pity, m: 0, c: 0 };
  if (key === 'epic') {
    g.pity = 0;
    if (feat) { state.pets[feat.id] = { f: 1, m: 0, eq: {} }; delete state.seen[feat.id]; res.id = feat.id; res.m = ECON.epic.gift; }
    else { res.k = 'chest'; res.m = GA.chest[0]; res.c = GA.chest[1]; }
  } else {
    g.pity++;
    if (key === 'item') {
      const left = GITEMS.filter(x => !owned(x.id));
      if (left.length) { const it = left[Math.floor(Math.random() * left.length)]; state.own[it.id] = 1; res.id = it.id; }
      else { res.k = 'itemDup'; res.m = GA.itemDup[0]; res.c = GA.itemDup[1]; }
    } else if (key === 'shield') {
      if (D.shields >= GA.shieldCap) { res.k = 'shieldDup'; res.m = GA.shieldDup[0]; res.c = GA.shieldDup[1]; }
    } else if (key === 'x2') {
      let day = addDays(ds, 1); if (isCommitted(day)) day = addDays(D.T, 1);
      g.x2[day] = (g.x2[day] || 0) + 1; res.day = day;
    } else { res.m = GSLOT_BY[key].m; res.c = GSLOT_BY[key].c; }
  }
  if (feat) g.rot = (feat.i + 1) % EPICS.length;
  g.n++;
  state.food += res.m; state.coins += res.c;
  g.days[ds] = res;
  const nb = checkAch();
  persist(); store.now();
  return { res, nb, ds };
}

/* ----- Chữ cho từng phần thưởng ----- */
function gResText(r) {
  const PP = r.id ? PET_BY[r.id] : null, I = r.id ? SHOP_BY[r.id] : null;
  switch (r.k) {
    case 'epic': return { t: PP ? PP.name : 'Pet Sử thi', d: `Pet Sử thi mới · quà ra mắt ${rwHTML(r.m, 0)}` };
    case 'chest': return { t: 'Rương Sử thi', d: rwHTML(r.m, r.c) };
    case 'item': return { t: I ? I.n : 'Đồ độc quyền', d: `Đồ độc quyền vòng quay · ${I ? SLOT_NAME[I.slot] : ''}` };
    case 'itemDup': return { t: 'Kho báu', d: `Đã đủ đồ độc quyền, đổi thành ${rwHTML(r.m, r.c)}` };
    case 'shield': return { t: 'Khiên giữ chuỗi', d: '+1 khiên, lỡ một ngày chuỗi vẫn giữ' };
    case 'shieldDup': return { t: 'Khiên đầy', d: `Đã đủ ${GA.shieldCap} khiên, đổi thành ${rwHTML(r.m, r.c)}` };
    case 'x2': return { t: 'Thịt x2 ngày mai', d: `Ngày ${fmtDM(r.day)}: thịt từ từng mục và chốt ngày nhân đôi` };
    default: return { t: r.m ? `+${r.m} thịt` : `+${r.c} xu`, d: r.m ? 'Đã vào kho thịt, cho pet ăn thôi.' : 'Đã vào túi xu, ghé cửa hàng nhé.' };
  }
}
const gShort = r => ({ epic: () => PET_BY[r.id] ? PET_BY[r.id].name : 'Sử thi', chest: () => 'Rương Sử thi', item: () => SHOP_BY[r.id] ? SHOP_BY[r.id].n : 'Đồ độc quyền', itemDup: () => 'Kho báu',
  shield: () => 'Khiên giữ chuỗi', shieldDup: () => 'Khiên đầy', x2: () => 'Thịt x2 ngày mai' }[r.k] || (() => r.m ? `+${r.m} thịt` : `+${r.c} xu`))();

/* ----- Hình cho ô thưởng ----- */
function gSlotArt(k, feat) {
  if (k === 'epic') return feat ? epicSil(feat.id) : ic('chest');
  if (k === 'item') return GITEMS.some(x => !owned(x.id)) ? ic('gift') : ic('chest');
  if (k === 'shield') return ic('shield');
  if (k === 'x2') return `<span class="gx-x2">${ic('meat')}<b>x2</b></span>`;
  if (k === 'meatL') return ic('meat2');
  if (k === 'coinL') return ic('coins');
  if (k === 'meatS') return ic('meat');
  return ic('coin');
}
function gSlotLabel(k, feat) {
  const S = GSLOT_BY[k];
  if (k === 'epic') return feat ? 'Sử thi' : 'Rương Sử thi';
  if (k === 'item') return GITEMS.some(x => !owned(x.id)) ? 'Đồ độc quyền' : 'Kho báu';
  if (k === 'shield') return 'Khiên';
  if (k === 'x2') return 'Mai x2 thịt';
  return S.m ? `+${S.m} thịt` : `+${S.c} xu`;
}
function gResArt(r) {
  if (r.k === 'epic' && r.id) return petSVG(r.id, 1);
  if (r.k === 'item' && r.id) return shopIcon(r.id);
  if (r.k === 'chest' || r.k === 'itemDup') return ic('chest');
  if (r.k === 'shieldDup') return ic('shield');
  return gSlotArt(r.k, null);
}

/* ----- Màn vòng quay (trong tab Pet) ----- */
function energyHTML() {
  const g = state.gacha, n = GA.pity, x = g.pity, left = n - x;
  const all = !featuredEpic();
  return `<div class="gx-energy"><div class="gx-en-top"><span>${ic('gem', 'i-in')} Năng lượng sử thi</span><b>${x}/${n}</b></div>
    <div class="gx-cells">${Array.from({ length: n }, (_, i) => `<i class="${i < x ? 'on' : ''} ${i === n - 1 ? 'last' : ''}"></i>`).join('')}</div>
    <div class="gx-en-note">${left <= 1 ? `Lượt tới chắc chắn ra ${all ? 'Rương Sử thi' : 'Sử thi'}!` : `Tối đa ${left} lượt nữa là chắc chắn ra ${all ? 'Rương Sử thi' : 'Sử thi'}`}</div></div>`;
}
function bulbsHTML() {
  // Đèn chạy quanh khung
  const pts = []; const N = 7;
  for (let i = 0; i < N; i++) pts.push([i / (N - 1) * 100, 0]);
  for (let i = 1; i < N - 1; i++) pts.push([100, i / (N - 1) * 100]);
  for (let i = N - 1; i >= 0; i--) pts.push([i / (N - 1) * 100, 100]);
  for (let i = N - 2; i > 0; i--) pts.push([0, i / (N - 1) * 100]);
  return pts.map(([x, y], i) => `<i class="bulb" style="left:${f1(x)}%;top:${f1(y)}%;animation-delay:-${f1(i * .12)}s"></i>`).join('');
}
function viewGacha(D) {
  const feat = featuredEpic(), own = epicOwnedN(), pend = pendingSpins(D), g = state.gacha;
  const sT = spinStatus(D.T, D), sY = spinStatus(D.Y, D);
  const cur = pend[0] || null;
  let h = '';
  // Con nổi bật
  if (feat) {
    const E = ELEMENTS[feat.el];
    h += `<div class="card gx-head" style="--e1:${E.bg[0]};--e2:${E.bg[1]}"><div class="gx-feat"><div class="gx-feat-rays"></div>${epicSil(feat.id, 1)}</div>
      <div class="gx-feat-t"><div class="sub">Hôm nay nổi bật</div><div class="gx-feat-n tout"><span aria-hidden="true">???</span><span class="sr">${EPIC_HIDDEN}</span></div>
      <div class="gx-tags"><span class="tag-el" style="background:${E.c}">${E.n}</span>${rarTag(4)}</div>
      <div class="gx-rate">Tỷ lệ <b>${gPct('epic')}%</b> mỗi lượt · lượt thứ ${GA.pity} chắc chắn ra</div></div></div>`;
  } else {
    h += `<div class="card gx-head all"><div class="gx-feat">${ic('chest')}</div><div class="gx-feat-t"><div class="sub">Đã đủ 7 Sử thi</div><div class="gx-feat-n tout">Rương Sử thi</div>
      <div class="gx-rate">Ô Sử thi giờ là rương ${rwHTML(GA.chest[0], GA.chest[1])} · tỷ lệ <b>${gPct('epic')}%</b>, lượt thứ ${GA.pity} chắc chắn ra</div></div></div>`;
  }
  h += energyHTML();
  // Bảng quay 3×3
  let btn;
  if (cur) btn = `<button class="gx-spin" data-act="spin" data-date="${cur.ds}"><span class="gx-spin-i">${ic('wheel')}</span><b class="tout-s">QUAY</b><small>${cur.ds === D.Y ? 'lượt bù hôm qua' : 'lượt hôm nay'}</small></button>`;
  else btn = `<button class="gx-spin off" disabled><span class="gx-spin-i">${ic(sT.spun ? 'check' : 'lock')}</span><b>${sT.spun ? 'Đã quay' : 'Chưa mở'}</b><small>${sT.spun ? 'mai quay tiếp' : 'xem lý do bên dưới'}</small></button>`;
  h += `<div class="gx-board" id="gx-board">${bulbsHTML()}<div class="gx-grid">`;
  G_RING.forEach((k, i) => {
    const [r, c] = G_POS[i], rar = k === 'epic' ? 4 : G_RAR[k];
    h += `<div class="gx-cell r${rar}" data-ring="${i}" style="grid-row:${r};grid-column:${c}"><div class="gx-art">${gSlotArt(k, feat)}</div><div class="gx-lb">${esc(gSlotLabel(k, feat))}</div><div class="gx-pc">${gPct(k)}%</div></div>`;
  });
  h += `<div class="gx-center">${btn}</div></div></div>`;
  // Trạng thái lượt quay
  const line = (s, name) => {
    if (s.idx < 0) return '';
    if (s.spun) return `<div class="gx-st done">${ic('check', 'i-in')} <span><b>${name}:</b> đã quay, ra ${esc(gShort(s.rec))}</span></div>`;
    if (s.ok) return `<div class="gx-st ok">${ic('wheel', 'i-in')} <span><b>${name}:</b> sẵn sàng quay${s.ds === D.Y ? ' bù' : ''}</span></div>`;
    if (s.ds === D.Y && !s.committed) return `<div class="gx-st">${ic('lock', 'i-in')} <span><b>${name}:</b> chưa chốt ngày. Chốt bù hôm qua (xong hết mục) thì quay bù được</span><button class="btn sm" data-act="back-on">Chốt bù</button></div>`;
    const why = [];
    if (s.left.length) why.push(`còn ${s.left.length} mục chưa xong: ${s.left.map(x => esc(x.t)).join(', ')}`);
    if (!s.committed) why.push('chưa chốt ngày');
    return `<div class="gx-st lock">${ic('lock', 'i-in')} <span><b>${name}:</b> ${why.join(' · ')}</span>${s.ds === D.T || s.committed ? `<button class="btn sm" data-act="gx-goday" data-date="${s.ds}">Mở ${name.toLowerCase()}</button>` : ''}</div>`;
  };
  h += `<div class="card gx-status"><h3 class="h3">Lượt quay</h3>${line(sY, 'Hôm qua')}${line(sT, 'Hôm nay')}
    <p class="note">Mỗi ngày 1 lượt khi xong <b>hết</b> mục trong ngày (kể cả mục phụ) và đã chốt ngày. Quên quay thì quay bù hôm qua được. Ngày bỏ lỡ không cộng dồn lượt.</p></div>`;
  // Bộ sưu tập Sử thi + thứ tự nổi bật
  const q = epicQueue();
  h += `<div class="card gx-set"><div class="gx-set-h"><h3 class="h3" style="margin:0">Bộ Sử thi</h3><b>${own}/${EPICS.length}</b></div><div class="gx-set-row">`;
  EPICS.forEach(p => {
    const st = state.pets[p.id], qi = q.indexOf(p);
    h += `<button class="gx-mini ${st ? 'own' : ''} ${qi === 0 ? 'now' : ''}" data-act="pet" data-id="${p.id}" aria-label="${st ? esc(p.name) : 'Pet Sử thi chưa có'}">${st ? petSVG(p.id, st.f) : epicSil(p.id)}${!st ? `<span class="gx-q">${qi === 0 ? 'Nay' : qi + 1}</span>` : ''}</button>`;
  });
  h += `</div><p class="note">${q.length ? `Con nổi bật đổi sau mỗi lượt quay, lần lượt qua các con chưa có (số trên hình là thứ tự). Quay hụt ${GA.pity - 1} lượt liền thì lượt sau chắc chắn ra, nên tối đa ${GA.pity * EPICS.length} lượt là đủ bộ.` : 'Đã đủ bộ. Từ giờ ô Sử thi ra Rương Sử thi.'}</p></div>`;
  // Lịch sử
  const hist = Object.keys(g.days).sort().reverse().slice(0, 6);
  if (hist.length) h += `<div class="card gx-hist"><h3 class="h3">Lượt gần đây</h3>${hist.map(ds => { const r = g.days[ds], rr = G_RAR[r.k] ?? 0; return `<div class="gx-hr"><span class="d">${fmtDM(ds)}</span><span class="gx-dot r${rr}"></span><span class="t">${esc(gShort(r))}</span><span class="sub">${RARITY[rr].n}</span></div>`; }).join('')}<p class="note">Đã quay ${g.n} lượt.</p></div>`;
  return h;
}

/* ----- Thẻ vòng quay trên màn Hôm nay ----- */
function gachaTodayHTML(D, ds) {
  const s = spinStatus(ds, D), feat = featuredEpic();
  if (s.idx < 0) return '';
  if (s.spun) return `<div class="card gx-today done"><div class="gx-ti">${gResArt(s.rec)}</div><div><div class="h3" style="margin:0">Đã quay${ds === D.Y ? ' bù' : ''}: ${esc(gShort(s.rec))}</div><div class="sub">Mai xong hết mục và chốt ngày là có lượt mới.</div></div></div>`;
  if (s.ok) return `<div class="card gx-today ready"><div class="gx-ti">${feat ? epicSil(feat.id, 1) : ic('chest')}</div><div style="flex:1"><div class="h3" style="margin:0">Mở lượt quay rồi!</div><div class="sub">${feat ? `Nổi bật: <b>${EPIC_HIDDEN}</b> hệ ${ELEMENTS[feat.el].n} · ${gPct('epic')}%` : 'Ô Sử thi: Rương Sử thi'}</div>
    <button class="btn block gx-go" data-act="gx-open" style="margin-top:8px">${ic('wheel', 'i-btn')} QUAY THƯỞNG</button></div></div>`;
  if (!s.committed) return `<div class="gx-hint">${ic('wheel', 'i-in')} Xong hết mục (kể cả mục phụ) và chốt ngày để mở 1 lượt quay Sử thi.</div>`;
  return `<div class="card gx-today lock"><div class="gx-ti">${ic('lock')}</div><div><div class="h3" style="margin:0">Còn ${s.left.length} mục để mở lượt quay</div><div class="sub">${s.left.map(x => esc(x.t)).join(', ')}. Tích nốt ở trên là quay được.</div></div></div>`;
}

/* ----- Hiệu ứng quay: đèn chạy vòng, chậm dần, dừng ở ô trúng ----- */
let gxBusy = false;
function runSpin(ds) {
  if (gxBusy) return;
  const out = doSpin(ds);
  if (!out) { render(); toast('Chưa quay được lượt này'); return; }
  gxBusy = true;
  const board = $('#gx-board');
  const target = G_RING.indexOf(G_BASE[out.res.k] || out.res.k);
  const btn = board && board.querySelector('.gx-spin');
  if (btn) { btn.disabled = true; btn.classList.add('busy'); btn.innerHTML = `<span class="gx-spin-i spinning">${ic('wheel')}</span><b class="tout-s">…</b>`; }
  const cells = board ? [...board.querySelectorAll('.gx-cell')].sort((a, b) => a.dataset.ring - b.dataset.ring) : [];
  if (!cells.length || reduced()) { setTimeout(() => finishSpin(out), reduced() ? 80 : 10); return; }
  board.classList.add('running');
  const steps = 8 * 3 + ((target + 8) % 8) + 1; // 3 vòng rồi dừng đúng ô
  let i = 0;
  const tick = () => {
    cells.forEach(c => c.classList.remove('lit'));
    const c = cells[i % 8]; c.classList.add('lit');
    buzz(4);
    i++;
    if (i >= steps) {
      board.classList.remove('running');
      c.classList.add('win');
      setTimeout(() => finishSpin(out), 900);
      return;
    }
    const t = i / steps, delay = 45 + Math.pow(t, 3.2) * 420 + (steps - i <= 2 ? 160 : 0);
    setTimeout(tick, delay);
  };
  tick();
}
function finishSpin(out) {
  gxBusy = false;
  const r = out.res;
  render();
  if (r.k === 'epic' || r.k === 'chest') epicReveal(out);
  else gResultPop(out);
}
// Phần thưởng thường: thẻ màu theo độ hiếm
function gResultPop(out) {
  const r = out.res, rar = G_RAR[r.k] ?? 0, T = gResText(r);
  const c = document.createElement('div'); c.className = `gres r${rar}`; c.id = 'gres';
  const pid = curPetId(), it = r.k === 'item' && r.id ? SHOP_BY[r.id] : null;
  c.innerHTML = `<div class="rays"></div><div class="gres-card popin"><div class="gres-rar">${RARITY[rar].n}</div><div class="gres-art">${gResArt(r)}</div>
    <h2 class="tout">${esc(T.t)}</h2><p>${T.d}</p>
    ${it && pid ? `<button class="btn green block" data-act="gx-wear" data-id="${it.id}" data-pet="${pid}">Mặc cho ${esc(PET_BY[pid].name)}</button>` : ''}
    <button class="btn block" data-act="gx-close" style="margin-top:8px">Nhận</button></div>`;
  document.body.appendChild(c); flushCel();
  c.querySelector('[data-act=gx-close]').focus({ preventScroll: true });
  buzz(rar >= 2 ? [20, 40, 60] : 15); if (rar >= 2) fx.burst(rar >= 3 ? 120 : 60);
  announceAch(out.nb);
}
// Ra Sử thi: cột sáng cầu vồng, rung màn hình, pháo giấy, pet dạng 1 + tên chữ vàng.
// Bản 6: trong lúc cột sáng mọc, giữa màn là bóng đen của con vừa trúng; lóe sáng xong mới hiện hình màu và tên.
function epicReveal(out) {
  const r = out.res, EP = r.id ? PET_BY[r.id] : null, E = EP ? ELEMENTS[EP.el] : null;
  const c = document.createElement('div'); c.className = 'epic-rev'; c.id = 'epic-rev';
  if (E) { c.style.setProperty('--e1', E.bg[0]); c.style.setProperty('--e2', E.bg[1]); }
  c.innerHTML = `<div class="er-rays"></div><div class="er-pillar"></div><div class="er-flash"></div>
    <div class="er-top"><div class="er-rar">SỬ THI</div></div>
    <div class="er-pet${EP ? ' er-two' : ''}" id="er-pet">${EP ? `<div class="er-sil">${epicSil(EP.id, 1)}</div><div class="er-col">${petSVG(EP.id, 1)}</div>` : `<svg class="ic" viewBox="0 0 64 64">${ICONS.chest()}</svg>`}</div>
    <div class="er-name tout">${EP ? esc(EP.name) : 'Rương Sử thi'}</div>
    <div class="er-sub">${EP ? `<span class="tag-el" style="background:${E.c}">${E.n}</span> ${rarTag(4)}` : ''}</div>
    <div class="er-gift">${EP ? `${esc(EP.intro)}<br>Quà ra mắt ${rwHTML(r.m, 0)}` : rwHTML(r.m, r.c)}</div>
    <div class="er-btns">${EP ? `<button class="btn" data-act="gx-see" data-id="${EP.id}">Xem ${esc(EP.name)}</button>` : ''}<button class="btn ghost" data-act="gx-close">${EP ? 'Để sau' : 'Nhận'}</button></div>`;
  document.body.appendChild(c); flushCel();
  const R = reduced();
  if (!R) { document.body.classList.add('shake'); setTimeout(() => document.body.classList.remove('shake'), 900); }
  buzz([60, 40, 120, 40, 200]);
  setTimeout(() => { c.classList.add('shown'); fx.burst(200); }, R ? 20 : 1100);
  if (!R) setTimeout(() => fx.burst(140), 1700);
  setTimeout(() => { const b = c.querySelector('.er-btns .btn'); if (b) b.focus({ preventScroll: true }); announceAch(out.nb); }, R ? 40 : 1500);
}
function closeGacha() { ['#gres', '#epic-rev'].forEach(q => { const e = $(q); if (e) e.remove(); }); }

/* ----- Icon riêng của vòng quay ----- */
Object.assign(ICONS, {
  wheel: () => ci(32, 32, 27, '#4130c4', 3.5) + [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a0 = (i * 45 - 90) * Math.PI / 180, a1 = ((i + 1) * 45 - 90) * Math.PI / 180; return `<path d="M32,32 L${P(32 + 25 * Math.cos(a0), 32 + 25 * Math.sin(a0))} A25,25 0 0 1 ${P(32 + 25 * Math.cos(a1), 32 + 25 * Math.sin(a1))} Z" fill="${['#ff3b4f', '#ffd21f', '#3fe06a', '#33e1ff', '#b46bff', '#ff8a1f', '#ff5fa2', '#7be35a'][i]}" stroke="${OL}" stroke-width="2"/>`; }).join('') +
    ci(32, 32, 27, 'none', 3.5) + ci(32, 32, 7, 'url(#gGold)', 3) + pa('M32,1 L38,10 L26,10 Z', '#fff', 2.8),
  gem: () => pa('M18,10 H46 L58,26 L32,58 L6,26 Z', cel('#ff5fa2', '#b8206e'), 3.5) + pa('M6,26 H58 M18,10 L24,26 L32,58 L40,26 L46,10 M24,26 L32,10 L40,26', 'none', 2.4) + pa('M18,10 L24,26 L6,26 Z', '#ffd0ea', 0, 'opacity=".7"') + pa('M32,10 L40,26 H24 Z', '#fff6b0', 0, 'opacity=".55"'),
  chest: () => pa('M8,30 H56 V54 Q56,58 52,58 H12 Q8,58 8,54 Z', cel('#c9772f', '#8a4a1f'), 3.5) + pa('M8,30 Q8,10 32,10 Q56,10 56,30 Z', cel('#e08a3a', '#a85a22'), 3.5) +
    pa('M8,28 H56 V34 H8 Z', 'url(#gGold)', 3) + pa('M27,10 H37 V58 H27 Z', 'url(#gGold)', 3) + `<rect x="26" y="30" width="12" height="12" rx="2" fill="#ff3b4f" stroke="${OL}" stroke-width="2.6"/>` + spark4(50, 12, 7, '#fff6b0', 2) + spark4(14, 18, 5, '#ffffff', 1.8),
  gift: () => `<rect x="10" y="28" width="44" height="30" rx="4" fill="${cel('#b46bff', '#6a2fd0')}" stroke="${OL}" stroke-width="3.5"/><rect x="6" y="18" width="52" height="13" rx="4" fill="${cel('#c98aff', '#8a4ae0')}" stroke="${OL}" stroke-width="3.5"/>` +
    pa('M27,18 H37 V58 H27 Z', 'url(#gGold)', 3) + pa('M32,18 Q20,4 14,10 Q10,16 32,18 Z M32,18 Q44,4 50,10 Q54,16 32,18 Z', '#ffd21f', 3),
  coins: () => [[20, 44], [44, 44], [32, 26]].map(([x, y]) => ci(x, y, 15, cel('#ffd21f', '#d99500'), 3.2) + ci(x, y, 9, 'none', 2, 'stroke-dasharray="3 3"') + pa(starPath(x, y + .5, 5.5, 2.4), '#fff6b0', 1.6)).join(''),
  meat2: () => `<g transform="translate(-6 8) scale(.78)">${ICONS.meat()}</g><g transform="translate(18 -2) scale(.78)">${ICONS.meat()}</g>`
});
