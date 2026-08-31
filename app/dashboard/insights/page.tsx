"use client";

import { useState, useMemo, useEffect } from "react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, AlertTriangle, Lightbulb, Target, RefreshCw, Loader2 } from "lucide-react";
import { useOrders } from "@/context/order-context";
import { createClient } from "@/lib/supabase/client";

interface AIInsightResponse {
  mode: string;
  insight: string;
  problem: string | null;
  impact: string | null;
  recommendation: string;
  opportunity: string;
  summary: string;
}

export default function AIInsightsPage() {
  const { orders, loading: ordersLoading } = useOrders();
  const [userName, setUserName] = useState("");
  const [insights, setInsights] = useState<AIInsightResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    () => orders.filter((o) => {
      const date = new Date(o.createdAt);
      return date >= currentStart && date <= now;
    }),
    [orders, currentStart, now]
  );

  const previousOrders = useMemo(
    () => orders.filter((o) => {
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

  const totalRevenue = useMemo(() => validCurrentOrders.reduce((sum, o) => sum + o.total, 0), [validCurrentOrders]);
  const previousRevenue = useMemo(() => validPreviousOrders.reduce((sum, o) => sum + o.total, 0), [validPreviousOrders]);
  const totalOrders = validCurrentOrders.length;
  const prevTotalOrders = validPreviousOrders.length;
  const totalAllCurrentRevenue = currentOrders.reduce((sum, o) => sum + o.total, 0);

  const customerEmails = useMemo(() => new Set(validCurrentOrders.map((o) => o.customer.email.toLowerCase())), [validCurrentOrders]);
  const totalCustomers = customerEmails.size;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const prevAov = prevTotalOrders > 0 ? previousRevenue / prevTotalOrders : 0;

  const calcChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  };

  const revenueGrowth = calcChange(totalRevenue, previousRevenue);
  const ordersGrowth = calcChange(totalOrders, prevTotalOrders);
  const aovGrowth = calcChange(avgOrderValue, prevAov);
  const netRevenueGrowth = calcChange(totalRevenue, previousRevenue);

  const statusBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {};
    currentOrders.forEach((o) => {
      breakdown[o.status] = (breakdown[o.status] || 0) + 1;
    });
    return breakdown;
  }, [currentOrders]);

  const pendingOrders = currentOrders.filter((o) => o.status === "pending").length;
  const cancelledOrders = currentOrders.filter((o) => o.status === "cancelled").length;
  const refundedOrders = currentOrders.filter((o) => o.status === "refunded").length;
  const completedOrders = currentOrders.filter((o) => o.status === "delivered").length;
  const processingOrders = currentOrders.filter((o) => o.status === "processing").length;
  const shippedOrders = currentOrders.filter((o) => o.status === "shipped").length;

  const topProducts = useMemo(() => {
    const productMap = new Map<string, { revenue: number }>();
    validCurrentOrders.forEach((o) => {
      o.items.forEach((item) => {
        const name = item.product.name;
        const existing = productMap.get(name) || { revenue: 0 };
        productMap.set(name, { revenue: existing.revenue + item.product.price * item.quantity });
      });
    });
    return Array.from(productMap.entries())
      .map(([name, data]) => ({ name, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [validCurrentOrders]);

  const productBreakdown = useMemo(() => {
    const total = topProducts.reduce((sum, p) => sum + p.revenue, 0);
    return topProducts.map((p) => ({
      name: p.name,
      revenue: p.revenue,
      percentage: total > 0 ? Number(((p.revenue / total) * 100).toFixed(1)) : 0,
    }));
  }, [topProducts]);

  const timeline = useMemo(() => {
    return orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map((o) => ({
        title: `Order #${o.id.slice(0, 8)} placed`,
        description: `${o.customer.name} purchased ${o.items.reduce((sum, item) => sum + item.quantity, 0)} items for $${o.total.toFixed(2)}`,
        timestamp: new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      }));
  }, [orders]);

  useEffect(() => {
    if (ordersLoading || totalOrders === 0) {
      const timer = setTimeout(() => setInsights(null), 0);
      return () => clearTimeout(timer);
    }

    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "insights",
            metrics: {
              revenue: totalRevenue,
              orders: totalOrders,
              customers: totalCustomers,
              avgOrderValue,
              pendingOrders,
              cancelledOrders,
              refundedOrders,
              revenueGrowth,
              ordersGrowth,
              aovGrowth,
              topProducts,
              completedOrders,
              processingOrders,
              shippedOrders,
              deliveredOrders: currentOrders.filter((o) => o.status === "delivered").length,
              statusBreakdown,
              totalAllRevenue: totalAllCurrentRevenue,
              netRevenueGrowth,
              previousRevenue,
              prevAov,
              productBreakdown,
              timeline,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setInsights(data);
        } else {
          setError("Failed to load AI insights");
        }
      } catch {
        setError("Failed to load AI insights");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [ordersLoading, totalOrders, totalRevenue, totalCustomers, avgOrderValue, revenueGrowth, ordersGrowth, aovGrowth, topProducts, completedOrders, processingOrders, shippedOrders, pendingOrders, cancelledOrders, refundedOrders, statusBreakdown, totalAllCurrentRevenue, netRevenueGrowth, previousRevenue, prevAov, productBreakdown, timeline, currentOrders]);

  if (ordersLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <WelcomeHeader userName={userName} />
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive AI-powered analysis of your store performance.
        </p>
      </div>

      {totalOrders === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No insights yet</h3>
            <p className="text-muted-foreground mt-1 max-w-sm text-center">
              AI insights will appear here once you have orders in your store. Create your first order to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertTriangle className="h-12 w-12 text-warning mb-4" />
            <h3 className="font-semibold text-lg">Unable to load insights</h3>
            <p className="text-muted-foreground mt-1">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {insights && (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <CardTitle>Executive Summary</CardTitle>
              </div>
              <CardDescription>{insights.summary || "AI-generated overview of your store performance."}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{insights.insight}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-danger" />
                  <CardTitle>Critical Problem</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {insights.problem ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium">{insights.problem}</p>
                    {insights.impact && (
                      <Badge variant="destructive" className="text-xs">
                        Impact: {insights.impact}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No critical problems detected. Great job!</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  <CardTitle>Growth Opportunity</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{insights.opportunity}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-warning" />
                <CardTitle>Recommended Action</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{insights.recommendation}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics Overview</CardTitle>
              <CardDescription>Key metrics used for AI analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-lg font-bold">${totalRevenue.toFixed(2)}</p>
                  <p className={`text-xs ${revenueGrowth >= 0 ? "text-success" : "text-danger"}`}>
                    {revenueGrowth >= 0 ? "+" : ""}{revenueGrowth.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="text-lg font-bold">{totalOrders}</p>
                  <p className={`text-xs ${ordersGrowth >= 0 ? "text-success" : "text-danger"}`}>
                    {ordersGrowth >= 0 ? "+" : ""}{ordersGrowth.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">Customers</p>
                  <p className="text-lg font-bold">{totalCustomers}</p>
                  <p className="text-xs text-muted-foreground">Unique</p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">AOV</p>
                  <p className="text-lg font-bold">${avgOrderValue.toFixed(2)}</p>
                  <p className={`text-xs ${aovGrowth >= 0 ? "text-success" : "text-danger"}`}>
                    {aovGrowth >= 0 ? "+" : ""}{aovGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
