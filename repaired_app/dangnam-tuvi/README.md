# Dang Nam Mystic AI Ultimate Pro 🔮

Bản Super Pro gồm:

- Giao diện xanh dương sáng, banner đẹp, mây, hoa văn âm dương/ngũ hành.
- Chạy local không cần API.
- Có server Gemini để AI viết bài luận giải dài như ví dụ.
- Upload ảnh lòng bàn tay và khuôn mặt.
- Tử vi, Can Chi, Ngũ hành, nạp âm, cung phi, chiêm tinh.
- Tarot.
- Chat hỏi tiếp sau khi luận giải.
- Lưu lịch sử trên máy.
- In / lưu PDF bằng trình duyệt.
- PWA cài như app điện thoại.

## Cách chạy nhanh trên máy tính

### 1. Cài NodeJS

Tải NodeJS bản LTS rồi cài.

### 2. Giải nén ZIP

Mở CMD trong thư mục project.

### 3. Cài package

```bash
npm install
```

### 4. Tạo file `.env`

Copy file `.env.example` thành `.env`, rồi thay API key:

```env
GEMINI_API_KEY=AIza...
PORT=3000
```

### 5. Chạy app

```bash
npm start
```

Mở:

```text
http://localhost:3000
```

## Nếu không có API key

Bạn vẫn mở được:

```text
public/index.html
```

Nhưng chỉ chạy bản local. Nút AI cao cấp cần server.

## Đưa lên GitHub Pages

GitHub Pages chỉ chạy frontend local, không chạy server Gemini.

Cách đưa lên:

1. Tạo repo GitHub.
2. Upload thư mục `public`.
3. Vào Settings → Pages.
4. Chọn branch main và thư mục `/public`.

Nếu muốn chạy AI thật online, cần deploy server lên Render/Railway/VPS.

## Cài trên điện thoại

Sau khi chạy bằng server hoặc GitHub Pages:

### Android Chrome
- Mở link app.
- Bấm dấu ba chấm.
- Chọn "Add to Home screen" hoặc "Install app".

### iPhone Safari
- Mở link app.
- Bấm Share.
- Chọn "Add to Home Screen".

## Lưu ý an toàn

Ứng dụng dùng dữ liệu truyền thống/văn hóa và AI để tạo nội dung tham khảo. Không dùng để thay thế tư vấn y tế, pháp lý, tài chính, hôn nhân hoặc quyết định quan trọng.

---

# NAM24 - Hướng dẫn cấu hình đăng nhập Google / Facebook bằng Firebase

## Vì sao bấm Google/Facebook chưa vào được?
Đăng nhập Google/Facebook không tự chạy chỉ bằng code app. Bạn cần tạo Firebase project, bật Firebase Authentication và điền cấu hình Firebase vào `.env` hoặc Environment Variables của hosting.

Nếu chưa cấu hình, app sẽ chỉ dùng được đăng ký/đăng nhập bằng email + mật khẩu của server.

## Bước 1: Tạo Firebase Project
1. Vào Firebase Console: https://console.firebase.google.com
2. Bấm **Add project / Thêm dự án**.
3. Đặt tên, ví dụ: `synam-ai`.
4. Tạo project.

## Bước 2: Thêm Web App
1. Trong Firebase Project, bấm biểu tượng **Web `</>`**.
2. Đặt tên app, ví dụ: `Dang Nam Web`.
3. Firebase sẽ hiện cấu hình dạng:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "...",
  measurementId: "..."
};
```

Bạn cần copy các giá trị này sang `.env`.

## Bước 3: Bật Google Login
1. Firebase Console → **Authentication**.
2. Vào tab **Sign-in method**.
3. Chọn **Google**.
4. Bấm **Enable**.
5. Chọn email hỗ trợ.
6. Save.

## Bước 4: Bật Facebook Login
1. Firebase Console → **Authentication** → **Sign-in method**.
2. Chọn **Facebook** → Enable.
3. Firebase sẽ yêu cầu:
   - Facebook App ID
   - Facebook App Secret

Bạn cần tạo app trên Meta for Developers:

1. Vào https://developers.facebook.com
2. Tạo app mới.
3. Thêm sản phẩm **Facebook Login**.
4. Copy **App ID** và **App Secret** về Firebase.
5. Trong Firebase Facebook provider sẽ có dòng **OAuth redirect URI**.
6. Copy dòng đó dán vào Meta app → Facebook Login → Settings → **Valid OAuth Redirect URIs**.
7. Save.

## Bước 5: Thêm Authorized Domains
Trong Firebase Console:

Authentication → Settings → Authorized domains

Thêm các domain bạn dùng, ví dụ:

```text
localhost
synam.online
www.synam.online
<ten-app>.onrender.com
```

Nếu thiếu domain, Google/Facebook login sẽ bị chặn hoặc báo lỗi domain không hợp lệ.

## Bước 6: Cấu hình `.env` khi chạy local
Mở file `.env` và thêm:

```env
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_APP_ID=your_firebase_app_id
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Sau đó chạy lại:

```bash
npm install
npm start
```

Mở kiểm tra:

```text
http://localhost:3000/api/auth/firebase-config
```

Nếu đúng sẽ thấy:

```json
{
  "enabled": true
}
```

## Bước 7: Cấu hình trên Render
Render → Service của app → **Environment** → Add Environment Variable:

```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_APP_ID=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_MEASUREMENT_ID=...
```

Sau đó bấm:

```text
Manual Deploy → Deploy latest commit
```

## Bước 8: Cấu hình trên Namecheap
cPanel → Setup Node.js App → Edit app → Environment Variables.

Thêm từng dòng:

```env
FIREBASE_API_KEY=...
FIREBASE_AUTH_DOMAIN=...
FIREBASE_PROJECT_ID=...
FIREBASE_APP_ID=...
FIREBASE_MESSAGING_SENDER_ID=...
FIREBASE_MEASUREMENT_ID=...
```

Sau đó bấm:

```text
Restart
```

## Lỗi thường gặp

### 1. Bấm Google/Facebook không mở gì
- Chưa có Firebase config trong `.env`.
- Chưa restart server sau khi thêm biến.
- Trình duyệt chặn popup.

### 2. Báo unauthorized domain
- Chưa thêm domain Render/Namecheap vào Firebase Authorized domains.

### 3. Facebook login báo redirect URI sai
- Chưa copy OAuth redirect URI từ Firebase sang Meta Developer.

### 4. Google chạy, Facebook không chạy
- Google chỉ cần bật provider.
- Facebook cần thêm App ID, App Secret và Redirect URI nên cấu hình phức tạp hơn.

### 5. Local chạy, hosting không chạy
- Hosting chưa có Environment Variables.
- Chưa restart Node.js app.
- Domain hosting chưa nằm trong Authorized domains.

## Ghi chú bảo mật
- Không commit `.env` lên GitHub.
- Không để lộ Firebase config kèm private secret. Firebase web config không phải secret tuyệt đối, nhưng vẫn nên quản lý cẩn thận.
- Facebook App Secret không đưa vào frontend. Chỉ nhập trong Firebase Console.

---

# NAM24 UX Fix

## Đã chỉnh trong bản NAM24
- Đổi nhãn trên hero từ **Đặng Năm Pro** thành **Tài khoản**.
- Ẩn các ghi chú kỹ thuật như `/api/health`, `/api/models`, `/api/auth/firebase-config` khỏi giao diện người dùng.
- Trang tài khoản chỉ còn nội dung dành cho khách/thành viên.
- Bấm tab/menu sẽ tự nhảy về khu vực nội dung chính.
- README có hướng dẫn cấu hình Google/Facebook chi tiết.
"# synam" 


## NAM46 Assistant Hybrid Desktop/Mobile — bản nâng cấp

Bản 1.46.0 tiếp tục chuẩn hóa trải nghiệm hybrid desktop/mobile và nâng cấp trợ lý AI. Giao diện chat có ba mức trả lời: Chi tiết chuyên nghiệp, Chuyên gia sâu và Ngắn gọn; backend dùng policy chung để câu trả lời rõ ràng, có cấu trúc, trung thực về dữ kiện và nhất quán giữa các provider. Mobile vẫn có khu vực đăng nhập/đăng ký trong tab AI Keys, lưu API key cá nhân sau khi đăng nhập, giữ lịch sử chat local an toàn hơn và nén ảnh trước khi gửi lên server.

PWA đã được cập nhật cache version mới, bao gồm `mobile.html`, `mobile-app.js`, `mobile-style.css` và các ảnh hero. Service worker dùng chiến lược ưu tiên mạng cho HTML/JavaScript/CSS để bản deploy mới không bị mắc ở giao diện cũ; khi offline, app vẫn dùng được shell đã cache.

Backend đã bổ sung session hết hạn sau 30 ngày, ghi `users.json` và `sessions.json` theo phương thức tệp tạm rồi đổi tên nguyên tử, cache-control riêng cho API, tắt header nhận diện Express và cho phép cấu hình `CORS_ORIGIN`/`JSON_LIMIT` qua biến môi trường.

### Biến môi trường tùy chọn mới

```env
PORT=3000
CORS_ORIGIN=https://ten-mien-cua-ban.example,https://www.ten-mien-cua-ban.example
JSON_LIMIT=22mb
```

Nếu để trống `CORS_ORIGIN`, app giữ cách chạy linh hoạt cho local và các frontend cùng server. Khi triển khai production, nên đặt danh sách domain cụ thể. Để trợ lý AI trả lời thật, thêm ít nhất một key hợp lệ, ví dụ `OPENAI_API_KEY` hoặc `GEMINI_API_KEY`; có thể nhập key trực tiếp trong tab **AI Keys**. Trong màn hình **AI Chat**, chọn provider, model và mức độ chi tiết trước khi gửi câu hỏi.

### Kiểm tra nhanh trước khi deploy

```bash
npm install
npm start
```

Sau đó mở `http://localhost:3000/` trên desktop hoặc `http://localhost:3000/mobile.html` trên điện thoại. Khi trình duyệt vẫn hiển thị bản cũ, hãy đóng toàn bộ tab app rồi mở lại một lần để service worker kích hoạt cache NAM46 mới.
