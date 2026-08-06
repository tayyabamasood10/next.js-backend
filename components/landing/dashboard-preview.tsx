"use client";

import { cn } from "./cn";
import { Sparkles, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See Your Revenue Like Never Before
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A powerful dashboard that turns complex data into clear, actionable insights.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-[20px] border border-border bg-card shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-danger/80" />
                <div className="h-3 w-3 rounded-full bg-warning/80" />
                <div className="h-3 w-3 rounded-full bg-success/80" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-flex items-center gap-2 rounded-lg bg-accent px-3 py-1 text-xs text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Dashboard Preview
                </div>
              </div>
            </div>
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                  { title: "Total Revenue", value: "$45,231", change: "+20.1%", icon: DollarSign },
                  { title: "Orders", value: "1,234", change: "+12.5%", icon: ShoppingCart },
                  { title: "Customers", value: "8,532", change: "+8.2%", icon: TrendingUp },
                  { title: "Conversion", value: "3.24%", change: "-2.1%", icon: TrendingUp },
                ].map((stat, i) => (
                  <div key={i} className="rounded-[16px] border border-border bg-background p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">{stat.title}</span>
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <stat.icon className="h-4 w-4" />
                      </div>
                    </div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className={cn("text-xs font-medium mt-1", stat.change.startsWith("+") ? "text-success" : "text-danger")}>
                      {stat.change}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[16px] border border-border bg-background p-6">
                <div className="h-64 flex items-end justify-between gap-2">
                  {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((height, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-lg bg-primary/20 hover:bg-primary/40 transition-colors"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/4 hidden lg:block">
            <div className="rounded-[16px] border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Insight</p>
                  <p className="text-xs text-muted-foreground">Mobile checkout optimized</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-1/3 hidden lg:block">
            <div className="rounded-[16px] border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">3 Issues Found</p>
                  <p className="text-xs text-muted-foreground">Action required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
