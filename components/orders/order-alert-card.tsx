"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Clock, Truck, RefreshCw, PackageX, CreditCard } from "lucide-react";
import { cn } from "./cn";

interface OrderAlert {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: string;
  icon: "payment" | "shipping" | "refund" | "inventory" | "customer" | "high-value";
}

const priorityConfig = {
  high: { label: "High", className: "bg-danger/10 text-danger border-danger/20" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", className: "bg-success/10 text-success border-success/20" },
};

const iconMap = {
  payment: <CreditCard className="h-4 w-4 text-danger" />,
  shipping: <Truck className="h-4 w-4 text-warning" />,
  refund: <RefreshCw className="h-4 w-4 text-info" />,
  inventory: <PackageX className="h-4 w-4 text-warning" />,
  customer: <Clock className="h-4 w-4 text-primary" />,
  "high-value": <AlertTriangle className="h-4 w-4 text-warning" />,
};

interface OrderAlertCardProps {
  alerts: OrderAlert[];
  className?: string;
}

export function OrderAlertCard({ alerts, className }: OrderAlertCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] shadow-sm", className)}>
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-base font-semibold">Order Alerts</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Orders that require your attention</p>
      </div>
      <div className="divide-y divide-border">
        {alerts.map((alert) => {
          const priority = priorityConfig[alert.priority];
          return (
            <div key={alert.id} className="flex items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                  {iconMap[alert.icon]}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{alert.title}</h4>
                    <Badge variant="outline" className={cn("text-xs font-medium", priority.className)}>
                      {priority.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                  <p className="text-sm font-medium text-danger">{alert.estimatedImpact}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                Action
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
