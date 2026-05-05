import React, { useState } from "react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";

import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createAdminHostelApi } from "../../../../utils/utils";
const Label = ({ children }) => (
  <p className="text-sm font-medium text-foreground mb-1">{children}</p>
);

const AdminAddHostel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    hostelName: "",
    address: "",
    contactNumber: "",
    alternateContactNumber: "",
    city: "",
    state: "",
    country: "",
    pinCode: "",
    hostelType: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;

    if (
      !form.hostelName.trim() ||
      !form.address.trim() ||
      !form.contactNumber.trim() ||
      !form.alternateContactNumber.trim() ||
      !form.hostelType ||
      !form.country ||
      !form.pinCode.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      hostelName: form.hostelName.trim(),
      address: form.address.trim(),
      contactNumber: form.contactNumber.trim(),
      alternateContactNumber: form.alternateContactNumber.trim(),
      city: form.city,
      state: form.state,
      country: form.country,
      pinCode: form.pinCode.trim(),
      hostelType: form.hostelType,
      hostelImage: "",
    };

    try {
      setLoading(true);
      const response = await createAdminHostelApi(payload);

      if (response?.data?.status === "success") {
        alert(response.data.message || "Hostel Created");
        navigate("/admin");
        return;
      }

      alert(response?.data?.message || "Failed to create hostel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Add Hostel</h1>
        <p className="text-sm text-muted-foreground">
          Manage and monitor all registered hostels across your network
        </p>
      </div>

      {/* CARD */}
      <Card className="bg-card border border-border">
        <CardContent className="p-6 space-y-6">
          {/* TITLE */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">ⓘ</span>
            <h2 className="text-lg font-semibold text-foreground">
              1. Basic Information
            </h2>
          </div>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LOGO UPLOAD */}
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted cursor-pointer hover:bg-accent transition">
              <Upload className="mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Upload Logo</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG or SVG preferred
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="md:col-span-2 space-y-4">
              {/* NAME */}
              <div>
                <Label>Hostel Name</Label>
                <Input
                  placeholder="e.g. Green Valley Residency"
                  onChange={(e) => handleChange("hostelName", e.target.value)}
                />
              </div>

              {/* TYPE */}
              <div>
                <Label>Hostel Type</Label>
                <Select
                  onValueChange={(val) =>
                    handleChange("hostelType", val.toUpperCase())
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BOYS">Boys Hostel</SelectItem>
                    <SelectItem value="GIRLS">Girls Hostel</SelectItem>
                    <SelectItem value="BOTH">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* PACKAGE */}
              <div>
                <Label>Package</Label>
                <Input value="Free Tier" disabled />
              </div>

              {/* CONTACT */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Number</Label>
                  <Input
                    placeholder="Enter Contact Number"
                    onChange={(e) =>
                      handleChange("contactNumber", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Alternate Contact Number</Label>
                  <Input
                    placeholder="Enter Alternate Contact"
                    onChange={(e) =>
                      handleChange("alternateContactNumber", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <Label>Address Details</Label>
                <Input
                  placeholder="Street, Landmark, City, State, Zip Code"
                  onChange={(e) => handleChange("address", e.target.value)}
                />
              </div>

              {/* PIN + COUNTRY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Pin Code</Label>
                  <Input
                    placeholder="Enter Pin Code"
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Country</Label>
                  <Select onValueChange={(val) => handleChange("country", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* STATE + CITY */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  <Select onValueChange={(val) => handleChange("state", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uttar Pradesh">
                        Uttar Pradesh
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>City</Label>
                  <Select onValueChange={(val) => handleChange("city", val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Noida">Noida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          className="bg-primary text-primary-foreground"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Complete Registration"}
        </Button>
      </div>
    </div>
  );
};

export default AdminAddHostel;
