import { SimulationConfig, DisasterType } from './types';
import { PARAMETER_CONSTRAINTS } from './constants';

/**
 * Validate rainfall intensity value
 */
export function validateRainfallIntensity(value: string): boolean {
  const num = parseFloat(value);
  if (isNaN(num)) return false;
  
  const { min, max } = PARAMETER_CONSTRAINTS.rainfallIntensity;
  return num >= min && num <= max;
}

/**
 * Validate duration value
 */
export function validateDuration(value: number): boolean {
  const { min, max } = PARAMETER_CONSTRAINTS.duration;
  return value >= min && value <= max;
}

/**
 * Validate complete simulation configuration
 */
export function validateConfig(config: SimulationConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate disaster type
  if (!config.disasterType) {
    errors.push('Disaster type is required');
  }

  // Validate rainfall intensity for flood
  if (config.disasterType === 'flood') {
    if (!config.rainfallIntensity) {
      errors.push('Rainfall intensity is required for flood simulation');
    } else if (!validateRainfallIntensity(config.rainfallIntensity)) {
      const { min, max } = PARAMETER_CONSTRAINTS.rainfallIntensity;
      errors.push(`Rainfall intensity must be between ${min} and ${max} mm/hr`);
    }
  }

  // Validate duration
  if (!validateDuration(config.duration)) {
    const { min, max } = PARAMETER_CONSTRAINTS.duration;
    errors.push(`Duration must be between ${min} and ${max} hours`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format simulation config for display
 */
export function formatConfigForDisplay(config: SimulationConfig): Record<string, string> {
  return {
    'Disaster Type': config.disasterType.charAt(0).toUpperCase() + config.disasterType.slice(1),
    'Rainfall Intensity': config.rainfallIntensity
      ? `${config.rainfallIntensity} mm/hr`
      : 'Not set',
    'Duration': `${config.duration} hours`,
  };
}

/**
 * Get parameter constraints for a specific disaster type
 */
export function getRelevantParameters(
  disasterType: DisasterType
): (keyof SimulationConfig)[] {
  switch (disasterType) {
    case 'flood':
      return ['rainfallIntensity', 'duration'];
    case 'earthquake':
      return ['magnitude', 'duration'];
    case 'hurricane':
      return ['windSpeed', 'rainfallIntensity', 'duration'];
    case 'wildfire':
      return ['fireSpreadRate', 'windSpeed', 'duration'];
    default:
      return ['duration'];
  }
}

/**
 * Generate unique simulation ID
 */
export function generateSimulationId(): string {
  return `sim-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate estimated simulation time
 */
export function estimateSimulationTime(config: SimulationConfig): number {
  // Base time in seconds
  let baseTime = 30;

  // Add time based on duration
  baseTime += config.duration * 2;

  // Add time based on disaster type complexity
  const complexityMultiplier = {
    flood: 1,
    earthquake: 1.2,
    hurricane: 1.5,
    wildfire: 1.3,
  };

  return Math.round(baseTime * complexityMultiplier[config.disasterType]);
}
