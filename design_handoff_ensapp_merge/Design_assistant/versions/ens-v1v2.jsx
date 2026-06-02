// ens-v1v2.jsx — V1 Aurora Glass (dark) + V2 Mono Console (terminal)
// Exposes: V1Home, V1Chat, V2Home, V2Chat

/* ─────────────────────────── V1 · AURORA GLASS ─────────────────────────── */
const AUR = {
  bg: '#0A1622', card: 'rgba(255,255,255,.06)', cardBd: 'rgba(255,255,255,.12)',
  ink: '#EAF2F7', ink2: 'rgba(234,242,247,.62)', ink3: 'rgba(234,242,247,.4)',
  glacier: '#5BA7D6', glacierDk: '#2A6A92', mint: '#46C39A', amber: '#E0A93B',
  sans: "'IBM Plex Sans', sans-serif", display: "'Hanken Grotesk', sans-serif", mono: "'IBM Plex Mono', monospace",
};

function AuroraBg() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: -120, left: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,167,214,.45), transparent 70%)', filter: 'blur(36px)', animation: 'ens-float 9s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', top: 120, right: -110, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(70,195,154,.32), transparent 70%)', filter: 'blur(40px)', animation: 'ens-float 11s ease-in-out infinite reverse' }} />
      <div style={{ position: 'absolute', bottom: -90, left: 40, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(42,106,146,.5), transparent 70%)', filter: 'blur(38px)', animation: 'ens-float 13s ease-in-out infinite' }} />
    </div>
  );
}

const glassCard = { background: AUR.card, border: `1px solid ${AUR.cardBd}`, backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)', borderRadius: 22 };

function V1Home() {
  const active = VTRIALS.filter((t) => t.status === 'active');
  return (
    <Phone bg={AUR.bg}>
      <AuroraBg />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 52, display: 'flex', flexDirection: 'column', fontFamily: AUR.sans, color: AUR.ink, zIndex: 1 }}>
        <div style={{ padding: '0 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 18px rgba(91,167,214,.5)' }}><EligoMark size={18} /></div>
            <span style={{ fontFamily: AUR.display, fontWeight: 800, fontSize: 19, letterSpacing: -0.5 }}>Eligo</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, fontFamily: AUR.mono, color: AUR.ink2, border: `1px solid ${AUR.cardBd}`, borderRadius: 8, padding: '5px 8px' }}>EN</span>
        </div>

        <div style={{ padding: '26px 22px 0' }}>
          <div style={{ fontSize: 14, color: AUR.ink2 }}>Good morning, Dr. Reyes</div>
          <div style={{ fontSize: 27, fontWeight: 700, letterSpacing: -0.6, marginTop: 4, lineHeight: 1.15, fontFamily: AUR.display }}>What do you need<br/>to know?</div>
        </div>

        {/* glowing ask bar */}
        <div style={{ margin: '20px 22px 0', ...glassCard, padding: 5, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 0 0 1px rgba(91,167,214,.25), 0 12px 32px rgba(0,0,0,.4)' }}>
          <div style={{ width: 40, height: 40, borderRadius: 16, background: `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px rgba(91,167,214,.55)' }}><SparkIcon size={18} /></div>
          <span style={{ flex: 1, fontSize: 14.5, color: AUR.ink3 }}>Ask about the trials…</span>
          <div style={{ width: 38, height: 38, borderRadius: 14, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><SendArrow size={17} color={AUR.glacier} /></div>
        </div>

        {/* suggestion pills */}
        <div style={{ display: 'flex', gap: 8, padding: '14px 22px 0', flexWrap: 'wrap' }}>
          {['Active trials?', 'Hemorrhagic options', 'MOSTE window'].map((s) => (
            <span key={s} style={{ fontSize: 12.5, color: AUR.ink2, border: `1px solid ${AUR.cardBd}`, background: 'rgba(255,255,255,.04)', borderRadius: 999, padding: '7px 12px' }}>{s}</span>
          ))}
        </div>

        {/* live stat tiles */}
        <div style={{ display: 'flex', gap: 12, padding: '22px 22px 0' }}>
          <div style={{ flex: 1, ...glassCard, padding: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: AUR.display, color: AUR.mint }}>{active.length}</div>
            <div style={{ fontSize: 12, color: AUR.ink2, marginTop: 2 }}>Enrolling now</div>
          </div>
          <div style={{ flex: 1, ...glassCard, padding: 16 }}>
            <div style={{ fontSize: 30, fontWeight: 700, fontFamily: AUR.display, color: AUR.glacier }}>{VTRIALS.length}</div>
            <div style={{ fontSize: 12, color: AUR.ink2, marginTop: 2 }}>Total trials</div>
          </div>
        </div>

        {/* nav */}
        <div style={{ marginTop: 'auto', padding: '14px 22px 26px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', gap: 4, ...glassCard, borderRadius: 999, padding: 6 }}>
            {[['Home', false], ['New', false], ['Trials', false], ['Assistant', true]].map(([l, on]) => (
              <span key={l} style={{ fontSize: 13, fontWeight: 600, padding: on ? '9px 16px' : '9px 13px', borderRadius: 999, color: on ? '#fff' : AUR.ink3, background: on ? `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})` : 'transparent', boxShadow: on ? '0 0 18px rgba(91,167,214,.5)' : 'none' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}

function V1Chat() {
  return (
    <Phone bg={AUR.bg}>
      <AuroraBg />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column', fontFamily: AUR.sans, color: AUR.ink, zIndex: 1 }}>
        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 11, borderBottom: `1px solid ${AUR.cardBd}` }}>
          <div style={{ width: 34, height: 34, borderRadius: 12, background: `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(91,167,214,.5)' }}><SparkIcon size={17} /></div>
          <div>
            <div style={{ fontSize: 15.5, fontWeight: 700, fontFamily: AUR.display }}>Eligo Assistant</div>
            <div style={{ fontSize: 11.5, color: AUR.mint, display: 'flex', alignItems: 'center', gap: 5 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: AUR.mint, boxShadow: '0 0 8px ' + AUR.mint }} />online</div>
          </div>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '18px 18px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* user */}
          <div style={{ alignSelf: 'flex-end', maxWidth: '80%', background: `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})`, color: '#fff', borderRadius: 18, borderBottomRightRadius: 6, padding: '11px 14px', fontSize: 14.5, boxShadow: '0 8px 20px rgba(42,106,146,.5)' }}>Which trials are enrolling for hemorrhagic stroke?</div>
          {/* assistant */}
          <div style={{ alignSelf: 'flex-start', maxWidth: '86%' }}>
            <div style={{ ...glassCard, borderBottomLeftRadius: 6, padding: '12px 15px', fontSize: 14.5, lineHeight: 1.5, color: AUR.ink }}>For hemorrhagic stroke the study is <b style={{ color: AUR.glacier }}>STITCH</b> — minimally-invasive hematoma evacuation. It's currently <b style={{ color: '#E0A93B' }}>paused</b> for site requalification.</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 9 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontFamily: AUR.mono, fontWeight: 600, color: AUR.glacier, border: `1px solid rgba(91,167,214,.4)`, background: 'rgba(91,167,214,.1)', borderRadius: 999, padding: '6px 11px', boxShadow: '0 0 14px rgba(91,167,214,.25)' }}><span style={{ width: 6, height: 6, borderRadius: 999, background: AUR.glacier }} />STITCH</span>
            </div>
          </div>
          {/* typing */}
          <div style={{ alignSelf: 'flex-start', ...glassCard, borderBottomLeftRadius: 6, padding: '14px 16px' }}><TypingDots color={AUR.glacier} /></div>
        </div>

        {/* input */}
        <div style={{ padding: '10px 18px 30px' }}>
          <div style={{ ...glassCard, borderRadius: 24, padding: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1, paddingLeft: 12, fontSize: 14.5, color: AUR.ink3 }}>Message Eligo…</span>
            <div style={{ width: 40, height: 40, borderRadius: 18, background: `linear-gradient(150deg, ${AUR.glacier}, ${AUR.glacierDk})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 16px rgba(91,167,214,.55)' }}><SendArrow size={18} /></div>
          </div>
        </div>
      </div>
    </Phone>
  );
}

/* ─────────────────────────── V2 · MONO CONSOLE ─────────────────────────── */
const CON = {
  bg: '#0D1117', panel: '#11181F', bd: '#1F2A33', bdHi: '#2B3A45',
  ink: '#D4E2EA', ink2: '#7E96A3', ink3: '#536673',
  glacier: '#62B0DE', mint: '#3FD9A0', amber: '#E5B567', mag: '#D98AC5',
  mono: "'IBM Plex Mono', monospace", sans: "'IBM Plex Sans', sans-serif",
};

function ConGrid() {
  return <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${CON.bd} 1px, transparent 1px), linear-gradient(90deg, ${CON.bd} 1px, transparent 1px)`, backgroundSize: '28px 28px', opacity: .25, zIndex: 0 }} />;
}

const statusTag = (s) => s === 'active'
  ? { t: '[ACTIVE]', c: CON.mint }
  : { t: '[PAUSED]', c: CON.amber };

function V2Home() {
  return (
    <Phone bg={CON.bg} statusColor={CON.ink2}>
      <ConGrid />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 50, display: 'flex', flexDirection: 'column', fontFamily: CON.mono, color: CON.ink, zIndex: 1 }}>
        <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: CON.ink2 }}><span style={{ color: CON.glacier }}>eligo</span>://assistant</span>
          <span style={{ fontSize: 11, color: CON.mint, border: `1px solid ${CON.bd}`, borderRadius: 4, padding: '3px 7px' }}>● connected</span>
        </div>

        <div style={{ padding: '24px 20px 0' }}>
          <div style={{ fontSize: 12.5, color: CON.ink3 }}>// clinical trial knowledge base</div>
          <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.5, marginTop: 8, fontFamily: CON.sans, color: CON.ink }}>Query the trials</div>
        </div>

        {/* command input */}
        <div style={{ margin: '18px 20px 0', background: CON.panel, border: `1px solid ${CON.bdHi}`, borderRadius: 10, padding: '14px 14px', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
          <span style={{ color: CON.mint }}>&gt;</span>
          <span style={{ color: CON.ink2 }}>ask</span>
          <span style={{ width: 8, height: 17, background: CON.glacier, display: 'inline-block', animation: 'ens-orb 1.1s steps(2) infinite' }} />
          <span style={{ marginLeft: 'auto', fontSize: 11, color: CON.ink3 }}>⏎ run</span>
        </div>

        <div style={{ padding: '14px 20px 0', display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ fontSize: 11, color: CON.ink3 }}># suggested</div>
          {['list active trials', 'criteria MOSTE --window', 'filter --cat=hemorrhagic'].map((s) => (
            <div key={s} style={{ fontSize: 12.5, color: CON.glacier }}>$ {s}</div>
          ))}
        </div>

        {/* trial table */}
        <div style={{ margin: '20px 20px 0', background: CON.panel, border: `1px solid ${CON.bd}`, borderRadius: 10, overflow: 'hidden' }}>
          <div style={{ padding: '9px 14px', borderBottom: `1px solid ${CON.bd}`, fontSize: 11, color: CON.ink3, display: 'flex', justifyContent: 'space-between' }}><span>TRIAL</span><span>STATUS</span></div>
          {VTRIALS.slice(0, 4).map((t) => {
            const st = statusTag(t.status);
            return (
              <div key={t.id} style={{ padding: '10px 14px', borderTop: `1px solid ${CON.bd}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                <span><span style={{ color: CON.glacier, fontWeight: 600 }}>{t.id}</span> <span style={{ color: CON.ink3 }}>· {t.win}</span></span>
                <span style={{ color: st.c, fontSize: 11.5 }}>{st.t}</span>
              </div>
            );
          })}
        </div>

        {/* nav */}
        <div style={{ marginTop: 'auto', padding: '12px 20px 28px', display: 'flex', gap: 6 }}>
          {[['home', false], ['new', false], ['trials', false], ['chat', true]].map(([l, on]) => (
            <span key={l} style={{ flex: 1, textAlign: 'center', fontSize: 12, padding: '9px 0', borderRadius: 7, border: `1px solid ${on ? CON.glacier : CON.bd}`, color: on ? CON.glacier : CON.ink3, background: on ? 'rgba(98,176,222,.1)' : 'transparent' }}>{on ? '▸ ' : ''}{l}</span>
          ))}
        </div>
      </div>
    </Phone>
  );
}

function V2Chat() {
  return (
    <Phone bg={CON.bg} statusColor={CON.ink2}>
      <ConGrid />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 44, display: 'flex', flexDirection: 'column', fontFamily: CON.mono, color: CON.ink, zIndex: 1 }}>
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${CON.bd}`, display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ color: CON.glacier }}>eligo</span><span style={{ color: CON.ink3 }}>@assistant</span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: CON.mint }}>● live</span>
        </div>

        <div style={{ flex: 1, overflow: 'hidden', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 16, fontSize: 13.5, lineHeight: 1.55 }}>
          <div>
            <div style={{ color: CON.mag, fontSize: 12 }}>you&gt;</div>
            <div style={{ color: CON.ink, marginTop: 3 }}>which trials are active?</div>
          </div>
          <div>
            <div style={{ color: CON.glacier, fontSize: 12 }}>eligo&gt;</div>
            <div style={{ color: CON.ink, marginTop: 3 }}>4 trials enrolling right now:</div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {VTRIALS.filter((t) => t.status === 'active').map((t) => (
                <span key={t.id} style={{ fontSize: 12, color: CON.mint, border: `1px solid ${CON.bdHi}`, background: CON.panel, borderRadius: 5, padding: '5px 9px' }}>[{t.id}]</span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: CON.mag, fontSize: 12 }}>you&gt;</div>
            <div style={{ color: CON.ink, marginTop: 3 }}>MOSTE window?</div>
          </div>
          <div>
            <div style={{ color: CON.glacier, fontSize: 12 }}>eligo&gt;</div>
            <div style={{ color: CON.ink2, marginTop: 3, display: 'flex', alignItems: 'center', gap: 8 }}><TypingDots color={CON.glacier} /></div>
          </div>
        </div>

        <div style={{ padding: '10px 18px 30px' }}>
          <div style={{ background: CON.panel, border: `1px solid ${CON.bdHi}`, borderRadius: 9, padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 9, fontSize: 13.5 }}>
            <span style={{ color: CON.mint }}>&gt;</span>
            <span style={{ flex: 1, color: CON.ink3 }}>type a query…</span>
            <span style={{ fontSize: 11, color: CON.glacier, border: `1px solid ${CON.bd}`, borderRadius: 5, padding: '4px 8px' }}>⏎</span>
          </div>
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { V1Home, V1Chat, V2Home, V2Chat });
