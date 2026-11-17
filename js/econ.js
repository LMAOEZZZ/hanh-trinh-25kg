/* ===================== KINH TẾ, PET, CỬA HÀNG, THÀNH TỰU (dữ liệu) =====================
   Khối ECON giữa hai dấu ECON-JSON là JSON thuần: script mô phỏng python đọc trực tiếp khối này. */
const ECON = /*ECON-JSON*/{
  "egg": { "first": 1, "every": 2 },
  "hatchW": [5, 4, 3, 2],
  "item": { "meat": 1, "coin": 3 },
  "commit": { "meat": 4, "coin": 10 },
  "comeback": { "meat": 8, "coin": 25 },
  "streak": {
    "3": { "meat": 4, "coin": 15 }, "7": { "meat": 8, "coin": 30 }, "14": { "meat": 10, "coin": 45 }, "21": { "meat": 12, "coin": 60 },
    "30": { "meat": 14, "coin": 80 }, "45": { "meat": 16, "coin": 100 }, "60": { "meat": 18, "coin": 120 }, "75": { "meat": 20, "coin": 140 }, "84": { "meat": 25, "coin": 200 }
  },
  "tier": [{ "coin": 20, "meat": 3 }, { "coin": 40, "meat": 6 }, { "coin": 70, "meat": 10 }],
  "evo": { "base": [12, 22, 35], "multFirst": 0.78, "multLast": 0.36, "rar": [0.9, 1, 1.1, 1.2] },
  "evoV4": { "base": [12, 22, 35], "multFirst": 1.18, "multLast": 0.5, "n": 28 },
  "hatch": { "base": 2, "per": 0.2 },
  "pets": [
    ["wolf", "fire", 0], ["bear", "metal", 0], ["frog", "forest", 0], ["penguin", "ice", 0], ["squirrel", "thunder", 0], ["turtle", "stone", 0], ["bat", "shadow", 0],
    ["fox", "thunder", 1], ["tiger", "ice", 1], ["dragon", "fire", 1], ["pangolin", "stone", 1], ["cat", "shadow", 1], ["beetle", "forest", 1], ["scorpion", "metal", 1],
    ["salamander", "fire", 1], ["stag", "forest", 1], ["owl", "shadow", 2], ["rhino", "stone", 2], ["bull", "metal", 2], ["mammoth", "ice", 2], ["eagle", "thunder", 2],
    ["panda", "forest", 2], ["mecha", "metal", 2], ["gorilla", "stone", 2], ["panther", "shadow", 3], ["yeti", "ice", 3], ["uni", "thunder", 3], ["phoenix", "fire", 3],
    ["n_rooster", "fire", 2], ["n_hedgehog", "fire", 0], ["n_seal", "ice", 1], ["n_hare", "ice", 0], ["n_manta", "thunder", 1], ["n_dragonfly", "thunder", 0],
    ["n_crab", "stone", 0], ["n_goat", "stone", 1], ["n_chameleon", "forest", 2], ["n_boar", "forest", 0], ["n_octopus", "shadow", 0], ["n_spider", "shadow", 1],
    ["n_shark", "metal", 3], ["n_mantis", "metal", 0]
  ],
  "shop": [
    ["bandana", "head", 60], ["scarf", "neck", 70], ["shades", "eyes", 100], ["cap", "head", 130], ["medal", "neck", 150], ["beanie", "head", 170],
    ["cape", "back", 220], ["visor", "eyes", 240], ["chain", "neck", 280], ["armor", "body", 310], ["helmet", "head", 350], ["belt", "body", 390], ["royal", "back", 440], ["crown", "head", 520],
    ["sparkle", "fx", 140], ["trail", "fx", 200], ["halo", "fx", 290], ["lightning", "fx", 370], ["fireRing", "fx", 460],
    ["grass", "decor", 40], ["rock", "decor", 60], ["fire", "decor", 80], ["lantern", "decor", 110], ["flag", "decor", 140], ["tent", "decor", 170],
    ["tree", "decor", 210], ["rack", "decor", 250], ["falls", "decor", 290], ["tower", "decor", 330], ["podium", "decor", 370], ["night", "decor", 400], ["rainbow", "decor", 460]
  ],
  "ach": [
    ["first", "total", 1, 0], ["s3", "streak", 3, 0], ["evo1", "evo2", 1, 0], ["lift5", "lift", 5, 0], ["pets3", "pets", 3, 0], ["s7", "streak", 7, 0],
    ["water10", "water", 10, 0], ["shop1", "owned", 1, 0], ["heavy3", "heavy", 3, 0], ["refeed1", "refeed", 1, 0], ["food14", "food", 14, 0], ["lift15", "lift", 15, 1], ["lift20", "lift", 20, 1],
    ["s14", "streak", 14, 1], ["evo4a", "evo4", 1, 1], ["steps20", "steps", 20, 0], ["pets7", "pets", 7, 1], ["abs12", "abs", 12, 1], ["s21", "streak", 21, 1],
    ["heavy12", "heavy", 12, 1], ["water30", "water", 30, 1], ["water40", "water", 40, 1], ["total30", "total", 30, 1], ["total42", "total", 42, 1], ["total63", "total", 63, 2], ["outfit3", "outfit", 3, 1], ["food35", "food", 35, 1], ["food49", "food", 49, 1],
    ["lift36", "lift", 36, 1], ["pets12", "pets", 12, 1], ["sr1", "srare", 1, 0], ["leg1", "legend", 1, 1], ["elall", "elall", 7, 1], ["evo4c", "evo4", 10, 1], ["evo4b", "evo4", 15, 1], ["s45", "streak", 45, 2], ["steps45", "steps", 45, 1], ["steps66", "steps", 66, 2], ["heavy20", "heavy", 20, 1],
    ["fx2", "fx", 2, 1], ["total56", "total", 56, 2], ["water60", "water", 60, 1], ["pets18", "pets", 18, 2], ["abs30", "abs", 30, 2], ["s60", "streak", 60, 2],
    ["lift48", "lift", 48, 1], ["abs20", "abs", 20, 1], ["water50", "water", 50, 1], ["lift60", "lift", 60, 2], ["food70", "food", 70, 2], ["evo4d", "evo4", 20, 2], ["pets24", "pets", 24, 2], ["heavy30", "heavy", 30, 2], ["decor10", "decor", 10, 2],
    ["s75", "streak", 75, 2], ["pets28", "pets", 28, 2], ["evo4e", "evo4", 28, 2], ["pets32", "pets", 32, 2], ["elfull1", "elfull", 1, 1],
    ["pets36", "pets", 36, 2], ["evo4f", "evo4", 36, 2], ["leg5", "legend", 5, 2], ["elfull3", "elfull", 3, 2], ["pets40", "pets", 40, 2], ["pets42", "pets", 42, 2], ["evo4g", "evo4", 42, 2], ["total70", "total", 70, 2], ["total84", "total", 84, 2],
    ["k5", "kg", 5, 0], ["k10", "kg", 10, 1], ["k15", "kg", 15, 1], ["k20", "kg", 20, 2], ["k25", "kg", 25, 2],
    ["perfect", "perfectweek", 1, 1], ["comeback", "comeback", 1, 0], ["weigh7", "weighrun", 7, 0], ["sleep7", "sleeprun", 7, 0], ["measure4", "measure", 4, 0],
    ["spin1", "spin", 1, 0], ["epic1", "epic", 1, 1], ["spinrun7", "spinrun", 7, 1], ["ep4a", "ep4", 1, 1], ["epic4", "epic", 4, 1], ["spin30", "spin", 30, 1], ["spin45", "spin", 45, 1],
    ["epic7", "epic", 7, 2], ["spinrun30", "spinrun", 30, 2], ["spin60", "spin", 60, 2], ["ep4g", "ep4", 7, 2]
  ],
  "epics": [["ep_nghe", "fire"], ["ep_crane", "ice"], ["ep_loong", "thunder"], ["ep_elephant", "stone"], ["ep_butterfly", "forest"], ["ep_whale", "shadow"], ["ep_ironhorse", "metal"]],
  "epic": { "evo": [8, 14, 22], "gift": 20 },
  "gacha": {
    "pity": 8,
    "slots": [
      ["epic", 11, 0, 0], ["item", 6, 0, 0], ["shield", 8, 0, 0], ["x2", 10, 0, 0],
      ["meatL", 14, 12, 0], ["coinL", 13, 0, 90], ["meatS", 20, 5, 0], ["coinS", 18, 0, 30]
    ],
    "chest": [30, 120], "itemDup": [12, 80], "shieldDup": [10, 30], "shieldCap": 3
  },
  "gitems": [["gcrown", "head"], ["gstar", "eyes"], ["gsash", "neck"], ["gwings", "back"], ["gaura", "fx"]]
}/*ECON-JSON*/;

const ELEMENTS = {
  fire: { n: 'Lửa', c: '#ff6a2b', bg: ['#ff8a3d', '#a8261f'] }, ice: { n: 'Băng', c: '#33e1ff', bg: ['#8fe0ff', '#2a6ad6'] },
  thunder: { n: 'Sấm', c: '#ffd21f', bg: ['#ffd84a', '#7a4cff'] }, stone: { n: 'Đá', c: '#c99a6b', bg: ['#e0b07a', '#7a5232'] },
  forest: { n: 'Rừng', c: '#3fe06a', bg: ['#7be35a', '#1f7a45'] }, shadow: { n: 'Bóng đêm', c: '#b46bff', bg: ['#8a5cff', '#2a1260'] },
  metal: { n: 'Thép', c: '#a7b8d0', bg: ['#c9d4e6', '#3d4c70'] }
};
// Độ hiếm từ thấp tới cao. Bản 4: bậc tím cũ đổi tên thành "Siêu hiếm", "Sử thi" thành bậc cao nhất (chỉ có từ vòng quay).
const EPIC_BG = 'linear-gradient(100deg,#ff3b4f 0%,#ffd21f 28%,#fff6b0 44%,#3fe06a 60%,#33e1ff 76%,#b46bff 100%)';
const RARITY = [{ n: 'Thường', c: '#9fb1c9' }, { n: 'Hiếm', c: '#38b6ff' }, { n: 'Siêu hiếm', c: '#b46bff' }, { n: 'Huyền thoại', c: '#ffc21f' }, { n: 'Sử thi', c: EPIC_BG, epic: true }];
const rarTag = (r, cls = 'tag-el') => `<span class="${cls}${RARITY[r].epic ? ' epic-tag' : ''}" style="background:${RARITY[r].c}">${RARITY[r].n}</span>`;
const PET_INFO = {
  wolf: ['Sói Lửa', 'Nóng tính, trung thành, ghét nhất ngày bỏ tập. Hú một tiếng là cả trại dậy đi tập.'],
  bear: ['Gấu Thép', 'Thân thép, đầu lạnh. Nâng gì cũng được, trừ trà sữa.'],
  frog: ['Ếch Rừng', 'Nhảy xa nhất ao. Tin rằng 15.000 bước là khởi động.'],
  penguin: ['Cánh Cụt Băng', 'Đi lạch bạch nhưng chưa trễ buổi tập nào.'],
  squirrel: ['Sóc Sấm', 'Tích trữ đạm như tích hạt dẻ. Đuôi tóe điện khi phấn khích.'],
  turtle: ['Rùa Đá', 'Chậm mà chắc. Mai đá dày hơn mọi cái cớ.'],
  bat: ['Dơi Đêm', 'Thức đêm canh tủ lạnh, ai mở là nó kêu.'],
  fox: ['Cáo Sấm', 'Nhanh như chớp, lắm mồm như sấm. Thích đếm bước chân hộ ông.'],
  tiger: ['Hổ Băng', 'Lạnh lùng ngoài mặt, trong bụng là cả lò sưởi kỷ luật.'],
  dragon: ['Rồng Lửa', 'Phun lửa đốt mỡ, nằm canh kho báu là chuỗi ngày chốt.'],
  pangolin: ['Tê Tê Đá', 'Cuộn tròn chịu đòn, mở ra là phản công.'],
  cat: ['Mèo Bóng Ma', 'Đi không tiếng động, nhảy lên cân lúc ông không để ý.'],
  beetle: ['Bọ Hung Rừng', 'Nâng được gấp trăm lần thân mình. Coi giàn squat là đồ chơi.'],
  scorpion: ['Bọ Cạp Thép', 'Đuôi kim ghim thẳng vào cơn thèm ngọt.'],
  salamander: ['Kỳ Nhông Dung Nham', 'Tắm dung nham cho ấm người. Cười suốt kể cả lúc tập Legs.'],
  stag: ['Hươu Gạc Rừng', 'Gạc mọc thêm một nhánh sau mỗi tuần không bỏ tập.'],
  owl: ['Cú Bóng Đêm', 'Canh giấc ngủ của ông. Thức khuya là nó trừng mắt.'],
  rhino: ['Tê Giác Giáp', 'Húc tan mọi cái cớ. Giáp đồng, sừng ngà, không lùi bước nào.'],
  bull: ['Bò Tót Thép', 'Thấy tạ đỏ là lao vào. Mũi phì khói sau mỗi set nặng.'],
  mammoth: ['Ma Mút Băng', 'Sống sót qua kỷ băng hà, sợ gì 12 tuần ăn kiêng.'],
  eagle: ['Đại Bàng Sấm', 'Nhìn từ trên mây vẫn thấy ông đang lười.'],
  panda: ['Gấu Trúc Võ', 'Ăn tre, đánh võ, ngủ đúng giờ. Gương mẫu toàn diện.'],
  mecha: ['Khủng Long Máy', 'Chạy bằng đạm và mồ hôi. Kính đỏ quét thấy mỡ từ xa.'],
  gorilla: ['Khỉ Đột Đá', 'Đấm vỡ tảng đá như đấm vỡ kỷ lục cũ.'],
  panther: ['Báo Đen', 'Lặng lẽ săn từng gram mỡ trong bóng tối.'],
  yeti: ['Quỷ Tuyết', 'Truyền thuyết đỉnh núi. Ít ai gặp được, ai gặp là người không bỏ cuộc.'],
  uni: ['Kỳ Lân Điện', 'Bờm phóng điện, sừng gọi sét. Chỉ hiện ra với người không bỏ cuộc.'],
  phoenix: ['Phượng Hoàng', 'Tái sinh từ tro tàn mỗi lần ông vấp ngã. Lửa của nó không bao giờ tắt.'],
  // Bản 5: 14 pet thường mới, mỗi hệ 2 con
  n_rooster: ['Gà Chọi Lửa', 'Gáy đúng 5 giờ sáng gọi ông dậy tập. Chưa thua trận nào, kể cả trận với cái gối.'],
  n_hedgehog: ['Nhím Lửa', 'Nhỏ mà có võ. Gai lửa dựng đứng mỗi khi ông với tay lấy bánh ngọt.'],
  n_seal: ['Hải Cẩu Băng', 'Trượt bụng trên băng nhanh hơn ông chạy bộ. Mỗi lần ông chê đồ ngọt, nó vỗ vây khen một cái.'],
  n_hare: ['Thỏ Tuyết', 'Nhảy một cú bằng ông đi mười bước. Đêm rằm nó ngồi trên trăng đếm bước chân hộ ông.'],
  n_manta: ['Cá Đuối Sấm', 'Dẹt như cái bánh nhưng cấm ăn. Lướt êm trên biển giông, ông định bỏ buổi tập là đuôi chích điện liền.'],
  n_dragonfly: ['Chuồn Chuồn Sấm', 'Chuồn chuồn bay thấp thì mưa, bay cao là tới giờ ông đi tập. Mắt kép nhìn thấu mọi cái cớ.'],
  n_crab: ['Cua Đá', 'Đi ngang chứ không đi lùi. Mai cứng như sỏi, cơn thèm ngọt bò tới gần là bị kẹp liền.'],
  n_goat: ['Dê Núi Đá', 'Dốc càng đứng càng mê leo. Mỗi ký giảm được là thêm một mỏm đá dưới chân.'],
  n_chameleon: ['Tắc Kè Hoa', 'Da đổi màu mỗi ngày, kỷ luật thì giữ nguyên một màu. Lưỡi dài bắt gọn mọi cơn thèm vặt bay ngang qua.'],
  n_boar: ['Lợn Rừng', 'Đã lao là không quay đầu. Ủi bay mọi cái cớ, ăn khỏe nhưng tập còn khỏe hơn.'],
  n_octopus: ['Bạch Tuộc Bóng Đêm', 'Tám xúc tu làm tám việc: cân đồ ăn, đếm hiệp, rót nước. Phun mực tím che mờ mọi cơn thèm ăn khuya.'],
  n_spider: ['Nhện Trăng', 'Giăng tơ dưới trăng, tóm gọn từng cơn thèm ngọt lúc nửa đêm.'],
  n_shark: ['Cá Mập Máy', 'Không bao giờ ngừng bơi, như ông không bao giờ bỏ buổi tập. Ngửi thấy mỡ thừa từ ba cây số.'],
  n_mantis: ['Bọ Ngựa Thép', 'Chắp tay đứng im như thiền, ra đòn thì không trượt rep nào. Hai lưỡi liềm thép chém đứt mọi lời biện hộ.']
};
// 7 pet Sử thi: mỗi hệ một con, chỉ có từ vòng quay
const EPIC_INFO = {
  ep_nghe: ['Nghê Lửa', 'Linh thú giữ cổng đình. Bờm lửa bùng lên mỗi lần ông chốt đủ ngày.'],
  ep_crane: ['Hạc Băng Cực Quang', 'Bay xuống từ trời băng, mỗi lần vỗ cánh kéo theo cả dải cực quang.'],
  ep_loong: ['Thanh Long Sấm', 'Rồng xanh cưỡi mây giông. Gầm một tiếng là cơn thèm ngọt tan biến.'],
  ep_elephant: ['Bạch Tượng Ngọc', 'Voi trắng thân ngọc. Bước tới đâu, kỷ luật vững tới đó.'],
  ep_butterfly: ['Bướm Thần Rừng', 'Từ con sâu đội lá thành thần rừng cánh kính màu. Nhắc ông: thay đổi nào cũng cần thời gian trong kén.'],
  ep_whale: ['Cá Voi Ngân Hà', 'Bơi giữa biển sao. Mỗi lần thở ra là một chùm thiên hà mới.'],
  ep_ironhorse: ['Ngựa Sắt Thánh Gióng', 'Vươn vai thành thần mã, phun lửa thiêu rụi mọi cơn lười.']
};
const PETS = ECON.pets.map(([id, el, rar], i) => ({ id, el, rar, i, name: PET_INFO[id][0], intro: PET_INFO[id][1] }));
const EPICS = ECON.epics.map(([id, el], i) => ({ id, el, rar: 4, i, epic: true, name: EPIC_INFO[id][0], intro: EPIC_INFO[id][1] }));
const ALL_PETS = PETS.concat(EPICS);
const PET_BY = Object.fromEntries(ALL_PETS.map(p => [p.id, p]));
const isEpic = id => !!(PET_BY[id] && PET_BY[id].epic);
const NPETS = PETS.length;
/* ----- Trứng (bản 5): nhận 1 trứng ở tổng số ngày đã chốt 1, 3, 5, … (đủ 42 trứng); mỗi trứng nở ra 1 pet thường ngẫu nhiên chưa có ----- */
const eggsEarned = total => total >= ECON.egg.first ? Math.min(NPETS, Math.floor((total - ECON.egg.first) / ECON.egg.every) + 1) : 0;
// Tổng ngày chốt cần để nhận trứng tiếp theo (null khi đã đủ)
const nextEggAt = total => { const n = eggsEarned(total); return n >= NPETS ? null : ECON.egg.first + ECON.egg.every * n; };
/* ----- Giá tiến hóa (stage 1: dạng 1→2, 2: 2→3, 3: 3→4) -----
   Bản 5: theo THỨ TỰ NỞ o (con nở thứ mấy, 0..41), giảm dần để con nở muộn vẫn kịp lên dạng 4; nhân hệ số nhỏ theo độ hiếm. */
function evoCost(o, stage, rar = 0) {
  const E = ECON.evo, t = Math.min(1, Math.max(0, o / (NPETS - 1))), m = E.multFirst + (E.multLast - E.multFirst) * t;
  return Math.max(3, Math.round(E.base[stage - 1] * m * E.rar[rar]));
}
// Giá bản 4 (theo thứ tự mở cố định của 28 con cũ): pet có từ bản cũ lấy giá rẻ hơn giữa hai cách, không bao giờ đắt hơn bản 4
function evoCostV4(i, stage) {
  const E = ECON.evoV4, t = Math.min(1, i / (E.n - 1)), m = E.multFirst + (E.multLast - E.multFirst) * t;
  return Math.max(3, Math.round(E.base[stage - 1] * m));
}
// Giá tiến hóa của một pet đang có (st: trạng thái pet, mặc định đọc từ state)
function costOf(id, stage, st) {
  if (isEpic(id)) return ECON.epic.evo[stage - 1];
  const p = PET_BY[id]; st = st || (typeof state !== 'undefined' && state.pets[id]) || {};
  const c = evoCost(st.o || 0, stage, p.rar);
  return st.L && p.i < ECON.evoV4.n ? Math.min(c, evoCostV4(p.i, stage)) : c;
}
// Quà nở theo thứ tự nở: nạp sẵn vào thanh thịt dạng 1→2 (tối đa giá − 1), phần dư vào kho thịt. Trả về [tổng, nạp sẵn, vào kho].
function hatchGift(o, rar) {
  const g = Math.round(ECON.hatch.base + ECON.hatch.per * o), bar = Math.min(g, evoCost(o, 1, rar) - 1);
  return [g, bar, g - bar];
}

const SHOP_INFO = {
  bandana: ['Băng đô đỏ', 'Buộc chặt trán, mồ hôi không vào mắt.'], scarf: ['Khăn chiến', 'Khăn đỏ bay phấp phới khi chạy.'], shades: ['Kính râm', 'Ngầu từ phòng tập ra tới bãi xe.'],
  cap: ['Mũ lưỡi trai', 'Mũ xanh thêu sao, đội ngược cũng được.'], medal: ['Huy chương', 'Đeo cho cả trại thấy ai đang dẫn đầu.'], beanie: ['Mũ len', 'Có quả bông trên đỉnh, ấm cả mùa đông.'],
  cape: ['Áo choàng đỏ', 'Tung bay sau lưng như siêu anh hùng.'], visor: ['Kính neon', 'Kính một tròng phát sáng xanh.'], chain: ['Dây chuyền vàng', 'Mặt dây khắc chữ −25.'],
  armor: ['Giáp ngực', 'Giáp bạc đính sao vàng.'], helmet: ['Mũ chiến binh', 'Mũ sắt có hai sừng.'], belt: ['Đai vô địch', 'Đai vàng nạm đá đỏ, chỉ dành cho nhà vô địch.'],
  royal: ['Áo choàng hoàng gia', 'Nhung tím viền vàng, cổ lông trắng.'], crown: ['Vương miện', 'Vàng ròng, ba viên đá quý.'],
  sparkle: ['Sao lấp lánh', 'Sao nhỏ nhấp nháy quanh pet.'], trail: ['Vệt sáng', 'Vệt sáng vụt qua như đang lao tới.'], halo: ['Hào quang', 'Vòng sáng vàng trên đầu và quầng sáng sau lưng.'],
  lightning: ['Tia sét', 'Sét vàng xanh lóe quanh người.'], fireRing: ['Lửa bao quanh', 'Vòng lửa cháy quanh chân.'],
  grass: ['Bãi cỏ hoa', 'Cỏ dày, hoa nhỏ lấm tấm khắp sân.'], rock: ['Đá tảng', 'Mấy tảng đá cho pet ngồi hóng gió.'], fire: ['Lửa trại', 'Đống lửa giữa sân, cháy suốt đêm.'],
  lantern: ['Đèn lồng', 'Dây đèn lồng đỏ vàng giăng ngang trời.'], flag: ['Cờ chiến', 'Cờ in chữ −25, cắm giữa sân.'], tent: ['Lều trại', 'Lều cho pet chui vào ngủ.'],
  tree: ['Cây cổ thụ', 'Tán to, rễ chắc, bóng mát cả góc sân.'], rack: ['Giàn tạ', 'Giàn squat mini để pet tập theo chủ.'], falls: ['Thác nước', 'Vách đá có thác chảy ầm ầm.'],
  tower: ['Tháp canh', 'Tháp gỗ cao, đứng trên đó thấy cả vùng.'], podium: ['Bục vinh quang', 'Bục ba bậc cho pet mạnh nhất đứng.'], night: ['Bầu trời đêm', 'Đổi trời sang đêm sao và trăng khuyết.'],
  rainbow: ['Cầu vồng', 'Cầu vồng vắt ngang sau núi.']
};
const SHOP = ECON.shop.map(([id, slot, p]) => ({ id, slot, p, cat: slot === 'fx' ? 'fx' : slot === 'decor' ? 'decor' : 'wear', n: SHOP_INFO[id][0], d: SHOP_INFO[id][1] }));
// Đồ độc quyền vòng quay: không bán trong cửa hàng, mặc như đồ thường
const GITEM_INFO = {
  gcrown: ['Vương miện Sử thi', 'Vàng đỏ nạm bảy viên đá bảy màu.'], gstar: ['Kính sao băng', 'Kính hình sao, tròng ánh cầu vồng.'],
  gsash: ['Khăn cầu vồng', 'Khăn lụa bảy màu bay theo gió.'], gwings: ['Cánh vàng kim', 'Đôi cánh lông vũ vàng ròng.'],
  gaura: ['Hào quang Sử thi', 'Tia sáng cầu vồng xoay sau lưng, đá quý bay quanh người.']
};
const GITEMS = ECON.gitems.map(([id, slot]) => ({ id, slot, p: 0, cat: slot === 'fx' ? 'fx' : 'wear', gacha: true, n: GITEM_INFO[id][0], d: GITEM_INFO[id][1] }));
const WEARABLES = SHOP.filter(x => x.cat !== 'decor').concat(GITEMS);
const SHOP_BY = Object.fromEntries(SHOP.concat(GITEMS).map(x => [x.id, x]));
const SLOT_NAME = { head: 'Mũ', eyes: 'Kính', neck: 'Cổ', back: 'Lưng', body: 'Thân', fx: 'Hiệu ứng' };

/* ----- Thành tựu: tên, mô tả, huy hiệu ----- */
const ACH_TEXT = {
  first: ['Buổi đầu tiên', 'Chốt ngày đầu tiên'], s3: ['Chuỗi 3 ngày', 'Chốt 3 ngày liền'], evo1: ['Lớn rồi', 'Tiến hóa một pet lên dạng 2'], lift5: ['Năm buổi tạ', 'Xong 5 buổi tạ'],
  pets3: ['Ba đứa một nhà', 'Nở 3 pet'], s7: ['Chuỗi 7 ngày', 'Chốt 7 ngày liền, nhận khiên đầu tiên'], water10: ['Lạc đà', 'Uống đủ 4 lít 10 ngày'], shop1: ['Khách quen', 'Mua món đầu tiên trong cửa hàng'],
  heavy3: ['Phổi nóng máy', 'Xong 3 buổi cardio nặng'], refeed1: ['Nạp kho', 'Chốt một ngày ăn nhiều'], food14: ['Ăn đúng gram', 'Ăn đúng thực đơn 14 ngày'], lift15: ['Mười lăm buổi tạ', 'Xong 15 buổi tạ'], lift20: ['Hai mươi buổi tạ', 'Xong 20 buổi tạ'],
  s14: ['Chuỗi 14 ngày', 'Chốt 14 ngày liền'], evo4a: ['Tối thượng', 'Đưa một pet thường lên dạng 4'], steps20: ['Chân sắt', 'Đủ 15.000 bước 20 ngày'], pets7: ['Bảy chiến hữu', 'Nở 7 pet'],
  abs12: ['Múi đầu tiên', 'Xong 12 buổi bụng'], s21: ['Chuỗi 21 ngày', 'Chốt 21 ngày liền'], heavy12: ['Phổi thép', 'Xong 12 buổi cardio nặng'], water30: ['Đập thủy điện', 'Uống đủ 4 lít 30 ngày'], water40: ['Mạch nước ngầm', 'Uống đủ 4 lít 40 ngày'],
  total30: ['Tròn một tháng', 'Chốt 30 ngày'], total42: ['Nửa chặng', 'Chốt 42 ngày, đi được nửa đường'], total63: ['Ba phần tư', 'Chốt 63 ngày'], outfit3: ['Dân chơi', 'Có 3 món trang phục'], food35: ['Bếp trưởng', 'Ăn đúng thực đơn 35 ngày'], food49: ['Bảy tuần sạch', 'Ăn đúng thực đơn 49 ngày'], lift36: ['Ba mươi sáu buổi tạ', 'Xong 36 buổi tạ'],
  pets12: ['Chủ trại', 'Nở 12 pet'], evo4c: ['Đội tối thượng', '10 pet thường lên dạng 4'], s45: ['Chuỗi 45 ngày', 'Chốt 45 ngày liền'], steps45: ['Đi mòn giày', 'Đủ 15.000 bước 45 ngày'], steps66: ['Một triệu bước', 'Đủ 15.000 bước 66 ngày'],
  heavy20: ['Động cơ V8', 'Xong 20 buổi cardio nặng'], fx2: ['Tỏa sáng', 'Có 2 hiệu ứng'], total56: ['Hai tháng', 'Chốt 56 ngày'], water60: ['Biển trong người', 'Uống đủ 4 lít 60 ngày'],
  pets18: ['Vườn thú', 'Nở 18 pet'], abs30: ['Bụng thép', 'Xong 30 buổi bụng'], s60: ['Chuỗi 60 ngày', 'Chốt 60 ngày liền'], lift60: ['Sáu mươi buổi tạ', 'Xong 60 buổi tạ'],
  food70: ['Kỷ luật ăn', 'Ăn đúng thực đơn 70 ngày'], evo4d: ['Quân đoàn', '20 pet thường lên dạng 4'], pets24: ['Trại đông vui', 'Nở 24 pet'], heavy30: ['Lò phản ứng', 'Xong 30 buổi cardio nặng'],
  decor10: ['Kiến trúc sư', 'Có 10 món trang trí'], s75: ['Chuỗi 75 ngày', 'Chốt 75 ngày liền'], pets28: ['Hai mươi tám đứa', 'Nở 28 pet'], evo4e: ['Huyền thoại sống', '28 pet thường lên dạng 4'],
  sr1: ['Ánh tím', 'Nở được pet Siêu hiếm đầu tiên'], leg1: ['Huyền thoại giáng thế', 'Nở được pet Huyền thoại đầu tiên'], elall: ['Bảy hệ hội tụ', 'Có pet thường của cả 7 hệ'],
  evo4b: ['Tiểu đội tối thượng', '15 pet thường lên dạng 4'], pets32: ['Gần đủ bộ', 'Nở 32 pet'], elfull1: ['Trọn một hệ', 'Có đủ 6 pet thường của một hệ'],
  pets36: ['Đại gia đình', 'Nở 36 pet'], evo4f: ['Đại quân đoàn', '36 pet thường lên dạng 4'], leg5: ['Ngũ đại huyền thoại', 'Có cả 5 pet Huyền thoại'],
  elfull3: ['Ba hệ trọn vẹn', 'Có đủ 6 pet của 3 hệ'], pets40: ['Bốn mươi đứa', 'Nở 40 pet'], pets42: ['Đủ bộ 42', 'Nở cả 42 pet thường'], evo4g: ['Bất tử', 'Cả 42 pet thường lên dạng 4'],
  lift48: ['Bốn mươi tám buổi tạ', 'Xong 48 buổi tạ'], abs20: ['Hai mươi buổi bụng', 'Xong 20 buổi bụng'], water50: ['Sông trong người', 'Uống đủ 4 lít 50 ngày'],
  total70: ['Mười tuần', 'Chốt 70 ngày'], spin45: ['Bốn mươi lăm vòng', 'Quay 45 lượt'],
  total84: ['Về đích', 'Chốt đủ 84 ngày'], k5: ['Giảm 5 kg', 'Cân sáng thấp hơn cân ban đầu 5 kg'], k10: ['Giảm 10 kg', 'Cân sáng thấp hơn cân ban đầu 10 kg'],
  k15: ['Giảm 15 kg', 'Cân sáng thấp hơn cân ban đầu 15 kg'], k20: ['Giảm 20 kg', 'Cân sáng thấp hơn cân ban đầu 20 kg'], k25: ['Giảm 25 kg', 'Chạm mốc −25 kg'],
  perfect: ['Tuần sắt', 'Chốt đủ 7/7 ngày trong một tuần'], comeback: ['Quay lại mạnh hơn', 'Chốt lại sau khi đứt chuỗi'], weigh7: ['Cân đều tay', 'Cân buổi sáng 7 ngày liền'],
  sleep7: ['Ngủ như gấu', 'Ngủ đủ 7–8 tiếng 7 đêm liền'], measure4: ['Thước dây', 'Đo eo và chụp ảnh 4 Chủ nhật'],
  spin1: ['Vòng quay đầu tiên', 'Quay vòng quay lần đầu'], epic1: ['Sử thi đầu tiên', 'Có pet Sử thi đầu tiên'], spinrun7: ['Tay quay đều', 'Quay đủ 7 ngày liền'],
  ep4a: ['Sử thi tối thượng', 'Đưa một pet Sử thi lên dạng 4'], epic4: ['Nửa bộ Sử thi', 'Có 4 pet Sử thi'], spin30: ['Ba mươi vòng', 'Quay 30 lượt'],
  epic7: ['Đủ bộ Sử thi', 'Có cả 7 pet Sử thi'], spinrun30: ['Một tháng không trượt', 'Quay đủ 30 ngày liền'], spin60: ['Sáu mươi vòng', 'Quay 60 lượt'],
  ep4g: ['Thần thoại sống', 'Cả 7 pet Sử thi lên dạng 4']
};
// Biểu tượng trong huy hiệu theo loại
const ACH_GLYPH = {
  total: 'calendar', streak: 'fire', lift: 'barbell', heavy: 'hiit', abs: 'abs', water: 'water', food: 'meal', steps: 'steps', pets: 'paw', evo2: 'evolve', evo4: 'evolve',
  owned: 'bag', outfit: 'hat', fx: 'magic', decor: 'tent', kg: 'scale', refeed: 'rice', perfectweek: 'star', comeback: 'heartbeat', weighrun: 'scale', sleeprun: 'sleep', measure: 'tape',
  spin: 'wheel', spinrun: 'wheel', epic: 'gem', ep4: 'gem', srare: 'egg', legend: 'egg', elall: 'paw', elfull: 'paw'
};
const ACH = ECON.ach.map(([id, kind, n, t]) => ({ id, kind, n, t, name: ACH_TEXT[id][0], d: ACH_TEXT[id][1] }));
