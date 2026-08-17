"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Store } from "@/types/store";
import { createClient } from "@/lib/supabase/client";
import { AlertCircle, Loader2 } from "lucide-react";

export default function CreateStorePage() {
  const router = useRouter();
  const [store, setStore] = useState<Store>({
    id: "",
    name: "",
    slug: "",
    description: "",
    logo: "",
    heroTitle: "",
    heroDescription: "",
    ownerId: "",
  });
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && mounted) {
        setStore((prev) => ({ ...prev, ownerId: user.id }));
      }
      if (mounted) setLoading(false);
    };

    fetchUser();

    return () => { mounted = false; };
  }, []);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    setStore((prev) => {
      const newSlug = !prev.slug || prev.slug === generateSlug(prev.name)
        ? generateSlug(name)
        : prev.slug;
      return { ...prev, name, slug: newSlug };
    });
  };

  const handlePublish = async () => {
    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to create a store.");
        setSaving(false);
        return;
      }

      if (!store.name.trim() || !store.slug.trim()) {
        setError("Store name and slug are required.");
        setSaving(false);
        return;
      }

      const slug = generateSlug(store.slug || store.name);

      const { data, error: insertError } = await supabase
        .from("stores")
        .insert({
          owner_id: user.id,
          name: store.name.trim(),
          slug: slug,
          description: store.description.trim(),
          logo_url: store.logo.trim(),
          hero_title: store.heroTitle.trim(),
          hero_description: store.heroDescription.trim(),
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          setError("A store with this slug already exists. Please choose a different slug.");
        } else {
          setError("Failed to create store. Please try again.");
        }
        setSaving(false);
        return;
      }

      router.push(`/store/${data.slug}`);
      router.refresh();
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Store</h1>
        <p className="text-muted-foreground mt-1">
          Set up your online store and start selling.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl p-3 text-sm border bg-danger/5 border-danger/20 text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Basic details about your store.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Store Name</label>
              <Input
                id="name"
                placeholder="My Awesome Store"
                value={store.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">Store Slug</label>
              <Input
                id="slug"
                placeholder="my-awesome-store"
                value={store.slug}
                onChange={(e) => setStore((prev) => ({ ...prev, slug: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">/store/{store.slug || "your-store"}</p>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">Store Description</label>
              <textarea
                id="description"
                placeholder="Brief description of your store..."
                value={store.description}
                onChange={(e) => setStore((prev) => ({ ...prev, description: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">Logo URL</label>
              <Input
                id="logo"
                placeholder="https://example.com/logo.png"
                value={store.logo}
                onChange={(e) => setStore((prev) => ({ ...prev, logo: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Customize your storefront hero.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="heroTitle" className="text-sm font-medium">Hero Title</label>
              <Input
                id="heroTitle"
                placeholder="Welcome to My Store"
                value={store.heroTitle}
                onChange={(e) => setStore((prev) => ({ ...prev, heroTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="heroDescription" className="text-sm font-medium">Hero Description</label>
              <textarea
                id="heroDescription"
                placeholder="Discover our latest collection..."
                value={store.heroDescription}
                onChange={(e) => setStore((prev) => ({ ...prev, heroDescription: e.target.value }))}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
              />
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setPreviewOpen(true)}>Preview</Button>
            <Button onClick={handlePublish} disabled={saving || !store.name || !store.slug}>
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                "Publish Store"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">Store Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>Close</Button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">This is how your store will look:</p>
              <div className="border border-border rounded-xl overflow-hidden">
                <div className="bg-accent/50 p-8 text-center">
                  <h2 className="text-2xl font-bold">{store.heroTitle || store.name}</h2>
                  <p className="text-muted-foreground mt-2">{store.heroDescription || store.description}</p>
                </div>
                <div className="p-8 grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border border-border rounded-xl p-4">
                      <div className="aspect-square bg-muted rounded-lg mb-3" />
                      <p className="font-medium text-sm">Product {i}</p>
                      <p className="text-xs text-muted-foreground">$0.00</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
