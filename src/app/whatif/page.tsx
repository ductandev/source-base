'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, MapPin, ChevronDown, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  DEFAULT_SCENARIO, 
  RESOURCE_TABS, 
  RESOURCES_DATA, 
  INFRASTRUCTURE_DATA, 
  POPULATION_DATA 
} from './constants';
import { ResourceItem, Scenario, TabValue } from '@/types/whatif';
import { useRouter} from 'next/navigation';
import { ROUTES } from '@/utils/routes';


export default function WhatIfScenario() {
  const [scenario, setScenario] = useState<Scenario>(DEFAULT_SCENARIO);
  const [activeTab, setActiveTab] = useState<TabValue>('resources');
  const [resources, setResources] = useState(RESOURCES_DATA);
  const [infrastructure, setInfrastructure] = useState(INFRASTRUCTURE_DATA);
  const [population, setPopulation] = useState(POPULATION_DATA);
  const useRoute = useRouter()

  const handleIncrement = useCallback((id: string, tab: TabValue) => {
    const updateData = (items: ResourceItem[]) =>
      items.map((item) => (item.id === id ? { ...item, value: item.value + 1 } : item));

    if (tab === 'resources') setResources(updateData);
    if (tab === 'infrastructure') setInfrastructure(updateData);
    if (tab === 'population') setPopulation(updateData);
  }, []);

  const handleDecrement = useCallback((id: string, tab: TabValue) => {
    const updateData = (items: ResourceItem[]) =>
      items.map((item) =>
        item.id === id && item.value > 0 ? { ...item, value: item.value - 1 } : item
      );

    if (tab === 'resources') setResources(updateData);
    if (tab === 'infrastructure') setInfrastructure(updateData);
    if (tab === 'population') setPopulation(updateData);
  }, []);

  const handleResetToDefault = useCallback(() => {
    setResources(RESOURCES_DATA);
    setInfrastructure(INFRASTRUCTURE_DATA);
    setPopulation(POPULATION_DATA);
  }, []);

  const handleRunSimulation = useCallback(() => {
    console.log('Running simulation with:', {
      scenario,
      resources,
      infrastructure,
      population,
    });
    useRoute.push(ROUTES.SCENARIO_RESULT)
  }, [scenario, resources, infrastructure, population]);

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 px-4 py-6 space-y-4">
          <ScenarioSelector scenario={scenario} />
          <ResourceTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            resources={resources}
            infrastructure={infrastructure}
            population={population}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
            onReset={handleResetToDefault}
          />
        </main>
        <BottomCTA onRunSimulation={handleRunSimulation} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex flex-col min-h-screen">
        <DesktopHeader />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* Left Column - Scenario */}
              <div className="xl:col-span-1 space-y-6">
                <ScenarioSelector scenario={scenario} desktop />
                <InfoCard />
              </div>

              {/* Right Column - Resources */}
              <div className="xl:col-span-2">
                <ResourceTabs
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  resources={resources}
                  infrastructure={infrastructure}
                  population={population}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onReset={handleResetToDefault}
                  desktop
                />
              </div>
            </div>
            {/* Bottom CTA - Desktop */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 pt-8">
              <div className='xl:col-span-1 space-y-6'></div> 
              <div className="xl:col-span-2 space-y-6">
                <Button
                  onClick={handleRunSimulation}
                  className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white text-base"
                  size="lg"
                >
                  Run Simulation
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

function Header() {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <Button variant="ghost" size="icon" className="size-9 hover:bg-neutral-100" onClick={()=>router.back()}>
          <ArrowLeft className="size-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-base font-semibold text-neutral-950">What If Scenario</h1>
        <div className="size-9" /> {/* Spacer */}
      </div>
    </header>
  );
}

function DesktopHeader() {
  const router = useRouter()
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-neutral-100" onClick={() => router.back()}>
            <ArrowLeft className="size-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <h1 className="text-2xl font-semibold text-neutral-950">What If Scenario Configuration</h1>
        </div>
      </div>
    </header>
  );
}

interface ScenarioSelectorProps {
  scenario: Scenario;
  desktop?: boolean;
}

function ScenarioSelector({ scenario, desktop }: ScenarioSelectorProps) {
  return (
    <Card className={`border-0 ${desktop ? 'shadow-md' : 'shadow-sm'}`}>
      <CardContent className={desktop ? 'p-5' : 'p-3'}>
        <button className="w-full text-left space-y-2">
          <p className="text-sm text-neutral-500">Current Scenario</p>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 space-y-2">
              <h2 className="text-base font-semibold text-neutral-950">{scenario.title}</h2>
              <div className="flex items-center gap-1 text-xs text-neutral-700">
                <MapPin className="size-3.5" />
                <span>{scenario.location}</span>
              </div>
            </div>
            <ChevronDown className="size-6 text-neutral-400 flex-shrink-0 mt-1" />
          </div>
        </button>
      </CardContent>
    </Card>
  );
}

function InfoCard() {
  return (
    <Card className="border-neutral-200 bg-green-50/50">
      <CardContent className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-neutral-950">Scenario Information</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Adjust resource allocations to simulate different response strategies. 
          Changes will help you understand the impact of resource distribution on disaster response outcomes.
        </p>
      </CardContent>
    </Card>
  );
}

interface ResourceTabsProps {
  activeTab: TabValue;
  onTabChange: (value: TabValue) => void;
  resources: ResourceItem[];
  infrastructure: ResourceItem[];
  population: ResourceItem[];
  onIncrement: (id: string, tab: TabValue) => void;
  onDecrement: (id: string, tab: TabValue) => void;
  onReset: () => void;
  desktop?: boolean;
}

function ResourceTabs({
  activeTab,
  onTabChange,
  resources,
  infrastructure,
  population,
  onIncrement,
  onDecrement,
  onReset,
  desktop,
}: ResourceTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={(v) => onTabChange(v as TabValue)} className="w-full">
      <TabsList className={`w-full bg-neutral-100 ${desktop ? 'h-11' : 'h-10'}`}>
        {RESOURCE_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={`flex-1 data-[state=active]:bg-[#46a758] data-[state=active]:text-white ${
              desktop ? 'text-sm' : 'text-sm'
            }`}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="resources" className="mt-6 space-y-6">
        <ResourceList
          items={resources}
          onIncrement={(id) => onIncrement(id, 'resources')}
          onDecrement={(id) => onDecrement(id, 'resources')}
          desktop={desktop}
        />
        <ResetButton onClick={onReset} />
      </TabsContent>

      <TabsContent value="infrastructure" className="mt-6 space-y-6">
        <ResourceList
          items={infrastructure}
          onIncrement={(id) => onIncrement(id, 'infrastructure')}
          onDecrement={(id) => onDecrement(id, 'infrastructure')}
          desktop={desktop}
        />
        <ResetButton onClick={onReset} />
      </TabsContent>

      <TabsContent value="population" className="mt-6 space-y-6">
        <ResourceList
          items={population}
          onIncrement={(id) => onIncrement(id, 'population')}
          onDecrement={(id) => onDecrement(id, 'population')}
          desktop={desktop}
        />
        <ResetButton onClick={onReset} />
      </TabsContent>
    </Tabs>
  );
}

interface ResourceListProps {
  items: ResourceItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  desktop?: boolean;
}

function ResourceList({ items, onIncrement, onDecrement, desktop }: ResourceListProps) {
  return (
    <div className={`space-y-6 ${desktop ? 'grid grid-cols-1 gap-4' : ''}`}>
      {items.map((item) => (
        <ResourceCounter
          key={item.id}
          item={item}
          onIncrement={() => onIncrement(item.id)}
          onDecrement={() => onDecrement(item.id)}
        />
      ))}
    </div>
  );
}

interface ResourceCounterProps {
  item: ResourceItem;
  onIncrement: () => void;
  onDecrement: () => void;
}

function ResourceCounter({ item, onIncrement, onDecrement }: ResourceCounterProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-base font-medium text-neutral-950">{item.name}</span>
        {item.unit && <span className="text-sm text-neutral-500">({item.unit})</span>}
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={onDecrement}
          disabled={item.value === 0}
          className="size-7 rounded-lg border-neutral-200 hover:bg-neutral-50"
          aria-label={`Decrease ${item.name}`}
        >
          <Minus className="size-4" />
        </Button>
        <span className="text-base font-semibold text-neutral-950 min-w-[2ch] text-center">
          {item.value}
        </span>
        <Button
          variant="default"
          size="icon"
          onClick={onIncrement}
          className="size-7 rounded-lg bg-[#46a758] hover:bg-[#3d9049] text-white"
          aria-label={`Increase ${item.name}`}
        >
          <Plus className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm font-medium text-[#46a758] hover:text-[#3d9049] transition-colors"
    >
      Reset to Default
    </button>
  );
}

function BottomCTA({ onRunSimulation }: { onRunSimulation: () => void }) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 shadow-lg">
      <Button
        onClick={onRunSimulation}
        className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white"
      >
        Run Simulation
      </Button>
    </div>
  );
}
