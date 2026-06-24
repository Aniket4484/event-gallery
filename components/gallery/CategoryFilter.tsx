"use client";

import { motion } from "framer-motion";
import { CATEGORIES, cn } from "@/lib/utils";
import type { CategoryValue } from "@/lib/utils";

interface CategoryFilterProps {
  selected: CategoryValue;
  onChange: (cat: CategoryValue) => void;
  counts?: Record<string, number>;
}

export function CategoryFilter({ selected, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
      {CATEGORIES.map((cat) => {
        const isActive = selected === cat.value;
        const count = cat.value === "ALL"
          ? Object.values(counts || {}).reduce((a, b) => a + b, 0)
          : counts?.[cat.value];

        return (
          <button
            key={cat.value}
            onClick={() => onChange(cat.value as CategoryValue)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium",
              "whitespace-nowrap snap-start transition-all duration-250 border-2 focus:outline-none",
              isActive
                ? "bg-maroon-700 text-white border-maroon-700 shadow-maroon"
                : "bg-white/80 dark:bg-maroon-900/80 text-maroon-700 dark:text-gold-400 border-gold-200 dark:border-maroon-700 hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-maroon-800"
            )}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
            {count !== undefined && (
              <span className={cn(
                "ml-0.5 text-xs px-1.5 py-0.5 rounded-full font-semibold",
                isActive ? "bg-white/25 text-white" : "bg-maroon-100 dark:bg-maroon-800 text-maroon-600 dark:text-gold-500"
              )}>
                {count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="catActive"
                className="absolute inset-0 rounded-xl ring-2 ring-gold-400 ring-offset-1"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
