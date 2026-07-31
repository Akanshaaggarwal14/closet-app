import { AppNav } from "@/components/shared/app-nav";

/**
 * Shared layout for authenticated app routes (Dashboard, Closet, Outfit
 * Studio, Calendar, Profile).
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main>{children}</main>
    </div>
  );
}
