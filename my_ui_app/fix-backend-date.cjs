const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

// Find the needsLiveOrKnowledgeAnswer regex
// original: const needsLiveOrKnowledgeAnswer = /(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|mưa|mua|nắng|nang|bão|bao|gió|gio|độ ẩm|do am|khí hậu|khi hau|lịch thi đấu|lich thi dau|tin tức|tin tuc|giá|gia|tỷ giá|ty gia)/i.test(q);

const searchStr = "const needsLiveOrKnowledgeAnswer = /(th?i ti?t|thoi tiet|d? bo|du bao|nhi?t d?|nhiet do|mua|mua|n?ng|nang|bao|bao|gi|gio|d? ?m|do am|kh h?u|khi hau|l?ch thi d?u|lich thi dau|tin t?c|tin tuc|gi|gia|t? gi|ty gia)/i.test(q);";
// Since there's unicode encoding issues in powershell output, I'll just use a general replace

code = code.replace(
  /const needsLiveOrKnowledgeAnswer = \/\(th\S+? gia\)\/i\.test\(q\);/g,
  "const needsLiveOrKnowledgeAnswer = /(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|mưa|mua|nắng|nang|bão|bao|gió|gio|độ ẩm|do am|khí hậu|khi hau|lịch thi đấu|lich thi dau|tin tức|tin tuc|giá|gia|tỷ giá|ty gia|tử vi|tu vi|chỉ tay|chi tay|xem tướng|xem tuong|chiêm tinh|chiem tinh|thần số học|than so hoc|luận giải|luan giai|phân tích|phan tich|tình duyên|tinh duyen)/i.test(q);"
);

// Actually, let's just use string replace for safety
let oldRegex = `/(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|mưa|mua|nắng|nang|bão|bao|gió|gio|độ ẩm|do am|khí hậu|khi hau|lịch thi đấu|lich thi dau|tin tức|tin tuc|giá|gia|tỷ giá|ty gia)/i.test(q);`;
let newRegex = `/(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|mưa|mua|nắng|nang|bão|bao|gió|gio|độ ẩm|do am|khí hậu|khi hau|lịch thi đấu|lich thi dau|tin tức|tin tuc|giá|gia|tỷ giá|ty gia|tử vi|tu vi|chỉ tay|chi tay|xem tướng|xem tuong|chiêm tinh|chiem tinh|thần số học|than so hoc|luận giải|luan giai|phân tích|phan tich|tình duyên|tinh duyen)/i.test(q);`;

if(code.includes(oldRegex)) {
  code = code.replace(oldRegex, newRegex);
} else {
  // If not found, let's just patch the whole function
  console.log("Could not find the exact old regex. Patching function instead...");
  const oldFuncStart = `function directDateTimeAnswer(message = '') {`;
  const funcIdx = code.indexOf(oldFuncStart);
  if(funcIdx !== -1) {
     const nextFuncIdx = code.indexOf(`function directWeatherAnswer`, funcIdx);
     if (nextFuncIdx !== -1) {
        code = code.substring(0, funcIdx) + 
        `function directDateTimeAnswer(message = '') {
  const q = String(message || '').toLowerCase().normalize('NFC');
  const needsLiveOrKnowledgeAnswer = /(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|mưa|mua|nắng|nang|bão|bao|gió|gio|độ ẩm|do am|khí hậu|khi hau|lịch thi đấu|lich thi dau|tin tức|tin tuc|giá|gia|tỷ giá|ty gia|tử vi|tu vi|chỉ tay|chi tay|xem tướng|xem tuong|chiêm tinh|chiem tinh|thần số học|than so hoc|luận giải|luan giai|phân tích|phan tich|tình duyên|tinh duyen)/i.test(q);
  if (needsLiveOrKnowledgeAnswer) return null;
  const asksDate = /(hôm nay|hom nay|ngày mai|ngay mai|ngày kia|ngay kia|hôm qua|hom qua|thứ mấy|thu may|ngày bao nhiêu|ngay bao nhieu|mấy giờ|may gio|bây giờ|bay gio|giờ hiện tại|gio hien tai)/i.test(q);
  if (!asksDate) return null;
  let offset = 0;
  let label = 'Hôm nay';
  if (/(ngày kia|ngay kia)/i.test(q)) { offset = 2; label = 'Ngày kia'; }
  else if (/(ngày mai|ngay mai|\\bmai\\b)/i.test(q)) { offset = 1; label = 'Ngày mai'; }
  else if (/(hôm qua|hom qua)/i.test(q)) { offset = -1; label = 'Hôm qua'; }
  const x = vietnamDateFromNow(offset);
  if (/(mấy giờ|may gio|bây giờ|bay gio|giờ hiện tại|gio hien tai)/i.test(q)) {
    return \`\${label} là **\${x.weekday}, ngày \${x.day}/\${x.month}/\${x.year}**. Hiện tại ở Việt Nam khoảng **\${x.hour}:\${x.minute}**.\`;
  }
  return \`\${label} là **\${x.weekday}, ngày \${x.day}/\${x.month}/\${x.year}**.\`;
}

` + code.substring(nextFuncIdx);
     }
  }
}

fs.writeFileSync('server.js', code);
console.log('Fixed directDateTimeAnswer to ignore astrology queries');
