# Hành Trình -25kg

App theo dõi 84 ngày giảm 25 kg: chốt ngày, nuôi pet, ghi cân. Cài ra màn hình chính như app thường, mở toàn màn hình, mất mạng vẫn chạy, không cần đăng nhập. Dữ liệu nằm ngay trên điện thoại.

Địa chỉ: **https://lmaoezzz.github.io/hanh-trinh-25kg/**

## Cài ra màn hình chính

Mở app lần đầu khi có mạng để app tải đủ file. Từ lần sau mất mạng vẫn dùng bình thường.

**iPhone (Safari)**

1. Mở địa chỉ trên bằng Safari.
2. Bấm nút Chia sẻ (ô vuông có mũi tên lên) → **Thêm vào MH chính** → **Thêm**.
3. Từ giờ mở app bằng biểu tượng Sói Lửa trên màn hình chính.

Lưu ý: trên iPhone, app ngoài màn hình chính và Safari giữ dữ liệu riêng. Ghi trong Safari sẽ không hiện trong app, và ngược lại. Cài xong thì chỉ dùng app ngoài màn hình chính.

**Android (Chrome)**

1. Mở địa chỉ trên bằng Chrome.
2. Bấm ⋮ → **Cài đặt ứng dụng** (máy cũ ghi **Thêm vào màn hình chính**). Trong app cũng có nút **Cài app** ở ⚙️ Cài đặt.

## Chuyển dữ liệu từ bản cũ trên Claude

1. Mở bản cũ trên Claude → ⚙️ → **Sao chép bản sao lưu**.
2. Mở app mới từ màn hình chính → ⚙️ → **Khôi phục từ bản sao lưu** → dán vào ô → **Khôi phục từ chữ đã dán**.
3. App hiện tóm tắt (ngày bắt đầu, số ngày đã chốt, số lần cân). Đúng thì bấm **Ghi đè**.

## Sao lưu

Dữ liệu chỉ nằm trên máy này. Xóa dữ liệu trình duyệt, gỡ app hay đổi máy là mất, nên sao lưu đều tay.

- ⚙️ → **Tải file sao lưu**: lưu file `hanh-trinh-25kg-<ngày>.json`. Trên iPhone sẽ hiện bảng chia sẻ, chọn **Lưu vào Tệp** hoặc gửi qua Zalo, email cho chính mình.
- ⚙️ → **Sao chép bản sao lưu**: chép toàn bộ dữ liệu dạng chữ, dán vào Ghi chú.
- Khôi phục: ⚙️ → **Khôi phục từ bản sao lưu** → **Chọn file sao lưu** (hoặc dán chữ) → **Ghi đè**.

Quá 7 ngày chưa sao lưu, màn Hôm nay hiện một lời nhắc nhỏ. Bấm **Để mai** để hoãn, **Tắt nhắc** để tắt hẳn; bật lại trong ⚙️.

## Cập nhật

Khi có bản mới, cuối màn hình hiện thanh **Có bản mới — chạm để cập nhật**. Chạm vào là xong, dữ liệu giữ nguyên. Muốn kiểm tra ngay: ⚙️ → **Kiểm tra bản mới**.

Cho người sửa code: sửa file nào cũng phải tăng `VERSION` trong `sw.js` (v1 → v2 → v3…) rồi mới đẩy lên. Thêm file mới thì thêm cả tên file vào danh sách `ASSETS` trong `sw.js`.

## Hạn chế

- iPhone không hỗ trợ rung nên chốt ngày không rung máy. Android vẫn rung.
- Chưa có thông báo đẩy nhắc giờ tập.
- iPhone có thể tự xóa dữ liệu của web app khi máy thiếu dung lượng hoặc app bỏ lâu không mở. App đã xin trình duyệt cho lưu lâu dài, nhưng vẫn nên tải file sao lưu mỗi tuần.

## Thư mục

- `index.html`, `manifest.webmanifest`, `sw.js`: vỏ app, khai báo cài đặt, chạy offline.
- `css/`, `js/`: giao diện và logic.
- `fonts/`: font Baloo 2 (giấy phép SIL OFL, xem `fonts/OFL.txt`), không gọi Google Fonts.
- `icons/`: `icon.svg` là bản vẽ gốc của icon.

Mọi đường dẫn đều tương đối nên app chạy được ở bất kỳ thư mục con nào: GitHub Pages, Netlify hay máy chủ tĩnh khác.
