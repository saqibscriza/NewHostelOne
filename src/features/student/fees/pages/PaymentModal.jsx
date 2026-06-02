import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Receipt } from "lucide-react";
import PaymentImage from "../../../../assets/PaymentImage.jpg";
import { createOrderPayment, verifyPayment } from "../../../../utils/utils";


export default function PaymentModal({
  isOpen,
  onClose,
  stuData,
  onConfirmPayment,
}) {
  const [step, setStep] = useState(1);
  const [remark, setRemark] = useState("");
  const [grandTotal, setGrandTotal] = useState(0);
  console.log('my data for payment', grandTotal)

  const currentDues = stuData?.currentDues || {
    roomRent: 800.0,
    messFee: 320.0,
    electricity: 95.5,
    lateFees: 25.0,
    grandTotal: 1240.5,
  };
  useEffect(() => {
    setGrandTotal(currentDues.grandTotal);
  }, [stuData])


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

  React.useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRemark("");
    }
  }, [isOpen]);

  const handleProceed = () => {
    setStep(2);
  };

  //   setTimeout(() => {
  // handleProceed();
  // },1500);

  const handlePayNow = () => {
    onConfirmPayment(remark);
  };
  // const MyPaymentApi = async () => {

  //   const Json = {
  //     amount: grandTotal
  //   };

  //   // setLoader(true)
  //   try {
  //     const response = await createOrderPayment(Json);
  //     console.log('my payment api is here',response)
  //     if (response?.status === 200) {
  //       if (response?.data?.status === "success") {
  //         toast.success(response?.data?.message);

  //       }
  //       else {
  //         toast.error(response?.data?.message);
  //         // setLoader(false)
  //         // setShow(true)
  //       }
  //     } else {
  //       toast.error(response?.data?.message);
  //       setLoader(false)
  //     }
  //   } catch (error) {
  //     setLoader(false)
  //   }
  // }

  // 🌟 Main Payment Handler 🌟
  // 🌟 Main Payment Handler 🌟
  const handlePaymentFlow = async () => {

    const orderPayload = {
      amount: grandTotal,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: remark || "Fee Payment"
    };

    try {
      const orderResponse = await createOrderPayment(orderPayload);

      if (orderResponse?.status === "success") {

        const { id: order_id, amount, currency, keyId } = orderResponse.data;
        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "Hostelo",
          description: "Fee Payment",
          order_id: order_id,

          handler: async function (response) {
            // console.log("Razorpay Success Response:", response);

            const verifyPayload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              studentId: stuData?.id || "student_id",
              roomRent: currentDues.roomRent,
              messCharges: currentDues.messFee,
              electricityCharges: currentDues.electricity,
              lateFee: currentDues.lateFees,
              billingCycle: stuData?.currentDues?.billingCycle || "October",
              lateDays: 0,
              notes: remark
            };
            try {
              const verifyResponse = await verifyPayment(verifyPayload);
              if (verifyResponse?.status === "success") {
                onConfirmPayment(remark);
                onClose();
              } else {
                console.log("Verification Failed:", verifyResponse);
              }
            } catch (err) {
              console.error("Verification API Error:", err);
            }
          },
          prefill: {
            name: stuData?.name || "Student Name",
            email: stuData?.email || "student@example.com",
            contact: stuData?.phone || "9999999999",
          },
          theme: {
            color: "#0f172a",
          },
        };

        // 7. Open the Razorpay Checkout Modal
        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed', function (response) {
          console.error("Payment Failed:", response.error);
        });

        rzp.open();

      } else {
        console.error("Failed to create order. Response:", orderResponse);
      }
    } catch (error) {
      console.error("Create Order API Error:", error);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} modal={false}>
      {/* <Dialog open={isOpen} onOpenChange={onClose}> */}
      <DialogContent
        className="max-w-[480px] w-full p-0 overflow-hidden bg-white rounded-[24px] border-none shadow-2xl"
        showCloseButton={true}
      >
        <DialogHeader className="pt-6 px-6 pb-3">
          <DialogTitle className="text-[24px] font-bold text-gray-900 border-none">
            Fees & Billing Details
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 max-h-[85vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {step === 2 && (
            <div className="flex justify-center mb-5 -mt-2 overflow-hidden h-[150px] items-center">
              <img
                src={PaymentImage}
                alt="Payment Illustration"
                className="w-full max-w-[400px] h-[240px] object-contain object-center scale-105"
              />
            </div>
          )}

          <div className="border border-gray-200 rounded-[16px] p-5 bg-white shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Receipt className="w-5 h-5 text-gray-900" />
              <h3 className="text-[17px] font-bold text-gray-900">
                {stuData?.currentDues?.billingCycle || "October"} Dues
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Room Rent</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentDues.roomRent)}
                </span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Mess Fee</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentDues.messFee)}
                </span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Electricity</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentDues.electricity)}
                </span>
              </div>
              <div className="flex justify-between text-[15px]">
                <span className="text-gray-600">Late Fees</span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(currentDues.lateFees)}
                </span>
              </div>

              <div className="pt-1">
                <span className="text-[14px] text-gray-600 block mb-1">
                  Remark
                </span>
                {step === 1 ? (
                  <Input
                    placeholder="Enter Remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="w-full text-[14px] py-5 px-4 rounded-[10px] border-gray-200"
                  />
                ) : (
                  <p className="text-[14px] font-bold text-gray-900">
                    {remark || "-"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-[12px] font-bold text-gray-400 uppercase tracking-[0.1em]">
                Grand Total
              </span>
              <span className="text-[24px] font-bold text-gray-900 tracking-tight">
                {formatCurrency(currentDues.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          {step === 1 ? (
            <Button
              onClick={handlePaymentFlow}
              // onClick={MyPaymentApi}
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-6 rounded-[12px] text-[16px] font-medium transition-all shadow-md"
            >
              Proceed to Pay
            </Button>
          ) : (
            <Button
              onClick={handlePayNow}
              className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white py-6 rounded-[12px] text-[16px] font-medium transition-all shadow-md"
            >
              Pay Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
