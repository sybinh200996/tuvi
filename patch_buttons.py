import re

# 1. Update CSS
css_patch = '''
.chat-icon-btn {
  background: transparent !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
  border-radius: 6px !important;
  font-size: 11px !important;
  padding: 5px 10px !important;
  color: rgba(255, 255, 255, 0.8) !important;
  cursor: pointer;
  white-space: nowrap;
}
.chat-icon-btn:hover { background: rgba(255, 255, 255, 0.1) !important; color: #fff !important; }
'''
with open('public/style.css', 'r', encoding='utf-8') as f:
    style = f.read()
# Replace old .chat-icon-btn
style = re.sub(r'\.chat-icon-btn\s*\{[^}]+\}', '', style)
style += css_patch
with open('public/style.css', 'w', encoding='utf-8') as f:
    f.write(style)


# 2. Update mobile-app.js
with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

# Update header layout to top-left
old_head = r'<div className="chat-head" style=\{\{alignItems:"center", padding:"8px", display:"flex"\}\}>\s*<button className="chat-icon-btn" onClick=\{\(\) => setHistoryOpen\(true\)\}>🕒 Lịch sử</button>\s*<div style=\{\{flex: 1\}\}></div>\s*<div style=\{\{display:"flex", gap:"8px"\}\}>\s*<button className="chat-icon-btn".*?>➕ Mới</button>\s*<button className="chat-icon-btn".*?>🔊 Đọc</button>\s*</div>\s*</div>'
new_head = '''<div className="chat-head" style={{alignItems:"flex-start", padding:"8px", display:"flex", gap:"8px"}}>
        <button className="chat-icon-btn" onClick={() => setHistoryOpen(true)}>🕒 Lịch sử</button>
        <button className="chat-icon-btn" onClick={() => { if(confirm("Tạo đoạn chat mới?")) setMessages(DEFAULT_MESSAGES); }}>➕ Mới</button>
        <button className="chat-icon-btn" onClick={()=>speak(messages.filter(m=>m.role==='assistant').at(-1)?.text || '')}>🔊 Đọc</button>
        <div style={{flex: 1}}></div>
      </div>'''
mob = re.sub(old_head, new_head, mob, flags=re.DOTALL)

# Update History drawer to filter by 'AI Chat'
mob = mob.replace(
    "(readJSON('synam_history',[])).reverse().map((h,i)",
    "(readJSON('synam_history',[])).filter(h => h.type === 'AI Chat').reverse().map((h,i)"
)
mob = mob.replace(
    "readJSON('synam_history',[]).length===0",
    "readJSON('synam_history',[]).filter(h => h.type === 'AI Chat').length===0"
)

# Inject saveHistory into send()
save_code = r"setMessages\(msgs => \[\.\.\.msgs, \{ role: 'assistant', text: data\.text \|\| data\.reply \|\| '' \}\]\);"
mob = re.sub(save_code, "setMessages(msgs => [...msgs, { role: 'assistant', text: data.text || data.reply || '' }]);\n          try { saveHistory('AI Chat', `Hỏi: ${requestText}\\n\\nĐáp: ${data.text || data.reply || ''}`); } catch(e){}", mob)


with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)


# 3. Update index.html (Desktop)
with open('public/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# For index.html, we can use exact string replacement instead of regex to avoid regex escape hell
old_desk_head_search = '<div class="chat-pro-head" style="align-items:center; padding:8px; display:flex;">'
if old_desk_head_search in idx:
    # Just replace the flex div that pushes buttons
    idx = idx.replace('<div style="flex:1"></div>\n                <div class="chat-head-actions" style="display:flex; gap:8px;">', '')
    # And fix the container flex
    idx = idx.replace('<div class="chat-pro-head" style="align-items:center; padding:8px; display:flex;">', '<div class="chat-pro-head" style="align-items:flex-start; padding:8px; display:flex; gap:8px;">')
    # Then append the flex:1 at the end before closing div
    # Wait, the structure was:
    # <div class="chat-pro-head">
    #   <button> Lịch sử
    #   <div flex:1>
    #   <div chat-head-actions>
    #      <button>...
    #   </div>
    # </div>
    pass

# A simpler regex with triple quotes
old_desk_head = r"""<div class="chat-pro-head" style="align-items:center; padding:8px; display:flex;">\s*<button class="chat-icon-btn" onclick="openDesktopHistory\(\)">🕒 Lịch sử</button>\s*<div style="flex:1"></div>\s*<div class="chat-head-actions" style="display:flex; gap:8px;">(.*?)</div>\s*</div>"""
new_desk_head = r"""<div class="chat-pro-head" style="align-items:flex-start; padding:8px; display:flex; gap:8px;">
                <button class="chat-icon-btn" onclick="openDesktopHistory()">🕒 Lịch sử</button>
                \1
                <div style="flex:1"></div>
              </div>"""
idx = re.sub(old_desk_head, new_desk_head, idx, flags=re.DOTALL)

# Update openDesktopHistory to filter
idx = idx.replace(
    "const h = JSON.parse(localStorage.getItem('synam_history')||'[]').reverse();",
    "const h = JSON.parse(localStorage.getItem('synam_history')||'[]').filter(x => x.type === 'AI Chat').reverse();"
)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("Buttons styled and History filtered!")
