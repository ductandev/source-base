"use client";

import { useState, useCallback, useTransition } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { ROUTES } from "@/utils/routes";
import { useLocationStore } from "@/stores/locationStore";
import { showErrorToast, showSuccessToast } from "@/common/toastify";
import { useRouter } from "next/navigation";
import { useSimulation } from "@/api/simulation";
import { useSimulationResultStore } from "@/stores/SimulationStore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "./_components/radio-group";
import { Slider } from "./_components/slider";
import {
  DISASTER_TYPES,
  DEFAULT_SIMULATION_CONFIG,
} from "./_components/constants";

import type { DisasterType, SimulationConfig } from "./_components/types";

export default function SimulationConfig() {
  const { locationData } = useLocationStore();
  const router = useRouter();
  const setResult = useSimulationResultStore((s) => s.setResult);
  const [isPending, startTransition] = useTransition();
  const [config, setConfig] = useState<SimulationConfig>({
    ...DEFAULT_SIMULATION_CONFIG,
    location: locationData,
  });
  const { mutateAsync: mutateSimulation } = useSimulation();
  const handleDisasterTypeChange = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, disasterType: value as DisasterType }));
  }, []);

  const handleRainfallChange = useCallback((value: string) => {
    setConfig((prev) => ({ ...prev, rainfallIntensity: value }));
  }, []);

  const handleDurationChange = useCallback((value: number[]) => {
    setConfig((prev) => ({ ...prev, duration: value[0] }));
  }, []);

  const handleRunSimulation = useCallback(() => {
    startTransition(() => {
      (async () => {
        try {
          console.log(config);
          if (config.location) {
            const data = await mutateSimulation(config);
            setResult(data);
            showSuccessToast("Simulation Successful");
          }

          //   router.push(ROUTES.SIMULATION_RESULT);
        } catch (err) {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status;
            if (status === 403) {
              showErrorToast("403");
              return;
            }
          }
          showErrorToast("Simulation Fail. Please try again");
        }
      })();
    });
  }, [config, mutateSimulation, setResult, router, startTransition]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          config={config}
          onDisasterTypeChange={handleDisasterTypeChange}
          onRainfallChange={handleRainfallChange}
          onDurationChange={handleDurationChange}
          onRunSimulation={handleRunSimulation}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          config={config}
          onDisasterTypeChange={handleDisasterTypeChange}
          onRainfallChange={handleRainfallChange}
          onDurationChange={handleDurationChange}
          onRunSimulation={handleRunSimulation}
        />
      </div>
    </div>
  );
}

interface LayoutProps {
  config: SimulationConfig;
  onDisasterTypeChange: (value: string) => void;
  onRainfallChange: (value: string) => void;
  onDurationChange: (value: number[]) => void;
  onRunSimulation: () => void;
}

function MobileLayout({
  config,
  onDisasterTypeChange,
  onRainfallChange,
  onDurationChange,
  onRunSimulation,
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Status Bar */}
      <StatusBar />

      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex-1 px-4 py-5 space-y-6 pb-24">
        <DisasterTypeSection
          selectedType={config.disasterType}
          onChange={onDisasterTypeChange}
        />
        <ParametersSection
          rainfallIntensity={config.rainfallIntensity}
          duration={config.duration}
          onRainfallChange={onRainfallChange}
          onDurationChange={onDurationChange}
        />
      </main>

      {/* Bottom CTA */}
      <BottomCTA onRunSimulation={onRunSimulation} />

      {/* Home Indicator */}
      <HomeIndicator />
    </div>
  );
}

function DesktopLayout({
  config,
  onDisasterTypeChange,
  onRainfallChange,
  onDurationChange,
  onRunSimulation,
}: LayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-neutral-100"
            >
              <ArrowLeft className="size-5" />
              <span className="sr-only">Go back</span>
            </Button>
            <h1 className="text-2xl font-semibold text-neutral-950">
              Simulation Configuration
            </h1>
          </div>
        </div>
      </header>

      {/* Desktop Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-6xl">
          {/* Left Column - Disaster Type */}
          <div className="space-y-6">
            <DisasterTypeSection
              selectedType={config.disasterType}
              onChange={onDisasterTypeChange}
              desktop
            />
            <InfoCard />
          </div>

          {/* Right Column - Parameters */}
          <div className="space-y-6">
            <ParametersSection
              rainfallIntensity={config.rainfallIntensity}
              duration={config.duration}
              onRainfallChange={onRainfallChange}
              onDurationChange={onDurationChange}
              desktop
            />
            <PreviewCard config={config} />
          </div>
        </div>

        {/* Bottom CTA - Desktop */}
        <div className="mt-8 max-w-6xl">
          <Button
            onClick={onRunSimulation}
            className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white text-base"
            size="lg"
          >
            Run Simulation
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div className="bg-white px-6 py-3 flex items-center justify-between border-b border-neutral-100">
      <span className="text-neutral-950 font-medium">9:41</span>
      <div className="flex items-center gap-2">
        <div className="size-4 text-neutral-700">
          <svg fill="currentColor" viewBox="0 0 18 10">
            <path d="M2 6C2.55228 6 3 6.44772 3 7V9C3 9.55228 2.55228 10 2 10H1C0.447715 10 0 9.55228 0 9V7C0 6.44772 0.447715 6 1 6H2ZM7 4C7.55228 4 8 4.44772 8 5V9C8 9.55228 7.55228 10 7 10H6C5.44772 10 5 9.55228 5 9V5C5 4.44772 5.44772 4 6 4H7ZM12 2C12.5523 2 13 2.42979 13 2.95996V9.04004C13 9.57021 12.5523 10 12 10H11C10.4478 9.99994 10 9.57018 10 9.04004V2.95996C10 2.42982 10.4478 2.00006 11 2H12ZM17 0C17.5523 0 18 0.419733 18 0.9375V9.0625C18 9.58027 17.5523 10 17 10H16C15.4477 10 15 9.58027 15 9.0625V0.9375C15 0.419733 15.4477 0 16 0H17Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 hover:bg-neutral-100"
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-base font-semibold text-neutral-950">
          Simulation Results
        </h1>
        <div className="size-9" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
}

interface DisasterTypeSectionProps {
  selectedType: DisasterType;
  onChange: (value: string) => void;
  desktop?: boolean;
}

function DisasterTypeSection({
  selectedType,
  onChange,
  desktop,
}: DisasterTypeSectionProps) {
  return (
    <Card className={`border-0 shadow-sm ${desktop ? "shadow-md" : ""}`}>
      <CardHeader className={desktop ? "pb-4" : "p-0 mb-3"}>
        {desktop ? (
          <>
            <CardTitle className="text-xl">Choose a Disaster Type</CardTitle>
            <CardDescription>
              Select the disaster type you want to simulate.
            </CardDescription>
          </>
        ) : (
          <div className="space-y-2">
            <h2 className="text-base font-medium text-neutral-950">
              Choose a Disaster Type
            </h2>
            <p className="text-sm text-neutral-500">
              Select the disaster type you want to simulate.
            </p>
          </div>
        )}
      </CardHeader>
      <CardContent className={desktop ? "pt-0" : "p-0"}>
        <RadioGroup
          value={selectedType}
          onValueChange={onChange}
          className="space-y-3"
        >
          {DISASTER_TYPES.map((type) => (
            <RadioCard
              key={type.value}
              value={type.value}
              label={type.label}
              selected={selectedType === type.value}
            />
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

interface RadioCardProps {
  value: string;
  label: string;
  selected: boolean;
}

function RadioCard({ value, label, selected }: RadioCardProps) {
  return (
    <Label
      htmlFor={value}
      className={`
        flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all
        ${
          selected
            ? "bg-[#fbfefb] border-[#46a758] shadow-sm"
            : "bg-white border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300"
        }
      `}
    >
      <span className="text-sm font-medium text-neutral-950">{label}</span>
      <RadioGroupItem
        value={value}
        id={value}
        className={selected ? "border-[#46a758] text-[#46a758]" : ""}
      />
    </Label>
  );
}

interface ParametersSectionProps {
  rainfallIntensity: string;
  duration: number;
  onRainfallChange: (value: string) => void;
  onDurationChange: (value: number[]) => void;
  desktop?: boolean;
}

function ParametersSection({
  rainfallIntensity,
  duration,
  onRainfallChange,
  onDurationChange,
  desktop,
}: ParametersSectionProps) {
  return (
    <Card className={`border-0 shadow-sm ${desktop ? "shadow-md" : ""}`}>
      <CardHeader className={desktop ? "pb-4" : "p-0 mb-3"}>
        {desktop ? (
          <CardTitle className="text-xl">Adjust Parameters</CardTitle>
        ) : (
          <h2 className="text-base font-medium text-neutral-950">
            Adjust Parameters
          </h2>
        )}
      </CardHeader>
      <CardContent
        className={
          desktop
            ? "pt-0 space-y-6"
            : "p-4 bg-white rounded-lg shadow-sm space-y-4"
        }
      >
        {/* Rainfall Intensity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="rainfall"
              className="text-sm font-medium text-neutral-950"
            >
              Rainfall Intensity
            </Label>
            <span className="text-sm text-neutral-500">mm/hr</span>
          </div>
          <Input
            id="rainfall"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter rainfall intensity"
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", ".", ",", " "].includes(e.key))
                e.preventDefault();
            }}
            value={rainfallIntensity}
            onChange={(e) => {
              const digitsOnly = e.target.value.replace(/\D/g, ""); // keep only 0-9
              onRainfallChange(digitsOnly);
            }}
            className="h-9 bg-white border-neutral-200"
          />
        </div>

        {/* Duration Slider */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-neutral-950">
              Duration
            </Label>
            <span className="text-sm text-neutral-500">{duration} hours</span>
          </div>
          <Slider
            value={[duration]}
            onValueChange={onDurationChange}
            max={168}
            step={1}
            className="[&_[data-slot=slider-range]]:bg-[#46a758] [&_[data-slot=slider-thumb]]:border-[#46a758]"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoCard() {
  return (
    <Card className="border-neutral-200 bg-blue-50/50">
      <CardContent className="p-4 flex items-start gap-3">
        <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-neutral-950">
            Simulation Information
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Configure your disaster simulation parameters carefully. The results
            will help you understand potential impacts and prepare response
            strategies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function PreviewCard({ config }: { config: SimulationConfig }) {
  return (
    <Card className="border-neutral-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Configuration Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-neutral-100">
          <span className="text-sm text-neutral-600">Disaster Type</span>
          <span className="text-sm font-medium text-neutral-950 capitalize">
            {config.disasterType}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-neutral-100">
          <span className="text-sm text-neutral-600">Rainfall Intensity</span>
          <span className="text-sm font-medium text-neutral-950">
            {config.rainfallIntensity || "Not set"} mm/hr
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-neutral-600">Duration</span>
          <span className="text-sm font-medium text-neutral-950">
            {config.duration} hours
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function BottomCTA({ onRunSimulation }: { onRunSimulation: () => void }) {
  return (
    <div className="fixed bottom-9 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-lg">
      <Button
        onClick={onRunSimulation}
        className="w-full h-9 bg-[#46a758] hover:bg-[#3d9049] text-white"
      >
        Run Simulation
      </Button>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-9 bg-white flex items-center justify-center">
      <div className="w-[148px] h-1 bg-neutral-900 rounded-full" />
    </div>
  );
}
