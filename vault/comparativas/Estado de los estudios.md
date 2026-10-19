---
tipo: comparativa
fuentes: ["[[Esquema ensayos — septiembre 2026]]"]
actualizado: 2026-10-19
---
# Stato degli studi: foglio vs EnsApp vs Drive

Fonte di verità per lo stato: [[Esquema ensayos — septiembre 2026]] (foglio
del team, modificato il 2026-10-09). Lo stato in EnsApp viene da
`src/lib/domain/trials-info.ts` (campo `status`), letto il 2026-10-19.

✅ coerente · ⚠ da allineare

| Studio | Foglio | EnsApp (`status`) | Documenti nella copia ordinata | Esito |
|---|---|---|---|---|
| ACTISAVE | aperto | assente | assenti | ⚠ manca in app e in Drive |
| TNKCAT | aperto | assente | assenti | ⚠ manca in app e in Drive |
| ICARUS | aperto | assente | assenti | ⚠ manca in app e in Drive |
| ABBVIE (elezanumab) | aperto | assente | assenti | ⚠ manca in app e in Drive |
| SAIL-MeVO | aperto | assente | sì (sezione 2) | ⚠ manca in app |
| WETRUST | aperto | active (`trials-info.ts:32`) | sì | ✅ |
| MOSTE | reclutamiento cerrado | active (`:45`) | sì | ⚠ l'app lo propone ancora |
| ATHENA | aperto | paused (`:58`) | sì | ⚠ l'app lo tiene in pausa |
| PIVOTAL | aperto | paused (`:71`) | sì | ⚠ l'app lo tiene in pausa |
| TWIN-2-WIN 2 | aperto | active (`:97`) | sì | ✅ |
| ARTEMIS | reclutamiento cerrado | active (`:110`) | sì | ⚠ l'app lo propone ancora |
| DONE SYMPLE | aperto | active (`:136`) | sì | ✅ |
| HYBERNIA | en pausa | paused (`:123`) | sì | ✅ |
| PROMISE 20 RELOADED | en pausa | active (chiave `PROMISE`, `:84`) | sì | ⚠ l'app lo propone ancora |
| VANISH | aperto | active (`:149`) | sì | ✅ (ma vedi ASPECTS ≥4 nel foglio) |
| SOVATELTIDE | aperto | active (`:209`) | sì | ✅ |
| ORION | en pausa (pendiente 2ª parte) | active (`:222`) | sì | ⚠ verificare come l'app segnala la pausa |
| LIBREXIA | cerrado | post-acute (`:193`) | sì | ⚠ verificare: chiuso nel foglio |
| REMEDY-2 | aperto | active (chiave `REMEDY`, `:294`) | sì | ✅ |
| DO IT | aperto | active (`:278`) | sì | ✅ |
| FASTEST | aperto | active (`:235`) | sì | ✅ |
| TICH-3 | aperto | active (`:248`) | sì | ✅ |
| TENACITY | **assente** | active (`:310`) | sì | ⚠ attivo in app (centro attivato il 26-06-2026), non nel foglio |
| NiVO | **assente** | active (`:261`) | solo sinossi e CI | ⚠ attivo in app, non nel foglio |
| NORA HOME | **assente** | active | nessuno | ⚠ attivo in app, né foglio né documenti |
| SAFER-DOAC | **assente** | active (`:162`) | nessuno (forse = DOAC-CVT) | ⚠ attivo in app, né foglio né documenti |
| SHIONOGI | assente | closed (`:177`) | sì | ✅ chiuso |
| MARRS | assente | (chiuso secondo l'indice Drive) | sì | ✅ chiuso |
| PROMISE20 | assente | (chiuso secondo l'indice Drive) | sì | ✅ chiuso |

## Domande per il team
1. MOSTE e ARTEMIS: chiudere in app (reclutamento chiuso)?
2. ATHENA e PIVOTAL: riattivare in app (aperti nel foglio)?
3. PROMISE 20 RELOADED e ORION: mettere in pausa in app?
4. TENACITY e NiVO sono aperti? Se sì, mancano nel foglio.
5. NORA HOME e SAFER-DOAC: esistono ancora?
6. ACTISAVE, TNKCAT, ICARUS, ABBVIE, SAIL-MeVO: vanno aggiunti all'app? Per i primi quattro servono anche i documenti nella copia ordinata.
