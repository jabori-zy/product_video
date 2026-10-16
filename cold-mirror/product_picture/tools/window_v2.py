"""Locate the 680x1209 display area on a v2 (full-mirror) render: detect the panel's front outline
(the thin black frame lip), fit a homography guide->render on its four corners, and map the display corners.

usage: python window_v2.py <render.png>  -> prints JSON {panel_front, window, H}
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from guide import PW, PT, P0, DISP_W, DISP_H, DISP_TOP, Cam, SHOTS  # noqa: E402  (old window = the display area)


def homography(src, dst):
    A = []
    for (x, y), (u, v) in zip(src, dst):
        A += [[x, y, 1, 0, 0, 0, -u * x, -u * y, -u], [0, 0, 0, x, y, 1, -v * x, -v * y, -v]]
    h = np.linalg.svd(np.array(A, float))[2][-1]
    return (h / h[-1]).reshape(3, 3)


def apply(H, p):
    q = np.c_[np.asarray(p, float), np.ones(len(p))] @ H.T
    return q[:, :2] / q[:, 2:]


def line_fit(pts, vertical):
    pts = np.asarray(pts, float)
    if vertical:   # x = a*y + b
        a, b = np.polyfit(pts[:, 1], pts[:, 0], 1); return ("v", a, b)
    a, b = np.polyfit(pts[:, 0], pts[:, 1], 1); return ("h", a, b)


def intersect(l1, l2):
    (_, a, b), (_, c, d) = (l1, l2) if l1[0] == "v" else (l2, l1)   # x = a y + b ; y = c x + d
    y = (c * b + d) / (1 - c * a); return [a * y + b, y]


def main():
    img = np.asarray(Image.open(sys.argv[1]).convert("L")).astype(int)
    cam = Cam(**SHOTS["01"])
    hw = PW / 2
    g = cam(np.array([[-hw, PT, 0], [hw, PT, 0], [hw, P0, 0], [-hw, P0, 0]]))   # TL TR BR BL in guide px
    dark = img < 70
    L, T, R, B = [], [], [], []
    for y in np.linspace(g[0][1] + 150, g[3][1] - 150, 60).astype(int):      # left edge: first dark px from left
        xs = np.nonzero(dark[y, int(g[0][0]) - 40:int(g[0][0]) + 40])[0]
        if len(xs): L.append([xs[0] + int(g[0][0]) - 40, y])
    for y in np.linspace(g[1][1] + 150, g[2][1] - 150, 60).astype(int):      # right front edge: last dark px of the lip
        x0 = int(g[1][0]) - 60; row = dark[y, x0:x0 + 70]                    # (the side face is dark too: take the
        xs = np.nonzero(~row)[0]                                             #  last bright px of the glass + 1)
        if len(xs): R.append([xs[-1] + x0 + 1, y])
    for x in np.linspace(g[0][0] + 100, g[1][0] - 100, 60).astype(int):      # top edge
        yt = g[0][1] + (g[1][1] - g[0][1]) * (x - g[0][0]) / (g[1][0] - g[0][0])
        ys = np.nonzero(dark[int(yt) - 40:int(yt) + 40, x])[0]
        if len(ys): T.append([x, ys[0] + int(yt) - 40])
    for x in np.linspace(g[3][0] + 100, g[2][0] - 100, 60).astype(int):      # bottom edge: last dark px of the lip
        yb = g[3][1] + (g[2][1] - g[3][1]) * (x - g[3][0]) / (g[2][0] - g[3][0])
        col = img[int(yb) - 40:int(yb) + 12, x]
        ys = np.nonzero(col > 110)[0]                                        # last glass pixel above the lip
        if len(ys): B.append([x, ys[-1] + int(yb) - 40 + 1 + 6])             # + lip (~6 px at this scale)
    lines = [line_fit(L, True), line_fit(T, False), line_fit(R, True), line_fit(B, False)]
    quad = [intersect(lines[0], lines[1]), intersect(lines[2], lines[1]), intersect(lines[2], lines[3]), intersect(lines[0], lines[3])]
    H = homography(g, quad)
    dw = DISP_W / 2
    win_g = cam(np.array([[-dw, DISP_TOP, 0], [dw, DISP_TOP, 0], [dw, DISP_TOP - DISP_H, 0], [-dw, DISP_TOP - DISP_H, 0]]))
    win = apply(H, win_g)
    print(json.dumps({"panel_front_guide": np.round(g, 1).tolist(), "panel_front": np.round(quad, 1).tolist(),
                      "window": np.round(win, 1).tolist(), "H": H.tolist()}, indent=1))


if __name__ == "__main__":
    main()
