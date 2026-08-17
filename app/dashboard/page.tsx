"use client";

import { useState, useEffect } from "react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { AIRecommendation } from "@/components/dashboard/ai-recommendation";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Store } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");
  const [hasStore, setHasStore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
        setUserName(name);

        const { data: store } = await supabase
          .from("stores")
          .select("name")
          .eq("owner_id", user.id)
          .maybeSingle();

        if (store) {
          setHasStore(true);
        }
      }
      setLoading(false);
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
        setUserName(name);
      } else {
        setUserName("");
        setHasStore(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      <StatsSection />

      {!hasStore && (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Store className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Create Your Store</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your online store and start selling to customers.
                </p>
              </div>
            </div>
            <Link href="/dashboard/store">
              <Button className="gap-2">
                <Store className="h-4 w-4" />
                Create Store
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueProblems />
        </div>
        <div>
          <AIRecommendation />
        </div>
      </div>

      <ActivityTimeline />
    </div>
  );
}
