import { StoreNavbar } from "@/components/store/store-navbar";
import { StoreFooter } from "@/components/store/store-footer";
import { Button } from "@/components/ui/button";
import { Store } from "@/types/store";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface StoreNotFoundProps {
  store?: Store | null;
}

export default async function StoreNotFound({ store }: StoreNotFoundProps) {
  const supabase = await createClient();
  const { data: storeData } = await supabase
    .from("stores")
    .select("slug")
    .order("created_at", { ascending: false })
    .limit(1);

  const fallbackSlug = Array.isArray(storeData) ? storeData[0]?.slug || "" : "";

  const fallbackStore: Store = store || {
    id: "",
    name: "Store",
    slug: fallbackSlug,
    description: "",
    logo: "",
    heroTitle: "",
    heroDescription: "",
    ownerId: "",
  };

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar store={fallbackStore} />
      <main className="flex flex-1 items-center justify-center px-4 py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Store Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The store you are looking for does not exist or may have been removed.
          </p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </main>
      {store && <StoreFooter store={store} />}
    </div>
  );
}
