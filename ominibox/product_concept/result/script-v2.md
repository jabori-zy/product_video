# Xiaohei OmniBox · Product Intro Storyboard · Final v2 (≈124 Seconds)

> Format: no voiceover; music, sound effects, and on-screen text only, matching the three references.
> Specifications: 1920×1080 · 60 fps · ≈123.9 s = 7435 frames. Sound: audio Plan 2 (music-led, 120 BPM), see `../demo/audio/`.
> All visuals are simulated in Remotion with React/CSS; no screen recordings or screenshots. This includes macOS browser windows, Zhihu, a news site, Bilibili, Xiaohongshu, X, WeChat chats, the mobile app, and OmniBox web (sidebar, resource tree, and chat history).
> Copy: `product-features-and-slogans.md`. Style analysis: `reference-video-analysis.md`. Production prompt: `prompt.md`.
> This is an English translation of the original Chinese-language production brief. Quoted screen copy is translated for the reader; the original Chinese IME choreography is described in English.

> **v2 (final).** Rendered as `../demo/out/ominibox_product_video_v2.mp4` (`npm run render:final -- v2`). Changes from v1:
> 1. The star (light-dot) float into the app sidebar is slower: C → D about 2 s, and the C+ phone-to-laptop dots 1.5 s.
> 2. The sidebar document "Superexx 2024 年 10 月月报.pdf" is now **2026 年 10 月月报.pdf** on the PC and the phone.
> 3. The space name is **xiaohei 的空间** (avatar initial X) everywhere.
> 4. "万物变成记忆" (end of D) shows the complete line before the ribbon wipe, and the wipe to E is slower.
> 5. The ending shows the complete two-line slogan "记忆变成万物 / 万物变成记忆" before Xiaohei appears.
>
> **New ending.** Same as `script-add_more_app.md` except section H, which is rebuilt as Option A "回文翻转" (the slogan flips, Xiaohei hops onto 记忆 and dives into the icon). Rendered as `../demo/out/demo_modify_slogon.mp4` (composition `DemoSlogan`).
>
> **Mobile version.** Builds on the untimed version (`script-untimed.md`); every original section keeps its content word for word. Two new sections show the real OmniBox mobile app (`import-ai/omnibox-react-native`) and seamless PC ↔ phone transitions: **C+ Capture on the go** and **E+ Pick up on your phone**. Rendered as `../demo/out/demo-add_more_app.mp4` (composition `DemoApp`); the timeline lives in `../demo/src/appTimeline.ts`.
>
> Each new section starts from a frozen frame of the PC scene it interrupts and returns to that same frame, so the cut in and the cut out are frame-continuous and the original story continues untouched.

### What the app code and recordings show (basis for the phone UI)

- **Home** (dark, `#1c1c1e`): space name `xiaohei 的空间 ⌄`, an Upgrade pill, gift, bell and settings icons; the outlined Xiaohei peeks beside a suggested question, above the composer `随便问点什么吧` with `＋`, `✋`, `Agent 2.1 中` and a send button; the `资源 | 对话` capsule toggle; the resource list under `个人 ⌄`.
- **Floating bottom bar** (`BottomTabBar`, a 258×60 capsule): `更多 · 录音 · 文字`. While recording, the 录音 tab shows a live waveform and timer.
- **Sheets:** `更多方式` (拍照 / 上传文件 / 链接 + 取消); `录音并保存` with `空间` / `添加到 个人`, waveform, timer, `暂停 / 完成`; the confirm dialog `结束并保存录音？` (`继续录音 / 结束并保存`); toast `保存成功`.
- **Chat:** thread header `‹ title · share · new · ···`, user bubbles on the right, `推理模式` collapsible, citation badges, the `引用来源 · N 段落` sheet with `原文`, and the disclaimer `内容由小黑 AI 生成，仅供参考`.

### New on-screen copy

| Section | Copy |
|---|---|
| C+ | 手机随手记，电脑马上有 (Capture it on your phone. It's already on your computer.) |
| E+ | 电脑上开始，手机上接着 (Start on your computer. Pick up on your phone.) |

---

## 0. Overall Design

**Story in one sentence:** begin with "Hello, Xiaohei!" After typing finishes, Xiaohei peeks in from the screen edge, bounces onto the text, blinks, and travels with the text into the OmniBox composer; the message is sent and Xiaohei replies. Then follow it as scattered content is captured, understood, used, and shared, ending with its eyes resolving into the logo.

**Structure:** the website's four-part sequence: "Capture · Understand · Apply · Open."

| Section | Time | Duration | Theme | Main reference |
|---|---|---|---|---|
| A Opening | 0.0–9.3 | 9.3 s | Hello, Xiaohei! (typing → peek, hop, blink → move together into the composer) | Reference 2: large type on black and typewriter; reference 3: shared-element morph and spring physics |
| B One-click saving | 9.3–16.9 | 7.6 s | Browser extension | Reference 1: 3D browser and click-driven push-in; reference 3: button morph |
| C Capture from everywhere | 16.9–26.1 | 9.2 s | Anytime, anywhere | Reference 1: whip-pan montage |
| C+ Capture on the go | 26.3–41.6 | 15.25 s | Phone: record a meeting, photograph the whiteboard, sync to the PC | Reference 1: pull-back through a device; reference 3: elements travel between devices |
| D Understand | 26.1–56.9 (C+ plays at 26.3–41.6) | 15.5 s | Everything becomes memory. | Reference 3: shared-element morph |
| E Apply | 56.9–94.4 (E+ plays at 72.4–87.6) | 22.3 s | Ask · Write · Act | Reference 1: dark UI and alternating close-ups / wide shots |
| E+ Pick up on your phone (inside E) | 72.4–87.6 | 15.2 s | The weekly report hands off from laptop to phone; follow-up question and citations on the phone | Reference 3: shared-element morph across devices |
| F Share and collaborate | 94.4–103.8 | 9.4 s | Sharing and teams | Reference 3: component morphs on an off-white canvas |
| G Open and cross-platform | 103.8–112.4 | 8.6 s | All platforms and open source | Reference 1: 3D device array |
| H Brand | 112.3–123.9 | 11.6 s | Slogan and logo | Reference 2: word-by-word type and light ribbons resolving into an icon |

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

### C Capture from Everywhere · Anytime, Anywhere (16.9–26.1 s)

> Rhythm: switch to another source card every half-beat. Arrange cards in a horizontal 3D corridor, rotateY ±25° with staggered Z positions; whip through the corridor. Each card settles with the same black "✓ Saved" capsule at the top, creating a repeated visual rhythm.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 16.9 → 18.1 | **News site:** simulated "Tech Frontier Daily," headline "Chinese LLM Inference Costs Fall 90% in One Year"; "✓ Saved" capsule | Settle from the whip with a slight card bounce | Each save gets a "pop" on the beat |
| 18.1 → 19.5 | **Bilibili video page:** simulated "Understand RAG in 10 Minutes," including a progress bar; after saving, a "Chapters · Key frames" thumbnail strip unfolds below | Whip pan | Pop |
| 19.5 → 21.2 | **Xiaohongshu post**, "My Notion Alternative: A Productivity Checklist," and **X post**, an English AI news post, save side by side | Pull back to show both | Two pops on eighth notes |
| 21.2 → 22.9 | **Portrait iPhone, WeChat chat with Xiaohei:** user sends `Q3 Product Review.pdf`, a 0:12 voice message, a whiteboard photo, and "Weekly meeting conclusions #meeting," spaced one eighth note apart; small checkmarks appear | Phone rotates upward into view, rotateY 20° → 0° | Four WeChat sending swishes |
| 22.9 → 24.4 | Phone morphs in place into the **OmniBox app**, bottom tabs "More · Record · Text"; tap Record to reveal a waveform. An **RSS subscription folder** slides in alongside; three articles arrive automatically, badge "+3." Centered headline: **"Anytime, anywhere. Leave it to Xiaohei."** | T-MORPH for the phone; all cards recede into a ring | Recording cue |
| 24.4 → 26.1 | All source cards shrink into blue light dots and stream right like meteors; v2 slows the float to about 2 s so every dot visibly lands in the sidebar | **T-DOT → D**, into the next scene's sidebar | Rising riser; land at 26.1 |

### C+ Capture on the go · 手机随手记 (26.3–41.6 s, inserted at D's opening frame)

> Story: before the PC understands anything, the phone captures it. The two items recorded here are the same 周会录音.m4a and 白板照片.jpg rows that D then parses, so the story stays consistent. The new section starts and ends on D's opening frame.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 26.4 → 27.7 | D's opening frame (OmniBox web, resource tree) is frozen. It shrinks into a MacBook screen on a dark desk | **Pull back through the device:** camera eases from the screen filling the frame to a wide desk shot | Soft whoosh |
| 27.1 → 28.7 | An iPhone springs in on the right showing the **OmniBox app home**: space header, peeking Xiaohei with the suggestion "列出包含「会议」标签的资源", composer, `资源 \| 对话`, resource list, floating `更多 · 录音 · 文字` bar. Xiaohei blinks | Camera pushes toward the phone; the laptop drifts out of focus (depth of field) | Spring "pop" |
| 29.0 → 32.3 | Tap **录音** → the **录音并保存** sheet slides up (空间 · xiaohei 的空间, 添加到 · 个人). The red waveform runs and the timer climbs to **32:15** (time-lapse of the meeting) | Gentle hold on the phone | Tap; low hum of a meeting, sped up |
| 32.3 → 33.6 | Tap **完成** → dialog **结束并保存录音？ / 返回后可继续录音。** → tap **结束并保存**. Sheet closes; toast **✓ 保存成功**; a new row **🎙 周会录音.m4a · 解析中** slides into the top of the list and glows blue | Tap ripples on each button | Two taps; save "ding" |
| 34.7 → 35.7 | Tap **更多** → the **更多方式** sheet: 拍照 / 上传文件 / 链接, 取消. Tap **拍照** | — | Taps; sheet swish |
| 35.7 → 37.3 | Full-screen camera: the whiteboard (Q4 目标：DAU 翻倍 · 发布节奏：双周 · 负责人：林, sticky notes) under a grid, `相册 · 拍照`. Shutter → white flash → thumbnail shrinks away → back home; toast **✓ 保存成功**; row **🖼 白板照片.jpg · 解析中** slides in | — | Shutter click; save "ding" |
| 37.6 → 39.9 | **PC ↔ phone sync:** both new rows leave the phone as blue light dots and arc into the laptop's resource tree over 1.5 s (v2); the laptop rim glows as they land. Caption **"手机随手记，电脑马上有"** | Camera pulls back to the wide two-device shot | Two rising "blips"; soft chime on landing |
| 39.9 → 41.6 | The phone slides out right | **Push through the laptop screen** until it fills the frame, landing exactly on D's opening frame; D continues and the rows land in the tree | Whoosh into the cut |

### D Understand · Everything Becomes Memory (26.1–56.9 s; C+ plays at 26.3–41.6)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 26.1 → 43.5 (C+ plays at 26.4–41.6) | Wide **OmniBox web, dark mode**. Sidebar: "xiaohei's space ⌄" → "Xiaohei / Notifications 🔴3 / Xiaohei community / Invite and earn" → capsule **Resources** \| Chats → Personal tree. Dots land on successive beats, growing rows with "Parsing" spinners: `The Year of AI Agents… (Zhihu)`, `Q3 Product Review.pdf`, `Whiteboard Photo.jpg`, `Weekly Meeting Recording.m4a`, `Understand RAG in 10 Minutes (Bilibili)` | Tilted window straightens; medium sidebar shot, then slowly pull back | Click as each row arrives |
| 43.5 → 52.3 | Split the main area into four panels, each showing a resource being understood. Each panel **morphs out of its sidebar row** via T-MORPH:<br>① 41.6 **PDF:** paper page → lines light up; label **Documents → Full-text search**.<br>② 43.5 **Whiteboard photo:** blue scan line, OCR boxes around handwriting, then text; label **Images → Text recognition**.<br>③ 45.4 **Meeting recording:** waveform → timestamped transcript → three AI summary points; label **Audio & video → Transcripts and summaries**.<br>④ 47.3 **Bilibili video:** timeline divides into four chapters and key-frame thumbnails.<br>48.9: colored `#AI`, `#meeting`, `#todo`, `#product` capsules appear below all four panels; label **Automatically tagged** | Push into each panel for about 1.9 s; return to a four-panel wide view at 50.8 | Scan buzz, transcript typing, three summary dings |
| 52.3 → 54.5 | Panels collapse; centered frosted-glass **⌘J search box** appears. Type "Action items from last week's meeting"; three results appear with blue-highlighted matches. Headline: **"⌘J. Search. Found."** | Bottom-left "⌘ J" HUD; search box springs out from the center | Sixteenth-note keyboard sounds |
| 54.5 → 56.9 | Dim to black; **"Everything becomes memory."** appears word by word, then the complete line holds for about 0.6 s (v2) | Blue ribbon sweeps behind the words | Snare fill at 54.5 |
| 56.9 → 58.1 | — | **T-ARC → E**, ribbon wipes back to OmniBox; slowed to about 1.2 s in v2 | Crash |

### E Apply · Memory Becomes Everything (56.9–94.4 s; E+ plays at 72.4–87.6)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 55.9 → 59.5 | **Chat home.** Sidebar capsule slides from Resources to **Chats**; **chat history** unfolds:<br>Today: `Hello, Xiaohei!`, `Organize weekly meeting action items`.<br>Past 7 days: `RAG vs. fine-tuning`, `Grocery list request`, `Q3 review highlights`.<br>September 2026: `Zhihu trending summary`, `AI news at a glance`, `New chat`…<br>Centered **outlined Xiaohei head** peeks over the composer and blinks. Suggested prompt: "List all resources tagged 'meeting'." Greeting: "Good evening. How can I help you today?" | Spring sidebar slider; pan from sidebar to a medium main-area shot | Full groove with claps |
| 59.5 → 61.6 | Click composer with "Ask anything" placeholder; type on sixteenth notes: **"What are three AI agent trends in my saved sources?"** Enable the bottom-left Deep thinking bulb; bottom right "Agent 2.1 · Medium"; send | Input close-up like reference 1; T-PUSH on send | Typing and sending swish |
| 61.6 → 65.1 | Conversation page: user bubble upper right; "Thinking" → collapsible **Deep thinking** in small gray text → "Searching…" spinner → streamed answer with three bold subheadings, each ending in blue **citation badges** ①②③. Headline: **"Answers with sources. Every time."** | Pull back from input to the complete answer, like reference 1's three-column wide shot | Soft streaming rustle |
| 65.1 → 67.1 | Hover citation ② to reveal a source card: The Year of AI Agents… (Zhihu), paragraph excerpt. Click to **jump to the original Zhihu article**, with the relevant sentence highlighted yellow | **T-WHIP**, citation → source → back | Click and two whooshes |
| 67.1 → 87.7 | Return to chat. Switch input to Writing mode, type **"Turn these into a weekly report"**, and send. Generate a long **AI Weekly Brief · Week 40**, with title, contents, three sections, and a table, scrolling as it streams. Click "Save this response to personal space" below; document collapses into a row and **flies into the resource tree**. Headline: **"Turn your sources into a weekly report."** | Tilt slowly upward with the growing document; T-DOT from document to sidebar row on save | Fill at 70.7; save pop |
| — | **▶ E+ Pick up on your phone plays here (72.4–87.6 s), see the next section** | — | — |
| 87.7 → 92.2 | Type **"Organize my AI-related sources and add tags."** Show **Agent 2.1 tool calls**:<br>✓ Search resources: 6 found.<br>⏸ Create "AI research" folder, awaiting confirmation; **Approve** / Reject / Approve all.<br>Extreme close-up on clicking Approve → ✓ Create folder → ✓ Move 6 resources → ✓ Add #AI tag.<br>Six sidebar rows fly into the new "📁 AI research" folder, which expands. Headline: **"One request. Everything organized."** | Extreme close-up and press scale on Approve, like reference 3; then split view of resource-tree animation and tool-call list | Completion ticks on beats |
| 92.2 → 94.4 | Dim the scene; **"Memory becomes everything."** appears word by word; smaller line: "Ask · Write · Act" | Light ribbon sweeps in the opposite direction behind text | Drop kick at 92.2; snare roll builds anticipation |
| 94.4 | — | **T-MORPH → F**: top-right Share icon enlarges into a black capsule button on off-white | Crash |

### E+ Pick up on your phone · 跨端接力 (72.4–87.6 s, inserted in E after the weekly report is saved, before the Agent request)

> Story: the weekly report that was just written on the PC continues on the phone. The section starts and ends on the same E frame (empty composer, report row in the tree).

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 72.4 → 74.0 | The full-screen OmniBox web shrinks into the laptop; the phone springs in on the right (home, resources list with **📝 AI 动态周报 · 第 40 周** on top) | Pull back through the device to the wide desk shot | Whoosh |
| 74.0 → 75.5 | **Handoff (shared-element morph):** the report row in the laptop's tree lights up blue, **lifts out of the screen** as a card with a glow and shadow, swings in 3D and spring-morphs into the phone screen, reflowing from a row into the full mobile document. Caption **"电脑上开始，手机上接着"** | Wide shot; slight 3D rotation on the card | Lift "whoosh"; landing "pop" |
| 75.5 → 77.7 | On the phone: **AI 动态周报 · 第 40 周** scrolls from 本周要点 through 重点资料 to the 待办 table | Push in to the phone; laptop out of focus | Soft scroll ticks |
| 77.7 → 79.2 | Tap **‹** back → tap **对话**: the capsule slides and the chat history appears — 今天 · 周会待办整理 / 你好，小黑！, 过去 7 天 …, the same history as the PC. Tap **周会待办整理** | — | Taps; capsule slide |
| 79.2 → 83.0 | The thread opens: earlier Q&A "上周会议的待办？ → 共 3 项…" with citations. Type **"待办里哪项最急？"** and send; **推理模式** row with "正在检索资料…" spinner; the answer streams: **最急的是「周五前发布插件」：负责人林，状态进行中，周五就要发版。** with sources ①②③ | — | Typing; send swish; streaming rustle |
| 83.0 → 84.8 | Tap ① → the **引用来源 · 3 段落** sheet: 周会录音.m4a "[00:31] 待办：周五前完成评审……", 白板照片.jpg "负责人：林 · 发布节奏：双周", AI 动态周报 "周五前发布插件 ｜ 林 ｜ 进行中", each with **原文 ›**. Tap **完成** | — | Sheet swish; tap |
| 84.7 → 85.9 | The new Q&A syncs back: a blue light dot arcs from the phone thread into the laptop's chat; the laptop rim glows | Pull back to the wide two-device shot | Rising "blip"; chime |
| 85.9 → 87.6 | The phone slides out right | **Push through the laptop screen** onto the same E frame; E continues with the Agent request | Whoosh into the cut |

### F Share and Collaborate (94.4–103.8 s)

> Switch to reference 3's style: off-white canvas `#EDEDEA`, a single continuously morphing black component in the center, with the cursor driving the story.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 94.4 → 95.1 | Click black Share capsule | Press to scale 0.95 and rebound | Click |
| 95.1 → 98.1 | Capsule expands into a white **sharing settings card**. Adjust four controls on successive beats: Require login → Password protection → Expiration: 7 days (dropdown) → AI Q&A: Enabled (Disabled / Chat only / **Enabled**, sliding selection). Headline: **"Share your knowledge. Take AI along."** | **T-MORPH**; each control changes on a beat with a bounce | Four switch clicks |
| 98.1 → 99.4 | Click Copy link; card contracts into `omnibox.pro/s/xH8…` capsule and checkmark | T-MORPH | Ding |
| 99.4 → 103.8 | Link becomes a **WeChat share card**, "A conversation from Xiaohei OmniBox." Four member avatars appear sequentially beside it, then join a **Team** space card: Personal \| Team columns, resources appearing row by row under Team. Headline: **"A second brain for you. A knowledge base for your team."** | Slowly pull back as components multiply; prepare transition at 103.4 | Four joining tones |
| 103.8 | — | **T-WHIP → G**, upward | Whoosh |

### G Open · Every Platform (103.8–112.4 s)

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 103.8 → 107.7 | On black, a 3D device fan opens: macOS browser with OmniBox web, extension card, iPhone app, Android phone, WeChat window, and QQ window. Xiaohei's eyes blink in each. Labels light up sequentially: Web · Extension · iOS · Android · WeChat · QQ. Headline: **"Every platform. One Xiaohei."** | Orbit from front to 30° side view, like reference 1; devices emerge sequentially from depth of field | One glockenspiel note per device |
| 107.7 → 112.4 | Devices fade; three shots, about 1.5 s each, paired with headlines:<br>① GitHub repo card `import-ai/omnibox` · ⭐ → **Open source**.<br>② `docker compose up` and "Ollama · Run offline" → **Self-hosted**.<br>③ Terminal: `claude` calls `/omnibox search "weekly meeting action items"` and receives results → **Ready for your agent** | Hard cut for each with a small scale impact, 1.06 → 1 | Three strong hits; fill at 111.4 |
| 112.4 | — | **T-ARC → H**, ribbon sweeps to black | Crash |

### H Brand · Slogan, Option A "回文翻转" (112.3–123.9 s)

> Rebuilt ending (Option A). v2 adds a two-line hold of the complete slogan after the swap, before Xiaohei appears. The slogan's reversal is shown as motion, and the same outlined Xiaohei from the opening hops onto the line and dives into the icon, so the film ends the way it began. Implemented in `../demo/src/scenes/H2.tsx`.

| Time | Visual | Camera / motion | Sound |
|---|---|---|---|
| 112.3 → 112.7 | Light ribbon wipes to black (unchanged transition from G) | T-ARC | Crash |
| 112.8 → 114.1 | **"万物 变成 记忆"** builds word by word, centered at 150 px; **记忆** in brand blue `#7FB0FF`; a soft blue glow sits behind the line | Each word rises from a blur, one per beat (reference 2) | One chord tone per word |
| 114.4 → 115.6 | **万物 and 记忆 swap places**: 万物 travels over an upper arc to the right, 记忆 under a lower arc to the left, and the line now reads **"记忆 变成 万物"**. 变成 tips like a seesaw as they cross | Shared-element spring, damping 12 (reference 3) | Two crossing "whoosh"es; resolved chord |
| 115.7 → 117.6 | **Complete two-line slogan (v2):** line 1 **记忆 变成 万物** glides up; line 2 **万物 变成 记忆** builds word by word beneath it (记忆 in blue on both lines). The full two-line slogan **"记忆变成万物，万物变成记忆"** holds for about 1.3 s before Xiaohei appears | Line 1 springs up; line 2 words rise from a blur | One chord tone per word on line 2 |
| 117.6 → 118.3 | The outlined Xiaohei from the opening peeks in from the left edge, below the two lines: ears first, then eyes, a shy pull back, then most of the head | Same peek as the opening | Soft "coo" |
| 118.3 → 119.1 | Xiaohei squashes, springs up and **lands on line 1's 记忆**; the line dips and bounces like a trampoline; Xiaohei turns to the camera and blinks | Squash-and-stretch hop (opening's `hop`) | "Pop", landing "tap", "boing" |
| 119.0 → 119.7 | Line 1's 变成 and 万物 and all of line 2 tumble away and fade. **记忆 condenses into a blue rounded square** that glides to the center, carrying Xiaohei on its top edge | Square springs to logo size and position | Falling "swish"; low swell |
| 119.7 → 120.2 | Xiaohei makes one last small hop and **dives into the square**, growing to logo size and turning from outline to solid as it enters; the square's bottom edge crops it, leaving the peeking head: **the logo** | Hop + scale, clipped by the square | Big chord as the cat lands |
| 120.4 → 122.0 | Logo slides left; **小黑 OmniBox**, **你的 AI 知识伙伴** and **免费开始 · omnibox.pro** appear one after another | Lines resolve from blur to sharp | Glockenspiel arpeggio |
| 122.5 → 123.9 | Xiaohei in the logo **blinks once**; hold, then fade to black over the final 0.5 s | Very slow push, 1.00 → 1.03 | Chord sustains through the fade |

---

## 2. Beat and Keyframe Reference (60 fps)

| Event | Seconds | Frame |
|---|---|---|
| Finish typing "Hello, Xiaohei!" | 2.1 | 126 |
| Xiaohei peeks | 2.7 | 162 |
| Xiaohei bounces out / lands | 3.4 / 3.8 | 204 / 228 |
| Xiaohei hops onto text / settles | 4.0 / 4.5 | 240 / 270 |
| Xiaohei blinks | 4.8 | 288 |
| Xiaohei and text begin transitioning | 5.1 | 306 |
| Text lands in composer; full band enters | 5.6 | 336 |
| Enter to send | 6.6 | 396 |
| T-WHIP → B | 9.3 | 558 |
| Extension card appears | 11.2 | 672 |
| Save morph completes as toast | 14.3 | 858 |
| T-WHIP → C | 16.9 | 1014 |
| T-DOT → D | 26.1 | 1567 |
| Four-panel understanding sequence begins | 43.5 | 2611 |
| T-ARC → E | 57.5 | 3449 |
| Send question | 61.6 | 3694 |
| Citation jumps to source | 65.1 | 3904 |
| Click Agent approval | 89.5 | 5368 |
| T-MORPH → F | 94.4 | 5662 |
| T-WHIP → G | 103.8 | 6226 |
| T-ARC → H | 112.4 | 6742 |
| Logo settles (Xiaohei lands in the icon) | 120.2 | 7210 |
| C+ begins: pull back from D into the laptop | 26.4 | 1582 |
| C+ recording saved | 33.6 | 2014 |
| C+ whiteboard photo saved | 37.3 | 2236 |
| C+ sync dots land on the PC | 39.9 | 2395 |
| E+ begins: pull back from E into the laptop | 72.4 | 4342 |
| E+ report hands off to the phone | 74.8 | 4486 |
| E+ follow-up question sent | 81.0 | 4858 |
| E+ citations sheet | 83.3 | 4996 |
| End | 123.9 | 7432 |

**Rule (mobile version):** the order of events is the same as in `script.md`, with sections C+ and E+ added. The 120 BPM grid no longer applies; each event happens at the time in the table above. Sound cues keep their positions relative to the picture.

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
| Resource tree | Home - Zhihu / The Year of AI Agents… / Q3 Product Review.pdf / Whiteboard Photo.jpg / Weekly Meeting Recording.m4a / Understand RAG in 10 Minutes / 2026 年 10 月月报.pdf (October 2026 Monthly Report) / Docker: Introduction and Practice (4th Edition).pdf |
| Opening chat | User: "Hello, Xiaohei!" Xiaohei: "Hello! I'm Xiaohei (OmniBox), nice to meet you 👋 Whatever you want to remember, leave it to me." |
| Chat history | See section E at 18.0 s; the first Today entry is the opening "Hello, Xiaohei!" |
| AI answer | Three trends: ① From conversation to action through agent execution; ② Long-term memory becomes standard; ③ Personal knowledge bases become AI context. Citations ①②③ |
| Weekly report | "AI Weekly Brief · Week 40": This week's highlights / Key sources / Action items, with a three-row table |
