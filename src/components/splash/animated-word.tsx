"use client";

import { motion } from "motion/react";

interface AnimatedWordProps {
  word: string;
  /** Fires once the last letter has settled. */
  onComplete?: () => void;
}

const LETTER_STAGGER = 0.09;
const LETTER_SPRING_DURATION = 0.6;
const LETTER_BOUNCE = 0.45;

/**
 * Renders a word as individually animated letters that drop from above,
 * slightly overshoot, and settle with a gentle spring bounce. Purely
 * presentational — no auth or redirect logic lives here.
 */
export function AnimatedWord({ word, onComplete }: AnimatedWordProps) {
  const letters = Array.from(word);
  const lastIndex = letters.length - 1;

  return (
    <div className="flex" aria-label={word}>
      {letters.map((letter, index) => (
        <motion.span
          key={`${letter}-${index}`}
          aria-hidden="true"
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: index * LETTER_STAGGER,
            type: "spring",
            duration: LETTER_SPRING_DURATION,
            bounce: LETTER_BOUNCE,
          }}
          onAnimationComplete={index === lastIndex ? onComplete : undefined}
          className="inline-block text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          {letter}
        </motion.span>
      ))}
    </div>
  );
}
