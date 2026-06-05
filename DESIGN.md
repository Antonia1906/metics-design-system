# Metics Media — Design System

This is the channel-wide visual system for Metics Media tutorial/review videos. It is **product-neutral**: the *structure, motion, and rules* stay constant across every video; only the **brand skin** (colors + type) changes per video to match whatever product is being reviewed. Read this first — it tells you how everything here should look and behave.

> For an AI design tool (Claude Design): treat this file as the source of truth for the channel's look and rules. The reusable code components live in `/animation-kit`, the reusable visual assets in `/assets`, and reference screenshots in `/reference`.

---

## 0. How to use this: strict on the contract, creative on the look

This system has two layers, held to **different standards**:

- **Technical contract — follow exactly.** The render harness in `/animation-kit` (vanilla JS, `t`-driven animation, the `window` API, 1920×1080 → 4K, alpha vs solid, the duration rule, ProRes output). Non-negotiable — it's what makes a clip actually render.
- **Visual design — take creative liberty.** Everything below about color, layout, and composition is a **guideline and a source of inspiration, not a template.** Invent fresh layouts per video. **Do not copy the example clips or reference screenshots 1:1** — they show the *kind* of thing and prove the technical contract; they are not a house layout to replicate. Original, varied compositions that stay on-brand, visual-first, and on-contract are the goal.

---

## 1. Who the work is for (and why the rules exist)

Every graphic serves a Metics tutorial/review video. The viewer is:

- A **complete beginner** with no technical background.
- Reading at roughly an **18-year-old level** — plain words, no jargon.
- **40–60% non-English** — a large share watch dubbed or in a second language.

That last point drives the single most important rule below.

## 2. The core rule: visual-first, minimal English text

Because so many viewers don't read English, **meaning is carried by icons, numbers, and logos — not sentences.**

- **Numbers do the work:** a big `$1,000,000`, a `5%` badge, `5 breaches`. These read in any language.
- **Icons and logos over labels:** shield, lock, radar, arrow, product logos.
- **Labels are one uppercase word on a chip** when text is unavoidable — so a localization team can swap language without re-rendering motion.
- **Never put a full sentence on screen** unless it's genuinely unavoidable (e.g. a one-line legal disclaimer).
- **No years, months, or dates anywhere on screen** — titles get re-used over time; a dated graphic ages the video.

## 3. The brand model: constant system, swappable skin

Metics reviews a different product almost every video, and the graphics adopt **that product's brand** (its color + type) so they blend with the product b-roll. What stays constant is the *system* — layout, motion, component structure, safe zones, the asset library.

- **Brand skin = a tokens file.** `animation-kit/tokens.css` defines the swappable layer (accent, dark/light base, text, fonts, radii). Per video, copy it to `animation-kit/skins/tokens.<product>.css`, set the product's real palette + font, and paste it into each clip. (`skins/tokens.coveron.css` is a worked example.)
- **Lock the tokens first**, before building any graphic. Pull the product's real colors/fonts from its site (a 4-value swap: accent, dark, light, font).
- **Channel marks** (the Metics logo, plus the product logos you'll feature) live in `/assets/Logos`.

## 4. Components & motion (the animation kit)

All animated graphics are built from `/animation-kit` — a render-safe HTML system. **Do not reinvent the engine per clip; copy the template and only write the creative part.** Full rules in `animation-kit/PROJECT_INSTRUCTIONS.md`. Headlines:

- **Self-contained HTML, plain vanilla JS only** — never in-browser Babel (it crashes the renderer).
- **Animation is a pure function of one playhead `t`** (so the frame-stepping renderer is deterministic). Helpers: `lerp`, `visible`, easings.
- **1920×1080 stage**, scaled; renders to **4K ProRes** (alpha for overlays, opaque for full-frame). Exposes `window.setStoryTime / STORY_DURATION / __storyReady`.
- **Motion feel:** quick, *visibly staggered* entrances (~300ms apart), then a steady hold. Subtle continuous life so nothing sits dead; never distracting.
- **Duration:** lower-thirds / small cards are short (~4s); **every other graphic runs the exact length of the narration moment it covers** and is built as a multi-beat scene.

Reference components in `/animation-kit/components`: `lower-third`, `explainer` (multi-beat number stack), `youtube-link-card` (the "link on screen" YouTube UI), plus a CTA example in `/examples`.

## 5. Layout & safe zones

- **Lower-corner zone** for lower-thirds/cards: ~80–140px in from the left, ~80px up from the bottom — clears the YouTube caption strip.
- **Keep the center and lower-left clear** when a graphic sits over talking-head footage (that's where the presenter is).
- Design at 1920×1080; everything scales to 4K.

## 6. Pacing (where polish goes) — from the production framework §14.5

Polish is not even across the runtime. The **first minute is the most important** and gets the most attention; the conclusion/CTA is next. Plan the strongest visual moments early (before ~minute 6), not buried late.

## 7. Reuse beats reinvention — §15.6

Before creating anything new, pull from this repo: a component in `/animation-kit/components`, an icon or mockup in `/assets`, a transition in `/assets/Transitions`. The library compounds — every reusable element added makes the next video faster and more consistent.

## 8. The asset library (`/assets`)

The editor's accumulated, reusable elements — product-neutral, usable on any video:

- **`Emojis/`** — flat emoji PNGs (check, fire, lock, link, money, etc.) for quick number/icon-led callouts.
- **`Icons (Illustrator)/`** — the channel's custom icon set as editable `.ai` (check, arrow, bell, rocket, lock, gear, cloud/VPS, laptop, dollar, lightning, etc.). Source files for the editor; export SVG/PNG for use in HTML graphics.
- **`Logos/`** — product + brand logos (Metics, plus Twilio, Notion, Cursor, WordPress, Claude, Docker, Telegram, etc.), in PNG/SVG/AI. Use the real logo, don't redraw.
- **`Mockup Assets/`** — device + app frames (iPhone with notch, status bars, Telegram nav/send bars) for product UI mockups.
- **`Transitions/`** — reusable `.mov` transition clips.
- **`Graphics/`** — misc reusable composed elements.

## 9. Output format & handoff

Graphics are authored as HTML (per the kit), rendered to **4K ProRes** by Claude Code (`animations-to-video`), and dropped over the talking-head footage in the editor — alpha clips composite, opaque clips are full-frame cutaways. See `animation-kit/Claude_Design_Animation_Playbook.md`.

## 10. Reference (`/reference`)

Screenshots that show the target look (e.g. `youtube-watchpage-reference.png` — the "link on screen" YouTube UI). Per Claude Design best practice, **reference screenshots are the highest-leverage input** — add more here as the style evolves.
