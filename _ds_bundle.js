/* @ds-bundle: {"format":2,"namespace":"MeticsMediaDesignSystem_86c3a6","components":[],"sourceHashes":{"animation-kit/validate.js":"978f14676f54","ui_kits/motion-overlays/app.jsx":"a28e93a76cef","ui_kits/motion-overlays/linkcard.jsx":"bce9a7465035","ui_kits/motion-overlays/overlays.jsx":"42c7033d3058"},"inlinedExternals":[]} */

(() => {

const __ds_ns = (window.MeticsMediaDesignSystem_86c3a6 = window.MeticsMediaDesignSystem_86c3a6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// animation-kit/validate.js
try { (() => {
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

   NOTE: this is a Node.js-only script. In browser contexts it exports nothing.
   ============================================================================ */

/* guard: only run in Node.js — skip entirely when loaded as a browser module */
if (typeof process !== 'undefined' && typeof require !== 'undefined' && process.argv) {
  const fs = require('fs');
  const path = require('path');
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error('usage: node validate.js <file-or-folder> ...');
    process.exit(2);
  }

  // collect .html files from the given paths
  function collect(p) {
    const st = fs.statSync(p);
    if (st.isDirectory()) return fs.readdirSync(p).filter(f => f.endsWith('.html')).map(f => path.join(p, f));
    return p.endsWith('.html') ? [p] : [];
  }
  const files = args.flatMap(collect);
  if (!files.length) {
    console.error('no .html files found');
    process.exit(2);
  }
  let hadFail = false;
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf8');
    // strip HTML comments so guidance text isn't mistaken for real code
    const code = src.replace(/<!--[\s\S]*?-->/g, '');
    const base = path.basename(file);
    const fails = [];
    const warns = [];

    // --- hard FAILs (these break the render) ---
    if (/<script[^>]*type=["']text\/babel["']/i.test(code)) fails.push('uses in-browser Babel (<script type="text/babel">) — crashes the 4K renderer. Ship plain vanilla JS.');
    if (!/window\.__storyReady\s*=\s*true/.test(code)) fails.push('missing `window.__storyReady = true` — the renderer waits on this and will hang.');
    if (!/window\.setStoryTime\s*=/.test(code) && !/window\.setStoryTime\b/.test(code)) fails.push('missing `window.setStoryTime` — the renderer steps time through this.');
    if (!/window\.STORY_DURATION\s*=/.test(code)) fails.push('missing `window.STORY_DURATION` — the renderer needs the total length.');

    // --- WARNs (worth a look) ---
    const babelLib = /babel(\.min)?\.js|@babel\/standalone|unpkg\.com\/.*babel/i.test(code);
    if (babelLib) warns.push('references a Babel library — remove it; use plain JS.');
    if (!/1920px/.test(code) || !/1080px/.test(code)) warns.push('no 1920×1080 stage found — design at 1080 so it scales cleanly to 4K.');

    // alpha/solid consistency vs filename tag
    const fnAlpha = /_ALPHA_/i.test(base) || /\balpha\b/i.test(base);
    const fnSolid = /_SOLID_/i.test(base) || /\bsolid\b/i.test(base);
    const bgMatch = code.match(/STAGE_BG\s*=\s*['"]([^'"]+)['"]/);
    const stageBg = bgMatch ? bgMatch[1] : null;
    if (stageBg) {
      const isTransparent = stageBg === 'transparent';
      if (fnAlpha && !isTransparent) warns.push(`filename says ALPHA but STAGE_BG = "${stageBg}" (not transparent).`);
      if (fnSolid && isTransparent) warns.push('filename says SOLID but STAGE_BG = "transparent". A solid clip should paint the stage.');
    } else {
      warns.push('could not find STAGE_BG = "..." — confirm alpha vs solid is set.');
    }

    // duration sanity
    const durMatch = code.match(/STORY_DURATION\s*=\s*([\d.]+)/);
    if (durMatch) {
      const d = parseFloat(durMatch[1]);
      if (d > 90) warns.push(`STORY_DURATION = ${d}s is very long — confirm it matches the transcript span.`);
      if (d <= 0) fails.push('STORY_DURATION must be > 0.');
    }

    // determinism smell test
    if (/@keyframes/.test(code) && /animation\s*:/.test(code)) warns.push('uses CSS @keyframes/animation — fine for decorative loops, but FINAL look must be computed from t.');

    // report
    const status = fails.length ? 'FAIL' : warns.length ? 'PASS (warnings)' : 'PASS';
    console.log(`\n${status === 'FAIL' ? '✗' : '✓'} ${base}  — ${status}`);
    fails.forEach(m => console.log('    FAIL: ' + m));
    warns.forEach(m => console.log('    warn: ' + m));
    if (fails.length) hadFail = true;
  }
  console.log('');
  process.exit(hadFail ? 1 : 0);
} /* end Node.js guard */
})(); } catch (e) { __ds_ns.__errors.push({ path: "animation-kit/validate.js", error: String((e && e.message) || e) }); }

// ui_kits/motion-overlays/app.jsx
try { (() => {
/* ============================================================================
   APP — the Brand Skin Studio. Demonstrates the system's core idea: constant
   structure + motion, swappable brand skin (accent + font, light/dark mood).
   Pick an archetype, a house style, and a product skin; the overlay re-skins
   live over a mock talking-head frame.

   NOTE: this is a showcase recreation (CSS entrances). The RENDER-SAFE clips
   (vanilla JS, t-driven, 4K ProRes) live in ../../animation-kit + ../../examples.
   ============================================================================ */
const {
  useState,
  useRef,
  useLayoutEffect,
  useEffect
} = React;

/* ---- house styles: mood = bg + fonts + base text ---- */
const HOUSES = {
  light: {
    name: 'Light',
    sub: 'warm',
    vars: {
      '--bg-dark': '#14161B',
      '--bg-light': '#F4F2EC',
      '--text-on-dark': '#FFFFFF',
      '--text-on-light': '#14161B',
      '--muted-on-dark': 'rgba(255,255,255,0.52)',
      '--chip-bg': 'rgba(255,255,255,0.08)',
      '--chip-border': 'rgba(255,255,255,0.16)',
      '--font-display': "'Manrope',system-ui,sans-serif",
      '--font-body': "'Manrope',system-ui,sans-serif",
      '--font-mono': "'JetBrains Mono',ui-monospace,monospace"
    },
    accent2: '#F2A65A'
  },
  dark: {
    name: 'Dark',
    sub: 'cinematic',
    vars: {
      '--bg-dark': '#0A0C12',
      '--bg-light': '#F4F6FB',
      '--text-on-dark': '#EEF2FB',
      '--text-on-light': '#10141C',
      '--muted-on-dark': 'rgba(238,242,251,0.60)',
      '--chip-bg': 'rgba(255,255,255,0.08)',
      '--chip-border': 'rgba(255,255,255,0.14)',
      '--font-display': "'Instrument Serif',Georgia,serif",
      '--font-body': "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      '--font-mono': "'JetBrains Mono',ui-monospace,monospace"
    },
    accent2: '#9BD1FF'
  }
};

/* ---- product skins: accent (+ deep) + a CTA mark logo ---- */
const SKINS = [{
  id: 'coveron',
  name: 'Coveron',
  accent: '#FB411C',
  deep: '#9E270F',
  mark: '../../assets/Logos/MeticsMedia/icon_black.png'
}, {
  id: 'claude',
  name: 'Claude',
  accent: '#D97757',
  deep: '#A8552F',
  mark: '../../assets/Logos/Claude/Claude_AI_symbol.png'
}, {
  id: 'stripe',
  name: 'Stripe',
  accent: '#635BFF',
  deep: '#4239C8',
  mark: '../../assets/Logos/MeticsMedia/icon_black.png'
}, {
  id: 'telegram',
  name: 'Telegram',
  accent: '#2AABEE',
  deep: '#1E87BE',
  mark: '../../assets/Logos/Telegram/Telegram_logo.png'
}, {
  id: 'docker',
  name: 'Docker',
  accent: '#2496ED',
  deep: '#1B6FB3',
  mark: '../../assets/Logos/Docker/docker_icon.png'
}, {
  id: 'cursor',
  name: 'Cursor',
  accent: '#6B7280',
  deep: '#454B54',
  mark: '../../assets/Logos/Cursor/Cursor_logo.png'
}];

/* ---- archetypes ---- */
const {
  ChartIcon,
  ShieldIcon,
  BoltIcon,
  PlayIcon
} = window.OverlayIcons;
const ARCHETYPES = [{
  id: 'lower-third',
  name: 'Lower-third',
  sub: 'ALPHA · ~4s',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "15",
    width: "14",
    height: "5",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 15v5"
  }))
}, {
  id: 'number-pop',
  name: 'Number-pop',
  sub: 'ALPHA · ~6s',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 7h3v10M7 17h7"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "8",
    r: "2"
  }))
}, {
  id: 'explainer',
  name: 'Explainer',
  sub: 'multi-beat',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "7",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 7h8M11 12h8M11 17h8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "12",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "17",
    r: "2"
  }))
}, {
  id: 'cta',
  name: 'CTA end-card',
  sub: 'SOLID · ~8s',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 12h14M13 6l6 6-6 6"
  }))
}, {
  id: 'cta-bar',
  name: 'Link CTA bar',
  sub: 'ALPHA · bottom',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "9",
    width: "18",
    height: "6",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 12h8"
  }))
}, {
  id: 'yt-description',
  name: 'YT Description',
  sub: 'SOLID · full UI',
  Icon: () => /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M9 15l6-6M8 13l-2 2a3 3 0 104 4l2-2M16 11l2-2a3 3 0 10-4-4l-2 2"
  }))
}];

/* which archetypes paint a full frame (SOLID) vs overlay footage (ALPHA) */
function modeFor(arch, house) {
  if (arch === 'cta' || arch === 'yt-description') return 'solid';
  if (arch === 'cta-bar') return 'alpha';
  if (arch === 'explainer') return house === 'dark' ? 'solid' : 'alpha';
  return 'alpha';
}
function App() {
  const [arch, setArch] = useState('number-pop');
  const [house, setHouse] = useState('dark');
  const [skinId, setSkinId] = useState('coveron');
  const [playing, setPlaying] = useState(true);
  const skin = SKINS.find(s => s.id === skinId);
  const H = HOUSES[house];
  const mode = modeFor(arch, house);

  /* token scope applied to the frame */
  const isSolidLight = mode === 'solid' && house === 'light';
  const tokenVars = {
    ...H.vars,
    '--accent': skin.accent,
    '--accent-deep': skin.deep,
    '--accent-2': H.accent2,
    '--glow': hexA(skin.accent, 0.45),
    '--text': isSolidLight ? H.vars['--text-on-light'] : H.vars['--text-on-dark'],
    '--muted': H.vars['--muted-on-dark'],
    '--ui-accent': skin.accent,
    '--ease': 'cubic-bezier(.2,.7,.2,1)',
    '--ease-back': 'cubic-bezier(.34,1.56,.64,1)'
  };

  /* scale the 1920×1080 stage into the frame */
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  useLayoutEffect(() => {
    const fit = () => {
      if (frameRef.current) setScale(frameRef.current.clientWidth / 1920);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (frameRef.current) ro.observe(frameRef.current);
    return () => ro.disconnect();
  }, []);

  /* replay entrance when anything changes: add .playing, then drop it so the
     resting state is the plain visible base (robust even if the compositor is
     throttled and the animation never advances) */
  useEffect(() => {
    setPlaying(false);
    const r = requestAnimationFrame(() => setPlaying(true));
    const id = setTimeout(() => setPlaying(false), 1600);
    return () => {
      cancelAnimationFrame(r);
      clearTimeout(id);
    };
  }, [arch, house, skinId]);
  const replay = () => {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
    setTimeout(() => setPlaying(false), 1600);
  };
  const skinData = {
    ...skin,
    markLogo: skin.mark
  };
  const O = window.Overlays;
  let content = null;
  if (arch === 'lower-third') content = /*#__PURE__*/React.createElement(O.LowerThird, {
    skin: skinData
  });else if (arch === 'number-pop') content = /*#__PURE__*/React.createElement(O.NumberPop, {
    skin: skinData
  });else if (arch === 'explainer') content = /*#__PURE__*/React.createElement(O.Explainer, {
    skin: skinData
  });else if (arch === 'cta') content = /*#__PURE__*/React.createElement(O.CTA, {
    skin: skinData
  });else if (arch === 'cta-bar') content = /*#__PURE__*/React.createElement(O.CTABar, {
    skin: skinData
  });else if (arch === 'yt-description') content = /*#__PURE__*/React.createElement(window.LinkOnScreen, {
    skin: skinData
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/Logos/MeticsMedia/mm_white.png",
    alt: "Metics Media"
  })), /*#__PURE__*/React.createElement("div", {
    className: "tag"
  }, "Motion Overlays \u2014 Brand Skin Studio"), /*#__PURE__*/React.createElement("div", {
    className: "spacer"
  }), /*#__PURE__*/React.createElement("div", {
    className: "replay",
    onClick: replay
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 12a9 9 0 109-9 9 9 0 00-7 3.3L3 8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 3v5h5"
  })), "Replay")), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "stage-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "frame",
    ref: frameRef,
    "data-mode": mode,
    "data-house": house,
    style: {
      ...tokenVars
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "footage"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ftag"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rec"
  }), "REC \xB7 talking-head footage"), /*#__PURE__*/React.createElement("div", {
    className: "silhouette"
  })), /*#__PURE__*/React.createElement("div", {
    className: "atmos"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bgfill"
  }), /*#__PURE__*/React.createElement("div", {
    className: "backlight"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }), /*#__PURE__*/React.createElement("div", {
    className: "vig"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mode-badge"
  }, mode === 'solid' ? 'SOLID · full-frame' : 'ALPHA · overlay'), /*#__PURE__*/React.createElement("div", {
    className: "overlay-stage"
  }, /*#__PURE__*/React.createElement("div", {
    className: 'play-wrap' + (playing ? ' playing' : ''),
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      transformOrigin: 'top left',
      transform: `scale(${scale})`,
      width: 1920,
      height: 1080
    }
  }, content)))), /*#__PURE__*/React.createElement("div", {
    className: "controls",
    style: {
      '--ui-accent': skin.accent
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "csec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clabel"
  }, "Archetype"), /*#__PURE__*/React.createElement("div", {
    className: "rail"
  }, ARCHETYPES.map(a => /*#__PURE__*/React.createElement("div", {
    key: a.id,
    className: 'item' + (arch === a.id ? ' active' : ''),
    onClick: () => setArch(a.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "ico"
  }, /*#__PURE__*/React.createElement(a.Icon, null)), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, a.name), /*#__PURE__*/React.createElement("div", {
    className: "sub"
  }, a.sub)))))), /*#__PURE__*/React.createElement("div", {
    className: "csec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clabel"
  }, "House style"), /*#__PURE__*/React.createElement("div", {
    className: "seg"
  }, Object.keys(HOUSES).map(h => /*#__PURE__*/React.createElement("button", {
    key: h,
    className: house === h ? 'on' : '',
    onClick: () => setHouse(h)
  }, HOUSES[h].name, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .5,
      fontWeight: 400
    }
  }, "/ ", HOUSES[h].sub))))), /*#__PURE__*/React.createElement("div", {
    className: "csec"
  }, /*#__PURE__*/React.createElement("div", {
    className: "clabel"
  }, "Brand skin \u2014 accent swaps per product"), /*#__PURE__*/React.createElement("div", {
    className: "skins"
  }, SKINS.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    className: 'skin' + (skinId === s.id ? ' on' : ''),
    onClick: () => setSkinId(s.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "dot",
    style: {
      background: s.accent
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "nm"
  }, s.name), /*#__PURE__*/React.createElement("div", {
    className: "ft"
  }, s.accent)))))), /*#__PURE__*/React.createElement("div", {
    className: "hint"
  }, /*#__PURE__*/React.createElement("b", null, "Constant system, swappable skin."), " Structure, motion, and safe zones stay fixed \u2014 only the accent + font change per video to match the product under review. These are showcase recreations; the render-safe clips (vanilla JS, t-driven, 4K ProRes) live in ", /*#__PURE__*/React.createElement("b", null, "animation-kit/"), " + ", /*#__PURE__*/React.createElement("b", null, "examples/"), "."))));
}

/* hex → rgba string */
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16),
    g = parseInt(h.substring(2, 4), 16),
    b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/motion-overlays/app.jsx", error: String((e && e.message) || e) }); }

// ui_kits/motion-overlays/linkcard.jsx
try { (() => {
/* ============================================================================
   LINK-ON-SCREEN — the "link on screen" archetype as a realistic YouTube
   watch-page UI (SOLID, full-frame). Recreated from reference/youtube-watchpage
   -reference.png. The affiliate line highlights + a cursor glides to the link.
   YouTube UI uses Roboto; the highlight uses the brand --accent.
   ============================================================================ */

function LinkOnScreen({
  skin
}) {
  const {
    BellIcon
  } = window.OverlayIcons;
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-page-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "yt"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-title"
  }, skin.videoTitle || 'Coveron Review: Is It the Best Identity Theft Protection?'), /*#__PURE__*/React.createElement("div", {
    className: "yt-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-chan"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-av"
  }, /*#__PURE__*/React.createElement("img", {
    className: "av-dark",
    src: "../../assets/Logos/MeticsMedia/icon_white.png",
    alt: "Metics"
  }), /*#__PURE__*/React.createElement("img", {
    className: "av-light",
    src: "../../assets/Logos/MeticsMedia/icon_black.png",
    alt: "Metics"
  })), /*#__PURE__*/React.createElement("div", {
    className: "yt-cmeta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-name"
  }, "Metics Media", /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10",
    fill: "#717171"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10.1 15.2l-2.9-2.9 1.25-1.25 1.65 1.65 4.4-4.4 1.25 1.25z",
    fill: "#fff"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "yt-subs"
  }, "600K subscribers")), /*#__PURE__*/React.createElement("div", {
    className: "yt-bell"
  }, /*#__PURE__*/React.createElement(BellIcon, null), /*#__PURE__*/React.createElement("span", null, "Subscribed"))), /*#__PURE__*/React.createElement("div", {
    className: "yt-actions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-btn"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 21h4V9H1v12zM23 10a2 2 0 00-2-2h-6.3l1-4.6V3a1.5 1.5 0 00-1.5-1.5L7 9v12h11a2 2 0 002-1.7l1.9-7.3z"
  })), "1.3K"), /*#__PURE__*/React.createElement("div", {
    className: "yt-btn"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 9V5l7 7-7 7v-4C7 14 4 19 4 19c0-7 3-10 10-10z"
  })), "Share"), /*#__PURE__*/React.createElement("div", {
    className: "yt-btn"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 16l-6-6h4V4h4v6h4l-6 6zM4 18h16v2H4z"
  })), "Download"))), /*#__PURE__*/React.createElement("div", {
    className: "yt-desc"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-views"
  }, "52,847 views"), /*#__PURE__*/React.createElement("div", {
    className: "yt-aff"
  }, /*#__PURE__*/React.createElement("div", {
    className: "yt-hl"
  }), /*#__PURE__*/React.createElement("img", {
    className: "yt-check",
    src: "../../assets/Emojis/white_check_mark.png",
    alt: "check"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, skin.offer || 'Coveron (Exclusive Discount):'), " ", /*#__PURE__*/React.createElement("span", {
    className: "yt-lnk"
  }, skin.link || 'https://meticsmedia.com/coveron-QQH')))), /*#__PURE__*/React.createElement("svg", {
    className: "yt-cursor",
    viewBox: "0 0 24 24",
    fill: "#FFFFFF",
    stroke: "#000",
    strokeWidth: "0.8"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 2l16 9-7 1.5L9 20 4 2z"
  }))));
}
window.LinkOnScreen = LinkOnScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/motion-overlays/linkcard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/motion-overlays/overlays.jsx
try { (() => {
/* ============================================================================
   OVERLAYS — the five archetypes as React components (showcase recreations).
   Each returns the on-stage DOM that studio.css styles. The `playKey` prop is
   used by App to remount + replay the CSS entrance. Icons are simple geometric
   inline SVG (generic concepts); product marks use real logo <img> files.
   ============================================================================ */

const ChartIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.4",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M6 32l10-10 8 7 12-15"
}), /*#__PURE__*/React.createElement("path", {
  d: "M30 14h8v8"
}));
const ShieldIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.4",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M24 5l15 6v11c0 10-6.4 16.6-15 21-8.6-4.4-15-11-15-21V11z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 24l6 6 11-12"
}));
const LockIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.4",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("rect", {
  x: "10",
  y: "21",
  width: "28",
  height: "20",
  rx: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 21v-5a8 8 0 0116 0v5"
}));
const BoltIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2.4",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M26 4L10 28h12l-2 16 16-24H24z"
}));
const PlayIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, /*#__PURE__*/React.createElement("path", {
  d: "M8 5v14l11-7z"
}));
const BellIcon = () => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, /*#__PURE__*/React.createElement("path", {
  d: "M12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22zm7-6v-5a7 7 0 10-14 0v5l-2 2v1h18v-1z"
}));

/* ---------- lower third (ALPHA) ---------- */
function LowerThird({
  skin
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o-lt anim-slide"
  }, /*#__PURE__*/React.createElement("div", {
    className: "br"
  }), /*#__PURE__*/React.createElement("div", {
    className: "bd"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, "01", /*#__PURE__*/React.createElement("span", {
    className: "s"
  }, "/")), /*#__PURE__*/React.createElement("div", {
    className: "tx"
  }, /*#__PURE__*/React.createElement("div", {
    className: "k"
  }, skin.kicker || 'CHAPTER'), /*#__PURE__*/React.createElement("div", {
    className: "t"
  }, skin.ltTitle || 'Getting Started')))));
}

/* ---------- number pop (ALPHA) ---------- */
function NumberPop({
  skin
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o-np"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ic anim-pop"
  }, /*#__PURE__*/React.createElement(ShieldIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: "num anim-pop",
    style: {
      animationDelay: '.12s'
    }
  }, skin.num || '100', /*#__PURE__*/React.createElement("span", {
    className: "u"
  }, skin.unit || '%')), /*#__PURE__*/React.createElement("div", {
    className: "chip anim-rise",
    style: {
      animationDelay: '.28s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), skin.npLabel || 'SECURE')));
}

/* ---------- explainer (SOLID, 3 items) ---------- */
function Explainer({
  skin
}) {
  const items = [{
    n: '01',
    Icon: BoltIcon,
    h: skin.ex1 || 'Fast'
  }, {
    n: '02',
    Icon: ShieldIcon,
    h: skin.ex2 || 'Private'
  }, {
    n: '03',
    Icon: LockIcon,
    h: skin.ex3 || 'Secure'
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o-ex"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    className: "item anim-rise",
    key: it.n,
    style: {
      animationDelay: i * 0.3 + 's'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "badge"
  }, /*#__PURE__*/React.createElement(it.Icon, null)), /*#__PURE__*/React.createElement("div", {
    className: "label"
  }, /*#__PURE__*/React.createElement("div", {
    className: "n"
  }, it.n), /*#__PURE__*/React.createElement("div", {
    className: "h"
  }, it.h))))));
}

/* ---------- cta end card (SOLID) ---------- */
function CTA({
  skin
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mark anim-pop"
  }, /*#__PURE__*/React.createElement("img", {
    src: skin.markLogo || '../../assets/Logos/MeticsMedia/icon_black.png',
    alt: ""
  })), /*#__PURE__*/React.createElement("div", {
    className: "head anim-rise",
    style: {
      animationDelay: '.18s'
    }
  }, skin.ctaHead || 'Subscribe'), /*#__PURE__*/React.createElement("div", {
    className: "btn anim-rise",
    style: {
      animationDelay: '.34s'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "arr"
  }), skin.ctaBtn || 'SUBSCRIBE')));
}

/* ---------- cta bar (ALPHA bottom overlay) ---------- */
function CTABar({
  skin
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stage1080"
  }, /*#__PURE__*/React.createElement("div", {
    className: "o-ctabar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bar anim-rise"
  }, skin.ctaBarLink || 'meticsmedia.com/coveron-QQH')));
}
window.Overlays = {
  LowerThird,
  NumberPop,
  Explainer,
  CTA,
  CTABar
};
window.OverlayIcons = {
  ChartIcon,
  ShieldIcon,
  LockIcon,
  BoltIcon,
  PlayIcon,
  BellIcon
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/motion-overlays/overlays.jsx", error: String((e && e.message) || e) }); }

})();
