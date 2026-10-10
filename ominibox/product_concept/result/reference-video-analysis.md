# Reference Video Analysis

> All three reference videos are 16–19 seconds long at 60 fps, with no voiceover—only music and on-screen text. The analysis below follows frame samples taken at 0.25–0.5-second intervals.

---

## 1. Product Intro Camera Transitions (LuxAlgo, 17.9 s, 1920×1080)

File: `../reference/product-intro-camera-transitions.mp4`

**In one sentence:** dark UI is filmed like a physical object. The virtual camera keeps moving with 3D tilts, push-ins, and whip pans, supported by shallow depth of field and motion blur, with almost no hard cuts.

| Time | Visual | Camera / transition |
|---|---|---|
| 0–1.5 s | Details of an order book and candlestick chart | Slow push into a perspective-tilted UI plane; blurred frame edges |
| 1.5–2.5 s | "Indicators" toolbar and nine-grid layout button | Extreme close-up with a steep tilt; cursor clicks; heavy background blur |
| 2.5–3.5 s | Multi-panel layout → radial menu | Pull back to reveal the layout, then push into the radial menu |
| 3.5–4.2 s | Highlighted radial-menu sector | **Whip pan with motion blur**: the camera circles the menu like a 3D object |
| 4.2–5.5 s | Ray → Rectangle sector | Highlighted sector follows the cursor; labels enlarge |
| 5.5–6 s | A rectangle is drawn on the chart | Cut directly back to the chart to show the action's result |
| 6–7.5 s | "+ Panels" button → Watchlist panel | Button close-up → panel slides out; a brief flash and dimming |
| 7.5–10.5 s | Indicators → LIBRARY → LuxAlgo → indicator cards | "Push where you click": each click drives the camera toward that element, where the next interface unfolds |
| 12–15 s | AI input "Give me a signal…" → Thinking… → AI response and chart signals | Input close-up; pull back to a three-column wide view as the response streams on the left |
| 15–17 s | Wide view; "Built for you." | Italic white words appear over the UI one by one; the camera slowly retreats |
| 17–17.9 s | LuxAlgo logo | Gray-white radial gradient; logo letters appear one by one |

**Techniques to borrow**

- **Camera language:** UI planes use `rotateX/rotateY` perspective; the camera keeps pushing slowly, without static shots.
- **Alternate close-ups and wide shots:** buttons and menus receive extreme close-ups at 3–5× magnification with depth-of-field blur; results are shown wide.
- **Click-driven transitions:** cursor click → push into the click point → next interface unfolds there, making cause and effect clear.
- **Whip pans with motion blur:** connect different interfaces in about 0.3 s.
- **Dark UI with saturated accents:** blue sectors and red/green candles; dark areas dominate the frame.
- **Ending:** a short slogan overlays the full UI, followed by the brand logo.

---

## 2. Product Feature Intro (Infinity AI V3, 16.5 s, 1920×1080)

File: `../reference/product-feature-intro.mp4`

**In one sentence:** black, white, and orange. Large typography alternates with minimal white UI in a launch-event-style rapid montage; the text itself is the lead.

| Time | Visual | Camera / transition |
|---|---|---|
| 0–1.5 s | Black background, small white "Introducing," thin circular outline | Minimal opening; the thin circle rotates slowly |
| 1.5–3 s | Orange gradient sphere fills the screen; "Based" | **Expanding-color transition:** the sphere expands, changing the background from black to orange |
| 3–4 s | Giant "V3" in orange gradient, orange spheres on both sides | Large-type impact |
| 4–5 s | White background; "See what moves the market" | Hard cut to white; subtle 3D perspective drift in the text |
| 5–7.5 s | Macro calendar cards (Nonfarm / PPI / Jobless) → full list | Card close-up → pull back to a list with a red "NOW" timeline |
| 7.5–10.5 s | NEWS → Financial Juice → news list | **Typewriter and cursor** reveal letters; list rows fade in sequentially |
| 10.5–12 s | Bottom tabs "Macro / Traders / Markets / For You" and ∞ icon | Selection slides across tabs; the others fade away, leaving the icon |
| 12–12.5 s | Small red ∞ dot centered on white | All elements contract into a dot |
| 12.5–14.5 s | "Explore" and "smarter" appear word by word | **The dot bursts into a blurred orange sphere**, transitioning to black; orange light arcs around it, with one word per composition |
| 14.5–16.5 s | "with Infinity AI" and ∞ logo | Light ribbon contracts into the logo ring |

**Techniques to borrow**

- **Restrained palette:** black, white, and one brand accent (orange), used only for glowing spheres, ribbons, and the logo.
- **Large words, one at a time:** split the slogan into words, one per beat, large and centered.
- **Shape transitions:** dots, spheres, and ribbons carry transitions (dot → sphere → full screen), expressing the brand more distinctly than a plain mask.
- **White UI sections:** borderless cards, generous whitespace, and light shadows explain concrete features.
- **Typewriter effects** reveal headings and searches.
- **Resolve into the icon:** UI elements gradually disappear until only the brand icon remains, then transition to the ending.

---

## 3. Component Morph Transitions (Motion Study, 18.8 s, 2048×1080)

File: `../reference/component-morph-transitions.mp4`

**In one sentence:** a black capsule continuously morphs at the center of an off-white canvas: button → spinner → checkmark → player → progress bar → toggle → segmented control → data card. One element throughout, with no cuts.

| Time | Component change |
|---|---|
| 0–1 s | "Generate" button → click → contract into a circle → loading spinner → checkmark |
| 1–2 s | Checkmark circle stretches into a waveform capsule → expands into a player card with gradient cover, title, and progress bar |
| 2–3.8 s | Click play and drag the progress bar |
| 3.8–5 s | Card flattens into a volume bar; drag the volume |
| 5–6 s | Volume bar contracts into a toggle; clicking switches black and white |
| 6–7 s | Toggle stretches into a Day / Week / Month segmented control; selection slides |
| 7–9.5 s | Segmented control grows into a white data card: numbers roll from 72,060 to 84,320, a line chart draws in, and a tooltip follows |
| 9.5–11.5 s | Card shrinks into a dropdown menu; select an item |
| 12–13 s | Menu folds back into the "Generate" button, returning to the opening for a loop |
| 13–18.8 s | Hold on the data card to demonstrate hover interaction |

**Techniques to borrow**

- **Shared-element morph:** spring-interpolate the previous component's outline—corner radius, width, height, and color—into the next, while crossfading content. This is one of the most accessible ways to achieve a polished result in Remotion.
- **Spring physics:** a slight bounce on every morph (spring damping about 12–15); clicks first scale the component to about 0.95, then spring back.
- **The cursor drives the story:** a realistic macOS cursor, eased trajectories, and press feedback.
- **Rolling numbers and drawing lines:** use `interpolate` for number rolls and SVG `strokeDashoffset` for the chart.
- **Minimal canvas:** off-white, approximately `#EDEDEA`, with black components and no decoration.
- **Return to the beginning:** start with a button and end with the same button.

---

## 4. Combined Direction for the OmniBox Video

| Source | Borrowed techniques | Application in the OmniBox video |
|---|---|---|
| Reference 1 | 3D perspective and camera movement; click-driven transitions; whip-pan motion blur; alternating close-ups and wide shots | Film the browser, Zhihu page, and dark OmniBox interface in 3D space; use extreme close-ups for the extension icon and "Save to Xiaohei" |
| Reference 2 | Black and white with one accent; word-by-word typography; dot or sphere transitions; typewriter effects | Use Xiaohei's black and cream (`#F5EFE3`) with OmniBox blue; reveal slogans word by word; replace the ∞ dot with Xiaohei's **eye rings** for shape transitions |
| Reference 3 | Shared-element morphs, spring bounce, cursor-led storytelling | "Save to Xiaohei" button → loading → checkmark → resource card flying into the sidebar; composer morphs into an answer card |

**Pacing recommendation:** the references change visuals roughly every 0.5–1.5 s, with major sections lasting 3–5 s. A 45-second video should contain about 8–10 sections and more than 30 visual changes, with no shot static for longer than 1.5 s.

---

## 5. Real App Recordings (OmniBox Mobile)

Files: `../assets/omnibox-mobile-feature-overview.mp4` (17.4 s) and `../assets/omnibox-mobile-chat-demo.mov` (26.5 s), both 1284×2778 screen recordings of the iOS app in dark mode. Frames were sampled every 2–3 s and checked against the app source (`import-ai/omnibox-react-native`). They are the reference for the phone UI in `script-add_more_app.md`.

| Screen | What the recordings show | Source in the app code |
|---|---|---|
| Home header | Space avatar and name with ⌄, a blue Upgrade pill, gift, bell (red dot), settings | `HomeNamespaceHeader`, `HomeNotificationEntry` |
| Mascot and composer | Outlined Xiaohei peeks at the left; a recommended question sits in a bubble beside it; composer "Ask anything" with ＋, ✋ ⌄, "Agent 2.1 Low" and a round send button | `HomeMascot`, `RecommendedQuestions`, `ChatInput` |
| Content tabs | Centered capsule toggle Resources \| Chats; the selected half is a lighter pill | `HomeContentTabs` (h-10) |
| Resources | Toolbar (search, refresh, sort); "Private ⌄" section; rows with type icons (Zhihu, PDF) | `HomeResourceList`, `HomeResourceToolbar` |
| Chats | Groups Today / dates; each row a speech-bubble icon and title | `ChatHistoryList` |
| Bottom bar | Floating capsule More · Record · Text over a fade mask, visible on every home state | `BottomTabBar` (258×60) |
| More options | Bottom sheet: Photo / Upload file / Link rows in a rounded card, then Cancel | `MoreEntrySheet` |
| Chat thread | Header ‹ title, share, blue ＋, ···; date separator; gray user bubble on the right; Reasoning ⌄, Tool Calls with Web Search chips; composer at the bottom with "Generated by OmniBox AI" | `chat/*`, `messages/*` |
| Typing | System Chinese IME (pinyin candidates) over the home screen | — |

**Techniques to borrow for the video**

- Keep the phone in **dark mode** to match both the recordings and the dark OmniBox web UI, so the PC ↔ phone handoff reads as one product.
- Show the **floating bottom bar** in every home shot; it is the most recognizable mobile element.
- Use the real sheet pattern (slide up from the bottom over a dimmed page) for More, Record and Citations.
