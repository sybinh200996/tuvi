const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const presetReact = require('@babel/preset-react');

const inputPath = path.join(__dirname, 'public', 'mobile-app.js');
const outputPath = path.join(__dirname, 'public', 'mobile-app.compiled.js');
const source = fs.readFileSync(inputPath, 'utf8');

babel.transformAsync(source, {
  presets: [
    [presetReact, { runtime: 'classic' }]
  ]
}).then(res => {
  fs.writeFileSync(outputPath, res.code);
  console.log("Recompiled perfectly with React.createElement!");
}).catch(console.error);
