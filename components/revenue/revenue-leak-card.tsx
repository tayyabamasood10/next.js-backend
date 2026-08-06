"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { cn } from "./cn";

const severityConfig = {
  high: { label: "High", className: "bg-danger/10 text-danger border-danger/20" },
  medium: { label: "Medium", className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", className: "bg-success/10 text-success border-success/20" },
};

interface RevenueLeak {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedLoss: string;
}

interface RevenueLeakCardProps {
  leaks: RevenueLeak[];
  className?: string;
}

export function RevenueLeakCard({ leaks, className }: RevenueLeakCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] shadow-sm", className)}>
      <div className="border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h3 className="text-base font-semibold">Revenue Leaks</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">Opportunities to recover lost revenue</p>
      </div>
      <div className="divide-y divide-border">
        {leaks.map((leak) => {
          const severity = severityConfig[leak.severity];
          return (
            <div key={leak.id} className="flex items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{leak.title}</h4>
                  <Badge variant="outline" className={cn("text-xs font-medium", severity.className)}>
                    {severity.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{leak.description}</p>
                <p className="text-sm font-medium text-danger">{leak.estimatedLoss} estimated loss</p>
              </div>
              <Button variant="outline" size="sm">
                Investigate
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
