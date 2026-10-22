// Pre-arrivo condiviso: la riga del foglio e il messaggio WhatsApp non
// contengono mai il CIP; la riga si rilegge uguale.

import { describe, test, expect } from "vitest";
import { judgePreArrival, type PreArrival } from "$lib/domain/pre-arrival";
import {
  buildPreArrivalMessage,
  fromPreArrivalRow,
  newPreArrivalId,
  toPreArrivalRow,
  whatsAppUrl,
} from "$lib/domain/pre-arrival-share";

const H = 3_600_000;
const NOW = new Date(2026, 9, 22, 9, 0).getTime();

const sem = (over: Partial<PreArrival> = {}): PreArrival & { id: string } => ({
  id: "1b4e28ba-2fa1-11d2-883f-0016d3cca427",
  updatedAt: NOW,
  cip: "ROCA0480512001",
  age: 78,
  premrs: 1,
  race: 7,
  anti: ["antiplatelet", "doac"],
  clock: { mode: "known", at: NOW - 0.8 * H, found: null },
  eta: 15,
  arriveAt: NOW + 15 * 60_000,
  ...over,
});

describe("riga PreArrivals", () => {
  test("senza CIP", () => {
    const row = toPreArrivalRow(sem(), "incoming", NOW);
    expect(JSON.stringify(row)).not.toContain("ROCA");
    expect(row).not.toHaveProperty("cip");
    expect(row.anti).toBe("antiplatelet,doac");
    expect(row.status).toBe("incoming");
  });

  test("andata e ritorno", () => {
    const p = sem({ clock: { mode: "wakeup", at: NOW - 6 * H, found: NOW - 1 * H } });
    const back = fromPreArrivalRow({ ...toPreArrivalRow(p, "arrived", NOW) });
    const { cip: _cip, ...rest } = p;
    expect(back).toEqual({ ...rest, status: "arrived" });
  });

  test("campi vuoti e antitrombotici sconosciuti", () => {
    const back = fromPreArrivalRow({
      ...toPreArrivalRow(sem({ age: undefined, premrs: undefined, race: undefined, eta: undefined, arriveAt: null }), "incoming", NOW),
      anti: "doac,aspirina",
    });
    expect(back?.age).toBeUndefined();
    expect(back?.arriveAt).toBeNull();
    expect(back?.anti).toEqual(["doac"]);
  });

  test("righe illeggibili", () => {
    expect(fromPreArrivalRow({})).toBeNull();
    expect(fromPreArrivalRow({ id: "x", at: "ieri", status: "incoming" })).toBeNull();
    expect(fromPreArrivalRow({ id: "x", at: new Date(NOW).toISOString(), status: "boh" })).toBeNull();
  });

  test("id valido per lo script (lettere, cifre, trattini)", () => {
    expect(newPreArrivalId()).toMatch(/^[A-Za-z0-9-]{8,64}$/);
  });
});

describe("messaggio WhatsApp", () => {
  test("dati del SEM e studi all'arrivo, senza CIP", () => {
    const p = sem();
    const res = judgePreArrival(p, NOW);
    const msg = buildPreArrivalMessage(p, res, NOW);
    expect(msg).not.toContain("ROCA");
    expect(msg).toContain("Stroke code pre-arrival (SEM)");
    expect(msg).toContain("ETA 15m (~09:15)");
    expect(msg).toContain("Age 78 · pre-mRS 1 · RACE 7 (LVO suspected)");
    expect(msg).toContain("Antithrombotics: antiplatelet + DOAC");
    expect(msg).toContain("Onset 08:12 · 1h 03m at arrival");
    if (res.open.length) expect(msg).toContain(`Possible at arrival (${res.open.length}):`);
    for (const j of res.open) expect(msg).toContain(`- ${j.name}`);
    expect(msg).toContain("FASTEST");
  });

  test("risveglio e arrivo sconosciuto", () => {
    const p = sem({ arriveAt: null, eta: undefined, clock: { mode: "wakeup", at: NOW - 8 * H, found: NOW - 2 * H } });
    const msg = buildPreArrivalMessage(p, judgePreArrival(p, NOW), NOW);
    expect(msg).toContain("ETA unknown");
    expect(msg).toContain("Wake-up / unknown: last seen well 01:00, found 07:00 · 8h 00m now");
  });

  test("link wa.me", () => {
    expect(whatsAppUrl("a b\nc")).toBe("https://wa.me/?text=a%20b%0Ac");
  });
});

describe("NIHSS del SEM", () => {
  test("nel messaggio, nella riga e al board", () => {
    const p = sem({ nihss: 12 });
    expect(buildPreArrivalMessage(p, judgePreArrival(p, NOW), NOW)).toContain("Age 78 · NIHSS 12 · pre-mRS 1");
    expect(toPreArrivalRow(p, "incoming", NOW).nihss).toBe(12);
    expect(fromPreArrivalRow({ ...toPreArrivalRow(p, "incoming", NOW) })?.nihss).toBe(12);
  });
});
