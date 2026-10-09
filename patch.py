import sys

with open('public/app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update localMystic to use MysticEngine
content = content.replace(
    '''function localMystic(){const name=$('name').value||'Bạn';const text=`### Luận giải local cho ${name}\n- Tổng quan: năng lượng hiện tại thiên về thay đổi và hoàn thiện bản thân.\n- Công việc: nên tập trung một mục tiêu chính, tránh ôm quá nhiều việc cùng lúc.\n- Tình cảm: cần giao tiếp rõ ràng, chân thành và bớt suy diễn.\n- Lời khuyên: kết quả chỉ mang tính tham khảo văn hóa, quyết định vẫn nên dựa trên thực tế.`;$('report').innerHTML=htmlResult('📜 Kết quả tử vi',text);saveHistory('Tử vi local',text)}''',
    '''function localMystic(){const name=$('name').value||'Bạn';const dob=$('birthDate').value||'';const text=window.MysticEngine ? window.MysticEngine.Numerology.analyze(name,dob) : '### Lỗi Mystic Engine';$('report').innerHTML=htmlResult('📜 Kết quả tử vi',text);saveHistory('Tử vi local',text)}'''
)

# 2. Update generateMystic payload
content = content.replace(
    '''const payload={name:$('name').value,birthDate:$('birthDate').value,birthTime:$('birthTime').value,gender:$('gender').value};''',
    '''const localRep=window.MysticEngine?window.MysticEngine.Numerology.analyze($('name').value,$('birthDate').value):'';const payload={name:$('name').value,birthDate:$('birthDate').value,birthTime:$('birthTime').value,gender:$('gender').value,localReport:localRep};'''
)

# 3. Update generateLove payload and fallback
content = content.replace(
    '''const payload={name1:$('loveName1').value,birth1:$('loveBirth1').value,name2:$('loveName2').value,birth2:$('loveBirth2').value,focus:$('loveFocus').value};''',
    '''const localRep=window.MysticEngine?window.MysticEngine.Astrology.analyzeLove($('loveName1').value,$('loveBirth1').value,$('loveName2').value,$('loveBirth2').value):'';const payload={name1:$('loveName1').value,birth1:$('loveBirth1').value,name2:$('loveName2').value,birth2:$('loveBirth2').value,focus:$('loveFocus').value,localReport:localRep};'''
)

content = content.replace(
    '''catch(e){const text=`### Tình duyên tham khảo\n- Hai người cần xem sự hòa hợp qua cách giao tiếp, nhịp sống và mục tiêu dài hạn.\n- Điểm mạnh: có thể bổ sung cho nhau nếu biết lắng nghe.\n- Điểm cần tránh: im lặng, thở dài, nóng vội.\n- Lời khuyên: dùng tử vi như tham khảo, tình cảm thật nằm ở hành động hàng ngày.`;$('loveResult').innerHTML=htmlResult('💞 Kết quả tình duyên',text);saveHistory('Tình duyên local',text)}''',
    '''catch(e){const text=window.MysticEngine ? window.MysticEngine.Astrology.analyzeLove($('loveName1').value, $('loveBirth1').value, $('loveName2').value, $('loveBirth2').value) : '### Lỗi Mystic Engine';$('loveResult').innerHTML=htmlResult('💞 Kết quả tình duyên',text);saveHistory('Tình duyên local',text)}'''
)

with open('public/app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully.")
