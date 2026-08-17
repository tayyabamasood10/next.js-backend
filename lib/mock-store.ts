import { Store, Order } from "@/types/store";
import { Product } from "@/lib/mock-products";

export const mockStore: Store = {
  id: "store-1",
  name: "Fatima Fashion",
  slug: "fatima-fashion",
  description: "Trendy fashion for everyone.",
  logo: "",
  heroTitle: "Welcome to Fatima Fashion",
  heroDescription: "Discover our latest collection of stylish clothing and accessories.",
  ownerId: "user-1",
};

export const storeProducts: Product[] = [
  {
    id: "prod-1",
    store_id: "store-1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation.",
    price: 79.99,
    stock: 24,
    image_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-2",
    store_id: "store-1",
    name: "Running Shoes",
    description: "Lightweight running shoes for comfort and speed.",
    price: 120.0,
    stock: 12,
    image_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "prod-3",
    store_id: "store-1",
    name: "Classic T-Shirt",
    description: "Soft cotton t-shirt with a classic fit.",
    price: 35.0,
    stock: 45,
    image_url: "",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    storeId: "store-1",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234 567 890",
      address: "123 Main St",
      city: "New York",
      postalCode: "10001",
    },
    items: [
      {
        product: {
          id: "prod-1",
          name: "Wireless Headphones",
          description: "High-quality wireless headphones with noise cancellation.",
          price: 79.99,
          image: "",
          stock: 24,
        },
        quantity: 1,
      },
    ],
    subtotal: 79.99,
    shipping: 0,
    total: 79.99,
    status: "delivered",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "ORD-002",
    storeId: "store-1",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234 567 891",
      address: "456 Oak Ave",
      city: "Los Angeles",
      postalCode: "90001",
    },
    items: [
      {
        product: {
          id: "prod-2",
          name: "Running Shoes",
          description: "Lightweight running shoes for comfort and speed.",
          price: 120.0,
          image: "",
          stock: 12,
        },
        quantity: 2,
      },
    ],
    subtotal: 240.0,
    shipping: 0,
    total: 240.0,
    status: "processing",
    createdAt: "2024-01-16T14:20:00Z",
  },
];
