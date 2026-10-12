import re

with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix in callGeminiText
#       config: {
#         temperature: 0.7,
#         topP: 0.85,
#         ...(systemPrompt ? { systemInstruction: systemPrompt } : {})
#       },
#       ...(!FREE_MODELS_ONLY ? { tools: [{ googleSearch: {} }] } : {})
text = re.sub(
    r'config:\s*\{\s*temperature:\s*0\.7,\s*topP:\s*0\.85,\s*\.\.\.\(systemPrompt\s*\?\s*\{\s*systemInstruction:\s*systemPrompt\s*\}\s*:\s*\{\}\)\s*\},(?:\s*//.*?)?\s*\.\.\.\(!FREE_MODELS_ONLY\s*\?\s*\{\s*tools:\s*\[\{\s*googleSearch:\s*\{\}\s*\}\]\s*\}\s*:\s*\{\}\)',
    '''config: {
        temperature: 0.7,
        topP: 0.85,
        ...(systemPrompt ? { systemInstruction: systemPrompt } : {}),
        ...(!FREE_MODELS_ONLY ? { tools: [{ googleSearch: {} }] } : {})
      }''',
    text
)

# Fix in tryModels
#         const response = await withTimeout(ai.models.generateContent({
#           model,
#           contents: [{ role: "user", parts }],
#           ...(systemPrompt ? { config: { systemInstruction: systemPrompt, temperature: 0.7, topP: 0.85 } } : {}),
#           tools: [{ googleSearch: {} }]
#         }));
# Wait, this one uses `config` selectively!
text = re.sub(
    r'\.\.\.\(systemPrompt \? \{ config: \{ systemInstruction: systemPrompt, temperature: 0\.7, topP: 0\.85 \} \} : \{\}\),\s*tools: \[\{ googleSearch: \{\} \}\]',
    '''config: {
            ...(systemPrompt ? { systemInstruction: systemPrompt, temperature: 0.7, topP: 0.85 } : {}),
            tools: [{ googleSearch: {} }]
          }''',
    text
)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Patched server.js for google search tools!")
