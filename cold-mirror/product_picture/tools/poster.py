"""Apple-style Cold Mirror poster, assembled exactly (copy: ../poster/Function slogan.md, plan: ../poster/prompt.md).

Layout positions were measured on the GPT Image 2.5 layout pass (poster/work/try1.png, scaled to 2400x3200); that pass
had the right composition and text, but soft halos around the type and a faint texture in the background. Here:
- background: flat #F8F8F8
- product: the approved render final/close/png/02_front_mirror.png itself, normalised from its grey studio onto
  #F8F8F8 by dividing out a smooth fit of its background (its own soft shadow stays, now on white)
- type: SF Pro (SFNS.ttf) for Latin and digits, Hiragino Sans GB for Chinese (PingFang SC is not installed here)
- logo: the real lychee icon; feature icons drawn as vector line icons
usage: python poster.py [product.png] [name]   (defaults: the 02 front view, cold-mirror_poster)
       -> poster/final/<name>.{png,jpg}; a wide product (e.g. the M04 trio) is fitted to MAX_W and centred
       vertically in the product area
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "poster" / "final"
W, H = 2400, 3200
BG = np.array([248, 248, 248], float)
INK, GREY, RULE = (29, 29, 31), (110, 110, 115), (210, 210, 215)
SF = "/System/Library/Fonts/SFNS.ttf"
HIRA = "/System/Library/Fonts/Hiragino Sans GB.ttc"
SS = 4                                                          # supersampling for type and icons

# measured layout (px in the 2400x3200 poster)
ICON_TOP, ICON_H = 163, 181
NAME_TOP, NAME_CAP = 431, 124            # "Cold Mirror": top of C to baseline
SLOGAN_TOP, SLOGAN_PX = 625, 88          # font px; Hiragino ink is ~0.88 em, so ~78 px tall as measured
PROD_TOP, PROD_H = 823, 1634             # product area (panel top to base bottom)
MAX_W = 2000                             # widest a product group may be
COLS = (540, 1200, 1860)
RULES_X, RULES_Y = (870, 1530), (2666, 2975)
FICON_CY, FICON_H = 2698, 159
TITLE_TOP, TITLE_PX = 2829, 52
SUB_TOPS, SUB_PX = (2918, 2986), 47

FEATURES = [("lens", "4K 高清摄像头", ["发丝毕现，清晰呈现"]),
            ("mirror", "高级镜面", ["质感高级，通透清晰"]),
            ("chip", "自研模型", ["真人还原，无 AI 感", "40 秒真实换发"])]


def sf(size, weight):
    f = ImageFont.truetype(SF, size)
    f.set_variation_by_axes([100, min(96, max(17, size / SS / 2)), 400, weight])
    return f


def hira(size, bold):
    return ImageFont.truetype(HIRA, size, index=2 if bold else 0)


def runs(text):
    """Split into (is_latin, chunk): Latin letters and digits use SF, everything else Hiragino."""
    out = []
    for ch in text:
        lat = ch.isascii() and ch != " "
        if ch == " " and out:
            lat = out[-1][0]
        if out and out[-1][0] == lat:
            out[-1][1] += ch
        else:
            out.append([lat, ch])
    return out


def text_layer(text, cjk_px, weight_sf, bold_cjk, color):
    """Render mixed text on a transparent supersampled layer; returns (RGBA image, ink bbox)."""
    f_c = hira(cjk_px * SS, bold_cjk)
    f_l = sf(int(cjk_px * SS * 0.98), weight_sf)
    widths = [(f_l if lat else f_c).getlength(t) for lat, t in runs(text)]
    img = Image.new("L", (int(sum(widths)) + 40 * SS, int(cjk_px * SS * 1.6)), 0)
    d = ImageDraw.Draw(img)
    x, base = 20 * SS, int(cjk_px * SS * 1.2)
    for (lat, t), w in zip(runs(text), widths):
        d.text((x, base), t, font=f_l if lat else f_c, fill=255, anchor="ls")
        x += w
    bb = img.getbbox()
    lay = Image.new("RGBA", img.size, color + (0,)); lay.putalpha(img)
    return lay.crop(bb)


def place_text(canvas, lay, cx, top):
    """Downsample a supersampled text layer (fixed font size, so lines of one style match) and paste it centred at cx
    with its ink top at top."""
    lay = lay.resize((max(1, round(lay.width / SS)), max(1, round(lay.height / SS))), Image.LANCZOS)
    canvas.alpha_composite(lay, (round(cx - lay.width / 2), top))


def icon(kind, h):
    S = h * SS
    img = Image.new("L", (S, S), 0); d = ImageDraw.Draw(img)
    lw = round(S * 0.045)
    if kind == "lens":
        r1, r2, r3 = S * 0.42, S * 0.30, S * 0.12
        c = S / 2
        d.ellipse((c - r1, c - r1, c + r1, c + r1), outline=255, width=lw)
        d.ellipse((c - r2, c - r2, c + r2, c + r2), outline=255, width=lw)
        d.ellipse((c - r3, c - r3, c + r3, c + r3), fill=255)
    elif kind == "mirror":
        w, hh = S * 0.46, S * 0.90
        x0, y0 = (S - w) / 2, (S - hh) / 2
        d.rounded_rectangle((x0, y0, x0 + w, y0 + hh), radius=S * 0.08, outline=255, width=lw)
        for k in (0, 1):
            ox = x0 + w * (0.22 + 0.16 * k); oy = y0 + hh * (0.30 + 0.06 * k)
            d.line((ox, oy, ox + w * 0.26, oy - hh * 0.14), fill=255, width=lw)
    else:                                                    # chip
        b = S * 0.56; x0 = (S - b) / 2
        d.rounded_rectangle((x0, x0, x0 + b, x0 + b), radius=S * 0.08, outline=255, width=lw)
        i = S * 0.24; xi = (S - i) / 2
        d.rounded_rectangle((xi, xi, xi + i, xi + i), radius=S * 0.03, outline=255, width=lw)
        for t in (0.32, 0.5, 0.68):
            p = x0 + b * t
            d.line((p, x0 - S * 0.14, p, x0), fill=255, width=lw); d.line((p, x0 + b, p, x0 + b + S * 0.14), fill=255, width=lw)
            d.line((x0 - S * 0.14, p, x0, p), fill=255, width=lw); d.line((x0 + b, p, x0 + b + S * 0.14, p), fill=255, width=lw)
    img = img.resize((h, h), Image.LANCZOS)
    lay = Image.new("RGBA", (h, h), INK + (0,)); lay.putalpha(img)
    return lay


def product_on_white(path):
    """Render on its grey studio -> divide out a smooth quadratic fit of the background -> #F8F8F8 studio."""
    src = np.asarray(Image.open(path).convert("RGB")).astype(float)
    h, w, _ = src.shape
    yy, xx = np.mgrid[0:h, 0:w]
    dk = src.mean(-1) < 120                                  # the black hardware
    r, c = np.nonzero(dk.any(1))[0], np.nonzero(dk.any(0))[0]
    sample = np.zeros((h, w), bool)                           # background clear of the product and its floor shadow
    sample[:max(40, r.min() - 60)] = True
    sample[:r.max() - 300, :max(40, c.min() - 60)] = True
    sample[:r.max() - 300, min(w - 40, c.max() + 60):] = True
    ys, xs = yy[sample][::37], xx[sample][::37]
    A = np.stack([np.ones_like(xs), xs, ys, xs * xs, ys * ys, xs * ys], 1).astype(float) / [1, w, h, w * w, h * h, w * h]
    full = np.stack([np.ones_like(xx), xx, yy, xx * xx, yy * yy, xx * yy], -1).astype(float) / [1, w, h, w * w, h * h, w * h]
    bg = np.stack([full @ np.linalg.lstsq(A, src[..., c][sample][::37], rcond=None)[0] for c in range(3)], -1)
    norm = np.clip(src * (BG / bg), 0, 255)
    # keep only the product and the floor shadow near it; further out fade to flat BG, so stray floor marks in the
    # render (e.g. a faint horizon streak in the M04 trio) don't run to the poster edge
    from scipy import ndimage
    k = 4
    sil = ndimage.binary_fill_holes(ndimage.binary_dilation(dk[::k, ::k], iterations=2))   # frames enclose the glass
    reach = int(0.07 * (r.max() - r.min()) / k)
    keep = ndimage.binary_dilation(sil, iterations=reach).astype(float)
    keep = ndimage.gaussian_filter(keep, reach / 2)
    keep = np.asarray(Image.fromarray((keep * 255).astype(np.uint8)).resize((w, h), Image.BILINEAR)).astype(float)[..., None] / 255
    norm = BG + (norm - BG) * keep
    return norm, (c.min(), r.min(), c.max(), r.max())


def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "final" / "close" / "png" / "02_front_mirror.png"
    name = sys.argv[2] if len(sys.argv) > 2 else "cold-mirror_poster"
    canvas = np.empty((H, W, 3), float); canvas[:] = BG
    # product: scale so panel top -> base bottom = PROD_H, centred, top at PROD_TOP; feathered window edges
    norm, (x0, y0, x1, y1) = product_on_white(src)
    s = min(PROD_H / (y1 - y0 + 1), MAX_W / (x1 - x0 + 1))
    pim = Image.fromarray(norm.round().astype(np.uint8)).resize((round(norm.shape[1] * s), round(norm.shape[0] * s)), Image.LANCZOS)
    px = round(W / 2 - (x0 + x1) / 2 * s); py = round(PROD_TOP + PROD_H / 2 - (y0 + y1) / 2 * s)
    p = np.asarray(pim).astype(float)
    feather = np.ones(p.shape[:2])
    fw = 80
    ramp = lambda n: np.clip(np.arange(n) / fw, 0, 1)
    fy = np.minimum(ramp(p.shape[0]), ramp(p.shape[0])[::-1]); fx = np.minimum(ramp(p.shape[1]), ramp(p.shape[1])[::-1])
    feather = np.minimum(fy[:, None], fx[None, :])[..., None]
    ya, yb = max(0, py), min(H, py + p.shape[0]); xa, xb = max(0, px), min(W, px + p.shape[1])
    sub = p[ya - py:yb - py, xa - px:xb - px]; fe = feather[ya - py:yb - py, xa - px:xb - px]
    canvas[ya:yb, xa:xb] = canvas[ya:yb, xa:xb] * (1 - fe) + sub * fe
    img = Image.fromarray(canvas.round().astype(np.uint8)).convert("RGBA")

    # logo
    ic = Image.open(ROOT / "poster" / "refs" / "icon_black.png").convert("L")
    a = Image.eval(ic, lambda v: 255 - v); a = a.crop(a.getbbox())
    a = a.resize((round(a.width * ICON_H / a.height), ICON_H), Image.LANCZOS)
    logo = Image.new("RGBA", a.size, INK + (0,)); logo.putalpha(a)
    img.alpha_composite(logo, (round(W / 2 - a.width / 2), ICON_TOP))

    # name (SF Semibold): scale by the cap height of "C"
    f = sf(200 * SS, 600)
    lay = Image.new("L", (int(f.getlength("Cold Mirror")) + 80 * SS, 300 * SS), 0)
    ImageDraw.Draw(lay).text((40 * SS, 250 * SS), "Cold Mirror", font=f, fill=255, anchor="ls")
    cap = f.getbbox("C", anchor="ls"); cap_h = -cap[1]
    bb = lay.getbbox(); lay = lay.crop(bb)
    sc = NAME_CAP / cap_h
    lay = lay.resize((round(lay.width * sc), round(lay.height * sc)), Image.LANCZOS)
    nl = Image.new("RGBA", lay.size, INK + (0,)); nl.putalpha(lay)
    img.alpha_composite(nl, (round(W / 2 - lay.width / 2), NAME_TOP))

    # slogan
    place_text(img, text_layer("先改变，再看见。", SLOGAN_PX, 400, False, INK), W / 2, SLOGAN_TOP)

    # features
    d = ImageDraw.Draw(img)
    for x in RULES_X:
        d.line((x, RULES_Y[0], x, RULES_Y[1]), fill=RULE + (255,), width=3)
    for cx, (kind, title, subs) in zip(COLS, FEATURES):
        ik = icon(kind, FICON_H)
        img.alpha_composite(ik, (round(cx - FICON_H / 2), round(FICON_CY - FICON_H / 2)))
        place_text(img, text_layer(title, TITLE_PX, 590, True, INK), cx, TITLE_TOP)
        for top, sline in zip(SUB_TOPS, subs):
            place_text(img, text_layer(sline, SUB_PX, 400, False, GREY), cx, top)

    OUT.mkdir(parents=True, exist_ok=True)
    rgb = img.convert("RGB")
    rgb.save(OUT / f"{name}.png")
    rgb.save(OUT / f"{name}.jpg", quality=92, progressive=True, optimize=True, subsampling=0)
    print(OUT / f"{name}.jpg")


if __name__ == "__main__":
    main()
