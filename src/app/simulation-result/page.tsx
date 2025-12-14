"use client";

import { ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSimulationStore } from "@/stores/SimulationStore";
import { RESPONSE_ACTION_ICONS } from "./_components/constants";
import { useState, useMemo } from "react";
import { showErrorToast, showSuccessToast } from "@/common/toastify";
import { StatCardProps, ResponseActionProps } from "./_components/types";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import GoongClusteredMap from "@/app/simulation-result/_components/GoongPointClusterMap";
import GoongHeatmap from "@/app/simulation-result/_components/GoongHeatmap";

type LayoutProps = {
  stats: StatCardProps[];
  responseAction: Omit<ResponseActionProps, "icon">[];
  onGoBack?: () => void;
  handleShare?: () => void;
};

type TopActionFromApi = {
  rank: number;
  title: string;
  description: string;
  priority?: string;
};

export default function SimulationResults() {
  const simulationResponse = useSimulationStore((s) => s.currentSimulation);
  const router = useRouter();
  const simulationId = simulationResponse?.simulationId;
  const handleShare = async () => {
    if (!simulationId) return;

    const url = `${window.location.origin}/simulation-result/${simulationId}`;

    try {
      await navigator.clipboard.writeText(url);
      showSuccessToast("Copied Successfully!");
    } catch (e) {
      const el = document.createElement("textarea");
      el.value = url;
      el.setAttribute("readonly", "");
      el.style.position = "fixed";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      showErrorToast("Copied Failed!");
    }
  };
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout
          onGoBack={handleGoBack}
          stats={stats}
          responseAction={responseAction}
          handleShare={handleShare}
        />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout
          onGoBack={handleGoBack}
          stats={stats}
          responseAction={responseAction}
          handleShare={handleShare}
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

function DesktopLayout({
  stats,
  responseAction,
  onGoBack,
  handleShare,
}: LayoutProps) {
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
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-neutral-100"
                onClick={handleShare}
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
  handleShare?: () => void;
}

function Header({ onGoBack, handleShare }: HeaderProps) {
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
          onClick={handleShare}
        >
          <Share2 className="size-5" />
          <span className="sr-only">Share</span>
        </Button>
      </div>
    </header>
  );
}

// ✅ NEW: MapSection với GoongHeatmapViewer
function MapSection() {
  const simulationResponse = useSimulationStore((s) => s.currentSimulation);

  if (!simulationResponse?.map) {
    return (
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="h-[271px] lg:h-[400px] bg-neutral-100 flex items-center justify-center">
          <p className="text-neutral-500">No map data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-0 shadow-md">
      <div className="relative h-[271px] lg:h-[400px]">
        <GoongHeatmap
          mapData={simulationResponse.map}
          totalHouseholds={simulationResponse.kpis?.householdsAffected || 0}
          className="w-full h-full"
        />
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
