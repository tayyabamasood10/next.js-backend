import { cn } from "./cn";

interface ForecastCardProps {
  expectedRevenue: string;
  projectedGrowth: string;
  confidence: string;
  data: { label: string; value: number }[];
  className?: string;
}

export function ForecastCard({ expectedRevenue, projectedGrowth, confidence, data, className }: ForecastCardProps) {
  const width = 400;
  const height = 160;
  const padding = { top: 10, right: 10, bottom: 30, left: 40 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  return (
    <div className={cn("bg-card border border-border rounded-[18px] p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold">Revenue Forecast</h3>
        <span className="inline-flex items-center rounded-full bg-info/10 px-2.5 py-0.5 text-xs font-medium text-info">
          {confidence} confidence
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground">Expected Revenue</p>
          <p className="text-lg font-bold">{expectedRevenue}</p>
        </div>
        <div className="rounded-xl bg-accent/50 p-3">
          <p className="text-xs text-muted-foreground">Projected Growth</p>
          <p className="text-lg font-bold text-success">{projectedGrowth}</p>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#forecastGradient)" />
        <path d={linePath} fill="none" stroke="#7C5CFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#7C5CFC" strokeWidth="2" />
        ))}
      </svg>
    </div>
  );
}
