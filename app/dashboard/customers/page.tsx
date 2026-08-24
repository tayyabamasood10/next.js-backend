"use client";

import { useState, useMemo } from "react";
import { Users, Search, Phone, Mail, Calendar, DollarSign, ShoppingCart, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { useOrders } from "@/context/order-context";
import { Order } from "@/types/store";

interface Customer {
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  orders: Order[];
}

export default function CustomersPage() {
  const { orders, loading } = useOrders();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
      const email = order.customer.email.toLowerCase();
      const existing = customerMap.get(email);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.status !== "cancelled" && order.status !== "refunded" ? order.total : 0;
        if (new Date(order.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = order.createdAt;
        }
        existing.orders.push(order);
      } else {
        customerMap.set(email, {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone || "",
          totalOrders: 1,
          totalSpent: order.status !== "cancelled" && order.status !== "refunded" ? order.total : 0,
          lastOrderDate: order.createdAt,
          orders: [order],
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime());
  }, [orders]);

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
    );
  }, [customers, searchQuery]);

  const totalCustomers = customers.length;
  const totalRevenue = useMemo(
    () => customers.reduce((sum, c) => sum + c.totalSpent, 0),
    [customers]
  );
  const avgOrdersPerCustomer = totalCustomers > 0 ? orders.length / totalCustomers : 0;

  const handleViewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-lg bg-accent animate-pulse" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[18px] border border-border bg-card p-6 space-y-3">
              <div className="h-4 w-24 rounded bg-accent animate-pulse" />
              <div className="h-8 w-32 rounded bg-accent animate-pulse" />
            </div>
          ))}
        </div>
        <div className="rounded-[18px] border border-border bg-card p-6 space-y-4">
          <div className="h-6 w-40 rounded bg-accent animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 w-full rounded-xl bg-accent animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view all customer records from your store orders.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-2xl">{totalCustomers.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              Unique emails
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="h-3.5 w-3.5" />
              From valid orders
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Orders</CardDescription>
            <CardTitle className="text-2xl">{orders.length.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ShoppingCart className="h-3.5 w-3.5" />
              All orders
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Avg Orders/Customer</CardDescription>
            <CardTitle className="text-2xl">{avgOrdersPerCustomer.toFixed(1)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3.5 w-3.5" />
              Per customer
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Showing {filteredCustomers.length} of {totalCustomers} customers</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or phone..."
                className="pl-9 w-full sm:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">No customers yet</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">
                When customers place orders from your store, they will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.email}
                  className="flex items-center justify-between rounded-xl border border-border p-4 hover:bg-accent/30 transition-colors cursor-pointer"
                  onClick={() => handleViewCustomer(customer)}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                        {customer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                    </Avatar>
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" />
                        {customer.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-medium">{customer.totalOrders} orders</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(customer.totalSpent)} spent</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(customer.lastOrderDate)}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal open={modalOpen} onOpenChange={setModalOpen}>
        <ModalHeader>
          <ModalTitle>Customer Details</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                    {selectedCustomer.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCustomer.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedCustomer.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Orders</p>
                  <p className="text-lg font-bold">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="rounded-xl bg-accent/50 p-3">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="text-lg font-bold">{formatCurrency(selectedCustomer.totalSpent)}</p>
                </div>
              </div>

              {selectedCustomer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCustomer.phone}</span>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Order History</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedCustomer.orders
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((order) => (
                      <div key={order.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                        <div>
                          <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                          <Badge variant="outline" className={`text-xs ${
                            order.status === "delivered" ? "bg-success/10 text-success border-success/20" :
                            order.status === "cancelled" ? "bg-danger/10 text-danger border-danger/20" :
                            order.status === "refunded" ? "bg-warning/10 text-warning border-warning/20" :
                            "bg-info/10 text-info border-info/20"
                          }`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" onClick={() => setModalOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
