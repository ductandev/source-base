import {
  DisasterTypeOption,
  SimulationConfig,
  ParameterConstraints,
} from "./types";

export const DISASTER_TYPES: DisasterTypeOption[] = [
  {
    value: "flood",
    label: "Flood",
    description:
      "Simulate flooding scenarios with rainfall intensity and duration",
  },
  {
    value: "earthquake",
    label: "Earthquake",
    description: "Model seismic activity and structural impacts",
  },
  {
    value: "hurricane",
    label: "Hurricane",
    description: "Simulate tropical cyclone impacts with wind and rain",
  },
  {
    value: "wildfire",
    label: "Wildfire",
    description: "Model fire spread patterns and evacuation needs",
  },
];

export const DEFAULT_SIMULATION_CONFIG: SimulationConfig = {
  disasterType: "flood",
  rainfallIntensity: "",
  duration: 12,
  windSpeed: 0,
  magnitude: 0,
  fireSpreadRate: 0,
};

export const PARAMETER_CONSTRAINTS: ParameterConstraints = {
  rainfallIntensity: {
    min: 0,
    max: 500,
    unit: "mm/hr",
  },
  duration: {
    min: 1,
    max: 48,
    unit: "hours",
  },
  windSpeed: {
    min: 0,
    max: 300,
    unit: "km/h",
  },
  magnitude: {
    min: 1,
    max: 10,
    unit: "Richter",
  },
};

export const DURATION_PRESETS = [
  { value: 6, label: "6 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
];
