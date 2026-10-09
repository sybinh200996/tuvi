import sys

with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = """          config: {
              ...(systemPrompt ? { systemInstruction: systemPrompt, temperature: 0.7, topP: 0.85 } : {}),
              tools: [{ googleSearch: {} }]
            }"""

replacement = """          config: {
              ...(systemPrompt ? { systemInstruction: systemPrompt, temperature: 0.7, topP: 0.85 } : {}),
              ...(parts.some(p => p.inlineData || p.fileData) ? {} : { tools: [{ googleSearch: {} }] })
            }"""

if target in content:
    content = content.replace(target, replacement)
    with open('server.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Patched successfully")
else:
    print("Target not found")
