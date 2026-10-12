const fs = require('fs');

// Desktop App text replacements
let desktop = fs.readFileSync('public/index.html', 'utf8');
desktop = desktop.replace(/<h2>🃏 Bói bài<\/h2>/g, '<h2>🃏 Xem bài Tarot</h2>');
desktop = desktop.replace(/<h2>Kết quả bói bài<\/h2>/g, '<h2>Kết quả bài Tarot</h2>');
fs.writeFileSync('public/index.html', desktop);

// Mobile App text replacements
let mobile = fs.readFileSync('public/mobile-app.js', 'utf8');
mobile = mobile.replace(/'Bói bài'/g, "'Xem bài Tarot'");
mobile = mobile.replace(/'Bói bài \/ Đổi bài'/g, "'Xem bài Tarot'");
mobile = mobile.replace(/<h2>🃏 Bói bài \/ Đổi bài<\/h2>/g, "<h2>🃏 Xem bài Tarot</h2>");
mobile = mobile.replace(/'🃏 Đổi bài'/g, "'🃏 Trải bài mới'");
mobile = mobile.replace(/'🃏 Bốc bài'/g, "'🃏 Trải bài Tarot'");
fs.writeFileSync('public/mobile-app.js', mobile);
