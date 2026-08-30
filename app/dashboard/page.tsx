"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { AIRecommendation } from "@/components/dashboard/ai-recommendation";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { useOrders } from "@/context/order-context";
import { createClient } from "@/lib/supabase/client";
import { DollarSign, ShoppingCart, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { Order } from "@/types/store";
import { StatCardProps, ProblemItem, RecommendationItem, ActivityItem } from "@/types";

function getSparkline(orderList: Order[], now: Date, days: number): number[] {
  const result: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    result.push(
      orderList
        .filter((o) => o.createdAt.startsWith(dateStr))
        .reduce((sum, o) => sum + o.total, 0)
    );
  }
  return result;
}

export default function DashboardPage() {
  const { orders, loading } = useOrders();
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, business_name")
          .eq("id", user.id)
          .maybeSingle();

        const name = profile?.full_name || profile?.business_name || "";
        setUserName(name);
      }
    };

    fetchUser();
  }, []);

  const now = useMemo(() => new Date(), []);
  const currentStart = useMemo(() => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), [now]);
  const previousStart = useMemo(() => new Date(currentStart.getTime() - 30 * 24 * 60 * 60 * 1000), [currentStart]);

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

  const totalRevenue = useMemo(
    () => validCurrentOrders.reduce((sum, o) => sum + o.total, 0),
    [validCurrentOrders]
  );

  const previousRevenue = useMemo(
    () => validPreviousOrders.reduce((sum, o) => sum + o.total, 0),
    [validPreviousOrders]
  );

  const totalOrders = validCurrentOrders.length;
  const prevTotalOrders = validPreviousOrders.length;

  const customerEmails = useMemo(
    () => new Set(validCurrentOrders.map((o) => o.customer.email.toLowerCase())),
    [validCurrentOrders]
  );
  const totalCustomers = customerEmails.size;

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const prevAov = prevTotalOrders > 0 ? previousRevenue / prevTotalOrders : 0;

  const calcChange = useCallback((current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }, []);

  const revenueGrowth = calcChange(totalRevenue, previousRevenue);
  const ordersGrowth = calcChange(totalOrders, prevTotalOrders);
  const aovGrowth = calcChange(avgOrderValue, prevAov);

  const stats: StatCardProps[] = useMemo(
    () => [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toFixed(2)}`,
        change: revenueGrowth,
        icon: <DollarSign className="h-5 w-5" />,
        sparkline: getSparkline(validCurrentOrders, now, 7),
      },
      {
        title: "Orders",
        value: totalOrders.toLocaleString(),
        change: ordersGrowth,
        icon: <ShoppingCart className="h-5 w-5" />,
        sparkline: getSparkline(validCurrentOrders, now, 7),
      },
      {
        title: "Customers",
        value: totalCustomers.toLocaleString(),
        change: 0,
        icon: <Users className="h-5 w-5" />,
        sparkline: [],
      },
      {
        title: "Avg Order Value",
        value: `$${avgOrderValue.toFixed(2)}`,
        change: aovGrowth,
        icon: <TrendingUp className="h-5 w-5" />,
        sparkline: [],
      },
    ],
    [totalRevenue, revenueGrowth, totalOrders, ordersGrowth, totalCustomers, avgOrderValue, aovGrowth, validCurrentOrders, now]
  );

  const problems: ProblemItem[] = useMemo(() => {
    const result: ProblemItem[] = [];
    const cancelledCount = validCurrentOrders.filter((o) => o.status === "cancelled").length;
    const refundedCount = validCurrentOrders.filter((o) => o.status === "refunded").length;
    const pendingCount = validCurrentOrders.filter((o) => o.status === "pending").length;

    if (cancelledCount > 0 || refundedCount > 0) {
      const loss = validCurrentOrders
        .filter((o) => o.status === "cancelled" || o.status === "refunded")
        .reduce((sum, o) => sum + o.total, 0);
      result.push({
        id: "cancelled",
        severity: "high",
        title: "Cancelled/Refunded orders detected",
        description: `${cancelledCount + refundedCount} orders were cancelled or refunded in the last 30 days.`,
        estimatedImpact: `$${loss.toFixed(2)} at risk`,
      });
    }

    if (pendingCount > 0) {
      result.push({
        id: "pending",
        severity: "medium",
        title: "Pending orders need attention",
        description: `${pendingCount} orders are pending payment and may need follow-up.`,
        estimatedImpact: "Potential revenue delay",
      });
    }

    if (result.length === 0 && totalOrders === 0) {
      result.push({
        id: "no-orders",
        severity: "low",
        title: "No orders yet",
        description: "Start promoting your store to generate your first orders.",
        estimatedImpact: "$0",
      });
    }

    return result;
  }, [validCurrentOrders, totalOrders]);

  const recommendation: RecommendationItem | null = useMemo(() => {
    if (totalOrders === 0) {
      return {
        id: "start",
        title: "Start selling today",
        description: "Set up your store and share it with customers to start generating revenue. The sooner you launch, the sooner you can start growing.",
        impact: "+$0/mo",
      };
    }

    if (avgOrderValue < 50) {
      return {
        id: "aov",
        title: "Increase average order value",
        description: "Your current AOV is relatively low. Consider offering product bundles, upselling, or free shipping thresholds to encourage larger purchases.",
        impact: `+${(avgOrderValue * 0.2).toFixed(0)}/mo potential`,
      };
    }

    return {
      id: "optimize",
      title: "Optimize your store performance",
      description: "Your store is generating sales. Focus on reducing cart abandonment and improving checkout flow to maximize conversions.",
      impact: "+15% potential",
    };
  }, [totalOrders, avgOrderValue]);

  const activities: ActivityItem[] = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        title: `Order #${o.id.slice(0, 8)} placed`,
        description: `${o.customer.name} purchased ${o.items.reduce((sum, item) => sum + item.quantity, 0)} items for $${o.total.toFixed(2)}`,
        timestamp: getTimeAgo(new Date(o.createdAt)),
        icon: <CheckCircle2 className="h-4 w-4 text-success" />,
      }));
  }, [orders]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader userName={userName} />
      <StatsSection stats={stats} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueProblems problems={problems} />
        </div>
        <div>
          <AIRecommendation recommendation={recommendation} />
        </div>
      </div>

      <ActivityTimeline activities={activities} />
    </div>
  );
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
