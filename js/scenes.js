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
