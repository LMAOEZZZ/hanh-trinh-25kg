/* ===================== LÕI ĐỒ HỌA: nét, khối, đổ bóng cel, mắt ===================== */
const OL = '#140a30';
const f1 = n => Math.round(n * 10) / 10;
const pa = (d, fill, w = 5, ex = '') => `<path d="${d}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${ex}/>`;
const el = (cx, cy, rx, ry, fill, w = 5, ex = '') => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" ${ex}/>`;
const ci = (cx, cy, r, fill, w = 3, ex = '') => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" ${ex}/>`;
const ln = (d, c = OL, w = 4, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
const hl = (cx, cy, rx, ry, rot = -25, op = .5) => `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${f1(cx)} ${f1(cy)})"/>`;
// Gộp nhiều hình thành một khối chung một đường viền ngoài
const bl = (shapes, fill, w = 5.5) => `<g fill="${OL}" stroke="${OL}" stroke-width="${w * 2}" stroke-linejoin="round" stroke-linecap="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;
// Nét có viền (ống, đuôi, dây)
const tube = (d, c, w, ow = 3.5) => ln(d, OL, w + ow * 2) + ln(d, c, w);
const P = (x, y) => `${f1(x)},${f1(y)}`;
const pts = a => a.map(([x, y]) => P(x, y)).join(' ');
const poly = (a, fill, w = 4, ex = '') => `<polygon points="${pts(a)}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" stroke-linejoin="round" ${ex}/>`;
const mx = (x, side) => 100 + side * (x - 100); // lật qua trục x = 100

/* ----- Đổ bóng cel: base + shade cắt gắt, đăng ký một lần ----- */
const CEL = new Map();
let celDirty = false;
function cel(base, shade, k = .62) {
  const key = base + shade + k;
  let id = CEL.get(key);
  if (!id) { id = 'c' + CEL.size.toString(36); CEL.set(key, id); celDirty = true; }
  return `url(#${id})`;
}
// Gradient tuyến tính dọc (trời, nước...) đăng ký chung với cel
const LIN = new Map();
function lin(...cols) {
  const key = cols.join(',');
  let id = LIN.get(key);
  if (!id) { id = 'l' + LIN.size.toString(36); LIN.set(key, id); celDirty = true; }
  return `url(#${id})`;
}
function celDefsHTML() {
  let s = '';
  LIN.forEach((id, key) => { const c = key.split(','); s += `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${c.map((x, i) => `<stop offset="${f1(i / (c.length - 1))}" stop-color="${x}"/>`).join('')}</linearGradient>`; });
  CEL.forEach((id, key) => {
    const base = key.slice(0, 7), shade = key.slice(7, 14), k = key.slice(14);
    s += `<radialGradient id="${id}" cx=".34" cy=".26" r="1" fx=".34" fy=".26"><stop offset="${k}" stop-color="${base}"/><stop offset="${k}" stop-color="${shade}"/></radialGradient>`;
  });
  return s;
}
function flushCel() {
  if (!celDirty) return;
  const d = document.getElementById('celdefs');
  if (d) { d.innerHTML = `<defs>${celDefsHTML()}</defs>`; celDirty = false; }
}

/* ----- Hình cơ bản ----- */
// Khối con nhộng giữa hai điểm (tay, chân, cổ)
function capsule(x1, y1, x2, y2, r1, r2 = r1) {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
  return `M${P(x1 + nx * r1, y1 + ny * r1)} L${P(x2 + nx * r2, y2 + ny * r2)} A${f1(r2)},${f1(r2)} 0 0 0 ${P(x2 - nx * r2, y2 - ny * r2)} L${P(x1 - nx * r1, y1 - ny * r1)} A${f1(r1)},${f1(r1)} 0 0 0 ${P(x1 + nx * r1, y1 + ny * r1)} Z`;
}
function starPath(cx, cy, R, r, n = 5, rot = -90) {
  let d = '';
  for (let i = 0; i < n * 2; i++) { const a = (rot + i * 180 / n) * Math.PI / 180, rr = i % 2 ? r : R; d += (i ? 'L' : 'M') + P(cx + rr * Math.cos(a), cy + rr * Math.sin(a)); }
  return d + 'Z';
}
const spark4 = (cx, cy, R, c = '#fff', w = 2, cls = '', delay = 0) =>
  `<path ${cls ? `class="${cls}" style="animation-delay:${delay}s"` : ''} d="M${P(cx, cy - R)} Q${P(cx + R * .2, cy - R * .2)} ${P(cx + R, cy)} Q${P(cx + R * .2, cy + R * .2)} ${P(cx, cy + R)} Q${P(cx - R * .2, cy + R * .2)} ${P(cx - R, cy)} Q${P(cx - R * .2, cy - R * .2)} ${P(cx, cy - R)}Z" fill="${c}" stroke="${OL}" stroke-width="${w}" stroke-linejoin="round"/>`;
// Ngọn lửa hướng lên, chân tại (x, y), cao h
function flame(x, y, h, w = h * .62, tilt = 0, core = true, sw = 4) {
  const d = `M${P(x - w * .5, y)} C${P(x - w * .62, y - h * .38)} ${P(x - w * .1, y - h * .5)} ${P(x - w * .2 + tilt * .4, y - h * .78)} C${P(x + w * .08 + tilt * .5, y - h * .62)} ${P(x + w * .12 + tilt * .7, y - h * .6)} ${P(x + w * .16 + tilt, y - h)} C${P(x + w * .6 + tilt * .4, y - h * .64)} ${P(x + w * .64, y - h * .3)} ${P(x + w * .5, y)} Q${P(x, y + h * .12)} ${P(x - w * .5, y)} Z`;
  let s = pa(d, 'url(#gFlame)', sw);
  if (core) s += pa(`M${P(x - w * .26, y - h * .04)} C${P(x - w * .3, y - h * .26)} ${P(x - w * .04, y - h * .32)} ${P(x + w * .02 + tilt * .3, y - h * .52)} C${P(x + w * .3 + tilt * .2, y - h * .32)} ${P(x + w * .32, y - h * .14)} ${P(x + w * .24, y - h * .03)} Q${P(x, y + h * .04)} ${P(x - w * .26, y - h * .04)} Z`, '#fff59a', 0);
  return s;
}
// Tia sét chữ Z, đỉnh (x, y), cao h
function bolt(x, y, h, c = '#ffd21f', sw = 3.5) {
  const u = h / 10;
  return pa(`M${P(x + u * 1.2, y)} L${P(x - u * 2.6, y + u * 5.2)} L${P(x - u * .1, y + u * 5)} L${P(x - u * 1.6, y + u * 10)} L${P(x + u * 3, y + u * 3.8)} L${P(x + u * .4, y + u * 4)} L${P(x + u * 2.4, y)} Z`, c, sw);
}
// Tinh thể (băng, đá quý)
function crystal(x, y, h, w, c, cd, sw = 3.5, tilt = 0) {
  const t = tilt;
  return pa(`M${P(x - w / 2, y)} L${P(x - w / 2 + t * .5, y - h * .7)} L${P(x + t, y - h)} L${P(x + w / 2 + t * .5, y - h * .7)} L${P(x + w / 2, y)} Z`, c, sw) +
    pa(`M${P(x + t * .1, y)} L${P(x + t * .6, y - h * .72)} L${P(x + t, y - h)} L${P(x + w / 2 + t * .5, y - h * .7)} L${P(x + w / 2, y)} Z`, cd, 0, 'opacity=".55"') +
    ln(`M${P(x - w / 2 + t * .5, y - h * .7)} L${P(x + t * .6, y - h * .72)} L${P(x + w / 2 + t * .5, y - h * .7)} M${P(x + t * .6, y - h * .72)} L${P(x + t * .1, y)}`, OL, 1.8);
}
function leaf(x, y, len, ang, c = '#7be35a', cd = '#2f9a3e', sw = 3) {
  const a = ang * Math.PI / 180, ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, nx = -Math.sin(a) * len * .32, ny = Math.cos(a) * len * .32;
  const mx_ = (x + ex) / 2, my = (y + ey) / 2;
  return pa(`M${P(x, y)} Q${P(mx_ + nx, my + ny)} ${P(ex, ey)} Q${P(mx_ - nx, my - ny)} ${P(x, y)} Z`, c, sw) + ln(`M${P(x, y)} L${P(x + (ex - x) * .8, y + (ey - y) * .8)}`, cd, 1.8);
}
// Đinh tán
const rivet = (x, y, r = 2.6) => ci(x, y, r, '#ffd21f', 1.6) + `<circle cx="${f1(x - r * .3)}" cy="${f1(y - r * .3)}" r="${f1(r * .35)}" fill="#fff"/>`;

/* ----- Mắt ngầu: mí trên xiên vào trong + lông mày dày ----- */
function eye(cx, cy, rx, ry, side, o = {}) {
  const pr = o.pr || rx * .5, lid = o.lid ?? 1;
  const px = cx - side * rx * .18, py = cy + ry * .12;
  let s = '';
  if (o.glow) s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx + 5)}" ry="${f1(ry + 5)}" fill="${o.glow}" opacity=".45"/>`;
  s += `<ellipse cx="${f1(cx)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="${o.white || '#fff'}" stroke="${OL}" stroke-width="${o.ew || 4}"/>`;
  if (o.iris) s += `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(pr * 1.5)}" fill="${o.iris}"/>`;
  s += o.slit ? `<ellipse cx="${f1(px)}" cy="${f1(py)}" rx="${f1(pr * .38)}" ry="${f1(pr * 1.25)}" fill="${OL}"/>` : `<circle cx="${f1(px)}" cy="${f1(py)}" r="${f1(pr)}" fill="${OL}"/>`;
  s += `<circle cx="${f1(px - pr * .45)}" cy="${f1(py - pr * .55)}" r="${f1(pr * .45)}" fill="#fff"/><circle cx="${f1(px + pr * .55)}" cy="${f1(py + pr * .5)}" r="${f1(pr * .2)}" fill="#fff" opacity=".85"/>`;
  if (lid > 0) {
    const adj = (1 - lid) * 32;
    const a1 = side < 0 ? 200 + adj : 340 - adj, a2 = side < 0 ? 358 - adj * .5 : 182 + adj * .5;
    const Q = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = Q(a1), [x2, y2] = Q(a2);
    s += `<path d="M${P(x1, y1)} A${f1(rx)},${f1(ry)} 0 0 ${side < 0 ? 1 : 0} ${P(x2, y2)} Z" fill="${o.skin || '#888'}"/>`;
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, e = 4.5;
    s += ln(`M${P(x1 - ux * e, y1 - uy * e - 1.5)} L${P(x2 + ux * e * .7, y2 + uy * e * .7)}`, o.brow || OL, o.bw || 6.5);
  } else if (o.brow !== false) {
    s += ln(`M${P(cx - rx * 1.05, cy - ry * 1.25 + side * 2)} Q${P(cx, cy - ry * 1.55)} ${P(cx + rx * 1.05, cy - ry * 1.25 - side * 2)}`, o.brow || OL, o.bw || 5);
  }
  return s;
}
// Đôi mắt đối xứng
const eyes2 = (cx, cy, gap, rx, ry, o) => eye(cx - gap, cy, rx, ry, -1, o) + eye(cx + gap, cy, rx, ry, 1, o);

/* ----- Gradient dùng chung (lửa, vàng, trời...) ----- */
function baseDefs() {
  const lg = (id, st, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  return lg('gFlame', [[0, '#fff59a'], [.45, '#ffb21f'], [1, '#ff3d1a']]) + lg('gGold', [[0, '#fff6b0'], [.5, '#ffd21f'], [1, '#e08a00']]) +
    lg('gIce', [[0, '#f4feff'], [.5, '#8ae8ff'], [1, '#2ea8e0']]) + lg('gMane', [[0, '#2ef2ff'], [.5, '#8a5cff'], [1, '#ff4fd8']]) +
    lg('gHorn', [[0, '#fffbe8'], [1, '#e6c27a']]) + lg('gShadowFire', [[0, '#ffb3f5'], [.45, '#d24cff'], [1, '#5a1fb0']]) +
    lg('gNeon', [[0, '#c9fbff'], [.5, '#33e1ff'], [1, '#1f6fd1']]) + lg('gLeafG', [[0, '#d8ffb8'], [.5, '#7be35a'], [1, '#2f9a3e']]) +
    lg('gLava', [[0, '#fff59a'], [.4, '#ff8a1f'], [1, '#d6201a']]) + lg('gSteelG', [[0, '#f4f7fc'], [.5, '#a7b8d0'], [1, '#56698c']]) +
    lg('gWater', [[0, '#bff4ff'], [1, '#3fbfff']]) +
    `<radialGradient id="gEgg" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fffdf0"/><stop offset=".55" stop-color="#ffeab0"/><stop offset="1" stop-color="#e0ad55"/></radialGradient>` +
    `<radialGradient id="gSun" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbd0"/><stop offset=".6" stop-color="#ffd84a"/><stop offset="1" stop-color="#ffaa1f"/></radialGradient>` +
    `<radialGradient id="gGlow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`;
}
