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

/* ---------- SỬ THI ---------- */
// Khối PET_SPECS.ep_* của 7 pet Sử thi ghép ngay dưới dòng này.

/* ===================== SỬ THI · NGHÊ LỬA (ep_nghe, hệ Lửa) =====================
   Linh vật canh giữ đền Việt: dáng chó-sư tử, bờm xoăn ốc, sơn son thếp vàng, kết với lửa.
   Nghê con ôm ngọc → Nghê thiếu niên vờn cầu → Nghê trưởng thành ngồi canh trên trống đồng → Nghê thần trên cầu lửa, hào quang mặt trời trống đồng.
   Mỗi dạng là một dáng riêng, tọa độ tuyệt đối trong khung 200×200 (tâm x = 100, chân chạm y = 188). Không dùng RIG.
   draw(f, g, c) giữ chữ ký chung; g và c bị bỏ qua (mỗi dạng có bảng màu riêng NGH[f]).
   Trả về { back, body, head, front, anc }; anc.halo = [x, y, rx] là vị trí đầu thật cho hiệu ứng hào quang (haloAt).
   Cần: gfx.js (pa, el, ci, ln, hl, bl, P, f1, cel, eye, capsule, OL; gradient #gFlame, #gGold của baseDefs) và pets.js (PET_SPECS, PET_LITE).
   Mọi hàm phụ nằm trong IIFE, tiền tố ngh, không thêm tên toàn cục nào ngoài PET_SPECS.ep_nghe. */
(() => {
  const R = Math.PI / 180;
  const GOLD = '#ffd23f', GOLD_S = '#e08a00', GOLD_D = '#b85f00';
  // Bảng màu từng dạng: b thân son, s bóng, d chân xa, l kem (mõm, bụng), ls bóng kem, g vàng bờm, gs bóng vàng, sp nét xoắn, i mống mắt
  const NGH = [null,
    { b: '#ff6440', s: '#d6301f', d: '#a81e1a', l: '#ffeccc', ls: '#f5c690', g: '#ffd84a', gs: '#e8920a', sp: '#c86a00', i: '#ffb21f', ear: '#ff9a8a' },
    { b: '#ff5a3a', s: '#cc2a1c', d: '#9a1a18', l: '#ffe6c0', ls: '#f0bc84', g: '#ffd23f', gs: '#e08a00', sp: '#c06200', i: '#ffb21f', ear: '#ff8f84' },
    { b: '#f84a32', s: '#b81e1a', d: '#861214', l: '#ffe2b8', ls: '#e9ae72', g: '#ffd21f', gs: '#d98200', sp: '#b45a00', i: '#ffd21f', ear: '#ff8a80' },
    { b: '#f23a2c', s: '#9e101c', d: '#6e0a14', l: '#ffe0ae', ls: '#e6a060', g: '#ffd21f', gs: '#d97a00', sp: '#a85000', i: '#fff59a', ear: '#ff7f7a' }
  ];
  const nghE = (cx, cy, rx, ry, a = 0) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"${a ? ` transform="rotate(${f1(a)} ${f1(cx)} ${f1(cy)})"` : ''}/>`;
  const nghC = (x, y, r) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
  const nghD = d => `<path d="${d}"/>`;
  const nghCap = (x1, y1, x2, y2, r1, r2 = r1) => nghD(capsule(x1, y1, x2, y2, r1, r2));
  const nghLimb = pts => pts.slice(1).map((q, i) => nghCap(pts[i][0], pts[i][1], q[0], q[1], pts[i][2], q[2])).join('');
  // Nhiều ngọn lửa gộp một path (nhẹ hơn): L = [[x, y, cao, rộng, góc], ...]; lõi sáng cho ngọn cao ≥ o.coreMin (mặc định 14)
  function nghFlD(x, y, h, w, a, core) {
    const ca = Math.cos(a * R), sa = Math.sin(a * R), T = (u, v) => P(x + u * w * ca - v * h * sa, y + u * w * sa + v * h * ca);
    return core ? `M${T(-.26, -.04)}C${T(-.3, -.26)} ${T(-.04, -.32)} ${T(.02, -.52)}C${T(.3, -.32)} ${T(.32, -.14)} ${T(.24, -.03)}Q${T(0, .04)} ${T(-.26, -.04)}Z`
      : `M${T(-.5, 0)}C${T(-.62, -.38)} ${T(-.1, -.5)} ${T(-.2, -.78)}C${T(.08, -.62)} ${T(.12, -.6)} ${T(.16, -1)}C${T(.6, -.64)} ${T(.64, -.3)} ${T(.5, 0)}Q${T(0, .12)} ${T(-.5, 0)}Z`;
  }
  const nghFlames = (L, o = {}) => pa(L.map(q => nghFlD(q[0], q[1], q[2], q[3] ?? q[2] * .6, q[4] || 0)).join(''), o.fill || 'url(#gFlame)', o.sw ?? 4) +
    (o.core === false ? '' : pa(L.filter(q => q[2] >= (o.coreMin || 14)).map(q => nghFlD(q[0], q[1], q[2], q[3] ?? q[2] * .6, q[4] || 0, 1)).join(''), '#fff59a', 0));
  // Đường cong mượt qua các điểm (Catmull-Rom)
  function nghSmooth(p, move = true) {
    let d = (move ? 'M' : ' L') + P(p[0][0], p[0][1]);
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += ` C${P(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${P(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${P(c[0], c[1])}`;
    }
    return d;
  }
  // Khối thuôn theo đường tâm (đuôi), rộng w0 → w1
  function nghTaper(c, w0, w1) {
    const L = [], Rr = [], n = c.length;
    for (let i = 0; i < n; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([c[i][0] - dy / m * w, c[i][1] + dx / m * w]); Rr.push([c[i][0] + dy / m * w, c[i][1] - dx / m * w]);
    }
    return nghSmooth(L) + nghSmooth(Rr.reverse(), false) + ' Z';
  }
  // Nét xoắn ốc trong một lọn bờm: tâm (x, y), bán kính r, xoay a, chiều sd
  function nghSpiral(x, y, r, a = 0, sd = 1) {
    const k = r * .25, ca = Math.cos(a * R), sa = Math.sin(a * R), Q = u => P(x + u * ca, y + u * sa), f = sd > 0 ? 1 : 0;
    return `M${Q(-k * .2)} A${f1(k * .9)},${f1(k * .9)} 0 0 ${f} ${Q(k * 1.6)} A${f1(k * 1.9)},${f1(k * 1.9)} 0 0 ${f} ${Q(-k * 2.2)} A${f1(k * 2.7)},${f1(k * 2.7)} 0 0 ${f} ${Q(k * 3.2)}`;
  }
  // Cụm lọn xoăn: một khối viền chung, mỗi lọn cel riêng, nét xoắn gộp một path. L = [[x, y, r, góc, chiều], ...]
  function nghCurls(L, c, o = {}) {
    const base = o.b || c.g, sh = o.s || c.gs;
    let s = bl(L.map(([x, y, r]) => nghC(x, y, r)).join(''), cel(base, sh), o.sw ?? 4.5);
    s += ln(L.map(([x, y, r, a = 0, sd = 1]) => nghSpiral(x, y, r * .86, a, sd)).join(' '), o.sp || c.sp, o.lw ?? 2.2);
    if (o.hl !== false) s += L.filter((q, i) => q[2] >= 7 && i % 2 === 0).map(([x, y, r]) => hl(x - r * .42, y - r * .48, r * .28, r * .14, -35, .55)).join('');
    return s;
  }
  // Cánh hoa / tai: gốc (x, y), dài L, nửa rộng w, hướng ang (độ)
  function nghPetalD(x, y, L, w, ang) {
    const a = ang * R, ux = Math.cos(a), uy = Math.sin(a), q = (k, s) => P(x + ux * L * k - uy * w * s, y + uy * L * k + ux * w * s);
    return `M${P(x, y)} C${q(.15, 1.1)} ${q(.7, 1.15)} ${q(1, 0)} C${q(.7, -1.15)} ${q(.15, -1.1)} ${P(x, y)} Z`;
  }
  const nghEar = (x, y, L, w, ang, c) => pa(nghPetalD(x, y, L, w, ang), cel(c.b, c.s), 4.5) + pa(nghPetalD(x + Math.cos(ang * R) * 2.5, y + Math.sin(ang * R) * 2.5, L * .7, w * .5, ang), c.ear, 0);
  // Lông mày xoăn vàng: gốc trong (x, y), bên sd, cỡ k
  function nghBrow(x, y, sd, k, c, w = 4.2) {
    const ex = x + sd * 12 * k, ey = y - 3.5 * k, d = `M${P(x, y)} Q${P(x + sd * 6 * k, y - 5.5 * k)} ${P(ex, ey)}`;
    return ln(d, OL, w * k + 4) + ln(d, c.g, w * k) + ci(ex + sd * 2.6 * k, ey + .6 * k, 3.6 * k, cel(c.g, c.gs), 2.6) + ln(nghSpiral(ex + sd * 2.6 * k, ey + .6 * k, 3.1 * k, 0, sd), c.sp, 1.5);
  }
  // Mắt tròn to (dạng 1) và mắt có mí (dạng 2–4)
  const nghEyeCute = (cx, cy, r, sd, c) => eye(cx, cy, r, r * 1.08, sd, { iris: c.i, lid: 0, brow: false, pr: r * .58, ew: 3.6 });
  const nghEye = (cx, cy, rx, ry, sd, c, lid, o = {}) => eye(cx, cy, rx, ry, sd, Object.assign({ iris: c.i, lid, skin: c.b, bw: 4.6, ew: 3.6 }, o));
  // Mặt Nghê: mõm kem hai bên, mũi to, miệng cười rộng; mode: 'smile' | 'grin' | 'open'
  function nghFace(hx, hy, k, c, mode = 'smile') {
    let s = el(hx - 7 * k, hy + 13 * k, 9 * k, 7.4 * k, c.l, 0) + el(hx + 7 * k, hy + 13 * k, 9 * k, 7.4 * k, c.l, 0) + el(hx, hy + 17 * k, 7 * k, 5.5 * k, c.l, 0);
    s += `<g fill="${c.s}">${[-1, 1].map(sd => [[10, 12], [13, 14.5], [9.5, 16]].map(([dx, dy]) => nghC(hx + sd * dx * k, hy + dy * k, 1.15 * k)).join('')).join('')}</g>`;
    if (mode === 'open') {
      s += pa(`M${P(hx - 9 * k, hy + 16 * k)} Q${P(hx, hy + 31 * k)} ${P(hx + 9 * k, hy + 16 * k)} Q${P(hx, hy + 19 * k)} ${P(hx - 9 * k, hy + 16 * k)} Z`, '#7a1030', 3) + el(hx, hy + 23.5 * k, 4.6 * k, 2.6 * k, '#ff6a8a', 0) +
        pa(`M${P(hx - 7 * k, hy + 16.6 * k)} l${f1(1.6 * k)},${f1(4.2 * k)} l${f1(1.6 * k)},${f1(-3.8 * k)} Z M${P(hx + 7 * k, hy + 16.6 * k)} l${f1(-1.6 * k)},${f1(4.2 * k)} l${f1(-1.6 * k)},${f1(-3.8 * k)} Z`, '#fff', 1.5);
    }
    s += ln(`M${P(hx - 13 * k, hy + 13 * k)} Q${P(hx - 6.5 * k, hy + 20 * k)} ${P(hx, hy + 15.5 * k)} Q${P(hx + 6.5 * k, hy + 20 * k)} ${P(hx + 13 * k, hy + 13 * k)}`, OL, 2.8);
    if (mode === 'grin') s += pa(`M${P(hx + 4 * k, hy + 17.2 * k)} l${f1(1.7 * k)},${f1(4 * k)} l${f1(1.7 * k)},${f1(-4.4 * k)} Z M${P(hx - 7.4 * k, hy + 17.2 * k)} l${f1(1.7 * k)},${f1(4.4 * k)} l${f1(1.7 * k)},${f1(-4 * k)} Z`, '#fff', 1.5);
    // Mũi to bè
    s += pa(`M${P(hx - 7 * k, hy + 6 * k)} Q${P(hx, hy + 2.6 * k)} ${P(hx + 7 * k, hy + 6 * k)} Q${P(hx + 8 * k, hy + 11 * k)} ${P(hx, hy + 12 * k)} Q${P(hx - 8 * k, hy + 11 * k)} ${P(hx - 7 * k, hy + 6 * k)} Z`, '#5a1430', 3) + hl(hx - 2 * k, hy + 5.6 * k, 2.8 * k, 1.2 * k, 0, .75);
    return s;
  }
  // Ấn lửa trên trán
  const nghMark = (x, y, h, c) => pa(`M${P(x, y)} C${P(x - h * .42, y - h * .3)} ${P(x - h * .3, y - h * .7)} ${P(x, y - h)} C${P(x + h * .3, y - h * .7)} ${P(x + h * .42, y - h * .3)} ${P(x, y)} Z`, 'url(#gGold)', 2.4) +
    pa(`M${P(x, y - h * .2)} C${P(x - h * .18, y - h * .36)} ${P(x - h * .12, y - h * .58)} ${P(x, y - h * .72)} C${P(x + h * .12, y - h * .58)} ${P(x + h * .18, y - h * .36)} ${P(x, y - h * .2)} Z`, '#ff3d1a', 0);
  // Ngọc lửa (cầu lửa): tâm (x, y), bán kính r
  function nghOrb(x, y, r, o = {}) {
    let s = '';
    if (o.glow && !PET_LITE) s += `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.7)}" fill="#ffb21f" opacity=".18"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.35)}" fill="#ffd21f" opacity=".22"/>`;
    if (o.flames) s += nghFlames([-56, -20, 20, 56].map((a, i) => [x + Math.sin(a * R) * r * .8, y - Math.cos(a * R) * r * .8, r * (i % 3 ? 1.1 : .85), r * .62, a]), { sw: 3.6, core: false });
    s += ci(x, y, r, cel('#fff3a0', '#ff8a1f', .58), 4);
    s += ln(`M${P(x - r * .55, y + r * .15)} Q${P(x - r * .2, y - r * .55)} ${P(x + r * .35, y - r * .2)} Q${P(x + r * .55, y + r * .15)} ${P(x + r * .2, y + r * .3)} M${P(x + r * .5, y + r * .5)} Q${P(x - r * .1, y + r * .85)} ${P(x - r * .6, y + r * .45)}`, '#ff5a1f', Math.max(1.6, r * .11));
    return s + hl(x - r * .38, y - r * .45, r * .3, r * .15, -35, .8);
  }
  // Chuông đồng: đỉnh quai (x, y), cỡ k, màu col/cold
  function nghBell(x, y, k, col = '#e8a640', cold = '#a8601c') {
    return ci(x, y + 1.5 * k, 2.4 * k, 'none', 2.2) +
      pa(`M${P(x - 6.5 * k, y + 13 * k)} Q${P(x - 7 * k, y + 3 * k)} ${P(x, y + 3 * k)} Q${P(x + 7 * k, y + 3 * k)} ${P(x + 6.5 * k, y + 13 * k)} Z`, cel(col, cold), 3) +
      el(x, y + 13 * k, 8.2 * k, 2.4 * k, cel(col, cold), 2.8) + ln(`M${P(x - 5 * k, y + 8 * k)} Q${P(x, y + 9.5 * k)} ${P(x + 5 * k, y + 8 * k)}`, cold, 1.6) +
      ci(x, y + 15.6 * k, 1.9 * k, OL, 0) + hl(x - 3 * k, y + 6.5 * k, 1.4 * k, 2.6 * k, 20, .7);
  }
  // Đốm tàn lửa bay
  const nghEmbers = spots => PET_LITE ? '' : `<g class="motes">` + spots.map(([x, y, r], i) => `<g class="ember" style="animation-delay:-${f1(i * .43)}s">${pa(nghFlD(x, y + r, r * 2.3, r * 1.5, (i % 3 - 1) * 14), 'url(#gFlame)', 1.8)}</g>`).join('') + `</g>`;
  const nghAnc = (head, eyes, neck, back, body, halo) => ({ head, eyes, neck, back, body, halo });

  /* ---------------- Dạng 1: Nghê con ngồi ôm ngọc ---------------- */
  function nghe1(c) {
    let back = '', body = '', head = '', front = '';
    // Đuôi cuộn lên, chóp lọn xoăn có lửa
    back += `<g class="pt">` + pa(nghTaper([[114, 181], [136, 180], [151, 170], [157, 157], [155, 148]], 13, 9), cel(c.b, c.s), 4.5) +
      nghFlames([[156, 138, 19, 12, 10]], { sw: 3.6 }) + nghCurls([[155, 146, 8.5, 20, 1], [163, 141, 6, 0, -1], [147, 141, 5.5, 0, 1]], c) + `</g>`;
    // Thân ngồi tròn + hai đùi, một khối
    body += bl(nghE(100, 163, 26, 22) + nghE(77, 176, 14, 11.5) + nghE(123, 176, 14, 11.5), cel(c.b, c.s));
    body += el(100, 168, 15, 14, c.l, 0) + ln('M80,170 q4,6 4,12 M120,170 q-4,6 -4,12', c.s, 2.4);
    body += el(73, 184, 9.5, 5.4, c.l, 4) + el(127, 184, 9.5, 5.4, c.l, 4) + ln('M70,187 v-3 M76,187 v-3 M124,187 v-3 M130,187 v-3', OL, 2);
    // Ôm ngọc lửa trước bụng
    body += bl(nghCap(82, 150, 86, 161, 7.6, 6.8) + nghCap(118, 150, 114, 161, 7.6, 6.8), cel(c.b, c.s), 5);
    body += nghOrb(100, 173, 12.5);
    body += bl(nghC(87.5, 164, 6.2) + nghC(112.5, 164, 6.2), cel(c.b, c.s), 4) + ln('M85,168 l1.5,-2.6 M89,168.6 l.6,-2.8 M115,168 l-1.5,-2.6 M111,168.6 l-.6,-2.8', OL, 1.6);
    // Tai cụp + đầu to tròn, má bầu
    head += bl(nghD(nghPetalD(70, 106, 19, 9, 150)) + nghD(nghPetalD(130, 106, 19, 9, 30)) + nghE(100, 121, 35, 30) + nghE(71, 132, 10, 9) + nghE(129, 132, 10, 9), cel(c.b, c.s));
    head += pa(nghPetalD(68, 108, 13, 4.5, 150), c.ear, 0) + pa(nghPetalD(132, 108, 13, 4.5, 30), c.ear, 0);
    // Búi lọn xoăn trên đỉnh, ngọn lửa nhỏ
    head += `<g class="flame">${nghFlames([[100, 86, 25, 14, 0]], { sw: 3.6 })}</g>`;
    head += nghCurls([[77, 101, 6.5, 30, -1], [123, 101, 6.5, 150, 1], [86, 93, 9, 20, -1], [114, 93, 9, 160, 1], [100, 89, 10.5, 0, 1]], c);
    head += nghCurls([[66, 123, 6, 0, 1], [68, 134, 6.8, 0, -1], [134, 123, 6, 180, -1], [132, 134, 6.8, 180, 1]], c, { hl: false });
    head += nghMark(100, 108, 9, c);
    head += nghEyeCute(85, 120, 10.5, -1, c) + nghEyeCute(115, 120, 10.5, 1, c);
    head += nghBrow(93, 107, -1, .8, c) + nghBrow(107, 107, 1, .8, c);
    head += nghFace(100, 121, .8, c, 'open');
    head += el(79, 137, 5, 3, '#ff7a9a', 0, 'opacity=".6"') + el(121, 137, 5, 3, '#ff7a9a', 0, 'opacity=".6"');
    head += nghCurls([[92, 150, 4.8, 0, -1], [100, 152, 5.2, 0, 1], [108, 150, 4.8, 0, 1]], c, { hl: false, lw: 1.6, sw: 3.5 });
    return { back, body, head, front, anc: nghAnc([100, 95, 56], [100, 120, 50], [100, 150, 40], [100, 140, 60, 44], [100, 166, 38, 36], [100, 76, 27]) };
  }

  /* ---------------- Dạng 2: Nghê thiếu niên vờn ngọc ---------------- */
  function nghe2(c) {
    let back = '', body = '', head = '', front = '';
    // Đuôi lửa cuộn cao
    back += `<g class="pt">` + pa(nghTaper([[146, 130], [162, 122], [172, 108], [174, 94], [168, 84]], 15, 11), cel(c.b, c.s), 5) +
      nghFlames([[169, 68, 27, 16, 6], [181, 75, 17, 10, 42], [157, 73, 16, 10, -40]]) +
      nghCurls([[168, 80, 10, 30, 1], [179, 75, 7, 0, -1], [158, 74, 7, 0, 1], [172, 91, 6, 0, -1]], c) + `</g>`;
    // Chân phía xa (tối)
    back += bl(nghLimb([[98, 140, 8], [100, 166, 6.2], [100, 181, 5.6]]) + nghLimb([[124, 140, 8.5], [120, 164, 6.4], [122, 181, 5.8]]), cel(c.s, c.d), 4.5);
    back += el(102, 184, 8.5, 5, c.ls, 3.8) + el(124, 184, 8.5, 5, c.ls, 3.8);
    // Ngọc lửa dưới chân trước
    body += nghOrb(46, 171, 15, { glow: true, flames: true });
    // Thân ngang + chân gần + cổ, một khối
    body += bl(nghE(88, 130, 21, 19) + nghE(134, 128, 22, 18) + nghCap(88, 129, 134, 128, 17, 16.5) + nghE(140, 140, 14, 15) +
      nghLimb([[142, 146, 8.4], [146, 166, 6.6], [144, 181, 6.2]]) + nghLimb([[82, 136, 9], [68, 150, 7.2], [58, 156, 6.6]]) + nghCap(84, 122, 72, 100, 15, 13), cel(c.b, c.s));
    body += hl(84, 118, 8, 3.4, -30, .45) + nghFlames([[75, 141, 12, 7, 30], [152, 161, 11, 6.5, 100]], { sw: 3, core: false });
    const sc2 = nghSpiral(138, 132, 9, 0, 1) + ' M126,142 Q134,148 144,143';
    body += ln(sc2, OL, 5) + ln(sc2, GOLD, 2.4);
    body += pa('M60,148 Q66,154 72,150 L74,155 Q67,160 61,153 Z', 'url(#gGold)', 2.2) + pa('M139,166 Q146,169 153,166 L153,171 Q146,174 139,171 Z', 'url(#gGold)', 2.2);
    body += el(146, 184, 9.5, 5.5, c.l, 4) + ln('M143,187 v-3 M149,187 v-3', OL, 2);
    body += el(55, 156, 9, 6, c.l, 3.8, 'transform="rotate(-20 55 156)"') + ln('M50,159 l1,-3 M55,160 l1,-3', OL, 1.8);
    // Bờm lửa xoăn sau gáy và dọc cổ
    body += nghFlames([[88, 66, 22, 13, 28], [98, 80, 23, 13, 48], [104, 96, 21, 12, 66], [104, 112, 18, 11, 86]]);
    body += nghCurls([[84, 70, 8, 0, 1], [92, 81, 10, 20, -1], [97, 95, 10.5, 40, 1], [99, 109, 9.5, 60, -1], [94, 121, 8.5, 80, 1], [80, 62, 7, 0, -1]], c);
    // Đầu nhìn người xem
    const hx = 64, hy = 92;
    head += bl(nghD(nghPetalD(42, 86, 17, 8, 155)) + nghD(nghPetalD(86, 86, 17, 8, 25)) + nghE(hx, hy, 27, 23) + nghE(hx - 20, hy + 9, 8.5, 8) + nghE(hx + 20, hy + 9, 8.5, 8), cel(c.b, c.s));
    head += pa(nghPetalD(40, 87, 11.5, 4, 155), c.ear, 0) + pa(nghPetalD(88, 87, 11.5, 4, 25), c.ear, 0);
    head += `<g class="flame">${nghFlames([[hx, 63, 16, 10, 0]], { sw: 3.4 })}</g>`;
    head += nghCurls([[hx - 13, 74, 6.5, 30, -1], [hx + 13, 74, 6.5, 150, 1], [hx, 69, 8.5, 0, 1]], c);
    head += nghCurls([[hx - 23, hy + 9, 6.8, 0, -1], [hx + 23, hy + 9, 6.8, 180, 1]], c, { hl: false, lw: 1.8 });
    head += nghMark(hx, hy - 12, 8, c);
    head += nghEye(hx - 11, hy - 1, 8, 8.6, -1, c, .55) + nghEye(hx + 11, hy - 1, 8, 8.6, 1, c, .55);
    head += nghBrow(hx - 5, hy - 12, -1, .85, c) + nghBrow(hx + 5, hy - 12, 1, .85, c);
    head += nghFace(hx, hy, .75, c, 'grin');
    head += nghCurls([[hx - 7, hy + 23, 4.6, 0, -1], [hx, hy + 25, 5, 0, 1], [hx + 7, hy + 23, 4.6, 0, 1]], c, { hl: false, lw: 1.6, sw: 3.5 });
    return { back, body, head, front, anc: nghAnc([hx, 72, 46], [hx, hy - 1, 42], [74, 116, 32], [118, 102, 62, 42], [100, 132, 40, 30], [hx, 56, 23]) };
  }

  /* ---------------- Dạng 3: Nghê trưởng thành ngồi canh trên trống đồng ---------------- */
  // Trống đồng: mặt tâm (cx, cy), nửa rộng rx, nửa cao mặt ry; tang phình, lưng thắt, chân loe
  function nghDrum(cx, cy, rx, ry) {
    const B = '#dc9c45', BS = '#94561c', T = '#f3c160', TS = '#bb7a2c', W = rx * .86, F = rx * .92;
    let s = pa(`M${P(cx - rx, cy)} C${P(cx - rx, cy + 7)} ${P(cx - W, cy + 12)} ${P(cx - W, cy + 18)} C${P(cx - W, cy + 21)} ${P(cx - F, 179)} ${P(cx - F, 182)} Q${P(cx, 194)} ${P(cx + F, 182)} C${P(cx + F, 179)} ${P(cx + W, cy + 21)} ${P(cx + W, cy + 18)} C${P(cx + W, cy + 12)} ${P(cx + rx, cy + 7)} ${P(cx + rx, cy)} Z`, cel(B, BS, .72), 4.5);
    // Băng vòng tròn tiếp tuyến trên tang trống, răng cưa ở chân
    const yb = t => 4 * t * (1 - t) * ry * 1.05;
    let d = '', zz = '', cs = '';
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, x = cx - rx * .9 + t * rx * 1.8, y = cy + 9 + yb(t);
      d += (i ? 'L' : 'M') + P(x, y);
      if (i % 12) cs += nghC(x, y, 2.9);
    }
    for (let i = 0; i <= 16; i++) { const t = i / 16, x = cx - F + 2 + t * (F * 2 - 4), y = 178 + yb(t) * .9 + (i % 2 ? 3.6 : 0); zz += (i ? 'L' : 'M') + P(x, y); }
    s += ln(d, BS, 1.6) + `<g fill="${T}" stroke="${BS}" stroke-width="1.5">${cs}</g>` + ln(cs.replace(/<circle cx="([\d.]+)" cy="([\d.]+)" r="[\d.]+"\/>/g, 'M$1,$2h.01'), BS, 2.2);
    s += ln(`M${P(cx - W, cy + 18)} Q${P(cx, cy + 18 + ry * 2.1)} ${P(cx + W, cy + 18)}`, BS, 2) + ln(zz, BS, 1.6);
    // Mặt trống: vành đồng tâm, ngôi sao 14 cánh
    s += el(cx, cy, rx, ry, cel(T, TS, .78), 4.5) + `<g fill="none" stroke="${TS}"><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx * .84)}" ry="${f1(ry * .78)}" stroke-width="1.8"/><ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx * .67)}" ry="${f1(ry * .6)}" stroke-width="2.2" stroke-dasharray="0 5" stroke-linecap="round"/></g>`;
    let st = '';
    for (let i = 0; i < 14; i++) {
      const a0 = (i * 360 / 14) * R, a1 = ((i + .5) * 360 / 14) * R;
      st += (i ? 'L' : 'M') + P(cx + Math.cos(a0) * rx * .52, cy + Math.sin(a0) * ry * .5) + 'L' + P(cx + Math.cos(a1) * rx * .2, cy + Math.sin(a1) * ry * .2);
    }
    s += pa(st + 'Z', '#ffeaa0', 1.6);
    return s + hl(cx - rx * .6, cy - ry * .3, rx * .16, 1.8, -4, .5);
  }
  function nghe3(c) {
    let back = '', body = '', head = '', front = '';
    back += nghDrum(104, 157, 52, 10.5);
    // Đuôi lửa lớn dựng sau đùi
    back += `<g class="pt">` + pa(nghTaper([[136, 146], [156, 140], [170, 124], [175, 108], [170, 96]], 17, 12), cel(c.b, c.s), 5) +
      nghFlames([[169, 75, 32, 19, 4], [184, 84, 20, 12, 42], [154, 82, 18, 11, -38], [182, 102, 15, 10, 80]]) +
      nghCurls([[169, 92, 11, 30, 1], [180, 86, 7.5, 0, -1], [158, 86, 7, 0, 1], [178, 101, 6.5, 0, -1]], c) + `</g>`;
    // Chân trước phía xa
    back += bl(nghLimb([[98, 126, 8.2], [100, 146, 7], [100, 152, 6.8]]), cel(c.s, c.d), 4.5) + el(101, 154, 9, 5, c.ls, 3.8) + ln('M98,157 v-3 M104,157 v-3', OL, 1.8);
    // Bờm lọn xoăn đổ dọc gáy; lửa tỏa sau
    body += nghFlames([[100, 40, 25, 14, 18], [112, 52, 27, 15, 40], [119, 68, 27, 15, 60], [119, 86, 23, 13, 82], [113, 101, 18, 11, 104]]);
    // Thân ngồi thẳng: đùi sau tròn + ngực ưỡn + chân trước gần
    body += bl(nghE(128, 140, 20, 18) + nghCap(124, 138, 92, 112, 19, 19) + nghE(86, 116, 18, 21) + nghLimb([[80, 122, 9], [79, 146, 7.4], [78, 152, 7.2]]), cel(c.b, c.s));
    body += pa('M73,106 Q86,100 98,108 Q100,122 93,131 Q83,134 76,126 Q69,116 73,106 Z', c.l, 0) + ln('M80,116 l3,6 M90,114 l-2,7', c.ls, 2);
    const sc3 = nghSpiral(130, 138, 11, 0, 1) + ' M120,147 Q122,155 132,154';
    body += ln(sc3, OL, 5.2) + ln(sc3, GOLD, 2.5);
    body += nghCurls([[96, 46, 9.5, 0, 1], [105, 59, 11, 20, -1], [109, 74, 11, 40, 1], [108, 89, 10, 60, -1], [102, 101, 8.5, 80, 1]], c);
    body += el(146, 155, 11, 5.5, c.l, 4) + el(77, 155, 10.5, 5.6, c.l, 4) + ln('M73,158 v-3 M79,158 v-3 M143,158 v-3 M149,158 v-3', OL, 2);
    // Lửa xoắn quanh cổ chân + vòng vàng
    body += nghFlames([[73, 141, 11, 6.5, -24], [80, 139.5, 14, 8, 8], [87, 141, 11, 6.5, 40], [140, 150, 10, 6, -10], [147, 149, 13, 7.5, 22], [153, 151, 10, 6, 55]], { sw: 3 });
    body += [[79, 142], [146, 149.5]].map(([x, y]) => pa(`M${P(x - 8, y - 1)} Q${P(x, y + 2.6)} ${P(x + 8, y - 1)} L${P(x + 8, y + 3.6)} Q${P(x, y + 7)} ${P(x - 8, y + 3.6)} Z`, 'url(#gGold)', 2.2)).join('');
    // Vòng cổ đồng + chuông
    body += pa('M64,96 Q84,108 104,94 L105,101 Q84,116 63,103 Z', cel('#ffd84a', '#c47a10'), 3.2) + `<g fill="#ff3b4f" stroke="${OL}" stroke-width="1.2">${[[70, 103], [77, 106], [91, 106], [98, 102]].map(([x, y]) => nghC(x, y, 1.7)).join('')}</g>`;
    body += nghBell(84, 107, 1.1);
    // Đầu
    const hx = 76, hy = 64;
    head += bl(nghD(nghPetalD(51, 56, 17, 8, 160)) + nghD(nghPetalD(101, 56, 17, 8, 20)) + nghE(hx, hy, 28, 24) + nghE(hx - 21, hy + 9, 9, 8.5) + nghE(hx + 21, hy + 9, 9, 8.5), cel(c.b, c.s));
    head += pa(nghPetalD(49, 57, 11.5, 4, 160), c.ear, 0) + pa(nghPetalD(103, 57, 11.5, 4, 20), c.ear, 0);
    head += `<g class="flame">${nghFlames([[hx, 35, 19, 11.5, 0], [hx - 14, 40, 14, 9, -24], [hx + 14, 40, 14, 9, 24]], { sw: 3.6 })}</g>`;
    head += nghCurls([[hx - 16, 47, 7, 30, -1], [hx + 16, 47, 7, 150, 1], [hx - 7, 41, 8.5, 20, -1], [hx + 7, 41, 8.5, 160, 1]], c);
    head += nghCurls([[hx - 24, hy + 9, 7.2, 0, -1], [hx + 24, hy + 9, 7.2, 180, 1]], c, { hl: false, lw: 1.8 });
    head += nghMark(hx, hy - 12, 9, c);
    head += nghEye(hx - 11, hy - 1, 8, 8.2, -1, c, .85) + nghEye(hx + 11, hy - 1, 8, 8.2, 1, c, .85);
    head += nghBrow(hx - 5, hy - 12, -1, .9, c) + nghBrow(hx + 5, hy - 12, 1, .9, c);
    head += nghFace(hx, hy, .8, c, 'open');
    head += nghCurls([[hx - 8, hy + 25.5, 5, 0, -1], [hx, hy + 28, 5.6, 0, 1], [hx + 8, hy + 25.5, 5, 0, 1]], c, { hl: false, lw: 1.6, sw: 3.5 });
    return { back, body, head, front, anc: nghAnc([hx, 44, 46], [hx, hy - 1, 42], [84, 100, 38], [108, 98, 52, 46], [90, 120, 36, 34], [hx, 26, 24]) };
  }

  /* ---------------- Dạng 4: Nghê thần trên cầu lửa, hào quang mặt trời trống đồng ---------------- */
  // Hào quang: ngôi sao 14 cánh và các vành chấm, vạch của mặt trống đồng
  function nghSun(cx, cy, r) {
    if (PET_LITE) return '';
    let st = '';
    for (let i = 0; i < 14; i++) {
      const a0 = (i * 360 / 14 - 90) * R, a1 = ((i + .5) * 360 / 14 - 90) * R;
      st += (i ? 'L' : 'M') + P(cx + Math.cos(a0) * r * .98, cy + Math.sin(a0) * r * .98) + 'L' + P(cx + Math.cos(a1) * r * .48, cy + Math.sin(a1) * r * .48);
    }
    const C = (rr, ex) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r * rr)}" ${ex}/>`;
    return C(1.02, 'fill="#ff8a1f" opacity=".16"') + C(.62, 'fill="#ffd21f" opacity=".14"') +
      `<g class="spin" style="transform-origin:${f1(cx)}px ${f1(cy)}px"><path d="${st}Z" fill="#ffd21f" opacity=".34"/><g fill="none" stroke="#ffe680" stroke-linecap="round" opacity=".75">` +
      C(.84, 'stroke-width="2"') + C(1.02, 'stroke-width="2"') + C(.93, 'stroke-width="5" stroke-dasharray="1.5 7.5"') + C(.74, 'stroke-width="3.4" stroke-dasharray="0 9" stroke="#fff3a8"') + `</g></g>`;
  }
  // Dải mây lửa cuộn: chân (x, y), cỡ k, chiều sd (hai đầu xoắn)
  function nghCloud(x, y, k, sd = 1) {
    const L = [[x - sd * 24 * k, y - 7 * k, 6.5 * k, 0, sd], [x - sd * 11 * k, y - 11 * k, 9.5 * k, 0, -sd], [x + sd * 4 * k, y - 12.5 * k, 10.5 * k, 0, sd], [x + sd * 18 * k, y - 9 * k, 8 * k, 0, -sd], [x + sd * 29 * k, y - 6 * k, 6 * k, 0, sd]];
    const xs = L.map(q => q[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
    let s = bl(L.map(([cx, cy, r]) => nghC(cx, cy, r)).join('') + `<rect x="${f1(x0)}" y="${f1(y - 9 * k)}" width="${f1(x1 - x0)}" height="${f1(8 * k)}" rx="${f1(4 * k)}"/>`, cel('#ffd45a', '#ff8a1f', .66), 4);
    s += ln(nghSpiral(L[0][0], L[0][1], L[0][2] * .85, 0, sd) + nghSpiral(L[2][0], L[2][1], L[2][2] * .85, 0, sd) + nghSpiral(L[4][0], L[4][1], L[4][2] * .85, 0, -sd), '#e0560f', 2) + ln(`M${P(x0 + 2, y - 3 * k)} H${f1(x1 - 2)}`, '#e0560f', 1.8);
    return s + hl(L[2][0] - 3 * k, L[2][1] - 5 * k, 4 * k, 1.8 * k, -20, .6);
  }
  function nghe4(c) {
    let back = '', body = '', head = '', front = '';
    const hx = 100, hy = 68;
    back += nghSun(hx, 80, 96);
    // Vầng bờm lửa xoắn ốc: lửa tỏa ngoài, vành lọn vàng xen đỏ
    const N = 14, ring = [], fl = [];
    for (let i = 0; i < N; i++) {
      const a = (i * 360 / N) * R, rr = 46, x = hx + Math.sin(a) * rr, y = hy + 2 - Math.cos(a) * rr * .95;
      if (y > 120) continue;
      fl.push([hx + Math.sin(a) * (rr + 5), hy + 2 - Math.cos(a) * (rr + 5) * .95, i % 2 ? 22 : 31, i % 2 ? 13 : 17, i * 360 / N]);
      ring.push([x, y, i % 2 ? 9.5 : 12, i * 360 / N, i % 2 ? 1 : -1, i % 2]);
    }
    back += nghFlames(fl, { coreMin: 25 });
    back += nghCurls(ring.filter(q => !q[5]), c, { b: '#ffd21f', s: '#e07000' }) + nghCurls(ring.filter(q => q[5]), c, { b: '#ffa02a', s: '#d9480f', sp: '#9a2a0a' });
    // Đuôi: chùm lọn lửa bên phải
    back += `<g class="pt">` + pa(nghTaper([[132, 168], [152, 158], [166, 142], [171, 128]], 18, 13), cel(c.b, c.s), 5) +
      nghFlames([[171, 104, 29, 17, 8], [186, 116, 19, 11, 50], [156, 112, 17, 10, -32]]) +
      nghCurls([[170, 120, 11, 30, 1], [182, 114, 7, 0, -1], [159, 114, 7, 0, 1], [178, 130, 6.5, 0, -1]], c) + `</g>`;
    // Hai đùi sau tròn, hoa văn mây vàng
    body += bl(nghE(64, 162, 23, 20) + nghE(136, 162, 23, 20), cel(c.b, c.s));
    let sw = '';
    for (const sd of [-1, 1]) { const x = 100 + sd * 37; sw += nghSpiral(x, 158, 12, 0, -sd) + ` M${P(x - sd * 15, 170)} Q${P(x - sd * 4, 178)} ${P(x + sd * 9, 171)}`; }
    body += ln(sw, OL, 5.4) + ln(sw, GOLD, 2.6);
    // Ngực + chân trước, một khối
    body += bl(nghE(100, 120, 27, 25) + nghLimb([[86, 124, 10], [86, 146, 8.4], [86, 150, 8.2]]) + nghLimb([[114, 124, 10], [114, 146, 8.4], [114, 150, 8.2]]), cel(c.b, c.s));
    body += pa('M84,104 Q100,98 116,104 Q120,124 108,140 Q100,146 92,140 Q80,124 84,104 Z', c.l, 0);
    // Hoa văn vàng kim trên ngực: vòng tròn tiếp tuyến
    body += ln('M86,117 Q100,126 114,117', GOLD_S, 2.2) + `<g fill="${GOLD}" stroke="${GOLD_D}" stroke-width="1.6">${[[89, 119.5], [100, 122.5], [111, 119.5]].map(([x, y]) => nghC(x, y, 3.2)).join('')}</g>` + ln('M89,119.5h.01 M100,122.5h.01 M111,119.5h.01', GOLD_D, 2.4);
    // Vòng chân vàng
    body += [86, 114].map(x => pa(`M${P(x - 9, 137)} Q${P(x, 140)} ${P(x + 9, 137)} L${P(x + 9, 142)} Q${P(x, 145.5)} ${P(x - 9, 142)} Z`, 'url(#gGold)', 2.4) + ci(x, 141, 1.8, '#ff3b4f', 1.2)).join('');
    // Cầu lửa dưới chân trước
    body += nghOrb(100, 168, 18, { glow: true, flames: true });
    body += el(86, 152, 10.5, 6, c.l, 4) + el(114, 152, 10.5, 6, c.l, 4) + ln('M82,156 v-3 M88,156 v-3 M112,156 v-3 M118,156 v-3', OL, 2);
    // Vòng cổ vàng, chuông vàng
    body += pa('M74,98 Q100,112 126,98 L127,106 Q100,121 73,106 Z', cel('#ffe066', '#d48a00'), 3.4) + `<g fill="#ff3b4f" stroke="${OL}" stroke-width="1.3">${[[81, 106], [90, 109.5], [110, 109.5], [119, 106]].map(([x, y]) => nghC(x, y, 1.9)).join('')}</g>`;
    body += nghBell(100, 109, 1.25, '#ffd84a', '#c47a10');
    // Mây lửa nâng đỡ (trước đùi)
    front += nghCloud(58, 190, 1.1, 1) + nghCloud(142, 190, 1.1, -1);
    // Đầu
    head += bl(nghD(nghPetalD(72, 60, 18, 8.5, 160)) + nghD(nghPetalD(128, 60, 18, 8.5, 20)) + nghE(hx, hy, 31, 26.5) + nghE(hx - 23, hy + 10, 10, 9.5) + nghE(hx + 23, hy + 10, 10, 9.5), cel(c.b, c.s));
    head += pa(nghPetalD(70, 61, 12, 4.2, 160), c.ear, 0) + pa(nghPetalD(130, 61, 12, 4.2, 20), c.ear, 0) + hl(hx - 20, hy - 13, 6, 2.6, -30, .45);
    head += nghMark(hx, hy - 10, 14, c);
    const eo = { white: '#fff59a', glow: '#ffd21f', iris: '#ffb21f', bw: 5 };
    head += nghEye(hx - 12, hy, 8.4, 8, -1, c, 1, eo) + nghEye(hx + 12, hy, 8.4, 8, 1, c, 1, eo);
    head += nghBrow(hx - 5.5, hy - 11, -1, 1, c) + nghBrow(hx + 5.5, hy - 11, 1, 1, c);
    head += nghFace(hx, hy + 1, .84, c, 'open');
    head += nghCurls([[hx - 9, hy + 27, 5.4, 0, -1], [hx, hy + 29.5, 6, 0, 1], [hx + 9, hy + 27, 5.4, 0, 1]], c, { hl: false, lw: 1.6, sw: 3.5 });
    front += nghEmbers([[14, 124, 4.5], [186, 62, 4], [20, 50, 3.6], [188, 158, 3.4]]);
    return { back, body, head, front, anc: nghAnc([hx, 47, 50], [hx, hy, 46], [hx, 100, 48], [100, 104, 92, 66], [100, 122, 44, 42], [hx, 30, 27]) };
  }

  PET_SPECS.ep_nghe = {
    el: 'fire',
    c: NGH[1], c4: NGH[4],
    draw(f, g, c) { return [null, nghe1, nghe2, nghe3, nghe4][f](NGH[f]); }
  };
})();

/* ===================== PET SỬ THI: HẠC BĂNG CỰC QUANG (ep_crane, hệ Băng) ===================== */
// 4 dạng khác dáng: hạc con trong tổ tuyết → hạc non đứng một chân → hạc múa cánh pha lê → hạc thần cực quang bay lên.
// Cần: gfx.js (pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, spark4, crystal, OL) và pets.js (PET_SPECS, PET_LITE, GROUND).
// Nạp sau pets.js. Mọi hàm phụ nằm trong IIFE (tiền tố crn), không thêm tên toàn cục nào ngoài PET_SPECS.ep_crane.
// draw(f, g, c) giữ chữ ký chung; g (RIG) bỏ qua vì mỗi dạng có hình học riêng; c = màu (dạng 4 đã gộp c4).
// anc.halo = [x, y, rx]: vị trí đầu thật cho hiệu ứng hào quang (haloAt đọc). Hạc nhìn sang phải, đầu 3/4.
(() => {
  const crnRAD = Math.PI / 180;
  const crnRot = (s, a, x, y) => `<g transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})">${s}</g>`;

  /* ---------- Hình học ---------- */
  // Đường cong mượt (Catmull-Rom) qua các điểm
  function crnCurve(pts, closed = false) {
    const n = pts.length, get = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = `M${P(...pts[0])}`;
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      d += ` C${P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${P(...p2)}`;
    }
    return d + (closed ? ' Z' : '');
  }
  // Dải thuôn theo đường tâm pts, bề rộng wf(t) (t: 0 gốc → 1 mũi). Trả { d, L, R } (viền kín, mép trái, mép phải)
  function crnRibbon(pts, wf) {
    const n = pts.length - 1, L = [], R = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = wf(i / n) / 2;
      L.push([p[0] - dy / m * w, p[1] + dx / m * w]); R.push([p[0] + dy / m * w, p[1] - dx / m * w]);
    });
    const ring = L.concat(R.slice().reverse().slice(wf(1) < .6 ? 1 : 0));
    return { d: crnCurve(ring, true), L, R };
  }
  // Viền lông xù: cung elip a0→a1 (độ) gồm n gợn phồng ra ngoài k
  function crnFluff(cx, cy, rx, ry, n, k = .1, a0 = 0, a1 = 360) {
    const pt = a => [cx + rx * Math.cos(a * crnRAD), cy + ry * Math.sin(a * crnRAD)], st = (a1 - a0) / n;
    let d = `M${P(...pt(a0))}`;
    for (let i = 0; i < n; i++) { const m = pt(a0 + (i + .5) * st); d += ` Q${P(cx + (m[0] - cx) * (1 + k * 2), cy + (m[1] - cy) * (1 + k * 2))} ${P(...pt(a0 + (i + 1) * st))}`; }
    return d;
  }
  // Lông vũ: gốc (x, y), hướng a (độ), dài L, rộng w. shard: lông pha lê cạnh gãy có mặt cắt
  function crnFeather(x, y, a, L, w, fill, sw = 3.5, shard = false, edge = '') {
    const ux = Math.cos(a * crnRAD), uy = Math.sin(a * crnRAD), p = (t, k) => P(x + ux * L * t - uy * w * k, y + uy * L * t + ux * w * k);
    const d = shard ? `M${p(0, -.5)} L${p(.6, -.62)} L${p(1, 0)} L${p(.72, .56)} L${p(0, .5)} Z`
      : `M${p(0, -.5)} Q${p(.62, -.78)} ${p(1, 0)} Q${p(.6, .72)} ${p(0, .5)} Z`;
    let s = pa(d, fill, sw);
    if (shard) s += ln(`M${p(.1, .05)} L${p(.6, -.62)} M${p(.15, .1)} L${p(.9, .02)}`, '#ffffff', 1.5, 'opacity=".85"');
    else if (edge) s += ln(`M${p(.62, .6)} Q${p(.86, .4)} ${p(.98, .04)}`, edge, 2.2);
    return s;
  }
  // Lông cong dài (cực quang): gốc (x, y), hướng a, dài L, rộng w, cong bend (lệch ngang ở giữa); có cuống lông sáng
  function crnPlume(x, y, a, L, w, fill, bend = 0) {
    const ux = Math.cos(a * crnRAD), uy = Math.sin(a * crnRAD), p = (t, k, b = 0) => P(x + ux * L * t - uy * (w * k + b), y + uy * L * t + ux * (w * k + b));
    return pa(`M${p(0, -.42)} Q${p(.55, -.7, bend)} ${p(1, 0, bend * .3)} Q${p(.55, .66, bend)} ${p(0, .42)} Z`, fill, 3.4) +
      ln(`M${p(.06, 0)} Q${p(.55, 0, bend * .9)} ${p(.88, 0, bend * .45)}`, '#ffffff', 1.8, 'opacity=".75"');
  }
  // Bông tuyết 6 cánh có viền
  function crnFlake(x, y, r, col = '#ffffff', cls = '', dl = 0) {
    let d = '';
    for (let i = 0; i < 6; i++) {
      const a = (i * 60 - 90) * crnRAD, bx = x + Math.cos(a) * r * .55, by = y + Math.sin(a) * r * .55;
      d += `M${P(x, y)}L${P(x + Math.cos(a) * r, y + Math.sin(a) * r)}`;
      if (r > 5.5) for (const k of [-1, 1]) { const b = a + k * .8; d += `M${P(bx, by)}l${f1(Math.cos(b) * r * .38)},${f1(Math.sin(b) * r * .38)}`; }
    }
    const w = Math.max(1.6, r * .26);
    return `<g${cls ? ` class="${cls}" style="animation-delay:-${dl}s"` : ''}>` + ln(d, OL, w + 3.2) + ln(d, col, w) + `</g>`;
  }

  /* ---------- Đầu hạc (nhìn sang phải, góc 3/4) ---------- */
  function crnEye(cx, cy, rx, ry, side, o) {
    const pr = o.pr || rx * .52, lid = o.lid || 0, px = cx + rx * .2, py = cy + ry * .1;
    let s = '';
    if (o.glow) s += el(cx, cy, rx + 3, ry + 3, o.glow, 0, 'opacity=".55"');
    s += el(cx, cy, rx, ry, '#fff', 3.8);
    if (o.iris) s += ci(px, py, pr * 1.42, o.iris, 0);
    s += ci(px, py, pr, OL, 0) + ci(px - pr * .42, py - pr * .5, pr * .44, '#fff', 0) + ci(px + pr * .5, py + pr * .45, pr * .2, '#fff', 0);
    if (lid > 0) {
      // mí trầm tĩnh: gần ngang, chỉ hơi thấp về phía trong (uy nghi mà không cau có)
      const ao = 198 + (1 - lid) * 26, ai = 344 - (1 - lid) * 14, a1 = side < 0 ? ao : 540 - ao, a2 = side < 0 ? ai : 540 - ai;
      const Q = a => [cx + rx * Math.cos(a * crnRAD), cy + ry * Math.sin(a * crnRAD)], [x1, y1] = Q(a1), [x2, y2] = Q(a2);
      s += `<path d="M${P(x1, y1)} A${f1(rx)},${f1(ry)} 0 0 ${side < 0 ? 1 : 0} ${P(x2, y2)} Z" fill="${o.skin}"/>`;
      const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
      s += ln(`M${P(x1 - ux * 3.5, y1 - uy * 3.5 - 1)} Q${P((x1 + x2) / 2, (y1 + y2) / 2 - 1.6)} ${P(x2 + ux * 2, y2 + uy * 2)}`, OL, o.bw || 5);
    }
    // hàng mi cong ở đuôi mắt: nét thanh tao riêng của hạc
    if (o.lash === false) return s;
    const ox = cx + side * rx * .9, oy = cy - ry * (lid > 0 ? .5 : .55);
    s += ln(`M${P(ox, oy)} q${f1(side * 3)},-1 ${f1(side * 5.5)},-5`, OL, 2.6);
    return s;
  }
  // Mỏ bạc mũi băng: gốc (x, y), góc a (độ, 0 = sang phải), dài len, dày th
  function crnBeak(x, y, len, a, th, c) {
    const ux = Math.cos(a * crnRAD), uy = Math.sin(a * crnRAD), p = (t, k) => P(x + ux * len * t - uy * th * k, y + uy * len * t + ux * th * k);
    return pa(`M${p(0, -.55)} C${p(.35, -.62)} ${p(.75, -.3)} ${p(1, .06)} C${p(.7, .3)} ${p(.35, .5)} ${p(0, .5)} Z`, cel(c.beak, c.beaks), 3.6) +
      pa(`M${p(.74, -.27)} C${p(.86, -.16)} ${p(.95, -.05)} ${p(1, .06)} C${p(.92, .14)} ${p(.84, .2)} ${p(.76, .24)} Z`, c.cyan, 0) +
      ln(`M${p(.06, .1)} Q${p(.45, .2)} ${p(.8, .12)}`, OL, 1.8) + ln(`M${p(.14, -.32)} Q${p(.4, -.38)} ${p(.62, -.24)}`, '#ffffff', 2, 'opacity=".9"');
  }
  // f: dạng; o.turn: 0 nhìn thẳng → 1 nghiêng; o.beak: [dài, góc]
  function crnHead(cx, cy, R, f, c, o = {}) {
    const ry = R * .95, t = o.turn ?? .8, [bl_, ba] = o.beak || [R * 1.1, 8];
    let s = o.noBlob ? '' : el(cx, cy, R, ry, cel(c.b, c.s), 5);
    if (f >= 2) {
      const k = R - 2.7, ky = ry - 2.7, A = a => P(cx + k * Math.cos(a * crnRAD), cy + ky * Math.sin(a * crnRAD));
      // đỉnh đầu ánh hồng cực quang (dấu hạc)
      s += `<path d="M${A(-138)} A${f1(k)},${f1(ky)} 0 0 1 ${A(-52)} Q${P(cx - R * .02, cy - ry * .56)} ${P(cx - R * .5, cy - ry * .66)} Z" fill="${cel(c.cr, c.crs)}"/>`;
      s += hl(cx - R * .16, cy - ry * .8, R * .14, R * .06, -10, .75);
      // cổ họng tím than (nối xuống cổ)
      s += `<path d="M${A(38)} A${f1(k)},${f1(ky)} 0 0 1 ${A(104)} Q${P(cx + R * .1, cy + ry * .62)} ${P(cx + R * .5, cy + ry * .5)} Z" fill="${cel(c.nk, c.nks)}"/>`;
    }
    s += hl(cx - R * .55, cy - ry * .4, R * .2, R * .1, -45, .55);
    const er = [0, .37, .31, .29, .29][f] * R, ey = cy - ry * .06, nx = cx - R * (.22 + .1 * (1 - t)), fx = cx + R * (.36 - .08 * (1 - t));
    const eo = { skin: c.b, iris: c.i, lid: [0, 0, .22, .5, .66][f], bw: f >= 4 ? 5 : 4 };
    if (f === 1) { eo.pr = er * .5; eo.lash = false; }
    if (f >= 4) { eo.glow = c.glow; eo.iris = c.i4; }
    s += crnEye(nx, ey, er * .86, er, -1, eo) + crnEye(fx, ey - 1, er * .7, er * .95, 1, eo);
    s += f === 1 ? crnBeak(cx + R * .56, cy + R * .3, bl_, ba, R * .32, c) : crnBeak(cx + R * .62, cy + R * .3, bl_, ba, R * .32, c);
    if (f <= 2) s += el(nx - R * .1, ey + er + 4, R * .17, R * .1, '#ff9ab4', 0, 'opacity=".75"');
    return s;
  }

  // Vương miện băng: vành bạc cong theo đỉnh đầu + 5 gai pha lê (một hình) + ngọc cực quang
  function crnCrown(x, y, c) {
    const sp = [[-15, 10, -26], [-8, 16, -12], [0, 23, 0], [8, 16, 12], [15, 10, 26]];
    let d = `M${P(x - 18, y + 4)}`, f = '';
    sp.forEach(([dx, h, a]) => {
      const bx = x + dx, by = y + 2 - Math.abs(dx) * .12, w = 4 + h * .06, ux = Math.sin(a * crnRAD), uy = -Math.cos(a * crnRAD);
      const tip = [bx + ux * h, by + uy * h], sh = [bx + ux * h * .62, by + uy * h * .62];
      d += ` L${P(bx - w, by)} L${P(sh[0] - w * .9, sh[1])} L${P(...tip)} L${P(sh[0] + w * .9, sh[1])} L${P(bx + w, by)}`;
      f += `M${P(bx - w * .2, by - 1)} L${P(tip[0] - ux * 3, tip[1] - uy * 3)} `;
    });
    d += ` L${P(x + 18, y + 4)} Z`;
    return pa(d, cel(c.ice, c.ices), 3.2) + ln(f, '#ffffff', 1.4, 'opacity=".85"') +
      pa(`M${P(x - 19, y + 3)} Q${P(x, y - 4)} ${P(x + 19, y + 3)} L${P(x + 18, y + 8)} Q${P(x, y + 1)} ${P(x - 18, y + 8)} Z`, cel(c.sil, c.sils), 3) +
      ci(x, y + 3, 3.6, lin(c.pink, c.vio), 2.2) + ci(x - 11, y + 5, 1.8, c.cyan, 1.4) + ci(x + 11, y + 5, 1.8, c.mint, 1.4);
  }

  /* ---------- Thân, chân, cánh ---------- */
  // Chân dài mảnh: các khớp pts, bàn chân ở điểm cuối (toes: 'stand' | 'curl' | 'point')
  function crnLeg(pts, w, c, toes = 'stand') {
    const d = `M${pts.map(p => P(...p)).join(' L')}`, [x, y] = pts[pts.length - 1];
    let s = ln(d, OL, w + 7) + ln(d, c.leg, w) + ln(d, c.legs, w * .38, 'opacity=".7" transform="translate(1.2 0)"');
    // khớp gối (cổ chân) hơi phình
    s += pts.slice(1, -1).map(([jx, jy]) => el(jx, jy, w * .62, w * .72, c.leg, 0)).join('');
    let t = '';
    if (toes === 'stand') t = `M${P(x, y)} l11,1.5 M${P(x, y)} l4,4 M${P(x, y)} l-7,2.5 M${P(x, y)} l-4,-3`;
    else if (toes === 'curl') t = `M${P(x, y)} q5,0 6,4 M${P(x, y)} q2,2 1,6 M${P(x, y)} q-3,1 -4,4`;
    else t = `M${P(x, y)} l1,8 M${P(x, y)} l-3,7 M${P(x, y)} l5,6`;
    return s + ln(t, OL, w * .62 + 5) + ln(t, c.leg, w * .62);
  }
  // Cổ tím than cong chữ S + dải gáy trắng (nét nhận diện của hạc)
  function crnNeck(pts, w0, w1, c) {
    const r = crnRibbon(pts, t => w0 + (w1 - w0) * t), n = pts.length - 1;
    const nape = pts.map((p, i) => [p[0] * .45 + r.L[i][0] * .55, p[1] * .45 + r.L[i][1] * .55]).slice(Math.floor(n / 2));
    const rr = crnRibbon(nape, t => (w0 + (w1 - w0) * (.5 + t * .5)) * (.25 + t * .3));
    return pa(r.d, cel(c.nk, c.nks), 5) + pa(rr.d, c.b, 0) + ln(crnCurve(r.R.slice(1, -1)), '#7f9aff', 2, 'opacity=".75"');
  }
  // Thân trứng nghiêng
  const crnBody = (x, y, rx, ry, a, c) => el(x, y, rx, ry, cel(c.b, c.s), 5.5, `transform="rotate(${a} ${x} ${y})"`) + hl(x - rx * .35, y - ry * .5, rx * .28, ry * .12, -20 + a, .5);
  // Mép gợn lông từ (x0, y0) tới (x1, y1): n gợn, dep > 0 phồng sang trái hướng đi
  function crnScallop(x0, y0, x1, y1, n, dep) {
    const dx = (x1 - x0) / n, dy = (y1 - y0) / n, L = Math.hypot(dx, dy), nx = -dy / L * dep, ny = dx / L * dep;
    let d = ` L${P(x0, y0)}`;
    for (let i = 0; i < n; i++) d += ` Q${P(x0 + dx * (i + .5) + nx, y0 + dy * (i + .5) + ny)} ${P(x0 + dx * (i + 1), y0 + dy * (i + 1))}`;
    return d;
  }
  // Vảy lông nhỏ trên ngực / cánh
  const crnScales = (pts, col, w = 2.2) => ln(pts.map(([x, y, r]) => `M${P(x - r, y)} q${f1(r)},${f1(r * .9)} ${f1(r * 2)},0`).join(' '), col, w);
  // Dải lụa đuôi: bề rộng đều, đuôi cắt chữ V
  function crnSash(pts, w, fill) {
    const r = crnRibbon(pts, () => w), n = pts.length - 1, e = pts[n], q = pts[n - 1], dx = e[0] - q[0], dy = e[1] - q[1], m = Math.hypot(dx, dy);
    const notch = [e[0] - dx / m * w * .7, e[1] - dy / m * w * .7];
    const d = crnCurve(r.L) + ` L${P(...notch)} L${P(...r.R[n])} ` + crnCurve(r.R.slice().reverse()).replace('M', 'L') + ' Z';
    return pa(d, fill, 4) + ln(crnCurve(pts.slice(0, -1).map((p, i) => [(p[0] + r.L[i][0]) / 2, (p[1] + r.L[i][1]) / 2])), '#ffffff', 2.2, 'opacity=".9"');
  }
  // Dải cực quang thuôn (lông mào dạng 4): gradient dọc 2 màu, viền tím than, vệt sáng giữa
  function crnAuroraBand(pts, w0, w1, c1, c2, sw = 3.5) {
    const r = crnRibbon(pts, t => w0 + (w1 - w0) * Math.pow(t, 1.3) + Math.sin(t * Math.PI) * 3);
    return pa(r.d, lin(c1, c2), sw) + ln(crnCurve(pts.slice(0, -1).map((p, i) => [(p[0] * 2 + r.L[i][0]) / 3, (p[1] * 2 + r.L[i][1]) / 3])), '#ffffff', 1.8, 'opacity=".7"');
  }

  // Cánh dang dựng trong khung riêng (vai tại gốc, dọc trục x, mép trước ở trên) rồi xoay rot độ và lật theo sd (-1 trái, 1 phải).
  // kind 3: lông sơ cấp pha lê + lông thứ cấp tím than; kind 4: 7 lông cực quang dài rủ xuống + 3 lông pha lê ở mũi cánh.
  // bend: gập cổ tay (độ, âm = mũi cánh vểnh lên)
  function crnWing(sx, sy, sd, rot, c, kind, bend = 0) {
    const rowCol = kind === 4 ? c.cyan : c.s, cr = Math.cos(rot * crnRAD), sr = Math.sin(rot * crnRAD), xw = 44;
    // gập cổ tay: góc gập tăng mượt quanh khuỷu (xw), không làm đứt nét
    const bA = x => { const t = Math.max(0, Math.min(1, (x - xw + 12) / 24)); return bend * t * t * (3 - 2 * t); };
    const M = (x, y) => {
      const b = bA(x) * crnRAD, dx = x - xw, X = xw + dx * Math.cos(b) - y * Math.sin(b), Y = dx * Math.sin(b) + y * Math.cos(b);
      return [sx + sd * (X * cr - Y * sr), sy + X * sr + Y * cr];
    };
    const A = (a, x = 0) => sd > 0 ? a + bA(x) + rot : 180 - a - bA(x) - rot;
    let s = '';
    if (kind === 3) {
      for (let i = 5; i >= 0; i--) { const [x, y] = M(4 + i * 7.5, 4 - i); s += crnFeather(x, y, A(100 - i * 7, 4 + i * 7.5), 27 + i * 1.6, 14, cel(c.nk, c.nks), 3.5); }
      for (let i = 4; i >= 0; i--) { const t = i / 4, [x, y] = M(46 + t * 20, -4 - t * 6); s += crnFeather(x, y, A(64 - t * 62, 46 + t * 20), 28 + t * 12, 12, cel(c.ice, c.ices), 3.5, true); }
    } else {
      // lông bay cực quang: 7 lông dài cong rủ xuống, ngoài (bạc hà) → trong (hồng tím), lông trong đè lên lông ngoài
      const cols = [['#d6fff0', c.mint], [c.mint, c.cyan], [c.mint, c.cyan], [c.cyan, '#5f8bff'], [c.cyan, c.vio], [c.vio, c.pink], ['#b48aff', c.pink]];
      for (let i = 6; i >= 0; i--) {
        const k = i / 6, [x, y] = M(4 + k * 70, 14 - k * 20);
        s += crnPlume(x, y, sd > 0 ? 96 - k * 22 : 84 + k * 22, 52 + k * 24 - (i % 2) * 6, 21 - k * 3, lin(cols[6 - i][0], cols[6 - i][1]), sd * (5 + k * 4));
      }
      for (let i = 2; i >= 0; i--) { const [x, y] = M(66 + i * 6, -8 - i * 2); s += crnFeather(x, y, A(30 - i * 22, 80), 20 + i * 2, 10, cel(c.ice, c.ices), 3.2, true); }
    }
    // lông phủ trắng: mép trước cong, mép sau hai hàng gợn
    const top = [[-6, 8], [-5, -8], [18, -17], [44, -18], [66, -14], [84, -6]].map(p => M(...p)), e = M(84, -6), b = M(0, 20);
    s += pa(crnCurve(top) + crnScallop(...e, ...b, 6, -6 * sd) + ' Z', cel(c.b, c.s), 4.5);
    s += ln(`M${P(...M(66, -6))}` + crnScallop(...M(66, -6), ...M(6, 8), 5, -4.5 * sd), rowCol, 2.2);
    const [hx, hy] = M(30, -10);
    s += hl(hx, hy, 12, 2.6, sd > 0 ? rot - 4 : 184 - rot, .6);
    // vỗ cánh nhẹ quanh vai: mượn lớp .pt sẵn có (xoay -5° → 6°), chỉ đổi tâm xoay, nhịp và chiều (cánh trái ngược pha để hai cánh đối xứng).
    // Bóng đen bỏ class nên không động; prefers-reduced-motion tắt .pt; trại chung (PET_LITE) không vỗ.
    return PET_LITE ? s : `<g class="pt" style="transform-box:view-box;transform-origin:${f1(sx)}px ${f1(sy)}px;animation-duration:${kind === 4 ? 2.6 : 2.2}s${sd < 0 ? ';animation-direction:alternate-reverse' : ''}">${s}</g>`;
  }

  /* ---------- Hiệu ứng dạng 4 ---------- */
  const crnAU = ['#6dffc8', '#33e1ff', '#b48aff', '#ff8ae0'];
  function crnSwirl(cx, cy, R, n, seed) {
    if (PET_LITE) return '';
    let s = '';
    for (let i = 0; i < n; i++) {
      const a = (i * 360 / n + seed) * crnRAD, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * .92;
      s += i % 2 ? crnFlake(x, y, 5 + (i % 3) * 1.2, i % 4 === 1 ? '#bff4ff' : '#ffffff') : ci(x, y, 3, '#ffffff', 2);
      const a0 = a + .2, a1 = a + .6, r2 = R - 5 - (i % 3) * 4;
      const d = `M${P(cx + Math.cos(a0) * r2, cy + Math.sin(a0) * r2 * .92)} A${f1(r2)},${f1(r2 * .92)} 0 0 1 ${P(cx + Math.cos(a1) * r2, cy + Math.sin(a1) * r2 * .92)}`;
      s += ln(d, OL, 6, 'opacity=".5"') + ln(d, i % 3 ? '#ffffff' : crnAU[i % 4], 2.8);
    }
    return `<g class="spin" style="transform-origin:${f1(cx)}px ${f1(cy)}px">${s}</g>`;
  }
  function crnMotes(spots) {
    if (PET_LITE) return '';
    return `<g class="motes">` + spots.map(([x, y, r], i) => i % 2 ? crnFlake(x, y, r, '#ffffff', 'twinkle', i * .4) : spark4(x, y, r, crnAU[i % 4], 1.8, 'twinkle', i * .35)).join('') + `</g>`;
  }

  /* ---------- Neo ---------- */
  // h: đầu [x, đỉnh, rộng]; e: mắt [x, y, rộng]; n: cổ [x, y, rộng]; t: thân [x, đỉnh, đáy, rộng]; hc: tâm đầu [x, y, bán kính]
  function crnAnc(h, e, n, t, hc, bk) {
    const [tx, ty, tb, tw] = t;
    return {
      head: h, eyes: e, neck: n,
      back: bk || [tx, ty, tw, (GROUND - 4 - ty) / 1.11],
      body: [tx, ty + (tb - ty) * .42, tw, tb - ty],
      halo: [hc[0], f1(h[1] - 8), f1(hc[2] * .72)]
    };
  }

  /* ======================== 4 DẠNG ======================== */
  const crnForms = [null,
    // 1. Hạc con lông tơ ngồi trong tổ tuyết, chỏm tơ cực quang, một cánh nhỏ vẫy
    (c) => {
      let back = '', body = '', head = '', front = '';
      const cx = 100, hy = 108, R = 32, fz = Object.assign({}, c, { b: c.fz, s: c.fzs });
      // vành sau của tổ: lòng tổ tối + tuyết phủ mép sau + tinh thể băng
      back += el(100, 153, 50, 10, '#4a62b6', 0);
      back += pa(crnFluff(100, 152, 58, 13, 10, .09, 180, 360) + crnFluff(100, 153, 49, 9, 1, 0, 360, 180).replace('M', ' L') + ' Z', cel('#ffffff', '#b9d6f2'), 4);
      back += [[60, 146, -30, 18], [80, 142, -10, 14], [122, 141, 12, 16]].map(([x, y, a, h]) => crnRot(crystal(x, y, h, h * .5, c.ice, c.ices, 3), a, x, y)).join('');
      // nửa vỏ trứng vừa nở, viền răng cưa, vân cực quang
      back += `<g transform="translate(96 -12) rotate(20 54 150)">` + pa('M42,140 Q42,156 54,158 Q66,156 66,140 L62,145 L58,139 L54,145 L50,139 L46,145 Z', cel('#ffffff', '#c9dcf5'), 3.5) + ln('M45,150 l4,-3 l4,3 l4,-3 l4,3 l3,-2', c.mint, 2.4) + ci(52, 154, 1.6, c.pink, 0) + '</g>';
      // thân lông tơ + cánh trái giơ vẫy
      body += pa(crnFluff(100, 150, 32, 24, 14, .05) + ' Z', cel(c.fz, c.fzs), 5);
      body += crnRot(pa(crnFluff(66, 130, 8.5, 15, 6, .1) + ' Z', cel(c.fz, c.fzs), 4.5), 40, 66, 140);
      body += crnScales([[90, 148, 4], [104, 149, 4], [97, 158, 4]], c.fzs, 2);
      // chỏm tơ cực quang (3 sợi xoăn) + đầu tơ
      head += [[-11, 17, -34], [0, 23, -6], [11, 16, 24]].map(([dx, h, a]) => {
        const x = cx + dx, y = hy - R + 8;
        return crnRot(pa(`M${P(x - 5, y)} C${P(x - 7, y - h * .6)} ${P(x + 4, y - h)} ${P(x + 8, y - h * .8)} C${P(x + 2, y - h * .72)} ${P(x + 1, y - h * .3)} ${P(x + 5, y)} Z`, lin(c.mint, c.cyan), 3.5), a * .6, x, y);
      }).join('');
      head += pa(crnFluff(cx, hy, R, R * .95, 16, .035) + ' Z', cel(c.fz, c.fzs), 5);
      head += crnHead(cx, hy, R, 1, fz, { turn: .45, beak: [13, 10], noBlob: true });
      // tổ phía trước: lòng tổ đan que bạc, mép tuyết xù mỏng, cánh phải vịn mép tổ
      front += pa(`M${P(42, 152)} C${P(42, 176)} ${P(70, 190)} ${P(100, 190)} C${P(130, 190)} ${P(158, 176)} ${P(158, 152)}` + crnFluff(100, 152, 58, 13, 1, 0, 0, 180).replace('M', ' L') + ' Z', cel('#9fc2f2', '#5a78cc'), 5);
      front += ln('M50,166 Q70,178 98,176 Q122,175 150,164 M56,178 Q82,187 112,184 Q132,182 146,174 M64,160 Q70,170 80,174 M136,160 Q130,172 120,178 M100,168 Q104,178 98,188', '#e6eefc', 2.6, 'opacity=".9"');
      front += ln('M46,160 Q66,176 92,170 M110,172 Q134,172 154,158 M72,184 Q96,178 126,186', '#5a72c4', 2.2);
      front += pa(crnFluff(100, 152, 60, 15, 10, .1, 0, 180) + crnFluff(100, 151, 55, 11, 1, 0, 180, 0).replace('M', ' L') + ' Z', cel('#ffffff', '#c4dcf5'), 4);
      front += crnRot(pa(crnFluff(132, 152, 8, 14, 6, .1) + ' Z', cel(c.fz, c.fzs), 4.5), -66, 132, 152);
      front += crnRot(crystal(46, 164, 15, 8, c.ice, c.ices, 3), -62, 46, 164) + crnRot(crystal(156, 162, 14, 7, c.ice, c.ices, 3), 60, 156, 162);
      front += tube('M44,158 l-9,-5 M47,163 l-8,3 M154,156 l10,-6 M152,163 l9,2', c.sil, 2.4, 2.2);
      front += hl(66, 170, 9, 2.4, 14, .55) + spark4(118, 180, 4, '#ffffff', 1.6);
      const anc = crnAnc([cx, hy - R + 4, 60], [cx + 2, hy - 2, 50], [cx, hy + 26, 50], [cx, 124, 154, 56], [cx, hy, R], [cx, 128, 62, 40]);
      return { back, body, head, front, anc };
    },
    // 2. Hạc non chân dài đứng một chân, cổ cong chữ S, mào băng nhỏ, khoen bạc ở chân
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 118, hy = 50, R = 24;
      body += crnLeg([[103, 132], [102, 160], [101, 185]], 5, c, 'stand');
      body += crnLeg([[90, 134], [78, 152], [95, 150]], 4.6, c, 'curl');
      // chùm lông đuôi tím than rủ xuống (sau thân)
      body += [[196, 28], [182, 31], [168, 27], [156, 22]].map(([a, L], i) => crnFeather(74 - i, 116 + i * 3, a, L, 13, cel(c.nk, c.nks), 3.5, false, '#7f9aff')).join('');
      body += crnBody(97, 118, 30, 19, -14, c);
      // cánh xếp: phủ trắng, mép gợn hai hàng
      body += pa(`M${P(124, 108)} C${P(112, 96)} ${P(80, 98)} ${P(66, 114)}` + crnScallop(66, 116, 122, 124, 5, 6) + ' Z', cel(c.b, c.s), 4);
      body += ln(`M${P(110, 108)}` + crnScallop(110, 108, 80, 110, 3, -4), c.s, 2);
      body += crnNeck([[114, 110], [104, 94], [104, 80], [112, 68]], 13, 10, c);
      // khoen bạc ở chân
      body += `<rect x="96.6" y="170" width="9.6" height="5" rx="2" fill="${cel(c.sil, c.sils)}" stroke="${OL}" stroke-width="2.4"/>` + ci(101.4, 172.5, 1.6, c.mint, 0);
      // Đầu: mào băng nhỏ vuốt ra sau
      head += [[-11, 16, -50], [-4, 22, -32], [4, 15, -14]].map(([dx, h, a]) => { const x = hx + dx, y = hy - R + 6; return crnRot(crystal(x, y, h, 8, c.ice, c.ices, 3.2), a, x, y); }).join('');
      head += crnHead(hx, hy, R, 2, c, { beak: [27, 8] });
      const anc = crnAnc([hx, hy - R + 4, 52], [hx + 2, hy - 2, 42], [108, 84, 26], [97, 102, 136, 58], [hx, hy, R], [97, 102, 58, 42]);
      return { back, body, head, front, anc };
    },
    // 3. Hạc trưởng thành múa: cánh dang chữ V có lông pha lê, đuôi dải băng, một chân co
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 114, hy = 46, R = 23;
      // đuôi: hai dải lụa băng bay sang trái
      back += crnSash([[84, 136], [62, 150], [42, 172], [20, 172], [10, 160]], 10, lin('#ffffff', '#bff4ff', '#6fcff2'));
      back += crnSash([[88, 142], [72, 166], [54, 184], [32, 190]], 9, lin('#ffffff', '#c9f6ff', '#8fdcf7'));
      back += crnWing(86, 104, -1, -40, c, 3) + crnWing(116, 100, 1, -40, c, 3);
      body += crnLeg([[98, 142], [99, 164], [98, 185]], 5.2, c, 'stand');
      body += crnLeg([[108, 140], [126, 154], [119, 170]], 4.8, c, 'point');
      body += [[178, 26], [164, 28], [150, 24]].map(([a, L], i) => crnFeather(84 - i * 2, 130 + i * 4, a, L, 13, cel(c.nk, c.nks), 3.5, false, '#7f9aff')).join('');
      body += crnBody(100, 121, 23, 27, -22, c);
      body += crnScales([[92, 124, 4], [104, 120, 4], [98, 134, 4], [110, 130, 3.5]], c.s, 2);
      body += crnNeck([[108, 100], [100, 86], [102, 72], [110, 60]], 13, 10, c);
      // vòng cổ bạc
      body += pa(`M${P(96, 97)} Q${P(108, 104)} ${P(119, 96)} L${P(120, 101)} Q${P(108, 110)} ${P(96, 102)} Z`, cel(c.sil, c.sils), 3) + ci(108, 106, 3, c.cyan, 2);
      // Đầu: lông mào pha lê dài vuốt ra sau
      head += [[206, 30], [220, 24], [192, 22]].map(([a, L]) => crnFeather(hx - 8, hy - R + 5, a, L, 9, cel(c.ice, c.ices), 3.2, true)).join('');
      head += crnHead(hx, hy, R, 3, c, { beak: [28, -2] });
      const anc = crnAnc([hx, hy - R + 4, 50], [hx + 2, hy - 2, 40], [108, 98, 28], [100, 98, 148, 50], [hx, hy, R], [100, 98, 52, 48]);
      return { back, body, head, front, anc };
    },
    // 4. Hạc thần cực quang bay lên: cánh cong vút rủ lông cực quang, vương miện băng, quạt đuôi cực quang, tuyết xoáy, vỗ cánh nhẹ
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 106, hy = 46, R = 23;
      if (!PET_LITE) back += `<circle cx="100" cy="100" r="90" fill="${lin('#6dffc8', '#33e1ff', '#8a5cff')}" opacity=".16"/>`;
      back += crnSwirl(100, 104, 90, 7, 15);
      // đuôi: quạt lông cực quang buông dưới thân (thay chân, vì đang bay lên), hai lông ngoài cong ra như dải lụa
      const tc = [[c.mint, c.cyan], [c.cyan, c.vio], [c.vio, c.pink], [c.cyan, c.vio], [c.mint, c.cyan]];
      [[0, 130, 46, 6], [4, 110, 52, -3], [2, 90, 58, 0], [1, 70, 52, 3], [3, 50, 46, -6]].forEach(([ci_, a, L, b]) => back += crnPlume(100, 130, a, L, 15, lin(...tc[ci_]), b));
      back += crnWing(86, 98, -1, -24, c, 4, -26) + crnWing(114, 98, 1, -24, c, 4, -26);
      body += crnBody(100, 114, 24, 28, -4, c);
      body += crnScales([[92, 112, 4], [104, 110, 4], [98, 122, 4]], '#7fd6f5', 2);
      body += crnNeck([[100, 92], [97, 80], [100, 68], [104, 60]], 13, 10, c);
      // vòng cổ bạc đính ngọc cực quang
      body += pa(`M${P(86, 90)} Q${P(100, 100)} ${P(114, 90)} L${P(115, 96)} Q${P(100, 108)} ${P(85, 96)} Z`, cel(c.sil, c.sils), 3) + pa(`M${P(100, 98)} L${P(106, 105)} L${P(100, 114)} L${P(94, 105)} Z`, lin(c.mint, c.vio), 2.6) + hl(98, 103, 1.6, 3, 0, .8);
      // Đầu: lông mào cực quang dài + vương miện băng
      head += crnAuroraBand([[hx - 10, hy - 14], [hx - 28, hy - 24], [hx - 46, hy - 20], [hx - 58, hy - 28]], 8, 1.5, c.mint, c.cyan, 3) + crnAuroraBand([[hx - 12, hy - 10], [hx - 28, hy - 12], [hx - 42, hy - 4], [hx - 54, hy - 8]], 7, 1.5, c.vio, c.pink, 3);
      head += crnHead(hx, hy, R, 4, c, { beak: [26, -6] });
      head += crnCrown(hx, hy - R + 4, c);
      front += crnMotes([[18, 30, 6], [182, 100, 5], [22, 128, 5.5], [178, 18, 6], [150, 152, 4.5], [48, 184, 4.5]]);
      const anc = crnAnc([hx, hy - R - 2, 46], [hx + 2, hy - 3, 40], [100, 92, 30], [100, 88, 140, 50], [hx, hy, R], [100, 90, 52, 46]);
      anc.halo = [hx, hy - R - 10, 20];
      return { back, body, head, front, anc };
    }
  ];

  PET_SPECS.ep_crane = {
    el: 'ice',
    c: {
      b: '#f6fbff', s: '#a8c4ea', fz: '#eaf5ff', fzs: '#9fbfe8', nk: '#3b4cc0', nks: '#212a7e', cr: '#ff6ad5', crs: '#c22c9a',
      i: '#33e1ff', i4: '#9dfff0', glow: '#7dffcf', beak: '#eef3ff', beaks: '#8c9cc8', leg: '#4656c4', legs: '#262f86',
      ice: '#e6fbff', ices: '#6fcff2', sil: '#eef3fa', sils: '#8d9cc0', mint: '#6dffc8', cyan: '#33e1ff', vio: '#8a5cff', pink: '#ff6ad5'
    },
    c4: { s: '#93b0e6', nk: '#3242b4', nks: '#18206a', cr: '#ff4fd0', leg: '#3d4cb8' },
    draw(f, g, c) {
      const r = crnForms[f](c), pk = v => v ? `<g stroke-linejoin="round" stroke-linecap="round">${v.replace(/ stroke-linejoin="round" stroke-linecap="round"| stroke-linecap="round" stroke-linejoin="round"/g, '')}</g>` : '';
      return { back: pk(r.back), body: pk(r.body), head: pk(r.head), front: pk(r.front), anc: r.anc };
    }
  };
})();

/* ===================== SỬ THI · THANH LONG SẤM (id ep_loong, hệ Sấm) =====================
   Rồng phương Đông thân dài uốn lượn, cưỡi mây giông (khác Rồng Lửa kiểu phương Tây: cánh dơi, đứng bốn chân).
   Dạng 1  rồng con cuộn tròn thành vòng như rắn nhỏ, sừng nhú, ôm viên ngọc điện trong lòng
   Dạng 2  rồng non dựng thân chữ S, râu ngắn, gạc non, bốn chân nhỏ
   Dạng 3  rồng trưởng thành lượn sóng trên đám mây giông, bờm điện, râu dài, vây lưng vàng
   Dạng 4  Thanh Long thần: thân cuộn xoắn quanh khung, vây lưng tia sét vàng, vuốt nắm ngọc sấm, mây giông + sét xoáy
   Tọa độ tuyệt đối trong khung 200×200 (tâm x = 100, chân chạm y = 188); không dùng RIG, tham số g của draw bị bỏ qua.
   Thân là một "ống" chạy theo xương sống mượt (Catmull-Rom, lấy mẫu cách đều 3 px): khối viền → dải bóng → bụng vàng
   → vảy bụng → vảy lưng → vệt sáng, vây lưng vẽ trước để nằm sau thân.
   Trả về { back, body, head, front, anc }; anc.halo = [x, y, rx] là vị trí đầu thật cho hiệu ứng hào quang (haloAt).
   Cần gfx.js (pa, ci, ln, hl, bl, f1, cel, bolt, spark4, eyes2, OL) và PET_SPECS, PET_LITE của pets.js.
   Mọi hàm phụ nằm trong khối này, tiền tố lng; không thêm tên toàn cục. */
(() => {
  const lngQ = (x, y) => Math.round(x) + ',' + Math.round(y);
  const LNG_GOLD = '#ffd84a', LNG_CYAN = '#33e1ff', LNG_VIO = '#8a5cff';

  /* ----- Xương sống ----- */
  // Điểm điều khiển [x, y, nửa bề rộng] → mẫu cách đều ds px, mỗi mẫu {x, y, w, tx, ty, nx, ny}.
  // Pháp tuyến n chỉ phía LƯNG (v = +1); k = -1 đảo phía lưng sang bên kia.
  function lngFrame(cp, ds = 3, k = 1) {
    const n = cp.length, at = i => cp[Math.max(0, Math.min(n - 1, i))], raw = [];
    for (let i = 0; i < n - 1; i++) for (let j = 0; j < 10; j++) {
      const t = j / 10, a = at(i - 1), b = at(i), c = at(i + 1), d = at(i + 2), t2 = t * t, t3 = t2 * t;
      raw.push([0, 1, 2].map(m => .5 * (2 * b[m] + (c[m] - a[m]) * t + (2 * a[m] - 5 * b[m] + 4 * c[m] - d[m]) * t2 + (3 * b[m] - a[m] - 3 * c[m] + d[m]) * t3)));
    }
    raw.push(cp[n - 1]);
    const out = [raw[0]];
    let acc = 0, next = ds;
    for (let i = 1; i < raw.length; i++) {
      const p = raw[i - 1], q = raw[i], L = Math.hypot(q[0] - p[0], q[1] - p[1]);
      while (next <= acc + L) { const t = (next - acc) / L; out.push(p.map((v, m) => v + (q[m] - v) * t)); next += ds; }
      acc += L;
    }
    if (acc - (next - ds) > ds * .4) out.push(raw[raw.length - 1]);
    return out.map((p, i) => {
      const a = out[Math.max(0, i - 1)], b = out[Math.min(out.length - 1, i + 1)], tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
      return { x: p[0], y: p[1], w: Math.max(p[2], .4), tx: tx / l, ty: ty / l, nx: -ty / l * k, ny: tx / l * k };
    });
  }
  // Điểm lệch khỏi xương sống: v ∈ [-1 bụng, 1 lưng] theo bề rộng; ins: lùi vào trong (px)
  const lngOff = (F, i, v, ins = 0) => { const p = F[i], d = Math.sign(v) * Math.max(0, Math.abs(v) * p.w - ins); return [p.x + p.nx * d, p.y + p.ny * d]; };
  // Đường mượt qua dãy điểm (Q qua trung điểm), số nguyên cho gọn chuỗi
  function lngPath(pts, cmd = 'M') {
    const n = pts.length;
    let d = cmd + lngQ(...pts[0]);
    if (n < 3) return n === 2 ? d + 'L' + lngQ(...pts[1]) : d;
    d += 'Q';
    for (let i = 1; i < n - 1; i++) {
      const a = pts[i], b = pts[i + 1], m = i < n - 2 ? [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] : b;
      d += (i > 1 ? ' ' : '') + lngQ(...a) + ' ' + lngQ(...m);
    }
    return d;
  }
  const lngIdx = (a, b, k) => { const r = []; for (let i = a; i < b - k * .5; i += k) r.push(i); r.push(b); return r; };
  const lngEdge = (F, I, v, ins = 0) => I.map(i => lngOff(F, i, v, ins));
  const lngBand = (F, I, v0, v1, ins) => lngPath(lngEdge(F, I, v0, ins)) + lngPath(lngEdge(F, I, v1, ins).reverse(), 'L') + 'Z';

  /* ----- Thân ----- */
  // Lưỡi lửa / chùm lông: gốc (x, y), hướng ang (rad), dài L, nửa bề ngang gốc w, cong curl (tỉ lệ L)
  function lngTongue(x, y, ang, L, w, curl = 0) {
    const dx = Math.cos(ang), dy = Math.sin(ang), px = -dy, py = dx, tx = x + dx * L + px * curl * L, ty = y + dy * L + py * curl * L;
    return `M${lngQ(x + px * w, y + py * w)}Q${lngQ(x + dx * L * .5 + px * w * 1.3, y + dy * L * .5 + py * w * 1.3)} ${lngQ(tx, ty)}Q${lngQ(x + dx * L * .55 - px * w * .3, y + dy * L * .55 - py * w * .3)} ${lngQ(x - px * w, y - py * w)}Z`;
  }
  // Khối lưỡi lửa gộp một viền (bờm, chùm đuôi, túm khuỷu)
  const lngTuft = (ds, fill, sw = 3.5) => bl(ds.map(d => `<path d="${d}"/>`).join(''), fill, sw);
  // Vây lưng dọc mép lưng: vây cong (mặc định) hoặc tia sét (o.bolt)
  function lngFins(F, a, b, o) {
    let d = '';
    for (let i = a + o.off; i < b - 1; i += o.step) {
      const p = F[i], h = o.h * Math.min(1, p.w / o.wr);
      if (h < 3) continue;
      const i0 = Math.max(0, i - o.half), i1 = Math.min(F.length - 1, i + o.half);
      const B0 = lngOff(F, i0, .4), B1 = lngOff(F, i1, .4);
      const at = (u, t) => lngQ(p.x + p.nx * (p.w + u * h) + p.tx * t * h, p.y + p.ny * (p.w + u * h) + p.ty * t * h);
      if (o.bolt) d += `M${at(-.2, -.62)}L${at(1.1, .12)} ${at(.5, -.06)} ${at(.86, .56)} ${at(-.2, .62)}Z`;
      else d += `M${lngQ(...B0)}Q${at(.7, -.2)} ${at(1, .5)}Q${at(.35, .55)} ${lngQ(...B1)}Z`;
    }
    return d ? pa(d, o.col, o.sw || 3.2) : '';
  }
  // Thân [a, b] vẽ trọn lớp: vây → khối viền → dải bóng → bụng → vảy bụng → vảy lưng → vệt sáng.
  // Các dải trong lùi 2,4 px khỏi mép để không đè nét viền. o.fin: vây; o.sc2: thêm hàng vảy; o.k: bước mẫu của đường mép
  function lngSeg(F, a, b, c, o = {}) {
    const K = o.k || 4, ins = 2.4, I = lngIdx(a, b, K);
    let s = o.fin ? lngFins(F, a, b, o.fin) : '';
    s += pa(lngBand(F, I, 1, -1, 0), c.b, 5);
    s += pa(lngBand(F, I, -.02, -1, ins), c.s, 0) + pa(lngBand(F, I, -.44, -1, ins), c.bl, 0);
    let pl = '', sc = '';
    const stepOf = i => Math.max(2, Math.round(F[i].w * .24));
    for (let i = a + 1; i < b - 1; i += stepOf(i)) {
      const p = F[i];
      if (p.w < 3.4) break;
      const A = lngOff(F, i, -.44), B = lngOff(F, i, -1, 2.2);
      pl += `M${lngQ(...A)}Q${lngQ((A[0] + B[0]) / 2 - p.tx * p.w * .22, (A[1] + B[1]) / 2 - p.ty * p.w * .22)} ${lngQ(...B)}`;
    }
    const row = (v0, v1, sh) => {
      for (let i = a + 2 + sh; i < b - 1; i += stepOf(i) + 1) {
        const p = F[i];
        if (p.w < 4.5) break;
        const A = lngOff(F, i, v0), B = lngOff(F, i, v1, 2.2);
        sc += `M${lngQ(...A)}Q${lngQ((A[0] + B[0]) / 2 + p.tx * p.w * .42, (A[1] + B[1]) / 2 + p.ty * p.w * .42)} ${lngQ(...B)}`;
      }
    };
    row(.04, .6, 0);
    if (o.sc2) row(.46, 1, 2);
    if (pl) s += ln(pl, c.bls, 1.8);
    if (sc) s += ln(sc, c.sc, 2, 'opacity=".75"');
    const H = lngIdx(Math.min(b, a + 2), Math.max(a, b - 3), K).filter(i => F[i].w > 5);
    if (H.length > 2) s += ln(lngPath(lngEdge(F, H, .5)), '#fff', Math.max(1.6, F[H[0]].w * .13), 'opacity=".5"');
    return s;
  }
  // Chùm lông đuôi: quạt n lưỡi lửa theo hướng đuôi
  function lngTail(F, n, L, fill, spread = 70) {
    const p = F[F.length - 1], a = Math.atan2(p.ty, p.tx), ds = [];
    for (let i = 0; i < n; i++) { const t = n > 1 ? i / (n - 1) - .5 : 0; ds.push(lngTongue(p.x - p.tx * 2, p.y - p.ty * 2, a + t * spread * Math.PI / 180, L * (1 - Math.abs(t) * .5), L * .2, -t * .3)); }
    return lngTuft(ds, fill);
  }
  // Khối con nhộng giữa hai điểm, tọa độ số nguyên
  function lngCap(x1, y1, x2, y2, r1, r2) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L, R = Math.round;
    return `M${lngQ(x1 + nx * r1, y1 + ny * r1)}L${lngQ(x2 + nx * r2, y2 + ny * r2)}A${R(r2)},${R(r2)} 0 0 0 ${lngQ(x2 - nx * r2, y2 - ny * r2)}L${lngQ(x1 - nx * r1, y1 - ny * r1)}A${R(r1)},${R(r1)} 0 0 0 ${lngQ(x1 + nx * r1, y1 + ny * r1)}Z`;
  }
  // Ba vuốt ngà quặp quanh bàn (x, y) bán kính r, hướng a (rad); hook: độ quặp
  function lngClaws(x, y, r, a, col, hook = 1) {
    let d = '';
    for (const k of [-1, 0, 1]) {
      const b = a + k * .62, L = r * (k ? 1.7 : 2), cs = Math.cos(b), sn = Math.sin(b), bx = x + cs * r * .8, by = y + sn * r * .8, hw = r * .42, hk = hook * r * .55;
      d += `M${lngQ(bx - sn * hw, by + cs * hw)}Q${lngQ(bx + cs * L * .75 - sn * hk, by + sn * L * .75 + cs * hk)} ${lngQ(bx + cs * L + sn * hk * .8, by + sn * L - cs * hk * .8)}Q${lngQ(bx + cs * L * .45 + sn * hw * .5, by + sn * L * .45 - cs * hw * .5)} ${lngQ(bx + sn * hw, by - cs * hw)}Z`;
    }
    return pa(d, col, 2.2);
  }
  // Chân rồng: [vai, khuỷu, bàn], bề dày r; vuốt theo hướng a (độ); o.tuft: góc túm lông khuỷu (độ)
  function lngLeg(pts, r, c, o = {}) {
    const [[x0, y0], [x1, y1], [x2, y2]] = pts, a = (o.a ?? Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI) * Math.PI / 180;
    let s = '';
    if (o.tuft !== undefined) { const t = o.tuft * Math.PI / 180, bx = x1 + Math.cos(t) * r * .6, by = y1 + Math.sin(t) * r * .6; s += lngTuft([-.5, 0, .5].map(k => lngTongue(bx, by, t + k, r * (k ? 2.2 : 2.9), r * .5, k * .25)), cel(c.m, c.ms), 3); }
    s += lngClaws(x2, y2, r, a, o.claw || c.claw, o.hook);
    s += bl(`<path d="${lngCap(x0, y0, x1, y1, r * 1.12, r * .92)}"/><path d="${lngCap(x1, y1, x2, y2, r * .92, r * .8)}"/><circle cx="${Math.round(x2)}" cy="${Math.round(y2)}" r="${f1(r * 1.05)}"/>`, o.fill || cel(c.b, c.s), 3.8);
    // vảy cẳng: vạch ngang giữa cẳng
    const ux = x2 - x1, uy = y2 - y1, ul = Math.hypot(ux, uy) || 1, nx = -uy / ul * r * .7, ny = ux / ul * r * .7, mx = x1 + ux * .4, my = y1 + uy * .4;
    return s + ln(`M${lngQ(mx - nx, my - ny)}Q${lngQ(mx + ux / ul * 2.4, my + uy / ul * 2.4)} ${lngQ(mx + nx, my + ny)}`, o.line || c.sc, 1.8, 'opacity=".7"');
  }
  // Bàn tay rời: bàn tròn + 3 vuốt theo hướng a (độ); cute: bàn tròn 3 ngón, không vuốt (rồng con)
  const lngPaw = (x, y, r, a, c, cute) => {
    const t = a * Math.PI / 180;
    if (!cute) return lngClaws(x, y, r, t, c.claw) + ci(x, y, r * 1.05, cel(c.b, c.s), 3.8);
    return bl([-.7, 0, .7].map(k => `<circle cx="${f1(x + Math.cos(t + k) * r * .95)}" cy="${f1(y + Math.sin(t + k) * r * .95)}" r="${f1(r * .55)}"/>`).join('') + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`, cel(c.b, c.s), 3.4) +
      ln([-.35, .35].map(k => `M${lngQ(x + Math.cos(t + k) * r * .55, y + Math.sin(t + k) * r * .55)}l${f1(Math.cos(t + k) * r * .6)},${f1(Math.sin(t + k) * r * .6)}`).join(''), OL, 1.6);
  };

  /* ----- Đầu ----- */
  // Bờm hai bên má: lưỡi lửa vuốt ngược lên, gộp một viền; râu cằm nhọn (dạng 2+); tia điện trắng (dạng 3+)
  function lngMane(x, y, r, ry, f, c) {
    const n = [0, 3, 3, 4, 4][f], L = r * [0, .7, .8, 1, 1.2][f], W = r * [0, .2, .2, .2, .19][f], ds = [];
    for (const sd of [-1, 1]) for (let i = 0; i < n; i++) {
      const t = n > 1 ? i / (n - 1) : .5, th = (-14 + 86 * t) * Math.PI / 180, bx = x + sd * Math.cos(th) * r * .9, by = y + r * .08 + Math.sin(th) * ry * .9;
      const ang = sd > 0 ? th - .3 : Math.PI - th + .3;
      ds.push(lngTongue(bx, by, ang, L * (1 - t * .35), W, -sd * .2));
    }
    if (f >= 2) for (const k of [-1, 0, 1]) ds.push(lngTongue(x + k * r * .24, y + ry * .86, Math.PI / 2 + k * .4, r * (.3 + f * .08) * (k ? .8 : 1), r * .13, -k * .2));
    let s = lngTuft(ds, cel(c.m, c.ms), 3.6);
    if (f >= 3) {
      let d = '';
      for (const sd of [-1, 1]) d += lngZig(x + sd * r * 1.04, y + ry * .02, x + sd * r * (1.5 + (f - 3) * .25), y + ry * .26, 3, 2.2);
      s += ln(d, '#fff', 2, 'opacity=".9"');
    }
    return s;
  }
  // Gạc nai vàng kim: thân gạc + nhánh; dạng 1 chỉ là sừng nhú
  function lngAntlers(x, y, r, ry, f, c) {
    const W = [0, 6.5, 5, 5.4, 6][f];
    let bm = '', tn = '', hi = '';
    for (const sd of [-1, 1]) {
      const X = v => x + sd * v * r, Y = v => y - v * ry;
      if (f === 1) { hi += `M${lngQ(X(.12), Y(.9))}Q${lngQ(X(.18), Y(1.34))} ${lngQ(X(.5), Y(1.62))}Q${lngQ(X(.44), Y(1.24))} ${lngQ(X(.56), Y(.86))}Z`; continue; }
      const L = [0, 0, .7, .98, 1.22][f], p0 = [X(.34), Y(.66)], cc = [X(.36), Y(.66 + L * .8)], p1 = [X(.34 + L * .62), Y(.66 + L * 1.05)];
      const at = t => [0, 1].map(m => (1 - t) ** 2 * p0[m] + 2 * (1 - t) * t * cc[m] + t * t * p1[m]);
      bm += `M${lngQ(...p0)}Q${lngQ(...cc)} ${lngQ(...p1)}`;
      hi += `M${lngQ(...at(.25))}Q${lngQ(cc[0] - sd * 1.2, cc[1])} ${lngQ(...at(.7))}`;
      const T = [[.5, -1, .32]];
      if (f >= 3) T.push([.8, 1, .26]);
      if (f >= 4) T.push([.3, 1, .22]);
      T.forEach(([t, dir, l]) => { const q = at(t); tn += `M${lngQ(...q)}Q${lngQ(q[0] + sd * dir * l * r * .2, q[1] - l * ry * .7)} ${lngQ(q[0] + sd * dir * l * r * .62, q[1] - l * ry * 1.05)}`; });
    }
    if (f === 1) return pa(hi, 'url(#gGold)', 3.6);
    return ln(bm, OL, W + 7) + (tn ? ln(tn, OL, W * .8 + 7) : '') + ln(bm, c.gold, W) + (tn ? ln(tn, c.gold, W * .8) : '') + ln(hi, '#fff8d0', W * .34);
  }
  // Râu rồng: sợi thon dần từ mép mõm bay ra ngoài, gợn sóng
  function lngWhisker(pts, w0, c, col) {
    const F = lngFrame(pts.map((p, i) => [p[0], p[1], w0 * (1 - i / (pts.length - 1) * .8)]), 3);
    const I = lngIdx(0, F.length - 1, 3);
    return pa(lngPath(lngEdge(F, I, 1)) + lngPath(lngEdge(F, I, -1).reverse(), 'L') + 'Z', col || c.wh, 2.5);
  }
  // Đầu rồng nhìn thẳng: bờm, gạc, tai vây, sọ + hai bầu mũi, mõm sáng, lỗ mũi xoắn, miệng nanh, gờ mày, mắt, dấu trán, râu
  function lngHead(x, y, r, f, c, o = {}) {
    const ry = r * .86, X = v => x + v * r, Y = v => y + v * ry, Q = (a, b) => lngQ(X(a), Y(b));
    let s = lngMane(x, y, r, ry, f, c) + lngAntlers(x, y, r, ry, f, c);
    // tai vây ngang tầm mắt
    const e = .42 + f * .04;
    s += bl([-1, 1].map(sd => `<path d="M${Q(sd * .8, -.42)}Q${Q(sd * (.9 + e * .5), -.62)} ${Q(sd * (.84 + e), -.5)}Q${Q(sd * (.9 + e * .6), -.2)} ${Q(sd * .86, -.04)}Z"/>`).join(''), cel(c.b, c.s), 4) +
      ln([-1, 1].map(sd => `M${Q(sd * .9, -.3)}Q${Q(sd * (.9 + e * .4), -.46)} ${Q(sd * (.8 + e), -.48)}`).join(''), c.l, 2.2);
    // sọ + hai bầu mũi gộp một viền
    s += bl(`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(r)}" ry="${f1(ry)}"/><ellipse cx="${f1(x)}" cy="${f1(Y(.56))}" rx="${f1(r * .7)}" ry="${f1(ry * .44)}"/><circle cx="${f1(X(-.4))}" cy="${f1(Y(.42))}" r="${f1(r * .28)}"/><circle cx="${f1(X(.4))}" cy="${f1(Y(.42))}" r="${f1(r * .28)}"/>`, cel(c.b, c.s));
    // mõm sáng + sống mũi + lỗ mũi
    s += pa(`M${Q(-.64, .42)}Q${Q(-.68, .18)} ${Q(-.36, .19)}Q${Q(0, .3)} ${Q(.36, .19)}Q${Q(.68, .18)} ${Q(.64, .42)}Q${Q(.62, .98)} ${Q(0, .98)}Q${Q(-.62, .98)} ${Q(-.64, .42)}Z`, c.l, 0);
    s += ln(`M${Q(-.58, .24)}Q${Q(-.3, .1)} ${Q(0, .26)}Q${Q(.3, .1)} ${Q(.58, .24)}`, c.s, 2.6);
    s += pa([-1, 1].map(sd => `M${Q(sd * .13, .44)}Q${Q(sd * .18, .3)} ${Q(sd * .33, .36)}Q${Q(sd * .3, .52)} ${Q(sd * .13, .44)}Z`).join(''), OL, 0) + ln([-1, 1].map(sd => `M${Q(sd * .38, .28)}Q${Q(sd * .5, .32)} ${Q(sd * .44, .48)}`).join(''), c.s, 2.2);
    // miệng
    if (f === 1) s += ln(`M${Q(-.22, .7)}Q${Q(-.11, .84)} ${Q(0, .7)}Q${Q(.11, .84)} ${Q(.22, .7)}`, OL, 3);
    else s += ln(`M${Q(-.5, .64)}Q${Q(-.25, .82)} ${Q(0, .76)}Q${Q(.25, .82)} ${Q(.5, .64)}`, OL, 3.2) + pa([-1, 1].map(sd => `M${Q(sd * .38, .73)}l${f1(-sd * 2.6)},${3 + f} ${f1(-sd * 2.6)},${-3 - f}Z`).join(''), '#fff', 2);
    // gờ mày nhọn vuốt ra sau (dạng 2+)
    if (f >= 2) s += pa([-1, 1].map(sd => `M${Q(sd * .2, -.36)}Q${Q(sd * .6, -.68)} ${Q(sd * (.86 + f * .06), -.62 - f * .05)}Q${Q(sd * .64, -.3)} ${Q(sd * .36, -.22)}Z`).join(''), cel(c.m, c.ms), 3);
    // mắt
    const er = r * [0, .25, .225, .215, .215][f];
    s += eyes2(x, Y(-.06), r * .4, er, er * 1.1, { skin: c.b, iris: c.i, lid: [0, 0, .55, .85, 1][f], brow: f > 1, pr: er * (f === 1 ? .62 : .5), slit: f >= 3, bw: [0, 4.5, 5.5, 6, 6.5][f], white: f >= 4 ? '#fffbe0' : '#fff', glow: f >= 4 && !PET_LITE ? LNG_CYAN : '' });
    // dấu trán: tia chớp (dạng 1) → kim cương vàng → ngọc xanh → mũ miện tia sét vàng
    const jy = Y(-.62);
    if (f === 1) s += bolt(x - r * .02, jy - r * .14, r * .3, LNG_CYAN, 2);
    else {
      const jw = r * (.1 + f * .025), jh = r * (.14 + f * .04), J = (a, b) => lngQ(x + a * jw, jy + b * jh);
      if (f >= 4) s += pa(`M${J(0, -2)}L${J(.7, -.7)} ${J(2.4, -1.3)} ${J(1.4, .2)} ${J(0, 1.1)} ${J(-1.4, .2)} ${J(-2.4, -1.3)} ${J(-.7, -.7)}Z`, 'url(#gGold)', 2.6);
      s += pa(`M${J(0, -1)}L${J(1, 0)} ${J(0, 1)} ${J(-1, 0)}Z`, f >= 3 ? LNG_CYAN : 'url(#gGold)', 2.4) + ci(x - jw * .25, jy - jh * .3, jw * .25, '#fff', 0);
    }
    s += hl(X(-.46), Y(-.5), r * .2, r * .12);
    // râu
    const wl = r * [0, .4, .75, 1.3, 1.8][f];
    for (const sd of [-1, 1]) {
      const x0 = X(sd * .58), y0 = Y(.5), W = o.wpts ? o.wpts(sd, x0, y0) : [[x0, y0], [x0 + sd * wl * .3, y0 - wl * .1], [x0 + sd * wl * .62, y0 + wl * .14], [x0 + sd * wl, y0 + wl * .02]];
      s += lngWhisker(W, [0, 2.8, 3.2, 3.6, 4][f], c);
    }
    return s;
  }

  /* ----- Ngọc, mây, sét ----- */
  const lngZig = (x1, y1, x2, y2, n, a) => {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    let d = `M${lngQ(x1, y1)}`;
    for (let i = 1; i < n; i++) { const t = i / n, k = i % 2 ? a : -a; d += `L${lngQ(x1 + dx * t + nx * k, y1 + dy * t + ny * k)}`; }
    return d + `L${lngQ(x2, y2)}`;
  };
  const lngArc = (d, col = LNG_CYAN, w = 2.4, dl = 0) => `<g class="flick" style="animation-delay:-${dl}s">${ln(d, OL, w + 3)}${ln(d, col, w)}</g>`;
  // Sét xoáy: tia gấp khúc chạy theo cung tròn tâm (cx, cy), bán kính R, từ góc a0 → a1 (độ)
  function lngSwirl(cx, cy, R, a0, a1, col, dl = 0) {
    let d = '';
    for (let i = 0; i <= 8; i++) { const a = (a0 + (a1 - a0) * i / 8) * Math.PI / 180, rr = R + (i % 2 ? 5 : -5) * (i > 0 && i < 8 ? 1 : 0); d += (i ? 'L' : 'M') + lngQ(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
    return lngArc(d, col, 2.6, dl);
  }
  // Ngọc sấm: cầu ngọc + xoáy tím + tia chớp vàng; dạng 4 có vương lửa vàng quanh ngọc
  function lngPearl(x, y, r, f) {
    let s = PET_LITE ? '' : ci(x, y, r * 1.75, LNG_CYAN, 0, 'opacity=".2"') + ci(x, y, r * 1.32, '#c9fbff', 0, 'opacity=".32"');
    if (f >= 4) s += lngTuft([-2, -1, 0, 1, 2].map(i => { const a = (-90 + i * 34) * Math.PI / 180; return lngTongue(x + Math.cos(a) * r * .7, y + Math.sin(a) * r * .7, a, r * (1.1 - Math.abs(i) * .14), r * .3, i * .12); }), 'url(#gFlame)', 2.6);
    s += ci(x, y, r, cel('#f6ffff', '#62d8ff', .56), 3.5);
    s += ln(`M${lngQ(x - r * .62, y + r * .1)}Q${lngQ(x - r * .3, y - r * .62)} ${lngQ(x + r * .25, y - r * .4)}Q${lngQ(x + r * .6, y + r * .05)} ${lngQ(x + r * .1, y + r * .45)}`, LNG_VIO, Math.max(1.6, r * .14), 'opacity=".55"');
    s += bolt(x - r * .08, y - r * .62, r * 1.2, LNG_GOLD, 2) + hl(x - r * .42, y - r * .45, r * .3, r * .15, -30, .9);
    if (!PET_LITE && f >= 2 && f < 4) s += [0, 1, 2].map(i => { const a = (i * 120 + 20) * Math.PI / 180, x0 = x + Math.cos(a) * r, y0 = y + Math.sin(a) * r; return lngArc(lngZig(x0, y0, x0 + Math.cos(a) * r * .75, y0 + Math.sin(a) * r * .75, 3, 2.2), i % 2 ? '#ffe14d' : LNG_CYAN, 1.8, i * .3); }).join('');
    return s;
  }
  // Mây giông cuộn: bướu tròn + đáy bo + nét xoắn mây lành
  function lngCloud(x, y, k, col = '#6f7fc0', cold = '#36407a', curl = '#c9d4ff', sw = 3.5) {
    const B = [[0, 0, 14], [-17, 5, 10], [17, 4, 11], [-30, 10, 6.5], [30, 10, 6.5]];
    let s = bl(B.map(([dx, dy, r]) => `<circle cx="${Math.round(x + dx * k)}" cy="${Math.round(y + dy * k)}" r="${f1(r * k)}"/>`).join('') + `<rect x="${Math.round(x - 34 * k)}" y="${Math.round(y + 6 * k)}" width="${Math.round(68 * k)}" height="${Math.round(10 * k)}" rx="${f1(5 * k)}"/>`, cel(col, cold), sw);
    s += ln(`M${lngQ(x - 4 * k, y + 4 * k)}a${f1(5 * k)},${f1(5 * k)} 0 1 1 ${f1(7 * k)},-5a${f1(3 * k)},${f1(3 * k)} 0 1 1 -3,-4M${lngQ(x - 21 * k, y + 9 * k)}a${f1(4 * k)},${f1(4 * k)} 0 1 1 ${f1(6 * k)},-4M${lngQ(x + 13 * k, y + 8 * k)}a${f1(4 * k)},${f1(4 * k)} 0 1 1 ${f1(6 * k)},-4`, curl, 2, 'opacity=".9"');
    return s;
  }

  /* ----- 4 dạng ----- */
  // Dạng 1: rồng con cuộn tròn thành vòng, đầu tựa trên đỉnh vòng, ôm viên ngọc điện trong lòng; đuôi vẩy ra trái
  function lngF1(c) {
    let back = '', body = '', head = '', front = '';
    const cp = [];
    for (let a = -62; a <= 198; a += 26) { const t = (a + 62) / 260, rad = a * Math.PI / 180; cp.push([100 + 30 * Math.cos(rad), 144 + 30 * Math.sin(rad), 9.5 + 3 * Math.sin(t * Math.PI)]); }
    cp.push([62, 124, 7.5], [50, 116, 5], [44, 104, 3], [48, 94, 1.2]);
    const F = lngFrame(cp, 3, -1), N = F.length - 1;
    body += lngTail(F, 3, 16, cel(c.m, c.ms), 80) + lngSeg(F, 0, N, c, { fin: { off: 4, step: 5, half: 2, h: 8, wr: 10, col: cel(c.m, c.ms), sw: 2.6 } });
    // bàn chân sau tí hon thò dưới vòng
    body += lngPaw(76, 180, 6, 115, c, 1) + lngPaw(124, 180, 6, 65, c, 1);
    // ngọc điện ôm trong lòng vòng, hai bàn tay nhỏ đỡ hai bên (lớp thân để khăn, dây chuyền đeo đè lên)
    body += lngPearl(100, 146, 13, 1) + lngPaw(86, 157, 4.8, -70, c, 1) + lngPaw(114, 157, 4.8, 250, c, 1);
    head += lngHead(100, 104, 31, 1, c);
    if (!PET_LITE) front += lngArc(lngZig(150, 116, 162, 104, 3, 3), LNG_CYAN, 2) + lngArc(lngZig(148, 160, 162, 162, 2, 3), '#ffe14d', 2, .5);
    return { back, body, head, front, hx: 100, hy: 104, r: 31, neck: [100, 134, 44], bk: [100, 132, 62, 46], bd: [100, 152, 48, 34] };
  }
  // Dạng 2: rồng non dựng thân chữ S, đuôi cuộn trên đất, bốn chân nhỏ, gạc non
  function lngF2(c) {
    let back = '', body = '', head = '', front = '';
    const F = lngFrame([[98, 82, 10], [114, 98, 11.5], [122, 116, 12.5], [112, 134, 13], [90, 146, 13], [76, 162, 12.5], [86, 178, 11.5], [110, 182, 10], [134, 180, 8], [152, 170, 5.5], [160, 154, 3.2], [154, 142, 1]], 3, -1), N = F.length - 1;
    const dk = cel(c.s, '#0b5f7a');
    back += lngLeg([[126, 112], [140, 120], [144, 132]], 4.8, c, { a: 80, fill: dk, line: '#0b4f6a' }) + lngLeg([[104, 180], [116, 184], [124, 188]], 4.8, c, { a: 20, fill: dk, line: '#0b4f6a' });
    body += lngTail(F, 3, 18, cel(c.m, c.ms)) + lngSeg(F, 0, N, c, { fin: { off: 3, step: 5, half: 3, h: 10, wr: 12, col: cel(c.m, c.ms), sw: 2.8 } });
    body += lngLeg([[108, 112], [94, 122], [82, 116]], 5.2, c, { a: -150, tuft: 100 });
    body += lngLeg([[82, 170], [72, 180], [64, 186]], 5.6, c, { a: 160, tuft: -40 });
    head += lngHead(98, 64, 30, 2, c);
    if (!PET_LITE) front += lngArc(lngZig(146, 120, 160, 108, 3, 3), '#ffe14d', 2.2) + lngArc(lngZig(48, 140, 36, 130, 3, 3), LNG_CYAN, 2.2, .5);
    return { back, body, head, front, hx: 98, hy: 64, r: 30, neck: [104, 92, 36], bk: [106, 96, 52, 56], bd: [112, 118, 34, 40] };
  }
  // Dạng 3: rồng trưởng thành lượn sóng trên đám mây giông, bờm điện, râu dài
  function lngF3(c) {
    let back = '', body = '', head = '', front = '';
    const F = lngFrame([[70, 88, 11], [84, 110, 13], [106, 124, 14], [130, 116, 14], [146, 94, 13.5], [166, 80, 12.5], [184, 90, 11], [188, 112, 9], [180, 132, 7], [174, 150, 4.8], [180, 164, 2.8], [190, 164, 1]], 3, -1), N = F.length - 1;
    const dk = cel(c.s, '#0b5f7a');
    if (!PET_LITE) back += lngCloud(34, 150, 1.1, '#5a63a8', '#2f3470', '#9aa6ee') + lngArc(lngZig(28, 166, 20, 186, 3, 4), '#ffe14d', 2.4);
    back += lngLeg([[96, 118], [104, 134], [100, 148]], 5.6, c, { a: 100, fill: dk, line: '#0b4f6a' }) + lngLeg([[182, 118], [194, 124], [196, 138]], 5.2, c, { a: 80, fill: dk, line: '#0b4f6a' });
    body += lngCloud(110, 168, 1.55, '#7b86cc', '#3d4486', '#c9d0ff');
    body += lngTail(F, 4, 22, cel(c.m, c.ms)) + lngSeg(F, 0, N, c, { fin: { off: 3, step: 5, half: 3, h: 12, wr: 13, col: 'url(#gGold)', sw: 2.8 }, sc2: true });
    body += lngLeg([[86, 108], [70, 120], [56, 130]], 6, c, { a: 140, tuft: -60 });
    body += lngLeg([[168, 128], [160, 144], [150, 150]], 6, c, { a: 130, tuft: -30 });
    head += lngHead(62, 68, 30, 3, c);
    if (!PET_LITE) front += lngCloud(172, 176, .9, '#7b86cc', '#3d4486', '#c9d0ff') + lngArc(lngZig(140, 186, 126, 196, 2, 3), LNG_CYAN, 2.4, .3) +
      [[178, 44, 5.5], [22, 106, 4.5], [118, 58, 4]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? LNG_CYAN : '#fff6b0', 1.8, 'twinkle', i * .4)).join('');
    return { back, body, head, front, hx: 62, hy: 68, r: 30, neck: [74, 96, 34], bk: [80, 96, 50, 52], bd: [92, 116, 36, 40] };
  }
  // Dạng 4: Thanh Long thần cuộn xoắn quanh khung, vây tia sét vàng, vuốt nắm ngọc sấm, mây giông và sét xoáy
  function lngF4(c) {
    let back = '', body = '', head = '', front = '';
    const F = lngFrame([[100, 90, 12], [110, 110, 15], [118, 134, 16.5], [106, 158, 17], [80, 174, 17], [52, 170, 16.5], [32, 146, 16], [28, 114, 15.5], [38, 82, 15], [56, 54, 14], [80, 34, 13], [106, 24, 12], [134, 28, 11], [160, 44, 10], [176, 68, 9], [182, 96, 7.5], [178, 124, 5.5], [168, 146, 3.5], [156, 160, 1.2]], 3, -1), N = F.length - 1;
    if (!PET_LITE) {
      back += ci(100, 100, 98, LNG_CYAN, 0, 'opacity=".1"') + ci(100, 100, 70, '#5dffc0', 0, 'opacity=".08"');
      back += `<g class="spin" style="transform-origin:100px 100px"><circle cx="100" cy="100" r="95" fill="none" stroke="${OL}" stroke-width="7" stroke-dasharray="10 14" opacity=".55"/><circle cx="100" cy="100" r="95" fill="none" stroke="${LNG_GOLD}" stroke-width="3.5" stroke-dasharray="10 14"/></g>`;
      back += lngCloud(24, 24, 1.05, '#4f5a96', '#262c5e', '#8a96e0');
      back += lngArc(lngZig(12, 46, 4, 86, 4, 5), '#ffe14d', 2.8) + lngArc(lngZig(182, 14, 196, 58, 4, 5), LNG_CYAN, 2.8, .5);
      front += lngSwirl(100, 102, 99, 196, 250, LNG_CYAN, .2) + lngSwirl(100, 102, 99, 8, 62, '#ffe14d', .7);
    }
    // vuốt sau (xa) thò sau thân bên phải
    back += lngLeg([[126, 120], [142, 128], [150, 142]], 6, c, { a: 80, fill: cel(c.s, '#073d66'), line: '#06304f' });
    body += lngTail(F, 5, 28, 'url(#gGold)', 90) + lngSeg(F, 0, N, c, { fin: { off: 2, step: 6, half: 3, h: 16, wr: 15, col: 'url(#gGold)', bolt: true, sw: 2.8 }, sc2: true, k: 5 });
    head += lngHead(100, 64, 34, 4, c, { wpts: (sd, x0, y0) => [[x0, y0], [x0 + sd * 20, y0 - 6], [x0 + sd * 40, y0 + 10], [x0 + sd * 54, y0 + 34], [x0 + sd * 50, y0 + 54]] });
    // vuốt trước nắm ngọc sấm trong lòng vòng thân
    front += lngPearl(62, 126, 14.5, 4);
    front += lngLeg([[104, 122], [90, 136], [76, 130]], 6.6, c, { a: 200, tuft: 70, claw: LNG_GOLD });
    if (!PET_LITE) {
      front += lngCloud(38, 188, .95, '#9aa4e8', '#4d559c', '#e6eaff') + lngCloud(166, 190, .85, '#9aa4e8', '#4d559c', '#e6eaff');
      front += [[20, 100, 6], [150, 104, 5], [96, 150, 4.5], [186, 172, 4]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? LNG_CYAN : '#fff6b0', 1.8, 'twinkle', i * .35)).join('');
    }
    return { back, body, head, front, hx: 100, hy: 64, r: 34, neck: [104, 96, 40], bk: [100, 92, 84, 66], bd: [112, 126, 34, 44] };
  }

  PET_SPECS.ep_loong = {
    el: 'thunder', name: 'Thanh Long Sấm',
    c: { b: '#2fd3c4', s: '#13879c', l: '#dcfff4', bl: '#ffe9a6', bls: '#d99a2b', sc: '#0f6f88', m: '#a6fbff', ms: '#36bde6', wh: '#fff3b8', i: '#ffd21f', gold: LNG_GOLD, claw: '#fffbe8' },
    c4: { b: '#23c2c9', s: '#0b5f8c', l: '#e6fff8', sc: '#0a5478', m: '#c6fdff', ms: '#2aa6e2', bl: '#ffe58a', bls: '#c98a1a' },
    draw(f, g, c) {
      const o = [null, lngF1, lngF2, lngF3, lngF4][f](c), ry = o.r * .86;
      const anc = {
        head: [o.hx, f1(o.hy - ry * .92), f1(o.r * 1.5)],
        eyes: [o.hx, f1(o.hy - ry * .06), f1(o.r * 1.34)],
        neck: o.neck, back: o.bk, body: o.bd,
        halo: [o.hx, f1(o.hy - ry - 10), f1(o.r * .7)]
      };
      return { back: o.back, body: o.body, head: o.head, front: o.front, anc };
    }
  };
})();

/* ===================== BẠCH TƯỢNG NGỌC (ep_elephant · hệ Đá · Sử thi) ===================== */
// Voi trắng linh thiêng bằng ngọc và đá quý: da trắng ngà có vân ngọc, trang sức vàng kim, ngọc lục bảo.
// 1 voi con ngồi, vòi cuộn ôm viên ngọc → 2 voi non bước đi, ngà nhỏ bọc vàng, khăn gấm trên lưng
// → 3 voi trưởng thành giơ vòi chào, ngà ngọc dài, mão vàng, áo gấm, vòng chân → 4 Bạch Tượng thần sáu ngà
// đứng trên đài sen, lưng mang bảo tháp ngọc, vân vàng trên da, hào quang mạn-đà-la, đá quý lơ lửng.
// Nạp sau js/pets.js (cần gfx.js và PET_SPECS, PET_LITE, GROUND). Mọi hàm phụ nằm trong IIFE, tiền tố elp, không thêm tên toàn cục.
(() => {
  const G = 'url(#gGold)', RUBY = ['#ff9aae', '#d61f4a'];
  /* ----- Hình học ----- */
  const elpQ = (x, y) => Math.round(x) + ',' + Math.round(y); // tọa độ nguyên cho khối lớn (gọn chuỗi SVG)
  // Catmull-Rom: chuỗi lệnh C đi qua các điểm (bắt đầu tại p[0])
  const elpC = (p, closed) => {
    const n = p.length, at = i => closed ? p[(i + n) % n] : p[Math.max(0, Math.min(n - 1, i))];
    let d = '';
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const a = at(i - 1), b = at(i), c = at(i + 1), e = at(i + 2);
      d += `C${elpQ(b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6)} ${elpQ(c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6)} ${elpQ(c[0], c[1])}`;
    }
    return d;
  };
  const elpSm = (p, closed = true) => `M${elpQ(p[0][0], p[0][1])}` + elpC(p, closed) + (closed ? 'Z' : '');
  const elpShp = (p, fill, w = 5.5, ex = '') => pa(elpSm(p), fill, w, ex);
  // Ống thuôn qua các điểm (vòi, ngà, đuôi): d = viền kín, L/R = hai mép; k > 1: giữ to lâu rồi mới nhọn
  const elpTube = (p, w0, w1, k = 1) => {
    const n = p.length, L = [], R = [];
    p.forEach((q, i) => {
      const a = p[Math.max(0, i - 1)], b = p[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * Math.pow(i / (n - 1), k)) / 2;
      L.push([q[0] - dy / m * w, q[1] + dx / m * w]); R.push([q[0] + dy / m * w, q[1] - dx / m * w]);
    });
    const rr = R.slice().reverse();
    return { d: `M${elpQ(...L[0])}${elpC(L)}A${f1(w1 / 2)},${f1(w1 / 2)} 0 0 0 ${elpQ(...rr[0])}${elpC(rr)}Z`, L, R };
  };

  /* ----- Bộ phận voi ----- */
  // Đầu nhìn thẳng, đỉnh hai u (đặc trưng voi châu Á)
  const ELP_HEAD = [[0, .95], [.62, .84], [.96, .36], [1, -.16], [.88, -.62], [.58, -.92], [.27, -.95], [0, -.8], [-.27, -.95], [-.58, -.92], [-.88, -.62], [-1, -.16], [-.96, .36], [-.62, .84]];
  const elpHead = (x, y, R, c) => elpShp(ELP_HEAD.map(([a, b]) => [x + a * R, y + b * R * .92]), cel(c.b, c.s)) + hl(x - R * .5, y - R * .6, R * .2, R * .09, -28, .55);
  // Tai xòe hai bên (k: cỡ); trim: viền vàng
  const ELP_EAR = [[.6, -.62], [1.08, -.94], [1.6, -.82], [1.92, -.32], [1.9, .3], [1.62, .78], [1.18, .92], [.8, .5]];
  const elpEar = (x, y, R, sd, k, c, trim) => {
    const m = (q, t = 1) => [x + sd * (.6 + (1.3 + (q[0] - 1.3) * t - .6) * k) * R, y + q[1] * t * k * R];
    let s = elpShp(ELP_EAR.map(q => m(q)), cel(c.b, c.s), 5) + pa(elpSm(ELP_EAR.map(q => m([q[0] + .06, q[1] + .02], .7))), c.ear, 0, 'opacity=".9"');
    if (trim) { const t = elpSm(ELP_EAR.slice(1, 7).map(q => m(q, .86)), false); s += ln(t, OL, 6) + ln(t, '#ffd21f', 3.2); }
    return s;
  };
  // Vòi: tô kín, chỉ viền hai mép và chóp (gốc vòi liền mặt); nếp nhăn ngang; mút vòi hồng
  const elpTrunk = (p, w0, w1, c, k = [.35, .5, .65]) => {
    const T = elpTube(p, w0, w1), L = T.L.slice(1), rr = T.R.slice(1).reverse();
    let s = `<path d="${T.d}" fill="${cel(c.b, c.s)}"/>` + ln(`M${elpQ(...L[0])}${elpC(L)}A${f1(w1 / 2)},${f1(w1 / 2)} 0 0 0 ${elpQ(...rr[0])}${elpC(rr)}`, OL, 4.5);
    for (const j of k) { const i = Math.round((p.length - 1) * j), a = T.L[i], b = T.R[i]; s += ln(`M${P(a[0] + (b[0] - a[0]) * .22, a[1] + (b[1] - a[1]) * .22)} Q${P((a[0] + b[0]) / 2 + (b[1] - a[1]) * .12, (a[1] + b[1]) / 2 - (b[0] - a[0]) * .12)} ${P(a[0] + (b[0] - a[0]) * .78, a[1] + (b[1] - a[1]) * .78)}`, c.s, 2.2); }
    const e = p[p.length - 1];
    return s + ci(e[0], e[1], w1 * .24, c.ear, 0);
  };
  // Ngà thuôn nhọn qua các điểm
  const elpTusk = (p, w, fill, sw = 4) => pa(elpTube(p, w, .6, 2.2).d, fill, sw);
  // Ngà lưỡi liềm: gốc (x0, y0) dưới cằm, bên sd, tầm ngang sp, độ võng dr, mũi vút lên ri, nửa bề dày gốc th; có vệt sáng
  const elpCres = (x0, y0, sd, sp, dr, ri, th, fill, sw = 3.8) => pa(`M${elpQ(x0 - sd * th, y0)}C${elpQ(x0 - sd * th * .9, y0 + dr)} ${elpQ(x0 + sd * sp * .88, y0 + dr * 1.04)} ${elpQ(x0 + sd * sp, y0 - ri)}C${elpQ(x0 + sd * sp * .77, y0 + dr * .58)} ${elpQ(x0 + sd * th * 1.7, y0 + dr * .58)} ${elpQ(x0 + sd * th, y0)}Z`, fill, sw) +
    ln(`M${elpQ(x0 + sd * sp * .3, y0 + dr * .66)}Q${elpQ(x0 + sd * sp * .7, y0 + dr * .7)} ${elpQ(x0 + sd * sp * .9, y0 + dr * .2 - ri * .5)}`, '#fff', 2, 'opacity=".9"');
  // Mắt: dạng 1 tròn to có lông mi; 2–4 hạnh nhân, mí hạ dần (hiền → uy nghi); dạng 4 phát sáng
  const elpEye = (cx, cy, rx, ry, sd, f, c) => {
    if (f === 1) {
      const ix = cx - sd * .8;
      return el(cx, cy, rx, ry, '#fff', 3.4) + ci(ix, cy + ry * .12, rx * .74, c.i, 0) + ci(ix, cy + ry * .16, rx * .42, OL, 0) +
        ci(ix - rx * .3, cy - ry * .2, rx * .3, '#fff', 0) + ci(ix + rx * .28, cy + ry * .42, rx * .13, '#fff', 0) +
        ln(`M${P(cx + sd * rx * .78, cy - ry * .55)} q${f1(sd * 3)},-1 ${f1(sd * 5.5)},-5 M${P(cx + sd * rx * .58, cy - ry * .78)} q${f1(sd * 2)},-2 ${f1(sd * 3)},-6`, OL, 2.2);
    }
    const sl = [0, 0, .12, .3, .4][f], ia = [cx - sd * rx, cy + ry * .15], oa = [cx + sd * rx, cy - ry * sl], ix = cx - sd * rx * .06, iy = cy + ry * .12;
    const top = `M${P(...ia)} C${P(cx - sd * rx * .6, cy - ry * 1.15)} ${P(cx + sd * rx * .5, cy - ry * 1.2)} ${P(...oa)}`;
    let s = `<path d="${top} C${P(cx + sd * rx * .7, cy + ry * .95)} ${P(cx - sd * rx * .5, cy + ry * 1.1)} ${P(...ia)}Z" fill="#fff" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/>`;
    s += ci(ix, iy, ry * .8, c.i, 0) + (f === 4 ? `<circle cx="${f1(ix)}" cy="${f1(iy)}" r="${f1(ry * .8)}" fill="none" stroke="#c8fff0" stroke-width="1.5"/>` : '') + ci(ix, iy, ry * .42, OL, 0) +
      ci(ix - ry * .3, iy - ry * .32, ry * .26, '#fff', 0) + ci(ix + ry * .32, iy + ry * .32, ry * .12, '#fff', 0);
    // mí trên cắt chéo vào trong (dạng 3–4), viền trên dày, lông mày
    if (f >= 3) s += `<path d="${top} L${P(cx - sd * rx * .15, cy - ry * (f === 4 ? .42 : .55))} Z" fill="${c.b}"/>`;
    s += ln(top + ` l${f1(sd * rx * .26)},${f1(-ry * .16)}`, OL, 3.4);
    if (f >= 3) s += ln(`M${P(cx - sd * rx * 1.05, cy - ry * 1.25 + 1.5)} Q${P(cx - sd * rx * .1, cy - ry * 1.85)} ${P(cx + sd * rx * 1.1, cy - ry * 1.6)}`, OL, 3.2);
    return s;
  };
  const elpEyes = (x, y, gap, rx, ry, f, c) => elpEye(x - gap, y, rx, ry, -1, f, c) + elpEye(x + gap, y, rx, ry, 1, f, c);
  // Dấu ngọc trên trán (dấu hệ): giọt ngọc nạm vàng
  const elpMark = (x, y, r, c) => pa(`M${P(x, y - r * 1.5)} Q${P(x + r * 1.15, y - r * .1)} ${P(x, y + r)} Q${P(x - r * 1.15, y - r * .1)} ${P(x, y - r * 1.5)}Z`, G, 2) +
    pa(`M${P(x, y - r * .9)} Q${P(x + r * .65, y)} ${P(x, y + r * .5)} Q${P(x - r * .65, y)} ${P(x, y - r * .9)}Z`, cel(c.jl, c.em), 0) + ci(x - r * .2, y - r * .25, r * .16, '#fff', 0);
  // Chân trụ: tâm trên xt (đỉnh yt), tâm bàn chân xf; móng chân; vòng chân vàng (band = y) có ngọc
  const elpLeg = (xt, yt, xf, w, fill, c, o = {}) => {
    const gy = o.gy ?? GROUND, fw = w * .56, my = (yt + gy) / 2, mx_ = (xt + xf) / 2;
    let s = elpShp([[xt - w / 2, yt], [xt + w / 2, yt], [mx_ + w * .48, my], [xf + fw + 1, gy - 3], [xf, gy + 1.5], [xf - fw - 1, gy - 3], [mx_ - w * .48, my]], fill, 5);
    s += [-.6, 0, .6].map(k => el(xf + fw * k, gy - 1.6, fw * .22, 2.8, o.nail || c.nail, 1.8)).join('');
    if (o.band) { const by = o.band, bx = xt + (xf - xt) * (by - yt) / (gy - yt), hw = w * .53, d = `M${P(bx - hw, by)} Q${P(bx, by + 4)} ${P(bx + hw, by)}`; s += ln(d, OL, 9) + ln(d, '#ffd21f', 5.5) + (o.gem ? ci(bx, by + 2.4, 2.8, c.em, 1.6) : ''); }
    return s;
  };
  // Vân ngọc trên da; gold: vân vàng khảm (dạng 4)
  const elpVein = (d, c, gold) => gold ? ln(d, OL, 4.2) + ln(d, '#ffd21f', 2) : ln(d, c.jade, 2.4, 'opacity=".85"');
  // Ngọc tròn có điểm sáng
  const elpGem = (x, y, r, c1, c2, w = 2) => ci(x, y, r, cel(c1, c2), w) + ci(x - r * .32, y - r * .34, r * .3, '#fff', 0, 'opacity=".9"');
  // Đá quý cắt mặt (lơ lửng)
  const elpFacet = (x, y, r, c1, c2) => pa(`M${P(x, y - r * 1.3)} L${P(x + r, y - r * .2)} L${P(x, y + r * 1.1)} L${P(x - r, y - r * .2)}Z`, cel(c1, c2), 2.2) + ln(`M${P(x - r * .5, y - r * .45)} L${P(x, y - r * .95)}`, '#fff', 1.6);
  // Tua vàng treo
  const elpTassel = (x, y, h = 9) => pa(`M${elpQ(x - 2, y)}A2.6,2.6 0 1 1 ${elpQ(x + 2, y)}L${elpQ(x + 4, y + h)}Q${elpQ(x, y + h + 2)} ${elpQ(x - 4, y + h)}Z`, G, 1.8);
  // Viên ngọc lục bảo phát sáng
  const elpOrb = (x, y, r, c, glow = 1) => (PET_LITE || !glow ? '' : ci(x, y, r + 5, c.jl, 0, 'opacity=".4"')) + ci(x, y, r, cel(c.jl, c.em), 3.2) + hl(x - r * .38, y - r * .4, r * .3, r * .16, -35, .9) + ci(x + r * .4, y + r * .38, r * .1, '#fff', 0);
  // Đuôi dây có chùm lông ngọc, vòng vàng
  const elpTail = (d, tuft, c, ring) => `<g class="pt">` + tube(d, cel(c.b, c.s), 4.5, 3.5) + (ring ? ln(ring, '#ffd21f', 4) : '') + elpShp(tuft, cel(c.jade, c.jd), 3.5) + `</g>`;
  // Mão vàng nhiều đỉnh: tâm đáy (x, y), nửa rộng w, cao h; đá giữa ngọc lục bảo, hai bên hồng ngọc
  const elpCrown = (x, y, w, h, c, big) => {
    const p = big ? [[-1, 0], [-1.2, -.6], [-.62, -.36], [-.36, -.78], [0, -1], [.36, -.78], [.62, -.36], [1.2, -.6], [1, 0]] : [[-1, 0], [-1.12, -.56], [-.55, -.34], [0, -1], [.55, -.34], [1.12, -.56], [1, 0]];
    return pa(`M${p.map(([a, b]) => P(x + a * w, y + b * h)).join(' L')} Q${P(x, y - h * .2)} ${P(x - w, y)}Z`, G, 3.5) + ln(`M${P(x - w * .95, y - h * .1)} Q${P(x, y - h * .3)} ${P(x + w * .95, y - h * .1)}`, '#d99500', 2.4) +
      elpGem(x, y - h * .42, w * .22, c.jl, c.em) + elpGem(x - w * .68, y - h * .2, w * .12, ...RUBY, 1.6) + elpGem(x + w * .68, y - h * .2, w * .12, ...RUBY, 1.6) + ci(x, y - h - 2, w * .12, '#fff6b0', 1.8);
  };
  // Lưới ngọc vàng rủ trên trán
  const elpNet = (x, y, w) => { const d = `M${P(x - w, y - 12)} Q${P(x - w * .45, y - 2)} ${P(x, y)} Q${P(x + w * .45, y - 2)} ${P(x + w, y - 12)} M${P(x - w * .55, y - 5)} l0,5 M${P(x + w * .55, y - 5)} l0,5`; return ln(d, OL, 4.5) + ln(d, '#ffd21f', 2.4); };
  // Neo trang phục + vị trí đầu cho hào quang (anc.halo = [x, y, rx])
  const elpAnc = (hx, top, hw, ey, ew, nk, bk, bd, halo) => ({ head: [hx, top, hw], eyes: [hx, ey, ew], neck: nk, back: bk, body: bd, halo });

  /* ----- 4 dạng ----- */
  const ELP = [null,
    // 1. Voi con trắng ngồi tròn, tai to, vòi cuộn ôm viên ngọc lục bảo
    (c) => {
      let body = '', head = '';
      const hx = 100, hy = 116, R = 31;
      body += elpShp([[100, 130], [124, 136], [135, 154], [131, 174], [114, 185], [86, 185], [69, 174], [65, 154], [76, 136]], cel(c.b, c.s));
      body += elpVein('M71,160 q5,-4 9,1 t9,0 M124,146 q4,4 8,1', c);
      for (const sd of [-1, 1]) body += el(100 + sd * 20, 182, 12.5, 8, cel(c.b, c.s), 4.5) + [-.5, 0, .5].map(k => el(100 + sd * 20 + k * 9, 186, 2.4, 2.2, c.nail, 1.6)).join('');
      body += ln('M110,178 Q120,181 130,178', OL, 7) + ln('M110,178 Q120,181 130,178', '#ffd21f', 3.6);
      head += elpEar(hx, hy, R, -1, 1.04, c) + elpEar(hx, hy, R, 1, 1.04, c);
      head += elpHead(hx, hy, R, c) + elpVein('M78,104 q4,-4 9,-2', c);
      head += elpMark(hx, hy - R * .62, 4, c);
      head += elpEyes(hx, hy - 1, 13.5, 8.6, 9.6, 1, c);
      head += el(hx - 23, hy + 11, 5, 3, '#ff9ab4', 0, 'opacity=".7"') + el(hx + 23, hy + 11, 5, 3, '#ff9ab4', 0, 'opacity=".7"');
      head += elpTrunk([[100, 122], [100, 136], [98, 150], [101, 162], [110, 170], [122, 169], [130, 160], [131, 150]], 17, 9, c, [.22, .34]);
      head += elpOrb(115, 153, 11, c);
      return { back: '', body, head, front: '', anc: elpAnc(hx, hy - R * .86, R * 1.6, hy - 1, 13.5 * 3.15, [hx, hy + R * .78, R * 1.7], [100, 132, 66, 52], [100, 158, 56, 50], [hx, hy - R * .9 - 8, R * .72]) };
    },
    // 2. Voi non bước đi bốn chân, ngà nhỏ bọc vàng, khăn gấm đỏ viền vàng trên lưng
    (c) => {
      let back = '', body = '', head = '';
      const hx = 64, hy = 100, R = 25;
      back += elpTail('M167,112 Q178,120 177,136', [[177, 132], [182, 140], [180, 150], [176, 152], [172, 146], [173, 139]], c);
      body += elpLeg(108, 128, 112, 18, cel(c.s, c.d), c) + elpLeg(156, 126, 152, 18, cel(c.s, c.d), c);
      body += elpShp([[78, 98], [100, 86], [128, 82], [152, 88], [168, 104], [171, 124], [162, 142], [134, 148], [104, 148], [84, 142], [74, 122]], cel(c.b, c.s));
      body += hl(102, 96, 10, 4, -15, .5);
      body += elpVein('M86,128 q5,-4 10,0 t10,-1 M150,132 q4,-4 9,-1 M84,108 q3,-4 8,-3 M162,112 q3,4 6,8', c);
      // khăn gấm
      body += pa('M96,92 Q127,76 156,90 L160,122 Q128,132 94,122Z', cel(c.cl, c.cls), 4.5);
      body += ln('M96,115 Q127,124 159,115', OL, 8.5) + ln('M96,115 Q127,124 159,115', '#ffd21f', 5) + ln('M99,94 Q127,81 154,92', '#ffd21f', 2.4, 'opacity=".85"');
      body += [[110, 101], [144, 101]].map(([x, y]) => pa(`M${x},${y - 5} L${x + 4},${y} L${x},${y + 5} L${x - 4},${y}Z`, G, 1.8)).join('') + ci(127, 101, 6.5, G, 2.6) + elpGem(127, 101, 3.8, c.jl, c.em, 0);
      body += elpTassel(95, 122) + elpTassel(160, 122);
      body += elpLeg(92, 130, 86, 21, cel(c.b, c.s), c, { band: 172 }) + elpLeg(142, 130, 146, 21, cel(c.b, c.s), c, { band: 172 });
      head += elpEar(hx, hy, R, -1, .92, c) + elpEar(hx, hy, R, 1, .92, c);
      for (const sd of [-1, 1]) head += elpTusk([[hx + sd * 7, hy + 14], [hx + sd * 10, hy + 25], [hx + sd * 17, hy + 30]], 7, cel(c.tusk, c.tusks), 3.5) + ln(`M${P(hx + sd * 7, hy + 22)} l${sd * 6},-1`, '#ffd21f', 3.2);
      head += elpHead(hx, hy, R, c);
      head += elpMark(hx, hy - R * .64, 4.2, c);
      head += elpEyes(hx, hy - 2, 10, 7.4, 7.6, 2, c);
      head += elpTrunk([[hx, hy + 6], [hx, hy + 20], [hx - 3, hy + 32], [hx - 10, hy + 41], [hx - 20, hy + 43], [hx - 27, hy + 37], [hx - 26, hy + 30]], 16, 8.5, c);
      return { back, body, head, front: '', anc: elpAnc(hx, hy - R * .86, R * 1.6, hy - 2, 31.5, [hx + 6, hy + R * .8, R * 1.6], [134, 90, 62, 56], [128, 118, 52, 50], [hx, hy - R * .9 - 8, R * .72]) };
    },
    // 3. Voi trưởng thành giơ vòi chào, sải bước; ngà ngọc dài, mão vàng, lưới ngọc trán, áo gấm tua vàng, vòng chân vàng
    (c) => {
      let back = '', body = '', head = '';
      const hx = 60, hy = 84, R = 28;
      back += elpTail('M177,96 Q190,104 189,124', [[189, 120], [195, 128], [193, 140], [188, 142], [183, 135], [184, 127]], c, 'M184,110 l7,-2');
      body += elpLeg(110, 124, 112, 22, cel(c.s, c.d), c, { band: 172, nail: '#ffd21f' }) + elpLeg(166, 120, 162, 22, cel(c.s, c.d), c, { band: 172, nail: '#ffd21f' });
      body += elpShp([[72, 80], [96, 64], [128, 60], [158, 68], [178, 88], [182, 112], [172, 134], [140, 142], [104, 142], [82, 134], [68, 110]], cel(c.b, c.s));
      body += hl(100, 74, 12, 4.5, -18, .5);
      body += elpVein('M88,124 q6,-5 12,0 t12,-1 M156,126 q5,-4 10,-1 M82,98 q4,-4 9,-3 M174,100 q3,5 4,10', c);
      // áo gấm lớn: viền vàng, tua vàng, huy hiệu ngọc
      body += pa('M98,70 Q132,52 166,70 L172,112 Q134,124 94,112Z', cel(c.cl, c.cls), 4.5);
      body += ln('M95,104 Q134,116 171,104', OL, 10) + ln('M95,104 Q134,116 171,104', '#ffd21f', 6.5) + ln('M100,75 Q132,59 164,75', '#ffd21f', 2.6, 'opacity=".9"');
      body += [[112, 86], [154, 86], [116, 98], [150, 98]].map(([x, y]) => pa(`M${x},${y - 4} L${x + 3.5},${y} L${x},${y + 4} L${x - 3.5},${y}Z`, G, 1.6)).join('');
      body += ci(133, 89, 10, G, 3) + elpGem(133, 89, 6, c.jl, c.em);
      body += [100, 114, 128, 142, 156, 168].map((x, i) => elpTassel(x, 108 + Math.sin(i / 5 * Math.PI) * 6, 7)).join('');
      body += elpLeg(92, 124, 82, 24, cel(c.b, c.s), c, { band: 168, nail: '#ffd21f', gem: 1 }) + elpLeg(150, 124, 154, 24, cel(c.b, c.s), c, { band: 168, nail: '#ffd21f', gem: 1 });
      // đầu
      head += elpEar(hx, hy, R, -1, .8, c, 1) + elpEar(hx, hy, R, 1, .8, c, 1);
      head += ci(hx + R * 1.38, hy + R * .78, 3.4, G, 2) + pa(`M${P(hx + R * 1.38, hy + R * .78 + 3)} q4.5,5 0,11 q-4.5,-6 0,-11Z`, cel(c.jl, c.em), 2);
      for (const sd of [-1, 1]) head += elpCres(hx + sd * 8, hy + 17, sd, 46, 38, 10, 5.5, cel(c.tusk, c.jade), 4) + ln(`M${P(hx + sd * 5, hy + 29)} l${sd * 10},1`, OL, 7.5) + ln(`M${P(hx + sd * 5.5, hy + 29)} l${sd * 9},1`, '#ffd21f', 4);
      head += elpHead(hx, hy, R, c);
      head += elpCrown(hx, hy - 23, 21, 30, c);
      head += elpNet(hx, hy - 9, 18) + elpMark(hx, hy - 5, 3.4, c);
      head += elpEyes(hx, hy + 2, 10.5, 7.2, 7, 3, c);
      head += elpTrunk([[hx, hy + 10], [hx - 4, hy + 24], [hx - 16, hy + 30], [hx - 29, hy + 22], [hx - 35, hy + 6], [hx - 36, hy - 12], [hx - 40, hy - 28], [hx - 48, hy - 36]], 18, 9.5, c, [.22, .35, .48, .62, .76]);
      // hiệu ứng: quầng ngọc mờ sau lưng, lấp lánh quanh vòi và mão, hai viên đá quý lơ lửng
      let front = '';
      if (!PET_LITE) {
        back = `<circle cx="118" cy="104" r="76" fill="#8affd8" opacity=".12"/>` + back;
        front += [[18, 30, 5], [96, 26, 4], [192, 70, 4.5], [8, 116, 3.8]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#ffffff', 1.6, 'twinkle', i * .45)).join('') +
          [[186, 150, 4.2, c.jl, c.em], [30, 150, 3.8, ...RUBY]].map(([x, y, r, a, b], i) => `<g class="float" style="animation-delay:-${i * .8}s">${elpFacet(x, y, r, a, b)}</g>`).join('');
      }
      return { back, body, head, front, anc: elpAnc(hx, hy - R * .9, R * 1.6, hy + 2, 33, [hx + 8, hy + R * .82, R * 1.7], [140, 70, 70, 66], [134, 102, 58, 56], [hx, hy - 60, R * .72]) };
    },
    // 4. Bạch Tượng thần sáu ngà: đứng trên đài sen, lưng mang bảo tháp ngọc, vân vàng khảm trên da, hào quang mạn-đà-la, đá quý lơ lửng
    (c) => {
      let back = '', body = '', head = '', front = '';
      const hx = 58, hy = 80, R = 29, gy = 174;
      if (!PET_LITE) {
        // hào quang: đĩa sáng ngọc + vòng cánh sen vàng xoay chậm + vòng chấm
        const ring = (r, col, w, ex = '') => `<circle cx="112" cy="96" r="${r}" fill="none" stroke="${col}" stroke-width="${w}" ${ex}/>`, dots = 'stroke-dasharray="0 18.4" stroke-linecap="round"';
        back += `<circle cx="112" cy="96" r="86" fill="#c8fff0" opacity=".14"/><circle cx="112" cy="96" r="64" fill="#fff6c4" opacity=".12"/>` + ring(80, OL, 7) + ring(80, '#ffd21f', 3.4) +
          `<g class="spin" style="transform-origin:112px 96px">${ring(88, OL, 10, dots)}${ring(88, '#ffe680', 6, dots)}</g>` + ring(68, '#c8fff0', 2.4, 'stroke-dasharray="2 8" stroke-linecap="round" opacity=".8"');
      }
      back += elpTail('M180,96 Q192,104 191,124', [[191, 120], [197, 128], [195, 140], [190, 142], [185, 135], [186, 127]], c, 'M186,110 l7,-2');
      // đài sen: lớp cánh sau (hướng lên, xòe)
      const pet = (x, y, len, ang, w, f, hi) => {
        const a = ang * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), q = (l, n) => elpQ(x + ux * len * l - uy * w * n, y + uy * len * l + ux * w * n);
        return pa(`M${q(0, 0)}C${q(.1, -.62)} ${q(.72, -.66)} ${q(1, 0)}C${q(.72, .66)} ${q(.1, .62)} ${q(0, 0)}Z`, f, 3.5) + (hi ? ln(`M${q(.3, -.28)}Q${q(.55, -.34)} ${q(.82, -.08)}`, '#fff', 2.2, 'opacity=".85"') : '');
      };
      const pk = lin('#ff6aa8', '#ffd0e4', '#ffffff');
      back += [[-162, 38, 56], [-142, 44, 72], [-120, 46, 92], [-98, 46, 112], [-76, 46, 132], [-56, 44, 152], [-34, 40, 170]].map(([a, l, x]) => pet(x, 182, l, a, 22, pk)).join('');
      body += elpLeg(106, 118, 108, 22, cel(c.s, c.d), c, { gy, band: 158, nail: '#ffd21f' }) + elpLeg(166, 116, 164, 22, cel(c.s, c.d), c, { gy, band: 158, nail: '#ffd21f' });
      body += elpShp([[72, 80], [96, 66], [128, 62], [158, 68], [178, 86], [182, 108], [172, 130], [142, 138], [106, 138], [84, 130], [68, 108]], cel(c.b, c.s));
      body += elpVein('M86,118 q6,-6 12,-1 t12,-2 t11,2 M152,122 q5,-5 11,-2 M82,96 q4,-5 10,-3 M172,96 q4,6 4,12', c, 1);
      // áo gấm dưới bảo tháp
      body += pa('M100,72 Q132,54 164,70 L170,100 Q132,114 96,100Z', cel(c.cl, c.cls), 4.5);
      body += ln('M97,94 Q132,106 169,94', OL, 10) + ln('M97,94 Q132,106 169,94', '#ffd21f', 6.5);
      body += [102, 116, 130, 144, 158, 170].map((x, i) => elpTassel(x, 98 + Math.sin(i / 5 * Math.PI) * 6, 7)).join('');
      // bảo tháp ngọc: bệ sen vàng → vòm ngọc → đài vuông → chóp vòng vàng → ngọc đỉnh phát sáng
      const sx = 132;
      body += el(sx, 66, 28, 8, G, 3.5) + [-21, -10.5, 0, 10.5, 21].map(dx => pa(`M${sx + dx - 6},64Q${sx + dx},51 ${sx + dx + 6},64Z`, G, 2.6)).join('');
      body += pa(`M${sx - 20},62Q${sx - 21},34 ${sx},30Q${sx + 21},34 ${sx + 20},62Q${sx},67 ${sx - 20},62Z`, cel(c.jl, c.jade), 4);
      body += ln(`M${sx - 17},51Q${sx},57 ${sx + 17},51`, '#ffd21f', 3.2) + ln(`M${sx - 12},40Q${sx - 8},35 ${sx - 2},34`, '#fff', 2.6, 'opacity=".8"') + elpGem(sx, 44, 4.2, ...RUBY, 1.8);
      body += pa(`M${sx - 7},31 L${sx + 7},31 L${sx + 6},24 L${sx - 6},24Z`, G, 3) + [[23, 9], [18, 7.4], [13.5, 5.8], [9.5, 4.4]].map(([y, w]) => el(sx, y, w, 2.8, G, 2.4)).join('');
      body += elpOrb(sx, 1, 6, c, 0) + (PET_LITE ? '' : spark4(sx + 8, -6, 3.6, '#ffffff', 1.4, 'twinkle'));
      body += elpLeg(92, 120, 90, 25, cel(c.b, c.s), c, { gy, band: 156, nail: '#ffd21f', gem: 1 }) + elpLeg(150, 120, 152, 25, cel(c.b, c.s), c, { gy, band: 156, nail: '#ffd21f', gem: 1 });
      // đài sen: lớp cánh trước che bàn chân, viền vàng đáy
      front += ln('M58,182 Q118,196 178,182', OL, 9) + ln('M58,182 Q118,196 178,182', '#ffd21f', 5);
      front += [[-150, 32, 68], [-126, 34, 88], [-102, 36, 108], [-80, 36, 128], [-58, 34, 148], [-34, 32, 168]].map(([a, l, x]) => pet(x, 189 - Math.abs(x - 118) * .1, l, a, 21, pk, 1)).join('');
      // đầu
      head += elpEar(hx, hy, R, -1, .8, c, 1) + elpEar(hx, hy, R, 1, .8, c, 1);
      const tf = cel('#ffffff', '#9fead0');
      for (const sd of [-1, 1]) {
        // ba ngà lưỡi liềm lồng nhau mỗi bên: gốc dưới cằm, cong xuống rồi vút lên
        for (const [dx, dy, sp, dr, ri, th] of [[8, 16, 54, 40, 14, 5], [7, 19, 42, 34, 2, 4.4], [6, 22, 30, 27, -8, 3.8]]) head += elpCres(hx + sd * dx, hy + dy, sd, sp, dr, ri, th, tf);
        if (!PET_LITE) head += spark4(hx + sd * 62, hy + 2, 3.6, '#ffffff', 1.4, 'twinkle', sd > 0 ? .5 : 0);
      }
      head += elpHead(hx, hy, R, c) + elpVein(`M${hx - 24},${hy - 2} q4,-6 10,-4 M${hx + 14},${hy - 16} q6,-2 9,3`, c, 1);
      head += elpCrown(hx, hy - 23, 23, 40, c, 1);
      head += elpNet(hx, hy - 9, 19) + elpMark(hx, hy - 5, 3.6, c);
      head += elpEyes(hx, hy + 3, 10.5, 7.2, 6.8, 4, c);
      head += elpTrunk([[hx, hy + 10], [hx, hy + 28], [hx - 1, hy + 42], [hx + 2, hy + 52], [hx + 9, hy + 57], [hx + 16, hy + 54], [hx + 17, hy + 47]], 18, 9.5, c, [.3, .45, .6]);
      // đá quý lơ lửng + lấp lánh
      if (!PET_LITE) front += [[14, 34, 5, c.jl, c.em], [190, 40, 4.5, ...RUBY], [194, 158, 5, '#9fd8ff', '#2f6fd1'], [10, 150, 4.5, '#ffe680', '#d99500'], [174, 12, 4, c.jl, c.em]].map(([x, y, r, a, b], i) => `<g class="float" style="animation-delay:-${f1(i * .5)}s">${elpFacet(x, y, r, a, b)}</g>`).join('') +
        [[40, 10, 4.5], [198, 98, 4], [4, 96, 4]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#ffffff', 1.6, 'twinkle', i * .4)).join('');
      return { back, body, head, front, anc: elpAnc(hx, hy - R * .9, R * 1.6, hy + 3, 33, [hx + 8, hy + R * .82, R * 1.7], [146, 70, 70, 64], [134, 104, 58, 50], [hx, hy - 70, R * .72]) };
    }
  ];

  PET_SPECS.ep_elephant = {
    el: 'stone',
    // b da trắng ngà, s bóng tím ngà, d bóng chân xa; jade/jd/jl ngọc bích; em ngọc lục bảo; cl/cls gấm đỏ; i mống mắt
    c: { b: '#fffaf0', s: '#d9cde4', d: '#a99cc4', l: '#ffffff', ear: '#ffc4d4', nail: '#f3e7d2', jade: '#3fd6a0', jd: '#13916c', jl: '#9dffd9', em: '#16b97c', cl: '#e8335a', cls: '#9e1640', i: '#17b87e', tusk: '#fffdf4', tusks: '#e2d3b0' },
    c4: { s: '#d2c4ea', d: '#9a8cc0', i: '#1fe0a0', cl: '#e02a5c', cls: '#8a1240' },
    draw(f, g, c) { return ELP[f](c, g); }
  };
})();

/* ===================== SỬ THI · BƯỚM THẦN RỪNG (ep_butterfly, hệ Rừng) =====================
   Sâu non xanh ngọc đội lá → kén vàng kim treo cành, nứt sáng, đôi mắt nhìn ra → bướm vừa nở, cánh lá rừng dựng chữ V,
   râu xoắn → Bướm Thần: bốn cánh kính màu ngọc–vàng, vương miện hoa, đuôi cánh dải lụa, phấn sáng, đom đóm, cánh hoa xoáy.
   Tọa độ tuyệt đối trong khung 200×200 (chân chạm y = 188). draw(f, g, c) giữ chữ ký chung; g, c bỏ qua.
   Cần: gfx.js (pa el ci ln hl bl P f1 cel lin leaf eye spark4 OL), pets.js (PET_SPECS, PET_LITE).
   Mọi hàm phụ nằm trong IIFE, tiền tố bfy; không thêm tên toàn cục nào ngoài PET_SPECS.ep_butterfly. */
(() => {
  const R2 = Math.PI / 180;
  const GOLD = '#ffd21f', GOLDS = '#d99500', PINK = '#ff5fa2', PINKL = '#ffb3d6', JADE = '#5dffc0', EM = '#16c08a', EMS = '#0a6e52', CREAM = '#fff3c8';
  const Q0 = (x, y) => `${Math.round(x)},${Math.round(y)}`;

  /* ----- Đường cong ----- */
  // Catmull-Rom → các đoạn Bézier 'C…' nối điểm i → i+1
  function bfySegs(a, closed) {
    const n = a.length, g = i => closed ? a[(i + n) % n] : a[Math.max(0, Math.min(n - 1, i))], out = [];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      out.push(`C${P(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)} ${P(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)} ${P(p2[0], p2[1])}`);
    }
    return out;
  }
  const bfySm = (a, closed = false) => `M${P(a[0][0], a[0][1])}` + bfySegs(a, closed).join('') + (closed ? 'Z' : '');
  // Lấy mẫu dày đúng đường Catmull-Rom ở trên
  function bfySample(a, closed, per = 4) {
    const n = a.length, g = i => closed ? a[(i + n) % n] : a[Math.max(0, Math.min(n - 1, i))], out = [];
    for (let i = 0; i < (closed ? n : n - 1); i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map(j => .5 * (2 * p1[j] + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
      }
    }
    if (!closed) out.push(a[n - 1]);
    return out;
  }
  // Dải thuôn theo đường tâm (đuôi lụa, sừng đuôi, cành)
  function bfyTaper(c, w0, w1) {
    const L = [], R = [], n = c.length;
    for (let i = 0; i < n; i++) {
      const a = c[Math.max(0, i - 1)], b = c[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], m = Math.hypot(dx, dy) || 1, w = (w0 + (w1 - w0) * i / (n - 1)) / 2;
      L.push([c[i][0] - dy / m * w, c[i][1] + dx / m * w]); R.push([c[i][0] + dy / m * w, c[i][1] - dx / m * w]);
    }
    R.reverse();
    return bfySm(L) + `L${P(R[0][0], R[0][1])}` + bfySegs(R, false).join('') + 'Z';
  }
  // Cánh hoa nhọn: gốc (x, y), dài L, nửa rộng w, góc ang (-90 = lên)
  function bfyPetalD(x, y, L, w, ang) {
    const a = ang * R2, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const q = (k, s) => P(x + ux * L * k + nx * w * s, y + uy * L * k + ny * w * s);
    return `M${P(x, y)}C${q(.12, 1)} ${q(.62, 1.15)} ${q(1, 0)}C${q(.62, -1.15)} ${q(.12, -1)} ${P(x, y)}Z`;
  }
  // Hoa 5 cánh nhọn (một path) + nhụy vàng
  const bfyBloom = (x, y, r, col = PINK, mid = GOLD, sw = 2, rot = 0) =>
    pa([0, 72, 144, 216, 288].map(a => bfyPetalD(x, y, r, r * .46, a - 90 + rot)).join(''), col, sw) + ci(x, y, r * .3, mid, sw * .75);
  // Viền lông xù quanh elip (cổ áo lông)
  function bfyFluffD(cx, cy, rx, ry, n, k = .25, a0 = 0, a1 = 360) {
    const pt = a => [cx + rx * Math.cos(a * R2), cy + ry * Math.sin(a * R2)], st = (a1 - a0) / n;
    let d = `M${P(...pt(a0))}`;
    for (let i = 0; i < n; i++) { const m = pt(a0 + (i + .5) * st); d += `Q${P(cx + (m[0] - cx) * (1 + k), cy + (m[1] - cy) * (1 + k))} ${P(...pt(a0 + (i + 1) * st))}`; }
    return d + 'Z';
  }
  // Râu xoắn: gốc b → đỉnh vòng xoắn tâm (cx, cy) bán kính r, sd = 1 xoắn theo chiều kim đồng hồ (bên phải)
  function bfyCurl(b, cx, cy, r, sd, turns = 1.15, n = 9) {
    const top = [cx, cy - r], pts_ = [b, [b[0] + (top[0] - b[0]) * .45 - sd * r * .3, b[1] + (top[1] - b[1]) * .55], [cx - sd * r * .75, cy - r * .9]];
    for (let k = 0; k <= n; k++) {
      const a = (-90 + sd * k * turns * 360 / n) * R2, rr = r * (1 - .62 * k / n);
      pts_.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
    }
    return pts_;
  }
  const bfyMir = (s, ax = 100) => s ? `<g transform="matrix(-1 0 0 1 ${f1(ax * 2)} 0)">${s}</g>` : '';
  const bfyMp = (a, ax = 100) => a.map(([x, y]) => [ax * 2 - x, y]);

  /* ----- Mặt ----- */
  const bfyIris = () => lin('#7a1a66', '#ff5fa2', '#ffd6ec');
  function bfyEyeCute(cx, cy, r, dx = 0, sw = 3.4) {
    const px = cx + dx * r, py = cy + r * .14;
    return el(cx, cy, r, r * 1.1, '#fff', sw) + el(px, py, r * .74, r * .8, bfyIris(), 0) + el(px, py, r * .42, r * .48, OL, 0) +
      ci(px - r * .3, py - r * .34, r * .27, '#fff', 0) + ci(px + r * .3, py + r * .3, r * .12, '#fff', 0);
  }
  // Mắt dạng 3–4: to, long lanh; mí trên là nét kẻ mi dày ôm mép trên, vểnh ở đuôi (hiền, uy nghi, không cau có)
  function bfyEyeS(cx, cy, rx, ry, sd, o = {}) {
    const px = cx - sd * rx * .06, py = cy + ry * .12, pr = rx * .72;
    const E = a => [cx + rx * Math.cos(a * R2), cy + ry * Math.sin(a * R2)], a0 = sd > 0 ? 196 : 344, a1 = sd > 0 ? 338 : 202;
    const p0 = E(a0), p1 = E(a1);
    let s = el(cx, cy, rx, ry, '#fff', 2.6) + el(px, py, pr, pr * 1.16, o.iris || bfyIris(), 0) + el(px, py + pr * .1, pr * .5, pr * .6, OL, 0);
    s += ci(px - pr * .36, py - pr * .34, pr * .3, '#fff', 0) + ci(px + pr * .36, py + pr * .44, pr * .13, '#fff', 0);
    if (o.star) s += spark4(px + pr * .34, py - pr * .46, pr * .3, '#fff', 0);
    s += ln(`M${P(...p0)}A${f1(rx)},${f1(ry)} 0 0 ${sd > 0 ? 1 : 0} ${P(...p1)}q${f1(sd * 4)},-.5 ${f1(sd * 7)},-6`, OL, o.lw || 4.6);
    s += ln(`M${P(p1[0] - sd * 1.5, p1[1] - 2.5)}l${f1(sd * 2.4)},-5.5M${P(...E(sd > 0 ? 300 : 240))}l${f1(sd * 1.6)},-4.5`, OL, 2.4);
    return s;
  }
  const bfyBlush = (x, y, rx = 6, ry = 3.6) => el(x, y, rx, ry, '#ff8fb8', 0, 'opacity=".65"');
  const bfySmile = (x, y, w, open) => open ? pa(`M${P(x - w, y)}Q${P(x, y + w * 1.3)} ${P(x + w, y)}Q${P(x, y + w * .35)} ${P(x - w, y)}Z`, '#a8204f', 2.8) + el(x, y + w * .58, w * .45, w * .2, '#ff7a9a', 0) : ln(`M${P(x - w, y)}Q${P(x, y + w * .8)} ${P(x + w, y)}`, OL, 3);
  // Đốm mắt trên cánh / thân: viền vàng, hồng, tâm tím than, chấm sáng
  const bfyOcel = (x, y, r, mid = PINK) => ci(x, y, r, GOLD, Math.max(1.6, r * .26)) + ci(x, y, r * .66, mid, 0) + ci(x, y, r * .34, OL, 0) + ci(x - r * .16, y - r * .18, r * .14, '#fff', 0);

  /* ----- Hiệu ứng (bỏ trong bản nhẹ) ----- */
  const bfyFly = (x, y, r = 2.6, d = 0, col = '#d6ff4a') => PET_LITE ? '' : `<g class="twinkle" style="animation-delay:-${f1(d)}s"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 2.5)}" fill="${col}" opacity=".28"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.5)}" fill="${col}" opacity=".7"/><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .85)}" fill="#fffde0"/></g>`;
  const bfyGlow = (x, y, r, col) => PET_LITE ? '' : [1, .8, .6].map(k => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * k)}" fill="${col}" opacity=".09"/>`).join('') + `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * .7)}" fill="url(#gGlow)" opacity=".3"/>`;
  const bfyNeo = (head, eyes, neck, back, body, halo) => ({ head, eyes, neck, back, body, halo: halo || [head[0], head[1] - 20, head[2] * .47] });

  /* ===================== DẠNG 1: SÂU NON ===================== */
  function bfy1(c) {
    let back = '', body = '', head = '', front = '';
    const seg = [[86, 148, 21], [105, 161, 20], [125, 167, 18.5], [144, 166, 17], [160, 158, 14.5], [170, 146, 11.5]];
    // Sừng đuôi vàng mềm
    back += pa(bfyTaper(bfySample([[170, 140], [174, 128], [183, 120], [191, 123]], false, 3), 8, 2.5), cel(GOLD, GOLDS), 3.5);
    // Thân đốt tròn gộp một viền
    body += bl(seg.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), cel(c.b, c.s));
    // Bụng sáng từng đốt
    body += seg.map(([x, y, r]) => el(x, y + r * .5, r * .7, r * .36, c.l, 0)).join('');
    // Vạch nối đốt
    let jd = '';
    for (let i = 0; i < seg.length - 1; i++) {
      const [x1, y1, r1] = seg[i], [x2, y2, r2] = seg[i + 1], dx = x2 - x1, dy = y2 - y1, m = Math.hypot(dx, dy), nx = -dy / m, ny = dx / m, mx_ = x1 + dx * r1 / (r1 + r2), my = y1 + dy * r1 / (r1 + r2), w = (r1 + r2) * .42;
      jd += `M${P(mx_ + nx * w, my + ny * w)}Q${P(mx_ - dx / m * 3, my - dy / m * 3)} ${P(mx_ - nx * w, my - ny * w)}`;
    }
    body += ln(jd, c.s, 2.4);
    // Chân giả mũm mĩm
    body += seg.slice(1, 5).map(([x, y, r]) => el(x - 2, y + r - 1.5, 5.2, 4, c.ls, 2.6)).join('');
    // Đốm như mắt + chấm hồng + nốt vàng trên lưng
    body += seg.slice(1, 5).map(([x, y, r], i) => bfyOcel(x - r * .05, y - r * .32, r * .3 - i * .2) + ci(x + r * .42, y + r * .02, 2.3, PINK, 0) + ci(x - r * .25, y - r * .9, 2.8, GOLD, 1.8)).join('');
    body += hl(96, 148, 7, 3.5, -30, .5);
    // Râu ngắn chùy vàng
    head += ln('M62,90Q52,84 46,72M96,88Q106,82 112,66', OL, 3.2) + ci(46, 71, 4, GOLD, 2.2) + ci(112, 65, 4, GOLD, 2.2);
    // Đầu tròn sáng
    head += bl('<ellipse cx="79" cy="111" rx="31" ry="29"/>', cel('#7af2d2', c.s));
    head += hl(64, 98, 8, 4, -30, .55);
    head += bfyEyeCute(67, 113, 10.5, .06) + bfyEyeCute(92, 113, 10.5, -.06);
    head += bfyBlush(56, 126) + bfyBlush(103, 126) + bfySmile(79.5, 126, 5.5, true);
    // Lá đội đầu + cuống xoăn + hoa nhỏ
    head += pa('M108,90C102,62 66,54 38,80C54,98 90,101 108,90Z', cel('#8af06a', '#2f9a3e'), 4);
    head += ln('M107,90Q76,80 41,80', '#2f9a3e', 2.4) + ln('M94,86l-8,-11M80,84l-8,-12M66,82l-7,-11M53,81l-5,-8M93,88l-6,6M79,86l-6,7M65,84l-6,6', '#2f9a3e', 1.8, 'opacity=".8"');
    head += ln('M106,90C114,86 116,74 110,72C105,71 104,77 108,78', OL, 6.5) + ln('M106,90C114,86 116,74 110,72C105,71 104,77 108,78', '#7be35a', 2.8);
    head += bfyBloom(98, 80, 7.5, PINK, GOLD, 2);
    if (!PET_LITE) front += spark4(36, 112, 5, '#fff6b0', 1.8, 'twinkle', 0) + spark4(176, 100, 4, '#bfffe6', 1.6, 'twinkle', .6);
    return { back, body, head, front, anc: bfyNeo([79, 82, 50], [79.5, 113, 50], [86, 136, 40], [124, 148, 62, 36], [112, 160, 44, 28], [79, 60, 24]) };
  }

  /* ===================== DẠNG 2: KÉN VÀNG KIM ===================== */
  function bfy2(c) {
    let back = '', body = '', head = '', front = '';
    // Cành mọc từ gốc rễ, uốn móc câu
    const br = bfySample([[152, 190], [158, 164], [158, 136], [152, 106], [142, 76], [128, 52], [112, 38], [96, 34], [80, 38]], false, 3);
    back += pa('M138,190Q150,184 152,172L162,172Q162,184 174,190Z', cel('#b8743a', '#7a4418'), 3.5);
    back += pa(bfyTaper(br, 17, 7), cel('#c07a3c', '#7a4418'), 4.5);
    back += ln('M153,176l4,-3M157,148l-4,-3M153,118l4,-4M144,88l-4,-2M128,60l3,-4', '#7a4418', 2.4);
    back += leaf(149, 98, 24, -8, '#7be35a', '#2f9a3e', 3) + leaf(158, 136, 20, 22, '#9df27a', '#2f9a3e', 3) + leaf(155, 160, 18, -30, '#7be35a', '#2f9a3e', 3) + leaf(82, 38, 22, 165, '#9df27a', '#2f9a3e', 3) + leaf(84, 37, 16, -140, '#7be35a', '#2f9a3e', 2.6);
    back += bfyBloom(130, 45, 7.5) + bfyBloom(145, 68, 5.5, PINKL);
    back += pa('M134,190Q142,178 150,186Q156,176 164,186Q172,178 178,190Z', cel('#5ad04a', '#2f9a3e'), 3);
    // Sợi tơ treo kén
    back += ln('M100,36V66', OL, 6) + ln('M100,36V66', '#fff6d0', 2.4) + ci(100, 38, 3.6, GOLD, 2);
    if (!PET_LITE) back += `<ellipse cx="100" cy="112" rx="60" ry="70" fill="#fff6b0" opacity=".14"/><ellipse cx="100" cy="102" rx="48" ry="32" fill="#fff6b0" opacity=".2"/>`;
    // Vỏ kén: viền Catmull-Rom, tách đôi theo đường nứt (nửa trên nằm ở lớp đầu nên khẽ nhấc theo nhịp)
    const T = [[100, 53], [124, 61], [140, 98], [135, 134], [119, 162], [100, 176], [81, 162], [65, 134], [60, 98], [76, 61]];
    const S = bfySegs(T, true);
    const U = [[132, 92], [122, 83], [112, 88], [100, 79], [88, 88], [78, 83], [68, 92]];
    const Lz = [[68, 104], [78, 114], [88, 110], [100, 121], [112, 110], [122, 114], [132, 104]];
    const top = `M60,98${S[8]}${S[9]}${S[0]}${S[1]}` + U.map(p => 'L' + P(...p)).join('') + 'Z';
    const bot = `M140,98${S[2]}${S[3]}${S[4]}${S[5]}${S[6]}${S[7]}` + Lz.map(p => 'L' + P(...p)).join('') + 'Z';
    const gap = 'M60,98' + Lz.map(p => 'L' + P(...p)).join('') + 'L140,98' + U.map(p => 'L' + P(...p)).join('') + 'Z';
    body += `<path d="${gap}" fill="#3fd8b4" stroke="#fff3a0" stroke-width="12" stroke-linejoin="round"/>` + el(100, 116, 30, 7, '#1f9a80', 0, 'opacity=".45"');
    body += pa(bot, cel('#ffd84a', '#e09a10'), 4.2);
    // Gân cánh in qua vỏ, chấm vàng sáng
    body += ln('M78,116C82,140 96,156 112,164M122,116C120,136 113,150 104,158', '#c07a00', 2.6) + ln('M100,112V172', '#c07a00', 2, 'opacity=".5"');
    body += [[85, 130], [115, 130], [92, 150], [108, 150], [100, 166]].map(([x, y]) => ci(x, y, 2.1, '#fffbe0', 0)).join('');
    body += hl(77, 124, 4, 10, 15, .45) + pa('M94,174Q100,186 106,174Z', GOLD, 2.6);
    // Mắt nhìn ra từ khe, nắp kén phủ lên
    head += bfyEyeCute(87.5, 98.5, 9, .12, 2.8) + bfyEyeCute(112.5, 98.5, 9, -.12, 2.8) + bfyBlush(78, 108, 4.5, 2.6) + bfyBlush(122, 108, 4.5, 2.6) + bfySmile(100, 110, 3.6, true);
    head += pa(top, cel('#ffe066', '#e09a10'), 4.2);
    head += pa('M73,69Q100,78 127,69L130,78Q100,89 70,78Z', cel(EM, EMS), 2.8) + [80, 90, 100, 110, 120].map((x, i) => ci(x, 79 + [0, 2.2, 3.3, 2.2, 0][i], 2.4, GOLD, 1.3)).join('');
    head += hl(86, 64, 8, 3.4, -25, .6);
    // Tia sáng từ khe nứt, mảnh vỏ bay, lấp lánh
    if (!PET_LITE) {
      let rays = '';
      for (const [x, y, sd] of [[133, 98, 1], [67, 98, -1]]) for (const a of [-34, -4, 24]) {
        const A = (sd > 0 ? a : 180 - a) * R2, L = a === -4 ? 44 : 32;
        rays += `M${P(x, y)}L${P(x + Math.cos(A - .1) * L, y + Math.sin(A - .1) * L)}L${P(x + Math.cos(A + .1) * L, y + Math.sin(A + .1) * L)}Z`;
      }
      front += `<g class="twinkle"><path d="${rays}" fill="#fff6b0" opacity=".75"/></g>`;
      front += `<g class="float">` + pa('M152,72l9,-3l-3,9Z', '#ffd84a', 2.2) + pa('M42,84l8,2l-6,6Z', '#ffd84a', 2.2) + `</g>`;
      front += spark4(36, 62, 6, '#fff6b0', 1.8, 'twinkle', 0) + spark4(172, 114, 5, '#fff6b0', 1.8, 'twinkle', .7) + spark4(46, 146, 4, '#bfffe6', 1.6, 'twinkle', 1.2);
    }
    return { back, body, head, front, anc: bfyNeo([100, 57, 46], [100, 99, 46], [100, 126, 56], [100, 70, 68, 98], [100, 140, 60, 52], [100, 44, 22]) };
  }

  /* ===================== DẠNG 3: BƯỚM VỪA NỞ ===================== */
  function bfyWing3() {
    let s = '';
    // Cánh sau: quạt tròn nhỏ, đốm mắt lớn
    const H2 = [104, 130], hw = [H2, [124, 125], [146, 128], [162, 142], [163, 162], [149, 174], [130, 170], [115, 155]];
    const hwi = hw.map(([x, y]) => [H2[0] + (x - H2[0]) * .78, H2[1] + (y - H2[1]) * .78]);
    s += pa(bfySm(hw, true), cel('#11906a', '#06503f'), 5) + pa(bfySm(hwi, true), cel('#3fe0a8', '#14a078'), 0);
    s += ln('M106,132Q130,136 156,150M106,134Q124,146 138,168M106,131Q130,126 150,134', '#0b6e50', 2.2, 'opacity=".8"');
    s += hw.slice(2, 7).map(([x, y], i) => ci(x + (H2[0] - x) * .1, y + (H2[1] - y) * .1, 2.2, i % 2 ? '#fff6b0' : '#ffffff', 0)).join('');
    s += bfyOcel(143, 152, 8.5);
    // Cánh trước: lá lớn dựng đứng (cánh vừa nở đang hong khô), gân lá
    const H = [104, 120], fw = [H, [110, 96], [116, 68], [124, 42], [134, 20], [146, 8], [157, 13], [164, 34], [165, 62], [159, 88], [144, 108], [122, 121]];
    const fwi = fw.map(([x, y]) => [H[0] + (x - H[0]) * .84, H[1] + (y - H[1]) * .84]);
    s += pa(bfySm(fw, true), cel('#11906a', '#06503f'), 5.5) + pa(bfySm(fwi, true), cel('#4ff0b0', '#16a87c'), 0);
    s += pa(bfyPetalD(106, 118, 50, 12, -74), PINKL, 0, 'opacity=".7"');
    s += ln('M106,118C118,88 132,48 146,14', '#0b6e50', 2.8) + ln('M114,100L110,86M120,82L116,64M126,64L124,46M133,46L132,30M118,96L134,94M124,78L144,74M130,60L150,54M137,42L154,36', '#0b6e50', 2.2, 'opacity=".85"');
    s += fw.slice(3, 10).map(([x, y], i) => ci(x + (H[0] - x) * .08, y + (H[1] - y) * .08, 2.4, i % 2 ? '#fff6b0' : '#ffffff', 0)).join('');
    s += bfyOcel(150, 30, 5.5, '#ff8cc4') + hl(128, 60, 11, 4, -70, .45);
    return `<g class="sway" style="transform-origin:0% 62%">${s}</g>`;
  }
  function bfy3(c) {
    let back = '', body = '', head = '', front = '';
    const w = bfyWing3();
    back += bfyGlow(100, 100, 80, JADE) + w + bfyMir(w);
    // Chân + giày vàng
    for (const sd of [-1, 1]) body += ln(`M${P(100 + sd * 8, 164)}L${P(100 + sd * 10, 181)}`, OL, 9) + ln(`M${P(100 + sd * 8, 164)}L${P(100 + sd * 10, 181)}`, '#0f6e58', 4.5) + el(100 + sd * 12, 184.5, 7.5, 4.6, cel(GOLD, GOLDS), 3);
    // Thân giọt nước ngọc, hoa văn vàng
    body += pa(bfySm([[100, 112], [116, 120], [120, 140], [114, 162], [100, 172], [86, 162], [80, 140], [84, 120]], true), cel('#2fd6a0', EMS), 5);
    body += ln('M90,146L100,153L110,146M92,158L100,164L108,158', GOLD, 3) + ci(100, 139, 3, PINK, 1.6);
    body += hl(90, 134, 4, 8, 15, .45);
    // Tay nhỏ
    for (const sd of [-1, 1]) body += ln(`M${P(100 + sd * 15, 130)}Q${P(100 + sd * 26, 136)} ${P(100 + sd * 27, 148)}`, OL, 10) + ln(`M${P(100 + sd * 15, 130)}Q${P(100 + sd * 26, 136)} ${P(100 + sd * 27, 148)}`, '#2fd6a0', 5) + ci(100 + sd * 27, 149, 5, '#7af2d2', 2.6);
    // Cổ áo lông kem
    body += pa(bfyFluffD(100, 119, 22, 8, 9, .35), CREAM, 3.6);
    // Râu xoắn
    const an = bfyCurl([103, 66], 113, 36, 7.5, -1, 1.15, 6), tip = an[an.length - 1];
    const ad = bfySm(an) + bfySm(bfyMp(an));
    head += ln(ad, OL, 7) + ln(ad, '#0f6e58', 3) + ci(tip[0], tip[1], 3.4, GOLD, 2) + ci(200 - tip[0], tip[1], 3.4, GOLD, 2);
    // Đầu
    const sk = '#5ff0c8';
    head += bl('<ellipse cx="100" cy="91" rx="31" ry="28"/>', cel(sk, '#16a080'));
    head += el(100, 104, 20, 8, '#c8fff0', 0, 'opacity=".55"') + hl(84, 76, 8, 4, -30, .55);
    head += bfyEyeS(87, 93, 10, 11.5, -1, { skin: sk, h: .62 }) + bfyEyeS(113, 93, 10, 11.5, 1, { skin: sk, h: .62 });
    head += bfyBlush(76, 106) + bfyBlush(124, 106) + bfySmile(100, 106, 4.6, true);
    if (!PET_LITE) front += bfyFly(30, 70, 2.4, 0, '#bfffe6') + bfyFly(176, 96, 2.6, .7, '#fff6b0') + spark4(164, 184, 4, '#fff6b0', 1.6, 'twinkle', .4) + spark4(30, 150, 4.5, '#bfffe6', 1.6, 'twinkle', 1);
    return { back, body, head, front, anc: bfyNeo([100, 64, 50], [100, 93, 56], [100, 117, 40], [100, 116, 44, 60], [100, 144, 38, 44], [100, 42, 24]) };
  }

  /* ===================== DẠNG 4: BƯỚM THẦN ===================== */
  // Cánh kính màu: pts kín (pts[0] = gốc cánh); rings: tỉ lệ vòng; nS: số ô quanh; col(k, j) màu ô (null = để màu nền)
  function bfyGlass(pts, rings, nS, col, per = 2) {
    const H = pts[0], n = pts.length, Sm = bfySample(pts, true, per), E = Sm.slice(per, (n - 1) * per + 1);
    const at = (e, t) => [H[0] + (E[e][0] - H[0]) * t, H[1] + (E[e][1] - H[1]) * t];
    const bd = []; for (let k = 0; k <= nS; k++) bd.push(Math.round(k * (E.length - 1) / nS));
    const byCol = {}; let lead = '';
    for (let k = 0; k < nS; k++) for (let j = 1; j < rings.length; j++) {
      const t0 = rings[j - 1], t1 = rings[j], cc = col(k, j - 1); if (!cc) continue;
      const o = []; for (let e = bd[k]; e <= bd[k + 1]; e++) o.push(Q0(...at(e, t1)));
      const i_ = []; if (t0 > 0) for (let e = bd[k + 1]; e >= bd[k]; e--) i_.push(Q0(...at(e, t0)));
      byCol[cc] = (byCol[cc] || '') + `M${(t0 > 0 ? i_ : [Q0(...H)]).concat(o).join('L')}Z`;
    }
    for (let k = 1; k < nS; k++) lead += `M${Q0(...at(bd[k], rings[1] * .55))}L${Q0(...E[bd[k]])}`;
    for (const t of rings.slice(1, -1)) lead += 'M' + E.map((_, e) => Q0(...at(e, t))).join('L');
    const cells = Object.entries(byCol).map(([cc, d]) => `<path d="${d}" fill="${cc}"/>`).join('');
    return { d: bfySm(pts, true), cells, lead, E, at, bd };
  }
  function bfyWing4() {
    let s = '';
    // Đuôi cánh dài như dải lụa: gốc rộng liền cánh sau, thuôn nhọn, sọc hồng–vàng, giọt ngọc ở chóp
    const tail = [[144, 154], [149, 171], [158, 185], [172, 193], [186, 195]];
    s += pa(bfyTaper(tail, 26, 3), cel('#2ad6c8', '#0f8a6a'), 4.5) + ln(bfySm([[146, 160], [152, 175], [162, 186], [178, 193]]), '#ff9ccd', 3.4) + ln(bfySm([[146, 160], [152, 175], [162, 186], [178, 193]]), GOLD, 1.4);
    s += pa('M186,195Q193,190 194,196Q192,202 186,195Z', JADE, 2.2);
    // Cánh sau kính màu + đốm mắt
    const hw = [[106, 112], [136, 112], [166, 118], [186, 132], [188, 152], [174, 166], [152, 170], [132, 160], [116, 140]];
    const HG = bfyGlass(hw, [0, .42, .76, 1], 5, (k, j) => j === 0 ? null : j === 1 ? (k % 2 ? '#ff9ccd' : '#ffe27a') : (k % 2 ? '#14b884' : '#2ad6c8'));
    s += pa(HG.d, '#c8fff0', 10) + HG.cells + ln(HG.lead, OL, 4.4) + ln(HG.lead, GOLD, 1.9);
    s += bfyOcel(168, 146, 10.5);
    // Cánh trước kính màu lớn
    const fw = [[106, 100], [118, 76], [136, 50], [160, 26], [184, 10], [197, 15], [198, 36], [194, 62], [182, 86], [160, 104], [132, 112]];
    const FG = bfyGlass(fw, [0, .36, .7, 1], 6, (k, j) => j === 0 ? null : j === 1 ? (k % 2 ? '#ffe27a' : '#ff9ccd') : (k % 2 ? '#2ad6c8' : '#14b884'));
    s += pa(FG.d, '#c8fff0', 11) + FG.cells + ln(FG.lead, OL, 4.6) + ln(FG.lead, GOLD, 2);
    // Ngọc đính ô ngoài + vệt sáng kính
    for (let k = 0; k < 6; k++) { const e = Math.round((FG.bd[k] + FG.bd[k + 1]) / 2), [x, y] = FG.at(e, .86); s += ci(x, y, 2.6, k % 2 ? '#fff6b0' : '#ffd6ec', 1.4); }
    s += ln('M128,78L150,52M134,90L170,48', '#fff', 3, 'opacity=".45"');
    return `<g class="sway" style="transform-origin:0% 55%">${s}</g>`;
  }
  function bfy4(c) {
    let back = '', body = '', head = '', front = '';
    back += bfyGlow(100, 100, 98, JADE);
    // Cánh hoa xoáy quanh (một nửa sau lưng, một nửa trước mặt; quay cùng nhịp)
    const swirl = angs => PET_LITE ? '' : `<g class="spin">` + angs.map((a, i) => { const x = 100 + Math.cos(a * R2) * 90, y = 105 + Math.sin(a * R2) * 90; return pa(bfyPetalD(x, y, 12, 5, a + 100), i % 2 ? '#ffe27a' : '#ffb3d6', 2.2); }).join('') + `</g>`;
    back += swirl([30, 150, 270]);
    const w = bfyWing4();
    back += w + bfyMir(w);
    // Thân ngọc: bụng giọt nước, hoa văn vàng chữ V, chóp ngọc treo
    body += pa('M94,160Q100,178 106,160Z', cel(GOLD, GOLDS), 3) + ci(100, 168, 2.6, JADE, 1.4);
    body += pa(bfySm([[100, 102], [112, 110], [114, 128], [108, 146], [100, 162], [92, 146], [86, 128], [88, 110]], true), cel('#18c890', EMS), 5);
    body += ln('M92,124L100,130L108,124M93,136L100,142L107,136M95,148L100,152L105,148', GOLD, 2.8) + ci(100, 116, 2.8, PINK, 1.6);
    body += hl(93, 116, 3, 7, 12, .45);
    // Bờm cổ lông kem + trâm ngọc
    body += pa(bfyFluffD(100, 100, 23, 11, 11, .42), CREAM, 3.5) + pa(bfyFluffD(100, 101, 15, 6.5, 8, .35), '#ffe9a8', 0);
    body += ci(100, 106, 4.6, 'url(#gGold)', 2.2) + ci(100, 106, 2.4, JADE, 0);
    // Râu dài xoắn, đầu râu phát sáng
    const an = bfyCurl([106, 52], 132, 18, 8, 1, 1.2, 6), tip = an[an.length - 1];
    const ad = bfySm(an) + bfySm(bfyMp(an));
    head += ln(ad, OL, 6.5) + ln(ad, '#0f6e58', 2.8);
    if (!PET_LITE) head += ci(tip[0], tip[1], 8, GOLD, 0, 'opacity=".35"') + ci(200 - tip[0], tip[1], 8, GOLD, 0, 'opacity=".35"');
    head += ci(tip[0], tip[1], 3.6, '#fff6b0', 2) + ci(200 - tip[0], tip[1], 3.6, '#fff6b0', 2);
    // Đầu
    const sk = '#3fe0b0';
    head += bl('<ellipse cx="100" cy="72" rx="27" ry="25"/>', cel(sk, '#0d7a62'));
    head += hl(86, 61, 7, 3.5, -30, .55);
    const eo = { skin: sk, h: .52, iris: lin('#0f8a6a', '#5dffc0', '#e0fff4'), star: 1 };
    head += bfyEyeS(88.5, 74, 9.2, 10.4, -1, eo) + bfyEyeS(111.5, 74, 9.2, 10.4, 1, eo);
    head += bfyBlush(79, 87, 5, 3) + bfyBlush(121, 87, 5, 3) + ln('M95,88Q100,92 105,88', OL, 3);
    // Vương miện hoa: lá vàng, chóp ngọc, hoa hồng
    head += pa(bfyPetalD(100, 52, 32, 8.5, -90) + bfyPetalD(93, 53, 24, 6.5, -128) + bfyPetalD(107, 53, 24, 6.5, -52) + bfyPetalD(86, 56, 16, 5, -150) + bfyPetalD(114, 56, 16, 5, -30), 'url(#gGold)', 3.2);
    head += ln('M77,58Q100,45 123,58', OL, 7) + ln('M77,58Q100,45 123,58', GOLD, 3.4);
    head += pa('M100,27L106,36L100,45L94,36Z', JADE, 2.4) + `<circle cx="98.3" cy="33.5" r="1.6" fill="#fff"/>`;
    head += bfyBloom(83, 53, 9.5) + bfyBloom(117, 53, 9.5) + bfyBloom(71, 61, 6, PINKL, '#fff6b0', 1.8) + bfyBloom(129, 61, 6, PINKL, '#fff6b0', 1.8) + ci(100, 52, 3.2, '#ff3b8a', 1.6);
    // Phấn sáng, đom đóm, cánh hoa (lớp trước)
    if (!PET_LITE) {
      front += swirl([90, 210, 330]);
      front += [[26, 130, 2.6, 0, '#d6ff4a'], [174, 128, 2.8, .5, '#d6ff4a'], [52, 18, 2.2, 1, '#ffe27a'], [64, 170, 2.4, 1.2, '#ffe27a'], [136, 168, 2.4, .2, '#d6ff4a']].map(([x, y, r, d, col]) => bfyFly(x, y, r, d, col)).join('');
      front += [[78, 178, 0], [122, 176, .9], [100, 188, 1.6]].map(([x, y, d]) => `<g class="ember" style="animation-delay:-${d}s">${ci(x, y, 2.2, '#fff6b0', 1.2)}</g>`).join('');
    }
    return { back, body, head, front, anc: bfyNeo([100, 48, 50], [100, 75, 50], [100, 97, 38], [100, 98, 44, 64], [100, 124, 32, 44], [100, 22, 24]) };
  }

  PET_SPECS.ep_butterfly = {
    el: 'forest',
    c: { b: '#3fe0b8', s: '#14967a', l: '#e6fff6', ls: '#a8ecd4', i: '#ff5fa2', a: GOLD },
    c4: { b: '#18c890', s: '#0a6e52', l: '#c8fff0', ls: '#7ae8c0', i: '#7dffcf', a: GOLD },
    draw(f, g, c) {
      const C = f >= 4 ? Object.assign({}, this.c, this.c4) : this.c;
      return [null, bfy1, bfy2, bfy3, bfy4][f](C);
    }
  };
})();

/* ===================== SỬ THI · CÁ VOI NGÂN HÀ (ep_whale, hệ Bóng đêm) =====================
   Cá voi con giọt sao → cá voi non bơi ngang, bụng vạch sáng → cá voi trưởng thành dựng mình, vây cánh, đuôi kéo vệt sao
   → Cá Voi Ngân Hà khổng lồ uốn hình trăng khuyết, thân chứa tinh vân và hành tinh nhỏ, cánh ánh sáng, vương miện trăng, sao băng.
   Nạp SAU gfx.js và pets.js. Chỉ thêm PET_SPECS.ep_whale; mọi hàm phụ nằm trong IIFE, tiền tố whl.
   Dùng lõi gfx.js: pa, el, ci, ln, hl, bl, cel, lin, spark4, P, f1, OL; và PET_LITE của pets.js (bỏ hiệu ứng ở trại chung).
   draw(f, g, c) không dùng g (RIG): mỗi dạng một hàm vẽ riêng, trả { back, body, head, front, anc }, anc.halo = [x, y, rx] cho hào quang. */
(() => {
  const RAD = Math.PI / 180;
  const whlFx = s => (typeof PET_LITE !== 'undefined' && PET_LITE) ? '' : s;
  const whlP = p => P(p[0], p[1]);
  const whlMid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  // Đường cong mượt qua dãy điểm (bậc hai qua trung điểm)
  function whlSmooth(p, closed) {
    const n = p.length;
    if (closed) {
      let d = 'M' + whlP(whlMid(p[n - 1], p[0]));
      for (let i = 0; i < n; i++) d += 'Q' + whlP(p[i]) + ' ' + whlP(whlMid(p[i], p[(i + 1) % n]));
      return d + 'Z';
    }
    let d = 'M' + whlP(p[0]);
    for (let i = 1; i < n - 1; i++) d += 'Q' + whlP(p[i]) + ' ' + whlP(whlMid(p[i], p[i + 1]));
    return d + 'L' + whlP(p[n - 1]);
  }
  // Thân dạng ống thon theo xương sống (Catmull-Rom), ws = nửa bề dày tại từng điểm điều khiển
  function whlTube(sp, ws, n = 5) {
    const C = [], W = [];
    for (let i = 0; i < sp.length - 1; i++) {
      const a = sp[i - 1] || sp[i], b = sp[i], c = sp[i + 1], d = sp[i + 2] || c;
      for (let k = 0; k < n; k++) {
        const t = k / n, t2 = t * t, t3 = t2 * t;
        C.push([0, 1].map(j => .5 * (2 * b[j] + (c[j] - a[j]) * t + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * t2 + (3 * b[j] - a[j] - 3 * c[j] + d[j]) * t3)));
        W.push(ws[i] + (ws[i + 1] - ws[i]) * (3 - 2 * t) * t * t);
      }
    }
    C.push(sp[sp.length - 1]); W.push(ws[ws.length - 1]);
    const m = C.length, N = C.map((p, i) => {
      const a = C[Math.max(0, i - 1)], b = C[Math.min(m - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
      return [-dy / L, dx / L];
    });
    const at = (i, v) => [C[i][0] + N[i][0] * v, C[i][1] + N[i][1] * v];
    const idx = t => Math.max(0, Math.min(m - 1, Math.round(t * (m - 1))));
    // điểm tại tỉ lệ t dọc thân, lệch vf × nửa bề dày; kèm góc tiếp tuyến (độ)
    const pt = (t, vf) => { const i = idx(t); return at(i, vf * W[i]); };
    const ang = t => { const i = idx(t); return Math.atan2(N[i][0], -N[i][1]) / RAD; };
    return { C, W, N, m, at, idx, pt, ang };
  }
  const whlOutline = T => whlSmooth(T.C.map((_, i) => T.at(i, T.W[i])).concat(T.C.map((_, i) => T.at(T.m - 1 - i, -T.W[T.m - 1 - i]))), true);
  // Chỉ số mẫu từ a tới b, bước 2 (luôn gồm điểm cuối): đủ mượt mà chuỗi SVG ngắn một nửa
  const whlIdx = (a, b) => { const r = []; for (let i = a; i < b; i += 2) r.push(i); r.push(b); return r; };
  // Dải dọc thân từ t0 tới t1 (tỉ lệ dọc thân); mép trong/ngoài là hàm (u, w) → độ lệch theo pháp tuyến, w = nửa bề dày tại đó
  function whlBand(T, t0, t1, v1, v2) {
    const a = T.idx(t0), b = T.idx(t1), A = [], B = [];
    for (const i of whlIdx(a, b)) { const u = (i - a) / Math.max(1, b - a); A.push(T.at(i, v1(u, T.W[i]))); B.push(T.at(i, v2(u, T.W[i]))); }
    return whlSmooth(A.concat(B.reverse()), true);
  }
  function whlLine(T, t0, t1, v) {
    const a = T.idx(t0), b = T.idx(t1);
    return whlSmooth(whlIdx(a, b).map(i => T.at(i, v((i - a) / Math.max(1, b - a), T.W[i]))), false);
  }
  const whlBell = (u, p = .7) => Math.pow(Math.max(0, Math.sin(Math.PI * u)), p);
  // Vây đuôi tại cuối xương sống: S nửa sải, L độ vươn của hai chóp
  function whlFluke(T, S, L, fill, sw = 5, tilt = 0) {
    const i = T.m - 1, E = T.C[i], n = T.N[i], t = [n[1], -n[0]];
    const q = (u, v) => [E[0] + t[0] * u + n[0] * v, E[1] + t[1] * u + n[1] * v];
    const half = s => [q(L * .25, s * S * .55), q(L * .55, s * S * 1.02), q(L + tilt * s, s * S), q(L * .7, s * S * .55), q(L * .48, s * S * .12)];
    const R = half(1), Lh = half(-1);
    const d = `M${whlP(q(-3, -3))}C${whlP(Lh[0])} ${whlP(Lh[1])} ${whlP(Lh[2])}Q${whlP(Lh[3])} ${whlP(Lh[4])}L${whlP(q(L * .4, 0))}L${whlP(R[4])}Q${whlP(R[3])} ${whlP(R[2])}C${whlP(R[1])} ${whlP(R[0])} ${whlP(q(-3, 3))}Z`;
    return { d: pa(d, fill, sw), q };
  }
  // Vây ngực dài: gốc (x, y), hướng ang (độ), dài L, rộng W; o.scal: mép sau răng lược như lông cánh
  function whlFin(x, y, ang, L, W, o = {}) {
    const a = ang * RAD, u = [Math.cos(a), Math.sin(a)], v = [-u[1], u[0]], sd = o.flip ? -1 : 1;
    const q = (s, t) => [x + u[0] * s + v[0] * t * sd, y + u[1] * s + v[1] * t * sd];
    const lead = [q(0, -W * .42), q(L * .28, -W * .62), q(L * .62, -W * .5), q(L * .9, -W * .22), q(L, 0)];
    let trail;
    if (o.scal) {
      trail = []; const k = o.scal;
      for (let j = k; j >= 1; j--) { const s = j / (k + 1); trail.push(q(L * (s + .5 / (k + 1)) * .98, W * (.1 + (1 - s) * .48) + W * .1), q(L * s, W * (.14 + (1 - s) * .4))); }
      trail.push(q(0, W * .45));
    } else trail = [q(L * .82, W * .2), q(L * .5, W * .46), q(L * .2, W * .5), q(0, W * .45)];
    return { pts: lead.concat(trail), q };
  }
  const whlFinD = f => whlSmooth(f.pts, true);
  // Cánh ánh sáng: lông bao tròn ở gốc + n lông cánh thon xòe quạt về mép sau. Gốc (x, y), hướng ang, dài L, rộng W, sd lật phía xòe
  function whlWing(x, y, ang, L, W, n, c, sd = 1) {
    const a = ang * RAD, u = [Math.cos(a), Math.sin(a)], v = [-u[1] * sd, u[0] * sd], q = (p, k) => [x + u[0] * p + v[0] * k, y + u[1] * p + v[1] * k];
    let s = '', vein = '';
    for (let j = n - 1; j >= 0; j--) {
      const t = j / (n - 1), b = q(L * (.5 - .3 * t), W * (.02 + .22 * t)), fa = a + sd * (6 + 58 * t) * RAD, len = L * (.72 - .26 * t), w = W * (.17 - .02 * t);
      const fu = [Math.cos(fa), Math.sin(fa)], fv = [-fu[1] * sd, fu[0] * sd], r = (p, k) => [b[0] + fu[0] * p + fv[0] * k, b[1] + fu[1] * p + fv[1] * k];
      s += pa(`M${whlP(r(0, -w))}Q${whlP(r(len * .6, -w * 1.3))} ${whlP(r(len, 0))}Q${whlP(r(len * .55, w * 1.25))} ${whlP(r(0, w))}Z`, lin(c.w1, c.w2, c.w3), 3.2);
      vein += `M${whlP(r(len * .3, 0))}L${whlP(r(len * .8, 0))}`;
    }
    s += ln(vein, '#ffffff', 1.4, 'opacity=".7"');
    s += pa(whlSmooth([q(0, -W * .3), q(L * .28, -W * .5), q(L * .6, -W * .4), q(L * .8, -W * .16), q(L * .52, W * .04), q(L * .28, W * .24), q(L * .06, W * .36)], true), lin(c.w1, c.w2), 3.6);
    s += ln(`M${whlP(q(4, -W * .25))}Q${whlP(q(L * .4, -W * .5))} ${whlP(q(L * .74, -W * .2))}`, '#ffffff', 2.2) + whlStar(...q(L * .3, -W * .12), 3.2, '#fffbe0') + whlStar(...q(L * .52, -W * .2), 2.4, '#ffffff');
    return s;
  }
  // Viền sáng / mảng màu bám mép elip từ góc a1 tới a2, dày t
  function whlArc(cx, cy, rx, ry, a1, a2, t, col, ex = '') {
    const o = [], i = [];
    for (let k = 0; k <= 10; k++) {
      const u = k / 10, a = (a1 + (a2 - a1) * u) * RAD, tt = t * whlBell(u);
      o.push([cx + (rx - .6) * Math.cos(a), cy + (ry - .6) * Math.sin(a)]);
      i.push([cx + (rx - .6 - tt) * Math.cos(a), cy + (ry - .6 - tt) * Math.sin(a)]);
    }
    return `<path d="M${o.map(whlP).join('L')}L${i.reverse().map(whlP).join('L')}Z" fill="${col}" ${ex}/>`;
  }
  // Sao lấp lánh 4 cánh (không viền) và chấm sao
  const whlStar = (x, y, r, col = '#fffbe0', cls = '', dl = 0) => spark4(x, y, r, col, 0, cls, dl);
  const whlDot = (x, y, r, col = '#fff') => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${col}"/>`;
  const whlGlow = (x, y, r, col, op = .3) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}" fill="${col}" opacity="${op}"/>`;
  const whlRot = (x, y, a) => `transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})"`;
  // Chòm sao: nối các điểm bằng nét mảnh, mỗi đỉnh một sao
  const whlConst = (pts, col, big = 3.2) => ln('M' + pts.map(whlP).join('L'), col, 1.3, 'opacity=".75"') + pts.map((p, i) => whlStar(p[0], p[1], i % 2 ? big * .7 : big, i % 2 ? '#ffffff' : col)).join('');
  // Tinh vân: các mảng mờ cắt gắt dọc thân
  const whlNeb = (T, L) => L.map(([t, vf, rx, ry, col, op]) => { const p = T.pt(t, vf); return el(p[0], p[1], rx, ry, col, 0, `opacity="${op}" ${whlRot(p[0], p[1], T.ang(t))}`); }).join('');
  // Hành tinh nhỏ có vành
  function whlPlanet(x, y, r, col, cold, ring, rot = -18, sw = 2.4) {
    const ringD = (front) => `M${P(x - r * 1.8, y)} A${f1(r * 1.8)},${f1(r * .5)} 0 0 ${front ? 0 : 1} ${P(x + r * 1.8, y)}`;
    return `<g ${whlRot(x, y, rot)}>` + ln(ringD(false), OL, sw + 2.4) + ln(ringD(false), ring, sw) + ci(x, y, r, cel(col, cold), sw) + ln(ringD(true), OL, sw + 2.4) + ln(ringD(true), ring, sw) + `</g>` + hl(x - r * .35, y - r * .4, r * .28, r * .16, -25, .7);
  }
  // Thiên hà xoắn ốc nhỏ nghiêng: lõi sáng + 2 nhánh cong
  const whlGalaxy = (x, y, r, a) => `<g ${whlRot(x, y, a)}>` + el(x, y, r * 1.15, r * .5, '#ffd6fb', 0, 'opacity=".3"') +
    ln(`M${P(x - r, y - r * .12)} Q${P(x - r * .25, y - r * .62)} ${P(x + r * .2, y - r * .12)} M${P(x + r, y + r * .12)} Q${P(x + r * .25, y + r * .62)} ${P(x - r * .2, y + r * .12)}`, '#ffffff', 1.8, 'opacity=".85"') + ci(x, y, r * .24, '#fffbe0', 0) + `</g>`;
  // Sao băng: vệt thon + đầu sao
  function whlShoot(x, y, L, ang, col, dl = 0) {
    const a = ang * RAD, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const d = `M${P(x + nx * 2.4, y + ny * 2.4)}L${P(x - ux * L, y - uy * L)}L${P(x - nx * 2.4, y - ny * 2.4)}Z`;
    return `<g class="twinkle" style="animation-delay:-${dl}s"><path d="${d}" fill="${col}" opacity=".55"/><path d="M${P(x + nx * 1.1, y + ny * 1.1)}L${P(x - ux * L * .6, y - uy * L * .6)}L${P(x - nx * 1.1, y - ny * 1.1)}Z" fill="#fff" opacity=".85"/>` + whlStar(x, y, 5.5, '#ffffff') + `</g>`;
  }

  /* ----- Mặt ----- */
  // Mắt to tròn, tròng chuyển sắc tím → xanh lơ, đáy sáng, mi trên dày vểnh đuôi; o.glow: quầng sáng; o.star: sao trong đồng tử
  function whlEye(cx, cy, rx, ry, sd, c, o = {}) {
    let s = '';
    if (o.glow) s += el(cx, cy, rx + 4.5, ry + 4.5, o.glow, 0, 'opacity=".38"');
    s += el(cx, cy, rx, ry, lin(c.i1, c.i2, c.i3), 3.2);
    const px = cx + sd * rx * .04, py = cy + ry * .06;
    s += el(px, py, rx * .5, ry * .55, OL, 0);
    if (o.star) s += whlStar(px, py + ry * .04, rx * .44, o.star);
    s += el(px - rx * .34, py - ry * .36, rx * .3, ry * .27, '#fff', 0) + ci(px + rx * .3, py + ry * .38, rx * .13, '#fff', 0);
    const top = cy - ry * 1.02;
    s += ln(`M${P(cx - sd * rx * .78, cy - ry * .86)} Q${P(cx - sd * rx * .05, top - ry * .2)} ${P(cx + sd * rx * .72, top + ry * .12)} Q${P(cx + sd * rx * 1.08, top + ry * .26)} ${P(cx + sd * rx * 1.4, top - ry * .1)}`, OL, 3.6);
    return s;
  }
  // Mặt: tâm giữa hai mắt (x, y), cỡ k; o.open: miệng há cười (dạng 1), không thì cười cong rộng; o.glow, o.star truyền cho mắt
  function whlFace(x, y, k, c, o = {}) {
    const g = 14 * k, rx = 9.2 * k, ry = 10.4 * k;
    let s = el(x - g - 8 * k, y + 10 * k, 6 * k, 3.4 * k, c.cheek, 0, 'opacity=".6"') + el(x + g + 8 * k, y + 10 * k, 6 * k, 3.4 * k, c.cheek, 0, 'opacity=".6"');
    s += whlEye(x - g, y, rx, ry, -1, c, o) + whlEye(x + g, y, rx, ry, 1, c, o);
    if (o.open) s += pa(`M${P(x - 6 * k, y + 12 * k)} Q${P(x, y + 14 * k)} ${P(x + 6 * k, y + 12 * k)} Q${P(x + 5 * k, y + 21 * k)} ${P(x, y + 21 * k)} Q${P(x - 5 * k, y + 21 * k)} ${P(x - 6 * k, y + 12 * k)} Z`, c.mouth, 2.6) + el(x, y + 18.4 * k, 3.4 * k, 2 * k, c.tongue, 0);
    else s += ln(`M${P(x - 15 * k, y + 11 * k)} Q${P(x - 13.5 * k, y + 14 * k)} ${P(x - 10 * k, y + 14 * k)} Q${P(x, y + 18 * k)} ${P(x + 10 * k, y + 14 * k)} Q${P(x + 13.5 * k, y + 14 * k)} ${P(x + 15 * k, y + 11 * k)}`, OL, 3);
    return s;
  }
  // Tia phun sao từ lỗ thở (x, y), cao h
  function whlSpout(x, y, h, c, big = 1) {
    let s = ln(`M${P(x, y)} Q${P(x - 1, y - h * .6)} ${P(x, y - h)} M${P(x, y - h * .55)} Q${P(x - h * .2, y - h * .85)} ${P(x - h * .42, y - h * .78)} M${P(x, y - h * .55)} Q${P(x + h * .22, y - h * .88)} ${P(x + h * .44, y - h * .74)}`, OL, 7.5);
    s += ln(`M${P(x, y)} Q${P(x - 1, y - h * .6)} ${P(x, y - h)} M${P(x, y - h * .55)} Q${P(x - h * .2, y - h * .85)} ${P(x - h * .42, y - h * .78)} M${P(x, y - h * .55)} Q${P(x + h * .22, y - h * .88)} ${P(x + h * .44, y - h * .74)}`, c.spray, 3.4);
    s += spark4(x, y - h - 3 * big, 6.5 * big, '#fffbe0', 2) + spark4(x - h * .46, y - h * .8, 4.4 * big, c.groove, 1.8) + spark4(x + h * .48, y - h * .76, 4.6 * big, '#ffd6fb', 1.8);
    return `<g class="float">${s}</g>`;
  }

  // Đầu cá voi: elip xoay theo trục thân (rot). whlHeadDeco: họng bạc có rãnh, mảng tinh vân, viền sáng
  // Elip xoay dạng path ngược chiều kim đồng hồ (cùng chiều với whlOutline) để gộp với thân thành MỘT path: một khung bao → một dải màu liền
  const whlEllD = (hx, hy, rx, ry, rot) => { const c = Math.cos(rot * RAD) * rx, s = Math.sin(rot * RAD) * rx, A = `A${f1(rx)},${f1(ry)} ${f1(rot)} 1 0 `; return `M${P(hx + c, hy + s)}${A}${P(hx - c, hy - s)}${A}${P(hx + c, hy + s)}Z`; };
  const whlBodyD = (hx, hy, rx, ry, rot, T) => `<path d="${whlEllD(hx, hy, rx, ry, rot)}${whlOutline(T)}"/>`;
  function whlHeadDeco(hx, hy, rx, ry, rot, c, o = {}) {
    const arc = (k, a1, a2) => { const A = a => P(hx + rx * k * Math.cos(a * RAD), hy + ry * (k + .06) * Math.sin(a * RAD)); return `M${A(a1)} A${f1(rx * k)},${f1(ry * (k + .06))} 0 0 1 ${A(a2)}`; };
    let s = `<g ${whlRot(hx, hy, rot)}>`;
    if (o.neb) s += whlArc(hx, hy, rx, ry, -170, -20, ry * .55, o.neb, 'opacity=".32"');
    s += whlArc(hx, hy, rx, ry, o.t1 ?? 8, o.t2 ?? 172, ry * (o.tk ?? .44), cel(c.l, c.ls));
    s += ln(arc(.86, 40, 140) + arc(.74, 62, 118), c.groove, 2.2);
    return s + whlArc(hx, hy, rx, ry, o.r1 ?? -120, o.r2 ?? 10, 3.6, c.rim) + `</g>`;
  }
  // Vẫy nhẹ quanh điểm (x, y) bằng hoạt ảnh .pt có sẵn
  const whlWag = (s, x, y, dl = 0) => `<g class="pt" style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px${dl ? `;animation-delay:-${dl}s` : ''}">${s}</g>`;

  /* ===== Dạng 1: cá voi con tròn như giọt nước, mắt to, phun tia sao ===== */
  function whlF1(c) {
    const hx = 94, hy = 150, rx = 38, ry = 33, skin = cel(c.b, c.s);
    let back = '', body = '', head = '', front = '';
    // Đuôi nhỏ vểnh lên sau lưng
    const T = whlTube([[110, 152], [134, 144], [148, 126], [151, 108]], [26, 16, 8, 4.5]);
    back += whlWag(whlFluke(T, 14, 12, skin, 4.5).d + pa(whlOutline(T), skin, 5) + ln(whlLine(T, .3, .95, (u, w) => -w + 2), c.rim, 2, 'opacity=".9"'), 130, 148);
    // Vây nhỏ + thân tròn
    const fL = whlFin(64, 168, 150, 20, 13), fR = whlFin(122, 172, 40, 18, 12, { flip: true });
    body += pa(whlFinD(fR), skin, 4.5) + el(hx, hy, rx, ry, skin, 5.5);
    body += whlArc(hx, hy, rx, ry, 18, 162, 15, cel(c.l, c.ls)) + ln(`M${P(hx - 16, hy + 25)} Q${P(hx - 2, hy + 29)} ${P(hx + 14, hy + 25.5)} M${P(hx - 11, hy + 30)} Q${P(hx - 1, hy + 32.5)} ${P(hx + 9, hy + 30.5)}`, c.groove, 2, 'opacity=".9"');
    body += whlArc(hx, hy, rx, ry, -80, 20, 3.4, c.rim) + hl(hx - 20, hy - 18, 9, 4.6);
    body += whlDot(hx + 18, hy - 22, 1.6) + whlDot(hx + 26, hy - 12, 1.2) + whlDot(hx - 22, hy - 20, 1.3) + whlStar(hx + 22, hy - 18, 3.4, '#ffffff') + whlStar(hx - 13, hy - 25, 2.6, c.groove);
    body += pa(whlFinD(fL), skin, 4.5) + ln(`M${whlP(fL.q(4, 0))} L${whlP(fL.q(15, 0))}`, c.s, 2);
    // Mặt + dấu sao trán
    head += whlGlow(hx - 2, hy - 20, 6, c.groove, .3) + whlStar(hx - 2, hy - 20, 5.2, c.groove) + whlFace(hx - 4, hy - 1, 1.08, c, { open: true });
    front += whlSpout(hx + 2, hy - ry + 2, 24, c);
    return {
      back, body, head, front,
      anc: { head: [hx - 2, hy - ry, 54], eyes: [hx - 4, hy - 1, 48], neck: [hx - 4, hy + 25, 50], back: [hx + 6, hy - 22, 50, 40], body: [hx - 4, hy + 26, 46, 26], halo: [hx - 2, hy - ry - 8, 26] }
    };
  }

  /* ===== Dạng 2: cá voi non bơi ngang, vây dài, bụng có vạch sáng ===== */
  function whlF2(c) {
    const hx = 66, hy = 104, rx = 35, ry = 29, skin = cel(c.b, c.s);
    let back = '', body = '', head = '', front = '';
    const T = whlTube([[74, 110], [104, 122], [134, 121], [156, 106], [166, 84]], [27, 25, 18, 10, 5]);
    const fl = whlFluke(T, 19, 17, skin, 5, 2);
    back += pa(whlFinD(whlFin(100, 130, 52, 36, 13)), cel(c.s, c.d), 4.5);
    back += whlWag(fl.d + ln(`M${whlP(fl.q(5, -5))} Q${whlP(fl.q(10, -12))} ${whlP(fl.q(15, -16))} M${whlP(fl.q(5, 5))} Q${whlP(fl.q(10, 12))} ${whlP(fl.q(15, 16))}`, c.rim, 2, 'opacity=".8"'), 150, 112);
    body += bl(whlBodyD(hx, hy, rx, ry, -6, T), skin);
    // Bụng bạc + vạch sáng
    body += pa(whlBand(T, 0, .78, (u, w) => w - .8, (u, w) => w - .8 - w * .62 * whlBell(u, .5)), cel(c.l, c.ls), 0);
    body += ln([.22, .4, .58].map(k => whlLine(T, .05, .7 - k * .4, (u, w) => w - w * k * whlBell(u * .5 + .25, .4))).join(''), c.groove, 2.4);
    body += whlHeadDeco(hx, hy, rx, ry, -6, c, { t1: 25, t2: 150, tk: .45, r1: -110, r2: -10 });
    // Lưng: viền sáng, tinh vân, chòm sao
    body += ln(whlLine(T, .12, .95, (u, w) => -w + 2.2), c.rim, 2.6);
    body += whlNeb(T, [[.3, -.45, 12, 6, c.neb1, .35], [.55, -.4, 9, 5, c.neb2, .4]]);
    body += whlConst([T.pt(.2, -.55), T.pt(.34, -.72), T.pt(.47, -.45), T.pt(.62, -.6)], c.groove, 3.4) + whlDot(...T.pt(.75, -.5), 1.3) + whlDot(...T.pt(.4, -.2), 1.1);
    body += whlDot(hx + 14, hy - 20, 1.4) + whlDot(hx - 18, hy - 16, 1.2) + hl(hx - 17, hy - 15, 8, 4);
    head += whlGlow(hx - 4, hy - 18, 6, c.groove, .3) + whlStar(hx - 4, hy - 18, 5, c.groove) + whlFace(hx - 3, hy, .98, c, {});
    // Vây gần dài, mép trước sáng
    const fN = whlFin(84, 124, 48, 46, 17);
    front += pa(whlFinD(fN), skin, 5) + pa(whlSmooth([fN.q(4, 3), fN.q(20, 5), fN.q(38, 2), fN.q(44, 0), fN.q(36, 6), fN.q(18, 7.5), fN.q(4, 6)], true), c.l, 0, 'opacity=".75"') +
      ln(`M${whlP(fN.q(6, -3))} Q${whlP(fN.q(22, -5))} ${whlP(fN.q(40, -2))}`, c.rim, 2);
    front += whlFx(`<g class="float">${whlStar(hx + 4, hy - ry - 10, 4.6, '#fffbe0')}${whlStar(hx + 14, hy - ry - 4, 3, c.groove)}</g>`);
    return {
      back, body, head, front,
      anc: { head: [hx - 2, hy - ry, 50], eyes: [hx - 3, hy, 46], neck: [hx - 2, hy + 24, 48], back: [hx + 30, hy - 8, 48, 34], body: [hx + 22, hy + 20, 40, 26], halo: [hx - 2, hy - ry - 8, 23] }
    };
  }

  /* ===== Dạng 3: cá voi trưởng thành vọt lên trời, vây dang như cánh, đuôi kéo vệt sao ===== */
  function whlF3(c) {
    const hx = 64, hy = 72, rx = 40, ry = 33, skin = cel(c.b, c.s);
    let back = '', body = '', head = '', front = '';
    const T = whlTube([[78, 88], [102, 112], [122, 134], [138, 152], [152, 164], [168, 168]], [31, 28, 22, 15, 9, 5]);
    const fl = whlFluke(T, 19, 16, skin, 5, 3);
    // Vệt sao đuôi để lại: một cung quẫy sáng + chuỗi sao nhỏ dần cuộn lên sau lưng
    const trail = [[184, 152, 5.2], [194, 128, 4.4], [192, 104, 3.6], [180, 88, 3], [164, 86, 2.4], [156, 98, 1.8]];
    back += whlFx(ln('M180,170 Q200,150 194,124 Q190,96 168,86 Q154,86 156,100', '#bff8ff', 6, 'opacity=".22"') + ln('M180,170 Q200,150 194,124 Q190,96 168,86 Q154,86 156,100', '#ffffff', 1.4, 'opacity=".55"') +
      trail.map(([x, y, r], i) => whlStar(x, y, r, i % 2 ? '#ffd6fb' : '#fffbe0', 'twinkle', i * .3)).join('') + whlDot(198, 142, 1.4) + whlDot(176, 104, 1.2) + whlDot(186, 82, 1.4, '#bff8ff'));
    // Cánh vây: xa chĩa lên phải (sau thân), gần chĩa xuống trái (trước thân)
    const wing = (x, y, ang, flip) => {
      const f = whlFin(x, y, ang, 62, 26, { scal: 4, flip });
      return pa(whlFinD(f), cel(c.w, c.ws), 5) + ln(`M${whlP(f.q(6, -6))} Q${whlP(f.q(30, -12))} ${whlP(f.q(58, -2))}`, c.rim, 2.6) +
        ln(`M${whlP(f.q(10, 2))} L${whlP(f.q(30, 8))} M${whlP(f.q(16, -2))} L${whlP(f.q(46, 4))}`, c.ws, 2.2) + whlStar(...f.q(38, -2), 3.2, '#fffbe0') + whlStar(...f.q(20, 4), 2.4, c.groove);
    };
    const wr = T.pt(.2, -.72), wl = T.pt(.24, .78);
    back += whlWag(wing(wr[0], wr[1], -48, true), wr[0], wr[1], .7);
    back += whlWag(fl.d + ln(`M${whlP(fl.q(5, -6))} Q${whlP(fl.q(10, -12))} ${whlP(fl.q(15, -17))} M${whlP(fl.q(5, 6))} Q${whlP(fl.q(10, 12))} ${whlP(fl.q(15, 17))}`, c.rim, 2, 'opacity=".8"'), 158, 164);
    body += bl(whlBodyD(hx, hy, rx, ry, 40, T), skin);
    // Bụng bạc phía dưới-trái + rãnh sáng
    body += pa(whlBand(T, 0, .8, (u, w) => w - .8, (u, w) => w - .8 - w * .6 * whlBell(u, .45)), cel(c.l, c.ls), 0);
    body += ln([.22, .4].map(k => whlLine(T, .02, .68, (u, w) => w - w * k * 1.3 * whlBell(u, .45))).join(''), c.groove, 2.3);
    body += whlNeb(T, [[.25, -.45, 13, 7, c.neb1, .38], [.5, -.4, 10, 6, c.neb2, .4], [.75, -.3, 7, 4, c.neb1, .35]]);
    body += whlHeadDeco(hx, hy, rx, ry, 40, c, { neb: c.neb2 });
    body += ln(whlLine(T, .1, .94, (u, w) => -w + 2.2), c.rim, 2.6);
    body += whlConst([T.pt(.18, -.6), T.pt(.34, -.72), T.pt(.46, -.42), T.pt(.62, -.6)], c.groove, 3.2) + whlDot(...T.pt(.72, -.5), 1.4) + whlDot(...T.pt(.28, -.2), 1.2) + hl(hx - 16, hy - 20, 8, 4, -45);
    head += whlConst([[hx - 8, hy - 30], [hx + 6, hy - 27], [hx + 18, hy - 17]], c.groove, 3) + whlFace(hx - 6, hy - 2, 1, c, { star: '#bffcff' });
    front += whlWag(wing(wl[0], wl[1], 150, false), wl[0], wl[1]);
    return {
      back, body, head, front,
      anc: { head: [hx - 6, hy - 34, 52], eyes: [hx - 6, hy - 2, 48], neck: [hx - 4, hy + 24, 50], back: [hx + 14, hy + 10, 56, 56], body: [hx + 30, hy + 46, 40, 44], halo: [hx - 6, hy - 42, 25] }
    };
  }

  /* ===== Dạng 4: Cá Voi Ngân Hà khổng lồ uốn hình trăng khuyết ôm hành tinh ===== */
  function whlF4(c) {
    const hx = 78, hy = 90, rx = 37, ry = 31, gal = lin(c.g1, c.g2, c.g3);
    let back = '', body = '', head = '', front = '';
    const T = whlTube([[90, 104], [100, 134], [122, 158], [148, 162], [167, 142], [173, 112], [169, 82]], [32, 30, 25, 19, 12, 7.5, 5]);
    const fl = whlFluke(T, 24, 20, gal, 5, 4);
    // Hào quang
    back += whlFx(`<circle cx="118" cy="112" r="84" fill="${c.aura}" opacity=".15"/><circle cx="118" cy="112" r="66" fill="none" stroke="${c.groove}" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round" opacity=".55"/>`);
    // Cánh ánh sáng trên (sau đầu)
    back += whlWag(whlWing(62, 78, 232, 72, 40, 5, c, -1), 62, 78, .5);
    // Hành tinh có vành được ôm trong vòng cung
    back += whlPlanet(136, 112, 12, c.pl, c.pls, c.ring, -16, 2.8);
    // Vây đuôi
    back += whlWag(fl.d + ln(`M${whlP(fl.q(4, -6))} Q${whlP(fl.q(12, -16))} ${whlP(fl.q(19, -22))} M${whlP(fl.q(4, 6))} Q${whlP(fl.q(12, 16))} ${whlP(fl.q(19, 22))}`, '#ffffff', 2, 'opacity=".7"') +
      whlStar(...fl.q(14, -12), 2.8, '#fffbe0') + whlStar(...fl.q(15, 13), 2.4, '#ffd6fb'), 170, 92);
    // Thân trong suốt: nền thiên hà + tinh vân + dải ngân hà + hành tinh nhỏ
    body += bl(whlBodyD(hx, hy, rx, ry, 44, T), gal);
    body += whlNeb(T, [[.18, -.3, 16, 13, c.neb1, .5], [.4, -.35, 19, 11, c.neb2, .45], [.6, -.2, 15, 9, c.neb1, .45], [.8, -.15, 11, 7, c.neb2, .5], [.3, -.25, 9, 6, '#ffffff', .25], [.52, -.4, 8, 5, '#ffffff', .2]]);
    body += pa(whlBand(T, .06, .97, (u, w) => -w * (.05 + .15 * u), (u, w) => -w * (.05 + .15 * u) - w * .5 * whlBell(u, .6)), '#f4ecff', 0, 'opacity=".3"');
    body += ln(whlLine(T, .08, .95, (u, w) => -w * (.3 + .12 * u)), '#ffffff', 2, 'opacity=".6"');
    body += [.12, .23, .31, .45, .63, .74, .85, .92].map((t, i) => whlDot(...T.pt(t, -.1 - (i * 37 % 7) / 9), .9 + (i % 3) * .5, i % 4 ? '#ffffff' : '#bffcff')).join('');
    body += whlPlanet(...T.pt(.36, -.48), 6, '#ffd36a', '#e08a00', '#fff3c4', -20, 2) + whlPlanet(...T.pt(.68, -.5), 4.6, '#ff8fe6', '#b03ab8', '#ffd6fb', 15, 1.8);
    body += whlConst([T.pt(.2, -.78), T.pt(.26, -.5), T.pt(.47, -.82), T.pt(.53, -.55)], c.groove, 3.2) + whlGalaxy(...T.pt(.56, -.2), 11, -20);
    // Bụng bạc phía trong vòng cung + rãnh sáng
    body += pa(whlBand(T, 0, .9, (u, w) => w - .8, (u, w) => w - .8 - w * .48 * whlBell(u, .45)), cel(c.l, c.ls), 0);
    body += ln([.2, .36].map(k => whlLine(T, .03, .82, (u, w) => w - w * k * whlBell(u, .45) * 1.2)).join(''), c.groove, 2.2);
    body += whlHeadDeco(hx, hy, rx, ry, 44, c, { neb: c.neb1 });
    // Viền sáng lưng + vệt bóng kính
    body += ln(whlLine(T, .1, .97, (u, w) => -w + 2.2), c.rim, 3) + ln(whlLine(T, .3, .62, (u, w) => -w + 7), '#ffffff', 2.4, 'opacity=".55"');
    body += whlDot(hx + 18, hy - 22, 1.3) + whlDot(hx + 26, hy - 4, 1.1) + whlStar(hx + 22, hy - 12, 2.8, '#fffbe0') + whlStar(hx - 22, hy - 4, 2.2, '#ffffff') + hl(hx - 14, hy - 22, 8, 4, -60);
    // Mặt + vương miện trăng khuyết (sừng hướng lên, ngọc sao giữa)
    head += whlFace(hx - 4, hy - 2, 1.04, c, { glow: c.groove, star: '#ffffff' });
    const cy = hy - 40;
    head += pa(`M${P(hx - 21, cy - 6)} A21,21 0 0 0 ${P(hx + 21, cy - 6)} A28,28 0 0 1 ${P(hx - 21, cy - 6)} Z`, 'url(#gGold)', 3.5) + ln(`M${P(hx - 14, cy + 7)} Q${P(hx, cy + 12)} ${P(hx + 14, cy + 7)}`, '#fff6b0', 2, 'opacity=".8"');
    head += pa(`M${P(hx, cy - 15)} L${P(hx + 6.5, cy - 3)} L${P(hx, cy + 6)} L${P(hx - 6.5, cy - 3)} Z`, cel('#e6fdff', '#4fc8f0'), 3) + ci(hx - 11, cy + 2, 2.6, '#ff8fe6', 1.6) + ci(hx + 11, cy + 2, 2.6, '#ff8fe6', 1.6) +
      whlFx(whlStar(hx - 22, cy - 12, 4.4, '#ffffff', 'twinkle') + whlStar(hx + 22, cy - 12, 4.4, '#ffffff', 'twinkle', .6)) + whlStar(hx, cy - 22, 3, '#fffbe0');
    // Cánh ánh sáng dưới (trước thân)
    front += whlWag(whlWing(60, 118, 152, 64, 38, 5, c, 1), 60, 118);
    // Sao băng, sao bay
    front += whlFx(whlShoot(168, 24, 34, 160, c.groove, 0) + whlShoot(40, 182, 24, 200, '#ffd6fb', .9) + [[132, 48, 4], [192, 166, 3.4], [118, 132, 3.4], [150, 86, 3]].map(([x, y, r], i) => whlStar(x, y, r, i % 2 ? '#ffd6fb' : '#fffbe0', 'twinkle', i * .45)).join(''));
    return {
      back, body, head, front,
      anc: { head: [hx - 4, cy + 6, 52], eyes: [hx - 4, hy - 2, 50], neck: [hx - 2, hy + 27, 52], back: [hx + 8, hy + 4, 56, 62], body: [hx + 24, hy + 56, 42, 40], halo: [hx - 4, cy - 26, 25] }
    };
  }

  PET_SPECS.ep_whale = {
    el: 'shadow',
    c: {
      b: '#9a88ff', s: '#5d48d8', d: '#3a2a9e', l: '#f4f1ff', ls: '#c6bbff', w: '#b9a8ff', ws: '#6d56e0',
      neb1: '#ff6ae6', neb2: '#4ff0ff', groove: '#8ff7ff', rim: '#b4f9ff', spray: '#bff8ff',
      i1: '#2a1c8c', i2: '#4f8dff', i3: '#a8fcff', cheek: '#ff8fd6', mouth: '#c2286e', tongue: '#ff8fb8'
    },
    c4: {
      b: '#7a6cff', s: '#3d2db8', g1: '#7590ff', g2: '#5a3ae0', g3: '#3c20a8', l: '#eef0ff', ls: '#b3b4f2',
      w1: '#e6fbff', w2: '#8fd8ff', w3: '#9a6cff', aura: '#8a6cff', rim: '#8ff7ff', i3: '#d8ffff', pl: '#ffd36a', pls: '#e0862a', ring: '#fff3c4'
    },
    draw(f, g, c) { return [null, whlF1, whlF2, whlF3, whlF4][f](c); }
  };
})();

/* ===================== SỬ THI: Ngựa Sắt Thánh Gióng (ep_ironhorse, hệ Thép) ===================== */
// Ngựa con sắt tròn trịa → ngựa non bờm lá sắt → chiến mã bờm lửa phi nước đại → thần mã chồm phun lửa, tre ngà rực lửa.
// Cần: gfx.js (pa, el, ci, ln, hl, bl, P, f1, cel, flame, eye, capsule, rivet, OL) và pets.js (PET_SPECS, PET_LITE).
// Đặt sau pets.js (IIFE chạy ngay). Hàm phụ nằm trong IIFE, tiền tố ihs, không thêm tên toàn cục.
// draw(f, g, c) giữ chữ ký chung; g bị bỏ qua vì mỗi dạng có hình học riêng. Vị trí đầu trả qua anc.halo = [x, y, rx].
(() => {
  const R = Math.PI / 180, GOLD = 'url(#gGold)', CORE = '#fff59a';
  const BR = '#e0913f', BRS = '#9c521c', RED = '#d6283a', REDS = '#8a1230';
  // Đổi mọi cặp "u,v" trong path cục bộ sang tọa độ thật (chỉ dùng lệnh tuyệt đối M L Q C Z); u < 0 nhân thêm L (độ dài mõm)
  const ihsM = (d, x, y, k, L = 1) => d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_, a, b) => P(x + a * (a < 0 ? L : 1) * k, y + b * k));
  const ihsE = (cx, cy, rx, ry, a = 0) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}"${a ? ` transform="rotate(${f1(a)} ${f1(cx)} ${f1(cy)})"` : ''}/>`;
  const Pi = (x, y) => Math.round(x) + ',' + Math.round(y); // tọa độ nguyên cho lửa, tre, trống (đỡ nặng chuỗi)
  const ihsCirc = (cx, cy, r) => `M${P(cx - r, cy)}a${f1(r)},${f1(r)} 0 1 0 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1 0 ${f1(-2 * r)},0`;
  const ihsG = (s, cls, x, y, dl = 0) => `<g class="${cls}" style="transform-box:view-box;transform-origin:${f1(x)}px ${f1(y)}px${dl ? `;animation-delay:-${dl}s` : ''}">${s}</g>`;

  /* ----- Hoa văn trống đồng Đông Sơn ----- */
  // Mặt trời giữa trống: n tia nhọn từ r0 ra r1
  function ihsSun(cx, cy, r0, r1, n, fill, sw = 2, a0 = -90) {
    let d = '';
    for (let i = 0; i < n; i++) {
      const a = (a0 + i * 360 / n) * R, w = 180 / n * R * .62;
      d += `M${P(cx + r0 * Math.cos(a - w), cy + r0 * Math.sin(a - w))}L${P(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a))}L${P(cx + r0 * Math.cos(a + w), cy + r0 * Math.sin(a + w))}Z`;
    }
    return pa(d + ihsCirc(cx, cy, r0 * 1.05), fill, sw);
  }
  // Vòng tròn có chấm nối tiếp tuyến, xếp theo đoạn thẳng
  function ihsTanRow(x0, y0, x1, y1, n, r, col, w = 1.8) {
    let d = '', dots = '';
    const ux = (x1 - x0) / (n - 1), uy = (y1 - y0) / (n - 1), L = Math.hypot(ux, uy), nx = -uy / L * r, ny = ux / L * r;
    for (let i = 0; i < n; i++) {
      const x = x0 + ux * i, y = y0 + uy * i;
      d += ihsCirc(x, y, r); dots += ihsCirc(x, y, r * .32);
      if (i < n - 1) d += `M${P(x + nx, y + ny)}L${P(x + ux - nx, y + uy - ny)}`;
    }
    return ln(d, col, w) + `<path d="${dots}" fill="${col}"/>`;
  }

  /* ----- Bộ phận ----- */
  // Chân ngựa theo khớp: khối gộp viền, móng đồng ở cuối
  function ihsLeg(pts, w, fill, o = {}) {
    let sh = '';
    for (let i = 0; i < pts.length - 1; i++) sh += `<path d="${capsule(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], w * (i ? 1 : (o.top || 1.3)), w)}"/>`;
    const [a, b] = pts.slice(-2), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) / R - 90, hw = w * 1.08;
    let s = bl(sh, fill, 4.5);
    const hoof = pa(`M${P(-hw, -w * .7)} L${P(hw, -w * .7)} L${P(hw * 1.18, w * .62)} Q0,${f1(w * .8)} ${P(-hw * 1.18, w * .62)} Z`, o.hoof || cel(BR, BRS), 3.5) +
      (o.band ? ln(`M${P(-hw * 1.02, -w * .2)} L${P(hw * 1.02, -w * .2)}`, o.band, 2.4) : '');
    s += `<g transform="translate(${f1(b[0])} ${f1(b[1])}) rotate(${f1(ang)})">${hoof}</g>`;
    if (o.rivet) s += o.rivet.map(i => rivet(pts[i][0], pts[i][1], 2)).join('');
    return s;
  }
  // Lá sắt: gốc (x, y), dài L, rộng W, góc a (độ)
  function ihsPlate(x, y, L, W, a, fill, edge, sw = 3.5) {
    const c = Math.cos(a * R), s = Math.sin(a * R), nx = -s * W, ny = c * W, tx = x + c * L, ty = y + s * L;
    return pa(`M${P(x + nx * .5, y + ny * .5)} Q${P(x + c * L * .45 + nx, y + s * L * .45 + ny)} ${P(tx, ty)} Q${P(x + c * L * .5 - nx * .8, y + s * L * .5 - ny * .8)} ${P(x - nx * .5, y - ny * .5)} Z`, fill, sw) +
      (edge ? ln(`M${P(x + c * L * .25 + nx * .3, y + s * L * .25 + ny * .3)} Q${P(x + c * L * .5 + nx * .5, y + s * L * .5 + ny * .5)} ${P(x + c * L * .88, y + s * L * .88)}`, edge, 2) : '');
  }
  // Lưỡi lửa chĩa theo góc a (độ; -90 = lên), gốc (x, y), cao h, rộng w, cong t
  const ihsTongue = (x, y, h, w, a, t = 0, core = true, sw = 3.5) => `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a + 90)})">` + flame(0, 0, h, w, t, core, sw) + `</g>`;
  // Khói phì từ mũi
  const ihsPuff = (x, y, r, dl) => `<g class="smoke" style="animation-delay:-${dl}s">` + bl(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/><circle cx="${f1(x - r * .8)}" cy="${f1(y + r * .3)}" r="${f1(r * .7)}"/><circle cx="${f1(x + r * .6)}" cy="${f1(y + r * .45)}" r="${f1(r * .62)}"/>`, '#e9e5fa', 2.6) + ci(x - r * .25, y - r * .3, r * .28, '#fff', 0) + `</g>`;
  // Lửa phun dài (chĩa sang trái), gốc tại khóe miệng; a > 0 hất lên
  function ihsBreath(x, y, k, a) {
    const L = (d, fill, sw) => pa(ihsM(d, 0, 0, k), fill, sw);
    return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(a)})"><g class="flame">` +
      L('M0,0 C-8,-5 -18,-10 -30,-13 C-34,-21 -44,-22 -46,-15 C-54,-17 -60,-9 -55,-3 C-62,2 -58,11 -50,10 C-49,17 -39,19 -35,12 C-22,11 -9,5 0,0 Z', '#ff4a1a', 3.5) +
      L('M-4,0 C-12,-4 -21,-7 -32,-8 C-37,-13 -44,-11 -44,-7 C-50,-7 -52,-1 -48,2 C-50,7 -44,9 -40,6 C-28,6 -14,3 -4,0 Z', '#ffb21f', 0) +
      L('M-10,0 C-17,-2 -25,-3 -34,-3 C-38,-4 -40,0 -37,1.5 C-30,2.5 -18,1.5 -10,0 Z', CORE, 0) + `</g></g>`;
  }
  // Ngọn lửa liền khối mọc dọc xương sống B (bờm, đuôi): n lưỡi cong, cao h0 → h1 (+ bump ở giữa), ngả về sau lean độ; side = -1 lật phía
  function ihsFire(B, n, h0, h1, lean = 30, side = 1, sw = 4, bump = 0) {
    const pt = t => { const [x, y] = ihsBz(B, t), a = ihsBzA(B, t) * R, tx = Math.cos(a), ty = Math.sin(a); return { x, y, tx, ty, nx: ty * side, ny: -tx * side }; };
    const off = Math.tan(lean * R);
    const lay = (k, ins, fill, w) => {
      let d = '';
      for (let i = 0; i < n; i++) {
        const a = pt(i / n), b = pt((i + 1) / n), tm = (i + .5) / n, q = pt(tm), bw = Math.hypot(b.x - a.x, b.y - a.y);
        const h = (h0 + (h1 - h0) * tm + bump * Math.sin(tm * Math.PI)) * k * (i % 2 ? .82 : 1), o = h * off;
        const F = (u, v) => Pi(a.x + q.tx * u + q.nx * v, a.y + q.ty * u + q.ny * v), u0 = bw * ins, u1 = bw * (1 - ins);
        d += `${i ? 'L' : 'M'}${F(u0, 0)}C${F(u0 - bw * .45, h * .55)} ${F(bw * .1 + o * .55, h * .86)} ${F(bw * .4 + o, h)}C${F(bw * .62 + o * .4, h * .55)} ${F(u1 + bw * .35, h * .5)} ${F(u1, 0)}`;
      }
      return pa(d + 'Z', fill, w);
    };
    return lay(1, 0, '#ff5a1f', sw) + lay(.7, .12, '#ffa21f', 0) + `<g class="flick">` + lay(.4, .26, CORE, 0) + `</g>`;
  }
  // Tre ngà: thân vàng ngà sọc xanh, đốt phình, ngọn vát nhọn; lá và lửa liếm bên thân
  function ihsBamboo(x0, y0, x1, y1, w, n, fire, leaves = []) {
    const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy * w / 2, ny = ux * w / 2;
    const at = t => [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
    let s = pa(`M${Pi(x0 - nx, y0 - ny)}L${Pi(x1 - nx, y1 - ny)}L${Pi(x1 + nx + ux * w * 1.6, y1 + ny + uy * w * 1.6)}L${Pi(x0 + nx, y0 + ny)}Z`, cel('#ffe27a', '#e0aa2e', .55), 3.5);
    s += pa(`M${Pi(x1 - nx, y1 - ny)}L${Pi(x1 + nx + ux * w * 1.6, y1 + ny + uy * w * 1.6)}L${Pi(x1 + ux * w * .4, y1 + uy * w * .4)}Z`, '#fff6d0', 2);
    s += ln(`M${Pi(x0 + nx * .5, y0 + ny * .5)}L${Pi(x1 + nx * .5, y1 + ny * .5)}`, '#8fc23a', 1.6) + ln(`M${Pi(x0 - nx * .45, y0 - ny * .45)}L${Pi(x1 - nx * .45, y1 - ny * .45)}`, '#fffbe0', w * .2);
    let nodes = '';
    for (let i = 1; i <= n; i++) { const [x, y] = at(i / (n + .5)); nodes += `M${Pi(x - nx * 1.2, y - ny * 1.2)}L${Pi(x + nx * 1.2, y + ny * 1.2)}`; }
    s += ln(nodes, OL, 6.5) + ln(nodes, '#d29a24', 2.6);
    // chùm lá tre: [t, góc, dài]
    s += leaves.map(([t, a, l]) => { const [x, y] = at(t); return pa([-28, 0, 26].map(da => { const c = Math.cos((a + da) * R), si = Math.sin((a + da) * R), ll = l * (da ? .78 : 1); return `M${Pi(x, y)}Q${Pi(x + c * ll * .45 - si * ll * .3, y + si * ll * .45 + c * ll * .3)} ${Pi(x + c * ll, y + si * ll)}Q${Pi(x + c * ll * .45 + si * ll * .14, y + si * ll * .45 - c * ll * .14)} ${Pi(x, y)}Z`; }).join(''), cel('#d4ec5a', '#86b82e'), 2.4); }).join('');
    if (fire) { const [x, y] = at(fire[0]); s += `<g class="flame">` + ihsTongue(x + fire[2] * nx * 1.2, y + fire[2] * ny * 1.2, fire[1], fire[1] * .58, -90 + fire[2] * 14, -fire[2] * 3, true, 3) + `</g>`; }
    return s;
  }
  // Mặt trống đồng làm hào quang sau lưng dạng 4: vành răng cưa, vòng tròn tiếp tuyến, vạch song song (tâm bị thân che nên bỏ mặt trời)
  function ihsDrum(cx, cy, r) {
    if (PET_LITE) return '';
    const g = '#ffc23a', C = (rr) => `M${Pi(cx - rr, cy)}a${Math.round(rr)},${Math.round(rr)} 0 1 0 ${Math.round(2 * rr)},0a${Math.round(rr)},${Math.round(rr)} 0 1 0 ${-Math.round(2 * rr)},0`;
    let zig = '', comb = '', tan = '', dots = '';
    for (let i = 0; i <= 56; i++) { const a = i * 180 / 28 * R, rr = r * (i % 2 ? .97 : .9); zig += (i ? 'L' : 'M') + Pi(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
    for (let i = 0; i < 48; i++) { const a = i * 7.5 * R; comb += `M${Pi(cx + r * .57 * Math.cos(a), cy + r * .57 * Math.sin(a))}L${Pi(cx + r * .63 * Math.cos(a), cy + r * .63 * Math.sin(a))}`; }
    for (let i = 0; i < 16; i++) {
      const a = i * 22.5 * R, b = a + 22.5 * R, rr = r * .76, cr = r * .065, x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
      tan += `M${Pi(x - cr, y)}a${f1(cr)},${f1(cr)} 0 1 0 ${f1(2 * cr)},0a${f1(cr)},${f1(cr)} 0 1 0 ${f1(-2 * cr)},0M${Pi(x + cr * Math.cos(a), y + cr * Math.sin(a))}L${Pi(cx + (rr - cr) * Math.cos(b), cy + (rr - cr) * Math.sin(b))}`;
      dots += `M${Pi(x, y)}h.1`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ff7a1f" opacity=".2"/><circle cx="${cx}" cy="${cy}" r="${r * .7}" fill="#ffc23a" opacity=".14"/><g opacity=".7"><g class="spin" style="transform-origin:${cx}px ${cy}px;animation-duration:60s">` +
      ln(C(r) + C(r * .88) + C(r * .66) + C(r * .54) + zig + comb, g, 2.2) + ln(tan, g, 2.2) + ln(dots, g, 4.4) + `</g></g>`;
  }
  /* ----- Đầu ngựa 3/4 nhìn sang trái: (x, y) = tâm sọ, k = tỷ lệ, L = độ dài mõm ----- */
  function ihsHead(x, y, k, f, c, o = {}) {
    const L = o.L ?? 1, M = d => ihsM(d, x, y, k, L), X = u => x + u * (u < 0 ? L : 1) * k, Y = v => y + v * k;
    const Er = o.ear ?? 1, ME = d => M(d.replace(/(-?[\d.]+),(-?[\d.]+)/g, (_, a, b) => a + ',' + f1(+b < -14 ? -14 + (+b + 14) * Er : +b)));
    let back = '', s = '';
    back += pa(ME('M-12,-15 Q-17,-27 -12,-35 Q-5,-26 -1,-18 Z'), cel(c.s, c.d), 4.5);
    const face = o.open
      ? 'M-6,-19 C-18,-16 -27,-6 -33,4 C-37,10 -38,14 -36,17 L-15,20 L-29,26 C-27,30 -23,32 -17,32 C-9,32 -4,29 2,27 C12,26 21,18 22,6 C22,0 20,-6 16,-10 Z'
      : 'M-6,-19 C-18,-16 -27,-6 -33,4 C-37,11 -38,17 -35,21 C-33,25 -29,26 -26,25 C-27,28 -24,31 -18,31 C-10,31 -4,28 2,26 C12,26 21,18 22,6 C22,0 20,-6 16,-10 Z';
    s += bl(`<path d="${ME('M2,-15 Q4,-28 11,-36 Q18,-24 15,-11 Z')}"/>` + ihsE(x, y, 22 * k, 20 * k) + `<path d="${M(face)}"/>`, cel(c.b, c.s), 5.2);
    s += pa(ME('M5,-16 Q7,-25 11,-30 Q14,-22 12,-14 Z'), cel(BR, BRS), 0, 'opacity=".75"');
    if (o.open) s += pa(M('M-36,17 L-15,20 L-29,26 Z'), '#5a0f22', 3) + ln(M('M-34,18.5 L-25,19.5'), '#fff', 1.6);
    else s += ln(M('M-33,25 Q-30,26.5 -26,25'), OL, 2.4);
    // lỗ mũi gần + xa
    const nx = X(-29), ny = Y(o.open ? 7 : 11), hot = f >= 3 ? '#ff6a1a' : OL;
    s += `<ellipse cx="${f1(nx)}" cy="${f1(ny)}" rx="${f1(3.4 * k)}" ry="${f1(2.1 * k)}" transform="rotate(-55 ${f1(nx)} ${f1(ny)})" fill="${hot}" stroke="${OL}" stroke-width="2"/>` + el(X(-35.5), Y(o.open ? 9 : 13), 1.2 * k, 2 * k, OL, 0);
    // gò má + ánh đồng viền hàm
    s += ln(M('M15,2 Q13,15 3,21'), c.s, 2.6, 'opacity=".85"') + ln(M('M-4,28 C4,27 11,22 16,15'), BR, 2.2, 'opacity=".9"');
    // mắt: gần to, xa nhỏ (nằm sát sống mũi)
    const er = [0, 9, 7.8, 7.4, 7.4][f] * k;
    const eo = f === 1 ? { iris: c.i, lid: 0, brow: false, pr: er * .6 } : { iris: c.i, lid: [0, 0, .5, .8, .92][f], skin: c.b, pr: er * .5, bw: 4.6 * k, ew: 3.5 };
    s += eye(X(-20), Y(-3.5), er * .62, er * .98, -1, eo) + eye(X(6), Y(-4), er, er * 1.12, 1, eo);
    if (f <= 2) s += el(X(12), Y(9), 5 * k, 3 * k, '#ff7a5c', 0, 'opacity=".5"');
    s += hl(X(-3), Y(-14), 7.5 * k, 3 * k, -20, .55);
    return { back, head: s, nose: [X(-37), Y(o.open ? 9 : 13)], mouth: [X(-16), Y(20)], X, Y, M, k };
  }
  // Bờm trán: ba lá cong rủ từ giữa hai tai xuống trán
  function ihsForelock(H, fill, edge) {
    return pa(H.M('M6,-22 C0,-24 -7,-21 -10,-12 C-6,-15 -3,-15 -1,-13 C-1,-17 2,-19 5,-17 C5,-20 8,-21 11,-19 C10,-22 8,-23 6,-22 Z'), fill, 3) + (edge ? ln(H.M('M3,-20 C-2,-19 -6,-16 -8,-13'), edge, 1.8) : '');
  }
  // Giáp mặt (chanfron) dọc sống mũi + đĩa trán hoa văn mặt trời
  function ihsChanfron(H, fill, big) {
    return pa(H.M('M-1,-19 C-6,-18 -10,-14 -12,-9 L-25,4 C-27,7 -24,10 -22,8 L-8,-4 C-5,-8 -1,-11 3,-12 Z'), fill, 3) + ln(H.M('M-4,-15 C-7,-13 -9,-10 -10,-7 L-22,5'), big ? '#fff6b0' : '#ffc888', 1.6) +
      ci(H.X(-3), H.Y(-15), (big ? 6.4 : 5) * H.k, big ? cel('#ffd21f', '#d99500') : GOLD, 2.6) + ihsSun(H.X(-3), H.Y(-15), (big ? 1.9 : 1.5) * H.k, (big ? 5 : 3.9) * H.k, 10, big ? '#d6283a' : '#b8641e', 0);
  }
  // Ánh bóng kim loại: vệt sáng dài + chấm sáng gắt
  const ihsGloss = (x, y, rx, ry, a, col, op = .42) => `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${col}" opacity="${op}" transform="rotate(${a} ${f1(x)} ${f1(y)})"/>` + hl(x - rx * .45 * Math.cos(a * R), y - rx * .45 * Math.sin(a * R), rx * .32, ry * .55, a, .6);
  // Điểm trên đường Bézier bậc 3 + góc tiếp tuyến (độ)
  const ihsBz = (B, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * B[0][i] + 3 * u * u * t * B[1][i] + 3 * u * t * t * B[2][i] + t * t * t * B[3][i]); };
  const ihsBzA = (B, t) => { const a = ihsBz(B, Math.max(0, t - .02)), b = ihsBz(B, Math.min(1, t + .02)); return Math.atan2(b[1] - a[1], b[0] - a[0]) / R; };

  // Neo trang phục + vị trí đầu cho hào quang, tính từ hình học đầu (hx, hy, k, L) của dạng
  const ihsAnc = (hx, hy, k, L, neck, back, body) => ({
    head: [hx + 1, hy - 23 * k, 40], eyes: [hx + k * (6 - 20 * L) / 2, hy - 3.8 * k, 42], neck, back, body, halo: [hx + 2, hy - 33 * k, 18]
  });

  /* ----- 4 dạng ----- */
  const DR = {
    1(c) { // Ngựa con sắt tròn trịa: khớp đinh tán, mắt to tròn, phì khói
      let back = '', body = '', head = '', front = '';
      const coat = cel(c.b, c.s), far = cel(c.s, c.d), farHoof = cel(BRS, '#6e3a14'), mane = cel(c.l, c.s);
      back += ihsG([-62, -32, -4].map((a, i) => ihsPlate(152, 146, 17 - i * 2, 6.5, a, mane, BR, 3.5)).join('') + ci(152, 146, 4, GOLD, 2.2), 'pt', 152, 146);
      body += ihsLeg([[104, 162], [102, 182]], 5.8, far, { hoof: farHoof }) + ihsLeg([[138, 162], [139, 182]], 5.8, far, { hoof: farHoof });
      body += bl(ihsE(126, 152, 27, 19) + `<path d="${capsule(110, 146, 98, 120, 14, 12)}"/>`, coat);
      body += ihsGloss(122, 141, 15, 4, -8, c.l) + ln('M102,163 Q126,175 151,161', BR, 2.8, 'opacity=".9"');
      body += ln('M129,134 Q134,152 129,170', BR, 3) + [139, 152, 165].map((y, i) => rivet(130.5 + (i === 1 ? 2.2 : 1), y, 2)).join('');
      body += ihsLeg([[112, 164], [110, 183]], 6.5, coat, { band: GOLD, rivet: [0] }) + ihsLeg([[146, 162], [148, 183]], 6.5, coat, { band: GOLD, rivet: [0] });
      // bờm vảy sắt sau gáy
      back += [[119, 124, 6.5], [117, 111, 7.5], [113, 98, 8], [106, 86, 8.5]].map(([x, y, r]) => el(x, y, r * 1.05, r * .9, cel(c.p, c.ps), 3.5) + ln(`M${x - r * .6},${y + r * .3} Q${x},${y + r * .75} ${x + r * .6},${y + r * .3}`, BR, 1.8)).join('');
      const k = 1.25, hx = 80, hy = 97, H = ihsHead(hx, hy, k, 1, c, { L: .72, ear: .8 });
      back += H.back; head += H.head + ihsForelock(H, mane, BR);
      // vòng cổ đồng + mặt trống nhỏ
      head += pa('M92,126 Q103,136 116,130 L117,137 Q103,144 90,133 Z', cel(BR, BRS), 3) + ci(104, 141, 6.2, GOLD, 2.6) + ihsSun(104, 141, 1.8, 4.6, 8, '#b8641e', 0);
      if (!PET_LITE) front += ihsPuff(H.nose[0] - 6, H.nose[1] - 7, 4.2, .4) + ihsPuff(H.nose[0] - 11, H.nose[1] - 19, 5.4, 1.1) + ihsPuff(H.nose[0] - 6, H.nose[1] - 32, 3.6, 1.7);
      return { back, body, head, front, anc: ihsAnc(hx, hy, k, .72, [104, 134, 30], [124, 128, 48, 36], [106, 150, 24, 24]) };
    },
    2(c) { // Ngựa non sắt đứng vững: chân dài, bờm lá sắt, móng đồng
      let back = '', body = '', head = '', front = '';
      const coat = cel(c.b, c.s), far = cel(c.s, c.d), farHoof = cel(BRS, '#6e3a14'), mane = cel(c.p, c.ps);
      back += ihsG([34, 58, 82].map((a, i) => ihsPlate(158, 126, 36 - i * 5, 9, a, mane, BR, 3.5)).join(''), 'pt', 158, 126);
      body += ihsLeg([[112, 148], [114, 166], [111, 183]], 6, far, { hoof: farHoof }) + ihsLeg([[140, 144], [145, 164], [138, 183]], 6, far, { hoof: farHoof });
      body += bl(ihsE(128, 134, 33, 19, -3) + '<path d="M78,52 C100,56 116,84 132,114 L104,150 C96,132 90,114 76,98 Z"/>', coat);
      body += ihsGloss(124, 124, 20, 4.5, -4, c.l) + ihsGloss(100, 84, 14, 4, 52, c.l) + ln('M100,151 Q128,160 158,146', BR, 3, 'opacity=".9"') + ln(ihsCirc(148, 132, 6.5) + ihsCirc(148, 132, 3), BR, 2);
      body += ihsLeg([[101, 146], [98, 165], [99, 183]], 6.6, coat, { band: GOLD }) + ihsLeg([[150, 142], [158, 162], [151, 183]], 6.6, coat, { band: GOLD });
      body += ci(98, 165, 3.6, cel(BR, BRS), 2.2) + ci(158, 162, 3.6, cel(BR, BRS), 2.2);
      // dây ngực đồng + đĩa trống
      body += pa('M88,118 Q100,134 120,134 L120,141 Q97,143 84,124 Z', cel(BR, BRS), 3) + ci(100, 138, 7.5, GOLD, 3) + ihsSun(100, 138, 2.2, 5.6, 8, '#b8641e', 0);
      // bờm lá sắt dọc gáy
      const CR = [[78, 52], [100, 56], [116, 84], [132, 114]];
      for (let i = 5; i >= 0; i--) { const t = .08 + i * .15, [x, y] = ihsBz(CR, t); back += ihsPlate(x - 2, y + 2, 27 - i * 1.6, 10, ihsBzA(CR, t) - 62, mane, BR, 3.5); }
      const k = 1.18, hx = 64, hy = 70, H = ihsHead(hx, hy, k, 2, c, { L: .92 });
      back += H.back; head += H.head;
      head += pa(H.M('M-7,-11 C-12,-6 -18,0 -24,6 L-21,9 C-15,3 -9,-3 -3,-8 Z'), cel(BR, BRS), 2.4) + ihsForelock(H, mane, BR);
      if (!PET_LITE) front += ihsG(ci(H.nose[0] - 6, H.nose[1] - 4, 2.2, '#ffb21f', 1.4) + ci(H.nose[0] - 10, H.nose[1] - 11, 1.6, '#ff6a1a', 1.2), 'ember', H.nose[0], H.nose[1], .6) + ihsPuff(H.nose[0] - 9, H.nose[1] - 16, 4, 1.2);
      return { back, body, head, front, anc: ihsAnc(hx, hy, k, .92, [96, 124, 34], [126, 110, 56, 40], [100, 132, 28, 28]) };
    },
    3(c) { // Chiến mã sắt phi nước đại: bờm lửa, yên khắc trống đồng, móng tóe lửa
      let back = '', body = '', head = '', front = '';
      const coat = cel(c.b, c.s), far = cel(c.s, c.d), farHoof = cel(BRS, '#6e3a14');
      const k = 1.16, hx = 56, hy = 52, H = ihsHead(hx, hy, k, 3, c, { L: 1 });
      const TB = [[160, 106], [174, 104], [186, 98], [196, 84]];
      back += ihsG(ihsFire(TB, 4, 22, 14, 55, 1, 3.5) + ihsFire(TB, 4, 18, 10, 55, -1, 3.5), 'pt', 160, 106);
      body += ihsLeg([[96, 126], [86, 146], [100, 158]], 6, far, { hoof: farHoof }) + ihsLeg([[156, 118], [172, 140], [188, 150]], 6, far, { hoof: farHoof });
      back += ihsFire([[H.X(-2), H.Y(-21)], [82, 26], [104, 66], [122, 98]], 6, 24, 16, 44, 1, 3.5, 12);
      body += bl(ihsE(122, 114, 42, 21, -12) + ihsE(150, 110, 21, 20) + '<path d="M70,40 C90,46 104,72 120,96 L90,128 C80,112 72,98 62,84 Z"/>', coat);
      body += ihsGloss(102, 100, 16, 4.2, -20, c.l) + ihsGloss(86, 66, 12, 3.6, 48, c.l) + ln('M92,134 Q124,140 164,124', BR, 3.4, 'opacity=".9"');
      body += ln(ihsCirc(154, 118, 8) + ihsCirc(154, 118, 4), BR, 2.2) + ci(154, 118, 1.6, BR, 0);
      body += ihsLeg([[90, 124], [70, 136], [56, 150]], 6.4, coat, { band: GOLD }) + ihsLeg([[150, 124], [161, 152], [151, 183]], 6.8, coat, { band: GOLD });
      if (!PET_LITE) front += ihsG(ihsTongue(60, 154, 16, 10, 40, 2) + ihsTongue(190, 152, 14, 9, -20, 2), 'flick', 120, 150);
      // tấm phủ đỏ viền vòng tròn tiếp tuyến + yên vàng mặt trời
      body += pa('M104,96 L154,90 L156,116 Q150,124 142,118 Q136,128 128,122 Q120,130 112,124 Q104,128 106,118 Z', cel(RED, REDS), 3.5) + ihsTanRow(112, 116, 148, 110, 5, 3, '#ffd21f', 1.6) + ln('M106,102 L154,96', '#ffd21f', 2.2);
      body += pa('M106,96 Q106,80 116,84 Q128,92 140,86 Q152,78 154,90 Q146,102 128,102 Q112,103 106,96 Z', GOLD, 3.5) + ihsSun(129, 95, 2, 5, 10, '#b8641e', 0) + hl(114, 88, 4, 1.6, -30, .7);
      // giáp ngực đồng
      body += pa('M66,86 Q78,110 98,120 L92,131 Q70,121 59,95 Z', cel(BR, BRS), 3.5) + [[67, 99], [77, 112], [89, 122]].map(([x, y]) => rivet(x, y, 2)).join('');
      back += H.back; head += H.head + ihsChanfron(H, cel(BR, BRS), false);
      if (!PET_LITE) front += ihsG(ihsTongue(H.nose[0] + 1, H.nose[1], 12, 8, 196, 2), 'flick', H.nose[0], H.nose[1]);
      if (!PET_LITE) front += [[30, 112, 2.6], [178, 70, 2.2], [120, 52, 2]].map(([x, y, r], i) => `<g class="ember" style="animation-delay:-${i * .6}s">${ci(x, y, r, i % 2 ? '#ffd21f' : '#ff8a1f', 1.5)}</g>`).join('');
      return { back, body, head, front, anc: ihsAnc(hx, hy, k, 1, [78, 90, 34], [132, 90, 56, 34], [80, 108, 30, 30]) };
    },
    4(c) { // Thần mã sắt chồm hai chân sau, phun lửa, bờm đuôi thành lửa lớn, giáp vàng Đông Sơn, tre ngà rực lửa
      let back = '', body = '', head = '', front = '';
      const coat = cel(c.b, c.s), far = cel(c.s, c.d), farHoof = cel(BRS, '#6e3a14');
      const k = 1.06, hx = 70, hy = 46, H = ihsHead(hx, hy, k, 4, c, { L: 1, open: true });
      back += ihsDrum(114, 100, 88);
      back += ihsBamboo(160, 192, 182, 28, 9, 5, [.62, 30, 1], [[.46, -14, 30], [.82, 194, 26]]) + ihsBamboo(180, 192, 198, 98, 7, 3, 0, [[.62, -60, 22]]) + ihsBamboo(34, 192, 12, 104, 7.5, 3, [.42, 20, -1], [[.84, 204, 22], [.6, 160, 18]]);
      const TB = [[146, 134], [170, 140], [188, 124], [194, 94]];
      back += ihsG(ihsFire(TB, 4, 34, 22, 40, 1, 3.5) + ihsFire(TB, 3, 16, 10, 50, -1, 3.5), 'pt', 146, 134);
      body += ihsLeg([[124, 160], [132, 172], [120, 185]], 6.2, far, { hoof: farHoof }) + ihsLeg([[106, 116], [88, 96], [74, 104]], 5.2, far, { hoof: farHoof });
      back += ihsFire([[H.X(0), H.Y(-21)], [98, 22], [114, 54], [124, 88]], 6, 30, 22, 46, 1, 3.5, 14);
      body += bl(`<path d="${capsule(98, 106, 134, 146, 21, 24)}"/><path d="M84,30 C100,34 114,56 124,86 L96,120 C90,100 88,86 80,70 Z"/>`, coat);
      body += ihsGloss(110, 104, 16, 4.5, -48, c.l) + ihsGloss(100, 58, 12, 3.6, 60, c.l) + ln('M104,128 Q112,152 138,170', BR, 3.4, 'opacity=".9"') + ln('M86,74 Q88,96 96,116', BR, 2.6, 'opacity=".75"');
      body += pa('M112,62 Q118,70 121,78 L97,108 Q91,104 86,98 Z', GOLD, 3.5) + ihsTanRow(113, 70, 93, 98, 4, 2.6, '#b8641e', 1.4);
      body += ihsLeg([[142, 152], [156, 170], [144, 185]], 6.8, coat, { band: GOLD }) + ci(156, 170, 4.4, GOLD, 2.4);
      // tấm phủ đỏ viền trống đồng + yên vàng
      body += pa('M116,94 L146,124 L142,146 Q132,140 124,146 Q118,136 110,136 L108,116 Z', cel(RED, REDS), 3.5) + ihsTanRow(114, 132, 136, 138, 4, 3, '#ffd21f', 1.6) + ln('M114,106 L142,134', '#ffd21f', 2.2);
      body += pa('M114,92 Q116,80 124,81 Q128,94 136,100 Q146,104 151,108 Q156,118 146,122 Q132,112 114,92 Z', GOLD, 3.5) + hl(120, 86, 3.6, 1.6, 60, .7);
      // giáp ngực vàng hình khiên + mặt trời trống đồng + tua đỏ
      body += pa('M82,78 C72,88 74,106 86,116 C96,110 100,98 98,88 C95,82 89,78 82,78 Z', cel('#ffd21f', '#d99500'), 3.5) + ci(86, 97, 8.6, GOLD, 3) + ihsSun(86, 97, 2.5, 7.2, 12, '#c8501e', 0);
      body += ihsLeg([[100, 124], [76, 110], [62, 122]], 5.6, coat, { band: GOLD }) + ci(76, 110, 4.2, GOLD, 2.4);
      back += H.back; head += H.head + ihsChanfron(H, GOLD, true);
      head += ihsBreath(H.mouth[0], H.mouth[1], .84, 12);
      if (!PET_LITE) front += spark4(78, 82, 5, '#fff6b0', 1.6, 'twinkle', 0) + spark4(124, 78, 4, '#ffffff', 1.4, 'twinkle', .7);
      if (!PET_LITE) front += [[30, 28, 3.2], [154, 22, 2.6], [40, 150, 2.8], [182, 168, 2.4]].map(([x, y, r], i) => `<g class="ember" style="animation-delay:-${i * .5}s">${ci(x, y, r, i % 2 ? '#ffd21f' : '#ff8a1f', 1.6)}</g>`).join('');
      return { back, body, head, front, anc: ihsAnc(hx, hy, k, 1, [92, 84, 32], [128, 96, 44, 48], [88, 104, 28, 34]) };
    }
  };

  PET_SPECS.ep_ironhorse = {
    el: 'metal',
    c: { b: '#46447e', s: '#24214a', d: '#191636', l: '#9ea2ec', p: '#8c8fd6', ps: '#4a4c8e', i: '#ff9a1f' },
    c4: { b: '#423e70', s: '#1f1b3e', d: '#15122b', l: '#8a86c8', i: '#ffd21f' },
    draw(f, g, c) {
      const C = f === 1 ? Object.assign({}, c, { b: '#5b578a', s: '#35315f', l: '#8783b8' }) : c;
      return DR[f](C);
    }
  };
})();
/* ---------- HẾT SỬ THI ---------- */

/* ----- Hình tạm cho pet Sử thi chưa có hình: trứng phát sáng (chỉ dùng khi thiếu khối thật ở trên) ----- */
(function () {
  const EGG_COL = {
    fire: ['#ffd0a0', '#ff6a2b', '#ffd21f'], ice: ['#e8fbff', '#33b5e8', '#ffffff'], thunder: ['#fff3a0', '#7a4cff', '#33e1ff'], stone: ['#fff6e0', '#c99a6b', '#5dffc0'],
    forest: ['#e6ffd0', '#2f9a3e', '#ff5fa2'], shadow: ['#e6d0ff', '#5a1fb0', '#33e1ff'], metal: ['#f4f7fc', '#56698c', '#ff2e4a']
  };
  function eggSpec(elm) {
    const [l, d, a] = EGG_COL[elm];
    return {
      el: elm, c: { b: l, s: d },
      draw(f) {
        const h = 74 + f * 16, w = h * .78, top = GROUND - h, cy = GROUND - h * .48;
        const egg = `M100,${f1(top)} C${f1(100 + w * .6)},${f1(top)} ${f1(100 + w * .58)},${f1(GROUND - h * .3)} ${f1(100 + w * .5)},${f1(GROUND - h * .16)} C${f1(100 + w * .38)},${f1(GROUND)} ${f1(100 - w * .38)},${f1(GROUND)} ${f1(100 - w * .5)},${f1(GROUND - h * .16)} C${f1(100 - w * .58)},${f1(GROUND - h * .3)} ${f1(100 - w * .6)},${f1(top)} 100,${f1(top)} Z`;
        let back = '';
        if (!PET_LITE) {
          let rays = '';
          for (let i = 0; i < 12; i++) { const a0 = (i * 30 - 6) * Math.PI / 180, a1 = (i * 30 + 6) * Math.PI / 180; rays += `<path d="M100,${f1(cy)} L${P(100 + 110 * Math.cos(a0), cy + 110 * Math.sin(a0))} L${P(100 + 110 * Math.cos(a1), cy + 110 * Math.sin(a1))} Z" fill="${i % 2 ? '#fff6b0' : a}"/>`; }
          back += `<circle cx="100" cy="${f1(cy)}" r="${f1(w * .9)}" fill="${a}" opacity=".2"/><g opacity=".35"><g class="spin" style="transform-origin:100px ${f1(cy)}px">${rays}</g></g>`;
        }
        let body = pa(egg, cel(l, d, .58), 5.5);
        body += `<path d="M${f1(100 - w * .5)},${f1(cy + 4)} Q100,${f1(cy - 10)} ${f1(100 + w * .5)},${f1(cy + 4)}" fill="none" stroke="${OL}" stroke-width="9"/><path d="M${f1(100 - w * .5)},${f1(cy + 4)} Q100,${f1(cy - 10)} ${f1(100 + w * .5)},${f1(cy + 4)}" fill="none" stroke="url(#gGold)" stroke-width="5"/>`;
        for (let k = 0; k < f + 2; k++) { const ang = (k / (f + 2)) * Math.PI * 2, x = 100 + Math.cos(ang) * w * .26, y = cy - h * .22 + Math.sin(ang) * h * .14; body += spark4(x, y, 4 + f, k % 2 ? '#fff6b0' : a, 1.8); }
        body += hl(100 - w * .22, top + h * .2, w * .12, h * .07, -25, .7);
        const front = PET_LITE ? '' : spark4(100 + w * .62, top + h * .1, 7, '#fff', 2, 'twinkle', 0) + spark4(100 - w * .66, cy, 6, '#fff6b0', 2, 'twinkle', .6);
        return { back, body, head: '', front, anc: { head: [100, top + 6, w * .7], eyes: [100, top + h * .3, w * .6], neck: [100, cy - 6, w * .6], back: [100, top + h * .3, w * .8, h * .55], body: [100, cy + h * .14, w * .7, h * .5], halo: [100, top - 12, w * .32] } };
      }
    };
  }
  ECON.epics.forEach(([id, el]) => { if (!PET_SPECS[id]) PET_SPECS[id] = eggSpec(el); });
})();
