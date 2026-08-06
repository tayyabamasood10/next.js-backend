"use client";

import { useState, useEffect } from "react";
import { Search, Bell, ChevronRight, Calendar, ChevronDown, Sparkles, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/components/ui/cn";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavbarProps {
  breadcrumb?: { label: string; href?: string }[];
}

export function Navbar({ breadcrumb }: NavbarProps) {
  const router = useRouter();
  const [searchFocused, setSearchFocused] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userInitials, setUserInitials] = useState("JD");

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "User";
        const email = user.email || "";
        setUserName(fullName);
        setUserEmail(email);
        setUserInitials(fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase());
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || "User";
        const email = session.user.email || "";
        setUserName(fullName);
        setUserEmail(email);
        setUserInitials(fullName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase());
      } else {
        setUserName("");
        setUserEmail("");
        setUserInitials("JD");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header
      data-slot="navbar"
      className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border px-4 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {breadcrumb && breadcrumb.length > 0 && (
            <>
              {breadcrumb.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  {index > 0 && (
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      index === breadcrumb.length - 1
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2 py-1.5">
          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Last 30 days</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </div>

        <div
          className={cn(
            "relative transition-all duration-200",
            searchFocused ? "w-64" : "w-40"
          )}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 h-9"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Acme Inc</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
              Acme Inc
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
              Personal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-danger">
            <span className="sr-only">Notifications</span>
          </span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName || "User"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail || "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
