import { Card, CardContent } from "../../../components/ui/Card";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HostelCard = ({ hostel }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/user/hostels/${hostel.id}`)}
      className="cursor-pointer overflow-hidden border border-border rounded-xl hover:shadow-md transition"
    >
      <div className="relative">
        <img
          src={hostel.image}
          alt="hostel"
          className="w-full h-40 object-cover"
        />
        <Heart className="absolute top-3 right-3 w-5 h-5 text-white" />
      </div>

      <CardContent className="p-3">
        <h3 className="text-sm font-medium">{hostel.name}</h3>

        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">₹{hostel.price}</span>{" "}
          Per Bed
        </p>
      </CardContent>
    </Card>
  );
};

export default HostelCard;
