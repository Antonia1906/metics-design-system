# Prompt — seed example files from a past Claude Design project

Paste the block below into one of the **previous Claude Design projects** (the ones that produced the Hermes intro / lower-thirds / explainers and the `.md` specs). It asks that project to hand back **clean, generalized, render-contract-compliant example files** you can drop into this repo's `/examples` and `/animation-kit/components`.

It bakes in everything we learned: **no in-browser Babel** (those older files used `<script type="text/babel">`, which crashes the 4K renderer — the single most important fix), a deterministic `t`-driven harness, the `window` API, tokenized brand, and the duration rule.

---

```
You previously built animated overlay HTMLs for me (an intro, lower thirds, and explainer scenes) and a motion-graphics spec. I'm turning that into a reusable, product-neutral component library. Please hand me CLEANED, GENERALIZED example files that follow an updated contract.

For each of these archetypes, give me ONE self-contained HTML file:
  1. lower-third   (chapter/name card, ~4s)
  2. explainer     (a multi-beat scene, e.g. 3 items revealing in sequence over ~12s)
  3. number-pop    (a big number + icon callout, ~6s)
  4. link-on-screen (a clean URL banner, ~6s)
  5. cta           (an end-card call to action, ~8s)

Apply ALL of these rules (they fix problems we hit rendering the originals):

FORMAT
- One self-contained HTML file each. Everything inline, ONE <script> tag.
- PLAIN VANILLA JAVASCRIPT ONLY. Do NOT use <script type="text/babel">, JSX, React-in-the-browser, or any runtime compiler. (This is critical — runtime Babel crashes our 4K renderer.) If your originals used React+Babel, port the logic to plain JS.

DETERMINISM (so a frame-stepping renderer works)
- Animation must be a pure function of one playhead `t` in seconds. Compute every property from `t` with lerp()/visible()/easing helpers. No CSS @keyframes/animation-delay for the final look, no "time since mount." A requestAnimationFrame loop may advance `t` for live preview only.
- Expose on window: setStoryTime(s) [seek+pause], playStory(), pauseStory(), STORY_DURATION, STORY_FPS = 30, STORY_BEATS, and __storyReady = true once mounted.
- Support URL params: ?t= (seek+pause), ?autoplay=0, ?preview=1 (show a scrub bar), ?bg=black|wall|alpha (review backdrops). Default background = transparent.

STAGE / OUTPUT
- Build on a fixed 1920×1080 stage, scaled to fit via ResizeObserver. End with a "RENDER MODE OVERRIDES" CSS block: transparent html/body by default, hide preview chrome, let ?bg= swap the backdrop.
- Per file, set STAGE_BG = 'transparent' for ALPHA overlays, or 'solid-dark'/'solid-light' for SOLID full-frame clips. Tell me which each is.

BRAND = TOKENS (so the files are skinnable, not tied to one product)
- Put all colors/fonts in CSS variables in a clearly marked ":root /* BRAND TOKENS */" block (e.g. --accent, --bg-dark, --bg-light, --text-on-dark, --font-display, --font-body). Use var(--…) everywhere; NEVER hardcode a product hex.
- Strip any client-specific copy, logos, and brand colors from the originals — replace with neutral placeholders and one-word UPPERCASE label placeholders.

VISUAL RULES
- Minimal English text — numbers, icons, and logos carry meaning; one uppercase word on a chip when text is needed. No years/dates anywhere.
- Quick, visibly staggered entrances (~300ms apart), then a steady hold.

DURATION
- lower-third/cta: short (~4–8s). explainer/number-pop: build as multi-beat (a STORY_BEATS array with per-beat in/out windows). Put the duration in STORY_DURATION, a top comment, and suggest a filename like NAME_[ALPHA|SOLID]_[dur]s.html.

Also: include (or update) the short .md spec describing this contract, generalized and product-neutral, so I can keep it in the repo.

Return each file in its own code block, named, with a one-line note (archetype, ALPHA/SOLID, duration).
```

---

After you get the files back: run `node animation-kit/validate.js <folder>` on them. Anything that fails (e.g. it slipped Babel back in) gets sent back with "you used in-browser Babel — convert to plain vanilla JS." Then drop the passing files into `/examples` (and promote the best ones into `/animation-kit/components`).
