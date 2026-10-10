# Xiaohei OmniBox · Product Intro Storyboard v1 (45 Seconds)

> Format: no voiceover; music, sound effects, and on-screen text only, matching the three references.
> Specifications: 1920×1080 · 60 fps · 45 s = 2700 frames · 120 BPM music (1 beat = 0.5 s = 30 frames; 1 bar = 2 s).
> All visuals are simulated in Remotion with React/CSS; no screen recordings or screenshots. This includes macOS browser windows, Zhihu, a news site, Bilibili, Xiaohongshu, X, WeChat chats, the mobile app, and OmniBox web (sidebar, resource tree, and chat history).
> Copy: `product-features-and-slogans.md`. Style analysis: `reference-video-analysis.md`. Production prompt: `prompt.md`.
> This is an English translation of the original Chinese-language production brief. Quoted screen copy is translated for the reader; the original Chinese IME choreography is described in English.

---

## 0. Overall Design

**Story in one sentence:** begin with "Hello, Xiaohei!" After typing finishes, Xiaohei peeks in from the screen edge, bounces onto the text, blinks, and travels with the text into the OmniBox composer; the message is sent and Xiaohei replies. Then follow it as scattered content is captured, understood, used, and shared, ending with its eyes resolving into the logo.

**Structure:** the website's four-part sequence: "Capture · Understand · Apply · Open."

| Section | Time | Duration | Theme | Main reference |
|---|---|---|---|---|
| A Opening | 0.0–5.0 | 5.0 s | Hello, Xiaohei! (typing → peek, hop, blink → move together into the composer) | Reference 2: large type on black and typewriter; reference 3: shared-element morph and spring physics |
| B One-click saving | 5.0–9.0 | 4.0 s | Browser extension | Reference 1: 3D browser and click-driven push-in; reference 3: button morph |
| C Capture from everywhere | 9.0–12.0 | 3.0 s | Anytime, anywhere | Reference 1: whip-pan montage |
| D Understand | 12.0–18.0 | 6.0 s | Everything becomes memory. | Reference 3: shared-element morph |
| E Apply | 18.0–30.0 | 12.0 s | Ask · Write · Act | Reference 1: dark UI and alternating close-ups / wide shots |
| F Share and collaborate | 30.0–35.0 | 5.0 s | Sharing and teams | Reference 3: component morphs on an off-white canvas |
| G Open and cross-platform | 35.0–39.0 | 4.0 s | All platforms and open source | Reference 1: 3D device array |
| H Brand | 39.0–45.0 | 6.0 s | Slogan and logo | Reference 2: word-by-word type and light ribbons resolving into an icon |

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

### A Opening · Hello, Xiaohei! (0.0–5.0 s)

> Core idea: the opening line is the user's first message to Xiaohei. After typing finishes, Xiaohei peeks from the left edge, bounces out, hops onto the text, and blinks. Then **Xiaohei and the text travel together** into the OmniBox web composer: the line becomes input text, and Xiaohei becomes the outlined cat peeking over the composer's upper edge. The film begins with a real conversation.
>
> On black, use the **outlined version**: cream-white `#FEF6EC` stroke around 4 px, white eye rings with black pupils, and `#0B0B0C` fill. Match the chat home screen's outlined cat so the transition needs only translation and scaling, not a new design.
> Xiaohei has only a head, with no body or legs; see `../assets/xiaohei-character.jpg`. Every move is a whole-head bounce with squash and stretch: squash in anticipation, stretch in flight, then squash and rebound on landing.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 0.0 → 0.4 | Black. A white text caret `▏` blinks twice in the center, once per beat | Almost stationary, with a tiny push from scale 1.00 → 1.01 | No music; very faint room tone |
| 0.4 → 1.5 | Type **"Hello, Xiaohei!"** in the center, white, 96 px, PingFang SC Medium.<br>Simulate the original Chinese IME:<br>· Type underlined pinyin `ni hao`; briefly show candidates, then commit the Chinese characters meaning "Hello".<br>· Type a comma.<br>· Type `xiao hei`; show candidates and commit Xiaohei's Chinese name.<br>· Finish with an exclamation mark.<br>Keystrokes follow sixteenth notes, about 0.125 s each, with ±2 frames of human variation | Keep the line centered as it grows; each committed character bounces from scale 1.04 → 1; candidate bar uses dark-gray frosted glass at 60% transparency | **Mechanical keyboard:** soft letter keys, a slightly heavier spacebar commit, and a strong exclamation-mark hit on the 1.5 s beat |
| 1.5 → 1.8 | Typing ends; the caret blinks once and disappears. A quiet moment | Hold the camera and negative space | Keyboard tail and a brief silence |
| 1.8 → 2.3 | **Peek:** half of Xiaohei's head emerges from the left edge, first an ear tip, then both eyes.<br>· 1.95 s: pupils look right at the text.<br>· 2.05 s: retract slightly in a shy, exploratory motion.<br>· 2.15 s: reveal most of the head, tilted about 10° right, inspecting the text | Camera shifts about 40 px left to make room; screen edge clips Xiaohei | Soft "coo" on peeking; "swish" on retracting |
| 2.3 → 2.8 | **Bounce out:**<br>· Anticipation: squash for about 6 frames, scaleY 0.8 and scaleX 1.15.<br>· Takeoff: the whole head springs out, stretching to scaleY 1.15 along a parabola.<br>· Landing: touch the implied ground below-left of the text, on the extended baseline; squash and rebound with damping 10; three short white impact lines.<br>· Look toward the text after landing | Parabolic landing point about 260 px left of the text | Takeoff "pop" and light, bouncy landing "thump" |
| 2.8 → 3.3 | **Hop onto the text:** squash again, then jump higher, with the apex about 160 px above the text; **land directly on the two Chinese characters for Xiaohei**.<br>· The whole line sinks 6 px and springs back like a trampoline.<br>· Xiaohei squashes, rebounds, and settles | Camera tilts slightly up with the jump, then back down | Higher-pitched second "pop"; landing "tap" and text rebound "boing" |
| 3.3 → 3.6 | **Blink:** turn toward the camera, close the eyes for 4 frames and reopen; pupils grow slightly as if greeting the viewer | Very gentle push-in | Single glockenspiel "ding" |
| 3.6 → 4.25 | **Xiaohei and the text enter the composer together (T-MORPH):**<br>· **Text:** "Hello, Xiaohei!" shrinks from 96 px to 15 px while sliding into the top-left of the **chat home composer**, replacing "Ask anything"; the trailing caret continues blinking.<br>· **Xiaohei:** moves and shrinks while sitting on the text; on arrival, slides behind the composer's upper edge to become the **peeking outlined cat**, with only the upper head and eyes visible, matching the recording. Settle with a slight dip, blink, and look at the text.<br>· **UI:** fade from black to `#262626`, recreating the recording 1:1. Suggested prompt bubbles appear near Xiaohei: "Create an 'Image collection' folder and move recent images into it." Bottom left: "+" and "✋ Manual confirmation ⌄"; bottom right: "Agent 2.1 Medium" and the round send button. Two cards rise below: **Upload documents** · Put your knowledge to work · Supports documents, webpages, audio, video, and more (Local upload / WeChat assistant / Install extension), then **Recently updated** with two PDFs.<br>· 4.0 s: text lands; the send button changes from gray to white, ready to send | Pull back from the text to a medium chat-home shot, scale 2.0 → 1.15; rotateX 4° → 0°. Xiaohei and the text remain the same continuously moving elements, not rebuilt copies. They arrive about 6 frames ahead of the UI fade | **Full band enters at 4.0 s**, with a light crash; text lands with a "tap," Xiaohei with a "pop" |
| 4.25 → 4.5 | Press Enter; a bottom-left "⏎ Send" HUD flashes. Text flies to the upper right as a "Hello, Xiaohei!" user bubble; Xiaohei retracts behind the composer; home cards sink and fade; the conversation page replaces the home screen and the sidebar slides in (Resources \| Chats) | Follow the bubble upward | Heavy Enter key, then a sending "swish" |
| 4.5 → 4.9 | Xiaohei's reply streams quickly: "Hello! I'm Xiaohei (OmniBox) 👋 Whatever you want to remember, leave it to me." | Begin accelerating right as the reply finishes | Completion "ding" |
| 5.0 | — | **T-WHIP → B**, rightward into the browser | Whoosh starts half a beat early; crash at 5.0 |

### B One-click Saving · Browser Extension (5.0–9.0 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 5.0 → 5.8 | A macOS Chrome window floats over a beige desktop: traffic-light controls, address `zhuanlan.zhihu.com/p/7281…`, bookmarks, and extension icon. Simulated Zhihu article: **"The Year of AI Agents: How Can Anyone Build a Second Brain?"** with author avatar, 32k upvotes, and three paragraphs; page scrolls down automatically | rotateY −14°, rotateX 6°; settle from the whip and push slowly; depth-of-field blur at window edges | Drums and bass continue |
| 5.8 → 6.2 | Cursor moves to and clicks the **Xiaohei extension icon** at the top right, a cat head on blue | **Extreme close-up:** push 4× into the toolbar with strong background blur; icon scales to 0.92 and rebounds | Click "tap" |
| 6.2 → 6.8 | **Floating extension card** springs from the icon into the page's top right: white, radius 16, width 288.<br>· Header: Xiaohei logo and name, plus home / feedback / gear icons.<br>· Black **"Save to Xiaohei"** button.<br>· "Save to: Personal / AI research."<br>· "Specific area · Hold ⌥" toggle | Spring from the top-right origin; pull from close-up to a medium shot showing the card and article | Popup "pop" |
| 6.8 → 7.0 | Click "Save to Xiaohei" | **T-PUSH** into the button | Click |
| 7.0 → 8.0 | Button morph: black button contracts into a circle → "Saving…" spinner → checkmark → stretches into a **black capsule toast** at the top: "✓ Saved to this folder　View" | **T-MORPH**, following reference 3's button → loading → checkmark → capsule; damping 12 | Loading beeps; checkmark "ding" |
| 8.0 → 9.0 | Select the sentence "A true second brain isn't a bookmark folder; it's a memory that can answer your questions." A white selection menu appears: "Copy \| **Save to Xiaohei**." Click; the selection flashes with a blue outline. Lower-left headline: **"One click. A whole page or just a selection."** | Track the cursor sideways; prepare the whip from 8.75 | Tom fill at 8.5 |
| 9.0 | — | **T-WHIP → C**, leftward | Whoosh and crash |

### C Capture from Everywhere · Anytime, Anywhere (9.0–12.0 s)

> Rhythm: switch to another source card every half-beat. Arrange cards in a horizontal 3D corridor, rotateY ±25° with staggered Z positions; whip through the corridor. Each card settles with the same black "✓ Saved" capsule at the top, creating a repeated visual rhythm.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 9.0 → 9.5 | **News site:** simulated "Tech Frontier Daily," headline "Chinese LLM Inference Costs Fall 90% in One Year"; "✓ Saved" capsule | Settle from the whip with a slight card bounce | Each save gets a "pop" on the beat |
| 9.5 → 10.0 | **Bilibili video page:** simulated "Understand RAG in 10 Minutes," including a progress bar; after saving, a "Chapters · Key frames" thumbnail strip unfolds below | Whip pan | Pop |
| 10.0 → 10.5 | **Xiaohongshu post**, "My Notion Alternative: A Productivity Checklist," and **X post**, an English AI news post, save side by side | Pull back to show both | Two pops on eighth notes |
| 10.5 → 11.0 | **Portrait iPhone, WeChat chat with Xiaohei:** user sends `Q3 Product Review.pdf`, a 0:12 voice message, a whiteboard photo, and "Weekly meeting conclusions #meeting," spaced one eighth note apart; small checkmarks appear | Phone rotates upward into view, rotateY 20° → 0° | Four WeChat sending swishes |
| 11.0 → 11.5 | Phone morphs in place into the **OmniBox app**, bottom tabs "More · Record · Text"; tap Record to reveal a waveform. An **RSS subscription folder** slides in alongside; three articles arrive automatically, badge "+3." Centered headline: **"Anytime, anywhere. Leave it to Xiaohei."** | T-MORPH for the phone; all cards recede into a ring | Recording cue |
| 11.5 → 12.0 | All source cards shrink into blue light dots and stream right like meteors | **T-DOT → D**, into the next scene's sidebar | Rising riser; land on the 12.0 beat |

### D Understand · Everything Becomes Memory (12.0–18.0 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 12.0 → 13.0 | Wide **OmniBox web, dark mode**. Sidebar: "Jabori's space ⌄" → "Xiaohei / Notifications 🔴3 / Xiaohei community / Invite and earn" → capsule **Resources** \| Chats → Personal tree. Dots land on successive beats, growing rows with "Parsing" spinners: `The Year of AI Agents… (Zhihu)`, `Q3 Product Review.pdf`, `Whiteboard Photo.jpg`, `Weekly Meeting Recording.m4a`, `Understand RAG in 10 Minutes (Bilibili)` | Tilted window straightens; medium sidebar shot, then slowly pull back | Click as each row arrives |
| 13.0 → 16.5 | Split the main area into four panels, each showing a resource being understood. Each panel **morphs out of its sidebar row** via T-MORPH:<br>① 13.0 **PDF:** paper page → lines light up; label **Documents → Full-text search**.<br>② 13.75 **Whiteboard photo:** blue scan line, OCR boxes around handwriting, then text; label **Images → Text recognition**.<br>③ 14.5 **Meeting recording:** waveform → timestamped transcript → three AI summary points; label **Audio & video → Transcripts and summaries**.<br>④ 15.25 **Bilibili video:** timeline divides into four chapters and key-frame thumbnails.<br>16.0: colored `#AI`, `#meeting`, `#todo`, `#product` capsules appear below all four panels; label **Automatically tagged** | Push into each panel for about 0.75 s; return to a four-panel wide view at 16.0 | Scan buzz, transcript typing, three summary dings |
| 16.5 → 17.5 | Panels collapse; centered frosted-glass **⌘J search box** appears. Type "Action items from last week's meeting"; three results appear with blue-highlighted matches. Headline: **"⌘J. Search. Found."** | Bottom-left "⌘ J" HUD; search box springs out from the center | Sixteenth-note keyboard sounds |
| 17.5 → 18.0 | Dim to black; **"Everything becomes memory."** appears word by word | Blue ribbon sweeps behind the words | Snare fill at 17.5 |
| 18.0 | — | **T-ARC → E**, ribbon wipes back to OmniBox | Crash |

### E Apply · Memory Becomes Everything (18.0–30.0 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 18.0 → 19.5 | **Chat home.** Sidebar capsule slides from Resources to **Chats**; **chat history** unfolds:<br>Today: `Hello, Xiaohei!`, `Organize weekly meeting action items`.<br>Past 7 days: `RAG vs. fine-tuning`, `Grocery list request`, `Q3 review highlights`.<br>September 2026: `Zhihu trending summary`, `AI news at a glance`, `New chat`…<br>Centered **outlined Xiaohei head** peeks over the composer and blinks. Suggested prompt: "List all resources tagged 'meeting'." Greeting: "Good evening. How can I help you today?" | Spring sidebar slider; pan from sidebar to a medium main-area shot | Full groove with claps |
| 19.5 → 21.0 | Click composer with "Ask anything" placeholder; type on sixteenth notes: **"What are three AI agent trends in my saved sources?"** Enable the bottom-left Deep thinking bulb; bottom right "Agent 2.1 · Medium"; send | Input close-up like reference 1; T-PUSH on send | Typing and sending swish |
| 21.0 → 22.5 | Conversation page: user bubble upper right; "Thinking" → collapsible **Deep thinking** in small gray text → "Searching…" spinner → streamed answer with three bold subheadings, each ending in blue **citation badges** ①②③. Headline: **"Answers with sources. Every time."** | Pull back from input to the complete answer, like reference 1's three-column wide shot | Soft streaming rustle |
| 22.5 → 23.5 | Hover citation ② to reveal a source card: The Year of AI Agents… (Zhihu), paragraph excerpt. Click to **jump to the original Zhihu article**, with the relevant sentence highlighted yellow | **T-WHIP**, citation → source → back | Click and two whooshes |
| 23.5 → 26.5 | Return to chat. Switch input to Writing mode, type **"Turn these into a weekly report"**, and send. Generate a long **AI Weekly Brief · Week 40**, with title, contents, three sections, and a table, scrolling as it streams. Click "Save this response to personal space" below; document collapses into a row and **flies into the resource tree**. Headline: **"Turn your sources into a weekly report."** | Tilt slowly upward with the growing document; T-DOT from document to sidebar row on save | Fill at 25.5; save pop |
| 26.5 → 29.0 | Type **"Organize my AI-related sources and add tags."** Show **Agent 2.1 tool calls**:<br>✓ Search resources: 6 found.<br>⏸ Create "AI research" folder, awaiting confirmation; **Approve** / Reject / Approve all.<br>Extreme close-up on clicking Approve → ✓ Create folder → ✓ Move 6 resources → ✓ Add #AI tag.<br>Six sidebar rows fly into the new "📁 AI research" folder, which expands. Headline: **"One request. Everything organized."** | Extreme close-up and press scale on Approve, like reference 3; then split view of resource-tree animation and tool-call list | Completion ticks on beats |
| 29.0 → 30.0 | Dim the scene; **"Memory becomes everything."** appears word by word; smaller line: "Ask · Write · Act" | Light ribbon sweeps in the opposite direction behind text | Drop kick at 29.0; snare roll builds anticipation |
| 30.0 | — | **T-MORPH → F**: top-right Share icon enlarges into a black capsule button on off-white | Crash |

### F Share and Collaborate (30.0–35.0 s)

> Switch to reference 3's style: off-white canvas `#EDEDEA`, a single continuously morphing black component in the center, with the cursor driving the story.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 30.0 → 30.5 | Click black Share capsule | Press to scale 0.95 and rebound | Click |
| 30.5 → 32.0 | Capsule expands into a white **sharing settings card**. Adjust four controls on successive beats: Require login → Password protection → Expiration: 7 days (dropdown) → AI Q&A: Enabled (Disabled / Chat only / **Enabled**, sliding selection). Headline: **"Share your knowledge. Take AI along."** | **T-MORPH**; each control changes on a beat with a bounce | Four switch clicks |
| 32.0 → 32.5 | Click Copy link; card contracts into `omnibox.pro/s/xH8…` capsule and checkmark | T-MORPH | Ding |
| 32.5 → 35.0 | Link becomes a **WeChat share card**, "A conversation from Xiaohei OmniBox." Four member avatars appear sequentially beside it, then join a **Team** space card: Personal \| Team columns, resources appearing row by row under Team. Headline: **"A second brain for you. A knowledge base for your team."** | Slowly pull back as components multiply; prepare transition at 34.75 | Four joining tones |
| 35.0 | — | **T-WHIP → G**, upward | Whoosh |

### G Open · Every Platform (35.0–39.0 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 35.0 → 37.0 | On black, a 3D device fan opens: macOS browser with OmniBox web, extension card, iPhone app, Android phone, WeChat window, and QQ window. Xiaohei's eyes blink in each. Labels light up sequentially: Web · Extension · iOS · Android · WeChat · QQ. Headline: **"Every platform. One Xiaohei."** | Orbit from front to 30° side view, like reference 1; devices emerge sequentially from depth of field | One glockenspiel note per device |
| 37.0 → 39.0 | Devices fade; three rapid shots, about 0.65 s each, paired with headlines:<br>① GitHub repo card `import-ai/omnibox` · ⭐ → **Open source**.<br>② `docker compose up` and "Ollama · Run offline" → **Self-hosted**.<br>③ Terminal: `claude` calls `/omnibox search "weekly meeting action items"` and receives results → **Ready for your agent** | Hard cut for each with a small scale impact, 1.06 → 1 | Three strong hits; fill at 38.5 |
| 39.0 | — | **T-ARC → H**, ribbon sweeps to black | Crash |

### H Brand · Slogan (39.0–45.0 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 39.0 → 41.5 | Black. Slogan appears one word per beat, centered alone at 160 px: **Everything** → **becomes** → **memory**; from 40.5 s, **Memory** → **becomes** → **everything**. Memory uses the brand-blue gradient, echoing the reversible phrase | Slight Z motion and blurred fade-in for each word, like reference 2; blue ribbon arcs around the type | One chord tone per word |
| 41.5 → 43.0 | Ribbon contracts into **two cream eye rings**, recalling the opening. Xiaohei's black head silhouette grows around them, then contracts into the **rounded-square logo**, blue gradient background with the cat peeking from below | T-MORPH from eyes to logo; slight landing bounce | Drop out at 41.5; big chord at 42.0 |
| 43.0 → 44.2 | Bold **Xiaohei OmniBox** appears right of the logo; below, **Your AI knowledge companion**; then smaller **Start for free · omnibox.pro** | Lines appear sequentially from blurred to sharp | Glockenspiel arpeggio |
| 44.2 → 45.0 | Xiaohei in the logo **blinks once**; hold, then fade to black over the final 0.3 s | Very slow push, scale 1.00 → 1.03 | Chord sustains through fade |

---

## 2. Beat and Keyframe Reference (60 fps)

| Event | Seconds | Frame |
|---|---|---|
| Finish typing "Hello, Xiaohei!" | 1.5 | 90 |
| Xiaohei peeks | 1.8 | 108 |
| Xiaohei bounces out / lands | 2.3 / 2.65 | 138 / 159 |
| Xiaohei hops onto text / settles | 2.8 / 3.15 | 168 / 189 |
| Xiaohei blinks | 3.4 | 204 |
| Xiaohei and text begin transitioning | 3.6 | 216 |
| Text lands in composer; full band enters | 4.0 | 240 |
| Enter to send | 4.25 | 255 |
| T-WHIP → B | 5.0 | 300 |
| Extension card appears | 6.2 | 372 |
| Save morph completes as toast | 7.8 | 468 |
| T-WHIP → C | 9.0 | 540 |
| T-DOT → D | 12.0 | 720 |
| Four-panel understanding sequence begins | 13.0 | 780 |
| T-ARC → E | 18.0 | 1080 |
| Send question | 21.0 | 1260 |
| Citation jumps to source | 22.5 | 1350 |
| Click Agent approval | 27.5 | 1650 |
| T-MORPH → F | 30.0 | 1800 |
| T-WHIP → G | 35.0 | 2100 |
| T-ARC → H | 39.0 | 2340 |
| Logo settles | 43.0 | 2580 |
| End | 45.0 | 2700 |

**Rule:** 0–4 s is a drumless intro, with keyboard, foley, and a light bed. **The full band enters at 4.0 s**; bars then last 2 s, with downbeats on even seconds. Transitions after 12 s land on downbeats; the 5.0 and 9.0 s whips land on beat 3, the secondary strong beat, also with crashes. Clicks, saves, and switches land on beats, multiples of 0.5 s; typing follows sixteenth notes, 0.125 s.

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
