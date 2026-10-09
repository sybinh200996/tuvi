const routes=[['home','Trang Chủ','home'],['tuvi','Tử Vi','tuvi'],['palm','Xem Chỉ Tay','palm'],['face','Xem Tướng','face'],['astrology','Chiêm Tinh','astro'],['love','Tình Duyên','love'],['numerology','Thần Số Học','num'],['chat','AI Chat','chat'],['ai','Multi AI','deep'],['fengshui','Phong Thủy','feng'],['tarot','Bói Bài','tarot'],['history','Lịch Sử','history']];
let lastResult='';
const $=id=>document.getElementById(id);
function init(){renderTabs();syncMobileChatSettings();renderHistory();loadAccount();loadVoicePrefs();initVietnameseVoices();startClock();const firstRoute=location.hash?.replace('#/','')||(window.matchMedia&&window.matchMedia('(max-width: 760px)').matches?'chat':'home');routeTo(firstRoute,false);window.addEventListener('hashchange',()=>routeTo(location.hash.replace('#/','')||'home',false));checkGeminiStatus();loadAIProviders();}
function syncMobileChatSettings(){
  const details=document.querySelector('.chat-mobile-settings');
  if(!details||!window.matchMedia)return;
  const query=window.matchMedia('(max-width:760px)');
  details.open=!query.matches;
  if(!details.dataset.responsiveBound&&query.addEventListener){
    query.addEventListener('change',event=>{details.open=!event.matches;});
    details.dataset.responsiveBound='true';
  }
}
function tabIcon(icon){return `<span class="holo-icon icon-${icon}"><i></i></span>`}
function renderTabs(){const html=routes.map(([id,name,ico])=>`<button class="tab-card" data-route="${id}" onclick="routeTo('${id}')">${tabIcon(ico)}<span>${name}</span></button>`).join('');$('featureTabs').innerHTML=html;$('sideLinks').innerHTML=routes.concat([['deep','AI phân tích sâu','deep'],['ai','Cài đặt Multi-AI','deep'],['account','Tài khoản','account']]).map(([id,name,ico])=>`<button class="link" onclick="routeTo('${id}');toggleMenu(false)">${tabIcon(ico)} <span>${name}</span></button>`).join('')}
function routeTo(route,push=true){
  if(!route)route='home';
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const page=$('page-'+route)||$('page-home');
  page.classList.add('active');
  document.body.dataset.route=route;
    document.documentElement.dataset.route=route;
  document.querySelectorAll('.tab-card').forEach(t=>t.classList.toggle('active',t.dataset.route===route));
  document.querySelectorAll('.bottom-nav button').forEach(btn=>btn.classList.remove('active'));
  document.querySelectorAll('.side-menu button.link').forEach(btn=>btn.classList.remove('active'));
  if(push) location.hash='#/'+route;
  requestAnimationFrame(()=>{
    const targetTop=Math.max(0,page.getBoundingClientRect().top+window.pageYOffset-18);
    const mobileChat=route==='chat'&&window.matchMedia&&window.matchMedia('(max-width:760px)').matches;
    window.scrollTo({top:mobileChat?0:targetTop,behavior:'smooth'});
    if(window.matchMedia&&window.matchMedia('(max-width:760px)').matches){
      const rail=$('featureTabs'),active=rail?.querySelector('.tab-card.active');
      if(rail&&active){const rr=rail.getBoundingClientRect(),ar=active.getBoundingClientRect();rail.scrollTo({left:rail.scrollLeft+ar.left-rr.left-(rail.clientWidth-ar.width)/2,behavior:'smooth'});}
    }
    const scrollers=page.querySelectorAll('.chat-log,.pro-chat-log,.result-panel,.side-menu');
    scrollers.forEach(el=>{try{el.scrollTop=0}catch{}});
  });
}
function toggleMenu(open){$('sideMenu').classList.toggle('open',open);$('menuShade').classList.toggle('open',open)}

function escapeHtml(str=''){return String(str).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function parseError(e){const raw=String(e?.message||e||'Lỗi không xác định');try{const j=JSON.parse(raw);let msg=j.error||raw;if(Array.isArray(j.attempts)&&j.attempts.length){msg+='\n\nCác model đã thử:\n'+j.attempts.map(a=>`- ${a.model}: ${a.error}`).join('\n')}return msg}catch{return raw.replace(/^Error:\s*/,'')}}
function startClock(){const tick=()=>{const el=$('liveClock');if(el)el.textContent=new Date().toLocaleString('vi-VN',{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});};tick();setInterval(tick,30000)}
async function checkGeminiStatus(){const el=$('geminiStatus');if(!el)return;try{const h=await fetch('/api/health').then(r=>r.json());el.textContent=h.hasGeminiKey?'Gemini: đã cấu hình API key':'Gemini: chưa có API key';el.className=h.hasGeminiKey?'ai-status ok':'ai-status warn'}catch(e){
    const text = window.MysticEngine ? 
      (isPalm ? window.MysticEngine.Palmistry.analyze(note, $('palmLine').value) : window.MysticEngine.Face.analyze(note, $('facePart').value)) 
      : (isPalm ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt');
    $(resultId).innerHTML = htmlResult(isPalm ? '🖐 Kết quả xem chỉ tay' : '🧑 Kết quả xem tướng', text);
    saveHistory(isPalm ? 'Xem chỉ tay local' : 'Xem tướng local', text);
  }finally{setLoading(resultId,false)}}
async function simpleTool(kind){const map={astrology:['astrologyResult','🪐 Kết quả chiêm tinh',`Cung: ${$('zodiac')?.value||''}\nCâu hỏi: ${$('astroQuestion')?.value||''}`],fengshui:['fengshuiResult','☯ Kết quả phong thủy',`Năm sinh: ${$('fengYear')?.value||''}\nCâu hỏi: ${$('fengAsk')?.value||''}`],tarot:['tarotResult','🃏 Kết quả bói bài',$('tarotAsk')?.value||'']};const [id,title,prompt]=map[kind];setLoading(id,true);try{const data=await postJSON('/api/chat-ai',{message:`${title}. ${prompt}`});const text=data.text||data.answer||data.result;$(id).innerHTML=htmlResult(title,text);saveHistory(title,text)}catch(e){
  let text = `### ${title}
- Hiện chưa kết nối được AI server.
- Nội dung: ${prompt}
- Lời khuyên: Hãy dựa vào bản thân.`;
  if (kind === 'tarot' && window.MysticEngine) text = window.MysticEngine.Tarot.draw($('tarotAsk')?.value);
  if (kind === 'astrology' && window.MysticEngine) text = window.MysticEngine.Zodiac.analyze($('zodiac')?.value, $('astroQuestion')?.value);
  $(id).innerHTML=htmlResult(title,text);saveHistory(title+' local',text)
}finally{setLoading(id,false)}}
async function deepAnalyze(){const q=$('deepAsk').value.trim();if(!q)return toast('Nhập chủ đề đã nhé');setLoading('deepResult',true);try{const data=await postJSON('/api/chat-ai',{message:`Phân tích sâu theo nhiều lớp, rõ ràng, có lời khuyên thực tế: ${q}`});const text=data.text||data.answer||data.result;$('deepResult').innerHTML=htmlResult('🤯 AI phân tích sâu',text);saveHistory('AI phân tích sâu',text)}catch(e){const text=`### Phân tích sâu local\n- Vấn đề: ${q}\n- Lớp 1: xác định mục tiêu thật sự.\n- Lớp 2: xem rủi ro, nguồn lực, thời gian.\n- Lớp 3: chọn bước nhỏ làm ngay hôm nay.\n- Lời khuyên: đừng ôm quá nhiều hướng cùng lúc.`;$('deepResult').innerHTML=htmlResult('🤯 AI phân tích sâu',text);saveHistory('AI phân tích sâu local',text)}finally{setLoading('deepResult',false)}}

async function initFirebaseAuth(){
  if(firebaseAuthState.ready) return firebaseAuthState;
  firebaseAuthState.ready=true;
  try{
    const cfgData=await fetch('/api/auth/firebase-config').then(r=>r.json());
    if(!cfgData.enabled){
      const hint=$('socialLoginHint');
      if(hint) hint.textContent='Đăng nhập nhanh chưa sẵn sàng.';
      return firebaseAuthState;
    }
    const appMod=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const authMod=await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js');
    const app=appMod.initializeApp(cfgData.config);
    const auth=authMod.getAuth(app);
    auth.useDeviceLanguage();
    firebaseAuthState={
      enabled:true,
      app,
      auth,
      providers:{
        google:new authMod.GoogleAuthProvider(),
        facebook:new authMod.FacebookAuthProvider()
      },
      signInWithPopup:authMod.signInWithPopup,
      ready:true
    };
    const hint=$('socialLoginHint');
    if(hint) hint.textContent='Đăng nhập nhanh đã sẵn sàng.';
    return firebaseAuthState;
  }catch(error){
    console.error('Firebase Auth init error:',error);
    const hint=$('socialLoginHint');
    if(hint) hint.textContent='Đăng nhập nhanh chưa khả dụng.';
    return firebaseAuthState;
  }
}

async function socialLogin(provider){
  try{
    // Simulated OAuth popup
  const email = `user_${Date.now().toString().slice(-6)}@${provider}.com`;
  toast('Đang kết nối ' + provider + '...');
  await new Promise(r => setTimeout(r, 1000));
    
    const name = provider === 'google' ? 'Google User' : 'Facebook User';
    const data=await postJSON('/api/auth/social',{
      provider,
      uid:'social_' + Date.now(),
      email:email,
      name:name,
      avatar:'',
      idToken:'mock_token'
    });
    localStorage.setItem('synam_user',JSON.stringify(data.user));
    localStorage.setItem('synam_token',data.token||'');
    localStorage.setItem('synam_profile',JSON.stringify({name:data.user.name,email:data.user.email,plan:data.user.plan||'Free'}));
    if($('profileName'))$('profileName').value=data.user.name||'';
    if($('profileEmail'))$('profileEmail').value=data.user.email||'';
    if($('profilePlan'))$('profilePlan').value=data.user.plan||'Free';
    setAccountStatus(data.user,'Đăng nhập bằng '+(provider==='google'?'Google':'Facebook')+' thành công.');
    toast('Đăng nhập thành công');
  }catch(error){
    console.error(error);
    toast(error?.message||'Đăng nhập mạng xã hội lỗi');
  }
}

async function refreshSession(){
  try{
    if(!localStorage.getItem('synam_token')) return;
    const data=await getJSON('/api/auth/me');
    localStorage.setItem('synam_user',JSON.stringify(data.user));
    setAccountStatus(data.user,'Phiên đăng nhập còn hiệu lực.');
  }catch{
    localStorage.removeItem('synam_token');
    localStorage.removeItem('synam_user');
    setAccountStatus(null);
  }
}

async function logoutAccount(){
  try{ await postJSON('/api/auth/logout',{}); }catch{}
  localStorage.removeItem('synam_token');
  localStorage.removeItem('synam_user');
  setAccountStatus(null,'Đã đăng xuất.');
  toast('Đã đăng xuất');
}

function currentProfile(){
  return {
    name:$('profileName')?.value||'Thành viên',
    email:$('profileEmail')?.value||'',
    password:$('profilePassword')?.value||'',
    plan:$('profilePlan')?.value||'Free'
  }
}
function setAccountStatus(user,msg=''){
  const box=$('accountStatus'); if(!box)return;
  if(user){
    const avatar=user.avatar?`<img class="account-avatar" src="${escapeHtml(user.avatar)}" alt="avatar">`:'<div class="account-avatar fake">👤</div>';
    const providers=(user.providers||[]).map(p=>p==='google'?'Google':p==='facebook'?'Facebook':p).join(', ')||'Email/Mật khẩu';
    box.innerHTML=`<div class="account-ok"><div class="account-head">${avatar}<div><h3>✅ Đã đăng nhập</h3><p><b>${escapeHtml(user.name||'Thành viên')}</b><br>${escapeHtml(user.email||'')}</p></div></div><p>Gói: <b>${escapeHtml(user.plan||'Free')}</b> · Nguồn: <b>${escapeHtml(providers)}</b></p>${msg?`<p>${escapeHtml(msg)}</p>`:''}<button type="button" onclick="logoutAccount()">🚪 Đăng xuất</button></div>`;
    document.querySelector('.profile-pill')&&(document.querySelector('.profile-pill').innerHTML=`<span class="avatar">👤</span> ${escapeHtml(user?.name||'Tài khoản')} <b>${escapeHtml(user?.plan||'Free')}</b>`);
  }else{
    box.innerHTML=`<div class="account-warn"><h3>🔐 Chưa đăng nhập</h3><p>Đăng ký/đăng nhập để lưu hồ sơ thành viên. Lịch sử phân tích vẫn được lưu local trên máy.</p></div>`;
  }
}
function loadAccount(){
  try{
    const user=JSON.parse(localStorage.getItem('synam_user')||'null');
    const profile=JSON.parse(localStorage.getItem('synam_profile')||'null');
    if(profile){ if($('profileName'))$('profileName').value=profile.name||''; if($('profileEmail'))$('profileEmail').value=profile.email||''; if($('profilePlan'))$('profilePlan').value=profile.plan||'Free'; }
    setAccountStatus(user);
    initFirebaseAuth();
    refreshSession();
  }catch{setAccountStatus(null);initFirebaseAuth()}
}
function saveAccount(){
  const p=currentProfile();
  localStorage.setItem('synam_profile',JSON.stringify({name:p.name,email:p.email,plan:p.plan}));
  toast('Đã lưu hồ sơ local');
  setAccountStatus(JSON.parse(localStorage.getItem('synam_user')||'null'));
}
async function registerAccount(){
  const p=currentProfile();
  if(!p.email || !p.password){toast('Nhập email và mật khẩu đã nhé');return}
  try{
    const data=await postJSON('/api/auth/register',{name:p.name,email:p.email,password:p.password});
    localStorage.setItem('synam_user',JSON.stringify(data.user));
    localStorage.setItem('synam_token',data.token||'');
    localStorage.setItem('synam_profile',JSON.stringify({name:p.name,email:p.email,plan:data.user.plan||'Free'}));
    setAccountStatus(data.user,'Tài khoản đã tạo trên server.');
    toast('Đăng ký thành công');
  }catch(e){toast(parseError(e))}
}
async function loginAccount(){
  const p=currentProfile();
  if(!p.email || !p.password){toast('Nhập email và mật khẩu đã nhé');return}
  try{
    const data=await postJSON('/api/auth/login',{email:p.email,password:p.password});
    localStorage.setItem('synam_user',JSON.stringify(data.user));
    localStorage.setItem('synam_token',data.token||'');
    localStorage.setItem('synam_profile',JSON.stringify({name:data.user.name,email:data.user.email,plan:data.user.plan||'Free'}));
    if($('profileName'))$('profileName').value=data.user.name||'';
    if($('profilePlan'))$('profilePlan').value=data.user.plan||'Free';
    setAccountStatus(data.user,'Đăng nhập thành công.');
    toast('Đăng nhập thành công');
  }catch(e){toast(parseError(e))}
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
// SYNAM_SW_REFRESH: force a fresh SW check; the new worker activates and removes stale app caches.
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
