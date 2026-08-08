"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Modal, ModalHeader, ModalBody, ModalTitle, ModalClose } from "@/components/ui/modal";
import { Eye, EyeOff, Sparkles, AlertCircle, Loader2, CheckCircle2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Tab = "login" | "signup";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [signupName, setSignupName] = useState("");
  const [signupBusiness, setSignupBusiness] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const resetAll = () => {
    setTab("login");
    setIsLoading(false);
    setError("");
    setSuccess("");
    setLoginEmail("");
    setLoginPassword("");
    setShowLoginPassword(false);
    setRememberMe(false);
    setSignupName("");
    setSignupBusiness("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupConfirm("");
    setShowSignupPassword(false);
    setTermsAccepted(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetAll();
    }
    onOpenChange(newOpen);
  };

  const switchTab = (newTab: Tab) => {
    setTab(newTab);
    setError("");
    setSuccess("");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });

      console.log("Supabase login response:", { data, error });

      if (error) {
        console.error("Supabase login error:", error);

        if (error.message.includes("Invalid login credentials")) {
          setError("Invalid email or password. If you just signed up, please check your email to verify your account before logging in.");
        } else {
          setError(error.message || "Failed to sign in. Please try again.");
        }
        setIsLoading(false);
      } else if (data.session) {
        resetAll();
        onOpenChange(false);
        onSuccess?.();
      } else {
        setError("Login failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login exception:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!signupName || !signupBusiness || !signupEmail || !signupPassword || !signupConfirm) {
      setError("Please fill in all fields.");
      return;
    }

    if (signupPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (signupPassword !== signupConfirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the terms and conditions.");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail.trim().toLowerCase(),
        password: signupPassword,
        options: {
          data: {
            full_name: signupName,
            business_name: signupBusiness,
          },
        },
      });

      console.log("Supabase signup response:", { data, error });

      if (error) {
        console.error("Supabase signup error:", error);

        if (error.message.includes("already registered") || error.message.includes("already exists") || error.status === 422) {
          setError("This email is already registered. Please use a different email or sign in.");
        } else {
          setError(error.message || "Failed to create account. Please try again.");
        }
        setIsLoading(false);
      } else if (data.user && data.session) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: signupName,
          business_name: signupBusiness,
          email: signupEmail.trim().toLowerCase(),
        });
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          resetAll();
          onOpenChange(false);
          onSuccess?.();
        }, 1000);
      } else if (data.user && !data.session) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: signupName,
          business_name: signupBusiness,
          email: signupEmail.trim().toLowerCase(),
        });
        setSuccess("Account created! Please check your email to verify your account before logging in.");
        setLoginEmail(signupEmail);
        setSignupName("");
        setSignupBusiness("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirm("");
        setTermsAccepted(false);
        setShowSignupPassword(false);
        setIsLoading(false);
        setTab("login");
      } else {
        setError("Signup failed. Please try again.");
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Signup exception:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onOpenChange={handleOpenChange}>
      <div className="w-full max-w-md">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <ModalTitle className="text-lg font-semibold">
                {tab === "login" ? "Welcome back" : "Create account"}
              </ModalTitle>
              <p className="text-xs text-muted-foreground">
                {tab === "login"
                  ? "Sign in to your AI Revenue Recovery account"
                  : "Start your 14-day free trial"}
              </p>
            </div>
          </div>
          <ModalClose asChild>
            <button
              type="button"
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </ModalClose>
        </ModalHeader>

        <ModalBody>
          <div className="flex items-center gap-1 rounded-xl bg-accent/60 p-1 mb-6">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                tab === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => switchTab("signup")}
              className={cn(
                "flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200",
                tab === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Create Account
            </button>
          </div>

          {(error || success) && (
            <div
              className={cn(
                "flex items-center gap-2 rounded-xl p-3 text-sm",
                error
                  ? "bg-danger/5 border border-danger/20 text-danger"
                  : "bg-success/5 border border-success/20 text-success"
              )}
            >
              {error ? (
                <AlertCircle className="h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              )}
              <span>{error || success}</span>
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="login-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="login-password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showLoginPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              <Button type="submit" className="w-full h-11 rounded-[14px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="signup-name" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="John Doe"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-business" className="text-sm font-medium">
                  Business Name
                </label>
                <Input
                  id="signup-business"
                  type="text"
                  placeholder="Acme Inc"
                  value={signupBusiness}
                  onChange={(e) => setSignupBusiness(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showSignupPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="signup-confirm" className="text-sm font-medium">
                  Confirm Password
                </label>
                <Input
                  id="signup-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={signupConfirm}
                  onChange={(e) => setSignupConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  disabled={isLoading}
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-tight">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button type="submit" className="w-full h-11 rounded-[14px]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              {tab === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("signup")}
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className="font-medium text-primary hover:underline"
                  >
                    Login
                  </button>
                </>
              )}
            </p>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
