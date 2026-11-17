/* ===================== KINH TẾ, PET, CỬA HÀNG, THÀNH TỰU (dữ liệu) =====================
   Khối ECON giữa hai dấu ECON-JSON là JSON thuần: script mô phỏng python đọc trực tiếp khối này. */
const ECON = /*ECON-JSON*/{
  "unlock": { "first": 1, "every": 3 },
  "item": { "meat": 1, "coin": 3 },
  "commit": { "meat": 4, "coin": 10 },
  "comeback": { "meat": 8, "coin": 25 },
  "streak": {
    "3": { "meat": 4, "coin": 15 }, "7": { "meat": 8, "coin": 30 }, "14": { "meat": 10, "coin": 45 }, "21": { "meat": 12, "coin": 60 },
    "30": { "meat": 14, "coin": 80 }, "45": { "meat": 16, "coin": 100 }, "60": { "meat": 18, "coin": 120 }, "75": { "meat": 20, "coin": 140 }, "84": { "meat": 25, "coin": 200 }
  },
  "tier": [{ "coin": 20, "meat": 3 }, { "coin": 40, "meat": 6 }, { "coin": 70, "meat": 10 }],
  "evo": { "base": [12, 22, 35], "multFirst": 1.18, "multLast": 0.5 },
  "hatch": { "base": 2, "per": 0.4 },
  "pets": [
    ["wolf", "fire", 0], ["bear", "metal", 0], ["frog", "forest", 0], ["penguin", "ice", 0], ["squirrel", "thunder", 0], ["turtle", "stone", 0], ["bat", "shadow", 0],
    ["fox", "thunder", 1], ["tiger", "ice", 1], ["dragon", "fire", 1], ["pangolin", "stone", 1], ["cat", "shadow", 1], ["beetle", "forest", 1], ["scorpion", "metal", 1],
    ["salamander", "fire", 1], ["stag", "forest", 1], ["owl", "shadow", 2], ["rhino", "stone", 2], ["bull", "metal", 2], ["mammoth", "ice", 2], ["eagle", "thunder", 2],
    ["panda", "forest", 2], ["mecha", "metal", 2], ["gorilla", "stone", 2], ["panther", "shadow", 3], ["yeti", "ice", 3], ["uni", "thunder", 3], ["phoenix", "fire", 3]
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
    ["lift36", "lift", 36, 1], ["pets12", "pets", 12, 1], ["evo4c", "evo4", 10, 1], ["s45", "streak", 45, 2], ["steps45", "steps", 45, 1], ["steps66", "steps", 66, 2], ["heavy20", "heavy", 20, 1],
    ["fx2", "fx", 2, 1], ["total56", "total", 56, 2], ["water60", "water", 60, 1], ["pets18", "pets", 18, 2], ["abs30", "abs", 30, 2], ["s60", "streak", 60, 2],
    ["lift60", "lift", 60, 2], ["food70", "food", 70, 2], ["evo4d", "evo4", 20, 2], ["pets24", "pets", 24, 2], ["heavy30", "heavy", 30, 2], ["decor10", "decor", 10, 2],
    ["s75", "streak", 75, 2], ["pets28", "pets", 28, 2], ["evo4e", "evo4", 28, 2], ["total84", "total", 84, 2],
    ["k5", "kg", 5, 0], ["k10", "kg", 10, 1], ["k15", "kg", 15, 1], ["k20", "kg", 20, 2], ["k25", "kg", 25, 2],
    ["perfect", "perfectweek", 1, 1], ["comeback", "comeback", 1, 0], ["weigh7", "weighrun", 7, 0], ["sleep7", "sleeprun", 7, 0], ["measure4", "measure", 4, 0],
    ["spin1", "spin", 1, 0], ["epic1", "epic", 1, 1], ["spinrun7", "spinrun", 7, 1], ["ep4a", "ep4", 1, 1], ["epic4", "epic", 4, 1], ["spin30", "spin", 30, 1],
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
  wolf: ['Sói Lửa', 'Nở từ quả trứng đầu tiên. Nóng tính, trung thành, ghét nhất ngày bỏ tập.'],
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
  yeti: ['Quỷ Tuyết', 'Truyền thuyết đỉnh núi. Chỉ gặp người đi tới tuần 11.'],
  uni: ['Kỳ Lân Điện', 'Bờm phóng điện, sừng gọi sét. Chỉ hiện ra với người không bỏ cuộc.'],
  phoenix: ['Phượng Hoàng', 'Tái sinh từ 84 ngày lửa. Ai có nó là đã về đích.']
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
const PETS = ECON.pets.map(([id, el, rar], i) => ({ id, el, rar, i, need: ECON.unlock.first + ECON.unlock.every * i, name: PET_INFO[id][0], intro: PET_INFO[id][1] }));
const EPICS = ECON.epics.map(([id, el], i) => ({ id, el, rar: 4, i, epic: true, name: EPIC_INFO[id][0], intro: EPIC_INFO[id][1] }));
const ALL_PETS = PETS.concat(EPICS);
const PET_BY = Object.fromEntries(ALL_PETS.map(p => [p.id, p]));
const isEpic = id => !!(PET_BY[id] && PET_BY[id].epic);
// Giá tiến hóa theo pet: Sử thi dùng bảng riêng
const costOf = (id, stage) => isEpic(id) ? ECON.epic.evo[stage - 1] : evoCost(PET_BY[id].i, stage);
// Giá tiến hóa giảm dần theo thứ tự mở, để pet mở muộn vẫn kịp lên dạng 4
function evoCost(i, stage) { // stage 1: dạng 1→2, 2: 2→3, 3: 3→4
  const E = ECON.evo, t = i / (PETS.length - 1), m = E.multFirst + (E.multLast - E.multFirst) * t;
  return Math.max(3, Math.round(E.base[stage - 1] * m));
}
const hatchGift = i => Math.round(ECON.hatch.base + ECON.hatch.per * i);

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
  pets3: ['Ba đứa một nhà', 'Mở 3 pet'], s7: ['Chuỗi 7 ngày', 'Chốt 7 ngày liền, nhận khiên đầu tiên'], water10: ['Lạc đà', 'Uống đủ 4 lít 10 ngày'], shop1: ['Khách quen', 'Mua món đầu tiên trong cửa hàng'],
  heavy3: ['Phổi nóng máy', 'Xong 3 buổi cardio nặng'], refeed1: ['Nạp kho', 'Chốt một ngày ăn nhiều'], food14: ['Ăn đúng gram', 'Ăn đúng thực đơn 14 ngày'], lift15: ['Mười lăm buổi tạ', 'Xong 15 buổi tạ'], lift20: ['Hai mươi buổi tạ', 'Xong 20 buổi tạ'],
  s14: ['Chuỗi 14 ngày', 'Chốt 14 ngày liền'], evo4a: ['Tối thượng', 'Đưa một pet lên dạng 4'], steps20: ['Chân sắt', 'Đủ 15.000 bước 20 ngày'], pets7: ['Bảy hệ hội tụ', 'Mở 7 pet'],
  abs12: ['Múi đầu tiên', 'Xong 12 buổi bụng'], s21: ['Chuỗi 21 ngày', 'Chốt 21 ngày liền'], heavy12: ['Phổi thép', 'Xong 12 buổi cardio nặng'], water30: ['Đập thủy điện', 'Uống đủ 4 lít 30 ngày'], water40: ['Mạch nước ngầm', 'Uống đủ 4 lít 40 ngày'],
  total30: ['Tròn một tháng', 'Chốt 30 ngày'], total42: ['Nửa chặng', 'Chốt 42 ngày, đi được nửa đường'], total63: ['Ba phần tư', 'Chốt 63 ngày'], outfit3: ['Dân chơi', 'Có 3 món trang phục'], food35: ['Bếp trưởng', 'Ăn đúng thực đơn 35 ngày'], food49: ['Bảy tuần sạch', 'Ăn đúng thực đơn 49 ngày'], lift36: ['Ba mươi sáu buổi tạ', 'Xong 36 buổi tạ'],
  pets12: ['Chủ trại', 'Mở 12 pet'], evo4c: ['Đội tối thượng', '10 pet lên dạng 4'], s45: ['Chuỗi 45 ngày', 'Chốt 45 ngày liền'], steps45: ['Đi mòn giày', 'Đủ 15.000 bước 45 ngày'], steps66: ['Một triệu bước', 'Đủ 15.000 bước 66 ngày'],
  heavy20: ['Động cơ V8', 'Xong 20 buổi cardio nặng'], fx2: ['Tỏa sáng', 'Có 2 hiệu ứng'], total56: ['Hai tháng', 'Chốt 56 ngày'], water60: ['Biển trong người', 'Uống đủ 4 lít 60 ngày'],
  pets18: ['Vườn thú', 'Mở 18 pet'], abs30: ['Bụng thép', 'Xong 30 buổi bụng'], s60: ['Chuỗi 60 ngày', 'Chốt 60 ngày liền'], lift60: ['Sáu mươi buổi tạ', 'Xong 60 buổi tạ'],
  food70: ['Kỷ luật ăn', 'Ăn đúng thực đơn 70 ngày'], evo4d: ['Quân đoàn', '20 pet lên dạng 4'], pets24: ['Gần đủ bộ', 'Mở 24 pet'], heavy30: ['Lò phản ứng', 'Xong 30 buổi cardio nặng'],
  decor10: ['Kiến trúc sư', 'Có 10 món trang trí'], s75: ['Chuỗi 75 ngày', 'Chốt 75 ngày liền'], pets28: ['Đủ bộ 28', 'Mở cả 28 pet'], evo4e: ['Huyền thoại sống', 'Cả 28 pet lên dạng 4'],
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
  spin: 'wheel', spinrun: 'wheel', epic: 'gem', ep4: 'gem'
};
const ACH = ECON.ach.map(([id, kind, n, t]) => ({ id, kind, n, t, name: ACH_TEXT[id][0], d: ACH_TEXT[id][1] }));
