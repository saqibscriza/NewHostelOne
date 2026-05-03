import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../src/context/AuthContext";
import { useForm } from "react-hook-form";
import { Rings } from "react-loader-spinner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
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

    await new Promise((r) => setTimeout(r, 50));
    const startTime = Date.now();

    try {
      const response = await loginApi({
        username: data.email, // 👈 same field (email or phone)
        password: data.password,
      });

      const elapsed = Date.now() - startTime;
      const remainingTime = 2500 - elapsed;

      if (remainingTime > 0) {
        await new Promise((r) => setTimeout(r, remainingTime));
      }

      if (response?.data?.status === "success") {
        const token = response.data.token;
        console.log("My token :", token);
        let userRole = response.data.role;
        localStorage.setItem("token", token);

        userRole = userRole?.toLowerCase()?.trim();

        if (!userRole) {
          setApiError("Role not found");
          return;
        }

        login(userRole, token);

        if (userRole === "superadmin" || userRole === "super-admin") {
          navigate("/");
        } else if (userRole === "admin") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else if (response?.data?.status === "multiple-hostels") {
        const token = response.data.token;
        let userRole = response.data.role;
        const hostels = response.data.hostels || [];

        userRole = userRole?.toLowerCase()?.trim();

        if (!userRole) {
          setApiError("Role not found");
          return;
        }

        // Navigate to select-hostel page with the temporary token and hostels list
        navigate("/select-hostel", { state: { token, userRole, hostels } });
      } else {
        setApiError(response?.data?.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setApiError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <Rings height="100" width="100" color="#bec4c4" />
        </div>
      )}

      <Card className="w-full max-w-[450px] rounded-2xl shadow-sm border border-gray-200">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-4xl font-extrabold">Login</CardTitle>
          <p className="text-gray-500 text-lg">
            Access your dashboard securely
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-900">
                Email ID / User ID
              </label>

              <input
                type="text"
                placeholder="Enter Email / User ID"
                {...register("email", {
                  required: "Email or Phone is required",
                  validate: (value) => {
                    const emailRegex =
                      /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

                    const phoneRegex = /^[6-9]\d{9}$/;

                    if (emailRegex.test(value) || phoneRegex.test(value)) {
                      return true;
                    }

                    return "Enter valid Email or Phone Number";
                  },
                })}
                className={`w-full p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-900">
                  Password
                </label>
                <a href="#" className="text-sm text-gray-900 hover:underline">
                  Forgot your password?
                </a>
              </div>

              <input
                type="password"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />

              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            {/* 
            API ERROR
            {apiError && (
              <p className="text-red-600 text-sm text-center">{apiError}</p>
            )} */}

            {/* BUTTON */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0f172a] text-white rounded-lg"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-gray-900 text-[15px]">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="font-bold cursor-pointer hover:underline"
        >
          Sign Up
        </span>
      </div>
    </div>
  );
}
