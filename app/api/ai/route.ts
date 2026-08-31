import { NextResponse } from "next/server";

interface BaseMetrics {
  revenue: number;
  orders: number;
  customers: number;
  avgOrderValue: number;
  pendingOrders: number;
  cancelledOrders: number;
  refundedOrders: number;
  revenueGrowth: number;
  ordersGrowth: number;
  aovGrowth: number;
  topProducts: { name: string; revenue: number }[];
}

interface OrdersMetrics extends BaseMetrics {
  completedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  statusBreakdown: Record<string, number>;
}

interface RevenueMetrics extends BaseMetrics {
  totalAllRevenue: number;
  netRevenueGrowth: number;
  previousRevenue: number;
  prevAov: number;
  productBreakdown: { name: string; revenue: number; percentage: number }[];
}

interface InsightsMetrics extends BaseMetrics {
  completedOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  statusBreakdown: Record<string, number>;
  totalAllRevenue: number;
  netRevenueGrowth: number;
  previousRevenue: number;
  prevAov: number;
  productBreakdown: { name: string; revenue: number; percentage: number }[];
  timeline: { title: string; description: string; timestamp: string }[];
}

type MetricsPayload = {
  mode: "dashboard" | "orders" | "revenue" | "insights";
  metrics: BaseMetrics | OrdersMetrics | RevenueMetrics | InsightsMetrics;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MetricsPayload;
    const { mode, metrics } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const m = metrics as unknown as Record<string, unknown>;
    const topProductsSummary = Array.isArray(m.topProducts) && m.topProducts.length > 0
      ? (m.topProducts as { name: string; revenue: number }[])
          .slice(0, 3)
          .map((p) => `- ${p.name}: $${p.revenue.toFixed(2)}`)
          .join("\n")
      : "No product sales data available";

    let contextPrompt = "";
    if (mode === "dashboard") {
      contextPrompt = `Focus on overall business health, top priorities for the store owner, and quick actionable recommendations.`;
    } else if (mode === "orders") {
      const statusBreakdown = m.statusBreakdown as Record<string, number> | undefined;
      const completedOrders = (m.completedOrders as number | undefined) ?? 0;
      const processingOrders = (m.processingOrders as number | undefined) ?? 0;
      const shippedOrders = (m.shippedOrders as number | undefined) ?? 0;
      const deliveredOrders = (m.deliveredOrders as number | undefined) ?? 0;
      
      contextPrompt = `Focus specifically on order fulfillment issues, status anomalies, and operational improvements.`;
      
      const statusSummary = statusBreakdown 
        ? Object.entries(statusBreakdown)
            .map(([status, count]) => `- ${status}: ${count}`)
            .join("\n")
        : "No status breakdown available";
      
      m.extendedStatus = `Order Status Breakdown:\n${statusSummary}\n- Completed: ${completedOrders}\n- Processing: ${processingOrders}\n- Shipped: ${shippedOrders}\n- Delivered: ${deliveredOrders}`;
    } else if (mode === "revenue") {
      contextPrompt = `Focus on revenue trends, product performance, and pricing/checkout optimization opportunities.`;
    } else if (mode === "insights") {
      contextPrompt = `Provide a comprehensive multi-dimensional analysis covering revenue, orders, customers, products, and operational efficiency.`;
    }

    const prompt = `You are an expert ecommerce business analyst. ${contextPrompt}

Store Metrics (current period: last 30 days):
- Total Revenue: $${(m.revenue as number).toFixed(2)}
- Total Orders: ${m.orders as number}
- Unique Customers: ${m.customers as number}
- Average Order Value: $${(m.avgOrderValue as number).toFixed(2)}
- Pending Orders: ${m.pendingOrders as number}
- Cancelled/Refunded Orders: ${((m.cancelledOrders as number) + (m.refundedOrders as number))}
- Revenue Growth (vs previous period): ${(m.revenueGrowth as number).toFixed(1)}%
- Orders Growth (vs previous period): ${(m.ordersGrowth as number).toFixed(1)}%
- AOV Growth (vs previous period): ${(m.aovGrowth as number).toFixed(1)}%
- Top Products:
${topProductsSummary}
${(m as Record<string, unknown>).extendedStatus ? (m as Record<string, unknown>).extendedStatus as string : ""}

Please respond with a JSON object only (no markdown, no code fences) containing:
{
  "insight": "string - the most important business insight",
  "problem": "string or null - the biggest current problem if any",
  "impact": "string or null - estimated dollar or growth impact",
  "recommendation": "string - one clear action to improve",
  "opportunity": "string - the biggest growth opportunity",
  "summary": "string - brief 1-2 sentence summary of overall performance"
}`;

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that returns only valid JSON. Never include markdown, code fences, or extra text. Always respond with valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      return NextResponse.json(
        { error: "Failed to generate insights" },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices?.[0]?.message?.content || "";

    let parsed: Record<string, string | null>;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse Groq response as JSON:", content);
      return NextResponse.json(
        { error: "Invalid insight format" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      mode,
      insight: (parsed.insight as string) || "Analyze your store performance to unlock growth.",
      problem: (parsed.problem as string | null) || null,
      impact: (parsed.impact as string | null) || null,
      recommendation: (parsed.recommendation as string) || "Review your product listings and checkout flow.",
      opportunity: (parsed.opportunity as string) || "Focus on converting more visitors into buyers.",
      summary: (parsed.summary as string) || "",
    });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
