// Cold Mirror 55" shell: an isometric product model on a display turntable.
//   node build.mjs           → cold-mirror-model.html (dark)
//   node build.mjs --light   → cold-mirror-model-light.html
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = join(HERE, "..", "..", ".claude", "skills", "anatomy");
const k = await import(join(SKILL, "kit", "iso-kit.mjs"));
const { kitScript } = await import(join(SKILL, "scripts", "inline-kit.mjs"));
import { makeMirror, projectionAt, CENTRE, STAND, Z0, WINDOW, PANEL_Z, DIM, MM } from "./mirror.mjs";

const THEME = process.argv.includes("--light") ? "light" : "dark";
const W = 600;
const H = 680;
const ELEVATION = 24;
const START = 60;                     // 30° to the right of the front, the hero angle of the product images

// One scale for every azimuth, so the product never grows or shrinks as it turns.
const PIVOT_Z = (Z0 + PANEL_Z[1]) / 2;
const extremes = [];
for (let a = 0; a < 360; a += 12) {
  const t = (a * Math.PI) / 180;
  extremes.push([CENTRE[0] + STAND.r * Math.cos(t), CENTRE[1] + STAND.r * Math.sin(t), 0]);
}
for (const x of [-DIM.panel.w / 2, DIM.panel.w / 2]) for (const y of [-DIM.base.d + 4.8, 4.8]) extremes.push([x, y, PANEL_Z[1] + Z0]);
let frame = null;
for (let az = 0; az < 360; az += 3) {
  const f = k.fitProjection(extremes, W, H, { pad: 40, azimuth: az, elevation: ELEVATION });
  if (!frame || f.scale < frame.scale) frame = { scale: f.scale };
}
{
  // centre the turn axis left–right; vertically, centre the tallest extent over all angles
  let up = Infinity, down = -Infinity;
  for (let az = 0; az < 360; az += 3) {
    const P = projectionAt(k, az, { ...frame, elevation: ELEVATION, pivotZ: PIVOT_Z, target: [0, 0] });
    for (const p of extremes) { const [, y] = k.iso(p, P); up = Math.min(up, y); down = Math.max(down, y); }
  }
  frame = { ...frame, elevation: ELEVATION, pivotZ: PIVOT_Z, target: [W / 2, H / 2 + 8 - (up + down) / 2] };
}

const M = makeMirror(k);
const P = projectionAt(k, START, frame);
const STATE = { mix: 0, screens: [["home", 1]] };

const screens = ["home", "color", "library"].map((name) => {
  const data = readFileSync(join(HERE, "screens", `${name}.jpg`)).toString("base64");
  const { x0, z1 } = WINDOW;
  return `<image id="cm-scr-${name}" href="data:image/jpeg;base64,${data}" x="${x0}" y="${-z1}" width="${DIM.window.w}" height="${DIM.window.h}" preserveAspectRatio="none"/>`;
});
const winRect = `M${WINDOW.x0} ${-WINDOW.z1}H${WINDOW.x1}V${-WINDOW.z0}H${WINDOW.x0}Z`;
const defs = `<defs>
<linearGradient id="cm-glass-grad" gradientUnits="userSpaceOnUse" x1="${WINDOW.x0}" y1="${-WINDOW.z1}" x2="${WINDOW.x1}" y2="${-WINDOW.z0}">
<stop offset="0" stop-color="var(--cm-glass-a)"/><stop offset=".55" stop-color="var(--cm-glass-b)"/><stop offset="1" stop-color="var(--cm-glass-c)"/></linearGradient>
<clipPath id="cm-win"><path d="${winRect}"/></clipPath>
${screens.join("\n")}
</defs>`;

const svg = k.figureSvg({
  width: W,
  height: H,
  label: "The Cold Mirror 55-inch shell on a display turntable: a thin portrait panel 831 by 1801 by 46 millimetres with a 680 by 1209 mirror window, a camera lens in the left border, a button on the right edge, a ladder frame of square tube and two braces on the back, standing on a 600 by 400 base.",
  body: [defs, `<g data-model>${M.draw(P, STATE)}</g>`],
});

const css = `<style>
.iso{--cm-glass-a:#2a2c30;--cm-glass-b:#141518;--cm-glass-c:#1e2024;--cm-streak:#ffffff;--cm-streak-k:.28;--cm-lens:#050505}
.iso[data-theme="light"]{--cm-glass-a:#c3c6cc;--cm-glass-b:#eceef1;--cm-glass-c:#d2d5da;--cm-streak:#ffffff;--cm-streak-k:1;--cm-lens:#000}
/* the product is black in every finish: on the light plate its parts take a dark token set */
.iso[data-theme="light"] .cm-black{--anatomy-paper:#1d1d20;--anatomy-face:#232327;--anatomy-top:#2b2b30;--anatomy-shade-0:#161618;--anatomy-shade-1:#1b1b1e;--anatomy-shade-2:#202024;--anatomy-shade-3:#26262a;--anatomy-lit-top:#34343a;--anatomy-lit-shade:#2a2a2f;--anatomy-hi:#060607;--anatomy-mid:#0d0d0f;--anatomy-lo:#55555b;--anatomy-faint:#3c3c42;--anatomy-dot:#8c8c92}
.iso[data-theme="light"] .cm-black .iso-dots{fill:var(--anatomy-dot)}
.cm-glass{fill:url(#cm-glass-grad)}
.cm-streak{fill:var(--cm-streak)}
.cm-lens{fill:var(--cm-lens)}
.cm-win{stroke-width:.8px}
.cm-halo{opacity:.7}
.cm-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
.cm-stage{touch-action:pan-y;cursor:grab;user-select:none;-webkit-user-select:none}
.cm-stage[data-drag]{cursor:grabbing}
.cm-stage:focus{outline:none}
.cm-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
.cm-buttons{display:flex;gap:6px;flex-wrap:wrap;margin:10px 0 0}
.cm-buttons button{font:12px/1 var(--anatomy-mono);color:var(--anatomy-text);background:var(--anatomy-card);border:0;border-radius:6px;padding:7px 10px;box-shadow:var(--anatomy-lift);cursor:pointer}
.cm-buttons button[aria-pressed="true"]{color:var(--anatomy-strong)}
</style>`;

const DATA = { frame, start: START, mm: MM };
const mirrorSrc = readFileSync(join(HERE, "mirror.mjs"), "utf8").replace(/^export /gm, "");
const live = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const kitNames = ["iso", "depthOf", "cameraOf", "towardViewer", "pathOf", "slabOf", "cylinder", "extrude", "ring", "radialTicks", "sideArc", "lineOnTop", "segment", "haloOf", "corners", "solidSvg", "lineSvg", "dotsSvg", "sideMatrix"];
const script = kitScript() + `\nconst k = { ${kitNames.join(", ")} };\n` + mirrorSrc + "\n" + live;

const body =
  css +
  k.plateHtml({
    fig: "Fig 1",
    title: "Cold Mirror · 55-inch shell",
    hint: "Drag to turn · click the glass",
    readout: "front +30° · mirror",
    keys: [
      { mark: "lit", label: "Mirror window 680 × 1209 mm, the display behind it" },
      { mark: "raised", label: "Panel 831 × 1801 × 46 mm; lens in the left border at 920 mm, button on the right edge at 1500 mm" },
      { mark: "edge", label: "Back: ladder frame of 40 mm square tube, service box, two braces to the 600 × 400 × 50 base" },
    ],
    caption:
      "Drawn to the shell drawing at one scale, 10 mm to the unit: every view on the turntable keeps the panel's 2.17 : 1 height to width, the 73 mm border at the top and sides, 515 mm of black below the window, and the 30 mm feet between base and panel. Off, the window is a mirror; on, it shows the app.",
    body: `<div class="iso-stage cm-stage" tabindex="0" role="group" aria-label="Cold Mirror model. Drag or use the arrow keys to turn it; Enter switches the screen.">${svg}<span class="cm-sr" role="status" aria-live="polite" data-status></span></div><div class="cm-buttons" role="group" aria-label="Views">${[["front", 90], ["hero", 60], ["side", 0], ["rear", 235]].map(([n, a]) => `<button type="button" data-view="${a}">${n}</button>`).join("")}<button type="button" data-screen aria-pressed="false">screen</button></div>`,
  });

const name = THEME === "light" ? "cold-mirror-model-light.html" : "cold-mirror-model.html";
writeFileSync(join(HERE, name), k.pageHtml({ title: "Cold Mirror model", theme: THEME, body, script }));
console.log("wrote", name, "scale", frame.scale.toFixed(3));
