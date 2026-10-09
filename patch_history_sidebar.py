import re

# 1. MOBILE APP PATCH
with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

# Fix Chat component signature to include historyOpen state
if 'const [historyOpen, setHistoryOpen] = useState(false);' not in mob:
    mob = mob.replace(
        "const [text, setText] = useState('');",
        "const [historyOpen, setHistoryOpen] = useState(false);\n    const [text, setText] = useState('');"
    )

# Replace the chat header
# Note: Replaces the exact old header that has <h2>✨ AI Chat Ultra</h2>
old_head_re = r'<div className="chat-head">.*?</div></div>'
new_head = '''<div className="chat-head" style={{alignItems:"center", padding:"8px", display:"flex"}}>
        <button className="chat-icon-btn" onClick={() => setHistoryOpen(true)}>🕒 Lịch sử</button>
        <div style={{flex: 1}}></div>
        <div style={{display:"flex", gap:"8px"}}>
          <button className="chat-icon-btn" onClick={() => { if(confirm("Tạo đoạn chat mới?")) setMessages(DEFAULT_MESSAGES); }}>➕ Mới</button>
          <button className="chat-icon-btn" onClick={()=>speak(messages.filter(m=>m.role==='assistant').at(-1)?.text || '')}>🔊 Đọc</button>
        </div>
      </div>'''

mob = re.sub(old_head_re, new_head, mob)

# Add the drawer to the output (inside <section className="chat-layout">)
# Find the start of the return statement
drawer_jsx = '''
      {historyOpen && <div className="history-drawer-overlay" onClick={() => setHistoryOpen(false)}>
        <div className="history-drawer" onClick={e=>e.stopPropagation()}>
          <div className="drawer-head"><h3>🕒 Lịch sử</h3><button onClick={()=>setHistoryOpen(false)}>✕</button></div>
          <div className="drawer-body">
            {(readJSON('synam_history',[])).reverse().map((h,i) => (
              <div key={i} className="drawer-item" onClick={()=>{ setText(h.content.substring(0, 200)); setHistoryOpen(false); }}>
                <strong>{h.type}</strong><br/><small>{new Date(h.at).toLocaleString()}</small>
              </div>
            ))}
            {readJSON('synam_history',[]).length===0 && <p style={{opacity:0.5, textAlign:'center'}}>Chưa có</p>}
          </div>
        </div>
      </div>}
'''

if 'history-drawer-overlay' not in mob:
    mob = mob.replace(
        '<section className="chat-layout">',
        '<section className="chat-layout">' + drawer_jsx
    )

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)


# 2. DESKTOP APP PATCH
with open('public/index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Replace Desktop header
old_desktop_head_re = r'<div class="chat-pro-head">.*?</div>\s*</div>'
new_desktop_head = '''<div class="chat-pro-head" style="align-items:center; padding:8px; display:flex;">
                <button class="chat-icon-btn" onclick="openDesktopHistory()">🕒 Lịch sử</button>
                <div style="flex:1"></div>
                <div class="chat-head-actions" style="display:flex; gap:8px;">
                  <button type="button" class="chat-icon-btn" aria-label="Chat mới" onclick="if(confirm('Tạo đoạn chat mới?')){ document.getElementById('chatLog').innerHTML = '<div class=\\'msg ai-welcome\\'><b>🤖 Chào bạn!</b><br>Mình là Đông Nam AI Pro.</div>'; if(window.chatMessages) window.chatMessages = []; }">➕ Mới</button>
                  <button type="button" class="chat-icon-btn" aria-label="Đọc" onclick="speakLastResult()">🔊 Đọc</button>
                  <button type="button" class="chat-icon-btn" aria-label="Cài đặt AI" onclick="routeTo('ai')">⚙️ Cài đặt</button>
                </div>
              </div>'''

# Careful, the regex might overmatch. Let's do exact replace if possible.
# Actually, I'll search for <div class="chat-pro-head"> and replace up to its closing </div>
# In index.html: 
# <div class="chat-pro-head">
#   <div><h2>✨ AI Chat Pro</h2>...</div>
#   <div class="chat-head-actions">...</div>
# </div>
# The regex r'<div class="chat-pro-head">.*?</div>\s*</div>' works if re.DOTALL is used.

idx = re.sub(r'<div class="chat-pro-head">.*?</div>\s*</div>', new_desktop_head, idx, flags=re.DOTALL)

# Inject Desktop drawer and script
if 'desktopHistoryDrawer' not in idx:
    drawer_html = '''
    <div id="desktopHistoryDrawer" class="history-drawer-overlay" style="display:none;" onclick="this.style.display='none'">
      <div class="history-drawer" onclick="event.stopPropagation()">
        <div class="drawer-head"><h3>🕒 Lịch sử Chat</h3><button onclick="document.getElementById('desktopHistoryDrawer').style.display='none'">✕</button></div>
        <div class="drawer-body" id="desktopHistoryContent"></div>
      </div>
    </div>
    <script>
    function openDesktopHistory() {
      try {
        const h = JSON.parse(localStorage.getItem('synam_history')||'[]').reverse();
        const html = h.map(x => '<div class="drawer-item" onclick="document.getElementById(\\'chatText\\').value=\\'' + (x.content||'').replace(/\\'/g,\\"\\\\'\\").replace(/\\n/g,\\" \\").substring(0,200) + '\\'; document.getElementById(\\'desktopHistoryDrawer\\').style.display=\\'none\\';"><strong>'+x.type+'</strong><br><small>'+new Date(x.at).toLocaleString()+'</small></div>').join('');
        document.getElementById('desktopHistoryContent').innerHTML = html || '<p style="text-align:center; opacity:0.5;">Chưa có lịch sử</p>';
        document.getElementById('desktopHistoryDrawer').style.display = 'flex';
      } catch(e) { console.error(e); }
    }
    </script>
    '''
    # inject before </body>
    idx = idx.replace('</body>', drawer_html + '\n</body>')

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("Patch applied to JS and HTML.")
