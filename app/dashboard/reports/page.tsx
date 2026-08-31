"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  ShoppingCart,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Truck,
  Calendar,
  Download,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

function getChartData(orders: Order[], days: number): { label: string; value: number }[] {
  const result: { label: string; value: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const dateStr = date.toISOString().split("T")[0];
    const revenue = orders
      .filter((o) => o.createdAt.startsWith(dateStr) && o.status !== "cancelled" && o.status !== "refunded")
      .reduce((sum, o) => sum + o.total, 0);
    result.push({ label, value: revenue });
  }
  return result;
}

export default function ReportsPage() {
  const { orders, loading } = useOrders();
  const [dateRange, setDateRange] = useState<DateRange>("30d");

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

  const totalOrders = currentOrders.length;
  const pendingOrders = currentOrders.filter((o) => o.status === "pending").length;
  const processingOrders = currentOrders.filter((o) => o.status === "processing").length;
  const shippedOrders = currentOrders.filter((o) => o.status === "shipped").length;
  const deliveredOrders = currentOrders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = currentOrders.filter((o) => o.status === "cancelled").length;
  const refundedOrders = currentOrders.filter((o) => o.status === "refunded").length;

  const prevTotal = previousOrders.length;
  const prevPending = previousOrders.filter((o) => o.status === "pending").length;
  const prevProcessing = previousOrders.filter((o) => o.status === "processing").length;
  const prevShipped = previousOrders.filter((o) => o.status === "shipped").length;
  const prevDelivered = previousOrders.filter((o) => o.status === "delivered").length;
  const prevCancelled = previousOrders.filter((o) => o.status === "cancelled").length;
  const prevRefunded = previousOrders.filter((o) => o.status === "refunded").length;

  const totalRevenue = validCurrentOrders.reduce((sum, o) => sum + o.total, 0);
  const previousRevenue = validPreviousOrders.reduce((sum, o) => sum + o.total, 0);

  const customerEmails = useMemo(
    () => new Set(validCurrentOrders.map((o) => o.customer.email.toLowerCase())),
    [validCurrentOrders]
  );
  const totalCustomers = customerEmails.size;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const prevAov = prevTotal > 0 ? previousRevenue / prevTotal : 0;

  const cycleDateRange = () => {
    const currentIndex = dateRanges.findIndex((r) => r.key === dateRange);
    const nextIndex = (currentIndex + 1) % dateRanges.length;
    setDateRange(dateRanges[nextIndex].key);
  };

  const currentDateLabel = dateRanges.find((r) => r.key === dateRange)?.label || "Last 30 days";

  const chartData = useMemo(() => getChartData(currentOrders, Math.min(rangeDays, 14)), [currentOrders, rangeDays]);

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

    return Array.from(productMap.entries())
      .map(([name, data]) => ({
        name,
        unitsSold: data.unitsSold,
        revenue: data.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [validCurrentOrders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading reports...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download detailed reports for your store.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={cycleDateRange}>
            <Calendar className="h-4 w-4" />
            {currentDateLabel}
          </Button>
          <Button variant="default">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
        </div>
      </div>

      {totalOrders === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg">No reports yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-center">
            Reports will be generated once you have orders in your store. Create your first order to get started.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-2xl font-bold">{totalOrders}</p>
                </div>
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {calcChange(totalOrders, prevTotal) >= 0 ? "+" : ""}{calcChange(totalOrders, prevTotal)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {calcChange(totalRevenue, previousRevenue) >= 0 ? "+" : ""}{calcChange(totalRevenue, previousRevenue)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Customers</p>
                  <p className="text-2xl font-bold">{totalCustomers}</p>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Unique customers
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Order Value</p>
                  <p className="text-2xl font-bold">${avgOrderValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {calcChange(avgOrderValue, prevAov) >= 0 ? "+" : ""}{calcChange(avgOrderValue, prevAov)}% from previous period
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-warning" />
                <h3 className="font-semibold">Pending Orders</h3>
              </div>
              <p className="text-3xl font-bold">{pendingOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(pendingOrders, prevPending) >= 0 ? "+" : ""}{calcChange(pendingOrders, prevPending)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-info" />
                <h3 className="font-semibold">Processing Orders</h3>
              </div>
              <p className="text-3xl font-bold">{processingOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(processingOrders, prevProcessing) >= 0 ? "+" : ""}{calcChange(processingOrders, prevProcessing)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Shipped Orders</h3>
              </div>
              <p className="text-3xl font-bold">{shippedOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(shippedOrders, prevShipped) >= 0 ? "+" : ""}{calcChange(shippedOrders, prevShipped)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <h3 className="font-semibold">Delivered Orders</h3>
              </div>
              <p className="text-3xl font-bold">{deliveredOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(deliveredOrders, prevDelivered) >= 0 ? "+" : ""}{calcChange(deliveredOrders, prevDelivered)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="h-5 w-5 text-danger" />
                <h3 className="font-semibold">Cancelled Orders</h3>
              </div>
              <p className="text-3xl font-bold">{cancelledOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(cancelledOrders, prevCancelled) >= 0 ? "+" : ""}{calcChange(cancelledOrders, prevCancelled)}% from previous period
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="h-5 w-5 text-info" />
                <h3 className="font-semibold">Refunded Orders</h3>
              </div>
              <p className="text-3xl font-bold">{refundedOrders}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {calcChange(refundedOrders, prevRefunded) >= 0 ? "+" : ""}{calcChange(refundedOrders, prevRefunded)}% from previous period
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Revenue Trend</h3>
            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium">${item.value.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Top Products</h3>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.unitsSold} units sold</p>
                  </div>
                  <span className="text-sm font-medium">${product.revenue.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
