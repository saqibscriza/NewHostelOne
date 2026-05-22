import React, { useEffect, useState } from "react";
import { Info, ImagePlus } from "lucide-react";

import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { addHostelApi, getAllPackageApi } from "../../../utils/utils";

export default function AddNewHostel() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const [packages, setPackages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageApi();
        console.log("data of package---", res);

        if (res?.status) {
          setPackages(res.data.allPackages);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackages();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const allowedExtensions = ["jpg", "jpeg", "png"];

    const fileExtension = file.name.split(".").pop().toLowerCase();

    if (
      !allowedTypes.includes(file.type) ||
      !allowedExtensions.includes(fileExtension)
    ) {
      toast.error("Only JPG, JPEG and PNG files are allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be below 2MB");
      return;
    }

    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }

    setPreviewImage(URL.createObjectURL(file));
  };
  useEffect(() => {
    return () => {
      if (previewImage) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const AddNewHostelApi = async (data) => {
    try {
      const payload = {
        hostelName: data.hostelName,
        address: data.address,
        contactNumber: data.contactNumber,
        alternateContactNumber: data.alternateContactNumber,
        city: data.city,
        state: data.state,
        country: data.country,
        pinCode: data.pinCode,
        hostelType: data.hostelType,
        packageId: data.packageId,
        hostelImage: data.hostelImage?.[0],
      };

      if (role !== "admin") {
        payload.adminName = data.adminName;
        payload.adminEmail = data.adminEmail;
      }

      const response = await addHostelApi(payload);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);

        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        toast.error(response?.data?.message || "Failed to create hostel");
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
            Manage and monitor all registered hostels across your network
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

                <label className="flex h-[210px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border bg-muted/30 transition hover:bg-muted/50">
                  <input
                    type="file"
                    accept=".jpeg, .jpg, .png"
                    className="hidden"
                    {...register("hostelImage")}
                    onChange={handleImageUpload}
                  />

                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <>
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-background shadow-sm">
                        <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <p className="mt-4 text-xs font-bold tracking-wide text-muted-foreground">
                        UPLOAD LOGO
                      </p>
                    </>
                  )}
                </label>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Square format recommended. JPG, JPEG or PNG only.{" "}
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
                    <option value="">Select Hostel Type</option>

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
                    <option value="">Select Package</option>

                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.packageId}>
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
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter Contact Number"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                      }}
                      {...register("contactNumber", {
                        required: "Contact number is required",
                        minLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message:
                            "Number must start with 6,7,8,9 and be 10 digits",
                        },
                      })}
                    />
                    {errors.contactNumber && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.contactNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Alternate Contact Number
                    </label>

                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter Alternate Contact Number"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                      }}
                      {...register("alternateContactNumber", {
                        minLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message:
                            "Number must start with 6,7,8,9 and be 10 digits",
                        },
                      })}
                    />
                    {errors.alternateContactNumber && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.alternateContactNumber.message}
                      </p>
                    )}
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
                      type="tel"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Enter Pin Code"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6);
                      }}
                      {...register("pinCode", {
                        required: "Pin code is required",
                        minLength: {
                          value: 6,
                          message: "Pin code must be 6 digits",
                        },
                        maxLength: {
                          value: 6,
                          message: "Pin code must be 6 digits",
                        },
                        pattern: {
                          value: /^[1-9][0-9]{5}$/,
                          message: "Enter valid 6 digit pin code",
                        },
                      })}
                    />
                    {errors.pinCode && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.pinCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Country
                    </label>

                    <select
                      className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none"
                      {...register("country")}
                    >
                      <option value="">Select Country</option>

                      <option value="India">India</option>

                      <option value="USA">USA</option>
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
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                      {...register("adminEmail", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                    />
                    {errors.adminEmail && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.adminEmail.message}
                      </p>
                    )}
                  </div>
                </div> */}

                {/* Password + Phone */}
                {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Password
                    </label>

                    <Input
                      type="password"
                      placeholder="Enter Password"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      {...register("adminPassword", {
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                    />
                    {errors.adminPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.adminPassword.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      Admin Phone
                    </label>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="Enter Admin Phone"
                      className="h-11 rounded-xl border-border bg-background shadow-none"
                      onInput={(e) => {
                        e.target.value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                      }}
                      {...register("adminPhone", {
                        minLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        maxLength: {
                          value: 10,
                          message: "Number must be 10 digits",
                        },
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message:
                            "Number must start with 6,7,8,9 and be 10 digits",
                        },
                      })}
                    />
                    {errors.adminPhone && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.adminPhone.message}
                      </p>
                    )}
                  </div>
                </div> */}

                {/* Admin Address */}
                {/* <div>
                  <label className="mb-2 block text-sm font-semibold text-foreground">
                    Admin Address
                  </label>

                  <Input
                    placeholder="Enter Admin Address"
                    className="h-11 rounded-xl border-border bg-background shadow-none"
                    {...register("adminAddress")}
                  />
                </div> */}
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
