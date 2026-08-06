"use client";

import { CheckCircle2, ShoppingCart, XCircle, Truck, RefreshCw, Sparkles } from "lucide-react";

import { cn } from "./cn";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: "order" | "shipped" | "cancelled" | "refund" | "insight" | "success";
}

const iconMap = {
  order: <ShoppingCart className="h-4 w-4 text-primary" />,
  shipped: <Truck className="h-4 w-4 text-info" />,
  cancelled: <XCircle className="h-4 w-4 text-danger" />,
  refund: <RefreshCw className="h-4 w-4 text-warning" />,
  insight: <Sparkles className="h-4 w-4 text-info" />,
  success: <CheckCircle2 className="h-4 w-4 text-success" />,
};

interface OrderTimelineCardProps {
  events: TimelineEvent[];
  className?: string;
}

export function OrderTimelineCard({ events, className }: OrderTimelineCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] shadow-sm", className)}>
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-base font-semibold">Recent Order Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {events.map((event) => (
          <div key={event.id} className="flex items-start gap-4 px-6 py-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
              {iconMap[event.icon]}
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{event.title}</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <p className="text-xs text-muted-foreground/70">{event.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
