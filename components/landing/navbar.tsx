"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

interface LandingNavbarProps {
  onLoginClick?: () => void;
}

export function LandingNavbar({ onLoginClick }: LandingNavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLoginClick = () => {
    setMobileOpen(false);
    onLoginClick?.();
  };

  const handleGetStarted = () => {
    setMobileOpen(false);
    onLoginClick?.();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            AI Revenue Recovery
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleLoginClick}>Login</Button>
          <Button size="sm" className="gap-1.5" onClick={handleGetStarted}>
            Get Started
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden rounded-lg p-2 text-muted-foreground hover:bg-accent"
        >
          <span className="sr-only">Toggle menu</span>
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLoginClick}>Login</Button>
              <Button size="sm" className="w-full" onClick={handleGetStarted}>Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
