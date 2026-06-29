import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Users, CheckCircle2, ArrowUpCircle } from "lucide-react";
import { createOrderPaymentHostelo, verifyPaymentHostelo } from "../../../../utils/utils";

import { Button } from "../../../../components/ui/button";

export default function UpgradePlanPage() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state?.plan) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl text-red-500">Error: Plan data not found!</h1>
        <p>Please go back to packages and try again.</p>
        <button onClick={() => navigate("/admin/packages")} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Go Back</button>
      </div>
    );
  }

  const { plan, isYearly: initialIsYearly } = location.state;
  console.log('my data parse', location.state)
  console.log('checkkkk', initialIsYearly)
  console.log('plannnn', plan)

  const [isYearly, setIsYearly] = useState(initialIsYearly);
  const [billingCycle, setBillingCycle] = useState(
    initialIsYearly ? "YEARLY" : "MONTHLY"
  );
  console.log('my billingCycle--',billingCycle)


  const [grandTotal, setGrandTotal] = useState(0);
  const [remark, setRemark] = useState("");

  // Extract base price
  const priceString = isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ""));

  const isCustom = isNaN(numericPrice);

  const subtotal = isCustom ? 0 : numericPrice;
  const gst = isCustom ? 0 : subtotal * 0.18;
  const total = subtotal + gst;

  // Next billing date calculation
  const nextBillingDate = new Date();
  if (isYearly) {
    nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
  } else {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
  }
  const formattedDate = nextBillingDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const handlePaymentFlow = async () => {
    const orderPayload = {
      packageId: plan.packageId,
      // hostelId: '',
      billingCycle: billingCycle,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      amount: total,
    };

    try {
      const orderResponse = await createOrderPaymentHostelo(orderPayload);
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
              packageId: plan.packageId,
              // hostelId: "string",
              billingCycle: billingCycle,
              amount: total || 0

              // studentId: stuData?.id || "student_id",
              // roomRent: currentDues.roomRent,
              // messCharges: currentDues.messFee,
              // electricityCharges: currentDues.electricity,
              // lateFee: currentDues.lateFees,
              // billingCycle: stuData?.currentDues?.billingCycle || "October",
              // lateDays: 0,
              // notes: remark
            };
            try {
              const verifyResponse = await verifyPaymentHostelo(verifyPayload);
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
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/packages")}
          className="flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to plans
        </button>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Checkout Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-border">
            {/* Header */}
            <div className="bg-primary p-8 text-primary-foreground">
              <p className="text-sm font-medium text-primary-foreground/80">Upgrade to</p>
              <h1 className="mt-1 text-4xl font-bold">{plan.name}</h1>
            </div>

            <div className="p-8">
              {/* Billing Cycle Toggle */}
              {!isCustom && (
                <div className="mb-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    BILLING CYCLE
                  </p>
                  {/* <div className="flex rounded-xl bg-muted/50 p-1">
                    <button
                      onClick={() => setIsYearly(false)}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${!isYearly
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setIsYearly(true)}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${isYearly
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Yearly
                    </button>
                  </div> */}
                  <div className="flex rounded-xl bg-muted/50 p-1">
                    <button
                      onClick={() => {
                        setIsYearly(false);
                        setBillingCycle("MONTHLY");
                      }}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${!isYearly
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Monthly
                    </button>

                    <button
                      onClick={() => {
                        setIsYearly(true);
                        setBillingCycle("YEARLY");
                      }}
                      className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-colors ${isYearly
                          ? "bg-primary text-primary-foreground shadow"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
              )}

              {/* Price Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-muted-foreground">Selected Plan</span>
                  <span className="text-lg font-bold text-foreground">
                    {isCustom ? "Custom Pricing" : `₹${subtotal}/${isYearly ? 'Year' : 'Month'}`}
                  </span>
                </div>

                {!isCustom && (
                  <>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[15px] text-muted-foreground">Subtotal</span>
                      <span className="text-[15px] text-foreground">
                        ₹{subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[15px] text-muted-foreground">GST (18%)</span>
                      <span className="text-[15px] text-foreground">
                        ₹{gst.toFixed(2)}
                      </span>
                    </div>

                    <div className="my-6 border-t border-dashed border-border" />

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          TOTAL AMOUNT
                        </p>
                        <p className="mt-1 text-4xl font-black tracking-tight text-foreground">
                          ₹{total.toFixed(2)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Next billing on {formattedDate}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-8 space-y-4">
                <Button onClick={handlePaymentFlow} className="h-14 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground hover:bg-primary/90">
                  <Lock className="mr-2 h-5 w-5" />
                  {isCustom ? "Contact Us" : "Complete Payment"}
                </Button>

                <div className="text-center">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-emerald-600">
                    <ShieldCheck className="h-4 w-4" />
                    Secure SSL Encrypted Payment
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Cancel or change your plan anytime
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Limits Info */}
          {plan.limits && plan.limits.length > 0 && (
            <div className="rounded-2xl bg-blue-50/50 p-6 ring-1 ring-blue-100">
              <div className="flex items-center gap-3 text-blue-700">
                <Users className="h-6 w-6" />
                <h3 className="text-lg font-bold">{plan.limits[0]}</h3>
              </div>
              {plan.limits.length > 1 && (
                <p className="mt-2 text-sm text-blue-600/80">
                  Includes {plan.limits.slice(1).join(", ")}
                </p>
              )}
            </div>
          )}

          {/* Features Info */}
          {plan.features && plan.features.length > 0 && (
            <div className="rounded-2xl bg-emerald-50/50 p-6 ring-1 ring-emerald-100">
              <div className="mb-6 flex items-center gap-2 text-emerald-700">
                <ArrowUpCircle className="h-5 w-5" />
                <h3 className="font-bold">What you're gaining</h3>
              </div>
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    <span className="text-[15px] text-emerald-900/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
