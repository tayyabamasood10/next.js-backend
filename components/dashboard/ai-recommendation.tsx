"use client";

import { RecommendationItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

interface AIRecommendationProps {
  recommendation: RecommendationItem | null;
}

export function AIRecommendation({ recommendation }: AIRecommendationProps) {
  if (!recommendation) {
    return (
      <div className="relative overflow-hidden rounded-[18px] border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-lg font-semibold">No recommendations yet</h3>
            <p className="text-sm text-muted-foreground">
              AI recommendations will appear here once we have enough data to analyze.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-[18px] border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-sm">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-primary/5" />

      <div className="relative flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {recommendation.title}
            </h3>
            <span className="text-sm font-medium text-success">
              {recommendation.impact}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {recommendation.description}
          </p>
          <Button className="mt-3" size="sm">
            Apply recommendation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
