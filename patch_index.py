import re
with open('public/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

palm_hint = '<p class="instruction-hint" style="font-size:0.85em;color:#ffd700;margin:5px 0;font-style:italic;">* Mẹo: Chụp rõ toàn bộ lòng bàn tay, đủ sáng, không bị bóng râm che khuất.</p>'
face_hint = '<p class="instruction-hint" style="font-size:0.85em;color:#ffd700;margin:5px 0;font-style:italic;">* Mẹo: Chụp chính diện, rõ 5 ngũ quan, đủ sáng, không đeo kính râm và không che trán.</p>'

if palm_hint not in idx:
    idx = re.sub(r'(onsubmit="event\.preventDefault\(\);analyzeVision\(\'palm\'\)">.*?</h2>)', r'\1' + palm_hint, idx, count=1)
if face_hint not in idx:
    idx = re.sub(r'(onsubmit="event\.preventDefault\(\);analyzeVision\(\'face\'\)">.*?</h2>)', r'\1' + face_hint, idx, count=1)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(idx)
print('Patched index.html safely')
