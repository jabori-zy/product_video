"""Finish an aligned render: put the real app screenshot on screen-on shots, check the aspect ratio,
export final/png/<name>.png and final/jpg/<name>.jpg (progressive, sRGB, quality 90).

usage: python finish.py <shot> <aligned.png>
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guide import SHOTS, SIZE, warp_into  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
WORK, FINAL, REFS = ROOT / "work", ROOT / "final", ROOT / "refs"

NAMES = {
    "01": "01_hero_front-3q_mirror", "01b": "01b_hero_black_mirror", "02": "02_front_mirror",
    "03": "03_front_screen-home", "04": "04_front-3q-left_screen-color", "05": "05_side",
    "06": "06_rear-3q", "07": "07_detail_camera", "08": "08_lifestyle_salon_screen-library",
    "09": "09_salon_scene_screen-color",
}


def paste_plate(img, plate, g2f):
    """Warp the accepted plate (guide frame) and the guide's product silhouette into the delivered frame and
    composite the plate's product pixels over the scene."""
    from PIL import ImageFilter
    from scipy import ndimage
    tag = json.load(open(WORK / f"{plate}_report.json"))["tag"]
    src = Image.open(WORK / f"{plate}_{tag}_aligned.png").convert("RGB")
    g = np.asarray(Image.open(WORK / f"guide_{plate}.png").convert("RGB")).astype(int)
    sil = np.abs(g - np.array([245, 245, 247])).sum(-1) > 8                  # everything that is product
    # paste the interior only: shrink by 2 px so no studio-background or edge pixels from the plate come along
    # (they showed as a light halo); the outline stays the scene's own, which agrees with the guide within ~3 px
    sil = ndimage.binary_erosion(sil, iterations=2)
    # where the plate's product came out a few px smaller than the guide (e.g. a thinner base), the guide-shaped
    # mask would still catch plate background: drop every background-coloured plate pixel, except in the window
    pa = np.asarray(src).astype(int)
    pbg = np.median(np.concatenate([pa[:20].reshape(-1, 3), pa[:, :20].reshape(-1, 3)]), 0)
    bgish = np.abs(pa - pbg).sum(-1) < 90                    # includes half-blended edge pixels
    P = json.load(open(WORK / f"guide_{plate}.json"))["points"]
    win = Image.new("1", src.size, 0)
    ImageDraw.Draw(win).polygon([tuple(P[k]) for k in ("window_TL", "window_TR", "window_BR", "window_BL")], fill=1)
    bgish &= ~np.asarray(win)
    sil &= ~ndimage.binary_dilation(bgish, iterations=3)
    mask = Image.fromarray((sil * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0))
    inv = np.linalg.inv(g2f); co = (inv / inv[2, 2]).ravel()[:8].tolist()   # PIL maps output -> input
    plate_f = src.transform(img.size, Image.PERSPECTIVE, co, Image.BICUBIC)
    mask_f = mask.transform(img.size, Image.PERSPECTIVE, co, Image.BILINEAR)
    return Image.composite(plate_f, img, mask_f)


def main():
    shot, src = sys.argv[1], Path(sys.argv[2])
    cfg = SHOTS[shot]
    quad = None
    if cfg.get("scene"):         # scenes are finished from their own framing (align.py framed_scene)
        src = src.with_name(src.name.replace("_aligned", "_framed"))
        quad = np.array(json.load(open(WORK / f"{shot}_report.json"))["window_quad_final"])
    img = Image.open(src).convert("RGB")
    W, H = SIZE[cfg["aspect"]]
    if img.size != (W, H):
        raise SystemExit(f"{src} is {img.size}, expected {(W, H)} for {cfg['aspect']}")
    if cfg.get("plate"):          # paste the verified product from the studio plate over the scene's product
        img = paste_plate(img, cfg["plate"], np.array(json.load(open(WORK / f"{shot}_report.json"))["guide_to_final"]))
    if cfg.get("screen"):         # last, so the real screenshot is what shows on screen
        if quad is None:
            P = json.load(open(WORK / f"guide_{shot}.json"))["points"]
            quad = np.array([P["window_TL"], P["window_TR"], P["window_BR"], P["window_BL"]])
        shot_img = Image.open(REFS / f"screen_{cfg['screen']}.png").convert("RGB")
        img = warp_into(img, shot_img, quad, alpha=0.96)    # 4% of the render's glass reflection stays on top
    a, b = map(int, cfg["aspect"].split(":"))
    assert img.width * b == img.height * a, (img.size, cfg["aspect"])
    for d in ("png", "jpg"):
        (FINAL / d).mkdir(parents=True, exist_ok=True)
    name = NAMES[shot]
    img.save(FINAL / "png" / f"{name}.png", optimize=True)
    img.save(FINAL / "jpg" / f"{name}.jpg", quality=90, progressive=True, optimize=True, subsampling=0)
    print(FINAL / "png" / f"{name}.png", img.size, cfg["aspect"])


if __name__ == "__main__":
    main()
