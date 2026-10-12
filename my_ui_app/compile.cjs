const fs = require('fs');
const babel = require('@babel/core');

const source = fs.readFileSync('public/mobile-app.js', 'utf8');

babel.transformAsync(source, {
  presets: [
    ['@babel/preset-react', { runtime: 'classic' }]
  ]
}).then(res => {
  fs.writeFileSync('public/mobile-app.compiled.js', res.code);
  console.log("Recompiled perfectly with React.createElement!");
}).catch(console.error);
