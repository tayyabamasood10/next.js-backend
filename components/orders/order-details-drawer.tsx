"use client";

import { cn } from "./cn";
import { Button } from "@/components/ui/button";

interface OrderDetailsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: {
    id: string;
    customer: string;
    email: string;
    phone: string;
    address: string;
    products: { name: string; quantity: number; price: string }[];
    payment: string;
    status: string;
    notes: string;
    timeline: { title: string; timestamp: string }[];
  };
  className?: string;
}

export function OrderDetailsDrawer({ open, onOpenChange, order, className }: OrderDetailsDrawerProps) {
  return (
    <div
      data-state={open ? "open" : "closed"}
      className={cn(
        "fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-border bg-background shadow-lg transition-transform duration-300 ease-in-out",
        open ? "translate-x-0" : "translate-x-full",
        className
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h3 className="text-base font-semibold">Order {order.id}</h3>
            <p className="text-sm text-muted-foreground">{order.status}</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Customer Information</h4>
            <div className="rounded-xl bg-accent/50 p-4 space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {order.customer}</p>
              <p><span className="font-medium">Email:</span> {order.email}</p>
              <p><span className="font-medium">Phone:</span> {order.phone}</p>
              <p><span className="font-medium">Address:</span> {order.address}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Products</h4>
            <div className="space-y-2">
              {order.products.map((product, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-accent/50 p-3">
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                  </div>
                  <p className="text-sm font-medium">{product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Payment & Status</h4>
            <div className="rounded-xl bg-accent/50 p-4 space-y-2 text-sm">
              <p><span className="font-medium">Payment:</span> {order.payment}</p>
              <p><span className="font-medium">Status:</span> {order.status}</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Order Notes</h4>
            <p className="text-sm text-muted-foreground rounded-xl bg-accent/50 p-4">{order.notes}</p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Timeline</h4>
            <div className="space-y-3">
              {order.timeline.map((event, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 flex items-center gap-2">
          <Button className="flex-1">Update Status</Button>
          <Button variant="outline" className="flex-1">Send Email</Button>
        </div>
      </div>
    </div>
  );
}
