import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";
import { getLocationByPincodeApi, validateAdminDetailsApi } from "../../../utils/utils";
import {Input} from "../../../components/ui/input";
import toast from "react-hot-toast";


export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const savedAdminInfo = location.state?.adminInfo;
  const savedHostelDetails = location.state?.hostelDetails;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: savedAdminInfo || {}
  });

const [isLoading, setIsLoading] = useState(false);
const pinCode = watch("pinCode");

useEffect(() => {
  const fetchLocation = async () => {
    if (pinCode && pinCode.length === 6) {
      try {
        const res = await getLocationByPincodeApi(pinCode);

        console.log("PINCODE API RESPONSE:", res);

        if (res?.data?.status === "failure" || res?.status === "failure" || res?.status === 400 || res?.status === 404 || res?.data?.status === 404 || res?.data?.status === 400 || res?.status === "error") {
          toast.error(res?.data?.message || res?.message || "Invalid PinCode");
          return;
        }

        // agar axios use kar rahe ho
        const locationData = res?.data || res;

        if (locationData) {
          setValue("country", locationData.country || "");
          setValue("state", locationData.state || "");
          setValue(
            "city",
            locationData.district ||
              locationData.city ||
              locationData.region ||
              ""
          );
        }
      } catch (error) {
        console.log("Location fetch error:", error);
      }
    }
  };

  fetchLocation();
}, [pinCode, setValue]);


  // We can watch the photo to show a preview if desired, otherwise standard UI
  const profilePhoto = watch("profilePhoto");

const onNextStep = async (data) => {
  setIsLoading(true);

  try {
    // FormData create
    const formData = new FormData();

    formData.append("email", data.email);
    formData.append("phone", data.phone);

    // API call with formData
    const validationRes = await validateAdminDetailsApi(formData);

    // Failure handling
    if (
      validationRes?.data?.status === "failure" ||
      validationRes?.status === "failure" ||
      validationRes?.status === 400 ||
      validationRes?.data?.status === 400 ||
      validationRes?.status === "error"
    ) {
      toast.error(
        validationRes?.data?.message ||
          validationRes?.message ||
          "Validation failed"
      );

      setIsLoading(false);
      return;
    }

    // Success toast
    toast.success("Validation successful");

    // Profile photo preserve
    if (!data.profilePhoto || data.profilePhoto.length === 0) {
      data.profilePhoto = savedAdminInfo?.profilePhoto;
    }

    // Navigate next page
    navigate("/register-hostel", {
      state: {
        adminInfo: data,
        hostelDetails: savedHostelDetails,
      },
    });
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "An error occurred during validation"
    );
  } finally {
    setIsLoading(false);
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
            <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-sm font-semibold">1</div>
            <span className="text-xs font-semibold text-[#111827]">Admin Info</span>
          </div>
          <div className="w-16 h-[2px] bg-gray-200 -mt-6"></div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center text-sm font-semibold">2</div>
            <span className="text-xs font-medium text-gray-500">Hostel Details</span>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Admin Personal Info</h2>
          <p className="text-[#6B7280] text-sm mt-1">
            Tell us a bit about yourself to get started with Focus.
          </p>
        </div>

        <form onSubmit={handleSubmit(onNextStep)} className="space-y-4">
          
          {/* Profile Photo */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
               {profilePhoto && profilePhoto.length > 0 ? (
                 <img src={URL.createObjectURL(profilePhoto[0])} alt="Profile" className="w-full h-full object-cover" />
               ) : savedAdminInfo?.profilePhoto && savedAdminInfo.profilePhoto.length > 0 ? (
                 <img src={URL.createObjectURL(savedAdminInfo.profilePhoto[0])} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <Camera className="w-6 h-6 text-gray-400" />
               )}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827]">Profile Photo</p>
              <p className="text-xs text-gray-500 mt-1 mb-2">JPG, PNG or JPEG Max size 5MB</p>
              <div className="relative">
                <Input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  {...register("profilePhoto")}
                  // {...register("profilePhoto", { required: savedAdminInfo?.profilePhoto ? false : "Profile photo is required" })}
                />
                <label
                  htmlFor="profilePhoto"
                  className="text-sm text-blue-600 font-medium cursor-pointer hover:underline"
                >
                  Upload Photo
                </label>
              </div>
              {errors.profilePhoto && <span className="text-red-500 text-xs mt-1 block">{errors.profilePhoto.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-2">
  <label className="text-sm font-semibold text-[#111827]">
    Admin Full Name<span className="text-red-500"> *</span>
  </label>

  <Input
    type="text"
    placeholder="Enter Admin Full Name"
    {...register("fullName", {
      required: "Name is required",
      minLength: {
        value: 3,
        message: "Name must be at least 3 characters",
      },
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: "Special characters and numbers are not allowed",
      },
    })}
    onInput={(e) => {
      e.target.value = e.target.value.replace(/[^A-Za-z ]/g, "");
    }}
    className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
      errors.fullName ? "border-red-500" : "border-gray-200"
    }`}
  />

  {errors.fullName && (
    <span className="text-red-500 text-xs">
      {errors.fullName.message}
    </span>
  )}
</div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                Admin Email Address<span className="text-red-500"> *</span>
              </label>
              <Input
                type="email"
                placeholder="Enter Email Address"
                {...register("email", { 
                  required: "Email is required",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "invalid email address" }
                })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.email ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<div className="space-y-2">
  <label className="text-sm font-semibold text-[#111827]">
    Admin Phone Number<span className="text-red-500"> *</span>
  </label>

  <Input
    type="tel"
    placeholder="Enter Phone Number"
    {...register("phone", {
      required: "Phone is required",
      pattern: {
        value: /^[6-9]\d{9}$/,
        // message:
        //   "Phone number must be 10 digits and start with 6, 7, 8, or 9",
      },
    })}
    onInput={(e) => {
      e.target.value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 10);
    }}
    className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
      errors.phone ? "border-red-500" : "border-gray-200"
    }`}
  />

  {errors.phone && (
    <span className="text-red-500 text-xs">
      {errors.phone.message}
    </span>
  )}
</div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">
                PIN Code<span className="text-red-500"> *</span>
              </label>
              <Input
                type="text"
                placeholder="6-digit code"
                {...register("pinCode", { 
                  required: "Pin code is required",
                  pattern: { value: /^\d{6}$/, message: "Must be exactly 6 digits" }
                })}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/\D/g, '').slice(0, 6);
                }}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.pinCode ? "border-red-500" : "border-gray-200"}`}
              />
              {errors.pinCode && <span className="text-red-500 text-xs">{errors.pinCode.message}</span>}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#111827]">
              Address<span className="text-red-500"> *</span>
            </label>
            <textarea
              rows={2}
              placeholder="Street address, building, floor..."
              {...register("address", { required: "Address is required" })}
              className={`w-full p-2.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm resize-none ${errors.address ? "border-red-500" : "border-gray-200"}`}
            />
            {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">Country<span className="text-red-500"> *</span></label>
              <Input
                disabled
                type="text"
                placeholder="Country"
                {...register("country", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.country ? "border-red-500" : "border-gray-200"}`}
              />
            </div>


            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">State<span className="text-red-500"> *</span></label>
              <Input
                disabled
                type="text"
                placeholder="State"
                {...register("state", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.state ? "border-red-500" : "border-gray-200"}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#111827]">City<span className="text-red-500"> *</span></label>
              <Input
                disabled
                type="text"
                placeholder="City"
                {...register("city", { required: "Required" })}
                className={`w-full p-3 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.city ? "border-red-500" : "border-gray-200"}`}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-medium text-[#6B7280] hover:text-[#111827]"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
            <Button
              type="submit"
              className="h-11 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-sm flex items-center gap-2"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}