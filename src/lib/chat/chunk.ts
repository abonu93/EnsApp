// Chunking + retrieval TF-IDF per il chatbot sui protocolli.
// Zero dipendenze esterne (rispetta il budget di bundle): tokenizer semplice,
// indice TF-IDF serializzabile e ricerca per similarita' coseno.
//
// Il testo dei PDF viene spezzato in chunk con overlap, indicizzato e poi
// interrogato per selezionare i top-k frammenti rilevanti da inviare al modello.

export interface PageText {
  page: number;
  text: string;
}

export interface Chunk {
  docId: string;
  docName: string;
  /** Identificatore stabile del chunk: `${docId}#${index}`. */
  chunkId: string;
  /** Pagina (1-based) da cui proviene il chunk. */
  page: number;
  text: string;
}

export interface TfIdfIndex {
  chunks: Chunk[];
  /** Per ogni chunk: term -> frequenza. */
  tf: Record<string, number>[];
  /** Document frequency globale: term -> numero di chunk che lo contengono. */
  df: Record<string, number>;
  /** Numero di chunk. */
  n: number;
}

export interface RetrievedChunk extends Chunk {
  score: number;
}

const DEFAULT_CHUNK_SIZE = 700;
const DEFAULT_OVERLAP = 120;

// Stopword minime multilingua (it/es/en/ca). Non esaustive: servono solo a
// ridurre il rumore nei punteggi senza penalizzare i termini clinici.
const STOPWORDS = new Set([
  "the", "and", "for", "are", "with", "that", "this", "from", "have", "was",
  "los", "las", "del", "que", "con", "por", "una", "uno", "para", "como",
  "il", "lo", "la", "le", "gli", "dei", "delle", "che", "con", "per", "una",
  "di", "da", "in", "el", "de", "y", "a", "o", "e", "un",
]);

/** Tokenizza: minuscolo, split su non alfanumerici (unicode), filtra stopword e token corti. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((tok) => tok.length >= 2 && !STOPWORDS.has(tok));
}

/**
 * Spezza le pagine di un documento in chunk con overlap, mantenendo il numero
 * di pagina. Spezza su confini di parola quando possibile.
 */
export function chunkPages(
  docId: string,
  docName: string,
  pages: PageText[],
  size = DEFAULT_CHUNK_SIZE,
  overlap = DEFAULT_OVERLAP
): Chunk[] {
  const chunks: Chunk[] = [];
  let index = 0;

  for (const { page, text } of pages) {
    const clean = text.replace(/\s+/g, " ").trim();
    if (!clean) continue;

    if (clean.length <= size) {
      chunks.push({ docId, docName, chunkId: `${docId}#${index++}`, page, text: clean });
      continue;
    }

    let start = 0;
    while (start < clean.length) {
      let end = Math.min(start + size, clean.length);
      // Prova a chiudere su uno spazio per non tagliare parole a meta'.
      if (end < clean.length) {
        const lastSpace = clean.lastIndexOf(" ", end);
        if (lastSpace > start + size / 2) end = lastSpace;
      }
      const piece = clean.slice(start, end).trim();
      if (piece) {
        chunks.push({ docId, docName, chunkId: `${docId}#${index++}`, page, text: piece });
      }
      if (end >= clean.length) break;
      start = Math.max(end - overlap, start + 1);
    }
  }

  return chunks;
}

/** Costruisce un indice TF-IDF serializzabile dai chunk. */
export function buildIndex(chunks: Chunk[]): TfIdfIndex {
  const tf: Record<string, number>[] = [];
  const df: Record<string, number> = {};

  for (const chunk of chunks) {
    const counts: Record<string, number> = {};
    for (const tok of tokenize(chunk.text)) {
      counts[tok] = (counts[tok] ?? 0) + 1;
    }
    tf.push(counts);
    for (const term of Object.keys(counts)) {
      df[term] = (df[term] ?? 0) + 1;
    }
  }

  return { chunks, tf, df, n: chunks.length };
}

/** Unisce piu' indici (uno per documento) in un unico indice interrogabile. */
export function mergeIndexes(indexes: TfIdfIndex[]): TfIdfIndex {
  const chunks: Chunk[] = [];
  const tf: Record<string, number>[] = [];
  const df: Record<string, number> = {};

  for (const idx of indexes) {
    for (let i = 0; i < idx.chunks.length; i++) {
      chunks.push(idx.chunks[i]);
      tf.push(idx.tf[i]);
    }
    for (const [term, count] of Object.entries(idx.df)) {
      df[term] = (df[term] ?? 0) + count;
    }
  }

  return { chunks, tf, df, n: chunks.length };
}

function idf(df: number, n: number): number {
  return Math.log(1 + n / (df || 1));
}

/**
 * Recupera i top-k chunk piu' rilevanti per la query, per similarita' coseno
 * sui vettori TF-IDF. Ritorna solo chunk con punteggio > 0.
 */
export function retrieve(query: string, index: TfIdfIndex, k = 6): RetrievedChunk[] {
  if (index.n === 0) return [];

  const queryCounts: Record<string, number> = {};
  for (const tok of tokenize(query)) {
    queryCounts[tok] = (queryCounts[tok] ?? 0) + 1;
  }
  const queryTerms = Object.keys(queryCounts);
  if (queryTerms.length === 0) return [];

  let queryNorm = 0;
  const queryWeights: Record<string, number> = {};
  for (const term of queryTerms) {
    const w = queryCounts[term] * idf(index.df[term] ?? 0, index.n);
    queryWeights[term] = w;
    queryNorm += w * w;
  }
  queryNorm = Math.sqrt(queryNorm) || 1;

  const scored: RetrievedChunk[] = [];
  for (let i = 0; i < index.n; i++) {
    const counts = index.tf[i];
    let dot = 0;
    let chunkNorm = 0;
    for (const [term, count] of Object.entries(counts)) {
      const w = count * idf(index.df[term] ?? 0, index.n);
      chunkNorm += w * w;
      if (queryWeights[term]) dot += w * queryWeights[term];
    }
    chunkNorm = Math.sqrt(chunkNorm) || 1;
    const score = dot / (chunkNorm * queryNorm);
    if (score > 0) scored.push({ ...index.chunks[i], score });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}
