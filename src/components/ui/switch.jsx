"use client";

import * as React from "react";

/**
 * 🔹 Switch Component
 * Fully theme-aware (no hardcoded slate colors)
 */
export function Switch({ checked, onCheckedChange }) {
  return (
    <button
      onClick={() => onCheckedChange(!checked)}
      className={`
        w-10 h-6 flex items-center rounded-full p-1 transition-colors
        ${
          /**
           * ✅ FIX 1:
           * bg-slate-900 / bg-slate-300 ❌
           * → use theme tokens
           */
          checked ? "bg-primary" : "bg-muted"
        }
      `}
    >
      <div
        className={`
          w-4 h-4 rounded-full shadow transform transition
          
          /**
           * ✅ FIX 2:
           * bg-backgraound ❌ (typo)
           * → bg-background ✅
           */
          bg-background
          
          ${checked ? "translate-x-4" : ""}
        `}
      />
    </button>
  );
}
