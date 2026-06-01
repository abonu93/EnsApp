// Estrazione testo dai PDF lato client.
// pdfjs-dist viene caricato via dynamic import: finisce in un chunk separato e
// NON appesantisce il bundle iniziale dell'app.

import type { PageText } from "./chunk";

let workerConfigured = false;

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  if (!workerConfigured) {
    // `?url` fa risolvere il worker sotto BASE_URL (es. /EnsApp/ su GitHub Pages),
    // evitando dipendenze da CDN esterne.
    const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
    pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
    workerConfigured = true;
  }
  return pdfjs;
}

/**
 * Estrae il testo di ogni pagina di un PDF. Ritorna una pagina per voce
 * (1-based), saltando le pagine senza testo estraibile.
 */
export async function extractPdfText(file: File): Promise<PageText[]> {
  const pdfjs = await loadPdfjs();
  const data = new Uint8Array(await file.arrayBuffer());
  const doc = await pdfjs.getDocument({ data }).promise;

  const pages: PageText[] = [];
  try {
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) pages.push({ page: pageNum, text });
      page.cleanup();
    }
  } finally {
    await doc.destroy();
  }

  return pages;
}
