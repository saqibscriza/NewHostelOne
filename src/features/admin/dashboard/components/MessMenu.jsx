import { Card, CardContent } from "../../../../../src/components/ui/Card";
import { Coffee, Sun, Moon, Utensils } from "lucide-react";

export default function MessMenu({ data }) {
  return (
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-5 space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Today's Mess Menu
          </h2>

          <Utensils className="w-5 h-5 text-muted-foreground" />
        </div>

        {/* ITEM */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground flex flex-col items-center justify-center text-xs font-semibold">
            BRK
            <Coffee className="w-4 h-4 mt-1" />
          </div>

          <div>
            <p className="font-semibold text-foreground">Breakfast</p>

            <p className="text-sm text-muted-foreground">
              {data?.breakfast || "No breakfast"}
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ITEM */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-muted text-foreground flex flex-col items-center justify-center text-xs font-semibold">
            LUN
            <Sun className="w-4 h-4 mt-1" />
          </div>

          <div>
            <p className="font-semibold text-foreground">Lunch</p>

            <p className="text-sm text-muted-foreground">
              {data?.lunch || "No lunch"}
            </p>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* ITEM */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex flex-col items-center justify-center text-xs font-semibold">
            DIN
            <Moon className="w-4 h-4 mt-1" />
          </div>

          <div>
            <p className="font-semibold text-foreground">Dinner</p>

            <p className="text-sm text-muted-foreground">
              {data?.dinner || "No dinner"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
