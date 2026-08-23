"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, Plus, ExternalLink, Pencil, Loader2 } from "lucide-react";
import Link from "next/link";
import { Store as StoreType } from "@/types/store";
import { mapStoreRow } from "@/lib/stores";

export default function StoresPage() {
  const [store, setStore] = useState<StoreType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchStore = async () => {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        if (mounted) setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("stores")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();

      if (fetchError) {
        if (mounted) setError(fetchError.message || "Failed to load store.");
      } else if (data) {
        const mapped = mapStoreRow(data);
        if (mounted) setStore(mapped);
      }

      if (mounted) setLoading(false);
    };

    fetchStore();

    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stores</h1>
          <p className="text-muted-foreground mt-1">
            Manage your online store.
          </p>
        </div>
        {!store && (
          <Link href="/dashboard/store">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Store
            </Button>
          </Link>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {!store ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
            <Store className="h-6 w-6" />
          </div>
          <h3 className="font-semibold text-lg">No store yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            You don&apos;t have a store yet. Create your first store and start selling your products.
          </p>
          <Link href="/dashboard/store" className="mt-4">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Store
            </Button>
          </Link>
        </div>
      ) : (
        <Card className="flex flex-col">
          <div className="p-6 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{store.name}</h3>
                  <p className="text-xs text-muted-foreground">/store/{store.slug}</p>
                </div>
              </div>
            </div>
            {store.description && (
              <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                {store.description}
              </p>
            )}
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center gap-2">
            <Link href={`/store/${store.slug}`} className="flex-1">
              <Button variant="outline" className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                View Store
              </Button>
            </Link>
            <Link href={`/dashboard/store?edit=${store.id}`}>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
