import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# We need to add exactly one </div> before </section>;
text = re.sub(r'(?<!</div>\s*)</section>;', '</div>\n    </section>;', text, count=1)

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed closing tags!")
