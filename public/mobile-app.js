const { useEffect, useMemo, useRef, useState } = React;


function saveHistory(type, content) {
  try {
    const list = JSON.parse(localStorage.getItem('synam_history') || '[]');
    list.unshift({ type, content, at: new Date().toLocaleString('vi-VN') });
    localStorage.setItem('synam_history', JSON.stringify(list.slice(0, 80)));
  } catch(e){}
}

const TABS = [
  { id: 'home', icon: '✨', label: 'Trang chủ' },
  { id: 'horoscope', icon: '🔮', label: 'Tử vi' },
  { id: 'palm', icon: '✋', label: 'Chỉ tay' },
  { id: 'face', icon: '👁️', label: 'Xem tướng' },
  { id: 'astrology', icon: '🌌', label: 'Chiêm tinh' },
  { id: 'love', icon: '💖', label: 'Tình duyên' },
  { id: 'numerology', icon: '🔢', label: 'Thần số học' },
  { id: 'chat', icon: '⚡', label: 'AI Chat' },
  { id: 'multi', icon: '🌌', label: 'Multi AI' },
  { id: 'fengshui', icon: '☯️', label: 'Phong thủy' },
  { id: 'tarot', icon: '🃏', label: 'Xem bài Tarot' },
  { id: 'settings', icon: '⚙️', label: 'AI Keys' }
];

const LEGACY_WELCOME = 'Chào Đặng Năm. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const WELCOME_MESSAGE = 'Chào bạn. Mình là Đặng Năm AI Ultra. Bạn có thể hỏi về tử vi, thời tiết, ý tưởng, phân tích lỗi, viết nội dung hoặc code; mình sẽ trả lời rõ ràng và thực tế.';
const DEFAULT_MESSAGES = [
  { role: 'assistant', text: WELCOME_MESSAGE }
];

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
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function apiJSON(url, payload, method = 'POST', signal) {
  const response = await fetch(url, {
    method,
    headers: { ...(method === 'GET' ? {} : { 'Content-Type': 'application/json' }), ...authHeaders() },
    body: method === 'GET' ? undefined : JSON.stringify(payload || {}),
    ...(signal ? { signal } : {})
  });
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
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
    return { name, type: originalType, size: file.size, textPreview: await readFileAsText(file) };
  }
  if (originalType.startsWith('image/')) {
    try {
      const dataUrl = await optimizeImage(file, 1600, 0.82);
      return { name, type: 'image/jpeg', size: file.size, dataUrl };
    } catch {
      return { name, type: originalType, size: file.size, dataUrl: await readFileAsDataUrl(file) };
    }
  }
  return { name, type: originalType, size: file.size, dataUrl: await readFileAsDataUrl(file) };
}


function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text)));
    }
  } catch(e) {}
  const safe = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\n/g, '<br/>');
}


function HistoryTool() {
  const [list, setList] = useState([]);
  useEffect(() => {
    try { setList(JSON.parse(localStorage.getItem('synam_history') || '[]')); } catch(e){}
  }, []);
  function clearHist() {
    if(confirm('Xóa toàn bộ lịch sử?')) { localStorage.removeItem('synam_history'); setList([]); }
  }
  return <section className="tool-grid">
    <div className="premium-panel" style={{padding: '15px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2 style={{margin:0}}>⏳ Lịch sử</h2>
        {list.length > 0 && <button onClick={clearHist} className="ghost" style={{padding: '6px 12px', fontSize:'12px'}}>Xóa hết</button>}
      </div>
      <div style={{marginTop: '15px', display:'flex', flexDirection:'column', gap:'12px'}}>
        {list.length === 0 ? <p style={{color:'var(--muted)'}}>Chưa có lịch sử nào.</p> : list.map((item, i) => (
          <div key={i} style={{background:'rgba(255,255,255,0.08)', padding:'12px', borderRadius:'12px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'12px', color:'var(--brand)'}}>
              <b>{item.type}</b> <span>{item.at}</span>
            </div>
            <div style={{fontSize:'14px', lineHeight:'1.5', whiteSpace:'pre-wrap', maxHeight: '200px', overflowY: 'auto'}}>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  </section>;
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
      const data = await fetch('/api/ai/providers', { headers: authHeaders() }).then(r => r.json());
      setProviders(data.providers || []);
    } catch { setProviders([]); }
  }

  return <main className="app-shell">
    <Hero tab={tab} setTab={setTab} health={health} providers={providers} />
    <TabRail tab={tab} setTab={setTab} />
    <section className="workspace">
      {tab === 'home' && <Home setTab={setTab} providers={providers} />}
      {tab === 'chat' && <Chat providers={providers} />}
      {tab === 'deep' && <DeepTool />}
      {tab === 'palm' && <VisionTool mode="palm" title="Xem chỉ tay AI" icon="✋" />}
      {tab === 'face' && <VisionTool mode="face" title="Xem tướng AI" icon="🙂" />}
      {tab === 'love' && <LoveTool />}
      {tab === 'horoscope' && <TuviTool />}
      {tab === 'astrology' && <AstrologyTool />}
      {tab === 'numerology' && <NumerologyTool />}
      {tab === 'multi' && <Chat providers={providers} />}
      {tab === 'fengshui' && <FengShuiTool />}
      {tab === 'tarot' && <TarotTool />}
      {tab === 'history' && <HistoryTool />}
        {tab === 'settings' && <Settings providers={providers} reload={loadProviders} />}
    </section>
    <nav className="bottom-nav">
      <button aria-label="Trang chủ" onClick={() => setTab('home')} className={tab==='home'?'active':''}>
        <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7"/><path d="M5.5 9v11h13V9M9.5 20v-6h5v6"/></svg>
        <span>Trang chủ</span>
      </button>
      <button aria-label="Lịch sử" onClick={() => setTab('history')} className={tab==='history'?'active':''}>
        <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 8.5A8.5 8.5 0 1 1 4 17"/><path d="M3.5 3.5v5h5M12 7v5l3 2"/></svg>
        <span>Lịch sử</span>
      </button>
      <button className="magic" aria-label="Mở AI Chat" title="Mở AI Chat" onClick={() => setTab('chat')}>✦</button>
      <button aria-label="AI Chat" onClick={() => setTab('chat')} className={tab==='chat'?'active':''}>
        <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H6l-3 2 1.2-4.1A7.5 7.5 0 1 1 20 11.5Z"/><path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01"/></svg>
        <span>AI Chat</span>
      </button>
      <button aria-label="Tài khoản" onClick={() => setTab('settings')} className={tab==='settings'?'active':''}>
        <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0M5 21h14"/></svg>
        <span>Tài khoản</span>
      </button>
    </nav>
  </main>;
}

function Hero({ setTab, health, providers }) {
  const configured = providers.filter(p => p.configured).length;
  const [query, setQuery] = useState("");
  function handleSearch() {
    if(query.trim()){
      localStorage.setItem("synam_quick_ask", query.trim());
    }
    setTab("chat");
  }
  return <header className="hero">
      <div className="hero-img hero-left"><img src="assets/hero-left.png" alt="Minh họa Đặng Năm bên trái" /></div>
    <div className="hero-content">
      <div className="status-row"><span className="dot"></span>{health}<span className="chip">{configured || 0} AI đang bật</span></div>
      <h1>Đặng Năm <b>Mystic</b></h1>
      <p>AI • Tử vi • Chỉ tay • Xem tướng • Chiêm tinh</p>
      <div className="hero-actions quick">
        <button onClick={() => setTab('horoscope')}>🔮 Tử vi hôm nay</button>
        <button onClick={() => setTab('astrology')}>🪐 Cung hoàng đạo</button>
        <button onClick={() => setTab('palm')}>✋ Xem chỉ tay</button>
        <button onClick={() => setTab('face')}>🙂 Xem tướng</button>
      </div>
      <div className="hero-search">
        <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")handleSearch()}} placeholder="Nhập câu hỏi tử vi..."/>
        <button onClick={handleSearch}>✦ AI phân tích</button>
      </div>
    </div>
      <div className="hero-img hero-right"><img src="assets/hero-right.jpg" alt="Minh họa Đặng Năm bên phải" /></div>
  </header>;
}

function TabRail({ tab, setTab }) {
  return <div className="tab-rail-wrap">
    <nav className="tab-rail">
      {TABS.map(t => <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}><span>{t.icon}</span>{t.label}</button>)}
    </nav>
  </div>;
}

function Home({ setTab, providers }) {
  const cards = [
    ['🧠', 'Phân Tích Chuyên Sâu PRO', 'AI tổng hợp đa lớp, luận giải chuyên sâu.', 'deep'],
    ['🔮','Tử vi','Luận giải hôm nay, công việc, tình cảm, tài chính.', 'horoscope'],
    ['✋','Xem chỉ tay','Upload ảnh bàn tay để AI phân tích rõ hơn.', 'palm'],
    ['🙂','Xem tướng','Upload ảnh khuôn mặt, nhận luận giải nhẹ nhàng.', 'face'],
    ['🪐','Chiêm tinh','Cung hoàng đạo, vận trình tháng, tình cảm.', 'astrology'],
    ['💞','Tình duyên','Tính tuổi, ngũ hành, thần số học bằng code trước khi AI luận.', 'love'],
    ['🔢','Thần số học','Tính số chủ đạo, linh hồn, biểu đạt và luận AI.', 'numerology'],
    ['💬','AI Chat Pro','Trả lời có nhớ ngữ cảnh, copy, đọc giọng nói.', 'chat'],
    ['🤖','Multi AI','Tự chọn Claude, Gemini, Groq, OpenRouter, ChatGPT, Grok.', 'multi'],
    ['☯️','Phong thủy','Màu hợp, hướng hợp, bố trí phòng/bàn làm việc.', 'fengshui'],
    ['🃏','Xem bài Tarot','Bốc bài tham khảo và đổi bài nhanh.', 'tarot'],
    ['⚙️','Cài đặt','Quản lý tài khoản và thiết lập AI.', 'settings']
  ];
  return <div className="home-grid">
    
    {cards.map(c => <button key={c[3]} className="feature-card" onClick={() => setTab(c[3])}><b>{c[0]}</b><h3>{c[1]}</h3><p>{c[2]}</p></button>)}
  </div>;
}

function Chat({ providers }) {
  const [messages, setMessages] = useState(() => {
    const saved = readJSON('nam44_messages', DEFAULT_MESSAGES);
    return Array.isArray(saved) && saved.length
      ? saved.slice(-50).map(m => m?.role === 'assistant' && m.text === LEGACY_WELCOME ? { ...m, text: WELCOME_MESSAGE } : m)
      : DEFAULT_MESSAGES;
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
    try { recognitionRef.current?.abort(); } catch {}
    requestAbortRef.current?.abort?.();
    try { speechSynthesis.cancel(); } catch {}
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
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  function addFiles(fileList) {
    const picked = Array.from(fileList || []);
    if (!picked.length) return;
    let totalBytes = attachments.reduce((sum, item) => sum + item.file.size, 0);
    const accepted = [];
    const notices = [];
    for (const file of picked) {
      if (attachments.length + accepted.length >= 6) { notices.push('Mỗi lượt tối đa 6 file.'); break; }
      if (file.size > 12 * 1024 * 1024) { notices.push(`${file.name}: file vượt quá 12 MB.`); continue; }
      if (totalBytes + file.size > 14 * 1024 * 1024) { notices.push('Tổng dung lượng file tối đa 14 MB/lượt.'); continue; }
      totalBytes += file.size;
      accepted.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file });
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
      recognition.onstart = () => { setListening(true); setVoiceStatus('Đang lắng nghe tiếng Việt…'); };
      recognition.onresult = event => {
        const finalText = Array.from(event.results || []).slice(event.resultIndex || 0)
          .filter(result => result.isFinal).map(result => result[0]?.transcript || '').join(' ').trim();
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
    try { recognitionRef.current?.stop(); } catch {}
  }

  function stopResponse() {
    try { requestAbortRef.current?.abort?.(); } catch {}
  }

  sendRef.current = send;
  async function send(customText) {
    const content = (customText ?? text).trim();
    if ((!content && !attachments.length) || busy) return;
    setVoiceStatus('');
    setText(''); draftRef.current = '';
    const requestText = content || 'Hãy phân tích nội dung các tệp đính kèm và trả lời bằng tiếng Việt.';
    setLastPrompt(content || 'Hãy phân tích lại các tệp đính kèm đã gửi.');
    setBusy(true);
    const fileMeta = attachments.map(item => ({ name: item.file.name, type: item.file.type || 'file', size: item.file.size }));
    const userText = content || 'Đã gửi tệp đính kèm.';
    const next = [...messages, { role: 'user', text: userText, attachments: fileMeta }];
    setMessages([...next, { role: 'assistant', text: 'Đang suy nghĩ kỹ và kiểm tra ngữ cảnh…', loading: true }]);
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
          geminiModel: selectedProvider === 'gemini' ? (selectedModel || 'gemini-3.5-flash-lite') : 'gemini-3.5-flash-lite'
        }, 'POST', controller?.signal);
        setAttachments([]);
        setFileNotice('');
      } else {
        data = await apiJSON('/api/multi-ai/chat', {
          message: requestText, history: next.slice(-20), provider: selectedProvider,
          model: selectedModel, council, answerStyle
        }, 'POST', controller?.signal);
      }
      const answer = data.reply || data.text || 'AI chưa trả về nội dung.';
      setMessages([...next, { role: 'assistant', text: answer, meta: data.label || 'Đặng Năm AI' }]);
      saveHistory('AI Chat', `${userText}: ${answer.slice(0, 140)}...`);
    } catch (e) {
      if (e.name === 'AbortError') {
        setMessages([...next, { role: 'assistant', text: 'Đã dừng phản hồi.' }]);
      } else {
        if (content) { draftRef.current = content; setText(current => current || content); }
        const freeModeError = /chế độ chỉ dùng model API miễn phí|tránh phát sinh phí/i.test(e.message || '');
        const extra = freeModeError ? '' : '\n\nNếu gửi ảnh/file, server cần có Gemini API key; bạn cũng có thể kiểm tra cấu hình ở AI Keys.';
        setMessages([...next, { role: 'assistant', text: `⚠️ ${e.message}${extra}` }]);
      }
    } finally {
      if (requestAbortRef.current === controller) requestAbortRef.current = null;
      setBusy(false);
    }
  }

  function copy(t) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(t);
    }
  }

  function cleanMarkdownForSpeech(raw = '') {
    return String(raw || '')
      .replace(/```[\s\S]*?```/g, ' đoạn mã ')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/#{1,6}\s+/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
      .replace(/^>\s+/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/\n+/g, ' ')
      .trim();
  }

  function toggleSpeak(textToSpeak, id = 'header') {
    if (speakingId === id) {
      try { speechSynthesis.cancel(); } catch {}
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
      try { speechSynthesis.cancel(); } catch {}
      setSpeakingId(null);
    }
  }

  const isTouchDevice = typeof window !== 'undefined' && (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));

  const providerGroupLabel = p => `${p.label}${p.freeOnlyBlocked ? ' · tắt để tránh phí' : p.configured ? '' : ' · chưa cấu hình'}`;
  const providerModelOptions = providers.map(p => ({
    ...p,
    modelOptions: Array.from(new Set([...(p.models || []), p.model].filter(Boolean)))
  }));

  const chatHistoryList = (readJSON('synam_history', [])).filter(h => h.type === 'AI Chat');

  return <section className="chat-layout">
    {historyOpen && <div className="history-drawer-overlay" onClick={() => setHistoryOpen(false)}>
      <div className="history-drawer" onClick={e=>e.stopPropagation()}>
        <div className="drawer-head"><h3>🕒 Lịch sử Chat AI</h3><button type="button" onClick={()=>setHistoryOpen(false)}>✕</button></div>
        <div className="drawer-body">
          {chatHistoryList.map((h, i) => {
            const previewTitle = h.content.split(':')[0] || h.content;
            return (
              <div key={i} className="drawer-item" onClick={() => { setText(previewTitle.trim()); setHistoryOpen(false); }}>
                <div style={{fontWeight: '700', color: '#ffe27a', marginBottom: '4px'}}>💬 {previewTitle.slice(0, 70)}</div>
                <div style={{fontSize: '12px', opacity: 0.82, lineHeight: '1.35'}}>{h.content.slice(0, 140)}</div>
                <small style={{opacity: 0.55, marginTop: '4px', display: 'block'}}>{h.at}</small>
              </div>
            );
          })}
          {chatHistoryList.length === 0 && <p style={{opacity: 0.5, textAlign: 'center', padding: '24px 0'}}>Chưa có lịch sử chat.</p>}
        </div>
      </div>
    </div>}

    <aside className="chat-side premium-panel">
      <h2>🧠 AI Router</h2>
      <p>Auto chọn provider có key. Ưu tiên nhanh, chính xác, không lộ model.</p>
      <select value={modelChoice} onChange={e=>setModelChoice(e.target.value)}>
        <option value="auto">Auto Router</option>
        {providerModelOptions.map(p => <optgroup key={p.id} label={providerGroupLabel(p)} disabled={!p.configured}>{p.modelOptions.map(model => <option key={`${p.id}:${model}`} value={`${p.id}::${model}`}>{model}</option>)}</optgroup>)}
      </select>
      <select value={answerStyle} onChange={e=>setAnswerStyle(e.target.value)} aria-label="Độ chi tiết câu trả lời">
        <option value="detailed">Chi tiết chuyên nghiệp</option>
        <option value="expert">Chuyên gia sâu</option>
        <option value="concise">Ngắn gọn</option>
      </select>
      <label className="switch"><input type="checkbox" checked={council} onChange={e=>setCouncil(e.target.checked)} /> Hội Đồng AI</label>
      <button onClick={handleNewChat}>＋ Chat mới</button>
      <div className="mini-list">{providers.map(p => <span className={p.configured?'ok':''} key={p.id}>{p.configured?'●':'○'} {p.label}{p.freeOnlyBlocked?' (tắt để tránh phí)':''}</span>)}</div>
    </aside>

    <div className="chat-main premium-panel">
      <div className="chat-head">
        <button type="button" className="chat-icon-btn" onClick={() => setHistoryOpen(true)}>🕒 Lịch sử</button>
        <button type="button" className="chat-icon-btn" onClick={handleNewChat}>➕ Mới</button>
        <button type="button" className="chat-icon-btn" onClick={() => toggleSpeak(messages.filter(m=>m.role==='assistant').at(-1)?.text || '', 'header')}>
          {speakingId === 'header' ? '⏹️ Dừng' : '🔊 Đọc'}
        </button>
        <button type="button" className={`chat-icon-btn ${optionsOpen ? 'active' : ''}`} onClick={() => setOptionsOpen(!optionsOpen)}>
          ⚙️ Tùy chọn {optionsOpen ? '▲' : '▼'}
        </button>
      </div>

      {optionsOpen && (
        <div className="chat-mobile-options-tray">
          <div className="chat-opt-group">
            <label htmlFor="chat-mobile-model">🤖 Model AI</label>
            <select id="chat-mobile-model" value={modelChoice} onChange={e=>setModelChoice(e.target.value)}>
              <option value="auto">Auto Router (Tối ưu)</option>
              {providerModelOptions.map(p => (
                <optgroup key={p.id} label={providerGroupLabel(p)} disabled={!p.configured}>
                  {p.modelOptions.map(model => (
                    <option key={`${p.id}:${model}`} value={`${p.id}::${model}`}>{model}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="chat-opt-group">
            <label htmlFor="chat-mobile-style">📝 Độ dài</label>
            <select id="chat-mobile-style" value={answerStyle} onChange={e=>setAnswerStyle(e.target.value)}>
              <option value="detailed">Chi tiết chuyên nghiệp</option>
              <option value="expert">Chuyên gia sâu</option>
              <option value="concise">Ngắn gọn</option>
            </select>
          </div>
          <div className="chat-opt-group" style={{alignSelf: 'center'}}>
            <label className="chat-council-toggle" style={{display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', color: '#ffe27a'}}>
              <input type="checkbox" checked={council} onChange={e=>setCouncil(e.target.checked)} />
              <span>🏛️ Hội Đồng AI</span>
            </label>
          </div>
        </div>
      )}

      <div className="chat-box" ref={boxRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role} ${m.loading?'loading':''}`}>
            <div className="avatar">{m.role==='user'?'👤':'✦'}</div>
            <div className="bubble-body">
              {m.attachments?.length > 0 && (
                <div className="chat-message-files">
                  {m.attachments.map((file, index) => <span key={`${file.name}-${index}`}>📎 {file.name}</span>)}
                </div>
              )}
              <div dangerouslySetInnerHTML={{__html: markdownLite(m.text)}} />
              {m.role==='assistant' && !m.loading && (
                <div className="msg-actions">
                  <button type="button" onClick={()=>copy(m.text)}>Sao chép</button>
                  <button type="button" onClick={()=>toggleSpeak(m.text, `msg-${i}`)}>
                    {speakingId === `msg-${i}` ? 'Dừng đọc' : 'Đọc'}
                  </button>
                  <button type="button" onClick={()=>send(lastPrompt)}>Thử lại</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="chat-composer-panel">
        <input ref={imageInputRef} className="chat-hidden-input" type="file" accept="image/*" multiple onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />
        <input ref={cameraInputRef} className="chat-hidden-input" type="file" accept="image/*" capture="environment" onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />
        <input ref={fileInputRef} className="chat-hidden-input" type="file" accept="image/*,.pdf,.txt,.md,.csv,.json,.xml,.html,.js,.ts,.py,.log,.css,.doc,.docx,.xls,.xlsx" multiple onChange={e=>{addFiles(e.target.files);e.target.value='';setShowUploads(false);}} />

        {attachments.length > 0 && (
          <div className="chat-attachment-list">
            {attachments.map(item => (
              <span className="chat-file-chip" key={item.id}>
                {item.file.type.startsWith('image/')?'🖼️':'📄'} {item.file.name}
                <button type="button" aria-label={`Xóa ${item.file.name}`} title={`Xóa ${item.file.name}`} onClick={()=>removeFile(item.id)}>✕</button>
              </span>
            ))}
          </div>
        )}
        {fileNotice && <div className="chat-file-notice" role="status">{fileNotice}</div>}
        {attachments.length > 0 && modelChoice !== 'auto' && !modelChoice.startsWith('gemini::') && (
          <div className="chat-attachment-note">Ảnh/file được xử lý tối ưu qua Gemini đa phương thức.</div>
        )}
        {voiceStatus && <div className="chat-voice-status" role="status">{voiceStatus}</div>}

        <div className="composer chat-pill-composer">
          <div className="chat-plus-menu-container">
            <button
              type="button"
              className={`chat-plus-btn ${showUploads ? 'active' : ''}`}
              onClick={() => setShowUploads(!showUploads)}
              title="Đính kèm"
              aria-label="Đính kèm tệp hoặc chụp ảnh"
              aria-expanded={showUploads}
            >
              +
            </button>
            {showUploads && (
              <>
                <div className="chat-plus-backdrop" onClick={() => setShowUploads(false)} />
                <div className="chat-plus-popover" role="menu">
                  <button
                    type="button"
                    className="chat-popover-item"
                    onClick={() => { imageInputRef.current?.click(); setShowUploads(false); }}
                  >
                    <span className="popover-icon">🖼️</span>
                    <span>Tải ảnh</span>
                  </button>
                  <button
                    type="button"
                    className="chat-popover-item"
                    onClick={() => { cameraInputRef.current?.click(); setShowUploads(false); }}
                  >
                    <span className="popover-icon">📷</span>
                    <span>Chụp ảnh</span>
                  </button>
                  <button
                    type="button"
                    className="chat-popover-item"
                    onClick={() => { fileInputRef.current?.click(); setShowUploads(false); }}
                  >
                    <span className="popover-icon">📎</span>
                    <span>Tải file</span>
                  </button>
                  {attachments.length > 0 && (
                    <button
                      type="button"
                      className="chat-popover-item is-clear"
                      onClick={() => { setAttachments([]); setFileNotice(''); setShowUploads(false); }}
                    >
                      <span className="popover-icon">🗑️</span>
                      <span>Xóa hết file</span>
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="chat-input-wrapper">
            <textarea
              value={text}
              onChange={e => { draftRef.current = e.target.value; setText(e.target.value); }}
              onKeyDown={e => {
                if (!isTouchDevice && e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Hỏi AI..."
              aria-label="Tin nhắn gửi AI"
              rows="1"
            />
          </div>

          <div className="chat-actions-wrapper">
            {listening ? (
              <button type="button" className="chat-mic-btn is-listening" aria-label="Dừng ghi âm" title="Dừng ghi âm" onClick={stopDictation}>🛑</button>
            ) : (
              <button type="button" className="chat-mic-btn" aria-label="Nhập bằng giọng nói" title="Nhập bằng giọng nói" disabled={busy} onClick={startDictation}>🎤</button>
            )}
            {text.trim() || attachments.length > 0 || busy ? (
              <button
                type="button"
                className={`pill-send-btn ${busy?'is-stop':''}`}
                aria-label={busy?'Dừng phản hồi':'Gửi tin nhắn'}
                title={busy?'Dừng phản hồi':'Gửi tin nhắn'}
                onClick={busy ? stopResponse : () => send()}
              >
                {busy ? '🛑' : '➤'}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  </section>;
}

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyD7S-MSbrQLzvfgh0PPgyNtZzDpYntIF0k",
  authDomain: "dangnam-tuvi.firebaseapp.com",
  projectId: "dangnam-tuvi",
  storageBucket: "dangnam-tuvi.firebasestorage.app",
  messagingSenderId: "183878060405",
  appId: "1:183878060405:web:c40387b975b1bf077d2b3c",
  measurementId: "G-RJ2LBTXYSJ"
};

function getMobileFirebase() {
  if (typeof window === 'undefined' || !window.firebase) {
    throw new Error('Firebase SDK chưa được tải trên trình duyệt.');
  }
  if (!window.firebase.apps || !window.firebase.apps.length) {
    window.firebase.initializeApp(FIREBASE_CONFIG);
  }
  return window.firebase;
}

function Settings({ providers, reload }) {
  const [keys, setKeys] = useState({});
  const [user, setUser] = useState(() => readJSON('synam_user', null));
  const [account, setAccount] = useState({ name: user?.name || '', email: user?.email || '', password: '' });
  const [socialLoading, setSocialLoading] = useState(false);

  async function handleSocialLogin(provider) {
    if (socialLoading) return;
    setSocialLoading(true);
    try {
      const fb = getMobileFirebase();
      const auth = fb.auth();
      auth.useDeviceLanguage();
      const authProvider = provider === 'facebook'
        ? new fb.auth.FacebookAuthProvider()
        : new fb.auth.GoogleAuthProvider();
      
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
      setAccount({ name: '', email: '', password: '' });
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
      setAccount({ name: data.user.name || '', email: data.user.email || '', password: '' });
      alert(action === 'register' ? 'Đăng ký thành công.' : 'Đăng nhập thành công.');
      await reload();
    } catch (e) { alert(e.message); }
  }
  async function logout() {
    try { await apiJSON('/api/auth/logout', {}); } catch {}
    localStorage.removeItem('synam_user');
    localStorage.removeItem('synam_token');
    setUser(null);
    setAccount({ name: '', email: '', password: '' });
    await reload();
  }
  async function save() {
    try { await apiJSON('/api/ai/user-keys', { keys }); await reload(); alert('Đã lưu AI keys.'); } catch(e) { alert(e.message); }
  }
  return <section className="premium-panel settings">
    <h2>👤 Quản lý Tài khoản & AI Keys</h2>
    <div className="account-card" style={{ marginBottom: '20px' }}>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', padding: '12px', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.12)' }}>
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid #ffd700', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>👤</div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#ffe6ad' }}>{user.name || 'Người dùng'}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
            <div style={{ fontSize: '11px', color: '#4ade80', marginTop: '2px' }}>Gói: {user.plan || 'Free'} · {(user.providers || []).map(p => p === 'google' ? 'Google' : p === 'facebook' ? 'Facebook' : p).join(', ') || 'Email'}</div>
          </div>
          <button type="button" onClick={logout} style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#ff8888', borderRadius: '10px' }}>Đăng xuất</button>
        </div>
      ) : <>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
          <button type="button" disabled={socialLoading} onClick={() => handleSocialLogin('google')} style={{ background: 'linear-gradient(135deg,rgba(255,74,74,.92),rgba(255,180,42,.78))', border: '1px solid rgba(255,255,255,.18)', borderRadius: '16px', color: '#fff', fontWeight: 900, textShadow: '0 1px 3px rgba(0,0,0,0.3)', opacity: socialLoading ? 0.6 : 1 }}>🔴 {socialLoading ? 'Đang mở...' : 'Google'}</button>
          <button type="button" disabled={socialLoading} onClick={() => handleSocialLogin('facebook')} style={{ background: 'linear-gradient(135deg,rgba(24,119,242,.92),rgba(68,72,255,.82))', border: '1px solid rgba(255,255,255,.18)', borderRadius: '16px', color: '#fff', fontWeight: 900, textShadow: '0 1px 3px rgba(0,0,0,0.3)', opacity: socialLoading ? 0.6 : 1 }}>🔵 {socialLoading ? 'Đang mở...' : 'Facebook'}</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0', fontSize: '11px', textTransform: 'uppercase', opacity: 0.6 }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)' }}></div>
          <span>hoặc dùng email</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)' }}></div>
        </div>
        <input value={account.name} onChange={e=>setAccount(a=>({...a,name:e.target.value}))} placeholder="Tên hiển thị (để đăng ký)"/>
        <input value={account.email} onChange={e=>setAccount(a=>({...a,email:e.target.value}))} type="email" placeholder="Email"/>
        <input value={account.password} onChange={e=>setAccount(a=>({...a,password:e.target.value}))} type="password" placeholder="Mật khẩu từ 6 ký tự"/>
        <div className="account-actions">
          <button className="primary" type="button" onClick={()=>submitAccount('register')}>Đăng ký</button>
          <button type="button" onClick={()=>submitAccount('login')}>Đăng nhập</button>
        </div>
      </>}
    </div>
    <h2>⚙️ Multi-AI API Keys</h2>
    <p>Nhập key cá nhân hoặc dùng key mặc định từ server.</p>
    <div className="key-grid">{providers.map(p => <label key={p.id}><span>{p.label} {p.configured?'✅':'○'}</span><input type="password" placeholder={p.maskedKey || p.keyEnv || 'API key'} onChange={e=>setKeys(k=>({...k,[p.id]:e.target.value}))}/><small>{p.model}</small></label>)}</div>
    <button className="primary" onClick={save}>💾 Lưu keys</button>
  </section>;
}

function VisionTool({ mode, title, icon }) {
  const isFace = mode === 'face';
  const defaultHint = isFace
    ? '* Mẹo: Chụp chính diện khuôn mặt, rõ 5 ngũ quan (trán, mắt, mũi, miệng, cằm), đủ sáng, không đeo kính râm và không che trán để xem tướng chuẩn xác nhất.'
    : '* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.';

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
      } catch(e){}
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
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
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
      const payload = isFace
        ? {
            mode: 'face',
            image: targetImage,
            faceImage: targetImage,
            facePart: focusPart,
            faceNote: note,
            geminiModel: 'gemini-3.5-flash-lite',
            clientTime: new Date().toLocaleString('vi-VN')
          }
        : {
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
      const fb = window.MysticEngine
        ? (mode === 'palm' ? window.MysticEngine.Palmistry.analyze(note, '') : window.MysticEngine.Face.analyze(note, ''))
        : (mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt');
      const fallbackMsg = fb + '\n\n*(Lưu ý: Đang hiển thị kết quả phân tích offline do máy chủ: ' + (e.message || 'Mất kết nối') + ')*';
      setResult(fallbackMsg);
      saveHistory(title + ' local', fallbackMsg);
    } finally {
      setLoading(false);
    }
  }

  const faceOptions = [
    'Tổng quan ngũ quan & thần thái',
    'Trán (Cung Quan Lộc, tiền vận & trí tuệ)',
    'Mắt (Thần khí, tâm tư & năng lượng)',
    'Mũi (Cung Tài Bạch, tài vận & ý chí)',
    'Miệng & Cằm (Cung Điền Trạch, hậu vận & phúc đức)'
  ];

  const palmOptions = [
    'Tổng quan các đường tay',
    'Sinh đạo (Sức khỏe, sức sống & biến cố)',
    'Trí đạo (Tư duy, quyết định & tài năng)',
    'Tâm đạo (Tình cảm, hôn nhân & cảm xúc)',
    'Sự nghiệp (Thời vận & bước ngoặt thành công)'
  ];

  const options = isFace ? faceOptions : palmOptions;

  return (
    <section className="tool-grid">
      <div className="premium-panel vision-tool-container">
        <h2>{icon} {title}</h2>
        <p style={{fontSize:'0.85em', color:'#ffd700', margin:'0 0 10px', fontStyle:'italic'}}>{defaultHint}</p>

        {/* Input ẩn để kích hoạt camera máy và bộ chọn tệp */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={handleFileChange}
        />
        <input
          ref={nativeCameraInputRef}
          type="file"
          accept="image/*"
          capture={isFace ? 'user' : 'environment'}
          style={{display: 'none'}}
          onChange={handleNativeCamera}
        />

        {/* Action bar: Các nút chụp ảnh và tải ảnh */}
        {!isLiveCamera && (
          <div className="vision-actions">
            <button
              type="button"
              className="vision-action-btn primary-camera"
              onClick={() => startCamera(cameraFacing)}
            >
              📸 Chụp trực tiếp
            </button>
            <button
              type="button"
              className="vision-action-btn"
              onClick={() => nativeCameraInputRef.current && nativeCameraInputRef.current.click()}
            >
              📷 Chụp bằng máy
            </button>
            <button
              type="button"
              className="vision-action-btn"
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              📁 Tải ảnh có sẵn
            </button>
          </div>
        )}

        {/* Live Camera Viewfinder */}
        {isLiveCamera && (
          <div className="vision-camera-box">
            <div style={{position: 'relative'}}>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                className={`vision-video ${cameraFacing === 'user' ? 'mirror' : ''}`}
              />
              {isFace && (
                <div className="vision-face-guide">
                  <div className="vision-face-oval"></div>
                  <span className="vision-guide-text">Căn khuôn mặt vào giữa khung</span>
                </div>
              )}
            </div>

            {cameraError && (
              <div style={{padding: '10px', color: '#ff7b7b', fontSize: '13px', background: 'rgba(255,0,0,0.15)', textAlign: 'center'}}>
                {cameraError}
              </div>
            )}

            <div className="vision-cam-ctrls">
              <button
                type="button"
                className="vision-action-btn"
                style={{padding: '8px 12px', fontSize: '12px'}}
                onClick={switchCamera}
                title="Đổi camera trước/sau"
              >
                🔄 Đổi cam
              </button>

              <button
                type="button"
                className="vision-snap-btn"
                onClick={snapPhoto}
                title="Bấm để chụp ảnh"
              >
                📸
              </button>

              <button
                type="button"
                className="vision-action-btn"
                style={{padding: '8px 12px', fontSize: '12px', background: 'rgba(255,50,50,0.25)', borderColor: 'rgba(255,80,80,0.4)'}}
                onClick={closeCamera}
                title="Hủy chụp"
              >
                ❌ Đóng
              </button>
            </div>
          </div>
        )}

        {/* Image Preview & Scanner */}
        {previewUrl && !isLiveCamera && (
          <div className="vision-preview-card">
            <div className="vision-preview-img-wrap">
              {loading && <div className="vision-scan-bar"></div>}
              <img src={previewUrl} alt="Ảnh xem tướng" className="vision-preview-img" />
            </div>
            <div className="vision-preview-status">
              <span>{loading ? '🔍 Đang quét nhận diện...' : '✅ Ảnh đã sẵn sàng'}</span>
              <div style={{display: 'flex', gap: '6px'}}>
                <button
                  type="button"
                  className="vision-retake-btn"
                  onClick={() => startCamera(cameraFacing)}
                >
                  📸 Chụp lại
                </button>
                <button
                  type="button"
                  className="vision-retake-btn"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  📁 Đổi ảnh
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tùy chọn xem và ghi chú */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px'}}>
          <label style={{fontSize: '13px', color: '#c3d9ff'}}>
            Bộ phận muốn xem kỹ:
            <select
              value={focusPart}
              onChange={e => setFocusPart(e.target.value)}
              style={{width: '100%', marginTop: '4px', padding: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.15)'}}
            >
              {options.map((opt, i) => (
                <option key={i} value={opt} style={{background: '#071534', color: '#fff'}}>{opt}</option>
              ))}
            </select>
          </label>

          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder={isFace ? "Ghi chú thêm nếu muốn (Ví dụ: Mình muốn xem kỹ cung Tài Bạch, sự nghiệp năm nay...)" : "Ghi chú thêm nếu ảnh chưa rõ..."}
            style={{width: '100%', minHeight: '60px', padding: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', resize: 'none'}}
          />

          <label className="vision-auto-toggle">
            <input
              type="checkbox"
              checked={autoAnalyze}
              onChange={e => setAutoAnalyze(e.target.checked)}
            />
            <span>⚡ Tự động phân tích xem ngay sau khi chụp ảnh</span>
          </label>
        </div>

        <button
          className="primary"
          style={{width: '100%', marginTop: '6px', height: '46px', fontSize: '15px', fontWeight: 'bold'}}
          disabled={loading || (!imageDataUrl && !note.trim())}
          onClick={() => runAnalysis()}
        >
          {loading ? '⌛ AI đang phân tích trực tiếp...' : '✨ Xem tướng trực tiếp ngay'}
        </button>
      </div>
      <Result text={result}/>
    </section>
  );
}

function LoveTool() {
  const [a,setA]=useState(''); const [b,setB]=useState(''); const [out,setOut]=useState('Nhập thông tin hai người để luận giải.');
  async function run(){ setOut('Đang tính bằng code và AI luận giải...'); try{const d=await apiJSON('/api/love-ai',{ geminiModel: 'gemini-3.5-flash-lite', persons:[{name:'Người 1',birthDate:a},{name:'Người 2',birthDate:b}]}); setOut(d.text||d.reply||'Không có kết quả'); saveHistory('Tình duyên', d.text||d.reply||'Không có kết quả');}catch(e){setOut('⚠️ '+e.message)} }
  return <section className="tool-grid"><div className="premium-panel"><h2>💞 Tình duyên</h2><input value={a} onChange={e=>setA(e.target.value)} placeholder="Ngày sinh người 1: 01/01/2000"/><input value={b} onChange={e=>setB(e.target.value)} placeholder="Ngày sinh người 2: 02/02/2004"/><button className="primary" onClick={run}>Luận giải</button></div><Result text={out}/></section>;
}
function TuviTool() { const [name,setName]=useState(''); const [dob,setDob]=useState(''); const [time,setTime]=useState(''); const [gender,setGender]=useState('Nam'); const [out,setOut]=useState('Nhập thông tin để luận giải.'); async function run(){ setOut('Đang tải...'); try{const d=await apiJSON('/api/mystic-ai',{name,birthDate:dob,birthTime:time,gender, geminiModel: 'gemini-3.5-flash-lite', localReport: window.MysticEngine ? window.MysticEngine.Numerology.analyze(name, dob) : '' }); setOut(d.text||d.reply||'Không có kết quả'); saveHistory('Tình duyên', d.text||d.reply||'Không có kết quả');}catch(e){setOut(window.MysticEngine ? window.MysticEngine.Numerology.analyze(name, dob) : '⚠️ Lỗi: '+e.message)} } return <section className="tool-grid"><div className="premium-panel"><h2>📜 Tử vi / Thần số</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Họ và tên"/><input value={dob} onChange={e=>setDob(e.target.value)} type="date"/><input value={time} onChange={e=>setTime(e.target.value)} type="time"/><select value={gender} onChange={e=>setGender(e.target.value)}><option>Nam</option><option>Nữ</option></select><button className="primary" onClick={run}>Luận giải</button></div><Result text={out}/></section>; }
  function SimpleTool({kind,title,icon,preset='',placeholder='Bạn muốn hỏi điều gì?'}){const [q,setQ]=useState('');const [out,setOut]=useState('Nhập nội dung rồi bấm luận giải.');async function run(){setOut('AI đang luận giải...');try{const d=await apiJSON('/api/multi-ai/chat',{message:`${preset||title} ${q}`, provider:'auto', model:'gemini-3.5-flash-lite'});setOut(d.text||d.reply||'Không có kết quả'); saveHistory(title, d.text||d.reply||'Không có kết quả');}catch(e){setOut('⚠️ '+e.message)}}return <section className="tool-grid"><div className="premium-panel"><h2>{icon} {title}</h2><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder}/><button className="primary" onClick={run}>Luận giải</button></div><Result text={out}/></section>}

function AstrologyTool(){
  const zodiacs = [
    {id:'Bạch Dương', icon:'♈', date:'21/03 - 19/04'},
    {id:'Kim Ngưu', icon:'♉', date:'20/04 - 20/05'},
    {id:'Song Tử', icon:'♊', date:'21/05 - 21/06'},
    {id:'Cự Giải', icon:'♋', date:'22/06 - 22/07'},
    {id:'Sư Tử', icon:'♌', date:'23/07 - 22/08'},
    {id:'Xử Nữ', icon:'♍', date:'23/08 - 22/09'},
    {id:'Thiên Bình', icon:'♎', date:'23/09 - 23/10'},
    {id:'Thiên Yết', icon:'♏', date:'24/10 - 22/11'},
    {id:'Nhân Mã', icon:'♐', date:'23/11 - 21/12'},
    {id:'Ma Kết', icon:'♑', date:'22/12 - 19/01'},
    {id:'Bảo Bình', icon:'♒', date:'20/01 - 18/02'},
    {id:'Song Ngư', icon:'♓', date:'19/02 - 20/03'}
  ];
  const [selected, setSelected] = useState('');
  const [q,setQ] = useState('');
  const [out,setOut] = useState('Chọn cung hoàng đạo và nhập câu hỏi.');
  async function run(){
    if(!selected) return setOut('⚠️ Vui lòng chọn cung hoàng đạo của bạn.');
    setOut('AI đang luận giải...');
    try{
      const d=await apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-3.5-flash-lite',message:`Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau: Cung ${selected}. Câu hỏi: ${q}`});
      setOut(d.text||d.reply||'Không có kết quả'); saveHistory('Tình duyên', d.text||d.reply||'Không có kết quả');
    }catch(e){
      setOut('⚠️ '+e.message);
    }
  }
  return <section className="tool-grid">
    <div className="premium-panel">
      <h2>🪐 Chiêm tinh</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'8px',marginBottom:'15px'}}>
        {zodiacs.map(z => (
          <div key={z.id} onClick={()=>setSelected(z.id)} style={{background: selected===z.id?'rgba(255,215,0,0.2)':'rgba(255,255,255,0.05)', border: selected===z.id?'1px solid #ffd700':'1px solid transparent', borderRadius:'8px', padding:'10px 5px', textAlign:'center', cursor:'pointer'}}>
            <div style={{fontSize:'24px'}}>{z.icon}</div>
            <div style={{fontSize:'12px', fontWeight:'bold', marginTop:'4px', color:'#fff'}}>{z.id}</div>
            <div style={{fontSize:'10px', color:'#aaa', marginTop:'2px'}}>{z.date}</div>
          </div>
        ))}
      </div>
      <textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Tình duyên/công việc tháng này thế nào?"/>
      <button className="primary" onClick={run}>✨ Xem chiêm tinh</button>
    </div>
    <Result text={out}/>
  </section>;
}
function FengShuiTool(){return <SimpleTool kind="fengshui" title="Phong thủy" icon="☯️" preset="Phân tích phong thủy thực tế, màu hợp, hướng hợp, bố trí không gian theo thông tin sau:" placeholder="Ví dụ: sinh năm 1995, muốn xem hướng bàn làm việc và màu hợp."/>}
function TarotTool(){
  const cards=[
    {name: 'The Fool - Khởi đầu', img: 'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg'},
    {name: 'The Magician - Chủ động', img: 'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg'},
    {name: 'The High Priestess - Trực giác', img: 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg'},
    {name: 'The Lovers - Tình cảm', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg'},
    {name: 'The Chariot - Quyết đoán', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg'},
    {name: 'Strength - Bình tĩnh', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg'},
    {name: 'The Hermit - Suy ngẫm', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg'},
    {name: 'Wheel of Fortune - Vận trình', img: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg'},
    {name: 'The Star - Hy vọng', img: 'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg'},
    {name: 'The Sun - Tích cực', img: 'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg'}
  ];
  const [q,setQ]=useState(''); const [picked,setPicked]=useState([]); const [out,setOut]=useState('Nhập câu hỏi rồi bấm trải bài. Bạn có thể bấm Đổi bài để bốc lại.');
  async function draw(){
    const deck=[...cards].sort(()=>Math.random()-.5).slice(0,3); setPicked(deck); setOut('AI đang luận 3 lá bài...');
    const deckNames = deck.map(c=>c.name);
    try{
      const d=await apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-3.5-flash-lite',message:`Xem bài tarot tham khảo. Câu hỏi: ${q}. Ba lá: ${deckNames.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.`});
      setOut(d.text||d.reply||deckNames.join('\n'));
    }catch(e){
      setOut(`### 🃏 Ba lá bài\n- ${deckNames.join('\n- ')}\n\nLời khuyên: xem như tham khảo để bình tĩnh lựa chọn, không quyết định thay thực tế.`);
    }
  }
  return <section className="tool-grid"><div className="premium-panel"><h2>🃏 Xem bài Tarot</h2><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Bạn muốn hỏi điều gì?"/><button className="primary" onClick={draw}>{picked.length?'🔄 Đổi bài':'🃏 Trải bài Tarot'}</button><div className="tarot-cards" style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'15px'}}>{picked.map(c=><div key={c.name} style={{flex:1,textAlign:'center'}}><img src={c.img} style={{width:'100%',borderRadius:'8px',boxShadow:'0 4px 8px rgba(0,0,0,0.5)'}}/><div style={{fontSize:'12px',marginTop:'8px',color:'#ffd700'}}>{c.name}</div></div>)}</div></div><Result text={out}/></section>
}
function NumerologyTool(){
  const [name,setName]=useState(''); const [birth,setBirth]=useState(''); const [out,setOut]=useState('Nhập họ tên và ngày sinh để tính thần số học.');
  function sumDigits(v){let n=String(v).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0); while(n>9 && ![11,22,33].includes(n)) n=String(n).split('').reduce((a,b)=>a+Number(b),0); return n||0}
  async function run(){const life=sumDigits(birth); setOut('Đang tính local và AI luận giải...'); try{const d=await apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-3.5-flash-lite',message:`Thần số học cho tên ${name||'chưa nhập'}, ngày sinh ${birth||'chưa nhập'}, số chủ đạo local là ${life}. Luận rõ tính cách, tình duyên, công việc, lời khuyên.`}); setOut(d.text||d.reply||`Số chủ đạo: ${life}`)}catch(e){setOut(`### 🔢 Kết quả local
- Họ tên: ${name||'Chưa nhập'}
- Ngày sinh: ${birth||'Chưa nhập'}
- Số chủ đạo: ${life||'Chưa đủ dữ liệu'}

Kết quả chỉ mang tính tham khảo.`)}}
  return <section className="tool-grid"><div className="premium-panel"><h2>🔢 Thần số học AI</h2><input value={name} onChange={e=>setName(e.target.value)} placeholder="Họ và tên"/><input value={birth} onChange={e=>setBirth(e.target.value)} placeholder="Ngày sinh: 01/01/2000"/><button className="primary" onClick={run}>🤖 Luận thần số học</button></div><Result text={out}/></section>
}

function Result({text}){return <article className="premium-panel result"><h2>📌 Kết quả</h2><div dangerouslySetInnerHTML={{__html: markdownLite(text)}} /></article>}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}

function DeepTool() {
  const [result, setResult] = useState('Điền thông tin và bấm phân tích để bắt đầu.');
  const [form, setForm] = useState({ name: '', birth: '', ask: '', focus: 'Tổng quan cuộc đời & Vận hạn' });
  const [busy, setBusy] = useState(false);
  
  async function run() {
    if (!form.ask) return alert('Vui lòng nhập vấn đề cần hỏi.');
    setBusy(true);
    setResult('AI đang tổng hợp dữ liệu đa lớp và phân tích sâu...');
    try {
      const data = await apiJSON('/api/deep-ai', { ...form, geminiModel: 'gemini-3.5-flash-lite' });
      setResult(data.text || data.reply || 'Không có kết quả trả về.');
    } catch(e) {
      setResult('Lỗi: ' + e.message);
    } finally { setBusy(false); }
  }
  
  return <section className="tool-grid">
    <div className="premium-panel">
      <h2>🧠 AI Phân Tích Chuyên Sâu PRO</h2>
      <p style={{fontSize: '13px', opacity: 0.8, marginBottom: '14px'}}>Cung cấp thông tin chi tiết nhất để AI tổng hợp đa lớp và luận giải chuyên sâu.</p>
      <input placeholder="Họ tên (vd: Nguyễn Văn A)" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
      <input type="date" value={form.birth} onChange={e=>setForm({...form, birth: e.target.value})} />
      <textarea placeholder="Trình bày rõ vấn đề bạn đang gặp phải hoặc điều muốn hỏi thật chi tiết..." value={form.ask} onChange={e=>setForm({...form, ask: e.target.value})} style={{height: '100px'}} />
      <select value={form.focus} onChange={e=>setForm({...form, focus: e.target.value})}>
        <option>Tổng quan cuộc đời & Vận hạn</option>
        <option>Công danh sự nghiệp & Tài lộc</option>
        <option>Tình duyên & Hôn nhân</option>
        <option>Phân tích tâm lý & Lời khuyên</option>
      </select>
      <button className="primary" onClick={run} disabled={busy}>{busy ? 'Đang xử lý...' : '✦ Bắt Đầu Phân Tích'}</button>
    </div>
    <Result text={result}/>
  </section>;
}



