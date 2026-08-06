import { WelcomeHeader } from "@/components/dashboard/welcome-header";
import { StatsSection } from "@/components/dashboard/stats-section";
import { RevenueProblems } from "@/components/dashboard/revenue-problems";
import { AIRecommendation } from "@/components/dashboard/ai-recommendation";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <WelcomeHeader />
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
