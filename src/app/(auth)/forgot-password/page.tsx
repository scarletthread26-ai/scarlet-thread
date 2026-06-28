"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Mail, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        toast.error(resetError.message);
        setIsLoading(false);
        return;
      }

      setIsSubmitted(true);
      toast.success("Password reset link sent to your email!");
      setIsLoading(false);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      toast.error("Request failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Forgot Password</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      {isSubmitted ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 flex items-center justify-center mx-auto border border-green-200 dark:border-green-900/30">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200">Email Sent!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Please check your inbox for instructions on how to reset your password.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/login"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline text-sm"
            >
              Back to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg py-2 pl-10 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <span className="text-xs text-red-500 block mt-1">{errors.email.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-medium py-2 rounded-lg transition duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer disabled:opacity-50 text-sm mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
            >
              Log In
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
