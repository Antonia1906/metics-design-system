/* ============================================================================
   APP — the Brand Skin Studio. Demonstrates the system's core idea: constant
   structure + motion, swappable brand skin (accent + font, light/dark mood).
   Pick an archetype, a house style, and a product skin; the overlay re-skins
   live over a mock talking-head frame.

   NOTE: this is a showcase recreation (CSS entrances). The RENDER-SAFE clips
   (vanilla JS, t-driven, 4K ProRes) live in ../../animation-kit + ../../examples.
   ============================================================================ */
const { useState, useRef, useLayoutEffect, useEffect } = React;

/* ---- house styles: mood = bg + fonts + base text ---- */
const HOUSES = {
  light: {
    name: 'Light', sub: 'warm',
    vars: {
      '--bg-dark': '#14161B', '--bg-light': '#F4F2EC',
      '--text-on-dark': '#FFFFFF', '--text-on-light': '#14161B',
      '--muted-on-dark': 'rgba(255,255,255,0.52)',
      '--chip-bg': 'rgba(255,255,255,0.08)', '--chip-border': 'rgba(255,255,255,0.16)',
      '--font-display': "'Manrope',system-ui,sans-serif",
      '--font-body': "'Manrope',system-ui,sans-serif",
      '--font-mono': "'JetBrains Mono',ui-monospace,monospace",
    },
    accent2: '#F2A65A',
  },
  dark: {
    name: 'Dark', sub: 'cinematic',
    vars: {
      '--bg-dark': '#0A0C12', '--bg-light': '#F4F6FB',
      '--text-on-dark': '#EEF2FB', '--text-on-light': '#10141C',
      '--muted-on-dark': 'rgba(238,242,251,0.60)',
      '--chip-bg': 'rgba(255,255,255,0.08)', '--chip-border': 'rgba(255,255,255,0.14)',
      '--font-display': "'Instrument Serif',Georgia,serif",
      '--font-body': "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      '--font-mono': "'JetBrains Mono',ui-monospace,monospace",
    },
    accent2: '#9BD1FF',
  },
};

/* ---- product skins: accent (+ deep) + a CTA mark logo ---- */
const SKINS = [
  { id: 'coveron',  name: 'Coveron',  accent: '#FB411C', deep: '#9E270F', mark: '../../assets/Logos/MeticsMedia/icon_black.png' },
  { id: 'claude',   name: 'Claude',   accent: '#D97757', deep: '#A8552F', mark: '../../assets/Logos/Claude/Claude_AI_symbol.png' },
  { id: 'stripe',   name: 'Stripe',   accent: '#635BFF', deep: '#4239C8', mark: '../../assets/Logos/MeticsMedia/icon_black.png' },
  { id: 'telegram', name: 'Telegram', accent: '#2AABEE', deep: '#1E87BE', mark: '../../assets/Logos/Telegram/Telegram_logo.png' },
  { id: 'docker',   name: 'Docker',   accent: '#2496ED', deep: '#1B6FB3', mark: '../../assets/Logos/Docker/docker_icon.png' },
  { id: 'cursor',   name: 'Cursor',   accent: '#6B7280', deep: '#454B54', mark: '../../assets/Logos/Cursor/Cursor_logo.png' },
];

/* ---- archetypes ---- */
const { ChartIcon, ShieldIcon, BoltIcon, PlayIcon } = window.OverlayIcons;
const ARCHETYPES = [
  { id: 'lower-third',    name: 'Lower-third',    sub: 'ALPHA · ~4s',   Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="15" width="14" height="5" rx="1"/><path d="M3 15v5"/></svg>) },
  { id: 'number-pop',     name: 'Number-pop',     sub: 'ALPHA · ~6s',   Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 7h3v10M7 17h7"/><circle cx="17" cy="8" r="2"/></svg>) },
  { id: 'explainer',      name: 'Explainer',      sub: 'multi-beat',    Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="6" cy="7" r="2"/><path d="M11 7h8M11 12h8M11 17h8"/><circle cx="6" cy="12" r="2"/><circle cx="6" cy="17" r="2"/></svg>) },
  { id: 'cta',            name: 'CTA end-card',   sub: 'SOLID · ~8s',   Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>) },
  { id: 'cta-bar',        name: 'Link CTA bar',   sub: 'ALPHA · bottom', Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="9" width="18" height="6" rx="3"/><path d="M8 12h8"/></svg>) },
  { id: 'yt-description', name: 'YT Description', sub: 'SOLID · full UI', Icon: () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 15l6-6M8 13l-2 2a3 3 0 104 4l2-2M16 11l2-2a3 3 0 10-4-4l-2 2"/></svg>) },
];

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
    '--ease-back': 'cubic-bezier(.34,1.56,.64,1)',
  };

  /* scale the 1920×1080 stage into the frame */
  const frameRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  useLayoutEffect(() => {
    const fit = () => { if (frameRef.current) setScale(frameRef.current.clientWidth / 1920); };
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
    return () => { cancelAnimationFrame(r); clearTimeout(id); };
  }, [arch, house, skinId]);

  const replay = () => {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
    setTimeout(() => setPlaying(false), 1600);
  };

  const skinData = { ...skin, markLogo: skin.mark };
  const O = window.Overlays;

  let content = null;
  if (arch === 'lower-third') content = <O.LowerThird skin={skinData} />;
  else if (arch === 'number-pop') content = <O.NumberPop skin={skinData} />;
  else if (arch === 'explainer') content = <O.Explainer skin={skinData} />;
  else if (arch === 'cta') content = <O.CTA skin={skinData} />;
  else if (arch === 'cta-bar') content = <O.CTABar skin={skinData} />;
  else if (arch === 'yt-description') content = <window.LinkOnScreen skin={skinData} />;

  return (
    <React.Fragment>
      <div className="topbar">
        <div className="brand"><img src="../../assets/Logos/MeticsMedia/mm_white.png" alt="Metics Media" /></div>
        <div className="tag">Motion Overlays — Brand Skin Studio</div>
        <div className="spacer" />
        <div className="replay" onClick={replay}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.3L3 8"/><path d="M3 3v5h5"/></svg>
          Replay
        </div>
      </div>

      <div className="main">
        <div className="stage-col">
          <div className="frame" ref={frameRef} data-mode={mode} data-house={house} style={{ ...tokenVars }}>
            <div className="footage">
              <div className="ftag"><span className="rec" />REC · talking-head footage</div>
              <div className="silhouette" />
            </div>
            <div className="atmos"><div className="bgfill" /><div className="backlight" /><div className="grid" /><div className="vig" /></div>
            <div className="mode-badge">{mode === 'solid' ? 'SOLID · full-frame' : 'ALPHA · overlay'}</div>
            <div className="overlay-stage">
              <div className={'play-wrap' + (playing ? ' playing' : '')} style={{ position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})`, width: 1920, height: 1080 }}>
                {content}
              </div>
            </div>
          </div>
        </div>

        <div className="controls" style={{ '--ui-accent': skin.accent }}>
          <div className="csec">
            <div className="clabel">Archetype</div>
            <div className="rail">
              {ARCHETYPES.map(a => (
                <div key={a.id} className={'item' + (arch === a.id ? ' active' : '')} onClick={() => setArch(a.id)}>
                  <div className="ico"><a.Icon /></div>
                  <div className="meta"><div className="nm">{a.name}</div><div className="sub">{a.sub}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="csec">
            <div className="clabel">House style</div>
            <div className="seg">
              {Object.keys(HOUSES).map(h => (
                <button key={h} className={house === h ? 'on' : ''} onClick={() => setHouse(h)}>{HOUSES[h].name} <span style={{opacity:.5,fontWeight:400}}>/ {HOUSES[h].sub}</span></button>
              ))}
            </div>
          </div>

          <div className="csec">
            <div className="clabel">Brand skin — accent swaps per product</div>
            <div className="skins">
              {SKINS.map(s => (
                <div key={s.id} className={'skin' + (skinId === s.id ? ' on' : '')} onClick={() => setSkinId(s.id)}>
                  <div className="dot" style={{ background: s.accent }} />
                  <div><div className="nm">{s.name}</div><div className="ft">{s.accent}</div></div>
                </div>
              ))}
            </div>
          </div>

          <div className="hint">
            <b>Constant system, swappable skin.</b> Structure, motion, and safe zones stay fixed — only the accent + font change per video to match the product under review. These are showcase recreations; the render-safe clips (vanilla JS, t-driven, 4K ProRes) live in <b>animation-kit/</b> + <b>examples/</b>.
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

/* hex → rgba string */
function hexA(hex, a) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
