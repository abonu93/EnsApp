        /* ======= RESET / MODAL ======= */
        function restart(){
          preData={}; postData={}; evtData={}; hemData={};
          eligibility={
  weTrust:false, athena:false, fastest:false, tich3:false, librexia:false, vanish:false,
  pivotal:false, moste:false, twin2win2:false, artemis:false, hybernia:false,
  doneSymple:false, saferdoac:false, shionogi:false, sovateltide:false, orion:false, doit:false,
  remedy:false,
  promise:false, nivo:false
};

          selectedStudies=[]; studyOutcomes={}; selectedChronic=[]; studyChronicOutcomes={};
          for(const k of Object.keys(infoMessages)) infoMessages[k]="";
          for(const k of Object.keys(notIndicated)) notIndicated[k]=false;
          Object.keys(reasons).forEach(k=>{ reasons[k].meet=[]; reasons[k].fail=[]; });
          selectedTrialName=null;
          tpStrokeType=null;

          const formPre=document.getElementById('formPreImaging'); if(formPre) formPre.reset();
          const shareForm=document.getElementById('shareForm'); if(shareForm) shareForm.reset();
          const shareForm2=document.getElementById('shareChronicForm'); if(shareForm2) shareForm2.reset();
          const tpForm=document.getElementById('trialPatientForm'); if(tpForm) tpForm.reset();

          const ta=document.getElementById('shareMessage'); if(ta) ta.value="";
          const ta2=document.getElementById('shareMessage2'); if(ta2) ta2.value="";
          const tpTa=document.getElementById('tp_message'); if(tpTa) tpTa.value="";

          const out=document.getElementById('studyOutcomesContainer'); if(out) out.innerHTML="";
          const out2=document.getElementById('studyChronicOutcomesContainer'); if(out2) out2.innerHTML="";
          const out3=document.getElementById('tp_otherTrials'); if(out3) out3.innerHTML="";

          document.querySelectorAll('.radio').forEach(lbl=>lbl.classList.remove('selected'));
          document.querySelectorAll('input[type=radio]').forEach(r=>r.checked=false);
          document.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=false);

          showPage('mainMenu');
        }

        function openModal(title, html){
          const mb=document.getElementById('modalBackdrop');
          document.getElementById('modalTitle').textContent=title||'Details';
          document.getElementById('modalBody').innerHTML=html||'';
          mb.classList.add('show');
          mb.setAttribute('aria-hidden','false');
        }
        function closeModal(){
          const mb=document.getElementById('modalBackdrop');
          mb.classList.remove('show');
          mb.setAttribute('aria-hidden','true');
        }

        function showInfo(key){
          const r = reasons[key] || {meet:[],fail:[]};
          const ok = (Object.keys(eligibility).includes(key) ? eligibility[key] : null);
          const title = key.toUpperCase();
          const remedyBanner = (key==="remedy") ? `
            <div class="stack" style="margin-bottom:.5rem;gap:.4rem;">
              ${preData.acei==="yes" ? `<div class="card" style="background:#fff6d6;border-color:#ffd36a;color:#7a5b00;">REMEDY alert: ACE inhibitor (IECA) use is an exclusion criterion.</div>` : ``}
              <div class="card" style="background:#eef7ff;border-color:#b8dbff;color:#0f3f66;">REMEDY practical note: post-IVT CT at 6h with &lt;PH1.</div>
            </div>
          ` : "";

          const meetList = r.meet.length ? `<h4>✅ Met criteria</h4><ul class="k-list">${r.meet.map(x=>`<li>${x}</li>`).join("")}</ul>` : "";
          const failList = r.fail.length ? `<h4>❌ Unmet criteria</h4><ul class="k-list">${r.fail.map(x=>`<li>${x}</li>`).join("")}</ul>` : "";

          const statusBadge = ok===true ? `<span class="ok">Eligible</span>` :
                              ok===false ? `<span class="no">Not eligible</span>` : ``;

          const body = `
            <div class="muted" style="margin-bottom:.5rem;">${statusBadge}</div>
            ${remedyBanner}
            ${meetList}${failList}
          `.trim();

          openModal(title, body);
        }

        document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeModal(); });
        document.getElementById('modalBackdrop').addEventListener('click', (e)=>{ if(e.target.id==='modalBackdrop') closeModal(); });
      
