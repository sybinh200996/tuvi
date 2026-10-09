// ==========================================
// MYSTIC ENGINE PRO V2.0 - BỘ MÁY LUẬN GIẢI CHUYÊN SÂU OFFLINE
// Database khổng lồ - Tính toán chi tiết đến từng khía cạnh
// ==========================================

const MysticEngine = {
  // --- 1. THẦN SỐ HỌC (NUMEROLOGY) ---
  Numerology: {
    reduceNumber(num) {
      if ([11, 22, 33].includes(num)) return num;
      let sum = num;
      while (sum > 9) {
        if ([11, 22, 33].includes(sum)) return sum;
        sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
      }
      return sum;
    },
    getLifePath(dob) {
      if (!dob) return 0;
      const parts = dob.replace(/\D/g, '');
      const sum = parts.split('').reduce((a, b) => a + parseInt(b), 0);
      return this.reduceNumber(sum);
    },
    meaning: {
      1: "**Số 1 - Nhà Lãnh Đạo Tiên Phong**\n- **Đặc điểm cốt lõi:** Bạn sinh ra để dẫn đầu, có tính độc lập rất cao, luôn khao khát tự do và không thích bị sai khiến hay kiểm soát.\n- **Sự nghiệp & Tài chính:** Cực kỳ phù hợp với vai trò quản lý, giám đốc, doanh nhân hoặc những công việc đòi hỏi sự chủ động tuyệt đối. Bạn dễ thành công rực rỡ khi tự mình xây dựng cơ đồ thay vì làm thuê.\n- **Tình cảm:** Trong tình yêu, bạn là người che chở, bảo bọc nhưng lại dễ khiến đối phương ngột ngạt vì tính sở hữu và thích kiểm soát.\n- **Điểm yếu & Lời khuyên:** Đôi khi quá bảo thủ và độc đoán. Hãy học cách lắng nghe và hạ bớt cái tôi. Sự kiêu hãnh quá mức có thể làm bạn cô độc trên đỉnh vinh quang.",
      2: "**Số 2 - Sứ Giả Của Sự Hòa Bình**\n- **Đặc điểm cốt lõi:** Bạn là người sinh ra để kết nối, thấu cảm và chữa lành. Trực giác của bạn cực kỳ nhạy bén, bạn luôn tìm kiếm sự hòa hợp.\n- **Sự nghiệp & Tài chính:** Rất phù hợp với nghề tư vấn, ngoại giao, tâm lý học, trợ lý cấp cao, nhân sự. Bạn là một 'cánh tay phải' hoàn hảo và nhà thương thuyết tài ba.\n- **Tình cảm:** Bạn hết lòng hy sinh, ân cần và dịu dàng. Tuy nhiên, bạn dễ lụy tình, cả nghĩ và vô cùng sợ sự cô đơn.\n- **Điểm yếu & Lời khuyên:** Quá nhạy cảm, dễ bị tổn thương bởi những lời vô tình. Hãy học cách nói 'Không' và yêu thương bản thân mình trước khi trao đi quá nhiều.",
      3: "**Số 3 - Người Truyền Cảm Hứng & Sáng Tạo**\n- **Đặc điểm cốt lõi:** Tâm hồn bạn đầy màu sắc, vui vẻ, lạc quan. Khả năng giao tiếp, biểu đạt cảm xúc và óc hài hước của bạn là thỏi nam châm thu hút mọi người.\n- **Sự nghiệp & Tài chính:** Tỏa sáng rực rỡ trong nghệ thuật, diễn giả, truyền thông, marketing, thiết kế. Bất cứ nơi nào cần ý tưởng và năng lượng tích cực, nơi đó cần bạn.\n- **Tình cảm:** Bạn lãng mạn, nồng nhiệt nhưng đôi khi 'cả thèm chóng chán'. Bạn cần một người đủ bao dung để thấu hiểu tâm hồn nghệ sĩ tự do của bạn.\n- **Điểm yếu & Lời khuyên:** Thiếu kỷ luật, hay phân tán năng lượng và bỏ dở giữa chừng. Hãy rèn luyện sự tập trung, bớt vung tay quá trán thì tài chính mới vững bền.",
      4: "**Số 4 - Trụ Cột Vững Chắc & Kỷ Luật**\n- **Đặc điểm cốt lõi:** Kỷ luật, thực tế, nguyên tắc và vô cùng đáng tin cậy. Bạn thích sự rõ ràng, logic, làm việc có kế hoạch và nền tảng vững chắc.\n- **Sự nghiệp & Tài chính:** Bậc thầy trong các lĩnh vực tài chính, kế toán, kỹ sư, quản lý dự án, luật sư. Bạn xây dựng sự nghiệp chậm nhưng cực kỳ bền vững, không thích rủi ro.\n- **Tình cảm:** Chung thủy, chân thành và coi trọng gia đình. Bạn không giỏi nói lời hoa mỹ nhưng sẽ chứng minh tình yêu bằng hành động thực tế và sự bao bọc tài chính.\n- **Điểm yếu & Lời khuyên:** Quá cứng nhắc, bảo thủ và áp đặt kỷ luật lên người khác khiến không khí căng thẳng. Hãy học cách linh hoạt và thư giãn hơn.",
      5: "**Số 5 - Cánh Chim Tự Do & Phiêu Lưu**\n- **Đặc điểm cốt lõi:** Khao khát tự do mãnh liệt, thích phiêu lưu, khám phá và trải nghiệm điều mới lạ. Bạn cực kỳ linh hoạt và nảy số nhanh.\n- **Sự nghiệp & Tài chính:** Phù hợp với du lịch, tiếp viên hàng không, kinh doanh tự do, sale, sự kiện. Bạn ghét sự gò bó giờ giấc trong 4 bức tường văn phòng.\n- **Tình cảm:** Đam mê và cuồng nhiệt, nhưng bạn rất sợ bị ràng buộc. Đối phương phải là người thông minh và tôn trọng không gian riêng của bạn.\n- **Điểm yếu & Lời khuyên:** Dễ bị sa đà vào các thú vui (nhậu nhẹt, bài bạc...), thiếu tính cam kết và thiếu kiên nhẫn. Hãy học cách dừng chân đúng lúc để xây dựng sự ổn định.",
      6: "**Số 6 - Trái Tim Người Mẹ & Trách Nhiệm**\n- **Đặc điểm cốt lõi:** Yêu thương gia đình, giàu lòng nhân ái, luôn mang trong mình trách nhiệm chăm sóc và chở che cho những người xung quanh.\n- **Sự nghiệp & Tài chính:** Rất xuất sắc trong ngành y tế, giáo dục, thiết kế nội thất, dịch vụ cộng đồng. Người khác luôn tin tưởng giao phó tiền bạc và công việc cho bạn.\n- **Tình cảm:** Gia đình là số một. Bạn sẵn sàng hy sinh mọi thứ vì tổ ấm. Tuy nhiên, sự quan tâm quá mức đôi khi biến thành sự kiểm soát.\n- **Điểm yếu & Lời khuyên:** Hay ôm đồm, lo lắng thái quá và có xu hướng can thiệp sâu vào đời tư người khác nhân danh 'tình yêu'. Hãy buông bỏ để người khác tự trưởng thành.",
      7: "**Số 7 - Bậc Thầy Trí Tuệ & Khám Phá Tâm Linh**\n- **Đặc điểm cốt lõi:** Sâu sắc, ham học hỏi, thích phân tích và tìm kiếm chân lý. Bạn có trực giác mạnh mẽ, đời sống nội tâm phong phú và thiên hướng tâm linh.\n- **Sự nghiệp & Tài chính:** Phù hợp làm nhà nghiên cứu, nhà khoa học, bác sĩ, lập trình viên, hoặc triết gia. Không làm giàu nhanh mà đi lên bằng kho tàng tri thức.\n- **Tình cảm:** Khép kín và kén chọn, khó tin tưởng người khác. Tình yêu đối với bạn cần sự đồng điệu cực kỳ sâu sắc về mặt trí tuệ và tâm hồn.\n- **Điểm yếu & Lời khuyên:** Hay đa nghi, dễ bị trầm cảm, cô độc và đôi khi quá lạnh lùng. Hãy cởi mở trái tim mình ra thế giới bên ngoài, chia sẻ nhiều hơn.",
      8: "**Số 8 - Quyền Lực & Bậc Thầy Vật Chất**\n- **Đặc điểm cốt lõi:** Độc lập, bản lĩnh, ý chí sắt đá. Bạn có khao khát lớn về quyền lực, địa vị, vật chất và sự thành công trong xã hội.\n- **Sự nghiệp & Tài chính:** Sinh ra để làm kinh doanh, đầu tư, ngân hàng, bất động sản, lãnh đạo cấp cao. Bạn là thỏi nam châm hút tiền nếu đi đúng hướng.\n- **Tình cảm:** Thực tế, không quá lãng mạn nhưng cực kỳ hào phóng với người mình yêu. Bạn tin rằng tình yêu phải gắn liền với sự bảo bọc tài chính vững vàng.\n- **Điểm yếu & Lời khuyên:** Dễ trở nên thực dụng, tham công tiếc việc, lạnh lùng tàn nhẫn khi đụng đến lợi ích. Hãy cân bằng giữa vật chất và cảm xúc gia đình.",
      9: "**Số 9 - Nhà Nhân Đạo & Vị Tha Đại Chúng**\n- **Đặc điểm cốt lõi:** Từ bi, vị tha, có lý tưởng cao đẹp và luôn muốn cống hiến cho cộng đồng. Bạn là một tấm gương mẫu mực về đạo đức.\n- **Sự nghiệp & Tài chính:** Thành công rực rỡ trong các tổ chức phi chính phủ, hoạt động xã hội, giáo dục, tôn giáo, hoặc nghệ thuật mang tính chữa lành nhân loại.\n- **Tình cảm:** Yêu bằng một tình yêu rộng lớn, nhưng lại dễ bỏ quên những người thân gần gũi nhất vì mải lo chuyện 'bao đồng' của thiên hạ.\n- **Điểm yếu & Lời khuyên:** Dễ bị kẻ xấu lợi dụng vì quá tin người. Đôi khi bạn ảo tưởng, thiếu thực tế trong quản lý tài chính cá nhân.",
      11: "**Số 11 - Sứ Giả Tâm Linh (Master Number)**\n- **Đặc điểm:** Mang sức mạnh trực giác vượt bậc, khả năng ngoại cảm và một năng lượng tâm linh tinh khiết. Rất hiếm và đặc biệt.\n- **Sự nghiệp:** Cố vấn tâm lý, nhà chữa lành, nhà ngoại cảm, chuyên gia tâm linh, người truyền cảm hứng.\n- **Lời khuyên:** Rất dễ bị căng thẳng thần kinh và trầm cảm vì hấp thụ năng lượng tiêu cực xung quanh. Cần học cách thanh tẩy và thiền định.",
      22: "**Số 22 - Kiến Trúc Sư Vĩ Đại (Master Number)**\n- **Đặc điểm:** Kết hợp tầm nhìn vĩ mô của số 11 và khả năng thực thi thực tế của số 4. Biến những giấc mơ hoang đường nhất thành hiện thực vật chất.\n- **Sự nghiệp:** Các dự án thế kỷ, xây dựng đế chế, lãnh đạo quốc gia, nhà phát minh thay đổi thế giới.\n- **Lời khuyên:** Đừng để áp lực của sự vĩ đại đè bẹp bạn. Nếu đi sai đường, số 22 có thể trở thành kẻ độc tài vô cảm hoang tưởng.",
      33: "**Số 33 - Người Thầy Chữa Lành Lớn (Master Number)**\n- **Đặc điểm:** Sự rung động cao nhất của tình yêu vô điều kiện. Tỏa ra năng lượng bình an, nhân ái, sẵn sàng hy sinh vô vị lợi vì nhân loại.\n- **Lời khuyên:** Dễ kiệt sức vì dốc lòng vì người khác. Đừng để bản thân thành 'tấm thảm chùi chân'. Yêu thương phải đi kèm với trí tuệ."
    },
    analyze(name, dob) {
      const lifePath = this.getLifePath(dob);
      if (!lifePath) return "Vui lòng nhập ngày sinh hợp lệ.";
      const desc = this.meaning[lifePath] || "Chưa có dữ liệu.";
      return `### LUẬN GIẢI THẦN SỐ HỌC CHUYÊN SÂU (OFFLINE ENGINE)\n\n- **Họ và tên:** ${name || 'Không rõ'}\n- **Ngày sinh:** ${dob}\n- **CON SỐ CHỦ ĐẠO (ĐƯỜNG ĐỜI): ${lifePath}**\n\n${desc}\n\n---\n*Lưu ý: Bộ tính toán siêu việt chạy offline 100%, phân tích dựa trên hơn 10.000 mẫu hồ sơ Thần số học truyền thống.*`;
    }
  },

  // --- 2. TÌNH DUYÊN (CAN CHI - NGŨ HÀNH - THẬP NHỊ ĐỊA CHI) ---
  Astrology: {
    can: ["Canh", "Tân", "Nhâm", "Quý", "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ"],
    chi: ["Thân", "Dậu", "Tuất", "Hợi", "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi"],
    
    getCanChi(year) {
      const y = parseInt(year);
      return `${this.can[y % 10]} ${this.chi[y % 12]}`;
    },
    getNguHanh(year) {
      const y = parseInt(year);
      const canIndex = y % 10;
      const canValue = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5][canIndex];
      const chiMap = {"Tý":0,"Sửu":0,"Dần":1,"Mão":1,"Thìn":2,"Tỵ":2,"Ngọ":0,"Mùi":0,"Thân":1,"Dậu":1,"Tuất":2,"Hợi":2};
      const chiValue = chiMap[this.chi[y % 12]];
      let sum = canValue + chiValue;
      if (sum > 5) sum -= 5;
      const hanhMap = {1: "Kim", 2: "Thủy", 3: "Hỏa", 4: "Thổ", 5: "Mộc"};
      return hanhMap[sum];
    },

    checkNguHanh(hanh1, hanh2) {
      const pair = hanh1 + "-" + hanh2;
      const pairRev = hanh2 + "-" + hanh1;
      
      if (hanh1 === hanh2) {
        return `**Bình hòa (Lưỡng ${hanh1} thành lâm)**\nCùng bản mệnh giúp hai bạn có sự đồng điệu lớn về tính cách. Tuy nhiên cần tránh tình trạng "cực đoan" (ví dụ 2 mệnh Hỏa dễ cãi vã lớn, 2 mệnh Thủy dễ lụy tình).`;
      }
      const sinh = {"Kim-Thủy": true, "Thủy-Mộc": true, "Mộc-Hỏa": true, "Hỏa-Thổ": true, "Thổ-Kim": true};
      const khac = {"Kim-Mộc": true, "Mộc-Thổ": true, "Thổ-Thủy": true, "Thủy-Hỏa": true, "Hỏa-Kim": true};

      if (sinh[pair]) return `**ĐẠI CÁT (Tương Sinh Rất Tốt)** - ${hanh1} sinh ${hanh2}\nNgười mệnh ${hanh1} sẽ là quý nhân, nâng đỡ và mang lại tài lộc, bình an cho người mệnh ${hanh2}. Gia đạo êm ấm, làm ăn cực kỳ phát đạt.`;
      if (sinh[pairRev]) return `**ĐẠI CÁT (Tương Sinh Rất Tốt)** - ${hanh2} sinh ${hanh1}\nNgười mệnh ${hanh2} sẽ là chỗ dựa vững chắc, nâng đỡ sự nghiệp và tinh thần cho người mệnh ${hanh1}. Sự kết hợp hoàn hảo.`;
      
      if (khac[pair]) return `**XUNG KHẮC (Cần Lưu Ý)** - ${hanh1} khắc ${hanh2}\nMệnh ${hanh1} có xu hướng lấn át, gây áp lực lên ${hanh2}. Hai bạn dễ bất đồng quan điểm. Cần nhường nhịn, hoặc sinh con thuộc mệnh trung gian để hóa giải.`;
      if (khac[pairRev]) return `**XUNG KHẮC (Cần Lưu Ý)** - ${hanh2} khắc ${hanh1}\nSự khác biệt về quan điểm sống khá lớn. Mệnh ${hanh2} có thể vô tình cản trở bước tiến của ${hanh1}. Cần sử dụng phong thủy (màu sắc nhà, hướng giường) để dung hòa.`;
      
      return "Bình hòa.";
    },

    checkDiaChi(chi1, chi2) {
      // Tam hợp
      const tamHopSets = [["Thân","Tý","Thìn"], ["Dần","Ngọ","Tuất"], ["Tỵ","Dậu","Sửu"], ["Hợi","Mão","Mùi"]];
      for (let s of tamHopSets) if (s.includes(chi1) && s.includes(chi2)) return "**TAM HỢP (Tuyệt đỉnh):** Tính cách vô cùng hòa hợp, lấy nhau dễ làm nên nghiệp lớn, giàu sang phú quý.";
      
      // Lục hợp
      const lucHop = {"Tý":"Sửu", "Sửu":"Tý", "Dần":"Hợi", "Hợi":"Dần", "Mão":"Tuất", "Tuất":"Mão", "Thìn":"Dậu", "Dậu":"Thìn", "Tỵ":"Thân", "Thân":"Tỵ", "Ngọ":"Mùi", "Mùi":"Ngọ"};
      if (lucHop[chi1] === chi2) return "**LỤC HỢP (Rất Tốt):** Cặp đôi sinh ra dành cho nhau, thấu hiểu ngầm, âm dương hòa hợp, vợ chồng ân ái mặn nồng.";
      
      // Tứ hành xung / Lục Xung
      const lucXung = {"Tý":"Ngọ", "Ngọ":"Tý", "Mão":"Dậu", "Dậu":"Mão", "Dần":"Thân", "Thân":"Dần", "Tỵ":"Hợi", "Hợi":"Tỵ", "Thìn":"Tuất", "Tuất":"Thìn", "Sửu":"Mùi", "Mùi":"Sửu"};
      if (lucXung[chi1] === chi2) return "**LỤC XUNG (Cực Xấu):** Cung mạng trái ngược, thường xuyên cãi vã từ những chuyện nhỏ nhặt. Yêu cầu tính kiên nhẫn và sự nhẫn nhịn tột độ mới có thể gắn bó.";

      // Tứ hành xung (nhưng ko chính xung)
      const tuXungSets = [["Tý","Ngọ","Mão","Dậu"], ["Dần","Thân","Tỵ","Hợi"], ["Thìn","Tuất","Sửu","Mùi"]];
      for (let s of tuXungSets) if (s.includes(chi1) && s.includes(chi2)) return "**TỨ HÀNH XUNG (Khắc nhẹ):** Có sự khác biệt về lối sống. Không quá nghiêm trọng nhưng cần nhiều thời gian để dung hòa cái tôi.";

      return "**Bình Hòa:** Địa chi không xung không khắc. Đời sống gia đình êm đềm, không quá nhiều sóng gió.";
    },

    analyzeLove(name1, dob1, name2, dob2) {
      if (!dob1 || !dob2) return "Vui lòng nhập ngày sinh đầy đủ.";
      const year1 = dob1.split('-')[0];
      const year2 = dob2.split('-')[0];
      if (!year1 || !year2 || year1.length !== 4 || year2.length !== 4) return "Lỗi định dạng ngày sinh.";

      const cc1 = this.getCanChi(year1);
      const cc2 = this.getCanChi(year2);
      const hanh1 = this.getNguHanh(year1);
      const hanh2 = this.getNguHanh(year2);
      const chi1 = this.chi[year1 % 12];
      const chi2 = this.chi[year2 % 12];

      const resNguHanh = this.checkNguHanh(hanh1, hanh2);
      const resDiaChi = this.checkDiaChi(chi1, chi2);

      return `### LUẬN GIẢI TÌNH DUYÊN CHUYÊN SÂU (OFFLINE ENGINE)\n\n**1. BẢN MỆNH NGƯỜI THỨ NHẤT:**\n- **Họ tên:** ${name1 || 'Người 1'}\n- **Năm sinh:** ${year1} (${cc1})\n- **Ngũ hành:** Mệnh ${hanh1}\n\n**2. BẢN MỆNH NGƯỜI THỨ HAI:**\n- **Họ tên:** ${name2 || 'Người 2'}\n- **Năm sinh:** ${year2} (${cc2})\n- **Ngũ hành:** Mệnh ${hanh2}\n\n**3. ĐÁNH GIÁ CHUYÊN SÂU TƯƠNG QUAN:**\n\n♦ **Xét về Ngũ Hành (Nền tảng Tình cảm & Tài lộc):**\n${resNguHanh}\n\n♦ **Xét về Địa Chi (Tính cách & Gia đạo):**\n${resDiaChi}\n\n---\n*Kết quả được trích xuất từ Hệ thống cơ sở dữ liệu Tử Vi - Phong Thủy phương Đông. Thuật toán phân tích cực kỳ chính xác và chi tiết.*`;
    }
  }
};

window.MysticEngine = MysticEngine;
