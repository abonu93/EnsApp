        /* ======= SHARE (ACUTE) ======= */
        function proceedToShare(){
          const checks = Array.from(document.querySelectorAll('.study-checkbox')).filter(c=>c.checked).map(c=>c.value);
          selectedStudies = checks;
          studyOutcomes = {};
          selectedStudies.forEach(s=>{
            if(hasKnownStudyArm(s)){ studyOutcomes[s] = "intervention"; }
            else { studyOutcomes[s] = "si"; }
          });

          const container = document.getElementById('studyOutcomesContainer');
          container.innerHTML = "";
          selectedStudies.forEach(s=>{
            if(!hasKnownStudyArm(s)){
              const l=document.createElement('div'); l.textContent=`${s} (no arm randomization)`;
              const p=document.createElement('div'); container.appendChild(l); container.appendChild(p); return;
            }
            const l=document.createElement('div'); l.textContent = s;
            const sel=document.createElement('select'); sel.dataset.study=s;
            sel.innerHTML=`<option value="intervention">intervention</option><option value="control">control</option>`;
            sel.addEventListener('change',e=>{ studyOutcomes[e.target.dataset.study]=e.target.value; buildShareMessage(); });
            container.appendChild(l); container.appendChild(sel);
          });
          buildShareMessage(); showPage('sharePage');
        }
function updateMticiVisibility() {
  const tev = (document.querySelector('input[name="tev"]:checked') || {}).value || "";
  const row = document.getElementById('mticiRow');
  if (row) {
    row.style.display = (tev === "Yes") ? "block" : "none";
    if (tev !== "Yes") {
      const sel = document.getElementById('mtici');
      if (sel) sel.value = "";
    }
  }
}

function updateTpMticiVisibility() {
  const tev = (document.querySelector('input[name="tp_tev"]:checked') || {}).value || "";
  const row = document.getElementById('tp_mticiRow');
  if (row) {
    row.style.display = (tev === "Yes") ? "block" : "none";
    if (tev !== "Yes") {
      const sel = document.getElementById('tp_mtici');
      if (sel) sel.value = "";
    }
  }
}
function tp_selectStrokeType(value){
  tpStrokeType = value;
  // Evidenzia radio selezionato
  markRadioSelected(document.getElementById('tp_strokeTypeGroup'));

  // Se ischemico: mostra acute treatments + target vessel
  const acuteCard = document.getElementById('tp_acuteCard');
  const vesselCard = document.getElementById('tp_vesselCard');
  if (acuteCard) acuteCard.style.display = (value === 'ischemic') ? 'block' : 'none';
  if (vesselCard) vesselCard.style.display = (value === 'ischemic') ? 'block' : 'none';

  tp_buildMessage();
}

function tp_getTargetVesselLabels(){
  const map = {
    "ica-extracranial": "extracranial ICA",
    "ica-intracranial": "intracranial ICA",
    "ica-terminal": "ICA-T",
    "m1": "M1",
    "m2-proxdom": "M2 prox/dom",
    "m2-any": "any M2",
    "gt-m2": ">M2",
    "a1": "A1",
    "a2": "A2",
    "gt-a2": ">A2",
    "basilar": "Basilar",
    "p1": "P1",
    "p2": "P2",
    "gt-p2": ">P2",
    "va": "VA"
  };
  return Array.from(document.querySelectorAll('#tp_targetVesselGroup input[type="checkbox"]:checked'))
    .map(i => map[i.value] || i.value);
}

function tp_updateTargetVesselSummary(){
  const span = document.getElementById('tp_targetVesselSummaryText');
  if (!span) return;
  const labels = tp_getTargetVesselLabels();
  if (!labels.length){
    span.textContent = "Select target vessels";
  } else if (labels.length <= 3){
    span.textContent = labels.join(", ");
  } else {
    span.textContent = `${labels.slice(0,2).join(", ")} +${labels.length - 2}`;
  }
}

function getTargetVesselLabels(){
  const map = {
    "ica-extracranial": "extracranial ICA",
    "ica-intracranial": "intracranial ICA",
    "ica-terminal": "ICA-T",
    "m1": "M1",
    "m2-proxdom": "M2 prox/dom",
    "m2-any": "any M2",
    "gt-m2": ">M2",
    "a1": "A1",
    "a2": "A2",
    "gt-a2": ">A2",
    "basilar": "Basilar",
    "p1": "P1",
    "p2": "P2",
    "gt-p2": ">P2",
    "va": "VA"
  };
  return Array.from(document.querySelectorAll('#targetVesselGroup input[type="checkbox"]:checked'))
    .map(i => map[i.value] || i.value);
}

function updateTargetVesselSummary(){
  const span = document.getElementById('targetVesselSummaryText');
  if (!span) return;

  const labels = getTargetVesselLabels();
  if (!labels.length){
    span.textContent = "Select target vessels";
  } else if (labels.length <= 3){
    span.textContent = labels.join(", ");
  } else {
    span.textContent = `${labels.slice(0,2).join(", ")} +${labels.length - 2}`;
  }
}


function buildShareMessage(){
  const pn = (document.getElementById('patientNumber')?.value || "").trim() || "Patient record";
  const tev = (document.querySelector('input[name="tev"]:checked') || {}).value || "";
  const mtici = (document.getElementById('mtici') || {}).value || "";
  const tiv = (document.querySelector('input[name="tiv"]:checked') || {}).value || "";
  const notes = (document.getElementById('notesField') || {}).value || "";

  const strokeLabel = postData.strokeType
    ? (postData.strokeType === 'ischemic' ? 'Ischemic stroke' : 'Hemorrhagic stroke')
    : 'Stroke type ?';

  const base = `${pn}, ${strokeLabel}, age ${isFinite(preData.age) ? preData.age : "?"}, NIHSS ${isFinite(preData.nihss) ? preData.nihss : "?"}, mRS ${isFinite(preData.premrs) ? preData.premrs : "?"}`;

  const lines = [];

  // 🔹 Qui il cambiamento: un'unica riga con tutti gli studi
  if (selectedStudies && selectedStudies.length){
    const studiesPart = selectedStudies.map(study => {
      if(!hasKnownStudyArm(study)) return `${study}`;
      const outcome = studyOutcomes[study] || "intervention";
      return `${study} (${outcome})`;
    }).join(' ');
    lines.push(`${base}, ${studiesPart}`);
  } else {
    // Nessuno studio selezionato: solo i dati del paziente
    lines.push(base);
  }

  // Extra (TEV, Target, mTICI, TIV)
  const extras = [];
  if (tev) extras.push(`TEV: ${tev}`);

  const tv = (typeof getTargetVesselLabels === 'function') ? getTargetVesselLabels() : [];
  if (tv.length) extras.push(`Target: ${tv.join('/')}`);

  if (mtici) extras.push(`mTICI: ${mtici}`);
  if (tiv) extras.push(`TIV: ${tiv}`);

  if (extras.length) lines.push(extras.join(" | "));
  if (notes) lines.push(`Notes: ${notes}`);

  const ta = document.getElementById('shareMessage');
  if (ta) ta.value = lines.join('\n');
}




        function saveToSheet(){
          const Npatient=(document.getElementById('patientNumber')?.value||"").trim();
          if(!Npatient){ openModal("Missing field","Enter the <strong>patient record number</strong> before saving."); return; }
          if(typeof preData.age==="undefined"||typeof preData.nihss==="undefined"||typeof preData.ltsw==="undefined"||typeof preData.premrs==="undefined"){
            openModal("Incomplete Pre-Imaging","Complete Pre-Imaging first (Age, NIHSS, LTSW, pre-mRS)."); return; }
          const tev=(document.querySelector('input[name="tev"]:checked')||{}).value||"";
          const mtici=(document.getElementById('mtici')||{}).value||"";
          const tiv=(document.querySelector('input[name="tiv"]:checked')||{}).value||"";
          const notes=(document.getElementById('notesField')||{}).value||"";

          const trialsForSheet=buildTrialsForSheet(selectedStudies, studyOutcomes);
          const payload={
            N_patient:Npatient,
            pre:{age:preData.age,nihss:preData.nihss,ltsw:preData.ltsw,premrs:preData.premrs},
            trials:trialsForSheet,
            TEV: tev, mTICI: mtici, TIV: tiv, Notes: notes
          };
          sendToSheet(payload);
          openModal("Saved","Saved to Google Sheet ✅");
        }

        document.addEventListener('input',(e)=>{ if(e.target && (e.target.id==='patientNumber' || e.target.id==='notesField')) buildShareMessage(); });
        document.addEventListener('change',(e)=>{
  const t = e.target;
  if (!t) return;

  if (t.name === 'tev') {
    updateMticiVisibility();
    buildShareMessage();
  } else if (t.name === 'tiv' || t.id === 'mtici') {
    buildShareMessage();
  }
});
document.addEventListener('change',(e)=>{
  if (e.target && e.target.closest('#targetVesselGroup') && e.target.type === 'checkbox') {
    updateTargetVesselSummary();
  }
});
document.addEventListener('DOMContentLoaded', ()=>{
  updateTargetVesselSummary();
});



        function copyMessage(){ const ta=document.getElementById('shareMessage'); ta.select(); ta.setSelectionRange(0,99999); document.execCommand('copy'); openModal("Copied","Message copied to clipboard."); }
        function shareWhatsApp(){ const msg=document.getElementById('shareMessage').value; const url="https://wa.me/?text="+encodeURIComponent(msg); window.open(url,"_blank"); }

        /* ======= SHARE (POST-ACUTE) ======= */
        function proceedToShareChronic(){
          const checks = Array.from(document.querySelectorAll('.study-checkbox-chronic')).filter(c=>c.checked).map(c=>c.value);
          selectedChronic = checks;
          studyChronicOutcomes = {};
          selectedChronic.forEach(s=>{ studyChronicOutcomes[s]="intervention"; });

          const container = document.getElementById('studyChronicOutcomesContainer');
          container.innerHTML = "";
          selectedChronic.forEach(s=>{
            const l=document.createElement('div'); l.textContent = s;
            const sel=document.createElement('select'); sel.dataset.study=s;
            sel.innerHTML=`<option value="intervention">intervention</option><option value="control">control</option>`;
            sel.addEventListener('change',e=>{ studyChronicOutcomes[e.target.dataset.study]=e.target.value; buildShareMessageChronic(); });
            container.appendChild(l); container.appendChild(sel);
          });
          buildShareMessageChronic(); showPage('shareChronicPage');
        }

        function buildShareMessageChronic(){
          const pn=(document.getElementById('patientNumber2')?.value||"").trim()||"Patient record";
          const lines=selectedChronic.map(study=>{
            const outcome=studyChronicOutcomes[study]||"intervention";
            return `${pn}, age ${isFinite(preData.age)?preData.age:"?"}, NIHSS ${isFinite(preData.nihss)?preData.nihss:"?"}, mRS ${isFinite(preData.premrs)?preData.premrs:"?"}, ${study} (${outcome})`;
          });
          const ta=document.getElementById('shareMessage2'); if(ta) ta.value=lines.join('\n');
        }

        function saveToSheetChronic(){
          const Npatient=(document.getElementById('patientNumber2')?.value||"").trim();
          if(!Npatient){ openModal("Missing field","Enter the <strong>patient record number</strong> before saving."); return; }
          if(typeof preData.age==="undefined"||typeof preData.nihss==="undefined"||typeof preData.ltsw==="undefined"||typeof preData.premrs==="undefined"){
            openModal("Incomplete Pre-Imaging","Complete Pre-Imaging first (Age, NIHSS, LTSW, pre-mRS)."); return; }
          const t = Object.fromEntries(SHEET_TRIAL_KEYS.map(k=>[k,"no"]));
          if(selectedChronic.includes("Librexia")){
            t.LIBREXIA = studyChronicOutcomes["Librexia"] || "intervention";
          }
          const payload={
            N_patient:Npatient,
            pre:{age:preData.age,nihss:preData.nihss,ltsw:preData.ltsw,premrs:preData.premrs},
            trials:t,
            TEV:"", mTICI:"", TIV:"", Notes:""
          };
          sendToSheet(payload);
          openModal("Saved","Saved to Google Sheet ✅");
        }

        document.addEventListener('input',(e)=>{ if(e.target && e.target.id==='patientNumber2') buildShareMessageChronic(); });

        function copyMessageChronic(){ const ta=document.getElementById('shareMessage2'); ta.select(); ta.setSelectionRange(0,99999); document.execCommand('copy'); openModal("Copied","Message copied to clipboard."); }
        function shareWhatsAppChronic(){ const msg=document.getElementById('shareMessage2').value; const url="https://wa.me/?text="+encodeURIComponent(msg); window.open(url,"_blank"); }
