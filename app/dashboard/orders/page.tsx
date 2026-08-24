"use client";

import { useState, useMemo } from "react";
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
          <OrderAlertCard alerts={alerts} />
        </div>
        <div>
          <AIOrderInsightCard
            title="Mobile payment failures increased"
            description="AI detected an increase in failed mobile payments. This could be due to payment gateway issues or poor mobile checkout experience."
            estimatedImpact="$1,240/month"
            actions={[
              "Review payment gateway configuration",
              "Retry failed payments automatically",
              "Notify affected customers",
            ]}
            impact="+$1,240/mo potential recovery"
          />
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

      <OrderTimelineCard events={timelineEvents} />

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

const alerts = [
  { id: "1", priority: "high" as const, title: "High-value order pending", description: "Order #ORD-002 worth $89.00 is pending payment for 2 hours.", estimatedImpact: "Potential $89.00 loss", icon: "high-value" as const },
  { id: "2", priority: "high" as const, title: "Payment failed", description: "Payment failed for order #ORD-004. Customer may need to retry.", estimatedImpact: "$156.00 at risk", icon: "payment" as const },
  { id: "3", priority: "medium" as const, title: "Shipping delayed", description: "Order #ORD-003 shipping delayed due to carrier issues.", estimatedImpact: "Customer satisfaction impact", icon: "shipping" as const },
  { id: "4", priority: "medium" as const, title: "Refund requested", description: "Customer requested refund for order #ORD-006.", estimatedImpact: "$65.00 refund", icon: "refund" as const },
  { id: "5", priority: "low" as const, title: "Inventory unavailable", description: "2 items in order #ORD-007 are out of stock.", estimatedImpact: "Delayed fulfillment", icon: "inventory" as const },
  { id: "6", priority: "low" as const, title: "Customer waiting", description: "Customer has been waiting for status update for 24 hours.", estimatedImpact: "Satisfaction risk", icon: "customer" as const },
];

const timelineEvents = [
  { id: "1", title: "New order received", description: "Order #ORD-008 placed by Emma Davis.", timestamp: "10 minutes ago", icon: "order" as const },
  { id: "2", title: "Order shipped", description: "Order #ORD-003 has been shipped via Express.", timestamp: "1 hour ago", icon: "shipped" as const },
  { id: "3", title: "Refund processed", description: "Refund of $65.00 processed for order #ORD-006.", timestamp: "3 hours ago", icon: "refund" as const },
  { id: "4", title: "Payment failed", description: "Payment failed for order #ORD-004.", timestamp: "5 hours ago", icon: "order" as const },
  { id: "5", title: "Customer cancelled order", description: "Order #ORD-009 was cancelled by customer.", timestamp: "1 day ago", icon: "cancelled" as const },
];

const customerInsights = [
  { title: "Returning Customers", value: "42%", change: 5.2 },
  { title: "First-time Buyers", value: "58%", change: 12.1 },
  { title: "Avg Order Value", value: "$85.40", change: 3.8 },
  { title: "Repeat Purchase Rate", value: "28%", change: -1.5 },
];
