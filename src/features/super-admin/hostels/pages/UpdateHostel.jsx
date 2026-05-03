import React, { useState, useEffect } from "react";
import { Info, Camera, MapPin } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { useForm } from "react-hook-form";
import {
  updateHostelApi,
  getAllPackageApi,
  getHostelById,
} from "../../../../utils/utils";
import { useParams, useNavigate } from "react-router-dom";

export default function UpdateHostel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [packages, setPackages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageApi();
        if (res?.data) {
          setPackages(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchPackages();
  }, []);

  // Fetch hostel details by Id
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await getHostelById(id);
        if (res?.data) {
          // Assuming res.data contains the hostel object
          reset({
            hostelName: res.data.hostelName || "",
            hostelType: res.data.hostelType || "",
            packageId: res.data.packageId || "",
            address: res.data.address || "",
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      fetchHostel();
    }
  }, [id, reset]);

  const onSubmit = async (data) => {
  setLoaderCheck(true);

  try {
    const payload = {
      hostelName: data.hostelName,
      hostelType: data.hostelType,
      address: data.address,
      hostelImage: "", // 👈 agar image ka URL nahi hai to empty rakh do
    };

    const response = await updateHostelApi(id, payload);

    if (response?.data?.status === "success" || response?.status === 200) {
      console.log("Success");
      navigate("/hostels");
      window.location.reload(); // ✅ IMPORTANT
    } else {
      console.log("Error");
    }
  } catch (error) {
    console.log(error);
  }

  setLoaderCheck(false);
};

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto max-w-6xl space-y-10 pb-16 bg-background text-foreground p-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Update Hostel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Update the basic information of the hostel
          </p>
        </div>

        {/* SECTION 1 */}
        <Card className="p-8 rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-8">
            <Info className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">1. Basic Information</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Upload */}
            <div className="space-y-3">
              <Label>Hostel Logo</Label>

              <label className="h-56 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted cursor-pointer">
                <Camera className="h-6 w-6 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">
                  UPLOAD LOGO
                </span>

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("logo")}
                />
              </label>

              <p className="text-xs text-muted-foreground">
                Square format recommended. PNG or SVG preferred.
              </p>
            </div>

            {/* Form */}
            <div className="md:col-span-2 space-y-5">
              <div className="space-y-2">
                <Label>Hostel Name</Label>
                <Input
                  className="h-11"
                  placeholder="e.g. Green Valley Residency"
                  {...register("hostelName", {
                    required: "Hostel name is required",
                  })}
                />
              </div>

              <div className="space-y-2">
                <Label>Hostel Type</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  {...register("hostelType")}
                >
                  <option value="">Select property type</option>
                  <option value="BOYS">BOYS</option>
                  <option value="GIRLS">GIRLS</option>
                  <option value="BOTH">BOTH</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Package</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  {...register("packageId")}
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.packageId}>
                      {pkg.packageName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Full Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                  <Input
                    className="h-11 pl-9"
                    placeholder="Street, Landmark, City..."
                    {...register("address")}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/hostels")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-black text-white hover:opacity-90"
            disabled={loaderCheck}
          >
            {loaderCheck ? "Updating..." : "Update Hostel"}
          </Button>
        </div>
      </div>
    </form>
  );
}
