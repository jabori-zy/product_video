"""Write work/<shot>_prompt.txt for every shot from shared blocks (see ../prompts.md).

usage: python prompts.py            -> all shots
Reference order per shot is in REFS; align.py and run.sh rely on it.
"""
from pathlib import Path

WORK = Path(__file__).resolve().parent.parent / "work"

GUIDE = ("Image 1 is an exact CAD geometry render of the product from the exact camera of this shot. Reproduce its geometry "
         "EXACTLY, aligned to it pixel for pixel: the same framing, camera angle, perspective, silhouette, proportions and the "
         "position of every part. Do not move, resize, widen, thicken or reshape anything. Only replace the flat CAD shading "
         "with photoreal materials and lighting.")
MATERIAL = ("Image 2 is the approved photoreal render of this same product: match its materials, black finish, edge highlights "
            "and overall render quality exactly.")
DRAWING = "The last image is the original technical drawing (sizes in mm) for extra detail."

PRODUCT = """PRODUCT. A free-standing 55-inch portrait smart mirror, all black.
- Panel: a flat slab 831 mm wide x 1801 mm tall x only 46 mm deep, sharp rectangular edges. The front is a WIDE satin-black border around one portrait 9:16 mirror window (680 x 1209 mm): about 73 mm of black at the left, right and top, and a tall solid black area of about 515 mm below the window. Keep this wide black border exactly; never turn the whole front into a mirror and never make the border thin.
- Camera: one small round camera lens set in the LEFT black border, beside the window, 920 mm above the floor: a glossy dark lens with a thin subtle grey ring. It is the only camera; nothing at the top.
- Button: one small flush button on the right side edge, 1500 mm above the floor.
- Feet and base: the panel stands on two short black feet 30 mm above a low black plinth 600 x 400 x 50 mm with rounded corners. The base is NARROWER than the panel (600 vs 831 mm), so the panel overhangs it on both sides; the panel sits near the front of the base and most of the base extends behind it. The base is one simple flat rounded rectangle with no steps or notches.
- Back: a tall rectangular ladder frame of 40 mm square black tube (two rails, a top bar, two crossbars) with a small rectangular service box in the lowest bay, and two straight diagonal braces from the rails down to the rear of the base.
- Colour: the whole product is black. Base, feet, back frame and braces matte black powder-coat; panel border and edges satin anodised black. No chrome, no silver, no white, no wood, no logo, no text on the hardware."""

PRECISION = ("HIGH-PRECISION REQUIREMENT. Official Apple-website-quality product image: a flawless, engineering-accurate, "
             "photoreal CG render. Every edge perfectly straight and parallel, crisp corners, the panel perfectly flat and "
             "perfectly vertical. Immaculate surfaces: no dust, smudges, scratches, warping, noise, grain or AI artefacts. "
             "Tack-sharp edges with clean anti-aliasing.")

STUDIO = ("STUDIO LOOK. Apple.com render style. Flat seamless Apple light grey #F5F5F7 background, no horizon line, no banding. "
          "Large soft overhead area light plus tall strip softboxes left and right drawing thin clean highlight lines along the "
          "black edges, so the silhouette and the 46 mm depth read clearly. Only a very soft short contact shadow under the base. "
          "Long lens, near-orthographic, verticals perfectly vertical, everything in focus. No people, no text, no props.")

MIRROR_OFF = ("Screen OFF: the window is a pure mirror and the display behind it is completely invisible. The mirror reflects the "
              "bright studio as a smooth vertical gradient from white to soft mid grey with one gentle darker band, so it reads "
              "as real glass, not a flat white panel.")


def screen_on(what):
    return (f"Screen ON: the mirror window glows with the app screen shown in image 1 ({what}), filling the window edge to edge, "
            "bright, sharp, evenly lit and correctly oriented (not mirrored), with a very faint reflection on the glass. "
            "The black border stays black.")


SHOTS = {
    "01": [GUIDE, PRODUCT, PRECISION, STUDIO, MIRROR_OFF],
    "01b": ["Image 1 is the approved render of this product. Keep the product EXACTLY as in image 1, pixel for pixel: same "
            "position, size, perspective, proportions, window, camera lens, feet and base. Change only the background and "
            "lighting.", PRODUCT, PRECISION,
            "BLACK STUDIO. Pure black #000000 seamless background, no floor line, no haze. The black product is defined only by "
            "thin, clean strip-light highlights running along its outer panel edges, top edge, side edge and the base edge, "
            "Apple black-product style. The mirror window reflects one long soft vertical gradient from mid grey to dark grey, "
            "clearly lighter than the black border so the window outline reads crisply. Screen OFF. Low-key, dramatic, precise."],
    "02": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO, MIRROR_OFF,
           "SHOT. Perfectly frontal, symmetrical view like an elevation drawing, camera square to the glass at 1.0 m height."],
    "03": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
           screen_on("the app home screen: white background, glossy black 3D letters N C G H A E, salon tools and a round START button"),
           "SHOT. Perfectly frontal, symmetrical view, camera square to the glass at 1.0 m height. The studio is slightly dimmer "
           "so the screen reads clearly."],
    "04": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
           screen_on("a hair-colour result: a young woman split by a thin vertical white line, brown hair on the left and "
                     "lilac-purple hair on the right, on a light grey app page"),
           "SHOT. Camera 30 degrees to the LEFT of the front at chest height, so the left edge and the camera lens are nearest. "
           "The left side edge of the panel is visible as a THIN sliver: the panel is only 46 mm deep, so this edge is exactly as "
           "narrow as in image 1, never a thick slab. It is completely plain (no button, no port); the button is on the right "
           "side edge, which is hidden from this angle."],
    "05": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
           "SHOT. Exact side elevation from the right, camera square to the side at 1.0 m height. It shows how slim the 46 mm "
           "panel is, the small flush button on its right edge, the back ladder frame rail just behind the panel, the straight "
           "diagonal brace running down to the rear of the base and the 50 mm base plate extending behind: a narrow A-shaped "
           "silhouette. Rim light outlines every black edge against the light background."],
    "06": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
           "SHOT. Camera behind the product and 35 degrees to its left, at chest height. It shows the flat matte black back of "
           "the panel, the tall ladder frame of square black tube (two rails, top bar, two crossbars), the small rectangular "
           "service box in the lowest bay, the two diagonal braces down to the rounded black base. Clean and engineered, all "
           "black, no cables. Edge highlights separate the frame tubes from the panel back so every part reads. The panel side edge "
           "visible on the right of the image is the LEFT side edge and is completely plain: no button, no port (the only "
           "button is on the opposite side edge, hidden here)."],
    "07": [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
           "SHOT. Straight-on macro close-up, camera square to the front (looking perfectly perpendicular at the panel), "
           "of the left part of the front at 920 mm height: the wide satin-black left border with the "
           "small camera lens (glossy dark glass, fine grey ring) at its centre, a PERFECT CIRCLE exactly as round as in "
           "image 1, never an oval, the panel's crisp outer edge on the left "
           "and the edge of the mirror window on the right. The mirror shows a soft studio gradient. Shallow depth of field "
           "with the lens tack sharp. Screen OFF."],
    "08": [GUIDE, MATERIAL, PRODUCT, PRECISION,
           screen_on("the hair-colour library: a grid of hair-colour cards on a light grey app page"),
           "SCENE. Keep the product exactly where and how it is in image 1, and build a bright, modern, minimal hair salon "
           "around it: white walls, pale oak floor, soft daylight from a large window on the left, a cream styling chair and a "
           "small white side table with a plant to the left of the mirror, nothing in front of the product. Calm, premium, "
           "photoreal interior photograph with correct reflections and a soft contact shadow under the base. No people."],
}

SHOTS["09"] = [GUIDE, MATERIAL, PRODUCT, PRECISION,
               screen_on("a hair-colour result: a young woman split by a thin vertical white line, brown hair on the left "
                         "and lilac-purple hair on the right, on a light grey app page"),
               "SCENE. Wide 16:9 interior photograph of a premium, modern hair salon at a styling station. Keep the product "
               "exactly where and how it is in image 1 and build the scene around it. The smart mirror stands on the floor "
               "with the back of its base touching a warm white wall, used as the styling mirror of this station; a slim "
               "wooden console with a few neat hair products runs along the wall beside it. A young woman with long, wavy "
               "chestnut-brown hair, wearing a black styling cape, sits in a cream leather hydraulic styling chair directly "
               "in front of the smart mirror, about one and a half metres from it, facing it and looking at her hair-colour result on "
               "the screen; she is seen from behind and the side, her face is not shown. A hairdresser in a black apron "
               "stands right behind her chair, one hand on the chair back, the other lifting a lock of her hair, also "
               "looking at the screen. Because the camera is to the side, the woman, the chair and the hairdresser appear "
               "to the LEFT of the smart mirror in the picture and do not overlap any part of it: its whole front, window, "
               "edges, feet and base stay fully visible. The panel stands on its two short black feet with a clearly "
               "visible open gap above the base, exactly as in image 1: the gap is more than half as tall as the base "
               "plate is thick (30 mm gap, 50 mm plate), the two square feet show inside it, and the floor and wall are "
               "visible through it at the left end. The panel's bottom edge never sinks toward the base. Keep the panel's "
               "proportions exactly: the solid black area below the screen is well under half the screen's height "
               "(515 mm below a 1209 mm screen), never taller. Pale oak floor, soft daylight, other styling "
               "stations softly out of focus in the background, a few green plants. Photoreal interior photography, "
               "natural colours, correct reflections, a soft contact shadow under the base. No text, no logos, no brand "
               "names."]

SHOTS["09p"] = [GUIDE, MATERIAL, PRODUCT, PRECISION, STUDIO,
                screen_on("a hair-colour result: a young woman split by a thin vertical white line, brown hair on the "
                          "left and lilac-purple hair on the right, on a light grey app page"),
                "SHOT. Camera 35 degrees to the right of the front at eye height, the product right of centre in a wide "
                "16:9 frame, exactly as in image 1. Its right side edge with the small button is visible."]
SCENE_09 = SHOTS["09"][-1]
SHOTS["09"] = ["Image 1 is a finished, approved photo of the product in a wide 16:9 frame. Keep the product EXACTLY as it is "
               "in image 1, pixel for pixel: same position, size, perspective, proportions, screen content, edges, feet "
               "and base. Do not redraw, move, resize or restyle it. Replace only the plain studio background around it "
               "with the scene described below, and add the people and furniture without covering any part of the product.",
               SCENE_09]

REFS = {  # image order after the prompt; "final:01" = the accepted final of shot 01; "plate:09p" = accepted aligned plate
    "01": ["guide", "drawing"],
    "01b": ["final:01", "drawing"],
    **{s: ["guide", "final:01", "drawing"] for s in ("02", "03", "04", "05", "06", "07", "08", "09p")},
    "09": ["plate:09p"],
}


def main():
    WORK.mkdir(exist_ok=True)
    for s, blocks in SHOTS.items():
        text = "\n\n".join(blocks)
        if REFS[s][-1] == "drawing" and DRAWING not in text:
            text += "\n\n" + DRAWING
        (WORK / f"{s}_prompt.txt").write_text(text + "\n")
    print("wrote", ", ".join(SHOTS))


if __name__ == "__main__":
    main()
