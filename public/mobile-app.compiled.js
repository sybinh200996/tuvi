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
  }), tab === 'fengshui' && /*#__PURE__*/React.createElement(FengShuiTool, null), tab === 'tarot' && /*#__PURE__*/React.createElement(TarotTool, null), tab === 'settings' && /*#__PURE__*/React.createElement(Settings, {
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
    onClick: () => alert('Tính năng Lịch sử đang phát triển!'),
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
  const [voiceCountdown, setVoiceCountdown] = useState(0);
  const boxRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceTranscriptRef = useRef('');
  const draftRef = useRef('');
  const countdownTimerRef = useRef(null);
  const requestAbortRef = useRef(null);
  function clearVoiceCountdown(notice = '') {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = null;
    setVoiceCountdown(0);
    if (notice) setVoiceStatus(notice);
  }
  useEffect(() => () => {
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    try {
      recognitionRef.current?.abort();
    } catch {}
    requestAbortRef.current?.abort?.();
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
    clearVoiceCountdown();
    setVoiceStatus('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceStatus('Trình duyệt này chưa hỗ trợ micro trong trang. Bạn có thể dùng micro trên bàn phím điện thoại.');
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
        setVoiceStatus('Đang nghe tiếng Việt…');
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
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') setVoiceStatus('Chưa có quyền dùng micro. Hãy cho phép micro rồi thử lại.');else if (!voiceTranscriptRef.current) setVoiceStatus('Chưa nhận được giọng nói. Hãy thử lại.');
      };
      recognition.onend = () => {
        setListening(false);
        recognitionRef.current = null;
        if (!voiceTranscriptRef.current.trim()) {
          setVoiceStatus(current => current === 'Đang nghe tiếng Việt…' ? 'Chưa nhận được giọng nói. Hãy thử lại.' : current);
          return;
        }
        setVoiceStatus('Đã nhận giọng nói.');
        let remaining = 3;
        setVoiceCountdown(remaining);
        countdownTimerRef.current = setInterval(() => {
          remaining -= 1;
          if (remaining <= 0) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
            setVoiceCountdown(0);
            setVoiceStatus('');
            const spoken = draftRef.current.trim();
            if (spoken) send(spoken);
          } else setVoiceCountdown(remaining);
        }, 1000);
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
  async function send(customText) {
    const content = (customText ?? text).trim();
    if (!content && !attachments.length || busy) return;
    clearVoiceCountdown();
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
      text: 'Đang suy nghĩ kỹ và kiểm tra ngữ cảnh…',
      loading: true
    }]);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    requestAbortRef.current = controller;
    try {
      const [selectedProvider, selectedModel] = modelChoice === 'auto' ? ['auto', ''] : modelChoice.split('::');
      let data;
      if (attachments.length) {
        const files = await Promise.all(attachments.map(item => prepareChatAttachment(item.file)));
        data = await apiJSON('/api/chat-ai', {
          message: content,
          attachments: files,
          history: next.slice(-20),
          answerStyle,
          geminiModel: selectedProvider === 'gemini' ? selectedModel : 'auto'
        }, 'POST', controller?.signal);
        setAttachments([]);
        setFileNotice('');
      } else {
        data = await apiJSON('/api/multi-ai/chat', {
          message: requestText,
          history: next.slice(-20),
          provider: selectedProvider,
          model: selectedModel,
          council,
          answerStyle
        }, 'POST', controller?.signal);
      }
      const answer = data.reply || data.text || 'AI chưa trả về nội dung.';
      setMessages([...next, {
        role: 'assistant',
        text: answer,
        meta: data.label || 'Đặng Năm AI'
      }]);
    } catch (e) {
      if (e.name === 'AbortError') setMessages([...next, {
        role: 'assistant',
        text: 'Đã dừng phản hồi.'
      }]);else {
        if (content) {
          draftRef.current = content;
          setText(current => current || content);
        }
        const freeModeError = /chế độ chỉ dùng model API miễn phí|tránh phát sinh phí/i.test(e.message || '');
        const extra = freeModeError ? '' : '\n\nNếu gửi ảnh/file, server cần có Gemini API key; bạn cũng có thể kiểm tra cấu hình ở AI Keys.';
        setMessages([...next, {
          role: 'assistant',
          text: `⚠️ ${e.message}${extra}`
        }]);
      }
    } finally {
      if (requestAbortRef.current === controller) requestAbortRef.current = null;
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
  const providerGroupLabel = p => `${p.label}${p.freeOnlyBlocked ? ' · tắt để tránh phí' : p.configured ? '' : ' · chưa cấu hình'}`;
  const providerModelOptions = providers.map(p => ({
    ...p,
    modelOptions: Array.from(new Set([...(p.models || []), p.model].filter(Boolean)))
  }));
  return /*#__PURE__*/React.createElement("section", {
    className: "chat-layout"
  }, /*#__PURE__*/React.createElement("aside", {
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
    onClick: () => setMessages(DEFAULT_MESSAGES)
  }, "＋ Chat mới"), /*#__PURE__*/React.createElement("div", {
    className: "mini-list"
  }, providers.map(p => /*#__PURE__*/React.createElement("span", {
    className: p.configured ? 'ok' : '',
    key: p.id
  }, p.configured ? '●' : '○', " ", p.label, p.freeOnlyBlocked ? ' (tắt để tránh phí)' : '')))), /*#__PURE__*/React.createElement("div", {
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
  }, m.attachments?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-message-files"
  }, m.attachments.map((file, index) => /*#__PURE__*/React.createElement("span", {
    key: `${file.name}-${index}`
  }, "📎 ", file.name))), /*#__PURE__*/React.createElement("div", {
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
    className: "chat-composer-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-model-row"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "chat-model-choice"
  }, "Model AI"), /*#__PURE__*/React.createElement("select", {
    id: "chat-model-choice",
    value: modelChoice,
    onChange: e => setModelChoice(e.target.value)
  }, /*#__PURE__*/React.createElement("option", {
    value: "auto"
  }, "Auto · Multi-AI"), providerModelOptions.map(p => /*#__PURE__*/React.createElement("optgroup", {
    key: p.id,
    label: providerGroupLabel(p),
    disabled: !p.configured
  }, p.modelOptions.map(model => /*#__PURE__*/React.createElement("option", {
    key: `${p.id}:${model}`,
    value: `${p.id}::${model}`
  }, model)))))), /*#__PURE__*/React.createElement("div", {
    className: "composer chat-pill-composer"
  }, attachments.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-list"
  }, attachments.map(item => /*#__PURE__*/React.createElement("span", {
    className: "chat-file-chip",
    key: item.id
  }, item.file.type.startsWith('image/') ? '🖼️' : '📄', " ", item.file.name, /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": `Xóa ${item.file.name}`,
    title: `Xóa ${item.file.name}`,
    onClick: () => removeFile(item.id)
  }, "×")))), fileNotice && /*#__PURE__*/React.createElement("div", {
    className: "chat-file-notice",
    role: "status"
  }, fileNotice), attachments.length > 0 && modelChoice !== 'auto' && !modelChoice.startsWith('gemini::') && /*#__PURE__*/React.createElement("div", {
    className: "chat-attachment-note"
  }, "Ảnh/file hiện được phân tích qua Gemini đa phương thức."), voiceStatus && /*#__PURE__*/React.createElement("div", {
    className: "chat-voice-status",
    role: "status"
  }, voiceStatus, voiceCountdown > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, " ", /*#__PURE__*/React.createElement("b", null, "Gửi sau ", voiceCountdown, "s"), " ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => clearVoiceCountdown('Đã hủy tự động gửi.')
  }, "Hủy"))), /*#__PURE__*/React.createElement("textarea", {
    value: text,
    onChange: e => {
      draftRef.current = e.target.value;
      if (voiceCountdown) clearVoiceCountdown('Đã hủy tự động gửi do bạn chỉnh sửa nội dung.');
      setText(e.target.value);
    },
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    placeholder: "Nhập tin nhắn...",
    "aria-label": "Tin nhắn gửi AI",
    rows: "1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "chat-composer-bottom"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chat-upload-bar pro-upload mobile-chat-uploads"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => imageInputRef.current?.click()
  }, "📎 ", /*#__PURE__*/React.createElement("span", null, "Tải ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => cameraInputRef.current?.click()
  }, "📷 ", /*#__PURE__*/React.createElement("span", null, "Chụp ảnh")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => fileInputRef.current?.click()
  }, "📄 ", /*#__PURE__*/React.createElement("span", null, "Tải file")), attachments.length > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-clear-files",
    onClick: () => {
      setAttachments([]);
      setFileNotice('');
    }
  }, "Xóa hết"), /*#__PURE__*/React.createElement("input", {
    ref: imageInputRef,
    className: "chat-hidden-input",
    type: "file",
    accept: "image/*",
    multiple: true,
    onChange: e => {
      addFiles(e.target.files);
      e.target.value = '';
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
    }
  })), listening ? /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn is-listening",
    "aria-label": "Dừng ghi âm",
    title: "Dừng ghi âm",
    onClick: stopDictation
  }, "■") : /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "chat-mic-btn",
    "aria-label": "Nhập bằng giọng nói",
    title: "Nhập bằng giọng nói",
    disabled: busy,
    onClick: startDictation
  }, "🎙"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: `pill-send-btn ${busy ? 'is-stop' : ''}`,
    "aria-label": busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    title: busy ? 'Dừng phản hồi' : 'Gửi tin nhắn',
    onClick: busy ? stopResponse : () => send()
  }, busy ? '■' : '➤'))))));
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
      // Simulated OAuth popup
      const email = `user_${Date.now().toString().slice(-6)}@${provider}.com`;
      alert('Đang kết nối tới ' + provider + '...');
      await new Promise(r => setTimeout(r, 1000));
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
  const [result, setResult] = useState('Vui lòng tải ảnh lên để bắt đầu.');
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
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
        palmNote: note
      } : {
        mode,
        image,
        faceImage: image,
        facePart: 'Tổng quan ngũ quan',
        faceNote: note
      };
      setResult('AI đang phân tích ảnh...');
      const d = await apiJSON('/api/vision-ai', payload);
      setResult(d.text || d.reply || 'Không có kết quả.');
    } catch (e) {
      const fb = window.MysticEngine ? mode === 'palm' ? window.MysticEngine.Palmistry.analyze(note, '') : window.MysticEngine.Face.analyze(note, '') : mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt';
      setResult(fb);
    }
  }
  const hint = mode === 'palm' ? '* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.' : '* Mẹo: Chụp chính diện, rõ 5 ngũ quan, đủ sáng, không đeo kính và không che trán.';
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, icon, " ", title), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: '0.85em',
      color: '#ffd700',
      marginBottom: '15px',
      fontStyle: 'italic'
    }
  }, hint), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: e => setFile(e.target.files?.[0]),
    style: {
      width: '100%',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff'
    }
  }), /*#__PURE__*/React.createElement("textarea", {
    value: note,
    onChange: e => setNote(e.target.value),
    placeholder: "Ghi chú thêm (Mình quan tâm sự nghiệp...)",
    style: {
      width: '100%',
      minHeight: '60px',
      padding: '10px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '12px',
      color: '#fff',
      border: 'none',
      resize: 'none'
    }
  })), /*#__PURE__*/React.createElement("button", {
    className: "primary",
    style: {
      width: '100%',
      marginTop: '5px',
      height: '44px'
    },
    onClick: run
  }, "✨ Phân tích ngay")), /*#__PURE__*/React.createElement(Result, {
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
function TuviTool() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [time, setTime] = useState('');
  const [gender, setGender] = useState('Nam');
  const [out, setOut] = useState('Nhập thông tin để luận giải.');
  async function run() {
    setOut('Đang tải...');
    try {
      const d = await apiJSON('/api/mystic-ai', {
        name,
        birthDate: dob,
        birthTime: time,
        gender,
        localReport: window.MysticEngine ? window.MysticEngine.Numerology.analyze(name, dob) : ''
      });
      setOut(d.text || d.reply || 'Không có kết quả');
    } catch (e) {
      setOut(window.MysticEngine ? window.MysticEngine.Numerology.analyze(name, dob) : '⚠️ Lỗi: ' + e.message);
    }
  }
  return /*#__PURE__*/React.createElement("section", {
    className: "tool-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "premium-panel"
  }, /*#__PURE__*/React.createElement("h2", null, "📜 Tử vi / Thần số"), /*#__PURE__*/React.createElement("input", {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Họ và tên"
  }), /*#__PURE__*/React.createElement("input", {
    value: dob,
    onChange: e => setDob(e.target.value),
    type: "date"
  }), /*#__PURE__*/React.createElement("input", {
    value: time,
    onChange: e => setTime(e.target.value),
    type: "time"
  }), /*#__PURE__*/React.createElement("select", {
    value: gender,
    onChange: e => setGender(e.target.value)
  }, /*#__PURE__*/React.createElement("option", null, "Nam"), /*#__PURE__*/React.createElement("option", null, "Nữ")), /*#__PURE__*/React.createElement("button", {
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
        message: `Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau: Cung ${selected}. Câu hỏi: ${q}`
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