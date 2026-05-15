import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";
import toast from "react-hot-toast";


export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loaderCheck, setLoaderCheck] = useState(false);
  const email = location.state?.email || "your email address";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to next input if there's a value
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const otpValue = otp.join("");

  if (otpValue.length !== 6) {
    toast.error("Please enter valid OTP");
    return;
  }

  navigate("/reset-password", {
    state: {
      email,
      otp: otpValue,
    },
  });
};

  return (
    <AuthLayout
      title={<>Enter OTP to Access<br />Your Hostel Dashboard</>}
      subtitle="Enter the OTP sent to your registered email or mobile number to verify your identity and securely continue resetting your hostel management dashboard password."
    >
      <div className="space-y-2 mb-8">
        <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Verify OTP</h2>
        <p className="text-[#6B7280] text-base">
          We've sent a 6-digit verification code to {email}.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2 sm:gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-10 h-12 sm:w-14 sm:h-16 text-center text-xl font-semibold rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all"
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={otp.join("").length !== 6}
          className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] disabled:opacity-75 disabled:cursor-not-allowed transition-all"
        >
          Verify
        </Button>

        <div className="text-center mt-6">
          <span className="text-sm text-[#6B7280]">Didn't receive the code? </span>
          <button type="button" className="text-sm font-semibold text-[#0F172A] hover:underline">
            Resend OTP
          </button>
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
