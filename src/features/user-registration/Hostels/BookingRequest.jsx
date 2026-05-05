import { useLocation } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";

const BookingRequest = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <h1 className="text-2xl font-semibold">Room Book Details</h1>

      {/* Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Select Period */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Select Period
            </p>
            <div className="mt-2 bg-input border border-border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground">15 Days</span>
              <span className="text-muted-foreground">⌄</span>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Room Type
            </p>
            <div className="mt-2 bg-input border border-border rounded-lg px-4 py-3 flex items-center justify-between">
              <span className="text-sm text-foreground">Standard 1-Bed</span>
              <span className="text-muted-foreground">⌄</span>
            </div>
          </div>
        </div>

        {/* Bed */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Bed
          </p>
          <div className="mt-2 bg-input border border-border rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-foreground">1</span>
            <span className="text-muted-foreground">⌄</span>
          </div>
        </div>

        {/* Student Info */}
        <div className="space-y-5">
          <h2 className="font-semibold">Student Information</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                First Name
              </p>
              <input
                placeholder="Rakesh"
                className="mt-2 w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Last Name */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Last Name
              </p>
              <input
                placeholder="Sharma"
                className="mt-2 w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Email Address
            </p>
            <input
              type="email"
              placeholder="rakesh@gmail.com"
              className="mt-2 w-full bg-input border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="flex justify-center">
        <Button
          className="px-10 py-3 rounded-full"
          onClick={() => navigate(`/user/hostels/${id}/success`)}
        >
          Make a Request
        </Button>
      </div>
    </div>
  );
};

export default BookingRequest;
