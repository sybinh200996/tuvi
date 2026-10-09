import re

with open('public/mobile-style.css', 'r', encoding='utf-8') as f:
    style = f.read()

# 1. Remove justify-content: center from .chat-head
style = style.replace('justify-content: center !important;', '')

# 2. Add .chat-icon-btn
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
# Remove existing .chat-icon-btn just in case
style = re.sub(r'\.chat-icon-btn\s*\{[^}]+\}', '', style)
style += css_patch

with open('public/mobile-style.css', 'w', encoding='utf-8') as f:
    f.write(style)

# Also let's double check if style.css in desktop had it, yes we did that earlier.

print("Patched mobile-style.css")
