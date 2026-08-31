"use client";

import { ProblemItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, Zap } from "lucide-react";
import { cn } from "@/components/ui/cn";

const severityConfig = {
  high: { label: "High", variant: "destructive" as const, className: "bg-danger/10 text-danger border-danger/20" },
  medium: { label: "Medium", variant: "warning" as const, className: "bg-warning/10 text-warning border-warning/20" },
  low: { label: "Low", variant: "success" as const, className: "bg-success/10 text-success border-success/20" },
};

interface RevenueProblemsProps {
  problems: ProblemItem[];
  aiInsight: {
    problem: string | null;
    impact: string | null;
  } | null;
}

export function RevenueProblems({ problems, aiInsight }: RevenueProblemsProps) {
  const displayProblems = aiInsight?.problem
    ? [
        {
          id: "ai-problem",
          severity: "high" as const,
          title: aiInsight.problem,
          description: aiInsight.impact || "Detected from your current store data.",
          estimatedImpact: aiInsight.impact || "Review required",
        },
        ...problems,
      ]
    : problems;

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
        {displayProblems.map((problem) => {
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
