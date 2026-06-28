"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name must be less than 60 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters, spaces, hyphens, or apostrophes"),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
            avatar_url: "",
          },
        },
      });

      if (authError) {
        // Map Supabase error codes to friendly messages
        let friendlyMessage = authError.message
        if (authError.message.includes("already registered") || authError.message.includes("User already registered")) {
          friendlyMessage = "An account with this email already exists. Try signing in instead."
        } else if (authError.message.includes("password")) {
          friendlyMessage = "Your password is too weak. Please choose a stronger one."
        } else if (authError.message.includes("invalid email")) {
          friendlyMessage = "That email address doesn't look right. Please double-check it."
        } else if (authError.message.includes("rate limit")) {
          friendlyMessage = "Too many attempts. Please wait a moment and try again."
        }
        setError(friendlyMessage)
        toast.error(friendlyMessage)
        setIsLoading(false)
        return
      }

      if (data?.user) {
        // Get or create a session — works whether email confirmation is on or off
        let session = data.session;

        if (!session) {
          // Email confirmation is enabled in Supabase — try signing in immediately
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: values.email,
            password: values.password,
          });
          if (!signInError && signInData.session) {
            session = signInData.session;
          }
        }

        if (session) {
          // Seed customer role in users table
          await supabase
            .from("users")
            .update({
              role_id: "c3e0e660-31e0-4966-9e1f-7b0028ed2ce1",
            })
            .eq("id", data.user.id)

          toast.success(`Welcome, ${values.fullName.split(" ")[0]}! Your account is ready.`)
          router.push(redirectTo)
          router.refresh()
        } else {
          // Fallback: email confirmation is strictly enforced and sign-in also failed
          toast.success("Account created! Please check your email to confirm, then sign in.")
          router.push("/login")
        }
      }
    } catch (err) {
      const message = "Something went wrong on our end. Please try again."
      setError(message)
      toast.error(message)
      setIsLoading(false)
    }
  };

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Join Scarlet Thread to track orders and save your favourites.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register("fullName")}
              type="text"
              placeholder="Your name"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg py-2 pl-10 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm"
              disabled={isLoading}
            />
          </div>
          {errors.fullName && (
            <span className="text-xs text-red-500 block mt-1">{errors.fullName.message}</span>
          )}
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 rounded-lg py-2 pl-10 pr-10 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition duration-200 text-sm"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 outline-none transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500 block mt-1">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white font-medium py-2.5 rounded-lg transition duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer disabled:opacity-50 text-sm mt-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2">
          By creating an account, you agree to our{" "}
          <Link href="/terms" className="text-purple-600 hover:underline">Terms</Link>
          {" & "}
          <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>.
        </p>
      </form>

      <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link
          href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
          className="text-purple-600 dark:text-purple-400 font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
