import type { SolveStartEvent } from "@data-maki/schemas";
import { atom } from "jotai";

export const solverDataAtom = atom<Omit<SolveStartEvent, "eventName"> | false>(false);
export const workersAtom = atom<number[]>([]);
