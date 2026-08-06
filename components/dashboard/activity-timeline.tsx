"use client";

import { ActivityItem } from "@/types";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Rocket,
} from "lucide-react";

const activities: ActivityItem[] = [
  {
    id: "1",
    title: "Store synced successfully",
    description: "Your Shopify store data has been updated.",
    timestamp: "2 hours ago",
    icon: <CheckCircle2 className="h-4 w-4 text-success" />,
  },
  {
    id: "2",
    title: "New problem detected",
    description: "High checkout abandonment rate identified.",
    timestamp: "4 hours ago",
    icon: <AlertTriangle className="h-4 w-4 text-warning" />,
  },
  {
    id: "3",
    title: "Recommendation generated",
    description: "AI suggests improving mobile checkout.",
    timestamp: "5 hours ago",
    icon: <Sparkles className="h-4 w-4 text-primary" />,
  },
  {
    id: "4",
    title: "Campaign created",
    description: "Recovery email campaign for abandoned carts.",
    timestamp: "1 day ago",
    icon: <Rocket className="h-4 w-4 text-primary" />,
  },
];

export function ActivityTimeline() {
  return (
    <div className="bg-card border border-border rounded-[18px] shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4 px-6 py-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
              {activity.icon}
            </div>
            <div className="flex-1 space-y-0.5">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-sm text-muted-foreground">
                {activity.description}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
