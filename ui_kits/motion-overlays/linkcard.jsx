/* ============================================================================
   LINK-ON-SCREEN — the "link on screen" archetype as a realistic YouTube
   watch-page UI (SOLID, full-frame). Recreated from reference/youtube-watchpage
   -reference.png. The affiliate line highlights + a cursor glides to the link.
   YouTube UI uses Roboto; the highlight uses the brand --accent.
   ============================================================================ */

function LinkOnScreen({ skin }) {
  const { BellIcon } = window.OverlayIcons;
  return (
    <div className="stage1080">
      <div className="yt-page-bg" />
      <div className="yt">
        <div className="yt-title">{skin.videoTitle || 'Coveron Review: Is It the Best Identity Theft Protection?'}</div>
        <div className="yt-row">
          <div className="yt-chan">
            <div className="yt-av">
              <img className="av-dark" src="../../assets/Logos/MeticsMedia/icon_white.png" alt="Metics" />
              <img className="av-light" src="../../assets/Logos/MeticsMedia/icon_black.png" alt="Metics" />
            </div>
            <div className="yt-cmeta">
              <div className="yt-name">Metics Media
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#717171" /><path d="M10.1 15.2l-2.9-2.9 1.25-1.25 1.65 1.65 4.4-4.4 1.25 1.25z" fill="#fff" /></svg>
              </div>
              <div className="yt-subs">600K subscribers</div>
            </div>
            <div className="yt-bell"><BellIcon /><span>Subscribed</span></div>
          </div>
          <div className="yt-actions">
            <div className="yt-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zM23 10a2 2 0 00-2-2h-6.3l1-4.6V3a1.5 1.5 0 00-1.5-1.5L7 9v12h11a2 2 0 002-1.7l1.9-7.3z" /></svg>1.3K</div>
            <div className="yt-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9V5l7 7-7 7v-4C7 14 4 19 4 19c0-7 3-10 10-10z" /></svg>Share</div>
            <div className="yt-btn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 16l-6-6h4V4h4v6h4l-6 6zM4 18h16v2H4z" /></svg>Download</div>
          </div>
        </div>
        <div className="yt-desc">
          <div className="yt-views">52,847 views</div>
          <div className="yt-aff">
            <div className="yt-hl" />
            <img className="yt-check" src="../../assets/Emojis/white_check_mark.png" alt="check" />
            <span><b>{skin.offer || 'Coveron (Exclusive Discount):'}</b> <span className="yt-lnk">{skin.link || 'https://meticsmedia.com/coveron-QQH'}</span></span>
          </div>
        </div>
        <svg className="yt-cursor" viewBox="0 0 24 24" fill="#FFFFFF" stroke="#000" strokeWidth="0.8"><path d="M4 2l16 9-7 1.5L9 20 4 2z" /></svg>
      </div>
    </div>
  );
}

window.LinkOnScreen = LinkOnScreen;
