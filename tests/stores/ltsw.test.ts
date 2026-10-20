// Verifica della funzione LTSW: hoursSince() e store derivato ltswHours.
// LTSW (Last Seen Well) e' centrale per finestra terapeutica ed eleggibilita'.

import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { get } from "svelte/store";
import { hoursSince, ltswHours, preData, clearPatient } from "$lib/stores/patient";

describe("hoursSince", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("ritorna undefined per input mancante o non valido", () => {
    expect(hoursSince(undefined)).toBeUndefined();
    expect(hoursSince("")).toBeUndefined();
    expect(hoursSince("non-una-data")).toBeUndefined();
  });

  it("calcola le ore trascorse da un datetime locale", () => {
    // "now" fisso: 2026-06-23 12:00 locale
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 23, 12, 0, 0));

    // 3h prima (stessa timezone, formato del CalendarSheet senza offset)
    expect(hoursSince("2026-06-23T09:00")).toBeCloseTo(3, 5);
    // 30 minuti prima
    expect(hoursSince("2026-06-23T11:30")).toBeCloseTo(0.5, 5);
    // stesso istante => 0
    expect(hoursSince("2026-06-23T12:00")).toBeCloseTo(0, 5);
  });

  it("ritorna un valore negativo per un datetime nel futuro", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 23, 12, 0, 0));
    expect(hoursSince("2026-06-23T13:00")).toBeCloseTo(-1, 5);
  });
});

describe("ltswHours (store derivato)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 23, 12, 0, 0));
    clearPatient();
  });
  afterEach(() => {
    clearPatient();
    vi.useRealTimers();
  });

  it("undefined quando non c'e' ne' data ne' ore", () => {
    expect(get(ltswHours)).toBeUndefined();
  });

  it("prioritizza ltswDate quando presente", () => {
    preData.set({ ltswDate: "2026-06-23T08:00", ltsw: 99 });
    expect(get(ltswHours)).toBeCloseTo(4, 5);
  });

  it("usa il fallback numerico ltsw quando manca ltswDate", () => {
    preData.set({ ltsw: 6 });
    expect(get(ltswHours)).toBe(6);
  });

  it("ignora un ltswDate non valido e ricade sul numerico", () => {
    preData.set({ ltswDate: "boh", ltsw: 2 });
    expect(get(ltswHours)).toBe(2);
  });
});

describe("finestre temporali: il tempo avanza a paziente aperto", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 5, 23, 12, 0, 0));
    clearPatient();
  });
  afterEach(() => {
    clearPatient();
    vi.useRealTimers();
  });

  it("ltswHours cresce con l'orologio dell'app", () => {
    preData.set({ ltswDate: "2026-06-23T10:00" });
    const seen: Array<number | undefined> = [];
    const unsub = ltswHours.subscribe((h) => seen.push(h));
    expect(seen.at(-1)).toBeCloseTo(2, 5);
    vi.advanceTimersByTime(60 * 60 * 1000);
    expect(seen.at(-1)).toBeCloseTo(3, 2);
    unsub();
  });

  it("un trial esce dai risultati quando la finestra scade (TICH-3 < 4,5 h)", async () => {
    const { hemData } = await import("$lib/stores/patient");
    const { hemEligibility } = await import("$lib/stores/eligibility");
    preData.set({ ltswDate: "2026-06-23T08:00", age: 70, premrs: 1 });
    hemData.set({ hemVolume: 20, gcs: 12, ivh: "no", seizure: "no", secondaryCause: "None", anticoag: "none" });
    let tich3: boolean | undefined;
    const unsub = hemEligibility.subscribe((e) => (tich3 = e.tich3));
    expect(tich3).toBe(true); // 4 h
    vi.advanceTimersByTime(40 * 60 * 1000); // 4 h 40 min
    expect(tich3).toBe(false);
    unsub();
  });

  it("anche le regole acute usano il tempo aggiornato (ATHENA <= 16 h)", async () => {
    const { postData } = await import("$lib/stores/patient");
    const { acuteEligibility } = await import("$lib/stores/eligibility");
    preData.set({ ltswDate: "2026-06-22T20:30", age: 60, nihss: 12, premrs: 1 }); // 15,5 h
    postData.set({ lvo: "yes", tandem: "no", tortuosity: "no", targetVessels: ["m1"], aspects: 8 });
    let athena: boolean | undefined;
    const unsub = acuteEligibility.subscribe((e) => (athena = e.athena));
    expect(athena).toBe(true);
    vi.advanceTimersByTime(60 * 60 * 1000); // 16,5 h
    expect(athena).toBe(false);
    unsub();
  });
});
