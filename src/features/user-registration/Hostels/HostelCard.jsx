import { Card, CardContent } from "../../../components/ui/Card";
import { Heart } from "lucide-react";

const HostelCard = () => {
  return (
    <Card className="overflow-hidden border border-border rounded-xl hover:shadow-md transition">
      <div className="relative">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
          alt="hostel"
          className="w-full h-40 object-cover"
        />

        <Heart className="absolute top-3 right-3 w-5 h-5 text-white" />
      </div>

      <CardContent className="p-3">
        <h3 className="text-sm font-medium">
          Sunrise Boys Hostel
        </h3>

        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">
            ₹42,50
          </span>{" "}
          Per Bed
        </p>
      </CardContent>
    </Card>
  );
};

export default HostelCard;