import re

with open('public/mystic-engine.js', 'r', encoding='utf-8') as f:
    engine = f.read()

additional = '''
  // --- 3. BÓI BÀI TAROT (OFFLINE) ---
  , Tarot: {
    cards: [
      "The Fool - Sự khởi đầu mới, ngây thơ, phiêu lưu, nhưng cũng cảnh báo sự thiếu suy nghĩ.",
      "The Magician - Quyền năng, sự tập trung, kỹ năng và nguồn lực để đạt được mục tiêu.",
      "The High Priestess - Trực giác, tiềm thức, sự bí ẩn và lời khuyên hãy tin vào bản năng.",
      "The Empress - Sự sinh sôi, nuôi dưỡng, thiên nhiên và sự trù phú về vật chất lẫn tinh thần.",
      "The Emperor - Quyền uy, cấu trúc, sự ổn định và vai trò của một người lãnh đạo.",
      "The Hierophant - Truyền thống, tôn giáo, học vấn và sự tuân thủ các quy tắc xã hội.",
      "The Lovers - Tình yêu, sự hòa hợp, các lựa chọn quan trọng và những ngã rẽ cuộc đời.",
      "The Chariot - Ý chí, quyết tâm, sự kiểm soát để vượt qua mọi trở ngại.",
      "Strength - Sức mạnh nội tâm, lòng dũng cảm, sự kiên nhẫn và lòng trắc ẩn.",
      "The Hermit - Sự chiêm nghiệm, cô đơn tự nguyện, tìm kiếm ánh sáng chân lý từ bên trong.",
      "Wheel of Fortune - Vòng quay định mệnh, nghiệp quả, sự thay đổi bất ngờ của thời vận.",
      "Justice - Công lý, sự thật, luật nhân quả và sự công bằng trong mọi quyết định.",
      "The Hanged Man - Sự hy sinh, nhìn nhận vấn đề từ góc độ khác, sự trì hoãn có chủ đích.",
      "Death - Sự kết thúc một giai đoạn, sự lột xác, chuyển đổi để nhường chỗ cho cái mới.",
      "Temperance - Sự cân bằng, điều độ, kiên nhẫn và sự pha trộn hài hòa các yếu tố.",
      "The Devil - Cám dỗ, vật chất, sự trói buộc và những ranh giới độc hại cần phá vỡ.",
      "The Tower - Sự sụp đổ thảm khốc, sự khai sáng đột ngột, phá vỡ những nền tảng sai lầm.",
      "The Star - Hy vọng, niềm tin, sự chữa lành và những phước lành từ vũ trụ.",
      "The Moon - Ảo ảnh, sự sợ hãi, trực giác sâu thẳm và những điều chưa được tiết lộ.",
      "The Sun - Thành công rực rỡ, niềm vui, sự tích cực và sức sống tràn trề.",
      "Judgement - Sự thức tỉnh, tái sinh, sự tha thứ và tiếng gọi từ linh hồn.",
      "The World - Sự hoàn tất, vinh quang, những chuyến đi và sự trọn vẹn của một chu kỳ."
    ],
    draw(question) {
      const shuffled = this.cards.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
      return '### GIẢI MÃ TAROT (OFFLINE)\\n\\n**Câu hỏi:** ' + (question || 'Tương lai của tôi?') + '\\n\\n**1. Quá khứ:**\\n- ' + selected[0] + '\\n\\n**2. Hiện tại:**\\n- ' + selected[1] + '\\n\\n**3. Tương lai:**\\n- ' + selected[2];
    }
  },

  // --- 4. CHIÊM TINH (ZODIAC) ---
  Zodiac: {
    signs: {
      "Bạch Dương": "Lửa - Nhiệt huyết, bốc đồng, tiên phong. Lưu ý kiềm chế cơn nóng giận.",
      "Kim Ngưu": "Đất - Ổn định, thực tế, đôi khi bướng bỉnh. Đang có lộc về tiền bạc.",
      "Song Tử": "Khí - Thông minh, linh hoạt, hay thay đổi. Tránh việc đứng núi này trông núi nọ.",
      "Cự Giải": "Nước - Nhạy cảm, hướng về gia đình. Cần bảo vệ cảm xúc của chính mình.",
      "Sư Tử": "Lửa - Kiêu hãnh, hào phóng, thích tỏa sáng. Đừng để cái tôi che mờ lý trí.",
      "Xử Nữ": "Đất - Cầu toàn, phân tích logic, chi tiết. Nên bớt khắt khe với bản thân.",
      "Thiên Bình": "Khí - Yêu cái đẹp, thích sự công bằng. Hay do dự trong các quyết định lớn.",
      "Bọ Cạp": "Nước - Sâu sắc, bí ẩn, trực giác mạnh. Đang trong giai đoạn lột xác tâm hồn.",
      "Nhân Mã": "Lửa - Thích tự do, triết lý, du lịch. Hãy chú ý đến lời hứa và trách nhiệm.",
      "Ma Kết": "Đất - Kỷ luật, tham vọng, kiên nhẫn. Sự nghiệp đang trên đà phát triển vững chắc.",
      "Bảo Bình": "Khí - Sáng tạo, lập dị, độc lập. Một ý tưởng đột phá sắp xuất hiện.",
      "Song Ngư": "Nước - Lãng mạn, vị tha, mơ mộng. Cẩn thận bị người khác lợi dụng lòng tốt."
    },
    analyze(sign, question) {
      const desc = this.signs[sign] || "Không rõ cung.";
      return '### THÔNG ĐIỆP CHIÊM TINH (OFFLINE)\\n\\n**Cung:** ' + sign + '\\n**Năng lượng:** ' + desc + '\\n\\n**Câu hỏi: "' + (question || 'Vận trình chung') + '"**\\nChiêm tinh học khuyên bạn nên dựa vào ưu điểm của bản mệnh để đưa ra quyết định sáng suốt.';
    }
  }
};
'''

if "Tarot" not in engine:
    engine = engine.replace('};\n\nwindow.MysticEngine = MysticEngine;', additional + '\n\nwindow.MysticEngine = MysticEngine;')
    with open('public/mystic-engine.js', 'w', encoding='utf-8') as f:
        f.write(engine)


with open('public/app.js', 'r', encoding='utf-8') as f:
    appjs = f.read()

app_patch = r'''catch(e){
  let text = `### ${title}\n- Hiện chưa kết nối được AI server.\n- Nội dung: ${prompt}\n- Lời khuyên: Hãy dựa vào bản thân.`;
  if (kind === 'tarot' && window.MysticEngine) text = window.MysticEngine.Tarot.draw($('tarotAsk')?.value);
  if (kind === 'astrology' && window.MysticEngine) text = window.MysticEngine.Zodiac.analyze($('zodiac')?.value, $('astroQuestion')?.value);
  $(id).innerHTML=htmlResult(title,text);saveHistory(title+' local',text)
}finally{setLoading(id,false)}'''

appjs = re.sub(r'catch\(e\)\{const text=`### \$\{title\}\\n- Hi.*?finally\{setLoading\(id,false\)\}', app_patch, appjs, flags=re.DOTALL)
with open('public/app.js', 'w', encoding='utf-8') as f:
    f.write(appjs)
print("Done patching.")
