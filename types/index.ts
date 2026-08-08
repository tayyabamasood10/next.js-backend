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

export interface Profile {
  id: string;
  full_name: string;
  business_name: string;
  email: string;
  created_at: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}
