const {
  useEffect,
  useMemo,
  useRef,
  useState
} = React;
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
  label: 'Bói bài'
}, {
  id: 'settings',
  icon: '⚙️',
  label: 'AI Keys'
}];
const DEFAULT_MESSAGES = [{
  role: 'assistant',
  text: 'Chào Đặng Năm. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.'
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
async function apiJSON(url, payload, method = 'POST') {
  const response = await fetch(url, {
    method,
    headers: {
      ...(method === 'GET' ? {} : {
        'Content-Type': 'application/json'
      }),
      ...authHeaders()
    },
    body: method === 'GET' ? undefined : JSON.stringify(payload || {})
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
function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text)));
    }
  } catch (e) {}
  const safe = String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\n/g, '<br/>');
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
  }), tab === 'love' && /*#__PURE__*/React.createElement(LoveTool, null), tab === 'horoscope' && /*#__PURE__*/React.createElement(SimpleTool, {
    kind: "horoscope",
    title: "Tử vi / Luận giải",
    icon: "🔮",
    preset: "Luận tử vi hôm nay, công việc, tình cảm, tài chính theo thông tin sau:"
  }), tab === 'astrology' && /*#__PURE__*/React.createElement(AstrologyTool, null), tab === 'numerology' && /*#__PURE__*/React.createElement(NumerologyTool, null), tab === 'multi' && /*#__PURE__*/React.createElement(Chat, {
    providers: providers
  }), tab === 'fengshui' && /*#__PURE__*/React.createElement(FengShuiTool, null), tab === 'tarot' && /*#__PURE__*/React.createElement(TarotTool, null), tab === 'settings' && /*#__PURE__*/React.createElement(Settings, {
    providers: providers,
    reload: loadProviders
  })), /*#__PURE__*/React.createElement("nav", {
    className: "bottom-nav"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('home'),
    className: tab === 'home' ? 'active' : ''
  }, "⌂", /*#__PURE__*/React.createElement("span", null, "Trang chủ")), /*#__PURE__*/React.createElement("button", {
    onClick: () => alert('Tính năng Lịch sử đang phát triển!'),
    className: tab === 'history' ? 'active' : ''
  }, "▣", /*#__PURE__*/React.createElement("span", null, "Lịch sử")), /*#__PURE__*/React.createElement("button", {
    className: "magic",
    onClick: () => setTab('chat')
  }, "✦"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('chat'),
    className: tab === 'chat' ? 'active' : ''
  }, "☻", /*#__PURE__*/React.createElement("span", null, "AI Chat")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTab('settings'),
    className: tab === 'settings' ? 'active' : ''
  }, "♙", /*#__PURE__*/React.createElement("span", null, "Tài khoản"))));
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
  const cards = [['🧠', 'Phân Tích Chuyên Sâu PRO', 'AI tổng hợp đa lớp, luận giải chuyên sâu.', 'deep'], ['🔮', 'Tử vi', 'Luận giải hôm nay, công việc, tình cảm, tài chính.', 'horoscope'], ['✋', 'Xem chỉ tay', 'Upload ảnh bàn tay để AI phân tích rõ hơn.', 'palm'], ['🙂', 'Xem tướng', 'Upload ảnh khuôn mặt, nhận luận giải nhẹ nhàng.', 'face'], ['🪐', 'Chiêm tinh', 'Cung hoàng đạo, vận trình tháng, tình cảm.', 'astrology'], ['💞', 'Tình duyên', 'Tính tuổi, ngũ hành, thần số học bằng code trước khi AI luận.', 'love'], ['🔢', 'Thần số học', 'Tính số chủ đạo, linh hồn, biểu đạt và luận AI.', 'numerology'], ['💬', 'AI Chat Pro', 'Trả lời có nhớ ngữ cảnh, copy, đọc giọng nói.', 'chat'], ['🤖', 'Multi AI', 'Tự chọn Claude, Gemini, Groq, OpenRouter, ChatGPT, Grok.', 'multi'], ['☯️', 'Phong thủy', 'Màu hợp, hướng hợp, bố trí phòng/bàn làm việc.', 'fengshui'], ['🃏', 'Bói bài / Đổi bài', 'Bốc bài tham khảo và đổi bài nhanh.', 'tarot'], ['⚙️', 'Cài đặt', 'Quản lý tài khoản và thiết lập AI.', 'settings']];
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
    return Array.isArray(saved) && saved.length ? saved.slice(-50) : DEFAULT_MESSAGES;
  });
  const [text, setText] = useState('');
  const [provider, setProvider] = useState('auto');
  const [answerStyle, setAnswerStyle] = useState('detailed');
  const [council, setCouncil] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastPrompt, setLastPrompt] = useState('');
  const boxRef = useRef(null);
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
  async function send(customText) {
    const content = (customText ?? text).trim();
    if (!content || busy) return;
    setText('');
    setLastPrompt(content);
    setBusy(true);
    const next = [...messages, {
      role: 'user',
      text: content
    }];
    setMessages([...next, {
      role: 'assistant',
      text: 'Đang suy nghĩ kỹ và kiểm tra ngữ cảnh…',
      loading: true
    }]);
    try {
      const data = await apiJSON('/api/multi-ai/chat', {
        message: content,
        history: next.slice(-20),
        provider,
        council,
        answerStyle
      });
      const answer = data.reply || data.text || 'AI chưa trả về nội dung.';
      setMessages([...next, {
        role: 'assistant',
        text: answer,
        meta: data.label || 'Đặng Năm AI'
      }]);
    } catch (e) {
      setMessages([...next, {
        role: 'assistant',
        text: `⚠️ ${e.message}\n\nGợi ý: vào tab AI Keys kiểm tra CLAUDE_API_KEY / ANTHROPIC_API_KEY / GEMINI_API_KEY hoặc chọn provider khác.`
      }]);
    } finally {
      setBusy(false);
    }
  }
  function copy(t) {
    navigator.clipboard?.writeText(t);
  }
  function speak(t) {
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t);
      u.lang = 'vi-VN';
      speechSynthesis.speak(u);
    } catch {}
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "chat-layout"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "chat-side premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🧠 AI Router"), /*#__PURE__*/React.createElement("p", null, "Auto chọn provider có key. Ưu tiên nhanh, chính xác, không lộ model."), /*#__PURE__*/React.createElement("select", {
    value: provider,
    onChange: e => setProvider(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto Router"), providers.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.label))), /*#__PURE__*/React.createElement("select", {
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
    onClick: () => setMessages(DEFAULT_MESSAGES)
  }, "＋ Chat mới"), /*#__PURE__*/React.createElement("div", {
    className: "mini-list"
  }, providers.map(p => /*#__PURE__*/React.createElement("span", {
    className: p.configured ? 'ok' : '',
    key: p.id
  }, p.configured ? '●' : '○', " ", p.label)))), /*#__PURE__*/React.createElement("div", {
    className: "chat-main premium-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "🤖 AI Chat Ultra"), /*#__PURE__*/React.createElement("p", null, "Chat box hiện đại, copy, đọc, thử lại, giữ ngữ cảnh.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => speak(messages.filter(m => m.role === 'assistant').at(-1)?.text || '')
  }, "🔊 Đọc")), /*#__PURE__*/React.createElement("div", {
    className: "chat-box",
    ref: boxRef
  }, messages.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `bubble ${m.role} ${m.loading ? 'loading' : ''}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, m.role === 'user' ? '👤' : '✦'), /*#__PURE__*/React.createElement("div", {
    className: "bubble-body"
  }, /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: markdownLite(m.text)
    }
  }), m.role === 'assistant' && !m.loading && /*#__PURE__*/React.createElement("div", {
    className: "msg-actions"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => copy(m.text)
  }, "Copy"), /*#__PURE__*/React.createElement("button", {
    onClick: () => speak(m.text)
  }, "Đọc"), /*#__PURE__*/React.createElement("button", {
    onClick: () => send(lastPrompt)
  }, "Thử lại")))))), /*#__PURE__*/React.createElement("div", {
    className: "composer chat-pill-composer"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => setText(e.target.value),
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Nhắn AI như ChatGPT...",
    rows: "1"
  }), /*#__PURE__*/React.createElement("button", {
    className: "pill-send-btn",
    disabled: busy,
    onClick: () => send()
  }, busy ? '…' : 'Gửi ✈'))));
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
  async function handleSocialLogin(provider) {
    try {
      const email = prompt(`[Mô phỏng OAuth] - Đăng nhập ${provider} thành công! Vui lòng nhập email của bạn:`, `user@${provider}.com`);
      if (!email) return;
      const name = provider === 'google' ? 'Google User' : 'Facebook User';
      const data = await apiJSON('/api/auth/social', {
        provider,
        email,
        name,
        uid: 'social_' + Date.now()
      });
      localStorage.setItem('synam_user', JSON.stringify(data.user));
      localStorage.setItem('synam_token', data.token || '');
      setUser(data.user);
      setAccount({
        name: '',
        email: '',
        password: ''
      });
      alert(`Đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} thành công!`);
      await reload();
    } catch (e) {
      alert(e.message);
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
  }, /*#__PURE__*/React.createElement("h3", null, user ? `Đã đăng nhập: ${user.name || user.email}` : 'Tài khoản thành viên'), user ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: logout
  }, "Đăng xuất") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '10px',
      marginBottom: '14px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSocialLogin('google'),
    style: {
      background: 'linear-gradient(135deg,rgba(255,74,74,.92),rgba(255,180,42,.78))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }
  }, "🔴 Google"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => handleSocialLogin('facebook'),
    style: {
      background: 'linear-gradient(135deg,rgba(24,119,242,.92),rgba(68,72,255,.82))',
      border: '1px solid rgba(255,255,255,.18)',
      borderRadius: '16px',
      color: '#fff',
      fontWeight: 900,
      textShadow: '0 1px 3px rgba(0,0,0,0.3)'
    }
  }, "🔵 Facebook")), /*#__PURE__*/React.createElement("div", {
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
  const [result, setResult] = useState('Upload ảnh rồi bấm phân tích.');
  const [file, setFile] = useState(null);
  async function run() {
    if (!file) return setResult('Bạn cần chọn ảnh trước nhé.');
    setResult('Đang tối ưu ảnh và chuẩn bị phân tích...');
    try {
      const image = await optimizeImage(file);
      const payload = mode === 'palm' ? {
        mode,
        image,
        palmImage: image,
        palmLine: 'Tổng quan đường tay',
        palmNote: ''
      } : {
        mode,
        image,
        faceImage: image,
        facePart: 'Tổng quan ngũ quan',
        faceNote: ''
      };
      setResult('AI đang phân tích ảnh...');
      const d = await apiJSON('/api/vision-ai', payload);
      setResult(d.text || d.reply || 'Không có kết quả.');
    } catch (e) {
      setResult('⚠️ ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: e => setFile(e.target.files?.[0])
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: run
  }, "Phân tích")), /*#__PURE__*/React.createElement(Result, {
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
        persons: [{
          name: 'Người 1',
          birthDate: a
        }, {
          name: 'Người 2',
          birthDate: b
        }]
      });
      setOut(d.text || d.reply || 'Không có kết quả');
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
        provider: 'auto'
      });
      setOut(d.text || d.reply || 'Không có kết quả');
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
  return /*#__PURE__*/React.createElement(SimpleTool, {
    kind: "astrology",
    title: "Chiêm tinh",
    icon: "🪐",
    preset: "Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau:",
    placeholder: "Ví dụ: Song Tử, tình duyên tháng này thế nào?"
  });
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
  const cards = ['The Fool - Khởi đầu mới', 'The Magician - Chủ động tạo cơ hội', 'The High Priestess - Lắng nghe trực giác', 'The Lovers - Lựa chọn trong tình cảm', 'The Chariot - Tiến lên quyết đoán', 'Strength - Bình tĩnh và mềm mỏng', 'The Hermit - Cần thời gian suy ngẫm', 'Wheel of Fortune - Vận trình đang xoay chuyển', 'The Star - Hy vọng và chữa lành', 'The Sun - Rõ ràng, vui vẻ, tích cực'];
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState([]);
  const [out, setOut] = useState('Nhập câu hỏi rồi bấm bốc bài. Có thể bấm Đổi bài để bốc lại.');
  async function draw() {
    const deck = [...cards].sort(() => Math.random() - .5).slice(0, 3);
    setPicked(deck);
    setOut('AI đang luận 3 lá bài...');
    try {
      const d = await apiJSON('/api/multi-ai/chat', {
        provider: 'auto',
        message: `Bói bài tarot tham khảo, không khẳng định tuyệt đối. Câu hỏi: ${q}. Ba lá: ${deck.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.`
      });
      setOut(d.text || d.reply || deck.join('\n'));
    } catch (e) {
      setOut(`### 🃏 Ba lá bài\n- ${deck.join('\n- ')}\n\nLời khuyên: xem như tham khảo để bình tĩnh lựa chọn, không quyết định thay thực tế.`);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "🃏 Bói bài / Đổi bài"), /*#__PURE__*/React.createElement("textarea", {
    value: q,
    onChange: e => setQ(e.target.value),
    placeholder: "Bạn muốn hỏi điều gì?"
  }), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    onClick: draw
  }, picked.length ? '🔄 Đổi bài' : '🃏 Bốc bài'), /*#__PURE__*/React.createElement("div", {
    className: "tarot-cards"
  }, picked.map(c => /*#__PURE__*/React.createElement("span", {
    key: c
  }, c)))), /*#__PURE__*/React.createElement(Result, {
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
  text
}) {
  return /*#__PURE__*/React.createElement("article", {
    className: "premium-panel result"
  }, /*#__PURE__*/React.createElement("h2", null, "📌 Kết quả"), /*#__PURE__*/React.createElement("div", {
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
      const data = await apiJSON('/api/deep-ai', form);
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
