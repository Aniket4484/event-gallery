"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center",
        "bg-maroon-700/40 dark:bg-maroon-800 border border-gold-600/30",
        "hover:bg-maroon-600/60 dark:hover:bg-maroon-700 transition-all duration-200 hover:scale-110",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark"
        ? <Sun  className="w-4 h-4 text-gold-400" />
        : <Moon className="w-4 h-4 text-maroon-200" />}
    </button>
  );
}
