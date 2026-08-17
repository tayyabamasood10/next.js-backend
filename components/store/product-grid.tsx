"use client";

import { Product } from "@/lib/mock-products";
import { ProductCard } from "@/components/store/product-card";

interface ProductGridProps {
  products: Product[];
  storeSlug: string;
}

export function ProductGrid({ products, storeSlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No products available yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} storeSlug={storeSlug} />
      ))}
    </div>
  );
}
