"use client";

import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { cn } from "./cn";

interface AIRevenueInsightCardProps {
  title: string;
  description: string;
  estimatedLoss: string;
  actions: string[];
  impact?: string;
  className?: string;
}

export function AIRevenueInsightCard({
  title,
  description,
  estimatedLoss,
  actions,
  impact,
  className,
}: AIRevenueInsightCardProps) {
  return (
    <div className={cn("relative overflow-hidden rounded-[18px] border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-sm", className)}>
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5" />

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">AI-Powered Insight</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>

        <div className="mb-4 rounded-xl bg-danger/5 border border-danger/10 p-4">
          <p className="text-sm font-medium text-danger">{estimatedLoss}</p>
          <p className="text-xs text-muted-foreground">Estimated monthly revenue loss</p>
        </div>

        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium">Recommended Actions:</p>
          <ul className="space-y-1">
            {actions.map((action, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {action}
              </li>
            ))}
          </ul>
        </div>

        {impact && (
          <div className="mb-4 rounded-xl bg-success/5 border border-success/10 p-3">
            <p className="text-sm font-medium text-success">{impact}</p>
            <p className="text-xs text-muted-foreground">Expected impact if implemented</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button size="sm">
            View Details
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            Generate Action Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
