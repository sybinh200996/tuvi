/**
 * Controller: simPhongThuy.controller.js
 * Chuẩn kiến trúc ESM (Node.js / Express)
 * Áp dụng 100% Domain Knowledge: Định giá đa tầng & 5 Tiêu chí Phong thủy số học
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bát quái và 3 hào tương ứng (0: Hào Âm --, 1: Hào Dương —)
const BAT_QUAI = {
  1: { name: 'Càn', nature: 'Thiên (Trời)', hao: [1, 1, 1] },   // ☰
  2: { name: 'Đoài', nature: 'Trạch (Đầm)', hao: [1, 1, 0] },   // ☱
  3: { name: 'Ly', nature: 'Hỏa (Lửa)', hao: [1, 0, 1] },       // ☲
  4: { name: 'Chấn', nature: 'Lôi (Sấm)', hao: [1, 0, 0] },     // ☳
  5: { name: 'Tốn', nature: 'Phong (Gió)', hao: [0, 1, 1] },     // ☴
  6: { name: 'Khảm', nature: 'Thủy (Nước)', hao: [0, 1, 0] },   // ☵
  7: { name: 'Cấn', nature: 'Sơn (Núi)', hao: [0, 0, 1] },      // ☶
  8: { name: 'Khôn', nature: 'Địa (Đất)', hao: [0, 0, 0] }      // ☷
};

// Đọc bảng 64 quẻ dịch
let bangQue = {};
try {
  const filePath = path.join(__dirname, '..', 'data', 'queKinhDich.json');
  if (fs.existsSync(filePath)) {
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    bangQue = raw.bangQue || {};
  }
} catch (e) {
  console.warn('[SimPhongThuy] Lưu ý: Chưa đọc được queKinhDich.json');
}

/**
 * =========================================================================
 * 1. NÂNG CẤP HÀM ĐỊNH GIÁ (Valuation Logic)
 * =========================================================================
 */
export function calculatePrice(phoneNumber) {
  const cleanPhone = String(phoneNumber || '').replace(/\D/g, '');
  
  // Bước 1: Giá trị nền (Base Price)
  let currentPrice = 500000;
  const tags = [];

  // Bước 2: Quét đuôi số siêu VIP (Thứ tự từ cao xuống thấp để tránh trùng lặp)
  if (/(\d)\1{5}$/.test(cleanPhone)) {
    currentPrice += 200000000;
    tags.push(`Lục quý ${cleanPhone.slice(-1)}`);
  } else if (/(\d)\1{4}$/.test(cleanPhone)) {
    currentPrice += 30000000;
    tags.push(`Ngũ quý ${cleanPhone.slice(-1)}`);
  } else if (/(\d)\1{3}$/.test(cleanPhone)) {
    currentPrice += 7000000;
    tags.push(`Tứ quý ${cleanPhone.slice(-1)}`);
  }

  // Quét sảnh tiến
  if (/(012345|123456|234567|345678|456789)$/.test(cleanPhone)) {
    currentPrice += 50000000;
    tags.push('Sảnh tiến 6 số');
  } else if (/(01234|12345|23456|34567|45678|56789)$/.test(cleanPhone)) {
    currentPrice += 15000000;
    tags.push('Sảnh tiến 5 số');
  } else if (/(1234|2345|3456|4567|5678|6789)$/.test(cleanPhone)) {
    currentPrice += 3000000;
    tags.push('Sảnh tiến 4 số');
  }

  // Taxi 3 vòng (VD: 68.68.68)
  if (/(\d{2})\1\1$/.test(cleanPhone)) {
    currentPrice += 40000000;
    tags.push(`Taxi 3 vòng (${cleanPhone.slice(-6)})`);
  }

  // Tam hoa kép (VD: 888999)
  if (/(\d)\1{2}(\d)\2{2}$/.test(cleanPhone)) {
    currentPrice += 25000000;
    tags.push('Tam hoa kép');
  }

  // Bước 3: Quét đuôi dân gian / Tài lộc
  if (/(6868|8686)$/.test(cleanPhone)) {
    currentPrice += 10000000;
    tags.push('Đại Lộc Phát Kép (6868/8686)');
  } else if (/(3979|7939|7979|3939)$/.test(cleanPhone)) {
    currentPrice += 5000000;
    tags.push('Thần Tài Kép');
  } else if (/(68|86)$/.test(cleanPhone)) {
    currentPrice += 1000000;
    tags.push('Đuôi Lộc Phát');
  } else if (/(39|79)$/.test(cleanPhone)) {
    currentPrice += 1000000;
    tags.push('Đuôi Thần Tài');
  }

  // Bước 4: Trừ điểm lỗi phong thủy
  let penaltyRate = 0;
  if (/49|53/.test(cleanPhone)) {
    penaltyRate += 0.30;
    tags.push('Dính số hạn (49/53) -30%');
  }

  // Nếu số đuôi là "4" hoặc "7" mà không phải tứ quý trở lên
  const lastChar = cleanPhone.slice(-1);
  const isTuQuyOrMore = /(\d)\1{3}$/.test(cleanPhone);
  if ((lastChar === '4' || lastChar === '7') && !isTuQuyOrMore) {
    penaltyRate += 0.20;
    tags.push(`Đuôi dính số ${lastChar} -20%`);
  }

  // Áp dụng giảm giá
  if (penaltyRate > 0) {
    currentPrice = currentPrice * (1 - Math.min(penaltyRate, 0.60)); // Giảm tối đa 60%
  }

  // Bước 5: Hệ số Đầu Số VIP (Nhân bội số ở bước cuối)
  let prefixMultiplier = 1.0;
  const p3 = cleanPhone.slice(0, 3);
  if (['090', '091', '098', '099', '088'].includes(p3)) {
    prefixMultiplier = 2.0;
    tags.push(`Đầu số Đại Cổ / VIP (${p3}) x2.0`);
  } else if (['093', '094', '097', '096', '086', '089'].includes(p3)) {
    prefixMultiplier = 1.5;
    tags.push(`Đầu số Vàng (${p3}) x1.5`);
  }

  const finalPrice = Math.round((currentPrice * prefixMultiplier) / 100000) * 100000;
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice);

  return {
    rawPrice: finalPrice,
    formattedPrice,
    tags
  };
}

/**
 * =========================================================================
 * 2. NÂNG CẤP HÀM PHONG THỦY (Feng Shui Logic)
 * =========================================================================
 */

// Helper 1: Tính Mệnh Niên (Kim, Mộc, Thủy, Hỏa, Thổ) theo Lục Thập Hoa Giáp chính xác 100%
export function getMenhNien(birthYear) {
  const y = Number(birthYear);
  if (!y || isNaN(y)) return { canChi: 'Chưa rõ', menh: 'Thổ' };

  // Can: Giáp, Ất = 1; Bính, Đinh = 2; Mậu, Kỷ = 3; Canh, Tân = 4; Nhâm, Quý = 5
  // Index tương ứng với CAN_NAMES: 0 (Giáp) -> 1, 1 (Ất) -> 1, 2 (Bính) -> 2...
  const canMap = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5];
  const canIndex = ((y - 4) % 10 + 10) % 10;
  const canScore = canMap[canIndex];

  // Chi: Tý, Sửu, Ngọ, Mùi = 0; Dần, Mão, Thân, Dậu = 1; Thìn, Tỵ, Tuất, Hợi = 2
  const chiMap = [0, 0, 1, 1, 2, 2, 0, 0, 1, 1, 2, 2];
  const chiIndex = ((y - 4) % 12 + 12) % 12;
  const chiScore = chiMap[chiIndex];

  let menhScore = canScore + chiScore;
  if (menhScore > 5) menhScore -= 5;

  const MENH_MAP = {
    1: 'Kim',
    2: 'Thủy',
    3: 'Hỏa',
    4: 'Thổ',
    5: 'Mộc'
  };

  const CAN_NAMES = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI_NAMES = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const canStr = CAN_NAMES[(y - 4) % 10 >= 0 ? (y - 4) % 10 : (y - 4) % 10 + 10];
  const chiStr = CHI_NAMES[(y - 4) % 12 >= 0 ? (y - 4) % 12 : (y - 4) % 12 + 12];

  return {
    canChi: `${canStr} ${chiStr}`,
    menh: MENH_MAP[menhScore] || 'Thổ'
  };
}

// Helper 2: Tìm quái theo 3 hào âm/dương
function findQuaiByHao(haoArr) {
  for (let key = 1; key <= 8; key++) {
    const qHao = BAT_QUAI[key].hao;
    if (qHao[0] === haoArr[0] && qHao[1] === haoArr[1] && qHao[2] === haoArr[2]) {
      return key;
    }
  }
  return 8; // Mặc định Khôn
}

export function calculatePhongThuy(phoneNumber, birthYear) {
  const cleanPhone = String(phoneNumber || '').replace(/\D/g, '');
  const digits = cleanPhone.split('').map(Number);

  // Tiêu chí 1: Âm Dương Tương Phối
  let evenCount = 0; // Chẵn (Âm)
  let oddCount = 0;  // Lẻ (Dương)
  digits.forEach(d => {
    if (d % 2 === 0) evenCount++;
    else oddCount++;
  });
  const evenPercent = Math.round((evenCount / digits.length) * 100);
  const oddPercent = 100 - evenPercent;
  const yinYangRatio = `${evenPercent}% Âm (Chẵn) - ${oddPercent}% Dương (Lẻ)`;

  // Tiêu chí 2: Nút Số (Hàng đơn vị tổng các chữ số)
  const totalSum = digits.reduce((sum, d) => sum + d, 0);
  let nut = totalSum % 10;
  if (nut === 0 && totalSum > 0) nut = 10;

  // Tiêu chí 3: Ngũ Hành Bản Mệnh (QUAN TRỌNG NHẤT)
  const userMenhInfo = getMenhNien(birthYear);
  const userMenh = userMenhInfo.menh;

  // Ngũ hành của số cuối sim:
  // 1: Thủy; 2,8: Thổ; 3,4: Mộc; 6,7: Kim; 9: Hỏa; 5: Thổ; 0: Thủy
  const lastDigit = digits[digits.length - 1];
  let simElement = 'Thổ';
  if ([0, 1].includes(lastDigit)) simElement = 'Thủy';
  else if ([2, 5, 8].includes(lastDigit)) simElement = 'Thổ';
  else if ([3, 4].includes(lastDigit)) simElement = 'Mộc';
  else if ([6, 7].includes(lastDigit)) simElement = 'Kim';
  else if (lastDigit === 9) simElement = 'Hỏa';

  // Xác định quan hệ Sinh / Khắc
  let tuongTac = 'Bình Hòa';
  const SINH_MAP = {
    'Kim': 'Thủy', 'Thủy': 'Mộc', 'Mộc': 'Hỏa', 'Hỏa': 'Thổ', 'Thổ': 'Kim'
  };
  const KHAC_MAP = {
    'Kim': 'Mộc', 'Mộc': 'Thổ', 'Thổ': 'Thủy', 'Thủy': 'Hỏa', 'Hỏa': 'Kim'
  };

  if (simElement === userMenh) {
    tuongTac = `Tương Hỗ (Sim ${simElement} đồng hành cùng Mệnh ${userMenh} - Rất Tốt)`;
  } else if (SINH_MAP[simElement] === userMenh) {
    tuongTac = `Tương Sinh (Sim ${simElement} sinh Mệnh ${userMenh} - Đại Cát)`;
  } else if (SINH_MAP[userMenh] === simElement) {
    tuongTac = `Sinh Xuất (Mệnh ${userMenh} sinh Sim ${simElement} - Hao tổn nhẹ)`;
  } else if (KHAC_MAP[simElement] === userMenh) {
    tuongTac = `Tương Khắc (Sim ${simElement} khắc Mệnh ${userMenh} - Hung, cần hóa giải)`;
  } else if (KHAC_MAP[userMenh] === simElement) {
    tuongTac = `Khắc Xuất (Mệnh ${userMenh} khắc Sim ${simElement} - Làm chủ hoàn cảnh)`;
  }

  // Tiêu chí 4: Cửu Tinh Đồ Pháp (Đắc Vận 9: 2024 - 2043)
  const count9 = digits.filter(d => d === 9).length;
  let van9Evaluation = `Chứa ${count9} con số 9`;
  if (count9 >= 3) van9Evaluation += ' (Đại cát: Đắc lệnh Cửu Tử tối thượng thời Vận 9)';
  else if (count9 >= 1) van9Evaluation += ' (Hợp vận: Hấp thụ tốt cát khí Vận 9)';
  else van9Evaluation += ' (Bình thường: Thiếu số 9 đương vận)';

  // Tiêu chí 5: Quẻ Dịch (Cả Chủ và Hỗ)
  const halfLen = Math.floor(digits.length / 2);
  const firstHalfSum = digits.slice(0, halfLen).reduce((a, b) => a + b, 0);
  const secondHalfSum = digits.slice(halfLen).reduce((a, b) => a + b, 0);

  const thuongQuaiNum = (firstHalfSum % 8) || 8;
  const haQuaiNum = (secondHalfSum % 8) || 8;

  const thuongQuai = BAT_QUAI[thuongQuaiNum];
  const haQuai = BAT_QUAI[haQuaiNum];

  // 1. Quẻ Chủ
  const queChuKey = `${thuongQuaiNum}-${haQuaiNum}`;
  const queChuInfo = bangQue[queChuKey] || { ten: `${thuongQuai.name} ${haQuai.name}`, tinhChat: 'Cát', yNghia: 'Vận thế hanh thông' };

  // 2. Quẻ Hỗ:
  // Dựng 6 hào của Quẻ Chủ:
  // Hào 1, 2, 3 là Hạ Quái; Hào 4, 5, 6 là Thượng Quái (index 0..2 và 3..5)
  const sixHao = [...haQuai.hao, ...thuongQuai.hao]; // [h1, h2, h3, h4, h5, h6]

  // Hạ quái của Quẻ Hỗ: Hào 2, 3, 4 (index 1, 2, 3)
  const haQuaiHoArr = [sixHao[1], sixHao[2], sixHao[3]];
  const haQuaiHoNum = findQuaiByHao(haQuaiHoArr);

  // Thượng quái của Quẻ Hỗ: Hào 3, 4, 5 (index 2, 3, 4)
  const thuongQuaiHoArr = [sixHao[2], sixHao[3], sixHao[4]];
  const thuongQuaiHoNum = findQuaiByHao(thuongQuaiHoArr);

  const queHoKey = `${thuongQuaiHoNum}-${haQuaiHoNum}`;
  const queHoInfo = bangQue[queHoKey] || { ten: `${BAT_QUAI[thuongQuaiHoNum].name} ${BAT_QUAI[haQuaiHoNum].name}`, tinhChat: 'Bình', yNghia: 'Diễn biến nội lực hỗ trợ' };

  return {
    yinYang: {
      ratio: yinYangRatio,
      evenPercent,
      oddPercent
    },
    nutSo: {
      score: nut,
      totalSum
    },
    nguHanh: {
      userCanChi: userMenhInfo.canChi,
      userMenh: userMenh,
      simElement: simElement,
      lastDigit: lastDigit,
      tuongTac: tuongTac
    },
    van9: {
      count9: count9,
      evaluation: van9Evaluation
    },
    queDich: {
      queChu: {
        ten: queChuInfo.ten,
        tinhChat: queChuInfo.tinhChat,
        yNghia: queChuInfo.yNghia
      },
      queHo: {
        ten: queHoInfo.ten,
        tinhChat: queHoInfo.tinhChat,
        yNghia: queHoInfo.yNghia
      }
    }
  };
}

/**
 * =========================================================================
 * 3. API MAIN CONTROLLER: POST /api/sim/evaluate
 * =========================================================================
 */
export async function evaluateSim(req, res) {
  try {
    const { phoneNumber, birthYear } = req.body || {};
    const cleanPhone = String(phoneNumber || '').replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({
        ok: false,
        error: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số (ví dụ: 0988686868).'
      });
    }

    let year = Number(birthYear);
    if (!year || isNaN(year)) {
      const match = String(birthYear || '').match(/(19|20)\d{2}/);
      year = match ? parseInt(match[0], 10) : new Date().getFullYear();
    }

    // 1. Tính toán định giá
    const priceData = calculatePrice(cleanPhone);

    // 2. Tính toán phong thủy 5 tiêu chí
    const ptData = calculatePhongThuy(cleanPhone, year);

    // 3. Chuỗi Prompt AI hoàn chỉnh theo đúng yêu cầu
    const aiPromptData = `Dựa vào data sau:
- Số điện thoại: ${cleanPhone} (Năm sinh: ${year} - ${ptData.nguHanh.userCanChi})
- Giá dự kiến: ${priceData.formattedPrice} (Tags: ${priceData.tags.join(', ') || 'Sim phổ thông'})
- Tỷ lệ Âm Dương: ${ptData.yinYang.ratio}
- Điểm Nút: ${ptData.nutSo.score} điểm (Tổng ${ptData.nutSo.totalSum})
- Ngũ hành Sim (số đuôi ${ptData.nguHanh.lastDigit}): ${ptData.nguHanh.simElement}
- Ngũ hành Bản mệnh: ${ptData.nguHanh.userMenh}
- Tương tác ngũ hành: ${ptData.nguHanh.tuongTac}
- Đắc vận 9: ${ptData.van9.count9} số 9 (${ptData.van9.evaluation})
- Quẻ Dịch: Quẻ Chủ [${ptData.queDich.queChu.ten} - ${ptData.queDich.queChu.tinhChat}], Quẻ Hỗ [${ptData.queDich.queHo.ten} - ${ptData.queDich.queHo.tinhChat}]

Hãy luận giải chi tiết như một bậc thầy lý số, phân tích sâu từng yếu tố và đánh giá độ chênh lệch giá trị.`;

    return res.json({
      ok: true,
      phone: cleanPhone,
      birthYear: year,
      price: priceData,
      phongThuy: ptData,
      aiPromptData
    });
  } catch (error) {
    console.error('[Sim Controller Error]:', error);
    return res.status(500).json({
      ok: false,
      error: 'Lỗi máy chủ khi thẩm định sim: ' + error.message
    });
  }
}

export default {
  evaluateSim,
  calculatePrice,
  calculatePhongThuy,
  getMenhNien
};
