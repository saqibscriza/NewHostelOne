import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import AuthLayout from "../../auth/component/AuthLayout";

export default function PasswordUpdated() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      title={<>Account Security<br />Updated Successfully</>}
      subtitle="Your password has been updated successfully. You can now log in securely."
    >
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#E2F0EA] flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#E2F0EA]/50 to-transparent rounded-full shadow-[0_10px_20px_rgba(20,184,166,0.1)]"></div>
          <div className="w-12 h-12 bg-[#0F172A] rounded-full flex items-center justify-center relative z-10">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-[#111827] tracking-tight">Password Updated!</h2>
          <p className="text-[#6B7280] text-base max-w-sm mx-auto">
            Your password has been changed successfully. You can now log in with your new credentials.
          </p>
        </div>

        <Button
          onClick={() => navigate("/login")}
          className="w-full h-12 mt-6 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white font-medium text-[15px] flex items-center justify-center gap-2"
        >
          Back to Login <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </AuthLayout>
  );
}
