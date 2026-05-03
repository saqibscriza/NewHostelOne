import React, { useState } from "react";
import { Info, Camera, MapPin, UserPlus } from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import { useForm } from "react-hook-form";
import { addHostelApi } from "../../../../utils/utils";
import { getAllPackageApi } from "../../../../utils/utils";
import { getAllAdminApi } from "../../../../utils/utils";
import { useEffect } from "react";

// import { toast } from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

export default function AddHostel() {
  const [activeTab, setActiveTab] = useState("new");
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [packages, setPackages] = useState([]);

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // For Fetch packages for dropdown
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageApi();
        console.log("API Response:", res);

        if (res?.data) {
          setPackages(res.data); // 👈 store packages
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackages();
  }, []);

  // For Fetching Admin List for dropdown
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await getAllAdminApi();
        console.log("Admin API:", res);

        if (res?.data?.admins) {
          setAdmins(res.data.admins); // depending on actual response structure of api.  setAdmins(res?.data?.admins || []);  we can write this also instead of if block
          
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAdmins();
  }, []);

  const onSubmit = async (data) => {
    const formData = new FormData();

    formData.append("hostelName", data.hostelName);
    formData.append("hostelType", data.hostelType);
    formData.append("packageId", data.packageId);
    formData.append("address", data.address);
    if (data.logo && data.logo.length > 0) {
      formData.append("logo", data.logo[0]);
    }

    if (activeTab === "existing") {
      formData.append("adminId", selectedAdmin?.adminId);
    } else {
      formData.append("adminName", data.adminName);
      formData.append("adminEmail", data.adminEmail);
      formData.append("adminPhone", data.adminPhone);
    }

    setLoaderCheck(true);
    try {
      const response = await addHostelApi(formData, data.hostelType);
      if (response?.data?.status === "success") {
        console.log("Success");
        // toast.success(response?.data?.message);
        setLoaderCheck(false);
        // setTimeout(() => {
        //   navigate("/vendormanagement");
        // }, 2000);
      } else {
        console.log("Error");
        // toast.error(response?.data?.message);
        // setShow(true)
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
      setLoaderCheck(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto max-w-6xl space-y-10 pb-16 bg-background text-foreground">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Add Hostel</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage and monitor all registered hostels across your network
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

                {/* 🔥 Hidden Input */}
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
                  <option>Select Package</option>
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

        {/* SECTION 2 */}
        <Card className="p-8 rounded-2xl border border-border">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">2. Assign Primary Admin</h2>
          </div>

          {/* 🔥 TABS (same logic as Settings page) */}
          <div className="flex gap-6 border-b border-border text-sm mb-6">
            <button
              onClick={() => setActiveTab("new")}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === "new"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Add New Admin
            </button>

            <button
              onClick={() => setActiveTab("existing")}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === "existing"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Add Existing Admin
            </button>
          </div>

          {/* 🔵 NEW ADMIN */}
          {activeTab === "new" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Admin Full Name</Label>
                <Input
                  className="h-11"
                  placeholder="Enter Full Name"
                  {...register("adminName")}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Admin Email Address</Label>
                  <Input
                    placeholder="admin@hostelname.com"
                    className="h-11"
                    {...register("adminEmail")}
                  />
                  <p className="text-xs text-muted-foreground">
                    An invitation email will be sent to this address.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Admin Phone Number</Label>
                  <Input
                    placeholder="+91 9987645675"
                    className="h-11"
                    {...register("adminPhone")}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 🟢 EXISTING ADMIN */}
          {activeTab === "existing" && (
            <div className="space-y-5">
              <div className="space-y-2">
                <Label>Admin Name</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const admin = admins.find((a) => a.adminId == selectedId);
                    setSelectedAdmin(admin);
                  }}
                >
                  <option>Select existing admin</option>
                  {admins.map((admin) => (
                    <option key={admin.id} value={admin.adminId}>
                      {admin.adminName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Admin Email Address</Label>
                  <Input
                    value={selectedAdmin?.adminEmail || ""}
                    disabled
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Admin Phone Number</Label>
                  <Input
                    value={selectedAdmin?.adminPhone || ""}
                    disabled
                    className="h-11"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mt-6 flex gap-4 rounded-xl border border-border bg-muted p-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-background border">
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            <div>
              <h4 className="text-sm font-semibold">Super Admin Note</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Further setup details will be managed by the Primary Admin.
              </p>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="flex justify-end gap-4">
          <Button variant="outline">Cancel</Button>
          <Button
            type="submit"
            className="bg-black text-white hover:opacity-90"
          >
            Complete Registration
          </Button>
        </div>
      </div>
    </form>
  );
}