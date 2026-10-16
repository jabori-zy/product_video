"""Cold Mirror multi-product views (design: ../multi_product.md). Several v2 units (whole front = mirror) on one floor.

usage (or tools/multi.sh ...):
  python multi.py guide <id>              multi-unit CAD guide -> work_multi/guide_<id>.png + .json + _labels.png
  python multi.py off <id> [attempts=2]   all units screen OFF -> work_multi/<id>_off_try<n>.png (+ per-unit check)
  python multi.py on <id> [attempts=2]    pin the real screenshots on the ON units of the accepted OFF image -> lighting pass
  python multi.py accept <id> <off|on> <file>   accept an attempt; the final (on, or off if no unit is ON) is exported
                                          to final/multi_angle/ (on: the real screenshots are pinned again)
Unit yaw: 0 = front to +z (toward a camera at azimuth 0); +yaw turns the front toward +x (image right), so at azimuth 0
yaw -90 shows the RIGHT side edge (button) and yaw +90 the plain left side.
"""
import json, math, subprocess, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import guide as G  # noqa: E402
import v2  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
WORK, FINAL = ROOT / "work_multi", ROOT / "final" / "multi_angle"
HERO = v2.HERO
REAR = ROOT / "final" / "close" / "png" / "06_rear-3q.png"
SIZE = {**G.SIZE, "4:3": (3200, 2400), "21:9": (3840, 1646)}

# units: (x, z, yaw, state) with state None (back/side, no screen), "off", or a screen name (ON)
COMPS = {
    "M01": dict(name="front-back-pair", aspect="4:3", az=0, eye=1000, dist=9000, fill=0.72,
                units=[(-560, 0, 0, "off"), (560, 0, 180, None)],
                text="Two units stand side by side at the same depth: the left one faces the camera squarely and shows its "
                     "full-front mirror; the right one is turned around and shows its back (flat matte black panel back, "
                     "ladder frame of square black tube, the small service box, two diagonal braces down to the base)."),
    "M02": dict(name="front-back-pair-3q", aspect="4:3", az=0, eye=1300, dist=9000, fill=0.70,
                units=[(-600, 0, -30, "home"), (600, -250, 150, None)],
                text="Two units: the left one shows its mirror front at a 3/4 angle, the right one, a little further back, "
                     "shows its back at a 3/4 angle (ladder frame, braces, service box), so the 46 mm panel depth, the base "
                     "overhang and the braces all read."),
    "M03": dict(name="staggered-duo", aspect="4:5", az=20, eye=1300, dist=9000, fill=0.78,
                units=[(-250, 350, 0, "color"), (450, -450, -20, "off")],
                text="Two units staggered in depth: one in front, and a second one behind it and to the right, partly hidden "
                     "by the front unit's right edge, with its base and camera lens still visible."),
    "M04": dict(name="trio-v", aspect="16:9", az=0, eye=1200, dist=9000, fill=0.74,
                units=[(0, 500, 0, "home"), (-950, -300, 25, "off"), (950, -300, -25, "library")],
                text="Three units in a V: the hero unit stands forward in the centre facing the camera; two flanking units "
                     "stand further back on the left and right, each turned 25 degrees toward the centre."),
    "M05": dict(name="rotation-sequence", aspect="21:9", az=0, eye=1000, dist=12000, fill=0.62,
                units=[(-2400, 0, 0, "off"), (-1200, 0, -45, "off"), (0, 0, -90, None), (1200, 0, -135, None),
                       (2400, 0, 180, None)],
                text="Five identical units in one straight row, evenly spaced, each turned a further 45 degrees, like a "
                     "turntable sequence. From left to right: mirror front square to the camera; front 3/4; exact side "
                     "profile of the right side edge (46 mm panel, the small button, the back frame rail and the diagonal "
                     "brace forming a narrow A-shape); rear 3/4; the full back."),
    "M06": dict(name="showroom-row", aspect="16:9", az=-15, eye=1400, dist=6500, fill=0.80,
                units=[(-2200 + i * 1100 * math.cos(math.radians(30)), 1100 - i * 1100 * math.sin(math.radians(30)), 30,
                        s) for i, s in enumerate(["home", "off", "color", "off", "library", "off"])],
                text="Six identical units in one straight row, side by side with even gaps, all turned the same way, "
                     "receding in perspective from the front left to the back right like a retail display."),
    "M07": dict(name="profile-structure", aspect="4:3", az=0, eye=1000, dist=9000, fill=0.75,
                units=[(-500, 0, -90, None), (600, -300, 215, None)],
                text="Two units: the left one in exact side profile showing its right side edge (the slim 46 mm panel, the "
                     "small flush button at 1500 mm, the back frame rail and the diagonal brace forming a narrow A-shape); "
                     "the right one seen from behind at a 3/4 angle showing the ladder frame, service box and braces. Rim "
                     "light outlines every black edge."),
    "M08": dict(name="high-angle-overview", aspect="4:5", az=0, eye=3600, dist=8000, fill=0.86, pitch=True,
                units=[(-1000, 1100, 25, "off"), (0, 0, 25, "color"), (1000, -1100, 25, "off")],
                text="High-angle overview: the camera looks down at about 35 degrees on three units standing in a staggered "
                     "diagonal on the floor, all turned the same way, so the base footprints, the panel overhang and the "
                     "shadow pattern on the floor read clearly. Verticals converge slightly, as in an architectural view."),
}


# ---------------------------------------------------------------- camera and guide
class Cam:
    """Pinhole camera at azimuth az (deg, from +z toward +x), eye height, distance to the arrangement's centre.
    pitch=True aims at the centre (tilted), otherwise the axis stays level (lens shift). Framing is fitted to `pts`."""
    def __init__(self, cfg, pts):
        self.W, self.H = SIZE[cfg["aspect"]]
        a = math.radians(cfg["az"])
        ctr = np.array([pts[:, 0].mean(), 900.0, pts[:, 2].mean()])
        back = np.array([math.sin(a), 0, math.cos(a)])
        self.C = ctr + cfg["dist"] * back
        self.C[1] = cfg["eye"]
        f = ctr - self.C if cfg.get("pitch") else -back
        self.f = f / np.linalg.norm(f)
        self.r = np.cross(self.f, [0, 1.0, 0]); self.r /= np.linalg.norm(self.r)
        self.u = np.cross(self.r, self.f)
        d = pts - self.C
        z = d @ self.f
        x, y = (d @ self.r) / z, (d @ self.u) / z
        self.F = min(cfg["fill"] * self.H / (y.max() - y.min()), 0.92 * self.W / (x.max() - x.min()))
        self.cx = self.W / 2 - self.F * (x.max() + x.min()) / 2
        self.cy0 = self.H / 2 + self.F * (y.max() + y.min()) / 2

    def __call__(self, p):
        d = np.asarray(p, float) - self.C
        z = d @ self.f
        return np.stack([self.cx + self.F * (d @ self.r) / z, self.cy0 - self.F * (d @ self.u) / z], -1)


def place(v, x, z, yaw):
    c, s = math.cos(math.radians(yaw)), math.sin(math.radians(yaw))
    v = np.asarray(v, float)
    return np.stack([v[..., 0] * c + v[..., 2] * s + x, v[..., 1], -v[..., 0] * s + v[..., 2] * c + z], -1)


def circle(cx, cy, r, zz, n=40):
    return [[cx + r * math.cos(t), cy + r * math.sin(t), zz] for t in np.linspace(0, 2 * math.pi, n, endpoint=False)]


def raster(cam, ss, polys):
    """Z-buffered flat polygons [(points3d, rgb, label)] -> rgb image and label image (0 = background)."""
    W, H = cam.W * ss, cam.H * ss
    rgb = np.empty((H, W, 3), np.uint8); rgb[:] = (245, 245, 247)
    lab = np.zeros((H, W), np.uint8)
    zbuf = np.full((H, W), np.inf)
    for q, col, label in polys:
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
        ys, xs = np.nonzero(np.asarray(m))
        if not len(ys):
            continue
        px = (xs + x0 + 0.5) / ss; py = (ys + y0 + 0.5) / ss
        dirs = cam.f[None] + ((px - cam.cx) / cam.F)[:, None] * cam.r[None] - ((py - cam.cy0) / cam.F)[:, None] * cam.u[None]
        den = dirs @ n
        ok = np.abs(den) > 1e-12
        s = np.where(ok, (d - n @ cam.C) / np.where(ok, den, 1), np.inf)
        gy, gx = ys + y0, xs + x0
        win = s < zbuf[gy, gx] - 1e-6
        zbuf[gy[win], gx[win]] = s[win]
        rgb[gy[win], gx[win]] = col
        lab[gy[win], gx[win]] = label
    return rgb, lab


def unit_polys(cam, k, x, z, yaw):
    """Polygons of unit k (labels: 10k+1 body, 10k+2 glass, 10k+3 display area behind the glass)."""
    out = []
    for kind, v, fs in G.parts():
        v = place(v, x, z, yaw)
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
            out.append((q, G.shade(n, tone, 0.45, 0.9, -cam.f), 10 * k + 1))
    front = place([[0, 0, 0]], x, z, yaw)[0]
    nrm = place([[0, 0, 1]], 0, 0, yaw)[0]
    if nrm @ (cam.C - front) > 0:                       # front visible: glass, display area, lens
        gw, gh, gt = v2.GLASS; dw, dh, dt = v2.DISP
        out.append((place(v2.quad3d(gw, gh, gt) + [0, 0, 0.5], x, z, yaw), (214, 216, 220), 10 * k + 2))
        out.append((place(v2.quad3d(dw, dh, dt) + [0, 0, 0.6], x, z, yaw), (214, 216, 220), 10 * k + 3))
        out.append((place(circle(G.CAM[0], G.CAM[1], 13, 1.0), x, z, yaw), (95, 98, 108), 10 * k + 2))
        out.append((place(circle(G.CAM[0], G.CAM[1], 6, 1.5), x, z, yaw), (5, 5, 8), 10 * k + 2))
    hw = G.PW / 2
    btn = [[hw + 1, G.BUTTON_Y + 25, -32], [hw + 1, G.BUTTON_Y + 25, -14], [hw + 1, G.BUTTON_Y - 25, -14], [hw + 1, G.BUTTON_Y - 25, -32]]
    if place([[1, 0, 0]], 0, 0, yaw)[0] @ (cam.C - place([[hw, 1500, -23]], x, z, yaw)[0]) > 0:
        out.append((place(btn, x, z, yaw), (90, 90, 96), 10 * k + 1))
    return out


def facing(cfg, yaw):
    """Which face a unit at `yaw` shows to the camera."""
    rel = (yaw - cfg["az"] + 180) % 360 - 180
    a = abs(rel)
    if a < 20: return "front"
    if a < 70: return "front 3/4"
    if a < 110: return "right side" if rel < 0 else "left side"
    if a < 160: return "rear 3/4"
    return "back"


def make_guide(cid):
    cfg = COMPS[cid]
    allv = np.concatenate([place(v, x, z, yaw) for x, z, yaw, _ in cfg["units"] for _, v, _ in G.parts()])
    cam = Cam(cfg, allv)
    polys = [p for k, (x, z, yaw, _) in enumerate(cfg["units"], 1) for p in unit_polys(cam, k, x, z, yaw)]
    ss = 2
    rgb, lab = raster(cam, ss, polys)
    W, H = cam.W, cam.H
    Image.fromarray(rgb).resize((W, H), Image.LANCZOS).save(WORK / f"guide_{cid}.png")
    Image.fromarray(lab).resize((W, H), Image.NEAREST).save(WORK / f"guide_{cid}_labels.png")
    units = []
    for k, (x, z, yaw, state) in enumerate(cfg["units"], 1):
        u = dict(k=k, x=x, z=z, yaw=yaw, state=state, face=facing(cfg, yaw),
                 glass=cam(place(v2.quad3d(*v2.GLASS), x, z, yaw)).round(1).tolist(),
                 display=cam(place(v2.quad3d(*v2.DISP), x, z, yaw)).round(1).tolist())
        units.append(u)
    order = sorted(range(len(units)), key=lambda i: np.mean(np.array(units[i]["glass"])[:, 0]))
    for rank, i in enumerate(order):
        units[i]["pos"] = rank
    json.dump({"id": cid, "size": [W, H], "units": units}, open(WORK / f"guide_{cid}.json", "w"), indent=1)
    return WORK / f"guide_{cid}.png"


# ---------------------------------------------------------------- prompts
def describe(cfg, units):
    n = len(units)
    names = {0: "leftmost", n - 1: "rightmost"} if n > 2 else {0: "left", n - 1: "right"}
    lines = []
    for u in sorted(units, key=lambda u: u["pos"]):
        where = names.get(u["pos"], f"number {u['pos'] + 1} from the left")
        what = {"front": "faces the camera and shows its full-front mirror",
                "front 3/4": "shows its full-front mirror at a 3/4 angle",
                "right side": "shows its right side edge in profile (with the small button)",
                "left side": "shows its plain left side edge in profile",
                "rear 3/4": "shows its back at a 3/4 angle (ladder frame, braces, service box)",
                "back": "is turned around and shows its full back (ladder frame, braces, service box)"}[u["face"]]
        lines.append(f"- The {where} unit {what}.")
    return "\n".join(lines)


def off_prompt(cid, units):
    cfg = COMPS[cid]
    return "\n\n".join([
        f"Image 1 is an exact CAD geometry render of {len(units)} identical units of the same product, standing on one "
        "floor, from the exact camera of this shot. Reproduce its geometry EXACTLY, aligned to it pixel for pixel: the same "
        "framing, camera angle, perspective, the position, size, rotation and proportions of EVERY unit, and which unit is "
        "in front of which. Do not add, remove, move, resize, rotate, widen or thicken any unit. Only replace the flat CAD "
        "shading with photoreal materials, lighting and shadow.",
        "Image 2 is the approved photoreal render of this product from the front (full-front mirror, thin black frame lip, "
        "black base). Image 3 is the approved photoreal render of its back (ladder frame, braces, service box). Match their "
        "materials, finish and render quality exactly for every unit.",
        "Image 4 is the reference for the SHADOW and background only (ignore the phones in it): light neutral grey seamless "
        "studio, soft diffuse floor shadows darkest at the contact line and fading out gradually.",
        v2.PRODUCT, v2.PRECISION,
        "ARRANGEMENT. " + cfg["text"] + "\n" + describe(cfg, units),
        "All units stand upright on their bases on the same floor, verticals perfectly vertical; none is tilted, floating "
        "or lying down. All units are identical in size and design.",
        "STUDIO AND SHADOW. Apple.com product render style on a seamless light neutral grey background like image 4, no "
        "horizon line, no banding. One soft large key light from the front left and above, so every unit casts its soft, "
        "diffuse floor shadow back and to the right, with its own dark contact shadow under the base; shadows of "
        "neighbouring units overlap naturally. Thin clean highlight lines along the black edges. Everything in focus. "
        "No people, no text, no props.",
        "All screens OFF: every visible front is one clean, uniform, true mirror reflecting the bright, soft, empty studio "
        "as a smooth gradient; the mirrors do NOT reflect the other units, people or the camera.",
        "The last image is the original technical drawing (sizes in mm). In the final product the WHOLE front is mirror, "
        "not the smaller window shown in the drawing."])


def on_prompt(cid, units):
    cfg = COMPS[cid]
    n = len(units)
    names = {0: "leftmost", n - 1: "rightmost"} if n > 2 else {0: "left", n - 1: "right"}
    on = [u for u in sorted(units, key=lambda u: u["pos"]) if u["state"] not in (None, "off")]
    off = [u for u in units if u["state"] == "off"]
    lst = "\n".join(f"- the {names.get(u['pos'], 'number %d from the left' % (u['pos'] + 1))} unit shows "
                    f"{v2.SCREEN_TEXT[u['state']]}" for u in on)
    return (f"Image 1 is the approved image of {n} identical units with some screens turned ON. Keep EVERYTHING EXACTLY as "
            "in image 1, pixel for pixel: every unit's position, size, rotation, perspective, proportions, thin black frame, "
            "camera lens, feet, base, the floor shadows and the background, and the same app screen content in the same "
            "places. Do not move, redraw, resize or restyle anything, and do not change any text or UI.\n\n"
            f"Screens ON:\n{lst}\n\n"
            "Make ONLY the screen-on lighting photoreal. The product is a one-way-mirror smart mirror: the display sits "
            "directly behind the mirror glass.\n"
            "- Each lit display area glows: emissive, bright, clean and evenly lit, seen through the glass in correct "
            "perspective, with a very faint smooth glass reflection over it.\n"
            "- The edge of each display area is clean and straight, with no seam, frame line or bezel.\n"
            "- Everywhere outside the display areas the fronts STAY true mirrors exactly as in image 1"
            + (", and the units with the screen off stay plain mirrors with no light at all" if off else "") +
            ". Only a very subtle soft light spill at the immediate border of each lit screen.\n"
            "Photoreal, tack sharp, no noise, no banding, no AI artefacts. No text added.")


# ---------------------------------------------------------------- checks and screens
def check(cid, path):
    """Per front-facing unit: detect the glass outline and compare with the guide (fall back to the guide quad when a
    unit is partly hidden). Returns the per-unit homographies used to place screens."""
    gj = json.load(open(WORK / f"guide_{cid}.json"))
    img = Image.open(path).convert("RGB")
    res = []
    for u in gj["units"]:
        r = dict(k=u["k"], face=u["face"], state=u["state"])
        if u["face"] in ("front", "front 3/4"):
            g = np.array(u["glass"])
            det = v2.detect_glass(img, g)
            if det is not None and np.abs(det - g).max() / img.height <= 0.02:
                r.update(glass=det.round(1).tolist(), dev=round(float(np.abs(det - g).max() / img.height), 4), detected=True)
            else:
                r.update(glass=g.tolist(), dev=None, detected=False,
                         note="outline not detected (occluded or off): guide quad used, check visually")
        res.append(r)
    devs = [r["dev"] for r in res if r.get("dev") is not None]
    return dict(id=cid, file=str(path), units=res, max_dev=max(devs) if devs else None,
                ok=all(d <= 0.01 for d in devs))


def pin_all(cid, img, rep):
    """Pin each ON unit's screenshot through the guide->render homography of its glass, masked to the part of its
    display area that is visible in the guide (another unit in front hides the rest)."""
    gj = json.load(open(WORK / f"guide_{cid}.json"))
    lab = np.asarray(Image.open(WORK / f"guide_{cid}_labels.png"))
    a = np.asarray(img).astype(float)
    for u, r in zip(gj["units"], rep["units"]):
        if u["state"] in (None, "off"):
            continue
        Hm = v2.homography(np.array(u["glass"]), np.array(r["glass"]))
        quad = v2.apply(Hm, np.array(u["display"]))
        inv = np.linalg.inv(Hm); co = (inv / inv[2, 2]).ravel()[:8].tolist()
        vis = Image.fromarray(((lab == 10 * u["k"] + 3) * 255).astype(np.uint8)).transform(img.size, Image.PERSPECTIVE, co, Image.BILINEAR)
        own = Image.fromarray((((lab // 10) == u["k"]) * 255).astype(np.uint8)).transform(img.size, Image.PERSPECTIVE, co, Image.NEAREST)
        scr = Image.open(v2.REFS / f"screen_{u['state']}.png").convert("RGB")
        w, h = scr.size; pad = 16
        padded = Image.fromarray(np.pad(np.asarray(scr), ((pad, pad), (pad, pad), (0, 0)), mode="edge"))
        src = [(pad, pad), (w + pad, pad), (w + pad, h + pad), (pad, h + pad)]
        warped = np.asarray(padded.transform(img.size, Image.PERSPECTIVE, v2.coeffs([tuple(p) for p in quad], src), Image.BICUBIC)).astype(float)
        m = np.minimum(np.asarray(vis.filter(ImageFilter.MaxFilter(2 * v2.GROW + 1))), np.asarray(own))
        k = np.asarray(Image.fromarray(m).filter(ImageFilter.GaussianBlur(0.8))).astype(float)[..., None] / 255
        a = a * (1 - k) + (warped * (1 - v2.REFLECT) + a * v2.REFLECT) * k
    return Image.fromarray(np.clip(a, 0, 255).round().astype(np.uint8))


# ---------------------------------------------------------------- generation
def gen(prompt, images, aspect, out):
    cmd = ["higgsfield", "generate", "create", "gpt_image_2_5", "--prompt", prompt]
    for im in images:
        cmd += ["--image", str(im)]
    cmd += ["--aspect_ratio", aspect, "--resolution", "4k", "--quality", "high", "--background", "opaque",
            "--variant", "sunburst", "--wait", "--wait-timeout", "25m"]
    err = ""
    for _ in range(3):
        r = subprocess.run(cmd, capture_output=True, text=True)
        url = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else ""
        if url.startswith("http"):
            urllib.request.urlretrieve(url, out)
            Path(str(out) + ".url").write_text(url)
            im = Image.open(out)
            if im.size != SIZE[aspect]:
                im.convert("RGB").resize(SIZE[aspect], Image.LANCZOS).save(out)
            return out
        err = (r.stdout + r.stderr)[-300:]
    print(json.dumps({"out": str(out), "error": err}), flush=True)


def run(prefix, cid, prompt, images, n):
    (WORK / f"{prefix}_prompt.txt").write_text(prompt)
    k = len(list(WORK.glob(f"{prefix}_try*.png")))
    outs = [WORK / f"{prefix}_try{k + i + 1}.png" for i in range(n)]
    with ThreadPoolExecutor(n) as ex:
        res = list(ex.map(lambda o: gen(prompt, images, COMPS[cid]["aspect"], o), outs))
    for p in res:
        if p:
            rep = check(cid, p)
            json.dump(rep, open(str(p).replace(".png", "_check.json"), "w"), indent=1)
            print(json.dumps({"file": p.name, "max_dev": rep["max_dev"], "ok": rep["ok"],
                              "undetected": [r["k"] for r in rep["units"] if r.get("detected") is False]}), flush=True)


def export(cid, img):
    name = f"{cid}_{COMPS[cid]['name']}"
    for d in ("png", "jpg"):
        (FINAL / d).mkdir(parents=True, exist_ok=True)
    img.save(FINAL / "png" / f"{name}.png")
    img.save(FINAL / "jpg" / f"{name}.jpg", quality=90, progressive=True, optimize=True, subsampling=0)
    print(FINAL / "jpg" / f"{name}.jpg")


def main():
    WORK.mkdir(exist_ok=True)
    c, cid = sys.argv[1], sys.argv[2]
    n = int(sys.argv[3]) if len(sys.argv) > 3 and sys.argv[3].isdigit() else 2
    if c == "guide":
        print(make_guide(cid))
    elif c == "off":
        g = make_guide(cid)
        units = json.load(open(WORK / f"guide_{cid}.json"))["units"]
        run(f"{cid}_off", cid, off_prompt(cid, units), [g, HERO, REAR, v2.SHADOW_REF, v2.REFS / "drawing.png"], n)
    elif c == "on":
        units = json.load(open(WORK / f"guide_{cid}.json"))["units"]
        rep = json.load(open(WORK / f"{cid}_off_check.json"))
        pin_all(cid, Image.open(WORK / f"{cid}_off.png").convert("RGB"), rep).save(WORK / f"{cid}_on_comp.png")
        run(f"{cid}_on", cid, on_prompt(cid, units), [WORK / f"{cid}_on_comp.png"], n)
    elif c == "accept":
        state, f = sys.argv[3], Path(sys.argv[4])
        rep = check(cid, f)
        img = Image.open(f).convert("RGB")
        has_on = any(u[3] not in (None, "off") for u in COMPS[cid]["units"])
        if state == "off":
            img.save(WORK / f"{cid}_off.png"); json.dump(rep, open(WORK / f"{cid}_off_check.json", "w"), indent=1)
            if not has_on:
                export(cid, img)
        else:
            img = pin_all(cid, img, rep)
            img.save(WORK / f"{cid}_on.png"); export(cid, img)
        json.dump({"id": cid, "state": state, "accepted": f.name, "check": rep,
                   "url": Path(str(f) + ".url").read_text() if Path(str(f) + ".url").exists() else None},
                  open(WORK / f"{cid}_{state}_report.json", "w"), indent=1)


if __name__ == "__main__":
    main()
