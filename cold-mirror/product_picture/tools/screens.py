"""Prepare the app screenshots shown on screen-on shots -> refs/screen_<name>.png (2160x3840).
The 换发色成功 capture has a mouse cursor, a 小红书 badge and a debug wrench icon; they are painted out."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

SRC = Path(__file__).resolve().parents[2] / "assets" / "screenshot"
OUT = Path(__file__).resolve().parent.parent / "refs"


def fill(im, box, ref_xy):
    ImageDraw.Draw(im).rectangle(box, fill=im.getpixel(ref_xy))


def main():
    OUT.mkdir(exist_ok=True)
    Image.open(SRC / "home 页.png").convert("RGB").save(OUT / "screen_home.png")
    Image.open(SRC / "发色库_2026-10-13_23-13-13.png").convert("RGB").save(OUT / "screen_library.png")
    im = Image.open(SRC / "换发色成功_2026-10-13_23-15-49.png").convert("RGB")
    fill(im, (105, 2545, 160, 2605), (80, 2575))                  # mouse cursor on the grey margin
    fill(im, (1895, 3365, 1985, 3455), (1880, 3460))              # wrench debug icon
    # 小红书 badge sits on the photo's bottom edge (last photo row 3314): mirror the rows above it
    # downwards so the fill is continuous at the seam, and stop at the photo edge
    a = np.asarray(im).astype(float)
    y0, y1, x0, x1 = 3268, 3316, 1800, 1958
    patch = a[y0 - 1:y0 - 1 - (y1 - y0):-1, x0:x1]
    w = np.clip((np.arange(x1 - x0) - 4) / 18, 0, 1)[None, :, None]   # feather into the hair on the left
    a[y0:y1, x0:x1] = a[y0:y1, x0:x1] * (1 - w) + patch * w
    a = a.round().clip(0, 255).astype(np.uint8)
    Image.fromarray(a).save(OUT / "screen_color.png")
    print("ok")


if __name__ == "__main__":
    main()
