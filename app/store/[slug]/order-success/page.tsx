"use client";

import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "@/context/order-context";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const orderId = searchParams.get("orderId");
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-2">Order Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. We&apos;ll send you a confirmation email shortly.
        </p>

        {order && (
          <div className="rounded-2xl border border-border bg-card p-6 text-left mb-6 shadow-sm">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order ID</span>
                <span className="font-medium font-mono">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer</span>
                <span className="font-medium">{order.customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{order.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="font-medium">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning capitalize">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <Link href={`/store/${params.slug}`}>
          <Button size="lg" className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
