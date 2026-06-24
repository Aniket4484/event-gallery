"use client";

import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizes = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className={cn("relative", sizes[size])}>
        <div className="absolute inset-0 rounded-full border-2 border-gold-200 dark:border-maroon-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
      </div>
      {text && <p className="text-sm text-maroon-500 dark:text-gold-600 animate-pulse">{text}</p>}
    </div>
  );
}

export function PageLoader({ text = "Loading…" }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-marathi-gradient dark:bg-marathi-dark lotus-bg">
      <div className="text-center space-y-4">
        <div className="text-5xl animate-float">🪷</div>
        <div className="font-cinzel text-gold-500 dark:text-gold-400 text-2xl">WeddingSnaps</div>
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}

export function PhotoSkeleton() {
  return (
    <div className="animate-pulse rounded-xl overflow-hidden bg-maroon-100 dark:bg-maroon-900 aspect-square" />
  );
}
