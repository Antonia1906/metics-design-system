# Metics Media — Motion Graphics Design System

The channel-wide visual system for **Metics Media** motion-graphics overlays. Metics Media is a YouTube channel (600K+ subscribers) making **beginner-level software and web tutorial / review videos**. This design system produces the *animated graphics layer* of those videos — lower-thirds, callouts, number-pops, explainer scenes, and link/CTA cards — authored as self-contained HTML, rendered to **4K ProRes**, and composited over talking-head footage.

The defining idea: **constant system, swappable skin.** The structure, motion, and rules stay identical across every video; only the **brand skin** (colors + font) changes per video to match whatever product is being reviewed, so the graphics blend with that product's b-roll.

---

## Sources (provided inputs)

This system was built from one repository. The reader is encouraged to explore it directly for deeper fidelity:

- **GitHub:** `mattebso/metics-design-system` — https://github.com/mattebso/metics-design-system
  - `DESIGN.md` — the channel's look, rules, and brand model (the style bible).
  - `animation-kit/` — the render-safe HTML harness (vanilla JS, `t`-driven, 1920×1080→4K). **Strict technical contract.**
  - `examples/` — two reference style sets (light + warm, dark + cinematic), five archetypes each. Technical references, *not* visual templates.
  - `assets/` — the editor's reusable library: logos, emojis, device mockups, transitions, graphics.
  - `reference/` — reference screenshots (e.g. the YouTube "link on screen" watch-page UI).
- Related: `mattebso/animations-to-video` — the Claude Code skill that renders these HTML animations to MP4 / ProRes `.mov` via puppeteer + ffmpeg.

> Heavy binaries in the repo (`assets/Icons (Illustrator)/` `.ai`, `assets/Transitions/` `.mov`) were intentionally **not** imported — they aren't usable in HTML graphics. Logos, emojis, mockups, and graphics PNG/SVGs were imported into `assets/`.

---

## The two-layer rule: strict on the contract, creative on the look

This system is held to **two different standards** — internalize this before building anything.

- **Technical contract — FOLLOW EXACTLY.** The render harness in `animation-kit/` (vanilla JS only, animation as a pure function of one playhead `t`, the `window` API, the 1920×1080 stage, alpha vs solid, the duration rule, ProRes output). Zero deviation — it's what makes a clip actually render. **Never use `<script type="text/babel">` / JSX / any in-browser compiler — it crashes the 4K renderer.**
- **Visual design — TAKE CREATIVE LIBERTY.** Everything about color, layout, and composition below is a *guideline and inspiration, not a template*. Invent fresh layouts per video. **Do not clone the example clips 1:1** — they prove the contract and show the *kind* of thing; they are not a house layout to replicate.

---

## Who the work is for (why the rules exist)

Every graphic serves a beginner tutorial / review video. The viewer is a **complete beginner** with no technical background, reading at roughly an 18-year-old level, and **40–60% are non-English** (they watch dubbed or in a second language). That last fact drives the single most important content rule.

---

## CONTENT FUNDAMENTALS

**Visual-first, minimal English.** Because so many viewers don't read English, **meaning is carried by icons, numbers, and logos — not sentences.** This is the soul of the channel's on-screen copy.

- **Numbers do the work.** A big `$1,000,000`, a `5%` badge, `5 breaches`, `3` steps. Numbers read in any language and are always the loudest element. Reach for a number before a sentence.
- **Icons & logos over labels.** A shield, lock, link, money bag, check — or the product's real logo — instead of a word.
- **One UPPERCASE word on a chip** is the *only* sanctioned text block, used only when text is truly unavoidable. Set in mono with wide tracking so a localization team can swap the language without re-rendering the motion. Examples: `SECURE`, `FREE`, `STEP`, `SUBSCRIBE`, `LINK`.
- **Never a full sentence on screen** unless genuinely unavoidable (e.g. a one-line legal disclaimer or an affiliate-offer line in the YouTube-UI card).
- **No years, months, or dates anywhere on screen.** Titles get re-listed and re-used over time; a dated graphic ages the video. (The validator checks for this.)
- **Casing & voice:** UI/system docs use plain, direct, lowercase-friendly prose ("start from `_template.html`," "do not touch the harness"). On-screen labels are **ALL CAPS, one word**. There is no "I" / "you" address on screen — there's almost no prose on screen at all. The off-screen documentation voice is a confident, imperative senior-editor tone: short rules, bolded imperatives, "reuse beats reinvention."
- **No emoji as brand voice in prose.** Emoji exist only as a *flat-PNG icon vocabulary* for callouts (see Iconography) — never typed inline 🎉 as decoration in the system's own writing.
- **Placeholder copy is neutral:** `LABEL`, `TITLE`, `Primary Title`, `yourdomain.example`, `SUBSCRIBE`. No client copy ships in the library.

**Vibe:** calm, competent, evergreen. The graphics feel like a confident teacher pointing at the important thing — never busy, never shouty, never trend-chasing. A number lands, an icon confirms it, one word names it, then it holds.

**Affiliate / link-on-screen CTA format.** The one place a full line of text is allowed is the YouTube-description link card. It always follows a fixed pattern: a green ✅ check, the **platform name + offer type in parentheses, bold**, then the link. Match the offer type to the deal:

| Condition | Copy | Example |
|---|---|---|
| Paid platform, exclusive discount | `✅ [Platform] (Exclusive Discount):` | ✅ **Hostinger (Exclusive Discount):** https://meticsmedia.com/hostinger-NYH |
| Paid platform, no exclusive offer | `✅ [Platform] (Best Deal):` | ✅ **SiteGround (Best Deal):** https://meticsmedia.com/siteground-7G2 |
| Free trial, no exclusive offer | `✅ [Platform] (Free Trial):` | ✅ **ActiveCampaign (Free Trial):** https://meticsmedia.com/activecampaign-MX-8 |
| Free account | `✅ [Platform] (Free):` | ✅ **Base44 (Free):** https://meticsmedia.com/base44-XNG |
| Other special offer | `✅ [Platform] ([Special Offer]):` | ✅ **Shopify (Free Trial + 3 Months for $1/Mo.):** https://meticsmedia.com/shopify-5QG |
| Multiple links / options | `✅ Exclusive Deals & Discounts` then one `Platform: link` per line | Wix / Squarespace / Webflow … each on its own line |
| Video sponsor (sponsor ≠ topic) | `✅ Video Sponsor: [offer]:` | ✅ **Video Sponsor:** Get an exclusive deal … https://meticsmedia.com/hostinger-KAD |

Always full `https://meticsmedia.com/<slug>` links; bold the platform + offer up to the colon; the link stays the YouTube blue (`#3EA6FF`). On screen, the highlight box **frames the whole line** (don't guess a fixed position — inset it around the affiliate block so it stays centered as the link wraps).

---

## VISUAL FOUNDATIONS

**Color — one accent over a near-monochrome base.** Each skin is essentially **one signature accent** (the product's color) used for highlights, key numbers, CTAs, and arrows, sitting on a **dark base** or a **light base**. A second accent (`--accent-2`) appears sparingly for highlights. Neutral default is Coveron orange-red `#FB411C`; the two house styles use blue accents. Colors are **never hardcoded** — always `var(--…)`. See `colors_and_type.css` and `animation-kit/tokens.css`.

**Two house moods:**
- **Light / warm** — cream paper (`#F4F2EC`) full frames, dark surfaces (`#14161B`) for lower-third bodies, blue (`#4F7CF7`) + warm-orange (`#F2A65A`) accents, **Manrope** display + **JetBrains Mono**. Friendly and approachable.
- **Dark / cinematic** — near-black blue atmosphere (`#0A0C12`), glow-blue accents (`#5B8CFF` / `#9BD1FF`), **Instrument Serif** display. Moodier and tech-forward.

**Type.** **Inter is the intentional default brand font** (a real brand choice, not an AI default) — heavy weights, tight tracking for headings. House styles substitute Manrope (warm) or Instrument Serif (cinematic). **JetBrains Mono** carries URLs, the slash-number on lower-thirds, and chip labels. The hero **number** is the largest element on screen by a wide margin (up to ~360px), tabular-numerals, slightly negative tracking. Fonts load via **Google Fonts CDN** `<link>` in each clip head.

**Backgrounds.**
- **ALPHA clips paint nothing** — fully transparent, meant to composite over the talking-head footage (lower-thirds, callouts, number-pops, link banners).
- **SOLID clips** paint the full frame — either flat (`--bg-dark` / `--bg-light`) or, in the cinematic style, a layered atmosphere: a **radial gradient** core, a soft **backlight glow** behind the subject, a faint **dot-grid** masked to the center, a **vignette**, and a low-opacity **film-grain** overlay (SVG `feTurbulence`, ~14% opacity, `mix-blend: overlay`). No photographic backgrounds; no busy patterns.

**Animation & motion feel.** Motion is a **pure function of one playhead `t`** (deterministic — same `t` ⇒ same pixels). Entrances are **quick and visibly staggered** (~300ms apart between sub-elements), then everything **settles into a steady hold**. Easings: `easeOutCubic` for most settles, a touch of `easeOutBack` for number/icon **pops**, `easeInOut` for fade envelopes. Something stays **subtly alive** on the hold (a breathing scale, a pulsing accent dot, a `Math.sin(t)` drift) so frames are never perfectly dead — but never distracting. Exits are a short drift + fade (alpha) or none (solid end-cards). **No CSS `@keyframes`/`transition` drives the final look** — those break determinism.

**Borders, radii, cards.** Pill radius `9999px` for buttons/badges/chips; card radius `28px`; the cinematic mark uses a `~38px` rounded square. Cards are simple: a solid dark surface (`--bg-dark`) with generous padding (~24–56px) and **no border** in the warm style; chips in the cinematic style use a translucent white fill (`rgba(255,255,255,0.08)`) with a hairline border (`rgba(255,255,255,0.14)`) and a **backdrop blur**.

**Shadows & glow.** Shadows are **soft and large**, tinted by the accent rather than neutral black — e.g. `0 26px 70px rgba(91,140,255,0.45)` under the cinematic mark, `drop-shadow(0 12px 40px accent/45%)` on glowing icons, `text-shadow: 0 10px 60px rgba(0,0,0,.55)` behind big numbers for legibility over footage. Glow > hard shadow.

**Transparency & blur.** Used deliberately: chips get `backdrop-filter: blur(6px)` for a glassy callout; the cinematic backlight and grid are blurred/masked. ALPHA overlays rely on the accent-tinted text-shadow to stay readable over unknown footage behind them.

**Hover / press states.** These are *render* graphics, not an interactive product, so there are no true hover/press states. Where a clip *simulates* UI interaction (the YouTube link-on-screen card), the "press" is a small cursor **tap** offset (`~6px`) and a highlight box that **sweeps** in width to draw the eye to the clickable link. In the design-system UI kit (showcase only), interactive controls darken the accent on hover and shrink ~2% on press.

**Layout & safe zones (fixed rules).** Design at **1920×1080**, everything scales to 4K. Keep key content inside the **`--safe` 96px (5%) inset**. **Lower-thirds sit in the bottom ~20%**, ~80–140px in from the left and ~110px up from the bottom — clearing the YouTube caption strip. **Keep the center and lower-left clear** when a graphic sits over footage — that's where the presenter is on camera. Number-pops and explainers (which often run as full-frame SOLID cutaways) center freely.

**Imagery vibe.** No stock photography. Imagery = **real product logos** (used as-is, never redrawn) + the channel's flat-emoji icon set + simple geometric inline SVG icons. The cinematic style adds film-grain + vignette for a warm-cool, slightly cinematic feel; the warm style is clean and paper-bright.

---

## ICONOGRAPHY

The channel carries meaning with icons, so iconography is central — and it comes in **three tiers**:

1. **Real product logos (highest priority).** Whenever a real product is referenced, its **actual logo file** is used as an `<img>` — *never redrawn*. The library in `assets/Logos/` covers the products Metics reviews: Claude, Cursor, ChatGPT, Codex, Copilot/GitHub, Docker, Notion, Stripe, Telegram, Lovable, Replit, Windsurf, Netlify, Hostinger, Wix, WordPress, Spotify, Slack, Twilio, Resend, Apple/Google apps, and more. Logos ship in PNG and (some) SVG, in light/dark variants. The **Metics Media** mark itself (`assets/Logos/MeticsMedia/`) is an angular, geometric bird/arrow glyph beside a heavy all-caps **METICSMEDIA** wordmark; use `mm_white.png` on dark, `mm_black.png` on light, and the `icon_*` glyphs where space is tight.

2. **Flat-emoji PNG set.** `assets/Emojis/` holds ~30 flat emoji PNGs (check, fire, lock, link, money bag, trophy, medal, bulb, sparkles, stopwatch, confetti/tada, etc.) used for fast, language-neutral number/icon-led callouts. These are **PNG image assets**, dropped in as `<img>` — not typed Unicode emoji. The green **✅ check** is a recurring motif (e.g. the affiliate line in the YouTube card).

3. **Geometric inline SVG icons.** For generic concepts with no logo (shield, lock, radar, arrow, rocket, target, rings, bars, plus, chart-up), hand-drawn **inline SVG** is allowed — but only simple geometric shapes, drawn with `currentColor` + `var(--accent)`, stroke-based (`stroke-width ~2.4`, round caps/joins) or solid fills. Keep them abstract and on-brand; never approximate a *product* mark with SVG (use the real logo).

**Unicode characters** appear only as small functional glyphs in *preview chrome* (▶ ❚❚ scrub controls) — never as content iconography. There is no custom icon font; the editor's master icon set lives as Illustrator `.ai` source in the repo (not imported here) and is exported to SVG/PNG per use.

> **Substitution flag:** No icon-font or SVG sprite ships in HTML form — the canonical icon set is `.ai`. For any generic icon not covered by a logo or the emoji set, draw a simple geometric inline SVG (as the examples do) or pull from a CDN set with a matching stroke weight (e.g. Lucide, 2px stroke, round caps) and note the substitution.

---

## Index / manifest

**Root**
- `README.md` — this file: context, sources, content + visual foundations, iconography, manifest.
- `SKILL.md` — Agent-Skills-compatible entry point (for Claude Code download).
- `colors_and_type.css` — base tokens, the two house styles, and semantic type roles.

**`animation-kit/`** — the render-safe HTML harness (STRICT contract). `_template.html` (golden template — copy per clip), `tokens.css` (the swappable brand skin), `validate.js` (preflight), `PROJECT_INSTRUCTIONS.md` + the two Claude-Design playbooks, `skins/tokens.coveron.css` (a worked skin), and `components/` (lower-third, explainer, youtube-link-card reference implementations).

**`examples/`** — two reference style sets, five archetypes each (lower-third, number-pop, link-on-screen, explainer, cta) + motion specs. `style-light/` (warm) and `style-dark/` (cinematic). **Technical references, not visual templates.**

**`assets/`** — the editor's reusable library: `Logos/` (product + Metics marks), `Emojis/` (flat PNG callout icons), `Mockup Assets/` (iPhone status bar, Telegram bars), `Graphics/` (browser window, site-type illustrations).

**`reference/`** — `youtube-watchpage-reference.png`, the target for the "link on screen" UI.

**`preview/`** — design-system cards shown in the Design System tab (colors, type, motion, iconography, components).

**`ui_kits/`** — high-fidelity, interactive recreations of the product surfaces:
- `motion-overlays/` — the overlay component gallery: each archetype composited over a mock YouTube talking-head frame, with a live **brand-skin switcher** (accent + font + light/dark) demonstrating the swappable-token model, plus the YouTube "link on screen" watch-page recreation.
