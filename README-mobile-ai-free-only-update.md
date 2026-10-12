# Mobile AI — cập nhật free-only và routing an toàn

Bản cập nhật này đưa model selector Mobile đi đúng provider/model, sửa nhãn lỗi và bật chế độ **chỉ cho phép OpenRouter Free** nếu `FREE_MODELS_ONLY=true`. Không có production deployment nào được thực hiện trong lượt này.

## Thành phần

- `server.js`: OpenAI Responses API adapter; adapter riêng theo provider; model ID fallback luôn lấy từ catalog provider đích; lựa chọn provider tường minh không âm thầm chuyển hãng; provider bị khóa được loại trước khi gọi API; lỗi giữ nhãn provider đúng; Gemini direct routes bị chặn trong strict free-only.
- `public/mobile-app.js` và `public/mobile-app.compiled.js`: mobile selector/status đồng bộ và thông báo không gán nhầm lỗi key Gemini. Bundle phải build theo `.babelrc` của dự án.
- `.env.example`: mẫu biến môi trường không có secret.
- `scripts/test-ai-routing.mjs`: regression test với `fetch` giả lập; không gọi API ngoài.
- `mobile-chat-ai-free-validation-2026-10-09.md`: kết quả E2E live free-only và giới hạn.

## Thiết lập an toàn

1. Trên máy chủ riêng, copy `.env.example` thành `.env` và đặt quyền tối thiểu (Linux: `chmod 600 .env`). Không commit `.env`, đưa file này vào ZIP, log, hoặc gửi giá trị API key qua chat.
2. Với chế độ nghiêm ngặt không phát sinh phí, giữ `FREE_MODELS_ONLY=true`, đặt đúng `OPENROUTER_API_KEY` trực tiếp trong secret manager/server, và `OPENROUTER_MODEL=openrouter/free`. Chế độ này bật router free; các provider còn lại bị chặn dù biến key có mặt.
3. Để bật Gemini/Groq/Mistral, trước hết xác nhận account/project thực sự ở free tier, quota còn lại và không có pay-as-you-go overage. Chỉ đổi allowlist sau khi người quản lý chấp nhận rủi ro billing; không suy đoán tier từ việc key tồn tại.
4. Nếu `FREE_MODELS_ONLY=false`, backend có thể gửi request tới các endpoint trả phí theo key/model đã cấu hình. Không dùng giá trị đó để kiểm tra nếu không có sự cho phép rõ ràng về chi phí.

## Build và kiểm tra

```bash
npm install
node_modules/.bin/babel public/mobile-app.js -o public/mobile-app.compiled.js
node --check server.js
node --check public/mobile-app.compiled.js
npm run test:ai-routing
```

Không override preset JSX bằng `--presets @babel/preset-react`; việc đó đã tạo `import react/jsx-dev-runtime` không chạy được trong trang UMD. Lệnh trên nạp `.babelrc` (`runtime: classic`) của dự án.

Kết quả kiểm thử trên app Mobile viewport 390×844 và ảnh chụp được ghi trong báo cáo đi kèm. Đã thử lựa chọn trực tiếp và chế độ Auto; cả hai đều route tới `openrouter/free` và trả đúng prompt tính toán. Mọi provider khác bị khóa tại backend.

## Ghi chú ảnh/tệp

Mobile Chat có thể tải ảnh/tệp, nhưng route hiện tại xử lý ảnh/tệp qua Gemini. Khi strict free-only bật, backend chặn nhánh đó trước khi gọi Gemini để không phát sinh phí. Muốn hỗ trợ ảnh/tệp trong free-only, cần triển khai adapter vision qua model/router $0, xác nhận upload data format và kiểm thử riêng; không tự động bật Gemini.

## Triển khai

Đưa các file code và `.env.example` lên môi trường staging/production theo quy trình quản trị hiện có, đặt secret trong `.env`/secret manager tại máy chủ, rebuild bundle và restart Node service. Sau khi deploy, xác nhận `/api/health` báo `openrouter` configured và `/api/ai/providers` chỉ liệt kê model được allowlist. Không deploy ZIP nguyên trạng nếu chưa cập nhật file `.env` của môi trường đích.


## Trạng thái khóa khi `FREE_MODELS_ONLY=true`

Chỉ `openrouter/free` được phép dùng. Backend local đã xác nhận lựa chọn explicit của OpenAI, Anthropic, Gemini, Groq, DeepSeek, Grok, Qwen và Mistral bị từ chối trước upstream (zero provider attempts). Đây là trạng thái fail-closed, không phải kết luận các hãng/model đó không hoạt động hay kém chất lượng.
