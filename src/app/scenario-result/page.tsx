"use client";

import {
  Clock,
  ChevronLeft,
  Share2,
  CheckCircle2,
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
  const useRoute = useRouter()
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
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const toggleCheckbox = (id: number) => {
    setChecklistItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleShare = () => {
    const CheckIcon = () => (
      <div className="shrink-0 size-4">
        <svg
          className="block size-full"
          fill="none"
          viewBox="0 0 16 16"
        >
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

  const completedCount = checklistItems.filter(
    (item) => item.completed
  ).length;

  const progressPercentage = Math.round(
    (completedCount / checklistItems.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b px-4 py-3 flex justify-between items-center sticky top-0 z-10">
        <button className="w-9 h-9 rounded-lg border flex items-center justify-center" onClick={()=>useRoute.back()}>
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-lg">Scenario Results</h1>

        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-lg border flex items-center justify-center"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </header>

      {/* Main */}
      <main className="px-4 pt-4 pb-6 max-w-6xl mx-auto grid lg:grid-cols-2 gap-4">
        {/* Left */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm p-4 text-center">
            <CheckCircle2 className="w-5 h-5 mx-auto text-green-500 fill-green-500" />
            <p className="text-sm text-neutral-500 mt-1">
              Completed 2 minutes ago
            </p>
          </div>

          {/* Chart */}
          <div className="bg-white rounded-lg shadow-sm">
            <h2 className="text-center py-3 font-semibold">
              Resource Gap Analysis
            </h2>

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
          <h2 className="text-center font-semibold mb-4">
            Recommended Checklist
          </h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{progressPercentage}%</span>
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
              <ChecklistItem
                key={item.id}
                item={item}
                onToggle={toggleCheckbox}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

/* ================= SUB ================= */

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
  return (
    <div className="border rounded-lg p-3 flex gap-3">
      <button onClick={() => onToggle(item.id)}>
        {item.completed ? "✅" : "⬜"}
      </button>

      <div className="flex-1">
        <p className="text-sm">{item.title}</p>
        <div className="text-xs text-gray-500 flex gap-1 items-center">
          <Clock className="w-3 h-3" />
          {item.eta}
        </div>
      </div>
    </div>
  );
}

/* ================= TOOLTIP ================= */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-gray-800 text-white rounded px-3 py-2 text-xs">
      <p className="mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i}>
          {p.name}: {p.value}
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
