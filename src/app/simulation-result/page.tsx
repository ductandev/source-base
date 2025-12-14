"use client";

import { ArrowLeft, Share2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useSimulationStore } from "@/stores/SimulationStore";
import { useState, useMemo } from "react";
import {
  IMPACT_LEVELS,
  // DEFAULT_STATS,
  // RESPONSE_ACTIONS,
  RESPONSE_ACTION_ICONS,
} from "./_components/constants";
import { StatCardProps, ResponseActionProps } from "./_components/types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";

type LayoutProps = {
  stats: StatCardProps[];
  responseAction: Omit<ResponseActionProps, "icon">[];
  onGoBack?: () => void;
};
type TopActionFromApi = {
  rank: number;
  title: string;
  description: string;
  priority?: string;
};
export default function SimulationResults() {
  const simulationResponse = useSimulationStore((s) => s.currentSimulation);
  /*const [simulationResponse, setSimulationResponse] = useState({
    data: {
      simulationId: "a66839a3-9e01-48bc-99f1-6a558666cccf",
      input: {
        disasterType: "flood",
        rainfallIntensity: "",
        duration: 12,
        windSpeed: 0,
        magnitude: 0,
        fireSpreadRate: 0,
        location: {
          name: "Tân Bình",
          country: "VN",
          countryCode: "VN",
          lat: 10.800444,
          lon: 106.651993,
          displayName: "Tân Bình, Viet Nam",
        },
      },
      map: {
        center: {
          lat: 10.800444,
          lng: 106.651993,
        },
        zoom: 12,
        legend: [
          { level: "HIGH", label: "High Impact" },
          { level: "MEDIUM", label: "Medium Impact" },
          { level: "LOW", label: "Low Impact" },
        ],
        impactZones: [
          {
            level: "HIGH",
            label: "High Impact Zone",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [106.65201, 10.800454],
                  [106.65198, 10.800454],
                  [106.65198, 10.800434],
                  [106.65201, 10.800434],
                  [106.65201, 10.800454],
                ],
              ],
            },
          },
          {
            level: "MEDIUM",
            label: "Medium Impact Zone",
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [106.65205, 10.800474],
                  [106.65195, 10.800474],
                  [106.65195, 10.800414],
                  [106.65205, 10.800414],
                  [106.65205, 10.800474],
                ],
              ],
            },
          },
        ],
      },
      kpis: {
        householdsAffected: 10,
        roadBlockages: 1,
        sheltersNeeded: 0,
      },
      topActions: [
        {
          rank: 1,
          title: "Monitor Rainfall",
          description:
            "Continuously monitor rainfall intensity and accumulation to assess evolving flood risk.",
          icon: "weather-rain",
          priority: "MEDIUM",
        },
        {
          rank: 2,
          title: "Issue Public Warnings",
          description:
            "Communicate potential flood risks and advise residents to stay informed and prepared.",
          icon: "bullhorn",
          priority: "MEDIUM",
        },
        {
          rank: 3,
          title: "Check Drainage Systems",
          description:
            "Ensure local drainage systems are clear and functioning to mitigate localized flooding.",
          icon: "tools",
          priority: "LOW",
        },
      ],
      responsePlan: {
        url: "/api/simulations/a66839a3-9e01-48bc-99f1-6a558666cccf/plan",
        scenarioId: "a66839a3-9e01-48bc-99f1-6a558666cccf",
      },
      generatedAt: "2025-12-13T13:30:09.085Z",
    },
  });*/
  console.log(simulationResponse);
  const router = useRouter();

  const stats: StatCardProps[] = useMemo(() => {
    const kpis = simulationResponse?.kpis;
    return [
      {
        label: "Households Affected",
        value: (kpis?.householdsAffected ?? 0).toLocaleString(),
      },
      {
        label: "Road Blockages",
        value: (kpis?.roadBlockages ?? 0).toLocaleString(),
      },
      {
        label: "Shelters Needed",
        value: (kpis?.sheltersNeeded ?? 0).toLocaleString(),
      },
    ];
  }, [simulationResponse?.kpis]);

  const handleGoBack = () => {
    router.push(ROUTES.SIMULATION_CONFIG);
  };

  const responseAction: Omit<ResponseActionProps, "icon">[] = useMemo(() => {
    const actions = simulationResponse?.topActions ?? [];

    const priorityToColor = (p?: string) => {
      switch ((p ?? "").toUpperCase()) {
        case "HIGH":
          return "blue";
        case "MEDIUM":
          return "green";
        case "LOW":
          return "purple";
        default:
          return "gray";
      }
    };

    return (actions as TopActionFromApi[]).map((a) => ({
      number: a.rank,
      title: a.title,
      description: a.description,
      color: priorityToColor(a.priority),
    }));
  }, [simulationResponse?.topActions]);

  if (!simulationResponse) return <div>No simulation data</div>;
  console.log(simulationResponse);
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          onGoBack={handleGoBack}
          stats={stats}
          responseAction={responseAction}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          onGoBack={handleGoBack}
          stats={stats}
          responseAction={responseAction}
        />
      </div>
    </div>
  );
}

function MobileLayout({ stats, responseAction, onGoBack }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header onGoBack={onGoBack} />
      <main className="flex-1 px-4 py-5 space-y-4 pb-24">
        <MapSection />
        <StatsGrid stats={stats} />
        <ResponseActionsSection responseAction={responseAction} />
      </main>
      <BottomCTA />
    </div>
  );
}

function DesktopLayout({ stats, responseAction, onGoBack }: LayoutProps) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-white border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-neutral-100"
                onClick={onGoBack}
              >
                <ArrowLeft className="size-5" />
                <span className="sr-only">Go back</span>
              </Button>
              <h1 className="text-2xl font-semibold text-neutral-950">
                Simulation Results
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Export Report
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-neutral-100"
              >
                <Share2 className="size-5" />
                <span className="sr-only">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <MapSection />
            <StatsGrid stats={stats} />
          </div>
          <div className="space-y-6">
            <ResponseActionsSection responseAction={responseAction} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface HeaderProps {
  onGoBack?: () => void;
}

function Header({ onGoBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 hover:bg-neutral-100"
          onClick={onGoBack}
        >
          <ArrowLeft className="size-5" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="text-lg font-semibold text-neutral-950">
          Simulation Results
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 hover:bg-neutral-100"
        >
          <Share2 className="size-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </header>
  );
}

function MapSection() {
  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="relative h-[271px] lg:h-[400px] bg-neutral-100">
        <ImageWithFallback
          src={"d2b9b18710eea39cd1a9147b6111319e16a07e3d.png"}
          alt="Impact zones map showing affected areas in Vietnam"
          className="object-cover w-full h-full"
        />

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-md">
          <div className="space-y-2">
            {IMPACT_LEVELS.map((level) => (
              <div key={level.label} className="flex items-center gap-2">
                <div className={`size-3 rounded-full ${level.color}`} />
                <span className="text-xs font-medium text-neutral-950">
                  {level.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="size-10 bg-white hover:bg-neutral-100 shadow-md"
            aria-label="Zoom in"
          >
            <Plus className="size-5" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="size-10 bg-white hover:bg-neutral-100 shadow-md"
            aria-label="Zoom out"
          >
            <Minus className="size-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

function StatsGrid({ stats }: { stats: StatCardProps[] }) {
  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-3 lg:p-4 text-center">
        <p className="text-xs text-neutral-500 leading-tight mb-2 lg:mb-3">
          {label}
        </p>
        <p className="text-lg lg:text-xl font-semibold text-neutral-950 tracking-tight">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

function ResponseActionsSection({
  responseAction,
}: {
  responseAction: Omit<ResponseActionProps, "icon">[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-base lg:text-lg font-semibold text-neutral-950">
        Top 3 Response Actions
      </h2>
      <div className="space-y-3">
        {responseAction.map((action) => {
          const IconComponent =
            RESPONSE_ACTION_ICONS[
              action.number as keyof typeof RESPONSE_ACTION_ICONS
            ];
          return (
            <ResponseActionCard
              key={action.number}
              {...action}
              icon={<IconComponent className="size-5" />}
            />
          );
        })}
      </div>
    </div>
  );
}

function ResponseActionCard({
  number,
  title,
  description,
  icon,
  color,
}: ResponseActionProps) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 size-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-neutral-950 mb-1">
              {number}. {title}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BottomCTA() {
  return <div></div>;
}
