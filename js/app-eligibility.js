        /* ======= PRE / POST logic (existing) ======= */
        function submitPreImaging(){
          Object.keys(reasons).forEach(k=>{ reasons[k].meet=[]; reasons[k].fail=[]; });

          preData.age=parseInt(document.getElementById('age').value);
          preData.nihss=parseInt(document.getElementById('nihss').value);
          preData.premrs=parseInt(document.getElementById('premrs').value);
          const ltswInput=document.getElementById('ltsw').value;
          if(!ltswInput){ openModal("Missing field","Please enter <strong>Last Seen Well</strong>."); return; }
          const lastSeen=new Date(ltswInput), now=new Date();
          if(lastSeen>now){ openModal("Invalid time","<strong>LTSW</strong> cannot be in the future."); return; }
          preData.ltsw=(now-lastSeen)/(1000*60*60);
          preData.wakeupStroke=!!document.getElementById('wakeupStroke')?.checked;
          preData.angiograph=document.getElementById('angiograph').value;
          preData.doac=document.getElementById('doac').value;
          preData.acei=document.getElementById('acei').value;

          const okWT = AcuteEligibilityRules.weTrust({
            age: preData.age,
            nihss: preData.nihss,
            premrs: preData.premrs,
            ltsw: preData.ltsw,
            wakeupStroke: preData.wakeupStroke,
            wakeupSymptomsWithin6h: preData.wakeupStroke,
            angiograph: preData.angiograph
          });
          eligibility.weTrust = okWT;

          (preData.age>=18?reasons.weTrust.meet:reasons.weTrust.fail).push(preData.age>=18?"Age ≥18":"Age <18");
          (preData.nihss>=10?reasons.weTrust.meet:reasons.weTrust.fail).push(preData.nihss>=10?"NIHSS ≥10":"NIHSS <10");
          (preData.premrs<=2?reasons.weTrust.meet:reasons.weTrust.fail).push(preData.premrs<=2?"pre-mRS ≤2":"pre-mRS >2");
          const weTrustWindowOk = preData.wakeupStroke ? (preData.ltsw<=12) : (preData.ltsw<=6);
          (weTrustWindowOk?reasons.weTrust.meet:reasons.weTrust.fail).push(
            preData.wakeupStroke
              ? (weTrustWindowOk ? "Wake-up stroke: LTSW <=12h and symptoms <=6h" : "Wake-up stroke window not met")
              : (weTrustWindowOk ? "LTSW <=6h" : "LTSW >6h")
          );
          (preData.angiograph==='yes'?reasons.weTrust.meet:reasons.weTrust.fail).push(preData.angiograph==='yes'?"Philips angiograph available":"Philips angiograph not available");

          document.getElementById('weTrustResultMessage').innerHTML = okWT ? "Eligible for WeTrust." : "Not eligible for WeTrust.";
          document.getElementById('doacAlert').style.display=(preData.doac==='yes')?'block':'none';
          document.getElementById('weTrustRandomizeBtn').style.display= okWT ? "inline-block" : "none";
          showPage('preResult');
        }
        function continueAfterWeTrust(){ showPage('postImaging'); }
        function openWeTrustRandomization(){ window.open('https://wetrust.eu1.phsdp.com/login','_blank'); }

        function markRadioSelected(groupEl){
          if(!groupEl) return;
          groupEl.querySelectorAll('.radio').forEach(l=>l.classList.remove('selected'));
          const checked = groupEl.querySelector('input[type=radio]:checked');
          if(checked) checked.closest('.radio').classList.add('selected');
        }
        function selectStrokeType(value){
          postData.strokeType=value;
          markRadioSelected(document.getElementById('strokeTypeGroup'));
          if(value==="ischemic"){
            document.getElementById("ischemicSection").style.display='block';
            document.getElementById("hemorrhagicSection").style.display='none';
            updateIschemicWorkupVisibility();
          } else {
            document.getElementById("ischemicSection").style.display='none';
            document.getElementById("hemorrhagicSection").style.display='block'; updateHemorrhagicSection();
          }
        }
        function updateIschemicWorkupVisibility(){
          const showWorkup = (postData.candidate==="eligible" || postData.ivtCandidate==="eligible");
          document.getElementById("evtSection").style.display = showWorkup ? 'block' : 'none';
          document.getElementById("nonEvtConfirm").style.display = (postData.candidate==="not eligible") ? 'block' : 'none';
        }
        function selectCandidate(label){
          postData.candidate=label;
          markRadioSelected(document.getElementById('candidateGroup'));
          updateIschemicWorkupVisibility();
        }
        function selectIvtCandidate(label){
          postData.ivtCandidate=label;
          markRadioSelected(document.getElementById('ivtCandidateGroup'));
          updateIschemicWorkupVisibility();
        }
        function selectHem(q,v){
          hemData[q]=v;
          const map={ivh:"ivhGroup",seizure:"seizureGroup",brainstem:"brainstemGroup",procoagulant:"procoagulantGroup",ecg:"ecgGroup",thrombosis:"thrombosisGroup",pregnancy:"pregnancyGroup",angioplasty:"angioplastyGroup",ivhScore:"ivhScoreGroup"};
          markRadioSelected(document.getElementById(map[q]));
        }
        function updateHemorrhagicSection(){ document.getElementById("fastestSection").style.display=(preData.ltsw<2 && preData.premrs<=2)?'block':'none'; }

        /* ======= (rest of existing trial logic, summary, share, etc.) ======= */
        function submitPostImaging(){
          if(!postData.strokeType){ openModal("Missing field","Please select a <strong>Stroke type</strong>."); return; }
          Object.keys(reasons).forEach(k=>{ if(k!=="weTrust"){ reasons[k].meet=[]; reasons[k].fail=[]; } });

          // SAFER-DOAC
          eligibility.saferdoac = (preData.doac === 'yes');
          if(eligibility.saferdoac){
            reasons.saferdoac.meet.push("On DOAC/NOAC");
            reasons.saferdoac.meet.push("Chest CTA + drug levels indicated");
          }else{ reasons.saferdoac.fail.push("Not on DOAC/NOAC"); }

          if(postData.strokeType === "ischemic"){
            eligibility.fastest = false; reasons.fastest.fail.push("Not a hemorrhage (ischemic stroke)");
            eligibility.tich3   = false; reasons.tich3.fail.push("Not a hemorrhage (ischemic stroke)");

            if(!postData.candidate){ openModal("Missing field","Please select if the patient is a <strong>thrombectomy candidate</strong>."); return; }
            if(!postData.ivtCandidate){ openModal("Missing field","Please select if the patient has an <strong>IVT indication</strong>."); return; }

            const tandem = (document.getElementById('tandem')||{}).value || "no";
const tortuosity = (document.getElementById('tortuosity')||{}).value || "";
const targetVessels = Array.from(document.querySelectorAll('#targetVesselGroup input[type="checkbox"]:checked')).map(i => i.value);
const contraTpa = (document.getElementById('contraTpa')||{}).value || "no";
const aspects = parseInt((document.getElementById('aspects')||{}).value);

for(const k of Object.keys(notIndicated)) notIndicated[k]=false;

const vesselFlags = AcuteEligibilityRules.computeVesselFlags(targetVessels);
const vanishVesselOk = vesselFlags.vanish;
const pivotalVesselOk = vesselFlags.pivotal;
const mosteVesselOk = vesselFlags.moste;
const twinVesselOk = vesselFlags.twin2win2;
const artemisVesselOk = vesselFlags.artemis;
const hyberniaVesselOk = vesselFlags.hybernia;
const promiseVesselOk = vesselFlags.promise;
const nivoVesselOk = vesselFlags.nivo;

            const lvo = (postData.candidate === "eligible") ? "yes" : "no";

            /* ATHENA */
            if(tortuosity===""){
              eligibility.athena=false; notIndicated.athena=true;
              reasons.athena.fail.push("Provide tortuosity (ATHENA requires tortuosity = No)");
            }else{
              const okAth = AcuteEligibilityRules.athena({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, tandem, tortuosity, targetVessels });
              eligibility.athena = okAth;

              (preData.age>=22 && preData.age<=85?reasons.athena.meet:reasons.athena.fail).push((preData.age>=22&&preData.age<=85)?"Age 22–85":"Age not 22–85");
              (preData.nihss>=8?reasons.athena.meet:reasons.athena.fail).push(preData.nihss>=8?"NIHSS ≥8":"NIHSS <8");
              (preData.premrs<=2?reasons.athena.meet:reasons.athena.fail).push(preData.premrs<=2?"pre-mRS ≤2":"pre-mRS >2");
              (preData.ltsw<=24?reasons.athena.meet:reasons.athena.fail).push(preData.ltsw<=24?"LTSW ≤24h":"LTSW >24h");
              (lvo==="yes"?reasons.athena.meet:reasons.athena.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
              (tandem==="no"?reasons.athena.fail:reasons.athena.meet).push(tandem==="no"?"Tandem = No":"Tandem = Yes");
              (tortuosity==="no"?reasons.athena.meet:reasons.athena.fail).push(tortuosity==="no"?"Tortuosity = No":"Tortuosity = Yes");
            }

            /* VANISH */
            const okVanish = AcuteEligibilityRules.vanish({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, lvo, targetVessels });
            eligibility.vanish = okVanish;
            (preData.age>=18?reasons.vanish.meet:reasons.vanish.fail).push(preData.age>=18?"Age ≥18":"Age <18");
            (preData.premrs<=1?reasons.vanish.meet:reasons.vanish.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss>=6?reasons.vanish.meet:reasons.vanish.fail).push(preData.nihss>=6?"NIHSS ≥6":"NIHSS <6");
            (lvo==="yes"?reasons.vanish.meet:reasons.vanish.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (vanishVesselOk?reasons.vanish.meet:reasons.vanish.fail).push(vanishVesselOk?"Vessel ICA-T/M1":"Vessel not ICA-T/M1");

            /* PIVOTAL */
            const okPivotal = AcuteEligibilityRules.pivotal({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, targetVessels });
            eligibility.pivotal = okPivotal;
            (preData.ltsw<8?reasons.pivotal.meet:reasons.pivotal.fail).push(preData.ltsw<8?"LTSW <8h":"LTSW ≥8h");
            (preData.age>=18 && preData.age<=80?reasons.pivotal.meet:reasons.pivotal.fail).push((preData.age>=18&&preData.age<=80)?"Age 18–80":"Age not 18–80");
            (preData.premrs<=1?reasons.pivotal.meet:reasons.pivotal.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss>=6?reasons.pivotal.meet:reasons.pivotal.fail).push(preData.nihss>=6?"NIHSS ≥6":"NIHSS <6");
            (lvo==="yes"?reasons.pivotal.meet:reasons.pivotal.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (pivotalVesselOk?reasons.pivotal.meet:reasons.pivotal.fail).push(pivotalVesselOk?"Vessel ICA-T/M1/Basilar":"Vessel not allowed");

            /* PROMISE */
const okPromise = AcuteEligibilityRules.promise({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, targetVessels });
eligibility.promise = okPromise;

(preData.ltsw <= 24 ? reasons.promise.meet : reasons.promise.fail)
  .push(preData.ltsw <= 24 ? "LTSW ≤24h" : "LTSW >24h");

(preData.age >= 18 ? reasons.promise.meet : reasons.promise.fail)
  .push(preData.age >= 18 ? "Age ≥18" : "Age <18");

(preData.premrs <= 2 ? reasons.promise.meet : reasons.promise.fail)
  .push(preData.premrs <= 2 ? "pre-mRS ≤2" : "pre-mRS >2");

(preData.nihss >= 1 ? reasons.promise.meet : reasons.promise.fail)
  .push(preData.nihss >= 1 ? "NIHSS ≥1" : "NIHSS <1");

(lvo === "yes" ? reasons.promise.meet : reasons.promise.fail)
  .push(lvo === "yes" ? "Thrombectomy candidate" : "Not thrombectomy candidate");

(promiseVesselOk ? reasons.promise.meet : reasons.promise.fail)
  .push(promiseVesselOk ? "ICA-T/M1/M2 occlusion" : "Vessel not allowed for PROMISE");
  /* NiVO */
const okNivo = AcuteEligibilityRules.nivo({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, aspects, targetVessels });
eligibility.nivo = okNivo;

(preData.age >= 18 ? reasons.nivo.meet : reasons.nivo.fail).push(preData.age >= 18 ? "Age ≥18" : "Age <18");
(preData.ltsw <= 24 ? reasons.nivo.meet : reasons.nivo.fail).push(preData.ltsw <= 24 ? "LTSW ≤24h" : "LTSW >24h");
(preData.nihss >= 5 ? reasons.nivo.meet : reasons.nivo.fail).push(preData.nihss >= 5 ? "NIHSS ≥5" : "NIHSS <5");
(preData.premrs <= 2 ? reasons.nivo.meet : reasons.nivo.fail).push(preData.premrs <= 2 ? "pre-mRS ≤2" : "pre-mRS >2");
(lvo === "yes" ? reasons.nivo.meet : reasons.nivo.fail).push(lvo === "yes" ? "Thrombectomy candidate" : "Not thrombectomy candidate");
(nivoVesselOk ? reasons.nivo.meet : reasons.nivo.fail).push(nivoVesselOk ? "Target vessel: >M2 or A2/>A2 or P1/>P1" : "Target vessel not allowed");
(targetVessels.length<=1 ? reasons.nivo.meet : reasons.nivo.fail).push(targetVessels.length<=1 ? "Single vessel occlusion" : "More than one vessel selected");
(!Number.isNaN(aspects) && aspects >= 6 ? reasons.nivo.meet : reasons.nivo.fail)
  .push(!Number.isNaN(aspects) && aspects >= 6 ? "ASPECTS ≥6" : "ASPECTS <6 or missing");


            /* MOSTE */
            const okMoste = AcuteEligibilityRules.moste({ nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, targetVessels });
            eligibility.moste = okMoste;
            (preData.ltsw<23?reasons.moste.meet:reasons.moste.fail).push(preData.ltsw<23?"LTSW <23h":"LTSW ≥23h");
            (preData.premrs<=1?reasons.moste.meet:reasons.moste.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss<6?reasons.moste.meet:reasons.moste.fail).push(preData.nihss<6?"NIHSS <6":"NIHSS ≥6");
            (lvo==="yes"?reasons.moste.meet:reasons.moste.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (mosteVesselOk?reasons.moste.meet:reasons.moste.fail).push(mosteVesselOk?"Vessel ICA-T/M1/M2":"Vessel not allowed");

            /* TWIN-2-WIN 2 */
            const okTwin = AcuteEligibilityRules.twin2win2({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, targetVessels });
            eligibility.twin2win2 = okTwin;
            (preData.ltsw<24?reasons.twin2win2.meet:reasons.twin2win2.fail).push(preData.ltsw<24?"LTSW <24h":"LTSW ≥24h");
            (preData.age>18?reasons.twin2win2.meet:reasons.twin2win2.fail).push(preData.age>18?"Age >18":"Age ≤18");
            (preData.premrs<=2?reasons.twin2win2.meet:reasons.twin2win2.fail).push(preData.premrs<=2?"pre-mRS ≤2":"pre-mRS >2");
            (preData.nihss>=6?reasons.twin2win2.meet:reasons.twin2win2.fail).push(preData.nihss>=6?"NIHSS ≥6":"NIHSS <6");
            (lvo==="yes"?reasons.twin2win2.meet:reasons.twin2win2.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (twinVesselOk?reasons.twin2win2.meet:reasons.twin2win2.fail).push(twinVesselOk?"Vessel ICA-T/M1/Basilar":"Vessel not allowed");

            /* ARTEMIS */
            const okArtemis = AcuteEligibilityRules.artemis({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, aspects, targetVessels });
            eligibility.artemis = okArtemis;
            (preData.ltsw<24?reasons.artemis.meet:reasons.artemis.fail).push(preData.ltsw<24?"LTSW <24h":"LTSW ≥24h");
            (preData.age>=18 && preData.age<=85?reasons.artemis.meet:reasons.artemis.fail).push((preData.age>=18&&preData.age<=85)?"Age 18–85":"Age not 18–85");
            (preData.premrs<=2?reasons.artemis.meet:reasons.artemis.fail).push(preData.premrs<=2?"pre-mRS ≤2":"pre-mRS >2");
            (preData.nihss>=6 && preData.nihss<=25?reasons.artemis.meet:reasons.artemis.fail).push((preData.nihss>=6&&preData.nihss<=25)?"NIHSS 6–25":"NIHSS out of range");
            (lvo==="yes"?reasons.artemis.meet:reasons.artemis.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (artemisVesselOk?reasons.artemis.meet:reasons.artemis.fail).push(artemisVesselOk?"Allowed vessel":"Vessel not allowed");
            (!Number.isNaN(aspects) && aspects>5 ? reasons.artemis.meet : reasons.artemis.fail)
              .push(!Number.isNaN(aspects) && aspects>5 ? "ASPECTS >5" : "ASPECTS not >5 or missing");

            /* HYBERNIA */
            const okHyber = AcuteEligibilityRules.hybernia({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo, aspects, targetVessels });
            eligibility.hybernia = okHyber;
            (preData.ltsw<24?reasons.hybernia.meet:reasons.hybernia.fail).push(preData.ltsw<24?"LTSW <24h":"LTSW ≥24h");
            (preData.age>=18 && preData.age<=89?reasons.hybernia.meet:reasons.hybernia.fail).push((preData.age>=18&&preData.age<=89)?"Age 18–89":"Age not 18–89");
            (preData.premrs<=1?reasons.hybernia.meet:reasons.hybernia.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss>=6?reasons.hybernia.meet:reasons.hybernia.fail).push(preData.nihss>=6?"NIHSS ≥6":"NIHSS <6");
            (lvo==="yes"?reasons.hybernia.meet:reasons.hybernia.fail).push(lvo==="yes"?"Thrombectomy candidate":"Not thrombectomy candidate");
            (hyberniaVesselOk?reasons.hybernia.meet:reasons.hybernia.fail).push(hyberniaVesselOk?"Allowed vessel":"Vessel not allowed");
            (!Number.isNaN(aspects) && aspects>4 ? reasons.hybernia.meet : reasons.hybernia.fail)
              .push(!Number.isNaN(aspects) && aspects>4 ? "ASPECTS >4" : "ASPECTS not >4 or missing");

            /* DONE SYMPLE */
            const okDone = AcuteEligibilityRules.doneSymple({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lvo });
            eligibility.doneSymple = okDone;
            (preData.ltsw>=24 && preData.ltsw<=72 ? reasons.doneSymple.meet : reasons.doneSymple.fail)
              .push(preData.ltsw>=24 && preData.ltsw<=72 ? "Window 24–72h" : (preData.ltsw<24?"LTSW <24h":"LTSW >72h"));
            (preData.age>=18 && preData.age<=80 ? reasons.doneSymple.meet : reasons.doneSymple.fail)
              .push(preData.age>=18 && preData.age<=80 ? "Age 18–80" : "Age not 18–80");
            (preData.premrs<=1 ? reasons.doneSymple.meet : reasons.doneSymple.fail)
              .push(preData.premrs<=1 ? "pre-mRS ≤1" : "pre-mRS >1");
            (preData.nihss>=8 ? reasons.doneSymple.meet : reasons.doneSymple.fail)
              .push(preData.nihss>=8 ? "NIHSS ≥8" : "NIHSS <8");
            (lvo==="yes" ? reasons.doneSymple.meet : reasons.doneSymple.fail)
              .push(lvo==="yes" ? "Thrombectomy candidate" : "Not thrombectomy candidate");

            /* SHIONOGI */
            const lesionConfirmed = (postData.candidate==="eligible") ? "yes" : ((document.getElementById('lesionConfirmed')||{}).value||"no");
            const shioOk = AcuteEligibilityRules.shionogi({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lesionConfirmed });
            eligibility.shionogi = shioOk;
            (preData.ltsw<25?reasons.shionogi.meet:reasons.shionogi.fail).push(preData.ltsw<25?"LTSW <25h":"LTSW ≥25h");
            (preData.age>18?reasons.shionogi.meet:reasons.shionogi.fail).push(preData.age>18?"Age >18":"Age ≤18");
            (preData.premrs<=1?reasons.shionogi.meet:reasons.shionogi.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss>=6 && preData.nihss<=22?reasons.shionogi.meet:reasons.shionogi.fail).push((preData.nihss>=6&&preData.nihss<=22)?"NIHSS 6–22":"NIHSS out of 6–22");
            (lesionConfirmed==="yes"?reasons.shionogi.meet:reasons.shionogi.fail).push(lesionConfirmed==="yes"?"Imaging lesion confirmed":"Imaging lesion not confirmed");

            /* SOVATELTIDE */
            const sovaOk = AcuteEligibilityRules.sovateltide({ candidate: postData.candidate, age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, lesionConfirmed: (document.getElementById('lesionConfirmed')||{}).value||"no" });
            eligibility.sovateltide = sovaOk;
            (postData.candidate==="not eligible"?reasons.sovateltide.meet:reasons.sovateltide.fail).push(postData.candidate==="not eligible"?"No thrombectomy":"Thrombectomy candidate");
            (preData.ltsw<24?reasons.sovateltide.meet:reasons.sovateltide.fail).push(preData.ltsw<24?"LTSW <24h":"LTSW ≥24h");
            (preData.age>=18 && preData.age<=80?reasons.sovateltide.meet:reasons.sovateltide.fail).push((preData.age>=18&&preData.age<=80)?"Age 18–80":"Age not 18–80");
            (preData.premrs<=2?reasons.sovateltide.meet:reasons.sovateltide.fail).push(preData.premrs<=2?"pre-mRS ≤2":"pre-mRS >2");
            (((document.getElementById('lesionConfirmed')||{}).value==="yes")?reasons.sovateltide.meet:reasons.sovateltide.fail).push(((document.getElementById('lesionConfirmed')||{}).value==="yes")?"Imaging lesion confirmed":"Imaging lesion not confirmed");
            (preData.nihss>=8 && preData.nihss<20?reasons.sovateltide.meet:reasons.sovateltide.fail).push((preData.nihss>=8 && preData.nihss<20)?"NIHSS 8–19":"NIHSS not 8–19");

            /* ORION */
            const noContra = (contraTpa==="no");
            const orionOk = AcuteEligibilityRules.orion({ age: preData.age, nihss: preData.nihss, premrs: preData.premrs, ltsw: preData.ltsw, contraTpa, targetVessels });
            eligibility.orion = orionOk;
            (preData.ltsw>=4.5 && preData.ltsw<=24?reasons.orion.meet:reasons.orion.fail).push((preData.ltsw>=4.5&&preData.ltsw<=24)?"LTSW 4.5–24h":"LTSW outside 4.5–24h");
            (preData.age>=18 && preData.age<=90?reasons.orion.meet:reasons.orion.fail).push((preData.age>=18&&preData.age<=90)?"Age 18–90":"Age not 18–90");
            (preData.premrs<=1?reasons.orion.meet:reasons.orion.fail).push(preData.premrs<=1?"pre-mRS ≤1":"pre-mRS >1");
            (preData.nihss>5?reasons.orion.meet:reasons.orion.fail).push(preData.nihss>5?"NIHSS >5":"NIHSS ≤5");
            (noContra?reasons.orion.meet:reasons.orion.fail).push(noContra?"No thrombolysis contraindication":"Thrombolysis contraindication present");
            (targetVessels.length>=1?reasons.orion.meet:reasons.orion.fail).push(targetVessels.length>=1?"At least one target vessel occluded":"No target vessel selected");

            /* DO-IT */
            const okDoit = AcuteEligibilityRules.doit({
              age: preData.age,
              ltsw: preData.ltsw,
              doac: preData.doac,
              ivtCandidate: postData.ivtCandidate
            });
            eligibility.doit = okDoit;
            (preData.age>=18?reasons.doit.meet:reasons.doit.fail).push(preData.age>=18?"Age >=18":"Age <18");
            (preData.ltsw<=4.5?reasons.doit.meet:reasons.doit.fail).push(preData.ltsw<=4.5?"LTSW <=4.5h":"LTSW >4.5h");
            (preData.doac==="yes"?reasons.doit.meet:reasons.doit.fail).push(preData.doac==="yes"?"DOAC in previous 48h":"No DOAC in previous 48h");
            (postData.ivtCandidate==="eligible"?reasons.doit.meet:reasons.doit.fail).push(postData.ivtCandidate==="eligible"?"IVT indication present":"No IVT indication");

            /* REMEDY */
            const remedyExcludedVessel =
              targetVessels.includes("ica-intracranial") ||
              targetVessels.includes("ica-terminal") ||
              targetVessels.includes("m1") ||
              targetVessels.includes("va") ||
              targetVessels.includes("basilar");

            const okRemedy = AcuteEligibilityRules.remedy({
              age: preData.age,
              nihss: preData.nihss,
              premrs: preData.premrs,
              ltsw: preData.ltsw,
              candidate: postData.candidate,
              targetVessels,
              aspects,
              acei: preData.acei
            });
            eligibility.remedy = okRemedy;
            (preData.ltsw<24?reasons.remedy.meet:reasons.remedy.fail).push(preData.ltsw<24?"LTSW <24h":"LTSW >=24h");
            (preData.age>=18 && preData.age<=90?reasons.remedy.meet:reasons.remedy.fail).push((preData.age>=18 && preData.age<=90)?"Age 18-90":"Age not 18-90");
            (preData.premrs<=1?reasons.remedy.meet:reasons.remedy.fail).push(preData.premrs<=1?"pre-mRS <=1":"pre-mRS >1");
            (preData.nihss>=5 && preData.nihss<=15?reasons.remedy.meet:reasons.remedy.fail).push((preData.nihss>=5 && preData.nihss<=15)?"NIHSS 5-15":"NIHSS outside 5-15");
            (postData.candidate==="not eligible"?reasons.remedy.meet:reasons.remedy.fail).push(postData.candidate==="not eligible"?"No TEV (not thrombectomy candidate)":"TEV/thrombectomy candidate");
            (!remedyExcludedVessel?reasons.remedy.meet:reasons.remedy.fail).push(!remedyExcludedVessel?"No excluded vessel (ICA intracranial/ICA-T/M1/VA/Basilar)":"Excluded vessel selected");
            (!Number.isNaN(aspects) && aspects>=6?reasons.remedy.meet:reasons.remedy.fail).push(!Number.isNaN(aspects) && aspects>=6?"ASPECTS >=6":"ASPECTS <6 or missing");
            (preData.acei!=="yes"?reasons.remedy.meet:reasons.remedy.fail).push(preData.acei!=="yes"?"No ACE inhibitor (IECA) use":"ACE inhibitor (IECA) use");

            showSummary();
            return;
          }

          if(postData.strokeType === "hemorrhagic"){
            const hemVolume = parseFloat(document.getElementById('hemVolume').value);
            const gcs = parseInt(document.getElementById('gcs').value);
            const secondaryCause = document.getElementById('secondaryCause').value;
            if(isNaN(gcs)||!hemData.ivh||!hemData.seizure){
              openModal("Missing fields","Please complete all <strong>hemorrhagic</strong> questions."); return;
            }

            ["athena","vanish","pivotal","moste","twin2win2","artemis","hybernia","doneSymple","shionogi","sovateltide","orion","doit","remedy","promise"].forEach(k=>{
  eligibility[k]=false;
  reasons[k].fail.push("Not an ischemic stroke (hemorrhagic stroke)");
});

            /* FASTEST */
            let fastestEligible=false;
            const anticoag = document.getElementById('anticoagulantTherapy').value;
            if(preData.ltsw<=2 && preData.premrs<=2 && preData.age>=18 && preData.age<=80){
              const extraMissing = !hemData.brainstem || !hemData.procoagulant || !hemData.ecg ||
                                   !hemData.thrombosis || !hemData.pregnancy || !hemData.angioplasty || !hemData.ivhScore;
              if(extraMissing){
                reasons.fastest.fail.push("Complete FASTEST additional questions");
              }else{
                reasons.fastest.meet.push("LTSW ≤2h");
                reasons.fastest.meet.push("pre-mRS ≤2");
                reasons.fastest.meet.push("Age 18–80");

                (gcs>=8?reasons.fastest.meet:reasons.fastest.fail).push(gcs>=8?"GCS ≥8":"GCS <8");
                (hemVolume>=2 && hemVolume<60?reasons.fastest.meet:reasons.fastest.fail).push(hemVolume>=2&&hemVolume<60?"Volume 2–60 mL":"Volume outside 2–60 mL");
                (hemData.brainstem==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.brainstem==="no"?"No brainstem hemorrhage":"Brainstem hemorrhage");
                (hemData.procoagulant==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.procoagulant==="no"?"No procoagulants 24h":"Procoagulants used");
                (hemData.ecg==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.ecg==="no"?"ECG without MI/ST↑":"ECG with MI/ST↑");
                (hemData.thrombosis==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.thrombosis==="no"?"No thrombosis 90d":"Thrombosis in last 90d");
                (hemData.pregnancy==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.pregnancy==="no"?"Not pregnant":"Pregnancy/gestation");
                (hemData.angioplasty==="no"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.angioplasty==="no"?"No PTA/stent 90d":"PTA/stent within 90d");
                (hemData.ivhScore==="yes"?reasons.fastest.meet:reasons.fastest.fail).push(hemData.ivhScore==="yes"?"IVH score acceptable":"IVH score not acceptable");
                (anticoag==="none"?reasons.fastest.meet:reasons.fastest.fail).push(anticoag==="none"?"No anticoagulant therapy":"On anticoagulant therapy");

                fastestEligible = (reasons.fastest.fail.length===0);
              }
            }else{
              if(preData.ltsw>2) reasons.fastest.fail.push("LTSW >2h");
              if(preData.premrs>2) reasons.fastest.fail.push("pre-mRS >2");
              if(preData.age<18 || preData.age>80) reasons.fastest.fail.push("Age not 18–80");
            }
            const fastestEval = HemorrhagicEligibilityRules.fastest({
              age: preData.age,
              premrs: preData.premrs,
              ltsw: preData.ltsw,
              hemVolume,
              gcs,
              brainstem: hemData.brainstem,
              procoagulant: hemData.procoagulant,
              ecg: hemData.ecg,
              thrombosis: hemData.thrombosis,
              pregnancy: hemData.pregnancy,
              angioplasty: hemData.angioplasty,
              ivhScore: hemData.ivhScore,
              anticoag
            });
            fastestEligible = fastestEval.eligible;
            eligibility.fastest = fastestEligible;

            /* TICH-3 */
            const tichOk = HemorrhagicEligibilityRules.tich3({ ltsw: preData.ltsw, hemVolume, ivh: hemData.ivh, gcs, seizure: hemData.seizure, secondaryCause });

            (preData.ltsw<4.5?reasons.tich3.meet:reasons.tich3.fail).push(preData.ltsw<4.5?"LTSW <4.5h":"LTSW ≥4.5h");
            (hemVolume<60?reasons.tich3.meet:reasons.tich3.fail).push(hemVolume<60?"Volume <60 mL":"Volume ≥60 mL");
            (hemData.ivh==="no"?reasons.tich3.meet:reasons.tich3.fail).push(hemData.ivh==="no"?"Not isolated IVH":"Isolated IVH");
            (gcs>=5?reasons.tich3.meet:reasons.tich3.fail).push(gcs>=5?"GCS ≥5":"GCS <5");
            (hemData.seizure==="no"?reasons.tich3.meet:reasons.tich3.fail).push(hemData.seizure==="no"?"No active seizures/contraindications":"Seizures/contraindications present");
            (secondaryCause==="None"?reasons.tich3.meet:reasons.tich3.fail).push(secondaryCause==="None"?"No secondary cause":"Secondary cause present");

            eligibility.tich3 = tichOk;

            showSummary();
          }
        }

        function summaryRowHtml(name, ok, key, ni, link, paused=false){
          const nameLabel = paused ? `${name} (paused)` : name;
          const nameHtml = (ok && link) ? `<a class="study-name" href="${link}" target="_blank">${nameLabel}</a>` : `<span class="study-name">${nameLabel}</span>`;
          const checkboxHtml = (ok && !paused) ? `<input type="checkbox" class="study-checkbox" value="${name}" title="Select ${name}">` : `<input type="checkbox" disabled title="${paused?'Paused':(ni?'Not indicated':'Not eligible')}">`;
          const statusHtml = paused ? `<span class="tag tag-ni">Paused</span>` : (ni ? `<span class="tag tag-ni">Not indicated</span>` : `<span class="${ok?'ok':'no'}">${ok?'Eligible':'Not eligible'}</span>`);
          const infoBtn = `<button type="button" class="btn btn-small" onclick="showInfo('${key}')">Info</button>`;
          return `${checkboxHtml}${nameHtml}${statusHtml}${infoBtn}`;
        }

        function showSummary(){
          const items = [
  ["WeTrust",eligibility.weTrust,"weTrust",false, randomizationLinks["WeTrust"], false],
  ["ATHENA",eligibility.athena,"athena",notIndicated.athena, randomizationLinks["ATHENA"], true],
  ["VANISH",eligibility.vanish,"vanish",notIndicated.vanish, randomizationLinks["VANISH"], false],
  ["PIVOTAL",eligibility.pivotal,"pivotal",notIndicated.pivotal, randomizationLinks["PIVOTAL"], true],
  ["PROMISE",eligibility.promise,"promise",notIndicated.promise, null, false],
  ["NiVO",eligibility.nivo,"nivo",notIndicated.nivo, null, false],
  ["MOSTE",eligibility.moste,"moste",notIndicated.moste, randomizationLinks["MOSTE"], false],
  ["TWIN-2-WIN 2",eligibility.twin2win2,"twin2win2",notIndicated.twin2win2, randomizationLinks["TWIN-2-WIN 2"], false],
  ["ARTEMIS",eligibility.artemis,"artemis",notIndicated.artemis, randomizationLinks["ARTEMIS"], false],
  ["HYBERNIA",eligibility.hybernia,"hybernia",notIndicated.hybernia, randomizationLinks["HYBERNIA"], true],
  ["DONE SYMPLE",eligibility.doneSymple,"doneSymple",notIndicated.doneSymple, randomizationLinks["DONE SYMPLE"], false],
  ["SHIONOGI",eligibility.shionogi,"shionogi",false, null, false],
  ["SOVATELTIDE",eligibility.sovateltide,"sovateltide",false, null, false],
  ["ORION",eligibility.orion,"orion",false, null, false],
  ["DO-IT",eligibility.doit,"doit",false, null, false],
  ["REMEDY",eligibility.remedy,"remedy",false, null, false],
  ["FASTEST",eligibility.fastest,"fastest",false, null, false],
  ["TICH-3",eligibility.tich3,"tich3",false, null, false],
  ["SAFER-DOAC",eligibility.saferdoac,"saferdoac",false, null, false]
];


          const ul = document.getElementById('summaryContent'); ul.innerHTML="";
          items.forEach(([name,ok,key,ni,link,paused])=>{
            const li = document.createElement('li');
            li.innerHTML = summaryRowHtml(name, ok, key, ni, link, paused);
            ul.appendChild(li);
          });

          const summaryAlerts = document.getElementById('summaryAlerts');
          if(summaryAlerts){
            const alerts = [];
            if(preData.acei==="yes"){
              alerts.push(`<div class="card" style="background:#fff6d6;border-color:#ffd36a;color:#7a5b00;">REMEDY alert: ACE inhibitor (IECA) use is an exclusion criterion.</div>`);
            }
            if(postData.strokeType==="ischemic"){
              alerts.push(`<div class="card" style="background:#eef7ff;border-color:#b8dbff;color:#0f3f66;">REMEDY practical note: after IVT, perform CT at 6h and require &lt;PH1.</div>`);
            }
            summaryAlerts.innerHTML = alerts.join("");
          }

          showPage('summaryPage');
        }








