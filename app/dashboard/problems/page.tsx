"use client";

import { useState, useMemo } from "react";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { FilterTabs } from "@/components/revenue/filter-tabs";
import { useOrders } from "@/context/order-context";
import { ProblemItem } from "@/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Calendar, ChevronRight } from "lucide-react";

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

export default function ProblemsPage() {
  const { orders, loading } = useOrders();
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [timeFilter, setTimeFilter] = useState("Monthly");

  const now = useMemo(() => new Date(), []);
  const rangeDays = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : dateRange === "90d" ? 90 : 365;
  const currentStart = useMemo(() => new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000), [now, rangeDays]);
  const previousStart = useMemo(() => new Date(currentStart.getTime() - rangeDays * 24 * 60 * 60 * 1000), [currentStart, rangeDays]);

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

  const validCurrentOrders = useMemo(
    () => currentOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded"),
    [currentOrders]
  );

  const validPreviousOrders = useMemo(
    () => previousOrders.filter((o) => o.status !== "cancelled" && o.status !== "refunded"),
    [previousOrders]
  );

  const totalRevenue = validCurrentOrders.reduce((sum, o) => sum + o.total, 0);
  const previousRevenue = validPreviousOrders.reduce((sum, o) => sum + o.total, 0);
  const revenueGrowth = calcChange(totalRevenue, previousRevenue);

  const pendingOrders = currentOrders.filter((o) => o.status === "pending");
  const cancelledOrders = currentOrders.filter((o) => o.status === "cancelled");
  const refundedOrders = currentOrders.filter((o) => o.status === "refunded");

  const problems = useMemo(() => {
    const result: ProblemItem[] = [];

    if (pendingOrders.length > 0) {
      const pendingRevenue = pendingOrders.reduce((sum, o) => sum + o.total, 0);
      result.push({
        id: "pending-orders",
        severity: "medium",
        title: "Pending orders need attention",
        description: `${pendingOrders.length} orders are pending payment and may need follow-up.`,
        estimatedImpact: `$${pendingRevenue.toFixed(2)} potential revenue delay`,
      });
    }

    if (cancelledOrders.length > 0) {
      const cancelledLoss = cancelledOrders.reduce((sum, o) => sum + o.total, 0);
      result.push({
        id: "cancelled-orders",
        severity: "high",
        title: "Cancelled orders detected",
        description: `${cancelledOrders.length} orders were cancelled in this period.`,
        estimatedImpact: `$${cancelledLoss.toFixed(2)} lost revenue`,
      });
    }

    if (refundedOrders.length > 0) {
      const refundedLoss = refundedOrders.reduce((sum, o) => sum + o.total, 0);
      result.push({
        id: "refunded-orders",
        severity: "high",
        title: "Refunded orders detected",
        description: `${refundedOrders.length} orders were refunded in this period.`,
        estimatedImpact: `$${refundedLoss.toFixed(2)} refunded`,
      });
    }

    if (totalRevenue > 0 && previousRevenue > 0 && revenueGrowth < -20) {
      result.push({
        id: "revenue-decline",
        severity: "high",
        title: "Revenue decline detected",
        description: `Revenue decreased by ${Math.abs(revenueGrowth).toFixed(1)}% compared to the previous period.`,
        estimatedImpact: `$${(previousRevenue - totalRevenue).toFixed(2)} below previous period`,
      });
    }

    const productRevenue = new Map<string, { revenue: number; orders: number }>();
    validCurrentOrders.forEach((o) => {
      o.items.forEach((item) => {
        const existing = productRevenue.get(item.product.name) || { revenue: 0, orders: 0 };
        productRevenue.set(item.product.name, {
          revenue: existing.revenue + item.product.price * item.quantity,
          orders: existing.orders + item.quantity,
        });
      });
    });

    const lowPerformers = Array.from(productRevenue.entries())
      .filter(([, data]) => data.revenue < 20)
      .sort((a, b) => a[1].revenue - b[1].revenue)
      .slice(0, 3);

    if (lowPerformers.length > 0 && productRevenue.size > 1) {
      const lowRevenue = lowPerformers.reduce((sum, [, data]) => sum + data.revenue, 0);
      result.push({
        id: "low-performing-products",
        severity: "low",
        title: "Low-performing products",
        description: `${lowPerformers.map(([name]) => name).join(", ")} generated less than $20 each.`,
        estimatedImpact: `$${lowRevenue.toFixed(2)} total low-performing revenue`,
      });
    }

    if (currentOrders.length > 0) {
      const statusCounts = {
        pending: pendingOrders.length,
        processing: currentOrders.filter((o) => o.status === "processing").length,
        shipped: currentOrders.filter((o) => o.status === "shipped").length,
        delivered: currentOrders.filter((o) => o.status === "delivered").length,
        cancelled: cancelledOrders.length,
        refunded: refundedOrders.length,
      };

      const nonTerminal = statusCounts.pending + statusCounts.processing + statusCounts.shipped;
      const total = currentOrders.length;
      if (total > 0 && nonTerminal / total > 0.5) {
        result.push({
          id: "fulfillment-bottleneck",
          severity: "medium",
          title: "Fulfillment bottleneck",
          description: `${nonTerminal} of ${total} orders are still in pending/processing/shipped status.`,
          estimatedImpact: `${((nonTerminal / total) * 100).toFixed(0)}% of orders not yet delivered`,
        });
      }
    }

    return result;
  }, [currentOrders, validCurrentOrders, totalRevenue, previousRevenue, revenueGrowth, pendingOrders, cancelledOrders, refundedOrders]);

  const cycleDateRange = () => {
    const currentIndex = dateRanges.findIndex((r) => r.key === dateRange);
    const nextIndex = (currentIndex + 1) % dateRanges.length;
    setDateRange(dateRanges[nextIndex].key);
  };

  const currentDateLabel = dateRanges.find((r) => r.key === dateRange)?.label || "Last 30 days";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading problems...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Revenue Problems</h1>
          <p className="text-muted-foreground mt-1">
            Investigate and resolve revenue problems from your real store data.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={cycleDateRange}>
            <Calendar className="h-4 w-4" />
            {currentDateLabel}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <FilterTabs items={["Daily", "Weekly", "Monthly"]} active={timeFilter} onChange={setTimeFilter} />
        </div>
      </div>

      {problems.length === 0 ? (
        <div className="bg-card border border-border rounded-[18px] shadow-sm p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success mx-auto mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No revenue problems detected</h3>
          <p className="text-muted-foreground mt-1 max-w-sm mx-auto">
            Your store is performing well. No critical issues were found in the selected period.
          </p>
        </div>
      ) : (
        <RevenueProblems problems={problems} aiInsight={null} />
      )}
    </div>
  );
}
