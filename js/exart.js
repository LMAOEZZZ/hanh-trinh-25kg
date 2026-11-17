/* ===================== HÌNH MINH HỌA BÀI TẬP (viewBox 0 0 160 120, sàn y = 108) ===================== */
const XC = { skin: '#ffcf9e', skinS: '#e8a070', shirt: '#ff7a2b', shirtS: '#c2480f', pants: '#4130c4', pantsS: '#2a1f80', shoe: '#2a2448', hair: '#2a1a40',
  steel: '#a7b8d0', steelS: '#56698c', plate: '#ff3b4f', plateS: '#b81d3a', pad: '#5d5596', padS: '#3a3270', frame: '#7a86a8' };
const XW = 3.2;
const cap2 = (a, b, r1, r2, fill) => pa(capsule(a[0], a[1], b[0], b[1], r1, r2), fill, XW);
const lerp2 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
// Người mập mạp nhìn nghiêng (fd: 1 quay phải, -1 quay trái) hoặc nhìn thẳng (front)
function man(J, o = {}) {
  const fd = J.fd || 1, far = o.front ? 0 : 1;
  const sh = J.sh || lerp2(J.nk, J.hp, .14);
  const shF = o.front ? [J.nk[0] - 11, J.nk[1] + 5] : sh, shN = o.front ? [J.nk[0] + 11, J.nk[1] + 5] : sh;
  const hpF = o.front ? [J.hp[0] - 6, J.hp[1]] : J.hp, hpN = o.front ? [J.hp[0] + 6, J.hp[1]] : J.hp;
  const shoe = (a, k, dark) => { const dx = o.front ? 0 : fd * 6, tx = J.toe ? J.toe : dx; return el(a[0] + tx, a[1] + 2.5, o.front ? 6 : 8.5, 4.5, dark ? '#1a1236' : XC.shoe, XW); };
  const leg = (h, k, a, dark) => cap2(h, k, 8, 7, dark ? XC.pantsS : XC.pants) + cap2(k, a, 6.2, 5.2, dark ? XC.skinS : XC.skin) + shoe(a, k, dark);
  const arm = (s, e, hd, dark) => cap2(s, e, 5.6, 5, dark ? XC.skinS : XC.skin) + cap2(e, hd, 5, 4.4, dark ? XC.skinS : XC.skin) + ci(hd[0], hd[1], 5.2, dark ? XC.skinS : XC.skin, XW) + ci(s[0], s[1], 7, dark ? XC.shirtS : XC.shirt, XW);
  let s = '';
  if (J.kf) s += leg(hpF, J.kf, J.af, far);
  if (J.ef) s += arm(shF, J.ef, J.hf, far);
  if (o.under) s += o.under;
  s += cap2(J.nk, J.hp, 12, 11.5, cel(XC.shirt, XC.shirtS)) + ci(J.hp[0], J.hp[1], 11, XC.pants, XW);
  if (J.kn) s += leg(hpN, J.kn, J.an, 0);
  if (o.mid) s += o.mid;
  // Đầu
  const [hx, hy] = J.hd;
  s += ci(hx, hy, 10, XC.skin, XW);
  if (o.front) s += pa(`M${hx - 10},${hy - 1} Q${hx - 11},${hy - 13} ${hx},${hy - 13} Q${hx + 11},${hy - 13} ${hx + 10},${hy - 1} Q${hx},${hy - 7} ${hx - 10},${hy - 1} Z`, XC.hair, 2.4) + ci(hx - 4, hy + 1, 1.6, OL, 0) + ci(hx + 4, hy + 1, 1.6, OL, 0) + ln(`M${hx - 7},${hy - 3} l5,1.5 M${hx + 7},${hy - 3} l-5,1.5`, OL, 2) + ln(`M${hx - 3},${hy + 6} q3,1.5 6,0`, OL, 1.8);
  else {
    const fa = J.fa || 0; // góc nghiêng mặt
    s += `<g transform="rotate(${fa} ${hx} ${hy})">` + pa(`M${hx - fd * 10},${hy + 2} Q${hx - fd * 12},${hy - 12} ${hx + fd * 2},${hy - 12} Q${hx + fd * 10},${hy - 11} ${hx + fd * 9},${hy - 4} Q${hx},${hy - 7} ${hx - fd * 4},${hy - 2} Q${hx - fd * 6},${hy + 4} ${hx - fd * 10},${hy + 2} Z`, XC.hair, 2.4) +
      ci(hx + fd * 5, hy, 1.7, OL, 0) + ln(`M${hx + fd * 2},${hy - 4} l${fd * 6},1.5`, OL, 2.2) + ln(`M${hx + fd * 4},${hy + 6} l${fd * 4},-0.5`, OL, 1.8) + ci(hx - fd * 2, hy + 1, 2.4, XC.skinS, 0) + `</g>`;
  }
  if (J.en) s += arm(shN, J.en, J.hn, 0);
  return s;
}
/* ---- Dụng cụ ---- */
const floorX = (y = 108) => ln(`M6,${y} H154`, OL, 3) + `<rect x="6" y="${y + 1.5}" width="148" height="8" fill="#2a1f63" opacity=".55"/>`;
const plateC = (x, y, r = 14, c = XC.plate) => ci(x, y, r, cel(c, XC.plateS), XW) + ci(x, y, r * .45, '#2a2448', 2.4) + ci(x, y, r * .18, XC.steel, 0);
const dbell = (x, y, r = 6.5, rot = 0) => `<g transform="rotate(${rot} ${x} ${y})">` + `<rect x="${x - 2.5}" y="${y - r - 4}" width="5" height="${2 * r + 8}" rx="2" fill="${XC.steel}" stroke="${OL}" stroke-width="2.4"/>` + `<rect x="${x - r}" y="${y - r - 7}" width="${2 * r}" height="7" rx="2.5" fill="#2a2448" stroke="${OL}" stroke-width="2.4"/><rect x="${x - r}" y="${y + r}" width="${2 * r}" height="7" rx="2.5" fill="#2a2448" stroke="${OL}" stroke-width="2.4"/>` + `</g>`;
const dbSide = (x, y, r = 7) => ci(x, y, r, '#2a2448', XW) + ci(x, y, r * .4, XC.steel, 0);
const benchH = (x1, x2, y, legs = true) => (legs ? ln(`M${x1 + 8},${y + 4} V108 M${x2 - 8},${y + 4} V108`, OL, 5) + ln(`M${x1 + 8},${y + 4} V108 M${x2 - 8},${y + 4} V108`, XC.steelS, 2.5) : '') + `<rect x="${x1}" y="${y - 3}" width="${x2 - x1}" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>`;
const padSlant = (x1, y1, x2, y2, w = 9) => pa(capsule(x1, y1, x2, y2, w / 2, w / 2), cel(XC.pad, XC.padS), XW);
const cable = (a, b) => ln(`M${a[0]},${a[1]} L${b[0]},${b[1]}`, '#1a1236', 2.2) + ln(`M${a[0]},${a[1]} L${b[0]},${b[1]}`, '#d4ccff', .8);
const pulley = (x, y) => ci(x, y, 5.5, XC.steel, 2.6) + ci(x, y, 1.8, OL, 0);
const tower = (x, top = 8) => `<rect x="${x - 5}" y="${top}" width="10" height="${108 - top}" rx="3" fill="${cel(XC.frame, XC.steelS)}" stroke="${OL}" stroke-width="${XW}"/>`;
const handleH = (x, y, w = 14) => ln(`M${x - w / 2},${y} H${x + w / 2}`, OL, 6) + ln(`M${x - w / 2},${y} H${x + w / 2}`, XC.steel, 3);
const barTop = (x1, x2, y) => tube(`M${x1},${y} H${x2}`, XC.steel, 4, 3);
// Mũi tên chuyển động (cong khi có q)
function arrowX(x1, y1, x2, y2, q, two) {
  const d = q ? `M${x1},${y1} Q${q[0]},${q[1]} ${x2},${y2}` : `M${x1},${y1} L${x2},${y2}`;
  const tip = (xa, ya, xb, yb) => { const a = Math.atan2(yb - ya, xb - xa), L = 7.5; return `M${P(xb + Math.cos(a) * 2, yb + Math.sin(a) * 2)} L${P(xb - Math.cos(a - .55) * L, yb - Math.sin(a - .55) * L)} L${P(xb - Math.cos(a + .55) * L, yb - Math.sin(a + .55) * L)} Z`; };
  const [cx, cy] = q || [(x1 + x2) / 2, (y1 + y2) / 2];
  let s = ln(d, OL, 7.5) + ln(d, '#ffd21f', 3.6);
  s += pa(tip(cx, cy, x2, y2), '#ffd21f', 2.4);
  if (two) s += pa(tip(cx, cy, x1, y1), '#ffd21f', 2.4);
  return `<g class="xarrow">${s}</g>`;
}
const speed = (x, y) => ln(`M${x},${y} h-14 M${x + 4},${y + 8} h-18 M${x},${y + 16} h-12`, '#d4ccff', 2.6);

/* ---- 1 hình mỗi bài ---- */
const EXA = {
  bench: () => benchH(30, 118, 80) + man({ fd: 1, hd: [112, 66], nk: [98, 70], hp: [56, 72], kf: [40, 64], af: [36, 104], kn: [44, 62], an: [42, 104], fa: -90, ef: [92, 56], hf: [94, 40], en: [100, 56], hn: [98, 40] }) +
    tube('M96,40 V40', XC.steel, 3) + plateC(96, 38, 15) + arrowX(132, 58, 132, 30, null, true),
  ohp: () => man({ fd: 1, hd: [78, 34], nk: [76, 46], hp: [74, 74], kf: [72, 90], af: [70, 106], kn: [78, 90], an: [78, 106], ef: [70, 30], hf: [80, 16], en: [90, 30], hn: [86, 16] }) + plateC(88, 14, 13) + arrowX(118, 46, 118, 14, null, true),
  dips: () => ln('M44,62 H122 M56,62 V108 M112,62 V108', OL, 7) + ln('M44,62 H122 M56,62 V108 M112,62 V108', XC.steel, 3.5) +
    man({ fd: 1, hd: [86, 30], nk: [84, 42], hp: [80, 74], kf: [70, 90], af: [56, 92], kn: [74, 92], an: [60, 96], ef: [68, 52], hf: [80, 62], en: [72, 54], hn: [84, 62] }) + arrowX(132, 36, 132, 66, null, true),
  latraise: () => man({ hd: [80, 26], nk: [80, 40], hp: [80, 72], kf: [74, 90], af: [72, 106], kn: [86, 90], an: [88, 106], ef: [52, 46], hf: [40, 48], en: [108, 46], hn: [120, 48] }, { front: true }) +
    dbell(36, 48, 5.5, 90) + dbell(124, 48, 5.5, 90) + arrowX(30, 80, 26, 50, [18, 66]) + arrowX(130, 80, 134, 50, [142, 66]),
  pushdown: () => tower(140, 6) + pulley(134, 14) + cable([134, 14], [100, 72]) + man({ fd: 1, hd: [80, 28], nk: [78, 40], hp: [74, 72], kf: [70, 90], af: [68, 106], kn: [78, 90], an: [78, 106], ef: [80, 60], hf: [98, 72], en: [84, 60], hn: [100, 74] }) + handleH(100, 74, 12) + arrowX(116, 52, 112, 84, [120, 70]),
  pullup: () => barTop(20, 140, 10) + man({ hd: [80, 32], nk: [80, 46], hp: [80, 78], kf: [76, 94], af: [82, 106], kn: [84, 94], an: [78, 106], ef: [48, 30], hf: [52, 12], en: [112, 30], hn: [108, 12] }, { front: true }) + arrowX(132, 70, 132, 34),
  bbrow: () => man({ fd: 1, hd: [108, 40], nk: [96, 46], hp: [62, 62], kf: [68, 84], af: [62, 106], kn: [74, 84], an: [70, 106], fa: 30, ef: [92, 68], hf: [92, 84], en: [98, 68], hn: [96, 84] }) + plateC(94, 86, 14) + arrowX(124, 92, 124, 62, null, true),
  cablerow: () => tower(146, 60) + pulley(140, 94) + `<rect x="112" y="84" width="8" height="24" rx="2" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + benchH(30, 98, 98, false) +
    man({ fd: 1, hd: [54, 46], nk: [52, 58], hp: [50, 90], kf: [80, 82], af: [104, 90], kn: [82, 84], an: [106, 94], toe: 4, ef: [40, 72], hf: [74, 74], en: [44, 74], hn: [76, 76] }) + cable([78, 76], [140, 94]) + handleH(78, 76, 8) + arrowX(96, 60, 64, 60),
  facepull: () => tower(146, 6) + pulley(140, 30) + cable([140, 30], [96, 34]) + man({ fd: 1, hd: [80, 32], nk: [76, 44], hp: [72, 74], kf: [66, 90], af: [62, 106], kn: [76, 90], an: [80, 106], ef: [70, 30], hf: [94, 30], en: [74, 30], hn: [96, 34] }) + arrowX(126, 48, 100, 48),
  ezcurl: () => man({ fd: 1, hd: [78, 28], nk: [76, 40], hp: [72, 72], kf: [70, 90], af: [68, 106], kn: [76, 90], an: [76, 106], ef: [76, 62], hf: [96, 48], en: [80, 62], hn: [98, 50] }) + plateC(100, 50, 13) + arrowX(110, 84, 120, 46, [128, 76]),
  squat: () => man({ fd: 1, hd: [92, 36], nk: [84, 48], hp: [62, 80], kf: [92, 82], af: [84, 106], kn: [96, 84], an: [88, 106], ef: [70, 60], hf: [80, 46], en: [74, 62], hn: [84, 48], fa: 10 }, { under: plateC(80, 46, 17) }) + arrowX(126, 92, 126, 50, null, true),
  rdl: () => man({ fd: 1, hd: [116, 50], nk: [104, 56], hp: [68, 64], kf: [74, 86], af: [72, 106], kn: [80, 86], an: [78, 106], fa: 40, ef: [98, 76], hf: [96, 92], en: [104, 76], hn: [100, 92] }) + plateC(98, 94, 13) + arrowX(52, 84, 52, 52, [36, 70]),
  legpress: () => padSlant(28, 58, 46, 98, 11) + `<rect x="40" y="96" width="60" height="9" rx="3" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + pa('M100,24 L124,42 L112,56 L88,38 Z', cel(XC.frame, XC.steelS), XW) + ln('M106,48 L130,108', OL, 5) +
    man({ fd: 1, hd: [34, 50], nk: [42, 60], hp: [58, 90], kf: [78, 60], af: [98, 46], kn: [82, 62], an: [102, 48], toe: 3, ef: [52, 82], hf: [62, 92], en: [56, 84], hn: [66, 94], fa: -30 }) + arrowX(108, 80, 132, 58, null, true),
  legcurl: () => benchH(36, 128, 82) + man({ fd: 1, hd: [128, 64], nk: [116, 70], hp: [76, 72], kf: [50, 74], af: [46, 48], kn: [52, 72], an: [48, 46], toe: -4, fa: 70, ef: [118, 84], hf: [126, 92], en: [122, 84], hn: [132, 92] }) + el(44, 42, 7, 5, cel(XC.pad, XC.padS), XW) + arrowX(28, 72, 34, 38, [16, 52]),
  calfraise: () => `<rect x="56" y="98" width="44" height="10" rx="2" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + man({ fd: 1, hd: [78, 22], nk: [76, 34], hp: [74, 66], kf: [74, 82], af: [76, 92], kn: [78, 82], an: [80, 92], toe: 4, ef: [70, 52], hf: [72, 66], en: [82, 52], hn: [84, 66] }) + arrowX(112, 104, 112, 82, null, true),
  inclinedb: () => padSlant(52, 92, 92, 52, 11) + ln('M60,94 V108 M86,70 L96,108', OL, 5) + man({ fd: 1, hd: [100, 46], nk: [90, 56], hp: [62, 86], kf: [46, 82], af: [40, 106], kn: [48, 84], an: [44, 106], fa: -40, ef: [92, 44], hf: [98, 28], en: [100, 46], hn: [104, 30] }) + dbSide(102, 26, 8) + arrowX(126, 58, 122, 26, null, true),
  dbsp: () => `<rect x="62" y="80" width="36" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + ln('M80,89 V108', OL, 5) +
    man({ hd: [80, 32], nk: [80, 46], hp: [80, 78], kf: [62, 86], af: [60, 106], kn: [98, 86], an: [100, 106], ef: [56, 46], hf: [58, 22], en: [104, 46], hn: [102, 22] }, { front: true }) + dbell(58, 18, 5.5, 90) + dbell(102, 18, 5.5, 90) + arrowX(132, 50, 132, 18, null, true),
  machinepress: () => pa('M32,40 L44,40 L50,100 L36,100 Z', cel(XC.pad, XC.padS), XW) + `<rect x="34" y="96" width="70" height="9" rx="3" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + tower(134, 20) + ln('M134,36 L112,56', OL, 6) + ln('M134,36 L112,56', XC.steel, 3) +
    man({ fd: 1, hd: [54, 40], nk: [52, 52], hp: [52, 84], kf: [78, 86], af: [80, 106], kn: [82, 86], an: [84, 106], ef: [72, 60], hf: [96, 58], en: [76, 62], hn: [100, 58] }) + handleH(104, 58, 10) + arrowX(108, 76, 134, 76, null, true),
  cablefly: () => tower(12, 8) + tower(148, 8) + pulley(18, 18) + pulley(142, 18) + cable([18, 18], [68, 58]) + cable([142, 18], [92, 58]) +
    man({ hd: [80, 28], nk: [80, 42], hp: [80, 74], kf: [72, 90], af: [68, 106], kn: [88, 90], an: [92, 106], ef: [56, 52], hf: [70, 60], en: [104, 52], hn: [90, 60] }, { front: true }) + arrowX(36, 48, 62, 76, [40, 72]) + arrowX(124, 48, 98, 76, [120, 72]),
  cablelat: () => tower(148, 50) + pulley(142, 100) + cable([142, 100], [46, 44]) + man({ hd: [84, 28], nk: [84, 42], hp: [84, 74], kf: [78, 90], af: [76, 106], kn: [90, 90], an: [92, 106], ef: [62, 46], hf: [46, 44], en: [104, 56], hn: [100, 72] }, { front: true }) + handleH(44, 44, 8) + arrowX(52, 82, 32, 52, [30, 72]),
  ohtri: () => man({ fd: 1, hd: [80, 34], nk: [78, 46], hp: [74, 76], kf: [72, 92], af: [70, 106], kn: [78, 92], an: [78, 106], ef: [84, 18], hf: [70, 30], en: [88, 18], hn: [72, 32] }) + dbSide(68, 32, 8) + arrowX(52, 40, 76, 10, [52, 14]),
  latpull: () => tower(80, 2).replace('x="75"', 'x="75" opacity=".0"') + cable([80, 4], [80, 24]) + barTop(36, 124, 24) + pa('M58,84 H102 V92 H58 Z', cel(XC.pad, XC.padS), XW) + ln('M80,92 V108', OL, 5) + `<rect x="60" y="70" width="40" height="7" rx="3" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` +
    man({ hd: [80, 46], nk: [80, 58], hp: [80, 84], kf: [64, 78], af: [62, 106], kn: [96, 78], an: [98, 106], ef: [46, 44], hf: [44, 24], en: [114, 44], hn: [116, 24] }, { front: true }) + arrowX(140, 20, 140, 50),
  dbrow: () => benchH(104, 152, 84) + man({ fd: 1, hd: [124, 48], nk: [112, 54], hp: [72, 60], kf: [70, 84], af: [66, 106], kn: [78, 84], an: [82, 106], fa: 50, ef: [116, 70], hf: [120, 82], en: [92, 50], hn: [98, 72] }) + dbSide(98, 76, 8) + arrowX(84, 98, 84, 70),
  straightarm: () => tower(148, 6) + pulley(142, 14) + cable([142, 14], [104, 74]) + man({ fd: 1, hd: [84, 30], nk: [80, 42], hp: [70, 72], kf: [68, 90], af: [64, 106], kn: [74, 90], an: [74, 106], fa: 10, ef: [92, 58], hf: [100, 74], en: [94, 58], hn: [104, 76] }) + handleH(104, 76, 10) + arrowX(118, 40, 116, 82, [130, 62]),
  reardelt: () => man({ hd: [80, 46], nk: [80, 54], hp: [80, 68], kf: [72, 86], af: [70, 106], kn: [88, 86], an: [90, 106], ef: [56, 60], hf: [40, 64], en: [104, 60], hn: [120, 64] }, { front: true }) + dbell(36, 66, 5.5, 90) + dbell(124, 66, 5.5, 90) + arrowX(46, 90, 22, 62, [26, 86]) + arrowX(114, 90, 138, 62, [134, 86]),
  inclinecurl: () => padSlant(50, 96, 84, 46, 11) + ln('M58,98 V108 M80,66 L92,108', OL, 5) + man({ fd: 1, hd: [92, 42], nk: [84, 52], hp: [62, 88], kf: [86, 86], af: [92, 106], kn: [90, 88], an: [96, 106], fa: -30, ef: [76, 76], hf: [90, 68], en: [80, 78], hn: [96, 68] }) + dbSide(98, 66, 7.5) + arrowX(84, 100, 112, 62, [116, 92]),
  hammer: () => man({ fd: 1, hd: [78, 28], nk: [76, 40], hp: [72, 72], kf: [70, 90], af: [68, 106], kn: [76, 90], an: [76, 106], ef: [76, 62], hf: [96, 50], en: [80, 62], hn: [98, 52] }) + dbell(99, 50, 5.5, 0) + arrowX(110, 86, 120, 48, [128, 78]),
  hacksquat: () => man({ fd: 1, hd: [90, 34], nk: [82, 46], hp: [62, 80], kf: [92, 82], af: [84, 106], kn: [96, 84], an: [88, 106], ef: [100, 56], hf: [92, 46], en: [104, 58], hn: [96, 48], fa: 8 }, { mid: plateC(92, 46, 15) }) + arrowX(126, 92, 126, 50, null, true),
  bulgarian: () => benchH(16, 48, 80) + man({ fd: 1, hd: [80, 30], nk: [78, 42], hp: [76, 74], kf: [58, 96], af: [42, 78], kn: [102, 84], an: [100, 106], toe: 0, ef: [72, 58], hf: [72, 82], en: [84, 58], hn: [84, 84] }) + dbell(84, 88, 5, 0) + arrowX(126, 92, 126, 52, null, true),
  hipthrust: () => benchH(10, 46, 72) + man({ fd: -1, hd: [36, 58], nk: [48, 64], hp: [86, 60], kf: [108, 66], af: [110, 106], kn: [112, 66], an: [116, 106], fa: 90, ef: [70, 66], hf: [84, 54], en: [72, 64], hn: [88, 52] }, { mid: plateC(86, 50, 14) }) + arrowX(134, 76, 134, 44, null, true),
  seatedcurl: () => pa('M38,52 L50,52 L56,92 L42,92 Z', cel(XC.pad, XC.padS), XW) + `<rect x="40" y="90" width="66" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + ln('M70,99 V108', OL, 5) +
    man({ fd: 1, hd: [62, 44], nk: [60, 56], hp: [60, 86], kf: [92, 84], af: [92, 104], kn: [96, 84], an: [96, 106], toe: -4, ef: [70, 70], hf: [84, 78], en: [74, 72], hn: [88, 80] }) + el(102, 104, 7, 5, cel(XC.pad, XC.padS), XW) + arrowX(124, 74, 112, 106, [132, 96]),
  legext: () => pa('M38,50 L50,50 L56,92 L42,92 Z', cel(XC.pad, XC.padS), XW) + `<rect x="40" y="90" width="58" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + ln('M70,99 V108', OL, 5) +
    man({ fd: 1, hd: [62, 42], nk: [60, 54], hp: [60, 86], kf: [88, 84], af: [114, 76], kn: [92, 86], an: [118, 78], toe: 5, ef: [62, 72], hf: [72, 90], en: [66, 72], hn: [76, 92] }) + el(116, 86, 7, 5, cel(XC.pad, XC.padS), XW) + arrowX(110, 106, 136, 74, [134, 102]),
  seatedcalf: () => `<rect x="40" y="88" width="50" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + `<rect x="84" y="100" width="22" height="8" rx="2" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` +
    man({ fd: 1, hd: [62, 40], nk: [60, 52], hp: [60, 84], kf: [90, 80], af: [92, 98], kn: [94, 80], an: [96, 98], toe: 4, ef: [76, 70], hf: [88, 76], en: [78, 72], hn: [92, 76] }) + `<rect x="80" y="64" width="26" height="9" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + arrowX(122, 104, 122, 74, null, true),
  /* ---- Bụng ---- */
  hangleg: () => barTop(40, 120, 10) + man({ fd: 1, hd: [78, 34], nk: [78, 46], hp: [80, 76], kf: [106, 70], af: [128, 66], kn: [108, 74], an: [130, 70], toe: 0, ef: [74, 28], hf: [76, 12], en: [84, 28], hn: [84, 12] }) + arrowX(108, 100, 140, 76, [138, 104]),
  cablecrunch: () => tower(124, 4) + pulley(118, 12) + cable([118, 12], [96, 62]) + man({ fd: 1, hd: [104, 72], nk: [94, 66], hp: [70, 78], kf: [72, 104], af: [44, 104], kn: [76, 104], an: [48, 106], toe: -8, fa: 60, ef: [90, 52], hf: [98, 62], en: [94, 54], hn: [100, 64] }) + arrowX(112, 40, 124, 78, [130, 50]),
  abwheel: () => man({ fd: 1, hd: [118, 62], nk: [106, 68], hp: [66, 82], kf: [52, 104], af: [26, 104], kn: [56, 104], an: [30, 106], toe: -8, fa: 60, ef: [112, 86], hf: [120, 98], en: [116, 86], hn: [124, 98] }, { mid: ci(124, 98, 9, '#2a2448', XW) + ci(124, 98, 3, XC.steel, 0) }) + arrowX(96, 116, 140, 116, null, true).replace(/116/g, '114'),
  pallof: () => tower(10, 40) + pulley(16, 62) + cable([16, 62], [114, 62]) + man({ fd: 1, hd: [80, 28], nk: [78, 40], hp: [76, 72], kf: [68, 90], af: [62, 106], kn: [84, 90], an: [90, 106], ef: [94, 56], hf: [112, 62], en: [96, 58], hn: [116, 62] }) + handleH(116, 62, 8) + arrowX(100, 84, 136, 84, null, true),
  /* ---- Cardio nhẹ ---- */
  incline: () => pa('M20,100 L128,78 L132,88 L24,108 Z', cel('#3a3270', '#2a2448'), XW) + ln('M124,80 L134,24 M126,30 L110,36', OL, 6) + ln('M124,80 L134,24 M126,30 L110,36', XC.steel, 3) + `<rect x="126" y="16" width="18" height="12" rx="3" fill="#33e1ff" stroke="${OL}" stroke-width="${XW}"/>` +
    man({ fd: 1, hd: [80, 30], nk: [78, 42], hp: [74, 72], kf: [62, 86], af: [52, 98], kn: [86, 84], an: [86, 94], ef: [64, 56], hf: [62, 70], en: [92, 54], hn: [100, 48] }) + arrowX(36, 40, 60, 30),
  stairs: () => [0, 1, 2, 3].map(i => `<rect x="${40 + i * 18}" y="${92 - i * 16}" width="${100 - i * 18}" height="${16 + i * 16}" fill="${cel('#5d5596', '#3a3270')}" stroke="${OL}" stroke-width="${XW}"/>`).join('') + ln('M140,40 V10 M140,20 L118,26', OL, 6) + ln('M140,40 V10 M140,20 L118,26', XC.steel, 3) +
    man({ fd: 1, hd: [80, 18], nk: [78, 30], hp: [74, 60], kf: [70, 78], af: [64, 92], kn: [88, 66], an: [90, 76], ef: [72, 44], hf: [80, 54], en: [92, 42], hn: [104, 38] }) + arrowX(30, 92, 46, 70, [28, 76]),
  elliptical: () => pa('M28,98 Q80,70 132,98', 'none', 0) + `<ellipse cx="80" cy="96" rx="40" ry="9" fill="none" stroke="${OL}" stroke-width="5" stroke-dasharray="6 5"/>` + `<rect x="20" y="100" width="122" height="8" rx="3" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + ln('M126,100 L120,24 M120,30 L100,40', OL, 6) + ln('M126,100 L120,24 M120,30 L100,40', XC.steel, 3) +
    man({ fd: 1, hd: [78, 22], nk: [76, 34], hp: [72, 64], kf: [62, 80], af: [56, 92], kn: [88, 78], an: [96, 88], ef: [80, 46], hf: [98, 42], en: [86, 48], hn: [100, 40] }) + `<rect x="46" y="90" width="22" height="6" rx="2" fill="${XC.steel}" stroke="${OL}" stroke-width="2.4"/><rect x="86" y="86" width="22" height="6" rx="2" fill="${XC.steel}" stroke="${OL}" stroke-width="2.4"/>` + arrowX(48, 112, 112, 112, [80, 120]).replace(/112/g, '113'),
  rower: () => `<rect x="14" y="94" width="130" height="7" rx="3" fill="${XC.frame}" stroke="${OL}" stroke-width="${XW}"/>` + ci(138, 84, 14, cel('#3a3270', '#2a2448'), XW) + ci(138, 84, 5, XC.steel, 0) + `<rect x="54" y="86" width="22" height="8" rx="3" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` +
    man({ fd: 1, hd: [62, 44], nk: [58, 56], hp: [62, 84], kf: [88, 74], af: [112, 86], kn: [92, 76], an: [116, 88], toe: 3, ef: [46, 68], hf: [76, 70], en: [50, 70], hn: [78, 72] }) + cable([80, 72], [130, 84]) + arrowX(58, 112, 26, 112).replace(/112/g, '113'),
  bike: () => ci(116, 92, 14, cel('#3a3270', '#2a2448'), XW) + ln('M70,104 L80,60 M116,92 L102,46 M60,108 H130', OL, 6) + ln('M70,104 L80,60 M116,92 L102,46 M60,108 H130', XC.steel, 3) + `<rect x="68" y="54" width="22" height="8" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` + handleH(104, 44, 12) +
    man({ fd: 1, hd: [92, 22], nk: [88, 34], hp: [78, 58], kf: [96, 70], af: [90, 92], kn: [100, 74], an: [104, 84], ef: [96, 42], hf: [102, 44], en: [100, 44], hn: [106, 44], fa: 10 }) + ci(96, 84, 9, 'none', 3, 'stroke-dasharray="4 4"') + arrowX(78, 96, 86, 72, [68, 82]),
  ruck: () => man({ fd: 1, hd: [80, 26], nk: [78, 38], hp: [74, 70], kf: [62, 86], af: [52, 104], kn: [88, 86], an: [96, 104], ef: [64, 52], hf: [62, 68], en: [90, 52], hn: [96, 62] }, { under: `<rect x="50" y="36" width="22" height="32" rx="7" fill="${cel('#3fe06a', '#1d9a40')}" stroke="${OL}" stroke-width="${XW}"/>` + ln('M54,44 h14', '#1d9a40', 2.4) }) + arrowX(110, 40, 140, 40),
  /* ---- Cardio nặng ---- */
  airbike: () => ci(118, 80, 22, cel('#3a3270', '#2a2448'), XW) + [0, 45, 90, 135].map(a => ln(`M${P(118 + 18 * Math.cos(a * Math.PI / 180), 80 + 18 * Math.sin(a * Math.PI / 180))} L${P(118 - 18 * Math.cos(a * Math.PI / 180), 80 - 18 * Math.sin(a * Math.PI / 180))}`, XC.steel, 3)).join('') +
    ln('M66,106 L76,60 M96,106 L104,46 M56,108 H132', OL, 6) + ln('M66,106 L76,60 M96,106 L104,46 M56,108 H132', XC.steel, 3) + `<rect x="64" y="54" width="22" height="8" rx="4" fill="${cel(XC.pad, XC.padS)}" stroke="${OL}" stroke-width="${XW}"/>` +
    man({ fd: 1, hd: [88, 22], nk: [84, 34], hp: [74, 58], kf: [92, 70], af: [84, 92], kn: [96, 74], an: [100, 86], ef: [94, 44], hf: [104, 40], en: [98, 46], hn: [108, 44], fa: 10 }) + speed(52, 24) + arrowX(110, 28, 128, 42),
  rope: () => man({ fd: 1, hd: [62, 40], nk: [60, 52], hp: [56, 80], kf: [44, 90], af: [40, 106], kn: [74, 90], an: [78, 106], ef: [74, 64], hf: [86, 70], en: [76, 66], hn: [88, 72] }) +
    ln('M88,72 Q100,56 112,72 Q124,88 136,72 Q144,62 150,96', OL, 7) + ln('M88,72 Q100,56 112,72 Q124,88 136,72 Q144,62 150,96', '#e6c27a', 3.5) + arrowX(92, 40, 92, 62, null, true),
  sled: () => pa('M106,96 L146,96 L150,108 L102,108 Z', cel(XC.frame, XC.steelS), XW) + ln('M112,96 L108,56 M138,96 L134,56', OL, 6) + ln('M112,96 L108,56 M138,96 L134,56', XC.steel, 3) + plateC(126, 88, 9) +
    man({ fd: 1, hd: [96, 52], nk: [84, 56], hp: [52, 70], kf: [44, 92], af: [26, 104], kn: [72, 86], an: [64, 106], fa: 30, ef: [92, 70], hf: [106, 60], en: [96, 70], hn: [108, 58] }) + speed(24, 40) + arrowX(64, 30, 104, 30),
  kb: () => man({ fd: 1, hd: [78, 26], nk: [76, 38], hp: [70, 70], kf: [70, 88], af: [66, 106], kn: [76, 88], an: [76, 106], ef: [90, 50], hf: [104, 52], en: [92, 52], hn: [106, 54] }) +
    ci(112, 58, 9, '#2a2448', XW) + ln('M106,50 Q112,42 118,50', OL, 4) + arrowX(96, 100, 128, 46, [132, 98]),
  /* ---- Không cần máy ---- */
  jack: () => man({ hd: [80, 24], nk: [80, 38], hp: [80, 70], kf: [64, 88], af: [56, 106], kn: [96, 88], an: [104, 106], ef: [58, 26], hf: [62, 10], en: [102, 26], hn: [98, 10] }, { front: true }) + arrowX(36, 84, 36, 50, null, false) + arrowX(124, 84, 124, 50),
  knees: () => man({ fd: 1, hd: [80, 22], nk: [78, 34], hp: [76, 66], kf: [74, 86], af: [72, 106], kn: [100, 64], an: [100, 84], toe: 4, ef: [90, 50], hf: [96, 38], en: [66, 48], hn: [62, 62] }) + arrowX(122, 90, 122, 60, null, true),
  climber: () => man({ fd: 1, hd: [118, 50], nk: [106, 56], hp: [66, 66], kf: [40, 82], af: [24, 104], kn: [88, 80], an: [76, 98], fa: 0, ef: [108, 80], hf: [110, 104], en: [112, 80], hn: [114, 104] }) + arrowX(52, 106, 78, 84, [56, 88]),
  burpee: () => man({ fd: 1, hd: [116, 62], nk: [104, 66], hp: [66, 76], kf: [40, 90], af: [22, 104], kn: [44, 92], an: [26, 106], ef: [104, 86], hf: [106, 104], en: [108, 86], hn: [110, 104] }) + arrowX(60, 40, 30, 70, [40, 44]) + ln('M128,26 l8,-8 M136,30 l10,-4', '#d4ccff', 2.6),
  box: () => man({ fd: 1, hd: [74, 26], nk: [72, 38], hp: [70, 70], kf: [62, 88], af: [58, 106], kn: [84, 88], an: [90, 106], ef: [78, 48], hf: [76, 36], en: [94, 42], hn: [118, 40] }) + speed(140, 32) + arrowX(98, 58, 132, 58),
  fastsquat: () => man({ fd: 1, hd: [94, 36], nk: [86, 48], hp: [62, 80], kf: [92, 82], af: [84, 106], kn: [96, 84], an: [88, 106], ef: [100, 56], hf: [112, 50], en: [104, 58], hn: [116, 52], fa: 8 }) + arrowX(130, 94, 130, 50, null, true)
};
const EXA_CACHE = {};
function exSVG(id, cls = '') {
  if (!EXA_CACHE[id]) { const f = EXA[id]; EXA_CACHE[id] = `<svg class="exsvg ${cls}" viewBox="0 0 160 120" aria-hidden="true">${floorX()}${f ? f() : ''}</svg>`; }
  return EXA_CACHE[id];
}
