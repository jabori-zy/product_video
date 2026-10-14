# Cold Mirror · Higgsfield draft generation

Model: **Seedance 2.5 draft**, which means `seedance_2_5` with `--draft true`. Never run it without draft.
Settings: `--mode omni_reference`, `--aspect_ratio 9:16`, `--resolution 1080p`, `--generate_audio false`. The soundtrack comes from `../demo/public/soundtrack.wav`.
The four clips follow the timeline in `../demo/src/timing.json` (36 s, 18 bars at 120 BPM), and `assemble.sh` joins them.

References come from `../demo/public/`:
- `her/*.jpg` are her photo with the watermark removed and the hair recoloured.
- `lib/*.jpg` are hairstyle library photos.

Each prompt names its references as *image 1, image 2 …*, in the order passed.

---

## seg1 — Act 1: barbershop mirror (0:00–0:12, 12 s)
Refs: 1 `her/原色.jpg` · 2 `her/奶茶粉紫.jpg` · 3 `her/初恋蓬松短发.jpg`

> Vertical 9:16 cinematic commercial, warm tungsten barbershop at night, shallow depth of field, multi-shot.
> Shot 1 (0–2s): extreme macro slide along the bevelled metal edge of a tall portrait smart mirror on a round metal base; a thin line of white light runs down the edge; blurred warm bulbs in the glass.
> Shot 2 (2–4s): low wide shot, the young woman from image 1 (long layered chestnut-brown waves, white lace camisole, thin gold chain choker) walks in and stops in front of the mirror, tucks a strand of hair behind her ear.
> Shot 3 (4–6s): over-the-shoulder onto the mirror; the glass softly lights up with a grid of hair-colour swatch cards glowing behind her reflection; her fingertip taps one card.
> Shot 4 (6–10s): frontal close-up of her reflection only; a vertical line of light sweeps left to right across the reflection and her hair in the mirror becomes the milky lilac-purple of image 2, while she glances down at her real brown hair and smiles; then another sweep and the reflection shows the airy ash-blonde shoulder-length cut of image 3.
> Shot 5 (10–12s): the camera pushes into the mirror and passes through the glass with a soft ripple; the shop door behind her opens and golden sunlight floods the frame.
> Same face and outfit in every shot; only the hair changes. Photoreal, 24fps film look.

## seg2 — Act 2a: street selfies (0:12–0:22, 10 s)
Refs: 1 `her/初恋蓬松短发.jpg` · 2 `lib/甜酷风_狼尾发.jpg` · 3 `lib/欧美_元气高马尾.jpg` · 4 `her/蜂蜜茶色.jpg` · 5 `lib/日式_日系双马尾.jpg`

> Vertical 9:16 cinematic commercial, golden-hour city street, handheld, fast-cut multi-shot, the same young woman throughout (face from image 1, white lace camisole, gold chain choker).
> Shot 1 (0–2s): she walks toward camera along a tree-lined street with the ash-blonde cut of image 1, raises her phone for a selfie.
> Shot 2 (2–4s): phone-screen POV; shutter flash; in the photo her hair is now the black-and-red wolf cut of image 2; pull back to reveal the real her on the street also has the wolf cut; a red bus passes in the foreground and wipes the frame.
> Shot 3 (4–6s): side tracking shot at a zebra crossing, she now has the high sunset-orange ponytail of image 3, hops off the kerb mid-stride taking a selfie, ponytail swinging; whip pan.
> Shot 4 (6–8s): through a café window, she sits with a latte, hair in soft honey-brown curls like image 4, lifts the cup then takes a selfie; a glass door edge slides across the frame.
> Shot 5 (8–10s): locked selfie framing, her face centred and smiling, the background and hairstyle change on each beat: twin tails like image 5 at a graffiti wall, then a rooftop at dusk, then a riverside rail.
> Photoreal, consistent identity, only the hair and location change.

## seg3 — Act 2b: front-facing street walk → back to the mirror (0:22–0:30, 8 s)
Refs: 1 `her/原色.jpg` · 2 `lib/甜酷风_羊毛卷短发.jpg` · 3 `lib/欧美_蓬松鱼骨辫.jpg` · 4 `lib/日式_高丸子头.jpg` · 5 `lib/韩式_优雅公主切.jpg`

> Vertical 9:16 cinematic commercial, golden-hour avenue in one-point perspective, the same young woman (face from image 1, white lace camisole, gold chain choker).
> Shot 1 (0–5s): the camera is directly in front of her and dollies backward at her pace; she walks straight toward the lens, looking into camera, confident. Every two steps, exactly as her foot lands, her hairstyle changes instantly with a soft light pulse: short brown curls like image 2, then a loose blonde fishtail braid over one shoulder like image 3, then a high bun like image 4, then long sleek blonde hime cut like image 5. Never change mid-stride.
> Shot 1 continues (5–6.5s): she keeps walking while the camera pulls back, tilts up toward the warm sky, and orbits around to her left side.
> Shot 2 (6.5–8s): she walks past a boutique window; focus racks to her reflection in the glass; a lamp-post shadow sweeps across and the window becomes a tall smart mirror in a barbershop, where she now sits in the barber chair while a barber's scissors close on her hime cut.
> Photoreal, smooth motion, consistent identity.

## seg4 — Act 3: studio product display (0:30–0:36, 6 s)
Refs: none (text to video). The end card text (logo, 「先改变，再看见」 → 「先看见，再改变」) is added in the edit, not generated.

> Vertical 9:16 product film. A tall portrait smart mirror with a slim brushed-metal bezel on a round metal pedestal stands centre frame in a dark seamless studio. Three overhead spotlights snap on one after another, then a ring of warm vanity bulbs around the mirror lights up one by one. The camera slowly orbits and pushes in; a soft highlight sweeps across the clean glass; a pool of light and a faint reflection on the glossy floor; drifting dust in the beams. Leave clear empty space above the mirror. No people, no text. Premium, minimal, photoreal.
