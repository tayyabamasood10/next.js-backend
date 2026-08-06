"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, Sparkles, Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: "problems" | "recommendations" | "activity";
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  icon = "problems",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const icons = {
    problems: AlertTriangle,
    recommendations: Sparkles,
    activity: Inbox,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center rounded-[18px] border border-dashed border-border bg-accent/20 p-8 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-4 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
