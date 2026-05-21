import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { UserPlus, Receipt, Wrench } from "lucide-react";

export default function QuickActions() {
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl border border-border shadow-sm bg-card">
      <CardContent className="p-5 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Quick Actions
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Frequently used admin operations
          </p>
        </div>

        <div className="space-y-3">
          {/* ADD STUDENT */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/students/add")}
            className="w-full h-11 justify-start gap-2 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>

          {/* COLLECT FEE */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/fees/collect")}
            className="w-full h-11 justify-start gap-2 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Receipt className="w-4 h-4" />
            Collect Fee
          </Button>

          {/* MAINTENANCE */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/support")}
            className="w-full h-11 justify-start gap-2 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Wrench className="w-4 h-4" />
            Maintenance Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
