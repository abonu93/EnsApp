# Registro differito (`/registered`)

Sostituisce la registrazione rapida ("Direct enrollment"). Nome in app:
"Registro diferido" / "Registre diferit" / "Deferred entry" / "Inserimento
differito". Serve per i pazienti **che non si sono potuti inserire durante
l'urgenza** e che si registrano dopo, anche giorni dopo.
Design: Claude Design, "Eligo Registered Patient". Ingresso: seconda scelta in
`/workflow` (Nuovo paziente), dopo il Bedside board; il flusso guidato e'
l'ultima scelta, in grigio. `/trial-patient` resta come vecchio indirizzo.

## Tempo: "Visto" e LTSW alla visita

- **Visto**: data e ora della valutazione (calendario, anche giorni prima).
- **LTSW alla visita**: non scorre con l'orologio. Si conta fino a "Visto":
  dalla data e ora dell'ultima volta visto bene, oppure riferito in ore; con
  l'opzione risveglio / esordio ignoto. Va nel foglio come `LTSW_h`.

## Dati

ID, eta', NIHSS, mRS e tipo sempre visibili; "+ Aggiungi dato" secondo il
tipo: occlusione, ASPECTS, TEV (+ mTICI), TIV; nell'emorragia GCS, volume,
reversione dell'anticoagulazione (+ farmaco); note.

## Studi e braccio

Studi aperti (`isTrialOpen`) per gruppo, con ricerca. Il braccio
intervention/control si chiede solo per gli studi randomizzati in aperto
(`studyDesign` in `sheet-payload.ts`, dalle schede del vault): niente braccio
per i doppio cieco contro placebo (FASTEST, TICH-3, REMEDY, SOVATELTIDE) e per
i braccio singolo non randomizzati (NiVO, PIVOTAL). Conflitti: gruppi
esclusivi del team e regole di co-arruolamento dei protocolli.

## Salvataggio

Bloccato senza ID, eta' e braccio dove serve. Riga del foglio e messaggio come
in Share (`patient-record.ts`, `source: "quick-patient"`); un record senza
studi vale come screening. Colonne nuove da creare nel foglio EnsApp_Data
perche' vengano salvate: `Seen_at` (data della visita), `Reversal`,
`Reversal_agent`.
