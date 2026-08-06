"use client";

import { Card } from "@/components/ui/card";
import { cn } from "./cn";
import { Store, Search, AlertTriangle, Lightbulb } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Store,
    title: "Connect Store",
    description: "Integrate your Shopify, WooCommerce, or BigCommerce store in one click. We support all major platforms.",
  },
  {
    number: "02",
    icon: Search,
    title: "AI Analysis",
    description: "Our AI analyzes your entire store data, customer behavior, and transaction patterns automatically.",
  },
  {
    number: "03",
    icon: AlertTriangle,
    title: "Detect Problems",
    description: "We identify revenue leaks, cart abandonment, refunds, low conversion, and retention issues instantly.",
  },
  {
    number: "04",
    icon: Lightbulb,
    title: "Get Recommendations",
    description: "Receive prioritized, actionable recommendations with estimated revenue impact to fix issues fast.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Get started in minutes and start recovering lost revenue immediately.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 hidden h-full w-px bg-border md:block" />

          <div className="space-y-12 md:space-y-16">
            {steps.map((step, index) => (
              <div
                key={index}
                className={cn(
                  "relative flex flex-col md:flex-row items-center gap-6 md:gap-12",
                  index % 2 === 1 && "md:flex-row-reverse"
                )}
              >
                <div className="flex-1">
                  <Card className="rounded-[18px] border border-border p-6 shadow-sm transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <step.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-xs font-medium text-primary">{step.number}</span>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>
                </div>

                <div className="hidden md:flex h-4 w-4 items-center justify-center">
                  <div className="h-4 w-4 rounded-full border-4 border-primary bg-background" />
                </div>

                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
