import React, { useState, useEffect } from 'react';
import { IndianRupee, CreditCard, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/Card';
import { Label } from '../../../../components/ui/label';
import { getFeeStudentDetails } from "../../../../utils/utils";


export default function Payment() {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [stuData, setStuData] = useState(null);
  const [loading, setLoading] = useState(true);

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
    alert("Payment successful!");
    navigate("/student/fees");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fees & Billing</h1>
        <p className="text-gray-500 mt-1">Manage your academic year finances and service dues.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Summary */}
        <div className="w-full md:w-1/3 space-y-6">
          <Card className="rounded-2xl border-gray-100 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="font-bold flex items-center gap-2 text-lg">
                <span className="p-1.5 bg-gray-50 rounded-md text-gray-500"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span> October Dues
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Room Rent</span>
                <span className="font-semibold text-gray-900">₹{stuData?.currentDues?.roomRent || 0}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Mess Fee</span>
                <span className="font-semibold text-gray-900">₹{stuData?.currentDues?.messFee || 0}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Electricity</span>
                <span className="font-semibold text-gray-900">₹{stuData?.currentDues?.electricity || 0}</span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Late Fees</span>
                <span className="font-semibold text-gray-900">₹{stuData?.currentDues?.lateFees || 0}</span>
              </div>
              <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="font-bold text-gray-400 text-xs tracking-widest uppercase">Grand Total</span>
                <span className="text-2xl font-bold text-gray-900">₹{stuData?.currentDues?.grandTotal || 0}</span>
              </div>

              <div className="mt-6 bg-slate-50 p-4 rounded-xl flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  Payments made after the 10th of each month incur a fixed late fee of ₹25.00 as per hostel guidelines.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between px-2">
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">SECURE SSL</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">PCI COMPLIANT</p>
            </div>
            <div className="flex flex-col items-center">
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase tracking-wide">24/7 SUPPORT</p>
            </div>
          </div>
        </div>

        {/* Right Payment Methods */}
        <div className="w-full md:w-2/3">
          <Card className="rounded-2xl shadow-sm border-gray-100 h-full">
            <CardHeader className="pb-4 border-b border-gray-50">
              <CardTitle className="text-xl font-bold text-gray-900">Select Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              
              <div className="space-y-4">
                <Label 
                  className={`block relative border-2 p-5 rounded-2xl cursor-pointer transition-colors ${selectedMethod === 'upi' ? 'border-slate-900 bg-slate-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  onClick={() => setSelectedMethod('upi')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-2 text-blue-600 rounded-lg shadow-sm border border-gray-100">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-2 2h3v2h-3v-2zm-3-2h2v4h-2v-41"/></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">UPI (Instant)</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-normal">Google Pay, PhonePe, Paytm, Any UPI App</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${selectedMethod === 'upi' ? 'border-[5px] border-slate-900' : 'border-gray-300'}`}></div>
                  </div>
                </Label>

                <Label 
                  className={`block relative border-2 p-5 rounded-2xl cursor-pointer transition-colors ${selectedMethod === 'card' ? 'border-slate-900 bg-slate-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  onClick={() => setSelectedMethod('card')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-50 p-2 text-gray-500 rounded-lg border border-gray-100">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Debit / Credit Card</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-normal">Visa, Mastercard, RuPay, Amex</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${selectedMethod === 'card' ? 'border-[5px] border-slate-900' : 'border-gray-300'}`}></div>
                  </div>
                </Label>

                <Label 
                  className={`block relative border-2 p-5 rounded-2xl cursor-pointer transition-colors ${selectedMethod === 'netbanking' ? 'border-slate-900 bg-slate-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                  onClick={() => setSelectedMethod('netbanking')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-50 p-2 text-gray-500 rounded-lg border border-gray-100">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Net Banking</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-normal">All Indian Banks supported</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 ${selectedMethod === 'netbanking' ? 'border-[5px] border-slate-900' : 'border-gray-300'}`}></div>
                  </div>
                </Label>
              </div>

              {selectedMethod === 'upi' && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">ENTER UPI ID</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="example@upi"
                      className="flex-1 bg-gray-50 border-none rounded-xl px-4 focus:ring-2 focus:ring-slate-900 focus:outline-none text-[15px]" 
                    />
                    <Button className="bg-[#0f172a] hover:bg-[#1e293b] text-white font-semibold py-6 px-8 rounded-xl transition-colors">
                      Verify
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-3 align-middle">Example: yourname@okaxis, phonenumber@ybl</p>
                </div>
              )}

              <div className="mt-10">
                <Button 
                  onClick={handleConfirm}
                  className="w-full text-[15px] bg-[#0f172a] hover:bg-[#1e293b] text-white font-medium py-7 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <div className="border border-white/20 rounded pl-1 pr-2 py-0.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <span>Confirm Payment · ₹{stuData?.currentDues?.grandTotal || 0}</span>
                </Button>
                <p className="text-center text-xs text-gray-400 mt-4">
                  By clicking confirm, you agree to our <span className="underline cursor-pointer">Terms of Service</span>
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                 <div className="flex gap-3">
                   <HelpCircle className="w-5 h-5 text-blue-500 shrink-0" />
                   <div>
                     <h4 className="text-[13px] font-bold text-blue-900">Need help paying?</h4>
                     <p className="text-xs text-gray-500 mt-1">Check our FAQ or contact the hostel warden for offline payment options.</p>
                   </div>
                 </div>
                 <div className="flex gap-3">
                   <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                   <div>
                     <h4 className="text-[13px] font-bold text-blue-900">Payment Confirmation</h4>
                     <p className="text-xs text-gray-500 mt-1">E-receipts are automatically generated and sent to your registered email.</p>
                   </div>
                 </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
