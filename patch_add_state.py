import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Add showUploads to Chat component
if 'const [showUploads, setShowUploads]' not in text:
    text = text.replace(
        "const [historyOpen, setHistoryOpen] = useState(false);",
        "const [historyOpen, setHistoryOpen] = useState(false);\n    const [showUploads, setShowUploads] = useState(false);"
    )

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Added showUploads")
