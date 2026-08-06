import { cn } from "./cn";

interface RevenueTrendChartProps {
  data: { label: string; value: number }[];
  color?: string;
  className?: string;
}

export function RevenueTrendChart({ data, color = "#7C5CFC", className }: RevenueTrendChartProps) {
  const width = 800;
  const height = 320;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxValue = Math.max(...data.map((d) => d.value));
  const minValue = Math.min(...data.map((d) => d.value));
  const valueRange = maxValue - minValue || 1;

  const points = data
    .map((d, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((d.value - minValue) / valueRange) * chartHeight;
      return { x, y, value: d.value, label: d.label };
    });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  const gridLines = 5;
  const yTicks = Array.from({ length: gridLines }, (_, i) => {
    const value = minValue + (valueRange / (gridLines - 1)) * i;
    const y = padding.top + chartHeight - (i / (gridLines - 1)) * chartHeight;
    return { value, y };
  });

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.15} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        {yTicks.map((tick, i) => (
          <g key={i}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={padding.left + chartWidth}
              y2={tick.y}
              stroke="#E8ECF3"
              strokeWidth="1"
            />
            <text
              x={padding.left - 10}
              y={tick.y + 4}
              textAnchor="end"
              className="text-xs fill-muted-foreground"
            >
              ${Math.round(tick.value / 1000)}k
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#revenueGradient)" />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2" />
        ))}

        {points.map((p, i) => (
          <text
            key={i}
            x={p.x}
            y={padding.top + chartHeight + 20}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
