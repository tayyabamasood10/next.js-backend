import { StoreHero } from "@/components/store/store-hero";
import { ProductGrid } from "@/components/store/product-grid";
import { storeProducts } from "@/lib/mock-store";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { mapStoreRow } from "@/lib/stores";

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: store } = await supabase
    .from("stores")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!store) {
    return {
      title: "Store Not Found",
      description: "The requested store could not be found.",
    };
  }

  return {
    title: `${store.name} - /store/${slug}`,
    description: store.description || "",
  };
}

export default async function StorePage({ params }: StorePageProps) {
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
    <>
      <StoreHero store={mappedStore} />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Our Products</h2>
        <ProductGrid products={storeProducts} storeSlug={slug} />
      </section>
    </>
  );
}
