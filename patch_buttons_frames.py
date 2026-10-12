import re

with open('public/mobile-style.css', 'r', encoding='utf-8') as f:
    style = f.read()

# 1. Update .chat-icon-btn
btn_styles = '''
.chat-icon-btn {
  background: transparent !important;
  border: none !important;
  font-size: 14px !important;
  color: #c084fc !important; /* purple */
  padding: 0 6px !important;
  margin-top: -10px !important;
  cursor: pointer;
  white-space: nowrap;
  font-weight: bold !important;
}
.chat-icon-btn:hover { color: #d8b4fe !important; }
'''
# Replace existing if exists
style = re.sub(r'\.chat-icon-btn\s*\{[^}]+\}', '', style)
style = re.sub(r'\.chat-icon-btn:hover\s*\{[^}]+\}', '', style)
style += btn_styles

# 2. Remove frames for Tu vi, Tinh duyen, AI Chat
# Since they specifically said "bỏ 2 cái khung ở tab Tử Vi, Tinh Duyên, AI Chat."
# The AI Chat has `.chat-main.premium-panel`, Tu vi has `.premium-panel`, Tinh duyen has `.premium-panel`.
# Let's remove the border and background of premium-panel entirely for mobile layout.
remove_frame_css = '''
/* Bỏ khung ở các tab theo yêu cầu */
.tool-grid .premium-panel,
.chat-main.premium-panel {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
}
'''
style += remove_frame_css

with open('public/mobile-style.css', 'w', encoding='utf-8') as f:
    f.write(style)

print("Updated buttons and removed frames")
