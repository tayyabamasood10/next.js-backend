"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  Sparkles,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/components/ui/cn";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/revenue", label: "Revenue", icon: DollarSign },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/orders", label: "Orders", icon: ShoppingCart },
  { href: "/dashboard/products", label: "Products", icon: Package },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/problems", label: "Revenue Problems", icon: AlertTriangle },
  { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-semibold text-sm tracking-tight">
              AI Revenue Recovery
            </span>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <Separator />

      <nav className="flex-1 overflow-y-auto p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 relative",
                      collapsed ? "justify-center" : "",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <span className="flex items-center gap-2">
                        {item.label}
                        {item.label === "Revenue Problems" && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold rounded-full">
                            3
                          </Badge>
                        )}
                      </span>
                    )}
                    {collapsed && item.label === "Revenue Problems" && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-primary-foreground">
                        3
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </nav>

      <Separator />

      <div className="p-2">
        <div className={cn("rounded-xl bg-accent/50 p-3", collapsed && "p-2")}>
          {!collapsed && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-foreground">Pro Plan</p>
              <p className="text-xs text-muted-foreground">
                Upgrade for more insights
              </p>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </div>
      </div>
    </aside>
  );
}
