"use client";

import { Plus, Minus, Users, Home, Siren, MapPin, Bell, ChevronDown, Cloud, ArrowLeft, Share, ShareIcon, Share2 } from "lucide-react";

// ------------------- MAIN COMPONENT -------------------
export default function AISimulationResults() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile */}
      <div className="lg:hidden">
        <MobileLayout />
      </div>

      {/* Desktop */}
      <div className="hidden lg:block">
        <DesktopLayout />
      </div>
    </div>
  );
}

// ------------------- MOBILE -------------------
function MobileLayout() {
  return (
    <div className="pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-5 pb-3 bg-white shadow-sm">
        <button className="p-2 rounded-full hover:bg-gray-100">
           <ArrowLeft size={20} />
        </button>
        <div className="font-semibold text-lg">Simulation Results</div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <main className="px-4 py-6 space-y-6">
        <MapSection mobile />
        <StatsSection mobile />
        <TopActions />
        <div>
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium shadow">
            View Full Response Plan
          </button>
        </div>
      </main>
    </div>
  );
}

// ------------------- DESKTOP -------------------
function DesktopLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       <header className="bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl text-neutral-900 flex items-center gap-2">
                <Cloud className="size-7 text-[#2B7FFF]" />
                 Weather App
              </h1>
              <nav className="flex items-center gap-6">
                <a
                  href="/home"
                  className="text-sm text-neutral-900 hover:text-[#2B7FFF] transition-colors"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  What If
                </a>
                <a
                  href="/simula-result"
                  className="text-sm text-neutral-600 hover:text-[#2B7FFF] transition-colors"
                >
                  Simulation
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-lg cursor-pointer hover:bg-neutral-100 transition-colors">
                <MapPin className="size-5 text-[#2B7FFF]" />
                <span className="text-sm text-[#101828]">Your Location</span>
                <ChevronDown className="size-4 text-[#4A5565]" />
              </div>
              <div className="relative">
                <button className="size-10 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <Bell className="size-5 text-[#364153]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header> 

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col xl:flex-row gap-6">
        {/* LEFT COLUMN */}
        <div className="flex-2 space-y-6">
          <MapSection />
          <StatsSection />
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-medium shadow">
            View Full Response Plan
          </button>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 space-y-6">
          <TopActions />
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Simulation Summary</h3>
            <p>Households Affected: 1,500</p>
            <p>Road Blockages: 42</p>
            <p>Shelters Needed: 3,200</p>
          </div>
        </div>
      </main>
    </div>
  );
}

// ------------------- SHARED COMPONENTS -------------------
function MapSection({ mobile }: { mobile?: boolean }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-md">
      <div className={`${mobile ? "h-52" : "h-[550px] xl:h-[600px]"} rounded-2xl overflow-hidden bg-gray-200`}>
        <img
          src="https://ui-avatars.com/api/?name=Map&size=800"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Legend */}
      <div className="absolute top-5 left-5 bg-white shadow rounded-xl p-2 text-xs space-y-1">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> High Impact</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-yellow-400"></div> Medium Impact</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Low Impact</div>
      </div>

      {/* Zoom buttons */}
      {!mobile && (
        <div className="absolute bottom-5 right-5 flex flex-col gap-2">
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><Plus /></button>
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center"><Minus /></button>
        </div>
      )}
    </div>
  );
}

function StatsSection({ mobile }: { mobile?: boolean }) {
  return (
    <div className={`${mobile ? "grid grid-cols-3 gap-3" : "grid grid-cols-3 gap-4"}`}>
      <StatCard label="Households Affected" value="1,500" />
      <StatCard label="Road Blockages" value="42" />
      <StatCard label="Shelters Needed" value="3,200" />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-xl font-bold text-gray-800 mt-1">{value}</div>
    </div>
  );
}

function TopActions() {
  const actions = [
    { title: "Deploy Emergency Services", desc: "Prioritize dispatch to high-impact zones.", icon: <Users className="w-5 h-5 text-blue-600" />, bg: "bg-blue-100" },
    { title: "Establish Shelters", desc: "Activate designated public buildings.", icon: <Home className="w-5 h-5 text-green-600" />, bg: "bg-green-100" },
    { title: "Communicate Public Alerts", desc: "Issue evacuation orders for specific areas.", icon: <Siren className="w-5 h-5 text-purple-600" />, bg: "bg-purple-100" },
  ];

  return (
    <div>
      <div className="text-lg font-bold">Top 3 Response Actions</div>
      <div className="mt-4 space-y-3">
        {actions.map((act, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow p-4 flex gap-4 items-start">
            <div className={`w-10 h-10 rounded-full ${act.bg} flex items-center justify-center`}>{act.icon}</div>
            <div>
              <div className="font-semibold text-gray-800">{idx + 1}. {act.title}</div>
              <p className="text-xs text-gray-500 mt-1">{act.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
