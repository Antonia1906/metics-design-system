# fonts/

Place `.woff2` font files here so `colors_and_type.css` can self-host them.

## Required files

| Family | Filename | Source |
|---|---|---|
| Inter (variable) | `Inter-Variable.woff2` | https://fonts.google.com/specimen/Inter |
| JetBrains Mono (variable) | `JetBrainsMono-Variable.woff2` | https://fonts.google.com/specimen/JetBrains+Mono |
| Manrope (variable) | `Manrope-Variable.woff2` | https://fonts.google.com/specimen/Manrope |
| Instrument Serif regular | `InstrumentSerif-Regular.woff2` | https://fonts.google.com/specimen/Instrument+Serif |
| Instrument Serif italic | `InstrumentSerif-Italic.woff2` | https://fonts.google.com/specimen/Instrument+Serif |

Until the files are uploaded, `colors_and_type.css` falls back to the system stack defined in each `--font-*` token (system-ui / Georgia / ui-monospace) — nothing breaks.

The animation-kit clips load fonts from Google Fonts CDN directly via a `<link>` in each clip `<head>` — those don't need these files.
