"""Exact geometry guide for the Cold Mirror shell, built from the drawing
(`../assets/55-inch Custom Mirror Shell Model.pdf`, all sizes in mm).

Renders a flat-shaded perspective view from a named camera and writes
  work/guide_<shot>.png   - the reference image passed to the image model
  work/guide_<shot>.json  - projected key points, used by align.py and finish.py

usage: python guide.py 01
"""
import json, math, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parent.parent / "work"

# ---- geometry (x right, y up, z toward the viewer; panel front at z=0) ----
PW, PH, PD = 831, 1801, 46            # panel
BASE_W, BASE_D, BASE_T, BASE_R = 600, 400, 50, 40
GAP = 30                              # feet: base top -> panel bottom
P0 = BASE_T + GAP                     # panel bottom y = 80
PT = P0 + PH                          # panel top y = 1881
BASE_Z = (-352, 48)                   # panel front sits 48 mm behind the base front
DISP_W, DISP_H, DISP_TOP = 680, 1209, PT - 73    # drawing: 73 mm top/side border, 515 mm below
CAM = (-375.9, 920)                   # camera lens: 39.6 mm in from the left edge (drawing, ±2 mm), 920 mm above floor
BUTTON_Y = 1500
TUBE = 40
RAIL_X = 233
RAIL_TOP = 1647
CROSS_Y = (1114, 586)
BRACE_TOP, BRACE_BOT_Z = 876, -330

SIZE = {"4:5": (2560, 3200), "3:4": (2400, 3200), "1:1": (3000, 3000), "16:9": (3840, 2160)}
SHOTS = {
    # yaw: camera angle to the right of the front normal (180 = from behind); eye: camera height (mm)
    # fill: product height / frame height; target+span: frame a detail (span = mm covered vertically)
    # screen: app screenshot shown in the window (refs/screen_<name>.png); align: how align.py registers it
    # scene: the model builds an interior around the product (edges are extended, no silhouette score)
    "01": dict(aspect="4:5", yaw=30, eye=1300, dist=9000, fill=0.75, align="front"),
    "01b": dict(aspect="4:5", yaw=30, eye=1300, dist=9000, fill=0.75, align="window"),
    "02": dict(aspect="3:4", yaw=0, eye=1000, dist=9000, fill=0.78, align="front"),
    "03": dict(aspect="3:4", yaw=0, eye=1000, dist=9000, fill=0.78, align="front", screen="home"),
    "04": dict(aspect="4:5", yaw=-30, eye=1300, dist=9000, fill=0.75, align="front", screen="color"),
    "05": dict(aspect="3:4", yaw=90, eye=1000, dist=9000, fill=0.78, align="bbox"),
    "06": dict(aspect="4:5", yaw=215, eye=1300, dist=9000, fill=0.75, align="bbox"),
    "07": dict(aspect="1:1", yaw=0, eye=920, dist=2500, target=(-375, 920, 0), span=520, align="lens"),
    "08": dict(aspect="4:5", yaw=25, eye=1600, dist=7000, fill=0.62, align="front", screen="library", scene=True),
    # wide salon scene: mirror against the wall, customer seated ~1.5 m in front of it, stylist behind her chair;
    # 35 deg from the right keeps chair and people clear of the panel in the image (checked with stand-in boxes).
    # At 45 deg the model drew the lower panel 5-14 % too tall in 6 of 6 attempts.
    "09": dict(aspect="16:9", yaw=35, eye=1550, dist=7000, target=(0, 1000, 750), span=2500, align="front",
               screen="color", scene=True, plate="09p"),
    # 09p: the product alone at 09's camera on the studio background (an intermediate plate, not delivered).
    # With people in the scene the model redrew the product (lower panel 5-35 % too tall in 8 of 8 attempts),
    # so 09 is built around this verified plate and the plate's product pixels are pasted back.
    "09p": dict(aspect="16:9", yaw=35, eye=1550, dist=7000, target=(0, 1000, 750), span=2500, align="front",
                screen="color", intermediate=True),
}


def box(x0, x1, y0, y1, z0, z1):
    v = np.array([[x, y, z] for x in (x0, x1) for y in (y0, y1) for z in (z0, z1)], float)
    return v, [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]


def beam(p, q, w):
    p, q = np.array(p, float), np.array(q, float)
    a = (q - p) / np.linalg.norm(q - p)
    s = np.array([1.0, 0, 0])
    t = np.cross(a, s)
    h = w / 2
    v = np.array([c + i * h * s + j * h * t for c in (p, q) for i in (-1, 1) for j in (-1, 1)])
    return v, [(0, 1, 3, 2), (4, 6, 7, 5), (0, 4, 5, 1), (2, 3, 7, 6), (0, 2, 6, 4), (1, 5, 7, 3)]


def rounded_prism(x0, x1, z0, z1, r, y0, y1, n=10):
    pts = []
    for cx, cz, a0 in ((x1 - r, z1 - r, 0), (x0 + r, z1 - r, 90), (x0 + r, z0 + r, 180), (x1 - r, z0 + r, 270)):
        for k in range(n + 1):
            a = math.radians(a0 + 90 * k / n)
            pts.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    m = len(pts)
    v = np.array([[x, y0, z] for x, z in pts] + [[x, y1, z] for x, z in pts], float)
    faces = [tuple(range(m - 1, -1, -1)), tuple(range(m, 2 * m))]
    faces += [(i, (i + 1) % m, m + (i + 1) % m, m + i) for i in range(m)]
    return v, faces


def parts():
    hw = PW / 2
    P = []
    P.append(("base", *rounded_prism(-BASE_W / 2, BASE_W / 2, *BASE_Z, BASE_R, 0, BASE_T)))
    for sx in (-1, 1):
        P.append(("base", *box(sx * 240 - 20, sx * 240 + 20, BASE_T, P0, -40, -6)))
        P.append(("tube", *box(sx * RAIL_X - TUBE / 2, sx * RAIL_X + TUBE / 2, BASE_T, RAIL_TOP, -PD - TUBE, -PD)))
        P.append(("tube", *beam((sx * RAIL_X, BRACE_TOP, -PD - TUBE - TUBE / 2), (sx * RAIL_X, BASE_T + 10, BRACE_BOT_Z), TUBE)))
    for y in (RAIL_TOP - TUBE / 2, *CROSS_Y):
        P.append(("tube", *box(-RAIL_X - TUBE / 2, RAIL_X + TUBE / 2, y - TUBE / 2, y + TUBE / 2, -PD - TUBE, -PD)))
    P.append(("box", *box(-110, 110, 235, 421, -PD - 30, -PD)))
    P.append(("panel", *box(-hw, hw, P0, PT, -PD, 0)))
    return P


REFS = Path(__file__).resolve().parent.parent / "refs"


def perspective_coeffs(dst, src):
    """PIL PERSPECTIVE coefficients mapping output points dst[i] -> input points src[i]."""
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        b += [u, v]
    return np.linalg.lstsq(np.array(A, float), np.array(b, float), rcond=None)[0].tolist()


def warp_into(img, src, quad, alpha=1.0):
    """Paste src (whole image) into the quad TL, TR, BR, BL of img."""
    w, h = src.size
    co = perspective_coeffs([tuple(p) for p in quad], [(0, 0), (w, 0), (w, h), (0, h)])
    warped = src.transform(img.size, Image.PERSPECTIVE, co, Image.BICUBIC)
    m = Image.new("L", img.size, 0); ImageDraw.Draw(m).polygon([tuple(p) for p in quad], fill=int(255 * alpha))
    out = img.copy(); out.paste(warped, (0, 0), m)
    return out


class Cam:
    def __init__(self, yaw, eye, dist, aspect, fill=0.75, target=None, span=None, **_):
        a = math.radians(yaw)
        self.W, self.H = SIZE[aspect]
        tgt = np.array(target if target else [0.0, PT / 2, -150.0], float)
        self.C = tgt + dist * np.array([math.sin(a), 0, math.cos(a)])
        self.C[1] = eye
        self.f = -np.array([math.sin(a), 0, math.cos(a)])
        self.r = np.array([math.cos(a), 0, -math.sin(a)])
        self.u = np.array([0.0, 1, 0])
        self.F = self.H * dist / (span if span else PT / fill)
        self.cx = self.W / 2
        self.cy0 = self.H / 2 - self.F * (eye - tgt[1]) / dist   # horizon row (lens shift, no tilt)

    def depth(self, p):
        return (np.asarray(p) - self.C) @ self.f

    def __call__(self, p):
        d = np.asarray(p, float) - self.C
        z = d @ self.f
        return np.stack([self.cx + self.F * (d @ self.r) / z, self.cy0 - self.F * (d @ self.u) / z], -1)


def shade(n, base, lo, hi, view=None):
    """Key light from above-front-left, plus a light from the camera so faces seen from behind still read."""
    L = np.array([-0.35, 1.0, 0.55]); L /= np.linalg.norm(L)
    k = max(0.0, float(n @ L))
    if view is not None:
        k = 0.55 * k + 0.75 * max(0.0, float(n @ view)) ** 2
    return tuple(int(min(255, c * (lo + hi * k))) for c in base)


def raster(cam, ss, polys):
    """Z-buffered flat polygons: polys = [(points3d, rgb)]."""
    W, H = cam.W * ss, cam.H * ss
    rgb = np.empty((H, W, 3), np.uint8); rgb[:] = (245, 245, 247)
    zbuf = np.full((H, W), np.inf)
    for q, col in polys:
        q = np.asarray(q, float)
        n = np.cross(q[1] - q[0], q[2] - q[0])
        if np.linalg.norm(n) < 1e-9:
            n = np.cross(q[2] - q[0], q[-1] - q[0])
        d = n @ q[0]
        pts = cam(q) * ss
        x0, y0 = np.floor(pts.min(0)).astype(int); x1, y1 = np.ceil(pts.max(0)).astype(int) + 1
        x0, y0 = max(x0, 0), max(y0, 0); x1, y1 = min(x1, W), min(y1, H)
        if x0 >= x1 or y0 >= y1:
            continue
        m = Image.new("1", (x1 - x0, y1 - y0)); ImageDraw.Draw(m).polygon([tuple(p - (x0, y0)) for p in pts], fill=1)
        m = np.asarray(m)
        if not m.any():
            continue
        ys, xs = np.nonzero(m)
        px = (xs + x0 + 0.5) / ss; py = (ys + y0 + 0.5) / ss
        dirs = cam.f[None] + ((px - cam.cx) / cam.F)[:, None] * cam.r[None] - ((py - cam.cy0) / cam.F)[:, None] * cam.u[None]
        den = dirs @ n
        ok = np.abs(den) > 1e-12
        s = np.where(ok, (d - n @ cam.C) / np.where(ok, den, 1), np.inf)
        gy, gx = ys + y0, xs + x0
        win = s < zbuf[gy, gx] - 1e-6
        zbuf[gy[win], gx[win]] = s[win]
        rgb[gy[win], gx[win]] = col
    return Image.fromarray(rgb)


def render(shot):
    cfg = SHOTS[shot]
    cam = Cam(**cfg)
    ss = 2
    polys = []
    for kind, v, fs in parts():
        c = v.mean(0)
        for f in fs:
            q = v[list(f)]
            n = np.cross(q[1] - q[0], q[2] - q[0])
            if np.linalg.norm(n) < 1e-9:
                n = np.cross(q[2] - q[0], q[3] - q[0])
            n /= np.linalg.norm(n)
            if n @ (q.mean(0) - c) < 0:
                n = -n
            if n @ (cam.C - q.mean(0)) <= 0:
                continue
            tone = {"panel": (46, 46, 50), "base": (40, 40, 44), "tube": (22, 22, 24), "box": (64, 64, 70)}[kind]
            polys.append((q, shade(n, tone, 0.45, 0.9, -cam.f)))
    hw, dw = PW / 2, DISP_W / 2   # mirror window inside the wide black border, then the lens and the button
    polys.append(([[-dw, DISP_TOP, 0.5], [dw, DISP_TOP, 0.5], [dw, DISP_TOP - DISP_H, 0.5], [-dw, DISP_TOP - DISP_H, 0.5]], (214, 216, 220)))
    polys.append(([[CAM[0] + 13 * math.cos(t), CAM[1] + 13 * math.sin(t), 1.0] for t in np.linspace(0, 2 * math.pi, 40, endpoint=False)], (95, 98, 108)))
    polys.append(([[CAM[0] + 6 * math.cos(t), CAM[1] + 6 * math.sin(t), 1.5] for t in np.linspace(0, 2 * math.pi, 40, endpoint=False)], (5, 5, 8)))
    polys.append(([[hw + 1, BUTTON_Y + 25, -32], [hw + 1, BUTTON_Y + 25, -14], [hw + 1, BUTTON_Y - 25, -14], [hw + 1, BUTTON_Y - 25, -32]], (90, 90, 96)))
    img = raster(cam, ss, polys).resize((cam.W, cam.H), Image.LANCZOS)
    win3d = [[-dw, DISP_TOP, 0], [dw, DISP_TOP, 0], [dw, DISP_TOP - DISP_H, 0], [-dw, DISP_TOP - DISP_H, 0]]
    if cfg.get("screen"):
        img = warp_into(img, Image.open(REFS / f"screen_{cfg['screen']}.png").convert("RGB"), cam(np.array(win3d)))
    OUT.mkdir(exist_ok=True)
    img.save(OUT / f"guide_{shot}.png")

    hw = PW / 2
    key = {
        "panel_front_TL": [-hw, PT, 0], "panel_front_TR": [hw, PT, 0],
        "panel_front_BL": [-hw, P0, 0], "panel_front_BR": [hw, P0, 0],
        "camera": [CAM[0], CAM[1], 0],
        "window_TL": [-DISP_W / 2, DISP_TOP, 0], "window_TR": [DISP_W / 2, DISP_TOP, 0],
        "window_BL": [-DISP_W / 2, DISP_TOP - DISP_H, 0], "window_BR": [DISP_W / 2, DISP_TOP - DISP_H, 0],
        "base_front_L": [-BASE_W / 2, BASE_T, BASE_Z[1]], "base_front_R": [BASE_W / 2, BASE_T, BASE_Z[1]],
        "base_floor_front_L": [-BASE_W / 2, 0, BASE_Z[1]],
    }
    pts = {k: cam(np.array(v)).round(1).tolist() for k, v in key.items()}
    json.dump({"shot": shot, "camera": cfg, "points": pts}, open(OUT / f"guide_{shot}.json", "w"), indent=1)
    print(OUT / f"guide_{shot}.png")


if __name__ == "__main__":
    render(sys.argv[1] if len(sys.argv) > 1 else "01")
