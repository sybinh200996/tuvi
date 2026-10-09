const fs = require('fs');
let sw = fs.readFileSync('public/service-worker.js', 'utf8');
sw = sw.replace(/const CACHE = ".*?";/, 'const CACHE = "synam-nam46-assistant-v4-ui-restored";');
fs.writeFileSync('public/service-worker.js', sw);
