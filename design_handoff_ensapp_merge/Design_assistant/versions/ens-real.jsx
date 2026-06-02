// ens-real.jsx — real Eligo style scaffold for the 5 Home integrations
// Exact app tokens, logo glyph, phone frame, header, tab bar. Exposed on window.

const ENSR = {
  bg: '#EFF5F8', bgSunken: '#E5EFF4', surface: '#FFFFFF', surface2: '#F7FAFC',
  line: '#DBEBF1', lineSoft: '#E9F1F5',
  ink: '#0F212A', ink2: '#44606E', ink3: '#7F97A3',
  primary: '#4F8FBC', primaryDk: '#1C4E6C', primaryBg: '#E5F1F8',
  okFg: '#2E9E7B', okBg: '#E4F4EE',
  sans: "'IBM Plex Sans', -apple-system, system-ui, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, monospace",
  display: "'Hanken Grotesk', sans-serif",
};
const softShadowR = '0 1px 2px rgba(16,24,40,.04), 0 6px 20px rgba(16,24,40,.06)';
const heroShadowR = '0 8px 22px rgba(28,78,108,.28)';

// exact icon glyphs lifted from the app
const IR = {
  logo: (s = 24, c = '#fff') => (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none">
      <path d="M12 7.45 A5.25 5.25 0 0 1 12 16.55 A5.25 5.25 0 0 1 12 7.45 Z" fill={c} fillOpacity="0.92" />
      <circle cx="9.375" cy="12" r="5.25" stroke={c} strokeWidth="2.4" />
      <circle cx="14.625" cy="12" r="5.25" stroke={c} strokeWidth="2.4" />
    </svg>
  ),
  plus: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>,
  person: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke={c} strokeWidth="1.8" /><path d="M5.5 19.5a6.5 6.5 0 0113 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" /></svg>,
  stetho: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 3v5a4 4 0 008 0V3" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><path d="M10 16v1a4 4 0 008 0v-2" stroke={c} strokeWidth="1.8" strokeLinecap="round" /><circle cx="18" cy="11.5" r="2.2" stroke={c} strokeWidth="1.8" /></svg>,
  book: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 5.5A2 2 0 016 4h6v15H6a2 2 0 00-2 1.5V5.5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /><path d="M20 5.5A2 2 0 0018 4h-6v15h6a2 2 0 012 1.5V5.5z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /></svg>,
  list: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke={c} strokeWidth="1.9" strokeLinecap="round" /></svg>,
  home: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 11l8-6.5 8 6.5" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 10v9h12v-9" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  chat: (c) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-7l-4 3v-3H6a2 2 0 01-2-2z" stroke={c} strokeWidth="1.7" strokeLinejoin="round" /><circle cx="9" cy="10" r="1.05" fill={c} /><circle cx="12.5" cy="10" r="1.05" fill={c} /><circle cx="16" cy="10" r="1.05" fill={c} /></svg>,
  chev: (c, s = 16) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  send: (c, s = 17) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 5l7 7-7 7" stroke={c} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

// Logo tile (glacier gradient rounded square + glyph) — the chat avatar
function LogoTile({ size = 31, radius = 9, glyph = 19 }) {
  return <span style={{ flexShrink: 0, width: size, height: size, borderRadius: radius, background: `linear-gradient(150deg, ${ENSR.primary}, ${ENSR.primaryDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(13,32,80,.25)' }}>{IR.logo(glyph)}</span>;
}

function RealPhone({ children }) {
  return (
    <div style={{ width: 360, height: 780, borderRadius: 40, overflow: 'hidden', position: 'relative', background: ENSR.bg, boxShadow: '0 30px 60px rgba(15,33,42,.18), 0 0 0 1px rgba(15,33,42,.06)', fontFamily: ENSR.sans, color: ENSR.ink }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', zIndex: 60, fontSize: 13, fontWeight: 600, color: ENSR.ink2, pointerEvents: 'none' }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0.5" y="3" width="2.5" height="8" rx="1" fill="currentColor"/><rect x="4.5" y="1.5" width="2.5" height="9.5" rx="1" fill="currentColor"/><rect x="8.5" y="0" width="2.5" height="11" rx="1" fill="currentColor" opacity=".5"/><rect x="12.5" y="0" width="2.5" height="11" rx="1" fill="currentColor" opacity=".25"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="13" height="7" rx="1.2" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity=".5"/></svg>
        </span>
      </div>
      {children}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 120, height: 5, borderRadius: 100, background: 'rgba(127,151,163,.4)', zIndex: 60 }} />
    </div>
  );
}

function RealHeader() {
  return (
    <div style={{ paddingTop: 50, paddingLeft: 24, paddingRight: 20, paddingBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{ width: 26, height: 26, borderRadius: 8, background: ENSR.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IR.logo(17)}</div>
        <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5, fontFamily: ENSR.display }}>Eligo</span>
      </div>
      <span style={{ color: ENSR.ink3, fontSize: 12.5, fontWeight: 600, fontFamily: ENSR.mono, letterSpacing: 0.3, padding: 6 }}>EN</span>
    </div>
  );
}

function RealTabBar({ active = 'assistant' }) {
  const items = [['home', IR.home, 'Home'], ['new', IR.plus, 'New'], ['trials', IR.list, 'Trials'], ['assistant', IR.chat, 'Assistant']];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', paddingBottom: 24, paddingTop: 6 }}>
      <div style={{ display: 'flex', gap: 4, background: ENSR.surface, borderRadius: 999, padding: 6, boxShadow: '0 2px 8px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.05)' }}>
        {items.map(([k, icon, label]) => {
          const on = k === active;
          return (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: on ? '9px 16px' : '9px 13px', borderRadius: 999, background: on ? ENSR.primary : 'transparent' }}>
              {icon(on ? '#fff' : ENSR.ink3)}
              {on && <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{label}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// suggestion chip
function Chip({ children, solid }) {
  return <span style={{ fontSize: 12.5, fontWeight: 500, color: solid ? '#fff' : ENSR.primary, background: solid ? 'rgba(255,255,255,.18)' : ENSR.primaryBg, borderRadius: 999, padding: '7px 12px', whiteSpace: 'nowrap' }}>{children}</span>;
}

const SUGG = ['Active trials', 'Hemorrhagic options', "MOSTE's window"];

Object.assign(window, { ENSR, softShadowR, heroShadowR, IR, LogoTile, RealPhone, RealHeader, RealTabBar, Chip, SUGG });
