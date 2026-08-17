"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useOrders } from "@/context/order-context";
import { CheckoutForm } from "@/components/store/checkout-form";
import { Order } from "@/types/store";
import { ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [submitting, setSubmitting] = useState(false);

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

    await new Promise((resolve) => setTimeout(resolve, 800));

    const order: Order = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      storeId: "store-1",
      customer,
      items: items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          image: item.product.image,
          stock: item.product.stock,
        },
        quantity: item.quantity,
      })),
      subtotal,
      shipping,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    clearCart();
    setSubmitting(false);

    router.push(`/store/${params.slug}/order-success?orderId=${order.id}`);
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
