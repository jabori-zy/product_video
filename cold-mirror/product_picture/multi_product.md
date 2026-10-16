# Cold Mirror · Multi-product views (arrangement and angle design)

Several Cold Mirror units in one image, shown from different angles. This builds on the v2 single-product set (`final/`, see the v2 section of `prompts.md`): the same product, materials, studio and shadow style. Generation comes after this design is approved.

## What we take from the references

`../assets/product_display_angle_reference/` (5 sheets of phone mock-ups) use five arrangement patterns:

| Reference pattern | Use for Cold Mirror? |
|---|---|
| Front + back side by side, both upright, soft shadow to one side | **Yes:** the clearest way to show both faces |
| Two units staggered, one square to camera, one turned | **Yes** |
| Three units overlapping in depth (one in front, two behind) | **Yes**, at floor level |
| Repeated units in a rhythmic row or grid | **Yes**, as a standing showroom row seen from a low or high camera |
| Tilted, floating or falling units; flat-lay on a surface | **No:** the mirror is a 1.88 m floor-standing unit. Showing it tilted, floating or lying down would misrepresent it |

The look carries over unchanged: a light neutral grey seamless studio, soft diffuse floor shadows all falling the same way (see `../assets/product_shadow_reference.png`), product only, no props.

## Rules for every composition

- **Upright on the floor.** Every unit stands on its base on one shared floor plane, with verticals perfectly vertical. Units are never tilted, stacked, floating or lying down.
- **Rotation is free.** Each unit can turn to any yaw: front, 3/4, side, back or rear 3/4.
- **Physically plausible spacing.** Bases never intersect: each footprint is 600 × 400 mm, and each panel is 831 mm wide and overhangs its base. Panels stand at least 250 mm apart. A unit may partly hide another one behind it, but every unit's base stays at least partly visible, so nothing appears to float.
- **One light, one shadow direction.** A key light from the front left, so every shadow falls back and to the right. Each unit has its own contact shadow, and the units' shadows overlap naturally.
- **Screen states:**
  - **OFF** = the whole front is one mirror.
  - **ON** = only the 680 × 1209 display area is lit and the rest stays mirror. Screen content is one of `home`, `color` (hair-colour result) or `library` (colour library).
  - Mixing OFF and ON units in one image is encouraged: it shows both states at once.
- **Mirrors reflect the studio only,** never the other units. Mutual reflections between units read as clutter and are hard to keep consistent.
- **Camera:** a long lens (near orthographic), with the eye height given per composition. The camera tilts down only in M08; elsewhere a vertical shift keeps verticals vertical.

## Coordinates used below

- **Floor plan:** x is to the right and z is toward the camera, in mm. A unit's origin is the centre of its panel's front face at floor level.
- **Unit yaw:** 0° = facing the camera (front visible), 180° = back to camera (ladder frame visible). Positive yaw turns the unit's front toward the image right, so at camera azimuth 0° yaw −90° shows the **right** side edge (button) and +90° shows the plain left side.
- **Camera:** given as azimuth (0° = straight along −z), eye height, distance and how much of the frame height the tallest unit fills.

---

## M01 · Front and back pair (flat)

The reference's main front + back image. It answers "what does the back look like?" at a glance.

- **Units:**
  - A at x = −560, yaw 0°, **OFF**;
  - B at x = +560, yaw 180° (back: ladder frame, braces, service box).
- **Camera:** azimuth 0°, eye 1000 mm, the units fill 72% of the frame height.
- **Aspect:** 4:3 landscape, 3200 × 2400.
- **Shadow:** falls to the back right; B's frame tubes cast thin soft shadows on its panel back.

```
        [ B ]      <- back to camera
 [ A ]             A front, B back, side by side, same depth
   ^ camera
```

## M02 · Front and back pair (3/4)

M01 turned: the same pair seen from 30° to the right, so the 46 mm depth, the base overhang and the braces all read.

- **Units:**
  - A at (−600, 0), yaw −30° (front 3/4), **ON · home**;
  - B at (+600, −250), yaw 150° (rear 3/4).
- **Camera:** azimuth 0°, eye 1300 mm, fill 70%.
- **Aspect:** 4:3, 3200 × 2400.

## M03 · Staggered duo, ON + OFF

Like the reference's pair of upright phones offset in depth. It shows the two screen states side by side.

- **Units:**
  - A (front) at (−250, +350), yaw 0°, **ON · color**;
  - B (behind) at (+450, −450), yaw −20°, **OFF**.
- B's left edge sits behind A's right edge by about 120 mm in the image, and B's base and lens stay visible.
- **Camera:** azimuth 20°, eye 1300 mm, fill 75% (A).
- **Aspect:** 4:5 portrait, 2560 × 3200, matching the hero series.

```
          [ B ]   (OFF, turned 20 deg)
   [ A ]          (ON, square to camera, in front)
      ^ camera, 20 deg to the right
```

## M04 · Trio in a V

Like the reference's three phones in depth: one hero unit forward with two flanking units behind, all turned toward the centre.

- **Units:**
  - C (centre) at (0, +500), yaw 0°, **ON · home**;
  - L at (−950, −300), yaw +25°, **OFF**;
  - R at (+950, −300), yaw −25°, **ON · library**.
- **Camera:** azimuth 0°, eye 1200 mm, fill 70% (C).
- **Aspect:** 16:9, 3840 × 2160.

```
 [ L ]           [ R ]     both turned toward the centre
        [ C ]              hero, in front
          ^ camera
```

## M05 · Rotation sequence (front → side → back)

A heavy device can't be picked up and turned, so this image does the turntable instead: five identical units in a row, each turned a further 45°.

- **Units:** at x = −2400, −1200, 0, +1200, +2400 (z = 0), with yaw 0°, −45°, −90°, −135°, 180°. All are **OFF**, so the image is about form, not screens.
- **Camera:** azimuth 0°, eye 1000 mm, fill 55%.
- **Aspect:** 21:9, 3840 × 1646.
- **What it shows:** reading left to right, the mirror front, the 3/4 front, the side elevation (46 mm panel, button at 1500 mm, A-frame), the rear 3/4 and the full back.

## M06 · Showroom row

The reference's repeated-row rhythm, standing: six units in a straight line, all at the same angle, receding in perspective.

- **Units:** six units along a line at 30° to the image plane, 1100 mm apart, all yaw 30°. Front to back: ON · home, OFF, ON · color, OFF, ON · library, OFF.
- **Camera:** azimuth −15°, eye 1400 mm, about 6 m from the first unit. The first unit fills about 70% of the frame height and the last one about 40%.
- **Aspect:** 16:9, 3840 × 2160.
- **Rhythm:** alternating ON and OFF reads as a retail display and shows that every unit can be either.

## M07 · Profile and structure

The engineering view: one unit in exact side profile next to one in rear 3/4, so the slim panel and the steel frame sit together.

- **Units:**
  - A at (−500, 0), yaw −90° (right side, button visible);
  - B at (+600, −300), yaw 215° (rear 3/4 from the left).
- **Camera:** azimuth 0°, eye 1000 mm, fill 75%.
- **Aspect:** 4:3, 3200 × 2400.
- **Lighting:** rim light on every black edge, as in shot 05.

## M08 · High-angle overview

Instead of the reference's flat-lay, the camera rises. Three units stand in a staggered diagonal and the view looks down on them, showing the base footprints, the overhang and the shadow pattern.

- **Units:** placed on a diagonal receding from the camera at (−1000, +1100), (0, 0) and (+1000, −1100), all yaw 25°. Front to back: OFF, ON · color, OFF.
- **Camera:** azimuth 0°, eye 3600 mm, aimed down at the group (about 20° tilt), 8 m away. This is the only view with a camera tilt: verticals converge slightly downward, as in an architectural overview.
- **Aspect:** 4:5, 2560 × 3200.

---

## Summary

| ID | Arrangement | Units | Angles shown | Screen states | Aspect |
|---|---|---|---|---|---|
| M01 | Front + back, flat | 2 | front, back | OFF | 4:3 |
| M02 | Front + back, 3/4 | 2 | front 3/4, rear 3/4 | ON home | 4:3 |
| M03 | Staggered duo | 2 | front, 3/4 | ON color + OFF | 4:5 |
| M04 | Trio in a V | 3 | front, ±25° | ON home, ON library, OFF | 16:9 |
| M05 | Rotation sequence | 5 | 0° → 180° every 45° | OFF | 21:9 |
| M06 | Showroom row | 6 | 30°, receding | alternating ON / OFF | 16:9 |
| M07 | Profile + structure | 2 | side, rear 3/4 | — | 4:3 |
| M08 | High-angle overview | 3 | 30° from above | ON color + OFF | 4:5 |

Together these cover every face (front, back and side), both screen states, all three app screens, and the arrangement types from the references that suit a floor-standing product.

## Production plan (after approval)

1. **Multi-unit guide.** Extend `tools/guide.py` with a `UNITS` list of (x, z, yaw, state) per composition, rendering every unit through one camera with a shared z-buffer. M08 also needs camera pitch. It writes `work_multi/guide_<id>.png` and the projected glass and display corners for each unit.
2. **Screen-off render.** GPT Image 2.5 sunburst at 4k, high quality. References: the guide, the v2 hero (`final/close/png/01_hero_front-3q_mirror.png`) for materials, the shadow reference, and the drawing.
3. **Check each unit.** For units whose front is visible, detect the glass outline and require the corner deviation to be at most 1% of image height. For back and side units, check the bounding box. Every unit must be present, upright and correctly turned.
4. **Screen-on units.** Pin the real screenshot onto each ON unit's display area, run one lighting pass for the whole image, then pin the real UI again. This is the same method as `v2.py on`.
5. **Fallback for crowded images.** If a crowded image (M05, M06) makes the model redraw or stretch units, render each unit as a single-product plate at its own camera and composite the plates onto one floor with shared shadows. That is the same plate approach that fixed shots 08 and 09.
6. **Output:** `final/multi_angle/png|jpg/M0x_<name>.{png,jpg}`. Tool: `tools/multi.sh guide|off|on|accept <id>` (`tools/multi.py`; framing is fitted automatically to the arrangement).

## Open choices (defaults chosen; change them here before generating)

- **Screen content per unit:** the defaults above spread `home`, `color` and `library` across the set.
- **M05 and M06** are the most likely to need the plate fallback (5–6 units each). If only a few images are wanted first, start with M01, M03, M04 and M05.
