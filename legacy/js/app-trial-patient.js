        /* ======= Patient-from-trial helpers ======= */
        function goToTrialNewPatient(){
          const lbl = (selectedTrialName==='NO_TRIALS') ? 'No trials' :
                      (selectedTrialName==='SaferDoac' ? 'SAFER-DOAC' : (selectedTrialName==='DOIT' ? 'DO-IT' : (selectedTrialName==='TICH3' ? 'TICH-3' : (selectedTrialName||'-'))));
          document.getElementById('tp_selectedStudyLabel').textContent = lbl;
          const armRow = document.getElementById('tp_armRow');
          armRow.style.display = (selectedTrialName==='NO_TRIALS' || !hasKnownStudyArm(lbl)) ? 'none' : 'grid';
          document.getElementById('trialPatientForm').reset();
          document.getElementById('tp_otherTrials').innerHTML = "";

          // Pre-populate from preData (Patient in Progress cross-flow sharing)
          if(preData){
            if(preData.patientId){ const el=document.getElementById('tp_patientId'); if(el) el.value=preData.patientId; }
            if(isFinite(preData.age)){ const el=document.getElementById('tp_age'); if(el) el.value=preData.age; }
            if(isFinite(preData.nihss)){ const el=document.getElementById('tp_nihss'); if(el) el.value=preData.nihss; }
            if(isFinite(preData.premrs)){ const el=document.getElementById('tp_mrs'); if(el) el.value=preData.premrs; }
          }

          tp_buildMessage();
          showPage('trialPatientPage');
        }

        function tp_addOtherTrial(){
          const wrap=document.getElementById('tp_otherTrials');
          const row=document.createElement('div');
          row.className='btn-row';
          row.style.alignItems='center';
          row.innerHTML=`
            <select class="tp_other_name">
              <option value=""></option>
              <option>WeTrust</option><option>TICH-3</option><option>ATHENA</option>
              <option>FASTEST</option><option>Librexia</option><option>VANISH</option>
              <option>PIVOTAL</option><option>MOSTE</option><option>TWIN-2-WIN 2</option>
              <option>ARTEMIS</option><option>HYBERNIA</option><option>DONE SYMPLE</option>
              <option>SAFER-DOAC</option><option>SHIONOGI</option><option>SOVATELTIDE</option><option>ORION</option>
              <option>DO-IT</option>
              <option>REMEDY</option>
              <option>PROMISE</option>
              <option>NiVO</option>
            </select>
            <select class="tp_other_arm">
              <option value="intervention">intervention</option>
              <option value="control">control</option>
            </select>
            <button class="btn btn-small" type="button" onclick="this.parentElement.remove(); tp_buildMessage();">Remove</button>
          `;
          wrap.appendChild(row);
          const nameSel = row.querySelector('.tp_other_name');
          const armSel = row.querySelector('.tp_other_arm');
          const syncArmVisibility = ()=>{
            const hasArm = hasKnownStudyArm(nameSel?.value||"");
            armSel.style.display = hasArm ? 'block' : 'none';
          };
          nameSel.addEventListener('change', ()=>{ syncArmVisibility(); tp_buildMessage(); });
          armSel.addEventListener('change', tp_buildMessage);
          syncArmVisibility();
        }

        function tp_collectOtherTrials(){
          const rows=[...document.querySelectorAll('#tp_otherTrials .btn-row')];
          return rows.map(r=>{
            const name=r.querySelector('.tp_other_name')?.value||"";
            const arm = hasKnownStudyArm(name) ? (r.querySelector('.tp_other_arm')?.value||"intervention") : "si";
            return name?{name,arm}:null;
          }).filter(Boolean);
        }

        function tp_buildMessage(){
          const id=(document.getElementById('tp_patientId')?.value||"").trim()||"Patient record";
          const age=(document.getElementById('tp_age')?.value||"").trim();
          const nihss=(document.getElementById('tp_nihss')?.value||"").trim();
          const mrs=(document.getElementById('tp_mrs')?.value||"").trim();
          const arm=(document.getElementById('tp_arm')?.value||"intervention");
          const tev=(document.querySelector('input[name="tp_tev"]:checked')||{}).value||"";
          const mtici=(document.getElementById('tp_mtici')||{}).value||"";
          const tiv=(document.querySelector('input[name="tp_tiv"]:checked')||{}).value||"";
          const notes=(document.getElementById('tp_notes')?.value||"").trim();
 const strokeLabel = tpStrokeType
    ? (tpStrokeType === 'ischemic' ? 'Ischemic stroke' : 'Hemorrhagic stroke')
    : 'Stroke type ?';
          const lines=[];
  const base = `${id}, ${strokeLabel}, age ${age||"?"}, NIHSS ${nihss||"?"}, mRS ${mrs||"?"}`;

          if(selectedTrialName && selectedTrialName!=='NO_TRIALS'){
            const label = normalizeStudyName(selectedTrialName);
            if(hasKnownStudyArm(label)) lines.push(`${base}, ${label} (${arm})`);
            else lines.push(`${base}, ${label}`);
          }else{
            lines.push(base);
          }

          const others = tp_collectOtherTrials();
          others.forEach(o=>{ lines.push(hasKnownStudyArm(o.name) ? `${o.name} (${o.arm})` : `${o.name}`); });

          const extras=[];
  if(tev) extras.push(`TEV: ${tev}`);
  if(mtici) extras.push(`mTICI: ${mtici}`);
  if(tiv) extras.push(`TIV: ${tiv}`);

  // Target vessel solo se ischemico
  if (tpStrokeType === 'ischemic') {
    const tv = tp_getTargetVesselLabels();
    if (tv.length) extras.push(`Vessel: ${tv.join('/')}`);
  }

  if(extras.length) lines.push(extras.join(" | "));

          document.getElementById('tp_message').value = lines.join('\n');
        }
        // Live preview per la pagina "trialPatientPage"
document.addEventListener('input',(e)=>{
  if(['tp_patientId','tp_age','tp_nihss','tp_notes'].includes(e.target.id)){
    tp_buildMessage();
  }
});

document.addEventListener('change',(e)=>{
  const id = e.target.id;

  // Stroke type (Quick / Trial)
  if (e.target.name === 'tp_strokeType') {
    tp_selectStrokeType(e.target.value);
    return;
  }

  // Acute treatments (Quick / Trial)
  if (e.target.name === 'tp_tev') {
    updateTpMticiVisibility();
    tp_buildMessage();
  } else if (['tp_mrs','tp_arm','tp_mtici'].includes(id) || e.target.name === 'tp_tiv') {
    tp_buildMessage();
  }

  // Target vessel (Quick / Trial)
  if (e.target.closest('#tp_targetVesselGroup') && e.target.type === 'checkbox') {
    tp_updateTargetVesselSummary();
    tp_buildMessage();
  }
});



        function tp_copy(){ const ta=document.getElementById('tp_message'); ta.select(); ta.setSelectionRange(0,99999); document.execCommand('copy'); openModal("Copied","Message copied to clipboard."); }
        function tp_shareWA(){ const msg=document.getElementById('tp_message').value; const url="https://wa.me/?text="+encodeURIComponent(msg); window.open(url,"_blank"); }

        function tp_save(){
          const Npatient=(document.getElementById('tp_patientId')?.value||"").trim();
          if(!Npatient){ openModal("Missing field","Enter the <strong>patient record number</strong> before saving."); return; }

          const pre={
            age: parseInt(document.getElementById('tp_age')?.value||""),
            nihss: parseInt(document.getElementById('tp_nihss')?.value||""),
            premrs: parseInt(document.getElementById('tp_mrs')?.value||""),
            ltsw: ""
          };

          const trialsSelected=[];
          const outcomes={};

          if(selectedTrialName && selectedTrialName!=='NO_TRIALS'){
            const label = normalizeStudyName(selectedTrialName);
            trialsSelected.push(label);
            if(!hasKnownStudyArm(label)){ outcomes[label]="si"; } else { outcomes[label]= (document.getElementById('tp_arm')?.value||"intervention"); }
          }
          tp_collectOtherTrials().forEach(o=>{
            trialsSelected.push(o.name);
            outcomes[o.name]=o.arm;
          });

          const trialsForSheet=buildTrialsForSheet(trialsSelected, outcomes);

          const tev=(document.querySelector('input[name="tp_tev"]:checked')||{}).value||"";
          const mtici=(document.getElementById('tp_mtici')||{}).value||"";
          const tiv=(document.querySelector('input[name="tp_tiv"]:checked')||{}).value||"";
          const notes=(document.getElementById('tp_notes')?.value||"").trim();

          const payload={
            N_patient:Npatient,
            pre:pre,
            trials:trialsForSheet,
            TEV: tev, mTICI: mtici, TIV: tiv, Notes: notes
          };
          sendToSheet(payload);
          openModal("Saved","Saved to Google Sheet ✅");
        }
