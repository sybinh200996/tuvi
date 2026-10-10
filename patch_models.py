with open('server.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Fix deprecated models
replacements = [
    ('gemini-2.0-flash-lite', 'gemini-3.5-flash-lite'),
    ('gemini-2.0-flash', 'gemini-3.8-flash'),
]

for old, new in replacements:
    count = content.count(old)
    content = content.replace(old, new)
    print(f"Replaced '{old}' with '{new}': {count} occurrences")

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Done!")
