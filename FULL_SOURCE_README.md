# Full source — Synam Mystic AI Web App

Đây là **mã nguồn đầy đủ của ứng dụng web đang chạy**, không phải ZIP patch. Gói có backend Node.js/Express, toàn bộ frontend và assets hiện hành trong `public/`, package manifests, cấu hình, helper build/deploy an toàn, regression test routing và tài liệu cập nhật.

## Vì sao một số file không nằm trong ZIP

- Không đóng gói `.env` hoặc API credentials thật. Chỉ có `.env.example` an toàn. File `.env` hiện có quyền `0600`; hãy tự tạo/cập nhật secret trên máy chủ hoặc secret manager.
- Không đóng gói `node_modules/`; cài lại đúng phiên bản bằng `npm ci` từ `package-lock.json`.
- Không đóng gói bản ghi thật trong `data/users.json` và `data/sessions.json`; ZIP tạo các file rỗng làm mẫu. Server cũng tự tạo store khi thiếu.
- Không đóng gói screenshot, preview, ZIP backup, thư mục workspace bản cũ hoặc hàng loạt script vá giao diện dùng một lần. Current app source và assets gốc vẫn đầy đủ trong `public/`.
- Loại `deploy.cjs` cũ vì trong đó có credential SSH hard-coded. Không đưa credential đó vào archive. Nếu credential đó còn hoạt động, hãy đổi/thu hồi nó. Gói chỉ giữ helper deploy mobile theo SSH key (`deploy-chat-mobile.cjs`), cần rà soát host/đường dẫn trước khi chạy.

## Chạy cục bộ

Yêu cầu Node.js 20 trở lên.

```bash
npm ci
cp .env.example .env
# Thêm OPENROUTER_API_KEY bằng secret của bạn; không dán key vào chat.
chmod 600 .env
npm start
```

Mở `http://localhost:3000/` cho web UI hoặc `http://localhost:3000/mobile.html` cho app Mobile. Mẫu `.env.example` giữ `FREE_MODELS_ONLY=true`; không bỏ cờ này nếu không muốn gọi provider có thể tính phí. Trong chế độ này chỉ `openrouter/free` được phép dùng; API model khác bị khóa tại backend. Hosting miễn phí cho app không đồng nghĩa API của provider cũng miễn phí.

Trong `server.js`, nếu biến `FREE_MODELS_ONLY` không được đặt thì mặc định là `false`; vì vậy luôn copy `.env.example` hoặc đặt biến này rõ ràng trên hosting. `render.yaml` đi kèm đã bật strict free-only và khai báo OpenRouter key dạng secret không đồng bộ.

## Build và test

```bash
node compile.cjs
node --check server.js
npm run test:ai-routing
```

`compile.cjs` dùng cấu hình React classic runtime tương thích với React UMD mà `mobile.html` nạp. Không override `.babelrc` bằng preset JSX runtime khác.

## Thành phần chính

- `server.js` — API, auth/session handling, adapter model và routing provider.
- `public/` — toàn bộ trang web/mobile, JS, CSS, service worker, manifest và assets.
- `data/` — empty users/sessions seed files.
- `package.json`, `package-lock.json`, `.babelrc`, `.npmrc`, `.gitignore`, `render.yaml`, `.env.example`.
- `compile.cjs`, `deploy-chat-mobile.cjs`, `scripts/test-ai-routing.mjs`.
- README và báo cáo test model hiện hành.
