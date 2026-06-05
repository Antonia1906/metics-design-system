# Claude Design → Video — Animation Playbook

How we use Claude Design to produce animated overlays (lower-thirds, callouts, explainer scenes, CTAs) and turn them into editor-ready ProRes clips. This is the reusable reference: hand the relevant parts to a **video editor** so they know what to expect, and use the **kickoff prompt** in Section 10 every time you start a new Claude Design animation project.

Distilled from what actually worked (and what broke) on prior projects.

---

## 0. The pipeline in one picture

```
Claude Design  →  self-contained HTML animation files  →  Claude Code renders each
(builds graphics)   (one file per clip, t-driven)          via animations-to-video
                                                            → ProRes .mov (alpha or opaque)
                                                                      ↓
                                                        Editor drops .movs over the
                                                        talking-head timeline as b-roll
```

Three roles, three handoffs. The whole thing only works if the HTML follows the **render contract** (Section 2) — that's the part that's easy to get wrong.

---

## 1. What Claude Design produces

- **One self-contained HTML file per clip.** Everything inline (CSS + JS in the one file). Assets (logos, screen-recordings) bundled in relative folders next to it.
- Two archetypes:
  - **Lower-thirds / cards** — small chapter cards or callouts that slide in lower-left, over the talking head. One file per card. ~4s each.
  - **Render / explainer scenes** — fullscreen or lower-corner motion graphics organized into **beats**, one file per section of the video.
- Each clip is meant to be either an **ALPHA overlay** (transparent bg, composites over footage) or an **OPAQUE/SOLID** full-frame graphic. The same file can render both ways (Section 4).

---

## 2. The render contract (non-negotiable — this is what makes files convertible)

The renderer drives the animation by **stepping time frame-by-frame in a headless browser and screenshotting**. So every file MUST be:

**Deterministic — animation is a pure function of one playhead `t` (seconds).**
- Every visual property is computed from `t`. The vocabulary is tiny: a `lerp(t, t0, t1, v0, v1, ease)` (value v0→v1 as `t` crosses a window) and a `visible(t, tIn, tOut, fadeIn, fadeOut)` envelope, plus a few easings (`easeOutCubic`, `easeInCubic`, `easeOutBack`, `easeInOut`).
- Stagger elements by giving each its own `lerp` window. Continuous "life" motion (pulses, sweeps) from `Math.sin(tick*freq)` where `tick` is element-local time.
- **A `requestAnimationFrame` loop may advance `t` for live preview only.** The final look must never depend on "time since mount." `setStoryTime(12.3)` must always produce the exact same frame.
- ⚠️ This is why **CSS-`@keyframes` / `animation-delay` timing alone is not acceptable** for the final render — it isn't seekable by the harness and will desync. (CSS keyframes are fine only for decorative continuous loops that don't carry meaning.)

**Standard `window` API (the capture script calls these):**

| Symbol | Meaning |
|---|---|
| `window.setStoryTime(s)` | jump to `s` seconds and pause (deterministic) |
| `window.playStory()` / `pauseStory()` | resume / pause the preview loop |
| `window.STORY_DURATION` | total length in seconds |
| `window.STORY_FPS` | intended fps (**30**) |
| `window.__storyReady` | set `true` once mounted — the renderer waits on this before capturing |

**Standard URL params:** `?t=2.5` (seek + pause), `?autoplay=0` (mount paused at 0), `?bg=black|wall|alpha|green` (review backdrops), default = **transparent**.

**Stage:** a fixed **1920×1080 `.stage`**, scaled to fit the viewport with a `ResizeObserver`. Only the stage is captured. Design at 1080; the renderer outputs 4K.

**Render-mode CSS:** a `=== RENDER MODE OVERRIDES ===` block at the end makes `html/body` transparent by default, hides all preview chrome (top bar, transport, captions), and lets `html[data-bg="…"]` swap the backdrop. This is what lets one file be both an interactive review tool and a clean capture source.

---

## 3. ⚠️ The single biggest gotcha: no in-browser Babel

Prior Claude Design files used **React + Babel compiled in the browser** (`<script type="text/babel">`). That combination **crashes the 4K renderer** — symptoms were `Requesting main frame too early!` and `Target closed`, and it cost a long debugging session. Root cause: runtime Babel + a hi-DPI (deviceScaleFactor=2) render context is too heavy for headless Chromium during page setup.

**Best practice, in priority order:**
1. **Ship plain vanilla JS — no runtime Babel, no JSX compile in the browser.** This renders natively at true 4K and never crashes. Ask for this explicitly.
2. If a framework is used, **precompile** to plain JS before handoff.
3. If runtime Babel is truly unavoidable: keep **all** components in a **single inline `<script>`** (a second Babel script tag caused load-order races), and accept that the renderer falls back to capturing at 1920×1080 and upscaling to 4K with lanczos (fine for flat/vector graphics, slightly soft on fine detail).

Related renderer settings (already fixed in our `animations-to-video` fork, but good to know): it loads with `waitUntil: 'load'` (not `networkidle0`, because Google Fonts + Babel never go idle), waits on `window.__storyReady`, uses `headless: true`, and does **not** pass `--default-background-color` (it broke alpha capture on Babel pages; `omitBackground:true` on the screenshot handles alpha).

---

## 4. Alpha vs opaque — decide per clip

- **ALPHA** (transparent background) → renders as **ProRes 4444 alpha** → composites directly over the talking head. Use for lower-thirds, callouts, number-pops, anything that sits *on* the footage.
- **OPAQUE/SOLID** (the page paints its own background) → renders as **ProRes 4444 opaque** → a full-frame cutaway that replaces the TH. Use for standalone explainer scenes / title-style cards.
- **Two-version trick:** when one HTML has both a transparent intro portion (lower third over TH) and a full-background reveal, render it **twice** — once `--format prores4444-alpha`, once `prores4444-opaque` — both starting at the same timestamp, and the editor cuts between them at the transition. (This is exactly what we did for the Hermes intro.)

---

## 5. Duration — match the moment (except lower-thirds)

- **Lower-thirds, small label callouts, and title cards: set to their own short intended length** (≈4s — entrance / brief hold / exit). They sit over footage that fills the time, so the editor holds or repeats them as needed. (An earlier pack shipped 12s lower-thirds with 10s of static hold — that's the waste to avoid; ~4s is plenty.)
- **Every other animation runs the EXACT length of the narration moment it covers** — its `STORY_DURATION` equals the cue's `[m:ss–m:ss]` span. It then covers the whole beat with no gap, and the editor just drops it at the timecode (no extending needed). Don't make a 40s explainer "short and held."
- **Long cues are multi-beat scenes, not one static hold.** A 40s explainer is a sequence of beats timed to the sub-phrases of the narration (the brief's cue lists the sub-content). Use a `BEATS` array of `{id, in, out, …}`; each beat fades in/out on its own `lerp`/`visible` window so something is always developing across the span.
- **Cost scales with duration.** 4K ProRes 4444 is ~5 MB/sec: a 4s lower-third ≈ 19 MB; a 53s scene ≈ 450 MB. Render time grows with length — plan disk + time.
- Put the duration in three places: `window.STORY_DURATION`, a top-of-file comment with the breakdown, and the filename.

---

## 6. Visual / localization rules (carry over from the channel)

- **Minimal English text. Numbers, icons, and logos carry meaning.** Labels should be **one uppercase word on a chip** so a localization team can swap language without re-rendering the motion. (40–60% of views are non-English / dubbed.)
- **No years or dates** in any graphic (titles get reused over time).
- **Real logos** as `<img>` files in `assets/logos/`; hand-draw only generic icons (clock, shield, radar, house) as inline SVG.
- **Lower-corner safe zone:** ~80–140px in from the left, ~80px up from the bottom — clears the YouTube caption strip and keeps clear of the on-camera face.
- Quick, **visibly staggered** entrances (elements land one after another, ~300ms apart), then a steady hold. Subtle continuous motion so nothing sits perfectly dead, but never distracting.

---

## 7. Packaging & handoff (what Claude Design should deliver)

- One HTML per clip, **descriptive filenames** in timeline order (`lt_01_set_up_your_vps.html`, `Section Name - Render.html`).
- **Bundle every referenced asset** in relative folders (`assets/`, `sites/`). A clip that references a missing `.mp4`/logo renders **empty** — this bites silently.
- A short **`Timing_Notes.md`** (or per-section `Recording Guide - X.md`): each clip's duration, whether it's alpha or opaque, and the **master timecode** it covers in the video, plus a beat table for explainer scenes.
- Deliver as a **zip**.
- Everything inline per file; **no second script tag**.

---

## 8. Rendering to video (Claude Code — the `animations-to-video` skill)

Per clip:

```bash
node ~/.claude/skills/animations-to-video/scripts/render.js \
  --input "Clip.html" \
  --out   "Clip.mov" \
  --res   2160 \
  --fps   30 \
  --format prores4444-alpha      # or: prores4444-opaque
```

- `--res 2160` = 4K (3840×2160). `--res 1080` for 1080p.
- **Batch lower-thirds sequentially, not in parallel** — running many headless Chromium instances at once thrashes the GPU and causes flaky crashes.
- The renderer auto-detects Babel pages and routes them through the 1080→upscale path; plain-JS files render native 4K.
- Output files are large (ProRes 4444) — render to a dedicated exports folder.

When you ask Claude Code to do this, just point it at the zip and say which clips need **alpha** vs **opaque** (or "two-version" for an intro that does both). It'll extract, check each file's `STORY_DURATION`, and render.

---

## 9. Editor handoff recipe

- **Alpha `.mov`** → drop on a track **above** the talking head at the clip's master timecode; it composites automatically (transparent background).
- **Opaque `.mov`** → full-frame cutaway; place it to cover the TH for its duration.
- **Extend a hold:** freeze/stretch the last frame on the timeline (the clip ends on a clean held frame by design).
- **Two-version intro:** lay both alpha + opaque starting at the same timestamp; use alpha while the lower-third is over the face, cut/crossfade to opaque at the background-reveal transition.
- Check any clip that overlays a screen-recording for **PII blur zones** before publishing.

---

## 10. Reusable kickoff prompt (paste this when starting a Claude Design animation project)

> I need animated overlays for a talking-head tutorial/review video. They'll be rendered to ProRes via a frame-stepping headless-browser renderer and dropped over my footage in an editor, so they must follow this contract exactly:
>
> **Format:** one self-contained HTML file per clip, everything inline, plain **vanilla JS only — NO in-browser Babel / no `<script type="text/babel">`** (it crashes my 4K renderer). Single inline script per file.
>
> **Determinism:** animation must be a pure function of one playhead `t` in seconds — compute every property from `t` with `lerp`/`visible`/easing helpers. No reliance on CSS `animation-delay` or time-since-mount for the final look. A rAF loop may advance `t` for preview only.
>
> **Expose on `window`:** `setStoryTime(s)` (seek+pause), `playStory()`, `pauseStory()`, `STORY_DURATION`, `STORY_FPS = 30`, `__storyReady = true` once mounted. **URL params:** `?t=`, `?autoplay=0`, `?bg=black|wall|alpha`; default transparent.
>
> **Stage:** fixed 1920×1080, scaled to fit via ResizeObserver; only the stage is captured. Add a `=== RENDER MODE OVERRIDES ===` CSS block: transparent `html/body` by default, hide all preview chrome, `?bg=` swaps the backdrop.
>
> **Per clip tell me alpha or opaque.** Alpha = transparent bg (overlays footage); opaque = paints its own full-frame background.
>
> **Durations:** lower-thirds / small cards are short (~4s: in / brief hold / out; I hold them in the editor). Every **other** animation runs the **exact length of the narration moment it covers** — I'll give you the timecode span per cue, and `STORY_DURATION` should equal it. Build those as multi-beat scenes timed to the narration (a `BEATS` array), not one static hold. Put the duration in `STORY_DURATION`, a top comment, and the filename.
>
> **Visual rules:** minimal English text — numbers/icons/logos carry meaning; one-uppercase-word labels on chips for easy localization. No years/dates. Real logo files as `<img>` in `assets/`; hand-draw only generic icons as inline SVG. Lower-corner safe zone clear of the caption strip and my face.
>
> **Deliver:** descriptively-named HTML files in timeline order, assets bundled in relative folders, a `Timing_Notes.md` (per-clip duration + alpha/opaque + master timecode), zipped.
>
> **Brand:** [paste palette hex + fonts + logo list, or attach the brand guidelines].
>
> Here's the section-by-section cue sheet: [attach the per-project brief].

---

## 11. One-line summary for the editor

> Claude Design gives us self-contained HTML clips → Claude Code renders each to a 4K ProRes (alpha for overlays, opaque for full-frame) → you drop them on the timeline at the marked timecodes; alpha ones composite over the talking head, opaque ones are cutaways, and you extend holds by stretching the last frame.
