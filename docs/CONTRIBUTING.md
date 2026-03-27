# Contributing

## Workflow consigliato

1. Crea un branch per task (`feature/...` o `fix/...`).
2. Lavora su un solo modulo per PR quando possibile.
3. Aggiorna sempre la documentazione in `docs/` se cambi flussi o regole.
4. Testa manualmente i percorsi critici prima di chiudere.

## Checklist PR

- [ ] Nessuna regressione nei flussi principali
- [ ] Regole di eligibility verificate con almeno un caso positivo e uno negativo
- [ ] Mapping `buildTrialsForSheet` coerente con i trial visibili in UI
- [ ] Nessun riferimento DOM rotto (`getElementById` / selettori)
- [ ] Docs aggiornate
- [ ] `npm test` eseguito (quando Node e disponibile)

## Linee guida codice

- Mantieni le funzioni piccole e con una responsabilita chiara.
- Se introduci nuova logica clinica, isolala in funzioni pure quando possibile.
- Evita side-effect nascosti: aggiorna lo stato in punti espliciti.
- Usa naming uniforme tra UI, state e payload (es: `sovateltide` vs label UI).

## Test manuali minimi

- Percorso ischemico con candidato EVT
- Percorso ischemico non candidato EVT
- Percorso emorragico
- Salvataggio su sheet (acuto / chronic / trial patient)
- Copia/condivisione messaggio
- Reset completo app
