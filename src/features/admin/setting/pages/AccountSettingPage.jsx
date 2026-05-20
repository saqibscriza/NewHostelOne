import React from "react";
import { Card } from "../../../../components/ui/Card";
import { useForm } from "react-hook-form";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { getHostelByIdApi, updateHostelByIdApi, getLocationByPincodeApi } from "../../../../utils/utils";
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
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const pinCode = watch("pinCode");

  useEffect(() => {
    const fetchLocation = async () => {
      if (pinCode && pinCode.length === 6) {
        try {
          const res = await getLocationByPincodeApi(pinCode);
          const locationData = res?.data || res;
          
          if (locationData && locationData.country && locationData.state) {
            setValue("country", locationData.country || "");
            setValue("state", locationData.state || "");
            setValue("city", locationData.district || locationData.city || locationData.region || "");
          } else {
            toast.error("Invalid PIN Code");
            setValue("country", "");
            setValue("state", "");
            setValue("city", "");
          }
        } catch (error) {
          console.error("Error fetching location:", error);
          toast.error("Failed to fetch location details");
        }
      }
    };
    fetchLocation();
  }, [pinCode, setValue]);

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
              <Input {...register("hostelName")} className="h-11" />
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
                type="tel"
                maxLength={10}
                inputMode="numeric"
                {...register("contactNumber", {
                  required: "Contact number is required",
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit contact number",
                  },
                  minLength: {
                    value: 10,
                    message: "Contact number must be 10 digits",
                  },
                  maxLength: {
                    value: 10,
                    message: "Contact number must be 10 digits",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                }}
                className="h-11"
              />

              {errors?.contactNumber && (
                <p className="text-sm text-red-500">
                  {errors.contactNumber.message}
                </p>
              )}
            </div>

            {/* Alternate Contact Number - Takes 1 column (half width) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Alternate Contact Number
              </Label>

              <Input
                type="tel"
                maxLength={10}
                inputMode="numeric"
                {...register("alternateContactNumber", {
                  pattern: {
                    value: /^[6-9]\d{9}$/,
                    message: "Enter valid 10-digit contact number",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 10);
                }}
                className="h-11"
              />

              {errors?.alternateContactNumber && (
                <p className="text-sm text-red-500">
                  {errors.alternateContactNumber.message}
                </p>
              )}
            </div>

            {/* Address Details - md:col-span-2 makes it full width */}
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-slate-700">
                Address Details
              </Label>
              <Input {...register("address")} className="h-11" />
            </div>

            {/* Pin Code - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Pin Code
              </Label>

              <Input
                type="tel"
                maxLength={6}
                inputMode="numeric"
                {...register("pinCode", {
                  required: "Pin code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "Pin code must be 6 digits",
                  },
                })}
                onInput={(e) => {
                  e.target.value = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);
                }}
                className="h-11"
              />

              {errors?.pinCode && (
                <p className="text-sm text-red-500">{errors.pinCode.message}</p>
              )}
            </div>

            {/* Country - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Country
              </Label>
              <Input
                type="text"
                placeholder="Country"
                {...register("country", { required: "Required" })}
                className="h-11"
              />
            </div>

            {/* State - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                State
              </Label>
              <Input
                type="text"
                placeholder="State"
                {...register("state", { required: "Required" })}
                className="h-11"
              />
            </div>

            {/* City - Takes 1 column */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">City</Label>
              <Input
                type="text"
                placeholder="City"
                {...register("city", { required: "Required" })}
                className="h-11"
              />
            </div>
          </div>
        </Card>

        {/* 3. FOOTER BUTTONS */}
        <div className="flex items-center justify-end gap-4 pt-4 pb-10">
          <Button
            type="button"
            variant="secondary"
            className="h-11 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            onClick={() => navigate("/admin/staff")}
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
