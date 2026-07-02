import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../../src/context/AuthContext"
import { ArrowRight } from "lucide-react"
import { Button } from "../../../../src/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select"
import { selectHostelApi } from "../../../../src/utils/utils"
import AuthLayout from "../../auth/component/AuthLayout"

export default function SelectHostelForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [selectedHostel, setSelectedHostel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { token, userRole, hostels } = location.state || {};

  useEffect(() => {
    if (!token || !userRole || !hostels) {
      navigate("/");
    }
  }, [token, userRole, hostels, navigate]);

  const handleLogin = async () => {
    if (!selectedHostel) {
      setError("Please select a hostel to continue.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await selectHostelApi(selectedHostel, token);
      if (response?.data?.status === "success") {
        const newToken = response.data.token;
        sessionStorage.setItem("selectedHostel", selectedHostel);
        
        const selectedHostelData = hostels.find(
          (item) => String(item.hostelId || item._id) === String(selectedHostel)
        );

        if (selectedHostelData) {
          const name = selectedHostelData.hostelName || selectedHostelData.name || `Hostel ${selectedHostel}`;
          sessionStorage.setItem("selectedHostelName", name);
        }
        
        window.dispatchEvent(new Event("hostelChanged"));
        
        login(userRole, newToken);
        navigate("/");
      } else {
        setError(response?.data?.message || "Failed to select hostel.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error while selecting hostel.");
    } finally {
      setLoading(false);
    }
  };

  if (!hostels) return null;

  return (
    <AuthLayout
      title={<>Access Your Hostel<br />Management Dashboard</>}
      subtitle="Manage your hostel operations seamlessly with secure access to your dashboard. Monitor bookings, residents, inventory, staff, and daily activities all in one centralized platform."
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Select Hostel</h2>
        <p className="text-[#6B7280] text-base">
          Select a hostel to view and control
        </p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#111827]">
            Hostel Name<span className="text-red-500">*</span>
          </label>
          <Select onValueChange={setSelectedHostel} value={selectedHostel}>
            <SelectTrigger 
              className={`w-full p-3.5 h-[52px] rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${error ? "border-red-500" : "border-gray-200"}`}
            >
              <SelectValue placeholder="Select Hostel" />
            </SelectTrigger>
            <SelectContent>
              {hostels.map((hostel) => (
                <SelectItem key={hostel.hostelId || hostel._id} value={hostel.hostelId || hostel._id}>
                  {hostel.hostelName || hostel.name || `Hostel ${hostel.hostelId || hostel._id}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="h-12 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] flex items-center gap-2"
          >
            {loading ? "Logging in..." : "Login"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-[#6B7280]">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="font-semibold text-[#111827] cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </div>
    </AuthLayout>
  )
}