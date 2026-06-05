---
name: metics-media-design
description: Use this skill to generate well-branded motion-graphics overlays and assets for Metics Media (the 600K-subscriber software/web tutorial YouTube channel), either for production render-safe clips or throwaway prototypes/mocks. Contains the channel's design guidelines, colors, type, fonts, the render-safe animation kit, reference example clips, the reusable asset library (logos, emojis, mockups), and an interactive UI kit.
user-invocable: true
---

# Metics Media — Motion Graphics Design System

Read **README.md** first — it is the source of truth for the channel's look, content rules, visual foundations, and iconography. Then explore the other files as needed.

## The one rule that matters most: two layers, two standards

- **Technical contract — STRICT.** Anything that gets rendered to video must follow `animation-kit/` exactly: self-contained HTML, **plain vanilla JS only** (never `<script type="text/babel">` / JSX / any in-browser compiler — it crashes the 4K renderer), animation as a **pure function of one playhead `t`**, the `window` API (`setStoryTime`, `STORY_DURATION`, `STORY_FPS`, `STORY_BEATS`, `__storyReady`), a 1920×1080 stage that scales to 4K, `STAGE_BG` = transparent (ALPHA) or solid (SOLID), and the duration rule. Start from `animation-kit/_template.html` and edit only the CONFIG + BUILD/RENDER sections. Run `animation-kit/validate.js` before handoff.
- **Visual design — YOURS.** Color, layout, and composition are guidelines + inspiration, not templates. Invent fresh layouts per video. Do **not** clone the example clips 1:1.

## Content rules (carry into everything)

- **Visual-first, minimal English** — meaning rides on numbers, icons, and logos. Labels = **one UPPERCASE word on a chip**. Never a full sentence (except the affiliate link line — see the CTA-format table in README).
- **No years or dates** anywhere on screen.
- **Brand = swappable tokens.** Keep colors/fonts in CSS variables; per video, swap ~4 values (accent, dark, light, font) to the product under review. Two house moods exist: light/warm and dark/cinematic. Inter is the neutral default.
- Use **real logo files** from `assets/Logos/`; never redraw a product mark. Generic concepts → simple geometric inline SVG. Callout icons → `assets/Emojis/` flat PNGs.

## How to use this skill

- **Throwaway prototype / mock / slide / showcase:** copy the assets you need out of `assets/`, read `colors_and_type.css` for tokens, and produce static HTML the user can view. The `ui_kits/motion-overlays/` studio is a good visual reference (but it's a React/CSS showcase — *not* the render path).
- **Production render-safe clip:** work inside the `animation-kit/` contract. Reskin via `animation-kit/tokens.css` → `skins/tokens.<product>.css`. Cross-reference `examples/style-light` and `examples/style-dark` for the *technical* plumbing of multi-beat scenes.

If the user invokes this skill without other guidance, ask what they want to build, ask a few focused questions (which product/brand to skin to, light vs dark mood, archetype, alpha vs solid, duration), then act as an expert motion-graphics designer who outputs HTML — either render-safe clips or quick mocks, depending on the need.

## Map of the system

- `README.md` — context, content fundamentals, visual foundations, iconography, manifest.
- `colors_and_type.css` — tokens, two house styles, semantic type roles.
- `animation-kit/` — the render-safe harness (STRICT). Template, tokens, validator, components, playbooks.
- `examples/` — two reference style sets × five archetypes (technical references).
- `assets/` — Logos, Emojis, Mockup Assets, Graphics.
- `reference/` — the YouTube "link on screen" target screenshot.
- `preview/` — design-system cards.
- `ui_kits/motion-overlays/` — interactive Brand Skin Studio (showcase recreation).

## Sources

Built from the GitHub repo **mattebso/metics-design-system** (https://github.com/mattebso/metics-design-system). Explore it for deeper fidelity. Related renderer: **mattebso/animations-to-video**.
