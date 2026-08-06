"use client";

import { Card } from "@/components/ui/card";
import {
  BarChart3,
  ShoppingCart,
  Users,
  Package,
  Sparkles,
  FileText,
} from "lucide-react";

const features = [
  {
    icon: BarChart3,
    title: "Revenue Intelligence",
    description: "Track revenue sources, trends, and growth opportunities with AI-powered analytics.",
    color: "#7C5CFC",
  },
  {
    icon: ShoppingCart,
    title: "Order Intelligence",
    description: "Monitor orders, fulfillment, and detect issues before they impact customer satisfaction.",
    color: "#74B9FF",
  },
  {
    icon: Users,
    title: "Customer Insights",
    description: "Understand customer behavior, retention patterns, and lifetime value.",
    color: "#00C48C",
  },
  {
    icon: Package,
    title: "Product Analytics",
    description: "Identify top-performing products, inventory issues, and optimization opportunities.",
    color: "#FFB800",
  },
  {
    icon: Sparkles,
    title: "AI Recommendations",
    description: "Get prioritized, actionable recommendations to recover lost revenue and grow sales.",
    color: "#7C5CFC",
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description: "Generate detailed reports and export data for deeper analysis and decision making.",
    color: "#4F8CFF",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need to Recover Revenue
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to help you identify issues and take action fast.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group rounded-[18px] border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4" style={{ backgroundColor: `${feature.color}15`, color: feature.color }}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
