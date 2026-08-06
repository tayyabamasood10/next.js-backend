"use client";

import { Button } from "@/components/ui/button";
import { Inbox, AlertTriangle, Sparkles, Clock } from "lucide-react";

interface OrderEmptyStateProps {
  type: "no-orders" | "no-alerts" | "no-insights" | "no-activity";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const config = {
  "no-orders": {
    icon: Inbox,
    title: "No orders yet",
    description: "Orders will appear here once customers start purchasing from your store.",
  },
  "no-alerts": {
    icon: AlertTriangle,
    title: "No alerts",
    description: "Great! No order alerts require your attention right now.",
  },
  "no-insights": {
    icon: Sparkles,
    title: "No AI insights available",
    description: "AI insights will appear here once we have enough order data to analyze.",
  },
  "no-activity": {
    icon: Clock,
    title: "No recent activity",
    description: "Order activity will appear here as orders are processed.",
  },
};

export function OrderEmptyState({ type, title, description, actionLabel, onAction }: OrderEmptyStateProps) {
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
