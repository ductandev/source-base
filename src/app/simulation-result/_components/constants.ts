import { AlertCircle, Home, Radio } from "lucide-react";
import { ImpactLevel, ResponseActionProps, StatCardProps } from "./types";

export const IMPACT_LEVELS: ImpactLevel[] = [
  { label: "High Impact", color: "bg-[#fb2c36]" },
  { label: "Medium Impact", color: "bg-[#ff6900]" },
  { label: "Low Impact", color: "bg-[#f0b100]" },
];

export const DEFAULT_STATS: StatCardProps[] = [
  { label: "Households Affected", value: "0" },
  { label: "Road Blockages", value: "0" },
  { label: "Shelters Needed", value: "0" },
];

export const RESPONSE_ACTIONS: Omit<ResponseActionProps, "icon">[] = [
  {
    number: 1,
    title: "Deploy Emergency Services",
    description: "Prioritize dispatch to high-impact zones",
    color: "blue",
  },
  {
    number: 2,
    title: "Establish Shelters",
    description: "Activate designated public buildings",
    color: "green",
  },
  {
    number: 3,
    title: "Communicate Public Alerts",
    description: "Issue evacuation orders for specific areas",
    color: "purple",
  },
];

export const RESPONSE_ACTION_ICONS = {
  1: AlertCircle,
  2: Home,
  3: Radio,
} as const;
