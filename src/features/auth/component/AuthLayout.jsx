import React from "react";
import { ShieldCheck } from "lucide-react";
import HostelLogo from "../../../assets/HostelLogo.png";
import AuthImage from "../../../assets/AuthImage.png";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAFA] font-sans">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-neutral-900 text-white overflow-hidden">
        {/* Background Image */}
<div className="absolute inset-0">
  <img
    src={AuthImage}
    alt="Hostel Lobby"
    className="w-full h-full object-cover brightness-110"
  />

  <div className="absolute inset-0 bg-black/30" />
</div>

        {/* Content */}
        <div className="relative z-10 p-10 lg:p-14 flex flex-col justify-between h-full w-full">
          {/* Logo */}
<div className="flex items-center gap-3">
  <img
    src={HostelLogo}
    alt="Hostelo Logo"
    className="h-10 w-auto object-contain"
  />
</div>

          <div className="space-y-6 max-w-lg mb-10">
            <h1 className="text-4xl lg:text-[44px] font-bold leading-[1.15] text-white">
               {title}
            </h1>
            <p className="text-lg lg:text-[19px] text-gray-300 leading-relaxed font-medium">
               {subtitle}
            </p>
            <div className="inline-flex items-center gap-3 px-5 py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 mt-4">
              <ShieldCheck className="w-5 h-5 text-white" />
              <span className="text-[15px] font-medium text-white shadow-sm">
                Safe, Secure, and Encrypted Sign In
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col pt-12 md:pt-0 justify-center items-center p-6 md:p-8 lg:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[480px] lg:max-w-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}
