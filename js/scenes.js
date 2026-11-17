/* ===================== CẢNH NỀN RIÊNG CỦA TỪNG PET (viewBox 0 0 360 300, bục đứng tâm 180,262) ===================== */
const SW = 360, SH = 300;
function rng(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
const skyR = (...c) => `<rect width="${SW}" height="${SH}" fill="${lin(...c)}"/>`;
function starsR(n, seed, yMax = 160, col = '#fff') {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) s += `<circle class="${i % 4 ? '' : 'twinkle'}" style="animation-delay:${f1(r() * 2)}s" cx="${f1(r() * SW)}" cy="${f1(r() * yMax)}" r="${f1(.7 + r() * 1.6)}" fill="${col}"/>`;
  return s;
}
const moonR = (x, y, r, col = '#fff4c2') => `<circle cx="${x}" cy="${y}" r="${r * 1.7}" fill="${col}" opacity=".12"/>` + ci(x, y, r, col, 3.5) + ci(x - r * .3, y + r * .2, r * .18, '#e8d89a', 0) + ci(x + r * .35, y - r * .3, r * .12, '#e8d89a', 0) + ci(x + r * .2, y + r * .45, r * .1, '#e8d89a', 0);
function sunR(x, y, r, ray = '#fff3a0') {
  let rays = ''; for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; rays += `<path d="M${P(x + (r + 6) * Math.cos(a - .1), y + (r + 6) * Math.sin(a - .1))} L${P(x + (r + 22) * Math.cos(a), y + (r + 22) * Math.sin(a))} L${P(x + (r + 6) * Math.cos(a + .1), y + (r + 6) * Math.sin(a + .1))} Z" fill="${ray}" opacity=".85"/>`; }
  return `<g class="spin-slow" style="transform-origin:${x}px ${y}px">${rays}</g>` + ci(x, y, r, 'url(#gSun)', 4);
}
const cloudR = (x, y, k = 1, col = '#ffffff', cls = 'drift') => `<g class="${cls}">` + bl(`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(13 * k)}"/><circle cx="${f1(x + 18 * k)}" cy="${f1(y - 8 * k)}" r="${f1(17 * k)}"/><circle cx="${f1(x + 38 * k)}" cy="${f1(y)}" r="${f1(12 * k)}"/><rect x="${f1(x - 8 * k)}" y="${f1(y - 2 * k)}" width="${f1(54 * k)}" height="${f1(14 * k)}" rx="${f1(7 * k)}"/>`, col, 3) + `</g>`;
// Dãy núi từ danh sách đỉnh [x, y]
function ridge(peaks, base, col, w = 3.5, ex = '') {
  let d = `M-10,${base} L-10,${peaks[0][1] + 20}`;
  peaks.forEach(([x, y], i) => { const prev = peaks[i - 1]; if (prev) d += ` L${f1((prev[0] + x) / 2)},${f1(Math.max(prev[1], y) + 26)}`; d += ` L${x},${y}`; });
  d += ` L${SW + 10},${peaks[peaks.length - 1][1] + 20} L${SW + 10},${base} Z`;
  return pa(d, col, w, ex);
}
function hillsR(y, amp, col, seed = 1, w = 3.5) {
  const r = rng(seed); let d = `M-10,${SH} L-10,${y}`;
  for (let x = 0; x <= SW + 40; x += 60) d += ` Q${f1(x + 30)},${f1(y - amp * (.4 + r()))} ${x + 60},${f1(y + (r() - .5) * amp * .5)}`;
  return pa(d + ` L${SW + 10},${SH} Z`, col, w);
}
const groundR = (y, col, w = 4) => pa(`M-10,${y + 6} Q${SW / 2},${y - 10} ${SW + 10},${y + 6} L${SW + 10},${SH + 10} L-10,${SH + 10} Z`, col, w);
// Bục đứng cho pet
function platformR(top, side, deco = '') {
  return `<ellipse cx="180" cy="270" rx="104" ry="18" fill="#000" opacity=".3"/>` + pa('M80,258 Q80,282 180,284 Q280,282 280,258 Z', side, 4) + el(180, 258, 100, 16, top, 4) + hl(140, 252, 26, 3, 0, .35) + deco;
}
function pine(x, y, h, col = '#2f8a5a', snow = false) {
  let s = pa(`M${x - 3},${y} L${x - 3},${y - h * .2} L${x + 3},${y - h * .2} L${x + 3},${y} Z`, '#6e3c18', 2.5);
  for (let i = 0; i < 3; i++) { const yy = y - h * .15 - i * h * .27, ww = h * (.42 - i * .1); s += pa(`M${f1(x - ww)},${f1(yy)} L${x},${f1(yy - h * .4)} L${f1(x + ww)},${f1(yy)} Z`, col, 3); if (snow) s += pa(`M${f1(x - ww * .45)},${f1(yy - h * .22)} L${x},${f1(yy - h * .4)} L${f1(x + ww * .45)},${f1(yy - h * .22)} Q${x},${f1(yy - h * .28)} ${f1(x - ww * .45)},${f1(yy - h * .22)} Z`, '#ffffff', 0); }
  return s;
}
const flakes = (n, seed) => { const r = rng(seed); let s = '<g class="snow">'; for (let i = 0; i < n; i++) s += `<circle cx="${f1(r() * SW)}" cy="${f1(r() * SH)}" r="${f1(1.2 + r() * 2.2)}" fill="#fff" opacity=".85"/>`; return s + '</g>'; };
const embers = (n, seed, c = '#ffb21f') => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<g class="ember" style="animation-delay:-${f1(r() * 3)}s">${ci(r() * SW, 140 + r() * 120, 1.6 + r() * 2.2, i % 2 ? c : '#ff6a2b', 1.2)}</g>`; return s; };
function crystalsR(x, y, k, c, cd) { return crystal(x - 14 * k, y, 30 * k, 14 * k, c, cd, 3, -8 * k) + crystal(x + 14 * k, y, 26 * k, 13 * k, c, cd, 3, 8 * k) + crystal(x, y + 2, 44 * k, 18 * k, c, cd, 3.5); }
const skyBolt = (x, y, h, c = '#fff59a') => `<g class="flick">${bolt(x, y, h, c, 3)}</g>`;
function stormCloud(x, y, k, col = '#4a3f9e') { return bl(`<circle cx="${x}" cy="${y}" r="${18 * k}"/><circle cx="${x + 24 * k}" cy="${y - 12 * k}" r="${24 * k}"/><circle cx="${x + 52 * k}" cy="${y - 2 * k}" r="${18 * k}"/><rect x="${x - 14 * k}" y="${y}" width="${82 * k}" height="${16 * k}" rx="${8 * k}"/>`, col, 3.5); }
function mushroom(x, y, h, cap, dots = '#fff') {
  return pa(`M${x - h * .12},${y} Q${x - h * .1},${y - h * .55} ${x - h * .06},${y - h * .7} L${x + h * .06},${y - h * .7} Q${x + h * .1},${y - h * .55} ${x + h * .12},${y} Z`, '#fff1d8', 3) +
    pa(`M${x - h * .5},${y - h * .62} Q${x - h * .45},${y - h * 1.1} ${x},${y - h * 1.1} Q${x + h * .45},${y - h * 1.1} ${x + h * .5},${y - h * .62} Q${x},${y - h * .7} ${x - h * .5},${y - h * .62} Z`, cel(cap, '#a8205f'), 3.5) +
    ci(x - h * .2, y - h * .88, h * .07, dots, 0) + ci(x + h * .18, y - h * .95, h * .06, dots, 0) + ci(x + h * .3, y - h * .75, h * .05, dots, 0);
}
function bamboo(x, y, h, col = '#7bd65a') { let s = tube(`M${x},${y} V${y - h}`, col, 10, 3); for (let k = 1; k < 5; k++) s += ln(`M${x - 6},${f1(y - h * k / 5)} h12`, '#2f9a3e', 3); return s + leaf(x, y - h * .62, 16, -30, '#7be35a', '#2f9a3e', 2.4) + leaf(x, y - h * .4, 14, -150, '#9df27a', '#2f9a3e', 2.4); }
function building(x, w, h, col, win = '#33e1ff', seed = 1) {
  const r = rng(seed); let s = pa(`M${x},${SH} V${SH - h} H${x + w} V${SH} Z`, col, 3);
  for (let yy = SH - h + 10; yy < SH - 20; yy += 16) for (let xx = x + 6; xx < x + w - 8; xx += 12) if (r() > .35) s += `<rect x="${xx}" y="${yy}" width="6" height="8" rx="1.5" fill="${r() > .5 ? win : '#ff4fd8'}" opacity="${f1(.6 + r() * .4)}"/>`;
  return s;
}
const gear = (x, y, r, col = '#56698c') => { let d = ''; for (let i = 0; i < 8; i++) { const a = i * 45 * Math.PI / 180; d += `<rect x="${f1(x - r * .18)}" y="${f1(y - r * 1.25)}" width="${f1(r * .36)}" height="${f1(r * .5)}" transform="rotate(${i * 45} ${x} ${y})"/>`; } return `<g class="spin-slow" style="transform-origin:${x}px ${y}px">` + bl(`<circle cx="${x}" cy="${y}" r="${r}"/>${d}`, col, 3) + ci(x, y, r * .35, '#2a2448', 3) + `</g>`; };
const fireflies = (n, seed, c = '#e8ff7a') => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) s += `<circle class="twinkle" style="animation-delay:${f1(r() * 2)}s" cx="${f1(r() * SW)}" cy="${f1(80 + r() * 160)}" r="${f1(2 + r() * 1.5)}" fill="${c}"/>`; return s; };

const SCENES = {
  /* ---- Lửa ---- */
  wolf: () => skyR('#3a1f78', '#c2387a', '#ff8a3d') + starsR(16, 3, 90) + ridge([[40, 150], [110, 120], [170, 160], [250, 130], [330, 150]], 240, '#4a2a6e') +
    pa('M120,230 L170,96 Q180,86 190,96 L240,230 Z', '#3a2552', 4) + pa('M164,112 Q180,100 196,112 L188,124 Q180,118 172,124 Z', 'url(#gLava)', 3) +
    `<g class="ember">${flame(180, 104, 40, 30, 3, true, 4)}</g>` + pa('M176,120 Q172,150 160,170 Q168,168 176,150 Q180,170 172,200', 'none', 0) + ln('M178,122 Q172,150 162,172 M184,124 Q190,160 198,190', '#ff8a1f', 4) +
    groundR(222, '#2a1a40') + ln('M30,240 l20,6 l10,-4 M300,236 l-14,8 l-16,-2 M60,280 l18,-4', '#ff8a1f', 3) + embers(14, 5) + platformR('#5a3a6e', '#3a2450', ln('M120,256 l14,4 l10,-3 M220,262 l16,-5', '#ff8a1f', 2.5)),
  dragon: () => skyR('#1a0a2e', '#4a0f2e', '#8a1f2a') + pa('M0,0 H360 V40 L340,74 L326,40 L300,90 L282,40 L250,70 L230,36 L200,62 L176,36 L150,80 L128,36 L100,66 L76,36 L50,84 L30,36 L0,60 Z', '#2a1236', 4) +
    crystalsR(46, 230, 1.1, '#ff8a3d', '#c2380f') + crystalsR(318, 226, .9, '#ffb21f', '#d47f00') + groundR(216, '#3a1830') +
    pa('M10,250 Q60,236 120,248 Q90,262 30,262 Z M250,246 Q300,236 350,248 Q330,262 270,260 Z', 'url(#gLava)', 3) +
    [[70, 236], [86, 240], [62, 244], [290, 236], [306, 240]].map(([x, y]) => ci(x, y, 6, 'url(#gGold)', 2.5)).join('') + embers(10, 9) + platformR('#6e2a3a', '#4a1426', ci(130, 255, 5, 'url(#gGold)', 2) + ci(236, 258, 4.5, 'url(#gGold)', 2)),
  salamander: () => skyR('#2a1460', '#8a2a6e', '#ff6a3d') + moonR(300, 50, 16, '#ffd6a0') + ridge([[30, 160], [100, 140], [190, 170], [280, 130], [350, 160]], 240, '#4a2a5e') +
    groundR(200, '#2e1a3e') + pa('M-10,236 Q80,214 160,230 Q240,246 370,222 L370,250 Q250,272 160,256 Q70,240 -10,262 Z', 'url(#gLava)', 4) +
    ln('M20,244 q20,-6 40,0 M200,244 q24,6 48,0', '#fff59a', 2.5) + bl('<ellipse cx="60" cy="240" rx="18" ry="7"/><ellipse cx="300" cy="234" rx="16" ry="6"/>', '#4a3a5e', 3) + embers(12, 13) +
    platformR('#4a3a5e', '#2e2440', ln('M110,258 l12,3 M240,256 l10,4', '#ff8a1f', 2.5)),
  phoenix: () => skyR('#ff7a3d', '#ffb21f', '#fff0b0') + sunR(180, 96, 44) + cloudR(20, 200, 1.4, '#fff6e0', '') + cloudR(250, 196, 1.5, '#fff6e0', '') +
    [60, 300].map(x => pa(`M${x - 14},250 V140 H${x + 14} V250 Z`, cel('#ffe6b0', '#e0a050'), 4) + pa(`M${x - 20},140 H${x + 20} V128 H${x - 20} Z`, '#ffd21f', 3.5)).join('') +
    pa('M-10,230 Q60,214 120,226 Q180,212 240,226 Q300,214 370,226 L370,310 L-10,310 Z', '#fff6e0', 4) + embers(10, 17, '#ffd21f') + platformR('#ffd21f', '#e08a00', pa(starPath(180, 258, 12, 5), '#fff6b0', 2.5)),
  /* ---- Băng ---- */
  penguin: () => skyR('#7fd0ff', '#c9ecff', '#eaf8ff') + cloudR(30, 50, 1, '#fff') + cloudR(240, 70, .9, '#fff', 'drift d2') +
    pa('M-10,190 H370 V310 H-10 Z', lin('#3fa9e8', '#1f6fd1'), 0) + ln('M20,206 h30 M90,214 h40 M250,208 h34 M300,222 h28', '#bff4ff', 3) +
    pa('M20,196 L44,120 L70,140 L92,196 Z', cel('#ffffff', '#bfe3ff'), 4) + pa('M260,196 L290,104 L314,130 L346,196 Z', cel('#ffffff', '#bfe3ff'), 4) + ln('M44,124 L52,160 M290,108 L296,150', '#bfe3ff', 2.5) +
    flakes(26, 21) + platformR('#ffffff', '#9fd8f5', ln('M120,262 l20,-4 M210,258 l24,3', '#bfe3ff', 2.5)),
  tiger: () => skyR('#2a3a8a', '#5a7ad6', '#a9c8ff') + moonR(290, 54, 18) + hillsR(170, 30, '#c9dcff', 4) + [24, 70, 300, 340].map((x, i) => pine(x, 210, 70 + (i % 2) * 20, '#1f6e5a', true)).join('') +
    groundR(214, '#f4fbff') + flakes(34, 25) + platformR('#e8f6ff', '#9cc8ea', crystal(126, 258, 16, 10, '#dffaff', '#5fc8f0', 2.5)),
  mammoth: () => skyR('#0b1a4a', '#1f3a8a', '#3f6ad6') + starsR(26, 31, 120) +
    `<g class="aurora" opacity=".75">${pa('M-10,60 Q90,20 180,70 Q270,110 370,40 L370,80 Q270,150 180,104 Q90,60 -10,100 Z', lin('#3fe0a0', '#33e1ff', '#8a5cff'), 0)}${pa('M-10,110 Q100,70 200,110 Q290,140 370,100 L370,124 Q290,170 200,134 Q100,96 -10,134 Z', lin('#9df27a', '#33e1ff'), 0, 'opacity=".6"')}</g>` +
    ridge([[20, 170], [90, 120], [160, 160], [240, 110], [320, 160]], 240, '#dff4ff') + ln('M90,124 L104,160 M240,114 L230,150', '#9fd8f5', 3) + groundR(220, '#eaf8ff') + platformR('#ffffff', '#9fd8f5'),
  yeti: () => skyR('#4a6ad6', '#9fc8ff', '#e6f4ff') + pa('M0,0 H360 V50 L344,90 L330,50 L314,76 L296,46 L272,96 L254,48 L230,70 L206,44 L184,84 L160,46 L136,70 L110,44 L90,90 L70,46 L46,74 L26,46 L0,80 Z', cel('#ffffff', '#9fd8f5'), 4) +
    crystalsR(40, 236, 1.2, '#dffaff', '#5fc8f0') + crystalsR(322, 230, 1, '#dffaff', '#5fc8f0') + groundR(220, '#f4fbff') + `<g class="blizzard">${flakes(40, 33)}</g>` + platformR('#e8f6ff', '#9cc8ea'),
  /* ---- Sấm ---- */
  squirrel: () => skyR('#2a2a6e', '#4a4fae', '#8a8ae6') + stormCloud(20, 50, 1.1, '#3a3480') + stormCloud(220, 40, 1.2, '#3a3480') + skyBolt(84, 60, 70) +
    hillsR(200, 40, '#3f8a5a', 7) + tube('M290,200 Q296,150 286,110', '#6e3c18', 9, 3.5) + tube('M288,130 L316,110 M290,150 L262,136', '#6e3c18', 5, 3) + bl('<circle cx="282" cy="104" r="22"/><circle cx="306" cy="98" r="18"/><circle cx="264" cy="118" r="14"/>', '#2f7a43', 3.5) +
    groundR(224, '#2f7a43') + platformR('#5ab86a', '#2f7a43', bolt(232, 248, 14, '#ffd21f', 2)),
  fox: () => skyR('#141a4a', '#2a3a8a', '#4a6ad6') + stormCloud(-10, 40, 1.4, '#2a2f70') + stormCloud(200, 30, 1.6, '#2a2f70') + skyBolt(70, 60, 110, '#33e1ff') + skyBolt(280, 50, 90) +
    hillsR(200, 18, '#1f3a6e', 11) + groundR(214, '#2a4a7a') + (() => { const r = rng(41); let s = ''; for (let i = 0; i < 18; i++) { const x = r() * SW, y = 226 + r() * 60; s += ln(`M${f1(x)},${f1(y)} l-3,-12 M${f1(x + 5)},${f1(y)} l2,-14`, '#4a7ab8', 2.5); } return s; })() + platformR('#3a5a9a', '#1f3a6e', bolt(132, 250, 14, '#ffd21f', 2)),
  eagle: () => skyR('#1f2a6e', '#4a5fd8', '#9fb0ff') + stormCloud(-20, 210, 1.6, '#5a5fae') + stormCloud(200, 220, 1.8, '#5a5fae') + skyBolt(110, 210, 60, '#ffd21f') +
    pa('M240,300 L250,150 Q262,120 290,124 L360,120 V300 Z', cel('#8a8ab8', '#4a4a7e'), 4) + pa('M0,300 V160 Q30,140 60,150 L90,300 Z', cel('#8a8ab8', '#4a4a7e'), 4) + cloudR(130, 60, 1, '#c9d0ff') +
    platformR('#9a9ac4', '#5a5a8e', ln('M120,260 l18,-3', '#4a4a7e', 2.5)),
  uni: () => skyR('#1a0a4a', '#4a1f8a', '#a83cb8') + starsR(34, 47, 200, '#fff') + [[60, 120, .8], [300, 90, 1]].map(([x, y, k]) => pa(`M${x - 34 * k},${y} Q${x},${y - 10 * k} ${x + 34 * k},${y} L${x + 10 * k},${y + 40 * k} L${x},${y + 56 * k} L${x - 12 * k},${y + 38 * k} Z`, cel('#8a5cff', '#4a1fa8'), 3.5) + crystalsR(x, y - 2, .6 * k, '#c9f6ff', '#33e1ff')).join('') +
    pa('M-10,250 Q90,220 180,230 Q270,220 370,250 L370,310 L-10,310 Z', '#2a1260', 4) + fireflies(14, 49, '#ff9ef0') + platformR(lin('#c9f6ff', '#8a5cff'), '#4a1fa8', crystalsR(110, 256, .45, '#c9f6ff', '#33e1ff')),
  /* ---- Đá ---- */
  turtle: () => skyR('#ffb06a', '#ffd9a0', '#fff1d0') + sunR(290, 60, 22) + [[10, 90, 150], [120, 70, 170], [250, 100, 140]].map(([x, w, top]) => pa(`M${x},250 L${x + 8},${top} L${x + w - 8},${top} L${x + w},250 Z`, cel('#d9804a', '#9a4a24'), 4) + ln(`M${x + 10},${top + 20} H${x + w - 10} M${x + 6},${top + 46} H${x + w - 6}`, '#9a4a24', 2.5)).join('') +
    groundR(222, '#e0a060') + bl('<ellipse cx="40" cy="262" rx="16" ry="9"/><ellipse cx="320" cy="258" rx="20" ry="10"/>', cel('#c9a07a', '#8a5a34'), 3) + platformR('#c98a4a', '#8a5428'),
  pangolin: () => skyR('#2a1a3e', '#4a2a4e', '#6e3a4a') + pa('M0,0 H360 V60 Q300,90 250,70 Q200,100 140,74 Q80,96 0,70 Z', '#3a2440', 4) + crystalsR(50, 226, 1.3, '#ffcf4a', '#e08a00') + crystalsR(312, 220, 1.1, '#ffcf4a', '#e08a00') + crystalsR(250, 120, .6, '#ffe07a', '#e08a00') +
    groundR(214, '#5e4a5a') + ln('M-10,280 L370,262 M-10,292 L370,274', '#8a6a4a', 4) + [0, 40, 80, 120, 160, 200, 240, 280, 320, 360].map(x => ln(`M${x},${f1(282 - x * .05)} v12`, '#6e4c34', 4)).join('') + platformR('#8a6a5a', '#5e4440', amber(232, 256, 14)),
  rhino: () => skyR('#ff9a4a', '#ffd06a', '#fff0b0') + sunR(80, 64, 26) + pa('M-10,230 V150 Q60,130 120,140 L120,230 Z M240,230 V140 Q300,128 370,150 V230 Z', cel('#c98a5a', '#8a5428'), 4) +
    [140, 220].map(x => pa(`M${x - 10},230 V120 H${x + 10} V230 Z`, cel('#e0b07a', '#a06a3a'), 3.5) + pa(`M${x - 16},120 H${x + 16} V110 H${x - 16} Z`, '#a06a3a', 3)).join('') + groundR(226, '#f0c080') + platformR('#c99a6b', '#8a5a34', ln('M120,258 Q180,250 240,258', '#8a5a34', 2.5)),
  gorilla: () => skyR('#4a6ad6', '#8ab0ff', '#d0e6ff') + ridge([[30, 120], [100, 90], [180, 130], [260, 80], [340, 120]], 240, '#7a7ab0') + cloudR(150, 90, 1, '#ffffff') +
    pa('M230,230 V150 L300,120 L370,150 V230 Z', cel('#a89acc', '#6e5a9a'), 4) + pa('M226,152 L300,108 L374,152 Z', '#c99a6b', 4) + pa('M286,230 V180 Q300,168 314,180 V230 Z', '#2a2448', 3.5) +
    groundR(226, '#8a8ab8') + [[40, 250, 24], [80, 262, 14]].map(([x, y, r]) => rockChunk(x, y, r, '#a89acc', '#6e5a9a')).join('') + platformR('#9a8abe', '#6a5a94', amber(126, 256, 14)),
  /* ---- Rừng ---- */
  frog: () => skyR('#7fe0ff', '#c9f6ff', '#e8ffd8') + cloudR(40, 50, 1) + hillsR(170, 30, '#5ab86a', 51) + [20, 330].map(x => ln(`M${x},250 Q${x - 4},190 ${x + 6},150 M${x + 10},250 Q${x + 14},200 ${x + 22},170`, '#2f9a3e', 5)).join('') +
    pa('M-10,210 Q180,190 370,210 L370,310 L-10,310 Z', lin('#5fd0e6', '#2f9ab8'), 4) + [[60, 236, 22], [290, 230, 26], [320, 270, 18]].map(([x, y, r]) => pa(`M${x},${y} m${-r},0 a${r},${r * .45} 0 1 0 ${r * 2},0 a${r},${r * .45} 0 1 0 ${-r * 2},0 Z`, '#5ad04a', 3) + ln(`M${x},${y} l${r * .8},-${r * .2}`, '#2f9a3e', 2.5)).join('') + flower(66, 228, 6) +
    fireflies(8, 53) + platformR('#5ad04a', '#2f9a3e', flower(236, 256, 5)),
  beetle: () => skyR('#0f2a3a', '#1f5a5a', '#2f8a6a') + fireflies(20, 59, '#b6ff3b') + mushroom(50, 250, 110, '#ff5fa2') + mushroom(320, 246, 130, '#8a5cff') + mushroom(110, 240, 50, '#33e1ff') + mushroom(268, 236, 46, '#ffb21f') +
    groundR(222, '#1f4a3a') + platformR('#3f8a5a', '#1f5a3a', mushroom(132, 262, 18, '#ff5fa2') + mushroom(232, 260, 14, '#ffb21f')),
  stag: () => skyR('#ffe6a0', '#d8f5b0', '#a8e6a0') + `<g opacity=".35">${[0, 1, 2, 3].map(i => `<path d="M${80 + i * 50},0 L${40 + i * 70},300 L${70 + i * 70},300 L${100 + i * 50},0 Z" fill="#fff"/>`).join('')}</g>` +
    [20, 70, 300, 345].map((x, i) => tube(`M${x},260 V40`, '#7a4a24', 16 + (i % 2) * 4, 4)).join('') + bl('<circle cx="40" cy="60" r="40"/><circle cx="80" cy="40" r="34"/><circle cx="320" cy="50" r="40"/><circle cx="350" cy="80" r="30"/>', 'url(#gLeafG)', 4) +
    groundR(224, '#5ab86a') + `<rect y="200" width="360" height="40" fill="#fff" opacity=".25"/>` + platformR('#7cc46a', '#3f8a45', flower(130, 258, 5, '#ffd21f') + flower(236, 260, 5)),
  panda: () => skyR('#bfe6a0', '#e8ffd0', '#f6fff0') + [16, 44, 300, 330, 352].map((x, i) => bamboo(x, 300, 220 + (i % 3) * 30)).join('') +
    pa('M100,150 L180,110 L260,150 L250,160 L110,160 Z', '#c43a3a', 4) + pa('M120,160 V230 H240 V160 Z', cel('#ffe6b0', '#e0b070'), 4) + pa('M160,230 V180 H200 V230 Z', '#6e3c18', 3.5) +
    [[130, 168], [230, 168]].map(([x, y]) => `<g class="swing" style="transform-origin:${x}px ${y}px">` + el(x, y + 12, 7, 9, '#ff3b4f', 3) + `</g>`).join('') + groundR(226, '#a8d880') + platformR('#c9a06a', '#8a6a3a'),
  /* ---- Bóng đêm ---- */
  bat: () => skyR('#0b0626', '#2a1260', '#5a2a8a') + moonR(250, 90, 46, '#ffe6b0') + starsR(20, 61, 140) +
    pa('M20,240 V150 H40 V136 H52 V150 H70 V120 H84 V104 H96 V120 H108 V170 H130 V140 H142 V240 Z', '#1a0f3a', 4) + `<rect x="86" y="128" width="8" height="12" fill="#ffd21f"/>` +
    [[200, 60], [300, 140], [150, 100]].map(([x, y], i) => `<g class="drift d${i % 2 + 1}">${pa(`M${x},${y} q-8,-8 -16,-2 q4,2 4,6 q-4,-2 -8,2 q8,0 10,4 q2,-6 10,-10 Z M${x},${y} q8,-8 16,-2 q-4,2 -4,6 q4,-2 8,2 q-8,0 -10,4 q-2,-6 -10,-10 Z`, '#1a0f3a', 1.5)}</g>`).join('') +
    groundR(226, '#1f1440') + platformR('#4a3a7a', '#2a1f50'),
  cat: () => skyR('#141040', '#2a1f78', '#4a3aa8') + moonR(70, 60, 24) + starsR(18, 67, 120) +
    pa('M-10,300 V190 H60 V170 L90,140 L120,170 V190 H170 V160 H230 V200 H290 V150 L320,120 L350,150 H370 V300 Z', '#1d1650', 4) +
    [[30, 210], [80, 200], [190, 180], [250, 220], [320, 180]].map(([x, y]) => `<rect x="${x}" y="${y}" width="12" height="14" rx="2" fill="#ffd21f" opacity=".85"/>`).join('') +
    ln('M-10,110 Q90,150 200,120 Q290,96 370,130', OL, 2) + [[30, 120], [100, 136], [170, 128], [240, 112], [310, 118]].map(([x, y], i) => `<g class="swing" style="transform-origin:${x}px ${y}px">${el(x, y + 9, 6, 8, i % 2 ? '#ff4fd8' : '#ffd21f', 2.5)}</g>`).join('') +
    platformR('#3a2d66', '#1d1440', ci(236, 256, 4, '#b6ff3b', 0)),
  owl: () => skyR('#0b0a3a', '#1f2a7a', '#3f4fbf') + moonR(180, 100, 56) + starsR(24, 71, 150) + [10, 60, 300, 350].map((x, i) => pine(x, 240, 120 + (i % 2) * 30, '#141a4a')).join('') +
    tube('M-10,140 Q80,150 150,130', '#3a2a5e', 10, 4) + leaf(110, 136, 14, -60, '#2f6a5a', '#141a4a', 2.4) + groundR(226, '#141a4a') + fireflies(8, 73, '#ffd21f') + platformR('#3a3a7e', '#1f1f50'),
  panther: () => skyR('#0a0520', '#1f0a40', '#3a1260') + crystalsR(40, 240, 1.4, '#c86bff', '#5a1fb0') + crystalsR(320, 236, 1.2, '#ff4fd8', '#a8208e') + crystalsR(90, 110, .5, '#c86bff', '#5a1fb0') + crystalsR(270, 90, .6, '#ff4fd8', '#a8208e') +
    [[120, 150], [250, 170]].map(([x, y]) => `<g class="blink">${el(x - 6, y, 4, 2.5, '#b6ff3b', 0)}${el(x + 6, y, 4, 2.5, '#b6ff3b', 0)}</g>`).join('') + groundR(226, '#1a0f30') + platformR('#3a2a5e', '#1d1240', crystal(132, 258, 14, 9, '#c86bff', '#5a1fb0', 2.5)),
  /* ---- Thép ---- */
  bear: () => skyR('#1a1650', '#2a2478', '#3a3090') + `<rect x="0" y="40" width="360" height="12" fill="#2a2448"/>` + ln('M0,52 H360', OL, 3) +
    `<g>${pa('M110,64 H250 V108 H110 Z', '#141040', 4)}<text x="180" y="98" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="34" fill="#ff4fd8" stroke="#ffd6fb" stroke-width="1.2" class="blink-slow">-25 KG</text></g>` +
    [[20, 230], [300, 230]].map(([x, y]) => tube(`M${x + 10},${y} V130 M${x + 50},${y} V130`, '#a7b8d0', 6, 3.5) + tube(`M${x - 4},150 H${x + 64}`, '#e6edf7', 5, 3.5) + `<rect x="${x - 10}" y="134" width="10" height="32" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/><rect x="${x + 60}" y="134" width="10" height="32" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>`).join('') +
    pa('M-10,230 H370 V310 H-10 Z', '#2a2448', 4) + ln('M-10,250 H370 M-10,276 H370', '#3a3266', 3) + platformR('#a7b8d0', '#56698c', bolts4([[110, 258], [250, 258], [180, 270]])),
  scorpion: () => skyR('#1a0f3a', '#4a1f5a', '#a83a4a') + moonR(80, 60, 20, '#ffd6a0') + starsR(14, 79, 100) +
    pa('M190,240 L230,170 L260,190 L290,150 L330,200 L370,190 V240 Z', '#3a2a40', 4) + gear(250, 196, 16, '#6e5a6e') + el(306, 200, 18, 10, 'none', 6) + ci(306, 200, 14, 'none', 5) +
    pa('M-10,240 L20,190 L60,210 L90,180 L130,240 Z', '#3a2a40', 4) + groundR(226, '#7a4a4a') + platformR('#8a5a5a', '#5a3a3a', bolts4([[130, 260], [232, 258]])),
  bull: () => skyR('#0a0a2a', '#1a1a4a', '#2a2a6a') + [[60, 0], [300, 0]].map(([x]) => `<path d="M${x},0 L${x - 50},300 L${x + 50},300 Z" fill="#fff6b0" opacity=".12"/>` + pa(`M${x - 14},0 H${x + 14} L${x + 10},14 H${x - 10} Z`, '#56698c', 3)).join('') +
    (() => { const r = rng(83); let s = ''; for (let i = 0; i < 40; i++) { const x = r() * SW, y = 150 + r() * 40; s += ci(x, y, 7 + r() * 3, '#141038', 0) + `<rect x="${f1(x - 7)}" y="${f1(y + 6)}" width="14" height="14" fill="#141038"/>`; } return s; })() +
    pa('M-10,190 H370 V230 H-10 Z', cel('#a7b8d0', '#56698c'), 4) + [30, 90, 150, 210, 270, 330].map(x => rivet(x, 210, 3)).join('') + groundR(232, '#3a3a6a') + platformR('#c9d4e6', '#6c81a3', `<circle cx="180" cy="258" r="10" fill="#ff2e4a" stroke="${OL}" stroke-width="3"/>`),
  mecha: () => skyR('#0a0a30', '#2a1260', '#8a1f8a') + starsR(10, 89, 80) + building(0, 50, 170, '#1f1450', '#33e1ff', 1) + building(56, 40, 210, '#2a1a60', '#ff4fd8', 2) + building(260, 46, 200, '#2a1a60', '#33e1ff', 3) + building(312, 50, 150, '#1f1450', '#ffd21f', 4) +
    pa('M-10,230 H370 V310 H-10 Z', '#1a0a3a', 4) + [0, 1, 2, 3].map(i => ln(`M-10,${240 + i * 18} H370`, '#ff4fd8', 1.6, 'opacity=".6"')).join('') + [-3, -2, -1, 0, 1, 2, 3].map(i => ln(`M${180 + i * 30},232 L${180 + i * 90},310`, '#33e1ff', 1.6, 'opacity=".6"')).join('') +
    platformR('#2fc4a8', '#137a6a', ci(180, 258, 6, '#33e1ff', 2.5))
};
const SCENE_NAME = {
  wolf: 'Đỉnh núi lửa', dragon: 'Hang báu dung nham', salamander: 'Sông dung nham', phoenix: 'Đền mặt trời',
  penguin: 'Biển băng trôi', tiger: 'Rừng thông tuyết', mammoth: 'Cực quang sông băng', yeti: 'Hang băng đỉnh núi',
  squirrel: 'Đồi cây sét', fox: 'Đồng cỏ giông', eagle: 'Vách đá trên mây giông', uni: 'Đảo pha lê lơ lửng',
  turtle: 'Hẻm núi đá đỏ', pangolin: 'Mỏ hổ phách', rhino: 'Đấu trường sa mạc', gorilla: 'Đền đá trên núi',
  frog: 'Ao sen', beetle: 'Rừng nấm phát sáng', stag: 'Bìa rừng nắng sớm', panda: 'Võ đường rừng tre',
  bat: 'Lâu đài dưới trăng', cat: 'Mái phố đêm', owl: 'Rừng đêm trăng tròn', panther: 'Hang pha lê tím',
  bear: 'Phòng tập thép', scorpion: 'Bãi sắt hoang', bull: 'Đấu trường thép', mecha: 'Phố neon'
};
function sceneSVG(id, cls = '') {
  return `<svg class="pscene ${cls}" viewBox="0 0 ${SW} ${SH}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(SCENES[id] || SCENES.wolf)()}</svg>`;
}

/* ---------- SỬ THI ---------- */
// Cảnh nền của 7 pet Sử thi ghép ngay dưới dòng này.

/* ===================== CẢNH NỀN · NGHÊ LỬA (ep_nghe): Sân đền cổ lúc hoàng hôn =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như js/scenes.js. Nạp SAU scenes.js (dùng SCENES, SCENE_NAME, skyR, starsR, embers, SW, SH).
   Đình hai tầng mái đao cong, ngọc lửa trên nóc; hai cột đá đèn lửa; lư hương đồng khói cuộn; mây lửa vàng; mặt trời trống đồng; bục là mặt trống đồng.
   Hàm phụ trong IIFE, tiền tố ngh, không thêm tên toàn cục. */
(() => {
  if (typeof SCENES === 'undefined') return;
  const R = Math.PI / 180;
  // Nét xoắn ốc (lọn mây, đầu đao)
  const nghSp = (x, y, r, sd = 1) => { const k = r * .25, f = sd > 0 ? 1 : 0; return `M${P(x - k * .2, y)} A${f1(k * .9)},${f1(k * .9)} 0 0 ${f} ${P(x + k * 1.6, y)} A${f1(k * 1.9)},${f1(k * 1.9)} 0 0 ${f} ${P(x - k * 2.2, y)} A${f1(k * 2.7)},${f1(k * 2.7)} 0 0 ${f} ${P(x + k * 3.2, y)}`; };
  // Mây lửa vàng: dải lọn tròn, hai đầu xoắn
  function nghCloud(x, y, k, cls = 'drift') {
    const L = [[x, y, 7 * k], [x + 13 * k, y - 6 * k, 10 * k], [x + 29 * k, y - 7 * k, 11 * k], [x + 44 * k, y - 2 * k, 8 * k], [x + 56 * k, y + 1 * k, 6 * k]];
    let s = bl(L.map(([cx, cy, r]) => `<circle cx="${f1(cx)}" cy="${f1(cy)}" r="${f1(r)}"/>`).join('') + `<rect x="${f1(x - 4 * k)}" y="${f1(y - 2 * k)}" width="${f1(64 * k)}" height="${f1(9 * k)}" rx="${f1(4.5 * k)}"/>`, cel('#ffe27a', '#ff9a2a', .68), 3);
    s += ln(nghSp(x, y, 6 * k, -1) + nghSp(x + 29 * k, y - 7 * k, 9 * k, 1) + nghSp(x + 56 * k, y + 1 * k, 5 * k, 1) + ` M${P(x + 4 * k, y + 4 * k)} H${f1(x + 52 * k)}`, '#e0700f', 1.8);
    return `<g class="${cls}">${s}${hl(x + 24 * k, y - 13 * k, 5 * k, 2 * k, -15, .6)}</g>`;
  }
  // Mặt trời hoa văn trống đồng: sao 14 cánh, vành chấm
  function nghSun(x, y, r) {
    let st = '';
    for (let i = 0; i < 14; i++) { const a0 = (i * 360 / 14) * R, a1 = ((i + .5) * 360 / 14) * R; st += (i ? 'L' : 'M') + P(x + Math.cos(a0) * r * .78, y + Math.sin(a0) * r * .78) + 'L' + P(x + Math.cos(a1) * r * .36, y + Math.sin(a1) * r * .36); }
    return `<circle cx="${x}" cy="${y}" r="${f1(r * 1.9)}" fill="#ffd27a" opacity=".12"/><circle cx="${x}" cy="${y}" r="${f1(r * 1.4)}" fill="#ffd27a" opacity=".14"/>` + ci(x, y, r, 'url(#gSun)', 4) +
      `<g class="spin-slow" style="transform-origin:${x}px ${y}px">${pa(st + 'Z', '#fff3b0', 0)}${ln(st + 'Z', '#d98200', 1.6)}<circle cx="${x}" cy="${y}" r="${f1(r * .88)}" fill="none" stroke="#e08a00" stroke-width="2.4" stroke-dasharray="0 6" stroke-linecap="round"/></g>` + ci(x, y, r * .16, '#e08a00', 1.6);
  }
  // Mái đao cong: đỉnh nóc từ x0..x1 tại y, chân mái rộng thêm w, cao h; đầu đao xoắn
  function nghRoof(x0, x1, y, w, h, col, cold) {
    const a = x0 - w, b = x1 + w, yb = y + h;
    let s = pa(`M${P(x0, y)} L${P(x1, y)} Q${P(x1 + w * .4, y + h * .7)} ${P(b, yb - 4)} Q${P(b + 10, yb - 4)} ${P(b + 13, y + h * .25)} Q${P(b + 15, yb + 2)} ${P(b - 2, yb + 6)} L${P(a + 2, yb + 6)} Q${P(a - 15, yb + 2)} ${P(a - 13, y + h * .25)} Q${P(a - 10, yb - 4)} ${P(a, yb - 4)} Q${P(x0 - w * .4, y + h * .7)} ${P(x0, y)} Z`, cel(col, cold, .7), 3.5);
    // Hàng ngói vảy
    let t = '';
    for (let r = 1; r <= 2; r++) { const yy = y + h * r / 3, xa = x0 - w * r / 3 * .9, xb = x1 + w * r / 3 * .9, n = Math.round((xb - xa) / 11); t += `M${P(xa, yy)}`; for (let i = 0; i < n; i++) t += ` q${f1((xb - xa) / n / 2)},4 ${f1((xb - xa) / n)},0`; t += ' '; }
    s += ln(t, cold, 1.8) + ln(`M${P(a + 2, yb + 3)} L${P(b - 2, yb + 3)}`, '#ffd21f', 2.2);
    s += ln(nghSp(b + 9, y + h * .3, 7, 1) + nghSp(a - 9, y + h * .3, 7, -1), '#ffd21f', 2.2);
    return s;
  }
  // Cột đá đèn lửa
  function nghPillar(x, top, bot) {
    let s = pa(`M${x - 13},${bot} V${top + 22} H${x + 13} V${bot} Z`, cel('#a99ed6', '#5e5296', .7), 3.5) +
      ln(`M${x - 13},${top + 40} H${x + 13} M${x - 13},${top + 46} H${x + 13} M${x - 13},${bot - 22} H${x + 13}`, '#5e5296', 2) +
      ln(nghSp(x, top + 66, 8, 1) + nghSp(x, top + 96, 8, -1), '#5e5296', 2) +
      pa(`M${x - 19},${bot + 4} V${bot - 8} H${x + 19} V${bot + 4} Z`, cel('#b8aee2', '#6a5ea6'), 3.5) +
      pa(`M${x - 18},${top + 22} H${x + 18} L${x + 13},${top + 12} H${x - 13} Z`, cel('#b8aee2', '#6a5ea6'), 3.5) +
      pa(`M${x - 16},${top + 12} Q${x},${top + 22} ${x + 16},${top + 12} Q${x + 14},${top} ${x},${top} Q${x - 14},${top} ${x - 16},${top + 12} Z`, cel('#e0a24a', '#94561c'), 3.5) +
      `<g class="flame">${flame(x, top + 2, 30, 20, 2, true, 3.5)}</g>` + hl(x - 6, top + 34, 2.5, 10, 0, .3);
    return `<circle cx="${x}" cy="${top - 6}" r="30" fill="#ffb21f" opacity=".14"/>` + s;
  }
  // Lư hương đồng ba chân, nhang và khói cuộn
  function nghCenser(x, y) {
    let s = `<g class="smoke">${ln(`M${x - 4},${y - 40} q-8,-12 2,-22 q10,-10 0,-22 M${x + 4},${y - 42} q10,-10 2,-20 q-6,-8 4,-18`, '#f2e6ff', 3, 'opacity=".55"')}</g>`;
    s += ln(`M${x - 5},${y - 26} L${x - 7},${y - 44} M${x},${y - 26} V${y - 47} M${x + 5},${y - 26} L${x + 7},${y - 44}`, '#8a2a3a', 2.4) + [[x - 7, y - 44], [x, y - 47], [x + 7, y - 44]].map(([a, b]) => ci(a, b, 1.6, '#ffb21f', 0)).join('');
    s += ln(`M${x - 14},${y - 6} L${x - 18},${y + 6} M${x + 14},${y - 6} L${x + 18},${y + 6}`, OL, 7) + ln(`M${x - 14},${y - 6} L${x - 18},${y + 6} M${x + 14},${y - 6} L${x + 18},${y + 6}`, '#b8742a', 3.5);
    s += pa(`M${x - 22},${y - 24} Q${x - 24},${y} ${x},${y} Q${x + 24},${y} ${x + 22},${y - 24} Z`, cel('#e8ae52', '#94561c', .7), 3.5) + el(x, y - 24, 23, 5, cel('#f3c160', '#bb7a2c'), 3.2);
    s += ln(`M${x - 26},${y - 30} q-6,6 0,12 M${x + 26},${y - 30} q6,6 0,12`, OL, 6.5) + ln(`M${x - 26},${y - 30} q-6,6 0,12 M${x + 26},${y - 30} q6,6 0,12`, '#e8ae52', 3);
    s += ln(`M${x - 18},${y - 13} Q${x},${y - 6} ${x + 18},${y - 13}`, '#94561c', 2) + `<g fill="#f3c160" stroke="#94561c" stroke-width="1.3">${[-12, -4, 4, 12].map(d => `<circle cx="${x + d}" cy="${f1(y - 10.5 + Math.abs(d) * -.12)}" r="2.2"/>`).join('')}</g>` + hl(x - 12, y - 18, 2.5, 5, 10, .4);
    return s;
  }
  SCENES.ep_nghe = () => {
    let s = skyR('#1e0d4a', '#4a1a6e', '#b8407a', '#ff8a4a') + starsR(10, 101, 70);
    s += nghSun(292, 60, 26);
    s += nghCloud(12, 46, 1) + nghCloud(190, 30, .8, 'drift d2');
    // Đình hai tầng mái
    s += pa('M124,124 H236 V146 H124 Z', cel('#b8283a', '#7a1428'), 3.5) + ln('M136,128 V142 M148,128 V142 M160,128 V142 M200,128 V142 M212,128 V142 M224,128 V142', '#ffd21f', 2) + pa('M168,126 H192 V144 H168 Z', '#2a0a2a', 3);
    s += nghRoof(140, 220, 96, 26, 30, '#7a2e5e', '#4a1840');
    s += pa('M134,90 H226 L230,97 H130 Z', cel('#e0a24a', '#94561c'), 3) + ln(nghSp(128, 88, 6, -1) + nghSp(232, 88, 6, 1), '#ffd21f', 2.4);
    s += `<g class="flame">${flame(180, 82, 20, 14, 0, true, 3)}</g>` + ci(180, 84, 6.5, cel('#fff3a0', '#ff8a1f'), 3);
    s += pa('M84,172 H276 V230 H84 Z', '#2a0a30', 3.5) + [94, 136, 224, 266].map(x => pa(`M${x - 6},230 V170 H${x + 6} V230 Z`, cel('#d6303a', '#8a1424', .7), 3) + pa(`M${x - 8},230 V223 H${x + 8} V230 Z`, '#ffd21f', 2.4)).join('');
    s += pa('M152,176 H208 V192 H152 Z', cel('#ffd84a', '#c47a10'), 3) + pa('M158,180 H202 V188 H158 Z', '#8a1424', 0) + ln(nghSp(171, 184, 3.6, 1) + nghSp(189, 184, 3.6, -1), '#ffd21f', 1.6);
    s += nghRoof(110, 250, 140, 36, 32, '#8a3466', '#4f1a44');
    // Nền đình + sân gạch
    s += pa('M56,236 V226 H304 V236 Z', cel('#9a8fc4', '#5e5296'), 3.5);
    s += pa(`M-10,234 H370 V310 H-10 Z`, lin('#6a4a9a', '#4a3278', '#3a2464'), 3.5);
    let g = '';
    for (const y of [246, 262, 284]) g += `M-10,${y} H370 `;
    for (let i = -6; i <= 6; i++) g += `M${180 + i * 34},234 L${180 + i * 80},310 `;
    s += ln(g, '#33205a', 2) + ln('M-10,238 H370', '#8a74c4', 2, 'opacity=".5"');
    // Cột đá đèn lửa hai bên, lư hương
    s += nghPillar(28, 118, 262) + nghPillar(332, 118, 262);
    s += nghCenser(70, 282) + embers(8, 107, '#ffd21f');
    // Bục: mặt trống đồng
    let st = '';
    for (let i = 0; i < 14; i++) { const a0 = (i * 360 / 14) * R, a1 = ((i + .5) * 360 / 14) * R; st += (i ? 'L' : 'M') + P(180 + Math.cos(a0) * 46, 258 + Math.sin(a0) * 7.4) + 'L' + P(180 + Math.cos(a1) * 18, 258 + Math.sin(a1) * 2.9); }
    s += platformR(cel('#f3c160', '#bb7a2c', .8), cel('#c98a3a', '#7a4818'),
      `<g fill="none" stroke="#a8641e" stroke-linecap="round"><ellipse cx="180" cy="258" rx="86" ry="13.6" stroke-width="2"/><ellipse cx="180" cy="258" rx="72" ry="11.4" stroke-width="2.6" stroke-dasharray="0 7"/><ellipse cx="180" cy="258" rx="58" ry="9.2" stroke-width="1.8"/></g>` +
      pa(st + 'Z', '#ffe9a0', 0) + ln(st + 'Z', '#a8641e', 1.4) + ci(180, 258, 3, '#a8641e', 0) + ln('M84,266 Q180,292 276,266', '#7a4818', 2) + `<g fill="#f3c160" stroke="#7a4818" stroke-width="1.3">${[-80, -56, -30, 0, 30, 56, 80].map(d => `<circle cx="${180 + d}" cy="${f1(274 + 8 * (1 - (d / 90) ** 2))}" r="3"/>`).join('')}</g>`);
    return s;
  };
  if (typeof SCENE_NAME !== 'undefined') SCENE_NAME.ep_nghe = 'Sân đền cổ';
})();

/* ===================== CẢNH NỀN PET SỬ THI: HẠC BĂNG CỰC QUANG (ep_crane) ===================== */
// Hồ băng dưới bầu trời cực quang: màn cực quang, trăng lưỡi liềm, núi tuyết xa, đàn hạc nhỏ bay, mặt hồ phản chiếu,
// cây tùng phủ tuyết bên bờ (tích "tùng hạc"), cỏ băng, bục băng. viewBox 0 0 360 300, bục tâm (180, 258).
// Cần: gfx.js (pa, ln, bl, tube, P, f1, lin, cel, crystal, spark4) và scenes.js (SCENES, SCENE_NAME, SW, skyR, starsR, ridge, flakes, platformR, rng).
// Nạp sau scenes.js. Hàm phụ nằm trong IIFE (tiền tố crn), không thêm tên toàn cục ngoài SCENES.ep_crane và SCENE_NAME.ep_crane.
(() => {
  // Màn cực quang: mép trên/dưới lượn sóng, tia dọc mảnh
  function crnCurtain(y, amp, h, cols, op, seed, cls = 'aurora') {
    const r = rng(seed), top = [], bot = [];
    for (let x = -20; x <= SW + 20; x += 38) { const w = Math.sin(x / 50 + seed) * amp + (r() - .5) * amp * .6; top.push([x, y + w]); bot.push([x, y + w + h * (.7 + r() * .5)]); }
    let d = `M${P(...top[0])}`;
    for (let i = 1; i < top.length; i++) d += ` Q${P(top[i - 1][0] + 19, top[i - 1][1] - 8)} ${P(...top[i])}`;
    for (let i = bot.length - 1; i >= 0; i--) d += ` L${P(...bot[i])}`;
    // tia sáng dọc bắn lên từ mép dưới sáng
    let rays = '';
    for (let i = 1; i < bot.length - 1; i += 2) { const x = bot[i][0] + (r() - .5) * 14, b = bot[i][1] - 4; rays += `M${f1(x)},${f1(b)} v${f1(-h * (.5 + r() * .35))} `; }
    // lớp .aurora của app ghi đè opacity (.6 → .9) nên bọc thêm một lớp ngoài giữ độ mờ mong muốn
    return `<g opacity="${f1(op / .75)}"><g class="${cls}" opacity=".75"><path d="${d} Z" fill="${lin(...cols)}"/>` + ln(rays, '#ffffff', 3, 'opacity=".18"') + `</g></g>`;
  }
  // Hạc nhỏ bay xa (nét cong đơn giản)
  const crnBird = (x, y, k) => ln(`M${P(x - 9 * k, y - 2 * k)} Q${P(x - 4 * k, y - 6 * k)} ${P(x, y)} Q${P(x + 5 * k, y - 7 * k)} ${P(x + 11 * k, y - 4 * k)} M${P(x, y)} l${f1(6 * k)},${f1(1.5 * k)}`, '#eaf6ff', 2 * k, 'opacity=".85"');
  // Cây tùng dáng cổ: thân cong, tán phẳng từng tầng phủ tuyết
  function crnPine(x, y) {
    let s = tube(`M${x},${y} C${x + 4},${y - 40} ${x - 18},${y - 64} ${x + 6},${y - 96} M${x + 2},${y - 50} Q${x + 24},${y - 58} ${x + 40},${y - 54} M${x - 6},${y - 78} Q${x - 22},${y - 84} ${x - 34},${y - 80}`, '#6a4a7a', 7, 3.5);
    const pads = [[x + 8, y - 104, 30, 11], [x + 44, y - 58, 26, 9], [x - 36, y - 86, 22, 8], [x + 22, y - 82, 20, 8]];
    s += bl(pads.map(([px, py, rx, ry]) => `<ellipse cx="${px}" cy="${py}" rx="${rx}" ry="${ry}"/>`).join(''), cel('#2f7f8a', '#1a4a62'), 3.5);
    s += pads.map(([px, py, rx, ry]) => pa(`M${f1(px - rx * .9)},${f1(py - ry * .1)} Q${px},${f1(py - ry * 1.5)} ${f1(px + rx * .9)},${f1(py - ry * .1)} Q${px},${f1(py - ry * .5)} ${f1(px - rx * .9)},${f1(py - ry * .1)} Z`, '#ffffff', 0)).join('');
    return s;
  }
  // Cỏ băng mọc ven hồ
  // (gộp thành một hình + một nét sáng cho nhẹ)
  function crnReeds(x, y, n, k = 1) {
    let d = '', h_ = '';
    for (let i = 0; i < n; i++) {
      const c = i - (n - 1) / 2, h = (16 + (i % 3) * 8) * k, bx = x + c * 7 * k, tx = bx + c * 4 * k, w = 3 * k;
      d += `M${P(bx - w, y)} L${P(tx - w * .6, y - h * .72)} L${P(tx, y - h)} L${P(tx + w * .6, y - h * .72)} L${P(bx + w, y)} Z `;
      h_ += `M${P(bx - w * .2, y - 2)} L${P(tx - w * .15, y - h * .7)} `;
    }
    return pa(d, cel('#e6fbff', '#6fcff2'), 2.4) + ln(h_, '#ffffff', 1.4, 'opacity=".9"');
  }

  SCENES.ep_crane = () => {
    let s = skyR('#070b30', '#15206a', '#2a4f9e') + starsR(26, 113, 150);
    // màn cực quang hai lớp
    s += crnCurtain(34, 12, 56, ['#8a5cff', '#33e1ff', '#6dffc8'], .55, 3) + crnCurtain(72, 9, 40, ['#ff6ad5', '#8a5cff', '#33e1ff'], .38, 7);
    // trăng lưỡi liềm
    s += `<circle cx="306" cy="44" r="24" fill="#eafcff" opacity=".12"/>` + pa('M314,24 A20,20 0 1 0 318,62 A15,15 0 1 1 314,24 Z', cel('#ffffff', '#cfe6ff'), 3);
    // đàn hạc nhỏ bay
    s += `<g class="drift">${crnBird(250, 92, 1.1) + crnBird(272, 104, .9) + crnBird(232, 108, .8)}</g>`;
    // núi tuyết xa (hai lớp) + chỏm tuyết
    s += ridge([[20, 150], [80, 118], [140, 154], [220, 112], [290, 146], [346, 124]], 214, '#34488f', 3.5);
    s += pa('M68,126 L80,118 L94,130 L86,128 L80,136 L74,128 Z M208,120 L220,112 L234,124 L226,122 L220,130 L213,123 Z M336,130 L346,124 L356,132 L348,131 L343,137 Z', '#ffffff', 0);
    s += ridge([[-6, 176], [60, 156], [120, 182], [190, 160], [262, 184], [330, 160]], 220, cel('#9cb6ec', '#5f78c4'), 3.5);
    s += pa('M50,162 L60,156 L72,164 L64,166 L60,170 L55,165 Z M180,166 L190,160 L202,168 L194,169 L189,174 L185,168 Z M320,166 L330,160 L341,167 L334,168 L330,172 Z', '#ffffff', 0);
    // mặt hồ băng: phản chiếu cực quang + vết nứt
    s += pa('M-10,198 Q180,188 370,198 L370,250 L-10,250 Z', lin('#2a4f9e', '#5f8be0', '#9fd2f5'), 4);
    s += `<g opacity=".67"><g class="aurora" opacity=".75">` + pa('M10,206 Q120,200 220,208 Q300,214 350,206 L350,212 Q300,220 220,214 Q120,206 10,212 Z', lin('#6dffc8', '#33e1ff'), 0) +
      pa('M40,220 Q140,216 250,222 Q310,226 340,220 L340,224 Q300,230 250,226 Q140,220 40,224 Z', lin('#b48aff', '#ff8ae0'), 0) + `</g></g>`;
    s += ln('M30,232 l18,-6 l14,4 M300,230 l-16,-5 l-12,4 M150,210 l20,3', '#e6f6ff', 2, 'opacity=".8"');
    // bờ tuyết hai bên + cây tùng + cỏ băng
    s += pa('M-10,300 L-10,206 Q40,200 86,224 Q118,240 120,300 Z', cel('#f4fbff', '#b9d6f2'), 4) + pa('M370,300 L370,210 Q326,204 288,228 Q258,246 254,300 Z', cel('#f4fbff', '#b9d6f2'), 4);
    s += crnPine(30, 222) + crnReeds(92, 240, 4) + crnReeds(300, 236, 5, .9) + crnReeds(334, 248, 3, .8);
    s += flakes(22, 117);
    // bục băng: mặt ánh cực quang, viền pha lê
    s += platformR('#e8f6ff', '#8fb4e6', `<ellipse cx="180" cy="258" rx="70" ry="10" fill="none" stroke="#6dffc8" stroke-width="2.4" opacity=".7"/><ellipse cx="180" cy="258" rx="44" ry="6" fill="none" stroke="#b48aff" stroke-width="2" opacity=".6"/>` +
      crystal(96, 262, 16, 9, '#e6fbff', '#6fcff2', 2.6, -6) + crystal(264, 262, 14, 8, '#e6fbff', '#6fcff2', 2.6, 6) + spark4(236, 252, 4, '#ffffff', 1.4));
    return s;
  };
  SCENE_NAME.ep_crane = 'Hồ băng cực quang';
})();

/* ===================== CẢNH NỀN · THANH LONG SẤM (ep_loong) =====================
   Đỉnh núi đá vôi giữa biển mây giông, trời giông với sét xa, một ngôi tháp nhỏ trên đỉnh xa.
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như mọi cảnh trong scenes.js.
   Cần gfx.js (pa, ci, ln, bl, f1, cel, bolt, spark4, OL) và scenes.js (SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, platformR).
   Nạp SAU scenes.js. Hàm phụ trong khối, tiền tố lng; không thêm tên toàn cục. */
(() => {
  if (typeof SCENES === 'undefined') return;
  const lngR = Math.round;
  // Dải biển mây: hàng bướu tròn nối đáy kéo xuống hết khung, kèm nét xoắn mây lành
  function lngSea(y, r, step, col, cold, curl, seed, cls = '') {
    const rnd = rng(seed);
    let c = '', d = '';
    for (let x = -r; x <= SW + r; x += step) {
      const rr = r * (.75 + rnd() * .5), yy = y + (rnd() - .5) * r * .5;
      c += `<circle cx="${lngR(x)}" cy="${lngR(yy)}" r="${lngR(rr)}"/>`;
      if (rnd() > .45) d += `M${lngR(x - rr * .3)},${lngR(yy + rr * .2)}a${lngR(rr * .32)},${lngR(rr * .32)} 0 1 1 ${lngR(rr * .45)},-${lngR(rr * .3)}`;
    }
    c += `<rect x="-10" y="${lngR(y)}" width="${SW + 20}" height="${SH - y + 10}"/>`;
    return `<g${cls ? ` class="${cls}"` : ''}>` + bl(c, cel(col, cold, .55), 3) + ln(d, curl, 2.2, 'opacity=".85"') + `</g>`;
  }
  // Núi đá vôi trụ tròn: chân (x, base), nửa rộng w, cao h; vân đá + viền sáng bên trái + chòm thông trên đỉnh
  function lngPeak(x, base, w, h, col, cold, rim, trees = true) {
    const top = base - h;
    let s = pa(`M${x - w},${base} C${x - w * 1.05},${lngR(base - h * .55)} ${lngR(x - w * .8)},${top} ${x},${top} C${lngR(x + w * .8)},${top} ${lngR(x + w * 1.05)},${lngR(base - h * .55)} ${x + w},${base} Z`, cel(col, cold, .5), 3.5);
    s += ln(`M${lngR(x - w * .7)},${lngR(top + h * .22)} Q${lngR(x - w * .2)},${lngR(top + h * .3)} ${lngR(x + w * .3)},${lngR(top + h * .2)} M${lngR(x - w * .85)},${lngR(top + h * .5)} Q${lngR(x)},${lngR(top + h * .6)} ${lngR(x + w * .75)},${lngR(top + h * .45)}`, cold, 2.2, 'opacity=".8"');
    s += ln(`M${lngR(x - w * .62)},${lngR(top + h * .12)} Q${lngR(x - w * .4)},${top + 3} ${lngR(x - w * .05)},${top + 2}`, rim, 2.4, 'opacity=".7"');
    if (trees) s += bl(`<ellipse cx="${lngR(x - w * .3)}" cy="${top + 1}" rx="${lngR(w * .28)}" ry="${lngR(w * .18)}"/><ellipse cx="${lngR(x + w * .15)}" cy="${top - 2}" rx="${lngR(w * .32)}" ry="${lngR(w * .22)}"/>`, cel('#2f9a6e', '#1a5e48', .5), 2.5);
    return s;
  }
  // Ngôi tháp nhỏ ba tầng (bóng tối, cửa sổ vàng) trên đỉnh núi xa
  function lngPagoda(x, y, k) {
    let s = '';
    for (let i = 0; i < 3; i++) {
      const w = (14 - i * 3.5) * k, yy = y - i * 9 * k;
      s += pa(`M${f1(x - w * .55)},${f1(yy)} V${f1(yy - 6 * k)} H${f1(x + w * .55)} V${f1(yy)} Z`, '#1d2c5a', 2) +
        pa(`M${f1(x - w)},${f1(yy - 5 * k)} Q${f1(x)},${f1(yy - 10 * k)} ${f1(x + w)},${f1(yy - 5 * k)} L${f1(x + w * .6)},${f1(yy - 9 * k)} H${f1(x - w * .6)} Z`, '#2a3f78', 2) +
        `<rect x="${f1(x - 1.4 * k)}" y="${f1(yy - 4.6 * k)}" width="${f1(2.8 * k)}" height="${f1(3.4 * k)}" fill="#ffd84a"/>`;
    }
    return s + ln(`M${f1(x)},${f1(y - 27 * k)} V${f1(y - 34 * k)}`, '#1d2c5a', 2) + ci(x, y - 35 * k, 1.8 * k, '#ffd84a', 1.4);
  }
  // Tia sét xa gấp khúc có nhánh
  function lngStrike(x, y, h, col, dl = 0) {
    const r = rng(lngR(x * 7 + y));
    let d = `M${x},${y}`, px = x, py = y, br = '';
    for (let i = 1; i <= 6; i++) { px += (r() - .5) * 18; py += h / 6; d += ` L${lngR(px)},${lngR(py)}`; if (i === 3) br = `M${lngR(px)},${lngR(py)} l${lngR(10 + r() * 8)},${lngR(14 + r() * 8)} l${lngR(-4)},${lngR(10)}`; }
    return `<g class="flick" style="animation-delay:-${dl}s">${ln(d + ' ' + br, col, 7, 'opacity=".25"')}${ln(d + ' ' + br, OL, 4.5)}${ln(d + ' ' + br, col, 2.2)}</g>`;
  }
  // Mây giông trên trời: khối bướu tím than
  const lngStorm = (x, y, k, col, cold) => bl([[0, 0, 22], [-26, 8, 16], [26, 6, 18], [-48, 14, 10], [50, 14, 11], [10, -14, 16]].map(([dx, dy, r]) => `<circle cx="${lngR(x + dx * k)}" cy="${lngR(y + dy * k)}" r="${lngR(r * k)}"/>`).join('') + `<rect x="${lngR(x - 54 * k)}" y="${lngR(y + 10 * k)}" width="${lngR(108 * k)}" height="${lngR(16 * k)}" rx="${lngR(8 * k)}"/>`, cel(col, cold, .55), 3.5);

  SCENES.ep_loong = () => skyR('#0b1240', '#1d2f74', '#2f6d9e') +
    // quầng ngọc sau đỉnh núi chính
    `<circle cx="180" cy="190" r="150" fill="#5dffc0" opacity=".08"/><circle cx="180" cy="190" r="96" fill="#33e1ff" opacity=".1"/>` +
    starsR(14, 71, 70, '#c9fbff') +
    // sét xa sau mây
    lngStrike(70, 30, 110, '#fff59a') + lngStrike(296, 24, 96, '#9ff8ff', .6) + lngStrike(214, 40, 60, '#fff59a', 1.1) +
    // mây giông dày phía trên
    lngStorm(60, 30, 1.1, '#3e4590', '#232860') + lngStorm(300, 22, 1.2, '#3e4590', '#232860') + lngStorm(186, 6, .9, '#343b82', '#1e2356') +
    // núi xa nhạt, tháp nhỏ trên đỉnh phải
    lngPeak(46, 210, 30, 104, '#3a5f96', '#25406e', '#9fc4f0', false) + lngPeak(318, 206, 32, 120, '#3a5f96', '#25406e', '#9fc4f0', false) + lngPagoda(318, 87, 1) +
    lngSea(200, 22, 30, '#7f8ad6', '#525eae', '#c9d0ff', 5, 'drift') +
    // núi giữa
    lngPeak(98, 236, 26, 92, '#2b6e86', '#17445e', '#8ff0e6') + lngPeak(268, 236, 30, 104, '#2b6e86', '#17445e', '#8ff0e6') +
    lngSea(228, 20, 28, '#a3adf0', '#6f7bcc', '#e6eaff', 9, 'drift d2') +
    // đỉnh chính: bục đá ngọc viền vàng
    platformR('#4fc8bc', '#1f6f86', `<ellipse cx="180" cy="258" rx="84" ry="12" fill="none" stroke="#ffd84a" stroke-width="3"/>` + bolt(124, 250, 13, '#ffd84a', 2) + bolt(232, 252, 13, '#33e1ff', 2)) +
    // mây sát chân bục
    lngSea(282, 16, 26, '#c9d0ff', '#8e99e4', '#ffffff', 13) +
    [[30, 120, 5], [338, 150, 5.5], [130, 96, 4], [250, 112, 4.5]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#33e1ff' : '#fff6b0', 1.6, 'twinkle', i * .4)).join('');
  SCENE_NAME.ep_loong = 'Đỉnh núi biển mây giông';
})();

/* ===================== CẢNH NỀN: BẠCH TƯỢNG NGỌC (ep_elephant) ===================== */
// Đền ngọc cổ trong hang: trần hang có tinh thể ngọc treo, tia sáng rọi xuống, tháp đá cổ phủ rêu,
// cửa vòm tỏa sáng ngọc ngay sau bục, cụm tinh thể ngọc phát sáng, ao sen phía trước, bục đá chạm cánh sen viền vàng.
// Nạp sau js/scenes.js (dùng SCENES, SCENE_NAME, skyR, groundR, platformR, fireflies của scenes.js và hàm vẽ của gfx.js).
// Hàm phụ nằm trong IIFE, tiền tố elps, không thêm tên toàn cục. viewBox 0 0 360 300, bục tâm (180, 258).
(() => {
  const r0 = Math.round, Q = (x, y) => r0(x) + ',' + r0(y);
  const elpsGlow = (x, y, rx, ry, col, op) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${col}" opacity="${op}"/>`;
  const JADE = () => cel('#9dffd9', '#13916c');
  // Tinh thể ngọc: chân (x, y), cao h, rộng w, nghiêng t; dn: treo ngược từ trần
  const elpsGem = (x, y, h, w, t = 0, dn) => {
    const k = dn ? 1 : -1;
    return pa(`M${Q(x - w / 2, y)}L${Q(x - w / 2 + t * .5, y + k * h * .7)}L${Q(x + t, y + k * h)}L${Q(x + w / 2 + t * .5, y + k * h * .7)}L${Q(x + w / 2, y)}Z`, JADE(), 3) +
      ln(`M${Q(x - w * .15 + t * .2, y + k * h * .15)}L${Q(x - w * .1 + t * .6, y + k * h * .72)}`, '#e6fff6', 2, 'opacity=".85"');
  };
  const elpsCluster = (x, y, k) => elpsGlow(x, r0(y - 16 * k), r0(32 * k), r0(26 * k), '#5fffc8', .22) +
    elpsGem(x - 14 * k, y, 28 * k, 13 * k, -9 * k) + elpsGem(x + 13 * k, y, 24 * k, 12 * k, 8 * k) + elpsGem(x, y + 2, 42 * k, 17 * k);
  // Tháp đá cổ nhiều tầng: tâm x, chân y, rộng w, cao h; rêu trên các gờ
  const elpsTower = (x, y, w, h, c1, c2) => {
    const b = h * .46, f = cel(c1, c2);
    let s = pa(`M${Q(x - w / 2, y)}V${r0(y - b)}H${r0(x + w / 2)}V${r0(y)}Z`, f, 3.5) + ln(`M${Q(x - w / 2 + 6, y - b * .35)}H${r0(x + w / 2 - 6)}M${Q(x - w / 2 + 6, y - b * .7)}H${r0(x + w / 2 - 6)}`, c2, 2.5), moss = '';
    for (let i = 0; i < 3; i++) {
      const ww = w * (.92 - i * .2) / 2, y0 = y - b - i * h * .13, y1 = y0 - h * .13;
      s += pa(`M${Q(x - ww - 4, y0)}H${r0(x + ww + 4)}L${Q(x + ww, y0 - 4)}L${Q(x + ww * .86, y1)}H${r0(x - ww * .86)}L${Q(x - ww, y0 - 4)}Z`, f, 3);
      moss += `M${Q(x - ww - 4, y0)}q${r0(ww * .3)},-6 ${r0(ww * .6)},0q${r0(ww * .2)},4 ${r0(ww * .4)},1Z`;
    }
    const yt = y - b - h * .39;
    return s + `<path d="${moss}" fill="#5fc86a"/>` + pa(`M${Q(x - w * .16, yt)}Q${Q(x - w * .2, yt - h * .1)} ${Q(x, y - h)}Q${Q(x + w * .2, yt - h * .1)} ${Q(x + w * .16, yt)}Z`, f, 3);
  };
  // Hoa sen trên lá (ao phía trước)
  const elpsLotus = (x, y, k) => {
    let s = el(x, y + 4 * k, 22 * k, 6 * k, cel('#5fd06a', '#1d8a45'), 3), d = '';
    for (const [a, l] of [[-150, 14], [-120, 17], [-90, 19], [-60, 17], [-30, 14]]) {
      const r = a * Math.PI / 180, ux = Math.cos(r), uy = Math.sin(r), w = 5.5 * k, L = l * k, q = (t, n) => Q(x + ux * L * t - uy * w * n, y + uy * L * t + ux * w * n);
      d += `M${q(0, 0)}C${q(.1, -.7)} ${q(.72, -.7)} ${q(1, 0)}C${q(.72, .7)} ${q(.1, .7)} ${q(0, 0)}Z`;
    }
    return s + pa(d, lin('#ff6aa8', '#ffd0e4', '#ffffff'), 2.4) + ci(x, y - 2 * k, 3 * k, '#ffd21f', 1.8);
  };
  const elpsPad = (x, y, rx) => el(x, y, rx, rx * .3, cel('#4fc06a', '#1d7a45'), 2.5) + ln(`M${x},${y} l${r0(rx * .8)},${r0(-rx * .12)}`, '#1d7a45', 2);

  SCENES.ep_elephant = () => {
    let s = skyR('#081638', '#0f3a5a', '#1a6670');
    // tia sáng rọi từ khe trần
    s += `<path d="M150,0 L30,300 L150,300 L176,0 Z M196,0 L80,300 L180,300 L222,0 Z M230,0 L204,300 L296,300 L256,0 Z" fill="#e6fff6" opacity=".1"/>`;
    // tháp đá cổ: hai tháp phụ hai bên, tháp chính giữa có cửa vòm ngọc sáng
    s += elpsTower(52, 236, 62, 150, '#6f8f98', '#3e5866') + elpsTower(308, 236, 62, 150, '#6f8f98', '#3e5866') + elpsTower(180, 232, 150, 214, '#7d9ea6', '#47636f');
    s += elpsGlow(180, 186, 96, 84, '#7dffd0', .2) + elpsGlow(180, 196, 64, 56, '#c8fff0', .3) +
      pa('M140,234V184Q140,138 180,134Q220,138 220,184V234Z', lin('#e6fff6', '#7dffd0', '#16b97c'), 4) + ln('M140,184Q140,138 180,134Q220,138 220,184', '#ffd21f', 3.5);
    // dây leo rủ
    s += [[96, 20, 110], [122, 40, 70], [256, 30, 96], [292, 18, 120]].map(([x, y, h], i) => ln(`M${x},${y} q${i % 2 ? 6 : -6},${h * .5} 0,${h}`, '#2f9a3e', 3) + leaf(x, y + h * .45, 9, i % 2 ? 20 : 160, '#7be35a', '#2f9a3e', 2) + leaf(x, y + h, 10, 90, '#9df27a', '#2f9a3e', 2)).join('');
    // trần hang + tinh thể treo
    s += pa('M-10,-10H370V28L350,44L336,30L318,58L300,34L278,48L258,28L236,40L214,24L146,24L126,42L104,28L84,52L64,32L44,46L26,30L10,52L-10,36Z', '#0a1630', 4);
    s += [[18, 40, 26, 10], [84, 44, 30, 11], [318, 50, 28, 11], [350, 38, 18, 8], [126, 36, 16, 7], [278, 42, 18, 8]].map(([x, y, h, w]) => elpsGem(x, y, h, w, 0, 1)).join('');
    // nền đá, cụm ngọc, ao sen
    s += groundR(228, '#24505a');
    s += elpsCluster(30, 250, 1.15) + elpsCluster(332, 246, 1) + elpsGlow(98, 222, 14, 12, '#5fffc8', .25) + elpsGem(98, 232, 26, 11, -4) + elpsGlow(262, 220, 14, 12, '#5fffc8', .25) + elpsGem(262, 230, 22, 10, 4);
    s += pa('M-10,300V278Q60,266 120,280Q140,290 132,300Z M370,300V276Q300,264 240,280Q222,290 230,300Z', lin('#3fd6c0', '#1f8a9a'), 3.5);
    s += ln('M20,286q12,-3 24,0M78,290q10,-3 20,0M282,286q12,-3 24,0M326,292q10,-3 18,0', '#c8fff0', 2, 'opacity=".7"');
    s += elpsPad(98, 290, 14) + elpsPad(262, 292, 13) + elpsLotus(46, 280, 1) + elpsLotus(318, 278, .9);
    // bục đá trắng ngọc, viền vàng, chạm cánh sen
    s += platformR('#e8f7f0', '#7fae9e', ln('M84,262Q180,282 276,262', '#ffd21f', 3.5) + pa([104, 132, 160, 188, 216, 244].map(x => `M${x},${r0(281 - Math.abs(x - 174) * .1)}q6,-12 12,0`).join(''), '#c8e8dc', 2));
    s += fireflies(14, 97, '#9dffd9') + [[60, 120, 5], [300, 140, 4.5], [150, 90, 4], [214, 70, 3.5]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#e6fff6', 1.6, 'twinkle', i * .4)).join('');
    return s;
  };
  SCENE_NAME.ep_elephant = 'Đền ngọc trong hang';
})();

/* ===================== CẢNH NỀN SỬ THI · BƯỚM THẦN RỪNG: Rừng cổ thụ ánh sáng =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như mọi cảnh. Nạp sau js/scenes.js (dùng skyR, groundR, fireflies, rng, SW, SH).
   Rừng cổ thụ: thân cây xa mờ, hai cây cổ thụ rêu phủ hai bên, tán lá phía trên, tia nắng xuyên tán lá,
   dây leo có nụ phát sáng, hoa chuông phát sáng, đom đóm, cánh hoa trôi; bục là gốc cây cổ thụ có vân gỗ. */
(() => {
  const bfyRay = (x0, w0, x1, w1, y1, op) => `<path d="M${x0},-4 L${x0 + w0},-4 L${x1 + w1},${y1} L${x1},${y1} Z" fill="#fff4c4" opacity="${op}"/>`;
  // Hoa 5 cánh nhọn phát sáng (quầng mờ phía sau)
  function bfyBloomS(x, y, r, col, glow, d = 0) {
    let p = '';
    for (let i = 0; i < 5; i++) {
      const a = (i * 72 - 90) * Math.PI / 180, ux = Math.cos(a), uy = Math.sin(a), q = (k, w) => `${f1(x + ux * r * k - uy * r * w)},${f1(y + uy * r * k + ux * r * w)}`;
      p += `M${f1(x)},${f1(y)}Q${q(.55, .62)} ${q(1, 0)}Q${q(.55, -.62)} ${f1(x)},${f1(y)}`;
    }
    return `<g class="twinkle" style="animation-delay:-${d}s"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * 1.7)}" fill="${glow}" opacity=".32"/></g>` + bl(`<path d="${p}"/>`, col, 2.2) + ci(x, y, r * .3, '#fff6b0', 1.4);
  }
  // Bụi hoa phát sáng dưới gốc cây
  function bfyBush(x, y, k, flowers) {
    let s = bl([[0, 0, 20], [-18, 6, 14], [18, 6, 15], [-6, -12, 13], [10, -10, 12]].map(([dx, dy, r]) => `<circle cx="${f1(x + dx * k)}" cy="${f1(y + dy * k)}" r="${f1(r * k)}"/>`).join(''), cel('#2f9a5a', '#1a6040'), 3.5);
    s += leaf(x - 20 * k, y + 4 * k, 14 * k, 200, '#4fc070', '#1a6040', 2.4) + leaf(x + 20 * k, y + 4 * k, 14 * k, -20, '#4fc070', '#1a6040', 2.4);
    return s + flowers.map(([dx, dy, r, col, gl], i) => bfyBloomS(x + dx * k, y + dy * k, r * k, col, gl, i * .5)).join('');
  }
  // Cây cổ thụ rêu phủ ở mép cảnh: sd = -1 trái, 1 phải
  function bfyTree(sd) {
    const X = v => sd < 0 ? v : 360 - v;
    const pts = [[-20, 0], [46, 0], [42, 80], [48, 150], [60, 200], [88, 236], [60, 232], [40, 226], [30, 240], [8, 232], [-20, 240]];
    let d = 'M' + pts.map(([x, y]) => `${f1(X(x))},${y}`).join(' L') + ' Z';
    let s = pa(d, cel('#7a5638', '#3e2a1c'), 4);
    s += ln(`M${X(28)},10 Q${X(22)},90 ${X(30)},160 M${X(14)},40 Q${X(10)},110 ${X(16)},190 M${X(38)},150 Q${X(48)},190 ${X(70)},226`, '#4a3020', 3);
    // Rêu và địa y phát sáng
    s += pa(`M${X(43)},96 Q${X(52)},126 ${X(48)},150 L${X(44)},162 L${X(41)},150 L${X(37)},160 L${X(36)},138 Q${X(38)},114 ${X(43)},96 Z`, cel('#5ad06a', '#2f8a45'), 3);
    s += pa(`M${X(56)},204 Q${X(72)},214 ${X(88)},236 L${X(76)},234 L${X(72)},226 L${X(66)},232 Q${X(60)},220 ${X(56)},204 Z`, cel('#5ad06a', '#2f8a45'), 3);
    s += pa(`M${X(-20)},40 Q${X(14)},34 ${X(44)},44 L${X(42)},54 L${X(36)},50 L${X(30)},60 L${X(24)},52 L${X(14)},62 L${X(8)},52 L${X(-20)},56 Z`, cel('#5ad06a', '#2f8a45'), 3);
    s += [[18, 60], [30, 76], [10, 92], [36, 182], [20, 200]].map(([x, y], i) => `<circle class="twinkle" style="animation-delay:-${i * .4}s" cx="${X(x)}" cy="${y}" r="2.4" fill="${i % 2 ? '#7dffcf' : '#fff3a0'}"/>`).join('');
    // Hốc cây ánh vàng
    s += pa(`M${X(16)},170 Q${X(22)},146 ${X(30)},170 Q${X(24)},180 ${X(16)},170 Z`, '#ffd84a', 3) + `<ellipse cx="${X(23)}" cy="166" rx="16" ry="18" fill="#ffd84a" opacity=".18"/>`;
    return s;
  }
  // Dây leo rủ từ tán, nụ hồng phát sáng
  function bfyVine(x, len, sw, seed) {
    const r = rng(seed);
    const d = `M${x},0 Q${x + sw},${len * .5} ${x - sw * .4},${len}`;
    let s = ln(d, OL, 6) + ln(d, '#3fa860', 2.6);
    for (let i = 1; i <= 2; i++) { const t = i / 2.6, yy = len * t, xx = x + sw * 2 * t * (1 - t) * 1.2 - sw * .4 * t * t; s += leaf(xx, yy, 10 + r() * 4, i % 2 ? 30 : 150, '#5fcf5a', '#2f8a45', 2.2); }
    return s + `<g class="twinkle"><circle cx="${f1(x - sw * .4)}" cy="${len + 4}" r="8" fill="#ff8cc4" opacity=".35"/></g>` + ci(x - sw * .4, len + 4, 3.6, '#ffb3d6', 2);
  }
  // Gốc cây cổ thụ làm bục (vân gỗ, rêu, hoa nhỏ, nấm)
  function bfyStump() {
    let s = `<ellipse cx="180" cy="272" rx="110" ry="18" fill="#000" opacity=".32"/>`;
    s += pa('M80,258 Q78,285 180,287 Q282,285 280,258 Z', cel('#8a5a34', '#4e3220'), 4);
    s += ln('M98,266 Q100,276 104,283 M130,271 l2,14 M160,273 l1,13 M200,273 l-1,13 M232,271 l-2,13 M262,266 l-4,13', '#4e3220', 2.5);
    s += el(180, 258, 100, 16, cel('#f0d098', '#d0a464'), 4);
    s += [[76, 12], [52, 8.4], [28, 4.8]].map(([rx, ry]) => `<ellipse cx="182" cy="258.5" rx="${rx}" ry="${ry}" fill="none" stroke="#c0904e" stroke-width="2"/>`).join('') + ci(183, 258.5, 2.4, '#c0904e', 0);
    s += pa('M80,258 Q82,247 104,246 Q96,254 102,262 Q90,266 80,258 Z', cel('#5ad06a', '#2f8a45'), 3) + pa('M280,258 Q278,247 256,245 Q264,254 258,262 Q270,266 280,258 Z', cel('#5ad06a', '#2f8a45'), 3);
    s += flower(98, 247, 5, '#ff8cc4') + flower(262, 246, 5, '#fff3a0');
    s += mushroom(252, 282, 15, '#ff5fa2');
    return s;
  }
  SCENES.ep_butterfly = () => {
    let s = skyR('#0b2836', '#175450', '#3a9474');
    // Thân cây xa, mờ trong sương
    s += [[52, 20], [104, 14], [140, 10], [222, 12], [262, 16], [312, 22]].map(([x, w]) => pa(`M${x - w},-5 L${x + w},-5 L${x + w * 1.2},236 L${x - w * 1.2},236 Z`, '#1a4a4e', 2.5)).join('');
    s += `<rect y="150" width="360" height="90" fill="#7dffcf" opacity=".08"/>`;
    // Tia nắng xuyên tán lá (lung linh nhẹ)
    s += `<ellipse cx="178" cy="-6" rx="70" ry="40" fill="#fff4c4" opacity=".22"/><ellipse cx="178" cy="-6" rx="40" ry="22" fill="#fffbe0" opacity=".35"/>`;
    s += `<g class="aurora">${bfyRay(146, 30, 116, 96, 270, .24)}${bfyRay(206, 22, 196, 82, 270, .2)}${bfyRay(88, 16, 36, 50, 230, .12)}${bfyRay(262, 14, 286, 50, 230, .1)}</g>`;
    // Cây cổ thụ hai bên
    s += bfyTree(-1) + bfyTree(1);
    // Tán lá phía trên
    s += bl([[0, 6, 34], [40, -4, 30], [86, 10, 26], [120, -2, 22], [240, -2, 24], [276, 10, 28], [318, -4, 32], [360, 8, 34]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), '#1d7350', 3.5);
    s += bl([[16, 28, 18], [62, 22, 16], [100, 30, 14], [262, 28, 15], [300, 24, 17], [344, 30, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), '#2f9a62', 3);
    s += [[12, 22], [58, 16], [296, 18], [340, 24]].map(([x, y]) => hl(x, y, 7, 3, -20, .25)).join('');
    // Dây leo rủ
    s += bfyVine(72, 96, 8, 3) + bfyVine(116, 58, -6, 5) + bfyVine(250, 70, 7, 7) + bfyVine(292, 104, -8, 9);
    // Mặt đất rêu + cỏ
    s += groundR(232, '#2f7a50');
    s += ln('M14,262 l4,-12 l3,10 M34,272 l3,-10 l4,9 M322,266 l4,-12 l3,10 M342,276 l3,-10 l4,9 M64,284 l4,-10 l3,8 M296,286 l3,-10 l4,8', '#1d5a3a', 3);
    // Bụi hoa phát sáng
    s += bfyBush(40, 246, 1.1, [[-12, -4, 8.5, '#ff8cc4', '#ff8cc4'], [9, -14, 7.5, '#7dffcf', '#7dffcf'], [14, 6, 6.5, '#fff3a0', '#ffd84a']]);
    s += bfyBush(322, 248, 1.15, [[12, -6, 8.5, '#7dffcf', '#7dffcf'], [-9, -14, 7.5, '#ff8cc4', '#ff8cc4'], [-14, 6, 6.5, '#ffb3d6', '#ff8cc4']]);
    s += flower(18, 280, 5, '#ff5fa2') + flower(346, 284, 5, '#ffd21f') + flower(84, 290, 4, '#7dffcf');
    // Đom đóm, phấn hoa, cánh hoa trôi
    s += fireflies(9, 97, '#e8ff7a') + fireflies(5, 131, '#fff3a0');
    s += [[60, 120, 20], [150, 60, -30], [228, 110, 40], [300, 150, -10], [110, 180, 60]].map(([x, y, a], i) => `<g class="drift${i % 2 ? ' d2' : ''}">${pa(`M${x},${y} q5,-6 11,-2 q-4,7 -11,2 Z`, i % 2 ? '#ffe27a' : '#ffb3d6', 2, `transform="rotate(${a} ${x} ${y})"`)}</g>`).join('');
    return s + bfyStump();
  };
  SCENE_NAME.ep_butterfly = 'Rừng cổ thụ ánh sáng';
})();

/* ===================== CẢNH NỀN SỬ THI · CÁ VOI NGÂN HÀ: Biển sao ngân hà =====================
   Định dạng như js/scenes.js: SCENES.ep_whale() trả chuỗi SVG nền (viewBox 0 0 360 300, bục tâm 180,258), SCENE_NAME.ep_whale.
   Nạp SAU scenes.js. Hàm phụ trong IIFE, tiền tố whl; dùng lại skyR, starsR, moonR, platformR, rng, SW, SH của scenes.js và lõi gfx.js. */
(() => {
  const whlR = (x, y, a) => `transform="rotate(${a} ${x} ${y})"`;
  // Dải ngân hà chéo trời: các lớp mờ cắt gắt + bụi sao dày + vệt bụi tối
  function whlMilky() {
    const band = (w, col, op) => `<path d="M-20,${232 - w} C70,${170 - w} 160,${120 - w} 380,${30 - w} L380,${30 + w} C160,${120 + w} 70,${170 + w} -20,${232 + w} Z" fill="${col}" opacity="${op}"/>`;
    let s = band(46, '#8a6cff', .16) + band(30, '#ff9ef0', .13) + band(16, '#bff8ff', .16) + band(6, '#ffffff', .18);
    s += pa('M40,186 C90,160 130,146 170,128 C150,142 110,158 60,184 Z M210,100 C250,84 290,70 330,56 C300,72 262,86 220,104 Z', '#1a0e4a', 0, 'opacity=".45"');
    const r = rng(907); let d = ''; for (let i = 0; i < 40; i++) { const t = r(), x = -10 + t * 380, y = 228 - t * 200 + (r() - .5) * 52; d += `M${Math.round(x)},${Math.round(y)}h0`; }
    s += `<path d="${d}" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".75"/>`;
    return s;
  }
  // Hành tinh vành đai
  function whlRinged(x, y, r) {
    const ring = f => `M${x - r * 1.9},${y} A${r * 1.9},${f1(r * .5)} 0 0 ${f} ${x + r * 1.9},${y}`;
    return `<g ${whlR(x, y, -14)}>` + ln(ring(1), OL, 7) + ln(ring(1), '#ffd9a8', 3.4) + ci(x, y, r, cel('#ff9ec8', '#b0428a'), 3.5) +
      ln(`M${x - r * .9},${y - r * .3} Q${x},${y - r * .1} ${x + r * .9},${y - r * .35} M${x - r * .8},${y + r * .4} Q${x},${y + r * .55} ${x + r * .85},${y + r * .35}`, '#ffd6ea', 2.4, 'opacity=".7"') +
      ln(ring(0), OL, 7) + ln(ring(0), '#ffd9a8', 3.4) + `</g>` + hl(x - r * .4, y - r * .45, r * .3, r * .16, -25, .6);
  }
  // Cá voi nhỏ xa xa (bóng tím) có tia phun
  const whlFarWhale = (x, y, k) => `<g class="drift d2" opacity=".75"><path transform="translate(${x} ${y}) scale(${k})" d="M-22,2 C-22,-10 -8,-14 4,-10 C14,-7 20,-2 26,-8 L32,-16 L30,-6 L38,-4 L28,0 C22,6 10,10 -4,10 C-16,10 -22,8 -22,2 Z" fill="#3a2a8e" stroke="${OL}" stroke-width="${f1(3 / k)}" stroke-linejoin="round"/>` +
    ln(`M${x - 8 * k},${y - 13 * k} q-1,-6 0,-9 M${x - 8 * k},${y - 18 * k} q-4,-3 -6,-1 M${x - 8 * k},${y - 18 * k} q4,-3 6,-1`, '#bff8ff', 1.6, 'opacity=".8"') + `</g>`;
  // Biển sao: mặt nước tím than, gợn sóng sáng, bóng trăng và sao phản chiếu
  function whlSea() {
    let s = pa('M-10,206 Q90,198 180,204 Q270,210 370,202 L370,310 L-10,310 Z', lin('#2c1e86', '#1a1260', '#120c44'), 4);
    s += ln('M-10,218 Q20,213 50,218 T110,218 T170,218 M200,224 Q230,219 260,224 T320,224 T380,224 M10,240 Q40,235 70,240 T130,240 M240,246 Q270,241 300,246 T360,246', '#7fe8ff', 2.2, 'opacity=".55"');
    s += ln('M40,262 Q70,257 100,262 M260,270 Q290,265 320,270', '#ff9ef0', 2, 'opacity=".5"');
    s += ln('M52,214 h22 M46,226 h34 M54,238 h18 M48,250 h28', '#fff4d6', 2.6, 'opacity=".45"');
    const r = rng(911); for (let i = 0; i < 7; i++) s += spark4(r() * SW, 214 + r() * 76, 1.6 + r() * 2.2, i % 3 ? '#ffffff' : '#bff8ff', 0, i % 2 ? 'twinkle' : '', f1(r() * 2));
    return s;
  }
  SCENES.ep_whale = () => skyR('#08051f', '#1c0f58', '#3a1f8e') + whlMilky() + starsR(22, 913, 200) + moonR(62, 66, 30, '#f2ecff') +
    whlRinged(304, 92, 18) + ci(252, 38, 6, cel('#bff8ff', '#33a8e0'), 2.5) + ci(118, 34, 3.4, '#ffd36a', 2) + whlFarWhale(318, 170, .72) +
    `<g class="twinkle">${spark4(214, 58, 7, '#fffbe0', 2)}</g>` + `<g class="twinkle" style="animation-delay:-.8s">${spark4(26, 150, 5, '#ffd6fb', 1.8)}</g>` +
    `<path d="M330,22 L268,46 L270,50 Z" fill="#bff8ff" opacity=".6"/>` + spark4(330, 22, 5, '#ffffff', 0) +
    whlSea() + platformR('#5a48c8', '#2e2382', ln('M98,258 A82,12 0 0 0 262,258 A82,12 0 0 0 98,258', '#7fe8ff', 2, 'opacity=".7" stroke-dasharray="3 7"') +
      ln('M128,256 L150,251 L172,257 L196,250 L222,255', '#bff8ff', 1.4, 'opacity=".8"') + [[128, 256], [150, 251], [172, 257], [196, 250], [222, 255]].map(([x, y], i) => spark4(x, y, i % 2 ? 2.6 : 3.4, '#ffffff', 0)).join(''));
  SCENE_NAME.ep_whale = 'Biển sao ngân hà';
})();

/* ===================== CẢNH NỀN SỬ THI: Ngựa Sắt Thánh Gióng (ep_ironhorse) ===================== */
// Núi Sóc lúc hoàng hôn rực đỏ, mặt trời hoa văn trống đồng, khói lửa, khóm tre ngà cháy sém, bục là mặt trống đồng.
// Cần: gfx.js (pa, el, ci, ln, hl, bl, P, f1, cel, lin, flame, OL) và scenes.js (SCENES, SCENE_NAME, SW, SH, skyR, ridge, groundR, embers).
// Đặt sau scenes.js. Hàm phụ nằm trong IIFE, tiền tố ihs, không thêm tên toàn cục. viewBox 0 0 360 300, bục tâm (180, 258).
(() => {
  const R = Math.PI / 180, Pi = (x, y) => Math.round(x) + ',' + Math.round(y);
  // Vòng tròn / elip dẹt (k = tỉ lệ dọc) làm subpath
  const ihsRing = (cx, cy, r, k = 1) => `M${Pi(cx - r, cy)}a${f1(r)},${f1(r * k)} 0 1 0 ${f1(2 * r)},0a${f1(r)},${f1(r * k)} 0 1 0 ${f1(-2 * r)},0`;
  // Hoa văn mặt trống đồng (mặt trời n tia, vành, vòng tròn tiếp tuyến), nhìn nghiêng theo tỉ lệ dọc k
  function ihsDrumFace(cx, cy, r, k, col, w = 2, n = 14, lite = false) {
    let star = '', tan = '', dots = '', zig = '';
    for (let i = 0; i < n; i++) {
      const a = (i * 360 / n - 90) * R, d = 180 / n * R * .6, r0 = r * .14, r1 = r * .42;
      star += `M${Pi(cx + r0 * Math.cos(a - d), cy + r0 * k * Math.sin(a - d))}L${Pi(cx + r1 * Math.cos(a), cy + r1 * k * Math.sin(a))}L${Pi(cx + r0 * Math.cos(a + d), cy + r0 * k * Math.sin(a + d))}Z`;
    }
    for (let i = 0; i < 16; i++) {
      const a = i * 22.5 * R, b = a + 22.5 * R, rr = r * .7, cr = r * .06, x = cx + rr * Math.cos(a), y = cy + rr * k * Math.sin(a);
      tan += ihsRing(x, y, cr, k) + `M${Pi(x + cr * Math.cos(a), y + cr * k * Math.sin(a))}L${Pi(cx + (rr - cr) * Math.cos(b), cy + (rr - cr) * k * Math.sin(b))}`;
      dots += `M${Pi(x, y)}h.1`;
    }
    if (!lite) for (let i = 0; i <= 64; i++) { const a = i * 180 / 32 * R, rr = r * (i % 2 ? .97 : .89); zig += (i ? 'L' : 'M') + Pi(cx + rr * Math.cos(a), cy + rr * k * Math.sin(a)); }
    return pa(star + ihsRing(cx, cy, r * .14, k), col, 0) + ln(ihsRing(cx, cy, r * .5, k) + ihsRing(cx, cy, r * .58, k) + ihsRing(cx, cy, r * .86, k) + zig + tan, col, w) + ln(dots, col, w * 2);
  }
  // Tre ngà: gốc (x, y), cao h, nghiêng lean (độ, + sang phải), rộng w; lá ở các tỉ lệ; burn = cao ngọn lửa ở ngọn
  function ihsStalk(x, y, h, lean, w, leaves = [], burn = 0) {
    const ux = Math.sin(lean * R), uy = -Math.cos(lean * R), nx = -uy * w / 2, ny = ux * w / 2, x1 = x + ux * h, y1 = y + uy * h;
    let s = pa(`M${Pi(x - nx, y - ny)}L${Pi(x1 - nx, y1 - ny)}L${Pi(x1 + nx + ux * w * 1.5, y1 + ny + uy * w * 1.5)}L${Pi(x + nx, y + ny)}Z`, cel('#ffe27a', '#d9a02a', .55), 3);
    s += ln(`M${Pi(x + nx * .5, y + ny * .5)}L${Pi(x1 + nx * .5, y1 + ny * .5)}`, '#8fc23a', 1.6);
    let nodes = '';
    for (let t = 34; t < h - 6; t += 34) nodes += `M${Pi(x + ux * t - nx * 1.2, y + uy * t - ny * 1.2)}L${Pi(x + ux * t + nx * 1.2, y + uy * t + ny * 1.2)}`;
    s += ln(nodes, OL, 6) + ln(nodes, '#c98e1e', 2.4);
    s += leaves.map(([t, a, l]) => {
      const px = x + ux * h * t, py = y + uy * h * t;
      return pa([-30, 0, 28].map(da => { const c = Math.cos((a + da) * R), si = Math.sin((a + da) * R), ll = l * (da ? .78 : 1); return `M${Pi(px, py)}Q${Pi(px + c * ll * .45 - si * ll * .3, py + si * ll * .45 + c * ll * .3)} ${Pi(px + c * ll, py + si * ll)}Q${Pi(px + c * ll * .45 + si * ll * .14, py + si * ll * .45 - c * ll * .14)} ${Pi(px, py)}Z`; }).join(''), cel('#c8e04a', '#7fae2a'), 2.2);
    }).join('');
    if (burn) s += `<g class="flame" style="animation-delay:-${f1(x % 7 / 10)}s">` + flame(x1 + ux * 4, y1 + uy * 4, burn, burn * .6, 2, true, 3) + `</g>`;
    return s;
  }
  // Cột khói mảnh uốn lượn bốc lên từ thung lũng
  const ihsSmoke = (x, y, h, op = .55) => `<g class="drift d2" opacity="${op}">` + pa(`M${x - 8},${y} C${x - 14},${y - h * .3} ${x + 10},${y - h * .45} ${x - 2},${y - h * .7} C${x - 10},${y - h * .85} ${x + 6},${y - h} ${x + 14},${y - h} C${x + 6},${y - h * .9} ${x + 8},${y - h * .8} ${x + 12},${y - h * .68} C${x + 22},${y - h * .45} ${x + 2},${y - h * .3} ${x + 10},${y} Z`, '#8e4a7a', 2.5) + `</g>`;
  // Mái đền cong trên đỉnh núi
  const ihsShrine = (x, y) => pa(`M${x - 7},${y} V${y - 6} H${x + 7} V${y} Z M${x - 13},${y - 5} Q${x - 6},${y - 7} ${x - 4},${y - 12} H${x + 4} Q${x + 6},${y - 7} ${x + 13},${y - 5} Q${x + 15},${y - 8} ${x + 15},${y - 10} Q${x + 8},${y - 9} ${x + 5},${y - 14} H${x - 5} Q${x - 8},${y - 9} ${x - 15},${y - 10} Q${x - 15},${y - 8} ${x - 13},${y - 5} Z`, '#2e0a28', 2) + `<rect x="${x - 2}" y="${y - 5}" width="4" height="5" fill="#ffb21f"/>`;
  // Lửa cháy sát đất
  const ihsGroundFire = (x, y, n, h) => `<g class="flame">` + Array.from({ length: n }, (_, i) => flame(x + i * h * .55, y + (i % 2) * 2, h * (i % 2 ? .7 : 1), h * .6, (i % 3 - 1) * 2, !(i % 2), 3)).join('') + `</g>`;

  SCENES.ep_ironhorse = () => {
    let s = skyR('#2a0b3a', '#8e1c40', '#ff5a2a', '#ffc04a');
    // mặt trời hoa văn trống đồng trên đỉnh, xoay rất chậm
    s += `<circle cx="180" cy="84" r="86" fill="#ffd27a" opacity=".12"/><circle cx="180" cy="84" r="66" fill="#ffd27a" opacity=".18"/>`;
    s += ci(180, 84, 50, 'url(#gSun)', 4) + `<g class="spin-slow" style="transform-origin:180px 84px">${ihsDrumFace(180, 84, 46, 1, '#e8901f', 1.8)}</g>`;
    // vệt mây hoàng hôn
    s += `<g class="drift">` + ln([[54, 52, 1], [76, 40, .8], [292, 58, .9], [312, 46, .7]].map(([x, y, k]) => `M${x},${y} q${f1(5 * k)},${f1(-6 * k)} ${f1(11 * k)},0 q${f1(5 * k)},${f1(-6 * k)} ${f1(11 * k)},0`).join(''), '#3a0f30', 2.6) + `</g>`;
    // dãy núi xa, khói, núi Sóc có đền trên đỉnh
    s += ridge([[20, 172], [80, 156], [140, 178], [220, 166], [290, 150], [350, 172]], 240, '#8a2850', 3);
    s += ihsSmoke(138, 182, 70) + ihsSmoke(232, 176, 84);
    s += pa('M-10,240 L-10,150 Q24,126 54,116 L74,100 Q86,92 98,104 L120,128 Q140,148 160,176 L176,240 Z', cel('#5a1848', '#3a0f36'), 4) + ln('M-6,148 Q24,126 54,116 L74,100 Q86,92 98,104 L114,122', '#ff8a4a', 2.6, 'opacity=".9"') + ihsShrine(86, 97);
    s += pa('M370,240 L370,140 Q336,128 310,138 Q290,128 270,150 Q248,170 230,200 L214,240 Z', cel('#5a1848', '#3a0f36'), 4) + ln('M366,140 Q336,128 310,138 Q290,128 270,150 Q258,160 248,172', '#ff8a4a', 2.6, 'opacity=".9"');
    s += groundR(220, '#3a1030') + ln('M20,244 l22,6 l14,-3 M300,240 l-16,8 l-18,-2 M70,284 l20,-5 M262,282 l18,4', '#ff6a2a', 2.6, 'opacity=".85"');
    // khóm tre ngà hai bên, lửa cháy dưới gốc
    s += ihsGroundFire(6, 236, 4, 22) + ihsGroundFire(300, 238, 4, 22);
    s += ihsStalk(16, 252, 176, -5, 10, [[.6, 196, 26], [.92, -16, 24]]) + ihsStalk(42, 258, 134, 7, 9, [[.8, -20, 24]]) + ihsStalk(64, 264, 90, 15, 8, [[.82, 8, 20]]);
    s += ihsStalk(344, 254, 180, 5, 10, [[.58, -16, 26], [.92, 200, 24]]) + ihsStalk(320, 260, 130, -8, 9, [[.8, 202, 24]]) + ihsStalk(298, 266, 88, -16, 8, [[.8, 172, 20]]);
    s += embers(10, 1307, '#ffd21f');
    // bục là mặt trống đồng
    s += `<ellipse cx="180" cy="272" rx="106" ry="18" fill="#000" opacity=".3"/>` + pa('M80,258 L84,276 Q180,292 276,276 L280,258 Z', cel('#e0913f', '#9c521c'), 4) +
      ln('M86,268 Q180,282 274,268', '#ffd27a', 2, 'opacity=".7"') + ln('M110,264 v14 M145,267 v16 M180,268 v16 M215,267 v16 M250,264 v14', '#7a3c12', 2.2) +
      el(180, 258, 100, 16, cel('#ffd86a', '#e0a030'), 4) + ihsDrumFace(180, 258, 92, .16, '#b8641e', 1.6, 12, true) + hl(140, 252, 24, 3, 0, .35);
    return s;
  };
  SCENE_NAME.ep_ironhorse = 'Núi Sóc hoàng hôn';
})();
/* ---------- HẾT SỬ THI ---------- */

/* ----- Cảnh tạm cho pet Sử thi chưa có cảnh riêng: điện Sử thi dưới bầu trời sao ----- */
(function () {
  const SKY = { fire: ['#2a0a2e', '#8a1f3a', '#ff8a3d'], ice: ['#0b1a4a', '#2a6ad6', '#bff4ff'], thunder: ['#1a1450', '#4a3fae', '#ffd84a'], stone: ['#2a1a10', '#7a5232', '#e0b07a'],
    forest: ['#0a2a1a', '#1f7a45', '#9df27a'], shadow: ['#0a0520', '#2a1260', '#8a5cff'], metal: ['#10142a', '#3d4c70', '#c9d4e6'] };
  const epicScene = elm => () => {
    const cols = ['#ff4d4d', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'];
    return skyR(...SKY[elm]) + starsR(30, 7 + elm.length, 170) +
      `<g opacity=".85"><path d="M30,240 A150,150 0 0 1 330,240" fill="none" stroke="${OL}" stroke-width="40"/>` + cols.map((c, i) => `<path d="M${32 + i * 6},240 A${148 - i * 6},${148 - i * 6} 0 0 1 ${328 - i * 6},240" fill="none" stroke="${c}" stroke-width="6.5"/>`).join('') + `</g>` +
      [70, 290].map(x => pa(`M${x - 13},262 V150 H${x + 13} V262 Z`, cel('#fff6e0', '#e0a050'), 4) + pa(`M${x - 19},150 H${x + 19} V138 H${x - 19} Z`, 'url(#gGold)', 3.5) + `<g class="twinkle">${spark4(x, 124, 8, '#fff6b0', 2)}</g>`).join('') +
      groundR(232, SKY[elm][1]) + platformR('url(#gGold)', '#d48700', pa(starPath(180, 258, 12, 5), '#fff6b0', 2.5));
  };
  ECON.epics.forEach(([id, el]) => { if (!SCENES[id]) SCENES[id] = epicScene(el); if (!SCENE_NAME[id]) SCENE_NAME[id] = 'Điện Sử thi'; });
})();

/* ---------- CẢNH PET MỚI BẢN 5 ---------- */
// Cảnh nền của 14 pet thường mới (bản 5) ghép ngay dưới dòng này.

// ----- Hệ Lửa -----
/* ===================== CẢNH NỀN · HỆ LỬA PET THƯỜNG MỚI (bản 5): Gà Chọi Lửa (n_rooster), Nhím Lửa (n_hedgehog) =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như js/scenes.js. Nạp SAU scenes.js (dùng SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, embers, platformR).
   Cần gfx.js (pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, flame, leaf, OL).
   Hàm phụ trong IIFE, tiền tố nls, không thêm tên toàn cục ngoài SCENES.n_rooster / n_hedgehog và SCENE_NAME.n_rooster / n_hedgehog. */
(() => {
  if (typeof SCENES === 'undefined') return;

  /* ---------- Gà Chọi Lửa: sới gà làng quê lúc hoàng hôn ---------- */
  // Mặt trời lặn sát chân trời: đĩa lớn có vạch ngang, quầng sáng nhiều lớp mờ
  function nlsSun(x, y, r) {
    let s = [2.1, 1.65, 1.3].map((k, i) => `<circle cx="${x}" cy="${y}" r="${f1(r * k)}" fill="#ffd27a" opacity="${[.1, .14, .2][i]}"/>`).join('');
    s += ci(x, y, r, 'url(#gSun)', 4);
    s += [.35, .55, .72].map((k, i) => `<rect x="${f1(x - r)}" y="${f1(y + r * k)}" width="${f1(r * 2)}" height="${f1(2.4 + i * 1.4)}" fill="#ff9a3d" opacity=".7"/>`).join('');
    return s;
  }
  // Mái nhà làng xa (mái cong) làm bóng chân trời
  const nlsRoof = (x, y, w, h, col) => pa(`M${x - w / 2 - 6},${y} Q${x - w / 2},${y - 2} ${x - w / 2 + 4},${y - h * .55} L${x - w * .18},${y - h} H${x + w * .18} L${x + w / 2 - 4},${y - h * .55} Q${x + w / 2},${y - 2} ${x + w / 2 + 6},${y} Z`, col, 3) + pa(`M${x - w / 2 + 6},${y} V${y + h * .7} H${x + w / 2 - 6} V${y} Z`, col, 3);
  // Bụi tre ngược sáng: các thân cong + chùm lá
  function nlsBamboo(x, y, h, n, sd, col, seed) {
    const r = rng(seed); let s = '', lv = '';
    for (let i = 0; i < n; i++) {
      const bx = x + (i - (n - 1) / 2) * 8, tx = bx + sd * (14 + r() * 30), ty = y - h * (.72 + r() * .3);
      s += tube(`M${bx},${y} Q${f1(bx + sd * 2)},${f1((y + ty) / 2)} ${f1(tx)},${f1(ty)}`, col, 6, 2.5);
      for (let k = 1; k < 4; k++) { const t = k / 4, px = bx + (tx - bx) * t * t, py = y + (ty - y) * t; s += ln(`M${f1(px - 3)},${f1(py)} h6`, OL, 1.6, 'opacity=".5"'); }
      for (let k = 0; k < 4; k++) { const a = sd > 0 ? -20 - r() * 70 : -110 - r() * 70; lv += leaf(tx + (r() - .5) * 10, ty + k * 8, 14 + r() * 8, sd > 0 ? a + 90 * r() : a - 90 * r(), col, OL, 2); }
    }
    return s + lv;
  }
  // Cây đa: thân, rễ phụ, tán tròn
  function nlsBanyan(x, y, col, cold) {
    return pa(`M${x - 18},${y} Q${x - 10},${y - 40} ${x - 14},${y - 90} L${x + 10},${y - 90} Q${x + 8},${y - 40} ${x + 20},${y} Z`, cel(col, cold), 3.5) +
      ln(`M${x - 40},${y - 92} Q${x - 44},${y - 50} ${x - 40},${y - 6} M${x + 34},${y - 96} Q${x + 40},${y - 56} ${x + 36},${y - 10} M${x - 26},${y - 94} Q${x - 30},${y - 60} ${x - 28},${y - 30}`, cold, 3) +
      bl(`<circle cx="${x - 30}" cy="${y - 116}" r="36"/><circle cx="${x + 18}" cy="${y - 128}" r="40"/><circle cx="${x + 54}" cy="${y - 104}" r="26"/><circle cx="${x - 60}" cy="${y - 100}" r="24"/><circle cx="${x - 6}" cy="${y - 158}" r="30"/><rect x="${x - 76}" y="${y - 110}" width="150" height="20" rx="10"/>`, cel(col, cold, .7), 3.5) +
      ln(`M${x - 46},${y - 128} q8,-6 16,0 M${x + 4},${y - 148} q8,-6 16,0 M${x + 30},${y - 116} q7,-5 14,0`, cold, 2.4);
  }
  // Dây cờ đuôi nheo hội làng
  function nlsFlags(x0, y0, x1, y1, sag, n) {
    const cols = ['#ff3b4f', '#ffd21f', '#3fe06a', '#33b5ff', '#ff8a1f'];
    let s = ln(`M${x0},${y0} Q${(x0 + x1) / 2},${(y0 + y1) / 2 + sag * 2} ${x1},${y1}`, OL, 2);
    for (let i = 1; i < n; i++) {
      const t = i / n, x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (x0 + x1) / 2 + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag * 2) + t * t * y1;
      s += `<g class="swing" style="transform-origin:${f1(x)}px ${f1(y)}px;animation-delay:-${f1(i * .3)}s">${pa(`M${P(x - 6, y)} L${P(x + 6, y)} L${P(x, y + 15)} Z`, cols[i % cols.length], 2.2)}</g>`;
    }
    return s;
  }
  // Đống rơm: chóp nón, cọc giữa, sợi rơm
  const nlsHay = (x, y, w, h) => ln(`M${x},${y - h - 14} V${y - h + 6}`, '#6e3c18', 4) +
    pa(`M${x - w / 2},${y} Q${x - w * .52},${y - h * .55} ${x - w * .2},${y - h * .9} Q${x},${y - h * 1.05} ${x + w * .2},${y - h * .9} Q${x + w * .52},${y - h * .55} ${x + w / 2},${y} Q${x},${y + 6} ${x - w / 2},${y} Z`, cel('#ffcf5a', '#d99a2a', .7), 3.5) +
    ln(`M${x - w * .32},${y - h * .25} q8,-4 16,0 M${x + w * .02},${y - h * .5} q8,-4 16,0 M${x - w * .2},${y - h * .72} q7,-3 14,0 M${x + w * .14},${y - h * .16} q8,-4 16,0`, '#c9862a', 2) + pa(`M${x - 6},${y - h * .98} Q${x},${y - h * 1.1} ${x + 6},${y - h * .98} L${x + 4},${y - h * .9} H${x - 4} Z`, '#c9862a', 2.4);
  // Hàng rào tre quây sới (vòng cung sau bục)
  function nlsFence(y, col, cold) {
    let posts = '', d = '';
    for (let x = -6; x <= 366; x += 20) { const yy = y + Math.pow((x - 180) / 180, 2) * 14; posts += `<rect x="${x - 4}" y="${f1(yy - 24)}" width="8" height="30" rx="3"/>`; }
    for (const k of [0, 13]) { d += `M-10,${f1(y - 16 + k + 14 * 1.06)} Q180,${f1(y - 16 + k - 12)} 370,${f1(y - 16 + k + 14 * 1.06)} `; }
    return bl(posts, cel(col, cold), 3) + tube(d, cold, 4, 2.5);
  }

  SCENES.n_rooster = () => {
    let s = skyR('#2e1660', '#9a2f78', '#ff7a3d', '#ffc86a');
    s += starsR(8, 211, 60);
    s += nlsSun(258, 176, 44);
    // Đồng lúa xa + mái làng ngược sáng
    s += pa('M-10,196 Q90,180 180,190 Q270,178 370,192 L370,230 L-10,230 Z', '#6e2a6e', 3.5);
    s += [[150, 192, 46, 18], [206, 190, 34, 14], [112, 194, 28, 11]].map(([x, y, w, h]) => nlsRoof(x, y, w, h, '#4e1f5e')).join('');
    s += pa('M-10,206 Q120,194 200,204 Q290,212 370,200 L370,240 L-10,240 Z', '#58205e', 3.5);
    // Dây cờ hội
    s += nlsFlags(-6, 30, 366, 26, 14, 16);
    // Cây đa bên trái, bụi tre bên phải
    s += nlsBanyan(34, 226, '#4a1f62', '#2e1244');
    s += nlsBamboo(334, 230, 170, 5, -1, '#3e1a58', 7) + nlsBamboo(300, 232, 120, 3, -1, '#4a2266', 11);
    // Sân đất + rào tre quây sới
    s += pa('M-10,224 Q180,210 370,224 L370,310 L-10,310 Z', lin('#c96a34', '#a8502a', '#7a3424'), 4);
    s += nlsFence(232, '#e8b06a', '#a86a2e');
    s += nlsHay(328, 262, 52, 46) + nlsHay(26, 270, 40, 34);
    s += ln('M60,284 l10,-3 M96,292 l12,-2 M268,288 l10,3 M300,294 l12,-3', '#ffcf5a', 2.4);
    s += embers(8, 223, '#ffd21f');
    // Bục: mặt sới đất nện, viền tre đan
    let weave = '';
    for (let x = 88; x <= 272; x += 12) weave += `M${x},${f1(260 + Math.sqrt(Math.max(0, 1 - Math.pow((x - 180) / 100, 2))) * 14)} l6,8 `;
    s += platformR(cel('#f0b878', '#c9803e', .78), cel('#d9984a', '#8a5222'),
      `<ellipse cx="180" cy="258" rx="80" ry="12" fill="none" stroke="#c9803e" stroke-width="2" stroke-dasharray="1 7" stroke-linecap="round"/>` + ln(weave, '#8a5222', 2) +
      ln('M128,252 l9,3 M222,262 l10,-2 M166,266 l8,2', '#ffcf5a', 2.2) + pa('M232,252 Q244,246 252,250 Q244,252 236,256 Z', '#ff3b4f', 1.6));
    return s;
  };
  SCENE_NAME.n_rooster = 'Sới gà làng hoàng hôn';

  /* ---------- Nhím Lửa: hang núi lửa ấm, than hồng ---------- */
  // Đống than hồng: viên than tối có vân nứt cam + vài viên cháy rực, quầng ấm
  function nlsCoals(x, y, n, k, seed) {
    const r = rng(seed); let s = '';
    const g = [1.7, 1.2].map((m, i) => `<ellipse cx="${x}" cy="${f1(y - 4 * k)}" rx="${f1(30 * k * m)}" ry="${f1(13 * k * m)}" fill="#ff8a1f" opacity="${[.13, .22][i]}"/>`).join('');
    for (let i = 0; i < n; i++) {
      const hot = i % 3 === 0, cx = x + (r() - .5) * 36 * k, cy = y - r() * 7 * k - (i > n / 2 ? 7 * k : 0), rr = (5 + r() * 4) * k;
      s += pa(`M${P(cx - rr, cy + rr * .3)} Q${P(cx - rr * .9, cy - rr * .8)} ${P(cx, cy - rr)} Q${P(cx + rr * 1.05, cy - rr * .7)} ${P(cx + rr, cy + rr * .2)} Q${P(cx + rr * .6, cy + rr)} ${P(cx, cy + rr * .9)} Q${P(cx - rr * .7, cy + rr)} ${P(cx - rr, cy + rr * .3)} Z`, hot ? cel('#ffb21f', '#e0451a') : cel('#4e2638', '#2a1222'), 2.6);
      s += hot ? hl(cx - rr * .3, cy - rr * .45, rr * .32, rr * .16, -25, .75) : ln(`M${P(cx - rr * .6, cy - rr * .2)} L${P(cx - rr * .1, cy + rr * .1)} L${P(cx + rr * .1, cy - rr * .5)} M${P(cx - rr * .1, cy + rr * .1)} L${P(cx + rr * .2, cy + rr * .55)}`, '#ff8a1f', 1.6);
    }
    return g + `<g class="flick" style="animation-duration:2.6s">${s}</g>`;
  }
  // Nhũ đá rủ từ trần
  const nlsDrip = (x, y, w, h, col, cold) => pa(`M${x - w / 2},${y} Q${x - w * .3},${y + h * .55} ${x},${y + h} Q${x + w * .3},${y + h * .55} ${x + w / 2},${y} Z`, cel(col, cold), 3.5);
  // Khe dung nham phát sáng (quầng mờ + lõi)
  const nlsCrack = d => ln(d, '#ff8a1f', 9, 'opacity=".22"') + ln(d, OL, 4.6) + ln(d, '#ffb21f', 2.2);
  // Ổ lá khô
  function nlsLeaves(x, y, w, n, seed) {
    const r = rng(seed), cols = [['#ff8a2b', '#c2560a'], ['#ffc23a', '#d48700'], ['#e8402a', '#9a1f14'], ['#c96a2e', '#7a3a14']];
    let s = '';
    for (let i = 0; i < n; i++) { const c = cols[i % 4]; s += leaf(x + (r() - .5) * w, y - r() * 14, 14 + r() * 7, -170 + r() * 160, c[0], c[1], 2.4); }
    return s;
  }

  SCENES.n_hedgehog = () => {
    // Vách hang: tím mận trên, đỏ ấm dần xuống dưới (ánh than)
    let s = skyR('#2a1236', '#58203e', '#a8402a');
    s += ln('M-10,88 Q90,76 180,90 Q270,104 370,84 M-10,132 Q100,118 200,134 Q290,146 370,128 M-10,176 Q90,162 190,176 Q280,188 370,170', '#7a2e48', 3, 'opacity=".55"');
    // Trần nhũ đá
    s += pa('M-10,-10 H370 V30 Q348,48 330,34 Q312,52 290,36 Q266,54 246,36 Q222,52 200,34 Q178,50 154,34 Q130,48 112,32 Q90,50 70,30 Q46,46 26,30 Q10,44 -10,34 Z', cel('#5e2c4c', '#3a1830', .7), 4);
    // Ô cửa hang bên trái: trời đêm + núi lửa xa phun lửa
    s += ci(58, 78, 44, lin('#140a40', '#3a1f78', '#9a3a6e'), 0) + starsR(8, 353, 60).replace(/cx="([\d.]+)" cy="([\d.]+)"/g, (m, a, b) => `cx="${f1(26 + +a / 360 * 64)}" cy="${f1(44 + +b / 60 * 34)}"`);
    s += pa('M22,118 L50,80 L60,86 L70,78 L100,118 Z', '#2a1240', 3) + pa('M50,80 L60,86 L70,78 L66,72 L54,74 Z', 'url(#gLava)', 2.4) + `<g class="flame">${flame(60, 76, 18, 13, 2, true, 2.6)}</g>` + ln('M56,86 L50,104 M64,86 L72,102', '#ff8a1f', 2.2);
    s += `<circle cx="58" cy="78" r="44" fill="none" stroke="${OL}" stroke-width="13"/><circle cx="58" cy="78" r="44" fill="none" stroke="#6e3458" stroke-width="7"/>`;
    s += [[118, 32, 12, 22], [160, 36, 14, 30], [206, 36, 12, 20], [252, 38, 16, 34], [298, 36, 12, 24], [336, 36, 10, 18]].map(([x, y, w, h]) => nlsDrip(x, y, w, h, '#6e3458', '#3a1830')).join('');
    s += [[160, 64], [252, 70]].map(([x, y]) => `<g class="twinkle">${ci(x, y, 2.6, '#ffb21f', 0)}</g>`).join('');
    // Thác dung nham chảy từ khe vách phải xuống hồ
    s += pa('M300,40 Q314,60 312,100 Q310,150 322,206 L344,206 Q332,150 334,100 Q336,60 324,40 Z', 'url(#gLava)', 4);
    s += `<g class="flow">${ln('M318,50 Q324,110 330,200', '#fff59a', 2.4, 'stroke-dasharray="6 18" opacity=".85"')}${ln('M312,70 Q316,130 326,200', '#ffd21f', 1.8, 'stroke-dasharray="4 20" opacity=".7"')}</g>`;
    s += pa('M276,212 Q330,196 372,206 L372,232 Q326,240 286,228 Z', 'url(#gLava)', 4) + ln('M292,216 q12,-4 24,0 M330,214 q10,-3 20,0', '#fff59a', 2, 'opacity=".8"');
    s += `<ellipse cx="324" cy="214" rx="56" ry="26" fill="#ff8a1f" opacity=".16"/>`;
    // Vách đá hai bên
    s += pa('M-10,128 Q22,136 30,170 Q34,206 18,236 L-10,240 Z', cel('#5e2c4c', '#2e1226', .7), 4);
    s += nlsCrack('M8,150 L18,166 L12,184 L22,200') + nlsCrack('M140,40 L148,52 L144,62') + nlsCrack('M226,40 L220,50');
    // Nền hang ấm
    s += pa('M-10,228 Q180,212 370,230 L370,310 L-10,310 Z', lin('#5a2638', '#3e1a2c', '#26101c'), 4);
    s += `<ellipse cx="180" cy="262" rx="150" ry="34" fill="#ff8a1f" opacity=".12"/>`;
    s += nlsCrack('M14,272 Q50,262 86,274') + nlsCrack('M276,278 Q312,268 352,278');
    // Tinh thể lửa, than hồng, ổ lá khô
    s += crystal(28, 226, 30, 14, '#ffcf4a', '#e08a00', 3, -6) + crystal(44, 230, 22, 12, '#ff9a3d', '#d4561a', 3, 6);
    s += nlsLeaves(58, 262, 56, 10, 331) + nlsCoals(52, 254, 7, 1, 313) + nlsLeaves(312, 266, 50, 8, 337) + nlsCoals(318, 256, 8, 1.05, 317);
    s += embers(12, 341, '#ffb21f');
    // Bục: phiến đá bazan có khe dung nham, viền than
    s += platformR(cel('#6e3c5c', '#40203a', .75), cel('#4e2644', '#26101e'),
      nlsCrack('M118,256 L134,262 L146,258 L158,264') + nlsCrack('M204,262 L220,256 L238,262') +
      [[94, 266], [266, 266], [180, 279]].map(([x, y]) => ci(x, y, 4.6, cel('#ffb21f', '#e0451a'), 2.2)).join(''));
    return s;
  };
  SCENE_NAME.n_hedgehog = 'Hang than hồng';
})();

// ----- Hệ Băng -----
/* ===================== CẢNH NỀN · HỆ BĂNG (bản 5): HẢI CẨU BĂNG (n_seal), THỎ TUYẾT (n_hare) =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như js/scenes.js.
   Cần: gfx.js (pa, el, ci, ln, hl, bl, P, f1, cel, lin, crystal, spark4) và scenes.js (SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, flakes, pine, platformR).
   Nạp SAU scenes.js. Hàm phụ nằm trong IIFE (tiền tố nbs), không thêm tên toàn cục ngoài SCENES.n_seal, SCENES.n_hare, SCENE_NAME.n_seal, SCENE_NAME.n_hare. */
(() => {
  // Núi băng trôi: chân (x0..x1) ở mặt nước y, các đỉnh pk = [[x, y]...]; mặt khuất tô đậm, phần chìm mờ dưới nước
  function nbsBerg(x0, x1, y, pk, light = '#ffffff', shade = '#bfe6f5', face = '#8fc8ee') {
    const top = [[x0, y]].concat(pk, [[x1, y]]), mid = Math.floor(top.length / 2);
    let s = pa(`M${P(x0 + 6, y)} L${P((x0 + x1) / 2, y + (x1 - x0) * .22)} L${P(x1 - 6, y)} Z`, '#7fb8ec', 0, 'opacity=".35"');
    s += pa('M' + top.map(p => P(...p)).join(' L') + ' Z', cel(light, shade), 3.5);
    s += pa('M' + top.slice(mid).map(p => P(...p)).join(' L') + ` L${P(top[mid][0], y)} Z`, face, 0, 'opacity=".55"');
    s += ln(`M${P(x0 + 3, y - 3)} L${P(x1 - 3, y - 3)}`, '#ffffff', 2.4, 'opacity=".8"');
    return s;
  }
  // Mảnh băng nhỏ trôi
  const nbsFloe = (x, y, w) => pa(`M${P(x - w, y)} L${P(x - w * .7, y - w * .28)} L${P(x + w * .8, y - w * .26)} L${P(x + w, y)} L${P(x + w * .7, y + w * .14)} L${P(x - w * .8, y + w * .14)} Z`, cel('#ffffff', '#bfe6f5'), 3) +
    ln(`M${P(x - w * 1.3, y + w * .3)} h${f1(w * .5)} M${P(x + w * .9, y + w * .32)} h${f1(w * .5)}`, '#bff4ff', 2, 'opacity=".7"');
  // Chim biển xa
  const nbsGull = (x, y, k) => ln(`M${P(x - 8 * k, y - 2 * k)} Q${P(x - 4 * k, y - 6 * k)} ${P(x, y)} Q${P(x + 4 * k, y - 6 * k)} ${P(x + 8 * k, y - 2 * k)}`, '#3a2f7e', 2.2 * k);

  SCENES.n_seal = () => {
    let s = skyR('#2a2378', '#8a5cc8', '#ff9ab8', '#ffd6a0', '#ffd6a0') + starsR(10, 211, 60);
    // mặt trời lặn sát chân trời
    s += `<circle cx="226" cy="146" r="54" fill="#fff0c8" opacity=".25"/>` + ci(226, 146, 28, lin('#fff6c8', '#ffb27a'), 3.5);
    s += `<g class="drift">${nbsGull(96, 62, 1.2) + nbsGull(118, 74, .9) + nbsGull(80, 80, .8)}</g>`;
    // dãy núi băng xa
    s += pa('M-10,150 L18,120 L36,128 L58,104 L80,132 L96,150 Z M286,150 L306,126 L322,134 L344,108 L370,128 L370,150 Z', '#9a86dc', 3);
    // biển
    s += pa('M-10,148 H370 V310 H-10 Z', lin('#5a7ae0', '#2f4fb0', '#1d2f7e'), 3.5);
    s += ln('M206,160 h40 M212,170 h28 M200,182 h52 M218,194 h18 M226,206 h10', '#ffd6a0', 3, 'opacity=".75"');
    s += ln('M20,176 h26 M70,166 h20 M150,172 h30 M300,180 h28 M120,196 h22', '#9fb8ff', 2.4, 'opacity=".6"');
    // núi băng trôi lớn hai bên
    s += nbsBerg(4, 108, 172, [[22, 104], [40, 88], [56, 96], [70, 80], [88, 112], [100, 120]]);
    s += nbsBerg(262, 356, 176, [[272, 124], [292, 100], [306, 108], [322, 92], [340, 118], [350, 132]]);
    // mảnh băng nhỏ trôi
    s += nbsFloe(156, 186, 14) + nbsFloe(214, 204, 10) + nbsFloe(318, 206, 12) + nbsFloe(52, 200, 11);
    // thềm băng phía trước, mép có nhũ băng
    s += pa('M-10,232 Q50,214 120,226 Q190,238 250,224 Q312,212 370,226 L370,310 L-10,310 Z', cel('#f4fdff', '#b4dcf2'), 4);
    s += pa('M14,226 l4,10 l4,-11 Z M60,222 l3,8 l4,-9 Z M300,220 l3,9 l4,-10 Z M338,224 l3,8 l3,-9 Z', '#dff6ff', 2);
    s += ln('M30,250 l16,6 l10,-3 M300,248 l-14,7 l-12,-2 M70,280 l18,-4', '#9fd0ee', 2.6);
    s += `<g class="twinkle">${spark4(232, 168, 5, '#fff6c8', 1.6)}</g><g class="twinkle" style="animation-delay:.8s">${spark4(150, 160, 4, '#ffffff', 1.4)}</g>`;
    // bục: tảng băng dày, có vết nứt và sóng vỗ
    s += platformR('#eafaff', '#7fc0ea', ln('M118,258 l14,4 l10,-4 M226,262 l14,-5', '#9fd0ee', 2.5) + crystal(102, 262, 14, 8, '#e6fbff', '#6fc8f0', 2.6, -5) +
      ln('M84,270 q8,-5 16,0 q8,5 16,0 M244,272 q8,-5 16,0 q8,5 16,0', '#ffffff', 2.4, 'opacity=".85"'));
    return s;
  };
  SCENE_NAME.n_seal = 'Vịnh băng hoàng hôn';

  // Thỏ ngọc mờ trên mặt trăng
  const nbsMoonHare = (x, y, k) => `<g fill="#cfc4f0" opacity=".75">` +
    `<ellipse cx="${f1(x)}" cy="${f1(y + 10 * k)}" rx="${f1(12 * k)}" ry="${f1(9 * k)}"/><circle cx="${f1(x - 10 * k)}" cy="${f1(y)}" r="${f1(6.5 * k)}"/>` +
    `<ellipse cx="${f1(x - 12 * k)}" cy="${f1(y - 11 * k)}" rx="${f1(2.6 * k)}" ry="${f1(8 * k)}" transform="rotate(-14 ${f1(x - 12 * k)} ${f1(y - 11 * k)})"/><ellipse cx="${f1(x - 7 * k)}" cy="${f1(y - 11 * k)}" rx="${f1(2.6 * k)}" ry="${f1(8 * k)}" transform="rotate(10 ${f1(x - 7 * k)} ${f1(y - 11 * k)})"/>` +
    `<circle cx="${f1(x + 12 * k)}" cy="${f1(y + 8 * k)}" r="${f1(3.4 * k)}"/></g>`;
  // Cây bạch dương phủ tuyết
  function nbsBirch(x, y, h) {
    let s = ln(`M${x},${y} L${x + 2},${y - h}`, '#3a2f7e', 9) + ln(`M${x},${y} L${x + 2},${y - h}`, '#f2f2ff', 5.5);
    s += ln(`M${x - 1},${f1(y - h * .3)} h3 M${x},${f1(y - h * .55)} h3 M${x + 1},${f1(y - h * .78)} h3`, '#3a2f7e', 2);
    s += ln(`M${x + 1},${f1(y - h * .62)} l-14,-14 M${x + 2},${f1(y - h * .8)} l12,-12`, '#3a2f7e', 3);
    s += bl(`<circle cx="${x - 12}" cy="${f1(y - h * .62 - 14)}" r="9"/><circle cx="${x + 14}" cy="${f1(y - h * .8 - 12)}" r="8"/><circle cx="${x + 2}" cy="${y - h - 4}" r="10"/>`, cel('#ffffff', '#c9cff5'), 3);
    return s;
  }
  // Vết chân thỏ trên tuyết (cặp chấm dài + cặp chấm tròn)
  const nbsTrack = (x, y, k) => el(x, y, 2.4 * k, 4.4 * k, '#a8aee8', 0, `transform="rotate(-70 ${f1(x)} ${f1(y)})"`) + el(x + 3 * k, y + 5 * k, 2.4 * k, 4.4 * k, '#a8aee8', 0, `transform="rotate(-70 ${f1(x + 3 * k)} ${f1(y + 5 * k)})"`) +
    ci(x - 9 * k, y + 1 * k, 1.8 * k, '#a8aee8', 0) + ci(x - 7 * k, y + 5 * k, 1.8 * k, '#a8aee8', 0);

  SCENES.n_hare = () => {
    let s = skyR('#100b42', '#2a2282', '#5b4cbc', '#8d7ee0') + starsR(30, 223, 150);
    // trăng rằm lớn có quầng, thấp trên đồi
    s += `<circle cx="236" cy="96" r="86" fill="#e8e0ff" opacity=".08"/><circle cx="236" cy="96" r="66" fill="#e8e0ff" opacity=".12"/>`;
    s += ci(236, 96, 48, cel('#fffbea', '#e6dcff', .7), 3.5) + nbsMoonHare(238, 98, 1.5) + ci(210, 76, 5, '#ede4ff', 0, 'opacity=".8"') + ci(262, 120, 4, '#ede4ff', 0, 'opacity=".8"');
    s += `<circle cx="236" cy="96" r="56" fill="none" stroke="#fffbea" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round" opacity=".45"/>`;
    // đồi xa tím
    s += pa('M-10,176 Q40,136 96,156 Q150,176 200,150 Q260,124 316,152 Q346,166 370,156 L370,310 L-10,310 Z', '#4a42a6', 3.5);
    // đồi tuyết giữa + cây
    s += pa('M-10,196 Q60,160 140,184 Q210,204 280,176 Q330,160 370,170 L370,310 L-10,310 Z', cel('#e6e9ff', '#a8b0ec'), 4);
    s += nbsBirch(42, 196, 64) + nbsBirch(68, 192, 48) + pine(316, 186, 66, '#2f3a8e', true) + pine(342, 196, 48, '#2f3a8e', true);
    // đồi tuyết gần
    s += pa('M-10,236 Q70,212 150,228 Q220,240 280,222 Q330,210 370,222 L370,310 L-10,310 Z', cel('#f7f8ff', '#bcc3f2'), 4);
    // vết chân thỏ dẫn tới bục
    s += [[24, 276], [50, 268], [74, 262], [98, 258]].map(([x, y], i) => nbsTrack(x, y, .9 + i * .05)).join('');
    // cỏ băng nhú khỏi tuyết
    s += ln('M300,244 l-4,-12 M306,244 l1,-14 M312,244 l5,-11 M40,236 l-3,-10 M45,236 l2,-12', '#8fd8ff', 2.6);
    s += flakes(28, 227);
    // bục: gò tuyết tròn, trăng lưỡi liềm nhỏ
    s += platformR('#f4f6ff', '#aab4ee', pa('M238,250 A8,8 0 1 0 238,266 A6,6 0 1 1 238,250 Z', cel('#fff3b0', '#ffc94a'), 2.2) + ln('M118,260 q12,-5 24,0', '#c9cff5', 2.5) + spark4(128, 252, 4, '#ffffff', 1.4));
    return s;
  };
  SCENE_NAME.n_hare = 'Đồi tuyết trăng rằm';
})();

// ----- Hệ Sấm -----
/* ===================== CẢNH NỀN · HỆ SẤM · 2 PET THƯỜNG MỚI (bản 5) =====================
   n_manta     Cá Đuối Sấm: "Biển đêm giông bão": mây giông dày, sét giáng xuống biển, mưa xiên, sóng bạc đầu,
               hải đăng xa quét đèn, sinh vật phát quang; bục là tảng đá ướt có san hô, sao biển, vỏ ốc.
   n_dragonfly Chuồn Chuồn Sấm: "Đồng lúa trước cơn giông": hoàng hôn tím cam dưới mây giông, lũy tre và mái nhà tranh xa,
               ruộng bậc lấp lánh nước, đàn chuồn chuồn bay thấp; bục là ụ đất bờ ruộng có cỏ lau, hoa dại.
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như mọi cảnh trong scenes.js.
   Cần gfx.js (pa, el, ci, ln, hl, bl, f1, P, cel, lin, bolt, spark4, OL) và scenes.js (SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, platformR).
   Nạp SAU scenes.js. Hàm phụ trong IIFE, tiền tố mts (biển) và ccs (đồng lúa); không thêm tên toàn cục ngoài SCENES.<id>, SCENE_NAME.<id>. */
(() => {
  if (typeof SCENES === 'undefined') return;
  const R = Math.round;

  /* ----- Dùng chung ----- */
  // Tia sét xa gấp khúc có nhánh
  function mtsStrike(x, y, h, col, dl = 0, seed = 1) {
    const r = rng(seed);
    let d = `M${x},${y}`, px = x, py = y, br = '';
    for (let i = 1; i <= 6; i++) { px += (r() - .5) * 20; py += h / 6; d += `L${R(px)},${R(py)}`; if (i === 3) br = `M${R(px)},${R(py)}l${R(9 + r() * 8)},${R(12 + r() * 8)}l-4,10`; }
    const all = d + br;
    return `<g class="flick" style="animation-delay:-${dl}s">${ln(all, col, 8, 'opacity=".22"')}${ln(all, OL, 4.5)}${ln(all, col, 2.2)}</g>`;
  }
  // Mây giông: khối bướu gộp viền + mép sáng do chớp
  function mtsStorm(x, y, k, col, cold, rim) {
    const c = [[0, 0, 22], [-26, 8, 16], [26, 6, 18], [-48, 14, 10], [50, 14, 11], [10, -14, 16]];
    return bl(c.map(([dx, dy, r]) => `<circle cx="${R(x + dx * k)}" cy="${R(y + dy * k)}" r="${R(r * k)}"/>`).join('') + `<rect x="${R(x - 54 * k)}" y="${R(y + 10 * k)}" width="${R(108 * k)}" height="${R(14 * k)}" rx="${R(7 * k)}"/>`, cel(col, cold, .55), 3) +
      (rim ? ln(`M${R(x - 30 * k)},${R(y - 8 * k)}Q${R(x - 10 * k)},${R(y - 30 * k)} ${R(x + 14 * k)},${R(y - 24 * k)}`, rim, 2.4, 'opacity=".7"') : '');
  }
  // Mưa xiên
  function mtsRain(n, seed, col = '#c9e6ff', op = .35) {
    const r = rng(seed); let d = '';
    for (let i = 0; i < n; i++) { const x = r() * (SW + 40) - 20, y = r() * SH, L = 10 + r() * 10; d += `M${R(x)},${R(y)}l${R(-L * .35)},${R(L)}`; }
    return `<g class="blizzard">${ln(d, col, 1.6, `opacity="${op}"`)}</g>`;
  }

  /* ===================== BIỂN ĐÊM GIÔNG BÃO ===================== */
  // Dải sóng: các ngọn sóng cong về phải có bọt trắng
  function mtsWave(y, amp, step, col, cold, foam, seed, cls = '') {
    const r = rng(seed);
    let d = `M-10,${SH + 10}L-10,${y}`, f = '';
    for (let x = -10; x < SW + 10; x += step) {
      const a = amp * (.7 + r() * .6);
      d += `Q${R(x + step * .35)},${R(y - a * 1.6)} ${R(x + step * .62)},${R(y - a)}Q${R(x + step * .74)},${R(y - a * .35)} ${R(x + step)},${y}`;
      f += `M${R(x + step * .2)},${R(y - a * .6)}Q${R(x + step * .36)},${R(y - a * 1.42)} ${R(x + step * .58)},${R(y - a * 1.02)}`;
    }
    d += `L${SW + 10},${SH + 10}Z`;
    return `<g${cls ? ` class="${cls}"` : ''}>` + pa(d, cel(col, cold, .5), 3) + ln(f, foam, 2.4, 'opacity=".9"') + `</g>`;
  }
  // Hải đăng trên mỏm đá xa, đèn quét
  function mtsLighthouse(x, y, k) {
    let s = `<g class="aurora"><path d="M${R(x)},${R(y - 52 * k)}L${R(x - 150 * k)},${R(y - 78 * k)}L${R(x - 150 * k)},${R(y - 30 * k)}Z" fill="#fff3a0" opacity=".16"/></g>`;
    s += pa(`M${R(x - 26 * k)},${y}Q${R(x - 20 * k)},${R(y - 12 * k)} ${R(x - 6 * k)},${R(y - 12 * k)}Q${R(x + 14 * k)},${R(y - 16 * k)} ${R(x + 26 * k)},${y}Z`, cel('#3a4a86', '#1f2a5e', .5), 2.5);
    s += pa(`M${R(x - 7 * k)},${R(y - 10 * k)}L${R(x - 5 * k)},${R(y - 46 * k)}L${R(x + 5 * k)},${R(y - 46 * k)}L${R(x + 7 * k)},${R(y - 10 * k)}Z`, cel('#f4f1ff', '#b9b2e6', .5), 2.2);
    s += ln(`M${R(x - 6.4 * k)},${R(y - 22 * k)}H${R(x + 6.4 * k)}M${R(x - 5.8 * k)},${R(y - 34 * k)}H${R(x + 5.8 * k)}`, '#ff4d6a', 3.4);
    s += pa(`M${R(x - 6 * k)},${R(y - 46 * k)}V${R(y - 56 * k)}H${R(x + 6 * k)}V${R(y - 46 * k)}Z`, '#fff3a0', 2) + pa(`M${R(x - 8 * k)},${R(y - 56 * k)}L${R(x)},${R(y - 64 * k)}L${R(x + 8 * k)},${R(y - 56 * k)}Z`, '#ff4d6a', 2);
    return s + `<g class="twinkle">${ci(x, y - 51 * k, 6 * k, '#fff6b0', 0, 'opacity=".55"')}</g>`;
  }
  // San hô nhánh
  function mtsCoral(x, y, k, col, cold) {
    const d = `M${x},${y}Q${R(x - 2 * k)},${R(y - 12 * k)} ${R(x - 10 * k)},${R(y - 20 * k)}M${R(x - 1 * k)},${R(y - 8 * k)}Q${R(x + 6 * k)},${R(y - 16 * k)} ${R(x + 8 * k)},${R(y - 26 * k)}M${R(x + 4 * k)},${R(y - 15 * k)}L${R(x + 14 * k)},${R(y - 18 * k)}M${R(x - 6 * k)},${R(y - 15 * k)}L${R(x - 14 * k)},${R(y - 12 * k)}`;
    return ln(d, OL, 8 * k + 3) + ln(d, col, 8 * k) + ln(d, cold, 2.2 * k, 'opacity=".5"');
  }
  const mtsStar = (x, y, r, rot) => pa(starPath(x, y, r, r * .45, 5, rot), cel('#ffd21f', '#e08a00', .55), 2.4) + ci(x, y, r * .16, '#ff8a1f', 0);
  const mtsShell = (x, y, k) => pa(`M${R(x - 9 * k)},${y}Q${R(x - 10 * k)},${R(y - 12 * k)} ${x},${R(y - 13 * k)}Q${R(x + 10 * k)},${R(y - 12 * k)} ${R(x + 9 * k)},${y}Q${x},${R(y + 3 * k)} ${R(x - 9 * k)},${y}Z`, cel('#ffd6e8', '#e89ab8', .55), 2.2) +
    ln(`M${x},${R(y + 1)}V${R(y - 11 * k)}M${R(x - 5 * k)},${y}L${R(x - 3 * k)},${R(y - 10 * k)}M${R(x + 5 * k)},${y}L${R(x + 3 * k)},${R(y - 10 * k)}`, '#c97a9a', 1.6);

  SCENES.n_manta = () => {
    let s = skyR('#080c2e', '#18215e', '#2f4a96');
    // quầng chớp sau mây
    s += `<circle cx="96" cy="60" r="90" fill="#8ab4ff" opacity=".12"/><circle cx="286" cy="48" r="70" fill="#c9b5ff" opacity=".1"/>`;
    s += starsR(8, 211, 50, '#c9fbff');
    // sét giáng xuống biển xa
    s += mtsStrike(92, 40, 128, '#fff59a', 0, 7) + mtsStrike(252, 36, 120, '#9ff8ff', .6, 13) + mtsStrike(330, 50, 70, '#fff59a', 1.1, 19);
    // mây giông dày
    s += mtsStorm(40, 30, 1.2, '#2f3780', '#1a1f52', '#9fb6ff') + mtsStorm(178, 14, 1.1, '#343c88', '#1c2156', '#c9b5ff') + mtsStorm(318, 26, 1.25, '#2f3780', '#1a1f52', '#9fb6ff');
    s += mtsStorm(110, 58, .7, '#3e4796', '#252b66') + mtsStorm(258, 66, .65, '#3e4796', '#252b66');
    // chân trời, hải đăng xa
    s += `<rect y="166" width="${SW}" height="20" fill="#3a5aa8" opacity=".35"/>`;
    s += mtsLighthouse(312, 178, 1);
    // biển: sóng xa → gần
    s += mtsWave(178, 5, 34, '#1f3c86', '#142a62', '#7fb4ff', 3, 'drift');
    s += ln('M60,190h40M76,196h22M228,188h34M244,194h20', '#fff59a', 2.4, 'opacity=".45"');
    s += mtsWave(204, 8, 46, '#21509e', '#163a78', '#bfe6ff', 5, 'drift d2');
    s += [[40, 222, 0], [128, 214, .6], [300, 220, 1.1], [220, 232, .3], [84, 246, .9], [334, 252, 1.4]].map(([x, y, d]) => `<g class="twinkle" style="animation-delay:-${d}s">${ci(x, y, 4.5, '#33e1ff', 0, 'opacity=".35"')}${ci(x, y, 1.8, '#c9fbff', 0)}</g>`).join('');
    s += mtsWave(236, 11, 58, '#2a64b4', '#1b4588', '#e6f6ff', 9);
    // bục: tảng đá ướt giữa sóng
    s += platformR(lin('#8a86c4', '#5a5a9a'), '#34346e',
      ln('M96,256Q130,250 160,252M206,250Q240,248 266,256', '#d6d2ff', 2.4, 'opacity=".6"') + ln('M150,246l6,4l8,-2M196,264l8,3l6,-3', '#34346e', 2, 'opacity=".7"') +
      mtsCoral(102, 254, 1, '#ff6a9a', '#a8204f') + mtsCoral(116, 256, .7, '#ff9a4a', '#c2560a') + mtsStar(252, 254, 9, -80) + mtsShell(232, 262, .9) + bolt(144, 250, 12, '#ffd21f', 2));
    // sóng trước bục + bọt tung
    s += mtsWave(282, 9, 52, '#2f72c4', '#1d4f94', '#ffffff', 21);
    s += [[66, 264, 6], [80, 256, 4], [292, 262, 5.5], [306, 252, 3.6], [52, 276, 4]].map(([x, y, r]) => ci(x, y, r, '#e6f6ff', 2)).join('');
    // mưa xiên
    s += mtsRain(46, 31);
    return s;
  };
  SCENE_NAME.n_manta = 'Biển đêm giông bão';

  /* ===================== ĐỒNG LÚA TRƯỚC CƠN GIÔNG ===================== */
  // Lũy tre xa: cụm lá bướu + thân mảnh
  function ccsBamboo(x, y, k, col) {
    let s = ln(`M${x},${y}Q${R(x - 4 * k)},${R(y - 30 * k)} ${R(x - 10 * k)},${R(y - 54 * k)}M${R(x + 6 * k)},${y}Q${R(x + 8 * k)},${R(y - 30 * k)} ${R(x + 16 * k)},${R(y - 50 * k)}`, col, 2.4);
    s += bl([[-12, -50, 12], [0, -58, 14], [14, -48, 12], [-4, -40, 10], [10, -36, 9]].map(([dx, dy, r]) => `<circle cx="${R(x + dx * k)}" cy="${R(y + dy * k)}" r="${R(r * k)}"/>`).join(''), col, 2.5);
    return s;
  }
  // Nhà tranh xa
  function ccsHut(x, y, k) {
    return pa(`M${R(x - 18 * k)},${y}V${R(y - 14 * k)}H${R(x + 18 * k)}V${y}Z`, '#5a3a5e', 2.2) + `<rect x="${R(x - 4 * k)}" y="${R(y - 10 * k)}" width="${R(7 * k)}" height="${R(8 * k)}" fill="#ffd27a"/>` +
      pa(`M${R(x - 26 * k)},${R(y - 12 * k)}L${x},${R(y - 32 * k)}L${R(x + 26 * k)},${R(y - 12 * k)}Q${x},${R(y - 16 * k)} ${R(x - 26 * k)},${R(y - 12 * k)}Z`, cel('#c98a4a', '#7a4a2a', .55), 2.2) +
      ln(`M${R(x - 14 * k)},${R(y - 18 * k)}L${R(x - 4 * k)},${R(y - 27 * k)}M${R(x + 2 * k)},${R(y - 27 * k)}L${R(x + 14 * k)},${R(y - 18 * k)}`, '#7a4a2a', 1.6);
  }
  // Thửa ruộng: dải cong + hàng mạ + vệt nước phản chiếu trời
  function ccsField(y0, y1, col, cold, rows, water, seed) {
    const r = rng(seed);
    let s = pa(`M-10,${y1}L-10,${y0}Q180,${y0 - 8} 370,${y0}L370,${y1}Z`, cel(col, cold, .6), 3);
    if (water) s += ln(`M${R(20 + r() * 40)},${R(y0 + 6)}h${R(40 + r() * 30)}M${R(160 + r() * 40)},${R(y0 + 5)}h${R(50 + r() * 30)}M${R(280 + r() * 20)},${R(y0 + 7)}h40`, water, 2.6, 'opacity=".7"');
    let d = '';
    for (let i = 0; i < rows; i++) {
      const yy = y0 + (y1 - y0) * (i + .6) / (rows + .4), gap = 14 + i * 4, h = 3 + i * 1.6;
      for (let x = (i % 2) * gap / 2 - 6; x < SW + 6; x += gap) d += `M${R(x)},${R(yy)}l${R(-h * .45)},${R(-h)}M${R(x)},${R(yy)}l0,${R(-h * 1.25)}M${R(x)},${R(yy)}l${R(h * .45)},${R(-h)}`;
    }
    return s + ln(d, cold, 1.8, 'opacity=".85"');
  }
  // Cỏ lau: thân cong + bông lau xù
  function ccsReed(x, y, h, lean, col = '#e9dcc0') {
    const tx = x + lean, ty = y - h;
    return `<g class="sway" style="animation-delay:-${(x % 7) * .3}s">` + ln(`M${x},${y}Q${R(x + lean * .2)},${R(y - h * .6)} ${R(tx)},${R(ty)}`, OL, 5) + ln(`M${x},${y}Q${R(x + lean * .2)},${R(y - h * .6)} ${R(tx)},${R(ty)}`, '#7aa84a', 2.4) +
      pa(`M${R(tx)},${R(ty + 3)}Q${R(tx - 7 + lean * .2)},${R(ty - 10)} ${R(tx + lean * .4)},${R(ty - 22)}Q${R(tx + 7 + lean * .2)},${R(ty - 10)} ${R(tx)},${R(ty + 3)}Z`, cel(col, '#bfa77a', .55), 2.4) + `</g>`;
  }
  // Chuồn chuồn bé bay thấp (dáng bóng trên nền trời)
  function ccsFly(x, y, k, ang, dl) {
    const a = ang * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), q = (u, v) => [x + (u * c - v * sn) * k, y + (u * sn + v * c) * k];
    const wing = (u, v, rot) => { const [wx, wy] = q(u, v); return `<ellipse cx="${f1(wx)}" cy="${f1(wy)}" rx="${f1(8.5 * k)}" ry="${f1(2.6 * k)}" transform="rotate(${R(ang + rot)} ${f1(wx)} ${f1(wy)})" fill="#c9f6ff" stroke="#2a1f5e" stroke-width="1.3"/>`; };
    const [hx, hy] = q(-6, 0), [tx, ty] = q(22, 0);
    return `<g class="float" style="animation-delay:-${dl}s">` + wing(-1, -8, 100) + wing(4, -8, 78) + wing(-1, 8, 80) + wing(4, 8, 102) +
      ln(`M${P(...q(-4, 0))}L${P(tx, ty)}`, '#2a1f5e', 3) + ln(`M${P(...q(10, 0))}L${P(tx, ty)}`, '#ffd21f', 1.2) + ci(hx, hy, 3 * k, '#5b30d8', 1.2) + `</g>`;
  }

  SCENES.n_dragonfly = () => {
    let s = skyR('#251a64', '#6a40a8', '#f09a6e');
    // mặt trời lặn sau mây
    s += `<circle cx="262" cy="160" r="70" fill="#ffb86a" opacity=".22"/><circle cx="262" cy="160" r="40" fill="#ffd27a" opacity=".35"/>` + ci(262, 160, 22, '#ffe2a0', 0, 'opacity=".9"');
    // sét xa
    s += mtsStrike(70, 44, 112, '#fff59a', 0, 5) + mtsStrike(300, 40, 64, '#9ff8ff', .7, 11);
    // mây giông cuộn
    s += mtsStorm(50, 24, 1.25, '#3a2a86', '#22185e', '#c9a8ff') + mtsStorm(190, 10, 1.15, '#40308e', '#261b66', '#ffc9a8') + mtsStorm(330, 30, 1.2, '#3a2a86', '#22185e', '#c9a8ff');
    s += mtsStorm(128, 64, .62, '#5a44a8', '#3a2a80') + mtsStorm(318, 82, .5, '#6a50b4', '#44308a');
    // lũy tre, nhà tranh xa
    s += [[18, 168, .9], [44, 170, 1.1], [120, 166, .8], [204, 168, .9], [340, 170, 1.1]].map(([x, y, k]) => ccsBamboo(x, y, k, '#3a2f6e')).join('');
    s += ccsHut(84, 170, 1);
    s += pa(`M-10,176Q180,160 370,176L370,186L-10,186Z`, '#3d3478', 0);
    // ruộng bậc: xa → gần
    s += ccsField(172, 202, '#6aa84a', '#3f7a34', 2, '#f0b8a0', 3);
    s += ccsField(198, 232, '#7cc24f', '#4a8a3a', 2, '#e6b0e0', 7);
    s += ccsField(228, 310, '#d8c548', '#9a8a2a', 3, '#ffd8b0', 11);
    // bờ ruộng
    s += ln('M-10,230Q180,220 370,230', '#8a6a3a', 4, 'opacity=".8"') + ln('M-10,201Q180,193 370,201', '#5a7a3a', 3, 'opacity=".7"');
    // đàn chuồn chuồn bay thấp
    s += ccsFly(150, 112, 1.1, -8, 0) + ccsFly(232, 124, 1, 192, .7) + ccsFly(312, 206, 1.1, 172, 1.3) + ccsFly(44, 210, 1.1, 10, .4);
    // bục: ụ đất bờ ruộng có cỏ
    s += platformR(lin('#9fe06a', '#5ab84a'), '#7a5230',
      ln('M96,252l4,-10l3,9M110,256l3,-8l4,8M246,252l3,-10l4,9M262,256l3,-8l3,7', '#3f8a3a', 2.6) +
      flower(118, 250, 4.5, '#ff8cc4') + flower(254, 248, 4.5, '#fff3a0') + flower(232, 260, 3.6, '#c9b5ff') + bolt(146, 250, 12, '#ffd21f', 2));
    // cỏ lau hai bên bục (lớp trước)
    s += ccsReed(78, 270, 58, -10) + ccsReed(92, 274, 44, 6) + ccsReed(284, 270, 60, 10) + ccsReed(270, 276, 42, -6) + ccsReed(20, 300, 70, 8, '#f4ead4') + ccsReed(344, 300, 74, -10, '#f4ead4');
    // gió và hạt mưa đầu tiên
    s += ln('M18,96q20,-8 40,0t40,0M280,104q18,-7 36,0t36,0', '#e6d8ff', 2.2, 'opacity=".5"');
    s += mtsRain(16, 43, '#e6e0ff', .3);
    return s;
  };
  SCENE_NAME.n_dragonfly = 'Đồng lúa trước cơn giông';
})();

// ----- Hệ Đá -----
/* ===================== CẢNH NỀN · HỆ ĐÁ: CUA ĐÁ (n_crab), DÊ NÚI ĐÁ (n_goat) =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như js/scenes.js. Nạp SAU scenes.js
   (dùng SCENES, SCENE_NAME, SW, SH, rng, skyR, cloudR, ridge, groundR, platformR, pine và hàm vẽ của gfx.js).
   Hàm phụ nằm trong IIFE, tiền tố nds; không thêm tên toàn cục nào ngoài SCENES.n_crab/n_goat và SCENE_NAME.n_crab/n_goat. */
(() => {
  const r0 = Math.round, Q = (x, y) => r0(x) + ',' + r0(y);
  const ndsGlow = (x, y, rx, ry, col, op) => `<ellipse cx="${r0(x)}" cy="${r0(y)}" rx="${r0(rx)}" ry="${r0(ry)}" fill="${col}" opacity="${op}"/>`;
  // Cụm tinh thể: chân (x, y), cỡ k, màu
  const ndsGems = (x, y, k, c, cd) => crystal(x - 12 * k, y, 24 * k, 12 * k, c, cd, 3, -7 * k) + crystal(x + 12 * k, y, 20 * k, 11 * k, c, cd, 3, 7 * k) + crystal(x, y + 1, 36 * k, 15 * k, c, cd, 3.2);
  // Đá cuội lấm tấm
  const ndsPebble = (x, y, rx, ry, col, cold) => el(x, y, rx, ry, cel(col, cold), 3) + ci(x + rx * .3, y - ry * .1, 1.2, cold, 0) + ci(x - rx * .35, y + ry * .2, 1, cold, 0);
  // Sao biển
  const ndsStar = (x, y, r, col, rot = -90) => pa(starPath(x, y, r, r * .45, 5, rot), col, 2.5) + ci(x, y, r * .18, '#fff3d6', 0);
  // Vỏ sò quạt
  const ndsShell = (x, y, r, col) => pa(`M${Q(x - r, y)}Q${Q(x - r, y - r * 1.2)} ${Q(x, y - r * 1.1)}Q${Q(x + r, y - r * 1.2)} ${Q(x + r, y)}Q${Q(x, y + r * .35)} ${Q(x - r, y)}Z`, col, 2.4) +
    ln(`M${Q(x, y + 1)}L${Q(x, y - r * .9)}M${Q(x - r * .2, y + 1)}L${Q(x - r * .6, y - r * .8)}M${Q(x + r * .2, y + 1)}L${Q(x + r * .6, y - r * .8)}`, '#c2412e', 1.4, 'opacity=".6"');
  // Đám mây bông dài (biển mây): dãy vòm tròn trên đáy phẳng
  const ndsCloudBank = (x0, x1, y, h, seed, col, cold, w = 3.5) => {
    const r = rng(seed); let c = '';
    for (let x = x0; x <= x1; x += h * .9) { const rr = h * (.55 + r() * .45); c += `<circle cx="${r0(x)}" cy="${r0(y - rr * .35)}" r="${r0(rr)}"/>`; }
    c += `<rect x="${r0(x0 - h * .5)}" y="${r0(y - h * .2)}" width="${r0(x1 - x0 + h)}" height="${r0(h * 1.4)}" rx="${r0(h * .5)}"/>`;
    return bl(c, cel(col, cold), w);
  };

  /* ---------- CUA ĐÁ: Ghềnh đá hang tinh thể lúc hoàng hôn ---------- */
  SCENES.n_crab = () => {
    let s = skyR('#4a3fa8', '#9a6ad6', '#ff9ec0', '#ffd09a');
    s += cloudR(14, 58, .9, '#ffd6ea') + cloudR(222, 38, 1.1, '#ffd6ea', 'drift d2');
    // mặt trời lặn trên biển
    s += ndsGlow(262, 148, 46, 40, '#fff1b0', .28) + ci(262, 148, 24, 'url(#gSun)', 3.5);
    // biển
    s += pa('M-10,148H370V250H-10Z', lin('#6a5ad6', '#2f8ab8', '#38c0c8'), 3.5);
    s += ln('M238,160h48M246,170h32M234,181h44M250,193h24', '#ffe6a0', 3, 'opacity=".75"');
    s += `<g class="drift">` + ln('M14,176q10,-6 20,0t20,0M98,196q10,-6 20,0t20,0M286,214q10,-6 20,0t20,0M150,168q8,-5 16,0t16,0', '#c8f6ff', 2.5, 'opacity=".85"') + `</g>`;
    // cột đá ngoài khơi
    const SS = cel('#e09a68', '#9a4a30');
    s += pa('M292,246L296,186L304,164L320,158L332,172L338,246Z', SS, 4) + ln('M298,196H334M296,220H337', '#9a4a30', 2.5) + pa('M302,170Q314,160 326,166L322,172Q312,168 304,174Z', '#86ec66', 2);
    s += pa('M340,248L344,206L356,196L372,202V248Z', SS, 4) + ln('M344,222H370', '#9a4a30', 2.5);
    // vách đá trái có hang tinh thể
    s += pa('M-10,258V54L22,44L56,62L82,96L96,150L112,206L124,258Z', cel('#d98a5a', '#8a4a2a'), 4);
    s += ln('M-6,92Q30,84 64,100M-6,128Q40,120 86,136M-6,170Q12,166 20,168M92,186Q102,190 110,200', '#8a4a2a', 2.5);
    s += pa('M14,244Q10,178 50,164Q90,176 94,244Z', '#241640', 4);
    s += ndsGlow(52, 216, 40, 34, '#5fffc8', .28) + ndsGlow(52, 224, 24, 20, '#ffe680', .3);
    s += ndsGems(40, 240, .9, '#9dffd9', '#13916c') + ndsGems(70, 242, .7, '#ffe07a', '#e08a00') + crystal(52, 184, 22, 10, '#9dffd9', '#13916c', 3) + `<g transform="rotate(180 52 179)">${crystal(52, 179, 18, 9, '#9dffd9', '#13916c', 3)}</g>`;
    s += pa('M28,48Q44,40 60,58Q46,54 30,58Z', '#86ec66', 2.4) + [[64, 120, 5], [30, 150, 4]].map(([x, y, r]) => spark4(x, y, r, '#e6fff6', 1.6, 'twinkle', x / 40)).join('');
    // bãi cát, bọt sóng
    s += groundR(238, '#f2d6a6');
    s += ln('M-10,240Q50,228 110,240T230,236T370,236', '#ffffff', 5) + ln('M-10,240Q50,228 110,240T230,236T370,236', '#bff4ff', 2.4);
    // vũng nước, sao biển, vỏ sò, đá cuội
    s += el(316, 274, 30, 8, lin('#7fe0f0', '#38c0c8'), 3) + ln('M300,272h12M320,276h14', '#ffffff', 2, 'opacity=".8"');
    s += ndsStar(304, 260, 9, '#ff7a6a', -80) + ndsStar(40, 282, 8, '#ffb21f', -100) + ndsShell(80, 270, 8, '#ffd0c8') + ndsShell(346, 292, 7, '#fff1d6');
    s += ndsPebble(24, 262, 12, 7, '#b8aedc', '#6e649e') + ndsPebble(338, 256, 9, 6, '#e8b07a', '#a8623a') + ndsPebble(114, 290, 8, 5, '#b8aedc', '#6e649e') + ndsPebble(258, 292, 10, 6, '#e8b07a', '#a8623a');
    s += ln('M16,248q2,-10 -2,-16M22,248q4,-12 0,-20M300,250q-2,-10 2,-16', '#2f9a3e', 3);
    // bục: phiến đá phẳng có hà bám, viền cát
    s += platformR('#e8b07a', '#a8623a', [[116, 262, 4], [128, 266, 3], [238, 264, 4], [250, 261, 3]].map(([x, y, r]) => ci(x, y, r, '#fff3e0', 2) + ci(x, y, r * .4, '#a8623a', 0)).join('') + ndsShell(150, 258, 6, '#ffd0c8'));
    // hải âu, lấp lánh trên mặt biển
    s += `<g class="drift">` + ln('M150,92q6,-6 12,0q6,-6 12,0M182,74q4,-4 8,0q4,-4 8,0', '#3a2f7a', 2.6) + `</g>`;
    s += [[200, 186, 4], [120, 208, 3.5], [276, 226, 3.5], [340, 176, 3]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#ffffff', 1.4, 'twinkle', i * .45)).join('');
    return s;
  };
  SCENE_NAME.n_crab = 'Ghềnh đá hang tinh thể';

  /* ---------- DÊ NÚI ĐÁ: Vách núi cao trên biển mây lúc bình minh ---------- */
  SCENES.n_goat = () => {
    let s = skyR('#5a72e0', '#a8bcff', '#ffe2cc', '#ffc08a');
    // mặt trời mọc sau biển mây
    s += ndsGlow(92, 166, 70, 50, '#fff1c0', .35) + ci(92, 166, 26, 'url(#gSun)', 3.5);
    s += cloudR(196, 40, .9, '#ffffff', 'drift') + cloudR(20, 30, .7, '#ffffff', 'drift d2');
    // dãy núi xa nhô trên mây, đỉnh phủ tuyết
    s += ridge([[24, 150], [74, 118], [128, 148], [196, 100], [254, 140], [318, 108], [372, 140]], 220, '#9a90d0', 3.5);
    s += [[74, 118], [196, 100], [318, 108]].map(([x, y]) => pa(`M${x - 13},${y + 14}L${x},${y}L${x + 13},${y + 14}L${x + 6},${y + 11}L${x},${y + 16}L${x - 6},${y + 11}Z`, '#ffffff', 2.5)).join('');
    // đảo đá bay xa
    const ndsIsle = (x, y, w) => pa(`M${Q(x - w, y)}L${Q(x + w, y)}L${Q(x + w * .6, y + w * .45)}L${Q(x + w * .15, y + w * .9)}L${Q(x - w * .3, y + w * .55)}L${Q(x - w * .7, y + w * .4)}Z`, cel('#b8aedc', '#6e649e'), 3) +
      pa(`M${Q(x - w - 1, y + 1)}Q${Q(x, y - w * .35)} ${Q(x + w + 1, y + 1)}Z`, cel('#86ec66', '#2f9a3e'), 2.2) + ln(`M${Q(x - w * .3, y + w * .2)}L${Q(x, y + w * .5)}`, '#6e649e', 1.6);
    s += `<g class="float">${ndsIsle(250, 72, 18)}${pine(254, 70, 18, '#2f8a5a')}</g><g class="float" style="animation-delay:-1.1s">${ndsIsle(160, 58, 11)}</g>`;
    // biển mây xa
    s += `<g class="drift d2">` + ndsCloudBank(-30, 390, 198, 20, 7, '#fbf6ff', '#d6d0f6', 3) + `</g>`;
    // vách núi hai bên: sa thạch, vân hổ phách, thông bám vách
    const CL = cel('#e0b488', '#9a6a44');
    s += pa('M-10,300V64L14,52L38,60L48,92L60,104L66,150L84,176L90,300Z', CL, 4);
    s += ln('M-6,96Q20,92 46,100M-6,140Q30,136 62,146M-6,190Q36,186 78,196', '#9a6a44', 2.5);
    s += ln('M10,120L26,130L22,150L36,166', OL, 6) + ln('M10,120L26,130L22,150L36,166', '#ffd21f', 3) + crystal(36, 170, 16, 8, '#ffe07a', '#e08a00', 2.6, 3);
    s += pine(26, 56, 40, '#2f8a5a') + pine(56, 104, 28, '#2f8a5a');
    s += pa('M370,300V84L346,74L326,92L316,128L300,150L292,190L280,300Z', CL, 4);
    s += ln('M366,112Q340,110 320,120M366,160Q330,156 300,166M366,214Q330,210 290,222', '#9a6a44', 2.5);
    s += crystal(330, 138, 20, 10, '#9dffd9', '#13916c', 2.8, -3) + crystal(342, 140, 13, 7, '#9dffd9', '#13916c', 2.4, 4) + pine(340, 78, 36, '#2f8a5a');
    // chim bay
    s += `<g class="drift">` + ln('M150,96q5,-5 10,0q5,-5 10,0M176,84q4,-4 8,0q4,-4 8,0M268,110q4,-4 8,0q4,-4 8,0', '#4a3f8a', 2.4) + `</g>`;
    // biển mây gần quanh chân cột đá
    s += `<g class="drift">` + ndsCloudBank(-20, 380, 262, 26, 13, '#ffffff', '#cfc8f2', 3.5) + `</g>`;
    // bục: đỉnh cột đá phẳng có cỏ, tinh thể nhỏ
    s += platformR('#d9b088', '#9a6a44', pa('M90,256Q100,248 110,254Q104,250 98,256Z M248,252Q258,244 268,250Q262,248 256,254Z', '#5fc86a', 2) + crystal(124, 262, 12, 7, '#ffe07a', '#e08a00', 2.4) + crystal(240, 262, 10, 6, '#9dffd9', '#13916c', 2.2));
    s += `<g class="drift d2">` + ndsCloudBank(40, 110, 290, 14, 21, '#ffffff', '#cfc8f2', 3) + ndsCloudBank(250, 330, 292, 14, 23, '#ffffff', '#cfc8f2', 3) + `</g>`;
    s += [[130, 40, 4.5], [300, 50, 4], [214, 132, 3.5]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#ffffff', 1.6, 'twinkle', i * .5)).join('');
    return s;
  };
  SCENE_NAME.n_goat = 'Vách núi biển mây';
})();

// ----- Hệ Rừng -----
/* ===================== CẢNH NỀN HỆ RỪNG v5: Tắc Kè Hoa (n_chameleon), Lợn Rừng (n_boar) =====================
   viewBox 0 0 360 300, bục đứng tâm (180, 258) như js/scenes.js. Nạp SAU scenes.js
   (dùng SCENES, SCENE_NAME, SW, SH, rng, skyR, fireflies của scenes.js và pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, leaf, OL của gfx.js).
   Hàm phụ nằm trong IIFE, tiền tố nrs; không thêm tên toàn cục nào ngoài SCENES.n_chameleon, SCENES.n_boar,
   SCENE_NAME.n_chameleon, SCENE_NAME.n_boar. */
(() => {
  const R2 = Math.PI / 180;
  // Cánh lá nhọn: gốc (x, y), dài L, nửa rộng w, góc ang
  function nrsPetalD(x, y, L, w, ang) {
    const a = ang * R2, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
    const q = (k, s) => P(x + ux * L * k + nx * w * s, y + uy * L * k + ny * w * s);
    return `M${P(x, y)}C${q(.12, 1)} ${q(.62, 1.15)} ${q(1, 0)}C${q(.62, -1.15)} ${q(.12, -1)} ${P(x, y)}Z`;
  }
  const nrsLeaves = (list, c1, c2, sw = 3) => pa(list.map(([x, y, L, a, k]) => nrsPetalD(x, y, L, L * (k || .3), a)).join(''), cel(c1, c2), sw) +
    ln(list.map(([x, y, L, a]) => `M${P(x, y)}L${P(x + Math.cos(a * R2) * L * .85, y + Math.sin(a * R2) * L * .85)}`).join(''), c2, 1.8);
  const nrsCir = (x, y, r) => `M${P(x - r, y)}a${f1(r)},${f1(r)} 0 1 0 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1 0 ${f1(-2 * r)},0Z`;
  // Hoa dâm bụt nhỏ
  function nrsHibiscus(x, y, r, ang, c1, c2) {
    let d = '';
    for (let i = 0; i < 5; i++) d += nrsPetalD(x, y, r, r * .55, ang - 90 + i * 72);
    return pa(d, cel(c1, c2), 2.6) + ci(x, y, r * .3, '#ffe14d', 0) + tube(`M${P(x, y)}L${P(x + Math.cos((ang - 126) * R2) * r * .9, y + Math.sin((ang - 126) * R2) * r * .9)}`, '#ffe14d', 1.8, 1);
  }

  /* ---------- Tắc Kè Hoa: Tán rừng nhiệt đới ---------- */
  // Lá ráy (monstera) lớn: gốc (x, y), dài L, góc ang, có khía xẻ
  function nrsMonstera(x, y, L, ang, c1, c2) {
    const a = ang * R2, ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux, w = L * .55;
    const q = (k, s) => P(x + ux * L * k + nx * w * s, y + uy * L * k + ny * w * s);
    let s = pa(`M${P(x, y)}C${q(-.05, 1.1)} ${q(.7, 1.25)} ${q(1, 0)}C${q(.7, -1.25)} ${q(-.05, -1.1)} ${P(x, y)}Z`, cel(c1, c2), 3.5);
    // khía xẻ (vẽ bằng nét màu nền tối)
    let cut = '';
    for (const k of [.3, .5, .7]) for (const sd of [-1, 1]) cut += `M${q(k + .04, sd * .95)}L${q(k - .06, sd * .45)}`;
    s += ln(cut, c2, 3.4) + ln(`M${P(x, y)}L${q(.92, 0)}`, c2, 2.2);
    return s;
  }
  // Chùm hoa mỏ két (heliconia) rủ xuống: các bẹ đỏ mũi vàng xen kẽ
  function nrsHeliconia(x, y, n, k) {
    let s = tube(`M${x},${y}L${x},${f1(y + n * 13 * k)}`, '#3fa860', 3, 1.6), d = '', t = '';
    for (let i = 0; i < n; i++) {
      const sd = i % 2 ? 1 : -1, by = y + (i + .5) * 13 * k;
      d += `M${P(x, by - 5 * k)}Q${P(x + sd * 16 * k, by - 6 * k)} ${P(x + sd * 22 * k, by + 6 * k)}Q${P(x + sd * 10 * k, by + 4 * k)} ${P(x, by + 5 * k)}Z`;
      t += `M${P(x + sd * 22 * k, by + 6 * k)}L${P(x + sd * 15 * k, by + 2 * k)}`;
    }
    return s + pa(d, cel('#ff4a4a', '#c41f3a'), 2.6) + ln(t, '#ffd21f', 3.2);
  }
  // Dây leo rủ có lá
  function nrsVine(x, len, sw, seed, flower) {
    const r = rng(seed), d = `M${x},-4Q${f1(x + sw)},${f1(len * .5)} ${f1(x - sw * .4)},${len}`;
    let s = tube(d, '#3fa860', 2.6, 1.7), lv = [];
    for (let i = 1; i <= 3; i++) { const t = i / 3.4, yy = len * t, xx = x + sw * 2 * t * (1 - t) - sw * .4 * t * t; lv.push([xx, yy, 11 + r() * 5, i % 2 ? 25 : 155]); }
    s += nrsLeaves(lv, '#5fcf5a', '#2f8a45', 2.2);
    return s + (flower ? nrsHibiscus(x - sw * .4, len + 8, 12, 180, ...flower) : '');
  }
  // Cây dứa rừng (bromeliad) mọc trên cành
  const nrsBromeliad = (x, y, k) => pa([-150, -125, -100, -80, -55, -30].map((a, i) => nrsPetalD(x, y, (20 + (i % 2) * 6) * k, 5 * k, a)).join(''), cel('#5fd06a', '#1f7a45'), 2.4) +
    pa(nrsPetalD(x, y, 14 * k, 4 * k, -90) + nrsPetalD(x, y, 11 * k, 3.5 * k, -115) + nrsPetalD(x, y, 11 * k, 3.5 * k, -65), '#ff4f8a', 2.2);

  SCENES.n_chameleon = () => {
    let s = skyR('#145e4e', '#3fae7a', '#c6f2a8');
    // Tán xa mờ sương
    s += bl([[20, 150, 46], [80, 128, 40], [140, 150, 38], [230, 140, 44], [300, 126, 42], [356, 150, 44]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + '<rect x="-10" y="150" width="380" height="120"/>', '#4fb886', 0);
    s += bl([[50, 196, 36], [120, 186, 30], [190, 200, 34], [262, 184, 32], [330, 198, 36]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + '<rect x="-10" y="196" width="380" height="80"/>', '#68c890', 0);
    // Hoa điểm trên tán xa (đỏ, cam, hồng, vàng)
    const r = rng(17); let fl = ['', '', '', ''];
    for (let i = 0; i < 26; i++) { const x = 10 + r() * 340, y = 112 + r() * 96; fl[i % 4] += nrsCir(x, y, 2.4 + r() * 2.2); }
    s += ['#ff6fb0', '#ffb03a', '#ff4a6a', '#ffe14d'].map((c, i) => pa(fl[i], c, 0, 'opacity=".85"')).join('');
    // Tia nắng xuyên tán
    s += `<g class="aurora" opacity=".9">` + [[230, 26, 150, 80, .18], [286, 18, 236, 70, .14], [176, 14, 90, 56, .1]].map(([x0, w0, x1, w1, op]) => `<path d="M${x0},-4L${x0 + w0},-4L${x1 + w1},270L${x1},270Z" fill="#fffbd0" opacity="${op}"/>`).join('') + `</g>`;
    // Lá ráy lớn hai mép + lá cọ góc trên
    s += nrsMonstera(-6, 120, 90, -20, '#2f9a5a', '#145e3a') + nrsMonstera(-10, 190, 76, 10, '#3fae62', '#1a6a40');
    s += nrsMonstera(366, 104, 88, 200, '#2f9a5a', '#145e3a') + nrsMonstera(370, 178, 72, 170, '#3fae62', '#1a6a40');
    s += nrsLeaves([[-6, -6, 70, 30, .16], [-6, -6, 64, 52, .16], [-6, -6, 56, 10, .16], [366, -6, 70, 150, .16], [366, -6, 64, 128, .16], [366, -6, 58, 170, .16]], '#3fae62', '#1a6a40', 3);
    // Dây leo + hoa rủ từ tán
    s += nrsVine(62, 76, 8, 3, ['#ffb03a', '#e0701a']) + nrsVine(112, 46, -6, 5, ['#ffe14d', '#e0a010']) + nrsVine(250, 58, 7, 7, ['#ff7ab8', '#e0407a']) + nrsVine(300, 92, -8, 9, null);
    s += nrsHeliconia(318, -4, 6, 1) + nrsHeliconia(36, -4, 4, .85);
    // Tầng lá dưới cùng (che khoảng trống dưới cành)
    s += bl([[10, 292, 30], [60, 300, 28], [118, 296, 26], [176, 302, 26], [236, 296, 28], [296, 300, 28], [350, 292, 30]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), cel('#2f8a55', '#145e3a'), 3.5);
    // Cành lớn vắt ngang (bục đứng là đoạn cành phình có rêu)
    s += pa('M-10,250Q90,236 180,246Q270,236 370,248L370,286Q270,276 180,284Q90,276 -10,288Z', cel('#9a5a2e', '#5a3018'), 4);
    s += ln('M10,262Q60,254 110,260M240,258Q300,252 350,262M30,276Q80,270 130,274', '#5a3018', 2.4, 'opacity=".6" stroke-dasharray="16 10"');
    s += `<ellipse cx="180" cy="272" rx="110" ry="17" fill="#000" opacity=".28"/>`;
    s += pa('M80,258Q80,282 180,284Q280,282 280,258Z', cel('#9a5a2e', '#5a3018'), 4);
    s += ln('M100,266Q104,276 110,282M140,270l1,12M220,270l-1,12M258,266l-4,14', '#5a3018', 2.4);
    s += el(180, 258, 100, 16, cel('#6fd86a', '#2f8a45'), 4);
    s += pa('M84,256Q100,246 120,250Q112,258 96,262Z M276,256Q262,246 242,249Q250,258 266,262Z', cel('#9fe87a', '#3f9a4a'), 2.6);
    s += hl(140, 252, 26, 3, 0, .35);
    // Dứa rừng, hoa lan, hoa dâm bụt trên cành
    s += nrsBromeliad(36, 248, 1.1) + nrsBromeliad(330, 250, 1);
    s += nrsHibiscus(102, 254, 10, 10, '#ffb03a', '#e0701a') + nrsHibiscus(262, 253, 10, -20, '#ff7ab8', '#e0407a');
    s += pa(nrsCir(128, 262, 3.2) + nrsCir(136, 264, 2.6) + nrsCir(234, 263, 3) + nrsCir(226, 265, 2.4), '#fff3a0', 1.8);
    // Cánh hoa trôi, phấn sáng
    s += [[70, 150, 20, '#ffb3d6'], [160, 96, -30, '#ffd27a'], [214, 170, 40, '#ffb3d6'], [300, 200, -10, '#ff9a5a'], [130, 200, 60, '#ffd27a']].map(([x, y, a, c], i) => `<g class="drift${i % 2 ? ' d2' : ''}">${pa(`M${x},${y}q5,-6 11,-2q-4,7 -11,2Z`, c, 2, `transform="rotate(${a} ${x} ${y})"`)}</g>`).join('');
    s += fireflies(8, 211, '#fff3a0');
    return s;
  };
  SCENE_NAME.n_chameleon = 'Tán rừng nhiệt đới';

  /* ---------- Lợn Rừng: Bìa rừng suối cổ thụ lúc hoàng hôn ---------- */
  // Cây dương xỉ: gốc (x, y), các lá kép tỏa ra
  function nrsFern(x, y, k, sd = 1) {
    let s = '';
    for (const [a, L] of [[-100, 44], [-130, 38], [-70, 38], [-155, 30], [-45, 30]]) {
      const ang = a * R2, ex = x + Math.cos(ang) * L * k, ey = y + Math.sin(ang) * L * k;
      const d = `M${x},${y}Q${P(x + Math.cos(ang) * L * k * .5 + sd * 4, y + Math.sin(ang) * L * k * .5 - 4)} ${P(ex, ey)}`;
      let fr = '';
      for (let i = 1; i <= 5; i++) { const t = i / 6, px = x + (ex - x) * t, py = y + (ey - y) * t, w = (1 - t) * 9 * k + 2; fr += nrsPetalD(px, py, w, w * .35, a - 60) + nrsPetalD(px, py, w, w * .35, a + 60); }
      s += pa(fr, '#4fae4a', 1.6) + ln(d, '#2f7a3a', 2.2);
    }
    return s;
  }
  // Nấm nhỏ
  const nrsShroom = (x, y, h, cap) => pa(`M${P(x - h * .14, y)}Q${P(x - h * .1, y - h * .5)} ${P(x - h * .07, y - h * .7)}L${P(x + h * .07, y - h * .7)}Q${P(x + h * .1, y - h * .5)} ${P(x + h * .14, y)}Z`, '#fff1d8', 2.4) +
    pa(`M${P(x - h * .5, y - h * .62)}Q${P(x - h * .45, y - h * 1.1)} ${P(x, y - h * 1.1)}Q${P(x + h * .45, y - h * 1.1)} ${P(x + h * .5, y - h * .62)}Q${P(x, y - h * .72)} ${P(x - h * .5, y - h * .62)}Z`, cel(cap, '#8a1f3a'), 2.8) +
    pa(nrsCir(x - h * .2, y - h * .88, h * .07) + nrsCir(x + h * .18, y - h * .95, h * .06), '#fff', 0);
  // Cây cổ thụ khổng lồ bên phải: thân, bướu, hốc, rễ lớn bò xuống đất và vắt qua bục
  function nrsAncientTree() {
    let s = pa('M262,-10L360,-10L372,-10L372,250Q344,236 330,252Q318,232 296,248Q300,226 286,214Q258,226 236,214Q262,196 268,150Q276,90 262,-10Z', cel('#8a5a3a', '#4a2a1c'), 4);
    s += ln('M282,10Q292,80 284,150M306,0Q314,90 304,170M330,20Q340,100 334,200M296,190Q288,206 270,212', '#4a2a1c', 3, 'opacity=".75"');
    // hốc cây sáng
    s += pa('M300,120Q306,96 316,120Q312,138 300,120Z', '#3a1f14', 3) + `<ellipse cx="308" cy="118" rx="14" ry="16" fill="#ffd27a" opacity=".22"/>` + `<ellipse cx="308" cy="122" rx="4" ry="7" fill="#ffd27a" opacity=".5"/>`;
    // rêu
    s += pa('M266,60Q280,52 296,58Q290,70 278,68Q270,72 266,60Z M318,170Q332,160 350,166Q344,178 330,176Q322,182 318,170Z', cel('#6fd06a', '#2f8a45'), 2.6);
    // rễ lớn bò xuống, một rễ vắt qua mép bục
    s += tube('M240,214Q222,226 214,250Q210,262 196,268', '#7a4a2c', 9, 3.5) + tube('M292,246Q300,262 318,274', '#7a4a2c', 10, 3.5) + tube('M248,220Q246,240 256,256', '#7a4a2c', 7, 3);
    // tán lá cổ thụ phía trên
    s += bl([[250, 6, 34], [292, -6, 36], [340, 8, 38], [222, 30, 24], [276, 34, 26], [356, 44, 28]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join(''), cel('#3f9a5a', '#1d5a3a'), 3.5);
    return s;
  }

  SCENES.n_boar = () => {
    let s = skyR('#3a3f9e', '#b85a9a', '#ffc08a');
    // Sao đầu hôm
    s += pa([[24, 20], [62, 46], [104, 16], [150, 40], [190, 14], [36, 84], [214, 62]].map(([x, y], i) => nrsCir(x, y, i % 3 ? 1.4 : 2)).join(''), '#fff6d8', 0, 'class="twinkle"');
    // Mặt trời lặn sau rặng cây
    s += `<circle cx="120" cy="150" r="56" fill="#ffe0a0" opacity=".25"/>` + ci(120, 150, 30, '#ffd88a', 0) + ci(120, 150, 22, '#fff0c0', 0);
    s += pa([[24, 148], [40, 120], [60, 144], [78, 112], [98, 140], [118, 118], [140, 146], [164, 116], [186, 142], [206, 124], [226, 150]].reduce((d, [x, y], i) => d + (i ? 'L' : 'M') + x + ',' + y, '') + 'L240,200L-10,200L-10,150Z', '#4a3f7e', 0);
    s += bl([[-6, 168, 26], [36, 160, 24], [78, 170, 22], [120, 162, 24], [164, 172, 22], [206, 166, 26], [244, 178, 22]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('') + '<rect x="-10" y="168" width="270" height="40"/>', '#3a5a6e', 3);
    // Bãi cỏ
    s += pa('M-10,196Q120,184 250,196Q320,200 370,196L370,310L-10,310Z', cel('#6ab85a', '#3a7a40'), 4);
    // Suối uốn từ xa về góc trái dưới
    s += pa('M150,196Q132,204 112,206Q70,212 64,232Q58,256 10,268L-10,272L-10,300L40,300Q92,286 104,252Q112,226 146,214Q164,206 172,196Z', lin('#bfe8ff', '#6ac0e8', '#3a8ac8'), 3.5);
    s += ln('M128,208q10,-3 18,0M86,226q12,-4 22,0M50,262q14,-6 26,-2M20,280q10,-3 18,0', '#ffffff', 2.6, 'opacity=".85"');
    s += bl('<ellipse cx="72" cy="244" rx="12" ry="6"/><ellipse cx="116" cy="216" rx="8" ry="4"/><ellipse cx="30" cy="290" rx="14" ry="6"/>', cel('#a8a0c0', '#6a6488'), 2.6);
    // Cây cổ thụ
    s += nrsAncientTree();
    // Dương xỉ, nấm, cỏ
    s += nrsFern(20, 214, 1, 1) + nrsFern(232, 206, .8, -1);
    s += nrsShroom(268, 262, 18, '#ff5fa2') + nrsShroom(282, 266, 12, '#ffb21f') + nrsShroom(150, 214, 10, '#ff5fa2');
    s += ln('M330,286l4,-12l3,10M346,290l3,-10l4,9M160,292l4,-10l3,8M184,296l3,-10l4,8', '#3a7a40', 3);
    // Bục: tảng đá suối phẳng có rêu, rễ cây vắt qua
    s += `<ellipse cx="180" cy="272" rx="110" ry="17" fill="#000" opacity=".3"/>`;
    s += pa('M80,258Q80,284 180,286Q280,284 280,258Z', cel('#7a7498', '#4a4466'), 4);
    s += ln('M104,266l6,14M152,272l-4,12M214,272l4,12M254,266l-6,14', '#4a4466', 2.4);
    s += el(180, 258, 100, 16, cel('#b4aecf', '#8a84a8'), 4);
    s += pa('M90,262Q96,248 122,250Q118,258 104,264Z M236,250Q258,246 272,256Q262,264 246,262Z', cel('#7ad06a', '#3a8a45'), 2.6);
    s += tube('M262,250Q246,256 238,268Q232,280 236,290', '#7a4a2c', 6, 3);
    s += hl(140, 252, 26, 3, 0, .35);
    s += pa(nrsCir(118, 258, 2.6) + nrsCir(126, 256, 2.2), '#ffd27a', 1.6);
    // Đom đóm hoàng hôn + lá rơi
    s += fireflies(12, 223, '#ffe27a');
    s += [[60, 120, 20], [200, 90, -30], [330, 150, 50], [150, 60, 70]].map(([x, y, a], i) => `<g class="drift${i % 2 ? ' d2' : ''}">${pa(`M${x},${y}q6,-7 13,-2q-5,8 -13,2Z`, i % 2 ? '#ffb21f' : '#9df27a', 2, `transform="rotate(${a} ${x} ${y})"`)}</g>`).join('');
    return s;
  };
  SCENE_NAME.n_boar = 'Suối bìa rừng cổ thụ';
})();

// ----- Hệ Bóng đêm -----
/* ===================== CẢNH NỀN PET THƯỜNG MỚI · HỆ BÓNG ĐÊM: Bạch Tuộc Bóng Đêm (n_octopus), Nhện Trăng (n_spider) =====================
   Định dạng như js/scenes.js: SCENES.<id>() trả chuỗi SVG nền (viewBox 0 0 360 300, bục đứng tâm 180,258), SCENE_NAME.<id> là tên cảnh.
   Nạp SAU scenes.js (dùng SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, moonR, groundR, platformR) và gfx.js (pa el ci ln hl bl tube P f1 cel lin spark4 OL).
   Hàm phụ nằm trong IIFE (tiền tố ndS); không thêm tên toàn cục nào ngoài SCENES.n_octopus, SCENES.n_spider, SCENE_NAME.n_octopus, SCENE_NAME.n_spider. */
(() => {
  // Quầng sáng tròn nhiều lớp mờ (không blur)
  const ndSGlow = (x, y, r, col, op = .14) => [1, .66, .4].map((k, i) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(r * k)}" fill="${col}" opacity="${f1(op * (1 + i * .5) * 100) / 100}"/>`).join('');
  // Bong bóng nổi lên
  const ndSBubbles = (n, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * SW, y = 60 + r() * 200, rr = 2 + r() * 4; s += `<g class="ember" style="animation-delay:-${f1(r() * 2)}s"><circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(rr)}" fill="#8ff7ff" fill-opacity=".18" stroke="#c8fffb" stroke-width="1.4" opacity=".85"/><circle cx="${f1(x - rr * .35)}" cy="${f1(y - rr * .35)}" r="${f1(rr * .28)}" fill="#fff"/></g>`; } return s; };
  // San hô cành phát sáng: thân ống có viền + chấm sáng ở đầu cành
  function ndSCoral(x, y, k, col, tip, flip = 1) {
    const B = [[0, 0, -4, -34, 2, -58], [-1, -22, -16, -34, -22, -52], [1, -30, 14, -40, 16, -60], [-2, -42, -8, -56, -6, -72], [-14, -38, -26, -44, -30, -38], [10, -36, 22, -38, 28, -30]];
    let d = '';
    B.forEach(([a, b, c1, c2, e1, e2]) => { d += `M${P(x + a * k * flip, y + b * k)} Q${P(x + c1 * k * flip, y + c2 * k)} ${P(x + e1 * k * flip, y + e2 * k)} `; });
    let s = tube(d, col, 7 * k, 3) + ln(d, '#ffffff', 1.6 * k, 'opacity=".35"');
    B.forEach(([, , , , e1, e2], i) => { const tx = x + e1 * k * flip, ty = y + e2 * k; s += `<circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(7.5 * k)}" fill="${tip}" opacity=".28"/><circle cx="${f1(tx)}" cy="${f1(ty)}" r="${f1(3.6 * k)}" fill="${tip}"/>`; });
    return s;
  }
  // Quạt biển: hình quạt có lưới
  function ndSFan(x, y, r, col, line) {
    let s = pa(`M${x},${y} L${f1(x - r)},${f1(y - r * .55)} Q${f1(x - r * .7)},${f1(y - r * 1.2)} ${x},${f1(y - r * 1.15)} Q${f1(x + r * .7)},${f1(y - r * 1.2)} ${f1(x + r)},${f1(y - r * .55)} Z`, col, 3);
    let d = ''; for (let i = -3; i <= 3; i++) d += `M${x},${y} L${f1(x + i * r * .3)},${f1(y - r * (1.05 - Math.abs(i) * .1))} `;
    for (const k of [.45, .75]) d += `M${f1(x - r * k)},${f1(y - r * .5 * k - r * .1)} Q${x},${f1(y - r * 1.1 * k - r * .1)} ${f1(x + r * k)},${f1(y - r * .5 * k - r * .1)} `;
    return s + ln(d, line, 1.4, 'opacity=".75"');
  }
  // Rong biển đung đưa
  const ndSKelp = (x, y, h, col, dl = 0) => `<g class="sway" style="animation-delay:-${dl}s">` + tube(`M${x},${y} C${x - 14},${y - h * .3} ${x + 14},${y - h * .6} ${x - 4},${y - h}`, col, 6, 3) +
    [.3, .55, .8].map((t, i) => pa(`M${f1(x + (i % 2 ? 4 : -4))},${f1(y - h * t)} q${i % 2 ? 14 : -14},-6 ${i % 2 ? 18 : -18},-16 q${i % 2 ? -10 : 10},2 ${i % 2 ? -18 : 18},10 Z`, col, 2.4)).join('') + `</g>`;
  // Sứa nhỏ phát sáng
  const ndSJelly = (x, y, k, col, dl = 0) => `<g class="float" style="animation-delay:-${dl}s">` + `<circle cx="${x}" cy="${y}" r="${f1(16 * k)}" fill="${col}" opacity=".16"/>` +
    ln(`M${f1(x - 6 * k)},${f1(y + 2 * k)} q-3,${f1(8 * k)} 1,${f1(16 * k)} M${x},${f1(y + 3 * k)} q3,${f1(8 * k)} -1,${f1(18 * k)} M${f1(x + 6 * k)},${f1(y + 2 * k)} q-2,${f1(8 * k)} 2,${f1(14 * k)}`, col, 1.8, 'opacity=".85"') +
    pa(`M${f1(x - 11 * k)},${f1(y + 3 * k)} Q${f1(x - 11 * k)},${f1(y - 10 * k)} ${x},${f1(y - 10 * k)} Q${f1(x + 11 * k)},${f1(y - 10 * k)} ${f1(x + 11 * k)},${f1(y + 3 * k)} Q${x},${f1(y)} ${f1(x - 11 * k)},${f1(y + 3 * k)} Z`, col, 2.4, 'fill-opacity=".75"') + hl(x - 4 * k, y - 5 * k, 3 * k, 1.6 * k, -25, .7) + `</g>`;
  // Sao biển
  const ndSStar = (x, y, r, col, rot = 0) => pa(starPath(x, y, r, r * .45, 5, -90 + rot), cel(col, '#c2387a'), 2.4) + ci(x, y, r * .14, '#fff', 0, 'opacity=".7"');

  // Rạn san hô đêm: đáy biển tím than, trăng xuyên mặt nước, san hô và quạt biển phát sáng, rong đung đưa, sứa, bong bóng
  SCENES.n_octopus = () => {
    let s = skyR('#2b3a9e', '#1c1a70', '#120c46');
    // mặt nước, trăng nhòe và tia sáng xiên
    s += ndSGlow(276, 14, 60, '#bff8ff', .1) + `<ellipse cx="276" cy="12" rx="34" ry="12" fill="#fff4c2" opacity=".55"/>` + pa('M-10,0 H370 V20 Q330,30 290,22 Q250,14 210,24 Q170,34 130,24 Q90,14 50,24 Q20,30 -10,22 Z', '#4a6ad0', 0, 'opacity=".55"');
    s += ln('M-10,22 Q20,30 50,24 Q90,14 130,24 Q170,34 210,24 Q250,14 290,22 Q330,30 370,20', '#bff8ff', 2.2, 'opacity=".6"');
    s += `<g opacity=".08" fill="#dffcff">${[[230, 60], [276, 74], [316, 52]].map(([x, w]) => `<path d="M${x - 14},20 L${x + 14},20 L${x - 60 + w},300 L${x - 120 + w},300 Z"/>`).join('')}</g>`;
    s += starsR(10, 401, 18, '#ffffff');
    // rạn xa
    s += pa('M-10,214 Q20,170 50,182 Q70,150 104,176 Q130,160 150,190 L210,196 Q240,156 274,176 Q300,150 330,170 Q352,160 370,172 L370,240 L-10,240 Z', '#241a6a', 3.5);
    s += ndSFan(304, 196, 30, '#3a2a8e', '#8a7cff') + ndSFan(62, 192, 24, '#3a2a8e', '#8a7cff');
    s += ndSJelly(56, 92, 1, '#ff9af0', .3) + ndSJelly(312, 118, .75, '#8ff7ff', 1.1) + ndSJelly(116, 56, .55, '#c8a8ff', .7);
    // đáy cát
    s += groundR(226, '#2c2276') + ln('M10,250 q30,-6 60,0 M220,262 q30,-6 60,0 M280,240 q24,-5 48,0 M30,276 q26,-5 52,0', '#5a4ab8', 2.4, 'opacity=".8"');
    // san hô, rong, sao biển phía trước
    s += ndSKelp(18, 262, 120, '#2fa88a', 0) + ndSKelp(338, 266, 132, '#2fa88a', 1.2) + ndSKelp(354, 268, 90, '#23806e', .6);
    s += ndSCoral(48, 262, 1.15, '#ff6ae6', '#ffd6fb') + ndSCoral(312, 258, 1, '#4ff0ff', '#e6ffff', -1) + ndSCoral(92, 248, .62, '#ffb21f', '#fff3a0', -1) + ndSCoral(270, 246, .6, '#b46bff', '#f0d8ff');
    s += ndSStar(28, 284, 9, '#ff7ab8', 12) + ndSStar(336, 286, 7, '#ffb21f', -20);
    s += pa('M244,280 q8,-12 18,0 q-9,4 -18,0 Z', cel('#ffe6f6', '#c99ad6'), 2.4) + ci(253, 276, 3, '#ffffff', 1.6);
    s += ndSBubbles(12, 409);
    s += platformR('#6a4ac8', '#33228c', ln('M98,258 A82,12 0 0 0 262,258 A82,12 0 0 0 98,258', '#ff9af0', 2, 'opacity=".75" stroke-dasharray="3 7"') +
      ci(116, 256, 5, cel('#ffffff', '#c8c4f0'), 2.2) + hl(114.5, 254.5, 1.6, 1, -30, .9) + ndSStar(246, 258, 6.5, '#ff7ab8', 8));
    return s;
  };
  SCENE_NAME.n_octopus = 'Rạn san hô đêm';

  // Mạng tơ góc: các nan từ góc (x, y) quạt ra, tơ võng giữa các nan, giọt sương phát sáng
  function ndSWeb(x, y, R, a0, a1, n, rings, seed) {
    const pt = (a, r) => [x + r * Math.cos(a * Math.PI / 180), y + r * Math.sin(a * Math.PI / 180)];
    let d = '';
    for (let i = 0; i < n; i++) { const q = pt(a0 + (a1 - a0) * i / (n - 1), R); d += `M${x},${y} L${P(q[0], q[1])} `; }
    rings.forEach(rr => { for (let i = 0; i < n - 1; i++) { const q1 = pt(a0 + (a1 - a0) * i / (n - 1), R * rr), q2 = pt(a0 + (a1 - a0) * (i + 1) / (n - 1), R * rr), m = pt(a0 + (a1 - a0) * (i + .5) / (n - 1), R * rr * .86); d += `${i ? '' : `M${P(q1[0], q1[1])} `}Q${P(m[0], m[1])} ${P(q2[0], q2[1])} `; } });
    let s = `<path d="${d}" fill="none" stroke="${OL}" stroke-width="3" opacity=".45"/><path d="${d}" fill="none" stroke="#dfe8ff" stroke-width="1.4" opacity=".85"/>`;
    const r = rng(seed);
    for (let i = 0; i < 7; i++) { const q = pt(a0 + (a1 - a0) * Math.floor(r() * n) / (n - 1), R * rings[Math.floor(r() * rings.length)]); s += `<circle cx="${f1(q[0])}" cy="${f1(q[1])}" r="5" fill="#9ff3ff" opacity=".25"/>` + ci(q[0], q[1], 2.2, '#c8fbff', 1.2) + `<circle cx="${f1(q[0] - .7)}" cy="${f1(q[1] - .7)}" r=".8" fill="#fff"/>`; }
    return s;
  }
  // Nấm nhỏ phát sáng
  const ndSShroom = (x, y, h, col) => `<circle cx="${x}" cy="${f1(y - h * .8)}" r="${f1(h * .9)}" fill="${col}" opacity=".18"/>` + pa(`M${f1(x - h * .12)},${y} Q${f1(x - h * .1)},${f1(y - h * .5)} ${f1(x - h * .06)},${f1(y - h * .66)} L${f1(x + h * .06)},${f1(y - h * .66)} Q${f1(x + h * .1)},${f1(y - h * .5)} ${f1(x + h * .12)},${y} Z`, '#e6e1ff', 2.4) +
    pa(`M${f1(x - h * .5)},${f1(y - h * .6)} Q${f1(x - h * .45)},${f1(y - h * 1.08)} ${x},${f1(y - h * 1.08)} Q${f1(x + h * .45)},${f1(y - h * 1.08)} ${f1(x + h * .5)},${f1(y - h * .6)} Q${x},${f1(y - h * .7)} ${f1(x - h * .5)},${f1(y - h * .6)} Z`, cel(col, '#5a2ab0'), 2.6) + ci(x - h * .18, y - h * .86, h * .07, '#fff', 0) + ci(x + h * .16, y - h * .92, h * .06, '#fff', 0);
  // Cỏ cao mảnh
  const ndSGrass = (x, y, h, col, n = 5, seed = 1) => { const r = rng(seed); let d = ''; for (let i = 0; i < n; i++) { const dx = (i - n / 2) * 4, hh = h * (.6 + r() * .4), lean = (r() - .5) * 20; d += `M${f1(x + dx)},${y} Q${f1(x + dx + lean * .3)},${f1(y - hh * .6)} ${f1(x + dx + lean)},${f1(y - hh)} `; } return tube(d, col, 3, 2.4); };

  // Vườn tơ đọng sương: trăng tròn lớn, cành cây cổ uốn khung, mạng tơ đọng sương phát sáng, nấm sáng, đom đóm, sương mù
  SCENES.n_spider = () => {
    let s = skyR('#0c0832', '#22186c', '#40308f') + starsR(16, 503, 150);
    // trăng tròn lớn góc trái, mạng tơ giăng ngang trước trăng
    s += ndSGlow(84, 74, 88, '#e6e1ff', .08) + ci(84, 74, 42, cel('#fbf9ff', '#d4cff4'), 3.5) + el(70, 62, 9, 7, '#e2ddf8', 0) + el(98, 90, 11, 8, '#e2ddf8', 0) + el(98, 56, 5, 4, '#e2ddf8', 0) + el(66, 92, 5, 4, '#e2ddf8', 0) + hl(66, 48, 10, 5, -35, .6);
    // đồi xa và sương
    s += pa('M-10,206 Q60,170 130,192 Q200,166 270,188 Q320,170 370,184 L370,240 L-10,240 Z', '#2a2070', 3.5);
    s += `<path d="M-10,214 Q90,198 180,210 Q270,222 370,204 L370,232 Q270,244 180,232 Q90,222 -10,236 Z" fill="#cfc8ff" opacity=".16"/>`;
    // cây cổ bên phải, cành vươn ngang trời sang trái; cành thấp bên trái
    s += pa('M370,250 L370,40 Q350,30 336,40 Q326,70 330,110 Q332,150 320,200 Q314,232 300,250 Z', cel('#3a2c86', '#1e1452'), 4);
    s += tube('M338,64 Q290,40 236,46 Q190,50 150,22 Q120,6 96,-4 M290,48 Q274,28 278,10 M236,46 Q222,62 226,80', '#33267a', 11, 3.5);
    s += tube('M-10,150 Q30,140 60,154 Q78,162 90,180 M42,146 Q54,124 48,108', '#33267a', 10, 3.5);
    s += ln('M344,90 q-8,14 -2,30 M330,150 q8,16 0,32', '#4a3aa0', 3, 'opacity=".8"');
    // mạng tơ: giăng từ cành xuống trước mặt trăng; mạng nhỏ bên trái dưới; giọt sương
    s += ndSWeb(150, 20, 112, 96, 172, 7, [.3, .52, .74, .96], 511) + ndSWeb(8, 160, 66, -80, 10, 5, [.4, .7, 1], 517);
    s += ln('M226,80 L226,128', '#dfe8ff', 1.2, 'opacity=".7"') + `<g class="float"><circle cx="226" cy="130" r="5" fill="#9ff3ff" opacity=".25"/>${ci(226, 130, 2.6, '#c8fbff', 1.4)}</g>`;
    // mặt đất rêu, cỏ, nấm sáng, đom đóm
    s += groundR(228, '#241a62');
    s += ndSGrass(70, 236, 34, '#3f6e8a', 6, 521) + ndSGrass(300, 238, 40, '#3f6e8a', 7, 523) + ndSGrass(20, 262, 30, '#4a7e96', 5, 527) + ndSGrass(342, 266, 34, '#4a7e96', 6, 529);
    s += ndSWeb(290, 236, 26, 200, 300, 5, [.5, 1], 531).replace(/r="5"/g, 'r="3.6"');
    s += ndSShroom(48, 274, 22, '#8ff7ff') + ndSShroom(66, 278, 14, '#ff9af0') + ndSShroom(318, 280, 18, '#b46bff') + ndSShroom(102, 246, 11, '#8ff7ff');
    s += fireflies(10, 541, '#ffe680');
    s += platformR('#5a4ab8', '#2c2282', ln('M110,256 Q150,250 180,256 T250,256 M128,262 Q160,258 190,262', '#7fe0a0', 2.4, 'opacity=".6"') +
      ndSWeb(244, 254, 18, 190, 280, 4, [.55, 1], 543).replace(/r="5"/g, 'r="3"') + ndSShroom(128, 258, 12, '#ff9af0'));
    return s;
  };
  SCENE_NAME.n_spider = 'Vườn tơ đọng sương';
})();

// ----- Hệ Thép -----
/* ===================== CẢNH NỀN · hệ Thép: Cá Mập Máy (n_shark), Bọ Ngựa Thép (n_mantis) ===================== */
// Cần: gfx.js (pa, el, ci, ln, hl, bl, tube, P, f1, cel, lin, spark4, rivet, OL) và scenes.js (SCENES, SCENE_NAME, SW, SH, rng, skyR, starsR, platformR).
// Nạp sau scenes.js. Hàm phụ nằm trong IIFE, tiền tố ntS; không thêm tên toàn cục ngoài SCENES/SCENE_NAME.n_shark, .n_mantis.
// viewBox 0 0 360 300, bục đứng tâm (180, 258) như platformR.
(() => {
  const NEON = '#33e1ff', RED = '#ff2e4a';
  const ntSNeon = (d, col = NEON, w = 3) => ln(d, col, w + 7, 'opacity=".25"') + ln(d, OL, w + 3.5) + ln(d, col, w) + ln(d, '#fff', f1(Math.max(1, w * .35)), 'opacity=".8"');
  const ntSRect = (x, y, w, h, r, fill, sw = 3, ex = '') => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(r)}" fill="${fill}" stroke="${sw ? OL : 'none'}" stroke-width="${sw}" ${ex}/>`;

  /* ---------- Cá Mập Máy: xưởng tàu ngầm neon dưới đáy biển ---------- */
  // Bong bóng bay lên
  const ntSBubbles = (n, seed) => { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * SW, y = 60 + r() * 200, rr = 1.8 + r() * 3.2; s += `<g class="ember" style="animation-delay:-${f1(r() * 3)}s">${ci(x, y, rr, '#bff4ff', 1.4, 'opacity=".75"')}<circle cx="${f1(x - rr * .35)}" cy="${f1(y - rr * .35)}" r="${f1(rr * .3)}" fill="#fff"/></g>`; } return s; };
  // Rong biển kim loại uốn lượn
  const ntSKelp = (x, y, h, sd, col = '#1f8a8a') => `<g class="sway" style="animation-delay:-${f1(x % 5 / 2)}s">` + pa(`M${x - 5},${y} C${x - 14 * sd},${y - h * .3} ${x + 12 * sd},${y - h * .55} ${x - 4 * sd},${y - h * .8} C${x - 10 * sd},${y - h * .9} ${x - 2 * sd},${y - h} ${x + 6 * sd},${y - h} C${x + 4 * sd},${y - h * .85} ${x + 18 * sd},${y - h * .6} ${x + 8 * sd},${y - h * .3} C${x + 2 * sd},${y - h * .15} ${x + 8},${y - 4} ${x + 6},${y} Z`, cel(col, '#0f4f5a'), 3) + `</g>`;
  // Cá nhỏ bơi xa (bóng)
  const ntSFish = (x, y, k, col = '#0d3a74') => `<path d="M${x},${y} q${f1(8 * k)},${f1(-6 * k)} ${f1(16 * k)},0 q${f1(-8 * k)},${f1(6 * k)} ${f1(-16 * k)},0 Z M${f1(x + 15 * k)},${y} l${f1(6 * k)},${f1(-5 * k)} v${f1(10 * k)} Z" fill="${col}"/>`;
  // Tàu ngầm đậu ở ụ: thân tròn, tháp, cửa sổ tròn sáng
  function ntSSub(x, y) {
    let s = pa(`M${x - 92},${y} C${x - 92},${y - 34} ${x - 60},${y - 46} ${x - 10},${y - 46} L${x + 50},${y - 46} C${x + 80},${y - 46} ${x + 96},${y - 26} ${x + 96},${y} C${x + 96},${y + 26} ${x + 80},${y + 40} ${x + 50},${y + 40} L${x - 10},${y + 40} C${x - 60},${y + 40} ${x - 92},${y + 30} ${x - 92},${y} Z`, cel('#7d9ccf', '#46689e'), 4);
    s += pa(`M${x - 6},${y - 46} L${x - 2},${y - 74} L${x + 40},${y - 74} L${x + 48},${y - 46} Z`, cel('#7d9ccf', '#46689e'), 4) + tube(`M${x + 14},${y - 74} V${y - 96} H${x + 28}`, '#7d90b3', 3, 2.5);
    s += ln(`M${x - 88},${y + 6} H${x + 94}`, '#ff8a1f', 4) + ln(`M${x - 88},${y + 6} H${x + 94}`, OL, 1.2, 'opacity=".5"');
    s += [-60, -30, 0, 30, 60].map(dx => ci(x + dx, y - 14, 8, '#0b2a5e', 3) + ci(x + dx, y - 14, 5, NEON, 0, 'opacity=".9"') + ci(x + dx - 1.6, y - 15.6, 1.6, '#fff', 0)).join('');
    s += [-70, -40, -10, 20, 50, 80].map(dx => rivet(x + dx, y + 22, 2)).join('') + hl(x - 50, y - 32, 22, 4, -6, .3);
    return s;
  }
  // Cần cẩu treo móc
  function ntSCrane(x) {
    let s = pa(`M${x - 6},0 H${x + 6} V96 H${x - 6} Z`, cel('#56698c', '#2a3a5e'), 3) + ln(`M${x - 6},12 L${x + 6},28 M${x - 6},44 L${x + 6},60 M${x - 6},76 L${x + 6},92`, '#2a3a5e', 2);
    s += pa(`M${x - 74},84 H${x + 10} V96 H${x - 74} Z`, cel('#ffd21f', '#d99500'), 3) + ln(`M${x - 66},84 l8,12 M${x - 50},84 l8,12 M${x - 34},84 l8,12 M${x - 18},84 l8,12`, OL, 3);
    s += `<g class="swing" style="transform-origin:${x - 56}px 96px">` + ln(`M${x - 56},96 V150`, OL, 2.5) + pa(`M${x - 62},150 h12 v8 h-12 Z`, '#7d90b3', 2.5) + tube(`M${x - 56},158 v10 a8,8 0 1 1 -10,6`, '#c9d4e6', 3, 2.5) + `</g>`;
    return s;
  }
  SCENES.n_shark = () => {
    let s = skyR('#1a7fbf', '#0d4a8e', '#0a2558');
    // tia sáng từ mặt nước
    s += `<g opacity=".1">` + [[40, 30], [120, 44], [210, 36], [290, 50]].map(([x, w]) => `<path d="M${x},0 L${x + w},0 L${x + w * 2.4 - 30},300 L${x - 40},300 Z" fill="#fff"/>`).join('') + `</g>`;
    s += ln('M0,10 Q30,4 60,10 T120,10 T180,10 T240,10 T300,10 T360,10', '#bff4ff', 2, 'opacity=".4"');
    s += ntSFish(70, 70, 1.1) + `<g class="drift">${ntSFish(250, 58, .9)}${ntSFish(272, 70, .7)}</g>`;
    // vòm ụ tàu phía sau, viền neon
    s += pa('M60,232 L60,120 Q60,52 180,48 Q300,52 300,120 L300,232 Z', '#0b2f66', 4) + pa('M86,232 L86,126 Q86,76 180,72 Q274,76 274,126 L274,232 Z', lin('#061a44', '#0b2f66'), 3.5);
    s += `<g class="drift d2" opacity=".55">` + pa('M112,128 Q150,110 196,116 L214,100 L216,118 Q236,120 250,126 L268,112 L262,132 L268,152 L250,138 Q220,150 180,146 Q140,146 112,128 Z', '#0d3f80', 0) + `</g>`;
    s += ntSNeon('M74,232 L74,124 Q74,64 180,60 Q286,64 286,124 L286,232', NEON, 2.4);
    s += [100, 130, 160, 200, 230, 260].map((x, i) => ci(x, 78 + Math.abs(180 - x) * .28, 3, i % 2 ? '#ffd21f' : RED, 1.6, `class="blink" style="animation-delay:-${i * .3}s"`)).join('');
    // biển hiệu neon: vây cá mập + số 25
    s += ntSRect(150, 20, 60, 30, 8, '#08183e', 3.5) + `<g class="blink-slow">` + pa('M160,42 Q170,24 186,22 Q178,32 182,42 Z', 'none', 0) + ntSNeon('M160,42 Q170,26 184,24 Q177,33 181,42', NEON, 2) +
      `<text x="198" y="43" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="18" fill="#ff4fd8" stroke="#ffd6fb" stroke-width=".8">25</text></g>`;
    // tàu ngầm đậu bên trái, cần cẩu bên phải
    s += ntSSub(64, 176);
    s += ntSCrane(330);
    // ống dẫn và van bên phải
    s += tube('M300,232 V176 H360', '#7d90b3', 8, 3) + tube('M300,206 H360', '#ff8a1f', 6, 3) + ci(300, 176, 7, '#c9d4e6', 3) + ci(330, 206, 8, RED, 3) + ln('M324,206 h12 M330,200 v12', '#fff', 2.4);
    // sàn thép lưới và mép sọc cảnh báo
    s += pa('M-10,226 H370 V310 H-10 Z', lin('#2a3a6e', '#141f44'), 4);
    s += pa('M-10,226 H370 V236 H-10 Z', '#ffd21f', 3) + `<path d="${Array.from({ length: 20 }, (_, i) => `M${i * 20 - 6},226 l10,0 l-6,10 l-10,0 Z`).join(' ')}" fill="${OL}"/>`;
    s += ln(Array.from({ length: 9 }, (_, i) => `M${i * 45},236 L${i * 45 - 30 + i * 8},300`).join(' ') + ' M-10,262 H370 M-10,286 H370', '#3a4c86', 2.4);
    s += ntSKelp(14, 240, 120, 1) + ntSKelp(34, 244, 84, -1, '#2aa88a') + ntSKelp(344, 242, 110, -1) + ntSKelp(322, 246, 70, 1, '#2aa88a');
    s += ntSBubbles(16, 37);
    // bục: nắp cửa ụ tàu tròn, vòng sọc cảnh báo, đèn xanh
    const deco = `<ellipse cx="180" cy="258" rx="78" ry="11.5" fill="none" stroke="${OL}" stroke-width="9"/><ellipse cx="180" cy="258" rx="78" ry="11.5" fill="none" stroke="#ffd21f" stroke-width="5" stroke-dasharray="10 8"/>` +
      el(180, 258, 46, 7, cel('#56698c', '#3d4c70'), 3) + ln('M150,258 H210 M180,252 V264', '#2a3a5e', 2.4) + ci(180, 258, 5, NEON, 2) +
      [[94, 258], [266, 258], [138, 269], [222, 269]].map(([x, y], i) => ci(x, y, 3.4, NEON, 1.8, `class="blink" style="animation-delay:-${i * .25}s"`)).join('');
    return s + platformR(cel('#c9d4e6', '#8ea3c8'), '#3d4c70', deco);
  };
  SCENE_NAME.n_shark = 'Xưởng tàu ngầm đáy biển';

  /* ---------- Bọ Ngựa Thép: võ đường đèn lồng neon ---------- */
  // Đèn lồng tròn kiểu Hội An, viền neon, đung đưa
  function ntSLantern(x, y, len, r, col, d = 0) {
    const cy = y + len + r;
    let s = ln(`M${x},${y} V${y + len}`, OL, 2);
    s += `<circle cx="${x}" cy="${f1(cy)}" r="${f1(r * 1.9)}" fill="${col}" opacity=".18"/>`;
    s += ntSRect(x - r * .45, y + len - 3, r * .9, 5, 1.5, '#ffd21f', 2);
    s += el(x, cy, r, r * 1.08, col, 3) + ln(`M${f1(x - r * .45)},${f1(cy - r)} Q${f1(x - r * .7)},${f1(cy)} ${f1(x - r * .45)},${f1(cy + r)} M${x},${f1(cy - r * 1.05)} V${f1(cy + r * 1.05)} M${f1(x + r * .45)},${f1(cy - r)} Q${f1(x + r * .7)},${f1(cy)} ${f1(x + r * .45)},${f1(cy + r)}`, OL, 1.6, 'opacity=".45"');
    s += el(x - r * .3, cy - r * .35, r * .22, r * .34, '#fff', 0, 'opacity=".55"');
    s += ntSRect(x - r * .45, cy + r - 1, r * .9, 5, 1.5, '#ffd21f', 2) + ln(`M${x},${f1(cy + r + 4)} v${f1(r * .8)}`, col, 2.4);
    return `<g class="swing" style="transform-origin:${x}px ${y}px;animation-delay:-${f1(d)}s">${s}</g>`;
  }
  // Mái cong đầu đao vểnh: tâm x, mép dưới y, nửa rộng w, cao h
  const ntSRoof = (x, y, w, h) => `M${f1(x - w)},${f1(y - 3)} Q${f1(x - w * .7)},${f1(y)} ${f1(x - w * .5)},${f1(y - h)} L${f1(x + w * .5)},${f1(y - h)} Q${f1(x + w * .7)},${f1(y)} ${f1(x + w)},${f1(y - 3)} Q${x},${f1(y + 3)} ${f1(x - w)},${f1(y - 3)} Z`;
  // Tháp chùa nhiều tầng (bóng xa)
  function ntSPagoda(x, y, n, w, col) {
    let d = '';
    for (let i = 0; i < n; i++) { const yy = y - i * 20, ww = w * (1 - i * .16); d += `M${f1(x - ww * .38)},${yy} V${yy - 12} H${f1(x + ww * .38)} V${yy} Z ` + ntSRoof(x, yy - 10, ww * .62, 9) + ' '; }
    return `<path d="${d}M${x - 1.5},${y - n * 20 - 2} V${y - n * 20 - 14} h3 V${y - n * 20 - 2} Z" fill="${col}"/>`;
  }
  // Cánh hoa thép rơi
  const ntSPetals = (n, seed) => { const r = rng(seed); let s = '<g class="snow">'; for (let i = 0; i < n; i++) { const x = r() * SW, y = r() * 240, a = r() * 180; s += `<path d="M${f1(x)},${f1(y - 4)} Q${f1(x + 3.5)},${f1(y)} ${f1(x)},${f1(y + 4)} Q${f1(x - 3.5)},${f1(y)} ${f1(x)},${f1(y - 4)} Z" fill="${i % 3 ? '#ff9ec4' : '#e6edf7'}" opacity=".85" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})"/>`; } return s + '</g>'; };
  SCENES.n_mantis = () => {
    let s = skyR('#140a3e', '#2a1260', '#4a1a6e');
    // tường gỗ tối hai bên, khung song cửa neon
    s += pa('M-10,0 H370 V232 H-10 Z', lin('#2a1236', '#3a1a3e'), 0);
    for (const x0 of [0, 268]) {
      s += ntSRect(x0 + 8, 54, 84, 150, 4, '#1d0c2e', 3) + ln(Array.from({ length: 4 }, (_, i) => `M${x0 + 8 + 21 * (i + 1)},56 V202`).join(' ') + ' ' + Array.from({ length: 5 }, (_, i) => `M${x0 + 10},${54 + 25 * (i + 1)} H${x0 + 90}`).join(' '), '#ff4fd8', 1.6, 'opacity=".55"');
      s += `<rect x="${x0 + 10}" y="56" width="80" height="146" fill="#ff4fd8" opacity=".06"/>`;
    }
    // cửa trăng tròn giữa: bầu trời đêm, trăng, mái chùa xa
    s += `<circle cx="180" cy="118" r="92" fill="#ff2e4a" opacity=".1"/>` + ci(180, 118, 82, lin('#1a0f4a', '#4a1a7a', '#8a2a7a'), 0);
    { const r = rng(101); for (let i = 0; i < 16; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 74; s += `<circle${i % 3 ? '' : ' class="twinkle"'} cx="${f1(180 + d * Math.cos(a))}" cy="${f1(118 + d * Math.sin(a))}" r="${f1(.8 + r() * 1.4)}" fill="#fff" opacity=".85"/>`; } }
    s += `<circle cx="206" cy="92" r="40" fill="#ffd6e6" opacity=".18"/>` + ci(206, 92, 28, '#ffe6f0', 3) + ci(196, 84, 4, '#f6c4d8', 0) + ci(216, 100, 3, '#f6c4d8', 0);
    s += pa('M98,170 Q120,146 140,158 Q160,140 180,152 Q204,136 226,154 Q246,146 262,170 L262,200 L98,200 Z', '#2a1258', 0);
    s += ntSPagoda(146, 186, 3, 40, '#1d0c3e') + ntSPagoda(222, 190, 2, 34, '#1d0c3e') + pa('M100,186 Q180,176 260,186 L260,200 L100,200 Z', '#1d0c3e', 0);
    s += [[143, 170], [143, 150], [219, 174], [150, 182]].map(([x, y]) => `<rect x="${x}" y="${y}" width="6" height="6" fill="#ffd21f" opacity=".85"/>`).join('');
    s += `<circle cx="180" cy="118" r="82" fill="none" stroke="${OL}" stroke-width="16"/><circle cx="180" cy="118" r="82" fill="none" stroke="#5a2a3a" stroke-width="10"/>` + ntSNeon('M98,118 A82,82 0 1 1 262,118 A82,82 0 1 1 98,118', RED, 2.2);
    // xà mái trên cùng, đầu đao cong
    s += pa('M-10,0 H370 V30 H-10 Z', cel('#5a2a3a', '#3a1626'), 3.5) + ln('M-10,24 H370', '#ffd21f', 2.2) + [0, 360].map(x => pa(`M${x - 30},28 H${x + 30} L${x + 18},44 H${x - 18} Z`, '#3a1626', 3)).join('');
    s += [40, 110, 250, 320].map(x => rivet(x, 14, 2.6)).join('');
    // cờ dọc: biểu tượng lưỡi càng bọ ngựa
    for (const [x, c] of [[46, '#c42a3a'], [314, '#c42a3a']]) {
      s += pa(`M${x - 16},60 H${x + 16} V170 L${x},160 L${x - 16},170 Z`, cel(c, '#7a1428'), 3) + tube(`M${x - 22},58 H${x + 22}`, '#ffd21f', 3, 2.5);
      s += pa(`M${x - 12},92 Q${x},86 ${x + 12},92 L${x + 2},112 Q${x},114 ${x - 2},112 Z`, '#ffd21f', 2) + ci(x - 9, 92, 4.2, '#3fe06a', 1.8) + ci(x + 9, 92, 4.2, '#3fe06a', 1.8) + ln(`M${x - 3},88 Q${x - 6},78 ${x - 12},74 M${x + 3},88 Q${x + 6},78 ${x + 12},74`, '#ffd21f', 1.8);
      s += pa(`M${x - 10},146 L${x + 10},126 M${x + 10},146 L${x - 10},126`, 'none', 0) + ln(`M${x - 10},146 L${x + 10},124 M${x + 10},146 L${x - 10},124`, OL, 5.5) + ln(`M${x - 10},146 L${x + 10},124 M${x + 10},146 L${x - 10},124`, '#ff9ec4', 2.4);
    }
    // đèn lồng neon treo
    s += ntSLantern(72, 30, 26, 12, '#ff2e4a', 0) + ntSLantern(128, 30, 44, 10, '#33e1ff', .6) + ntSLantern(232, 30, 40, 10, '#ffd21f', 1.1) + ntSLantern(290, 30, 22, 12, '#ff4fd8', .3) + ntSLantern(180, 30, 4, 8, '#ff2e4a', .9);
    // sàn gỗ bóng
    s += pa('M-10,222 H370 V310 H-10 Z', lin('#6a3236', '#3a1a28'), 4) + ln('M-10,248 H370 M-10,276 H370', '#2a1020', 2.4) + ln('M60,222 L40,248 M150,222 L146,248 M240,222 L248,248 M320,222 L338,248 M20,248 L6,276 M110,248 L104,276 M200,248 L204,276 M290,248 L300,276', '#2a1020', 2);
    s += `<rect x="-10" y="222" width="380" height="5" fill="#ff4fd8" opacity=".35"/>` + `<ellipse cx="180" cy="240" rx="120" ry="10" fill="#ff2e4a" opacity=".12"/>`;
    s += ntSPetals(16, 211);
    // bục: chiếu tròn gỗ, viền vàng, vạch neon đỏ
    const deco = `<ellipse cx="180" cy="258" rx="84" ry="12.6" fill="none" stroke="#ffd21f" stroke-width="2.5"/>` + ntSNeon('M110,258 A70,10.5 0 0 0 250,258', RED, 1.8) +
      el(180, 258, 26, 4.2, 'none', 0, 'stroke="#ffd21f" stroke-width="1.6" stroke-dasharray="4 4"');
    return s + platformR(cel('#8a3440', '#5a1e2a'), '#3a1220', deco);
  };
  SCENE_NAME.n_mantis = 'Võ đường đèn lồng neon';
})();
/* ---------- HẾT CẢNH PET MỚI BẢN 5 ---------- */

/* ----- Cảnh tạm cho pet thường chưa có cảnh riêng: mượn cảnh của một con cùng hệ ----- */
(function () {
  const BORROW = {};
  ECON.pets.forEach(([id, el]) => { if (SCENES[id] && !BORROW[el]) BORROW[el] = id; });
  ECON.pets.forEach(([id, el]) => {
    if (!SCENES[id] && BORROW[el]) SCENES[id] = SCENES[BORROW[el]];
    if (!SCENE_NAME[id]) SCENE_NAME[id] = SCENE_NAME[BORROW[el]] || 'Trại pet';
  });
})();
