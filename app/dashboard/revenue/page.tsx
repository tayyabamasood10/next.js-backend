"use client";

import { useState } from "react";
import { RevenueCard } from "@/components/revenue/revenue-card";
import { FilterTabs } from "@/components/revenue/filter-tabs";
import { RevenueTrendChart } from "@/components/revenue/revenue-trend-chart";
import { RevenueBreakdownCard } from "@/components/revenue/revenue-breakdown-card";
import { TopProductsTable } from "@/components/revenue/top-products-table";
import { RevenueLeakCard } from "@/components/revenue/revenue-leak-card";
import { AIRevenueInsightCard } from "@/components/revenue/ai-revenue-insight-card";
import { ForecastCard } from "@/components/revenue/forecast-card";
import { TimelineCard } from "@/components/revenue/timeline-card";
import { RevenueSkeleton } from "@/components/revenue/revenue-skeleton";
import { DollarSign, TrendingUp, ShoppingCart, BarChart3, ChevronRight, Calendar, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: 20.1,
    previousValue: "$37,692.00",
    icon: <DollarSign className="h-5 w-5" />,
    sparkline: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
  },
  {
    title: "Net Revenue",
    value: "$38,420.00",
    change: 12.5,
    previousValue: "$34,140.00",
    icon: <TrendingUp className="h-5 w-5" />,
    sparkline: [20, 30, 25, 40, 35, 50, 45, 55, 50, 60, 58, 70],
  },
  {
    title: "Average Order Value",
    value: "$85.40",
    change: 5.2,
    previousValue: "$81.20",
    icon: <ShoppingCart className="h-5 w-5" />,
    sparkline: [40, 42, 41, 45, 43, 48, 46, 50, 49, 52, 51, 55],
  },
  {
    title: "Revenue Growth",
    value: "24.5%",
    change: 8.3,
    previousValue: "16.2%",
    icon: <BarChart3 className="h-5 w-5" />,
    sparkline: [10, 15, 12, 18, 16, 20, 18, 22, 20, 24, 23, 28],
  },
];

const chartData = {
  daily: [
    { label: "Mon", value: 1200 }, { label: "Tue", value: 1900 }, { label: "Wed", value: 1500 },
    { label: "Thu", value: 2200 }, { label: "Fri", value: 2800 }, { label: "Sat", value: 2400 }, { label: "Sun", value: 1800 },
  ],
  weekly: [
    { label: "W1", value: 8500 }, { label: "W2", value: 9200 }, { label: "W3", value: 7800 },
    { label: "W4", value: 10500 }, { label: "W5", value: 11200 }, { label: "W6", value: 9800 }, { label: "W7", value: 12400 },
  ],
  monthly: [
    { label: "Jan", value: 32000 }, { label: "Feb", value: 28000 }, { label: "Mar", value: 35000 },
    { label: "Apr", value: 38000 }, { label: "May", value: 42000 }, { label: "Jun", value: 45000 },
  ],
  yearly: [
    { label: "2019", value: 180000 }, { label: "2020", value: 220000 }, { label: "2021", value: 310000 },
    { label: "2022", value: 420000 }, { label: "2023", value: 510000 }, { label: "2024", value: 620000 },
  ],
};

const breakdowns = {
  "Sales Channel": [
    { label: "Direct", value: "$18,400", percentage: 42, growth: 12 },
    { label: "Organic Search", value: "$12,300", percentage: 28, growth: 8 },
    { label: "Social Media", value: "$8,200", percentage: 19, growth: -3 },
    { label: "Email", value: "$4,800", percentage: 11, growth: 5 },
  ],
  "Products": [
    { label: "Electronics", value: "$15,200", percentage: 35, growth: 15 },
    { label: "Clothing", value: "$12,800", percentage: 29, growth: 7 },
    { label: "Home & Garden", value: "$9,400", percentage: 22, growth: -2 },
    { label: "Other", value: "$6,300", percentage: 14, growth: 4 },
  ],
  "Categories": [
    { label: "New Arrivals", value: "$14,100", percentage: 32, growth: 18 },
    { label: "Best Sellers", value: "$16,500", percentage: 38, growth: 10 },
    { label: "Sale Items", value: "$8,900", percentage: 20, growth: -5 },
    { label: "Clearance", value: "$4,200", percentage: 10, growth: 2 },
  ],
  "Countries": [
    { label: "United States", value: "$22,400", percentage: 51, growth: 14 },
    { label: "United Kingdom", value: "$8,600", percentage: 20, growth: 6 },
    { label: "Canada", value: "$6,200", percentage: 14, growth: 3 },
    { label: "Others", value: "$5,500", percentage: 13, growth: -1 },
  ],
  "Devices": [
    { label: "Mobile", value: "$19,800", percentage: 45, growth: -4 },
    { label: "Desktop", value: "$18,400", percentage: 42, growth: 12 },
    { label: "Tablet", value: "$4,500", percentage: 10, growth: 2 },
    { label: "Other", value: "$1,000", percentage: 3, growth: 1 },
  ],
};

const topProducts = [
  { id: "1", name: "Wireless Headphones Pro", unitsSold: 342, revenue: "$29,148", conversion: "4.2%", growth: 18 },
  { id: "2", name: "Smart Watch Series X", unitsSold: 256, revenue: "$25,600", conversion: "3.8%", growth: 12 },
  { id: "3", name: "Leather Wallet", unitsSold: 189, revenue: "$11,340", conversion: "5.1%", growth: -3 },
  { id: "4", name: "Running Shoes", unitsSold: 145, revenue: "$14,500", conversion: "2.9%", growth: 8 },
  { id: "5", name: "Coffee Maker Deluxe", unitsSold: 98, revenue: "$9,800", conversion: "3.5%", growth: 24 },
];

const revenueLeaks = [
  { id: "1", severity: "high" as const, title: "Checkout Abandonment", description: "68% of users abandon cart at checkout.", estimatedLoss: "$12,400/mo" },
  { id: "2", severity: "medium" as const, title: "Refund Loss", description: "High refund rate on electronics category.", estimatedLoss: "$3,200/mo" },
  { id: "3", severity: "medium" as const, title: "Discount Overuse", description: "Average discount increased to 18%.", estimatedLoss: "$2,800/mo" },
  { id: "4", severity: "low" as const, title: "Inventory Stockouts", description: "3 top products frequently out of stock.", estimatedLoss: "$1,500/mo" },
];

const timelineEvents = [
  { id: "1", title: "Revenue increased after campaign", description: "Email campaign drove $4,200 in additional revenue.", timestamp: "2 hours ago", icon: "growth" as const },
  { id: "2", title: "Refund spike detected", description: "Refund rate increased by 12% in the last 7 days.", timestamp: "4 hours ago", icon: "warning" as const },
  { id: "3", title: "High-value customer purchase", description: "A customer spent $1,240 on a single order.", timestamp: "6 hours ago", icon: "success" as const },
  { id: "4", title: "New revenue opportunity identified", description: "Mobile checkout optimization could recover $8,400/mo.", timestamp: "1 day ago", icon: "insight" as const },
];

export default function RevenuePage() {
  const [timeFilter, setTimeFilter] = useState("Monthly");
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  if (loading) {
    return <RevenueSkeleton />;
  }

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
        <RevenueTrendChart data={chartData[timeFilter.toLowerCase() as keyof typeof chartData]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueBreakdownCard title="Sales Channel" items={breakdowns["Sales Channel"]} />
        <RevenueBreakdownCard title="Products" items={breakdowns["Products"]} />
        <RevenueBreakdownCard title="Categories" items={breakdowns["Categories"]} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <RevenueBreakdownCard title="Countries" items={breakdowns["Countries"]} />
        <RevenueBreakdownCard title="Devices" items={breakdowns["Devices"]} />
      </div>

      <TopProductsTable products={topProducts} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueLeakCard leaks={revenueLeaks} />
        </div>
        <div>
          <ForecastCard
            expectedRevenue="$52,400"
            projectedGrowth="+15.8%"
            confidence="High"
            data={[
              { label: "Jul", value: 45000 }, { label: "Aug", value: 48000 }, { label: "Sep", value: 47000 },
              { label: "Oct", value: 51000 }, { label: "Nov", value: 54000 }, { label: "Dec", value: 52400 },
            ]}
          />
        </div>
      </div>

      <AIRevenueInsightCard
        title="Mobile checkout abandonment increased by 24%"
        description="Your mobile checkout has a significantly higher abandonment rate compared to desktop. Implementing mobile payment options and simplifying the checkout flow could recover lost revenue."
        estimatedLoss="$3,240/month"
        actions={[
          "Improve mobile checkout flow",
          "Show shipping costs earlier",
          "Launch an abandoned cart campaign",
        ]}
        impact="+$3,240/mo potential recovery"
      />

      <TimelineCard events={timelineEvents} />
    </div>
  );
}
