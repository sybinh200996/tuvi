# Cập nhật định tuyến AI: OpenAI Responses API và routing riêng từng hãng

## Đã thay đổi

- OpenAI hiện dùng `POST /v1/responses` (không còn gọi Chat Completions cho OpenAI trực tiếp).
- Anthropic vẫn gọi riêng `POST /v1/messages`; Gemini dùng SDK `@google/genai`; các nhà cung cấp tương thích (Groq, OpenRouter, DeepSeek, xAI, Qwen, Mistral) có adapter và endpoint riêng.
- Khi người dùng chọn một provider/model cụ thể, request chỉ gọi provider đó. Nếu lỗi, backend trả lỗi và danh sách lần thử của đúng provider; không gửi model ID sang hãng khác.
- Chế độ Auto có thể chuyển provider khi lỗi, nhưng mỗi provider fallback tự dùng model mặc định/cấu hình riêng của chính provider đó.
- API response chat trả `provider` và `model` thực tế để hỗ trợ kiểm tra.
- Model mặc định nâng lên OpenAI `gpt-6.1-sol`, Anthropic `claude-opus-5-5`, Gemini `gemini-3.1-pro-preview`. Quyền gọi từng model phụ thuộc API key/tài khoản/khu vực; có thể đổi qua biến `*_MODEL`.
- Thêm kiểm thử giả lập không gọi API thật: `npm run test:ai-routing`.

## Cấu hình API key an toàn

1. Tạo API key trong trang developer chính thức của OpenAI, Anthropic và Google AI Studio/Google Cloud.
2. Đặt key trên **máy chủ chạy Node.js**, không đưa vào `public/`, frontend JavaScript, HTML, URL, ảnh chụp, Git hoặc tin nhắn.
3. Sao chép `.env.example` thành `.env` chỉ khi máy chủ chưa có `.env`; nếu đã có thì **không ghi đè**. Điền các giá trị secret tại server:

   ```dotenv
   OPENAI_API_KEY=...
   ANTHROPIC_API_KEY=...
   GEMINI_API_KEY=...
   ```

4. Trên Linux, giới hạn quyền file và đặt owner là tài khoản chạy app:

   ```bash
   chown <user-chay-app>:<group-chay-app> .env
   chmod 600 .env
   ```

   Nên dùng secret manager hoặc `EnvironmentFile` riêng cho production nếu hạ tầng hỗ trợ. Không in `process.env` vào log.
5. Restart Node process sau khi đổi biến môi trường. Thu hồi/rotate key nếu từng bị commit hoặc chia sẻ nhầm.

`.gitignore` đã loại `.env` và mọi `.env.*`, đồng thời cho phép duy nhất `.env.example`. Gói ZIP bàn giao không chứa `.env`, key hoặc `node_modules`.

## Cài cập nhật lên máy chủ

1. Sao lưu `server.js`, `package.json` và `.env` hiện tại.
2. Giải nén gói cập nhật vào thư mục dự án, giữ nguyên `.env` production đang có (không chép `.env.example` đè lên).
3. Cài dependency nếu cần: `npm install` (Node.js 20 trở lên).
4. Chạy kiểm thử định tuyến giả lập: `npm run test:ai-routing`.
5. Khởi động lại dịch vụ theo cách triển khai hiện có (PM2/systemd/container), rồi kiểm tra log và gửi một request thử từ app.

Test routing mock sử dụng key giả và chặn các request provider; nó không xác minh quota/quyền truy cập hoặc phát sinh chi phí API.
