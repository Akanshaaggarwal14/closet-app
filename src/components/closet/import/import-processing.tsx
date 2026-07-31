"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

interface ImportProcessingProps {
  current: number;
  total: number;
}

export function ImportProcessing({ current, total }: ImportProcessingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Sparkles className="h-8 w-8 text-primary" />
      </motion.div>
      <div>
        <p className="font-medium">Analyzing your photos…</p>
        <p className="text-sm text-muted-foreground">
          Detecting and isolating clothing items locally
          {total > 1 ? ` (${current}/${total})` : ""}
        </p>
      </div>
      <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: total > 0 ? `${(current / total) * 100}%` : "0%" }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
