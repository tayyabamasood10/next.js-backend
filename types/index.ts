export interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  sparkline?: number[];
}

export interface ProblemItem {
  id: string;
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  estimatedImpact: string;
}

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  impact: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}
