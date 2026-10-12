const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const matches = html.match(/<img[^>]+src="[^"]*"[^>]*>/g);
console.log(matches.filter(m => m.includes('hero') || m.includes('left') || m.includes('right') || m.includes('person')));
