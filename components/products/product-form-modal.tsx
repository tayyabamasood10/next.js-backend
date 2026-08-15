"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/cn";
import { Product, productStatusConfig } from "@/lib/mock-products";

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  status: Product["status"];
}

interface ProductFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (product: ProductFormData) => void;
  product?: Product | null;
  mode: "add" | "edit";
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  status?: string;
}

export function ProductFormModal({ open, onOpenChange, onSubmit, product, mode }: ProductFormModalProps) {
  const initialName = product?.name || "";
  const initialDescription = product?.description || "";
  const initialPrice = product?.price.toString() || "";
  const initialStock = product?.stock.toString() || "";
  const initialImageUrl = product?.image_url || "";
  const initialStatus = product?.status || "active";

  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [price, setPrice] = useState(initialPrice);
  const [stock, setStock] = useState(initialStock);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [status, setStatus] = useState<Product["status"]>(initialStatus);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) {
      newErrors.name = "Product name is required.";
    }
    if (!price || isNaN(Number(price)) || Number(price) < 0) {
      newErrors.price = "Enter a valid positive price.";
    }
    if (stock === "" || isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "Enter a valid stock quantity.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 400));

    onSubmit({
      id: product?.id,
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      stock: Number(stock),
      image_url: imageUrl.trim(),
      status,
    });

    setSubmitting(false);
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalHeader>
        <div>
          <ModalTitle>{mode === "add" ? "Add Product" : "Edit Product"}</ModalTitle>
          <ModalDescription>
            {mode === "add" ? "Add a new product to your catalog." : "Update product details below."}
          </ModalDescription>
        </div>
      </ModalHeader>
      <form onSubmit={handleSubmit}>
        <ModalBody>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="product-name" className="text-sm font-medium">
                Product Name <span className="text-danger">*</span>
              </label>
              <Input
                id="product-name"
                type="text"
                placeholder="e.g. Wireless Headphones"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(errors.name && "border-destructive focus-visible:border-destructive")}
              />
              {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="product-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="product-description"
                placeholder="Brief product description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="product-price" className="text-sm font-medium">
                  Price <span className="text-danger">*</span>
                </label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={cn(errors.price && "border-destructive focus-visible:border-destructive")}
                />
                {errors.price && <p className="text-xs text-danger">{errors.price}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="product-stock" className="text-sm font-medium">
                  Stock <span className="text-danger">*</span>
                </label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className={cn(errors.stock && "border-destructive focus-visible:border-destructive")}
                />
                {errors.stock && <p className="text-xs text-danger">{errors.stock}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="product-image" className="text-sm font-medium">
                Image URL
              </label>
              <Input
                id="product-image"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="product-status" className="text-sm font-medium">
                Status
              </label>
              <select
                id="product-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Product["status"])}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              >
                {Object.entries(productStatusConfig).map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {mode === "add" ? "Adding..." : "Saving..."}
              </>
            ) : mode === "add" ? (
              "Add Product"
            ) : (
              "Save Changes"
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
