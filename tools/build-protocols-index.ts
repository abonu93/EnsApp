// Build-time: legge ricorsivamente i documenti in protocols/ (PDF e DOCX),
// ne estrae il testo e produce l'indice TF-IDF in public/protocols-index.json
// (la "base di conoscenza" del chatbot). Gira ad ogni build/deploy.
//
// Convenzione cartelle: protocols/<STUDIO>/<file>. Il nome dello STUDIO
// (la sottocartella) diventa il nome mostrato nelle citazioni.

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, basename, extname, relative, sep } from "node:path";
import { getDocumentProxy, extractText } from "unpdf";
import mammoth from "mammoth";
import { chunkPages, buildIndex, mergeIndexes, type PageText, type TfIdfIndex } from "../src/lib/chat/chunk";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROTOCOLS_DIR = join(root, "protocols");
const OUTPUT = join(root, "public", "protocols-index.json");

function slug(s: string): string {
  return s.replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").toLowerCase();
}

// Nome documento = sottocartella di studio (es. "WETRUST"); se il file e' in
// protocols/ direttamente, usa il nome del file.
function docNameFor(absPath: string): string {
  const rel = relative(PROTOCOLS_DIR, absPath);
  const parts = rel.split(sep);
  return parts.length > 1 ? parts[0] : basename(rel, extname(rel));
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
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

async function docxToPages(filePath: string): Promise<PageText[]> {
  const buffer = await readFile(filePath);
  const { value } = await mammoth.extractRawText({ buffer });
  const text = (value || "").replace(/\s+/g, " ").trim();
  return text ? [{ page: 1, text }] : [];
}

async function main() {
  const all = (await walk(PROTOCOLS_DIR)).sort();
  const indexes: TfIdfIndex[] = [];
  const docNames = new Set<string>();
  let filesOk = 0;

  for (const file of all) {
    const ext = extname(file).toLowerCase();
    if (ext !== ".pdf" && ext !== ".docx") continue;
    const rel = relative(PROTOCOLS_DIR, file);
    const docName = docNameFor(file);
    try {
      const pages = ext === ".pdf" ? await pdfToPages(file) : await docxToPages(file);
      if (pages.length === 0) {
        console.warn(`[protocols] "${rel}": nessun testo estratto (scansione/immagini?). Saltato.`);
        continue;
      }
      const chunks = chunkPages(slug(rel), docName, pages);
      indexes.push(buildIndex(chunks));
      docNames.add(docName);
      filesOk++;
      console.log(`[protocols] "${rel}" -> [${docName}] ${pages.length} pag, ${chunks.length} frammenti.`);
    } catch (e) {
      console.warn(`[protocols] "${rel}": errore di lettura, saltato.`, e instanceof Error ? e.message : e);
    }
  }

  const index = indexes.length > 0 ? mergeIndexes(indexes) : { chunks: [], tf: [], df: {}, n: 0 };
  const payload = { version: 1, builtAt: Date.now(), docNames: [...docNames], index };

  await mkdir(dirname(OUTPUT), { recursive: true });
  await writeFile(OUTPUT, JSON.stringify(payload));
  console.log(`[protocols] OK: ${filesOk} file, ${docNames.size} studi, ${index.n} frammenti -> ${relative(root, OUTPUT)}`);
}

main().catch((e) => {
  console.error("[protocols] build fallita:", e);
  process.exit(1);
});
