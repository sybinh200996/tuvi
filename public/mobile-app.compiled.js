const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
function saveHistory(type, content) {
  try {
    const list = JSON.parse(localStorage.getItem('synam_history') || '[]');
    list.unshift({
      type,
      content,
      at: new Date().toLocaleString('vi-VN')
    });
    localStorage.setItem('synam_history', JSON.stringify(list.slice(0, 80)));
  } catch (e) {}
}
const TABS = [{
  id: 'home',
  icon: '✨',
  label: 'Trang chủ'
}, {
  id: 'horoscope',
  icon: '🔮',
  label: 'Tử vi'
}, {
  id: 'palm',
  icon: '✋',
  label: 'Chỉ tay'
}, {
  id: 'face',
  icon: '👁️',
  label: 'Xem tướng'
}, {
  id: 'astrology',
  icon: '🌌',
  label: 'Chiêm tinh'
}, {
  id: 'love',
  icon: '💖',
  label: 'Tình duyên'
}, {
  id: 'numerology',
  icon: '🔢',
  label: 'Thần số học'
}, {
  id: 'chat',
  icon: '⚡',
  label: 'AI Chat'
}, {
  id: 'multi',
  icon: '🌌',
  label: 'Multi AI'
}, {
  id: 'fengshui',
  icon: '☯️',
  label: 'Phong thủy'
}, {
  id: 'tarot',
  icon: '🃏',
  label: 'Xem bài Tarot'
}, {
  id: 'settings',
  icon: '⚙️',
  label: 'AI Keys'
}];
const LEGACY_WELCOME = 'Chào Đặng Năm. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const WELCOME_MESSAGE = 'Chào bạn. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const DEFAULT_MESSAGES = [{
  role: 'assistant',
  text: WELCOME_MESSAGE
}];
function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback;
  }
}
function authHeaders() {
  const token = localStorage.getItem('synam_token') || '';
  return token ? {
    Authorization: `Bearer ${token}`
  } : {};
}
async function apiJSON(url, payload, method = 'POST', signal) {
  const response = await fetch(url, {
    method,
    headers: {
      ...(method === 'GET' ? {} : {
        'Content-Type': 'application/json'
      }),
      ...authHeaders()
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload || {}),
    ...(signal ? {
      signal
    } : {})
  });
  const raw = await response.text();
  let data = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    data = {
      message: raw
    };
  }
  if (!response.ok) throw new Error(data.error || data.message || `HTTP ${response.status}`);
  return data;
}
function optimizeImage(file, maxEdge = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('Chưa chọn ảnh.'));
    if (!String(file.type || '').startsWith('image/')) return reject(new Error('File phải là ảnh.'));
    if (file.size > 15 * 1024 * 1024) return reject(new Error('Ảnh quá lớn. Hãy chọn ảnh dưới 15 MB.'));
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không đọc được ảnh.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('Ảnh không hợp lệ hoặc định dạng chưa được trình duyệt hỗ trợ.'));
      image.onload = () => {
        const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error(`Không đọc được file ${file.name || ''}.`));
    reader.readAsDataURL(file);
  });
}
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || '').slice(0, 12000));
    reader.onerror = () => reject(new Error(`Không đọc được nội dung ${file.name || ''}.`));
    reader.readAsText(file);
  });
}
async function prepareChatAttachment(file) {
  if (!file) throw new Error('File đính kèm không hợp lệ.');
  if (file.size > 12 * 1024 * 1024) throw new Error(`${file.name}: tối đa 12 MB mỗi file.`);
  const name = String(file.name || 'file');
  const originalType = String(file.type || 'application/octet-stream').toLowerCase();
  const isText = originalType.startsWith('text/') || /\.(txt|md|csv|json|xml|html|js|ts|py|log|css)$/i.test(name);
  if (isText) {
    return {
      name,
      type: originalType,
      size: file.size,
      textPreview: await readFileAsText(file)
    };
  }
  if (originalType.startsWith('image/')) {
    try {
      const dataUrl = await optimizeImage(file, 1600, 0.82);
      return {
        name,
        type: 'image/jpeg',
        size: file.size,
        dataUrl
      };
    } catch {
      return {
        name,
        type: originalType,
        size: file.size,
        dataUrl: await readFileAsDataUrl(file)
      };
    }
  }
  return {
    name,
    type: originalType,
    size: file.size,
    dataUrl: await readFileAsDataUrl(file)
  };
}
function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text)));
    }
  } catch (e) {}
  const safe = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\n/g, '<br/>');
}
const DESTINY_STORAGE_KEY = 'dangnam_destiny_profile';
function getDestinyProfile() {
  try {
    const raw = localStorage.getItem(DESTINY_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  const u = readJSON('synam_user', null);
  return u?.destinyProfile || null;
}
async function saveDestinyProfile(profile) {
  if (!profile) return;
  try {
    localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {}
  try {
    await fetch('/api/user/destiny-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders()
      },
      body: JSON.stringify({
        destinyProfile: profile
      })
    });
  } catch (e) {}
  try {
    if (typeof window !== 'undefined' && window.firebase && window.firebase.apps && window.firebase.apps.length) {
      const auth = window.firebase.auth();
      const currentUser = auth.currentUser;
      if (currentUser && window.firebase.firestore) {
        const db = window.firebase.firestore();
        await db.collection('destiny_profiles').doc(currentUser.uid).set({
          ...profile,
          email: currentUser.email || '',
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, {
          merge: true
        });
      }
    }
  } catch (e) {
    console.warn('Sync destiny profile to Firestore:', e);
  }
}
async function loadDestinyProfileFromCloud() {
  try {
    const res = await fetch('/api/user/destiny-profile', {
      headers: authHeaders()
    });
    const data = await res.json();
    if (data.ok && data.destinyProfile) {
      localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(data.destinyProfile));
      return data.destinyProfile;
    }
  } catch (e) {}
  return getDestinyProfile();
}
function exportResultToPrint(title, text) {
  if (!text) return alert('Chưa có nội dung để in hoặc xuất PDF.');
  const profile = getDestinyProfile();
  const cleanTitle = (title || 'BẢN LUẬN GIẢI MỆNH LÝ & VẬN TRÌNH').toUpperCase();
  const now = new Date().toLocaleString('vi-VN');
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return alert('Trình duyệt đã chặn cửa sổ in. Vui lòng cho phép popup để xuất bản luận giải.');
  }
  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>${cleanTitle} - Đặng Năm AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm; }
    body { font-family: 'Times New Roman', 'Segoe UI', serif; font-size: 14pt; line-height: 1.6; color: #111; margin: 0; padding: 20px; position: relative; background: #fff; }
    .print-watermark { position: fixed; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-30deg); font-size: 52pt; font-weight: 900; color: rgba(0, 0, 0, 0.05); pointer-events: none; z-index: 0; white-space: nowrap; font-family: sans-serif; }
    .header { text-align: center; border-bottom: 2px solid #8b0000; padding-bottom: 12px; margin-bottom: 18px; }
    .brand { font-size: 18pt; font-weight: bold; color: #8b0000; letter-spacing: 2px; }
    .subbrand { font-size: 11pt; color: #555; text-transform: uppercase; margin-top: 4px; }
    .doc-title { font-size: 15pt; font-weight: bold; margin-top: 14px; color: #222; }
    .meta-box { background: #fbf8f2; border: 1px solid #e2d7c5; border-radius: 6px; padding: 10px 14px; margin-bottom: 20px; font-size: 11pt; }
    .meta-row { display: flex; flex-wrap: wrap; gap: 16px; margin: 3px 0; }
    .content { font-size: 13pt; text-align: justify; z-index: 1; position: relative; }
    .content h1, .content h2, .content h3 { color: #8b0000; margin-top: 16px; margin-bottom: 8px; }
    .content p { margin: 8px 0; }
    .footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; font-size: 10pt; color: #666; display: flex; justify-content: space-between; flex-wrap: wrap; }
    .actions-bar { position: sticky; top: 0; background: #333; color: #fff; padding: 10px; text-align: center; margin: -20px -20px 20px -20px; z-index: 100; }
    .print-btn { background: #8b0000; color: #fff; border: none; padding: 8px 18px; border-radius: 4px; font-size: 14px; font-weight: bold; cursor: pointer; margin: 0 6px; }
    @media print {
      .actions-bar { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="actions-bar">
    <button class="print-btn" onclick="window.print()">🖨️ In ngay / Lưu PDF</button>
    <button class="print-btn" style="background:#555;" onclick="window.close()">Đóng</button>
  </div>
  <div class="print-watermark">dangnam.online</div>
  <div class="header">
    <div class="brand">✦ ĐẶNG NĂM AI ✦</div>
    <div class="subbrand">HỆ THỐNG TRÍ TUỆ NHÂN TẠO LUẬN GIẢI MỆNH LÝ & PHONG THỦY HỌC</div>
    <div class="doc-title">${cleanTitle}</div>
  </div>
  ${profile && (profile.fullName || profile.name) ? `
  <div class="meta-box">
    <div class="meta-row">
      <span><b>Đương số:</b> ${profile.fullName || profile.name}</span>
      <span><b>Giới tính:</b> ${profile.gender || 'Nam'}</span>
      <span><b>Ngày sinh:</b> ${profile.birthDate || 'Chưa rõ'} (${profile.calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'})</span>
      ${profile.birthTime ? `<span><b>Giờ sinh:</b> ${profile.birthTime}</span>` : ''}
    </div>
    ${profile.concern ? `<div class="meta-row"><span><b>Mối quan tâm:</b> ${profile.concern}</span></div>` : ''}
  </div>` : ''}
  <div class="content">
    ${typeof markdownLite === 'function' ? markdownLite(text) : text.replace(/\n/g, '<br>')}
  </div>
  <div class="footer">
    <span>Nguồn xuất bản: <b>dangnam.online</b> (Đặng Năm AI)</span>
    <span>Thời gian: ${now}</span>
    <span>Lưu ý: Luận giải mang tính tham khảo văn hóa & chiêm nghiệm</span>
  </div>
  <script>
    setTimeout(() => { window.print(); }, 400);
  </script>
</body>
</html>`;
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
async function streamChatResponse({
  url,
  payload,
  signal,
  onStart,
  onDelta,
  onDone,
  onError
}) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        ...authHeaders()
      },
      body: JSON.stringify(payload),
      ...(signal ? {
        signal
      } : {})
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.message || `HTTP ${res.status}`);
    }
    const reader = res.body?.getReader ? res.body.getReader() : null;
    if (!reader) {
      const data = await res.json();
      const txt = data.reply || data.text || '';
      if (typeof onDone === 'function') onDone(txt, data);
      return txt;
    }
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let currentEvent = 'message';
    let fullText = '';
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {
        stream: true
      });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          currentEvent = 'message';
          continue;
        }
        if (trimmed.startsWith('event: ')) {
          currentEvent = trimmed.slice(7).trim();
          continue;
        }
        if (trimmed.startsWith('data: ')) {
          const rawData = trimmed.slice(6);
          try {
            const data = JSON.parse(rawData);
            if (currentEvent === 'start') {
              if (typeof onStart === 'function') onStart(data);
            } else if (currentEvent === 'delta') {
              fullText += data.chunk || '';
              if (typeof onDelta === 'function') onDelta(data.chunk || '', fullText);
            } else if (currentEvent === 'done') {
              if (typeof onDone === 'function') onDone(data.fullText || fullText, data);
            } else if (currentEvent === 'error') {
              throw new Error(data.message || 'Lỗi streaming từ AI');
            }
          } catch (pe) {
            if (pe.message && !pe.message.includes('JSON')) throw pe;
          }
        }
      }
    }
    return fullText;
  } catch (err) {
    if (typeof onError === 'function') onError(err);
    throw err;
  }
}
function HistoryTool() {
  const [list, setList] = useState([]);
  useEffect(() => {
    try {
      setList(JSON.parse(localStorage.getItem('synam_history') || '[]'));
    } catch (e) {}
  }, []);
  function clearHist() {
    if (confirm('Xóa toàn bộ lịch sử?')) {
      localStorage.removeItem('synam_history');
      setList([]);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel",
    style: {
      padding: '15px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "⏳ Lịch sử"), list.length > 0 && /*#__PURE__*/React.createElement("button", {
    onClick: clearHist,
    className: "ghost",
    style: {
      padding: '6px 12px',
      fontSize: '12px'
    }
  }, "Xóa hết")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '15px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }
  }, list.length === 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--muted)'
    }
  }, "Chưa có lịch sử nào.") : list.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      background: 'rgba(255,255,255,0.08)',
      padding: '12px',
      borderRadius: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      fontSize: '12px',
      color: 'var(--brand)'
    }
  }, /*#__PURE__*/React.createElement("b", null, item.type), " ", /*#__PURE__*/React.createElement("span", null, item.at)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '14px',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap',
      maxHeight: '200px',
      overflowY: 'auto'
    }
  }, item.content))))));
}
function App() {
  const [tab, setTab] = useState('home');
  const [health, setHealth] = useState('Đang kiểm tra AI...');
  const [providers, setProviders] = useState([]);
  useEffect(() => {
    fetch('/api/health').then(r => r.json()).then(d => setHealth(d.ok ? 'Server online' : 'Server lỗi')).catch(() => setHealth('Server chưa kết nối'));
    loadProviders();
  }, []);
  async function loadProviders() {
    try {
      const data = await fetch('/api/ai/providers', {
        headers: authHeaders()
      }).then(r => r.json());
      setProviders(data.providers || []);
    } catch {
      setProviders([]);
    }
  }
  return /*#__PURE__*/React.createElement("main", {
    className: "app-shell"
  }, /*#__PURE__*/React.createElement(Hero, {
    tab: tab,
    setTab: setTab,
    health: health,
    providers: providers
  }), /*#__PURE__*/React.createElement(TabRail, {
    tab: tab,
    setTab: setTab
  }), /*#__PURE__*/React.createElement("section", {
    className: "workspace"
  }, tab === 'home' && /*#__PURE__*/React.createElement(Home, {
    setTab: setTab,
    providers: providers
  }), tab === 'chat' && /*#__PURE__*/React.createElement(Chat, {
    providers: providers
  }), tab === 'deep' && /*#__PURE__*/React.createElement(DeepTool, null), tab === 'palm' && /*#__PURE__*/React.createElement(VisionTool, {
    mode: "palm",
    title: "Xem chỉ tay AI",
    icon: "✋"
  }), tab === 'face' && /*#__PURE__*/React.createElement(VisionTool, {
    mode: "face",
    title: "Xem tướng AI",
    icon: "🙂"
  }), tab === 'love' && /*#__PURE__*/React.createElement(LoveTool, null), tab === 'horoscope' && /*#__PURE__*/React.createElement(TuviTool, null), tab === 'astrology' && /*#__PURE__*/React.createElement(AstrologyTool, null), tab === 'numerology' && /*#__PURE__*/React.createElement(NumerologyTool, null), tab === 'multi' && /*#__PURE__*/React.createElement(Chat, {
    providers: providers
  }), tab === 'fengshui' && /*#__PURE__*/React.createElement(FengShuiTool, null), tab === 'tarot' && /*#__PURE__*/React.createElement(TarotTool, null), tab === 'history' && /*#__PURE__*/React.createElement(HistoryTool, null), tab === 'settings' && /*#__PURE__*/React.createElement(Settings, {
    providers: providers,
    reload: loadProviders
  })), /*#__PURE__*/React.createElement("nav", {
    className: "bottom-nav"
  }, /*#__PURE__*/React.createElement("button", {
    "aria-label": "Trang chủ",
    onClick: () => setTab('home'),
    className: tab === 'home' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m3 10 9-7 9 7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.5 9v11h13V9M9.5 20v-6h5v6"
  })), /*#__PURE__*/React.createElement("span", null, "Trang chủ")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Lịch sử",
    onClick: () => setTab('history'),
    className: tab === 'history' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 8.5A8.5 8.5 0 1 1 4 17"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.5 3.5v5h5M12 7v5l3 2"
  })), /*#__PURE__*/React.createElement("span", null, "Lịch sử")), /*#__PURE__*/React.createElement("button", {
    className: "magic",
    "aria-label": "Mở AI Chat",
    title: "Mở AI Chat",
    onClick: () => setTab('chat')
  }, "✦"), /*#__PURE__*/React.createElement("button", {
    "aria-label": "AI Chat",
    onClick: () => setTab('chat'),
    className: tab === 'chat' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2 1.2-4.1A7.5 7.5 0 1 1 20 11.5Z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11.5h.01M12 11.5h.01M16 11.5h.01"
  })), /*#__PURE__*/React.createElement("span", null, "AI Chat")), /*#__PURE__*/React.createElement("button", {
    "aria-label": "Tài khoản",
    onClick: () => setTab('settings'),
    className: tab === 'settings' ? 'active' : ''
  }, /*#__PURE__*/React.createElement("svg", {
    className: "bottom-nav-icon",
    viewBox: "0 0 24 24",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "8",
    r: "3.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M4.5 21a7.5 7.5 0 0 1 15 0M5 21h14"
  })), /*#__PURE__*/React.createElement("span", null, "Tài khoản"))));
}
function Hero({
  setTab,
  health,
  providers
}) {
  const configured = providers.filter(p => p.configured).length;
  const [query, setQuery] = useState("");
  function handleSearch() {
    if (query.trim()) {
      localStorage.setItem("synam_quick_ask", query.trim());
    }
    setTab("chat");
  }
  return /*#__PURE__*/React.createElement("header", {
    className: "hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-img hero-left"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/hero-left.png",
    alt: "Minh họa Đặng Năm bên trái"
  })), /*#__PURE__*/React.createElement("div", {
    className: "hero-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "status-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), health, /*#__PURE__*/React.createElement("span", {
    className: "chip"
  }, configured || 0, " AI đang bật")), /*#__PURE__*/React.createElement("h1", null, "Đặng Năm ", /*#__PURE__*/React.createElement("b", null, "Mystic")), /*#__PURE__*/React.createElement("p", null, "AI • Tử vi • Chỉ tay • Xem tướng • Chiêm tinh"), /*#__PURE__*/React.createElement("div", {
    className: "hero-actions quick"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('horoscope')
  }, "🔮 Tử vi hôm nay"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('astrology')
  }, "🪐 Cung hoàng đạo"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('palm')
  }, "✋ Xem chỉ tay"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('face')
  }, "🙂 Xem tướng")), /*#__PURE__*/React.createElement("div", {
    className: "hero-search"
  }, /*#__PURE__*/React.createElement("input", {
    value: query,
    onChange: e => setQuery(e.target.value),
    onKeyDown: e => {
      if (e.key === "Enter") handleSearch();
    },
    placeholder: "Nhập câu hỏi tử vi..."
  }), /*#__PURE__*/React.createElement("button", {
    onClick: handleSearch
  }, "✦ AI phân tích"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-img hero-right"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/hero-right.jpg",
    alt: "Minh họa Đặng Năm bên phải"
  })));
}
function TabRail({
  tab,
  setTab
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tab-rail-wrap"
  }, /*#__PURE__*/React.createElement("nav", {
    className: "tab-rail"
  }, TABS.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    className: tab === t.id ? 'active' : '',
    onClick: () => setTab(t.id)
  }, /*#__PURE__*/React.createElement("span", null, t.icon), t.label))));
}
function Home({
  setTab,
  providers
}) {
  const cards = [['🧠', 'Phân Tích Chuyên Sâu PRO', 'AI tổng hợp đa lớp, luận giải chuyên sâu.', 'deep'], ['🔮', 'Tử vi', 'Luận giải hôm nay, công việc, tình cảm, tài chính.', 'horoscope'], ['✋', 'Xem chỉ tay', 'Upload ảnh bàn tay để AI phân tích rõ hơn.', 'palm'], ['🙂', 'Xem tướng', 'Upload ảnh khuôn mặt, nhận luận giải nhẹ nhàng.', 'face'], ['🪐', 'Chiêm tinh', 'Cung hoàng đạo, vận trình tháng, tình cảm.', 'astrology'], ['💞', 'Tình duyên', 'Tính tuổi, ngũ hành, thần số học bằng code trước khi AI luận.', 'love'], ['🔢', 'Thần số học', 'Tính số chủ đạo, linh hồn, biểu đạt và luận AI.', 'numerology'], ['💬', 'AI Chat Pro', 'Trả lời có nhớ ngữ cảnh, copy, đọc giọng nói.', 'chat'], ['🤖', 'Multi AI', 'Tự chọn Claude, Gemini, Groq, OpenRouter, ChatGPT, Grok.', 'multi'], ['☯️', 'Phong thủy', 'Màu hợp, hướng hợp, bố trí phòng/bàn làm việc.', 'fengshui'], ['🃏', 'Xem bài Tarot', 'Bốc bài tham khảo và đổi bài nhanh.', 'tarot'], ['⚙️', 'Cài đặt', 'Quản lý tài khoản và thiết lập AI.', 'settings']];
  return /*#__PURE__*/React.createElement("div", {
    className: "home-grid"
  }, cards.map(c => /*#__PURE__*/React.createElement("button", {
    key: c[3],
    className: "feature-card",
    onClick: () => setTab(c[3])
  }, /*#__PURE__*/React.createElement("b", null, c[0]), /*#__PURE__*/React.createElement("h3", null, c[1]), /*#__PURE__*/React.createElement("p", null, c[2]))));
}
function Chat({
  providers
}) {
  const [messages, setMessages] = useState(() => {
    const saved = readJSON('nam44_messages', DEFAULT_MESSAGES);
    return Array.isArray(saved) && saved.length ? saved.slice(-50).map(m => m?.role === 'assistant' && m.text === LEGACY_WELCOME ? {
      ...m,
      text: WELCOME_MESSAGE
    } : m) : DEFAULT_MESSAGES;
  });
  const [historyOpen, setHistoryOpen] = useState(false);
  const [showUploads, setShowUploads] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [text, setText] = useState('');
  const [modelChoice, setModelChoice] = useState('auto');
  const [answerStyle, setAnswerStyle] = useState('detailed');
  const [council, setCouncil] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [fileNotice, setFileNotice] = useState('');
  const [voiceStatus, setVoiceStatus] = useState('');
  const [listening, setListening] = useState(false);
  const [speakingId, setSpeakingId] = useState(null);
  const boxRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTranscriptRef = useRef('');
  const draftRef = useRef('');
  const sendRef = useRef(null);
  const requestAbortRef = useRef(null);
  useEffect(() => () => {
    try {
      recognitionRef.current?.abort();
    } catch {}
    requestAbortRef.current?.abort?.();
    try {
      speechSynthesis.cancel();
    } catch {}
  }, []);
  useEffect(() => {
    const quickAsk = localStorage.getItem('synam_quick_ask');
    if (quickAsk) {
      localStorage.removeItem('synam_quick_ask');
      setText(quickAsk);
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('nam44_messages', JSON.stringify(messages.slice(-50)));
    boxRef.current?.scrollTo({
      top: boxRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }, [messages]);
  function addFiles(fileList) {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    let totalBytes = attachments.reduce((sum, item) => sum + item.file.size, 0);
    const accepted = [];
    const notices = [];
    for (const file of picked) {
      if (attachments.length + accepted.length >= 6) {
        notices.push('Mỗi lượt tối đa 6 file.');
        break;
      }
      if (file.size > 12 * 1024 * 1024) {
        notices.push(`${file.name}: file vượt quá 12 MB.`);
        continue;
      }
      if (totalBytes + file.size > 14 * 1024 * 1024) {
        notices.push('Tổng dung lượng file tối đa 14 MB/lượt.');
        continue;
      }
      totalBytes += file.size;
      accepted.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file
      });
    }
    if (accepted.length) setAttachments(current => [...current, ...accepted]);
    setFileNotice(notices.join(' '));
  }
  function removeFile(id) {
    setAttachments(current => current.filter(item => item.id !== id));
    setFileNotice('');
  }
  function startDictation() {
    setVoiceStatus('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Trình duyệt chưa hỗ trợ micro trong trang. Bạn có thể bấm biểu tượng micro trên bàn phím điện thoại.');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;
      voiceTranscriptRef.current = '';
      recognition.onstart = () => {
        setListening(true);
        setVoiceStatus('Đang lắng nghe tiếng Việt…');
      };
      recognition.onresult = event => {
        const finalText = Array.from(event.results || []).slice(event.resultIndex || 0).filter(result => result.isFinal).map(result => result[0]?.transcript || '').join(' ').trim();
        if (!finalText) return;
        voiceTranscriptRef.current = [voiceTranscriptRef.current, finalText].filter(Boolean).join(' ').trim();
        const nextDraft = [draftRef.current, finalText].filter(Boolean).join(' ').trim();
        draftRef.current = nextDraft;
        setText(nextDraft);
      };
      recognition.onerror = event => {
        setListening(false);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setVoiceStatus('Chưa có quyền dùng micro. Hãy bật quyền micro cho trang web.');
        } else if (!voiceTranscriptRef.current) {
          setVoiceStatus('Chưa nhận được giọng nói. Hãy thử lại.');
        }
      };
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        if (!voiceTranscriptRef.current.trim()) {
          setVoiceStatus(current => current === 'Đang lắng nghe tiếng Việt…' ? 'Chưa nhận được giọng nói. Hãy thử lại.' : current);
          return;
        }
        setVoiceStatus('Đã nhận diện giọng nói. Bạn có thể bấm ➤ để gửi.');
        setTimeout(() => setVoiceStatus(''), 4500);
      };
      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      setListening(false);
      setVoiceStatus(`Không mở được micro: ${error.message || 'hãy thử lại.'}`);
    }
  }
  function stopDictation() {
    setVoiceStatus('Đã dừng micro.');
    try {
      recognitionRef.current?.stop();
    } catch {}
  }
  function stopResponse() {
    try {
      requestAbortRef.current?.abort?.();
    } catch {}
  }
  sendRef.current = send;
  async function send(customText) {
    const content = (customText ?? text).trim();
    if (!content && !attachments.length || busy) return;
    setVoiceStatus('');
    setText('');
    draftRef.current = '';
    const requestText = content || 'Hãy phân tích nội dung các tệp đính kèm và trả lời bằng tiếng Việt.';
    setLastPrompt(content || 'Hãy phân tích lại các tệp đính kèm đã gửi.');
    setBusy(true);
    const fileMeta = attachments.map(item => ({
      name: item.file.name,
      type: item.file.type || 'file',
      size: item.file.size
    }));
    const userText = content || 'Đã gửi tệp đính kèm.';
    const next = [...messages, {
      role: 'user',
      text: userText,
      attachments: fileMeta
    }];
    setMessages([...next, {
      role: 'assistant',
      text: '',
      streaming: true,
      loading: false
    }]);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    requestAbortRef.current = controller;
    const destinyProfile = getDestinyProfile();
    let accumulatedText = '';
    try {
      const [selectedProvider, selectedModel] = modelChoice === 'auto' ? ['auto', ''] : modelChoice.split('::');
      if (attachments.length) {
        const files = await Promise.all(attachments.map(item => prepareChatAttachment(item.file)));
        setAttachments([]);
        setFileNotice('');
        await streamChatResponse({
          url: '/api/chat-ai/stream',
          payload: {
            message: content,
            attachments: files,
            history: next.slice(-20),
            answerStyle,
            geminiModel: selectedProvider === 'gemini' ? selectedModel || 'gemini-3.5-flash-lite' : 'gemini-3.5-flash-lite',
            destinyProfile
          },
          signal: controller?.signal,
          onStart: () => {},
          onDelta: (chunk, fullText) => {
            accumulatedText = fullText;
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: true,
              loading: false
            } : m));
          },
          onDone: (fullText, meta) => {
            accumulatedText = fullText;
            const finalMeta = meta?.label || meta?.model || 'Đặng Năm AI';
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: false,
              loading: false,
              meta: finalMeta
            } : m));
            saveHistory('AI Chat', `${userText}: ${fullText.slice(0, 140)}...`);
          }
        });
      } else {
        await streamChatResponse({
          url: '/api/multi-ai/stream',
          payload: {
            message: requestText,
            history: next.slice(-20),
            provider: selectedProvider,
            model: selectedModel,
            council,
            answerStyle,
            destinyProfile
          },
          signal: controller?.signal,
          onStart: () => {},
          onDelta: (chunk, fullText) => {
            accumulatedText = fullText;
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: true,
              loading: false
            } : m));
          },
          onDone: (fullText, meta) => {
            accumulatedText = fullText;
            const finalMeta = meta?.label || meta?.model || 'Đặng Năm AI';
            setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
              ...m,
              text: fullText,
              streaming: false,
              loading: false,
              meta: finalMeta
            } : m));
            saveHistory('AI Chat', `${userText}: ${fullText.slice(0, 140)}...`);
          }
        });
      }
    } catch (e) {
      if (e.name === 'AbortError') {
        setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
          ...m,
          text: accumulatedText || 'Đã dừng phản hồi.',
          streaming: false,
          loading: false
        } : m));
      } else {
        if (content) {
          draftRef.current = content;
          setText(current => current || content);
        }
        const freeModeError = /chế độ chỉ dùng model API miễn phí|tránh phát sinh phí/i.test(e.message || '');
        const extra = freeModeError ? '' : '\n\nNếu gửi ảnh/file, server cần có Gemini API key; bạn cũng có thể kiểm tra cấu hình ở AI Keys.';
        const errText = accumulatedText ? `${accumulatedText}\n\n⚠️ ${e.message}${extra}` : `⚠️ ${e.message}${extra}`;
        setMessages(prev => prev.map((m, idx) => idx === prev.length - 1 ? {
          ...m,
          text: errText,
          streaming: false,
          loading: false
        } : m));
      }
    } finally {
      if (requestAbortRef.current === controller) requestAbortRef.current = null;
      setBusy(false);
    }
  }
  function copy(t) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(t);
      alert('Đã sao chép nội dung vào khay nhớ tạm!');
    }
  }
  function cleanMarkdownForSpeech(raw = '') {
    return String(raw || '').replace(/```[\s\S]*?```/g, ' đoạn mã ').replace(/`([^`]+)`/g, '$1').replace(/#{1,6}\s+/g, '').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/__([^_]+)__/g, '$1').replace(/_([^_]+)_/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/!\[([^\]]*)\]\([^)]+\)/g, '').replace(/^>\s+/gm, '').replace(/^[-*+]\s+/gm, '').replace(/\n+/g, ' ').trim();
  }
  function toggleSpeak(textToSpeak, id = 'header') {
    if (speakingId === id) {
      try {
        speechSynthesis.cancel();
      } catch {}
      setSpeakingId(null);
      return;
    }
    const cleanText = cleanMarkdownForSpeech(textToSpeak);
    if (!cleanText) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(cleanText);
      u.lang = 'vi-VN';
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      speechSynthesis.speak(u);
    } catch {
      setSpeakingId(null);
    }
  }
  function handleNewChat() {
    if (messages.length > 1) {
      const firstUser = messages.find(m => m.role === 'user');
      const firstBot = messages.find(m => m.role === 'assistant' && !m.loading);
      const summary = firstUser ? `${firstUser.text.slice(0, 50)}: ${firstBot?.text?.slice(0, 100) || 'Đoạn chat'}` : 'Cuộc trò chuyện';
      saveHistory('AI Chat', summary);
    }
    if (confirm("Tạo đoạn chat mới?")) {
      setMessages(DEFAULT_MESSAGES);
      setAttachments([]);
      setText('');
      setFileNotice('');
      try {
        speechSynthesis.cancel();
      } catch {}
      setSpeakingId(null);
    }
  }
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  const providerGroupLabel = p => `${p.label}${p.freeOnlyBlocked ? ' · tắt để tránh phí' : p.configured ? '' : ' · chưa cấu hình'}`;
  const providerModelOptions = providers.map(p => ({
    ...p,
    modelOptions: Array.from(new Set([...(p.models || []), p.model].filter(Boolean)))
  }));
  const chatHistoryList = readJSON('synam_history', []).filter(h => h.type === 'AI Chat');
  return /*#__PURE__*/React.createElement("section", {
    className: "chat-layout"
  }, historyOpen && /*#__PURE__*/React.createElement("div", {
    className: "history-drawer-overlay",
    onClick: () => setHistoryOpen(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "history-drawer",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "drawer-head"
  }, /*#__PURE__*/React.createElement("h3", null, "🕒 Lịch sử Chat AI"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setHistoryOpen(false)
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "drawer-body"
  }, chatHistoryList.map((h, i) => {
    const previewTitle = h.content.split(':')[0] || h.content;
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      className: "drawer-item",
      onClick: () => {
        setText(previewTitle.trim());
        setHistoryOpen(false);
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: '700',
        color: '#ffe27a',
        marginBottom: '4px'
      }
    }, "💬 ", previewTitle.slice(0, 70)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: '12px',
        opacity: 0.82,
        lineHeight: '1.35'
      }
    }, h.content.slice(0, 140)), /*#__PURE__*/React.createElement("small", {
      style: {
        opacity: 0.55,
        marginTop: '4px',
        display: 'block'
      }
    }, h.at));
  }), chatHistoryList.length === 0 && /*#__PURE__*/React.createElement("p", {
    style: {
      opacity: 0.5,
      textAlign: 'center',
      padding: '24px 0'
    }
  }, "Chưa có lịch sử chat.")))), /*#__PURE__*/React.createElement("aside", {
    className: "chat-side premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🧠 AI Router"), /*#__PURE__*/React.createElement("p", null, "Auto chọn provider có key. Ưu tiên nhanh, chính xác, không lộ model."), /*#__PURE__*/React.createElement("select", {
    value: modelChoice,
    onChange: e => setModelChoice(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto Router"), providerModelOptions.map(p => /*#__PURE__*/React.createElement("optgroup", {
    key: p.id,
    label: providerGroupLabel(p),
    disabled: !p.configured
  }, p.modelOptions.map(model => /*#__PURE__*/React.createElement("option", {
    key: `${p.id}:${model}`,
    value: `${p.id}::${model}`
  }, model))))), /*#__PURE__*/React.createElement("select", {
    value: answerStyle,
    onChange: e => setAnswerStyle(e.target.value),
    "aria-label": "Độ chi tiết câu trả lời"
  }, /*#__PURE__*/React.createElement("option", {
    value: "detailed"
  }, "Chi tiết chuyên nghiệp"), /*#__PURE__*/React.createElement("option", {
    value: "expert"
  }, "Chuyên gia sâu"), /*#__PURE__*/React.createElement("option", {
    value: "concise"
  }, "Ngắn gọn")), /*#__PURE__*/React.createElement("label", {
    className: "switch"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: council,
    onChange: e => setCouncil(e.target.checked)
  }), " Hội Đồng AI"), /*#__PURE__*/React.createElement("button", {
    onClick: handleNewChat
  }, "＋ Chat mới"), /*#__PURE__*/React.createElement("div", {
    className: "mini-list"
  }, providers.map(p => /*#__PURE__*/React.createElement("span", {
    className: p.configured ? 'ok' : '',
    key: p.id
  }, p.configured ? '●' : '○', " ", p.label, p.freeOnlyBlocked ? ' (tắt để tránh phí)' : '')))), /*#__PURE__*/React.createElement("div", {
    className: "chat-main premium-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-head"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: () => setHistoryOpen(true)
  }, "🕒 Lịch sử"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: handleNewChat
  }, "➕ Mới"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-icon-btn",
    onClick: () => toggleSpeak(messages.filter(m => m.role === 'assistant').at(-1)?.text || '', 'header')
  }, speakingId === 'header' ? '⏹️ Dừng' : '🔊 Đọc'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `chat-icon-btn ${optionsOpen ? 'active' : ''}`,
    onClick: () => setOptionsOpen(!optionsOpen)
  }, "⚙️ Tùy chọn ", optionsOpen ? '▲' : '▼')), optionsOpen && /*#__PURE__*/React.createElement("div", {
    className: "chat-mobile-options-tray"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "chat-mobile-model"
  }, "🤖 Model AI"), /*#__PURE__*/React.createElement("select", {
    id: "chat-mobile-model",
    value: modelChoice,
    onChange: e => setModelChoice(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto Router (Tối ưu)"), providerModelOptions.map(p => /*#__PURE__*/React.createElement("optgroup", {
    key: p.id,
    label: providerGroupLabel(p),
    disabled: !p.configured
  }, p.modelOptions.map(model => /*#__PURE__*/React.createElement("option", {
    key: `${p.id}:${model}`,
    value: `${p.id}::${model}`
  }, model)))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "chat-mobile-style"
  }, "📝 Độ dài"), /*#__PURE__*/React.createElement("select", {
    id: "chat-mobile-style",
    value: answerStyle,
    onChange: e => setAnswerStyle(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "detailed"
  }, "Chi tiết chuyên nghiệp"), /*#__PURE__*/React.createElement("option", {
    value: "expert"
  }, "Chuyên gia sâu"), /*#__PURE__*/React.createElement("option", {
    value: "concise"
  }, "Ngắn gọn"))), /*#__PURE__*/React.createElement("div", {
    className: "chat-opt-group",
    style: {
      alignSelf: 'center'
    }
  }, /*#__PURE__*/React.createElement("label", {
    className: "chat-council-toggle",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      color: '#ffe27a'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: council,
    onChange: e => setCouncil(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "🏛️ Hội Đồng AI")))), /*#__PURE__*/React.createElement("div", {
    className: "chat-box",
    ref: boxRef
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `bubble ${m.role} ${m.loading ? 'loading' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, m.role === 'user' ? '👤' : '✦'), /*#__PURE__*/React.createElement("div", {
    className: "bubble-body"
  }, m.attachments?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-message-files"
  }, m.attachments.map((file, index) => /*#__PURE__*/React.createElement("span", {
    key: `${file.name}-${index}`
  }, "📎 ", file.name))), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: markdownLite(m.text)
    }
  }), m.streaming && /*#__PURE__*/React.createElement("span", {
    className: "streaming-cursor"
  }), m.meta && !m.streaming && /*#__PURE__*/React.createElement("div", {
    className: "msg-meta-tag",
    style: {
      fontSize: '10px',
      opacity: 0.65,
      marginTop: '4px'
    }
  }, "✦ ", m.meta), m.role === 'assistant' && !m.loading && !m.streaming && /*#__PURE__*/React.createElement("div", {
    className: "msg-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => copy(m.text)
  }, "📋 Sao chép"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => exportResultToPrint('Luận giải Đặng Năm AI', m.text)
  }, "🖨️ In / PDF"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => toggleSpeak(m.text, `msg-${i}`)
  }, speakingId === `msg-${i}` ? '⏹️ Dừng đọc' : '🔊 Đọc'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => send(lastPrompt)
  }, "🔄 Thử lại")))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-composer-panel"
  }, /*#__PURE__*/React.createElement("input", {
    ref: imageInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*",
    multiple: true,
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: cameraInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*",
    capture: "environment",
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*,.pdf,.txt,.md,.csv,.json,.xml,.html,.js,.ts,.py,.log,.css,.doc,.docx,.xls,.xlsx",
    multiple: true,
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
      setShowUploads(false);
    }
  }), attachments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-list"
  }, attachments.map(item => /*#__PURE__*/React.createElement("span", {
    className: "chat-file-chip",
    key: item.id
  }, item.file.type.startsWith('image/') ? '🖼️' : '📄', " ", item.file.name, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Xóa ${item.file.name}`,
    title: `Xóa ${item.file.name}`,
    onClick: () => removeFile(item.id)
  }, "✕")))), fileNotice && /*#__PURE__*/React.createElement("div", {
    className: "chat-file-notice",
    role: "status"
  }, fileNotice), attachments.length > 0 && modelChoice !== 'auto' && !modelChoice.startsWith('gemini::') && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-note"
  }, "Ảnh/file được xử lý tối ưu qua Gemini đa phương thức."), voiceStatus && /*#__PURE__*/React.createElement("div", {
    className: "chat-voice-status",
    role: "status"
  }, voiceStatus), /*#__PURE__*/React.createElement("div", {
    className: "chat-quick-chips"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Luận giải tổng quan vận hạn năm 2026 cho bản mệnh')
  }, "🔮 Vận hạn 2026"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Phân tích cung Tài Bạch & Quan Lộc chi tiết')
  }, "💰 Tài Lộc & Sự Nghiệp"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Xem ngày giờ tốt và việc nên làm trong tuần này')
  }, "📅 Ngày tốt tuần này"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Luận giải tình duyên, gia đạo và các mối quan hệ')
  }, "💞 Tình duyên gia đạo"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => send('Gợi ý màu sắc, vật phẩm phong thủy kích tài lộc')
  }, "☯️ Phong thủy bản mệnh")), /*#__PURE__*/React.createElement("div", {
    className: "composer chat-pill-composer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-menu-container"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `chat-plus-btn ${showUploads ? 'active' : ''}`,
    onClick: () => setShowUploads(!showUploads),
    title: "Đính kèm",
    "aria-label": "Đính kèm tệp hoặc chụp ảnh",
    "aria-expanded": showUploads
  }, "+"), showUploads && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-backdrop",
    onClick: () => setShowUploads(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "chat-plus-popover",
    role: "menu"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      imageInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "🖼️"), /*#__PURE__*/React.createElement("span", null, "Tải ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      cameraInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "📷"), /*#__PURE__*/React.createElement("span", null, "Chụp ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item",
    onClick: () => {
      fileInputRef.current?.click();
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "📎"), /*#__PURE__*/React.createElement("span", null, "Tải file")), attachments.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-popover-item is-clear",
    onClick: () => {
      setAttachments([]);
      setFileNotice('');
      setShowUploads(false);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "popover-icon"
  }, "🗑️"), /*#__PURE__*/React.createElement("span", null, "Xóa hết file"))))), /*#__PURE__*/React.createElement("div", {
    className: "chat-input-wrapper"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => {
      draftRef.current = e.target.value;
      setText(e.target.value);
    },
    onKeyDown: e => {
      if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Hỏi AI...",
    "aria-label": "Tin nhắn gửi AI",
    rows: "1"
  })), /*#__PURE__*/React.createElement("div", {
    className: "chat-actions-wrapper"
  }, listening ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn is-listening",
    "aria-label": "Dừng ghi âm",
    title: "Dừng ghi âm",
    onClick: stopDictation
  }, "🛑") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn",
    "aria-label": "Nhập bằng giọng nói",
    title: "Nhập bằng giọng nói",
    disabled: busy,
    onClick: startDictation
  }, "🎤"), text.trim() || attachments.length > 0 || busy ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `pill-send-btn ${busy ? 'is-stop' : ''}`,
    "aria-label": busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    title: busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    onClick: busy ? stopResponse : () => send()
  }, busy ? '🛑' : '➤') : null)))));
}
let cachedMobileFirebaseConfig = null;
async function fetchMobileFirebaseConfig() {
  if (cachedMobileFirebaseConfig) return cachedMobileFirebaseConfig;
  try {
    const res = await fetch('/api/auth/firebase-config');
    const data = await res.json();
    if (data.ok && data.enabled && data.config) {
      cachedMobileFirebaseConfig = data.config;
      return cachedMobileFirebaseConfig;
    }
  } catch (e) {
    console.warn('Fetch Mobile Firebase config error:', e);
  }
  return null;
}
async function getMobileFirebase() {
  if (typeof window === 'undefined' || !window.firebase) {
    throw new Error('Firebase SDK chưa được tải trên trình duyệt.');
  }
  if (!window.firebase.apps || !window.firebase.apps.length) {
    const cfg = await fetchMobileFirebaseConfig();
    if (!cfg || !cfg.apiKey) {
      throw new Error('Chưa cấu hình Firebase trên máy chủ.');
    }
    window.firebase.initializeApp(cfg);
  }
  return window.firebase;
}
function Settings({
  providers,
  reload
}) {
  const [keys, setKeys] = useState({});
  const [user, setUser] = useState(() => readJSON('synam_user', null));
  const [account, setAccount] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  const [socialLoading, setSocialLoading] = useState(false);
  async function handleSocialLogin(provider) {
    if (socialLoading) return;
    setSocialLoading(true);
    try {
      const fb = await getMobileFirebase();
      const auth = fb.auth();
      auth.useDeviceLanguage();
      const authProvider = provider === 'facebook' ? new fb.auth.FacebookAuthProvider() : new fb.auth.GoogleAuthProvider();
      if (provider === 'google') {
        authProvider.addScope('email');
        authProvider.addScope('profile');
      }
      const result = await auth.signInWithPopup(authProvider);
      const fbUser = result.user;
      const idToken = await fbUser.getIdToken();
      const payload = {
        provider,
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName || (provider === 'google' ? 'Google User' : 'Facebook User'),
        avatar: fbUser.photoURL || '',
        idToken: idToken
      };
      const data = await apiJSON('/api/auth/social', payload);
      localStorage.setItem('synam_user', JSON.stringify(data.user));
      localStorage.setItem('synam_token', data.token || '');
      setUser(data.user);
      setAccount({
        name: '',
        email: '',
        password: ''
      });
      alert(`Đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} thành công! Chào mừng ${data.user.name || data.user.email}`);
      await reload();
    } catch (e) {
      if (e.code === 'auth/popup-closed-by-user') {
        setSocialLoading(false);
        return;
      }
      if (e.code === 'auth/unauthorized-domain') {
        alert('Tên miền ' + window.location.hostname + ' chưa được cấp quyền trong Firebase Console. Vui lòng vào Firebase Console -> Authentication -> Settings -> Authorized domains -> Thêm "' + window.location.hostname + '" vào danh sách để hoàn tất.');
        setSocialLoading(false);
        return;
      }
      alert('Lỗi đăng nhập: ' + (e.message || e));
    } finally {
      setSocialLoading(false);
    }
  }
  async function submitAccount(action) {
    try {
      const data = await apiJSON(`/api/auth/${action}`, account);
      localStorage.setItem('synam_user', JSON.stringify(data.user));
      localStorage.setItem('synam_token', data.token || '');
      setUser(data.user);
      setAccount({
        name: data.user.name || '',
        email: data.user.email || '',
        password: ''
      });
      alert(action === 'register' ? 'Đăng ký thành công.' : 'Đăng nhập thành công.');
      await reload();
    } catch (e) {
      alert(e.message);
    }
  }
  async function logout() {
    try {
      await apiJSON('/api/auth/logout', {});
    } catch {}
    localStorage.removeItem('synam_user');
    localStorage.removeItem('synam_token');
    setUser(null);
    setAccount({
      name: '',
      email: '',
      password: ''
    });
    await reload();
  }
  async function save() {
    try {
      await apiJSON('/api/ai/user-keys', {
        keys
      });
      await reload();
      alert('Đã lưu AI keys.');
    } catch (e) {
      alert(e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "premium-panel settings"
  }, /*#__PURE__*/React.createElement("h2", null, "👤 Quản lý Tài khoản & AI Keys"), /*#__PURE__*/React.createElement("div", {
    className: "account-card",
    style: {
      marginBottom: '20px'
    }
  }, user ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '14px',
      padding: '12px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '16px',
      border: '1px solid rgba(255,255,255,0.12)'
    }
  }, user.avatar ? /*#__PURE__*/React.createElement("img", {
    src: user.avatar,
    alt: "Avatar",
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: '2px solid #ffd700',
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }
  }, "👤"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 'bold',
      fontSize: '15px',
      color: '#ffe6ad'
    }
  }, user.name || 'Người dùng'), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      opacity: 0.8,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, user.email), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '11px',
      color: '#4ade80',
      marginTop: '2px'
    }
  }, "Gói: ", user.plan || 'Free', " · ", (user.providers || []).map(p => p === 'google' ? 'Google' : p === 'facebook' ? 'Facebook' : p).join(', ') || 'Email')), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: logout,
    style: {
      padding: '6px 12px',
      fontSize: '12px',
      background: 'rgba(239,68,68,0.2)',
      border: '1px solid rgba(239,68,68,0.5)',
      color: '#ff8888',
      borderRadius: '10px'
    }
  }, "Đăng xuất")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: socialLoading,
    onClick: () => handleSocialLogin('google'),
    style: {
      background: 'linear-gradient(135deg,rgba(255,74,74,.92),rgba(255,180,42,.78))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      opacity: socialLoading ? 0.6 : 1
    }
  }, "🔴 ", socialLoading ? 'Đang mở...' : 'Google'), /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: socialLoading,
    onClick: () => handleSocialLogin('facebook'),
    style: {
      background: 'linear-gradient(135deg,rgba(24,119,242,.92),rgba(68,72,255,.82))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
      opacity: socialLoading ? 0.6 : 1
    }
  }, "🔵 ", socialLoading ? 'Đang mở...' : 'Facebook')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      margin: '14px 0',
      fontSize: '11px',
      textTransform: 'uppercase',
      opacity: 0.6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)'
    }
  }), /*#__PURE__*/React.createElement("span", null, "hoặc dùng email"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: '1px',
      background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)'
    }
  })), /*#__PURE__*/React.createElement("input", {
    value: account.name,
    onChange: e => setAccount(a => ({
      ...a,
      name: e.target.value
    })),
    placeholder: "Tên hiển thị (để đăng ký)"
  }), /*#__PURE__*/React.createElement("input", {
    value: account.email,
    onChange: e => setAccount(a => ({
      ...a,
      email: e.target.value
    })),
    type: "email",
    placeholder: "Email"
  }), /*#__PURE__*/React.createElement("input", {
    value: account.password,
    onChange: e => setAccount(a => ({
      ...a,
      password: e.target.value
    })),
    type: "password",
    placeholder: "Mật khẩu từ 6 ký tự"
  }), /*#__PURE__*/React.createElement("div", {
    className: "account-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "primary",
    type: "button",
    onClick: () => submitAccount('register')
  }, "Đăng ký"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => submitAccount('login')
  }, "Đăng nhập")))), /*#__PURE__*/React.createElement("h2", null, "⚙️ Multi-AI API Keys"), /*#__PURE__*/React.createElement("p", null, "Nhập key cá nhân hoặc dùng key mặc định từ server."), /*#__PURE__*/React.createElement("div", {
    className: "key-grid"
  }, providers.map(p => /*#__PURE__*/React.createElement("label", {
    key: p.id
  }, /*#__PURE__*/React.createElement("span", null, p.label, " ", p.configured ? '✅' : '○'), /*#__PURE__*/React.createElement("input", {
    type: "password",
    placeholder: p.maskedKey || p.keyEnv || 'API key',
    onChange: e => setKeys(k => ({
      ...k,
      [p.id]: e.target.value
    }))
  }), /*#__PURE__*/React.createElement("small", null, p.model)))), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: save
  }, "💾 Lưu keys"));
}
function VisionTool({
  mode,
  title,
  icon
}) {
  const isFace = mode === 'face';
  const defaultHint = isFace ? '* Mẹo: Chụp chính diện khuôn mặt, rõ 5 ngũ quan (trán, mắt, mũi, miệng, cằm), đủ sáng, không đeo kính râm và không che trán để xem tướng chuẩn xác nhất.' : '* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.';
  const [result, setResult] = useState('Vui lòng chụp ảnh hoặc tải ảnh lên để AI xem trực tiếp.');
  const [previewUrl, setPreviewUrl] = useState('');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [note, setNote] = useState('');
  const [focusPart, setFocusPart] = useState(isFace ? 'Tổng quan ngũ quan & thần thái' : 'Tổng quan đường tay');
  const [isLiveCamera, setIsLiveCamera] = useState(false);
  const [cameraFacing, setCameraFacing] = useState(isFace ? 'user' : 'environment');
  const [autoAnalyze, setAutoAnalyze] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);
  const nativeCameraInputRef = useRef(null);
  const stopStream = () => {
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => track.stop());
      } catch (e) {}
      streamRef.current = null;
    }
  };
  useEffect(() => {
    return () => stopStream();
  }, []);
  async function startCamera(facing = cameraFacing) {
    stopStream();
    setCameraError('');
    setIsLiveCamera(true);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Trình duyệt chưa hỗ trợ Live Camera trực tiếp. Bạn vui lòng bấm nút "📷 Chụp bằng máy" nhé.');
      }
      const constraints = {
        video: {
          facingMode: {
            ideal: facing
          },
          width: {
            ideal: 1280
          },
          height: {
            ideal: 720
          }
        },
        audio: false
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Live camera error:', err);
      setCameraError(err.message || 'Không thể mở Camera. Hãy bấm nút "📷 Chụp bằng máy" hoặc cho phép quyền truy cập Camera.');
    }
  }
  function switchCamera() {
    const nextFacing = cameraFacing === 'user' ? 'environment' : 'user';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  }
  function closeCamera() {
    stopStream();
    setIsLiveCamera(false);
    setCameraError('');
  }
  function snapPhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (cameraFacing === 'user') {
      ctx.translate(w, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
    closeCamera();
    setImageDataUrl(dataUrl);
    setPreviewUrl(dataUrl);
    if (autoAnalyze) {
      runAnalysis(dataUrl);
    } else {
      setResult('Đã chụp ảnh xong. Bấm nút "Xem tướng trực tiếp ngay" để nhận kết quả phân tích.');
    }
  }
  async function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    try {
      setLoading(true);
      setResult('Đang tối ưu hóa ảnh...');
      const optimized = await optimizeImage(selectedFile, 1600, 0.85);
      setImageDataUrl(optimized);
      setPreviewUrl(optimized);
      if (autoAnalyze) {
        runAnalysis(optimized);
      } else {
        setResult('Ảnh đã sẵn sàng. Bấm nút "Xem tướng trực tiếp ngay" để AI phân tích.');
      }
    } catch (err) {
      setResult('⚠️ ' + (err.message || 'Lỗi khi tải ảnh.'));
    } finally {
      setLoading(false);
    }
  }
  function handleNativeCamera(e) {
    handleFileChange(e);
  }
  async function runAnalysis(explicitImage = '') {
    const targetImage = explicitImage || imageDataUrl;
    if (!targetImage && !note.trim()) {
      return setResult('Bạn cần chụp ảnh hoặc tải ảnh lên trước nhé.');
    }
    setLoading(true);
    setResult(isFace ? '🔍 AI đang quét nhận diện ngũ quan, thần thái và đối chiếu nhân tướng...' : '🔍 AI đang quét phân tích đường chỉ tay...');
    try {
      const payload = isFace ? {
        mode: 'face',
        image: targetImage,
        faceImage: targetImage,
        facePart: focusPart,
        faceNote: note,
        geminiModel: 'gemini-3.5-flash-lite',
        clientTime: new Date().toLocaleString('vi-VN')
      } : {
        mode: 'palm',
        image: targetImage,
        palmImage: targetImage,
        palmLine: focusPart,
        palmNote: note,
        geminiModel: 'gemini-3.5-flash-lite',
        clientTime: new Date().toLocaleString('vi-VN')
      };
      const d = await apiJSON('/api/vision-ai', payload);
      const text = d.text || d.reply || 'Không có kết quả trả về từ AI.';
      setResult(text);
      saveHistory(title, text);
    } catch (e) {
      console.error('Vision analysis error:', e);
      const fb = window.MysticEngine ? mode === 'palm' ? window.MysticEngine.Palmistry.analyze(note, '') : window.MysticEngine.Face.analyze(note, '') : mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt';
      const fallbackMsg = fb + '\n\n*(Lưu ý: Đang hiển thị kết quả phân tích offline do máy chủ: ' + (e.message || 'Mất kết nối') + ')*';
      setResult(fallbackMsg);
      saveHistory(title + ' local', fallbackMsg);
    } finally {
      setLoading(false);
    }
  }
  const faceOptions = ['Tổng quan ngũ quan & thần thái', 'Trán (Cung Quan Lộc, tiền vận & trí tuệ)', 'Mắt (Thần khí, tâm tư & năng lượng)', 'Mũi (Cung Tài Bạch, tài vận & ý chí)', 'Miệng & Cằm (Cung Điền Trạch, hậu vận & phúc đức)'];
  const palmOptions = ['Tổng quan các đường tay', 'Sinh đạo (Sức khỏe, sức sống & biến cố)', 'Trí đạo (Tư duy, quyết định & tài năng)', 'Tâm đạo (Tình cảm, hôn nhân & cảm xúc)', 'Sự nghiệp (Thời vận & bước ngoặt thành công)'];
  const options = isFace ? faceOptions : palmOptions;
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel vision-tool-container"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85em',
      color: '#ffd700',
      margin: '0 0 10px',
      fontStyle: 'italic'
    }
  }, defaultHint), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/*",
    style: {
      display: 'none'
    },
    onChange: handleFileChange
  }), /*#__PURE__*/React.createElement("input", {
    ref: nativeCameraInputRef,
    type: "file",
    accept: "image/*",
    capture: isFace ? 'user' : 'environment',
    style: {
      display: 'none'
    },
    onChange: handleNativeCamera
  }), !isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn primary-camera",
    onClick: () => startCamera(cameraFacing)
  }, "📸 Chụp trực tiếp"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    onClick: () => nativeCameraInputRef.current && nativeCameraInputRef.current.click()
  }, "📷 Chụp bằng máy"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    onClick: () => fileInputRef.current && fileInputRef.current.click()
  }, "📁 Tải ảnh có sẵn")), isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-camera-box"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("video", {
    ref: videoRef,
    playsInline: true,
    autoPlay: true,
    muted: true,
    className: `vision-video ${cameraFacing === 'user' ? 'mirror' : ''}`
  }), isFace && /*#__PURE__*/React.createElement("div", {
    className: "vision-face-guide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vision-face-oval"
  }), /*#__PURE__*/React.createElement("span", {
    className: "vision-guide-text"
  }, "Căn khuôn mặt vào giữa khung"))), cameraError && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px',
      color: '#ff7b7b',
      fontSize: '13px',
      background: 'rgba(255,0,0,0.15)',
      textAlign: 'center'
    }
  }, cameraError), /*#__PURE__*/React.createElement("div", {
    className: "vision-cam-ctrls"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    style: {
      padding: '8px 12px',
      fontSize: '12px'
    },
    onClick: switchCamera,
    title: "Đổi camera trước/sau"
  }, "🔄 Đổi cam"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-snap-btn",
    onClick: snapPhoto,
    title: "Bấm để chụp ảnh"
  }, "📸"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-action-btn",
    style: {
      padding: '8px 12px',
      fontSize: '12px',
      background: 'rgba(255,50,50,0.25)',
      borderColor: 'rgba(255,80,80,0.4)'
    },
    onClick: closeCamera,
    title: "Hủy chụp"
  }, "❌ Đóng"))), previewUrl && !isLiveCamera && /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-img-wrap"
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "vision-scan-bar"
  }), /*#__PURE__*/React.createElement("img", {
    src: previewUrl,
    alt: "Ảnh xem tướng",
    className: "vision-preview-img"
  })), /*#__PURE__*/React.createElement("div", {
    className: "vision-preview-status"
  }, /*#__PURE__*/React.createElement("span", null, loading ? '🔍 Đang quét nhận diện...' : '✅ Ảnh đã sẵn sàng'), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-retake-btn",
    onClick: () => startCamera(cameraFacing)
  }, "📸 Chụp lại"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "vision-retake-btn",
    onClick: () => fileInputRef.current && fileInputRef.current.click()
  }, "📁 Đổi ảnh")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '13px',
      color: '#c3d9ff'
    }
  }, "Bộ phận muốn xem kỹ:", /*#__PURE__*/React.createElement("select", {
    value: focusPart,
    onChange: e => setFocusPart(e.target.value),
    style: {
      width: '100%',
      marginTop: '4px',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)'
    }
  }, options.map((opt, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: opt,
    style: {
      background: '#071534',
      color: '#fff'
    }
  }, opt)))), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: isFace ? "Ghi chú thêm nếu muốn (Ví dụ: Mình muốn xem kỹ cung Tài Bạch, sự nghiệp năm nay...)" : "Ghi chú thêm nếu ảnh chưa rõ...",
    style: {
      width: '100%',
      minHeight: '60px',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.15)',
      resize: 'none'
    }
  }), /*#__PURE__*/React.createElement("label", {
    className: "vision-auto-toggle"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: autoAnalyze,
    onChange: e => setAutoAnalyze(e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "⚡ Tự động phân tích xem ngay sau khi chụp ảnh"))), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    style: {
      width: '100%',
      marginTop: '6px',
      height: '46px',
      fontSize: '15px',
      fontWeight: 'bold'
    },
    disabled: loading || !imageDataUrl && !note.trim(),
    onClick: () => runAnalysis()
  }, loading ? '⌛ AI đang phân tích trực tiếp...' : '✨ Xem tướng trực tiếp ngay')), /*#__PURE__*/React.createElement(Result, {
    text: result
  }));
}
function LoveTool() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [out, setOut] = useState('Nhập thông tin hai người để luận giải.');
  async function run() {
    setOut('Đang tính bằng code và AI luận giải...');
    try {
      const d = await apiJSON('/api/love-ai', {
        geminiModel: 'gemini-3.5-flash-lite',
        persons: [{
          name: 'Người 1',
          birthDate: a
        }, {
          name: 'Người 2',
          birthDate: b
        }]
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory('Tình duyên', d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "💞 Tình duyên"), /*#__PURE__*/React.createElement("input", {
    value: a,
    onChange: e => setA(e.target.value),
    placeholder: "Ngày sinh người 1: 01/01/2000"
  }), /*#__PURE__*/React.createElement("input", {
    value: b,
    onChange: e => setB(e.target.value),
    placeholder: "Ngày sinh người 2: 02/02/2004"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "Luận giải")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function TuviTool() {
  const [profile, setProfile] = useState(() => {
    const saved = getDestinyProfile() || {};
    return {
      fullName: saved.fullName || saved.name || '',
      gender: saved.gender || 'Nam',
      birthDate: saved.birthDate || '',
      birthTime: saved.birthTime || '',
      calendarType: saved.calendarType || 'solar',
      birthPlace: saved.birthPlace || '',
      concern: saved.concern || ''
    };
  });
  const [saveStatus, setSaveStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [out, setOut] = useState('Điền thông tin bản mệnh và bấm luận giải để khám phá vận mệnh.');
  useEffect(() => {
    loadDestinyProfileFromCloud().then(cloudProfile => {
      if (cloudProfile && (cloudProfile.fullName || cloudProfile.name)) {
        setProfile(prev => ({
          fullName: prev.fullName || cloudProfile.fullName || cloudProfile.name || '',
          gender: prev.gender || cloudProfile.gender || 'Nam',
          birthDate: prev.birthDate || cloudProfile.birthDate || '',
          birthTime: prev.birthTime || cloudProfile.birthTime || '',
          calendarType: prev.calendarType || cloudProfile.calendarType || 'solar',
          birthPlace: prev.birthPlace || cloudProfile.birthPlace || '',
          concern: prev.concern || cloudProfile.concern || ''
        }));
      }
    });
  }, []);
  async function handleSave() {
    if (!profile.fullName.trim() || !profile.birthDate) {
      setSaveStatus('⚠️ Vui lòng điền họ tên và ngày sinh trước khi lưu.');
      setTimeout(() => setSaveStatus(''), 4000);
      return;
    }
    await saveDestinyProfile(profile);
    setSaveStatus('✅ Đã lưu Hồ Sơ Bản Mệnh lên mây!');
    setTimeout(() => setSaveStatus(''), 4000);
  }
  async function run(customConcern) {
    const activeConcern = customConcern || profile.concern || 'Luận giải tổng quan vận mệnh, sự nghiệp, tài lộc và tình cảm';
    setBusy(true);
    setOut('✦ AI Đặng Năm đang an sao, đối chiếu thiên bàn - địa bàn và phân tích đa chiều...');
    try {
      await saveDestinyProfile(profile);
      const d = await apiJSON('/api/mystic-ai', {
        name: profile.fullName || 'Đương số',
        birthDate: profile.birthDate,
        birthTime: profile.birthTime,
        gender: profile.gender,
        calendarType: profile.calendarType,
        birthPlace: profile.birthPlace,
        question: activeConcern,
        destinyProfile: profile,
        geminiModel: 'gemini-3.5-flash-lite',
        localReport: window.MysticEngine ? window.MysticEngine.Numerology.analyze(profile.fullName, profile.birthDate) : ''
      });
      const resText = d.text || d.reply || 'Không có kết quả.';
      setOut(resText);
      saveHistory('Tử Vi Bản Mệnh', `${profile.fullName || 'Đương số'}: ${resText.slice(0, 140)}...`);
    } catch (e) {
      setOut('⚠️ Lỗi: ' + e.message);
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "📜 Hồ Sơ Bản Mệnh & Tử Vi"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '11px',
      color: '#00f0ff',
      background: 'rgba(0,240,255,0.1)',
      padding: '3px 8px',
      borderRadius: '12px'
    }
  }, "Đồng bộ Cloud")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '12px',
      opacity: 0.8,
      marginBottom: '14px'
    }
  }, "Lưu hồ sơ một lần để hệ thống Đặng Năm AI tự động nhận diện và luận giải cho tất cả các câu hỏi mà không cần nhập lại."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    value: profile.fullName,
    onChange: e => setProfile({
      ...profile,
      fullName: e.target.value
    }),
    placeholder: "Họ và tên đương số *",
    style: {
      gridColumn: 'span 2'
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: profile.gender,
    onChange: e => setProfile({
      ...profile,
      gender: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "Nam"
  }, "Giới tính: Nam"), /*#__PURE__*/React.createElement("option", {
    value: "Nữ"
  }, "Giới tính: Nữ")), /*#__PURE__*/React.createElement("select", {
    value: profile.calendarType,
    onChange: e => setProfile({
      ...profile,
      calendarType: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", {
    value: "solar"
  }, "Dương lịch"), /*#__PURE__*/React.createElement("option", {
    value: "lunar"
  }, "Âm lịch"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '10px'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '11px',
      opacity: 0.7,
      display: 'block',
      marginBottom: '3px'
    }
  }, "Ngày sinh *"), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: profile.birthDate,
    onChange: e => setProfile({
      ...profile,
      birthDate: e.target.value
    })
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: '11px',
      opacity: 0.7,
      display: 'block',
      marginBottom: '3px'
    }
  }, "Giờ sinh"), /*#__PURE__*/React.createElement("input", {
    type: "time",
    value: profile.birthTime,
    onChange: e => setProfile({
      ...profile,
      birthTime: e.target.value
    })
  }))), /*#__PURE__*/React.createElement("input", {
    value: profile.birthPlace,
    onChange: e => setProfile({
      ...profile,
      birthPlace: e.target.value
    }),
    placeholder: "Nơi sinh (Tỉnh / Thành phố)",
    style: {
      marginBottom: '10px'
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: profile.concern,
    onChange: e => setProfile({
      ...profile,
      concern: e.target.value
    }),
    placeholder: "Mối quan tâm hoặc câu hỏi cụ thể (Vd: Năm nay công danh thăng tiến thế nào, hạn xuất ngoại, tình cảm...)",
    rows: "2",
    style: {
      marginBottom: '10px'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "secondary",
    onClick: handleSave,
    style: {
      flex: 1
    }
  }, "💾 Lưu Hồ Sơ"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "primary",
    onClick: () => run(),
    disabled: busy,
    style: {
      flex: 2
    }
  }, busy ? '✦ Đang Luận Giải...' : '🔮 Luận Giải Chuyên Sâu')), saveStatus && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#00f0ff',
      textAlign: 'center',
      marginBottom: '10px'
    }
  }, saveStatus), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      paddingTop: '12px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      color: '#ffd700',
      marginBottom: '8px',
      fontWeight: 'bold'
    }
  }, "⚡ Gợi ý chủ đề hỏi nhanh:"), /*#__PURE__*/React.createElement("div", {
    className: "chat-quick-chips",
    style: {
      padding: '0',
      margin: '0'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => run('Luận giải tổng quan đại vận & tiểu vận năm 2026')
  }, "🔮 Vận hạn 2026"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => run('Phân tích cung Quan Lộc & Tài Bạch: Sự nghiệp và tiền tài')
  }, "💰 Tài Bạch & Sự nghiệp"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => run('Phân tích cung Phu Thê: Tình duyên, hôn nhân và gia đạo')
  }, "💞 Tình duyên & Phu Thê"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => run('Phân tích cung Phúc Đức & Tật Ách: Bình an và sức khỏe')
  }, "🩺 Sức khỏe & Phúc đức"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "quick-chip",
    onClick: () => run('Xem ngày giờ tốt hoàng đạo và việc lành trong tuần này')
  }, "📅 Ngày tốt tuần này")))), /*#__PURE__*/React.createElement(Result, {
    text: out,
    title: "Bản Luận Giải Tử Vi & Vận Số"
  }));
}
function SimpleTool({
  kind,
  title,
  icon,
  preset = '',
  placeholder = 'Bạn muốn hỏi điều gì?'
}) {
  const [q, setQ] = useState('');
  const [out, setOut] = useState('Nhập nội dung rồi bấm luận giải.');
  async function run() {
    setOut('AI đang luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        message: `${preset || title} ${q}`,
        provider: 'auto',
        model: 'gemini-3.5-flash-lite'
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory(title, d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: placeholder
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "Luận giải")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function AstrologyTool() {
  const zodiacs = [{
    id: 'Bạch Dương',
    icon: '♈',
    date: '21/03 - 19/04'
  }, {
    id: 'Kim Ngưu',
    icon: '♉',
    date: '20/04 - 20/05'
  }, {
    id: 'Song Tử',
    icon: '♊',
    date: '21/05 - 21/06'
  }, {
    id: 'Cự Giải',
    icon: '♋',
    date: '22/06 - 22/07'
  }, {
    id: 'Sư Tử',
    icon: '♌',
    date: '23/07 - 22/08'
  }, {
    id: 'Xử Nữ',
    icon: '♍',
    date: '23/08 - 22/09'
  }, {
    id: 'Thiên Bình',
    icon: '♎',
    date: '23/09 - 23/10'
  }, {
    id: 'Thiên Yết',
    icon: '♏',
    date: '24/10 - 22/11'
  }, {
    id: 'Nhân Mã',
    icon: '♐',
    date: '23/11 - 21/12'
  }, {
    id: 'Ma Kết',
    icon: '♑',
    date: '22/12 - 19/01'
  }, {
    id: 'Bảo Bình',
    icon: '♒',
    date: '20/01 - 18/02'
  }, {
    id: 'Song Ngư',
    icon: '♓',
    date: '19/02 - 20/03'
  }];
  const [selected, setSelected] = useState('');
  const [q, setQ] = useState('');
  const [out, setOut] = useState('Chọn cung hoàng đạo và nhập câu hỏi.');
  async function run() {
    if (!selected) return setOut('⚠️ Vui lòng chọn cung hoàng đạo của bạn.');
    setOut('AI đang luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: `Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau: Cung ${selected}. Câu hỏi: ${q}`
      });
      setOut(d.text || d.reply || 'Không có kết quả');
      saveHistory('Tình duyên', d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🪐 Chiêm tinh"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '8px',
      marginBottom: '15px'
    }
  }, zodiacs.map(z => /*#__PURE__*/React.createElement("div", {
    key: z.id,
    onClick: () => setSelected(z.id),
    style: {
      background: selected === z.id ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.05)',
      border: selected === z.id ? '1px solid #ffd700' : '1px solid transparent',
      borderRadius: '8px',
      padding: '10px 5px',
      textAlign: 'center',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '24px'
    }
  }, z.icon), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      marginTop: '4px',
      color: '#fff'
    }
  }, z.id), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      color: '#aaa',
      marginTop: '2px'
    }
  }, z.date)))), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Tình duyên/công việc tháng này thế nào?"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "✨ Xem chiêm tinh")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function FengShuiTool() {
  return /*#__PURE__*/React.createElement(SimpleTool, {
    kind: "fengshui",
    title: "Phong thủy",
    icon: "☯️",
    preset: "Phân tích phong thủy thực tế, màu hợp, hướng hợp, bố trí không gian theo thông tin sau:",
    placeholder: "Ví dụ: sinh năm 1995, muốn xem hướng bàn làm việc và màu hợp."
  });
}
function TarotTool() {
  const cards = [{
    name: 'The Fool - Khởi đầu',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg'
  }, {
    name: 'The Magician - Chủ động',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'
  }, {
    name: 'The High Priestess - Trực giác',
    img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg'
  }, {
    name: 'The Lovers - Tình cảm',
    img: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg'
  }, {
    name: 'The Chariot - Quyết đoán',
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg'
  }, {
    name: 'Strength - Bình tĩnh',
    img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg'
  }, {
    name: 'The Hermit - Suy ngẫm',
    img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg'
  }, {
    name: 'Wheel of Fortune - Vận trình',
    img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg'
  }, {
    name: 'The Star - Hy vọng',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg'
  }, {
    name: 'The Sun - Tích cực',
    img: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg'
  }];
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState([]);
  const [out, setOut] = useState('Nhập câu hỏi rồi bấm trải bài. Bạn có thể bấm Đổi bài để bốc lại.');
  async function draw() {
    const deck = [...cards].sort(() => Math.random() - .5).slice(0, 3);
    setPicked(deck);
    setOut('AI đang luận 3 lá bài...');
    const deckNames = deck.map(c => c.name);
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: `Xem bài tarot tham khảo. Câu hỏi: ${q}. Ba lá: ${deckNames.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.`
      });
      setOut(d.text || d.reply || deckNames.join('\n'));
    } catch (e) {
      setOut(`### 🃏 Ba lá bài\n- ${deckNames.join('\n- ')}\n\nLời khuyên: xem như tham khảo để bình tĩnh lựa chọn, không quyết định thay thực tế.`);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🃏 Xem bài Tarot"), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Bạn muốn hỏi điều gì?"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: draw
  }, picked.length ? '🔄 Đổi bài' : '🃏 Trải bài Tarot'), /*#__PURE__*/React.createElement("div", {
    className: "tarot-cards",
    style: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      marginTop: '15px'
    }
  }, picked.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.name,
    style: {
      flex: 1,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: c.img,
    style: {
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '12px',
      marginTop: '8px',
      color: '#ffd700'
    }
  }, c.name))))), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function NumerologyTool() {
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [out, setOut] = useState('Nhập họ tên và ngày sinh để tính thần số học.');
  function sumDigits(v) {
    let n = String(v).replace(/\D/g, '').split('').reduce((a, b) => a + Number(b), 0);
    while (n > 9 && ![11, 22, 33].includes(n)) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
    return n || 0;
  }
  async function run() {
    const life = sumDigits(birth);
    setOut('Đang tính local và AI luận giải...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        model: 'gemini-3.5-flash-lite',
        message: `Thần số học cho tên ${name || 'chưa nhập'}, ngày sinh ${birth || 'chưa nhập'}, số chủ đạo local là ${life}. Luận rõ tính cách, tình duyên, công việc, lời khuyên.`
      });
      setOut(d.text || d.reply || `Số chủ đạo: ${life}`);
    } catch (e) {
      setOut(`### 🔢 Kết quả local
- Họ tên: ${name || 'Chưa nhập'}
- Ngày sinh: ${birth || 'Chưa nhập'}
- Số chủ đạo: ${life || 'Chưa đủ dữ liệu'}

Kết quả chỉ mang tính tham khảo.`);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🔢 Thần số học AI"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Họ và tên"
  }), /*#__PURE__*/React.createElement("input", {
    value: birth,
    onChange: e => setBirth(e.target.value),
    placeholder: "Ngày sinh: 01/01/2000"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "🤖 Luận thần số học")), /*#__PURE__*/React.createElement(Result, {
    text: out
  }));
}
function Result({
  text,
  title = 'Kết quả luận giải'
}) {
  if (!text) return null;
  return /*#__PURE__*/React.createElement("article", {
    className: "premium-panel result"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '8px'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, "📌 ", title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '6px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "small-action-btn",
    onClick: () => {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text);
        alert('Đã sao chép kết quả!');
      }
    }
  }, "📋 Sao chép"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "small-action-btn",
    onClick: () => exportResultToPrint(title, text)
  }, "🖨️ In / PDF"))), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: markdownLite(text)
    }
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}
function DeepTool() {
  const [result, setResult] = useState('Điền thông tin và bấm phân tích để bắt đầu.');
  const [form, setForm] = useState({
    name: '',
    birth: '',
    ask: '',
    focus: 'Tổng quan cuộc đời & Vận hạn'
  });
  const [busy, setBusy] = useState(false);
  async function run() {
    if (!form.ask) return alert('Vui lòng nhập vấn đề cần hỏi.');
    setBusy(true);
    setResult('AI đang tổng hợp dữ liệu đa lớp và phân tích sâu...');
    try {
      const data = await apiJSON('/api/deep-ai', {
        ...form,
        geminiModel: 'gemini-3.5-flash-lite'
      });
      setResult(data.text || data.reply || 'Không có kết quả trả về.');
    } catch (e) {
      setResult('Lỗi: ' + e.message);
    } finally {
      setBusy(false);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🧠 AI Phân Tích Chuyên Sâu PRO"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '13px',
      opacity: 0.8,
      marginBottom: '14px'
    }
  }, "Cung cấp thông tin chi tiết nhất để AI tổng hợp đa lớp và luận giải chuyên sâu."), /*#__PURE__*/React.createElement("input", {
    placeholder: "Họ tên (vd: Nguyễn Văn A)",
    value: form.name,
    onChange: e => setForm({
      ...form,
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("input", {
    type: "date",
    value: form.birth,
    onChange: e => setForm({
      ...form,
      birth: e.target.value
    })
  }), /*#__PURE__*/React.createElement("textarea", {
    placeholder: "Trình bày rõ vấn đề bạn đang gặp phải hoặc điều muốn hỏi thật chi tiết...",
    value: form.ask,
    onChange: e => setForm({
      ...form,
      ask: e.target.value
    }),
    style: {
      height: '100px'
    }
  }), /*#__PURE__*/React.createElement("select", {
    value: form.focus,
    onChange: e => setForm({
      ...form,
      focus: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Tổng quan cuộc đời & Vận hạn"), /*#__PURE__*/React.createElement("option", null, "Công danh sự nghiệp & Tài lộc"), /*#__PURE__*/React.createElement("option", null, "Tình duyên & Hôn nhân"), /*#__PURE__*/React.createElement("option", null, "Phân tích tâm lý & Lời khuyên")), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run,
    disabled: busy
  }, busy ? 'Đang xử lý...' : '✦ Bắt Đầu Phân Tích')), /*#__PURE__*/React.createElement(Result, {
    text: result
  }));
}