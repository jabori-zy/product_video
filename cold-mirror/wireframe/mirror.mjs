// Cold Mirror 55" shell: geometry and drawing, shared by build.mjs (static SVG) and the page (live turn).
// Source: ../assets/55-inch Custom Mirror Shell Model.pdf, the same numbers as product_picture/tools/guide.py.
// World units are 10 mm. x right, y toward the viewer of the front (panel front at y = 0), z up.
// The product stands on a display turntable; turning it is a change of camera azimuth.

export const MM = 10;
export const DIM = {
  panel: { w: 83.1, h: 180.1, d: 4.6 },          // 831 × 1801 × 46
  window: { w: 68, h: 120.9, top: 7.3 },         // 680 × 1209, 73 border at the top and sides
  base: { w: 60, d: 40, t: 5, r: 4, y0: -35.2 }, // 600 × 400 × 50, R40, front 48 ahead of the panel
  gap: 3,                                        // 30: base top to panel bottom (feet)
  lens: { x: -37.59, z: 92 },                    // 39.6 in from the left edge, 920 above the floor
  button: 150,                                   // 1500 above the floor, right side edge
  tube: 4,                                       // 40 square tube
  railX: 23.3, railTop: 164.7, cross: [111.4, 58.6],
  braceTop: 87.6,
  box: { w: 22, h: 18.6, z: 23.5, d: 3 },
};
export const STAND = { r: 50, h: 2.4, platter: 47, ph: 2.2 };
export const Z0 = STAND.h + STAND.ph;            // the product's floor: the platter top
export const CENTRE = [0, -15.2];                // turn axis: the middle of the base

const { panel: PN, window: WN, base: BS, tube: TB } = DIM;
const HW = PN.w / 2;
const P0 = BS.t + DIM.gap;                       // panel bottom, 80 mm
const PT = P0 + PN.h;                            // panel top, 1881 mm
const WIN = { x0: -WN.w / 2, x1: WN.w / 2, z1: PT - WN.top, z0: PT - WN.top - WN.h };
const RAIL_Y = [-PN.d - TB, -PN.d];
const BAR_X = DIM.railX - TB / 2;                // bars butt between the rails
const PLATE_T = 0.6;

// The brace is a square tube in the y–z plane: a prism along x whose section is cut
// vertical where it is welded to the rail and level where it lands on its foot plate.
function braceSection() {
  const top = [-PN.d - TB - TB / 2, DIM.braceTop];
  const bot = [-31, BS.t + PLATE_T];
  const len = Math.hypot(bot[0] - top[0], bot[1] - top[1]);
  const d = [(bot[0] - top[0]) / len, (bot[1] - top[1]) / len];
  const n = [-d[1], d[0]].map((v) => (d[1] < 0 ? -v : v));       // points +y (toward the panel)
  const line = (off) => [top[0] + n[0] * off, top[1] + n[1] * off];
  const atY = (p, y) => [y, p[1] + ((y - p[0]) * d[1]) / d[0]];
  const atZ = (p, z) => [p[0] + ((z - p[1]) * d[0]) / d[1], z];
  const f = line(TB / 2), b = line(-TB / 2);
  return [atY(f, RAIL_Y[0]), atY(b, RAIL_Y[0]), atZ(b, bot[1]), atZ(f, bot[1])];
}
export const BRACE = braceSection();

export function makeMirror(k) {
  const view = (P) => {
    const { sinA, cosA, sinE, cosE } = k.cameraOf(P);
    return [cosA * cosE, sinA * cosE, sinE];
  };

  // A prism along x of a convex polygon in (y, z): the brace.
  function prismX(poly, x0, x1, P) {
    const { sinA, cosA } = k.cameraOf(P);
    const V = view(P);
    const at = (x, [y, z]) => k.iso([x, y, z + Z0], P);
    const n = poly.length;
    let area = 0;
    for (let i = 0; i < n; i++) { const [ay, az] = poly[i], [by, bz] = poly[(i + 1) % n]; area += ay * bz - by * az; }
    const faces = [];
    for (let i = 0; i < n; i++) {
      const [ay, az] = poly[i], [by, bz] = poly[(i + 1) % n];
      const L = Math.hypot(by - ay, bz - az);
      let ny = (bz - az) / L, nz = -(by - ay) / L;
      if (area < 0) { ny = -ny; nz = -nz; }
      faces.push({ nrm: [0, ny, nz], pts: [at(x0, poly[i]), at(x0, poly[(i + 1) % n]), at(x1, poly[(i + 1) % n]), at(x1, poly[i])] });
    }
    const side0 = { nrm: [-1, 0, 0], pts: poly.map((p) => at(x0, p)) };
    const side1 = { nrm: [1, 0, 0], pts: poly.map((p) => at(x1, p)) };
    const vis = (f) => f.nrm[0] * V[0] + f.nrm[1] * V[1] + f.nrm[2] * V[2] > 1e-9;
    const all = [...faces, side0, side1];
    const pts = all.flatMap((f) => f.pts);
    const hull = hull2(pts);
    const shades = [[], [], [], []], tops = [];
    const [lx, ly] = [-sinA, cosA];
    for (const f of all) {
      if (!vis(f)) continue;
      const d = k.pathOf(f.pts, true);
      if (f.nrm[2] > 0.55) { tops.push(d); continue; }
      const h = Math.hypot(f.nrm[0], f.nrm[1]) || 1;
      const lit = ((f.nrm[0] / h) * lx + (f.nrm[1] / h) * ly + 1) / 2;
      shades[Math.min(3, Math.max(0, Math.floor(lit * 4)))].push(d);
    }
    // edges: a silhouette between a visible and a hidden face, a crease between two visible ones
    const outline = [], crease = [];
    const edge = (fa, fb, a, b) => {
      const va = vis(fa), vb = vis(fb);
      if (va !== vb) outline.push(k.pathOf([a, b]));
      else if (va && vb) crease.push(k.pathOf([a, b]));
    };
    for (let i = 0; i < n; i++) {
      const f = faces[i], prev = faces[(i + n - 1) % n];
      edge(f, side0, f.pts[0], f.pts[1]);
      edge(f, side1, f.pts[3], f.pts[2]);
      edge(prev, f, f.pts[0], f.pts[3]);
    }
    return { fill: k.pathOf(hull, true), outline: outline.join(""), crease: crease.join(""), top: tops.join(""), shades: shades.map((s) => s.join("")) };
  }

  function hull2(points) {
    const s = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of s) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (let i = s.length - 1; i >= 0; i--) { const p = s[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return [...lo.slice(0, -1), ...up.slice(0, -1)];
  }

  const box = (x0, x1, y0, y1, z0, z1, r = 0.2) => ({ plan: { x: x0, y: y0, w: x1 - x0, d: y1 - y0, r }, z0, z1, aabb: [[x0, y0, z0], [x1, y1, z1]] });

  // Every drawn part: its true box (for the painter's order) and how it draws itself.
  function partsOf() {
    const parts = [];
    const add = (name, aabb, draw) => parts.push({ name, aabb, draw });

    const base = box(-BS.w / 2, BS.w / 2, BS.y0, BS.y0 + BS.d, 0, BS.t, BS.r);
    add("base", base.aabb, (P, S) => {
      const out = [S.solid(k.slabOf(base.plan, Z0, BS.t, P, 10, 0.5), { tone: "lo" })];
      const screws = k.corners(base.plan, 3.2);
      out.push(S.line(screws.map(([x, y]) => k.ring(x, y, 0.9, Z0 + BS.t, P, 16)).join(""), { tone: "faint" }));
      out.push(S.dots(screws.map(([x, y]) => k.iso([x, y, Z0 + BS.t], P)), { size: 0.45 }));
      return out.join("");
    });

    for (const sx of [-1, 1]) {
      const foot = box(sx * 24 - 2, sx * 24 + 2, -4, -0.6, BS.t, P0, 0.3);
      add("foot", foot.aabb, (P, S) => S.solid(k.slabOf(foot.plan, Z0 + foot.z0, foot.z1 - foot.z0, P, 2, 0.3), { tone: "mid" }));

      const rp = box(sx * DIM.railX - 3.2, sx * DIM.railX + 3.2, RAIL_Y[0] - 2.6, RAIL_Y[1], BS.t, BS.t + PLATE_T, 0.4);
      add("rail plate", rp.aabb, (P, S) => {
        const pts = [[sx * DIM.railX - 1.9, RAIL_Y[0] - 1.4], [sx * DIM.railX + 1.9, RAIL_Y[0] - 1.4]];
        return S.solid(k.slabOf(rp.plan, Z0 + rp.z0, PLATE_T, P, 3, 0.2), { tone: "lo", crease: "none" }) +
          S.dots(pts.map(([x, y]) => k.iso([x, y, Z0 + rp.z1], P)), { size: 0.4 });
      });

      const rail = box(sx * DIM.railX - TB / 2, sx * DIM.railX + TB / 2, RAIL_Y[0], RAIL_Y[1], BS.t + PLATE_T, DIM.railTop, 0.25);
      add("rail", rail.aabb, (P, S) => {
        const V = view(P);
        let inner = "";
        if (V[1] < 0) {
          // bolts through the rail into the panel's back, on the rail's back face
          const zs = [20, 72, 124, 156];
          inner = S.dots(zs.map((z) => k.iso([sx * DIM.railX, RAIL_Y[0], z + Z0], P)), { size: 0.45 });
        }
        return S.solid(k.slabOf(rail.plan, Z0 + rail.z0, rail.z1 - rail.z0, P, 2, 0.3), { tone: "mid" }) + inner;
      });

      const fp = box(sx * DIM.railX - 3.6, sx * DIM.railX + 3.6, -35, -27, BS.t, BS.t + PLATE_T, 0.5);
      add("brace plate", fp.aabb, (P, S) => {
        const pts = [[sx * DIM.railX, -34], [sx * DIM.railX, -27.9]];
        return S.solid(k.slabOf(fp.plan, Z0 + fp.z0, PLATE_T, P, 3, 0.2), { tone: "lo", crease: "none" }) +
          S.dots(pts.map(([x, y]) => k.iso([x, y, Z0 + fp.z1], P)), { size: 0.4 });
      });

      const ys = BRACE.map((p) => p[0]), zs = BRACE.map((p) => p[1]);
      const bx0 = sx * DIM.railX - TB / 2, bx1 = sx * DIM.railX + TB / 2;
      add("brace", [[bx0, Math.min(...ys), Math.min(...zs)], [bx1, Math.max(...ys), Math.max(...zs)]], (P, S) =>
        S.solid(prismX(BRACE, bx0, bx1, P), { tone: "mid" }));
    }

    for (const zc of [DIM.railTop - TB / 2, ...DIM.cross]) {
      const bar = box(-BAR_X, BAR_X, RAIL_Y[0], RAIL_Y[1], zc - TB / 2, zc + TB / 2, 0.2);
      add("bar", bar.aabb, (P, S) => S.solid(k.slabOf(bar.plan, Z0 + bar.z0, TB, P, 2, 0.3), { tone: "mid" }));
    }

    const B = DIM.box;
    const sb = box(-B.w / 2, B.w / 2, -PN.d - B.d, -PN.d, B.z, B.z + B.h, 0.4);
    add("service box", sb.aabb, (P, S) => {
      const V = view(P);
      let inner = "";
      if (V[1] < 0) {
        const y = -PN.d - B.d, i = 1.2;
        const lid = [[-B.w / 2 + i, B.z + i], [B.w / 2 - i, B.z + i], [B.w / 2 - i, B.z + B.h - i], [-B.w / 2 + i, B.z + B.h - i]];
        inner += S.line(k.pathOf(lid.map(([x, z]) => k.iso([x, y, z + Z0], P)), true), { tone: "faint" });
        const sc = [[-B.w / 2 + 2.4, B.z + 2.4], [B.w / 2 - 2.4, B.z + 2.4], [B.w / 2 - 2.4, B.z + B.h - 2.4], [-B.w / 2 + 2.4, B.z + B.h - 2.4]];
        inner += S.dots(sc.map(([x, z]) => k.iso([x, y, z + Z0], P)), { size: 0.4 });
        // vent slots, closed outlines on the lid
        for (let j = 0; j < 5; j++) {
          const z = B.z + 6 + j * 1.6;
          const slot = [[-6, z], [6, z], [6, z + 0.6], [-6, z + 0.6]];
          inner += S.line(k.pathOf(slot.map(([x, zz]) => k.iso([x, y, zz + Z0], P)), true), { tone: "lo" });
        }
      }
      return S.solid(k.slabOf(sb.plan, Z0 + sb.z0, B.h, P, 3, 0.3), { tone: "mid" }) + inner;
    });

    const pn = box(-HW, HW, -PN.d, 0, P0, PT, 0.3);
    add("panel", pn.aabb, (P, S, st) => panelSvg(P, S, st, pn));
    return parts;
  }

  // The panel: a thin slab with the mirror window on its front, the lens in the left border,
  // the button on the right edge, the cover-glass and back-cover seams round the edges.
  function panelSvg(P, S, st, pn) {
    const V = view(P);
    const at = (x, y, z) => k.iso([x, y, z + Z0], P);
    const seamYs = [-0.6, -PN.d + 0.6];
    let inner = "";
    // seams run edge to edge: across the top, and down whichever side face shows
    for (const y of seamYs) inner += S.line(k.lineOnTop([-HW, y], [HW, y], PT + Z0, P), { tone: "faint" });
    const sideX = V[0] > 1e-9 ? HW : V[0] < -1e-9 ? -HW : null;
    if (sideX !== null) for (const y of seamYs) inner += S.line(k.segment([sideX, y, PT + Z0], [sideX, y, P0 + Z0], P), { tone: "faint" });
    const out = [S.solid(k.slabOf(pn.plan, Z0 + P0, PN.h, P, 2, 0.4), { tone: "hi", inner })];

    if (V[0] > 1e-9) {
      // the button: a small flush key on the right edge, 1500 above the floor
      const y0 = -PN.d / 2 - 0.9, y1 = -PN.d / 2 + 0.9, z0 = DIM.button - 1.4, z1 = DIM.button + 1.4;
      out.push(S.line(k.pathOf([at(HW, y0, z0), at(HW, y1, z0), at(HW, y1, z1), at(HW, y0, z1)], true), { tone: "lo" }));
    }
    if (V[1] < -1e-9) {
      // back cover: an inset outline with screws round it and a rating label low down
      const y = -PN.d, i = 1.6;
      const c = [[-HW + i, P0 + i], [HW - i, P0 + i], [HW - i, PT - i], [-HW + i, PT - i]];
      out.push(S.line(k.pathOf(c.map(([x, z]) => at(x, y, z)), true), { tone: "faint" }));
      const sc = [];
      for (let j = 0; j <= 8; j++) { const z = P0 + 3 + ((PN.h - 6) * j) / 8; sc.push([-HW + 3, z], [HW - 3, z]); }
      for (let j = 1; j < 4; j++) { const x = -HW + 3 + ((PN.w - 6) * j) / 4; sc.push([x, P0 + 3], [x, PT - 3]); }
      out.push(S.dots(sc.map(([x, z]) => at(x, y, z)), { size: 0.4 }));
      const lb = { x0: 27, x1: 37, z0: 14, z1: 22 };
      out.push(S.line(k.pathOf([at(lb.x0, y, lb.z0), at(lb.x1, y, lb.z0), at(lb.x1, y, lb.z1), at(lb.x0, y, lb.z1)], true), { tone: "lo" }));
      out.push(S.line([7, 5, 6].map((w, j) => k.pathOf([at(lb.x1 - 1.5, y, lb.z1 - 2 - j * 2), at(lb.x1 - 1.5 - w, y, lb.z1 - 2 - j * 2)])).join(""), { tone: "lo", free: true }));
    }
    if (V[1] > 1e-9) out.push(frontSvg(P, S, st));
    return out.join("");
  }

  function frontSvg(P, S, st) {
    const M = k.sideMatrix([0, 0], Z0, P, "left");        // local (u, v) = world (u, 0, Z0 − v)
    const { x0, x1, z0, z1 } = WIN;
    const rect = `M${x0} ${-z1}H${x1}V${-z0}H${x0}Z`;
    const az = P.azimuth;
    // reflections slide across the glass as the view turns: parallax of a mirror
    const shift = (((az - 60) % 360) + 360) % 360;
    const off = ((shift > 180 ? shift - 360 : shift) * 0.55);
    const streak = (u, w, a) => `<path class="cm-streak" style="opacity:calc(${a} * var(--cm-streak-k))" d="M${u + off} ${-z1}h${w}l-26 ${WN.h}h${-w}Z"/>`;
    const mix = st.mix;
    const parts = [`<g transform="${M}">`, `<g clip-path="url(#cm-win)">`];
    if (mix < 0.999) {
      parts.push(`<g style="opacity:${(1 - mix).toFixed(3)}"><path class="cm-glass" d="${rect}"/>`,
        streak(-10, 9, 0.5), streak(4, 3, 0.35), streak(24, 14, 0.18), `</g>`);
    }
    if (mix > 0.001) {
      parts.push(`<g style="opacity:${mix.toFixed(3)}">`);
      for (const [name, a] of st.screens) if (a > 0.001) parts.push(`<use href="#cm-scr-${name}" style="opacity:${a.toFixed(3)}"/>`);
      parts.push(streak(18, 10, 0.08), `</g>`);
    }
    parts.push(`</g>`, `<path class="iso-line cm-win" data-tone="lit" d="${rect}"/>`, `</g>`);

    // the camera lens, a true circle in the panel face (an ellipse on screen)
    const ring = (r) => k.pathOf(Array.from({ length: 28 }, (_, i) => {
      const t = (i / 28) * Math.PI * 2;
      return k.iso([DIM.lens.x + r * Math.cos(t), 0, DIM.lens.z + Z0 + r * Math.sin(t)], P);
    }), true);
    parts.push(`<path class="cm-lens" d="${ring(0.55)}"/>`, S.line(ring(0.95), { tone: "lo" }));
    parts.push(S.dots([k.iso([DIM.lens.x - 0.18, 0, DIM.lens.z + Z0 + 0.2], P)], { size: 0.32, tone: "hi" }));
    return parts.join("");
  }

  // The display turntable: a fixed stand ring and a platter that turns with the product.
  function standSvg(P, S) {
    const [cx, cy] = CENTRE;
    const out = [`<path class="iso-halo" d="${k.haloOf({ x: cx - STAND.r, y: cy - STAND.r, w: STAND.r * 2, d: STAND.r * 2, r: STAND.r }, 0, STAND.h, P)}"/>`];
    out.push(S.solid(k.cylinder(cx, cy, STAND.r, 0, STAND.h, P, 96, 0.6), { tone: "lo" }));
    // the index: a fixed pointer on the stand, always at the viewer's side
    const [vx, vy] = k.towardViewer(P);
    const ix = cx + vx * (STAND.r - 1.6), iy = cy + vy * (STAND.r - 1.6);
    out.push(S.line(k.lineOnTop([cx + vx * (STAND.platter + 0.4), cy + vy * (STAND.platter + 0.4)], [ix + vx * 1.2, iy + vy * 1.2], STAND.h, P), { tone: "lit" }));
    out.push(S.solid(k.cylinder(cx, cy, STAND.platter, STAND.h, STAND.ph, P, 96, 0.5), { tone: "mid", inner: S.line(k.sideArc(cx, cy, STAND.platter, STAND.h + STAND.ph * 0.5, P, 64), { tone: "faint" }) }));
    const t = k.radialTicks(cx, cy, STAND.platter - 0.6, 72, 6, Z0, [1.2, 2.6], P);
    out.push(S.line(t.minor, { tone: "lo" }), S.line(t.major, { tone: "mid" }));
    out.push(S.line(k.ring(cx, cy, STAND.platter - 0.6, Z0, P, 96), { tone: "faint" }));
    out.push(S.line(k.ring(cx, cy, STAND.platter - 3.2, Z0, P, 96), { tone: "faint" }));
    // the zero mark: the product's front
    out.push(S.line(k.lineOnTop([cx, cy + STAND.platter - 0.6], [cx, cy + STAND.platter - 3.2], Z0, P), { tone: "hi" }));
    out.push(`<path class="iso-halo cm-halo" d="${k.haloOf({ x: -BS.w / 2, y: BS.y0, w: BS.w, d: BS.d, r: BS.r }, Z0, 2, P)}"/>`);
    return out.join("");
  }

  const PARTS = partsOf();

  // Painter's order from separating planes: two parts that are apart along an axis are ordered
  // by which side of that plane the viewer is on. Parts touch but never cross, so a plane exists.
  function order(P) {
    const V = view(P);
    const n = PARTS.length;
    const boxes = PARTS.map(({ aabb: [a, b] }) => {
      const pts = [];
      for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) pts.push(k.iso([x, y, z + Z0], P));
      const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
      return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
    });
    const depth = PARTS.map(({ aabb: [a, b] }) => k.depthOf([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2], P));
    const after = Array.from({ length: n }, () => []);
    const deg = new Array(n).fill(0);
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const A = boxes[i], B = boxes[j];
      if (A[2] < B[0] || B[2] < A[0] || A[3] < B[1] || B[3] < A[1]) continue;
      const [a0, a1] = PARTS[i].aabb, [b0, b1] = PARTS[j].aabb;
      let first = -1;
      for (const ax of [2, 1, 0]) {
        if (Math.abs(V[ax]) < 1e-6) continue;
        if (a1[ax] <= b0[ax] + 1e-6) { first = V[ax] > 0 ? i : j; break; }
        if (b1[ax] <= a0[ax] + 1e-6) { first = V[ax] > 0 ? j : i; break; }
      }
      if (first < 0) first = depth[i] <= depth[j] ? i : j;
      const second = first === i ? j : i;
      after[first].push(second);
      deg[second]++;
    }
    const out = [], ready = [];
    const done = new Array(n).fill(false);
    for (let i = 0; i < n; i++) if (!deg[i]) ready.push(i);
    while (out.length < n) {
      if (!ready.length) { // a cycle: should not happen, fall back to the farthest left
        let m = -1;
        for (let i = 0; i < n; i++) if (!done[i] && (m < 0 || depth[i] < depth[m])) m = i;
        ready.push(m);
      }
      ready.sort((a, b) => depth[b] - depth[a]);
      const i = ready.pop();
      if (done[i]) continue;
      done[i] = true;
      out.push(i);
      for (const j of after[i]) if (--deg[j] === 0 && !done[j]) ready.push(j);
    }
    return out;
  }

  const S = {
    solid: (paths, style) => k.solidSvg(paths, style),
    line: (d, style) => k.lineSvg(d, style),
    dots: (pts, style) => k.dotsSvg(pts, style),
  };

  // st: { mix: 0 mirror … 1 screen on, screens: [[name, opacity], …] }
  function draw(P, st) {
    const body = [standSvg(P, S), `<g class="cm-black">`];
    for (const i of order(P)) body.push(`<g data-part="${PARTS[i].name}">${PARTS[i].draw(P, S, st)}</g>`);
    body.push(`</g>`);
    return body.join("");
  }

  return { draw, PARTS, order, view };
}

// A projection at any azimuth with one fixed scale, the turn axis pinned to one screen point.
export function projectionAt(k, az, frame) {
  const P = { origin: [0, 0], scale: frame.scale, azimuth: az, elevation: frame.elevation };
  const c = k.iso([CENTRE[0], CENTRE[1], frame.pivotZ], P);
  return { ...P, origin: [frame.target[0] - c[0], frame.target[1] - c[1]] };
}

export const WINDOW = WIN;
export const PANEL_Z = [P0, PT];
