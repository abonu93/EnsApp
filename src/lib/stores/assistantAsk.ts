// Domanda "in sospeso" passata dalla home alla chat: quando l'utente tocca il
// campo "Chiedi" o un chip suggerito nella home, la chat la precompila.
import { writable } from "svelte/store";

export const pendingQuestion = writable<string>("");
