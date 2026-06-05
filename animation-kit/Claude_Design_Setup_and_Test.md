# Claude Design — Setup, Best Practices & Live Test

Findings from Anthropic's official docs (Apr 2026) + the practitioner write-ups, and how they change our plan.

## The big update: Claude Design has a NATIVE design-system feature

We don't need to fake a design system with loose files in a generic Project. **Claude Design (claude.ai/design, Anthropic Labs, research preview on Pro/Max/Team/Enterprise) has a built-in "design system" you set up once per organization, and every project inherits it automatically.** (Sources: [Set up your design system](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design), [Get started](https://support.claude.com/en/articles/14604416-get-started-with-claude-design).)

How it works:
1. **claude.ai/design → org picker (lower-left) → select/create your org → onboarding.**
2. **Upload brand + product assets** — codebases/component libraries, slide decks, prototypes, screenshots, logos, color/type specs. Claude extracts a reusable system (colors, typography, components, layout).
3. **Review** by creating a test project and prompting (e.g. "create a landing page for X").
4. **Publish** (toggle on) → all org projects then use your brand instead of the default.
5. **Update later** via org settings → Open → **Remix** → chat.

Per-project: create a project (auto-inherits the system) → add context (screenshots, a linked repo) → prompt → iterate via **chat** (broad changes) and **inline comments** (targeted) → **Export** (.zip, PDF, PPTX, Canva, **standalone HTML**, or **Handoff to Claude Code / local agent / Claude Code Web**).

## Best practices (docs + practitioners)

- **Reference screenshots are the highest-leverage input — use them before any text prompt.** Lock the tokens (colors/type/spacing/radius) first, then build screens. → We have these: `Brand_Guidelines.md`, the Coveron asset pack, and `MME#17.psd`.
- **Upload real finished examples, not just specs** — a finished page/graphic tells Claude more about the feel than a palette alone.
- **Name components when you know them exist** ("use the Primary Button", "apply the Card layout").
- **Iterate incrementally**; ask for 2–3 variations; ask Claude to review for contrast/hierarchy.
- **Inline comments sometimes vanish** before Claude reads them — paste the comment into chat as a fallback (known issue).
- **Avoid AI slop**: it drifts to default fonts (Inter/Roboto/Arial) and purple-gradient-on-white. Constrain explicitly. (Our Inter usage is intentional — it's Coveron's real font, not a default — but say so.)
- **Always rewrite the copy** before shipping.
- Usage is a **separate weekly meter** from chat.

## What this means for OUR animation workflow (revised recommendation)

Our work has two layers, and they map to two different mechanisms:

1. **Brand layer → set up natively as the Metics design system (do this once).** Upload `Brand_Guidelines.md`, the logos, the Coveron asset pack, reference screenshots (incl. `MME#17.psd` and a rendered kit clip), and a brand doc. Now every Claude Design project is on-brand automatically — no re-pasting tokens.

2. **Render-contract layer → this is NOT something the native design system knows.** Claude Design extracts *brand*, not our t-driven `window`-API render harness. Two ways to handle it:
   - **(Preferred division of labor)** Let **Claude Design design the *look*** of each graphic (it's good at that + applies brand automatically), export **standalone HTML**, then **hand off to Claude Code**, which wraps the visual into the kit's render harness (the `_template.html` contract) and renders to ProRes. Claude Design = look; Claude Code + kit = the render-safe wrapper.
   - **(Or)** Link the **Animation Kit as a repo/codebase context** so Claude Design reads `_template.html` + the components and produces files already on-contract. (Test which is more reliable — see below.)

So: **the native design system replaces the "load tokens into a Project" idea for brand. The kit (template + validator + Claude Code render) stays as the render-contract guarantee.** Best of both.

## Live test — paste this into the Claude-in-Chrome extension

Run this while signed in at claude.ai/design (the extension can drive the page; our background tools can't, because the app never goes "idle"). It tests both the design-system state and whether Claude Design can produce an on-contract clip.

```
You're helping me test Claude Design at claude.ai/design. Do this and report back at each step:

1. Open claude.ai/design. In the lower-left org picker, tell me which organization is active and whether a published design system already exists for it (yes/no + its name).

2. Create a new project. Attach as context (if upload is available) the two files I'll provide: Brand_Guidelines.md and the screenshot MME#17.psd preview. Confirm what attached successfully.

3. Give it this prompt and paste the result back to me:
   "Design a 'link on screen' lower-third graphic for a YouTube video, 1920×1080, on a transparent background. Show the URL meticsmedia.com/coveron-QQH with a small '5% off' chip and a down-arrow. Brand: accent #FB411C, near-black #0A0A0A, off-white #F7F7F8, font Inter. Minimal — just the link, no extra text. Output it as a single self-contained HTML file using PLAIN vanilla JavaScript (no React, no in-browser Babel). Drive all animation from one variable `t` (seconds) and expose window.setStoryTime(s), window.STORY_DURATION, and window.__storyReady = true."

4. Export it as standalone HTML (Export → standalone HTML) and paste the code, OR use 'Handoff to Claude Code'.

5. Report: (a) did the design system apply Metics brand automatically? (b) did the HTML use plain vanilla JS (search the code for 'text/babel' — it must NOT appear)? (c) is there a window.setStoryTime / window.__storyReady? (d) is the stage 1920×1080? (e) anything that was awkward or that it refused to do.

Don't publish or change any settings. Just create the test project and report.
```

If the output is missing the `window` API / vanilla-JS harness, that confirms the **preferred division**: use Claude Design for the *look*, then let Claude Code wrap it with the kit's `_template.html` contract before rendering.
