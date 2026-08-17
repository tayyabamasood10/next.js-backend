"use client";

import { useState } from "react";
import { cn } from "@/components/ui/cn";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OrderSummary } from "@/components/store/order-summary";

interface CheckoutFormProps {
  items: {
    product: {
      name: string;
      price: number;
    };
    quantity: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  onSubmit: (customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  }) => void;
  submitting?: boolean;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export function CheckoutForm({ items, subtotal, shipping, total, onSubmit, submitting }: CheckoutFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!address.trim()) newErrors.address = "Address is required.";
    if (!city.trim()) newErrors.city = "City is required.";
    if (!postalCode.trim()) newErrors.postalCode = "Postal code is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name, email, phone, address, city, postalCode });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Customer Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={cn(errors.name && "border-destructive focus-visible:border-destructive")}
              />
              {errors.name && <p className="text-xs text-danger">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={cn(errors.email && "border-destructive focus-visible:border-destructive")}
              />
              {errors.email && <p className="text-xs text-danger">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={cn(errors.phone && "border-destructive focus-visible:border-destructive")}
              />
              {errors.phone && <p className="text-xs text-danger">{errors.phone}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="city" className="text-sm font-medium">City</label>
              <Input
                id="city"
                type="text"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={cn(errors.city && "border-destructive focus-visible:border-destructive")}
              />
              {errors.city && <p className="text-xs text-danger">{errors.city}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label htmlFor="address" className="text-sm font-medium">Address</label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={cn(errors.address && "border-destructive focus-visible:border-destructive")}
              />
              {errors.address && <p className="text-xs text-danger">{errors.address}</p>}
            </div>
            <div className="space-y-2">
              <label htmlFor="postalCode" className="text-sm font-medium">Postal Code</label>
              <Input
                id="postalCode"
                type="text"
                placeholder="10001"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={cn(errors.postalCode && "border-destructive focus-visible:border-destructive")}
              />
              {errors.postalCode && <p className="text-xs text-danger">{errors.postalCode}</p>}
            </div>
          </div>
        </div>
        <div>
          <OrderSummary items={items} subtotal={subtotal} shipping={shipping} total={total} />
          <Button type="submit" className="w-full mt-4" disabled={submitting}>
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </form>
  );
}
