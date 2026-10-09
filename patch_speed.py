import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

# 1. FIX VOICE AUTO-SEND STALE CLOSURE
# Add a ref for send: const sendRef = useRef(null); sendRef.current = send;
if 'const sendRef = useRef(' not in mob:
    mob = mob.replace(
        "const countdownTimerRef = useRef(null);",
        "const countdownTimerRef = useRef(null);\n    const sendRef = useRef(null);"
    )
if 'async function send(customText)' in mob:
    mob = mob.replace(
        "async function send(customText) {",
        "sendRef.current = send;\n    async function send(customText) {"
    )
    # Replace `send(spoken)` with `sendRef.current(spoken)` inside the interval
    mob = mob.replace("if (spoken) send(spoken);", "if (spoken) sendRef.current(spoken);")

# 2. SPEED UP TOOLS
# TuviTool
mob = mob.replace(
    "/api/mystic-ai',{name,birthDate:dob,birthTime:time,gender, localReport:",
    "/api/mystic-ai',{name,birthDate:dob,birthTime:time,gender, geminiModel: 'gemini-2.5-flash-lite', localReport:"
)
# LoveTool
mob = mob.replace(
    "apiJSON('/api/love-ai',{ persons:",
    "apiJSON('/api/love-ai',{ geminiModel: 'gemini-2.5-flash-lite', persons:"
)
# VisionTool
mob = mob.replace(
    "const payload = mode === 'palm'",
    "const payload = mode === 'palm'"
)
# Let's find VisionTool payload and add geminiModel
mob = mob.replace(
    "? { mode, image, palmImage: image, palmLine: 'Tổng quan đường tay', palmNote: note }",
    "? { mode, image, palmImage: image, palmLine: 'Tổng quan đường tay', palmNote: note, geminiModel: 'gemini-2.5-flash-lite' }"
)
mob = mob.replace(
    ": { mode, image, faceImage: image, facePart: 'Tổng quan ngũ quan', faceNote: note };",
    ": { mode, image, faceImage: image, facePart: 'Tổng quan ngũ quan', faceNote: note, geminiModel: 'gemini-2.5-flash-lite' };"
)

# Chat Auto
mob = mob.replace(
    "data = await apiJSON('/api/chat-ai', {",
    "data = await apiJSON('/api/chat-ai', {\n            geminiModel: 'gemini-2.5-flash-lite',"
)

# SimpleTool (uses multi-ai/chat)
mob = mob.replace(
    "apiJSON('/api/multi-ai/chat',{message:`${preset||title} ${q}`, provider:'auto'});",
    "apiJSON('/api/multi-ai/chat',{message:`${preset||title} ${q}`, provider:'auto', model:'gemini-2.5-flash-lite'});"
)
# AstrologyTool (uses multi-ai/chat)
mob = mob.replace(
    "apiJSON('/api/multi-ai/chat',{provider:'auto',message:`Luận chiêm tinh",
    "apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-2.5-flash-lite',message:`Luận chiêm tinh"
)
# TarotTool
mob = mob.replace(
    "apiJSON('/api/multi-ai/chat',{provider:'auto',message:`Xem bài tarot",
    "apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-2.5-flash-lite',message:`Xem bài tarot"
)
# NumerologyTool
mob = mob.replace(
    "apiJSON('/api/multi-ai/chat',{provider:'auto',message:`Thần số học cho",
    "apiJSON('/api/multi-ai/chat',{provider:'auto',model:'gemini-2.5-flash-lite',message:`Thần số học cho"
)
# DeepAnalyze (uses /api/deep-ai)
# Does deep-ai support geminiModel? Let's check server.js if it uses tryModels. Usually yes.
mob = mob.replace(
    "apiJSON('/api/deep-ai', form);",
    "apiJSON('/api/deep-ai', { ...form, geminiModel: 'gemini-2.5-flash-lite' });"
)


with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)
print("mobile-app.js patched for speed and voice auto-send!")
