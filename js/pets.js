/* ===================== PET: khung chung, 28 loài × 4 dạng ===================== */
// Hình học từng dạng. hy: tâm đầu, hrx/hry: bán kính đầu, sy: đỉnh vai, sw/ww/hw: nửa bề ngang vai/eo/hông,
// at: độ dày tay, al: độ dài tay, fr: bàn chân, lid: độ xếch mí, er: cỡ mắt
const RIG = [null,
  { f: 1, hy: 116, hrx: 41, hry: 36, sy: 148, sw: 22, ww: 21, hw: 24, at: 8.5, al: 20, fr: 13, lid: .35, er: 11.5 },
  { f: 2, hy: 99, hrx: 44, hry: 38, sy: 132, sw: 28, ww: 24, hw: 27, at: 10.5, al: 27, fr: 15, lid: .62, er: 11.5 },
  { f: 3, hy: 85, hrx: 46.5, hry: 40, sy: 118, sw: 35, ww: 26, hw: 29, at: 12.5, al: 33, fr: 17, lid: .85, er: 12 },
  { f: 4, hy: 74, hrx: 48.5, hry: 42, sy: 106, sw: 41, ww: 28, hw: 31, at: 15, al: 39, fr: 19, lid: 1, er: 12.5 }
];
const GROUND = 188, HIP = 178;
const FORM_NAME = ['', 'Non', 'Chiến binh', 'Đấu sĩ', 'Tối thượng'];

/* ----- Thân hai chân dùng chung ----- */
function torsoPath(g, o = {}) {
  const { sy, sw, ww, hw } = g, wy = (sy + HIP) / 2 + 6, top = sy - (o.neck ?? 7), b = HIP + 2;
  return `M${P(100 - sw, sy + 7)} C${P(100 - sw - 1, sy - 3)} ${P(100 - sw * .55, top)} ${P(100, top)} C${P(100 + sw * .55, top)} ${P(100 + sw + 1, sy - 3)} ${P(100 + sw, sy + 7)} ` +
    `C${P(100 + sw, sy + 22)} ${P(100 + ww, wy - 10)} ${P(100 + ww, wy)} C${P(100 + ww, wy + 8)} ${P(100 + hw + 2, b - 10)} ${P(100 + hw - 3, b)} ` +
    `Q${P(100, b + 5)} ${P(100 - hw + 3, b)} C${P(100 - hw - 2, b - 10)} ${P(100 - ww, wy + 8)} ${P(100 - ww, wy)} C${P(100 - ww, wy - 10)} ${P(100 - sw, sy + 22)} ${P(100 - sw, sy + 7)} Z`;
}
function legs(g, c, o = {}) {
  const fx = g.hw * .62, fr = g.fr;
  let s = '';
  for (const sd of [-1, 1]) {
    const x = 100 + sd * fx;
    s += pa(capsule(x, HIP - 6, x + sd * 2, GROUND - 6, g.fr * .78, g.fr * .72), c.b2 || c.b, 5);
    if (o.feet === 'hoof') {
      s += pa(`M${P(x - fr * .85 + sd * 2, GROUND - 7)} Q${P(x + sd * 2, GROUND - 13)} ${P(x + fr * .85 + sd * 2, GROUND - 7)} L${P(x + fr * .8 + sd * 2, GROUND + 1)} Q${P(x + sd * 2, GROUND + 4)} ${P(x - fr * .8 + sd * 2, GROUND + 1)} Z`, c.hoof || '#3a2a5e', 4.5);
    } else if (o.feet === 'bird') {
      const bx = x + sd * 3;
      s += ln(`M${P(bx, GROUND - 6)} l${f1(-fr * .7)},${f1(fr * .45)} M${P(bx, GROUND - 6)} l0,${f1(fr * .55)} M${P(bx, GROUND - 6)} l${f1(fr * .7)},${f1(fr * .45)}`, OL, 9) +
        ln(`M${P(bx, GROUND - 6)} l${f1(-fr * .7)},${f1(fr * .45)} M${P(bx, GROUND - 6)} l0,${f1(fr * .55)} M${P(bx, GROUND - 6)} l${f1(fr * .7)},${f1(fr * .45)}`, c.beak || '#ffb21f', 4);
    } else {
      s += el(x + sd * 3, GROUND - 3, fr, fr * .58, c.foot || c.b2 || c.b, 5);
      if (o.feet !== 'flat') s += ln(`M${P(x + sd * 3 - fr * .32, GROUND + 1.5)} v-4.5 M${P(x + sd * 3 + fr * .32, GROUND + 1.5)} v-4.5`, OL, 2.6);
      if (o.claws) s += [-.45, 0, .45].map(k => pa(`M${P(x + sd * 3 + fr * k - 2.4, GROUND + 2)} l2.4,4.5 l2.4,-4.5 Z`, '#fff', 1.6)).join('');
    }
  }
  return s;
}
// Tay mập: bắp tay + cẳng tay + nắm đấm, buông hai bên thân
function arms(g, c, o = {}) {
  const { sy, sw, at, al } = g;
  let s = '';
  for (const sd of [-1, 1]) {
    const sx = 100 + sd * (sw - at * .35), sY = sy + at * .75;
    const ex = 100 + sd * (sw + at * .85), ey = sy + al * .5 + 3;
    const hx = 100 + sd * (sw + at * .75), hy = sy + al + 4;
    const fill = c.arm || cel(c.b, c.s);
    s += bl(`<path d="${capsule(sx, sY, ex, ey, at, at * .9)}"/><path d="${capsule(ex, ey, hx, hy, at * .9, at * .82)}"/><circle cx="${f1(hx)}" cy="${f1(hy + at * .3)}" r="${f1(at * 1.05)}"/>`, fill, 5);
    if (g.f >= 3 && !o.noBicep) s += ln(`M${P(sx + sd * at * .1, sY + at * .6)} q${f1(sd * at * .55)},${f1(at * .35)} ${f1(sd * at * .6)},${f1(at * 1.2)}`, c.s, 2.6);
    if (o.claws) s += [-.5, 0, .5].map(k => pa(`M${P(hx + at * k - 2.2, hy + at * 1.25)} l2.2,${f1(3.5 + g.f)} l2.2,${f1(-3.5 - g.f)} Z`, '#fff', 1.6)).join('');
    else s += ln(`M${P(hx - at * .45, hy + at * .62)} q${f1(at * .45)},-2 ${f1(at * .9)},0`, OL, 2.2, 'opacity=".55"');
    if (o.band) { const bx = ex + (hx - ex) * .5, by = ey + (hy - ey) * .5; s += pa(`M${P(bx - at * .95, by - 3)} Q${P(bx, by + 1)} ${P(bx + at * .95, by - 3)} L${P(bx + at * .9, by + 4)} Q${P(bx, by + 8)} ${P(bx - at * .9, by + 4)} Z`, o.band, 3); }
  }
  return s;
}
// Cánh thay tay (chim)
function wingArms(g, c, o = {}) {
  const { sy, sw, f } = g, L = 18 + f * 9, Wd = 12 + f * 3;
  let s = '';
  for (const sd of [-1, 1]) {
    const x0 = 100 + sd * (sw - 6), y0 = sy + 6;
    const tip = [x0 + sd * (Wd + f * 4), y0 + L];
    const d = `M${P(x0, y0)} C${P(x0 + sd * Wd * 1.5, y0 + 2)} ${P(tip[0] + sd * 6, y0 + L * .55)} ${P(tip[0], tip[1])} ` +
      `L${P(tip[0] - sd * 5, tip[1] - 7)} L${P(tip[0] - sd * 9, tip[1] - 1)} L${P(tip[0] - sd * 12, tip[1] - 9)} L${P(tip[0] - sd * 15, tip[1] - 4)} Q${P(x0 - sd * 2, y0 + L * .55)} ${P(x0, y0)} Z`;
    s += pa(d, cel(c.w || c.b, c.ws || c.s), 5);
    s += ln(`M${P(x0 + sd * 4, y0 + 10)} Q${P(x0 + sd * Wd * .9, y0 + L * .35)} ${P(tip[0] - sd * 4, tip[1] - 10)}`, c.ws || c.s, 2.5);
  }
  return s;
}
function belly(g, col, o = {}) {
  const wy = (g.sy + HIP) / 2 + 6, ry = (HIP - g.sy) * (o.k ?? .36), rx = g.ww * (o.kx ?? .66);
  return el(100, wy + 3 + (o.dy || 0), rx, ry, col, o.w ?? 0);
}
function torso(g, c, o = {}) {
  return pa(torsoPath(g, o), cel(c.b, c.s), 5.5) + hl(100 - g.sw * .55, g.sy + 8, g.sw * .22, 3.2, -30, .45);
}
// Bóng chân
const groundShadow = g => `<ellipse cx="100" cy="${GROUND + 1}" rx="${f1(32 + g.f * 6)}" ry="7" fill="#000" opacity=".28"/>`;

/* ----- Giáp chung ----- */
function pads(g, col, cold, o = {}) {
  const { sy, sw, f } = g, r = 9 + f * 2.6;
  let s = '';
  for (const sd of [-1, 1]) {
    const x = 100 + sd * (sw + g.at * .15), y = sy + g.at * .95;
    if (o.spike) s += pa(`M${P(x - sd * r * .1, y - r * .7)} L${P(x + sd * r * .55, y - r * 1.75)} L${P(x + sd * r * .75, y - r * .45)} Z`, o.spikeCol || '#fff6d8', 3.5) +
      pa(`M${P(x + sd * r * .55, y - r * .35)} L${P(x + sd * r * 1.45, y - r * 1.05)} L${P(x + sd * r * 1.05, y + r * .15)} Z`, o.spikeCol || '#fff6d8', 3.5);
    s += pa(`M${P(x - r * 1.05, y + r * .55)} Q${P(x - r * 1.1, y - r * .95)} ${P(x, y - r * .98)} Q${P(x + r * 1.1, y - r * .95)} ${P(x + r * 1.05, y + r * .55)} Q${P(x, y + r * .2)} ${P(x - r * 1.05, y + r * .55)} Z`, cel(col, cold), 4.5);
    s += ln(`M${P(x - r * .8, y + r * .2)} Q${P(x, y - r * .1)} ${P(x + r * .8, y + r * .2)}`, o.trim || '#ffd21f', 2.6);
    s += hl(x - sd * r * .3, y - r * .45, r * .32, r * .14, sd * -20, .55);
    if (o.rivet !== false) s += rivet(x + sd * r * .1, y - r * .35, 2.4);
  }
  return s;
}
function chestPlate(g, col, cold, emblem = '', o = {}) {
  const { sy, sw, ww } = g, y0 = sy + 4, w = Math.min(sw, ww + 6) * .78, h = (HIP - sy) * .5;
  return pa(`M${P(100 - w, y0)} Q${P(100, y0 - 6)} ${P(100 + w, y0)} L${P(100 + w * .8, y0 + h * .7)} Q${P(100, y0 + h * 1.15)} ${P(100 - w * .8, y0 + h * .7)} Z`, cel(col, cold), 4.5) +
    ln(`M${P(100 - w * .78, y0 + 4)} Q${P(100, y0 - 1)} ${P(100 + w * .78, y0 + 4)}`, o.trim || '#ffd21f', 2.6) + emblem;
}
// Hào quang dạng 4 theo hệ, nằm sau lưng
const EL_COL = {
  fire: ['#ff8a1f', '#ffd21f'], ice: ['#7fe8ff', '#ffffff'], thunder: ['#ffd21f', '#33e1ff'], stone: ['#ffb21f', '#c99a6b'],
  forest: ['#7be35a', '#d8ffb8'], shadow: ['#b46bff', '#ff4fd8'], metal: ['#33e1ff', '#ff2e4a']
};
function auraBack(el, g) {
  if (PET_LITE) return '';
  const [a, b] = EL_COL[el], cy = g.hy + 34;
  let rays = '';
  for (let i = 0; i < 10; i++) {
    const a0 = (i * 36 - 7) * Math.PI / 180, a1 = (i * 36 + 7) * Math.PI / 180;
    rays += `<path d="M100,${cy} L${P(100 + 100 * Math.cos(a0), cy + 100 * Math.sin(a0))} L${P(100 + 100 * Math.cos(a1), cy + 100 * Math.sin(a1))} Z" fill="${i % 2 ? a : b}"/>`;
  }
  return `<circle cx="100" cy="${cy}" r="86" fill="${a}" opacity=".16"/><g class="aura" opacity=".28"><g class="spin" style="transform-origin:100px ${cy}px">${rays}</g></g>` +
    `<circle cx="100" cy="${cy}" r="66" fill="none" stroke="${b}" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round" opacity=".7"/>`;
}
// Hạt bay quanh dạng 4
function motes(el, g) {
  if (PET_LITE) return '';
  const [a, b] = EL_COL[el];
  const spots = [[22, g.hy - 18, 7], [176, g.hy + 2, 6], [168, 150, 6.5], [30, 140, 5.5], [150, g.hy - 40, 5]];
  return `<g class="motes">` + spots.map(([x, y, r], i) => {
    if (el === 'fire') return `<g class="ember" style="animation-delay:-${i * .5}s">${ci(x, y, r * .55, i % 2 ? a : b, 1.8)}</g>`;
    if (el === 'thunder') return `<g class="twinkle" style="animation-delay:-${i * .4}s">${bolt(x - 3, y - r, r * 2.2, i % 2 ? '#ffd21f' : '#33e1ff', 1.8)}</g>`;
    if (el === 'forest') return `<g class="ember" style="animation-delay:-${i * .6}s">${leaf(x, y, r * 2, -40 + i * 30, '#9df27a', '#2f9a3e', 1.8)}</g>`;
    if (el === 'stone') return `<g class="float" style="animation-delay:-${i * .5}s">${pa(`M${P(x - r, y)} L${P(x - r * .3, y - r)} L${P(x + r, y - r * .5)} L${P(x + r * .6, y + r * .7)} L${P(x - r * .5, y + r * .7)} Z`, '#a58060', 1.8)}</g>`;
    return spark4(x, y, r, i % 2 ? a : b, 1.8, 'twinkle', i * .35);
  }).join('') + `</g>`;
}

/* ----- Đồ dùng chung cho đầu ----- */
// Tai nhọn, gốc tại (x, y) bên sd, cao h, nghiêng tilt (độ)
function earPointy(x, y, sd, h, w, tilt, c, inner) {
  const t = tilt * Math.PI / 180, tx = x + sd * Math.sin(t) * h, ty = y - Math.cos(t) * h;
  const outer = `M${P(x - sd * w * .5, y + 4)} Q${P(x - sd * w * .4 + (tx - x) * .4, y - h * .55)} ${P(tx, ty)} Q${P(x + sd * w * .75, y - h * .35)} ${P(x + sd * w * .6, y + 6)} Z`;
  const ix = x + (tx - x) * .14, iy = y - h * .1;
  const innerD = `M${P(ix - sd * w * .25, iy + 2)} Q${P(ix + (tx - ix) * .45 - sd * 2, iy - h * .45)} ${P(x + (tx - x) * .8, y - (y - ty) * .8)} Q${P(ix + sd * w * .4, iy - h * .3)} ${P(ix + sd * w * .32, iy + 3)} Z`;
  return { outer, inner: `<path d="${innerD}" fill="${inner}"/>` };
}
function snout(cx, cy, rx, ry, col, noseCol = OL) {
  return el(cx, cy, rx, ry, col, 4) +
    pa(`M${P(cx - rx * .42, cy - ry * .78)} Q${P(cx, cy - ry * 1.12)} ${P(cx + rx * .42, cy - ry * .78)} Q${P(cx + rx * .2, cy - ry * .18)} ${P(cx, cy - ry * .14)} Q${P(cx - rx * .2, cy - ry * .18)} ${P(cx - rx * .42, cy - ry * .78)} Z`, noseCol, 0) +
    hl(cx - rx * .14, cy - ry * .78, rx * .14, ry * .1, 0, .8);
}
// Miệng nhếch có răng nanh
function grin(cx, cy, w, f = 1, o = {}) {
  let s = ln(`M${P(cx - w, cy - 2)} Q${P(cx - w * .45, cy + 5)} ${P(cx, cy + 1)} Q${P(cx + w * .5, cy + 5)} ${P(cx + w * 1.05, cy - 4)}`, OL, 3.5);
  s += pa(`M${P(cx + w * .38, cy + 2.6)} l${f1(2.4 + f * .4)},${f1(5 + f)} l${f1(2.4 + f * .4)},${f1(-5.4 - f)}`, '#fff', 2.2);
  if (f >= 3 || o.both) s += pa(`M${P(cx - w * .55, cy + 2)} l${f1(2.2 + f * .3)},${f1(4.5 + f)} l${f1(2.2 + f * .3)},${f1(-4.5 - f)}`, '#fff', 2.2);
  return s;
}
const cheekFluff = (cx, cy, rx, sd, n, len, col) => {
  let d = `M${P(cx + sd * rx * .7, cy - 10)}`;
  for (let i = 0; i < n; i++) { const y = cy - 6 + i * 9; d += ` L${P(cx + sd * (rx + len), y + 1)} L${P(cx + sd * (rx - 2), y + 6)}`; }
  d += ` L${P(cx + sd * rx * .6, cy + n * 9)} Z`;
  return `<path d="${d}"/>`;
};

/* ===================== 28 LOÀI ===================== */
// c: màu (b base, s shade, l sáng, d tối, a nhấn, i mống mắt); c4: màu dạng 4
const PET_SPECS = {};
const colFor = (S, f) => f >= 4 ? Object.assign({}, S.c, S.c4 || {}) : S.c;

/* ---------- LỬA ---------- */
// Bờm lửa xòe sau đầu
function flameMane(g, n, h) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (-150 + i * 120 / (n - 1)) * Math.PI / 180, r = g.hrx * .82;
    const x = 100 + Math.cos(a) * r, y = g.hy + Math.sin(a) * r * .9;
    s += `<g transform="rotate(${f1(a * 180 / Math.PI + 90)} ${f1(x)} ${f1(y)})">${flame(x, y + 6, h, h * .6, 0, true, 4)}</g>`;
  }
  return s;
}
// Đuôi lửa vẫy sau lưng, bên phải
function fireTail(g, th) {
  const x = 100 + g.hw - 2, y = HIP - 6;
  return `<g class="pt" style="transform-origin:${f1(x)}px ${y}px">` +
    pa(`M${P(x - 10, y + 4)} C${P(x + th * .35, y + 6)} ${P(x + th * .75, y - th * .2)} ${P(x + th * .7, y - th * .7)} C${P(x + th * .86, y - th * .62)} ${P(x + th * .95, y - th * .8)} ${P(x + th * .88, y - th * 1.05)} C${P(x + th * .78, y - th * .9)} ${P(x + th * .66, y - th * .95)} ${P(x + th * .58, y - th * 1.1)} C${P(x + th * .5, y - th * .75)} ${P(x + th * .45, y - th * .55)} ${P(x + th * .2, y - th * .35)} C${P(x + th * .12, y - th * .28)} ${P(x, y - th * .2)} ${P(x - 12, y - 8)} Z`, 'url(#gFlame)', 5) +
    pa(`M${P(x, y)} C${P(x + th * .3, y - 1)} ${P(x + th * .55, y - th * .25)} ${P(x + th * .58, y - th * .6)} C${P(x + th * .45, y - th * .45)} ${P(x + th * .3, y - th * .3)} ${P(x, y - 8)} Z`, '#fff59a', 0) + `</g>`;
}

/* ----- Neo trang phục mặc định ----- */
function stdAnc(g, o = {}) {
  return {
    head: [100, o.headTop ?? g.hy - g.hry, (o.headW ?? g.hrx * 1.5)],
    eyes: [100, o.eyeY ?? g.hy - 2, o.eyeW ?? g.hrx * 1.3],
    neck: [100, o.neckY ?? g.sy + 2, o.neckW ?? g.sw * 1.55],
    back: [100, g.sy, g.sw * 2, HIP - g.sy],
    body: [100, g.sy + (HIP - g.sy) * .42, Math.min(g.sw, g.ww + 6) * 2, (HIP - g.sy)]
  };
}

/* ===================== GHÉP LỚP ===================== */
const PET_CACHE = new Map();
let PET_LITE = false; // bản nhẹ cho trại chung: bỏ hào quang và hạt bay
function petParts(id, f) {
  const S = PET_SPECS[id], g = RIG[f], c = colFor(S, f);
  return S.draw(f, g, c);
}
// Vòng hào quang theo đầu thật của pet: [x tâm, y tâm, bán kính ngang].
// Pet v3 không còn đầu ở giữa khung theo RIG; mỗi hệ trả vị trí đầu dưới một tên, đọc theo thứ tự:
//   1. hình học đầu { hx, hy, hrx, hry }: p.g (Thép) → p.fxg (Lửa) → p.geo (Sấm) → p.rig (Bóng đêm) → anc.fx (Đá); thiếu hx thì x = 100
//   2. anc.halo = [x, y, rx] (Rừng)
//   3. suy từ neo mũ anc.head = [x, đỉnh đầu, rộng] (Băng)
// Không có gì thì trả null: hào quang theo RIG như cũ (x = 100).
function haloAt(p) {
  const a = p.anc || {}, h = p.g || p.fxg || p.geo || p.rig || a.fx;
  if (h && isFinite(h.hy) && isFinite(h.hry) && isFinite(h.hrx)) return [h.hx ?? 100, h.hy - h.hry - 8, h.hrx * .7];
  if (a.halo && a.halo.length >= 3) return a.halo;
  if (a.head) return [a.head[0], a.head[1] - 12, a.head[2] * .45];
  return null;
}
function petInner(id, f = 1, o = {}) {
  const key = id + '|' + f + '|' + JSON.stringify(o.eq || {}) + '|' + (o.sil ? 1 : 0) + (o.lite ? 'L' : '');
  if (PET_CACHE.has(key)) return PET_CACHE.get(key);
  const prevLite = PET_LITE; PET_LITE = !!o.lite;
  const g = RIG[f], p = petParts(id, f), eq = o.eq || {};
  const ha = eq.fx ? haloAt(p) : null, gx = ha ? Object.assign({}, g, { halo: ha }) : g; // hình học cho hiệu ứng
  const W = typeof wearSVG === 'function' ? wearSVG : () => '';
  let s = groundShadow(g);
  s += `<g class="pb">`;
  s += W('fxb', eq.fx, p.anc, gx, id) + W('back', eq.back, p.anc, g, id);
  s += p.back + p.body + W('body', eq.body, p.anc, g, id) + W('neck', eq.neck, p.anc, g, id);
  s += `<g class="ph">` + p.head + W('eyes', eq.eyes, p.anc, g, id) + W('head', eq.head, p.anc, g, id) + `</g>`;
  s += p.front + W('fxf', eq.fx, p.anc, gx, id) + `</g>`;
  PET_LITE = prevLite;
  if (o.sil) s = `<g class="sil">${s.replace(/fill="(?!none)[^"]*"/g, 'fill="#120a33"').replace(/stroke="(?!none)[^"]*"/g, 'stroke="#120a33"').replace(/ class="[^"]*"/g, '')}</g>`;
  PET_CACHE.set(key, s);
  return s;
}
function petSVG(id, f = 1, o = {}) {
  return `<svg class="pet-svg ${o.cls || ''}" viewBox="0 0 200 200" overflow="visible" aria-hidden="true">${petInner(id, f, o)}</svg>`;
}

/* ===================== Bộ phận dùng chung cho các loài ===================== */
// Sừng cong: gốc (x, y), bên sd, dài len, dày th
function horn(x, y, sd, len, th, col, curl = .5, sw = 4.5) {
  const tx = x + sd * len * curl, ty = y - len;
  const d = `M${P(x - sd * th, y + 3)} Q${P(x - sd * th * .6 + sd * len * .05, y - len * .6)} ${P(tx, ty)} Q${P(x + sd * th * 1.6, y - len * .45)} ${P(x + sd * th, y + 4)} Z`;
  return pa(d, col, sw) + ln(`M${P(x - sd * th * .2, y - len * .2)} Q${P(x + sd * th * .4, y - len * .25)} ${P(x + sd * th * .8, y - len * .15)} M${P(x + sd * th * .1, y - len * .45)} Q${P(x + sd * th * .6, y - len * .5)} ${P(x + sd * th * .7, y - len * .4)}`, 'rgba(20,10,48,.35)', 2);
}
// Sừng đơn giữa trán / mũi
function spike1(x, y, len, w, col, tilt = 0, sw = 4.5) {
  return pa(`M${P(x - w / 2, y)} Q${P(x - w * .3 + tilt * .3, y - len * .55)} ${P(x + tilt, y - len)} Q${P(x + w * .35 + tilt * .2, y - len * .5)} ${P(x + w / 2, y)} Z`, col, sw);
}
// Cánh dơi/rồng sau lưng
function batWing(g, sd, span, h, col, mem, sw = 5) {
  const x0 = 100 + sd * g.sw * .45, y0 = g.sy + 6;
  const tip = [x0 + sd * span, y0 - h];
  const f1x = x0 + sd * span * .98, f1y = y0 - h * .1, f2x = x0 + sd * span * .7, f2y = y0 + h * .28, f3x = x0 + sd * span * .38, f3y = y0 + h * .32;
  const d = `M${P(x0, y0)} Q${P(x0 + sd * span * .35, y0 - h * 1.05)} ${P(tip[0], tip[1])} L${P(f1x, f1y)} Q${P(x0 + sd * span * .85, y0 + h * .05)} ${P(f2x, f2y)} Q${P(x0 + sd * span * .55, y0 + h * .12)} ${P(f3x, f3y)} Q${P(x0 + sd * span * .2, y0 + h * .2)} ${P(x0, y0 + 12)} Z`;
  return pa(d, mem, sw) + ln(`M${P(x0 + sd * 4, y0 - 2)} L${P(tip[0], tip[1])} M${P(x0 + sd * span * .32, y0 - h * .62)} L${P(f1x, f1y)} M${P(x0 + sd * span * .32, y0 - h * .62)} L${P(f2x, f2y)} M${P(x0 + sd * span * .32, y0 - h * .62)} L${P(f3x, f3y)}`, col, 4) +
    ci(tip[0], tip[1], 3, col, 2.2);
}
// Cánh lông vũ sau lưng (chim, phượng)
function featherWing(g, sd, span, h, c1, c2, c3, sw = 4.5) {
  const x0 = 100 + sd * g.sw * .4, y0 = g.sy + 4;
  let s = '';
  const rows = [[1, c3], [.78, c2], [.55, c1]];
  rows.forEach(([k, col], ri) => {
    const n = 4;
    let d = `M${P(x0, y0 + 8)} Q${P(x0 + sd * span * k * .3, y0 - h * k * 1.05)} ${P(x0 + sd * span * k, y0 - h * k * .9)}`;
    for (let i = 0; i < n; i++) {
      const t = (i + 1) / n, px = x0 + sd * span * k * (1 - t * .55), py = y0 - h * k * .9 + h * k * 1.25 * t;
      const qx = x0 + sd * span * k * (1 - (t - .5 / n) * .55) + sd * 8, qy = py - h * k * .2;
      d += ` Q${P(qx, qy)} ${P(px, py)}`;
    }
    d += ` Q${P(x0 + sd * 10, y0 + h * .2)} ${P(x0, y0 + 14)} Z`;
    s += pa(d, col, sw);
  });
  return s;
}
// Mặt sáng nửa dưới
function lowerFace(g, col, top = 9, k = .74) {
  const { hy, hrx, hry } = g;
  return pa(`M${P(100 - hrx * k, hy + top)} Q${P(100 - hrx * .3, hy + top - 6)} ${P(100, hy + top - 1)} Q${P(100 + hrx * .3, hy + top - 6)} ${P(100 + hrx * k, hy + top)} Q${P(100 + hrx * k * .9, hy + hry * .92)} ${P(100, hy + hry * .98)} Q${P(100 - hrx * k * .9, hy + hry * .92)} ${P(100 - hrx * k, hy + top)} Z`, col, 0);
}
// Đuôi mập vẫy, có thể thêm đầu đuôi
function tailBack(g, len, w, col, tipFn) {
  const x = 100 + g.hw - 6, y = HIP - 4, ex = x + len * .75, ey = y - len * .55;
  let s = `<g class="pt" style="transform-origin:${f1(x)}px ${y}px">` + tube(`M${P(x - 8, y + 2)} Q${P(x + len * .6, y + 8)} ${P(ex, ey)}`, col, w, 5);
  if (tipFn) s += tipFn(ex, ey);
  return s + `</g>`;
}

// Vành gai vàng (dạng 4)
function crownSpikes(x, y, w) {
  return pa(`M${P(x - w * .55, y + 6)} L${P(x - w * .5, y - 8)} L${P(x - w * .25, y)} L${P(x, y - 16)} L${P(x + w * .25, y)} L${P(x + w * .5, y - 8)} L${P(x + w * .55, y + 6)} Q${P(x, y + 10)} ${P(x - w * .55, y + 6)} Z`, 'url(#gGold)', 4) +
    ci(x, y - 2, 3.6, '#ff3b4f', 2) + ci(x - w * .36, y + 2, 2.4, '#33e1ff', 1.6) + ci(x + w * .36, y + 2, 2.4, '#33e1ff', 1.6);
}



/* ---------- BĂNG ---------- */
// v3: mỗi dạng một dáng riêng (bé con → thiếu niên → trưởng thành → tối thượng).
// Mỗi loài giữ draw(f, g, c) như cũ nhưng vẽ theo bảng forms[f]; g (RIG) chỉ dùng cho bóng chân/hiệu ứng chung.

// Giữ lại cho tương thích (bản cũ có dùng)
function iceCrest(x, y, n, h, sw = 3.5) {
  let s = '';
  for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2, hh = h * (1 - Math.abs(k) * .28); s += crystal(x + k * h * .42, y + Math.abs(k) * 3, hh, h * .42, '#dffaff', '#5fc8f0', sw, k * 4); }
  return s;
}
// Viền lông xù: cung elip a0→a1 (độ, chiều kim đồng hồ) gồm n gợn phồng ra ngoài k
function iceFluffD(cx, cy, rx, ry, n, k = .1, a0 = 0, a1 = 360, cmd = 'M') {
  const pt = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const st = (a1 - a0) / n;
  let d = `${cmd}${P(...pt(a0))}`;
  for (let i = 0; i < n; i++) {
    const [mx_, my] = pt(a0 + (i + .5) * st);
    d += ` Q${P(cx + (mx_ - cx) * (1 + k * 2), cy + (my - cy) * (1 + k * 2))} ${P(...pt(a0 + (i + 1) * st))}`;
  }
  return d;
}
// Đường cong mượt (Catmull-Rom) qua các điểm: dựng dáng thân hữu cơ
function iceCurve(pts, closed = true, t = 1) {
  const n = pts.length, get = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
  let d = `M${P(...pts[0])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    d += ` C${P(p1[0] + (p2[0] - p0[0]) / 6 * t, p1[1] + (p2[1] - p0[1]) / 6 * t)} ${P(p2[0] - (p3[0] - p1[0]) / 6 * t, p2[1] - (p3[1] - p1[1]) / 6 * t)} ${P(...p2)}`;
  }
  return d + (closed ? ' Z' : '');
}
// Dải thuôn theo đường tâm mượt (vòi, đuôi): trả về { d, l, r } (viền kín, mép trái, mép phải)
function iceTaper(pts, w0, w1, seg = 4) {
  const n = pts.length, get = i => pts[Math.max(0, Math.min(n - 1, i))], S = [];
  for (let i = 0; i < n - 1; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
    for (let k = 0; k < seg; k++) {
      const t = k / seg, t2 = t * t, t3 = t2 * t;
      S.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  S.push(pts[n - 1]);
  const L = [], Rr = [];
  S.forEach((p, i) => {
    const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (S.length - 1)) / 2;
    L.push([p[0] - dy / m * w, p[1] + dx / m * w]); Rr.push([p[0] + dy / m * w, p[1] - dx / m * w]);
  });
  const e = L[L.length - 1], r1 = Rr[Rr.length - 1];
  const d = `M${L.map(p => P(...p)).join(' L')} A${f1(w1 / 2)},${f1(w1 / 2)} 0 0 0 ${P(...r1)} L${Rr.slice().reverse().map(p => P(...p)).join(' L')} Z`;
  return { d, l: L, r: Rr, e };
}
// Bông tuyết 6 cánh có viền
function iceFlake(x, y, r, col = '#ffffff', cls = '', delay = 0, simple = false) {
  let d = '';
  for (let i = 0; i < (simple ? 3 : 6); i++) {
    const a = (i * 60 - 90) * Math.PI / 180, bx = x + Math.cos(a) * r * .55, by = y + Math.sin(a) * r * .55;
    d += simple ? `M${P(x - Math.cos(a) * r, y - Math.sin(a) * r)}L${P(x + Math.cos(a) * r, y + Math.sin(a) * r)}` : `M${P(x, y)}L${P(x + Math.cos(a) * r, y + Math.sin(a) * r)}`;
    if (!simple) for (const s of [-1, 1]) { const b = a + s * .85; d += `M${P(bx, by)}l${f1(Math.cos(b) * r * .4)},${f1(Math.sin(b) * r * .4)}`; }
  }
  const w = Math.max(1.8, r * .28);
  return `<g${cls ? ` class="${cls}" style="animation-delay:-${delay}s"` : ''}>` + ln(d, OL, w + 3.4) + ln(d, col, w) + `</g>`;
}
// Vòng tuyết xoáy quanh dạng 4 (quay chậm)
function iceSwirl(cx, cy, R, n = 7, seed = 0) {
  if (PET_LITE) return '';
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = (i * 360 / n + seed) * Math.PI / 180, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R;
    s += i % 2 ? iceFlake(x, y, 5.5 + (i % 3), i % 3 ? '#ffffff' : '#bff4ff', '', 0, true) : ci(x, y, 3.2, '#ffffff', 2);
    // vệt gió theo vòng
    const a0 = a + .18, a1 = a + .62, r2 = R - 4 - (i % 3) * 5;
    const d = `M${P(cx + Math.cos(a0) * r2, cy + Math.sin(a0) * r2)} A${f1(r2)},${f1(r2)} 0 0 1 ${P(cx + Math.cos(a1) * r2, cy + Math.sin(a1) * r2)}`;
    s += ln(d, OL, 6.5, 'opacity=".55"') + ln(d, '#ffffff', 3, 'opacity=".9"');
  }
  return `<g class="spin" style="transform-origin:${f1(cx)}px ${f1(cy)}px">${s}</g>`;
}
// Cực quang hình vòm phía sau (dạng 4): các dải cong lượn sóng quanh tâm (cx, cy)
function iceAurora(cx, cy, R, th = 22, a0 = 200, a1 = 340) {
  if (PET_LITE) return '';
  const bands = [[R, ['#7dffcf', '#33e1ff', '#1f6fd1'], .5], [R - th * .9, ['#33e1ff', '#8a5cff', '#ff4fd8'], .42]];
  let s = '';
  bands.forEach(([r, cols, op], bi) => {
    const n = 14, pts = [], ins = [];
    for (let i = 0; i <= n; i++) {
      const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180, wv = Math.sin(i * 1.3 + bi * 2) * th * .25, tw = th * (.55 + .45 * Math.sin(Math.PI * i / n));
      pts.push([cx + Math.cos(a) * (r + wv), cy + Math.sin(a) * (r + wv)]);
      ins.push([cx + Math.cos(a) * (r + wv - tw), cy + Math.sin(a) * (r + wv - tw)]);
    }
    s += `<path d="M${pts.map(p => P(...p)).join(' L')} L${ins.reverse().map(p => P(...p)).join(' L')} Z" fill="${lin(...cols)}" opacity="${op}"/>`;
  });
  return `<g class="aurora">${s}</g>`;
}
// Hạt băng lấp lánh (dạng 4)
function iceMotes(spots) {
  if (PET_LITE) return '';
  return `<g class="motes">` + spots.map(([x, y, r], i) => i % 2 ? iceFlake(x, y, r, '#ffffff', 'twinkle', i * .4) : spark4(x, y, r, '#bff4ff', 1.8, 'twinkle', i * .35)).join('') + `</g>`;
}
// Mắt theo dạng: 1 to tròn dễ thương → 4 sắc, phát sáng
function iceEyes(cx, cy, gap, f, skin, iris, k = 1, o = {}) {
  const R = [null, [12.5, 14, 0], [11, 12, .5], [10.5, 10, .85], [10.5, 9.2, 1]][f];
  const opt = { skin, iris, lid: R[2], ...o };
  if (f === 1) { opt.brow = false; opt.pr = R[0] * k * .52; }
  if (f === 4) { opt.glow = o.glow || '#7fe8ff'; opt.iris = o.iris4 || '#7fe8ff'; opt.bw = 6; }
  return eyes2(cx, cy, gap, R[0] * k, R[1] * k, opt);
}
// Má hồng
const iceBlush = (x, y, rx = 5.5, ry = 3.2) => el(x, y, rx, ry, '#ff9ab4', 0, 'opacity=".75"');
// Điểm neo cho dáng tự do: h = đỉnh đầu, e = đường mắt, n = cổ, t = thân [x, đỉnh, đáy, rộng]
function iceAnc(h, e, n, t, bk) {
  const [tx, ty, tb, tw] = t, th = tb - ty;
  return {
    head: [h[0], h[1], h[2]], eyes: [e[0], e[1], e[2]], neck: [n[0], n[1], n[2]],
    back: bk || [tx, ty, tw, (GROUND - 4 - ty) / 1.11],
    body: [tx, ty + th * .42, tw, th]
  };
}

// Phóng cả dạng quanh điểm chân (100, 188); không dùng cho lớp có .spin
function iceScale(o, k, ox = 100, oy = GROUND) {
  const tf = s => s ? `<g transform="matrix(${k},0,0,${k},${f1(ox * (1 - k))},${f1(oy * (1 - k))})">${s}</g>` : '';
  const X = x => ox + (x - ox) * k, Y = y => oy + (y - oy) * k, a = {};
  for (const [key, v] of Object.entries(o.anc)) a[key] = [X(v[0]), Y(v[1]), v[2] * k].concat(v.length > 3 ? [v[3] * k] : []);
  return { back: tf(o.back), body: tf(o.body), head: tf(o.head), front: tf(o.front), anc: a };
}
/* ===== CÁNH CỤT: chim con lông tơ → cánh cụt khăn băng → hiệp sĩ băng → hoàng đế băng ===== */
// Mặt nạ trắng hình tim (đặc điểm nhận diện xuyên suốt)
function pengMask(x, y, w, h, fill = '#ffffff') {
  return pa(`M${P(x, y - h * .38)} C${P(x - w * .22, y - h * .7)} ${P(x - w * .62, y - h * .55)} ${P(x - w * .6, y - h * .05)} C${P(x - w * .58, y + h * .35)} ${P(x - w * .22, y + h * .5)} ${P(x, y + h * .62)} C${P(x + w * .22, y + h * .5)} ${P(x + w * .58, y + h * .35)} ${P(x + w * .6, y - h * .05)} C${P(x + w * .62, y - h * .55)} ${P(x + w * .22, y - h * .7)} ${P(x, y - h * .38)} Z`, fill, 3.5);
}
function pengBeak(x, y, w, h, c) {
  return pa(`M${P(x - w / 2, y)} Q${P(x, y - h * .35)} ${P(x + w / 2, y)} Q${P(x + w * .12, y + h * .55)} ${P(x, y + h)} Q${P(x - w * .12, y + h * .55)} ${P(x - w / 2, y)} Z`, cel(c.beak, '#e07a00'), 3.5) +
    ln(`M${P(x - w * .36, y + h * .22)} Q${P(x, y + h * .34)} ${P(x + w * .36, y + h * .22)}`, OL, 2) + hl(x - w * .15, y + h * .1, w * .14, h * .08, 0, .7);
}
// Thân hình con ki (đầu + thân liền): tâm x, đỉnh đầu, bán kính đầu, cổ, bề ngang thân, đáy
function pengPin(x, top, hr, neckY, bw, bot) {
  return `M${P(x, top)} C${P(x + hr * 1.05, top)} ${P(x + hr * 1.2, top + hr * 1.05)} ${P(x + hr * .92, neckY - hr * .2)} ` +
    `C${P(x + hr * .86, neckY)} ${P(x + bw * .9, neckY + (bot - neckY) * .12)} ${P(x + bw, neckY + (bot - neckY) * .52)} ` +
    `C${P(x + bw * 1.02, bot - (bot - neckY) * .14)} ${P(x + bw * .62, bot)} ${P(x, bot)} ` +
    `C${P(x - bw * .62, bot)} ${P(x - bw * 1.02, bot - (bot - neckY) * .14)} ${P(x - bw, neckY + (bot - neckY) * .52)} ` +
    `C${P(x - bw * .9, neckY + (bot - neckY) * .12)} ${P(x - hr * .86, neckY)} ${P(x - hr * .92, neckY - hr * .2)} ` +
    `C${P(x - hr * 1.2, top + hr * 1.05)} ${P(x - hr * 1.05, top)} ${P(x, top)} Z`;
}
// Vây cánh: gốc (x0,y0) → mũi (x1,y1), rộng w
function pengFlipper(x0, y0, x1, y1, w, fill, sw = 5) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L * w, ny = dx / L * w;
  return pa(`M${P(x0 + nx * .6, y0 + ny * .6)} C${P(x0 + dx * .45 + nx, y0 + dy * .45 + ny)} ${P(x1 + nx * .3, y1 + ny * .3)} ${P(x1, y1)} C${P(x1 - nx * .25, y1 - ny * .25)} ${P(x0 + dx * .5 - nx * .55, y0 + dy * .5 - ny * .55)} ${P(x0 - nx * .6, y0 - ny * .6)} Z`, fill, sw);
}
function pengFeet(xs, y, r, c) {
  return xs.map(([x, sd]) => pa(`M${P(x - r, y)} Q${P(x - r * .9, y - r * .75)} ${P(x, y - r * .7)} Q${P(x + r * .9, y - r * .75)} ${P(x + r, y)} Q${P(x + r * .55, y + r * .35)} ${P(x + r * .25, y + 1)} Q${P(x, y + r * .4)} ${P(x - r * .25, y + 1)} Q${P(x - r * .55, y + r * .35)} ${P(x - r, y)} Z`, cel(c.foot, '#d9650a'), 4)).join('');
}
PET_SPECS.penguin = {
  el: 'ice',
  c: { b: '#3557b8', s: '#1d3378', l: '#ffffff', ls: '#bfe3ff', i: '#33e1ff', beak: '#ffb21f', foot: '#ff9a1f', fuzz: '#a8d4ff', fuzzs: '#6aa6e8', scarf: '#5fe0ff', scarfs: '#1f9fd6', gold: '#ffc21f' },
  c4: { b: '#253f9e', s: '#101f5c', i: '#bff4ff' },
  draw(f, g, c) { return this.forms[f](c, g); },
  forms: [null,
    // 1. Chim con lông tơ tròn
    (c) => {
      const cx = 100, cy = 142, rx = 46, ry = 43;
      let back = '', body = '', head = '', front = '';
      const ball = iceFluffD(cx, cy, rx, ry, 16, .055) + 'Z';
      body += bl(`<path d="${ball}"/><ellipse cx="${cx - rx + 2}" cy="${cy + 10}" rx="8" ry="13" transform="rotate(28 ${cx - rx + 2} ${cy + 10})"/><ellipse cx="${cx + rx - 2}" cy="${cy + 10}" rx="8" ry="13" transform="rotate(-28 ${cx + rx - 2} ${cy + 10})"/>`, cel(c.fuzz, c.fuzzs));
      // lông tơ trên bụng
      body += ln(`M${P(cx - 20, cy + 24)} l4,5 l4,-5 M${P(cx + 10, cy + 28)} l4,5 l4,-5 M${P(cx - 6, cy + 33)} l4,4 l4,-4`, c.fuzzs, 2.4);
      body += pengFeet([[85, -1], [115, 1]], 187, 10, c);
      // Mũ lông xanh than (đỉnh đầu)
      const cap = iceFluffD(cx, cy, rx - 2.8, ry - 2.8, 7, .055, 191.25, 348.75) + ` Q${P(cx + 34, cy + 2)} ${P(cx + 20, cy + 4)} Q${P(cx, cy - 2)} ${P(cx - 20, cy + 4)} Q${P(cx - 34, cy + 2)} ${P(cx - rx + 2.8 + .5, cy - 8)} Z`;
      head += pa(cap, cel(c.b, c.s), 0);
      head += pengMask(cx, cy - 6, 58, 40);
      // chỏm lông xoăn
      head += pa(`M${P(cx - 5, cy - ry + 3)} C${P(cx - 8, cy - ry - 9)} ${P(cx + 4, cy - ry - 18)} ${P(cx + 11, cy - ry - 12)} C${P(cx + 6, cy - ry - 12)} ${P(cx + 1, cy - ry - 7)} ${P(cx + 5, cy - ry + 2)} Z`, cel(c.b, c.s), 3.5);
      head += iceEyes(cx, cy - 11, 14.5, 1, c.l, c.i, .8);
      head += pengBeak(cx, cy + 3, 12, 10, c);
      head += iceBlush(cx - 29, cy + 3) + iceBlush(cx + 29, cy + 3);
      head += hl(cx - 26, cy - 26, 8, 4.5);
      return { back, body, head, front, anc: iceAnc([cx, cy - ry + 3, 60], [cx, cy - 11, 50], [cx, cy + 12, 62], [cx, cy + 4, cy + ry - 2, 70], [cx, cy - 8, 78, 50]) };
    },
    // 2. Cánh cụt đứng thẳng, khăn băng bay, vây dang thăng bằng
    (c) => {
      const x = 100, top = 60, hr = 29, nk = 104, bw = 40, bot = 184;
      let back = '', body = '', head = '', front = '';
      // đuôi khăn bay ngang sau lưng
      back += pa(`M${P(124, 104)} C${P(142, 96)} ${P(156, 110)} ${P(176, 98)} L${P(182, 112)} L${P(174, 110)} L${P(178, 122)} C${P(160, 126)} ${P(144, 114)} ${P(126, 118)} Z`, cel(c.scarf, c.scarfs), 4) +
        ln(`M${P(150, 106)} l3,10 M${P(162, 104)} l3,11`, '#ffffff', 2.4, 'opacity=".8"');
      // vây trái giơ cao vẫy, vây phải dang ra
      body += pengFlipper(70, 118, 36, 84, 11, cel(c.b, c.s));
      body += pengFlipper(130, 122, 164, 150, 11, cel(c.b, c.s));
      body += pa(pengPin(x, top, hr, nk, bw, bot), cel(c.b, c.s), 5.5);
      body += pa(`M${P(x, 112)} C${P(x + 24, 112)} ${P(x + 33, 140)} ${P(x + 30, 160)} C${P(x + 27, 176)} ${P(x + 14, 182)} ${P(x, 182)} C${P(x - 14, 182)} ${P(x - 27, 176)} ${P(x - 30, 160)} C${P(x - 33, 140)} ${P(x - 24, 112)} ${P(x, 112)} Z`, cel(c.l, c.ls), 0);
      body += hl(x - 30, 128, 4, 10, 15, .4);
      body += pengFeet([[84, -1], [116, 1]], 187, 12, c);
      // Đầu
      head += pengMask(x, top + 30, 60, 42);
      head += pa(`M${P(x - 4, top + 2)} C${P(x - 8, top - 10)} ${P(x + 2, top - 18)} ${P(x + 12, top - 16)} C${P(x + 6, top - 12)} ${P(x + 4, top - 6)} ${P(x + 8, top - 2)} C${P(x + 12, top - 10)} ${P(x + 20, top - 12)} ${P(x + 24, top - 8)} C${P(x + 16, top - 6)} ${P(x + 12, top)} ${P(x + 10, top + 4)} Z`, cel(c.b, c.s), 3.5);
      head += iceEyes(x, top + 27, 12.5, 2, c.l, c.i, .86);
      head += pengBeak(x, top + 38, 15, 13, c);
      head += iceBlush(x - 23, top + 43, 4.5, 2.6) + iceBlush(x + 23, top + 43, 4.5, 2.6);
      head += hl(x - 16, top + 8, 7, 3.5);
      // Khăn băng quấn cổ
      body += pa(`M${P(x - 31, nk + 2)} Q${P(x, nk + 12)} ${P(x + 31, nk + 2)} L${P(x + 30, nk + 13)} Q${P(x, nk + 24)} ${P(x - 30, nk + 13)} Z`, cel(c.scarf, c.scarfs), 4) +
        ln(`M${P(x - 18, nk + 8)} l2,9 M${P(x - 4, nk + 11)} l1,10 M${P(x + 10, nk + 10)} l-1,10`, '#ffffff', 2.4, 'opacity=".8"') +
        pa(`M${P(x + 18, nk + 12)} Q${P(x + 26, nk + 26)} ${P(x + 22, nk + 40)} L${P(x + 30, nk + 38)} Q${P(x + 34, nk + 24)} ${P(x + 28, nk + 10)} Z`, cel(c.scarf, c.scarfs), 3.5);
      return { back, body, head, front, anc: iceAnc([x, top + 3, 56], [x, top + 28, 50], [x, nk + 4, 64], [x, nk + 6, bot, 70], [x, nk + 4, 76, bot - nk - 8]) };
    },
    // 3. Hiệp sĩ băng: mũ giáp mào gai, vây bọc lưỡi băng, đốm vàng tai
    (c) => {
      const x = 100, top = 52, hr = 26, nk = 98, bw = 42, bot = 184;
      let back = '', body = '', head = '', front = '';
      // khăn dài bay sau lưng
      back += pa(`M${P(122, 98)} C${P(140, 86)} ${P(150, 104)} ${P(168, 90)} C${P(174, 86)} ${P(180, 84)} ${P(186, 86)} L${P(184, 96)} L${P(190, 100)} L${P(184, 106)} C${P(170, 104)} ${P(160, 118)} ${P(140, 112)} C${P(134, 110)} ${P(128, 112)} ${P(124, 112)} Z`, cel(c.scarf, c.scarfs), 4) +
        ln(`M${P(152, 100)} l2,10 M${P(166, 96)} l2,10`, '#ffffff', 2.4, 'opacity=".8"');
      // vây cầm lưỡi băng dài chĩa xuống chéo
      for (const sd of [-1, 1]) {
        const bx = x + sd * 60, by = 146, tx = x + sd * 88, ty = 186;
        const dx = tx - bx, dy = ty - by, L = Math.hypot(dx, dy), nx = -dy / L * 8, ny = dx / L * 8;
        body += pa(`M${P(bx - dx * .12 + nx, by - dy * .12 + ny)} L${P(bx + dx * .55 + nx * 1.1, by + dy * .55 + ny * 1.1)} L${P(tx, ty)} L${P(bx + dx * .55 - nx * 1.1, by + dy * .55 - ny * 1.1)} L${P(bx - dx * .12 - nx, by - dy * .12 - ny)} Z`, cel('#f2ffff', '#7fd0f0'), 4) +
          ln(`M${P(bx, by)} L${P(tx - dx * .06, ty - dy * .06)}`, '#ffffff', 2.4, 'opacity=".9"') + ln(`M${P(bx + dx * .55 + nx * 1.1, by + dy * .55 + ny * 1.1)} L${P(bx + dx * .2, by + dy * .2)}`, '#5fc8f0', 1.8);
        body += pengFlipper(x + sd * 36, 110, x + sd * 62, 150, 12, cel(c.b, c.s));
        body += pa(`M${P(bx - sd * 9, by - 10)} L${P(bx + sd * 12, by - 2)} L${P(bx + sd * 7, by + 8)} L${P(bx - sd * 12, by)} Z`, cel('#eef3fa', '#9aa8c8'), 3.5);
      }
      body += pa(pengPin(x, top, hr, nk, bw, bot), cel(c.b, c.s), 5.5);
      body += pa(`M${P(x, 104)} C${P(x + 26, 104)} ${P(x + 35, 136)} ${P(x + 32, 158)} C${P(x + 29, 176)} ${P(x + 15, 182)} ${P(x, 182)} C${P(x - 15, 182)} ${P(x - 29, 176)} ${P(x - 32, 158)} C${P(x - 35, 136)} ${P(x - 26, 104)} ${P(x, 104)} Z`, cel(c.l, c.ls), 0);
      // huy hiệu tinh thể trên ngực
      body += pa(`M${P(x, 118)} L${P(x + 10, 132)} L${P(x, 148)} L${P(x - 10, 132)} Z`, cel('#bff4ff', '#33a8e6'), 3.5) + ln(`M${P(x - 10, 132)} L${P(x + 10, 132)} M${P(x, 118)} L${P(x, 148)}`, OL, 1.6, 'opacity=".5"');
      body += hl(x - 32, 124, 4, 11, 15, .4);
      body += pengFeet([[82, -1], [118, 1]], 187, 13, c);
      // Khăn quấn cổ + khóa bạc
      body += pa(`M${P(x - 30, nk)} Q${P(x, nk + 10)} ${P(x + 30, nk)} L${P(x + 29, nk + 11)} Q${P(x, nk + 21)} ${P(x - 29, nk + 11)} Z`, cel(c.scarf, c.scarfs), 4) + ci(x - 18, nk + 9, 5, '#e6eefc', 2.6);
      // Đầu: đốm vàng tai, mặt nạ, mũ giáp
      head += [-1, 1].map(sd => pa(`M${P(x + sd * 20, top + 34)} Q${P(x + sd * 30, top + 38)} ${P(x + sd * 25, top + 50)} Q${P(x + sd * 20, top + 44)} ${P(x + sd * 17, top + 40)} Z`, cel(c.gold, '#e08a00'), 3)).join('');
      head += pengMask(x, top + 31, 52, 36);
      head += pa(`M${P(x - hr - 2, top + 22)} C${P(x - hr - 4, top - 4)} ${P(x + hr + 4, top - 4)} ${P(x + hr + 2, top + 22)} L${P(x + 14, top + 22)} L${P(x, top + 28)} L${P(x - 14, top + 22)} Z`, cel('#bff4ff', '#4fb3e6'), 4.5);
      head += ln(`M${P(x - hr, top + 18)} L${P(x - 14, top + 18)} L${P(x, top + 24)} L${P(x + 14, top + 18)} L${P(x + hr, top + 18)}`, '#ffffff', 2.4, 'opacity=".85"');
      head += crystal(x - 13, top + 4, 22, 11, '#dffaff', '#5fc8f0', 3.5, -8) + crystal(x + 13, top + 4, 22, 11, '#dffaff', '#5fc8f0', 3.5, 8) + crystal(x, top + 2, 32, 13, '#ffffff', '#5fc8f0', 3.5);
      head += hl(x - 14, top + 10, 6, 3, -25, .6);
      head += iceEyes(x, top + 30, 11.5, 3, c.l, c.i, .88);
      head += pengBeak(x, top + 40, 14, 13, c);
      return { back, body, head, front, anc: iceAnc([x, top + 2, 60], [x, top + 30, 46], [x, nk + 2, 62], [x, nk + 6, bot, 72], [x, nk + 2, 80, bot - nk - 6]) };
    },
    // 4. Hoàng đế băng: áo choàng tinh thể, cổ áo pha lê, vương miện, quyền trượng, tuyết xoáy
    (c) => {
      const x = 100, top = 38, hr = 26, nk = 84, bw = 42, bot = 184;
      let back = '', body = '', head = '', front = '';
      back += PET_LITE ? '' : `<circle cx="100" cy="100" r="92" fill="#7fe8ff" opacity=".13"/>`;
      back += iceSwirl(100, 108, 88, 8, 20);
      // Áo choàng pha lê xòe hình chuông, mép là các mũi tinh thể
      let hem = `M${P(58, 88)} C${P(34, 104)} ${P(18, 150)} ${P(10, 182)}`;
      const tips = [[20, 194], [34, 184], [48, 196], [62, 186], [76, 194]];
      tips.forEach(([tx, ty]) => { hem += ` L${P(tx, ty)} L${P(tx + 7, ty - 10)}`; });
      hem += ` L${P(86, 182)} L${P(114, 182)}`;
      tips.slice().reverse().forEach(([tx, ty]) => { hem += ` L${P(200 - tx - 7, ty - 10)} L${P(200 - tx, ty)}`; });
      hem += ` L${P(190, 182)} C${P(182, 150)} ${P(166, 104)} ${P(142, 88)} Z`;
      back += pa(hem, cel('#5fc8f5', '#2a63c8'), 5);
      back += ln(`M${P(46, 112)} L${P(28, 178)} M${P(62, 116)} L${P(54, 184)} M${P(154, 112)} L${P(172, 178)} M${P(138, 116)} L${P(146, 184)}`, '#bff4ff', 2.6, 'opacity=".8"');
      back += ln(`M${P(37, 146)} L${P(52, 140)} L${P(66, 150)} M${P(163, 146)} L${P(148, 140)} L${P(134, 150)}`, '#bff4ff', 2.2, 'opacity=".6"');
      // cụm pha lê trên hai vai
      for (const sd of [-1, 1]) for (const [a, len, w] of [[14, 30, 13], [38, 40, 15], [64, 28, 12]]) {
        const bx = x + sd * (30 + a * .2), by = nk + 12 - a * .05;
        back += `<g transform="rotate(${sd * a} ${f1(bx)} ${f1(by)})">${crystal(bx, by, len, w, '#e6fbff', '#4fb3e6', 3.5)}</g>`;
      }
      // quyền trượng
      back += tube(`M${P(158, 186)} L${P(164, 60)}`, '#eef3fa', 5, 3.5) + ln(`M${P(159, 160)} l4,0 M${P(161, 112)} l4,0`, '#9aa8c8', 3);
      back += (PET_LITE ? '' : `<circle cx="164" cy="50" r="21" fill="#7fe8ff" opacity=".25"/>`) + ci(164, 50, 13, 'url(#gIce)', 4) + iceFlake(164, 50, 9, '#ffffff');
      body += pengFlipper(x - 38, 104, x - 58, 158, 13, cel(c.b, c.s));
      body += pengFlipper(x + 38, 104, 158, 126, 12, cel(c.b, c.s));
      body += pa(pengPin(x, top, hr, nk, bw, bot), cel(c.b, c.s), 5.5);
      body += pa(`M${P(x, 94)} C${P(x + 26, 94)} ${P(x + 36, 132)} ${P(x + 33, 156)} C${P(x + 30, 176)} ${P(x + 15, 182)} ${P(x, 182)} C${P(x - 15, 182)} ${P(x - 30, 176)} ${P(x - 33, 156)} C${P(x - 36, 132)} ${P(x - 26, 94)} ${P(x, 94)} Z`, cel(c.l, c.ls), 0);
      body += ci(x, 134, 12, 'url(#gIce)', 3.5) + iceFlake(x, 134, 8, '#ffffff');
      body += hl(x - 32, 120, 4, 12, 15, .4);
      body += pengFeet([[84, -1], [116, 1]], 187, 13, c);
      // khăn choàng lông tuyết trên vai
      body += pa(iceFluffD(x, nk + 4, 40, 13, 10, .09, 180, 360) + ` Q${P(x, nk + 30)} ${P(x - 40, nk + 4)} Z`, cel('#ffffff', '#bfe3ff'), 4) +
        [-24, -8, 8, 24].map(dx => el(x + dx, nk + 12 + (Math.abs(dx) < 10 ? 3 : 0), 1.8, 3, '#1f6fd1', 0)).join('');
      // vây phải nắm trượng
      body += ci(160, 126, 7.5, cel(c.b, c.s), 4);
      // Đầu
      head += [-1, 1].map(sd => pa(`M${P(x + sd * 19, top + 30)} Q${P(x + sd * 32, top + 34)} ${P(x + sd * 27, top + 50)} Q${P(x + sd * 21, top + 42)} ${P(x + sd * 16, top + 37)} Z`, cel(c.gold, '#e08a00'), 3)).join('');
      head += pengMask(x, top + 31, 52, 36);
      head += iceEyes(x, top + 30, 11.5, 4, c.l, c.i, .9);
      head += pengBeak(x, top + 40, 14, 14, c);
      head += hl(x - 16, top + 12, 6, 3);
      // Vương miện băng
      const cy = top + 4;
      head += pa(`M${P(x - 22, cy + 6)} L${P(x - 26, cy - 14)} L${P(x - 14, cy - 4)} L${P(x - 8, cy - 22)} L${P(x, cy - 8)} L${P(x + 8, cy - 22)} L${P(x + 14, cy - 4)} L${P(x + 26, cy - 14)} L${P(x + 22, cy + 6)} Q${P(x, cy + 10)} ${P(x - 22, cy + 6)} Z`, cel('#eef3fa', '#9aa8c8'), 4);
      head += crystal(x, cy - 2, 34, 12, '#dffaff', '#33a8e6', 3.5);
      head += ci(x, cy + 3, 4, '#33e1ff', 2.2) + ci(x - 14, cy + 4, 2.4, '#7fe8ff', 1.6) + ci(x + 14, cy + 4, 2.4, '#7fe8ff', 1.6);
      front += iceMotes([[24, 58, 7], [186, 96, 5.5], [14, 132, 6], [40, 26, 5]]);
      return { back, body, head, front, anc: iceAnc([x, top + 1, 60], [x, top + 30, 46], [x, nk + 2, 66], [x, nk + 6, bot, 76], [x, nk + 2, 84, bot - nk - 6]) };
    }
  ]
};

/* ===== HỔ BĂNG: hổ con nằm cuộn → hổ non rình mồi → hổ sải bước nanh băng → hổ thần ngồi, bờm pha lê, đuôi cực quang ===== */
// Vằn: nêm nhọn từ gốc (x0,y0) rộng w tới mũi (x1,y1)
function tigStripe(x0, y0, x1, y1, w, col) {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, nx = -dy / L * w / 2, ny = dx / L * w / 2;
  return `<path d="M${P(x0 + nx, y0 + ny)} Q${P(x0 + dx * .5 + nx * .9, y0 + dy * .5 + ny * .9)} ${P(x1, y1)} Q${P(x0 + dx * .5 - nx * .9, y0 + dy * .5 - ny * .9)} ${P(x0 - nx, y0 - ny)} Z" fill="${col}"/>`;
}
// Đầu hổ dùng chung mọi dạng (mặt hướng người xem)
function tigHead(cx, cy, R, f, c) {
  let s = '', tuft = '';
  const ex = R * .74, ey = R * .66, er = R * (f === 1 ? .4 : .36);
  for (const sd of [-1, 1]) tuft += `<path d="M${P(cx + sd * R * .86, cy - R * .12)} L${P(cx + sd * R * (1.2 + f * .04), cy + R * .16)} L${P(cx + sd * R * .98, cy + R * .3)} L${P(cx + sd * R * (1.1 + f * .04), cy + R * .52)} L${P(cx + sd * R * .58, cy + R * .8)} Z"/>`;
  // tai: dạng 1 tròn, dạng sau nhọn dần
  const ear = sd => f <= 1 ? `<circle cx="${f1(cx + sd * ex)}" cy="${f1(cy - ey)}" r="${f1(er)}"/>` :
    `<path d="M${P(cx + sd * (ex - er * 1.05), cy - ey + er * .5)} Q${P(cx + sd * (ex - er * .9), cy - ey - er * (1 + f * .12))} ${P(cx + sd * (ex + er * .25), cy - ey - er * (1.05 + f * .14))} Q${P(cx + sd * (ex + er * 1.15), cy - ey - er * .2)} ${P(cx + sd * (ex + er * .9), cy - ey + er * .7)} Z"/>`;
  s += bl(ear(-1) + ear(1) + `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(R * 1.04)}" ry="${f1(R * .9)}"/>` + tuft, cel(c.b, c.s));
  for (const sd of [-1, 1]) s += f <= 1 ? ci(cx + sd * ex, cy - ey, er * .55, c.ear, 0) :
    pa(`M${P(cx + sd * (ex - er * .55), cy - ey + er * .35)} Q${P(cx + sd * (ex - er * .4), cy - ey - er * .6)} ${P(cx + sd * (ex + er * .15), cy - ey - er * (.7 + f * .1))} Q${P(cx + sd * (ex + er * .6), cy - ey - er * .1)} ${P(cx + sd * (ex + er * .45), cy - ey + er * .5)} Z`, c.ear, 0);
  // vằn trán và má
  const st = c.st;
  s += tigStripe(cx, cy - R * .9, cx, cy - R * .5, R * .2, st) + tigStripe(cx - R * .26, cy - R * .84, cx - R * .16, cy - R * .56, R * .14, st) + tigStripe(cx + R * .26, cy - R * .84, cx + R * .16, cy - R * .56, R * .14, st);
  for (const sd of [-1, 1]) s += tigStripe(cx + sd * R * 1.02, cy - R * .02, cx + sd * R * .62, cy + R * .06, R * .16, st) + tigStripe(cx + sd * R * .96, cy + R * .3, cx + sd * R * .66, cy + R * .3, R * .13, st);
  // mõm, mũi, miệng
  s += el(cx - R * .17, cy + R * .47, R * .21, R * .17, '#ffffff', 0) + el(cx + R * .17, cy + R * .47, R * .21, R * .17, '#ffffff', 0);
  s += ln(`M${P(cx, cy + R * .42)} L${P(cx, cy + R * .52)} M${P(cx - R * .2, cy + R * .54)} Q${P(cx - R * .1, cy + R * .64)} ${P(cx, cy + R * .52)} Q${P(cx + R * .1, cy + R * .64)} ${P(cx + R * .2, cy + R * .54)}`, OL, 2.8);
  s += pa(`M${P(cx - R * .14, cy + R * .3)} Q${P(cx, cy + R * .26)} ${P(cx + R * .14, cy + R * .3)} Q${P(cx + R * .04, cy + R * .43)} ${P(cx, cy + R * .44)} Q${P(cx - R * .04, cy + R * .43)} ${P(cx - R * .14, cy + R * .3)} Z`, c.nose, 2.5);
  for (const sd of [-1, 1]) s += ci(cx + sd * R * .2, cy + R * .44, R * .025, OL, 0) + ci(cx + sd * R * .3, cy + R * .48, R * .025, OL, 0);
  if (f >= 3) for (const sd of [-1, 1]) { const x = cx + sd * R * .13, y = cy + R * .58, h = R * (f >= 4 ? .4 : .34); s += pa(`M${P(x - R * .075, y)} Q${P(x - R * .05 + sd * R * .02, y + h * .7)} ${P(x + sd * R * .03, y + h)} Q${P(x + R * .07, y + h * .5)} ${P(x + R * .075, y)} Z`, cel('#bff4ff', '#3fa8e6'), 2.6); }
  else if (f === 2) s += pa(`M${P(cx + R * .08, cy + R * .58)} l${f1(R * .05)},${f1(R * .14)} l${f1(R * .05)},${f1(-R * .14)}`, '#fff', 2);
  s += iceEyes(cx, cy - R * .08, R * .4, f, c.b, c.i, R / 33, f >= 3 ? { slit: true } : {});
  if (f === 1) s += iceBlush(cx - R * .66, cy + R * .3, R * .16, R * .1) + iceBlush(cx + R * .66, cy + R * .3, R * .16, R * .1);
  s += hl(cx - R * .55, cy - R * .5, R * .2, R * .12);
  return s;
}
// Chân trụ có bàn chân; dark = chân phía xa
function tigLeg(x0, y0, x1, y1, r0, r1, c, far, claws) {
  const fill = far ? cel(c.s, c.st) : cel(c.b, c.s);
  let s = pa(capsule(x0, y0, x1, y1 - r1 * .4, r0, r1), fill, 5) + el(x1, y1 - r1 * .2, r1 * 1.25, r1 * .78, fill, 5);
  if (claws) s += [-.55, 0, .55].map(k => pa(`M${P(x1 + r1 * k - 2.2, y1 + r1 * .45)} l2.2,${f1(r1 * .55)} l2.2,${f1(-r1 * .55)} Z`, '#f2ffff', 1.6)).join('');
  else s += ln(`M${P(x1 - r1 * .4, y1 + r1 * .5)} v-4 M${P(x1 + r1 * .4, y1 + r1 * .5)} v-4`, OL, 2.4);
  return s;
}
// Đuôi ống có vằn theo đường cong bậc hai
function tigTail(pts, w, c, n = 4) {
  const [[x0, y0], [qx, qy], [x1, y1]] = pts, d = `M${P(x0, y0)} Q${P(qx, qy)} ${P(x1, y1)}`;
  let s = tube(d, c.b, w, 5);
  for (let i = 1; i <= n; i++) {
    const t = .2 + i * .7 / (n + 1), u = 1 - t;
    const x = u * u * x0 + 2 * u * t * qx + t * t * x1, y = u * u * y0 + 2 * u * t * qy + t * t * y1;
    const tx = 2 * u * (qx - x0) + 2 * t * (x1 - qx), ty = 2 * u * (qy - y0) + 2 * t * (y1 - qy), L = Math.hypot(tx, ty), nx = -ty / L * w * .5, ny = tx / L * w * .5;
    s += ln(`M${P(x + nx, y + ny)} L${P(x - nx * .2 + tx / L * 2, y - ny * .2 + ty / L * 2)}`, c.st, 3.6);
  }
  return s;
}
PET_SPECS.tiger = {
  el: 'ice',
  c: { b: '#eef8ff', s: '#a3cdee', d: '#7fa9de', l: '#ffffff', ls: '#d4ecff', st: '#3a68c8', i: '#33e1ff', ear: '#7fb6f0', nose: '#4a7fe0' },
  c4: { b: '#e2f2ff', s: '#7fa9de', d: '#5f88c8', st: '#1a3a8f', i: '#bff4ff', ear: '#5f95e0', nose: '#2b5fc8' },
  draw(f, g, c) { return this.forms[f](c, g); },
  forms: [null,
    // 1. Hổ con nằm cuộn tròn, đuôi cong lên bên hông
    (c) => {
      c = Object.assign({}, c, { st: '#5b8fe6' });
      const hx = 98, hy = 138, R = 35;
      let back = '', body = '', head = '', front = '';
      back += `<g class="pt">` + tigTail([[150, 176], [182, 178], [174, 146]], 11, c, 2) + pa(`M${P(167, 150)} Q${P(170, 134)} ${P(180, 130)} Q${P(184, 142)} ${P(180, 150)} Z`, c.st, 3.5) + `</g>`;
      body += pa(iceCurve([[50, 172], [54, 156], [70, 146], [100, 142], [130, 141], [152, 146], [164, 160], [160, 178], [140, 187], [100, 189], [66, 187], [52, 182]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(134, 150)} Q${P(150, 156)} ${P(148, 176)}`, c.s, 3);
      body += tigStripe(150, 146, 146, 160, 7, c.st) + tigStripe(162, 158, 152, 166, 6, c.st) + tigStripe(56, 158, 66, 164, 6, c.st);
      // hai chân trước ló dưới cằm
      body += el(82, 181, 12.5, 8, cel(c.b, c.s), 4.5) + el(116, 181, 12.5, 8, cel(c.b, c.s), 4.5) + ln(`M${P(78, 185)} v-3.5 M${P(85, 185)} v-3.5 M${P(113, 185)} v-3.5 M${P(120, 185)} v-3.5`, OL, 2.2);
      head += tigHead(hx, hy, R, 1, c);
      return { back, body, head, front, anc: iceAnc([hx, hy - R * .86, R * 1.75], [hx, hy - R * .08, R * 1.36], [hx, hy + R * .82, R * 1.6], [104, 150, 188, 100], [106, 144, 104, 44]) };
    },
    // 2. Hổ non rình mồi: hạ thấp đầu, mông nhổm, đuôi cong chữ S
    (c) => {
      const hx = 74, hy = 130, R = 30;
      let back = '', body = '', head = '', front = '';
      back += `<g class="pt">` + tigTail([[166, 118], [198, 100], [180, 76]], 11, c, 3) + tigTail([[181, 78], [166, 60], [180, 50]], 10, c, 1) + ci(181, 49.5, 5.6, c.st, 3.5) + `</g>`;
      // chân phía xa
      body += pa(iceCurve([[98, 156], [102, 174], [106, 188], [88, 188], [86, 174], [86, 158]]), cel(c.s, c.d), 5);
      body += pa(iceCurve([[136, 158], [140, 174], [144, 188], [126, 188], [124, 174], [124, 160]]), cel(c.s, c.d), 5);
      // thân + chân gần
      body += pa(iceCurve([[92, 124], [114, 118], [136, 112], [156, 106], [172, 114], [176, 132], [170, 150], [162, 162], [166, 178], [170, 188], [148, 188], [146, 176], [142, 166], [126, 170], [104, 170], [86, 168], [78, 178], [74, 188], [52, 188], [52, 178], [60, 166], [64, 150]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(150, 132)} Q${P(162, 144)} ${P(156, 162)} M${P(86, 156)} Q${P(80, 164)} ${P(80, 176)}`, c.s, 3);
      body += tigStripe(112, 118, 116, 134, 7, c.st) + tigStripe(128, 114, 130, 131, 7, c.st) + tigStripe(144, 109, 144, 127, 7, c.st) + tigStripe(162, 108, 156, 122, 6, c.st) + tigStripe(176, 130, 162, 136, 6, c.st);
      body += ln(`M${P(56, 188)} v-4 M${P(63, 188)} v-4 M${P(152, 188)} v-4 M${P(159, 188)} v-4`, OL, 2.2);
      head += tigHead(hx, hy, R, 2, c);
      return { back, body, head, front, anc: iceAnc([hx, hy - R * .86, R * 1.7], [hx, hy - R * .08, R * 1.34], [hx + 2, hy + R * .8, R * 1.55], [124, 112, 170, 80], [130, 110, 76, 60]) };
    },
    // 3. Hổ trưởng thành sải bước: chân trước nhấc, nanh băng, gai pha lê trên vai, đuôi dài
    (c) => {
      const hx = 62, hy = 78, R = 31;
      let back = '', body = '', head = '', front = '';
      back += `<g class="pt">` + tigTail([[180, 108], [204, 112], [194, 80]], 12, c, 3) + tigTail([[195, 82], [186, 62], [192, 46]], 11, c, 1) + `</g>`;
      back += crystal(192, 50, 20, 12, '#e6fbff', '#4fb3e6', 3.5, 2);
      // chân phía xa: trước nhấc bước, sau trụ
      body += pa(iceCurve([[80, 120], [70, 140], [56, 150], [40, 156], [34, 166], [46, 170], [62, 162], [80, 150], [92, 134]]), cel(c.s, c.d), 5);
      body += pa(iceCurve([[140, 136], [146, 160], [148, 180], [152, 188], [134, 188], [132, 176], [128, 156], [124, 140]]), cel(c.s, c.d), 5);
      // gai pha lê dọc vai
      body += crystal(96, 92, 26, 13, '#e6fbff', '#4fb3e6', 3.5, -10) + crystal(112, 90, 40, 15, '#f2ffff', '#4fb3e6', 3.5, -3) + crystal(128, 91, 30, 13, '#e6fbff', '#4fb3e6', 3.5, 4) + crystal(144, 92, 20, 11, '#e6fbff', '#4fb3e6', 3.5, 8);
      // thân + chân gần
      body += pa(iceCurve([[84, 80], [112, 86], [142, 88], [166, 92], [182, 104], [188, 122], [184, 138], [174, 154], [176, 172], [182, 188], [162, 188], [160, 170], [158, 154], [148, 142], [124, 146], [100, 144], [92, 150], [90, 170], [94, 188], [72, 188], [70, 172], [70, 150], [62, 128], [58, 108], [66, 92]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(160, 112)} Q${P(176, 126)} ${P(168, 146)} M${P(92, 150)} Q${P(86, 140)} ${P(78, 136)}`, c.s, 3);
      body += tigStripe(120, 88, 124, 108, 8, c.st) + tigStripe(138, 89, 140, 108, 8, c.st) + tigStripe(156, 92, 154, 110, 7, c.st) + tigStripe(186, 120, 170, 124, 6, c.st) + tigStripe(182, 136, 168, 136, 5, c.st) + tigStripe(70, 160, 86, 160, 5, c.st);
      body += [[166, 188], [173, 188], [77, 188], [84, 188]].map(([x, y]) => pa(`M${P(x - 2.2, y)} l2.2,5 l2.2,-5 Z`, '#f2ffff', 1.6)).join('');
      head += tigHead(hx, hy, R, 3, c);
      return { back, body, head, front, anc: iceAnc([hx, hy - R * .86, R * 1.7], [hx, hy - R * .08, R * 1.32], [hx + 4, hy + R * .82, R * 1.55], [124, 88, 150, 100], [128, 86, 96, 64]) };
    },
    // 4. Hổ thần băng giá: ngồi uy nghi, bờm pha lê xòe, đuôi hóa dải cực quang
    (c) => {
      const hx = 100, hy = 72, R = 34;
      let back = '', body = '', head = '', front = '';
      // dải cực quang nối từ chóp đuôi
      if (!PET_LITE) back += `<g class="aurora"><path d="M${P(170, 116)} C${P(196, 92)} ${P(176, 66)} ${P(190, 40)} C${P(198, 24)} ${P(190, 8)} ${P(172, 2)} C${P(180, 18)} ${P(172, 32)} ${P(164, 44)} C${P(152, 64)} ${P(172, 88)} ${P(158, 112)} Z" fill="${lin('#ff4fd8', '#8a5cff', '#33e1ff', '#7dffcf')}" opacity=".75"/></g>`;
      back += `<g class="pt">` + tigTail([[140, 180], [192, 180], [166, 118]], 13, c, 3) + crystal(166, 122, 16, 12, '#bff4ff', '#3f9fe0', 3.5, -2) + `</g>`;
      // bờm pha lê xòe sau đầu
      for (let i = 0; i < 11; i++) {
        const a = -196 + i * 21.2, r = a * Math.PI / 180, bx = hx + Math.cos(r) * R * .9, by = hy + 4 + Math.sin(r) * R * .86, len = (i % 2 ? 30 : 40) + (i === 5 ? 8 : 0);
        back += `<g transform="rotate(${f1(a + 90)} ${f1(bx)} ${f1(by)})">${crystal(bx, by + 4, len, 17, i % 2 ? '#bff4ff' : '#f2ffff', '#3f9fe0', 3.5)}</g>`;
      }
      back += pa(iceFluffD(hx, hy + 8, R * 1.34, R * 1.22, 14, .07) + 'Z', cel('#ffffff', '#bfe3ff'), 5);
      // thân ngồi hình chuông: đùi sau hai bên
      body += pa(iceCurve([[72, 108], [48, 124], [34, 156], [30, 180], [44, 189], [100, 189], [156, 189], [170, 180], [166, 156], [152, 124], [128, 108]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(58, 140)} Q${P(46, 160)} ${P(52, 184)} M${P(142, 140)} Q${P(154, 160)} ${P(148, 184)}`, c.s, 3);
      body += tigStripe(36, 150, 54, 154, 7, c.st) + tigStripe(32, 166, 50, 168, 6, c.st) + tigStripe(164, 150, 146, 154, 7, c.st) + tigStripe(168, 166, 150, 168, 6, c.st);
      body += el(42, 186, 15, 6.5, cel(c.b, c.s), 4.5) + el(158, 186, 15, 6.5, cel(c.b, c.s), 4.5);
      // hai chân trước
      for (const sd of [-1, 1]) {
        body += pa(iceCurve([[100 + sd * 2, 132], [100 + sd * 26, 132], [100 + sd * 28, 160], [100 + sd * 32, 178], [100 + sd * 30, 189], [100 + sd * 3, 189], [100 + sd * 1, 178], [100 + sd * 2, 156]]), cel(c.b, c.s), 5);
        body += tigStripe(100 + sd * 28, 152, 100 + sd * 15, 154, 5, c.st) + tigStripe(100 + sd * 29, 164, 100 + sd * 16, 166, 5, c.st);
        body += ln(`M${P(100 + sd * 12, 189)} v-5 M${P(100 + sd * 21, 189)} v-5`, OL, 2.2);
        body += [-8, 0, 8].map(dx => pa(`M${P(100 + sd * 16 + dx - 2.2, 188)} l2.2,5 l2.2,-5 Z`, '#f2ffff', 1.6)).join('');
      }
      // bờm ngực
      body += pa(iceFluffD(100, 116, 32, 30, 9, .1, 0, 180) + ` L${P(68, 110)} Q${P(100, 96)} ${P(132, 110)} Z`, cel('#ffffff', '#d4ecff'), 4.5);
      head += tigHead(hx, hy, R, 4, c);
      // ấn pha lê trên trán
      head += (PET_LITE ? '' : `<circle cx="${hx}" cy="${f1(hy - R * .56)}" r="11" fill="#7fe8ff" opacity=".35"/>`) + pa(`M${P(hx, hy - R * .78)} L${P(hx + 6, hy - R * .58)} L${P(hx, hy - R * .38)} L${P(hx - 6, hy - R * .58)} Z`, cel('#7fe8ff', '#1f6fd1'), 3) + hl(hx - 1.5, hy - R * .64, 1.6, 3, 0, .8);
      front += iceMotes([[18, 72, 7], [22, 126, 5.5], [184, 150, 6], [34, 24, 5.5]]);
      return { back, body, head, front, anc: iceAnc([hx, hy - R * .88, R * 1.7], [hx, hy - R * .08, R * 1.32], [hx, hy + R * .84, R * 1.8], [100, 106, 186, 76], [100, 102, 96, 84]) };
    }
  ]
};

/* ===== MA MÚT: bé lông xù ngồi → ma mút non vòi giơ cao → ma mút gù, ngà cong, tinh thể trên lưng → ma mút sông băng cõng núi băng ===== */
// Ngà cong: gốc (x0,y0), bên sd, dài L, cong lên
function mamTusk(x0, y0, sd, L, w, fill, sw = 4) {
  const x1 = x0 + sd * L * .55, y1 = y0 + L * .55, x2 = x0 + sd * L * .95, y2 = y0 + L * .05;
  return pa(`M${P(x0 - sd * w * .5, y0)} C${P(x0 - sd * w * .2, y0 + L * .6)} ${P(x1 + sd * L * .1, y1 + L * .2)} ${P(x2, y2)} C${P(x1 + sd * L * .08, y1 - w * .1)} ${P(x0 + sd * w * .5, y0 + L * .35)} ${P(x0 + sd * w * .5, y0)} Z`, fill, sw);
}
// Đầu ma mút hướng người xem. trunk: 'up' | 'curl' | 'down'
function mamHead(cx, cy, R, f, c, o = {}) {
  let back = '', s = '';
  // tai to tròn
  const er = R * (o.ear || .62);
  for (const sd of [-1, 1]) { const ex = cx + sd * R * .9, ey = cy + R * .1; back += pa(iceCurve([[ex - sd * er * .5, ey - er * .9], [ex + sd * er * .6, ey - er * .75], [ex + sd * er * .85, ey + er * .1], [ex + sd * er * .45, ey + er * .95], [ex - sd * er * .3, ey + er * .7]]), cel(c.b, c.s), 5) + el(ex + sd * er * .14, ey + er * .04, er * .48, er * .64, c.ls, 0, `transform="rotate(${sd * 12} ${f1(ex + sd * er * .14)} ${f1(ey + er * .04)})"`); }
  // vòi (gộp viền với đầu)
  const tk = o.trunk || 'down', tw0 = R * .46, tw1 = R * (f === 1 ? .3 : .26);
  const tp = tk === 'up' ? [[cx, cy + R * .1], [cx, cy + R * .55], [cx - R * .25, cy + R * .95], [cx - R * .8, cy + R * .95], [cx - R * 1.3, cy + R * .5], [cx - R * 1.5, cy - R * .1], [cx - R * 1.4, cy - R * .5]] :
    tk === 'curl' ? [[cx, cy + R * .1], [cx, cy + R * .6], [cx + R * .06, cy + R * 1], [cx + R * .4, cy + R * 1.1], [cx + R * .62, cy + R * .86], [cx + R * .5, cy + R * .64]] :
      [[cx, cy + R * .1], [cx, cy + R * .6], [cx - R * .04, cy + R * 1], [cx + R * .1, cy + R * 1.26], [cx + R * .34, cy + R * 1.2]];
  const T = iceTaper(tp, tw0, tw1);
  // ngà sau vòi
  const tl = o.tusk ?? R * .5;
  if (tl > 0) for (const sd of [-1, 1]) back += mamTusk(cx + sd * R * .3, cy + R * .5, sd, tl, R * (f >= 3 ? .26 : .22), o.tuskFill || cel(c.tusk, c.tusks));
  s += bl(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(R)}" ry="${f1(R * .9)}"/><ellipse cx="${f1(cx)}" cy="${f1(cy - R * .38)}" rx="${f1(R * .8)}" ry="${f1(R * .64)}"/>`, cel(c.b, c.s));
  // vòi: tô kín, chỉ vẽ viền hai mép + chóp (gốc vòi liền mặt)
  const e1 = T.r[T.r.length - 1];
  s += `<path d="${T.d}" fill="${cel(c.b, c.s)}"/>` + ln(`M${T.l.slice(1).map(p => P(...p)).join(' L')} A${f1(tw1 / 2)},${f1(tw1 / 2)} 0 0 0 ${P(...e1)} L${T.r.slice(1).reverse().map(p => P(...p)).join(' L')}`, OL, 4.5);
  for (const j of [.4, .52, .64]) { const i = Math.round(T.l.length * j), a = T.l[i], b = T.r[i]; s += ln(`M${P(a[0] + (b[0] - a[0]) * .22, a[1] + (b[1] - a[1]) * .22)} L${P(a[0] + (b[0] - a[0]) * .78, a[1] + (b[1] - a[1]) * .78)}`, c.s, 2.2); }
  // chỏm lông: các lọn nhọn vuốt sang một bên
  const nt = o.tuft ?? 5;
  if (nt) {
    let tuft = '';
    for (let i = 0; i < nt; i++) {
      const tk = o.tuftK || 1, kk = i - (nt - 1) / 2, bx = cx + kk * R * .2 * tk, by = cy - R * .86 - (1 - Math.abs(kk) / nt) * R * .1, h = R * (.42 + (1 - Math.abs(kk) / nt) * .3) * tk;
      tuft += `<path d="${iceTaper([[bx, by + R * .12], [bx + R * .02 * tk, by - h * .5], [bx + (R * .16 + kk * R * .04) * tk, by - h * .9], [bx + (R * .34 + kk * R * .05) * tk, by - h * .78]], R * .3 * tk, 2).d}"/>`;
    }
    s += bl(tuft, cel(o.tuftCol || c.fur, c.furs), 5);
  }
  s += iceEyes(cx, cy - R * .1, R * .42, f, c.b, c.i, R / 34);
  if (f === 1) s += iceBlush(cx - R * .62, cy + R * .3, R * .16, R * .1) + iceBlush(cx + R * .62, cy + R * .3, R * .16, R * .1);
  s += hl(cx - R * .5, cy - R * .55, R * .22, R * .12);
  return { back, s };
}
// Lông rủ dưới bụng: các lọn nhọn treo từ đường y (cong theo k); chỉ viền mép dưới để liền với thân
function mamFringe(x0, x1, y, n, h, fill, k = 0) {
  const st = (x1 - x0) / n, yy = x => y + k * Math.pow((x - (x0 + x1) / 2) / ((x1 - x0) / 2), 2);
  let e = '';
  for (let i = 0; i < n; i++) { const xa = x0 + st * i, xm = xa + st * .5, xb = xa + st, hh = h * (i % 2 ? .72 : 1); e += ` C${P(xa + st * .1, yy(xa) + hh * .7)} ${P(xm - st * .28, yy(xm) + hh)} ${P(xm, yy(xm) + hh)} C${P(xm + st * .28, yy(xm) + hh)} ${P(xb - st * .1, yy(xb) + hh * .7)} ${P(xb, yy(xb))}`; }
  const top = h * .9;
  return `<path d="M${P(x0, yy(x0) - top)} L${P(x0, yy(x0))}${e} L${P(x1, yy(x1) - top)} Z" fill="${fill}"/>` + ln(`M${P(x0, yy(x0))}${e}`, OL, 4);
}
// Chân trụ ma mút
const mamLeg = (x, y0, w, c, far) => pa(iceCurve([[x - w / 2, y0], [x + w / 2, y0], [x + w * .52, 176], [x + w * .56, 188], [x - w * .56, 188], [x - w * .52, 176]]), far ? cel(c.s, c.furs) : cel(c.b, c.s), 5) +
  ln(`M${P(x - w * .25, 188)} v-4 M${P(x, 188)} v-4.5 M${P(x + w * .25, 188)} v-4`, OL, 2.2);
PET_SPECS.mammoth = {
  el: 'ice',
  c: { b: '#8ec9f2', s: '#4a8fcf', l: '#e2f4ff', ls: '#b5dcf5', i: '#1f6fd1', tusk: '#fffbe8', tusks: '#e6c27a', fur: '#6fb2e6', furs: '#3f7fc0' },
  c4: { b: '#6aa8e8', s: '#2f62b0', ls: '#a8cff2', fur: '#4a86d0', furs: '#24509a', i: '#33e1ff' },
  draw(f, g, c) { return this.forms[f](c, g); },
  forms: [null,
    // 1. Bé ma mút lông xù ngồi tròn, vòi cuộn, ngà tí hon
    (c) => {
      c = Object.assign({}, c, { b: '#a6dcff', s: '#62a8e6', fur: '#7fc0f0', furs: '#4a8fd6' });
      const hx = 100, hy = 128, R = 31;
      let back = '', body = '', head = '', front = '';
      body += pa(iceFluffD(100, 162, 40, 26, 12, .07) + 'Z', cel(c.b, c.s), 5.5);
      body += el(100, 168, 22, 14, c.ls, 0);
      body += [80, 120].map(x => el(x, 182, 12, 8, cel(c.b, c.s), 4.5) + ln(`M${P(x - 5, 186)} v-3 M${P(x, 187)} v-3 M${P(x + 5, 186)} v-3`, OL, 2)).join('');
      const H = mamHead(hx, hy, R, 1, c, { trunk: 'curl', tusk: 9, tuft: 3, ear: .7, tuftK: .62 });
      head += H.back + H.s;
      return iceScale({ back, body, head, front, anc: iceAnc([hx, hy - R * 1.02, R * 1.65], [hx, hy - R * .1, R * 1.3], [hx, hy + R * .8, R * 1.8], [100, 142, 186, 70], [100, 140, 80, 46]) }, 1.1);
    },
    // 2. Ma mút non bốn chân, vòi giơ cao, lông bụng dày, ngà dài hơn
    (c) => {
      const hx = 66, hy = 112, R = 28;
      let back = '', body = '', head = '', front = '';
      // đuôi nhỏ có chùm lông
      back += `<g class="pt">` + tube(`M${P(168, 122)} Q${P(180, 126)} ${P(180, 142)}`, c.b, 5, 4) + el(180, 146, 5, 7, cel(c.fur, c.furs), 3.5) + `</g>`;
      body += mamLeg(98, 150, 20, c, true) + mamLeg(150, 150, 20, c, true);
      body += pa(iceCurve([[76, 104], [104, 92], [140, 94], [166, 110], [174, 132], [162, 152], [122, 156], [86, 152], [70, 132]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(110, 104)} q5,6 10,0 M${P(134, 106)} q5,6 10,0 M${P(124, 122)} q5,6 10,0 M${P(150, 120)} q4,6 8,0`, c.s, 2.4);
      body += mamLeg(86, 150, 22, c) + mamLeg(138, 150, 22, c);
      body += mamFringe(74, 170, 146, 7, 14, cel(c.fur, c.furs), -4);
      const H = mamHead(hx, hy, R, 2, c, { trunk: 'up', tusk: 18, tuft: 4, ear: .52 });
      head += H.back + H.s;
      return iceScale({ back, body, head, front, anc: iceAnc([hx, hy - R * 1.02, R * 1.6], [hx, hy - R * .1, R * 1.26], [hx + 4, hy + R * .86, R * 1.7], [122, 96, 160, 90], [124, 94, 84, 62]) }, 1.14);
    },
    // 3. Ma mút gù: vai cao, lưng dốc, ngà cong lớn, cụm tinh thể băng trên lưng, lông rủ dài
    (c) => {
      const hx = 62, hy = 92, R = 32;
      let back = '', body = '', head = '', front = '';
      back += `<g class="pt">` + tube(`M${P(178, 116)} Q${P(192, 122)} ${P(190, 140)}`, c.b, 6, 4) + el(190, 144, 6, 8, cel(c.fur, c.furs), 3.5) + `</g>`;
      // tinh thể trên gù
      back += crystal(88, 66, 30, 15, '#e6fbff', '#4fb3e6', 3.5, -10) + crystal(106, 58, 46, 18, '#f2ffff', '#4fb3e6', 3.5, -3) + crystal(124, 62, 34, 15, '#e6fbff', '#4fb3e6', 3.5, 6) + crystal(140, 72, 22, 12, '#e6fbff', '#4fb3e6', 3.5, 10);
      body += mamLeg(98, 150, 24, c, true) + mamLeg(160, 150, 24, c, true);
      body += pa(iceCurve([[70, 76], [96, 58], [126, 62], [158, 82], [178, 104], [182, 130], [170, 150], [130, 156], [88, 154], [62, 138], [58, 104]]), cel(c.b, c.s), 5.5);
      body += ln(`M${P(96, 74)} q6,8 12,0 M${P(124, 80)} q6,8 12,0 M${P(148, 96)} q5,7 10,0 M${P(112, 104)} q6,8 12,0 M${P(140, 120)} q6,8 12,0`, c.s, 2.6);
      body += mamLeg(84, 150, 26, c) + mamLeg(146, 150, 26, c);
      body += mamFringe(62, 182, 140, 8, 20, cel(c.fur, c.furs), -8);
      const H = mamHead(hx, hy, R, 3, c, { trunk: 'down', tusk: 54, tuft: 5, ear: .58 });
      head += H.back + H.s;
      return { back, body, head, front, anc: iceAnc([hx, hy - R * 1.02, R * 1.6], [hx, hy - R * .1, R * 1.26], [hx + 4, hy + R * .86, R * 1.7], [124, 64, 160, 110], [122, 62, 100, 84]) };
    },
    // 4. Ma mút sông băng khổng lồ: nhìn thẳng, lưng là núi băng, ngà phát sáng, cực quang
    (c) => {
      const hx = 100, hy = 104, R = 36;
      let back = '', body = '', head = '', front = '';
      back += iceAurora(100, 128, 112, 26);
      // núi băng trên lưng: đỉnh giữa cao, hai đỉnh phụ, mũ tuyết
      back += pa(`M${P(26, 112)} L${P(44, 62)} L${P(58, 74)} L${P(80, 18)} L${P(100, 2)} L${P(120, 18)} L${P(142, 74)} L${P(156, 62)} L${P(174, 112)} Z`, cel('#dffaff', '#5fb8ec'), 5);
      back += pa(`M${P(80, 18)} L${P(100, 2)} L${P(120, 18)} L${P(114, 28)} L${P(106, 22)} L${P(98, 32)} L${P(90, 22)} L${P(84, 28)} Z`, '#ffffff', 3) + pa(`M${P(44, 62)} L${P(58, 74)} L${P(52, 78)} L${P(46, 72)} L${P(40, 76)} Z M${P(156, 62)} L${P(142, 74)} L${P(148, 78)} L${P(154, 72)} L${P(160, 76)} Z`, '#ffffff', 2.5);
      back += ln(`M${P(100, 4)} L${P(96, 60)} M${P(80, 20)} L${P(70, 70)} M${P(120, 20)} L${P(132, 70)} M${P(44, 64)} L${P(42, 100)} M${P(156, 64)} L${P(158, 100)}`, '#ffffff', 2.4, 'opacity=".75"');
      back += crystal(64, 98, 34, 16, '#f2ffff', '#33a8e6', 3.5, -8) + crystal(136, 98, 34, 16, '#f2ffff', '#33a8e6', 3.5, 8);
      // thân to nhìn thẳng + lông rủ
      body += mamLeg(52, 150, 28, c, true) + mamLeg(148, 150, 28, c, true);
      body += pa(iceCurve([[36, 112], [64, 92], [100, 88], [136, 92], [164, 112], [170, 140], [150, 158], [100, 162], [50, 158], [30, 140]]), cel(c.b, c.s), 5.5);
      body += mamLeg(78, 150, 30, c) + mamLeg(122, 150, 30, c);
      body += mamFringe(30, 170, 146, 9, 20, cel(c.fur, c.furs), -8);
      const tuskFill = cel('#e6fbff', '#5fd0f5');
      const H = mamHead(hx, hy, R, 4, c, { trunk: 'down', tusk: 0, tuft: 4, tuftK: .8, ear: .74, tuftCol: '#c9ecff' });
      head += H.back;
      // ngà khổng lồ phát sáng
      for (const sd of [-1, 1]) {
        const x0 = hx + sd * R * .32, y0 = hy + R * .5;
        head += pa(`M${P(x0 - sd * 7, y0)} C${P(x0 - sd * 6, y0 + 52)} ${P(x0 + sd * 62, y0 + 54)} ${P(x0 + sd * 70, y0 - 12)} C${P(x0 + sd * 54, y0 + 30)} ${P(x0 + sd * 12, y0 + 30)} ${P(x0 + sd * 8, y0)} Z`, tuskFill, 4.5);
        head += ln(`M${P(x0 + sd * 2, y0 + 20)} Q${P(x0 + sd * 30, y0 + 38)} ${P(x0 + sd * 56, y0 + 16)}`, '#ffffff', 2.6, 'opacity=".85"');
        if (!PET_LITE) head += `<circle cx="${f1(x0 + sd * 70)}" cy="${f1(y0 - 12)}" r="9" fill="#7fe8ff" opacity=".35"/>` + spark4(x0 + sd * 70, y0 - 12, 6, '#ffffff', 1.6, 'twinkle', sd > 0 ? .6 : 0);
      }
      head += H.s;
      front += iceMotes([[14, 128, 6], [188, 132, 6], [20, 40, 5.5], [182, 40, 5]]);
      return { back, body, head, front, anc: iceAnc([hx, hy - R * 1.08, R * 1.6], [hx, hy - R * .1, R * 1.26], [hx, hy + R * .9, R * 1.9], [100, 92, 168, 120], [100, 90, 120, 76]) };
    }
  ]
};

/* ===== QUỶ TUYẾT: cục tuyết lông xù → yeti con tay dài → yeti sừng băng cầm gậy → chúa tể bão tuyết bay trên lốc ===== */
function yetiFace(cx, cy, w, h, f, c) {
  let s = pa(`M${P(cx - w * .5, cy - h * .28)} Q${P(cx, cy - h * .62)} ${P(cx + w * .5, cy - h * .28)} Q${P(cx + w * .6, cy + h * .42)} ${P(cx, cy + h * .52)} Q${P(cx - w * .6, cy + h * .42)} ${P(cx - w * .5, cy - h * .28)} Z`, cel(c.face, c.faces), 4);
  s += pa(`M${P(cx - w * .09, cy + h * .06)} Q${P(cx, cy + h * .02)} ${P(cx + w * .09, cy + h * .06)} Q${P(cx, cy + h * .18)} ${P(cx - w * .09, cy + h * .06)} Z`, OL, 0);
  const my = cy + h * .26, mw = w * (f === 1 ? .16 : .3);
  if (f === 1) s += ln(`M${P(cx - mw, my)} Q${P(cx - mw * .5, my + 5)} ${P(cx, my + 1)} Q${P(cx + mw * .5, my + 5)} ${P(cx + mw, my)}`, OL, 3) + pa(`M${P(cx + mw * .3, my + 2.4)} l2,4 l2,-3.6`, '#fff', 1.8);
  else s += pa(`M${P(cx - mw, my - 2)} Q${P(cx, my + h * .2)} ${P(cx + mw, my - 2)} Q${P(cx, my + h * .06)} ${P(cx - mw, my - 2)} Z`, '#1d2a66', 3) +
    pa(`M${P(cx - mw * .66, my)} l2.6,${4 + f} l2.6,${-4 - f} M${P(cx + mw * .46, my)} l2.6,${4 + f} l2.6,${-4 - f}`, f >= 3 ? '#dffaff' : '#fff', 2);
  s += iceEyes(cx, cy - h * .1, w * .26, f, c.face, c.i, w / 52);
  if (f === 1) s += iceBlush(cx - w * .36, cy + h * .2, 4.5, 2.6) + iceBlush(cx + w * .36, cy + h * .2, 4.5, 2.6);
  return s;
}
// Lọn lông xoáy trên đỉnh (đặc điểm nhận diện)
const yetiCurl = (x, y, k, c) => pa(`M${P(x - 6 * k, y + 4 * k)} C${P(x - 10 * k, y - 10 * k)} ${P(x + 8 * k, y - 18 * k)} ${P(x + 12 * k, y - 8 * k)} C${P(x + 14 * k, y - 2 * k)} ${P(x + 6 * k, y + 1 * k)} ${P(x + 3 * k, y - 4 * k)} C${P(x + 6 * k, y - 8 * k)} ${P(x, y - 8 * k)} ${P(x + 1 * k, y + 4 * k)} Z`, cel(c.b, c.s), 3.5);
// Sừng băng hình lưỡi liềm cong ra ngoài rồi vút lên
function yetiHorn(x, y, sd, r, c, glow) {
  const T = iceTaper([[x, y], [x + sd * r * .7, y - r * .25], [x + sd * r * 1.25, y - r * .85], [x + sd * r * 1.3, y - r * 1.6], [x + sd * r * 1.05, y - r * 2.1]], r * .78, 2.2);
  let s = pa(T.d, cel(c.horn, c.hornS), 4);
  for (const j of [.25, .45, .65]) { const i = Math.round(T.l.length * j), a = T.l[i], b = T.r[i]; s += ln(`M${P(a[0] + (b[0] - a[0]) * .15, a[1] + (b[1] - a[1]) * .15)} L${P(a[0] + (b[0] - a[0]) * .7, a[1] + (b[1] - a[1]) * .7)}`, c.hornS, 2); }
  const m = T.l[Math.round(T.l.length * .55)];
  s += ln(`M${P(x + sd * r * .4, y - r * .2)} Q${P(x + sd * r * 1, y - r * .5)} ${P(m[0] - sd * r * .1, m[1])}`, '#ffffff', 2, 'opacity=".75"');
  if (glow && !PET_LITE) s += spark4(T.e[0], T.e[1], 4.5, '#ffffff', 1.4, 'twinkle', sd > 0 ? .5 : 0);
  return s;
}
// Tay lông dài: vai → khuỷu → bàn tay tròn có móng
function yetiArm(pts, w0, w1, c, claws = true, handR) {
  const T = iceTaper(pts, w0, w1), e = pts[pts.length - 1], hr = handR || w1 * .75;
  let s = bl(`<path d="${T.d}"/><circle cx="${f1(e[0])}" cy="${f1(e[1])}" r="${f1(hr)}"/>`, cel(c.b, c.s), 5);
  const m = T.l[Math.round(T.l.length * .45)], m2 = T.r[Math.round(T.r.length * .45)];
  s += ln(`M${P(m[0], m[1])} l${f1((m[0] - m2[0]) * .25)},4 M${P(m2[0], m2[1])} l${f1((m2[0] - m[0]) * .25)},4`, c.s, 2.4);
  if (claws) s += [-.55, 0, .55].map(k => pa(`M${P(e[0] + hr * k - 2, e[1] + hr * .8)} l2,${f1(hr * .5)} l2,${f1(-hr * .5)} Z`, '#e6fbff', 1.6)).join('');
  return s;
}
PET_SPECS.yeti = {
  el: 'ice',
  c: { b: '#f4fbff', s: '#a9cbe6', l: '#ffffff', face: '#5aa8f0', faces: '#2f6fc0', i: '#33e1ff', horn: '#d6e6ff', hornS: '#7f9ad6', foot: '#cfe4f7' },
  c4: { b: '#e8f4ff', s: '#7fa8d6', face: '#3f8ae6', faces: '#1f4fa8', i: '#bff4ff', horn: '#dffaff', hornS: '#4fa0e0', cloak: '#3a4fc8', cloakS: '#1c2470' },
  draw(f, g, c) { return this.forms[f](c, g); },
  forms: [null,
    // 1. Cục tuyết lông xù có mắt
    (c) => {
      c = Object.assign({}, c, { face: '#6fc0ff', faces: '#3f8ae6' });
      const cx = 100, cy = 143, rx = 45, ry = 43;
      let back = '', body = '', head = '', front = '';
      body += el(86, 185, 11, 6, cel(c.foot, c.s), 4) + el(114, 185, 11, 6, cel(c.foot, c.s), 4);
      body += pa(iceFluffD(cx, cy, rx, ry, 13, .09) + 'Z', cel(c.b, c.s), 5.5);
      body += ln(`M${P(cx - 30, cy + 22)} q5,6 10,2 M${P(cx + 18, cy + 26)} q5,6 10,0 M${P(cx - 8, cy + 32)} q5,5 10,1`, c.s, 2.4);
      // tay mầm hai bên
      body += el(cx - rx + 2, cy + 12, 8, 10, cel(c.b, c.s), 4.5) + el(cx + rx - 2, cy + 12, 8, 10, cel(c.b, c.s), 4.5);
      head += yetiCurl(cx + 2, cy - ry + 4, 1.1, c);
      head += yetiFace(cx, cy - 4, 54, 44, 1, c);
      head += hl(cx - 26, cy - 24, 8, 4.5);
      return { back, body, head, front, anc: iceAnc([cx, cy - ry + 2, 62], [cx, cy - 8, 50], [cx, cy + 18, 66], [cx, cy + 6, cy + ry, 72], [cx, cy - 4, 80, 50]) };
    },
    // 2. Yeti con đứng, tay dài chạm gối, sừng nhú
    (c) => {
      const cx = 100, top = 66, cy = 124;
      let back = '', body = '', head = '', front = '';
      body += el(84, 185, 15, 7, cel(c.foot, c.s), 4.5) + el(116, 185, 15, 7, cel(c.foot, c.s), 4.5) + ln(`M${P(78, 189)} v-3 M${P(84, 190)} v-3 M${P(90, 189)} v-3 M${P(110, 189)} v-3 M${P(116, 190)} v-3 M${P(122, 189)} v-3`, OL, 2);
      for (const sd of [-1, 1]) head += yetiHorn(cx + sd * 22, top + 12, sd, 9, c);
      body += pa(iceFluffD(cx, cy, 40, 58, 18, .05) + 'Z', cel(c.b, c.s), 5.5);
      body += ln(`M${P(cx - 20, 150)} l4,5 l4,-5 M${P(cx + 10, 156)} l4,5 l4,-5 M${P(cx - 6, 168)} l4,4 l4,-4`, c.s, 2.4);
      for (const sd of [-1, 1]) body += yetiArm([[cx + sd * 34, 106], [cx + sd * 46, 128], [cx + sd * 50, 152], [cx + sd * 52, 170]], 18, 13, c, true, 10);
      head += yetiCurl(cx + 2, top + 2, 1, c);
      head += yetiFace(cx, top + 34, 50, 40, 2, c);
      head += hl(cx - 24, top + 12, 8, 4.5);
      return { back, body, head, front, anc: iceAnc([cx, top + 4, 62], [cx, top + 30, 48], [cx, top + 58, 68], [cx, top + 52, 180, 76], [cx, top + 44, 84, 66]) };
    },
    // 3. Yeti trưởng thành: lông rủ như áo choàng nhiều tầng, sừng băng xoắn, cầm gậy băng
    (c) => {
      const cx = 100, top = 46;
      let back = '', body = '', head = '', front = '';
      // gậy băng
      back += tube(`M${P(156, 188)} L${P(160, 44)}`, '#9fd8f5', 6, 3.5) + ln(`M${P(157, 150)} l6,-2 M${P(158, 140)} l6,-2`, '#4fb3e6', 3);
      back += (PET_LITE ? '' : `<circle cx="160" cy="34" r="20" fill="#7fe8ff" opacity=".25"/>`) + crystal(150, 46, 22, 11, '#e6fbff', '#4fb3e6', 3.5, -8) + crystal(170, 46, 22, 11, '#e6fbff', '#4fb3e6', 3.5, 8) + crystal(160, 48, 36, 14, '#f2ffff', '#33a8e6', 3.5);
      body += el(82, 185, 16, 7, cel(c.foot, c.s), 4.5) + el(118, 185, 16, 7, cel(c.foot, c.s), 4.5);
      // thân lông dài như áo choàng
      const robe = iceCurve([[cx - 40, top + 46], [cx, top + 40], [cx + 40, top + 46], [cx + 50, 118], [cx + 56, 168]], false) + ' ' + iceFluffD(cx, 168, 56, 9, 8, .25, 0, 180, 'L') + ' ' +
        iceCurve([[cx - 56, 168], [cx - 50, 118], [cx - 40, top + 46]], false).replace(/^M/, 'L') + ' Z';
      body += pa(robe, cel(c.b, c.s), 5.5);
      body += ln(iceFluffD(cx, 142, 52, 10, 8, .2, 20, 160), c.s, 3);
      // tay trái buông dài, tay phải nắm gậy
      body += yetiArm([[cx - 38, 98], [cx - 52, 124], [cx - 58, 150], [cx - 60, 168]], 20, 15, c, true, 11);
      body += yetiArm([[cx + 38, 98], [cx + 52, 116], [cx + 58, 126]], 20, 16, c, false, 11);
      // khăn choàng sương giá có tua băng
      let mt = `M${P(cx - 54, top + 58)} Q${P(cx - 50, top + 38)} ${P(cx, top + 34)} Q${P(cx + 50, top + 38)} ${P(cx + 54, top + 58)}`;
      for (let i = 0; i <= 9; i++) { const x = cx + 54 - i * 12, y = top + 58 + Math.sin(i / 9 * Math.PI) * 12; mt += ` L${P(x, y)}` + (i < 9 ? ` L${P(x - 6, y + (i % 2 ? 9 : 15))}` : ''); }
      body += pa(mt + ' Z', cel('#9fdcff', '#3f8fe0'), 4.5) + ln(`M${P(cx - 30, top + 50)} Q${P(cx, top + 40)} ${P(cx + 30, top + 50)}`, '#ffffff', 2.4, 'opacity=".7"');
      for (const sd of [-1, 1]) head += yetiHorn(cx + sd * 26, top + 16, sd, 14, c);
      head += pa(iceFluffD(cx, top + 32, 34, 31, 12, .07) + 'Z', cel(c.b, c.s), 5.5);
      head += yetiCurl(cx + 2, top + 4, 1.15, c);
      head += yetiFace(cx, top + 36, 50, 40, 3, c);
      head += hl(cx - 22, top + 14, 8, 4.5);
      return { back, body, head, front, anc: iceAnc([cx, top + 6, 64], [cx, top + 32, 50], [cx, top + 60, 72], [cx, top + 54, 182, 88], [cx, top + 46, 96, 82]) };
    },
    // 4. Chúa tể bão tuyết: bay trên lốc tuyết, áo choàng bão, hai tay giơ cầu bão, vương miện băng
    (c) => {
      const cx = 100, top = 40;
      let back = '', body = '', head = '', front = '';
      back += iceSwirl(100, 108, 90, 8, 10);
      // áo choàng bão xòe rộng, mép xoăn
      let cloak = `M${P(70, 90)} C${P(40, 100)} ${P(20, 130)} ${P(8, 168)}`;
      for (let i = 0; i < 6; i++) { const x = 8 + i * 15, y = 168 + (i % 2) * 8; cloak += ` Q${P(x + 4, y + 14)} ${P(x + 12, y + 4)} Q${P(x + 15, y - 4)} ${P(x + 15, y + 2)}`; }
      cloak += ` L${P(100, 170)}`;
      for (let i = 5; i >= 0; i--) { const x = 192 - i * 15, y = 168 + (i % 2) * 8; cloak += ` Q${P(x - 15, y - 4)} ${P(x - 15, y + 2)} Q${P(x - 4, y + 14)} ${P(x, y)}`; }
      cloak += ` C${P(180, 130)} ${P(160, 100)} ${P(130, 90)} Z`;
      back += pa(cloak, cel(c.cloak, c.cloakS), 5);
      back += ln(`M${P(46, 120)} q-8,14 -2,26 q6,10 -4,18 M${P(154, 120)} q8,14 2,26 q-6,10 4,18 M${P(70, 130)} q-6,16 0,30 M${P(130, 130)} q6,16 0,30`, '#8fa8ff', 2.6, 'opacity=".8"');
      // lốc tuyết thay chân: phễu xoáy
      back += pa(`M${P(60, 128)} Q${P(100, 120)} ${P(140, 128)} C${P(136, 150)} ${P(118, 160)} ${P(112, 172)} Q${P(108, 182)} ${P(104, 188)} Q${P(96, 184)} ${P(98, 172)} C${P(84, 160)} ${P(64, 150)} ${P(60, 128)} Z`, cel('#ffffff', '#9fd8f5'), 4.5);
      back += ln(`M${P(66, 140)} Q${P(100, 150)} ${P(134, 136)} M${P(78, 154)} Q${P(102, 162)} ${P(124, 150)} M${P(92, 168)} Q${P(104, 172)} ${P(114, 164)} M${P(100, 178)} Q${P(105, 180)} ${P(108, 176)}`, '#5fb8ec', 2.6);
      back += [[44, 150, 4], [156, 160, 4], [62, 176, 3], [140, 180, 3.5]].map(([x, y, r]) => ci(x, y, r, '#ffffff', 2)).join('');
      // hai tay giơ cao
      for (const sd of [-1, 1]) {
        body += yetiArm([[cx + sd * 30, 92], [cx + sd * 50, 80], [cx + sd * 62, 62], [cx + sd * 68, 50]], 20, 14, c, false, 11);
        // cầu bão tuyết
        const ox = cx + sd * 72, oy = 34;
        front += (PET_LITE ? '' : `<circle cx="${ox}" cy="${oy}" r="22" fill="#7fe8ff" opacity=".25"/>`) + ci(ox, oy, 14, 'url(#gIce)', 4) +
          ln(`M${P(ox - 8, oy + 2)} Q${P(ox - 6, oy - 9)} ${P(ox + 3, oy - 7)} Q${P(ox + 9, oy - 2)} ${P(ox + 3, oy + 4)} Q${P(ox - 1, oy + 5)} ${P(ox - 1, oy)}`, '#ffffff', 2.8) + hl(ox - 5, oy - 6, 4, 2, -30, .7);
      }
      // thân lông trắng hẹp dần vào lốc
      body += pa(iceFluffD(cx, 104, 38, 40, 14, .06) + 'Z', cel(c.b, c.s), 5.5);
      body += pa(`M${P(cx - 20, 84)} L${P(cx, 128)} L${P(cx + 20, 84)} Q${P(cx, 92)} ${P(cx - 20, 84)} Z`, cel(c.cloak, c.cloakS), 0, 'opacity=".9"') + ci(cx, 100, 7, 'url(#gIce)', 3) ;
      for (const sd of [-1, 1]) head += yetiHorn(cx + sd * 26, top + 18, sd, 17, c, true);
      head += pa(iceFluffD(cx, top + 34, 34, 32, 12, .07) + 'Z', cel(c.b, c.s), 5.5);
      head += yetiFace(cx, top + 38, 48, 38, 4, c);
      // vương miện băng
      const cy = top + 2;
      head += pa(`M${P(cx - 22, cy + 8)} L${P(cx - 24, cy - 10)} L${P(cx - 14, cy)} L${P(cx - 8, cy - 18)} L${P(cx, cy - 4)} L${P(cx + 8, cy - 18)} L${P(cx + 14, cy)} L${P(cx + 24, cy - 10)} L${P(cx + 22, cy + 8)} Q${P(cx, cy + 12)} ${P(cx - 22, cy + 8)} Z`, cel('#eef3fa', '#9aa8c8'), 4);
      head += crystal(cx, cy - 2, 30, 11, '#dffaff', '#33a8e6', 3.5) + ci(cx, cy + 5, 3.6, '#33e1ff', 2);
      head += hl(cx - 20, top + 18, 7, 4);
      front += iceMotes([[16, 100, 6], [186, 104, 6], [24, 150, 5], [178, 150, 5.5]]);
      return { back, body, head, front, anc: iceAnc([cx, top + 2, 62], [cx, top + 34, 48], [cx, top + 64, 66], [cx, 80, 140, 76], [cx, 82, 96, 84]) };
    }
  ]
};

/* ---------- SẤM ---------- */
// v3: mỗi dạng một dáng riêng (bé con → thiếu niên → trưởng thành → tối thượng)
/* ----- Tiện ích riêng hệ Sấm ----- */
// Tọa độ làm tròn số nguyên cho các đường nhiều điểm (gọn chuỗi SVG)
const samP = (x, y) => Math.round(x) + ',' + Math.round(y);
// Đường gấp khúc từ (x1, y1) đến (x2, y2): n đoạn, biên độ a
function samZig(x1, y1, x2, y2, n, a) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  let d = `M${samP(x1, y1)}`;
  for (let i = 1; i < n; i++) { const t = i / n, k = i % 2 ? a : -a; d += ` L${samP(x1 + dx * t + nx * k, y1 + dy * t + ny * k)}`; }
  return d + ` L${samP(x2, y2)}`;
}
// Tia điện nhấp nháy: viền tối + lõi sáng
const samArc = (d, col = '#33e1ff', w = 2.4, dl = 0) => `<g class="flick" style="animation-delay:-${dl}s">${ln(d, OL, w + 3)}${ln(d, col, w)}</g>`;
// Hai mép của một "xương sống" [[x, y, nửa bề rộng], ...]
function samSides(sp) {
  const L = [], R = [];
  sp.forEach(([x, y, w], i) => {
    const p = sp[Math.max(0, i - 1)], n = sp[Math.min(sp.length - 1, i + 1)];
    const dx = n[0] - p[0], dy = n[1] - p[1], l = Math.hypot(dx, dy) || 1;
    L.push([x - dy / l * w, y + dx / l * w]); R.push([x + dy / l * w, y - dx / l * w]);
  });
  return [L, R];
}
// Đường bao lông xù: mỗi cạnh phồng ra ngoài k × độ dài; open: cạnh đóng phẳng
function samFluff(pts, k = .3, open = false) {
  let A = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; A += a[0] * b[1] - b[0] * a[1]; }
  const s = A > 0 ? 1 : -1, n = pts.length;
  let d = `M${samP(pts[0][0], pts[0][1])}`;
  for (let i = 0; i < (open ? n - 1 : n); i++) {
    const a = pts[i], b = pts[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1];
    if (Math.hypot(dx, dy) < .5) continue;
    d += ` Q${samP((a[0] + b[0]) / 2 + s * dy * k, (a[1] + b[1]) / 2 - s * dx * k)} ${samP(b[0], b[1])}`;
  }
  return d + ' Z';
}
// Làm mượt xương sống (Catmull-Rom), m điểm mỗi đốt
function samSmooth(sp, m = 3) {
  const out = [], n = sp.length, at = i => sp[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < n - 1; i++) for (let j = 0; j < m; j++) {
    const t = j / m, a = at(i - 1), b = at(i), c = at(i + 1), d = at(i + 2), t2 = t * t, t3 = t2 * t;
    out.push([0, 1, 2].map(k => .5 * (2 * b[k] + (-a[k] + c[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * t3)));
  }
  out.push(sp[n - 1]);
  return out;
}
// Đuôi lông xù theo xương sống; tip: màu chóp từ đốt i0; extra: hoa văn vẽ trước viền
function samTail(sp, fill, o = {}) {
  const m = o.m ?? 3, [L, R] = samSides(samSmooth(sp, m)), k = o.k ?? .42, d = samFluff(L.concat(R.slice().reverse()), k);
  let s = pa(d, fill, 0);
  if (o.tip) s += pa(samFluff(L.slice(o.i0 * m).concat(R.slice(o.i0 * m).reverse()), k, true), o.tip, 0);
  return s + (o.extra || '') + ln(d, OL, o.w ?? 5);
}
// Vệt gấp khúc chạy dọc xương sống (sọc điện trên đuôi)
function samSpineZig(sp, a = .4, from = 1, to = sp.length - 1) {
  const [L, R] = samSides(sp.map(([x, y, w]) => [x, y, w * a]));
  let d = '';
  for (let i = from; i < to; i++) d += (d ? ' L' : 'M') + P(...(i % 2 ? L[i] : R[i]));
  return d;
}
// Mây giông
function samCloud(x, y, k, col = '#5a4ab8', cold = '#2e2378', sw = 4) {
  const c = [[0, 0, 15], [-17, 5, 11], [17, 5, 12], [-8, -9, 11], [9, -8, 12], [-28, 10, 7], [29, 10, 7]];
  return bl(c.map(([dx, dy, r]) => `<circle cx="${f1(x + dx * k)}" cy="${f1(y + dy * k)}" r="${f1(r * k)}"/>`).join('') + `<rect x="${f1(x - 30 * k)}" y="${f1(y + 4 * k)}" width="${f1(60 * k)}" height="${f1(13 * k)}" rx="${f1(6 * k)}"/>`, cel(col, cold), sw);
}
// Vòng sấm sau lưng dạng 4: quầng tím + vòng răng cưa vàng xoay chậm
function samHalo(cx, cy, r) {
  if (PET_LITE) return '';
  let d = '';
  for (let i = 0; i <= 40; i++) { const a = i * 9 * Math.PI / 180, rr = r + (i % 2 ? 6 : -6); d += (i ? ' L' : 'M') + P(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
  return ci(cx, cy, r + 16, '#8a5cff', 0, 'opacity=".2"') + ci(cx, cy, r - 10, '#33e1ff', 0, 'opacity=".12"') +
    `<g class="spin" style="transform-origin:${cx}px ${cy}px">${ln(d, '#140a30', 7, 'opacity=".55"')}${ln(d, '#ffd21f', 3)}</g>`;
}
// Quả cầu điện
function samOrb(x, y, r) {
  let s = PET_LITE ? '' : ci(x, y, r * 1.55, '#33e1ff', 0, 'opacity=".22"') + ci(x, y, r * 1.25, '#c9fbff', 0, 'opacity=".35"');
  s += ci(x, y, r, cel('#ffffff', '#5fe8ff', .5), 4) + ci(x, y, r * .45, '#fffbd0', 0);
  s += ln(samZig(x - r * .75, y - r * .25, x + r * .7, y + r * .2, 4, r * .2), '#2a8fd6', 2) + ln(samZig(x - r * .3, y + r * .7, x + r * .25, y - r * .7, 3, r * .18), '#8a5cff', 1.8);
  s += hl(x - r * .38, y - r * .42, r * .3, r * .16, -30, .85);
  if (!PET_LITE) s += [0, 1, 2, 3].map(i => { const a = (i * 90 + 30) * Math.PI / 180, x0 = x + Math.cos(a) * r, y0 = y + Math.sin(a) * r; return samArc(samZig(x0, y0, x0 + Math.cos(a) * r * .8, y0 + Math.sin(a) * r * .8, 3, 2.5), i % 2 ? '#ffe14d' : '#33e1ff', 2, i * .3); }).join('');
  return s;
}
// Chóp lông hình tia lửa điện tại (x, y), cao h, nghiêng tilt độ
function samTuft(x, y, h, w, tilt, col, sw = 3) {
  return `<g transform="rotate(${f1(tilt)} ${f1(x)} ${f1(y)})">` + pa(`M${P(x - w * .5, y + h * .3)} L${P(x - w * .42, y - h * .45)} L${P(x - w * .08, y - h * .12)} L${P(x + w * .05, y - h)} L${P(x + w * .3, y - h * .3)} L${P(x + w * .55, y - h * .5)} L${P(x + w * .5, y + h * .3)} Z`, col, sw) + `</g>`;
}
// Neo trang phục + hình học đầu (geo dùng cho hiệu ứng halo)
function samAnc(hx, hy, hr, hry, o) {
  return {
    head: [hx, o.top ?? hy - hry * .95, o.hw ?? hr * 1.5],
    eyes: [o.ex ?? hx, o.ey, o.ew],
    neck: [o.nx ?? hx, o.ny, o.nw],
    back: o.back,
    body: o.body
  };
}

/* ---------- Sóc Sấm: sóc con ôm hạt dẻ → sóc đuôi tia chớp → sóc bay → sóc thần sấm ---------- */
function samSqHead(x, y, r, f, c) {
  const ry = r * .86, eh = r * [0, .5, .62, .7, .78][f], ew = r * .56, tilt = [0, 4, 8, 10, 12][f];
  const L = earPointy(x - r * .6, y - ry * .58, -1, eh, ew, tilt, c.b, '#ff9ab4');
  const R = earPointy(x + r * .6, y - ry * .58, 1, eh, ew, tilt, c.b, '#ff9ab4');
  const ck = r * [0, .4, .34, .3, .3][f];
  let s = '';
  // chỏm lông tai (vẽ trước để nằm sau tai)
  const th = r * [0, .3, .42, .55, .75][f];
  for (const sd of [-1, 1]) { const t = earTip(x + sd * r * .6, y - ry * .58, sd, eh, tilt); s += samTuft(t[0], t[1] + th * .25, th, th * .75, sd * (tilt + 8), f >= 4 ? '#33e1ff' : c.st, 3); }
  s += bl(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(ry)}"/><path d="${L.outer}"/><path d="${R.outer}"/><circle cx="${f1(x - r * .72)}" cy="${f1(y + ry * .34)}" r="${f1(ck)}"/><circle cx="${f1(x + r * .72)}" cy="${f1(y + ry * .34)}" r="${f1(ck)}"/>`, cel(c.b, c.s));
  s += L.inner + R.inner;
  // sọc tím trên trán
  s += pa(`M${P(x - r * .16, y - ry * .98)} Q${P(x, y - ry * 1.04)} ${P(x + r * .16, y - ry * .98)} L${P(x + r * .05, y - ry * .5)} L${P(x, y - ry * .42)} L${P(x - r * .05, y - ry * .5)} Z`, c.st, 0, 'opacity=".85"');
  // má + mõm kem
  s += el(x - r * .64, y + ry * .4, ck * .9, ck * .72, c.l, 0) + el(x + r * .64, y + ry * .4, ck * .9, ck * .72, c.l, 0);
  s += el(x, y + ry * .5, r * .36, ry * .3, c.l, 0);
  s += pa(`M${P(x - r * .1, y + ry * .3)} Q${P(x, y + ry * .24)} ${P(x + r * .1, y + ry * .3)} Q${P(x, y + ry * .42)} ${P(x - r * .1, y + ry * .3)} Z`, '#4a2a9e', 2);
  s += ln(`M${P(x, y + ry * .4)} v${f1(ry * .1)} M${P(x - r * .17, y + ry * .5)} Q${P(x - r * .08, y + ry * .62)} ${P(x, y + ry * .5)} Q${P(x + r * .08, y + ry * .62)} ${P(x + r * .17, y + ry * .5)}`, OL, 2.6);
  s += `<rect x="${f1(x - r * .085)}" y="${f1(y + ry * .55)}" width="${f1(r * .17)}" height="${f1(ry * (f >= 3 ? .14 : .19))}" rx="1.5" fill="#fff" stroke="${OL}" stroke-width="2"/>` + ln(`M${P(x, y + ry * .56)} v${f1(ry * .12)}`, OL, 1.4);
  const er = r * [0, .29, .26, .24, .24][f];
  s += eyes2(x, y - ry * .04, r * .42, er, er * 1.1, { skin: c.b, iris: c.i, lid: [0, 0, .45, .8, 1][f], brow: f > 1, pr: er * (f === 1 ? .62 : .52), bw: [0, 4.5, 5.5, 6, 6.5][f], white: f >= 4 ? '#eafdff' : '#fff' });
  s += hl(x - r * .5, y - ry * .5, r * .2, r * .13);
  return s;
}
PET_SPECS.squirrel = {
  el: 'thunder',
  c: { b: '#ffc21f', s: '#d47f00', l: '#fff1c4', ls: '#f5d68a', i: '#8a5cff', st: '#7a4cff', tail: '#ffd84a' },
  c4: { b: '#ffb000', s: '#a85400', l: '#fff0c0', tail: '#ffc61f', i: '#33e1ff', st: '#5a2fd6' },
  draw(f, g, c) {
    let back = '', body = '', head = '', front = '', anc, geo;
    const fur = cel(c.b, c.s), tailF = cel(c.tail, c.s);
    const stripe = sp => ln(samSpineZig(sp, .45), c.st, 3.2);
    const wag = (x, y, s, dl = 0) => `<g class="pt" style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px;animation-delay:-${dl}s">${s}</g>`;
    if (f === 1) {
      // Sóc con ngồi ôm hạt dẻ phát điện, đuôi xù cuộn sau lưng
      const sp = [[106, 182, 5], [124, 176, 13], [138, 162, 17], [142, 140, 18], [136, 118, 16], [122, 106, 13], [110, 106, 8], [104, 114, 3]];
      back += wag(108, 180, samTail(sp, tailF, { tip: c.l, i0: 5, extra: stripe(sp) }));
      body += bl(`<ellipse cx="92" cy="160" rx="27" ry="25"/>`, fur);
      body += el(92, 166, 17, 15, c.l, 0);
      body += el(77, 184, 11, 5.5, c.b, 4) + el(107, 184, 11, 5.5, c.b, 4);
      // hạt dẻ phát điện ôm trước ngực
      if (!PET_LITE) front += ci(92, 160, 23, '#33e1ff', 0, 'opacity=".25"');
      front += el(92, 165, 14, 15.5, cel('#ffffff', '#5fe8ff', .5), 4) + bolt(88.5, 155, 20, '#ffd21f', 2.2) + hl(85, 160, 3, 5.5, -20, .8);
      front += pa('M77,154 Q78,139 92,138 Q106,139 107,154 Q92,159 77,154 Z', cel('#9a6cff', '#5a2fb0'), 4) + ln('M83,142 l9,10 M92,139 l10,11 M83,151 l14,-12', '#c9b0ff', 1.6) + tube('M92,138 Q93,133 98,131', '#5a2fb0', 2.6, 2);
      front += el(76, 171, 7, 6, c.b, 4) + el(108, 171, 7, 6, c.b, 4);
      front += samArc(samZig(66, 150, 56, 138, 3, 3), '#33e1ff', 2.2) + samArc(samZig(118, 152, 128, 140, 3, 3), '#ffe14d', 2.2, .5);
      head += samSqHead(92, 120, 33, 1, c);
      geo = { hx: 92, hy: 120, hrx: 33, hry: 28 };
      anc = samAnc(92, 120, 33, 28, { ey: 118.8, ew: 44, ny: 146, nw: 38, back: [92, 144, 46, 38], body: [92, 160, 44, 34] });
    } else if (f === 2) {
      // Sóc thiếu niên đứng thẳng, vẫy tay; đuôi dài gấp khúc hình tia chớp
      const sp = [[104, 178, 5], [122, 170, 11], [134, 154, 14], [122, 136, 14], [136, 118, 15], [146, 100, 14], [134, 84, 13], [142, 68, 9], [146, 60, 3]];
      back += wag(106, 176, samTail(sp, tailF, { tip: '#33e1ff', i0: 7, extra: stripe(sp), k: .26 }));
      body += bl(`<ellipse cx="76" cy="171" rx="12" ry="13"/><ellipse cx="108" cy="171" rx="12" ry="13"/><ellipse cx="92" cy="150" rx="21" ry="28"/>`, fur);
      body += el(92, 156, 13, 19, c.l, 0);
      body += el(72, 185, 14, 5.5, c.b, 4) + el(112, 185, 14, 5.5, c.b, 4);
      body += bolt(88, 140, 22, '#33e1ff', 2.6);
      // tay trái ôm bụng, tay phải giơ vẫy
      body += pa(capsule(74, 130, 80, 150, 6, 5.5), fur, 4) + ci(82, 153, 6, c.b, 4);
      body += pa(capsule(110, 130, 124, 112, 6, 5.5), fur, 4) + ci(127, 107, 6.5, c.b, 4);
      front += samArc(samZig(126, 98, 132, 84, 3, 3), '#ffe14d', 2.2) + samArc(samZig(134, 104, 146, 98, 2, 2.5), '#33e1ff', 2, .4);
      head += samSqHead(92, 100, 30, 2, c);
      geo = { hx: 92, hy: 100, hrx: 30, hry: 26 };
      anc = samAnc(92, 100, 30, 26, { ey: 99, ew: 40, ny: 124, nw: 36, back: [92, 124, 44, 52], body: [92, 148, 42, 46] });
    } else if (f === 3) {
      // Sóc bay dang tay lượn, màng lượn tích điện nối cổ tay với cổ chân
      const sp = [[100, 146, 9], [104, 162, 14], [118, 174, 15], [138, 178, 12], [156, 172, 5]];
      back += wag(100, 150, samTail(sp, tailF, { tip: c.l, i0: 3, extra: stripe(sp) }));
      // mép màng lượn lõm thành 3 vỏ sò, từ cổ tay (174, 72) xuống cổ chân (164, 166)
      const edge = X => `M${P(X(174), 72)} Q${P(X(162), 92)} ${P(X(178), 106)} Q${P(X(160), 122)} ${P(X(176), 140)} Q${P(X(156), 148)} ${P(X(164), 166)}`;
      const R_ = x => x, L_ = x => 200 - x;
      body += pa(`M100,90 Q110,92 116,98 Q146,80 174,72 Q162,92 178,106 Q160,122 176,140 Q156,148 164,166 Q140,156 122,154 Q100,168 78,154 Q60,156 36,166 Q44,148 24,140 Q40,122 22,106 Q38,92 26,72 Q54,80 84,98 Q90,92 100,90 Z`, fur, 5.5);
      for (const X of [L_, R_]) {
        const r = X(0) > 0 ? 0 : 1;
        body += pa(`M${P(X(116), 106)} Q${P(X(142), 90)} ${P(X(164), 86)} Q${P(X(156), 98)} ${P(X(168), 108)} Q${P(X(152), 122)} ${P(X(166), 138)} Q${P(X(150), 146)} ${P(X(154), 158)} Q${P(X(134), 150)} ${P(X(118), 146)} Z`, cel(c.tail, '#f0b020', .7), 0);
        body += ln(edge(X), c.st, 8) + ln(edge(X), OL, 5);
        body += samArc(samZig(X(118), 114, X(172), 106, 4, 3), '#33e1ff', 2.2, r * .5) + samArc(samZig(X(118), 134, X(170), 140, 4, 3), '#ffe14d', 2, .3 + r * .5);
        body += ln(`M${P(X(116), 100)} Q${P(X(146), 88)} ${P(X(170), 76)}`, c.s, 3, 'opacity=".55"');
        body += ci(X(174), 72, 7.5, c.b, 4) + ln(`M${P(X(177), 66)} l${r ? -4 : 4},-4 M${P(X(181), 71)} l${r ? -6 : 6},-1`, OL, 2.4);
        body += el(X(164), 166, 9, 6.5, c.b, 4);
      }
      body += bl(`<ellipse cx="100" cy="122" rx="20" ry="28"/>`, fur) + el(100, 128, 13, 19, c.l, 0) + bolt(96, 116, 22, '#33e1ff', 2.4);
      head += samSqHead(100, 74, 29, 3, c);
      geo = { hx: 100, hy: 74, hrx: 29, hry: 25 };
      anc = samAnc(100, 74, 29, 25, { ey: 73, ew: 38, ny: 97, nw: 36, back: [100, 98, 46, 56], body: [100, 118, 40, 50] });
    } else {
      // Sóc thần sấm: ba đuôi tia chớp xòe như quạt, áo choàng màng lượn, quả cầu điện trên tay
      back += samHalo(100, 92, 82);
      const tails = [
        [[96, 166, 7], [84, 140, 15], [100, 112, 18], [80, 84, 19], [94, 54, 18], [80, 28, 14], [92, 8, 4]],
        [[86, 168, 7], [60, 150, 15], [60, 122, 17], [36, 106, 16], [36, 76, 15], [16, 62, 10], [12, 46, 3]],
        [[114, 168, 7], [140, 152, 15], [142, 124, 17], [166, 112, 16], [168, 86, 14], [184, 76, 9], [188, 62, 3]]
      ];
      tails.forEach((sp, i) => back += wag(sp[0][0], sp[0][1], samTail(sp, 'url(#gGold)', { tip: '#33e1ff', i0: 5, extra: stripe(sp), k: .3 }), i * .45));
      // áo choàng màng lượn
      back += pa('M72,100 Q50,140 30,176 L44,170 L52,182 L64,172 L76,184 L88,174 L100,186 L112,174 L124,184 L136,172 L148,182 L156,170 L170,176 Q150,140 128,100 Z', cel('#7a4cff', '#3f1fa0'), 5) +
        ln('M36,174 L44,170 L52,182 L64,172 L76,184 L88,174 L100,186 L112,174 L124,184 L136,172 L148,182 L156,170 L166,174', '#ffd21f', 3);
      body += bl(`<ellipse cx="82" cy="170" rx="13" ry="13"/><ellipse cx="118" cy="170" rx="13" ry="13"/><path d="M74,104 Q100,94 126,104 Q132,140 120,168 Q100,176 80,168 Q68,140 74,104 Z"/>`, fur);
      body += pa('M84,108 Q100,102 116,108 Q118,140 110,160 Q100,166 90,160 Q82,140 84,108 Z', c.l, 0);
      body += el(78, 185, 15, 6, c.b, 4) + el(122, 185, 15, 6, c.b, 4);
      body += bolt(95, 118, 30, '#ffd21f', 3);
      // cổ lông xù
      body += pa('M70,100 L80,112 L86,104 L94,116 L100,106 L106,116 L114,104 L120,112 L130,100 Q100,90 70,100 Z', c.l, 4);
      // tay trái chống hông, tay phải nâng quả cầu
      body += pa(capsule(74, 110, 66, 134, 7, 6), fur, 4) + ci(72, 142, 7, c.b, 4);
      body += pa(capsule(126, 110, 148, 86, 7, 6), fur, 4) + ci(152, 80, 7.5, c.b, 4);
      front += samOrb(160, 54, 17);
      head += samSqHead(100, 70, 31, 4, c);
      // vương miện tia chớp vàng
      head += pa('M88,48 L94,38 L97,45 L100,32 L103,45 L106,38 L112,48 Q100,52 88,48 Z', 'url(#gGold)', 3) + ci(100, 46, 3, '#33e1ff', 1.8);
      if (!PET_LITE) front += motes('thunder', { hy: 70 });
      geo = { hx: 100, hy: 70, hrx: 31, hry: 27 };
      anc = samAnc(100, 70, 31, 27, { top: 46, ey: 69, ew: 42, ny: 98, nw: 46, back: [100, 100, 56, 74], body: [100, 128, 46, 58] });
    }
    return { back, body, head, front, anc, geo };
  }
};
function earTip(x, y, sd, h, tilt) { const t = tilt * Math.PI / 180; return [x + sd * Math.sin(t) * h, y - Math.cos(t) * h]; }

/* ---------- Cáo Sấm: cáo con tai to → cáo thiếu niên 2 đuôi → cáo 4 đuôi điện → cáo thần 9 đuôi ---------- */
// Xương sống đuôi cáo: gốc (x, y), góc a (độ), dài L, bề rộng W, cong curl (độ)
function samFoxTailSp(x, y, a, L, W, curl = 0) {
  const ws = [.25, .7, .95, 1, .85, .5, .08], n = ws.length, out = [];
  let px = x, py = y, ang = a;
  for (let i = 0; i < n; i++) {
    out.push([px, py, W * ws[i]]);
    const r = ang * Math.PI / 180; px += Math.cos(r) * L / (n - 1); py += Math.sin(r) * L / (n - 1); ang += curl / (n - 1);
  }
  return out;
}
function samFoxHead(x, y, r, f, c) {
  const ry = r * .84;
  const eh = r * [0, 1.08, .98, .95, 1][f], ew = r * [0, .92, .76, .66, .7][f], tilt = [0, 24, 14, 8, 10][f];
  const L = earPointy(x - r * .5, y - ry * .5, -1, eh, ew, tilt, c.b, c.tip);
  const R = earPointy(x + r * .5, y - ry * .5, 1, eh, ew, tilt, c.b, c.tip);
  const sp = [0, .2, .3, .38, .42][f];
  let ruff = '';
  for (const sd of [-1, 1]) ruff += `<path d="M${P(x + sd * r * .78, y - ry * .1)} L${P(x + sd * r * (1.1 + sp), y + ry * .3)} L${P(x + sd * r * .96, y + ry * .44)} L${P(x + sd * r * (1.02 + sp * .7), y + ry * .72)} L${P(x + sd * r * .5, y + ry * .82)} Z"/>`;
  let s = bl(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(ry)}"/><path d="${L.outer}"/><path d="${R.outer}"/>${ruff}`, cel(c.b, c.s));
  s += L.inner + R.inner;
  // mặt dưới trắng + má xù
  s += pa(`M${P(x - r * (1.02 + sp * .7), y + ry * .72)} L${P(x - r * .96, y + ry * .44)} L${P(x - r * (1.1 + sp), y + ry * .3)} L${P(x - r * .82, y + ry * .08)} Q${P(x - r * .4, y + ry * .1)} ${P(x, y + ry * .32)} Q${P(x + r * .4, y + ry * .1)} ${P(x + r * .82, y + ry * .08)} L${P(x + r * (1.1 + sp), y + ry * .3)} L${P(x + r * .96, y + ry * .44)} L${P(x + r * (1.02 + sp * .7), y + ry * .72)} L${P(x + r * .5, y + ry * .82)} Q${P(x, y + ry * 1.08)} ${P(x - r * .5, y + ry * .82)} Z`, c.l, 0);
  // vệt điện gấp khúc trên má trắng
  s += [-1, 1].map(sd => { const d = samZig(x + sd * r * .62, y + ry * .42, x + sd * r * (1.02 + sp * .5), y + ry * .3, 3, r * .06); return ln(d, OL, 5.5) + ln(d, f >= 4 ? '#ffd21f' : c.bolt, 2.8); }).join('');
  if (f >= 4) {
    // mặt nạ vàng: vương trên trán, vòng qua chân mày
    s += pa(`M${P(x - r * .62, y - ry * .5)} Q${P(x - r * .3, y - ry * .55)} ${P(x - r * .14, y - ry * .82)} L${P(x, y - ry * 1.1)} L${P(x + r * .14, y - ry * .82)} Q${P(x + r * .3, y - ry * .55)} ${P(x + r * .62, y - ry * .5)} Q${P(x + r * .3, y - ry * .38)} ${P(x + r * .1, y - ry * .3)} L${P(x, y - ry * .08)} L${P(x - r * .1, y - ry * .3)} Q${P(x - r * .3, y - ry * .38)} ${P(x - r * .62, y - ry * .5)} Z`, 'url(#gGold)', 3) + ci(x, y - ry * .55, r * .08, '#33e1ff', 1.8);
  }
  s += snout(x, y + ry * .48, r * .25, ry * .19, '#ffffff');
  s += grin(x, y + ry * .68, r * .2, Math.min(f, 3));
  const er = r * [0, .3, .26, .24, .24][f];
  s += eyes2(x, y - ry * .08, r * .4, er, er * 1.08, { skin: c.b, iris: c.i, lid: [0, 0, .5, .85, 1][f], brow: f > 1, pr: er * (f === 1 ? .62 : .5), slit: f >= 3, bw: [0, 4.5, 5.5, 6, 6.5][f], white: f >= 4 ? '#fffbe0' : '#fff' });
  s += hl(x - r * .5, y - ry * .5, r * .2, r * .12);
  return s;
}
PET_SPECS.fox = {
  el: 'thunder',
  c: { b: '#2fb0ff', s: '#1667c2', l: '#eafaff', ls: '#bfe6ff', i: '#ffd21f', bolt: '#ffd21f', tip: '#ffe14d', sock: '#1d3f9e' },
  c4: { b: '#1f8af2', s: '#0c3f94', l: '#f2fbff', i: '#fff59a', sock: '#152c7a' },
  draw(f, g, c) {
    let back = '', body = '', head = '', front = '', anc, geo;
    const fur = cel(c.b, c.s), shade = cel(c.s, '#0f3f8a');
    const tail = (sp, dl = 0, zig = false, m = 3) => `<g class="pt" style="transform-box:view-box;transform-origin:${f1(sp[0][0])}px ${f1(sp[0][1])}px;animation-delay:-${dl}s">` +
      samTail(sp, fur, { tip: c.tip, i0: sp.length - 3, k: .38, m, extra: zig ? ln(samSpineZig(sp.slice(0, 5), .35), '#33e1ff', 2.6) : '' }) + `</g>`;
    // chân có tất xanh đậm
    const leg = (x, y0, y1, w, fill = fur) => pa(capsule(x, y0, x, y1 - 4, w, w * .9), fill, 4.5) + pa(capsule(x, y1 - 16, x, y1 - 4, w * .92, w * .9), c.sock, 4.5) + el(x - 1, y1 - 2, w * 1.25, w * .72, c.sock, 4);
    if (f === 1) {
      // Cáo con ngồi, tai to quá khổ, đuôi cuộn ôm chân
      body += bl(`<ellipse cx="100" cy="161" rx="22" ry="23"/>`, fur);
      body += pa('M86,146 Q100,140 114,146 Q112,166 100,172 Q88,166 86,146 Z', c.l, 0);
      body += leg(92, 160, 187, 6) + leg(108, 160, 187, 6);
      const sp = [[116, 166, 4], [134, 170, 9], [130, 179, 9], [108, 179, 9], [86, 178, 9], [70, 170, 8], [64, 156, 6], [68, 148, 1]];
      front += tail(sp);
      head += samFoxHead(100, 122, 27, 1, c);
      geo = { hx: 100, hy: 122, hrx: 27, hry: 22.7 };
      anc = samAnc(100, 122, 27, 22.7, { ey: 120, ew: 36, ny: 143, nw: 34, back: [100, 142, 40, 36], body: [100, 158, 38, 32] });
    } else if (f === 2) {
      // Cáo thiếu niên bốn chân, nghiêng đầu nhìn, hai đuôi dựng
      back += tail(samFoxTailSp(140, 132, -62, 66, 13, -18), .5) + tail(samFoxTailSp(144, 134, -28, 54, 12, -28), 0);
      body += leg(130, 148, 187, 6.5, shade) + leg(96, 148, 187, 6.5, shade);
      body += bl(`<ellipse cx="116" cy="139" rx="32" ry="18"/><ellipse cx="88" cy="136" rx="19" ry="21"/><ellipse cx="140" cy="146" rx="13" ry="16"/>`, fur);
      body += pa('M76,124 Q88,118 98,126 Q98,148 86,158 Q76,148 76,124 Z', c.l, 0);
      body += bolt(110, 130, 16, c.bolt, 2.2);
      body += leg(82, 146, 187, 7) + leg(144, 152, 187, 7);
      head += samFoxHead(80, 100, 27, 2, c);
      geo = { hx: 80, hy: 100, hrx: 27, hry: 23 };
      anc = samAnc(80, 100, 27, 23, { ey: 98, ew: 34, ny: 122, nw: 32, back: [114, 122, 46, 34], body: [90, 140, 34, 30] });
    } else if (f === 3) {
      // Cáo trưởng thành ngồi thẳng, 4 đuôi điện xòe hai bên
      for (const sd of [-1, 1]) {
        back += tail(samFoxTailSp(100 + sd * 18, 172, sd < 0 ? 188 : -8, 88, 16, -sd * 80), sd < 0 ? .3 : .9, true);
        back += tail(samFoxTailSp(100 + sd * 12, 158, sd < 0 ? 208 : -28, 78, 14, -sd * 62), sd < 0 ? .6 : 0, true);
      }
      body += bl(`<ellipse cx="76" cy="170" rx="21" ry="18"/><ellipse cx="124" cy="170" rx="21" ry="18"/><ellipse cx="100" cy="126" rx="24" ry="36"/>`, fur);
      body += el(60, 185, 13, 5.5, c.sock, 4) + el(140, 185, 13, 5.5, c.sock, 4);
      body += bl(`<path d="${capsule(93, 140, 93, 182, 8, 7.5)}"/><path d="${capsule(107, 140, 107, 182, 8, 7.5)}"/>`, fur, 4.5);
      body += bl(`<path d="${capsule(93, 168, 93, 182, 7.6, 7.5)}"/><path d="${capsule(107, 168, 107, 182, 7.6, 7.5)}"/>`, c.sock, 0) + el(92, 185, 9, 5.5, c.sock, 4) + el(108, 185, 9, 5.5, c.sock, 4);
      body += pa(samFluff([[76, 84], [124, 84], [124, 102], [116, 122], [108, 140], [100, 148], [92, 140], [84, 122], [76, 102]], .2), c.l, 4);
      head += samFoxHead(100, 64, 27, 3, c);
      geo = { hx: 100, hy: 64, hrx: 27, hry: 23 };
      anc = samAnc(100, 64, 27, 23, { ey: 62, ew: 34, ny: 88, nw: 40, back: [100, 92, 46, 80], body: [100, 128, 44, 64] });
    } else {
      // Cáo thần đứng bốn chân, 9 đuôi tia sét xòe tỏa, mặt nạ vàng, mây giông phía sau
      // mây giông xám thép (không tím) để khác hẳn mây khói của Mèo Bóng Ma dạng 4
      if (!PET_LITE) back += samCloud(40, 40, 1.05, '#62729c', '#343f66') + samCloud(160, 34, 1.1, '#62729c', '#343f66') +
        samArc(samZig(26, 54, 12, 104, 4, 6), '#ffe14d', 3) + samArc(samZig(176, 48, 190, 100, 4, 6), '#33e1ff', 3, .5);
      const order = [0, 8, 1, 7, 2, 6, 3, 5, 4];
      order.forEach((i, k) => { const a = 184 + i * 21.5; back += tail(samFoxTailSp(100, 124, a, 92, 16, (i - 4) * 6), k * .2, true, 2); });
      // chân sau (xa) rồi thân, ngực, chân trước dạng đứng vững
      body += leg(68, 152, 187, 6.5, shade) + leg(132, 152, 187, 6.5, shade);
      body += bl(`<ellipse cx="72" cy="148" rx="13" ry="15"/><ellipse cx="128" cy="148" rx="13" ry="15"/><ellipse cx="100" cy="130" rx="26" ry="30"/>`, fur);
      body += pa(samFluff([[74, 98], [126, 98], [124, 116], [112, 132], [100, 146], [88, 132], [76, 116]], .22), c.l, 4);
      body += pa('M78,112 Q100,128 122,112 L120,120 Q100,136 80,120 Z', 'url(#gGold)', 3) + crystal(100, 136, 14, 9, '#c9fbff', '#33e1ff', 2.5);
      body += leg(89, 148, 187, 7.2) + leg(111, 148, 187, 7.2);
      if (!PET_LITE) front += samArc(samZig(76, 188, 62, 194, 2, 3), '#ffe14d', 2.4) + samArc(samZig(124, 188, 138, 194, 2, 3), '#33e1ff', 2.4, .4);
      head += samFoxHead(100, 76, 30, 4, c);
      if (!PET_LITE) front += motes('thunder', { hy: 76 });
      geo = { hx: 100, hy: 76, hrx: 30, hry: 25 };
      anc = samAnc(100, 76, 30, 25, { top: 52, ey: 74, ew: 38, ny: 100, nw: 46, back: [100, 104, 54, 70], body: [100, 132, 48, 46] });
    }
    return { back, body, head, front, anc, geo };
  }
};
// Đuôi xù hình giọt nước (giữ lại cho tương thích)
function bushyTail(x, y, a, L, W, fill, tipCol) {
  const r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), nx = -uy, ny = ux;
  const p = (t, k) => P(x + ux * L * t + nx * W * k, y + uy * L * t + ny * W * k);
  let s = pa(`M${p(0, -.25)} C${p(.3, -.9)} ${p(.75, -.75)} ${p(1, 0)} C${p(.75, .75)} ${p(.3, .9)} ${p(0, .25)} Z`, fill, 5);
  if (tipCol) s += pa(`M${p(.62, -.62)} C${p(.8, -.5)} ${p(.94, -.25)} ${p(1, 0)} C${p(.94, .25)} ${p(.8, .5)} ${p(.62, .62)} Q${p(.72, .1)} ${p(.66, -.05)} Q${p(.74, -.2)} ${p(.62, -.62)} Z`, tipCol, 0) + ln(`M${p(.62, -.62)} C${p(.8, -.5)} ${p(.94, -.25)} ${p(1, 0)} C${p(.94, .25)} ${p(.8, .5)} ${p(.62, .62)}`, OL, 5);
  return s;
}

/* ---------- Đại Bàng Sấm: chim non lông tơ → đại bàng non tập bay → đại bàng sải cánh → đại bàng thần sấm ---------- */
// Lông cánh hình lưỡi: gốc (x, y), hướng a (độ), dài L, rộng W; chóp màu tip cắt gấp khúc như tia sét
function samBlade(x, y, a, L, W, col, tip, sw = 4) {
  const r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), nx = -uy, ny = ux;
  const q = (l, w) => [x + ux * L * l + nx * W * w, y + uy * L * l + ny * W * w];
  const bz = (sd, t) => { const u = 1 - t; return q(2 * u * t * .5 + t * t, sd * (u * u * .45 + 2 * u * t * .62)); };
  const d = `M${samP(...q(0, -.45))} Q${samP(...q(.5, -.62))} ${samP(...q(1, 0))} Q${samP(...q(.5, .62))} ${samP(...q(0, .45))} Z`;
  const tq = (sd, t) => { const [px, py] = bz(sd, t), [cx, cy] = q(2 * (1 - t) * t * .5 + t * t, 0); return [cx + (px - cx) * .82, cy + (py - cy) * .82]; };
  const tp = [tq(-1, .58), q(.7, -.2), q(.6, .1), tq(1, .66), tq(1, .82), q(.95, 0), tq(-1, .8)];
  return pa(d, col, sw) + pa('M' + tp.map(p => samP(p[0], p[1])).join(' L') + ' Z', tip, 0);
}
// Cánh trong hệ tọa độ riêng: gốc (0, 0), sải theo +x, lông rủ về +y
function samWing(span, f, c, o = {}) {
  const wx = span * .58, wy = -span * .14, tx = span, ty = -span * .04;
  let s = '';
  const np = o.np ?? 5, ns = o.ns ?? 4;
  // lông thứ cấp (gần thân) rồi lông sơ cấp (đầu cánh)
  for (let i = 0; i < ns; i++) { const t = (i + .5) / ns, x = wx * t * .9, y = wy * t * .7 + span * .08; s += samBlade(x, y, 96 - i * 6, span * (o.sl ?? .3), span * .2, c.ws2 || c.s, c.tip); }
  for (let i = np - 1; i >= 0; i--) { const t = i / (np - 1), x = wx * .92 + (tx - wx * .92) * t * .92, y = wy + (ty - wy) * t + span * .06; s += samBlade(x, y, 74 - t * 44, span * (o.pl ?? .42) * (1 - t * .12), span * .19, c.ws2 || c.s, c.tip); }
  // bao cánh
  const cov = `M0,${f1(-span * .05)} Q${P(span * .3, -span * .3)} ${P(wx, wy)} Q${P(span * .82, -span * .16)} ${P(tx, ty)} Q${P(span * .82, span * .02)} ${P(span * .72, span * .06)} Q${P(span * .62, span * .02)} ${P(span * .54, span * .1)} Q${P(span * .42, span * .06)} ${P(span * .34, span * .14)} Q${P(span * .22, span * .1)} ${P(span * .12, span * .18)} Q${P(span * .04, span * .14)} 0,${f1(span * .16)} Z`;
  s += pa(cov, cel(c.w, c.ws), 4.5);
  s += ln(`M${P(span * .08, span * .02)} Q${P(span * .32, -span * .12)} ${P(wx - 2, wy + span * .08)}`, c.l2 || '#8a9cff', 3, 'opacity=".8"');
  if (o.arc) s += samArc(samZig(span * .12, span * .06, span * .78, -span * .06, 5, span * .03), '#33e1ff', 2.2, o.dl || 0);
  return s;
}
function samPlaceWing(x, y, sd, ang, inner, flap) {
  const g = `<g transform="translate(${f1(x)} ${f1(y)}) scale(${sd} 1) rotate(${-ang})">${inner}</g>`;
  return flap && !PET_LITE ? `<g style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px;animation:${sd < 0 ? 'flapl' : 'flapr'} 1.6s ease-in-out infinite alternate">${g}</g>` : g;
}
function samEagleHead(x, y, r, f, c) {
  const ry = r * .9;
  let s = '';
  // mào lông lưỡi sét sau đầu (dạng 3–4)
  if (f >= 3) {
    const n = f >= 4 ? 5 : 3;
    for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2; s += samBlade(x + k * r * .3, y - ry * .6, -90 + k * 24, r * (f >= 4 ? 1.3 : 1.05) * (1 - Math.abs(k) * .14), r * .34, f >= 4 ? 'url(#gGold)' : c.w, f >= 4 ? '#33e1ff' : c.tip); }
  }
  // đầu: tròn xù (non) hoặc có lông má nhọn
  const sp = [0, .1, .2, .3, .36][f];
  let fe = '';
  if (f >= 2) for (const sd of [-1, 1]) fe += `<path d="M${P(x + sd * r * .7, y - ry * .55)} L${P(x + sd * r * (1.12 + sp), y - ry * .36)} L${P(x + sd * r * .96, y - ry * .08)} L${P(x + sd * r * (1.16 + sp), y + ry * .12)} L${P(x + sd * r * .9, y + ry * .32)} L${P(x + sd * r * (1.02 + sp * .6), y + ry * .55)} L${P(x + sd * r * .6, y + ry * .7)} Z"/>`;
  const headD = f === 1 ? `<path d="${samFluff(Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return [x + Math.cos(a) * r, y + Math.sin(a) * ry]; }), .14)}"/>` : `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(ry)}"/>`;
  s += bl(headD + fe, cel(f === 1 ? '#ffffff' : c.l, c.ls));
  // mỏ
  const bw = r * [0, .28, .36, .42, .44][f], bh = r * [0, .42, .66, .9, .95][f], by = y + ry * .06;
  if (f === 1) s += pa(`M${P(x - bw, by + 2)} Q${P(x, by - 4)} ${P(x + bw, by + 2)} L${P(x, by + bh)} Z`, cel(c.beak, '#e07a00'), 3.5) + ln(`M${P(x - bw * .7, by + bh * .3)} L${P(x + bw * .7, by + bh * .3)}`, OL, 1.8);
  else s += pa(`M${P(x - bw, by)} Q${P(x, by - bw * .5)} ${P(x + bw, by)} Q${P(x + bw * .95, by + bh * .7)} ${P(x + bw * .1, by + bh)} Q${P(x - bw * .15, by + bh * .72)} ${P(x - bw * .25, by + bh * .55)} Q${P(x - bw * .9, by + bh * .4)} ${P(x - bw, by)} Z`, cel(c.beak, '#e07a00'), 4) +
    ln(`M${P(x - bw * .8, by + bh * .38)} Q${P(x, by + bh * .5)} ${P(x + bw * .85, by + bh * .3)}`, OL, 2.2) + el(x - bw * .35, by + bh * .12, 1.8, 1.3, OL, 0) + el(x + bw * .35, by + bh * .12, 1.8, 1.3, OL, 0) + hl(x - bw * .4, by + bh * .08, bw * .25, bh * .07, -10, .6);
  // mào tia chớp trên đỉnh (dạng 1–2)
  if (f === 1) s += samTuft(x - r * .26, y - ry * .8, r * .5, r * .42, -24, c.tip, 3) + samTuft(x + r * .26, y - ry * .8, r * .5, r * .42, 24, c.tip, 3) + samTuft(x, y - ry * .84, r * .72, r * .56, 0, c.tip, 3.2);
  if (f === 2) s += bolt(x - r * .05, y - ry * 1.6, r * 1.05, c.tip, 3.2);
  const er = r * [0, .3, .26, .24, .24][f];
  s += eyes2(x, y - ry * .16, r * .44, er, er * (f === 1 ? 1.08 : .95), { skin: c.l, iris: c.i, lid: [0, 0, .55, .9, 1][f], brow: f > 1 ? OL : false, bw: [0, 4, 5, 5.5, 6][f], pr: er * (f === 1 ? .62 : .5), white: f >= 4 ? '#fffbe0' : '#fff' });
  s += hl(x - r * .5, y - ry * .48, r * .2, r * .12);
  return s;
}
PET_SPECS.eagle = {
  el: 'thunder',
  c: { b: '#4a5fd8', s: '#27338f', l: '#f4f7ff', ls: '#c9d3ff', i: '#ffd21f', beak: '#ffc21f', w: '#4a5fd8', ws: '#27338f', ws2: '#2f3fae', tip: '#ffd21f', down: '#a9b8ff', downs: '#6f82f0', leg: '#ffb21f' },
  c4: { b: '#3343c4', s: '#1a2170', w: '#3a4ad0', ws: '#1a2170', ws2: '#232c8e', i: '#fff59a', l2: '#ffd21f' },
  draw(f, g, c) {
    let back = '', body = '', head = '', front = '', anc, geo;
    const feathers = cel(c.b, c.s);
    const talon = (x, y, k = 1) => tube(`M${P(x, y)} L${P(x, y + 14 * k)}`, c.leg, 5 * k, 3) + ln(`M${P(x, y + 14 * k)} l${f1(-7 * k)},${f1(6 * k)} M${P(x, y + 14 * k)} l0,${f1(8 * k)} M${P(x, y + 14 * k)} l${f1(7 * k)},${f1(6 * k)}`, OL, 8 * k) + ln(`M${P(x, y + 14 * k)} l${f1(-7 * k)},${f1(6 * k)} M${P(x, y + 14 * k)} l0,${f1(8 * k)} M${P(x, y + 14 * k)} l${f1(7 * k)},${f1(6 * k)}`, c.leg, 3.6 * k);
    const tailFan = (x, y, n, L, W) => { let s = ''; for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2; s += samBlade(x + k * 4, y, 90 + k * 16, L * (1 - Math.abs(k) * .08), W, c.ws2, c.tip); } return s; };
    if (f === 1) {
      // Chim non lông tơ ngồi trong nửa vỏ trứng nứt hình tia chớp
      const ball = Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return [100 + Math.cos(a) * 29, 152 + Math.sin(a) * 25]; });
      body += pa(samFluff(ball, .18), cel(c.down, c.downs), 5.5);
      for (const sd of [-1, 1]) body += pa(`M${P(100 + sd * 22, 140)} Q${P(100 + sd * 40, 140)} ${P(100 + sd * 40, 156)} Q${P(100 + sd * 33, 152)} ${P(100 + sd * 30, 160)} Q${P(100 + sd * 22, 152)} ${P(100 + sd * 22, 140)} Z`, cel(c.b, c.s), 4);
      front += pa('M66,150 L74,160 L80,148 L88,162 L96,150 L104,162 L112,148 L120,160 L126,148 L134,150 Q136,184 100,188 Q64,184 66,150 Z', cel('#fff8e6', '#e6cfa0'), 5);
      front += ci(84, 174, 3.2, '#33e1ff', 0) + ci(116, 172, 2.6, '#ffd21f', 0) + ci(102, 178, 2.2, '#8a5cff', 0) + hl(78, 166, 5, 2.5, -30, .6);
      head += samEagleHead(100, 122, 27, 1, Object.assign({}, c, { l: '#ffffff' }));
      geo = { hx: 100, hy: 122, hrx: 27, hry: 24 };
      anc = samAnc(100, 122, 27, 24, { top: 101, ey: 118, ew: 38, ny: 144, nw: 36, back: [100, 142, 46, 34], body: [100, 141, 42, 22] });
    } else if (f === 2) {
      // Đại bàng non tập bay: cánh giơ chữ V, lông tơ còn sót trên ngực
      back += samPlaceWing(88, 134, -1, 56, samWing(58, f, c, { np: 3, ns: 2, sl: .3, pl: .4 }), true) + samPlaceWing(112, 134, 1, 56, samWing(58, f, c, { np: 3, ns: 2, sl: .3, pl: .4 }), true);
      back += tailFan(100, 168, 3, 22, 10);
      body += talon(90, 170) + talon(110, 170);
      body += bl(`<ellipse cx="100" cy="148" rx="25" ry="30"/>`, feathers);
      body += pa(samFluff(Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return [100 + Math.cos(a) * 15, 152 + Math.sin(a) * 19]; }), .32), cel('#e6ebff', c.down), 3);
      head += samEagleHead(100, 106, 25, 2, c);
      geo = { hx: 100, hy: 106, hrx: 25, hry: 22.5 };
      anc = samAnc(100, 106, 25, 22.5, { ey: 102, ew: 34, ny: 126, nw: 38, back: [100, 124, 44, 46], body: [100, 146, 42, 46] });
    } else if (f === 3) {
      // Đại bàng trưởng thành sải ngang cánh, lông cánh như lưỡi sét
      back += samPlaceWing(90, 116, -1, 14, samWing(68, f, c, { arc: true, pl: .34, sl: .26 })) + samPlaceWing(110, 116, 1, 14, samWing(68, f, c, { arc: true, dl: .5, pl: .34, sl: .26 }));
      back += tailFan(100, 160, 5, 28, 12);
      body += talon(88, 166, 1.1) + talon(112, 166, 1.1);
      body += bl(`<ellipse cx="100" cy="136" rx="25" ry="34"/>`, feathers);
      body += pa('M84,108 Q100,102 116,108 L112,118 L106,112 L100,122 L94,112 L88,118 Z', c.l, 3.5);
      body += ln('M88,140 l6,6 l6,-6 l6,6 l6,-6 M90,154 l5,5 l5,-5 l5,5 l5,-5', c.s, 2.6);
      head += samEagleHead(100, 78, 26, 3, c);
      geo = { hx: 100, hy: 78, hrx: 26, hry: 23.4 };
      anc = samAnc(100, 78, 26, 23.4, { ey: 74, ew: 36, ny: 102, nw: 40, back: [100, 106, 48, 64], body: [100, 134, 44, 56] });
    } else {
      // Đại bàng thần sấm: cánh dựng cao rộng hết khung, mây giông và sét giáng
      if (!PET_LITE) back += ci(100, 96, 80, '#8a5cff', 0, 'opacity=".2"') + `<g class="flick">${bolt(26, 118, 70, '#ffe14d', 3.5)}</g><g class="flick" style="animation-delay:-.6s">${bolt(164, 118, 70, '#33e1ff', 3.5)}</g>`;
      back += samPlaceWing(90, 108, -1, 44, samWing(84, f, c, { arc: true, np: 6 }), true) + samPlaceWing(110, 108, 1, 44, samWing(84, f, c, { arc: true, np: 6, dl: .5 }), true);
      back += tailFan(100, 156, 5, 32, 13);
      if (!PET_LITE) front += samCloud(34, 178, .9, '#6a5ad6', '#33287e') + samCloud(166, 178, .9, '#6a5ad6', '#33287e');
      body += talon(88, 160, 1.2) + talon(112, 160, 1.2);
      body += bl(`<ellipse cx="100" cy="128" rx="26" ry="34"/>`, feathers);
      body += pa('M82,100 Q100,92 118,100 L114,112 L107,105 L100,118 L93,105 L86,112 Z', c.l, 3.5);
      body += pa('M84,124 Q100,134 116,124 L114,132 Q100,142 86,132 Z', 'url(#gGold)', 3) + ci(100, 134, 4.5, '#33e1ff', 2);
      head += samEagleHead(100, 72, 27, 4, c);
      if (!PET_LITE) front += motes('thunder', { hy: 72 });
      geo = { hx: 100, hy: 72, hrx: 27, hry: 24.3 };
      anc = samAnc(100, 72, 27, 24.3, { top: 52, ey: 68, ew: 38, ny: 98, nw: 42, back: [100, 100, 50, 62], body: [100, 128, 46, 56] });
    }
    return { back, body, head, front, anc, geo };
  }
};

/* ---------- Kỳ Lân Điện: ngựa con chân ngắn → kỳ lân thiếu niên bờm điện → kỳ lân phi nước đại → kỳ lân thần có cánh ---------- */
function samUniHead(x, y, r, f, c) {
  const ry = r * .84;
  let s = '';
  // tai
  const L = earPointy(x - r * .55, y - ry * .62, -1, r * .62, r * .42, -8, c.b, '#ffb3e8');
  const R = earPointy(x + r * .55, y - ry * .62, 1, r * .62, r * .42, -8, c.b, '#ffb3e8');
  s += bl(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(ry)}"/><ellipse cx="${f1(x)}" cy="${f1(y + ry * .62)}" rx="${f1(r * .64)}" ry="${f1(ry * .48)}"/><path d="${L.outer}"/><path d="${R.outer}"/>`, cel(c.b, c.s));
  s += L.inner + R.inner;
  // mõm hồng
  s += el(x, y + ry * .7, r * .52, ry * .34, cel(c.l, c.ls), 0);
  s += el(x - r * .2, y + ry * .66, r * .07, ry * .06, OL, 0) + el(x + r * .2, y + ry * .66, r * .07, ry * .06, OL, 0);
  s += ln(`M${P(x - r * .2, y + ry * .86)} Q${P(x, y + ry * .96)} ${P(x + r * .2, y + ry * .86)}`, OL, 2.6);
  // sừng
  const hl_ = r * [0, .5, .8, 1.05, 1.25][f], hw = r * [0, .24, .24, .26, .28][f], hy0 = y - ry * .78;
  s += pa(`M${P(x - hw, hy0)} Q${P(x - hw * .5, hy0 - hl_ * .6)} ${P(x, hy0 - hl_)} Q${P(x + hw * .5, hy0 - hl_ * .6)} ${P(x + hw, hy0)} Z`, cel(f >= 4 ? '#fff6b0' : c.horn, '#e0a000'), 3.5);
  for (let i = 1; i <= Math.min(f, 3); i++) { const t = i / (Math.min(f, 3) + 1), yy = hy0 - hl_ * t, ww = hw * (1 - t) * .95; s += ln(`M${P(x - ww, yy + 2)} L${P(x + ww, yy - 2)}`, '#c98a00', 2); }
  if (f >= 3) s += spark4(x + hw * .2, hy0 - hl_ * 1.02, r * (f >= 4 ? .3 : .22), '#ffffff', 2, 'twinkle');
  // bờm trước trán
  const mf = r * [0, .5, .6, .66, .7][f];
  s += pa(`M${P(x - r * .78, y - ry * .5)} Q${P(x - r * .5, y - ry * 1.05)} ${P(x + r * .15, y - ry * .92)} L${P(x + r * .05, y - ry * .78)} Q${P(x + r * .5, y - ry * .9)} ${P(x + r * .72, y - ry * .55)} L${P(x + r * .3, y - ry * .5)} L${P(x + r * .1, y - ry * .32)} Q${P(x - r * .15, y - ry * .4 - mf * .2)} ${P(x - r * .4, y - ry * .2)} Q${P(x - r * .55, y - ry * .38)} ${P(x - r * .78, y - ry * .5)} Z`, 'url(#gMane)', 3.5);
  const er = r * [0, .27, .24, .22, .22][f];
  s += eyes2(x, y - ry * .08, r * .44, er, er * 1.12, { skin: c.b, iris: c.i, lid: [0, 0, .45, .8, 1][f], brow: f > 1, bw: [0, 4, 5, 5.5, 6][f], pr: er * (f === 1 ? .62 : .5), white: f >= 4 ? '#effdff' : '#fff' });
  // lông mi
  if (f <= 2) for (const sd of [-1, 1]) s += ln(`M${P(x + sd * (r * .44 + er * .9), y - ry * .08 - er * .4)} l${f1(sd * 4)},-3 M${P(x + sd * (r * .44 + er * .75), y - ry * .08 - er * .75)} l${f1(sd * 3)},-4`, OL, 2.2);
  s += hl(x - r * .5, y - ry * .45, r * .18, r * .1);
  return s;
}
// Chân ngựa theo các khớp (khối con nhộng gộp viền), móng ở điểm cuối
function samUniLeg(pts, w, col, hoof) {
  let sh = '';
  for (let i = 0; i < pts.length - 1; i++) sh += `<path d="${capsule(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w * (1 + (i ? 0 : .12)), w)}"/>`;
  const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI - 90;
  return bl(sh, col, 4) + `<g transform="rotate(${f1(ang)} ${f1(b[0])} ${f1(b[1])})">` + pa(`M${P(b[0] - w * 1.05, b[1] - 3)} L${P(b[0] + w * 1.05, b[1] - 3)} L${P(b[0] + w * 1.2, b[1] + 5)} Q${P(b[0], b[1] + 7)} ${P(b[0] - w * 1.2, b[1] + 5)} Z`, hoof, 3.5) + `</g>`;
}
// Dải bờm/đuôi điện: xương sống → dải gấp khúc tô gradient + tia điện
function samUniStream(sp, o = {}) {
  return samTail(sp, 'url(#gMane)', { k: o.k ?? .18, m: o.m ?? 2, w: 4.5, extra: o.arc === false ? '' : ln(samSpineZig(sp, .3, 1, sp.length - 1), '#e9fdff', 2.2, 'opacity=".85"') });
}
PET_SPECS.uni = {
  el: 'thunder',
  c: { b: '#ffffff', s: '#c9c0f0', l: '#ffe6f6', ls: '#f0bde0', i: '#8a5cff', hoof: '#6a4cc0', horn: '#ffe14d' },
  c4: { b: '#f8f5ff', s: '#a796e6', i: '#33e1ff', hoof: '#4a2fa8' },
  draw(f, g, c) {
    let back = '', body = '', head = '', front = '', anc, geo;
    const coat = cel(c.b, c.s), far = cel(c.s, '#a99be0');
    const sway = (x, y, s, dl = 0) => `<g class="pt" style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px;animation-delay:-${dl}s">${s}</g>`;
    if (f === 1) {
      // Ngựa con chân ngắn, sừng nhú, túm bờm và đuôi bông nhỏ
      back += sway(144, 142, samUniStream([[142, 142, 5], [152, 140, 8], [158, 150, 9], [156, 162, 6], [150, 168, 2]], { arc: false }));
      body += samUniLeg([[128, 156], [128, 182]], 6, far, c.hoof) + samUniLeg([[100, 156], [100, 182]], 6, far, c.hoof);
      body += bl(`<ellipse cx="120" cy="150" rx="29" ry="18"/><path d="${capsule(102, 148, 94, 128, 13, 12)}"/>`, coat);
      body += samUniLeg([[110, 158], [110, 184]], 6.5, coat, c.hoof) + samUniLeg([[140, 156], [141, 184]], 6.5, coat, c.hoof);
      body += samUniStream([[100, 118, 6], [110, 126, 8], [118, 134, 6], [124, 138, 2]], { arc: false });
      head += samUniHead(88, 120, 26, 1, c);
      geo = { hx: 88, hy: 120, hrx: 26, hry: 22 };
      anc = samAnc(88, 120, 26, 22, { top: 101, ey: 118, ew: 36, ny: 142, nw: 34, back: [122, 134, 40, 30], body: [102, 152, 30, 26] });
    } else if (f === 2) {
      // Kỳ lân thiếu niên: chân dài, cổ ngẩng, bờm điện gấp khúc, đuôi dài
      back += sway(150, 122, samUniStream([[148, 124, 6], [164, 122, 11], [174, 134, 12], [168, 150, 11], [178, 164, 9], [174, 178, 3]]), .3);
      body += samUniLeg([[136, 140], [138, 162], [134, 184]], 5.5, far, c.hoof) + samUniLeg([[100, 140], [98, 184]], 5.5, far, c.hoof);
      body += bl(`<ellipse cx="122" cy="132" rx="32" ry="18"/><path d="${capsule(98, 130, 86, 100, 14, 12)}"/>`, coat);
      body += samUniLeg([[110, 142], [110, 186]], 6, coat, c.hoof) + samUniLeg([[146, 138], [150, 160], [146, 186]], 6, coat, c.hoof);
      body += samUniStream([[92, 76, 7], [104, 84, 11], [112, 98, 11], [106, 110, 10], [116, 120, 8], [126, 124, 2]]);
      head += samUniHead(80, 92, 24, 2, c);
      geo = { hx: 80, hy: 92, hrx: 24, hry: 20 };
      anc = samAnc(80, 92, 24, 20, { top: 75, ey: 90, ew: 33, ny: 112, nw: 30, back: [124, 116, 44, 32], body: [96, 128, 30, 30] });
    } else if (f === 3) {
      // Kỳ lân phi nước đại: thân vươn dài, chân duỗi trước sau, bờm và đuôi tia điện bay ngang
      back += sway(150, 98, samUniStream([[146, 100, 7], [162, 92, 12], [176, 96, 13], [186, 86, 10], [190, 74, 3]]), .2);
      back += samUniStream([[78, 58, 8], [96, 62, 13], [112, 58, 12], [128, 66, 11], [142, 60, 7], [154, 54, 2]]);
      body += samUniLeg([[88, 122], [66, 132], [50, 148]], 5.5, far, c.hoof) + samUniLeg([[140, 120], [158, 136], [178, 140]], 5.5, far, c.hoof);
      body += bl(`<ellipse cx="114" cy="108" rx="40" ry="20" transform="rotate(-6 114 108)"/><path d="M70,70 Q84,68 98,96 L82,116 Q72,94 62,84 Z"/>`, coat);
      body += samUniLeg([[86, 120], [74, 140], [86, 154]], 6, coat, c.hoof) + samUniLeg([[138, 116], [162, 128], [188, 122]], 6.2, coat, c.hoof);
      if (!PET_LITE) front += samArc(samZig(194, 112, 186, 128, 2, 3), '#33e1ff', 2.2) + samArc(samZig(42, 150, 30, 160, 2, 3), '#ffe14d', 2.2, .4);
      head += samUniHead(70, 70, 25, 3, c);
      geo = { hx: 70, hy: 70, hrx: 25, hry: 21 };
      anc = samAnc(70, 70, 25, 21, { top: 53, ey: 68, ew: 34, ny: 90, nw: 32, back: [118, 92, 52, 34], body: [86, 108, 30, 30] });
    } else {
      // Kỳ lân thần: đứng chồm hai chân sau, cánh ánh sáng, bờm/đuôi thành tia điện dài, móng tóe sét
      const lw = Object.assign({}, c, { w: '#ffffff', ws: '#bfefff', ws2: '#e3f9ff', tip: '#ff9ef0', l2: '#9ff0ff' });
      if (!PET_LITE) back += samHalo(104, 96, 74);
      back += samPlaceWing(104, 102, -1, 36, samWing(80, 4, lw, { np: 5, ns: 3 }), true) + samPlaceWing(112, 102, 1, 48, samWing(80, 4, lw, { np: 5, ns: 3 }), true);
      back += sway(136, 152, samUniStream([[136, 152, 7], [154, 158, 12], [158, 172, 12], [174, 176, 10], [182, 186, 6], [190, 192, 2]]), .2);
      body += samUniLeg([[114, 150], [118, 170], [110, 186]], 6, far, c.hoof) + samUniLeg([[98, 104], [76, 90], [70, 106]], 5.5, far, c.hoof);
      body += bl(`<ellipse cx="110" cy="124" rx="19" ry="34" transform="rotate(-34 110 124)"/><ellipse cx="126" cy="148" rx="20" ry="21"/><path d="${capsule(98, 104, 86, 70, 15, 13)}"/>`, coat);
      body += bolt(116, 132, 24, '#ffe14d', 2.6);
      body += samUniLeg([[128, 154], [136, 170], [128, 187]], 6.5, coat, c.hoof) + samUniLeg([[92, 112], [68, 102], [60, 122]], 6.5, coat, c.hoof);
      body += samUniStream([[92, 40, 8], [108, 50, 13], [114, 66, 13], [108, 82, 12], [122, 92, 11], [126, 108, 9], [140, 116, 6], [150, 126, 2]]);
      if (!PET_LITE) front += [[60, 128, 140], [70, 112, -160], [110, 190, 200], [128, 190, -20]].map(([x, y, a], i) => { const r = a * Math.PI / 180; return samArc(samZig(x, y, x + Math.cos(r) * 14, y + Math.sin(r) * 10, 2, 3), i % 2 ? '#33e1ff' : '#ffe14d', 2.2, i * .3); }).join('');
      head += samUniHead(84, 58, 26, 4, c);
      if (!PET_LITE) front += motes('thunder', { hy: 66 });
      geo = { hx: 84, hy: 58, hrx: 26, hry: 22 };
      anc = samAnc(84, 58, 26, 22, { top: 38, ey: 56, ew: 36, ny: 80, nw: 32, back: [112, 100, 44, 58], body: [104, 120, 34, 40] });
    }
    return { back, body, head, front, anc, geo };
  }
};

/* ---------- ĐÁ ---------- */
// rockChunk, amber dùng chung với scenes.js: giữ nguyên tên và chữ ký
const rockChunk = (x, y, r, col = '#a58060', cold = '#6e4c34') => pa(`M${P(x - r, y + r * .3)} L${P(x - r * .7, y - r * .6)} L${P(x + r * .1, y - r)} L${P(x + r, y - r * .35)} L${P(x + r * .85, y + r * .6)} L${P(x - r * .2, y + r * .8)} Z`, cel(col, cold), 3.5);
const amber = (x, y, h, w = h * .62) => crystal(x - w * .55, y + 1, h * .6, w * .7, '#ffcf4a', '#e08a00', 3, -w * .3) + crystal(x + w * .55, y + 1, h * .5, w * .62, '#ffcf4a', '#e08a00', 3, w * .3) + crystal(x, y, h, w, '#ffe07a', '#e08a00', 3);
// 4 dòng hệ Đá: mỗi dạng một dáng riêng (bé con → thiếu niên → trưởng thành → tối thượng).
// Toàn bộ hàm phụ nằm trong khối này để không đụng tên với các hệ khác.
(() => {
  /* ----- Hàm phụ ----- */
  // Đường cong mượt qua các điểm (Catmull-Rom → Bézier)
  const sm = (p, closed = true, k = 1) => {
    const n = p.length, at = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
    let d = `M${P(p[0][0], p[0][1])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = at(i - 1), b = at(i), c = at(i + 1), e = at(i + 2);
      d += ` C${P(b[0] + (c[0] - a[0]) / 6 * k, b[1] + (c[1] - a[1]) / 6 * k)} ${P(c[0] - (e[0] - b[0]) / 6 * k, c[1] - (e[1] - b[1]) / 6 * k)} ${P(c[0], c[1])}`;
    }
    return d + (closed ? 'Z' : '');
  };
  const shp = (p, fill, w = 5.5, ex = '') => pa(sm(p), fill, w, ex);
  const line = (p, col, w, ex = '') => ln(sm(p, false), col, w, ex);
  // Đá nhiều mặt cắt
  const JIT = [1, .82, .96, .78, 1.04, .86, .92];
  const rock = (x, y, r, col, cold, rot = 0, sw = 3.5, n = 6) => {
    const pts_ = [];
    for (let i = 0; i < n; i++) { const a = (rot + i * 360 / n) * Math.PI / 180, rr = r * JIT[i % 7]; pts_.push(P(x + Math.cos(a) * rr, y + Math.sin(a) * rr * .86)); }
    return `<path d="M${pts_.join(' L')} Z" fill="${cel(col, cold)}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round"/>` +
      ln(`M${P(x - r * .5, y - r * .25)} L${P(x + r * .05, y - r * .05)} L${P(x + r * .45, y - r * .4)} M${P(x + r * .05, y - r * .05)} L${P(x + r * .1, y + r * .5)}`, cold, 1.6, 'opacity=".7"');
  };
  // Đá bay lơ lửng (dạng 4), bỏ khi vẽ bản nhẹ
  const floaters = (list) => PET_LITE ? '' : list.map(([x, y, r, col, cold, rot, gem], i) =>
    `<g class="float" style="animation-delay:-${f1(i * .55)}s">${rock(x, y, r, col, cold, rot, 3)}${gem ? crystal(x + r * .1, y - r * .45, r * 1.05, r * .62, gem[0], gem[1], 2.2, 1) : ''}</g>`).join('');
  // Hạt sáng lấp lánh
  const glints = (list, col = '#fff6b0') => PET_LITE ? '' : list.map(([x, y, r], i) => spark4(x, y, r, i % 2 ? col : '#ffffff', 1.8, 'twinkle', i * .4)).join('');
  // Quầng sáng phẳng (không blur)
  const glow = (x, y, rx, ry, col, op = .35) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}"/>`;
  const blush = (x, y, r = 5) => el(x, y, r, r * .55, '#ff8fb8', 0, 'opacity=".55"');
  // Mắt bé con: tròn to, nhìn hơi về hướng lx
  const cuteEye = (cx, cy, rx, ry, iris, lx = -1.2) => el(cx, cy, rx, ry, '#fff', 3.6) + ci(cx + lx, cy + ry * .1, rx * .74, iris, 0) + ci(cx + lx, cy + ry * .14, rx * .46, OL, 0) +
    ci(cx + lx - rx * .3, cy - ry * .22, rx * .3, '#fff', 0) + ci(cx + lx + rx * .3, cy + ry * .42, rx * .14, '#fff', 0);
  const cuteEyes = (x, y, gap, rx, ry, iris, lx) => cuteEye(x - gap, y, rx, ry, iris, lx) + cuteEye(x + gap, y, rx, ry, iris, lx);
  // Tán lá bông như mây (bonsai, cây trên núi)
  const foliage = (x, y, w, h, c1 = '#5fd86a', c2 = '#1d8a45', n = 4) => {
    const p = [];
    for (let i = 0; i <= n * 2; i++) { const a = Math.PI * (1 + i / (n * 2)), k = i % 2 ? 1 : .8; p.push([x + Math.cos(a) * w * (i % 2 ? 1 : .94), y + Math.sin(a) * h * k]); }
    p.push([x + w * .72, y + h * .42], [x, y + h * .5], [x - w * .72, y + h * .42]);
    return shp(p, cel(c1, c2), 4.5) + ln(`M${P(x - w * .55, y - h * .2)} Q${P(x - w * .15, y - h * .72)} ${P(x + w * .3, y - h * .5)}`, '#d8ffb8', 2.4, 'opacity=".75"');
  };
  // Mảng rêu rủ xuống
  const moss = (x, y, w, h = 7) => shp([[x - w, y + h * .35], [x - w * .62, y - h * .45], [x, y - h * .62], [x + w * .62, y - h * .45], [x + w, y + h * .35], [x, y + h * .55]], cel('#86ec66', '#2f9a3e'), 3) +
    [[-.45, -105], [0, -90], [.42, -72]].map(([k, a]) => leaf(x + w * k, y - h * .25, h * 1.05, a, '#9df27a', '#2f9a3e', 2)).join('');
  // Mắt hạnh nhân cho dạng 2–4 (đầu nhỏ hơn dạng 1 nên dùng nét mảnh hơn eye() chung để không thành "kính tròn")
  const sharpEye = (cx, cy, rx, ry, side, o = {}) => {
    const sl = o.slant ?? .3, ix = cx - side * rx * .08, iy = cy + ry * .1;
    const inner = [cx - side * rx, cy + ry * .15], outer = [cx + side * rx, cy - ry * sl];
    const top = `M${P(inner[0], inner[1])} C${P(cx - side * rx * .6, cy - ry * 1.15)} ${P(cx + side * rx * .5, cy - ry * 1.2)} ${P(outer[0], outer[1])}`;
    const bot = `C${P(cx + side * rx * .7, cy + ry * .95)} ${P(cx - side * rx * .5, cy + ry * 1.1)} ${P(inner[0], inner[1])} Z`;
    let s = '';
    if (o.glow) s += glow(cx, cy, rx + 4.5, ry + 4, o.glow, .45);
    s += `<path d="${top} ${bot}" fill="#fff" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += ci(ix, iy, ry * .8, o.iris, 0) + (o.glow ? `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(ry * .8)}" fill="none" stroke="#fff6b0" stroke-width="1.2"/>` : '') + ci(ix, iy, ry * .44, OL, 0);
    s += ci(ix - ry * .3, iy - ry * .32, ry * .25, '#fff', 0) + ci(ix + ry * .32, iy + ry * .32, ry * .11, '#fff', 0);
    s += ln(top + ` l${f1(side * rx * .24)},${f1(-ry * .14)}`, OL, o.lw ?? 3.4);
    if (o.brow) s += ln(`M${P(cx - side * rx * 1.05, cy - ry * 1.3 + 1.8)} Q${P(cx - side * rx * .1, cy - ry * 1.85)} ${P(cx + side * rx * 1.1, cy - ry * 1.6)}`, OL, o.bw ?? 3.4);
    return s;
  };
  // Bộ mắt theo dạng: 1 tròn to dễ thương, 2 hạnh nhân, 3 sắc có mày, 4 sắc uy nghi và phát sáng
  const EYE = [null, null, { sl: .12, k: .98 }, { sl: .32, k: .86 }, { sl: .48, k: .78 }];
  const eyesF = (f, x, y, gap, rx, ry, skin, iris, o = {}) => {
    const e = EYE[f];
    let s = '';
    for (const sd of [-1, 1]) s += sharpEye(x + sd * gap, y, rx * 1.06, ry * e.k, sd, { iris, slant: e.sl, brow: f >= 3, glow: f >= 4 ? (o.glowCol || iris) : null, bw: o.bw });
    return s;
  };
  // Chân trụ mập (nhìn ngang), gốc trên tại (x, yTop), bàn chân chạm đất
  const stump = (x, yTop, w, fill, o = {}) => {
    const gy = o.gy ?? GROUND, fw = w * (o.foot ?? .62);
    let s = shp([[x - w * .5, yTop], [x - w * .52, (yTop + gy) / 2], [x - fw - 1, gy - 3], [x - fw * .6, gy + 1.5], [x + fw * .6, gy + 1.5], [x + fw + 1, gy - 3], [x + w * .52, (yTop + gy) / 2], [x + w * .5, yTop], [x, yTop - w * .2]], fill, o.sw ?? 5);
    if (o.nails) s += [-.55, 0, .55].map(k => el(x + fw * k, gy - 1, fw * .2, 2.6, o.nails, 1.8)).join('');
    if (o.band) s += ln(`M${P(x - w * .52, o.bandY)} Q${P(x, o.bandY + 4)} ${P(x + w * .52, o.bandY)}`, OL, 7) + ln(`M${P(x - w * .5, o.bandY)} Q${P(x, o.bandY + 4)} ${P(x + w * .5, o.bandY)}`, o.band, 4);
    return s;
  };
  // Neo trang phục cho đầu tròn ở (x, y) bán kính rx/ry, mắt cách nhau gap
  const ancHead = (x, y, rx, ry, eyeY, gap, o = {}) => ({
    head: [o.hx ?? x, o.top ?? y - ry * .82, o.hw ?? rx * 1.5],
    eyes: [o.ex ?? x, eyeY, gap * 3.15],
    neck: o.neck, back: o.back, body: o.body,
    fx: { hx: o.hx ?? x, hy: y, hrx: rx, hry: ry }
  });

  // Phóng cả một dạng quanh điểm chân (100, GROUND), kèm điểm neo
  const grow = (o, k) => {
    const T = x => x ? `<g transform="translate(100 ${GROUND}) scale(${k}) translate(-100 -${GROUND})">${x}</g>` : '';
    const A = a => a && a.map((v, i) => i === 0 ? 100 + (v - 100) * k : i === 1 ? GROUND + (v - GROUND) * k : v * k);
    const anc = {};
    for (const key in o.anc) anc[key] = key === 'fx' ? { hx: 100 + (o.anc.fx.hx - 100) * k, hy: GROUND + (o.anc.fx.hy - GROUND) * k, hrx: o.anc.fx.hrx * k, hry: o.anc.fx.hry * k } : A(o.anc[key]);
    return { back: T(o.back), body: T(o.body), head: T(o.head), front: T(o.front), anc };
  };

  /* ======================= RÙA ĐÁ ======================= */
  // Nhận diện xuyên suốt: da xanh ngọc, mai đá nâu có ô lục giác, mắt hổ phách.
  // 1 rùa con mai sỏi tròn có rêu → 2 mai mọc cụm hổ phách, cổ vươn → 3 mai thành vách đá có cây bonsai
  // → 4 Kim Quy cõng cả hòn đảo: tháp nhỏ, thác nước, tinh thể phát sáng, đảo nhỏ bay quanh.
  // Đầu rùa chung: đầu tròn, cằm sáng, điểm sáng góc trên trái
  const tHead = (hx, hy, rx, ry, c) => el(hx, hy, rx, ry, cel(c.b, c.s), 5.5) +
    pa(`M${P(hx - rx * .76, hy + ry * .26)} Q${P(hx - 1, hy + ry * .02)} ${P(hx + rx * .7, hy + ry * .26)} Q${P(hx + rx * .56, hy + ry * .94)} ${P(hx - 1, hy + ry * .95)} Q${P(hx - rx * .64, hy + ry * .94)} ${P(hx - rx * .76, hy + ry * .26)} Z`, c.l, 0) +
    hl(hx - rx * .5, hy - ry * .66, rx * .26, ry * .13, -28, .5);
  const tMouth = (hx, y, w, smile = 1) => ln(`M${P(hx - w, y)} Q${P(hx - 1, y + 4 * smile)} ${P(hx + w, y - 1)}`, OL, 3);
  // Ô lục giác trên mai: tâm (x, y), nửa rộng w, nửa cao h; spoke: tia ra mép
  const hexPlate = (x, y, w, h, col, sw, spoke) => {
    const p = [[x - w * .55, y - h], [x + w * .55, y - h], [x + w, y], [x + w * .55, y + h], [x - w * .55, y + h], [x - w, y]];
    let s = ln(`M${p.map(q => P(q[0], q[1])).join(' L')} Z`, col, sw);
    if (spoke) s += ln(spoke.map(([i, dx, dy]) => `M${P(p[i][0], p[i][1])} l${f1(dx)},${f1(dy)}`).join(' '), col, sw);
    return s;
  };
  const TURTLE = [null,
    // ---- 1: rùa con mai sỏi tròn, rêu nhỏ ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 66, hy = 148, hrx = 25, hry = 23;
      body += stump(100, 165, 14, c.s) + stump(140, 165, 13, c.s);
      body += shp([[140, 167], [156, 171], [160, 177], [144, 177]], cel(c.b, c.s), 4.5);
      body += shp([[74, 171], [76, 148], [90, 129], [112, 122], [134, 129], [147, 148], [150, 171], [112, 177]], cel(c.sh, c.shs), 5.5);
      body += line([[80, 167], [112, 172], [145, 167]], c.rim, 4);
      body += hexPlate(112, 149, 13, 13, c.shs, 2.6, [[0, -6, -9], [1, 7, -8], [2, 16, 2], [5, -15, 2]]);
      body += hl(96, 134, 9, 4, -25, .5) + ci(136, 141, 1.8, c.shs, 0) + ci(90, 158, 1.6, c.shs, 0) + ci(128, 160, 1.4, c.shs, 0);
      // rêu và hai lá non
      body += moss(110, 124, 13, 6) + leaf(112, 119, 11, -120, '#9df27a', '#2f9a3e', 2.6) + leaf(113, 119, 9, -60, '#9df27a', '#2f9a3e', 2.6);
      body += stump(88, 167, 16, cel(c.b, c.s), { nails: c.l }) + stump(128, 168, 15, cel(c.b, c.s), { nails: c.l });
      head += tHead(hx, hy, hrx, hry, c);
      head += ci(hx + 15, hy - 14, 2.2, c.s, 0) + ci(hx + 19, hy - 7, 1.6, c.s, 0);
      head += cuteEyes(hx - 1, hy - 1, 11, 8.4, 9.2, c.i);
      head += blush(hx - 18, hy + 9) + blush(hx + 16, hy + 9);
      head += el(hx - 3.5, hy + 8, 1.3, 1, OL, 0) + el(hx + 1.5, hy + 8, 1.3, 1, OL, 0);
      head += ln(`M${P(hx - 6, hy + 13)} Q${P(hx - 1, hy + 18)} ${P(hx + 5, hy + 13)}`, OL, 3);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, hrx, hry, hy - 1, 11, { hx: hx - 1, neck: [hx + 2, hy + 21, 34], back: [hx + 16, hy + 14, 30, 28], body: [112, 150, 40, 40] })
      };
    },
    // ---- 2: rùa thiếu niên, mai mọc cụm hổ phách ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 60, hy = 116, hrx = 22, hry = 20;
      body += stump(102, 150, 17, c.s) + stump(152, 150, 16, c.s);
      body += shp([[148, 154], [168, 159], [176, 168], [154, 168]], cel(c.b, c.s), 4.5);
      body += tube(`M${P(88, 150)} Q${P(70, 144)} ${P(hx + 4, hy + 10)}`, cel(c.b, c.s), 15, 5.5);
      body += ln(`M${P(84, 140)} Q${P(75, 136)} ${P(70, 127)}`, c.s, 2.2, 'opacity=".7"');
      body += shp([[78, 156], [80, 128], [96, 107], [120, 100], [144, 107], [158, 128], [162, 156], [120, 164]], cel(c.sh, c.shs), 5.5);
      body += line([[85, 152], [120, 160], [156, 152]], c.rim, 4);
      body += hexPlate(120, 133, 15, 16, c.shs, 2.8, [[0, -8, -9], [1, 8, -9], [2, 20, 2], [5, -20, 3], [3, 4, 8], [4, -4, 8]]);
      body += hl(102, 113, 11, 4.5, -25, .5);
      body += crystal(108, 107, 16, 9, '#ffcf4a', '#e08a00', 3, -5) + crystal(134, 109, 14, 8, '#ffcf4a', '#e08a00', 3, 6) + crystal(121, 104, 27, 11, '#ffe07a', '#e08a00', 3.2, 2);
      body += moss(88, 122, 8, 6) + moss(154, 128, 6, 5);
      body += stump(90, 152, 19, cel(c.b, c.s), { nails: c.l }) + stump(142, 153, 18, cel(c.b, c.s), { nails: c.l });
      head += tHead(hx, hy, hrx, hry, c);
      head += ci(hx + 13, hy - 13, 2, c.s, 0) + ci(hx + 17, hy - 6, 1.5, c.s, 0);
      head += eyesF(2, hx - 2, hy - 1, 10, 7.6, 8, c.b, c.i);
      head += blush(hx - 16, hy + 9, 4);
      head += el(hx - 4, hy + 7, 1.3, 1, OL, 0) + el(hx + 1, hy + 7, 1.3, 1, OL, 0);
      head += ln(`M${P(hx - 8, hy + 12)} Q${P(hx - 1, hy + 16)} ${P(hx + 7, hy + 11)}`, OL, 3);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, hrx, hry, hy - 1, 10, { hx: hx - 1, neck: [hx + 6, hy + 19, 30], back: [hx + 18, hy + 18, 30, 34], body: [120, 134, 48, 46] })
      };
    },
    // ---- 3: mai thành vách đá, bonsai mọc trên ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 42, hy = 100, hrx = 22, hry = 20;
      body += stump(92, 146, 22, c.s) + stump(160, 146, 21, c.s);
      body += shp([[160, 150], [182, 156], [190, 168], [166, 166]], cel(c.b, c.s), 4.5);
      body += tube(`M${P(76, 146)} Q${P(52, 138)} ${P(hx + 4, hy + 12)}`, cel(c.b, c.s), 19, 5.5);
      body += ln(`M${P(72, 134)} Q${P(60, 130)} ${P(54, 118)} M${P(76, 124)} Q${P(68, 122)} ${P(62, 112)}`, c.s, 2.2, 'opacity=".7"');
      // vách đá nhiều tầng
      body += shp([[70, 120], [74, 100], [86, 92], [92, 80], [106, 74], [114, 66], [132, 63], [146, 72], [150, 86], [162, 96], [166, 120]], cel('#d4ab7e', '#8a5a34'), 5);
      body += ln('M82,100 L100,98 L108,90 M118,79 L142,79 M126,95 L152,97 M94,112 L122,110', '#8a5a34', 2.6);
      body += hl(102, 84, 10, 4, -25, .45);
      // bonsai
      body += tube(`M${P(126, 70)} C${P(134, 54)} ${P(106, 56)} ${P(110, 44)} S${P(98, 30)} ${P(88, 34)}`, cel('#a8683a', '#5e3418'), 8, 4.5);
      body += tube(`M${P(119, 52)} Q${P(132, 46)} ${P(142, 47)}`, '#8a5a34', 4.5, 3.5) + tube(`M${P(104, 40)} Q${P(92, 45)} ${P(80, 50)}`, '#8a5a34', 4, 3.5);
      body += foliage(146, 46, 16, 10) + foliage(78, 50, 14, 9) + foliage(100, 30, 24, 14, '#5fd86a', '#1d8a45', 5);
      body += moss(98, 76, 7, 5) + moss(150, 90, 6, 5);
      // mai
      body += shp([[56, 152], [58, 124], [76, 106], [116, 98], [156, 106], [176, 126], [180, 152], [118, 162]], cel(c.sh, c.shs), 5.5);
      body += line([[64, 148], [118, 158], [174, 148]], c.rim, 4.2);
      body += hexPlate(118, 131, 16, 17, c.shs, 3, [[0, -8, -9], [1, 10, -9], [2, 32, 3], [5, -30, 4], [3, 6, 10], [4, -4, 10]]);
      body += hl(86, 116, 13, 5, -25, .45);
      body += amber(68, 126, 18) + amber(168, 125, 14);
      body += moss(82, 106, 10, 6) + moss(146, 106, 8, 5);
      body += stump(78, 150, 24, cel(c.b, c.s), { nails: c.l }) + stump(150, 151, 23, cel(c.b, c.s), { nails: c.l });
      body += ln('M71,166 q7,3 14,0 M143,168 q7,3 14,0', c.s, 2.4);
      head += tHead(hx, hy, hrx, hry, c);
      head += eyesF(3, hx - 2, hy - 1, 10, 7, 7.2, c.b, c.i);
      head += el(hx - 4, hy + 8, 1.3, 1, OL, 0) + el(hx + 1, hy + 8, 1.3, 1, OL, 0);
      head += tMouth(hx - 1, hy + 13, 8);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, hrx, hry, hy - 1, 10, { hx: hx - 1, top: hy - hry * .9, neck: [hx + 8, hy + 20, 32], back: [hx + 22, hy + 22, 34, 44], body: [118, 132, 56, 54] })
      };
    },
    // ---- 4: Kim Quy cõng đảo ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 36, hy = 88, hrx = 22, hry = 20;
      back += auraBack('stone', RIG[4]);
      // đuôi rêu dài bay (rùa thần)
      back += `<g class="sway">` + shp([[170, 150], [188, 146], [198, 158], [194, 176], [184, 184], [188, 170], [180, 162]], cel('#7be35a', '#1d8a45'), 4.5) + ln('M180,152 Q192,156 190,172', '#d8ffb8', 2, 'opacity=".7"') + `</g>`;
      body += stump(90, 146, 24, c.s, { band: '#d48700', bandY: 168 }) + stump(164, 146, 23, c.s, { band: '#d48700', bandY: 168 });
      body += tube(`M${P(74, 144)} Q${P(44, 132)} ${P(hx + 4, hy + 12)}`, cel(c.b, c.s), 20, 5.5);
      body += ln(`M${P(68, 132)} Q${P(54, 126)} ${P(48, 110)} M${P(74, 120)} Q${P(64, 116)} ${P(58, 104)}`, c.s, 2.2, 'opacity=".7"');
      // đảo: đất đá
      body += shp([[58, 118], [62, 98], [72, 82], [84, 76], [96, 82], [118, 74], [136, 54], [154, 44], [170, 58], [178, 88], [186, 118]], cel('#c8996c', '#7a4f2a'), 5);
      body += ln('M70,104 L92,102 M124,86 L146,84 L156,72 M118,104 L142,104 M156,100 L178,102', '#7a4f2a', 2.6);
      body += pa(`M${P(78, 80)} Q${P(90, 72)} ${P(98, 81)} Q${P(108, 78)} ${P(118, 75)} Q${P(127, 66)} ${P(137, 54)} L${P(141, 62)} Q${P(128, 82)} ${P(104, 89)} Q${P(90, 88)} ${P(78, 87)} Z`, cel('#6fe07a', '#2f9a3e'), 3.5);
      body += pa(`M${P(142, 52)} Q${P(155, 40)} ${P(169, 56)} L${P(165, 63)} Q${P(156, 53)} ${P(145, 59)} Z`, cel('#6fe07a', '#2f9a3e'), 3);
      // thác nước uốn theo sườn đảo
      body += pa(`M${P(155, 62)} Q${P(162, 66)} ${P(168, 62)} Q${P(170, 100)} ${P(174, 140)} Q${P(162, 146)} ${P(150, 140)} Q${P(154, 100)} ${P(155, 62)} Z`, 'url(#gWater)', 4);
      body += `<g class="flow">${ln('M158,68 Q158,104 156,136', '#ffffff', 2.4, 'stroke-dasharray="8 8" opacity=".9"')}${ln('M165,68 Q166,104 168,136', '#ffffff', 2, 'stroke-dasharray="5 10" opacity=".8"')}</g>`;
      body += ln('M154,66 q3.5,-3 7,0 t7,0', '#ffffff', 2.4) + ci(152, 140, 2.2, '#ffffff', 1.4);
      // tháp nhỏ ba tầng
      const tw = (y, w, h) => pa(`M${P(100 - w, y)} L${P(100 + w, y)} L${P(100 + w, y - h)} L${P(100 - w, y - h)} Z`, cel('#fff1d6', '#d9b98a'), 3) + pa(`M${P(100 - w * .38, y)} L${P(100 - w * .38, y - h * .5)} Q${P(100, y - h * .95)} ${P(100 + w * .38, y - h * .5)} L${P(100 + w * .38, y)} Z`, '#5a3a2a', 0) +
        pa(`M${P(100 - w - 4, y - h)} Q${P(100, y - h - 4)} ${P(100 + w + 4, y - h)} L${P(100 + w + 6, y - h - 4)} Q${P(100, y - h - 9)} ${P(100 - w - 6, y - h - 4)} Z`, 'url(#gGold)', 2.6);
      body += tw(80, 12, 13) + tw(62, 9, 10) + tw(48, 6.5, 8);
      body += pa(`M${P(91, 36)} Q${P(100, 32)} ${P(109, 36)} Q${P(102, 28)} ${P(100, 18)} Q${P(98, 28)} ${P(91, 36)} Z`, 'url(#gGold)', 2.6) + ci(100, 17, 2.4, '#ff4d6a', 1.6);
      const pine = (x, y, h) => pa(`M${P(x - h * .38, y)} L${P(x, y - h)} L${P(x + h * .38, y)} Z`, cel('#4fd06a', '#1d8a45'), 3) + ln(`M${P(x - h * .22, y - h * .4)} L${P(x, y - h * .55)} L${P(x + h * .22, y - h * .4)}`, '#1d8a45', 2);
      body += pine(80, 80, 15) + pine(128, 70, 13) + pine(146, 48, 12);
      // tinh thể phát sáng
      body += glow(70, 100, 16, 12, '#3fe0b0', .45) + crystal(64, 108, 16, 8, '#7dffd8', '#14a37a', 3, -4) + crystal(74, 106, 22, 10, '#a9ffe6', '#14a37a', 3, 2);
      body += glow(182, 106, 11, 10, '#ffd21f', .45) + amber(182, 114, 13);
      // mai: viền vàng, đường ghép ô phát sáng
      body += shp([[52, 152], [54, 122], [74, 104], [118, 96], [162, 104], [184, 124], [190, 152], [120, 162]], cel(c.sh, c.shs), 5.5);
      body += pa(`M${P(56, 146)} Q${P(120, 160)} ${P(188, 146)} L${P(190, 154)} Q${P(120, 168)} ${P(54, 154)} Z`, 'url(#gGold)', 3.5);
      const seams = 'M101,112 L135,112 L150,129 L135,146 L101,146 L86,129 Z M101,112 L93,104 M135,112 L147,104 M150,129 L184,131 M86,129 L58,133 M135,146 L140,156 M101,146 L96,156';
      body += ln(seams, '#ffd21f', 7, 'opacity=".3"') + ln(seams, '#ffe680', 2.6);
      body += glow(118, 129, 10, 9, '#3fe0b0', .4) + pa(`M${P(118, 121)} L${P(125, 129)} L${P(118, 137)} L${P(111, 129)} Z`, cel('#a9ffe6', '#14a37a'), 2.6) + hl(116, 126, 2, 1.2, -30, .9);
      body += hl(84, 116, 13, 5, -25, .45);
      body += pa(`M${P(150, 140)} Q${P(162, 147)} ${P(174, 140)} L${P(176, 150)} Q${P(162, 157)} ${P(148, 150)} Z`, 'url(#gWater)', 3) + ci(148, 152, 3, '#ffffff', 1.6) + ci(177, 151, 2.6, '#ffffff', 1.6) + ci(163, 156, 2, '#ffffff', 1.4);
      body += stump(76, 150, 25, cel(c.b, c.s), { nails: '#ffd21f', band: '#ffd21f', bandY: 170 }) + stump(152, 151, 24, cel(c.b, c.s), { nails: '#ffd21f', band: '#ffd21f', bandY: 171 });
      // đầu uy nghi: vương miện vàng, ngọc lục bảo
      head += tHead(hx, hy, hrx, hry, c);
      head += pa(`M${P(hx - 16, hy - 9)} L${P(hx - 13, hy - 23)} L${P(hx - 6, hy - 15)} L${P(hx - 1, hy - 28)} L${P(hx + 4, hy - 15)} L${P(hx + 11, hy - 23)} L${P(hx + 14, hy - 9)} Q${P(hx - 1, hy - 15)} ${P(hx - 16, hy - 9)} Z`, 'url(#gGold)', 3) + ci(hx - 1, hy - 13, 3, '#3fe0b0', 1.8);
      head += eyesF(4, hx - 2, hy, 10, 6.8, 6.6, c.b, c.i, { glowCol: '#ffd21f' });
      head += el(hx - 4, hy + 8, 1.3, 1, OL, 0) + el(hx + 1, hy + 8, 1.3, 1, OL, 0);
      head += tMouth(hx - 1, hy + 13, 8, .6);
      front += floaters([[18, 40, 9, '#c8996c', '#7a4f2a', 10, ['#a9ffe6', '#14a37a']], [186, 28, 7, '#c8996c', '#7a4f2a', 40], [192, 84, 6, '#c8996c', '#7a4f2a', 70], [14, 140, 6.5, '#c8996c', '#7a4f2a', 20, ['#ffe07a', '#e08a00']]]);
      front += glints([[32, 16, 5], [174, 8, 4.5], [8, 96, 4]]);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, hrx, hry, hy, 10, { hx: hx - 1, top: hy - hry * .9, neck: [hx + 8, hy + 20, 32], back: [hx + 22, hy + 22, 34, 48], body: [120, 128, 60, 56] })
      };
    }
  ];
  PET_SPECS.turtle = {
    el: 'stone',
    c: { b: '#5cc9ae', s: '#2a8a7c', l: '#e3f7d0', ls: '#b9e0b0', i: '#ffb21f', sh: '#c4946a', shs: '#7a5232', rim: '#f0cf9a' },
    c4: { b: '#3fae9a', s: '#1d6a60', sh: '#a87448', shs: '#5c3a20', rim: '#ffd21f', i: '#ffd21f' },
    draw(f, g, c) { return TURTLE[f](c, g); }
  };
  /* ======================= TÊ TÊ ĐÁ ======================= */
  // Nhận diện: vảy xếp lớp phủ toàn thân (đầu, lưng, đuôi), mõm nhọn hồng, mắt xanh cyan, đuôi to dài.
  // 1 cuộn tròn thành quả bóng → 2 bò bốn chân → 3 đứng hai chân, vảy phiến đá vân hổ phách
  // → 4 tê tê thần: vảy ngọc viền vàng, cổ áo vảy xòe, đuôi cuộn xoắn ốc, đá bay.
  // Một chiếc vảy kiểu ngói: gốc phía sau, chóp tròn hướng theo ang (độ; 0 = phải, 90 = xuống); viền chóp sáng
  const scl = (x, y, w, h, ang, fill, rim, sw = 2.8, vein = '') => {
    const R0 = n => Math.round(n), d = (k, dy) => `M${R0(x - w * k)},${R0(y - h * .45 * k + dy)}Q${R0(x)},${R0(y - h * .62 * k + dy)} ${R0(x + w * k)},${R0(y - h * .45 * k + dy)}Q${R0(x + w * k * 1.06)},${R0(y + h * .22 * k + dy)} ${R0(x)},${R0(y + h * .55 * k + dy)}Q${R0(x - w * k * 1.06)},${R0(y + h * .22 * k + dy)} ${R0(x - w * k)},${R0(y - h * .45 * k + dy)}Z`;
    // deco: 'v#màu' = vân đá zigzag, 'g#màu' = ngọc khảm giữa vảy
    const v = !vein ? '' : vein[0] === 'g' ? `<circle cx="${f1(x)}" cy="${f1(y - h * .02)}" r="${f1(w * .3)}" fill="${vein.slice(1)}" stroke="${OL}" stroke-width="1.6"/><circle cx="${f1(x - w * .1)}" cy="${f1(y - h * .1)}" r="${f1(w * .1)}" fill="#fff"/>` :
      `<path d="M${P(x - w * .5, y - h * .12)}L${P(x - w * .08, y + h * .06)}L${P(x + w * .12, y - h * .05)}L${P(x + w * .42, y + h * .14)}" fill="none" stroke="${vein.slice(1)}" stroke-width="1.8" stroke-linecap="round"/>`;
    return `<g transform="rotate(${Math.round(ang - 90)} ${R0(x)} ${R0(y)})"><path d="${d(1, 0)}" fill="${rim}" stroke="${OL}" stroke-width="${sw}" stroke-linejoin="round"/><path d="${d(.74, -h * .16)}" fill="${fill}"/>${v}</g>`;
  };
  // Hàng vảy quấn ngang thân đứng: từ mép bụng (xL) sang mép lưng (xR), võng sag; vảy lưng vẽ trước, vảy trước đè lên
  const sclRow = (xL, xR, y, sag, n, w, h, fill, rim, sw = 2.8, spread = 50, vein = '', vk = 0) => {
    let s = '';
    for (let i = n - 1; i >= 0; i--) {
      const t = n === 1 ? .5 : i / (n - 1), x = xL + (xR - xL) * t, yy = y + sag * 4 * t * (1 - t), k = .72 + .28 * Math.sin(Math.PI * Math.min(1, t * 1.15));
      s += scl(x, yy, w * k, h, 90 + (.5 - t) * spread, fill, rim, sw, (i + vk) % 2 ? vein : '');
    }
    return s;
  };
  // Hàng vảy dọc cung elip (lưng nhìn ngang, quả bóng cuộn): chóp theo chiều tăng góc, nghiêng thêm tilt
  const sclArc = (cx, cy, rx, ry, a0, a1, n, w, h, fill, rim, tilt = 0, sw = 2.8) => {
    let s = '';
    for (let i = n - 1; i >= 0; i--) {
      const a = (a0 + (a1 - a0) * (n === 1 ? .5 : i / (n - 1))) * Math.PI / 180, x = cx + Math.cos(a) * rx, y = cy + Math.sin(a) * ry;
      s += scl(x, y, w, h, Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) * 180 / Math.PI + tilt, fill, rim, sw);
    }
    return s;
  };
  // Vảy dọc đường cong bậc hai (đuôi): p0 → q → p1, cỡ nhỏ dần về chóp
  const sclPath = (p0, q, p1, n, w0, w1, fill, rim, sw = 2.8, tilt = 0) => {
    let s = '';
    for (let i = n - 1; i >= 0; i--) {
      const t = i / (n - 1), u = 1 - t;
      const x = u * u * p0[0] + 2 * u * t * q[0] + t * t * p1[0], y = u * u * p0[1] + 2 * u * t * q[1] + t * t * p1[1];
      const dx = 2 * u * (q[0] - p0[0]) + 2 * t * (p1[0] - q[0]), dy = 2 * u * (q[1] - p0[1]) + 2 * t * (p1[1] - q[1]);
      const w = w0 + (w1 - w0) * t;
      s += scl(x, y, w, w * 1.15, Math.atan2(dy, dx) * 180 / Math.PI + tilt, fill, rim, sw);
    }
    return s;
  };
  const claws = (x, y, n, len, ang, col = '#fff6e0', sp = 4.5) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (ang + (i - (n - 1) / 2) * 14) * Math.PI / 180, bx = x + (i - (n - 1) / 2) * sp, ex = bx + Math.cos(a) * len, ey = y + Math.sin(a) * len;
      s += pa(`M${P(bx - 2, y)} Q${P(bx + Math.cos(a) * len * .6 - 1.6, y + Math.sin(a) * len * .6)} ${P(ex, ey)} Q${P(bx + Math.cos(a) * len * .5 + 2.2, y + Math.sin(a) * len * .5)} ${P(bx + 2, y)} Z`, col, 1.8);
    }
    return s;
  };
  // Đầu tê tê nhìn 3/4 sang trái: sọ tròn + mõm thon, mũi hồng; vảy nhỏ phủ đỉnh đầu chạy ra gáy
  const pgHead = (hx, hy, r, c, o = {}) => {
    const sx = hx - r * 1.5, sy = hy + r * .6;
    let s = bl(`<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="${f1(r)}" ry="${f1(r * .92)}"/><path d="M${P(hx - r * .5, hy - r * .2)} Q${P(sx + r * .25, sy - r * .5)} ${P(sx, sy)} Q${P(sx + r * .5, sy + r * .34)} ${P(hx + r * .1, hy + r * .78)} Z"/>`, cel(c.b, c.s));
    s += pa(`M${P(hx - r * .6, hy + r * .12)} Q${P(sx + r * .5, sy - r * .12)} ${P(sx + r * .12, sy + r * .04)} Q${P(sx + r * .6, sy + r * .34)} ${P(hx + r * .32, hy + r * .74)} Q${P(hx - r * .2, hy + r * .5)} ${P(hx - r * .6, hy + r * .12)} Z`, c.l, 0);
    s += el(sx + r * .06, sy - r * .03, r * .19, r * .14, '#ff8fb8', 2.4);
    s += ln(`M${P(sx + r * .52, sy + r * .2)} Q${P(sx + r * .75, sy + r * .3)} ${P(sx + r * .95, sy + r * .2)}`, OL, 2.2);
    const k = o.crest || 1, F = o.sf || cel(c.sc, c.scs), Rm = o.rim || c.scl;
    // vảy đầu: hai hàng nhỏ từ trán chạy về gáy
    s += sclArc(hx + r * .2, hy + r * .35, r * .98, r * 1.12, 222, 322, 4, r * .27 * k, r * .3 * k, F, Rm, 38, 2.4);
    s += sclArc(hx + r * .3, hy + r * .3, r * .7, r * .8, 250, 325, 3, r * .22 * k, r * .25 * k, F, Rm, 38, 2.2);
    return { s, eye: [hx - r * .32, hy + r * .06] };
  };
  const PANGOLIN = [null,
    // ---- 1: tê tê con cuộn tròn ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const bx = 104, by = 146, R = 40, S = cel(c.sc, c.scs);
      body += ci(bx, by, R, cel('#8a5a30', '#5e3a16'), 5.5);
      body += sclArc(bx, by, R - 9, R - 9, 205, 470, 13, 10, 12, S, c.scl, 12);
      body += sclArc(bx + 3, by - 3, R - 22, R - 22, 235, 470, 7, 8.5, 10, S, c.scl, 12);
      body += scl(bx + 6, by - 6, 6.5, 8, 20, S, c.scl);
      body += hl(bx + 2, by - 32, 8, 3.2, -15, .45);
      // đuôi ôm vòng dưới, chóp vắt lên bên trái
      front += tube(`M${P(142, 158)} Q${P(130, 190)} ${P(92, 184)} Q${P(62, 178)} ${P(64, 152)}`, '#6e4520', 12, 5);
      front += sclPath([140, 160], [130, 188], [92, 184], 6, 8.5, 7.5, S, c.scl, 2.6, 0) + sclPath([92, 184], [62, 180], [64, 150], 4, 7.5, 5.5, S, c.scl, 2.6, 0);
      // mặt ló ra từ vòng cuộn
      const hx = 88, hy = 150;
      head += el(hx, hy, 21, 17.5, cel(c.b, c.s), 5);
      head += pa(`M${P(hx - 16, hy + 3)} Q${P(hx, hy - 3)} ${P(hx + 16, hy + 4)} Q${P(hx + 11, hy + 16.5)} ${P(hx, hy + 16.5)} Q${P(hx - 12, hy + 15.5)} ${P(hx - 16, hy + 3)} Z`, c.l, 0);
      head += sclArc(hx + 1, hy + 7, 21, 25, 224, 316, 4, 5.4, 6.2, S, c.scl, 0, 2.2);
      head += cuteEyes(hx, hy - 1, 9, 7, 7.6, c.i, -1);
      head += el(hx - 1, hy + 9, 3.4, 2.4, '#ff8fb8', 2.2) + blush(hx - 13.5, hy + 7.5, 3.6) + blush(hx + 13.5, hy + 7.5, 3.6);
      head += ln(`M${P(hx - 3, hy + 13.5)} Q${P(hx - 1, hy + 15)} ${P(hx + 1.5, hy + 13.5)}`, OL, 2);
      front += el(80, 170, 5.5, 4.6, cel(c.b, c.s), 3.2) + el(98, 172, 5.5, 4.6, cel(c.b, c.s), 3.2) + claws(80, 173, 2, 3.6, 95, '#fff6e0', 3.4) + claws(98, 175, 2, 3.6, 95, '#fff6e0', 3.4);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 21, 17.5, hy - 1, 9, { top: hy - 21, hw: 34, neck: [hx + 2, hy + 18, 26], back: [bx, by - 40, 72, 80], body: [bx + 12, by + 2, 40, 46] })
      };
    },
    // ---- 2: tê tê bò bốn chân ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const S = cel(c.sc, c.scs);
      body += stump(92, 158, 13, c.s, { foot: .7 }) + stump(140, 158, 13, c.s, { foot: .7 });
      // đuôi dày
      body += tube(`M${P(140, 146)} Q${P(170, 150)} ${P(176, 178)}`, '#6e4520', 18, 5);
      body += sclPath([140, 144], [168, 148], [176, 178], 6, 10, 6.5, S, c.scl, 2.6, 0);
      // thân vòm
      body += pa(`M${P(60, 168)} Q${P(56, 110)} ${P(104, 106)} Q${P(152, 108)} ${P(152, 166)} Q${P(106, 172)} ${P(60, 168)} Z`, cel('#8a5a30', '#5e3a16'), 5.5);
      body += sclArc(104, 170, 24, 18, 200, 340, 5, 8, 9.5, S, c.scl, 34);
      body += sclArc(104, 170, 34, 34, 194, 346, 7, 9, 10.5, S, c.scl, 34);
      body += sclArc(104, 170, 43, 52, 190, 350, 9, 10, 12, S, c.scl, 34);
      body += hl(84, 116, 9, 4, -30, .4);
      body += stump(78, 160, 15, cel(c.b, c.s), { foot: .72 }) + claws(73, 186, 3, 6, 180) + stump(130, 160, 15, cel(c.b, c.s), { foot: .72 }) + claws(125, 186, 3, 5, 180);
      const H = pgHead(52, 136, 17, c);
      head += H.s;
      head += eyesF(2, H.eye[0], H.eye[1], 7.4, 5.6, 6, c.b, c.i);
      head += blush(H.eye[0] - 8, H.eye[1] + 10, 3.2);
      return {
        back, body, head, front,
        anc: ancHead(H.eye[0] + 2, 136, 17, 16, H.eye[1], 7.4, { top: 122, hw: 26, neck: [62, 150, 24], back: [130, 116, 46, 50], body: [104, 140, 50, 44] })
      };
    },
    // ---- 3: đứng hai chân, vảy phiến đá vân hổ phách ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const S = cel('#c9a47c', '#7e5a3a'), rim = '#f3dcb8';
      body += tube(`M${P(126, 160)} Q${P(174, 188)} ${P(188, 152)}`, '#6e4520', 22, 5);
      body += sclPath([126, 158], [174, 188], [188, 150], 7, 12, 8, S, rim, 2.8, 0);
      body += stump(88, 166, 20, cel(c.b, c.s), { foot: .75 }) + claws(83, 186, 3, 6, 180) + stump(120, 166, 20, cel(c.b, c.s), { foot: .75 }) + claws(115, 186, 3, 6, 180);
      // thân hình giọt
      body += pa(sm([[104, 64], [130, 80], [138, 124], [132, 164], [104, 176], [78, 168], [70, 128], [78, 88]]), cel('#7a5232', '#4e3014'), 5.5);
      body += pa(sm([[84, 84], [94, 94], [97, 132], [93, 166], [83, 166], [77, 140], [78, 102]]), cel(c.l, c.ls), 3.5);
      body += ln('M80,112 q8,3 16,0 M78,128 q9,3 19,0 M79,144 q8,3 17,0', c.ls, 2);
      [[164, 128, 4, 11], [148, 134, 4, 12], [131, 136, 4, 12], [114, 134, 4, 11.5], [98, 130, 4, 10.5], [83, 124, 3, 9.5]].forEach(([y, xr, n, w], i) => { body += sclRow(96, xr, y, 6, n, w, w * 1.15, S, rim, 2.8, 40, 'v#f0a020', i); });
      // tay nhỏ co trước ngực
      body += tube(`M${P(90, 100)} Q${P(82, 104)} ${P(80, 112)}`, cel(c.b, c.s), 9, 4.5) + el(80, 114, 5, 4.4, cel(c.b, c.s), 3.2) + claws(79, 117, 3, 5.5, 100, '#fff6e0', 3.2);
      body += tube(`M${P(104, 104)} Q${P(98, 110)} ${P(96, 116)}`, cel(c.b, c.s), 9, 4.5) + el(96, 118, 5, 4.4, cel(c.b, c.s), 3.2) + claws(95, 121, 3, 5.5, 95, '#fff6e0', 3.2);
      const H = pgHead(86, 62, 20, c, { sf: S, rim, crest: 1.1 });
      head += H.s;
      head += eyesF(3, H.eye[0], H.eye[1], 8.4, 6, 6.2, c.b, c.i);
      return {
        back, body, head, front,
        anc: ancHead(H.eye[0] + 2, 62, 20, 18, H.eye[1], 8.4, { top: 46, hw: 30, neck: [98, 84, 30], back: [106, 80, 56, 90], body: [100, 124, 50, 80] })
      };
    },
    // ---- 4: tê tê thần ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const S = cel(c.sc, c.scs), rim = '#ffc94a', J = cel('#5fffc8', '#0f8a64'), G = 'g#5fffc8';
      back += auraBack('stone', RIG[4]);
      // đuôi dài cuộn xoắn ốc phía sau, chóp ngọc
      back += tube(`M${P(126, 170)} C${P(186, 190)} ${P(194, 120)} ${P(178, 84)} C${P(166, 56)} ${P(132, 54)} ${P(132, 76)} C${P(132, 92)} ${P(156, 94)} ${P(158, 78)}`, '#3a220c', 15, 5);
      back += sclPath([128, 168], [194, 186], [182, 92], 8, 10.5, 9, S, rim, 2.8) + sclPath([182, 90], [164, 44], [132, 70], 6, 9, 7, S, rim, 2.6) + sclPath([132, 74], [134, 94], [156, 82], 3, 6.5, 5.5, S, rim, 2.4);
      back += glow(158, 76, 13, 13, '#3fe0b0', .5) + crystal(158, 80, 21, 10, '#a9ffe6', '#14a37a', 3, 3);
      body += stump(86, 164, 22, cel(c.b, c.s), { foot: .75, band: '#ffd21f', bandY: 176 }) + claws(81, 186, 3, 7, 180, '#ffe07a') + stump(122, 164, 22, cel(c.b, c.s), { foot: .75, band: '#ffd21f', bandY: 176 }) + claws(117, 186, 3, 7, 180, '#ffe07a');
      // thân: vảy đồng viền vàng, khảm ngọc phát sáng
      body += pa(sm([[104, 60], [134, 76], [142, 124], [136, 166], [104, 178], [74, 168], [66, 124], [76, 82]]), cel('#5e3a16', '#3a220c'), 5.5);
      body += pa(sm([[84, 84], [96, 94], [99, 132], [95, 168], [83, 168], [75, 140], [76, 100]]), cel(c.l, c.ls), 3.5);
      body += ln('M78,114 q9,3 18,0 M76,130 q10,3 21,0 M77,148 q9,3 19,0', c.ls, 2);
      [[166, 132, 4, 12], [149, 138, 4, 12.5], [131, 140, 4, 13], [113, 138, 4, 12.5], [98, 134, 4, 11.5]].forEach(([y, xr, n, w], i) => { body += sclRow(96, xr, y, 6, n, w, w * 1.15, S, rim, 2.8, 40, G, i); });
      // áo choàng vảy lớn trùm vai
      body += sclRow(64, 146, 86, 8, 6, 13, 17, S, rim, 3, 70, G, 1) + sclRow(74, 134, 76, 6, 4, 12, 15, S, rim, 3, 50, G, 0);
      // hai tay nâng viên ngọc
      front += tube(`M${P(84, 96)} Q${P(66, 108)} ${P(72, 130)}`, cel(c.b, c.s), 10, 4.5) + tube(`M${P(112, 100)} Q${P(108, 122)} ${P(94, 134)}`, cel(c.b, c.s), 10, 4.5);
      front += glow(82, 122, 18, 16, '#3fe0b0', .45) + ci(82, 122, 11, J, 3.5) + hl(78, 117, 3.8, 2.2, -30, .85);
      front += el(73, 131, 5.5, 4.6, cel(c.b, c.s), 3.2) + el(93, 134, 5.5, 4.6, cel(c.b, c.s), 3.2) + claws(72, 128, 2, 5, -70, '#ffe07a', 3.4) + claws(94, 131, 2, 5, -110, '#ffe07a', 3.4);
      const H = pgHead(86, 56, 21, c, { sf: S, rim, crest: 1.15 });
      head += H.s;
      // vòng vàng trên trán, ngọc lục bảo
      head += pa(`M${P(70, 44)} L${P(74, 32)} L${P(80, 39)} L${P(87, 26)} L${P(93, 38)} L${P(100, 31)} L${P(101, 44)} Q${P(86, 38)} ${P(70, 44)} Z`, 'url(#gGold)', 3) + glow(86, 40, 6, 6, '#5fffc8', .5) + ci(86, 39.5, 3.2, '#5fffc8', 1.8);
      head += eyesF(4, H.eye[0], H.eye[1], 9, 6.2, 6.2, c.b, c.i, { glowCol: '#7dffd8' });
      front += floaters([[22, 46, 9, '#b08458', '#5e3a16', 10, ['#a9ffe6', '#14a37a']], [30, 162, 7, '#b08458', '#5e3a16', 40], [190, 24, 7, '#b08458', '#5e3a16', 70, ['#ffe07a', '#e08a00']], [14, 112, 5.5, '#b08458', '#5e3a16', 20]]);
      front += glints([[44, 14, 5], [196, 134, 4], [12, 80, 4]], '#a9ffe6');
      return {
        back, body, head, front,
        anc: ancHead(H.eye[0] + 2, 56, 21, 19, H.eye[1], 9, { top: 38, hw: 32, neck: [98, 80, 32], back: [106, 76, 64, 96], body: [100, 128, 52, 80] })
      };
    }
  ];
  PET_SPECS.pangolin = {
    el: 'stone',
    c: { b: '#e6b27a', s: '#a46c38', l: '#ffeccd', ls: '#f0c99a', i: '#33e1ff', sc: '#c58c52', scs: '#7a4f28', scl: '#f6d3a0' },
    c4: { b: '#d49656', s: '#87521f', sc: '#a8703a', scs: '#5e3a16', scl: '#ffd76a', i: '#7dffd8' },
    draw(f, g, c) { return PANGOLIN[f](c, g); }
  };
  /* ======================= TÊ GIÁC GIÁP ======================= */
  // Nhận diện: da xám tím, mõm to sáng màu, sừng mũi màu ngà/hổ phách, giáp đá nâu vàng.
  // 1 tê giác con bốn chân ngắn, sừng nhú → 2 sừng dài, yên giáp đá trên vai, bước nước kiệu
  // → 3 lao tới, giáp tinh thể dọc sống lưng, bụi đất → 4 tê giác thần ngẩng cao, sừng tinh thể khổng lồ, giáp khắc vân cổ.
  // Mặt tê giác quay ra trước: sọ, mõm rộng phía dưới, tai lá, sừng mọc từ sống mũi. dir: hướng mõm lệch (1 = phải)
  const rhHead = (hx, hy, k, c, o = {}) => {
    const d = o.dir ?? 1, mx = hx + d * 4 * k, my = hy + 15 * k;
    let s = '';
    for (const sd of [-1, 1]) {
      const ex = hx + sd * 19 * k, ey = hy - 15 * k, a = sd * 32 + (o.earTilt || 0);
      s += `<g transform="rotate(${a} ${f1(ex)} ${f1(ey)})">` + el(ex, ey - 6 * k, 6.5 * k, 10.5 * k, cel(c.b, c.s), 4.5) + el(ex, ey - 5 * k, 3.2 * k, 6.5 * k, o.earIn || '#f2b8d0', 0) + (o.earRing ? ci(ex + sd * 4 * k, ey + 1, 2.6 * k, 'none', 0) + `<circle cx="${f1(ex + sd * 5 * k)}" cy="${f1(ey)}" r="${f1(2.8 * k)}" fill="none" stroke="#ffd21f" stroke-width="2.2"/>` : '') + `</g>`;
    }
    s += bl(`<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="${f1(22 * k)}" ry="${f1(19 * k)}"/><ellipse cx="${f1(mx)}" cy="${f1(my)}" rx="${f1(19 * k)}" ry="${f1(13 * k)}"/>`, cel(c.b, c.s));
    s += el(mx, my + 1 * k, 16 * k, 10.5 * k, cel(c.l, c.ls), 0);
    s += el(mx - 6.5 * k, my + 3 * k, 2.6 * k, 2 * k, OL, 0) + el(mx + 6.5 * k, my + 3 * k, 2.6 * k, 2 * k, OL, 0);
    s += ln(`M${P(mx - 7 * k, my + 8.5 * k)} Q${P(mx, my + (o.smile ?? 11) * k)} ${P(mx + 7 * k, my + 8.5 * k)}`, OL, 2.8);
    s += hl(hx - 11 * k, hy - 11 * k, 5.5 * k, 2.6 * k, -25, .5);
    return { s, eyeY: hy - 4 * k, gap: (o.gap ?? 12.5) * k, hornX: mx, hornY: my - 9 * k };
  };
  const rhLeg = (x, yTop, w, c, o = {}) => stump(x, yTop, w, o.far ? c.s : cel(c.b, c.s), Object.assign({ foot: .66, nails: o.far ? null : c.l }, o));
  const dust = (x, y, r, i = 0) => PET_LITE ? '' : `<g class="smoke" style="animation-delay:-${f1(i * .6)}s">` + bl(`<circle cx="${f1(x - r * .55)}" cy="${f1(y)}" r="${f1(r * .55)}"/><circle cx="${f1(x + r * .1)}" cy="${f1(y - r * .3)}" r="${f1(r * .7)}"/><circle cx="${f1(x + r * .65)}" cy="${f1(y + r * .05)}" r="${f1(r * .5)}"/>`, cel('#f6e6cc', '#c99a6b'), 1.6) + `</g>`;
  const RHINO = [null,
    // ---- 1: tê giác con ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      body += rhLeg(80, 164, 14, c, { far: true }) + rhLeg(122, 164, 14, c, { far: true });
      body += tube(`M${P(72, 156)} q-8,2 -10,10`, cel(c.b, c.s), 4, 3) + el(61, 167, 3.4, 4.6, OL, 0);
      body += el(104, 160, 36, 23, cel(c.b, c.s), 5.5);
      // mảng da như sỏi trên lưng
      body += rock(92, 144, 7, c.plate, c.plates, 10, 3) + rock(108, 140, 6, c.plate, c.plates, 40, 3) + rock(80, 152, 5, c.plate, c.plates, 70, 2.8);
      body += hl(84, 146, 8, 3.5, -20, .45);
      body += rhLeg(88, 166, 15, c) + rhLeg(118, 167, 15, c);
      const H = rhHead(136, 140, 1.08, c, { smile: 12 });
      head += H.s;
      head += cuteEyes(136, H.eyeY, H.gap, 7, 7.6, c.i, .8);
      head += spike1(H.hornX, H.hornY + 1, 11, 11, cel(c.horn, c.horns), 0, 3.5);
      head += blush(120, 150, 4) + blush(154, 150, 4);
      return {
        back, body, head, front,
        anc: ancHead(136, 140, 23, 20, H.eyeY, H.gap, { top: 124, neck: [128, 166, 34], back: [80, 142, 40, 40], body: [100, 160, 40, 34] })
      };
    },
    // ---- 2: tê giác thiếu niên, yên giáp đá trên vai ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      body += rhLeg(66, 156, 16, c, { far: true }) + rhLeg(128, 150, 16, c, { far: true });
      body += tube(`M${P(54, 136)} q-10,4 -11,16`, cel(c.b, c.s), 4.5, 3) + el(42, 154, 4, 5.4, OL, 0);
      body += pa(sm([[52, 146], [60, 124], [92, 116], [128, 116], [148, 130], [146, 158], [112, 168], [70, 166]]), cel(c.b, c.s), 5.5);
      body += hl(72, 128, 10, 4, -20, .45);
      // yên giáp đá trên vai và hông
      body += pa(`M${P(102, 118)} Q${P(124, 106)} ${P(146, 122)} L${P(146, 142)} Q${P(124, 132)} ${P(104, 142)} Z`, cel(c.plate, c.plates), 4.5) + ln('M112,126 L120,132 L132,124 M126,118 L130,126', c.plates, 2.2) + rivet(140, 128, 2.2);
      body += pa(`M${P(56, 130)} Q${P(70, 116)} ${P(88, 118)} L${P(86, 134)} Q${P(70, 132)} ${P(58, 142)} Z`, cel(c.plate, c.plates), 4) + ln('M66,128 L74,124', c.plates, 2.2);
      // chân gần: chân trước nhấc bước
      body += rhLeg(78, 158, 18, c);
      body += pa(capsule(126, 150, 138, 170, 9, 8.5), cel(c.b, c.s), 5) + pa(capsule(138, 170, 132, 180, 8.5, 9), cel(c.b, c.s), 5) + el(131, 182, 10, 6, cel(c.b, c.s), 4.5) + el(126, 184, 2.6, 2.4, c.l, 1.6) + el(133, 185, 2.6, 2.4, c.l, 1.6);
      const H = rhHead(150, 124, 1, c);
      head += H.s;
      head += eyesF(2, 150, H.eyeY - 1, H.gap, 6.4, 6.8, c.b, c.i);
      head += spike1(H.hornX, H.hornY + 1, 24, 12, cel(c.horn, c.horns), 3, 4);
      head += blush(134, 133, 3.6) + blush(167, 133, 3.6);
      return {
        back, body, head, front,
        anc: ancHead(150, 124, 22, 19, H.eyeY - 1, H.gap, { top: 108, neck: [144, 148, 34], back: [64, 120, 46, 50], body: [96, 140, 50, 44] })
      };
    },
    // ---- 3: tê giác giáp tinh thể lao tới ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      // bụi đất sau chân
      back += dust(24, 178, 10, 0) + dust(40, 166, 7, 1) + dust(14, 162, 6, 2);
      body += pa(capsule(70, 140, 52, 172, 10, 9), c.s, 5) + el(48, 182, 11, 6.5, c.s, 4.5);
      body += pa(capsule(140, 140, 156, 166, 10, 9), c.s, 5) + el(158, 176, 11, 6.5, c.s, 4.5);
      body += tube(`M${P(42, 108)} q-12,-2 -16,-12`, cel(c.b, c.s), 4.5, 3) + el(25, 95, 4, 5.4, OL, 0);
      // thân nghiêng về trước
      body += pa(sm([[40, 118], [52, 96], [92, 88], [136, 98], [160, 120], [152, 150], [112, 158], [62, 150]]), cel(c.b, c.s), 5.5);
      body += hl(64, 102, 12, 4.5, -15, .45);
      // giáp đá ôm vai và hông, viền tinh thể
      body += pa(sm([[96, 92], [134, 98], [156, 118], [150, 140], [118, 134], [100, 116]]), cel(c.plate, c.plates), 4.5) + ln('M108,104 L124,114 L140,106 M128,122 L144,128', c.plates, 2.4);
      body += pa(sm([[46, 112], [58, 96], [84, 92], [86, 118], [64, 128], [48, 128]]), cel(c.plate, c.plates), 4.5) + ln('M58,108 L72,104 L78,112', c.plates, 2.4);
      // tinh thể dọc sống lưng, chĩa về sau
      [[60, 96, 16, -28], [76, 90, 22, -22], [94, 88, 26, -16], [112, 90, 22, -10], [128, 94, 15, -6]].forEach(([x, y, h, t]) => { body += crystal(x, y + 2, h, h * .48, '#ffe07a', '#e08a00', 3, t); });
      body += pa(capsule(78, 142, 66, 168, 11, 10), cel(c.b, c.s), 5) + pa(capsule(66, 168, 56, 180, 10, 10), cel(c.b, c.s), 5) + el(52, 183, 12, 6.5, cel(c.b, c.s), 4.5) + el(46, 184, 2.6, 2.2, c.l, 1.6) + el(55, 186, 2.6, 2.2, c.l, 1.6);
      body += pa(capsule(132, 144, 150, 172, 11, 10), cel(c.b, c.s), 5) + el(156, 182, 12, 6.5, cel(c.b, c.s), 4.5) + el(152, 185, 2.6, 2.2, c.l, 1.6) + el(160, 185, 2.6, 2.2, c.l, 1.6);
      // đầu hạ thấp, sừng chĩa tới
      const hx = 160, hy = 128, H = rhHead(hx, hy, 1.02, c, { dir: .3, smile: 9.5, earTilt: 18, gap: 14 });
      head += H.s;
      head += eyesF(3, hx, H.eyeY, H.gap, 6.2, 6.4, c.b, c.i);
      head += spike1(H.hornX, H.hornY + 3, 38, 12, cel(c.horn, c.horns), 12, 4.5);
      front += dust(176, 186, 7, 1);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 22, 19, H.eyeY, H.gap, { top: 112, neck: [150, 150, 34], back: [54, 100, 50, 56], body: [100, 122, 60, 50] })
      };
    },
    // ---- 4: tê giác thần, sừng tinh thể khổng lồ ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      back += auraBack('stone', RIG[4]);
      body += stump(54, 150, 24, c.s, { band: '#d48700', bandY: 172 }) + stump(124, 150, 24, c.s, { band: '#d48700', bandY: 172 });
      body += tube(`M${P(30, 118)} q-12,4 -14,18`, cel(c.b, c.s), 5, 3) + pa(`M${P(16, 134)} l-5,10 l9,-2 Z`, '#ffd21f', 2.6);
      // thân lớn
      body += pa(sm([[28, 130], [36, 100], [76, 86], [124, 86], [150, 102], [154, 136], [128, 160], [60, 160]]), cel(c.b, c.s), 5.5);
      // yên giáp cổ: hai đầu cong vút như mái đình, viền vàng, khắc hoa văn trống đồng phát sáng
      body += pa(`M${P(26, 84)} Q${P(30, 96)} ${P(40, 100)} Q${P(52, 84)} ${P(90, 80)} Q${P(128, 82)} ${P(146, 98)} Q${P(156, 92)} ${P(160, 80)} Q${P(166, 98)} ${P(150, 114)} Q${P(150, 126)} ${P(146, 130)} Q${P(96, 120)} ${P(42, 130)} Q${P(34, 118)} ${P(36, 106)} Q${P(22, 100)} ${P(26, 84)} Z`, cel(c.plate, c.plates), 5);
      body += pa(`M${P(42, 120)} Q${P(94, 110)} ${P(148, 120)} L${P(147, 130)} Q${P(94, 120)} ${P(43, 130)} Z`, 'url(#gGold)', 3);
      body += ln(`M${P(30, 90)} Q${P(34, 98)} ${P(42, 101)} M${P(156, 86)} Q${P(154, 96)} ${P(146, 101)}`, '#ffd21f', 3);
      let star = '';
      for (let i = 0; i < 10; i++) { const a = i * 36 * Math.PI / 180, b = (i * 36 + 18) * Math.PI / 180; star += `${i ? 'L' : 'M'}${P(92 + Math.cos(a) * 7, 102 + Math.sin(a) * 5.5)} L${P(92 + Math.cos(b) * 2.6, 102 + Math.sin(b) * 2.1)} `; }
      const rune = star + 'Z M80,102 a12,9.5 0 1 0 24,0 a12,9.5 0 1 0 -24,0 M75,102 a17,13 0 1 0 34,0 a17,13 0 1 0 -34,0 M52,108 l7,-7 l7,7 M120,104 l7,-7 l7,7';
      body += ln(rune, '#ffd21f', 6, 'opacity=".22"') + ln(rune, '#fff2a0', 2);
      body += hl(58, 92, 12, 4, -12, .45);
      // ngọc chóp yên và cụm tinh thể thấp ở vai
      body += pa(`M${P(84, 82)} Q${P(92, 64)} ${P(92, 58)} Q${P(94, 64)} ${P(100, 82)} Z`, 'url(#gGold)', 3) + glow(92, 70, 7, 7, '#5fffc8', .5) + ci(92, 72, 3.4, '#5fffc8', 1.8);
      body += crystal(130, 88, 15, 8, '#ffe07a', '#e08a00', 3, 4) + crystal(140, 92, 11, 6.5, '#a9ffe6', '#14a37a', 2.6, 6);
      body += stump(68, 152, 27, cel(c.b, c.s), { nails: '#ffd21f', band: '#ffd21f', bandY: 174 }) + stump(136, 152, 27, cel(c.b, c.s), { nails: '#ffd21f', band: '#ffd21f', bandY: 174 });
      // đầu ngẩng cao
      const hx = 156, hy = 96, H = rhHead(hx, hy, 1.2, c, { dir: .2, smile: 9.5, earIn: '#ffd21f', earRing: true, gap: 13.5 });
      head += H.s;
      head += pa(`M${P(hx - 14, hy - 19)} Q${P(hx, hy - 27)} ${P(hx + 14, hy - 19)} L${P(hx + 11, hy - 14)} Q${P(hx, hy - 20)} ${P(hx - 11, hy - 14)} Z`, 'url(#gGold)', 3) + ci(hx, hy - 20, 3.2, '#5fffc8', 1.8);
      head += eyesF(4, hx, H.eyeY, H.gap, 7, 6.8, c.b, c.i, { glowCol: '#ffd21f' });
      head += glow(H.hornX + 5, H.hornY - 32, 15, 34, '#ffd21f', .3);
      head += crystal(H.hornX, H.hornY + 6, 66, 15, '#ffe680', '#e08a00', 4.5, 10) + ln(`M${P(H.hornX - 2, H.hornY - 6)} L${P(H.hornX + 5, H.hornY - 44)}`, '#ffffff', 2.2, 'opacity=".7"');
      front += floaters([[18, 60, 9, '#b8a0c8', '#6a5a94', 10, ['#ffe07a', '#e08a00']], [104, 30, 7, '#b8a0c8', '#6a5a94', 40], [24, 172, 6, '#b8a0c8', '#6a5a94', 20], [192, 150, 6.5, '#b8a0c8', '#6a5a94', 70, ['#a9ffe6', '#14a37a']]]);
      front += glints([[60, 30, 5], [140, 22, 4], [8, 110, 4]]);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 26, 23, H.eyeY, H.gap, { top: 78, neck: [150, 128, 40], back: [40, 98, 60, 62], body: [92, 120, 64, 56] })
      };
    }
  ];
  PET_SPECS.rhino = {
    el: 'stone',
    c: { b: '#a5abd2', s: '#5c6290', l: '#e0e3f6', ls: '#b5b9da', i: '#ffb21f', horn: '#fff1c9', horns: '#e6c27a', plate: '#d1a372', plates: '#8a5a34' },
    c4: { b: '#7d84b8', s: '#3d4270', l: '#c9cde8', ls: '#959ac4', i: '#ffd21f', plate: '#b8885a', plates: '#6e4426' },
    draw(f, g, c) { return RHINO[f](c, g); }
  };
  /* ======================= KHỈ ĐỘT ĐÁ ======================= */
  // Nhận diện: lông/đá xám tím, mặt nạ sáng hình trái tim, mắt hổ phách, đá và hổ phách đi kèm.
  // 1 khỉ con ngồi ôm hòn sỏi → 2 thiếu niên chống nắm tay bò, tinh thể mọc trên tay
  // → 3 golem đá gọn gàng, ngực khảm ngọc → 4 thần núi ngồi thiền: vương miện núi tuyết, vân sáng, mây và đá bay.
  // Mặt khỉ đột: đầu tròn, gờ mày, mặt nạ sáng, mũi to
  // hy = đường mắt; mặt nạ sáng từ gờ mày xuống cằm
  const goFace = (hx, hy, k, c, f, o = {}) => {
    let s = '';
    s += pa(`M${P(hx, hy - 6 * k)} Q${P(hx - 8 * k, hy - 14 * k)} ${P(hx - 16 * k, hy - 7 * k)} Q${P(hx - 21 * k, hy + 3 * k)} ${P(hx - 17 * k, hy + 12 * k)} Q${P(hx - 12 * k, hy + 22 * k)} ${P(hx, hy + 23 * k)} Q${P(hx + 12 * k, hy + 22 * k)} ${P(hx + 17 * k, hy + 12 * k)} Q${P(hx + 21 * k, hy + 3 * k)} ${P(hx + 16 * k, hy - 7 * k)} Q${P(hx + 8 * k, hy - 14 * k)} ${P(hx, hy - 6 * k)} Z`, cel(o.face || c.l, o.faces || c.ls), 3.5);
    s += el(hx, hy + 10.5 * k, 8 * k, 5 * k, o.nose || c.ls, 0);
    s += el(hx - 3.4 * k, hy + 11 * k, 2.3 * k, 2.1 * k, OL, 0) + el(hx + 3.4 * k, hy + 11 * k, 2.3 * k, 2.1 * k, OL, 0);
    s += ln(`M${P(hx - 6 * k, hy + 17 * k)} Q${P(hx, hy + (o.smile ?? 20) * k)} ${P(hx + 6 * k, hy + 17 * k)}`, OL, 2.8);
    return s;
  };
  const goHead = (hx, hy, k, c, o = {}) => {
    let s = bl(`<ellipse cx="${f1(hx)}" cy="${f1(hy)}" rx="${f1(24 * k)}" ry="${f1(22 * k)}"/><circle cx="${f1(hx - 23 * k)}" cy="${f1(hy + 2 * k)}" r="${f1(6.5 * k)}"/><circle cx="${f1(hx + 23 * k)}" cy="${f1(hy + 2 * k)}" r="${f1(6.5 * k)}"/>`, o.fill || cel(c.b, c.s));
    s += ci(hx - 23 * k, hy + 2 * k, 3.2 * k, c.ls, 0) + ci(hx + 23 * k, hy + 2 * k, 3.2 * k, c.ls, 0);
    s += hl(hx - 11 * k, hy - 14 * k, 6 * k, 2.8 * k, -25, .45);
    return s;
  };
  const GORILLA = [null,
    // ---- 1: khỉ con ngồi ôm hòn sỏi ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const F = cel(c.b, c.s);
      // thân ngồi + bàn chân
      body += el(100, 162, 31, 25, F, 5.5);
      body += el(78, 183, 12, 7, cel(c.l, c.ls), 4.5) + el(122, 183, 12, 7, cel(c.l, c.ls), 4.5) + ln('M72,181 v3 M78,180 v4 M116,180 v4 M122,181 v3', c.ls, 2);
      // tay ôm hòn sỏi trước bụng
      body += tube(`M${P(72, 146)} Q${P(66, 164)} ${P(80, 166)}`, F, 9, 5) + tube(`M${P(128, 146)} Q${P(134, 164)} ${P(120, 166)}`, F, 9, 5);
      body += shp([[80, 168], [82, 150], [100, 141], [119, 149], [122, 166], [110, 179], [90, 179]], cel(c.rock, c.rocks), 4.5) + ln('M95,150 L100,159 L95,166 M110,166 L114,172', c.rocks, 2.2) + hl(91, 152, 5, 2.2, -25, .5);
      body += crystal(112, 151, 12, 6.5, '#ffe07a', '#e08a00', 2.6, 3) + crystal(104, 150, 7, 4.5, '#ffcf4a', '#e08a00', 2.2, -2);
      body += el(82, 160, 6.5, 6, cel(c.l, c.ls), 3) + el(118, 160, 6.5, 6, cel(c.l, c.ls), 3) + ln('M79,157 v4 M83,156 v5 M117,156 v5 M121,157 v4', c.ls, 1.6);
      head += pa(`M${P(94, 96)} Q${P(96, 86)} ${P(102, 84)} Q${P(100, 90)} ${P(104, 96)} Q${P(108, 88)} ${P(114, 90)} Q${P(108, 94)} ${P(110, 100)} Z`, F, 4);
      head += goHead(100, 120, 1.18, c);
      head += goFace(100, 119, 1.1, c, 1, { smile: 20.5 });
      head += cuteEyes(100, 118, 9.5, 6.6, 7.2, c.i, 0);
      head += blush(84, 129, 3.4) + blush(116, 129, 3.4);
      return {
        back, body, head, front,
        anc: ancHead(100, 120, 28, 26, 118, 9.5, { top: 101, neck: [100, 146, 40], back: [100, 142, 50, 40], body: [100, 162, 44, 36] })
      };
    },
    // ---- 2: khỉ đột thiếu niên chống nắm tay, tinh thể mọc trên tay ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const F = cel(c.b, c.s);
      // tay & chân xa
      body += pa(capsule(96, 124, 98, 178, 10, 10), c.s, 5) + el(98, 182, 11, 7.5, c.s, 4.5);
      body += pa(capsule(146, 148, 152, 178, 9, 9), c.s, 5) + el(156, 183, 11, 6, c.s, 4.5);
      // thân gù: vai cao trước, hông thấp sau
      body += pa(sm([[62, 128], [72, 104], [100, 94], [130, 104], [154, 128], [160, 154], [138, 164], [104, 160], [78, 150]]), F, 5.5);
      body += rock(114, 104, 9, c.st, c.sts, 15, 3) + rock(132, 116, 7, c.st, c.sts, 45, 3) + rock(98, 100, 6, c.st, c.sts, 75, 2.8) + rock(144, 134, 5.5, c.st, c.sts, 30, 2.6);
      body += hl(92, 104, 11, 4, -15, .45);
      // chân sau gần
      body += pa(capsule(132, 150, 136, 178, 10, 9), F, 5) + el(140, 183, 12, 6.5, cel(c.l, c.ls), 4.5);
      // tay trước gần chống đất, tinh thể trên cẳng tay
      body += pa(capsule(80, 118, 76, 176, 12, 11), F, 5.5) + el(76, 181, 13, 8.5, cel(c.l, c.ls), 4.5) + ln('M68,178 v4 M75,178 v5 M82,178 v4', c.ls, 2);
      body += crystal(70, 152, 14, 7, '#ffe07a', '#e08a00', 2.8, -6) + crystal(78, 148, 19, 8, '#ffe07a', '#e08a00', 3, -2) + crystal(86, 153, 12, 6, '#ffcf4a', '#e08a00', 2.6, 4);
      body += crystal(92, 162, 10, 5.5, '#ffcf4a', '#e08a00', 2.6, 4);
      // đầu thấp giữa hai vai
      const hx = 64, hy = 108;
      head += pa(`M${P(hx - 7, hy - 18)} Q${P(hx, hy - 30)} ${P(hx + 8, hy - 19)} Z`, F, 4);
      head += goHead(hx, hy, 1, c);
      head += goFace(hx, hy, .98, c, 2);
      head += eyesF(2, hx, hy, 8.5, 5.6, 6, c.l, c.i, { bw: 4.4 });
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 24, 22, hy, 8.5, { top: hy - 19, neck: [hx + 6, hy + 22, 34], back: [140, 112, 46, 52], body: [116, 132, 48, 42] })
      };
    },
    // ---- 3: golem đá khỉ đột ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const ST = cel(c.st, c.sts), STd = cel(c.sts, '#2e2550');
      // chân trụ ngắn
      body += stump(80, 156, 26, ST, { foot: .6 }) + stump(120, 156, 26, ST, { foot: .6 });
      // thân: tảng đá lớn bo tròn
      body += pa(sm([[56, 92], [76, 74], [124, 74], [144, 92], [140, 134], [124, 162], [76, 162], [60, 134]]), ST, 5.5);
      body += ln('M70,120 Q80,128 76,146 M130,120 Q120,128 124,146 M88,150 L100,156 L112,150', c.sts, 2.6);
      // ngực khảm ngọc hổ phách
      body += glow(100, 108, 20, 18, '#ffd21f', .35);
      body += pa(`M${P(100, 92)} L${P(114, 100)} L${P(114, 116)} L${P(100, 124)} L${P(86, 116)} L${P(86, 100)} Z`, 'url(#gGold)', 3.5);
      body += pa(`M${P(100, 97)} L${P(109, 102)} L${P(109, 114)} L${P(100, 119)} L${P(91, 114)} L${P(91, 102)} Z`, cel('#ffe07a', '#e08a00'), 2.4) + pa(`M${P(100, 97)} L${P(109, 102)} L${P(100, 108)} L${P(91, 102)} Z`, '#fff6b0', 0, 'opacity=".7"');
      body += hl(76, 86, 10, 4, -20, .45);
      // vai tảng đá có rêu
      for (const sd of [-1, 1]) {
        const x = 100 + sd * 46;
        body += shp([[x - 20, 96], [x - 17, 76], [x, 68], [x + 17, 76], [x + 20, 96], [x, 104]], ST, 5);
        body += moss(x - sd * 2, 72, 12, 6);
      }
      // tay dài hai khúc, nắm tay tròn chạm gần đất
      for (const sd of [-1, 1]) {
        const x = 100 + sd * 50;
        body += pa(sm([[x - 12, 100], [x + 12, 100], [x + 13 + sd * 2, 128], [x - 11 + sd * 2, 130]]), ST, 5);
        body += pa(sm([[x - 12 + sd * 3, 128], [x + 12 + sd * 3, 128], [x + 14 + sd * 5, 158], [x - 12 + sd * 5, 160]]), ST, 5);
        body += shp([[x - 16 + sd * 6, 160], [x - 12 + sd * 6, 152], [x + 12 + sd * 6, 152], [x + 17 + sd * 6, 162], [x + 12 + sd * 6, 176], [x - 12 + sd * 6, 176]], ST, 5);
        body += ln(`M${P(x - 8 + sd * 6, 164)} h16 M${P(x - 8 + sd * 6, 170)} h16`, c.sts, 2.2);
        body += crystal(x + sd * 9, 128, 12, 6, '#ffe07a', '#e08a00', 2.6, sd * 5);
      }
      // đầu đá đặt thấp giữa vai
      const hx = 100, hy = 66;
      head += goHead(hx, hy, .95, c, { fill: ST });
      head += goFace(hx, hy + 1, .92, c, 3, { face: '#e3d2b8', faces: '#b39a78', nose: '#b39a78', smile: 19 });
      head += eyesF(3, hx, hy + 1, 8, 5.4, 5.6, '#e3d2b8', c.i, { bw: 4 });
      head += moss(hx - 6, hy - 19, 10, 5) + crystal(hx + 9, hy - 18, 13, 7, '#ffe07a', '#e08a00', 2.6, 3);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 23, 21, hy + 1, 8, { top: hy - 18, neck: [100, 84, 40], back: [100, 78, 112, 74], body: [100, 118, 56, 76] })
      };
    },
    // ---- 4: thần núi ngồi thiền ----
    (c) => {
      let back = '', body = '', head = '', front = '';
      const ST = cel(c.st, c.sts);
      back += auraBack('stone', RIG[4]);
      // chân xếp bằng như chân núi
      body += shp([[14, 184], [24, 160], [56, 148], [100, 156], [144, 148], [176, 160], [186, 184], [100, 190]], ST, 5.5);
      body += ln('M44,166 Q70,158 96,168 M104,168 Q130,158 156,166', c.sts, 2.6);
      // thân hình tháp núi
      body += pa(sm([[52, 150], [58, 106], [74, 80], [126, 80], [142, 106], [148, 150], [100, 160]]), ST, 5.5);
      body += hl(70, 96, 11, 4, -20, .4);
      // vai: đỉnh núi phủ tuyết, cây thông nhỏ
      for (const sd of [-1, 1]) {
        const x = 100 + sd * 46;
        body += pa(`M${P(x - 22, 104)} L${P(x - sd * 4, 66)} L${P(x + 22, 104)} Q${P(x, 112)} ${P(x - 22, 104)} Z`, ST, 5);
        body += pa(`M${P(x - sd * 4 - 8, 80)} L${P(x - sd * 4, 66)} L${P(x - sd * 4 + 8, 80)} L${P(x - sd * 4 + 3, 77)} L${P(x - sd * 4, 81)} L${P(x - sd * 4 - 3, 77)} Z`, '#ffffff', 2.4);
        body += pa(`M${P(x + sd * 14, 102)} L${P(x + sd * 18, 86)} L${P(x + sd * 22, 102)} Z`, cel('#4fd06a', '#1d8a45'), 2.4);
      }
      // vân khoáng phát sáng: mạch cong phân nhánh, có nút ngọc
      const veins = 'M100,86 Q96,98 100,108 Q104,118 98,132 M100,108 Q110,112 114,124 M72,110 Q80,120 76,134 Q74,142 80,150 M128,110 Q120,120 124,134 Q126,142 120,150 M36,172 Q50,164 62,170 M164,172 Q150,164 138,170';
      body += ln(veins, '#ffd21f', 6.5, 'opacity=".25"') + ln(veins, OL, 4.4) + ln(veins, '#ffe680', 2.2);
      body += [[100, 108], [76, 134], [124, 134], [114, 124], [62, 170], [138, 170]].map(([x, y]) => ci(x, y, 2.6, '#5fffc8', 1.6)).join('');
      // cánh tay đá buông bên thân, hai bàn tay nâng viên ngọc trong lòng
      for (const sd of [-1, 1]) {
        body += pa(sm([[100 + sd * 34, 98], [100 + sd * 52, 100], [100 + sd * 54, 128], [100 + sd * 40, 134]]), ST, 5);
        body += pa(sm([[100 + sd * 52, 126], [100 + sd * 42, 124], [100 + sd * 16, 140], [100 + sd * 20, 150], [100 + sd * 50, 140]]), ST, 5);
      }
      front += glow(100, 138, 20, 16, '#3fe0b0', .45) + ci(100, 138, 11, cel('#5fffc8', '#0f8a64'), 3.5) + hl(96, 133, 3.6, 2.2, -30, .85);
      front += el(86, 146, 8, 6.5, ST, 4) + el(114, 146, 8, 6.5, ST, 4);
      // mây quấn chân núi
      const cloud = (x, y, w) => bl(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w * .42)}"/><circle cx="${f1(x - w * .35)}" cy="${f1(y - w * .2)}" r="${f1(w * .36)}"/><circle cx="${f1(x + w * .25)}" cy="${f1(y - w * .28)}" r="${f1(w * .42)}"/>`, cel('#ffffff', '#cfd6ff'), 2);
      front += (PET_LITE ? '' : `<g class="float">${cloud(30, 152, 16)}</g><g class="float" style="animation-delay:-1.1s">${cloud(170, 150, 15)}</g>`);
      // đầu: vương miện ba đỉnh núi tuyết
      const hx = 100, hy = 60;
      head += pa(`M${P(hx - 22, hy - 12)} L${P(hx - 15, hy - 34)} L${P(hx - 8, hy - 20)} L${P(hx, hy - 46)} L${P(hx + 8, hy - 20)} L${P(hx + 15, hy - 34)} L${P(hx + 22, hy - 12)} Z`, ST, 4.5);
      head += pa(`M${P(hx - 6, hy - 36)} L${P(hx, hy - 46)} L${P(hx + 6, hy - 36)} L${P(hx + 2, hy - 38)} L${P(hx, hy - 34)} L${P(hx - 2, hy - 38)} Z`, '#ffffff', 2.2) +
        pa(`M${P(hx - 19, hy - 26)} L${P(hx - 15, hy - 34)} L${P(hx - 11, hy - 26)} Z M${P(hx + 11, hy - 26)} L${P(hx + 15, hy - 34)} L${P(hx + 19, hy - 26)} Z`, '#ffffff', 2);
      head += goHead(hx, hy, 1.06, c, { fill: ST });
      head += pa(`M${P(hx - 24, hy - 16)} Q${P(hx, hy - 22)} ${P(hx + 24, hy - 16)} L${P(hx + 23, hy - 10)} Q${P(hx, hy - 16)} ${P(hx - 23, hy - 10)} Z`, 'url(#gGold)', 3) + glow(hx, hy - 15, 6, 5, '#5fffc8', .55) + ci(hx, hy - 15, 3.2, '#5fffc8', 1.8);
      head += goFace(hx, hy + 1, 1.02, c, 4, { face: '#d9c3a3', faces: '#a08462', nose: '#a08462', smile: 19 });
      head += eyesF(4, hx, hy + 1, 9, 6, 6, '#d9c3a3', c.i, { glowCol: '#ffd21f' });
      front += floaters([[20, 60, 9, '#9a90c0', '#4f4570', 10, ['#ffe07a', '#e08a00']], [180, 52, 8, '#9a90c0', '#4f4570', 40, ['#a9ffe6', '#14a37a']], [26, 116, 6, '#9a90c0', '#4f4570', 20], [176, 110, 6.5, '#9a90c0', '#4f4570', 70]]);
      front += glints([[44, 24, 5], [158, 20, 4.5], [192, 84, 4]]);
      return {
        back, body, head, front,
        anc: ancHead(hx, hy, 25, 23, hy + 1, 9, { top: hy - 22, neck: [100, 80, 42], back: [100, 78, 110, 96], body: [100, 118, 56, 70] })
      };
    }
  ];
  PET_SPECS.gorilla = {
    el: 'stone',
    c: { b: '#8a7cae', s: '#4f4572', l: '#e3cfb2', ls: '#b39a78', i: '#ffb21f', rock: '#b8916a', rocks: '#6e4c34', st: '#958bb8', sts: '#55497c' },
    c4: { b: '#6a5f94', s: '#33295a', i: '#ffd21f', st: '#7a6fa6', sts: '#3a2f62' },
    draw(f, g, c) { const o = GORILLA[f](c, g); return f === 3 ? grow(o, 1.1) : o; }
  };
})();

/* ---------- RỪNG ---------- */
const flower = (x, y, r, col = '#ff5fa2') => [0, 72, 144, 216, 288].map(a => ci(x + Math.cos(a * Math.PI / 180) * r * .7, y + Math.sin(a * Math.PI / 180) * r * .7, r * .55, col, 1.8)).join('') + ci(x, y, r * .42, '#ffd21f', 1.6);
function leafCrown(x, y, w, n, h) {
  let s = '';
  for (let i = 0; i < n; i++) { const k = i / (n - 1) - .5, a = -90 + k * 110; s += leaf(x + k * w, y + Math.abs(k) * 8, h * (1 - Math.abs(k) * .4), a, '#7be35a', '#2f9a3e', 3.2); }
  return s;
}
/* ===================== HỆ RỪNG v3: Ếch Rừng, Bọ Hung, Hươu Gạc, Gấu Trúc Võ =====================
   Mỗi dạng là một thiết kế riêng, tọa độ tuyệt đối trong khung 200×200 (tâm x = 100, chân chạm y = 188).
   Không dùng RIG để tạo dáng; neo trang phục tự khai báo cho từng dạng. Hàm phụ có tiền tố rg để không đụng hệ khác.
   Cần: gfx.js (pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, capsule, leaf, eye, OL) và PET_LITE, PET_SPECS của pets.js. */

/* ----- Hàm phụ hệ Rừng ----- */
const RG_GOLD = '#ffd21f', RG_PINK = '#ff5fa2', RG_JADE = '#5dffc0';
// Điểm trên đường cong Bézier bậc 3
function rgBez(p0, p1, p2, p3, n = 12) {
  const a = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    a.push([u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]);
  }
  return a;
}
// Nối các điểm thành đường cong mượt (Catmull-Rom → Bézier)
function rgSmooth(pts_, move = true) {
  let d = move ? `M${P(pts_[0][0], pts_[0][1])}` : ` L${P(pts_[0][0], pts_[0][1])}`;
  for (let i = 0; i < pts_.length - 1; i++) {
    const p0 = pts_[i - 1] || pts_[i], p1 = pts_[i], p2 = pts_[i + 1], p3 = pts_[i + 2] || p2;
    d += ` C${P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${P(p2[0], p2[1])}`;
  }
  return d;
}
// Khối thuôn dọc theo một đường tâm: rộng w0 ở đầu, w1 ở cuối (đuôi, sừng, gạc, dây leo)
function rgTaper(c, w0, w1, ease = 1) {
  const L = [], R = [], n = c.length;
  for (let i = 0; i < n; i++) {
    const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1;
    const t = Math.pow(i / (n - 1), ease), w = (w0 + (w1 - w0) * t) / 2;
    L.push([c[i][0] - dy / m * w, c[i][1] + dx / m * w]); R.push([c[i][0] + dy / m * w, c[i][1] - dx / m * w]);
  }
  return rgSmooth(L) + rgSmooth(R.reverse(), false) + ' Z';
}
// Cánh hoa nhọn: gốc (x, y), dài L, nửa rộng w, góc ang (độ, -90 là hướng lên)
function rgPetalD(x, y, L, w, ang) {
  const a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const q = (k, s) => P(x + ux * L * k + nx * w * s, y + uy * L * k + ny * w * s);
  return `M${P(x, y)} C${q(.12, 1)} ${q(.62, 1.15)} ${q(1, 0)} C${q(.62, -1.15)} ${q(.12, -1)} ${P(x, y)} Z`;
}
function rgPetal(x, y, L, w, ang, fill, inner, sw = 3.5) {
  let s = pa(rgPetalD(x, y, L, w, ang), fill, sw);
  if (inner) s += pa(rgPetalD(x, y, L * .62, w * .5, ang), inner, 0);
  return s;
}
// Hoa sen nhỏ (vương miện, nụ trên lá)
function rgLotus(x, y, r, o = {}) {
  let s = '';
  [-150, -30, -120, -60].forEach(a => { s += rgPetal(x, y, r, r * .36, a, o.c1 || '#ff8cc4', o.c2 || '#ffd6ea', 2.4); });
  s += rgPetal(x, y, r * 1.1, r * .4, -90, o.c1 || '#ff8cc4', o.c2 || '#ffd6ea', 2.4);
  return s + el(x, y, r * .42, r * .18, RG_GOLD, 2);
}
// Hoa 5 cánh nhỏ có viền
const rgBloom = (x, y, r, col = RG_PINK, mid = RG_GOLD, sw = 1.8) => [0, 72, 144, 216, 288].map(a => ci(x + Math.cos((a - 90) * Math.PI / 180) * r * .62, y + Math.sin((a - 90) * Math.PI / 180) * r * .62, r * .5, col, sw)).join('') + ci(x, y, r * .38, mid, sw * .8);
// Đom đóm phát sáng (bỏ trong bản nhẹ)
const rgFly = (x, y, r = 2.6, d = 0, col = '#d6ff4a') => PET_LITE ? '' : `<g class="twinkle" style="animation-delay:-${f1(d)}s"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.5)}" fill="${col}" opacity=".28"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.55)}" fill="${col}" opacity=".7"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .9)}" fill="#fffde0"/></g>`;
// Quầng sáng mềm sau lưng dạng 4
const rgGlow = (x, y, r, col) => PET_LITE ? '' : [1, .8, .6].map(k => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * k)}" fill="${col}" opacity=".09"/>`).join('') + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .7)}" fill="url(#gGlow)" opacity=".3"/>`;
// Mắt tròn to dễ thương (dạng 1–2)
function rgEyeCute(cx, cy, r, iris, o = {}) {
  const px = cx + (o.dx || 0) * r, py = cy + r * .08 + (o.dy || 0) * r;
  let s = ci(cx, cy, r, '#fff', o.w ?? 3.5);
  s += ci(px, py, r * .7, iris, 0) + ci(px, py, r * .41, OL, 0);
  s += ci(px - r * .27, py - r * .3, r * .25, '#fff', 0) + ci(px + r * .26, py + r * .27, r * .11, '#fff', 0);
  return s;
}
// Viền sáng quanh mắt dạng 4
const rgGlowRim = (x, y, r, col = RG_JADE) => PET_LITE ? '' : `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r + 2.6)}" ry="${f1(r + 2.6)}" fill="${col}" opacity=".55"/>`;
// Miệng cười nhỏ
const rgSmile = (x, y, w, open) => open ? pa(`M${P(x - w, y)} Q${P(x, y + w * 1.25)} ${P(x + w, y)} Q${P(x, y + w * .3)} ${P(x - w, y)} Z`, '#a8204f', 2.8) + el(x, y + w * .55, w * .45, w * .22, '#ff7a9a', 0) : ln(`M${P(x - w, y)} Q${P(x, y + w * .8)} ${P(x + w, y)}`, OL, 3);
const rgBlush = (x, y, rx = 6, ry = 3.6) => el(x, y, rx, ry, '#ff8fb0', 0, 'opacity=".6"');
// Neo trang phục; halo: [x, y, rx] cho hiệu ứng vầng hào quang (wear.js đọc nếu có, xem NOTES.md)
const rgNeo = (head, eyes, neck, back, body) => ({ head, eyes, neck, back, body, halo: [head[0], head[1] - 20, head[2] * .47] });
// Thu nhỏ cả dạng quanh điểm chạm đất (100, 188), kèm neo trang phục
function rgShrink(r, k) {
  const T = s => s ? `<g transform="translate(${f1(100 - 100 * k)} ${f1(188 - 188 * k)}) scale(${k})">${s}</g>` : '';
  const anc = {};
  for (const key in r.anc) anc[key] = r.anc[key].map((v, i) => i === 0 ? 100 + (v - 100) * k : i === 1 ? 188 + (v - 188) * k : v * k);
  return { back: T(r.back), body: T(r.body), head: T(r.head), front: T(r.front), anc };
}

/* ===================== ẾCH RỪNG ===================== */
// Nòng nọc mầm lá → ếch con trên lá sen → ếch lữ khách áo lá, gậy cây → ếch thần rừng, lưng nở sen
PET_SPECS.frog = {
  el: 'forest',
  c: { b: '#6ad84e', s: '#2f9a36', l: '#f0ffc8', ls: '#c2ea8a', i: '#ffb21f', sp: '#2f9a3e', mouth: '#a8204f' },
  c4: { b: '#2fb860', s: '#137040', l: '#e6ffd6', ls: '#9fe6b8', i: '#ffe14d', sp: '#ffd21f' },
  draw(f, g, c) {
    return [null, rgFrog1, rgFrog2, rgFrog3, rgFrog4][f](c, g);
  }
};
const rgIrisAmber = () => lin('#c96a00', '#ffb21f', '#ffe48a');
function rgFrog1(c) {
  let back = '', body = '', head = '', front = '';
  const cx = 92, cy = 150;
  // Đuôi vẫy cong lên phía sau
  const tc = rgSmooth([[112, 160], [134, 170], [156, 168], [170, 152], [171, 133], [162, 120], [151, 121], [148, 131]]);
  const tl = rgBez([112, 160], [150, 178], [178, 160], [171, 133], 10).concat(rgBez([171, 133], [168, 116], [148, 116], [148, 131], 6).slice(1));
  back += `<g class="pt" style="transform-box:view-box;transform-origin:118px 160px">` + pa(rgTaper(tl, 30, 5, .8), cel('#8ee86a', c.s), 4.5) +
    ln(rgSmooth(tl.slice(0, 13)), '#d8ffb0', 3, 'opacity=".7"') + `</g>`;
  // Thân tròn
  body += bl(`<ellipse cx="${cx}" cy="${cy}" rx="39" ry="34"/>`, cel(c.b, c.s));
  body += el(cx, cy + 15, 27, 15, c.l, 0);
  body += el(cx - 18, cy - 22, 4.2, 3, c.sp, 0) + el(cx + 20, cy - 24, 3.4, 2.5, c.sp, 0) + el(cx + 30, cy - 10, 2.6, 2, c.sp, 0);
  body += hl(cx - 22, cy - 18, 9, 4.5, -30, .55);
  // Mầm lá trên đỉnh
  const stem = `M${cx},${cy - 33} Q${cx - 3},${cy - 46} ${cx + 3},${cy - 55}`;
  head += ln(stem, OL, 7) + ln(stem, '#7be35a', 3);
  head += leaf(cx + 3, cy - 54, 25, -36, '#7be35a', '#2f9a3e', 3) + leaf(cx + 1, cy - 47, 17, -152, '#9df27a', '#2f9a3e', 3);
  // Mặt
  head += rgEyeCute(cx - 15, cy - 4, 12, rgIrisAmber(), { dx: .05 }) + rgEyeCute(cx + 15, cy - 4, 12, rgIrisAmber(), { dx: -.05 });
  head += rgBlush(cx - 27, cy + 11) + rgBlush(cx + 27, cy + 11) + rgSmile(cx, cy + 11, 6, true);
  // Bong bóng nước
  if (!PET_LITE) front += `<g class="float">` + ci(150, 96, 5.5, '#e6fbff', 2.2, 'fill-opacity=".85"') + ci(161, 82, 3.6, '#e6fbff', 2, 'fill-opacity=".85"') + `<circle cx="148.4" cy="94.4" r="1.6" fill="#fff"/></g>`;
  return { back, body, head, front, anc: rgNeo([cx, 126, 54], [cx, cy - 4, 48], [cx, 171, 58], [cx, 128, 64, 56], [cx, 174, 52, 26]) };
}
function rgFrog2(c) {
  let back = '', body = '', head = '', front = '';
  // Lá sen có khía
  const pad = (cx, cy, rx, ry, a1, a2) => { const E = a => P(cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)); return `M${P(cx, cy)} L${E(a2)} A${rx},${ry} 0 1 1 ${E(a1)} Z`; };
  back += pa(pad(100, 181, 70, 14, 58, 76), '#2f8a3e', 4.5) + pa(pad(100, 177, 70, 14, 58, 76), cel('#8fe060', '#4fb84a'), 4.5);
  back += ln([200, 235, 270, 305, 340, 20].map(a => `M100,177 L${P(100 + 60 * Math.cos(a * Math.PI / 180), 177 + 12 * Math.sin(a * Math.PI / 180))}`).join(' '), '#3f9a3e', 2, 'opacity=".7"');
  // Nụ sen bên phải
  back += ln('M150,178 Q156,166 152,152', OL, 7) + ln('M150,178 Q156,166 152,152', '#4fb84a', 3);
  back += rgPetal(152, 156, 26, 9, -100, '#ff8cc4', '#ffd6ea', 3.2) + rgPetal(151, 156, 20, 7, -125, '#ff6fb0', null, 3) + rgPetal(153, 156, 20, 7, -70, '#ff6fb0', null, 3);
  // Chân sau gập + bàn chân màng
  for (const sd of [-1, 1]) {
    body += bl(`<ellipse cx="${100 + sd * 33}" cy="158" rx="19" ry="16" transform="rotate(${sd * -25} ${100 + sd * 33} 158)"/>` +
      `<path d="M${P(100 + sd * 34, 170)} Q${P(100 + sd * 48, 168)} ${P(100 + sd * 56, 174)} L${P(100 + sd * 58, 178)} L${P(100 + sd * 32, 179)} Z"/>`, cel(c.b, c.s));
    body += [0, 1, 2].map(i => ci(100 + sd * (44 + i * 6), 178 - Math.abs(i - 1) * 1.5, 3.2, '#9df27a', 2.2)).join('');
    body += el(100 + sd * 36, 152, 3, 2.2, c.sp, 0) + el(100 + sd * 28, 162, 2.4, 1.8, c.sp, 0);
  }
  // Thân + bụng
  body += pa('M74,150 Q72,124 100,122 Q128,124 126,150 Q128,178 100,178 Q72,178 74,150 Z', cel(c.b, c.s), 5.5);
  body += el(100, 156, 19, 17, c.l, 0);
  // Tay chống xuống lá
  for (const sd of [-1, 1]) {
    body += pa(capsule(100 + sd * 20, 136, 100 + sd * 13, 170, 6, 5.5), cel(c.b, c.s), 4.5);
    body += [-1, 0, 1].map(k => ci(100 + sd * 13 + k * 4.5, 176 - Math.abs(k) * 1, 2.8, '#9df27a', 2)).join('');
  }
  // Đầu rộng, mắt lồi
  head += bl(`<ellipse cx="100" cy="108" rx="44" ry="28"/><circle cx="77" cy="86" r="16.5"/><circle cx="123" cy="86" r="16.5"/>`, cel(c.b, c.s));
  head += el(100, 124, 32, 10, c.l, 0);
  head += el(66, 108, 3.2, 2.4, c.sp, 0) + el(132, 104, 3.6, 2.6, c.sp, 0) + el(138, 114, 2.4, 1.8, c.sp, 0) + el(100, 92, 3, 2.2, c.sp, 0);
  head += hl(72, 100, 9, 4, -25, .5);
  head += rgEyeCute(77, 88, 11.5, rgIrisAmber(), { dx: .06 }) + rgEyeCute(123, 88, 11.5, rgIrisAmber(), { dx: -.06 });
  head += ln('M66,72 Q76,67 86,71 M114,71 Q124,67 134,72', OL, 4);
  head += pa('M80,116 Q100,136 120,116 Q100,124 80,116 Z', c.mouth, 3) + el(100, 125, 7, 3, '#ff7a9a', 0);
  head += rgBlush(68, 118) + rgBlush(132, 118);
  // Lá đội đầu
  head += leaf(100, 84, 26, -62, '#7be35a', '#2f9a3e', 3.2) + leaf(99, 85, 16, -130, '#9df27a', '#2f9a3e', 3);
  if (!PET_LITE) front += `<g class="float">` + ci(36, 150, 4.5, '#e6fbff', 2, 'fill-opacity=".85"') + ci(28, 136, 3, '#e6fbff', 1.8, 'fill-opacity=".85"') + `</g>`;
  return { back, body, head, front, anc: rgNeo([100, 88, 64], [100, 87, 80], [100, 132, 48], [100, 126, 56, 54], [100, 150, 48, 52]) };
}
function rgFrog3(c) {
  let back = '', body = '', head = '', front = '';
  // Áo choàng lá sau lưng
  for (const sd of [-1, 1]) {
    for (const [a, L, w, c1, c2] of [[90 - sd * 40, 66, 15, '#7be35a', '#2f9a3e'], [90 - sd * 22, 78, 16, '#5fcf4a', '#24803a']]) {
      const ar = a * Math.PI / 180;
      back += rgPetal(100 + sd * 14, 96, L, w, a, cel(c1, c2), null, 4) + ln(`M${P(100 + sd * 14, 96)} L${P(100 + sd * 14 + Math.cos(ar) * L * .85, 96 + Math.sin(ar) * L * .85)}`, c2, 2, 'opacity=".7"');
    }
  }
  // Gậy cây (bên phải)
  const st = [[148, 188], [147, 152], [149, 116], [147, 80], [149, 56]];
  back += pa(rgTaper(st, 7, 9), cel('#b8743a', '#7a4418'), 4) + ln('M146,162 l4,-3 M147,128 l-4,-3 M148,94 l4,-3', '#7a4418', 2.4);
  back += pa(rgTaper(rgBez([149, 58], [150, 42], [166, 40], [164, 53], 8), 9, 4), cel('#b8743a', '#7a4418'), 4);
  back += leaf(151, 49, 20, -150, '#7be35a', '#2f9a3e', 3) + leaf(159, 43, 19, -64, '#9df27a', '#2f9a3e', 3) + leaf(150, 56, 15, 160, '#7be35a', '#2f9a3e', 3);
  back += ci(157, 57, 6, '#fff3a0', 2.6) + `<circle cx="155.5" cy="55.5" r="2" fill="#fff"/>`;
  // Chân: đùi, cẳng, bàn chân màng
  for (const sd of [-1, 1]) {
    body += pa(capsule(100 + sd * 13, 138, 100 + sd * 30, 160, 10, 8), cel(c.b, c.s), 5);
    body += pa(capsule(100 + sd * 30, 160, 100 + sd * 22, 180, 8, 6.5), cel(c.b, c.s), 5);
    body += pa(`M${P(100 + sd * 22, 178)} L${P(100 + sd * 10, 187)} Q${P(100 + sd * 22, 191)} ${P(100 + sd * 38, 187)} Z`, '#8ee86a', 4);
    body += [10, 23, 38].map(x => ci(100 + sd * x, 187, 3, '#8ee86a', 2.2)).join('');
  }
  // Thân thon
  body += pa('M80,104 Q80,88 100,88 Q120,88 120,104 Q118,122 124,136 Q126,150 100,150 Q74,150 76,136 Q82,122 80,104 Z', cel(c.b, c.s), 5.5);
  body += el(100, 128, 15, 18, c.l, 0);
  // Áo lá: hai vạt chéo + đai dây leo
  body += pa('M80,98 Q90,112 104,140 L96,142 Q84,124 78,110 Z', cel('#7be35a', '#2f9a3e'), 3.5) + pa('M120,98 Q110,112 96,140 L104,142 Q116,124 122,110 Z', cel('#5fcf4a', '#24803a'), 3.5);
  body += ln('M80,136 Q100,144 120,136', OL, 7) + ln('M80,136 Q100,144 120,136', '#9a5a2a', 3.5) + rgBloom(108, 140, 6);
  // Cổ áo lá + vai lá
  for (const sd of [-1, 1]) body += leaf(100 + sd * 4, 94, 22, 90 - sd * 70, '#9df27a', '#2f9a3e', 3) + leaf(100 + sd * 16, 96, 20, 90 - sd * 105, '#7be35a', '#2f9a3e', 3);
  // Tay: trái chống hông, phải nắm gậy
  body += pa(capsule(80, 100, 66, 118, 6.5, 6), cel(c.b, c.s), 4.5) + pa(capsule(66, 118, 80, 130, 6, 5.5), cel(c.b, c.s), 4.5) + ci(82, 131, 6.5, '#8ee86a', 3.5);
  body += pa(capsule(120, 100, 134, 118, 6.5, 6), cel(c.b, c.s), 4.5) + pa(capsule(134, 118, 145, 112, 6, 5.5), cel(c.b, c.s), 4.5);
  body += ci(147, 111, 7, '#8ee86a', 3.5) + ln('M143,108 q4,3 8,0 M143,113 q4,3 8,0', OL, 2);
  // Đầu dẹt rộng, mắt lồi sắc
  head += bl(`<ellipse cx="100" cy="68" rx="35" ry="22"/><circle cx="81" cy="50" r="13.5"/><circle cx="119" cy="50" r="13.5"/>`, cel(c.b, c.s));
  head += el(100, 80, 26, 8, c.l, 0);
  head += el(72, 68, 2.8, 2, c.sp, 0) + el(128, 66, 3.2, 2.3, c.sp, 0) + el(100, 56, 2.6, 2, c.sp, 0);
  head += hl(76, 62, 8, 3.5, -25, .5);
  head += eye(81, 51, 9.5, 9.5, -1, { lid: .8, skin: c.b, iris: rgIrisAmber(), bw: 5.5 }) + eye(119, 51, 9.5, 9.5, 1, { lid: .8, skin: c.b, iris: rgIrisAmber(), bw: 5.5 });
  head += ln('M84,76 Q98,84 116,74', OL, 3.5) + ln('M113,73 l4,3', OL, 3);
  head += rgBlush(72, 74, 5, 3) + rgBlush(128, 74, 5, 3);
  return { back, body, head, front, anc: rgNeo([100, 52, 58], [100, 51, 66], [100, 90, 40], [100, 94, 50, 74], [100, 116, 42, 52]) };
}
function rgFrog4(c) {
  let back = '', body = '', head = '', front = '';
  // Hào quang + hoa sen lớn nở sau lưng
  back += rgGlow(100, 104, 98, RG_JADE);
  let lot = '';
  for (let i = 0; i < 7; i++) { const a = -168 + i * 26; lot += rgPetal(100, 112, [74, 86, 96, 101, 96, 86, 74][i], 27, a, cel('#ff9ccd', '#f2468f'), '#ffd9ec', 4.5); }
  for (let i = 0; i < 6; i++) { const a = -155 + i * 26; lot += rgPetal(100, 112, [62, 72, 80, 80, 72, 62][i], 21, a, cel('#ffc9e4', '#ff86bd'), '#fff4fa', 4); }
  back += `<g class="sway">${lot}</g>`;
  // Áo choàng lá chuông, viền vàng
  const robe = 'M76,100 Q66,140 50,172 L58,178 L66,172 L74,182 L84,175 L92,184 L100,176 L108,184 L116,175 L126,182 L134,172 L142,178 L150,172 Q134,140 124,100 Q100,92 76,100 Z';
  body += pa(robe, cel('#2fb860', '#126a3a'), 5.5);
  body += ln('M54,170 L58,176 L66,170 L74,180 L84,173 L92,182 L100,174 L108,182 L116,173 L126,180 L134,170 L142,176 L146,170', RG_GOLD, 3);
  body += pa('M92,104 Q90,140 100,176 Q110,140 108,104 Z', cel(c.l, c.ls), 3.5);
  // Dây leo phát sáng quấn vạt áo
  const vine = 'M58,166 Q74,150 72,132 Q70,118 80,110 M142,166 Q126,150 128,132 Q130,118 120,110';
  body += ln(vine, OL, 6.5) + ln(vine, RG_JADE, 3);
  body += [[64, 156, -60], [74, 128, -150], [136, 156, -120], [126, 128, -30]].map(([x, y, a]) => leaf(x, y, 12, a, '#9df27a', '#2f9a3e', 2.4)).join('');
  // Bàn chân dưới vạt
  for (const sd of [-1, 1]) body += pa(`M${P(100 + sd * 8, 182)} Q${P(100 + sd * 18, 176)} ${P(100 + sd * 30, 184)} Q${P(100 + sd * 20, 191)} ${P(100 + sd * 8, 188)} Z`, '#3fd070', 3.5) + [12, 20, 28].map(x => ci(100 + sd * x, 187.5, 2.6, '#3fd070', 2)).join('');
  // Tay áo rộng ôm quả cầu ngọc
  for (const sd of [-1, 1]) body += pa(`M${P(100 + sd * 22, 102)} Q${P(100 + sd * 42, 118)} ${P(100 + sd * 34, 140)} L${P(100 + sd * 14, 136)} Q${P(100 + sd * 22, 122)} ${P(100 + sd * 16, 112)} Z`, cel('#3fc86a', '#156e3c'), 4.5) + ln(`M${P(100 + sd * 34, 140)} L${P(100 + sd * 14, 136)}`, RG_GOLD, 3);
  if (!PET_LITE) body += `<circle cx="100" cy="128" r="20" fill="${RG_JADE}" opacity=".3"/>`;
  body += ci(100, 128, 11, cel('#e6fff4', '#5dffc0'), 3.5) + hl(96, 124, 3.5, 2, -30, .9);
  for (const sd of [-1, 1]) body += ci(100 + sd * 13, 136, 6.5, '#3fd070', 3.5);
  // Đầu: đốm vàng, mắt phát sáng, vương miện dây leo
  head += bl(`<ellipse cx="100" cy="80" rx="36" ry="23"/><circle cx="80" cy="62" r="14"/><circle cx="120" cy="62" r="14"/>`, cel(c.b, c.s));
  head += el(100, 93, 26, 8, c.l, 0);
  head += [[71, 82, 3], [130, 78, 3.4], [137, 88, 2.2], [63, 89, 2], [100, 69, 2.6]].map(([x, y, r]) => ci(x, y, r, RG_GOLD, 1.6)).join('');
  head += hl(75, 73, 8, 3.5, -25, .5);
  head += rgGlowRim(80, 63, 9.5) + rgGlowRim(120, 63, 9.5) + eye(80, 63, 9.5, 9.5, -1, { lid: 1, skin: c.b, iris: '#ffe14d', bw: 6 }) + eye(120, 63, 9.5, 9.5, 1, { lid: 1, skin: c.b, iris: '#ffe14d', bw: 6 });
  head += ln('M87,88 Q100,93 113,88', OL, 3.5);
  // Vương miện dây leo + hoa
  const cr = 'M66,56 Q74,38 100,42 Q126,38 134,56';
  head += ln(cr, OL, 7) + ln(cr, '#4fb84a', 3.5);
  head += [[71, 48, -120], [85, 41, -100], [115, 41, -80], [129, 48, -60]].map(([x, y, a]) => leaf(x, y, 14, a, '#9df27a', '#2f9a3e', 2.6)).join('');
  head += rgLotus(100, 44, 14) + rgBloom(76, 46, 5) + rgBloom(124, 46, 5);
  // Đom đóm
  if (!PET_LITE) front += [[26, 104, -30, 0], [176, 96, 200, .9], [150, 20, 150, 1.6]].map(([x, y, a, d]) => `<g class="ember" style="animation-delay:-${d}s">${rgPetal(x, y, 13, 5, a, '#ffb3d6', null, 2.2)}</g>`).join('');
  front += [[22, 70, 2.8, 0], [178, 58, 3, .5], [14, 140, 2.4, 1], [186, 128, 2.8, 1.4], [40, 26, 2.2, .8], [162, 18, 2.4, .3], [30, 176, 2.2, 1.7], [172, 172, 2.4, 1.1]].map(([x, y, r, d]) => rgFly(x, y, r, d)).join('');
  return { back, body, head, front, anc: rgNeo([100, 56, 64], [100, 63, 70], [100, 102, 46], [100, 100, 52, 80], [100, 120, 48, 58]) };
}

/* ===================== BỌ HUNG ===================== */
// Ấu trùng mầm lá → bọ hung con mai tròn → bọ tê giác sừng dài → bọ thần mai ngọc, cánh sáng mở rộng
PET_SPECS.beetle = {
  el: 'forest',
  c: { b: '#2fb08a', s: '#13695a', l: '#e2faea', ls: '#a2dcc0', i: '#ffd21f', sh: '#22a0b8', shs: '#0e4f78', pr: '#1b6f8c', prs: '#0b3554', horn: '#eaa94e', hs: '#8a4a1a', leg: '#26346a', legs: '#121838' },
  c4: { b: '#2a9a8a', s: '#0f4f52', sh: '#5a7bff', shs: '#3a1d9a', pr: '#2a3aa8', prs: '#1a0f5e', horn: '#ffd21f', hs: '#d48700', leg: '#2a2470', legs: '#140f3a' },
  draw(f, g, c) {
    return [null, rgBeetle1, rgBeetle2, rgBeetle3, rgBeetle4][f](c, g);
  }
};
const rgIrisGold = () => lin('#c98a00', '#ffd21f', '#fff3a0');
// Chân đốt: hông → gối → bàn, có móc nhỏ
function rgLeg(pts_, w, c, sw = 3.5) {
  const [a, b, d] = pts_;
  let s = pa(capsule(a[0], a[1], b[0], b[1], w * .62, w * .5), cel(c.leg, c.legs), sw) + pa(capsule(b[0], b[1], d[0], d[1], w * .5, w * .32), cel(c.leg, c.legs), sw);
  const sd = d[0] < b[0] ? -1 : 1;
  s += ln(`M${P(d[0], d[1])} l${f1(sd * 4)},2 M${P(d[0], d[1])} l${f1(-sd * 1.5)},3.5`, OL, 2.6);
  return s;
}
// Râu có chùy lá (bọ hung)
function rgAntenna(x, y, sd, L, ang, col) {
  const a = ang * Math.PI / 180, ex = x + Math.cos(a) * L, ey = y + Math.sin(a) * L;
  return ln(`M${P(x, y)} Q${P((x + ex) / 2 + sd * 2, (y + ey) / 2 - 3)} ${P(ex, ey)}`, OL, 2.6) +
    [-30, 0, 30].map(k => el(ex + Math.cos(a + k * Math.PI / 180) * 3.2, ey + Math.sin(a + k * Math.PI / 180) * 3.2, 3.2, 1.8, col, 1.6, `transform="rotate(${f1(ang + k)} ${f1(ex + Math.cos(a + k * Math.PI / 180) * 3.2)} ${f1(ey + Math.sin(a + k * Math.PI / 180) * 3.2)})"`)).join('');
}
function rgBeetle1(c) {
  let back = '', body = '', head = '', front = '';
  // Thân ấu trùng cong chữ C, các đốt tròn gộp chung viền
  const seg = [[86, 152, 19], [97, 133, 21], [115, 124, 23], [134, 131, 22], [144, 149, 20], [141, 166, 16], [129, 176, 12]];
  body += bl(seg.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), cel(c.l, c.ls));
  // Vạch đốt
  for (let i = 0; i < seg.length - 1; i++) {
    const [x1, y1, r1] = seg[i], [x2, y2, r2] = seg[i + 1], mx_ = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, m = Math.hypot(dx, dy), nx = -dy / m, ny = dx / m, w = (r1 + r2) / 2 * .9;
    body += ln(`M${P(mx_ + nx * w, my + ny * w)} Q${P(mx_ + dx / m * 3, my + dy / m * 3)} ${P(mx_ - nx * w * .7, my - ny * w * .7)}`, '#7cc4a4', 2.4);
  }
  // Chấm thở xanh ngọc dọc lưng
  body += [[97, 120], [115, 108], [136, 116], [150, 138]].map(([x, y]) => ci(x, y, 2.6, c.b, 0)).join('');
  body += hl(106, 116, 9, 4, -35, .65);
  // 6 chân nhỏ dưới ngực
  body += [[78, 168], [88, 172], [98, 160]].map(([x, y]) => pa(capsule(x, y, x - 3, y + 9, 3.6, 3), c.b, 2.6)).join('');
  // Mầm lá trên lưng
  body += ln('M115,102 Q113,96 117,90', OL, 7) + ln('M115,102 Q113,96 117,90', '#7be35a', 3);
  body += leaf(117, 91, 19, -38, '#7be35a', '#2f9a3e', 3) + leaf(116, 94, 13, -150, '#9df27a', '#2f9a3e', 3);
  // Đầu xanh ngọc nhìn ra
  head += bl('<ellipse cx="66" cy="160" rx="23" ry="21"/>', cel(c.b, c.s));
  head += pa('M50,150 Q66,140 82,150 Q66,146 50,150 Z', c.s, 0);
  head += rgEyeCute(57, 160, 8.5, rgIrisGold(), { w: 3 }) + rgEyeCute(76, 160, 8.5, rgIrisGold(), { w: 3 });
  head += rgSmile(66, 172, 4.5, true) + rgBlush(49, 170, 4.5, 2.8) + rgBlush(83, 170, 4.5, 2.8);
  head += hl(56, 146, 6, 3, -25, .55);
  head += pa('M58,178 l3,6 l3,-5 Z M68,178 l3,5 l3,-6 Z', '#3a2a5e', 1.6);
  return { back, body, head, front, anc: rgNeo([66, 145, 44], [66, 160, 40], [80, 166, 34], [114, 110, 60, 64], [118, 150, 42, 40]) };
}
function rgBeetle2(c) {
  let back = '', body = '', head = '', front = '';
  // 6 chân ngắn, nửa giấu dưới mai
  for (const sd of [-1, 1]) {
    body += rgLeg([[100 + sd * 52, 132], [100 + sd * 70, 140], [100 + sd * 74, 166]], 11, c);
    body += rgLeg([[100 + sd * 46, 150], [100 + sd * 60, 158], [100 + sd * 60, 184]], 12, c);
    body += rgLeg([[100 + sd * 22, 166], [100 + sd * 34, 174], [100 + sd * 32, 188]], 11, c);
  }
  // Mai cánh cứng tròn bóng, hai nửa, đốm lá sáng
  for (const sd of [-1, 1]) {
    const d = `M100,66 C${P(100 + sd * 32, 64)} ${P(100 + sd * 54, 86)} ${P(100 + sd * 54, 116)} C${P(100 + sd * 54, 146)} ${P(100 + sd * 34, 160)} 100,160 Z`;
    body += pa(d, cel('#2ab8c8', '#0e5a80'), 5.5);
    body += pa(rgPetalD(100 + sd * 24, 128, 30, 9, sd < 0 ? -112 : -68), '#7fe8d0', 0, 'opacity=".55"');
    body += hl(100 + sd * 26, 86, 10, 5, sd * 35, .6) + `<ellipse cx="${100 + sd * 42}" cy="110" rx="2.6" ry="8" fill="#fff" opacity=".45"/>`;
  }
  // Mầm lá nhỏ trên đỉnh mai
  body += ln('M100,68 Q99,63 101,59', OL, 6) + ln('M100,68 Q99,63 101,59', '#7be35a', 2.6) + leaf(101, 60, 12, -40, '#7be35a', '#2f9a3e', 2.4) + leaf(100, 62, 8, -145, '#9df27a', '#2f9a3e', 2.2);
  // Khiên ngực
  body += pa('M64,140 Q64,116 100,114 Q136,116 136,140 Q132,156 100,156 Q68,156 64,140 Z', cel('#1f86a8', '#0b3a5c'), 5);
  body += hl(84, 124, 10, 3.5, -12, .55);
  // Đầu + sừng ngắn màu đồng
  head += bl('<ellipse cx="100" cy="162" rx="29" ry="20"/>', cel(c.b, c.s));
  head += pa('M93,148 Q90,128 98,112 Q106,106 112,112 Q104,118 106,130 Q107,140 108,148 Z', cel('#f0b860', '#9a5420'), 4.2) + hl(97, 128, 2, 7, 15, .6);
  head += rgAntenna(76, 152, -1, 14, -150, c.b) + rgAntenna(124, 152, 1, 14, -30, c.b);
  head += rgEyeCute(88, 162, 9.5, rgIrisGold(), { w: 3.2 }) + rgEyeCute(112, 162, 9.5, rgIrisGold(), { w: 3.2 });
  head += ln('M79,149 Q86,146 93,149 M107,149 Q114,146 121,149', OL, 3.4);
  head += rgSmile(100, 174, 4.5) + rgBlush(78, 173, 5, 3) + rgBlush(122, 173, 5, 3);
  head += pa('M92,179 l3,6 l3,-5 Z M102,179 l3,5 l3,-6 Z', '#9a5420', 1.6);
  return { back, body, head, front, anc: rgNeo([100, 148, 48], [100, 162, 44], [100, 146, 50], [100, 72, 82, 80], [100, 134, 60, 34]) };
}
function rgBeetle3(c) {
  let back = '', body = '', head = '', front = '';
  // Chân phía xa (tối hơn)
  const far = { leg: '#1e2a58', legs: '#0e1230' };
  back += rgLeg([[70, 132], [56, 150], [60, 184]], 10, far) + rgLeg([[106, 136], [118, 156], [116, 184]], 10, far) + rgLeg([[140, 132], [164, 150], [172, 182]], 10, far);
  // Cánh cứng dài nghiêng, ánh xanh
  const ely = 'M80,110 C84,76 124,66 152,78 C172,88 180,110 170,126 C158,142 118,144 86,136 C78,132 78,120 80,110 Z';
  body += pa(ely, cel('#2cc0d0', '#0e4f78'), 5.5);
  body += ln('M86,134 C120,142 158,138 170,124', '#7ff0ff', 2.6, 'opacity=".6"') + ln('M84,112 C110,104 150,100 174,112', '#0e4f78', 2.4, 'opacity=".5"');
  body += pa('M98,84 C118,74 146,74 160,86 C140,80 116,82 98,92 Z', '#ffffff', 0, 'opacity=".5"');
  body += pa('M112,104 C130,98 150,100 162,108 C146,106 128,108 114,112 Z', '#bff8ff', 0, 'opacity=".45"');
  body += leaf(132, 118, 18, -165, '#7be35a', '#2f9a3e', 2.4);
  // Khiên ngực + sừng ngực ngắn chĩa trước
  body += pa('M50,118 C52,92 74,84 92,92 C102,98 102,126 92,138 C78,146 54,140 50,118 Z', cel(c.pr, c.prs), 5);
  body += pa('M66,92 C58,80 46,74 36,74 C46,82 52,90 56,98 Z', cel(c.horn, c.hs), 4);
  body += hl(70, 102, 9, 3.5, -30, .55);
  // Chân phía gần
  body += rgLeg([[64, 138], [46, 156], [44, 186]], 12, c) + rgLeg([[98, 138], [100, 160], [92, 187]], 12, c) + rgLeg([[132, 134], [154, 156], [158, 187]], 12, c);
  // Đầu quay ra + sừng dài cong có chạc
  head += pa('M40,126 C26,112 20,90 26,68 C29,56 36,46 46,40 C42,34 44,28 50,24 C50,32 54,36 60,38 C66,32 72,32 76,34 C68,38 62,44 58,52 C52,62 48,72 48,84 C48,98 54,110 62,118 Z', cel(c.horn, c.hs), 4.5);
  head += ln('M34,110 C28,94 28,76 36,60', '#fff0c0', 2.6, 'opacity=".7"');
  head += bl('<ellipse cx="46" cy="132" rx="22" ry="18"/>', cel(c.b, c.s));
  head += rgAntenna(30, 130, -1, 12, 160, c.b);
  head += eye(38, 132, 7.5, 7.5, -1, { lid: .82, skin: c.b, iris: rgIrisGold(), bw: 4.6 }) + eye(56, 132, 7.5, 7.5, 1, { lid: .82, skin: c.b, iris: rgIrisGold(), bw: 4.6 });
  head += ln('M40,144 Q47,147 54,143', OL, 3) + pa('M40,148 l2.5,6 l2.5,-5 Z M50,148 l2.5,5 l2.5,-6 Z', c.horn, 1.6);
  return { back, body, head, front, anc: rgNeo([46, 118, 40], [47, 132, 32], [64, 140, 30], [124, 76, 84, 62], [72, 118, 42, 40]) };
}
function rgBeetle4(c) {
  let back = '', body = '', head = '', front = '';
  back += rgGlow(100, 96, 92, '#8a7bff');
  // Cánh màng trong suốt phát sáng, hai đôi
  let wings = '';
  {
    const sd = 1;
    const w1 = `M${P(100 + sd * 16, 98)} C${P(100 + sd * 36, 62)} ${P(100 + sd * 66, 30)} ${P(100 + sd * 90, 16)} C${P(100 + sd * 96, 34)} ${P(100 + sd * 92, 64)} ${P(100 + sd * 72, 90)} C${P(100 + sd * 52, 108)} ${P(100 + sd * 30, 110)} ${P(100 + sd * 16, 104)} Z`;
    const w2 = `M${P(100 + sd * 18, 110)} C${P(100 + sd * 44, 106)} ${P(100 + sd * 76, 112)} ${P(100 + sd * 92, 130)} C${P(100 + sd * 78, 148)} ${P(100 + sd * 48, 146)} ${P(100 + sd * 20, 122)} Z`;
    wings += pa(w2, '#e2d6ff', 3.5, 'fill-opacity=".55"') + pa(w1, '#d6fbff', 4, 'fill-opacity=".55"');
    wings += ln(`M${P(100 + sd * 18, 100)} C${P(100 + sd * 44, 72)} ${P(100 + sd * 68, 42)} ${P(100 + sd * 88, 20)} M${P(100 + sd * 44, 76)} Q${P(100 + sd * 68, 74)} ${P(100 + sd * 88, 62)} M${P(100 + sd * 30, 92)} Q${P(100 + sd * 52, 96)} ${P(100 + sd * 70, 90)} M${P(100 + sd * 22, 114)} Q${P(100 + sd * 54, 118)} ${P(100 + sd * 84, 128)}`, '#46d2ff', 2.2);
    wings += hl(100 + sd * 64, 44, 11, 3, sd * 40, .7);
  }
  // Một cánh phải, lật gương ra cánh trái; vỗ nhẹ quanh gốc cánh (tắt khi giảm chuyển động)
  const flap = `<g class="pt" style="transform-origin:0% 62%">${wings}</g>`;
  back += flap + `<g transform="matrix(-1 0 0 1 200 0)">${flap}</g>`;
  // Cánh cứng ngọc mở hất lên, viền vàng
  for (const sd of [-1, 1]) {
    const d = `M${P(100 + sd * 12, 104)} C${P(100 + sd * 10, 80)} ${P(100 + sd * 24, 58)} ${P(100 + sd * 46, 46)} C${P(100 + sd * 58, 56)} ${P(100 + sd * 60, 84)} ${P(100 + sd * 48, 106)} C${P(100 + sd * 38, 120)} ${P(100 + sd * 20, 120)} ${P(100 + sd * 12, 104)} Z`;
    back += pa(d, cel('#4a6cff', '#2a1488'), 5.5) + ln(`M${P(100 + sd * 15, 102)} C${P(100 + sd * 14, 80)} ${P(100 + sd * 28, 60)} ${P(100 + sd * 45, 50)}`, RG_GOLD, 3);
    back += pa(`M${P(100 + sd * 30, 60)} C${P(100 + sd * 44, 56)} ${P(100 + sd * 52, 70)} ${P(100 + sd * 50, 86)} C${P(100 + sd * 46, 74)} ${P(100 + sd * 40, 66)} ${P(100 + sd * 30, 60)} Z`, '#ffffff', 0, 'opacity=".55"');
    back += pa(rgPetalD(100 + sd * 30, 104, 26, 7, sd < 0 ? -112 : -68), '#8ff8ff', 0, 'opacity=".6"') + ci(100 + sd * 38, 96, 3, RG_GOLD, 1.6);
  }
  // Bụng ngọc phát sáng
  body += pa('M80,108 Q80,88 100,86 Q120,88 120,108 Q120,134 100,142 Q80,134 80,108 Z', cel('#c8fff0', '#3fd6a8'), 4.5) + ln('M84,102 Q100,106 116,102 M83,114 Q100,118 117,114 M86,126 Q100,130 114,126', '#2aa88a', 2.4);
  // 6 chân, móng vàng
  for (const sd of [-1, 1]) {
    body += rgLeg([[100 + sd * 34, 132], [100 + sd * 62, 138], [100 + sd * 70, 166]], 12, c);
    body += rgLeg([[100 + sd * 32, 148], [100 + sd * 52, 158], [100 + sd * 52, 186]], 12, c);
    body += rgLeg([[100 + sd * 18, 162], [100 + sd * 28, 174], [100 + sd * 25, 188]], 11, c);
    body += [[70, 166], [52, 186], [25, 188]].map(([x, y]) => ci(100 + sd * x, y - 3, 3.2, RG_GOLD, 1.8)).join('');
  }
  // Khiên ngực ngọc tím viền vàng
  body += pa('M62,136 Q62,112 100,108 Q138,112 138,136 Q134,154 100,156 Q66,154 62,136 Z', cel('#5a6cf0', '#2a127a'), 5);
  body += ln('M68,132 Q68,116 100,113 Q132,116 132,132', RG_GOLD, 3) + hl(82, 120, 11, 3.5, -12, .6) + ci(100, 122, 4, RG_JADE, 2);
  // Sừng chạc vàng lớn
  const hornD = 'M92,150 C90,124 93,96 96,72 C88,66 80,56 76,42 C74,36 70,32 66,30 C74,30 80,34 84,42 C88,52 94,58 98,62 C97,50 96.5,38 100,22 C103.5,38 103,50 103,62 C106,58 112,52 116,42 C120,34 126,30 134,30 C130,32 126,36 124,42 C120,56 112,66 104,72 C107,96 110,124 108,150 Z';
  head += pa(hornD, 'url(#gGold)', 4.5) + ln('M99,144 C97,120 98,96 100,70', '#fff6c0', 2.4, 'opacity=".85"');
  head += bl('<ellipse cx="100" cy="160" rx="27" ry="19"/>', cel(c.b, c.s));
  head += rgAntenna(76, 152, -1, 16, -150, RG_GOLD) + rgAntenna(124, 152, 1, 16, -30, RG_GOLD);
  head += rgGlowRim(88, 160, 8.5) + rgGlowRim(112, 160, 8.5) + eye(88, 160, 8.5, 8.5, -1, { lid: 1, skin: c.b, iris: '#d6ff6a', bw: 5.4 }) + eye(112, 160, 8.5, 8.5, 1, { lid: 1, skin: c.b, iris: '#d6ff6a', bw: 5.4 });
  head += ln('M92,171 Q100,174 108,171', OL, 3) + pa('M90,175 l3,7 l3,-6 Z M104,175 l3,6 l3,-7 Z', RG_GOLD, 1.6);
  // Bào tử sáng bay quanh
  front += [[16, 156, 2.6, 0], [184, 156, 2.8, .6], [22, 96, 2.2, 1.2], [178, 100, 2.4, .3], [44, 14, 2.2, .9], [156, 12, 2.4, 1.5]].map(([x, y, r, d]) => rgFly(x, y, r, d, '#8ff8ff')).join('');
  return { back, body, head, front, anc: rgNeo([100, 148, 50], [100, 160, 44], [100, 142, 52], [100, 98, 70, 80], [100, 130, 60, 40]) };
}

/* ===================== HƯƠU GẠC ===================== */
// Nai con đốm trắng nằm cuộn → hươu non gạc nhú lá → hươu đực gạc cành nở hoa → thần rừng gạc là cả tán cây
PET_SPECS.stag = {
  el: 'forest',
  c: { b: '#e0a060', s: '#a8642e', l: '#fff3de', ls: '#f2d2a6', i: '#3fe06a', ant: '#a8683a', ants: '#6a3a18', hoof: '#4a2a1a', nose: '#3a2140', ear: '#ffb3c8' },
  c4: { b: '#cf8644', s: '#8a4a1e', l: '#fff0d6', ls: '#ecc690', i: '#b6ff6a', ant: '#e8b25a', ants: '#a8642e', hoof: '#ffd21f' },
  draw(f, g, c) {
    return [null, rgStag1, rgStag2, rgStag3, rgStag4][f](c, g);
  }
};
const rgIrisGreen = () => lin('#1d9a40', '#3fe06a', '#c8ffb0');
// Tai lá hươu: gốc (x, y), hướng ang, dài L
function rgDeerEar(x, y, L, w, ang, c) {
  return pa(rgPetalD(x, y, L, w, ang), cel(c.b, c.s), 4.5) + pa(rgPetalD(x + Math.cos(ang * Math.PI / 180) * 3, y + Math.sin(ang * Math.PI / 180) * 3, L * .72, w * .5, ang), c.ear || '#ffb3c8', 0);
}
// Chân hươu thon + móng
function rgHoofLeg(x1, y1, x2, y2, w, c, dark) {
  const fill = dark ? cel(c.s, '#6a3a18') : cel(c.b, c.s);
  return pa(capsule(x1, y1, x2, y2 - 6, w, w * .62), fill, 4) + pa(`M${P(x2 - w * .75, y2 - 7)} L${P(x2 + w * .75, y2 - 7)} L${P(x2 + w * .85, y2)} L${P(x2 - w * .85, y2)} Z`, c.hoof, 3);
}
function rgStag1(c) {
  let back = '', body = '', head = '', front = '';
  // Thân nằm, chân gập
  body += bl('<ellipse cx="114" cy="164" rx="40" ry="22"/><ellipse cx="140" cy="168" rx="18" ry="16"/>', cel(c.b, c.s));
  body += pa('M150,150 Q162,140 160,154 Q158,160 150,158 Z', c.l, 3.5);
  body += [[98, 150, 3], [112, 146, 3.4], [126, 148, 3], [140, 154, 2.6], [106, 158, 2.4], [120, 158, 2.8], [134, 164, 2.2]].map(([x, y, r]) => ci(x, y, r, '#fff8e8', 0)).join('');
  body += hl(100, 152, 10, 3.5, -10, .35);
  body += el(116, 180, 26, 5, c.l, 0);
  body += rgHoofLeg(84, 176, 100, 186, 6.5, c) + rgHoofLeg(146, 176, 156, 186, 6, c);
  // Cổ
  body += pa(capsule(92, 160, 78, 128, 14, 12), cel(c.b, c.s), 5);
  body += el(84, 152, 9, 10, c.l, 0);
  // Tai to + đầu tròn
  head += rgDeerEar(56, 106, 30, 11, -160, c) + rgDeerEar(92, 104, 30, 11, -20, c);
  head += bl('<ellipse cx="74" cy="118" rx="25" ry="22"/>', cel(c.b, c.s));
  head += el(72, 131, 13, 9, c.l, 0) + el(72, 126, 4.4, 3.2, c.nose, 0) + hl(71, 125, 1.6, .9, 0, .8);
  head += rgEyeCute(62, 116, 8.5, rgIrisGreen(), { w: 3.2, dx: .05 }) + rgEyeCute(85, 116, 8.5, rgIrisGreen(), { w: 3.2, dx: -.05 });
  head += rgSmile(72, 133, 3.5) + rgBlush(54, 126, 4.5, 2.8) + rgBlush(92, 126, 4.5, 2.8);
  head += hl(64, 102, 7, 3, -25, .5);
  // Mầm lá trên trán
  head += leaf(74, 97, 16, -60, '#7be35a', '#2f9a3e', 2.8) + leaf(73, 98, 11, -130, '#9df27a', '#2f9a3e', 2.6);
  return { back, body, head, front, anc: rgNeo([74, 103, 44], [73, 116, 42], [86, 144, 30], [114, 146, 60, 38], [112, 164, 50, 30]) };
}
function rgStag2(c) {
  let back = '', body = '', head = '', front = '';
  // Chân xa (tối)
  back += rgHoofLeg(100, 140, 104, 186, 5.5, c, true) + rgHoofLeg(146, 138, 152, 184, 5.5, c, true);
  // Đuôi vểnh
  back += pa('M150,122 Q166,110 162,126 Q158,132 150,130 Z', c.l, 3.5);
  // Thân
  body += bl('<ellipse cx="122" cy="132" rx="34" ry="18"/>', cel(c.b, c.s));
  body += el(118, 144, 24, 5, c.l, 0);
  body += [[112, 122, 2.8], [126, 120, 3], [140, 124, 2.6], [120, 130, 2.2]].map(([x, y, r]) => ci(x, y, r, '#fff8e8', 0)).join('');
  body += hl(106, 122, 10, 3.5, -12, .35);
  // Chân gần
  body += rgHoofLeg(92, 140, 88, 188, 6, c) + rgHoofLeg(138, 140, 138, 188, 6, c);
  // Cổ
  body += pa(capsule(98, 132, 80, 100, 13, 10.5), cel(c.b, c.s), 5) + el(90, 124, 7, 9, c.l, 0);
  // Gạc nhú có lá
  for (const sd of [-1, 1]) {
    const x0 = 76 + sd * 9, d = `M${P(x0, 78)} Q${P(x0 + sd * 2, 70)} ${P(x0 + sd * 5, 62)} M${P(x0 + sd * 1.5, 70)} L${P(x0 - sd * 3, 64)}`;
    head += tube(d, c.ant, 4.5, 3.2);
    head += leaf(x0 + sd * 5, 62, 13, sd < 0 ? -125 : -55, '#7be35a', '#2f9a3e', 2.6);
  }
  // Tai + đầu
  head += rgDeerEar(60, 84, 27, 9.5, -165, c) + rgDeerEar(92, 82, 27, 9.5, -15, c);
  head += bl('<ellipse cx="76" cy="92" rx="21" ry="19"/><ellipse cx="72" cy="104" rx="13" ry="10"/>', cel(c.b, c.s));
  head += el(72, 105, 11, 7.5, c.l, 0) + el(71, 101, 4.4, 3, c.nose, 0) + hl(70, 100, 1.6, .9, 0, .8);
  head += eye(65, 91, 7, 7.5, -1, { lid: .5, skin: c.b, iris: rgIrisGreen(), pr: 3.8, bw: 4.2 }) + eye(86, 91, 7, 7.5, 1, { lid: .5, skin: c.b, iris: rgIrisGreen(), pr: 3.8, bw: 4.2 });
  head += ln('M67,109 Q72,112 77,109', OL, 2.8);
  head += hl(68, 80, 6, 2.5, -25, .5);
  return { back, body, head, front, anc: rgNeo([76, 80, 40], [75, 91, 40], [88, 116, 28], [122, 116, 58, 46], [114, 132, 44, 34]) };
}
function rgStag3(c) {
  let back = '', body = '', head = '', front = '';
  back += rgHoofLeg(104, 128, 108, 186, 6.5, c, true) + rgHoofLeg(152, 126, 160, 184, 6.5, c, true);
  back += pa('M160,104 Q178,92 172,110 Q168,116 160,114 Z', c.l, 3.5);
  // Thân dài, ngực sâu
  body += bl('<ellipse cx="124" cy="114" rx="42" ry="24"/>', cel(c.b, c.s));
  body += el(118, 130, 30, 6, c.l, 0);
  body += [[140, 104, 2.6], [152, 108, 2.2], [146, 98, 2]].map(([x, y, r]) => ci(x, y, r, '#fff8e8', 0)).join('');
  body += hl(104, 102, 12, 4, -12, .35);
  body += rgHoofLeg(94, 126, 88, 188, 7, c) + rgHoofLeg(146, 126, 146, 188, 7, c);
  // Cổ cao + bờm lá
  body += pa(capsule(100, 114, 80, 64, 15, 11), cel(c.b, c.s), 5);
  body += [[78, 90, 150, 16], [82, 98, 125, 18], [88, 104, 105, 19], [96, 106, 85, 18], [104, 104, 65, 16], [108, 98, 40, 14]].map(([x, y, a, L], i) => leaf(x, y, L, a, i % 2 ? '#9df27a' : '#c2f78e', '#4fb84a', 2.6)).join('');
  // Gạc cành cây nở hoa
  for (const sd of [-1, 1]) {
    const x0 = 72 + sd * 9, Q = (dx, dy) => P(x0 + sd * dx * .84, 46 - dy * .84);
    const d = `M${Q(0, 0)} C${Q(4, 8)} ${Q(10, 18)} ${Q(26, 34)} M${Q(5, 10)} Q${Q(-4, 20)} ${Q(-3, 30)} M${Q(16, 22)} Q${Q(26, 20)} ${Q(36, 24)} M${Q(3, 5)} Q${Q(12, 4)} ${Q(18, 8)}`;
    head += tube(d, cel(c.ant, c.ants), 5.5, 3.4);
    head += leaf(x0 + sd * 26 * .84, 46 - 34 * .84, 12, sd < 0 ? -130 : -50, '#7be35a', '#2f9a3e', 2.4) + leaf(x0 + sd * 36 * .84, 46 - 24 * .84, 11, sd < 0 ? 200 : -20, '#9df27a', '#2f9a3e', 2.4);
    head += rgBloom(x0 - sd * 3 * .84, 46 - 30 * .84, 5.5) + rgBloom(x0 + sd * 18 * .84, 46 - 8 * .84, 4.5, '#fff6fb', RG_PINK);
  }
  // Tai + đầu thuôn
  head += rgDeerEar(58, 58, 26, 9, -170, c) + rgDeerEar(88, 56, 26, 9, -10, c);
  head += bl('<ellipse cx="74" cy="60" rx="19" ry="18"/><ellipse cx="68" cy="76" rx="12" ry="11"/>', cel(c.b, c.s));
  head += el(68, 78, 10.5, 7.5, c.l, 0) + el(66, 74, 4.6, 3.2, c.nose, 0) + hl(65, 73, 1.6, .9, 0, .8);
  head += eye(64, 59, 6.5, 6.5, -1, { lid: .82, skin: c.b, iris: rgIrisGreen(), bw: 4.4 }) + eye(84, 59, 6.5, 6.5, 1, { lid: .82, skin: c.b, iris: rgIrisGreen(), bw: 4.4 });
  head += ln('M63,83 Q68,85 73,82', OL, 2.8);
  return rgShrink({ back, body, head, front, anc: rgNeo([74, 48, 38], [74, 59, 38], [86, 92, 30], [124, 94, 66, 56], [104, 114, 44, 40]) }, .9);
}
function rgStag4(c) {
  let back = '', body = '', head = '', front = '';
  back += rgGlow(100, 98, 90, RG_JADE);
  // Gạc vàng vươn lên, tỏa thành vòm tán cây
  let br = '';
  for (const sd of [-1, 1]) {
    br += `M${P(100 + sd * 8, 58)} C${P(100 + sd * 10, 48)} ${P(100 + sd * 16, 42)} ${P(100 + sd * 26, 36)} M${P(100 + sd * 20, 40)} C${P(100 + sd * 18, 32)} ${P(100 + sd * 16, 26)} ${P(100 + sd * 12, 20)} M${P(100 + sd * 26, 36)} C${P(100 + sd * 40, 30)} ${P(100 + sd * 50, 30)} ${P(100 + sd * 60, 26)} M${P(100 + sd * 40, 31)} C${P(100 + sd * 54, 38)} ${P(100 + sd * 66, 46)} ${P(100 + sd * 76, 58)} `;
  }
  const cr = [[100, 22, 17], [77, 22, 17], [123, 22, 17], [54, 30, 16], [146, 30, 16], [34, 44, 13], [166, 44, 13], [20, 60, 10], [180, 60, 10]];
  back += bl(cr.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), '#3fae4a', 4.5);
  back += `<g fill="#7fdc58">${cr.map(([x, y, r]) => `<circle cx="${f1(x - r * .12)}" cy="${f1(y - r * .2)}" r="${f1(r * .78)}"/>`).join('')}</g>`;
  back += `<g fill="#b8f27a">${cr.slice(0, 7).map(([x, y, r]) => `<ellipse cx="${f1(x - r * .25)}" cy="${f1(y - r * .42)}" rx="${f1(r * .42)}" ry="${f1(r * .22)}"/>`).join('')}</g>`;
  back += ln(cr.map(([x, y, r]) => `M${P(x - r * .6, y + r * .5)} Q${P(x, y + r * .2)} ${P(x + r * .6, y + r * .5)}`).join(' '), '#2a8a3a', 2.4, 'opacity=".7"');
  back += tube(br, 'url(#gGold)', 5, 3.2);
  back += [[100, 12, 5.5], [64, 16, 5], [136, 16, 5], [42, 32, 4.5], [158, 32, 4.5], [86, 30, 4], [114, 30, 4], [24, 52, 3.6], [176, 52, 3.6]].map(([x, y, r], i) => rgBloom(x, y, r, i % 3 === 2 ? '#fff6fb' : RG_PINK)).join('');
  // Chân sau ló hai bên
  back += rgHoofLeg(79, 138, 78, 182, 6.5, c, true) + rgHoofLeg(121, 138, 122, 182, 6.5, c, true);
  // Ngực + yếm sáng, đốm sao phát sáng
  body += bl('<ellipse cx="100" cy="124" rx="27" ry="25"/>', cel(c.b, c.s));
  body += pa('M88,104 Q100,99 112,104 Q114,130 100,146 Q86,130 88,104 Z', cel(c.l, c.ls), 3.5);
  body += [[80, 116, 3], [120, 116, 3], [82, 130, 2.2], [118, 130, 2.2]].map(([x, y, r]) => (PET_LITE ? '' : `<circle cx="${x}" cy="${y}" r="${f1(r * 2.3)}" fill="${RG_JADE}" opacity=".35"/>`) + ci(x, y, r, '#eafff6', 1.6)).join('');
  // Chân trước quấn dây leo sáng
  for (const sd of [-1, 1]) {
    const x = 100 + sd * 12;
    body += rgHoofLeg(x, 140, x + sd * 1, 188, 7, c);
    const v = `M${P(x - 7, 180)} Q${P(x + 9, 172)} ${P(x - 7, 164)} Q${P(x + 9, 156)} ${P(x - 6, 148)}`;
    body += ln(v, OL, 6) + ln(v, RG_JADE, 2.8) + leaf(x - 6, 148, 10, sd < 0 ? -150 : -30, '#9df27a', '#2f9a3e', 2.2);
  }
  // Cổ + vai lá
  body += pa(capsule(100, 112, 100, 86, 14, 12.5), cel(c.b, c.s), 5);
  body += [[80, 104, 160], [84, 108, 135], [116, 108, 45], [120, 104, 20]].map(([x, y, a], i) => leaf(x, y, 18, a, i % 3 ? '#9df27a' : '#7be35a', '#2f9a3e', 2.8)).join('') + rgBloom(100, 106, 5.5);
  // Tai + mặt dài nhìn thẳng, vệt trán ngọc
  head += rgDeerEar(86, 66, 30, 10, -162, c) + rgDeerEar(114, 66, 30, 10, -18, c);
  head += bl('<ellipse cx="100" cy="70" rx="20" ry="17"/><ellipse cx="100" cy="87" rx="12.5" ry="12.5"/>', cel(c.b, c.s));
  head += pa(rgPetalD(100, 70, 16, 5, -90), '#eafff6', 2) + el(100, 92, 10, 7.5, c.l, 0) + el(100, 88, 5.5, 3.6, c.nose, 0) + hl(98.5, 87, 1.8, 1, 0, .8);
  head += rgGlowRim(89, 72, 6.6) + rgGlowRim(111, 72, 6.6) + eye(89, 72, 6.6, 6.6, -1, { lid: 1, skin: c.b, iris: '#d6ff6a', bw: 4.8 }) + eye(111, 72, 6.6, 6.6, 1, { lid: 1, skin: c.b, iris: '#d6ff6a', bw: 4.8 });
  head += ln('M95,97 Q100,99 105,97', OL, 2.8);
  front += [[12, 94, 2.6, 0], [188, 96, 2.8, .7], [24, 146, 2.4, 1.3], [176, 148, 2.6, .4], [50, 66, 2.2, 1], [150, 68, 2.2, 1.6], [100, 52, 2, .5]].map(([x, y, r, d]) => rgFly(x, y, r, d)).join('');
  return { back, body, head, front, anc: rgNeo([100, 57, 40], [100, 72, 40], [100, 102, 32], [100, 104, 62, 76], [100, 124, 48, 46]) };
}

/* ===================== GẤU TRÚC VÕ ===================== */
// Bé con ôm đốt tre → môn sinh vác gậy tre → võ sư thế hạc, áo choàng lá tre → đại sư thiền lơ lửng, lá tre xoáy
PET_SPECS.panda = {
  el: 'forest',
  c: { b: '#ffffff', s: '#cfd2e8', dk: '#2e2850', dks: '#15102e', i: '#3fe06a', band: '#3fe06a', bands: '#1d9a40' },
  c4: { b: '#f7f8ff', s: '#bcc0dc', i: '#b6ff6a', band: '#ffd21f', bands: '#d48700' },
  draw(f, g, c) {
    return [null, rgPanda1, rgPanda2, rgPanda3, rgPanda4][f](c, g);
  }
};
// Đầu gấu trúc: tai, mặt, quầng mắt; o.eye(cx, cy, side) vẽ mắt
function rgPandaHead(cx, cy, rx, ry, c, o) {
  let s = bl(`<circle cx="${f1(cx - rx * .74)}" cy="${f1(cy - ry * .78)}" r="${f1(o.er)}"/><circle cx="${f1(cx + rx * .74)}" cy="${f1(cy - ry * .78)}" r="${f1(o.er)}"/>`, cel(c.dk, c.dks));
  s += bl(`<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`, cel(c.b, c.s));
  for (const sd of [-1, 1]) s += `<ellipse cx="${f1(cx + sd * rx * .38)}" cy="${f1(cy + ry * .04)}" rx="${f1(rx * .27)}" ry="${f1(ry * .33)}" fill="${c.dk}" transform="rotate(${sd * -32} ${f1(cx + sd * rx * .38)} ${f1(cy + ry * .04)})"/>`;
  s += el(cx, cy + ry * .5, rx * .3, ry * .24, '#ffffff', 3) + pa(`M${P(cx - rx * .12, cy + ry * .36)} Q${P(cx, cy + ry * .3)} ${P(cx + rx * .12, cy + ry * .36)} Q${P(cx, cy + ry * .52)} ${P(cx - rx * .12, cy + ry * .36)} Z`, OL, 0);
  s += hl(cx - rx * .5, cy - ry * .55, rx * .2, ry * .1, -25, .55);
  s += o.eye(cx - rx * .38, cy + ry * .02, -1) + o.eye(cx + rx * .38, cy + ry * .02, 1);
  return s;
}
// Đốt tre
function rgBamboo(x1, y1, x2, y2, w, nodes = [.33, .66]) {
  const dx = x2 - x1, dy = y2 - y1, m = Math.hypot(dx, dy), nx = -dy / m * w * .62, ny = dx / m * w * .62;
  return tube(`M${P(x1, y1)} L${P(x2, y2)}`, '#8fd65a', w, 3.5) + ln(`M${P(x1 + nx * .4 + dx * .04, y1 + ny * .4 + dy * .04)} L${P(x2 + nx * .4 - dx * .04, y2 + ny * .4 - dy * .04)}`, '#d8ffb8', w * .2, 'opacity=".7"') +
    nodes.map(t => ln(`M${P(x1 + dx * t + nx, y1 + dy * t + ny)} L${P(x1 + dx * t - nx, y1 + dy * t - ny)}`, '#2f9a3e', 3)).join('');
}
function rgPanda1(c) {
  let back = '', body = '', head = '', front = '';
  // Thân ngồi + bàn chân
  body += bl('<ellipse cx="100" cy="164" rx="31" ry="23"/>', cel(c.b, c.s));
  for (const sd of [-1, 1]) body += el(100 + sd * 22, 181, 13, 9, cel(c.dk, c.dks), 4.5) + el(100 + sd * 22, 182, 5.5, 4, '#ff9ab4', 0) + [-5, 0, 5].map(k => ci(100 + sd * 22 + k, 175.5, 1.8, '#ff9ab4', 0)).join('');
  // Đốt tre ôm chéo, mầm lá trên đầu đốt
  body += rgBamboo(60, 170, 142, 162, 15, [.2, .8]);
  body += ln('M140,160 Q146,150 144,140', OL, 7) + ln('M140,160 Q146,150 144,140', '#7be35a', 3) + leaf(144, 141, 19, -55, '#7be35a', '#2f9a3e', 2.8) + leaf(143, 146, 14, -140, '#9df27a', '#2f9a3e', 2.6);
  // Tay ôm
  for (const sd of [-1, 1]) body += pa(capsule(100 + sd * 27, 148, 100 + sd * 15, 160, 8.5, 8), cel(c.dk, c.dks), 4.5) + ci(100 + sd * 13, 162, 8.5, cel(c.dk, c.dks), 4) + [-4, 0, 4].map(k => ci(100 + sd * 13 + k, 157.5, 1.6, '#ff9ab4', 0)).join('');
  head += rgPandaHead(100, 124, 35, 29, c, { er: 12, eye: (x, y, sd) => rgEyeCute(x + sd * 1, y, 8.4, rgIrisGreen(), { w: 0, dx: -sd * .05 }) });
  head += rgSmile(100, 142, 4) + rgBlush(78, 140, 5, 3) + rgBlush(122, 140, 5, 3);
  return { back, body, head, front, anc: rgNeo([100, 102, 52], [100, 125, 50], [100, 150, 42], [100, 144, 50, 40], [100, 162, 46, 34]) };
}
function rgPanda2(c) {
  let back = '', body = '', head = '', front = '';
  // Gậy tre vác ngang sau vai
  back += rgBamboo(24, 116, 176, 104, 9, [.15, .4, .62, .86]);
  back += leaf(176, 104, 14, -30, '#7be35a', '#2f9a3e', 2.6) + leaf(25, 116, 12, 200, '#9df27a', '#2f9a3e', 2.6);
  // Chân
  for (const sd of [-1, 1]) body += pa(capsule(100 + sd * 12, 160, 100 + sd * 14, 180, 10, 9.5), cel(c.dk, c.dks), 4.5) + el(100 + sd * 16, 184, 12, 6.5, cel(c.dk, c.dks), 4.5);
  // Thân + vai đen
  body += pa('M76,128 Q78,112 100,110 Q122,112 124,128 Q128,152 122,166 Q100,174 78,166 Q72,152 76,128 Z', cel(c.b, c.s), 5.5);
  body += pa('M76,128 Q78,112 100,110 Q122,112 124,128 Q112,122 100,124 Q88,122 76,128 Z', c.dk, 0);
  body += pa('M77,150 Q100,158 123,150 L124,159 Q100,167 76,159 Z', cel(c.band, c.bands), 3.5) + pa('M104,158 l6,12 l5,-2 l-4,-11 Z', cel(c.band, c.bands), 3);
  // Tay vắt lên gậy
  for (const sd of [-1, 1]) {
    body += pa(capsule(100 + sd * 24, 124, 100 + sd * 44, 108, 8.5, 8), cel(c.dk, c.dks), 4.5) + pa(capsule(100 + sd * 44, 108, 100 + sd * 52, 122, 8, 7.5), cel(c.dk, c.dks), 4.5);
  }
  // Đầu + băng đô bay
  head += rgPandaHead(100, 88, 33, 27, c, { er: 11.5, eye: (x, y, sd) => eye(x + sd * 1, y + 1, 7.2, 7.6, sd, { lid: .5, skin: c.dk, iris: rgIrisGreen(), pr: 3.8, bw: 0, brow: false }) });
  head += pa('M68,74 Q100,60 132,74 L133,82 Q100,68 67,82 Z', cel(c.band, c.bands), 3.5);
  head += pa('M131,76 Q146,72 156,62 Q152,74 160,80 Q146,80 133,82 Z', cel(c.band, c.bands), 3.2) + pa('M132,79 Q148,86 154,98 Q144,90 132,84 Z', cel(c.band, c.bands), 3.2);
  head += ln('M92,104 Q100,108 108,103', OL, 3) + rgBlush(76, 100, 4.5, 2.6) + rgBlush(124, 100, 4.5, 2.6);
  return { back, body, head, front, anc: rgNeo([100, 70, 52], [100, 89, 48], [100, 114, 40], [100, 114, 50, 58], [100, 140, 46, 40]) };
}
function rgPanda3(c) {
  let back = '', body = '', head = '', front = '';
  // Áo choàng lá tre bay sang phải
  let cape = '';
  [[118, 94, 14, 74, 10], [114, 96, 30, 84, 11], [108, 98, 46, 86, 11], [100, 98, 62, 80, 10], [92, 98, 80, 72, 9], [86, 96, 100, 58, 8], [82, 94, 122, 44, 7]].forEach(([x, y, a, L, w], i) => { cape += rgPetal(x, y, L, w, a, cel(i % 2 ? '#5fcf4a' : '#8fe35a', '#24803a'), null, 4) + ln(`M${P(x, y)} L${P(x + Math.cos(a * Math.PI / 180) * L * .8, y + Math.sin(a * Math.PI / 180) * L * .8)}`, '#24803a', 1.8, 'opacity=".7"'); });
  back += `<g class="sway">${cape}</g>`;
  // Chân trụ + chân co
  body += pa(capsule(92, 146, 88, 178, 10.5, 10), cel(c.dk, c.dks), 4.5) + el(86, 183, 13, 6.5, cel(c.dk, c.dks), 4.5);
  body += pa(capsule(110, 144, 130, 128, 10.5, 10), cel(c.dk, c.dks), 4.5) + pa(capsule(130, 128, 128, 152, 10, 9), cel(c.dk, c.dks), 4.5) + el(129, 156, 7, 9, cel(c.dk, c.dks), 4);
  // Thân hơi nghiêng
  body += pa('M80,104 Q82,90 102,88 Q122,90 122,106 Q124,130 118,148 Q100,156 84,148 Q78,128 80,104 Z', cel(c.b, c.s), 5.5);
  body += pa('M80,104 Q82,90 102,88 Q122,90 122,106 Q110,100 101,102 Q90,100 80,104 Z', c.dk, 0);
  body += pa('M81,132 Q100,140 121,132 L121,141 Q100,149 81,141 Z', cel('#2e2850', '#15102e'), 3.5) + pa('M96,140 l-5,13 l5,1 l4,-12 Z M104,140 l6,12 l4,-3 l-5,-10 Z', '#2e2850', 3);
  // Tay xòe thế hạc
  body += pa(capsule(84, 100, 62, 86, 8.5, 8), cel(c.dk, c.dks), 4.5) + pa(capsule(62, 86, 44, 64, 8, 7), cel(c.dk, c.dks), 4.5);
  body += pa('M38,58 Q44,52 50,60 L46,66 Q42,62 38,64 Z', c.dk, 3.5);
  body += pa(capsule(118, 100, 142, 108, 8.5, 8), cel(c.dk, c.dks), 4.5) + pa(capsule(142, 108, 164, 102, 8, 7), cel(c.dk, c.dks), 4.5) + ci(167, 101, 7.5, cel(c.dk, c.dks), 4);
  // Đầu + băng đô xanh đậm bay trái
  head += rgPandaHead(101, 64, 31, 26, c, { er: 11, eye: (x, y, sd) => eye(x + sd * 1, y + 1, 6.6, 6.6, sd, { lid: .85, skin: c.dk, iris: rgIrisGreen(), bw: 4.6, brow: OL }) });
  head += pa('M70,50 Q101,36 132,50 L133,58 Q101,44 69,58 Z', cel('#1d9a40', '#0f6a2a'), 3.5);
  head += pa('M71,52 Q56,46 42,50 Q52,40 48,30 Q60,42 71,50 Z', cel('#1d9a40', '#0f6a2a'), 3.2) + pa('M70,56 Q54,58 40,66 Q50,58 50,52 Z', cel('#1d9a40', '#0f6a2a'), 3.2);
  head += ln('M93,80 Q101,83 109,79', OL, 3) + ln('M106,80 l4,-2', OL, 2.6);
  return { back, body, head, front, anc: rgNeo([101, 46, 50], [101, 65, 46], [101, 92, 38], [102, 90, 46, 64], [101, 116, 42, 46]) };
}
function rgPanda4(c) {
  let back = '', body = '', head = '', front = '';
  back += rgGlow(100, 98, 96, RG_JADE);
  // Vòng lá tre xoáy quanh (quay chậm)
  if (!PET_LITE) {
    let ring = '';
    for (let i = 0; i < 12; i++) { const a = i * 30, r = a * Math.PI / 180, x = 100 + Math.cos(r) * 86, y = 104 + Math.sin(r) * 80; ring += leaf(x, y, 18 + (i % 3) * 3, a + 100, i % 2 ? '#7be35a' : '#b8f28a', '#2f9a3e', 2.6); }
    back += `<g class="spin" style="transform-origin:100px 104px">${ring}</g>`;
  }
  // Vòng hào quang sau đầu
  back += `<circle cx="100" cy="74" r="44" fill="none" stroke="${OL}" stroke-width="9"/><circle cx="100" cy="74" r="44" fill="none" stroke="url(#gGold)" stroke-width="4.5"/>`;
  back += [0, 45, 90, 135, 180, 225, 270, 315].map(a => ci(100 + Math.cos(a * Math.PI / 180) * 44, 74 + Math.sin(a * Math.PI / 180) * 44, 3.4, RG_JADE, 1.8)).join('');
  // Đệm mây ngọc dưới chân + quầng sáng mặt đất
  if (!PET_LITE) body += `<ellipse cx="100" cy="184" rx="40" ry="5" fill="${RG_JADE}" opacity=".35"/>`;
  body += bl('<ellipse cx="72" cy="166" rx="18" ry="9"/><ellipse cx="128" cy="166" rx="18" ry="9"/><ellipse cx="100" cy="168" rx="26" ry="10"/>', cel('#e6fff6', '#8ff0cc'), 4);
  // Chân xếp bằng
  body += bl('<ellipse cx="100" cy="152" rx="50" ry="15"/>', cel(c.dk, c.dks));
  body += el(78, 156, 9, 5, '#ff9ab4', 0) + el(122, 156, 9, 5, '#ff9ab4', 0);
  // Áo choàng ngọc viền vàng
  body += pa('M70,110 Q72,94 100,92 Q128,94 130,110 Q140,134 146,150 Q100,160 54,150 Q60,134 70,110 Z', cel('#2fd6a0', '#127a6a'), 5.5);
  body += pa('M86,96 L100,124 L114,96 Q100,100 86,96 Z', cel(c.b, c.s), 3.5) + ln('M85,97 L100,126 L115,97', RG_GOLD, 3);
  body += ln('M58,148 Q100,158 142,148', RG_GOLD, 3.5) + ci(100, 132, 5, RG_GOLD, 2.4);
  // Tay đặt lên gối (ấn quyết)
  for (const sd of [-1, 1]) {
    body += pa(`M${P(100 + sd * 26, 104)} Q${P(100 + sd * 46, 116)} ${P(100 + sd * 46, 140)} L${P(100 + sd * 30, 142)} Q${P(100 + sd * 32, 122)} ${P(100 + sd * 22, 114)} Z`, cel('#2fd6a0', '#127a6a'), 4.5) + ln(`M${P(100 + sd * 46, 140)} L${P(100 + sd * 30, 142)}`, RG_GOLD, 3);
    body += ci(100 + sd * 40, 146, 8, cel(c.dk, c.dks), 4) + ci(100 + sd * 40, 146, 2.8, RG_JADE, 0);
  }
  // Đầu: vòng trán vàng ngọc, mày bạc dài, chòm râu
  head += rgPandaHead(100, 74, 33, 27, c, { er: 12, eye: (x, y, sd) => rgGlowRim(x + sd * 1, y + 1, 6.6) + eye(x + sd * 1, y + 1, 6.6, 6.2, sd, { lid: 1, skin: c.dk, iris: '#d6ff6a', bw: 0, brow: false }) });
  head += pa('M70,60 Q100,46 130,60 L130,66 Q100,54 70,66 Z', 'url(#gGold)', 3.2) + pa('M100,48 L106,56 L100,64 L94,56 Z', cel('#7dffd0', '#1fae8a'), 2.6);
  for (const sd of [-1, 1]) head += pa(`M${P(100 + sd * 6, 68)} Q${P(100 + sd * 22, 62)} ${P(100 + sd * 32, 66)} Q${P(100 + sd * 44, 74)} ${P(100 + sd * 46, 88)} Q${P(100 + sd * 36, 74)} ${P(100 + sd * 22, 70)} Z`, '#f4f4ff', 2.6);
  head += pa('M92,96 Q100,100 108,96 Q106,108 100,116 Q94,108 92,96 Z', '#f4f4ff', 2.6) + ln('M95,92 Q100,95 105,92', OL, 2.8);
  front += [[24, 160, 2.4, 0], [176, 160, 2.6, .8], [36, 44, 2.2, 1.4], [164, 40, 2.4, .5]].map(([x, y, r, d]) => rgFly(x, y, r, d, '#b6ff8a')).join('');
  return { back, body, head, front, anc: rgNeo([100, 56, 54], [100, 75, 50], [100, 98, 40], [100, 96, 56, 56], [100, 118, 52, 40]) };
}

/* ---------- BÓNG ĐÊM ---------- */
// v3: mỗi dạng một dáng riêng (bé con → thiếu niên → trưởng thành → tối thượng), không còn chung khung RIG.
// Thân sáng hơn nền #1a1250, có viền sáng (rim light) màu nhấn, mắt và hoa văn phát sáng.
// draw(f, g, c) vẫn giữ chữ ký cũ nhưng không dùng g = RIG[f]: mỗi dạng là một hàm vẽ riêng (batF1..4, catF1..4, owlF1..4, panF1..4).
// Mỗi dạng trả thêm `rig` = tâm và bán kính đầu thật (kèm tên tương đương fxg/geo/g và anc.halo) cho hiệu ứng hào quang.
// Tên toàn cục mới đều có tiền tố nb / bat / cat / owl / pan / CAT_.
// Ngọn lửa ma tím (giữ từ bản cũ)
const ghostFlame = (x, y, h, w, tilt = 0) => flame(x, y, h, w, tilt, true, 3.5).replace('url(#gFlame)', 'url(#gShadowFire)').replace('#fff59a', '#ffd6fb');
const moonCrest = (x, y, r) => pa(`M${P(x - r * .2, y - r)} A${f1(r)},${f1(r)} 0 1 0 ${P(x + r * .9, y + r * .4)} A${f1(r * .78)},${f1(r * .78)} 0 1 1 ${P(x - r * .2, y - r)} Z`, 'url(#gGold)', 3.5);

/* ----- Đồ dùng riêng của hệ ----- */
const nbE = (cx, cy, rx, ry) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`;
const nbD = d => `<path d="${d}"/>`;
const nbMir = s => `<g transform="matrix(-1 0 0 1 200 0)">${s}</g>`;
// Vẫy nhẹ quanh điểm (x, y) (dùng hoạt ảnh wag sẵn có của .pt)
const nbSwing = (s, x, y, dl = 0) => `<g class="pt" style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px;animation-delay:-${dl}s">${s}</g>`;
const nbFloat = (s, dl = 0) => `<g class="float" style="animation-delay:-${dl}s">${s}</g>`;
// Viền sáng hình lưỡi liềm bám mép elip, từ góc a1 tới a2 (độ, 0 = phải, 90 = dưới), dày t
function nbRim(cx, cy, rx, ry, a1, a2, t, col) {
  const o = [], i = [];
  for (let k = 0; k <= 12; k++) {
    const u = k / 12, a = (a1 + (a2 - a1) * u) * Math.PI / 180, tt = t * Math.pow(Math.sin(Math.PI * u), .7);
    o.push(P(cx + (rx - .6) * Math.cos(a), cy + (ry - .6) * Math.sin(a)));
    i.push(P(cx + (rx - .6 - tt) * Math.cos(a), cy + (ry - .6 - tt) * Math.sin(a)));
  }
  return `<path d="M${o.join(' L')} L${i.reverse().join(' L')} Z" fill="${col}"/>`;
}
// Trăng lưỡi liềm, hai sừng chĩa sang phải trước khi xoay rot
const nbMoon = (cx, cy, r, rot, fill, sw = 3) => pa(`M${P(cx, cy - r)} A${f1(r)},${f1(r)} 0 0 0 ${P(cx, cy + r)} A${f1(r * 1.25)},${f1(r * 1.25)} 0 0 1 ${P(cx, cy - r)} Z`, fill, sw, `transform="rotate(${rot} ${f1(cx)} ${f1(cy)})"`);
// Sao 4 cánh phát sáng (không viền) và có viền
const nbStar = (x, y, r, col = '#fff6c4', cls = '', dl = 0) => spark4(x, y, r, col, 0, cls, dl);
// Mắt to tròn dễ thương: tròng màu, nửa trên đậm, đáy sáng, 2 chấm sáng, mi trên dày
function nbEyeBig(cx, cy, rx, ry, side, iris, irisD, irisL, o = {}) {
  let s = '';
  if (o.glow) s += el(cx, cy, rx + 4, ry + 4, o.glow, 0, 'opacity=".35"');
  s += el(cx, cy, rx, ry, iris, 3.5) + nbRim(cx, cy, rx, ry, 182, 358, ry * .55, irisD) + nbRim(cx, cy, rx, ry, 35, 145, ry * .28, irisL);
  const px = cx - side * rx * .1, py = cy + ry * .08;
  s += o.slit ? el(px, py, rx * .2, ry * .6, OL, 0) : el(px, py, rx * .46, ry * .5, OL, 0);
  s += el(px - rx * .28, py - ry * .36, rx * .3, ry * .27, '#fff', 0) + ci(px + rx * .3, py + ry * .34, rx * .13, '#fff', 0);
  s += ln(`M${P(cx - side * rx * .15, cy - ry * 1.02)} Q${P(cx + side * rx * .85, cy - ry * .95)} ${P(cx + side * rx * 1.22, cy - ry * .5)}`, OL, o.lash ?? 3.6);
  return s;
}
// Miệng cười mỉm có 2 răng nanh nhỏ
function nbFangs(cx, cy, w, fl = 4) {
  const y = cy + w * .22;
  return ln(`M${P(cx - w, cy)} Q${P(cx, cy + w * .55)} ${P(cx + w, cy)}`, OL, 2.8) +
    pa(`M${P(cx - w * .45 - 1.6, y)} l1.6,${fl} l1.6,${-fl + .4} Z M${P(cx + w * .45 - 1.6, y)} l1.6,${fl} l1.6,${-fl + .4} Z`, '#fff', 1.3);
}
// Dơi nhỏ bay (dạng 4 của Dơi Đêm)
const nbMiniBat = (x, y, s, col, rot = 0) => `<path transform="translate(${f1(x)} ${f1(y)}) rotate(${rot}) scale(${s})" d="M-2,-2 L-2.8,-6.5 L-.8,-3.8 L.8,-3.8 L2.8,-6.5 L2,-2 C6,-5 11,-6.5 16,-3 Q12,-1 12,3 Q9.5,.6 7,3.2 Q5,.8 3,4 L0,6 L-3,4 Q-5,.8 -7,3.2 Q-9.5,.6 -12,3 Q-12,-1 -16,-3 C-11,-6.5 -6,-5 -2,-2 Z" fill="${col}" stroke="${OL}" stroke-width="${f1(2.2 / s)}" stroke-linejoin="round"/>`;
// Hiệu ứng trang trí: bỏ ở trại chung (PET_LITE) cho nhẹ máy
const nbFx = s => PET_LITE ? '' : s;
// Khói mờ cuộn quanh chân: dải mây thấp có cuộn xoáy + vài hạt khói bay lên
function nbSmoke(cx, cy, w, col, colD, rim, n = 5) {
  let s = '';
  for (let i = 0; i < n; i++) { const t = i / (n - 1), r = 8 + Math.sin(t * Math.PI) * 5; s += nbE(cx - w / 2 + t * w, cy - Math.sin(t * Math.PI) * 4 - (i % 2) * 3, r * 1.2, r * .78); }
  let o = `<g opacity=".82">${bl(s, lin(col, colD), 3)}</g>`;
  o += ln(`M${P(cx - w * .34, cy)} q4,-7 10,-2 q-4,0 -3,4 M${P(cx + w * .16, cy - 3)} q5,-7 11,-2 q-4,0 -3,4`, rim, 2.2, 'opacity=".9"');
  o += nbFx([[-.42, -14, 4], [.38, -18, 3.4], [.05, -24, 2.6]].map(([k, dy, r], i) => `<g class="ember" style="animation-delay:-${i * .8}s">${ci(cx + k * w, cy + dy, r, col, 2)}</g>`).join(''));
  return o;
}
// Gắn hình học đầu thật cho hiệu ứng hào quang: `rig` (và các tên tương đương `fxg`, `geo`, `g`, `anc.halo` để khớp mọi bản vá chung)
function nbOut(r) {
  const g = r.rig; r.fxg = r.geo = r.g = g;
  r.anc.halo = [g.hx ?? 100, f1(g.hy - g.hry - 8), f1(g.hrx * .7)];
  return r;
}
// Thu/phóng cả dạng quanh điểm chân (100, 188), neo trang phục và rig co theo
function nbFit(r, k) {
  if (k === 1) return r;
  const T = s => s ? `<g transform="matrix(${k} 0 0 ${k} ${f1(100 * (1 - k))} ${f1(188 * (1 - k))})">${s}</g>` : '', X = x => f1(100 + (x - 100) * k), Y = y => f1(188 + (y - 188) * k), anc = {};
  for (const n in r.anc) { const v = r.anc[n]; anc[n] = [X(v[0]), Y(v[1]), f1(v[2] * k)].concat(v.length > 3 ? [f1(v[3] * k)] : []); }
  const g = r.rig || {};
  return { back: T(r.back), body: T(r.body), head: T(r.head), front: T(r.front), anc, rig: { hx: X(g.hx ?? 100), hy: Y(g.hy), hrx: f1(g.hrx * k), hry: f1(g.hry * k) } };
}
// Lửa ma xanh bạc hà (Mèo Bóng Ma)
const nbWisp = (x, y, h, w, tilt = 0, sw = 3) => flame(x, y, h, w, tilt, true, sw).replace('url(#gFlame)', lin('#e6fff8', '#62f2cf', '#139c8c')).replace('#fff59a', '#f6fffc');
// Đốm lửa ma lơ lửng có quầng sáng
const nbOrb = (x, y, s, dl = 0) => nbFx(nbFloat(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(11 * s)}" fill="#62f2cf" opacity=".22"/>` + nbWisp(x, y + 7 * s, 20 * s, 13 * s, 2, 2.6), dl));

/* ===== DƠI ĐÊM: kén bông → dơi tai to đang bay → dơi sải cánh trăng → chúa dơi áo choàng cánh ===== */
PET_SPECS.bat = {
  el: 'shadow',
  c: { b: '#a888ff', s: '#6f4ce0', l: '#f3ebff', ls: '#cdb8ff', mem: '#cf66f2', mems: '#9038c8', bone: '#4f25a0', ear: '#ffa8f0', i: '#ff4fd8', iD: '#a3128c', iL: '#ffc2f4', moon: '#fff1a8', rim: '#ffb8f5' },
  c4: { b: '#7350ea', s: '#3a1fa4', l: '#e6dcff', ls: '#ab93f2', mem: '#9a32e0', mems: '#5c1a9e', sky: '#2a1468', bone: '#2a0f66', ear: '#ff7ae6', i: '#ffd21f', rim: '#ff6fe6' },
  draw(f, g, c) { return nbOut(nbFit([null, batF1, batF2, batF3, batF4][f](c), [1, 1, 1, .96, 1][f])); }
};
// Tai dơi: gốc (x, y), bên sd
function batEar(x, y, sd, h, w, tilt, inner) { return earPointy(x, y, sd, h, w, tilt, null, inner); }

// Dạng 1: dơi con quấn cánh thành cái kén tròn, chỉ ló mặt và đôi tai to
function batF1(c) {
  const fur = cel('#a888ff', '#6f4ce0'), hy = 124;
  let body = '', head = '';
  // Kén cánh: hai cánh quấn kín người, cổ tay nhô lên hai bên vai
  body += bl(nbE(100, 161, 33, 25) + `<circle cx="68" cy="146" r="7"/><circle cx="132" cy="146" r="7"/>` + nbE(91, 185, 6.5, 4) + nbE(109, 185, 6.5, 4), cel(c.mem, c.mems), 5);
  body += ln('M68,146 L88,166 M68,146 L80,180', c.bone, 2.6, 'opacity=".7"');
  // Cánh phải phủ lên, mép răng cưa ở giữa
  body += pa('M126,140 Q110,140 104,149 Q96,156 102,163 Q94,170 101,176 Q93,181 97,185.6 A33,25 0 0 0 126,140 Z', cel('#dd84f7', c.mems), 3.5);
  body += ln('M132,146 L104,150 M132,146 L102,163 M132,146 L101,176', c.bone, 2.6) + nbRim(100, 161, 33, 25, -45, 55, 3, c.rim);
  body += ci(68, 146, 4.2, c.bone, 0) + ci(132, 146, 4.2, c.bone, 0);
  body += pa('M64,142 L60,131 L69,139 Z M136,142 L140,131 L131,139 Z', '#fff', 2.4);
  body += el(91, 186, 6, 3.4, '#a888ff', 0) + el(109, 186, 6, 3.4, '#a888ff', 0);
  // Đầu + tai to + túm lông
  const L = batEar(82, hy - 14, -1, 34, 26, 28, c.ear), R = batEar(118, hy - 14, 1, 34, 26, 28, c.ear);
  head += bl(nbE(100, hy, 31, 26) + nbD(L.outer) + nbD(R.outer) + nbD(`M92,${hy - 23} Q93,${hy - 37} 100,${hy - 31} Q106,${hy - 40} 109,${hy - 23} Z`), fur);
  head += L.inner + R.inner;
  head += nbRim(100, hy, 31, 26, -35, 75, 3.2, c.rim);
  head += el(100, hy + 11, 18, 11.5, c.l, 0);
  head += el(79, hy + 9, 5.5, 3.2, '#ff6fd0', 0, 'opacity=".6"') + el(121, hy + 9, 5.5, 3.2, '#ff6fd0', 0, 'opacity=".6"');
  head += nbEyeBig(87, hy - 1, 9, 10.5, -1, c.i, c.iD, c.iL) + nbEyeBig(113, hy - 1, 9, 10.5, 1, c.i, c.iD, c.iL);
  head += pa(`M97,${hy + 8} Q100,${hy + 6.5} 103,${hy + 8} L100,${hy + 11} Z`, OL, 0);
  head += ln(`M94,${hy + 13} Q97,${hy + 16} 100,${hy + 13.5} Q103,${hy + 16} 106,${hy + 13}`, OL, 2.6) + pa(`M101.6,${hy + 14.6} l1.6,3.6 l1.6,-3.4 Z`, '#fff', 1.4);
  head += nbMoon(102, hy - 16, 4.6, -30, c.moon, 2) + hl(86, hy - 15, 7, 3.4);
  return { back: '', body, head, front: '', anc: { head: [100, hy - 25, 46], eyes: [100, hy - 1, 40], neck: [100, 147, 42], back: [100, 142, 54, 40], body: [100, 166, 48, 36] }, rig: { hy, hrx: 31, hry: 26 } };
}

// Dạng 2: dơi tai to đang bay, cánh dựng chữ V
function batF2(c) {
  const fur = cel('#9a76fc', '#6440d8'), hy = 96;
  let back = '', body = '', head = '';
  const wing = pa('M114,113 Q128,92 144,84 L160,58 Q163,76 172,88 Q156,99 158,117 Q138,110 116,131 Z', cel('#c862f0', '#8a34c4'), 5) +
    ln('M144,84 L172,88 M144,84 L158,117 M116,113 Q130,93 144,84 L160,58', c.bone, 3) + ln('M118,108 Q130,92 142,86', c.rim, 2.2, 'opacity=".9"') +
    pa('M144,85 L139,74 L149,80 Z', '#fff', 2.2);
  back += nbSwing(wing, 114, 118) + nbMir(nbSwing(wing, 114, 118));
  // Chân lủng lẳng
  body += bl(`<path d="${capsule(93, 142, 90, 156, 4.5, 4)}"/><path d="${capsule(107, 142, 110, 156, 4.5, 4)}"/>`, '#7d58ee', 4.5);
  body += pa('M86,158 l2,4 l2,-3.4 l2,3.4 l2,-4 Z M106,158 l2,4 l2,-3.4 l2,3.4 l2,-4 Z', '#fff', 1.6);
  body += bl(nbE(100, 130, 19, 19), fur) + el(100, 134, 11, 11.5, cel(c.l, c.ls), 0) + nbRim(100, 130, 19, 19, -40, 60, 2.6, c.rim);
  body += pa('M83,114 L88,124 L93,118 L97,127 L100,119 L103,127 L107,118 L112,124 L117,114 Z', cel('#efe6ff', '#bba6ff'), 3);
  // Đầu
  const L = batEar(83, hy - 16, -1, 40, 26, 20, c.ear), R = batEar(117, hy - 16, 1, 40, 26, 20, c.ear);
  head += bl(nbE(100, hy, 29, 25) + nbD(L.outer) + nbD(R.outer) + nbD(`M95,${hy - 23} L100,${hy - 33} L105,${hy - 23} Z`), fur);
  head += L.inner + R.inner + nbRim(100, hy, 29, 25, -30, 75, 3, c.rim);
  head += el(100, hy + 12, 15, 9, c.l, 0);
  head += el(80, hy + 9, 5, 3, '#ff6fd0', 0, 'opacity=".5"') + el(120, hy + 9, 5, 3, '#ff6fd0', 0, 'opacity=".5"');
  head += eyes2(100, hy - 1, 12.5, 8, 8.8, { skin: '#9a76fc', iris: c.i, lid: .3, bw: 4.6 });
  head += pa(`M97.5,${hy + 7} Q100,${hy + 5.5} 102.5,${hy + 7} L100,${hy + 10} Z`, OL, 0);
  head += pa(`M92,${hy + 12} Q100,${hy + 22} 108,${hy + 12} Q100,${hy + 15} 92,${hy + 12} Z`, '#ff6fae', 2.6) + pa(`M94,${hy + 12.6} l1.8,4 l1.8,-3.4 Z M102.4,${hy + 13.2} l1.8,3.4 l1.8,-4 Z`, '#fff', 1.3);
  head += nbMoon(102, hy - 16, 6, -30, c.moon, 2.2) + hl(86, hy - 14, 6.5, 3.2);
  return { back, body, head, front: '', anc: { head: [100, hy - 25, 44], eyes: [100, hy - 1, 38], neck: [100, 115, 32], back: [100, 112, 40, 34], body: [100, 129, 34, 34] }, rig: { hy, hrx: 29, hry: 25 } };
}

// Dạng 3: dơi đứng sải cánh ngang, màng cánh có trăng lưỡi liềm
function batF3(c) {
  const fur = cel('#8a66f4', '#5232c8'), hy = 70;
  let back = '', body = '', head = '';
  const wing = pa('M112,102 Q130,86 150,86 L180,64 Q170,86 186,104 Q166,112 170,136 Q152,132 144,150 Q130,138 112,146 Z', cel('#b955ee', '#7a2bb8'), 5) +
    ln('M150,86 L186,104 M150,86 L170,136 M150,86 L144,150 M114,101 Q130,88 150,86 L180,64', c.bone, 3.2) +
    ln('M116,99 Q130,89 148,87.5 L176,68', c.rim, 2.2, 'opacity=".9"') +
    nbMoon(167, 116, 8.5, 25, c.moon, 2.2) + nbStar(160, 101, 3.6, '#fff6c4') + nbStar(132, 130, 3, '#fff6c4') + nbStar(176, 92, 2.6, '#ffd6fb') +
    pa('M150,87 L146,76 L156,82 Z', '#fff', 2.2);
  back += nbSwing(wing, 112, 104) + nbMir(nbSwing(wing, 112, 104, .7));
  // Chân thon
  for (const sd of [-1, 1]) body += bl(`<path d="${capsule(100 + sd * 8, 150, 100 + sd * 10, 178, 7, 5)}"/>` + nbE(100 + sd * 12, 184, 9, 4.6), fur, 5);
  body += pa('M80,186 l2,4.4 l2,-4 Z M116,186 l2,4.4 l2,-4 Z', '#fff', 1.5);
  // Thân thon
  body += pa('M84,104 C84,95 116,95 116,104 C118,120 112,132 114,146 C116,157 110,164 100,164 C90,164 84,157 86,146 C88,132 82,120 84,104 Z', fur, 5.5);
  body += el(100, 134, 9, 19, cel(c.l, c.ls), 0) + hl(90, 108, 4, 6, -15, .4);
  body += ln('M112,108 C115,122 110,134 112,148', c.rim, 2.4);
  body += pa('M80,96 L86,108 L91,101 L95,112 L100,103 L105,112 L109,101 L114,108 L120,96 Q100,104 80,96 Z', cel('#efe6ff', '#b39bff'), 3);
  // Đầu
  const L = batEar(84, hy - 16, -1, 42, 24, 22, c.ear), R = batEar(116, hy - 16, 1, 42, 24, 22, c.ear);
  head += bl(nbE(100, hy, 28, 24) + nbD(L.outer) + nbD(R.outer) + nbD(`M96,${hy - 22} L100,${hy - 30} L104,${hy - 22} Z`), fur);
  head += L.inner + R.inner + nbRim(100, hy, 28, 24, -30, 75, 3, c.rim);
  head += el(100, hy + 12, 13.5, 8.5, c.l, 0);
  head += eyes2(100, hy - 1, 11.5, 8, 8, { skin: '#8a66f4', iris: c.i, lid: .82 });
  head += pa(`M97.5,${hy + 7} Q100,${hy + 5.5} 102.5,${hy + 7} L100,${hy + 10} Z`, OL, 0);
  head += nbFangs(100, hy + 13, 8, 4.2);
  head += nbMoon(102, hy - 15, 7, -30, 'url(#gGold)', 2.4) + hl(87, hy - 13, 6, 3);
  return { back, body, head, front: '', anc: { head: [100, hy - 23, 42], eyes: [100, hy - 1, 36], neck: [100, 99, 34], back: [100, 100, 36, 60], body: [100, 128, 30, 56] }, rig: { hy, hrx: 28, hry: 24 } };
}

// Dạng 4: chúa dơi đêm, cánh dựng thành áo choàng bầu trời sao, vương miện trăng, đàn dơi nhỏ bay quanh
function batF4(c) {
  const fur = cel(c.b, c.s), hy = 66;
  let back = '', body = '', head = '', front = '';
  back += nbFx(`<circle cx="100" cy="${hy}" r="46" fill="#c78bff" opacity=".2"/>`);
  const wing = pa('M112,100 Q124,62 150,46 L190,16 Q178,48 196,78 Q176,96 188,130 Q164,138 168,176 Q140,160 116,172 Z', lin('#a24cf0', '#5a1fb8', '#2a1270'), 5) +
    ln('M150,46 L196,78 M150,46 L188,130 M150,46 L168,176', '#3a137e', 3.4) + ln('M113,98 Q124,64 150,46 L190,16', c.bone, 5) + ln('M116,93 Q126,64 149,49 L186,21', '#d9a8ff', 2) +
    ln('M190,16 Q178,48 196,78 Q176,96 188,130 Q164,138 168,176', c.rim, 2.6) +
    nbStar(170, 64, 3.6) + nbStar(180, 102, 2.8, '#ffd6fb') + nbStar(162, 122, 3.2) + nbStar(138, 96, 2.4) + nbStar(156, 156, 2.6, '#ffd6fb') + nbStar(132, 140, 2) + nbMoon(168, 86, 6.5, 20, '#fff1a8', 2.2) +
    pa('M150,47 L143,33 L157,40 Z', '#eef0ff', 2.4);
  back += nbSwing(wing, 112, 104) + nbMir(nbSwing(wing, 112, 104, .7));
  // Chân
  for (const sd of [-1, 1]) body += bl(`<path d="${capsule(100 + sd * 8, 148, 100 + sd * 10, 178, 7.5, 5.5)}"/>` + nbE(100 + sd * 12, 184, 9.5, 4.8), fur, 5);
  body += pa('M80,186 l2,4.4 l2,-4 Z M116,186 l2,4.4 l2,-4 Z', '#eef0ff', 1.5);
  // Thân, cổ áo lông bạc, mề đay trăng
  body += pa('M83,102 C83,93 117,93 117,102 C119,120 113,132 115,146 C117,158 110,165 100,165 C90,165 83,158 85,146 C87,132 81,120 83,102 Z', fur, 5.5);
  body += pa('M100,104 L111,118 L105,150 Q100,156 95,150 L89,118 Z', cel(c.l, c.ls), 3) + ln('M113,108 C116,122 111,134 113,148', c.rim, 2.4);
  body += pa('M74,90 L82,106 L88,98 L93,111 L100,100 L107,111 L112,98 L118,106 L126,90 Q100,102 74,90 Z', cel('#f4f5ff', '#a9b0e0'), 3.2);
  body += nbMoon(102, 122, 7.5, -30, cel('#f4f5ff', '#a9b0e0'), 2.6) + ci(99, 123, 2.8, '#ff4fd8', 1.6);
  front += nbSmoke(100, 184, 96, '#c9a8ff', '#7a4ad8', '#f0e4ff', 6);
  // Đầu, tai dài, vương miện trăng bạc
  const L = batEar(85, hy - 16, -1, 44, 23, 30, c.ear), R = batEar(115, hy - 16, 1, 44, 23, 30, c.ear);
  head += bl(nbE(100, hy, 27, 23) + nbD(L.outer) + nbD(R.outer) + nbD(`M73,${hy + 4} L63,${hy + 11} L76,${hy + 13} Z M127,${hy + 4} L137,${hy + 11} L124,${hy + 13} Z`), fur);
  head += L.inner + R.inner + nbRim(100, hy, 27, 23, -30, 75, 3, c.rim);
  head += el(100, hy + 11, 13, 8, c.l, 0);
  head += el(89, hy - 1, 10, 9, '#ff4fd8', 0, 'opacity=".3"') + el(111, hy - 1, 10, 9, '#ff4fd8', 0, 'opacity=".3"');
  head += eyes2(100, hy - 1, 11, 7.6, 7, { skin: c.b, iris: c.i, white: '#fff6c8', lid: 1, slit: true });
  head += pa(`M97.5,${hy + 6} Q100,${hy + 4.5} 102.5,${hy + 6} L100,${hy + 9} Z`, OL, 0);
  head += nbFangs(100, hy + 12.5, 8, 4.8);
  head += hl(88, hy - 12, 5.5, 2.8);
  head += pa(`M83,${hy - 18} L85,${hy - 33} L92,${hy - 26} L100,${hy - 44} L108,${hy - 26} L115,${hy - 33} L117,${hy - 18} Q100,${hy - 13} 83,${hy - 18} Z`, cel('#f4f5ff', '#a9b0e0'), 3.5);
  head += nbMoon(103, hy - 33, 7, -90, 'url(#gGold)', 2.4) + ci(100, hy - 21, 3, '#ff4fd8', 1.8) + ci(90, hy - 20.5, 1.8, '#33e1ff', 1.2) + ci(110, hy - 20.5, 1.8, '#33e1ff', 1.2);
  // Đàn dơi nhỏ
  front += nbFx([[30, 44, .95, -12], [170, 34, .8, 10], [20, 118, .7, -6], [182, 150, .75, 8], [44, 166, .62, -4]].map(([x, y, s, r], i) => nbFloat(nbMiniBat(x, y, s, i % 2 ? '#e6d8ff' : '#cfa8ff', r), i * .45)).join(''));
  return { back, body, head, front, anc: { head: [100, hy - 23, 40], eyes: [100, hy - 1, 34], neck: [100, 97, 34], back: [100, 98, 38, 66], body: [100, 128, 30, 56] }, rig: { hy, hrx: 27, hry: 23 } };
}

/* ===== MÈO BÓNG MA: mèo con ngồi → mèo thiếu niên dạo bước, 2 đuôi khói → mèo ma nửa thân khói → thần mèo đêm quạt đuôi khói ===== */
PET_SPECS.cat = {
  el: 'shadow',
  c: { b: '#8a93e6', s: '#5a62b8', l: '#eef0ff', ls: '#c3c8f5', ear: '#ff9ed2', i: '#b6ff3b', iD: '#3f9a12', iL: '#efffb0', nose: '#ff7ab8', rim: '#8ffce0' },
  c4: { b: '#5c62cc', s: '#2f3290', l: '#d6dbff', ls: '#9aa2ea', i: '#d8ff7a', rim: '#7dffd8' },
  draw(f, g, c) { return nbOut(nbFit([null, catF1, catF2, catF3, catF4][f](c), [1, 1, .86, 1, 1][f])); }
};
const catEar = (x, y, sd, h, w, tilt, inner) => earPointy(x, y, sd, h, w, tilt, null, inner);
// Râu mèo
const catWhisk = (cx, cy, w, col = '#e6e8ff') => ln(`M${P(cx - w, cy)} l-13,-3 M${P(cx - w, cy + 5)} l-13,3 M${P(cx + w, cy)} l13,-3 M${P(cx + w, cy + 5)} l13,3`, col, 2);
// Dấu lửa ma trên trán
const catMark = (x, y, h) => pa(`M${P(x, y - h)} Q${P(x + h * .55, y - h * .2)} ${P(x, y)} Q${P(x - h * .55, y - h * .2)} ${P(x, y - h)} Z`, '#7dffd8', 2) + ci(x, y - h * .3, h * .16, '#f6fffc', 0);

// Dạng 1: mèo con ngồi, đuôi cuộn bốc làn khói ma nhẹ
function catF1(c) {
  const fur = cel('#8a93e6', '#5a62b8'), hy = 122;
  let back = '', body = '', head = '';
  back += tube('M118,180 C146,190 150,166 142,152', '#7d86dc', 9, 4.5) + nbWisp(141, 152, 15, 10, -2, 2.6);
  back += nbFx(`<g class="ember">${ci(146, 132, 2.6, '#c8fff0', 1.6)}</g>`);
  body += bl(nbD('M78,186 C71,170 76,150 88,142 L112,142 C124,150 129,170 122,186 Q100,190 78,186 Z') + nbE(90, 184, 8.5, 5.5) + nbE(110, 184, 8.5, 5.5), fur, 5);
  body += pa('M88,145 Q100,151 112,145 L109,163 L105,159 L100,166 L95,159 L91,163 Z', cel(c.l, c.ls), 0);
  body += ln('M87,186 v-3.5 M93,186 v-3.5 M107,186 v-3.5 M113,186 v-3.5', OL, 2.2) + nbRim(100, 165, 26, 23, -40, 40, 2.8, c.rim);
  const L = catEar(80, hy - 16, -1, 27, 26, 10, c.ear), R = catEar(120, hy - 16, 1, 27, 26, 10, c.ear);
  let fl = ''; for (const sd of [-1, 1]) fl += nbD(`M${P(100 + sd * 30, hy + 2)} L${P(100 + sd * 38, hy + 9)} L${P(100 + sd * 29, hy + 14)} Z`);
  head += bl(nbE(100, hy, 33, 27) + nbD(L.outer) + nbD(R.outer) + fl, fur);
  head += L.inner + R.inner + nbRim(100, hy, 33, 27, -30, 70, 3.2, c.rim);
  head += el(100, hy + 13, 14, 9, c.l, 0);
  head += el(78, hy + 10, 5.5, 3.2, '#ff7ab8', 0, 'opacity=".5"') + el(122, hy + 10, 5.5, 3.2, '#ff7ab8', 0, 'opacity=".5"');
  head += nbEyeBig(86, hy, 9.5, 11, -1, c.i, c.iD, c.iL) + nbEyeBig(114, hy, 9.5, 11, 1, c.i, c.iD, c.iL);
  head += pa(`M97,${hy + 9} Q100,${hy + 7.5} 103,${hy + 9} L100,${hy + 12} Z`, c.nose, 1.8);
  head += ln(`M94.5,${hy + 14} Q97,${hy + 17} 100,${hy + 13.5} Q103,${hy + 17} 105.5,${hy + 14}`, OL, 2.4) + catWhisk(100, hy + 9, 21);
  head += catMark(100, hy - 15, 9) + hl(85, hy - 14, 7, 3.4);
  return { back, body, head, front: '', anc: { head: [100, hy - 26, 48], eyes: [100, hy, 42], neck: [100, 146, 40], back: [100, 144, 46, 40], body: [100, 166, 42, 40] }, rig: { hy, hrx: 33, hry: 27 } };
}

// Dạng 2: mèo thiếu niên dạo bước nhìn nghiêng, một chân trước nhấc lên, hai đuôi khói dựng cao
function catF2(c) {
  const fur = cel('#8089e0', '#4f57ae'), hx = 56, hy = 114;
  let back = '', body = '', head = '';
  back += nbSwing(tube('M144,124 C164,118 150,92 160,72', '#7079d0', 9.5, 4.5) + nbWisp(160, 76, 20, 14, 1), 144, 124) +
    nbSwing(tube('M148,130 C176,132 170,106 180,90', '#7079d0', 9.5, 4.5) + nbWisp(180, 94, 18, 13, 3), 148, 130, .6);
  // Thân ngang thon, chân trước nhấc lên một bước
  body += bl(`<path d="${capsule(84, 150, 86, 182, 6.5, 5.5)}"/><path d="${capsule(136, 146, 142, 182, 7, 5.5)}"/>` + nbE(88, 185, 7.5, 4.4) + nbE(145, 185, 8, 4.4), cel('#5f68c0', '#3a4090'), 4.5);
  body += bl(nbD('M60,134 C62,118 82,114 100,116 C118,118 136,110 148,120 C158,130 154,152 140,156 L84,158 C68,158 58,148 60,134 Z') +
    `<path d="${capsule(72, 150, 66, 170, 7, 6)}"/><path d="${capsule(66, 170, 72, 180, 6, 5.5)}"/>` + nbE(74, 182, 8, 4.6) + `<path d="${capsule(126, 150, 124, 182, 7.5, 6)}"/>` + nbE(127, 185, 8.5, 4.6), fur, 5);
  body += ln('M70,124 C86,116 104,121 120,117 C134,113 146,116 150,126', c.rim, 2.6) + pa('M68,146 Q86,154 104,150 Q86,160 70,154 Z', c.l, 0, 'opacity=".5"') + hl(96, 122, 9, 3, -10, .45);
  body += ln('M71,184.5 v-3 M77,184.5 v-3 M124,187 v-3 M130,187 v-3', OL, 1.8);
  // Đầu quay ra phía trước
  const L = catEar(hx - 17, hy - 15, -1, 27, 22, 6, c.ear), R = catEar(hx + 17, hy - 15, 1, 27, 22, 6, c.ear);
  let fl = ''; for (const sd of [-1, 1]) fl += nbD(`M${P(hx + sd * 23, hy + 3)} L${P(hx + sd * 31, hy + 10)} L${P(hx + sd * 22, hy + 14)} Z`);
  head += bl(nbE(hx, hy, 27, 23) + nbD(L.outer) + nbD(R.outer) + fl, fur);
  head += L.inner + R.inner + nbRim(hx, hy, 27, 23, -30, 70, 3, c.rim);
  head += el(hx, hy + 12, 11, 7.5, c.l, 0);
  head += eyes2(hx, hy - 1, 10, 7.8, 8.6, { skin: '#8089e0', iris: c.i, lid: .42, slit: true, bw: 4.6 });
  head += pa(`M${hx - 2.5},${hy + 8} Q${hx},${hy + 6.5} ${hx + 2.5},${hy + 8} L${hx},${hy + 10.5} Z`, c.nose, 1.6);
  head += ln(`M${hx - 5.5},${hy + 13} Q${hx - 2.5},${hy + 16} ${hx},${hy + 12.5} Q${hx + 2.5},${hy + 16} ${hx + 5.5},${hy + 13}`, OL, 2.4) + pa(`M${hx + 1.5},${hy + 14} l1.5,3.4 l1.5,-3.2 Z`, '#fff', 1.3) + catWhisk(hx, hy + 8, 16);
  head += catMark(hx, hy - 13, 9.5) + hl(hx - 13, hy - 12, 6, 3);
  return { back, body, head, front: '', anc: { head: [hx, hy - 22, 38], eyes: [hx, hy - 1, 34], neck: [hx + 6, 134, 30], back: [106, 118, 56, 34], body: [74, 146, 26, 24] }, rig: { hx, hy, hrx: 27, hry: 23 } };
}

// Dạng 3: mèo bóng ma lơ lửng, nửa thân dưới tan thành khói trong suốt, đốm lửa ma bay quanh
function catF3(c) {
  const fur = cel('#7882da', '#434aa2'), hy = 64;
  let back = '', body = '', head = '', front = '';
  // Thân khói trong suốt cuộn sang phải
  const ghost = 'M78,116 C68,148 86,174 116,174 C142,174 160,162 160,144 C160,132 148,128 144,138 C140,148 152,152 154,144 C150,162 130,162 118,158 C102,152 118,136 122,116 Z';
  back += pa(ghost, lin('#d2daff', '#97a2f2', '#6670d0'), 0, 'opacity=".7"') + ln(ghost, c.rim, 2.8) + ln('M90,138 q10,12 24,10 M108,164 q14,5 26,-2 M130,150 q8,-2 12,-8', '#f0fffb', 2, 'opacity=".75"');
  back += nbSwing(tube('M114,120 C140,120 150,100 154,82', '#6c76cc', 7.5, 4) + nbWisp(154, 86, 17, 12, 2), 114, 120);
  // Thân trên đặc
  body += bl(nbD('M76,98 C76,86 124,86 124,98 C127,112 122,124 120,134 Q100,142 80,134 C78,124 73,112 76,98 Z'), fur, 5.5);
  body += pa('M88,96 Q100,103 112,96 L108,124 Q100,130 92,124 Z', cel(c.l, c.ls), 0) + nbRim(100, 112, 24, 26, -40, 45, 2.8, c.rim);
  // Hai chân trước co lại trước ngực như hồn ma
  body += bl(`<path d="${capsule(83, 102, 87, 120, 7, 6.5)}"/><path d="${capsule(117, 102, 113, 120, 7, 6.5)}"/>` + nbE(88, 124, 8, 6.5) + nbE(112, 124, 8, 6.5), fur, 4.5);
  body += ln('M84.5,128 v-3 M90,128.5 v-3 M110,128.5 v-3 M115.5,128 v-3', OL, 1.8) + catMark(100, 114, 8);
  // Đầu
  const L = catEar(81, hy - 15, -1, 34, 24, 12, c.ear), R = catEar(119, hy - 15, 1, 34, 24, 12, c.ear);
  let fl = ''; for (const sd of [-1, 1]) fl += nbD(`M${P(100 + sd * 26, hy + 2)} L${P(100 + sd * 37, hy + 8)} L${P(100 + sd * 27, hy + 12)} L${P(100 + sd * 34, hy + 18)} L${P(100 + sd * 22, hy + 20)} Z`);
  head += bl(nbE(100, hy, 30, 25) + nbD(L.outer) + nbD(R.outer) + fl, fur);
  head += L.inner + R.inner + nbRim(100, hy, 30, 25, -30, 70, 3, c.rim);
  head += el(100, hy + 12, 12, 8, c.l, 0);
  head += eyes2(100, hy - 1, 11.5, 8, 8.4, { skin: '#7882da', iris: c.i, lid: .68, slit: true, bw: 5.5 });
  head += pa(`M97.5,${hy + 8} Q100,${hy + 6.5} 102.5,${hy + 8} L100,${hy + 10.5} Z`, c.nose, 1.6);
  head += ln(`M94.5,${hy + 13} Q97.5,${hy + 16} 100,${hy + 12.5} Q102.5,${hy + 16} 105.5,${hy + 13}`, OL, 2.4) + pa(`M101.6,${hy + 14} l1.5,3.6 l1.5,-3.4 Z`, '#fff', 1.2) + catWhisk(100, hy + 8, 17);
  head += nbWisp(100, hy - 14, 16, 11, 1, 2.4) + hl(86, hy - 13, 6, 3);
  front += nbOrb(38, 70, .85) + nbOrb(166, 56, .7, .7) + nbOrb(42, 150, .75, 1.3) + nbOrb(174, 170, .55, .4);
  return { back, body, head, front, anc: { head: [100, hy - 23, 44], eyes: [100, hy - 1, 40], neck: [100, 94, 38], back: [100, 94, 44, 44], body: [100, 114, 38, 40] }, rig: { hy, hrx: 30, hry: 25 } };
}

// Đuôi khói uốn lượn (khuôn hướng lên, gốc 0,0), xoay theo góc a quanh gốc (x0, y0)
const CAT_TAIL = 'M-9,0 C-19,-26 -3,-44 -10,-62 C-13,-72 -6,-84 3,-86 C-1,-80 0,-74 7,-71 C15,-66 10,-48 12,-34 C14,-20 10,-8 9,0 Z';
function catPlume(x0, y0, a, sc, fill, rim) {
  return `<g transform="translate(${x0} ${y0}) rotate(${f1(a + 90)}) scale(${sc})">` + pa(CAT_TAIL, fill, f1(4 / sc)) +
    ln('M4,-6 C8,-22 4,-40 6,-56 C7,-64 3,-72 4,-78', rim, f1(2 / sc), 'opacity=".75"') + nbWisp(3, -80, 22, 15, 1, f1(2.6 / sc)) + `</g>`;
}
// Dạng 4: thần mèo đêm ngồi lơ lửng trên mây khói, quạt đuôi khói sau lưng, mặt nạ bạc, lửa ma bay quanh
function catF4(c) {
  const fur = cel(c.b, c.s), hy = 62;
  let back = '', body = '', head = '', front = '';
  back += nbFx(`<circle cx="100" cy="104" r="62" fill="#62f2cf" opacity=".1"/>`);
  [-166, -140, -114, -66, -40, -14].forEach((a, i) => {
    back += nbSwing(catPlume(100, 150, a, i % 3 === 1 ? 1.08 : 1, i % 2 ? cel('#4c52b8', '#262a78') : cel('#6a70d8', '#363aa0'), c.rim), 100, 150, i * .3);
  });
  front += nbSmoke(100, 180, 92, '#a9f7e4', '#5a62c8', '#f0fffb', 6);
  // Thân ngồi thẳng kiểu tượng thần
  body += bl(nbE(78, 156, 17, 18) + nbE(122, 156, 17, 18) + nbD('M80,96 C80,85 120,85 120,96 C125,116 122,140 118,164 L82,164 C78,140 75,116 80,96 Z') +
    `<path d="${capsule(91, 120, 91, 168, 7, 6.5)}"/><path d="${capsule(109, 120, 109, 168, 7, 6.5)}"/>` + nbE(90, 170, 8.5, 5.2) + nbE(110, 170, 8.5, 5.2), fur, 5.5);
  body += pa('M100,96 L111,108 L104,136 Q100,142 96,136 L89,108 Z', cel(c.l, c.ls), 0) + ln('M117,100 C121,118 120,140 116,160', c.rim, 2.6) + nbRim(122, 156, 17, 18, -60, 40, 2.6, c.rim) + ln('M86,171.5 v-3 M93,172 v-3 M107,172 v-3 M114,171.5 v-3', OL, 1.8);
  body += pa('M83,92 Q100,104 117,92 L114,99 Q100,110 86,99 Z', cel('#f4f5ff', '#a9b0e0'), 2.6) + pa('M100,104 L105.5,111 L100,119 L94.5,111 Z', '#7dffd8', 2.2) + ci(98.5, 109.5, 1.4, '#fff', 0);
  // Đầu, tai có chỏm lông, mặt nạ bạc
  const L = catEar(82, hy - 14, -1, 38, 22, 14, c.ear), R = catEar(118, hy - 14, 1, 38, 22, 14, c.ear);
  let fl = ''; for (const sd of [-1, 1]) fl += nbD(`M${P(100 + sd * 24, hy + 2)} L${P(100 + sd * 36, hy + 8)} L${P(100 + sd * 26, hy + 12)} L${P(100 + sd * 33, hy + 19)} L${P(100 + sd * 20, hy + 19)} Z`);
  const tip = (x, y, sd) => nbD(`M${P(x, y)} l${sd * 2},-9 l${sd * 3},7 Z`);
  head += bl(nbE(100, hy, 27, 23) + nbD(L.outer) + nbD(R.outer) + fl + tip(70, hy - 47, -1) + tip(130, hy - 47, 1), fur);
  head += L.inner + R.inner + nbRim(100, hy, 27, 23, -30, 70, 3, c.rim);
  head += el(100, hy + 12, 11, 7.5, c.l, 0);
  // Vòng bạc trên trán (trăng + ngọc lửa ma), vạch bạc dưới mắt
  head += el(89, hy - 2, 9.5, 8, '#7dffd8', 0, 'opacity=".3"') + el(111, hy - 2, 9.5, 8, '#7dffd8', 0, 'opacity=".3"');
  head += eyes2(100, hy - 2, 11, 7.4, 6.6, { skin: c.b, iris: c.i, white: '#f4ffd0', lid: 1, slit: true, bw: 5 });
  head += ln(`M76,${hy - 12} Q100,${hy - 24} 124,${hy - 12}`, OL, 6.5) + ln(`M76,${hy - 12} Q100,${hy - 24} 124,${hy - 12}`, '#e6e9ff', 2.6) + ci(83, hy - 16.5, 2, '#7dffd8', 1.4) + ci(117, hy - 16.5, 2, '#7dffd8', 1.4);
  for (const sd of [-1, 1]) head += pa(`M${P(100 + sd * 10, hy + 6)} q${sd * 2},5 ${sd * 7},6 q${sd * -1},-4 ${sd * -7},-6 Z M${P(100 + sd * 16, hy + 5)} q${sd * 3},5 ${sd * 8},5 q${sd * -2},-4 ${sd * -8},-5 Z`, '#e6e9ff', 1.6);
  head += nbMoon(105, hy - 27, 9, -90, 'url(#gGold)', 2.6) + pa(`M100,${hy - 21} L104.5,${hy - 15} L100,${hy - 8} L95.5,${hy - 15} Z`, '#7dffd8', 2.2) + ci(98.8, hy - 16, 1.3, '#fff', 0);
  head += pa(`M97.5,${hy + 8} Q100,${hy + 6.5} 102.5,${hy + 8} L100,${hy + 10.5} Z`, c.nose, 1.6);
  head += ln(`M95,${hy + 13} Q97.5,${hy + 15.5} 100,${hy + 12.5} Q102.5,${hy + 15.5} 105,${hy + 13}`, OL, 2.2) + catWhisk(100, hy + 9, 16, '#bfe9ff');
  front += nbOrb(22, 120, .75) + nbOrb(178, 116, .7, .6) + nbOrb(28, 166, .55, 1.1) + nbOrb(172, 164, .6, .3);
  return { back, body, head, front, anc: { head: [100, hy - 22, 40], eyes: [100, hy - 2, 36], neck: [100, 92, 34], back: [100, 92, 40, 70], body: [100, 122, 34, 56] }, rig: { hy, hrx: 27, hry: 23 } };
}

/* ===== CÚ BÓNG ĐÊM: cục bông tròn → cú non tai nhọn → cú dang cánh hoa văn sao → cú thần trăng ===== */
PET_SPECS.owl = {
  el: 'shadow',
  c: { b: '#5a7cf2', s: '#3450c8', l: '#d6defd', ls: '#a6b4f0', disc: '#f3eeff', discs: '#cbc0f5', beak: '#ffb21f', i: '#ffd21f', iD: '#d98a00', iL: '#fff3a0', star: '#fff1a8', rim: '#9fe8ff', wd: '#2a3a9e' },
  c4: { b: '#3a58da', s: '#1a2e94', i: '#ffe14d', rim: '#9fe8ff' },
  draw(f, g, c) { return nbOut(nbFit([null, owlF1, owlF2, owlF3, owlF4][f](c), [1, .96, 1, .97, 1][f])); }
};
// Viền lông xù quanh hình tròn
function owlFuzz(cx, cy, r, n, b) {
  let d = '';
  for (let k = 0; k < n; k++) {
    const a0 = k / n * 2 * Math.PI, a1 = (k + .5) / n * 2 * Math.PI, a2 = (k + 1) / n * 2 * Math.PI;
    if (!k) d += `M${P(cx + r * Math.cos(a0), cy + r * Math.sin(a0))}`;
    d += ` Q${P(cx + (r + b) * Math.cos(a1), cy + (r + b) * Math.sin(a1))} ${P(cx + r * Math.cos(a2), cy + r * Math.sin(a2))}`;
  }
  return d + 'Z';
}
// Đĩa mặt hình tim, nửa rộng w, nửa cao h
const owlDisc = (cx, cy, w, h) => `M${P(cx, cy - h * .62)} C${P(cx - w * .3, cy - h * 1.05)} ${P(cx - w * 1.02, cy - h * .9)} ${P(cx - w, cy - h * .05)} C${P(cx - w * .98, cy + h * .7)} ${P(cx - w * .35, cy + h * .95)} ${P(cx, cy + h * .62)} C${P(cx + w * .35, cy + h * .95)} ${P(cx + w * .98, cy + h * .7)} ${P(cx + w, cy - h * .05)} C${P(cx + w * 1.02, cy - h * .9)} ${P(cx + w * .3, cy - h * 1.05)} ${P(cx, cy - h * .62)} Z`;
const owlBeak = (x, y, s, c) => pa(`M${P(x - 5 * s, y - 3 * s)} Q${P(x, y - 6 * s)} ${P(x + 5 * s, y - 3 * s)} L${P(x, y + 7 * s)} Z`, cel(c.beak, '#d97a00'), 2.8) + hl(x - 1.5 * s, y - 2.5 * s, 1.6 * s, 1 * s, 0, .8);
const owlFeet = (y, gap, col = '#ffb21f') => [-1, 1].map(sd => { const x = 100 + sd * gap, d = `M${P(x, y - 6)} l-5,6 M${P(x, y - 6)} l0,7 M${P(x, y - 6)} l5,6`; return ln(d, OL, 8) + ln(d, col, 3.6); }).join('');
const owlChev = (cx, cy, rows, col) => { let s = ''; for (let r = 0; r < rows; r++) for (let i = -1; i <= 1; i++) if (r % 2 === 0 || i < 1) s += ln(`M${P(cx + i * 9 - 3 + (r % 2) * 4.5, cy + r * 8)} q3,4 6,0`, col, 2.2); return s; };

// Dạng 1: cú con là cục bông tròn, mắt to tròn long lanh
function owlF1(c) {
  const fur = cel('#6286f7', '#3a58cc'), cy = 142, hy = 131;
  let body = '', head = '';
  body += owlFeet(188, 12);
  body += bl(nbD(owlFuzz(100, cy, 42, 22, 7)) + `<ellipse cx="57" cy="152" rx="9" ry="14" transform="rotate(22 57 152)"/><ellipse cx="143" cy="152" rx="9" ry="14" transform="rotate(-22 143 152)"/>` +
    nbD('M95,101 Q92,86 104,83 Q99,92 107,101 Z'), fur, 5);
  body += nbRim(100, cy, 42, 42, -45, 60, 3.4, c.rim);
  body += el(100, 170, 24, 13, cel(c.l, c.ls), 0) + owlChev(100, 164, 2, c.ls);
  head += pa(owlDisc(100, hy, 34, 25), cel(c.disc, c.discs), 3.2);
  head += el(73, hy + 12, 5, 3, '#ff8ac8', 0, 'opacity=".5"') + el(127, hy + 12, 5, 3, '#ff8ac8', 0, 'opacity=".5"');
  head += nbEyeBig(85, hy - 1, 12, 13, -1, c.i, c.iD, c.iL) + nbEyeBig(115, hy - 1, 12, 13, 1, c.i, c.iD, c.iL);
  head += owlBeak(100, hy + 14, .9, c) + nbStar(100, 108, 3.4, c.star) + hl(80, 112, 7, 3.4);
  return { back: '', body, head, front: '', anc: { head: [100, 103, 54], eyes: [100, hy - 1, 52], neck: [100, 158, 46], back: [100, 146, 62, 38], body: [100, 168, 52, 32] }, rig: { hy: 138, hrx: 42, hry: 40 } };
}

// Dạng 2: cú non dáng quả trứng, túm lông tai nhọn, cánh xếp hai bên
function owlF2(c) {
  const fur = cel('#5676ee', '#2f4ac0'), hy = 106;
  let body = '', head = '';
  body += owlFeet(188, 13);
  let tufts = ''; for (const sd of [-1, 1]) tufts += nbD(`M${P(100 + sd * 12, 82)} L${P(100 + sd * 32, 47)} L${P(100 + sd * 30, 62)} L${P(100 + sd * 41, 56)} L${P(100 + sd * 36, 86)} Z`);
  body += bl(nbE(100, hy, 37, 31) + nbE(100, 148, 33, 36) + tufts, fur, 5);
  body += nbRim(100, 148, 33, 36, -40, 50, 3, c.rim) + el(100, 152, 21, 24, cel(c.l, c.ls), 0) + owlChev(100, 140, 3, c.ls);
  const wing = pa('M127,114 C146,126 144,158 132,178 L128,170 L123,178 L119,167 C127,149 125,129 116,118 Z', cel('#4462dc', '#24379e'), 4.2) + ln('M130,128 C134,142 132,156 127,168', '#9fb2ff', 2, 'opacity=".7"');
  body += wing + nbMir(wing);
  head += nbRim(100, hy, 37, 31, -30, 40, 3, c.rim);
  head += pa(owlDisc(100, hy, 31, 23), cel(c.disc, c.discs), 3.2);
  head += eyes2(100, hy - 1, 14, 10.5, 11, { skin: c.disc, iris: c.i, lid: .18, bw: 4, brow: '#3a56d0' });
  head += owlBeak(100, hy + 14, .95, c) + nbStar(100, 80, 4.2, c.star) + hl(80, 88, 7, 3.2);
  return { back: '', body, head, front: '', anc: { head: [100, 77, 50], eyes: [100, hy - 1, 48], neck: [100, 130, 44], back: [100, 122, 56, 56], body: [100, 150, 48, 52] }, rig: { hy, hrx: 37, hry: 31 } };
}

// Cánh lông vũ giơ cao (bên phải): một khối liền, mép lông tròn, lớp phủ có sao
function owlWingUp(base, cov, pri, rim, star) {
  return pa('M120,110 C126,88 138,74 152,66 C158,50 166,38 176,30 Q186,28 186,38 Q194,38 194,47 Q202,52 198,62 Q205,72 198,84 Q196,94 187,95 Q188,106 177,107 Q175,117 165,116 Q161,126 151,124 Q147,132 137,130 Q131,138 122,134 Z', base, 5) +
    pa('M176,30 Q186,28 186,38 Q194,38 194,47 Q202,52 198,62 Q205,72 198,84 Q196,94 187,95 L160,74 Z', pri, 0) +
    ln('M158,70 L184,38 M160,72 L193,48 M161,75 L198,62 M161,78 L197,82 M160,82 L186,95 M157,88 L176,106 M152,92 L164,115 M146,96 L150,123', '#18246e', 2.2, 'opacity=".75"') +
    pa('M120,110 C126,88 138,74 152,66 Q164,72 162,84 Q150,90 148,100 Q138,104 134,114 Q126,118 122,128 Z', cov, 4) +
    ln('M123,104 C128,88 138,77 151,69', rim, 2.4) + ln('M132,112 q4,-4 8,-2 M142,100 q4,-4 8,-2', '#2742b4', 2) +
    nbStar(140, 88, 3.6, star) + nbStar(178, 60, 3, star) + nbStar(170, 88, 2.4, '#cfe8ff') + nbStar(186, 76, 2.2);
}
// Dạng 3: cú dang cánh giơ cao, lông cánh có hoa văn sao
function owlF3(c) {
  const fur = cel('#4a6ae6', '#2742b4'), hy = 84;
  let back = '', body = '', head = '';
  const wing = owlWingUp(cel('#3a50c8', '#1f2e8c'), cel('#5a7cf2', '#3450c8'), '#24359a', c.rim, c.star);
  const wingN = `<g transform="matrix(.78 0 0 1 26.4 0)">${wing}</g>`;
  back += nbSwing(wingN, 120, 112) + nbMir(nbSwing(wingN, 120, 112, .7));
  back += pa('M92,166 L86,188 L96,182 L100,190 L104,182 L114,188 L108,166 Z', cel('#2c3ea6', '#18246e'), 4);
  body += owlFeet(184, 12);
  let tufts = ''; for (const sd of [-1, 1]) tufts += nbD(`M${P(100 + sd * 12, 62)} L${P(100 + sd * 36, 28)} L${P(100 + sd * 32, 46)} L${P(100 + sd * 44, 42)} L${P(100 + sd * 34, 68)} Z`);
  body += bl(nbE(100, hy, 34, 29) + nbE(100, 134, 30, 42) + tufts, fur, 5);
  body += nbRim(100, 134, 30, 42, -40, 50, 3, c.rim) + el(100, 140, 19, 28, cel(c.l, c.ls), 0) + owlChev(100, 124, 4, c.ls);
  head += nbRim(100, hy, 34, 29, -30, 40, 3, c.rim);
  head += pa(owlDisc(100, hy, 29, 22), cel(c.disc, c.discs), 3.2);
  head += eyes2(100, hy - 1, 13, 9.5, 9.5, { skin: c.disc, iris: c.i, lid: .78, bw: 5.5, brow: '#2742b4' });
  head += owlBeak(100, hy + 13, .95, c) + nbMoon(102, 58, 6.5, -90, 'url(#gGold)', 2.4) + hl(80, 68, 6.5, 3);
  return { back, body, head, front: '', anc: { head: [100, 58, 48], eyes: [100, hy - 1, 46], neck: [100, 108, 40], back: [100, 108, 48, 60], body: [100, 138, 44, 54] }, rig: { hy, hrx: 34, hry: 29 } };
}

// Dạng 4: cú thần trăng, đĩa trăng sau lưng, cánh như áo choàng bầu trời sao, mắt phát sáng
function owlF4(c) {
  const fur = cel(c.b, c.s), hy = 66;
  let back = '', body = '', head = '', front = '';
  back += nbFx(`<circle cx="100" cy="82" r="80" fill="#fff1a8" opacity=".12"/>`) + ci(100, 82, 68, cel('#f4f2ff', '#c9c4f2', .7), 4) +
    ci(70, 54, 9, '#d6d2f5', 0, 'opacity=".7"') + ci(138, 112, 12, '#d6d2f5', 0, 'opacity=".6"') + ci(128, 44, 6, '#d6d2f5', 0, 'opacity=".7"') + ci(58, 110, 7, '#d6d2f5', 0, 'opacity=".6"') +
    nbFx(`<circle cx="100" cy="82" r="75" fill="none" stroke="#fff1a8" stroke-width="2.5" stroke-dasharray="3 9" stroke-linecap="round" opacity=".8"/>`);
  const wing = pa('M118,94 C146,78 184,86 197,114 Q201,128 194,140 L184,134 Q188,150 184,161 L173,151 Q176,167 169,177 L159,163 Q158,177 151,185 L143,169 Q139,179 131,181 L123,161 Q117,152 115,140 Z', lin('#4a66ea', '#283aa8', '#141a5c'), 5) +
    ln('M121,97 C146,84 180,90 193,113', c.rim, 2.6) +
    nbStar(160, 110, 3.6) + nbStar(178, 128, 2.6, '#cfe8ff') + nbStar(146, 140, 3) + nbStar(166, 150, 2.2) + nbStar(138, 118, 2.2, '#cfe8ff') + nbStar(152, 164, 2.4);
  back += nbSwing(wing, 118, 100) + nbMir(nbSwing(wing, 118, 100, .7));
  // Đuôi dài chạm đất, đầu lông có sao
  back += [[-14, 186], [0, 190], [14, 186]].map(([dx, y]) => pa(`M${P(100 + dx * .3 - 6, 150)} Q${P(100 + dx - 8, y - 18)} ${P(100 + dx, y)} Q${P(100 + dx + 8, y - 18)} ${P(100 + dx * .3 + 6, 150)} Z`, cel('#2c3ea6', '#18246e'), 4) + nbStar(100 + dx, y - 9, 3.4)).join('');
  body += owlFeet(176, 11);
  let tufts = ''; for (const sd of [-1, 1]) tufts += nbD(`M${P(100 + sd * 12, 46)} L${P(100 + sd * 42, 16)} L${P(100 + sd * 34, 34)} L${P(100 + sd * 50, 32)} L${P(100 + sd * 32, 54)} Z`);
  body += bl(nbE(100, hy, 30, 26) + nbE(100, 120, 27, 44) + tufts, fur, 5);
  body += nbRim(100, 120, 27, 44, -40, 50, 3, c.rim) + el(100, 126, 18, 30, cel('#c4d0ff', '#8a9cec'), 0) + owlChev(100, 112, 4, '#5a70d8');
  body += nbMoon(103, 102, 6, -90, 'url(#gGold)', 2.2);
  head += nbRim(100, hy, 30, 26, -30, 40, 3, c.rim);
  head += pa(owlDisc(100, hy, 27, 20), cel('#f6f4ff', '#c9c0f5'), 3.2);
  head += el(88, hy - 1, 11.5, 10.5, '#9fe8ff', 0, 'opacity=".35"') + el(112, hy - 1, 11.5, 10.5, '#9fe8ff', 0, 'opacity=".35"') + eyes2(100, hy - 1, 12, 9, 8.4, { skin: '#e8e2ff', iris: c.i, white: '#fff8c8', lid: 1, bw: 5, brow: '#1a2e94' });
  head += owlBeak(100, hy + 12, .9, c) + nbStar(100, 46, 4.4, '#ffe14d') + hl(82, 52, 6, 2.8);
  front += nbFx([[22, 30, 5], [178, 24, 4.4], [16, 178, 4], [186, 70, 3.6], [180, 186, 3.4], [24, 92, 3.2]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#cfe8ff' : '#fff1a8', 1.8, 'twinkle', i * .35)).join(''));
  return { back, body, head, front, anc: { head: [100, 43, 46], eyes: [100, hy - 1, 44], neck: [100, 92, 40], back: [100, 94, 48, 66], body: [100, 124, 42, 56] }, rig: { hy, hrx: 30, hry: 26 } };
}

/* ===== BÁO ĐEN: báo con nằm → báo rình mồi → báo vồ, đuôi thành vệt khói → báo thần chòm sao ===== */
PET_SPECS.panther = {
  el: 'shadow',
  c: { b: '#5e4fb0', s: '#36297a', l: '#a294ea', ls: '#7466c4', ear: '#ff8ae0', i: '#ff4fd8', iD: '#a3128c', iL: '#ffc2f4', spot: '#ff6ae0', rim: '#ff8af0', nose: '#ff6ab8' },
  c4: { b: '#4a3ca0', s: '#1e1554', l: '#8a7ad6', ls: '#5e50a8', i: '#ff4fd8', spot: '#c8f8ff', rim: '#9ff3ff' },
  draw(f, g, c) { return nbOut(nbFit([null, panF1, panF2, panF3, panF4][f](c), [1, .92, .92, .92, 1][f])); }
};
// Đốm hoa thị phát sáng: vòng hở + sao giữa
const panRose = (x, y, r, col) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.25)}" fill="${col}" opacity=".22"/>` + nbStar(x, y, r, col) + ci(x + r * .9, y - r * .8, r * .22, '#ffd6fb', 0);
// Mõm báo nhìn thẳng
function panFace(hx, hy, s, c, o = {}) {
  let h = el(hx, hy + 11 * s, 12 * s, 8 * s, c.l, 0);
  h += pa(`M${P(hx - 3 * s, hy + 7.5 * s)} Q${P(hx, hy + 6 * s)} ${P(hx + 3 * s, hy + 7.5 * s)} L${P(hx, hy + 10.5 * s)} Z`, c.nose, 1.6);
  if (o.roar) h += pa(`M${P(hx - 7 * s, hy + 12 * s)} Q${P(hx, hy + 10 * s)} ${P(hx + 7 * s, hy + 12 * s)} Q${P(hx + 6 * s, hy + 22 * s)} ${P(hx, hy + 23 * s)} Q${P(hx - 6 * s, hy + 22 * s)} ${P(hx - 7 * s, hy + 12 * s)} Z`, '#c21d6e', 2.6) +
    pa(`M${P(hx - 6 * s, hy + 12.4 * s)} l${f1(2 * s)},${f1(5 * s)} l${f1(2 * s)},${f1(-4.6 * s)} Z M${P(hx + 2 * s, hy + 12.2 * s)} l${f1(2 * s)},${f1(4.6 * s)} l${f1(2 * s)},${f1(-5 * s)} Z`, '#fff', 1.4) + el(hx, hy + 19.5 * s, 3.5 * s, 2 * s, '#ff7ab8', 0);
  else h += ln(`M${P(hx - 5.5 * s, hy + 13 * s)} Q${P(hx - 2.5 * s, hy + 16 * s)} ${P(hx, hy + 12.5 * s)} Q${P(hx + 2.5 * s, hy + 16 * s)} ${P(hx + 5.5 * s, hy + 13 * s)}`, OL, 2.4) + (o.fang ? pa(`M${P(hx + 1.5 * s, hy + 14 * s)} l${f1(1.5 * s)},${f1(3.6 * s)} l${f1(1.5 * s)},${f1(-3.4 * s)} Z`, '#fff', 1.3) : '');
  return h;
}

// Dạng 1: báo con nằm sấp, hai chân trước duỗi, đốm sao hồng trên lưng
function panF1(c) {
  const fur = cel('#5e4fb0', '#36297a'), hx = 84, hy = 146;
  let back = '', body = '', head = '';
  back += nbSwing(tube('M144,180 C170,188 176,166 164,156', '#5a4aa8', 9, 4.5) + nbStar(164, 156, 4.4, c.spot), 144, 180);
  body += bl(nbE(118, 170, 34, 16) + nbE(140, 165, 17, 16), fur, 5);
  body += nbRim(118, 170, 34, 16, -150, -40, 2.8, c.rim) + nbRim(140, 165, 17, 16, -110, 10, 2.6, c.rim);
  body += nbStar(116, 162, 4.2, c.spot) + nbStar(134, 157, 3.4, c.spot) + nbStar(148, 171, 3, c.spot) + nbStar(124, 177, 2.6, c.spot);
  const ear = (x, sd) => `<ellipse cx="${x}" cy="${hy - 20}" rx="10.5" ry="11.5" transform="rotate(${sd * 22} ${x} ${hy - 20})"/>`;
  head += bl(nbE(hx, hy, 31, 26) + ear(hx - 21, -1) + ear(hx + 21, 1) + nbE(hx - 13, 182, 10, 6.5) + nbE(hx + 15, 183, 10, 6.5), fur);
  head += el(hx - 21, hy - 19, 5.5, 6.5, c.ear, 0, `transform="rotate(-22 ${hx - 21} ${hy - 19})"`) + el(hx + 21, hy - 19, 5.5, 6.5, c.ear, 0, `transform="rotate(22 ${hx + 21} ${hy - 19})"`);
  head += ln(`M${hx - 17},185 v-3.4 M${hx - 10},185.5 v-3.4 M${hx + 12},186 v-3.4 M${hx + 19},185.5 v-3.4`, OL, 2);
  head += nbRim(hx, hy, 31, 26, -30, 70, 3.2, c.rim);
  head += el(hx - 21, hy + 10, 5, 3, '#ff7ab8', 0, 'opacity=".55"') + el(hx + 21, hy + 10, 5, 3, '#ff7ab8', 0, 'opacity=".55"');
  head += nbEyeBig(hx - 12.5, hy - 2, 9, 10.5, -1, c.i, c.iD, c.iL) + nbEyeBig(hx + 12.5, hy - 2, 9, 10.5, 1, c.i, c.iD, c.iL);
  head += panFace(hx, hy - 1, 1, c) + nbStar(hx, hy - 17, 3.8, c.spot) + hl(hx - 15, hy - 15, 6.5, 3.2);
  return { back, body, head, front: '', anc: { head: [hx, hy - 25, 46], eyes: [hx, hy - 2, 40], neck: [hx + 2, 168, 40], back: [122, 156, 50, 26], body: [122, 172, 34, 22] }, rig: { hx, hy, hrx: 31, hry: 26 } };
}

// Dạng 2: báo thiếu niên rình mồi, đầu thấp, mông cao, đuôi chữ S
function panF2(c) {
  const fur = cel('#5849a8', '#302470'), furD = cel('#3e3184', '#241a5a'), hx = 52, hy = 140;
  let back = '', body = '', head = '';
  back += nbSwing(tube('M138,128 C164,126 152,98 168,86', '#5446a4', 9, 4.5) + ghostFlame(168, 92, 18, 12, 2), 138, 128);
  back += bl(`<path d="${capsule(86, 150, 90, 180, 6.5, 5.5)}"/><path d="${capsule(136, 144, 142, 180, 7, 5.5)}"/>` + nbE(91, 184, 8.5, 4.6) + nbE(145, 184, 9, 4.6), furD, 5);
  body += bl(nbE(74, 152, 20, 15) + `<ellipse cx="102" cy="144" rx="31" ry="16" transform="rotate(-14 102 144)"/>` + nbE(130, 136, 19, 19) +
    `<path d="${capsule(68, 156, 52, 178, 7, 6)}"/>` + nbE(46, 183, 10, 5.2) + `<path d="${capsule(130, 146, 122, 172, 9, 6.5)}"/>` + nbE(128, 183, 12, 5.4), fur, 5);
  body += ln('M66,140 C80,132 104,128 124,120 C134,116 144,120 148,130', c.rim, 2.6) + pa('M60,158 Q74,164 92,158 Q80,168 64,164 Z', c.ls, 0, 'opacity=".6"');
  body += panRose(96, 140, 4.4, c.spot) + panRose(114, 133, 4.2, c.spot) + panRose(131, 129, 4.4, c.spot) + panRose(84, 152, 3.6, c.spot) + panRose(108, 152, 3.6, c.spot) + panRose(138, 145, 3.4, c.spot);
  body += pa('M38,186 l1.8,3.6 l1.8,-3.4 Z M44,186.4 l1.8,3.6 l1.8,-3.4 Z', '#fff', 1.3);
  const L = earPointy(hx - 15, hy - 14, -1, 20, 18, 34, null, c.ear), R = earPointy(hx + 15, hy - 14, 1, 20, 18, 34, null, c.ear);
  let ch = ''; for (const sd of [-1, 1]) ch += nbD(`M${P(hx + sd * 20, hy + 2)} L${P(hx + sd * 28, hy + 9)} L${P(hx + sd * 19, hy + 13)} Z`);
  head += bl(nbE(hx, hy, 24, 21) + nbD(L.outer) + nbD(R.outer) + ch, fur);
  head += L.inner + R.inner + nbRim(hx, hy, 24, 21, -30, 70, 2.8, c.rim);
  head += eyes2(hx, hy - 2, 9.5, 7.4, 7, { skin: '#5849a8', iris: c.i, lid: .7, slit: true, bw: 5 });
  head += panFace(hx, hy - 2, .85, c, { fang: true }) + nbStar(hx, hy - 15, 3, c.spot) + hl(hx - 11, hy - 12, 5.5, 2.6);
  return { back, body, head, front: '', anc: { head: [hx, hy - 20, 36], eyes: [hx, hy - 2, 32], neck: [hx + 10, 157, 30], back: [104, 128, 50, 28], body: [78, 160, 26, 22] }, rig: { hx, hy, hrx: 24, hry: 21 } };
}

// Dạng 3: báo nhảy vồ giữa không trung, bốn chân duỗi, đuôi tan thành vệt khói
function panF3(c) {
  const fur = cel('#5244a4', '#2b2068'), furD = cel('#3a2d80', '#20165a'), hx = 52, hy = 84;
  let back = '', body = '', head = '';
  // Đuôi vút lên rồi tan thành khói
  back += tube('M140,98 C160,90 166,70 180,66', '#4f42a0', 9, 4.5);
  back += `<g opacity=".85">` + bl(nbE(182, 64, 8, 7) + nbE(188, 52, 6, 5.5) + nbE(182, 41, 4.5, 4), lin('#d6b8ff', '#8a5ce6'), 3) + `</g>` + ln('M178,67 q7,-1 8,-8 M185,53 q4,-2 3,-7', '#f0e4ff', 1.8);
  back += nbFx(`<g class="ember">${ci(172, 34, 3, '#d6b8ff', 1.6)}</g>`);
  // Chân xa (tối hơn)
  back += bl(`<path d="${capsule(76, 108, 42, 128, 7, 6)}"/>` + nbE(36, 131, 8, 6) + `<path d="${capsule(134, 108, 158, 128, 8, 6)}"/><path d="${capsule(158, 128, 168, 142, 6, 5)}"/>` + nbE(172, 145, 8, 5), furD, 5);
  body += bl(nbE(74, 104, 20, 17) + `<ellipse cx="104" cy="100" rx="38" ry="16" transform="rotate(-4 104 100)"/>` + nbE(136, 100, 18, 17) +
    `<path d="${capsule(66, 112, 32, 136, 8, 6.5)}"/>` + nbE(27, 139, 9.5, 7) + `<path d="${capsule(138, 108, 154, 132, 9, 7)}"/><path d="${capsule(154, 132, 178, 150, 7, 5.5)}"/>` + nbE(183, 152, 10, 5.5), fur, 5);
  body += pa('M17,138 l-4,1 l3,-3 Z M18,143 l-4,3 l2,-4 Z M23,147 l-2,4 l0,-4 Z', '#fff', 1.4);
  body += ln('M80,88 C100,82 124,82 140,86 C150,90 156,96 154,104', c.rim, 2.6) + pa('M78,114 Q100,122 126,114 Q104,126 82,120 Z', c.ls, 0, 'opacity=".55"');
  body += panRose(98, 92, 4.6, c.spot) + panRose(118, 96, 4.4, c.spot) + panRose(138, 94, 4.2, c.spot) + panRose(86, 106, 3.6, c.spot) + panRose(108, 108, 3.6, c.spot) + panRose(128, 108, 3.4, c.spot);
  body += ln('M70,132 h-14 M96,124 h-16 M122,124 h-10', '#c9a8ff', 2.4, 'opacity=".55"');
  const L = earPointy(hx - 16, hy - 13, -1, 22, 18, 40, null, c.ear), R = earPointy(hx + 16, hy - 13, 1, 22, 18, 40, null, c.ear);
  let ch = ''; for (const sd of [-1, 1]) ch += nbD(`M${P(hx + sd * 21, hy + 1)} L${P(hx + sd * 31, hy + 8)} L${P(hx + sd * 21, hy + 11)} L${P(hx + sd * 28, hy + 17)} L${P(hx + sd * 16, hy + 17)} Z`);
  head += bl(nbE(hx, hy, 25, 21) + nbD(L.outer) + nbD(R.outer) + ch, fur);
  head += L.inner + R.inner + nbRim(hx, hy, 25, 21, -30, 70, 2.8, c.rim);
  head += eyes2(hx, hy - 3, 10, 7.6, 6.6, { skin: '#5244a4', iris: c.i, lid: .9, slit: true });
  head += panFace(hx, hy - 3, .9, c, { roar: true }) + nbStar(hx, hy - 16, 3.2, c.spot) + hl(hx - 12, hy - 12, 5.5, 2.6);
  return { back, body, head, front: '', anc: { head: [hx, hy - 20, 38], eyes: [hx, hy - 3, 34], neck: [hx + 14, 104, 32], back: [106, 88, 58, 26], body: [82, 110, 30, 22] }, rig: { hx, hy, hrx: 25, hry: 21 } };
}

// Dạng 4: báo thần bóng đêm, đốm là chòm sao phát sáng, sừng trăng bạc, khói tím quanh chân
function panF4(c) {
  const fur = cel(c.b, c.s), furD = cel('#33287a', '#1a1250'), hx = 66, hy = 64, st = c.spot;
  let back = '', body = '', head = '', front = '';
  back += nbFx(`<circle cx="104" cy="96" r="84" fill="#b46bff" opacity=".14"/>`);
  // Đuôi cong vút lên, chóp lửa ma
  back += nbSwing(tube('M152,118 C182,122 188,86 174,68 C166,56 172,42 184,40', '#40338e', 10, 4.5) + ghostFlame(184, 46, 24, 16, 3) + nbStar(180, 88, 2.6, st), 152, 118);
  // Chân xa
  back += bl(`<path d="${capsule(92, 138, 94, 178, 8, 7)}"/><path d="${capsule(152, 136, 158, 178, 8.5, 7)}"/>` + nbE(93, 182, 10, 5.4) + nbE(160, 182, 10.5, 5.4), furD, 5);
  // Bờm lửa ma dọc gáy
  back += ghostFlame(88, 86, 22, 14, 4) + ghostFlame(99, 97, 20, 13, 5) + ghostFlame(111, 106, 18, 12, 5);
  body += bl(`<path d="${capsule(80, 116, 70, 78, 18, 16)}"/>` + nbE(80, 124, 25, 25) + `<ellipse cx="114" cy="120" rx="40" ry="18" transform="rotate(-2 114 120)"/>` + nbE(148, 122, 20, 21) +
    `<path d="${capsule(74, 142, 72, 178, 8.5, 7)}"/><path d="${capsule(148, 138, 144, 178, 9.5, 7)}"/>` + nbE(70, 182, 10.5, 5.4) + nbE(144, 182, 11, 5.4), fur, 5.5);
  body += ln('M88,100 C106,102 126,100 146,104 C160,108 168,118 168,128', c.rim, 2.6) + nbRim(80, 124, 25, 25, 100, 170, 2.4, '#ff8af0');
  body += pa('M60,108 Q80,104 92,112 Q86,134 72,140 Q58,132 60,108 Z', cel(c.l, c.ls), 0, 'opacity=".75"');
  // Chòm sao trên thân
  const k1 = [[100, 112], [116, 118], [128, 110], [142, 120], [152, 112]], k2 = [[98, 134], [112, 138], [126, 132], [140, 138]];
  body += [k1, k2].map(k => ln('M' + k.map(([x, y]) => P(x, y)).join(' L'), st, 1.4, 'opacity=".75"') + k.map(([x, y], i) => nbStar(x, y, i % 2 ? 3.2 : 4.4, i % 2 ? '#ffd6fb' : st)).join('')).join('');
  body += nbStar(74, 158, 3, st) + nbStar(144, 158, 3, st);
  front += nbSmoke(110, 184, 120, '#c9a8ff', '#6a3fd0', '#f0e4ff', 7);
  // Đầu ngẩng cao, sừng trăng bạc
  const L = earPointy(hx - 18, hy - 12, -1, 26, 18, 34, null, c.ear), R = earPointy(hx + 18, hy - 12, 1, 26, 18, 34, null, c.ear);
  let ch = ''; for (const sd of [-1, 1]) ch += nbD(`M${P(hx + sd * 22, hy + 1)} L${P(hx + sd * 33, hy + 8)} L${P(hx + sd * 23, hy + 11)} L${P(hx + sd * 30, hy + 18)} L${P(hx + sd * 17, hy + 18)} Z`);
  head += bl(nbE(hx, hy, 26, 22) + nbD(L.outer) + nbD(R.outer) + ch, fur);
  head += L.inner + R.inner + nbRim(hx, hy, 26, 22, -30, 70, 2.8, c.rim);
  const horn = nbMoon(hx - 10, hy - 33, 15, -22, cel('#f6f7ff', '#a9b0e0'), 3.5) + nbStar(hx - 21, hy - 40, 2.4, '#c8f8ff');
  head += horn + `<g transform="matrix(-1 0 0 1 ${2 * hx} 0)">${horn}</g>`;
  head += el(hx - 10.5, hy - 2, 9.5, 8.5, '#ff4fd8', 0, 'opacity=".3"') + el(hx + 10.5, hy - 2, 9.5, 8.5, '#ff4fd8', 0, 'opacity=".3"');
  head += eyes2(hx, hy - 2, 10.5, 7.4, 6.4, { skin: c.b, iris: c.i, white: '#fff0fc', lid: 1, slit: true });
  head += panFace(hx, hy - 2, .9, c, { fang: true });
  head += hl(hx - 13, hy - 12, 5.5, 2.6) + ci(hx, hy - 17, 3, '#c8f8ff', 1.8);
  front += nbFx([[18, 30, 5], [130, 18, 4], [190, 120, 3.6], [14, 130, 3.4], [112, 48, 3]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#ffd6fb' : '#c8f8ff', 1.8, 'twinkle', i * .4)).join(''));
  return { back, body, head, front, anc: { head: [hx, hy - 21, 40], eyes: [hx, hy - 2, 36], neck: [hx + 6, 92, 38], back: [118, 104, 66, 34], body: [82, 128, 36, 38] }, rig: { hx, hy, hrx: 26, hry: 22 } };
}

/* ---------- THÉP ---------- */
const bolts4 = (pts_) => pts_.map(([x, y]) => rivet(x, y, 2.3)).join('');
const visorGlow = (x, y, w, h, col = '#ff2e4a') => `<rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${col}" stroke="${OL}" stroke-width="3.5"/>` + `<rect x="${f1(x - w / 2 + 4)}" y="${f1(y - h / 2 + 2.5)}" width="${f1(w * .4)}" height="${f1(h * .28)}" rx="1.5" fill="#fff" opacity=".7"/>`;
/* ---------- THÉP (v3): 4 dòng tiến hóa khác dáng rõ rệt ---------- */
// Gói trong IIFE: không thêm biến toàn cục nào ngoài 4 mục PET_SPECS.bear/scorpion/bull/mecha.
// Dùng lại lõi đồ họa của gfx.js/pets.js: pa, el, ci, ln, hl, bl, tube, cel, capsule, rivet, eye, eyes2, flame, spark4, motes, P, f1, OL, HIP, GROUND.
(() => {
  const R2 = Math.PI / 180, NEON = '#33e1ff', RED = '#ff2e4a', GOLD = 'url(#gGold)', CHROME = 'url(#gSteelG)';
  const rr = (x, y, w, h, r, fill, sw = 4, ex = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(r)}" fill="${fill}" stroke="${sw ? OL : 'none'}" stroke-width="${sw}" ${ex}/>`;
  const grp = (s, x, y, a = 0, sc = 1) => `<g transform="translate(${f1(x)} ${f1(y)})${a ? ` rotate(${f1(a)})` : ''}${sc !== 1 ? ` scale(${sc})` : ''}">${s}</g>`;
  const neon = (d, col = NEON, w = 3) => ln(d, col, w + 8, 'opacity=".22"') + ln(d, OL, w + 4) + ln(d, col, w) + ln(d, '#fff', f1(Math.max(1, w * .34)), 'opacity=".85"');
  const glow = (cx, cy, r, col = NEON, op = .3) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${col}" opacity="${op}"/>`;
  const cheek = (x, y, rx = 6, ry = 3.6) => el(x, y, rx, ry, '#ff8fb1', 0, 'opacity=".85"');
  // Đường cong Bézier bậc 3: điểm và góc tiếp tuyến
  const bz = (B, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * B[0][k] + 3 * u * u * t * B[1][k] + 3 * u * t * t * B[2][k] + t * t * t * B[3][k]); };
  const bzA = (B, t) => { const a = bz(B, Math.max(0, t - .01)), b = bz(B, Math.min(1, t + .01)); return Math.atan2(b[1] - a[1], b[0] - a[0]) / R2; };
  // Bánh răng
  function gearD(cx, cy, r, n, dep = r * .2) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = i * 360 / n, w = 360 / n;
      [[a - w * .5, r - dep], [a - w * .26, r - dep], [a - w * .16, r], [a + w * .16, r], [a + w * .26, r - dep]].forEach(([g, q], j) => {
        d += (i || j ? 'L' : 'M') + P(cx + q * Math.cos(g * R2), cy + q * Math.sin(g * R2));
      });
    }
    return d + 'Z';
  }
  const gear = (cx, cy, r, n, fill, sw = 3, hole = '#3d4c66') => pa(gearD(cx, cy, r, n), fill, sw) + (hole ? ci(cx, cy, r * .34, hole, sw * .8) : '');
  // Chìa vặn dây cót: gốc (x, y), chĩa theo góc a
  const windKey = (x, y, a, s = 1) => grp(bl(`<rect x="-3" y="-3" width="19" height="6" rx="2.5"/><circle cx="23" cy="-7.5" r="7.8"/><circle cx="23" cy="7.5" r="7.8"/>`, GOLD, 3.2) +
    ci(23, -7.5, 2.8, '#d99500', 0) + ci(23, 7.5, 2.8, '#d99500', 0) + `<ellipse cx="19" cy="-11" rx="3" ry="1.5" fill="#fff" opacity=".7"/>`, x, y, a, s);
  // Lò xo dọc theo đường cong B
  function spring(B, n, w, col = '#d7e1f0') {
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), [x, y] = bz(B, t), a = bzA(B, t) + 90, ww = w * (1 - t * .25);
      s += `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(ww)}" ry="${f1(ww * .38)}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="none" stroke="${OL}" stroke-width="7.5"/>` +
        `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(ww)}" ry="${f1(ww * .38)}" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="none" stroke="${col}" stroke-width="3.2"/>`;
    }
    return s;
  }
  // Lửa phụt xuống (động cơ) chân tại (x, y)
  function jet(x, y, h, w, hot = false) {
    const d = `M${P(x - w / 2, y)} C${P(x - w * .55, y + h * .35)} ${P(x - w * .18, y + h * .62)} ${P(x, y + h)} C${P(x + w * .18, y + h * .62)} ${P(x + w * .55, y + h * .35)} ${P(x + w / 2, y)} Z`;
    const c = `M${P(x - w * .25, y)} C${P(x - w * .26, y + h * .3)} ${P(x - w * .08, y + h * .45)} ${P(x, y + h * .6)} C${P(x + w * .08, y + h * .45)} ${P(x + w * .26, y + h * .3)} ${P(x + w * .25, y)} Z`;
    return `<g class="flick">` + pa(d, hot ? 'url(#gFlame)' : 'url(#gNeon)', 3) + pa(c, hot ? '#fff59a' : '#ffffff', 0, 'opacity=".9"') + `</g>`;
  }
  // Mắt phát sáng dạng 4: xếch vào trong, không đồng tử
  function glowEye(cx, cy, w, h, sd, col) {
    const ix = cx - sd * w / 2, ox = cx + sd * w / 2;
    const d = `M${P(ix, cy + h * .3)} Q${P(cx - sd * w * .05, cy - h * .85)} ${P(ox, cy - h * .5)} Q${P(cx + sd * w * .15, cy + h * .8)} ${P(ix, cy + h * .3)} Z`;
    return el(cx, cy, w * .75, h * 1.1, col, 0, 'opacity=".35"') + pa(d, col, 3.5) + el(cx + sd * w * .08, cy, w * .22, h * .22, '#fff', 0, 'opacity=".95"');
  }
  // Mắt tròn to dễ thương (dạng 1)
  const cuteEyes = (cx, cy, gap, r, iris, skin) => eyes2(cx, cy, gap, r, r * 1.08, { iris, lid: 0, brow: false, pr: r * .58, skin });
  // Càng bọ cạp 2 ngàm: tâm lòng bàn (cx, cy), cỡ r, xoay a (0 = ngàm chĩa lên)
  function claw(cx, cy, r, a, fill, o = {}) {
    const sh = `<ellipse cx="0" cy="0" rx="${f1(r * .86)}" ry="${f1(r * .95)}"/>` +
      `<path d="M${P(-r * .84, -r * .1)} C${P(-r * 1.15, -r * 1.25)} ${P(-r * .55, -r * 1.95)} ${P(r * .08, -r * 2.05)} C${P(-r * .22, -r * 1.55)} ${P(-r * .3, -r * .95)} ${P(-r * .02, -r * .6)} Z"/>` +
      `<path d="M${P(r * .84, -r * .15)} C${P(r * 1.02, -r * 1.0)} ${P(r * .7, -r * 1.55)} ${P(r * .3, -r * 1.78)} C${P(r * .34, -r * 1.3)} ${P(r * .28, -r * .9)} ${P(r * .04, -r * .62)} Z"/>`;
    let s = bl(sh, fill, o.sw || 4.5);
    if (o.edge) s += ln(`M${P(-r * .18, -r * .7)} C${P(-r * .42, -r * 1.1)} ${P(-r * .3, -r * 1.6)} ${P(r * .02, -r * 1.9)}`, o.edge, 3) + ln(`M${P(r * .16, -r * .72)} C${P(r * .32, -r * 1.1)} ${P(r * .34, -r * 1.4)} ${P(r * .28, -r * 1.65)}`, o.edge, 3);
    if (o.trim) s += ln(`M${P(-r * .7, r * .35)} Q0,${f1(r * .65)} ${P(r * .7, r * .35)}`, o.trim, 3);
    s += hl(-r * .35, -r * .2, r * .26, r * .12, -60, .6);
    return grp(s, cx, cy, a);
  }
  // Càng tròn khuyết (dạng bé)
  function pac(cx, cy, r, a, open, fill, sw = 4) {
    const A = (a + open) * R2, B = (a - open) * R2;
    const d = `M${P(cx + r * Math.cos(A), cy + r * Math.sin(A))} A${f1(r)},${f1(r)} 0 1 1 ${P(cx + r * Math.cos(B), cy + r * Math.sin(B))} L${P(cx + r * .12 * Math.cos(a * R2), cy + r * .12 * Math.sin(a * R2))} Z`;
    return pa(d, fill, sw) + hl(cx - r * .3, cy + r * .1, r * .28, r * .14, -30, .55);
  }
  // Hào quang thép dạng 4: bánh răng lớn quay chậm + vòng sáng
  function steelAura(cx, cy, r, a = NEON, b = '#ffd21f') {
    if (PET_LITE) return '';
    return glow(cx, cy, r * 1.02, a, .14) +
      `<g opacity=".32"><g class="spin" style="transform-origin:${f1(cx)}px ${f1(cy)}px"><path d="${gearD(cx, cy, r, 14, r * .12)}" fill="none" stroke="${a}" stroke-width="5" stroke-linejoin="round"/>` +
      `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * .7)}" fill="none" stroke="${b}" stroke-width="3" stroke-dasharray="6 9" stroke-linecap="round"/></g></g>`;
  }
  const A = (head, eyes, neck, back, body) => ({ head, eyes, neck, back, body });

  /* ===================== GẤU THÉP ===================== */
  // Nhận diện xuyên suốt: tai tròn có ốc vít ở giữa + mặt đồng hồ / lõi tròn ở ngực, mắt xanh lơ.
  function bearEar(x, y, r, f) {
    if (f >= 4) return ci(x, y, r * .62, '#1d2547', 3) + ci(x, y, r * .42, 'url(#gNeon)', 0) + ci(x, y, r * .18, '#fff', 0);
    if (f === 3) return ci(x, y, r * .6, '#3d4c70', 3) + ci(x, y, r * .36, NEON, 2);
    return ci(x, y, r * .58, '#8ea3c8', 3) + ln(`M${P(x - r * .3, y)} h${f1(r * .6)} M${P(x, y - r * .3)} v${f1(r * .6)}`, '#4a5b80', 2.4);
  }
  const bear = {
    1(c) { // Gấu bông thiếc lên dây cót, ngồi bệt
      let back = '', body = '', head = '';
      back += windKey(74, 160, 196, 1.12);
      body += el(100, 158, 29, 24, cel(c.b, c.s), 5.5) + el(100, 162, 18, 14, c.l, 0);
      body += ci(100, 160, 8.5, '#fff', 3.2) + ln('M93.5,160 h2.5 M104,160 h2.5 M100,153.5 v2.5', '#7d92bd', 1.8) + ln('M100,160 L104.5,155', RED, 2.4) + ci(100, 160, 2, OL, 0);
      body += pa(capsule(75, 148, 67, 162, 8, 7.5), cel(c.b, c.s), 4.5) + pa(capsule(125, 148, 138, 136, 8, 7.5), cel(c.b, c.s), 4.5);
      for (const sd of [-1, 1]) body += el(100 + sd * 21, 179, 12.5, 9.5, cel(c.b, c.s), 5) + el(100 + sd * 21, 180.5, 7.5, 5.8, c.l, 2.4) + ci(100 + sd * 21, 180.5, 1.8, '#8ea3c8', 0);
      head += bl(`<ellipse cx="100" cy="117" rx="37" ry="31"/><circle cx="72" cy="91" r="12.5"/><circle cx="128" cy="91" r="12.5"/>`, cel(c.b, c.s));
      head += bearEar(72, 91, 12.5, 1) + bearEar(128, 91, 12.5, 1);
      head += ln('M67,107 Q100,96 133,107', c.s, 2.2, 'opacity=".5"') + rivet(65, 116, 2.1) + rivet(135, 116, 2.1);
      head += el(100, 130, 15.5, 10.5, c.l, 3.5) + pa('M93.5,124.5 Q100,121 106.5,124.5 Q103.5,129 100,129.5 Q96.5,129 93.5,124.5 Z', OL, 0) + ln('M95,134 Q97.5,136.5 100,134 Q102.5,136.5 105,134', OL, 2.6);
      head += cuteEyes(100, 114, 15.5, 9.2, NEON, c.b) + cheek(74, 126) + cheek(126, 126);
      head += hl(81, 99, 9.5, 4.2);
      return { back, body, head, front: '', anc: A([100, 87, 55], [100, 114, 46], [100, 146, 44], [100, 140, 52, 44], [100, 160, 42, 36]), g: { hy: 117, hrx: 37, hry: 31 } };
    },
    2(c) { // Gấu robot đi hai chân, tai ăng-ten, vẫy tay
      let back = '', body = '', head = '';
      for (const sd of [-1, 1]) {
        body += pa(capsule(100 + sd * 14, 160, 100 + sd * 16, 175, 7, 7), cel(c.pl, c.pls), 4) + ln(`M${100 + sd * 14 - 6},166 h12 M${100 + sd * 15 - 6},171 h12`, c.pls, 2);
        body += pa(`M${100 + sd * 4},188 L${100 + sd * 4},180 Q${100 + sd * 6},172 ${100 + sd * 17},172 Q${100 + sd * 30},172 ${100 + sd * 31},183 L${100 + sd * 31},188 Z`, cel(c.b, c.s), 4.5);
      }
      body += rr(70, 118, 60, 48, 20, cel(c.b, c.s), 5.5) + ln('M74,157 Q100,162 126,157', c.s, 2.5);
      body += ci(100, 140, 12.5, '#e9f0fa', 3.5) + ci(100, 140, 8, NEON, 2.5) + ci(100, 140, 3.2, '#fff', 0) + rivet(80, 126, 2.2) + rivet(120, 126, 2.2);
      // tay trái buông, tay phải vẫy
      body += pa(capsule(72, 128, 63, 151, 7, 6.5), cel(c.pl, c.pls), 4) + ln('M62,137 l9,3 M60,143 l9,3', c.pls, 2) + pac(62, 157, 8, 90, 32, cel(c.b, c.s), 4);
      body += pa(capsule(128, 128, 143, 113, 7, 6.5), cel(c.pl, c.pls), 4) + pa(capsule(143, 113, 147, 98, 6.5, 6), cel(c.pl, c.pls), 4) + pac(148, 92, 8.5, -90, 30, cel(c.b, c.s), 4);
      body += hl(82, 128, 8, 3.5);
      // ăng-ten trên tai
      for (const sd of [-1, 1]) back += tube(`M${100 + sd * 30},72 Q${100 + sd * 32},62 ${100 + sd * 37},55`, '#d7e1f0', 3, 3) + ci(100 + sd * 37, 53, 5, RED, 3) + ci(100 + sd * 38.5, 51.5, 1.6, '#fff', 0);
      head += bl(`<rect x="65" y="70" width="70" height="56" rx="26"/><circle cx="70" cy="75" r="12.5"/><circle cx="130" cy="75" r="12.5"/>`, cel(c.b, c.s));
      head += bearEar(70, 75, 12.5, 2) + bearEar(130, 75, 12.5, 2);
      head += rr(86, 104, 28, 17, 8.5, c.l, 3.5) + pa('M95,106.5 Q100,104 105,106.5 Q103,110.5 100,111 Q97,110.5 95,106.5 Z', OL, 0) + ln('M93,116 h14', OL, 2.6) + ln('M97,114 v4 M100,114 v4 M103,114 v4', OL, 1.6);
      head += eyes2(100, 95, 15, 8.5, 9.5, { iris: NEON, lid: .4, skin: c.b, pr: 4.6 });
      head += rivet(72, 100, 2) + rivet(128, 100, 2) + hl(80, 82, 9, 4);
      return { back, body, head, front: '', anc: A([100, 72, 60], [100, 95, 44], [100, 118, 50], [100, 120, 60, 48], [100, 142, 54, 46]), g: { hy: 98, hrx: 35, hry: 28 } };
    },
    3(c) { // Gấu giáp thép, lõi năng lượng ở ngực
      let back = '', body = '', head = '';
      for (const sd of [-1, 1]) {
        back += tube(`M${100 + sd * 28},96 L${100 + sd * 46},50`, c.pls, 9, 3.5) + rr(100 + sd * 46 - 8, 40, 16, 12, 4, cel(c.pl, c.pls), 3.5) + ci(100 + sd * 46, 46, 3, RED, 0) + `<g class="ember">${ci(100 + sd * 50, 32, 4, '#e6edf7', 2)}${ci(100 + sd * 47, 24, 2.6, '#e6edf7', 1.8)}</g>`;
        body += pa(capsule(100 + sd * 17, 146, 100 + sd * 20, 168, 12, 11), cel(c.pl, c.pls), 4.5) + ci(100 + sd * 19, 160, 6, c.b, 3);
        body += pa(`M${100 + sd * 6},189 L${100 + sd * 6},178 Q${100 + sd * 8},166 ${100 + sd * 22},166 Q${100 + sd * 38},166 ${100 + sd * 40},180 L${100 + sd * 40},189 Z`, cel(c.b, c.s), 5) + ln(`M${100 + sd * 10},181 H${100 + sd * 36}`, NEON, 2.5);
      }
      body += pa('M66,92 Q100,78 134,92 Q144,122 126,152 Q100,162 74,152 Q56,122 66,92 Z', cel(c.b, c.s), 5.5);
      body += pa('M80,136 Q100,142 120,136 L118,148 Q100,154 82,148 Z', cel(c.pl, c.pls), 3.5);
      body += glow(100, 114, 23, NEON, .28) + ci(100, 114, 16, '#2a3354', 4) + ci(100, 114, 10.5, 'url(#gNeon)', 2.5) + ci(100, 114, 4.5, '#fff', 0) + [45, 135, 225, 315].map(a => rivet(100 + 13 * Math.cos(a * R2), 114 + 13 * Math.sin(a * R2), 2)).join('');
      for (const sd of [-1, 1]) {
        body += pa(capsule(100 + sd * 38, 108, 100 + sd * 42, 128, 9, 9), cel(c.b, c.s), 4.5);
        body += pa(capsule(100 + sd * 42, 130, 100 + sd * 44, 148, 11.5, 12), cel(c.pl, c.pls), 4.5) + ln(`M${100 + sd * 42 - 10},138 h20`, NEON, 2.5);
        body += ci(100 + sd * 44, 155, 10.5, cel(c.b, c.s), 4.5);
        body += pa(`M${100 + sd * 22},104 Q${100 + sd * 22},84 ${100 + sd * 38},82 Q${100 + sd * 58},82 ${100 + sd * 58},104 Q${100 + sd * 40},98 ${100 + sd * 22},104 Z`, cel(c.pl, c.pls), 4.5) + ln(`M${100 + sd * 27},96 Q${100 + sd * 40},90 ${100 + sd * 54},96`, NEON, 2.5) + rivet(100 + sd * 40, 88, 2.2);
      }
      body += hl(80, 98, 7, 3);
      head += bl(`<ellipse cx="100" cy="62" rx="31" ry="27"/><circle cx="76" cy="40" r="11.5"/><circle cx="124" cy="40" r="11.5"/>`, cel(c.b, c.s));
      head += bearEar(76, 40, 11.5, 3) + bearEar(124, 40, 11.5, 3);
      head += pa('M71,58 Q72,38 100,36 Q128,38 129,58 Q115,50 100,52 Q85,50 71,58 Z', cel(c.pl, c.pls), 4) + pa('M96,44 L100,39 L104,44 L100,49 Z', NEON, 2);
      head += el(100, 76, 14, 9, c.l, 3.5) + pa('M95,71.5 Q100,69 105,71.5 Q103,75 100,75.5 Q97,75 95,71.5 Z', OL, 0) + ln('M93,80.5 Q100,83 107,80.5', OL, 2.6);
      head += eyes2(100, 62, 12.5, 7.5, 7, { iris: NEON, lid: .85, skin: c.b, pr: 3.8 });
      return { back, body, head, front: '', anc: A([100, 40, 48], [100, 62, 36], [100, 88, 46], [100, 88, 82, 92], [100, 118, 56, 56]), g: { hy: 62, hrx: 31, hry: 27 } };
    },
    4(c) { // Gấu mecha uy nghi, lơ lửng trên luồng phản lực
      let back = '', body = '', head = '', front = '';
      back += steelAura(100, 94, 88);
      for (const sd of [-1, 1]) {
        // vây cánh crôm viền neon
        back += pa(`M${100 + sd * 36},70 L${100 + sd * 88},16 Q${100 + sd * 95},26 ${100 + sd * 88},40 L${100 + sd * 52},80 Z`, cel(c.pl, c.pls), 4) + neon(`M${100 + sd * 44},68 L${100 + sd * 86},25`, NEON, 2.4);
        back += pa(`M${100 + sd * 44},86 L${100 + sd * 94},70 Q${100 + sd * 97},80 ${100 + sd * 91},87 L${100 + sd * 50},100 Z`, cel(c.pl, c.pls), 4) + neon(`M${100 + sd * 52},88 L${100 + sd * 90},77`, NEON, 1.8);
        // động cơ phản lực trên vai, miệng xả chúc xuống ngoài
        const jx = 100 + sd * 62, jy = 62;
        back += `<g transform="rotate(${sd * -22} ${jx} ${jy})">` + jet(jx, jy + 30, 30, 15) + rr(jx - 12, jy - 22, 24, 50, 12, cel(c.b, c.s), 4.5) + rr(jx - 10, jy + 20, 20, 11, 4, '#1d2547', 3.5) + ln(`M${jx - 8},${jy - 8} h16 M${jx - 8},${jy - 1} h16`, c.s, 2.2) + ci(jx, jy - 14, 4, NEON, 2.5) + `</g>`;
      }
      for (const sd of [-1, 1]) {
        body += pa(capsule(100 + sd * 16, 134, 100 + sd * 18, 146, 11.5, 10.5), cel(c.b, c.s), 4.5);
        body += pa(`M${100 + sd * 5},144 L${100 + sd * 32},144 L${100 + sd * 27},164 L${100 + sd * 11},164 Z`, cel(c.pl, c.pls), 4.5) + ln(`M${100 + sd * 9},151 H${100 + sd * 29}`, GOLD, 2.8);
        body += jet(100 + sd * 19, 166, 17, 12) + rr(100 + sd * 19 - 8.5, 162, 17, 6, 3, '#1d2547', 3);
      }
      body += pa('M62,80 Q100,64 138,80 Q148,110 126,136 Q100,146 74,136 Q52,110 62,80 Z', cel(c.b, c.s), 5.5);
      body += neon('M75,90 Q86,114 83,132 M125,90 Q114,114 117,132', NEON, 2.2);
      body += pa('M80,124 Q100,130 120,124 L118,138 Q100,144 82,138 Z', GOLD, 3.5) + ci(100, 133, 4.5, RED, 2.2);
      const rays = [0, 45, 90, 135, 180, 225, 270, 315].map(a => `M${P(100 + 15 * Math.cos(a * R2), 101 + 15 * Math.sin(a * R2))} L${P(100 + 25 * Math.cos(a * R2), 101 + 25 * Math.sin(a * R2))}`).join(' ');
      body += glow(100, 101, 30, NEON, .3) + ln(rays, NEON, 3, 'opacity=".8"') + ci(100, 101, 17, GOLD, 4) + ci(100, 101, 11.5, 'url(#gNeon)', 2.5) + ci(100, 101, 5, '#fff', 0);
      for (const sd of [-1, 1]) {
        body += pa(capsule(100 + sd * 40, 96, 100 + sd * 46, 116, 9, 9), cel(c.b, c.s), 4.5);
        body += pa(`M${100 + sd * 38},116 L${100 + sd * 56},114 L${100 + sd * 54},142 L${100 + sd * 42},142 Z`, cel(c.pl, c.pls), 4.5) + neon(`M${100 + sd * 41},126 L${100 + sd * 54},125`, NEON, 2);
        body += ci(100 + sd * 48, 148, 10, cel(c.b, c.s), 4.5) + rivet(100 + sd * 48, 148, 2.2);
        body += pa(`M${100 + sd * 18},86 Q${100 + sd * 22},64 ${100 + sd * 42},62 Q${100 + sd * 62},60 ${100 + sd * 66},76 L${100 + sd * 71},68 L${100 + sd * 66},94 Q${100 + sd * 44},84 ${100 + sd * 18},86 Z`, cel(c.pl, c.pls), 4.5) + ln(`M${100 + sd * 24},80 Q${100 + sd * 42},70 ${100 + sd * 62},80`, GOLD, 3);
      }
      body += hl(82, 84, 7, 3);
      head += pa('M90,34 L100,4 L110,34 Z', CHROME, 4) + ci(100, 22, 3, NEON, 2);
      head += bl(`<ellipse cx="100" cy="52" rx="31" ry="27"/><circle cx="74" cy="30" r="12"/><circle cx="126" cy="30" r="12"/>`, cel(c.b, c.s));
      head += bearEar(74, 30, 12, 4) + bearEar(126, 30, 12, 4);
      head += pa('M72,36 Q100,24 128,36 L127,42 Q100,32 73,42 Z', GOLD, 3) + pa('M95,31 L100,24 L105,31 L100,37 Z', 'url(#gNeon)', 2.5);
      head += rr(73, 41, 54, 17, 8.5, '#1d2547', 4) + glowEye(87, 49.5, 15, 7.5, -1, NEON) + glowEye(113, 49.5, 15, 7.5, 1, NEON);
      head += el(100, 67, 14, 9, c.l, 3.5) + pa('M95,62.5 Q100,60 105,62.5 Q103,66 100,66.5 Q97,66 95,62.5 Z', OL, 0) + ln('M93,71.5 Q100,74 107,71.5', OL, 2.6);
      head += hl(81, 40, 6, 2.5, -25, .4);
      front += motes('metal', { hy: 54 }) + (PET_LITE ? '' : spark4(28, 150, 6, NEON, 1.8, 'twinkle', .3));
      return { back, body, head, front, anc: A([100, 27, 50], [100, 49, 40], [100, 78, 50], [100, 80, 84, 96], [100, 106, 58, 52]), g: { hy: 52, hrx: 31, hry: 27 } };
    }
  };

  /* ===================== BỌ CẠP THÉP ===================== */
  // Nhận diện xuyên suốt: mai vòm đỏ, đuôi đốt cong vắt qua đầu, càng thép, mắt vàng.
  const sLeg = (pts_, w, col, foot = 0) => tube('M' + pts_.map(([x, y]) => P(x, y)).join(' L'), col, w, 3.2) + (foot ? ci(pts_[pts_.length - 1][0], pts_[pts_.length - 1][1], foot, col, 3) : '');
  // Chân xòe hình quạt: n chân mỗi bên, chân sau vẽ trước. hip/knee/foot = [x, y, bước x, bước y] theo chân
  function sLegs(n, col, w, hip, knee, foot, joint) {
    let s = '';
    for (let k = n - 1; k >= 0; k--) for (const sd of [-1, 1]) {
      const at = q => [100 + sd * (q[0] + k * q[2]), q[1] + k * q[3]], kn = at(knee), ft = at(foot);
      s += sLeg([at(hip), kn, ft], w * (1 - k * .08), col) + (joint ? ci(kn[0], kn[1], w * .55, joint, 2.5) : rivet(kn[0], kn[1], w * .36));
    }
    return s;
  }
  // Bụng đốt thuôn dần về gốc đuôi (nhìn từ trước, bụng chạy ra sau và lên trên)
  function abdomen(x0, y0, w0, x1, y1, w1, n, fill, line) {
    const d = `M${P(x0 - w0, y0)} C${P(x0 - w0, y0 - (y0 - y1) * .55)} ${P(x1 - w1 * 1.3, y1 + 4)} ${P(x1 - w1, y1)} Q${P(x1, y1 - w1 * .55)} ${P(x1 + w1, y1)} C${P(x1 + w1 * 1.3, y1 + 4)} ${P(x0 + w0, y0 - (y0 - y1) * .55)} ${P(x0 + w0, y0)} Z`;
    let s = pa(d, fill, 4.5);
    for (let i = 1; i <= n; i++) { const t = i / (n + 1), y = y0 + (y1 - y0) * t, x = x0 + (x1 - x0) * t, w = w0 + (w1 - w0) * t; s += ln(`M${P(x - w * .92, y + 2)} Q${P(x, y - w * .35)} ${P(x + w * .92, y + 2)}`, line, 3); }
    return s;
  }
  function sTail(B, n, r0, r1, fill, fn) {
    let s = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), [x, y] = bz(B, t), a = bzA(B, t) + 90, r = r0 + (r1 - r0) * t;
      s += `<g transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})">` + el(x, y, r, r * .78, fill, 4) + ln(`M${P(x - r * .7, y + r * .1)} Q${P(x, y + r * .55)} ${P(x + r * .7, y + r * .1)}`, OL, 1.8, 'opacity=".45"') + (fn ? fn(x, y, r, i) : '') + `</g>`;
    }
    return s;
  }
  const scorpion = {
    1(c) { // Bọ cạp đồ chơi lên dây cót, đuôi lò xo
      let back = '', body = '', head = '';
      back += windKey(86, 142, 232, 1.05);
      back += `<g class="pt">` + spring([[112, 156], [138, 146], [140, 112], [118, 104]], 9, 8.5) + ci(114, 101, 8, cel(c.b, c.s), 4) + hl(111, 98, 3, 1.6, -30, .7) + `</g>`;
      for (const sd of [-1, 1]) for (let k = 0; k < 3; k++) back += sLeg([[100 + sd * (20 + k * 5), 172 - k * 4], [100 + sd * (40 + k * 6), 182 - k * 7]], 5, c.pl, 4.2);
      body += pa('M63,176 Q60,136 100,134 Q140,136 137,176 Q100,183 63,176 Z', cel(c.b, c.s), 5.5);
      body += ln('M73,147 Q100,137 127,147', c.s, 2.4, 'opacity=".6"') + pa('M64,170 Q100,178 136,170 L136,177 Q100,186 64,177 Z', cel(c.pl, c.pls), 3.5) + rivet(76, 175.5, 1.9) + rivet(100, 179.5, 1.9) + rivet(124, 175.5, 1.9);
      body += hl(82, 145, 9, 4);
      head += cuteEyes(100, 157, 12.5, 8.6, '#ffd21f', c.b) + cheek(78, 166, 5, 3) + cheek(122, 166, 5, 3) + ln('M95,166 Q100,170 105,166', OL, 2.6);
      for (const sd of [-1, 1]) head += pa(capsule(100 + sd * 26, 168, 100 + sd * 42, 158, 5, 4.5), c.pl, 3.5) + pac(100 + sd * 47, 151, 9, sd < 0 ? -125 : -55, 26, cel(c.b, c.s), 4);
      return { back, body, head, front: '', anc: A([100, 137, 46], [100, 157, 40], [100, 171, 46], [100, 142, 56, 36], [100, 168, 50, 22]), g: { hy: 156, hrx: 36, hry: 22 } };
    },
    2(c) { // Bọ cạp kim loại: mai trước + đốt bụng xếp lớp, chân khớp, càng nhỏ
      let back = '', body = '', head = '';
      back += sTail([[110, 120], [144, 110], [148, 66], [117, 57]], 8, 10, 7.2, cel(c.b, c.s));
      back += pa('M114,51 Q98,52 93,70 Q102,63 115,64 Z', cel('#eef3fa', c.pls), 3.5);
      back += sLegs(3, c.pl, 5, [28, 168, -2, -5], [44, 154, 7, -9], [54, 187, 13, -4]);
      back += abdomen(100, 146, 30, 110, 121, 15, 2, cel(c.b, c.s), c.s);
      body += pa('M66,173 Q62,136 100,134 Q138,136 134,173 Q100,182 66,173 Z', cel(c.b, c.s), 5.5);
      body += ln('M72,146 Q100,136 128,146', c.s, 2.6, 'opacity=".7"') + pa('M67,167 Q100,176 133,167 L133,174 Q100,184 67,174 Z', cel(c.pl, c.pls), 3.5) + hl(82, 143, 8, 3.5);
      for (const sd of [-1, 1]) head += sLeg([[100 + sd * 28, 166], [100 + sd * 46, 160], [100 + sd * 52, 144]], 6, c.pl) + claw(100 + sd * 53, 140, 9.5, sd * 18, cel(c.pl, c.pls));
      head += eyes2(100, 155, 12, 7.5, 8, { iris: '#ffd21f', lid: .45, skin: c.b, pr: 4 }) + ln('M93,166 Q100,169 107,166', OL, 2.6) + pa('M94,168 l2,4 l2,-4 Z M102,168 l2,4 l2,-4 Z', '#fff', 1.6);
      return { back, body, head, front: '', anc: A([100, 136, 50], [100, 155, 38], [100, 170, 48], [100, 140, 62, 44], [100, 166, 54, 26]), g: { hy: 155, hrx: 34, hry: 21 } };
    },
    3(c) { // Bọ cạp giáp, càng lớn, đuôi kim năng lượng
      let back = '', body = '', head = '', front = '';
      back += sTail([[112, 104], [158, 92], [160, 38], [118, 30]], 9, 12.5, 8.5, cel(c.b, c.s), (x, y, r, i) => i % 3 === 1 ? rivet(x, y - r * .2, 1.8) : '');
      back += pa('M116,24 Q98,24 86,54 Q96,46 107,46 Q102,40 116,38 Z', 'url(#gNeon)', 3.5) + ln('M110,28 Q98,32 91,47', '#fff', 2, 'opacity=".85"');
      back += sLegs(3, c.pl, 6.5, [36, 164, -2, -6], [56, 148, 8, -11], [68, 187, 14, -5]);
      back += abdomen(100, 138, 40, 112, 105, 18, 3, cel(c.b, c.s), c.pl);
      body += pa('M58,171 Q54,124 100,122 Q146,124 142,171 Q100,183 58,171 Z', cel(c.b, c.s), 5.5);
      body += pa('M66,136 Q100,120 134,136 L134,143 Q100,128 66,143 Z', cel(c.pl, c.pls), 3) + rivet(78, 135, 2) + rivet(122, 135, 2);
      body += pa('M59,164 Q100,176 141,164 L141,172 Q100,185 59,172 Z', cel(c.pl, c.pls), 3.5) + hl(76, 132, 8, 3);
      for (const sd of [-1, 1]) head += sLeg([[100 + sd * 36, 160], [100 + sd * 60, 150], [100 + sd * 68, 122]], 8, c.pl) + rivet(100 + sd * 60, 150, 2.4) + claw(100 + sd * 68, 114, 15, sd * 12, cel(c.b, c.s), { trim: '#ffd21f' });
      head += ci(91, 141, 3, '#ffd21f', 2) + ci(109, 141, 3, '#ffd21f', 2);
      head += eyes2(100, 153, 13, 8, 7.5, { iris: '#ffd21f', lid: .85, skin: c.b, pr: 4 }) + ln('M90,166 Q100,170 110,166', OL, 2.8) + pa('M91,167 l2.4,5 l2.4,-5 Z M104.2,167 l2.4,5 l2.4,-5 Z', '#fff', 1.6);
      return { back, body, head, front, anc: A([100, 124, 58], [100, 153, 42], [100, 170, 58], [100, 128, 78, 56], [100, 163, 66, 30]), g: { hy: 150, hrx: 44, hry: 28 } };
    },
    4(c) { // Bọ cạp mecha khổng lồ, đuôi pháo năng lượng, giáp vàng crôm
      let back = '', body = '', head = '', front = '';
      back += steelAura(100, 100, 90, '#ff8a1f', NEON);
      back += sTail([[114, 94], [168, 80], [166, 22], [124, 14]], 9, 15, 11, cel(c.b, c.s), (x, y, r, i) => ln(`M${P(x - r * .8, y - r * .1)} Q${P(x, y - r * .62)} ${P(x + r * .8, y - r * .1)}`, '#ffd21f', 2.6));
      // đầu pháo: vỏ crôm thuôn, chúc xuống trước, miệng phát sáng
      back += `<g transform="rotate(32 108 22)">` + pa('M96,10 Q120,6 126,22 Q120,38 96,34 L88,30 L88,14 Z', CHROME, 4) + rr(100, 8, 7, 28, 3, GOLD, 3) + rr(84, 13, 8, 18, 3, '#2a1f40', 3.5) + `</g>`;
      back += glow(76, 36, 22, '#ff8a1f', .35) + `<g class="twinkle"><circle cx="76" cy="36" r="16" fill="none" stroke="#ffb21f" stroke-width="2.6" stroke-dasharray="4 5"/></g>` + ci(76, 36, 9.5, 'url(#gFlame)', 3.5) + ci(76, 36, 4, '#fff', 0);
      back += sLegs(3, c.pl, 8, [42, 162, -2, -6], [64, 142, 9, -12], [78, 188, 13, -5], GOLD);
      back += abdomen(100, 134, 50, 114, 94, 20, 3, cel(c.b, c.s), c.s) + [[100, 116], [108, 104], [112, 96]].map(([x, y]) => rivet(x, y, 2.2)).join('');
      body += pa('M46,171 Q42,118 100,116 Q158,118 154,171 Q100,185 46,171 Z', cel(c.b, c.s), 5.5);
      body += pa('M54,132 Q100,108 146,132 L146,141 Q100,118 54,141 Z', GOLD, 3.5) + pa('M92,118 L100,104 L108,118 L100,124 Z', 'url(#gNeon)', 3);
      body += pa('M72,140 Q100,132 128,140 L126,162 Q100,170 74,162 Z', '#2a0a1e', 4);
      body += neon('M56,160 Q100,174 144,160', NEON, 2.4) + pa('M47,165 Q100,180 153,165 L153,173 Q100,188 47,173 Z', cel(c.pl, c.pls), 3.5) + hl(66, 128, 8, 3);
      for (const sd of [-1, 1]) head += sLeg([[100 + sd * 42, 156], [100 + sd * 68, 142], [100 + sd * 76, 110]], 10, c.pl) + ci(100 + sd * 68, 142, 5.5, GOLD, 3) + claw(100 + sd * 76, 100, 19, sd * 14, cel(c.b, c.s), { edge: NEON, trim: '#ffd21f', sw: 5 });
      head += glowEye(88, 148, 15, 8, -1, '#ffd21f') + glowEye(112, 148, 15, 8, 1, '#ffd21f') + ci(93, 138, 2.6, '#ffb21f', 1.8) + ci(107, 138, 2.6, '#ffb21f', 1.8);
      head += pa('M89,157 l3,6 l3,-6 Z M105,157 l3,6 l3,-6 Z', '#fff', 1.8);
      front += motes('metal', { hy: 80 });
      return { back, body, head, front, anc: A([100, 117, 62], [100, 148, 44], [100, 166, 64], [100, 122, 92, 62], [100, 162, 76, 30]), g: { hy: 145, hrx: 54, hry: 28 } };
    }
  };

  /* ===================== BÒ TÓT THÉP ===================== */
  // Nhận diện xuyên suốt: khoen mũi vàng, đốm sáng trên trán, mắt đỏ, thân thép xanh than.
  const hoof = (x, y, w, col = '#2a2448') => pa(`M${P(x - w, y - 7)} Q${P(x, y - 11)} ${P(x + w, y - 7)} L${P(x + w, y + 1)} Q${P(x, y + 3)} ${P(x - w, y + 1)} Z`, col, 4) + ln(`M${P(x, y - 8)} V${f1(y + 1)}`, '#140a30', 2);
  const bLeg = (x0, y0, x1, y1, r, fill, hc) => pa(capsule(x0, y0, x1, y1 - 6, r, r * .9), fill, 4.5) + hoof(x1, y1 - 1, r * 1.05, hc);
  const nring = (x, y, r = 7) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .72)}" fill="none" stroke="${OL}" stroke-width="7"/><ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(r * .72)}" fill="none" stroke="#ffd21f" stroke-width="3.4"/>`;
  const blaze = (x, y, s, col) => pa(`M${P(x - 7 * s, y - 6 * s)} Q${P(x, y - 11 * s)} ${P(x + 7 * s, y - 6 * s)} Q${P(x + 4 * s, y + 2 * s)} ${P(x, y + 6 * s)} Q${P(x - 4 * s, y + 2 * s)} ${P(x - 7 * s, y - 6 * s)} Z`, col, 0);
  // Sừng ốc vít (dạng bé)
  const screwHorn = (x, y, a) => grp(rr(-4, -12, 8, 13, 2, '#e6edf7', 3) + ln('M-3,-9 l6,-2 M-3,-5 l6,-2 M-3,-1 l6,-2', '#7d92bd', 1.6) + el(0, -13, 7.5, 4, GOLD, 3) + ln('M-3.5,-13 h7', '#d99500', 1.8), x, y, a);
  // Hơi nước
  const puff = (x, y, r) => `<g class="ember">${ci(x, y, r, '#eef3fa', 2.5)}${ci(x + r * .8, y - r * .5, r * .7, '#eef3fa', 2.5)}${ci(x - r * .2, y - r * .2, r * .45, '#fff', 0)}</g>`;
  const bull = {
    1(c) { // Bê con robot, sừng ốc vít
      let back = '', body = '', head = '';
      back += `<g class="pt">` + tube('M140,152 Q152,150 154,138', c.s, 4, 3) + grp(pa('M-5,-3 L0,-6 L5,-3 L5,3 L0,6 L-5,3 Z', GOLD, 2.5) + ci(0, 0, 1.8, OL, 0), 155, 136) + `</g>`;
      back += bLeg(104, 166, 104, 184, 6.5, cel(c.s, c.s), c.hoof) + bLeg(138, 166, 140, 182, 6.5, cel(c.s, c.s), c.hoof);
      body += el(116, 158, 30, 18, cel(c.b, c.s), 5.5) + el(118, 162, 18, 9, c.l, 0) + rivet(132, 150, 1.9) + rivet(140, 156, 1.9);
      body += bLeg(92, 166, 92, 188, 7, cel(c.b, c.s), c.hoof) + bLeg(126, 168, 127, 188, 7, cel(c.b, c.s), c.hoof);
      head += screwHorn(72, 104, -20) + screwHorn(100, 104, 20);
      head += bl(`<ellipse cx="86" cy="127" rx="30" ry="26"/><ellipse cx="55" cy="121" rx="12" ry="6.5" transform="rotate(-20 55 121)"/><ellipse cx="117" cy="121" rx="12" ry="6.5" transform="rotate(20 117 121)"/>`, cel(c.b, c.s));
      head += el(52, 122, 6, 3, '#ff8fb1', 0, 'transform="rotate(-20 52 122)" opacity=".8"') + el(120, 122, 6, 3, '#ff8fb1', 0, 'transform="rotate(20 120 122)" opacity=".8"');
      head += blaze(86, 110, 1, c.l);
      head += el(86, 141, 20, 12.5, c.l, 3.5) + el(78, 140, 3.4, 2.4, OL, 0) + el(94, 140, 3.4, 2.4, OL, 0) + nring(86, 149, 6) + ln('M82,146 Q86,147.5 90,146', OL, 2);
      head += cuteEyes(86, 124, 12.5, 8.2, '#ff4d6a', c.b) + cheek(64, 134, 4.5, 2.8) + cheek(108, 134, 4.5, 2.8);
      head += hl(70, 113, 8, 3.5);
      return { back, body, head, front: '', anc: A([86, 102, 50], [86, 124, 38], [90, 152, 40], [116, 142, 46, 30], [116, 160, 40, 24]), g: { hx: 86, hy: 127, hrx: 30, hry: 26 } };
    },
    2(c) { // Bò tót bốn chân, giáp tấm trên lưng
      let back = '', body = '', head = '';
      back += tube('M164,128 Q174,140 172,158', c.s, 4.5, 3) + pa('M166,156 L178,156 L176,170 L168,170 Z', cel(c.pl, c.pls), 3);
      back += bLeg(98, 150, 98, 182, 8, cel(c.s, c.s), c.hoof) + bLeg(154, 148, 156, 180, 8, cel(c.s, c.s), c.hoof);
      body += bl(`<ellipse cx="120" cy="138" rx="48" ry="26"/><ellipse cx="88" cy="126" rx="28" ry="26"/>`, cel(c.b, c.s));
      body += el(108, 152, 30, 9, c.l, 0, 'opacity=".55"');
      for (const [x, y, r] of [[146, 118, 15], [124, 113, 16], [100, 108, 17]]) body += pa(`M${x - r},${y + 6} Q${x - r},${y - 8} ${x},${y - 9} Q${x + r},${y - 8} ${x + r},${y + 6} Q${x},${y + 1} ${x - r},${y + 6} Z`, cel(c.pl, c.pls), 3.5) + ln(`M${x - r * .7},${y + 1} Q${x},${y - 3} ${x + r * .7},${y + 1}`, RED, 2.2) + rivet(x, y - 4, 2);
      body += pa('M64,124 Q72,140 92,146 L96,132 Q80,128 70,118 Z', cel(c.pl, c.pls), 3.5);
      body += bLeg(82, 150, 80, 188, 9, cel(c.b, c.s), c.hoof) + bLeg(140, 152, 142, 188, 9, cel(c.b, c.s), c.hoof) + ln('M73,166 h14 M135,168 h14', c.s, 2.4);
      body += hl(82, 112, 8, 3.5);
      head += horn(48, 92, -1, 22, 6, cel(c.horn, '#a7b8d0'), .7, 4) + horn(84, 90, 1, 22, 6, cel(c.horn, '#a7b8d0'), .7, 4);
      head += bl(`<ellipse cx="66" cy="106" rx="26" ry="23"/><ellipse cx="38" cy="102" rx="11" ry="6" transform="rotate(-18 38 102)"/><ellipse cx="94" cy="100" rx="11" ry="6" transform="rotate(18 94 100)"/>`, cel(c.b, c.s));
      head += blaze(66, 90, .9, c.l);
      head += el(64, 121, 18, 11, c.l, 3.5) + el(57, 120, 3, 2.2, OL, 0) + el(71, 120, 3, 2.2, OL, 0) + nring(64, 128, 6.5);
      head += eyes2(66, 104, 11, 7, 7.5, { iris: RED, lid: .5, skin: c.b, pr: 3.8 });
      head += hl(54, 92, 6, 3);
      return { back, body, head, front: '', anc: A([66, 85, 42], [66, 104, 34], [74, 128, 42], [120, 110, 70, 50], [118, 140, 56, 34]), g: { hx: 66, hy: 106, hrx: 26, hry: 23 } };
    },
    3(c) { // Bò tót lao tới: cúi đầu, sừng thép, ống xả phun hơi
      let back = '', body = '', head = '', front = '';
      back += puff(150, 50, 7) + puff(166, 36, 9) + puff(134, 62, 5.5);
      for (const [x0, y0, x1, y1] of [[112, 98, 126, 64], [130, 100, 146, 70]]) back += tube(`M${x0},${y0} L${x1},${y1}`, '#56698c', 9, 3.5) + rr(x1 - 7, y1 - 6, 14, 9, 3, cel('#a7b8d0', '#56698c'), 3) + ci(x1, y1 - 2, 3, RED, 0);
      back += bLeg(92, 140, 104, 176, 9, cel(c.s, c.s), c.hoof) + bLeg(150, 134, 178, 176, 9, cel(c.s, c.s), c.hoof);
      body += `<g transform="rotate(-10 116 122)">` + bl(`<ellipse cx="122" cy="124" rx="52" ry="30"/><ellipse cx="88" cy="112" rx="34" ry="32"/>`, cel(c.b, c.s)) + `</g>`;
      body += pa('M64,104 Q86,80 116,88 L112,104 Q88,98 72,116 Z', cel(c.pl, c.pls), 4) + rivet(86, 94, 2.2) + rivet(102, 92, 2.2);
      body += el(110, 144, 30, 9, c.l, 0, 'opacity=".5" transform="rotate(-10 110 144)"') + pa('M96,128 Q124,120 150,104 L156,116 Q128,134 100,140 Z', cel(c.pl, c.pls), 3.5) + [108, 122, 136].map((x, i) => ci(x, 131 - i * 6.5, 2.6, RED, 1.6)).join('') + pa('M142,96 Q160,92 170,110 L160,114 Q154,102 140,106 Z', cel(c.pl, c.pls), 3.5);
      body += bLeg(72, 140, 50, 172, 10, cel(c.b, c.s), c.hoof) + bLeg(140, 140, 160, 188, 10, cel(c.b, c.s), c.hoof);
      body += puff(176, 178, 6) + puff(30, 184, 5);
      body += hl(84, 92, 8, 3.5);
      // đầu cúi thấp, sừng chĩa tới
      head += horn(62, 116, -1, 26, 6.5, cel(c.horn, '#a7b8d0'), 1.05, 4.5);
      head += bl(`<ellipse cx="50" cy="132" rx="26" ry="24"/><ellipse cx="78" cy="122" rx="11" ry="6" transform="rotate(25 78 122)"/>`, cel(c.b, c.s));
      head += horn(38, 118, -1, 30, 7.5, cel(c.horn, '#a7b8d0'), 1.1, 4.5);
      head += blaze(52, 116, .9, c.l);
      head += el(44, 148, 19, 11, c.l, 3.5) + el(36, 147, 3, 2.2, OL, 0) + el(51, 148, 3, 2.2, OL, 0) + nring(43, 156, 6.5);
      head += puff(18, 156, 5) + puff(14, 146, 3.5);
      head += eyes2(50, 131, 10.5, 7, 6.5, { iris: RED, lid: .9, skin: c.b, pr: 3.6 });
      return { back, body, head, front, anc: A([52, 110, 44], [50, 131, 32], [64, 150, 40], [116, 92, 76, 56], [116, 124, 60, 40]), g: { hx: 52, hy: 132, hrx: 26, hry: 24 } };
    },
    4(c) { // Bò tót mecha: sừng lưỡi năng lượng, động cơ rực lửa trên lưng
      let back = '', body = '', head = '', front = '';
      back += steelAura(100, 100, 90, RED, '#ffd21f');
      // động cơ chữ V sau vai: 4 ống xả phun lửa
      for (const [x, h, w] of [[62, 34, 15], [80, 44, 17], [120, 44, 17], [138, 34, 15]]) {
        const y = 66 - (h - 34) * .4;
        back += `<g class="flame">${flame(x, y - 12, h, w, x < 100 ? -3 : 3, true, 3.5)}</g>` + rr(x - 8, y - 14, 16, 30, 5, cel('#c9d4e6', '#56698c'), 3.5) + rr(x - 9.5, y - 16, 19, 7, 3, GOLD, 3);
      }
      back += bLeg(56, 144, 52, 180, 9.5, cel(c.s, c.s), c.hoof) + bLeg(144, 144, 148, 180, 9.5, cel(c.s, c.s), c.hoof);
      body += bl(`<ellipse cx="100" cy="124" rx="56" ry="38"/>`, cel(c.b, c.s));
      for (const sd of [-1, 1]) body += pa(`M${100 + sd * 22},94 Q${100 + sd * 50},86 ${100 + sd * 60},110 Q${100 + sd * 46},104 ${100 + sd * 26},112 Z`, CHROME, 4) + ln(`M${100 + sd * 28},100 Q${100 + sd * 46},96 ${100 + sd * 54},106`, GOLD, 2.6);
      body += neon('M52,128 Q60,150 74,160 M148,128 Q140,150 126,160', RED, 2.2) + hl(64, 104, 8, 3);
      body += pa('M78,128 Q100,120 122,128 L118,154 Q100,162 82,154 Z', cel(c.pl, c.pls), 4.5) + glow(100, 140, 16, '#ff8a1f', .35) + ci(100, 140, 9, 'url(#gFlame)', 3) + ci(100, 140, 3.5, '#fff', 0);
      for (const sd of [-1, 1]) body += bLeg(100 + sd * 26, 146, 100 + sd * 28, 189, 12, cel(c.b, c.s), '#1a1630') + pa(`M${100 + sd * 15},150 L${100 + sd * 39},150 L${100 + sd * 37},166 L${100 + sd * 17},166 Z`, CHROME, 3.5) + ln(`M${100 + sd * 19},158 H${100 + sd * 35}`, RED, 2.4);
      // sừng lưỡi năng lượng
      for (const sd of [-1, 1]) {
        const d = `M${100 + sd * 24},78 C${100 + sd * 52},82 ${100 + sd * 82},70 ${100 + sd * 92},28 C${100 + sd * 76},50 ${100 + sd * 56},62 ${100 + sd * 26},62 Z`;
        head += pa(d, RED, 9, 'opacity=".25" stroke-opacity="0"') + pa(d, lin('#ffe0e6', '#ff4d6a', '#b80f2e'), 4) + ln(`M${100 + sd * 34},70 C${100 + sd * 58},70 ${100 + sd * 78},58 ${100 + sd * 88},36`, '#fff', 2.2, 'opacity=".9"');
        head += rr(100 + sd * 26 - 7, 62, 14, 18, 5, GOLD, 3.5);
      }
      head += bl(`<path d="M68,72 Q68,50 100,48 Q132,50 132,72 L129,94 Q124,118 100,120 Q76,118 71,94 Z"/><ellipse cx="64" cy="84" rx="12" ry="6" transform="rotate(-15 64 84)"/><ellipse cx="136" cy="84" rx="12" ry="6" transform="rotate(15 136 84)"/>`, cel(c.b, c.s));
      head += pa('M72,66 Q100,52 128,66 L127,81 Q100,73 73,81 Z', '#1a1630', 4) + glowEye(86, 73, 15, 7.5, -1, RED) + glowEye(114, 73, 15, 7.5, 1, RED);
      head += pa('M90,56 L100,44 L110,56 L100,62 Z', GOLD, 3) + ci(100, 55, 2.6, RED, 0);
      head += pa('M78,96 Q100,89 122,96 Q122,114 100,118 Q78,114 78,96 Z', CHROME, 3.5) + el(90, 104, 3.6, 2.6, OL, 0) + el(110, 104, 3.6, 2.6, OL, 0) + nring(100, 116, 9.5) + hl(80, 60, 6, 2.5, -25, .4);
      front += motes('metal', { hy: 70 });
      return { back, body, head, front, anc: A([100, 50, 46], [100, 74, 40], [100, 124, 60], [100, 90, 96, 80], [100, 132, 66, 50]), g: { hy: 86, hrx: 28, hry: 38 } };
    }
  };

  /* ===================== KHỦNG LONG MÁY ===================== */
  // Nhận diện xuyên suốt: thân xanh ngọc, mặt kính/màn hình đỏ phát sáng, hàng tấm thép trên lưng.
  const dPlate = (x, y, h, a, fill, tip) => grp(pa(`M-7,4 L-5,${f1(-h * .6)} L0,${f1(-h)} L5,${f1(-h * .6)} L7,4 Z`, fill, 3.5) + (tip ? ci(0, -h * .62, 2.6, tip, 0) : ''), x, y, a);
  const teeth = (x0, x1, y, n, up = false) => { let d = ''; const w = (x1 - x0) / n; for (let i = 0; i < n; i++) d += `M${P(x0 + i * w, y)} l${f1(w / 2)},${up ? -5 : 5} l${f1(w / 2)},${up ? 5 : -5} `; return pa(d, '#fff', 1.8); };
  const toes = (x, y, w, sd = -1) => [-1, 0, 1].map(k => pa(`M${P(x + k * w * .55 - 2.4, y)} l${f1(sd * -1.2 + 2.4)},4.5 l2.4,-4.5 Z`, '#fff', 1.6)).join('');
  const mecha = {
    1(c) { // Trứng kim loại nở ra khủng long bé có mắt màn hình
      let back = '', body = '', head = '';
      back += `<g class="pt">` + tube('M128,170 Q148,170 150,152', c.b, 7, 3.5) + pa('M147,150 L156,146 L152,155 Z', '#d7e1f0', 2.5) + `</g>`;
      // vỏ trứng nằm ở lớp thân để khăn/đai vẫn hiện trên vỏ; đầu cắt theo mép răng cưa nên trông như chui ra từ trong
      body += pa('M64,151 L71,143 L78,151 L86,142 L94,151 L101,142 L108,151 L116,142 L123,151 L130,144 L136,152 C138,172 124,188 100,188 C76,188 62,172 64,151 Z', cel(c.pl, c.pls), 5);
      body += ln('M67,168 Q100,176 133,168', '#56698c', 2.4) + rivet(76, 170.5, 2) + rivet(100, 174, 2) + rivet(124, 170.5, 2) + hl(78, 158, 7, 3);
      head += pa('M75,148 C70,140 69,132 71,124 C73,110 85,101 100,101 C115,101 127,110 129,124 C131,132 130,140 125,148 L123,151 L116,142 L108,151 L101,142 L94,151 L86,142 L78,151 Z', cel(c.b, c.s), 5);
      head += rr(80, 113, 40, 25, 10, '#1d2547', 3.5) + rr(85.5, 118, 8, 11, 4, '#ff4d6a', 0) + rr(106.5, 118, 8, 11, 4, '#ff4d6a', 0) + ci(88, 120.5, 1.8, '#fff', 0) + ci(109, 120.5, 1.8, '#fff', 0) + ln('M96,132 Q100,135 104,132', NEON, 2) + rr(82, 128, 5, 2.6, 1.3, '#ff8fb1', 0, 'opacity=".8"') + rr(113, 128, 5, 2.6, 1.3, '#ff8fb1', 0, 'opacity=".8"');
      head += grp(pa('M-22,8 L-16,2 L-10,8 L-4,1 L2,8 L8,2 L14,8 L20,3 L23,6 C22,-10 12,-17 0,-17 C-13,-17 -23,-9 -22,8 Z', cel(c.pl, c.pls), 4) + rivet(-10, -6, 1.9) + rivet(6, -8, 1.9) + hl(-8, -11, 6, 2.5), 99, 99, -12);
      for (const sd of [-1, 1]) head += ci(100 + sd * 24, 148, 7, cel(c.b, c.s), 3.5) + pa(`M${P(100 + sd * 24 - 5, 152)} l2,5 l2,-5 Z M${P(100 + sd * 24 + 1, 152)} l2,5 l2,-5 Z`, '#fff', 1.4);
      return { back, body, head, front: '', anc: A([100, 86, 44], [100, 124, 40], [100, 147, 50], [100, 132, 52, 44], [100, 168, 60, 32]), g: { hy: 120, hrx: 29, hry: 25 } };
    },
    2(c) { // Khủng long máy chạy hai chân
      let back = '', body = '', head = '';
      back += `<g class="pt">` + pa('M126,112 C150,104 172,96 194,76 C188,98 166,118 132,134 Z', cel(c.b, c.s), 4.5) + ln('M146,108 l5,8 M160,100 l5,8 M174,92 l4,7', c.s, 2.4) + pa('M188,80 L198,70 L196,84 Z', '#d7e1f0', 3) + `</g>`;
      back += tube('M120,134 L136,150 L150,162', c.s, 12, 3.5) + pa('M146,160 L162,164 L156,172 L144,170 Z', cel(c.s, c.s), 3.5);
      for (const [x, y, h, a] of [[96, 94, 12, -30], [110, 98, 13, -10], [124, 104, 11, 10]]) back += dPlate(x, y, h, a, cel(c.pl, c.pls));
      body += `<g transform="rotate(-18 110 120)">` + el(110, 120, 28, 21, cel(c.b, c.s), 5.5) + el(104, 128, 17, 10, c.l, 0) + `</g>`;
      body += tube('M102,134 L94,156 L84,176', c.b, 13, 3.5) + pa('M70,188 Q72,176 84,174 Q94,176 94,188 Z', cel(c.b, c.s), 4) + toes(78, 188, 9);
      body += tube('M90,118 L82,126', c.b, 5, 3) + pa('M80,124 l-4,4 M81,127 l-3,5', '#fff', 1.6);
      head += pa('M38,90 Q36,70 62,64 Q88,60 94,80 Q98,100 86,108 L50,110 Q40,106 38,90 Z', cel(c.b, c.s), 5.5);
      head += pa('M46,98 L84,98 L84,104 Q66,108 48,104 Z', c.l, 0) + ln('M46,98 H86', OL, 3) + teeth(48, 84, 98, 6);
      head += rr(52, 76, 40, 13, 6.5, '#1d2547', 3.5) + rr(58, 79, 10, 7, 3.5, '#ff4d6a', 0) + rr(76, 79, 10, 7, 3.5, '#ff4d6a', 0) + ci(60.5, 81, 1.4, '#fff', 0) + ci(78.5, 81, 1.4, '#fff', 0);
      head += el(43, 86, 2, 1.4, OL, 0) + pa('M64,64 L70,54 L76,63 Z', cel(c.pl, c.pls), 3) + hl(60, 70, 7, 3);
      return { back, body, head, front: '', anc: A([68, 64, 44], [72, 82, 36], [92, 108, 36], [112, 102, 50, 40], [108, 122, 44, 34]), g: { hx: 68, hy: 86, hrx: 28, hry: 22 } };
    },
    3(c) { // T-rex mecha: hàm há, đuôi khớp nối, đèn neon dọc lưng
      let back = '', body = '', head = '';
      // đuôi khớp nối
      const TB = [[132, 136], [164, 150], [186, 150], [194, 118]];
      for (let i = 0; i < 7; i++) { const t = i / 6, [x, y] = bz(TB, t), r = 15 - t * 9; back += ci(x, y, r, cel(c.b, c.s), 4) + (i % 2 ? rivet(x, y, 1.8) : ''); }
      back += pa('M190,114 L198,98 L200,116 Z', '#d7e1f0', 3);
      back += neon('M84,40 Q120,48 136,90 Q146,120 164,144 Q180,152 188,140', NEON, 2.2);
      for (const [x, y, h, a] of [[96, 42, 14, 10], [114, 54, 16, 30], [128, 72, 15, 40], [138, 94, 13, 50], [146, 116, 11, 60]]) back += dPlate(x, y, h, a, cel(c.pl, c.pls), NEON);
      back += tube('M134,140 L148,166 L148,180', c.s, 13, 3.5) + pa('M136,188 Q138,176 150,176 Q162,176 162,188 Z', cel(c.s, c.s), 4);
      body += `<g transform="rotate(14 108 112)">` + el(108, 114, 33, 40, cel(c.b, c.s), 5.5) + `</g>`;
      body += pa('M88,92 Q102,96 104,120 Q104,140 96,150 Q84,140 82,118 Z', c.l, 3) + ln('M86,106 Q94,108 101,106 M84,118 Q93,121 102,118 M86,130 Q94,133 101,131', c.s, 2.2);
      body += el(118, 140, 22, 20, cel(c.b, c.s), 5) + rivet(118, 140, 2.6) + pa('M104,128 Q118,118 134,130', 'none', 0) + ln('M104,130 Q118,120 133,130', c.pl, 3);
      body += tube('M110,154 L104,176', c.b, 14, 3.5) + pa('M88,189 Q90,174 104,173 Q118,174 118,189 Z', cel(c.b, c.s), 4.5) + toes(97, 189, 11);
      body += tube('M84,112 L74,122 L70,118', c.b, 6, 3) + pa('M68,116 l-5,2 M69,120 l-4,4', '#fff', 1.6);
      body += pa('M116,100 Q134,96 140,112 L130,116 Q126,106 116,108 Z', cel(c.pl, c.pls), 3.5) + hl(98, 88, 6, 3);
      // đầu: hàm trên + hàm dưới há
      head += pa('M44,64 L94,68 Q100,84 84,92 L48,86 Q40,78 44,64 Z', cel(c.b, c.s), 5) + teeth(50, 86, 70, 6, true);
      head += pa('M36,52 Q34,30 64,26 Q96,24 104,46 Q108,64 96,70 L44,66 Q36,62 36,52 Z', cel(c.b, c.s), 5.5);
      head += teeth(46, 92, 65, 7) + rr(56, 36, 42, 13, 6.5, '#1d2547', 3.5) + rr(78, 38.5, 15, 8, 4, '#ff2e4a', 0) + ci(81, 40.5, 1.6, '#fff', 0) + rr(61, 39, 9, 7, 3.5, '#ff2e4a', 0, 'opacity=".75"');
      head += el(41, 46, 2.2, 1.5, OL, 0) + pa('M60,28 Q78,22 98,34 L96,36 Q78,28 60,32 Z', cel(c.pl, c.pls), 3) + rivet(70, 29, 1.8) + rivet(86, 30, 1.8) + hl(52, 34, 7, 3);
      return { back, body, head, front: '', anc: A([70, 27, 48], [74, 42, 36], [96, 76, 42], [118, 66, 56, 70], [104, 116, 46, 48]), g: { hx: 70, hy: 48, hrx: 34, hry: 22 } };
    },
    4(c) { // Khủng long mecha tối thượng: vây phản lực, lõi năng lượng, gầm phát sáng
      let back = '', body = '', head = '', front = '';
      back += steelAura(104, 98, 90, NEON, '#ff4fd8');
      // vây phản lực xòe như cánh: cánh gần (phải, hướng lên), cánh xa (trái, thấp sau cổ)
      const vane = (x0, y0, x1, y1, w) => {
        const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, m = [x0 + ux * L * .3, y0 + uy * L * .3];
        return pa(`M${P(x0 + nx * w * .6, y0 + ny * w * .6)} Q${P(m[0] + nx * w * 1.15, m[1] + ny * w * 1.15)} ${P(x1, y1)} L${P(m[0] - nx * w * .45, m[1] - ny * w * .45)} L${P(x0 - nx * w * .6, y0 - ny * w * .6)} Z`, cel(c.pl, c.pls), 4.5) +
          ln(`M${P(m[0] - nx * w * .1, m[1] - ny * w * .1)} L${P(x1 - ux * 10, y1 - uy * 10)}`, c.pls, 2.2) +
          neon(`M${P(x0 + ux * L * .18 - nx * w * .38, y0 + uy * L * .18 - ny * w * .38)} L${P(x1 - ux * 8 - nx * 1.5, y1 - uy * 8 - ny * 1.5)}`, NEON, 2.2);
      };
      back += vane(98, 112, 20, 136, 15) + vane(96, 98, 8, 74, 19);
      back += vane(122, 104, 198, 76, 16) + vane(116, 84, 186, 8, 21);
      for (const [x, y, a] of [[142, 104, -24], [84, 118, 28]]) back += `<g transform="rotate(${a} ${x} ${y})">` + jet(x, y + 14, 22, 12) + rr(x - 10, y - 10, 20, 26, 6, cel(c.pl, c.pls), 4) + rr(x - 8, y + 12, 16, 6, 3, '#1d2547', 3) + `</g>`;
      // đuôi lớn khớp nối, đầu đuôi lưỡi năng lượng
      const TB = [[132, 146], [168, 160], [192, 160], [196, 128]];
      for (let i = 0; i < 7; i++) { const t = i / 6, [x, y] = bz(TB, t), r = 17 - t * 9; back += ci(x, y, r, cel(c.b, c.s), 4) + ln(`M${P(x - r * .6, y - r * .5)} Q${P(x, y - r * .9)} ${P(x + r * .6, y - r * .5)}`, '#ffd21f', 2.2); }
      back += pa('M192,124 L200,96 L202,126 Z', 'url(#gNeon)', 3);
      back += tube('M136,148 L150,170 L150,182', c.s, 15, 3.5) + pa('M136,190 Q138,176 152,176 Q166,176 166,190 Z', cel(c.s, c.s), 4.5);
      body += `<g transform="rotate(10 106 116)">` + el(106, 118, 38, 44, cel(c.b, c.s), 5.5) + `</g>`;
      body += pa('M84,90 Q104,92 110,118 Q110,142 100,154 Q82,142 78,116 Z', CHROME, 3.5) + ln('M82,106 Q96,108 106,104 M80,124 Q95,127 108,122', '#56698c', 2.2);
      body += glow(96, 114, 22, NEON, .35) + ci(96, 114, 13, GOLD, 4) + ci(96, 114, 8.5, 'url(#gNeon)', 2.5) + ci(96, 114, 3.5, '#fff', 0);
      body += el(122, 146, 24, 22, cel(c.b, c.s), 5) + pa('M106,134 Q122,124 140,136 L136,142 Q122,132 108,140 Z', GOLD, 3) + ci(122, 148, 6, CHROME, 3);
      body += tube('M114,160 L106,178', c.b, 16, 3.5) + pa('M88,190 Q90,174 106,173 Q122,174 122,190 Z', cel(c.b, c.s), 4.5) + toes(98, 190, 12) + ln('M92,180 H120', GOLD, 2.6);
      body += tube('M80,118 L68,126 L64,120', c.b, 7, 3) + pa('M62,117 l-6,2 M63,122 l-5,5', '#fff', 1.8);
      body += pa('M112,94 Q138,88 146,108 L134,114 Q128,102 114,104 Z', CHROME, 3.5) + ln('M118,96 Q134,94 140,104', GOLD, 2.4);
      // đầu ngẩng cao gầm, miệng phát sáng
      head += pa('M40,48 L94,58 Q100,76 84,84 L48,74 Q38,64 40,48 Z', cel(c.b, c.s), 5);
      head += pa('M48,50 L90,56 Q92,70 82,76 L52,68 Q46,60 48,50 Z', 'url(#gNeon)', 0) + el(70, 62, 12, 5, '#fff', 0, 'opacity=".85" transform="rotate(12 70 62)"');
      head += teeth(50, 88, 60, 6, true);
      head += pa('M34,40 Q30,16 62,10 Q98,6 108,30 Q112,48 98,54 L42,50 Q34,48 34,40 Z', cel(c.b, c.s), 5.5);
      head += teeth(44, 94, 49, 7) + pa('M54,24 L100,26 L98,38 L56,38 Z', '#1d2547', 3.5) + rr(58, 26, 40, 13, 6.5, RED, 0, 'opacity=".35"') + pa('M62,33 Q78,27 95,29 L94,34 Q78,33 62,37 Z', RED, 2.6) + ln('M68,33 Q80,30 90,31', '#fff', 2, 'opacity=".9"');
      head += pa('M56,14 Q80,4 104,20 L100,24 Q80,12 58,18 Z', GOLD, 3) + pa('M74,10 L80,-2 L86,10 Z', CHROME, 3) + el(39, 34, 2.2, 1.5, OL, 0) + hl(50, 20, 7, 3);
      front += `<g class="flick">` + [14, 24].map(r => ln(`M${P(36 - r * .5, 60 - r * .9)} Q${P(36 - r * 1.25, 64)} ${P(36 - r * .5, 68 + r * .9)}`, NEON, 3.2, 'opacity=".8"')).join('') + `</g>` + motes('metal', { hy: 60 });
      return { back, body, head, front, anc: A([72, 12, 50], [76, 31, 38], [96, 84, 46], [114, 72, 66, 84], [100, 120, 50, 52]), g: { hx: 72, hy: 32, hrx: 36, hry: 22 } };
    }
  };

  PET_SPECS.bear = {
    el: 'metal',
    c: { b: '#a7b8d0', s: '#56698c', l: '#e6edf7', pl: '#7d90b3', pls: '#3d4c70' },
    c4: { b: '#7487b4', s: '#323c6a', pl: '#9aabcd', pls: '#3a4573' },
    draw(f, g, c) {
      const C = f === 1 ? Object.assign({}, c, { b: '#c4d5ee', s: '#7f95c0', l: '#f4f8ff' }) : f === 2 ? Object.assign({}, c, { b: '#b4c6e2', s: '#6a7fa8', pl: '#93a7ca', pls: '#55688f' }) : c;
      return bear[f](C);
    }
  };
  PET_SPECS.bull = {
    el: 'metal',
    c: { b: '#6f7fa8', s: '#3a4670', l: '#c9d3ea', horn: '#eef3fa', hoof: '#2a2448', pl: '#a7b8d0', pls: '#56698c' },
    c4: { b: '#56649a', s: '#262e55', l: '#c9d3ea', pl: '#7d8cba', pls: '#2f3860' },
    draw(f, g, c) {
      const C = f === 1 ? Object.assign({}, c, { b: '#93a8dc', s: '#5a6aa6', l: '#eef2fb' }) : f === 2 ? Object.assign({}, c, { b: '#7f92c8', s: '#43508a' }) : c;
      return bull[f](C);
    }
  };
  PET_SPECS.mecha = {
    el: 'metal',
    c: { b: '#2fc4a8', s: '#137a6a', l: '#d8fff4', pl: '#a7b8d0', pls: '#56698c' },
    c4: { b: '#18a08a', s: '#08524a', pl: '#8fa2c0', pls: '#3d4c70' },
    draw(f, g, c) {
      const C = f === 1 ? Object.assign({}, c, { b: '#4fe3c6', s: '#1c9a84', pl: '#c9d5e8', pls: '#7d90b3' }) : c;
      return mecha[f](C);
    }
  };
  PET_SPECS.scorpion = {
    el: 'metal',
    c: { b: '#e8584a', s: '#9e2a2e', l: '#ffd0b8', pl: '#a7b8d0', pls: '#56698c' },
    c4: { b: '#b8243a', s: '#5e0f22', pl: '#c9d4e6', pls: '#56698c' },
    draw(f, g, c) {
      const C = f === 1 ? Object.assign({}, c, { b: '#ff7a5c', s: '#d0433a', pl: '#c9d5e8', pls: '#7d90b3' }) : c;
      return scorpion[f](C);
    }
  };
})();

/* ===================== HỆ LỬA v3: Sói Lửa, Rồng Lửa, Kỳ Nhông Dung Nham, Phượng Hoàng ===================== */
// Mỗi dạng là một dáng riêng (bé con → thiếu niên → trưởng thành → tối thượng), không dùng RIG chung.
// Thay 4 khối PET_SPECS.wolf / .dragon / .salamander / .phoenix cũ trong js/pets.js (xem NOTES.md).
// Cần: gfx.js (pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, flame, eye, capsule, OL) và pets.js (PET_SPECS, PET_LITE).
// Đặt sau dòng `const PET_SPECS = {};` (IIFE chạy ngay khi nạp). Mọi hàm phụ nằm trong IIFE nên không đụng tên của hệ khác.
// draw(f, g, c) giữ chữ ký cũ; g và c bị bỏ qua vì mỗi dạng có hình học và bảng màu riêng.
// Kết quả trả về thêm `fxg` (hình học đầu thật) cho hiệu ứng bám đầu như halo; app cũ bỏ qua trường này cũng không lỗi.
(() => {
  const R = Math.PI / 180;
  const E = (cx, cy, rx, ry, a = 0) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"${a ? ` transform="rotate(${f1(a)} ${f1(cx)} ${f1(cy)})"` : ''}/>`;
  const D = d => `<path d="${d}"/>`;
  const CAP = (x1, y1, x2, y2, r1, r2 = r1) => D(capsule(x1, y1, x2, y2, r1, r2));
  const rot = (s, a, x, y) => `<g transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})">${s}</g>`;
  // Ngọn lửa xoay theo góc a (0 = thẳng đứng), chân tại (x, y)
  const fl = (x, y, h, w, a = 0, sw = 4, core = true) => a ? rot(flame(x, y, h, w, 0, core, sw), a, x, y) : flame(x, y, h, w, 0, core, sw);
  // Tai nhọn: gốc (bx, by), bên sd, cao h, rộng w, nghiêng tilt (độ, dương = chĩa ra ngoài)
  function ear(bx, by, sd, h, w, tilt, inner = .62) {
    const t = tilt * R, tx = bx + sd * Math.sin(t) * h, ty = by - Math.cos(t) * h;
    const ax = bx - sd * w * .5, bx2 = bx + sd * w * .5;
    const o = `M${P(ax, by + 3)} Q${P(ax + (tx - ax) * .3 - sd * 3, by - h * .62)} ${P(tx, ty)} Q${P(bx2 + (tx - bx2) * .25 + sd * 4, by - h * .45)} ${P(bx2, by + 4)} Z`;
    const k = inner, cx = bx + (tx - bx) * .1, cy = by - 2;
    const ix1 = cx - sd * w * .26 * k * 1.4, ix2 = cx + sd * w * .22 * k * 1.4, itx = bx + (tx - bx) * .82, ity = by - (by - ty) * .8;
    const i = `M${P(ix1, cy + 2)} Q${P(ix1 + (itx - ix1) * .35 - sd * 2, by - h * .5)} ${P(itx, ity)} Q${P(ix2 + (itx - ix2) * .3 + sd * 2, by - h * .35)} ${P(ix2, cy + 3)} Z`;
    return { o, i, tip: [tx, ty] };
  }
  // Mắt: kiểu dễ thương (f1) → sắc, phát sáng (f4)
  const eyeC = (cx, cy, rx, ry, sd, iris, o = {}) => eye(cx, cy, rx, ry, sd, Object.assign({ iris, lid: 0, brow: false, pr: rx * .58 }, o));
  const blush = (x, y, rx = 6.5, ry = 3.6) => el(x, y, rx, ry, '#ff7a9a', 0, 'opacity=".55"');
  // Hào quang lửa riêng (tâm cx, cy)
  function sunAura(cx, cy, r, cols, n = 12) {
    if (PET_LITE) return '';
    let rays = '';
    for (let i = 0; i < n; i++) {
      const a0 = (i * 360 / n - 360 / n / 3.2) * R, a1 = (i * 360 / n + 360 / n / 3.2) * R;
      rays += `<path d="M${P(cx, cy)} L${P(cx + r * 1.15 * Math.cos(a0), cy + r * 1.15 * Math.sin(a0))} L${P(cx + r * 1.15 * Math.cos(a1), cy + r * 1.15 * Math.sin(a1))} Z" fill="${i % 2 ? cols[0] : cols[1]}"/>`;
    }
    return `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${cols[0]}" opacity=".16"/><g class="aura" opacity=".3"><g class="spin" style="transform-origin:${f1(cx)}px ${f1(cy)}px">${rays}</g></g>` +
      `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * .78)}" fill="none" stroke="${cols[1]}" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round" opacity=".7"/>`;
  }
  // Tàn lửa bay (dạng 4)
  function embers(spots, cols = ['#ff8a1f', '#ffd21f']) {
    if (PET_LITE) return '';
    return `<g class="motes">` + spots.map(([x, y, r], i) => `<g class="ember" style="animation-delay:-${f1(i * .45)}s">${fl(x, y + r, r * 2.2, r * 1.5, (i % 3 - 1) * 12, 1.8, false)}</g>`).join('') + `</g>`;
  }
  const anc = (head, eyes, neck, back, body) => ({ head, eyes, neck, back, body });
  // Co giãn cả dạng quanh điểm chạm đất (100, 188) để đúng tỷ lệ khung; neo đổi theo.
  // fxg: hình học đầu thật cho hiệu ứng theo đầu (halo), xem NOTES.md
  function fit(p, k) {
    const tx = x => 100 + (x - 100) * k, ty = y => 188 + (y - 188) * k;
    if (k !== 1) {
      const T = s_ => s_ ? `<g transform="translate(${f1(100 * (1 - k))} ${f1(188 * (1 - k))}) scale(${k})">${s_}</g>` : s_;
      const A = {};
      for (const [key, a] of Object.entries(p.anc)) A[key] = [tx(a[0]), ty(a[1])].concat(a.slice(2).map(v => v * k)).map(f1);
      p = { back: T(p.back), body: T(p.body), head: T(p.head), front: T(p.front), anc: A };
    }
    const h = p.anc.head, e = p.anc.eyes;
    p.fxg = { hx: h[0], hy: e[1], hry: e[1] - h[1] + 8, hrx: h[2] * .64 };
    return p;
  }

  /* =============================== SÓI LỬA =============================== */
  // Nhận diện xuyên suốt: chóp đuôi lửa, ngọn lửa trên trán, mặt nạ kem hình chữ V
  const WOLF = [null,
    { b: '#ff8a3d', s: '#e0561c', l: '#fff1d8', ls: '#f5c99a', d: '#a8340e', i: '#ffb21f', in: '#ffd27a' },
    { b: '#ff7130', s: '#cc4214', l: '#ffe8c8', ls: '#f0bb88', d: '#922a0b', i: '#ffb21f', in: '#ffcf5a' },
    { b: '#ff5a1f', s: '#b8320c', l: '#ffe2bc', ls: '#e8a874', d: '#7a1f08', i: '#ffd21f', in: '#ffc23a' },
    { b: '#f0441a', s: '#8a1a08', l: '#ffd9a8', ls: '#e09454', d: '#5c1206', i: '#fff59a', in: '#ffd21f' }
  ];
  // Chân: chuỗi khớp [[x, y, r], ...] thành một khối
  const limb = pts => pts.slice(1).map((q, i) => CAP(pts[i][0], pts[i][1], q[0], q[1], pts[i][2], q[2])).join('');
  // Mặt sói nhìn thẳng: mặt nạ kem, mũi, mõm (dùng chung 4 dạng)
  function wolfFace(hx, hy, k, c, o = {}) {
    let s = pa(`M${P(hx - 24 * k, hy + 2 * k)} Q${P(hx - 12 * k, hy - 4 * k)} ${P(hx, hy + 3 * k)} Q${P(hx + 12 * k, hy - 4 * k)} ${P(hx + 24 * k, hy + 2 * k)} Q${P(hx + 18 * k, hy + 27 * k)} ${P(hx, hy + 27 * k)} Q${P(hx - 18 * k, hy + 27 * k)} ${P(hx - 24 * k, hy + 2 * k)} Z`, c.l, 0);
    s += el(hx, hy + 9 * k, 5 * k, 3.6 * k, OL, 0) + hl(hx - 1.5 * k, hy + 8 * k, 1.5 * k, 1 * k, 0, .8);
    if (o.open) s += pa(`M${P(hx - 7 * k, hy + 14 * k)} Q${P(hx, hy + 12 * k)} ${P(hx + 7 * k, hy + 14 * k)} Q${P(hx + 6 * k, hy + 25 * k)} ${P(hx, hy + 25 * k)} Q${P(hx - 6 * k, hy + 25 * k)} ${P(hx - 7 * k, hy + 14 * k)} Z`, '#7a1030', 3) +
      pa(`M${P(hx - 5.5 * k, hy + 14.5 * k)} l2,4.2 l2,-4.2 M${P(hx + 1.5 * k, hy + 14.5 * k)} l2,4.2 l2,-4.2`, '#fff', 1.6) + el(hx, hy + 22 * k, 3.4 * k, 2 * k, '#ff6a8a', 0);
    else s += ln(`M${P(hx - 8 * k, hy + 15 * k)} Q${P(hx - 4 * k, hy + 19 * k)} ${P(hx, hy + 15 * k)} Q${P(hx + 4 * k, hy + 19 * k)} ${P(hx + 8 * k, hy + 14.5 * k)}`, OL, 2.8) +
      (o.fang ? pa(`M${P(hx + 2.6 * k, hy + 16.5 * k)} l2,${f1(4.5 * k)} l2,${f1(-4.8 * k)}` + (o.fang > 1 ? ` M${P(hx - 6.6 * k, hy + 16.5 * k)} l2,${f1(4.5 * k)} l2,${f1(-4.5 * k)}` : ''), '#fff', 1.8) : '');
    return s;
  }
  const wolfTuft = (hx, hy, sd, k, n = 2) => {
    let d = `M${P(hx + sd * 21 * k, hy - 2 * k)}`;
    for (let i = 0; i < n; i++) d += ` L${P(hx + sd * (31 + i * 2) * k, hy + (5 + i * 9) * k)} L${P(hx + sd * 24 * k, hy + (9 + i * 9) * k)}`;
    return D(d + ` L${P(hx + sd * 13 * k, hy + (12 + n * 8) * k)} Z`);
  };
  const wolf1 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi bông nhỏ cong lên, chóp có lửa
    back += `<g class="pt">` +
      pa('M116,184 C134,188 150,180 151,162 C152,152 148,145 143,142 C141,154 136,166 118,170 Z', cel(c.b, c.s), 5) +
      fl(145, 150, 22, 15, 14, 3.8) + `</g>`;
    // Thân ngồi tròn + hai đùi + chân trước, một khối
    body += bl(E(100, 162, 25, 23) + E(78, 175, 14, 11.5) + E(122, 175, 14, 11.5) + CAP(91, 160, 91, 179, 8.5) + CAP(109, 160, 109, 179, 8.5), cel(c.b, c.s));
    body += pa('M86,146 L114,146 L110,160 L105,155 L100,167 L95,155 L90,160 Z', c.l, 0);
    body += ln('M100,168 V182 M80,170 q4,6 4,12 M120,170 q-4,6 -4,12', c.s, 2.4);
    body += el(90, 183, 8.6, 5.6, c.l, 4) + el(110, 183, 8.6, 5.6, c.l, 4) + ln('M87.5,186 v-3 M92.5,186 v-3 M107.5,186 v-3 M112.5,186 v-3', OL, 2);
    // Đầu tròn to, tai lớn, má xù
    const L = ear(80, 101, -1, 27, 24, 16), Rr = ear(120, 101, 1, 27, 24, 16);
    const tuft = sd => D(`M${P(100 + sd * 30, 108)} L${P(100 + sd * 40, 116)} L${P(100 + sd * 34, 120)} L${P(100 + sd * 41, 128)} L${P(100 + sd * 33, 131)} L${P(100 + sd * 37, 139)} L${P(100 + sd * 24, 138)} Z`);
    head += bl(E(100, 121, 35, 30) + D(L.o) + D(Rr.o) + tuft(-1) + tuft(1), cel(c.b, c.s));
    head += pa(L.i, c.in, 0) + pa(Rr.i, c.in, 0);
    head += pa('M70,124 Q84,117 100,124 Q116,117 130,124 Q128,146 100,150 Q72,146 70,124 Z', c.l, 0);
    head += fl(100, 99, 17, 12, 0, 3.5);
    head += el(100, 131, 5.2, 3.8, OL, 0) + hl(98.5, 129.8, 1.6, 1, 0, .8);
    head += ln('M93,137 Q96.5,141 100,137 Q103.5,141 107,137', OL, 2.8) + pa('M98,139.5 Q100,146 102,139.5 Z', '#ff6a8a', 2);
    head += eyeC(85, 120, 10, 11.5, -1, c.i) + eyeC(115, 120, 10, 11.5, 1, c.i);
    head += blush(76, 133) + blush(124, 133);
    head += hl(80, 109, 7, 3.4, -25, .5);
    return { back, body, head, front, anc: anc([100, 98, 54], [100, 120, 48], [100, 148, 38], [100, 148, 44, 34], [100, 162, 36, 40]) };
  };
  const wolf2 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi dài vẫy về sau, chóp lửa
    back += `<g class="pt" style="transform-origin:0% 85%">` +
      pa('M152,116 C166,112 176,102 181,88 C188,100 186,120 172,130 C166,134 158,134 152,130 Z', cel(c.b, c.s), 5) +
      fl(182, 94, 30, 18, 36, 4) + `</g>`;
    // Chân phía xa (tối): trước co về sau, sau bước tới
    back += bl(limb([[88, 138, 8], [94, 156, 6.5], [86, 168, 5.5]]) + E(82, 170, 8.5, 5.5, -30) + limb([[132, 136, 9], [122, 158, 6.5], [124, 176, 5.5]]) + E(120, 182, 9, 5.5), cel(c.s, c.d), 4.5);
    // Thân thon + chân gần, một khối
    const torsoD = 'M72,106 C90,112 104,116 124,114 C140,112 154,114 158,126 C162,138 154,146 144,146 C128,146 116,142 104,144 C90,146 72,150 64,138 C56,128 58,116 62,108 Z';
    body += bl(D(torsoD) + limb([[72, 134, 9], [68, 154, 7.5], [62, 176, 6]]) + E(56, 182, 10, 6) + E(146, 134, 14, 15, -20) + limb([[148, 140, 9.5], [160, 162, 6.5], [166, 178, 5.5]]) + E(170, 182, 10, 6), cel(c.b, c.s));
    body += pa('M64,134 Q76,148 100,142 Q120,138 136,142 Q120,148 102,149 Q76,153 64,134 Z', c.l, 0);
    body += ln('M140,124 Q132,136 140,148 M80,132 Q78,142 72,148', c.s, 2.4);
    body += ln('M52,185.5 v-3 M58,185.5 v-3 M168,185.5 v-3 M174,185.5 v-3', OL, 2);
    // Bờm lửa ngắn dọc gáy
    body += fl(110, 118, 18, 12, 66, 3.6) + fl(96, 116, 24, 14, 56, 4) + fl(82, 112, 28, 16, 44, 4);
    // Cổ + đầu (nhìn về phía người xem)
    const hx = 64, hy = 92;
    body += bl(CAP(70, 126, 66, 100, 16, 14), cel(c.b, c.s), 0.01);
    const L = ear(hx - 16, hy - 16, -1, 31, 19, 8), Rr = ear(hx + 16, hy - 16, 1, 31, 19, 8);
    head += bl(E(hx, hy, 28, 24) + D(L.o) + D(Rr.o) + wolfTuft(hx, hy, -1, 1) + wolfTuft(hx, hy, 1, 1) + E(hx, hy + 14, 15, 11), cel(c.b, c.s));
    head += pa(L.i, c.in, 0) + pa(Rr.i, c.in, 0);
    head += wolfFace(hx, hy, 1, c, { fang: 1 });
    head += fl(hx, hy - 20, 22, 14, 0, 3.8);
    head += eye(hx - 12, hy - 1, 8.5, 9.5, -1, { iris: c.i, lid: .45, skin: c.b, bw: 5.5 }) + eye(hx + 12, hy - 1, 8.5, 9.5, 1, { iris: c.i, lid: .45, skin: c.b, bw: 5.5 });
    head += hl(hx - 18, hy - 12, 6, 3, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 20, 40], [hx, hy - 1, 38], [hx + 2, hy + 24, 30], [108, 114, 56, 36], [72, 132, 30, 30]) };
  };
  const wolf3 = c => {
    let back = '', body = '', head = '', front = '';
    // Tảng đá: bậc cao phía trước, thấp phía sau
    back += pa('M22,189 L28,174 Q32,162 46,160 L90,159 Q100,159 106,165 L112,170 L158,170 Q170,170 176,178 L182,189 Z', cel('#6a4a8e', '#3d2a60'), 5) +
      ln('M38,176 L54,181 L52,187 M122,180 L136,185 M150,178 l12,5', '#2a1a48', 3) + ln('M74,166 l8,7 l-2,7 l6,5', '#ff8a1f', 2.6) + hl(52, 166, 12, 2.6, -6, .28);
    // Đuôi dựng cao, chóp lửa
    back += `<g class="pt">` +
      pa('M152,110 C166,104 176,88 174,66 C186,76 190,100 180,116 C172,128 162,130 154,126 Z', cel(c.b, c.s), 5) +
      fl(174, 74, 34, 20, 16, 4) + `</g>`;
    // Chân phía xa
    back += bl(limb([[84, 122, 8], [86, 146, 6.5], [86, 156, 6]]) + E(86, 159, 9, 5.5) + limb([[136, 124, 9], [128, 146, 6.5], [134, 164, 5.5]]) + E(134, 168, 9, 5.5), cel(c.s, c.d), 4.5);
    // Thân thon dài, ngực ưỡn, chân gần dài
    const torsoD = 'M70,82 C82,92 96,100 114,102 C132,104 148,100 158,110 C166,120 162,134 150,136 L132,128 C116,126 98,128 86,130 C72,132 58,126 56,112 C54,100 58,92 62,86 Z';
    body += bl(D(torsoD) + CAP(64, 104, 60, 74, 15, 13) + limb([[70, 120, 9.5], [68, 146, 7], [66, 156, 6.5]]) + E(64, 159, 10.5, 6) + E(150, 120, 14, 16, -15) + limb([[150, 128, 10.5], [142, 148, 7], [154, 164, 6]]) + E(156, 168, 10.5, 6), cel(c.b, c.s));
    // Bờm ngực kem
    body += pa('M58,104 Q60,92 68,90 L72,98 L76,92 L80,104 L84,100 L84,112 Q80,118 76,116 L72,122 L68,116 L62,118 Q58,112 58,104 Z', c.l, 0);
    body += ln('M146,108 Q138,122 144,134 M78,116 Q78,126 74,134', c.s, 2.4);
    body += ln('M60,162.5 v-3 M66,162.5 v-3 M152,171.5 v-3 M158,171.5 v-3', OL, 2);
    // Vòng lửa cổ chân
    const anklet = (x, y) => fl(x - 8, y + 1, 12, 7, -30, 2.4) + fl(x + 8, y + 1, 12, 7, 30, 2.4) + pa(`M${P(x - 7.5, y - 1)} Q${P(x, y + 2)} ${P(x + 7.5, y - 1)} L${P(x + 7.5, y + 3)} Q${P(x, y + 6)} ${P(x - 7.5, y + 3)} Z`, 'url(#gGold)', 2.2);
    body += anklet(67, 146) + anklet(150, 156);
    // Bờm lửa chạy dọc gáy và lưng
    body += fl(146, 104, 16, 11, 70, 3.6) + fl(132, 102, 20, 13, 64, 3.8) + fl(116, 100, 24, 15, 58, 4) + fl(100, 96, 28, 16, 50, 4) + fl(86, 88, 32, 18, 42, 4);
    // Đầu ngẩng cao
    const hx = 60, hy = 56;
    const L = ear(hx - 15, hy - 16, -1, 34, 17, 4), Rr = ear(hx + 15, hy - 16, 1, 34, 17, 4);
    head += bl(E(hx, hy, 26, 22) + D(L.o) + D(Rr.o) + wolfTuft(hx, hy, -1, .95) + wolfTuft(hx, hy, 1, .95) + E(hx, hy + 14, 13, 11), cel(c.b, c.s));
    head += pa(L.i, c.in, 0) + pa(Rr.i, c.in, 0);
    head += wolfFace(hx, hy, .95, c, { open: true });
    head += fl(hx, hy - 18, 28, 16, 0, 4);
    head += eye(hx - 11, hy - 2, 7.5, 8, -1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 }) + eye(hx + 11, hy - 2, 7.5, 8, 1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 });
    head += hl(hx - 16, hy - 12, 5.5, 2.8, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 18, 38], [hx, hy - 2, 35], [hx + 2, hy + 24, 30], [106, 96, 62, 40], [70, 112, 30, 34]) };
  };
  const wolf4 = c => {
    let back = '', body = '', head = '', front = '';
    back += sunAura(100, 90, 94, ['#ff8a1f', '#ffd21f']);
    // Bờm lửa lớn hình vương miện quanh đầu
    const hx = 100, hy = 60;
    const crown = [[0, 52], [17, 48], [34, 46], [54, 42], [76, 37], [100, 32]];
    for (const [a, h] of crown) for (const sd of (a ? [-1, 1] : [1])) {
      const aa = a * sd, x = hx + Math.sin(aa * R) * 27, y = hy + 4 - Math.cos(aa * R) * 24;
      back += fl(x, y + 6, h, h * .56, aa * .95, 4.5);
    }
    // Đuôi lửa xoáy
    back += `<g class="pt">` +
      pa('M138,182 C164,188 188,174 191,148 C194,124 176,106 160,114 C148,120 152,138 164,136 C172,134 172,126 168,124 C176,124 180,134 176,144 C170,160 152,166 140,166 Z', 'url(#gFlame)', 5) +
      pa('M144,176 C162,178 178,168 182,152 C178,162 164,170 146,170 Z', '#fff59a', 0) + `</g>`;
    // Hai đùi sau tròn + bàn chân sau
    body += bl(E(66, 166, 23, 20) + E(134, 166, 23, 20), cel(c.b, c.s));
    body += ln('M52,154 Q60,146 72,148 M148,154 Q140,146 128,148', c.s, 2.4);
    body += el(50, 183, 12, 6, c.l, 4.5) + el(150, 183, 12, 6, c.l, 4.5) + ln('M46,186 v-3 M52,186 v-3 M148,186 v-3 M154,186 v-3', OL, 2);
    // Ngực + cổ + chân trước, một khối
    body += bl(D('M76,84 Q100,76 124,84 Q132,104 128,120 L72,120 Q68,104 76,84 Z') + E(100, 124, 28, 26) + limb([[88, 128, 9.5], [87, 164, 7.5], [86, 178, 7]]) + limb([[112, 128, 9.5], [113, 164, 7.5], [114, 178, 7]]), cel(c.b, c.s));
    body += ln('M100,144 V176', c.s, 2.6);
    body += el(85, 183, 11, 6.2, c.l, 4.5) + el(115, 183, 11, 6.2, c.l, 4.5);
    body += [79, 85, 91, 109, 115, 121].map(x => pa(`M${P(x - 2.2, 188)} l2.2,4 l2.2,-4 Z`, '#fff', 1.5)).join('');
    body += [[87, 160], [113, 160]].map(([x, y]) => pa(`M${P(x - 9.5, y - 2)} Q${P(x, y + 2)} ${P(x + 9.5, y - 2)} L${P(x + 9.5, y + 3)} Q${P(x, y + 7)} ${P(x - 9.5, y + 3)} Z`, 'url(#gGold)', 2.6)).join('');
    // Lông ngực kem rủ như lửa
    body += pa('M76,92 Q100,84 124,92 L122,108 L116,104 L114,124 L107,116 L100,142 L93,116 L86,124 L84,104 L78,108 Z', c.l, 3.5);
    body += ln('M92,100 L96,114 M108,100 L104,114', c.ls, 2.2);
    // Vòng cổ vàng + mặt dây đá đỏ
    body += pa('M74,88 Q100,102 126,88 L127,95 Q100,110 73,95 Z', 'url(#gGold)', 3.5) + pa('M95,100 L100,94 L105,100 L100,110 Z', '#ff3b4f', 2.6) + hl(98.6, 99, 1.6, 2.8, 0, .7);
    // Đầu
    const L = ear(hx - 17, hy - 14, -1, 33, 17, 11), Rr = ear(hx + 17, hy - 14, 1, 33, 17, 11);
    head += bl(E(hx, hy, 28, 23) + D(L.o) + D(Rr.o) + wolfTuft(hx, hy, -1, 1, 3) + wolfTuft(hx, hy, 1, 1, 3) + E(hx, hy + 15, 14, 11.5), cel(c.b, c.s));
    head += pa(L.i, c.in, 0) + pa(Rr.i, c.in, 0);
    head += wolfFace(hx, hy, 1.04, c, { fang: 2 });
    head += fl(hx, hy - 18, 26, 15, 0, 4) + pa(`M${P(hx, hy - 19)} L${P(hx + 4.5, hy - 12.5)} L${P(hx, hy - 6)} L${P(hx - 4.5, hy - 12.5)} Z`, 'url(#gGold)', 2.4);
    const eo = { iris: '#ffb21f', white: '#fff59a', lid: 1, skin: c.b, glow: '#ffd21f', bw: 6 };
    head += eye(hx - 12, hy - 1, 8, 7.5, -1, eo) + eye(hx + 12, hy - 1, 8, 7.5, 1, eo);
    head += hl(hx - 18, hy - 12, 6, 3, -25, .5);
    front += embers([[16, 124, 5], [184, 60, 4.5], [24, 46, 4], [182, 100, 3.5], [20, 168, 3.5]]);
    return { back, body, head, front, anc: anc([hx, hy - 18, 42], [hx, hy - 1, 38], [hx, hy + 32, 54], [100, 90, 64, 80], [100, 118, 46, 50]) };
  };

  PET_SPECS.wolf = {
    el: 'fire',
    c: WOLF[1], c4: WOLF[4],
    draw(f, g, c) { return fit([null, wolf1, wolf2, wolf3, wolf4][f](WOLF[f]), [1, 1, .86, .93, .96][f]); }
  };

  /* =============================== RỒNG LỬA =============================== */
  // Nhận diện xuyên suốt: bụng vảy vàng, sừng kem, chóp đuôi lửa
  const DRAG = [null,
    { b: '#ff5a48', s: '#d12a2a', l: '#ffe08a', ls: '#f0b04a', d: '#a01a24', i: '#ffc21f', mem: '#ffa64d', mems: '#f07a2a', bone: '#c22a2a', muz: '#ff8a72' },
    { b: '#ff4a3d', s: '#bf1f24', l: '#ffd86b', ls: '#e6a03a', d: '#86121e', i: '#ffd21f', mem: '#ff9a3d', mems: '#e0661f', bone: '#a8141f', muz: '#ff7a64' },
    { b: '#f23a36', s: '#a5141f', l: '#ffd36b', ls: '#e09a2a', d: '#6e0b1f', i: '#ffd21f', mem: '#ff8a2e', mems: '#d4501a', bone: '#8a0d1d', muz: '#ff6a5a' },
    { b: '#d91e2e', s: '#7a0a1c', l: '#ffd86b', ls: '#d9902a', d: '#4a0614', i: '#fff59a', mem: '#ff7a1f', mems: '#c0360f', bone: '#5c0716', muz: '#f04a4a' }
  ];
  // Cánh dơi: vai sh, khớp cổ tay wr, các đầu ngón tips (ngoài → trong), điểm bám thân bp
  function batW(sh, wr, tips, bp, c, o = {}) {
    let d = `M${P(sh[0], sh[1])} L${P(wr[0], wr[1])} L${P(tips[0][0], tips[0][1])}`;
    const pts_ = tips.concat([bp]);
    for (let i = 1; i < pts_.length; i++) {
      const a = pts_[i - 1], b = pts_[i], mx_ = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
      d += ` Q${P(mx_ + (wr[0] - mx_) * .28, my + (wr[1] - my) * .28)} ${P(b[0], b[1])}`;
    }
    let s = pa(d + ' Z', cel(c.mem, c.mems, .7), o.sw || 5);
    s += tips.slice(1).map(t => ln(`M${P(wr[0], wr[1])} L${P(t[0], t[1])}`, o.boneCol || c.bone, o.bw || 3.4)).join('');
    s += tube(`M${P(sh[0], sh[1])} L${P(wr[0], wr[1])} L${P(tips[0][0], tips[0][1])}`, o.armCol || c.b, o.aw || 6, 3);
    if (o.claw) s += ci(wr[0], wr[1], o.claw, o.clawCol || '#fff1c9', 2.2);
    return s;
  }
  const mirror = pt => [200 - pt[0], pt[1]];
  // Đuôi thon dần: đường giữa qua các điểm, độ dày w0 → w1
  function taper(pts_, w0, w1) {
    const n = pts_.length, L = [], Rt = [];
    for (let i = 0; i < n; i++) {
      const a = pts_[Math.max(0, i - 1)], b = pts_[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
      const w = (w0 + (w1 - w0) * i / (n - 1)) / 2, nx = -dy / l * w, ny = dx / l * w;
      L.push([pts_[i][0] + nx, pts_[i][1] + ny]); Rt.push([pts_[i][0] - nx, pts_[i][1] - ny]);
    }
    const sm = arr => arr.map((p_, i) => i === 0 ? `M${P(p_[0], p_[1])}` : (i < arr.length - 1 ? `Q${P(p_[0], p_[1])} ${P((p_[0] + arr[i + 1][0]) / 2, (p_[1] + arr[i + 1][1]) / 2)}` : `L${P(p_[0], p_[1])}`)).join(' ');
    const rb = Rt.slice().reverse();
    return sm(L) + ' ' + rb.map((p_, i) => i === 0 ? `L${P(p_[0], p_[1])}` : (i < rb.length - 1 ? `Q${P(p_[0], p_[1])} ${P((p_[0] + rb[i + 1][0]) / 2, (p_[1] + rb[i + 1][1]) / 2)}` : `L${P(p_[0], p_[1])}`)).join(' ') + ' Z';
  }
  const claws3 = (x, y, w, col = '#fff1c9') => [-1, 0, 1].map(k => pa(`M${P(x + k * w - 2.2, y)} l2.2,4.2 l2.2,-4.2 Z`, col, 1.6)).join('');
  // Sừng cong ra ngoài
  const hornC = (x, y, sd, len, th, curl, col = 'url(#gHorn)', sw = 4) => {
    const tx = x + sd * len * curl, ty = y - len;
    return pa(`M${P(x - sd * th, y + 2)} Q${P(x - sd * th * .4, y - len * .62)} ${P(tx, ty)} Q${P(x + sd * th * 1.5, y - len * .42)} ${P(x + sd * th, y + 3)} Z`, col, sw) + ln(`M${P(x - sd * th * .1, y - len * .25)} q${f1(sd * th * .6)},-1 ${f1(sd * th * .9)},2`, 'rgba(20,10,48,.3)', 1.8);
  };
  const dragon1 = c => {
    let back = '', body = '', head = '', front = '';
    // Cánh tí hon
    const tw = [[84, 152], [62, 138], [[52, 146], [58, 158]], [78, 162]];
    back += batW(tw[0], tw[1], tw[2], tw[3], c, { aw: 4.5, bw: 2.4, sw: 4 }) + batW(mirror(tw[0]), mirror(tw[1]), tw[2].map(mirror), mirror(tw[3]), c, { aw: 4.5, bw: 2.4, sw: 4 });
    // Đuôi cong, chóp lửa
    back += `<g class="pt" style="transform-origin:0% 80%">` + pa(taper([[112, 180], [136, 186], [150, 176], [152, 160]], 16, 6), cel(c.b, c.s), 5) + fl(152, 162, 20, 13, 6, 3.6) + `</g>`;
    // Thân mũm mĩm
    body += bl(E(100, 163, 27, 24) + E(80, 177, 12, 9) + E(120, 177, 12, 9), cel(c.b, c.s));
    body += pa('M86,150 Q100,144 114,150 Q118,168 108,182 Q100,186 92,182 Q82,168 86,150 Z', cel(c.l, c.ls), 3.5) + ln('M88,160 Q100,164 112,160 M88,170 Q100,174 112,170', c.ls, 2.2);
    body += bl(E(78, 157, 6.5, 8.5, 20) + E(122, 157, 6.5, 8.5, -20), cel(c.b, c.s), 4);
    body += el(83, 183, 12, 6.5, cel(c.b, c.s), 4.5) + el(117, 183, 12, 6.5, cel(c.b, c.s), 4.5) + claws3(83, 186, 5) + claws3(117, 186, 5);
    // Đầu tròn to, sừng nhú, mõm tròn
    const fin = sd => D(`M${P(100 + sd * 31, 112)} L${P(100 + sd * 44, 104)} L${P(100 + sd * 38, 116)} L${P(100 + sd * 44, 122)} L${P(100 + sd * 32, 126)} Z`);
    head += bl(E(100, 122, 34, 29) + fin(-1) + fin(1), cel(c.b, c.s));
    head += hornC(84, 100, -1, 13, 5.5, .35) + hornC(116, 100, 1, 13, 5.5, .35);
    head += fl(100, 97, 14, 10, 0, 3.2);
    head += el(100, 137, 15, 9, c.muz, 0) + el(95, 135, 2.2, 1.6, OL, 0) + el(105, 135, 2.2, 1.6, OL, 0);
    head += ln('M93,142 Q100,146 107,142', OL, 2.8) + pa('M102.5,143.4 l1.8,3.4 l1.8,-3.6', '#fff', 1.5);
    head += eyeC(85, 120, 10, 11.5, -1, c.i) + eyeC(115, 120, 10, 11.5, 1, c.i);
    head += blush(75, 133) + blush(125, 133);
    head += hl(84, 101, 8, 3.6, -20, .5);
    return { back, body, head, front, anc: anc([100, 97, 54], [100, 120, 48], [100, 146, 40], [100, 148, 44, 34], [100, 164, 34, 38]) };
  };
  const dragon2 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi dài vồng lên, chóp lửa
    back += `<g class="pt" style="transform-origin:0% 55%">` + pa(taper([[132, 146], [160, 156], [180, 140], [184, 116], [176, 100]], 22, 6), cel(c.b, c.s), 5) +
      [[160, 148], [176, 132], [180, 114]].map(([x, y], i) => pa(`M${P(x - 4, y)} l${f1(8 - i)},-${f1(7 - i)} l1,${f1(9 - i)} Z`, c.l, 2.4)).join('') + fl(176, 104, 30, 18, -18, 4) + `</g>`;
    // Chân phía xa
    back += bl(limb([[94, 162, 7.5], [102, 172, 6], [100, 180, 5.5]]) + E(101, 183, 8.5, 5) + limb([[126, 162, 8], [118, 172, 6], [120, 180, 5.5]]) + E(119, 183, 8.5, 5), cel(c.s, c.d), 4.5);
    // Cánh non gập trên lưng
    back += batW([98, 146], [114, 114], [[136, 108], [136, 124], [126, 138]], [112, 148], c, { aw: 3.6, bw: 2.4, sw: 4 });
    // Thân thằn lằn dài thấp + chân gần khuỳnh
    body += bl(D('M70,146 Q104,134 140,142 Q156,148 152,160 Q146,170 120,168 Q96,170 76,166 Q60,160 70,146 Z') + limb([[78, 158, 9], [64, 168, 7.5], [62, 180, 6.5]]) + E(60, 183, 11, 6) + E(140, 158, 14, 12, -15) + limb([[144, 162, 8.5], [156, 172, 7], [154, 180, 6.5]]) + E(157, 183, 11, 6), cel(c.b, c.s));
    body += pa('M70,160 Q90,170 116,166 Q132,165 146,163 Q134,172 112,172 Q84,174 70,160 Z', cel(c.l, c.ls), 0) + ln('M86,168 v4 M100,168.5 v4 M114,168 v4 M128,167 v3.5', c.ls, 2);
    body += ln('M132,152 Q130,160 136,166', c.s, 2.2);
    body += claws3(60, 187, 5) + claws3(157, 187, 5);
    // Gai lưng nhỏ
    body += [[84, 141, 8], [98, 138, 10], [112, 138, 10], [126, 140, 9], [140, 143, 7]].map(([x, y, h]) => pa(`M${P(x - 5, y + 3)} L${P(x + 2, y - h)} L${P(x + 6, y + 3)} Z`, c.l, 2.8)).join('');
    // Cổ + đầu nhìn người xem
    const hx = 62, hy = 110;
    body += bl(CAP(76, 152, 66, 124, 15, 13), cel(c.b, c.s), .01);
    head += hornC(hx - 14, hy - 16, -1, 18, 5.5, .55) + hornC(hx + 14, hy - 16, 1, 18, 5.5, .55);
    const fin = sd => D(`M${P(hx + sd * 22, hy - 6)} L${P(hx + sd * 36, hy - 12)} L${P(hx + sd * 30, hy)} L${P(hx + sd * 36, hy + 6)} L${P(hx + sd * 22, hy + 10)} Z`);
    head += bl(E(hx, hy, 27, 22) + E(hx, hy + 14, 17, 11) + fin(-1) + fin(1), cel(c.b, c.s));
    head += fl(hx, hy - 20, 16, 11, 0, 3.4);
    head += el(hx, hy + 15, 14, 8, c.muz, 0) + el(hx - 5, hy + 12, 2.2, 1.6, OL, 0) + el(hx + 5, hy + 12, 2.2, 1.6, OL, 0);
    head += ln(`M${P(hx - 9, hy + 19)} Q${P(hx, hy + 23)} ${P(hx + 9, hy + 18)}`, OL, 2.8) + pa(`M${P(hx - 6, hy + 20)} l1.8,3.6 l1.8,-3.4 M${P(hx + 3, hy + 20.5)} l1.8,3.6 l1.8,-3.8`, '#fff', 1.5);
    head += eye(hx - 12, hy - 2, 8.5, 9.5, -1, { iris: c.i, lid: .5, skin: c.b, bw: 5.5, slit: true }) + eye(hx + 12, hy - 2, 8.5, 9.5, 1, { iris: c.i, lid: .5, skin: c.b, bw: 5.5, slit: true });
    head += hl(hx - 16, hy - 13, 6, 3, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 18, 42], [hx, hy - 2, 38], [hx + 4, hy + 26, 30], [108, 136, 50, 30], [76, 152, 30, 28]) };
  };
  const dragon3 = c => {
    let back = '', body = '', head = '', front = '';
    // Đôi cánh lớn mở
    const wl = [[84, 116], [42, 70], [[12, 60], [16, 104], [36, 126], [60, 136]], [80, 140]];
    back += batW(wl[0], wl[1], wl[2], wl[3], c, { claw: 4 }) + batW(mirror(wl[0]), mirror(wl[1]), wl[2].map(mirror), mirror(wl[3]), c, { claw: 4 });
    // Đuôi quét đất, chóp lửa
    back += `<g class="pt" style="transform-origin:0% 55%">` + pa(taper([[110, 168], [140, 184], [166, 182], [182, 166], [184, 150]], 20, 6), cel(c.b, c.s), 5) + fl(184, 154, 28, 17, 8, 4) + `</g>`;
    // Chân sau đứng
    body += bl(E(84, 162, 13, 16, 10) + E(116, 162, 13, 16, -10) + limb([[82, 170, 9], [80, 182, 7]]) + limb([[118, 170, 9], [120, 182, 7]]), cel(c.b, c.s));
    body += el(78, 184, 12, 5.6, cel(c.b, c.s), 4.5) + el(122, 184, 12, 5.6, cel(c.b, c.s), 4.5) + claws3(76, 187, 5) + claws3(124, 187, 5);
    // Thân đứng thon + cổ dài
    body += bl(E(100, 140, 23, 28) + CAP(100, 124, 100, 80, 13, 11), cel(c.b, c.s));
    body += pa('M90,92 Q100,88 110,92 L114,128 Q114,160 100,166 Q86,160 86,128 Z', cel(c.l, c.ls), 3.5) + [100, 112, 124, 136, 148].map((y, i) => ln(`M${P(89 - (i > 1 ? 1 : 0), y)} Q100,${y + 3} ${P(111 + (i > 1 ? 1 : 0), y)}`, c.ls, 2)).join('');
    // Tay nhỏ có vuốt
    body += bl(limb([[80, 124, 6.5], [76, 140, 5.5], [84, 148, 5]]) + limb([[120, 124, 6.5], [124, 140, 5.5], [116, 148, 5]]), cel(c.b, c.s), 4.5) + claws3(86, 151, 3.2) + claws3(114, 151, 3.2);
    // Đầu: mõm dài, sừng vuốt ngược, mào gai
    const hx = 100, hy = 64;
    head += [[-1, 16], [1, 16], [-1, 30], [1, 30]].map(([sd, dy], i) => pa(`M${P(hx + sd * 16, hy - 8 + dy)} L${P(hx + sd * (34 + (i > 1 ? -2 : 4)), hy - 14 + dy)} L${P(hx + sd * 18, hy + 4 + dy)} Z`, cel(c.mem, c.mems), 3.5)).join('');
    head += hornC(hx - 15, hy - 14, -1, 30, 6.5, .75) + hornC(hx + 15, hy - 14, 1, 30, 6.5, .75);
    head += bl(E(hx, hy, 24, 20) + E(hx, hy + 16, 15, 11), cel(c.b, c.s));
    head += [[0, 22], [-9, 14], [9, 14]].map(([dx, h]) => pa(`M${P(hx + dx - 5, hy - 16 + Math.abs(dx) * .3)} L${P(hx + dx * 1.3, hy - 16 - h)} L${P(hx + dx + 5, hy - 16 + Math.abs(dx) * .3)} Z`, 'url(#gFlame)', 3.4)).join('');
    head += el(hx, hy + 18, 13, 7.5, c.muz, 0) + el(hx - 5, hy + 14, 2.2, 1.6, OL, 0) + el(hx + 5, hy + 14, 2.2, 1.6, OL, 0);
    head += ln(`M${P(hx - 10, hy + 21)} Q${P(hx, hy + 25)} ${P(hx + 10, hy + 20)}`, OL, 2.8) + pa(`M${P(hx - 7, hy + 22)} l1.8,4 l1.8,-3.8 M${P(hx + 3.4, hy + 22.4)} l1.8,4 l1.8,-4.2`, '#fff', 1.5);
    head += eye(hx - 11, hy - 2, 7.5, 7.5, -1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5, slit: true }) + eye(hx + 11, hy - 2, 7.5, 7.5, 1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5, slit: true });
    head += hl(hx - 13, hy - 12, 6, 2.8, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 16, 40], [hx, hy - 2, 35], [hx, hy + 30, 28], [100, 118, 46, 54], [100, 138, 40, 46]) };
  };
  const dragon4 = c => {
    let back = '', body = '', head = '', front = '';
    back += sunAura(100, 92, 96, ['#ff5a1f', '#ffd21f']);
    // Vòng lửa bao quanh
    if (!PET_LITE) back += [[-160, 24], [-128, 28], [-52, 28], [-20, 24], [20, 22], [160, 22]].map(([a, h]) => { const x = 100 + Math.cos(a * R) * 86, y = 104 + Math.sin(a * R) * 80; return fl(x, y, h, h * .55, a + 90, 3.4); }).join('');
    // Đôi cánh dang rộng (đang bay), xương cánh vàng
    const wo = { claw: 4.5, boneCol: '#ffd21f', bw: 2.8, armCol: '#ffc21f', aw: 4.2 };
    back += batW([116, 98], [158, 36], [[196, 8], [198, 56], [184, 86], [164, 100], [142, 106]], [128, 112], c, wo);
    back += batW([88, 102], [40, 38], [[4, 12], [2, 64], [16, 100], [40, 120], [66, 122]], [86, 124], c, wo);
    // Đuôi dài quét vòng dưới thân, chóp lửa
    back += `<g class="pt" style="transform-origin:100% 0%">` + pa(taper([[132, 146], [150, 170], [136, 186], [100, 188], [66, 182], [42, 166], [32, 148]], 24, 6), cel(c.b, c.s), 5) +
      [[150, 168], [132, 184], [100, 186], [68, 180]].map(([x, y]) => pa(`M${P(x - 4, y - 6)} l4,-7 l4,7 Z`, '#ffd21f', 2)).join('') + fl(32, 152, 34, 20, -30, 4) + `</g>`;
    // Chân sau + tay phía xa
    back += bl(limb([[112, 112, 6], [104, 126, 5], [96, 132, 4.5]]), cel(c.s, c.d), 4) + bl(limb([[134, 146, 10], [154, 160, 7], [168, 166, 6]]) + E(172, 167, 8, 5, 20), cel(c.s, c.d), 4.5) + claws3(176, 170, 3.5, '#ffd21f');
    // Thân nghiêng chéo
    body += bl(E(112, 124, 24, 36, -32) + E(132, 146, 14, 16, -30) + limb([[138, 150, 10], [158, 164, 7.5], [170, 176, 6.5]]) + E(174, 178, 9, 5.5, 25), cel(c.b, c.s));
    body += claws3(178, 181, 3.6, '#ffd21f');
    body += pa('M88,96 Q100,90 110,98 Q126,124 128,146 Q124,152 118,150 Q100,128 86,108 Z', cel(c.l, c.ls), 3.5) + [[92, 106, 108, 100], [98, 118, 116, 110], [106, 130, 122, 124], [114, 142, 126, 138]].map(([x1, y1, x2, y2]) => ln(`M${P(x1, y1)} L${P(x2, y2)}`, c.ls, 2)).join('') + ln('M88,96 Q100,90 110,98', '#ffd21f', 2.6);
    // Tay vươn tới trước
    body += bl(limb([[90, 110, 6.5], [76, 118, 5.5], [70, 128, 5]]), cel(c.b, c.s), 4.5) + claws3(69, 132, 3, '#ffd21f');
    // Vai giáp vàng
    body += pa('M86,94 Q74,92 70,106 L82,104 Z', 'url(#gGold)', 3.2) + pa('M112,92 Q126,88 132,100 L118,104 Z', 'url(#gGold)', 3.2);
    // Đầu: sừng vương miện vàng, mõm dài, mắt phát sáng
    const hx = 98, hy = 58;
    head += [[-1, 36, 7, .8, 14], [1, 36, 7, .8, 14], [-1, 24, 5, .5, 7], [1, 24, 5, .5, 7]].map(([sd, len, th, curl, dx]) => hornC(hx + sd * dx, hy - 15, sd, len, th, curl, 'url(#gGold)')).join('') + hornC(hx, hy - 17, 1, 20, 5, .02, 'url(#gGold)');
    head += [-1, 1].map(sd => pa(`M${P(hx + sd * 18, hy + 8)} L${P(hx + sd * 40, hy - 2)} L${P(hx + sd * 32, hy + 12)} L${P(hx + sd * 40, hy + 18)} L${P(hx + sd * 20, hy + 20)} Z`, cel(c.mem, c.mems), 3.5)).join('');
    head += bl(E(hx, hy, 25, 20) + E(hx, hy + 17, 16, 11), cel(c.b, c.s));
    head += pa(`M${P(hx - 6, hy - 15)} L${P(hx, hy - 21)} L${P(hx + 6, hy - 15)} L${P(hx, hy - 8)} Z`, '#ff3b4f', 2.6) + hl(hx - 1.5, hy - 15, 1.5, 2.4, 0, .7);
    head += el(hx, hy + 19, 14, 7.5, c.muz, 0) + el(hx - 5, hy + 15, 2.3, 1.7, OL, 0) + el(hx + 5, hy + 15, 2.3, 1.7, OL, 0);
    head += ln(`M${P(hx - 11, hy + 22)} Q${P(hx, hy + 26)} ${P(hx + 11, hy + 21)}`, OL, 3) + pa(`M${P(hx - 8, hy + 23)} l2,4.5 l2,-4.3 M${P(hx + 4, hy + 23.4)} l2,4.5 l2,-4.7`, '#fff', 1.6);
    const eo = { iris: '#ffb21f', white: '#fff59a', lid: 1, skin: c.b, glow: '#ffd21f', bw: 6, slit: true };
    head += eye(hx - 11, hy - 2, 7.5, 7, -1, eo) + eye(hx + 11, hy - 2, 7.5, 7, 1, eo);
    head += hl(hx - 14, hy - 12, 6, 2.8, -25, .5);
    front += embers([[22, 124, 4], [182, 132, 4], [64, 10, 3.5], [186, 186, 3.5], [140, 6, 3]]);
    return { back, body, head, front, anc: anc([hx, hy - 15, 40], [hx, hy - 2, 35], [hx + 2, hy + 30, 30], [108, 94, 46, 60], [106, 118, 38, 44]) };
  };

  PET_SPECS.dragon = {
    el: 'fire',
    c: DRAG[1], c4: DRAG[4],
    draw(f, g, c) { return fit([null, dragon1, dragon2, dragon3, dragon4][f](DRAG[f]), [1, 1, 1, .93, 1][f]); }
  };

  /* =============================== KỲ NHÔNG DUNG NHAM =============================== */
  // Nhận diện xuyên suốt: mang lửa xòe hai bên đầu, đốm sáng / khe dung nham, miệng cười rộng
  const SAL = [null,
    { b: '#ff7f8a', s: '#e04a6a', l: '#ffe3e6', ls: '#f7a8b8', i: '#ffc21f', spot: '#ffd84a', crack: '#ffb21f', rock: '#5a4680', rocks: '#35285a', mouth: '#a8204f' },
    { b: '#ff6a78', s: '#c8365a', l: '#ffd8de', ls: '#f29ab0', i: '#ffd21f', spot: '#ffd84a', crack: '#ffb21f', rock: '#5a4680', rocks: '#35285a', mouth: '#8a1440' },
    { b: '#ec4f6c', s: '#a42448', l: '#ffc9d2', ls: '#e88aa0', i: '#ffd21f', spot: '#ffe14d', crack: '#ffb21f', rock: '#4f3d74', rocks: '#2c2050', mouth: '#7a1030' },
    { b: '#433566', s: '#241a40', l: '#ff7a8a', ls: '#d4456a', i: '#fff59a', spot: '#ffe14d', crack: '#ffb21f', rock: '#2e2448', rocks: '#1a1230', mouth: '#5a0a24', edge: '#7a6aaa' }
  ];
  // Đốm phát sáng
  const glowSpot = (x, y, r, c) => ci(x, y, r + 1.8, c.spot, 0, 'opacity=".35"') + ci(x, y, r, c.spot, 1.8) + ci(x - r * .3, y - r * .3, r * .35, '#fff', 0);
  // Khe dung nham rực (đường gấp khúc)
  const lava = (d, w = 3) => ln(d, OL, w + 3) + ln(d, '#ff5a1f', w) + ln(d, '#ffe14d', w * .45);
  // Mang lửa: n ngọn, gốc quanh (x, y), hướng sd, góc từ a0 → a1, cao h
  const gills = (x, y, sd, n, h, a0 = -30, a1 = -95, gap = 8, sw = 3.8) => {
    let g_ = '';
    for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) : 0, a = a0 + (a1 - a0) * t; g_ += fl(x + sd * Math.cos((a + 90) * R) * 2, y - i * gap, h * (1 - Math.abs(t - .5) * .3), h * .58, sd * (90 + a), sw); }
    return g_;
  };
  // Mặt kỳ nhông: miệng cười rộng + lỗ mũi
  const salMouth = (hx, y, w, c, fang = 0) => pa(`M${P(hx - w, y - 3)} Q${P(hx, y + w * .42)} ${P(hx + w, y - 3)} Q${P(hx, y + w * .16)} ${P(hx - w, y - 3)} Z`, c.mouth, 3) +
    (fang ? pa(`M${P(hx - w * .45, y + 1)} l2,${f1(3 + fang)} l2,${f1(-3 - fang)} M${P(hx + w * .3, y + 1)} l2,${f1(3 + fang)} l2,${f1(-3 - fang)}`, '#fff', 1.6) : '') + el(hx - 5, y - 9, 1.8, 1.4, OL, 0) + el(hx + 5, y - 9, 1.8, 1.4, OL, 0);
  const salamander1 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi cuộn bên hông
    back += `<g class="pt" style="transform-origin:0% 75%">` + pa(taper([[112, 172], [140, 184], [158, 176], [160, 160], [150, 154], [146, 162]], 18, 6), cel(c.b, c.s), 5) +
      glowSpot(140, 180, 2.4, c) + glowSpot(156, 168, 2.2, c) + `</g>`;
    // Lưng + chân sau
    body += bl(E(100, 164, 30, 20) + E(70, 178, 10, 7.5, -15) + E(130, 178, 10, 7.5, 15), cel(c.b, c.s));
    body += glowSpot(78, 160, 2.2, c) + glowSpot(124, 158, 2.4, c);
    // Tay chống thẳng
    body += bl(limb([[86, 150, 7.5], [84, 178, 6.5]]) + limb([[114, 150, 7.5], [116, 178, 6.5]]), cel(c.b, c.s), 4.5);
    body += el(83, 183, 9.5, 5.6, c.l, 4) + el(117, 183, 9.5, 5.6, c.l, 4) + ln('M78,186 v-3 M83,186.5 v-3 M88,186 v-3 M112,186 v-3 M117,186.5 v-3 M122,186 v-3', OL, 2);
    // Mang lửa nhỏ xòe hai bên
    head += gills(64, 128, -1, 3, 20, -15, -85, 8, 3.6) + gills(136, 128, 1, 3, 20, -15, -85, 8, 3.6);
    // Đầu dẹt rộng
    head += bl(E(100, 136, 40, 25) + E(82, 122, 12, 11) + E(118, 122, 12, 11), cel(c.b, c.s));
    head += el(100, 147, 25, 10, c.l, 0);
    head += salMouth(100, 144, 18, c);
    head += eyeC(84, 124, 9.5, 10.5, -1, c.i) + eyeC(116, 124, 9.5, 10.5, 1, c.i);
    head += glowSpot(100, 117, 2.6, c) + glowSpot(66, 140, 2, c) + glowSpot(134, 140, 2, c);
    head += blush(71, 145, 6, 3.4) + blush(129, 145, 6, 3.4);
    head += hl(78, 112, 7, 3, -20, .5);
    return { back, body, head, front, anc: anc([100, 112, 56], [100, 124, 50], [100, 156, 48], [100, 150, 48, 30], [100, 164, 40, 28]) };
  };
  const salamander2 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi dài kéo sau, cuộn đầu đuôi
    back += `<g class="pt" style="transform-origin:0% 40%">` + pa(taper([[132, 154], [160, 170], [182, 170], [192, 154], [186, 140], [174, 144]], 22, 5), cel(c.b, c.s), 5) +
      lava('M150,162 l8,4 l6,-3 l8,4 M180,160 l4,-6 l-2,-6') + `</g>`;
    // Chân phía xa
    back += bl(limb([[92, 160, 7.5], [100, 172, 6], [98, 180, 5.5]]) + E(98, 182, 8, 4.5) + limb([[126, 160, 7.5], [118, 172, 6], [120, 180, 5.5]]) + E(120, 182, 8, 4.5), cel(c.s, c.s), 4.5);
    // Thân dài + chân gần khuỳnh
    body += bl(D('M74,140 Q104,130 136,140 Q150,146 146,162 Q136,170 110,168 Q86,168 72,164 Q62,152 74,140 Z') + limb([[76, 160, 9], [62, 168, 7], [60, 180, 6]]) + E(58, 183, 10, 5.5) + limb([[140, 160, 9.5], [154, 170, 7], [156, 180, 6]]) + E(158, 183, 10, 5.5), cel(c.b, c.s));
    body += pa('M72,158 Q100,170 140,162 Q128,170 104,170 Q82,170 72,158 Z', c.l, 0);
    body += ln('M52,186 v-3 M58,186.5 v-3 M64,186 v-3 M152,186 v-3 M158,186.5 v-3 M164,186 v-3', OL, 2);
    // Vết nứt dung nham trên lưng
    body += lava('M86,140 l6,6 l8,-4 l6,7 l9,-3 l6,6 l8,-3 l6,5') + lava('M98,154 l7,3 l5,-3 M120,152 l6,4 l6,-2', 2.4);
    body += glowSpot(84, 150, 2.2, c) + glowSpot(132, 150, 2.4, c);
    // Đầu nhìn người xem + mang lửa lớn hơn
    const hx = 66, hy = 126;
    head += gills(hx - 28, hy - 2, -1, 3, 22, -25, -95, 8) + gills(hx + 28, hy - 2, 1, 3, 22, -25, -95, 8);
    head += bl(E(hx, hy, 32, 21) + E(hx - 15, hy - 12, 10.5, 10) + E(hx + 15, hy - 12, 10.5, 10) + CAP(hx + 6, hy + 10, 80, 148, 16, 15), cel(c.b, c.s));
    head += el(hx, hy + 11, 22, 8, c.l, 0);
    head += salMouth(hx, hy + 9, 17, c, 1);
    head += eye(hx - 15, hy - 11, 8.5, 9, -1, { iris: c.i, lid: .45, skin: c.b, bw: 5 }) + eye(hx + 15, hy - 11, 8.5, 9, 1, { iris: c.i, lid: .45, skin: c.b, bw: 5 });
    head += lava(`M${P(hx - 4, hy - 19)} l4,5 l4,-5`, 2.4) + glowSpot(hx - 26, hy + 4, 2, c) + glowSpot(hx + 26, hy + 4, 2, c);
    head += hl(hx - 19, hy - 19, 5, 2.4, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 20, 48], [hx, hy - 11, 46], [hx + 6, hy + 22, 40], [108, 138, 54, 30], [80, 152, 30, 26]) };
  };
  const salamander3 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi dài cong, gai đá
    back += `<g class="pt" style="transform-origin:0% 55%">` + pa(taper([[136, 146], [164, 166], [186, 160], [194, 138], [184, 118]], 26, 6), cel(c.b, c.s), 5) +
      [[168, 158, 10, 30], [186, 146, 9, 70], [190, 128, 7, 100]].map(([x, y, h, a]) => rot(pa(`M${P(x - 6, y)} L${P(x - 2, y - h)} L${P(x + 3, y - h * .8)} L${P(x + 6, y)} Z`, cel(c.rock, c.rocks), 3), a - 40, x, y)).join('') +
      lava('M158,164 l8,-2 l6,4 M182,146 l4,-6') + `</g>`;
    // Chân phía xa
    back += bl(limb([[90, 146, 8], [92, 168, 6.5], [92, 180, 6]]) + E(94, 183, 9, 5) + limb([[130, 156, 9], [122, 172, 6.5], [126, 182, 6]]) + E(126, 184, 9, 5), cel(c.s, c.s), 4.5);
    // Thân ngóc lên, chân trước thẳng, chân sau gập
    body += bl(D('M70,118 Q100,112 132,130 Q154,142 150,160 Q140,168 120,164 Q98,160 80,150 Q62,140 70,118 Z') + limb([[76, 140, 10], [72, 166, 7.5], [70, 180, 7]]) + E(68, 183, 11, 6) + E(140, 156, 15, 13, -20) + limb([[146, 162, 9], [154, 176, 7], [156, 182, 6.5]]) + E(160, 184, 11, 5.6), cel(c.b, c.s));
    body += pa('M66,128 Q74,148 96,156 Q120,164 144,162 Q122,170 98,164 Q74,152 66,128 Z', c.l, 0);
    body += ln('M62,186 v-3 M68,186.5 v-3 M74,186 v-3 M156,187 v-3 M162,187.5 v-3 M168,187 v-3', OL, 2);
    // Gai đá dọc lưng + dung nham chảy
    const plates = [[84, 114, 22, -8], [102, 116, 26, 0], [120, 124, 24, 10], [136, 134, 20, 22], [148, 146, 15, 34]];
    body += plates.map(([x, y, h, a]) => rot(pa(`M${P(x - 9, y + 4)} L${P(x - 6, y - h * .6)} L${P(x + 1, y - h)} L${P(x + 8, y - h * .5)} L${P(x + 9, y + 4)} Z`, cel(c.rock, c.rocks), 3.8) + ln(`M${P(x + 1, y - h * .9)} L${P(x, y)}`, c.crack, 2), a, x, y)).join('');
    body += lava('M88,124 Q90,132 86,140 M106,126 Q108,136 104,146 Q103,150 105,152 M124,134 Q124,142 120,150', 2.6) + ci(105, 154, 2.6, '#ffb21f', 1.8) + ci(86, 142, 2.2, '#ffb21f', 1.8);
    // Đầu ngẩng cao, mang lửa lớn
    const hx = 64, hy = 100;
    head += gills(hx - 28, hy - 2, -1, 4, 26, -20, -100, 8) + gills(hx + 28, hy - 2, 1, 4, 26, -20, -100, 8);
    head += bl(E(hx, hy, 31, 21) + E(hx - 15, hy - 12, 10, 9.5) + E(hx + 15, hy - 12, 10, 9.5) + CAP(hx + 4, hy + 10, 76, 128, 17, 16), cel(c.b, c.s));
    head += el(hx, hy + 11, 22, 8, c.l, 0);
    head += salMouth(hx, hy + 9, 17, c, 2);
    head += eye(hx - 15, hy - 11, 8, 8, -1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 }) + eye(hx + 15, hy - 11, 8, 8, 1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 });
    head += rot(pa(`M${P(hx - 7, hy - 18)} L${P(hx - 2, hy - 34)} L${P(hx + 4, hy - 30)} L${P(hx + 7, hy - 18)} Z`, cel(c.rock, c.rocks), 3.5), 0, hx, hy) + lava(`M${P(hx - 26, hy + 2)} l4,4 M${P(hx + 26, hy + 2)} l-4,4`, 2.2);
    head += hl(hx - 19, hy - 19, 5, 2.4, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 20, 48], [hx, hy - 11, 46], [hx + 6, hy + 22, 40], [104, 118, 60, 40], [78, 136, 32, 30]) };
  };
  const salamander4 = c => {
    let back = '', body = '', head = '', front = '';
    back += sunAura(100, 96, 96, ['#ff5a1f', '#ffb21f']);
    // Diềm núi lửa xòe sau đầu: nan obsidian, màng dung nham, đỉnh nan phun lửa
    const hx = 100, hy = 98, n = 9, rr = 78, ry_ = 82;
    const tips = [];
    for (let i = 0; i < n; i++) { const a = (-172 + i * 164 / (n - 1)) * R; tips.push([hx + Math.cos(a) * rr, hy + 6 + Math.sin(a) * ry_]); }
    let fd = `M${P(hx - 30, hy + 14)} L${P(tips[0][0], tips[0][1])}`;
    for (let i = 1; i < n; i++) { const a_ = tips[i - 1], b_ = tips[i], mx_ = (a_[0] + b_[0]) / 2, my = (a_[1] + b_[1]) / 2; fd += ` Q${P(mx_ + (hx - mx_) * .07, my + (hy - my) * .07)} ${P(b_[0], b_[1])}`; }
    back += pa(fd + ` L${P(hx + 30, hy + 14)} Z`, lin('#ffe14d', '#ff6a1f', '#b8141f'), 5);
    back += tips.map(([x, y]) => pa(taper([[hx + (x - hx) * .3, hy + (y - hy) * .3], [hx + (x - hx) * .65, hy + (y - hy) * .65], [x, y]], 7, 2.5), c.rock, 2.6)).join('');
    back += tips.map(([x, y], i) => i % 2 === 0 ? fl(x, y + 4, i === 4 ? 30 : 20, i === 4 ? 17 : 12, Math.atan2(y - hy, x - hx) / R + 90, 3.4) : '').join('');
    back += tips.map(([x, y], i) => i % 2 ? ci(x, y, 3.4, c.crack, 2) : '').join('');
    // Đuôi cuộn ra trước
    back += `<g class="pt" style="transform-origin:0% 45%">` + pa(taper([[124, 166], [156, 184], [182, 178], [188, 158], [176, 148]], 22, 6), cel(c.b, c.s), 5) + lava('M150,180 l8,-4 l8,3 l6,-6 M182,166 l-2,-8') + `</g>`;
    // Chân sau thu gọn hai bên
    body += bl(E(66, 168, 15, 12) + E(134, 168, 15, 12) + E(58, 183, 11, 5.6) + E(142, 183, 11, 5.6), cel(c.b, c.s));
    // Thân thon + chân trước chống
    body += bl(E(100, 144, 27, 30) + limb([[80, 128, 9], [60, 146, 7.5], [56, 176, 6.5]]) + E(54, 182, 11, 6) + limb([[120, 128, 9], [140, 146, 7.5], [144, 176, 6.5]]) + E(146, 182, 11, 6), cel(c.b, c.s));
    body += pa('M86,128 Q100,121 114,128 Q120,154 110,168 Q100,173 90,168 Q80,154 86,128 Z', cel(c.l, c.ls), 3.5) + ln('M88,142 Q100,146 112,142 M88,156 Q100,160 112,156', c.ls, 2.2);
    body += [54, 146, 58, 142].map(x => [-1, 0, 1].map(k => pa(`M${P(x + k * 4.5 - 2, 187)} l2,4 l2,-4 Z`, '#ffb21f', 1.4)).join('')).join('');
    // Khe dung nham trên vảy obsidian
    body += lava('M60,142 l4,8 l-2,8 l4,8 M140,142 l-4,8 l2,8 l-4,8 M76,124 l6,6 M124,124 l-6,6 M62,160 l6,4 M138,160 l-6,4', 2.4);
    // Đầu rộng, mang thành ngọn lửa phun
    head += gills(hx - 33, hy - 2, -1, 2, 20, -20, -60, 9, 3.6) + gills(hx + 33, hy - 2, 1, 2, 20, -20, -60, 9, 3.6);
    head += bl(E(hx, hy, 36, 23) + E(hx - 16, hy - 13, 11, 10) + E(hx + 16, hy - 13, 11, 10), cel(c.b, c.s));
    head += el(hx, hy + 11, 25, 8.5, c.l, 0);
    head += salMouth(hx, hy + 10, 19, c, 3);
    head += lava(`M${P(hx - 6, hy - 21)} l6,7 l6,-7 M${P(hx - 32, hy + 2)} l6,4 l-2,6 M${P(hx + 32, hy + 2)} l-6,4 l2,6`, 2.4) + pa(`M${P(hx - 5, hy - 25)} L${P(hx, hy - 32)} L${P(hx + 5, hy - 25)} L${P(hx, hy - 19)} Z`, 'url(#gGold)', 2.4);
    const eo = { iris: '#ffb21f', white: '#fff59a', lid: 1, skin: c.b, glow: '#ff8a1f', bw: 6 };
    head += eye(hx - 16, hy - 12, 8.5, 7.5, -1, eo) + eye(hx + 16, hy - 12, 8.5, 7.5, 1, eo);
    head += ln(`M${P(hx - 30, hy - 12)} L${P(hx - 26, hy - 20)}`, c.edge, 2.4);
    front += embers([[14, 120, 4], [186, 120, 4], [40, 18, 3.5], [160, 18, 3.5], [100, 196, 3]], ['#ff5a1f', '#ffd21f']);
    return { back, body, head, front, anc: anc([hx, hy - 21, 54], [hx, hy - 12, 52], [hx, hy + 22, 46], [100, 118, 56, 60], [100, 144, 40, 40]) };
  };

  PET_SPECS.salamander = {
    el: 'fire',
    c: SAL[1], c4: SAL[4],
    draw(f, g, c) { return fit([null, salamander1, salamander2, salamander3, salamander4][f](SAL[f]), [1, 1, .97, .96, .97][f]); }
  };

  /* =============================== PHƯỢNG HOÀNG =============================== */
  // Nhận diện xuyên suốt: mào 3 ngọn lửa, lông đuôi có "mắt" tròn vàng, bụng vàng
  const PHX = [null,
    { b: '#ff6a3d', s: '#e03c22', l: '#ffe58a', ls: '#f2b24a', i: '#ffc21f', beak: '#ffc21f', beaks: '#e08a00', w: '#ff8a3d', ws: '#e05a1f', leg: '#ffb21f' },
    { b: '#ff5236', s: '#cc2a22', l: '#ffdf7a', ls: '#eaa23a', i: '#ffd21f', beak: '#ffc21f', beaks: '#e08a00', w: '#ff7a2b', ws: '#d4481a', leg: '#ffb21f' },
    { b: '#f53a30', s: '#b0141f', l: '#ffd86b', ls: '#e0962a', i: '#ffd21f', beak: '#ffd21f', beaks: '#e08a00', w: '#ff6a2b', ws: '#c2380f', leg: '#ffb21f' },
    { b: '#e01e30', s: '#7d0a1c', l: '#ffd86b', ls: '#d9902a', i: '#fff59a', beak: '#ffd21f', beaks: '#d48700', w: '#ff4a1f', ws: '#9a1208', leg: '#ffd21f' }
  ];
  // Lông vũ: gốc (x, y), dài len, rộng w, góc ang (độ, 0 = sang phải, 90 = xuống)
  function fth(x, y, len, w, ang, fill, sw = 3.5, vein) {
    const a = ang * R, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const tx = x + ux * len, ty = y + uy * len;
    const d = `M${P(x + nx * w * .3, y + ny * w * .3)} C${P(x + ux * len * .35 + nx * w, y + uy * len * .35 + ny * w)} ${P(x + ux * len * .8 + nx * w * .7, y + uy * len * .8 + ny * w * .7)} ${P(tx, ty)} C${P(x + ux * len * .8 - nx * w * .55, y + uy * len * .8 - ny * w * .55)} ${P(x + ux * len * .35 - nx * w * .9, y + uy * len * .35 - ny * w * .9)} ${P(x - nx * w * .3, y - ny * w * .3)} Z`;
    return pa(d, fill, sw) + (vein ? ln(`M${P(x + ux * len * .15, y + uy * len * .15)} L${P(x + ux * len * .82, y + uy * len * .82)}`, vein, 1.8, 'opacity=".7"') : '');
  }
  // Một tầng lông dạng khối: các lông mọc dọc từ vai sh tới cổ tay wr, góc a0 → a1, dài L0 → L1; mép sau răng cưa mềm
  function plumeLayer(sh, wr, n, a0, a1, L0, L1, fill, o = {}) {
    const tips = [], bases = [];
    for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : 0, x = sh[0] + (wr[0] - sh[0]) * t, y = sh[1] + (wr[1] - sh[1]) * t, a = (a0 + (a1 - a0) * t) * R, L = L0 + (L1 - L0) * Math.pow(t, o.pow ?? 1.6);
      bases.push([x, y]); tips.push([x + Math.cos(a) * L, y + Math.sin(a) * L]);
    }
    const rnd = o.round ?? .3;
    let d = `M${P(sh[0], sh[1])} Q${P((sh[0] + wr[0]) / 2 + (o.bow || 0), (sh[1] + wr[1]) / 2 - Math.abs(o.bow || 0))} ${P(wr[0], wr[1])} L${P(tips[n - 1][0], tips[n - 1][1])}`;
    for (let i = n - 1; i > 0; i--) {
      const A = tips[i], B = tips[i - 1], bx = (bases[i][0] + bases[i - 1][0]) / 2, by = (bases[i][1] + bases[i - 1][1]) / 2;
      const mx_ = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, nx = mx_ + (bx - mx_) * (o.notch ?? .2), ny = my + (by - my) * (o.notch ?? .2);
      d += ` Q${P(A[0] + (nx - A[0]) * rnd + (mx_ - nx) * .6, A[1] + (ny - A[1]) * rnd + (my - ny) * .6)} ${P(nx, ny)} Q${P(B[0] + (mx_ - B[0]) * .5, B[1] + (my - B[1]) * .5)} ${P(B[0], B[1])}`;
    }
    d += ` Q${P((tips[0][0] + sh[0]) / 2 + (o.inX || 0), (tips[0][1] + sh[1]) / 2)} ${P(sh[0], sh[1] + (o.inY || 6))} Z`;
    let s_ = pa(d, fill, o.sw || 4.5);
    if (o.vein) s_ += tips.map((t_, i) => i === n - 1 && !o.veinTip ? '' : ln(`M${P(bases[i][0] + (t_[0] - bases[i][0]) * .3, bases[i][1] + (t_[1] - bases[i][1]) * .3)} L${P(bases[i][0] + (t_[0] - bases[i][0]) * .86, bases[i][1] + (t_[1] - bases[i][1]) * .86)}`, o.vein, 2, 'opacity=".75"')).join('');
    return { s: s_, tips };
  }
  // Cánh nhiều tầng: tiers = [[hệ số dài, màu, màu gân], ...] từ sau ra trước
  function pWing(sh, wr, n, a0, a1, L0, L1, tiers, cov, c) {
    let s_ = '';
    tiers.forEach(([k, fill, vein], ti) => {
      for (let i = n - 1; i >= 0; i--) {
        const t = n > 1 ? i / (n - 1) : 0, x = sh[0] + (wr[0] - sh[0]) * t, y = sh[1] + (wr[1] - sh[1]) * t + ti * 2;
        s_ += fth(x, y, (L0 + (L1 - L0) * Math.pow(t, 1.4)) * k, (11 + t * 3) * (ti ? .92 : 1), a0 + (a1 - a0) * t, fill, 3.4, ti === tiers.length - 1 ? vein : null);
      }
    });
    if (cov) s_ += plumeLayer(sh, wr, n - 1, a0 + 6, a1 - (a1 - a0) * .15, cov, cov * .8, tiers.cov || cel(c.b, c.s), { round: .55, notch: .1, pow: 1 }).s;
    return s_;
  }
  const orb = (x, y, r) => ci(x, y, r, '#ffe14d', 2.4) + ci(x, y, r * .5, '#ff3b2f', 0) + ci(x - r * .3, y - r * .3, r * .22, '#fff', 0);
  // Mào lửa 3 ngọn (hoặc 5) trên đỉnh đầu
  const phCrest = (x, y, h, n = 3, spread = 16) => {
    let s = '';
    const order = n === 3 ? [-1, 1, 0] : [-2, 2, -1, 1, 0];
    for (const k of order) s += fl(x + k * spread * .45, y + Math.abs(k) * 2, h * (1 - Math.abs(k) * .2), h * .5, k * spread, 3.8);
    return s;
  };
  const beak = (x, y, w, h, c) => pa(`M${P(x - w, y)} Q${P(x, y - 4)} ${P(x + w, y)} Q${P(x + w * .5, y + h * .7)} ${P(x, y + h)} Q${P(x - w * .5, y + h * .7)} ${P(x - w, y)} Z`, cel(c.beak, c.beaks), 3.6) + ln(`M${P(x - w * .75, y + h * .35)} Q${P(x, y + h * .5)} ${P(x + w * .75, y + h * .35)}`, OL, 2.2) + hl(x - w * .35, y + 2, w * .25, 1.4, 0, .7);
  const birdFeet = (x, y, c, k = 1) => ln(`M${P(x, y - 5 * k)} l${f1(-7 * k)},${f1(5 * k)} M${P(x, y - 5 * k)} l0,${f1(6 * k)} M${P(x, y - 5 * k)} l${f1(7 * k)},${f1(5 * k)}`, OL, 8 * k) + ln(`M${P(x, y - 5 * k)} l${f1(-7 * k)},${f1(5 * k)} M${P(x, y - 5 * k)} l0,${f1(6 * k)} M${P(x, y - 5 * k)} l${f1(7 * k)},${f1(5 * k)}`, c.leg, 3.6 * k);
  const phoenix1 = c => {
    let back = '', body = '', head = '', front = '';
    // Túm đuôi nhỏ
    back += `<g class="pt" style="transform-origin:0% 60%">` + fth(122, 166, 26, 7, -20, 'url(#gFlame)', 3.6) + fth(124, 170, 22, 6, 8, 'url(#gFlame)', 3.6) + orb(147, 157, 4) + `</g>`;
    // Chân nhỏ
    body += birdFeet(90, 186, c, .9) + birdFeet(110, 186, c, .9);
    // Thân tròn xoe (đầu liền thân)
    body += bl(E(100, 148, 36, 34), cel(c.b, c.s));
    body += el(100, 162, 23, 18, c.l, 0);
    body += ln('M90,160 q5,4 10,0 q5,4 10,0 M94,170 q6,4 12,0', c.ls, 2.2);
    // Cánh tí hon
    body += fth(68, 146, 16, 7, 120, cel(c.w, c.ws), 4) + fth(132, 146, 16, 7, 60, cel(c.w, c.ws), 4);
    head += phCrest(100, 118, 22, 3, 18);
    head += beak(100, 142, 7.5, 9, c);
    head += eyeC(85, 136, 10, 11, -1, c.i) + eyeC(115, 136, 10, 11, 1, c.i);
    head += blush(75, 149, 6, 3.4) + blush(125, 149, 6, 3.4);
    head += hl(80, 124, 8, 3.6, -25, .5);
    return { back, body, head, front, anc: anc([100, 117, 56], [100, 136, 50], [100, 158, 44], [100, 140, 48, 34], [100, 160, 40, 32]) };
  };
  const phoenix2 = c => {
    let back = '', body = '', head = '', front = '';
    // Hai lông đuôi dài có mắt tròn
    back += `<g class="pt" style="transform-origin:0% 0%">` + fth(110, 144, 50, 7, 52, 'url(#gFlame)', 3.6) + fth(112, 142, 44, 6.5, 32, 'url(#gFlame)', 3.6) + orb(141, 183, 4.5) + orb(149, 166, 4.2) + `</g>`;
    // Chân dài
    body += tube('M92,146 L88,164 L92,182', c.leg, 4.2, 3) + tube('M108,146 L112,164 L108,182', c.leg, 4.2, 3);
    body += birdFeet(92, 187, c) + birdFeet(108, 187, c);
    // Thân thon dựng + cổ
    body += bl(E(100, 124, 22, 27) + CAP(100, 108, 100, 88, 13, 12), cel(c.b, c.s));
    body += el(100, 130, 14, 18, c.l, 0) + ln('M93,124 q3.5,3 7,0 q3.5,3 7,0 M94,134 q6,3 12,0', c.ls, 2);
    // Cánh xếp hai bên
    body += fth(82, 108, 40, 9, 100, cel(c.w, c.ws), 4.2, c.ws) + fth(118, 108, 40, 9, 80, cel(c.w, c.ws), 4.2, c.ws);
    body += fth(84, 106, 26, 8, 108, cel(c.b, c.s), 4) + fth(116, 106, 26, 8, 72, cel(c.b, c.s), 4);
    // Đầu
    const hx = 100, hy = 78;
    head += phCrest(hx, hy - 14, 30, 3, 20);
    head += bl(E(hx, hy, 23, 20), cel(c.b, c.s));
    head += beak(hx, hy + 5, 6.5, 11, c);
    head += eye(hx - 11, hy - 2, 8, 9, -1, { iris: c.i, lid: .5, skin: c.b, bw: 5 }) + eye(hx + 11, hy - 2, 8, 9, 1, { iris: c.i, lid: .5, skin: c.b, bw: 5 });
    head += hl(hx - 12, hy - 12, 5.5, 2.6, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 16, 40], [hx, hy - 2, 35], [hx, hy + 18, 30], [100, 100, 40, 46], [100, 122, 32, 40]) };
  };
  const phoenix3 = c => {
    let back = '', body = '', head = '', front = '';
    // Đuôi dài 3 lông kéo xuống đất, cong ở chóp
    back += `<g class="pt" style="transform-origin:38% 0%">` + pa(taper([[104, 136], [120, 160], [140, 176], [164, 178], [176, 166]], 12, 4), 'url(#gFlame)', 3.6) +
      pa(taper([[100, 138], [108, 164], [124, 184], [146, 188]], 11, 4), 'url(#gFlame)', 3.6) + pa(taper([[96, 138], [90, 162], [78, 180], [58, 186]], 10, 4), 'url(#gFlame)', 3.6) +
      orb(176, 164, 5.5) + orb(147, 186, 5) + orb(56, 184, 5) + `</g>`;
    // Đôi cánh sải rộng
    const tiers = [[1, 'url(#gFlame)', '#ff8a1f'], [.66, cel(c.w, c.ws), c.ws]];
    back += pWing([88, 108], [48, 86], 6, 98, 194, 40, 46, tiers, 17, c) + pWing([112, 108], [152, 86], 6, 82, -14, 40, 46, tiers, 17, c);
    // Chân
    body += tube('M94,150 L92,172 L94,180', c.leg, 4.5, 3) + tube('M106,150 L108,172 L106,180', c.leg, 4.5, 3) + birdFeet(94, 186, c) + birdFeet(106, 186, c);
    // Thân + cổ
    body += bl(E(100, 128, 23, 28) + CAP(100, 110, 100, 84, 13, 12), cel(c.b, c.s));
    body += el(100, 134, 15, 19, c.l, 0) + ln('M92,126 q4,3 8,0 q4,3 8,0 M93,138 q7,3 14,0', c.ls, 2);
    // Đầu
    const hx = 100, hy = 70;
    head += phCrest(hx, hy - 14, 40, 3, 22);
    head += [-1, 1].map(sd => fth(hx + sd * 16, hy + 2, 18, 6, 90 - sd * 50, cel(c.b, c.s), 3.6)).join('');
    head += bl(E(hx, hy, 22, 19), cel(c.b, c.s));
    head += beak(hx, hy + 4, 6.5, 12, c);
    head += eye(hx - 10.5, hy - 2, 7.5, 7.5, -1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 }) + eye(hx + 10.5, hy - 2, 7.5, 7.5, 1, { iris: c.i, lid: .85, skin: c.b, bw: 5.5 });
    head += hl(hx - 12, hy - 11, 5.5, 2.6, -25, .5);
    return { back, body, head, front, anc: anc([hx, hy - 15, 38], [hx, hy - 2, 33], [hx, hy + 18, 30], [100, 104, 44, 50], [100, 126, 34, 40]) };
  };
  const phoenix4 = c => {
    let back = '', body = '', head = '', front = '';
    // Vầng hào quang mặt trời
    const sx = 100, sy = 60;
    if (!PET_LITE) {
      let rays = '';
      for (let i = 0; i < 16; i++) { const a = i * 22.5 * R; rays += `<path d="M${P(sx + Math.cos(a - .1) * 50, sy + Math.sin(a - .1) * 50)} L${P(sx + Math.cos(a) * (i % 2 ? 76 : 92), sy + Math.sin(a) * (i % 2 ? 76 : 92))} L${P(sx + Math.cos(a + .1) * 50, sy + Math.sin(a + .1) * 50)} Z" fill="${i % 2 ? '#ffb21f' : '#ffe14d'}"/>`; }
      back += `<circle cx="${sx}" cy="${sy}" r="96" fill="#ffb21f" opacity=".14"/><g class="aura" opacity=".45"><g class="spin" style="transform-origin:${sx}px ${sy}px">${rays}</g></g>`;
    }
    back += `<circle cx="${sx}" cy="${sy}" r="47" fill="#ffe14d" opacity=".28"/><circle cx="${sx}" cy="${sy}" r="47" fill="none" stroke="${OL}" stroke-width="13"/><circle cx="${sx}" cy="${sy}" r="47" fill="none" stroke="url(#gGold)" stroke-width="7"/>` +
      `<circle cx="${sx}" cy="${sy}" r="38" fill="none" stroke="#fff6b0" stroke-width="2.6" stroke-dasharray="3 8" stroke-linecap="round" opacity=".8"/>`;
    // Đuôi xòe nhiều tầng hình quạt, chóp có mắt tròn
    back += `<g class="pt" style="transform-origin:50% 0%;animation-duration:2.4s">`;
    const to = { veinTip: true, notch: .3, round: .12, inY: 0 };
    const ft = plumeLayer([100, 124], [100, 124], 9, 30, 150, 64, 64, 'url(#gGold)', Object.assign({ vein: '#e08a00' }, to));
    back += ft.s + plumeLayer([100, 124], [100, 124], 8, 36, 144, 50, 50, 'url(#gFlame)', to).s + plumeLayer([100, 124], [100, 124], 6, 46, 134, 34, 34, cel(c.w, c.ws), to).s;
    back += ft.tips.map(([x, y]) => orb(x + (100 - x) * .12, y + (124 - y) * .12, 5)).join('') + `</g>`;
    // Đôi cánh lửa giơ cao, nhiều tầng đỏ → cam → vàng
    const tiers = [[1, 'url(#gGold)', '#e08a00'], [.76, 'url(#gFlame)', '#ff8a1f'], [.5, cel(c.w, c.ws), c.ws]];
    tiers.cov = cel('#ff8a2b', '#d4481a');
    back += `<g class="pt" style="transform-origin:100% 100%;animation-name:flapl;animation-duration:1.8s">` + pWing([88, 96], [48, 54], 6, 112, 224, 40, 58, tiers, 16, c) + `</g>`;
    back += `<g class="pt" style="transform-origin:0% 100%;animation-name:flapr;animation-duration:1.8s">` + pWing([112, 96], [152, 54], 6, 68, -44, 40, 58, tiers, 16, c) + `</g>`;
    // Thân thanh mảnh
    body += bl(E(100, 118, 21, 27) + CAP(100, 102, 100, 80, 12, 11), cel(c.b, c.s));
    body += el(100, 124, 13, 18, c.l, 0) + ln('M93,116 q3.5,3 7,0 q3.5,3 7,0 M94,128 q6,3 12,0', c.ls, 2);
    body += pa('M86,100 Q100,110 114,100 L112,106 Q100,116 88,106 Z', 'url(#gGold)', 3) + ci(100, 110, 3.6, '#ff3b4f', 2);
    // Đầu: mào 5 ngọn + vương miện vàng, mắt phát sáng
    const hx = 100, hy = 64;
    head += phCrest(hx, hy - 15, 46, 5, 24);
    head += [-1, 1].map(sd => fth(hx + sd * 15, hy + 2, 22, 6, 90 - sd * 46, 'url(#gFlame)', 3.4) + fth(hx + sd * 16, hy - 2, 18, 5, 90 - sd * 70, cel(c.b, c.s), 3.4)).join('');
    head += bl(E(hx, hy, 21, 18), cel(c.b, c.s));
    head += pa(`M${P(hx - 13, hy - 12)} L${P(hx - 14, hy - 22)} L${P(hx - 6, hy - 16)} L${P(hx, hy - 26)} L${P(hx + 6, hy - 16)} L${P(hx + 14, hy - 22)} L${P(hx + 13, hy - 12)} Q${P(hx, hy - 8)} ${P(hx - 13, hy - 12)} Z`, 'url(#gGold)', 3) + ci(hx, hy - 14, 2.4, '#ff3b4f', 1.6);
    head += beak(hx, hy + 4, 6.5, 12, c);
    const eo = { iris: '#ffb21f', white: '#fff59a', lid: 1, skin: c.b, glow: '#ffe14d', bw: 5.5 };
    head += eye(hx - 10, hy - 2, 7, 6.5, -1, eo) + eye(hx + 10, hy - 2, 7, 6.5, 1, eo);
    head += hl(hx - 12, hy - 10, 5, 2.4, -25, .5);
    front += embers([[16, 150, 4], [184, 150, 4], [30, 190, 3.5], [170, 190, 3.5], [100, 196, 3]], ['#ff8a1f', '#ffe14d']);
    return { back, body, head, front, anc: anc([hx, hy - 22, 36], [hx, hy - 2, 31], [hx, hy + 18, 28], [100, 94, 40, 48], [100, 116, 32, 38]) };
  };

  PET_SPECS.phoenix = {
    el: 'fire',
    c: PHX[1], c4: PHX[4],
    draw(f, g, c) { return fit([null, phoenix1, phoenix2, phoenix3, phoenix4][f](PHX[f]), [1, 1.14, .96, .92, 1][f]); }
  };
})();
