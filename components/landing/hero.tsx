"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Sparkles } from "lucide-react";

interface HeroSectionProps {
  onLoginClick?: () => void;
}

export function HeroSection({ onLoginClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute left-1/4 top-20 h-[300px] w-[300px] rounded-full bg-secondary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-success animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-muted-foreground">AI-Powered Revenue Recovery</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Stop Losing Revenue{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Without Knowing Why
            </span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto">
            AI Revenue Recovery identifies hidden revenue leaks, explains the root cause, and gives you actionable recommendations to increase sales.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 rounded-[14px] text-base" onClick={onLoginClick}>
              Start Recovering Revenue
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 rounded-[14px] text-base">
              <Play className="h-4 w-4" />
              Watch Demo
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-success">✓</span>
              <span>14-day free trial</span>
            </div>
          </div>
        </div>

        <div className="mt-16 relative">
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
                  app.airevenuerecovery.com/dashboard
                </div>
              </div>
            </div>
            <div className="aspect-[16/9] sm:aspect-[2/1] bg-gradient-to-br from-accent/50 to-muted/30 flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-8 w-8" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Dashboard Preview</p>
                <p className="text-xs text-muted-foreground/70">Interactive demo coming soon</p>
              </div>
            </div>
          </div>

          <div className="absolute -right-4 top-1/4 hidden lg:block">
            <div className="rounded-[16px] border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                  <ArrowRight className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Revenue Recovered</p>
                  <p className="text-lg font-bold text-success">+$24,500</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -left-4 top-1/3 hidden lg:block">
            <div className="rounded-[16px] border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">AI Insights</p>
                  <p className="text-lg font-bold">12 New</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
