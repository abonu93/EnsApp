# Protocolli (base di conoscenza del chatbot)

Metti qui i **PDF dei protocolli** degli studi. Ad ogni pubblicazione del sito,
il sistema legge automaticamente tutti i `.pdf` di questa cartella, ne estrae il
testo e costruisce la base di conoscenza (`public/protocols-index.json`) che la
chat usa per rispondere.

## Come aggiungere o aggiornare i protocolli (dal browser, su GitHub)

1. Apri questa cartella `protocols/` su GitHub.
2. **Add file → Upload files** → trascina i PDF → **Commit changes**.
3. Fatto: il sito si ricostruisce da solo in 1–2 minuti e la chat avrà i nuovi protocolli.

Per rimuovere un protocollo: elimina il PDF da questa cartella e fai commit.

## Note

- Vengono letti solo i **PDF con testo selezionabile**. I PDF **scansionati**
  (immagini delle pagine) o il testo dentro le figure non vengono letti
  (serve l'OCR, da aggiungere separatamente).
- Il nome del file diventa il nome del protocollo mostrato nelle citazioni.
