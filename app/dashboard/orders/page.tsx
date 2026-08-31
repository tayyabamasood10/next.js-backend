"use client";

import { useState, useMemo, useEffect } from "react";
import { OrderStatCard } from "@/components/orders/order-stat-card";
import { OrderStatusCard } from "@/components/orders/order-status-card";
import { OrderAnalyticsChart } from "@/components/orders/order-analytics-chart";
import { OrderTable } from "@/components/orders/order-table";
import { OrderAlertCard } from "@/components/orders/order-alert-card";
import { AIOrderInsightCard } from "@/components/orders/ai-order-insight-card";
import { OrderTimelineCard } from "@/components/orders/order-timeline-card";
import { OrderDetailsDrawer } from "@/components/orders/order-details-drawer";
import { OrderSkeleton } from "@/components/orders/order-skeleton";
import { FilterTabs } from "@/components/orders/filter-tabs";
import { useOrders } from "@/context/order-context";
import { callAI, AIInsightResponse } from "@/lib/ai";
import {
  ShoppingCart,
  CheckCircle2,
  Clock,
  XCircle,
  BarChart3,
  ChevronRight,
  Calendar,
  Download,
  RefreshCw,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Order as StoreOrder } from "@/types/store";

type DateRange = "7d" | "30d" | "90d";

interface TableOrder {
  id: string;
  customer: string;
  productCount: number;
  total: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillmentStatus: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

interface OrderAlert {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: string;
  icon: "payment" | "shipping" | "refund" | "inventory" | "customer" | "high-value";
}

const dateRanges = [
  { key: "7d" as DateRange, label: "Last 7 days" },
  { key: "30d" as DateRange, label: "Last 30 days" },
  { key: "90d" as DateRange, label: "Last 90 days" },
];

export default function OrdersPage() {
  const { orders, loading } = useOrders();
  const [timeFilter, setTimeFilter] = useState("Weekly");
  const [dateRange, setDateRange] = useState<DateRange>("30d");
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string;
    customer: string;
    email: string;
    phone: string;
    address: string;
    products: { name: string; quantity: number; price: string }[];
    payment: string;
    status: string;
    notes: string;
    timeline: { title: string; timestamp: string }[];
  } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [aiInsight, setAiInsight] = useState<AIInsightResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const now = useMemo(() => new Date(), []);
  const rangeDays = dateRange === "7d" ? 7 : dateRange === "30d" ? 30 : 90;
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

  const totalOrders = currentOrders.length;
  const pendingOrders = currentOrders.filter((o) => o.status === "pending").length;
  const cancelledOrders = currentOrders.filter((o) => o.status === "cancelled").length;
  const completedOrders = totalOrders - pendingOrders - cancelledOrders;

  const prevTotal = previousOrders.length;
  const prevPending = previousOrders.filter((o) => o.status === "pending").length;
  const prevCancelled = previousOrders.filter((o) => o.status === "cancelled").length;
  const prevCompleted = prevTotal - prevPending - prevCancelled;

  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const kpiData = useMemo(
    () => [
      {
        title: "Total Orders",
        value: totalOrders.toLocaleString(),
        change: calcChange(totalOrders, prevTotal),
        previousValue: prevTotal.toLocaleString(),
        icon: <ShoppingCart className="h-5 w-5" />,
        sparkline: getSparkline(currentOrders, 7),
      },
      {
        title: "Completed Orders",
        value: completedOrders.toLocaleString(),
        change: calcChange(completedOrders, prevCompleted),
        previousValue: prevCompleted.toLocaleString(),
        icon: <CheckCircle2 className="h-5 w-5" />,
        sparkline: getSparkline(currentOrders.filter((o) => o.status !== "pending" && o.status !== "cancelled"), 7),
      },
      {
        title: "Pending Orders",
        value: pendingOrders.toLocaleString(),
        change: calcChange(pendingOrders, prevPending),
        previousValue: prevPending.toLocaleString(),
        icon: <Clock className="h-5 w-5" />,
        sparkline: getSparkline(currentOrders.filter((o) => o.status === "pending"), 7),
      },
      {
        title: "Cancelled Orders",
        value: cancelledOrders.toLocaleString(),
        change: calcChange(cancelledOrders, prevCancelled),
        previousValue: prevCancelled.toLocaleString(),
        icon: <XCircle className="h-5 w-5" />,
        sparkline: getSparkline(currentOrders.filter((o) => o.status === "cancelled"), 7),
      },
    ],
    [totalOrders, completedOrders, pendingOrders, cancelledOrders, prevTotal, prevCompleted, prevPending, prevCancelled, currentOrders]
  );

  const statusCounts = useMemo(
    () => ({
      pending: currentOrders.filter((o) => o.status === "pending").length,
      processing: currentOrders.filter((o) => o.status === "processing").length,
      shipped: currentOrders.filter((o) => o.status === "shipped").length,
      delivered: currentOrders.filter((o) => o.status === "delivered").length,
      cancelled: currentOrders.filter((o) => o.status === "cancelled").length,
      refunded: currentOrders.filter((o) => o.status === "refunded").length,
    }),
    [currentOrders]
  );

  const statusTotal = currentOrders.length || 1;

  const statusData = useMemo(
    () => [
      { title: "Pending", count: statusCounts.pending, percentage: Number(((statusCounts.pending / statusTotal) * 100).toFixed(1)), color: "#FFB800", icon: <Clock className="h-4 w-4" /> },
      { title: "Processing", count: statusCounts.processing, percentage: Number(((statusCounts.processing / statusTotal) * 100).toFixed(1)), color: "#4F8CFF", icon: <BarChart3 className="h-4 w-4" /> },
      { title: "Shipped", count: statusCounts.shipped, percentage: Number(((statusCounts.shipped / statusTotal) * 100).toFixed(1)), color: "#7C5CFC", icon: <ShoppingCart className="h-4 w-4" /> },
      { title: "Delivered", count: statusCounts.delivered, percentage: Number(((statusCounts.delivered / statusTotal) * 100).toFixed(1)), color: "#00C48C", icon: <CheckCircle2 className="h-4 w-4" /> },
      { title: "Cancelled", count: statusCounts.cancelled, percentage: Number(((statusCounts.cancelled / statusTotal) * 100).toFixed(1)), color: "#FF5C5C", icon: <XCircle className="h-4 w-4" /> },
      { title: "Refunded", count: statusCounts.refunded, percentage: Number(((statusCounts.refunded / statusTotal) * 100).toFixed(1)), color: "#74B9FF", icon: <RefreshCw className="h-4 w-4" /> },
    ],
    [statusCounts, statusTotal]
  );

  const chartData = useMemo(() => {
    const granularity = timeFilter.toLowerCase() as "daily" | "weekly" | "monthly";
    if (granularity === "daily") {
      return getDailyChartData(currentOrders, 14);
    } else if (granularity === "weekly") {
      return getWeeklyChartData(currentOrders, 8);
    } else {
      return getMonthlyChartData(currentOrders, 6);
    }
  }, [currentOrders, timeFilter]);

  const mappedOrders: TableOrder[] = currentOrders.map((o) => ({
    id: o.id,
    customer: o.customer.name,
    productCount: o.items.reduce((sum, item) => sum + item.quantity, 0),
    total: `$${o.total.toFixed(2)}`,
    paymentStatus: "pending",
    fulfillmentStatus:
      o.status === "delivered"
        ? "delivered"
        : o.status === "shipped"
        ? "shipped"
        : o.status === "processing"
        ? "processing"
        : o.status === "cancelled"
        ? "cancelled"
        : "processing",
    date: new Date(o.createdAt).toISOString().split("T")[0],
  }));

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleViewOrder = (order: TableOrder) => {
    const contextOrder = orders.find((o) => o.id === order.id);
    const items = contextOrder?.items || [];
    const timeline = contextOrder
      ? [
          { title: "Order placed", timestamp: new Date(contextOrder.createdAt).toLocaleString() },
          { title: "Status updated", timestamp: contextOrder.status },
        ]
      : [];

    setSelectedOrder({
      id: order.id,
      customer: order.customer,
      email: contextOrder?.customer.email || "",
      phone: contextOrder?.customer.phone || "",
      address: contextOrder?.customer.address || "",
      products: items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: `$${item.product.price.toFixed(2)}`,
      })),
      payment: "Pending",
      status: order.fulfillmentStatus,
      notes: "No special instructions.",
      timeline,
    });
    setDrawerOpen(true);
  };

  const cycleDateRange = () => {
    const currentIndex = dateRanges.findIndex((r) => r.key === dateRange);
    const nextIndex = (currentIndex + 1) % dateRanges.length;
    setDateRange(dateRanges[nextIndex].key);
  };

  const currentDateLabel = dateRanges.find((r) => r.key === dateRange)?.label || "Last 30 days";

  useEffect(() => {
    if (loading || totalOrders === 0) {
      const timer = setTimeout(() => setAiInsight(null), 0);
      return () => clearTimeout(timer);
    }

    const fetchAI = async () => {
      setAiLoading(true);
      try {
        const processingOrders = currentOrders.filter((o) => o.status === "processing").length;
        const shippedOrders = currentOrders.filter((o) => o.status === "shipped").length;
        const deliveredOrders = currentOrders.filter((o) => o.status === "delivered").length;
        const refundedOrders = currentOrders.filter((o) => o.status === "refunded").length;

        const data = await callAI("orders", {
          revenue: currentOrders.reduce((sum, o) => sum + o.total, 0),
          orders: totalOrders,
          customers: new Set(currentOrders.map((o) => o.customer.email.toLowerCase())).size,
          avgOrderValue: totalOrders > 0 ? currentOrders.reduce((sum, o) => sum + o.total, 0) / totalOrders : 0,
          pendingOrders,
          cancelledOrders,
          refundedOrders,
          revenueGrowth: calcChange(currentOrders.reduce((sum, o) => sum + o.total, 0), previousOrders.reduce((sum, o) => sum + o.total, 0)),
          ordersGrowth: calcChange(totalOrders, prevTotal),
          aovGrowth: 0,
          topProducts: [],
          completedOrders,
          processingOrders,
          shippedOrders,
          deliveredOrders,
          statusBreakdown: statusCounts,
        });
        setAiInsight(data);
      } catch {
        // keep existing fallback UI if AI fails
      } finally {
        setAiLoading(false);
      }
    };

    fetchAI();
  }, [loading, totalOrders, currentOrders, previousOrders, pendingOrders, cancelledOrders, completedOrders, statusCounts, prevTotal]);

  const realAlerts = useMemo(() => {
    const alerts: OrderAlert[] = [];
    
    const pendingHighValue = currentOrders
      .filter((o) => o.status === "pending" && o.total > 50)
      .sort((a, b) => b.total - a.total)
      .slice(0, 2);
    
    pendingHighValue.forEach((o) => {
      alerts.push({
        id: o.id,
        priority: "high" as const,
        title: `High-value order pending`,
        description: `Order #${o.id.slice(0, 8)} worth $${o.total.toFixed(2)} is pending payment.`,
        estimatedImpact: `Potential $${o.total.toFixed(2)} loss`,
        icon: "high-value" as const,
      });
    });

    const cancelled = currentOrders.filter((o) => o.status === "cancelled" || o.status === "refunded");
    if (cancelled.length > 0) {
      const loss = cancelled.reduce((sum, o) => sum + o.total, 0);
      alerts.push({
        id: "cancelled",
        priority: "high" as const,
        title: "Cancelled/Refunded orders detected",
        description: `${cancelled.length} orders were cancelled or refunded.`,
        estimatedImpact: `$${loss.toFixed(2)} at risk`,
        icon: "refund" as const,
      });
    }

    const stuckProcessing = currentOrders.filter((o) => {
      const date = new Date(o.createdAt);
      const daysSince = (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000);
      return o.status === "processing" && daysSince > 3;
    });

    if (stuckProcessing.length > 0) {
      alerts.push({
        id: "stuck",
        priority: "medium" as const,
        title: "Orders stuck in processing",
        description: `${stuckProcessing.length} orders have been processing for over 3 days.`,
        estimatedImpact: "Customer satisfaction risk",
        icon: "shipping" as const,
      });
    }

    if (alerts.length === 0 && totalOrders > 0) {
      alerts.push({
        id: "healthy",
        priority: "low" as const,
        title: "All orders on track",
        description: "No urgent order issues detected.",
        estimatedImpact: "$0",
        icon: "payment" as const,
      });
    }

    return alerts;
  }, [currentOrders, totalOrders, now]);

  const realTimelineEvents = useMemo(() => {
    return currentOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        title: `Order #${o.id.slice(0, 8)} placed`,
        description: `${o.customer.name} purchased ${o.items.reduce((sum, item) => sum + item.quantity, 0)} items for $${o.total.toFixed(2)}`,
        timestamp: getTimeAgo(new Date(o.createdAt)),
        icon: "order" as const,
      }));
  }, [currentOrders]);

  const customerInsights = useMemo(() => {
    if (totalOrders === 0) {
      return [
        { title: "Returning Customers", value: "0%", change: 0 },
        { title: "First-time Buyers", value: "100%", change: 0 },
        { title: "Avg Order Value", value: "$0.00", change: 0 },
        { title: "Repeat Purchase Rate", value: "0%", change: 0 },
      ];
    }

    const customerOrderCounts = new Map<string, number>();
    currentOrders.forEach((o) => {
      const email = o.customer.email.toLowerCase();
      customerOrderCounts.set(email, (customerOrderCounts.get(email) || 0) + 1);
    });

    const returning = Array.from(customerOrderCounts.values()).filter((count) => count > 1).length;
    const totalCustomers = customerOrderCounts.size;
    const returningPercent = totalCustomers > 0 ? (returning / totalCustomers) * 100 : 0;
    const avgVal = currentOrders.reduce((sum, o) => sum + o.total, 0) / totalOrders;

    return [
      { title: "Returning Customers", value: `${returningPercent.toFixed(0)}%`, change: 0 },
      { title: "First-time Buyers", value: `${(100 - returningPercent).toFixed(0)}%`, change: 0 },
      { title: "Avg Order Value", value: `$${avgVal.toFixed(2)}`, change: 0 },
      { title: "Repeat Purchase Rate", value: `${totalCustomers > 0 ? (returning / totalCustomers * 100).toFixed(0) : 0}%`, change: 0 },
    ];
  }, [currentOrders, totalOrders]);

  if (loading || refreshing) {
    return <OrderSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground mt-1">
            Monitor customer orders, fulfillment progress, and identify issues before they affect revenue.
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
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <OrderStatCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {statusData.map((status) => (
          <OrderStatusCard key={status.title} {...status} />
        ))}
      </div>

      <div className="rounded-[18px] border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold">Order Analytics</h2>
            <p className="text-sm text-muted-foreground">Track order volume over time</p>
          </div>
          <FilterTabs items={["Daily", "Weekly", "Monthly"]} active={timeFilter} onChange={setTimeFilter} />
        </div>
        <OrderAnalyticsChart data={chartData} />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      {mappedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No orders yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            When customers place orders from your store, they will appear here.
          </p>
        </div>
      ) : (
        <OrderTable orders={mappedOrders} onViewOrder={handleViewOrder} />
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <OrderAlertCard alerts={realAlerts} />
        </div>
        <div>
          {aiLoading ? (
            <div className="relative overflow-hidden rounded-[18px] border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
                <div>
                  <h3 className="text-base font-semibold">Analyzing orders...</h3>
                  <p className="text-xs text-muted-foreground">Generating AI insights</p>
                </div>
              </div>
            </div>
          ) : aiInsight ? (
            <AIOrderInsightCard
              title={aiInsight.insight}
              description={aiInsight.recommendation}
              estimatedImpact={aiInsight.impact || "Review required"}
              actions={aiInsight.opportunity ? [aiInsight.opportunity] : ["Review order status and fulfillment process"]}
              impact={aiInsight.problem ? `Problem: ${aiInsight.problem}` : undefined}
            />
          ) : (
            <AIOrderInsightCard
              title="Order performance overview"
              description="Start processing orders to receive AI-powered insights about your fulfillment performance."
              estimatedImpact="$0"
              actions={["Process pending orders", "Review fulfillment workflow"]}
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {customerInsights.map((insight) => (
          <OrderStatCard
            key={insight.title}
            title={insight.title}
            value={insight.value}
            change={insight.change}
            icon={<BarChart3 className="h-5 w-5" />}
          />
        ))}
      </div>

      <OrderTimelineCard events={realTimelineEvents} />

      <OrderDetailsDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        order={selectedOrder || {
          id: "",
          customer: "",
          email: "",
          phone: "",
          address: "",
          products: [],
          payment: "",
          status: "",
          notes: "",
          timeline: [],
        }}
      />
    </div>
  );
}

function getSparkline(orders: StoreOrder[], days: number): number[] {
  const result: number[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    result.push(orders.filter((o) => o.createdAt.startsWith(dateStr)).length);
  }
  return result;
}

function getDailyChartData(orders: StoreOrder[], days: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateStr = date.toISOString().split("T")[0];
    result.push({
      label,
      value: orders.filter((o) => o.createdAt.startsWith(dateStr)).length,
    });
  }
  return result;
}

function getWeeklyChartData(orders: StoreOrder[], weeks: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const weekEnd = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
    const weekStart = new Date(weekEnd.getTime() - 7 * 24 * 60 * 60 * 1000);
    const label = `W${weeks - i}`;
    result.push({
      label,
      value: orders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= weekStart && date < weekEnd;
      }).length,
    });
  }
  return result;
}

function getMonthlyChartData(orders: StoreOrder[], months: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = monthStart.toLocaleDateString("en-US", { month: "short" });
    result.push({
      label,
      value: orders.filter((o) => {
        const date = new Date(o.createdAt);
        return date >= monthStart && date < monthEnd;
      }).length,
    });
  }
  return result;
}

function getTimeAgo(date: Date): string {
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
