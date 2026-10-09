import re

with open('public/mobile-style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Remove left/right padding from .app-shell
css = re.sub(r'\.app-shell \{ width: 100% !important; max-width: 100% !important; min-width: 0 !important; padding-left: \d+px \!important; padding-right: \d+px \!important; \}',
             r'.app-shell { width: 100% !important; max-width: 100% !important; min-width: 0 !important; padding-left: 0px !important; padding-right: 0px !important; overflow-x: hidden; }', css)

css = re.sub(r'padding-left: 7px !important; padding-right: 7px !important;', 'padding-left: 0px !important; padding-right: 0px !important;', css)
css = re.sub(r'padding-left: 4px !important; padding-right: 4px !important;', 'padding-left: 0px !important; padding-right: 0px !important;', css)


# 2. Make bottom-nav edge to edge
css = re.sub(r'\.bottom-nav \{\s*position: fixed !important;\s*z-index: 200 !important;\s*left: 10px !important;\s*right: 10px !important;',
             r'.bottom-nav { position: fixed !important; z-index: 200 !important; left: 0px !important; right: 0px !important; border-radius: 24px 24px 0 0 !important; border-left: none !important; border-right: none !important; border-bottom: none !important;', css)

css = re.sub(r'left: 10px !important; right: 10px !important;', 'left: 0px !important; right: 0px !important;', css)
css = re.sub(r'left: 7px !important; right: 7px !important;', 'left: 0px !important; right: 0px !important;', css)
css = re.sub(r'left: 4px !important; right: 4px !important;', 'left: 0px !important; right: 0px !important;', css)

# Make hero full width if possible
css = re.sub(r'\.hero \{ grid-template-columns', r'.hero { border-radius: 0 !important; border-left: none !important; border-right: none !important; grid-template-columns', css)

# We should add padding to home-grid and workspace so content doesn't touch the edge
css = css + "\n/* Add edge padding for internal elements now that app-shell has 0 padding */\n"
css = css + "@media(max-width:768px) { .home-grid, .workspace { padding-left: 10px !important; padding-right: 10px !important; } .feature-card { border-radius: 16px !important; } }\n"

with open('public/mobile-style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("CSS updated")
