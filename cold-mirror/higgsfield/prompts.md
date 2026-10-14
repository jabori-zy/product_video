# Cold Mirror · Higgsfield draft generation (v2)

Model: **Seedance 2.5 draft**, which means `seedance_2_5` with `--draft true`. Never run it without draft.
Settings: `--mode omni_reference`, `--aspect_ratio 9:16`, `--resolution 1080p`, `--generate_audio false`. The soundtrack comes from `../demo/public/soundtrack.wav`.
The four clips follow the timeline in `../demo/src/timing.json` (36 s, 18 bars at 120 BPM), and `assemble.sh` joins them.

References show **only her face**. v1 passed hairstyle-library photos of other models, and the face drifted to theirs. v2 never does that:
- `../demo/public/her/*.jpg` are her photo with the watermark removed and the hair recoloured.
- `looks/*.png` are stills of her own face with a new hairstyle, made by `looks.sh` (Seedream 5.0 Pro edits of `her/原色.jpg`, using the library photo only as the hair reference).

Every prompt says the face must never change; only the hair does.

Each prompt names its references as *image 1, image 2 …*, in the order passed.

---

## seg1 — Act 1: barbershop mirror (0:00–0:12, 12 s)
Refs: 1 `her/原色.jpg` · 2 `her/奶茶粉紫.jpg` · 3 `her/初恋蓬松短发.jpg`

> Vertical 9:16 cinematic commercial, warm tungsten barbershop at night, shallow depth of field, multi-shot. Identity lock: it is the same woman in every shot, with exactly the face of image 1 (same eyes, nose, lips, face shape, skin and makeup). The face never changes; only the hair changes.
> Shot 1 (0–2s): extreme macro slide along the bevelled metal edge of a tall portrait smart mirror on a round metal base; a thin line of white light runs down the edge; blurred warm bulbs in the glass.
> Shot 2 (2–4s): low wide shot, the young woman from image 1 (long layered chestnut-brown waves, white lace camisole, thin gold chain choker) walks in and stops in front of the mirror, tucks a strand of hair behind her ear.
> Shot 3 (4–6s): over-the-shoulder onto the mirror; the glass softly lights up with a grid of hair-colour swatch cards glowing behind her reflection; her fingertip taps one card.
> Shot 4 (6–10s): frontal close-up of her reflection only; a vertical line of light sweeps left to right across the reflection and her hair in the mirror becomes exactly the milky lilac-purple of image 2, while she glances down at her real brown hair and smiles; then another sweep and the reflection shows exactly the airy ash-blonde cut of image 3. Only these two looks.
> Shot 5 (10–12s): the camera pushes into the mirror and passes through the glass with a soft ripple; the shop door behind her opens and golden sunlight floods the frame.
> Photoreal, 24fps film look.

## seg2 — Act 2a: street selfies (0:12–0:22, 10 s)
Refs: 1 `her/原色.jpg` · 2 `her/初恋蓬松短发.jpg` · 3 `looks/狼尾发.png` · 4 `looks/元气高马尾.png` · 5 `her/蜂蜜茶色.jpg` · 6 `looks/日系双马尾.png`

> Vertical 9:16 cinematic commercial, golden-hour city street, handheld, fast-cut multi-shot, white lace camisole and gold chain choker throughout. Identity lock: it is the same woman in every shot, with exactly the face of image 1 (same eyes, nose, lips, face shape, skin and makeup). The face never changes; only the hair changes. Images 2–6 are this same woman with different hair; copy each hairstyle exactly and keep her face from image 1.
> Shot 1 (0–2s): she walks toward camera along a tree-lined street with the ash-blonde cut of image 2, raises her phone for a selfie.
> Shot 2 (2–4s): phone-screen POV; shutter flash; in the photo her hair is now the black-and-red wolf cut of image 3; pull back to reveal the real her on the street also has that wolf cut; a red bus passes in the foreground and wipes the frame.
> Shot 3 (4–6s): side tracking shot at a zebra crossing, she has the high orange ponytail of image 4, hops off the kerb mid-stride taking a selfie, ponytail swinging; whip pan.
> Shot 4 (6–8s): through a café window, she sits with a latte, hair in the honey-brown waves of image 5, lifts the cup then takes a selfie; a glass door edge slides across the frame.
> Shot 5 (8–10s): locked selfie framing, her face centred and smiling, with the twin tails of image 6, the background changing on each beat: graffiti wall, rooftop at dusk, riverside rail.
> Photoreal.

## seg3 — Act 2b: front-facing street walk → back to the mirror (0:22–0:30, 8 s)
Refs: 1 `her/原色.jpg` · 2 `looks/羊毛卷短发.png` · 3 `looks/蓬松鱼骨辫.png` · 4 `looks/高丸子头.png` · 5 `looks/优雅公主切.png`

> Vertical 9:16 cinematic commercial, golden-hour avenue in one-point perspective, white lace camisole and gold chain choker. Identity lock: it is the same woman in every shot, with exactly the face of image 1 (same eyes, nose, lips, face shape, skin and makeup). The face never changes; only the hair changes. Images 2–5 are this same woman with different hair; copy each hairstyle exactly and keep her face from image 1.
> Shot 1 (0–5s): the camera is directly in front of her and dollies backward at her pace; she walks straight toward the lens, looking into camera. She starts with the short brown curls of image 2. Every two steps, exactly as her foot lands, her hairstyle changes instantly with a soft light pulse: to the blonde fishtail braid of image 3, then the high bun of image 4, then the long platinum hime cut of image 5. Never change mid-stride, and her face stays the same.
> Shot 1 continues (5–6.5s): she keeps walking while the camera pulls back, tilts up toward the warm sky, and orbits around to her left side.
> Shot 2 (6.5–8s): she walks past a boutique window; focus racks to her reflection in the glass; a lamp-post shadow sweeps across and the window becomes a tall smart mirror in a barbershop, where she sits in the barber chair while a barber's scissors close on her hime cut.
> Photoreal, smooth motion.

## seg4 — Act 3: studio product display (0:30–0:36, 6 s)
Refs: none (text to video). The end card text (logo, 「先看见，再改变」) is added in the edit, not generated.

> Vertical 9:16 product film. A large tall portrait smart mirror with a slim brushed-metal bezel on a round metal pedestal stands centre frame, filling about half the frame height, in a seamless studio. Lighting comes ONLY from overhead: three spotlights above snap on one after another and beam down onto the mirror, then hold. There are no lights on or around the mirror frame: no bulbs, no LED strip, no glowing border. The beams light the mirror brightly; a soft highlight sweeps across the clean glass; a pool of light and a reflection on the glossy grey floor; light haze in the beams. The camera slowly orbits and pushes in. No people, no text. Premium, minimal, photoreal, well exposed.
