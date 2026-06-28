"use client";

import React, { useState, useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { 
  Settings, 
  Globe, 
  CreditCard, 
  MessageSquare, 
  Truck, 
  Save,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "payment" | "whatsapp" | "shipping">("general");
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();

  // Local form states
  const [storeName, setStoreName] = useState("");
  const [storeEmail, setStoreEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappTemplate, setWhatsappTemplate] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [freeShippingMin, setFreeShippingMin] = useState("");
  const [stripePublicKey, setStripePublicKey] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");

  useEffect(() => {
    if (settings) {
      setStoreName(settings.store_name || "");
      setStoreEmail(settings.store_email || "");
      setWhatsappNumber(settings.whatsapp_number || "");
      setWhatsappTemplate(settings.whatsapp_template || "");
      setSeoTitle(settings.seo_title || "");
      setSeoDescription(settings.seo_description || "");
      setFreeShippingMin(settings.free_shipping_min?.toString() || "");
      setStripePublicKey(settings.stripe_public_key || "");
      setStripeSecretKey(settings.stripe_secret_key || "");
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsMutation.mutateAsync({
        store_name: storeName,
        store_email: storeEmail,
        whatsapp_number: whatsappNumber,
        whatsapp_template: whatsappTemplate,
        seo_title: seoTitle,
        seo_description: seoDescription,
        free_shipping_min: Number(freeShippingMin) || 0,
        stripe_public_key: stripePublicKey,
        stripe_secret_key: stripeSecretKey,
        currency: "AED" // fixed currency per requirement
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin rounded-full h-8 w-8 text-purple-650" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Settings className="w-7 h-7 text-purple-650" />
            Global Configurations
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure metadata, payment sandbox endpoints, and default storefront parameters in AED.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={updateSettingsMutation.isPending}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition"
        >
          {updateSettingsMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("general")}
          className={cn(
            "pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5",
            activeTab === "general" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          )}
        >
          General Settings
          {activeTab === "general" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("seo")}
          className={cn(
            "pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5",
            activeTab === "seo" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <Globe className="w-4 h-4" /> Search SEO
          {activeTab === "seo" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("payment")}
          className={cn(
            "pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5",
            activeTab === "payment" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <CreditCard className="w-4 h-4" /> Stripe Gateway
          {activeTab === "payment" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={cn(
            "pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5",
            activeTab === "whatsapp" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Link
          {activeTab === "whatsapp" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("shipping")}
          className={cn(
            "pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5",
            activeTab === "shipping" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          )}
        >
          <Truck className="w-4 h-4" /> Defaults
          {activeTab === "shipping" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
      </div>

      <div className="pt-2">
        <form onSubmit={handleSave}>
          {activeTab === "general" && (
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="storeName" className="font-bold text-slate-700 dark:text-slate-350">Store Brand Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="storeEmail" className="font-bold text-slate-700 dark:text-slate-350">Support Email Address</Label>
                  <Input
                    id="storeEmail"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5 max-w-xs">
                <Label className="font-bold text-slate-700 dark:text-slate-350">Store Currency</Label>
                <Input
                  value="AED (UAE Dirham)"
                  disabled
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-semibold"
                />
              </div>
            </Card>
          )}

          {activeTab === "seo" && (
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="space-y-1.5">
                <Label htmlFor="seoTitle" className="font-bold text-slate-700 dark:text-slate-350">SEO Title Meta tag</Label>
                <Input
                  id="seoTitle"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seoDesc" className="font-bold text-slate-700 dark:text-slate-350">SEO Description Meta tag</Label>
                <Input
                  id="seoDesc"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
            </Card>
          )}

          {activeTab === "payment" && (
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="stripePub" className="font-bold text-slate-700 dark:text-slate-350">Stripe Publishable Key</Label>
                  <Input
                    id="stripePub"
                    type="password"
                    placeholder="pk_test_..."
                    value={stripePublicKey}
                    onChange={(e) => setStripePublicKey(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="stripeSec" className="font-bold text-slate-700 dark:text-slate-350">Stripe Secret Key</Label>
                  <Input
                    id="stripeSec"
                    type="password"
                    placeholder="sk_test_..."
                    value={stripeSecretKey}
                    onChange={(e) => setStripeSecretKey(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "whatsapp" && (
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="waPhone" className="font-bold text-slate-700 dark:text-slate-350">Contact WhatsApp Number</Label>
                  <Input
                    id="waPhone"
                    placeholder="e.g. +971501234567"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="waTemp" className="font-bold text-slate-700 dark:text-slate-350">Custom Message Template</Label>
                  <Input
                    id="waTemp"
                    value={whatsappTemplate}
                    onChange={(e) => setWhatsappTemplate(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === "shipping" && (
            <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850 p-6 space-y-4 bg-white dark:bg-slate-900 shadow-sm">
              <div className="space-y-1.5 max-w-sm">
                <Label htmlFor="minFree" className="font-bold text-slate-700 dark:text-slate-350">Default Free Shipping Minimum (AED)</Label>
                <Input
                  id="minFree"
                  type="number"
                  placeholder="e.g. 150"
                  value={freeShippingMin}
                  onChange={(e) => setFreeShippingMin(e.target.value)}
                  className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                />
              </div>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
}
