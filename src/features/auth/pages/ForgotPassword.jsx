import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";
import {getOtpApi} from "../../../utils/utils";
import { useState } from "react";
import toast from "react-hot-toast";


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [loaderCheck, setLoaderCheck] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

const onSubmit = async (data) => {
  try {
    setLoaderCheck(true);
    const res = await getOtpApi(data.email);
    const resData = res?.data;

    const isErrorMsg = resData?.message && (
        resData.message.toLowerCase().includes("invalid") ||
        resData.message.toLowerCase().includes("fail") ||
        resData.message.toLowerCase().includes("error") ||
        resData.message.toLowerCase().includes("not found")
      );

      const isStatusError = resData?.status === 0 || resData?.status === "fail" || resData?.status === "error" || resData?.status === "failure";

      if (isErrorMsg || isStatusError) {
        toast.error(resData?.message || "User not found or failed to send OTP");
      } else if (
        resData?.status === "success" || 
        resData?.status === 1 || 
        resData?.success === true ||
        resData?.message?.toLowerCase().includes("success") ||
        res?.status === 200
      ) {
        toast.success(resData?.message || "OTP sent successfully");
        navigate("/verify-otp", {
          state: {
            email: data.email,
            token: resData?.token,
          },
        });
      } else {
        toast.error(
          resData?.message || "Failed to send OTP"
        );
      }
  } catch (error) {
    console.log(error);
    toast.error(
      error?.response?.data?.message ||
      "Something went wrong"
    );
  } finally {
    setLoaderCheck(false);
  }
};

  return (
    <AuthLayout
      title={<>Reset Your Dashboard<br />Access Securely</>}
      subtitle="Reset your password securely to regain access to your hostel management dashboard. Enter your registered email address, and we'll help you restore your account access quickly."
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Forgot Password</h2>
        <p className="text-[#6B7280] text-base">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#111827]">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter Email Address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "invalid email address",
              },
            })}
            className={`w-full p-3.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loaderCheck}
            className="h-12 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
          >
            Send OTP <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100 flex justify-center">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 text-sm font-semibold text-[#111827] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
      </div>
    </AuthLayout>
  );
}
