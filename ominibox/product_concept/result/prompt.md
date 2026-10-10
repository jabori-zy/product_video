# Xiaohei OmniBox · Product Intro Production Prompt v1 (Remotion · 45 Seconds · No Voiceover)

> Companion files: `script.md` for the storyboard and authoritative timing, `product-features-and-slogans.md` for on-screen copy, and `reference-video-analysis.md` for style analysis.
> Assets: `../assets/xiaohei-character.jpg` (six views of the cat head); the four actual recordings in `../assets/*.mp4` and `../assets/*.mov` are **UI references only, not final footage**.
> Reusable project: `../../product_tutorial/` (Remotion 4.0.529, TransitionSeries, timing.json, and the music script).
> This is an English translation of the original Chinese-language production brief. Quoted screen copy is translated for the reader; the original Chinese IME choreography is described in English.

---

## 1. Complete Prompt for the Agent

```text
Use Remotion 4 to create a 45-second Chinese-language product intro for Xiaohei OmniBox.
Specifications: 1920×1080, 60 fps, 2700 frames, loudness −14 LUFS.
No voiceover or vocals: music, sound effects, and on-screen text only.
Follow ominibox/product concept/result/script.md exactly for the storyboard.
Do not change the on-screen wording; use the ★ entries in product-features-and-slogans.md.
The quoted copy in these English documents is translated from the original Chinese brief.

[PRODUCT] Xiaohei OmniBox, your AI knowledge companion.
Slogan: Everything becomes memory. Memory becomes everything.
[STRUCTURE] Eight sections corresponding to Capture · Understand · Apply · Open:
  A Opening, "Hello, Xiaohei!": type on black → Xiaohei peeks from the left, bounces out,
    hops onto the text, and blinks → Xiaohei and text enter the composer together →
    send and receive Xiaohei's reply (0–5 s).
  B One-click saving with the browser extension (5–9 s).
  C Rapid montage of capture sources (9–12 s).
  D Understand · Everything becomes memory (12–18 s).
  E Apply · Q&A, writing, and agent execution (18–30 s).
  F Sharing and collaboration (30–35 s).
  G All platforms and open source (35–39 s).
  H Slogan and logo (39–45 s).

[STYLE] Combine the three references; see reference-video-analysis.md:
  1. LuxAlgo camera: every UI is a plane in 3D space, filmed by a continuously moving virtual camera.
     Alternate close-ups and wide shots; push toward click points; add directional motion blur to whip pans
     and shallow depth of field at frame edges.
  2. Infinity AI typography: black and white plus one accent; large words, one per beat;
     shape-based transitions using dots and light ribbons.
  3. Motion Study components: a black component continuously spring-morphs on an off-white canvas,
     button → loading → checkmark → capsule, with the cursor driving the story.
  No shot may remain static longer than 1.5 s. No hard cuts to unrelated visuals.
  Every transition needs a motive: click, flowing dots, ribbon, or eye rings.

[CHARACTER] Xiaohei: round black #171717 head, two pointed ears, cream #FEF6EC eye rings,
  black pupils, no mouth or body; see ../assets/xiaohei-character.jpg.
  Its eyes are the recurring motif: the outlined cat peeks over the composer as the greeting arrives →
  Xiaohei blinks on the chat home screen and in the device array → final ribbons form eye rings and the logo.

[OPENING: THE MOST IMPORTANT FIVE SECONDS]
  0.4–1.5 s: type "Hello, Xiaohei!" centered on black in 96 px white text.
  Preserve the original Chinese IME sequence: underlined pinyin ni hao / xiao hei,
  a brief candidate bar, then committed Chinese characters for the greeting and name.
  Every key has a mechanical-keyboard sound; the exclamation mark hits on the beat.
  1.8–3.6 s: introduce Xiaohei. Use cream-white outlines, white eye rings, and #0B0B0C fill
  on black so the cat remains visible. Match the outlined head on the chat home screen.
    · 1.8: peek from the left edge, ear then eyes; look at the text, retract slightly,
      then reveal most of the head and tilt it.
    · 2.3: squash in anticipation → stretch along a parabolic jump → land below-left of the text,
      squash and rebound, with three short white impact lines.
    · 2.8: jump higher onto the two Chinese characters for Xiaohei;
      the entire text line sinks 6 px and springs back.
    · 3.3: turn to the camera and blink once.
  Xiaohei is only a head. All motion is whole-head bouncing with strict squash and stretch:
  squash 0.8, stretch 1.15, landing spring damping 10.
  3.6–4.25 s: move Xiaohei and the text together. Text shrinks from 96 to 15 px and slides into
  the OmniBox chat home composer, replacing "Ask anything".
  Xiaohei rides and shrinks with the text, then slides behind the composer's upper edge,
  becoming the peeking outlined cat on the home screen; blink on arrival.
  The UI fades in from black at the same time: suggested prompts, Manual confirmation,
  Agent 2.1, Upload documents / Recently updated cards. Full band enters at 4.0 s.
  Keep the text and Xiaohei as the same continuously moving elements; do not fade between duplicate copies.
  4.25 s: press Enter; text becomes the upper-right user bubble; Xiaohei retracts and streams a reply.
  5.0 s: whip into the browser.

[SIMULATE EVERYTHING; NO SCREENSHOTS OR SCREEN RECORDINGS]
Recreate 1:1 in React + CSS:
  - macOS Chrome: traffic-light controls, tabs, address bar, bookmarks, and toolbar extension icon.
  - Third-party pages: Zhihu article, news site, Bilibili video, Xiaohongshu post, X post.
    Generate content from script.md section 3. Imitate layout and colors only; use text instead of logo images.
  - Phones: iPhone frame, WeChat chat with Xiaohei, OmniBox app
    (bottom tabs More / Record / Text; Resources / Chats).
  - OmniBox web dark mode: sidebar (space name, Xiaohei / Notifications / Xiaohei community / Invite and earn,
    Resources | Chats capsule, resource tree, grouped chat history); chat home (outlined Xiaohei,
    suggested prompts, greeting, composer); conversation page (Deep thinking, citation badges,
    message actions); ⌘J search; agent tool calls and Approve / Reject / Approve all.
  - Floating extension card, black capsule toast, and text-selection menu.
  Use official product button and menu names; see section 3. Do not invent features.

[RHYTHM] 120 BPM; 1 beat = 0.5 s = 30 frames; 1 bar = 2 s.
  0–4 s: drumless intro with keyboard, foley, and a light bed; full band enters at 4.0 s;
  downbeats then fall on even seconds.
  Transitions land on strong beats with crashes; the 5.0 and 9.0 s whips land on beat 3.
  Clicks, saves, and switches land on beats; typing follows sixteenth notes.
  Drop out briefly at 29 s and 41.5 s to build anticipation.

[MUSIC AND SOUND] Original electronic/acoustic hybrid: clean, bright, and technological.
  Four-on-the-floor kick; snare and clap on beats 2 and 4; syncopated synth bass;
  glockenspiel provides the memorable brand motif.
  Foley: one mechanical-keyboard sample set for all typing, with soft letter keys and heavier Space/Enter;
  clicks, save pops, completion dings, whip whooshes starting half a beat early, and switch clicks.
  In 0–4 s, use only keyboard, room tone, and Xiaohei foley:
  peek coo, retract swish, takeoff pop, landing thump, text-rebound boing, and single-note blink glockenspiel.
  Full band enters at 4.0 s. Music and visuals share the src/timing.json timeline.

[DELIVERABLES]
  out/omnibox-product.mp4, poster.png, source code, and a one-command build.sh.
  tools/stills.mjs exports review stills in batches by frame number.
```

---

## 2. Suggested Project Structure

```text
product concept/remotion/
├─ src/
│  ├─ Root.tsx                 # Composition: OmniBoxProduct, 1920x1080, 60fps, 2700f
│  ├─ Product.tsx              # TransitionSeries connects sections A–H
│  ├─ timing.json             # Single source of section, transition, and keyframe numbers
│  ├─ data/                   # Simulated content: zhihu.ts news.ts bili.ts xhs.ts x.ts wechat.ts resources.ts chats.ts answer.ts report.ts
│  ├─ theme.ts                # Color, font, radius, and shadow tokens
│  ├─ camera/Camera3D.tsx      # Perspective container + keyframe interpolation (x,y,z,rotX,rotY,scale,blur)
│  ├─ components/
│  │  ├─ Cursor.tsx           # macOS cursor, Bezier trajectory, and press state
│  │  ├─ Typewriter.tsx       # Frame-based typing on sixteenth notes, blinking caret; pinyin/candidate IME mode; emits sound events
│  │  ├─ TextToComposer.tsx   # Shared-element transition from large greeting to composer text
│  │  ├─ XiaoheiEyes.tsx      # Cream eye rings: open / blink / gaze
│  │  ├─ XiaoheiLineart.tsx   # Shared outlined head for opening and chat home; blink, gaze, tilt, squash/stretch
│  │  ├─ XiaoheiHop.tsx       # Anticipation squash → parabolic stretch → landing rebound; start/end/apex inputs, transform/landing events out
│  │  ├─ Logo.tsx             # Blue-gradient rounded square and peeking black cat
│  │  ├─ BigWords.tsx         # Large type, word by word
│  │  ├─ browser/ChromeWindow.tsx  ZhihuArticle.tsx  NewsPage.tsx  BiliPage.tsx  XhsNote.tsx  XPost.tsx
│  │  ├─ extension/ExtCard.tsx  SaveMorph.tsx  Toast.tsx  SelectionMenu.tsx
│  │  ├─ phone/IPhone.tsx  WeChatChat.tsx  OmniApp.tsx
│  │  ├─ omnibox/AppShell.tsx  Sidebar.tsx  ResourceTree.tsx  ChatHistory.tsx  ChatHome.tsx
│  │  │          Composer.tsx  AnswerStream.tsx  Citation.tsx  ToolCalls.tsx  SearchModal.tsx
│  │  │          ParseTiles.tsx (PDF/OCR/transcription/video-chapter panels)  ShareCard.tsx  TeamSpace.tsx
│  │  └─ devices/DeviceFan.tsx  Terminal.tsx  RepoCard.tsx
│  ├─ transitions/  iris.tsx  whip.tsx  morph.tsx  dots.tsx  arc.tsx  push.tsx
│  └─ scenes/  A_Open.tsx  B_Extension.tsx  C_Sources.tsx  D_Understand.tsx  E_Apply.tsx
│              F_Share.tsx  G_Platform.tsx  H_Brand.tsx
├─ audio/music.py              # Read timing.json; generate music and effects → public/soundtrack.wav
└─ tools/stills.mjs
```

---

## 3. Design Tokens and UI Copy (Source Code and Recordings Are Authoritative)

### Colors

| Token | Value | Use |
|---|---|---|
| `bg.brand` | `#0B0B0C` | Black background in A, G, and H |
| `bg.canvas` | `#EDEDEA` | Off-white canvas in F; B's desktop can use `#E9E6E1` |
| `app.main` | `#262626` | OmniBox dark main area |
| `app.sidebar` | `#171717` | Dark sidebar |
| `app.composer` | `#303030` | Dark composer |
| `text.primary` | `#EDEDED` / `#171717` in light UI | — |
| `text.muted` | `#A1A1A1` / `#71717A` | — |
| `brand.gradient` | `#4A8EF9 → #B2D0FF` | Logo, ribbons, citation badges, highlights |
| `accent.blue` | `#3B82F6` | Invite-and-earn gift and upgrade icons |
| `xiaohei.body` / `xiaohei.eye` | `#171717` / `#FEF6EC` | Xiaohei |
| `toast` | `#171717`, radius 16, white text | Extension save notification |

Fonts: PingFang SC or Noto Sans SC; Inter for English and numbers. Base radius 8 px, cards 16 px, capsules 9999 px.

### OmniBox Web Copy

- **Sidebar:** space name + ⌄ / Xiaohei / Notifications (red numeric badge) / Xiaohei community / Invite and earn (blue gift icon) / Resources | Chats capsule / Personal and Team resource headings. Chats includes Search chat history and New chat; groups are Today, Past 7 days, and September 2026. Trash at the bottom.
- **Chat home:**
  - Greeting: "Good evening. How can I help you today?"
  - Placeholder: "Ask anything".
  - Bottom-left + menu: Select resources / Add image / Web search / Deep thinking / Local search.
  - Approval mode: "Manual confirmation ⌄".
  - Bottom-right models: Agent 2.1 / Agent 1.1; reasoning effort: Low / Medium / High / Maximum.
  - Send button becomes Stop during generation.
  - Lower card: "Upload documents · Put your knowledge to work · Supports documents, webpages, audio, video, and more"; buttons: Local upload / WeChat assistant / Install extension. Second card: Recently updated.
- **Conversation page:**
  - Status sequence: Thinking → collapsible Deep thinking → Searching…
  - Message actions: Regenerate / Copy / Save this response to personal space / Share.
  - Footer: "Content generated by Xiaohei AI, for reference only."
  - Agent approval buttons: Approve / Reject / Approve all.
- **Resource page:** top-right Edit, Share, and the Xiaohei sidebar button; metadata: "Updated x minutes ago."
- **Sharing:** Require login, Password protection, Expiration, AI Q&A (Disabled / Chat only / Enabled), Copy link; WeChat card title: "A conversation from Xiaohei OmniBox."

### Browser Extension Copy

- Floating card: 288 px wide, radius 16, white, soft shadow, fixed at the page's top right.
  - Header: Xiaohei logo and name; home / feedback / gear icons in gray `#8F959E`.
  - Main button: Save to Xiaohei; black, 38 px high, radius 8, box icon on the left; changes to Saving… after clicking.
  - Save to row: Personal / Team + folder.
  - Specific area toggle; Hold ⌥ on the right.
- Toast: Processing with spinner → Saved to this folder + View.
- Text-selection menu: Copy | Save to Xiaohei.

### Mobile Copy Visible in the Recordings

Top bar: space name and Upgrade. Composer: Ask anything. Segments: Resources | Chats. Bottom bar: More · Record · Text. More panel: Photo / Upload file / Link.

---

## 4. Key Techniques for Remotion

1. **Camera3D**
   - Outer `perspective: 2400px`; inner `transform: translate3d() rotateX() rotateY() scale()`.
   - Store keyframes in timing.json; interpolate with `interpolate` and `Easing.bezier(0.22, 1, 0.36, 1)`.
   - Always add slight camera drift with `@remotion/noise`, amplitude 2–4 px and 0.3°, to avoid dead frames.
2. **Depth of field:** in close-ups, apply `filter: blur(6–14px)` to non-focal layers, keeping the focal layer sharp; use gradient masks for blurred edges.
3. **Whip pan T-WHIP**
   - Move 1.2–1.5 screen widths in 0.3 s; slow at the ends, fast in the middle.
   - Use `<CameraMotionBlur samples={8}>` from `@remotion/motion-blur`, or simulate it with offset translucent copies.
   - Enable motion blur only during whip pans.
4. **Shared-element morph T-MORPH**
   - A `MorphBox` receives before/after `{x, y, w, h, radius, bg}` states; interpolate with `spring({damping: 14, mass: 0.8})`.
   - Crossfade content: outgoing fades during 0–40%; incoming appears during 40–100%.
   - Button press: scale to 0.95, then rebound.
5. **Eye rings → logo, section H:** draw two cream SVG rings. The ribbon's `strokeDashoffset` should close precisely into them. Expand the cat silhouette outward from the eyes with `clip-path`, align with the logo, then hand off.
6. **Collapse into dots T-DOT:** shrink each card into an 8 px blue dot; follow a quadratic Bezier path using `@remotion/paths` toward the destination row, with a 6-frame trail.
7. **Light ribbon T-ARC:** animate SVG `strokeDashoffset` with a blue-gradient stroke and a blurred glow copy.
8. **Typing and streaming**
   - Slice strings by frame; type one Chinese character every 7–8 frames, following sixteenth notes, with occasional 2–4-frame pauses for human timing.
   - Stream the AI response by token, 2–4 characters every 2 frames.
9. **Rolling numbers:** animate 32k upvotes and 486k views with `interpolate` and `toLocaleString`.
12. **Opening text → composer, TextToComposer**
    - Measure the target position and font size in the layout first, using a hidden render or fixed theme coordinates.
    - Interpolate the same `<span>` from screen center at 96 px to its target at 15 px. Use spring for position and `scale`, not `font-size`, to avoid jitter from per-frame reflow.
    - Fade the placeholder 6 frames before arrival. Hand the span to Composer after landing; positions must match exactly at the handoff frame.
    - IME: underline pinyin with `text-decoration: underline`; use an absolutely positioned candidate strip with 3–5 candidates and the first highlighted; hide it after Space.
    - Write each `{frame, type: "key" | "space" | "enter"}` event to timing.json; music.py plays the corresponding keyboard sample.
10. **Gradient text:** per-frame changes to `background-clip: text` can blur in continuous rendering, a problem encountered in v1. Use solid-color text and a masked copy instead.
11. **Determinism**
    - Use Remotion's `random(seed)` for all random content, never `Math.random()`.
    - Preload fonts with `@remotion/fonts`; use `delayRender` until fonts are ready.

---

## 5. Video Review Checklist

- [ ] Transitions at 3, 8, 12, 18, 30, 35, and 39 seconds land on strong beats with synchronized crash or whoosh sounds.
- [ ] Every OmniBox button name on screen appears in section 3.
- [ ] Sidebar chat history is visible in E, 18–19.5 s, grouped by date.
- [ ] The opening "Hello, Xiaohei!" remains the same element as it travels from large text on black into the composer, without jumps; every keystroke has a sound.
- [ ] Xiaohei peeks → bounces out → hops onto the text → blinks; each step has squash/stretch and corresponding foley; the entire text line rebounds on impact.
- [ ] Xiaohei and text travel together; the final cat position and design match the peeking cat on the chat home screen exactly.
- [ ] The first Today history item in E is "Hello, Xiaohei!", recalling the opening.
- [ ] Xiaohei's eyes appear in the opening, chat home, device array, and logo, connecting the beginning and ending.
- [ ] No shot is static longer than 1.5 s; text remains visible at least 0.8 s for readability.
- [ ] Third-party pages such as Zhihu and Bilibili imitate layout only, without actual logo images.
- [ ] Sample stills: `node tools/stills.mjs 60 90 120 150 180 204 230 255 330 408 468 600 840 1200 1350 1650 1920 2160 2460 2640`.

## 6. Do Not

- Do not insert screen recordings or screenshots, or use real user data and account names.
- Do not invent unsupported product features or buttons, such as "Generate a PPT in one click."
- Do not add voiceover, subtitle bars, or watermarks.
- Use only brand blue as the accent; do not add a second accent color. Tag capsules may use multiple muted colors.
