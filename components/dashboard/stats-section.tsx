import { StatCard } from "./stat-card";

interface StatsSectionProps {
  stats: {
    title: string;
    value: string | number;
    change?: number;
    icon: React.ReactNode;
    sparkline?: number[];
  }[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
