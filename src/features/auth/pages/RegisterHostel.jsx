import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import toast from "react-hot-toast";
import { Input } from "../../../components/ui/input";

import { Button } from "../../../components/ui/button";
import {signUpApi,getLocationByPincodeApi} from "../../../utils/utils";
// import { getAllPackageApi} from "../../../utils/utils";
import AuthLayout from "../../auth/component/AuthLayout";

export default function RegisterHostel() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminInfo = location.state?.adminInfo;
  const savedHostelDetails = location.state?.hostelDetails;

  const [packages, setPackages] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: savedHostelDetails || { package: "FREE_TIER" }
  });

  const propertyLogo = watch("propertyLogo");
  const hostelPinCode = watch("hostelPinCode");

useEffect(() => {
  const fetchLocation = async () => {
    if (hostelPinCode && String(hostelPinCode).length === 6) {
      try {
        const res = await getLocationByPincodeApi(hostelPinCode);

        console.log("LOCATION API RES:", res);

        const locationData = res?.data || res;

        if (locationData) {
          setValue("hostelCountry", locationData.country || "");
          setValue("hostelState", locationData.state || "");

          setValue(
            "hostelCity",
            locationData.district ||
              locationData.city ||
              locationData.region ||
              ""
          );
        } else {
          setValue("hostelCountry", "");
          setValue("hostelState", "");
          setValue("hostelCity", "");

          toast.error("Invalid pincode");
        }
      } catch (error) {
        console.log("Location fetch error:", error);

        setValue("hostelCountry", "");
        setValue("hostelState", "");
        setValue("hostelCity", "");

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data ||
            "Invalid pincode"
        );
      }
    }
  };

  fetchLocation();
}, [hostelPinCode, setValue]);


  useEffect(() => {
    // If no admin info is present, optionally redirect back to step 1
    if (!adminInfo) {
      navigate("/signup");
    }
  }, [adminInfo, navigate]);

  // useEffect(() => {
  //   const fetchPackages = async () => {
  //     try {
  //       const res = await getAllPackageApi();
  //       if (res?.data) {
  //         setPackages(res.data);
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   fetchPackages();
  // }, []);

  const MySignUp = async (data) => {

      // Profile Photo Size Check
  if (adminInfo?.profilePhoto?.[0]?.size > 5 * 1024 * 1024) {
    toast.error("Profile photo size must be less than 5MB");
    return;
  }

  // Property Logo Size Check
  if (data?.propertyLogo?.[0]?.size > 5 * 1024 * 1024) {
    toast.error("Property logo size must be less than 5MB");
    return;
  }


    const formData = new FormData();

    // Step 1 mapping (Admin Info) - map to what signUpApi expects
    if (adminInfo) {
      formData.append("fullName", adminInfo.fullName);
      formData.append("email", adminInfo.email);
      formData.append("phone", adminInfo.phone);
      formData.append("address", adminInfo.address);
      formData.append("pinCode", adminInfo.pinCode);
      formData.append("country", adminInfo.country);
      formData.append("state", adminInfo.state);
      formData.append("city", adminInfo.city);
      if (adminInfo.profilePhoto && adminInfo.profilePhoto[0]) {
        formData.append("profilePhoto", adminInfo.profilePhoto[0]);
      }
    }

    // Step 2 mapping (Hostel Details) - using standard names, check if backend accepts them via signupApi
    // Wait, earlier addHostelRegisterApi had: hostelName, hostelType, address, contactNumber, alternateContactNumber, package, pinCode, country, state, city, profilePhoto (as logo)
    // Here we'll append what we have. It's up to the backend to process these.
    formData.append("hostelName", data.hostelName);
    formData.append("hostelType", data.hostelType);
    formData.append("package", data.package);
    formData.append("hostelPinCode", data.hostelPinCode);
    formData.append("hostelAddress", data.hostelAddress);
    formData.append("hostelCountry", data.hostelCountry);
    formData.append("hostelState", data.hostelState);
    formData.append("hostelCity", data.hostelCity);

    if (data.propertyLogo && data.propertyLogo[0]) {
      formData.append("hostelLogo", data.propertyLogo[0]);
    }

    try {
      setLoaderCheck(true);
      const res = await signUpApi(formData);
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "Signup successful");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
              toast.error(
        res?.data?.message || "Signup failed. Please try again."
      );
      }
    } catch (error) {
          console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Something went wrong. Please try again."
    );
    } finally {
      setLoaderCheck(false);
    }
  };

  return (
    <AuthLayout
      title={<>Start Your Hostel<br />Journey Today</>}
      subtitle="Empowering property managers with high-stakes precision and total control. Join the industry standard for hostel management."
    >
      <div className="flex flex-col space-y-4">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm font-semibold">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-xs font-semibold text-[#111827]">Admin Info</span>
          </div>
          <div className="w-16 h-[2px] bg-[#0F172A] -mt-6"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm font-semibold">2</div>
            <span className="text-xs font-semibold text-[#111827]">Hostel Details</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Hostel Details</h2>
          <p className="text-[#6B7280] text-sm mt-1">
            Tell us about your property to complete the setup.
          </p>
        </div>

        <form onSubmit={handleSubmit(MySignUp)} className="space-y-4">
          {/* Property Logo */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
               {propertyLogo && propertyLogo.length > 0 ? (
                 <img src={URL.createObjectURL(propertyLogo[0])} alt="Property" className="w-full h-full object-cover" />
               ) : (
                 <Camera className="w-6 h-6 text-gray-400" />
               )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Upload your Property Logo</p>
              <p className="text-xs text-gray-500 mt-1 mb-2">JPG, PNG or JPEG. Max size 5MB</p>
              <div className="relative">
<Input
  type="file"
  id="propertyLogo"
  className="hidden"
  accept=".jpg,.jpeg,.png"
  {...register("propertyLogo", {
    onChange: (e) => {
      const file = e.target.files?.[0];

      if (file && file.size > 5 * 1024 * 1024) {
        toast.error("Property logo size must be less than 5MB");
        e.target.value = "";
      }
    }
  })}
/>
                <label
                  htmlFor="propertyLogo"
                  className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  Upload Photo
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-2">
  <label className="text-sm font-semibold text-[#111827]">
    Hostel Name<span className="text-red-500"> *</span>
  </label>

  <Input
    type="text"
    placeholder="Enter Hostel Name"
    {...register("hostelName", {
      required: "Hostel name is required",
      pattern: {
        value: /^[A-Za-z0-9\s&.-]{3,100}$/,
        message:
          "Hostel name must be 3-100 characters and can contain letters, numbers, spaces, &, . and - only",
      },
    })}
    className={`w-full bg-white text-sm ${
      errors.hostelName ? "border-red-500" : ""
    }`}
  />

  {errors.hostelName && (
    <span className="text-red-500 text-xs">
      {errors.hostelName.message}
    </span>
  )}
</div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Hostel Type<span className="text-red-500"> *</span>
              </label>
              <select
                {...register("hostelType", { required: "Required" })}
                className={`w-full px-3 h-[46px] rounded-xl border bg-white text-sm focus:outline-none focus:ring-1 focus:ring-gray-300 ${errors.hostelType ? "border-red-500" : "border-gray-200"}`}
                defaultValue=""
              >
                <option value="" disabled hidden>Select Hostel Type</option>
                <option value="BOYS">BOYS</option>
                <option value="GIRLS">GIRLS</option>
                <option value="BOTH">BOTH</option>
              </select>
              {errors.hostelType && <span className="text-red-500 text-xs">{errors.hostelType.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-2">
  <label className="text-sm font-semibold text-[#111827]">
    Package<span className="text-red-500"> *</span>
  </label>

  <select
    {...register("package")}
    disabled
    defaultValue="FREE_TIER"
    className="w-full px-3 h-[46px] rounded-xl border border-gray-200 bg-gray-100 text-gray-400 text-sm cursor-not-allowed focus:outline-none"
  >
    <option value="FREE_TIER">
      Free Tier
    </option>
  </select>
</div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                PIN Code<span className="text-red-500"> *</span>
              </label>
              <Input
                type="text"
                placeholder="6-digit code"
                {...register("hostelPinCode", { 
                  required: "Pin code is required",
                  pattern: { value: /^\d{6}$/, message: "Must be exactly 6 digits" }
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                }}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.hostelPinCode ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.hostelPinCode && <span className="text-red-500 text-xs">{errors.hostelPinCode.message}</span>}
            </div>
          </div>

          {/* <div className="space-y-2">
            <label className="text-sm font-semibold text-[#111827]">
              Address<span className="text-red-500"> *</span>
            </label>
            <textarea
              rows={2}
              placeholder="Street address, building, floor..."
              {...register("hostelAddress", { required: "Address is required" })}
              className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm resize-none ${errors.hostelAddress ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.hostelAddress && <span className="text-red-500 text-xs">{errors.hostelAddress.message}</span>}
          </div> */}


          <div className="space-y-2">
  <label className="text-sm font-semibold text-[#111827]">
    Address<span className="text-red-500"> *</span>
  </label>

  <Input
    type="text"
    placeholder="Street address, building, floor..."
    {...register("hostelAddress", {
      required: "Address is required",
      minLength: {
        value: 3,
        message: "Address must be at least 3 characters",
      },
    })}
      className={`w-full p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
    errors.hostelAddress ? "border-red-500" : "border-gray-200"
  }`}
  />

  {errors.hostelAddress && (
    <span className="text-red-500 text-xs">
      {errors.hostelAddress.message}
    </span>
  )}
</div>

<div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">Country<span className="text-red-500">*</span></label>
              <Input
              disabled
                type="text"
                placeholder="Country"
                {...register("hostelCountry", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.hostelCountry ? "border-red-500" : "border-gray-200"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">State<span className="text-red-500">*</span></label>
              <Input
              disabled
                type="text"
                placeholder="State"
                {...register("hostelState", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.hostelState ? "border-red-500" : "border-gray-200"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">City<span className="text-red-500">*</span></label>
              <Input
              disabled
                type="text"
                placeholder="City"
                {...register("hostelCity", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.hostelCity ? "border-red-500" : "border-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/signup", { state: { adminInfo: adminInfo, hostelDetails: getValues() } })}
              className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Admin Info
            </button>
            <Button
              type="submit"
              disabled={loaderCheck}
              className="h-11 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-sm flex items-center gap-2"
            >
             Sign Up <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}