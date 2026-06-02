// ens-home-de.jsx — integrations D, E (real Eligo style)
// Exposes: HomeD, HomeE

/* ───────── D · Ask hero + vertical suggestion list, compact New below ───────── */
function HomeD() {
  return (
    <RealPhone>
      <RealHeader />
      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ marginTop: 14, marginBottom: 4 }}>
          <div style={{ fontSize: 15, color: ENSR.ink3 }}>Good morning, Dr. Reyes</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.7, marginTop: 4 }}>What do you need?</div>
        </div>
        {/* ASK — solid hero with input + tappable suggestion rows */}
        <div style={{ borderRadius: 24, padding: 18, background: `linear-gradient(155deg, ${ENSR.primary}, ${ENSR.primaryDk})`, color: '#fff', boxShadow: heroShadowR }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <LogoTile size={34} radius={11} glyph={20} />
            <span style={{ flex: 1, fontSize: 15.5, fontWeight: 600 }}>Ask about the trials</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,.16)', borderRadius: 15, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 13 }}>
            <span style={{ flex: 1, fontSize: 14.5, color: 'rgba(255,255,255,.82)' }}>Type a question…</span>
            <span style={{ width: 32, height: 32, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IR.send(ENSR.primary, 16)}</span>
          </div>
          <div style={{ marginTop: 13, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {SUGG.map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '11px 2px', borderTop: i ? '1px solid rgba(255,255,255,.16)' : 'none', fontSize: 14, color: 'rgba(255,255,255,.92)' }}>
                <span style={{ opacity: .7 }}>{IR.chat('rgba(255,255,255,.8)')}</span>
                <span style={{ flex: 1 }}>{s}</span>
                {IR.chev('rgba(255,255,255,.6)', 15)}
              </div>
            ))}
          </div>
        </div>
        {/* NEW PATIENT — compact row */}
        <div style={{ borderRadius: 18, padding: '14px 16px', background: ENSR.surface, boxShadow: softShadowR, display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ width: 40, height: 40, borderRadius: 12, background: ENSR.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{IR.plus('#fff')}</span>
          <span style={{ flex: 1 }}>
            <span style={{ display: 'block', fontSize: 15.5, fontWeight: 600, letterSpacing: -0.2 }}>New patient</span>
            <span style={{ display: 'block', fontSize: 12.5, color: ENSR.ink3, marginTop: 1 }}>Manual eligibility check</span>
          </span>
          {IR.chev(ENSR.ink3, 18)}
        </div>
        <SessionCard />
      </div>
      <RealTabBar active="home" />
    </RealPhone>
  );
}

/* ───────── E · Clean ask hero (V5 spirit, app colors) + New patient button ───────── */
function HomeE() {
  return (
    <RealPhone>
      {/* glacier gradient hero band */}
      <div style={{ background: `linear-gradient(150deg, ${ENSR.primary}, ${ENSR.primaryDk})`, padding: '50px 24px 26px', borderBottomLeftRadius: 28, borderBottomRightRadius: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -30, width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IR.logo(17)}</div>
            <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: -0.5, fontFamily: ENSR.display, color: '#fff' }}>Eligo</span>
          </div>
          <span style={{ color: 'rgba(255,255,255,.85)', fontSize: 12.5, fontWeight: 600, fontFamily: ENSR.mono }}>EN</span>
        </div>
        <div style={{ position: 'relative', fontSize: 23, fontWeight: 700, color: '#fff', fontFamily: ENSR.display, letterSpacing: -0.4, marginTop: 22, lineHeight: 1.18 }}>Your trial knowledge,<br />instantly.</div>
        <div style={{ position: 'relative', marginTop: 18, background: '#fff', borderRadius: 17, padding: 6, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 14px 30px rgba(15,33,42,.22)' }}>
          <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: ENSR.ink3 }}>Ask about the trials…</span>
          <span style={{ width: 40, height: 40, borderRadius: 13, background: ENSR.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{IR.send('#fff', 18)}</span>
        </div>
        <div style={{ position: 'relative', display: 'flex', gap: 7, marginTop: 13, flexWrap: 'wrap' }}>{SUGG.map((s) => <Chip key={s} solid>{s}</Chip>)}</div>
      </div>

      <div style={{ padding: '20px 24px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* NEW PATIENT — solid hero button below the band */}
        <NewPatientHero />
        <SessionCard />
      </div>
      <div style={{ position: 'absolute', bottom: 96, left: 24, right: 24 }}><UtilRow /></div>
      <RealTabBar active="home" />
    </RealPhone>
  );
}

Object.assign(window, { HomeD, HomeE });
