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
  
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment
  const [isSameAddress, setIsSameAddress] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Shipping Address State
  const [fullName, setFullName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Billing Address State
  const [billingFullName, setBillingFullName] = useState("");
  const [billingAddressLine1, setBillingAddressLine1] = useState("");
  const [billingAddressLine2, setBillingAddressLine2] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingState, setBillingState] = useState("");
  const [billingPostalCode, setBillingPostalCode] = useState("");

  // Payment mock states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const subtotal = getTotal();
  const { data: shippingData } = useCalculateShipping(subtotal, state, "United Arab Emirates");
  const shippingFee = shippingData ? shippingData.rate : (subtotal > 150 ? 0 : 15);
  const total = subtotal + shippingFee;

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
          setFullName(profile.full_name || "");
          setPhone(profile.phone || "");
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
    setFullName(addr.full_name);
    setPhone(addr.phone);
    setAddressLine1(addr.address_line1);
    setAddressLine2(addr.address_line2 ?? "");
    setCity(addr.city);
    setState(addr.emirate);
    setPostalCode(addr.postal_code ?? "");
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !fullName || !addressLine1 || !city || !state || !postalCode) {
      toast.error("Please fill in all required shipping fields.");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 2) return;
    
    // Validate mock card details
    if (cardNumber.replace(/\s/g, "").length < 16 || cardExpiry.length < 5 || cardCvc.length < 3) {
      toast.error("Please enter valid card payment details.");
      return;
    }

    const shippingAddress = {
      full_name: fullName,
      phone: phone,
      address_line1: addressLine1,
      address_line2: addressLine2,
      city: city,
      state: state,
      postal_code: postalCode,
      country: "United Arab Emirates",
    };

    const billingAddress = isSameAddress 
      ? shippingAddress 
      : {
          full_name: billingFullName || fullName,
          phone: phone,
          address_line1: billingAddressLine1,
          address_line2: billingAddressLine2,
          city: billingCity,
          state: billingState,
          postal_code: billingPostalCode,
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
      guest_phone: isAuthenticated ? null : phone,
    };

    try {
      const createdOrder = await createOrderMutation.mutateAsync(payload);
      
      // Navigate to success page
      toast.success("Order processed successfully!");
      const contactVal = isAuthenticated ? (currentUser?.email || email) : email;
      router.push(`/checkout/success?id=${createdOrder.id}&number=${createdOrder.order_number}&contact=${encodeURIComponent(contactVal)}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit order. Please try again.");
    }
  };

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
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="font-semibold text-slate-700 dark:text-slate-300">Phone Number (with country code) *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="+971 50 123 4567"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
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
                              applyAddress(addr);
                              setSelectedAddressId(addr.id);
                            }}
                            className={`text-left p-3 border rounded-xl transition w-full ${
                              selectedAddressId === addr.id
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
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="fullName" className="font-semibold text-slate-700 dark:text-slate-300">Receiver Full Name *</Label>
                        <Input
                          id="fullName"
                          required
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="address1" className="font-semibold text-slate-700 dark:text-slate-300">Address Line 1 *</Label>
                        <Input
                          id="address1"
                          required
                          placeholder="Street name, Villa/Apartment Number"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label htmlFor="address2" className="font-semibold text-slate-700 dark:text-slate-300">Address Line 2 (Optional)</Label>
                        <Input
                          id="address2"
                          placeholder="District, Landmarks"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="font-semibold text-slate-700 dark:text-slate-300">City *</Label>
                        <Input
                          id="city"
                          required
                          placeholder="Dubai"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state" className="font-semibold text-slate-700 dark:text-slate-300">State / Emirate *</Label>
                        <Input
                          id="state"
                          required
                          placeholder="Dubai"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="postalCode" className="font-semibold text-slate-700 dark:text-slate-300">Postal Code / ZIP *</Label>
                        <Input
                          id="postalCode"
                          required
                          placeholder="00000"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          className="rounded-lg border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="rounded-full w-full font-bold shadow-md bg-primary hover:bg-primary/95 text-white">
                    Continue to Payment Method
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  {/* Payment simulation */}
                  <div>
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" /> Stripe Payment Sandbox
                    </h2>
                    <p className="text-xs text-muted-foreground mb-4">
                      Simulate checkout using sandbox keys. You can enter card number `4242 4242 4242 4242` for sandbox processing.
                    </p>
                    
                    <div className="space-y-4 border p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40">
                      <div className="space-y-1.5">
                        <Label htmlFor="cardNum" className="font-semibold">Card Number *</Label>
                        <Input
                          id="cardNum"
                          required
                          placeholder="4242 4242 4242 4242"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="rounded-lg bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="expiry" className="font-semibold">Expiry Date (MM/YY) *</Label>
                          <Input
                            id="expiry"
                            required
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="rounded-lg bg-white"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="cvc" className="font-semibold">CVC / CVV *</Label>
                          <Input
                            id="cvc"
                            required
                            type="password"
                            maxLength={3}
                            placeholder="123"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="rounded-lg bg-white"
                          />
                        </div>
                      </div>
                    </div>
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
                          <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="bFullName">Billing Full Name</Label>
                            <Input 
                              id="bFullName" 
                              placeholder="Name" 
                              value={billingFullName} 
                              onChange={(e) => setBillingFullName(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="bAddr1">Billing Address Line 1</Label>
                            <Input 
                              id="bAddr1" 
                              placeholder="Address Line 1" 
                              value={billingAddressLine1} 
                              onChange={(e) => setBillingAddressLine1(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5 md:col-span-2">
                            <Label htmlFor="bAddr2">Billing Address Line 2 (Optional)</Label>
                            <Input 
                              id="bAddr2" 
                              placeholder="Address Line 2" 
                              value={billingAddressLine2} 
                              onChange={(e) => setBillingAddressLine2(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="bCity">Billing City</Label>
                            <Input 
                              id="bCity" 
                              placeholder="City" 
                              value={billingCity} 
                              onChange={(e) => setBillingCity(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="bState">Billing State</Label>
                            <Input 
                              id="bState" 
                              placeholder="Emirate" 
                              value={billingState} 
                              onChange={(e) => setBillingState(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="bPostalCode">Billing Postal Code</Label>
                            <Input 
                              id="bPostalCode" 
                              placeholder="Postal Code" 
                              value={billingPostalCode} 
                              onChange={(e) => setBillingPostalCode(e.target.value)} 
                              className="bg-white border-slate-300"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)} 
                      className="rounded-full px-6 font-bold"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={createOrderMutation.isPending}
                      className="rounded-full flex-1 font-bold shadow-md bg-primary hover:bg-primary/95 text-white gap-2"
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                        </>
                      ) : (
                        `Pay AED ${total} Securely`
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1">
          <Card className="border-slate-200/60 dark:border-slate-800/80 rounded-2xl shadow-md sticky top-24">
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
                      {item.personalization?.name && (
                        <p className="text-xs text-primary font-medium italic mt-0.5">
                          Custom: {item.personalization.name}
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
