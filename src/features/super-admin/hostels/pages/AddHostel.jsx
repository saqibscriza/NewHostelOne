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
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const countries = ["India", "USA"];
const states = ["Uttar Pradesh", "Delhi", "Maharashtra", "Karnataka"];
const cities = ["Noida", "Ghaziabad", "New Delhi", "Mumbai", "Bengaluru"];

const buildAddress = (...parts) => parts.filter(Boolean).join(", ");

export default function AddHostel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("new");
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [packages, setPackages] = useState([]);

  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm();

  // For Fetch packages for dropdown
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageApi();
        console.log("API Response:", res);

        if (res?.data) {
          setPackages(res.data); //  store packages
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedAdmin(null);
    resetField("adminName");
    resetField("adminEmail");
    resetField("adminPhone");
    resetField("adminAddress");
    resetField("adminPinCode");
    resetField("adminCountry");
    resetField("adminState");
    resetField("adminCity");
  };

  // const onSubmit = async (data) => {
  //   const payload = {
  //     __adminMode: activeTab,
  //     hostelName: data.hostelName,
  //     address: data.address,
  //     contactNumber: data.contactNumber,
  //     alternateContactNumber: data.alternateContactNumber,
  //     city: data.city,
  //     state: data.state,
  //     country: data.country,
  //     pinCode: data.pinCode,
  //     hostelType: data.hostelType,
  //     packageId: data.packageId,
  //   };

  //   if (activeTab === "existing") {
  //     if (!selectedAdmin?.adminId) {
  //       toast.error("Please select an existing admin");
  //       return;
  //     }

  //     payload.adminId = selectedAdmin.adminId;
  //   } else {
  //     payload.adminName = data.adminName;
  //     payload.adminEmail = data.adminEmail;
  //     payload.adminPhone = data.adminPhone;
  //     payload.adminAddress = buildAddress(
  //       data.adminAddress,
  //       data.adminCity,
  //       data.adminState,
  //       data.adminCountry,
  //       data.adminPinCode,
  //     );
  //   }

  //   setLoaderCheck(true);
  //   try {
  //     const response = await addHostelApi(payload);
  //     if (response?.data?.status === "success") {
  //       toast.success(response?.data?.message || "Hostel created successfully");
  //       setLoaderCheck(false);
  //       navigate("/superadmin/hostels");
  //     } else {
  //       toast.error(response?.data?.message || "Failed to create hostel");
  //       setLoaderCheck(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //     setLoaderCheck(false);
  //   }
  // };

  const onSubmit = async (data) => {
  const formData = new FormData();

  formData.append("__adminMode", activeTab);

  formData.append("hostelName", data.hostelName);
  formData.append("address", data.address);
  formData.append("contactNumber", data.contactNumber);
  formData.append(
    "alternateContactNumber",
    data.alternateContactNumber,
  );

  formData.append("city", data.city);
  formData.append("state", data.state);
  formData.append("country", data.country);
  formData.append("pinCode", data.pinCode);

  formData.append("hostelType", data.hostelType);

  formData.append("packageId", data.packageId);

  if (activeTab === "existing") {
    if (!selectedAdmin?.adminId) {
      toast.error("Please select an existing admin");
      return;
    }

    formData.append("adminId", selectedAdmin.adminId);
  } else {
    formData.append("adminName", data.adminName);

    formData.append("adminEmail", data.adminEmail);

    formData.append("adminPhone", data.adminPhone);

    formData.append(
      "adminAddress",
      buildAddress(
        data.adminAddress,
        data.adminCity,
        data.adminState,
        data.adminCountry,
        data.adminPinCode,
      ),
    );
  }

  setLoaderCheck(true);

  try {
    const response = await addHostelApi(formData);

    if (response?.data?.status === "success") {
      toast.success(
        response?.data?.message ||
          "Hostel created successfully",
      );

      setLoaderCheck(false);

      setTimeout(() => {
        navigate("/superadmin/hostels");
      }, 2000);
    } else {
      toast.error(
        response?.data?.message ||
          "Failed to create hostel",
      );

      setLoaderCheck(false);
    }
  } catch (error) {
    console.log(error);

    toast.error("Something went wrong");

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
                {errors.hostelName && (
                  <p className="text-xs text-red-500">
                    {errors.hostelName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Hostel Type</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  {...register("hostelType", {
                    required: "Hostel type is required",
                  })}
                >
                  <option value="">Select property type</option>
                  <option value="BOYS">BOYS</option>
                  <option value="GIRLS">GIRLS</option>
                  <option value="BOTH">BOTH</option>
                </select>
                {errors.hostelType && (
                  <p className="text-xs text-red-500">
                    {errors.hostelType.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Package</Label>
                <select
                  className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                  {...register("packageId", {
                    required: "Package is required",
                  })}
                >
                  <option value="">Select Package</option>
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.packageId}>
                      {pkg.packageName}
                    </option>
                  ))}
                </select>
                {errors.packageId && (
                  <p className="text-xs text-red-500">
                    {errors.packageId.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input
                    className="h-11"
                    placeholder="Enter Contact Number"
                    {...register("contactNumber", {
                      required: "Contact number is required",
                    })}
                  />
                  {errors.contactNumber && (
                    <p className="text-xs text-red-500">
                      {errors.contactNumber.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Alternate Contact Number</Label>
                  <Input
                    className="h-11"
                    placeholder="Enter Alternate Contact Number"
                    {...register("alternateContactNumber", {
                      required: "Alternate contact number is required",
                    })}
                  />
                  {errors.alternateContactNumber && (
                    <p className="text-xs text-red-500">
                      {errors.alternateContactNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Address Details</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                  <Input
                    className="h-11 pl-9"
                    placeholder="Street, Landmark, City, State, Zip Code"
                    {...register("address", {
                      required: "Address is required",
                    })}
                  />
                </div>
                {errors.address && (
                  <p className="text-xs text-red-500">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Pin Code</Label>
                  <Input
                    className="h-11"
                    placeholder="Enter Pin Code"
                    {...register("pinCode", {
                      required: "Pin code is required",
                    })}
                  />
                  {errors.pinCode && (
                    <p className="text-xs text-red-500">
                      {errors.pinCode.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-xs text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>State</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("state", {
                      required: "State is required",
                    })}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <p className="text-xs text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("city", {
                      required: "City is required",
                    })}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.city && (
                    <p className="text-xs text-red-500">
                      {errors.city.message}
                    </p>
                  )}
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
              type="button"
              onClick={() => handleTabChange("new")}
              className={`pb-2 border-b-2 transition-all ${
                activeTab === "new"
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Add New Admin
            </button>

            <button
              type="button"
              onClick={() => handleTabChange("existing")}
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
                  {...register("adminName", {
                    required:
                      activeTab === "new" ? "Admin name is required" : false,
                  })}
                />
                {errors.adminName && (
                  <p className="text-xs text-red-500">
                    {errors.adminName.message}
                  </p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Admin Email Address</Label>
                  <Input
                    placeholder="admin@hostelname.com"
                    className="h-11"
                    {...register("adminEmail", {
                      required:
                        activeTab === "new" ? "Admin email is required" : false,
                    })}
                  />
                  {errors.adminEmail && (
                    <p className="text-xs text-red-500">
                      {errors.adminEmail.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Admin Phone Number</Label>
                  <Input
                    placeholder="+91 9987645675"
                    className="h-11"
                    {...register("adminPhone", {
                      required:
                        activeTab === "new" ? "Admin phone is required" : false,
                    })}
                  />
                  {errors.adminPhone && (
                    <p className="text-xs text-red-500">
                      {errors.adminPhone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    placeholder="Enter Address Details"
                    className="h-11"
                    {...register("adminAddress", {
                      required:
                        activeTab === "new"
                          ? "Admin address is required"
                          : false,
                    })}
                  />
                  {errors.adminAddress && (
                    <p className="text-xs text-red-500">
                      {errors.adminAddress.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Pin Code</Label>
                  <Input
                    placeholder="Enter Pin Code"
                    className="h-11"
                    {...register("adminPinCode", {
                      required:
                        activeTab === "new"
                          ? "Admin pin code is required"
                          : false,
                    })}
                  />
                  {errors.adminPinCode && (
                    <p className="text-xs text-red-500">
                      {errors.adminPinCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("adminCountry", {
                      required:
                        activeTab === "new"
                          ? "Admin country is required"
                          : false,
                    })}
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.adminCountry && (
                    <p className="text-xs text-red-500">
                      {errors.adminCountry.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("adminState", {
                      required:
                        activeTab === "new" ? "Admin state is required" : false,
                    })}
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.adminState && (
                    <p className="text-xs text-red-500">
                      {errors.adminState.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>City</Label>
                  <select
                    className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
                    {...register("adminCity", {
                      required:
                        activeTab === "new" ? "Admin city is required" : false,
                    })}
                  >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {errors.adminCity && (
                    <p className="text-xs text-red-500">
                      {errors.adminCity.message}
                    </p>
                  )}
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
                  <option value="">Select existing admin</option>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/superadmin/hostels")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loaderCheck}
            className="bg-black text-white hover:opacity-90"
          >
            {loaderCheck ? "Creating..." : "Complete Registration"}
          </Button>
        </div>
      </div>
    </form>
  );
}
