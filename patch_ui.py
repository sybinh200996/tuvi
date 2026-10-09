import re

# 1. Patch mobile-app.js
with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

fallback_patch = r'''catch (e) {
      const fb = window.MysticEngine ? 
        (mode === 'palm' ? window.MysticEngine.Palmistry.analyze('', '') : window.MysticEngine.Face.analyze('', ''))
        : (mode === 'palm' ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt');
      setResult(fb);
    }'''

mob = re.sub(r'catch\s*\(e\)\s*\{[\s\S]*?setResult\(mode === \'palm\'[\s\S]*?\}', fallback_patch, mob)

hint_jsx = r'''<div className="input-group">
          <p style={{fontSize:'0.85em', color:'#ffd700', marginBottom:'10px', fontStyle:'italic'}}>
            * Mẹo: {mode === 'palm' ? 'Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.' : 'Chụp chính diện, rõ 5 ngũ quan, đủ sáng, không đeo kính và không che trán.'}
          </p>'''

mob = re.sub(r'<\s*div\s+className="input-group"\s*>', hint_jsx, mob, count=1)

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)


# 2. Patch index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

palm_hint = '<p class="instruction-hint" style="font-size:0.85em;color:#ffd700;margin:5px 0;font-style:italic;">* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.</p>'
face_hint = '<p class="instruction-hint" style="font-size:0.85em;color:#ffd700;margin:5px 0;font-style:italic;">* Mẹo: Chụp chính diện, rõ 5 ngũ quan, đủ sáng, không đeo kính râm và không che trán.</p>'

idx = idx.replace('<h2>🖐 Xem chỉ tay AI</h2>', '<h2>🖐 Xem chỉ tay AI</h2>' + palm_hint)
idx = idx.replace('<h2>🧑 Xem tướng AI</h2>', '<h2>🧑 Xem tướng AI</h2>' + face_hint)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("Patch applied to mobile-app.js and index.html")
