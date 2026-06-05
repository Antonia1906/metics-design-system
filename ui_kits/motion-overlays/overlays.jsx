/* ============================================================================
   OVERLAYS — the five archetypes as React components (showcase recreations).
   Each returns the on-stage DOM that studio.css styles. The `playKey` prop is
   used by App to remount + replay the CSS entrance. Icons are simple geometric
   inline SVG (generic concepts); product marks use real logo <img> files.
   ============================================================================ */

const ChartIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 32l10-10 8 7 12-15" /><path d="M30 14h8v8" />
  </svg>
);
const ShieldIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M24 5l15 6v11c0 10-6.4 16.6-15 21-8.6-4.4-15-11-15-21V11z" /><path d="M16 24l6 6 11-12" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="10" y="21" width="28" height="20" rx="4" /><path d="M16 21v-5a8 8 0 0116 0v5" />
  </svg>
);
const BoltIcon = () => (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M26 4L10 28h12l-2 16 16-24H24z" />
  </svg>
);
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 22zm7-6v-5a7 7 0 10-14 0v5l-2 2v1h18v-1z" />
  </svg>
);

/* ---------- lower third (ALPHA) ---------- */
function LowerThird({ skin }) {
  return (
    <div className="stage1080">
      <div className="o-lt anim-slide">
        <div className="br" />
        <div className="bd">
          <div className="num">01<span className="s">/</span></div>
          <div className="tx">
            <div className="k">{skin.kicker || 'CHAPTER'}</div>
            <div className="t">{skin.ltTitle || 'Getting Started'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- number pop (ALPHA) ---------- */
function NumberPop({ skin }) {
  return (
    <div className="stage1080">
      <div className="o-np">
        <div className="ic anim-pop"><ShieldIcon /></div>
        <div className="num anim-pop" style={{ animationDelay: '.12s' }}>{skin.num || '100'}<span className="u">{skin.unit || '%'}</span></div>
        <div className="chip anim-rise" style={{ animationDelay: '.28s' }}><span className="dot" />{skin.npLabel || 'SECURE'}</div>
      </div>
    </div>
  );
}

/* ---------- explainer (SOLID, 3 items) ---------- */
function Explainer({ skin }) {
  const items = [
    { n: '01', Icon: BoltIcon, h: skin.ex1 || 'Fast' },
    { n: '02', Icon: ShieldIcon, h: skin.ex2 || 'Private' },
    { n: '03', Icon: LockIcon, h: skin.ex3 || 'Secure' },
  ];
  return (
    <div className="stage1080">
      <div className="o-ex">
        {items.map((it, i) => (
          <div className="item anim-rise" key={it.n} style={{ animationDelay: (i * 0.3) + 's' }}>
            <div className="badge"><it.Icon /></div>
            <div className="label"><div className="n">{it.n}</div><div className="h">{it.h}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- cta end card (SOLID) ---------- */
function CTA({ skin }) {
  return (
    <div className="stage1080">
      <div className="o-cta">
        <div className="mark anim-pop"><img src={skin.markLogo || '../../assets/Logos/MeticsMedia/icon_black.png'} alt="" /></div>
        <div className="head anim-rise" style={{ animationDelay: '.18s' }}>{skin.ctaHead || 'Subscribe'}</div>
        <div className="btn anim-rise" style={{ animationDelay: '.34s' }}><span className="arr" />{skin.ctaBtn || 'SUBSCRIBE'}</div>
      </div>
    </div>
  );
}

/* ---------- cta bar (ALPHA bottom overlay) ---------- */
function CTABar({ skin }) {
  return (
    <div className="stage1080">
      <div className="o-ctabar">
        <div className="bar anim-rise">{skin.ctaBarLink || 'meticsmedia.com/coveron-QQH'}</div>
      </div>
    </div>
  );
}

window.Overlays = { LowerThird, NumberPop, Explainer, CTA, CTABar };
window.OverlayIcons = { ChartIcon, ShieldIcon, LockIcon, BoltIcon, PlayIcon, BellIcon };
