"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  /** "drawer" slides in from the right (forms); "center" is a centered card (details, confirmations). */
  variant?: "center" | "drawer";
  className?: string;
}

/**
 * Hand-rolled Modal (Motion + portal) rather than Radix Dialog/Sheet —
 * keeps the closet feature dependency-free while the project's shell
 * access is unavailable for installing new packages. Swappable for
 * shadcn's Dialog/Sheet later without changing the call sites much.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  variant = "center",
  className,
}: ModalProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = previousOverflow;
      };
    }
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={cn(
            "fixed inset-0 z-50 flex p-0",
            variant === "drawer" ? "items-stretch justify-end" : "items-center justify-center p-4",
          )}
        >
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={onClose}
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={
              variant === "drawer"
                ? { x: "100%" }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            animate={variant === "drawer" ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              variant === "drawer"
                ? { x: "100%" }
                : { opacity: 0, scale: 0.96, y: 12 }
            }
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={cn(
              "relative overflow-y-auto bg-background shadow-2xl",
              variant === "drawer"
                ? "h-full w-full max-w-md p-6 sm:p-8"
                : "max-h-[90vh] w-full max-w-lg rounded-2xl p-6 sm:p-8",
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
            {title && (
              <h2 className="mb-4 pr-8 text-xl font-semibold tracking-tight">{title}</h2>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
