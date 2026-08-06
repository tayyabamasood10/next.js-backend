"use client";

import { Card } from "@/components/ui/card";
import { ShoppingCart, RefreshCw, TrendingDown, Users, PackageX } from "lucide-react";

const problems = [
  {
    icon: TrendingDown,
    title: "Revenue Leaks",
    description: "Hidden issues silently draining your revenue every month without you noticing.",
    color: "#FF5C5C",
  },
  {
    icon: ShoppingCart,
    title: "Cart Abandonment",
    description: "Customers leaving without completing purchases due to friction in checkout.",
    color: "#FFB800",
  },
  {
    icon: RefreshCw,
    title: "Refund Loss",
    description: "High refund rates eating into profits and indicating product or experience issues.",
    color: "#FF5C5C",
  },
  {
    icon: TrendingDown,
    title: "Low Conversion",
    description: "Traffic not converting into paying customers due to poor UX or messaging.",
    color: "#FFB800",
  },
  {
    icon: Users,
    title: "Customer Retention",
    description: "Customers buying once and never returning, missing repeat purchase opportunities.",
    color: "#4F8CFF",
  },
  {
    icon: PackageX,
    title: "Inventory Issues",
    description: "Stockouts and overstock situations leading to lost sales and wasted capital.",
    color: "#74B9FF",
  },
];

export function ProblemSection() {
  return (
    <section id="problems" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Are You Losing Revenue Without Knowing It?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most ecommerce stores lose 10-30% of potential revenue from preventable issues. Here are the most common problems we detect.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((problem, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden rounded-[18px] border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: `${problem.color}15`, color: problem.color }}>
                <problem.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{problem.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
