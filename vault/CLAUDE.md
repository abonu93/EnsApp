# Vault "Ensayos" — regole per Claude

Base di conoscenza in formato Obsidian sui trial clinici dell'Unità Ictus
(Vall d'Hebron). Viene costruita leggendo i documenti della cartella Drive
**"ENSAYOS — Copia ordenada (EnsApp)"** (ID `1d0Gy2QCDHrV4_Rr4bxKuf3KFIEfVoHOq`).
La copia è congelata al 22-09-2026: l'originale nella cartella condivisa
"Ensayos" resta la fonte.

Prima di qualunque lavoro leggi `index.md` e le ultime righe di `log.md`.

## Quali studi sono aperti: fonte di verità

Per lo stato degli studi (aperto, in pausa, reclutamento chiuso, chiuso) fa
fede **sempre** il foglio del team **"Esquema ensayos"**:
https://docs.google.com/spreadsheets/d/1-OrcoFQMGQvIjO64umMBMalYGmgmY5T2/edit?gid=737463022#gid=737463022
(Drive ID `1-OrcoFQMGQvIjO64umMBMalYGmgmY5T2`, cartella ENSAYOS ABIERTOS).

- Rileggilo a ogni sessione di lavoro (`read_file_content`) e confronta la data
  di modifica con quella in `fuentes/Esquema ensayos — septiembre 2026.md`.
  Se è cambiato, aggiorna quella nota e `comparativas/Estado de los estudios.md`.
- Il titolo contiene il mese ("septiembre 2026"): se compare una versione di
  un mese successivo (`title contains 'Esquema ensayos'`), usa la più recente
  e segnalalo nel log.
- Né lo stato dell'app né le cartelle Drive (ABIERTOS/INACTIVOS/CERRADOS)
  prevalgono sul foglio. Le differenze vanno segnalate, non corrette d'ufficio.

## Struttura

| Cartella | Contenuto | Una nota per |
|---|---|---|
| `ensayos/` | Scheda di sintesi dello studio (hub) | studio |
| `fuentes/` | Estratto fedele di un documento (protocollo, sinossi, CI, emendamento) | documento |
| `conceptos/` | Scale, tecniche, farmaci, definizioni condivise tra studi | concetto |
| `comparativas/` | Tabelle trasversali tra studi (finestre, NIHSS, co-arruolamento…) | domanda |
| `_plantillas/` | Template: non modificare senza motivo | — |

I documenti originali restano su Drive: nel vault ci sono solo estratti con
link al file.

## Ingestione di uno studio

1. Elenca i file della cartella dello studio nella copia ordinata.
2. Leggi per intero il protocollo vigente (e sinossi, CI, emendamenti se presenti).
   Se il testo restituito è troncato o illeggibile (PDF scansionato, cifrato),
   scrivilo esplicitamente nella nota fonte: mai inventare la parte mancante.
   **Metodo di lettura dei PDF** (verificato su TENACITY):
   - `read_file_content` tronca in silenzio i PDF lunghi (circa 200k caratteri:
     TENACITY si fermava a p. 80 su 84) e rimescola le tabelle a più colonne.
   - Per i protocolli usa quindi `download_file_content`: decodifica il base64
     in un file sotto lo scratchpad, poi `pdfinfo` per il numero di pagine e
     `pdftotext -layout` per il testo. Tabelle e calendari restano leggibili.
   - Verifica sempre di aver letto fino all'ultima pagina ("Page N of M").
     Figure e diagrammi in immagine non si leggono: segnalalo.
   - **PDF sopra ~3 MB** (es. WETRUST 4 MB, ARTEMIS 8,7 MB): il download fa
     chiudere la connessione al connettore Drive. Tentalo **una sola volta**;
     se fallisce usa `read_file_content`, controlla che criteri di
     eleggibilità, procedure e calendario visite rientrino nelle pagine lette,
     e dichiara in `lectura: parcial` quali pagine/sezioni mancano.
3. Crea una nota in `fuentes/` per ogni documento letto (template `_plantillas/fuente.md`).
4. Crea o aggiorna `ensayos/<STUDIO>.md` (template `_plantillas/ensayo.md`).
5. Per ogni concetto ricorrente (ASPECTS, mismatch, tandem, TNK…) crea o
   aggiorna la nota in `conceptos/` e aggiungi lo studio alla sezione "Studi che lo usano".
6. Confronta con l'app: `src/lib/domain/trials-info.ts` e
   `src/lib/domain/{acute,hemorrhagic}-rules.ts`. Le divergenze vanno nella
   sezione "Divergenze con EnsApp" della scheda, con riferimento a pagina e riga di codice.
7. Aggiorna `index.md` (riga della tabella) e aggiungi una riga in fondo a `log.md`.

## Regole di contenuto

- **Fedeltà.** I criteri di inclusione/esclusione si riportano **testuali**,
  nella lingua originale, numerati come nel protocollo, con pagina: `(p. 23)`.
  La sintesi in italiano viene dopo, mai al posto del testo.
- **Citare sempre.** Ogni dato clinico rimanda alla nota fonte e alla pagina:
  `([[TENACITY — Protocolo — V1.0]], p. 12)`.
- **Contraddizioni.** Se due documenti (o protocollo e app) dicono cose diverse,
  callout `> [!warning] Contraddizione` con entrambe le citazioni. Non risolverle d'ufficio.
- **Incertezza.** Se un dato non c'è, scrivi "non riportato nel documento", non dedurlo.
- **Niente dati sensibili.** Nessuna password, credenziale, codice di accesso,
  dato di paziente, telefono o email personale. Promotore, CRO e ruoli sì; nomi
  di persone solo se ruolo pubblico nel protocollo (es. PI nazionale).
- **Lingua.** Testo delle note in italiano; termini clinici e nomi propri come
  nel documento; criteri citati in lingua originale.
- **Nomi file.** `ensayos/<STUDIO>.md` con il nome come in Drive (es. `TICH-3`,
  `MARRS`). Fonti: `<STUDIO> — <Tipo> — <Versione>.md`. Concetti: nome breve
  (`ASPECTS.md`, `Oclusión en tándem.md`).
- **Frontmatter YAML** obbligatorio, con i campi dei template.

## Dubbi non risolvibili dai documenti

Quando un protocollo non è chiaro, si contraddice o manca un documento, e il
dubbio non si può risolvere leggendo le fonti (regola del team, 2026-10-20):

1. callout `> [!warning] Contraddizione` nella scheda dello studio, come sempre;
2. aggiungere la domanda a `src/lib/domain/open-questions.ts` (`OPEN_QUESTIONS`):
   studio, a chi chiedere (promotore o team), cosa dicono i documenti, cosa fa
   l'app; se il dubbio cambia l'esito per certi pazienti, la funzione `appliesTo`;
3. l'app la mostra nella pagina "Dubbi aperti" (campanella in alto) e come
   avviso nel Riepilogo quando si seleziona lo studio;
4. quando arriva la risposta: toglierla da `OPEN_QUESTIONS`, correggere la
   regola e annotare la decisione nella scheda e nel log.

Le regole di co-arruolamento dei protocolli stanno in `COENROLMENT_RULES`; i
gruppi di studi che il team ha deciso esclusivi in `EXCLUSIVE_GROUPS`
(`src/lib/domain/trials-info.ts`).

## Manutenzione

Su richiesta "controlla il vault": link rotti, note orfane, concetti citati
3+ volte senza nota, schede senza sezione divergenze, versioni superate.
