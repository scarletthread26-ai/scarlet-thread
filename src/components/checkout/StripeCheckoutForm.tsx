"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

interface StripeCheckoutFormProps {
  total: number;
  currency?: string;
  email?: string;
  name?: string;
  phone?: string;
  postalCode?: string;
  addressLine1?: string;
  city?: string;
  state?: string;
  onPaymentSuccess: () => Promise<void>;
  isOrderPending: boolean;
}

export default function StripeCheckoutForm({
  total,
  currency = "AED",
  email,
  name,
  phone,
  postalCode,
  addressLine1,
  city,
  state,
  onPaymentSuccess,
  isOrderPending,
}: StripeCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe is not ready yet. Please wait a moment.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Submit the Elements form (triggers Stripe validation)
      const { error: submitError } = await elements.submit();
      if (submitError) {
        toast.error(submitError.message || "Payment details are invalid.");
        setIsProcessing(false);
        return;
      }

      // 2. Confirm the payment with Stripe
      // We use confirmPayment with redirect: "if_required" so we stay in SPA
      const clientSecret = elements.getElement("payment")
        ? (elements as any)._commonOptions?.clientSecret
        : null;

      // Detect billing country code (e.g., IN for Indian addresses/phone numbers, fallback to AE)
      let countryCode = "AE";
      if (
        (postalCode && /^\d{6}$/.test(postalCode)) ||
        (phone && (phone.startsWith("+91") || phone.startsWith("91")))
      ) {
        countryCode = "IN";
      }

      // Retrieve the client_secret from the PaymentElement meta
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          // Stripe will redirect here for 3DS etc. — we handle success in return_url
          return_url: `${window.location.origin}/checkout/success`,
          payment_method_data: {
            billing_details: {
              name: name || undefined,
              email: email || undefined,
              phone: phone || undefined,
              address: {
                country: countryCode,
                postal_code: postalCode || "00000",
                line1: addressLine1 || "Main Street",
                city: city || "Dubai",
                state: state || "Dubai",
              },
            },
          },
        },
        redirect: "if_required",
      });

      if (confirmError) {
        toast.error(confirmError.message || "Payment failed. Please try again.");
        setIsProcessing(false);
        return;
      }

      // 3. Payment confirmed — now create the order
      await onPaymentSuccess();
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
      setIsProcessing(false);
    }
  };

  const isBusy = isProcessing || isOrderPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe's secure PaymentElement */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 p-4 shadow-sm">
        <PaymentElement
          options={{
            layout: "tabs",
            fields: {
              billingDetails: {
                address: "never",
                name: "never",
                email: "never",
                phone: "never",
              },
            },
          }}
        />
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3.5 h-3.5 text-green-600 shrink-0" />
        <span>
          Your payment is secured and encrypted by{" "}
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Stripe
          </span>
          . Card details are never stored on our servers.
        </span>
      </div>

      {/* Test hint */}
      <p className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg px-3 py-2">
        <span className="font-semibold">Test Mode:</span> Use card{" "}
        <code className="font-mono text-amber-700 dark:text-amber-400">
          4242 4242 4242 4242
        </code>{" "}
        with any future expiry and any 3-digit CVC.
      </p>

      <Button
        type="submit"
        disabled={isBusy || !stripe || !elements}
        className="rounded-full w-full font-bold shadow-md bg-primary hover:bg-primary/95 text-white gap-2 h-12 text-base"
      >
        {isBusy ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {isOrderPending ? "Creating order..." : "Processing payment..."}
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {currency} {total.toFixed(2)} Securely
          </>
        )}
      </Button>
    </form>
  );
}
