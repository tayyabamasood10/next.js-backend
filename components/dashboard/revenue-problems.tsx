"use client";

import { ProblemItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";

const severityConfig = {
  high: { label: "High", variant: "destructive" as const, className: "bg-danger/10 text-danger border-danger/20" },
  medium: { label: "Medium", variant: "warning" as const, className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", variant: "success" as const, className: "bg-success/10 text-success border-success/20" },
};

const problems: ProblemItem[] = [
  {
    id: "1",
    severity: "high",
    title: "High checkout abandonment rate",
    description:
      "68% of users abandon their cart at checkout. This is 15% above industry average.",
    estimatedImpact: "$12,400/mo",
  },
  {
    id: "2",
    severity: "medium",
    title: "Low mobile conversion rate",
    description:
      "Mobile users convert at 1.8% compared to 4.2% on desktop. Mobile experience needs improvement.",
    estimatedImpact: "$8,200/mo",
  },
  {
    id: "3",
    severity: "low",
    title: "Missing product reviews",
    description:
      "32% of your products have no reviews. Products with reviews convert 2.5x better.",
    estimatedImpact: "$3,100/mo",
  },
];

export function RevenueProblems() {
  return (
    <div className="bg-card border border-border rounded-[18px] shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <h2 className="text-lg font-semibold">Revenue Problems</h2>
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          View all
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="divide-y divide-border">
        {problems.map((problem) => {
          const severity = severityConfig[problem.severity];
          return (
            <div
              key={problem.id}
              className="flex items-start justify-between gap-4 px-6 py-4 transition-colors hover:bg-accent/30"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  <h3 className="font-medium">{problem.title}</h3>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      severity.className
                    )}
                  >
                    {severity.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {problem.description}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-danger">
                    {problem.estimatedImpact}
                  </p>
                  <p className="text-xs text-muted-foreground">at risk</p>
                </div>
                <Button variant="outline" size="sm">
                  Investigate
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { cn } from "@/components/ui/cn";
