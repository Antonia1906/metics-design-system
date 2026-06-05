# Motion Overlay Component Library — Contract & Spec

A product-neutral library of self-contained animated overlays for talking-head / tutorial
video. Each archetype is **one HTML file** an editor can render to an alpha (or solid) clip
and composite over footage. This spec is the contract every file in the library obeys.

## Files in this library

| File | Archetype | Output | Duration |
|---|---|---|---|
| `lower-third_ALPHA_4s.html`   | lower-third (chapter / name card) | **ALPHA** | 4s |
| `explainer_ALPHA_12s.html`    | explainer (3 items reveal in sequence) | **ALPHA** | 12s (3 beats) |
| `number-pop_ALPHA_6s.html`    | number-pop (big number + icon callout) | **ALPHA** | 6s (2 beats) |
| `link-on-screen_ALPHA_6s.html`| link-on-screen (URL banner) | **ALPHA** | 6s |
| `cta_SOLID_8s.html`           | cta (end-card call to action) | **SOLID** (dark) | 8s (3 beats) |

Suggested naming for new files: `NAME_[ALPHA|SOLID]_[dur]s.html`.

---

## 1. Format

- **One self-contained HTML file per archetype.** Everything inline — one `<style>`, one
  `<script>`. No external JS/CSS beyond Google Fonts.
- **Plain vanilla JavaScript only.** No `<script type="text/babel">`, no JSX, no React in the
  browser, no runtime compiler of any kind. (Runtime Babel crashes the 4K frame renderer.)
- Canonical HTML: explicit closing tags, double-quoted attributes.

## 2. Determinism (so a frame-stepping renderer works)

- **Animation is a pure function of one playhead `t` (seconds).** Every animated property is
  computed from `t` via `lerp()` / `visible()` / easing helpers. No CSS `@keyframes` or
  `animation-delay` for the final look; no "time since mount"; no randomness. Same `t` →
  identical frame, every run. Continuous motion (pulses, sweeps) is `Math.sin(t * f)` /
  `(t * speed) % period`, also pure in `t`.
- A `requestAnimationFrame` loop advances `t` **for live preview only**. A renderer ignores it
  and calls `setStoryTime(s)` per frame.
- **Expose on `window`:**
  | Symbol | Meaning |
  |---|---|
  | `setStoryTime(s)` | seek to `s` seconds **and pause** (deterministic) |
  | `playStory()` / `pauseStory()` | resume / pause the preview loop |
  | `STORY_DURATION` | total seconds |
  | `STORY_FPS` | intended fps, `= 30` |
  | `STORY_BEATS` | `[{ id, in, out, label }]` |
  | `__storyReady` | `true` once mounted — the renderer must wait on this |
- **URL params:** `?t=` (seek + pause), `?autoplay=0` (mount paused at 0), `?preview=1` (show
  the scrub bar), `?bg=black|wall|alpha` (review backdrops). Default background = **transparent**.

## 3. Stage / output

- Build on a fixed **1920×1080** `.stage`, scaled to fit the viewport via a `ResizeObserver`.
- End the CSS with a clearly-marked **`RENDER MODE OVERRIDES`** block: `html/body` transparent
  by default, preview chrome hidden unless `body.preview`, and `html[data-bg="…"]` swaps the
  review backdrop on `.stage-host`.
- **`STAGE_BG`** (a JS const at the top of each file) declares the file's nature:
  - `'transparent'` → **ALPHA overlay** (composites over footage; capture with `omitBackground`).
  - `'solid-dark'` / `'solid-light'` → **SOLID full-frame clip** (the stage paints `--bg-dark` /
    `--bg-light` itself; it's a cut, not an overlay).
  State which each file is in the top comment.

## 4. Brand = tokens (skinnable, not tied to one product)

- All colors and fonts live in a `:root /* BRAND TOKENS */` block:
  `--accent`, `--accent-2`, `--bg-dark`, `--bg-light`, `--text-on-dark`, `--text-on-light`,
  `--muted-on-dark`, `--font-display`, `--font-body/--font-mono`.
- Use `var(--…)` **everywhere**. Never hardcode a product hex in component CSS. Re-skinning the
  whole library = editing one token block per file (or sharing one).
- No client-specific copy, logos, or brand colors. Logos are striped placeholder slots with a
  mono caption (e.g. `LOGO`). Generic/abstract icons may be simple inline SVG (rings, bars,
  plus, target) drawn with `currentColor` + `var(--accent)`.

## 5. Visual rules

- **Minimal English text.** Numbers, icons, and logos carry meaning. When text is needed, one
  **UPPERCASE** word on a chip. Placeholder copy only (`LABEL`, `TITLE`, `SUBSCRIBE`).
- **No years or dates anywhere.**
- **Quick, visibly staggered entrances** (~300 ms apart between sub-elements), then a steady
  hold. Exits are a short drift + fade (alpha overlays) or none (solid end cards).
- Keep something subtly alive on hold (a breathing scale, a pulsing accent dot) so frames are
  never perfectly static — but never distracting.

## 6. Duration & beats

- Short archetypes (lower-third, cta): ~4–8 s.
- Multi-step archetypes (explainer, number-pop): a `STORY_BEATS` array with per-beat `in`/`out`
  windows; each component reveals on its beat's `in`. Put the total in `STORY_DURATION`, in a
  top-of-file comment, and in the filename.

## 7. Capture pipeline (reference)

Puppeteer at 4K, step `t` frame-by-frame, screenshot with `omitBackground:true` for the ALPHA
files, then ffmpeg → ProRes 4444 (alpha). SOLID files capture without `omitBackground`.

```js
await page.goto(FILE + '?autoplay=0&t=0', { waitUntil: 'networkidle0' });
await page.waitForFunction('window.__storyReady === true');
for (let i = 0; i < FPS * DURATION; i++) {
  await page.evaluate(s => window.setStoryTime(s), i / FPS);
  await new Promise(r => setTimeout(r, 30));
  await page.screenshot({ path: `frames/f_${String(i).padStart(5,'0')}.png`, omitBackground: true });
}
```
```bash
ffmpeg -framerate 30 -i frames/f_%05d.png \
  -c:v prores_ks -profile:v 4 -pix_fmt yuva444p10le -vendor apl0 out.mov
```

## 8. To add a new archetype

1. Copy any existing file (they share an identical harness).
2. Set `STAGE_BG`, `DURATION`, `BEATS`, and the top comment.
3. Replace the markup inside `.stage` and write a `render(t)` that sets each element's
   style purely from `t` using `lerp` + the easings.
4. Keep the harness (helpers, preview bar, loop, window API) untouched.
