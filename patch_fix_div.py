import re

with open('public/mobile-app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# I need to add one </div> before </section>; inside the Chat component.
# The error happens right at the end of the Chat component.
# Let's find </section>;\n  }\n  \n  function Settings
text = text.replace(
    '</section>;\n  }\n  \n  function Settings',
    '      </div>\n    </section>;\n  }\n  \n  function Settings'
)

with open('public/mobile-app.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Fixed missing </div>")
