/**
 * Shared layout for Sign Up / Login / Forgot Password — centered card,
 * no app nav. Real styling arrives with the Authentication feature.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      {children}
    </div>
  );
}
