// Ogni criterio mostrato all'utente deve avere la traduzione in tutte le lingue
// selezionabili: le etichette di *-reasons.ts sono in italiano.

import { describe, test, expect } from "vitest";
import { REASON_BY_TRIAL } from "$lib/domain/acute-reasons";
import { REASON_BY_HEM_TRIAL } from "$lib/domain/hem-reasons";
import { CRITERIA, criterionLabel } from "$lib/i18n/criteria";
import { LOCALES } from "$lib/i18n";

describe("criteri tradotti", () => {
  const labels = new Set<string>();
  for (const fn of [...Object.values(REASON_BY_TRIAL), ...Object.values(REASON_BY_HEM_TRIAL)]) {
    for (const l of (fn as (i: unknown) => { labels: string[] })({ ltsw: 1, targetVessels: [] }).labels) labels.add(l);
  }

  test.each([...labels])("%s", (label) => {
    for (const { code } of LOCALES) {
      expect(CRITERIA[label]?.[code], `${code}: ${label}`).toBeTruthy();
    }
  });

  test("lingua scelta, originale se manca", () => {
    expect(criterionLabel("no occlusione tandem", "es")).toBe("sin oclusión en tándem");
    expect(criterionLabel("etichetta sconosciuta", "es")).toBe("etichetta sconosciuta");
  });
});
