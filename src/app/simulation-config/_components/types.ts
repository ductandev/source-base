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
export type DisasterType = "flood" | "earthquake" | "hurricane" | "wildfire";

export interface DisasterTypeOption {
  value: DisasterType;
  label: string;
  description?: string;
  icon?: string;
}

export interface SimulationConfig {
  disasterType: DisasterType;
  rainfallIntensity: string;
  duration: number;
  windSpeed?: number;
  magnitude?: number;
  fireSpreadRate?: number;
  location: LocationData | null;
}

export interface SimulationResult {
  id: string;
  config: SimulationConfig;
  timestamp: Date;
  status: "pending" | "running" | "completed" | "failed";
  results?: any;
}

export interface ParameterConstraints {
  rainfallIntensity: {
    min: number;
    max: number;
    unit: string;
  };
  duration: {
    min: number;
    max: number;
    unit: string;
  };
  windSpeed?: {
    min: number;
    max: number;
    unit: string;
  };
  magnitude?: {
    min: number;
    max: number;
    unit: string;
  };
}
