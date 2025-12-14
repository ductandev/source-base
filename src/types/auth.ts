import {
  SimulationInput,
  SimulationKPIs,
  SimulationMap,
  SimulationResponsePlan,
  SimulationTopAction,
} from "@/stores/SimulationStore";

export type DisasterType = "flood" | "earthquake" | "hurricane" | "wildfire";
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
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  usrId: string;
  username: string;
  creUsrId: string;
  creDt: Date;
  updUsrId: string;
  updDt: Date;
}

export interface ISimulationRequest {
  disasterType: DisasterType;
  rainfallIntensity: string;
  duration: number;
  windSpeed?: number;
  magnitude?: number;
  fireSpreadRate?: number;
  location: LocationData | null;
}
export interface ISimulationDetailRequest {
  scenarioId: string | boolean | number;
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

export interface ISimulatioResponse {
  status: number;
  statusText: string;
  data: SimulationResult;
}
