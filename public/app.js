
let currentChatAbortController = null;

const CHAT_PERSONAS = {
  tuvi: "Bạn là Đại Sư Tử Vi Đặng Năm, chuyên gia thẩm định tử vi đẩu số, an sao, hóa giải vận hạn và tướng pháp. Luận giải sâu sắc, thấu triệt, đĩnh đạc, kết hợp hài hòa giữa thuật số cổ truyền và giải pháp thực tế.",
  phongthuy: "Bạn là Chuyên Gia Phong Thủy Đặng Năm, am tường bát trạch, huyền không phi tinh, loan đầu, ngũ hành sinh khắc. Luận giải chi tiết về phương vị, màu sắc, bố trí không gian giúp gia chủ kích tài vận, an gia hòa khí.",
  tarot: "Bạn là Tarot Reader Đặng Năm, kết nối sâu sắc với trực giác và năng lượng vũ trụ. Luận giải hình tượng biểu trưng của các lá bài Tarot, thấu hiểu tâm lý và định hướng giải pháp tích cực cho người hỏi.",
  assistant: "Bạn là Đặng Năm AI Pro - Trợ lý trí tuệ nhân tạo toàn năng, phản hồi nhanh chóng, chính xác, logic, phân tích chuyên sâu mọi dữ liệu, văn bản, mã code và câu hỏi."
};

function onChatPersonaChange() {
  const sel = document.getElementById('chatPersona');
  if (sel) {
    currentChatPersona = sel.value;
    localStorage.setItem('synam_chat_persona', currentChatPersona);
    toast(`Đã chuyển phong cách: ${sel.options[sel.selectedIndex].text}`);
  }
}

function onChatProviderChange() {
  const sel = document.getElementById('chatProvider');
  if (sel) {
    toast(`Đã chọn Engine: ${sel.options[sel.selectedIndex].text}`);
  }
}

let currentChatPersona = localStorage.getItem('synam_chat_persona') || 'assistant';
let isChatStreaming = false;
let userChatScrolledUp = false;

const routes=[['home','Trang Chủ','home'],['tuvi','Tử Vi','tuvi'],['palm','Xem Chỉ Tay','palm'],['face','Xem Tướng','face'],['astrology','Chiêm Tinh','astro'],['love','Tình Duyên','love'],['numerology','Thần Số Học','num'],['chat','AI Chat','chat'],['ai','Multi AI','deep'],['fengshui','Phong Thủy','feng'],['tarot','Bói Bài','tarot'],['history','Lịch Sử','history']];
let lastResult='';
const $=id=>document.getElementById(id);
function init(){renderTabs();renderHistory();loadAccount();loadVoicePrefs();initVietnameseVoices();startClock();loadDestinyProfileToForm();loadDestinyProfileFromCloud().then(loadDestinyProfileToForm);const firstRoute=location.hash?.replace('#/','')||(window.matchMedia&&window.matchMedia('(max-width: 760px)').matches?'chat':'home');routeTo(firstRoute,false);window.addEventListener('hashchange',()=>routeTo(location.hash.replace('#/','')||'home',false));checkGeminiStatus();loadAIProviders();setTimeout(()=>{if(window.matchMedia&&window.matchMedia('(max-width:760px)').matches&&$('chatText')){$('chatText').focus({preventScroll:true});}},600);}

const BIRTH_PROFILE_STORAGE_KEY = 'dangnam_birth_profile';
const DESTINY_STORAGE_KEY = 'synam_destiny_profile';

function getBirthProfile() {
  try {
    const raw = localStorage.getItem(BIRTH_PROFILE_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(DESTINY_STORAGE_KEY);
    if (legacy) return JSON.parse(legacy);
    const legacy2 = localStorage.getItem('dangnam_destiny_profile');
    if (legacy2) return JSON.parse(legacy2);
  } catch(e) {}
  const u = typeof getUserData === 'function' ? getUserData() : null;
  return u?.birthProfile || u?.destinyProfile || null;
}

function getDestinyProfile() {
  return getBirthProfile();
}

function updateDestinyBadgeAndThienBan(profile) {
  try { updateChatDestinyContextBar(); } catch(e) {}

  const p = profile || getBirthProfile();
  const hasProfile = Boolean(p && (p.fullName || p.name) && p.birthDate);

  const navBadge = $('destinyBadge');
  if (navBadge) {
    navBadge.textContent = hasProfile ? 'Đã lưu' : 'Chưa lưu';
    navBadge.className = 'destiny-badge-status ' + (hasProfile ? 'saved' : 'not-saved');
  }

  const boardBadge = $('tuviBoardBadge');
  if (boardBadge) {
    boardBadge.textContent = hasProfile ? 'Đã lưu' : 'Chưa lưu';
    boardBadge.className = 'destiny-badge-status ' + (hasProfile ? 'saved' : 'not-saved');
  }

  if ($('tbName')) $('tbName').textContent = (p && (p.fullName || p.name)) ? (p.fullName || p.name) : 'Chưa lưu hồ sơ';
  if ($('tbGender')) $('tbGender').textContent = (p && p.gender) ? p.gender : 'Nam';
  if ($('tbCalendar')) $('tbCalendar').textContent = (p && p.calendarType === 'lunar') ? 'Âm lịch' : 'Dương lịch';
  if ($('tbBirth')) $('tbBirth').textContent = (p && p.birthDate) ? p.birthDate : 'Chưa cập nhật';
  if ($('tbHour')) $('tbHour').textContent = (p && (p.birthHour || p.birthTime)) ? (p.birthHour || p.birthTime) : 'Giờ Ngọ (11h-13h)';
}

function openDestinyProfileModal() {
  const modal = $('destinyModal');
  if (!modal) return;
  const p = getBirthProfile() || {};
  if ($('destinyModalFullName')) $('destinyModalFullName').value = p.fullName || p.name || '';
  if ($('destinyModalGender')) $('destinyModalGender').value = p.gender || 'Nam';
  if ($('destinyModalCalendarType')) $('destinyModalCalendarType').value = p.calendarType || 'solar';
  if ($('destinyModalBirthDate')) $('destinyModalBirthDate').value = p.birthDate || '';
  if ($('destinyModalBirthHour')) $('destinyModalBirthHour').value = p.birthHour || (p.birthTime ? `Giờ Ngọ (11h00 - 12h59)` : 'Ngọ (11h00 - 12h59)');
  if ($('destinyModalBirthPlace')) $('destinyModalBirthPlace').value = p.birthPlace || '';
  modal.style.display = 'flex';
  void modal.offsetWidth;
  modal.classList.add('show');
}

function closeDestinyProfileModal() {
  const modal = $('destinyModal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => {
      if (!modal.classList.contains('show')) {
        modal.style.display = 'none';
      }
    }, 250);
  }
}

async function saveBirthProfile(profile) {
  if (!profile) return;
  try {
    localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem('dangnam_destiny_profile', JSON.stringify(profile));
  } catch(e) {}

  updateDestinyBadgeAndThienBan(profile);

  try {
    await fetch('/api/user/destiny-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('synam_token') || ''}`
      },
      body: JSON.stringify({ profile, birthProfile: profile, destinyProfile: profile })
    });
  } catch(e) {}

  try {
    if (window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.firestore) {
      const auth = window.firebase.auth();
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid) {
        const db = window.firebase.firestore();
        await db.collection('users').doc(currentUser.uid).set({
          birthProfile: profile,
          destinyProfile: profile,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        await db.collection('destiny_profiles').doc(currentUser.uid).set({
          ...profile,
          uid: currentUser.uid,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      }
    }
  } catch(err) {
    console.warn('Firestore sync note:', err.message);
  }
}

async function saveDestinyProfile(profile) {
  return saveBirthProfile(profile);
}

async function saveBirthProfileFromModal() {
  const fullName = $('destinyModalFullName')?.value?.trim();
  const birthDate = $('destinyModalBirthDate')?.value;
  if (!fullName || !birthDate) {
    toast('Vui lòng điền họ tên và ngày sinh');
    return;
  }
  const profile = {
    fullName,
    gender: $('destinyModalGender')?.value || 'Nam',
    calendarType: $('destinyModalCalendarType')?.value || 'solar',
    birthDate,
    birthHour: $('destinyModalBirthHour')?.value || 'Ngọ (11h00 - 12h59)',
    birthPlace: $('destinyModalBirthPlace')?.value?.trim() || '',
    updatedAt: new Date().toISOString()
  };

  await saveBirthProfile(profile);
  closeDestinyProfileModal();
  toast('✅ Đã lưu Hồ Sơ Bản Mệnh thành công!');
}

async function loadBirthProfileFromCloud() {
  try {
    if (window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.firestore) {
      const auth = window.firebase.auth();
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid) {
        const db = window.firebase.firestore();
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (userDoc.exists) {
          const udata = userDoc.data();
          const p = udata.birthProfile || udata.destinyProfile;
          if (p && (p.fullName || p.name)) {
            localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(p));
            localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(p));
            updateDestinyBadgeAndThienBan(p);
            return p;
          }
        }
        const doc = await db.collection('destiny_profiles').doc(currentUser.uid).get();
        if (doc.exists) {
          const cloudData = doc.data();
          if (cloudData && (cloudData.fullName || cloudData.name)) {
            localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(cloudData));
            localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(cloudData));
            updateDestinyBadgeAndThienBan(cloudData);
            return cloudData;
          }
        }
      }
    }
  } catch(e) {}

  try {
    const res = await fetch('/api/user/destiny-profile', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('synam_token') || ''}` }
    });
    const data = await res.json();
    if (data.ok && (data.profile || data.destinyProfile)) {
      const p = data.profile || data.destinyProfile;
      localStorage.setItem(BIRTH_PROFILE_STORAGE_KEY, JSON.stringify(p));
      localStorage.setItem(DESTINY_STORAGE_KEY, JSON.stringify(p));
      updateDestinyBadgeAndThienBan(p);
      return p;
    }
  } catch(e) {}

  const local = getBirthProfile();
  updateDestinyBadgeAndThienBan(local);
  return local;
}

async function loadDestinyProfileFromCloud() {
  return loadBirthProfileFromCloud();
}

function loadDestinyProfileToForm() {
  const p = getBirthProfile();
  updateDestinyBadgeAndThienBan(p);
  if (!p) return;
  if ($('name') && !$('name').value) $('name').value = p.fullName || p.name || '';
  if ($('gender') && p.gender) $('gender').value = p.gender;
  if ($('birthDate') && !$('birthDate').value) $('birthDate').value = p.birthDate || '';
  if ($('birthTime') && !$('birthTime').value) $('birthTime').value = p.birthHour || p.birthTime || '';
  if ($('calendarType') && p.calendarType) $('calendarType').value = p.calendarType;
  if ($('birthPlace') && !$('birthPlace').value) $('birthPlace').value = p.birthPlace || '';
}

async function handleSaveDestinyProfile() {
  const profile = {
    fullName: $('name')?.value?.trim() || '',
    gender: $('gender')?.value || 'Nam',
    birthDate: $('birthDate')?.value || '',
    birthHour: $('birthTime')?.value || 'Ngọ (11h00 - 12h59)',
    birthTime: $('birthTime')?.value || '',
    calendarType: $('calendarType')?.value || 'solar',
    birthPlace: $('birthPlace')?.value?.trim() || '',
    concern: $('lifeConcern')?.value?.trim() || ''
  };
  if (!profile.fullName || !profile.birthDate) {
    return toast('Vui lòng nhập họ tên và ngày sinh');
  }
  await saveBirthProfile(profile);
  toast('✅ Đã lưu Hồ Sơ Bản Mệnh thành công!');
}

function tabIcon(icon){return `<span class="holo-icon icon-${icon}"><i></i></span>`}
function renderTabs(){const html=routes.map(([id,name,ico])=>`<button class="tab-card" data-route="${id}" onclick="routeTo('${id}')">${tabIcon(ico)}<span>${name}</span></button>`).join('');$('featureTabs').innerHTML=html;$('sideLinks').innerHTML=routes.concat([['deep','AI phân tích sâu','deep'],['ai','Cài đặt Multi-AI','deep'],['account','Tài khoản','account']]).map(([id,name,ico])=>`<button class="link" onclick="routeTo('${id}');toggleMenu(false)">${tabIcon(ico)} <span>${name}</span></button>`).join('')}
function routeTo(route,push=true){
  if(!route)route='home';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const page=$('page-'+route)||$('page-home');
  page.classList.add('active');
  document.body.dataset.route=route;
  document.querySelectorAll('.tab-card').forEach(t=>t.classList.toggle('active',t.dataset.route===route));
  document.querySelectorAll('.bottom-nav button').forEach(btn=>btn.classList.remove('active'));
  document.querySelectorAll('.side-menu button.link').forEach(btn=>btn.classList.remove('active'));
  if(push) location.hash='#/'+route;
  requestAnimationFrame(()=>{
    if (route === 'chat') {
      window.scrollTo({top: 0, behavior: 'smooth'});
    } else {
      const targetTop=Math.max(0,page.getBoundingClientRect().top+window.pageYOffset-18);
      window.scrollTo({top:targetTop,behavior:'smooth'});
    }
    const scrollers=page.querySelectorAll('.chat-log,.pro-chat-log,.result-panel,.side-menu');
    scrollers.forEach(el=>{try{el.scrollTop=0}catch{}});
  });
}
function toggleMenu(open){$('sideMenu').classList.toggle('open',open);$('menuShade').classList.toggle('open',open)}

function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function parseError(e){const raw=String(e?.message||e||'Lỗi không xác định');try{const j=JSON.parse(raw);let msg=j.error||raw;if(Array.isArray(j.attempts)&&j.attempts.length){msg+='\n\nCác model đã thử:\n'+j.attempts.map(a=>`- ${a.model}: ${a.error}`).join('\n')}return msg}catch{return raw.replace(/^Error:\s*/,'')}}
function startClock(){const tick=()=>{const el=$('liveClock');if(el)el.textContent=new Date().toLocaleString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});};tick();setInterval(tick,30000)}
async function checkGeminiStatus(){const el=$('geminiStatus');if(!el)return;try{const h=await fetch('/api/health').then(r=>r.json());el.textContent=h.hasGeminiKey?'Gemini: đã cấu hình API key':'Gemini: chưa có API key';el.className=h.hasGeminiKey?'ai-status ok':'ai-status warn'}catch(e){el.textContent='Server AI: chưa kết nối';el.className='ai-status warn'}}

function getCurrentMember(){
  try{return JSON.parse(localStorage.getItem('synam_user')||'null')}catch{return null}
}
function getChatUserLabel(){
  const user=getCurrentMember();
  const name=String(user?.name||user?.email||'').trim();
  if(name) return {icon:'👤',name:name,plan:user?.plan||'Free'};
  return {icon:'👥',name:'Khách',plan:'Guest'};
}
function getChatUserRoleHtml(){
  const u=getChatUserLabel();
  const plan=u.plan && u.plan!=='Guest'?` <small>${escapeHtml(u.plan)}</small>`:'';
  return `<span class="msg-role user-role">${u.icon} ${escapeHtml(u.name)}${plan}</span>`;
}
function stopSpeaking(){
  try{speechSynthesis?.cancel?.()}catch{}
  setVoiceStatus('🔇 Đã khóa mỏ / dừng đọc',false);
  toast('Đã dừng đọc giọng AI');
}
function toggleSpeakReply(){
  const el=$('voiceReplyToggle');
  if(!el) return;
  saveVoicePrefs();
  if(!el.checked){stopSpeaking();}
  updateVoiceToggleLabels();
}
function updateVoiceToggleLabels(){
  const reply=$('voiceReplyToggle');
  const replyText=$('voiceReplyLabelText');
  if(replyText) replyText.textContent=reply?.checked?'🔊 Giọng AI đang bật':'🔇 Giọng AI đã tắt';
  const mic=$('voiceInputToggle');
  const micText=$('voiceInputLabelText');
  if(micText) micText.textContent=mic?.checked?'🎤 Mic nhập giọng đang bật':'🎤 Mic nhập giọng đã tắt';
  updateQuickVoiceButtons();
}
function updateQuickVoiceButtons(){
  const reply=$('voiceReplyToggle');
  const btn=$('voiceReplyQuickBtn');
  if(btn){
    const on=reply?.checked!==false;
    btn.textContent=on?'🔊':'🔇';
    btn.classList.toggle('off',!on);
    btn.title=on?'Giọng AI đang bật - bấm để tắt':'Giọng AI đang tắt - bấm để bật';
  }
}
function toggleQuickSpeakReply(){
  const el=$('voiceReplyToggle');
  if(el){
    el.checked=!el.checked;
    toggleSpeakReply();
  }else{
    stopSpeaking();
  }
  updateQuickVoiceButtons();
}
function toggleVoiceInputEnabled(){
  const el=$('voiceInputToggle');
  localStorage.setItem('synam_voice_input_enabled', el?.checked?'1':'0');
  if(!el?.checked) stopVoiceInput();
  updateVoiceToggleLabels();
}

function toast(t){const el=$('toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400)}
function setLoading(id,on=true){$(id)?.classList.toggle('loading',on)}


function copyCurrentResult(target) {
  let text = '';
  if (typeof target === 'string') {
    text = decodeURIComponent(target);
  } else if (target && target.closest) {
    const bar = target.closest('.msg-action-bar, .result-action-bar');
    text = bar?.dataset?.rawText || lastResult || '';
  } else {
    text = lastResult || '';
  }
  if (!text) return toast('Không có nội dung để sao chép');
  navigator.clipboard.writeText(text).then(() => {
    toast('✅ Đã sao chép nội dung vào khay nhớ tạm');
  }).catch(() => {
    toast('Không thể sao chép tự động');
  });
}

function exportResultToPrint(title = 'Bản Luận Giải Đặng Năm AI', content = '') {
  const text = typeof content === 'string' ? content : (lastResult || '');
  if (!text) return toast('Chưa có nội dung để xuất bản');
  const printWindow = window.open('', '_blank', 'width=860,height=920');
  if (!printWindow) {
    alert('Trình duyệt đã chặn popup. Vui lòng cấp quyền mở pop-up để xem và in/lưu PDF.');
    return;
  }

  const cleanTitle = title || 'Bản Luận Giải Mệnh Số & Tử Vi';
  const now = new Date().toLocaleString('vi-VN');
  const profile = getBirthProfile() || {};

  const html = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>${cleanTitle} - dangnam.online</title>
  <style>
    @page { size: A4 portrait; margin: 16mm 14mm; }
    body {
      font-family: 'Times New Roman', Times, serif;
      background: #fff;
      color: #111;
      line-height: 1.7;
      padding: 36px 40px;
      margin: 0;
      position: relative;
    }
    .print-watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-35deg);
      font-size: 56pt;
      font-weight: 900;
      color: rgba(184, 134, 11, 0.07);
      white-space: nowrap;
      pointer-events: none;
      z-index: 0;
      text-transform: uppercase;
      letter-spacing: 10px;
    }
    .header {
      text-align: center;
      border-bottom: 2.5px double #b8860b;
      padding-bottom: 16px;
      margin-bottom: 20px;
      position: relative;
      z-index: 1;
    }
    .brand {
      font-size: 20pt;
      font-weight: bold;
      color: #8b6508;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .subbrand {
      font-size: 10.5pt;
      color: #555;
      margin-top: 4px;
      letter-spacing: 1px;
    }
    .doc-title {
      font-size: 16pt;
      color: #111;
      margin-top: 12px;
      text-transform: uppercase;
      font-weight: bold;
    }
    .meta-box {
      background: #faf8f2;
      border: 1px solid #e0d5be;
      border-radius: 8px;
      padding: 12px 18px;
      margin-bottom: 22px;
      font-size: 11pt;
      position: relative;
      z-index: 1;
    }
    .meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin: 4px 0;
    }
    .content {
      font-size: 12pt;
      line-height: 1.75;
      position: relative;
      z-index: 1;
    }
    .content h1, .content h2, .content h3, .content h4 {
      color: #8b6508;
      border-bottom: 1px solid #f0e6d2;
      padding-bottom: 4px;
      margin-top: 18px;
    }
    .content ul, .content ol {
      padding-left: 24px;
    }
    .content p {
      margin: 8px 0;
      text-align: justify;
    }
    .footer {
      margin-top: 36px;
      border-top: 1px solid #ddd;
      padding-top: 12px;
      font-size: 9.5pt;
      color: #666;
      display: flex;
      justify-content: space-between;
      position: relative;
      z-index: 1;
    }
    .print-actions {
      position: fixed;
      top: 16px;
      right: 16px;
      z-index: 999;
      display: flex;
      gap: 8px;
    }
    .print-btn {
      background: #8b6508;
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(0,0,0,0.18);
    }
    @media print {
      .print-actions { display: none !important; }
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">🖨️ In ngay / Lưu PDF</button>
    <button class="print-btn" style="background:#555;" onclick="window.close()">Đóng</button>
  </div>
  <div class="print-watermark">dangnam.online</div>
  <div class="header">
    <div class="brand">✦ ĐẶNG NĂM AI ✦</div>
    <div class="subbrand">HỆ THỐNG TRÍ TUỆ NHÂN TẠO LUẬN GIẢI MỆNH LÝ & PHONG THỦY HỌC · DANGNAM.ONLINE</div>
    <div class="doc-title">${cleanTitle}</div>
  </div>
  <div class="meta-box">
    <div class="meta-row">
      <span><b>Đương số:</b> ${profile.fullName || profile.name || 'Chưa định danh'}</span>
      <span><b>Giới tính:</b> ${profile.gender || 'Nam'}</span>
      <span><b>Ngày sinh:</b> ${profile.birthDate || 'Chưa rõ'} (${profile.calendarType === 'lunar' ? 'Âm lịch' : 'Dương lịch'})</span>
      <span><b>Giờ sinh:</b> ${profile.birthHour || profile.birthTime || 'Chưa rõ'}</span>
    </div>
    ${profile.birthPlace ? `<div class="meta-row"><span><b>Nơi sinh:</b> ${profile.birthPlace}</span></div>` : ''}
  </div>
  <div class="content">
    ${typeof formatMarkdownSafe === 'function' ? formatMarkdownSafe(text) : (typeof markdownish === 'function' ? markdownish(text) : String(text).split('\n').join('<br>'))}
  </div>
  <div class="footer">
    <span>Nguồn xuất bản: <b>dangnam.online</b> (Đặng Năm AI)</span>
    <span>Thời gian: ${now}</span>
    <span>Ghi chú: Luận giải mang tính chất tham khảo học thuật chiêm nghiệm</span>
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

async function streamChatResponse({ url, payload, signal, onStart, onDelta, onDone, onError }) {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(payload),
      ...(signal ? { signal } : {})
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || errJson.message || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let currentEvent = 'message';
    let fullText = '';
    let isTerminated = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
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
          const rawData = trimmed.slice(6).trim();
          if (rawData === '[DONE]') {
            isTerminated = true;
            if (typeof onDone === 'function') onDone(fullText, { label: 'Đặng Năm AI' });
            return;
          }
          try {
            const data = JSON.parse(rawData);
            if (data.error) {
              throw new Error(data.error || 'Lỗi streaming từ AI');
            }
            const chunk = data.content ?? data.chunk ?? (data.choices && data.choices[0]?.delta?.content) ?? '';
            if (chunk) {
              fullText += chunk;
              if (typeof onDelta === 'function') onDelta(chunk, fullText);
            } else if (currentEvent === 'start') {
              if (typeof onStart === 'function') onStart(data);
            } else if (currentEvent === 'done' || data.done) {
              isTerminated = true;
              if (typeof onDone === 'function') onDone(data.fullText || fullText, data);
            }
          } catch(jsonErr) {
            if (rawData && rawData !== '[DONE]') {
              fullText += rawData;
              if (typeof onDelta === 'function') onDelta(rawData, fullText);
            }
          }
        }
      }
    }

    if (!isTerminated && typeof onDone === 'function') {
      onDone(fullText);
    }
  } catch(err) {
    if (typeof onError === 'function') onError(err);
    else throw err;
  }
}

function formatMarkdownSafe(text) {
  if (typeof marked !== 'undefined' && marked.parse) {
    try {
      const rawHtml = marked.parse(String(text));
      return typeof DOMPurify !== 'undefined' ? DOMPurify.sanitize(rawHtml) : rawHtml;
    } catch(e) {}
  }
  return typeof markdownish === 'function' ? markdownish(text) : escapeHtml(text).replace(/\n/g, '<br>');
}

async function analyzeCung(cungName, cungChi, cungDesc) {
  document.querySelectorAll('.cung-cell').forEach(el => {
    el.classList.toggle('active-cung', el.dataset.cung === cungName);
  });
  
  const badge = $('tuviActiveCungBadge');
  if (badge) badge.textContent = `Cung ${cungName} [${cungChi || ''}]`;

  const heading = $('tuviResultHeading');
  if (heading) heading.textContent = `🔮 Luận Giải Chuyên Sâu: Cung ${cungName} (${cungChi || ''})`;

  const resultSection = $('tuviResultSection');
  const resultContent = $('tuviResultContent');
  const actionBar = $('tuviActionBar');
  if (actionBar) actionBar.style.display = 'none';

  if (resultContent) {
    resultContent.innerHTML = `<span class="content-body"><span class="typing-dots"><i></i><i></i><i></i></span> Đang kết nối trí tuệ nhân tạo Đặng Năm AI luận Cung ${cungName}...</span><span class="streaming-cursor"></span>`;
  }

  if (resultSection) {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const profile = getBirthProfile();
  const prompt = `Hãy đóng vai bậc thầy Tử Vi Đẩu Số Đặng Năm AI, luận giải chi tiết, thấu đáo và chuyên sâu về Cung ${cungName} (địa chi ${cungChi} - ý nghĩa: ${cungDesc}) trên lá số Tử Vi cho bản mệnh đương số. Kết hợp phân tích tính cách, thời vận, điểm cát hung và đưa ra lời khuyên thực tế để kích hoạt tài lộc, bình an, hanh thông sự nghiệp.`;

  let accumulated = '';
  try {
    await streamChatResponse({
      url: '/api/chat-stream',
      payload: {
        message: prompt,
        history: [],
        birthProfile: profile
      },
      onDelta: (chunk, full) => {
        accumulated = full;
        if (resultContent) {
          resultContent.dataset.rawMarkdown = full;
          resultContent.innerHTML = formatMarkdownSafe(full) + '<span class="streaming-cursor"></span>';
        }
      },
      onDone: (finalFull) => {
        const finalText = finalFull || accumulated || 'Đã hoàn thành luận giải.';
        if (resultContent) {
          resultContent.dataset.rawMarkdown = finalText;
          resultContent.innerHTML = formatMarkdownSafe(finalText);
        }
        if (actionBar) {
          actionBar.style.display = 'flex';
          actionBar.dataset.rawText = finalText;
        }
        lastResult = finalText;
        saveHistory(`Tử Vi: Cung ${cungName}`, finalText);
      },
      onError: (err) => {
        if (resultContent) {
          resultContent.innerHTML = `<span style="color:#ff7888;">⚠️ Chưa thể kết nối AI: ${escapeHtml(err.message || err)}. Vui lòng thử lại sau ít giây.</span>`;
        }
      }
    });
  } catch (e) {
    if (resultContent) {
      resultContent.innerHTML = `<span style="color:#ff7888;">⚠️ Lỗi: ${escapeHtml(e.message || e)}</span>`;
    }
  }
}

async function analyzeTuviPrompt(promptText) {
  const badge = $('tuviActiveCungBadge');
  if (badge) badge.textContent = 'Luận Toàn Cục';

  const heading = $('tuviResultHeading');
  if (heading) heading.textContent = `🔮 Luận Giải: ${promptText.slice(0, 45)}...`;

  const resultSection = $('tuviResultSection');
  const resultContent = $('tuviResultContent');
  const actionBar = $('tuviActionBar');
  if (actionBar) actionBar.style.display = 'none';

  if (resultContent) {
    resultContent.innerHTML = `<span class="content-body"><span class="typing-dots"><i></i><i></i><i></i></span> Đang kết nối trí tuệ nhân tạo Đặng Năm AI...</span><span class="streaming-cursor"></span>`;
  }

  if (resultSection) {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const profile = getBirthProfile();

  let accumulated = '';
  try {
    await streamChatResponse({
      url: '/api/chat-stream',
      payload: {
        message: promptText,
        history: [],
        birthProfile: profile
      },
      onDelta: (chunk, full) => {
        accumulated = full;
        if (resultContent) {
          resultContent.dataset.rawMarkdown = full;
          resultContent.innerHTML = formatMarkdownSafe(full) + '<span class="streaming-cursor"></span>';
        }
      },
      onDone: (finalFull) => {
        const finalText = finalFull || accumulated || 'Đã hoàn thành luận giải.';
        if (resultContent) {
          resultContent.dataset.rawMarkdown = finalText;
          resultContent.innerHTML = formatMarkdownSafe(finalText);
        }
        if (actionBar) {
          actionBar.style.display = 'flex';
          actionBar.dataset.rawText = finalText;
        }
        lastResult = finalText;
        saveHistory('Tử Vi Đặng Năm AI', finalText);
      },
      onError: (err) => {
        if (resultContent) {
          resultContent.innerHTML = `<span style="color:#ff7888;">⚠️ Chưa thể kết nối AI: ${escapeHtml(err.message || err)}.</span>`;
        }
      }
    });
  } catch (e) {
    if (resultContent) {
      resultContent.innerHTML = `<span style="color:#ff7888;">⚠️ Lỗi: ${escapeHtml(e.message || e)}</span>`;
    }
  }
}

function generateTuvi() {
  return analyzeTuviPrompt('Luận giải tổng quan vận mệnh, cục diện lá số và đại vận then chốt cho đương số theo thông tin bản mệnh.');
}

function appendChatActions(container, text) {
  if (!container || !text) return;
  const existing = container.querySelector('.msg-action-bar');
  if (existing) existing.remove();
  const bar = document.createElement('div');
  bar.className = 'msg-action-bar';
  bar.style.cssText = 'display:flex;gap:6px;margin-top:10px;flex-wrap:wrap;border-top:1px solid rgba(255,255,255,0.08);padding-top:8px;';
  bar.dataset.rawText = text;
  bar.innerHTML = `
    <button type="button" class="btn-sm ghost" onclick="copyCurrentResult(this)">📋 Sao chép</button>
    <button type="button" class="btn-sm primary" onclick="exportResultToPrint('Luận Giải Đặng Năm AI', decodeURIComponent('${encodeURIComponent(text)}'))">🖨️ Xuất bản (PDF / In)</button>
    <button type="button" class="btn-sm ghost" onclick="speakText(decodeURIComponent('${encodeURIComponent(text)}'))">🔊 Nghe đọc</button>
  `;
  container.appendChild(bar);
}

function htmlResult(title,text){
  lastResult=text||'';
  const escaped = encodeURIComponent(text||'');
  return `<h2>${title}</h2><div class="result-body">${markdownish(text)}</div>${text ? `<div class="result-action-bar" style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap;"><button type="button" class="btn-sm ghost" onclick="copyCurrentResult('${escaped}')">📋 Sao chép</button><button type="button" class="btn-sm primary" onclick="exportResultToPrint('${escapeHtml(title)}', decodeURIComponent('${escaped}'))">🖨️ Xuất bản (PDF / In)</button><button type="button" class="btn-sm ghost" onclick="speakText(decodeURIComponent('${escaped}'))">🔊 Nghe đọc</button></div>` : ''}`;
}

function hideModelLeak(text=''){
  return String(text||'')
    .replace(/^\s*(Trả lời bởi|Powered by|Model|Provider)\s*[:：].*$/gmi,'')
    .replace(/\b(gemini|google gemini|groq|openrouter|openai|chatgpt|gpt-4o(?:-mini)?|gpt-4\.1(?:-mini)?|claude|anthropic|deepseek|qwen|mistral|grok|llama-3(?:\.\d)?[^\s,.]*)\b/gi, 'AI')
    .replace(/\n{3,}/g,'\n\n')
    .trim();
}

function markdownish(text=''){
  if(typeof window !== 'undefined' && window.marked && window.DOMPurify){
    try {
      return window.DOMPurify.sanitize(window.marked.parse(String(text||'')));
    } catch(e) {}
  }
  text=String(text||'').replace(/\\n/g,'\n').replace(/\r/g,'');
  const inline=s=>escapeHtml(String(s||''))
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/_(.+?)_/g,'<em>$1</em>');
  let inList=false, out='';
  String(text||'').split('\n').forEach(raw=>{
    const line=raw.trim();
    if(!line){ if(inList){out+='</ul>';inList=false} return; }
    if(line.startsWith('### ')){ if(inList){out+='</ul>';inList=false} out+=`<h3>${inline(line.slice(4))}</h3>`; return; }
    if(line.startsWith('## ')){ if(inList){out+='</ul>';inList=false} out+=`<h2>${inline(line.slice(3))}</h2>`; return; }
    if(line.startsWith('- ')){ if(!inList){out+='<ul>';inList=true} out+=`<li>${inline(line.slice(2))}</li>`; return; }
    if(inList){out+='</ul>';inList=false}
    out+=`<p>${inline(line)}</p>`;
  });
  if(inList) out+='</ul>';
  return out;
}
function saveHistory(type,content){const list=JSON.parse(localStorage.getItem('synam_history')||'[]');list.unshift({type,content,at:new Date().toLocaleString('vi-VN')});localStorage.setItem('synam_history',JSON.stringify(list.slice(0,50)));renderHistory();}
function renderHistory(){const list=JSON.parse(localStorage.getItem('synam_history')||'[]');if($('statCount'))$('statCount').textContent=list.length;if($('historyMini'))$('historyMini').innerHTML=(list.slice(0,3).map(x=>`<div class="history-mini-item"><span>${x.type}</span><small>Chi tiết</small></div>`).join('')||'<p>Chưa có lịch sử.</p>');if($('historyList'))$('historyList').innerHTML=(list.map(x=>`<div class="history-item"><div><b>${x.type}</b><br><small>${x.at}</small></div><button onclick="showHistory('${encodeURIComponent(x.content)}')">Chi tiết</button></div>`).join('')||'<p>Chưa có lịch sử phân tích.</p>')}
function showHistory(c){lastResult=decodeURIComponent(c);toast('Đã mở nội dung lịch sử');alert(lastResult.slice(0,2000))}
function clearHistory(){localStorage.removeItem('synam_history');renderHistory();toast('Đã xóa lịch sử')}

function cleanSpeakText(text=''){
  return String(text||'')
    .replace(/```[\s\S]*?```/g,' đoạn code ')
    .replace(/[#*_`>\[\](){}|]/g,' ')
    .replace(/https?:\/\/\S+/g,' đường link ')
    .replace(/\s+/g,' ')
    .trim()
    .slice(0,3800);
}

let cachedVoices=[];
function getVoicePrefs(){
  try{return JSON.parse(localStorage.getItem('synam_voice_prefs')||'{}')}catch{return {}}
}
function isVietnameseVoice(v){
  const hay=(String(v?.lang||'')+' '+String(v?.name||'')).toLowerCase();
  return hay.includes('vi') || hay.includes('vietnam') || hay.includes('viet nam') || hay.includes('tiếng việt') || hay.includes('tieng viet');
}
function scoreVietnameseVoice(v){
  const hay=(String(v?.lang||'')+' '+String(v?.name||'')).toLowerCase();
  let score=0;
  if(String(v?.lang||'').toLowerCase()==='vi-vn') score+=100;
  if(String(v?.lang||'').toLowerCase().startsWith('vi')) score+=80;
  if(hay.includes('vietnam') || hay.includes('viet nam')) score+=40;
  if(hay.includes('google')) score+=15;
  if(hay.includes('female') || hay.includes('nữ') || hay.includes('nu')) score+=5;
  if(v?.localService) score+=2;
  return score;
}
function refreshVoiceList(){
  if(!('speechSynthesis' in window)) return [];
  cachedVoices=(speechSynthesis.getVoices?.()||[]).slice();
  const select=$('voiceSelect');
  if(select){
    const prefs=getVoicePrefs();
    const vi=cachedVoices.filter(isVietnameseVoice).sort((a,b)=>scoreVietnameseVoice(b)-scoreVietnameseVoice(a));
    const others=cachedVoices.filter(v=>!isVietnameseVoice(v));
    const opts=[`<option value="auto">Tự động chọn giọng Việt</option>`]
      .concat(vi.map(v=>`<option value="${escapeHtml(v.name)}">🇻🇳 ${escapeHtml(v.name)} (${escapeHtml(v.lang||'')})</option>`))
      .concat(others.slice(0,40).map(v=>`<option value="${escapeHtml(v.name)}">🌐 ${escapeHtml(v.name)} (${escapeHtml(v.lang||'')})</option>`));
    select.innerHTML=opts.join('');
    select.value=prefs.voiceName||'auto';
  }
  return cachedVoices;
}
function initVietnameseVoices(){
  if(!('speechSynthesis' in window)) return;
  refreshVoiceList();
  speechSynthesis.onvoiceschanged=()=>refreshVoiceList();
  setTimeout(refreshVoiceList,250);
  setTimeout(refreshVoiceList,1000);
}
function getPreferredVoice(){
  const prefs=getVoicePrefs();
  const voices=refreshVoiceList();
  if(!voices.length) return null;
  if(prefs.voiceName && prefs.voiceName!=='auto'){
    const chosen=voices.find(v=>v.name===prefs.voiceName);
    if(chosen) return chosen;
  }
  const vi=voices.filter(isVietnameseVoice).sort((a,b)=>scoreVietnameseVoice(b)-scoreVietnameseVoice(a));
  return vi[0] || null;
}
function speakText(text, force=false){
  const enabled=$('voiceReplyToggle')?.checked;
  if(!force && !enabled) return;
  if(!('speechSynthesis' in window)){toast('Trình duyệt chưa hỗ trợ đọc giọng nói');return}
  const clean=cleanSpeakText(text);
  if(!clean){toast('Không có nội dung để đọc');return}
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(clean);
  u.lang='vi-VN';
  u.rate=Number($('voiceRate')?.value||1);
  u.pitch=1;
  const voice=getPreferredVoice();
  if(voice){
    u.voice=voice;
    u.lang=voice.lang || 'vi-VN';
    setVoiceStatus('🔊 Đang đọc bằng giọng: '+voice.name,false);
  }else{
    u.lang='vi-VN';
    setVoiceStatus('🔊 Máy chưa có giọng Việt. Vẫn đọc bằng giọng mặc định của trình duyệt.',false);
  }
  u.onend=()=>{ if($('autoListenToggle')?.checked && $('page-chat')?.classList.contains('active')) startVoiceInput(); };
  speechSynthesis.speak(u);
}
function speakLastResult(){if(!lastResult){toast('Chưa có kết quả để đọc');return} speakText(lastResult,true)}
function testVoice(){speakText('Xin chào Chủ tịch Năm. Đây là bản Đặng Năm Voice Việt Pro. Nếu máy có giọng tiếng Việt, tôi sẽ đọc đúng tiếng Việt.',true)}
function saveVoicePrefs(){
  const prefs={
    reply:Boolean($('voiceReplyToggle')?.checked),
    auto:Boolean($('autoListenToggle')?.checked),
    rate:$('voiceRate')?.value||'1',
    voiceName:$('voiceSelect')?.value||'auto'
  };
  localStorage.setItem('synam_voice_prefs',JSON.stringify(prefs));
  updateVoiceToggleLabels();
}

function loadVoicePrefs(){
  try{
    const prefs=getVoicePrefs();
    setTimeout(()=>{
      if($('voiceReplyToggle') && typeof prefs.reply==='boolean') $('voiceReplyToggle').checked=prefs.reply;
      if($('autoListenToggle') && typeof prefs.auto==='boolean') $('autoListenToggle').checked=prefs.auto;
      if($('voiceRate') && prefs.rate) $('voiceRate').value=prefs.rate;
      if($('voiceSelect') && prefs.voiceName) $('voiceSelect').value=prefs.voiceName;
      if($('voiceInputToggle')) $('voiceInputToggle').checked=(localStorage.getItem('synam_voice_input_enabled')!=='0');
      refreshVoiceList();
      updateVoiceToggleLabels();
    },120);
  }catch{}
}
let voiceRecognizer=null;
let voiceListening=false;

function autoResizeChatText(){
  const el=$('chatText');
  if(!el) return;
  el.style.height='auto';
  const max=window.innerWidth<700?170:240;
  const next=Math.min(Math.max(el.scrollHeight,52),max);
  el.style.height=next+'px';
  el.style.overflowY=el.scrollHeight>max?'auto':'hidden';
}
function setChatTextValue(text){
  const el=$('chatText');
  if(!el) return;
  el.value=String(text||'');
  autoResizeChatText();
}
function handleChatTextKey(event){
  if(event.key==='Enter' && !event.shiftKey){
    event.preventDefault();
    sendChat();
  }
}
function getSpeechRecognition(){return window.SpeechRecognition||window.webkitSpeechRecognition||null}
function setVoiceStatus(text,active=false){const el=$('voiceStatus');if(el){el.textContent=text;el.classList.toggle('listening',active)} const btn=$('voiceBtn');if(btn){btn.classList.toggle('recording',active);btn.textContent=active?'🔴':'🎤'}}
function startVoiceInput(){
  if($('voiceInputToggle') && !$('voiceInputToggle').checked){toast('Mic nhập giọng đang tắt. Bật 🎤 Mic trước đã nhé.');return}
  const SR=getSpeechRecognition();
  if(!SR){toast('Trình duyệt này chưa hỗ trợ nhập giọng nói. Dùng Chrome/Edge trên Android hoặc máy tính nhé.');return}
  if(voiceListening) return;
  try{
    speechSynthesis?.cancel?.();
    voiceRecognizer=new SR();
    voiceRecognizer.lang='vi-VN';
    voiceRecognizer.interimResults=true;
    voiceRecognizer.continuous=true;
    voiceListening=true;
    const baseText=$('chatText')?.value ? $('chatText').value.trim()+' ' : '';
    setVoiceStatus('🎙️ Đang nghe tiếng Việt... Đọc đến đâu chữ hiện đến đó',true);
    voiceRecognizer.onresult=(event)=>{
      let finalStr='';
      let interimStr='';
      for(let i=0;i<event.results.length;i++){
        const res=event.results[i];
        const txt=res[0]?.transcript||'';
        if(res.isFinal) finalStr+=txt+' ';
        else interimStr+=txt;
      }
      const fullText=(baseText+finalStr+interimStr).replace(/\s+/g,' ').trim();
      setChatTextValue(fullText);
      setVoiceStatus(interimStr ? '🎙️ Đang nhận: "'+interimStr.trim()+'"' : '🎙️ Đang lắng nghe...', true);
    };
    voiceRecognizer.onerror=(e)=>{
      if(e.error==='not-allowed'||e.error==='service-not-allowed'){
        setVoiceStatus('🎙️ Chưa cấp quyền micro trong trình duyệt',false);
      } else if(e.error!=='no-speech'){
        setVoiceStatus('🎙️ Lỗi mic: '+(e.error||'không rõ'),false);
      }
      voiceListening=false;
    };
    voiceRecognizer.onend=()=>{
      voiceListening=false;
      setVoiceStatus('✅ Đã nhận diện xong! Bạn có thể xem lại, sửa câu hỏi rồi bấm Gửi.',false);
      setTimeout(()=>setVoiceStatus('',false),5000);
    };
    voiceRecognizer.start();
  }catch(e){voiceListening=false;setVoiceStatus('🎙️ Không khởi động được micro',false);toast('Không mở được micro: '+(e.message||e))}
}
function stopVoiceInput(){try{voiceRecognizer?.stop?.()}catch{} voiceListening=false;setVoiceStatus('🎙️ Đã dừng nghe',false)}
function toggleVoiceInput(){voiceListening?stopVoiceInput():startVoiceInput()}
function scrollChatBottom(force = false){
  const el=$('chatLog');
  if(!el) return;
  if(force || !userChatScrolledUp){
    el.scrollTop = el.scrollHeight;
    userChatScrolledUp = false;
    const btn = $('scrollBottomBtn');
    if (btn) btn.style.display = 'none';
  }
}
function newProChat(){
  const welcomeBox = $('mysticWelcomeState');
  if (welcomeBox) welcomeBox.style.display = 'flex';
if(!confirm('Tạo cuộc chat mới? Bộ nhớ hội thoại hiện tại sẽ được làm mới, lịch sử cũ vẫn nằm trong mục Lịch sử.'))return; clearChatMemory(); const log=$('chatLog'); if(log) log.innerHTML='<div class="msg ai-welcome"><b>✨ Cuộc chat mới</b><br>Năm muốn hỏi gì tiếp? Bấm 🎤 để nói hoặc gõ nội dung bên dưới.</div>'; lastResult='';}

function previewImage(e,id){const f=e.target.files[0];if(!f)return;const img=$(id);img.src=URL.createObjectURL(f);img.style.display='block'}
function copyCameraFile(e,targetInputId,previewId){
  const file=e.target.files&&e.target.files[0];
  if(!file) return;
  const dt=new DataTransfer();
  dt.items.add(file);
  const target=$(targetInputId);
  if(target) target.files=dt.files;
  const img=$(previewId);
  if(img){img.src=URL.createObjectURL(file);img.style.display='block'}
  toast('Đã chụp ảnh xong');
}

async function fileToDataURL(file){return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file)})}

let chatAttachments=[];
let chatMode='chat';
let imageEditDataUrl='';
let firebaseAuthState={enabled:false, app:null, auth:null, providers:{}, ready:false};
async function fileToTextPreview(file){
  if(!file) return '';
  const textTypes=['text/','application/json','application/javascript','application/xml','text/csv'];
  const name=(file.name||'').toLowerCase();
  const canRead=textTypes.some(t=>(file.type||'').startsWith(t)) || /\.(txt|md|json|csv|js|jsx|ts|tsx|html|css|xml|log)$/i.test(name);
  if(!canRead) return '';
  return await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result||'').slice(0,12000));r.onerror=rej;r.readAsText(file)});
}
async function handleChatFiles(e){
  const files=[...(e.target.files||[])].slice(0,6);
  if(!files.length) return;
  for(const file of files){
    if(chatAttachments.length>=6){toast('Tối đa 6 file/ảnh mỗi lần hỏi');break}
    const dataUrl=await fileToDataURL(file);
    const textPreview=await fileToTextPreview(file);
    chatAttachments.push({name:file.name,type:file.type||'application/octet-stream',size:file.size,dataUrl,textPreview});
  }
  e.target.value='';
  renderChatAttachments();
}
function renderChatAttachments(){
  const box=$('chatAttachments'); if(!box) return;
  if(!chatAttachments.length){box.innerHTML='';return}
  box.innerHTML=chatAttachments.map((f,i)=>`<div class="attachment-pill"><span>${f.type.startsWith('image/')?'🖼':'📄'} ${escapeHtml(f.name)}</span><small>${Math.ceil((f.size||0)/1024)} KB</small><button onclick="removeChatAttachment(${i})">×</button></div>`).join('');
}
function removeChatAttachment(i){chatAttachments.splice(i,1);renderChatAttachments()}
function clearChatAttachments(){chatAttachments=[];renderChatAttachments();toast('Đã xóa file đính kèm')}


function setChatMode(mode){
  chatMode=mode;
  ['modeChat','modeCreateImage','modeEditImage'].forEach(id=>$(id)?.classList.remove('active'));
  const panel=$('imageAiPanel');
  const upload=$('imageEditUpload');
  const camUpload=$('imageEditCamera');
  const title=$('imageAiTitle');
  const hint=$('imageAiHint');
  const input=$('chatText');
  const btn=$('chatSendBtn');
  if(mode==='chat'){
    $('modeChat')?.classList.add('active');
    if(panel) panel.style.display='none';
    if(input) input.placeholder='Nhập câu hỏi về ảnh/file hoặc nội dung cần hỏi Gemini...';
    if(btn) btn.textContent='Gửi';
    return;
  }
  if(panel) panel.style.display='block';
  if(mode==='create-image'){
    $('modeCreateImage')?.classList.add('active');
    if(upload) upload.style.display='none';
  if(camUpload) camUpload.style.display='none';
    if(title) title.textContent='🎨 Tạo ảnh AI';
    if(hint) hint.textContent='Nhập mô tả ảnh muốn Gemini tạo.';
    if(input) input.placeholder='Ví dụ: tạo ảnh poster neon xanh tím, phong cách cinematic...';
    if(btn) btn.textContent='Tạo ảnh';
  }else{
    $('modeEditImage')?.classList.add('active');
    if(upload) upload.style.display='inline-flex';
    if(camUpload) camUpload.style.display='inline-flex';
    if(title) title.textContent='🖼️ Chỉnh sửa ảnh AI';
    if(hint) hint.textContent='Tải ảnh gốc rồi nhập yêu cầu chỉnh sửa.';
    if(input) input.placeholder='Ví dụ: xóa nền, làm nét, đổi nền xanh, thêm chữ...';
    if(btn) btn.textContent='Chỉnh ảnh';
  }
}
async function handleImageEditFile(e){
  const file=e.target.files?.[0];
  if(!file) return;
  imageEditDataUrl=await fileToDataURL(file);
  const img=$('imageEditPreview');
  if(img){img.src=imageEditDataUrl;img.style.display='block'}
  toast('Đã tải ảnh gốc để chỉnh sửa');
}
function renderGeneratedImages(images=[]){
  if(!images.length) return '';
  return `<div class="generated-images">${images.map((img,i)=>{
    const src=`data:${img.mimeType||'image/png'};base64,${img.data}`;
    return `<figure><img src="${src}" alt="Ảnh AI ${i+1}"><figcaption><a download="synam-ai-image-${Date.now()}-${i+1}.png" href="${src}">Tải ảnh</a></figcaption></figure>`;
  }).join('')}</div>`;
}
async function sendImageAI(){
  const input=$('chatText');
  const prompt=input.value.trim();
  const isEdit=chatMode==='edit-image';
  const attachments=[...chatAttachments];
  if(!prompt){toast('Nhập mô tả ảnh hoặc yêu cầu chỉnh sửa đã nhé');return}
  if(isEdit && !imageEditDataUrl && !attachments.some(f=>String(f.type||'').startsWith('image/'))){toast('Chỉnh sửa ảnh cần tải ảnh gốc');return}
  input.value='';
  const title=isEdit?'Chỉnh sửa ảnh AI':'Tạo ảnh AI';
  $('chatLog').insertAdjacentHTML('beforeend',`<div class="msg me">${getChatUserRoleHtml()}<b>${title}</b><br>${escapeHtml(prompt)}</div>`);
  $('chatLog').insertAdjacentHTML('beforeend',`<div class="msg" id="typing">Gemini đang ${isEdit?'chỉnh sửa':'tạo'} ảnh...</div>`);
  chatAttachments=[];renderChatAttachments();
  try{
    const data=await postJSON('/api/image-ai',{mode:isEdit?'edit':'create',prompt,image:imageEditDataUrl,attachments,context:{clientTime:new Date().toLocaleString('vi-VN')}});
    const images=data.images||[];
    const text=hideModelLeak(data.text||`Đã ${isEdit?'chỉnh sửa':'tạo'} ảnh bằng AI.`);
    $('typing').outerHTML=`<div class="msg image-ai-result">${markdownish(text)}${renderGeneratedImages(images)}</div>`;
    lastResult=text;saveHistory(title,text);checkGeminiStatus();
  }catch(e){
    const err=parseError(e);
    $('typing').outerHTML=`<div class="msg error"><b>Gemini chưa tạo/chỉnh ảnh được.</b><br>${escapeHtml(err)}<br><small>Kiểm tra GEMINI_API_KEY, quota hoặc đổi GEMINI_IMAGE_MODEL / GEMINI_IMAGE_MODELS trong .env. Có thể mở /api/models để xem danh sách fallback.</small></div>`;
  }
}

function authHeaders(){const token=localStorage.getItem('synam_token')||'';return token?{'Content-Type':'application/json','Authorization':'Bearer '+token}:{'Content-Type':'application/json'}}
async function postJSON(url,data){const r=await fetch(url,{method:'POST',headers:authHeaders(),body:JSON.stringify(data)});if(!r.ok)throw new Error(await r.text());return r.json()}
async function getJSON(url){const token=localStorage.getItem('synam_token')||'';const r=await fetch(url,{headers:token?{'Authorization':'Bearer '+token}:{}});if(!r.ok)throw new Error(await r.text());return r.json()}

async function quickAsk(){const q=($('globalAsk')?.value||'').trim();routeTo('chat');setTimeout(()=>{if(q){setChatTextValue(q);sendChat()}else if($('chatText')){$('chatText').focus();}},120)}

// ===== NAM30 MEMORY PRO CORE =====
// Lưu hội thoại thật vào localStorage, không chỉ đọc chữ từ khung chat.
// Nhờ vậy câu thứ 2, câu thứ 3 vẫn bám được câu trước.
const SYN_CHAT_MEMORY_KEY='synam_chat_memory_v30';
function loadChatMemory(){
  try{const list=JSON.parse(localStorage.getItem(SYN_CHAT_MEMORY_KEY)||'[]');return Array.isArray(list)?list:[]}catch{return []}
}
function saveChatMemory(list){
  const clean=(Array.isArray(list)?list:[])
    .filter(x=>x && x.role && String(x.text||'').trim())
    .slice(-40)
    .map(x=>({role:x.role==='assistant'?'assistant':'user',text:String(x.text||'').trim().slice(0,2200),at:x.at||new Date().toISOString()}));
  localStorage.setItem(SYN_CHAT_MEMORY_KEY,JSON.stringify(clean));
  return clean;
}
function rememberChatTurn(role,text){
  const list=loadChatMemory();
  list.push({role:role==='assistant'?'assistant':'user',text:String(text||'').trim(),at:new Date().toISOString()});
  saveChatMemory(list);
}
function clearChatMemory(){localStorage.removeItem(SYN_CHAT_MEMORY_KEY);toast('Đã xóa bộ nhớ hội thoại NAM30')}
function domChatHistory(limit=18){
  return [...document.querySelectorAll('#chatLog .msg')]
    .filter(el=>!el.classList.contains('typing') && !el.id)
    .slice(-limit)
    .map(el=>({
      role:el.classList.contains('me')?'user':'assistant',
      text:String(el.innerText||'')
        .replace(/👤 .*?(Free|Pro|Guest)?/g,'')
        .replace(/👥 Khách/g,'')
        .replace(/🤖 Đặng Năm AI/g,'')
        .replace(/Trả lời bởi:.*?(\n|$)/g,'')
        .replace(/AI đang phân tích|Đang trả lời/gi,'')
        .trim().slice(0,1800)
    }))
    .filter(x=>x.text);
}
function getChatHistoryForAI(limit=30){
  const memory=loadChatMemory();
  const dom=domChatHistory(12);
  const merged=[...memory,...dom];
  const seen=new Set();
  return merged.filter(x=>{
    const key=x.role+'|'+String(x.text||'').slice(0,120);
    if(seen.has(key)) return false;
    seen.add(key);
    return x.text && !/AI đang phân tích|Đang trả lời/i.test(x.text);
  }).slice(-limit);
}
// ===== END NAM30 MEMORY PRO CORE =====

// ===== NAM34 WEATHER FRONTEND GUARD =====
function isWeatherQuestionClient(message=''){
  const q=String(message||'').toLowerCase();
  return /(thời tiết|thoi tiet|dự báo thời tiết|du bao thoi tiet|nhiệt độ ngoài trời|nhiet do ngoai troi)/i.test(q);
}

function weatherLocationClient(message=''){
  const q=String(message||'').toLowerCase().normalize('NFC');
  const known=[
    [/việt\s*trì|viet\s*tri/, {name:'Việt Trì, Phú Thọ, Việt Nam', latitude:21.3227, longitude:105.4020}],
    [/phú\s*thọ|phu\s*tho/, {name:'Phú Thọ, Việt Nam', latitude:21.3980, longitude:105.2240}],
    [/hà\s*nội|ha\s*noi|hanoi/, {name:'Hà Nội, Việt Nam', latitude:21.0278, longitude:105.8342}],
    [/hồ\s*chí\s*minh|ho\s*chi\s*minh|sài\s*gòn|sai\s*gon|tp\s*hcm/, {name:'TP. Hồ Chí Minh, Việt Nam', latitude:10.8231, longitude:106.6297}],
    [/đà\s*nẵng|da\s*nang/, {name:'Đà Nẵng, Việt Nam', latitude:16.0544, longitude:108.2022}]
  ];
  for(const [re,loc] of known){ if(re.test(q)) return loc; }
  return {name:'Hà Nội, Việt Nam', latitude:21.0278, longitude:105.8342};
}
function weatherCodeViClient(code){
  const m={0:'Trời quang',1:'Ít mây',2:'Có mây',3:'Nhiều mây/u ám',45:'Sương mù',48:'Sương mù',51:'Mưa phùn nhẹ',53:'Mưa phùn vừa',55:'Mưa phùn dày',61:'Mưa nhỏ',63:'Mưa vừa',65:'Mưa to',80:'Mưa rào nhẹ',81:'Mưa rào vừa',82:'Mưa rào mạnh',95:'Dông',96:'Dông kèm mưa đá',99:'Dông kèm mưa đá'};
  return m[Number(code)]||'Không rõ';
}
async function askWeatherBrowserFallback(message){
  const loc=weatherLocationClient(message);
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&timezone=Asia%2FBangkok&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,cloud_cover,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=3`;
  const r=await fetch(url,{cache:'no-store'});
  if(!r.ok) throw new Error('WEATHER_BROWSER_HTTP_'+r.status);
  const data=await r.json();
  const cur=data.current||{}, daily=data.daily||{};
  const lines=[
    `### 🌦️ Thời tiết ${loc.name}`,
    `- **Hiện tại:** ${Math.round(cur.temperature_2m ?? 0)}°C, cảm giác như ${Math.round(cur.apparent_temperature ?? cur.temperature_2m ?? 0)}°C, ${weatherCodeViClient(cur.weather_code)}.`,
    `- **Độ ẩm:** ${cur.relative_humidity_2m ?? '?'}% · **Gió:** ${cur.wind_speed_10m ?? '?'} km/h · **Mây:** ${cur.cloud_cover ?? '?'}%.`,
    `- **Hôm nay:** khoảng ${Math.round(daily.temperature_2m_min?.[0] ?? 0)}°C - ${Math.round(daily.temperature_2m_max?.[0] ?? 0)}°C, khả năng mưa cao nhất ${daily.precipitation_probability_max?.[0] ?? '?'}%.`
  ];
  if(daily.time?.[1]) lines.push(`- **Ngày mai (${daily.time[1]}):** khoảng ${Math.round(daily.temperature_2m_min?.[1] ?? 0)}°C - ${Math.round(daily.temperature_2m_max?.[1] ?? 0)}°C, ${weatherCodeViClient(daily.weather_code?.[1])}.`);
  lines.push('', '_Nguồn: Open-Meteo, lấy trực tiếp từ trình duyệt nếu server hosting bị chặn kết nối._');
  return lines.join('\n');
}
async function askWeatherDirectClient(message){
  try{
    const r=await postJSON('/api/weather',{message});
    const text=String(r?.text||'').replace(/\\n/g,'\n');
    if(text && !/chưa lấy được|thử lại sau|không lấy được/i.test(text)) return text;
  }catch(_serverWeatherErr){}
  return await askWeatherBrowserFallback(message);
}
// ===== END NAM34 WEATHER FRONTEND GUARD =====

async function sendChat(customPrompt){
  if(chatMode!=='chat') return sendImageAI();
  const input=$('chatText');
  const q = typeof customPrompt === 'string' ? customPrompt.trim() : (input?.value || '').trim();
  const attachments=[...chatAttachments];
  if(!q && !attachments.length){toast('Nhập câu hỏi hoặc tải ảnh/file lên đã nhé');return}

  // 1. Hide Welcome empty state box
  const welcomeBox = $('mysticWelcomeState');
  if (welcomeBox) welcomeBox.style.display = 'none';

  const history=getChatHistoryForAI(30);
  rememberChatTurn('user', q||'Phân tích file/ảnh đã tải lên');
  if (input && typeof customPrompt !== 'string') {
    input.value='';
    autoResizeChatText();
  }
  const attachLabel=attachments.length?`<div class="msg-files">${attachments.map(f=>`${f.type.startsWith('image/')?'🖼':'📄'} ${escapeHtml(f.name)}`).join('<br>')}</div>`:'';
  $('chatLog').insertAdjacentHTML('beforeend',`<div class="msg me">${getChatUserRoleHtml()}${escapeHtml(q||'Phân tích file/ảnh đã tải lên')}${attachLabel}</div>`);

  const msgId = 'ai-msg-' + Date.now();
  // 2. Insert initial AI msg with Mystic Shimmer thinking
  $('chatLog').insertAdjacentHTML('beforeend',`<div class="msg ai-msg" id="${msgId}"><span class="msg-role">🤖 Đặng Năm AI</span><span class="content-body"><div class="mystic-thinking-shimmer"><span class="shimmer-sparkle">✦</span> Đặng Năm AI đang an sao & luận giải...</div></span><span class="streaming-cursor"></span></div>`);
  scrollChatBottom(true);

  chatAttachments=[];renderChatAttachments();

  const msgElem = $(msgId);
  const bodyElem = msgElem?.querySelector('.content-body');
  const cursorElem = msgElem?.querySelector('.streaming-cursor');

  // Setup abort controller and button state
  if (currentChatAbortController) {
    try { currentChatAbortController.abort(); } catch(e) {}
  }
  currentChatAbortController = new AbortController();
  setChatSendBtnState(true);

  try{
    if(!attachments.length && isWeatherQuestionClient(q)){
      try{
        const weatherText=await askWeatherDirectClient(q);
        if(weatherText){
          const cleanText = hideModelLeak(weatherText);
          if (bodyElem) bodyElem.innerHTML = markdownish(cleanText);
          if (cursorElem) cursorElem.remove();
          appendChatActions(msgElem, cleanText);
          lastResult=cleanText;rememberChatTurn('assistant',cleanText);saveHistory('Đặng Năm Weather Core',cleanText);scrollChatBottom(true);speakText(cleanText);
          setChatSendBtnState(false);
          currentChatAbortController = null;
          return;
        }
      }catch(_weatherErr){}
    }

    const provider=$('chatProvider')?.value||'auto';
    const model=$('chatModel')?.value||'';
    const council=Boolean($('chatCouncil')?.checked);
    const answerStyle=$('chatAnswerStyle')?.value||'detailed';
    const context={clientTime:new Date().toLocaleString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh'}),source:'Đặng Năm AI Chat',today:new Date().toLocaleDateString('vi-VN',{timeZone:'Asia/Ho_Chi_Minh',weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'})};
    const destinyProfile = getDestinyProfile();
    const personaPrompt = CHAT_PERSONAS[currentChatPersona] || CHAT_PERSONAS.assistant;

    const streamUrl = attachments.length ? '/api/chat-ai/stream' : '/api/chat-stream';
    const payload = attachments.length ? {
      message: q,
      question: q,
      attachments,
      history,
      context,
      answerStyle,
      provider,
      model,
      council,
      persona: currentChatPersona,
      personaPrompt,
      destinyProfile: getBirthProfile()
    } : {
      message: q,
      history,
      persona: currentChatPersona,
      personaPrompt,
      birthProfile: getBirthProfile()
    };

    let accumulatedText = '';
    await streamChatResponse({
      url: streamUrl,
      payload,
      signal: currentChatAbortController.signal,
      onStart: (meta) => {
        if (bodyElem && !accumulatedText) {
          bodyElem.innerHTML = '';
        }
      },
      onDelta: (chunk, full) => {
        accumulatedText = hideModelLeak(full);
        if (bodyElem) {
          bodyElem.innerHTML = markdownish(accumulatedText);
        }
        scrollChatBottom();
      },
      onDone: (finalFull, meta) => {
        const text = hideModelLeak(finalFull || accumulatedText || 'Đã hoàn thành phản hồi.');
        if (bodyElem) bodyElem.innerHTML = markdownish(text);
        if (cursorElem) cursorElem.remove();
        appendChatActions(msgElem, text);
        lastResult = text;
        rememberChatTurn('assistant', text);
        saveHistory(meta?.label || 'Đặng Năm AI Chat', text);
        checkGeminiStatus();
        scrollChatBottom();
        speakText(text);
        setChatSendBtnState(false);
        currentChatAbortController = null;
      },
      onError: (err) => {
        setChatSendBtnState(false);
        currentChatAbortController = null;
        throw err;
      }
    });
  }catch(e){
    setChatSendBtnState(false);
    currentChatAbortController = null;
    const isAborted = e?.name === 'AbortError' || String(e).includes('abort');
    if (cursorElem) cursorElem.remove();
    if (bodyElem) {
      if (isAborted) {
        bodyElem.innerHTML += `<div class="msg-aborted-pill"><small>⏹️ Đã dừng tạo câu trả lời theo yêu cầu</small></div>`;
      } else {
        const err=parseError(e);
        bodyElem.innerHTML = `<span style="color:#ff8595;"><b>⚠️ AI chưa phản hồi được.</b><br>${escapeHtml(err)}<br><small>Kiểm tra API key / quota hoặc thử lại sau ít giây.</small></span>`;
      }
    }
    scrollChatBottom();
    lastResult='';
  }
}

function sendQuickPrompt(promptText) {
  routeTo('chat');
  const chatInput = $('chatText');
  if (chatInput) chatInput.value = promptText;
  sendChat(promptText);
}

function localMystic(){
  const profile = getDestinyProfile() || {};
  const name = $('name')?.value || profile.fullName || profile.name || 'Bạn';
  const text=`### Luận giải tử vi cho ${name}\n- **Tổng quan mệnh cục**: Năng lượng bản mệnh đang trong chu kỳ hoàn thiện và tích lũy nội lực.\n- **Sự nghiệp & Tài lộc**: Nên tập trung phát triển thế mạnh cốt lõi, tránh mở rộng phân tán nguồn lực.\n- **Tình duyên & Gia đạo**: Giao tiếp chân thành, lắng nghe và tôn trọng sự khác biệt sẽ giữ hòa khí lâu bền.\n- **Lời khuyên Đặng Năm AI**: Vận mệnh nằm ở tâm tính và hành động thực tế. Hãy giữ tâm sáng và hành thiện tích đức.`;
  $('report').innerHTML=htmlResult('📜 Kết quả tử vi',text);
  saveHistory('Tử vi local',text);
}

async function generateMystic(){
  setLoading('report',true);
  try{
    const profile = getDestinyProfile() || {};
    const payload={
      name: $('name')?.value || profile.fullName || profile.name || 'Đương số',
      birthDate: $('birthDate')?.value || profile.birthDate || '',
      birthTime: $('birthTime')?.value || profile.birthTime || '',
      gender: $('gender')?.value || profile.gender || 'Nam',
      destinyProfile: profile
    };
    const data=await postJSON('/api/mystic-ai',payload);
    const text=data.text||data.result||data.answer||'Không có nội dung trả về.';
    $('report').innerHTML=htmlResult('📜 Kết quả tử vi AI',text);
    saveHistory('Tử vi AI',text);
  }catch(e){
    localMystic();
    toast('AI bận, đã chuyển sang luận giải local');
  }finally{
    setLoading('report',false);
  }
}

function reduceNumber(n, keepMaster=true){
  n = Math.abs(parseInt(n||0,10)||0);
  while(n>9 && !(keepMaster && (n===11 || n===22 || n===33))){
    n = String(n).split('').reduce((s,d)=>s+(parseInt(d,10)||0),0);
  }
  return n;
}
function lettersToNumber(name=''){
  const map={A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
  const clean=String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  return clean.split('').reduce((s,ch)=>s+(map[ch]||0),0);
}
function vowelsToNumber(name=''){
  const vowels='AEIOUY';
  const map={A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
  const clean=String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  return clean.split('').reduce((s,ch)=>s+(vowels.includes(ch)?(map[ch]||0):0),0);
}
function consonantsToNumber(name=''){
  const vowels='AEIOUY';
  const map={A:1,J:1,S:1,B:2,K:2,T:2,C:3,L:3,U:3,D:4,M:4,V:4,E:5,N:5,W:5,F:6,O:6,X:6,G:7,P:7,Y:7,H:8,Q:8,Z:8,I:9,R:9};
  const clean=String(name).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase();
  return clean.split('').reduce((s,ch)=>s+(!vowels.includes(ch)?(map[ch]||0):0),0);
}
function numberMeaning(n){
  const m={1:'độc lập, chủ động, có tố chất dẫn dắt',2:'tinh tế, biết lắng nghe, hợp làm cầu nối',3:'sáng tạo, vui vẻ, giỏi biểu đạt',4:'thực tế, kỷ luật, bền bỉ',5:'tự do, linh hoạt, thích trải nghiệm',6:'ấm áp, trách nhiệm, giàu tình cảm',7:'sâu sắc, trực giác tốt, thích tìm hiểu',8:'tham vọng, quản lý tốt, hướng thành tựu',9:'nhân văn, bao dung, giàu lý tưởng',11:'trực giác mạnh, truyền cảm hứng, nhạy cảm',22:'xây dựng lớn, biến ý tưởng thành hệ thống',33:'chữa lành, yêu thương, phụng sự cộng đồng'};
  return m[n]||'cần thêm dữ liệu để luận kỹ hơn';
}
function localNumerologyReport(name,birth){
  const digits=String(birth||'').replace(/\D/g,'');
  const life=reduceNumber(digits.split('').reduce((s,d)=>s+(+d||0),0));
  const soul=reduceNumber(vowelsToNumber(name));
  const expr=reduceNumber(lettersToNumber(name));
  const personality=reduceNumber(consonantsToNumber(name));
  return `### 🔢 Thần số học tổng quan\n- Họ tên: ${name||'Chưa nhập'}\n- Ngày sinh: ${birth||'Chưa nhập'}\n- Con số chủ đạo: ${life} — ${numberMeaning(life)}.\n- Con số linh hồn: ${soul} — điều bên trong bạn hướng tới: ${numberMeaning(soul)}.\n- Con số biểu đạt: ${expr} — cách bạn thể hiện ra ngoài: ${numberMeaning(expr)}.\n- Con số nhân cách: ${personality} — ấn tượng người khác dễ cảm nhận: ${numberMeaning(personality)}.\n\n### Điểm mạnh\n- Bạn có năng lượng nổi bật của số ${life}: ${numberMeaning(life)}.\n- Khi cân bằng cảm xúc, bạn dễ phát huy tốt năng lực giao tiếp, lựa chọn và kiên trì.\n\n### Điểm cần cân bằng\n- Tránh để cảm xúc nhất thời quyết định thay mục tiêu dài hạn.\n- Nên rèn thói quen ghi chép, lên kế hoạch và kiểm tra lại việc quan trọng.\n\n### Gợi ý tình duyên & công việc\n- Tình duyên: hợp với người biết tôn trọng nhịp sống và cách suy nghĩ của bạn.\n- Công việc: ưu tiên môi trường giúp bạn phát huy điểm mạnh của số ${life}.\n\n### Lưu ý\n- Kết quả thần số học chỉ mang tính tham khảo, không thay thế quyết định thực tế.`;
}
async function generateNumerology(){
  const name=$('numName')?.value||''; const birth=$('numBirth')?.value||''; const focus=$('numFocus')?.value||'Tổng quan';
  if(!String(birth||'').replace(/\D/g,'')){ toast('Vui lòng nhập ngày sinh để tính thần số học'); if($('numerologyResult'))$('numerologyResult').innerHTML=htmlResult('🔢 Kết quả thần số học','Vui lòng nhập ngày sinh hợp lệ trước khi phân tích.'); return; }
  const local=localNumerologyReport(name,birth); setLoading('numerologyResult',true);
  try{
    const prompt=`Luận thần số học tiếng Việt thật chi tiết cho: Họ tên ${name}, ngày sinh ${birth}, trọng tâm ${focus}. Dựa trên bản tính local sau, mở rộng thành báo cáo đẹp, rõ mục, có điểm mạnh/yếu, công việc, tình duyên và lời khuyên thực tế. Không mê tín cực đoan.\n\n${local}`;
    const data=await postJSON('/api/chat-ai',{message:prompt});
    const text=data.text||data.answer||data.result||local;
    $('numerologyResult').innerHTML=htmlResult('🔢 Kết quả thần số học AI',text); saveHistory('Thần số học',text);
  }catch(e){$('numerologyResult').innerHTML=htmlResult('🔢 Kết quả thần số học',local); saveHistory('Thần số học local',local)}
  finally{setLoading('numerologyResult',false)}
}

async function generateLove(){setLoading('loveResult',true);try{const payload={name1:$('loveName1').value,birth1:$('loveBirth1').value,name2:$('loveName2').value,birth2:$('loveBirth2').value,focus:$('loveFocus').value};const data=await postJSON('/api/love-ai',payload);const text=data.text||data.result||data.answer;$('loveResult').innerHTML=htmlResult('💕 Kết quả tình duyên AI',text);saveHistory('Tình duyên',text)}catch(e){const text=`### Tình duyên tham khảo\n- Hai người cần xem sự hòa hợp qua cách giao tiếp, nhịp sống và mục tiêu dài hạn.\n- Điểm mạnh: có thể bổ sung cho nhau nếu biết lắng nghe.\n- Điểm cần tránh: im lặng, thử lòng, nóng vội.\n- Lời khuyên: dùng tử vi như tham khảo, tình cảm thật nằm ở hành động hằng ngày.`;$('loveResult').innerHTML=htmlResult('💕 Kết quả tình duyên',text);saveHistory('Tình duyên local',text)}finally{setLoading('loveResult',false)}}
let desktopWebcamStreams = {};
let desktopWebcamFacing = { face: 'user', palm: 'environment' };
let desktopVisionDataUrls = {};

async function startDesktopWebcam(kind){
  stopDesktopWebcam(kind);
  const isFace = kind === 'face';
  const box = $(isFace ? 'faceWebcamBox' : 'palmWebcamBox');
  const video = $(isFace ? 'faceWebcamVideo' : 'palmWebcamVideo');
  const preview = $(isFace ? 'facePreviewCard' : 'palmPreviewCard');
  if (preview) preview.style.display = 'none';
  if (!box || !video) return;
  box.style.display = 'block';
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast('Trình duyệt chưa hỗ trợ Live Webcam trực tiếp. Vui lòng chọn tải ảnh hoặc chụp bằng máy.');
      box.style.display = 'none';
      return;
    }
    const facing = desktopWebcamFacing[kind] || (isFace ? 'user' : 'environment');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: facing }, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    });
    desktopWebcamStreams[kind] = stream;
    video.srcObject = stream;
    await video.play().catch(()=>{});
  } catch(e) {
    console.warn('Webcam error:', e);
    toast('Không thể mở Camera: ' + (e.message || 'Cần cấp quyền truy cập Camera'));
    box.style.display = 'none';
  }
}

function stopDesktopWebcam(kind){
  const stream = desktopWebcamStreams[kind];
  if (stream) {
    try { stream.getTracks().forEach(t => t.stop()); } catch(e){}
    desktopWebcamStreams[kind] = null;
  }
  const isFace = kind === 'face';
  const box = $(isFace ? 'faceWebcamBox' : 'palmWebcamBox');
  if (box) box.style.display = 'none';
}

function switchDesktopWebcam(kind){
  desktopWebcamFacing[kind] = (desktopWebcamFacing[kind] === 'user') ? 'environment' : 'user';
  startDesktopWebcam(kind);
}

function snapDesktopWebcam(kind){
  const isFace = kind === 'face';
  const video = $(isFace ? 'faceWebcamVideo' : 'palmWebcamVideo');
  if (!video) return;
  const w = video.videoWidth || 640;
  const h = video.videoHeight || 480;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (desktopWebcamFacing[kind] === 'user') {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, w, h);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
  stopDesktopWebcam(kind);
  desktopVisionDataUrls[kind] = dataUrl;
  
  const previewCard = $(isFace ? 'facePreviewCard' : 'palmPreviewCard');
  const previewImg = $(isFace ? 'facePreview' : 'palmPreview');
  const statusText = $(isFace ? 'facePreviewStatusText' : 'palmPreviewStatusText');
  if (previewImg) previewImg.src = dataUrl;
  if (previewCard) previewCard.style.display = 'block';
  if (statusText) statusText.textContent = '✅ Đã chụp ảnh xong - Sẵn sàng xem';
  
  const autoCheckbox = $(isFace ? 'faceAutoAnalyze' : 'palmAutoAnalyze');
  if (autoCheckbox && autoCheckbox.checked) {
    analyzeVision(kind);
  } else {
    toast('Đã chụp ảnh xong! Bấm nút "Xem tướng trực tiếp ngay" để AI phân tích.');
  }
}

async function handleDesktopVisionFile(event, kind){
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const isFace = kind === 'face';
  stopDesktopWebcam(kind);
  try {
    const dataUrl = await fileToDataURL(file);
    desktopVisionDataUrls[kind] = dataUrl;
    const previewCard = $(isFace ? 'facePreviewCard' : 'palmPreviewCard');
    const previewImg = $(isFace ? 'facePreview' : 'palmPreview');
    const statusText = $(isFace ? 'facePreviewStatusText' : 'palmPreviewStatusText');
    if (previewImg) previewImg.src = dataUrl;
    if (previewCard) previewCard.style.display = 'block';
    if (statusText) statusText.textContent = '✅ Ảnh đã tải lên - Sẵn sàng xem';
    
    const autoCheckbox = $(isFace ? 'faceAutoAnalyze' : 'palmAutoAnalyze');
    if (autoCheckbox && autoCheckbox.checked) {
      analyzeVision(kind);
    } else {
      toast('Đã tải ảnh lên! Bấm nút "Xem tướng trực tiếp ngay" để AI phân tích.');
    }
  } catch(e) {
    toast('Lỗi đọc ảnh: ' + e.message);
  }
}

async function analyzeVision(kind){
  const isPalm = kind === 'palm';
  const isFace = !isPalm;
  const resultId = isPalm ? 'palmResult' : 'faceResult';
  const scanBar = $(isFace ? 'faceScanBar' : 'palmScanBar');
  const statusText = $(isFace ? 'facePreviewStatusText' : 'palmPreviewStatusText');
  
  let image = desktopVisionDataUrls[kind] || '';
  if (!image) {
    const fileInput = $(isPalm ? 'palmImage' : 'faceImage');
    if (fileInput && fileInput.files && fileInput.files[0]) {
      image = await fileToDataURL(fileInput.files[0]);
      desktopVisionDataUrls[kind] = image;
    }
  }
  
  const note = $(isPalm ? 'palmNote' : 'faceNote')?.value || '';
  if (!image && !note.trim()) {
    return toast(isFace ? 'Vui lòng chụp ảnh hoặc tải ảnh khuôn mặt lên trước nhé.' : 'Vui lòng chụp ảnh hoặc tải ảnh bàn tay lên trước nhé.');
  }

  setLoading(resultId, true);
  if (scanBar) scanBar.style.display = 'block';
  if (statusText) statusText.textContent = isFace ? '🔍 AI đang quét phân tích ngũ quan & thần thái...' : '🔍 AI đang quét phân tích đường tay...';

  try {
    const payload = {
      mode: isPalm ? 'palm' : 'face',
      image: image,
      palmImage: isPalm ? image : '',
      faceImage: isPalm ? '' : image,
      palmLine: isPalm ? ($('palmLine')?.value || 'Tổng quan các đường tay') : '',
      palmNote: isPalm ? note : '',
      facePart: isPalm ? '' : ($('facePart')?.value || 'Tổng quan ngũ quan & thần thái'),
      faceNote: isPalm ? '' : note,
      geminiModel: 'gemini-3.5-flash-lite',
      clientTime: new Date().toLocaleString('vi-VN')
    };

    const data = await postJSON('/api/vision-ai', payload);
    const text = data.text || data.result || data.answer || 'Không có nội dung trả về từ AI.';
    $(resultId).innerHTML = htmlResult(isPalm ? '🖐 Kết quả xem chỉ tay AI' : '🙂 Kết quả xem tướng trực tiếp AI', text);
    saveHistory(isPalm ? 'Xem chỉ tay' : 'Xem tướng', text);
    if (statusText) statusText.textContent = '✅ Đã hoàn tất phân tích';
  } catch(e) {
    console.error('Vision API error:', e);
    const text = isPalm
      ? `### Chỉ tay tham khảo\n- Sinh đạo: tượng trưng sức bền và nhịp sống.\n- Trí đạo: tượng trưng tư duy, cách quyết định.\n- Tâm đạo: tượng trưng cảm xúc và tình cảm.\n- Ảnh cần rõ lòng bàn tay để AI phân tích sâu hơn.`
      : `### Xem tướng tham khảo\n- Ngũ quan cân đối tạo cảm giác hài hòa và phúc khí.\n- Thần thái sáng, ánh mắt tự tin thể hiện nội lực vững vàng.\n- Kết quả luận giải văn hóa mang tính tham khảo hướng thiện và phát huy thế mạnh cá nhân.`;
    $(resultId).innerHTML = htmlResult(isPalm ? '🖐 Kết quả xem chỉ tay' : '🙂 Kết quả xem tướng', text);
    saveHistory(isPalm ? 'Xem chỉ tay local' : 'Xem tướng local', text);
    if (statusText) statusText.textContent = '⚠️ Đã xem ở chế độ dự phòng';
  } finally {
    setLoading(resultId, false);
    if (scanBar) scanBar.style.display = 'none';
  }
}

async function simpleTool(kind){const map={astrology:['astrologyResult','🪐 Kết quả chiêm tinh',`Cung: ${$('zodiac')?.value||''}\nCâu hỏi: ${$('astroQuestion')?.value||''}`],fengshui:['fengshuiResult','☯ Kết quả phong thủy',`Năm sinh: ${$('fengYear')?.value||''}\nCâu hỏi: ${$('fengAsk')?.value||''}`],tarot:['tarotResult','🃏 Kết quả bói bài',$('tarotAsk')?.value||'']};const [id,title,prompt]=map[kind];setLoading(id,true);try{const data=await postJSON('/api/chat-ai',{message:`${title}. ${prompt}`});const text=data.text||data.answer||data.result;$(id).innerHTML=htmlResult(title,text);saveHistory(title,text)}catch(e){const text=`### ${title}\n- Hiện chưa kết nối được AI server.\n- Nội dung bạn hỏi: ${prompt}\n- Lời khuyên: xem đây là gợi ý tham khảo, nên đối chiếu với tình hình thực tế.`;$(id).innerHTML=htmlResult(title,text);saveHistory(title+' local',text)}finally{setLoading(id,false)}}
async function deepAnalyze(){const q=$('deepAsk').value.trim();if(!q)return toast('Nhập chủ đề đã nhé');setLoading('deepResult',true);try{const data=await postJSON('/api/chat-ai',{message:`Phân tích sâu theo nhiều lớp, rõ ràng, có lời khuyên thực tế: ${q}`});const text=data.text||data.answer||data.result;$('deepResult').innerHTML=htmlResult('🤯 AI phân tích sâu',text);saveHistory('AI phân tích sâu',text)}catch(e){const text=`### Phân tích sâu local\n- Vấn đề: ${q}\n- Lớp 1: xác định mục tiêu thật sự.\n- Lớp 2: xem rủi ro, nguồn lực, thời gian.\n- Lớp 3: chọn bước nhỏ làm ngay hôm nay.\n- Lời khuyên: đừng ôm quá nhiều hướng cùng lúc.`;$('deepResult').innerHTML=htmlResult('🤯 AI phân tích sâu',text);saveHistory('AI phân tích sâu local',text)}finally{setLoading('deepResult',false)}}

let cachedFirebaseConfig = null;
async function fetchFirebaseConfig() {
  if (cachedFirebaseConfig) return cachedFirebaseConfig;
  try {
    const res = await fetch('/api/auth/firebase-config');
    const data = await res.json();
    if (data.ok && data.enabled && data.config) {
      cachedFirebaseConfig = data.config;
      return cachedFirebaseConfig;
    }
  } catch(e) {
    console.warn('Fetch Firebase config error:', e);
  }
  return null;
}

async function getFirebase(){
  if (typeof window === 'undefined' || !window.firebase) {
    throw new Error('Firebase SDK chưa được tải trên trình duyệt.');
  }
  if (!window.firebase.apps || !window.firebase.apps.length) {
    const cfg = await fetchFirebaseConfig();
    if (!cfg || !cfg.apiKey) {
      throw new Error('Chưa cấu hình Firebase trên máy chủ.');
    }
    window.firebase.initializeApp(cfg);
  }
  return window.firebase;
}

async function initFirebaseAuth(){
  try {
    const fb = await getFirebase();
    const hint = $('socialLoginHint');
    if (hint) hint.textContent = 'Đăng nhập nhanh đã sẵn sàng.';
    return { enabled: true, fb };
  } catch (e) {
    console.warn('Firebase init:', e.message);
    const hint = $('socialLoginHint');
    if (hint) hint.textContent = 'Đăng nhập nhanh chưa khả dụng.';
    return { enabled: false };
  }
}

let currentDesktopAuthMode = 'login';

function setDesktopAuthMode(mode) {
  currentDesktopAuthMode = mode;
  const isReg = mode === 'register';

  const tabLogin = $('tabAuthLogin');
  const tabReg = $('tabAuthRegister');
  if (tabLogin) tabLogin.className = 'auth-tab-btn' + (!isReg ? ' active' : '');
  if (tabReg) tabReg.className = 'auth-tab-btn' + (isReg ? ' active' : '');

  const title = $('authFormTitle');
  if (title) title.textContent = isReg ? '📝 Đăng ký tài khoản mới' : '🔐 Đăng nhập tài khoản';

  const sub = $('authFormSub');
  if (sub) sub.textContent = isReg ? 'Tạo tài khoản để cá nhân hóa luận giải và đồng bộ đa thiết bị.' : 'Đăng nhập để đồng bộ Hồ Sơ Bản Mệnh, lịch sử và cài đặt AI.';

  const nameGrp = $('authNameGroup');
  if (nameGrp) nameGrp.style.display = isReg ? 'block' : 'none';

  const planGrp = $('authPlanGroup');
  if (planGrp) planGrp.style.display = isReg ? 'block' : 'none';

  const btn = $('authSubmitBtn');
  if (btn) {
    btn.innerHTML = isReg ? '📝 Đăng ký tài khoản' : '🔐 Đăng nhập';
  }

  const prompt = $('authSwitchPrompt');
  if (prompt) prompt.textContent = isReg ? 'Đã có tài khoản?' : 'Chưa có tài khoản?';

  const switchBtn = $('authSwitchBtn');
  if (switchBtn) switchBtn.textContent = isReg ? 'Đăng nhập ngay' : 'Đăng ký ngay';
}

function toggleDesktopAuthMode() {
  setDesktopAuthMode(currentDesktopAuthMode === 'login' ? 'register' : 'login');
}

function submitAuthForm() {
  if (currentDesktopAuthMode === 'register') {
    registerAccount();
  } else {
    loginAccount();
  }
}

async function socialLogin(provider){
  try{
    toast(`Đang mở cửa sổ đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'}...`);
    const fb = await getFirebase();
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
    const data = await postJSON('/api/auth/social', {
      provider,
      uid: fbUser.uid,
      email: fbUser.email,
      name: fbUser.displayName || (provider === 'google' ? 'Google User' : 'Facebook User'),
      avatar: fbUser.photoURL || '',
      idToken: idToken
    });
    localStorage.setItem('synam_user', JSON.stringify(data.user));
    localStorage.setItem('synam_token', data.token || '');
    localStorage.setItem('synam_profile', JSON.stringify({ name: data.user.name, email: data.user.email, plan: data.user.plan || 'Free' }));
    if ($('profileName')) $('profileName').value = data.user.name || '';
    if ($('profileEmail')) $('profileEmail').value = data.user.email || '';
    if ($('profilePlan')) $('profilePlan').value = data.user.plan || 'Free';
    if ($('profilePassword')) $('profilePassword').value = '';
    setAccountStatus(data.user, 'Đăng nhập bằng ' + (provider === 'google' ? 'Google' : 'Facebook') + ' thành công.');
    toast(`Đăng nhập thành công! Chào mừng ${data.user.name || data.user.email}`);
    await loadBirthProfileFromCloud();
  }catch(error){
    console.error('Social login error:', error);
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      return;
    }
    if (error.code === 'auth/unauthorized-domain') {
      alert('Tên miền ' + window.location.hostname + ' chưa được cấp quyền trong Firebase Console.\n\nVui lòng vào Firebase Console -> Authentication -> Settings -> Authorized domains -> Thêm "' + window.location.hostname + '" vào danh sách để hoàn tất.');
      return;
    }
    if (error.code === 'auth/operation-not-allowed') {
      alert(`Phương thức đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} chưa được kích hoạt trong Firebase Console (dự án dangnam-tuvi).\n\n👉 Bạn hãy vào Firebase Console -> Authentication -> Sign-in method -> Bật ${provider === 'google' ? 'Google' : 'Facebook'}.\n\nHiện tại bạn có thể đăng ký và đăng nhập tức thì bằng Email / Mật khẩu ở form bên dưới!`);
      return;
    }
    toast(error?.message || 'Đăng nhập mạng xã hội lỗi');
  }
}

async function refreshSession(){
  const token = localStorage.getItem('synam_token');
  if(!token) return;
  try{
    const res = await fetch('/api/auth/me', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (res.status === 401) {
      localStorage.removeItem('synam_token');
      localStorage.removeItem('synam_user');
      setAccountStatus(null);
      return;
    }
    if (res.ok) {
      const data = await res.json();
      if (data && data.user) {
        localStorage.setItem('synam_user', JSON.stringify(data.user));
        setAccountStatus(data.user, 'Phiên đăng nhập còn hiệu lực.');
      }
    }
  }catch(e){
    console.warn('refreshSession note:', e.message);
  }
}

async function logoutAccount(){
  try{ await postJSON('/api/auth/logout', {}); }catch{}
  try {
    if (window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.auth) {
      await window.firebase.auth().signOut().catch(() => {});
    }
  } catch(e) {}
  localStorage.removeItem('synam_token');
  localStorage.removeItem('synam_user');
  if ($('profilePassword')) $('profilePassword').value = '';
  setAccountStatus(null, 'Đã đăng xuất.');
  toast('Đã đăng xuất tài khoản thành công');
}

function currentProfile(){
  return {
    name: $('profileName')?.value?.trim() || 'Thành viên',
    email: $('profileEmail')?.value?.trim() || '',
    password: $('profilePassword')?.value || '',
    plan: $('profilePlan')?.value || 'Free'
  };
}

function setAccountStatus(user, msg = ''){
  const box = $('accountStatus');
  const pill = document.querySelector('.profile-pill');
  if(user){
    const avatar = user.avatar ? `<img class="account-avatar" src="${escapeHtml(user.avatar)}" alt="avatar">` : '<div class="account-avatar fake">👤</div>';
    const providers = (user.providers || []).map(p => p === 'google' ? 'Google' : p === 'facebook' ? 'Facebook' : p).join(', ') || 'Email/Mật khẩu';
    if (box) {
      box.innerHTML = `
        <div class="account-ok">
          <div class="account-head">
            ${avatar}
            <div>
              <h3>✅ Đã đăng nhập</h3>
              <p><b>${escapeHtml(user.name || 'Thành viên')}</b><br><small style="color:#00f0ff;">${escapeHtml(user.email || '')}</small></p>
            </div>
          </div>
          <p>Gói dịch vụ: <b>${escapeHtml(user.plan || 'Free')}</b> · Đăng nhập qua: <b>${escapeHtml(providers)}</b></p>
          ${msg ? `<p style="color:#4ade80; font-size:12px; margin:4px 0;">${escapeHtml(msg)}</p>` : ''}
          <div style="display:flex; gap:8px; margin-top:12px; flex-wrap:wrap;">
            <button type="button" class="primary" onclick="openDestinyProfileModal()">📜 Hồ Sơ Bản Mệnh</button>
            <button type="button" onclick="logoutAccount()" style="background:rgba(239,68,68,0.2); border:1px solid rgba(239,68,68,0.5); color:#ff8888;">🚪 Đăng xuất</button>
          </div>
        </div>
      `;
    }
    if (pill) {
      pill.innerHTML = `<span class="avatar">👤</span> ${escapeHtml(user?.name || 'Tài khoản')} <b>${escapeHtml(user?.plan || 'Free')}</b>`;
    }
  }else{
    if (box) {
      box.innerHTML = `
        <div class="account-warn">
          <h3>🔐 Chưa đăng nhập</h3>
          <p>Đăng nhập hoặc đăng ký để lưu giữ vĩnh viễn Hồ Sơ Bản Mệnh, lịch sử luận giải tử vi và đồng bộ đa thiết bị.</p>
        </div>
      `;
    }
    if (pill) {
      pill.innerHTML = `<span class="avatar">👤</span> Tài khoản <b>Guest</b>`;
    }
  }
}

function loadAccount(){
  try{
    const user = JSON.parse(localStorage.getItem('synam_user') || 'null');
    const profile = JSON.parse(localStorage.getItem('synam_profile') || 'null');
    if(profile){
      if($('profileName') && !$('profileName').value) $('profileName').value = profile.name || '';
      if($('profileEmail') && !$('profileEmail').value) $('profileEmail').value = profile.email || '';
      if($('profilePlan')) $('profilePlan').value = profile.plan || 'Free';
    }
    setAccountStatus(user);
    initFirebaseAuth();
    refreshSession();
  }catch{
    setAccountStatus(null);
    initFirebaseAuth();
  }
}

function saveAccount(){
  const p = currentProfile();
  localStorage.setItem('synam_profile', JSON.stringify({ name: p.name, email: p.email, plan: p.plan }));
  toast('Đã lưu hồ sơ local');
  setAccountStatus(JSON.parse(localStorage.getItem('synam_user') || 'null'));
}

async function registerAccount(){
  const p = currentProfile();
  if(!p.email || !p.password){
    toast('Vui lòng nhập đầy đủ email và mật khẩu');
    return;
  }
  if(p.password.length < 6){
    toast('Mật khẩu tối thiểu 6 ký tự');
    return;
  }
  try{
    const data = await postJSON('/api/auth/register', { name: p.name, email: p.email, password: p.password });
    localStorage.setItem('synam_user', JSON.stringify(data.user));
    localStorage.setItem('synam_token', data.token || '');
    localStorage.setItem('synam_profile', JSON.stringify({ name: p.name, email: p.email, plan: data.user.plan || 'Free' }));
    if ($('profilePassword')) $('profilePassword').value = '';
    setAccountStatus(data.user, 'Tài khoản đã tạo thành công trên server.');
    toast('Đăng ký tài khoản thành công!');
    await loadBirthProfileFromCloud();
  }catch(e){
    toast(parseError(e));
  }
}

async function loginAccount(){
  const p = currentProfile();
  if(!p.email || !p.password){
    toast('Vui lòng nhập email và mật khẩu');
    return;
  }
  try{
    const data = await postJSON('/api/auth/login', { email: p.email, password: p.password });
    localStorage.setItem('synam_user', JSON.stringify(data.user));
    localStorage.setItem('synam_token', data.token || '');
    localStorage.setItem('synam_profile', JSON.stringify({ name: data.user.name, email: data.user.email, plan: data.user.plan || 'Free' }));
    if($('profileName')) $('profileName').value = data.user.name || '';
    if($('profilePlan')) $('profilePlan').value = data.user.plan || 'Free';
    if ($('profilePassword')) $('profilePassword').value = '';
    setAccountStatus(data.user, 'Đăng nhập thành công.');
    toast(`Đăng nhập thành công! Chào mừng ${data.user.name || data.user.email}`);
    await loadBirthProfileFromCloud();
  }catch(e){
    toast(parseError(e));
  }
}
window.addEventListener('DOMContentLoaded',init);


async function loadAIProviders(){
  const grid=$('aiProviderGrid');
  const status=$('aiProviderStatus');
  try{
    const data=await getJSON('/api/ai/providers');
    const providers=data.providers||[];
    if(status){
      status.innerHTML=providers.map(p=>`<div class="ai-status-item"><span><span class="provider-dot ${p.configured?'ok':''}"></span><b>${escapeHtml(p.label)}</b><br><span class="model-small">${escapeHtml(p.model||'auto')} · ${p.configured?'Đã cấu hình':'Chưa có key'}</span></span><span>${p.configured?'🟢':'⚪'}</span></div>`).join('');
    }
    const mini=$('miniProviderList');
    if(mini){mini.innerHTML=providers.map(p=>`<div class="mini-provider ${p.configured?'on':''}"><span>${p.configured?'🟢':'⚪'} ${escapeHtml(p.label)}</span><small>${p.configured?'Ready':'No key'}</small></div>`).join('')}
    if(grid){
      grid.innerHTML=providers.map(p=>`<div class="ai-provider-card"><h3><span class="provider-dot ${p.configured?'ok':''}"></span>${escapeHtml(p.label)}</h3><label>API Key<input id="key_${p.id}" type="password" autocomplete="off" placeholder="${p.configured?'Đã lưu key ẩn an toàn':'Dán API key'}"></label><label>Model<select id="model_${p.id}"><option value="">Mặc định: ${escapeHtml(p.model||'auto')}</option>${(p.models||[]).map(m=>`<option value="${escapeHtml(m)}">${escapeHtml(m)}</option>`).join('')}</select></label><p class="ai-note">${escapeHtml(p.freeHint||'')}</p></div>`).join('');
    }
    const select=$('chatProvider');
    if(select){
      [...select.options].forEach(opt=>{ if(opt.value&&opt.value!=='auto'){ const p=providers.find(x=>x.id===opt.value); opt.disabled=p&&!p.configured; }});
    }
  }catch(e){
    if(status)status.innerHTML=`<p class="error">Không tải được Multi-AI: ${escapeHtml(parseError(e))}</p>`;
  }
}

async function saveAIKeys(){
  const providers=['gemini','groq','openrouter','openai','claude','deepseek','grok','qwen','mistral'];
  const keys={}; const models={};
  for(const id of providers){
    const k=$('key_'+id)?.value?.trim()||'';
    const m=$('model_'+id)?.value?.trim()||'';
    if(k && !k.includes('...') && !/^\*+$/.test(k)) keys[id]=k;
    if(m) models[id]=m;
  }
  try{
    const data=await postJSON('/api/ai/user-keys',{keys,models});
    toast('Đã lưu API key Multi-AI');
    loadAIProviders();
  }catch(e){
    toast(parseError(e));
  }
}

setTimeout(autoResizeChatText, 300);

// ===== NAM33 REAL DASHBOARD + FUNCTIONAL CARDS =====
function nam33Stats(){
  try{return JSON.parse(localStorage.getItem('synam_stats')||'{}')}catch{return {}}
}
function saveNam33Stats(s){localStorage.setItem('synam_stats',JSON.stringify(s||{}))}
function incNam33Stat(key,amount=1){
  const s=nam33Stats();
  if(!s.startedAt) s.startedAt=new Date().toISOString();
  s[key]=(Number(s[key]||0)+amount);
  s.updatedAt=new Date().toISOString();
  saveNam33Stats(s);
  renderNam33Stats();
}
const nam33OldSaveHistory = typeof saveHistory==='function' ? saveHistory : null;
saveHistory=function(type,content){
  const t=String(type||'Phân tích');
  if(nam33OldSaveHistory) nam33OldSaveHistory(t,content); else {
    const list=JSON.parse(localStorage.getItem('synam_history')||'[]');
    list.unshift({type:t,content,at:new Date().toLocaleString('vi-VN')});
    localStorage.setItem('synam_history',JSON.stringify(list.slice(0,80)));
  }
  const low=t.toLowerCase();
  incNam33Stat('analysis',1);
  if(/chat|ai/i.test(t)) incNam33Stat('chat',1);
  if(/ảnh|image|chỉ tay|tướng|file|vision/i.test(t)) incNam33Stat('image',1);
  renderHistory();
};
renderHistory=function(){
  let list=[];
  try{list=JSON.parse(localStorage.getItem('synam_history')||'[]')}catch{}
  const mini=$('historyMini');
  if($('statCount')) $('statCount').textContent=list.length;
  if(mini){
    mini.innerHTML=list.length?list.slice(0,4).map((x,i)=>`<div class="history-mini-item" onclick="event.stopPropagation();showHistory('${encodeURIComponent(x.content||'')}')"><span>${escapeHtml(x.type||'Phân tích')}</span><small>${escapeHtml(x.at||'')}</small></div>`).join(''):'<p>Chưa có lịch sử.</p><small>Hãy chat AI / xem chỉ tay / xem tướng, kết quả sẽ lưu ở đây.</small>';
  }
  const full=$('historyList');
  if(full){
    full.innerHTML=list.length?list.map((x,i)=>`<div class="history-item"><div><b>${escapeHtml(x.type||'Phân tích')}</b><br><small>${escapeHtml(x.at||'')}</small></div><button onclick="showHistory('${encodeURIComponent(x.content||'')}')">Chi tiết</button></div>`).join(''):'<p>Chưa có lịch sử phân tích.</p>';
  }
  renderNam33Stats();
};
function exportHistoryTxt(event){
  event?.stopPropagation?.();
  let list=[];try{list=JSON.parse(localStorage.getItem('synam_history')||'[]')}catch{}
  if(!list.length){toast('Chưa có lịch sử để xuất');return}
  const text=list.map((x,i)=>`# ${i+1}. ${x.type||'Phân tích'}\nThời gian: ${x.at||''}\n\n${x.content||''}\n`).join('\n-------------------------\n\n');
  const blob=new Blob([text],{type:'text/plain;charset=utf-8'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='synam-lich-su-phan-tich.txt';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('Đã xuất lịch sử TXT');
}
const nam33OldClearHistory = typeof clearHistory==='function' ? clearHistory : null;
clearHistory=function(){
  if(!confirm('Xóa toàn bộ lịch sử phân tích?')) return;
  localStorage.removeItem('synam_history');
  renderHistory();
  toast('Đã xóa lịch sử');
};
function renderNam33Stats(){
  const s=nam33Stats();
  const history=JSON.parse(localStorage.getItem('synam_history')||'[]');
  const started=s.startedAt?new Date(s.startedAt):new Date();
  const days=Math.max(1,Math.ceil((Date.now()-started.getTime())/86400000));
  const analysis=Number(s.analysis||history.length||0);
  const chat=Number(s.chat||history.filter(x=>/chat|ai/i.test(x.type||'')).length||0);
  const img=Number(s.image||history.filter(x=>/ảnh|image|chỉ tay|tướng|file|vision/i.test(x.type||'')).length||0);
  if($('statCount')) $('statCount').textContent=analysis;
  if($('statChatCount')) $('statChatCount').textContent=chat;
  if($('statImageCount')) $('statImageCount').textContent=img;
  if($('statDaysUsed')) $('statDaysUsed').textContent=days;
  if($('nam33StatPercent')) $('nam33StatPercent').textContent=Math.min(100,Math.round((analysis/20)*100))+'%';
}
function resetNam33Stats(event){
  event?.stopPropagation?.();
  if(!confirm('Reset thống kê? Lịch sử vẫn giữ nguyên.')) return;
  localStorage.removeItem('synam_stats');renderNam33Stats();toast('Đã reset thống kê');
}
function syncHomeVoiceSelect(){
  const home=$('homeVoiceSelect'), main=$('voiceSelect');
  if(home && main){main.value=home.value;saveVoicePrefs();toast('Đã chọn giọng: '+home.options[home.selectedIndex].text)}
}
function syncHomeVoiceRate(){
  const home=$('homeVoiceRate'), main=$('voiceRate');
  if(home && main){main.value=home.value;saveVoicePrefs()}
}
function syncNam33VoiceHome(){
  try{
    refreshVoiceList?.();
    const main=$('voiceSelect'), home=$('homeVoiceSelect');
    if(main && home){home.innerHTML=main.innerHTML;home.value=main.value||'auto'}
    const rate=$('voiceRate'), homeRate=$('homeVoiceRate');
    if(rate && homeRate) homeRate.value=rate.value||'1';
  }catch{}
}
const nam33OldSpeakLastResult = typeof speakLastResult==='function' ? speakLastResult : null;
speakLastResult=function(){
  if(!lastResult){
    let list=[];try{list=JSON.parse(localStorage.getItem('synam_history')||'[]')}catch{}
    if(list[0]?.content) lastResult=list[0].content;
  }
  if(!lastResult){toast('Chưa có kết quả để đọc. Hãy chat hoặc phân tích trước nhé.');return}
  speakText(lastResult,true);
};
window.addEventListener('DOMContentLoaded',()=>{
  setTimeout(()=>{renderHistory();renderNam33Stats();syncNam33VoiceHome();},350);
  setTimeout(syncNam33VoiceHome,1400);
});
// ===== END NAM33 =====


// NAM45: đăng ký PWA sau khi trang đã tải, không chặn giao diện nếu browser không hỗ trợ.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js').catch(() => {}));
}

async function analyzeDeep() {
  setLoading('deepResult', true);
  try {
    const payload = {
      name: $('deepName').value,
      birth: $('deepBirth').value,
      ask: $('deepAsk').value,
      focus: $('deepFocus').value
    };
    if (!payload.ask) throw new Error("Vui lòng nhập vấn đề cần hỏi.");
    const data = await postJSON('/api/deep-ai', payload);
    const text = data.text || data.reply || data.answer || 'Không có kết quả trả về.';
    $('deepResult').innerHTML = htmlResult('🧠 KẾT QUẢ PHÂN TÍCH SÂU ĐA LỚP', text);
    saveHistory('Phân tích sâu', text);
    toast('Đã phân tích xong!');
  } catch(e) {
    $('deepResult').innerHTML = `<h2>Lỗi</h2><p>${e.message}</p>`;
    toast('Lỗi khi phân tích sâu: ' + e.message);
  } finally {
    setLoading('deepResult', false);
  }
}

// App Modal Handlers
function openAppModal() {
  document.getElementById('appDownloadModal').classList.add('show');
}
function closeAppModal() {
  document.getElementById('appDownloadModal').classList.remove('show');
}
// NAM45: Service worker auto-refresh
function synamRefreshServiceWorker() {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  let didReload = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (didReload) return;
    didReload = true;
    window.location.reload();
  }, { once: true });
  navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' })
    .then(async registration => {
      await registration.update();
      if (registration.waiting) registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        installing?.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(error => console.warn('Service Worker update check failed:', error));
}
window.addEventListener('load', synamRefreshServiceWorker, { once: true });

async function drawTarotDesktop() {
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
  const q = $('tarotAsk')?.value || '';
  const deck = [...cards].sort(()=>Math.random()-.5).slice(0,3);
  
  const container = $('desktopTarotCards');
  if (container) {
    container.innerHTML = deck.map(c => `<div style="flex:1;text-align:center;"><img src="${c.img}" style="width:100%;max-width:120px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.5);"><div style="font-size:12px;margin-top:8px;color:#ffd700;">${c.name}</div></div>`).join('');
  }

  const deckNames = deck.map(c=>c.name);
  const title = '🃏 Kết quả bài Tarot';
  const id = 'tarotResult';
  setLoading(id, true);
  try {
    const data = await postJSON('/api/multi-ai/chat', { message: `Xem bài tarot tham khảo. Câu hỏi: ${q}. Ba lá: ${deckNames.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.`, provider: 'auto' });
    const text = data.text || data.answer || data.result;
    $(id).innerHTML = htmlResult(title, text);
    saveHistory(title, text);
  } catch(e) {
    $(id).innerHTML = htmlResult(title, 'AI chưa phản hồi được. Vui lòng thử lại.');
  } finally {
    setLoading(id, false);
  }
}

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

function renderDesktopZodiac() {
  const grid = $('desktopZodiacGrid');
  if(!grid) return;
  grid.innerHTML = zodiacs.map(z => `
    <div class="zodiac-item" onclick="selectZodiac('${z.id}')" id="zodiac-${z.id}" style="background:rgba(255,255,255,0.05); border:1px solid transparent; border-radius:8px; padding:10px 5px; text-align:center; cursor:pointer; transition:0.3s;">
      <div style="font-size:24px;">${z.icon}</div>
      <div style="font-size:13px; font-weight:bold; margin-top:4px; color:#fff;">${z.id}</div>
      <div style="font-size:11px; color:#aaa; margin-top:2px;">${z.date}</div>
    </div>
  `).join('');
}

function selectZodiac(id) {
  $('zodiac').value = id;
  zodiacs.forEach(z => {
    const el = $('zodiac-' + z.id);
    if(el) {
      if(z.id === id) {
        el.style.background = 'rgba(255,215,0,0.2)';
        el.style.borderColor = '#ffd700';
      } else {
        el.style.background = 'rgba(255,255,255,0.05)';
        el.style.borderColor = 'transparent';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', renderDesktopZodiac);


// Lắng nghe Firebase Auth để tự động đồng bộ Hồ Sơ Bản Mệnh từ Firestore
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    try {
      if (window.firebase && window.firebase.apps && window.firebase.apps.length && window.firebase.auth) {
        window.firebase.auth().onAuthStateChanged(async (user) => {
          if (user) {
            await loadBirthProfileFromCloud();
          }
        });
      }
    } catch(e) {}
  });
}


function updateChatDestinyContextBar() {
  const p = getBirthProfile();
  const bar = document.getElementById('chatDestinyContextBar');
  const textEl = document.getElementById('chatDestinyContextText');
  const sideCard = document.getElementById('sidebarDestinyCard');
  const welcomeTitle = document.getElementById('mysticWelcomeTitle');

  const hasP = Boolean(p && (p.fullName || p.name) && p.birthDate);
  const name = hasP ? (p.fullName || p.name) : '';
  const bDate = hasP ? p.birthDate : '';
  const menh = hasP ? (p.menh || 'Bản mệnh') : '';

  if (textEl) {
    if (hasP) {
      textEl.innerHTML = `✨ Ngữ cảnh: <b>${escapeHtml(name)}</b> • ${escapeHtml(bDate)} • Mệnh <b>${escapeHtml(menh)}</b>`;
    } else {
      textEl.innerHTML = `⚠️ Chưa gắn hồ sơ bản mệnh • <span style="text-decoration:underline;">Nhập ngày sinh giúp AI luận chuẩn 100%</span>`;
    }
  }

  if (sideCard) {
    if (hasP) {
      sideCard.innerHTML = `<div class="side-destiny-box"><b>📜 ${escapeHtml(name)}</b><p>${escapeHtml(bDate)} • ${escapeHtml(menh)}</p><button type="button" onclick="openDestinyProfileModal()">Sửa hồ sơ</button></div>`;
    } else {
      sideCard.innerHTML = `<div class="side-destiny-box empty"><p>Chưa có hồ sơ bản mệnh</p><button type="button" onclick="openDestinyProfileModal()">+ Tạo hồ sơ</button></div>`;
    }
  }

  if (welcomeTitle && hasP) {
    welcomeTitle.textContent = `Chào ${name}, Đặng Năm AI sẵn sàng luận giải!`;
  }
}


function handleChatLogScroll(el) {
  if (!el) return;
  const isUp = (el.scrollHeight - el.scrollTop - el.clientHeight) > 130;
  userChatScrolledUp = isUp;
  const btn = document.getElementById('scrollBottomBtn');
  if (btn) {
    btn.style.display = isUp ? 'inline-flex' : 'none';
  }
}

function handleSendOrStopChat() {
  if (isChatStreaming) {
    stopCurrentChatStream();
  } else {
    sendChat();
  }
}

function stopCurrentChatStream() {
  if (currentChatAbortController) {
    try {
      currentChatAbortController.abort();
    } catch(e) {}
    currentChatAbortController = null;
  }
  isChatStreaming = false;
  setChatSendBtnState(false);
  const cursor = document.querySelector('.streaming-cursor');
  if (cursor) cursor.remove();
  toast('Đã dừng tạo phản hồi');
}

function setChatSendBtnState(streaming) {
  isChatStreaming = streaming;
  const btn = document.getElementById('chatSendBtn');
  if (!btn) return;
  if (streaming) {
    btn.classList.add('is-generating');
    btn.innerHTML = '<span class="send-label">⏹️ Dừng</span>';
    btn.title = 'Bấm để dừng tạo câu trả lời';
  } else {
    btn.classList.remove('is-generating');
    btn.innerHTML = '<span class="send-label">➤ Gửi</span>';
    btn.title = 'Gửi tin nhắn';
  }
}

// Initialize Chat Destiny Context Bar
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => { try { updateChatDestinyContextBar(); } catch(e) {} }, 800);
});
