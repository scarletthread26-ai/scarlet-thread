"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPin, Plus, Edit, Trash2, CheckCircle, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserAddress {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  emirate: string;
  postal_code: string | null;
  country: string;
  is_default: boolean;
}

const LABEL_OPTIONS = ["Home", "Office", "Other"];
const UAE_EMIRATES = [
  "Abu Dhabi", "Dubai", "Sharjah", "Ajman",
  "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
];

const emptyForm = {
  label: "Home",
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  emirate: "Dubai",
  postal_code: "",
  country: "United Arab Emirates",
  is_default: false,
};

export default function AccountAddresses() {
  const supabase = createClient();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<UserAddress | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        fetchAddresses(user.id);
      }
    };
    init();
  }, []);

  const fetchAddresses = async (uid?: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", uid ?? userId!)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) toast.error("Could not load addresses");
    else setAddresses(data as UserAddress[]);
    setLoading(false);
  };

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (addr: UserAddress) => {
    setEditing(addr);
    setForm({
      label: addr.label,
      full_name: addr.full_name,
      phone: addr.phone,
      address_line1: addr.address_line1,
      address_line2: addr.address_line2 ?? "",
      city: addr.city,
      emirate: addr.emirate,
      postal_code: addr.postal_code ?? "",
      country: addr.country,
      is_default: addr.is_default,
    });
    setModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setSaving(true);

    const payload = {
      ...form,
      user_id: userId,
      address_line2: form.address_line2 || null,
      postal_code: form.postal_code || null,
    };

    // If setting as default, clear previous defaults first
    if (form.is_default) {
      await supabase
        .from("user_addresses")
        .update({ is_default: false })
        .eq("user_id", userId);
    }

    const result = editing
      ? await supabase.from("user_addresses").update(payload).eq("id", editing.id)
      : await supabase.from("user_addresses").insert(payload);

    if (result.error) {
      toast.error(result.error.message);
    } else {
      toast.success(editing ? "Address updated!" : "Address saved!");
      setModalOpen(false);
      fetchAddresses();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("user_addresses").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Address removed");
      fetchAddresses();
    }
  };

  const setDefault = async (addr: UserAddress) => {
    if (!userId) return;
    // Clear all defaults, then set this one
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId);
    const { error } = await supabase
      .from("user_addresses")
      .update({ is_default: true })
      .eq("id", addr.id);
    if (error) toast.error(error.message);
    else {
      toast.success(`"${addr.label}" set as default`);
      fetchAddresses();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
            Saved Addresses
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery addresses for a faster checkout experience.
          </p>
        </div>
        {!loading && addresses.length > 0 && (
          <Button onClick={openAdd} className="flex items-center gap-2 rounded-xl">
            <Plus className="w-4 h-4" /> Add Address
          </Button>
        )}
      </div>

      {/* Address Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="text-center py-12 border border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl w-full">
          <div className="w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-4">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No addresses saved yet</h3>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6 max-w-xs mx-auto leading-relaxed">
            Save your delivery details now for a 3x faster and smoother checkout experience.
          </p>
          <div className="flex justify-center">
            <Button onClick={openAdd} className="rounded-xl px-5 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Your First Address
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className={`relative rounded-2xl transition ${
                addr.is_default
                  ? "border-primary/40 bg-primary/5 shadow-sm"
                  : "border-slate-200/60 dark:border-slate-800"
              }`}
            >
              {addr.is_default && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Default
                </div>
              )}
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  {addr.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-slate-600 dark:text-slate-400 pb-4">
                <p className="font-semibold text-slate-800 dark:text-slate-200">{addr.full_name}</p>
                <p>{addr.phone}</p>
                <p className="leading-relaxed">
                  {addr.address_line1}
                  {addr.address_line2 ? `, ${addr.address_line2}` : ""}
                </p>
                <p>
                  {addr.city}, {addr.emirate}
                  {addr.postal_code ? ` ${addr.postal_code}` : ""}
                </p>
                <p>{addr.country}</p>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEdit(addr)}
                    className="rounded-lg text-xs h-7 px-3"
                  >
                    <Edit className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(addr.id)}
                    className="rounded-lg text-xs h-7 px-3 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                  {!addr.is_default && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDefault(addr)}
                      className="rounded-lg text-xs h-7 px-3 text-primary hover:bg-primary/5"
                    >
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Address" : "Add New Address"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-5 mt-2">
            {/* Label */}
            <div className="space-y-2">
              <Label className="text-slate-500 font-semibold text-xs uppercase tracking-wider">Address Label</Label>
              <div className="flex gap-2">
                {LABEL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm((p) => ({ ...p, label: opt }))}
                    className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${
                      form.label === opt
                        ? "bg-primary text-white border-primary"
                        : "border-slate-200 text-slate-600 hover:border-primary"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="font-semibold text-slate-700 dark:text-slate-300">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  required
                  placeholder="John Doe"
                  value={form.full_name}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="font-semibold text-slate-700 dark:text-slate-300">Phone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  value={form.phone}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address_line1" className="font-semibold text-slate-700 dark:text-slate-300">Address Line 1 *</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  required
                  placeholder="Villa / Flat No., Building Name, Street"
                  value={form.address_line1}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address_line2" className="font-semibold text-slate-700 dark:text-slate-300">Address Line 2 (Optional)</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  placeholder="Area, Landmark"
                  value={form.address_line2}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <Label htmlFor="city" className="font-semibold text-slate-700 dark:text-slate-300">City / Area *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  placeholder="Dubai Marina"
                  value={form.city}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* Emirate */}
              <div className="space-y-1.5">
                <Label htmlFor="emirate" className="font-semibold text-slate-700 dark:text-slate-300">Emirate *</Label>
                <Select
                  value={form.emirate}
                  onValueChange={(val) => setForm((p) => ({ ...p, emirate: val ?? "" }))}
                >
                  <SelectTrigger id="emirate" className="w-full h-10 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 pr-3">
                    <SelectValue placeholder="Select Emirate" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl rounded-xl">
                    {UAE_EMIRATES.map((e) => (
                      <SelectItem key={e} value={e}>
                        {e}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <Label htmlFor="postal_code" className="font-semibold text-slate-700 dark:text-slate-300">Postal Code (Optional)</Label>
                <Input
                  id="postal_code"
                  name="postal_code"
                  placeholder="e.g. 00000"
                  value={form.postal_code}
                  onChange={handleChange}
                  className="rounded-lg"
                />
              </div>

              {/* Country */}
              <div className="space-y-1.5">
                <Label htmlFor="country" className="font-semibold text-slate-700 dark:text-slate-300">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  readOnly
                  className="bg-slate-50 text-slate-500 cursor-not-allowed rounded-lg"
                />
              </div>
            </div>

            {/* Default checkbox */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is_default"
                name="is_default"
                checked={form.is_default}
                onChange={handleChange}
                className="rounded border-slate-300 text-primary w-4 h-4 cursor-pointer"
              />
              <Label htmlFor="is_default" className="mb-0 cursor-pointer text-slate-600 dark:text-slate-400">
                Set as my default address
              </Label>
            </div>

            <Button type="submit" disabled={saving} className="w-full rounded-xl py-2.5">
              {saving ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
              ) : (
                editing ? "Update Address" : "Save Address"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
