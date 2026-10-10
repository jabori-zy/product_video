# Xiaohei OmniBox · Product Intro Storyboard v1 · Untimed Version (≈89 Seconds)

> Format: no voiceover; music, sound effects, and on-screen text only, matching the three references.
> Specifications: 1920×1080 · 60 fps · ≈89.2 s = 5354 frames. Music is not yet scored for this version (see the pacing note below).
> All visuals are simulated in Remotion with React/CSS; no screen recordings or screenshots. This includes macOS browser windows, Zhihu, a news site, Bilibili, Xiaohongshu, X, WeChat chats, the mobile app, and OmniBox web (sidebar, resource tree, and chat history).
> Copy: `product-features-and-slogans.md`. Style analysis: `reference-video-analysis.md`. Production prompt: `prompt.md`.
> This is an English translation of the original Chinese-language production brief. Quoted screen copy is translated for the reader; the original Chinese IME choreography is described in English.

> **Untimed version.** Content is identical to `script.md`: same shots, copy, order, transitions and choreography. Only the timing changes. It drops the 45 s limit and plays at a moderate pace. Rendered as `../demo/out/demo-89s.mp4` (composition `DemoPaced`); the timing map is `../demo/src/pace.ts`.

### Pacing note

- **Why the 45 s cut feels rushed:** each section packs a lot into a few seconds.
  - C shows a new source card every 0.5 s.
  - A streams Xiaohei's reply in 0.4 s.
  - D gives each "understand" panel 0.75 s.
  - E fits the answer, citations, weekly report and Agent run into 11 s.
  - G shows the three open-source shots at 0.65 s each.
  - Every headline is on screen for only 0.5–1 s.
- **How it is slowed:**
  - Moments where the picture has settled and there is something to read are stretched 2–6× (cards, reply, panels, headlines, toast).
  - Motion (camera moves, hops, morphs) is stretched only 1.3–1.8×, so the physics doesn't look floaty.
  - Transitions (whip, dot, arc, morph) stay near original speed (1.2–2×), so the cuts still snap.
- **Section lengths:** A 9.3 s · B 7.6 · C 8.1 · D 14.2 · E 22.5 · F 9.4 · G 8.6 · H 9.6, for 89.2 s in total.
- **Music:** the original 120 BPM beat grid no longer applies. A score for this version needs to follow the new timestamps below, not bars.

---

## 0. Overall Design

**Story in one sentence:** begin with "Hello, Xiaohei!" After typing finishes, Xiaohei peeks in from the screen edge, bounces onto the text, blinks, and travels with the text into the OmniBox composer; the message is sent and Xiaohei replies. Then follow it as scattered content is captured, understood, used, and shared, ending with its eyes resolving into the logo.

**Structure:** the website's four-part sequence: "Capture · Understand · Apply · Open."

| Section | Time | Duration | Theme | Main reference |
|---|---|---|---|---|
| A Opening | 0.0–9.3 | 9.3 s | Hello, Xiaohei! (typing → peek, hop, blink → move together into the composer) | Reference 2: large type on black and typewriter; reference 3: shared-element morph and spring physics |
| B One-click saving | 9.3–16.9 | 7.6 s | Browser extension | Reference 1: 3D browser and click-driven push-in; reference 3: button morph |
| C Capture from everywhere | 16.9–25.0 | 8.1 s | Anytime, anywhere | Reference 1: whip-pan montage |
| D Understand | 25.0–39.2 | 14.2 s | Everything becomes memory. | Reference 3: shared-element morph |
| E Apply | 39.2–61.7 | 22.5 s | Ask · Write · Act | Reference 1: dark UI and alternating close-ups / wide shots |
| F Share and collaborate | 61.7–71.1 | 9.4 s | Sharing and teams | Reference 3: component morphs on an off-white canvas |
| G Open and cross-platform | 71.1–79.7 | 8.6 s | All platforms and open source | Reference 1: 3D device array |
| H Brand | 79.7–89.2 | 9.6 s | Slogan and logo | Reference 2: word-by-word type and light ribbons resolving into an icon |

**Visual guidelines**

- **Three base colors:**
  - Brand sections: near-black `#0B0B0C`.
  - OmniBox UI: dark mode, main area `#262626`, sidebar `#171717`, matching the recordings.
  - Component sections: off-white canvas `#EDEDEA` (reference 3).
  - Third-party webpages such as Zhihu remain white, contrasting with the dark product UI.
- **Accent:** brand blue gradient `#4A8EF9 → #B2D0FF` (logo), used only for light ribbons, highlights, citations, and the logo.
- **Xiaohei:** a black `#171717` cat head with cream eye rings `#FEF6EC`. Its **eyes** are the recurring motif: the outlined cat peeks from the left edge, hops onto the text, blinks, and moves with it into the composer, becoming the peeking cat on the chat home screen. Xiaohei blinks on the chat home screen and in the device array; the final light ribbons form eye rings and then the logo.
- **On-screen text:** PingFang / Noto Sans SC. Large text is centered and appears word by word; UI annotations use 28–36 px white text with a subtle shadow.
- **Camera:** all UI lives in 3D space (`perspective: 2400px`). Keep the camera moving; no shot remains static for more than 1.5 s.

**Transition codes used below**

| Code | Name | Method |
|---|---|---|
| T-PUSH | Click-driven push-in | After a click, push about 2.5× toward the click point; the next visual unfolds from there |
| T-WHIP | Whip pan | Horizontal whip over 0.25–0.35 s with directional motion blur of 24–40 px and a slight settling bounce |
| T-MORPH | Shared-element morph | Spring-interpolate the outline's width, height, radius, and color into the next component; crossfade contents |
| T-DOT | Collapse into dots | Elements shrink into blue light dots and flow toward the next scene's destination |
| T-ARC | Light ribbon | A curved brand-blue gradient ribbon wipes the scene to black |

---

## 1. Storyboard

### A Opening · Hello, Xiaohei! (0.0–9.3 s)

> Core idea: the opening line is the user's first message to Xiaohei. After typing finishes, Xiaohei peeks from the left edge, bounces out, hops onto the text, and blinks. Then **Xiaohei and the text travel together** into the OmniBox web composer: the line becomes input text, and Xiaohei becomes the outlined cat peeking over the composer's upper edge. The film begins with a real conversation.
>
> On black, use the **outlined version**: cream-white `#FEF6EC` stroke around 4 px, white eye rings with black pupils, and `#0B0B0C` fill. Match the chat home screen's outlined cat so the transition needs only translation and scaling, not a new design.
> Xiaohei has only a head, with no body or legs; see `../assets/xiaohei-character.jpg`. Every move is a whole-head bounce with squash and stretch: squash in anticipation, stretch in flight, then squash and rebound on landing.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 0.0 → 0.6 | Black. A white text caret `▏` blinks twice in the center, once per beat | Almost stationary, with a tiny push from scale 1.00 → 1.01 | No music; very faint room tone |
| 0.6 → 2.1 | Type **"Hello, Xiaohei!"** in the center, white, 96 px, PingFang SC Medium.<br>Simulate the original Chinese IME:<br>· Type underlined pinyin `ni hao`; briefly show candidates, then commit the Chinese characters meaning "Hello".<br>· Type a comma.<br>· Type `xiao hei`; show candidates and commit Xiaohei's Chinese name.<br>· Finish with an exclamation mark.<br>Keystrokes follow sixteenth notes, about 0.175 s each, with ±2 frames of human variation | Keep the line centered as it grows; each committed character bounces from scale 1.04 → 1; candidate bar uses dark-gray frosted glass at 60% transparency | **Mechanical keyboard:** soft letter keys, a slightly heavier spacebar commit, and a strong exclamation-mark hit at 2.1 s |
| 2.1 → 2.7 | Typing ends; the caret blinks once and disappears. A quiet moment | Hold the camera and negative space | Keyboard tail and a brief silence |
| 2.7 → 3.4 | **Peek:** half of Xiaohei's head emerges from the left edge, first an ear tip, then both eyes.<br>· 2.9 s: pupils look right at the text.<br>· 3.1 s: retract slightly in a shy, exploratory motion.<br>· 3.2 s: reveal most of the head, tilted about 10° right, inspecting the text | Camera shifts about 40 px left to make room; screen edge clips Xiaohei | Soft "coo" on peeking; "swish" on retracting |
| 3.4 → 4.0 | **Bounce out:**<br>· Anticipation: squash for about 6 frames, scaleY 0.8 and scaleX 1.15.<br>· Takeoff: the whole head springs out, stretching to scaleY 1.15 along a parabola.<br>· Landing: touch the implied ground below-left of the text, on the extended baseline; squash and rebound with damping 10; three short white impact lines.<br>· Look toward the text after landing | Parabolic landing point about 260 px left of the text | Takeoff "pop" and light, bouncy landing "thump" |
| 4.0 → 4.7 | **Hop onto the text:** squash again, then jump higher, with the apex about 160 px above the text; **land directly on the two Chinese characters for Xiaohei**.<br>· The whole line sinks 6 px and springs back like a trampoline.<br>· Xiaohei squashes, rebounds, and settles | Camera tilts slightly up with the jump, then back down | Higher-pitched second "pop"; landing "tap" and text rebound "boing" |
| 4.7 → 5.1 | **Blink:** turn toward the camera, close the eyes for 4 frames and reopen; pupils grow slightly as if greeting the viewer | Very gentle push-in | Single glockenspiel "ding" |
| 5.1 → 6.6 | **Xiaohei and the text enter the composer together (T-MORPH):**<br>· **Text:** "Hello, Xiaohei!" shrinks from 96 px to 15 px while sliding into the top-left of the **chat home composer**, replacing "Ask anything"; the trailing caret continues blinking.<br>· **Xiaohei:** moves and shrinks while sitting on the text; on arrival, slides behind the composer's upper edge to become the **peeking outlined cat**, with only the upper head and eyes visible, matching the recording. Settle with a slight dip, blink, and look at the text.<br>· **UI:** fade from black to `#262626`, recreating the recording 1:1. Suggested prompt bubbles appear near Xiaohei: "Create an 'Image collection' folder and move recent images into it." Bottom left: "+" and "✋ Manual confirmation ⌄"; bottom right: "Agent 2.1 Medium" and the round send button. Two cards rise below: **Upload documents** · Put your knowledge to work · Supports documents, webpages, audio, video, and more (Local upload / WeChat assistant / Install extension), then **Recently updated** with two PDFs.<br>· 5.6 s: text lands; the send button changes from gray to white, ready to send | Pull back from the text to a medium chat-home shot, scale 2.0 → 1.15; rotateX 4° → 0°. Xiaohei and the text remain the same continuously moving elements, not rebuilt copies. They arrive about 6 frames ahead of the UI fade | **Full band enters at 5.6 s**, with a light crash; text lands with a "tap," Xiaohei with a "pop" |
| 6.6 → 7.0 | Press Enter; a bottom-left "⏎ Send" HUD flashes. Text flies to the upper right as a "Hello, Xiaohei!" user bubble; Xiaohei retracts behind the composer; home cards sink and fade; the conversation page replaces the home screen and the sidebar slides in (Resources \| Chats) | Follow the bubble upward | Heavy Enter key, then a sending "swish" |
| 7.0 → 9.1 | Xiaohei's reply streams quickly: "Hello! I'm Xiaohei (OmniBox) 👋 Whatever you want to remember, leave it to me." | Begin accelerating right as the reply finishes | Completion "ding" |
| 9.3 | — | **T-WHIP → B**, rightward into the browser | Whoosh starts half a beat early; crash at 9.3 |

### B One-click Saving · Browser Extension (9.3–16.9 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 9.3 → 10.6 | A macOS Chrome window floats over a beige desktop: traffic-light controls, address `zhuanlan.zhihu.com/p/7281…`, bookmarks, and extension icon. Simulated Zhihu article: **"The Year of AI Agents: How Can Anyone Build a Second Brain?"** with author avatar, 32k upvotes, and three paragraphs; page scrolls down automatically | rotateY −14°, rotateX 6°; settle from the whip and push slowly; depth-of-field blur at window edges | Drums and bass continue |
| 10.6 → 11.2 | Cursor moves to and clicks the **Xiaohei extension icon** at the top right, a cat head on blue | **Extreme close-up:** push 4× into the toolbar with strong background blur; icon scales to 0.92 and rebounds | Click "tap" |
| 11.2 → 12.4 | **Floating extension card** springs from the icon into the page's top right: white, radius 16, width 288.<br>· Header: Xiaohei logo and name, plus home / feedback / gear icons.<br>· Black **"Save to Xiaohei"** button.<br>· "Save to: Personal / AI research."<br>· "Specific area · Hold ⌥" toggle | Spring from the top-right origin; pull from close-up to a medium shot showing the card and article | Popup "pop" |
| 12.4 → 12.8 | Click "Save to Xiaohei" | **T-PUSH** into the button | Click |
| 12.8 → 14.9 | Button morph: black button contracts into a circle → "Saving…" spinner → checkmark → stretches into a **black capsule toast** at the top: "✓ Saved to this folder　View" | **T-MORPH**, following reference 3's button → loading → checkmark → capsule; damping 12 | Loading beeps; checkmark "ding" |
| 14.9 → 16.9 | Select the sentence "A true second brain isn't a bookmark folder; it's a memory that can answer your questions." A white selection menu appears: "Copy \| **Save to Xiaohei**." Click; the selection flashes with a blue outline. Lower-left headline: **"One click. A whole page or just a selection."** | Track the cursor sideways; prepare the whip from 16.4 | Tom fill at 15.8 |
| 16.9 | — | **T-WHIP → C**, leftward | Whoosh and crash |

### C Capture from Everywhere · Anytime, Anywhere (16.9–25.0 s)

> Rhythm: switch to another source card every half-beat. Arrange cards in a horizontal 3D corridor, rotateY ±25° with staggered Z positions; whip through the corridor. Each card settles with the same black "✓ Saved" capsule at the top, creating a repeated visual rhythm.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 16.9 → 18.1 | **News site:** simulated "Tech Frontier Daily," headline "Chinese LLM Inference Costs Fall 90% in One Year"; "✓ Saved" capsule | Settle from the whip with a slight card bounce | Each save gets a "pop" on the beat |
| 18.1 → 19.5 | **Bilibili video page:** simulated "Understand RAG in 10 Minutes," including a progress bar; after saving, a "Chapters · Key frames" thumbnail strip unfolds below | Whip pan | Pop |
| 19.5 → 21.2 | **Xiaohongshu post**, "My Notion Alternative: A Productivity Checklist," and **X post**, an English AI news post, save side by side | Pull back to show both | Two pops on eighth notes |
| 21.2 → 22.9 | **Portrait iPhone, WeChat chat with Xiaohei:** user sends `Q3 Product Review.pdf`, a 0:12 voice message, a whiteboard photo, and "Weekly meeting conclusions #meeting," spaced one eighth note apart; small checkmarks appear | Phone rotates upward into view, rotateY 20° → 0° | Four WeChat sending swishes |
| 22.9 → 24.3 | Phone morphs in place into the **OmniBox app**, bottom tabs "More · Record · Text"; tap Record to reveal a waveform. An **RSS subscription folder** slides in alongside; three articles arrive automatically, badge "+3." Centered headline: **"Anytime, anywhere. Leave it to Xiaohei."** | T-MORPH for the phone; all cards recede into a ring | Recording cue |
| 24.3 → 25.0 | All source cards shrink into blue light dots and stream right like meteors | **T-DOT → D**, into the next scene's sidebar | Rising riser; land at 25.0 |

### D Understand · Everything Becomes Memory (25.0–39.2 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 25.0 → 27.0 | Wide **OmniBox web, dark mode**. Sidebar: "Jabori's space ⌄" → "Xiaohei / Notifications 🔴3 / Xiaohei community / Invite and earn" → capsule **Resources** \| Chats → Personal tree. Dots land on successive beats, growing rows with "Parsing" spinners: `The Year of AI Agents… (Zhihu)`, `Q3 Product Review.pdf`, `Whiteboard Photo.jpg`, `Weekly Meeting Recording.m4a`, `Understand RAG in 10 Minutes (Bilibili)` | Tilted window straightens; medium sidebar shot, then slowly pull back | Click as each row arrives |
| 27.0 → 35.8 | Split the main area into four panels, each showing a resource being understood. Each panel **morphs out of its sidebar row** via T-MORPH:<br>① 27.0 **PDF:** paper page → lines light up; label **Documents → Full-text search**.<br>② 28.9 **Whiteboard photo:** blue scan line, OCR boxes around handwriting, then text; label **Images → Text recognition**.<br>③ 30.8 **Meeting recording:** waveform → timestamped transcript → three AI summary points; label **Audio & video → Transcripts and summaries**.<br>④ 32.7 **Bilibili video:** timeline divides into four chapters and key-frame thumbnails.<br>34.3: colored `#AI`, `#meeting`, `#todo`, `#product` capsules appear below all four panels; label **Automatically tagged** | Push into each panel for about 1.9 s; return to a four-panel wide view at 34.3 | Scan buzz, transcript typing, three summary dings |
| 35.8 → 38.0 | Panels collapse; centered frosted-glass **⌘J search box** appears. Type "Action items from last week's meeting"; three results appear with blue-highlighted matches. Headline: **"⌘J. Search. Found."** | Bottom-left "⌘ J" HUD; search box springs out from the center | Sixteenth-note keyboard sounds |
| 38.0 → 39.2 | Dim to black; **"Everything becomes memory."** appears word by word | Blue ribbon sweeps behind the words | Snare fill at 38.0 |
| 39.2 | — | **T-ARC → E**, ribbon wipes back to OmniBox | Crash |

### E Apply · Memory Becomes Everything (39.2–61.7 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 39.2 → 42.0 | **Chat home.** Sidebar capsule slides from Resources to **Chats**; **chat history** unfolds:<br>Today: `Hello, Xiaohei!`, `Organize weekly meeting action items`.<br>Past 7 days: `RAG vs. fine-tuning`, `Grocery list request`, `Q3 review highlights`.<br>September 2026: `Zhihu trending summary`, `AI news at a glance`, `New chat`…<br>Centered **outlined Xiaohei head** peeks over the composer and blinks. Suggested prompt: "List all resources tagged 'meeting'." Greeting: "Good evening. How can I help you today?" | Spring sidebar slider; pan from sidebar to a medium main-area shot | Full groove with claps |
| 42.0 → 44.1 | Click composer with "Ask anything" placeholder; type on sixteenth notes: **"What are three AI agent trends in my saved sources?"** Enable the bottom-left Deep thinking bulb; bottom right "Agent 2.1 · Medium"; send | Input close-up like reference 1; T-PUSH on send | Typing and sending swish |
| 44.1 → 47.6 | Conversation page: user bubble upper right; "Thinking" → collapsible **Deep thinking** in small gray text → "Searching…" spinner → streamed answer with three bold subheadings, each ending in blue **citation badges** ①②③. Headline: **"Answers with sources. Every time."** | Pull back from input to the complete answer, like reference 1's three-column wide shot | Soft streaming rustle |
| 47.6 → 49.6 | Hover citation ② to reveal a source card: The Year of AI Agents… (Zhihu), paragraph excerpt. Click to **jump to the original Zhihu article**, with the relevant sentence highlighted yellow | **T-WHIP**, citation → source → back | Click and two whooshes |
| 49.6 → 55.0 | Return to chat. Switch input to Writing mode, type **"Turn these into a weekly report"**, and send. Generate a long **AI Weekly Brief · Week 40**, with title, contents, three sections, and a table, scrolling as it streams. Click "Save this response to personal space" below; document collapses into a row and **flies into the resource tree**. Headline: **"Turn your sources into a weekly report."** | Tilt slowly upward with the growing document; T-DOT from document to sidebar row on save | Fill at 53.2; save pop |
| 55.0 → 59.5 | Type **"Organize my AI-related sources and add tags."** Show **Agent 2.1 tool calls**:<br>✓ Search resources: 6 found.<br>⏸ Create "AI research" folder, awaiting confirmation; **Approve** / Reject / Approve all.<br>Extreme close-up on clicking Approve → ✓ Create folder → ✓ Move 6 resources → ✓ Add #AI tag.<br>Six sidebar rows fly into the new "📁 AI research" folder, which expands. Headline: **"One request. Everything organized."** | Extreme close-up and press scale on Approve, like reference 3; then split view of resource-tree animation and tool-call list | Completion ticks on beats |
| 59.5 → 61.7 | Dim the scene; **"Memory becomes everything."** appears word by word; smaller line: "Ask · Write · Act" | Light ribbon sweeps in the opposite direction behind text | Drop kick at 59.5; snare roll builds anticipation |
| 61.7 | — | **T-MORPH → F**: top-right Share icon enlarges into a black capsule button on off-white | Crash |

### F Share and Collaborate (61.7–71.1 s)

> Switch to reference 3's style: off-white canvas `#EDEDEA`, a single continuously morphing black component in the center, with the cursor driving the story.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 61.7 → 62.4 | Click black Share capsule | Press to scale 0.95 and rebound | Click |
| 62.4 → 65.4 | Capsule expands into a white **sharing settings card**. Adjust four controls on successive beats: Require login → Password protection → Expiration: 7 days (dropdown) → AI Q&A: Enabled (Disabled / Chat only / **Enabled**, sliding selection). Headline: **"Share your knowledge. Take AI along."** | **T-MORPH**; each control changes on a beat with a bounce | Four switch clicks |
| 65.4 → 66.7 | Click Copy link; card contracts into `omnibox.pro/s/xH8…` capsule and checkmark | T-MORPH | Ding |
| 66.7 → 71.1 | Link becomes a **WeChat share card**, "A conversation from Xiaohei OmniBox." Four member avatars appear sequentially beside it, then join a **Team** space card: Personal \| Team columns, resources appearing row by row under Team. Headline: **"A second brain for you. A knowledge base for your team."** | Slowly pull back as components multiply; prepare transition at 70.7 | Four joining tones |
| 71.1 | — | **T-WHIP → G**, upward | Whoosh |

### G Open · Every Platform (71.1–79.7 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 71.1 → 75.0 | On black, a 3D device fan opens: macOS browser with OmniBox web, extension card, iPhone app, Android phone, WeChat window, and QQ window. Xiaohei's eyes blink in each. Labels light up sequentially: Web · Extension · iOS · Android · WeChat · QQ. Headline: **"Every platform. One Xiaohei."** | Orbit from front to 30° side view, like reference 1; devices emerge sequentially from depth of field | One glockenspiel note per device |
| 75.0 → 79.7 | Devices fade; three shots, about 1.5 s each, paired with headlines:<br>① GitHub repo card `import-ai/omnibox` · ⭐ → **Open source**.<br>② `docker compose up` and "Ollama · Run offline" → **Self-hosted**.<br>③ Terminal: `claude` calls `/omnibox search "weekly meeting action items"` and receives results → **Ready for your agent** | Hard cut for each with a small scale impact, 1.06 → 1 | Three strong hits; fill at 78.7 |
| 79.7 | — | **T-ARC → H**, ribbon sweeps to black | Crash |

### H Brand · Slogan (79.7–89.2 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 79.7 → 83.4 | Black. Slogan appears one word per beat, centered alone at 160 px: **Everything** → **becomes** → **memory**; from 81.9 s, **Memory** → **becomes** → **everything**. Memory uses the brand-blue gradient, echoing the reversible phrase | Slight Z motion and blurred fade-in for each word, like reference 2; blue ribbon arcs around the type | One chord tone per word |
| 83.4 → 85.5 | Ribbon contracts into **two cream eye rings**, recalling the opening. Xiaohei's black head silhouette grows around them, then contracts into the **rounded-square logo**, blue gradient background with the cat peeking from below | T-MORPH from eyes to logo; slight landing bounce | Drop out at 83.4; big chord at 84.1 |
| 85.5 → 87.6 | Bold **Xiaohei OmniBox** appears right of the logo; below, **Your AI knowledge companion**; then smaller **Start for free · omnibox.pro** | Lines appear sequentially from blurred to sharp | Glockenspiel arpeggio |
| 87.6 → 89.2 | Xiaohei in the logo **blinks once**; hold, then fade to black over the final 0.6 s | Very slow push, scale 1.00 → 1.03 | Chord sustains through fade |

---

## 2. Beat and Keyframe Reference (60 fps)

| Event | Seconds | Frame |
|---|---|---|
| Finish typing "Hello, Xiaohei!" | 2.1 | 128 |
| Xiaohei peeks | 2.7 | 164 |
| Xiaohei bounces out / lands | 3.4 / 3.8 | 203 / 231 |
| Xiaohei hops onto text / settles | 4.0 / 4.5 | 242 / 270 |
| Xiaohei blinks | 4.8 | 289 |
| Xiaohei and text begin transitioning | 5.1 | 305 |
| Text lands in composer; full band enters | 5.6 | 338 |
| Enter to send | 6.6 | 398 |
| T-WHIP → B | 9.3 | 556 |
| Extension card appears | 11.2 | 671 |
| Save morph completes as toast | 14.3 | 856 |
| T-WHIP → C | 16.9 | 1013 |
| T-DOT → D | 25.0 | 1501 |
| Four-panel understanding sequence begins | 27.0 | 1618 |
| T-ARC → E | 39.2 | 2354 |
| Send question | 44.1 | 2646 |
| Citation jumps to source | 47.6 | 2856 |
| Click Agent approval | 56.8 | 3408 |
| T-MORPH → F | 61.7 | 3705 |
| T-WHIP → G | 71.1 | 4266 |
| T-ARC → H | 79.7 | 4781 |
| Logo settles | 85.5 | 5129 |
| End | 89.2 | 5354 |

**Rule (untimed version):** the sequence of events is the same as in `script.md`, but the 120 BPM grid no longer applies. Each event happens at the time in the table above. The sound cues listed in the storyboard (keyboard intro, full band at 5.6 s, crashes on transitions, fills before transitions) keep their positions relative to the picture.

---

## 3. Simulated Content Inventory (Generated and Stored in `src/data/*.ts`)

| Scene | Content |
|---|---|
| Zhihu article | Title: "The Year of AI Agents: How Can Anyone Build a Second Brain?" Author: "Cat in the Woods"; 32k upvotes; three paragraphs including "A true second brain isn't a bookmark folder; it's a memory that can answer your questions." |
| News site | "Tech Frontier Daily"; headline "Chinese LLM Inference Costs Fall 90% in One Year"; three secondary stories |
| Bilibili | "Understand RAG in 10 Minutes" by "Code Bear"; 486k views; four chapters |
| Xiaohongshu | "My Notion Alternative: A Productivity Checklist"; five-image collage; 21k likes |
| X | English post by @ai_daily: "Agents that remember are the next platform shift." |
| WeChat | Contact: Xiaohei. Messages: Q3 Product Review.pdf · 0:12 voice message · whiteboard photo · link · "Weekly meeting conclusions #meeting" |
| Resource tree | Home - Zhihu / The Year of AI Agents… / Q3 Product Review.pdf / Whiteboard Photo.jpg / Weekly Meeting Recording.m4a / Understand RAG in 10 Minutes / Superexx October 2024 Monthly Report.pdf / Docker: Introduction and Practice (4th Edition).pdf |
| Opening chat | User: "Hello, Xiaohei!" Xiaohei: "Hello! I'm Xiaohei (OmniBox), nice to meet you 👋 Whatever you want to remember, leave it to me." |
| Chat history | See section E at 18.0 s; the first Today entry is the opening "Hello, Xiaohei!" |
| AI answer | Three trends: ① From conversation to action through agent execution; ② Long-term memory becomes standard; ③ Personal knowledge bases become AI context. Citations ①②③ |
| Weekly report | "AI Weekly Brief · Week 40": This week's highlights / Key sources / Action items, with a three-row table |
