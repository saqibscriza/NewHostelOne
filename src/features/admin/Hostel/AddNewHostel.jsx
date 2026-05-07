import React, { useEffect, useState } from "react";
import { Info, ImagePlus } from "lucide-react";

import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  addHostelApi,
  getAllPackageApi,
} from "../../../utils/utils";

export default function AddNewHostel() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const [packages, setPackages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  const AddNewHostelApi = async (data) => {
    try {
      const payload = {};

      payload.hostelName = data.hostelName;
      payload.address = data.address;
      payload.contactNumber = data.contactNumber;
      payload.alternateContactNumber =
        data.alternateContactNumber;
      payload.city = data.city;
      payload.state = data.state;
      payload.country = data.country;
      payload.pinCode = data.pinCode;
      payload.hostelType = data.hostelType;
      payload.packageId = data.packageId;

      const hasCompleteAdminDetails =
        data.adminName?.trim() &&
        data.adminEmail?.trim() &&
        data.adminPassword?.trim() &&
        data.adminPhone?.trim() &&
        data.adminAddress?.trim();

      if (role !== "admin" && hasCompleteAdminDetails) {
        payload.adminName = data.adminName;
        payload.adminEmail = data.adminEmail;
        payload.adminPassword = data.adminPassword;
        payload.adminPhone = data.adminPhone;
        payload.adminAddress = data.adminAddress;
      }

      console.log(payload);

      const response = await addHostelApi(payload);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);

        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to create hostel"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background p-5">
      <form
        onSubmit={handleSubmit(AddNewHostelApi)}
        className="mx-auto max-w-7xl"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add Hostel
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage and monitor all registered hostels across your
            network
          </p>
        </div>

        {/* Main Card */}
        <Card className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50">
          <CardContent className="p-7">
            {/* Section Header */}
            <div className="mb-8 flex items-center gap-2">
              <Info className="h-5 w-5 text-foreground" />

              <h2 className="text-2xl font-bold text-foreground">
                1. Basic Information
              </h2>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
              {/* Upload Section */}
              <div>
                <label className="mb-3 block text-sm font-semibold text-foreground">
                  Hostel Logo
                </label>

                <div className="flex h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 transition hover:bg-muted/50">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                  </div>

                  <p className="mt-4 text-xs font-bold tracking-wide text-muted-foreground">
                    UPLOAD LOGO
                  </p>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Square format recommended. PNG or SVG preferred.
                </p>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                {/* Hostel Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Hostel Name
                  </label>

                  <Input
                    placeholder="e.g. Green Valley Residency"
                    className="h-11 rounded-xl border-border bg-background shadow-none"
                    {...register("hostelName", {
                      required: "Hostel name is required",
                    })}
                  />

                  {errors.hostelName && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.hostelName.message}
                    </p>
                  )}
                </div>

                {/* Hostel Type */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Hostel Type
                  </label>

                  <select
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                    {...register("hostelType", {
                      required: true,
                    })}
                  >
                    <option value="">
                      Select property type
                    </option>

                    <option value="BOYS">BOYS</option>

                    <option value="GIRLS">GIRLS</option>

                    <option value="BOTH">BOTH</option>
                  </select>
                </div>

                {/* Package */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Package
                  </label>

                  <select
                    className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                    {...register("packageId", {
                      required: "Package is required",
                    })}
                  >
                    <option value="">
                      Select Package
                    </option>

                    {packages.map((pkg) => (
                      <option
                        key={pkg.id}
                        value={pkg.packageId}
                      >
                        {pkg.packageName}
                      </option>
                    ))}
                  </select>

                  {errors.packageId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.packageId.message}
                    </p>
                  )}
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Contact Number
                    </label>

                    <Input
                      placeholder="Enter Contact Number"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("contactNumber")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Alternate Contact Number
                    </label>

                    <Input
                      placeholder="Enter Alternate Contact Number"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register(
                        "alternateContactNumber"
                      )}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Address Details
                  </label>

                  <Input
                    placeholder="Street, Landmark, City, State, Zip Code"
                    className="h-11 rounded-xl border-border bg-background shadow-none"
                    {...register("address")}
                  />
                </div>

                {/* Pin + Country */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Pin Code
                    </label>

                    <Input
                      placeholder="Enter Pin Code"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("pinCode")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Country
                    </label>

                    <select
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                      {...register("country")}
                    >
                      <option value="">
                        Select Country
                      </option>

                      <option value="India">
                        India
                      </option>

                      <option value="USA">
                        USA
                      </option>
                    </select>
                  </div>
                </div>

                {/* State + City */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      State
                    </label>

                    <Input
                      placeholder="Enter State"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("state")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      City
                    </label>

                    <Input
                      placeholder="Enter City"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("city")}
                    />
                  </div>
                </div>

                {/* Admin Fields */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Name
                    </label>

                    <Input
                      placeholder="Enter Admin Name"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("adminName")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Email
                    </label>

                    <Input
                      placeholder="Enter Admin Email"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("adminEmail")}
                    />
                  </div>
                </div>

                {/* Password + Phone */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Password
                    </label>

                    <Input
                      type="password"
                      placeholder="Enter Password"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("adminPassword")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Phone
                    </label>

                    <Input
                      placeholder="Enter Admin Phone"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("adminPhone")}
                    />
                  </div>
                </div>

                {/* Admin Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Admin Address
                  </label>

                  <Input
                    placeholder="Enter Admin Address"
                    className="h-11 rounded-xl border-border bg-background shadow-none"
                    {...register("adminAddress")}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="mt-7 flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 min-w-[140px] rounded-xl border-border text-sm font-semibold"
            onClick={() => navigate("/admin")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="h-11 min-w-[210px] rounded-xl text-sm font-semibold shadow-sm"
          >
            Complete Registration
          </Button>
        </div>
      </form>
    </div>
  );
}
