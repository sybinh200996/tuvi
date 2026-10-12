import re

with open('public/mobile-style.css', 'r', encoding='utf-8') as f:
    style = f.read()

# Find the override and change it
style = re.sub(
    r'\.chat-composer-panel\s*\.composer\.chat-pill-composer\s*\{\s*display:\s*flex\s*!important;\s*flex-direction:\s*column\s*!important;\s*align-items:\s*stretch\s*!important;\s*background:\s*transparent\s*!important;\s*color:\s*#fff\s*!important;\s*font-size:\s*15px\s*!important;\s*\}',
    '.chat-composer-panel .composer.chat-pill-composer { background: rgba(30, 30, 35, 0.7) !important; border-radius: 30px !important; flex-direction: row !important; align-items: center !important; }',
    style
)

with open('public/mobile-style.css', 'w', encoding='utf-8') as f:
    f.write(style)

print("mobile-style.css patched for Gemini pill style.")
