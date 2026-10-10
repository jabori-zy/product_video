# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

Product videos for **小黑 OmniBox** (an AI knowledge-assistant app). Each video is code: rendered frame-by-frame, with programmatically synthesized music/SFX, then muxed with ffmpeg. All on-screen copy is Simplified Chinese, and most comments and docs are in Chinese too. Rendered outputs (`.mp4`, `.wav`, stills) are committed alongside the source.

Everything lives under `ominibox/`, as three independent projects plus source material:

| Dir | What | Engine |
|---|---|---|
| `ominibox/product_tutorial/` | 20 s concept film, no voiceover (`OmniBoxConcept`) | Remotion 4.0.529 + React 19 |
| `ominibox/product concept/demo/` | 45 s product-intro draft (`Demo`), placeholder rectangles, yellow timecode labels | Remotion |
| `ominibox/film/` | 20.4 s "Living Screencast" with TTS voiceover and subtitles | Plain HTML/JS page rendered by the external Lemo-Opuscar library |
| `ominibox/product concept/result/` | Briefs: `script.md` (storyboard, authoritative timing for the demo), `prompt.md`, `product-features-and-slogans.md` (on-screen copy), `reference-video-analysis.md` | — |
| `ominibox/assets/`, `ominibox/product concept/assets/` | Product screenshots, Xiaohei character sheet, real app recordings (UI reference only, not footage) | — |

Note the directory name `product concept` contains a space, so quote it in shell commands.

## Commands

Remotion projects (run inside `product_tutorial/` or `product concept/demo/`):

```sh
npm run studio                 # interactive preview
npm run render                 # full render → out/*.mp4
npm run still -- --frame=300   # single frame
node tools/stills.mjs 60 180 300   # product_tutorial only: bundle once, render several review stills → out/stills/f_<frame>.jpg
sh build.sh                    # product_tutorial: music → render → poster.png
```

`product concept/demo/` has no dependencies of its own. Its README says to symlink `node_modules` to the concept film's (the old path `ominibox_概念视频v1` is now `product_tutorial/`).

Film (`ominibox/film/`):

```sh
sh build.sh         # events → sound mix → render → mux → subtitles → poster
sh build.sh --vo    # also regenerate voiceover (edge-tts, needs network) and check it with faster-whisper ASR
```

There are no tests or linters. To verify a change, render stills or a video and look at the frames.

## External dependency: Lemo-Opuscar

`film/build.sh`, `film/sound.py`, `film/tools/*`, `product_tutorial/build.sh` and `product_tutorial/audio/music.py` depend on the **Lemo-Opuscar** library, which is outside this repo. It provides the renderer (`core/render/*.mjs`, `mux.sh`, `srt.py`), the audio sampler and SFX (`core/audio`), the shared JS helpers (`/core/lib.js`, imported by `film/main.js`), and the Python `.venv`. Its location is `$LEMO_OPUSCAR_HOME`, defaulting to `~/Documents/Project/lemo-opuscar`. Run the Python scripts with `$LEMO_OPUSCAR_HOME/.venv/bin/python`.

Both `remotion.config.ts` files point Remotion at a hardcoded Playwright chrome-headless-shell path when it exists, because downloading Chrome is unreliable on that network.

## Architecture: one timing source, shared by picture and sound

Each project keeps all of its timing in one place, and the visuals and the audio both read from it. Keep it that way: change timing at the source and never hardcode frame numbers in a scene or in the music script.

- **product_tutorial**: `src/timing.json` holds 30 fps, 120 BPM (1 beat = 15 frames, 1 bar = 60), scene lengths, transition lengths and every named keyframe (`k`). `src/timing.ts` derives the global scene starts (`START`: overlapping transitions are subtracted) and exports the animation helpers (`seg`, `arrive`, `pop`, `fadeIn`) and the palette `C`. `audio/music.py` reads the same JSON to write `public/soundtrack.wav`. Transition midpoints fall on bar downbeats. `Concept.tsx` chains the scenes S1–S6 with the custom transitions in `src/transitions/` through `TransitionSeries`.
- **demo**: `src/lib.tsx` has the timing tools (`kf` keyframes, `morph` shared-element transitions, `hop`), the camera, motion blur and shared visuals. `src/scenes/A–H.tsx` each use local time `t = global − segment start`. `Main.tsx` lays out the segments and the transitions between them. Timing follows `../result/script.md`.
- **film**: `film.js` builds the timeline from the voiceover word timestamps (`voices/words.json`, `voices/dur.json`, produced by `tools/tts.py`). `main.js` renders each frame `t` into the DOM (`ui.js` = app UI, `xiaohei.js` = character) and exposes `window.DUR/EV/SUBS/T` to the external renderer. Lemo-Opuscar's `events.mjs` extracts every landing, pop and keypress into `events.json`, and `sound.py` places the music, SFX and voice at those times. `lines.json` holds the script lines with ASR notes.

## Gotchas

- Changing `background-clip: text` gradients per frame smears into solid blocks in continuous video renders, even though single stills look fine. Do sweep/shine effects as solid text plus a masked copy (see `product_tutorial/README.md`).
- Only draw UI elements that actually exist in the product. The briefs (`film/TREATMENT.md`, `product concept/result/prompt.md`) list the real sidebar, input box and card copy, checked against screenshots.
- The target loudness for every deliverable is −14 LUFS.
