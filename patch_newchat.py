import re

# 1. Patch mobile-app.js
with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

# Find the chat-head div in mobile-app.js
# Currently: <div className="chat-head"><div><h2>✨ AI Chat Ultra</h2><p>Chat box hiện đại...</p></div><button onClick={()=>speak(messages.filter(m=>m.role==='assistant').at(-1)?.text || '')}>🔊 Đọc</button></div>
# I will replace it with one containing the + button.

old_chat_head_regex = r'<div className="chat-head"><div><h2>.*?</h2><p>.*?</p></div><button onClick=\{.*?}>.*?</button></div>'

def replacer_mob(m):
    original = m.group(0)
    if '➕ Mới' in original: return original
    # Inject before the last button
    return original.replace('</div><button', '</div><div style={{display:"flex", gap:"8px"}}><button onClick={() => { if(confirm("Tạo đoạn chat mới?")) setMessages(DEFAULT_MESSAGES); }}>➕ Mới</button><button') + '</div>'

mob_new = re.sub(old_chat_head_regex, replacer_mob, mob)

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob_new)
print("Patched mobile-app.js")

# 2. Patch index.html
with open('public/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Find chat-head-actions in index.html
# <div class="chat-head-actions"><button type="button" aria-label="Mở cài đặt AI"...

old_desktop_actions = r'<div class="chat-head-actions"><button'
new_desktop_actions = '<div class="chat-head-actions"><button type="button" aria-label="Chat mới" title="Chat mới" onclick="if(confirm(\'Tạo đoạn chat mới?\')){ document.getElementById(\'chatLog\').innerHTML = \'<div class=\\\'msg ai-welcome\\\'><b>🤖 Chào bạn!</b><br>Mình là Đông Nam AI Pro.</div>\'; if(window.chatMessages) window.chatMessages = []; }">➕ Mới</button><button'

if '➕ Mới' not in idx:
    idx = idx.replace(old_desktop_actions, new_desktop_actions)
    with open('public/index.html', 'w', encoding='utf-8') as f:
        f.write(idx)
    print("Patched index.html")
