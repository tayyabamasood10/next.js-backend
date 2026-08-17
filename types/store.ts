export interface Store {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
  heroTitle: string;
  heroDescription: string;
  ownerId: string;
}

export interface CartItem {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    stock: number;
  };
  quantity: number;
}

export interface Order {
  id: string;
  storeId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}
