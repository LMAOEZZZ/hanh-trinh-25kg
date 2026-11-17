/* ===================== TRẠI CHUNG, TRỨNG, HUY HIỆU, ICON ĐIỀU HƯỚNG ===================== */
/* ---------- Trứng ---------- */
function eggInner() {
  return `<ellipse cx="100" cy="189" rx="46" ry="8" fill="#000" opacity=".3"/><g class="egg">` +
    pa('M100,40 C140,40 156,110 152,140 C148,174 126,188 100,188 C74,188 52,174 48,140 C44,110 60,40 100,40 Z', 'url(#gEgg)', 5.5) +
    el(80, 96, 11, 8, '#ff8a1f', 0) + el(120, 130, 14, 10, '#ff8a1f', 0) + el(90, 158, 9, 6, '#ff8a1f', 0) + el(125, 86, 6, 5, '#ff8a1f', 0) + el(66, 132, 6, 8, '#ff8a1f', 0) +
    ln('M66,116 L80,108 L88,120 L100,110 L110,122 L124,112 L136,120', OL, 3.5) + hl(80, 64, 12, 6) + `</g>`;
}
const eggSVG = (cls = '') => `<svg class="pet-svg ${cls}" viewBox="0 0 200 200" overflow="visible" aria-hidden="true">${eggInner()}</svg>`;

/* ---------- Trại chung (bản 5): dải trại cuộn ngang = Cổng trại + 7 khu theo hệ ----------
   Cổng trại (rộng 400) giữ đồ trang trí và ổ trứng; mỗi khu hệ (rộng 270) có cảnh riêng, 6 chỗ đứng cho 6 pet thường của hệ,
   pet Sử thi của hệ bay trên mây vàng ở giữa trời. Núi xa và đồi chạy liền một mạch qua mọi khu (vẽ theo tọa độ X toàn dải).
   Nền của mọi khu dựng ngay (nhẹ); pet chỉ dựng khi khu sắp hiện ra trong khung cuộn (IntersectionObserver), khu khuất thì dừng chuyển động. */
const CAMP_H = 260, PLAZA_W = 400, ZONE_W = 270;
const ZONE_ELS = Object.keys(ELEMENTS); // fire, ice, thunder, stone, forest, shadow, metal
const zoneX0 = k => PLAZA_W + ZONE_W * k;
// 6 chỗ đứng xen kẽ hàng sau / hàng trước: [x, y chân, tỉ lệ]
const ZONE_SLOTS = [[36, 240, .31], [78, 204, .26], [120, 240, .31], [162, 204, .26], [204, 240, .31], [240, 206, .26]];
const ZONE_EPIC = [135, 86, .22];
const ridgeY = X => 128 + 13 * Math.sin(X / 53) + 8 * Math.sin(X / 23 + 1) + 4 * Math.sin(X / 11 + 2);
const hillY = X => 166 + 6 * Math.sin(X / 41 + 3) + 4 * Math.sin(X / 17);
const groundY = X => 184 + 3 * Math.sin(X / 60 + 1);
// Dải đường cong theo hàm toàn cục, từ X0 tới X0 + w, đóng xuống đáy
function bandPath(fy, X0, w, step = 15) {
  let d = `M-6,${CAMP_H + 6} L-6,${f1(fy(X0 - 6))}`;
  for (let x = 0; x <= w + 6; x += step) d += ` L${x},${f1(fy(X0 + x))}`;
  return d + ` L${w + 6},${f1(fy(X0 + w + 6))} L${w + 6},${CAMP_H + 6} Z`;
}
const campOn = k => !!(state.decor[k] && state.decor[k].on);
function campStars(w, n, seed) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) s += `<circle class="${i % 4 ? '' : 'twinkle'}" style="animation-delay:${f1(r() * 2)}s" cx="${f1(r() * w)}" cy="${f1(r() * 120)}" r="${f1(.7 + r() * 1.5)}" fill="#fff"/>`;
  return s;
}
// Bầu trời + núi xa + đồi chung cho mọi khu
function campBack(X0, w, night, seed) {
  let s = `<rect x="-2" width="${w + 4}" height="${CAMP_H}" fill="${night ? lin('#0b0835', '#2a1f78', '#5a3fae') : lin('#3f8cff', '#7cc4ff', '#c9ecff')}"/>`;
  if (night) s += campStars(w, Math.round(w / 12), seed);
  else s += cloudR(30 + (seed * 37) % (w - 90), 34 + (seed * 13) % 26, .7 + (seed % 3) * .1, '#fff', 'drift d2');
  if (campOn('rainbow') && seed % 3 === 1) {
    const cols = ['#ff4d4d', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'], cx = w / 2;
    s += `<g opacity=".85"><path d="M${f1(cx - 130)},178 A130,118 0 0 1 ${f1(cx + 130)},178" fill="none" stroke="${OL}" stroke-width="40"/>` + cols.map((c, i) => `<path d="M${f1(cx - 128 + i * 6)},178 A${128 - i * 6},${116 - i * 6} 0 0 1 ${f1(cx + 128 - i * 6)},178" fill="none" stroke="${c}" stroke-width="6.5"/>`).join('') + `</g>`;
  }
  s += pa(bandPath(ridgeY, X0, w, 18), night ? lin('#3a2f8f', '#261c66') : lin('#6aa3f0', '#4d7fd6'), 3.5);
  return s;
}
const campHills = (X0, w, night, col) => pa(bandPath(hillY, X0, w), col || (night ? '#226a3e' : '#46b65a'), 3.5);
const campGround = (X0, w, night) => pa(bandPath(groundY, X0, w, 20), night ? lin('#3c8f4c', '#1b4f30') : lin('#7fe05a', '#2f9a3e'), 4);
function campGrass(w, night, seed) {
  if (!campOn('grass')) return '';
  const r = rng(seed); let s = '';
  for (let i = 0; i < Math.round(w / 26); i++) { const x = 8 + r() * (w - 16), y = 192 + r() * 60; s += pa(`M${f1(x)},${f1(y)} l-5,-11 l6,6 l2,-12 l3,12 l6,-7 l-3,12 Z`, night ? '#2f7a43' : '#2d9a3a', 2); if (i % 2 === 0) s += ci(x + 9, y - 6, 3.4, ['#ff5fa2', '#ffe14d', '#ffffff', '#ff8a1f'][i % 4], 1.6); }
  return s;
}
// Dây đèn lồng chạy liền qua mọi khu (vẽ ở lớp trước)
function campLanterns(X0, w) {
  if (!campOn('lantern')) return '';
  const sag = X => 26 + 14 * Math.sin(X / 70);
  let d = `M-4,${f1(sag(X0 - 4))}`; for (let x = 0; x <= w + 4; x += 10) d += ` L${x},${f1(sag(X0 + x))}`;
  let s = ln(d, OL, 2.5);
  for (let gx = Math.ceil(X0 / 66) * 66; gx < X0 + w; gx += 66) {
    const x = gx - X0, y = sag(gx), i = gx / 66, c = i % 2 ? '#ffd21f' : '#ff3b4f';
    s += `<g class="swing" style="transform-origin:${f1(x)}px ${f1(y)}px;animation-delay:-${f1((i % 5) * .3)}s"><circle cx="${f1(x)}" cy="${f1(y + 13)}" r="13" fill="${c}" opacity=".25"/>${el(x, y + 13, 8.5, 9.5, c, 3)}</g>`;
  }
  return s;
}

/* ----- Cảnh riêng từng khu hệ (tọa độ trong khu 0..270) ----- */
const ZONE_ART = {
  fire: night => pa('M118,182 L176,98 Q190,84 204,98 L266,182 Z', night ? '#3a1f4a' : '#7a3a3a', 4) + pa('M170,108 Q190,94 210,108 L203,120 Q190,112 177,120 Z', 'url(#gLava)', 3) +
    ln('M186,116 Q180,140 188,160 Q192,170 186,182', '#ff8a1f', 4) + ln('M196,118 Q204,146 198,182', '#ffb21f', 3) + `<g class="smoke">${ci(182, 80, 9, '#8a7a9a', 0, 'opacity=".55"')}${ci(196, 66, 12, '#8a7a9a', 0, 'opacity=".45"')}</g>` +
    pa('M10,184 Q20,160 40,166 Q52,150 66,170 L74,184 Z', '#6e3a2a', 3.5) + flame(46, 166, 18, 11, 0, true, 3),
  ice: night => crystalsR(206, 182, 1.25, '#c8f4ff', '#4aa8e8') + crystalsR(30, 182, .8, '#e4fbff', '#6ab8ef') + pine(92, 184, 46, night ? '#1f6a6a' : '#2f8a7a', true) + pine(120, 184, 34, night ? '#1f6a6a' : '#2f8a7a', true) +
    pa('M138,184 Q150,150 176,160 Q186,170 186,184 Z', '#ffffff', 3.5),
  thunder: night => stormCloud(150, 64, .75, night ? '#3a2f8e' : '#5a4ab8') + `<g class="flick">${bolt(186, 92, 54, '#fff59a', 3)}</g>` +
    crystal(40, 184, 58, 18, '#d9b8ff', '#7a4cff', 3.5, -6) + crystal(62, 184, 40, 14, '#fff3a0', '#d9a400', 3, 8) + crystal(232, 184, 50, 16, '#d9b8ff', '#7a4cff', 3.5, 6),
  stone: night => pa('M140,184 L150,120 L176,112 L196,124 L210,116 L236,124 L246,184 Z', night ? '#6a4a5a' : '#c98a5a', 4) + pa('M176,184 Q178,150 196,148 Q214,150 214,184 Z', night ? '#2a1d40' : '#6a4228', 3) +
    ln('M150,140 L240,140 M154,160 L242,160', 'rgba(0,0,0,.18)', 3) + rockChunk(36, 176, 16, '#b58a62', '#7a5232') + rockChunk(64, 180, 10, '#c99a6b', '#7a5232'),
  forest: night => pa('M196,184 Q200,150 194,126 L212,126 Q206,150 214,184 Z', '#9a5a2a', 4) + `<g class="sway">` + bl('<circle cx="186" cy="112" r="26"/><circle cx="214" cy="94" r="30"/><circle cx="238" cy="118" r="22"/><circle cx="206" cy="128" r="22"/>', night ? '#1f6a3a' : 'url(#gLeafG)', 4) + `</g>` +
    mushroom(40, 184, 30, '#ff3b6a') + mushroom(66, 184, 20, '#ff9a1f') + bamboo(116, 184, 66, night ? '#4aa84a' : '#7bd65a'),
  shadow: night => moonR(206, 58, 20, '#f2e8ff') + tube('M34,184 Q38,150 30,124 M32,146 Q48,132 54,116 M31,128 Q18,118 14,104', '#3a2a5e', 5) +
    pa('M120,184 Q122,140 156,140 Q190,140 192,184 Z', night ? '#2a1a4a' : '#4a3278', 4) + pa('M146,184 Q146,162 156,160 Q166,162 166,184 Z', '#140a30', 0) +
    `<g class="flick">${ci(150, 152, 3, '#ffe14d', 0)}${ci(162, 152, 3, '#ffe14d', 0)}</g>` +
    `<g class="flame">${pa('M228,178 C224,168 232,162 230,152 C238,158 244,166 240,178 Q234,182 228,178 Z', '#b46bff', 3)}${pa('M231,177 C230,170 234,167 234,161 C238,166 239,171 237,177 Z', '#e6d0ff', 0)}</g>` + tube('M234,184 L234,178', '#5a4a7a', 4),
  metal: night => {
    let f = pa('M146,184 V114 H202 V184 Z', night ? '#3d4c70' : '#56698c', 3.5) + pa('M186,114 V90 H198 V114 Z', '#7d8cab', 3) + `<g class="smoke">${ci(192, 80, 7, '#c5d1e6', 0, 'opacity=".6"')}${ci(198, 66, 9, '#c5d1e6', 0, 'opacity=".45"')}</g>`;
    for (let y = 124; y < 176; y += 16) for (let x = 154; x < 196; x += 14) f += `<rect x="${x}" y="${y}" width="7" height="9" rx="1.5" fill="${(x + y) % 3 ? '#33e1ff' : '#ff4fd8'}" opacity=".85"/>`;
    return f + gear(60, 150, 22, '#8a9ab8') + gear(96, 166, 14, '#a7b8d0') + tube('M232,184 L232,96', '#a7b8d0', 4) + ci(232, 92, 6, '#ff2e4a', 2.5) + tube('M220,124 L244,124 M222,148 L242,148', '#a7b8d0', 2.5);
  }
};
// Mặt đất riêng của khu (sân hệ) vẽ trên nền cỏ chung
const ZONE_YARD = {
  fire: ['#c45a2a', '#ff8a3d'], ice: ['#eaf8ff', '#bfe6ff'], thunder: ['#7a5ad8', '#b8a0ff'], stone: ['#c9a06b', '#e0c090'],
  forest: ['#3f9a3e', '#7be35a'], shadow: ['#4a3278', '#7a5ab8'], metal: ['#7d8cab', '#c5d1e6']
};
function zoneBack(k, night) {
  const e = ZONE_ELS[k], X0 = zoneX0(k), w = ZONE_W, Y = ZONE_YARD[e];
  let s = campBack(X0, w, night, k + 2);
  s += ZONE_ART[e](night);
  s += campHills(X0, w, night) + campGround(X0, w, night);
  s += el(135, 226, 126, 30, cel(Y[1], Y[0], .5), 3.5, 'opacity=".9"');
  // Chỗ trống: gò nhỏ có dấu hỏi
  PETS.filter(p => p.el === e).forEach((p, j) => {
    if (state.pets[p.id]) return;
    const [x, y, sc] = ZONE_SLOTS[j], r = 30 * sc / .3;
    s += el(x, y - 3, r * .55, r * .2, 'rgba(20,10,48,.35)', 0) + `<text x="${x}" y="${f1(y - 6)}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="${f1(r * .5)}" fill="rgba(255,255,255,.55)">?</text>`;
  });
  return s + campGrass(w, night, k + 11);
}
function zonePets(k) {
  const e = ZONE_ELS[k];
  const items = [];
  PETS.filter(p => p.el === e).forEach((p, j) => {
    const st = state.pets[p.id]; if (!st) return;
    const [x, y, sc] = ZONE_SLOTS[j];
    items.push({ y, svg: `<g class="scene-pet" data-pet="${p.id}" transform="translate(${f1(x - 100 * sc)} ${f1(y - 189 * sc)}) scale(${sc})" tabindex="0" role="button" aria-label="${esc(p.name)}"><g class="bob" style="animation-delay:-${f1(p.i * .37)}s">${petInner(p.id, st.f, { eq: st.eq, lite: true })}</g></g>` });
  });
  const ep = EPICS.find(p => p.el === e), est = ep && state.pets[ep.id];
  if (est) {
    const [x, y, sc] = ZONE_EPIC;
    const cloud = `<g class="drift" style="animation-duration:${7 + k}s">` + bl(`<ellipse cx="${x}" cy="${y + 3}" rx="30" ry="8"/><circle cx="${x - 14}" cy="${y}" r="9"/><circle cx="${x + 12}" cy="${y - 1}" r="10"/>`, '#fff6d0', 2.5) + ln(`M${x - 24},${y + 6} Q${x},${y + 11} ${x + 24},${y + 6}`, '#ffd21f', 2) + `</g>`;
    items.push({ y: 0, svg: cloud + `<g class="scene-pet flyer epic-camp" data-pet="${ep.id}" transform="translate(${f1(x - 100 * sc)} ${f1(y - 189 * sc)}) scale(${sc})" tabindex="0" role="button" aria-label="${esc(ep.name)}"><g class="bob" style="animation-delay:-${f1(k * .53)}s">${petInner(ep.id, est.f, { eq: est.eq, lite: true })}</g></g>` });
  }
  return items.sort((a, b) => a.y - b.y).map(x => x.svg).join('') + campLanterns(zoneX0(k), ZONE_W);
}
// Cổng trại: đồ trang trí đặt ở đây, ổ trứng chờ nở ở giữa sân
function plazaBack(night) {
  const w = PLAZA_W;
  let s = campBack(0, w, night, 1);
  if (night) s += pa('M60,26 A22,22 0 1 0 84,62 A17,17 0 1 1 60,26 Z', '#fff4c2', 3.5); else s += sunR(340, 46, 23);
  if (campOn('falls')) {
    s += pa('M330,186 L336,106 Q350,78 374,82 L404,78 L404,186 Z', cel('#c9c4e6', '#5a5288'), 4) + pa('M352,100 Q362,94 378,98 L384,186 L346,186 Z', 'url(#gWater)', 3.5) +
      `<g class="flow">${ln('M358,102 L356,184', '#fff', 2.5, 'stroke-dasharray="10 14"')}${ln('M368,100 L368,184', '#fff', 2.5, 'stroke-dasharray="7 12"')}</g>` + bl('<circle cx="350" cy="186" r="7"/><circle cx="364" cy="182" r="9"/><circle cx="380" cy="186" r="7"/>', '#ffffff', 3);
  }
  if (campOn('tower')) {
    s += tube('M20,178 L32,86 M58,178 L46,86', '#b06a30', 4) + tube('M25,152 L53,122 M53,152 L25,122', '#c98a4a', 2.5) + `<rect x="22" y="76" width="36" height="14" rx="3" fill="#c98a4a" stroke="${OL}" stroke-width="3.5"/>` +
      pa('M16,78 L40,48 L64,78 Z', '#ff4d4d', 4) + ln('M40,48 L40,30', OL, 3) + `<g class="wave">${pa('M40,30 L56,35 L40,41 Z', '#ffd21f', 2.5)}</g>`;
  }
  s += campHills(0, w, night);
  if (campOn('tree')) s += pa('M291,186 Q296,146 289,122 L307,122 Q302,146 311,186 Z', '#9a5a2a', 4) + `<g class="sway">` + bl('<circle cx="282" cy="110" r="25"/><circle cx="310" cy="94" r="30"/><circle cx="332" cy="116" r="22"/><circle cx="300" cy="124" r="22"/>', 'url(#gLeafG)', 4) + `</g>`;
  s += campGround(0, w, night);
  // Cổng gỗ "TRẠI PET"
  s += tube('M150,192 L150,126 M250,192 L250,126', '#9a5a2a', 7) + pa('M138,120 Q200,104 262,120 L262,138 Q200,122 138,138 Z', cel('#e0a060', '#9a5a2a'), 3.5) +
    `<text x="200" y="131" text-anchor="middle" font-family="'Baloo 2',system-ui,sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="${OL}" stroke-width="3.5" paint-order="stroke">TRẠI PET</text>`;
  if (campOn('tent')) s += pa('M44,196 L84,132 L124,196 Z', '#ff8a1f', 4.5) + `<path d="M84,132 L66,196 L74,196 Z M84,132 L94,196 L102,196 Z" fill="#ffd21f"/>` + ln('M44,196 L84,132 L124,196', OL, 4.5) + pa('M74,196 L84,164 L94,196 Z', '#3a1d0a', 3);
  if (campOn('rack')) s += `<rect x="290" y="196" width="54" height="7" rx="3" fill="#5d6680" stroke="${OL}" stroke-width="3"/>` + tube('M300,198 L300,150 M334,198 L334,150', '#aab4ca', 4) + tube('M284,160 L350,160', '#e6ebf5', 3.5) + `<rect x="281" y="146" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/><rect x="344" y="146" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>`;
  if (campOn('flag')) s += tube('M250,112 L250,62', '#dfe5f0', 3.5) + ci(250, 60, 4.5, 'url(#gGold)', 2.5) + `<g class="wave">${pa('M250,66 Q268,60 286,68 Q302,74 316,68 L316,96 Q302,102 286,96 Q268,88 250,94 Z', '#ff3b4f', 4)}<text x="283" y="88" text-anchor="middle" font-family="'Baloo 2',system-ui,sans-serif" font-weight="800" font-size="17" fill="#fff" stroke="${OL}" stroke-width="3.5" paint-order="stroke">−25</text></g>`;
  if (campOn('podium')) s += [[236, 22, '#c5d1e6', '2'], [262, 34, 'url(#gGold)', '1'], [288, 16, '#e6952e', '3']].map(([x, h, c, t]) => `<rect x="${x - 26}" y="${214 - h}" width="26" height="${h}" fill="${c}" stroke="${OL}" stroke-width="3"/><text x="${x - 13}" y="${214 - h + 15}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="12" fill="${OL}">${t}</text>`).join('');
  return s + campGrass(w, night, 3);
}
function plazaFront(D) {
  let s = '';
  const items = [];
  if (campOn('fire')) items.push({ y: 232, svg: `<circle cx="200" cy="222" r="34" fill="#ffb21f" opacity=".2"/>` + tube('M180,240 L220,228 M180,228 L220,240', '#8a4a1f', 5) + `<g class="flame">${flame(200, 234, 40, 28, 3, true, 3.5)}</g>` });
  if (campOn('rock')) items.push({ y: 250, svg: bl('<ellipse cx="44" cy="248" rx="22" ry="13"/><ellipse cx="64" cy="252" rx="13" ry="9"/>', cel('#c9c4e6', '#5a5288'), 3.5) + bl('<ellipse cx="372" cy="250" rx="18" ry="12"/>', cel('#c9c4e6', '#5a5288'), 3.5) });
  // Ổ trứng: hiện trứng đang chờ nở (tối đa 5 quả), chạm để nở
  const n = D.nest;
  if (n > 0) {
    const show = Math.min(5, n), cx = 300, cy = 236;
    let eggs = '';
    for (let i = 0; i < show; i++) { const dx = (i - (show - 1) / 2) * 15, k = .2 - Math.abs(dx) * .0012; eggs += `<g transform="translate(${f1(cx + dx - 100 * k)} ${f1(cy - 6 - Math.abs(dx) * .12 - 189 * k)}) scale(${f1(k)})"><g class="egg" style="animation-delay:-${f1(i * .5)}s">${eggInner()}</g></g>`; }
    const nest = el(cx, cy + 2, 46, 12, cel('#d9a35a', '#8a5a22'), 3.5) + ln(`M${cx - 40},${cy} q10,6 20,0 q10,6 20,0 q10,6 20,0 q10,6 20,0`, '#8a5a22', 2.4);
    items.push({ y: 236, svg: `<g class="scene-pet nest" data-pet="nest" tabindex="0" role="button" aria-label="Ổ trứng: ${n} trứng chờ nở">${nest}${eggs}${el(cx, cy + 6, 44, 9, cel('#e8b46a', '#9a6a2a'), 3.5)}${n > show ? `<text x="${cx + 38}" y="${cy - 26}" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="15" fill="#fff" stroke="${OL}" stroke-width="3.5" paint-order="stroke">+${n - show}</text>` : ''}</g>` });
  } else if (!D.total) {
    items.push({ y: 236, svg: `<g class="scene-pet" data-pet="egg" transform="translate(${f1(300 - 100 * .3)} ${f1(240 - 189 * .3)}) scale(.3)">${eggInner()}</g>` });
  }
  items.sort((a, b) => a.y - b.y).forEach(it => s += it.svg);
  return s + campLanterns(0, PLAZA_W);
}
const campSvg = (w, inner, cls, label) => `<svg class="${cls}" viewBox="0 0 ${w} ${CAMP_H}" preserveAspectRatio="xMidYMid slice" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${inner}</svg>`;
// Trại chung: khung cuộn ngang + hàng nút nhảy tới từng khu
function campHTML(D) {
  const night = campOn('night');
  let h = `<div class="camp-scroll" id="camp-scroll"><div class="camp-strip">`;
  h += `<div class="camp-zone plaza" data-zone="plaza" style="--w:${PLAZA_W}">${campSvg(PLAZA_W, plazaBack(night), 'zbg', 'Cổng trại')}${campSvg(PLAZA_W, plazaFront(D), 'zfg')}<span class="zlab">Cổng trại</span></div>`;
  ZONE_ELS.forEach((e, k) => {
    const E = ELEMENTS[e], own = PETS.filter(p => p.el === e && state.pets[p.id]).length, tot = PETS.filter(p => p.el === e).length;
    h += `<div class="camp-zone" data-zone="${e}" data-k="${k}" style="--w:${ZONE_W};--zc:${E.c}">${campSvg(ZONE_W, zoneBack(k, night), 'zbg', `Khu ${E.n}`)}<div class="zfg-slot"></div><span class="zlab"><i></i>${E.n} ${own}/${tot}</span></div>`;
  });
  h += `</div></div>`;
  return h;
}
function campNavHTML() {
  return `<div class="camp-nav" role="tablist" aria-label="Khu trong trại"><button data-act="camp-go" data-z="plaza">Cổng</button>${ZONE_ELS.map(e => { const own = PETS.filter(p => p.el === e && state.pets[p.id]).length; return `<button data-act="camp-go" data-z="${e}" style="--zc:${ELEMENTS[e].c}"><i></i>${ELEMENTS[e].n}<small>${own}</small></button>`; }).join('')}</div>`;
}
// Dựng pet của khu khi khu sắp hiện ra; khu khuất thì dừng chuyển động
let campObs = null;
function campLazy() {
  const sc = $('#camp-scroll'); if (!sc) return;
  if (campObs) campObs.disconnect();
  const fill = z => { const slot = z.querySelector('.zfg-slot'); if (!slot) return; slot.insertAdjacentHTML('afterend', campSvg(ZONE_W, zonePets(+z.dataset.k), 'zfg')); slot.remove(); flushCel(); };
  const zones = sc.querySelectorAll('.camp-zone');
  if (!('IntersectionObserver' in window)) { zones.forEach(fill); return; }
  campObs = new IntersectionObserver(es => es.forEach(e => {
    e.target.classList.toggle('off', !e.isIntersecting);
    if (e.isIntersecting) fill(e.target);
  }), { root: sc, rootMargin: '0px 240px' });
  zones.forEach(z => campObs.observe(z));
  if (ui.campX != null) sc.scrollLeft = ui.campX;
  else { // lần đầu mở: có trứng chờ thì đứng ở Cổng trại (ổ trứng), không thì tới khu của pet đang chọn
    const id = curPetId(), z = id && !derive().nest && sc.querySelector(`[data-zone="${PET_BY[id].el}"]`);
    if (z) sc.scrollLeft = z.offsetLeft - 6;
  }
  sc.addEventListener('scroll', () => { ui.campX = sc.scrollLeft; }, { passive: true });
}
function campGo(z) {
  const sc = $('#camp-scroll'), el = sc && sc.querySelector(`[data-zone="${z}"]`); if (!el) return;
  sc.scrollTo({ left: el.offsetLeft - 6, behavior: reduced() ? 'auto' : 'smooth' });
}

/* ---------- Huy hiệu thành tựu: khung theo bậc + biểu tượng + số ---------- */
const TIER = [
  { n: 'Đồng', a: '#ffc08a', b: '#d9783a', c: '#8f4517' },
  { n: 'Bạc', a: '#ffffff', b: '#c5d1e6', c: '#7d8cab' },
  { n: 'Vàng', a: '#fff6b0', b: '#ffd21f', c: '#d48700' }
];
const NUM_KINDS = { total: 1, streak: 1, lift: 1, heavy: 1, abs: 1, water: 1, food: 1, steps: 1, pets: 1, evo4: 1, kg: 1, outfit: 1, fx: 1, decor: 1, weighrun: 1, sleeprun: 1, measure: 1 };
function badgeSVG(a, got) {
  const t = TIER[a.t], fill = got ? cel(t.b, t.c) : '#4a4378', inner = got ? '#2b1f80' : '#2c2656';
  const g = ICONS[ACH_GLYPH[a.kind] || 'star'];
  let s = `<svg viewBox="0 0 100 110" class="badge-svg" aria-hidden="true">`;
  if (got && a.t === 2) s += `<g class="spin-slow" style="transform-origin:50px 54px">${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<path d="M50,54 L46,2 L54,2 Z" fill="#fff6b0" opacity=".55" transform="rotate(${r} 50 54)"/>`).join('')}</g>`;
  s += `<path d="M50,8 L88,24 L88,60 Q88,90 50,104 Q12,90 12,60 L12,24 Z" fill="${OL}" transform="translate(0 4)"/>` +
    `<path d="M50,8 L88,24 L88,60 Q88,90 50,104 Q12,90 12,60 L12,24 Z" fill="${fill}" stroke="${OL}" stroke-width="5" stroke-linejoin="round"/>` +
    `<path d="M50,19 L78,31 L78,59 Q78,82 50,93 Q22,82 22,59 L22,31 Z" fill="${inner}" stroke="${OL}" stroke-width="3"/>` +
    (got ? `<path d="M24,30 L50,19 L76,30" fill="none" stroke="#fff" stroke-width="3" opacity=".45" stroke-linecap="round"/>` : '');
  s += `<g transform="translate(29 33) scale(.66)" ${got ? '' : 'opacity=".35"'}>${g ? g() : ''}</g>`;
  if (NUM_KINDS[a.kind] && a.n > 1) s += `<g transform="translate(50 92)"><rect x="-17" y="-9" width="34" height="18" rx="9" fill="${got ? '#ff4d6a' : '#5d5596'}" stroke="${OL}" stroke-width="3"/><text y="5" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="13" fill="#fff">${a.n}${a.kind === 'kg' ? 'kg' : ''}</text></g>`;
  if (!got) s += `<g transform="translate(74 30)"><rect x="-9" y="-3" width="18" height="14" rx="4" fill="#8f86c9" stroke="${OL}" stroke-width="2.6"/><path d="M-5,-3 v-4 a5,5 0 0 1 10,0 v4" fill="none" stroke="${OL}" stroke-width="2.6"/></g>`;
  return s + `</svg>`;
}

/* ---------- Icon điều hướng ---------- */
const NAV_ICONS = { today: () => ic('fire'), calendar: () => ic('calendar'), pets: () => ic('paw'), weight: () => ic('scale'), badges: () => ic('trophy') };

/* ---------- Icon món trong cửa hàng ---------- */
function shopIcon(id) {
  const it = SHOP_BY[id]; if (!it) return '';
  if (it.cat === 'wear') {
    const vb = { gcrown: '-50 -44 100 76', gwings: '-112 -96 224 130', gsash: '-38 -16 76 64' }[id] || { head: '-50 -36 100 70', eyes: '-46 -24 92 44', neck: '-38 -16 76 54', back: '-66 -12 132 100', body: '-38 -36 76 82' }[it.slot];
    return `<svg class="ic shop-ic" viewBox="${vb}" aria-hidden="true">${WEAR_ART[id]()}</svg>`;
  }
  if (it.cat === 'fx') {
    const g = RIG[2], r = FX_ART[id](g);
    return `<svg class="ic shop-ic" viewBox="0 20 200 180" aria-hidden="true">${r.b || ''}<g opacity=".9">${pa('M70,188 Q60,120 100,112 Q140,120 130,188 Z', '#5d5596', 4)}${ci(100, 100, 30, '#5d5596', 4)}</g>${r.f || ''}</svg>`;
  }
  const map = { grass: 'flower', rock: 'boulder', fire: 'fire', lantern: 'lantern', flag: 'flag', tent: 'tent', tree: 'tree', rack: 'barbell', falls: 'water', tower: 'tower', podium: 'podium', night: 'sleep', rainbow: 'rainbow' };
  return ic(map[id] || 'star', 'shop-ic');
}
Object.assign(ICONS, {
  flower: () => leaf(32, 60, 26, -100, '#3fbf5a', '#1d7a35', 3) + [0, 72, 144, 216, 288].map(a => ci(32 + Math.cos(a * Math.PI / 180) * 12, 24 + Math.sin(a * Math.PI / 180) * 12, 9, '#ff5fa2', 3)).join('') + ci(32, 24, 8, '#ffd21f', 3),
  boulder: () => bl('<ellipse cx="28" cy="40" rx="22" ry="16"/><ellipse cx="48" cy="46" rx="13" ry="10"/>', cel('#c9c4e6', '#5a5288'), 3.5) + hl(22, 32, 6, 3, -10, .5),
  lantern: () => ln('M32,2 V10', OL, 3) + `<rect x="24" y="8" width="16" height="6" rx="2" fill="${OL}"/>` + el(32, 34, 20, 22, cel('#ff3b4f', '#b81d3a'), 3.5) + ln('M22,18 Q18,34 22,50 M42,18 Q46,34 42,50', 'rgba(0,0,0,.3)', 2) + `<rect x="24" y="54" width="16" height="6" rx="2" fill="${OL}"/>` + ln('M32,60 V64', '#ffd21f', 3),
  flag: () => tube('M14,62 V6', '#dfe5f0', 4, 3) + pa('M16,8 Q30,2 44,10 Q54,16 60,10 V34 Q54,40 44,34 Q30,26 16,32 Z', cel('#ff3b4f', '#b81d3a'), 3.5) + `<text x="38" y="27" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="14" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">−25</text>`,
  tree: () => pa('M28,62 Q30,44 27,34 L37,34 Q34,44 36,62 Z', '#9a5a2a', 3.5) + bl('<circle cx="22" cy="26" r="14"/><circle cx="38" cy="18" r="16"/><circle cx="46" cy="32" r="12"/>', 'url(#gLeafG)', 3.5),
  tower: () => tube('M16,62 L24,22 M48,62 L40,22', '#b06a30', 4, 3) + `<rect x="14" y="18" width="36" height="10" rx="2" fill="#c98a4a" stroke="${OL}" stroke-width="3"/>` + pa('M8,20 L32,2 L56,20 Z', '#ff4d4d', 3.5),
  podium: () => [[6, 18, '#c5d1e6'], [24, 30, 'url(#gGold)'], [42, 12, '#e6952e']].map(([x, h, c]) => `<rect x="${x}" y="${58 - h}" width="18" height="${h}" fill="${c}" stroke="${OL}" stroke-width="3"/>`).join('') + pa(starPath(33, 16, 8, 3.5), '#ffd21f', 2.2),
  rainbow: () => ['#ff4d4d', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'].map((c, i) => `<path d="M${6 + i * 4},52 A${26 - i * 4},${26 - i * 4} 0 0 1 ${58 - i * 4},52" fill="none" stroke="${c}" stroke-width="4"/>`).join('') + `<path d="M4,52 A28,28 0 0 1 60,52" fill="none" stroke="${OL}" stroke-width="2.5"/>` + cloudR(2, 54, .45, '#fff', '') + cloudR(40, 54, .45, '#fff', '')
});
