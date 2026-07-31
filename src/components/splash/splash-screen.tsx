"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AnimatedWord } from "@/components/splash/animated-word";

const WORD = "Styloé";
const TAGLINE = "Your intelligent wardrobe companion";

const TAGLINE_FADE_DURATION = 0.5;
const POST_TAGLINE_PAUSE = 0.15; // brief gap before dots start fading in
const DOTS_FADE_DURATION = 0.4;
const HOLD_DURATION = 1.1; // dots stay visible before the screen fades out
const SCREEN_FADE_OUT_DURATION = 0.5;

type Stage = "letters" | "tagline" | "dots" | "exit";

interface SplashScreenProps {
  /** Fires once the splash has fully faded out and is ready to unmount. */
  onFinished: () => void;
}

/**
 * Orchestrates the full splash sequence: letters -> tagline -> loading
 * dots -> pause -> fade out. Contains no authentication or routing
 * logic — the parent page decides where to go once `onFinished` fires.
 */
export function SplashScreen({ onFinished }: SplashScreenProps) {
  const [stage, setStage] = useState<Stage>("letters");

  function handleLettersComplete() {
    setStage("tagline");
    window.setTimeout(
      () => setStage("dots"),
      (TAGLINE_FADE_DURATION + POST_TAGLINE_PAUSE) * 1000,
    );
  }

  function handleDotsShown() {
    window.setTimeout(() => setStage("exit"), HOLD_DURATION * 1000);
  }

  return (
    <AnimatePresence onExitComplete={onFinished}>
      {stage !== "exit" && (
        <motion.div
          key="splash"
          exit={{ opacity: 0 }}
          transition={{ duration: SCREEN_FADE_OUT_DURATION }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background"
        >
          <AnimatedWord word={WORD} onComplete={handleLettersComplete} />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: stage === "tagline" || stage === "dots" ? 1 : 0 }}
            transition={{ duration: TAGLINE_FADE_DURATION }}
            className="text-sm text-muted-foreground"
          >
            {TAGLINE}
          </motion.p>

          <div className="h-2">
            {stage === "dots" && <LoadingDots onShown={handleDotsShown} />}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function LoadingDots({ onShown }: { onShown: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DOTS_FADE_DURATION }}
      onAnimationComplete={onShown}
      className="flex gap-1.5"
    >
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.15,
            ease: "easeInOut",
          }}
          className="h-2 w-2 rounded-full bg-primary"
        />
      ))}
    </motion.div>
  );
}
