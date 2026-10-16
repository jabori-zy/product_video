"""Cold Mirror v2 product images: the WHOLE panel front is one mirror (display behind one-way glass, 8 mm black lip).
Every shot comes in a screen-OFF version (final/close/) and, where the front is visible, a screen-ON version (final/open/).

usage:
  python v2.py off <shot> [attempts=2]   guide -> generate -> check against the guide -> work_v2/<shot>_off_try<n>.png
  python v2.py on  <shot> [attempts=2]   screenshot composite on the accepted OFF image -> lighting pass -> real UI re-pinned
  python v2.py accept <shot> <off|on> <file>   export a checked attempt to final (on: re-pins the screenshot first)
  python v2.py check <shot> <file>       print the geometry check of one image

Shot 01 was made by hand with the same steps (work_v2/01_*), and is the material reference for every other shot.
Checks: front views detect the glass outline (inner edge of the black lip) and compare its corners with the guide
(max corner deviation / image height); side and rear views compare the dark bounding box with the guide's.
"""
import json, subprocess, sys, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

sys.path.insert(0, str(Path(__file__).resolve().parent))
import guide as G  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
WORK, FINAL, REFS, ASSETS = ROOT / "work_v2", ROOT / "final", ROOT / "refs", ROOT.parent / "assets"
EDGE = 8                                                   # black lip around the glass (mm)
GLASS = (G.PW - 2 * EDGE, G.PH - 2 * EDGE, G.PT - EDGE)    # w, h, top
DISP = (G.DISP_W, G.DISP_H, G.DISP_TOP)                    # the lit display area behind the glass (680 x 1209)
SHADOW_REF = ASSETS / "product_shadow_reference.png"
HERO = FINAL / "close" / "png" / "01_hero_front-3q_mirror.png"

# scenes are built around a verified studio plate at the same camera (<shot>p): drawn directly, the model stretched the
# panel ~12 % taller in 4 of 4 attempts of 08 (and in 8 of 8 of 09 in v1)
G.SHOTS["08p"] = {k: v for k, v in G.SHOTS["08"].items() if k not in ("scene", "screen")}
# kind: front (glass check) | bbox (side/rear) | detail (07, glass partly out of frame: guide quad is used)
SHOTS = {
    "01b": dict(kind="front", off="01b_hero_black_mirror", on="01b_hero_black_screen-home", screen="home"),
    "02": dict(kind="front", off="02_front_mirror", on="02_front_screen-home", screen="home"),
    "04": dict(kind="front", off="04_front-3q-left_mirror", on="04_front-3q-left_screen-color", screen="color"),
    "05": dict(kind="bbox", off="05_side"),
    "06": dict(kind="bbox", off="06_rear-3q"),
    "07": dict(kind="detail", off="07_detail_camera", on="07_detail_camera_screen-on", screen="home"),
    "08": dict(kind="front", off="08_lifestyle_salon_mirror", on="08_lifestyle_salon_screen-library", screen="library", scene=True,
               plate="08p"),
    "08p": dict(kind="front", intermediate=True),
    "09p": dict(kind="front", intermediate=True),
    "09": dict(kind="front", off="09_salon_scene_mirror", on="09_salon_scene_screen-color", screen="color", scene=True,
               plate="09p"),
}
SCREEN_TEXT = {
    "home": "the white app home screen with glossy black 3D letters N C G H A E, salon tools and a round START button",
    "color": "a hair-colour result: a young woman split by a thin vertical white line, brown hair on the left and "
             "lilac-purple hair on the right, on a light grey app page",
    "library": "the hair-colour library: a grid of hair-colour cards on a light grey app page",
}

# ---------------------------------------------------------------- prompts
GUIDE = ("Image 1 is an exact CAD geometry render of the product from the exact camera of this shot. Reproduce its geometry "
         "EXACTLY, aligned to it pixel for pixel: the same framing, camera angle, perspective, silhouette, proportions and the "
         "position of every part. Do not move, resize, widen, thicken or reshape anything. Only replace the flat CAD shading "
         "with photoreal materials, lighting and shadow.")
MATERIAL = ("Image 2 is the approved photoreal render of this same product: match its materials, its full-front mirror, "
            "the thin black frame lip, the black finish, edge highlights and overall render quality exactly.")
SHADOW = ("Image 3 is the reference for the SHADOW and background only (ignore the phones in it): a light neutral grey "
          "seamless studio, and soft, diffuse, natural shadows on the floor behind and to the side of the objects, darkest "
          "right at the contact line and fading out gradually, with no hard edges.")
DRAWING = ("The last image is the original technical drawing (sizes in mm) for extra detail. Note: in the final product the "
           "WHOLE front is mirror, not the smaller window shown in the drawing.")
PRODUCT = """PRODUCT. A free-standing 55-inch portrait smart mirror, all black hardware.
- Panel: a flat slab 831 mm wide x 1801 mm tall x only 46 mm deep, sharp rectangular edges, perfectly flat and vertical.
- Front: the ENTIRE front face is one piece of mirror glass edge to edge (a one-way mirror with the display hidden behind it). There is NO wide black border and NO black area below the screen: only a very thin satin-black frame lip, about 8 mm, around the outside of the glass.
- Camera: one small round camera lens behind the glass near the LEFT edge, about 40 mm in from the panel edge, 920 mm above the floor: a small glossy black dot with a thin dark grey ring. Nothing else on the front.
- Button: one small flush button on the RIGHT side edge, 1500 mm above the floor. The left side edge is completely plain.
- Feet and base: the panel stands on two short black feet with a 30 mm gap above a low black plinth 600 x 400 x 50 mm with rounded corners. The base is NARROWER than the panel, so the panel overhangs it on both sides; the panel sits near the front of the base and most of the base extends behind it.
- Back: a flat matte black panel back with a tall ladder frame of 40 mm square black tube (two rails, a top bar, two crossbars), a small rectangular service box in the lowest bay, and two straight diagonal braces from the rails down to the rear of the base.
- Colour: frame, edges, back, feet and base are black: matte black powder-coat on base, feet, back frame and braces, satin anodised black on the panel edge. No chrome, no silver, no white, no wood, no logo, no text."""
PRECISION = ("HIGH-PRECISION REQUIREMENT. Official Apple-website-quality product image: a flawless, engineering-accurate, "
             "photoreal CG render. Every edge perfectly straight and parallel, crisp corners. Immaculate surfaces: no dust, "
             "smudges, scratches, warping, noise, grain or AI artefacts. Tack-sharp edges with clean anti-aliasing.")
STUDIO = ("STUDIO AND SHADOW. Apple.com product render style on a seamless light neutral grey background like image 3, no "
          "horizon line, no banding. Soft large key light from the front left and above. The product casts a soft, realistic, "
          "diffuse shadow on the floor as in image 3: a dark, tight contact shadow right under the base, plus a soft cast "
          "shadow spreading away from the light that fades smoothly into the grey. Thin clean highlight lines along the black "
          "edges so the 46 mm depth reads. Long lens, near-orthographic, verticals perfectly vertical, everything in focus. "
          "No people, no text, no props.")
MIRROR = ("Screen OFF: the display is completely invisible and the whole front reads as one clean, uniform, true mirror "
          "reflecting the bright, soft, empty studio as a smooth gradient with one gentle soft lighter band, so it reads as "
          "real reflective glass and not as a flat white or grey panel. No reflected objects, no people, no camera.")

PROMPTS = {
    "01b": ["Image 1 is the approved render of this product. Keep the product EXACTLY as in image 1, pixel for pixel: same "
            "position, size, perspective, proportions, full-front mirror, thin frame lip, camera lens, button, feet and base. "
            "Change only the background, lighting and mirror reflection.", PRODUCT, PRECISION,
            "BLACK STUDIO. Pure black #000000 seamless background, no floor line, no haze, no shadow visible. The black frame, "
            "edges and base are defined only by thin, clean strip-light highlights along the outer panel edges, the top edge, "
            "the side edge and the base edge, Apple black-product style. The mirror front reflects one long soft vertical "
            "gradient from mid grey to dark grey, clearly lighter than the black frame so the panel outline reads crisply. "
            "Screen OFF, the display invisible. Low-key, dramatic, precise."],
    "02": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO, MIRROR,
           "SHOT. Perfectly frontal, symmetrical view like an elevation drawing, camera square to the glass at 1.0 m height. "
           "The base shows below the panel and is narrower than it. The shadow falls softly behind the product and slightly "
           "to the right."],
    "04": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO, MIRROR,
           "SHOT. Camera 30 degrees to the LEFT of the front at chest height, so the left edge and the camera lens are nearest. "
           "The left side edge of the panel is visible as a THIN sliver: the panel is only 46 mm deep, so this edge is exactly "
           "as narrow as in image 1, never a thick slab. It is completely plain (no button); the button is on the right side "
           "edge, hidden from this angle. Key light from the front right here, so the soft floor shadow falls back and to the left."],
    "05": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO,
           "SHOT. Exact side elevation from the right, camera square to the side at 1.0 m height. It shows how slim the 46 mm "
           "panel is, the small flush button on its right edge, the back ladder frame rail just behind the panel, the straight "
           "diagonal brace running down to the rear of the base and the 50 mm base plate extending behind: a narrow A-shaped "
           "silhouette. Rim light outlines every black edge. The soft floor shadow spreads under and behind the base."],
    "06": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO,
           "SHOT. Camera behind the product and 35 degrees to its left, at chest height. It shows the flat matte black back of "
           "the panel, the tall ladder frame of square black tube (two rails, top bar, two crossbars), the small rectangular "
           "service box in the lowest bay, the two diagonal braces down to the rounded black base. Clean and engineered, all "
           "black, no cables. Edge highlights separate the frame tubes from the panel back. The panel side edge visible on the "
           "right of the image is the LEFT side edge and is completely plain. Soft diffuse floor shadow as in image 3."],
    "07": [GUIDE, MATERIAL, PRODUCT, PRECISION,
           "SHOT. Straight-on macro close-up, camera square to the front, of the left part of the panel at 920 mm height, on "
           "a seamless light neutral grey background. From left to right: the light grey background, the crisp black side "
           "edge and the thin satin-black frame lip (about 8 mm), then the mirror glass, with the small camera lens behind "
           "the glass about 40 mm in from the panel edge: glossy dark glass with a fine dark grey ring, a PERFECT CIRCLE exactly "
           "as round as in image 1, never an oval. The rest of the frame is mirror glass reflecting a soft studio gradient; "
           "there is no black border around the lens. Shallow depth of field with the lens tack sharp. Screen OFF."],
    "08p": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO, MIRROR,
            "SHOT. Camera in front of the product and 25 degrees to its right, at eye height; the product fills about 60% of "
            "the frame height, exactly as in image 1. Its right side edge with the small button is visible."],
    "08": ["Image 1 is a finished, approved photo of the product. Keep the product EXACTLY as it is in image 1, pixel for "
           "pixel: same position, size, perspective, proportions, full-front mirror, thin frame lip, feet and base. Do not "
           "redraw, move, resize, stretch or restyle it, and keep the same camera framing. Replace only the plain studio "
           "background around it with the scene described below.",
           "SCENE. A bright, modern, minimal hair salon: white walls, pale oak floor, soft daylight from a large window on the "
           "left, a cream styling chair and a small white side table with a plant to the left of the mirror, nothing in front "
           "of the product. The mirror stands on the floor against the white wall. Screen OFF: the whole front is a true "
           "mirror that reflects the bright salon (soft white walls, window light, a hint of the oak floor at the bottom) with "
           "correct perspective. Calm, premium, photoreal interior photograph with a soft, natural contact shadow under the "
           "base. No people, no text, no logos."],
    "09p": [GUIDE, MATERIAL, SHADOW, PRODUCT, PRECISION, STUDIO, MIRROR,
            "SHOT. Camera 35 degrees to the right of the front at eye height, the product right of centre in a wide 16:9 "
            "frame, exactly as in image 1. Its right side edge with the small button is visible."],
    "09": ["Image 1 is a finished, approved photo of the product in a wide 16:9 frame. Keep the product EXACTLY as it is in "
           "image 1, pixel for pixel: same position, size, perspective, proportions, full-front mirror, thin frame lip, feet "
           "and base. Do not redraw, move, resize or restyle it. Replace only the plain studio background around it with the "
           "scene described below, and add the people and furniture without covering any part of the product.",
           "SCENE. Wide 16:9 interior photograph of a premium, modern hair salon at a styling station. The smart mirror "
           "stands on the floor with the back of its base touching a warm white wall, used as the styling mirror of this "
           "station; a slim wooden console with a few neat hair products runs along the wall beside it. A young woman with "
           "long, wavy chestnut-brown hair, wearing a black styling cape, sits in a cream leather hydraulic styling chair "
           "about one and a half metres in front of the smart mirror, facing it; she is seen from behind and the side, her "
           "face is not shown. A hairdresser in a black apron stands right behind her chair, one hand on the chair back, the "
           "other lifting a lock of her hair. Because the camera is to the side, the woman, the chair and the hairdresser "
           "appear to the LEFT of the smart mirror in the picture and do not overlap any part of it. Screen OFF: the whole "
           "front is a true mirror reflecting the bright salon with correct perspective (the woman is NOT visible in it from "
           "this angle). The panel stands on its two short black feet with a clearly visible gap above the base. Pale oak "
           "floor, soft daylight, other styling stations softly out of focus in the background, a few green plants. "
           "Photoreal interior photography, natural colours, a soft natural contact shadow under the base. No text, no "
           "logos, no brand names."],
}
REF_IMAGES = {  # in prompt order
    "01b": [HERO], "02": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"],
    "04": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"], "05": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"],
    "06": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"], "07": ["guide", HERO, REFS / "drawing.png"],
    "08p": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"], "08": ["plate:08p"], "09p": ["guide", HERO, SHADOW_REF, REFS / "drawing.png"],
    "09": ["plate:09p"],
}


def on_prompt(shot):
    keep = ("the same scene, furniture, people, product position, size, perspective, proportions, thin black frame, camera "
            "lens, feet, base and shadow" if SHOTS[shot].get("scene") else
            "the same product position, size, perspective, proportions, thin black frame, camera lens, button, feet, base, "
            "floor shadow and background")
    return (f"Image 1 is the approved image with the screen turned ON. Keep EVERYTHING EXACTLY as in image 1, pixel for "
            f"pixel: {keep}, and the same app screen content in the same place ({SCREEN_TEXT[SHOTS[shot]['screen']]}). Do not "
            "move, redraw, resize or restyle anything, and do not change any text or UI.\n\n"
            "Make ONLY the screen-on lighting photoreal. The product is a one-way-mirror smart mirror: the display sits "
            "directly behind the mirror glass.\n"
            "- The lit display area glows: emissive, bright, clean and evenly lit, a touch brighter and crisper than the "
            "surroundings, seen through the glass in correct perspective, with a very faint smooth glass reflection over it.\n"
            "- The edge of the display area is clean and straight, with no visible seam, frame line or bezel: the light simply "
            "ends where the screen ends, behind the same continuous glass.\n"
            "- Everywhere outside the display area (the margin above and beside it and the large area below it) the front "
            "STAYS a true mirror, exactly as in image 1: the same reflections, not lit, not black, not matte. Only a very "
            "subtle soft light spill from the screen at its immediate border.\n"
            "Photoreal, tack sharp, no noise, no banding, no AI artefacts. No text added.")


# ---------------------------------------------------------------- geometry
def cam(shot):
    return G.Cam(**G.SHOTS[shot])


def quad3d(w, h, top):
    return np.array([[-w / 2, top, 0], [w / 2, top, 0], [w / 2, top - h, 0], [-w / 2, top - h, 0]], float)


def make_guide(shot):
    G.OUT = WORK
    G.DISP_W, G.DISP_H, G.DISP_TOP = GLASS
    scr = G.SHOTS[shot].pop("screen", None)            # OFF guides: plain glass, no screenshot in it
    try:
        G.render(shot)
    finally:
        G.DISP_W, G.DISP_H, G.DISP_TOP = DISP
        if scr:
            G.SHOTS[shot]["screen"] = scr
    return WORK / f"guide_{shot}.png"


def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y, -u], [0, 0, 0, x, y, 1, -v * x, -v * y, -v]]
    h = np.linalg.svd(np.array(A, float))[2][-1]
    return (h / h[-1]).reshape(3, 3)


def apply(H, p):
    q = np.c_[np.asarray(p, float), np.ones(len(p))] @ H.T
    return q[:, :2] / q[:, 2:]


def detect_glass(img, g):
    """Glass outline = inner edge of the black lip. For each edge of the guide's glass quad g (TL TR BR BL), walk from
    40 px inside outward along the normal and take the strongest bright->dark drop; fit a line (one outlier pass)."""
    L = np.asarray(img.convert("L")).astype(float)
    H, W = L.shape
    c = g.mean(0)
    lines = []
    for i in range(4):
        p, q = g[i], g[(i + 1) % 4]
        d = (q - p) / np.linalg.norm(q - p); n = np.array([-d[1], d[0]])
        if n @ (c - p) < 0:
            n = -n                                                 # inward normal
        pts = []
        for t in np.linspace(0.08, 0.92, 70):
            s = p + t * (q - p)
            prof_xy = s[None] + n[None] * np.arange(40, -41, -1)[:, None]      # inside -> outside
            xi, yi = prof_xy[:, 0].round().astype(int), prof_xy[:, 1].round().astype(int)
            if xi.min() < 0 or yi.min() < 0 or xi.max() >= W or yi.max() >= H:
                continue
            prof = np.convolve(L[yi, xi], np.ones(3) / 3, "same")
            drop = prof[:-2] - prof[2:]
            k = int(np.argmax(drop[2:-2])) + 3
            if drop[k - 1] > 25:
                pts.append(prof_xy[k])
        if len(pts) < 12:
            return None
        pts = np.array(pts)
        for rnd in range(2):                                       # PCA line fit, drop outliers, refit
            m = pts.mean(0)
            nn = np.linalg.svd(pts - m)[2][-1]                     # normal = least-variance direction
            off = -nn @ m
            if rnd == 0:
                r = np.abs(pts @ nn + off)
                pts = pts[r <= max(3.0, np.percentile(r, 80))]
        lines.append((nn, off))
    quad = []
    for i in range(4):
        (a, b), (e, f) = lines[(i - 1) % 4], lines[i]
        quad.append(np.linalg.solve(np.array([a, e]), -np.array([b, f])))
    return np.array(quad)


def check(shot, path):
    img = Image.open(path).convert("RGB")
    kind = SHOTS[shot]["kind"]
    if kind == "bbox":
        gd = np.asarray(Image.open(WORK / f"guide_{shot}.png").convert("L")) < 120
        rd = np.asarray(img.convert("L")) < 90
        bb = lambda m: (lambda ys, xs: np.array([xs.min(), ys.min(), xs.max(), ys.max()], float))(*np.nonzero(m))
        a, b = bb(gd), bb(rd)
        asp = lambda x: (x[2] - x[0]) / (x[3] - x[1])
        return dict(shot=shot, file=str(path), bbox_guide=a.tolist(), bbox=b.tolist(),
                    aspect_error=round(abs(asp(b) / asp(a) - 1), 4), max_shift_px=float(np.abs(a - b).max()),
                    ok=bool(abs(asp(b) / asp(a) - 1) <= 0.03 and np.abs(a - b).max() <= 0.02 * img.height))
    C = cam(SHOTS[shot].get("plate", shot))
    g = C(quad3d(*GLASS))
    if kind == "detail":
        return dict(shot=shot, file=str(path), glass=g.round(1).tolist(), glass_guide=g.round(1).tolist(), ok=True,
                    note="glass partly out of frame: guide quad used, check visually")
    det = detect_glass(img, g)
    if det is None:
        return dict(shot=shot, file=str(path), ok=False, error="glass outline not found")
    dev = float(np.abs(det - g).max())
    return dict(shot=shot, file=str(path), glass_guide=g.round(1).tolist(), glass=det.round(1).tolist(),
                max_corner_dev_px=round(dev, 1), dev=round(dev / img.height, 4), ok=dev / img.height <= 0.01)


def display_quad(shot, rep):
    C = cam(SHOTS[shot].get("plate", shot))
    Hm = homography(C(quad3d(*GLASS)), np.array(rep["glass"]))
    return apply(Hm, C(quad3d(*DISP)))


# ---------------------------------------------------------------- compositing
REFLECT, GROW = 0.07, 2


def coeffs(dst, src):
    A, b = [], []
    for (x, y), (u, v) in zip(dst, src):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]; b += [u, v]
    return np.linalg.lstsq(np.array(A, float), np.array(b, float), rcond=None)[0].tolist()


def pin_screen(img, quad, screen):
    """Corner-pin the real screenshot into quad; REFLECT of the glass reflection stays on top; edge-padded source and a
    2 px grown mask so no dark seam shows at the screen border."""
    scr = Image.open(REFS / f"screen_{screen}.png").convert("RGB")
    w, h = scr.size; pad = 16
    padded = Image.fromarray(np.pad(np.asarray(scr), ((pad, pad), (pad, pad), (0, 0)), mode="edge"))
    src = [(pad, pad), (w + pad, pad), (w + pad, h + pad), (pad, h + pad)]
    warped = padded.transform(img.size, Image.PERSPECTIVE, coeffs([tuple(p) for p in quad], src), Image.BICUBIC)
    ss = 4
    m = Image.new("L", (img.width * ss, img.height * ss), 0)
    ImageDraw.Draw(m).polygon([(x * ss, y * ss) for x, y in quad], fill=255)
    m = m.resize(img.size, Image.LANCZOS).filter(ImageFilter.MaxFilter(GROW * 2 + 1)).filter(ImageFilter.GaussianBlur(0.8))
    a = np.asarray(img).astype(float); s = np.asarray(warped).astype(float)
    k = np.asarray(m).astype(float)[..., None] / 255
    res = a * (1 - k) + (s * (1 - REFLECT) + a * REFLECT) * k
    return Image.fromarray(np.clip(res, 0, 255).round().astype(np.uint8))


# ---------------------------------------------------------------- generation
def gen(prompt, images, aspect, out):
    cmd = ["higgsfield", "generate", "create", "gpt_image_2_5", "--prompt", prompt]
    for im in images:
        cmd += ["--image", str(im)]
    cmd += ["--aspect_ratio", aspect, "--resolution", "4k", "--quality", "high", "--background", "opaque",
            "--variant", "sunburst", "--wait", "--wait-timeout", "20m"]
    for attempt in range(3):                               # the API sometimes drops a request: retry those
        r = subprocess.run(cmd, capture_output=True, text=True)
        url = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else ""
        if url.startswith("http"):
            urllib.request.urlretrieve(url, out)
            Path(str(out) + ".url").write_text(url)
            to_spec(out, aspect)
            return out
        err = (r.stdout + r.stderr)[-300:]
    print(json.dumps({"out": str(out), "error": err}), flush=True)
    return None


def to_spec(path, aspect):
    """The model returns e.g. 2480x3312 for 3:4 and 2880x2880 for 1:1: scale to the spec size (= the guide's)."""
    im = Image.open(path)
    if im.size != G.SIZE[aspect]:
        im.convert("RGB").resize(G.SIZE[aspect], Image.LANCZOS).save(path)


def next_tags(prefix, n):
    k = len(list(WORK.glob(f"{prefix}_try*.png")))
    return [WORK / f"{prefix}_try{k + i + 1}.png" for i in range(n)]


def ref_paths(shot):
    out = []
    for r in REF_IMAGES[shot]:
        if r == "guide":
            out.append(make_guide(shot))
        elif str(r).startswith("plate:"):
            out.append(WORK / f"{r.split(':')[1]}_off.png")
        else:
            out.append(r)
    return out


def run(prefix, prompt, images, aspect, n, shot):
    (WORK / f"{prefix}_prompt.txt").write_text(prompt)
    outs = next_tags(prefix, n)
    with ThreadPoolExecutor(n) as ex:
        res = list(ex.map(lambda o: gen(prompt, images, aspect, o), outs))
    for p in res:
        if p:
            rep = check(shot, p)
            json.dump(rep, open(str(p).replace(".png", "_check.json"), "w"), indent=1)
            print(json.dumps({k: rep.get(k) for k in ("file", "max_corner_dev_px", "dev", "aspect_error", "max_shift_px", "ok", "error")}), flush=True)


def aspect(shot):
    return G.SHOTS[SHOTS[shot].get("plate", shot)]["aspect"]


def cmd_off(shot, n):
    if SHOTS[shot].get("plate"):
        make_guide(SHOTS[shot]["plate"])
    imgs = ref_paths(shot)
    if shot == "01b":
        make_guide("01")
    run(f"{shot}_off", "\n\n".join(PROMPTS[shot] + ([DRAWING] if REF_IMAGES[shot][-1] == REFS / "drawing.png" else [])),
        imgs, aspect(shot), n, shot if shot != "01b" else "01b")


def cmd_on(shot, n):
    off = WORK / f"{shot}_off.png"
    rep = json.load(open(WORK / f"{shot}_off_check.json"))
    comp = pin_screen(Image.open(off).convert("RGB"), display_quad(shot, rep), SHOTS[shot]["screen"])
    comp.save(WORK / f"{shot}_on_comp.png")
    run(f"{shot}_on", on_prompt(shot), [WORK / f"{shot}_on_comp.png"], aspect(shot), n, shot)


def export(img, name, sub=""):
    for d in ("png", "jpg"):
        (FINAL / sub / d).mkdir(parents=True, exist_ok=True)
    img.save(FINAL / sub / "png" / f"{name}.png")
    img.save(FINAL / sub / "jpg" / f"{name}.jpg", quality=90, progressive=True, optimize=True, subsampling=0)
    print(FINAL / sub / "jpg" / f"{name}.jpg")


def cmd_accept(shot, state, f):
    f = Path(f)
    rep = check(shot, f)
    img = Image.open(f).convert("RGB")
    if state == "off":
        img.save(WORK / f"{shot}_off.png")
        json.dump(rep, open(WORK / f"{shot}_off_check.json", "w"), indent=1)
        if not SHOTS[shot].get("intermediate"):
            export(img, SHOTS[shot]["off"], "close")
    else:
        if rep.get("glass") is None:
            raise SystemExit(f"no glass outline on {f}: {rep}")
        img = pin_screen(img, display_quad(shot, rep), SHOTS[shot]["screen"])
        img.save(WORK / f"{shot}_on.png")
        export(img, SHOTS[shot]["on"], "open")
    json.dump({"shot": shot, "state": state, "accepted": str(f.name), "check": rep,
               "url": Path(str(f) + ".url").read_text() if Path(str(f) + ".url").exists() else None},
              open(WORK / f"{shot}_{state}_report.json", "w"), indent=1)


if __name__ == "__main__":
    WORK.mkdir(exist_ok=True)
    c, shot = sys.argv[1], sys.argv[2]
    if c == "off":
        cmd_off(shot, int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif c == "on":
        cmd_on(shot, int(sys.argv[3]) if len(sys.argv) > 3 else 2)
    elif c == "accept":
        cmd_accept(shot, sys.argv[3], sys.argv[4])
    elif c == "check":
        print(json.dumps(check(shot, Path(sys.argv[3])), indent=1))
