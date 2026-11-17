/* ===================== TIỆN ÍCH NGÀY & CHUỖI ===================== */
const pad = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parseD(s); d.setDate(d.getDate() + n); return ymd(d); };
const diff = (a, b) => Math.round((parseD(b) - parseD(a)) / 864e5);
const todayStr = () => ymd(new Date());
const fmtDM = s => { const d = parseD(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
const fmtFull = s => { const d = parseD(s); return `${WD_FULL[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`; };
const fkg = v => (Math.round(v * 10) / 10).toFixed(1).replace('.', ',');
const fnum = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (q, r = document) => r.querySelector(q);
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const CHECK = `<svg viewBox="0 0 24 24"><path d="M4,12.5 L10,18 L20,6" fill="none" stroke="#140a30" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const M_ = n => `${n} ${ic('meat', 'i-in')}`, C_ = n => `${n} ${ic('coin', 'i-in')}`;
const rwHTML = (m, c) => [m ? `+${M_(m)}` : '', c ? `+${C_(c)}` : ''].filter(Boolean).join(' ');

/* ===================== TRẠNG THÁI ===================== */
const LS_KEY = 'hanh-trinh-25kg-v1';
const blank = () => ({ v: 2, startDate: todayStr(), startWeight: 94.5, days: {}, w: {}, coins: 0, food: 0, pets: {}, own: {}, decor: {}, ach: {}, rw: {}, bonus: {}, seen: {}, sel: null, gacha: GACHA_BLANK(), updatedAt: 0 });
let state = blank();
function migrate(o) {
  const s = Object.assign(blank(), o && typeof o === 'object' ? o : {});
  ['days', 'w', 'pets', 'own', 'decor', 'ach', 'rw', 'bonus', 'seen'].forEach(k => { if (!s[k] || typeof s[k] !== 'object' || Array.isArray(s[k])) s[k] = {}; });
  if (typeof s.startWeight !== 'number' || !(s.startWeight > 30 && s.startWeight < 300)) s.startWeight = 94.5;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) s.startDate = todayStr();
  s.coins = Math.max(0, Math.floor(+s.coins || 0)); s.food = Math.max(0, Math.floor(+s.food || 0)); s.updatedAt = +s.updatedAt || 0;
  if (!(o && o.v >= 2)) fromV1(s, o || {});
  // Dọn pet hỏng, giữ đúng dạng 1–4
  Object.keys(s.pets).forEach(id => {
    const p = s.pets[id];
    if (!PET_BY[id] || !p || typeof p !== 'object') { delete s.pets[id]; return; }
    p.f = Math.min(4, Math.max(1, Math.floor(+p.f || 1))); p.m = Math.max(0, Math.floor(+p.m || 0));
    if (!p.eq || typeof p.eq !== 'object') p.eq = {};
  });
  if (s.sel && !s.pets[s.sel]) s.sel = null;
  // Bản 4: vòng quay bắt đầu từ 0 cho dữ liệu cũ; đồ độc quyền chỉ giữ món có thật
  gachaSanitize(s);
  s.v = 2;
  return s;
}
/* ----- Chuyển dữ liệu bản v1 sang v2: tính lại pet theo số ngày đã chốt, quy đổi thịt/xu, không mất gì ----- */
let MIGRATED = false;
const V1_DECOR_PRICE = { grass: 10, rock: 20, fire: 30, lantern: 40, flag: 60, tent: 80, tree: 100, rack: 120, falls: 150, tower: 180, night: 220, rainbow: 260 };
const V1_LV_NEED = [0, 2, 3, 4, 5];
function fromV1(s, o) {
  const prev = state; state = s;
  // 1. Thịt/xu đã kiếm ở v1 (kể cả phần đã tiêu)
  let v1Food = s.food, v1Coins = s.coins;
  const v1Pets = (o.pets && typeof o.pets === 'object') ? o.pets : {};
  Object.values(v1Pets).forEach(p => { if (p && p.lv) { for (let l = 1; l < Math.min(5, p.lv); l++) v1Food += V1_LV_NEED[l]; v1Food += +p.xp || 0; } });
  let decorV2 = 0;
  Object.keys(s.decor).forEach(k => { if (SHOP_BY[k]) { v1Coins += V1_DECOR_PRICE[k] || 0; decorV2 += SHOP_BY[k].p; } else delete s.decor[k]; });
  // 2. Thưởng v2 tính lại từ lịch sử: từng mục đã tích, ngày đã chốt, mốc chuỗi, quay lại
  s.rw = {}; s.bonus = {};
  const R = retroRewards(s);
  s.food = Math.max(R.meat, v1Food);
  s.coins = Math.max(s.coins, R.coin - decorV2);
  // 3. Pet: mở theo tổng ngày đã chốt, giữ cấp cũ nếu trùng loài
  s.pets = {};
  const D = derive();
  PETS.forEach(p => { if (D.total >= p.need) s.pets[p.id] = { f: 1, m: Math.min(hatchGift(p.i), evoCost(p.i, 1) - 1), eq: {} }; });
  Object.keys(v1Pets).forEach(id => {
    const old = v1Pets[id], st = s.pets[id]; if (!st || !old) return;
    const target = old.lv >= 5 ? 4 : old.lv >= 4 ? 3 : old.lv >= 2 ? 2 : 1;
    while (st.f < target) { const c = evoCost(PET_BY[id].i, st.f) - st.m; s.food = Math.max(0, s.food - c); st.f++; st.m = 0; }
  });
  if (o.badges) s.badgesV1 = o.badges;
  delete s.badges; s.ach = {}; s.seen = {}; s.own = s.own || {};
  MIGRATED = true;
  state = prev;
}
function retroRewards(s) {
  let meat = 0, coin = 0;
  const days = Object.keys(s.days).filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && d >= s.startDate).sort();
  const wdays = Object.keys(s.w).filter(d => d >= s.startDate);
  [...new Set(days.concat(wdays))].sort().forEach(ds => {
    if (diff(s.startDate, ds) >= PLAN_DAYS + 30) return;
    const R = s.rw[ds] = s.rw[ds] || {};
    itemsFor(ds).forEach(x => { if (itemDone(ds, x.k)) { R[x.k] = 1; meat += ECON.item.meat; coin += ECON.item.coin; } });
  });
  const D = derive();
  D.commitLog.forEach(c => {
    (s.rw[c.ds] = s.rw[c.ds] || {}).c = 1; meat += ECON.commit.meat; coin += ECON.commit.coin;
    const b = ECON.streak[c.streak], key = 's2:' + c.runStart + ':' + c.streak;
    if (b && !s.bonus[key]) { s.bonus[key] = 1; meat += b.meat; coin += b.coin; }
    if (c.comeback && !s.bonus['cb:' + c.ds]) { s.bonus['cb:' + c.ds] = 1; meat += ECON.comeback.meat; coin += ECON.comeback.coin; }
  });
  return { meat, coin };
}
/* ----- Lưu trên máy: localStorage là chính, IndexedDB là bản dự phòng ----- */
const META_KEY = 'hanh-trinh-25kg-meta';
const IDB_NAME = 'hanh-trinh-25kg', IDB_STORE = 'kv';
const DAY_MS = 864e5, BACKUP_EVERY = 7;
let loadedFromLS = false;
function loadLocal() { try { const raw = localStorage.getItem(LS_KEY); if (raw) { state = migrate(JSON.parse(raw)); loadedFromLS = true; } } catch (e) { console.warn(e); } }
function saveLocal() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); store.lsOk = true; return true; } catch (e) { store.lsOk = false; return false; } }
function persist() { state.updatedAt = Date.now(); saveLocal(); store.schedule(); store.askPersist(); }
const getDay = ds => (state.days[ds] = state.days[ds] || { it: {} });
const meta = (() => { let m = null; try { m = JSON.parse(localStorage.getItem(META_KEY) || 'null'); } catch (e) { } m = m && typeof m === 'object' ? m : {}; if (!m.since) m.since = Date.now(); if (m.remind == null) m.remind = true; return m; })();
function saveMeta() { try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (e) { } }
saveMeta();

const store = {
  status: 'ok', lsOk: true, idbOk: false, ready: false, db: null, timer: null, persisted: null, asked: false,
  setStatus(s) { this.status = s; const el = $('#syncdot'); if (el) el.className = 'sync ' + (s === 'ok' ? 'ok' : s === 'wait' ? 'wait' : ''); },
  refresh() { this.setStatus(this.timer ? 'wait' : (this.lsOk || this.idbOk) ? 'ok' : 'err'); },
  open() {
    return new Promise((res, rej) => {
      try {
        if (!window.indexedDB) return rej(new Error('no idb'));
        const r = indexedDB.open(IDB_NAME, 1);
        r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains(IDB_STORE)) r.result.createObjectStore(IDB_STORE); };
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); r.onblocked = () => rej(new Error('blocked'));
      } catch (e) { rej(e); }
    });
  },
  tx(mode, fn) {
    return new Promise((res, rej) => {
      try { const t = this.db.transaction(IDB_STORE, mode), q = fn(t.objectStore(IDB_STORE)); t.oncomplete = () => res(q && q.result); t.onerror = t.onabort = () => rej(t.error); }
      catch (e) { rej(e); }
    });
  },
  async init() {
    try {
      this.db = await this.open();
      const raw = await this.tx('readonly', s => s.get('state'));
      let o = null; if (typeof raw === 'string') { try { o = migrate(JSON.parse(raw)); } catch (e) { o = null; } }
      this.idbOk = true; this.ready = true;
      if (o && o.updatedAt > 0 && (!loadedFromLS || o.updatedAt > state.updatedAt)) {
        state = o; checkAch(); saveLocal(); ui.back = false; render();
        if (!loadedFromLS) toast('Đã lấy lại dữ liệu từ bản dự phòng trên máy');
      } else if (!o || o.updatedAt < state.updatedAt || o.v !== state.v) this.flush();
    } catch (e) { this.idbOk = false; this.ready = true; }
    if (state.updatedAt > 0) this.askPersist();
    this.refresh();
  },
  schedule(ms = 400) { clearTimeout(this.timer); this.timer = setTimeout(() => { this.timer = null; this.flush(); }, ms); this.refresh(); },
  now() { if (this.timer) { clearTimeout(this.timer); this.timer = null; this.flush(); } },
  async flush() {
    if (!this.ready || !this.db) { this.refresh(); return; }
    try { await this.tx('readwrite', s => s.put(JSON.stringify(state), 'state')); this.idbOk = true; } catch (e) { this.idbOk = false; }
    this.refresh();
  },
  async askPersist() {
    if (this.asked) return; this.asked = true;
    try { const S = navigator.storage; if (!S) return; if (S.persisted) this.persisted = await S.persisted(); if (!this.persisted && S.persist) this.persisted = await S.persist(); } catch (e) { }
  }
};
document.addEventListener('visibilitychange', () => { if (document.hidden) store.now(); });
window.addEventListener('pagehide', () => store.now());

/* ===================== KẾ HOẠCH THEO NGÀY ===================== */
function dayInfo(ds) {
  const idx = diff(state.startDate, ds), wd = parseD(ds).getDay();
  const week = Math.floor(idx / 7) + 1, train = wd !== 0;
  const refeed = idx >= 0 && idx < PLAN_DAYS && wd === 3 && week % 2 === 0;
  const heavy = idx >= 0 && ((week === 2 && (wd === 1 || wd === 4)) || (week >= 3 && (wd === 1 || wd === 4 || wd === 6)));
  const deload = week === 8;
  const heavyDur = week <= 4 ? '15 phút' : week <= 8 ? '15–20 phút' : '20 phút';
  let type, cls;
  if (refeed) { type = 'Ngày ăn nhiều'; cls = 'refeed'; }
  else if (!train) { type = 'Ngày nghỉ tạ'; cls = 'rest'; }
  else if (deload) { type = 'Tuần tập nhẹ'; cls = 'deload'; }
  else { type = 'Ngày tập'; cls = 'train'; }
  return { ds, idx, wd, week, train, refeed, heavy, deload, heavyDur, type, cls, session: train ? SESSIONS[wd] : null, abs: train ? ABS_BY_WD[wd] || null : null, inPlan: idx >= 0 && idx < PLAN_DAYS };
}
const setsOf = (I, s) => I.deload ? Math.max(1, Math.round(s * 2 / 3)) : s;
function itemsFor(ds) {
  const I = dayInfo(ds), day = (state.days[ds] || { it: {} }), L = [];
  L.push({ k: 'weigh', ic: 'scale', t: 'Cân buổi sáng', sub: 'Sau khi đi vệ sinh, trước khi ăn', main: false });
  if (I.train) {
    const sets = I.session.ex.reduce((a, e) => a + setsOf(I, e.s) * (e.ss ? 1 : 1), 0), n = I.session.ex.reduce((a, e) => a + (e.ss ? 2 : 1), 0);
    L.push({ k: 'lift', ic: 'barbell', t: `Buổi tạ: ${I.session.code}`, sub: `Buổi ${I.session.tag} · ${n} bài · ${sets} hiệp${I.deload ? ' (tuần nhẹ)' : ''}`, main: true, panel: 'lift', more: 'Xem bài tập' });
  }
  if (I.abs) L.push({ k: 'abs', ic: 'abs', t: ABS[I.abs].code, sub: ABS[I.abs].ex.map(e => EX[e.id][0]).join(' + '), main: true, panel: 'abs', more: 'Xem bài bụng' });
  if (I.train) {
    const o = LIGHT_CARDIO.find(x => x.id === day.lc) || LIGHT_CARDIO[0];
    L.push({ k: 'light', ic: 'walk', t: 'Cardio nhẹ', sub: `${o.n} · ${o.d}`, main: true, panel: 'light', more: 'Đổi cách tập' });
  }
  if (I.heavy) {
    const o = HEAVY_CARDIO.find(x => x.id === day.hc) || HEAVY_CARDIO[0];
    L.push({ k: 'heavy', ic: 'hiit', t: `Cardio nặng ${I.heavyDur}`, sub: day.it && day.it.heavy === 'skip' ? 'Hôm nay bỏ để phanh lại' : `${o.n} · khởi động 5 phút trước`, main: true, panel: 'heavy', more: 'Chọn bài & cách làm' });
  }
  L.push({ k: 'steps', ic: 'steps', t: '15.000 bước', sub: 'Tính cả lúc đi bộ dốc. Thiếu thì đi 10–15 phút sau mỗi bữa', main: true });
  const T = sumMacro(menuFor(I).flatMap(m => m[2]));
  L.push({ k: 'food', ic: 'meal', t: I.refeed ? 'Ăn đúng thực đơn ngày ăn nhiều' : 'Ăn đúng thực đơn', sub: `≈${fnum(Math.round(T.kcal / 10) * 10)} kcal · đạm ${Math.round(T.p)} g · tinh bột ${Math.round(T.c)} g · béo ${Math.round(T.f)} g`, main: true, panel: 'food', more: 'Xem thực đơn từng bữa' });
  L.push({ k: 'water', ic: 'water', t: '4 lít nước', sub: 'Chia đều cả ngày. Nêm muối bình thường', main: true });
  L.push({ k: 'sleep', ic: 'sleep', t: 'Ngủ 7–8 tiếng', sub: 'Giờ cố định. Không cà phê sau 16h', main: false });
  if (I.wd === 0) L.push({ k: 'measure', ic: 'tape', t: 'Đo eo và chụp ảnh', sub: 'Đo ngang rốn, chụp cùng góc mỗi Chủ nhật', main: false });
  return L;
}
const itemDone = (ds, k) => {
  if (k === 'weigh') return state.w[ds] != null;
  const it = (state.days[ds] || {}).it || {};
  return it[k] === true || (k === 'heavy' && it.heavy === 'skip');
};
const isCommitted = ds => !!(state.days[ds] && state.days[ds].done);

/* ----- Tính chuỗi, khiên, thống kê (tính lại từ dữ liệu mỗi lần) ----- */
function derive() {
  const T = todayStr(), Y = addDays(T, -1), S = state.startDate, n = diff(S, T);
  const r = { T, Y, streak: 0, best: 0, shields: 0, runStart: null, total: 0, shieldDays: {}, missDays: {}, week: {}, perfectWeek: false, maxWeek: 0, comeback: false, commitLog: [],
    cnt: { lift: 0, heavy: 0, abs: 0, water: 0, food: 0, steps: 0, measure: 0, sleep: 0, refeed: 0 }, runWeigh: 0, runSleep: 0 };
  let prog = 0, hadBreak = false, cs = 0, cwe = 0;
  for (let i = 0; i <= Math.max(n, -1); i++) {
    const d = addDays(S, i), it = (state.days[d] || {}).it || {};
    if (isCommitted(d)) {
      r.total++;
      let cb = false;
      if (r.streak === 0) { r.runStart = d; if (hadBreak) { r.comeback = true; cb = true; hadBreak = false; } }
      r.streak++; prog++;
      if (prog >= 7) { prog = 0; r.shields = Math.max(r.shields, Math.min(2, r.shields + 1)); }
      const wk = Math.floor(i / 7) + 1; r.week[wk] = (r.week[wk] || 0) + 1;
      if (dayInfo(d).refeed) r.cnt.refeed++;
      r.commitLog.push({ ds: d, streak: r.streak, runStart: r.runStart, comeback: cb });
      // Khiên trúng từ vòng quay của ngày này (tối đa GA.shieldCap)
      const gr = state.gacha && state.gacha.days[d];
      if (gr && gr.k === 'shield') r.shields = Math.min(GA.shieldCap, r.shields + 1);
    } else if (d !== T && d !== Y) {
      if (r.streak > 0 && r.shields > 0) { r.shields--; r.shieldDays[d] = 1; }
      else { if (r.streak > 0) hadBreak = true; r.missDays[d] = 1; r.streak = 0; prog = 0; r.runStart = null; }
    }
    r.best = Math.max(r.best, r.streak);
    ['lift', 'heavy', 'abs', 'water', 'food', 'steps', 'measure', 'sleep'].forEach(k => { if (it[k] === true) r.cnt[k]++; });
    cs = it.sleep === true ? cs + 1 : d === T ? cs : 0; r.runSleep = Math.max(r.runSleep, cs);
    cwe = state.w[d] != null ? cwe + 1 : d === T ? cwe : 0; r.runWeigh = Math.max(r.runWeigh, cwe);
  }
  Object.values(r.week).forEach(v => { r.maxWeek = Math.max(r.maxWeek, v); if (v >= 7) r.perfectWeek = true; });
  const wds = Object.keys(state.w).filter(d => d <= T).sort();
  r.latestDate = wds[wds.length - 1] || null;
  r.latest = r.latestDate ? state.w[r.latestDate] : null;
  r.lost = r.latest != null ? Math.max(0, +(state.startWeight - r.latest).toFixed(1)) : 0;
  r.pets = PETS.filter(p => state.pets[p.id]).length; // chỉ đếm 28 pet thường (thành tựu Mở N pet)
  return r;
}

/* ===================== KINH TẾ ===================== */
const owned = id => !!(state.own[id] || state.decor[id]);
function achMetric(kind, D) {
  const P = PETS.map(p => state.pets[p.id]).filter(Boolean);
  switch (kind) {
    case 'total': return D.total; case 'streak': return D.best;
    case 'lift': case 'heavy': case 'abs': case 'water': case 'food': case 'steps': case 'measure': case 'refeed': return D.cnt[kind];
    case 'pets': return D.pets;
    case 'evo2': return P.filter(p => p.f >= 2).length; case 'evo4': return P.filter(p => p.f >= 4).length;
    case 'owned': return SHOP.filter(x => owned(x.id)).length;
    case 'outfit': return SHOP.filter(x => x.cat === 'wear' && owned(x.id)).length;
    case 'fx': return SHOP.filter(x => x.cat === 'fx' && owned(x.id)).length;
    case 'decor': return SHOP.filter(x => x.cat === 'decor' && owned(x.id)).length;
    case 'kg': return D.lost; case 'perfectweek': return D.perfectWeek ? 1 : 0; case 'comeback': return D.comeback ? 1 : 0;
    case 'weighrun': return D.runWeigh; case 'sleeprun': return D.runSleep;
    case 'spin': return state.gacha.n; case 'spinrun': return spinRun(); case 'epic': return epicOwnedN();
    case 'ep4': return EPICS.filter(p => state.pets[p.id] && state.pets[p.id].f >= 4).length;
  }
  return 0;
}
function checkAch(D) {
  D = D || derive();
  const got = [];
  ACH.forEach(a => {
    if (state.ach[a.id]) return;
    let v = 0; try { v = achMetric(a.kind, D); } catch (e) { }
    if (v >= a.n) { state.ach[a.id] = Date.now(); const r = ECON.tier[a.t]; state.coins += r.coin; state.food += r.meat; got.push(a); }
  });
  return got;
}
function announceAch(list) { list.forEach((a, i) => setTimeout(() => toast(`${ic(ACH_GLYPH[a.kind] || 'star', 'i-in')} Thành tựu mới: ${esc(a.name)} · ${rwHTML(ECON.tier[a.t].meat, ECON.tier[a.t].coin)}`), i * 700)); }
// Thưởng nhỏ cho từng mục trong ngày, mỗi mục chỉ một lần
function rewardItem(ds, k) {
  const R = state.rw[ds] = state.rw[ds] || {};
  if (R[k]) return null;
  const m = ECON.item.meat * meatMult(ds);
  R[k] = 1; state.food += m; state.coins += ECON.item.coin;
  return [m, ECON.item.coin];
}
// Mở pet theo tổng ngày đã chốt; pet mới nở kèm thịt nạp sẵn
function syncPets(D) {
  const fresh = [];
  PETS.forEach(p => { if (D.total >= p.need && !state.pets[p.id]) { state.pets[p.id] = { f: 1, m: Math.min(hatchGift(p.i), evoCost(p.i, 1) - 1), eq: {} }; fresh.push(p); } });
  return fresh;
}
const curPetId = () => state.sel && state.pets[state.sel] ? state.sel : ([...PETS].reverse().find(p => state.pets[p.id]) || {}).id || null;

/* ===================== GIAO DIỆN ===================== */
const TABS = ['today', 'calendar', 'pets', 'weight', 'badges'];
const TAB_NAME = { today: 'Hôm nay', calendar: 'Lịch', pets: 'Pet', weight: 'Cân', badges: 'Thành tựu' };
const ui = { tab: 'today', back: false, open: {}, qShift: 0, calMonth: null, pop: null, petView: 'camp', shopCat: 'wear', pet: null, slot: 'head' };

function renderTop(D) {
  $('#top').innerHTML = `<div class="top-row">
    <span class="chip" title="Chuỗi hiện tại">${ic('fire', 'e')}${D.streak}</span>
    <span class="chip" title="Khiên giữ chuỗi">${ic('shield', 'e')}${D.shields}</span>
    <span class="chip" title="Xu" id="chip-coin">${ic('coin', 'e')}${state.coins}</span>
    <span class="chip" title="Thịt cho pet" id="chip-meat">${ic('meat', 'e')}${state.food}</span>
    <span style="margin-left:auto"></span>
    <button class="icon-btn" data-act="settings" aria-label="Cài đặt">${ic('gear')}</button>
    <span id="syncdot" class="sync ${store.status === 'ok' ? 'ok' : store.status === 'wait' ? 'wait' : ''}" title="Trạng thái lưu"></span>
  </div>`;
}
function renderNav() {
  const unseen = ALL_PETS.some(p => state.pets[p.id] && !state.seen[p.id]) || hasSpin();
  $('#nav').innerHTML = `<div class="bar-in">${TABS.map(t => `<button class="nb" data-act="nav" data-tab="${t}" ${ui.tab === t ? 'aria-current="page"' : ''}>${NAV_ICONS[t]()}${t === 'pets' && unseen ? '<span class="dot"></span>' : ''}<span>${TAB_NAME[t]}</span></button>`).join('')}</div>`;
}
function render() {
  const D = derive();
  renderTop(D); renderNav();
  const v = $('#view');
  v.innerHTML = ui.tab === 'today' ? nudgeHTML() + viewToday(D) : ui.tab === 'calendar' ? viewCal(D) : ui.tab === 'pets' ? viewPets(D) : ui.tab === 'weight' ? viewWeight(D) : viewBadges(D);
  if (ui.tab === 'weight') bindChart();
  if (ui.tab === 'pets') lazyPets();
  if (ui.pop) { const el = document.querySelector(ui.pop); if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); } ui.pop = null; }
  if (ui.pet && $('#petview')) renderPetView();
  flushCel();
}

/* ----- Hôm nay ----- */
function petMini() {
  const id = curPetId();
  return id ? petSVG(id, state.pets[id].f, { eq: state.pets[id].eq }) : eggSVG();
}
function viewToday(D) {
  let h = '';
  const startIdx = diff(state.startDate, D.T);
  if (startIdx < 0) {
    return `<section class="hero"><div><div class="daynum tout">Sắp vào trận</div><div class="date">${fmtFull(D.T)}</div></div></section>
    <div class="card quote"><div class="qpet">${eggSVG()}</div><div><div class="bubble">Còn ${-startIdx} ngày nữa là tới ngày 1 (${fmtDM(state.startDate)}). Nấu sẵn gà, sạc tai nghe, chuẩn bị đi.</div></div></div>
    <div class="card" style="margin-top:14px"><p class="sub" style="margin:0 0 10px">Muốn bắt đầu luôn thì đổi ngày bắt đầu về hôm nay.</p><button class="btn block" data-act="start-today">Bắt đầu từ hôm nay</button></div>`;
  }
  const ds = ui.back ? D.Y : D.T, I = dayInfo(ds), day = state.days[ds] || { it: {} }, done = isCommitted(ds);
  ui.lastW = D.latest;
  const items = itemsFor(ds), mains = items.filter(x => x.main), doneN = items.filter(x => itemDone(ds, x.k)).length;
  const leftMain = mains.filter(x => !itemDone(ds, x.k)).length, pct = Math.round(doneN / items.length * 100);
  const after = I.idx >= PLAN_DAYS;
  h += `<section class="hero"><div class="pills">${after ? '<span class="pill">Sau 12 tuần</span>' : `<span class="pill">Tuần ${I.week}</span>`}<span class="pill ${I.cls}">${I.type}${I.train ? ' · ' + I.session.code : ''}</span>${x2Of(ds) ? `<span class="pill x2">${ic('meat', 'i-in')} Thịt x${meatMult(ds)}</span>` : ''}</div>
    <div class="daynum tout">Ngày ${I.idx + 1}${after ? '' : '<small>/84</small>'}</div><div class="date">${ui.back ? 'Hôm qua · ' : ''}${fmtFull(ds)}</div></section>`;
  h += `<div class="card quote"><button class="qpet" data-act="go-pet" aria-label="Xem pet">${petMini()}</button><div><div class="bubble" id="qtext">${esc(quoteFor(ds, D))}</div>
    <div class="q-actions"><span class="sub">Câu hôm nay</span><button class="btn sm ghost" data-act="qnext">${ic('dice', 'i-btn')} Đổi câu</button></div></div></div>`;
  if (ui.back) h += `<div class="card banner info" style="margin-top:14px"><p>${isCommitted(D.Y) ? 'Đang xem hôm qua. Tích nốt mục phụ để mở lượt quay bù.' : 'Đang chốt bù cho hôm qua.'}</p><button class="btn sm" data-act="back-off">Về hôm nay</button></div>`;
  else if (spinStatus(D.Y, D).ok) h += `<div class="card banner gx-banner" style="margin-top:14px"><p>Hôm qua còn 1 lượt quay bù.</p><button class="btn sm" data-act="gx-open">${ic('wheel', 'i-btn')} Quay bù</button></div>`;
  else if (diff(state.startDate, D.Y) >= 0 && !isCommitted(D.Y) && !D.shieldDays[D.Y]) h += `<div class="card banner" style="margin-top:14px"><p>Hôm qua chưa chốt. Còn kịp chốt bù tới hết hôm nay.</p><button class="btn sm" data-act="back-on">Chốt bù</button></div>`;
  if (after && !ui.back) h += `<div class="card" style="margin-top:14px;background:linear-gradient(160deg,#ffb21f,#ff4d6a)"><div class="h2 tout">Đã qua 84 ngày!</div><p style="margin:6px 0 0;font-weight:700">Đừng quay lại ăn như cũ ngay. 3–4 tuần tới, mỗi tuần thêm ~150–200 kcal, chủ yếu bằng cơm (~120–150 g cơm chín), tới khi cân đứng yên. Vẫn cân đồ ăn và cân mỗi sáng.</p></div>`;
  if (done) {
    h += `<div class="card stamp" style="margin-top:14px"><div class="ic-big">${ic('trophy')}</div><div><div class="big">Đã chốt ngày ${I.idx + 1}</div><div style="font-weight:700">Thịt và xu đã vào túi. Mai chiến tiếp.</div></div></div>`;
    h += gachaTodayHTML(D, ds);
  } else {
    h += `<div class="card" style="margin-top:14px"><div class="prog"><div class="bar ${pct >= 100 ? 'full' : ''}"><i style="width:${pct}%"></i></div><div class="pct tout-s">${pct}%</div></div>
      <p class="prog-note">${doneN}/${items.length} mục xong${leftMain ? ` · còn ${leftMain} mục chính trước khi chốt` : ' · đủ mục chính, chốt được rồi!'} · mỗi mục ${rwHTML(ECON.item.meat * meatMult(ds), ECON.item.coin)}</p>${gachaTodayHTML(D, ds)}</div>`;
  }
  h += `<ul class="list">${items.map(x => itemHTML(ds, I, day, x, done)).join('')}</ul>`;
  h += `<div class="commit-wrap">`;
  if (!done) h += `<button class="btn btn-commit" data-act="commit" ${leftMain ? 'disabled' : ''}><span class="tout">${leftMain ? `Còn ${leftMain} mục chính` : 'CHỐT NGÀY'}</span></button>`;
  else { const nx = dayInfo(addDays(ds, 1)); h += `<div class="card" style="text-align:center"><span class="sub">Ngày mai:</span> <b>${nx.train ? nx.session.code : 'Nghỉ tạ'}</b>${nx.abs ? ' + ' + ABS[nx.abs].code : ''}${nx.heavy ? ' + cardio nặng' : ''}${nx.refeed ? ' · ngày ăn nhiều' : ''}</div>`; }
  h += `<button class="btn block warn-btn" data-act="help">${ic('brake', 'i-btn')} Hôm nay thấy không ổn</button></div>`;
  return h;
}
function itemHTML(ds, I, day, x, locked) {
  const ok = itemDone(ds, x.k), open = !!ui.open[x.k];
  let right = '';
  if (x.k !== 'weigh') {
    const skip = x.k === 'heavy' && day.it && day.it.heavy === 'skip';
    right = `<button class="chk ${ok ? 'on' : ''} ${skip ? 'skip' : ''}" id="chk-${x.k}" data-act="toggle" data-k="${x.k}" aria-pressed="${ok}" aria-label="${esc(x.t)}: ${ok ? 'đã xong' : 'chưa xong'}" ${locked && (x.main || state.gacha.days[ds]) ? 'disabled' : ''}>${skip ? 'Bỏ' : CHECK}</button>`;
  }
  let body = `<li class="item ${ok ? 'done' : ''} ${x.main ? '' : 'phu'}"><div class="it-row"><div class="it-ic" aria-hidden="true">${ic(x.ic)}</div><div class="it-txt"><div class="it-t">${esc(x.t)}</div><div class="it-s">${esc(x.sub)}</div></div>${right}</div>`;
  if (x.k === 'weigh') {
    const v = state.w[ds];
    const prevD = Object.keys(state.w).filter(d => d < ds).sort().pop();
    const dl = v != null && prevD ? v - state.w[prevD] : null;
    body += `<div class="it-panel" style="border-top:2.5px solid var(--ink)"><div class="wrow"><div class="wrap-in"><label class="sr" for="w-${ds}">Cân nặng sáng ${fmtDM(ds)} (kg)</label><input id="w-${ds}" class="num-in" type="text" inputmode="decimal" placeholder="${ui.lastW != null ? fkg(ui.lastW) : fkg(state.startWeight)}" value="${v != null ? fkg(v) : ''}" data-wdate="${ds}"><span class="unit">kg</span></div><button class="btn green" data-act="wsave" data-date="${ds}">Lưu</button></div>
      ${dl != null ? `<p class="note">So với lần cân trước: <b class="${dl > 0 ? 'delta-up' : 'delta-dn'}">${dl > 0 ? '+' : ''}${fkg(dl)} kg</b>${dl > 0 && I.wd === 4 ? ' (sau ngày ăn nhiều, nhích 0,5–1,5 kg là nước)' : ''}</p>` : ''}</div>`;
  }
  if (x.panel) {
    body += `<button class="it-more" data-act="expand" data-k="${x.k}" aria-expanded="${open}">${x.more} <span class="car">${ic('chevron')}</span></button>`;
    if (open) body += `<div class="it-panel">${panelHTML(x.panel, I, day, locked)}</div>`;
  }
  return body + `</li>`;
}
// Một dòng bài tập: hình | tên + lưu ý form | hiệp × lần | nghỉ
function exRow(id, sets, reps, rest, o = {}) {
  const E = EX[id] || [id, ''];
  return `<div class="exr ${o.cls || ''}"><button class="ex-th" data-act="exzoom" data-id="${id}" data-sr="${esc(sets ? `${sets} × ${reps}` : reps || '')}" data-rest="${esc(rest || '')}" aria-label="Phóng to hình ${esc(E[0])}">${exSVG(id)}</button>
    <div class="ex-mid"><div class="ex-n">${esc(E[0])}${o.main ? '<span class="tag">bài chính</span>' : ''}</div><div class="ex-tip">${esc(o.tip || E[1])}</div></div>
    <div class="ex-r">${sets ? `<b>${o.strike ? `<s>${o.strike}</s>` : ''}${sets} × ${esc(reps)}</b>` : reps ? `<b>${esc(reps)}</b>` : ''}${rest ? `<span>nghỉ ${esc(rest)}</span>` : ''}</div></div>`;
}
function panelHTML(p, I, day, locked) {
  if (p === 'lift') {
    let h = I.session.ex.map(e => {
      const s = setsOf(I, e.s), strike = I.deload && s !== e.s ? e.s : 0;
      if (e.ss) return `<div class="ss"><div class="ss-h">Siêu set · ${strike ? `<s>${strike}</s> ` : ''}${s} hiệp · nghỉ ${esc(e.rest)} sau cả cặp</div>${e.ss.map(([id, r]) => exRow(id, s, r, '', {})).join('')}</div>`;
      return exRow(e.id, s, e.r, e.rest, { main: e.main, strike });
    }).join('');
    return h + `<p class="note">${I.deload ? 'Tuần 8 tập nhẹ: bớt 1/3 số hiệp, giữ nguyên mức tạ. ' : ''}Bài chính giữ mức tạ như trước khi giảm cân, mỗi hiệp chừa 1–2 lần. Siêu set: làm 2 bài liền nhau, xong cả cặp mới nghỉ. Khớp đau thì bỏ buổi B tuần đó. Chạm hình để xem to.</p>`;
  }
  if (p === 'abs') return ABS[I.abs].ex.map(e => exRow(e.id, e.s, e.r, e.rest)).join('') + `<p class="note">Làm cuối buổi tạ.</p>`;
  if (p === 'light') {
    const cur = day.lc || 'incline', o = LIGHT_CARDIO.find(x => x.id === cur) || LIGHT_CARDIO[0];
    return `<div class="opts">${LIGHT_CARDIO.map(x => `<button class="opt" data-act="lc" data-id="${x.id}" aria-pressed="${x.id === cur}" ${locked ? 'disabled' : ''}>${esc(x.n)}</button>`).join('')}</div>${exRow(o.art, 0, o.d, '', { tip: EX[o.art][1] })}<p class="note">Nhịp vừa phải, vẫn nói chuyện được. Làm sau buổi tạ hoặc buổi sáng.</p>`;
  }
  if (p === 'heavy') {
    const cur = day.hc || 'airbike', o = HEAVY_CARDIO.find(x => x.id === cur) || HEAVY_CARDIO[0], skip = day.it && day.it.heavy === 'skip';
    let body = o.sub ? `<div class="proto">${esc(o.d)}</div>` + o.sub.map((x, i) => Array.isArray(x) ? `<div class="ss"><div class="ss-h">Bài ${i + 1}: chọn một</div>${x.map(id => exRow(id, 0, '40 giây', '20 giây')).join('')}</div>` : exRow(x, 0, '40 giây', '20 giây')).join('')
      : exRow(o.art, 0, o.d, '', { tip: o.tip || EX[o.art][1] });
    return `<div class="opts">${HEAVY_CARDIO.map(x => `<button class="opt" data-act="hc" data-id="${x.id}" aria-pressed="${x.id === cur}" ${locked ? 'disabled' : ''}>${esc(x.n)}</button>`).join('')}</div>${body}
      <p class="note">Khởi động 5 phút rồi mới vào hiệp. Tổng khoảng ${I.heavyDur}. Không làm cardio nặng trong 24 giờ trước buổi Legs.</p>
      ${skip && !locked ? `<button class="btn sm ghost" data-act="unskip" style="margin-top:8px">Hoàn tác bỏ buổi</button>` : ''}`;
  }
  if (p === 'food') return foodHTML(I, day);
  return '';
}
const macroChips = m => `<div class="mchips"><span class="mc p">${ic('protein')}Đạm <b>${Math.round(m.p)} g</b></span><span class="mc c">${ic('carb')}Tinh bột <b>${Math.round(m.c)} g</b></span><span class="mc f">${ic('fat')}Béo <b>${Math.round(m.f)} g</b></span></div>`;
function foodHTML(I, day) {
  const M = menuFor(I);
  let h = M.map(([t, n, list]) => {
    const S = sumMacro(list);
    return `<div class="meal2"><div class="meal-h"><span class="mt">${esc(t)}</span><span class="mn">${esc(n)}</span><span class="mk">${fnum(S.kcal)} kcal</span></div>
      ${list.map(([id, q, note, extra]) => { const F = FOOD[id], m = foodMacro(id, q); return `<div class="fl"><span class="fi">${ic(F[1])}</span><span class="fn">${esc(F[0])}${note ? `<small>${esc(note)}</small>` : ''}${extra ? `<small class="plus">ngày ăn nhiều +${extra}${F[2] === 'g' ? ' g' : ' quả'}</small>` : ''}</span><span class="fq">${q}${F[2] === 'g' ? ' g' : ' quả'}</span><span class="fk">${fnum(m.kcal)} kcal</span></div>`; }).join('')}
      ${macroChips(S)}</div>`;
  }).join('');
  const T = sumMacro(M.flatMap(m => m[2]));
  h += `<div class="ftotal"><div class="ft-top">${ic('kcal')}<div><div class="ft-k">≈${fnum(Math.round(T.kcal / 10) * 10)} kcal</div><div class="sub">Tổng cả ngày${I.refeed ? ' · ngày ăn nhiều' : I.train ? ' · ngày tập' : ' · ngày nghỉ'}</div></div></div>${macroChips(T)}
    ${I.refeed ? '<p class="note plus">Ngày ăn nhiều: thêm ~650 g cơm chia 4 bữa và 2 quả chuối. Gà, trứng giữ nguyên.</p>' : ''}</div>`;
  if (day.brake && day.brake.food) h += `<div class="total" style="margin-top:8px;background:#7a3d10">Đang phanh: ăn thêm <b>150–230 g cơm chín</b> hôm nay (200–300 kcal).</div>`;
  h += `<p class="note">Gà cân lúc sống, cơm cân lúc chín, dầu đong bằng thìa. Mỗi bữa ít nhất 10 g béo. Không ngày nào dưới 1.300 kcal.</p>
    <div class="supp"><span>${ic('pill')}Mỗi ngày: vitamin tổng hợp, omega-3, creatine 5 g</span><span>${ic('whey')}Khó ăn đủ đạm: 1 muỗng whey thay ~110 g ức gà sống</span><span>${ic('coffee')}Không cà phê sau 16h</span></div>`;
  return h;
}
function quoteFor(ds, D) {
  const I = dayInfo(ds), day = state.days[ds] || {};
  let pool;
  if (D.total === 0) pool = Q_FIRST;
  else if (isCommitted(ds) && Q_STREAK[D.streak]) pool = [Q_STREAK[D.streak]];
  else if (D.streak === 0 && D.total > 0 && !isCommitted(D.Y)) pool = Q_COMEBACK;
  else if (day.brake) pool = Q_TIRED;
  else if (I.refeed) pool = Q_REFEED;
  else if (I.deload) pool = Q_DELOAD;
  else if (I.wd === 0) pool = Q_REST;
  else pool = Q_GENERAL;
  const list = pool === Q_GENERAL ? Q_GENERAL : pool.concat(Q_GENERAL);
  return list[(hash(ds) % pool.length + ui.qShift) % list.length];
}

/* ----- Lịch ----- */
function viewCal(D) {
  if (!ui.calMonth) { const t = parseD(D.T); ui.calMonth = [t.getFullYear(), t.getMonth()]; }
  const [y, m] = ui.calMonth, first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
  let cells = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(w => `<div class="wd">${w}</div>`).join('');
  for (let i = 0; i < lead; i++) cells += `<div class="cell blank"></div>`;
  for (let d = 1; d <= days; d++) {
    const ds = ymd(new Date(y, m, d)), I = dayInfo(ds);
    let cls = 'cell', mk = '';
    if (!I.inPlan && !(I.idx >= PLAN_DAYS && ds <= D.T)) cls += ' out';
    if (isCommitted(ds)) { cls += ' done'; mk = `<i class="mk">${ic('star')}</i>`; }
    else if (D.shieldDays[ds]) { cls += ' shield'; mk = `<i class="mk">${ic('shield')}</i>`; }
    else if (D.missDays[ds]) { cls += ' miss'; mk = `<i class="mk">${ic('close')}</i>`; }
    else if (ds === D.Y && I.idx >= 0) cls += ' pending';
    if (ds === D.T) cls += ' today';
    cells += `<button class="${cls}" data-act="calday" data-date="${ds}" aria-label="${fmtFull(ds)}">${d}${I.idx >= 0 && I.idx < PLAN_DAYS ? `<span class="pd">${I.refeed ? ic('rice', 'i-pd') : ''}N${I.idx + 1}</span>` : ''}${mk}</button>`;
  }
  const S = state.startDate, sw = state.startWeight;
  const miles = [[28, sw - 9.5, 'Tuần 4'], [56, sw - 16.5, 'Tuần 8'], [84, sw - 22.5, 'Tuần 12']];
  return `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Lịch & chuỗi</div><div class="date">Bắt đầu ${fmtDM(S)} · về đích ${fmtDM(addDays(S, PLAN_DAYS - 1))}/${parseD(addDays(S, PLAN_DAYS - 1)).getFullYear()}</div></div></section>
  <div class="tiles">
    <div class="tile hot"><div class="k">Chuỗi hiện tại</div><div class="v tout-s">${ic('fire', 'i-v')}${D.streak}</div></div>
    <div class="tile"><div class="k">Chuỗi dài nhất</div><div class="v">${D.best}</div></div>
    <div class="tile"><div class="k">Ngày đã chốt</div><div class="v">${D.total}<small>/84</small></div></div>
    <div class="tile"><div class="k">Khiên giữ chuỗi</div><div class="v">${ic('shield', 'i-v')}${D.shields}<small>/${D.shields > 2 ? GA.shieldCap : 2}</small></div></div>
  </div>
  <div class="card" style="margin-top:14px">
    <div class="cal-head"><button class="icon-btn" data-act="calprev" aria-label="Tháng trước">${ic('arrowL')}</button><h3 class="h3" style="margin:0">Tháng ${m + 1}/${y}</h3><button class="icon-btn" data-act="calnext" aria-label="Tháng sau">${ic('arrowR')}</button></div>
    <div class="cal-grid">${cells}</div>
    <div class="legend"><span><i style="background:#ffc21f"></i>Đã chốt</span><span><i style="background:#2fb8e8"></i>Khiên đỡ</span><span><i style="background:#ff8a1f"></i>Chốt bù được</span><span><i class="dash" style="background:#2a1f63"></i>Bỏ lỡ</span><span>${ic('rice', 'i-in')} Ngày ăn nhiều</span></div>
  </div>
  <div class="card"><h3 class="h3">Cách giữ chuỗi</h3><p class="sub" style="margin:0">Chốt đủ 7 ngày liền được 1 khiên, giữ tối đa 2 (trúng khiên ở vòng quay thì giữ được tới ${GA.shieldCap}). Lỡ một ngày thì khiên tự đỡ, chuỗi không gãy. Quên chốt thì vẫn chốt bù được cho hôm qua, chỉ hôm qua thôi. Bỏ lỡ ngày không bị trừ gì, pet không bị sao.</p></div>
  <div class="card"><h3 class="h3">Mốc cân theo kế hoạch</h3>
    ${miles.map(([i, v, t]) => `<div class="mile"><span class="w">${t}</span><span class="sub">${fmtDM(addDays(S, i - 1))}</span><span class="kg">~${fkg(v)} kg</span></div>`).join('')}
    <div class="mile"><span class="w" style="color:var(--red)">Trần</span><span class="sub">Giảm 25 kg, chỉ khi mọi thứ thuận lợi</span><span class="kg">${fkg(sw - 25)} kg</span></div>
  </div>`;
}

/* ----- Pet: trại chung, bộ sưu tập, cửa hàng ----- */
function viewPets(D) {
  const ne = epicOwnedN(), spin = hasSpin(D);
  let h = `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Trại pet</div><div class="date">${D.pets}/28 pet · ${ne}/${EPICS.length} Sử thi · cứ 3 ngày chốt mở thêm một con</div></div></section>
  <div class="seg three" role="tablist"><button role="tab" data-act="pview" data-v="camp" aria-selected="${ui.petView === 'camp'}">${ic('paw', 'i-btn')} Trại</button><button role="tab" data-act="pview" data-v="gacha" aria-selected="${ui.petView === 'gacha'}">${ic('wheel', 'i-btn')} Vòng quay${spin ? '<span class="seg-dot"></span>' : ''}</button><button role="tab" data-act="pview" data-v="shop" aria-selected="${ui.petView === 'shop'}">${ic('bag', 'i-btn')} Cửa hàng</button></div>`;
  if (ui.petView === 'shop') return h + viewShop(D);
  if (ui.petView === 'gacha') return h + viewGacha(D);
  h += `<div class="card scene">${campSVG(D)}<div class="scene-hud"><span class="chip">${ic('meat', 'e')}${state.food}</span><span class="chip">${ic('coin', 'e')}${state.coins}</span></div></div>
    <p class="sub" style="margin:8px 2px 0;text-align:center">${D.total ? 'Chạm vào pet trong trại để xem, cho ăn, thay đồ' : 'Chốt ngày đầu tiên để nở trứng'}</p>`;
  if (spin) h += `<div class="card banner gx-banner" style="margin-top:12px"><p>Có lượt quay Sử thi đang chờ.</p><button class="btn sm" data-act="pview" data-v="gacha">${ic('wheel', 'i-btn')} Quay</button></div>`;
  const next = PETS.find(p => !state.pets[p.id]);
  if (next) h += `<div class="card nextpet"><div class="np-sil">${petSVG(next.id, 1, { sil: true })}</div><div><div class="h3" style="margin:0">Pet tiếp theo</div><div class="sub">${ELEMENTS[next.el].n} · ${RARITY[next.rar].n} · mở khi chốt đủ <b>${next.need}</b> ngày (còn ${next.need - D.total})</div></div></div>`;
  const card = p => {
    const st = state.pets[p.id], E = ELEMENTS[p.el], R = RARITY[p.rar];
    return `<button class="pcard ${st ? 'f' + st.f : 'locked'}${p.epic ? ' epic' : ''}" data-act="pet" data-id="${p.id}" style="--e1:${E.bg[0]};--e2:${E.bg[1]}" aria-label="${st ? esc(p.name) : 'Pet chưa mở'}">
      ${st && !state.seen[p.id] ? '<span class="new">Mới</span>' : ''}
      <span class="pc-art" data-lazy="${p.id}|${st ? st.f : 1}|${st ? 0 : 1}"></span>
      ${st ? '' : `<span class="need">${p.epic ? 'Vòng quay' : `Ngày ${p.need}`}</span>`}
      <span class="pn">${st ? esc(p.name) : '???'}</span>
      <span class="pmeta"><span class="rar${R.epic ? ' epic-tag' : ''}" style="background:${R.c}">${R.n}</span></span>
      ${st ? `<span class="pips" aria-label="Dạng ${st.f}">${[1, 2, 3, 4].map(f => `<i class="${f <= st.f ? 'on' : ''}"></i>`).join('')}</span>` : `<span class="sub" style="font-size:12px">${ELEMENTS[p.el].n}</span>`}
    </button>`;
  };
  h += `<h3 class="h2 tout" style="margin:20px 2px 10px">Sử thi <span class="sub" style="text-shadow:none">${ne}/${EPICS.length} · chỉ có từ vòng quay</span></h3><div class="pet-grid epic-grid">${EPICS.map(card).join('')}</div>`;
  h += `<h3 class="h2 tout" style="margin:20px 2px 10px">Bộ sưu tập <span class="sub" style="text-shadow:none">${D.pets}/28</span></h3><div class="pet-grid">${PETS.map(card).join('')}</div>`;
  return h;
}
// Dựng SVG pet khi ô hiện ra
let lazyObs = null;
function lazyPets() {
  const cells = document.querySelectorAll('[data-lazy]');
  const fill = el => { const [id, f, sil] = el.dataset.lazy.split('|'); const st = state.pets[id]; el.innerHTML = petSVG(id, +f, { sil: sil === '1', eq: st && sil !== '1' ? st.eq : null }); el.removeAttribute('data-lazy'); flushCel(); };
  if (!('IntersectionObserver' in window)) { cells.forEach(fill); return; }
  if (lazyObs) lazyObs.disconnect();
  lazyObs = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { lazyObs.unobserve(e.target); fill(e.target); } }), { rootMargin: '200px' });
  cells.forEach(c => lazyObs.observe(c));
}
function viewShop(D) {
  const cats = [['wear', 'Trang phục', 'hat'], ['fx', 'Hiệu ứng', 'magic'], ['decor', 'Trang trí', 'tent']];
  const list = SHOP.filter(x => x.cat === ui.shopCat);
  const ownN = SHOP.filter(x => owned(x.id)).length;
  const pid = curPetId();
  let h = `<div class="card shop-head"><div>${ic('coin', 'i-big')}</div><div><div class="big">${fnum(state.coins)} xu</div><div class="sub">Đã có ${ownN}/${SHOP.length} món. Mỗi mục trong ngày ${rwHTML(0, ECON.item.coin)}, chốt ngày ${rwHTML(0, ECON.commit.coin)}.</div></div></div>
    <div class="seg small">${cats.map(([k, n, i]) => `<button data-act="shopcat" data-c="${k}" aria-selected="${ui.shopCat === k}">${ic(i, 'i-btn')}${n}</button>`).join('')}</div>
    <p class="sub" style="margin:8px 2px">${ui.shopCat === 'decor' ? 'Đồ trang trí đặt vào trại chung, bật tắt tùy ý.' : `Mua một lần, mặc cho pet nào cũng được. Mua xong tự mặc cho ${pid ? esc(PET_BY[pid].name) : 'pet đang chọn'}.`}</p><div class="shop">`;
  list.forEach(x => {
    const own = owned(x.id);
    let btn;
    if (x.cat === 'decor' && own) btn = `<button class="btn sm ${state.decor[x.id].on ? 'green' : 'ghost'}" data-act="dtoggle" data-id="${x.id}" aria-pressed="${!!state.decor[x.id].on}">${state.decor[x.id].on ? 'Đang đặt' : 'Đã cất'}</button>`;
    else if (own) btn = pid ? `<button class="btn sm ${state.pets[pid].eq[x.slot] === x.id ? 'green' : 'ghost'}" data-act="equip" data-pet="${pid}" data-slot="${x.slot}" data-id="${x.id}">${state.pets[pid].eq[x.slot] === x.id ? 'Đang mặc' : 'Mặc thử'}</button>` : `<span class="sub">Đã có</span>`;
    else btn = `<button class="btn sm" data-act="buy" data-id="${x.id}" ${state.coins < x.p ? 'disabled' : ''}>${x.p} ${ic('coin', 'i-in')}</button>`;
    h += `<div class="sitem ${own ? 'own' : ''}"><div class="s-art">${shopIcon(x.id)}</div><div class="n">${esc(x.n)}</div><div class="s-slot">${x.cat === 'decor' ? 'Trại chung' : SLOT_NAME[x.slot]}</div>${btn}</div>`;
  });
  return h + `</div>`;
}
/* ----- Màn chi tiết pet: cảnh riêng, tiến hóa, trang phục ----- */
function openPet(id) {
  const p = PET_BY[id]; if (!p) return;
  if (!state.pets[id]) { openLockedPet(id); return; }
  ui.pet = id; state.sel = id;
  if (!state.seen[id]) { state.seen[id] = 1; }
  persist();
  closeModal();
  let el = $('#petview');
  if (!el) { el = document.createElement('div'); el.id = 'petview'; el.className = 'petview'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); document.body.appendChild(el); }
  renderPetView(true);
  renderNav();
}
function closePet() { const el = $('#petview'); if (el) el.remove(); ui.pet = null; if (ui.tab === 'pets') render(); }
function renderPetView(first) {
  const el = $('#petview'), id = ui.pet; if (!el || !id) return;
  const p = PET_BY[id], st = state.pets[id], E = ELEMENTS[p.el];
  const cost = st.f < 4 ? costOf(id, st.f) : 0, ready = st.f < 4 && st.m >= cost;
  const scroll = el.scrollTop;
  let h = `<div class="pv-scene${p.epic ? ' epic' : ''}" style="--e1:${E.bg[0]};--e2:${E.bg[1]}">${sceneSVG(id)}${p.epic ? '<div class="pv-epic-rays"></div>' : ''}<div class="pv-pet" id="pv-pet">${petSVG(id, st.f, { eq: st.eq })}</div>
    <button class="icon-btn pv-x" data-act="pet-close" aria-label="Đóng">${ic('close')}</button>
    <div class="pv-tags"><span class="tag-el" style="background:${E.c}">${E.n}</span>${rarTag(p.rar)}</div>
    <div class="pv-place">${esc(SCENE_NAME[id])}</div></div>
  <div class="pv-body">
    <div class="pv-name"><h2 class="tout${p.epic ? ' epic-name' : ''}">${esc(p.name)}</h2><span class="pv-form">Dạng ${st.f} · ${FORM_NAME[st.f]}</span></div>
    <p class="pv-intro">${esc(p.intro)}</p>
    <div class="ftrack">${[1, 2, 3, 4].map(f => `<div class="ft ${f === st.f ? 'cur' : f < st.f ? 'past' : 'next'}">${petSVG(id, f, { sil: f > st.f })}<span>${f}</span></div>${f < 4 ? `<i class="ft-ar">${ic('arrowR')}</i>` : ''}`).join('')}</div>`;
  if (st.f < 4) {
    h += `<div class="card evo-card ${ready ? 'ready' : ''}"><div class="evo-top"><span>${ready ? 'Đủ thịt, tiến hóa được rồi!' : `Thịt tới dạng ${st.f + 1}`}</span><b>${st.m}/${cost} ${ic('meat', 'i-in')}</b></div>
      <div class="xp"><i style="width:${Math.min(100, st.m / cost * 100)}%"></i></div>
      ${ready ? `<button class="btn block evo-btn" data-act="evolve" data-id="${id}">${ic('evolve', 'i-btn')} TIẾN HÓA</button>`
        : `<div class="feed-row"><button class="btn green" data-act="feed" data-id="${id}" data-n="5" ${state.food < 1 ? 'disabled' : ''}>${ic('meat', 'i-btn')} Cho ăn 5</button><button class="btn blue" data-act="feed" data-id="${id}" data-n="all" ${state.food < 1 ? 'disabled' : ''}>Cho đủ</button></div>
        <p class="sub" style="text-align:center;margin:6px 0 0">Đang có ${state.food} ${ic('meat', 'i-in')}${state.food < 1 ? '. Tích mục trong ngày hoặc chốt ngày để có thịt.' : ''}</p>`}
    </div>`;
  } else h += `<div class="card evo-card max"><div class="evo-top"><span>${ic('star', 'i-in')} Đã đạt dạng tối thượng</span></div><p class="sub" style="margin:4px 0 0">Thịt dư để dành cho pet khác.</p></div>`;
  // Tủ đồ
  const slots = ['head', 'eyes', 'neck', 'back', 'body', 'fx'];
  const items = WEARABLES.filter(x => x.slot === ui.slot && owned(x.id));
  h += `<h3 class="h3" style="margin:16px 2px 8px">Tủ đồ</h3><div class="seg small slots">${slots.map(s => `<button data-act="slot" data-s="${s}" aria-selected="${ui.slot === s}">${SLOT_NAME[s]}${st.eq[s] ? '<i class="dot-on"></i>' : ''}</button>`).join('')}</div>
    <div class="wardrobe">${items.length ? items.map(x => `<button class="wd-item ${st.eq[x.slot] === x.id ? 'on' : ''}" data-act="equip" data-pet="${id}" data-slot="${x.slot}" data-id="${x.id}" aria-pressed="${st.eq[x.slot] === x.id}">${shopIcon(x.id)}<span>${esc(x.n)}</span>${x.gacha ? '<i class="wd-g"></i>' : ''}</button>`).join('')
      : `<div class="wd-empty"><span class="sub">Chưa có món ${SLOT_NAME[ui.slot].toLowerCase()} nào.</span><button class="btn sm" data-act="to-shop" data-c="${ui.slot === 'fx' ? 'fx' : 'wear'}">${ic('bag', 'i-btn')} Tới cửa hàng</button></div>`}</div>
    <p class="sub" style="margin:10px 2px 0">Chạm món đang mặc để cởi ra.</p></div>`;
  el.innerHTML = h;
  el.scrollTop = first ? 0 : scroll;
  flushCel();
}
function openLockedPet(id) {
  const p = PET_BY[id], D = derive(), E = ELEMENTS[p.el];
  if (p.epic) {
    const q = epicQueue(), k = q.indexOf(p);
    openModal(`<h2>Pet Sử thi bí ẩn</h2><div style="display:flex;justify-content:center"><div style="width:180px">${petSVG(id, 1, { sil: true })}</div></div>
      <p style="text-align:center;margin:4px 0"><span class="tag-el" style="background:${E.c}">${E.n}</span> ${rarTag(4)}</p>
      <p style="text-align:center">Chỉ có từ <b>vòng quay</b>. ${k === 0 ? 'Đang là con <b>nổi bật</b> ở lượt quay tới.' : `Sẽ nổi bật sau <b>${k}</b> lượt quay nữa (nếu chưa ra con khác trước).`}</p>
      <button class="btn block" data-act="gx-open">${ic('wheel', 'i-btn')} Tới vòng quay</button>`);
    return;
  }
  openModal(`<h2>Pet bí ẩn</h2><div style="display:flex;justify-content:center"><div style="width:180px">${petSVG(id, 1, { sil: true })}</div></div>
    <p style="text-align:center;margin:4px 0"><span class="tag-el" style="background:${E.c}">${E.n}</span> ${rarTag(p.rar)}</p>
    <p style="text-align:center">Mở khi chốt đủ <b>${p.need}</b> ngày. Còn <b>${p.need - D.total}</b> ngày nữa.</p>`);
}

/* ----- Cân ----- */
function targetAt(i) {
  const sw = state.startWeight, Pp = [[0, sw], [28, sw - 9.5], [56, sw - 16.5], [84, sw - 22.5]];
  if (i <= 0) return sw; if (i >= 84) return sw - 22.5;
  for (let k = 1; k < Pp.length; k++) if (i <= Pp[k][0]) { const [x0, y0] = Pp[k - 1], [x1, y1] = Pp[k]; return y0 + (y1 - y0) * (i - x0) / (x1 - x0); }
  return sw;
}
function weightSeries() {
  const S = state.startDate;
  const pts = Object.keys(state.w).map(d => ({ d, i: diff(S, d), v: state.w[d] })).filter(p => p.i >= 0).sort((a, b) => a.i - b.i);
  pts.forEach(p => { const win = pts.filter(q => q.i <= p.i && q.i > p.i - 7); p.ma = win.reduce((a, q) => a + q.v, 0) / win.length; });
  return pts;
}
function viewWeight(D) {
  const pts = weightSeries(), sw = state.startWeight, goal = sw - 25, ti = diff(state.startDate, D.T);
  const last7 = pts.filter(p => p.i > ti - 7 && p.i <= ti), avg7 = last7.length ? last7.reduce((a, p) => a + p.v, 0) / last7.length : null;
  const tgt = targetAt(ti);
  let h = `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Cân nặng</div><div class="date">Cân ban đầu ${fkg(sw)} kg · mốc −25 kg là ${fkg(goal)} kg</div></div></section>
  <div class="card"><label class="h3" for="w-main" style="display:block">Cân sáng nay</label><div class="wrow"><div class="wrap-in"><input id="w-main" class="num-in" type="text" inputmode="decimal" placeholder="${D.latest != null ? fkg(D.latest) : fkg(sw)}" value="${state.w[D.T] != null ? fkg(state.w[D.T]) : ''}" data-wdate="${D.T}"><span class="unit">kg</span></div><button class="btn green" data-act="wsave" data-date="${D.T}" data-input="w-main">Lưu</button></div></div>
  <div class="tiles" style="margin-top:14px">
    <div class="tile hot"><div class="k">Đã giảm</div><div class="v tout-s">${D.latest != null ? fkg(sw - D.latest) : '0,0'}<small> kg</small></div></div>
    <div class="tile"><div class="k">Cân gần nhất</div><div class="v">${D.latest != null ? fkg(D.latest) : '–'}<small> kg</small></div></div>
    <div class="tile"><div class="k">Trung bình 7 ngày</div><div class="v">${avg7 != null ? fkg(avg7) : '–'}<small> kg</small></div></div>
    <div class="tile"><div class="k">Mục tiêu hôm nay</div><div class="v">${ti >= 0 ? fkg(tgt) : fkg(sw)}<small> kg</small></div></div>
  </div>
  <div class="card" style="margin-top:14px"><h3 class="h3">Thực tế so với kế hoạch</h3>
    <div class="ckey"><span><svg width="22" height="8"><line x1="1" y1="4" x2="21" y2="4" stroke="#f2b705" stroke-width="3" stroke-linecap="round"/></svg>Trung bình 7 ngày</span><span><svg width="10" height="10"><circle cx="5" cy="5" r="3.5" fill="#f2b705" opacity=".6"/></svg>Cân từng sáng</span><span><svg width="22" height="8"><line x1="1" y1="4" x2="21" y2="4" stroke="#2fb8e8" stroke-width="2.5" stroke-dasharray="5 4"/></svg>Kế hoạch</span></div>
    <div class="chart-wrap" id="chartwrap">${chartSVG(pts, D)}<div class="tip" id="ctip"></div></div>
    <p class="note">Mỗi Chủ nhật so trung bình tuần với đường kế hoạch. Tuần có ngày ăn nhiều, cân nhích 0,5–1,5 kg là nước. Vòng eo và ảnh mới là thước đo chính.</p></div>`;
  if (pts.length) {
    const rows = [...pts].reverse().slice(0, 40);
    h += `<div class="card"><h3 class="h3">Nhật ký cân</h3><div class="wlist">${rows.map((p, k) => { const prev = rows[k + 1]; const dl = prev ? p.v - prev.v : null; return `<div class="wrow2"><span class="d">${fmtFull(p.d)} · N${p.i + 1}</span><span class="kg">${fkg(p.v)}${dl != null ? ` <small class="${dl > 0 ? 'delta-up' : 'delta-dn'}">${dl > 0 ? '+' : ''}${fkg(dl)}</small>` : ''}</span><button class="x" data-act="wdel" data-date="${p.d}" aria-label="Xóa số cân ${fmtDM(p.d)}">${ic('close')}</button></div>`; }).join('')}</div></div>`;
  }
  return h;
}
let chartGeom = null;
function chartSVG(pts, D) {
  const W = 360, H = 236, L = 34, R = 12, T = 12, B = 30, sw = state.startWeight, goal = sw - 25;
  const maxI = Math.max(PLAN_DAYS, ...pts.map(p => p.i));
  const vals = pts.map(p => p.v);
  const lo = Math.floor(Math.min(goal - 1.5, ...vals) / 5) * 5, hi = Math.ceil(Math.max(sw + 1, ...vals) / 5) * 5;
  const x = i => L + i / maxI * (W - L - R), y = v => T + (hi - v) / (hi - lo) * (H - T - B);
  let s = `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Biểu đồ cân nặng thực tế so với kế hoạch">`;
  for (let v = lo; v <= hi; v += 5) s += `<line x1="${L}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(255,255,255,.12)" stroke-width="1"/><text x="${L - 6}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#b9b0f0">${v}</text>`;
  for (let wk = 0; wk <= maxI; wk += 7) s += `<line x1="${x(wk)}" x2="${x(wk)}" y1="${T}" y2="${H - B}" stroke="rgba(255,255,255,${wk % 28 === 0 ? .16 : .06})" stroke-width="1"/>`;
  [[0, 'Bắt đầu', 'start'], [28, 'Tuần 4', 'middle'], [56, 'Tuần 8', 'middle'], [84, 'Tuần 12', 'end']].forEach(([i, t, a]) => s += `<text x="${x(i)}" y="${H - 10}" text-anchor="${a}" font-size="11" fill="#b9b0f0">${t}</text>`);
  s += `<line x1="${L}" x2="${W - R}" y1="${y(goal)}" y2="${y(goal)}" stroke="#ff4d6a" stroke-width="2" stroke-dasharray="2 4"/><text x="${L + 4}" y="${y(goal) - 5}" font-size="11" fill="#ff9aa9">Mốc −25 kg · ${fkg(goal)}</text>`;
  const tp = [[0, sw], [28, sw - 9.5], [56, sw - 16.5], [84, sw - 22.5]];
  s += `<polyline points="${tp.map(([i, v]) => `${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="#2fb8e8" stroke-width="2.5" stroke-dasharray="6 5" stroke-linecap="round"/>`;
  tp.slice(1).forEach(([i, v]) => s += `<circle cx="${x(i)}" cy="${y(v)}" r="3.5" fill="#2fb8e8"/>`);
  s += `<text x="${x(84) - 2}" y="${y(sw - 22.5) - 8}" text-anchor="end" font-size="11" fill="#8fdcff">~${fkg(sw - 22.5)}</text>`;
  const ti = diff(state.startDate, D.T);
  if (ti >= 0 && ti <= maxI) s += `<line x1="${x(ti)}" x2="${x(ti)}" y1="${T}" y2="${H - B}" stroke="#fff" stroke-width="1.5" stroke-dasharray="3 3" opacity=".55"/>`;
  pts.forEach(p => s += `<circle cx="${x(p.i)}" cy="${y(p.v)}" r="3" fill="#f2b705" opacity=".55"/>`);
  if (pts.length > 1) s += `<polyline points="${pts.map(p => `${x(p.i).toFixed(1)},${y(p.ma).toFixed(1)}`).join(' ')}" fill="none" stroke="#f2b705" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (pts.length) { const p = pts[pts.length - 1]; s += `<circle cx="${x(p.i)}" cy="${y(p.ma)}" r="5.5" fill="#f2b705" stroke="#2b1f80" stroke-width="2.5"/>`; }
  else s += `<text x="${(L + W - R) / 2}" y="${T + 40}" text-anchor="middle" font-size="13" fill="#d4ccff">Nhập số cân sáng nay để bắt đầu vẽ đường</text>`;
  s += `<line id="cx" x1="0" x2="0" y1="${T}" y2="${H - B}" stroke="#fff" stroke-width="1.5" opacity="0"/><circle id="cdot" r="6" fill="#fff" stroke="#140a30" stroke-width="2.5" opacity="0"/>`;
  s += `<rect id="chit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent"/></svg>`;
  chartGeom = { pts, x, y, W, maxI, L, R };
  return s;
}
function bindChart() {
  const svg = $('.chart-svg'), tip = $('#ctip'); if (!svg || !chartGeom) return;
  const G = chartGeom;
  const show = ev => {
    if (!G.pts.length) return;
    const r = svg.getBoundingClientRect(), vx = (ev.clientX - r.left) / r.width * G.W;
    const i = (vx - G.L) / (G.W - G.L - G.R) * G.maxI;
    let best = G.pts[0]; G.pts.forEach(p => { if (Math.abs(p.i - i) < Math.abs(best.i - i)) best = p; });
    const px = G.x(best.i), py = G.y(best.v);
    const cx = $('#cx'), cd = $('#cdot');
    cx.setAttribute('x1', px); cx.setAttribute('x2', px); cx.setAttribute('opacity', '.5');
    cd.setAttribute('cx', px); cd.setAttribute('cy', py); cd.setAttribute('opacity', '1');
    tip.innerHTML = `${fmtDM(best.d)} · ngày ${best.i + 1}<br>Cân: <b>${fkg(best.v)}</b> kg<br>TB 7 ngày: ${fkg(best.ma)} · Kế hoạch: ${fkg(targetAt(best.i))}`;
    tip.style.display = 'block';
    let left = px / G.W * r.width; left = Math.max(80, Math.min(r.width - 80, left));
    tip.style.left = left + 'px'; tip.style.top = (py / 236 * r.height) + 'px';
  };
  const hide = () => { tip.style.display = 'none'; const cx = $('#cx'), cd = $('#cdot'); if (cx) cx.setAttribute('opacity', '0'); if (cd) cd.setAttribute('opacity', '0'); };
  svg.addEventListener('pointermove', show); svg.addEventListener('pointerdown', show); svg.addEventListener('pointerleave', hide);
}

/* ----- Thành tựu ----- */
function achProgress(a, D) { let v = 0; try { v = achMetric(a.kind, D); } catch (e) { } return [Math.min(v, a.n), a.n]; }
const fmtProg = (a, [v, n]) => a.kind === 'kg' ? `${fkg(v)}/${n}` : `${Math.floor(v)}/${n}`;
function viewBadges(D) {
  const got = ACH.filter(a => state.ach[a.id]).length;
  const todo = ACH.filter(a => !state.ach[a.id]).map(a => ({ a, p: achProgress(a, D) })).sort((x, y) => (y.p[0] / y.p[1]) - (x.p[0] / x.p[1]));
  let h = `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Thành tựu</div><div class="date">Cứ vài ngày lại có huy hiệu mới, mỗi cái kèm xu và thịt</div></div></section>
  <div class="card bsum"><div class="big tout">${got}<span class="sub" style="font-size:20px;text-shadow:none">/${ACH.length}</span></div><div style="flex:1"><div class="bar"><i style="width:${got / ACH.length * 100}%"></i></div>
    <div class="sub tierline">${TIER.map((t, i) => `<span><i style="background:${t.b}"></i>${t.n} ${rwHTML(ECON.tier[i].meat, ECON.tier[i].coin)}</span>`).join('')}</div></div></div>`;
  if (todo.length) h += `<div class="card soon"><h3 class="h3">Sắp đạt</h3>${todo.slice(0, 3).map(({ a, p }) => `<button class="soon-row" data-act="ach" data-id="${a.id}"><span class="soon-b">${badgeSVG(a, false)}</span><span class="soon-t"><b>${esc(a.name)}</b><span class="sub">${esc(a.d)}</span><span class="minibar"><i style="width:${p[0] / p[1] * 100}%"></i></span></span><span class="soon-n">${fmtProg(a, p)}</span></button>`).join('')}</div>`;
  h += `<div class="card" style="margin-top:14px"><div class="bgrid">`;
  ACH.forEach(a => {
    const ok = !!state.ach[a.id];
    h += `<button class="bcell ${ok ? 'got' : 'locked'}" data-act="ach" data-id="${a.id}">${badgeSVG(a, ok)}<span class="bn">${esc(a.name)}</span><span class="bp">${ok ? TIER[a.t].n : fmtProg(a, achProgress(a, D))}</span></button>`;
  });
  return h + `</div></div>`;
}
function openAch(id) {
  const a = ACH.find(x => x.id === id), D = derive(), ok = !!state.ach[id], rw = ECON.tier[a.t];
  openModal(`<h2>${esc(a.name)}</h2><div style="display:flex;justify-content:center"><div style="width:130px">${badgeSVG(a, ok)}</div></div>
    <p style="text-align:center;font-weight:700">${esc(a.d)}</p>
    <p style="text-align:center" class="sub">Huy hiệu ${TIER[a.t].n.toLowerCase()} · thưởng ${rwHTML(rw.meat, rw.coin)}</p>
    <p style="text-align:center">${ok ? `Đạt ngày ${fmtDM(ymd(new Date(state.ach[id])))}` : `Tiến độ: <b>${fmtProg(a, achProgress(a, D))}</b>`}</p>`);
}

/* ===================== HÀNH ĐỘNG ===================== */
function toggleItem(k) {
  const D = derive(), ds = ui.back ? D.Y : D.T;
  // Ngày đã chốt: mục chính khóa, mục phụ vẫn tích được (để đủ hết mục, mở lượt quay)
  const it = itemsFor(ds).find(x => x.k === k);
  if (!it || (isCommitted(ds) && it.main)) return;
  if (isCommitted(ds) && state.gacha.days[ds]) return;
  const day = getDay(ds);
  day.it[k] = day.it[k] === true || day.it[k] === 'skip' ? false : true;
  const rw = day.it[k] ? rewardItem(ds, k) : null;
  const nb = checkAch();
  persist(); ui.pop = '#chk-' + k; render(); announceAch(nb);
  if (rw) floatReward('#chk-' + k, rw[0], rw[1]);
  if (day.it[k]) buzz(12);
  const left = itemsFor(ds).filter(x => x.main && !itemDone(ds, x.k)).length;
  if (day.it[k] && left === 0) { const b = $('.btn-commit') || $('.gx-today.ready'); if (b) b.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); }
}
function floatReward(sel, m, c) {
  const b = $(sel); if (!b) return;
  const r = b.getBoundingClientRect(), f = document.createElement('div');
  f.className = 'floatrw'; f.innerHTML = rwHTML(m, c);
  f.style.left = (r.left + r.width / 2) + 'px'; f.style.top = (r.top - 4) + 'px';
  document.body.appendChild(f); setTimeout(() => f.remove(), 1100);
}
function saveWeight(ds, inputId) {
  const inp = document.getElementById(inputId || 'w-' + ds); if (!inp) return;
  const raw = inp.value.trim().replace(',', '.');
  if (!raw) { toast('Nhập số cân trước, ví dụ 94,2'); return; }
  const v = Math.round(parseFloat(raw) * 10) / 10;
  if (!(v >= 40 && v <= 200)) { toast('Số cân phải nằm trong khoảng 40–200 kg'); return; }
  state.w[ds] = v;
  const D0 = derive(), rw = diff(state.startDate, ds) >= 0 && (ds === D0.T || ds === D0.Y) ? rewardItem(ds, 'weigh') : null;
  const nb = checkAch(); persist(); render(); announceAch(nb);
  toast(`Đã lưu ${fkg(v)} kg${rw ? ' · ' + rwHTML(rw[0], rw[1]) : ''}`);
}
function commitDay() {
  const before = derive(), ds = ui.back ? before.Y : before.T;
  if (isCommitted(ds) || diff(state.startDate, ds) < 0) return;
  if (itemsFor(ds).some(x => x.main && !itemDone(ds, x.k))) return;
  const day = getDay(ds); day.done = Date.now();
  const R = state.rw[ds] = state.rw[ds] || {};
  const rewards = [];
  if (!R.c) { const cm = ECON.commit.meat * meatMult(ds); R.c = 1; state.food += cm; state.coins += ECON.commit.coin; rewards.push(rwHTML(cm, ECON.commit.coin)); }
  const after = derive();
  const log = after.commitLog.find(c => c.ds === ds);
  if (log) {
    const b = ECON.streak[log.streak], key = 's2:' + log.runStart + ':' + log.streak;
    if (b && !state.bonus[key]) { state.bonus[key] = 1; state.food += b.meat; state.coins += b.coin; rewards.push(`Chuỗi ${log.streak}: ${rwHTML(b.meat, b.coin)}`); }
    if (log.comeback && !state.bonus['cb:' + ds]) { state.bonus['cb:' + ds] = 1; state.food += ECON.comeback.meat; state.coins += ECON.comeback.coin; rewards.push(`Quay lại: ${rwHTML(ECON.comeback.meat, ECON.comeback.coin)}`); }
  }
  const newPets = syncPets(after);
  const nb = checkAch(after);
  persist();
  const wasBack = ui.back; ui.back = false;
  render();
  celebrate({ dayNum: diff(state.startDate, ds) + 1, back: wasBack, streak: after.streak, rewards, newPets, badges: nb, first: before.total === 0, spin: spinStatus(ds).ok, spinLeft: spinStatus(ds).left.length });
}
function feedPet(id, n) {
  const p = PET_BY[id], st = state.pets[id]; if (!st || st.f >= 4 || state.food < 1) return;
  const need = costOf(id, st.f) - st.m; if (need <= 0) return;
  const amt = Math.min(state.food, need, n === 'all' ? need : 5);
  state.food -= amt; st.m += amt;
  persist(); renderTop(derive()); renderPetView();
  const big = $('#pv-pet'); if (big) { big.classList.remove('munch'); void big.offsetWidth; big.classList.add('munch'); }
  buzz(10);
}
function evolvePet(id) {
  const p = PET_BY[id], st = state.pets[id]; if (!st || st.f >= 4) return;
  const cost = costOf(id, st.f); if (st.m < cost) return;
  const from = st.f; st.f++; st.m = 0;
  const nb = checkAch(); persist();
  evoAnim(id, from, st.f, nb);
}
function evoAnim(id, from, to, nb) {
  const p = PET_BY[id], st = state.pets[id], E = ELEMENTS[p.el];
  const c = document.createElement('div'); c.className = 'evo'; c.id = 'evo';
  c.style.setProperty('--e1', E.bg[0]); c.style.setProperty('--e2', E.bg[1]);
  c.innerHTML = `<div class="rays"></div><div class="evo-flash"></div><h2 class="tout">Tiến hóa!</h2>
    <div class="evo-pet charging" id="evo-pet">${petSVG(id, from, { eq: st.eq })}</div>
    <div class="evo-name tout" id="evo-name">${esc(p.name)} đang lớn…</div><div class="evo-sub" id="evo-sub"></div>
    <button class="btn" data-act="evo-close" id="evo-btn" style="visibility:hidden">Ngầu!</button>`;
  document.body.appendChild(c); flushCel(); buzz([20, 40, 20, 40]);
  const T = reduced() ? 60 : 1500;
  setTimeout(() => {
    const e = $('#evo-pet'); if (!e) return;
    c.classList.add('flashed');
    e.className = 'evo-pet popin'; e.innerHTML = petSVG(id, to, { eq: st.eq }); flushCel();
    $('#evo-name').textContent = `${p.name} lên dạng ${to}!`;
    $('#evo-sub').textContent = `${FORM_NAME[to]}${to === 4 ? ' · mạnh nhất rồi' : ''}`;
    $('#evo-btn').style.visibility = 'visible'; $('#evo-btn').focus({ preventScroll: true });
    fx.burst(140); buzz([30, 50, 90]);
    announceAch(nb);
  }, T);
}
function buyItem(id) {
  const x = SHOP_BY[id]; if (!x || x.gacha || owned(id) || state.coins < x.p) return;
  state.coins -= x.p;
  let msg = `Đã mua ${esc(x.n)}`;
  if (x.cat === 'decor') { state.decor[id] = { on: 1 }; msg += ' và đặt vào trại'; }
  else { state.own[id] = 1; const pid = curPetId(); if (pid) { state.pets[pid].eq[x.slot] = id; msg += ` và mặc cho ${esc(PET_BY[pid].name)}`; } }
  const nb = checkAch(); persist(); render(); announceAch(nb);
  toast(msg); buzz(15); fx.burst(50);
}
function equip(pid, slot, id) {
  const st = state.pets[pid]; if (!st || !owned(id)) return;
  st.eq[slot] = st.eq[slot] === id ? null : id;
  if (!st.eq[slot]) delete st.eq[slot];
  persist();
  if (ui.pet) renderPetView(); if (ui.tab === 'pets') { const keep = window.scrollY; render(); window.scrollTo(0, keep); }
}

/* ----- Modal ----- */
function openModal(html) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><button class="icon-btn x" data-act="close" aria-label="Đóng">${ic('close')}</button>${html}</div>`;
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
  document.body.appendChild(m); flushCel();
  const f = m.querySelector('.x'); if (f) f.focus({ preventScroll: true });
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); }
function openEx(id, sr, rest) {
  const E = EX[id]; if (!E) return;
  openModal(`<h2>${esc(E[0])}</h2><div class="ex-big">${exSVG(id)}</div>${sr || rest ? `<p class="ex-big-sr">${sr ? `<b>${esc(sr)}</b>` : ''}${rest ? ` · nghỉ ${esc(rest)}` : ''}</p>` : ''}<div class="box plain"><b>Lưu ý form:</b> ${esc(E[1])}</div>`);
}
function openHelp() {
  const D = derive(), ds = ui.back ? D.Y : D.T, I = dayInfo(ds), day = state.days[ds] || { it: {} }, done = isCommitted(ds);
  const canSkip = I.heavy && !done && day.it && day.it.heavy !== true && day.it.heavy !== 'skip';
  const foodOn = day.brake && day.brake.food;
  openModal(`<h2>Hôm nay thấy không ổn?</h2>
    <div class="bubble" style="margin:6px 0 4px 12px">${esc(Q_TIRED[(hash(ds) + ui.qShift) % Q_TIRED.length])}</div>
    <div class="box orange"><h3 style="margin-top:0">Phanh lại</h3><p>Gặp một trong các dấu hiệu dưới đây thì ăn thêm 200–300 kcal (khoảng 150–230 g cơm chín) hoặc bỏ 1 buổi cardio nặng:</p>
      <ul><li>Mức tạ bài chính tụt hơn 15% hai tuần liền</li><li>Mất ngủ</li><li>Mệt hoặc cáu gắt kéo dài</li><li>Chuột rút nhiều</li></ul>
      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">
        ${canSkip ? `<button class="btn sm" data-act="brake-heavy">Bỏ cardio nặng hôm nay</button>` : ''}
        ${!done ? `<button class="btn sm ${foodOn ? 'green' : ''}" data-act="brake-food">${foodOn ? 'Đang ăn thêm cơm' : 'Ăn thêm cơm hôm nay'}</button>` : ''}
      </div>${!I.heavy ? '<p class="sub" style="margin-top:6px">Hôm nay không có cardio nặng.</p>' : ''}</div>
    <div class="box red"><h3 style="margin-top:0">Dừng tập và đi khám nếu</h3><ul><li>Choáng hoặc ngất</li><li>Tim đập nhanh bất thường lúc nghỉ</li><li>Đau bụng trên bên phải, hoặc đau bụng sau khi ăn</li></ul></div>
    <div class="box blue"><h3 style="margin-top:0">Phương án lùi</h3><p>Quá sức thì quay về chế độ thường: ngày tập ~2.050 kcal, ngày nghỉ ~1.870 kcal. Không ngày nào dưới 1.300 kcal.</p>
      <p>Sau tuần 6 mà thấy không kịp 25 kg: giữ sàn 1.300 kcal, kéo dài thêm 2–3 tuần thay vì ăn ít hơn. Đuối sức hoặc cân chững thì làm ngày ăn nhiều sớm hơn, cách lần trước 10 ngày. Đau khớp thì bỏ Push B hoặc Legs B tuần đó.</p></div>
    <p class="sub">Xét nghiệm máu trước khi bắt đầu và quanh tuần 6. Có bệnh nền hoặc đang dùng thuốc thì hỏi bác sĩ trước.</p>`);
}
function openSettings() {
  const st = store.status === 'err'
    ? 'Không ghi được vào bộ nhớ máy (có thể do chế độ ẩn danh hoặc máy hết dung lượng). Tải file sao lưu ngay để không mất dữ liệu.'
    : 'Dữ liệu lưu ngay trên máy này, không cần mạng, không cần tài khoản. ' + (store.persisted ? 'Trình duyệt đã cho phép lưu lâu dài.' : 'Xóa dữ liệu trình duyệt, gỡ app hay đổi máy là mất, nên tải file sao lưu thường xuyên.');
  const lb = meta.lastBackup ? `Sao lưu gần nhất: ${fmtFull(ymd(new Date(meta.lastBackup)))}.` : 'Chưa sao lưu lần nào.';
  const sa = isStandalone();
  openModal(`<h2>Cài đặt</h2>
    <div class="field"><label for="set-start">Ngày bắt đầu (ngày 1)</label><div class="row"><input id="set-start" class="num-in" type="date" value="${state.startDate}" style="font-size:17px"><button class="btn" data-act="set-start">Lưu</button></div>
      <span class="sub">Tuần và lịch tập tính từ ngày này, theo thứ thật trong tuần.</span></div>
    <div class="field"><label for="set-w0">Cân ban đầu (kg)</label><div class="row"><input id="set-w0" class="num-in" type="text" inputmode="decimal" value="${fkg(state.startWeight)}"><button class="btn" data-act="set-w0">Lưu</button></div></div>
    <h3>Dữ liệu &amp; sao lưu</h3><p class="sub" style="margin:0"><span class="sync ${store.status === 'ok' ? 'ok' : store.status === 'wait' ? 'wait' : ''}"></span> ${st}</p>
    <p class="sub" style="margin:6px 0 0">${lb}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn sm" data-act="bk-file">${ic('download', 'i-btn')} Tải file sao lưu</button><button class="btn sm blue" data-act="export">Sao chép bản sao lưu</button><button class="btn sm ghost" data-act="import-show">Khôi phục từ bản sao lưu</button></div>
    <div id="bk"></div>
    <label class="tgl"><input type="checkbox" id="set-remind" data-act="remind" ${meta.remind ? 'checked' : ''}> <span>Nhắc sao lưu mỗi ${BACKUP_EVERY} ngày</span></label>
    <h3>Cài ra màn hình chính</h3>
    ${sa ? `<p class="sub" style="margin:0">${ic('check', 'i-in')} Đang chạy như app trên màn hình chính.</p>` : `<p class="sub" style="margin:0">iPhone: mở trang này trong Safari → nút Chia sẻ → Thêm vào MH chính. Android: Chrome → menu ba chấm → Thêm vào màn hình chính (hoặc Cài đặt ứng dụng).</p>${window.__bip ? `<button class="btn sm green" style="margin-top:8px" data-act="install">${ic('phone', 'i-btn')} Cài app</button>` : ''}`}
    <h3>Cập nhật</h3><p class="sub" style="margin:0">Phiên bản <b id="app-ver">…</b>. Khi có bản mới, app hiện thông báo nhỏ ở cuối màn hình.</p>
    ${'serviceWorker' in navigator ? `<button class="btn sm ghost" style="margin-top:8px" data-act="check-upd">Kiểm tra bản mới</button>` : ''}
    <h3>Xóa dữ liệu</h3><div id="rst"><button class="btn sm red" data-act="reset-ask">Xóa toàn bộ dữ liệu</button></div>
    <p class="sub" style="margin-top:14px">Hành trình −25kg · ${PLAN_DAYS} ngày · ${PETS.length} pet + ${EPICS.length} Sử thi × 4 dạng · ${ACH.length} thành tựu · ${SHOP.length + GITEMS.length} món đồ</p>`);
  appVersion().then(v => { const el = $('#app-ver'); if (el) el.textContent = v; });
}
const isStandalone = () => { try { return matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true; } catch (e) { return false; } };
async function appVersion() {
  try { if (window.caches) { const k = (await caches.keys()).find(x => x.startsWith('hanh-trinh-25kg-')); if (k) return k.slice('hanh-trinh-25kg-'.length); } } catch (e) { }
  return 'chưa cài offline';
}

/* ----- Sao lưu & khôi phục (đọc được cả file của bản cũ) ----- */
const backupName = () => `hanh-trinh-25kg-${todayStr()}.json`;
function markBackup() { meta.lastBackup = Date.now(); meta.snooze = 0; saveMeta(); if (ui.tab === 'today' && !$('#modal')) render(); }
const isIOS = () => /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
async function downloadBackup() {
  const json = JSON.stringify(state), name = backupName();
  let file = null; try { file = new File([json], name, { type: 'application/json' }); } catch (e) { }
  if (isIOS() && file && navigator.canShare && navigator.share) {
    let ok = false; try { ok = navigator.canShare({ files: [file] }); } catch (e) { }
    if (ok) {
      try { await navigator.share({ files: [file], title: name }); markBackup(); toast('Đã lưu bản sao lưu'); return; }
      catch (e) { if (e && e.name === 'AbortError') return; }
    }
  }
  try {
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.rel = 'noopener'; a.style.display = 'none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    markBackup(); toast('Đã tải file ' + esc(name));
  } catch (e) { toast('Không tải được file, dùng nút Sao chép bản sao lưu'); }
}
function parseBackup(txt) {
  if (typeof txt !== 'string') return null;
  const t = txt.replace(/^﻿/, '').trim();
  const tryParse = x => {
    try { let o = JSON.parse(x); if (typeof o === 'string') o = JSON.parse(o); if (o && typeof o === 'object' && typeof o.s === 'string') o = JSON.parse(o.s); return o; }
    catch (e) { return null; }
  };
  let o = tryParse(t);
  if (!o) { const i = t.indexOf('{'), j = t.lastIndexOf('}'); if (i >= 0 && j > i) { const c = t.slice(i, j + 1); o = tryParse(c) || tryParse(c.replace(/[“”„‟″]/g, '"')); } }
  if (!o || typeof o !== 'object' || Array.isArray(o) || !o.days || typeof o.days !== 'object' || Array.isArray(o.days)) return null;
  return o;
}
function askImport(o) {
  window.__imp = o;
  const keep = state, m = migrate(JSON.parse(JSON.stringify(o))); state = keep;
  const nd = Object.values(m.days).filter(d => d && d.done).length, nw = Object.keys(m.w).length, np = Object.keys(m.pets).length;
  $('#im-act').innerHTML = `<div class="box plain" style="margin-top:8px">Bản sao lưu${o.v >= 2 ? '' : ' (bản cũ, sẽ chuyển sang bản mới)'}: bắt đầu ${fmtDM(m.startDate)}/${m.startDate.slice(0, 4)} · ${nd} ngày đã chốt · ${nw} lần cân · ${np} pet · ${m.coins} xu · ${m.food} thịt</div>
    <p style="font-weight:800">Ghi đè toàn bộ dữ liệu hiện tại bằng bản này?</p><button class="btn sm red" data-act="import-do">Ghi đè</button> <button class="btn sm ghost" data-act="close">Thôi</button>`;
}
function nudgeHTML() {
  if (!meta.remind) return '';
  const now = Date.now(), ref = meta.lastBackup || meta.since || now;
  if (now - ref < BACKUP_EVERY * DAY_MS || now < (meta.snooze || 0)) return '';
  if (!Object.values(state.days).some(d => d && d.done) && !Object.keys(state.w).length) return '';
  const n = Math.floor((now - ref) / DAY_MS);
  return `<div class="nudge" id="nudge"><div class="nudge-t">${ic('download', 'i-in')} ${meta.lastBackup ? `Đã ${n} ngày chưa sao lưu.` : 'Bạn chưa sao lưu lần nào.'} Tải file sao lưu để đổi máy hay lỡ xóa trình duyệt vẫn còn dữ liệu.</div>
    <div class="nudge-b"><button class="btn sm" data-act="bk-file">Tải file sao lưu</button><button class="btn sm ghost" data-act="nudge-later">Để mai</button><button class="lnk" data-act="nudge-off">Tắt nhắc</button></div></div>`;
}
function openDay(ds) {
  const D = derive(), I = dayInfo(ds);
  let status = isCommitted(ds) ? `${ic('check', 'i-in')} Đã chốt` : D.shieldDays[ds] ? `${ic('shield', 'i-in')} Khiên đã đỡ ngày này` : D.missDays[ds] ? 'Bỏ lỡ. Không sao, chiến tiếp.' : ds === D.T ? 'Hôm nay' : ds === D.Y && I.idx >= 0 ? 'Chưa chốt, còn kịp chốt bù' : ds > D.T ? 'Chưa tới' : 'Ngoài kế hoạch';
  const items = I.idx >= 0 ? itemsFor(ds) : [];
  openModal(`<h2>${fmtFull(ds)}</h2>
    ${I.idx >= 0 ? `<p><span class="pill">${I.idx < PLAN_DAYS ? `Ngày ${I.idx + 1} · Tuần ${I.week}` : `Ngày ${I.idx + 1}`}</span> <span class="pill ${I.cls}">${I.type}${I.train ? ' · ' + I.session.code : ''}</span></p>` : '<p class="sub">Trước ngày bắt đầu.</p>'}
    <p style="font-weight:800">${status}</p>
    ${state.w[ds] != null ? `<p>Cân: <b>${fkg(state.w[ds])} kg</b></p>` : ''}
    ${items.length && ds <= D.T ? `<div class="box plain daylist">${items.map(x => `<div class="${itemDone(ds, x.k) ? 'ok' : ''}">${ic(x.ic, 'i-in')} ${esc(x.t)}${itemDone(ds, x.k) ? ic('check', 'i-in') : ''}</div>`).join('')}</div>` : ''}
    ${items.length && ds > D.T ? `<div class="box plain daylist">${items.filter(x => x.main).map(x => `<div>${ic(x.ic, 'i-in')} ${esc(x.t)}</div>`).join('')}</div>` : ''}
    ${ds === D.Y && !isCommitted(ds) && I.idx >= 0 && !D.shieldDays[ds] ? `<button class="btn block" style="margin-top:12px" data-act="back-on">Chốt bù hôm qua</button>` : ''}
    ${ds === D.T ? `<button class="btn block" style="margin-top:12px" data-act="nav" data-tab="today">Mở Hôm nay</button>` : ''}`);
}

/* ----- Ăn mừng chốt ngày ----- */
function celebrate(o) {
  const c = document.createElement('div'); c.className = 'cele'; c.id = 'cele';
  const np = o.newPets[o.newPets.length - 1];
  const lp = !np ? curPetId() : null;
  c.innerHTML = `<div class="rays"></div>
    <h2 class="tout">${o.back ? 'Đã chốt bù' : 'Đã chốt'} ngày ${o.dayNum}!</h2>
    <div class="cs tout-s">${o.streak ? `${ic('fire', 'i-in')} Chuỗi ${o.streak} ngày` : ''}</div>
    <div class="rew">${o.rewards.map((r, i) => `<span style="animation-delay:${.15 + i * .12}s">${r}</span>`).join('')}</div>
    ${np ? `<div class="newpet ${o.first ? 'hatch' : 'popin'}" id="np">${o.first ? eggSVG() : petSVG(np.id, 1)}</div><div class="np-name tout" id="npn">${o.first ? 'Trứng đang nứt…' : `Pet mới: ${esc(np.name)}!`}</div><div class="sub" style="color:#fff">${o.first ? '' : `<span class="tag-el" style="background:${ELEMENTS[np.el].c}">${ELEMENTS[np.el].n}</span> <span class="tag-el" style="background:${RARITY[np.rar].c}">${RARITY[np.rar].n}</span> · quà nở ${M_(hatchGift(np.i))}`}</div>` : ''}
    ${lp ? `<div class="newpet popin" style="width:150px">${petSVG(lp, state.pets[lp].f, { eq: state.pets[lp].eq })}</div><div class="cs tout-s">${esc(PET_BY[lp].name)} đang chờ được cho ăn</div>` : ''}
    ${Q_STREAK[o.streak] ? `<div class="bubble" style="max-width:320px">${esc(Q_STREAK[o.streak])}</div>` : ''}
    ${o.badges.length ? `<div class="rew small">${o.badges.map(a => `<span>${ic(ACH_GLYPH[a.kind] || 'star', 'i-in')} ${esc(a.name)}</span>`).join('')}</div>` : ''}
    ${o.spin ? `<button class="btn gx-go" data-act="cele-spin">${ic('wheel', 'i-btn')} Quay thưởng ngay</button>` : o.spinLeft ? `<div class="sub" style="color:#fff">Tích nốt ${o.spinLeft} mục phụ là mở lượt quay Sử thi.</div>` : ''}
    <button class="btn ${o.spin ? 'ghost' : ''}" data-act="cele-close">${np ? 'Xem pet' : 'Ngon!'}</button>`;
  document.body.appendChild(c); flushCel();
  c.querySelector('.btn').focus({ preventScroll: true });
  buzz([30, 50, 90]); fx.burst(160);
  if (np && o.first) setTimeout(() => {
    const e = $('#np'), n = $('#npn'); if (!e) return;
    e.className = 'newpet popin'; e.innerHTML = petSVG(np.id, 1); flushCel();
    n.textContent = `Nở rồi: ${np.name}!`; fx.burst(90); buzz([20, 30, 60]);
  }, reduced() ? 50 : 1400);
  c.dataset.goPet = np ? np.id : '';
}

/* ----- Hiệu ứng ----- */
function buzz(p) { try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) { } }
function toast(html, ms = 2600) {
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; t.setAttribute('role', 'status');
  $('#toasts').appendChild(t); setTimeout(() => t.remove(), ms);
}
const fx = {
  parts: [], raf: 0,
  burst(n = 120) {
    if (reduced()) return;
    const cv = $('#fx'), dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = ['#ffd21f', '#3fe06a', '#33e1ff', '#ff4d6a', '#8a5cff', '#ff8a1f', '#ffffff'];
    for (let i = 0; i < n; i++) this.parts.push({ x: innerWidth / 2 + (Math.random() - .5) * 60, y: innerHeight * .4, vx: (Math.random() - .5) * 15, vy: -Math.random() * 15 - 5, r: Math.random() * 6, vr: (Math.random() - .5) * .35, s: 7 + Math.random() * 8, c: cols[i % cols.length], star: Math.random() < .35, t: 0 });
    if (this.raf) return;
    const step = () => {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      this.parts = this.parts.filter(p => p.t < 170 && p.y < innerHeight + 40);
      this.parts.forEach(p => {
        p.t++; p.vy += .42; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, (170 - p.t) / 40);
        ctx.fillStyle = p.c; ctx.strokeStyle = '#140a30'; ctx.lineWidth = 2;
        ctx.beginPath();
        if (p.star) { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? p.s * .42 : p.s; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); }
        else ctx.rect(-p.s / 2, -p.s / 3.4, p.s, p.s / 1.7);
        ctx.fill(); ctx.stroke(); ctx.restore();
      });
      if (this.parts.length) this.raf = requestAnimationFrame(step); else { this.raf = 0; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    };
    this.raf = requestAnimationFrame(step);
  }
};

/* ===================== SỰ KIỆN ===================== */
function go(tab) {
  if (!TABS.includes(tab)) tab = 'today';
  ui.tab = tab; closeModal(); closeGacha(); if (ui.pet) { const el = $('#petview'); if (el) el.remove(); ui.pet = null; }
  try { if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab); } catch (e) { }
  render(); window.scrollTo(0, 0);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (b.classList.contains('btn') || b.classList.contains('opt') || b.classList.contains('pcard') || b.classList.contains('wd-item')) { b.classList.remove('bounce'); void b.offsetWidth; b.classList.add('bounce'); }
  switch (a) {
    case 'nav': go(b.dataset.tab); break;
    case 'toggle': toggleItem(b.dataset.k); break;
    case 'expand': ui.open[b.dataset.k] = !ui.open[b.dataset.k]; render(); break;
    case 'lc': case 'hc': { const D = derive(), ds = ui.back ? D.Y : D.T; if (isCommitted(ds)) break; getDay(ds)[a] = b.dataset.id; persist(); render(); break; }
    case 'unskip': { const D = derive(), ds = ui.back ? D.Y : D.T; getDay(ds).it.heavy = false; persist(); render(); break; }
    case 'commit': commitDay(); break;
    case 'qnext': ui.qShift++; { const D = derive(), q = $('#qtext'); if (q) { q.textContent = quoteFor(ui.back ? D.Y : D.T, D); q.classList.remove('bounce'); void q.offsetWidth; q.classList.add('bounce'); } } break;
    case 'go-pet': { const id = curPetId(); if (id) openPet(id); else go('pets'); break; }
    case 'back-on': ui.back = true; ui.open = {}; go('today'); break;
    case 'back-off': ui.back = false; ui.open = {}; render(); window.scrollTo(0, 0); break;
    case 'help': openHelp(); break;
    case 'brake-heavy': { const D = derive(), ds = ui.back ? D.Y : D.T, d = getDay(ds); d.it.heavy = 'skip'; d.brake = Object.assign({}, d.brake, { heavy: 1 }); persist(); closeModal(); render(); toast('Đã bỏ cardio nặng hôm nay. Nghỉ cho đúng nhé.'); break; }
    case 'brake-food': { const D = derive(), ds = ui.back ? D.Y : D.T, d = getDay(ds); const on = !(d.brake && d.brake.food); d.brake = Object.assign({}, d.brake, { food: on ? 1 : 0 }); persist(); render(); openHelp(); if (on) toast('Đã ghi: hôm nay ăn thêm 150–230 g cơm'); break; }
    case 'exzoom': openEx(b.dataset.id, b.dataset.sr, b.dataset.rest); break;
    case 'settings': openSettings(); break;
    case 'close': closeModal(); break;
    case 'cele-close': { const c = $('#cele'), id = c && c.dataset.goPet; if (c) c.remove(); if (id) { go('pets'); openPet(id); } break; }
    case 'cele-spin': { const c = $('#cele'); if (c) c.remove(); ui.petView = 'gacha'; go('pets'); break; }
    case 'gx-open': closeModal(); ui.petView = 'gacha'; go('pets'); break;
    case 'spin': runSpin(b.dataset.date); break;
    case 'gx-close': closeGacha(); render(); break;
    case 'gx-see': { const id = b.dataset.id; closeGacha(); ui.petView = 'camp'; go('pets'); openPet(id); break; }
    case 'gx-wear': { const st = state.pets[b.dataset.pet], it = SHOP_BY[b.dataset.id]; if (st && it && owned(it.id)) { st.eq[it.slot] = it.id; persist(); closeGacha(); render(); toast(`Đã mặc ${esc(it.n)} cho ${esc(PET_BY[b.dataset.pet].name)}`); } break; }
    case 'gx-goday': { const D = derive(); ui.back = b.dataset.date === D.Y; ui.open = {}; go('today'); break; }
    case 'evo-close': { const c = $('#evo'); if (c) c.remove(); render(); break; }
    case 'wsave': saveWeight(b.dataset.date, b.dataset.input); break;
    case 'wdel': delete state.w[b.dataset.date]; persist(); render(); toast('Đã xóa số cân ' + fmtDM(b.dataset.date)); break;
    case 'calprev': case 'calnext': { let [y, m] = ui.calMonth; m += a === 'calprev' ? -1 : 1; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } ui.calMonth = [y, m]; render(); break; }
    case 'calday': openDay(b.dataset.date); break;
    case 'pview': ui.petView = b.dataset.v; render(); break;
    case 'shopcat': ui.shopCat = b.dataset.c; render(); break;
    case 'to-shop': ui.petView = 'shop'; ui.shopCat = b.dataset.c || 'wear'; closePet(); go('pets'); break;
    case 'pet': openPet(b.dataset.id); break;
    case 'pet-close': closePet(); break;
    case 'feed': feedPet(b.dataset.id, b.dataset.n); break;
    case 'evolve': evolvePet(b.dataset.id); break;
    case 'slot': ui.slot = b.dataset.s; renderPetView(); break;
    case 'equip': equip(b.dataset.pet, b.dataset.slot, b.dataset.id); break;
    case 'buy': buyItem(b.dataset.id); break;
    case 'dtoggle': { const d = state.decor[b.dataset.id]; if (d) { d.on = d.on ? 0 : 1; persist(); render(); } break; }
    case 'ach': openAch(b.dataset.id); break;
    case 'start-today': state.startDate = todayStr(); persist(); render(); break;
    case 'set-start': { const v = $('#set-start').value; if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { state.startDate = v; ui.back = false; ui.calMonth = null; const nb = checkAch(); persist(); render(); announceAch(nb); toast('Đã đổi ngày bắt đầu sang ' + fmtDM(v)); closeModal(); } else toast('Chọn một ngày hợp lệ'); break; }
    case 'set-w0': { const v = parseFloat($('#set-w0').value.replace(',', '.')); if (v >= 40 && v <= 250) { state.startWeight = Math.round(v * 10) / 10; persist(); render(); toast('Đã lưu cân ban đầu ' + fkg(state.startWeight) + ' kg'); closeModal(); } else toast('Nhập cân từ 40 đến 250 kg'); break; }
    case 'bk-file': downloadBackup(); break;
    case 'export': {
      const json = JSON.stringify(state);
      $('#bk').innerHTML = `<p class="sub">Bản sao lưu (giữ ở Ghi chú hoặc gửi cho chính mình):</p><textarea class="txt" id="bk-txt" readonly>${esc(json)}</textarea>`;
      const ta = $('#bk-txt');
      const fallback = () => { ta.focus(); ta.select(); markBackup(); toast('Đã chọn hết, bấm Sao chép trên bàn phím'); };
      try { navigator.clipboard.writeText(json).then(() => { markBackup(); toast('Đã sao chép bản sao lưu'); }, fallback); } catch (er) { fallback(); }
      break;
    }
    case 'import-show': $('#bk').innerHTML = `<p class="sub">Chọn file .json đã tải, hoặc dán bản sao lưu (kể cả bản của app cũ):</p>
      <button class="btn sm blue" data-act="import-file">${ic('folder', 'i-btn')} Chọn file sao lưu</button><input type="file" id="im-file" hidden>
      <textarea class="txt" id="im-txt" style="margin-top:8px" placeholder='{"v":2,...}'></textarea><div id="im-act" style="margin-top:8px"><button class="btn sm" data-act="import-ask">Khôi phục từ chữ đã dán</button></div>`; break;
    case 'import-file': { const f = $('#im-file'); if (f) f.click(); break; }
    case 'import-ask': { const o = parseBackup($('#im-txt').value); if (!o) { toast('Bản sao lưu không đúng định dạng'); break; } askImport(o); break; }
    case 'import-do': if (window.__imp) { state = migrate(window.__imp); window.__imp = null; ui.back = false; ui.calMonth = null; const nb = checkAch(); persist(); store.now(); closeModal(); render(); toast('Đã khôi phục dữ liệu'); announceAch(nb); } break;
    case 'remind': meta.remind = !!b.checked; meta.snooze = 0; saveMeta(); toast(meta.remind ? `Sẽ nhắc sao lưu mỗi ${BACKUP_EVERY} ngày` : 'Đã tắt nhắc sao lưu'); break;
    case 'nudge-later': meta.snooze = Date.now() + DAY_MS; saveMeta(); render(); break;
    case 'nudge-off': meta.remind = false; saveMeta(); render(); toast('Đã tắt nhắc. Bật lại trong Cài đặt'); break;
    case 'install': { const p = window.__bip; if (p) { window.__bip = null; p.prompt(); p.userChoice.then(r => { if (r && r.outcome === 'accepted') { closeModal(); toast('Đã cài app ra màn hình chính'); } }).catch(() => { }); } break; }
    case 'check-upd': if (window.pwaCheckUpdate) window.pwaCheckUpdate(true); break;
    case 'reset-ask': $('#rst').innerHTML = `<p style="font-weight:800">Xóa hết ngày đã chốt, số cân, pet, xu và thành tựu? Không hoàn tác được.</p><button class="btn sm red" data-act="reset-do">Xóa hết</button> <button class="btn sm ghost" data-act="reset-no">Thôi</button>`; break;
    case 'reset-no': $('#rst').innerHTML = `<button class="btn sm red" data-act="reset-ask">Xóa toàn bộ dữ liệu</button>`; break;
    case 'reset-do': state = blank(); ui.back = false; persist(); store.now(); closeModal(); go('today'); toast('Đã xóa dữ liệu. Bắt đầu lại từ ngày 1.'); break;
  }
});
document.addEventListener('change', e => {
  const f = e.target;
  if (!f || f.id !== 'im-file' || !f.files || !f.files[0]) return;
  const file = f.files[0];
  if (file.size > 5e6) { toast('File quá lớn, không phải bản sao lưu'); f.value = ''; return; }
  const done = txt => { f.value = ''; const o = parseBackup(txt); if (!o) { toast('File này không phải bản sao lưu hợp lệ'); return; } askImport(o); };
  if (file.text) file.text().then(done, () => toast('Không đọc được file'));
  else { const r = new FileReader(); r.onload = () => done(String(r.result || '')); r.onerror = () => toast('Không đọc được file'); r.readAsText(file); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if ($('#gres') || $('#epic-rev')) { closeGacha(); render(); } else if ($('#modal')) closeModal(); else if ($('#evo')) { $('#evo').remove(); render(); } else if (ui.pet) closePet(); const c = $('#cele'); if (c) c.remove(); }
  if (e.key === 'Enter' && e.target && e.target.dataset && e.target.dataset.wdate) { e.preventDefault(); saveWeight(e.target.dataset.wdate, e.target.id); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('scene-pet')) { e.preventDefault(); const id = e.target.dataset.pet; if (id !== 'egg') openPet(id); }
});
document.addEventListener('click', e => {
  const g = e.target.closest && e.target.closest('.scene-pet'); if (!g) return;
  const id = g.dataset.pet;
  if (id === 'egg') { toast('Chốt ngày đầu tiên để nở trứng'); return; }
  openPet(id);
});
window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if (TABS.includes(t) && t !== ui.tab) { ui.tab = t; render(); window.scrollTo(0, 0); } });
let lastDay = todayStr();
setInterval(() => { if (todayStr() !== lastDay) { lastDay = todayStr(); ui.back = false; ui.qShift = 0; render(); } }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && todayStr() !== lastDay) { lastDay = todayStr(); ui.back = false; render(); } });

/* ===================== KHỞI ĐỘNG ===================== */
document.getElementById('defs').innerHTML = `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>${baseDefs()}</defs></svg><svg id="celdefs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"></svg>`;
loadLocal();
{ const t = location.hash.slice(1); if (TABS.includes(t)) ui.tab = t; }
{ const D = derive(); const fresh = syncPets(D); const nb = checkAch(D); if (MIGRATED) persist(); else if (fresh.length || nb.length) saveLocal(); }
render();
store.init();
