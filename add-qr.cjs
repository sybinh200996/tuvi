const fs = require('fs');

// 1. UPDATE index.html
let html = fs.readFileSync('public/index.html', 'utf8');

// Add 'Tải App' button to topbar (desktop only, or global)
// Wait, topbar on desktop is what we are editing.
const btnStr = '<button class="icon-btn" onclick="routeTo(\'account\')">🌐</button>';
html = html.replace(btnStr, btnStr + '\n          <button class="icon-btn" onclick="openAppModal()" title="Tải App Mobile" style="width:auto; padding: 0 10px; font-weight:bold; font-size: 13px;">📱 Tải App</button>');

// Add the modal HTML before </body>
const modalHtml = `
  <!-- App Download Modal -->
  <div id="appDownloadModal" class="modal-overlay" onclick="if(event.target===this) closeAppModal()">
    <div class="modal-content glass-panel">
      <button class="close-modal" onclick="closeAppModal()">×</button>
      <h2 style="margin-top:0; color:#00f0ff;">📱 Tải Ứng Dụng Mobile</h2>
      <p style="opacity:0.8; font-size:14px;">Quét mã QR dưới đây bằng Camera điện thoại để truy cập và cài đặt ứng dụng Đặng Năm Mystic phiên bản chuẩn App.</p>
      
      <div style="text-align:center; margin: 20px 0;">
        <div style="background:white; padding:10px; display:inline-block; border-radius:12px;">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://dangnam.online" alt="QR Code" style="width:200px; height:200px; display:block;" />
        </div>
      </div>
      
      <div style="background:rgba(0,0,0,0.3); padding:15px; border-radius:12px; font-size:13px; line-height:1.5;">
        <b>💡 Hướng dẫn cài đặt:</b><br>
        1. Quét mã QR hoặc truy cập <b>dangnam.online</b> trên điện thoại.<br>
        2. Nếu dùng <b>iPhone (Safari)</b>: Chọn nút Chia sẻ (Share) ở cạnh dưới ➝ "Thêm vào MH chính" (Add to Home Screen).<br>
        3. Nếu dùng <b>Android (Chrome)</b>: Nhấn vào thông báo "Cài đặt ứng dụng" hoặc chọn Menu (3 chấm) ➝ "Thêm vào Màn hình chính".
      </div>
      
      <div style="text-align:center; margin-top: 15px;">
        <a href="https://www.pwabuilder.com/" target="_blank" style="color:#d800ff; text-decoration:underline; font-size: 12px;">Nhà phát triển: Đóng gói ra file APK qua PWABuilder</a>
      </div>
    </div>
  </div>
`;
html = html.replace('</body>', modalHtml + '\n</body>');
fs.writeFileSync('public/index.html', html);

// 2. UPDATE style.css
let css = fs.readFileSync('public/style.css', 'utf8');
css += `
/* Modal Styles for App Download */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000;
  opacity: 0; pointer-events: none;
  transition: all 0.3s ease;
}
.modal-overlay.show {
  opacity: 1; pointer-events: auto;
}
.modal-content {
  position: relative;
  width: 90%; max-width: 400px;
  padding: 25px;
  transform: translateY(20px);
  transition: transform 0.3s ease;
  background: linear-gradient(135deg, rgba(8,16,66,0.95), rgba(28,4,58,0.95));
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0, 240, 255, 0.2);
  border-radius: 20px;
}
.modal-overlay.show .modal-content {
  transform: translateY(0);
}
.close-modal {
  position: absolute; top: 15px; right: 15px;
  background: rgba(255,255,255,0.1); border: none; color: white;
  width: 30px; height: 30px; border-radius: 50%;
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
}
.close-modal:hover { background: rgba(255,0,0,0.5); }
`;
fs.writeFileSync('public/style.css', css);

// 3. UPDATE app.js
let js = fs.readFileSync('public/app.js', 'utf8');
js += `
// App Modal Handlers
function openAppModal() {
  document.getElementById('appDownloadModal').classList.add('show');
}
function closeAppModal() {
  document.getElementById('appDownloadModal').classList.remove('show');
}
`;
fs.writeFileSync('public/app.js', js);
console.log('Desktop UI updated with QR modal');
