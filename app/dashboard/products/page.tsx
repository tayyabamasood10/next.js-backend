"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductTable } from "@/components/products/product-table";
import { ProductFormModal, ProductFormData } from "@/components/products/product-form-modal";
import { DeleteProductModal } from "@/components/products/delete-product-modal";
import { Product } from "@/lib/mock-products";
import { Loader2 } from "lucide-react";

export default function ProductsPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalKey, setAddModalKey] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("store_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setError(error.message || "Failed to load products.");
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, [supabase]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return products;
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.status.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleAddProduct = async (product: ProductFormData) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to add products.");
      return;
    }

    const { data, error } = await supabase
      .from("products")
      .insert({
        store_id: user.id,
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        status: product.status,
      })
      .select()
      .single<Product>();

    if (error) {
      console.error("Error adding product:", error);
      setError(error.message || "Failed to add product.");
    } else if (data) {
      setProducts((prev) => [data, ...prev]);
    }

    setIsAddModalOpen(false);
  };

  const handleEditProduct = async (product: ProductFormData) => {
    if (!product.id) return;

    const { data, error } = await supabase
      .from("products")
      .update({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        image_url: product.image_url,
        status: product.status,
      })
      .eq("id", product.id)
      .select()
      .single<Product>();

    if (error) {
      console.error("Error updating product:", error);
      setError(error.message || "Failed to update product.");
    } else if (data) {
      setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
    }

    setEditingProduct(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    setIsDeleting(true);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", deletingProduct.id);

    if (error) {
      console.error("Error deleting product:", error);
      setError(error.message || "Failed to delete product.");
    } else {
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    }

    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
  };

  const openDeleteModal = (product: Product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-1">
            Manage your product catalog, track inventory, and update listings.
          </p>
        </div>
        <Button onClick={() => { setAddModalKey((k) => k + 1); setIsAddModalOpen(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/20 bg-danger/5 p-3 text-sm text-danger">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </p>
      </div>

      <ProductTable
        products={filteredProducts}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <ProductFormModal
        key={`add-${addModalKey}`}
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSubmit={handleAddProduct}
        mode="add"
      />

      <ProductFormModal
        key={editingProduct?.id || "edit"}
        open={!!editingProduct}
        onOpenChange={(open) => {
          if (!open) setEditingProduct(null);
        }}
        onSubmit={handleEditProduct}
        product={editingProduct}
        mode="edit"
      />

      <DeleteProductModal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        product={deletingProduct}
        onConfirm={handleDeleteConfirm}
        deleting={isDeleting}
      />
    </div>
  );
}
