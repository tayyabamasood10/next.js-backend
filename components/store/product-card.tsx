"use client";

import Link from "next/link";
import { Product } from "@/lib/mock-products";
import { productStatusConfig } from "@/lib/mock-products";
import { cn } from "@/components/ui/cn";

interface ProductCardProps {
  product: Product;
  storeSlug: string;
}

export function ProductCard({ product, storeSlug }: ProductCardProps) {
  const status = productStatusConfig[product.status];

  return (
    <Link
      href={`/store/${storeSlug}/product/${product.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all hover:shadow-md"
    >
      <div className="aspect-square bg-accent/50 flex items-center justify-center relative overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <span className="text-4xl font-bold text-muted-foreground/30">
            {product.name.charAt(0)}
          </span>
        )}
        {product.status !== "active" && (
          <div className="absolute top-2 left-2">
            <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", status.className)}>
              {status.label}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-sm line-clamp-1">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-lg">${product.price.toFixed(2)}</span>
          <span className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
          </span>
        </div>
      </div>
    </Link>
  );
}
