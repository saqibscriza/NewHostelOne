import { Button } from "../../../components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getHostelDataById } from "../../../utils/utils";
import { toast } from "sonner";

const HostelDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    noOfDays: "",
    beds: "",
    roomType: "",
  });

  // GET BY ID 
  const HostelDataById = async () => {
    setLoading(true);
    try {
      const response = await getHostelDataById(id);

      if (response?.data?.status === "success") {
        setHostel(response.data.hostel);
        setLoading(false);
      } else {
        toast.error(response?.data?.message);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    HostelDataById();
  }, [id]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold">
          {hostel?.hostelName || hostel?.name}
        </h1>
        <p className="text-muted-foreground text-sm">{hostel?.address}</p>
      </div>

      {/* Image */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <img
          src={hostel?.hostelImage}
          className="col-span-2 h-64 w-full object-cover rounded-xl"
        />
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">About</h2>
          <p className="text-muted-foreground">
            {hostel?.description || "No description available"}
          </p>
        </div>

        {/* Right Booking Card */}
        <div className="border border-border rounded-xl p-4 space-y-4 bg-card">
          <h3 className="font-semibold">Book Room</h3>

          {/* 🔥 SELECT PERIOD DROPDOWN */}
          <div>
            <label className="text-sm text-muted-foreground">
              Select Period
            </label>
            <select
              value={formData.noOfDays}
              onChange={(e) => handleChange("noOfDays", e.target.value)}
              className="w-full border rounded-md p-2 bg-background mt-1"
            >
              <option value="">Select Period</option>
              <option value="7">1 Week</option>
              <option value="15">15 Days</option>
              <option value="30">1 Month</option>
              <option value="90">3 Months</option>
              <option value="180">6 Months</option>
            </select>
          </div>

          {/* BED */}
          <div>
            <label className="text-sm text-muted-foreground">Bed</label>
            <select
              value={formData.beds}
              onChange={(e) => handleChange("beds", e.target.value)}
              className="w-full border rounded-md p-2 bg-background mt-1"
            >
              <option value="">Select Bed</option>
              <option value="1">1 Bed</option>
              <option value="2">2 Bed</option>
              <option value="3">3 Bed</option>
            </select>
          </div>

          {/* ROOM TYPE */}
          <div>
            <label className="text-sm text-muted-foreground">Room Type</label>
            <select
              value={formData.roomType}
              onChange={(e) => handleChange("roomType", e.target.value)}
              className="w-full border rounded-md p-2 bg-background mt-1"
            >
              <option value="">Select Room Type</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
            </select>
          </div>

          <Button
            className="w-full"
            onClick={() => navigate(`/user/hostels/${id}/request`)}
          >
            Reserve Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostelDetails;
