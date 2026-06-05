#!/usr/bin/env node
/* ============================================================================
   METICS ANIMATION KIT — PREFLIGHT VALIDATOR
   ----------------------------------------------------------------------------
   Run this on a folder of clip HTMLs BEFORE rendering, to catch the things that
   silently break the animations-to-video renderer (or desync the animation).

   Usage:
     node validate.js <file-or-folder> [more files/folders...]
     node validate.js ./clips
     node validate.js *.html

   Exit code 0 = all passed, 1 = at least one FAIL. WARNs don't fail the run.
   ============================================================================ */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (!args.length) { console.error('usage: node validate.js <file-or-folder> ...'); process.exit(2); }

// collect .html files from the given paths
function collect(p) {
  const st = fs.statSync(p);
  if (st.isDirectory()) return fs.readdirSync(p).filter(f => f.endsWith('.html')).map(f => path.join(p, f));
  return p.endsWith('.html') ? [p] : [];
}
const files = args.flatMap(collect);
if (!files.length) { console.error('no .html files found'); process.exit(2); }

let hadFail = false;

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  // strip HTML comments so guidance text (e.g. "never use text/babel") isn't mistaken for real code
  const code = src.replace(/<!--[\s\S]*?-->/g, '');
  const base = path.basename(file);
  const fails = [];
  const warns = [];

  // --- hard FAILs (these break the render) ---
  if (/<script[^>]*type=["']text\/babel["']/i.test(code))
    fails.push('uses in-browser Babel (<script type="text/babel">) — crashes the 4K renderer. Ship plain vanilla JS.');
  if (!/window\.__storyReady\s*=\s*true/.test(code))
    fails.push('missing `window.__storyReady = true` — the renderer waits on this and will hang.');
  if (!/window\.setStoryTime\s*=/.test(code) && !/window\.setStoryTime\b/.test(code))
    fails.push('missing `window.setStoryTime` — the renderer steps time through this.');
  if (!/window\.STORY_DURATION\s*=/.test(code))
    fails.push('missing `window.STORY_DURATION` — the renderer needs the total length.');

  // --- WARNs (worth a look) ---
  const babelLib = /babel(\.min)?\.js|@babel\/standalone|unpkg\.com\/.*babel/i.test(code);
  if (babelLib) warns.push('references a Babel library — remove it; use plain JS.');

  if (!/1920px/.test(code) || !/1080px/.test(code))
    warns.push('no 1920×1080 stage found — design at 1080 so it scales cleanly to 4K.');

  // alpha/solid consistency vs filename tag
  const fnAlpha = /_ALPHA_/i.test(base) || /\balpha\b/i.test(base);
  const fnSolid = /_SOLID_/i.test(base) || /\bsolid\b/i.test(base);
  const bgMatch = code.match(/STAGE_BG\s*=\s*['"]([^'"]+)['"]/);
  const stageBg = bgMatch ? bgMatch[1] : null;
  if (stageBg) {
    const isTransparent = stageBg === 'transparent';
    if (fnAlpha && !isTransparent)
      warns.push(`filename says ALPHA but STAGE_BG = "${stageBg}" (not transparent). Render --format prores4444-alpha expects a transparent stage.`);
    if (fnSolid && isTransparent)
      warns.push('filename says SOLID but STAGE_BG = "transparent". A solid clip should paint the stage (solid-dark / solid-light).');
  } else {
    warns.push('could not find STAGE_BG = "..." — confirm alpha vs solid is set.');
  }

  // duration present in window + sanity
  const durMatch = code.match(/STORY_DURATION\s*=\s*([\d.]+)/);
  if (durMatch) {
    const d = parseFloat(durMatch[1]);
    if (d > 90) warns.push(`STORY_DURATION = ${d}s is very long — confirm it matches the transcript span (and is built as a multi-beat scene).`);
    if (d <= 0) fails.push('STORY_DURATION must be > 0.');
  }

  // determinism smell test: CSS keyframes used for content motion
  if (/@keyframes/.test(code) && /animation\s*:/.test(code))
    warns.push('uses CSS @keyframes/animation — fine for decorative loops, but the FINAL look must be computed from t (setStoryTime must reproduce every frame).');

  // report
  const status = fails.length ? 'FAIL' : (warns.length ? 'PASS (warnings)' : 'PASS');
  console.log(`\n${status === 'FAIL' ? '✗' : '✓'} ${base}  — ${status}`);
  fails.forEach(m => console.log('    FAIL: ' + m));
  warns.forEach(m => console.log('    warn: ' + m));
  if (fails.length) hadFail = true;
}

console.log('');
process.exit(hadFail ? 1 : 0);
