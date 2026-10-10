# Xiaohei OmniBox · Concept Product Film Prompt v1 (Remotion · No Voiceover)

> Format: concept film without voiceover or vocals; music, sound effects, and on-screen text only.
> Tools: Remotion 4 (React) · 1920×1080 · 30 fps · **20 seconds = 600 frames** · Loudness: −14 LUFS.
> Assets: [character reference](../assets/%E5%B0%8F%E9%BB%91%E5%8F%82%E8%80%83%E5%9B%BE.jpg) (six character views), `../assets/screenshot/` (UI screenshots for stylized reference only).
> Source: official website https://www.omnibox.pro/zh-cn/ (read on 2026-09-28); product overview in section 0 of `omnibox-voiceover-prompt-v1.md`.
> This document translates the original brief into English; quoted on-screen copy is translated for the reader.

---

## 0. What This Film Should Communicate

| Layer | Content / on-screen copy |
|---|---|
| Brand | **Xiaohei OmniBox** · Your AI knowledge companion |
| Slogan | **Anytime, anywhere. Everything becomes memory. Memory becomes everything.** |
| Features, following the slogan's three parts | **Capture:** WeChat · Webpages · Quick notes · RSS · X · YouTube · Zhihu · bilibili · Reddit<br>**Understand:** Document parsing · Image OCR · Audio/video transcription · AI summaries<br>**Apply:** Answers with citations · Generate action items/reports · Agents organize for you |
| Open, in a brief montage | Browser extension · iOS / Android · Claude Code / Codex · Open source · Self-hosted |
| Call to action | Start for free · omnibox.pro |

**Core concept:** Xiaohei swallows scattered information fragments, which become a glowing memory constellation inside it; answers and outputs then grow from that constellation. The slogan reverses itself, and the film follows the same structure: **scatter → gather → scatter**.

---

## 1. Complete Prompt for the Agent

```text
Create a 20-second Xiaohei OmniBox concept product film in Remotion 4:
600 frames, 30 fps, 1920×1080.
No voiceover or vocals; music, sound effects, and on-screen text only.
Conceptual, visually striking style. Use gradients, masks, and light effects for smooth transitions, not hard cuts.

[BRAND] Xiaohei OmniBox, your AI knowledge companion.
Slogan: Anytime, anywhere. Everything becomes memory. Memory becomes everything.
[CHARACTER] Xiaohei: round black head, two pointed ears, cream eye rings with black pupils,
  no mouth or body; see the character reference linked above.
  Here it is a shape rather than a cartoon character: a black-hole-like container, a mask, a doorway.
  Its two cream eye rings are the recurring motif: opening eyes, circular transition apertures, final logo.
[NARRATIVE] Reversible structure: scatter → gather → scatter.
  1. Open eyes: two cream eye rings open in darkness; reveal "Anytime, anywhere."
  2. Everything / Capture: WeChat bubbles, webpage cards, voice waveforms, PDFs, photos, RSS,
     X posts, YouTube videos, Zhihu answers, bilibili videos, and Reddit posts float in space,
     flying in from every direction to the beat: first four once per beat, last five once per half-beat.
  3. Becomes memory / Understand: fragments are drawn into Xiaohei's silhouette.
     As they cross the outline, PDFs become text lines, photos become OCR boxes, waveforms become transcripts;
     everything finally becomes glowing nodes connected into a memory constellation.
  4. Memory becomes everything / Apply: type "What action items did we agree on in last week's meeting?"
     Several nodes light up and connect, representing citations. Output cards grow from them:
     action list, meeting summary, weekly report, proposal, and agent actions: create folder, add tags.
  5. Rapid montage: browser extension, iOS/Android, Claude Code/Codex, open source, self-hosting,
     flashing on sixteenth notes.
  6. Resolve: all lights return to Xiaohei's eyes; reveal the Xiaohei OmniBox logo,
     complete slogan, and "Start for free · omnibox.pro."
[RHYTHM] 120 BPM; 1 beat = 15 frames, 1 bar = 60 frames.
  Transitions land on bar downbeats; fragments, illuminated nodes, and cards land on beats.
  Montage follows sixteenth notes: 3.75 frames, rounded in a 4/4/4/3-frame cycle.
  Drop out during the first part of 15–16 s to build tension; drop at 16 s.
[MUSIC] Original electronic music, 120 BPM, Future Bass / Melodic House direction.
  Open with atmospheric pad and heartbeat-like low end; kick enters at 2 s, clap and arpeggio at 6 s,
  full arrangement at 10 s; at 15 s, filter sweep, rising noise, and no kick;
  drop at 16 s, resolve to a large chord at 18 s and sustain to the end.
  Whoosh, impact, glitch, ding, and sub-drop effects align with transitions and beats.
[VISUALS] Near-black #07080B opening → fluid blue-purple-to-cyan light field → cream #FBF3E4 brand card.
  Primary colors: Xiaohei black #141414, cream eyes #FBF3E4, electric blue #2E7CF6.
  Secondary: cyan #22D3EE, purple #8B5CF6, amber #F5C542.
  Glass cards, soft glow, fine grain, depth-of-field blur, particles.
  Fonts: Noto Sans SC (OFL), Inter (OFL) for numbers and English.
[TRANSITIONS] At least six custom types, no default fades:
  eye-ring iris, gradient-light mask wipe, silhouette swallow via mask scaling,
  constellation dolly zoom, light-leak flash, liquid-gradient blend.
  Transitions last 12–20 frames, with the strong beat at the midpoint.
[DELIVERABLES] out/ominibox-concept.mp4 (H.264, CRF 18), poster.png at 18.5 s,
  Remotion source, music stems, and CREDITS.
  No real people or hands, no invented product features, no raw screenshots;
  screenshots serve only as stylized silhouettes within glass cards.
```

---

## 2. Storyboard and Beat Sheet (120 BPM · 1 Beat = 15 Frames · 1 Bar = 60 Frames)

> **Source clarification:** the website says the extension can save whole webpages, selections, social content, or online videos. X, YouTube, Zhihu, bilibili, and Reddit appear as sources in these categories, not as official partners.

| # | Time / frames | Bar | Visual | On-screen copy | Motion details | Transition to next scene | Music |
|---|---|---|---|---|---|---|---|
| S1 Eyes open | 0–2.0 s<br>f0–59 | 1 | Two cream eye rings open from slits in black at f15, blink at f38, pupils look toward camera | **Anytime, anywhere** at f45, character by character; tracking tightens from 0.6em to 0.12em | Open rings with spring damping 12; outer glow breathes; very faint background grain | **Eye-ring iris:** right pupil expands into a circular mask at f52–66, revealing the next scene's colored light field | Atmospheric pad and heartbeat sub; small glitch at f45 |
| S2 Everything · Capture | 2.0–6.0 s<br>f60–179 | 2–3 | Fragments float in three parallax layers: WeChat bubble, webpage card, voice waveform, PDF, photo, RSS, X card, YouTube card with play button/progress bar, Zhihu answer, bilibili video with scrolling comments, Reddit post with voting arrows. Fly in and snap into place: first four once per beat, last five once per half-beat; density builds during a slow push | Large **Everything** at lower left. Nine labels light sequentially: **WeChat · Webpages · Quick notes · RSS** at f75 / 90 / 105 / 120; **X · YouTube · Zhihu · bilibili · Reddit** at f128 / 135 / 143 / 150 / 158. Two rows, last five on the second | Slow drift with `@remotion/noise`; spring entrances with velocity-aligned motion blur; glass cards with backdrop blur and 1 px highlighted outlines | **Silhouette swallow:** Xiaohei expands from center into a mask at f168–186; fragments are drawn into the dark outline and the outside dims | Kick at f60; one pluck per beat; reverse whoosh at f165 |
| S3 Becomes memory · Understand | 6.0–10.0 s<br>f180–299 | 4–5 | Inside Xiaohei, fragments cross a horizontal scanning ribbon and are parsed: PDF → text lines, photo → OCR boxes, waveform → scrolling transcript, webpage → structured card. All collapse into glowing nodes; connections grow into a memory constellation | **Becomes memory**; **Document parsing · Image OCR · Audio/video transcription · AI summaries** appear at f195 / 210 / 225 / 240 | Linear-gradient scan mask, blue → cyan → transparent, sweeps left to right; draw connections beat by beat with `evolvePath` from `@remotion/paths`; radial glow when nodes light | **Constellation dolly zoom:** push into the brightest node at f288–306; its halo fills the frame | Clap and arpeggio at f180; rising blip for each parse; shimmer on node illumination at f240 |
| S4 Memory becomes everything · Apply | 10.0–15.0 s<br>f300–449 | 6–8 | Constellation recedes. An upper-center glass input types the meeting-action-items question at 4 frames per character. Enter lights three nodes and connects a ray, representing citations. At the ray endpoint, output cards grow: action list with three sequential checks, meeting summary, weekly report, proposal. Agent capsules: Create folder · Meeting action items; Add tag · Technology | **Memory becomes everything**; question: **What action items did we agree on in last week's meeting?**; citation **[1] Weekly Meeting Recording.m4a** | Cards spring from nodes, scale 0.6 → 1, stiffness 180; layered depth of field; path-drawn checkmarks; rotating conic-gradient card borders | **Liquid-gradient blend:** blue-purple background flows toward amber; cards stretch into ribbons at f438–456 | Full arrangement at f300; Enter impact at f345; chord stab for each card |
| S5 Build · Flash montage | 15.0–16.0 s<br>f450–479 | First half of 9 | Platform and open capabilities flash on black on sixteenth notes, each filling the frame in alternating colors | **Browser extension / iOS / Android / Claude Code / Codex / Open source / Self-hosted** | Each word lasts 4 frames, weight flashes from 900 to 300 with RGB-split glitch; final 4 frames black and silent | **Light-leak flash:** cream light sweeps from the top right at f476–484 | No kick; filter sweep, rising noise, crescendo of sixteenth-note snares; silence f476–479 |
| S6 Resolve · Brand | 16.0–20.0 s<br>f480–599 | Second half of 9–10 | Drop: light dots gather from all sides into Xiaohei's eyes, then draw the head and complete the logo. Background shifts from light field to cream | **Xiaohei OmniBox** f495 → **Your AI knowledge companion** f510 → **Anytime, anywhere** f525 / **Everything becomes memory** f540 / **Memory becomes everything** f555 → **Start for free · omnibox.pro** f570 | Spring particles with randomized delays; outline logo with `evolvePath`, then fill; light sweeps each slogan segment; final second slowly pushes scale 1.00 → 1.04 | Fade to cream at f585–599, keeping the logo | Drop at f480, impact + sub drop; large chord at f540, sustained to end; fade over final 0.5 s |

**Text rules:** each line stays at least 1.2 s except the flash montage. Estimate Chinese reading time as character count ÷ 4.5 + 1 second. Only one main text line at a time. Heading weight 800–900, secondary text 400–500. Keep all type inside a 96 px safe area on every edge.

---

## 3. Visual System

- **Three Xiaohei forms:**
  1. **Eyes:** two cream rings, outer diameter to pupil about 1:0.5; motif for opening, transitions, and ending.
  2. **Silhouette:** front-view outline from the reference, pointed ears, round head, flat bottom; used as mask and container.
  3. **Logo:** solid black head and cream eye rings; shown completely only at the end.
  Trace one SVG path from the reference and share it across forms for consistent geometry.
- **Color script:** near-black S1 → deep blue-purple field with cyan highlights S2–S3 → blue-purple flowing toward amber S4 → black/white flashes S5 → cream S6. Dark to light represents disorder becoming order.
- **Gradient field:** 3–4 large radial-gradient patches, positions driven by `noise2D` from `@remotion/noise`, moving slowly under an additional soft-light layer with `mix-blend-mode: screen`.
- **Glass cards:** `backdrop-filter: blur(24px)`, 8% white fill, 1 px gradient outline, soft shadow. UI inside cards is simplified from screenshot references, not pasted originals.
- **Particles:** seeded pseudorandom values from `random('seed')`; independent phases for deterministic frame rendering.
- **Grain and glow:** a noise PNG sequence at 3% opacity over the whole film; `filter: drop-shadow` or SVG `feGaussianBlur` for glow, kept away from readable text.

---

## 4. Music and Sound Effects

| Section | Arrangement | Effects and frame alignment |
|---|---|---|
| S1 0–2 s | Atmospheric Cmaj9 pad, heartbeat sub, no drums | Low swell when eyes open at f15; glitch tick with text at f45 |
| S2 2–6 s | Four-on-the-floor kick, pluck arpeggio, bass follows roots | Fragment pop/click: first four once per beat, last five once per half-beat, rising pitches; reverse whoosh at f165 |
| S3 6–10 s | Add claps on 2 and 4, sixteenth-note hi-hats, rising arpeggio | Scan riser f190–240; shimmer on node illumination each beat |
| S4 10–15 s | Full arrangement: sidechained pad, lead melody, syncopated bass | Typing every 4 frames, Enter impact f345, card stabs f360 / 375 / 390 / 405, checkmark ding |
| S5 15–16 s | Remove kick; low-pass sweep, rising white noise, crescendo of sixteenth-note snares; silence f476–479 | Small glitch for each flash word |
| S6 16–20 s | Drop: kick, large synth chord, sub drop; Fmaj9 → Cmaj9 at f540, sustained to end | Gathering whoosh-in f480; logo impact f495 |

- Suggested key: C major; progression **Fmaj7 – G6 – Em7 – Am7**, resolving to Cmaj9.
- Music must be original or commercially licensed. Options: write the score above with Lemo-Opuscar's `core/audio/sampler.py` and CC0 / CC BY samples, or license library music and edit it to 20 s at 120 BPM. **Do not** use music of unknown provenance.
- Music: `public/music.wav`; effects: `public/sfx/*.wav`. Place precisely with Remotion `<Audio>` and `<Sequence from={frame}>`.
- Optional audio response: `useAudioData` and `visualizeAudio` from `@remotion/media-utils` can gently pulse light-field brightness and particle size with low frequencies; amplitude ≤ 8%, without distracting from the subject.

---

## 5. Remotion Implementation Specifications

```text
concept/
├─ src/
│  ├─ Root.tsx                 // <Composition id="OmniBoxConcept" durationInFrames={600} fps={30} width={1920} height={1080}/>
│  ├─ timing.ts                // BPM=120, BEAT=15, BAR=60, beat(n), bar(n), all keyframe constants
│  ├─ Concept.tsx              // <TransitionSeries> connects six scenes + <Audio>
│  ├─ scenes/                  // S1Eyes / S2Fragments / S3Memory / S4Output / S5Flash / S6Brand
│  ├─ transitions/             // eyeIris / gradientWipe / silhouetteSwallow / dollyZoom / lightLeak / liquidBlend
│  ├─ components/              // XiaoheiPath, GlassCard, GradientField, Particles, Constellation, KineticText
│  └─ assets/xiaohei.ts        // SVG path traced from reference: head outline and eye rings
├─ public/ music.wav · sfx/ · fonts/NotoSansSC.ttf · fonts/Inter.ttf · grain/
└─ out/
```

- **Dependencies:** `remotion`, `@remotion/cli`, `@remotion/transitions`, `@remotion/noise`, `@remotion/paths`, `@remotion/shapes`, `@remotion/media-utils`, `@remotion/google-fonts`, or local OFL fonts.
- **Timing:** export all frame numbers from `timing.ts`; visuals and sound share the same constants, without magic numbers.
- **Transition duration:** `<TransitionSeries>` overlaps adjacent scenes. Total duration = sum of scene durations − sum of transition durations. Use this allocation to reach exactly 600 frames with strong beats at transition midpoints:

  | Scene | S1 | S2 | S3 | S4 | S5 | S6 |
  |---|---|---|---|---|---|---|
  | Scene frames | 67 | 136 | 138 | 168 | 43 | 124 |
  | Transition to next scene | 14 | 18 | 18 | 18 | 8 | — |
  | Scene start frame | 0 | 53 | 171 | 291 | 441 | 476 |
  | Transition midpoint | 60 | 180 | 300 | 450 | 480 | — |

  Scene durations total 676; transitions total 76; 676 − 76 = 600. A transition occupies the previous scene's final d frames. For midpoint T, start the next scene at T − d/2. After implementation, use `npx remotion still` to check these five strong-beat frames.
- **Transitions:** custom `presentation` implementations in `@remotion/transitions`, receiving `presentationProgress`:
  - `eyeIris`: `clip-path: circle()`, radius from pupil size to screen diagonal, with a 20 px feathered halo.
  - `gradientWipe`: `mask-image: linear-gradient(...)`, position follows progress, soft edge 15% wide.
  - `silhouetteSwallow`: Xiaohei path as `<mask>`, `scale` decreases from 40 to 1.
  - `dollyZoom`: outgoing scene scales 1 → 6 with blur; incoming scales 0.6 → 1 and fades in.
  - `lightLeak`: cream-to-amber radial gradient overlay, `screen` blending, peak opacity 0.9.
  - `liquidBlend`: SVG `feTurbulence` and `feDisplacementMap`; displacement follows a sine envelope.
  - Common easing: `Easing.bezier(0.65, 0, 0.35, 1)` or `springTiming({ config: { damping: 200 } })`.
- **Motion:** `spring()` for subject motion; `interpolate(..., { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })` for value mapping. Use `random(seed)`, never `Math.random()`. Every element needs anticipation → action → follow-through, with clear acceleration in S5 and a breathing moment in S6's final second.
- **Performance:** fewer than 400 particles; blur only during transitions. Render with `npx remotion render OmniBoxConcept out/ominibox-concept.mp4 --codec h264 --crf 18 --concurrency 6`.

---

## 6. Self-check Checklist

- [ ] Exactly 600 frames; f60, f180, f300, f450, and f480 each contain a transition or major event.
- [ ] Complete logo and all three slogan parts appear, matching the website: Xiaohei OmniBox; Everything becomes memory; Memory becomes everything; Anytime, anywhere.
- [ ] Feature labels describe only existing website capabilities; nothing invented.
- [ ] Third-party platforms X, YouTube, Zhihu, bilibili, and Reddit use names and neutral card layouts only, without official logos or UI screenshots; trademark licensing is separate.
- [ ] No vocals, real people, or hands.
- [ ] Every line stays long enough to read, except the flash montage; no light effects or cards obscure text.
- [ ] All transitions are custom effects, without default hard cuts or plain fades.
- [ ] Music is licensed or original, with sources in CREDITS; loudness around −14 LUFS, no clipping.
- [ ] Capture one frame per second and assemble an overview to review composition, contrast (text in dark scenes ≥ 4.5:1), and the dark-to-light color script.
