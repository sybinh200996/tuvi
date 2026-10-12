import re

with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update tryModels
text = text.replace(
    'async function tryModels(parts, preferredModel = "auto", systemPrompt = \'\') {',
    'async function tryModels(parts, preferredModel = "auto", systemPrompt = \'\', history = []) {'
)
text = re.sub(
    r'contents:\s*\[\{\s*role:\s*"user",\s*parts\s*\}\],',
    '''contents: [
            ...(history || []).map(msg => ({ role: msg.role === "user" ? "user" : "model", parts: [{ text: msg.text || "" }] })),
            { role: "user", parts }
          ],''',
    text,
    count=1 # only in tryModels! wait, I should target tryModels specifically, but doing this globally for generateContent might affect others. Let's do it via string replace on the exact chunk in tryModels.
)
# Re-read from disk to do it safer
with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace tryModels signature
text = text.replace(
    'async function tryModels(parts, preferredModel = "auto", systemPrompt = \'\') {',
    'async function tryModels(parts, preferredModel = "auto", systemPrompt = \'\', history = []) {'
)
# Replace in tryModels body
trymodels_search = '''        const response = await withTimeout(ai.models.generateContent({
          model,
          contents: [{ role: "user", parts }],'''
trymodels_replace = '''        const contents = (history || []).map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text || "" }] }));
        contents.push({ role: "user", parts });
        const response = await withTimeout(ai.models.generateContent({
          model,
          contents,'''
text = text.replace(trymodels_search, trymodels_replace)

# Replace in callGeminiText
text = text.replace(
    "async function callGeminiText({ apiKey, model, parts, systemPrompt = '' }) {",
    "async function callGeminiText({ apiKey, model, parts, systemPrompt = '', history = [] }) {"
)
gemini_search = '''    const response = await withTimeout(client.models.generateContent({
      model,
      contents: [{ role: "user", parts }],'''
gemini_replace = '''    const contents = (history || []).map(msg => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text || "" }] }));
    contents.push({ role: "user", parts });
    const response = await withTimeout(client.models.generateContent({
      model,
      contents,'''
text = text.replace(gemini_search, gemini_replace)

# Replace in callClaude
text = text.replace(
    "async function callClaude({ apiKey, model, prompt, systemPrompt = '' }) {",
    "async function callClaude({ apiKey, model, prompt, systemPrompt = '', history = [] }) {"
)
claude_search = 'messages: [{ role: "user", content: prompt }]'
claude_replace = 'messages: [...(history || []).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text || "" })), { role: "user", content: prompt }]'
text = text.replace(claude_search, claude_replace)

# Replace in callOpenAICompatible
text = text.replace(
    'async function callOpenAICompatible({ provider, apiKey, model, prompt, systemPrompt = "" }) {',
    'async function callOpenAICompatible({ provider, apiKey, model, prompt, systemPrompt = "", history = [] }) {'
)
openai_comp_search = 'input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],'
# wait callOpenAICompatible uses chat/completions!
oac_search = '''      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: prompt }
        ],'''
oac_replace = '''      body: JSON.stringify({
        model,
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          ...(history || []).map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text || "" })),
          { role: "user", content: prompt }
        ],'''
text = text.replace(oac_search, oac_replace)

# Replace in callOpenAIResponses
text = text.replace(
    'async function callOpenAIResponses({ apiKey, model, prompt, systemPrompt = "" }) {',
    'async function callOpenAIResponses({ apiKey, model, prompt, systemPrompt = "", history = [] }) {\n    const histText = (history || []).map(m => (m.role === "user" ? "User: " : "AI: ") + (m.text||"")).join("\\n\\n");\n    const fullPrompt = histText ? `Lịch sử hội thoại:\\n${histText}\\n\\nCâu hỏi mới:\\n${prompt}` : prompt;'
)
text = text.replace(
    'input: [{ role: "user", content: [{ type: "input_text", text: prompt }] }],',
    'input: [{ role: "user", content: [{ type: "input_text", text: fullPrompt }] }],'
)

# Update tryMultiAI signature
text = text.replace(
    'async function tryMultiAI({ prompt, parts, preferredProvider = "auto", requestedModel = "", user = null, council = false, systemPrompt = "" }) {',
    'async function tryMultiAI({ prompt, parts, preferredProvider = "auto", requestedModel = "", user = null, council = false, systemPrompt = "", history = [] }) {'
)
text = text.replace('callOpenAIResponses({ apiKey, model: finalModel, prompt, systemPrompt })', 'callOpenAIResponses({ apiKey, model: finalModel, prompt, systemPrompt, history })')
text = text.replace('callClaude({ apiKey, model: finalModel, prompt, systemPrompt })', 'callClaude({ apiKey, model: finalModel, prompt, systemPrompt, history })')
text = text.replace('callGeminiText({ apiKey, model: finalModel, parts, systemPrompt })', 'callGeminiText({ apiKey, model: finalModel, parts, systemPrompt, history })')
text = text.replace('callOpenAICompatible({ provider, apiKey, model: finalModel, prompt, systemPrompt })', 'callOpenAICompatible({ provider, apiKey, model: finalModel, prompt, systemPrompt, history })')


# Update /api/chat-ai
# Remove historyText from systemPrompt
text = re.sub(r'L\xefCH S\xef CHAT G\xefN \xef\xefA,Y:\s*\$\{historyText \|\| "Ch\xefa cA3"\}', '', text)
text = re.sub(r'L\xefCH S\xef H\xef\xefI THO\xefI G\xefN \xef\xefA,Y:\s*\$\{historyText \|\| "Ch\xefa cA3"\}', '', text)
# Actually, the file uses weird encoding for uppercase accents.
# Let's just remove anything that matches historyText inside the template literals using regex
text = re.sub(r'\$\{historyText \|\| "[^"]*"\}', '', text)
# In `/api/chat-ai`
text = text.replace('const result = await tryModels(parts, geminiModel, systemPrompt);', 'const result = await tryModels(parts, geminiModel, systemPrompt, history);')

# In `/api/multi-ai/chat`
text = text.replace(
    'process.env.DEFAULT_AI_PROVIDER || "auto", requestedModel: model, user, council: Boolean(council), systemPrompt });',
    'process.env.DEFAULT_AI_PROVIDER || "auto", requestedModel: model, user, council: Boolean(council), systemPrompt, history });'
)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Memory (multi-turn) support patched!")
