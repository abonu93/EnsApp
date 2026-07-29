// Spiegazioni "perche' questo trial emorragico NON e' eligibile".
// Stesso pattern di acute-reasons.ts: applica gli stessi criteri di
// hemorrhagic-rules.ts e colleziona i fail come stringhe.
// NON ridefinisce la logica clinica: e' un wrapper diagnostico.

import type { HemorrhagicInput } from "./hemorrhagic-rules";
import { reduce, type ReasonReport } from "./reason-report";

/**
 * FASTEST. La regola somma tre blocchi (baseCriteriaMet, !extraMissing,
 * criteriaMet): qui sono appiattiti in un unico elenco di check. Le domande
 * aggiuntive richiedono una risposta esplicita, quindi "non risposto" appare
 * come criterio mancante esattamente come un "no" sbagliato.
 */
export function reasonFastest(input: HemorrhagicInput): ReasonReport {
  return reduce([
    { ok: input.ltsw <= 2, label: "LTSW <= 2h" },
    { ok: input.premrs <= 2, label: "pre-mRS <= 2" },
    { ok: input.age >= 18 && input.age <= 80, label: "age 18-80" },
    { ok: input.gcs >= 8, label: "GCS >= 8" },
    { ok: input.hemVolume >= 2 && input.hemVolume < 60, label: "volume ematoma 2-59 mL" },
    { ok: input.brainstem === "no", label: "no emorragia del tronco encefalico" },
    { ok: input.procoagulant === "no", label: "no farmaci procoagulanti nelle 24h" },
    { ok: input.ecg === "no", label: "no anomalie ECG" },
    { ok: input.thrombosis === "no", label: "no storia di trombosi acuta" },
    { ok: input.pregnancy === "no", label: "no gravidanza" },
    { ok: input.angioplasty === "no", label: "no angioplastica recente" },
    { ok: input.ivhScore === "yes", label: "IVH score noto" },
    { ok: input.anticoag === "none", label: "nessuna terapia anticoagulante" },
  ]);
}

export function reasonTich3(input: HemorrhagicInput): ReasonReport {
  return reduce([
    { ok: input.ltsw < 4.5, label: "LTSW < 4.5h" },
    { ok: input.hemVolume < 60, label: "volume ematoma < 60 mL" },
    { ok: input.ivh === "no", label: "emorragia non isolata a IVH" },
    { ok: input.gcs >= 5, label: "GCS >= 5" },
    { ok: input.seizure === "no", label: "no convulsioni / trombosi / ipersensibilita' a TXA" },
    { ok: input.secondaryCause === "None", label: "nessuna causa secondaria" },
  ]);
}

/** Mappa nome di display -> funzione reasons (trial emorragici). */
export const REASON_BY_HEM_TRIAL: Record<string, (i: HemorrhagicInput) => ReasonReport> = {
  FASTEST: reasonFastest,
  "TICH-3": reasonTich3,
};
