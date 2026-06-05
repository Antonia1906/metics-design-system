# metics-design-system

The Metics Media channel-wide **design system + animation kit + asset library**, in one repo you can link to a Claude Design design system and hand to the editor. **Product-neutral** — the system is constant; the brand skin swaps per video.

## What's inside

```
metics-design-system/
├── DESIGN.md                ← read first: the channel's look, rules, brand model (for Claude Design + the team)
├── animation-kit/           ← the render-safe HTML system (code)
│   ├── _template.html           golden template — copy per clip, edit only the marked parts
│   ├── tokens.css               brand tokens (the swappable skin) — neutral defaults
│   ├── skins/                   per-product skins (e.g. tokens.coveron.css) — examples
│   ├── components/              lower-third, explainer, youtube-link-card (the "link on screen" UI)
│   ├── validate.js              preflight — catches render-killers before you render
│   ├── PROJECT_INSTRUCTIONS.md   the render contract (paste into a Claude Project's instructions)
│   ├── Claude_Design_Animation_Playbook.md
│   ├── Claude_Design_Setup_and_Test.md
│   └── PROMPT_seed-examples.md   prompt to seed /examples from past Claude Design projects
├── assets/                  ← the editor's reusable library (PNG / SVG / AI / MOV)
│   ├── Emojis/  Icons (Illustrator)/  Logos/  Mockup Assets/  Transitions/  Graphics/
│   └── README.md
├── examples/                ← canonical render-contract example clips (seed via the prompt)
└── reference/               ← reference screenshots (e.g. the YouTube "link on screen" UI)
```

## Use it with Claude Design (native design system)

Claude Design has a built-in design system that every project inherits ([docs](https://support.claude.com/en/articles/14604397-set-up-your-design-system-in-claude-design)). To seed it from this repo:

1. claude.ai/design → org picker (lower-left) → your org → onboarding.
2. Feed it the **lightweight, readable** parts of this repo: `DESIGN.md`, everything in `reference/`, `assets/Logos/` (PNG/SVG), and `animation-kit/` (as your component library / codebase). You can also **link this repo** as project context.
3. **Do not feed it the heavy binaries** (`assets/Icons (Illustrator)/` `.ai` and `assets/Transitions/` `.mov`) — Claude Design can't read Illustrator/video, and large repos lag it. Link the `animation-kit/` + `DESIGN.md` + `reference/` subset instead.
4. Publish the design system. Validate with a test prompt (e.g. "build a lower-third on our system").

Remember the division of labor: **Claude Design designs the look (on-brand automatically); Claude Code + the animation-kit wrap it into the render-safe harness and render to ProRes.** Details in `animation-kit/Claude_Design_Setup_and_Test.md`.

## Git LFS (required — the repo has ~240 MB of binaries)

`.ai`, `.mov`, and `.psd` are tracked with Git LFS (see `.gitattributes`). Before the first commit:

```bash
# one-time on your machine
brew install git-lfs   # or: https://git-lfs.com
git lfs install
```

## Create & push the repo

```bash
cd "metics-design-system"
git init
git lfs install
git add .gitattributes && git commit -m "Track binaries with LFS"
git add .
git commit -m "Metics design system v1: kit + assets + DESIGN.md"
# with GitHub CLI:
gh repo create metics-media/metics-design-system --private --source=. --push
# or set a remote manually and: git push -u origin main
```

(Creating the GitHub repo and authenticating is yours to do — I can't push on your behalf.)

## How the editor uses it

The asset library (`assets/`) is the editor's reusable kit — icons, logos, device mockups, transitions, emojis. `DESIGN.md` is the style bible. The `animation-kit/` is how motion graphics get built and rendered. "Reuse beats reinvention" — pull from here before making anything new.

## Notes

- There may be an empty `assets/5 - Graphics/` folder (a leftover from extraction that the sandbox couldn't delete) — safe to delete on your Mac.
- The brand layer is per-video: copy `animation-kit/tokens.css` → `animation-kit/skins/tokens.<product>.css`, set the product's real palette + font.
