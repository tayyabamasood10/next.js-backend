"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single<Profile>();

      if (error) {
        console.error("Error fetching profile:", error);
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name || "",
          business_name: "",
          email: user.email || "",
          created_at: user.created_at || new Date().toISOString(),
        });
      } else if (data) {
        setProfile(data);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [supabase]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setBusinessName(profile.business_name || "");
      setEmail(profile.email || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to update your profile.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: fullName,
        business_name: businessName,
        email: email,
      })
      .select()
      .single<Profile>();

    if (error) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile. Please try again.");
      setSaving(false);
    } else {
      setSuccess("Profile updated successfully!");
      setSaving(false);
    }
  };

  const initials = (fullName || "User")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          View and update your account information.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-semibold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{fullName || "User"}</h2>
            <p className="text-sm text-muted-foreground">{email}</p>
            {businessName && (
              <p className="text-sm text-muted-foreground">{businessName}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="businessName" className="text-sm font-medium">
                Business Name
              </label>
              <Input
                id="businessName"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={saving}
              />
            </div>

            <div className="rounded-lg bg-accent/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">Member Since</p>
              <p className="mt-1 text-sm font-medium">
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
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

          <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
