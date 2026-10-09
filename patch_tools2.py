import sys
import re

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace in tryModels
content = re.sub(
    r'tools:\s*\[\{\s*googleSearch:\s*\{\}\s*\}\]',
    r'...(parts.some(p => p.inlineData || p.fileData) ? {} : { tools: [{ googleSearch: {} }] })',
    content
)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Regex patched successfully")
