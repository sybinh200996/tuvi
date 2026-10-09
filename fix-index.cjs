const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');

// Remove from palm
html = html.replace('<div id="desktopTarotCards" style="display:flex;gap:15px;justify-content:center;margin:15px 0;"></div><button class="primary">🤖 Phân tích chỉ tay</button>', '<button class="primary">🤖 Phân tích chỉ tay</button>');

// Add to tarot
html = html.replace('</textarea></label><button class="primary">🃏 Rút bài AI</button>', '</textarea></label><div id="desktopTarotCards" style="display:flex;gap:15px;justify-content:center;margin:15px 0;"></div><button class="primary">🃏 Rút bài AI</button>');

fs.writeFileSync('public/index.html', html);
