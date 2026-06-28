"use client";

import React, { useState } from "react";
import { 
  BellRing, 
  MessageSquare, 
  Mail, 
  Save, 
  Sparkles,
  Phone,
  Layout
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminNotificationsPage() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");
  
  // WhatsApp States
  const [waConfirmation, setWaConfirmation] = useState("Hello {customer_name}, thank you for your order {order_number} at Scarlet Thread! We are preparing your handcrafted gift.");
  const [waShipping, setWaShipping] = useState("Hi {customer_name}, your order {order_number} has been shipped via {carrier}! Track it here: {tracking_link}");
  const [waNumber, setWaNumber] = useState("+971501234567");

  // Email States
  const [emailSubject, setEmailSubject] = useState("Your Scarlet Thread Order Confirmation - {order_number}");
  const [emailBody, setEmailBody] = useState("Dear {customer_name},\n\nThank you for choosing Scarlet Thread. Your order {order_number} of {total_amount} AED has been confirmed.\n\nWarm regards,\nScarlet Thread Team");

  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Notification templates updated successfully!");
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BellRing className="w-7 h-7 text-purple-650" />
            Notification Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure automated WhatsApp templates and email notification subjects.
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md flex items-center gap-2 shrink-0 font-bold px-4 py-2 text-sm transition"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
        <button
          onClick={() => setActiveTab("whatsapp")}
          className={`pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5 ${
            activeTab === "whatsapp" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Templates
          {activeTab === "whatsapp" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
        <button
          onClick={() => setActiveTab("email")}
          className={`pb-3 text-sm font-bold capitalize transition relative flex items-center gap-1.5 ${
            activeTab === "email" ? "text-purple-600 dark:text-purple-400" : "text-slate-400 hover:text-slate-650"
          }`}
        >
          <Mail className="w-4 h-4" /> Email Templates
          {activeTab === "email" && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 rounded-full" />}
        </button>
      </div>

      <div className="pt-2">
        {activeTab === "whatsapp" ? (
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6">
            <div>
              <h3 className="font-bold text-slate-850 dark:text-slate-250 flex items-center gap-1 text-sm mb-4">
                <Phone className="w-4 h-4 text-purple-650" />
                WhatsApp Business Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="waNum" className="font-bold text-slate-700 dark:text-slate-350">Default Business Phone Number</Label>
                  <Input
                    id="waNum"
                    placeholder="e.g. +971501234567"
                    value={waNumber}
                    onChange={(e) => setWaNumber(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800" />

            <div className="space-y-4">
              <h3 className="font-bold text-slate-850 dark:text-slate-250 flex items-center gap-1 text-sm">
                <Layout className="w-4 h-4 text-purple-650" />
                Message Dispatch Templates
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="confirmWa" className="font-semibold text-slate-700 dark:text-slate-350">Order Placement Confirmation</Label>
                  <Textarea
                    id="confirmWa"
                    value={waConfirmation}
                    onChange={(e) => setWaConfirmation(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white min-h-[72px]"
                  />
                  <p className="text-[10px] text-slate-400">Available tokens: <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{customer_name}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{order_number}`}</code></p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shipWa" className="font-semibold text-slate-700 dark:text-slate-350">Order Dispatch / Shipment Notice</Label>
                  <Textarea
                    id="shipWa"
                    value={waShipping}
                    onChange={(e) => setWaShipping(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white min-h-[72px]"
                  />
                  <p className="text-[10px] text-slate-400">Available tokens: <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{customer_name}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{order_number}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{carrier}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{tracking_link}`}</code></p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="rounded-2xl border-slate-200/60 dark:border-slate-850/80 bg-white dark:bg-slate-900 shadow-sm p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-850 dark:text-slate-250 flex items-center gap-1.5 text-sm">
                <Mail className="w-4 h-4 text-purple-650" />
                Transactional Email Layouts
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="emailSub" className="font-semibold text-slate-700 dark:text-slate-350">Confirmation Email Subject Line</Label>
                  <Input
                    id="emailSub"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white"
                  />
                  <p className="text-[10px] text-slate-400">Available tokens: <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{order_number}`}</code></p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="emailBodyText" className="font-semibold text-slate-700 dark:text-slate-350">Confirmation Email Body</Label>
                  <Textarea
                    id="emailBodyText"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="rounded-xl border-slate-200 dark:border-slate-800 bg-white min-h-[150px]"
                  />
                  <p className="text-[10px] text-slate-400">Available tokens: <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{customer_name}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{order_number}`}</code>, <code className="font-mono bg-slate-50 dark:bg-slate-950 px-1 py-0.5 rounded">{`{total_amount}`}</code></p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
