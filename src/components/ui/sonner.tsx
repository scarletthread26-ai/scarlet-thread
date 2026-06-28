"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
        ),
        info: (
          <InfoIcon className="size-4 text-sky-500 dark:text-sky-400 shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-amber-500 dark:text-amber-400 shrink-0" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-rose-500 dark:text-rose-400 shrink-0" />
        ),
        loading: (
          <Loader2Icon className="size-4 text-purple-600 dark:text-purple-455 animate-spin shrink-0" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-white/90 group-[.toaster]:dark:bg-slate-900/90 group-[.toaster]:backdrop-blur-md group-[.toaster]:text-slate-900 group-[.toaster]:dark:text-slate-100 group-[.toaster]:border-slate-200/80 group-[.toaster]:dark:border-slate-800/80 group-[.toaster]:shadow-xl group-[.toaster]:rounded-2xl group-[.toaster]:font-sans group-[.toaster]:p-4 group-[.toaster]:border group-[.toaster]:flex group-[.toaster]:items-center group-[.toaster]:gap-3 group-[.toaster]:text-sm group-[.toaster]:transition-all group-[.toaster]:duration-300",
          description: "group-[.toast]:text-xs group-[.toast]:text-slate-500 group-[.toast]:dark:text-slate-400",
          actionButton: "group-[.toast]:bg-purple-600 group-[.toast]:text-white group-[.toast]:rounded-xl group-[.toast]:text-xs group-[.toast]:font-semibold group-[.toast]:px-3 group-[.toast]:py-1.5",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:dark:bg-slate-800 group-[.toast]:text-slate-600 group-[.toast]:dark:text-slate-300",
          success: "group-[.toaster]:border-emerald-500/20 group-[.toaster]:dark:border-emerald-500/10 group-[.toaster]:bg-emerald-50/60 group-[.toaster]:dark:bg-emerald-950/10 group-[.toaster]:text-emerald-800 group-[.toaster]:dark:text-emerald-200",
          error: "group-[.toaster]:border-rose-500/20 group-[.toaster]:dark:border-rose-500/10 group-[.toaster]:bg-rose-50/60 group-[.toaster]:dark:bg-rose-950/10 group-[.toaster]:text-rose-800 group-[.toaster]:dark:text-rose-200",
          warning: "group-[.toaster]:border-amber-500/20 group-[.toaster]:dark:border-amber-500/10 group-[.toaster]:bg-amber-50/60 group-[.toaster]:dark:bg-amber-950/10 group-[.toaster]:text-amber-800 group-[.toaster]:dark:text-amber-200",
          info: "group-[.toaster]:border-sky-500/20 group-[.toaster]:dark:border-sky-500/10 group-[.toaster]:bg-sky-50/60 group-[.toaster]:dark:bg-sky-950/10 group-[.toaster]:text-sky-800 group-[.toaster]:dark:text-sky-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
