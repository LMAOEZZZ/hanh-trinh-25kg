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
