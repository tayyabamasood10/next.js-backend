"use client";

import { Button } from "@/components/ui/button";
import { Inbox, Sparkles, AlertTriangle, TrendingUp } from "lucide-react";

interface RevenueEmptyStateProps {
  type: "no-data" | "no-insights" | "no-leaks" | "no-forecast";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const config = {
  "no-data": {
    icon: Inbox,
    title: "No revenue data yet",
    description: "Connect your store to start tracking revenue performance and trends.",
  },
  "no-insights": {
    icon: Sparkles,
    title: "No AI insights available",
    description: "AI insights will appear here once we have enough data to analyze.",
  },
  "no-leaks": {
    icon: AlertTriangle,
    title: "No revenue leaks detected",
    description: "Great job! We haven't found any significant revenue leaks in your store.",
  },
  "no-forecast": {
    icon: TrendingUp,
    title: "Forecast unavailable",
    description: "Revenue forecast will be available once we collect enough historical data.",
  },
};

export function RevenueEmptyState({ type, title, description, actionLabel, onAction }: RevenueEmptyStateProps) {
  const { icon: Icon, title: defaultTitle, description: defaultDescription } = config[type];

  return (
    <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-border bg-accent/20 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title || defaultTitle}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description || defaultDescription}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
