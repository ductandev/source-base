import { create } from "zustand";

type State = {
  result: any | null;
  setResult: (r: any) => void;
};

export const useSimulationResultStore = create<State>((set) => ({
  result: null,
  setResult: (r) => set({ result: r }),
}));
