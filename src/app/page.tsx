"use client";

import { useRouter } from "next/navigation";
import { SplashScreen } from "@/components/splash/splash-screen";
import { useAuthRedirectTarget } from "@/hooks/useAuthRedirectTarget";

export default function Home() {
  const router = useRouter();
  const { resolveTarget } = useAuthRedirectTarget();

  async function handleFinished() {
    const target = await resolveTarget();
    router.replace(target);
  }

  return <SplashScreen onFinished={handleFinished} />;
}
