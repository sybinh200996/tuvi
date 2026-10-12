# Bản cập nhật Chat AI Mobile

## Thay đổi
- Thêm nút **Tải ảnh**, **Chụp ảnh**, **Tải file**, nút xóa từng tệp và **Xóa hết**.
- Thêm chọn model/provider ngay trong composer; tin nhắn văn bản đi qua Multi-AI, còn ảnh/tệp dùng endpoint đa phương thức có sẵn.
- Thêm nhập giọng nói tiếng Việt. Khi nhận diện kết thúc, ứng dụng đếm 3 giây rồi tự gửi; có thể dừng ghi âm, hủy đếm ngược hoặc dừng phản hồi AI.
- Đổi lời chào thành **“Chào bạn”** và placeholder thành **“Nhập tin nhắn...”**.
- Desktop giữ kính mờ riêng bong bóng lời chào; app mobile dùng bong bóng trong suốt, không blur, rộng gần hết vùng chat; lời chào thử màu xanh lá `#62FF7B`, cỡ 18px nét thường, có glow nhẹ; ẩn avatar riêng trong bubble để dành chỗ cho nội dung.
- Làm trong rail tab trên app mobile; tab đang chọn vẫn nhận diện bằng nền vàng bán trong suốt.
- Thay icon Trang chủ, Lịch sử, AI Chat và Tài khoản bằng SVG outline neon; thêm nhãn truy cập cho các nút điều hướng.
- Làm nền khung nhập chat mobile trong suốt, không blur; giữ viền nhẹ và giữ tương phản riêng cho nút tải tệp, micro, gửi/dừng.
- Thu gọn nút **AI Phân tích** trên banner app mobile để nhường chỗ cho ô nhập câu hỏi.
- Đổi asset nền chat sang `chat-bg-moon-small-final.png`: vòng hoàng đạo/mặt trăng nhỏ hơn; chùa, núi, hồ và các vùng ngoài khu vực chỉnh được giữ nguyên từ ảnh gốc.
- Giữ nguyên `public/mobile.html`.

## Điều kiện sử dụng
- File: tối đa 6 tệp mỗi lượt, tối đa 12 MB/tệp và 14 MB tổng dung lượng. Phân tích ảnh/tệp dùng endpoint `/api/chat-ai`, cần backend có Gemini API key; văn bản không đính kèm dùng provider/model đã chọn.
- Nhập giọng nói dùng Web Speech API (`SpeechRecognition`/`webkitSpeechRecognition`) và cần quyền micro trên HTTPS. Nếu trình duyệt không hỗ trợ, giao diện hướng dẫn dùng micro của bàn phím điện thoại.

## Build/deploy
Tại thư mục gốc dự án, chạy `node deploy-chat-mobile.cjs`. Script build bundle từ `public/mobile-app.js`, cập nhật cache và deploy các tệp trong allowlist qua SSH key/agent; host key phải có trong `known_hosts`. Có thể ghi đè target bằng `DEPLOY_HOST`, `DEPLOY_USER` và `DEPLOY_DIR`.

`public/mobile.html` không nằm trong gói cập nhật. Tệp `.env`, dữ liệu và `node_modules` cũng không được đóng gói.
