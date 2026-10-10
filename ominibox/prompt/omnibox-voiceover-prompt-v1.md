# Xiaohei OmniBox · Product Intro Short Film Prompt v1

> Style: Lemo-Opuscar **Living Screencast** (`styles/living-screencast/STYLE.md`).
> Language: Simplified Chinese · Duration: approximately 20 seconds · 1920×1080 · 30 fps · Loudness: −14 LUFS.
> Assets: [character reference](../assets/%E5%B0%8F%E9%BB%91%E5%8F%82%E8%80%83%E5%9B%BE.jpg) (six character views), `../assets/screenshot/` (product home, conversation, and Xiaohei community screenshots).
> Source: official website https://www.omnibox.pro/zh-cn/ (read on 2026-09-28).
> This document translates the original brief into English. Quoted UI copy and narration are translated for the reader; the original production language and voice configuration are preserved.

---

## 0. Product Overview (From the Official Website)

**Xiaohei OmniBox: your AI knowledge companion.** Slogan: "Anytime, anywhere. Everything becomes memory. Memory becomes everything."
In one sentence: capture, save, subscribe, organize, ask, create, share, and collaborate—all in one.

| Stage | Website heading | Capabilities |
|---|---|---|
| Capture | Anytime, anywhere | Send content to Xiaohei without changing your habits: **WeChat / QQ assistants** (forward text, voice messages, images, files, and links), **quick notes** (text, recordings, photos, links), **browser extension** (whole pages, selections, social content, online videos), **RSS subscriptions** (automatically save blogs, news, and podcasts) |
| Understand | Everything becomes memory | Understand content rather than merely store files: **webpages** → editable, traceable documents; **documents** (PDF / Word / PPT) → searchable knowledge; **images** → OCR for scans and semantic summaries for photos; **audio/video** → transcripts, summaries, and key frames |
| Apply | Memory becomes everything | **Q&A:** search your knowledge base in natural language, answer from original sources, and **show citations**; **writing:** turn meeting and project materials into action items, summaries, reports, and proposals; **execution:** agents create folders, move resources, add tags, and save outputs |
| Open | Open. In your control. | Open source (GitHub `import-ai/omnibox`, Apache-2.0); accessible through a skill in Codex and Claude Code; self-hostable, with offline operation through Ollama |
| Pricing | Start free. Upgrade as needed. | Basic plan free forever (5 GB); premium plan ¥35/month (50 GB, leading models, and Agent 2.1) |

UI facts checked against the screenshots; depict only these existing elements: sidebar with Xiaohei / Notifications / Xiaohei community / Invite and earn, Resources / Chats segmented switch, and Trash. In the main area, Xiaohei peeks from behind the composer; placeholder "Ask anything"; bottom left + and Manual confirmation ⌄; bottom right Agent 2.1 Low and Send. Lower cards: "Upload documents · Put your knowledge to work · Supports documents, webpages, audio, video, and more" with Local upload / WeChat assistant / Install extension, plus Recently updated.

---

## 1. Complete Prompt for the Agent

```text
Create an approximately 20-second Chinese-language product intro for Xiaohei OmniBox
in Lemo-Opuscar's Living Screencast style.
First read DIRECTOR.md, TECHNIQUE.md, and styles/living-screencast/STYLE.md.
The style is fixed; follow the content brief below.

[PRODUCT] Xiaohei OmniBox, your AI knowledge companion.
Slogan: Everything becomes memory. Memory becomes everything.
[THREE MESSAGES]
  01 Capture · Anytime, anywhere: WeChat, webpages, quick notes—leave them to Xiaohei whenever you need.
  02 Understand · Everything becomes memory: documents, images, audio, and video become searchable memories.
  03 Apply · Memory becomes everything: ask in a sentence, get answers with citations, and let it organize for you.
[CHARACTER] Xiaohei: a round black head, two pointed ears, cream eye rings with black pupils,
  no mouth or body; see the character reference linked above.
  In this film, it is a hard-edged 16×13 square-pixel sprite living inside a high-resolution recreation of OmniBox.
  The cursor is the user; Xiaohei is the software. Every Xiaohei action must trigger a real UI change.
[UI] Recreate OmniBox web 1:1 in HTML/CSS from ../assets/screenshot/; do not paste screenshots.
  Light-gray sidebar, white main area, Xiaohei peeking behind the composer, Ask anything,
  Manual confirmation, Agent 2.1 Low, Upload documents, and Recently updated cards.
  Use only buttons and names present on the official site and in the screenshots. Do not invent features.
[RHYTHM] 120 BPM, 2 seconds per bar. Every transition, landing, and popup aligns with drums:
  whip pans on bar downbeats with crashes, preceded by a half-beat tom fill;
  Xiaohei landings, saved entries, and state changes on quarter notes; typing on sixteenth notes.
  Remove the kick at 15–16 s, build with a snare roll, bring back the full band at 16 s,
  and land the final stomp on a large downbeat chord at 18 s.
[MUSIC] Original, in two resolutions: high-resolution piano, bass, acoustic drums, claps,
  shakers, and glockenspiel samples are the world; square-wave chiptune is Xiaohei's voice.
  Four-on-the-floor kick, snare and clap on beats 2 and 4, eighth-note hi-hats, syncopated bass.
  Share one timeline with subtitles and visuals. Duck music by about 6 dB under narration.
[VOICEOVER] Warm, lively female voice: edge-tts zh-CN-XiaoxiaoNeural, rate +12%.
  One feature per sentence. Burn subtitles into frosted-glass pills.
[ENDING] Collapse the window; reveal the Xiaohei logo and Xiaohei OmniBox.
  Xiaohei hops word by word to the beat across "Everything → memory · Memory → everything".
  The final stomp lights the slogan; "Start for free · omnibox.pro" appears below.
[DELIVERABLES] ominibox.mp4, ominibox.srt, poster.jpg, TREATMENT, source code, and one-command build.sh.
  No watermark or LemoLab credit on the final video.
```

---

## 2. Story and References

- **One sentence:** Xiaohei comes alive from behind the composer, catches scattered content, understands it, and returns it to you through a single question.
- **Structure:** peek and transform (hook, 0–4 s) → catch content (capture) → understand content → return answers and act (apply) → return to the slogan. The opening hides Xiaohei behind the composer; the ending places it on the slogan.
- **References, visual grammar only:** Screen Studio-style recordings (cursor push-ins, click-driven camera, windows floating above wallpaper); Apple Guided Tour (one feature per sentence); Duolingo mascot animation (squash/stretch and anticipation). Do not copy their characters, UI, music, or shots.
- **The film's distinctive move:** a vector Xiaohei already peeks from the interface. At 1.3 s, it breaks into square pixels, becomes pixel Xiaohei, and jumps out, leaving only a dashed outline behind.

---

## 3. Storyboard and Beat Sheet (120 BPM; 1 Beat = 0.5 s; 1 Bar = 2 s)

| # | Time | Bar | Visual / Xiaohei / cursor | Camera | Voiceover and start | Music |
|---|---|---|---|---|---|---|
| 1 | 0.0–2.0 | 1 | OmniBox home, close to the composer. Vector Xiaohei blinks at 1.0, breaks into pixels at 1.3, and jumps at 1.6 | Close-up z 2.0, slow push | v1: "Meet Xiaohei, your AI knowledge companion." 0.30 | Hi-hats and chiptune arpeggio only |
| 2 | 2.0–4.0 | 2 | Title "Xiaohei OmniBox / Your AI knowledge companion" lands in the bubble position; Xiaohei lands on it at **2.0**, breathing to the beat | Pull back to z 1.2 | — | **2.0 full band + crash**; tom fill at 3.5 |
| 3 | 4.0–8.0 | 3–4 | Chapter "01 Capture · Anytime, anywhere." Four items fly into My resources: **4.5** Whiteboard Photo.jpg [WeChat], **5.0** How to Build a Second Brain [webpage], **5.5** Weekly Meeting Recording.m4a [quick note], **6.0** Docker: Introduction and Practice (4th Edition).pdf [local upload]. Xiaohei hops onto each new row on the beat; row ends show Parsing | **4.0 whip** to sidebar z 1.75; slowly pull back after 6.0 | v2: "WeChat, webpages, quick notes—leave them to Xiaohei anytime." 4.35 | Full groove; fill at 7.5 |
| 4 | 8.0–12.0 | 5–6 | Chapter "02 Understand · Everything becomes memory." Xiaohei steps on rows: **8.5** PDF → Full-text search, **9.0** image → OCR, **9.5** recording → Transcribed. At **10.0**, open Weekly Meeting Recording.m4a: waveform and three AI summary points, popping in at 10.25 / 10.5 / 10.75; highlight Action items at **11.0** | Pull to z 1.35 at 8.0; **10.0 whip** to document | v3: "Documents, images, audio, and video become searchable memories." 8.15 | Add sixteenth-note shaker; fill at 11.5 |
| 5 | 12.0–16.0 | 7–8 | Chapter "03 Apply · Memory becomes everything." Cursor clicks the composer at **12.0** and types "What action items did we agree on in last week's meeting?" on sixteenth notes; **13.5** Enter to send. Answer appears line by line; **13.75** citation card [Weekly Meeting Recording.m4a 03:12]; **14.75 / 15.25** agent actions: "✓ Create folder: Meeting action items" and "✓ Save: Action list" | **12.0 whip** to composer z 1.7; push into answer at 13.6 | v4: "Ask in a sentence. Get answers with sources—and help organizing them." 12.15 | **Remove kick at 15.0–16.0**; snare roll and rising noise |
| 6 | 16.0–20.4 | 9–10 | At **16.0**, window collapses; show logo, Xiaohei OmniBox, and slogan. Xiaohei hops across **16.5** Everything → **17.0** memory → **17.5** Memory → **18.0** everything; final stomp lights the slogan with pixel sparks. At 18.5: Start for free · omnibox.pro | Pull to z 1.0; very slow final push | v5a: "Everything becomes memory," 16.40; v5b: "Memory becomes everything." 17.45 | Crash return at 16.0; Cmaj9 and glockenspiel arpeggio at 18.0; fade at 19.9 |

**Subtitles:** hold each sentence for at least 1.8 s, in a bottom-centered frosted-glass pill. The ending slogan is already large on screen, so include it only in the .srt, not as burned-in subtitles.
**Overlays:** top-left chapter pill, 01–03; bottom-left "⏎ Send" keyboard HUD on sending. No other overlays.

---

## 4. Pixel Xiaohei Design

- Grid: 16×13; black `#141414`. Eyes: 4×4 cream `#FBF3E4` rings with 2×2 black pupils. Ear tips are one pixel; rounded lower head corners.
- Eyes provide every expression: forward, left, right, up, down, smiling squint (∩∩), closed, wide-eyed with one-pixel pupils, and blinking.
- No hands or feet. Movement is hopping: 0.12 s anticipation crouch, squash by 0.28 → stretch on takeoff → squash and rebound on landing, kicking up pixel dust.
- At rest, squash gently on every beat, breathing with the music.
- Props share the same pixel grid: yellow `#F5C542` sparks, green checkmark, exclamation mark, and heart.
- Xiaohei stands only on the top edges of real elements: composer, resource rows, summary cards, answers, and slogan text. Measure positions from the DOM every frame; do not hardcode coordinates.

---

## 5. Sound Design

| Section | Ambience | Foley | Music |
|---|---|---|---|
| 0–2 | Very faint room tone | Blink beep and pixel crackle during transformation | Eighth-note hi-hats and rising chiptune arpeggio |
| 2–4 | — | Landing thump on the downbeat | Full band enters on Fmaj7 |
| 4–8 | — | Pop on each saved item, on the beat; 8-bit jumps and landings | G6 → Em7, full groove |
| 8–12 | — | Row-step click plus square-wave confirmation; summary popup dings | Am7 → F, add shaker |
| 12–16 | — | Sixteenth-note keyboard with human variation, sending swish, tool-completion tick | G → Em, drop out at 15 s to build tension |
| 16–20.4 | — | Square-wave C–E–G–C for word hops; heavy sub-bass on the final stomp | Return; Cmaj9 and glockenspiel at 18.0 |

**Silence:** remove the kick at 15.0–16.0; almost complete silence at 15.75–16.0, broken by the 16.0 crash.
**Audio transitions:** start the whoosh half a beat before each whip (J-cut); sustain the final chord through the fade (L-cut).

---

## 6. Technical Notes

- Visuals are a function of time: `window.render(t)`, deterministic and renderable frame by frame. Playwright captures JPEGs in a headless browser for ffmpeg.
- One timeline, `film/film.js`, controls narration starts, camera, Xiaohei, cursor, UI state, and `window.EV` sound events; `sound.py` reads `events.json` to produce music and mix.
- Camera: a continuous screencast-software-style shot, always at zoom ≥ 1. Use anisotropic motion blur only for whips; keep slow pushes sharp.
- Font: Noto Sans SC, SIL OFL 1.1.
- Music samples: Salamander Grand Piano (CC BY 3.0), MuldjordKit (CC BY 4.0), VSCO 2 CE / VCSL / Karoryfer (CC0). Synthesize chiptune and foley with numpy.
- Voiceover: Microsoft neural voices via edge-tts; check Microsoft's terms before commercial use.

## 7. Do Not

- Do not invent buttons or features, change official names, or paste screenshots.
- Do not show hands; the cursor represents the user.
- Do not leave Xiaohei floating, obscure text that needs reading, or position it below subtitles.
- Do not pull the frame beyond the screen.
