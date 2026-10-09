const fs = require('fs');

// 1. Mobile App update
let mobile = fs.readFileSync('public/mobile-app.js', 'utf8');

const newTarotTool = `function TarotTool(){
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
      const d=await apiJSON('/api/multi-ai/chat',{provider:'auto',message:\`Xem bài tarot tham khảo. Câu hỏi: \${q}. Ba lá: \${deckNames.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.\`});
      setOut(d.text||d.reply||deckNames.join('\\n'));
    }catch(e){
      setOut(\`### 🃏 Ba lá bài\\n- \${deckNames.join('\\n- ')}\\n\\nLời khuyên: xem như tham khảo để bình tĩnh lựa chọn, không quyết định thay thực tế.\`);
    }
  }
  return <section className="tool-grid"><div className="premium-panel"><h2>🃏 Xem bài Tarot</h2><textarea value={q} onChange={e=>setQ(e.target.value)} placeholder="Bạn muốn hỏi điều gì?"/><button className="primary" onClick={draw}>{picked.length?'🔄 Đổi bài':'🃏 Trải bài Tarot'}</button><div className="tarot-cards" style={{display:'flex',gap:'10px',justifyContent:'center',marginTop:'15px'}}>{picked.map(c=><div key={c.name} style={{flex:1,textAlign:'center'}}><img src={c.img} style={{width:'100%',borderRadius:'8px',boxShadow:'0 4px 8px rgba(0,0,0,0.5)'}}/><div style={{fontSize:'12px',marginTop:'8px',color:'#ffd700'}}>{c.name}</div></div>)}</div></div><Result text={out}/></section>
}`;

mobile = mobile.replace(/function TarotTool\(\)\{([\s\S]*?)function NumerologyTool\(\)\{/m, newTarotTool + '\nfunction NumerologyTool(){');
fs.writeFileSync('public/mobile-app.js', mobile);

// 2. Desktop App update
let desktopIndex = fs.readFileSync('public/index.html', 'utf8');
desktopIndex = desktopIndex.replace('onsubmit="event.preventDefault();simpleTool(\'tarot\')"', 'onsubmit="event.preventDefault();drawTarotDesktop()"');
// inject a visual area for cards
desktopIndex = desktopIndex.replace('</textarea></label><button class="primary">', '</textarea></label><div id="desktopTarotCards" style="display:flex;gap:15px;justify-content:center;margin:15px 0;"></div><button class="primary">');
fs.writeFileSync('public/index.html', desktopIndex);

let desktopApp = fs.readFileSync('public/app.js', 'utf8');
const drawTarotCode = `
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
    container.innerHTML = deck.map(c => \`<div style="flex:1;text-align:center;"><img src="\${c.img}" style="width:100%;max-width:120px;border-radius:8px;box-shadow:0 4px 8px rgba(0,0,0,0.5);"><div style="font-size:12px;margin-top:8px;color:#ffd700;">\${c.name}</div></div>\`).join('');
  }

  const deckNames = deck.map(c=>c.name);
  const title = '🃏 Kết quả bài Tarot';
  const id = 'tarotResult';
  setLoading(id, true);
  try {
    const data = await postJSON('/api/multi-ai/chat', { message: \`Xem bài tarot tham khảo. Câu hỏi: \${q}. Ba lá: \${deckNames.join(', ')}. Hãy luận rõ: hiện tại, lời khuyên, kết quả gần.\`, provider: 'auto' });
    const text = data.text || data.answer || data.result;
    $(id).innerHTML = htmlResult(title, text);
    saveHistory(title, text);
  } catch(e) {
    $(id).innerHTML = htmlResult(title, 'AI chưa phản hồi được. Vui lòng thử lại.');
  } finally {
    setLoading(id, false);
  }
}
`;
if(!desktopApp.includes('drawTarotDesktop')) {
    desktopApp += drawTarotCode;
    // remove tarot from simpleTool map
    desktopApp = desktopApp.replace("tarot:['tarotResult','🃏 Kết quả bài Tarot',$('tarotAsk')?.value||'']", "");
    fs.writeFileSync('public/app.js', desktopApp);
}
