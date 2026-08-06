"use client";

import { cn } from "./cn";

interface OrderTableProps {
  orders: {
    id: string;
    customer: string;
    productCount: number;
    total: string;
    paymentStatus: "paid" | "pending" | "failed" | "refunded";
    fulfillmentStatus: "processing" | "shipped" | "delivered" | "cancelled";
    date: string;
  }[];
  onViewOrder?: (order: OrderTableProps["orders"][0]) => void;
  className?: string;
}

const paymentStatusConfig = {
  paid: { label: "Paid", className: "bg-success/10 text-success" },
  pending: { label: "Pending", className: "bg-warning/10 text-warning" },
  failed: { label: "Failed", className: "bg-danger/10 text-danger" },
  refunded: { label: "Refunded", className: "bg-muted text-muted-foreground" },
};

const fulfillmentStatusConfig = {
  processing: { label: "Processing", className: "bg-info/10 text-info" },
  shipped: { label: "Shipped", className: "bg-primary/10 text-primary" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelled", className: "bg-danger/10 text-danger" },
};

export function OrderTable({ orders, onViewOrder, className }: OrderTableProps) {
  return (
    <div className={cn("bg-card border border-border rounded-[18px] shadow-sm overflow-hidden", className)}>
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-base font-semibold">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="px-6 py-3 font-medium">Order ID</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Products</th>
              <th className="px-6 py-3 font-medium">Total</th>
              <th className="px-6 py-3 font-medium">Payment</th>
              <th className="px-6 py-3 font-medium">Fulfillment</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((order) => {
              const paymentStatus = paymentStatusConfig[order.paymentStatus];
              const fulfillmentStatus = fulfillmentStatusConfig[order.fulfillmentStatus];
              return (
                <tr key={order.id} className="transition-colors hover:bg-accent/30">
                  <td className="px-6 py-4">
                    <span className="font-mono font-medium">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {order.customer.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <span className="font-medium">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.productCount}</td>
                  <td className="px-6 py-4 font-medium">{order.total}</td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", paymentStatus.className)}>
                      {paymentStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", fulfillmentStatus.className)}>
                      {fulfillmentStatus.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => onViewOrder?.(order)}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
