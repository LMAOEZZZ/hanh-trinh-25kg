/* ===================== TRẠI CHUNG, TRỨNG, HUY HIỆU, ICON ĐIỀU HƯỚNG ===================== */
/* ---------- Trứng ---------- */
function eggInner() {
  return `<ellipse cx="100" cy="189" rx="46" ry="8" fill="#000" opacity=".3"/><g class="egg">` +
    pa('M100,40 C140,40 156,110 152,140 C148,174 126,188 100,188 C74,188 52,174 48,140 C44,110 60,40 100,40 Z', 'url(#gEgg)', 5.5) +
    el(80, 96, 11, 8, '#ff8a1f', 0) + el(120, 130, 14, 10, '#ff8a1f', 0) + el(90, 158, 9, 6, '#ff8a1f', 0) + el(125, 86, 6, 5, '#ff8a1f', 0) + el(66, 132, 6, 8, '#ff8a1f', 0) +
    ln('M66,116 L80,108 L88,120 L100,110 L110,122 L124,112 L136,120', OL, 3.5) + hl(80, 64, 12, 6) + `</g>`;
}
const eggSVG = (cls = '') => `<svg class="pet-svg ${cls}" viewBox="0 0 200 200" overflow="visible" aria-hidden="true">${eggInner()}</svg>`;

/* ---------- Trại chung: 28 chỗ đứng theo 4 hàng sâu ---------- */
const CAMP_SLOTS = (() => {
  const rows = [[248, .36, [200, 136, 264, 74, 326, 22, 378]], [228, .31, [168, 232, 106, 294, 46, 354, 200]], [210, .27, [138, 262, 200, 78, 322, 26, 374]], [194, .23, [108, 292, 170, 230, 48, 352, 200]]];
  const out = [];
  for (let k = 0; k < 7; k++) rows.forEach(([y, s, xs]) => out.push([xs[k], y, s]));
  return out;
})();
function campSVG(D) {
  const on = k => !!(state.decor[k] && state.decor[k].on);
  const night = on('night');
  let s = `<svg class="scene-svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Trại chung của các pet">`;
  s += `<rect width="400" height="260" fill="${night ? lin('#0b0835', '#2a1f78', '#5a3fae') : lin('#3f8cff', '#7cc4ff', '#c9ecff')}"/>`;
  if (night) { s += starsR(34, 7, 120); s += pa('M60,26 A22,22 0 1 0 84,62 A17,17 0 1 1 60,26 Z', '#fff4c2', 3.5); }
  else { s += sunR(340, 46, 23); s += cloudR(62, 50, 1) + cloudR(160, 32, .75, '#fff', 'drift d2'); }
  if (on('rainbow')) {
    const cols = ['#ff4d4d', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'];
    s += `<g opacity=".92"><path d="M40,180 A160,140 0 0 1 360,180" fill="none" stroke="${OL}" stroke-width="44"/>` + cols.map((c, i) => `<path d="M${42 + i * 6.5},180 A${158 - i * 6.5},${138 - i * 6.5} 0 0 1 ${358 - i * 6.5},180" fill="none" stroke="${c}" stroke-width="7"/>`).join('') + `</g>`;
  }
  s += pa('M0,156 Q50,104 104,142 Q150,102 214,140 Q290,92 346,134 Q378,118 400,130 L400,260 L0,260 Z', night ? lin('#3a2f8f', '#261c66') : lin('#6aa3f0', '#4d7fd6'), 3.5);
  if (on('falls')) {
    s += pa('M330,186 L336,106 Q350,78 374,82 L404,78 L404,186 Z', cel('#c9c4e6', '#5a5288'), 4) + pa('M352,100 Q362,94 378,98 L384,186 L346,186 Z', 'url(#gWater)', 3.5) +
      `<g class="flow">${ln('M358,102 L356,184', '#fff', 2.5, 'stroke-dasharray="10 14"')}${ln('M368,100 L368,184', '#fff', 2.5, 'stroke-dasharray="7 12"')}</g>` + bl('<circle cx="350" cy="186" r="7"/><circle cx="364" cy="182" r="9"/><circle cx="380" cy="186" r="7"/>', '#ffffff', 3);
  }
  if (on('tower')) {
    s += tube('M20,178 L32,86 M58,178 L46,86', '#b06a30', 4) + tube('M25,152 L53,122 M53,152 L25,122', '#c98a4a', 2.5) + `<rect x="22" y="76" width="36" height="14" rx="3" fill="#c98a4a" stroke="${OL}" stroke-width="3.5"/>` +
      pa('M16,78 L40,48 L64,78 Z', '#ff4d4d', 4) + ln('M40,48 L40,30', OL, 3) + `<g class="wave">${pa('M40,30 L56,35 L40,41 Z', '#ffd21f', 2.5)}</g>`;
  }
  s += pa('M0,172 Q80,140 160,166 Q250,140 330,164 Q372,154 400,158 L400,260 L0,260 Z', night ? '#226a3e' : '#46b65a', 3.5);
  if (on('tree')) s += pa('M291,186 Q296,146 289,122 L307,122 Q302,146 311,186 Z', '#9a5a2a', 4) + `<g class="sway">` + bl('<circle cx="282" cy="110" r="25"/><circle cx="310" cy="94" r="30"/><circle cx="332" cy="116" r="22"/><circle cx="300" cy="124" r="22"/>', 'url(#gLeafG)', 4) + `</g>`;
  s += pa('M-4,182 Q200,166 404,182 L404,264 L-4,264 Z', night ? lin('#3c8f4c', '#1b4f30') : lin('#7fe05a', '#2f9a3e'), 4);
  if (on('tent')) s += pa('M44,196 L84,132 L124,196 Z', '#ff8a1f', 4.5) + `<path d="M84,132 L66,196 L74,196 Z M84,132 L94,196 L102,196 Z" fill="#ffd21f"/>` + ln('M44,196 L84,132 L124,196', OL, 4.5) + pa('M74,196 L84,164 L94,196 Z', '#3a1d0a', 3);
  if (on('rack')) s += `<rect x="234" y="190" width="54" height="7" rx="3" fill="#5d6680" stroke="${OL}" stroke-width="3"/>` + tube('M244,192 L244,144 M278,192 L278,144', '#aab4ca', 4) + tube('M228,154 L294,154', '#e6ebf5', 3.5) + `<rect x="225" y="140" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/><rect x="288" y="140" width="9" height="28" rx="3" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>`;
  if (on('flag')) s += tube('M172,186 L172,98', '#dfe5f0', 3.5) + ci(172, 96, 4.5, 'url(#gGold)', 2.5) + `<g class="wave">${pa('M172,102 Q190,96 208,104 Q224,110 238,104 L238,132 Q224,138 208,132 Q190,124 172,130 Z', '#ff3b4f', 4)}<text x="205" y="124" text-anchor="middle" font-family="'Baloo 2',system-ui,sans-serif" font-weight="800" font-size="17" fill="#fff" stroke="${OL}" stroke-width="3.5" paint-order="stroke">−25</text></g>`;
  if (on('podium')) s += [[150, 22, '#c5d1e6', '2'], [176, 34, 'url(#gGold)', '1'], [202, 16, '#e6952e', '3']].map(([x, h, c, t]) => `<rect x="${x}" y="${198 - h}" width="26" height="${h}" fill="${c}" stroke="${OL}" stroke-width="3"/><text x="${x + 13}" y="${198 - h + 15}" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="12" fill="${OL}">${t}</text>`).join('');
  if (on('grass')) {
    const r = rng(3);
    for (let i = 0; i < 16; i++) { const x = 8 + r() * 384, y = 190 + r() * 62; s += pa(`M${f1(x)},${f1(y)} l-5,-11 l6,6 l2,-12 l3,12 l6,-7 l-3,12 Z`, night ? '#2f7a43' : '#2d9a3a', 2); if (i % 2 === 0) s += ci(x + 9, y - 6, 3.6, ['#ff5fa2', '#ffe14d', '#ffffff', '#ff8a1f'][i % 4], 1.6); }
  }
  // Pet: hàng sau vẽ trước
  const items = [];
  if (!D.total) items.push({ y: 236, svg: `<g class="scene-pet" data-pet="egg" transform="translate(${f1(200 - 100 * .4)} ${f1(240 - 189 * .4)}) scale(.4)">${eggInner()}</g>` });
  PETS.forEach((p, i) => {
    const st = state.pets[p.id]; if (!st) return;
    const [x, y, k] = CAMP_SLOTS[i];
    items.push({ y, svg: `<g class="scene-pet" data-pet="${p.id}" transform="translate(${f1(x - 100 * k)} ${f1(y - 189 * k)}) scale(${k})" tabindex="0" role="button" aria-label="${p.name}"><g class="bob" style="animation-delay:-${f1(i * .37)}s">${petInner(p.id, st.f, { eq: st.eq, lite: true })}</g></g>` });
  });
  if (on('fire')) items.push({ y: 228, svg: `<circle cx="200" cy="220" r="34" fill="#ffb21f" opacity=".2"/>` + tube('M180,238 L220,226 M180,226 L220,238', '#8a4a1f', 5) + `<g class="flame">${flame(200, 232, 40, 28, 3, true, 3.5)}</g>` });
  if (on('rock')) items.push({ y: 250, svg: bl('<ellipse cx="104" cy="248" rx="22" ry="13"/><ellipse cx="124" cy="252" rx="13" ry="9"/>', cel('#c9c4e6', '#5a5288'), 3.5) + bl('<ellipse cx="300" cy="250" rx="18" ry="12"/>', cel('#c9c4e6', '#5a5288'), 3.5) });
  items.sort((a, b) => a.y - b.y).forEach(it => s += it.svg);
  if (on('lantern')) {
    s += ln('M-4,20 Q100,52 200,30 Q300,8 404,30', OL, 2.5);
    [[34, 30], [102, 42], [168, 36], [236, 24], [300, 18], [366, 24]].forEach(([x, y], i) => { const c = i % 2 ? '#ffd21f' : '#ff3b4f'; s += `<g class="swing" style="transform-origin:${x}px ${y}px;animation-delay:-${i * .3}s"><circle cx="${x}" cy="${y + 13}" r="13" fill="${c}" opacity=".25"/>${el(x, y + 13, 9, 10, c, 3)}</g>`; });
  }
  return s + `</svg>`;
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
    const vb = { head: '-50 -36 100 70', eyes: '-46 -24 92 44', neck: '-38 -16 76 54', back: '-66 -12 132 100', body: '-38 -36 76 82' }[it.slot];
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
