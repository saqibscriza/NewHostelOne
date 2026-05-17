import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";
import { setPasswordApi } from "../../../utils/utils";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const token = location.state?.token;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loaderCheck, setLoaderCheck] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const newPassword = watch("newPassword");

  const onSubmit = async (data) => {
    try {
      setLoaderCheck(true);

      const payload = {
        token: token,
        password: data.newPassword,
        confirmPassword: data.confirmPassword,
      };

      const res = await setPasswordApi(payload);

      if (
        res?.data?.status === "success" || 
        res?.data?.status === 1 || 
        res?.data?.success === true ||
        (res?.status === 200 && res?.data?.status !== 0 && res?.data?.status !== "error" && res?.data?.status !== "fail")
      ) {
        toast.success(res?.data?.message || "Password updated successfully");
        navigate("/password-updated");
      } else {
        toast.error(res?.data?.message || "Failed to reset password");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      setLoaderCheck(false);
    }
  };

  return (
    <AuthLayout
      title={<>Set a New Password<br />for Your Dashboard</>}
      subtitle="Create a strong new password to secure your dashboard account and regain safe access to your hostel management system."
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Reset Password</h2>
        <p className="text-[#6B7280] text-base">
          Create a new, strong password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6B7280] tracking-wider uppercase">
            NEW PASSWORD
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`w-full p-3.5 pr-12 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
                errors.newPassword ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#6B7280] tracking-wider uppercase">
            CONFIRM PASSWORD
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className={`w-full p-3.5 pr-12 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
                errors.confirmPassword ? "border-red-500" : "border-gray-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loaderCheck}
          className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed transition-all"
        >
          Update Password <ArrowRight className="w-4 h-4" />
        </Button>
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