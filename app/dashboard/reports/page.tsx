import {
  BarChart3,
  PieChart,
  FileText,
  Download,
  Calendar,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const reports = [
  {
    title: "Sales Report",
    description: "Detailed breakdown of sales by product, channel, and region.",
    icon: BarChart3,
    lastGenerated: "2 hours ago",
  },
  {
    title: "Customer Report",
    description: "Customer acquisition, retention, and lifetime value metrics.",
    icon: PieChart,
    lastGenerated: "1 day ago",
  },
  {
    title: "Revenue Report",
    description: "Revenue trends, forecasts, and variance analysis.",
    icon: FileText,
    lastGenerated: "3 days ago",
  },
  {
    title: "Inventory Report",
    description: "Stock levels, turnover rates, and low-stock alerts.",
    icon: Calendar,
    lastGenerated: "1 week ago",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download detailed reports for your store.
          </p>
        </div>
        <Button variant="default">
          <Download className="mr-2 h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card
            key={report.title}
            className="group relative overflow-hidden p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <report.icon className="h-5 w-5" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-semibold">{report.title}</h3>
              <p className="text-sm text-muted-foreground">
                {report.description}
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Last generated: {report.lastGenerated}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
