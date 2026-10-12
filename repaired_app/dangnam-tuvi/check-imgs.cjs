const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const matches = html.match(/<img[^>]+class="hero-[^"]+"[^>]*>/g);
console.log(matches);
