"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { CheckoutForm } from "@/components/store/checkout-form";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = 0;
  const total = subtotal + shipping;

  const handleSubmit = async (customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  }) => {
    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("slug", params.slug)
        .single();

      if (!store) {
        setError("Store not found.");
        setSubmitting(false);
        return;
      }

      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity,
      }));

      const { data: orderId, error: rpcError } = await supabase.rpc("create_order", {
        p_store_id: store.id,
        p_customer_name: customer.name,
        p_customer_email: customer.email,
        p_customer_phone: customer.phone,
        p_total_amount: total,
        p_items: orderItems,
      });

      if (rpcError) {
        console.error("Error creating order:", rpcError);
        setError("Failed to place order. Please try again.");
        setSubmitting(false);
        return;
      }

      clearCart();
      router.push(`/store/${params.slug}/order-success?orderId=${orderId}`);
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-4">Add some products before checking out.</p>
          <Link href={`/store/${params.slug}`}>
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href={`/store/${params.slug}/cart`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold tracking-tight mb-6">Checkout</h1>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger mb-6">
            <span>{error}</span>
          </div>
        )}

        <CheckoutForm
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
