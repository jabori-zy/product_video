"""Screen-ON version of a v2 (full-mirror) render: the real app screenshot lights up only the 680x1209
display area; the rest of the front stays the render's own mirror.

usage: python screen_on_v2.py <render.png> <window.json> <screen.png> <out.png>
- the screenshot is corner-pinned onto the display quad (window_v2.py), slightly feathered (0.8 px)
- a few % of the render's glass reflection stays on top of the lit area (the screen sits behind the glass)
"""
import json, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

REFLECT = 0.07          # share of the mirror reflection kept over the lit screen
GROW = 2                # px the paste reaches past the quad, to cover a dark seam the model may draw at the screen edge


def coeffs(dst, src):
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; b += [u, v]
    return np.linalg.lstsq(np.array(A, float), np.array(b, float), rcond=None)[0].tolist()


def main():
    render, wj, screen, out = sys.argv[1:5]
    img = Image.open(render).convert("RGB")
    quad = [tuple(p) for p in json.load(open(wj))["window"]]
    scr = Image.open(screen).convert("RGB")
    w, h = scr.size
    # pad the screenshot with its own edge pixels, so resampling at the quad border never pulls in black
    # (that drew a dashed dark seam along the bottom edge)
    pad = 16
    padded = Image.fromarray(np.pad(np.asarray(scr), ((pad, pad), (pad, pad), (0, 0)), mode="edge"))
    src = [(pad, pad), (w + pad, pad), (w + pad, h + pad), (pad, h + pad)]
    warped = padded.transform(img.size, Image.PERSPECTIVE, coeffs(quad, src), Image.BICUBIC)
    ss = 4                                                     # supersampled, lightly feathered mask
    m = Image.new("L", (img.width * ss, img.height * ss), 0)
    ImageDraw.Draw(m).polygon([(x * ss, y * ss) for x, y in quad], fill=255)
    m = m.resize(img.size, Image.LANCZOS).filter(ImageFilter.MaxFilter(GROW * 2 + 1)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.asarray(img).astype(float); s = np.asarray(warped).astype(float)
    lit = s * (1 - REFLECT) + a * REFLECT
    k = np.asarray(m).astype(float)[..., None] / 255
    res = a * (1 - k) + lit * k
    Image.fromarray(np.clip(res, 0, 255).round().astype(np.uint8)).save(out)
    print(out)


if __name__ == "__main__":
    main()
