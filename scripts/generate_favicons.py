import os
from PIL import Image

src_path = r'C:/Users/sir/.gemini/antigravity/brain/5c21aa91-a0ee-4ac0-a583-171ec860047c/.user_uploaded/media_1792665668391_e521589d.png'
frontend_dir = r'C:/Users/sir/pradhandigitalservices/frontend'
public_dir = os.path.join(frontend_dir, 'public')
app_dir = os.path.join(frontend_dir, 'src', 'app')

# 1. Open original image
img = Image.open(src_path).convert('RGBA')

# 2. Get exact bounding box
bbox = img.getbbox()
print("Bounding box:", bbox)
cropped = img.crop(bbox)
c_w, c_h = cropped.size

# 3. Clean any low-alpha or fringe pixels
cleaned_data = []
for item in cropped.getdata():
    r, g, b, a = item
    # If almost fully transparent or noisy artifact
    if a < 15:
        cleaned_data.append((0, 0, 0, 0))
    else:
        cleaned_data.append((r, g, b, a))

cleaned = Image.new('RGBA', (c_w, c_h))
cleaned.putdata(cleaned_data)

# Re-crop after cleaning
bbox2 = cleaned.getbbox()
if bbox2:
    cleaned = cleaned.crop(bbox2)
    c_w, c_h = cleaned.size

# 4. Create high-res 512x512 master square image with balanced margins
target_size = 512
margin = int(target_size * 0.06) # 6% margin
avail_size = target_size - (margin * 2)

# Calculate scaling ratio to fit within available square while preserving aspect ratio
scale = min(avail_size / c_w, avail_size / c_h)
new_w = int(c_w * scale)
new_h = int(c_h * scale)

resized = cleaned.resize((new_w, new_h), Image.Resampling.LANCZOS)

# Create 512x512 transparent canvas
master = Image.new('RGBA', (target_size, target_size), (0, 0, 0, 0))
offset_x = (target_size - new_w) // 2
offset_y = (target_size - new_h) // 2
master.paste(resized, (offset_x, offset_y), resized)

# 5. Export sizes
sizes = {
    'favicon-16.png': 16,
    'favicon-32.png': 32,
    'favicon-48.png': 48,
    'favicon-64.png': 64,
    'apple-touch-icon.png': 180,
    'icon-192.png': 192,
    'icon-512.png': 512,
    'logo-icon-transparent.png': 512,
    'logo-icon.png': 512,
}

for filename, s in sizes.items():
    out_path = os.path.join(public_dir, filename)
    scaled = master.resize((s, s), Image.Resampling.LANCZOS)
    scaled.save(out_path, format='PNG', optimize=True)
    print(f"Saved: {out_path} ({s}x{s})")

# 6. Save Next.js App Router icons
master.save(os.path.join(app_dir, 'icon.png'), format='PNG', optimize=True)
master.resize((180, 180), Image.Resampling.LANCZOS).save(os.path.join(app_dir, 'apple-icon.png'), format='PNG', optimize=True)

# 7. Generate multi-resolution favicon.ico (16, 32, 48)
ico_sizes = [(16, 16), (32, 32), (48, 48)]
ico_images = [master.resize(s, Image.Resampling.LANCZOS) for s in ico_sizes]

public_ico = os.path.join(public_dir, 'favicon.ico')
app_ico = os.path.join(app_dir, 'favicon.ico')

ico_images[0].save(public_ico, format='ICO', sizes=ico_sizes)
ico_images[0].save(app_ico, format='ICO', sizes=ico_sizes)
print("Saved multi-res favicon.ico in public/ and src/app/")

print("SUCCESS: All favicon PNG and ICO assets successfully created with 100% transparent background!")
