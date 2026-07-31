interface TotalItemsCardProps {
  count: number;
}

export function TotalItemsCard({ count }: TotalItemsCardProps) {
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
      <p className="text-3xl font-semibold tracking-tight">{count}</p>
      <p className="text-sm text-muted-foreground">
        {count === 1 ? "item" : "items"} in your closet
      </p>
    </div>
  );
}
