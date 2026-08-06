"use client";

import { cn } from "./cn";

interface TopProductsTableProps {
  products: {
    id: string;
    name: string;
    image?: string;
    unitsSold: number;
    revenue: string;
    conversion: string;
    growth: number;
  }[];
  className?: string;
}

export function TopProductsTable({ products, className }: TopProductsTableProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] shadow-sm overflow-hidden", className)}>
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-base font-semibold">Top Performing Products</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-6 py-3 font-medium">Product</th>
              <th className="px-6 py-3 font-medium">Units Sold</th>
              <th className="px-6 py-3 font-medium">Revenue</th>
              <th className="px-6 py-3 font-medium">Conversion</th>
              <th className="px-6 py-3 font-medium">Growth</th>
              <th className="px-6 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id} className="transition-colors hover:bg-accent/30">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-muted-foreground">
                      <span className="text-xs font-medium">IMG</span>
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{product.unitsSold}</td>
                <td className="px-6 py-4 font-medium">{product.revenue}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    {product.conversion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={cn("text-sm font-medium", product.growth >= 0 ? "text-success" : "text-danger")}>
                    {product.growth >= 0 ? "+" : ""}{product.growth}%
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-sm font-medium text-primary hover:underline">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
