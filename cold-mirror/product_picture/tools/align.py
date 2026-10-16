"""Register a generated render to its exact geometry guide, correct it and report the error.

usage: python align.py <shot> <render.png>
writes work/<shot>_aligned.png, work/<shot>_qa_overlay.png and prints a JSON report.

The same feature detector runs on the guide and on the render, so detector bias cancels.
  front  : panel outer edge, top edge, bottom edge + the 4 mirror-window corners -> homography
  window : the 4 mirror-window corners only (product on a black background) -> homography
  bbox   : bounding box of the black product -> per-axis scale + offset (side / rear views)
  lens   : panel outer edge, window edge and the camera lens (close-up) -> similarity
"pre_error" is how far the raw render is from the guide after the best similarity fit (its true
proportion error); "post_error" is measured again on the corrected image. "dark_iou" compares the black
product silhouettes outside a 4 px band along the guide's edges (window excluded on screen-on shots).
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guide import SHOTS, SIZE  # noqa: E402

WORK = Path(__file__).resolve().parent.parent / "work"
DARK, LIGHT = 100, 100


def lum(img):
    return np.asarray(img.convert("RGB")).astype(float).mean(-1)


def fit_line(pts, what):
    """v = a*u + b from [(u, v)], robust (two passes, drop outliers)."""
    if len(pts) < 5:
        raise RuntimeError(f"too few points on the {what} ({len(pts)})")
    us, vs = np.asarray(pts, float).T
    a, b = np.polyfit(us, vs, 1)
    r = np.abs(vs - (a * us + b)); keep = r <= max(2.0, np.percentile(r, 80))
    return np.polyfit(us[keep], vs[keep], 1)


def first(v, cond):
    """Index of the first sample meeting cond. A hit on the very first sample means the edge lies at or
    beyond the start of the search window, so it is reported as not found instead of as a fake edge."""
    idx = np.flatnonzero(cond(v))
    return int(idx[0]) if len(idx) and idx[0] > 0 else None


def front_points(L, g, side, with_panel=True, light=LIGHT):
    """g: approximate feature positions (from the guide json, already in this image's pixels)."""
    H, W = L.shape
    wl, wr = g["win_l"], g["win_r"]; wt, wb = g["win_t"], g["win_b"]
    bw = abs(g["outer_x"] - (wl if side == "L" else wr))          # border width in px
    pad = 0.45 * bw
    rows = np.linspace(wt + 0.15 * (wb - wt), wb - 0.15 * (wb - wt), 60).astype(int)
    cols = np.linspace(wl + 0.15 * (wr - wl), wr - 0.15 * (wr - wl), 60).astype(int)
    lx, rx, ty, by = [], [], [], []
    for y in rows:
        y0 = int(np.interp(y, [wt, wb], [g["win_tl"][0], g["win_bl"][0]]))
        y1 = int(np.interp(y, [wt, wb], [g["win_tr"][0], g["win_br"][0]]))
        a = first(L[y, int(y0 - pad):int(y0 + pad)], lambda v: v > light)
        b = first(L[y, int(y1 - pad):int(y1 + pad)][::-1], lambda v: v > light)
        if a is not None: lx.append((y, y0 - pad + a))
        if b is not None: rx.append((y, y1 + pad - b - 1))
    for x in cols:
        t0 = int(np.interp(x, [wl, wr], [g["win_tl"][1], g["win_tr"][1]]))
        b0 = int(np.interp(x, [wl, wr], [g["win_bl"][1], g["win_br"][1]]))
        a = first(L[int(t0 - pad):int(t0 + pad), x], lambda v: v > light)
        b = first(L[int(b0 - pad):int(b0 + pad), x][::-1], lambda v: v > light)
        if a is not None: ty.append((x, t0 - pad + a))
        if b is not None: by.append((x, b0 + pad - b - 1))
    Lw = fit_line(lx, "window left edge"); Rw = fit_line(rx, "window right edge")
    Tw = fit_line(ty, "window top edge"); Bw = fit_line(by, "window bottom edge")

    def meet(vline, hline):                       # vline: x = a*y+b ; hline: y = c*x+d
        a, b = vline; c, d = hline
        y = (c * b + d) / (1 - c * a); return [a * y + b, y]
    pts = {"win_TL": meet(Lw, Tw), "win_TR": meet(Rw, Tw), "win_BR": meet(Rw, Bw), "win_BL": meet(Lw, Bw)}
    if not with_panel:
        return pts
    # panel outer edge: scan from the background inwards
    ox = g["outer_x"]; step = 1 if side == "L" else -1
    ex = []
    for y in rows:
        x0 = int(ox - step * pad)
        seg = L[y, x0:int(ox + step * pad):step] if step == 1 else L[y, int(ox - step * pad):int(ox + step * pad):-1]
        a = first(seg, lambda v: v < DARK)
        if a is not None: ex.append((y, x0 + step * a))
    E = fit_line(ex, "panel outer edge")
    # panel top edge across the window columns, scanning down from above
    tp = []
    for x in cols:
        t = int(np.interp(x, [wl, wr], [g["top_l"], g["top_r"]]))
        a = first(L[int(t - pad):int(t + pad), x], lambda v: v < DARK)
        if a is not None: tp.append((x, t - pad + a))
    T = fit_line(tp, "panel top edge")
    # panel bottom edge just inside the outer edge (left of the feet and the base), scanning up
    bp = []
    pw = abs(wr - wl) / 0.82
    for f in np.linspace(0.015, 0.06, 12):
        x = int(ox + step * f * pw)
        b0 = int(g["bot_outer"])
        seg = L[int(b0 - pad):int(b0 + pad), x][::-1]
        a = first(seg, lambda v: v < DARK)
        if a is not None: bp.append((x, b0 + pad - a - 1))
    if len(bp) < 3:
        raise RuntimeError(f"panel bottom edge not found ({len(bp)} points)")
    B = fit_line(bp, "panel bottom edge") if len(bp) >= 5 else (0.0, float(np.median([p[1] for p in bp])))
    pts["outer_top"] = meet(E, T); pts["outer_bot"] = meet(E, B)
    return pts


def approx(gj, side, sx=1.0, sy=1.0):
    P = {k: np.array(v) * (sx, sy) for k, v in gj["points"].items()}
    o = "L" if side == "L" else "R"
    TL, TR, BL, BR = P["window_TL"], P["window_TR"], P["window_BL"], P["window_BR"]
    pt = P["panel_front_TL"] if o == "L" else P["panel_front_TR"]
    pb = P["panel_front_BL"] if o == "L" else P["panel_front_BR"]
    return dict(win_l=min(TL[0], BL[0]), win_r=max(TR[0], BR[0]), win_t=min(TL[1], TR[1]), win_b=max(BL[1], BR[1]),
                win_tl=TL, win_tr=TR, win_bl=BL, win_br=BR, outer_x=pt[0],
                top_l=P["panel_front_TL"][1], top_r=P["panel_front_TR"][1], bot_outer=pb[1])


def window_box(L, thr, aspect, near):
    """Bounding box of the mirror window: the largest enclosed, mostly filled region brighter than thr
    whose height/width is close to the guide's, nearest to `near` (x, y)."""
    lab, n = ndimage.label(L > thr)
    H, W = L.shape
    best = None
    for i, sl in enumerate(ndimage.find_objects(lab), 1):
        y0, y1, x0, x1 = sl[0].start, sl[0].stop, sl[1].start, sl[1].stop
        if y0 == 0 or x0 == 0 or y1 == H or x1 == W:
            continue                                            # the background touches the frame edge
        w, h = x1 - x0, y1 - y0
        if w < W * 0.08 or abs((h / w) / aspect - 1) > 0.3:
            continue
        if (lab[sl] == i).mean() < 0.6:
            continue                                            # a thin ring (edge highlight), not a filled window
        d = np.hypot((x0 + x1) / 2 - near[0], (y0 + y1) / 2 - near[1]) / W
        score = w * h * (1 - min(d, 0.9))
        if best is None or score > best[0]:
            best = (score, np.array([x0, y0, x1, y1], float))
    if best is None:
        raise RuntimeError("mirror window not found")
    return best[1]


def map_approx(a, gb, rb):
    """Move approximate guide positions into the render using the two window boxes."""
    sx, sy = (rb[2] - rb[0]) / (gb[2] - gb[0]), (rb[3] - rb[1]) / (gb[3] - gb[1])
    fx = lambda x: rb[0] + (x - gb[0]) * sx
    fy = lambda y: rb[1] + (y - gb[1]) * sy
    out = {}
    for k, v in a.items():
        if isinstance(v, np.ndarray):
            out[k] = np.array([fx(v[0]), fy(v[1])])
        elif k in ("win_l", "win_r", "outer_x"):
            out[k] = fx(v)
        else:
            out[k] = fy(v)
    return out


def _normaliser(p):
    """Hartley normalisation: centre the points and scale them to mean distance sqrt(2)."""
    c = p.mean(0); d = np.sqrt(((p - c) ** 2).sum(1)).mean()
    k = np.sqrt(2) / d
    return np.array([[k, 0, -k * c[0]], [0, k, -k * c[1]], [0, 0, 1]])


def homography(src, dst):
    """Normalised DLT (without the normalisation the fit is unstable away from the points)."""
    src, dst = np.asarray(src, float), np.asarray(dst, float)
    Ts, Td = _normaliser(src), _normaliser(dst)
    s = apply_h(Ts, src); d = apply_h(Td, dst)
    A = []
    for (x, y), (u, v) in zip(s, d):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y, -u], [0, 0, 0, x, y, 1, -v * x, -v * y, -v]]
    Hn = np.linalg.svd(np.array(A, float))[2][-1].reshape(3, 3)
    Hm = np.linalg.inv(Td) @ Hn @ Ts
    return Hm / Hm[2, 2]


def apply_h(Hm, p):
    p = np.c_[np.asarray(p, float), np.ones(len(p))] @ Hm.T
    return p[:, :2] / p[:, 2:]


def similarity_error(src, dst, scale_ref):
    """Fit dst ~ s*R*src + t (no shear/perspective); max residual as a fraction of scale_ref."""
    src, dst = np.asarray(src, float), np.asarray(dst, float)
    ms, md = src.mean(0), dst.mean(0); a, b = src - ms, dst - md
    U, S, Vt = np.linalg.svd(a.T @ b); R = (U @ Vt).T
    s = S.sum() / (a ** 2).sum()
    res = np.linalg.norm(b - s * a @ R.T, axis=1)
    return float(res.max() / scale_ref)


def warp(render, gsize, src_pts, dst_pts, fill_edge):
    """Resample render so src_pts land on dst_pts in a canvas of gsize."""
    pad = 400
    arr = np.asarray(render.convert("RGB"))
    bg = tuple(int(c) for c in np.median(np.concatenate([arr[:20].reshape(-1, 3), arr[:, :20].reshape(-1, 3)]), 0))
    if fill_edge:      # a scene: extend its own edge pixels
        arr = np.pad(arr, ((pad, pad), (pad, pad), (0, 0)), mode="edge")
    else:              # a flat studio background: extend the background tone
        arr = np.pad(arr, ((pad, pad), (pad, pad), (0, 0)), mode="constant")
        arr[:pad] = bg; arr[-pad:] = bg; arr[:, :pad] = bg; arr[:, -pad:] = bg
    big = Image.fromarray(arr)
    src = np.asarray(src_pts, float) + pad
    Hi = homography(np.asarray(dst_pts, float), src)          # output -> input, as PIL wants
    co = (Hi / Hi[2, 2]).ravel()[:8].tolist()
    return big.transform(gsize, Image.PERSPECTIVE, co, Image.BICUBIC, fillcolor=bg)


def lens_points(L, outer_x, win_x, lens):
    """Close-up: panel outer edge and window edge at the lens row, and the lens centre."""
    bw = win_x - outer_x
    pad = 0.5 * abs(bw)
    lx, ly = lens
    ys = np.linspace(ly - 2 * abs(bw), ly + 2 * abs(bw), 41).astype(int)
    ys = ys[(ys > 0) & (ys < L.shape[0])]
    oe, we = [], []
    for y in ys:
        a = first(L[y, int(outer_x - pad):int(outer_x + pad)], lambda v: v < DARK)
        b = first(L[y, int(win_x - pad):int(win_x + pad)], lambda v: v > LIGHT)
        if a is not None: oe.append((y, outer_x - pad + a))
        if b is not None: we.append((y, win_x - pad + b))
    O = fit_line(oe, "panel outer edge"); Wl = fit_line(we, "window edge")
    # lens: pixels in the border that differ from the border's own tone
    x0, x1 = int(np.polyval(O, ly) + 0.12 * bw), int(np.polyval(Wl, ly) - 0.12 * bw)
    y0, y1 = int(ly - 1.5 * abs(bw)), int(ly + 1.5 * abs(bw))
    band = L[y0:y1, x0:x1]
    m = np.abs(band - np.median(band)) > 25
    lab, n = ndimage.label(m)
    if not n:
        raise RuntimeError("camera lens not found")
    sizes = ndimage.sum(m, lab, range(1, n + 1))
    k = int(np.argmax(sizes)) + 1
    cy, cx = ndimage.center_of_mass(m, lab, k)
    ys_, xs_ = np.nonzero(ndimage.binary_fill_holes(lab == k))
    roundness = (np.ptp(xs_) + 1) / (np.ptp(ys_) + 1)          # width / height of the lens ring, 1 = circle
    cx, cy = cx + x0, cy + y0
    return {"outer": [float(np.polyval(O, cy)), cy], "window": [float(np.polyval(Wl, cy)), cy], "lens": [cx, cy],
            "roundness": float(roundness)}


def similarity(src, dst):
    src, dst = np.asarray(src, float), np.asarray(dst, float)
    ms, md = src.mean(0), dst.mean(0); a, b = src - ms, dst - md
    U, S, Vt = np.linalg.svd(a.T @ b); R = (U @ Vt).T
    s = S.sum() / (a ** 2).sum()
    return lambda p: (np.asarray(p, float) - ms) @ (s * R).T + md


def framed_scene(shot, rimg, Rr, G, s, gj, Lg, side, thr):
    """Scenes keep the render's own framing and room. The shape correction (homography relative to the
    best similarity) is fitted to points on the panel's front plane, so it is applied only over the panel
    (front face plus its side edge, feathered by a few px) where it is valid; the base and the room are
    left exactly as rendered. The result is measured again on this delivered image. A render whose size is
    not the spec size is centre-cropped to the exact aspect and resized. Writes work/<shot>_framed.png."""
    from PIL import ImageFilter
    W, H = rimg.size
    Rr = np.asarray(Rr, float)
    finv = similarity(G, Rr / s)                              # guide -> render (guide scale)
    Gr = finv(G) * s                                          # where the points belong in the render frame
    corrected = warp(rimg, rimg.size, Rr, Gr, fill_edge=True)
    Hc = homography(Rr, Gr)
    P = gj["points"]
    hw = abs(P["panel_front_TR"][0] - P["panel_front_TL"][0])
    pad = 0.02 * hw                                           # the panel face, its 46 mm side edge and a margin
    q = np.array([P["panel_front_TL"], P["panel_front_TR"], P["panel_front_BR"], P["panel_front_BL"]], float)
    q = q + np.array([[-1, -1], [1, -1], [1, 1], [-1, 1]]) * pad + np.array([[-1, 0], [1, 0], [1, 0], [-1, 0]]) * 0.06 * hw
    box = finv(q) * s
    shift = float(np.abs(apply_h(Hc, box) - box).max())      # how far pixels move at the mask edge
    mask = Image.new("L", rimg.size, 0); ImageDraw.Draw(mask).polygon([tuple(v) for v in box], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(3))
    out = Image.composite(corrected, rimg, mask)
    # measure the delivered image: same detector, approximate positions from the guide via finv
    ag = approx(gj, side)
    gb = window_box(Lg, 110, (ag["win_b"] - ag["win_t"]) / (ag["win_r"] - ag["win_l"]),
                    ((ag["win_l"] + ag["win_r"]) / 2, (ag["win_t"] + ag["win_b"]) / 2))
    rb = np.r_[finv(gb[:2][None])[0], finv(gb[2:][None])[0]] * np.r_[s, s]
    pc = front_points(lum(out), map_approx(ag, gb, rb), side, True, light=thr)
    keys = sorted(pc)
    err = np.linalg.norm(np.array([pc[k] for k in keys]) - Gr, axis=1).max()
    fw, fh = SIZE[SHOTS[shot]["aspect"]]
    k = min(W / fw, H / fh); cw, ch = round(fw * k), round(fh * k)
    cx0, cy0 = (W - cw) // 2, (H - ch) // 2
    out = out.crop((cx0, cy0, cx0 + cw, cy0 + ch)).resize((fw, fh), Image.LANCZOS)
    out.save(WORK / f"{shot}_framed.png")
    quad = finv(np.array([P[k] for k in ("window_TL", "window_TR", "window_BR", "window_BL")])) * s
    quad = (quad - (cx0, cy0)) * (fw / cw)
    panel_px = abs(Gr[keys.index("outer_bot")][1] - Gr[keys.index("outer_top")][1])
    gw, gh = Lg.shape[1], Lg.shape[0]                         # guide frame -> delivered frame (similarity + crop)
    corners = np.array([[0, 0], [gw, 0], [gw, gh], [0, gh]], float)
    mapped = (finv(corners) * s - (cx0, cy0)) * (fw / cw)
    g2f = homography(corners, mapped)
    return {"guide_to_final": (g2f / g2f[2, 2]).round(8).tolist(),"scene_mask_shift_px": round(shift, 1), "scene_post_error_px": round(float(err), 2),
            "scene_post_error": round(float(err / panel_px), 4), "window_quad_final": quad.round(2).tolist()}


def bbox_dark(L, roi):
    x0, y0, x1, y1 = roi
    m = L[y0:y1, x0:x1] < DARK
    ys, xs = np.nonzero(m)
    return np.array([xs.min() + x0, ys.min() + y0, xs.max() + x0, ys.max() + y0], float), m


def main():
    shot, rpath = sys.argv[1], sys.argv[2]
    cfg = SHOTS[shot]
    mode = cfg["align"]
    gimg = Image.open(WORK / f"guide_{shot}.png"); gj = json.load(open(WORK / f"guide_{shot}.json"))
    rimg = Image.open(rpath).convert("RGB")
    Lg, Lr = lum(gimg), lum(rimg)
    sx, sy = rimg.width / gimg.width, rimg.height / gimg.height
    side = "R" if cfg["yaw"] < 0 else "L"
    rep = dict(shot=shot, mode=mode, render=str(rpath), render_size=rimg.size, guide_size=gimg.size)
    panel_h = abs(gj["points"]["panel_front_BL"][1] - gj["points"]["panel_front_TL"][1])

    if mode in ("front", "window"):
        ag = approx(gj, side)
        thr = 45 if mode == "window" else 110
        asp = (ag["win_b"] - ag["win_t"]) / (ag["win_r"] - ag["win_l"])
        gb = window_box(Lg, 110, asp, ((ag["win_l"] + ag["win_r"]) / 2, (ag["win_t"] + ag["win_b"]) / 2))
        rb = window_box(Lr, thr, asp, ((ag["win_l"] + ag["win_r"]) / 2 * sx, (ag["win_t"] + ag["win_b"]) / 2 * sy))
        pg = front_points(Lg, ag, side, mode == "front")
        pr = front_points(Lr, map_approx(ag, gb, rb), side, mode == "front", light=thr)
        keys = sorted(pg)
        G = np.array([pg[k] for k in keys]); R_ = np.array([pr[k] for k in keys]) / (sx, sy)
        scale_ref = panel_h if mode == "front" else abs(pg["win_BL"][1] - pg["win_TL"][1])
        rep["pre_error"] = round(similarity_error(R_, G, scale_ref), 4)
        out = warp(rimg, gimg.size, R_ * (sx, sy), G, fill_edge=bool(cfg.get("scene")))
        pc = front_points(lum(out), approx(gj, side), side, mode == "front", light=thr)
        C = np.array([pc[k] for k in keys])
        rep["post_error_px"] = round(float(np.linalg.norm(C - G, axis=1).max()), 2)
        rep["post_error"] = round(float(np.linalg.norm(C - G, axis=1).max() / scale_ref), 4)
        rep["points_guide"] = {k: [round(v, 1) for v in pg[k]] for k in keys}
        if cfg.get("scene"):
            rep.update(framed_scene(shot, rimg, R_ * (sx, sy), G, (sx, sy), gj, Lg, side, thr))
    elif mode == "bbox":
        H, W = Lg.shape
        bg_, _ = bbox_dark(Lg, (0, 0, W, H))
        m = 0.08
        roi = [int(max(0, (bg_[0] - m * W) * sx)), int(max(0, (bg_[1] - m * H) * sy)),
               int(min(rimg.width, (bg_[2] + m * W) * sx)), int(min(rimg.height, (bg_[3] + m * H) * sy))]
        br, _ = bbox_dark(Lr, roi)
        src = [(br[0], br[1]), (br[2], br[1]), (br[2], br[3]), (br[0], br[3])]
        dst = [(bg_[0], bg_[1]), (bg_[2], bg_[1]), (bg_[2], bg_[3]), (bg_[0], bg_[3])]
        gw, gh = bg_[2] - bg_[0], bg_[3] - bg_[1]; rw, rh = br[2] - br[0], br[3] - br[1]
        rep["pre_error"] = round(abs((rw / rh) / (gw / gh) - 1), 4)          # aspect of the product's box
        out = warp(rimg, gimg.size, src, dst, fill_edge=False)
        bc, _ = bbox_dark(lum(out), (0, 0, W, H))
        rep["post_error_px"] = round(float(np.abs(bc - bg_).max()), 2)
        rep["post_error"] = round(float(np.abs(bc - bg_).max() / max(gw, gh)), 4)
    elif mode == "lens":
        P = gj["points"]
        outer_x, lens = P["panel_front_TL"][0], P["camera"]
        win_x = P["window_TL"][0]
        pg = lens_points(Lg, outer_x, win_x, lens)
        pr = lens_points(Lr, outer_x * sx, win_x * sx, (lens[0] * sx, lens[1] * sy))
        ratio = lambda p: (p["lens"][0] - p["outer"][0]) / (p["window"][0] - p["outer"][0])
        rep["lens_in_border"] = [round(ratio(pg), 4), round(ratio(pr), 4)]
        rep["pre_error"] = round(abs(ratio(pr) - ratio(pg)), 4)              # lens position across the border
        rep["lens_roundness"] = [round(pg["roundness"], 3), round(pr["roundness"], 3)]
        keys = ("outer", "window", "lens")
        f = similarity([pr[k] for k in keys], [pg[k] for k in keys])
        corners = [(0, 0), (rimg.width, 0), (rimg.width, rimg.height), (0, rimg.height)]
        out = warp(rimg, gimg.size, corners, f(corners), fill_edge=True)
        pc = lens_points(lum(out), outer_x, win_x, lens)
        rep["lens_roundness_final"] = round(pc["roundness"], 3)
        err = max(np.hypot(*(np.array(pc[k]) - pg[k])) for k in keys)
        bw = pg["window"][0] - pg["outer"][0]
        rep["post_error_px"] = round(float(err), 2)
        rep["post_error"] = round(float(err / bw), 4)                         # relative to the border width
    else:
        raise SystemExit(f"unknown align mode {mode}")

    out.save(WORK / f"{shot}_aligned.png")
    # silhouette IoU on the dark product (all shots) and an overlay of the guide's outline
    Lo = lum(out)
    mg, mo = Lg < DARK, Lo < DARK
    if cfg.get("screen"):        # the app screen has its own dark pixels; score the hardware only
        P = gj["points"]
        m = Image.new("1", gimg.size, 0)
        ImageDraw.Draw(m).polygon([tuple(P[k]) for k in ("window_TL", "window_TR", "window_BR", "window_BL")], fill=1)
        m = np.asarray(m)
        mg, mo = mg & ~m, mo & ~m
    # ignore a 4 px band along the guide's edges: the requested strip-light edge highlights brighten
    # those pixels, while any real shape error reaches beyond the band
    gedge = mg ^ ndimage.binary_erosion(mg)
    band = ndimage.binary_dilation(gedge, iterations=4)
    rep["dark_iou"] = round(float((mg & mo & ~band).sum() / max(1, ((mg | mo) & ~band).sum())), 4)
    edge = mg ^ np.roll(mg, 1, 0) | mg ^ np.roll(mg, 1, 1)
    edge |= np.roll(edge, 1, 0) | np.roll(edge, 1, 1)
    ov = (np.asarray(out).astype(float) * 0.65 + 245 * 0.35).astype(np.uint8); ov[edge] = (230, 30, 30)
    Image.fromarray(ov).save(WORK / f"{shot}_qa_overlay.png")
    print(json.dumps(rep, indent=1, default=str))


if __name__ == "__main__":
    main()
