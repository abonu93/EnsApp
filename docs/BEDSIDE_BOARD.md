# Bedside Board (`/board`)

Un'unica schermata per il neurologo di guardia: orologio dall'ultima volta
visto bene, gli 8 dati decisivi e tutti gli studi aperti in tre stati.
Design: Claude Design, "Eligo Bedside Board v3".

## Dove sta

| Cosa | File |
|---|---|
| Valutazione con dati parziali (pura, testata) | `src/lib/domain/board.ts` |
| Collegamento agli store del paziente | `src/lib/stores/board.ts` |
| Schermata | `src/routes/Board.svelte` |
| Fogli (dato, orologio, studio) | `src/lib/components/board/*` |
| Messaggio WhatsApp e riga del foglio (Share) | `src/lib/domain/patient-record.ts` |

Ingressi: terza scelta in `/workflow` e link nel footer della Home.

## Logica: nessuna regola duplicata

Il board non ha criteri suoi. Per ogni studio aperto (`isTrialOpen`) chiama il
wrapper `*-reasons.ts` e:

- **criterio fallito + un dato mancante che lo farebbe passare** → "da sapere"
  (studio *possibile*, "manca X");
- **criterio soddisfatto + un dato mancante che lo farebbe fallire** → "da
  confermare" (trattino grigio, es. "no tandem" senza risposta);
- **criterio che dipende solo dal tempo** → finestra: l'orologio viene fatto
  avanzare (LTSW e ore dalla scoperta insieme) per trovare quando apre/chiude;
- **criterio fallito con i dati presenti** → *fuori*, con il motivo.

Lo stato *eligible* richiede anche che la regola `*-rules.ts` dia `true`.
Filtro per tipo di ictus e WeTrust indipendente dall'imaging come in
`stores/eligibility.ts`; LVO segue la candidatura EVT come in PostImaging;
i conflitti vengono da `EXCLUSIVE_GROUPS`.

`tests/domain/board.test.ts` verifica che con dati completi l'esito coincida
con le regole e che con dati parziali uno studio eleggibile per qualche
completamento non risulti mai *fuori*. Aggiungere un trial a
`REASON_BY_TRIAL` (o `REASON_BY_HEM_TRIAL`) e alla mappa delle regole in
`board.ts` basta perche' compaia nel board; un campo nuovo va aggiunto a
`BOARD_FIELDS` (con i valori da provare) e alle traduzioni `board.fields`.

## Dubbi aperti, avvertenze e co-arruolamento (vault)

Le decisioni e i dubbi del vault (`vault/`, costruito dalla copia Drive
"ENSAYOS — Copia ordenada") arrivano al board da `open-questions.ts`, senza
copie: `selectionAlerts` per ogni studio aperto (etichetta "check" quando un
dubbio o un'avvertenza cambia l'esito per questo paziente, riquadro nel foglio
dello studio), `COENROLMENT_RULES` fra gli eleggibili ("limiti di
co-arruolamento") e gli stessi avvisi del Riepilogo nel foglio di invio.
Lo stato degli studi segue `trials-info.ts`, allineato al foglio del team
"Esquema ensayos" (fonte di verita' secondo `vault/CLAUDE.md`).

## Selezione e Riepilogo

Gli studi eleggibili si selezionano direttamente nel board (stessi gruppi
esclusivi del Riepilogo, `toggleStudy` in `stores/trialSelection.ts`). Il
pulsante in basso porta al Riepilogo (`/summary`) e da li' si prosegue come nel
flusso guidato (Share: WhatsApp e foglio). `flowOrigin` ricorda che si arriva
dal board: "indietro" nel Riepilogo torna al board e la riga del foglio ha
`source: "board"`. L'ID paziente si inserisce in cima al board.

## Lingue

Le etichette dei criteri (`*-reasons.ts`) sono in italiano clinico: il board e
il Riepilogo le mostrano tradotte con `src/lib/i18n/criteria.ts`.
`tests/i18n/criteria.test.ts` fallisce se un criterio nuovo non ha la
traduzione in catalano, spagnolo e inglese.
