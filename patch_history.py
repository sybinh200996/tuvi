import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

save_history_code = '''
function saveHistory(type, content) {
  try {
    const list = JSON.parse(localStorage.getItem('synam_history') || '[]');
    list.unshift({ type, content, at: new Date().toLocaleString('vi-VN') });
    localStorage.setItem('synam_history', JSON.stringify(list.slice(0, 80)));
  } catch(e){}
}
'''
if 'function saveHistory(' not in mob:
    mob = mob.replace('const TABS = [', save_history_code + '\nconst TABS = [')

history_tool_code = '''
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
'''
if 'function HistoryTool(' not in mob:
    mob = mob.replace('function App() {', history_tool_code + '\nfunction App() {')

mob = mob.replace("onClick={() => alert('Tính năng Lịch sử đang phát triển!')}", "onClick={() => setTab('history')}")

if "tab === 'history' && <HistoryTool />" not in mob:
    mob = re.sub(r'(\{tab === \'settings\' && <Settings providers=\{providers\} reload=\{loadProviders\} />\})', r'{tab === \'history\' && <HistoryTool />}\n        \1', mob)

# Add saveHistory calls
if "saveHistory(title" not in mob:
    mob = mob.replace("setResult(d.text || d.reply || 'Không có kết quả.');", "setResult(d.text || d.reply || 'Không có kết quả.'); saveHistory(title, d.text || d.reply || 'Không có kết quả.');")
    mob = mob.replace("setResult(fb);", "setResult(fb); saveHistory(title + ' local', fb);")

    mob = mob.replace("setOut(d.text||d.reply||'Không có kết quả');", "setOut(d.text||d.reply||'Không có kết quả'); saveHistory('Tình duyên', d.text||d.reply||'Không có kết quả');")

    mob = re.sub(r'setOut\(d\.text\|\|d\.reply\|\|\'Không có kết quả\'\);\}catch\(e\)\{setOut\(window\.MysticEngine \? window\.MysticEngine\.Numerology\.analyze\(name, dob\) : \'⚠️ Lỗi: \'\+e\.message\)\}', 
                 r"setOut(d.text||d.reply||'Không có kết quả'); saveHistory('Tử vi / Thần số', d.text||d.reply||'Không có kết quả');}catch(e){ const fb = window.MysticEngine ? window.MysticEngine.Numerology.analyze(name, dob) : '⚠️ Lỗi: '+e.message; setOut(fb); saveHistory('Tử vi local', fb) }", mob)

    mob = mob.replace("setOut(d.text||d.reply||'Không có kết quả')}catch(e){setOut('⚠️ '+e.message)}", "setOut(d.text||d.reply||'Không có kết quả'); saveHistory(title, d.text||d.reply||'Không có kết quả');}catch(e){setOut('⚠️ '+e.message)}")

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)
print("Mobile history patched")
