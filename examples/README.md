# Examples — canonical render-contract clips

Brand-neutral example clips, each conforming to the render contract in `../animation-kit/PROJECT_INSTRUCTIONS.md`. **All passed the validator** — vanilla JS (no Babel), `t`-driven, `window` API, 1920×1080, tokenized brand, evergreen.

> **Treat these as TECHNICAL references, not visual templates.** Copy the *plumbing* — how a `t`-driven multi-beat scene is wired, how alpha/solid is set — and then **design the look fresh** for each video. They deliberately don't match any one project's house style; that's the point. The contract is strict; the visuals are yours.

## Two style sets — grab whichever fits the video

Both sets cover the same five archetypes, so each is a complete starting point. Pick by mood:

- **`style-light/`** — the **lighter, warm** style: cream/paper surfaces with teal + orange accents. Good for friendly, approachable videos. *(Origin: Hermes project.)*
- **`style-dark/`** — the **darker, cinematic** style: near-black blue atmosphere with subtle glow. Good for moodier, tech-forward videos. *(Origin: $10k Website b-roll project.)*

Each folder has: `lower-third`, `number-pop`, `link-on-screen`, `explainer`, `cta`, plus its motion spec `.md`.

Useful difference on the explainer: **`style-light` ships it as ALPHA** (overlays footage) and **`style-dark` ships it as SOLID** (full-frame) — both are valid, different use cases.

(`G22_first-cta_ALPHA_6s.html` is an extra CTA example in this folder.)

## How to use them

- The look comes from the **tokens** in each file's `:root` block — to put a clip on a specific product's brand, swap those values (or paste in an `animation-kit/skins/tokens.<product>.css`). The *style* (light/dark structure, motion) stays; only the brand colors/font change.
- Preview any clip with `?preview=1` (add `&bg=black` for a dark backdrop).
- Re-run the validator after any edit: `node ../animation-kit/validate.js style-light style-dark` — all currently pass.

These two sets stay as the **reference library** (don't prune them). Promote a favorite into `../animation-kit/components/` only if you want a single default for a given archetype.
