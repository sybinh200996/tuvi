/**
 * Controller: simPhongThuy.controller.js
 * Nhiệm vụ: Tính toán logic phong thủy số học & định giá sim bằng thuật toán cứng trước khi đẩy sang AI
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đọc dữ liệu Quẻ Dịch Kinh Doanh & Phong Thủy
let kinhDichData = { batQuai: {}, bangQue: {} };
try {
  const filePath = path.join(__dirname, '..', 'data', 'queKinhDich.json');
  if (fs.existsSync(filePath)) {
    kinhDichData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
} catch (err) {
  console.warn('[SimPhongThuy] Không tải được queKinhDich.json, sử dụng fallback memory.', err.message);
}

// Bảng tra fallback bát quái nếu file chưa được nạp
const FALLBACK_QUAI = {
  1: { name: 'Càn', nature: 'Thiên (Trời)' },
  2: { name: 'Đoài', nature: 'Trạch (Đầm)' },
  3: { name: 'Ly', nature: 'Hỏa (Lửa)' },
  4: { name: 'Chấn', nature: 'Lôi (Sấm)' },
  5: { name: 'Tốn', nature: 'Phong (Gió)' },
  6: { name: 'Khảm', nature: 'Thủy (Nước)' },
  7: { name: 'Cấn', nature: 'Sơn (Núi)' },
  8: { name: 'Khôn', nature: 'Địa (Đất)' }
};

/**
 * 1. Hàm tính giá trị sim (VND) dựa trên phân tích hình thái số học
 * @param {string} cleanPhone Chuỗi số điện thoại 10 số
 * @returns {object} { basePrice, multiplier, finalPrice, formattedPrice, tags }
 */
export function calculatePrice(cleanPhone) {
  let basePrice = 500000; // Giá khởi điểm sim thông thường (500k)
  const tags = [];

  // A. Kiểm tra ĐUÔI SỐ ĐẮT TIỀN (Thứ tự từ cao xuống thấp)
  if (/(\d)\1{4}$/.test(cleanPhone)) {
    // Ngũ quý (ví dụ: 88888, 99999)
    const digit = cleanPhone.slice(-1);
    basePrice = (digit === '8' || digit === '9' || digit === '6') ? 120000000 : 70000000;
    tags.push(`Ngũ quý ${digit}${digit}${digit}${digit}${digit}`);
  } else if (/(\d)\1{3}$/.test(cleanPhone)) {
    // Tứ quý (ví dụ: 8888, 9999)
    const digit = cleanPhone.slice(-1);
    basePrice = (digit === '8' || digit === '9' || digit === '6') ? 35000000 : 18000000;
    tags.push(`Tứ quý ${digit}${digit}${digit}${digit}`);
  } else if (/(\d)\1{2}(\d)\2{2}$/.test(cleanPhone)) {
    // Tam hoa kép (ví dụ: 888999, 666888)
    basePrice = 16000000;
    tags.push('Tam hoa kép');
  } else if (/(01234|12345|23456|34567|45678|56789)$/.test(cleanPhone)) {
    // Sảnh tiến 5 số
    basePrice = 25000000;
    tags.push('Sảnh tiến 5 bước (Đại phát)');
  } else if (/(1234|2345|3456|4567|5678|6789)$/.test(cleanPhone)) {
    // Sảnh tiến 4 số
    basePrice = 8000000;
    tags.push('Sảnh tiến 4 bước');
  } else if (/(6868|8686)$/.test(cleanPhone)) {
    // Song Lộc Phát kép
    basePrice = 12000000;
    tags.push('Đại Lộc Phát Kép 6868/8686');
  } else if (/(3979|7939|7979|3939)$/.test(cleanPhone)) {
    // Thần tài kép
    basePrice = 10000000;
    tags.push('Song Thần Tài (39-79)');
  } else if (/(\d)\1{2}$/.test(cleanPhone)) {
    // Tam hoa đuôi (ví dụ: 999, 888)
    basePrice = 3500000;
    tags.push(`Tam hoa đuôi ${cleanPhone.slice(-1)}`);
  } else if (/(68|86)$/.test(cleanPhone)) {
    basePrice = 1800000;
    tags.push('Đuôi Lộc Phát');
  } else if (/(39|79)$/.test(cleanPhone)) {
    basePrice = 1500000;
    tags.push('Đuôi Thần Tài');
  }

  // B. HỆ SỐ ĐẦU SỐ CỔ & ĐẦU SỐ ĐẸP
  let multiplier = 1.0;
  const prefix3 = cleanPhone.slice(0, 3);
  const prefix2 = cleanPhone.slice(0, 2);

  if (['090', '091', '098', '097'].includes(prefix3)) {
    multiplier = 1.5; // Đầu cổ VIP nguyên thủy Viettel/Mobi/Vina
    tags.push(`Đầu số cổ Hoàng Kim (${prefix3})`);
  } else if (['086', '088', '089', '038', '039', '079'].includes(prefix3)) {
    multiplier = 1.3;
    tags.push(`Đầu phát tài (${prefix3})`);
  } else if (['03', '07', '08'].includes(prefix2)) {
    multiplier = 1.2;
    tags.push(`Đầu số thế hệ mới (${prefix2}x)`);
  }

  // Tính giá cuối cùng và làm tròn đến hàng trăm nghìn
  const rawFinal = basePrice * multiplier;
  const finalPrice = Math.round(rawFinal / 100000) * 100000;

  // Định dạng hiển thị VNĐ
  const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice);

  return {
    basePrice,
    multiplier,
    finalPrice,
    formattedPrice,
    priceRange: `${new Intl.NumberFormat('vi-VN').format(Math.round(finalPrice * 0.85))} đ - ${new Intl.NumberFormat('vi-VN').format(Math.round(finalPrice * 1.25))} đ`,
    tags
  };
}

/**
 * 2. Hàm tính toán Phong thủy Số học (Âm Dương, Nút số, Quẻ Kinh Dịch)
 * @param {string} cleanPhone Chuỗi số điện thoại
 * @param {number|string} birthYear Năm sinh của người sở hữu
 * @returns {object} Kết quả tính toán phong thủy chi tiết
 */
export function calculatePhongThuy(cleanPhone, birthYear) {
  const digits = cleanPhone.split('').map(Number);

  // A. TỶ LỆ ÂM DƯƠNG
  // Số Chẵn: 0, 2, 4, 6, 8 thuộc Âm
  // Số Lẻ: 1, 3, 5, 7, 9 thuộc Dương
  let evenCount = 0; // Âm
  let oddCount = 0;  // Dương

  digits.forEach(d => {
    if (d % 2 === 0) evenCount++;
    else oddCount++;
  });

  const totalDigits = digits.length;
  const evenPercent = Math.round((evenCount / totalDigits) * 100);
  const oddPercent = 100 - evenPercent;

  let yinYangEvaluation = 'Cân bằng hoàn hảo (50/50)';
  if (Math.abs(evenCount - oddCount) === 2) {
    yinYangEvaluation = evenCount > oddCount ? 'Hơi vượng Âm (Tích tụ tài lộc, tĩnh tại)' : 'Hơi vượng Dương (Chủ động, bứt phá sự nghiệp)';
  } else if (Math.abs(evenCount - oddCount) > 2) {
    yinYangEvaluation = evenCount > oddCount ? 'Thái Âm (Quá tĩnh, cần kích hoạt năng lượng)' : 'Thái Dương (Quá nóng nảy, dễ hao tán)';
  }

  // B. ĐIỂM NÚT SỐ (TỔNG ĐIỂM NƯỚC)
  const totalSum = digits.reduce((sum, d) => sum + d, 0);
  let nutSo = totalSum % 10;
  if (nutSo === 0 && totalSum > 0) nutSo = 10; // Điểm 10 tuyệt đối nếu chia hết cho 10

  let nutMeaning = 'Bình hòa';
  if (nutSo >= 8) nutMeaning = 'Đại Cát - Thu hút quý nhân, lộc lá ngập tràn';
  else if (nutSo >= 6) nutMeaning = 'Cát lành - Công việc hanh thông, ổn định';
  else nutMeaning = 'Điểm trung bình - Cần nỗ lực bổ trợ';

  // C. QUẺ KINH DỊCH THEO HÀ LẠC THẦN SỐ
  // Chia 10 số thành 2 nửa: 5 số đầu làm Thượng quái, 5 số sau làm Hạ quái
  const halfLen = Math.floor(digits.length / 2);
  const firstHalfSum = digits.slice(0, halfLen).reduce((a, b) => a + b, 0);
  const secondHalfSum = digits.slice(halfLen).reduce((a, b) => a + b, 0);

  // Số dư chia cho 8: nếu dư 0 thì lấy 8 (Quẻ Khôn)
  const thuongQuaiNum = (firstHalfSum % 8) || 8;
  const haQuaiNum = (secondHalfSum % 8) || 8;

  const thuongQuai = kinhDichData.batQuai?.[thuongQuaiNum] || FALLBACK_QUAI[thuongQuaiNum];
  const haQuai = kinhDichData.batQuai?.[haQuaiNum] || FALLBACK_QUAI[haQuaiNum];

  const queKey = `${thuongQuaiNum}-${haQuaiNum}`;
  const queChiTiet = kinhDichData.bangQue?.[queKey] || {
    ten: `${thuongQuai.name} ${haQuai.name}`,
    tinhChat: 'Cát',
    yNghia: 'Thời vận thuận buồm xuôi gió, công danh rộng mở.'
  };

  return {
    yinYang: {
      evenCount,
      oddCount,
      evenPercent,
      oddPercent,
      evaluation: yinYangEvaluation
    },
    nutSo: {
      totalSum,
      score: nutSo,
      meaning: nutMeaning
    },
    queDich: {
      thuongQuaiNum,
      thuongQuai: `${thuongQuai.name} (${thuongQuai.nature})`,
      haQuaiNum,
      haQuai: `${haQuai.name} (${haQuai.nature})`,
      tenQue: queChiTiet.ten,
      tinhChat: queChiTiet.tinhChat,
      yNghia: queChiTiet.yNghia
    }
  };
}

/**
 * 3. Controller Main Handler: POST /api/sim/evaluate
 */
export async function evaluateSim(req, res) {
  try {
    const { phoneNumber, birthYear } = req.body || {};

    // Validate số điện thoại
    const cleanPhone = String(phoneNumber || '').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10 || cleanPhone.length > 11) {
      return res.status(400).json({
        ok: false,
        error: 'Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số (ví dụ: 0988686868).'
      });
    }

    const year = Number(birthYear) || new Date().getFullYear();

    // 1. Tính giá trị sim
    const priceResult = calculatePrice(cleanPhone);

    // 2. Tính toán phong thủy kinh dịch
    const phongThuyResult = calculatePhongThuy(cleanPhone, year);

    // 3. Gom thành khối dữ liệu có cấu trúc dành riêng cho Prompt AI
    const aiPromptData = `
[DỮ LIỆU ĐỊNH GIÁ & PHONG THỦY SIM ĐÃ TÍNH TOÁN CHÍNH XÁC TỪ SERVER]
- Số điện thoại tra cứu: ${cleanPhone}
- Năm sinh đương số: ${year}
- Định giá ước tính thị trường: ${priceResult.formattedPrice} (Khoảng dao động: ${priceResult.priceRange})
- Phân khúc sim: ${priceResult.tags.join(', ') || 'Sim phổ thông thân thiện'}
- Cân bằng Âm Dương: ${phongThuyResult.yinYang.evenPercent}% Âm (${phongThuyResult.yinYang.evenCount} số chẵn) - ${phongThuyResult.yinYang.oddPercent}% Dương (${phongThuyResult.yinYang.oddCount} số lẻ) -> Đánh giá: ${phongThuyResult.yinYang.evaluation}
- Điểm nút số (Tổng điểm nước): Tổng ${phongThuyResult.nutSo.totalSum} đạt ${phongThuyResult.nutSo.score} nút (${phongThuyResult.nutSo.meaning})
- Quẻ Kinh Dịch Chủ quản: Quẻ "${phongThuyResult.queDich.tenQue}" (Thượng: ${phongThuyResult.queDich.thuongQuai}, Hạ: ${phongThuyResult.queDich.haQuai})
- Tính chất quẻ: ${phongThuyResult.queDich.tinhChat} -> Lời cổ nhân: "${phongThuyResult.queDich.yNghia}"
`.trim();

    // Trả về JSON cho Client
    return res.json({
      ok: true,
      phone: cleanPhone,
      birthYear: year,
      price: priceResult,
      phongThuy: phongThuyResult,
      aiPromptData
    });
  } catch (error) {
    console.error('[SimPhongThuy Error]:', error);
    return res.status(500).json({
      ok: false,
      error: 'Lỗi máy chủ khi tính toán định giá sim phong thủy: ' + error.message
    });
  }
}

export default {
  evaluateSim,
  calculatePrice,
  calculatePhongThuy
};
