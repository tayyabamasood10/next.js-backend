import { cn } from "./cn";

interface OrderStatusCardProps {
  title: string;
  count: number;
  percentage: number;
  color: string;
  icon: React.ReactNode;
  className?: string;
}

export function OrderStatusCard({ title, count, percentage, color, icon, className }: OrderStatusCardProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] p-5 shadow-sm transition-all duration-200 hover:shadow-md", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </div>
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold">{count}</p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
        <div className="h-1.5 w-16 rounded-full bg-accent overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%`, backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}
