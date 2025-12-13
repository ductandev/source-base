"use client";

import { ArrowLeft, Share2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  IMPACT_LEVELS,
  STATS,
  RESPONSE_ACTIONS,
  RESPONSE_ACTION_ICONS,
} from "./_components/constants";
import { StatCardProps, ResponseActionProps } from "./_components/types";

export default function SimulationResults() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </div>
  );
}

function MobileLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 px-4 py-5 space-y-4 pb-24">
        <MapSection />
        <StatsGrid />
        <ResponseActionsSection />
      </main>
      <BottomCTA />
    </div>
  );
}

function DesktopLayout() {
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
            <StatsGrid />
          </div>
          <div className="space-y-6">
            <ResponseActionsSection />
            <AdditionalInsights />
          </div>
        </div>
        <div className="mt-8">
          <Button className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white text-base">
            View Full Response Plan
          </Button>
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
          fill
          className="object-cover"
          priority
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

function StatsGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 lg:gap-4">
      {STATS.map((stat, index) => (
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

function ResponseActionsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-base lg:text-lg font-semibold text-neutral-950">
        Top 3 Response Actions
      </h2>
      <div className="space-y-3">
        {RESPONSE_ACTIONS.map((action) => {
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

function AdditionalInsights() {
  return (
    <Card className="border-0 shadow-md">
      <CardContent className="p-5 space-y-4">
        <h3 className="text-base font-semibold text-neutral-950">
          Impact Analysis
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Severity Level</span>
            <Badge variant="destructive" className="bg-[#fb2c36]">
              High
            </Badge>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Response Time</span>
            <span className="text-sm font-medium text-neutral-950">
              2-4 hours
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-neutral-100">
            <span className="text-sm text-neutral-600">Affected Area</span>
            <span className="text-sm font-medium text-neutral-950">45 km²</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-neutral-600">Resources Needed</span>
            <span className="text-sm font-medium text-neutral-950">
              Critical
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BottomCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 shadow-lg">
      <Button className="w-full h-12 bg-[#46a758] hover:bg-[#3d9049] text-white text-base">
        View Full Response Plan
      </Button>
    </div>
  );
}
