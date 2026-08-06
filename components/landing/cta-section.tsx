"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CTASectionProps {
  onLoginClick?: () => void;
}

export function CTASection({ onLoginClick }: CTASectionProps) {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-border px-6 py-16 sm:px-12 sm:py-20 lg:px-16 lg:py-24">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-secondary/5 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-7 w-7" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Start Recovering Revenue Today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Join thousands of ecommerce stores already using AI Revenue Recovery to identify leaks and grow their business.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto gap-2 h-12 px-8 rounded-[14px] text-base" onClick={onLoginClick}>
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-[14px] text-base">
                Schedule Demo
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required · 14-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
