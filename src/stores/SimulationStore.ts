import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type DisasterType =
  | "wildfire"
  | "earthquake"
  | "flood"
  | "storm"
  | string;

export interface LocationData {
  name: string;
  country: string;
  countryCode?: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
  localNames?: Record<string, string>;
}

export interface SimulationInput {
  disasterType: DisasterType;
  rainfallIntensity: string;
  duration: number;
  windSpeed: number;
  magnitude: number;
  fireSpreadRate: number;
  location: LocationData;
}

export interface MapLegendItem {
  level: "HIGH" | "MEDIUM" | "LOW" | string;
  label: string;
}

export interface MapImpactZone {
  [key: string]: any;
}

export interface SimulationMap {
  center: { lat: number; lng: number };
  zoom: number;
  legend: MapLegendItem[];
  impactZones: MapImpactZone[];
}

export interface SimulationKPIs {
  householdsAffected: number;
  roadBlockages: number;
  sheltersNeeded: number;
}

export interface SimulationTopAction {
  rank: number;
  title: string;
  description: string;
  icon: "FIRE" | "TRUCK" | "WIND" | string;
  priority: "HIGH" | "MEDIUM" | "LOW" | string;
}

export interface SimulationResponsePlan {
  url: string;
  scenarioId: string;
}

export interface SimulationResult {
  simulationId: string;
  input: SimulationInput;
  map: SimulationMap;
  kpis: SimulationKPIs;
  topActions: SimulationTopAction[];
  responsePlan: SimulationResponsePlan;
  generatedAt: string; // ISO
}

export interface LocationData {
  name: string;
  country: string;
  countryCode?: string;
  state?: string;
  lat: number;
  lon: number;
  displayName: string;
  localNames?: Record<string, string>;
}

interface SimulationState {
  currentSimulation: SimulationResult | null;

  history: SimulationResult[];
  favoriteSimulations: SimulationResult[];

  setCurrentSimulation: (data: SimulationResult) => void;
  clearCurrentSimulation: () => void;

  addToHistory: (data: SimulationResult) => void;
  clearHistory: () => void;

  addFavorite: (data: SimulationResult) => void;
  removeFavorite: (simulationId: string) => void;
  isFavorite: (simulationId: string) => boolean;
}

const MAX_HISTORY = 10;
const MAX_FAVORITES = 20;

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      currentSimulation: null,

      history: [],
      favoriteSimulations: [],

      setCurrentSimulation: (data) => {
        set({ currentSimulation: data });
        get().addToHistory(data);
      },

      clearCurrentSimulation: () => set({ currentSimulation: null }),

      addToHistory: (data) => {
        const { history } = get();

        // remove duplicate by simulationId
        const filtered = history.filter(
          (s) => s.simulationId !== data.simulationId,
        );

        const updated = [data, ...filtered].slice(0, MAX_HISTORY);
        set({ history: updated });
      },

      clearHistory: () => set({ history: [] }),

      addFavorite: (data) => {
        const { favoriteSimulations } = get();
        const exists = favoriteSimulations.some(
          (s) => s.simulationId === data.simulationId,
        );

        if (!exists && favoriteSimulations.length < MAX_FAVORITES) {
          set({ favoriteSimulations: [...favoriteSimulations, data] });
        }
      },

      removeFavorite: (simulationId) => {
        const { favoriteSimulations } = get();
        set({
          favoriteSimulations: favoriteSimulations.filter(
            (s) => s.simulationId !== simulationId,
          ),
        });
      },

      isFavorite: (simulationId) => {
        const { favoriteSimulations } = get();
        return favoriteSimulations.some((s) => s.simulationId === simulationId);
      },
    }),
    {
      name: "simulation-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentSimulation: state.currentSimulation,
        history: state.history,
        favoriteSimulations: state.favoriteSimulations,
      }),
    },
  ),
);
