// ==========================================
// MYSTIC ENGINE - BỘ MÁY LUẬN GIẢI OFFLINE
// Không phụ thuộc AI - Tính toán theo thuật toán cổ truyền
// ==========================================

const MysticEngine = {
  // --- 1. THẦN SỐ HỌC (NUMEROLOGY) ---
  Numerology: {
    // Rút gọn 1 số về 1 chữ số (hoặc 11, 22, 33)
    reduceNumber(num) {
      if ([11, 22, 33].includes(num)) return num;
      let sum = num;
      while (sum > 9) {
        if ([11, 22, 33].includes(sum)) return sum;
        sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
      }
      return sum;
    },

    // Lấy con số chủ đạo từ Ngày sinh (DD/MM/YYYY hoặc YYYY-MM-DD)
    getLifePath(dob) {
      if (!dob) return 0;
      const parts = dob.replace(/\D/g, '');
      const sum = parts.split('').reduce((a, b) => a + parseInt(b), 0);
      return this.reduceNumber(sum);
    },

    // Bảng luận giải
    meaning: {
      1: "Số 1 (Người lãnh đạo): Tiên phong, độc lập, quyết đoán. Điểm yếu: Đôi khi bảo thủ, độc đoán.",
      2: "Số 2 (Người hòa giải): Lắng nghe, thấu hiểu, yêu hòa bình. Điểm yếu: Hay nhạy cảm, dễ bị tổn thương.",
      3: "Số 3 (Người truyền cảm hứng): Sáng tạo, hoạt ngôn, vui vẻ. Điểm yếu: Cả thèm chóng chán, thiếu kỷ luật.",
      4: "Số 4 (Người xây dựng): Kỷ luật, thực tế, chăm chỉ. Điểm yếu: Quá cứng nhắc, bảo thủ.",
      5: "Số 5 (Người tự do): Yêu tự do, thích khám phá, linh hoạt. Điểm yếu: Dễ cả thèm chóng chán, thiếu ổn định.",
      6: "Số 6 (Người chăm sóc): Yêu gia đình, bao dung, trách nhiệm. Điểm yếu: Hay ôm đồm, thích kiểm soát người thân.",
      7: "Số 7 (Người triết gia): Trí tuệ, ham học hỏi, thích phân tích. Điểm yếu: Cô độc, hay nghi ngờ.",
      8: "Số 8 (Người điều hành): Mạnh mẽ về tài chính, kinh doanh giỏi, bản lĩnh. Điểm yếu: Tham công tiếc việc, thực dụng.",
      9: "Số 9 (Người nhân đạo): Vị tha, có lý tưởng lớn, thích cống hiến. Điểm yếu: Dễ bị lợi dụng, ảo tưởng.",
      11: "Số 11 (Người truyền giáo): Trực giác cực nhạy bén, có khả năng tâm linh, truyền cảm hứng. Điểm yếu: Dễ căng thẳng thần kinh.",
      22: "Số 22 (Kiến trúc sư vĩ đại): Tầm nhìn lớn, khả năng biến ước mơ thành hiện thực. Điểm yếu: Dễ áp lực, độc đoán.",
      33: "Số 33 (Người thầy chữa lành): Khả năng chữa lành, yêu thương vô điều kiện, hy sinh."
    },

    analyze(name, dob) {
      const lifePath = this.getLifePath(dob);
      if (!lifePath) return "Vui lòng nhập ngày sinh hợp lệ.";
      const desc = this.meaning[lifePath] || "Chưa có dữ liệu cho con số này.";
      return `### LUẬN GIẢI THẦN SỐ HỌC (CHUYÊN GIA OFFLINE)\n- **Họ và tên:** ${name || 'Không rõ'}\n- **Con số chủ đạo (Đường đời): ${lifePath}**\n- **Ý nghĩa:** ${desc}\n\n*Lưu ý: Kết quả được tính toán chuẩn xác dựa trên công thức Thần số học Pythagoras truyền thống, không sử dụng AI, hoạt động 100% không cần mạng.*`;
    }
  },

  // --- 2. TÌNH DUYÊN (CAN CHI - NGŨ HÀNH) ---
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
      const chiName = this.chi[y % 12];
      const chiValue = chiMap[chiName];
      
      let sum = canValue + chiValue;
      if (sum > 5) sum -= 5;
      
      const hanhMap = {1: "Kim", 2: "Thủy", 3: "Hỏa", 4: "Thổ", 5: "Mộc"};
      return hanhMap[sum];
    },

    checkCompatibility(hanh1, hanh2) {
      if (hanh1 === hanh2) return "Bình hòa (Cùng hành, hỗ trợ lẫn nhau).";
      const tuongSinh = {"Kim":"Thủy", "Thủy":"Mộc", "Mộc":"Hỏa", "Hỏa":"Thổ", "Thổ":"Kim"};
      const tuongKhac = {"Kim":"Mộc", "Mộc":"Thổ", "Thổ":"Thủy", "Thủy":"Hỏa", "Hỏa":"Kim"};
      
      if (tuongSinh[hanh1] === hanh2) return `Tương sinh rất tốt (${hanh1} sinh ${hanh2}).`;
      if (tuongSinh[hanh2] === hanh1) return `Tương sinh rất tốt (${hanh2} sinh ${hanh1}).`;
      if (tuongKhac[hanh1] === hanh2) return `Tương khắc (${hanh1} khắc ${hanh2}). Chú ý nhường nhịn.`;
      if (tuongKhac[hanh2] === hanh1) return `Tương khắc (${hanh2} khắc ${hanh1}). Chú ý nhường nhịn.`;
      return "Bình hòa.";
    },

    analyzeLove(name1, dob1, name2, dob2) {
      if (!dob1 || !dob2) return "Vui lòng nhập đầy đủ ngày sinh của hai người.";
      
      const year1 = dob1.split('-')[0];
      const year2 = dob2.split('-')[0];
      
      if (!year1 || !year2 || year1.length !== 4 || year2.length !== 4) {
          return "Ngày sinh không hợp lệ. Vui lòng chọn lại năm sinh.";
      }

      const cc1 = this.getCanChi(year1);
      const cc2 = this.getCanChi(year2);
      
      const hanh1 = this.getNguHanh(year1);
      const hanh2 = this.getNguHanh(year2);
      
      const comp = this.checkCompatibility(hanh1, hanh2);
      
      return `### LUẬN GIẢI TÌNH DUYÊN (CHUYÊN GIA OFFLINE)\n\n**1. Thông tin người thứ nhất:**\n- Họ tên: ${name1 || 'Người 1'}\n- Mệnh: ${hanh1} (${cc1})\n\n**2. Thông tin người thứ hai:**\n- Họ tên: ${name2 || 'Người 2'}\n- Mệnh: ${hanh2} (${cc2})\n\n**3. Kết quả Luận giải:**\n- **Độ hòa hợp:** ${comp}\n- **Phân tích:** Hai người mệnh ${hanh1} và ${hanh2}. ${comp.includes('Tương sinh') ? 'Cuộc sống lứa đôi sẽ rất thuận lợi, người này là quý nhân của người kia.' : comp.includes('Tương khắc') ? 'Cần hạ bớt cái tôi và học cách lắng nghe thấu hiểu nhau nhiều hơn để hóa giải xung khắc.' : 'Mọi sự êm ấm, tôn trọng lẫn nhau là chìa khóa.'}\n\n*Lưu ý: Kết quả được tính bằng thuật toán Can Chi - Ngũ Hành cổ truyền.*`;
    }
  }
};

window.MysticEngine = MysticEngine;
