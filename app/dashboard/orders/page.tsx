"use client";

import { useState } from "react";
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

interface Order {
  id: string;
  customer: string;
  productCount: number;
  total: string;
  paymentStatus: "paid" | "pending" | "failed" | "refunded";
  fulfillmentStatus: "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

const kpiData = [
  {
    title: "Total Orders",
    value: "1,234",
    change: 12.5,
    previousValue: "1,098",
    icon: <ShoppingCart className="h-5 w-5" />,
    sparkline: [20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 58, 70] as number[],
  },
  {
    title: "Completed Orders",
    value: "856",
    change: 8.3,
    previousValue: "791",
    icon: <CheckCircle2 className="h-5 w-5" />,
    sparkline: [30, 35, 32, 40, 38, 45, 42, 50, 48, 55, 52, 60] as number[],
  },
  {
    title: "Pending Orders",
    value: "245",
    change: -5.2,
    previousValue: "258",
    icon: <Clock className="h-5 w-5" />,
    sparkline: [50, 45, 48, 42, 40, 38, 35, 32, 30, 28, 26, 24] as number[],
  },
  {
    title: "Cancelled Orders",
    value: "133",
    change: -2.1,
    previousValue: "136",
    icon: <XCircle className="h-5 w-5" />,
    sparkline: [20, 18, 22, 19, 17, 15, 18, 14, 12, 16, 13, 10] as number[],
  },
];

const statusData = [
  { title: "Pending", count: 245, percentage: 20, color: "#FFB800", icon: <Clock className="h-4 w-4" /> },
  { title: "Processing", count: 189, percentage: 15, color: "#4F8CFF", icon: <BarChart3 className="h-4 w-4" /> },
  { title: "Shipped", count: 312, percentage: 25, color: "#7C5CFC", icon: <ShoppingCart className="h-4 w-4" /> },
  { title: "Delivered", count: 356, percentage: 29, color: "#00C48C", icon: <CheckCircle2 className="h-4 w-4" /> },
  { title: "Cancelled", count: 98, percentage: 8, color: "#FF5C5C", icon: <XCircle className="h-4 w-4" /> },
  { title: "Refunded", count: 34, percentage: 3, color: "#74B9FF", icon: <RefreshCw className="h-4 w-4" /> },
];

const chartData = {
  daily: [
    { label: "Mon", value: 45 }, { label: "Tue", value: 52 }, { label: "Wed", value: 38 },
    { label: "Thu", value: 65 }, { label: "Fri", value: 78 }, { label: "Sat", value: 92 }, { label: "Sun", value: 84 },
  ],
  weekly: [
    { label: "W1", value: 320 }, { label: "W2", value: 280 }, { label: "W3", value: 350 },
    { label: "W4", value: 410 }, { label: "W5", value: 380 }, { label: "W6", value: 420 }, { label: "W7", value: 450 },
  ],
  monthly: [
    { label: "Jan", value: 1200 }, { label: "Feb", value: 1350 }, { label: "Mar", value: 1100 },
    { label: "Apr", value: 1450 }, { label: "May", value: 1600 }, { label: "Jun", value: 1750 },
  ],
};

const orders: Order[] = [
  { id: "#ORD-001", customer: "John Doe", productCount: 3, total: "$245.00", paymentStatus: "paid", fulfillmentStatus: "delivered", date: "2024-01-15" },
  { id: "#ORD-002", customer: "Jane Smith", productCount: 1, total: "$89.00", paymentStatus: "pending", fulfillmentStatus: "processing", date: "2024-01-15" },
  { id: "#ORD-003", customer: "Bob Johnson", productCount: 5, total: "$520.00", paymentStatus: "paid", fulfillmentStatus: "shipped", date: "2024-01-14" },
  { id: "#ORD-004", customer: "Alice Brown", productCount: 2, total: "$156.00", paymentStatus: "failed", fulfillmentStatus: "processing", date: "2024-01-14" },
  { id: "#ORD-005", customer: "Charlie Wilson", productCount: 4, total: "$380.00", paymentStatus: "paid", fulfillmentStatus: "delivered", date: "2024-01-13" },
  { id: "#ORD-006", customer: "Diana Lee", productCount: 1, total: "$65.00", paymentStatus: "refunded", fulfillmentStatus: "cancelled", date: "2024-01-13" },
];

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
  { id: "5", title: "Customer cancelled order", description: "Customer cancelled order #ORD-009.", timestamp: "1 day ago", icon: "cancelled" as const },
];

const customerInsights = [
  { title: "Returning Customers", value: "42%", change: 5.2 },
  { title: "First-time Buyers", value: "58%", change: 12.1 },
  { title: "Avg Order Value", value: "$85.40", change: 3.8 },
  { title: "Repeat Purchase Rate", value: "28%", change: -1.5 },
];

export default function OrdersPage() {
  const [timeFilter, setTimeFilter] = useState("Weekly");
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
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder({
      id: order.id,
      customer: order.customer,
      email: "customer@example.com",
      phone: "+1 234 567 890",
      address: "123 Main St, New York, NY 10001",
      products: [
        { name: "Product A", quantity: 2, price: "$120.00" },
        { name: "Product B", quantity: 1, price: "$89.00" },
      ],
      payment: "Credit Card ending in 4242",
      status: order.fulfillmentStatus === "delivered" ? "Delivered" : order.fulfillmentStatus === "shipped" ? "Shipped" : order.fulfillmentStatus === "processing" ? "Processing" : "Cancelled",
      notes: "No special instructions.",
      timeline: [
        { title: "Order placed", timestamp: "2024-01-15 10:30 AM" },
        { title: "Payment confirmed", timestamp: "2024-01-15 10:32 AM" },
        { title: "Processing", timestamp: "2024-01-15 02:00 PM" },
      ],
    });
    setDrawerOpen(true);
  };

  if (loading) {
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
          <Button variant="outline" size="sm" className="gap-1.5">
            <Calendar className="h-4 w-4" />
            Last 30 days
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
        <OrderAnalyticsChart data={chartData[timeFilter.toLowerCase() as keyof typeof chartData]} />
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

      <OrderTable orders={orders} onViewOrder={handleViewOrder} />

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
