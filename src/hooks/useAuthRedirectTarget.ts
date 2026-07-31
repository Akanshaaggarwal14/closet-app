"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

type RedirectTarget = "/dashboard" | "/login";

/**
 * Starts a Supabase session check in the background as soon as this hook
 * mounts, so it runs in parallel with the splash animation instead of
 * blocking it. Call `resolveTarget()` once the animation finishes to get
 * wherever the user should land — it awaits the check if it hasn't
 * resolved yet, but in practice the animation takes several seconds
 * longer than the session check does.
 */
export function useAuthRedirectTarget() {
  const targetRef = useRef<RedirectTarget | null>(null);
  const promiseRef = useRef<Promise<RedirectTarget> | null>(null);

  useEffect(() => {
    const supabase = createClient();
    promiseRef.current = supabase.auth
      .getSession()
      .then(({ data }) => {
        const target: RedirectTarget = data.session ? "/dashboard" : "/login";
        targetRef.current = target;
        return target;
      })
      .catch((): RedirectTarget => {
        targetRef.current = "/login";
        return "/login";
      });
  }, []);

  async function resolveTarget(): Promise<RedirectTarget> {
    if (targetRef.current) return targetRef.current;
    if (promiseRef.current) return promiseRef.current;
    return "/login";
  }

  return { resolveTarget };
}
