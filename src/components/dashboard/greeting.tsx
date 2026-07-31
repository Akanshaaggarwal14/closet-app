"use client";

import { useEffect, useState } from "react";

interface GreetingProps {
  name: string;
}

/**
 * Time-of-day greeting computed client-side (useEffect) rather than on the
 * server, so it reflects the visitor's actual local time rather than the
 * server's clock/timezone.
 */
export function Greeting({ name }: GreetingProps) {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <h1 className="text-2xl font-semibold tracking-tight">
      {greeting}
      {name ? `, ${name}` : ""}
    </h1>
  );
}
