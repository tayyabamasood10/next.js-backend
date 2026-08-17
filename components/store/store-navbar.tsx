"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Store, ShoppingCart } from "lucide-react";
import { cn } from "@/components/ui/cn";
import { useCart } from "@/context/cart-context";

interface StoreNavbarProps {
  store: {
    name: string;
    logo: string;
    slug: string;
  };
}

export function StoreNavbar({ store }: StoreNavbarProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const storeSlug = store.slug;

  const navLinks = [
    { href: `/store/${storeSlug}`, label: "Home" },
    { href: `/store/${storeSlug}/products`, label: "Products" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Link href={`/store/${storeSlug}`} className="flex items-center gap-2">
            {store.logo ? (
              <img
                src={store.logo}
                alt={store.name}
                className="h-8 w-8 rounded-lg object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Store className="h-4 w-4" />
              </div>
            )}
            <span className="font-semibold text-sm tracking-tight">{store.name}</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href={`/store/${storeSlug}/cart`}
          className="relative flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
