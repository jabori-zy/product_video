# Cold Mirror poster · Prompt and production plan

An Apple-style product poster that follows `../../assets/apple_style_product.PNG` (the AirPods Max poster): the logo, product name and slogan at the top, the product centred on near-white, and three icon features split by thin dividers at the bottom. Copy: `Function slogan.md`.

## Format

- **Size:** 3:4 portrait, 2400 × 3200, delivered as progressive JPEG plus PNG in `poster/final/`. The reference poster (with the phone screen's black bars removed) is also about 3:4.
- **Background:** near-white #F8F8F8, flat, like the reference (sampled at 248–249). Our product image `02_front_mirror` sits on a light grey (#E8E9EB, sampled), so the poster re-lights the product onto near-white with the same soft shadow style.
- **Type:**
  - Latin: SF Pro Display.
  - Chinese: PingFang SC.
  - Colours: near-black #1D1D1F for titles, grey #6E6E73 for sublines.
  - Dividers: thin #D2D2D7 hairlines.

## Layout (fractions of poster height, measured on the reference)

| Element | Vertical position | Size |
|---|---|---|
| Lychee icon | centre at 9% | 5% of height, black |
| "Cold Mirror" | baseline at 17.5% | cap height about 3.6%, Semibold |
| Slogan 「先改变，再看见。」 | baseline at 22% | about 2% character height, Regular, #1D1D1F |
| Product (02 front view, base included) | from 26% to 80% | centred; the mirror is tall, so wide white space at the sides is intended |
| Feature icons | centre at 85% | about 2.6% of height, 2 px-weight line icons |
| Feature titles | baseline at 88.5% | about 1.3% character height, Medium |
| Feature sublines | baseline at 90.5% (and 92.2% for line 2 of column 3) | about 1.1% character height, Regular, grey |
| Dividers | x at 37% and 63%, from 84% to 92% | hairline |

The three columns are centred at x = 21%, 50% and 79%.

## References passed to the model (in order)

1. **Layout reference:** `apple_style_product.PNG` cropped to the poster area (black phone bars removed): `poster/refs/layout.png`.
2. **Product:** `final/close/png/02_front_mirror.png` (2400 × 3200).
3. **Logo:** `cold-mirror-icon.png` converted to a black lychee on white: `poster/refs/icon_black.png`.

Steps 1 and 3 are prepared with Pillow before generating.

## Prompt (GPT Image 2.5, `--variant sunburst`, `--aspect_ratio 3:4`, `--resolution 4k`, `--quality high`)

```
Design an official Apple-style product poster, 3:4 portrait, exactly following the layout, spacing and typography of
image 1 (an Apple AirPods Max poster), but for a different product. Clean, minimal, premium, lots of white space.

BACKGROUND. One flat, seamless near-white background #F8F8F8, no gradient, no texture, no horizon line.

TOP, centred, in this order (same positions and sizes as the logo, product name and tagline in image 1):
- The logo from image 3: a solid black lychee silhouette (a round, scalloped fruit with a short curved stem at the
  top right), exactly that shape, in place of the Apple logo. Do NOT draw an Apple logo.
- The product name "Cold Mirror" in a clean geometric sans serif like SF Pro Display Semibold, near-black #1D1D1F.
- Below it the tagline in Chinese, exactly: 「先改变，再看见。」 in a clean Chinese sans serif like PingFang SC Regular,
  near-black, smaller.

PRODUCT, centred in the middle of the poster: the product from image 2, kept EXACTLY as it is (same front view,
proportions, thin black frame, full-front mirror, small camera lens on the left edge, black base): a tall free-standing
smart mirror, 831 x 1801 mm, whose whole front is mirror glass. Do not redraw, restyle, crop, stretch or rotate it. Place
it on the near-white background with a soft, diffuse floor shadow under and slightly behind the base, like the soft
shadow under the headphones in image 1. The mirror reflects only a soft, bright, empty studio gradient. It spans from
about 26% to 80% of the poster height.

BOTTOM, a row of three features in three equal columns separated by two thin light grey vertical hairlines, like the
three features at the bottom of image 1. Each column: a simple black line icon on top, a short bold title, and a smaller
grey subline. Exact text:
- Column 1: icon = a camera lens (two concentric circles). Title 「4K 高清摄像头」. Subline 「发丝毕现，清晰呈现」.
- Column 2: icon = a tall rounded-rectangle mirror with two small diagonal shine lines. Title 「高级镜面」. Subline
  「质感高级，通透清晰」.
- Column 3: icon = a microchip (rounded square with short pins on all sides). Title 「自研模型」. Subline line 1
  「真人还原，无 AI 感」, line 2 「40 秒真实换发」.

TYPOGRAPHY. Every character must be spelled exactly as given, crisp, correctly formed, perfectly horizontal and centred
in its column. No other text, no prices, no watermark, no Apple logo, no extra icons. Flat graphic design, crisp vector
type and icons, photoreal product, Apple.com marketing quality.
```

## Checks after generation

1. **Text:** compare every string, character by character, with `Function slogan.md`. GPT Image 2.5 is good with large type, but the small sublines are the risk.
2. **Product:** its proportions must match `02_front_mirror`. Run the v2 glass check (`tools/v2.py`, `detect_glass`) on the product region after scaling it back to the 02 frame. The deviation must be at most 1%, the camera lens must be on the left, and the whole front must stay mirror.
3. **No Apple marks.** The lychee shape must match the icon.

## Fallback: exact assembly

If the text or the product drifts, build the poster deterministically, the same way the screen-on shots use the real UI:

1. Generate only the **product on near-white** with GPT Image 2.5: 02 re-lit onto #F8F8F8 with a soft shadow, and the product region checked against 02.
2. Set all type and icons in code (Pillow), using the macOS system fonts: PingFang SC for Chinese and SF Pro / Helvetica Neue for "Cold Mirror". The icons are drawn as vector shapes and the lychee comes from the PNG. Positions follow the layout table above.

Every character is then guaranteed exact, and the product stays pixel-identical to the approved render.

## Result (2026-10-16)

- The GPT Image 2.5 pass (`work/try1.png`, `work/try2.png`) got the layout and every character right, but it left soft white halos around the type and icons and a faint texture in the background.
- The delivered poster `final/cold-mirror_poster.{png,jpg}` (2400 × 3200) is therefore the exact assembly: `tools/poster.sh [product.png] [name]` (wraps `tools/poster.py`), using the layout positions measured on try1.
  - **Product:** the approved 02 render, normalised onto #F8F8F8 so it keeps its own soft shadow (seam within ±1 grey level).
  - **Type:** SF Pro for Latin and digits, Hiragino Sans GB for Chinese, since PingFang SC isn't installed on this machine.
  - **Logo and icons:** the real lychee icon, plus vector line icons.
- `final/cold-mirror_poster_3.{png,jpg}` uses the same layout with the M04 trio (`final/multi_angle/png/M04_trio-v.png`), fitted to 2000 px wide and centred vertically in the product area. The product layer keeps only the units plus the floor shadow near them and fades to flat #F8F8F8 beyond that, which removes a faint horizon streak in the M04 render that otherwise ran to the poster's edge.
