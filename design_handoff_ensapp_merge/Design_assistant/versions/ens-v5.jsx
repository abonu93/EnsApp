// ens-v5.jsx — V5 Gradient AI (light, soft gradient + shimmer)
// Exposes: V5Home, V5Chat
const GRA = {
  bg: '#F4F8FB', surface: '#FFFFFF', ink: '#102530', ink2: '#4A6573', ink3: '#8AA1AD',
  line: '#E6EEF3', g1: '#5AA9D8', g2: '#3A6FA8', g3: '#46C2A8',
  mint: '#2E9E7B', amber: '#B5832C',
  sans: "'IBM Plex Sans', sans-serif", display: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace",
};
const graShadow = '0 1px 2px rgba(16,37,48,.05), 0 10px 26px rgba(16,37,48,.07)';
const graGrad = `linear-gradient(135deg, ${GRA.g1} 0%, ${GRA.g2} 55%, ${GRA.g3} 120%)`;

function ShimmerPill({ children }) {
  return (
    <span style={{ position: 'relative', overflow: 'hidden', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 700, fontFamily: GRA.mono, letterSpacing: .4, color: GRA.g2, background: 'rgba(90,169,216,.12)', borderRadius: 999, padding: '5px 11px' }}>
      <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,.7) 50%, transparent 70%)', backgroundSize: '200% 100%', animation: 'ens-shimmer 2.6s linear infinite' }} />
      <SparkIcon size={12} color={GRA.g2} /> AI POWERED
    </span>
  );
}

function V5Home() {
  const active = VTRIALS.filter((t) => t.status === 'active');
  return (
    <Phone bg={GRA.bg} statusColor="#fff">
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: GRA.sans, color: GRA.ink }}>
        {/* gradient hero */}
        <div style={{ background: graGrad, padding: '50px 22px 26px', position: 'relative', overflow: 'hidden', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}>
          <div style={{ position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,.14)' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><EligoMark size={17} /></div>
              <span style={{ fontFamily: GRA.display, fontWeight: 800, fontSize: 18, color: '#fff', letterSpacing: -0.4 }}>Eligo</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, fontFamily: GRA.mono, color: 'rgba(255,255,255,.85)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 8, padding: '4px 8px' }}>EN</span>
          </div>

          <div style={{ position: 'relative', marginTop: 22 }}>
            <ShimmerPill />
            <div style={{ fontSize: 25, fontWeight: 700, color: '#fff', fontFamily: GRA.display, letterSpacing: -0.5, marginTop: 12, lineHeight: 1.18 }}>Your trial<br/>knowledge, instantly</div>
          </div>

          {/* embedded ask field */}
          <div style={{ position: 'relative', marginTop: 20, background: '#fff', borderRadius: 18, padding: 6, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 14px 30px rgba(16,37,48,.22)' }}>
            <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: GRA.ink3 }}>Ask about the trials…</span>
            <div style={{ width: 40, height: 40, borderRadius: 14, background: graGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SendArrow size={18} /></div>
          </div>
        </div>

        {/* body */}
        <div style={{ flex: 1, padding: '20px 18px 0', overflow: 'hidden' }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {['Active trials', 'Hemorrhagic', "MOSTE's window"].map((s) => (
              <span key={s} style={{ fontSize: 12.5, fontWeight: 500, color: GRA.g2, background: GRA.surface, border: `1px solid ${GRA.line}`, borderRadius: 999, padding: '8px 13px', boxShadow: graShadow }}>{s}</span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, borderRadius: 20, padding: 16, background: GRA.surface, boxShadow: graShadow }}>
              <div style={{ fontSize: 29, fontWeight: 700, fontFamily: GRA.display, color: GRA.mint }}>{active.length}</div>
              <div style={{ fontSize: 12.5, color: GRA.ink2, marginTop: 2 }}>Enrolling now</div>
            </div>
            <div style={{ flex: 1, borderRadius: 20, padding: 16, background: GRA.surface, boxShadow: graShadow }}>
              <div style={{ fontSize: 29, fontWeight: 700, fontFamily: GRA.display, color: GRA.g2 }}>{VTRIALS.length}</div>
              <div style={{ fontSize: 12.5, color: GRA.ink2, marginTop: 2 }}>Total trials</div>
            </div>
          </div>
        </div>

        {/* nav */}
        <div style={{ padding: '16px 16px 26px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 4, background: GRA.surface, borderRadius: 999, padding: 6, boxShadow: graShadow }}>
            {[['Home', false], ['New', false], ['Trials', false], ['Assistant', true]].map(([l, on]) => (
              <span key={l} style={{ fontSize: 13, fontWeight: 600, padding: on ? '9px 16px' : '9px 13px', borderRadius: 999, color: on ? '#fff' : GRA.ink3, background: on ? graGrad : 'transparent' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

function V5Chat() {
  return (
    <Phone bg={GRA.bg} statusColor={GRA.ink2}>
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column', fontFamily: GRA.sans, color: GRA.ink }}>
        <div style={{ padding: '10px 18px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: `1px solid ${GRA.line}`, background: GRA.surface }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: graGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SparkIcon size={17} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15.5, fontWeight: 700, fontFamily: GRA.display }}>Assistant</div>
            <div style={{ fontSize: 11.5, color: GRA.mint }}>● Knows all 6 trials</div>
          </div>
          <ShimmerPill />
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '16px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: graGrad, color: '#fff', borderRadius: 20, borderBottomRightRadius: 7, padding: '11px 15px', fontSize: 14.5, boxShadow: '0 8px 20px rgba(58,111,168,.32)' }}>Trials for hemorrhagic stroke?</div>
          <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
            {/* gradient-outline bubble */}
            <div style={{ borderRadius: 20, borderBottomLeftRadius: 7, padding: 1.5, background: graGrad, boxShadow: graShadow }}>
              <div style={{ background: GRA.surface, borderRadius: 19, borderBottomLeftRadius: 6, padding: '12px 15px', fontSize: 14.5, lineHeight: 1.5 }}>For hemorrhagic stroke the study is <b style={{ color: GRA.g2 }}>STITCH</b> — hematoma evacuation, currently <b style={{ color: GRA.amber }}>paused</b> for site requalification.</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontFamily: GRA.mono, fontWeight: 600, color: GRA.g2, background: GRA.surface, border: `1px solid ${GRA.line}`, borderRadius: 999, padding: '6px 11px', boxShadow: graShadow }}><span style={{ width: 6, height: 6, borderRadius: 999, background: GRA.g2 }} />STITCH →</span>
            </div>
          </div>
          <div style={{ alignSelf: 'flex-start', borderRadius: 20, borderBottomLeftRadius: 7, padding: 1.5, background: graGrad }}>
            <div style={{ background: GRA.surface, borderRadius: 19, borderBottomLeftRadius: 6, padding: '14px 17px' }}><TypingDots color={GRA.g2} /></div>
          </div>
        </div>

        <div style={{ padding: '10px 16px 30px' }}>
          <div style={{ background: GRA.surface, borderRadius: 22, padding: 6, display: 'flex', alignItems: 'center', gap: 8, boxShadow: graShadow }}>
            <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: GRA.ink3 }}>Ask a question…</span>
            <div style={{ width: 40, height: 40, borderRadius: 16, background: graGrad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><SendArrow size={18} /></div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { V5Home, V5Chat });
