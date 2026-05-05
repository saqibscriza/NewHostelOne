import { Button } from "../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const RequestSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <h1 className="text-2xl font-semibold">Request confirmed</h1>

      {/* Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        
        {/* Top Section */}
        <div className="flex items-start gap-4">
          <div className="bg-muted rounded-full p-3">
            <CheckCircle className="text-foreground w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Request Sent Successfully!
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your application for the City Comfort Hostel has been successfully
              received. Our support team will contact you soon.
            </p>
          </div>
        </div>

        {/* Contact Box */}
        <div className="bg-muted border border-border rounded-lg p-4 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Management Contact No.
          </p>

          <p className="text-sm font-medium">
            📞 Hostel Contact Number: +91 9876543210
          </p>
        </div>

        {/* Note */}
        <p className="text-xs text-muted-foreground">
          Please contact the hostel warden to confirm your room assignment.
        </p>

        {/* Button */}
        <div>
          <Button
            className="rounded-full px-6"
            onClick={() => navigate("/user")}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RequestSuccess;