import { cn } from "./cn";

interface RevenueCardProps {
  title: string;
  value: string | number;
  change?: number;
  previousValue?: string | number;
  icon: React.ReactNode;
  sparkline?: number[];
  className?: string;
}

export function RevenueCard({
  title,
  value,
  change,
  previousValue,
  icon,
  sparkline,
  className,
}: RevenueCardProps) {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  return (
    <div className={cn("bg-card border border-border rounded-[18px] p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {previousValue && (
            <p className="text-xs text-muted-foreground">
              Previous: {previousValue}
            </p>
          )}
          {change !== undefined && (
            <div className="flex items-center gap-1 text-xs">
              <span
                className={cn(
                  "font-medium",
                  isPositive && "text-success",
                  isNegative && "text-danger"
                )}
              >
                {isPositive ? "+" : ""}
                {change}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {sparkline && (
        <div className="mt-4">
          <Sparkline data={sparkline} color={isPositive ? "#00C48C" : isNegative ? "#FF5C5C" : "#7C5CFC"} />
        </div>
      )}
    </div>
  );
}

import { Sparkline } from "@/components/dashboard/sparkline";
