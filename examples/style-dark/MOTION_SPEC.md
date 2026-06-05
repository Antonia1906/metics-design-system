# Motion Overlay Spec (product-neutral)

A contract for building self-contained HTML animation components that a
**frame-stepping renderer** (4K, alpha-aware) can drive deterministically, and
that a human can preview live in a browser. One archetype per file.

Reference implementations live in `library/`:

| File | Archetype | Output | Duration |
|------|-----------|--------|----------|
| `lower-third_ALPHA_4s.html`    | lower-third (name/chapter card) | ALPHA | 4s |
| `explainer_SOLID_12s.html`     | explainer (3 items in sequence) | SOLID dark | 12s |
| `number-pop_ALPHA_6s.html`     | number-pop (big number + icon)  | ALPHA | 6s |
| `link-on-screen_ALPHA_6s.html` | link-on-screen (URL banner)     | ALPHA | 6s |
| `cta_SOLID_8s.html`            | cta (end-card)                  | SOLID dark | 8s |

---

## 1. Format

- **One self-contained HTML file** per component. Everything inline — styles in a
  single `<style>`, logic in a single `<script>`. The only external requests are
  optional web-font `<link>`s.
- **Plain vanilla JavaScript only.** No `<script type="text/babel">`, no JSX, no
  React-in-the-browser, no runtime compiler of any kind. (Runtime Babel crashes
  the 4K renderer.) Port any React logic to plain DOM writes.

## 2. Determinism (the core rule)

- The entire look is a **pure function of one playhead `t`** (seconds): a single
  `render(t)` reads `t` and writes every animated property via `lerp()` /
  easing / presence helpers. Same `t` ⇒ same pixels, always.
- **No CSS `@keyframes` / `animation` / `transition` drives the final look**, and
  nothing reads "time since mount." A `requestAnimationFrame` loop may advance
  `t` for **live preview only**; the renderer ignores it and calls `setStoryTime`
  per frame.
- Even "typewriter" and "count-up" effects are derived from `t` (slice a string
  to `round(progress * length)`, etc.) — never from incremental timers.

### Required `window` API (set once mounted)

| Symbol | Meaning |
|--------|---------|
| `setStoryTime(s)` | Seek to `s` seconds **and pause**. Renders that exact frame. |
| `playStory()` | Start the live-preview rAF loop. |
| `pauseStory()` | Stop the loop. |
| `STORY_DURATION` | Total length in seconds. |
| `STORY_FPS` | `30`. |
| `STORY_BEATS` | Array of `{ id, in, out }` windows in seconds (`out: null` = holds to end). |
| `__storyReady` | `true` once mounted (after `document.fonts.ready`). |

The renderer waits for `__storyReady`, then for each frame `f`:
`setStoryTime(f / STORY_FPS)` → capture.

## 3. URL params

| Param | Effect |
|-------|--------|
| `?t=SEC` | Seek to `SEC` and pause (single-frame review). |
| `?autoplay=0` | Mount paused at `t=0` instead of auto-playing. |
| `?preview=1` | Show the scrub bar + play/pause chrome. |
| `?bg=black\|wall\|alpha` | Swap the **review backdrop** behind the stage. Default: transparent. `wall` = checkerboard for judging alpha edges. |

## 4. Stage / output

- Fixed **1920×1080** `#stage`, centered in a full-window `#viewport`, scaled to
  fit with a **`ResizeObserver`** (`scale = min(vw/1920, vh/1080)`).
- The file ends with a clearly marked **`RENDER MODE OVERRIDES`** CSS block:
  - `html, body { background: transparent; }` by default — so the renderer
    captures clean alpha.
  - Preview chrome (`#scrub`) is hidden unless `?preview=1`; also hidden in print.
  - `#viewport[data-bg="…"]` rules implement the `?bg=` review backdrops.
- **`STAGE_BG`** constant per file declares intent:
  - `'transparent'` → **ALPHA** overlay (the stage paints nothing; meant to sit
    over footage).
  - `'solid-dark'` / `'solid-light'` → **SOLID** full-frame clip (the stage paints
    the whole 1920×1080 frame; `?bg=` only tints the letterbox bars).

## 5. Brand = tokens (skinnable, never product-specific)

- All colors and fonts live in a `:root /* BRAND TOKENS */` block and are used via
  `var(--…)` everywhere. **Never hardcode a product hex** in rules.
- Canonical token names: `--accent`, `--accent-2`, `--bg-dark`, `--bg-light`,
  `--text-on-dark`, `--text-on-light`, `--muted-on-dark`, `--font-display`,
  `--font-body` (plus helpers like `--chip-bg`, `--chip-border`, `--mono`).
- Ship with **neutral placeholders**: generic accent, `LABEL` chips, `Primary
  Title`, `yourdomain.example`. No client copy, logos, or brand colors.

## 6. Visual rules

- **Minimal English text.** Numbers, icons, and logos carry the meaning. When text
  is unavoidable, use **one UPPERCASE word on a chip**.
- **No years or dates** anywhere.
- Entrances are **quick and visibly staggered (~300ms apart)**, then settle into a
  **steady hold**. Use eased transforms (`easeOutCubic`, a touch of `easeOutBack`
  for pops); reserve motion for entrance/exit, not the hold.
- Geometric inline-SVG icons only — no product marks.

## 7. Duration & naming

- Put the length in `STORY_DURATION`, in the top-of-file comment, and in the
  filename: **`NAME_[ALPHA|SOLID]_[dur]s.html`**.
- Short archetypes (lower-third, cta): ~4–8s. Multi-beat archetypes (explainer,
  number-pop): build a `STORY_BEATS` array with per-beat in/out windows; longer
  total (e.g. explainer ~12s).

---

## 8. Shared skeleton (copy to start a new component)

```js
// ---- helpers (pure) ----
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const lerp    = (a, b, u) => a + (b - a) * u;
const eOut    = u => 1 - Math.pow(1 - u, 3);
const eInOut  = u => u < .5 ? 4*u*u*u : 1 - Math.pow(-2*u+2, 3)/2;
const eBack   = u => { const c1=1.70158, c3=c1+1; return 1 + c3*Math.pow(u-1,3) + c1*Math.pow(u-1,2); };
function beat(id){ return STORY_BEATS.find(b => b.id === id) || { in:0, out:null }; }

// presence: linear in-ramp × (1 − eased out-ramp); pair with an eased transform
function present(t, b, inDur=0.55, outDur=0.45){
  const li = clamp01((t - b.in) / inDur);
  const eo = b.out == null ? 0 : eInOut(clamp01((t - b.out) / outDur));
  return { li, ei: eOut(li), opacity: li * (1 - eo), eo };
}
```

`render(t)` then maps each beat onto inline `opacity` + `transform` writes. The
playback engine (rAF loop, `setStoryTime/playStory/pauseStory`, URL-param
handling, `ResizeObserver` fit, `__storyReady` after fonts) is identical across
all five reference files — lift it verbatim.

## 9. Checklist for a new component

- [ ] Single file; one `<style>`, one `<script>`; vanilla JS only
- [ ] `render(t)` is pure; no keyframes/transitions/mount-time in the final look
- [ ] `window`: `setStoryTime`, `playStory`, `pauseStory`, `STORY_DURATION`,
      `STORY_FPS=30`, `STORY_BEATS`, `__storyReady`
- [ ] URL params: `?t=`, `?autoplay=0`, `?preview=1`, `?bg=black|wall|alpha`
- [ ] 1920×1080 stage, `ResizeObserver` fit, `RENDER MODE OVERRIDES` block
- [ ] `STAGE_BG` set; transparent default for ALPHA
- [ ] All colors/fonts via `:root` tokens; neutral placeholders only
- [ ] Minimal text, no dates; staggered entrance then hold
- [ ] Filename `NAME_[ALPHA|SOLID]_[dur]s.html`
```
