import { CartProvider } from "@/context/cart-context";
import { StoreNavbar } from "@/components/store/store-navbar";
import { StoreFooter } from "@/components/store/store-footer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { mapStoreRow } from "@/lib/stores";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    slug: string;
  }>;
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: store, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !store) {
    notFound();
  }

  const mappedStore = mapStoreRow(store);

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <StoreNavbar store={{ ...mappedStore, slug }} />
        <main>{children}</main>
        <StoreFooter store={mappedStore} />
      </div>
    </CartProvider>
  );
}
