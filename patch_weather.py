import re

with open('server.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Enhance isWeatherQuestion regex
old_regex = r'/\(th\?i tit\|thoi tiet\|d\? bAo th\?i tit\|du bao thoi tiet\|nhit `T ngoAi tr\?i\|nhiet do ngoai troi\)/i'
# Wait, let's just do a string replace on the return line of isWeatherQuestion
# It's better to find it directly
def replacer(match):
    return 'return /(thời tiết|thoi tiet|dự báo thời tiết|du bao thoi tiet|nhiệt độ|nhiet do|trời có mưa|trời có nắng|mưa không|nắng không|có bão|co bao)/i.test(q);'

text = re.sub(r'return \/\(th\w*\?i ti\w*t\|.*?\)\/i\.test\(q\);', replacer, text)

# Just to be sure, let's also directly replace if the regex didn't work (due to encoding)
if 'return /(th' in text and 'test(q)' in text:
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if 'test(q)' in line and 'thoi tiet' in line:
            lines[i] = '    return /(thời tiết|thoi tiet|dự báo|du bao|nhiệt độ|nhiet do|trời có mưa|trời có nắng|mưa không|nắng không|có bão|co bao)/i.test(q);'
    text = '\n'.join(lines)

with open('server.js', 'w', encoding='utf-8') as f:
    f.write(text)
print("Patched isWeatherQuestion in server.js")
