"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-gradient-to-r from-maroon-700 via-maroon-600 to-saffron-600 text-white hover:from-maroon-800 hover:to-saffron-700 focus:ring-maroon-400 shadow-maroon hover:shadow-maroon-lg hover:scale-[1.02]",
      secondary:
        "bg-white dark:bg-maroon-900 text-maroon-800 dark:text-gold-300 border-2 border-gold-300 dark:border-gold-700 hover:bg-gold-50 dark:hover:bg-maroon-800 focus:ring-gold-300 hover:scale-[1.02]",
      ghost:
        "text-maroon-600 dark:text-gold-400 hover:bg-maroon-50 dark:hover:bg-maroon-900 focus:ring-maroon-300",
      danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 hover:scale-[1.02]",
      gold:
        "bg-gradient-to-r from-gold-500 to-saffron-500 text-white hover:from-gold-600 hover:to-saffron-600 focus:ring-gold-400 shadow-gold hover:shadow-gold-lg hover:scale-[1.02]",
    };

    const sizes = {
      sm: "text-xs px-4 py-2",
      md: "text-sm px-5 py-2.5",
      lg: "text-sm px-7 py-3",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
