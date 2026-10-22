from PIL import Image, ImageFilter
import os
import sys

src_path = r'C:/Users/sir/.gemini/antigravity/brain/5c21aa91-a0ee-4ac0-a583-171ec860047c/.user_uploaded/media_1792665668391_e521589d.png'

img = Image.open(src_path).convert('RGBA')
width, height = img.size
print(f"Original size: {width}x{height}, mode: {img.mode}")

# Inspect corner pixels
corners = [img.getpixel((0,0)), img.getpixel((width-1, 0)), img.getpixel((0, height-1)), img.getpixel((width-1, height-1))]
print("Corner colors:", corners)
