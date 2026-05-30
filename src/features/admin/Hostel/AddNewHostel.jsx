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
  getLocationByPincodeApi,
} from "../../../utils/utils";

export default function AddNewHostel() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("role");

  const [freeTierPackage, setFreeTierPackage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      packageId: "",
    },
  });

  const hostelImageRegister = register("hostelImage");
  const pinCode = watch("pinCode");

  useEffect(() => {
    const fetchFreeTierPackage = async () => {
      try {
        const res = await getAllPackageApi();
        const packageList = res?.data?.allPackages || [];
        const freeTier = packageList.find(
          (pkg) => pkg?.packageName === "Free Tier",
        );

        if (freeTier?.packageId) {
          setFreeTierPackage(freeTier);
          setValue("packageId", freeTier.packageId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFreeTierPackage();
  }, [setValue]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (pinCode?.length !== 6) return;

      try {
        const res = await getLocationByPincodeApi(pinCode);
        const locationData = res?.data || res;

        if (
          !locationData ||
          locationData?.status === "failure" ||
          locationData?.statusCode === 400 ||
          locationData?.statusCode === 404
        ) {
          toast.error(locationData?.message || "Invalid PinCode");
          setValue("country", "");
          setValue("state", "");
          setValue("city", "");
          return;
        }

        setValue("country", locationData.country || "");
        setValue("state", locationData.state || "");
        setValue(
          "city",
          locationData.district || locationData.city || locationData.region || "",
        );
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Invalid PinCode");
        setValue("country", "");
        setValue("state", "");
        setValue("city", "");
      }
    };

    fetchLocation();
  }, [pinCode, setValue]);

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
      const payload = new FormData();

      payload.append("hostelName", data.hostelName || "");
      payload.append("address", data.address || "");
      payload.append("contactNumber", data.contactNumber || "");
      payload.append(
        "alternateContactNumber",
        data.alternateContactNumber || "",
      );
      payload.append("city", data.city || "");
      payload.append("state", data.state || "");
      payload.append("country", data.country || "");
      payload.append("pinCode", data.pinCode || "");
      payload.append("hostelType", data.hostelType || "");
      const packageId = data.packageId || freeTierPackage?.packageId || "";

      if (!packageId) {
        toast.error("Free Tier package not found");
        return;
      }

      payload.append("packageId", packageId);

      if (data.hostelImage?.[0]) {
        payload.append("hostelImage", data.hostelImage[0]);
      }

      if (role !== "admin") {
        payload.append("adminName", data.adminName || "");
        payload.append("adminEmail", data.adminEmail || "");
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
                    {...hostelImageRegister}
                    onChange={(event) => {
                      hostelImageRegister.onChange(event);
                      handleImageUpload(event);
                    }}
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

                  <input type="hidden" {...register("packageId")} />

                  <select
                    value={freeTierPackage?.packageId || ""}
                    disabled
                    className="h-11 w-full cursor-not-allowed rounded-xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                  >
                    <option value={freeTierPackage?.packageId || ""}>
                      {freeTierPackage?.packageName || "Free Tier"}
                    </option>
                  </select>
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

                    <Input
                      readOnly
                      placeholder="Country"
                      className="h-11 rounded-xl border-border bg-muted shadow-none"
                      {...register("country")}
                    />
                  </div>
                </div>

                {/* State + City */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      State
                    </label>

                    <Input
                      readOnly
                      placeholder="Enter State"
                      className="h-11 rounded-xl border-border bg-muted shadow-none"
                      {...register("state")}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-foreground">
                      City
                    </label>

                    <Input
                      readOnly
                      placeholder="Enter City"
                      className="h-11 rounded-xl border-border bg-muted shadow-none"
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
