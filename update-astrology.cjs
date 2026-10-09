const fs = require('fs');

// 1. UPDATE MOBILE-APP.JS
let mobile = fs.readFileSync('public/mobile-app.js', 'utf8');

const newAstrologyTool = `function AstrologyTool(){
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
      const d=await apiJSON('/api/multi-ai/chat',{provider:'auto',message:\`Luận chiêm tinh theo cung hoàng đạo, thời điểm hiện tại và câu hỏi sau: Cung \${selected}. Câu hỏi: \${q}\`});
      setOut(d.text||d.reply||'Không có kết quả');
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
}`;

mobile = mobile.replace(/function AstrologyTool\(\)\{([\s\S]*?)\}/, newAstrologyTool);
fs.writeFileSync('public/mobile-app.js', mobile);

// 2. UPDATE INDEX.HTML
let index = fs.readFileSync('public/index.html', 'utf8');
index = index.replace(
  '<label>Cung hoàng đạo<input id="zodiac" placeholder="Song Tử, Sư Tử..."></label>', 
  '<div id="desktopZodiacGrid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:15px;"></div><input type="hidden" id="zodiac" value="">'
);
fs.writeFileSync('public/index.html', index);

// 3. UPDATE APP.JS
let app = fs.readFileSync('public/app.js', 'utf8');
const zodiacLogic = `
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
  grid.innerHTML = zodiacs.map(z => \`
    <div class="zodiac-item" onclick="selectZodiac('\${z.id}')" id="zodiac-\${z.id}" style="background:rgba(255,255,255,0.05); border:1px solid transparent; border-radius:8px; padding:10px 5px; text-align:center; cursor:pointer; transition:0.3s;">
      <div style="font-size:24px;">\${z.icon}</div>
      <div style="font-size:13px; font-weight:bold; margin-top:4px; color:#fff;">\${z.id}</div>
      <div style="font-size:11px; color:#aaa; margin-top:2px;">\${z.date}</div>
    </div>
  \`).join('');
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
`;
if(!app.includes('renderDesktopZodiac')) {
  app += zodiacLogic;
  fs.writeFileSync('public/app.js', app);
}

// 4. UPDATE MOBILE.HTML CACHE VERSION (Bump cache again)
let mobileHtml = fs.readFileSync('public/mobile.html', 'utf8');
mobileHtml = mobileHtml.replace(/mobile-app.compiled.js\?v=\d+/, 'mobile-app.compiled.js?v=' + Date.now());
fs.writeFileSync('public/mobile.html', mobileHtml);
