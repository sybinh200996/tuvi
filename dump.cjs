const fs = require('fs');
const lines = fs.readFileSync('server.js', 'utf8').split('\n');
const idx = lines.findIndex(l => l.includes('app.post("/api/mystic-ai"'));
console.log(lines.slice(idx, idx+150).join('\n'));
