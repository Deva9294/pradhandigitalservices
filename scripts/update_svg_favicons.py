import base64
import os

png_path = r'C:/Users/sir/pradhandigitalservices/frontend/public/icon-512.png'
with open(png_path, 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <image href="data:image/png;base64,{b64}" x="0" y="0" width="512" height="512" preserveAspectRatio="xMidYMid meet"/>
</svg>'''

for name in ['favicon.svg', 'brand-icon.svg']:
    out_file = os.path.join(r'C:/Users/sir/pradhandigitalservices/frontend/public', name)
    with open(out_file, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print('Updated SVG:', out_file)

print('SVG favicons updated successfully!')
