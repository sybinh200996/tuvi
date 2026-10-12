import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

new_vision_tool = '''function VisionTool({ mode, title, icon }) {
  const [result, setResult] = useState('Vui lòng tải ảnh lên để bắt đầu.');
  const [file, setFile] = useState(null);
  const [note, setNote] = useState('');
  
  async function run() {
    if (!file) return setResult('Bạn cần chọn ảnh trước nhé.');
    setResult('Đang tối ưu ảnh và chuẩn bị phân tích...');
    try {
      const image = await optimizeImage(file);
      const payload = mode === 'palm'
        ? { mode, image, palmImage: image, palmLine: 'Tổng quan đường tay', palmNote: note }
        : { mode, image, faceImage: image, facePart: 'Tổng quan ngũ quan', faceNote: note };
      setResult('AI đang phân tích ảnh...');
      const d = await apiJSON('/api/vision-ai', payload);
      setResult(d.text || d.reply || 'Không có kết quả.');
    } catch(e) { 
      const fb = window.MysticEngine ? 
        (mode === 'palm' ? window.MysticEngine.Palmistry.analyze(note, '') : window.MysticEngine.Face.analyze(note, ''))
        : (mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt');
      setResult(fb);
    }
  }

  const hint = mode === 'palm' 
    ? '* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.' 
    : '* Mẹo: Chụp chính diện, rõ 5 ngũ quan, đủ sáng, không đeo kính và không che trán.';

  return (
    <section className="tool-grid">
      <div className="premium-panel">
        <h2>{icon} {title}</h2>
        <p style={{fontSize:'0.85em', color:'#ffd700', marginBottom:'15px', fontStyle:'italic'}}>{hint}</p>
        
        <div style={{margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '10px'}}>
          <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0])} style={{width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff'}} />
          <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Ghi chú thêm (Mình quan tâm sự nghiệp...)" style={{width: '100%', minHeight: '60px', padding: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', color: '#fff', border: 'none', resize: 'none'}} />
        </div>
        
        <button className="primary" style={{width: '100%', marginTop: '5px', height: '44px'}} onClick={run}>✨ Phân tích ngay</button>
      </div>
      <Result text={result}/>
    </section>
  );
}'''

mob = re.sub(r'function VisionTool\(\{.*?return <section className="tool-grid">.*?</section>;\s*\}', new_vision_tool, mob, flags=re.DOTALL)

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)
print("Patched mobile-app.js VisionTool")
