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
PET_SPECS.wolf = {
  el: 'fire',
  c: { b: '#ff6a2b', s: '#c2380f', l: '#ffe6c2', d: '#7a1f08', i: '#ffb21f', a: '#3a2370', a2: '#26174f' },
  c4: { b: '#f24a1b', s: '#991d08', l: '#ffd9a8', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Đuôi lửa
    back += fireTail(g, 30 + f * 13);
    if (f >= 4) back = auraBack('fire', g) + flameMane(g, 7, 30) + back;
    body += legs(g, c, { claws: f >= 3 }) + torso(g, c);
    body += pa(`M${P(100 - g.sw * .6, g.sy - 3)} L${P(100 - g.sw * .32, g.sy + 12 + f * 2)} L${P(100 - g.sw * .14, g.sy + 5)} L${P(100, g.sy + 18 + f * 3)} L${P(100 + g.sw * .14, g.sy + 5)} L${P(100 + g.sw * .32, g.sy + 12 + f * 2)} L${P(100 + g.sw * .6, g.sy - 3)} Z`, c.l, 3.5);
    if (f === 2) body += flame(100, g.sy + 38, 18, 13, 1, true, 3);
    if (f >= 3) body += chestPlate(g, c.a, c.a2, flame(100, g.sy + 30 + f, 16 + f * 2, 12 + f, 1, true, 3), { trim: '#ffb21f' });
    body += arms(g, c, { claws: f >= 2, band: f === 2 ? c.a : null });
    if (f >= 3) body += pads(g, c.a, c.a2, { spike: f >= 4, trim: '#ffb21f' });
    // Đầu
    const eh = 26 + f * 7, ew = 20 + f * 2;
    const L = earPointy(100 - hrx * .6, hy - hry * .5, -1, eh, ew, -12, c.b, '#ffcf3f');
    const R = earPointy(100 + hrx * .6, hy - hry * .5, 1, eh, ew, -12, c.b, '#ffcf3f');
    let fl = '';
    for (const sd of [-1, 1]) fl += `<path d="M${P(100 + sd * hrx * .8, hy - 2)} L${P(100 + sd * (hrx + 7 + f * 2.5), hy + 6)} L${P(100 + sd * (hrx - 1), hy + 12)} L${P(100 + sd * (hrx + 5 + f * 2.5), hy + 20)} L${P(100 + sd * hrx * .7, hy + hry * .7)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>${fl}`, cel(c.b, c.s));
    head += L.inner + R.inner;
    // Mặt sáng phía dưới mắt
    head += pa(`M${P(100 - hrx * .74, hy + 10)} Q${P(100 - hrx * .3, hy + 4)} ${P(100, hy + 9)} Q${P(100 + hrx * .3, hy + 4)} ${P(100 + hrx * .74, hy + 10)} Q${P(100 + hrx * .66, hy + hry * .92)} ${P(100, hy + hry * .98)} Q${P(100 - hrx * .66, hy + hry * .92)} ${P(100 - hrx * .74, hy + 10)} Z`, c.l, 0);
    // Mào lửa
    const ch = 16 + f * 9;
    if (f >= 3) head += flame(100 - 14 - f, hy - hry * .66, ch * .66, 13 + f * 2, -4, true, 4) + flame(100 + 15 + f, hy - hry * .64, ch * .6, 12 + f * 2, 5, true, 4);
    head += flame(100 + 1, hy - hry * .76, ch, 17 + f * 4, 3, true, 4.5);
    head += snout(100, hy + hry * .48, hrx * .4, hry * .3, '#fff3df');
    head += grin(100, hy + hry * .7, hrx * .27, f);
    head += eyes2(100, hy - 4, hrx * .41, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .55, hy - hry * .5, hrx * .2, 4.5);
    if (f >= 4) front += motes('fire', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .8 }) };
  }
};
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
function petInner(id, f = 1, o = {}) {
  const key = id + '|' + f + '|' + JSON.stringify(o.eq || {}) + '|' + (o.sil ? 1 : 0) + (o.lite ? 'L' : '');
  if (PET_CACHE.has(key)) return PET_CACHE.get(key);
  const prevLite = PET_LITE; PET_LITE = !!o.lite;
  const g = RIG[f], p = petParts(id, f), eq = o.eq || {};
  const W = typeof wearSVG === 'function' ? wearSVG : () => '';
  let s = groundShadow(g);
  s += `<g class="pb">`;
  s += W('fxb', eq.fx, p.anc, g, id) + W('back', eq.back, p.anc, g, id);
  s += p.back + p.body + W('body', eq.body, p.anc, g, id) + W('neck', eq.neck, p.anc, g, id);
  s += `<g class="ph">` + p.head + W('eyes', eq.eyes, p.anc, g, id) + W('head', eq.head, p.anc, g, id) + `</g>`;
  s += p.front + W('fxf', eq.fx, p.anc, g, id) + `</g>`;
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

PET_SPECS.dragon = {
  el: 'fire',
  c: { b: '#ff4a3d', s: '#b3171f', l: '#ffd36b', ls: '#e09a2a', d: '#6e0b1f', i: '#ffd21f', mem: '#ff9a3d', bone: '#8a0d1d' },
  c4: { b: '#e3262e', s: '#860c1c', mem: '#ff7a1f', bone: '#5c0716', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    back += tailBack(g, 34 + f * 8, 12 + f * 2, c.b, (x, y) => pa(`M${P(x - 9, y + 4)} L${P(x + 4, y - 14 - f * 2)} L${P(x + 12, y + 6)} Q${P(x + 2, y + 1)} ${P(x - 9, y + 4)} Z`, 'url(#gFlame)', 4));
    if (f >= 2) { const sp = [0, 0, 28, 46, 66][f], h = [0, 0, 26, 44, 62][f]; back += batWing(g, -1, sp, h, c.bone, c.mem) + batWing(g, 1, sp, h, c.bone, c.mem); }
    if (f >= 4) back = auraBack('fire', g) + back;
    body += legs(g, c, { claws: true }) + torso(g, c);
    // Bụng vảy
    const by = g.sy + 6, bh = HIP - by - 4, bw = g.ww * .62;
    body += pa(`M${P(100 - bw, by)} Q${P(100, by - 5)} ${P(100 + bw, by)} L${P(100 + bw * .78, by + bh)} Q${P(100, by + bh + 4)} ${P(100 - bw * .78, by + bh)} Z`, cel(c.l, c.ls), 3.5);
    for (let i = 1; i < 4; i++) body += ln(`M${P(100 - bw * (1 - i * .06), by + bh * i / 4)} Q${P(100, by + bh * i / 4 + 3)} ${P(100 + bw * (1 - i * .06), by + bh * i / 4)}`, c.ls, 2.4);
    body += arms(g, c, { claws: true });
    if (f >= 3) body += pads(g, '#ffd21f', '#d48700', { spike: f >= 4, trim: '#fff6b0', spikeCol: '#fff1c9' });
    // Đầu
    const hl_ = 16 + f * 7;
    head += horn(100 - hrx * .5, hy - hry * .62, -1, 22 + f * 9, 7 + f, 'url(#gHorn)', .75) + horn(100 + hrx * .5, hy - hry * .62, 1, 22 + f * 9, 7 + f, 'url(#gHorn)', .75);
    let fins = '';
    for (const sd of [-1, 1]) fins += `<path d="M${P(100 + sd * hrx * .9, hy - 6)} L${P(100 + sd * (hrx + 10 + f * 3), hy - 14 - f * 2)} L${P(100 + sd * (hrx + 4), hy + 4)} L${P(100 + sd * (hrx + 9 + f * 2), hy + 6)} L${P(100 + sd * hrx * .85, hy + 14)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><ellipse cx="100" cy="${hy + hry * .52}" rx="${hrx * .72}" ry="${hry * .5}"/>${fins}`, cel(c.b, c.s));
    // Mào gai
    const n = f >= 3 ? 3 : 1;
    for (let i = 0; i < n; i++) { const x = 100 + (i - (n - 1) / 2) * 13; head += spike1(x, hy - hry * .88 + Math.abs(i - (n - 1) / 2) * 4, hl_ * (i === (n - 1) / 2 ? 1 : .7), 12, f >= 3 ? 'url(#gFlame)' : c.mem, 0, 4); }
    head += el(100, hy + hry * .6, hrx * .58, hry * .32, c.l, 0);
    head += el(100 - 9, hy + hry * .4, 3, 2.2, OL, 0) + el(100 + 9, hy + hry * .4, 3, 2.2, OL, 0);
    head += grin(100, hy + hry * .66, hrx * .32, f, { both: true });
    head += eyes2(100, hy - 6, hrx * .42, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid, slit: true });
    head += hl(100 - hrx * .55, hy - hry * .48, hrx * .2, 4.5);
    if (f >= 4) { head += crownSpikes(100, hy - hry * .95, hrx * .7); front += motes('fire', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};
// Vành gai vàng (dạng 4)
function crownSpikes(x, y, w) {
  return pa(`M${P(x - w * .55, y + 6)} L${P(x - w * .5, y - 8)} L${P(x - w * .25, y)} L${P(x, y - 16)} L${P(x + w * .25, y)} L${P(x + w * .5, y - 8)} L${P(x + w * .55, y + 6)} Q${P(x, y + 10)} ${P(x - w * .55, y + 6)} Z`, 'url(#gGold)', 4) +
    ci(x, y - 2, 3.6, '#ff3b4f', 2) + ci(x - w * .36, y + 2, 2.4, '#33e1ff', 1.6) + ci(x + w * .36, y + 2, 2.4, '#33e1ff', 1.6);
}

PET_SPECS.salamander = {
  el: 'fire',
  c: { b: '#ff6f91', s: '#c43a6a', l: '#ffd6e0', ls: '#f29ab4', i: '#ffd21f', crack: '#ff8a1f', rock: '#4b3a66', rocks: '#2a1f44' },
  c4: { b: '#ff4f7a', s: '#a8204f', crack: '#ffd21f' },
  draw(f, g, c) {
    const { hy, sy } = g, hrx = g.hrx * 1.14, hry = g.hry * .86;
    let back = '', body = '', head = '', front = '';
    back += tailBack(g, 30 + f * 9, 14 + f * 2, c.b, (x, y) => flame(x + 2, y + 8, 18 + f * 4, 13 + f * 2, 3, true, 4));
    if (f >= 4) back = auraBack('fire', g) + back;
    body += legs(g, c) + torso(g, c);
    body += belly(g, cel(c.l, c.ls), { k: .4, kx: .7 });
    // Vết nứt dung nham
    if (f >= 2) body += [[-1, .62], [1, .5]].map(([sd, k]) => el(100 + sd * g.sw * k, sy + 16 + k * 10, 3.5, 3.5, '#ff9ab4', 0)).join('');
    body += arms(g, c, {});
    if (f >= 3) body += pads(g, c.rock, c.rocks, { spike: f >= 4, trim: c.crack, spikeCol: c.crack, rivet: false });
    // Mang lửa hai bên đầu
    const gl = [0, 20, 26, 32, 38][f];
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) {
      const a = sd < 0 ? 180 + (-30 + i * 28) : (30 - i * 28), r = a * Math.PI / 180;
      const x = 100 + Math.cos(r) * hrx * .97, y = hy + Math.sin(r) * hry * .92 - 6;
      head += `<g transform="rotate(${f1(a + 90)} ${f1(x)} ${f1(y)})">${flame(x, y + 4, gl * (i === 1 ? 1.15 : 1), gl * .6, 0, true, 3.8)}</g>`;
    }
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    head += el(100 - hrx * .5, hy + hry * .3, 7, 4.5, '#ff9ab4', 0) + el(100 + hrx * .5, hy + hry * .3, 7, 4.5, '#ff9ab4', 0);
    if (f === 3) head += flame(100, hy - hry * .82, 20, 15, 2, true, 4);
    // Miệng cười rộng
    head += pa(`M${P(100 - hrx * .45, hy + hry * .38)} Q${P(100, hy + hry * .78)} ${P(100 + hrx * .45, hy + hry * .38)} Q${P(100, hy + hry * .55)} ${P(100 - hrx * .45, hy + hry * .38)} Z`, '#7a1030', 3.5);
    head += pa(`M${P(100 - hrx * .22, hy + hry * .5)} l3,6 l3,-5 M${P(100 + hrx * .14, hy + hry * .5)} l3,6 l3,-6`, '#fff', 2);
    head += el(100 - 5, hy + hry * .2, 2, 1.6, OL, 0) + el(100 + 5, hy + hry * .2, 2, 1.6, OL, 0);
    head += eyes2(100, hy - 4, hrx * .48, g.er * .95, g.er, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .5, hrx * .18, 4);
    if (f >= 4) { head += flame(100, hy - hry * .8, 26, 20, 2, true, 4); front += motes('fire', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry - 2, headW: hrx * 1.4 }) };
  }
};

PET_SPECS.phoenix = {
  el: 'fire',
  c: { b: '#ff3b2f', s: '#a80f19', l: '#ffd36b', ls: '#e0962a', i: '#ffd21f', beak: '#ffc21f', w: '#ff6a2b', ws: '#c2380f' },
  c4: { b: '#e8202e', s: '#7d0a18', w: '#ff4a1f', ws: '#9a1208', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Lông đuôi xòe hai bên
    const tl = 44 + f * 12;
    for (const a of [-8, -34, -146, -172]) {
      const r = a * Math.PI / 180, x = 100 + Math.cos(r) * 10, y = HIP - 6, tx = x + Math.cos(r) * tl, ty = y + Math.sin(r) * tl * .8;
      const nx = -Math.sin(r) * 11, ny = Math.cos(r) * 11;
      back += pa(`M${P(x, y)} Q${P((x + tx) / 2 + nx, (y + ty) / 2 + ny)} ${P(tx, ty)} Q${P((x + tx) / 2 - nx, (y + ty) / 2 - ny)} ${P(x, y)} Z`, 'url(#gFlame)', 4) + ci(tx, ty, 4.5 + f * .5, '#ffe14d', 2.2) + ci(tx, ty, 2, '#ff3b2f', 0);
    }
    if (f >= 2) { const sp = [0, 0, 30, 50, 70][f], h = [0, 0, 28, 46, 66][f]; back += featherWing(g, -1, sp, h, c.w, '#ffb21f', '#ffe14d') + featherWing(g, 1, sp, h, c.w, '#ffb21f', '#ffe14d'); }
    if (f >= 4) back = auraBack('fire', g) + back;
    body += legs(g, c, { feet: 'bird' }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .42, kx: .7 });
    body += ln(`M${P(92, g.sy + 22)} q8,6 16,0 M${P(90, g.sy + 32)} q10,6 20,0`, c.ls, 2.4);
    body += wingArms(g, c);
    // Đầu
    const cr = 18 + f * 8;
    for (const [dx, k, t] of [[-11, .72, -14], [11, .72, 14], [0, 1, 2]]) head += `<g transform="rotate(${t} ${100 + dx} ${hy - hry * .7})">${flame(100 + dx, hy - hry * .66, cr * k, 13 + f * 2, 0, true, 4)}</g>`;
    let ch = '';
    for (const sd of [-1, 1]) ch += `<path d="M${P(100 + sd * hrx * .85, hy)} L${P(100 + sd * (hrx + 8 + f * 2), hy + 8)} L${P(100 + sd * (hrx - 2), hy + 12)} L${P(100 + sd * (hrx + 4 + f * 2), hy + 20)} L${P(100 + sd * hrx * .6, hy + hry * .75)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${ch}`, cel(c.b, c.s));
    head += lowerFace(g, c.l, 12, .62);
    head += pa(`M${P(100 - 11, hy + 8)} Q${P(100, hy + 3)} ${P(100 + 11, hy + 8)} Q${P(100 + 6, hy + 20 + f * 2)} ${P(100, hy + 26 + f * 2)} Q${P(100 - 6, hy + 20 + f * 2)} ${P(100 - 11, hy + 8)} Z`, cel(c.beak, '#e08a00'), 4) + ln(`M${P(100 - 9, hy + 13)} Q${P(100, hy + 16)} ${P(100 + 9, hy + 13)}`, OL, 2.4) + hl(100 - 4, hy + 9, 3, 1.5, 0, .7);
    head += eyes2(100, hy - 6, hrx * .44, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .55, hy - hry * .5, hrx * .2, 4.5);
    if (f >= 4) { head += crownSpikes(100, hy - hry * .98, hrx * .8); front += motes('fire', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

/* ---------- BĂNG ---------- */
function iceCrest(x, y, n, h, sw = 3.5) {
  let s = '';
  for (let i = 0; i < n; i++) { const k = i - (n - 1) / 2, hh = h * (1 - Math.abs(k) * .28); s += crystal(x + k * h * .42, y + Math.abs(k) * 3, hh, h * .42, '#dffaff', '#5fc8f0', sw, k * 4); }
  return s;
}
PET_SPECS.penguin = {
  el: 'ice',
  c: { b: '#3557b8', s: '#1d3378', l: '#ffffff', ls: '#bfe3ff', i: '#33e1ff', beak: '#ffb21f', foot: '#ff9a1f', w: '#3557b8', ws: '#1d3378' },
  c4: { b: '#24409e', s: '#122364', i: '#bff4ff' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 3) back += [-1, 1].map(sd => crystal(100 + sd * (g.sw + 6), g.sy + 22, 22 + f * 6, 12, '#dffaff', '#5fc8f0', 3.5, sd * 10)).join('');
    if (f >= 4) back = auraBack('ice', g) + back;
    body += legs(g, Object.assign({}, c, { b2: c.b }), { feet: 'flat' }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .78, g.sy + 2)} Q${P(100, g.sy - 6)} ${P(100 + g.ww * .78, g.sy + 2)} Q${P(100 + g.ww * .95, HIP - 14)} ${P(100, HIP)} Q${P(100 - g.ww * .95, HIP - 14)} ${P(100 - g.ww * .78, g.sy + 2)} Z`, cel(c.l, c.ls), 0);
    if (f >= 3) body += chestPlate(g, '#bff4ff', '#4fb3e6', crystal(100, g.sy + 34 + f * 2, 18 + f * 2, 12, '#ffffff', '#33e1ff', 3), { trim: '#ffffff' });
    body += wingArms(g, c);
    // Đầu
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    head += pa(`M${P(100, hy - 2)} Q${P(100 - hrx * .25, hy - hry * .72)} ${P(100 - hrx * .58, hy - hry * .42)} Q${P(100 - hrx * .92, hy + 4)} ${P(100 - hrx * .62, hy + hry * .62)} Q${P(100, hy + hry * 1.02)} ${P(100 + hrx * .62, hy + hry * .62)} Q${P(100 + hrx * .92, hy + 4)} ${P(100 + hrx * .58, hy - hry * .42)} Q${P(100 + hrx * .25, hy - hry * .72)} ${P(100, hy - 2)} Z`, cel(c.l, c.ls), 3.5);
    head += pa(`M${P(100 - 12, hy + 10)} Q${P(100, hy + 4)} ${P(100 + 12, hy + 10)} L${P(100, hy + 24 + f)} Z`, cel(c.beak, '#e07a00'), 4) + ln(`M${P(100 - 9, hy + 13)} L${P(100 + 9, hy + 13)}`, OL, 2.2) + hl(97, hy + 9, 3, 1.4, 0, .7);
    head += eyes2(100, hy - 4, hrx * .38, g.er * .92, g.er, { skin: c.l, iris: c.i, lid: g.lid });
    head += el(100 - hrx * .62, hy + 14, 5, 3, '#ff9ab4', 0, 'opacity=".7"') + el(100 + hrx * .62, hy + 14, 5, 3, '#ff9ab4', 0, 'opacity=".7"');
    head += hl(100 - hrx * .58, hy - hry * .52, hrx * .2, 4.5);
    if (f === 1) head += crystal(100, hy - hry * .92, 13, 9, '#dffaff', '#5fc8f0', 3);
    else head += iceCrest(100, hy - hry * .88, f >= 4 ? 5 : 3, 14 + f * 5);
    if (f >= 4) front += motes('ice', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.tiger = {
  el: 'ice',
  c: { b: '#e8f6ff', s: '#9cc8ea', l: '#ffffff', ls: '#d4ecff', st: '#2b4f9e', i: '#33e1ff', ear: '#5fa8e6' },
  c4: { b: '#d6eeff', s: '#7fb2e0', st: '#1a3480', i: '#bff4ff' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    back += tailBack(g, 34 + f * 8, 11 + f * 1.5, c.b, (x, y) => crystal(x + 2, y + 5, 14 + f * 3, 10, '#dffaff', '#5fc8f0', 3.5, 6));
    if (f >= 4) back = auraBack('ice', g) + back;
    body += legs(g, c, { claws: f >= 2 }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .38 });
    body += ln(`M${P(100 - g.sw * .9, g.sy + 12)} l8,3 M${P(100 - g.sw * .85, g.sy + 22)} l9,2 M${P(100 + g.sw * .9, g.sy + 12)} l-8,3 M${P(100 + g.sw * .85, g.sy + 22)} l-9,2`, c.st, 3.5);
    body += arms(g, c, { claws: f >= 2 });
    body += [-1, 1].map(sd => ln(`M${P(100 + sd * (g.sw + g.at * .6), g.sy + g.al * .3)} l${sd * 6},2`, c.st, 3.2)).join('');
    if (f >= 3) body += pads(g, '#bff4ff', '#4fb3e6', { spike: f >= 4, trim: '#ffffff', spikeCol: '#dffaff', rivet: false });
    // Đầu
    const er = 13 + f * 1.5;
    let fl = '';
    for (const sd of [-1, 1]) fl += `<circle cx="${f1(100 + sd * hrx * .66)}" cy="${f1(hy - hry * .7)}" r="${er}"/><path d="M${P(100 + sd * hrx * .8, hy - 2)} L${P(100 + sd * (hrx + 8 + f * 2.5), hy + 6)} L${P(100 + sd * (hrx - 1), hy + 12)} L${P(100 + sd * (hrx + 6 + f * 2.5), hy + 20)} L${P(100 + sd * hrx * .7, hy + hry * .72)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${fl}`, cel(c.b, c.s));
    head += ci(100 - hrx * .66, hy - hry * .7, er * .55, c.ear, 0) + ci(100 + hrx * .66, hy - hry * .7, er * .55, c.ear, 0);
    // Vằn
    head += pa(`M${P(100 - 9, hy - hry * .95)} L${P(100, hy - hry * .55)} L${P(100 + 9, hy - hry * .95)} L${P(100 + 4, hy - hry * .95)} L${P(100, hy - hry * .75)} L${P(100 - 4, hy - hry * .95)} Z`, c.st, 0);
    for (const sd of [-1, 1]) head += pa(`M${P(100 + sd * hrx * .98, hy - 6)} L${P(100 + sd * hrx * .6, hy - 2)} L${P(100 + sd * hrx * .98, hy + 2)} Z M${P(100 + sd * hrx * .95, hy + 8)} L${P(100 + sd * hrx * .66, hy + 10)} L${P(100 + sd * hrx * .9, hy + 14)} Z M${P(100 + sd * hrx * .3, hy - hry * .9)} L${P(100 + sd * hrx * .22, hy - hry * .6)} L${P(100 + sd * hrx * .4, hy - hry * .86)} Z`, c.st, 0);
    head += snout(100, hy + hry * .48, hrx * .42, hry * .32, '#ffffff', '#3a5fb8');
    head += grin(100, hy + hry * .7, hrx * .28, f, { both: f >= 2 });
    if (f >= 3) head += [-1, 1].map(sd => pa(`M${P(100 + sd * 8 - 3, hy + hry * .76)} l3,${10 + f * 2} l3,${-10 - f * 2} Z`, '#dffaff', 2.4)).join('');
    head += eyes2(100, hy - 4, hrx * .41, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .45, hrx * .2, 4.5);
    if (f >= 4) { head += iceCrest(100, hy - hry * .98, 3, 24); front += motes('ice', g); }
    else if (f >= 2) head += crystal(100, hy - hry * .9, 10 + f * 3, 9, '#dffaff', '#5fc8f0', 3);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.mammoth = {
  el: 'ice',
  c: { b: '#8ec9f2', s: '#4a8fcf', l: '#e2f4ff', ls: '#b5dcf5', i: '#1f6fd1', tusk: '#fffbe8', fur: '#6fb2e6' },
  c4: { b: '#6fb2ea', s: '#2f6fb5', fur: '#4a8fcf', i: '#33e1ff' },
  draw(f, g, c) {
    const { hy } = g, hrx = g.hrx * 1.04, hry = g.hry * 1.04;
    let back = '', body = '', head = '', front = '';
    // Tai to
    const ear = 18 + f * 3;
    back += [-1, 1].map(sd => bl(`<ellipse cx="${f1(100 + sd * (hrx + ear * .3))}" cy="${f1(hy + 6)}" rx="${f1(ear)}" ry="${f1(ear * 1.15)}"/>`, cel(c.b, c.s)) + el(100 + sd * (hrx + ear * .35), hy + 8, ear * .58, ear * .75, c.ls, 0)).join('');
    if (f >= 4) back = auraBack('ice', g) + back;
    body += legs(g, c, { feet: 'flat' }) + torso(g, c);
    body += ln(`M${P(100 - g.sw * .7, g.sy + 16)} l4,5 l4,-5 M${P(100 + g.sw * .5, g.sy + 26)} l4,5 l4,-5 M${P(100 - g.sw * .3, HIP - 16)} l4,5 l4,-5`, c.s, 2.6);
    body += arms(g, c, {});
    if (f >= 3) body += pads(g, '#bff4ff', '#4fb3e6', { spike: f >= 4, trim: '#ffffff', spikeCol: '#dffaff', rivet: false });
    // Đầu lông xù
    let tuft = '';
    for (let i = -2; i <= 2; i++) tuft += `<ellipse cx="${f1(100 + i * 10)}" cy="${f1(hy - hry * .86 - (2 - Math.abs(i)) * 3)}" rx="9" ry="12" transform="rotate(${i * 14} ${f1(100 + i * 10)} ${f1(hy - hry * .86)})"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${tuft}`, cel(c.b, c.s));
    head += bl(tuft, cel(c.fur, c.s), 0);
    // Vòi
    const tr = 26 + f * 5;
    head += tube(`M${P(100, hy + 6)} Q${P(100, hy + tr * .9)} ${P(100 + 6, hy + tr)} Q${P(100 + 13, hy + tr + 3)} ${P(100 + 15, hy + tr - 5)}`, c.b, 15 - (f === 1 ? 2 : 0), 4.5);
    head += ln(`M${P(94, hy + tr * .45)} l12,0 M${P(94, hy + tr * .65)} l12,0 M${P(96, hy + tr * .82)} l11,-1`, c.s, 2.2);
    // Ngà
    const tl = 14 + f * 9;
    for (const sd of [-1, 1]) { const x0 = 100 + sd * 13, y0 = hy + hry * .55; head += pa(`M${P(x0 - sd * 5, y0 - 4)} C${P(x0 + sd * 2, y0 + tl * .9)} ${P(x0 + sd * tl * 1.1, y0 + tl * .8)} ${P(x0 + sd * tl * 1.2, y0 + tl * .05)} C${P(x0 + sd * tl * .8, y0 + tl * .45)} ${P(x0 + sd * 8, y0 + tl * .45)} ${P(x0 + sd * 6, y0 - 2)} Z`, f >= 4 ? cel('#dffaff', '#7fd0f0') : cel('#fffbe8', '#e6c27a'), 4); }
    head += eyes2(100, hy - 4, hrx * .42, g.er * .9, g.er, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .42, hrx * .2, 4.5);
    if (f >= 2) head += iceCrest(100, hy - hry * 1.02, f >= 4 ? 5 : f >= 3 ? 3 : 1, 12 + f * 4);
    if (f >= 4) front += motes('ice', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * 1.05 }) };
  }
};

PET_SPECS.yeti = {
  el: 'ice',
  c: { b: '#f4fbff', s: '#a9cbe6', l: '#ffffff', face: '#5aa8f0', faces: '#2f6fc0', i: '#33e1ff', horn: '#bcc6ff' },
  c4: { b: '#e6f4ff', s: '#7fa8d6', face: '#3f8ae6', faces: '#1f4fa8', i: '#bff4ff' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 4) back += auraBack('ice', g);
    // Lông xù viền thân
    const furTorso = g2 => { let d = ''; for (let i = 0; i < 7; i++) { const t = i / 6, y = g2.sy + 6 + t * (HIP - g2.sy - 10); d += `<circle cx="${f1(100 - g2.sw - 2 + t * 4)}" cy="${f1(y)}" r="7"/><circle cx="${f1(100 + g2.sw + 2 - t * 4)}" cy="${f1(y)}" r="7"/>`; } return d; };
    body += legs(g, c, { claws: true }) + bl(`<path d="${torsoPath(g)}"/>${furTorso(g)}`, cel(c.b, c.s));
    body += el(100, (g.sy + HIP) / 2 + 8, g.ww * .62, (HIP - g.sy) * .3, c.face, 0, 'opacity=".25"');
    body += arms(g, c, { claws: true });
    if (f >= 3) body += pads(g, '#bff4ff', '#4fb3e6', { spike: f >= 4, trim: '#ffffff', spikeCol: '#dffaff', rivet: false });
    let shag = '';
    for (let i = 0; i < 9; i++) { const a = (-180 + i * 22.5) * Math.PI / 180; shag += `<circle cx="${f1(100 + Math.cos(a) * hrx * .9)}" cy="${f1(hy + Math.sin(a) * hry * .85)}" r="${f1(hrx * .26)}"/>`; }
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${shag}`, cel(c.b, c.s));
    // Sừng cừu
    if (f >= 2) for (const sd of [-1, 1]) {
      const x = 100 + sd * hrx * .78, y = hy - hry * .72, r = 8 + f * 3;
      head += pa(`M${P(x - sd * 6, y + 4)} Q${P(x + sd * r * .6, y - r * 1.4)} ${P(x + sd * r * 1.5, y - r * .2)} Q${P(x + sd * r * 1.7, y + r * .9)} ${P(x + sd * r * .8, y + r * 1.1)} Q${P(x + sd * r * 1.1, y + r * .3)} ${P(x + sd * r * .7, y - r * .1)} Q${P(x + sd * 2, y - r * .5)} ${P(x + sd * 3, y + 6)} Z`, cel(c.horn, '#7f8ad6'), 4);
    }
    head += pa(`M${P(100 - hrx * .66, hy - 10)} Q${P(100, hy - 22)} ${P(100 + hrx * .66, hy - 10)} Q${P(100 + hrx * .78, hy + hry * .62)} ${P(100, hy + hry * .9)} Q${P(100 - hrx * .78, hy + hry * .62)} ${P(100 - hrx * .66, hy - 10)} Z`, cel(c.face, c.faces), 4);
    head += pa(`M${P(100 - 7, hy + 8)} Q${P(100, hy + 4)} ${P(100 + 7, hy + 8)} Q${P(100, hy + 14)} ${P(100 - 7, hy + 8)} Z`, OL, 0);
    head += pa(`M${P(100 - hrx * .38, hy + hry * .44)} Q${P(100, hy + hry * .72)} ${P(100 + hrx * .38, hy + hry * .44)} Q${P(100, hy + hry * .56)} ${P(100 - hrx * .38, hy + hry * .44)} Z`, '#1d2a66', 3) +
      pa(`M${P(100 - hrx * .3, hy + hry * .47)} l3,${6 + f} l3,${-6 - f} M${P(100 + hrx * .24, hy + hry * .47)} l3,${6 + f} l3,${-6 - f}`, '#fff', 2);
    head += eyes2(100, hy - 4, hrx * .32, g.er * .9, g.er * .95, { skin: c.face, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .55, hy - hry * .6, hrx * .2, 4.5);
    if (f >= 4) { head += iceCrest(100, hy - hry * 1.08, 5, 24); front += motes('ice', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * 1.08, headW: hrx * 1.7 }) };
  }
};

/* ---------- SẤM ---------- */
PET_SPECS.squirrel = {
  el: 'thunder',
  c: { b: '#ffc21f', s: '#d47f00', l: '#fff1c4', ls: '#f5d68a', i: '#8a5cff', st: '#7a4cff', tail: '#ffd84a' },
  c4: { b: '#ffb000', s: '#b35f00', i: '#33e1ff' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Đuôi hình tia sét
    const T = 34 + f * 13, x = 100 + g.hw - 8, y = HIP - 4;
    back += `<g class="pt" style="transform-origin:${f1(x)}px ${y}px">` + pa(`M${P(x - 6, y + 4)} L${P(x + T * .55, y - T * .1)} L${P(x + T * .25, y - T * .42)} L${P(x + T * .85, y - T * .6)} L${P(x + T * .35, y - T * .95)} L${P(x + T * .7, y - T * 1.35)} L${P(x + T * .02, y - T * .98)} L${P(x + T * .32, y - T * .78)} L${P(x - T * .12, y - T * .5)} L${P(x + T * .1, y - T * .32)} L${P(x - 12, y - 8)} Z`, cel(c.tail, c.s), 5) +
      ln(`M${P(x + T * .2, y - T * .1)} L${P(x + T * .5, y - T * .55)} L${P(x + T * .3, y - T * .8)}`, c.st, 3.5) + `</g>`;
    if (f >= 4) back = auraBack('thunder', g) + back;
    body += legs(g, c) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .4 });
    if (f >= 2) body += bolt(100 - 4, g.sy + 16, 20 + f * 3, '#33e1ff', 3);
    body += arms(g, c, { band: f >= 2 ? c.st : null });
    if (f >= 3) body += pads(g, c.st, '#4a2a9e', { spike: f >= 4, trim: '#33e1ff' });
    // Đầu, tai có chỏm lông
    const eh = 22 + f * 6;
    const L = earPointy(100 - hrx * .55, hy - hry * .55, -1, eh, 18 + f * 2, -6, c.b, '#ff9ab4');
    const R = earPointy(100 + hrx * .55, hy - hry * .55, 1, eh, 18 + f * 2, -6, c.b, '#ff9ab4');
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>`, cel(c.b, c.s));
    head += L.inner + R.inner;
    for (const sd of [-1, 1]) { const t = earTip(100 + sd * hrx * .55, hy - hry * .55, sd, eh, -6); head += bolt(t[0] - 3, t[1] - 10, 14 + f * 2, c.st, 2.5); }
    head += lowerFace(g, c.l, 10, .7);
    head += el(100 - hrx * .62, hy + hry * .3, 9, 7, '#fff1c4', 0) + el(100 + hrx * .62, hy + hry * .3, 9, 7, '#fff1c4', 0);
    head += pa(`M${P(96, hy + 12)} Q${P(100, hy + 9)} ${P(104, hy + 12)} Q${P(100, hy + 16)} ${P(96, hy + 12)} Z`, '#ff6f91', 2.4);
    head += ln(`M${P(100, hy + 15)} v4 M${P(93, hy + 21)} Q${P(100, hy + 25)} ${P(107, hy + 21)}`, OL, 3) + `<rect x="${f1(96.5)}" y="${f1(hy + 21)}" width="7" height="${f1(6 + f)}" rx="1.5" fill="#fff" stroke="${OL}" stroke-width="2"/>` + ln(`M100,${f1(hy + 22)} v${f1(5 + f)}`, OL, 1.4);
    head += eyes2(100, hy - 4, hrx * .4, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += bolt(100 - 3, hy - hry * .92, 14 + f * 3, '#33e1ff', 3);
    head += hl(100 - hrx * .5, hy - hry * .45, hrx * .2, 4.5);
    if (f >= 4) front += motes('thunder', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};
function earTip(x, y, sd, h, tilt) { const t = tilt * Math.PI / 180; return [x + sd * Math.sin(t) * h, y - Math.cos(t) * h]; }

PET_SPECS.fox = {
  el: 'thunder',
  c: { b: '#2fb0ff', s: '#1667c2', l: '#eafaff', ls: '#bfe6ff', i: '#ffd21f', bolt: '#ffd21f', tip: '#ffe14d' },
  c4: { b: '#1f8af2', s: '#0f4a9e', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    const nT = [0, 1, 2, 3, 3][f], T = 44 + f * 12;
    for (let i = 0; i < nT; i++) {
      const a = nT === 1 ? -35 : -5 - i * 62 / (nT - 1), x = 100 + g.hw - 8, y = HIP - 8;
      back += `<g class="pt" style="transform-origin:${f1(x)}px ${y}px;animation-delay:-${i * .4}s">` + bushyTail(x, y, a, T, 15 + f * 2.5, cel(c.b, c.s), c.tip) + `</g>`;
    }
    if (f >= 4) back = auraBack('thunder', g) + back;
    body += legs(g, c, { claws: f >= 3 }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .6, g.sy)} Q${P(100, HIP + 6)} ${P(100 + g.ww * .6, g.sy)} Q${P(100, g.sy - 4)} ${P(100 - g.ww * .6, g.sy)} Z`, cel(c.l, c.ls), 3.5);
    body += arms(g, c, { claws: f >= 3 });
    if (f >= 2) body += [-1, 1].map(sd => bolt(100 + sd * (g.sw + g.at * .7) - 4, g.sy + g.al * .35, 12 + f * 2, c.bolt, 2.4)).join('');
    if (f >= 3) body += pads(g, '#ffd21f', '#d48700', { spike: f >= 4, trim: '#fff6b0', spikeCol: '#fff6b0' });
    // Đầu cáo
    const eh = 32 + f * 7;
    const L = earPointy(100 - hrx * .58, hy - hry * .5, -1, eh, 22 + f * 2, -16, c.b, '#ffe14d');
    const R = earPointy(100 + hrx * .58, hy - hry * .5, 1, eh, 22 + f * 2, -16, c.b, '#ffe14d');
    let ch = '';
    for (const sd of [-1, 1]) ch += `<path d="M${P(100 + sd * hrx * .82, hy + 2)} L${P(100 + sd * (hrx + 12 + f * 2), hy + 14)} L${P(100 + sd * hrx * .66, hy + hry * .7)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>${ch}`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += pa(`M${P(100 - hrx * 1.05, hy + 6)} Q${P(100 - hrx * .4, hy + 2)} ${P(100, hy + 12)} Q${P(100 + hrx * .4, hy + 2)} ${P(100 + hrx * 1.05, hy + 6)} Q${P(100 + hrx * .6, hy + hry * .92)} ${P(100, hy + hry * .98)} Q${P(100 - hrx * .6, hy + hry * .92)} ${P(100 - hrx * 1.05, hy + 6)} Z`, c.l, 0);
    head += snout(100, hy + hry * .5, hrx * .28, hry * .22, '#ffffff');
    head += grin(100, hy + hry * .68, hrx * .24, f);
    head += [-1, 1].map(sd => bolt(100 + sd * hrx * .72 - 4, hy - 6, 13 + f, c.bolt, 2.2)).join('');
    head += eyes2(100, hy - 4, hrx * .4, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid, slit: f >= 3 });
    head += hl(100 - hrx * .5, hy - hry * .48, hrx * .2, 4.5);
    if (f >= 4) { head += bolt(100 - 5, hy - hry * 1.25, 26, '#ffd21f', 3.5); front += motes('thunder', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.eagle = {
  el: 'thunder',
  c: { b: '#4a5fd8', s: '#27338f', l: '#f4f7ff', ls: '#c9d3ff', i: '#ffd21f', beak: '#ffc21f', w: '#4a5fd8', ws: '#27338f' },
  c4: { b: '#3343c4', s: '#1a2170', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 2) { const sp = [0, 0, 34, 54, 76][f], h = [0, 0, 28, 46, 64][f]; back += featherWing(g, -1, sp, h, c.b, '#6f82f0', '#ffd21f') + featherWing(g, 1, sp, h, c.b, '#6f82f0', '#ffd21f'); }
    if (f >= 3) back += [-1, 1].map(sd => bolt(100 + sd * (g.sw + 40 + f * 4) - 6, g.sy - 30 - f * 4, 22 + f * 4, '#ffd21f', 3)).join('');
    if (f >= 4) back = auraBack('thunder', g) + back;
    body += legs(g, c, { feet: 'bird' }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .7, g.sy + 2)} Q${P(100, g.sy - 6)} ${P(100 + g.ww * .7, g.sy + 2)} L${P(100 + g.ww * .5, g.sy + 16)} L${P(100 + g.ww * .25, g.sy + 10)} L${P(100, g.sy + 20)} L${P(100 - g.ww * .25, g.sy + 10)} L${P(100 - g.ww * .5, g.sy + 16)} Z`, c.l, 3.5);
    if (f >= 3) body += chestPlate(g, '#ffd21f', '#d48700', bolt(96, g.sy + 22, 20, '#33e1ff', 2.6), { trim: '#fff6b0' });
    body += wingArms(g, c);
    // Đầu trắng, mỏ móc
    let fe = '';
    for (const sd of [-1, 1]) fe += `<path d="M${P(100 + sd * hrx * .7, hy - hry * .6)} L${P(100 + sd * (hrx + 10 + f * 2), hy - hry * .45)} L${P(100 + sd * hrx * .95, hy - 4)} L${P(100 + sd * (hrx + 12 + f * 2), hy + 8)} L${P(100 + sd * hrx * .8, hy + 14)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${fe}`, cel(c.l, c.ls));
    head += pa(`M${P(100 - 14, hy + 4)} Q${P(100, hy - 2)} ${P(100 + 14, hy + 4)} Q${P(100 + 12, hy + 22 + f * 2)} ${P(100 + 2, hy + 30 + f * 2)} Q${P(100 - 3, hy + 20)} ${P(100 - 14, hy + 4)} Z`, cel(c.beak, '#e07a00'), 4) + ln(`M${P(100 - 12, hy + 12)} Q${P(100, hy + 16)} ${P(100 + 12, hy + 12)}`, OL, 2.4) + el(100 - 4, hy + 6, 2, 1.4, OL, 0) + el(100 + 4, hy + 6, 2, 1.4, OL, 0);
    head += eyes2(100, hy - 8, hrx * .42, g.er, g.er, { skin: c.l, iris: c.i, lid: g.lid, brow: '#27338f' });
    head += hl(100 - hrx * .5, hy - hry * .52, hrx * .2, 4.5);
    if (f >= 2) head += bolt(100 - 4, hy - hry * 1.15, 14 + f * 4, '#ffd21f', 3);
    if (f >= 4) front += motes('thunder', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .98 }) };
  }
};

PET_SPECS.uni = {
  el: 'thunder',
  c: { b: '#ffffff', s: '#c9c0f0', l: '#ffe6f6', ls: '#f0bde0', i: '#8a5cff', hoof: '#6a4cc0', horn: '#ffe14d' },
  c4: { b: '#f6f2ff', s: '#a796e6', i: '#33e1ff' },
  draw(f, g, c) {
    const { hy } = g, hrx = g.hrx * .86, hry = g.hry * 1.12;
    let back = '', body = '', head = '', front = '';
    // Bờm neon xõa sau đầu
    const mn = 20 + f * 7;
    back += `<g class="pt" style="transform-origin:100px ${f1(hy)}px">` + pa(`M${P(100 - hrx * .9, hy - hry * .6)} Q${P(100 - hrx - mn, hy)} ${P(100 - hrx - mn * .6, hy + hry + mn * .3)} L${P(100 - hrx * .4, hy + hry * .6)} Z M${P(100 + hrx * .9, hy - hry * .6)} Q${P(100 + hrx + mn, hy)} ${P(100 + hrx + mn * .6, hy + hry + mn * .3)} L${P(100 + hrx * .4, hy + hry * .6)} Z`, 'url(#gMane)', 5) + `</g>`;
    if (f >= 3) { const sp = [0, 0, 0, 44, 66][f], h = [0, 0, 0, 40, 60][f]; back = featherWing(g, -1, sp, h, '#ffffff', '#c9f6ff', '#ff9ef0') + featherWing(g, 1, sp, h, '#ffffff', '#c9f6ff', '#ff9ef0') + back; }
    back += tailBack(g, 32 + f * 8, 14 + f, '#8a5cff', (x, y) => ci(x, y, 9 + f, 'url(#gMane)', 4));
    if (f >= 4) back = auraBack('thunder', g) + back;
    body += legs(g, c, { feet: 'hoof', hoof: c.hoof }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .34 });
    body += arms(g, c, {});
    if (f >= 2) body += [-1, 1].map(sd => bolt(100 + sd * g.sw * .5 - 4, g.sy + 14, 14 + f * 3, '#33e1ff', 2.6)).join('');
    if (f >= 3) body += pads(g, '#8a5cff', '#4a2a9e', { spike: f >= 4, trim: '#33e1ff', spikeCol: '#ffe14d' });
    // Đầu ngựa
    const L = earPointy(100 - hrx * .5, hy - hry * .7, -1, 20 + f * 3, 15, -18, c.b, '#ffb3e8');
    const R = earPointy(100 + hrx * .5, hy - hry * .7, 1, 20 + f * 3, 15, -18, c.b, '#ffb3e8');
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += el(100, hy + hry * .55, hrx * .78, hry * .42, cel(c.l, c.ls), 4);
    head += el(100 - 9, hy + hry * .5, 3.5, 2.6, OL, 0) + el(100 + 9, hy + hry * .5, 3.5, 2.6, OL, 0);
    head += ln(`M${P(100 - 12, hy + hry * .76)} Q${P(100, hy + hry * .86)} ${P(100 + 14, hy + hry * .72)}`, OL, 3.2);
    // Mái bờm trước trán
    head += pa(`M${P(100 - hrx * .7, hy - hry * .55)} Q${P(100 - 6, hy - hry * 1.15)} ${P(100 + hrx * .4, hy - hry * .9)} Q${P(100 + hrx * .2, hy - hry * .45)} ${P(100 - 2, hy - hry * .3)} Q${P(100 - hrx * .3, hy - hry * .45)} ${P(100 - hrx * .7, hy - hry * .55)} Z`, 'url(#gMane)', 4);
    // Sừng
    const hl_ = 20 + f * 9;
    head += pa(`M${P(100 - 7, hy - hry * .78)} L${P(100, hy - hry * .78 - hl_)} L${P(100 + 7, hy - hry * .78)} Z`, cel(c.horn, '#e0a000'), 4) + ln(`M${P(100 - 5, hy - hry * .78 - hl_ * .25)} l9,-4 M${P(100 - 3.5, hy - hry * .78 - hl_ * .5)} l6,-3`, OL, 2);
    if (f >= 3) head += [-1, 1].map(sd => bolt(100 + sd * 12 - 3, hy - hry * .78 - hl_ * .9, 10 + f * 2, '#33e1ff', 2)).join('');
    head += eyes2(100, hy - 6, hrx * .48, g.er * .95, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .3, hrx * .2, 4.5);
    if (f >= 4) front += motes('thunder', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95, headW: hrx * 1.4 }) };
  }
};

// Đuôi xù hình giọt nước: gốc (x, y), góc a (độ), dài L, rộng W
function bushyTail(x, y, a, L, W, fill, tipCol) {
  const r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), nx = -uy, ny = ux;
  const p = (t, k) => P(x + ux * L * t + nx * W * k, y + uy * L * t + ny * W * k);
  let s = pa(`M${p(0, -.25)} C${p(.3, -.9)} ${p(.75, -.75)} ${p(1, 0)} C${p(.75, .75)} ${p(.3, .9)} ${p(0, .25)} Z`, fill, 5);
  if (tipCol) s += pa(`M${p(.62, -.62)} C${p(.8, -.5)} ${p(.94, -.25)} ${p(1, 0)} C${p(.94, .25)} ${p(.8, .5)} ${p(.62, .62)} Q${p(.72, .1)} ${p(.66, -.05)} Q${p(.74, -.2)} ${p(.62, -.62)} Z`, tipCol, 0) + ln(`M${p(.62, -.62)} C${p(.8, -.5)} ${p(.94, -.25)} ${p(1, 0)} C${p(.94, .25)} ${p(.8, .5)} ${p(.62, .62)}`, OL, 5);
  return s;
}
/* ---------- ĐÁ ---------- */
const rockChunk = (x, y, r, col = '#a58060', cold = '#6e4c34') => pa(`M${P(x - r, y + r * .3)} L${P(x - r * .7, y - r * .6)} L${P(x + r * .1, y - r)} L${P(x + r, y - r * .35)} L${P(x + r * .85, y + r * .6)} L${P(x - r * .2, y + r * .8)} Z`, cel(col, cold), 3.5);
const amber = (x, y, h, w = h * .62) => crystal(x - w * .55, y + 1, h * .6, w * .7, '#ffcf4a', '#e08a00', 3, -w * .3) + crystal(x + w * .55, y + 1, h * .5, w * .62, '#ffcf4a', '#e08a00', 3, w * .3) + crystal(x, y, h, w, '#ffe07a', '#e08a00', 3);
PET_SPECS.turtle = {
  el: 'stone',
  c: { b: '#56bfa8', s: '#2a7f75', l: '#e3f7d0', ls: '#b9e0b0', i: '#ffb21f', sh: '#b58658', shs: '#7a5232', rim: '#e0b77e' },
  c4: { b: '#3fae9a', s: '#1d6a60', sh: '#9a6a40', shs: '#5c3a20' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Mai đá sau lưng (thấy hai bên + trên vai)
    const sw = g.sw + 22 + f * 4, top = g.sy - 18 - f * 4;
    back += pa(`M${P(100 - sw, HIP - 4)} Q${P(100 - sw - 8, top + 6)} ${P(100, top)} Q${P(100 + sw + 8, top + 6)} ${P(100 + sw, HIP - 4)} Q${P(100, HIP + 8)} ${P(100 - sw, HIP - 4)} Z`, cel(c.sh, c.shs), 5.5);
    back += pa(`M${P(100 - sw + 7, HIP - 8)} Q${P(100 - sw, top + 14)} ${P(100, top + 8)} Q${P(100 + sw, top + 14)} ${P(100 + sw - 7, HIP - 8)}`, 'none', 0) + ln(`M${P(100 - sw + 7, HIP - 8)} Q${P(100 - sw, top + 14)} ${P(100, top + 8)} Q${P(100 + sw, top + 14)} ${P(100 + sw - 7, HIP - 8)}`, c.rim, 3);
    for (const sd of [-1, 1]) back += pa(`M${P(100 + sd * (sw - 4), top + 34)} L${P(100 + sd * (sw - 14), top + 24)} L${P(100 + sd * (sw - 24), top + 34)} L${P(100 + sd * (sw - 24), top + 50)} L${P(100 + sd * (sw - 14), top + 58)} L${P(100 + sd * (sw - 4), top + 50)} Z`, cel('#c9996a', c.shs), 3);
    if (f >= 3) back += [-1, 1].map(sd => amber(100 + sd * sw * .78, top + 30, 16 + f * 4)).join('');
    if (f >= 4) back = auraBack('stone', g) + back + amber(100 - sw * .4, top + 14, 22) + amber(100 + sw * .4, top + 14, 22);
    body += legs(g, c, { feet: 'flat' }) + torso(g, c);
    // Yếm bụng chia ô
    const by = g.sy + 4, bh = HIP - by - 2, bw = g.ww * .72;
    body += pa(`M${P(100 - bw, by)} Q${P(100, by - 6)} ${P(100 + bw, by)} L${P(100 + bw * .8, by + bh)} Q${P(100, by + bh + 4)} ${P(100 - bw * .8, by + bh)} Z`, cel(c.l, c.ls), 3.5) + ln(`M100,${f1(by - 2)} V${f1(by + bh + 2)} M${P(100 - bw * .92, by + bh * .36)} H${f1(100 + bw * .92)} M${P(100 - bw * .85, by + bh * .7)} H${f1(100 + bw * .85)}`, c.ls, 2.4);
    body += arms(g, c, {});
    if (f >= 3) body += pads(g, c.sh, c.shs, { spike: f >= 4, trim: c.rim, spikeCol: '#ffcf4a', rivet: false });
    // Đầu tròn, mỏ nhẹ
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    head += lowerFace(g, c.l, 12, .62);
    head += ci(100 - hrx * .55, hy - hry * .55, 3, c.s, 0) + ci(100 + hrx * .45, hy - hry * .7, 2.4, c.s, 0) + ci(100 + hrx * .7, hy - hry * .35, 2, c.s, 0);
    head += el(100 - 5, hy + 10, 2, 1.6, OL, 0) + el(100 + 5, hy + 10, 2, 1.6, OL, 0);
    head += ln(`M${P(100 - hrx * .45, hy + hry * .5)} Q${P(100, hy + hry * .72)} ${P(100 + hrx * .45, hy + hry * .46)}`, OL, 3.5) + pa(`M${P(100 + hrx * .18, hy + hry * .58)} l2.5,5 l2.5,-5.5`, '#fff', 2);
    head += eyes2(100, hy - 4, hrx * .42, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .45, hrx * .2, 4.5);
    if (f === 2) head += rockChunk(100, hy - hry * .95, 9);
    if (f >= 3) head += pa(`M${P(100 - hrx * .7, hy - hry * .62)} Q${P(100, hy - hry * 1.15)} ${P(100 + hrx * .7, hy - hry * .62)} L${P(100 + hrx * .62, hy - hry * .4)} Q${P(100, hy - hry * .85)} ${P(100 - hrx * .62, hy - hry * .4)} Z`, cel(c.sh, c.shs), 4) + amber(100, hy - hry * .82, 14 + f * 3);
    if (f >= 4) front += motes('stone', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * (f >= 3 ? 1.02 : .95) }) };
  }
};

PET_SPECS.pangolin = {
  el: 'stone',
  c: { b: '#d9a46a', s: '#9a6634', l: '#ffe8c8', ls: '#f0c99a', i: '#33e1ff', sc: '#b9824c', scs: '#7a4f28' },
  c4: { b: '#c98a4a', s: '#7e4c1e', sc: '#a06a34', scs: '#5e3a16' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Đuôi vảy
    const T = 30 + f * 9, x = 100 + g.hw - 6, y = HIP - 4;
    let tailD = '';
    for (let i = 0; i < 4 + f; i++) { const t = i / (3 + f), px = x + T * t * .95, py = y - Math.sin(t * 2.2) * T * .45, r = 11 + f * 1.5 - t * 6; tailD += `<path d="M${P(px - r, py)} Q${P(px, py - r * 1.3)} ${P(px + r, py)} Q${P(px, py + r * .6)} ${P(px - r, py)} Z"/>`; }
    back += `<g class="pt" style="transform-origin:${f1(x)}px ${y}px">` + bl(tailD, cel(c.sc, c.scs), 4.5) + `</g>`;
    if (f >= 4) back = auraBack('stone', g) + back;
    body += legs(g, c, { claws: true }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .36 });
    // Vảy phủ vai
    let sc = '';
    for (let r = 0; r < 2; r++) for (let i = -2; i <= 2; i++) { const px = 100 + i * g.sw * .42 + (r ? g.sw * .21 : 0), py = g.sy + 4 + r * 9; if (Math.abs(px - 100) > g.sw + 2) continue; sc += pa(`M${P(px - 9, py)} Q${P(px, py - 9)} ${P(px + 9, py)} Q${P(px, py + 8)} ${P(px - 9, py)} Z`, cel(c.sc, c.scs), 3); }
    body += sc;
    body += arms(g, c, { claws: true });
    if (f >= 3) body += pads(g, '#8d86b8', '#5a5288', { spike: f >= 4, trim: '#ffcf4a', spikeCol: '#ffcf4a' });
    // Đầu: mũ vảy chồng lớp, mõm dài
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="M${P(100 - hrx * .7, hy - hry * .5)} Q${P(100, hy - hry * 1.35)} ${P(100 + hrx * .7, hy - hry * .5)} Z"/>`, cel(c.b, c.s));
    const scale = (x, y, w) => pa(`M${P(x - w, y - w * .7)} L${P(x + w, y - w * .7)} Q${P(x + w, y + w * .55)} ${P(x, y + w * .95)} Q${P(x - w, y + w * .55)} ${P(x - w, y - w * .7)} Z`, cel(c.sc, c.scs), 3) + ln(`M${P(x - w * .45, y - w * .2)} Q${P(x, y + w * .3)} ${P(x + w * .45, y - w * .2)}`, c.l, 1.6, 'opacity=".6"');
    const rows = [[hy - hry * 1.02, 1, .2], [hy - hry * .8, 2, .27], [hy - hry * .56, 3, .27], [hy - hry * .32, 4, .25]];
    rows.forEach(([y, n, k]) => { for (let i = 0; i < n; i++) head += scale(100 + (i - (n - 1) / 2) * hrx * k * 1.5, y, hrx * k * .78); });
    head += lowerFace(g, c.l, 10, .66);
    head += el(100, hy + hry * .52, hrx * .32, hry * .4, cel(c.l, c.ls), 4) + el(100, hy + hry * .36, 6.5, 4.2, OL, 0) + hl(98, hy + hry * .32, 2, 1, 0, .8);
    head += ln(`M${P(100 - 9, hy + hry * .72)} Q${P(100, hy + hry * .8)} ${P(100 + 10, hy + hry * .68)}`, OL, 3);
    head += eyes2(100, hy + 2, hrx * .44, g.er * .92, g.er, { skin: c.b, iris: c.i, lid: g.lid });
    if (f >= 2) head += amber(100, hy - hry * 1.12, 10 + f * 4);
    if (f >= 4) front += motes('stone', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * 1.02 }) };
  }
};

PET_SPECS.rhino = {
  el: 'stone',
  c: { b: '#9aa0c4', s: '#5c6290', l: '#d9dcf0', ls: '#b5b9da', i: '#ffb21f', horn: '#fff1c9', plate: '#c99a6b', plates: '#8a5a34' },
  c4: { b: '#7d84b0', s: '#40466e', plate: '#ffd21f', plates: '#d48700' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 4) back += auraBack('stone', g);
    back += tailBack(g, 20 + f * 4, 8, c.b, (x, y) => el(x, y, 5, 7, OL, 0));
    body += legs(g, c, { feet: 'hoof', hoof: '#4a4f78' }) + torso(g, c);
    body += chestPlate(g, c.plate, c.plates, f >= 2 ? rockChunk(100, g.sy + 26, 7 + f, '#ffcf4a', '#e08a00') : '', { trim: f >= 3 ? '#ffd21f' : c.plates });
    body += arms(g, c, {});
    if (f >= 2) body += pads(g, c.plate, c.plates, { spike: f >= 3, trim: '#ffd21f', spikeCol: c.horn });
    // Đầu tê giác: tai nhỏ, sừng mũi
    let ears = '';
    for (const sd of [-1, 1]) ears += `<ellipse cx="${f1(100 + sd * hrx * .78)}" cy="${f1(hy - hry * .72)}" rx="9" ry="13" transform="rotate(${sd * 30} ${f1(100 + sd * hrx * .78)} ${f1(hy - hry * .72)})"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><ellipse cx="100" cy="${hy + hry * .5}" rx="${hrx * .7}" ry="${hry * .52}"/>${ears}`, cel(c.b, c.s));
    head += el(100, hy + hry * .62, hrx * .58, hry * .36, c.l, 0);
    // Giáp trán
    head += pa(`M${P(100 - hrx * .62, hy - hry * .55)} Q${P(100, hy - hry * 1.05)} ${P(100 + hrx * .62, hy - hry * .55)} L${P(100 + hrx * .3, hy - hry * .3)} Q${P(100, hy - hry * .5)} ${P(100 - hrx * .3, hy - hry * .3)} Z`, cel(c.plate, c.plates), 4) + rivet(100, hy - hry * .7);
    const hn = 20 + f * 9;
    head += spike1(100, hy + hry * .38, hn, 16 + f * 2, cel(c.horn, '#e6c27a'), 4);
    if (f >= 3) head += spike1(100, hy + hry * .02, hn * .5, 10, cel(c.horn, '#e6c27a'), 1, 4);
    head += el(100 - 10, hy + hry * .62, 3, 2.4, OL, 0) + el(100 + 10, hy + hry * .62, 3, 2.4, OL, 0);
    head += ln(`M${P(100 - 14, hy + hry * .84)} Q${P(100, hy + hry * .94)} ${P(100 + 14, hy + hry * .82)}`, OL, 3.2);
    head += eyes2(100, hy - 6, hrx * .5, g.er * .88, g.er * .9, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .55, hy - hry * .2, hrx * .16, 4);
    if (f >= 4) front += motes('stone', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.gorilla = {
  el: 'stone',
  c: { b: '#6e6488', s: '#3d3558', l: '#c9b49a', ls: '#9e8466', i: '#ffb21f', rock: '#a58060', rocks: '#6e4c34' },
  c4: { b: '#5a4f78', s: '#2a2242', i: '#ffd21f' },
  draw(f, g0, c) {
    const g = Object.assign({}, g0, { at: g0.at * 1.25, sw: g0.sw * 1.06 });
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 4) back += auraBack('stone', g);
    if (f >= 3) back += [-1, 1].map(sd => amber(100 + sd * (g.sw + 4), g.sy + 6, 18 + f * 5, 12)).join('');
    body += legs(g, c, { feet: 'flat' }) + torso(g, c);
    body += pa(`M${P(100 - g.sw * .7, g.sy + 4)} Q${P(100, g.sy + 26)} ${P(100 + g.sw * .7, g.sy + 4)} Q${P(100 + g.ww * .6, HIP - 4)} ${P(100, HIP)} Q${P(100 - g.ww * .6, HIP - 4)} ${P(100 - g.sw * .7, g.sy + 4)} Z`, cel(c.l, c.ls), 3.5);
    body += ln(`M100,${f1(g.sy + 14)} V${f1(g.sy + 30)} M${P(100 - g.ww * .45, g.sy + 32)} H${f1(100 + g.ww * .45)}`, c.ls, 2.4);
    body += arms(g, c, {});
    // Đá trên nắm đấm
    body += [-1, 1].map(sd => rockChunk(100 + sd * (g.sw + g.at * .75), g.sy + g.al + 4 + g.at * .3, g.at * .62, c.rock, c.rocks)).join('');
    if (f >= 2) body += pads(g, c.rock, c.rocks, { spike: f >= 4, trim: '#ffcf4a', spikeCol: '#ffcf4a', rivet: false });
    // Đầu: trán gồ, mặt sáng
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><ellipse cx="100" cy="${hy - hry * .55}" rx="${hrx * .55}" ry="${hry * .5}"/><circle cx="${f1(100 - hrx * .95)}" cy="${f1(hy)}" r="9"/><circle cx="${f1(100 + hrx * .95)}" cy="${f1(hy)}" r="9"/>`, cel(c.b, c.s));
    head += ci(100 - hrx * .95, hy, 4.5, c.l, 0) + ci(100 + hrx * .95, hy, 4.5, c.l, 0);
    head += pa(`M${P(100 - hrx * .7, hy - 6)} Q${P(100 - hrx * .35, hy - 14)} ${P(100, hy - 8)} Q${P(100 + hrx * .35, hy - 14)} ${P(100 + hrx * .7, hy - 6)} Q${P(100 + hrx * .8, hy + hry * .7)} ${P(100, hy + hry * .9)} Q${P(100 - hrx * .8, hy + hry * .7)} ${P(100 - hrx * .7, hy - 6)} Z`, cel(c.l, c.ls), 4);
    head += el(100 - 6, hy + hry * .3, 3.6, 3, OL, 0) + el(100 + 6, hy + hry * .3, 3.6, 3, OL, 0);
    head += grin(100, hy + hry * .6, hrx * .3, f, { both: true });
    head += eyes2(100, hy - 4, hrx * .32, g.er * .86, g.er * .9, { skin: c.l, iris: c.i, lid: Math.max(.7, g.lid), bw: 8 });
    head += hl(100 - hrx * .3, hy - hry * .75, hrx * .16, 4);
    if (f === 3) head += amber(100, hy - hry * .98, 18);
    if (f >= 4) { head += crownSpikes(100, hy - hry * 1.02, hrx * .6) + amber(100, hy - hry * 1.12, 16); front += motes('stone', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * 1.02 }) };
  }
};

/* ---------- RỪNG ---------- */
const flower = (x, y, r, col = '#ff5fa2') => [0, 72, 144, 216, 288].map(a => ci(x + Math.cos(a * Math.PI / 180) * r * .7, y + Math.sin(a * Math.PI / 180) * r * .7, r * .55, col, 1.8)).join('') + ci(x, y, r * .42, '#ffd21f', 1.6);
function leafCrown(x, y, w, n, h) {
  let s = '';
  for (let i = 0; i < n; i++) { const k = i / (n - 1) - .5, a = -90 + k * 110; s += leaf(x + k * w, y + Math.abs(k) * 8, h * (1 - Math.abs(k) * .4), a, '#7be35a', '#2f9a3e', 3.2); }
  return s;
}
PET_SPECS.frog = {
  el: 'forest',
  c: { b: '#5ad04a', s: '#2a8a32', l: '#e8ffc0', ls: '#bfe68a', i: '#ffb21f', sp: '#2f9a3e', mouth: '#a8204f' },
  c4: { b: '#3fb83a', s: '#1d6e26', i: '#ffd21f' },
  draw(f, g, c) {
    const { hy } = g, hrx = g.hrx * 1.12, hry = g.hry * .84;
    let back = '', body = '', head = '', front = '';
    if (f >= 3) back += [-1, 1].map(sd => leaf(100 + sd * g.sw * .6, g.sy + 2, 30 + f * 8, sd < 0 ? -150 : -30, '#7be35a', '#2f9a3e', 4)).join('');
    if (f >= 4) back = auraBack('forest', g) + back;
    body += legs(g, c, { feet: 'flat' }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .4, kx: .72 });
    if (f >= 3) body += chestPlate(g, '#9a5a2a', '#5e3414', leaf(100 - 9, g.sy + 30, 18, -50, '#7be35a', '#2f9a3e', 2.6), { trim: '#7be35a' });
    body += arms(g, c, { band: f === 2 ? '#9a5a2a' : null });
    if (f >= 3) body += pads(g, '#9a5a2a', '#5e3414', { spike: f >= 4, trim: '#7be35a', spikeCol: '#9df27a', rivet: false });
    // Đầu ếch: mắt lồi trên đỉnh
    const eb = 15 + f * 1.2, ex = hrx * .52, ey = hy - hry * .62;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><circle cx="${f1(100 - ex)}" cy="${f1(ey)}" r="${eb}"/><circle cx="${f1(100 + ex)}" cy="${f1(ey)}" r="${eb}"/>`, cel(c.b, c.s));
    head += ci(100 - hrx * .45, hy + 2, 3, c.sp, 0) + ci(100 + hrx * .5, hy - 2, 2.4, c.sp, 0) + ci(100 + hrx * .7, hy + 8, 2, c.sp, 0) + ci(100 - hrx * .72, hy - 6, 2.2, c.sp, 0);
    head += pa(`M${P(100 - hrx * .62, hy + hry * .2)} Q${P(100, hy + hry * .95)} ${P(100 + hrx * .62, hy + hry * .2)} Q${P(100, hy + hry * .45)} ${P(100 - hrx * .62, hy + hry * .2)} Z`, c.mouth, 3.5) + el(100, hy + hry * .55, hrx * .2, hry * .1, '#ff6f91', 0);
    head += el(100 - 6, hy + 2, 2, 1.5, OL, 0) + el(100 + 6, hy + 2, 2, 1.5, OL, 0);
    head += eyes2(100, ey + 1, ex, g.er * .9, g.er * .95, { skin: c.b, iris: c.i, lid: g.lid });
    head += el(100 - hrx * .7, hy + hry * .2, 7, 4, '#ff9ab4', 0, 'opacity=".65"') + el(100 + hrx * .7, hy + hry * .2, 7, 4, '#ff9ab4', 0, 'opacity=".65"');
    head += hl(100 - hrx * .62, hy - hry * .1, hrx * .14, 3.5);
    if (f === 1) head += leaf(100, hy - hry * .7, 16, -70, '#7be35a', '#2f9a3e', 3);
    else if (f <= 3) head += leafCrown(100, hy - hry * .78, 22 + f * 4, 3, 14 + f * 4);
    if (f >= 4) { head += leafCrown(100, hy - hry * .8, 40, 5, 26) + flower(100, hy - hry * .95, 8); front += motes('forest', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: ey - eb + 2, headW: hrx * 1.4, eyeY: ey }) };
  }
};

PET_SPECS.beetle = {
  el: 'forest',
  c: { b: '#2f9a7a', s: '#14574a', l: '#bff0d8', ls: '#7fcfae', i: '#ffd21f', sh: '#1f6e8a', shs: '#0f3a52', horn: '#3a2a5e' },
  c4: { b: '#1f8a6a', s: '#0b4234', sh: '#155e7a', shs: '#082a3d', horn: '#ffd21f' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Cánh cứng hai bên lưng
    const wl = 30 + f * 9;
    for (const sd of [-1, 1]) {
      const x0 = 100 + sd * g.sw * .3, y0 = g.sy - 4;
      back += pa(`M${P(x0, y0)} Q${P(x0 + sd * (g.sw + 26), y0 - 8)} ${P(x0 + sd * (g.sw + 20), y0 + wl)} Q${P(x0 + sd * (g.sw * .7), y0 + wl * 1.25)} ${P(x0, y0 + wl * .9)} Z`, cel(c.sh, c.shs), 5) + hl(x0 + sd * (g.sw * .7), y0 + 10, 10, 4, sd * 30, .45);
      if (f >= 3) back += pa(`M${P(x0 + sd * 10, y0 + 6)} Q${P(x0 + sd * (g.sw + 34 + f * 4), y0 - 30)} ${P(x0 + sd * (g.sw + 40 + f * 6), y0 + 20)} Q${P(x0 + sd * (g.sw + 16), y0 + 10)} ${P(x0 + sd * 10, y0 + 6)} Z`, '#bff4ff', 3.5, 'opacity=".75"');
    }
    if (f >= 4) back = auraBack('forest', g) + back;
    body += legs(g, c, { feet: 'flat' }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .7, g.sy + 6)} Q${P(100, g.sy)} ${P(100 + g.ww * .7, g.sy + 6)} L${P(100 + g.ww * .55, HIP - 4)} Q${P(100, HIP + 2)} ${P(100 - g.ww * .55, HIP - 4)} Z`, cel(c.l, c.ls), 3.5) + ln(`M${P(100 - g.ww * .65, g.sy + 18)} H${f1(100 + g.ww * .65)} M${P(100 - g.ww * .6, g.sy + 30)} H${f1(100 + g.ww * .6)}`, c.ls, 2.4);
    body += arms(g, c, { claws: true });
    if (f >= 3) body += pads(g, c.sh, c.shs, { spike: f >= 4, trim: '#7be35a', spikeCol: '#ffd21f' });
    // Đầu: sừng tê giác lớn cong lên
    const hn = 26 + f * 12;
    head += pa(`M${P(100 - 12, hy - hry * .4)} C${P(100 - 16, hy - hry - hn * .5)} ${P(100 - 4, hy - hry - hn)} ${P(100 + 10, hy - hry - hn * .95)} C${P(100 + 6, hy - hry - hn * .7)} ${P(100 + 8, hy - hry - hn * .35)} ${P(100 + 12, hy - hry * .4)} Z`, f >= 4 ? 'url(#gGold)' : cel(c.horn, '#1a1236'), 4.5);
    if (f >= 2) head += pa(`M${P(100 - 2, hy - hry - hn * .78)} l-9,-4 l7,9 Z`, f >= 4 ? 'url(#gGold)' : c.horn, 3);
    for (const sd of [-1, 1]) head += ln(`M${P(100 + sd * hrx * .45, hy - hry * .7)} Q${P(100 + sd * (hrx * .7), hy - hry * 1.35)} ${P(100 + sd * (hrx * .95 + f * 2), hy - hry * 1.2)}`, OL, 4) + ci(100 + sd * (hrx * .95 + f * 2), hy - hry * 1.2, 4, c.sh, 2.5);
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    head += pa(`M${P(100 - hrx * .8, hy - hry * .5)} Q${P(100, hy - hry * 1.15)} ${P(100 + hrx * .8, hy - hry * .5)} Q${P(100, hy - hry * .7)} ${P(100 - hrx * .8, hy - hry * .5)} Z`, cel(c.sh, c.shs), 3.5);
    head += lowerFace(g, c.l, 14, .6);
    // Hàm kìm
    for (const sd of [-1, 1]) head += pa(`M${P(100 + sd * 10, hy + hry * .7)} Q${P(100 + sd * 22, hy + hry * .8)} ${P(100 + sd * 12, hy + hry * 1.08)} Q${P(100 + sd * 14, hy + hry * .9)} ${P(100 + sd * 5, hy + hry * .82)} Z`, c.horn, 3);
    head += ln(`M${P(100 - 10, hy + hry * .55)} Q${P(100, hy + hry * .66)} ${P(100 + 10, hy + hry * .52)}`, OL, 3);
    head += eyes2(100, hy - 2, hrx * .44, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .25, hrx * .16, 4);
    if (f >= 4) front += motes('forest', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .9 }) };
  }
};

PET_SPECS.stag = {
  el: 'forest',
  c: { b: '#c98a4a', s: '#8a5428', l: '#fff0d8', ls: '#f0cfa0', i: '#3fe06a', ant: '#9a5a2a', ants: '#5e3414', hoof: '#4a2a1a' },
  c4: { b: '#b8763a', s: '#6e3e18', ant: '#ffd21f', ants: '#d48700', i: '#9df27a' },
  draw(f, g, c) {
    const { hy, hrx } = g, hry = g.hry * 1.04;
    let back = '', body = '', head = '', front = '';
    if (f >= 4) back += auraBack('forest', g);
    back += tailBack(g, 14 + f * 3, 12, c.l);
    body += legs(g, c, { feet: 'hoof', hoof: c.hoof }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .55, g.sy)} Q${P(100, HIP)} ${P(100 + g.ww * .55, g.sy)} Q${P(100, g.sy - 4)} ${P(100 - g.ww * .55, g.sy)} Z`, cel(c.l, c.ls), 3.5);
    body += [[-.5, 16], [.55, 24], [-.2, 34], [.3, 10]].map(([k, dy]) => ci(100 + k * g.sw * 1.4, g.sy + dy, 2.6, c.l, 0)).join('');
    body += arms(g, c, {});
    if (f >= 3) body += pads(g, '#7be35a', '#2f9a3e', { spike: f >= 4, trim: '#d8ffb8', spikeCol: '#d8ffb8', rivet: false });
    // Gạc cành cây
    const A = 16 + f * 10;
    for (const sd of [-1, 1]) {
      const x0 = 100 + sd * hrx * .42, y0 = hy - hry * .7;
      const tx = x0 + sd * A * .8, ty = y0 - A;
      let d = `M${P(x0, y0)} Q${P(x0 + sd * A * .2, y0 - A * .6)} ${P(tx, ty)}`;
      d += ` M${P(x0 + sd * A * .3, y0 - A * .45)} L${P(x0 + sd * A * .05, y0 - A * .85)}`;
      if (f >= 2) d += ` M${P(x0 + sd * A * .55, y0 - A * .75)} L${P(x0 + sd * A * .42, y0 - A * 1.15)}`;
      if (f >= 3) d += ` M${P(x0 + sd * A * .45, y0 - A * .58)} L${P(x0 + sd * A * 1.05, y0 - A * .62)}`;
      head += tube(d, f >= 4 ? '#ffd21f' : c.ant, 5 + f, 3.5);
      head += leaf(tx, ty, 9 + f * 2, sd < 0 ? -120 : -60, '#7be35a', '#2f9a3e', 2.6);
      if (f >= 3) head += leaf(x0 + sd * A * 1.05, y0 - A * .62, 10, sd < 0 ? 170 : 10, '#9df27a', '#2f9a3e', 2.4);
      if (f >= 4) head += flower(x0 + sd * A * .05, y0 - A * .85, 5, '#ff5fa2');
    }
    const L = earPointy(100 - hrx * .78, hy - hry * .3, -1, 20 + f * 2, 16, -62, c.b, '#ffb3c8');
    const R = earPointy(100 + hrx * .78, hy - hry * .3, 1, 20 + f * 2, 16, -62, c.b, '#ffb3c8');
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx * .88}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += el(100, hy + hry * .58, hrx * .45, hry * .36, cel(c.l, c.ls), 4) + el(100, hy + hry * .45, 8, 5.5, OL, 0) + hl(97, hy + hry * .4, 2.5, 1.2, 0, .8);
    head += ln(`M${P(100, hy + hry * .52)} v5 M${P(100 - 8, hy + hry * .78)} Q${P(100, hy + hry * .84)} ${P(100 + 8, hy + hry * .76)}`, OL, 3);
    head += eyes2(100, hy - 6, hrx * .4, g.er * .95, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .45, hy - hry * .5, hrx * .16, 4);
    if (f >= 4) front += motes('forest', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .9 }) };
  }
};

PET_SPECS.panda = {
  el: 'forest',
  c: { b: '#ffffff', s: '#c9cbe0', l: '#ffffff', ls: '#e3e6f5', dk: '#2a2448', dks: '#140f2e', i: '#3fe06a', arm: null },
  c4: { b: '#f6f7ff', s: '#b5b8d6', i: '#9df27a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Gậy tre sau lưng
    if (f >= 2) { const L = 96 + f * 16; back += `<g transform="rotate(-52 100 ${f1(g.sy + 20)})">` + tube(`M100,${f1(g.sy + 20 - L * .5)} V${f1(g.sy + 20 + L * .5)}`, '#8fd65a', 10, 4) + [-.3, 0, .3].map(k => ln(`M95,${f1(g.sy + 20 + k * L)} h10`, '#2f9a3e', 3)).join('') + leaf(100, g.sy + 20 - L * .5, 14, -60, '#7be35a', '#2f9a3e', 2.6) + `</g>`; }
    if (f >= 4) back = auraBack('forest', g) + back;
    const cd = Object.assign({}, c, { b: c.dk, s: c.dks, b2: c.dk });
    body += legs(g, cd, {}) + torso(g, c);
    // Đai võ
    body += pa(`M${P(100 - g.ww - 1, HIP - 22)} Q${P(100, HIP - 16)} ${P(100 + g.ww + 1, HIP - 22)} L${P(100 + g.ww + 2, HIP - 13)} Q${P(100, HIP - 7)} ${P(100 - g.ww - 2, HIP - 13)} Z`, f >= 3 ? '#2a2448' : f === 2 ? '#3fe06a' : '#fff6d8', 3.5);
    if (f >= 2) body += pa(`M${P(100 + 4, HIP - 15)} l7,12 l5,-3 l-6,-10 Z`, f >= 3 ? '#2a2448' : '#3fe06a', 3);
    body += pa(`M${P(100 - g.sw * .95, g.sy + 2)} Q${P(100, g.sy - 8)} ${P(100 + g.sw * .95, g.sy + 2)} L${P(100 + g.sw * .9, g.sy + 12)} Q${P(100, g.sy + 2)} ${P(100 - g.sw * .9, g.sy + 12)} Z`, cel(c.dk, c.dks), 0);
    body += arms(g, cd, {});
    if (f >= 3) body += pads(g, '#7be35a', '#2f9a3e', { spike: f >= 4, trim: '#d8ffb8', spikeCol: '#d8ffb8', rivet: false });
    // Đầu gấu trúc
    let ears = '';
    for (const sd of [-1, 1]) ears += `<circle cx="${f1(100 + sd * hrx * .7)}" cy="${f1(hy - hry * .72)}" r="${f1(13 + f)}"/>`;
    head += bl(ears, cel(c.dk, c.dks)) + bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    for (const sd of [-1, 1]) head += `<ellipse cx="${f1(100 + sd * hrx * .4)}" cy="${f1(hy + 1)}" rx="${f1(g.er * 1.45)}" ry="${f1(g.er * 1.2)}" fill="${c.dk}" transform="rotate(${sd * -25} ${f1(100 + sd * hrx * .4)} ${f1(hy + 1)})"/>`;
    head += el(100, hy + hry * .46, hrx * .34, hry * .26, '#ffffff', 3.5) + pa(`M${P(100 - 7, hy + hry * .32)} Q${P(100, hy + hry * .25)} ${P(100 + 7, hy + hry * .32)} Q${P(100, hy + hry * .48)} ${P(100 - 7, hy + hry * .32)} Z`, OL, 0);
    head += grin(100, hy + hry * .62, hrx * .22, f);
    head += eyes2(100, hy - 2, hrx * .4, g.er * .85, g.er * .95, { skin: c.dk, iris: c.i, lid: g.lid, brow: OL });
    head += hl(100 - hrx * .5, hy - hry * .55, hrx * .2, 4.5);
    // Băng đô lá tre
    head += pa(`M${P(100 - hrx * .96, hy - hry * .42)} Q${P(100, hy - hry * .78)} ${P(100 + hrx * .96, hy - hry * .42)} L${P(100 + hrx * .98, hy - hry * .28)} Q${P(100, hy - hry * .64)} ${P(100 - hrx * .98, hy - hry * .28)} Z`, f >= 3 ? '#2f9a3e' : '#3fe06a', 3.5);
    head += leaf(100 + hrx * .9, hy - hry * .35, 14 + f * 3, -20, '#7be35a', '#2f9a3e', 2.6) + leaf(100 + hrx * .9, hy - hry * .35, 12 + f * 2, 30, '#9df27a', '#2f9a3e', 2.6);
    if (f >= 4) { head += leafCrown(100, hy - hry * .85, 34, 5, 20); front += motes('forest', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

/* ---------- BÓNG ĐÊM ---------- */
// Ngọn lửa ma tím
const ghostFlame = (x, y, h, w, tilt = 0) => flame(x, y, h, w, tilt, true, 3.5).replace('url(#gFlame)', 'url(#gShadowFire)').replace('#fff59a', '#ffd6fb');
const moonCrest = (x, y, r) => pa(`M${P(x - r * .2, y - r)} A${f1(r)},${f1(r)} 0 1 0 ${P(x + r * .9, y + r * .4)} A${f1(r * .78)},${f1(r * .78)} 0 1 1 ${P(x - r * .2, y - r)} Z`, 'url(#gGold)', 3.5);
PET_SPECS.bat = {
  el: 'shadow',
  c: { b: '#7a52d6', s: '#3f2496', l: '#d6c4ff', ls: '#a68ae6', i: '#ff4fd8', mem: '#4a2aa0', bone: '#2a165e', w: '#7a52d6', ws: '#3f2496' },
  c4: { b: '#5f38c0', s: '#2a1270', mem: '#7a1fb0', i: '#ffb3f5' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    const sp = [0, 30, 44, 60, 78][f], h = [0, 22, 32, 46, 62][f];
    back += batWing(g, -1, sp, h, c.bone, c.mem) + batWing(g, 1, sp, h, c.bone, c.mem);
    if (f >= 4) back = auraBack('shadow', g) + back;
    body += legs(g, c, { claws: true }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .36 });
    if (f >= 3) body += chestPlate(g, '#2a165e', '#140a30', moonCrest(100, g.sy + 22, 9 + f), { trim: '#ff4fd8' });
    body += arms(g, c, { claws: true });
    if (f >= 3) body += pads(g, '#2a165e', '#140a30', { spike: f >= 4, trim: '#ff4fd8', spikeCol: '#d6c4ff' });
    // Tai to
    const eh = 30 + f * 7;
    const L = earPointy(100 - hrx * .72, hy - hry * .3, -1, eh, 26 + f * 2, 38, c.b, '#ff9ef0');
    const R = earPointy(100 + hrx * .72, hy - hry * .3, 1, eh, 26 + f * 2, 38, c.b, '#ff9ef0');
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/><path d="M${P(100 - 7, hy - hry * .92)} L100,${f1(hy - hry * 1.12)} L${P(100 + 7, hy - hry * .92)} Z"/>`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += lowerFace(g, c.l, 12, .6);
    head += pa(`M${P(100 - 6, hy + 10)} Q${P(100, hy + 6)} ${P(100 + 6, hy + 10)} L${P(100, hy + 16)} Z`, OL, 0);
    head += ln(`M${P(100 - 12, hy + hry * .52)} Q${P(100, hy + hry * .66)} ${P(100 + 12, hy + hry * .5)}`, OL, 3.2) + pa(`M${P(100 - 9, hy + hry * .56)} l2.5,${7 + f} l2.5,${-7 - f} M${P(100 + 4, hy + hry * .58)} l2.5,${7 + f} l2.5,${-7 - f}`, '#fff', 2);
    head += eyes2(100, hy - 4, hrx * .42, g.er, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid });
    head += hl(100 - hrx * .5, hy - hry * .4, hrx * .18, 4);
    if (f >= 4) { head += moonCrest(100, hy - hry * 1.2, 12); front += motes('shadow', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.cat = {
  el: 'shadow',
  c: { b: '#3a2d66', s: '#1d1440', l: '#8f7fd6', ls: '#6a5ab8', i: '#b6ff3b', ear: '#ff4fd8' },
  c4: { b: '#2d2056', s: '#120a2e', i: '#d8ff7a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    const nT = [0, 1, 2, 2, 3][f], T = 40 + f * 10;
    for (let i = 0; i < nT; i++) {
      const a = nT === 1 ? -50 : -20 - i * 50 / (nT - 1), r = a * Math.PI / 180, x = 100 + g.hw - 8, y = HIP - 6, ex = x + Math.cos(r) * T, ey = y + Math.sin(r) * T;
      back += `<g class="pt" style="transform-origin:${f1(x)}px ${y}px;animation-delay:-${i * .5}s">` + tube(`M${P(x - 6, y + 2)} Q${P(x + T * .7, y + 4)} ${P(ex, ey)}`, c.b, 10 + f, 5) + ghostFlame(ex, ey + 8, 18 + f * 3, 13 + f * 2, 2) + `</g>`;
    }
    if (f >= 4) back = auraBack('shadow', g) + back;
    body += legs(g, c, { claws: f >= 2 }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .34 });
    body += arms(g, c, { claws: f >= 2 });
    if (f >= 2) body += pa(`M${P(100 - g.sw * .8, g.sy + 3)} Q${P(100, g.sy + 12)} ${P(100 + g.sw * .8, g.sy + 3)} L${P(100 + g.sw * .75, g.sy + 10)} Q${P(100, g.sy + 19)} ${P(100 - g.sw * .75, g.sy + 10)} Z`, '#ff4fd8', 3) + ci(100, g.sy + 17, 4 + f, 'url(#gGold)', 2.5);
    if (f >= 3) body += pads(g, '#2a165e', '#140a30', { spike: f >= 4, trim: '#b6ff3b', spikeCol: '#d6c4ff' });
    if (f >= 4) body += [-1, 1].map(sd => ghostFlame(100 + sd * (g.sw + 4), g.sy - 4, 22, 15, sd * 3)).join('');
    const eh = 30 + f * 6;
    const L = earPointy(100 - hrx * .6, hy - hry * .5, -1, eh, 26, -12, c.b, c.ear);
    const R = earPointy(100 + hrx * .6, hy - hry * .5, 1, eh, 26, -12, c.b, c.ear);
    let wh = '';
    for (const sd of [-1, 1]) wh += `<path d="M${P(100 + sd * hrx * .85, hy + 4)} L${P(100 + sd * (hrx + 7 + f * 2), hy + 10)} L${P(100 + sd * hrx * .75, hy + hry * .55)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/><path d="${L.outer}"/><path d="${R.outer}"/>${wh}`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += el(100, hy + hry * .48, hrx * .36, hry * .26, c.l, 0);
    head += pa(`M${P(100 - 5, hy + 10)} Q${P(100, hy + 7)} ${P(100 + 5, hy + 10)} L${P(100, hy + 15)} Z`, '#ff4fd8', 2.2);
    head += ln(`M${P(100 - 10, hy + hry * .5)} Q${P(100 - 5, hy + hry * .62)} ${P(100, hy + hry * .48)} Q${P(100 + 5, hy + hry * .62)} ${P(100 + 10, hy + hry * .5)}`, OL, 3) + pa(`M${P(100 + 3, hy + hry * .56)} l2,${5 + f} l2,${-5 - f}`, '#fff', 1.8);
    head += ln(`M${P(100 - hrx * .62, hy + 12)} l-14,-2 M${P(100 - hrx * .6, hy + 18)} l-14,3 M${P(100 + hrx * .62, hy + 12)} l14,-2 M${P(100 + hrx * .6, hy + 18)} l14,3`, '#d6c4ff', 2.2);
    head += eyes2(100, hy - 4, hrx * .42, g.er * 1.05, g.er + 1, { skin: c.b, iris: c.i, lid: g.lid, slit: true });
    head += hl(100 - hrx * .5, hy - hry * .45, hrx * .18, 4);
    if (f >= 3) head += ghostFlame(100, hy - hry * .82, 18 + f * 4, 14 + f * 2, 2);
    if (f >= 4) front += motes('shadow', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.owl = {
  el: 'shadow',
  c: { b: '#3f4fbf', s: '#1f2a7a', l: '#c9d0ff', ls: '#97a2e6', i: '#ffd21f', disc: '#e3e0ff', discs: '#b3aee6', beak: '#ffb21f', w: '#3f4fbf', ws: '#1f2a7a' },
  c4: { b: '#2f3cab', s: '#141c62', i: '#fff59a' },
  draw(f, g, c) {
    const { hy } = g, hrx = g.hrx * 1.05, hry = g.hry * 1.02;
    let back = '', body = '', head = '', front = '';
    if (f >= 2) { const sp = [0, 0, 30, 48, 68][f], h = [0, 0, 26, 42, 60][f]; back += featherWing(g, -1, sp, h, c.b, '#8a5cff', '#1f2a7a') + featherWing(g, 1, sp, h, c.b, '#8a5cff', '#1f2a7a'); }
    if (f >= 4) back = auraBack('shadow', g) + back;
    body += legs(g, c, { feet: 'bird' }) + torso(g, c) + belly(g, cel(c.l, c.ls), { k: .42, kx: .74 });
    for (let r = 0; r < 3; r++) for (let i = -1; i <= 1; i++) body += ln(`M${P(100 + i * 9 - 3 + (r % 2) * 4, g.sy + 16 + r * 9)} q3,4 6,0`, c.ls, 2.2);
    body += wingArms(g, c);
    if (f >= 3) body += pads(g, '#2a165e', '#140a30', { spike: f >= 4, trim: '#ffd21f', spikeCol: '#d6c4ff' });
    // Túm lông tai
    const tf = 8 + f * 3;
    let tufts = '';
    for (const sd of [-1, 1]) tufts += `<path d="M${P(100 + sd * hrx * .3, hy - hry * .92)} L${P(100 + sd * hrx * .62, hy - hry - tf)} L${P(100 + sd * hrx * .5, hy - hry * .9 - tf * .3)} L${P(100 + sd * hrx * .85, hy - hry * .85 - tf * .9)} L${P(100 + sd * hrx * .9, hy - hry * .5)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${tufts}`, cel(c.b, c.s));
    // Đĩa mặt
    head += pa(`M100,${f1(hy - 2)} Q${P(100 - hrx * .25, hy - hry * .7)} ${P(100 - hrx * .6, hy - hry * .55)} Q${P(100 - hrx * .95, hy)} ${P(100 - hrx * .6, hy + hry * .6)} Q${P(100 - hrx * .25, hy + hry * .75)} ${P(100, hy + hry * .5)} Q${P(100 + hrx * .25, hy + hry * .75)} ${P(100 + hrx * .6, hy + hry * .6)} Q${P(100 + hrx * .95, hy)} ${P(100 + hrx * .6, hy - hry * .55)} Q${P(100 + hrx * .25, hy - hry * .7)} ${P(100, hy - 2)} Z`, cel(c.disc, c.discs), 3.5);
    head += pa(`M${P(100 - 8, hy + 6)} Q${P(100, hy + 2)} ${P(100 + 8, hy + 6)} L${P(100, hy + 20 + f)} Z`, cel(c.beak, '#e07a00'), 3.5);
    head += eyes2(100, hy - 4, hrx * .42, g.er * 1.25, g.er * 1.3, { skin: c.disc, iris: c.i, lid: g.lid * .85 });
    head += hl(100 - hrx * .62, hy - hry * .62, hrx * .16, 4);
    if (f >= 3) head += moonCrest(100, hy - hry * 1.02, 8 + f * 2);
    if (f >= 4) front += motes('shadow', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .98 }) };
  }
};

PET_SPECS.panther = {
  el: 'shadow',
  c: { b: '#2e2452', s: '#140d30', l: '#5a4a96', ls: '#3e3070', i: '#ff4fd8', ro: '#4d3d8a', ear: '#ff4fd8' },
  c4: { b: '#231a44', s: '#0b0620', i: '#ffb3f5' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    back += tailBack(g, 40 + f * 10, 10 + f, c.b, (x, y) => ghostFlame(x, y + 8, 16 + f * 4, 12 + f * 2, 2));
    if (f >= 3) back = flameMane(g, 7, 24 + f * 4).replace(/url\(#gFlame\)/g, 'url(#gShadowFire)').replace(/#fff59a/g, '#ffd6fb') + back;
    if (f >= 4) back = auraBack('shadow', g) + back;
    body += legs(g, c, { claws: true }) + torso(g, c);
    body += [[-.6, 14], [.5, 22], [-.2, 30], [.65, 36], [-.7, 40]].map(([k, dy]) => `<circle cx="${f1(100 + k * g.sw)}" cy="${f1(g.sy + dy)}" r="3.6" fill="none" stroke="${c.ro}" stroke-width="2.4"/>`).join('');
    body += arms(g, c, { claws: true });
    if (f >= 2) body += [-1, 1].map(sd => pa(`M${P(100 + sd * (g.sw + g.at * .9), g.sy + g.al * .3)} l${sd * (8 + f * 3)},-4 l${-sd * 4},8 Z`, '#ff4fd8', 2.4)).join('');
    if (f >= 3) body += pads(g, '#ff4fd8', '#a8208e', { spike: f >= 4, trim: '#ffd6fb', spikeCol: '#d6c4ff', rivet: false });
    const eh = 24 + f * 5;
    const L = earPointy(100 - hrx * .62, hy - hry * .55, -1, eh, 22, -18, c.b, c.ear);
    const R = earPointy(100 + hrx * .62, hy - hry * .55, 1, eh, 22, -18, c.b, c.ear);
    let ch = '';
    for (const sd of [-1, 1]) ch += `<path d="M${P(100 + sd * hrx * .85, hy)} L${P(100 + sd * (hrx + 8 + f * 2), hy + 12)} L${P(100 + sd * hrx * .7, hy + hry * .62)} Z"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry * .94}"/><path d="${L.outer}"/><path d="${R.outer}"/>${ch}`, cel(c.b, c.s));
    head += L.inner + R.inner;
    head += snout(100, hy + hry * .48, hrx * .4, hry * .3, c.l, '#ff4fd8');
    head += grin(100, hy + hry * .7, hrx * .26, f, { both: true });
    head += eyes2(100, hy - 4, hrx * .42, g.er, g.er * .9, { skin: c.b, iris: c.i, lid: Math.max(.6, g.lid), slit: true });
    head += hl(100 - hrx * .5, hy - hry * .5, hrx * .18, 4);
    if (f >= 2) head += pa(`M${P(100 - 4, hy - hry * .9)} L100,${f1(hy - hry * .55)} L${P(100 + 4, hy - hry * .9)} Z`, '#ff4fd8', 2.2);
    if (f >= 4) { head += moonCrest(100, hy - hry * 1.15, 11); front += motes('shadow', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

/* ---------- THÉP ---------- */
const bolts4 = (pts_) => pts_.map(([x, y]) => rivet(x, y, 2.3)).join('');
const visorGlow = (x, y, w, h, col = '#ff2e4a') => `<rect x="${f1(x - w / 2)}" y="${f1(y - h / 2)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(h / 2)}" fill="${col}" stroke="${OL}" stroke-width="3.5"/>` + `<rect x="${f1(x - w / 2 + 4)}" y="${f1(y - h / 2 + 2.5)}" width="${f1(w * .4)}" height="${f1(h * .28)}" rx="1.5" fill="#fff" opacity=".7"/>`;
PET_SPECS.bear = {
  el: 'metal',
  c: { b: '#a7b8d0', s: '#56698c', l: '#e6edf7', ls: '#bfcbe0', i: '#33e1ff', pl: '#6c81a3', pls: '#3d4c66' },
  c4: { b: '#8fa2c0', s: '#3d4c70', i: '#bff4ff' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 3) back += [-1, 1].map(sd => tube(`M${P(100 + sd * g.sw * .5, g.sy + 4)} L${P(100 + sd * (g.sw * .5 + 8), g.sy - 30 - f * 5)}`, '#56698c', 6, 3.5) + ci(100 + sd * (g.sw * .5 + 8), g.sy - 30 - f * 5, 4.5, '#ff2e4a', 2.5)).join('');
    if (f >= 4) back = auraBack('metal', g) + back;
    body += legs(g, c, {}) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .7, g.sy + 10)} L${P(100 + g.ww * .7, g.sy + 10)} L${P(100 + g.ww * .8, g.sy + 30)} L${P(100 + g.ww * .5, HIP - 6)} L${P(100 - g.ww * .5, HIP - 6)} L${P(100 - g.ww * .8, g.sy + 30)} Z`, cel(c.pl, c.pls), 4) +
      bolts4([[100 - g.ww * .55, g.sy + 15], [100 + g.ww * .55, g.sy + 15], [100 - g.ww * .4, HIP - 11], [100 + g.ww * .4, HIP - 11]]);
    body += bolt(100 - 4, g.sy + 16, 16 + f * 3, '#ffd21f', 2.6);
    body += arms(g, c, {});
    if (f >= 2) body += pads(g, c.pl, c.pls, { spike: f >= 4, trim: '#33e1ff' });
    let ears = '';
    for (const sd of [-1, 1]) ears += `<circle cx="${f1(100 + sd * hrx * .78)}" cy="${f1(hy - hry * .72)}" r="${f1(14 + f)}"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${ears}`, cel(c.b, c.s));
    for (const sd of [-1, 1]) head += ci(100 + sd * hrx * .78, hy - hry * .72, 7.5, c.pl, 3) + ln(`M${P(100 + sd * hrx * .78 - 4, hy - hry * .72)} h8 M${P(100 + sd * hrx * .78, hy - hry * .72 - 4)} v8`, '#e6edf7', 2);
    head += pa(`M${P(100 - hrx * .66, hy - hry * .48)} Q${P(100, hy - hry * 1.05)} ${P(100 + hrx * .66, hy - hry * .48)} L${P(100 + hrx * .6, hy - hry * .28)} Q${P(100, hy - hry * .75)} ${P(100 - hrx * .6, hy - hry * .28)} Z`, cel(c.pl, c.pls), 4) + bolts4([[100 - hrx * .35, hy - hry * .62], [100, hy - hry * .78], [100 + hrx * .35, hy - hry * .62]]);
    head += el(100, hy + hry * .5, hrx * .5, hry * .36, cel(c.l, c.ls), 4);
    head += `<rect x="${f1(100 - 10)}" y="${f1(hy + hry * .26)}" width="20" height="11" rx="5.5" fill="${OL}"/>` + hl(96, hy + hry * .3, 3.5, 1.5, 0, .7);
    head += ln(`M${P(100, hy + hry * .5)} v5 M${P(100 - 11, hy + hry * .68)} Q${P(100, hy + hry * .78)} ${P(100 + 11, hy + hry * .66)}`, OL, 3.2);
    head += eyes2(100, hy - 4, hrx * .42, g.er * .92, g.er, { skin: c.b, iris: c.i, lid: g.lid });
    head += ln(`M${P(100 + hrx * .7, hy - hry * .2)} L${P(100 + hrx * .35, hy + hry * .3)}`, c.pls, 2.6);
    head += hl(100 - hrx * .5, hy - hry * .42, hrx * .18, 4);
    if (f >= 4) { head += crownSpikes(100, hy - hry * 1.02, hrx * .7).replace('url(#gGold)', 'url(#gSteelG)'); front += motes('metal', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.scorpion = {
  el: 'metal',
  c: { b: '#e05a4a', s: '#9a2a2a', l: '#ffd0b8', ls: '#f0a088', i: '#ffd21f', pl: '#7a8aa8', pls: '#3d4c66' },
  c4: { b: '#c8382e', s: '#6e1414', pl: '#5a6a88', pls: '#28324a', i: '#fff59a' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    // Đuôi đốt cong từ hông phải vòng lên trên đầu
    const n = 5 + f, top = g.hy - g.hry - 14 - f * 5;
    const B = [[100 + g.hw + 2, HIP - 12], [100 + g.sw + 46 + f * 4, g.sy + 10], [100 + 50 + f * 4, top - 22], [100 + 6, top]];
    const bz = t => { const u = 1 - t; return [0, 1].map(k => u * u * u * B[0][k] + 3 * u * u * t * B[1][k] + 3 * u * t * t * B[2][k] + t * t * t * B[3][k]); };
    let segs = '';
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1), [x, y] = bz(t), r = 11 + f * 1.2 - t * 4;
      segs += el(x, y, r, r * .88, cel(c.pl, c.pls), 4) + hl(x - r * .3, y - r * .35, r * .35, r * .15, -20, .6);
      if (i === n - 1) segs += pa(`M${P(x + 2, y - r * .6)} Q${P(x - 14, y - 6)} ${P(x - 16 - f * 2, y + 12 + f * 2)} Q${P(x - 6, y + 4)} ${P(x + 4, y + r * .6)} Z`, f >= 4 ? '#ff2e4a' : cel(c.b, c.s), 4);
    }
    back += `<g class="pt" style="transform-origin:${f1(100 + g.hw)}px ${HIP - 10}px">${segs}</g>`;
    if (f >= 4) back = auraBack('metal', g) + back;
    body += legs(g, c, {}) + torso(g, c);
    for (let i = 0; i < 3; i++) body += pa(`M${P(100 - g.ww * .75, g.sy + 8 + i * 12)} Q${P(100, g.sy + 2 + i * 12)} ${P(100 + g.ww * .75, g.sy + 8 + i * 12)} L${P(100 + g.ww * .72, g.sy + 16 + i * 12)} Q${P(100, g.sy + 10 + i * 12)} ${P(100 - g.ww * .72, g.sy + 16 + i * 12)} Z`, cel(c.pl, c.pls), 3);
    // Tay càng
    for (const sd of [-1, 1]) {
      const sx = 100 + sd * (g.sw - g.at * .3), sY = g.sy + g.at * .8, ex = 100 + sd * (g.sw + g.at), ey = g.sy + g.al * .55, hx = 100 + sd * (g.sw + g.at * .6), hY = g.sy + g.al + 2, r = g.at * 1.25;
      body += bl(`<path d="${capsule(sx, sY, ex, ey, g.at * .9, g.at * .8)}"/><path d="${capsule(ex, ey, hx, hY, g.at * .8, g.at * .75)}"/>`, cel(c.b, c.s), 5);
      body += pa(`M${P(hx - r, hY)} Q${P(hx - r * 1.1, hY - r * 1.3)} ${P(hx - r * .2, hY - r * 1.6)} L${P(hx, hY - r * .5)} L${P(hx + r * .2, hY - r * 1.6)} Q${P(hx + r * 1.1, hY - r * 1.3)} ${P(hx + r, hY)} Q${P(hx, hY + r * .9)} ${P(hx - r, hY)} Z`, cel(c.pl, c.pls), 4.5) + hl(hx - r * .4, hY - r * .3, r * .25, r * .12, -30, .55);
    }
    if (f >= 3) body += pads(g, c.pl, c.pls, { spike: f >= 4, trim: '#ffd21f' });
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>`, cel(c.b, c.s));
    head += pa(`M${P(100 - hrx * .9, hy - hry * .3)} Q${P(100, hy - hry * 1.25)} ${P(100 + hrx * .9, hy - hry * .3)} L${P(100 + hrx * .7, hy - hry * .12)} Q${P(100, hy - hry * .6)} ${P(100 - hrx * .7, hy - hry * .12)} Z`, cel(c.pl, c.pls), 4) + bolts4([[100 - hrx * .45, hy - hry * .52], [100 + hrx * .45, hy - hry * .52]]);
    head += el(100, hy + hry * .52, hrx * .5, hry * .3, c.l, 0);
    head += grin(100, hy + hry * .56, hrx * .28, f, { both: true });
    for (const sd of [-1, 1]) head += pa(`M${P(100 + sd * hrx * .55, hy + hry * .5)} q${f1(sd * 9)},2 ${f1(sd * 7)},${f1(10 + f)} q${f1(-sd * 3)},-6 ${f1(-sd * 9)},-6 Z`, cel(c.pl, c.pls), 3);
    head += eyes2(100, hy, hrx * .4, g.er * .9, g.er * .95, { skin: c.b, iris: c.i, lid: g.lid });
    if (f >= 2) head += visorGlow(100, hy - hry * .68, 18 + f * 3, 6, '#ff2e4a');
    if (f >= 4) front += motes('metal', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .95 }) };
  }
};

PET_SPECS.bull = {
  el: 'metal',
  c: { b: '#6f7fa8', s: '#3a4670', l: '#c9d3ea', ls: '#97a4c4', i: '#ff2e4a', horn: '#eef3fa', hoof: '#2a2448', ring: '#ffd21f' },
  c4: { b: '#4a5680', s: '#222a4a', i: '#ff6b7d' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    if (f >= 4) back += auraBack('metal', g);
    back += tailBack(g, 26 + f * 5, 8, c.b, (x, y) => el(x, y, 6, 8, OL, 0));
    body += legs(g, c, { feet: 'hoof', hoof: c.hoof }) + torso(g, c);
    body += pa(`M${P(100 - g.sw * .85, g.sy + 2)} Q${P(100, g.sy - 6)} ${P(100 + g.sw * .85, g.sy + 2)} L${P(100 + g.ww * .6, g.sy + 26)} Q${P(100, g.sy + 32)} ${P(100 - g.ww * .6, g.sy + 26)} Z`, cel(c.l, c.ls), 3.5);
    if (f >= 2) body += chestPlate(g, '#a7b8d0', '#56698c', visorGlow(100, g.sy + 22, 16 + f * 2, 6, '#ff2e4a'), { trim: '#ff2e4a' });
    body += arms(g, c, {});
    if (f >= 3) body += pads(g, '#a7b8d0', '#56698c', { spike: f >= 4, trim: '#ff2e4a', spikeCol: '#eef3fa' });
    // Sừng bò
    const hn = 18 + f * 8;
    for (const sd of [-1, 1]) { const x = 100 + sd * hrx * .8, y = hy - hry * .45; head += pa(`M${P(x - sd * 4, y - 8)} Q${P(x + sd * hn * .9, y - 6)} ${P(x + sd * hn, y - hn * .9)} Q${P(x + sd * hn * .6, y + 4)} ${P(x - sd * 2, y + 8)} Z`, cel(c.horn, '#a7b8d0'), 4.5) + ln(`M${P(x + sd * hn * .45, y - 4)} l${sd * 3},6`, '#56698c', 2.2); }
    let ears = '';
    for (const sd of [-1, 1]) ears += `<ellipse cx="${f1(100 + sd * (hrx + 6))}" cy="${f1(hy - 2)}" rx="13" ry="7" transform="rotate(${sd * 18} ${f1(100 + sd * (hrx + 6))} ${f1(hy - 2)})"/>`;
    head += bl(`<ellipse cx="100" cy="${hy}" rx="${hrx}" ry="${hry}"/>${ears}`, cel(c.b, c.s));
    head += pa(`M${P(100 - 12, hy - hry * .95)} Q${P(100, hy - hry * 1.2)} ${P(100 + 12, hy - hry * .95)} Q${P(100 + 8, hy - hry * .6)} ${P(100, hy - hry * .7)} Q${P(100 - 8, hy - hry * .6)} ${P(100 - 12, hy - hry * .95)} Z`, c.l, 3);
    head += el(100, hy + hry * .55, hrx * .62, hry * .38, cel(c.l, c.ls), 4) + el(100 - 11, hy + hry * .5, 4, 3, OL, 0) + el(100 + 11, hy + hry * .5, 4, 3, OL, 0);
    head += `<ellipse cx="100" cy="${f1(hy + hry * .8)}" rx="9" ry="6" fill="none" stroke="${OL}" stroke-width="7"/><ellipse cx="100" cy="${f1(hy + hry * .8)}" rx="9" ry="6" fill="none" stroke="${c.ring}" stroke-width="3.5"/>`;
    head += eyes2(100, hy - 6, hrx * .45, g.er * .92, g.er * .9, { skin: c.b, iris: c.i, lid: Math.max(.5, g.lid) });
    head += hl(100 - hrx * .55, hy - hry * .45, hrx * .16, 4);
    if (f >= 4) { head += visorGlow(100, hy - hry * .4, 26, 5, '#ff2e4a').replace(/<rect x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*" rx="1.5"[^>]*>/, ''); front += motes('metal', g); }
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .98 }) };
  }
};

PET_SPECS.mecha = {
  el: 'metal',
  c: { b: '#2fc4a8', s: '#137a6a', l: '#d8fff4', ls: '#9ae6d4', i: '#ff2e4a', pl: '#a7b8d0', pls: '#56698c' },
  c4: { b: '#1aa88e', s: '#0a5a4c', pl: '#8fa2c0', pls: '#3d4c70' },
  draw(f, g, c) {
    const { hy, hrx, hry } = g;
    let back = '', body = '', head = '', front = '';
    back += tailBack(g, 36 + f * 9, 12 + f * 2, c.b, (x, y) => pa(`M${P(x - 6, y + 6)} L${P(x + 10, y - 6)} L${P(x + 4, y + 10)} Z`, '#a7b8d0', 3.5));
    // Gai lưng thép
    for (let i = 0; i < 3 + (f >= 3 ? 2 : 0); i++) { const k = i - (f >= 3 ? 2 : 1), x = 100 + k * 16; back += pa(`M${P(x - 8, g.sy + 2)} L${P(x, g.sy - 14 - f * 3 + Math.abs(k) * 4)} L${P(x + 8, g.sy + 2)} Z`, cel(c.pl, c.pls), 3.5); }
    if (f >= 3) back += [-1, 1].map(sd => `<g transform="translate(${f1(100 + sd * (g.sw + 6))} ${f1(g.sy + 6)})">` + pa(`M-7,0 L7,0 L5,${16 + f * 2} L-5,${16 + f * 2} Z`, cel('#56698c', '#2a3450'), 3.5) + (f >= 4 ? flame(0, 30 + f * 2, 18, 11, 0, true, 3).replace(/translate/, '') : '') + `</g>`).join('');
    if (f >= 4) back = auraBack('metal', g) + back;
    body += legs(g, c, { claws: true }) + torso(g, c);
    body += pa(`M${P(100 - g.ww * .7, g.sy + 6)} Q${P(100, g.sy)} ${P(100 + g.ww * .7, g.sy + 6)} L${P(100 + g.ww * .6, HIP - 4)} Q${P(100, HIP + 2)} ${P(100 - g.ww * .6, HIP - 4)} Z`, cel(c.pl, c.pls), 4);
    body += ci(100, g.sy + 22, 6 + f, '#33e1ff', 3) + ci(100, g.sy + 22, 3 + f * .5, '#ffffff', 0) + bolts4([[100 - g.ww * .45, g.sy + 12], [100 + g.ww * .45, g.sy + 12], [100 - g.ww * .4, HIP - 10], [100 + g.ww * .4, HIP - 10]]);
    body += arms(g, c, { claws: true });
    if (f >= 2) body += pads(g, c.pl, c.pls, { spike: f >= 4, trim: '#33e1ff' });
    // Đầu khủng long máy: mõm vuông, kính đỏ
    head += bl(`<rect x="${f1(100 - hrx)}" y="${f1(hy - hry * .9)}" width="${f1(hrx * 2)}" height="${f1(hry * 1.7)}" rx="${f1(hrx * .55)}"/><rect x="${f1(100 - hrx * .78)}" y="${f1(hy + hry * .2)}" width="${f1(hrx * 1.56)}" height="${f1(hry * .78)}" rx="${f1(hry * .3)}"/>`, cel(c.b, c.s));
    head += pa(`M${P(100 - hrx * .7, hy + hry * .6)} L${P(100 + hrx * .7, hy + hry * .6)}`, 'none', 0) + ln(`M${P(100 - hrx * .72, hy + hry * .58)} H${f1(100 + hrx * .72)}`, OL, 3.5);
    for (let i = 0; i < 5; i++) head += pa(`M${P(100 - hrx * .6 + i * hrx * .3 - 4, hy + hry * .58)} l4,6 l4,-6 Z`, '#fff', 2);
    head += pa(`M${P(100 - hrx * .85, hy - hry * .9 + 6)} Q${P(100, hy - hry * 1.1)} ${P(100 + hrx * .85, hy - hry * .9 + 6)} L${P(100 + hrx * .8, hy - hry * .55)} L${P(100 - hrx * .8, hy - hry * .55)} Z`, cel(c.pl, c.pls), 4) + bolts4([[100 - hrx * .5, hy - hry * .75], [100 + hrx * .5, hy - hry * .75]]);
    head += visorGlow(100, hy - 4, hrx * 1.45, 15 + f, c.i);
    head += `<circle cx="${f1(100 - hrx * .38)}" cy="${f1(hy - 4)}" r="${f1(3.5 + f * .5)}" fill="#fff"/><circle cx="${f1(100 + hrx * .38)}" cy="${f1(hy - 4)}" r="${f1(3.5 + f * .5)}" fill="#fff"/>`;
    head += ln(`M${P(100 - hrx * .7, hy - 16 - f)} L${P(100 - hrx * .15, hy - 11)} M${P(100 + hrx * .7, hy - 16 - f)} L${P(100 + hrx * .15, hy - 11)}`, OL, 5);
    head += el(100 - 8, hy + hry * .36, 2.6, 1.8, OL, 0) + el(100 + 8, hy + hry * .36, 2.6, 1.8, OL, 0);
    if (f >= 3) head += tube(`M${P(100 + hrx * .55, hy - hry * .85)} L${P(100 + hrx * .7, hy - hry * 1.35)}`, '#56698c', 4, 3) + ci(100 + hrx * .7, hy - hry * 1.35, 4.5, '#33e1ff', 2.5);
    if (f >= 4) front += motes('metal', g);
    return { back, body, head, front, anc: stdAnc(g, { headTop: hy - hry * .98, eyeY: hy - 4 }) };
  }
};
