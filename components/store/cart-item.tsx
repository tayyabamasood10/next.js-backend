"use client";

import type { CartItem } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <div className="h-20 w-20 shrink-0 rounded-lg bg-accent/50 flex items-center justify-center overflow-hidden">
        {item.product.image ? (
          <img
            src={item.product.image}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-2xl font-bold text-muted-foreground/30">
            {item.product.name.charAt(0)}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">
          ${(item.product.price * item.quantity).toFixed(2)}
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 mt-2 text-danger hover:text-danger"
          onClick={() => onRemove(item.product.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
