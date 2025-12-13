import { ResourceItem, WhatIfScenarioConfig } from "@/types/whatif";

export function generateConfigSummary(config: WhatIfScenarioConfig): {
  totalResources: number;
  totalInfrastructure: number;
  totalPopulation: number;
  isModified: boolean;
} {
  return {
    totalResources: config.resources.reduce((sum, item) => sum + item.value, 0),
    totalInfrastructure: config.infrastructure.reduce((sum, item) => sum + item.value, 0),
    totalPopulation: config.population.reduce((sum, item) => sum + item.value, 0),
    isModified: true, // Would compare with defaults
  };
}

export function validateResourceValue(item: ResourceItem, value: number): boolean {
  const min = item.min ?? 0;
  const max = item.max ?? Number.MAX_SAFE_INTEGER;
  return value >= min && value <= max;
}

export function validateConfiguration(config: WhatIfScenarioConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate scenario
  if (!config.scenario.title) {
    errors.push('Scenario title is required');
  }

  // Validate resources
  [...config.resources, ...config.infrastructure, ...config.population].forEach((item) => {
    if (!validateResourceValue(item, item.value)) {
      errors.push(`${item.name} value is out of valid range`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}