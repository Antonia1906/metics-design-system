# Assets — reusable visual library

Product-neutral elements the editor has built/acquired. Reuse these before creating anything new (framework §15.6).

| Folder | What | Format | Use |
|---|---|---|---|
| `Emojis/` | flat emoji set (check, fire, lock, link, money, clock, etc.) | PNG | quick icon/number-led callouts |
| `Icons (Illustrator)/` | the channel's custom icon set (check, arrow, bell, rocket, lock, gear, cloud/VPS, laptop, dollar, lightning, mic, code…) | **AI (source)** | edit in Illustrator → export SVG/PNG for HTML graphics |
| `Logos/` | brand + product logos (Metics, Twilio, Notion, Cursor, WordPress, Claude, Docker, Telegram, Resend, Netlify…) | PNG / SVG / AI | use the real logo, don't redraw |
| `Mockup Assets/` | device + app frames (iPhone w/ notch, status bars, Telegram nav/send bars) | PNG / SVG / AI | product UI mockups |
| `Transitions/` | reusable transition clips | **MOV** | editor timeline transitions |
| `Graphics/` | misc composed reusable elements | mixed | one-off reusable pieces |

Notes:
- **`.ai` and `.mov` are source/binary files tracked with Git LFS** (see repo `.gitattributes`). They're for the editor — export lightweight SVG/PNG when you need an icon inside an HTML graphic.
- For an AI design tool, the useful inputs here are the **PNG/SVG** (especially `Logos/`) — not the `.ai`/`.mov`.
- Naming follows the editor's existing convention (`*_outline`, `*_filled`, etc.). Keep it.
