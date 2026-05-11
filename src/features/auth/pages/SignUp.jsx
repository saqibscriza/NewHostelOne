import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload } from "lucide-react";
import { signUpApi } from "../../../utils/utils";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";


export default function SignUp() {
  const navigate = useNavigate();
  const [loaderCheck, setLoaderCheck] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const MySignUp = async (data) => {
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("pinCode", data.pinCode);
    formData.append("country", data.country);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("profilePhoto", data.profilePhoto[0]);
    try {
      setLoaderCheck(true); // loader start
      const res = await signUpApi(formData);
          if (res?.data?.status === "success") {
        console.log("Success");
        // toast.success(response?.data?.message);
        setLoaderCheck(false);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 font-sans">
      <Card className="w-full max-w-[550px] rounded-2xl shadow-sm border border-gray-200">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Sign Up</CardTitle>
          <p className="text-gray-500 text-base">
            Create your account to get started quickly and securely
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(MySignUp)} className="space-y-4">
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  {...register("fullName", { required: "Name is required" })}
                  className={`w-full h-10 px-3 rounded-lg border ${errors.fullName ? "border-red-500" : "border-gray-200"} bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300`}
                />
                {errors.fullName && <span className="text-red-500 text-xs">{errors.fullName.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "invalid email address"
                    }
                  })}
                  className={`w-full h-10 px-3 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-200"} bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300`}
                />
                {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
              </div>
            </div>

            {/* Row 2: Phone Number */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                {...register("phone", { 
                  required: "Phone is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Invalid phone number, must be 10 digits"
                  }
                })}
                className={`w-full h-10 px-3 rounded-lg border ${errors.phone ? "border-red-500" : "border-gray-200"} bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300`}
              />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
            </div>

            {/* Row 3: Address */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter Full Address"
                {...register("address", { required: "Address is required" })}
                className={`w-full h-10 px-3 rounded-lg border ${errors.address ? "border-red-500" : "border-gray-200"} bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300`}
              />
              {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
            </div>

            {/* Row 4: Pin code & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  Pin code
                </label>
                <input
                  type="text"
                  placeholder="Enter Code"
                  {...register("pinCode", { required: "Pin code is required" })}
                  className={`w-full h-10 px-3 rounded-lg border ${errors.pinCode ? "border-red-500" : "border-gray-200"} bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300`}
                />
                {errors.pinCode && <span className="text-red-500 text-xs">{errors.pinCode.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  Country
                </label>
                <select
                  {...register("country", { required: "Country is required" })}
                  className={`w-full h-10 px-3 py-0 rounded-lg border ${errors.country ? "border-red-500" : "border-gray-200"} bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none`}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em"
                  }}
                  defaultValue=""
                >
                  <option value="" disabled hidden>Select country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                </select>
                {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
              </div>
            </div>

            {/* Row 5: State & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  State
                </label>
                <select
                  {...register("state", { required: "State is required" })}
                  className={`w-full h-10 px-3 py-0 rounded-lg border ${errors.state ? "border-red-500" : "border-gray-200"} bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none`}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em"
                  }}
                  defaultValue=""
                >
                  <option value="" disabled hidden>Select State</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
                {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-900">
                  City
                </label>
                <select
                  {...register("city", { required: "City is required" })}
                  className={`w-full h-10 px-3 py-0 rounded-lg border ${errors.city ? "border-red-500" : "border-gray-200"} bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none`}
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 1rem center",
                    backgroundSize: "1em"
                  }}
                  defaultValue=""
                >
                  <option value="" disabled hidden>Select City</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Mumbai">Mumbai</option>
                </select>
                {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
              </div>
            </div>

            {/* Row 6: Profile Photo */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-900">
                Profile Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  {...register("profilePhoto", { required: "Profile photo is required" })}
                />
                <label
                  htmlFor="profilePhoto"
                  className={`flex items-center justify-between w-full h-10 px-3 rounded-lg border ${errors.profilePhoto ? "border-red-500" : "border-gray-200"} bg-white cursor-pointer hover:bg-gray-50 text-gray-400`}
                >
                  <span className="text-[14px]">Upload Photo</span>
                  <Upload className="w-5 h-5 text-gray-400" />
                </label>
                {errors.profilePhoto && <span className="text-red-500 text-xs">{errors.profilePhoto.message}</span>}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={loaderCheck}
              type="submit"
              className="w-full h-11 mt-4 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg font-medium"
            >
              {loaderCheck ? "Submitting..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6 flex items-center gap-2 cursor-pointer text-gray-900 hover:underline" onClick={() => navigate("/login")}>
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[16px]">Back to <span className="font-bold">Login</span></span>
      </div>
    </div>
  );
}

