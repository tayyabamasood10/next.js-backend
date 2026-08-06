import { cn } from "./cn";

interface RevenueBreakdownCardProps {
  title: string;
  items: { label: string; value: string; percentage: number; growth?: number; color?: string }[];
  className?: string;
}

export function RevenueBreakdownCard({ title, items, className }: RevenueBreakdownCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] p-6 shadow-sm", className)}>
      <h3 className="mb-4 text-base font-semibold">{title}</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{item.value}</span>
                <span className="text-muted-foreground">{item.percentage}%</span>
                {item.growth !== undefined && (
                  <span className={cn("text-xs font-medium", item.growth >= 0 ? "text-success" : "text-danger")}>
                    {item.growth >= 0 ? "+" : ""}{item.growth}%
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-accent overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
