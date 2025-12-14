"use client";

import {
  Clock,
  Share2,
  CheckCircle2,
  ArrowLeft,
  Check,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import svgPaths from "./imports/svg-rups3ceizr";
import { useRouter } from "next/navigation";

/* ================= MAIN ================= */

export default function App() {
  const chartData = [
    { category: "People", available: 3000, required: 5000 },
    { category: "Medical", available: 3000, required: 7500 },
    { category: "Shelters", available: 3000, required: 3500 },
    { category: "Food", available: 5000, required: 6000 },
  ];

  const router = useRouter();
  const [isChartLoading, setIsChartLoading] = useState(true);

  const [checklistItems, setChecklistItems] = useState([
    {
      id: 1,
      completed: true,
      title: "Immediate evacuation of high-risk coastal zones",
      eta: "ETA: 2-4 hours",
      priority: "high" as const,
    },
    {
      id: 2,
      completed: false,
      title: "Deploy emergency shelters at designated safe zones",
      eta: "ETA: 2-4 hours",
      priority: "medium" as const,
    },
    {
      id: 3,
      completed: false,
      title: "Secure critical infrastructure and medical facilities",
      eta: "ETA: 2-4 hours",
      priority: "low" as const,
    },
  ]);

  /* ===== CHART LOADING ===== */
  useEffect(() => {
    const timer = setTimeout(() => setIsChartLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const toggleCheckbox = (id: number) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleShare = () => {
    const CheckIcon = () => (
      <div className="shrink-0 w-4 h-4">
        <svg className="block w-full h-full" fill="none" viewBox="0 0 16 16">
          <path d={svgPaths.pf3da6f0} fill="#52C41A" />
        </svg>
      </div>
    );

    toast("Copied Successfully", {
      duration: 3000,
      position: "top-center",
      icon: <CheckIcon />,
      style: {
        background: "white",
        border: "none",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        borderRadius: "8px",
        padding: "10px 16px",
        color: "rgba(0,0,0,0.85)",
        fontSize: "14px",
      },
    });
  };

  const completedCount = checklistItems.filter((item) => item.completed).length;
  const progressPercentage = Math.round(
    (completedCount / checklistItems.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Toaster />

      {/* Headers */}
      <MobileHeader onShare={handleShare} router={router} />
      <DesktopHeader onShare={handleShare} router={router} />

      {/* Main content padding top = header height */}
      <main className="pt-8 px-4 pb-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-4">
        {/* Left */}
        <div className="space-y-4">
          {/* Success Note */}
          <div className="bg-white rounded-lg shadow-sm p-4 text-center space-y-2">
            {/* Success row */}
            <div className="flex justify-center items-center space-x-2">
              <div className="w-5 h-5 flex items-center justify-center rounded-full bg-green-500">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-green-700">Success</span>
            </div>

            {/* Time */}
            <p className="text-sm text-neutral-500">Completed 2 minutes ago</p>

            {/* 3 info boxes */}
            <div className="flex justify-around mt-2 text-sm">
              <div className="text-center">
                <div className="font-semibold">14 days</div>
                <div className="text-gray-500">Duration</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">98%</div>
                <div className="text-gray-500">Efficiency</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">$1,500</div>
                <div className="text-gray-500">Costs</div>
              </div>
            </div>
          </div>
          {/* Chart */}
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-center py-3 font-semibold">Resource Gap Analysis</h2>

            <div className="h-[260px]">
              {isChartLoading ? (
                <ChartSkeleton />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="available" fill="#22c55e" />
                    <Bar dataKey="required" fill="#f59e0b" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-center font-semibold mb-4">Recommended Checklist</h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{progressPercentage}% complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {checklistItems.map((item) => (
              <ChecklistItem key={item.id} item={item} onToggle={toggleCheckbox} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function ChecklistItem({
  item,
  onToggle,
}: {
  item: {
    id: number;
    completed: boolean;
    title: string;
    eta: string;
    priority: "high" | "medium" | "low";
  };
  onToggle: (id: number) => void;
}) {
  const priorityColor = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-blue-100 text-blue-800",
  }[item.priority];

  return (
    <div className="border rounded-lg p-3 flex gap-3 items-center">
      <button onClick={() => onToggle(item.id)} className="flex-none">
        {item.completed ? "✅" : "⬜"}
      </button>

      <div className="flex-1">
        <p className="text-sm">{item.title}</p>
        <div className="text-xs text-gray-500 flex gap-2 items-center mt-1">
          <Clock className="w-3 h-3" />
          <span>{item.eta}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColor}`}>
            {item.priority} priority
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= TOOLTIP ================= */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-800 text-white rounded px-3 py-2 text-xs">
      <p className="mb-1 font-semibold">{label}</p>
      {payload.map((p: any, i: any) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: p.fill }}
          />
          <span>
            {p.name}: {p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ================= SKELETON ================= */

function ChartSkeleton() {
  return (
    <div className="w-full h-full flex items-end justify-around px-6 pb-6 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-2 items-end">
          <div className="w-6 h-20 bg-gray-200 rounded" />
          <div className="w-6 h-32 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  );
}

/* ================= HEADERS ================= */

function MobileHeader({ onShare, router }: any) {
  return (
    <header className="sticky top-0 z-20 lg:hidden bg-white border-b px-4 py-3 flex items-center shadow-sm">
      <button
        onClick={() => router.back()}
        className="flex-none w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-center flex-1">
        Scenario Results
      </h1>

      <button
        onClick={onShare}
        className="flex-none w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-neutral-100"
      >
        <Share2 className="w-4 h-4" />
      </button>
    </header>
  );
}

function DesktopHeader({ onShare, router }: any) {
  return (
    <header className="sticky top-0 hidden lg:flex z-20 bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-6 w-full flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex-none w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h1 className="text-2xl font-semibold text-neutral-950 text-center flex-1">
          Scenario Results
        </h1>

        <button
          onClick={onShare}
          className="flex-none w-9 h-9 flex items-center justify-center rounded-lg border hover:bg-neutral-100"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
