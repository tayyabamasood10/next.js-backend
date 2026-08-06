"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/components/ui/cn";

interface DashboardLayoutProps {
  children: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
}

export function DashboardLayout({
  children,
  breadcrumb,
}: DashboardLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border px-4 backdrop-blur-sm">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <Sidebar className="w-full border-none" />
            </SheetContent>
          </Sheet>
          <span className="font-semibold text-sm">AI Revenue Recovery</span>
          <div className="w-9" />
        </header>
      ) : (
        <Sidebar className="fixed inset-y-0 left-0 z-40" />
      )}

      <div
        className={cn(
          "flex flex-col",
          !isMobile && "pl-64"
        )}
      >
        <Navbar breadcrumb={breadcrumb} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
