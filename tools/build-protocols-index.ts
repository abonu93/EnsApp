// Build-time: legge i PDF nella cartella protocols/ ed esce un indice TF-IDF
// in public/protocols-index.json (la "base di conoscenza" del chatbot).
// Lanciato dallo script "build" (vedi package.json), quindi gira ad ogni
// deploy su Cloudflare Pages / GitHub Pages. L'estrazione PDF avviene QUI,
// una sola volta, non nel browser degli utenti.
//
// Per aggiornare i protocolli: aggiungi/rimuovi PDF in protocols/ e fai commit.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, basename } from "node:path";
import { getDocumentProxy, extractText } from "unpdf";
import { chunkPages, buildIndex, mergeIndexes, type PageText, type TfIdfIndex } from "../src/lib/chat/chunk";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROTOCOLS_DIR = join(root, "protocols");
const OUTPUT = join(root, "public", "protocols-index.json");

function slug(name: string): string {
  return name.replace(/\.pdf$/i, "").replace(/[^\w-]+/g, "-").toLowerCase();
}

async function listPdfs(): Promise<string[]> {
  try {
    const entries = await readdir(PROTOCOLS_DIR);
    return entries.filter((f) => f.toLowerCase().endsWith(".pdf")).sort();
  } catch {
    return []; // cartella assente: indice vuoto
  }
}

async function pdfToPages(filePath: string): Promise<PageText[]> {
  const buf = await readFile(filePath);
  const pdf = await getDocumentProxy(new Uint8Array(buf));
  const { text } = await extractText(pdf, { mergePages: false });
  const pages = Array.isArray(text) ? text : [text];
  return pages
    .map((t, i) => ({ page: i + 1, text: (t || "").replace(/\s+/g, " ").trim() }))
    .filter((p) => p.text.length > 0);
}

async function main() {
  const files = await listPdfs();
  const indexes: TfIdfIndex[] = [];
  const docNames: string[] = [];

  for (const file of files) {
    const name = basename(file, ".pdf");
    try {
      const pages = await pdfToPages(join(PROTOCOLS_DIR, file));
      if (pages.length === 0) {
        console.warn(`[protocols] "${file}": nessun testo estratto (PDF scansionato?). Saltato.`);
        continue;
      }
      const chunks = chunkPages(slug(file), name, pages);
      indexes.push(buildIndex(chunks));
      docNames.push(name);
      console.log(`[protocols] "${file}": ${pages.length} pagine, ${chunks.length} frammenti.`);
    } catch (e) {
      console.warn(`[protocols] "${file}": errore di lettura, saltato.`, e instanceof Error ? e.message : e);
    }
  }

  const index = indexes.length > 0 ? mergeIndexes(indexes) : { chunks: [], tf: [], df: {}, n: 0 };
  const payload = { version: 1, builtAt: Date.now(), docNames, index };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload));
  console.log(`[protocols] Scritto ${OUTPUT}: ${docNames.length} protocolli, ${index.n} frammenti.`);
}

main().catch((e) => {
  console.error("[protocols] build fallita:", e);
  process.exit(1);
});
