"use client";

import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StoreHeroProps {
  store: {
    name: string;
    heroTitle: string;
    heroDescription: string;
    logo: string;
    description: string;
  };
}

export function StoreHero({ store }: StoreHeroProps) {
  return (
    <section className="relative bg-accent/50 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-6">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="h-16 w-16 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Store className="h-8 w-8" />
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {store.heroTitle || `Welcome to ${store.name}`}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {store.heroDescription || store.description}
            </p>
          </div>
          <Button size="lg" className="gap-2">
            Shop Now
          </Button>
        </div>
      </div>
    </section>
  );
}
