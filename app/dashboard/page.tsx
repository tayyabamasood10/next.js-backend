"use client";

import { useState, useEffect } from "react";
import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { AIRecommendation } from "@/components/dashboard/ai-recommendation";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const name = user.user_metadata?.full_name || user.user_metadata?.name || "";
        setUserName(name);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "";
        setUserName(name);
      } else {
        setUserName("");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-6">
      <WelcomeHeader userName={userName} />
      <StatsSection />

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
