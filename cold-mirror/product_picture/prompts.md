# Cold Mirror · Product images (Higgsfield prompts)

Source drawing: `../assets/55-inch Custom Mirror Shell Model.pdf`, exported to `refs/drawing.png`.
Target look: **the same standard as apple.com product images** (iMac page, studied 2026-10-15). Precision is the first requirement: every image must look like a flawless, engineering-accurate CG render that could sit next to Apple's own images. A render that is merely "nice" but off in proportion, edges or finish is rejected.

## What "Apple standard" means here (from apple.com/imac)

- **These are CG renders, not studio photos.** Edges are perfectly crisp, surfaces have zero noise, dust, fingerprints, scratches or texture artefacts, and highlights are controlled and gradient-smooth.
- **Calm, precise camera.** Many views are true elevations (flat front, side and top views with no perspective). The rest use a long lens with almost no perspective distortion. Verticals are always perfectly vertical.
- **One plain background with no props.** It is a single flat tone: Apple's light grey `#F5F5F7`, pure white, or (for dark products) pure black `#000000`. There is no visible floor horizon and only a soft contact shadow or none.
- **Product only.** No props, people or text on the image; copy is laid out on the page, never baked in.
- **Delivery format:** progressive JPEG in sRGB with the background built in. The main images are about 3104×2700 (~500 KB). Each image comes in 5 sizes (`xsmall`, `small`, `medium`, `large`, `xlarge`), each also at `_2x`. PNG is used only for icons and UI.

## Geometry workflow (required for every shot)

A prompt plus the drawing alone does not hold the geometry. The first test put the camera at about 1,510 mm and made the base wider than the panel. So every shot goes through these steps (all tools are in `tools/` and need Pillow and NumPy):

1. **Guide.** `guide.py <shot>` builds an exact 3D model from the drawing and renders it from that shot's camera, with the real app screenshot in the window for screen-on shots. It writes `work/guide_<shot>.png` and `work/guide_<shot>.json` (projected key points). Cameras and aspect ratios are in `SHOTS`.
2. **Prompt.** `prompts.py` writes `work/<shot>_prompt.txt` for every shot from the shared blocks below; `REFS` sets the reference images in order.
3. **Generate + check.** `run.py <shot> [attempts]` generates the attempts in parallel and runs `align.py` on each. The aligner runs the same feature detector on the guide and on the render:
   - front views: the mirror window (found as a filled bright region, then its four edges), plus the panel's outer, top and bottom edges;
   - side and rear views: the product's bounding box;
   - the close-up: the panel edge, the window edge and the lens.

   It measures the render's own proportion error, corrects the remaining perspective so the render lands exactly on the guide, and measures again. Pass limits:
   - front views: proportion error ≤ 1.0% before correction and ≤ 0.3% after;
   - side and rear views: box aspect error ≤ 3% before and ≤ 0.3% after;
   - close-up: lens position across the border within 3%.

   The black silhouette must also overlap the guide (IoU ≥ 0.97 front, ≥ 0.90 side, rear and close-up). The overlap ignores a 4 px band along the guide's edges, because the requested strip-light highlights brighten those pixels. On screen-on shots it ignores the window, and it isn't used for 01b (black background) or 08 (salon scene).

   After correction the limit is 0.3% or 6 px, whichever is looser. The detector's own precision at the window bevel is about 4–5 px in every shot, and a small product in a wide scene would otherwise fail on that noise alone.

   **Scenes (08, 09)** are not pulled onto the guide's framing. That would leave gaps at the frame edges and stretch them, and a correction fitted on the panel would also bend the room. Instead the shape correction is applied only over the panel (its front face and side edge, feathered by 3 px), where it moves pixels by about 10 px at most. The base and the room stay exactly as rendered, and the result is measured again on the delivered image (`scene_post_error`).

   The perspective fit is a normalised DLT (Hartley). Without the normalisation it was unstable away from the measured points.

   Attempts are never deleted automatically. A failure is first checked against its overlay (`work/<shot>_<try>_qa_overlay.png`, guide outline in red) and is deleted only if it's a real spec failure. Examples of real failures: proportions off, the panel drawn too thick, or the button on the wrong side edge. `work/<shot>_report.json` keeps the numbers and source URL of the accepted render.
4. **Finish.** `finish.py` corner-pins the real screenshot onto the window of screen-on shots (`refs/screen_*.png`, prepared by `screens.py`, which paints out the cursor, the 小红书 badge and the debug icon). It checks that the size matches the shot's aspect ratio exactly and exports:
   - `final/png/<shot>_<name>.png`
   - `final/jpg/<shot>_<name>.jpg` (progressive, quality 90)

   `final/` holds only finished images; everything else stays in `work/`.

## Model and settings

- Model: **GPT Image 2.5** (`gpt_image_2_5`), `--resolution 4k`, `--quality high`, `--background opaque`.
- Aspect ratios, which the output sizes match exactly:

  | Aspect | Size | Shots |
  |---|---|---|
  | 4:5 | 2560×3200 | 01, 01b, 04, 06, 08 |
  | 3:4 | 2400×3200 | 02, 03, 05 |
  | 1:1 | 3000×3000 | 07 |
  | 16:9 | 3840×2160 | 09 (and its plate 09p) |

- References, in the order passed:
  - image 1 is the shot's guide;
  - image 2 is the accepted shot-01 render, so every angle has the same materials (01b instead uses the shot-01 final as image 1);
  - the last image is `refs/drawing.png`.
- Shot 01 is made first, since every other shot depends on it.

## Product spec (paste into every prompt)

> PRODUCT LOCK. Follow the technical drawing in image 1 exactly. The product is a free-standing 55-inch portrait smart mirror. Copy its proportions exactly; do not restyle, round off, thicken or simplify it.
> - **Panel:** a flat vertical slab, 831 mm wide × 1801 mm tall × only 46 mm deep, with sharp, crisp rectangular edges. The front is a wide black border (satin black) around one mirror window. The panel stands on two short feet just above the base.
> - **Mirror window / display:** a portrait 9:16 window of mirror glass, 680 × 1209 mm, with the display behind it. It is centred left–right in the upper part of the panel. The black border around it is wide: about 73 mm at the left, right and top, and about 515 mm of solid black panel below it (the window's bottom edge is 595 mm above the floor). The border is NOT a thin edge: it reads clearly as a frame about 9% of the panel width on each side.
> - **Camera:** one small round camera lens set in the LEFT black border, centred in the border about 40 mm from the panel's left edge, beside the window, 920 mm above the floor. There is only one camera.
> - **Button:** one small flush button on the right side edge, 1500 mm above the floor.
> - **Base:** a low rectangular plinth, 600 mm wide × 400 mm deep × 50 mm thick, with rounded corners. It is narrower than the panel, so the panel overhangs it left and right. The panel sits near the front edge of the base, and most of the base extends behind it.
> - **Back:** a tall rectangular ladder frame of square steel tube: two vertical rails, a top bar and two crossbars. A small rectangular service box sits in the lowest bay. Two straight diagonal braces run from the rails down to the rear of the base, so the side view is a narrow A-shape.
> - **Size:** about 1.88 m tall overall, a little taller than an adult.
> - **Colour:** the WHOLE product is black: frame, edges, back, braces and base. The base, back frame and braces are matte black; the panel edge is satin black. There is no other colour, no chrome, no wood, no white parts, no logo and no text on the hardware.

## Screen states

- **OFF (mirror mode):** the display is completely invisible. The 680 × 1209 window reads as one clean, true mirror that reflects the scene with crisp, undistorted reflections, framed by the wide black border. There is no glow.
- **ON (demo mode):** the 680 × 1209 window lights up and shows the app screenshot in image 3, filling the window edge to edge in 9:16 portrait, sharp and correctly oriented (not mirrored). The black border stays black. Over the lit area there is a faint reflection in the glass.

> UI accuracy: a model cannot reliably reproduce the app's small Chinese text. For final deliverables, generate the screen-on shots and then corner-pin the real 2160×3840 screenshot onto the display area in post. The generated screen is only a placeholder for lighting and reflections.

Screenshots for screen-on shots (`../assets/screenshot/`):
- `home 页.png`: clean white UI with the black NCGHAE letters and the START button. This is the best hero screen, and it matches the black hardware.
- `换发色成功_2026-10-13_23-15-49.png`: before/after split compare with the 「奶茶粉紫」 chip, the product's key moment. Its bottom-right corner has a 小红书 watermark and a mouse cursor at the left edge; remove both before use.
- `发色库_2026-10-13_23-13-13.png`: hair-colour card grid.

## Precision lock (paste into every prompt)

> HIGH-PRECISION REQUIREMENT. This is an official product image at Apple website quality: a flawless, engineering-accurate, photoreal CG product render, not an artistic interpretation.
> - Geometry must match image 1 to the millimetre in proportion. Every edge is perfectly straight and parallel, every corner is crisp, and the panel is perfectly flat and perfectly vertical.
> - Surfaces are immaculate: no dust, smudges, fingerprints, scratches, seams, warping, noise, grain or AI artefacts.
> - The materials are physically correct: matte black powder-coat on the back frame, braces and base; satin anodised black on the panel edge; real first-surface mirror glass on the front.
> - Reflections and highlights are smooth and gradient-clean, never blotchy or blown out.
> - Edges are tack sharp at native resolution, with clean anti-aliasing and no halos.
> - The proportions, camera lens position and parts must be identical across all images of this product.

## Studio look (paste into every prompt except 08)

> Apple.com product render style. One flat seamless background in Apple light grey #F5F5F7 with no visible horizon line and no gradient banding. Large soft overhead area light plus two tall softbox strip lights left and right. The strip lights draw thin, clean, even highlight lines along the black edges, so the black silhouette and the 46 mm depth read clearly against the background. Only a very soft, short contact shadow under the base. A long-lens, near-orthographic camera (about 100 mm equivalent or longer) with zero distortion and verticals perfectly vertical. Everything is in focus from top to bottom (deep focus, no bokeh). The black stays rich but retains detail and is never crushed to flat black. Clean, minimal, premium and precise. No people, no text, no logos, no props.
>
> Alternative for a dramatic hero: the same lighting on a pure black #000000 background, where only the strip-light edge highlights and the mirror reflections trace the product (Apple's black-product style). Use it for shot 01b only.

---

## 01 — Hero, front 3/4, screen OFF
Aspect `4:5` · Refs: 1 drawing

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK]
> The camera is 30° to the right of the product's front, at chest height (about 1.3 m), looking straight ahead. The whole product is in frame with generous headroom, and it fills about 75% of the frame height. Screen OFF: the mirror front reflects the soft white studio and a gentle vertical highlight gradient; the display area is invisible. The thin black panel edge and the 46 mm depth are visible on the right. The camera lens is just visible on the left of the front. One back brace and the rear of the base peek out behind the panel.

## 01b — Hero on black, front 3/4, screen OFF
Aspect `4:5` · Refs: 1 drawing, 2 hero (01)

> [PRODUCT LOCK] [PRECISION LOCK] Keep the product exactly as in image 2.
> The same camera as image 2. A pure black #000000 background. The product is defined only by thin, clean strip-light highlights running along its panel edges, the top edge, the base edge and the brace, and by one long soft vertical gradient reflection across the mirror glass. Low-key, dramatic and precise, with no haze and no floor visible. Screen OFF.

## 02 — Front, straight on, screen OFF
Aspect `3:4` · Refs: 1 drawing, 2 hero

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> A perfectly frontal, symmetrical view like an elevation drawing: the camera is centred at about 1.0 m high, square to the glass. The base is visible below the panel and narrower than it. Screen OFF: a clean mirror reflecting the bright, soft studio in a smooth gradient, with no reflection of the camera or a photographer. The small round camera lens shows on the left side of the frame at 920 mm, beside the display area.

## 03 — Front, straight on, screen ON (home page)
Aspect `3:4` · Refs: 1 drawing, 2 hero, 3 `home 页.png`

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> Same frontal framing as a straight-on elevation. Screen ON: the display area glows behind the glass and shows the app screen of image 3 exactly (white background, glossy black letters, a central START button). It is bright and evenly lit, with crisp edges, and the area around it and below it stays mirror. The studio is slightly dimmer so the screen reads clearly.

## 04 — Front 3/4 from the left, screen ON (hair-colour result)
Aspect `4:5` · Refs: 1 drawing, 2 hero, 3 `换发色成功` (cleaned)

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> The camera is 30° to the LEFT of the front, at chest height, so the left frame edge and the camera lens at 920 mm are nearest the viewer. Screen ON: the display shows the app screen of image 3, a before/after hair-colour comparison of a young woman split by a thin vertical white line, brown hair on the left and lilac-purple on the right. It is bright and in perspective with the glass. Mirror areas show soft studio reflections.

## 05 — Side profile, screen OFF
Aspect `3:4` · Refs: 1 drawing, 2 hero

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> An exact side elevation from the right, with the camera square to the side at about 1.0 m high. It shows how slim the 46 mm panel is, the small flush button on the right edge at 1500 mm, and the narrow A-shaped silhouette: the straight vertical panel, a diagonal back brace running down to the rear of the base, and the 50 mm base plate extending behind. Rim light outlines the black edges against the light background.

## 06 — Rear 3/4, back structure
Aspect `4:5` · Refs: 1 drawing, 2 hero

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> The camera is behind the product and 35° to its left, at chest height. This view shows the back: the flat matte-black rear of the panel, the tall ladder frame of square black tube (two rails, top bar, two crossbars), the small rectangular service box in the lowest bay, and the two diagonal braces down to the rounded black base. It is clean and engineered, with all-black hardware and no visible cables.

## 07 — Detail, camera close-up
Aspect `1:1` · Refs: 1 drawing, 2 hero

> [PRODUCT LOCK] [PRECISION LOCK] [STUDIO LOOK] Keep the product exactly as in image 2.
> A straight-on macro close-up of the left side of the front at 920 mm height, with the camera square to the panel. Only a frontal view shows the lens as a true circle; at the earlier 30° angle it came out as an ellipse with width/height 0.90. It shows the round camera lens set in the wide black left border, 39.6 mm in from the outer edge (measured on the drawing), the crisp satin-black edge of the panel and the edge of the mirror window. Shallow depth of field, with the lens tack sharp. The display is off.
>
> Check: lens roundness (width/height) within 1 ± 0.03; lens position across the border within 3% of the drawing.

## 08 — Lifestyle, salon, screen ON
Aspect `4:5` · Refs: 1 drawing, 2 hero, 3 `发色库` or `换发色成功`

> [PRODUCT LOCK] [PRECISION LOCK] Keep the product exactly as in image 2.
> A bright, modern, minimal hair salon with white walls, pale oak floor and soft daylight. The black mirror stands on the floor against a white wall, beside a styling chair. The camera is in front and 25° to the right, at eye level. Screen ON: the display shows the app screen of image 3, and the mirror area below reflects the salon. There are no people, the scene is calm and premium, and the reflections are correct. Photoreal.

---

## 09 — Salon scene, wide, screen ON (hair-colour result)
Aspect `16:9` · Two stages: plate `09p` → scene `09` · screen: `refs/screen_color.png`

**Composition:**
- The mirror stands with the back of its base against the wall and serves as the station's styling mirror.
- A customer with long chestnut-brown hair, in a black cape, sits in a cream styling chair about 1.5 m in front of it, facing the screen and seen from behind.
- A hairdresser in a black apron stands behind the chair, one hand on the chair back and the other lifting a lock of hair.

The camera is 35° to the right. Stand-in boxes for the chair and the people, projected through the guide camera, confirmed that they stay clear of the panel in the image while physically in front of it.

**Why two stages:** with people in the scene, GPT Image 2.5 redrew the product in 8 of 8 attempts, at 45° and at 35°. The black area below the screen came out 5–35% too tall, even with explicit proportion wording. So:

1. **`09p`, the plate.** The product alone at 09's exact camera on the studio background (refs: guide, shot-01 final, drawing). Studio renders pass reliably: both attempts were within 1% before correction. The plate is aligned to the guide and kept in `work/` as an intermediate; it is not delivered.
2. **`09`, the scene.** The plate is image 1, and the prompt says to keep the product pixel for pixel and replace only the background. Both attempts kept the product within 0.26%.
3. **Finishing (`finish.py`):**
   - The verified plate product is pasted back through the guide's product mask. The mask is shrunk by 2 px and skips any background-coloured plate pixel, so no studio halo comes along.
   - Then the real screenshot is pasted onto the screen, last, so the model's invented UI text never shows.

**Check on the delivered image:** every point is within 2.4 px (0.18%) of the guide, and the lower-panel proportion is 0.370 against the guide's 0.373.

## Checklist (check every render before accepting it)

- [ ] The panel is a thin slab (46 mm) and not a TV-style box. Its height-to-width ratio is about 2.17 : 1.
- [ ] There is one camera, on the LEFT front frame at about mid-height (920 mm), and not at the top centre.
- [ ] Everything is black: no chrome, silver, white or wood on the product.
- [ ] The black border is wide: about 73 mm at the sides and top and about 515 mm below the window, matching the drawing. Screen OFF shows the 9:16 window as a true mirror; screen ON lights only that window.
- [ ] The base is narrower than the panel, has rounded corners and extends behind it. The rear ladder frame and two braces are present.
- [ ] No invented features: no LED light strip, no speaker grille, no logo, no round pedestal.

**Precision and the Apple standard.** Check these at 100% zoom; one failure means regenerate or retouch.

- [ ] **Measured proportions:** take the image's front view (or, for an angled shot, rectify it to a front view) and measure the panel's height ÷ width. It must be 2.17 ± 0.05. The display is 680/831 ≈ 82% of the panel width.
- [ ] **Edges:** every edge is straight with no wobble, bend or melting. Corners are crisp. Parallel lines stay parallel, and there are no doubled or ghost edges.
- [ ] **Surfaces:** no noise, grain, dust, smudges, banding or AI texture in the black finish or the glass.
- [ ] **Camera:** verticals are perfectly vertical and there is no wide-angle stretching. The camera height and angle match the shot description.
- [ ] **Background:** one flat tone (#F5F5F7, white, or #000 for 01b) with no horizon line, no stray props and no colour cast.
- [ ] **Consistency:** placed side by side, all the images show the identical product (thickness, camera lens, base, frame).
- [ ] **Output:** after the upscale, the image is at least 3000 px on the long side and tack sharp. It is exported as a progressive sRGB JPEG, with the 10 responsive sizes generated.
- [ ] **Next to Apple:** put the image beside an apple.com/imac product image. If it looks less clean or less precise, it is not done.

---

## v2 (2026-10-16): whole front is mirror

The product changed: the **entire front is one-way mirror glass** with only an ~8 mm black lip; the 680 × 1209 display sits behind it. Screen OFF = one uniform mirror; screen ON = only the display area lights up, everything else stays mirror. Shadow style follows `../assets/product_shadow_reference.png` (soft diffuse floor shadow on light grey).

- Output: `final/close/` (screen off) and `final/open/` (screen on), each with `png/` and `jpg/`.
- Tool: `tools/v2.sh off|on|accept|check <shot>` (wraps `tools/v2.py`; prompts, references and checks are in that file). Shot 01 was made by hand with `guide_v2.py`, `window_v2.py`, `screen_on_v2.py`; its screen-off final is the material reference for every other shot.
- Model: GPT Image 2.5, `--variant sunburst`, 4k, high. Outputs are scaled to the spec size (the model returns 2480×3312 for 3:4 and 2880×2880 for 1:1).
- Check: the glass outline (inner edge of the lip) is detected and its corners compared with the guide; max corner deviation ≤ 1% of the image height. Side/rear: bounding-box aspect ≤ 3%.
- Screen ON: real screenshot corner-pinned onto the display area → lighting pass (glow, glass reflection, mirror kept elsewhere) → real screenshot pinned again, so the UI is exact.
- Scenes (08, 09) are built around a verified studio plate (`08p`, `09p`): drawn directly, the model stretched the panel ~12% taller in 4 of 4 attempts of 08.
- Old 03 (front, screen on) is now `02` screen-on.
