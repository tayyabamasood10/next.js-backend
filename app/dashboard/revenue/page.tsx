"use client";

import { useState, useMemo } from "react";
import { RevenueCard } from "@/components/revenue/revenue-card";
import { FilterTabs } from "@/components/revenue/filter-tabs";
import { RevenueTrendChart } from "@/components/revenue/revenue-trend-chart";
import { RevenueBreakdownCard } from "@/components/revenue/revenue-breakdown-card";
import { TopProductsTable } from "@/components/revenue/top-products-table";
import { RevenueLeakCard } from "@/components/revenue/revenue-leak-card";
import { TimelineCard } from "@/components/revenue/timeline-card";
import { RevenueSkeleton } from "@/components/revenue/revenue-skeleton";
import { RevenueEmptyState } from "@/components/revenue/revenue-empty-states";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, ChevronRight, Calendar, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/context/order-context";
import { Order } from "@/types/store";

type DateRange = "7d" | "30d" | "90d" | "1y";

const dateRanges = [
  { key: "7d" as DateRange, label: "Last 7 days" },
  { key: "30d" as DateRange, label: "Last 30 days" },
  { key: "90d" as DateRange, label: "Last 90 days" },
  { key: "1y" as DateRange, label: "Last 12 months" },
];

const calcChange = (current: number, previous: number) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

function getRevenueSparkline(orders: Order[], days: number): number[] {
  const result: number[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const revenue = orders
      .filter((o) => o.createdAt.startsWith(dateStr))
      .reduce((sum, o) => sum + o.total, 0);
    result.push(revenue);
  }
  return result;
}

function getDailyRevenueChartData(orders: Order[], days: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateStr = date.toISOString().split("T")[0];
    const revenue = orders
      .filter((o) => o.createdAt.startsWith(dateStr))
      .reduce((sum, o) => sum + o.total, 0);
    result.push({ label, value: revenue });
  }
  return result;
}

function getWeeklyRevenueChartData(orders: Order[], weeks: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    const label = `W${weeks - i}`;
    const revenue = orders
      .filter((o) => {
        const date = new Date(o.createdAt);
        return date >= weekStart && date < weekEnd;
      })
      .reduce((sum, o) => sum + o.total, 0);
    result.push({ label, value: revenue });
  }
  return result;
}

function getMonthlyRevenueChartData(orders: Order[], months: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = monthStart.toLocaleDateString("en-US", { month: "short" });
    const revenue = orders
      .filter((o) => {
        const date = new Date(o.createdAt);
        return date >= monthStart && date < monthEnd;
      })
      .reduce((sum, o) => sum + o.total, 0);
    result.push({ label, value: revenue });
  }
  return result;
}

function getYearlyRevenueChartData(orders: Order[], years: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = years - 1; i >= 0; i--) {
    const yearStart = new Date(now.getFullYear() - i, 0, 1);
    const yearEnd = new Date(now.getFullYear() - i + 1, 0, 1);
    const label = yearStart.getFullYear().toString();
    const revenue = orders
      .filter((o) => {
        const date = new Date(o.createdAt);
        return date >= yearStart && date < yearEnd;
      })
      .reduce((sum, o) => sum + o.total, 0);
    result.push({ label, value: revenue });
  }
  return result;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RevenuePage() {
  const { orders, loading } = useOrders();
  const [timeFilter, setTimeFilter] = useState("Monthly");
  const [dateRange, setDateRange] = useState<DateRange>("30d");

  const now = useMemo(() => new Date(), []);
  const rangeDays = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
  const currentStart = useMemo(() => new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000), [now, rangeDays]);
  const previousStart = useMemo(() => new Date(currentStart.getTime() - rangeDays * 24 * 60 * 60 * 1000), [currentStart, rangeDays]);
  const prevPrevStart = useMemo(() => new Date(previousStart.getTime() - rangeDays * 24 * 60 * 60 * 1000), [previousStart, rangeDays]);

  const currentOrders = useMemo(
    () =>
      orders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= currentStart && date <= now;
      }),
    [orders, currentStart, now]
  );

  const previousOrders = useMemo(
    () =>
      orders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= previousStart && date < currentStart;
      }),
    [orders, previousStart, currentStart]
  );

  const prevPrevOrders = useMemo(
    () =>
      orders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= prevPrevStart && date < previousStart;
      }),
    [orders, prevPrevStart, previousStart]
  );

  const validCurrentOrders = useMemo(
    () => currentOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded"),
    [currentOrders]
  );

  const validPreviousOrders = useMemo(
    () => previousOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded"),
    [previousOrders]
  );

  const validPrevPrevOrders = useMemo(
    () => prevPrevOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded"),
    [prevPrevOrders]
  );

  const totalRevenue = useMemo(
    () => validCurrentOrders.reduce((sum, o) => sum + o.total, 0),
    [validCurrentOrders]
  );

  const previousRevenue = useMemo(
    () => validPreviousOrders.reduce((sum, o) => sum + o.total, 0),
    [validPreviousOrders]
  );

  const prevPrevRevenue = useMemo(
    () => validPrevPrevOrders.reduce((sum, o) => sum + o.total, 0),
    [validPrevPrevOrders]
  );

  const totalOrders = validCurrentOrders.length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueGrowth = calcChange(totalRevenue, previousRevenue);
  const previousGrowth = calcChange(previousRevenue, prevPrevRevenue);
  const growthChange = revenueGrowth - previousGrowth;

  const prevTotalOrders = validPreviousOrders.length;
  const prevAov = prevTotalOrders > 0 ? previousRevenue / prevTotalOrders : 0;
  const aovGrowth = calcChange(avgOrderValue, prevAov);

  const totalAllCurrentRevenue = currentOrders.reduce((sum, o) => sum + o.total, 0);
  const netRevenueGrowth = calcChange(totalRevenue, previousRevenue);

  const chartData = useMemo(() => {
    const granularity = timeFilter.toLowerCase() as "daily" | "weekly" | "monthly" | "yearly";
    if (granularity === "daily") {
      return getDailyRevenueChartData(currentOrders, 14);
    } else if (granularity === "weekly") {
      return getWeeklyRevenueChartData(currentOrders, 8);
    } else if (granularity === "monthly") {
      return dateRange === "1y" ? getMonthlyRevenueChartData(currentOrders, 12) : getMonthlyRevenueChartData(currentOrders, 6);
    } else {
      return getYearlyRevenueChartData(currentOrders, 5);
    }
  }, [currentOrders, timeFilter, dateRange]);

  const productsBreakdown = useMemo(() => {
    const productMap = new Map<string, { revenue: number }>();
    validCurrentOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.product.name;
        const existing = productMap.get(name) || { revenue: 0 };
        productMap.set(name, {
          revenue: existing.revenue + item.product.price * item.quantity,
        });
      });
    });

    const total = Array.from(productMap.values()).reduce((sum, p) => sum + p.revenue, 0);
    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        label: name,
        value: `$${data.revenue.toFixed(0)}`,
        percentage: total > 0 ? Number(((data.revenue / total) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => {
        const aVal = parseFloat(a.value.replace("$", "").replace(",", ""));
        const bVal = parseFloat(b.value.replace("$", "").replace(",", ""));
        return bVal - aVal;
      })
      .slice(0, 4);
  }, [validCurrentOrders]);

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { unitsSold: number; revenue: number }>();
    validCurrentOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.product.name;
        const existing = productMap.get(name) || { unitsSold: 0, revenue: 0 };
        productMap.set(name, {
          unitsSold: existing.unitsSold + item.quantity,
          revenue: existing.revenue + item.product.price * item.quantity,
        });
      });
    });

    const totalUnits = Array.from(productMap.values()).reduce((sum, p) => sum + p.unitsSold, 0);

    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        id: name,
        name,
        unitsSold: data.unitsSold,
        revenue: `$${data.revenue.toFixed(0)}`,
        conversion: totalUnits > 0 ? `${((data.unitsSold / totalUnits) * 100).toFixed(1)}%` : "0%",
        growth: 0,
      }))
      .sort((a, b) => {
        const aVal = parseFloat(a.revenue.replace("$", "").replace(",", ""));
        const bVal = parseFloat(b.revenue.replace("$", "").replace(",", ""));
        return bVal - aVal;
      })
      .slice(0, 5);
  }, [validCurrentOrders]);

  const timelineEvents = useMemo(() => {
    return validCurrentOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        title: `Order #${o.id.slice(0, 8)} placed`,
        description: `${o.customer.name} purchased ${o.items.reduce((sum, item) => sum + item.quantity, 0)} items for $${o.total.toFixed(2)}`,
        timestamp: formatTimeAgo(new Date(o.createdAt)),
        icon: "success" as const,
      }));
  }, [validCurrentOrders]);

  const cycleDateRange = () => {
    const currentIndex = dateRanges.findIndex((r) => r.key === dateRange);
    const nextIndex = (currentIndex + 1) % dateRanges.length;
    setDateRange(dateRanges[nextIndex].key);
  };

  const currentDateLabel = dateRanges.find((r) => r.key === dateRange)?.label || "Last 30 days";

  const kpiData = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `$${totalAllCurrentRevenue.toFixed(2)}`,
        change: revenueGrowth,
        previousValue: `$${previousRevenue.toFixed(2)}`,
        icon: <DollarSign className="h-5 w-5" />,
        sparkline: getRevenueSparkline(currentOrders, 7),
      },
      {
        title: "Net Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        change: netRevenueGrowth,
        previousValue: `$${previousRevenue.toFixed(2)}`,
        icon: <TrendingUp className="h-5 w-5" />,
        sparkline: getRevenueSparkline(validPreviousOrders, 7),
      },
      {
        title: "Average Order Value",
        value: `$${avgOrderValue.toFixed(2)}`,
        change: aovGrowth,
        previousValue: `$${prevAov.toFixed(2)}`,
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        title: "Revenue Growth",
        value: `${revenueGrowth.toFixed(1)}%`,
        change: growthChange,
        previousValue: previousGrowth > 0 ? `${previousGrowth.toFixed(1)}%` : undefined,
        icon: <BarChart3 className="h-5 w-5" />,
      },
    ],
    [
      totalAllCurrentRevenue,
      previousRevenue,
      revenueGrowth,
      totalRevenue,
      netRevenueGrowth,
      avgOrderValue,
      aovGrowth,
      prevAov,
      growthChange,
      previousGrowth,
      currentOrders,
      validPreviousOrders,
    ]
  );

  if (loading) {
    return <RevenueSkeleton />;
  }

  const hasValidOrders = validCurrentOrders.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Overview</h1>
          <p className="text-muted-foreground mt-1">
            Monitor revenue performance, identify growth opportunities, and recover lost sales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={cycleDateRange}>
            <Calendar className="h-4 w-4" />
            {currentDateLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <RevenueCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="rounded-[18px] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground">Track your revenue over time</p>
          </div>
          <FilterTabs items={["Daily", "Weekly", "Monthly", "Yearly"]} active={timeFilter} onChange={setTimeFilter} />
        </div>
        <RevenueTrendChart data={chartData} />
      </div>

      {hasValidOrders && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <RevenueBreakdownCard title="Products" items={productsBreakdown} />
        </div>
      )}

      {hasValidOrders && <TopProductsTable products={topProducts} />}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueLeakCard leaks={[]} />
        </div>
        <div>
          <RevenueEmptyState type="no-forecast" />
        </div>
      </div>

      {hasValidOrders ? (
        <TimelineCard events={timelineEvents} />
      ) : (
        <RevenueEmptyState type="no-data" />
      )}

      <RevenueEmptyState type="no-insights" />
    </div>
  );
}
