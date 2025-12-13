export type TabValue = 'resources' | 'infrastructure' | 'population';

export interface Scenario {
  id: string;
  title: string;
  location: string;
  type: 'earthquake' | 'flood' | 'hurricane' | 'wildfire';
  magnitude?: number;
  description?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  value: number;
  unit?: string;
  min?: number;
  max?: number;
  category: TabValue;
}

export interface ResourceTab {
  value: TabValue;
  label: string;
  icon?: string;
}

export interface WhatIfScenarioConfig {
  scenario: Scenario;
  resources: ResourceItem[];
  infrastructure: ResourceItem[];
  population: ResourceItem[];
}

export interface SimulationResult {
  id: string;
  config: WhatIfScenarioConfig;
  timestamp: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  results?: any;
}
