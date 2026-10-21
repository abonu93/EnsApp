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
| Fogli (dato, orologio, studio, invio) | `src/lib/components/board/*` |
| Messaggio WhatsApp e riga del foglio (condivisi con Share) | `src/lib/domain/patient-record.ts` |

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

## Invio

"Send to coordinator" mostra il riepilogo, permette di indicare gli studi in
cui il paziente entra (con braccio, se previsto) e usa gli stessi invii di
Share: WhatsApp / copia e riga del foglio (`source: "board"`), con la stessa
verifica di scrittura e il salvataggio locale.
