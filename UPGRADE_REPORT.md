# Báo cáo nâng cấp Dang Nam NAM46 – Trợ lý AI chuyên nghiệp

## Phạm vi nâng cấp

Bản app đã được nâng cấp từ **1.45.0** lên **1.46.0**, tập trung vào chất lượng trả lời của trợ lý AI trên cả desktop và mobile. Trợ lý hiện có một bộ chính sách trả lời dùng chung, yêu cầu xác định đúng ý người dùng, trả lời bằng tiếng Việt rõ ràng, phân biệt dữ kiện với suy luận, nêu giả định khi thiếu thông tin, không bịa nguồn hoặc số liệu, và trình bày theo cấu trúc phù hợp với từng loại câu hỏi.

Người dùng có thể chọn ba mức trả lời trong giao diện chat: **Chi tiết chuyên nghiệp**, **Chuyên gia sâu** và **Ngắn gọn**. Chế độ được gửi từ desktop/mobile tới backend qua `answerStyle`; backend chuẩn hóa thêm `responseStyle` nếu client cũ sử dụng tên này. Prompt hệ thống được truyền riêng tới provider thay vì trộn hoàn toàn vào câu hỏi người dùng, giúp AI giữ vai trò ổn định hơn trong các lượt hội thoại, kể cả khi dùng Multi-AI hoặc Hội Đồng AI.

Các route phân tích ảnh/file, xem tay, xem tướng, tình duyên, giáo viên AI và mystic AI cũng đã nhận policy chuyên nghiệp mặc định. Điều này giúp những câu trả lời ngoài màn hình chat có cấu trúc, cảnh báo giới hạn tham khảo và cách diễn đạt nhất quán hơn.

## Sửa lỗi provider và khả năng vận hành

Bộ chuyển lỗi backend đã được sửa để hiển thị đúng provider gặp sự cố. Trước đây lỗi API key của OpenAI có thể bị báo nhầm là lỗi Gemini; hiện thông báo sẽ nêu đúng provider, model hoặc nhóm lỗi mạng/quota tương ứng. Các provider vẫn được chọn theo key của tài khoản hoặc biến môi trường riêng, không dùng nhầm key giữa các dịch vụ.

Service worker đã được bump lên cache `synam-nam46-assistant-v1`, bảo đảm trình duyệt nhận bundle mobile và chính sách AI mới thay vì giữ bản NAM45 cũ. Bundle mobile compiled tiếp tục được dùng trong production để tránh lỗi Babel runtime và lỗi trắng màn hình trên trình duyệt không có bundler.

## Kiểm thử

| Hạng mục | Kết quả |
|---|---|
| `node --check server.js` | Đạt sau khi thêm policy và sửa error mapping |
| `node --check public/app.js` | Đạt |
| `node --check public/mobile-app.compiled.js` | Đạt |
| Desktop `/` | Tải bình thường |
| Desktop `#/chat` | Hiển thị selector độ chi tiết và composer đầy đủ |
| Mobile `/mobile.html` | Render thành công, không còn trắng màn hình |
| Mobile AI Router | Có selector Chi tiết chuyên nghiệp / Chuyên gia sâu / Ngắn gọn |
| `/api/health` và `/api/ai/providers` | Đạt |
| Chat ngày/giờ local không cần API key | Đạt |
| Contract `answerStyle`/`responseStyle` | Đã kiểm tra backend nhận và trả lại `answerStyle` |
| OpenAI smoke test | Backend đã gọi đúng provider; key hiện tại không hợp lệ nên trả lỗi OpenAI cụ thể, không còn báo nhầm Gemini |

Trong môi trường kiểm thử hiện tại, OpenAI được nhận diện là đã cấu hình nhưng API key trả về lỗi xác thực. Đây là vấn đề cấu hình key/quota bên ngoài mã nguồn; người dùng cần thay key hợp lệ trong tab **AI Keys** hoặc biến môi trường `OPENAI_API_KEY` khi triển khai. Khi key hợp lệ, chế độ trả lời chuyên nghiệp sẽ được áp dụng tự động.

## Cách chạy

```bash
npm install
npm start
```

Mở `http://localhost:3000/` cho desktop hoặc `http://localhost:3000/mobile.html` cho mobile. Có thể chọn provider, model và độ chi tiết ngay trong màn hình **AI Chat**. Khi deploy production, đặt các biến môi trường cần thiết, ví dụ:

```env
PORT=3000
OPENAI_API_KEY=your_valid_key
GEMINI_API_KEY=your_valid_key
CORS_ORIGIN=https://ten-mien-cua-ban.example
JSON_LIMIT=22mb
```

Nếu trình duyệt đã cài PWA bản cũ, hãy đóng các tab app rồi mở lại một lần để service worker `synam-nam46-assistant-v1` kích hoạt.

## QA tự động cuối

Bộ kiểm tra deterministic `assistant-qa.mjs` đã xác nhận **17/17 kiểm tra đạt**, bao gồm version 1.46.0, policy trả lời chuyên nghiệp, tương thích `answerStyle`/`responseStyle`, error mapping theo provider, selector desktop, state/payload mobile, bundle compiled, cache PWA NAM46, health endpoint, fallback ngày/giờ và thông báo lỗi OpenAI đúng provider. Bộ script QA chỉ dùng trong quá trình kiểm thử và đã được loại khỏi gói bàn giao cuối.

Browser smoke test cuối trên backend NAM46 xác nhận desktop chat render đầy đủ selector độ chi tiết; mobile render bằng bundle compiled, hiển thị nội dung NAM46 và không phát sinh màn hình trắng.
