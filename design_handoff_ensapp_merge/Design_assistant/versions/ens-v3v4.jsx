// ens-v3v4.jsx — V3 Bento Spatial (light) + V4 Neon Pulse (dark orb)
// Exposes: V3Home, V3Chat, V4Home, V4Chat

/* ─────────────────────────── V3 · BENTO SPATIAL ─────────────────────────── */
const BEN = {
  bg: '#EEF3F6', surface: '#FFFFFF', ink: '#0F212A', ink2: '#44606E', ink3: '#88A0AC',
  line: '#E2EBF0', glacier: '#3E83B0', glacierDk: '#1C4E6C', glacierBg: '#E6F1F8',
  mint: '#2E9E7B', mintBg: '#E2F3EC', amber: '#B5832C', amberBg: '#F6EEDC',
  sans: "'IBM Plex Sans', sans-serif", display: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace",
};
const benShadow = '0 1px 2px rgba(15,33,42,.05), 0 8px 22px rgba(15,33,42,.06)';

function V3Home() {
  const active = VTRIALS.filter((t) => t.status === 'active');
  return (
    <Phone bg={BEN.bg} statusColor={BEN.ink2}>
      <div style={{ position: 'absolute', inset: 0, paddingTop: 50, display: 'flex', flexDirection: 'column', fontFamily: BEN.sans, color: BEN.ink }}>
        <div style={{ padding: '4px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, color: BEN.ink3 }}>Tuesday, June 2</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: BEN.display, letterSpacing: -0.5 }}>Hello, Dr. Reyes</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 14, background: BEN.surface, boxShadow: benShadow, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EligoMark size={19} color={BEN.glacier} /></div>
        </div>

        {/* bento grid */}
        <div style={{ flex: 1, padding: '18px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gridAutoRows: 'min-content', gap: 12 }}>
          {/* hero assistant tile — spans 2 cols */}
          <div style={{ gridColumn: '1 / 3', borderRadius: 24, padding: 18, background: `linear-gradient(145deg, ${BEN.glacier}, ${BEN.glacierDk})`, color: '#fff', boxShadow: '0 12px 28px rgba(28,78,108,.32)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -30, right: -20, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, color: 'rgba(255,255,255,.85)' }}><SparkIcon size={15} /> Assistant</div>
            <div style={{ fontSize: 19, fontWeight: 700, fontFamily: BEN.display, marginTop: 10, lineHeight: 1.2, letterSpacing: -0.3 }}>Ask anything about<br/>the 6 trials</div>
            <div style={{ marginTop: 14, background: 'rgba(255,255,255,.16)', borderRadius: 14, padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(6px)' }}>
              <span style={{ flex: 1, fontSize: 13.5, color: 'rgba(255,255,255,.8)' }}>Type a question…</span>
              <div style={{ width: 30, height: 30, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SendArrow size={15} color={BEN.glacier} /></div>
            </div>
          </div>

          {/* stat tiles */}
          <div style={{ borderRadius: 20, padding: 16, background: BEN.surface, boxShadow: benShadow }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: BEN.display, color: BEN.mint }}>{active.length}</div>
            <div style={{ fontSize: 12.5, color: BEN.ink2, marginTop: 2 }}>Enrolling now</div>
          </div>
          <div style={{ borderRadius: 20, padding: 16, background: BEN.surface, boxShadow: benShadow }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: BEN.display, color: BEN.glacier }}>{VTRIALS.length}</div>
            <div style={{ fontSize: 12.5, color: BEN.ink2, marginTop: 2 }}>Total trials</div>
          </div>

          {/* quick prompt tile spanning 2 */}
          <div style={{ gridColumn: '1 / 3', borderRadius: 20, padding: '14px 16px', background: BEN.surface, boxShadow: benShadow }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: BEN.ink3, textTransform: 'uppercase', letterSpacing: .5 }}>Quick ask</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {['Active trials', 'Hemorrhagic', "MOSTE's window", 'NIHSS ≥ 10'].map((s) => (
                <span key={s} style={{ fontSize: 12.5, fontWeight: 500, color: BEN.glacier, background: BEN.glacierBg, borderRadius: 999, padding: '7px 12px' }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* nav */}
        <div style={{ padding: '14px 16px 26px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: BEN.surface, borderRadius: 999, padding: 6, boxShadow: benShadow }}>
            {[['Home', false], ['New', false], ['Trials', false], ['Assistant', true]].map(([l, on]) => (
              <span key={l} style={{ fontSize: 13, fontWeight: 600, padding: on ? '9px 16px' : '9px 13px', borderRadius: 999, color: on ? '#fff' : BEN.ink3, background: on ? BEN.glacier : 'transparent' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

function V3Chat() {
  return (
    <Phone bg={BEN.bg} statusColor={BEN.ink2}>
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column', fontFamily: BEN.sans, color: BEN.ink }}>
        <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: `linear-gradient(145deg, ${BEN.glacier}, ${BEN.glacierDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(28,78,108,.3)' }}><SparkIcon size={17} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, fontFamily: BEN.display }}>Assistant</div>
            <div style={{ fontSize: 11.5, color: BEN.mint }}>● Knows all 6 trials</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: BEN.glacier, color: '#fff', borderRadius: 20, borderBottomRightRadius: 7, padding: '11px 15px', fontSize: 14.5, boxShadow: '0 6px 16px rgba(62,131,176,.3)' }}>What's MOSTE's time window?</div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            <div style={{ background: BEN.surface, borderRadius: 20, borderBottomLeftRadius: 7, padding: '13px 16px', fontSize: 14.5, lineHeight: 1.5, boxShadow: benShadow }}>MOSTE's time window is <b style={{ color: BEN.glacier }}>&lt; 23 h</b>. It's an EVT-strategy trial, currently enrolling, with NIHSS 0–5.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontFamily: BEN.mono, fontWeight: 600, color: BEN.glacier, background: BEN.surface, borderRadius: 999, padding: '6px 11px', boxShadow: benShadow }}><span style={{ width: 6, height: 6, borderRadius: 999, background: BEN.glacier }} />MOSTE →</span>
            </div>
          </div>
          <div style={{ alignSelf: 'flex-start', background: BEN.surface, borderRadius: 20, borderBottomLeftRadius: 7, padding: '15px 18px', boxShadow: benShadow }}><TypingDots color={BEN.glacier} /></div>
        </div>

        <div style={{ padding: '10px 16px 30px' }}>
          <div style={{ background: BEN.surface, borderRadius: 22, padding: 6, display: 'flex', alignItems: 'center', gap: 8, boxShadow: benShadow }}>
            <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: BEN.ink3 }}>Ask a question…</span>
            <div style={{ width: 40, height: 40, borderRadius: 16, background: BEN.glacier, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SendArrow size={18} /></div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

/* ─────────────────────────── V4 · NEON PULSE ─────────────────────────── */
const NEO = {
  bg: '#070B14', panel: 'rgba(124,138,255,.07)', bd: 'rgba(124,138,255,.18)',
  ink: '#E8ECFF', ink2: 'rgba(232,236,255,.6)', ink3: 'rgba(232,236,255,.38)',
  cyan: '#39E0F0', violet: '#8B7CFF', mint: '#39E0A0',
  sans: "'IBM Plex Sans', sans-serif", display: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace",
};

function NeoOrb({ size = 88 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `1.5px solid ${NEO.cyan}`, animation: 'ens-pulse-ring 2.4s ease-out infinite' }} />
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `1.5px solid ${NEO.violet}`, animation: 'ens-pulse-ring 2.4s .8s ease-out infinite' }} />
      <div style={{ width: size * 0.62, height: size * 0.62, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${NEO.cyan}, ${NEO.violet})`, boxShadow: `0 0 28px ${NEO.violet}, 0 0 12px ${NEO.cyan}`, animation: 'ens-orb 3s ease-in-out infinite', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SparkIcon size={size * 0.26} /></div>
    </div>
  );
}

function Waveform({ color, n = 22 }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, height: 22 }}>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} style={{ width: 2.5, height: 16, borderRadius: 999, background: color, transformOrigin: 'center', animation: `ens-wave ${0.7 + (i % 5) * 0.12}s ${i * 0.05}s ease-in-out infinite`, opacity: .85 }} />
      ))}
    </span>
  );
}

function V4Home() {
  const active = VTRIALS.filter((t) => t.status === 'active');
  return (
    <Phone bg={NEO.bg}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 50% -10%, rgba(139,124,255,.28), transparent 60%), radial-gradient(90% 50% at 50% 110%, rgba(57,224,240,.16), transparent 60%)`, zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 52, display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: NEO.sans, color: NEO.ink, zIndex: 1 }}>
        <div style={{ width: '100%', padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: NEO.display, fontWeight: 800, fontSize: 19, letterSpacing: -0.5 }}>Eligo</span>
          <span style={{ fontSize: 11, fontFamily: NEO.mono, color: NEO.cyan, border: `1px solid ${NEO.bd}`, borderRadius: 999, padding: '5px 10px' }}>AI · v2</span>
        </div>

        <div style={{ marginTop: 30 }}><NeoOrb size={96} /></div>
        <div style={{ fontSize: 23, fontWeight: 700, fontFamily: NEO.display, marginTop: 22, letterSpacing: -0.4, lineHeight: 1.2 }}>Ask Eligo anything</div>
        <div style={{ fontSize: 13.5, color: NEO.ink2, marginTop: 8, textAlign: 'center', padding: '0 40px', lineHeight: 1.4 }}>Tap to speak, or type a question about the trials</div>

        {/* prompt chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', padding: '22px 28px 0' }}>
          {['Active trials', 'Hemorrhagic options', "MOSTE's window"].map((s) => (
            <span key={s} style={{ fontSize: 12.5, color: NEO.ink, background: NEO.panel, border: `1px solid ${NEO.bd}`, borderRadius: 999, padding: '8px 13px' }}>{s}</span>
          ))}
        </div>

        {/* mini stats */}
        <div style={{ display: 'flex', gap: 22, marginTop: 26 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: NEO.display, color: NEO.mint }}>{active.length}</div>
            <div style={{ fontSize: 11.5, color: NEO.ink3 }}>enrolling</div>
          </div>
          <div style={{ width: 1, background: NEO.bd }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: NEO.display, color: NEO.cyan }}>{VTRIALS.length}</div>
            <div style={{ fontSize: 11.5, color: NEO.ink3 }}>total</div>
          </div>
        </div>

        {/* input dock */}
        <div style={{ marginTop: 'auto', width: '100%', padding: '0 18px 18px' }}>
          <div style={{ background: NEO.panel, border: `1px solid ${NEO.bd}`, borderRadius: 26, padding: 6, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(12px)' }}>
            <span style={{ flex: 1, paddingLeft: 14, fontSize: 14.5, color: NEO.ink3 }}>Message…</span>
            <div style={{ width: 42, height: 42, borderRadius: 20, background: 'rgba(255,255,255,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Waveform color={NEO.cyan} n={5} /></div>
            <div style={{ width: 42, height: 42, borderRadius: 20, background: `linear-gradient(140deg, ${NEO.cyan}, ${NEO.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 18px ${NEO.violet}` }}><SendArrow size={18} /></div>
          </div>
        </div>

        {/* nav */}
        <div style={{ width: '100%', padding: '0 28px 26px', display: 'flex', justifyContent: 'space-around' }}>
          {[['Home', false], ['New', false], ['Trials', false], ['Ask', true]].map(([l, on]) => (
            <span key={l} style={{ fontSize: 12.5, fontWeight: 600, color: on ? NEO.cyan : NEO.ink3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: on ? NEO.cyan : 'transparent', boxShadow: on ? `0 0 10px ${NEO.cyan}` : 'none' }} />{l}
            </span>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function V4Chat() {
  return (
    <Phone bg={NEO.bg}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 60% at 50% -10%, rgba(139,124,255,.22), transparent 60%)`, zIndex: 0 }} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column', fontFamily: NEO.sans, color: NEO.ink, zIndex: 1 }}>
        <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${NEO.bd}` }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: `radial-gradient(circle at 35% 30%, ${NEO.cyan}, ${NEO.violet})`, boxShadow: `0 0 16px ${NEO.violet}`, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ens-orb 3s ease-in-out infinite' }}><SparkIcon size={17} /></div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, fontFamily: NEO.display }}>Eligo</div>
            <div style={{ fontSize: 11.5, color: NEO.mint }}>● listening</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: `linear-gradient(140deg, ${NEO.cyan}, ${NEO.violet})`, color: '#fff', borderRadius: 18, borderBottomRightRadius: 6, padding: '11px 15px', fontSize: 14.5, boxShadow: `0 6px 20px rgba(139,124,255,.45)` }}>Which trials enroll for ischemic stroke?</div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '86%' }}>
            <div style={{ background: NEO.panel, border: `1px solid ${NEO.bd}`, borderRadius: 18, borderBottomLeftRadius: 6, padding: '12px 15px', fontSize: 14.5, lineHeight: 1.5, backdropFilter: 'blur(12px)' }}>Four ischemic trials are enrolling — most are thrombectomy studies with different windows.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 9 }}>
              {['WeTrust', 'MOSTE', 'PIVOTAL'].map((id) => (
                <span key={id} style={{ fontSize: 12, fontFamily: NEO.mono, fontWeight: 600, color: NEO.cyan, border: `1px solid ${NEO.bd}`, background: 'rgba(57,224,240,.08)', borderRadius: 999, padding: '5px 10px', boxShadow: '0 0 12px rgba(57,224,240,.2)' }}>{id}</span>
              ))}
            </div>
          </div>
          <div style={{ alignSelf: 'flex-start', background: NEO.panel, border: `1px solid ${NEO.bd}`, borderRadius: 18, borderBottomLeftRadius: 6, padding: '14px 16px' }}><TypingDots color={NEO.cyan} /></div>
        </div>

        <div style={{ padding: '10px 18px 30px' }}>
          <div style={{ background: NEO.panel, border: `1px solid ${NEO.bd}`, borderRadius: 24, padding: 6, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(12px)' }}>
            <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: NEO.ink3 }}>Message…</span>
            <div style={{ width: 40, height: 40, borderRadius: 18, background: `linear-gradient(140deg, ${NEO.cyan}, ${NEO.violet})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${NEO.violet}` }}><SendArrow size={18} /></div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { V3Home, V3Chat, V4Home, V4Chat });
