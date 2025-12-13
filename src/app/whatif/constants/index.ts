import { ResourceItem, ResourceTab, Scenario } from "@/types/whatif";


export const DEFAULT_SCENARIO: Scenario = {
  id: 'scenario-1',
  title: 'Magnitude 7.1 Earthquake',
  location: 'Nha Trang, Vietnam',
  type: 'earthquake',
  magnitude: 7.1,
};

export const RESOURCE_TABS: ResourceTab[] = [
  { value: 'resources', label: 'Resources' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'population', label: 'Population' },
];

export const RESOURCES_DATA: ResourceItem[] = [
  {
    id: 'medical-supplies',
    name: 'Medical Supplies',
    value: 12,
    unit: 'Kit',
    min: 0,
    max: 100,
    category: 'resources',
  },
  {
    id: 'food',
    name: 'Food',
    value: 12,
    unit: 'Kg',
    min: 0,
    max: 1000,
    category: 'resources',
  },
  {
    id: 'response-people',
    name: 'Response People',
    value: 12,
    min: 0,
    max: 500,
    category: 'resources',
  },
  {
    id: 'emergency-shelters',
    name: 'Emergency Shelters',
    value: 5,
    unit: 'Kit',
    min: 0,
    max: 50,
    category: 'resources',
  },
];

export const INFRASTRUCTURE_DATA: ResourceItem[] = [
  {
    id: 'hospitals',
    name: 'Hospitals',
    value: 3,
    unit: 'Facility',
    min: 0,
    max: 20,
    category: 'infrastructure',
  },
  {
    id: 'fire-stations',
    name: 'Fire Stations',
    value: 5,
    unit: 'Station',
    min: 0,
    max: 30,
    category: 'infrastructure',
  },
  {
    id: 'police-stations',
    name: 'Police Stations',
    value: 4,
    unit: 'Station',
    min: 0,
    max: 25,
    category: 'infrastructure',
  },
  {
    id: 'evacuation-routes',
    name: 'Evacuation Routes',
    value: 8,
    unit: 'Route',
    min: 0,
    max: 50,
    category: 'infrastructure',
  },
];

export const POPULATION_DATA: ResourceItem[] = [
  {
    id: 'total-population',
    name: 'Total Population',
    value: 45000,
    unit: 'People',
    min: 0,
    max: 1000000,
    category: 'population',
  },
  {
    id: 'vulnerable-population',
    name: 'Vulnerable Population',
    value: 8500,
    unit: 'People',
    min: 0,
    max: 100000,
    category: 'population',
  },
  {
    id: 'evacuation-capacity',
    name: 'Evacuation Capacity',
    value: 12000,
    unit: 'People',
    min: 0,
    max: 100000,
    category: 'population',
  },
  {
    id: 'trained-volunteers',
    name: 'Trained Volunteers',
    value: 150,
    unit: 'People',
    min: 0,
    max: 5000,
    category: 'population',
  },
];

export const SCENARIO_PRESETS: Scenario[] = [
  DEFAULT_SCENARIO,
  {
    id: 'scenario-2',
    title: 'Category 4 Hurricane',
    location: 'Miami, Florida',
    type: 'hurricane',
  },
  {
    id: 'scenario-3',
    title: 'Flash Flood Event',
    location: 'Bangkok, Thailand',
    type: 'flood',
  },
  {
    id: 'scenario-4',
    title: 'Wildfire Outbreak',
    location: 'California, USA',
    type: 'wildfire',
  },
];
