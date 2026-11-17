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
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const $ = (q, r = document) => r.querySelector(q);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
const CHECK = `<svg viewBox="0 0 24 24"><path d="M4,12.5 L10,18 L20,6" fill="none" stroke="#140a30" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/* ===================== TRẠNG THÁI ===================== */
const LS_KEY = 'hanh-trinh-25kg-v1';
const blank = () => ({ v: 1, startDate: todayStr(), startWeight: 94.5, days: {}, w: {}, coins: 0, food: 0, pets: {}, decor: {}, badges: {}, bonus: {}, seen: {}, updatedAt: 0 });
let state = blank();
function migrate(o) {
  const s = Object.assign(blank(), o && typeof o === 'object' ? o : {});
  ['days', 'w', 'pets', 'decor', 'badges', 'bonus', 'seen'].forEach(k => { if (!s[k] || typeof s[k] !== 'object' || Array.isArray(s[k])) s[k] = {}; });
  if (typeof s.startWeight !== 'number' || !(s.startWeight > 30 && s.startWeight < 300)) s.startWeight = 94.5;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.startDate)) s.startDate = todayStr();
  s.coins = Math.max(0, Math.floor(+s.coins || 0)); s.food = Math.max(0, Math.floor(+s.food || 0)); s.updatedAt = +s.updatedAt || 0;
  return s;
}
/* ----- Lưu trên máy: localStorage là chính, IndexedDB là bản dự phòng ----- */
const META_KEY = 'hanh-trinh-25kg-meta';
const IDB_NAME = 'hanh-trinh-25kg', IDB_STORE = 'kv';
const DAY_MS = 864e5, BACKUP_EVERY = 7;
let loadedFromLS = false;
function loadLocal() { try { const raw = localStorage.getItem(LS_KEY); if (raw) { state = migrate(JSON.parse(raw)); loadedFromLS = true; } } catch (e) { } }
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
        state = o; saveLocal(); ui.back = false; render();
        if (!loadedFromLS) toast('Đã lấy lại dữ liệu từ bản dự phòng trên máy');
      } else if (!o || o.updatedAt < state.updatedAt) this.flush();
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
    try {
      const S = navigator.storage; if (!S) return;
      if (S.persisted) this.persisted = await S.persisted();
      if (!this.persisted && S.persist) this.persisted = await S.persist();
    } catch (e) { }
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
function itemsFor(ds) {
  const I = dayInfo(ds), day = state.days[ds] || { it: {} }, L = [];
  L.push({ k: 'weigh', ic: '⚖️', t: 'Cân buổi sáng', sub: 'Sau khi đi vệ sinh, trước khi ăn', main: false });
  if (I.train) {
    const sets = I.session.ex.reduce((a, e) => a + (I.deload ? Math.max(1, Math.round(e.s * 2 / 3)) : e.s), 0);
    L.push({ k: 'lift', ic: '🏋️', t: `Buổi tạ: ${I.session.code}`, sub: `Buổi ${I.session.tag} · ${I.session.ex.length} bài · ${sets} set${I.deload ? ' (tuần nhẹ)' : ''}`, main: true, panel: 'lift', more: 'Xem bài tập' });
  }
  if (I.abs) L.push({ k: 'abs', ic: '🧱', t: ABS[I.abs].code, sub: ABS[I.abs].ex.map(e => e.n).join(' + '), main: true, panel: 'abs', more: 'Xem bài bụng' });
  if (I.train) {
    const o = LIGHT_CARDIO.find(x => x.id === day.lc) || LIGHT_CARDIO[0];
    L.push({ k: 'light', ic: '🚶', t: 'Cardio nhẹ', sub: `${o.n} · ${o.d}`, main: true, panel: 'light', more: 'Đổi cách tập' });
  }
  if (I.heavy) {
    const o = HEAVY_CARDIO.find(x => x.id === day.hc) || HEAVY_CARDIO[0];
    L.push({ k: 'heavy', ic: '🔥', t: `Cardio nặng ${I.heavyDur}`, sub: day.it.heavy === 'skip' ? 'Hôm nay bỏ để phanh lại' : `${o.n} · khởi động 5 phút trước`, main: true, panel: 'heavy', more: 'Chọn bài & cách làm' });
  }
  L.push({ k: 'steps', ic: '👣', t: '15.000 bước', sub: 'Tính cả lúc đi bộ dốc. Thiếu thì đi 10–15 phút sau mỗi bữa', main: true });
  const m = I.refeed ? REFEED_INFO : I.train ? MENU_TRAIN : MENU_REST;
  L.push({ k: 'food', ic: '🍗', t: I.refeed ? 'Ăn đúng thực đơn ngày ăn nhiều' : 'Ăn đúng thực đơn', sub: `${m.kcal} kcal · ${m.macro}`, main: true, panel: 'food', more: 'Xem thực đơn từng bữa' });
  L.push({ k: 'water', ic: '💧', t: '4 lít nước', sub: 'Chia đều cả ngày. Nêm muối bình thường', main: true });
  L.push({ k: 'sleep', ic: '😴', t: 'Ngủ 7–8 tiếng', sub: 'Giờ cố định. Không cà phê sau 16h', main: false });
  if (I.wd === 0) L.push({ k: 'measure', ic: '📏', t: 'Đo eo và chụp ảnh', sub: 'Đo ngang rốn, chụp cùng góc mỗi Chủ nhật', main: false });
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
  const r = { T, Y, streak: 0, best: 0, shields: 0, runStart: null, total: 0, shieldDays: {}, missDays: {}, week: {}, perfectWeek: false, maxWeek: 0, runWater: 0, runSleep: 0, runWeigh: 0, steps: 0, heavy: 0, refeed: 0, comeback: false };
  let prog = 0, hadBreak = false, cw = 0, cs = 0, cwe = 0;
  for (let i = 0; i <= n; i++) {
    const d = addDays(S, i), it = (state.days[d] || {}).it || {};
    if (isCommitted(d)) {
      r.total++;
      if (r.streak === 0) { r.runStart = d; if (hadBreak) r.comeback = true; }
      r.streak++; prog++;
      if (prog >= 7) { prog = 0; r.shields = Math.min(2, r.shields + 1); }
      const wk = Math.floor(i / 7) + 1; r.week[wk] = (r.week[wk] || 0) + 1;
      if (dayInfo(d).refeed) r.refeed++;
    } else if (d !== T && d !== Y) {
      if (r.streak > 0 && r.shields > 0) { r.shields--; r.shieldDays[d] = 1; }
      else { if (r.streak > 0) hadBreak = true; r.missDays[d] = 1; r.streak = 0; prog = 0; r.runStart = null; }
    }
    r.best = Math.max(r.best, r.streak);
    cw = it.water === true ? cw + 1 : d === T ? cw : 0; r.runWater = Math.max(r.runWater, cw);
    cs = it.sleep === true ? cs + 1 : d === T ? cs : 0; r.runSleep = Math.max(r.runSleep, cs);
    cwe = state.w[d] != null ? cwe + 1 : d === T ? cwe : 0; r.runWeigh = Math.max(r.runWeigh, cwe);
    if (it.steps === true) r.steps++;
    if (it.heavy === true) r.heavy++;
  }
  Object.values(r.week).forEach(v => { r.maxWeek = Math.max(r.maxWeek, v); if (v >= 7) r.perfectWeek = true; });
  for (let k = 1; k <= 12; k++) r.week[k] = r.week[k] || 0;
  const wds = Object.keys(state.w).filter(d => d <= T).sort();
  r.latestDate = wds[wds.length - 1] || null;
  r.latest = r.latestDate ? state.w[r.latestDate] : null;
  r.lost = r.latest != null ? Math.max(0, +(state.startWeight - r.latest).toFixed(1)) : 0;
  r.unlocked = {}; PETS.forEach(p => { if (r.total >= p.need) r.unlocked[p.id] = 1; });
  r.pets = Object.keys(r.unlocked).length;
  r.maxLv = Math.max(1, ...Object.values(state.pets).map(p => p.lv || 1));
  r.decor = Object.keys(state.decor).length;
  return r;
}

/* ----- Thành tựu ----- */
function checkBadges(D) {
  D = D || derive();
  const got = [];
  BADGES.forEach(b => {
    if (state.badges[b.id]) return;
    let ok = false; try { ok = !!b.ok(D); } catch (e) { }
    if (ok) { state.badges[b.id] = Date.now(); const rw = BADGE_REWARD[b.t]; state.coins += rw.c; state.food += rw.f; got.push(b); }
  });
  return got;
}
function announceBadges(list) { list.forEach((b, i) => setTimeout(() => toast(`${b.ic} Huy hiệu mới: ${esc(b.n)} · +${BADGE_REWARD[b.t].c} 🪙${BADGE_REWARD[b.t].f ? ` +${BADGE_REWARD[b.t].f} 🍖` : ''}`), i * 700)); }

/* ----- Câu động lực ----- */
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
  const base = hash(ds) % pool.length;
  return list[(base + ui.qShift) % list.length];
}

/* ===================== GIAO DIỆN ===================== */
const TABS = ['today', 'calendar', 'pets', 'weight', 'badges'];
const TAB_NAME = { today: 'Hôm nay', calendar: 'Lịch', pets: 'Pet', weight: 'Cân', badges: 'Thành tựu' };
const ui = { tab: 'today', back: false, open: {}, qShift: 0, calMonth: null, pop: null };

function renderTop(D) {
  $('#top').innerHTML = `<div class="top-row">
    <span class="chip" title="Chuỗi hiện tại"><span class="e">🔥</span>${D.streak}</span>
    <span class="chip" title="Khiên giữ chuỗi"><span class="e">🛡️</span>${D.shields}</span>
    <span class="chip" title="Xu"><span class="e">🪙</span>${state.coins}</span>
    <span class="chip" title="Thức ăn cho pet"><span class="e">🍖</span>${state.food}</span>
    <span style="margin-left:auto"></span>
    <button class="icon-btn" data-act="settings" aria-label="Cài đặt">⚙️</button>
    <span id="syncdot" class="sync ${store.status === 'ok' ? 'ok' : store.status === 'wait' ? 'wait' : ''}" title="Trạng thái lưu"></span>
  </div>`;
}
function renderNav(D) {
  const unseen = PETS.some(p => D.unlocked[p.id] && !state.seen[p.id]);
  $('#nav').innerHTML = `<div class="bar-in">${TABS.map(t => `<button class="nb" data-act="nav" data-tab="${t}" ${ui.tab === t ? 'aria-current="page"' : ''}>${NAV_ICONS[t]}${t === 'pets' && unseen ? '<span class="dot"></span>' : ''}<span>${TAB_NAME[t]}</span></button>`).join('')}</div>`;
}
function render() {
  const D = derive();
  renderTop(D); renderNav(D);
  const v = $('#view');
  v.innerHTML = ui.tab === 'today' ? nudgeHTML() + viewToday(D) : ui.tab === 'calendar' ? viewCal(D) : ui.tab === 'pets' ? viewPets(D) : ui.tab === 'weight' ? viewWeight(D) : viewBadges(D);
  if (ui.tab === 'weight') bindChart();
  if (ui.pop) { const el = document.querySelector(ui.pop); if (el) { el.classList.remove('bounce'); void el.offsetWidth; el.classList.add('bounce'); } ui.pop = null; }
}

/* ----- Hôm nay ----- */
function petMini(D) {
  const last = [...PETS].reverse().find(p => D.unlocked[p.id]);
  return last ? petSVG(last.id, (state.pets[last.id] || {}).lv || 1) : eggSVG();
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
  h += `<section class="hero"><div class="pills">${after ? '<span class="pill">Sau 12 tuần</span>' : `<span class="pill">Tuần ${I.week}</span>`}<span class="pill ${I.cls}">${I.type}${I.train ? ' · ' + I.session.code : ''}</span></div>
    <div class="daynum tout">Ngày ${I.idx + 1}${after ? '' : '<small>/84</small>'}</div><div class="date">${ui.back ? 'Hôm qua · ' : ''}${fmtFull(ds)}</div></section>`;
  h += `<div class="card quote"><div class="qpet">${petMini(D)}</div><div><div class="bubble" id="qtext">${esc(quoteFor(ds, D))}</div>
    <div class="q-actions"><span class="sub">Câu hôm nay</span><button class="btn sm ghost" data-act="qnext">🎲 Đổi câu</button></div></div></div>`;
  if (ui.back) h += `<div class="card banner info" style="margin-top:14px"><p>Đang chốt bù cho hôm qua.</p><button class="btn sm" data-act="back-off">Về hôm nay</button></div>`;
  else if (diff(state.startDate, D.Y) >= 0 && !isCommitted(D.Y) && !D.shieldDays[D.Y]) h += `<div class="card banner" style="margin-top:14px"><p>Hôm qua chưa chốt. Còn kịp chốt bù tới hết hôm nay.</p><button class="btn sm" data-act="back-on">Chốt bù</button></div>`;
  if (after && !ui.back) h += `<div class="card" style="margin-top:14px;background:linear-gradient(160deg,#ffb21f,#ff4d6a)"><div class="h2 tout">Đã qua 84 ngày!</div><p style="margin:6px 0 0;font-weight:700">Đừng quay lại ăn như cũ ngay. 3–4 tuần tới, mỗi tuần thêm ~150–200 kcal, chủ yếu bằng cơm (~120–150 g cơm chín), tới khi cân đứng yên. Vẫn cân đồ ăn và cân mỗi sáng.</p></div>`;
  if (done) {
    h += `<div class="card stamp" style="margin-top:14px"><div class="ic">🏆</div><div><div class="big">Đã chốt ngày ${I.idx + 1}</div><div style="font-weight:700">Pet đã được thêm phần ăn. Mai chiến tiếp.</div></div></div>`;
  } else {
    h += `<div class="card" style="margin-top:14px"><div class="prog"><div class="bar ${pct >= 100 ? 'full' : ''}"><i style="width:${pct}%"></i></div><div class="pct tout-s">${pct}%</div></div>
      <p class="prog-note">${doneN}/${items.length} mục xong${leftMain ? ` · còn ${leftMain} mục chính trước khi chốt` : ' · đủ mục chính, chốt được rồi!'}</p></div>`;
  }
  h += `<ul class="list">${items.map(x => itemHTML(ds, I, day, x, done)).join('')}</ul>`;
  h += `<div class="commit-wrap">`;
  if (!done) h += `<button class="btn btn-commit" data-act="commit" ${leftMain ? 'disabled' : ''}><span class="tout">${leftMain ? `Còn ${leftMain} mục chính` : 'CHỐT NGÀY'}</span></button>`;
  else { const nx = dayInfo(addDays(ds, 1)); h += `<div class="card" style="text-align:center"><span class="sub">Ngày mai:</span> <b>${nx.train ? nx.session.code : 'Nghỉ tạ'}</b>${nx.abs ? ' + ' + ABS[nx.abs].code : ''}${nx.heavy ? ' + cardio nặng' : ''}${nx.refeed ? ' · ngày ăn nhiều' : ''}</div>`; }
  h += `<button class="btn block warn-btn" data-act="help">😵 Hôm nay thấy không ổn</button></div>`;
  return h;
}
function itemHTML(ds, I, day, x, locked) {
  const ok = itemDone(ds, x.k), open = !!ui.open[x.k];
  let right;
  if (x.k === 'weigh') {
    right = '';
  } else {
    const skip = x.k === 'heavy' && day.it && day.it.heavy === 'skip';
    right = `<button class="chk ${ok ? 'on' : ''} ${skip ? 'skip' : ''}" id="chk-${x.k}" data-act="toggle" data-k="${x.k}" aria-pressed="${ok}" aria-label="${esc(x.t)}: ${ok ? 'đã xong' : 'chưa xong'}" ${locked ? 'disabled' : ''}>${skip ? 'Bỏ' : CHECK}</button>`;
  }
  let body = `<li class="item ${ok ? 'done' : ''} ${x.main ? '' : 'phu'}"><div class="it-row"><div class="it-ic" aria-hidden="true">${x.ic}</div><div class="it-txt"><div class="it-t">${esc(x.t)}</div><div class="it-s">${esc(x.sub)}</div></div>${right}</div>`;
  if (x.k === 'weigh') {
    const v = state.w[ds];
    const prevD = Object.keys(state.w).filter(d => d < ds).sort().pop();
    const dl = v != null && prevD ? v - state.w[prevD] : null;
    body += `<div class="it-panel" style="border-top:2.5px solid var(--ink)"><div class="wrow"><div class="wrap-in"><label class="sr" for="w-${ds}">Cân nặng sáng ${fmtDM(ds)} (kg)</label><input id="w-${ds}" class="num-in" type="text" inputmode="decimal" placeholder="${ui.lastW != null ? fkg(ui.lastW) : fkg(state.startWeight)}" value="${v != null ? fkg(v) : ''}" data-wdate="${ds}"><span class="unit">kg</span></div><button class="btn green" data-act="wsave" data-date="${ds}">Lưu</button></div>
      ${dl != null ? `<p class="note">So với lần cân trước: <b class="${dl > 0 ? 'delta-up' : 'delta-dn'}">${dl > 0 ? '+' : ''}${fkg(dl)} kg</b>${dl > 0 && I.wd === 4 ? ' (sau ngày ăn nhiều, nhích 0,5–1,5 kg là nước)' : ''}</p>` : ''}</div>`;
  }
  if (x.panel) {
    body += `<button class="it-more" data-act="expand" data-k="${x.k}" aria-expanded="${open}">${x.more} <span class="car">▾</span></button>`;
    if (open) body += `<div class="it-panel">${panelHTML(x.panel, I, day, locked)}</div>`;
  }
  return body + `</li>`;
}
function panelHTML(p, I, day, locked) {
  if (p === 'lift') {
    let h = I.session.ex.map(e => {
      const s = I.deload ? Math.max(1, Math.round(e.s * 2 / 3)) : e.s;
      return `<div class="ex"><div class="n">${esc(e.n)}${e.main ? '<span class="tag">bài chính</span>' : ''}</div><div class="sr2">${I.deload && s !== e.s ? `<s>${e.s}</s>` : ''}${s} × ${e.r}</div><div class="rest">Nghỉ ${e.rest}</div></div>`;
    }).join('');
    return h + `<p class="note">${I.deload ? 'Tuần 8 tập nhẹ: bớt 1/3 số set, giữ nguyên mức tạ. ' : ''}Bài chính giữ mức tạ như trước khi giảm cân, mỗi set chừa 1–2 rep. Siêu set: làm 2 bài liền nhau, xong cả cặp mới nghỉ. Khớp đau thì bỏ buổi B tuần đó.</p>`;
  }
  if (p === 'abs') return ABS[I.abs].ex.map(e => `<div class="ex"><div class="n">${esc(e.n)}</div><div class="sr2">${e.s} × ${e.r}</div></div>`).join('') + `<p class="note">Làm cuối buổi tạ, nghỉ 60 giây giữa các set.</p>`;
  if (p === 'light') {
    const cur = day.lc || 'incline', o = LIGHT_CARDIO.find(x => x.id === cur) || LIGHT_CARDIO[0];
    return `<div class="opts">${LIGHT_CARDIO.map(x => `<button class="opt" data-act="lc" data-id="${x.id}" aria-pressed="${x.id === cur}" ${locked ? 'disabled' : ''}>${esc(x.n)}</button>`).join('')}</div><div class="proto">${esc(o.d)}</div><p class="note">Nhịp vừa phải, vẫn nói chuyện được. Làm sau buổi tạ hoặc buổi sáng.</p>`;
  }
  if (p === 'heavy') {
    const cur = day.hc || 'airbike', o = HEAVY_CARDIO.find(x => x.id === cur) || HEAVY_CARDIO[0], skip = day.it && day.it.heavy === 'skip';
    return `<div class="opts">${HEAVY_CARDIO.map(x => `<button class="opt" data-act="hc" data-id="${x.id}" aria-pressed="${x.id === cur}" ${locked ? 'disabled' : ''}>${esc(x.n)}</button>`).join('')}</div><div class="proto">${esc(o.d)}</div>
      <p class="note">Khởi động 5 phút rồi mới vào hiệp. Tổng khoảng ${I.heavyDur}. Không làm cardio nặng trong 24 giờ trước buổi Legs.</p>
      ${skip && !locked ? `<button class="btn sm ghost" data-act="unskip" style="margin-top:8px">Hoàn tác bỏ buổi</button>` : ''}`;
  }
  if (p === 'food') {
    const M = I.train ? MENU_TRAIN : MENU_REST;
    let h = M.meals.map((m, i) => {
      const extra = I.refeed ? REFEED_EXTRA[i] : 0, rice = m[2] + extra;
      return `<div class="meal"><div class="t">${esc(m[0])}</div><div class="f">${esc(m[1])}<br>${rice ? `Cơm chín: <b>${rice} g</b>${extra ? ` <span class="plus">(+${extra} g)</span>` : ''}<br>` : ''}${esc(m[3])}${I.refeed && i === 2 ? '<br><span class="plus">+ 1 quả chuối</span>' : ''}${I.refeed && i === 3 ? '<br><span class="plus">+ 1 quả chuối</span>' : ''}</div></div>`;
    }).join('');
    const info = I.refeed ? REFEED_INFO : M;
    h += `<div class="total"><b>Tổng ${info.kcal} kcal</b> · ${info.macro}<br>${esc(M.total)}${I.refeed ? '<br><span class="plus">Ngày ăn nhiều: thêm ~650 g cơm chia 4 bữa và 2 quả chuối. Gà, trứng giữ nguyên.</span>' : ''}</div>`;
    if (day.brake && day.brake.food) h += `<div class="total" style="margin-top:8px;background:#7a3d10">Đang phanh: ăn thêm <b>150–230 g cơm chín</b> hôm nay (200–300 kcal).</div>`;
    h += `<p class="note">Gà cân lúc sống, cơm cân lúc chín, dầu đong bằng thìa. Mỗi bữa ít nhất 10 g béo. Không ngày nào dưới 1.300 kcal.<br>Bổ sung mỗi ngày: vitamin tổng hợp, omega-3, creatine 5 g. Khó ăn đủ đạm thì 1 muỗng whey thay ~110 g ức gà sống.</p>`;
    return h;
  }
  return '';
}

/* ----- Lịch ----- */
function viewCal(D) {
  if (!ui.calMonth) { const t = parseD(D.T); ui.calMonth = [t.getFullYear(), t.getMonth()]; }
  const [y, m] = ui.calMonth, first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate(), lead = (first.getDay() + 6) % 7;
  let cells = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(w => `<div class="wd">${w}</div>`).join('');
  for (let i = 0; i < lead; i++) cells += `<div class="cell blank"></div>`;
  for (let d = 1; d <= days; d++) {
    const ds = ymd(new Date(y, m, d)), I = dayInfo(ds);
    let cls = 'cell';
    if (!I.inPlan && !(I.idx >= PLAN_DAYS && ds <= D.T)) cls += ' out';
    if (isCommitted(ds)) cls += ' done';
    else if (D.shieldDays[ds]) cls += ' shield';
    else if (D.missDays[ds]) cls += ' miss';
    else if (ds === D.Y && I.idx >= 0) cls += ' pending';
    if (ds === D.T) cls += ' today';
    if (I.refeed) cls += ' refeed';
    cells += `<button class="${cls}" data-act="calday" data-date="${ds}" aria-label="${fmtFull(ds)}">${d}${I.idx >= 0 && I.idx < PLAN_DAYS ? `<span class="pd">N${I.idx + 1}</span>` : ''}</button>`;
  }
  const S = state.startDate, sw = state.startWeight;
  const miles = [[28, sw - 9.5, 'Tuần 4'], [56, sw - 16.5, 'Tuần 8'], [84, sw - 22.5, 'Tuần 12']];
  return `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Lịch & chuỗi</div><div class="date">Bắt đầu ${fmtDM(S)} · về đích ${fmtDM(addDays(S, PLAN_DAYS - 1))}/${parseD(addDays(S, PLAN_DAYS - 1)).getFullYear()}</div></div></section>
  <div class="tiles">
    <div class="tile hot"><div class="k">Chuỗi hiện tại</div><div class="v tout-s">🔥 ${D.streak}</div></div>
    <div class="tile"><div class="k">Chuỗi dài nhất</div><div class="v">${D.best}</div></div>
    <div class="tile"><div class="k">Ngày đã chốt</div><div class="v">${D.total}<small>/84</small></div></div>
    <div class="tile"><div class="k">Khiên giữ chuỗi</div><div class="v">🛡️ ${D.shields}<small>/2</small></div></div>
  </div>
  <div class="card" style="margin-top:14px">
    <div class="cal-head"><button class="icon-btn" data-act="calprev" aria-label="Tháng trước">‹</button><h3 class="h3" style="margin:0">Tháng ${m + 1}/${y}</h3><button class="icon-btn" data-act="calnext" aria-label="Tháng sau">›</button></div>
    <div class="cal-grid">${cells}</div>
    <div class="legend"><span><i style="background:#ffc21f"></i>Đã chốt</span><span><i style="background:#2fb8e8"></i>Khiên đỡ</span><span><i style="background:#ff8a1f"></i>Chốt bù được</span><span><i class="dash" style="background:#2a1f63"></i>Bỏ lỡ</span><span>🍚 Ngày ăn nhiều</span></div>
  </div>
  <div class="card"><h3 class="h3">Cách giữ chuỗi</h3><p class="sub" style="margin:0">Chốt đủ 7 ngày liền được 1 khiên, giữ tối đa 2. Lỡ một ngày thì khiên tự đỡ, chuỗi không gãy. Quên chốt thì vẫn chốt bù được cho hôm qua, chỉ hôm qua thôi.</p></div>
  <div class="card"><h3 class="h3">Mốc cân theo kế hoạch</h3>
    ${miles.map(([i, v, t]) => `<div class="mile"><span class="w">${t}</span><span class="sub">${fmtDM(addDays(S, i - 1))}</span><span class="kg">~${fkg(v)} kg</span></div>`).join('')}
    <div class="mile"><span class="w" style="color:var(--red)">Trần</span><span class="sub">Giảm 25 kg, chỉ khi mọi thứ thuận lợi</span><span class="kg">${fkg(sw - 25)} kg</span></div>
  </div>`;
}

/* ----- Pet ----- */
function viewPets(D) {
  const on = {}; Object.keys(state.decor).forEach(k => { if (state.decor[k].on) on[k] = 1; });
  let h = `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Trại pet</div><div class="date">Chốt ngày để mở pet, cho ăn để lên cấp</div></div></section>
  <div class="card scene">${sceneSVG(D.unlocked, state.pets, on, D.total > 0)}
    <div class="scene-hud"><span class="chip"><span class="e">🍖</span>${state.food}</span><span class="chip"><span class="e">🪙</span>${state.coins}</span></div>
</div><p class="sub" style="margin:8px 2px 0;text-align:center">${D.total ? 'Chạm vào pet trong sân để xem và cho ăn' : 'Chốt ngày đầu tiên để nở trứng'}</p>`;
  h += `<h3 class="h2 tout" style="margin:20px 2px 10px">Đội pet <span class="sub" style="text-shadow:none">${D.pets}/10</span></h3><div class="pet-grid">`;
  PETS.forEach(p => {
    const un = !!D.unlocked[p.id], st = state.pets[p.id] || { lv: 1, xp: 0 }, R = RARITY[p.rar];
    const fcls = un ? ' f' + st.lv : '';
    h += `<button class="pcard ${un ? '' : 'locked'}${fcls}" data-act="pet" data-id="${p.id}">
      ${un && !state.seen[p.id] ? '<span class="new">Mới</span>' : ''}
      ${p.id === 'wolf' && !un ? eggSVG() : petSVG(p.id, un ? st.lv : 1)}
      ${un ? '' : `<span class="need">Còn ${p.need - D.total} ngày</span>`}
      <span class="pn ${un ? 'tout-s' : ''}">${un ? esc(p.name) : '???'}</span>
      <span class="rar" style="background:${R.c}">${R.n}</span>
      ${un ? `<span class="lv" aria-label="Cấp ${st.lv}">${'★'.repeat(st.lv)}<span style="color:#5d5596">${'★'.repeat(5 - st.lv)}</span></span>` : `<span class="sub">Mở ở ngày ${p.need}</span>`}
    </button>`;
  });
  h += `</div><h3 class="h2 tout" style="margin:22px 2px 6px">Đồ trang trí</h3><p class="sub" style="margin:0 2px 10px">Mua bằng xu, đặt vào khu nhà chung của các pet. Mỗi ngày chốt được 10 🪙.</p><div class="shop">`;
  DECOR.forEach(d => {
    const own = state.decor[d.id];
    h += `<div class="sitem ${own ? 'own' : ''}"><div class="ic" aria-hidden="true">${d.ic}</div><div class="n">${esc(d.n)}</div>
      ${own ? `<button class="btn sm ${own.on ? 'green' : 'ghost'}" data-act="dtoggle" data-id="${d.id}" aria-pressed="${!!own.on}">${own.on ? 'Đang đặt' : 'Đã cất'}</button>`
        : `<button class="btn sm" data-act="buy" data-id="${d.id}" ${state.coins < d.p ? 'disabled' : ''}>${d.p} 🪙</button>`}</div>`;
  });
  return h + `</div>`;
}
function openPet(id) {
  const D = derive(), p = PETS.find(x => x.id === id);
  if (!p) return;
  const un = !!D.unlocked[id], st = state.pets[id] || { lv: 1, xp: 0 }, R = RARITY[p.rar];
  if (un && !state.seen[id]) { state.seen[id] = 1; persist(); render(); }
  let h = `<h2>${un ? esc(p.name) : 'Pet bí ẩn'}</h2><div style="display:flex;justify-content:center"><div id="pet-big" style="width:220px">${un ? petSVG(id, st.lv) : (id === 'wolf' ? eggSVG() : `<div style="filter:brightness(0) opacity(.6)">${petSVG(id, 1)}</div>`)}</div></div>
    <p style="text-align:center;margin:4px 0"><span class="pill" style="background:${R.c};color:var(--ink)">${R.n}</span></p>`;
  if (!un) {
    h += `<p style="text-align:center">Mở khi chốt đủ <b>${p.need}</b> ngày. Còn <b>${p.need - D.total}</b> ngày nữa.</p>`;
  } else {
    const need = LV_NEED[st.lv] || 0, maxed = st.lv >= 5;
    h += `<p style="text-align:center;font-weight:700">${esc(p.intro)}</p>
      <div class="box plain"><div style="display:flex;justify-content:space-between;font-weight:800"><span>Cấp ${st.lv}${st.lv > 1 ? ' · ' + LV_PERK[st.lv - 1] : ''}</span><span>${maxed ? 'Cấp tối đa' : `${st.xp}/${need} 🍖`}</span></div>
      <div class="xp"><i style="width:${maxed ? 100 : st.xp / need * 100}%"></i></div>
      <div class="sub">${[2, 3, 4, 5].map(l => `${st.lv >= l ? '✅' : '⬜'} Lv${l}: ${LV_PERK[l - 1]}`).join(' · ')}</div></div>
      <div class="feed-row"><button class="btn green" data-act="feed" data-id="${id}" ${maxed || state.food < 1 ? 'disabled' : ''}>Cho ăn 🍖</button><span class="sub">Đang có ${state.food} 🍖</span></div>
      ${state.food < 1 && !maxed ? '<p class="sub" style="text-align:center">Chốt thêm ngày để có thức ăn.</p>' : ''}`;
  }
  openModal(h);
}

/* ----- Cân ----- */
function targetAt(i) {
  const sw = state.startWeight, P = [[0, sw], [28, sw - 9.5], [56, sw - 16.5], [84, sw - 22.5]];
  if (i <= 0) return sw; if (i >= 84) return sw - 22.5;
  for (let k = 1; k < P.length; k++) if (i <= P[k][0]) { const [x0, y0] = P[k - 1], [x1, y1] = P[k]; return y0 + (y1 - y0) * (i - x0) / (x1 - x0); }
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
    h += `<div class="card"><h3 class="h3">Nhật ký cân</h3><div class="wlist">${rows.map((p, k) => { const prev = rows[k + 1]; const dl = prev ? p.v - prev.v : null; return `<div class="wl"><span class="d">${fmtFull(p.d)} · N${p.i + 1}</span><span class="kg">${fkg(p.v)}${dl != null ? ` <small class="${dl > 0 ? 'delta-up' : 'delta-dn'}">${dl > 0 ? '+' : ''}${fkg(dl)}</small>` : ''}</span><button class="x" data-act="wdel" data-date="${p.d}" aria-label="Xóa số cân ${fmtDM(p.d)}">✕</button></div>`; }).join('')}</div></div>`;
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
function viewBadges(D) {
  const got = BADGES.filter(b => state.badges[b.id]).length;
  let h = `<section class="hero"><div><div class="daynum tout" style="font-size:38px">Thành tựu</div><div class="date">Mỗi huy hiệu kèm xu, huy hiệu bạc và vàng thêm thức ăn</div></div></section>
  <div class="card bsum"><div class="big tout">${got}<span class="sub" style="font-size:20px;text-shadow:none">/${BADGES.length}</span></div><div style="flex:1"><div class="bar"><i style="width:${got / BADGES.length * 100}%"></i></div><div class="sub" style="margin-top:4px">Đồng +20 🪙 · Bạc +40 🪙 +1 🍖 · Vàng +80 🪙 +2 🍖</div></div></div>
  <div class="card" style="margin-top:14px"><div class="bgrid">`;
  BADGES.forEach(b => {
    const ok = !!state.badges[b.id]; let pr = '';
    if (!ok && b.pr) { try { const [a, n] = b.pr(D); pr = `${typeof a === 'number' && a % 1 ? fkg(Math.min(a, n)) : Math.min(a, n)}/${n}`; } catch (e) { } }
    h += `<button class="bcell ${ok ? 'got' : 'locked'}" data-act="badge" data-id="${b.id}">${badgeSVG(b, ok)}<span class="bn">${esc(b.n)}</span><span class="bp">${ok ? TIER[b.t].n : pr || 'Chưa mở'}</span></button>`;
  });
  return h + `</div></div>`;
}
function openBadge(id) {
  const b = BADGES.find(x => x.id === id), D = derive(), ok = !!state.badges[id], rw = BADGE_REWARD[b.t];
  let pr = ''; if (!ok && b.pr) { const [a, n] = b.pr(D); pr = `Tiến độ: <b>${typeof a === 'number' && a % 1 ? fkg(Math.min(a, n)) : Math.min(a, n)}/${n}</b>`; }
  openModal(`<h2>${esc(b.n)}</h2><div style="display:flex;justify-content:center"><div style="width:130px">${badgeSVG(b, ok)}</div></div>
    <p style="text-align:center;font-weight:700">${esc(b.d)}</p>
    <p style="text-align:center" class="sub">Huy hiệu ${TIER[b.t].n.toLowerCase()} · thưởng ${rw.c} 🪙${rw.f ? ` + ${rw.f} 🍖` : ''}</p>
    <p style="text-align:center">${ok ? `Đạt ngày ${fmtDM(ymd(new Date(state.badges[id])))}` : pr}</p>`);
}

/* ===================== HÀNH ĐỘNG ===================== */
function toggleItem(k) {
  const D = derive(), ds = ui.back ? D.Y : D.T;
  if (isCommitted(ds)) return;
  const day = getDay(ds);
  day.it[k] = day.it[k] === true || day.it[k] === 'skip' ? false : true;
  const nb = checkBadges();
  persist(); ui.pop = '#chk-' + k; render(); announceBadges(nb);
  if (day.it[k]) buzz(12);
  const left = itemsFor(ds).filter(x => x.main && !itemDone(ds, x.k)).length;
  if (day.it[k] && left === 0) { const b = $('.btn-commit'); if (b) b.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); }
}
function saveWeight(ds, inputId) {
  const inp = document.getElementById(inputId || 'w-' + ds); if (!inp) return;
  const raw = inp.value.trim().replace(',', '.');
  if (!raw) { toast('Nhập số cân trước, ví dụ 94,2'); return; }
  const v = Math.round(parseFloat(raw) * 10) / 10;
  if (!(v >= 40 && v <= 200)) { toast('Số cân phải nằm trong khoảng 40–200 kg'); return; }
  state.w[ds] = v;
  const nb = checkBadges(); persist(); render(); announceBadges(nb);
  toast(`Đã lưu ${fkg(v)} kg`);
}
function commitDay() {
  const before = derive(), ds = ui.back ? before.Y : before.T;
  if (isCommitted(ds) || diff(state.startDate, ds) < 0) return;
  if (itemsFor(ds).some(x => x.main && !itemDone(ds, x.k))) return;
  const day = getDay(ds); day.done = Date.now();
  state.food += 1; state.coins += 10;
  const after = derive(), rewards = ['+1 🍖', '+10 🪙'];
  const b = STREAK_BONUS[after.streak], key = after.runStart + ':' + after.streak;
  if (b && !state.bonus[key]) { state.bonus[key] = 1; state.coins += b.c; state.food += b.f; rewards.push(`Chuỗi ${after.streak}: +${b.c} 🪙${b.f ? ` +${b.f} 🍖` : ''}`); }
  const newPets = PETS.filter(p => before.total < p.need && after.total >= p.need);
  newPets.forEach(p => { state.pets[p.id] = state.pets[p.id] || { lv: 1, xp: 0 }; });
  const nb = checkBadges(after);
  persist();
  const wasBack = ui.back; ui.back = false;
  render();
  celebrate({ dayNum: diff(state.startDate, ds) + 1, back: wasBack, streak: after.streak, rewards, newPets, badges: nb, first: before.total === 0 });
}
function feedPet(id) {
  const st = state.pets[id] = state.pets[id] || { lv: 1, xp: 0 };
  if (state.food < 1 || st.lv >= 5) return;
  state.food--; st.xp++;
  let up = false;
  if (st.xp >= LV_NEED[st.lv]) { st.xp = 0; st.lv++; up = true; }
  const nb = checkBadges(); persist(); render(); openPet(id);
  const big = $('#pet-big'); if (big) { big.classList.add(up ? 'levelup' : 'bounce'); }
  buzz(up ? [20, 40, 60] : 10);
  if (up) { toast(`⭐ ${esc(PETS.find(p => p.id === id).name)} lên Lv${st.lv}: ${LV_PERK[st.lv - 1]}!`); fx.burst(60); }
  announceBadges(nb);
}
function buyDecor(id) {
  const d = DECOR.find(x => x.id === id); if (!d || state.decor[id] || state.coins < d.p) return;
  state.coins -= d.p; state.decor[id] = { on: 1 };
  const nb = checkBadges(); persist(); render(); announceBadges(nb);
  toast(`${d.ic} Đã mua ${esc(d.n)} và đặt vào khu nhà`); buzz(15);
  const sc = $('.scene'); if (sc) sc.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

/* ----- Modal ----- */
function openModal(html, onClose) {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><button class="icon-btn x" data-act="close" aria-label="Đóng">✕</button>${html}</div>`;
  m.addEventListener('click', e => { if (e.target === m) closeModal(); });
  document.body.appendChild(m);
  const f = m.querySelector('.x'); if (f) f.focus({ preventScroll: true });
}
function closeModal() { const m = $('#modal'); if (m) m.remove(); }

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
        ${!done ? `<button class="btn sm ${foodOn ? 'green' : ''}" data-act="brake-food">${foodOn ? '✓ Đang ăn thêm cơm' : 'Ăn thêm cơm hôm nay'}</button>` : ''}
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
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn sm" data-act="bk-file">💾 Tải file sao lưu</button><button class="btn sm blue" data-act="export">Sao chép bản sao lưu</button><button class="btn sm ghost" data-act="import-show">Khôi phục từ bản sao lưu</button></div>
    <div id="bk"></div>
    <label class="tgl"><input type="checkbox" id="set-remind" data-act="remind" ${meta.remind ? 'checked' : ''}> <span>Nhắc sao lưu mỗi ${BACKUP_EVERY} ngày</span></label>
    <h3>Cài ra màn hình chính</h3>
    ${sa ? `<p class="sub" style="margin:0">✅ Đang chạy như app trên màn hình chính.</p>` : `<p class="sub" style="margin:0">iPhone: mở trang này trong Safari → nút Chia sẻ → Thêm vào MH chính. Android: Chrome → ⋮ → Thêm vào màn hình chính (hoặc Cài đặt ứng dụng).</p>${window.__bip ? `<button class="btn sm green" style="margin-top:8px" data-act="install">📲 Cài app</button>` : ''}`}
    <h3>Cập nhật</h3><p class="sub" style="margin:0">Phiên bản <b id="app-ver">…</b>. Khi có bản mới, app hiện thông báo nhỏ ở cuối màn hình.</p>
    ${'serviceWorker' in navigator ? `<button class="btn sm ghost" style="margin-top:8px" data-act="check-upd">Kiểm tra bản mới</button>` : ''}
    <h3>Xóa dữ liệu</h3><div id="rst"><button class="btn sm red" data-act="reset-ask">Xóa toàn bộ dữ liệu</button></div>
    <p class="sub" style="margin-top:14px">Hành trình −25kg · ${PLAN_DAYS} ngày · ${BADGES.length} huy hiệu · 10 pet</p>`);
  appVersion().then(v => { const el = $('#app-ver'); if (el) el.textContent = v; });
}
const isStandalone = () => { try { return matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: fullscreen)').matches || navigator.standalone === true; } catch (e) { return false; } };
async function appVersion() {
  try { if (window.caches) { const k = (await caches.keys()).find(x => x.startsWith('hanh-trinh-25kg-')); if (k) return k.slice('hanh-trinh-25kg-'.length); } } catch (e) { }
  return 'chưa cài offline';
}

/* ----- Sao lưu & khôi phục (cùng định dạng JSON với bản artifact cũ) ----- */
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
  const m = migrate(JSON.parse(JSON.stringify(o)));
  const nd = Object.values(m.days).filter(d => d && d.done).length, nw = Object.keys(m.w).length, np = Object.keys(m.pets).length;
  $('#im-act').innerHTML = `<div class="box plain" style="margin-top:8px">Bản sao lưu: bắt đầu ${fmtDM(m.startDate)}/${m.startDate.slice(0, 4)} · ${nd} ngày đã chốt · ${nw} lần cân · ${np} pet · ${m.coins} 🪙</div>
    <p style="font-weight:800">Ghi đè toàn bộ dữ liệu hiện tại bằng bản này?</p><button class="btn sm red" data-act="import-do">Ghi đè</button> <button class="btn sm ghost" data-act="close">Thôi</button>`;
}
function nudgeHTML() {
  if (!meta.remind) return '';
  const now = Date.now(), ref = meta.lastBackup || meta.since || now;
  if (now - ref < BACKUP_EVERY * DAY_MS || now < (meta.snooze || 0)) return '';
  if (!Object.values(state.days).some(d => d && d.done) && !Object.keys(state.w).length) return '';
  const n = Math.floor((now - ref) / DAY_MS);
  return `<div class="nudge" id="nudge"><div class="nudge-t">💾 ${meta.lastBackup ? `Đã ${n} ngày chưa sao lưu.` : 'Bạn chưa sao lưu lần nào.'} Tải file sao lưu để đổi máy hay lỡ xóa trình duyệt vẫn còn dữ liệu.</div>
    <div class="nudge-b"><button class="btn sm" data-act="bk-file">Tải file sao lưu</button><button class="btn sm ghost" data-act="nudge-later">Để mai</button><button class="lnk" data-act="nudge-off">Tắt nhắc</button></div></div>`;
}
function openDay(ds) {
  const D = derive(), I = dayInfo(ds), day = state.days[ds] || { it: {} };
  let status = isCommitted(ds) ? '✅ Đã chốt' : D.shieldDays[ds] ? '🛡️ Khiên đã đỡ ngày này' : D.missDays[ds] ? 'Bỏ lỡ. Không sao, chiến tiếp.' : ds === D.T ? 'Hôm nay' : ds === D.Y && I.idx >= 0 ? 'Chưa chốt, còn kịp chốt bù' : ds > D.T ? 'Chưa tới' : 'Ngoài kế hoạch';
  const items = I.idx >= 0 ? itemsFor(ds) : [];
  openModal(`<h2>${fmtFull(ds)}</h2>
    ${I.idx >= 0 ? `<p><span class="pill">${I.idx < PLAN_DAYS ? `Ngày ${I.idx + 1} · Tuần ${I.week}` : `Ngày ${I.idx + 1}`}</span> <span class="pill ${I.cls}">${I.type}${I.train ? ' · ' + I.session.code : ''}</span></p>` : '<p class="sub">Trước ngày bắt đầu.</p>'}
    <p style="font-weight:800">${status}</p>
    ${state.w[ds] != null ? `<p>Cân: <b>${fkg(state.w[ds])} kg</b></p>` : ''}
    ${items.length && ds <= D.T ? `<div class="box plain">${items.map(x => `<div>${itemDone(ds, x.k) ? '✅' : '⬜'} ${esc(x.t)}</div>`).join('')}</div>` : ''}
    ${items.length && ds > D.T ? `<div class="box plain">${items.filter(x => x.main).map(x => `<div>• ${esc(x.t)}</div>`).join('')}</div>` : ''}
    ${ds === D.Y && !isCommitted(ds) && I.idx >= 0 && !D.shieldDays[ds] ? `<button class="btn block" style="margin-top:12px" data-act="back-on">Chốt bù hôm qua</button>` : ''}
    ${ds === D.T ? `<button class="btn block" style="margin-top:12px" data-act="nav" data-tab="today">Mở Hôm nay</button>` : ''}`);
}

/* ----- Ăn mừng ----- */
function celebrate(o) {
  const c = document.createElement('div'); c.className = 'cele'; c.id = 'cele';
  const np = o.newPets[o.newPets.length - 1];
  const Dn = derive(), lp = !np ? [...PETS].reverse().find(p => Dn.unlocked[p.id]) : null;
  c.innerHTML = `<div class="rays"></div>
    <h2 class="tout">${o.back ? 'Đã chốt bù' : 'Đã chốt'} ngày ${o.dayNum}!</h2>
    <div class="cs tout-s">${o.streak ? `🔥 Chuỗi ${o.streak} ngày` : ''}</div>
    <div class="rew">${o.rewards.map((r, i) => `<span style="animation-delay:${.15 + i * .12}s">${r}</span>`).join('')}</div>
    ${np ? `<div class="newpet ${o.first ? 'hatch' : 'popin'}" id="np">${o.first ? eggSVG() : petSVG(np.id, 1)}</div><div class="np-name tout" id="npn">${o.first ? 'Trứng đang nứt…' : `Pet mới: ${esc(np.name)}!`}</div><div class="sub" style="color:#fff">${o.first ? '' : `<span class="pill" style="background:${RARITY[np.rar].c};color:var(--ink)">${RARITY[np.rar].n}</span>`}</div>` : ''}
    ${lp ? `<div class="newpet popin" style="width:150px">${petSVG(lp.id, (state.pets[lp.id] || {}).lv || 1)}</div><div class="cs tout-s">${esc(lp.name)} được thêm một phần ăn</div>` : ''}
    ${Q_STREAK[o.streak] ? `<div class="bubble" style="max-width:320px">${esc(Q_STREAK[o.streak])}</div>` : ''}
    ${o.badges.length ? `<div class="rew">${o.badges.map(b => `<span>${b.ic} ${esc(b.n)} +${BADGE_REWARD[b.t].c} 🪙</span>`).join('')}</div>` : ''}
    <button class="btn" data-act="cele-close">${np ? 'Xem pet' : 'Ngon!'}</button>`;
  document.body.appendChild(c);
  c.querySelector('.btn').focus({ preventScroll: true });
  buzz([30, 50, 90]); fx.burst(160);
  if (np && o.first) setTimeout(() => {
    const e = $('#np'), n = $('#npn'); if (!e) return;
    e.className = 'newpet popin'; e.innerHTML = petSVG(np.id, 1);
    n.textContent = `Nở rồi: ${np.name}!`; fx.burst(90); buzz([20, 30, 60]);
  }, reduced() ? 50 : 1400);
  c.dataset.goPets = np ? '1' : '';
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
  ui.tab = tab; ui.qShift = ui.qShift; closeModal();
  try { if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab); } catch (e) { }
  render(); window.scrollTo(0, 0);
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (b.classList.contains('btn') || b.classList.contains('opt') || b.classList.contains('pcard') || b.classList.contains('sitem')) { b.classList.remove('bounce'); void b.offsetWidth; b.classList.add('bounce'); }
  switch (a) {
    case 'nav': go(b.dataset.tab); break;
    case 'toggle': toggleItem(b.dataset.k); break;
    case 'expand': ui.open[b.dataset.k] = !ui.open[b.dataset.k]; render(); break;
    case 'lc': case 'hc': { const D = derive(), ds = ui.back ? D.Y : D.T; if (isCommitted(ds)) break; getDay(ds)[a] = b.dataset.id; persist(); render(); break; }
    case 'unskip': { const D = derive(), ds = ui.back ? D.Y : D.T; getDay(ds).it.heavy = false; persist(); render(); break; }
    case 'commit': commitDay(); break;
    case 'qnext': ui.qShift++; { const D = derive(), q = $('#qtext'); if (q) { q.textContent = quoteFor(ui.back ? D.Y : D.T, D); q.classList.remove('bounce'); void q.offsetWidth; q.classList.add('bounce'); } } break;
    case 'back-on': ui.back = true; ui.open = {}; go('today'); break;
    case 'back-off': ui.back = false; ui.open = {}; render(); window.scrollTo(0, 0); break;
    case 'help': openHelp(); break;
    case 'brake-heavy': { const D = derive(), ds = ui.back ? D.Y : D.T, d = getDay(ds); d.it.heavy = 'skip'; d.brake = Object.assign({}, d.brake, { heavy: 1 }); persist(); closeModal(); render(); toast('Đã bỏ cardio nặng hôm nay. Nghỉ cho đúng nhé.'); break; }
    case 'brake-food': { const D = derive(), ds = ui.back ? D.Y : D.T, d = getDay(ds); const on = !(d.brake && d.brake.food); d.brake = Object.assign({}, d.brake, { food: on ? 1 : 0 }); persist(); render(); openHelp(); if (on) toast('Đã ghi: hôm nay ăn thêm 150–230 g cơm'); break; }
    case 'settings': openSettings(); break;
    case 'close': closeModal(); break;
    case 'cele-close': { const c = $('#cele'), goP = c && c.dataset.goPets; if (c) c.remove(); if (goP) go('pets'); break; }
    case 'wsave': saveWeight(b.dataset.date, b.dataset.input); break;
    case 'wdel': delete state.w[b.dataset.date]; persist(); render(); toast('Đã xóa số cân ' + fmtDM(b.dataset.date)); break;
    case 'calprev': case 'calnext': { let [y, m] = ui.calMonth; m += a === 'calprev' ? -1 : 1; if (m < 0) { m = 11; y--; } if (m > 11) { m = 0; y++; } ui.calMonth = [y, m]; render(); break; }
    case 'calday': openDay(b.dataset.date); break;
    case 'pet': openPet(b.dataset.id); break;
    case 'feed': feedPet(b.dataset.id); break;
    case 'buy': buyDecor(b.dataset.id); break;
    case 'dtoggle': { const d = state.decor[b.dataset.id]; if (d) { d.on = d.on ? 0 : 1; persist(); render(); } break; }
    case 'badge': openBadge(b.dataset.id); break;
    case 'start-today': state.startDate = todayStr(); persist(); render(); break;
    case 'set-start': { const v = $('#set-start').value; if (/^\d{4}-\d{2}-\d{2}$/.test(v)) { state.startDate = v; ui.back = false; ui.calMonth = null; const nb = checkBadges(); persist(); render(); announceBadges(nb); toast('Đã đổi ngày bắt đầu sang ' + fmtDM(v)); closeModal(); } else toast('Chọn một ngày hợp lệ'); break; }
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
    case 'import-show': $('#bk').innerHTML = `<p class="sub">Chọn file .json đã tải, hoặc dán bản sao lưu (kể cả bản sao chép từ app cũ trên Claude):</p>
      <button class="btn sm blue" data-act="import-file">📂 Chọn file sao lưu</button><input type="file" id="im-file" hidden>
      <textarea class="txt" id="im-txt" style="margin-top:8px" placeholder='{"v":1,...}'></textarea><div id="im-act" style="margin-top:8px"><button class="btn sm" data-act="import-ask">Khôi phục từ chữ đã dán</button></div>`; break;
    case 'import-file': { const f = $('#im-file'); if (f) f.click(); break; }
    case 'import-ask': {
      const o = parseBackup($('#im-txt').value);
      if (!o) { toast('Bản sao lưu không đúng định dạng'); break; }
      askImport(o); break;
    }
    case 'import-do': if (window.__imp) { state = migrate(window.__imp); window.__imp = null; ui.back = false; ui.calMonth = null; persist(); store.now(); closeModal(); render(); toast('Đã khôi phục dữ liệu'); } break;
    case 'remind': meta.remind = !!b.checked; meta.snooze = 0; saveMeta(); toast(meta.remind ? `Sẽ nhắc sao lưu mỗi ${BACKUP_EVERY} ngày` : 'Đã tắt nhắc sao lưu'); break;
    case 'nudge-later': meta.snooze = Date.now() + DAY_MS; saveMeta(); render(); break;
    case 'nudge-off': meta.remind = false; saveMeta(); render(); toast('Đã tắt nhắc. Bật lại trong ⚙️ Cài đặt'); break;
    case 'install': { const p = window.__bip; if (p) { window.__bip = null; p.prompt(); p.userChoice.then(r => { if (r && r.outcome === 'accepted') { closeModal(); toast('Đã cài app ra màn hình chính'); } }).catch(() => { }); } break; }
    case 'check-upd': if (window.pwaCheckUpdate) window.pwaCheckUpdate(true); break;
    case 'reset-ask': $('#rst').innerHTML = `<p style="font-weight:800">Xóa hết ngày đã chốt, số cân, pet, xu và huy hiệu? Không hoàn tác được.</p><button class="btn sm red" data-act="reset-do">Xóa hết</button> <button class="btn sm ghost" data-act="reset-no">Thôi</button>`; break;
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
  if (e.key === 'Escape') { closeModal(); const c = $('#cele'); if (c) c.remove(); }
  if (e.key === 'Enter' && e.target && e.target.dataset && e.target.dataset.wdate) { e.preventDefault(); saveWeight(e.target.dataset.wdate, e.target.id); }
  if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.classList && e.target.classList.contains('scene-pet')) { e.preventDefault(); const id = e.target.dataset.pet; if (id !== 'egg') openPet(id); }
});
document.addEventListener('click', e => {
  const g = e.target.closest && e.target.closest('.scene-pet'); if (!g) return;
  const id = g.dataset.pet;
  if (id === 'egg') { toast('🥚 Chốt ngày đầu tiên để nở trứng'); return; }
  openPet(id);
});
window.addEventListener('hashchange', () => { const t = location.hash.slice(1); if (TABS.includes(t) && t !== ui.tab) { ui.tab = t; render(); window.scrollTo(0, 0); } });
let lastDay = todayStr();
setInterval(() => { if (todayStr() !== lastDay) { lastDay = todayStr(); ui.back = false; ui.qShift = 0; render(); } }, 30000);
document.addEventListener('visibilitychange', () => { if (!document.hidden && todayStr() !== lastDay) { lastDay = todayStr(); ui.back = false; render(); } });

/* ===================== KHỞI ĐỘNG ===================== */
document.getElementById('defs').innerHTML = defsSVG();
loadLocal();
{ const t = location.hash.slice(1); if (TABS.includes(t)) ui.tab = t; }
{ const nb = checkBadges(); if (nb.length) saveLocal(); }
render();
store.init();
