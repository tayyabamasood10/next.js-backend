export interface AIInsightResponse {
  mode: string;
  insight: string;
  problem: string | null;
  impact: string | null;
  recommendation: string;
  opportunity: string;
  summary: string;
}

export async function callAI(mode: "dashboard" | "orders" | "revenue" | "insights", metrics: Record<string, unknown>): Promise<AIInsightResponse> {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, metrics }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate AI insights");
  }

  return response.json() as Promise<AIInsightResponse>;
}
