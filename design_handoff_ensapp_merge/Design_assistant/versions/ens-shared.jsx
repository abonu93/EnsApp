// ens-shared.jsx — shared scaffold for the 5 Home+Chat directions
// Phone frame, trial data, mini icons, typing dots. Exposed on window.
const { useState, useEffect, useRef } = React;

// Real Eligo trial data (mirrors the prototype catalog)
const VTRIALS = [
  { id: 'WeTrust', cat: 'isch', status: 'active', label: 'Imaging / workflow', win: '< 6 h',  nihss: '≥ 10' },
  { id: 'MOSTE',   cat: 'isch', status: 'active', label: 'EVT strategy',        win: '< 23 h', nihss: '0–5' },
  { id: 'ATHENA',  cat: 'isch', status: 'paused', label: 'EVT device',          win: '< 24 h', nihss: '≥ 8' },
  { id: 'PIVOTAL', cat: 'isch', status: 'active', label: 'EVT aspiration',      win: '< 8 h',  nihss: '≥ 6' },
  { id: 'PROMISE', cat: 'post', status: 'active', label: 'Post-acute recovery', win: '< 7 d',  nihss: 'any' },
  { id: 'STITCH',  cat: 'hemo', status: 'paused', label: 'Hematoma evacuation', win: '< 72 h', nihss: 'any' },
];

const CAT_LABEL = { isch: 'Ischemic', hemo: 'Hemorrhagic', post: 'Post-acute' };

// Phone frame — bezel-less, soft, fits a DCArtboard. Children fill it.
function Phone({ bg, children, statusColor = 'rgba(255,255,255,.92)' }) {
  return (
    <div style={{ width: 360, height: 760, borderRadius: 38, overflow: 'hidden', position: 'relative', background: bg, boxShadow: '0 30px 60px rgba(15,33,42,.18), 0 0 0 1px rgba(15,33,42,.06)' }}>
      {/* status bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', zIndex: 60, fontSize: 13, fontWeight: 600, color: statusColor, fontFamily: "'IBM Plex Sans', sans-serif", pointerEvents: 'none' }}>
        <span>9:41</span>
        <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill="none"><rect x="0.5" y="3" width="2.5" height="8" rx="1" fill="currentColor"/><rect x="4.5" y="1.5" width="2.5" height="9.5" rx="1" fill="currentColor"/><rect x="8.5" y="0" width="2.5" height="11" rx="1" fill="currentColor" opacity=".5"/><rect x="12.5" y="0" width="2.5" height="11" rx="1" fill="currentColor" opacity=".25"/></svg>
          <svg width="22" height="11" viewBox="0 0 22 11" fill="none"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="13" height="7" rx="1.2" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="4" rx="0.75" fill="currentColor" opacity=".5"/></svg>
        </span>
      </div>
      {children}
      {/* home indicator */}
      <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 120, height: 5, borderRadius: 100, background: 'rgba(127,151,163,.4)', zIndex: 60 }} />
    </div>
  );
}

// Eligo glyph (the "E" mark used in the app) — pass color + size
function EligoMark({ size = 18, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M6 5h12M6 5v14M6 12h9M6 19h12" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SendArrow({ size = 18, color = '#fff', sw = 2.2 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M5 12h13M12 5l7 7-7 7" stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SparkIcon({ size = 16, color = '#fff' }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6z" fill={color} /><path d="M18.5 4.5l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" fill={color} opacity=".7" /></svg>;
}

// Animated typing dots — color configurable
function TypingDots({ color }) {
  return (
    <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: color, animation: `ens-dot 1.1s ${i * 0.16}s infinite ease-in-out` }} />)}
    </span>
  );
}

// inject shared keyframes once
(function () {
  if (document.getElementById('ens-v-css')) return;
  const s = document.createElement('style');
  s.id = 'ens-v-css';
  s.textContent = `
    @keyframes ens-dot { 0%,70%,100% { opacity:.3; transform:translateY(0) } 35% { opacity:1; transform:translateY(-3px) } }
    @keyframes ens-orb { 0%,100% { transform:scale(1); opacity:.9 } 50% { transform:scale(1.08); opacity:1 } }
    @keyframes ens-spin { to { transform:rotate(360deg) } }
    @keyframes ens-float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-10px) } }
    @keyframes ens-shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
    @keyframes ens-wave { 0%,100% { transform:scaleY(.4) } 50% { transform:scaleY(1) } }
    @keyframes ens-pulse-ring { 0% { transform:scale(.8); opacity:.6 } 100% { transform:scale(1.6); opacity:0 } }
    .ens-press { transition: transform .12s ease; }
    .ens-press:active { transform: scale(.97); }
  `;
  document.head.appendChild(s);
})();

Object.assign(window, { VTRIALS, CAT_LABEL, Phone, EligoMark, SendArrow, SparkIcon, TypingDots });
