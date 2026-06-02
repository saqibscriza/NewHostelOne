import React, { useState, useEffect } from "react";
import {
  Receipt,
  Info,
  Lock,
  HelpCircle,
  ShieldCheck,
  Shield,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/Card";
import { getFeeStudentDetails } from "../../../../utils/utils";
import PaymentModal from "./PaymentModal";

export default function Payment() {
  const navigate = useNavigate();
  const [stuData, setStuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const StudentFeeDetails = async () => {
    try {
      setLoading(true);
      const response = await getFeeStudentDetails();
      console.log("Student Fee Details =>", response);

      setStuData(response?.data || null);
    } catch (error) {
      console.error("Error fetching student fee details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    StudentFeeDetails();
  }, []);

  const handleConfirm = () => {
    setIsModalOpen(true);
  };

  const handleFinalPayment = (remark) => {
    console.log("Payment Successfull with remark:", remark);
    setIsModalOpen(false);
    navigate("/student/fees");
  };

  if (loading) {
    return <div className="text-center mt-10">Loading payment details...</div>;
  }

  const currentDues = stuData?.currentDues || {
    roomRent: 800.0,
    messFee: 320.0,
    electricity: 95.5,
    lateFees: 25.0,
    grandTotal: 1240.5,
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  return (
    <div className="max-w-[850px] mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Fees & Billing
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your academic year finances and service dues.
        </p>
      </div>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Receipt className="w-6 h-6 text-gray-900" />
            <h2 className="text-2xl font-bold text-gray-900">
              {stuData?.currentDues?.billingCycle || "October"} Dues
            </h2>
          </div>

          <div className="space-y-5">
            <div className="flex justify-between text-[17px]">
              <span className="text-gray-600">Room Rent</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(currentDues.roomRent || 0)}
              </span>
            </div>
            <div className="flex justify-between text-[17px]">
              <span className="text-gray-600">Mess Fee</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(currentDues.messFee || 0)}
              </span>
            </div>
            <div className="flex justify-between text-[17px]">
              <span className="text-gray-600">Electricity</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(currentDues.electricity || 0)}
              </span>
            </div>
            <div className="flex justify-between text-[17px]">
              <span className="text-gray-600">Late Fees</span>
              <span className="font-medium text-gray-900">
                {formatCurrency(currentDues.lateFees || 0)}
              </span>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 flex justify-between items-center mt-8">
            <span className="font-bold text-gray-400 text-sm tracking-[0.15em] uppercase">
              GRAND TOTAL
            </span>
            <span className="text-4xl font-bold text-gray-900">
              {formatCurrency(currentDues.grandTotal || 1240.5)}
            </span>
          </div>

          <div className="mt-8 bg-slate-100 p-4 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
            <p className="text-[14px] text-slate-600 leading-relaxed font-medium">
              Payments made after the 10th of each month incur a fixed late fee
              of ₹25.00 as per hostel guidelines.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-gray-200 shadow-sm bg-slate-50/80">
        <CardContent className="p-8 flex flex-col items-center text-center">
          <Button
            onClick={handleConfirm}
            className="w-full text-[17px] bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-7 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <Lock className="w-5 h-5" />
            <span>
              Confirm Payment ·{" "}
              {formatCurrency(currentDues.grandTotal || 1240.5)}
            </span>
          </Button>
          <p className="text-[13px] text-gray-400 mt-5 font-medium">
            By clicking confirm, you agree to our{" "}
            <span className="underline cursor-pointer hover:text-gray-600">
              Terms of Service
            </span>
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 px-2">
        <div className="flex gap-4 items-start">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-blue-900">
              Need help paying?
            </h4>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">
              Check our FAQ or contact the hostel warden for offline payment
              options.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[15px] font-bold text-blue-900">
              Payment Confirmation
            </h4>
            <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed font-medium">
              E-receipts are automatically generated and sent to your registered
              email.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-16 pt-12 pb-8 px-2 max-w-sm mx-auto">
        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
          <Shield className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            SECURE SSL
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
          <Lock className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            PCI COMPLIANT
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
          <Clock className="w-6 h-6" />
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#9ca3af]">
            24/7 SUPPORT
          </p>
        </div>
      </div>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        stuData={stuData}
        onConfirmPayment={handleFinalPayment}
      />
    </div>
  );
}
