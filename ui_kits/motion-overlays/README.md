# UI Kit — Motion Overlays (Brand Skin Studio)

A high-fidelity, interactive recreation of Metics Media's **product surface**: the animated motion-graphics layer that sits over talking-head tutorial footage. Open `index.html`.

## What it is

The channel's "product" is its overlay system. This kit recreates the five archetypes and lets you **re-skin them live** — the core idea of the design system: *constant structure + motion, swappable brand skin (accent + font, light/dark mood)*.

- **Stage** — a mock 16:9 talking-head frame (placeholder footage, no fake person). A badge shows whether the current clip is **ALPHA** (composites over footage) or **SOLID** (full-frame cutaway).
- **Archetype rail** — Lower-third, Number-pop, Explainer, CTA end-card, Link-on-screen.
- **House style** — Light / warm (Manrope) vs Dark / cinematic (Instrument Serif).
- **Brand skin** — pick a product (Coveron, Claude, Stripe, Telegram, Docker, Cursor); the accent + CTA mark swap instantly. The structure never moves.
- **Replay** — re-runs the staggered entrance.

## ⚠️ This is a showcase, not the render path

These components use **React + CSS animations** for browsing convenience. They are **visual recreations** to demonstrate look + motion language. The **render-safe clips** that actually ship to 4K ProRes live in `../../animation-kit/` (the golden template + components) and `../../examples/` (two reference style sets) — those are **plain vanilla JS, animation as a pure function of `t`**, and must be used for anything that gets rendered. Never render from this kit.

## Files

- `index.html` — mounts the studio (React 18 + Babel, pinned).
- `studio.css` — chrome + overlay archetype styles (1920×1080 stage coords).
- `linkcard.css` — the YouTube watch-page (link-on-screen) styles.
- `overlays.jsx` — `LowerThird`, `NumberPop`, `Explainer`, `CTA` + geometric SVG icons.
- `linkcard.jsx` — `LinkOnScreen` (realistic YouTube UI; affiliate-CTA per the README format).
- `app.jsx` — the studio shell, house/skin token logic, stage scaling, entrance replay.

## Coverage notes

Components are cosmetic recreations, not production logic. Text is minimal-English and evergreen (no dates) per the system rules. Real product logos are used as `<img>`; generic concepts use simple geometric inline SVG.
