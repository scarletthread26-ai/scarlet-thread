"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, User, Phone, Mail } from "lucide-react";

export default function CustomerProfilePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();
        if (prof) {
          setProfile(prof);
          setFullName(prof.full_name || "");
          setPhone(prof.phone || "");
        }
      }
    }
    loadProfile();
  }, []);

  const isChanged = profile && (
    fullName.trim() !== (profile.full_name || "") || 
    phone.trim() !== (profile.phone || "")
  );

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Session expired. Please log in again.");

      const updatedFields = {
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("users")
        .update(updatedFields)
        .eq("id", user.id);

      if (error) throw error;
      
      setProfile((prev: any) => ({
        ...prev,
        ...updatedFields
      }));
      
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Edit Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Keep your contact information up to date to ensure proper shipping notifications.
        </p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-sm">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Full Name *
                </Label>
                <Input
                  id="fullName"
                  required
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-lg border-slate-300"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Contact
                </Label>
                <Input
                  id="phone"
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border-slate-300"
                />
              </div>
            </div>

            {isChanged && (
              <Button type="submit" disabled={loading} className="rounded-lg font-bold shadow bg-primary hover:bg-primary/95 text-white gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving Changes...
                  </>
                ) : (
                  "Save Profile Changes"
                )}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
