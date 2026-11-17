/* ===================== ĐỒ HỌA SVG GỐC: PET, TRỨNG, CẢNH, HUY HIỆU ===================== */
const OL = '#140a30';
const pa = (d, fill, w = 5, ex = '') => `<path d="${d}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" ${ex}/>`;
const el = (cx, cy, rx, ry, fill, w = 5, ex = '') => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${w ? OL : 'none'}" stroke-width="${w}" ${ex}/>`;
const ln = (d, c = OL, w = 4, ex = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${ex}/>`;
const hl = (cx, cy, rx, ry, rot = -25, op = .45) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" opacity="${op}" transform="rotate(${rot} ${cx} ${cy})"/>`;
// Gộp nhiều hình thành một khối có một đường viền ngoài
const bl = (shapes, fill, w = 5) => `<g fill="${OL}" stroke="${OL}" stroke-width="${w * 2}" stroke-linejoin="round">${shapes}</g><g fill="${fill}">${shapes}</g>`;
// Viền kép cho nét (ống, đuôi...)
const tube = (d, c, w) => ln(d, OL, w + 9) + ln(d, c, w);
const mirror = pts => pts.split(' ').map(p => { const [x, y] = p.split(','); return `${200 - +x},${y}`; }).join(' ');

function starPath(cx, cy, R, r, n = 5, rot = -90) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (rot + i * 180 / n) * Math.PI / 180, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
}
const spark4 = (cx, cy, R, c = '#fff', cls = 'twinkle', delay = 0) =>
  `<path class="${cls}" style="animation-delay:${delay}s" d="M${cx},${cy - R} Q${cx + R * .18},${cy - R * .18} ${cx + R},${cy} Q${cx + R * .18},${cy + R * .18} ${cx},${cy + R} Q${cx - R * .18},${cy + R * .18} ${cx - R},${cy} Q${cx - R * .18},${cy - R * .18} ${cx},${cy - R}Z" fill="${c}" stroke="${OL}" stroke-width="2"/>`;

// Mắt "ngầu": mí trên xiên xuống phía trong + lông mày dày
function eye(cx, cy, rx, ry, side, o = {}) {
  const pr = o.pr || rx * .5, lid = o.lid ?? 1;
  const px = cx - side * rx * .2, py = cy + ry * .16;
  let s = `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${o.white || '#fff'}" stroke="${OL}" stroke-width="4.5"/>`;
  if (o.iris) s += `<circle cx="${px}" cy="${py}" r="${pr * 1.45}" fill="${o.iris}"/>`;
  s += o.slit ? `<ellipse cx="${px}" cy="${py}" rx="${pr * .36}" ry="${pr * 1.2}" fill="${OL}"/>` : `<circle cx="${px}" cy="${py}" r="${pr}" fill="${OL}"/>`;
  s += `<circle cx="${px - pr * .5}" cy="${py - pr * .55}" r="${pr * .45}" fill="#fff"/><circle cx="${px + pr * .55}" cy="${py + pr * .5}" r="${pr * .2}" fill="#fff" opacity=".8"/>`;
  const adj = (1 - lid) * 28;
  const a1 = side < 0 ? 205 + adj : 335 - adj, a2 = side < 0 ? 355 - adj * .6 : 185 + adj * .6;
  const P = a => [cx + rx * Math.cos(a * Math.PI / 180), cy + ry * Math.sin(a * Math.PI / 180)];
  const [x1, y1] = P(a1), [x2, y2] = P(a2);
  const sweep = side < 0 ? 1 : 0;
  s += `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${rx},${ry} 0 0 ${sweep} ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${o.skin || '#888'}"/>`;
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, e = 4;
  s += ln(`M${(x1 - ux * e).toFixed(1)},${(y1 - uy * e - 1.5).toFixed(1)} L${(x2 + ux * e * .6).toFixed(1)},${(y2 + uy * e * .6).toFixed(1)}`, OL, o.bw || 6.5);
  return s;
}

/* ---------- Phụ kiện theo cấp ---------- */
function scarf(a, c) {
  const [cx, y, w] = a.neck, x0 = cx - w / 2;
  return `<g class="acc">` +
    pa(`M${cx + w * .18},${y + 4} l12,18 l7,-5 l-5,-15 Z`, c, 4) +
    pa(`M${x0},${y - 6} Q${cx},${y + 6} ${x0 + w},${y - 6} L${x0 + w},${y + 5} Q${cx},${y + 17} ${x0},${y + 5} Z`, c, 4) +
    ln(`M${x0 + 7},${y} Q${cx},${y + 10} ${x0 + w - 7},${y}`, 'rgba(255,255,255,.5)', 2.5) + `</g>`;
}
function medal(a) {
  const [x, y] = a.chest;
  return `<g class="acc">${pa(`M${x - 6},${y - 15} L${x},${y - 5} L${x + 6},${y - 15}`, '#3fa9ff', 3)}<circle cx="${x}" cy="${y}" r="10" fill="url(#gGold)" stroke="${OL}" stroke-width="3.5"/><path d="${starPath(x, y + .5, 6, 2.6)}" fill="#fff8c8" stroke="${OL}" stroke-width="1.5"/></g>`;
}
function aura(c) {
  let rays = '';
  for (let i = 0; i < 12; i++) rays += `<path d="M100,105 L${100 + 110 * Math.cos((i * 30 - 6) * Math.PI / 180)},${105 + 110 * Math.sin((i * 30 - 6) * Math.PI / 180)} L${100 + 110 * Math.cos((i * 30 + 6) * Math.PI / 180)},${105 + 110 * Math.sin((i * 30 + 6) * Math.PI / 180)} Z" fill="${c}"/>`;
  return `<g class="aura" opacity=".55"><g class="spin">${rays}</g></g><circle cx="100" cy="108" r="84" fill="${c}" opacity=".16"/><circle cx="100" cy="108" r="64" fill="${c}" opacity=".2"/><circle cx="100" cy="108" r="44" fill="#fff" opacity=".12"/>`;
}
function crown(x, y, rot = 0, s = 1) {
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><g class="float">` +
    pa('M-22,9 L-25,-13 L-11,-2 L0,-21 L11,-2 L25,-13 L22,9 Z', 'url(#gGold)', 4.5) +
    ln('M-20,3 L20,3', '#e08a00', 2.5) +
    `<circle cx="0" cy="-2" r="4" fill="#ff3b4f" stroke="${OL}" stroke-width="2"/><circle cx="-13" cy="1" r="2.6" fill="#33e1ff" stroke="${OL}" stroke-width="1.5"/><circle cx="13" cy="1" r="2.6" fill="#33e1ff" stroke="${OL}" stroke-width="1.5"/>` +
    `<circle cx="0" cy="-21" r="3" fill="#fff6b0" stroke="${OL}" stroke-width="2"/><circle cx="-25" cy="-13" r="3" fill="#fff6b0" stroke="${OL}" stroke-width="2"/><circle cx="25" cy="-13" r="3" fill="#fff6b0" stroke="${OL}" stroke-width="2"/>` +
    `</g></g>`;
}
const lv5sparks = () => spark4(18, 40, 9, '#fff6b0', 'twinkle', 0) + spark4(184, 70, 7, '#fff', 'twinkle', .6) + spark4(176, 160, 8, '#fff6b0', 'twinkle', 1.1) + spark4(26, 150, 6, '#fff', 'twinkle', 1.6);

/* ---------- 10 pet ---------- */
const PET_ART = {
  wolf: {
    a: { neck: [100, 139, 60], chest: [100, 160], crown: [100, -6, 0, .9], aura: '#ff8a1f', scarf: '#2b6cff' },
    back: () => `<g class="pt">` + pa('M118,168 C148,170 170,150 166,122 C176,126 182,110 174,98 C172,110 164,112 158,106 C164,92 156,78 144,72 C150,88 146,102 136,108 C140,96 134,88 124,86 C128,110 116,132 106,152 Z', 'url(#gFlame)', 5) +
      pa('M124,156 C142,154 154,140 150,122 C146,132 140,134 136,130 C138,120 132,112 126,112 C128,126 120,140 116,150 Z', '#fff59a', 0, 'opacity=".85"') + `</g>`,
    body: () => pa('M68,184 C62,152 72,126 100,124 C128,126 138,152 132,184 Z', 'url(#gWolf)') +
      pa('M82,130 L90,146 L95,138 L100,154 L105,138 L110,146 L118,130 Q100,124 82,130 Z', '#ffe6c2', 3.5) +
      el(82, 184, 16, 9, 'url(#gWolf)') + el(118, 184, 16, 9, 'url(#gWolf)') + ln('M77,188 v-5 M86,188 v-5 M114,188 v-5 M123,188 v-5', OL, 2.5) + hl(80, 140, 7, 3, -30, .4),
    head: () => bl('<ellipse cx="100" cy="92" rx="52" ry="44"/><polygon points="36,102 58,80 62,118"/><polygon points="164,102 142,80 138,118"/><polygon points="56,72 50,16 94,50"/><polygon points="144,72 150,16 106,50"/>', 'url(#gWolf)') +
      `<polygon points="62,62 56,30 84,50" fill="#ffcf3f"/><polygon points="138,62 144,30 116,50" fill="#ffcf3f"/>` +
      pa('M58,104 Q100,92 142,104 Q138,134 100,137 Q62,134 58,104 Z', '#ffe6c2', 0) +
      pa('M86,58 C78,42 90,30 94,10 C100,24 106,28 112,16 C119,34 119,48 114,58 Q100,52 86,58 Z', 'url(#gFlame)', 4.5) +
      pa('M94,54 C90,46 96,40 98,32 C102,40 106,40 108,36 C110,44 108,50 106,54 Z', '#fff59a', 0) +
      el(100, 113, 24, 15, '#fff3df', 4) +
      pa('M89,101 Q100,94 111,101 Q106,110 100,111 Q94,110 89,101 Z', OL, 0) + hl(96, 100, 3.5, 1.6, 0, .85) +
      ln('M87,118 Q94,124 100,119 Q106,124 113,117', OL, 3.5) + pa('M104,120 L107,128 L110,119', '#fff', 2.5) +
      ln('M48,104 l12,1 M50,113 l10,-2', '#c23a10', 3.5) + ln('M152,104 l-12,1 M150,113 l-10,-2', '#c23a10', 3.5) +
      eye(77, 86, 12, 13, -1, { skin: 'url(#gWolf)', iris: '#ffb21f' }) + eye(123, 86, 12, 13, 1, { skin: 'url(#gWolf)', iris: '#ffb21f' }) +
      hl(72, 64, 12, 5)
  },
  bear: {
    a: { neck: [100, 139, 72], chest: [124, 160], crown: [100, 30, 0, .95], aura: '#9fd0ff', scarf: '#ff3b4f' },
    body: () => pa('M58,184 C52,150 66,126 100,124 C134,126 148,150 142,184 Z', 'url(#gSteel)') +
      pa('M84,140 L116,140 L124,160 L114,178 L86,178 L76,160 Z', '#6c81a3', 4) +
      [[84, 145], [116, 145], [87, 173], [113, 173]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="#ffd21f" stroke="${OL}" stroke-width="1.5"/>`).join('') +
      pa('M103,148 L93,162 L100,162 L96,174 L108,158 L101,158 L105,148 Z', '#ffd21f', 2.5) +
      el(60, 158, 13, 22, 'url(#gSteel)', 5, 'transform="rotate(14 60 158)"') + el(140, 158, 13, 22, 'url(#gSteel)', 5, 'transform="rotate(-14 140 158)"') +
      el(80, 185, 18, 9, '#5d7190') + el(120, 185, 18, 9, '#5d7190') + hl(74, 140, 8, 3, -40, .5),
    head: () => bl('<ellipse cx="100" cy="90" rx="55" ry="46"/><circle cx="55" cy="52" r="18"/><circle cx="145" cy="52" r="18"/>', 'url(#gSteel)') +
      el(55, 52, 9, 9, '#5d7190', 3.5) + ln('M50,52 h10 M55,47 v10', '#c9d6e8', 2) + el(145, 52, 9, 9, '#5d7190', 3.5) + ln('M140,52 h10 M145,47 v10', '#c9d6e8', 2) +
      pa('M63,66 Q100,40 137,66 L133,78 Q100,58 67,78 Z', '#62779a', 4) +
      [[74, 67], [100, 54], [126, 67]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8" fill="#ffd21f" stroke="${OL}" stroke-width="1.5"/>`).join('') +
      el(100, 111, 29, 20, '#e6edf7', 4) +
      `<rect x="89" y="97" width="22" height="13" rx="6.5" fill="${OL}"/>` + hl(95, 100, 4, 1.8, 0, .75) +
      ln('M100,110 v6 M88,118 Q100,126 112,118', OL, 3.5) +
      eye(76, 87, 10, 11, -1, { skin: 'url(#gSteel)', lid: 1.12, iris: '#33e1ff' }) + eye(124, 87, 10, 11, 1, { skin: 'url(#gSteel)', lid: 1.12, iris: '#33e1ff' }) +
      ln('M138,70 L119,101', '#3d4c66', 3) + ln('M123,90 l7,4 M128,81 l7,4', '#3d4c66', 2) +
      hl(70, 62, 13, 4.5, -30, .6) + hl(150, 100, 5, 2, -60, .5)
  },
  fox: {
    a: { neck: [100, 140, 54], chest: [100, 160], crown: [100, 46, 0, .85], aura: '#33e1ff', scarf: '#7a3cff' },
    back: () => `<g class="pt">` + pa('M114,170 L148,150 L136,142 L168,120 L152,114 L186,80 L140,104 L154,112 L122,134 L134,142 Z', 'url(#gFox)', 5) +
      ln('M128,160 L150,146 L142,140 L166,124', '#33e1ff', 3) + pa('M186,80 L162,94 L170,100 Z', '#fff8e6', 3) + `</g>`,
    body: () => pa('M72,184 C66,154 76,128 100,126 C124,128 134,154 128,184 Z', 'url(#gFox)') +
      pa('M84,130 Q100,176 116,130 Q100,124 84,130 Z', '#fff8e6', 3.5) +
      el(84, 184, 13, 8, '#3a2370') + el(116, 184, 13, 8, '#3a2370'),
    head: () => bl('<ellipse cx="100" cy="94" rx="48" ry="40"/><polygon points="42,108 60,86 66,120"/><polygon points="158,108 140,86 134,120"/><polygon points="58,76 42,6 94,56"/><polygon points="142,76 158,6 106,56"/>', 'url(#gFox)') +
      `<polygon points="42,6 46.8,27 57.6,21" fill="#3a2370"/><polygon points="158,6 153.2,27 142.4,21" fill="#3a2370"/>` +
      `<polygon points="63,64 53,32 82,54" fill="#fff3c4"/><polygon points="137,64 147,32 118,54" fill="#fff3c4"/>` +
      pa('M56,104 Q100,90 144,104 Q134,137 100,139 Q66,137 56,104 Z', '#fff8e6', 0) +
      pa('M93,110 Q100,105 107,110 Q103,118 100,118 Q97,118 93,110 Z', OL, 0) +
      ln('M88,122 Q95,128 100,123 Q106,128 113,120', OL, 3.5) + pa('M92,124 L94,131 L97,125', '#fff', 2) +
      pa('M64,94 L56,108 L63,108 L58,120 L71,103 L64,103 L69,94 Z', '#33e1ff', 2.5) + pa('M136,94 L144,108 L137,108 L142,120 L129,103 L136,103 L131,94 Z', '#33e1ff', 2.5) +
      eye(80, 90, 11, 12, -1, { skin: 'url(#gFox)', iris: '#29c7ff' }) + eye(120, 90, 11, 12, 1, { skin: 'url(#gFox)', iris: '#29c7ff' }) +
      hl(76, 68, 11, 4.5),
    front: () => `<g class="flick">` + pa('M26,70 L18,84 L25,84 L20,96 L33,80 L26,80 L31,70 Z', '#33e1ff', 2.5) + pa('M176,40 L170,50 L175,50 L171,59 L181,47 L176,47 L180,40 Z', '#33e1ff', 2) + `</g>`
  },
  dragon: {
    a: { neck: [100, 135, 62], chest: [100, 156], crown: [100, 30, 0, .85], aura: '#3fe06a', scarf: '#ff3b4f' },
    back: () => pa('M76,138 C52,124 30,122 16,98 C28,102 34,98 32,88 C44,96 50,92 52,82 C60,96 68,104 80,112 Z', '#22a95c') + ln('M34,98 L68,126 M52,86 L72,116', '#0f6b37', 3) +
      pa('M124,138 C148,124 170,122 184,98 C172,102 166,98 168,88 C156,96 150,92 148,82 C140,96 132,104 120,112 Z', '#22a95c') + ln('M166,98 L132,126 M148,86 L128,116', '#0f6b37', 3) +
      `<g class="pt">` + tube('M122,176 C150,182 172,170 170,148', '#30c060', 11) + pa('M162,150 L170,126 L179,150 Q170,145 162,150 Z', '#ff7a2b', 4) + `</g>`,
    body: () => pa('M68,184 C60,150 72,126 100,124 C128,126 140,150 132,184 Z', 'url(#gDragon)') +
      pa('M84,132 Q100,126 116,132 L113,182 L87,182 Z', '#ffe08a', 3.5) + ln('M86,146 h28 M86,160 h28 M87,172 h26', '#e0b44a', 2.5) +
      el(80, 184, 16, 9, 'url(#gDragon)') + el(120, 184, 16, 9, 'url(#gDragon)') +
      pa('M70,186 l-3,5 l6,-1 Z M80,188 l0,5 l4,-3 Z M120,188 l0,5 l-4,-3 Z M130,186 l3,5 l-6,-1 Z', '#fff', 1.5),
    head: () => pa('M74,58 C64,42 60,28 64,10 C74,26 82,38 90,50 Z', 'url(#gHorn)', 4.5) + pa('M126,58 C136,42 140,28 136,10 C126,26 118,38 110,50 Z', 'url(#gHorn)', 4.5) +
      pa('M86,54 L93,34 L100,50 L107,34 L114,54 Z', '#ff7a2b', 4) +
      bl('<ellipse cx="100" cy="88" rx="51" ry="42"/><ellipse cx="100" cy="111" rx="37" ry="21"/>', 'url(#gDragon)') +
      el(100, 113, 30, 15, '#8ff0ab', 0, 'opacity=".55"') +
      el(90, 106, 3.6, 2.6, OL, 0) + el(110, 106, 3.6, 2.6, OL, 0) +
      ln('M78,119 Q100,133 122,119', OL, 3.5) + pa('M86,123 L89,130 L92,125', '#fff', 2) + pa('M108,125 L111,130 L114,123', '#fff', 2) +
      ln('M56,98 q4,-4 8,0 M58,107 q4,-4 8,0 M144,98 q-4,-4 -8,0 M142,107 q-4,-4 -8,0', '#1b8c45', 2.5) +
      eye(78, 84, 12, 13, -1, { skin: 'url(#gDragon)', iris: '#ffd21f', slit: true }) + eye(122, 84, 12, 13, 1, { skin: 'url(#gDragon)', iris: '#ffd21f', slit: true }) +
      hl(72, 60, 12, 5),
    front: () => `<g class="smoke"><circle cx="150" cy="104" r="5" fill="#ece8ff" stroke="${OL}" stroke-width="2.5"/><circle cx="160" cy="92" r="7" fill="#ece8ff" stroke="${OL}" stroke-width="2.5"/><circle cx="168" cy="77" r="5.5" fill="#ece8ff" stroke="${OL}" stroke-width="2.5"/></g>`
  },
  tiger: {
    a: { neck: [100, 140, 66], chest: [100, 160], crown: [100, 2, 0, .85], aura: '#5fe3ff', scarf: '#2b6cff' },
    back: () => `<g class="pt">` + pa('M124,172 C150,176 166,160 162,140 C160,128 168,120 178,122 C172,110 154,114 150,130 C146,146 140,156 118,158 Z', 'url(#gTiger)', 5) +
      ln('M152,150 l9,4 M158,137 l9,1 M166,124 l7,-3', '#1d3f8a', 4) + `</g>`,
    body: () => pa('M64,184 C58,150 70,126 100,124 C130,126 142,150 136,184 Z', 'url(#gTiger)') +
      ln('M64,148 Q73,151 78,145 M62,163 Q73,166 80,159 M136,148 Q127,151 122,145 M138,163 Q127,166 120,159', '#1d3f8a', 4.5) +
      el(82, 184, 16, 9, '#ffffff') + el(118, 184, 16, 9, '#ffffff') + ln('M77,188 v-5 M86,188 v-5 M114,188 v-5 M123,188 v-5', OL, 2.5),
    head: () => bl('<ellipse cx="100" cy="92" rx="54" ry="45"/><polygon points="40,104 58,84 60,122"/><polygon points="160,104 142,84 140,122"/><circle cx="57" cy="54" r="16"/><circle cx="143" cy="54" r="16"/>', 'url(#gTiger)') +
      el(57, 54, 8, 8, '#8fd3ff', 0) + el(143, 54, 8, 8, '#8fd3ff', 0) +
      pa('M85,55 L89,30 L97,51 Z', 'url(#gIce)', 4) + pa('M95,51 L102,14 L110,51 Z', 'url(#gIce)', 4) + pa('M107,53 L115,30 L117,57 Z', 'url(#gIce)', 4) +
      ln('M100,60 L100,74 M87,62 Q92,68 89,77 M113,62 Q108,68 111,77', '#1d3f8a', 4.5) +
      ln('M46,96 Q57,99 64,94 M48,108 Q59,108 66,104 M154,96 Q143,99 136,94 M152,108 Q141,108 134,104', '#1d3f8a', 4) +
      el(100, 113, 25, 17, '#ffffff', 4) +
      pa('M91,102 Q100,97 109,102 Q105,110 100,111 Q95,110 91,102 Z', '#2a4c9a', 3) +
      ln('M87,118 Q94,124 100,119 Q106,124 113,118', OL, 3.5) + pa('M91,120 L93,128 L96,121', '#fff', 2) + pa('M104,121 L107,128 L109,120', '#fff', 2) +
      eye(78, 88, 12, 13, -1, { skin: 'url(#gTiger)', iris: '#2fd0ff' }) + eye(122, 88, 12, 13, 1, { skin: 'url(#gTiger)', iris: '#2fd0ff' }),
    front: () => spark4(28, 92, 7, '#bff4ff', 'twinkle', .2) + spark4(170, 62, 6, '#bff4ff', 'twinkle', .9) + spark4(168, 170, 5, '#bff4ff', 'twinkle', 1.4)
  },
  owl: {
    a: { neck: [100, 124, 104], chest: [100, 146], crown: [100, 30, 0, .9], aura: '#b46bff', scarf: '#ff3b4f' },
    body: () => bl('<path d="M100,42 C150,42 162,92 158,132 C154,170 132,188 100,188 C68,188 46,170 42,132 C38,92 50,42 100,42 Z"/><polygon points="56,68 44,20 84,50"/><polygon points="144,68 156,20 116,50"/>', 'url(#gOwl)') +
      pa('M68,128 Q100,112 132,128 Q134,170 100,180 Q66,170 68,128 Z', '#cdb8ff', 4) +
      ln('M84,140 l6,5 l6,-5 M104,140 l6,5 l6,-5 M94,154 l6,5 l6,-5 M84,167 l6,5 l6,-5 M104,167 l6,5 l6,-5', '#8f6be0', 3) +
      pa('M46,104 C30,124 34,162 60,178 C58,156 62,132 64,110 Z', '#3d1c86', 4.5) + ln('M42,128 q9,4 18,0 M44,147 q8,4 15,0', '#25105c', 2.5) +
      pa('M154,104 C170,124 166,162 140,178 C142,156 138,132 136,110 Z', '#3d1c86', 4.5) + ln('M158,128 q-9,4 -18,0 M156,147 q-8,4 -15,0', '#25105c', 2.5) +
      el(84, 188, 11, 6, '#ffb21f', 3.5) + el(116, 188, 11, 6, '#ffb21f', 3.5),
    head: () => bl('<circle cx="77" cy="88" r="27"/><circle cx="123" cy="88" r="27"/>', 'url(#gOwlFace)', 4) +
      `<path d="${starPath(100, 58, 7.5, 3.2)}" fill="#ffe14d" stroke="${OL}" stroke-width="2"/>` +
      eye(77, 88, 18, 18, -1, { white: '#ffe14d', pr: 8, lid: 1.05, skin: '#5b34ae', bw: 7 }) + eye(123, 88, 18, 18, 1, { white: '#ffe14d', pr: 8, lid: 1.05, skin: '#5b34ae', bw: 7 }) +
      pa('M91,104 L109,104 L100,121 Z', '#ffb21f', 4) + hl(96, 107, 3, 1.5, 0, .7) +
      hl(70, 56, 11, 4.5)
  },
  rhino: {
    a: { neck: [100, 141, 76], chest: [100, 159], crown: [100, 30, 0, .9], aura: '#ffb24a', scarf: '#2b6cff' },
    body: () => pa('M54,184 C48,148 66,126 100,124 C134,126 152,148 146,184 Z', 'url(#gRhino)') +
      pa('M48,148 Q52,124 82,124 L85,144 Q66,154 48,148 Z', 'url(#gBronze)', 4.5) + pa('M152,148 Q148,124 118,124 L115,144 Q134,154 152,148 Z', 'url(#gBronze)', 4.5) +
      `<circle cx="60" cy="138" r="2.6" fill="#fff1c2" stroke="${OL}" stroke-width="1.5"/><circle cx="74" cy="132" r="2.6" fill="#fff1c2" stroke="${OL}" stroke-width="1.5"/><circle cx="140" cy="138" r="2.6" fill="#fff1c2" stroke="${OL}" stroke-width="1.5"/><circle cx="126" cy="132" r="2.6" fill="#fff1c2" stroke="${OL}" stroke-width="1.5"/>` +
      pa('M60,164 Q100,174 140,164 L141,175 Q100,185 59,175 Z', '#6b3d10', 3.5) + `<rect x="92" y="166" width="16" height="13" rx="3" fill="url(#gGold)" stroke="${OL}" stroke-width="3"/>` +
      `<rect x="64" y="176" width="30" height="14" rx="6" fill="url(#gRhino)" stroke="${OL}" stroke-width="4.5"/><rect x="106" y="176" width="30" height="14" rx="6" fill="url(#gRhino)" stroke="${OL}" stroke-width="4.5"/>` +
      ln('M72,190 v-5 M79,190 v-5 M86,190 v-5 M114,190 v-5 M121,190 v-5 M128,190 v-5', OL, 2),
    head: () => bl('<ellipse cx="100" cy="88" rx="54" ry="42"/><ellipse cx="100" cy="114" rx="41" ry="25"/><ellipse cx="52" cy="56" rx="10" ry="17" transform="rotate(-35 52 56)"/><ellipse cx="148" cy="56" rx="10" ry="17" transform="rotate(35 148 56)"/>', 'url(#gRhino)') +
      el(52, 56, 4.5, 10, '#e7a0b8', 0, 'transform="rotate(-35 52 56)"') + el(148, 56, 4.5, 10, '#e7a0b8', 0, 'transform="rotate(35 148 56)"') +
      pa('M55,80 Q57,45 100,43 Q143,45 145,80 Q124,67 100,69 Q76,67 55,80 Z', 'url(#gBronze)', 4.5) + ln('M100,46 L100,68', '#a65a12', 3) +
      [[66, 71], [82, 61], [118, 61], [134, 71]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.7" fill="#fff1c2" stroke="${OL}" stroke-width="1.5"/>`).join('') + ln('M121,51 l7,8 M126,49 l6,6', '#a65a12', 2) +
      el(100, 117, 36, 18, '#b8bdd4', 0, 'opacity=".7"') +
      eye(70, 89, 9, 10, -1, { skin: 'url(#gRhino)', lid: 1.15, iris: '#ff8a1f' }) + eye(130, 89, 9, 10, 1, { skin: 'url(#gRhino)', lid: 1.15, iris: '#ff8a1f' }) +
      pa('M87,108 Q92,80 105,50 Q113,80 114,108 Q100,114 87,108 Z', 'url(#gHorn)', 4.5) + ln('M92,96 q9,3 18,0 M96,82 q7,2 13,0', '#d8c08a', 2.5) + hl(98, 78, 3, 9, 15, .55) +
      el(86, 122, 4, 3, OL, 0) + el(114, 122, 4, 3, OL, 0) +
      ln('M84,130 Q100,136 116,130', OL, 3.5) + hl(76, 56, 12, 4, -20, .6)
  },
  mecha: {
    a: { neck: [100, 142, 72], chest: [100, 163], crown: [60, 30, -22, .8], aura: '#ff3b4f', scarf: '#ffd21f' },
    back: () => pa('M58,68 L42,36 L76,54 Z', 'url(#gSteel2)', 4.5) + pa('M76,52 L74,16 L97,44 Z', 'url(#gSteel2)', 4.5) + pa('M91,46 L100,6 L109,46 Z', 'url(#gSteel2)', 4.5) +
      pa('M142,68 L158,36 L124,54 Z', 'url(#gSteel2)', 4.5) + pa('M124,52 L126,16 L103,44 Z', 'url(#gSteel2)', 4.5) +
      `<g class="pt">` + pa('M126,170 L150,164 L152,176 L128,182 Z', 'url(#gMecha)', 4) + pa('M150,164 L170,152 L176,162 L152,176 Z', 'url(#gMecha)', 4) + pa('M170,152 L186,136 L192,146 L176,162 Z', 'url(#gSteel2)', 4) + `</g>`,
    body: () => pa('M64,184 L60,142 Q62,126 100,124 Q138,126 140,142 L136,184 Z', 'url(#gMecha)') +
      `<rect x="78" y="140" width="44" height="20" rx="4" fill="url(#pHazard)" stroke="${OL}" stroke-width="4"/>` +
      `<circle cx="100" cy="172" r="7" fill="#33e1ff" stroke="${OL}" stroke-width="3"/><circle cx="98" cy="170" r="2.5" fill="#fff"/>` +
      pa('M68,144 Q52,148 52,162 L61,162 Q61,154 70,152 Z', 'url(#gSteel2)', 4) + pa('M132,144 Q148,148 148,162 L139,162 Q139,154 130,152 Z', 'url(#gSteel2)', 4) +
      `<rect x="61" y="176" width="33" height="14" rx="5" fill="url(#gSteel2)" stroke="${OL}" stroke-width="4.5"/><rect x="106" y="176" width="33" height="14" rx="5" fill="url(#gSteel2)" stroke="${OL}" stroke-width="4.5"/>`,
    head: () => {
      let teeth = '';
      for (let i = 0; i < 9; i++) { const x = 56 + i * 9.6, t = (x - 48) / 104, y = 112 + 24 * t * (1 - t); teeth += `<path d="M${x.toFixed(1)},${(y - 1).toFixed(1)} l4.8,8 l4.8,-8 Z" fill="#fff" stroke="${OL}" stroke-width="2"/>`; }
      return ln('M138,54 L150,34', OL, 4) + `<circle class="blink" cx="151" cy="32" r="5" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>` +
        bl('<path d="M46,92 Q46,46 100,44 Q154,46 154,92 L152,112 Q100,124 48,112 Z"/>', 'url(#gMecha)') +
        pa('M56,113 Q100,126 144,113 L138,133 Q100,145 62,133 Z', 'url(#gSteel2)', 4.5) + teeth +
        ln('M70,56 Q100,50 130,56', '#0f7a6c', 2.5) +
        pa('M53,76 Q100,62 147,76 L145,97 Q100,87 55,97 Z', 'url(#gVisor)', 4.5) +
        `<g class="visor">` + ln('M65,80 L89,87', '#fff6a8', 5) + ln('M135,80 L111,87', '#fff6a8', 5) + `</g>` +
        ln('M62,79 Q80,72 96,72', 'rgba(255,255,255,.65)', 3) +
        el(52, 101, 5, 5, 'url(#gSteel2)', 3) + el(148, 101, 5, 5, 'url(#gSteel2)', 3) + hl(68, 58, 12, 4)
    }
  },
  uni: {
    a: { neck: [100, 143, 56], chest: [116, 163], crown: [100, 28, 0, .72], aura: '#ff4fd8', scarf: '#33e1ff' },
    back: () => pa('M62,122 L40,114 L54,102 L32,90 L52,80 L34,62 L58,62 L48,40 L72,50 L70,28 L88,46 Z', 'url(#gMane)', 4.5) +
      pa('M138,122 L160,114 L146,102 L168,90 L148,80 L166,62 L142,62 L152,40 L128,50 L130,28 L112,46 Z', 'url(#gMane)', 4.5) +
      `<g class="pt">` + pa('M122,172 L150,160 L142,152 L168,140 L156,132 L180,110 L146,128 L156,136 L130,148 L138,156 Z', 'url(#gMane)', 4.5) + `</g>`,
    body: () => pa('M70,184 C64,152 74,128 100,126 C126,128 136,152 130,184 Z', 'url(#gUni)') +
      pa('M102,140 L94,154 L100,154 L96,166 L108,150 L102,150 L106,140 Z', '#ffd21f', 2.5) +
      `<rect x="70" y="174" width="24" height="16" rx="5" fill="#3a2370" stroke="${OL}" stroke-width="4"/><rect x="106" y="174" width="24" height="16" rx="5" fill="#3a2370" stroke="${OL}" stroke-width="4"/>` +
      ln('M73,177 h18 M109,177 h18', '#ffd21f', 2.5),
    head: () => bl('<ellipse cx="100" cy="84" rx="44" ry="42"/><ellipse cx="100" cy="116" rx="30" ry="25"/><polygon points="63,58 57,22 86,46"/><polygon points="137,58 143,22 114,46"/>', 'url(#gUni)') +
      `<polygon points="65,52 61,32 80,46" fill="#ffc4ec"/><polygon points="135,52 139,32 120,46" fill="#ffc4ec"/>` +
      el(100, 121, 27, 19, '#ffd6f3', 4) + el(91, 117, 3.2, 4.2, '#c2669e', 0) + el(109, 117, 3.2, 4.2, '#c2669e', 0) + ln('M90,130 Q100,135 111,128', OL, 3) +
      pa('M92,42 L100,-8 L108,42 Z', 'url(#gGold)', 4.5) + ln('M94,31 L106,27 M96,18 L104,15 M98,5 L102,4', '#d98a00', 2.5) +
      pa('M71,64 L79,40 L89,54 L97,30 L105,52 L117,38 L127,64 Q100,72 71,64 Z', 'url(#gMane)', 4) +
      eye(80, 86, 11, 13, -1, { skin: 'url(#gUni)', iris: '#ff4fd8' }) + eye(120, 86, 11, 13, 1, { skin: 'url(#gUni)', iris: '#ff4fd8' }) +
      hl(72, 66, 8, 3.5),
    front: () => `<g class="flick">` + pa('M78,-2 L72,8 L77,8 L73,16 L82,5 L77,5 L81,-2 Z', '#33e1ff', 2) + pa('M124,6 L118,16 L123,16 L119,24 L128,13 L123,13 L127,6 Z', '#ff4fd8', 2) + `</g>`
  },
  phoenix: {
    a: { neck: [100, 124, 50], chest: [100, 146], crown: [100, 44, 0, .85], aura: '#ffb21f', scarf: '#33e1ff' },
    back: () => `<g class="wl">` + pa('M74,128 C44,128 20,108 8,76 C20,84 28,84 34,78 C22,64 20,50 22,36 C34,52 44,56 52,54 C46,40 46,26 54,14 C62,40 74,70 88,108 Z', 'url(#gWing)') + ln('M30,90 Q50,104 70,112 M38,64 Q56,86 76,100', '#ff6a1f', 3) + `</g>` +
      `<g class="wr">` + pa('M126,128 C156,128 180,108 192,76 C180,84 172,84 166,78 C178,64 180,50 178,36 C166,52 156,56 148,54 C154,40 154,26 146,14 C138,40 126,70 112,108 Z', 'url(#gWing)') + ln('M170,90 Q150,104 130,112 M162,64 Q144,86 124,100', '#ff6a1f', 3) + `</g>` +
      `<g class="pt">` + pa('M88,170 C82,184 74,192 60,196 C78,198 92,192 98,180 Z', 'url(#gFlame)', 4) + pa('M112,170 C118,184 126,192 140,196 C122,198 108,192 102,180 Z', 'url(#gFlame)', 4) + pa('M96,176 C96,186 94,194 90,200 C104,198 108,190 106,176 Z', 'url(#gFlame)', 4) + `</g>`,
    body: () => pa('M70,176 C60,150 70,122 100,120 C130,122 140,150 130,176 Q100,190 70,176 Z', 'url(#gPhoenix)') +
      pa('M82,130 Q100,124 118,130 Q114,168 100,174 Q86,168 82,130 Z', '#ffd23f', 3.5) + ln('M88,143 q6,6 12,0 q6,6 12,0 M92,157 q4,5 8,0 q4,5 8,0', '#ff9a1f', 2.5) +
      tube('M89,181 l-3,8 M95,183 l0,8 M105,183 l0,8 M111,181 l3,8', '#ffb21f', 3),
    head: () => pa('M84,58 C74,40 78,22 86,8 C90,24 96,32 100,46 Z', 'url(#gFlame)', 4.5) + pa('M94,50 C90,30 96,12 108,-6 C108,14 112,30 108,50 Z', 'url(#gFlame)', 4.5) + pa('M106,54 C112,38 122,26 134,18 C130,34 122,46 116,58 Z', 'url(#gFlame)', 4.5) +
      el(100, 83, 41, 39, 'url(#gPhoenix)') +
      ln('M60,86 Q70,95 82,92 M140,86 Q130,95 118,92', '#ffd23f', 3.5) +
      eye(83, 79, 10, 11, -1, { skin: 'url(#gPhoenix)', iris: '#ffd21f' }) + eye(117, 79, 10, 11, 1, { skin: 'url(#gPhoenix)', iris: '#ffd21f' }) +
      pa('M89,93 Q100,88 111,93 L102,110 Q100,112 98,110 Z', 'url(#gGold)', 4) + hl(96, 95, 3, 1.5, 0, .8) + hl(80, 58, 10, 4),
    front: () => `<g class="ember"><circle cx="40" cy="150" r="3.5" fill="#ffd21f" stroke="${OL}" stroke-width="1.5"/><circle cx="160" cy="140" r="3" fill="#ff8a1f" stroke="${OL}" stroke-width="1.5"/><circle cx="150" cy="176" r="2.5" fill="#ffd21f" stroke="${OL}" stroke-width="1.5"/></g>`
  }
};

function petInner(id, lv = 1, opt = {}) {
  const P = PET_ART[id], a = P.a;
  let s = '';
  if (lv >= 4) s += aura(a.aura);
  s += `<ellipse cx="100" cy="189" rx="56" ry="9" fill="#000" opacity=".3"/>`;
  s += `<g class="pb">` + (P.back ? P.back() : '') + P.body() + (lv >= 2 ? scarf(a, a.scarf) : '') + (lv >= 3 ? medal(a) : '') + `<g class="ph">` + P.head() + `</g>` + (P.front ? P.front() : '') + `</g>`;
  if (lv >= 5) s += crown(...a.crown) + lv5sparks();
  return s;
}
const PET_VB = '-12 -30 224 228';
function petSVG(id, lv = 1, cls = '') {
  return `<svg class="pet-svg ${cls}" viewBox="${PET_VB}" aria-hidden="true">${petInner(id, lv)}</svg>`;
}
function eggInner(cracked = true) {
  return `<ellipse cx="100" cy="189" rx="46" ry="8" fill="#000" opacity=".3"/><g class="egg">` +
    pa('M100,40 C140,40 156,110 152,140 C148,174 126,188 100,188 C74,188 52,174 48,140 C44,110 60,40 100,40 Z', 'url(#gEgg)') +
    el(80, 96, 11, 8, '#ff8a1f', 0) + el(120, 130, 14, 10, '#ff8a1f', 0) + el(90, 158, 9, 6, '#ff8a1f', 0) + el(125, 86, 6, 5, '#ff8a1f', 0) + el(66, 132, 6, 8, '#ff8a1f', 0) +
    (cracked ? ln('M66,116 L80,108 L88,120 L100,110 L110,122 L124,112 L136,120', OL, 3.5) : '') +
    hl(80, 64, 12, 6) + `</g>`;
}
const eggSVG = (cls = '') => `<svg class="pet-svg ${cls}" viewBox="${PET_VB}" aria-hidden="true">${eggInner()}</svg>`;

/* ---------- Định nghĩa dùng chung (gradient, pattern) ---------- */
function defsSVG() {
  const rg = (id, l, b, d, cx = 80, cy = 64, r = 150) => `<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}"><stop offset="0" stop-color="${l}"/><stop offset=".5" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></radialGradient>`;
  const lg = (id, st, x2 = 0, y2 = 1) => `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${st.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  return `<svg width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>` +
    rg('gWolf', '#ffb873', '#ff6a2b', '#c2380f') + rg('gSteel', '#f1f6fd', '#97abc6', '#4f6386') + rg('gFox', '#fff4ad', '#ffc61f', '#d47c00') +
    rg('gDragon', '#a9f8bb', '#3fcf6a', '#157a3f') + rg('gTiger', '#ffffff', '#e6f4ff', '#99bde3') + rg('gOwl', '#a07cee', '#5b34ae', '#271063') +
    rg('gOwlFace', '#dccaff', '#9a77e8', '#6a45c0', 80, 72, 70) + rg('gRhino', '#dde1f0', '#969cba', '#545b7e') + rg('gMecha', '#a2faec', '#22bfac', '#0b6a5f') +
    rg('gUni', '#ffffff', '#efe9ff', '#a796e6') + rg('gPhoenix', '#ffa676', '#ff3b2f', '#a80f19') + rg('gSteel2', '#e9eef6', '#8995ab', '#475268') +
    `<radialGradient id="gBronze" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ffd98a"/><stop offset=".5" stop-color="#e6952e"/><stop offset="1" stop-color="#9a520e"/></radialGradient>` +
    `<radialGradient id="gEgg" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#fffdf0"/><stop offset=".55" stop-color="#ffeab0"/><stop offset="1" stop-color="#e0ad55"/></radialGradient>` +
    `<radialGradient id="gRock" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#c9c4e6"/><stop offset=".6" stop-color="#8d86b8"/><stop offset="1" stop-color="#5a5288"/></radialGradient>` +
    `<radialGradient id="gLeaf" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#9df27a"/><stop offset=".6" stop-color="#3fb54a"/><stop offset="1" stop-color="#1f7a35"/></radialGradient>` +
    `<radialGradient id="gSun" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#fffbd0"/><stop offset=".6" stop-color="#ffd84a"/><stop offset="1" stop-color="#ffaa1f"/></radialGradient>` +
    lg('gFlame', [[0, '#fff59a'], [.45, '#ffb21f'], [1, '#ff3d1a']]) + lg('gGold', [[0, '#fff6b0'], [.5, '#ffd21f'], [1, '#e08a00']]) +
    lg('gIce', [[0, '#f4feff'], [.5, '#8ae8ff'], [1, '#2ea8e0']]) + lg('gMane', [[0, '#2ef2ff'], [.5, '#8a5cff'], [1, '#ff4fd8']]) +
    lg('gVisor', [[0, '#ff9e9e'], [.5, '#ff2e4a'], [1, '#9e001a']]) + lg('gHorn', [[0, '#fffbe8'], [1, '#e6c27a']]) +
    lg('gWing', [[0, '#fff176'], [.35, '#ffb21f'], [.7, '#ff5a1f'], [1, '#d61f1f']]) +
    lg('gSkyD', [[0, '#3f8cff'], [.6, '#7cc4ff'], [1, '#c9ecff']]) + lg('gSkyN', [[0, '#0b0835'], [.6, '#2a1f78'], [1, '#5a3fae']]) +
    lg('gGround', [[0, '#7fe05a'], [1, '#2f9a3e']]) + lg('gGroundN', [[0, '#3c8f4c'], [1, '#1b4f30']]) +
    lg('gHillD', [[0, '#6aa3f0'], [1, '#4d7fd6']]) + lg('gHillN', [[0, '#3a2f8f'], [1, '#261c66']]) +
    lg('gWater', [[0, '#bff4ff'], [1, '#3fbfff']]) +
    `<pattern id="pHazard" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#ffd21f"/><rect width="6" height="12" fill="#1a1236"/></pattern>` +
    `</defs></svg>`;
}

/* ---------- Cảnh khu nhà của pet ---------- */
const SLOTS = [ // [x chân, y chân, tỉ lệ]
  [150, 230, .36], [252, 232, .36], [74, 214, .31], [326, 214, .31], [118, 191, .26],
  [284, 192, .26], [36, 238, .33], [362, 240, .33], [200, 186, .24], [262, 104, .28]
];
function seeded(n) { let s = n; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }

function sceneSVG(unlocked, petsState, decorOn, hatched) {
  const on = k => !!decorOn[k];
  const night = on('night');
  let s = `<svg class="scene-svg" viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Khu nhà của pet">`;
  s += `<rect width="400" height="250" fill="url(#${night ? 'gSkyN' : 'gSkyD'})"/>`;
  if (night) {
    const r = seeded(7);
    for (let i = 0; i < 34; i++) { const x = r() * 400, y = r() * 120, rr = .8 + r() * 1.6; s += `<circle class="${i % 3 ? '' : 'twinkle'}" style="animation-delay:${(r() * 2).toFixed(2)}s" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rr.toFixed(1)}" fill="#fff"/>`; }
    s += pa('M60,26 A22,22 0 1 0 84,62 A17,17 0 1 1 60,26 Z', '#fff4c2', 3.5);
  } else {
    let rays = ''; for (let i = 0; i < 10; i++) { const a = i * 36 * Math.PI / 180; rays += `<path d="M${340 + 30 * Math.cos(a - .12)},${46 + 30 * Math.sin(a - .12)} L${340 + 46 * Math.cos(a)},${46 + 46 * Math.sin(a)} L${340 + 30 * Math.cos(a + .12)},${46 + 30 * Math.sin(a + .12)} Z" fill="#fff3a0" opacity=".8"/>`; }
    s += `<g class="spin-slow" style="transform-origin:340px 46px">${rays}</g>` + `<circle cx="340" cy="46" r="23" fill="url(#gSun)" stroke="${OL}" stroke-width="4"/>`;
    s += `<g class="drift">` + bl('<circle cx="70" cy="50" r="13"/><circle cx="88" cy="42" r="17"/><circle cx="108" cy="50" r="12"/><rect x="62" y="48" width="52" height="14" rx="7"/>', '#ffffff', 3.5) + `</g>`;
    s += `<g class="drift d2">` + bl('<circle cx="164" cy="34" r="10"/><circle cx="178" cy="28" r="13"/><circle cx="194" cy="35" r="9"/><rect x="156" y="33" width="44" height="11" rx="5.5"/>', '#ffffff', 3.5) + `</g>`;
  }
  if (on('rainbow')) {
    const cols = ['#ff4d4d', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'];
    s += `<g opacity=".92">` + `<path d="M40,172 A160,140 0 0 1 360,172" fill="none" stroke="${OL}" stroke-width="44"/>` + cols.map((c, i) => `<path d="M${42 + i * 6.5},172 A${158 - i * 6.5},${138 - i * 6.5} 0 0 1 ${358 - i * 6.5},172" fill="none" stroke="${c}" stroke-width="7"/>`).join('') + `</g>`;
  }
  s += `<path d="M0,150 Q50,98 104,136 Q150,96 214,134 Q290,86 346,128 Q378,112 400,124 L400,250 L0,250 Z" fill="url(#${night ? 'gHillN' : 'gHillD'})" stroke="${OL}" stroke-width="3.5"/>`;
  if (on('falls')) {
    s += pa('M330,180 L336,100 Q350,72 374,76 L404,72 L404,180 Z', 'url(#gRock)', 4) +
      pa('M352,94 Q362,88 378,92 L384,180 L346,180 Z', 'url(#gWater)', 3.5) +
      `<g class="flow">${ln('M358,96 L356,178', '#fff', 2.5, 'stroke-dasharray="10 14"')}${ln('M368,94 L368,178', '#fff', 2.5, 'stroke-dasharray="7 12"')}${ln('M376,96 L380,178', '#fff', 2, 'stroke-dasharray="12 10"')}</g>` +
      bl('<circle cx="350" cy="180" r="7"/><circle cx="364" cy="176" r="9"/><circle cx="380" cy="180" r="7"/>', '#ffffff', 3);
  }
  if (on('tower')) {
    s += tube('M20,172 L32,80 M58,172 L46,80', '#b06a30', 4) + tube('M25,146 L53,116 M53,146 L25,116', '#c98a4a', 2.5) +
      `<rect x="22" y="70" width="36" height="14" rx="3" fill="#c98a4a" stroke="${OL}" stroke-width="3.5"/>` +
      pa('M16,72 L40,42 L64,72 Z', '#ff4d4d', 4) + ln('M40,42 L40,24', OL, 3) + `<g class="wave">${pa('M40,24 L56,29 L40,35 Z', '#ffd21f', 2.5)}</g>`;
  }
  s += `<path d="M0,166 Q80,134 160,160 Q250,134 330,158 Q372,148 400,152 L400,250 L0,250 Z" fill="${night ? '#226a3e' : '#46b65a'}" stroke="${OL}" stroke-width="3.5"/>`;
  if (on('tree')) {
    s += pa('M291,180 Q296,140 289,116 L307,116 Q302,140 311,180 Z', '#9a5a2a', 4) + ln('M298,150 l-8,-8 M304,134 l7,-6', '#6e3c18', 3) +
      `<g class="sway">` + bl('<circle cx="282" cy="104" r="25"/><circle cx="310" cy="88" r="30"/><circle cx="332" cy="110" r="22"/><circle cx="300" cy="118" r="22"/>', 'url(#gLeaf)', 4) +
      hl(296, 76, 12, 5, -20, .45) + `<circle cx="286" cy="104" r="3.5" fill="#ff4d6a" stroke="${OL}" stroke-width="1.5"/><circle cx="322" cy="102" r="3.5" fill="#ff4d6a" stroke="${OL}" stroke-width="1.5"/><circle cx="306" cy="116" r="3.5" fill="#ff4d6a" stroke="${OL}" stroke-width="1.5"/></g>`;
  }
  s += `<path d="M-4,176 Q200,160 404,176 L404,254 L-4,254 Z" fill="url(#${night ? 'gGroundN' : 'gGround'})" stroke="${OL}" stroke-width="4"/>`;
  if (on('tent')) {
    s += pa('M50,190 L90,126 L130,190 Z', '#ff8a1f', 4.5) + `<path d="M90,126 L72,190 L80,190 Z M90,126 L100,190 L108,190 Z" fill="#ffd21f"/>` + ln('M50,190 L90,126 L130,190', OL, 4.5) +
      pa('M80,190 L90,158 L100,190 Z', '#3a1d0a', 3) + ln('M90,126 L90,110', OL, 3) + `<g class="wave">${pa('M90,110 L104,114 L90,119 Z', '#33e1ff', 2)}</g>`;
  }
  if (on('rack')) {
    s += `<rect x="234" y="184" width="54" height="7" rx="3" fill="#5d6680" stroke="${OL}" stroke-width="3"/>` + tube('M244,186 L244,138 M278,186 L278,138', '#aab4ca', 4) +
      tube('M228,148 L294,148', '#e6ebf5', 3.5) +
      `<rect x="225" y="134" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/><rect x="288" y="134" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>` +
      `<rect x="234" y="139" width="6" height="18" rx="2" fill="#2b6cff" stroke="${OL}" stroke-width="2.5"/><rect x="282" y="139" width="6" height="18" rx="2" fill="#2b6cff" stroke="${OL}" stroke-width="2.5"/>`;
  }
  if (on('flag')) {
    s += tube('M172,180 L172,92', '#dfe5f0', 3.5) + `<circle cx="172" cy="90" r="4.5" fill="url(#gGold)" stroke="${OL}" stroke-width="2.5"/>` +
      `<g class="wave">${pa('M172,96 Q190,90 208,98 Q224,104 238,98 L238,126 Q224,132 208,126 Q190,118 172,124 Z', '#ff3b4f', 4)}` +
      `<text x="205" y="118" text-anchor="middle" font-family="'Baloo 2',system-ui,sans-serif" font-weight="800" font-size="17" fill="#fff" stroke="${OL}" stroke-width="3.5" paint-order="stroke">−25</text></g>`;
  }
  if (on('grass')) {
    const r = seeded(3);
    for (let i = 0; i < 16; i++) {
      const x = 8 + r() * 384, y = 184 + r() * 62;
      s += pa(`M${x.toFixed(0)},${y.toFixed(0)} l-5,-11 l6,6 l2,-12 l3,12 l6,-7 l-3,12 Z`, night ? '#2f7a43' : '#2d9a3a', 2);
      if (i % 2 === 0) { const c = ['#ff5fa2', '#ffe14d', '#ffffff', '#ff8a1f'][i % 4]; s += `<circle cx="${(x + 9).toFixed(0)}" cy="${(y - 6).toFixed(0)}" r="3.6" fill="${c}" stroke="${OL}" stroke-width="1.6"/><circle cx="${(x + 9).toFixed(0)}" cy="${(y - 6).toFixed(0)}" r="1.3" fill="#ffb21f"/>`; }
    }
  }
  // Pet
  const items = [];
  if (!hatched) {
    items.push({ y: 230, svg: `<g class="scene-pet" data-pet="egg" transform="translate(${150 - 100 * .38} ${230 - 189 * .38}) scale(.38)">${eggInner()}</g>` });
  }
  PETS.forEach((p, i) => {
    if (!unlocked[p.id]) return;
    const [x, y, k] = SLOTS[i], lv = (petsState[p.id] || {}).lv || 1;
    items.push({ y, svg: `<g class="scene-pet ${p.id === 'phoenix' ? 'flyer' : ''}" data-pet="${p.id}" transform="translate(${(x - 100 * k).toFixed(1)} ${(y - 189 * k).toFixed(1)}) scale(${k})" tabindex="0" role="button" aria-label="${p.name}"><g class="bob" style="animation-delay:-${(i * .37).toFixed(2)}s">${petInner(p.id, lv)}</g></g>` });
  });
  if (on('fire')) {
    items.push({ y: 222, svg: `<circle cx="200" cy="214" r="34" fill="#ffb21f" opacity=".2"/>` + tube('M180,232 L220,220 M180,220 L220,232', '#8a4a1f', 5) +
      `<g class="flame">${pa('M200,226 C184,224 182,206 192,194 C192,204 198,206 198,200 C196,188 204,178 212,172 C208,186 222,192 218,208 C216,220 208,226 200,226 Z', 'url(#gFlame)', 3.5)}${pa('M200,224 C192,222 192,212 198,206 C200,212 204,210 204,206 C210,212 210,222 200,224 Z', '#fff59a', 0)}</g>` });
  }
  if (on('rock')) {
    items.push({ y: 244, svg: bl('<ellipse cx="104" cy="242" rx="22" ry="13"/><ellipse cx="124" cy="246" rx="13" ry="9"/>', 'url(#gRock)', 3.5) + hl(98, 236, 7, 3, -10, .5) + bl('<ellipse cx="300" cy="244" rx="18" ry="12"/>', 'url(#gRock)', 3.5) + hl(295, 239, 6, 2.5, -10, .5) });
  }
  items.sort((a, b) => a.y - b.y).forEach(it => s += it.svg);
  if (on('lantern')) {
    s += ln('M-4,20 Q100,52 200,30 Q300,8 404,30', OL, 2.5);
    [[34, 30], [102, 42], [168, 36], [236, 24], [300, 18], [366, 24]].forEach(([x, y], i) => {
      const c = i % 2 ? '#ffd21f' : '#ff3b4f';
      s += `<g class="swing" style="transform-origin:${x}px ${y}px;animation-delay:-${i * .3}s"><circle cx="${x}" cy="${y + 13}" r="13" fill="${c}" opacity=".25"/><rect x="${x - 3}" y="${y}" width="6" height="4" fill="${OL}"/>${el(x, y + 13, 9, 10, c, 3)}${ln(`M${x - 4},${y + 5} Q${x - 6},${y + 13} ${x - 4},${y + 21} M${x + 4},${y + 5} Q${x + 6},${y + 13} ${x + 4},${y + 21}`, 'rgba(0,0,0,.25)', 1.5)}<rect x="${x - 3}" y="${y + 22}" width="6" height="3" fill="${OL}"/>${ln(`M${x},${y + 25} l0,6`, c, 2)}</g>`;
    });
  }
  return s + `</svg>`;
}

/* ---------- Huy hiệu ---------- */
const TIER = [
  { n: 'Đồng', a: '#ffc08a', b: '#d9783a', c: '#8f4517' },
  { n: 'Bạc', a: '#ffffff', b: '#c5d1e6', c: '#7d8cab' },
  { n: 'Vàng', a: '#fff6b0', b: '#ffd21f', c: '#d48700' }
];
function badgeSVG(b, got) {
  const t = TIER[b.t], id = 'bg' + b.id;
  const fill = got ? `url(#${id})` : '#4a4378';
  return `<svg viewBox="0 0 100 110" class="badge-svg" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.a}"/><stop offset=".55" stop-color="${t.b}"/><stop offset="1" stop-color="${t.c}"/></linearGradient></defs>` +
    (got ? `<path d="M50,4 L58,14 L50,10 L42,14 Z" fill="#fff" opacity=".0"/>` : '') +
    `<path d="M50,6 L90,24 L90,62 Q90,92 50,106 Q10,92 10,62 L10,24 Z" fill="${OL}" transform="translate(0 4)"/>` +
    `<path d="M50,6 L90,24 L90,62 Q90,92 50,106 Q10,92 10,62 L10,24 Z" fill="${fill}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M50,18 L80,31 L80,61 Q80,84 50,95 Q20,84 20,61 L20,31 Z" fill="${got ? '#2b1f80' : '#2c2656'}" stroke="${OL}" stroke-width="3"/>` +
    (got ? `<path d="M22,30 L50,18 L78,30" fill="none" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>` : '') +
    `<text x="50" y="62" text-anchor="middle" dominant-baseline="central" font-size="32" ${got ? '' : 'opacity=".35" filter="grayscale(1)"'}>${b.ic}</text>` +
    (got ? '' : `<g transform="translate(66 76)"><rect x="-10" y="-4" width="20" height="16" rx="4" fill="#8f86c9" stroke="${OL}" stroke-width="3"/><path d="M-6,-4 v-4 a6,6 0 0 1 12,0 v4" fill="none" stroke="${OL}" stroke-width="3"/></g>`) +
    `</svg>`;
}

/* ---------- Biểu tượng điều hướng ---------- */
const NAV_ICONS = {
  today: `<svg viewBox="0 0 32 32"><path d="M16,3 C20,9 26,12 25,20 C24,27 19,30 16,30 C11,30 7,26 7,20 C7,15 11,13 11,9 C14,11 14,14 14,15 C16,12 17,8 16,3 Z" fill="url(#gFlame)" stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"/><path d="M16,28 C13,28 11.5,25.5 12,23 C13,24 14.5,24 14.5,22 C16,22.5 18,19 18,17 C21,20 21,28 16,28 Z" fill="#fff59a"/></svg>`,
  calendar: `<svg viewBox="0 0 32 32"><rect x="4" y="6" width="24" height="23" rx="5" fill="#fff" stroke="${OL}" stroke-width="2.6"/><path d="M4,11 Q4,6 9,6 L23,6 Q28,6 28,11 L28,13 L4,13 Z" fill="#ff4d6a" stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"/><path d="M10,3 v6 M22,3 v6" stroke="${OL}" stroke-width="2.8" stroke-linecap="round"/><path d="M10,20 l4,4 l8,-8" fill="none" stroke="#2fbf5a" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pets: `<svg viewBox="0 0 32 32"><ellipse cx="16" cy="21" rx="8" ry="7" fill="#ffb21f" stroke="${OL}" stroke-width="2.6"/><ellipse cx="7" cy="13" rx="3.4" ry="4.2" fill="#ffb21f" stroke="${OL}" stroke-width="2.4"/><ellipse cx="12.5" cy="7.5" rx="3.4" ry="4.2" fill="#ffb21f" stroke="${OL}" stroke-width="2.4"/><ellipse cx="19.5" cy="7.5" rx="3.4" ry="4.2" fill="#ffb21f" stroke="${OL}" stroke-width="2.4"/><ellipse cx="25" cy="13" rx="3.4" ry="4.2" fill="#ffb21f" stroke="${OL}" stroke-width="2.4"/><ellipse cx="13" cy="18" rx="2.5" ry="1.3" fill="#fff" opacity=".6"/></svg>`,
  weight: `<svg viewBox="0 0 32 32"><rect x="4" y="8" width="24" height="20" rx="6" fill="#33e1ff" stroke="${OL}" stroke-width="2.6"/><path d="M9,17 A7,7 0 0 1 23,17 Z" fill="#fff" stroke="${OL}" stroke-width="2.2"/><path d="M16,17 L19,12" stroke="#ff3b4f" stroke-width="2.4" stroke-linecap="round"/><rect x="10" y="21" width="12" height="3" rx="1.5" fill="${OL}" opacity=".5"/></svg>`,
  badges: `<svg viewBox="0 0 32 32"><path d="M9,5 L23,5 L23,13 Q23,20 16,21 Q9,20 9,13 Z" fill="url(#gGold)" stroke="${OL}" stroke-width="2.6" stroke-linejoin="round"/><path d="M9,8 Q3,8 4,13 Q5,16 10,16 M23,8 Q29,8 28,13 Q27,16 22,16" fill="none" stroke="${OL}" stroke-width="2.4"/><path d="M14,21 L13,25 L19,25 L18,21" fill="#ffd21f" stroke="${OL}" stroke-width="2.4" stroke-linejoin="round"/><rect x="9" y="25" width="14" height="4" rx="2" fill="#7a4cff" stroke="${OL}" stroke-width="2.4"/><path d="M13,9 L13,13" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`
};
