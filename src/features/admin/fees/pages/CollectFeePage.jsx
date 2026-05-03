import React, { useState } from "react";
import { Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Calendar as CalendarIcon, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Search, User } from "lucide-react";

export default function CollectFeePage() {
    const feeItems = [
    { label: "Room Rent (Monthly)", amount: "₹ 8,500.00" },
    { label: "Mess Charges", amount: "₹ 3,200.00" },
    { label: "Electricity & Utility", amount: "₹ 450.00" },
    { label: "Late Fee penalty", amount: "₹ 200.00", isOverdue: true },
  ];

  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Collect Student Fee</h1>
        <p className="text-slate-500 text-base mt-2">
          Record and manage student fee payments with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">


          {/* StudentSection */}
          <Card className="border border-slate-100 shadow-sm rounded-xl mb-6">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
          1. Select Student
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name or ID (e.g. STU-2024-001)..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm"
          />
        </div>

        <div className="bg-slate-100 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
              <User className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Arjun Mehta</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                ID: STU-8829 • Room: 204-B (Deluxe)
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-900 text-white text-[10px] font-bold rounded-full tracking-wider">
            ACTIVE
          </div>
        </div>
      </CardContent>
    </Card>



          {/* FreeSummary */}
          <Card className="border border-slate-100 shadow-sm rounded-xl">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                    2. Fee Summary Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="space-y-4">
                    {feeItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{item.label}</span>
                          {item.isOverdue && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md tracking-wider">
                              OVERDUE
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{item.amount}</span>
                      </div>
                    ))}
                    
                    <div className="pt-4 mt-2 flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-900">Total Payable</span>
                      <span className="text-2xl font-bold text-slate-900">₹ 12,350.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
        </div>
        

        {/* Payment Details */}
        <div className="lg:col-span-1">
          <Card className="border border-slate-100 shadow-sm rounded-xl h-full">
      <CardHeader className="p-6 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
          3. Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        
        {/* Amount Paid */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Amount Paid (₹)</label>
          <input
            type="text"
            defaultValue="12350"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base font-bold text-slate-900"
          />
        </div>

        {/* Payment Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Payment Date</label>
          <div className="relative">
            <input
              type="text"
              defaultValue="05/20/2024"
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm text-slate-900"
            />
            <CalendarIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Payment Method</label>
          <div className="grid grid-cols-2 gap-3">
            {["ONLINE", "CASH", "CARD", "CHEQUE"].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`py-2.5 rounded-lg text-xs font-bold tracking-wide border transition-colors ${
                  paymentMethod === method
                    ? "bg-slate-100 border-slate-900 text-slate-900"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Internal Notes */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Internal Notes</label>
          <textarea
            placeholder="Add any specific details about this transaction..."
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm text-slate-600 min-h-[100px] resize-none"
          ></textarea>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Button onClick={() => navigate("/admin/fees/receipt")}
          className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
            <Receipt className="w-4 h-4" />
            Generate Receipt
          </Button>
          <Button variant="outline" className="w-full bg-slate-50 hover:bg-slate-100 border-none text-slate-700 h-12 rounded-xl text-sm font-bold">
            Cancel
          </Button>
        </div>

      </CardContent>
    </Card>
        </div>
      </div>

      <div className="mt-6 bg-slate-100 rounded-xl p-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-slate-700 shrink-0" />
        <p className="text-sm text-slate-900 font-medium">
          Payment notification will be sent automatically to the student's registered mobile number and email upon confirmation.
        </p>
      </div>
    </div>
  );
}