with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    mob = f.read()

mob = mob.replace("\\'history\\'", "'history'")
mob = mob.replace("\\'settings\\'", "'settings'")
mob = mob.replace("\\'Không có kết quả\\'", "'Không có kết quả'")
mob = mob.replace("\\'Tình duyên\\'", "'Tình duyên'")
mob = mob.replace("\\'Tử vi / Thần số\\'", "'Tử vi / Thần số'")
mob = mob.replace("\\'⚠️ Lỗi: \\'", "'⚠️ Lỗi: '")
mob = mob.replace("\\'Tử vi local\\'", "'Tử vi local'")
mob = mob.replace("\\'⚠️ \\'", "'⚠️ '")
mob = mob.replace("\\'Không có kết quả.\\'", "'Không có kết quả.'")

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(mob)
print('Fixed quotes')
