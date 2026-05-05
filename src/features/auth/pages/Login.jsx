import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { loginApi } from "../../../utils/utils";

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
          student:"student"
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
      login(userRole, token, name);

      if (userRole === "superadmin") navigate("/superadmin");
      else if (userRole === "admin") navigate("/admin");
      else if (userRole === "student") navigate("/student");
      else navigate("/user");

      return;
    }

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* LOADER */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <Rings height="100" width="100" color="#888" />
        </div>
      )}

      <Card className="w-full max-w-[450px] rounded-2xl border border-border shadow-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <p className="text-muted-foreground">
            Access your dashboard securely
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Email ID / User ID
              </label>

              <input
                type="text"
                placeholder="Enter Email / User ID"
                {...register("email", {
                  required: "Email or Phone is required",
                })}
                className={`w-full p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                })}
                className={`w-full p-3 rounded-lg border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.password ? "border-red-500" : "border-border"
                }`}
              />

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* ERROR */}
            {apiError && (
              <p className="text-red-500 text-sm text-center">{apiError}</p>
            )}

            {/* BUTTON */}
            <Button type="submit" className="w-full h-12">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* SIGNUP */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="font-medium cursor-pointer hover:underline text-foreground"
        >
          Sign Up
        </span>
      </div>
    </div>
  );
}
