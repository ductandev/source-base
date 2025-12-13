export interface StatCardProps {
  label: string;
  value: string | number;
}

export interface ResponseActionProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "blue" | "green" | "purple";
}

export interface ImpactLevel {
  label: string;
  color: string;
}

export interface ImpactAnalysisItem {
  label: string;
  value: string | React.ReactNode;
  type?: "text" | "badge";
}

export type ResponseActionColor = "blue" | "green" | "purple";

export const IMPACT_COLORS = {
  high: "#fb2c36",
  medium: "#ff6900",
  low: "#f0b100",
} as const;

export const RESPONSE_ACTION_COLORS = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  purple: "bg-purple-100 text-purple-600",
} as const;
