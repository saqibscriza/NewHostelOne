import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Rings } from "react-loader-spinner";
import { Button } from "../../../components/ui/button";
import { loginApi } from "../../../utils/utils";
import AuthLayout from "../../auth/component/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setApiError("");

    try {
      const response = await loginApi({
        username: data.email,
        password: data.password,
      });

        const status = response.data.status;
        const token = response.data.token;
        const name = response.data.name || response.data.studentName || response.data.userName || response.data.fullName || "";

        let userRole = response.data.role;

        // normalize role
        const roleMap = {
          superadmin: "superadmin",
          "super-admin": "superadmin",
          super_admin: "superadmin",
          admin: "admin",
          user: "user",
          student: "student",
          chef: "chef",
        };

        userRole =
          roleMap[userRole?.toLowerCase()] || userRole?.toLowerCase()?.trim();

        if (!userRole) {
          setApiError("Role not found");
          return;
        }
        
    // 🔥 FIRST HANDLE MULTIPLE HOSTELS
    if (status === "multiple-hostels") {
      const hostels = response?.data?.hostels || [];

      navigate("/select-hostel", {
        state: { token, userRole, hostels },
      });
      return;
    }

    // 🔥 THEN HANDLE SUCCESS
    if (status === "success") {
      const staffId =
        response.data.staffId ||
        response.data.chefId ||
        response.data.userId ||
        response.data.id;

      if (userRole === "chef" && staffId) {
        sessionStorage.setItem("staffId", staffId);
      }

      login(userRole, token, name);

      if (userRole === "superadmin") navigate("/superadmin");
      else if (userRole === "admin") navigate("/admin");
      else if (userRole === "student") navigate("/student");
      else if (userRole === "chef") navigate("/chef");
      else navigate("/user");

      return;
    }
    // window.location.reload()

    // ❌ ERROR
    setApiError(response?.data?.message || "Login failed");

  } catch (error) {
    console.error(error);
    setApiError("Server error. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      title={<>Access Your Hostel<br />Management Dashboard</>}
      subtitle="Manage your hostel operations seamlessly with secure access to your dashboard. Monitor bookings, residents, inventory, staff, and daily activities all in one centralized platform."
    >
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <Rings height="100" width="100" color="#888" />
        </div>
      )}

      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Welcome Back</h2>
        <p className="text-[#6B7280] text-base">
          Login to manage your hostel with precision and control.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-[#111827]">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Enter your email Address"
            {...register("email", {
              required: "Email is required",
            })}
            className={`w-full p-3.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[#111827]">
              Password<span className="text-red-500">*</span>
            </label>
            <span 
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-[#6B7280] hover:text-[#111827] cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
            })}
            className={`w-full p-3.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${
              errors.password ? "border-red-500" : "border-gray-200"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {apiError && (
          <p className="text-red-500 text-sm font-medium">{apiError}</p>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" className="h-12 px-8 rounded-full bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] flex items-center gap-2">
            Continue <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-[#6B7280]">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="font-semibold text-[#111827] cursor-pointer hover:underline"
        >
          Sign up
        </span>
      </div>
    </AuthLayout>
  );
}
