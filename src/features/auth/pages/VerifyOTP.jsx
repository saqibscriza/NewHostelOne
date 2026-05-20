import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";
import {verifyOtpApi, getOtpApi} from "../../../utils/utils";
import toast from "react-hot-toast";


export default function VerifyOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email address";
  const initialToken = location.state?.token;

  const [token, setToken] = useState(initialToken);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [resendLoader, setResendLoader] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendDisabled(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

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

    try {
      setLoaderCheck(true);

      const payload = {
        OTP: otpValue,
        token: token,
      };

      const res = await verifyOtpApi(payload);
      const resData = res?.data;

      // Check if the message contains fail keywords
      const isErrorMsg = resData?.message && (
        resData.message.toLowerCase().includes("invalid") ||
        resData.message.toLowerCase().includes("wrong") ||
        resData.message.toLowerCase().includes("incorrect") ||
        resData.message.toLowerCase().includes("fail") ||
        resData.message.toLowerCase().includes("expire") ||
        resData.message.toLowerCase().includes("not match")
      );

      const isStatusError = resData?.status === 0 || resData?.status === "fail" || resData?.status === "error" || resData?.status === "failure";

      if (isErrorMsg || isStatusError) {
        toast.error(resData?.message || "Invalid OTP");
      } else if (
        resData?.status === "success" || 
        resData?.status === 1 || 
        resData?.success === true ||
        resData?.message?.toLowerCase().includes("success") ||
        res?.status === 200
      ) {
        toast.success(resData?.message || "OTP verified successfully");
        navigate("/reset-password", {
          state: {
            email,
            token: resData?.token || token, // Pass the new token from VerifyOTP, fallback to old token
          },
        });
      } else {
        toast.error(resData?.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoaderCheck(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email || email === "your email address") {
      toast.error("Valid email not found. Please restart the process.");
      return;
    }

    try {
      setResendLoader(true);
      const res = await getOtpApi(email);
      const data = res?.data;

      const isErrorMsg = data?.message && (
        data.message.toLowerCase().includes("invalid") ||
        data.message.toLowerCase().includes("fail") ||
        data.message.toLowerCase().includes("error")
      );
      const isStatusError = data?.status === 0 || data?.status === "fail" || data?.status === "error";

      if (isErrorMsg || isStatusError) {
        toast.error(data?.message || "Failed to resend OTP");
      } else if (
        data?.status === "success" || 
        data?.status === 1 || 
        data?.success === true ||
        data?.message?.toLowerCase().includes("success") ||
        data?.message?.toLowerCase().includes("sent") ||
        res?.status === 200
      ) {
        toast.success(data?.message || "OTP resent successfully");
        if (data?.token) {
          setToken(data?.token); // Update token from resend response
        }
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
        
        // Start the timer
        setTimer(60);
      } else {
        toast.error(data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoader(false);
    }
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
          disabled={otp.join("").length !== 6 || loaderCheck}
          className="w-full h-12 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] disabled:opacity-75 disabled:cursor-not-allowed transition-all"
        >
          Verify
        </Button>

        <div className="text-center mt-6">
          <span className="text-sm text-[#6B7280]">Didn't receive the code? </span>
          <button 
            type="button" 
            onClick={handleResendOtp}
            disabled={resendLoader || timer > 0}
            className="text-sm font-semibold text-[#0F172A] hover:underline disabled:text-[#6B7280] disabled:hover:no-underline disabled:cursor-not-allowed transition-all"
          >
            {resendLoader ? "Sending..." : (timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP")}
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