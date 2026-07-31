"use client";

import { useEffect } from "react";

/**
 * Registers public/sw.js on mount. Rendered once from the root layout.
 * No UI — this purely enables installability and static-asset caching.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error("Service worker registration failed:", error);
    });
  }, []);

  return null;
}
