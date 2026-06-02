// ens-home-abc.jsx — integrations A, B, C (real Eligo style)
// Exposes: HomeA, HomeB, HomeC

const titleBlock = (
  <div style={{ marginTop: 14, marginBottom: 18 }}>
    <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.7, lineHeight: 1.14 }}>Assign a patient<br />to a trial.</div>
    <div style={{ fontSize: 13.5, color: ENSR.ink3, marginTop: 9 }}>Patient assignment to clinical trials.</div>
  </div>
);

// Active session card (shared) — calm white card
function SessionCard() {
  return (
    <div style={{ cursor: 'pointer', borderRadius: 20, padding: 16, background: ENSR.surface, boxShadow: softShadowR }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: ENSR.okFg }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Active session</span>
        </span>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: ENSR.primary }}>Resume →</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: ENSR.mono, fontSize: 23, fontWeight: 500, letterSpacing: -0.4 }}>01:52</span>
        <span style={{ fontSize: 12.5, color: ENSR.ink3 }}>since LTSW · WeTrust</span>
      </div>
    </div>
  );
}

// bottom utility row (Catalog · Past)
function UtilRow() {
  return (
    <div style={{ display: 'flex' }}>
      {[[IR.book, 'Trial catalog'], [IR.person, 'Past patients']].map(([icon, label], i) => (
        <div key={i} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px 0', color: ENSR.ink2, borderLeft: i ? `1px solid ${ENSR.lineSoft}` : 'none' }}>
          {icon(ENSR.ink3)}<span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// Manual "New patient" — solid glacier hero (the original primary button)
function NewPatientHero() {
  return (
    <div style={{ borderRadius: 22, padding: '22px', background: ENSR.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: heroShadowR }}>
      <span>
        <span style={{ display: 'block', fontSize: 19, fontWeight: 600, letterSpacing: -0.3 }}>New patient</span>
        <span style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.82)', marginTop: 3 }}>Check eligibility across all trials</span>
      </span>
      <span style={{ width: 40, height: 40, borderRadius: 999, background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IR.chev('#fff', 20)}</span>
    </div>
  );
}

// Manual "New patient" — white outlined secondary button
function NewPatientOutline() {
  return (
    <div style={{ borderRadius: 20, padding: '16px 18px', background: ENSR.surface, border: `1px solid ${ENSR.line}`, boxShadow: softShadowR, display: 'flex', alignItems: 'center', gap: 14 }}>
      <span style={{ width: 44, height: 44, borderRadius: 13, background: ENSR.primaryBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IR.stetho(ENSR.primary)}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>New patient</span>
        <span style={{ display: 'block', fontSize: 12.5, color: ENSR.ink3, marginTop: 2 }}>Start a manual evaluation</span>
      </span>
      {IR.chev(ENSR.ink3, 18)}
    </div>
  );
}

/* ───────── A · Ask solid hero, New patient outlined below ───────── */
function HomeA() {
  return (
    <RealPhone>
      <RealHeader />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {titleBlock}
        {/* ASK — solid glacier hero with embedded field + chips */}
        <div style={{ borderRadius: 24, padding: 18, background: `linear-gradient(155deg, ${ENSR.primary}, ${ENSR.primaryDk})`, color: '#fff', boxShadow: heroShadowR }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 13 }}>
            <LogoTile size={28} radius={9} glyph={17} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>Ask Eligo</span>
            <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, fontFamily: ENSR.mono, letterSpacing: 0.5, color: 'rgba(255,255,255,.78)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 6, padding: '3px 7px' }}>AI</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.16)', borderRadius: 15, padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 10, backdropFilter: 'blur(4px)' }}>
            <span style={{ flex: 1, fontSize: 14.5, color: 'rgba(255,255,255,.82)' }}>Ask about the trials…</span>
            <span style={{ width: 32, height: 32, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IR.send(ENSR.primary, 16)}</span>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>{SUGG.map((s) => <Chip key={s} solid>{s}</Chip>)}</div>
        </div>
        {/* NEW PATIENT — secondary, below */}
        <NewPatientOutline />
        <SessionCard />
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 24, right: 24 }}><UtilRow /></div>
      <RealTabBar active="home" />
    </RealPhone>
  );
}

/* ───────── B · Ask search bar + chips, New patient solid hero below ───────── */
function HomeB() {
  return (
    <RealPhone>
      <RealHeader />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {titleBlock}
        {/* ASK — prominent light "search" bar */}
        <div>
          <div style={{ background: ENSR.surface, borderRadius: 18, padding: 7, display: 'flex', alignItems: 'center', gap: 11, boxShadow: softShadowR, border: `1px solid ${ENSR.line}` }}>
            <LogoTile size={36} radius={12} glyph={21} />
            <span style={{ flex: 1, fontSize: 15, color: ENSR.ink3 }}>Ask about the trials…</span>
            <span style={{ width: 38, height: 38, borderRadius: 13, background: ENSR.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IR.send('#fff', 18)}</span>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 11, flexWrap: 'wrap' }}>{SUGG.map((s) => <Chip key={s}>{s}</Chip>)}</div>
        </div>
        {/* NEW PATIENT — stays the solid hero */}
        <NewPatientHero />
        <SessionCard />
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 24, right: 24 }}><UtilRow /></div>
      <RealTabBar active="home" />
    </RealPhone>
  );
}

/* ───────── C · Equal duo: tinted Ask card + solid New patient ───────── */
function HomeC() {
  return (
    <RealPhone>
      <RealHeader />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {titleBlock}
        {/* ASK — tinted outlined card */}
        <div style={{ borderRadius: 20, padding: 18, background: ENSR.primaryBg, border: `1px solid ${ENSR.line}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <LogoTile size={38} radius={12} glyph={22} />
            <span style={{ flex: 1 }}>
              <span style={{ display: 'block', fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>Ask about the trials</span>
              <span style={{ display: 'block', fontSize: 12.5, color: ENSR.ink2, marginTop: 2 }}>Criteria, windows, eligibility</span>
            </span>
            <span style={{ width: 38, height: 38, borderRadius: 13, background: ENSR.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IR.send('#fff', 18)}</span>
          </div>
          <div style={{ display: 'flex', gap: 7, marginTop: 14, flexWrap: 'wrap' }}>{SUGG.map((s) => <Chip key={s}>{s}</Chip>)}</div>
        </div>
        {/* NEW PATIENT — solid hero below */}
        <NewPatientHero />
        <SessionCard />
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 24, right: 24 }}><UtilRow /></div>
      <RealTabBar active="home" />
    </RealPhone>
  );
}

Object.assign(window, { HomeA, HomeB, HomeC, SessionCard, UtilRow, NewPatientHero, NewPatientOutline, titleBlock });
