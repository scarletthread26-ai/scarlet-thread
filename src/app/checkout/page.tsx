"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useCreateOrder } from "@/hooks/use-orders";
import { useCalculateShipping } from "@/hooks/use-shipping";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, CreditCard, ChevronRight, MapPin, Shield, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Stripe integration imports
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import StripeCheckoutForm from "@/components/checkout/StripeCheckoutForm";

const UAE_EMIRATES = [
  "Abu Dhabi", "Dubai", "Sharjah", "Ajman",
  "Umm Al Quwain", "Ras Al Khaimah", "Fujairah",
];

const cleanPhoneDigits = (rawPhone: string) => {
  if (!rawPhone) return "";
  let p = rawPhone.trim();
  if (p.startsWith("+971")) {
    p = p.slice(4);
  } else if (p.startsWith("971")) {
    p = p.slice(3);
  }
  return p.replace(/\D/g, "");
};

interface SavedAddress {
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

export default function CheckoutPage() {
  const router = useRouter();
  const { getTotal, items } = useCartStore();
  const createOrderMutation = useCreateOrder();

  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Shipping Address State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Dubai");
  const [state, setState] = useState("Dubai");
  const [postalCode, setPostalCode] = useState("");

  // Billing Address State
  const [billingFirstName, setBillingFirstName] = useState("");
  const [billingLastName, setBillingLastName] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("Dubai");
  const [billingState, setBillingState] = useState("Dubai");
  const [billingPostalCode, setBillingPostalCode] = useState("");

  // Stripe Gateway states
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const subtotal = getTotal();
  const { data: shippingData } = useCalculateShipping(subtotal, state, "United Arab Emirates");
  const shippingFee = shippingData ? shippingData.rate : (subtotal >= 200 ? 0 : 18);
  const total = subtotal + shippingFee;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // If cart is empty, send back to home
    if (items.length === 0) {
      toast.error("Your shopping cart is empty!");
      router.push("/");
    }
  }, [items, router]);

  useEffect(() => {
    const supabase = createClient();
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        setEmail(user.email || "");

        // Fetch user profile info
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          const parts = (profile.full_name || "").trim().split(/\s+/);
          setFirstName(parts[0] || "");
          setLastName(parts.slice(1).join(" ") || "");
          setPhone(cleanPhoneDigits(profile.phone || ""));
        }

        // Fetch saved addresses
        const { data: addrs } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false })
          .order("created_at", { ascending: true });

        if (addrs && addrs.length > 0) {
          setSavedAddresses(addrs as SavedAddress[]);
          const def = (addrs as SavedAddress[]).find((a) => a.is_default) ?? addrs[0] as SavedAddress;
          // Auto-fill form with default/first address
          applyAddress(def as SavedAddress);
          setSelectedAddressId(def.id);
        }
      }
    }
    loadUser();
  }, []);

  const applyAddress = (addr: SavedAddress) => {
    const parts = (addr.full_name || "").trim().split(/\s+/);
    setFirstName(parts[0] || "");
    setLastName(parts.slice(1).join(" ") || "");
    setPhone(cleanPhoneDigits(addr.phone));
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 ?? "");
    setCity(addr.city);
    setState(addr.emirate);
    setPostalCode(addr.postal_code ?? "");
  };

  const clearAddressFields = () => {
    setFirstName("");
    setLastName("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("Dubai");
    setState("Dubai");
    setPostalCode("");
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !firstName || !lastName || !addressLine1 || !addressLine2 || !state) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }

    setIsCreatingIntent(true);
    try {
      const response = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment gateway.");
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to initialize payment options. Please try again.");
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = async () => {
    const shippingAddress = {
      full_name: `${firstName.trim()} ${lastName.trim()}`,
      phone: `+971 ${phone.trim()}`,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city: city || state,
      state: state,
      postal_code: postalCode || "00000",
      country: "United Arab Emirates",
    };

    const billingAddress = isSameAddress
      ? shippingAddress
      : {
        full_name: `${billingFirstName.trim()} ${billingLastName.trim()}`,
        phone: `+971 ${phone.trim()}`,
        address_line1: billingAddressLine1,
        address_line2: billingAddressLine2,
        city: billingCity || billingState,
        state: billingState,
        postal_code: billingPostalCode || "00000",
        country: "United Arab Emirates",
      };

    const payload = {
      shippingAddress,
      billingAddress,
      items: items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        personalization: item.personalization || null,
      })),
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: 0,
      total_amount: total,
      payment_method: "Card",
      guest_email: isAuthenticated ? null : email,
      guest_phone: isAuthenticated ? null : `+971 ${phone.trim()}`,
      notes: notes.trim() || null,
    };

    try {
      const createdOrder = await createOrderMutation.mutateAsync(payload);

      // Clear cart
      const { clearCart } = useCartStore.getState();
      await clearCart(isAuthenticated);

      // Navigate to success page
      toast.success("Order processed successfully!");
      const contactVal = isAuthenticated ? (currentUser?.email || email) : email;
      router.push(`/checkout/success?id=${createdOrder.id}&number=${createdOrder.order_number}&contact=${encodeURIComponent(contactVal)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit order. Please try again.");
      throw err;
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex items-center gap-2 mb-8">
        <h1 className="text-3xl font-heading font-extrabold text-slate-800 dark:text-slate-100">Checkout</h1>
        <ChevronRight className="w-6 h-6 text-slate-400" />
        <span className="text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
          Step {step} of 2
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Forms Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Checkout Nav Tracker */}
          <div className="flex border rounded-2xl bg-white dark:bg-slate-900 p-4 gap-6 items-center shadow-sm">
            <button
              onClick={() => step > 1 && setStep(1)}
              className={`flex items-center text-sm font-bold gap-2 ${step === 1 ? 'text-primary' : 'text-slate-500'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step === 1 ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>1</span>
              Shipping & Customer Info
            </button>
            <div className="w-8 h-px bg-slate-300 shrink-0"></div>
            <div className={`flex items-center text-sm font-bold gap-2 ${step === 2 ? 'text-primary' : 'text-slate-400'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border text-xs ${step === 2 ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>2</span>
              Payment details
            </div>
          </div>

          {step === 1 ? (
            <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  {/* Account Information */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-primary" /> Contact Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="font-semibold text-slate-700 dark:text-slate-300">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isAuthenticated}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="font-semibold text-slate-700 dark:text-slate-300">Phone Number *</Label>
                        <div className="flex">
                          <span className="inline-flex h-12 items-center gap-1 px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 select-none">
                            <span className="text-base">🇦🇪</span>
                            <span className="font-medium">+971</span>
                          </span>
                          <Input
                            id="phone"
                            type="tel"
                            required
                            placeholder="50 XXXXXXX"
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setPhone(val.slice(0, 9));
                            }}
                            pattern="^5[024568][0-9]{7}$"
                            title="Please enter a valid UAE mobile number starting with 5 (e.g., 501234567)"
                            maxLength={9}
                            className={`h-12 rounded-r-lg rounded-l-none border-slate-300 flex-1 ${phone && !/^5[024568][0-9]{7}$/.test(phone) ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                          />
                        </div>
                        {phone && !/^5[024568][0-9]{7}$/.test(phone) && (
                          <p className="text-[11px] text-red-500 font-medium">Please enter a valid UAE mobile number (9 digits, starting with 5).</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <hr className="border-slate-100 dark:border-slate-800" />

                  {/* Saved Address Picker */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div>
                      <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" /> Saved Addresses
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                        {savedAddresses.map((addr) => (
                          <button
                            key={addr.id}
                            type="button"
                            onClick={() => {
                              if (selectedAddressId === addr.id) {
                                setSelectedAddressId(null);
                                clearAddressFields();
                              } else {
                                applyAddress(addr);
                                setSelectedAddressId(addr.id);
                              }
                            }}
                            className={`text-left p-3 border rounded-xl transition w-full ${selectedAddressId === addr.id
                                ? "border-primary bg-primary/5 ring-1 ring-primary"
                                : "border-slate-200 hover:border-slate-400"
                              }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-primary">{addr.label}</span>
                              {selectedAddressId === addr.id && (
                                <CheckCircle className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{addr.full_name}</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {addr.address_line1}
                              {addr.address_line2 ? `, ${addr.address_line2}` : ""},{" "}
                              {addr.city}, {addr.emirate}
                            </p>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mb-4">Or enter a different address below:</p>
                    </div>
                  )}

                  {/* Shipping Destination */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" /> Shipping Destination
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="font-semibold text-slate-700 dark:text-slate-300">First Name *</Label>
                        <Input
                          id="firstName"
                          required
                          placeholder="First Name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="font-semibold text-slate-700 dark:text-slate-300">Last Name *</Label>
                        <Input
                          id="lastName"
                          required
                          placeholder="Last Name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="address1" className="font-semibold text-slate-700 dark:text-slate-300">Street Address *</Label>
                        <Input
                          id="address1"
                          required
                          placeholder="Building, Street, Area, Landmark"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="address2" className="font-semibold text-slate-700 dark:text-slate-300">Apartment / Villa / Floor *</Label>
                        <Input
                          id="address2"
                          required
                          placeholder="Flat/Villa/Floor number"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="state" className="font-semibold text-slate-700 dark:text-slate-300">Delivery Emirate *</Label>
                        <Select
                          value={state}
                          onValueChange={(val) => {
                            setState(val || "");
                            setCity(val || "");
                          }}
                        >
                          <SelectTrigger id="state" className="w-full h-12 rounded-lg border border-slate-300 bg-white pr-3 text-slate-800">
                            <SelectValue placeholder="Please Select Delivery Emirate" />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                            {UAE_EMIRATES.map((e) => (
                              <SelectItem key={e} value={e}>
                                {e}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="deliveryNote" className="font-semibold text-slate-700 dark:text-slate-300">Delivery Note (Optional)</Label>
                        <Input
                          id="deliveryNote"
                          placeholder="Delivery instructions (e.g. leave at door, ring bell twice)"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="h-12 rounded-lg border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isCreatingIntent}
                    className="h-13 rounded-full w-full font-bold shadow-md bg-primary hover:bg-primary/95 text-white gap-2"
                  >
                    {isCreatingIntent ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Initializing Payment Gateway...
                      </>
                    ) : (
                      "Continue to Payment Method"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Stripe Payment
                  </h2>
                </div>

                {/* Billing address toggling */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="billingCheck"
                      checked={isSameAddress}
                      onChange={(e) => setIsSameAddress(e.target.checked)}
                      className="rounded border-slate-300 text-primary focus:ring-primary w-4.5 h-4.5"
                    />
                    <Label htmlFor="billingCheck" className="font-semibold text-slate-700 dark:text-slate-300">
                      Billing address matches shipping address
                    </Label>
                  </div>

                  {!isSameAddress && (
                    <div className="space-y-4 border p-4 rounded-xl bg-slate-50/50">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">Billing Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bFirstName">Billing First Name *</Label>
                          <Input
                            id="bFirstName"
                            required
                            placeholder="First Name"
                            value={billingFirstName}
                            onChange={(e) => setBillingFirstName(e.target.value)}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bLastName">Billing Last Name *</Label>
                          <Input
                            id="bLastName"
                            required
                            placeholder="Last Name"
                            value={billingLastName}
                            onChange={(e) => setBillingLastName(e.target.value)}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="bAddr1">Billing Street Address *</Label>
                          <Input
                            id="bAddr1"
                            required
                            placeholder="Building, Street, Area, Landmark"
                            value={billingAddressLine1}
                            onChange={(e) => setBillingAddressLine1(e.target.value)}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="bAddr2">Billing Apartment / Villa / Floor *</Label>
                          <Input
                            id="bAddr2"
                            required
                            placeholder="Flat/Villa/Floor number"
                            value={billingAddressLine2}
                            onChange={(e) => setBillingAddressLine2(e.target.value)}
                            className="bg-white border-slate-300 rounded-lg"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <Label htmlFor="bState">Billing Delivery Emirate *</Label>
                          <Select
                            value={billingState}
                            onValueChange={(val) => {
                              setBillingState(val || "");
                              setBillingCity(val || "");
                            }}
                          >
                            <SelectTrigger id="bState" className="w-full h-10 rounded-lg border border-slate-300 bg-white pr-3 text-slate-800">
                              <SelectValue placeholder="Please Select Delivery Emirate" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl">
                              {UAE_EMIRATES.map((e) => (
                                <SelectItem key={e} value={e}>
                                  {e}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-slate-100 dark:border-slate-800" />

                {clientSecret ? (
                  <Elements stripe={getStripe()} options={{ clientSecret }}>
                    <StripeCheckoutForm
                      total={total}
                      email={email}
                      name={`${firstName.trim()} ${lastName.trim()}`}
                      phone={`+971 ${phone.trim()}`}
                      postalCode={isSameAddress ? (postalCode || "00000") : (billingPostalCode || "00000")}
                      onPaymentSuccess={handlePaymentSuccess}
                      isOrderPending={createOrderMutation.isPending}
                    />
                    <div className="mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="rounded-full px-6 font-bold"
                      >
                        Back
                      </Button>
                    </div>
                  </Elements>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-slate-500">Initializing payment gateway...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md sticky top-30">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Order Summary</h2>

              {/* Product Listing */}
              <div className="space-y-4 mb-6 max-h-[340px] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 text-xs sm:text-sm">
                    <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 border border-slate-200/40 rounded-lg overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold line-clamp-1 text-slate-800 dark:text-slate-200">{item.name}</h4>
                      <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                      {item.personalization && (
                        <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">
                          {((item.personalization as any).color || (item.personalization as any).size) && (
                            <span className="block font-semibold uppercase text-[9px] text-slate-400">
                              {[(item.personalization as any).color, (item.personalization as any).size].filter(Boolean).join(" / ")}
                            </span>
                          )}
                          {item.personalization.name && (
                            <span className="text-primary font-medium italic block mt-0.5">
                              Custom: {item.personalization.name}
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">
                      AED {item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation details */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">AED {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {shippingFee === 0 ? "Free Shipping" : `AED ${shippingFee}`}
                  </span>
                </div>
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                  <span>Total Amount</span>
                  <span className="text-primary">AED {total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
