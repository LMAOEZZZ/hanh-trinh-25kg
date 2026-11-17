/* ===================== KẾ HOẠCH (lấy từ doc) ===================== */
const PLAN_DAYS = 84;
const WD_NAME = ['CN','T2','T3','T4','T5','T6','T7'];
const WD_FULL = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];

/* ----- Bài tập: tên, lưu ý form, hình (id trùng với EXA trong exart.js) ----- */
const EX = {
  bench: ['Bench press', 'Ép bả vai xuống ghế, chân bám sàn, hạ thanh chạm ngực dưới.'],
  ohp: ['Overhead press đứng', 'Siết mông và bụng, đẩy thẳng lên, thanh qua mặt thì đưa đầu ra trước.'],
  dips: ['Dips đeo tạ', 'Người hơi đổ trước, hạ tới khi vai ngang khuỷu, không nhún vai.'],
  latraise: ['Lateral raise', 'Khuỷu hơi cong, nâng tới ngang vai, dẫn bằng khuỷu chứ không phải cổ tay.'],
  pushdown: ['Triceps pushdown', 'Khuỷu khóa sát hông, chỉ cẳng tay chuyển động, duỗi hết ở dưới.'],
  pullup: ['Pull-up đeo tạ', 'Kéo ngực lên xà, ép bả vai xuống, hạ chậm tới duỗi tay.'],
  bbrow: ['Barbell row', 'Lưng thẳng, gập người khoảng 45°, kéo thanh về rốn, ép bả vai.'],
  cablerow: ['Seated cable row', 'Ngồi thẳng lưng, kéo tay cầm về bụng, ưỡn ngực, không ngả người ra sau.'],
  facepull: ['Face pull', 'Kéo dây về ngang mắt, tách hai tay ra, khuỷu cao hơn cổ tay.'],
  ezcurl: ['EZ bar curl', 'Khuỷu đứng yên sát người, không đung đưa lưng, hạ chậm.'],
  squat: ['Back squat', 'Thanh trên lưng trên, gối mở theo mũi chân, xuống tới đùi song song sàn.'],
  rdl: ['Romanian deadlift', 'Đẩy hông ra sau, gối hơi chùng, thanh trượt sát đùi, lưng luôn thẳng.'],
  legpress: ['Leg press', 'Lưng dưới dán ghế, hạ tới gối khoảng 90°, không khóa gối khi đẩy.'],
  legcurl: ['Lying leg curl', 'Hông ép xuống ghế, cuộn gót về mông, hạ chậm 2–3 giây.'],
  calfraise: ['Standing calf raise', 'Hạ gót sâu hết cỡ, kiễng lên cao, giữ 1 giây trên đỉnh.'],
  inclinedb: ['Incline dumbbell press', 'Ghế dốc 30°, bả vai ép xuống, hạ tạ ngang ngực trên.'],
  dbsp: ['Seated dumbbell shoulder press', 'Lưng tựa ghế, đẩy tạ lên trên đầu, không ưỡn lưng.'],
  machinepress: ['Machine chest press', 'Tay cầm ngang ngực, ép bả vai, đẩy ra không khóa khuỷu.'],
  cablefly: ['Cable fly', 'Khuỷu hơi cong cố định, khép tay về trước ngực như ôm thùng phuy.'],
  cablelat: ['Cable lateral raise', 'Cáp từ dưới, nâng tay sang ngang tới vai, thân không nghiêng.'],
  ohtri: ['Overhead triceps extension', 'Khuỷu chỉ thẳng lên trần, hạ tạ ra sau đầu, duỗi hết tay.'],
  latpull: ['Lat pulldown', 'Ưỡn ngực, kéo thanh về ngực trên, khuỷu đi xuống và ra sau.'],
  dbrow: ['One-arm dumbbell row', 'Lưng song song sàn, kéo tạ về hông như kéo cưa, không xoay người.'],
  straightarm: ['Straight-arm pulldown', 'Tay gần thẳng, kéo thanh từ trên xuống đùi bằng lưng xô.'],
  reardelt: ['Rear delt fly', 'Gập người, khuỷu hơi cong, dang tay sang ngang, ép bả vai cuối nhịp.'],
  inclinecurl: ['Incline dumbbell curl', 'Nằm ghế dốc, tay buông sau người, cuộn tạ lên, khuỷu không đưa ra trước.'],
  hammer: ['Hammer curl', 'Cầm tạ dọc như cầm búa, khuỷu sát người, cuộn lên vai.'],
  hacksquat: ['Hack squat hoặc front squat', 'Lưng dán đệm (front squat thì thanh trước ngực), xuống sâu, gối theo mũi chân.'],
  bulgarian: ['Bulgarian split squat (mỗi chân)', 'Chân sau gác ghế, hạ thẳng xuống, gối trước không đổ vào trong.'],
  hipthrust: ['Hip thrust', 'Lưng trên tựa ghế, đẩy hông lên tới thân thẳng, siết mông 1 giây.'],
  seatedcurl: ['Seated leg curl', 'Đùi kẹp chặt dưới đệm, cuộn gót xuống sâu, hạ chậm.'],
  legext: ['Leg extension', 'Lưng tựa ghế, duỗi thẳng gối, giữ 1 giây rồi hạ chậm.'],
  seatedcalf: ['Seated calf raise', 'Đệm đè ngay trên gối, hạ gót sâu, kiễng lên hết cỡ.'],
  hangleg: ['Treo xà nâng chân', 'Treo chắc, không đung đưa, cuộn hông nâng chân lên ngang hông.'],
  cablecrunch: ['Gập bụng với cáp', 'Quỳ, giữ dây sát đầu, cuộn bụng xuống, mông không ngồi xuống gót.'],
  abwheel: ['Lăn bánh xe', 'Siết bụng và mông, lăn ra tới khi lưng sắp võng thì kéo về.'],
  pallof: ['Pallof press', 'Đứng nghiêng với cáp, đẩy tay thẳng ra trước, không để thân xoay.'],
  incline: ['Đi bộ dốc', 'Không vịn tay vào máy, bước vừa phải, người thẳng.'],
  stairs: ['Leo cầu thang', 'Đứng thẳng, đặt cả bàn chân lên bậc, vịn nhẹ để giữ thăng bằng.'],
  elliptical: ['Elliptical', 'Đạp bằng gót, tay đẩy kéo theo nhịp chân, giữ nhịp đều.'],
  rower: ['Máy chèo', 'Đạp chân trước, ngả người sau, tay kéo về bụng sau cùng.'],
  bike: ['Xe đạp tập', 'Chỉnh yên ngang hông, gối hơi chùng ở điểm thấp nhất.'],
  ruck: ['Đeo balo đi bộ', 'Quai đeo chặt, balo sát lưng, đi thẳng người, bước đều.'],
  airbike: ['Air bike', 'Đạp và đẩy tay cùng lúc, hiệp nhanh hết sức, hiệp chậm đạp nhẹ.'],
  rope: ['Dây thừng', 'Gối chùng, lưng thẳng, quật dây bằng cả hai tay cho sóng đều.'],
  sled: ['Đẩy sled', 'Người đổ thấp, tay thẳng, bước ngắn và nhanh bằng mũi chân.'],
  kb: ['Swing tạ ấm', 'Bật hông đẩy tạ lên ngang ngực, tay chỉ dẫn hướng, lưng thẳng.'],
  jack: ['Jumping jack bước', 'Bước sang ngang thay vì bật, tay vung qua đầu.'],
  knees: ['Nâng gối cao tại chỗ', 'Gối lên ngang hông, đánh tay theo nhịp, tiếp đất bằng mũi chân.'],
  climber: ['Leo núi', 'Tay thẳng dưới vai, kéo gối về ngực luân phiên, hông không chổng.'],
  burpee: ['Burpee lùi chân', 'Ngồi xuống, lùi từng chân ra sau, bước về rồi đứng dậy, không bật.'],
  box: ['Đấm gió', 'Thủ cằm, đấm thẳng luân phiên, xoay hông theo cú đấm.'],
  fastsquat: ['Squat nhanh', 'Xuống tới đùi song song, đứng lên nhanh, gót không nhấc.']
};

// Buổi tạ theo thứ (1=T2 ... 6=T7). ss: siêu set (hai bài làm liền nhau rồi mới nghỉ)
const SESSIONS = {
  1:{code:'Push A',tag:'nặng',ex:[
    {id:'bench',s:4,r:'4–6',rest:'2–3 phút',main:1},
    {id:'ohp',s:4,r:'5–7',rest:'2–3 phút',main:1},
    {id:'dips',s:3,r:'6–8',rest:'90 giây'},
    {ss:[['latraise','12–15'],['pushdown','10–12']],s:3,rest:'45–60 giây'}]},
  2:{code:'Pull A',tag:'nặng',ex:[
    {id:'pullup',s:4,r:'5–7',rest:'2–3 phút',main:1},
    {id:'bbrow',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {ss:[['cablerow','8–10'],['facepull','12–15']],s:3,rest:'45–60 giây'},
    {id:'ezcurl',s:3,r:'6–8',rest:'90 giây'}]},
  3:{code:'Legs A',tag:'nặng',ex:[
    {id:'squat',s:4,r:'4–6',rest:'3 phút',main:1},
    {id:'rdl',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {id:'legpress',s:3,r:'8–10',rest:'2 phút'},
    {ss:[['legcurl','8–10'],['calfraise','8–10']],s:3,rest:'45–60 giây'}]},
  4:{code:'Push B',tag:'vừa',ex:[
    {id:'inclinedb',s:4,r:'8–10',rest:'2 phút',main:1},
    {id:'dbsp',s:3,r:'8–10',rest:'90 giây',main:1},
    {ss:[['machinepress','10–12'],['cablefly','12–15']],s:3,rest:'45–60 giây'},
    {ss:[['cablelat','12–15'],['ohtri','10–12']],s:3,rest:'45–60 giây'}]},
  5:{code:'Pull B',tag:'vừa',ex:[
    {id:'latpull',s:4,r:'8–10',rest:'2 phút',main:1},
    {id:'dbrow',s:3,r:'8–12',rest:'90 giây',main:1},
    {ss:[['straightarm','12–15'],['reardelt','12–15']],s:3,rest:'45–60 giây'},
    {ss:[['inclinecurl','10–12'],['hammer','10–12']],s:2,rest:'45–60 giây'}]},
  6:{code:'Legs B',tag:'vừa',ex:[
    {id:'hacksquat',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {id:'bulgarian',s:3,r:'8–10',rest:'90 giây',main:1},
    {ss:[['hipthrust','8–10'],['seatedcurl','10–12']],s:3,rest:'60 giây'},
    {ss:[['legext','12–15'],['seatedcalf','12–15']],s:2,rest:'45–60 giây'}]}
};
const ABS = {
  A:{code:'Bụng A',ex:[{id:'hangleg',s:3,r:'10–15',rest:'60 giây'},{id:'cablecrunch',s:3,r:'12–15',rest:'60 giây'}]},
  B:{code:'Bụng B',ex:[{id:'abwheel',s:3,r:'8–12',rest:'60 giây'},{id:'pallof',s:3,r:'12 mỗi bên',rest:'60 giây'}]}
};
const ABS_BY_WD = {1:'A',3:'B',5:'A'};

// art: id hình trong exart.js
const LIGHT_CARDIO = [
  {id:'incline',art:'incline',n:'Đi bộ dốc',d:'Máy chạy dốc 12–15%, 5–5,5 km/h, 30 phút'},
  {id:'stairs',art:'stairs',n:'Leo cầu thang',d:'Máy leo cầu thang, 20–25 phút'},
  {id:'elliptical',art:'elliptical',n:'Elliptical',d:'Đều tay, 25–30 phút'},
  {id:'rower',art:'rower',n:'Máy chèo',d:'Nhịp nhẹ, 20–25 phút'},
  {id:'bike',art:'bike',n:'Xe đạp tập',d:'Đạp đều, 30 phút'},
  {id:'ruck',art:'ruck',n:'Đeo balo',d:'Balo 8–10 kg, đi bộ 30 phút'}
];
const HEAVY_CARDIO = [
  {id:'airbike',art:'airbike',n:'Air bike',d:'15 giây hết sức / 45 giây nhẹ × 10 hiệp'},
  {id:'bike',art:'bike',n:'Xe đạp',d:'20 giây hết sức / 40 giây nhẹ × 10 hiệp',tip:'Tăng lực cản, hiệp nhanh đạp hết sức, hiệp chậm đạp nhẹ để hồi.'},
  {id:'rower',art:'rower',n:'Máy chèo',d:'30 giây hết sức / 30 giây nhẹ × 10 hiệp',tip:'Hiệp nhanh vẫn giữ thứ tự chân, người, tay. Đừng kéo bằng tay trước.'},
  {id:'rope',art:'rope',n:'Dây thừng',d:'20 giây quật / 40 giây nghỉ × 10 hiệp'},
  {id:'sled',art:'sled',n:'Đẩy sled',d:'Đẩy 20 m × 8 lượt, đi bộ về là nghỉ'},
  {id:'kb',art:'kb',n:'Swing tạ ấm',d:'EMOM 12 phút: mỗi phút 12–15 cái'},
  {id:'stairs',art:'stairs',n:'Leo cầu thang',d:'1 phút nhanh / 1 phút chậm × 8',tip:'Phút nhanh bước dồn dập nhưng vẫn đặt cả bàn chân, phút chậm thở đều.'},
  {id:'circuit',art:'jack',n:'Không cần máy',d:'5 bài × 40 giây làm / 20 giây nghỉ × 3 vòng',sub:['jack','knees','climber','burpee',['box','fastsquat']]}
];

/* ----- Thực đơn: từng món, gram, kcal (đạm/tinh bột/béo tính theo 100 g hoặc 1 quả) ----- */
// [tên, icon, đơn vị ('g' hoặc 'quả'), P, C, F theo 100 g hoặc 1 quả]
const FOOD = {
  chicken: ['Ức gà (cân sống)', 'chicken', 'g', 23, 0, 1.2],
  egg: ['Trứng gà luộc', 'egg', 'quả', 6.3, .4, 5],
  white: ['Lòng trắng trứng', 'eggwhite', 'quả', 3.6, .2, .1],
  tofu: ['Đậu phụ', 'tofu', 'g', 10.9, .7, 5.4],
  rice: ['Cơm chín', 'rice', 'g', 2.7, 28, .3],
  cuke: ['Dưa leo hoặc cà chua', 'cucumber', 'g', .8, 3, .2],
  morning: ['Rau muống xào', 'greens', 'g', 3, 2.5, .2],
  bokchoy: ['Cải ngọt xào', 'greens', 'g', 1.7, 2.5, .2],
  veg: ['Rau luộc', 'greens', 'g', 1.5, 3, .2],
  cabbage: ['Bắp cải hoặc su su luộc', 'cabbage', 'g', 1.3, 4, .1],
  oil: ['Dầu ăn', 'oil', 'g', 0, 0, 100],
  guava: ['Ổi', 'guava', 'quả', 2.6, 14, 1],
  banana: ['Chuối', 'banana', 'quả', 1.1, 23, .3]
};
// Mỗi bữa: [giờ, tên bữa, [[món, lượng, ghi chú]...]]
const MENU_TRAIN = [
  ['7h', 'Bữa sáng', [['egg', 2], ['white', 3], ['chicken', 100, 'luộc'], ['cuke', 100]]],
  ['11h30', 'Bữa trưa', [['chicken', 200, 'nướng nồi chiên không dầu'], ['morning', 200], ['oil', 7], ['guava', 1]]],
  ['16h', 'Trước tập', [['chicken', 200, 'áp chảo'], ['rice', 100], ['veg', 100], ['oil', 7]]],
  ['19h30', 'Sau tập', [['chicken', 200, 'xào sả ớt'], ['tofu', 100, 'sốt cà'], ['rice', 100], ['cabbage', 100], ['oil', 3]]]
];
const MENU_REST = [
  ['7h', 'Bữa sáng', [['egg', 2], ['white', 3], ['chicken', 100, 'luộc'], ['cuke', 100]]],
  ['11h30', 'Bữa trưa', [['chicken', 250, 'nướng nồi chiên không dầu'], ['bokchoy', 200], ['oil', 7]]],
  ['16h', 'Bữa xế', [['chicken', 125, 'luộc'], ['tofu', 100], ['veg', 100], ['oil', 4]]],
  ['19h30', 'Bữa tối', [['chicken', 250, 'kho gừng'], ['rice', 80], ['veg', 100], ['oil', 7]]]
];
// Ngày ăn nhiều = ngày tập + ~650 g cơm chia 4 bữa + 2 quả chuối (bữa 3 và 4)
const REFEED_EXTRA = [160, 160, 165, 165];
function menuFor(I) {
  const base = I.train ? MENU_TRAIN : MENU_REST;
  return base.map(([t, n, items], i) => {
    let L = items.map(x => x.slice());
    if (I.refeed) {
      const r = L.find(x => x[0] === 'rice');
      if (r) { r[3] = REFEED_EXTRA[i]; r[1] += REFEED_EXTRA[i]; } else L.splice(1, 0, ['rice', REFEED_EXTRA[i], '', REFEED_EXTRA[i]]);
      if (i >= 2) L.push(['banana', 1, '', 1]);
    }
    return [t, n, L];
  });
}
function foodMacro(id, qty) {
  const F = FOOD[id], k = F[2] === 'g' ? qty / 100 : qty;
  const p = F[3] * k, c = F[4] * k, f = F[5] * k;
  return { p, c, f, kcal: p * 4 + c * 4 + f * 9 };
}
function sumMacro(list) { return list.reduce((a, [id, q]) => { const m = foodMacro(id, q); a.p += m.p; a.c += m.c; a.f += m.f; a.kcal += m.kcal; return a; }, { p: 0, c: 0, f: 0, kcal: 0 }); }

const TARGETS = [[0,null],[28,85],[56,78],[84,72]]; // [ngày, kg]; ngày 0 = cân ban đầu

/* ===================== CÂU ĐỘNG LỰC (viết mới) ===================== */
const Q_GENERAL = [
'Mỡ không tự đi đâu. Hôm nay mình tiễn nó thêm một đoạn.',
'10 năm cầm tạ rồi, 12 tuần này chỉ là hiệp phụ.',
'Gà luộc không ngon, nhưng cơ bụng thì đẹp. Ăn đi.',
'Không cần hứng. Cần lịch. Lịch hôm nay có sẵn rồi.',
'Cân có lên có xuống. Kỷ luật thì không.',
'Tạ vẫn nặng như cũ, chỉ có ông là nhẹ đi.',
'Hôm nay làm cho xong, mai tính tiếp.',
'15.000 bước. Đi tới đâu mỡ rụng tới đó.',
'Không ai nhớ ngày ông nghỉ. Người ta chỉ thấy cái bụng.',
'Ăn đúng gram, sống đúng chất.',
'Mệt là bình thường. Bỏ cuộc mới là chuyện lạ.',
'Mỗi set là một viên gạch. 84 ngày là cả cái nhà.',
'Cái áo size nhỏ hơn đang nằm chờ trong tủ.',
'Đói chút thì sao. Bữa sau tới ngay ấy mà.',
'Không phải ăn kiêng. Đây là nạp đạn có tính toán.',
'Máy chạy dốc 15% không đáng sợ bằng cái gương.',
'Bước nhanh lên, mỡ đang chạy trốn kìa.',
'Hôm qua làm được thì hôm nay lặp lại thôi.',
'Không cần hoàn hảo. Cần có mặt.',
'700 g ức gà mỗi ngày, cơ bắp gửi lời cảm ơn.',
'Chuỗi này là của ông. Đừng để ai bẻ gãy, kể cả chính ông.',
'Ngủ đủ cũng là tập. Tắt phim đi ngủ.',
'4 lít nước. Không mặc cả.',
'Bụng phẳng làm ra từ bếp, múi bụng làm ra từ phòng tập.',
'Cứ tập như thể pet đang nhìn. Vì nó đang nhìn thật.',
'Chốt một ngày là thêm một miếng thịt cho pet. Đừng để nó đói.',
'Đổ mồ hôi bây giờ, cởi áo khoe sau.',
'Người ta ngủ nướng, ông đi bộ dốc. Khác nhau ở đó.',
'Không có ngày dễ. Chỉ có ngày ông mạnh hơn.',
'Cơn đói hay nói dối lắm. Đừng tin nó.',
'Nâng tạ 10 năm rồi, giờ nâng nốt kỷ luật.',
'84 ngày là đường dài. Hôm nay chỉ cần đi hết một ngày.',
'Một tháng nữa, ông sẽ cảm ơn ông của hôm nay.',
'Chiến binh không hỏi có muốn không. Chiến binh hỏi mấy giờ tập.',
'Gà, cơm, rau, lặp lại. Nhàm mà ăn tiền.',
'Đừng ngồi thương lượng với cơn thèm. Nó chơi bẩn lắm.',
'Mỗi bậc cầu thang là một lần thắng cái lười.',
'Tập xong rồi hẵng than. Mà tập xong thì hết muốn than.',
'Cơ thể nghe lời ông. Ra lệnh cho đúng vào.',
'Áo rộng ra từng chút. Đó là tiếng vỗ tay.',
'Cân chỉ là con số. Vòng eo mới là bằng chứng.',
'Hôm nay không cần bùng nổ, chỉ cần không bỏ.',
'Trà sữa không theo kịp 15.000 bước của ông đâu.',
'Mạnh không phải là không mệt. Mạnh là mệt vẫn làm.',
'Mỡ bụng tưởng được ở lại lâu. Nó nhầm to.',
'Cứ chốt từng ngày, chuỗi sẽ tự dài ra.',
'Tạ không biết ông đang giảm cân. Cứ nâng mức cũ.',
'Đi bộ dốc 30 phút, nghe hết một tập podcast là xong.',
'Không ai tập hộ được. Vì thế nó mới đáng giá.',
'Pet đang lên cấp. Ông cũng vậy.',
'Ăn sạch hôm nay, ngủ ngon tối nay, cân đẹp sáng mai.',
'Lỡ một bữa không phá được kế hoạch. Bỏ cả ngày mới phá.',
'Đầu muốn nghỉ nhưng người vẫn còn xăng. Đi tiếp.',
'Dây lưng thấy trước cả gương. Lỗ mới sắp tới rồi.',
'Chơi lớn 12 tuần, khoe dài cả năm.',
'Cầm hộp cơm lên, cân đủ gram, ăn như dân chuyên.',
'Thắng cái lười buổi sáng là thắng nửa ngày.',
'Ông không yếu đi. Ông đang gọn lại.',
'Lịch viết sẵn rồi. Việc của ông là đóng dấu.',
'Muốn lười thì lười, nhưng lười sau khi chốt ngày.',
'Bước chân không biết nói dối. Đếm cho đủ.',
'Ngày có 24 tiếng. Dành 2 tiếng cho cơ thể, quá rẻ.',
'Mỡ tích mấy năm, mình xử trong 12 tuần. Chịu khó tí.',
'Mở tab Lịch ra mà ngắm chuỗi. Đẹp chưa?',
'Bài chính giữ nguyên mức tạ. Cơ phải biết nó còn việc để làm.',
'Không ai thắng trong một ngày. Nhưng có người thua trong một ngày bỏ.',
'Đồ ăn nấu sẵn trong tủ là nửa trận thắng.',
'Hơi thở dốc, mồ hôi ướt lưng. Nghe giống tiến bộ đấy.',
'Ông đã qua những buổi Legs khó hơn hôm nay nhiều.',
'Hôm nay nhẹ tay với đồ ăn, nặng tay với tạ.',
'Đi bộ sau bữa 10 phút. Bước chân cộng dồn nhanh lắm.',
'Ai hỏi sao dạo này kín lịch thế? Trả lời: đang độ lại xe.'
];
const Q_TIRED = [
'Hôm nay đuối thì giảm tốc, đừng tắt máy.',
'Mệt thì làm bản gọn: đủ bài chính, về ngủ sớm.',
'Pin yếu thì sạc. Ăn đủ, ngủ đủ, mai lại đầy vạch.',
'Ngày tệ nhất vẫn tính là một ngày, miễn ông có mặt.',
'Cơ thể đang kêu, nghe nó một chút. Cần thì bấm nút "thấy không ổn".',
'Hôm nay không cần làm anh hùng. Chỉ cần không bỏ.',
'Đi chậm vẫn hơn đứng im.',
'Mệt nghĩa là ông đang làm thật. Nghỉ đúng cách rồi chiến tiếp.',
'Hôm nay khó? Tốt. Ngày dễ chẳng làm ra ai cả.',
'Thở sâu, uống nước, làm từng mục một. Đừng nhìn cả danh sách.',
'Có những ngày đi đủ 15.000 bước đã là anh hùng.',
'Đau khớp thì bỏ buổi B, đừng gồng. Chuỗi vẫn còn đó.'
];
const Q_REFEED = [
'Hôm nay ăn nhiều theo lệnh. Cơm là đồng minh, không phải kẻ thù.',
'Ngày nạp lại kho. Thêm 650 g cơm, không thêm món ngoài lề.',
'Cơ đang reo hò. Legs A hôm nay sẽ nặng tay đấy.',
'Ăn nhiều có kế hoạch khác xa ăn bừa. Hôm nay là cái đầu tiên.',
'Mai cân có nhích lên thì đó là nước. Bình tĩnh.',
'Hai quả chuối, thêm cơm, rồi đánh Legs A cho ra trò.',
'Nạp nhiên liệu ngày chẵn, đốt sạch cả tuần.',
'Hiếm lắm kế hoạch mới bảo ăn thêm. Tận hưởng đi, nhưng đúng gram.'
];
const Q_REST = [
'Chủ nhật nghỉ tạ, không nghỉ bước chân.',
'Hôm nay cơ đang tự sửa. Ông lo ăn đúng và đi đủ.',
'Ngày nghỉ là ngày nạp. Đo eo, chụp ảnh, nhìn lại cả tuần.',
'Nghỉ tạ không có nghĩa là nghỉ kỷ luật.',
'Nấu sẵn gà cho đầu tuần đi. Thứ hai ông sẽ cảm ơn.',
'Chủ nhật thả lỏng đầu óc, giữ chặt thực đơn.'
];
const Q_DELOAD = [
'Tuần 8 tập nhẹ: giữ mức tạ, bớt set. Lùi một bước để bật xa hơn.',
'Tuần này cho khớp thở. Cardio vẫn giữ nguyên nhé.',
'Bớt set không phải lùi bước. Đó là lên dây cót.'
];
const Q_STREAK = {
3:'Ba ngày liền. Thói quen bắt đầu thành hình rồi đấy.',
7:'Tròn một tuần! Có thêm một khiên giữ chuỗi.',
14:'Hai tuần không gãy. Mỡ bắt đầu hoảng rồi.',
21:'21 ngày liền. Giờ không tập mới thấy lạ.',
30:'30 ngày liền. Tháng này ông là trùm.',
45:'45 ngày liền. Quá nửa đường, kỷ luật đầy bình.',
60:'60 ngày liền. Có mấy ai làm được thế này?',
84:'84 ngày. Huyền thoại có thật, và đang cầm cái điện thoại này.'
};
const Q_COMEBACK = [
'Đứt chuỗi thì nối chuỗi mới. Ngày 1 lần hai vẫn là ngày 1 xịn.',
'Ngã một nhịp không sao. Đứng dậy nhanh mới là trình.',
'Pet không giận đâu. Nó chỉ chờ ông quay lại.',
'Hôm qua trượt. Hôm nay chốt cho chắc.',
'Không cần bù gì cả. Cứ làm đúng hôm nay.',
'Chuỗi về 0 nhưng cơ bắp vẫn còn nguyên. Chiến tiếp.'
];
const Q_FIRST = [
'Ngày 1. Quả trứng đang chờ ông chốt ngày để nở.',
'Phát súng đầu tiên. Chốt hôm nay để mở màn.'
];

