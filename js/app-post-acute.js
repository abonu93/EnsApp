        /* ======= POST-ACUTE (unchanged) ======= */
        function goToPostAcute(){ document.querySelectorAll('#postAcutePage .radio-group').forEach(markRadioSelected); showPage('postAcutePage'); }
        function cancelPostAcute(){ showPage('summaryPage'); }

        function submitLibrexia(){
          reasons.librexia.meet=[]; reasons.librexia.fail=[];

          const suspect = (document.querySelector('input[name="lix_suspect"]:checked')||{}).value;
          const crit_persistent = document.getElementById('lix_persistent').checked;
          const crit_imaging = document.getElementById('lix_imaging').checked;
          const crit_treat = document.getElementById('lix_treatment').checked;
          const abcd2 = parseInt(document.getElementById('abcd2').value);
          const anti = (document.querySelector('input[name="lix_anti"]:checked')||{}).value;

          const altOk = document.getElementById('lix_alt').checked;
          const pltOk = document.getElementById('lix_platelets').checked;
          const biliOk = document.getElementById('lix_bilirubin').checked;
          const hbOk = document.getElementById('lix_hb').checked;

          const inr = parseFloat(document.getElementById('inr').value);
          const aptt = parseFloat(document.getElementById('aptt').value);
          const gfr = parseFloat(document.getElementById('gfr').value);

          const chronic = document.getElementById('lix_chronic').checked;
          const bleed = document.getElementById('lix_bleed').checked;
          const hepatic = document.getElementById('lix_hepatic').checked;
          const inhib = document.getElementById('lix_inhibitors').checked;

          const preg = (document.querySelector('input[name="lix_preg"]:checked')||{}).value;

          let ok = true;

          if(preData.age<40){ reasons.librexia.fail.push("Age <40"); ok=false; } else reasons.librexia.meet.push("Age ≥40");
          if(preData.ltsw>48){ reasons.librexia.fail.push("LTSW >48h"); ok=false; } else reasons.librexia.meet.push("LTSW ≤48h");
          if(preData.nihss>7){ reasons.librexia.fail.push("NIHSS >7"); ok=false; } else reasons.librexia.meet.push("NIHSS ≤7");

          if(suspect!=="yes"){ reasons.librexia.fail.push("Atherothrombotic cause not suspected"); ok=false; } else reasons.librexia.meet.push("Atherothrombotic suspicion");
          if(!(crit_persistent||crit_imaging||crit_treat)){ reasons.librexia.fail.push("No clinical criterion met"); ok=false; } else reasons.librexia.meet.push("≥1 clinical criterion");
          if(isNaN(abcd2)||abcd2<6){ reasons.librexia.fail.push("ABCD2 <6"); ok=false; } else reasons.librexia.meet.push("ABCD2 ≥6");
          if(anti!=="yes"){ reasons.librexia.fail.push("Antiplatelet not in use/planned"); ok=false; } else reasons.librexia.meet.push("Antiplatelet in use/planned");

          if(isNaN(inr)||inr>1.5){ reasons.librexia.fail.push("INR >1.5"); ok=false; } else reasons.librexia.meet.push("INR ≤1.5");
          if(isNaN(aptt)||aptt>1.4){ reasons.librexia.fail.push("aPTT >1.4"); ok=false; } else reasons.librexia.meet.push("aPTT ≤1.4");
          if(isNaN(gfr)||gfr<15){ reasons.librexia.fail.push("GFR <15"); ok=false; } else reasons.librexia.meet.push("GFR ≥15");

          if(!altOk){ reasons.librexia.fail.push("ALT not normal"); ok=false; } else reasons.librexia.meet.push("ALT normal");
          if(!pltOk){ reasons.librexia.fail.push("Platelets inadequate"); ok=false; } else reasons.librexia.meet.push("Platelets adequate");
          if(!biliOk){ reasons.librexia.fail.push("Bilirubin abnormal"); ok=false; } else reasons.librexia.meet.push("Bilirubin normal");
          if(!hbOk){ reasons.librexia.fail.push("Hemoglobin low"); ok=false; } else reasons.librexia.meet.push("Hemoglobin adequate");

          if(preg!=="no"){ reasons.librexia.fail.push("Pregnant"); ok=false; } else reasons.librexia.meet.push("Not pregnant");

          if(chronic){ reasons.librexia.fail.push("Requires chronic anticoagulation"); ok=false; }
          if(bleed){ reasons.librexia.fail.push("Bleeding risk disorder"); ok=false; }
          if(hepatic){ reasons.librexia.fail.push("Hepatic disease"); ok=false; }
          if(inhib){ reasons.librexia.fail.push("On CYP3A4/P-gp inhibitors"); ok=false; }

          eligibility.librexia = ok;

          showChronicSummary();
        }

        function showChronicSummary(){
          const items = [
            ["Librexia", eligibility.librexia, "librexia", false, null]
          ];
          const ul = document.getElementById('summaryChronicContent'); ul.innerHTML="";
          items.forEach(([name,ok,key,ni,link])=>{
            const li = document.createElement('li');
            const nameHtml = `<span class="study-name">${name}</span>`;
            const checkboxHtml = ok ? `<input type="checkbox" class="study-checkbox-chronic" value="${name}" title="Select ${name}">` : `<input type="checkbox" disabled title="${ni?'Not indicated':'Not eligible'}">`;
            const statusHtml = ni ? `<span class="tag tag-ni">Not indicated</span>` : `<span class="${ok?'ok':'no'}">${ok?'Eligible':'Not eligible'}</span>`;
            const infoBtn = `<button type="button" class="btn btn-small" onclick="showInfo('${key}')">Info</button>`;
            li.innerHTML = `${checkboxHtml}${nameHtml}${statusHtml}${infoBtn}`;
            ul.appendChild(li);
          });
          showPage('summaryChronicPage');
        }
