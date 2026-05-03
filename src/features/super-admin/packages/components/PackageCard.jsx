import { Card, CardContent } from "../../../../components/ui/Card";
import { Check } from "lucide-react";
import { Button } from "../../../../components/ui/button";

export default function PackageCard({ pkg }) {
  if (!pkg) return null;

  return (
    <Card className="bg-card border border-border">
      <CardContent className="pt-6 space-y-4">
        {/* Title + Price */}
        <div>
          <p className="text-lg font-semibold text-foreground">
            {pkg.packageName || "Unnamed Package"}
          </p>

          <p className="text-2xl font-bold text-foreground">
            ₹{pkg.monthlyPrice ?? 0}
            <span className="text-sm text-muted-foreground"> /month</span>
          </p>

          {/* Extra info (IMPORTANT for differentiation) */}
          <p className="text-xs text-muted-foreground mt-1">
            Beds: {pkg.maxBeds ?? "—"} | Staff: {pkg.maxStaff ?? "—"}
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-2">
          {Array.isArray(pkg.features) && pkg.features.length > 0 ? (
            pkg.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4 text-primary" />

                <span className="text-foreground">
                  {typeof feature === "string"
                    ? feature
                        .replaceAll("_", " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (c) => c.toUpperCase())
                    : feature?.name || "N/A"}
                </span>
              </li>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No features available
            </p>
          )}
        </ul>

        {/* Status */}
        <div>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              pkg.active
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {pkg.active ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Action */}
        <Button variant="outline" className="w-full">
          Edit Plan
        </Button>
      </CardContent>
    </Card>
  );
}
