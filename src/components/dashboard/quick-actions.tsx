import Link from "next/link";
import { CalendarPlus, Plus, Shirt } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button asChild>
        <Link href="/closet">
          <Plus className="h-4 w-4" />
          Add clothing
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/outfits">
          <Shirt className="h-4 w-4" />
          Create outfit
        </Link>
      </Button>
      <Button variant="outline" asChild>
        <Link href="/calendar">
          <CalendarPlus className="h-4 w-4" />
          Plan calendar
        </Link>
      </Button>
    </div>
  );
}
