"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Order } from "@/types/store";

interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  loading: boolean;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: store } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (!store) {
        setLoading(false);
        return;
      }

      const { data: ordersData } = await supabase
        .from("orders")
        .select("*")
        .eq("store_id", store.id)
        .order("created_at", { ascending: false });

      if (ordersData && ordersData.length > 0) {
        const orderIds = ordersData.map((o) => o.id);
        const { data: itemsData } = await supabase
          .from("order_items")
          .select("*")
          .in("order_id", orderIds);

        const itemsByOrder = new Map<string, Order["items"]>();
        (itemsData || []).forEach((item) => {
          const cartItem: Order["items"][0] = {
            product: {
              id: item.product_id,
              name: item.product_name,
              description: "",
              price: Number(item.price),
              image: "",
              stock: 0,
            },
            quantity: item.quantity,
          };
          if (!itemsByOrder.has(item.order_id)) {
            itemsByOrder.set(item.order_id, []);
          }
          itemsByOrder.get(item.order_id)!.push(cartItem);
        });

        const mappedOrders: Order[] = ordersData.map((o) => {
          const items = itemsByOrder.get(o.id) || [];
          const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

          return {
            id: o.id,
            storeId: o.store_id,
            customer: {
              name: o.customer_name,
              email: o.customer_email,
              phone: o.customer_phone || "",
              address: "",
              city: "",
              postalCode: "",
            },
            items,
            subtotal,
            shipping: 0,
            total: Number(o.total_amount) || subtotal,
            status: (o.status as Order["status"]) || "pending",
            createdAt: o.created_at,
          };
        });

        setOrders(mappedOrders);
      }

      setLoading(false);
    };

    fetchOrders();
  }, []);

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrderProvider");
  }
  return context;
}
