import Link from "next/link";

interface LaundryCardProps {
  count: number;
}

/**
 * Small Dashboard summary card — the spec's example uses the 🧺 emoji
 * directly here (distinct from the WashingMachine lucide icon used in
 * the nav), so keeping that literal.
 */
export function LaundryCard({ count }: LaundryCardProps) {
  return (
    <Link
      href="/laundry"
      className="flex max-w-xs items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm transition-colors hover:bg-accent"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-lg">
        🧺
      </span>
      <div>
        <p className="text-sm font-medium">Laundry</p>
        <p className="text-sm text-muted-foreground">
          {count} {count === 1 ? "item" : "items"} in Laundry
        </p>
      </div>
    </Link>
  );
}
