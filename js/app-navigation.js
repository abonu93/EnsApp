        /* ======= NAV / VIEW ======= */
        const PAGE_STEP = {
          preImaging: 0, preResult: 1,
          postImaging: 2,
          summaryPage: 3, postAcutePage: 3, summaryChronicPage: 3,
          sharePage: 4, shareChronicPage: 4
        };
        const FLOW_PAGES = new Set(Object.keys(PAGE_STEP));

        function updateProgress(pageId){
          const bar = document.getElementById('progressBar');
          if(!bar) return;
          if(!FLOW_PAGES.has(pageId)){ bar.style.display='none'; return; }
          bar.style.display='block';
          const step = PAGE_STEP[pageId];
          bar.querySelectorAll('.progress-step').forEach(el=>{
            const s = parseInt(el.dataset.step);
            el.classList.toggle('active', s === step);
            el.classList.toggle('done', s < step);
          });
          bar.querySelectorAll('.progress-connector').forEach((el,i)=>{
            el.classList.toggle('done', i < step);
          });
        }

        function _patientHasData(){
          return !!(preData && (preData.patientId || isFinite(preData.age)));
        }

        function updateLandingPage(){
          const wrap = document.getElementById('patientInProgressWrap');
          if(!wrap) return;
          const has = _patientHasData();
          wrap.style.display = has ? 'block' : 'none';
          if(has){
            const preview = document.getElementById('patientInProgressPreview');
            if(preview){
              const parts = [];
              if(preData.patientId) parts.push(preData.patientId);
              if(isFinite(preData.age)) parts.push('Age ' + preData.age);
              if(isFinite(preData.nihss)) parts.push('NIHSS ' + preData.nihss);
              preview.textContent = parts.join(' · ');
            }
          }
        }

        function showPage(id){
          document.querySelectorAll('.page').forEach(p=>p.classList.remove('visible'));
          document.getElementById(id).classList.add('visible');
          updateProgress(id);
          if(id === 'landingPage') updateLandingPage();
          window.scrollTo(0,0);
        }

        function _resetAllState(){
          const form = document.getElementById('formPreImaging');
          if(form) form.reset();
          preData = {}; postData = {}; evtData = {}; hemData = {};
          selectedStudies = []; studyOutcomes = {};
          selectedChronic = []; studyChronicOutcomes = {};
          Object.keys(reasons).forEach(k=>{ reasons[k].meet=[]; reasons[k].fail=[]; });
          for(const k of Object.keys(infoMessages)) infoMessages[k]='';
          for(const k of Object.keys(notIndicated)) notIndicated[k]=false;
          document.querySelectorAll('.radio').forEach(l=>l.classList.remove('selected'));
          document.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
          document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);
          document.getElementById('ischemicSection').style.display='none';
          document.getElementById('hemorrhagicSection').style.display='none';
          const out=document.getElementById('studyOutcomesContainer'); if(out) out.innerHTML='';
          const out2=document.getElementById('studyChronicOutcomesContainer'); if(out2) out2.innerHTML='';
          const ta=document.getElementById('shareMessage'); if(ta) ta.value='';
          const ta2=document.getElementById('shareMessage2'); if(ta2) ta2.value='';
        }

        /* Called from landing "New Patient" button */
        function startNewPatient(){
          _resetAllState();
          selectedTrialName = null;
          tpStrokeType = null;
          showPage('workflowSelector');
        }

        /* From workflowSelector → Eligibility Evaluation */
        function startEligibilityEvaluation(){
          showPage('preImaging');
        }

        /* From workflowSelector → Quick Patient. Pre-populates from preData if available. */
        function startQuickPatient(){
          selectedTrialName = 'NO_TRIALS';
          goToTrialNewPatient();
        }

        /* Bottom bar "New Patient" — warns if data is in progress */
        function promptNewPatient(){
          if(_patientHasData()){
            openConfirmModal(
              'Start new patient?',
              'All currently entered data will be permanently deleted.',
              function(){ startNewPatient(); }
            );
          } else {
            startNewPatient();
          }
        }

        function goToTrialsCriteria(){ showPage('trialsList'); }
        /* Keep goToNewPatient as alias (called from some back-paths) */
        function goToNewPatient(){ startNewPatient(); }
        function goBackToMain(){ showPage('workflowSelector'); }
        function setActiveNav(id){ document.querySelectorAll('.navbtn').forEach(b=>b.classList.remove('active')); const el=document.querySelector('[data-target="'+id+'"]'); if(el) el.classList.add('active'); }
        function navGo(id){ showPage(id); setActiveNav(id); }

        /* ======= TRIALS FILTER ======= */
        let _trialFilter = 'all';
        function setTrialFilter(btn, filter){
          _trialFilter = filter;
          document.querySelectorAll('.filter-pills .pill').forEach(p=>p.classList.remove('active'));
          btn.classList.add('active');
          filterTrials();
        }
        function filterTrials(){
          const q = (document.getElementById('trialsSearch')?.value || '').toLowerCase().trim();
          document.querySelectorAll('#trialListContainer .trial-item').forEach(item=>{
            const name = item.dataset.name || '';
            const stroke = item.dataset.stroke || 'all';
            const matchFilter = _trialFilter === 'all' || stroke === _trialFilter || stroke === 'all';
            const matchSearch = !q || name.includes(q);
            item.style.display = (matchFilter && matchSearch) ? '' : 'none';
          });
        }

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
