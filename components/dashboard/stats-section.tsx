import { StatCard } from "./stat-card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: 20.1,
    icon: <DollarSign className="h-5 w-5" />,
    sparkline: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
  },
  {
    title: "Orders",
    value: "1,234",
    change: 12.5,
    icon: <ShoppingCart className="h-5 w-5" />,
    sparkline: [20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 58, 70],
  },
  {
    title: "Customers",
    value: "8,532",
    change: 8.2,
    icon: <Users className="h-5 w-5" />,
    sparkline: [40, 35, 45, 40, 50, 45, 55, 50, 60, 55, 65, 60],
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: -2.1,
    icon: <TrendingUp className="h-5 w-5" />,
    sparkline: [50, 45, 40, 35, 30, 25, 20, 15, 10, 15, 12, 8],
  },
];

export function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
