import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Upload } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    // Add logic here
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 font-sans">
      <Card className="w-full max-w-[550px] rounded-2xl shadow-sm border border-gray-200">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-4xl font-extrabold tracking-tight">Sign Up</CardTitle>
          <p className="text-gray-500 text-lg">
            Create your account to get started quickly and securely
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Full Name"
                  {...register("fullName", { required: "Name is required" })}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter Email Address"
                  {...register("email", { required: "Email is required" })}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>
            </div>

            {/* Row 2: Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter Phone Number"
                {...register("phone", { required: "Phone is required" })}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>

            {/* Row 3: Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter Full Address"
                {...register("address")}
                className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>

            {/* Row 4: Pin code & Country */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Pin code
                </label>
                <input
                  type="text"
                  placeholder="Enter Code"
                  {...register("pincode")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  Country
                </label>
                <select
                  {...register("country")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none"
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
              </div>
            </div>

            {/* Row 5: State & City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  State
                </label>
                <select
                  {...register("state")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none"
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900">
                  City
                </label>
                <select
                  {...register("city")}
                  className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-white text-gray-600 focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none"
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
              </div>
            </div>

            {/* Row 6: Profile Photo */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Profile Photo
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePhoto"
                  className="hidden"
                  {...register("profilePhoto")}
                />
                <label
                  htmlFor="profilePhoto"
                  className="flex items-center justify-between w-full h-12 px-4 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 text-gray-400"
                >
                  <span className="text-[15px]">Upload Photo</span>
                  <Upload className="w-5 h-5 text-gray-400" />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              disabled={loading}
              type="submit"
              className="w-full h-12 mt-4 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-lg font-medium"
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 flex items-center gap-2 cursor-pointer text-gray-900 hover:underline" onClick={() => navigate("/login")}>
        <ArrowLeft className="w-5 h-5" />
        <span className="text-[16px]">Back to <span className="font-bold">Login</span></span>
      </div>
    </div>
  );
}
