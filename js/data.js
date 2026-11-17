/* ===================== KẾ HOẠCH (lấy từ doc) ===================== */
const PLAN_DAYS = 84;
const WD_NAME = ['CN','T2','T3','T4','T5','T6','T7'];
const WD_FULL = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];

// Buổi tạ theo thứ (1=T2 ... 6=T7). Bài bụng ở cuối buổi Legs trong doc đã chuyển sang lịch bụng riêng.
const SESSIONS = {
  1:{code:'Push A',tag:'nặng',ex:[
    {n:'Bench press',s:4,r:'4–6',rest:'2–3 phút',main:1},
    {n:'Overhead press đứng',s:4,r:'5–7',rest:'2–3 phút',main:1},
    {n:'Dips đeo tạ',s:3,r:'6–8',rest:'90 giây'},
    {n:'Siêu set: Lateral raise + Triceps pushdown',s:3,r:'12–15 + 10–12',rest:'45–60 giây'}]},
  2:{code:'Pull A',tag:'nặng',ex:[
    {n:'Pull-up đeo tạ',s:4,r:'5–7',rest:'2–3 phút',main:1},
    {n:'Barbell row',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {n:'Siêu set: Seated cable row + Face pull',s:3,r:'8–10 + 12–15',rest:'45–60 giây'},
    {n:'EZ bar curl',s:3,r:'6–8',rest:'90 giây'}]},
  3:{code:'Legs A',tag:'nặng',ex:[
    {n:'Back squat',s:4,r:'4–6',rest:'3 phút',main:1},
    {n:'Romanian deadlift',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {n:'Leg press',s:3,r:'8–10',rest:'2 phút'},
    {n:'Siêu set: Lying leg curl + Standing calf raise',s:3,r:'8–10 + 8–10',rest:'45–60 giây'}]},
  4:{code:'Push B',tag:'vừa',ex:[
    {n:'Incline dumbbell press',s:4,r:'8–10',rest:'2 phút',main:1},
    {n:'Seated dumbbell shoulder press',s:3,r:'8–10',rest:'90 giây',main:1},
    {n:'Siêu set: Machine chest press + Cable fly',s:3,r:'10–12 + 12–15',rest:'45–60 giây'},
    {n:'Siêu set: Cable lateral raise + Overhead triceps extension',s:3,r:'12–15 + 10–12',rest:'45–60 giây'}]},
  5:{code:'Pull B',tag:'vừa',ex:[
    {n:'Lat pulldown',s:4,r:'8–10',rest:'2 phút',main:1},
    {n:'One-arm dumbbell row',s:3,r:'8–12',rest:'90 giây',main:1},
    {n:'Siêu set: Straight-arm pulldown + Rear delt fly',s:3,r:'12–15 + 12–15',rest:'45–60 giây'},
    {n:'Siêu set: Incline dumbbell curl + Hammer curl',s:2,r:'10–12 + 10–12',rest:'45–60 giây'}]},
  6:{code:'Legs B',tag:'vừa',ex:[
    {n:'Hack squat hoặc front squat',s:4,r:'6–8',rest:'2–3 phút',main:1},
    {n:'Bulgarian split squat (mỗi chân)',s:3,r:'8–10',rest:'90 giây',main:1},
    {n:'Siêu set: Hip thrust + Seated leg curl',s:3,r:'8–10 + 10–12',rest:'60 giây'},
    {n:'Siêu set: Leg extension + Seated calf raise',s:2,r:'12–15 + 12–15',rest:'45–60 giây'}]}
};

const ABS = {
  A:{code:'Bụng A',ex:[{n:'Treo xà nâng chân',s:3,r:'10–15'},{n:'Gập bụng với cáp',s:3,r:'12–15'}]},
  B:{code:'Bụng B',ex:[{n:'Lăn bánh xe',s:3,r:'8–12'},{n:'Pallof press',s:3,r:'12 mỗi bên'}]}
};
const ABS_BY_WD = {1:'A',3:'B',5:'A'};

const LIGHT_CARDIO = [
  {id:'incline',n:'Đi bộ dốc',d:'Máy chạy dốc 12–15%, 5–5,5 km/h, 30 phút'},
  {id:'stairs',n:'Leo cầu thang',d:'Máy leo cầu thang, 20–25 phút'},
  {id:'elliptical',n:'Elliptical',d:'Đều tay, 25–30 phút'},
  {id:'rower',n:'Máy chèo',d:'Nhịp nhẹ, 20–25 phút'},
  {id:'bike',n:'Xe đạp tập',d:'Đạp đều, 30 phút'},
  {id:'ruck',n:'Đeo balo',d:'Balo 8–10 kg, đi bộ 30 phút'}
];
const HEAVY_CARDIO = [
  {id:'airbike',n:'Air bike',d:'15 giây hết sức / 45 giây nhẹ × 10 hiệp'},
  {id:'bike',n:'Xe đạp',d:'20 giây hết sức / 40 giây nhẹ × 10 hiệp'},
  {id:'rower',n:'Máy chèo',d:'30 giây hết sức / 30 giây nhẹ × 10 hiệp'},
  {id:'rope',n:'Dây thừng',d:'20 giây quật / 40 giây nghỉ × 10 hiệp'},
  {id:'sled',n:'Đẩy sled',d:'Đẩy 20 m × 8 lượt, đi bộ về là nghỉ'},
  {id:'kb',n:'Swing tạ ấm',d:'EMOM 12 phút: mỗi phút 12–15 cái'},
  {id:'stairs',n:'Leo cầu thang',d:'1 phút nhanh / 1 phút chậm × 8'},
  {id:'circuit',n:'Không cần máy',d:'5 bài × 40 giây làm / 20 giây nghỉ × 3 vòng: jumping jack bước, nâng gối cao tại chỗ, leo núi, burpee lùi chân không bật, đấm gió hoặc squat nhanh'}
];

// Thực đơn: [giờ, đạm, cơm chín (g), rau & khác]
const MENU_TRAIN = {
  kcal:'~1.530', macro:'Đạm 210 g · tinh bột 79 g · béo 42 g',
  meals:[
    ['7h','2 quả trứng luộc, 3 lòng trắng, 100 g ức gà luộc',0,'100 g dưa leo hoặc cà chua'],
    ['11h30','200 g ức gà nướng nồi chiên không dầu',0,'200 g rau muống xào, 7 g dầu, 1 quả ổi'],
    ['16h (trước tập)','200 g ức gà áp chảo',100,'100 g rau, 7 g dầu'],
    ['19h30 (sau tập)','200 g ức gà xào sả ớt, 100 g đậu phụ sốt cà',100,'100 g bắp cải hoặc su su luộc, 3 g dầu']
  ],
  total:'700 g ức gà · 2 trứng + 3 lòng trắng · 100 g đậu phụ · 200 g cơm · 500 g rau · 1 quả ổi · 17 g dầu'
};
const MENU_REST = {
  kcal:'~1.360', macro:'Đạm 210 g · tinh bột 36 g · béo 42 g',
  meals:[
    ['7h','2 quả trứng luộc, 3 lòng trắng, 100 g ức gà luộc',0,'100 g dưa leo hoặc cà chua'],
    ['11h30','250 g ức gà nướng nồi chiên không dầu',0,'200 g cải ngọt xào, 7 g dầu'],
    ['16h','125 g ức gà luộc, 100 g đậu phụ',0,'100 g rau, 4 g dầu'],
    ['19h30','250 g ức gà kho gừng',80,'100 g rau, 7 g dầu']
  ],
  total:'725 g ức gà · 2 trứng + 3 lòng trắng · 100 g đậu phụ · 80 g cơm · 500 g rau · 18 g dầu'
};
// Ngày ăn nhiều = ngày tập + ~650 g cơm chia 4 bữa + 2 quả chuối
const REFEED_EXTRA = [160,160,165,165];
const REFEED_INFO = {kcal:'~2.500', macro:'Đạm 230 g · tinh bột 300 g · béo 45 g'};

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

/* ===================== PET ===================== */
const PETS = [
  {id:'wolf',  name:'Sói Lửa',      need:1,  rar:0, intro:'Đứa đầu tiên theo ông từ quả trứng. Nóng tính, trung thành, ghét nhất là ngày bỏ tập.'},
  {id:'bear',  name:'Gấu Thép',     need:3,  rar:0, intro:'Thân thép, đầu lạnh. Nâng gì cũng được, trừ trà sữa.'},
  {id:'fox',   name:'Cáo Sấm',      need:7,  rar:1, intro:'Nhanh như chớp, lắm mồm như sấm. Thích đếm bước chân hộ ông.'},
  {id:'dragon',name:'Rồng Con',     need:14, rar:1, intro:'Phun khói chứ chưa phun lửa. Ăn đúng thực đơn thì lớn nhanh.'},
  {id:'tiger', name:'Hổ Băng',      need:21, rar:1, intro:'Lạnh lùng ngoài mặt, trong bụng là cả một lò sưởi kỷ luật.'},
  {id:'owl',   name:'Cú Bóng Đêm',  need:30, rar:2, intro:'Canh giấc ngủ của ông. Thức khuya là nó trừng mắt.'},
  {id:'rhino', name:'Tê Giác Giáp', need:45, rar:2, intro:'Húc tan mọi cái cớ. Giáp đồng, sừng ngà, không lùi bước nào.'},
  {id:'mecha', name:'Khủng Long Máy',need:60,rar:2, intro:'Chạy bằng đạm và mồ hôi. Kính đỏ quét thấy mỡ từ xa.'},
  {id:'uni',   name:'Kỳ Lân Điện',  need:75, rar:3, intro:'Bờm phóng điện, sừng gọi sét. Chỉ hiện ra với người không bỏ cuộc.'},
  {id:'phoenix',name:'Phượng Hoàng',need:84, rar:3, intro:'Tái sinh từ 84 ngày lửa. Ai có nó là đã về đích.'}
];
const RARITY = [
  {n:'Thường',c:'#9fb1c9'},
  {n:'Hiếm',c:'#38b6ff'},
  {n:'Sử thi',c:'#b46bff'},
  {n:'Huyền thoại',c:'#ffc21f'}
];
const LV_NEED = [0,2,3,4,5]; // thức ăn cần để lên Lv2..Lv5
const LV_PERK = ['','Khăn chiến','Huy chương','Hào quang','Vương miện'];

/* ===================== ĐỒ TRANG TRÍ ===================== */
const DECOR = [
  {id:'grass',  n:'Bãi cỏ hoa',   p:10,  ic:'🌼', d:'Cỏ dày, hoa nhỏ lấm tấm khắp sân.'},
  {id:'rock',   n:'Đá tảng',      p:20,  ic:'🪨', d:'Mấy tảng đá cho pet ngồi hóng gió.'},
  {id:'fire',   n:'Lửa trại',     p:30,  ic:'🔥', d:'Đống lửa giữa sân, cháy suốt đêm.'},
  {id:'lantern',n:'Đèn lồng',     p:40,  ic:'🏮', d:'Dây đèn lồng đỏ vàng giăng ngang trời.'},
  {id:'flag',   n:'Cờ chiến',     p:60,  ic:'🚩', d:'Cờ in chữ −25, cắm giữa sân.'},
  {id:'tent',   n:'Lều trại',     p:80,  ic:'⛺', d:'Lều sọc cho pet chui vào ngủ.'},
  {id:'tree',   n:'Cây cổ thụ',   p:100, ic:'🌳', d:'Tán to, rễ chắc, bóng mát cả góc sân.'},
  {id:'rack',   n:'Giàn tạ',      p:120, ic:'🏋️', d:'Giàn squat mini để pet tập theo chủ.'},
  {id:'falls',  n:'Thác nước',    p:150, ic:'💦', d:'Vách đá có thác chảy ầm ầm.'},
  {id:'tower',  n:'Tháp canh',    p:180, ic:'🗼', d:'Tháp gỗ cao, đứng trên đó thấy cả vùng.'},
  {id:'night',  n:'Bầu trời đêm', p:220, ic:'🌙', d:'Đổi trời sang đêm sao và trăng khuyết.'},
  {id:'rainbow',n:'Cầu vồng',     p:260, ic:'🌈', d:'Cầu vồng vắt ngang sau núi.'}
];

/* ===================== THÀNH TỰU ===================== */
// t: 0 đồng, 1 bạc, 2 vàng. Hàm kiểm tra nhận ctx (tính sẵn).
const BADGES = [
  {id:'first', ic:'🥚', n:'Buổi đầu tiên', d:'Chốt ngày đầu tiên', t:0, ok:c=>c.total>=1},
  {id:'s3',  ic:'🔥', n:'Chuỗi 3 ngày',  d:'Chốt 3 ngày liền', t:0, ok:c=>c.best>=3, pr:c=>[c.best,3]},
  {id:'s7',  ic:'🔥', n:'Chuỗi 7 ngày',  d:'Chốt 7 ngày liền', t:0, ok:c=>c.best>=7, pr:c=>[c.best,7]},
  {id:'s14', ic:'🔥', n:'Chuỗi 14 ngày', d:'Chốt 14 ngày liền', t:1, ok:c=>c.best>=14, pr:c=>[c.best,14]},
  {id:'s30', ic:'🔥', n:'Chuỗi 30 ngày', d:'Chốt 30 ngày liền', t:1, ok:c=>c.best>=30, pr:c=>[c.best,30]},
  {id:'s60', ic:'🔥', n:'Chuỗi 60 ngày', d:'Chốt 60 ngày liền', t:2, ok:c=>c.best>=60, pr:c=>[c.best,60]},
  {id:'k5',  ic:'⚖️', n:'Giảm 5 kg',  d:'Cân sáng thấp hơn cân ban đầu 5 kg', t:0, ok:c=>c.lost>=5, pr:c=>[c.lost,5]},
  {id:'k10', ic:'⚖️', n:'Giảm 10 kg', d:'Cân sáng thấp hơn cân ban đầu 10 kg', t:1, ok:c=>c.lost>=10, pr:c=>[c.lost,10]},
  {id:'k15', ic:'⚖️', n:'Giảm 15 kg', d:'Cân sáng thấp hơn cân ban đầu 15 kg', t:1, ok:c=>c.lost>=15, pr:c=>[c.lost,15]},
  {id:'k20', ic:'⚖️', n:'Giảm 20 kg', d:'Cân sáng thấp hơn cân ban đầu 20 kg', t:2, ok:c=>c.lost>=20, pr:c=>[c.lost,20]},
  {id:'k25', ic:'👑', n:'Giảm 25 kg', d:'Chạm mốc −25 kg', t:2, ok:c=>c.lost>=25, pr:c=>[c.lost,25]},
  {id:'w1',  ic:'🗓️', n:'Xong tuần 1',  d:'Chốt ít nhất 5/7 ngày của tuần 1', t:0, ok:c=>c.week[1]>=5, pr:c=>[c.week[1],5]},
  {id:'w4',  ic:'🗓️', n:'Xong tuần 4',  d:'Chốt ít nhất 5/7 ngày của tuần 4', t:1, ok:c=>c.week[4]>=5, pr:c=>[c.week[4],5]},
  {id:'w8',  ic:'🗓️', n:'Xong tuần 8',  d:'Chốt ít nhất 5/7 ngày của tuần 8', t:1, ok:c=>c.week[8]>=5, pr:c=>[c.week[8],5]},
  {id:'w12', ic:'🏁', n:'Về đích tuần 12', d:'Chốt ít nhất 5/7 ngày của tuần 12', t:2, ok:c=>c.week[12]>=5, pr:c=>[c.week[12],5]},
  {id:'perfect', ic:'💎', n:'Tuần sắt', d:'Chốt đủ 7/7 ngày trong một tuần', t:1, ok:c=>c.perfectWeek, pr:c=>[c.maxWeek,7]},
  {id:'water7', ic:'💧', n:'Lạc đà', d:'Uống đủ 4 lít 7 ngày liền', t:0, ok:c=>c.runWater>=7, pr:c=>[c.runWater,7]},
  {id:'sleep7', ic:'😴', n:'Ngủ như gấu', d:'Ngủ đủ 7–8 tiếng 7 đêm liền', t:0, ok:c=>c.runSleep>=7, pr:c=>[c.runSleep,7]},
  {id:'weigh7', ic:'📏', n:'Cân đều tay', d:'Cân buổi sáng 7 ngày liền', t:0, ok:c=>c.runWeigh>=7, pr:c=>[c.runWeigh,7]},
  {id:'steps30', ic:'👣', n:'Chân sắt', d:'Đủ 15.000 bước 30 ngày', t:1, ok:c=>c.steps>=30, pr:c=>[c.steps,30]},
  {id:'heavy10', ic:'⚡', n:'Phổi thép', d:'Xong 10 buổi cardio nặng', t:1, ok:c=>c.heavy>=10, pr:c=>[c.heavy,10]},
  {id:'refeed', ic:'🍚', n:'Nạp kho', d:'Chốt một ngày ăn nhiều', t:0, ok:c=>c.refeed>=1},
  {id:'comeback', ic:'💪', n:'Quay lại mạnh hơn', d:'Chốt lại ngay sau khi đứt chuỗi', t:0, ok:c=>c.comeback},
  {id:'shield', ic:'🛡️', n:'Có khiên', d:'Nhận khiên giữ chuỗi đầu tiên', t:0, ok:c=>c.best>=7},
  {id:'pets5', ic:'🐾', n:'Chủ trại', d:'Mở khóa 5 pet', t:1, ok:c=>c.pets>=5, pr:c=>[c.pets,5]},
  {id:'pets10', ic:'🏆', n:'Đủ bộ 10 pet', d:'Mở khóa cả 10 pet', t:2, ok:c=>c.pets>=10, pr:c=>[c.pets,10]},
  {id:'lv5', ic:'⭐', n:'Pet max cấp', d:'Nuôi một pet lên Lv5', t:1, ok:c=>c.maxLv>=5, pr:c=>[c.maxLv,5]},
  {id:'decor6', ic:'🏕️', n:'Kiến trúc sư', d:'Mua 6 món trang trí', t:1, ok:c=>c.decor>=6, pr:c=>[c.decor,6]}
];
const BADGE_REWARD = [{c:20,f:0},{c:40,f:1},{c:80,f:2}];
const STREAK_BONUS = {7:{c:30,f:1},14:{c:50,f:1},30:{c:100,f:2},60:{c:150,f:2}};
