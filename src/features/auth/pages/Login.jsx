import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { ArrowRight } from "lucide-react";
import { Rings } from "react-loader-spinner";
import { Button } from "../../../components/ui/button";
import toast from "react-hot-toast";
import { loginApi } from "../../../utils/utils";
import { registerApiWithFCMToek } from "../../../utils/utils";
import { Eye, EyeOff } from "lucide-react";
import AuthLayout from "../../auth/component/AuthLayout";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const fcmToken = sessionStorage.getItem("fcmToken2");
  console.log('my hostel fcm token', fcmToken)

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [webNotification, setWebNotification] = useState('WEB');

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const MyRegisterWithFcmTokenApi = async () => {
    try {
      const data = {
        token: fcmToken,
        deviceType: webNotification,
      };
      const response = await registerApiWithFCMToek(data);
      console.log('response of regisetr api with fcm token ----', response)
      if (response?.status === 200) {

      } else {

      }
    } catch (error) {
    } finally {
    }
  }

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

      // 🔥 FIRST HANDLE MULTIPLE HOSTELS
      if (status === "multiple-hostels") {
        const hostels = response?.data?.hostels || [];

        navigate("/select-hostel", {
          state: { token, userRole, hostels },
        });
        setTimeout(() => {
          MyRegisterWithFcmTokenApi()
        }, 1000)
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
        setTimeout(() => {
          MyRegisterWithFcmTokenApi()
        }, 1000)
        login(userRole, token, name);

        toast.success(response?.data?.message || "Login successful");

        if (userRole === "superadmin") navigate("/superadmin");
        else if (userRole === "admin") navigate("/admin");
        else if (userRole === "student") navigate("/student");
        else if (userRole === "chef") navigate("/chef");
        else navigate("/user");

        return;
      }
      // API ERROR
      const errorMessage =
        response?.data?.message || "Login failed";

      toast.error(errorMessage);

    } catch (error) {
      console.error(error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Something went wrong";

      toast.error(errorMessage);

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
            Email Address<span className="text-red-500"> *</span>
          </label>
          <input
            type="text"
            placeholder="Enter your email Address"
            {...register("email", {
              required: "Email is required",
            })}
            className={`w-full p-3.5 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.email ? "border-red-500" : "border-gray-200"
              }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-[rgb(17,24,39)]">
              Password<span className="text-red-500"> *</span>
            </label>

            <span
              onClick={() => navigate("/forgot-password")}
              className="text-xs text-[#6B7280] hover:text-[#111827] cursor-pointer"
            >
              Forgot Password?
            </span>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
              className={`w-full p-3.5 pr-12 rounded-xl border bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 text-sm ${errors.password ? "border-red-500" : "border-gray-200"
                }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

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
