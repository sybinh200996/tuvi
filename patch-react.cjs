const fs = require('fs');

let appJs = fs.readFileSync('public/mobile-app.js', 'utf8');

// Replace markdownLite safely
const originalMarkdownLite = `function markdownLite(text = '') {
    const safe = String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return safe
      .replace(/\\x60\\x60\\x60([\\s\\S]*?)\\x60\\x60\\x60/g, '<pre><code>$1</code></pre>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
      .replace(/^[-•] (.*)$/gm, '<li>$1</li>')
      .replace(/\\n/g, '<br>')
      .replace(/(<li>.*?<\\/li>)(<br>)?/gs, '<ul>$1</ul>')
      .replace(/<\\/ul><br><ul>/g, '');
  }`;

// Rather than regex, just replace the body of the function directly
appJs = appJs.replace(/function markdownLite[\s\S]*?(?=function App\(\))/s, `
function markdownLite(text = '') {
  try {
    if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
      return DOMPurify.sanitize(marked.parse(String(text)));
    }
  } catch(e) {}
  const safe = String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return safe.replace(/\\n/g, '<br/>');
}

`);

// Update Chat UI composer
// The exact string in the file: <div className="composer"><textarea
appJs = appJs.replace(
    `<div className="composer"><textarea`,
    `<div className="composer chat-pill-composer"><textarea`
);

// We won't try to replace the inner button text because of encoding issues, 
// we will just replace the button tag structure entirely.
// Find: <button disabled={busy} onClick={()=>send()}>
// And replace its className
appJs = appJs.replace(
    `<button disabled={busy} onClick={()=>send()}>`,
    `<button className="pill-send-btn" disabled={busy} onClick={()=>send()}>`
);

fs.writeFileSync('public/mobile-app.js', appJs);
console.log('Mobile app js patched successfully.');
