const DATA = __DATA__;
const M = makeMirror(k);
const stage = document.querySelector(".cm-stage");
const svg = stage.querySelector("svg");
const model = svg.querySelector("[data-model]");
const readout = document.querySelector("[data-readout]");
const status = document.querySelector("[data-status]");
const screenBtn = document.querySelector("[data-screen]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const SCREENS = ["home", "color", "library"];
const NAMES = { home: "home", color: "hair colour", library: "colour library" };

let az = DATA.start, azTarget = DATA.start, azVel = 0;
let mix = 0, mixTarget = 0;
let screen = 0, prevScreen = 0, swap = 1;          // swap: 0 → 1 crossfade from prevScreen to screen
let frame = 0, previous = 0, visible = false, touring = !still.matches, idle = 0;
let drag = null, drawn = "";

const wrap = (a) => ((a % 360) + 360) % 360;
const shortest = (from, to) => { let d = wrap(to - from); if (d > 180) d -= 360; return d; };

// The tour: the product images' angles, the screen switched on, the back, and round again.
const TOUR = [
  { az: 60, mix: 0, hold: 2.6 },
  { az: 90, mix: 0, hold: 1.8 },
  { az: 90, mix: 1, screen: 0, hold: 2.4 },
  { az: 120, mix: 1, screen: 1, hold: 2.8 },
  { az: 180 + 5, mix: 1, hold: 1.2 },
  { az: 235, mix: 0, hold: 3.0 },
  { az: 0, mix: 0, hold: 2.4 },
  { az: 60, mix: 1, screen: 2, hold: 2.6 },
];
let step = -1, wait = 2.6;

function setScreen(i) {
  if (i === screen) return;
  prevScreen = screen; screen = i; swap = still.matches ? 1 : 0;
}
function words() {
  const yaw = Math.round(shortest(az, 90));
  const facing = Math.abs(yaw) <= 50 ? "front" : Math.abs(yaw) >= 130 ? "rear" : "side";
  const sign = yaw > 0 ? "+" : yaw < 0 ? "−" : "";
  const state = mixTarget > 0.5 ? "on · " + NAMES[SCREENS[screen]] : "mirror";
  return facing + " " + sign + Math.abs(yaw) + "° · " + state;
}
function draw() {
  const P = projectionAt(k, wrap(az), DATA.frame);
  const screens = swap >= 1 ? [[SCREENS[screen], 1]] : [[SCREENS[prevScreen], 1], [SCREENS[screen], swap]];
  const key = P.azimuth.toFixed(2) + "|" + mix.toFixed(3) + "|" + screens.map((s) => s.join(":")).join(",");
  if (key !== drawn) { model.innerHTML = M.draw(P, { mix, screens }); drawn = key; }
  const text = words();
  if (readout.textContent !== text) readout.textContent = text;
  screenBtn.setAttribute("aria-pressed", String(mixTarget > 0.5));
}
function tourStep(dt) {
  wait -= dt;
  if (wait > 0 || Math.abs(shortest(az, azTarget)) > 1 || Math.abs(mix - mixTarget) > 0.02) return;
  step = (step + 1) % TOUR.length;
  const s = TOUR[step];
  azTarget = az + shortest(az, s.az);
  mixTarget = s.mix;
  if (s.screen !== undefined) setScreen(s.screen);
  wait = s.hold;
}
function tick(now) {
  const dt = previous ? Math.min((now - previous) / 1000, 1 / 30) : 1 / 60;
  previous = now;
  const calm = still.matches;
  if (touring && !drag) tourStep(dt);
  if (!drag) {
    if (calm) { az = azTarget; azVel = 0; }
    else {
      // a damped spring: the turntable has mass and comes to rest without overshoot
      const kS = 22, c = 2 * Math.sqrt(kS) * 1.0;
      for (let i = 0; i < 4; i++) { const h = dt / 4; azVel += (kS * (azTarget - az) - c * azVel) * h; az += azVel * h; }
      if (Math.abs(azTarget - az) < 0.02 && Math.abs(azVel) < 0.05) { az = azTarget; azVel = 0; }
    }
  }
  mix = calm ? mixTarget : mix + (mixTarget - mix) * (1 - Math.exp(-dt / 0.22));
  if (Math.abs(mix - mixTarget) < 0.002) mix = mixTarget;
  swap = calm ? 1 : Math.min(1, swap + dt / 0.5);
  draw();
  const busy = touring || drag || az !== azTarget || mix !== mixTarget || swap < 1;
  frame = visible && busy ? requestAnimationFrame(tick) : 0;
}
function run() { if (!frame && visible) { previous = 0; frame = requestAnimationFrame(tick); } }
function takeOver() {
  touring = false;
  clearTimeout(idle);
  idle = setTimeout(() => { if (still.matches) return; touring = true; step = -1; wait = 0.6; run(); }, 9000);
}
function toggleScreen() {
  if (mixTarget > 0.5 && swap >= 1) {
    if (screen < SCREENS.length - 1) setScreen(screen + 1);
    else { mixTarget = 0; setScreen(0); }
  } else mixTarget = 1;
  status.textContent = mixTarget > 0.5 ? "Screen on: " + NAMES[SCREENS[screen]] + "." : "Screen off: mirror.";
  run();
}

new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("pointerdown", (e) => {
  takeOver();
  drag = { x: e.clientX, az, moved: 0, t: performance.now() };
  stage.setPointerCapture(e.pointerId);
  stage.toggleAttribute("data-drag", true);
  run();
});
stage.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.x;
  drag.moved = Math.max(drag.moved, Math.abs(dx));
  const rect = svg.getBoundingClientRect();
  az = drag.az + (dx / rect.width) * 300;           // a full drag across the card turns it most of the way round
  azTarget = az;
});
const release = (e) => {
  if (!drag) return;
  const tap = drag.moved < 4;
  drag = null;
  stage.toggleAttribute("data-drag", false);
  if (tap && e.target.closest('[data-part="panel"]')) toggleScreen();
  else azTarget = Math.round(az / 5) * 5;          // settle on the 5° ticks
  run();
};
stage.addEventListener("pointerup", release);
stage.addEventListener("pointercancel", release);
stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault(); takeOver();
    azTarget = Math.round(azTarget / 15) * 15 + (e.key === "ArrowRight" ? -15 : 15);
    run();
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault(); takeOver(); toggleScreen();
  }
});
for (const b of document.querySelectorAll("[data-view]")) b.addEventListener("click", () => {
  takeOver(); azTarget = az + shortest(az, Number(b.dataset.view)); run();
});
screenBtn.addEventListener("click", () => { takeOver(); toggleScreen(); });
draw();
