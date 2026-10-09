import re

with open('public/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

good_str = '''    const text = window.MysticEngine ? 
      (isPalm ? window.MysticEngine.Palmistry.analyze(note, $('palmLine').value) : window.MysticEngine.Face.analyze(note, $('facePart').value)) 
      : (isPalm ? '### Lỗi tải Mystic Engine - Chỉ Tay' : '### Lỗi tải Mystic Engine - Tướng Mặt');
    $(resultId).innerHTML = htmlResult(isPalm ? '🖐 Kết quả xem chỉ tay' : '🧑 Kết quả xem tướng', text);
    saveHistory(isPalm ? 'Xem chỉ tay local' : 'Xem tướng local', text);
  }finally{setLoading(resultId,false)}'''

content = re.sub(r'catch\(e\)\{[\s\S]*?\}finally\{setLoading\(resultId,false\)\}', 'catch(e){\n' + good_str, content)

with open('public/app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed app.js successfully.")
