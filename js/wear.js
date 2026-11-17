/* ===================== TRANG PHỤC & HIỆU ỨNG: vẽ theo điểm neo của từng pet ===================== */
// Mỗi món vẽ trong khung riêng (gốc tại điểm neo, chuẩn bề ngang W0) rồi co giãn theo bề ngang thật.
const WEAR_ART = {
  /* ---- Mũ: gốc = đỉnh đầu, chuẩn rộng 70 ---- */
  bandana: () => pa('M-37,14 Q0,2 37,14 L36,26 Q0,15 -36,26 Z', cel('#ff3b4f', '#b81d3a'), 4) + ln('M-30,17 Q0,8 30,17', '#fff', 2, 'opacity=".5"') +
    pa('M34,18 L52,10 L50,24 Z M34,22 L50,34 L40,36 Z', cel('#ff3b4f', '#b81d3a'), 3.5) + ci(35, 20, 5, '#ff3b4f', 3),
  cap: () => pa('M-35,20 Q-36,-12 0,-14 Q36,-12 35,20 Q0,14 -35,20 Z', cel('#2b6cff', '#163f9e'), 4.5) +
    pa('M-38,20 Q0,10 38,20 Q42,28 30,30 Q0,22 -30,30 Q-42,28 -38,20 Z', cel('#2457d6', '#12307a'), 4) + ln('M0,-13 V16', '#12307a', 2.5) +
    ci(0, -14, 4, '#ffd21f', 2.5) + pa(starPath(-14, 4, 7, 3), '#ffd21f', 2) + hl(-18, -4, 7, 3, -25, .5),
  beanie: () => pa('M-36,18 Q-38,-16 0,-18 Q38,-16 36,18 Z', cel('#ff8a1f', '#c2560a'), 4.5) + ln('M-20,-12 V14 M-7,-17 V14 M7,-17 V14 M20,-12 V14', '#c2560a', 2.5) +
    pa('M-40,10 Q0,2 40,10 L39,24 Q0,16 -39,24 Z', cel('#ffd21f', '#d99500'), 4) + ci(0, -22, 9, '#fff6d8', 3.5) + hl(-20, -8, 6, 3, -30, .45),
  helmet: () => pa('M-30,4 Q-46,-6 -50,-34 Q-36,-18 -24,-14 Z', 'url(#gHorn)', 4) + pa('M30,4 Q46,-6 50,-34 Q36,-18 24,-14 Z', 'url(#gHorn)', 4) +
    pa('M-37,22 Q-38,-18 0,-20 Q38,-18 37,22 Q0,16 -37,22 Z', cel('#c9d4e6', '#6c81a3'), 4.5) + pa('M-39,16 Q0,8 39,16 L38,26 Q0,18 -38,26 Z', cel('#ffd21f', '#d99500'), 3.5) +
    pa('M-4,-19 L4,-19 L4,14 L-4,14 Z', cel('#ffd21f', '#d99500'), 3) + [-26, -12, 12, 26].map(x => rivet(x, 20 - Math.abs(x) * .05, 2.2)).join('') + hl(-18, -6, 8, 3.5, -30, .6),
  crown: () => pa('M-30,14 L-34,-16 L-16,-2 L0,-26 L16,-2 L34,-16 L30,14 Q0,20 -30,14 Z', 'url(#gGold)', 4.5) + ln('M-28,6 Q0,11 28,6', '#e08a00', 3) +
    ci(0, 2, 5, '#ff3b4f', 2.5) + ci(-17, 4, 3.4, '#33e1ff', 2) + ci(17, 4, 3.4, '#33e1ff', 2) + ci(0, -26, 3.5, '#fff6b0', 2) + ci(-34, -16, 3.5, '#fff6b0', 2) + ci(34, -16, 3.5, '#fff6b0', 2) + hl(-16, -4, 5, 2, -30, .7),
  /* ---- Kính: gốc = giữa hai mắt, chuẩn rộng 63 ---- */
  shades: () => ln('M-36,-4 Q0,-10 36,-4', OL, 5) + pa('M-34,-6 L-6,-6 Q-4,10 -18,12 Q-34,12 -34,-6 Z', '#1d1440', 4) + pa('M34,-6 L6,-6 Q4,10 18,12 Q34,12 34,-6 Z', '#1d1440', 4) +
    ln('M-28,-2 L-20,6 M8,-2 L14,4', '#fff', 2.5, 'opacity=".75"') + ln('M-6,-4 Q0,-7 6,-4', OL, 4),
  visor: () => pa('M-40,-8 Q0,-14 40,-8 L38,8 Q0,4 -38,8 Z', 'url(#gNeon)', 4.5) + ln('M-32,-5 Q0,-10 30,-5', '#fff', 3, 'opacity=".75"') + ci(-41, 0, 4, '#56698c', 2.5) + ci(41, 0, 4, '#56698c', 2.5),
  /* ---- Cổ: gốc = cổ, chuẩn rộng 60 ---- */
  scarf: () => pa('M18,6 L30,34 L22,38 L10,10 Z', cel('#ff3b4f', '#b81d3a'), 3.5) + pa('M-31,-6 Q0,6 31,-6 L31,6 Q0,18 -31,6 Z', cel('#ff3b4f', '#b81d3a'), 4) +
    ln('M-25,-1 Q0,9 25,-1', '#fff', 2.5, 'opacity=".5"') + ln('M20,24 l7,-3 M17,17 l7,-3', '#fff', 2, 'opacity=".5"'),
  chain: () => { let s = ''; for (let i = 0; i <= 10; i++) { const t = i / 10, x = -26 + t * 52, y = -2 + Math.sin(t * Math.PI) * 18; s += el(x, y, 4.2, 3, 'url(#gGold)', 2.2, `transform="rotate(${f1((t - .5) * 70)} ${f1(x)} ${f1(y)})"`); } return s + ci(0, 24, 9, 'url(#gGold)', 3.5) + `<text x="0" y="28" text-anchor="middle" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="10" fill="${OL}">-25</text>`; },
  medal: () => pa('M-12,-4 L0,16 L12,-4 L5,-4 L0,6 L-5,-4 Z', '#2b6cff', 3) + ci(0, 24, 10, 'url(#gGold)', 3.5) + pa(starPath(0, 24.5, 6.5, 2.8), '#fff6b0', 1.6),
  /* ---- Lưng: gốc = giữa vai, chuẩn rộng 80, cao 72 ---- */
  cape: () => pa('M-38,0 Q0,-8 38,0 Q50,40 58,78 Q30,70 0,80 Q-30,70 -58,78 Q-50,40 -38,0 Z', cel('#ff3b4f', '#a8163a'), 5) + ln('M-30,20 Q-40,50 -44,72 M30,20 Q40,50 44,72', '#a8163a', 3),
  royal: () => pa('M-40,0 Q0,-8 40,0 Q54,40 62,80 Q30,72 0,82 Q-30,72 -62,80 Q-54,40 -40,0 Z', cel('#7a3cff', '#4a1fa8'), 5) + ln('M-60,78 Q-30,70 0,80 Q30,70 60,78', '#ffd21f', 4) +
    pa('M-42,-4 Q0,-12 42,-4 L40,8 Q0,2 -40,8 Z', '#ffffff', 3.5) + [-28, -10, 8, 26].map(x => el(x, 3, 1.8, 3, OL, 0)).join(''),
  /* ---- Thân: gốc = giữa ngực, chuẩn rộng 60, cao 72 ---- */
  armor: () => pa('M-27,-26 Q0,-32 27,-26 L24,6 Q0,22 -24,6 Z', cel('#c9d4e6', '#6c81a3'), 4.5) + ln('M0,-28 V14', '#6c81a3', 2.5) + ln('M-22,-20 Q0,-25 22,-20', '#ffd21f', 3) +
    rivet(-17, -14, 2.4) + rivet(17, -14, 2.4) + pa(starPath(0, -6, 8, 3.4), '#ffd21f', 2.2) + hl(-14, -20, 6, 2.5, -20, .6),
  belt: () => pa('M-31,22 Q0,28 31,22 L31,34 Q0,40 -31,34 Z', cel('#2a1f63', '#140a30'), 3.5) + pa('M-15,18 Q0,15 15,18 L17,34 Q0,42 -17,34 Z', 'url(#gGold)', 4) +
    ci(0, 27, 6, '#ff3b4f', 2.5) + ci(-10, 27, 2.4, '#33e1ff', 1.6) + ci(10, 27, 2.4, '#33e1ff', 1.6) + hl(-8, 21, 4, 1.5, -10, .7)
};
// Điểm neo y của từng ô và chuẩn bề ngang
const WEAR_SLOT = { head: [0, 70], eyes: [0, 63], neck: [0, 60], back: [0, 80], body: [0, 60] };

/* ---- Hiệu ứng: b = sau lưng pet, f = trước pet ---- */
const FX_ART = {
  sparkle: (g) => ({ f: `<g class="fx-sparkle">` + [[24, g.hy - 30, 9], [178, g.hy - 6, 7], [170, 160, 8], [28, 150, 6], [140, g.hy - 52, 6], [60, g.hy - 50, 5]].map(([x, y, r], i) => spark4(x, y, r, i % 2 ? '#fff6b0' : '#ffffff', 2, 'twinkle', i * .3)).join('') + `</g>` }),
  trail: (g) => ({ b: `<g class="fx-trail">` + [[-1, 60], [-1, 110], [1, 84], [1, 140], [-1, 160]].map(([sd, y], i) => { const x0 = sd < 0 ? 4 : 196, L = 40 + (i % 3) * 14; return `<path d="M${x0},${y} h${-sd * L}" stroke="${OL}" stroke-width="9" stroke-linecap="round" opacity=".6"/><path class="streak" style="animation-delay:-${i * .25}s" d="M${x0},${y} h${-sd * L}" stroke="${i % 2 ? '#33e1ff' : '#ffffff'}" stroke-width="4.5" stroke-linecap="round"/>`; }).join('') + `</g>` }),
  // g.halo = [x, y, rx] do petInner tính theo đầu thật (haloAt); không có thì theo RIG như cũ (x = 100).
  // Quầng sáng nền vẫn giữ chỗ cũ, sau thân pet.
  halo: (g) => {
    const [x, cy, rx] = g.halo || [100, g.hy - g.hry - 8, g.hrx * .7], ry = rx * .18 / .7;
    return {
      b: `<circle cx="100" cy="${f1(g.hy + 30)}" r="92" fill="url(#gGlow)" opacity=".5"/>`,
      f: `<g class="float">` + `<ellipse cx="${f1(x)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="${OL}" stroke-width="10"/><ellipse cx="${f1(x)}" cy="${f1(cy)}" rx="${f1(rx)}" ry="${f1(ry)}" fill="none" stroke="#ffe14d" stroke-width="5"/><ellipse cx="${f1(x - rx * .3 / .7)}" cy="${f1(cy - rx * .12 / .7)}" rx="6" ry="1.6" fill="#fff"/>` + `</g>`
    };
  },
  lightning: (g) => ({ f: `<g class="fx-bolt">` + [[14, 70, 30, '#ffd21f'], [168, 100, 26, '#33e1ff'], [158, 30, 22, '#ffd21f'], [22, 150, 22, '#33e1ff']].map(([x, y, h, c], i) => `<g class="flick" style="animation-delay:-${i * .37}s">${bolt(x, y, h, c, 3)}</g>`).join('') + `</g>` }),
  fireRing: (g) => {
    let s = '';
    for (let i = 0; i < 9; i++) { const x = 18 + i * 20.5, y = GROUND + 2 - Math.sin(i / 8 * Math.PI) * 6; s += flame(x, y, 22 + (i % 2) * 10, 16, (i % 3 - 1) * 3, true, 3.5); }
    return { b: `<g class="flame-row">${s}</g>`, f: '' };
  }
};

function wearSVG(slot, item, anc, g, petId) {
  if (!item) return '';
  if (slot === 'fxb' || slot === 'fxf') {
    const fn = FX_ART[item]; if (!fn) return '';
    const r = fn(g); return (slot === 'fxb' ? r.b : r.f) || '';
  }
  const fn = WEAR_ART[item], a = anc[slot]; if (!fn || !a) return '';
  const k = a[2] / WEAR_SLOT[slot][1];
  if (slot === 'back') { const ky = a[3] / 72; return `<g transform="translate(${f1(a[0])} ${f1(a[1])}) scale(${f1(k * 1000) / 1000} ${f1(ky * 1000) / 1000})">${fn()}</g>`; }
  if (slot === 'body') { return `<g transform="translate(${f1(a[0])} ${f1(a[1])}) scale(${f1(k * 1000) / 1000} ${f1(a[3] / 72 * 1000) / 1000})">${fn()}</g>`; }
  return `<g transform="translate(${f1(a[0])} ${f1(a[1])}) scale(${f1(k * 1000) / 1000})">${fn()}</g>`;
}

/* ---------- Đồ độc quyền vòng quay (bản 4) ---------- */
const RAINBOW = ['#ff3b4f', '#ff9a1f', '#ffe14d', '#3fe06a', '#33b5ff', '#8a5cff'];
Object.assign(WEAR_ART, {
  // Mũ: vương miện đỏ vàng, 5 chóp, đá bảy màu
  gcrown: () => pa('M-34,16 L-40,-20 L-22,-6 L-12,-34 L0,-12 L12,-34 L22,-6 L40,-20 L34,16 Q0,24 -34,16 Z', 'url(#gGold)', 4.5) +
    pa('M-33,8 Q0,15 33,8 L34,16 Q0,24 -34,16 Z', cel('#ff3b4f', '#b81d3a'), 3.5) + ln('M-30,4 Q0,10 30,4', '#e08a00', 2.5) +
    [-24, -12, 0, 12, 24].map((x, i) => ci(x, 13 + Math.abs(x) * -.04, 3.6, RAINBOW[i + 1], 2)).join('') +
    ci(0, -2, 6, '#ff3b4f', 2.8) + hl(-2, -4, 2, 1.2, -30, .8) + [[-40, -20], [-12, -34], [12, -34], [40, -20]].map(([x, y], i) => ci(x, y, 4, RAINBOW[i * 2 % 6], 2)).join('') +
    `<g class="twinkle">${spark4(-30, -30, 6, '#fff6b0', 1.8)}</g><g class="twinkle" style="animation-delay:.6s">${spark4(32, -34, 5, '#ffffff', 1.6)}</g>` + hl(-18, -8, 5, 2, -30, .7),
  // Kính: hai mắt kính hình sao, tròng ánh cầu vồng
  gstar: () => ln('M-38,-2 Q0,-10 38,-2', OL, 5) + [-1, 1].map(sd => pa(starPath(sd * 18, 1, 17, 8.5, 5, -90), lin('#ff5fa2', '#ffd21f', '#33e1ff'), 4)).join('') +
    ln('M-24,-6 L-18,-1 M12,-6 L18,-1', '#fff', 2.5, 'opacity=".8"') + ln('M-4,-3 Q0,-6 4,-3', OL, 4),
  // Cổ: khăn lụa bảy màu, đuôi bay
  gsash: () => { let s = ''; RAINBOW.forEach((c, i) => { const y = -6 + i * 2.2; s += `<path d="M-31,${f1(y)} Q0,${f1(y + 12)} 31,${f1(y)}" fill="none" stroke="${c}" stroke-width="2.6"/>`; }); return pa('M-32,-8 Q0,4 32,-8 L32,8 Q0,20 -32,8 Z', 'none', 4) + s + pa('M-32,-8 Q0,4 32,-8 L32,8 Q0,20 -32,8 Z', 'none', 4) +
    `<g class="wave">${pa('M16,8 Q30,22 26,40 L34,44 Q40,22 26,4 Z', lin('#ff3b4f', '#ffe14d', '#33b5ff'), 3.5)}</g>`; },
  // Lưng: đôi cánh vàng kim to, giơ cao ra hai bên để ló khỏi thân cả pet dạng 4 rộng
  gwings: () => [-1, 1].map(sd => {
    const bx = sd * 6, by = 8;
    const pts = [[96, -92], [104, -50], [90, -14], [68, 8], [42, 18], [18, 16]];
    const wing = k => {
      const Q = ([x, y]) => [bx + sd * x * k, by + y * k];
      const [tx, ty] = Q(pts[0]);
      let d = `M${P(bx, by)} C${P(bx + sd * 18 * k, by - 58 * k)} ${P(bx + sd * 58 * k, by - 98 * k)} ${P(tx, ty)}`;
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = Q(pts[i - 1]), [cx, cy] = Q(pts[i]), mx_ = (ax + cx) / 2, my = (ay + cy) / 2;
        const ox = mx_ - bx, oy = my - by, L = Math.hypot(ox, oy) || 1;
        d += ` Q${P(mx_ + ox / L * 11 * k, my + oy / L * 11 * k)} ${P(cx, cy)}`;
      }
      return d + ` Q${P(bx + sd * 8 * k, by + 12 * k)} ${P(bx, by)} Z`;
    };
    let s = pa(wing(1), 'url(#gGold)', 4.5) + pa(wing(.72), '#fff6b0', 3.5) + pa(wing(.46), cel('#ffd21f', '#e08a00'), 3);
    // gân lông
    [[1, .9], [2, .9], [3, .88], [4, .85]].forEach(([i, k]) => { const [x, y] = pts[i]; s += ln(`M${P(bx + sd * x * .5, by + y * .5)} L${P(bx + sd * x * k, by + y * k)}`, '#e08a00', 2.2); });
    return `<g class="pt" style="transform-origin:${sd < 0 ? '100% 100%' : '0% 100%'};animation-name:${sd < 0 ? 'flapl' : 'flapr'};animation-duration:1.6s">${s}</g>`;
  }).join('')
});
Object.assign(FX_ART, {
  // Hào quang Sử thi: tia cầu vồng xoay sau lưng + đá quý bay quanh
  gaura: (g) => {
    const cy = g.hy + 30;
    let rays = '';
    for (let i = 0; i < 12; i++) { const a0 = (i * 30 - 8) * Math.PI / 180, a1 = (i * 30 + 8) * Math.PI / 180; rays += `<path d="M100,${f1(cy)} L${P(100 + 104 * Math.cos(a0), cy + 104 * Math.sin(a0))} L${P(100 + 104 * Math.cos(a1), cy + 104 * Math.sin(a1))} Z" fill="${RAINBOW[i % 6]}"/>`; }
    const gems = [[20, g.hy - 10], [180, g.hy + 10], [32, 160], [170, 156], [100, g.hy - 66]];
    return {
      b: `<circle cx="100" cy="${f1(cy)}" r="92" fill="url(#gGlow)" opacity=".55"/><g opacity=".42"><g class="spin" style="transform-origin:100px ${f1(cy)}px">${rays}</g></g>` +
        `<circle cx="100" cy="${f1(cy)}" r="80" fill="none" stroke="#fff6b0" stroke-width="3" stroke-dasharray="2 9" stroke-linecap="round" opacity=".8"/>`,
      f: `<g class="fx-gems">` + gems.map(([x, y], i) => `<g class="float" style="animation-delay:-${f1(i * .4)}s">${pa(`M${P(x, y - 7)} L${P(x + 6, y)} L${P(x, y + 8)} L${P(x - 6, y)} Z`, RAINBOW[(i * 2) % 6], 2.2)}${hl(x - 1.5, y - 2.5, 1.6, 1, 0, .8)}</g>`).join('') + `</g>`
    };
  }
});
