"use client";

interface OrderSummaryProps {
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
}

export function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex-1">
              <p className="font-medium line-clamp-1">{item.product.name}</p>
              <p className="text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="border-t border-border mt-4 pt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-border">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
