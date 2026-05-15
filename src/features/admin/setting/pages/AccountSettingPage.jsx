import React from "react";
import { Card } from "../../../../components/ui/Card";
import { useForm } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { getHostelByIdApi, updateHostelByIdApi } from "../../../../utils/utils";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function AccountSettingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [hostelId, setHostelId] = useState(null);
  const [loaderCheck, setLoaderCheck] = useState(false);

 const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const MyHostelDataById = async () => {
    setLoaderCheck(true);
    try {
      const response = await getHostelByIdApi();

      console.log("API RESPONSE:", response.data);

      const hostel = response.data;

      if (hostel) {
        setHostelId(hostel.hostelId);
        reset({
  hostelName: hostel.hostelName ?? "N/A",
  address: hostel.address ?? "N/A",
  hostelType: hostel.hostelType ?? "N/A",
  contactNumber: hostel.contactNumber ?? "N/A",
  alternateContactNumber: hostel.alternateContactNumber ?? "N/A",
  pinCode: hostel.pinCode ?? "N/A",
  country: hostel.country ?? "N/A",
  state: hostel.state ?? "N/A",
  city: hostel.city ?? "N/A",
        });
      } else {
        toast.error("Hostel not found");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoaderCheck(false);
    }
  };

  const MyHostelUpdateApi = async (data) => {
    console.log("Form Data:", data);
    
    try {
      setLoading(true); 
      const payload = {
        hostelName: data.hostelName,
        address: data.address,
        hostelType: data.hostelType,
        contactNumber: data.contactNumber,
        alternateContactNumber: data.alternateContactNumber,
        pinCode: data.pinCode,
        country: data.country,
        state: data.state,
        city: data.city,
      };

      const response = await updateHostelByIdApi(hostelId, payload);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);

        await MyHostelDataById();

        setTimeout(() => {
          navigate("/staff");
        }, 2000);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    MyHostelDataById();
  }, []);

  return (
    <form onSubmit={handleSubmit(MyHostelUpdateApi)}>
      <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/50 min-h-screen text-slate-900">
        {/* 1. HEADER SECTION */}
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-slate-500 mt-1 text-sm">
            General information about your hostel facility
          </p>
        </div>

        {/* 2. MAIN CARD SECTION */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          {/* The Grid System: 
            md:grid-cols-2 means on medium screens and larger, divide the space into 2 equal columns.
            gap-6 adds space between the rows and columns.
        */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hostel Name - md:col-span-2 makes it take up both columns (full width) */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-slate-700">
                Hostel Name
              </Label>
              <Input
                {...register("hostelName")}
                
                className="h-11"
              />
            </div>

              {/* Hostel Type - md:col-span-2 makes it full width */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-slate-700">
                Hostel Type
              </Label>
              <select
                {...register("hostelType")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Hostel Type</option>
                <option value="BOYS">Boys</option>
                <option value="GIRLS">Girls</option>
                <option value="BOTH">Both</option>
              </select>
            </div>

            {/* Contact Number - Takes 1 column (half width) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Contact Number
              </Label>
              <Input
                {...register("contactNumber")}
                
                className="h-11"
              />
              
            </div>

            {/* Alternate Contact Number - Takes 1 column (half width) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Alternate Contact Number
              </Label>
              <Input
                {...register("alternateContactNumber")}
                
                className="h-11"
              />
            </div>

            {/* Address Details - md:col-span-2 makes it full width */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-slate-700">
                Address Details
              </Label>
              <Input
                {...register("address")}
                
                className="h-11"
              />
            </div>

            {/* Pin Code - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Pin Code
              </Label>
              <Input
                {...register("pinCode")}
                
                className="h-11"
              />
            </div>

            {/* Country - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Country
              </Label>
              <select
                {...register("country")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>

              </select>
            </div>

            {/* State - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                State
              </Label>
              <select
                {...register("state")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select State</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharastra">Maharashtra</option>
                <option value="Rajasthan">Rajasthan</option>

              </select>
            </div>

            {/* City - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">City</Label>

              <select
                {...register("city")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select City</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Udaipur">Udaipur</option>
                <option value="Noida">Noida</option>

              </select>
            </div>
          </div>
        </Card>

        {/* 3. FOOTER BUTTONS */}
        <div className="flex items-center justify-end gap-4 pt-4 pb-10">
          <Button
            variant="secondary"
            className="h-11 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 px-8 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold"
          >
            Update
          </Button>
        </div>
      </div>
    </form>
  );
}
