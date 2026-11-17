/* ===================== ICON SVG (viewBox 0 0 64 64), thay toàn bộ emoji ===================== */
const IW = 3.5;
const ICONS = {
  /* ---- Chỉ số, giao diện ---- */
  fire: () => flame(32, 58, 52, 38, 3, true, IW),
  shield: () => pa('M32,5 L54,13 L54,30 Q54,50 32,60 Q10,50 10,30 L10,13 Z', cel('#5fd2ff', '#1f8ad6'), IW) + pa('M32,13 L46,18 L46,31 Q46,44 32,51 Z', '#bff4ff', 0, 'opacity=".6"') + hl(20, 20, 5, 2.5, -30, .6),
  coin: () => ci(32, 34, 24, cel('#ffd21f', '#d99500'), IW) + ci(32, 34, 16, 'none', 2.6, 'stroke-dasharray="3 3"') + pa(starPath(32, 35, 9, 4), '#fff6b0', 2.2) + hl(20, 22, 6, 3, -30, .7),
  meat: () => pa('M14,44 Q4,30 16,16 Q30,4 44,14 Q54,22 48,36 Q40,48 26,48 Z', cel('#ff6a4d', '#c2380f'), IW) + pa('M22,24 Q28,18 36,22', 'none', 0) + ln('M22,24 Q28,18 36,22', '#ffb3a0', 3) +
    pa('M38,42 L52,56 Q58,54 56,50 Q60,46 54,44 L44,36 Z', '#fff6e6', IW) + ci(56, 50, 5, '#fff6e6', IW) + ci(51, 55, 5, '#fff6e6', IW) + hl(20, 22, 5, 2.5, -30, .6),
  gear: () => { let d = ''; for (let i = 0; i < 8; i++) d += `<rect x="27" y="4" width="10" height="14" rx="2" transform="rotate(${i * 45} 32 32)"/>`; return bl(`<circle cx="32" cy="32" r="20"/>${d}`, cel('#c9d4e6', '#6c81a3'), IW) + ci(32, 32, 8, '#4130c4', IW); },
  dice: () => `<rect x="8" y="8" width="48" height="48" rx="12" fill="${cel('#ffffff', '#c9c0f0')}" stroke="${OL}" stroke-width="${IW}"/>` + [[22, 22], [42, 22], [32, 32], [22, 42], [42, 42]].map(([x, y]) => ci(x, y, 4.5, '#ff4d6a', 0)).join(''),
  check: () => ln('M12,34 L26,48 L52,16', OL, 11) + ln('M12,34 L26,48 L52,16', '#3fe06a', 5.5),
  trophy: () => pa('M18,8 H46 V24 Q46,40 32,42 Q18,40 18,24 Z', 'url(#gGold)', IW) + ln('M18,14 Q6,14 8,24 Q10,30 19,30 M46,14 Q58,14 56,24 Q54,30 45,30', OL, IW) + pa('M28,42 L26,50 H38 L36,42 Z', '#ffd21f', IW) +
    `<rect x="18" y="50" width="28" height="8" rx="3" fill="#8a5cff" stroke="${OL}" stroke-width="${IW}"/>` + pa(starPath(32, 24, 8, 3.5), '#fff6b0', 2),
  heartbeat: () => pa('M32,56 Q6,40 6,22 Q6,8 19,8 Q27,8 32,16 Q37,8 45,8 Q58,8 58,22 Q58,40 32,56 Z', cel('#ff4d6a', '#c42246'), IW) + ln('M10,30 H22 L26,22 L32,40 L37,28 L40,32 H54', '#fff', 3.5),
  download: () => `<rect x="10" y="40" width="44" height="16" rx="5" fill="${cel('#4130c4', '#2a1f80')}" stroke="${OL}" stroke-width="${IW}"/>` + pa('M24,8 H40 V26 H50 L32,44 L14,26 H24 Z', cel('#3fe06a', '#1d9a40'), IW),
  folder: () => pa('M6,16 Q6,10 12,10 H26 L31,16 H52 Q58,16 58,22 V50 Q58,56 52,56 H12 Q6,56 6,50 Z', cel('#ffd21f', '#d99500'), IW) + ln('M8,24 H56', '#d99500', 3),
  phone: () => `<rect x="16" y="4" width="32" height="56" rx="7" fill="${cel('#4130c4', '#2a1f80')}" stroke="${OL}" stroke-width="${IW}"/><rect x="21" y="11" width="22" height="38" rx="3" fill="#33e1ff" stroke="${OL}" stroke-width="2.4"/>` + ci(32, 54, 2.6, '#fff', 0) + ln('M32,20 V38 M25,31 L32,38 L39,31', OL, 3),
  sparkle: () => spark4(28, 30, 22, '#ffd21f', IW) + spark4(50, 14, 9, '#ffffff', 2.4) + spark4(50, 50, 7, '#33e1ff', 2.2),
  lock: () => ln('M20,28 V20 Q20,8 32,8 Q44,8 44,20 V28', OL, 10) + ln('M20,28 V20 Q20,8 32,8 Q44,8 44,20 V28', '#c9d4e6', 4) + `<rect x="12" y="26" width="40" height="32" rx="7" fill="${cel('#ffd21f', '#d99500')}" stroke="${OL}" stroke-width="${IW}"/>` + ci(32, 40, 4.5, OL, 0) + `<rect x="30" y="40" width="4" height="10" rx="2" fill="${OL}"/>`,
  star: () => pa(starPath(32, 34, 28, 12), cel('#ffd21f', '#d99500'), IW) + hl(24, 24, 5, 2.4, -30, .6),
  evolve: () => pa('M32,4 L54,30 H42 V58 H22 V30 H10 Z', cel('#3fe06a', '#1d9a40'), IW) + spark4(50, 50, 8, '#ffd21f', 2.2) + hl(26, 30, 3, 8, 0, .4),
  bag: () => ln('M22,24 V16 Q22,6 32,6 Q42,6 42,16 V24', OL, 4) + pa('M8,22 H56 L52,58 H12 Z', cel('#ff8a1f', '#c2560a'), IW) + pa('M20,22 H44', 'none', 0) + ci(22, 28, 3, OL, 0) + ci(42, 28, 3, OL, 0) + pa(starPath(32, 42, 8, 3.5), '#ffd21f', 2),
  paw: () => el(32, 42, 15, 13, cel('#ffb21f', '#d47f00'), IW) + [[13, 26], [24, 14], [40, 14], [51, 26]].map(([x, y]) => el(x, y, 6.5, 8, cel('#ffb21f', '#d47f00'), 3)).join(''),
  hat: () => pa('M12,40 Q12,10 32,10 Q52,10 52,40 Z', cel('#2b6cff', '#163f9e'), IW) + pa('M4,40 Q32,32 60,40 Q60,48 50,48 Q32,42 14,48 Q4,48 4,40 Z', cel('#2457d6', '#12307a'), IW) + pa(starPath(32, 26, 7, 3), '#ffd21f', 2),
  magic: () => spark4(32, 32, 24, '#ff9ef0', IW) + ci(32, 32, 6, '#fff', 2),
  tent: () => pa('M4,56 L32,8 L60,56 Z', cel('#ff8a1f', '#c2560a'), IW) + pa('M24,56 L32,34 L40,56 Z', '#3a1d0a', 3) + ln('M32,8 V2', OL, 3),
  calendar: () => `<rect x="6" y="10" width="52" height="48" rx="9" fill="#fff" stroke="${OL}" stroke-width="${IW}"/>` + pa('M6,20 Q6,10 15,10 H49 Q58,10 58,20 V24 H6 Z', '#ff4d6a', IW) + ln('M18,4 V14 M46,4 V14', OL, 4.5) + ln('M18,40 L28,49 L46,32', '#2fbf5a', 5),
  rice: () => pa('M8,30 Q32,26 56,30 Q54,52 32,56 Q10,52 8,30 Z', cel('#ff6a4d', '#c2380f'), IW) + pa('M10,30 Q12,14 32,14 Q52,14 54,30 Q32,34 10,30 Z', cel('#ffffff', '#e3e6f5'), IW) +
    [[22, 22], [30, 18], [40, 21], [34, 26], [26, 27], [44, 26]].map(([x, y]) => el(x, y, 2.2, 1.3, '#d4d8ec', 0)).join('') + ln('M16,42 Q32,46 48,42', '#fff', 2.5, 'opacity=".5"'),
  egg: () => pa('M32,6 C46,6 54,28 54,40 C54,52 44,60 32,60 C20,60 10,52 10,40 C10,28 18,6 32,6 Z', cel('#fff6e6', '#e6c9a0'), IW) + hl(24, 22, 5, 8, 20, .7),
  chevron: () => ln('M18,24 L32,40 L46,24', OL, 6),
  close: () => ln('M16,16 L48,48 M48,16 L16,48', OL, 7),
  plus: () => ln('M32,12 V52 M12,32 H52', OL, 7),
  info: () => ci(32, 32, 26, cel('#33e1ff', '#16a3c4'), IW) + ci(32, 18, 4, OL, 0) + `<rect x="28" y="26" width="8" height="24" rx="4" fill="${OL}"/>`,
  arrowL: () => ln('M40,12 L20,32 L40,52', OL, 7),
  arrowR: () => ln('M24,12 L44,32 L24,52', OL, 7),
  brake: () => pa('M32,6 L58,52 H6 Z', cel('#ff8a1f', '#c2560a'), IW) + `<rect x="29" y="22" width="6" height="16" rx="3" fill="${OL}"/>` + ci(32, 45, 3.5, OL, 0),
  /* ---- Mục trong ngày ---- */
  scale: () => `<rect x="6" y="14" width="52" height="44" rx="12" fill="${cel('#33e1ff', '#16a3c4')}" stroke="${OL}" stroke-width="${IW}"/>` + pa('M16,34 A16,16 0 0 1 48,34 Z', '#fff', 3) + ln('M32,34 L39,22', '#ff3b4f', 4) + ci(32, 34, 3, OL, 0) + `<rect x="18" y="44" width="28" height="7" rx="3.5" fill="${OL}" opacity=".45"/>`,
  barbell: () => tube('M6,32 H58', '#e6edf7', 5, 3) + `<rect x="10" y="16" width="9" height="32" rx="3" fill="${cel('#ff3b4f', '#b81d3a')}" stroke="${OL}" stroke-width="3"/><rect x="45" y="16" width="9" height="32" rx="3" fill="${cel('#ff3b4f', '#b81d3a')}" stroke="${OL}" stroke-width="3"/>` +
    `<rect x="19" y="22" width="6" height="20" rx="2" fill="#2b6cff" stroke="${OL}" stroke-width="2.6"/><rect x="39" y="22" width="6" height="20" rx="2" fill="#2b6cff" stroke="${OL}" stroke-width="2.6"/>`,
  abs: () => `<rect x="12" y="6" width="40" height="52" rx="14" fill="${cel('#ffb06a', '#d9783a')}" stroke="${OL}" stroke-width="${IW}"/>` + [[24, 18], [40, 18], [24, 32], [40, 32], [24, 46], [40, 46]].map(([x, y]) => `<rect x="${x - 7}" y="${y - 5.5}" width="14" height="11" rx="4" fill="${cel('#ffc890', '#e0904a')}" stroke="${OL}" stroke-width="2.4"/>`).join(''),
  walk: () => pa('M10,44 Q10,30 22,28 L34,24 Q40,22 42,30 L44,38 Q56,40 56,48 V52 H10 Z', cel('#33e1ff', '#16a3c4'), IW) + pa('M8,50 H58 V56 Q58,58 54,58 H12 Q8,58 8,54 Z', '#fff', IW) + ln('M28,30 L32,38 M36,28 L39,36', OL, 2.6),
  hiit: () => pa('M32,58 Q8,44 8,26 Q8,10 21,10 Q28,10 32,18 Q36,10 43,10 Q56,10 56,26 Q56,44 32,58 Z', cel('#ff4d6a', '#c42246'), IW) + bolt(29, 14, 38, '#ffd21f', 3),
  steps: () => el(22, 36, 10, 16, cel('#ffb06a', '#d9783a'), IW, 'transform="rotate(-10 22 36)"') + el(42, 28, 9, 14, cel('#ffb06a', '#d9783a'), IW, 'transform="rotate(10 42 28)"') +
    [[14, 14], [20, 11], [26, 13]].map(([x, y]) => ci(x, y, 3, '#ffb06a', 2.2)).join('') + [[36, 8], [42, 6], [48, 8]].map(([x, y]) => ci(x, y, 2.6, '#ffb06a', 2.2)).join(''),
  meal: () => el(32, 44, 28, 12, cel('#ffffff', '#c9c0f0'), IW) + el(32, 41, 20, 7, '#e6e2fa', 0) + pa('M20,40 Q12,28 22,18 Q32,10 40,20 Q46,28 40,36 Q32,44 20,40 Z', cel('#ffb06a', '#d9783a'), IW) + pa('M38,34 L48,22 Q52,18 54,22 Q58,22 56,26 L44,38 Z', '#fff6e6', 3),
  water: () => pa('M32,4 Q50,28 50,40 Q50,58 32,58 Q14,58 14,40 Q14,28 32,4 Z', cel('#33e1ff', '#1f8ad6'), IW) + hl(25, 38, 4, 8, 15, .7),
  sleep: () => pa('M40,8 A24,24 0 1 0 58,40 A19,19 0 0 1 40,8 Z', cel('#ffd21f', '#d99500'), IW) + `<text x="14" y="24" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="18" fill="#fff" stroke="${OL}" stroke-width="3" paint-order="stroke">z</text><text x="6" y="38" font-family="'Baloo 2',sans-serif" font-weight="800" font-size="12" fill="#fff" stroke="${OL}" stroke-width="2.5" paint-order="stroke">z</text>`,
  tape: () => ci(26, 30, 20, cel('#ffd21f', '#d99500'), IW) + ci(26, 30, 7, '#fff', 3) + pa('M26,50 H58 V60 H26 Z', '#fff6d8', IW) + ln('M34,50 V55 M40,50 V57 M46,50 V55 M52,50 V57', OL, 2),
  /* ---- Món ăn ---- */
  chicken: () => pa('M6,30 Q8,14 26,12 Q46,10 56,22 Q62,32 52,44 Q40,56 24,52 Q6,46 6,30 Z', cel('#f5c27a', '#d98a3a'), IW) + ln('M18,22 L30,44 M28,16 L42,46 M40,16 L52,38', '#b8642a', 3.2) + hl(18, 22, 6, 2.5, -30, .6),
  egg2: () => el(32, 36, 26, 20, cel('#ffffff', '#e3e6f5'), IW) + ci(32, 36, 11, cel('#ffc21f', '#e08a00'), 3) + hl(26, 31, 3, 1.6, -20, .7),
  eggwhite: () => el(32, 34, 24, 28, cel('#ffffff', '#dfe3f2'), IW, 'transform="rotate(-20 32 34)"') + el(34, 36, 10, 12, '#e8ebf7', 2.4, 'transform="rotate(-20 34 36)"') + hl(22, 22, 4, 7, 20, .8),
  tofu: () => pa('M10,24 L30,14 L54,22 L54,46 L34,56 L10,46 Z', '#fff4d6', IW) + pa('M10,24 L34,32 L54,22 L30,14 Z', '#fffbe8', 3) + ln('M34,32 V56', OL, 3) + ci(22, 38, 1.6, '#e6d4a0', 0) + ci(44, 40, 1.6, '#e6d4a0', 0),
  greens: () => leaf(32, 58, 40, -100, '#4fd06a', '#1d8a45', IW) + leaf(30, 58, 34, -135, '#7be35a', '#2f9a3e', IW) + leaf(34, 58, 34, -45, '#3fbf5a', '#1d8a45', IW),
  cucumber: () => `<g transform="rotate(-30 32 32)">${el(32, 32, 26, 10, cel('#3fbf5a', '#1d7a35'), IW)}${ln('M14,30 h6 M26,28 h6 M38,30 h6', '#9df27a', 2)}</g>` + ci(46, 46, 11, cel('#ff4d4d', '#c42222'), 3) + ln('M42,36 l4,3 l4,-3', '#2f9a3e', 3),
  cabbage: () => ci(32, 34, 24, cel('#c9f29a', '#7bbf4a'), IW) + ln('M32,12 Q22,30 30,56 M32,12 Q44,30 36,56 M10,32 Q32,28 54,32', '#7bbf4a', 2.6) + hl(22, 22, 5, 2.5, -30, .6),
  oil: () => pa('M24,6 H40 V14 Q48,18 48,28 V54 Q48,58 44,58 H20 Q16,58 16,54 V28 Q16,18 24,14 Z', cel('#ffe14d', '#e0a000'), IW) + `<rect x="24" y="2" width="16" height="7" rx="2" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>` + pa('M32,30 Q38,38 38,42 Q38,48 32,48 Q26,48 26,42 Q26,38 32,30 Z', '#fff6b0', 2.4),
  guava: () => ci(32, 36, 22, cel('#9de05a', '#4a9a2a'), IW) + leaf(34, 14, 16, -50, '#3fbf5a', '#1d7a35', 2.6) + ln('M32,15 V8', '#6e3c18', 3) + ci(32, 36, 8, '#ff9ab4', 0, 'opacity=".55"') + hl(22, 28, 5, 3, -30, .6),
  banana: () => pa('M10,20 Q14,50 40,54 Q54,54 58,46 Q46,48 34,40 Q20,30 18,14 Z', cel('#ffe14d', '#d9a000'), IW) + ln('M18,14 L14,8', '#6e3c18', 4) + ln('M20,26 Q26,40 42,46', '#d9a000', 2.4),
  whey: () => pa('M14,16 H50 L46,58 H18 Z', cel('#4130c4', '#2a1f80'), IW) + `<rect x="12" y="8" width="40" height="10" rx="4" fill="#ff3b4f" stroke="${OL}" stroke-width="3"/>` + `<rect x="20" y="28" width="24" height="16" rx="3" fill="#fff" stroke="${OL}" stroke-width="2.4"/>` + ln('M26,34 h12 M26,39 h8', OL, 2.2),
  coffee: () => pa('M10,22 H46 V44 Q46,56 28,56 Q10,56 10,44 Z', cel('#ffffff', '#c9c0f0'), IW) + ln('M46,28 Q58,28 56,38 Q54,44 46,44', OL, 4) + el(28, 22, 17, 4, '#7a4a24', 2.4) + ln('M22,6 q-4,5 0,10 M32,4 q-4,5 0,10', '#c9c0f0', 3),
  pill: () => `<g transform="rotate(-40 32 32)"><rect x="8" y="22" width="48" height="20" rx="10" fill="#fff" stroke="${OL}" stroke-width="${IW}"/><path d="M32,22 H46 A10,10 0 0 1 46,42 H32 Z" fill="#ff4d6a" stroke="${OL}" stroke-width="${IW}"/></g>`,
  /* ---- Chất dinh dưỡng ---- */
  protein: () => pa('M14,44 Q4,30 16,16 Q30,4 44,14 Q54,22 48,36 Q40,48 26,48 Z', cel('#ff6a4d', '#c2380f'), IW) + pa('M38,42 L52,56 Q58,54 56,50 Q60,46 54,44 L44,36 Z', '#fff6e6', IW) + ci(56, 50, 5, '#fff6e6', IW) + ci(51, 55, 5, '#fff6e6', IW),
  carb: () => el(32, 34, 14, 24, cel('#fff6d8', '#e6d0a0'), IW, 'transform="rotate(30 32 34)"') + ln('M24,22 Q32,34 40,46', '#e6d0a0', 2.4),
  fat: () => pa('M32,4 Q52,30 52,42 Q52,60 32,60 Q12,60 12,42 Q12,30 32,4 Z', cel('#ffe14d', '#e0a000'), IW) + hl(25, 40, 4, 8, 15, .7),
  kcal: () => flame(32, 58, 52, 38, 3, true, IW)
};
const ICON_CACHE = {};
function ic(name, cls = '') {
  const k = name + '|' + cls;
  if (!ICON_CACHE[k]) { const f = ICONS[name]; ICON_CACHE[k] = `<svg class="ic ${cls}" viewBox="0 0 64 64" aria-hidden="true">${f ? f() : ''}</svg>`; }
  return ICON_CACHE[k];
}
