# Báo cáo kiểm tra và nâng cấp giao diện mobile — Đặng Năm Mystic

## Phát hiện

Phiên bản mobile trước đây là một SPA React riêng (`mobile.html`/`mobile-app.js`) được nạp qua redirect theo chiều rộng. Nó có các tab, provider và trạng thái chat khác desktop, nên giao diện/tính năng không nhất quán. CSS mobile cũng tích lũy nhiều bản ghi đè, trong đó có tệp bị nhiễu byte NUL. Ở Chat, route tự cuộn xuống làm app bar/tab khuất; bottom navigation bị áp phép dịch ngang của desktop; thanh chọn provider chiếm nhiều chiều cao và nút nổi giữa đáy che một phần ô nhập.

## Đã sửa

Thiết bị mobile và desktop giờ sử dụng cùng `index.html`, `app.js` và các route/provider chính. URL `mobile.html` cũ chuyển về ứng dụng chung, giữ query và hash. Dãy 12 tab desktop hiển thị dạng cuộn ngang ở Chat mobile, tab hiện hành tự căn vào vùng nhìn thấy, và route Chat đưa trang về đầu để giữ thanh app/tab. Tùy chọn chế độ/provider/model/độ chi tiết/Hội Đồng AI vẫn luôn mở như trước trên desktop; trên mobile chúng nằm trong popover có thể thu gọn để nhường chỗ cho hội thoại.

Bố cục Chat mobile được tối ưu cho tiêu đề/nút công cụ, log hội thoại, upload ảnh/file, ô soạn thảo một hàng và nav có nhãn. Nút nổi trung tâm được ẩn riêng khi đang Chat để không che vùng gõ; nó còn nguyên ở các trang khác. App không tự bật bàn phím khi vừa mở Chat; người dùng chạm để bắt đầu nhập. Stylesheet desktop nguyên gốc được bảo toàn byte-for-byte, chỉ bổ sung lớp responsive cuối. PWA mở `index.html`; service worker dùng cache version mới và ngừng dùng bundle mobile cũ. Không thay backend/API chat.

## Kiểm thử

Đã kiểm tra Chromium/Playwright tại 360×780, 390×844 và desktop 1280×900: đủ 12 tab, Chat mở đúng route, tab Chat tự hiển thị, provider có thể mở và chọn, điều hướng Tử Vi/Chat hoạt động, thanh đáy nằm trong viewport, không tràn ngang, không có lỗi JavaScript. Link `mobile.html?test=1#/chat` chuyển sang `index.html?test=1#/chat` và giữ query/hash. Đã rà soát ảnh chụp mobile/desktop; Chat composer không còn bị nút nổi che.

## Dữ liệu và triển khai

Bản bàn giao loại `.env`, `data/users.json`, `data/sessions.json` và ZIP lồng. Khi triển khai, hãy giữ nguyên các tệp `.env`/dữ liệu thật trên máy chủ và sao lưu trước khi thay tệp. Không đưa `.env` vào Git.
