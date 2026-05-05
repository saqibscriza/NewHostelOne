import * as React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../../src/context/AuthContext"
import { Button } from "../../../../src/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../../src/components/ui/Card"
import { Label } from "../../../../src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../src/components/ui/select"
import { selectHostelApi } from "../../../../src/utils/utils"

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
        sessionStorage.setItem("hostelSelectionToken", token);
        sessionStorage.setItem("selectedHostel", selectedHostel);
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
      {/* The max-width and padding mirror the proportions of the provided image.
        Using a standard rounded-xl or rounded-2xl to match the soft corners.
      */}
      <Card className="w-full max-w-lg rounded-2xl border-gray-200 shadow-sm">
        <CardHeader className="space-y-1.5 pb-6 pt-8 px-8">
          <CardTitle className="text-[2.5rem] font-extrabold leading-tight tracking-tight text-black">
            Select Hostel
          </CardTitle>
          <CardDescription className="text-xl text-gray-500 pt-1">
            Select a hostel to view and control
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-8 pb-6">
          <div className="space-y-3">
            <Label htmlFor="hostel" className="text-[1.1rem] font-semibold text-black">
              Hostel Name
            </Label>
            <Select onValueChange={setSelectedHostel} value={selectedHostel}>
              <SelectTrigger 
                id="hostel" 
                className={`h-14 w-full rounded-xl border-gray-200 bg-white text-base text-gray-500 focus:ring-1 focus:ring-gray-300 ${error ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select Hostel" />
              </SelectTrigger>
              <SelectContent>
                {hostels.map((hostel) => (
                  <SelectItem key={hostel.hostelId} value={hostel.hostelId}>
                    {hostel.hostelName || hostel.name || `Hostel ${hostel.hostelId}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-8">
          <Button 
            onClick={handleLogin}
            disabled={loading}
            className="h-14 w-full rounded-xl bg-[#0f172a] text-[1.1rem] font-medium text-white hover:bg-[#1e293b]"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
