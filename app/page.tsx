"use client";

import { useEffect, useState } from "react";
import { useSyncExternalStore } from "react";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FeaturesGrid } from "@/components/landing/features-grid";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { FAQSection } from "@/components/landing/faq";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/footer";
import { AuthModal } from "@/components/landing/auth-modal";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function useQueryString() {
  const getSnapshot = () => {
    if (typeof window === "undefined") return "";
    return window.location.search;
  };

  const getServerSnapshot = () => "";

  const subscribe = (callback: () => void) => {
    window.addEventListener("popstate", callback);
    return () => window.removeEventListener("popstate", callback);
  };

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function LandingPage() {
  const router = useRouter();
  const queryString = useQueryString();
  const [loginModalOpen, setLoginModalOpen] = useState(() => queryString.includes("modal=login"));
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.push("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLoginSuccess = () => {
    window.location.href = "/dashboard";
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar onLoginClick={() => setLoginModalOpen(true)} />
      <main>
        <HeroSection onLoginClick={() => setLoginModalOpen(true)} />
        <ProblemSection />
        <HowItWorks />
        <FeaturesGrid />
        <DashboardPreview />
        <FAQSection />
        <CTASection onLoginClick={() => setLoginModalOpen(true)} />
      </main>
      <LandingFooter />
      <AuthModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}
