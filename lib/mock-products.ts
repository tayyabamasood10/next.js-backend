export interface Product {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  status: "active" | "draft" | "archived";
  created_at: string;
  updated_at: string;
}

export const productStatusConfig: Record<Product["status"], { label: string; className: string }> = {
  active: { label: "Active", className: "bg-success/10 text-success" },
  draft: { label: "Draft", className: "bg-warning/10 text-warning" },
  archived: { label: "Archived", className: "bg-muted text-muted-foreground" },
};
