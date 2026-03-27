        /* ======= NAV / VIEW ======= */
        function showPage(id){ document.querySelectorAll('.page').forEach(p=>p.classList.remove('visible')); document.getElementById(id).classList.add('visible'); }
        function goToTrialsCriteria(){ showPage('trialsList'); } function goToNewPatient(){ showPage('preImaging'); } function goBackToMain(){ showPage('mainMenu'); }
        function setActiveNav(id){ document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active')); const el=document.querySelector('[data-target="'+id+'"]'); if(el) el.classList.add('active'); }
        function navGo(id){ showPage(id); setActiveNav(id); }

        /* ======= DETAIL RENDERER (NEW) ======= */
        function showTrialCriteria(name){
          selectedTrialName = name;
          const title = (name==='SaferDoac'?'SAFER-DOAC':(name==='DOIT'?'DO-IT':(name==='TICH3'?'TICH-3':name)));
          document.getElementById('trialTitle').innerText = (name==='NO_TRIALS') ? "No trials" : title;

          const chipStatus = document.getElementById('trialStatusChip');
          const chipCategory = document.getElementById('trialCategoryChip');

          if(name==='NO_TRIALS'){
            chipStatus.style.display='none'; chipCategory.style.display='none';
            document.getElementById('trialCriteriaText').innerHTML = "<p class='muted'>No trial selected. You can still add a patient and share/save the summary.</p>";
            showPage('trialDetail'); return;
          }

          const info = TRIALS_INFO[name] || TRIALS_INFO[title] || TRIALS_INFO[(name||'').toUpperCase()] || null;
          if(!info){
            chipStatus.style.display='none'; chipCategory.style.display='none';
            document.getElementById('trialCriteriaText').innerHTML = "<p>Criteria not available.</p>";
            showPage('trialDetail'); return;
          }

          // Chips
          chipStatus.style.display='inline-flex';
          chipStatus.classList.toggle('paused', info.status==='paused');
          document.getElementById('trialStatusText').textContent = (info.status==='paused'?'Paused':'Active');

          chipCategory.style.display='inline-flex';
          document.getElementById('trialCategoryText').textContent = info.category;

          // Sections
          const k = info.key || {};
          const keyGrid = `
            <div class="grid-3">
              <div class="kv"><b>Time window</b><div>${k.window||'—'}</div></div>
              <div class="kv"><b>Age</b><div>${k.age||'—'}</div></div>
              <div class="kv"><b>pre-mRS</b><div>${k.mrs||'—'}</div></div>
            </div>
            <div class="grid-2">
              <div class="kv"><b>NIHSS</b><div>${k.nihss||'—'}</div></div>
              <div class="kv"><b>ASPECTS</b><div>${k.aspects||'—'}</div></div>
            </div>
          `;

          const imaging = `
            <div class="section">
              <h3>Neuroimaging</h3>
              <div class="kv">${info.imaging||'—'}</div>
            </div>
          `;

          const treatCtx = `
            <div class="section">
              <h3>Treatment context</h3>
              <div class="grid-3">
                <div class="kv"><b>Thrombolytic</b><div>${info.thrombolytic||'—'}</div></div>
                <div class="kv"><b>Thrombectomy</b><div>${info.thrombectomy||'—'}</div></div>
                <div class="kv"><b>Pre-EVT labs</b><div>${info.preEvtLabs||'—'}</div></div>
              </div>
            </div>
          `;

          const consent = `
            <div class="section">
              <h3>Consent</h3>
              <div class="kv">${info.consent||'—'}</div>
            </div>
          `;

          const intervention = `
            <div class="section">
              <h3>Intervention</h3>
              <div class="kv">${info.intervention||'—'}</div>
            </div>
          `;

          const notes = (info.notes && info.notes.length) ? `
            <div class="section">
              <h3>Notes / Exclusions</h3>
              <ul class="bul">${info.notes.map(n=>`<li>${n}</li>`).join('')}</ul>
            </div>
          ` : '';

          const visits = (info.visits && info.visits.length) ? `
            <div class="section">
              <h3>Follow-up visits</h3>
              <ul class="bul">${info.visits.map(v=>`<li>${v}</li>`).join('')}</ul>
            </div>
          ` : '';

          const doitContraBanner = (title==="DOIT" || title==="DO-IT") ? `
            <div class="section" style="border:1px solid #f5c242;background:#fff8e1;border-radius:10px;padding:.75rem;">
              <h3 style="margin-top:0">DO-IT Contraindication Alerts</h3>
              <div class="kv">Reversal agent use: contraindication.</div>
              <div class="kv">Pregnancy: contraindication.</div>
            </div>
          ` : '';

          const remedyBanner = (title==="REMEDY") ? `
            <div class="section" style="border:1px solid #f5c242;background:#fff8e1;border-radius:10px;padding:.75rem;">
              <h3 style="margin-top:0">REMEDY Alerts</h3>
              <div class="kv">ACE inhibitor (IECA) use: exclusion criterion.</div>
              <div class="kv">Practical note: post-IVT CT at 6h with &lt;PH1.</div>
            </div>
          ` : '';

          document.getElementById('trialCriteriaText').innerHTML = `
            <div class="section"><h3>Key eligibility</h3>${keyGrid}</div>
            ${imaging}
            ${treatCtx}
            ${consent}
            ${intervention}
            ${notes}
            ${visits}
            ${doitContraBanner}
            ${remedyBanner}
          `;
          showPage('trialDetail');
        }
