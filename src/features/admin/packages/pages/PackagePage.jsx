import React, { useEffect, useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";

import { getAllPackageData } from "../../../../utils/utils";

// ================= PLAN CARD =================

const PlanCard = ({ plan, index }) => {
  const isMiddleCard = index === 1;

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-[#0F172A] ${
        isMiddleCard
          ? "border-[#0F172A] shadow-xl scale-[1.02]"
          : "border-gray-200"
      }`}
    >
      <CardContent className="flex h-full flex-col p-7">
        {/* PACKAGE NAME */}

        <div>
          <h2 className="text-[28px] font-bold text-[#0F172A]">
            {plan?.name || "Package"}
          </h2>

          {/* PRICE */}

          <div className="mt-4 flex items-end gap-2">
            <span className="text-5xl font-bold tracking-tight text-[#0F172A]">
              ₹{plan?.monthlyPrice || 0}{" "}
            </span>

            <span className="mb-1 text-[15px] text-gray-500">/month</span>
          </div>
        </div>

        {/* FEATURES */}

        <div className="mt-8 space-y-4">
          {plan?.features?.length > 0 ? (
            plan?.features?.map((feature, i) => (
              <div
                key={i}
                className="flex items-start gap-3 text-[15px] text-gray-700"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>
                  {feature
                    ?.toLowerCase()
                    ?.replaceAll("_", " ")
                    ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                </span>{" "}
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-400">No features available</div>
          )}
        </div>

        <div className="mt-6 space-y-2 border-t pt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Max Beds</span>
            <span>{plan?.maxBeds || 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Max Staff</span>
            <span>{plan?.maxStaff || 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Max Students</span>
            <span>{plan?.maxStudents || 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Yearly Discount</span>
            <span>{plan?.yearlyDiscountPercentage || 0}%</span>
          </div>
        </div>
        {/* BUTTON */}

        <div className="mt-auto pt-10">
          <Button
            className={`h-12 w-full rounded-xl text-sm font-semibold transition-all duration-300 ${
              isMiddleCard
                ? "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                : "border border-gray-300 bg-white text-[#0F172A] hover:bg-[#0F172A] hover:text-white"
            }`}
          >
            {plan?.currentPlan ? "Current Plan" : "Upgrade Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ================= MAIN COMPONENT =================

export default function PackagePage() {
  const [plans, setPlans] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [detailedPackages, setDetailedPackages] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(true);

  // ================= API FUNCTION =================

  const PackageGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getAllPackageData();

      console.log("FULL PACKAGE RESPONSE =>", response);
      console.log("PACKAGE DATA =>", response?.data);

      const packageData = response?.data?.allPackages || [];

      console.log("FINAL PACKAGE DATA =>", packageData);

      const formattedPackages = Array.isArray(packageData)
        ? packageData.map((item) => ({
            id: item?.id,

            packageId: item?.packageId,

            name: item?.packageName || "Package",

            monthlyPrice: item?.monthlyPrice || 0,

            annualPrice: item?.annualPrice || 0,

            yearlyDiscountPercentage: item?.yearlyDiscountPercentage || 0,

            maxBeds: item?.maxBeds || 0,

            maxStaff: item?.maxStaff || 0,

            maxStudents: item?.maxStudents || 0,

            maxRooms: item?.maxRooms || 0,

            active: item?.active || false,

            features: Array.isArray(item?.features) ? item.features : [],

            createdAt: item?.createdAt || "",

            currentPlan: item?.activeSubscription || false,
          }))
        : [];

      console.log("FORMATTED PACKAGES =>", formattedPackages);

      setPlans(formattedPackages);
      setSubscriptionHistory(response?.data?.subscriptionHistory || []);

      setDetailedPackages(response?.data?.detailedPackageList || []);
    } catch (error) {
      console.log("PACKAGE API ERROR =>", error);

      toast.error("Something went wrong");
    } finally {
      setLoaderCheck(false);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    PackageGetAllApi();
  }, []);

  // ================= DUMMY TABLE DATA =================

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="space-y-10">
        {/* HEADER */}

        <div>
          <h1 className="text-4xl font-bold text-[#0F172A]">
            Subscription Package
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Upgrade your plan to unlock advanced features, increase service
            limits, and manage your hostel more efficiently.
          </p>
        </div>

        {/* PACKAGE CARDS */}

        {loaderCheck ? (
          <div className="flex items-center justify-center py-20 text-lg font-semibold text-[#0F172A]">
            Loading packages...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans?.length > 0 ? (
              plans?.map((plan, index) => (
                <PlanCard key={plan?._id || index} plan={plan} index={index} />
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center py-20 text-lg font-semibold text-gray-400">
                No packages found
              </div>
            )}
          </div>
        )}

        {/* SUBSCRIPTION HISTORY */}

        <section className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold text-[#0F172A]">
              Subscription History
            </h2>

            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <Input placeholder="Transaction ID" className="bg-white pl-10" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PACKAGE NAME</TableHead>
                  <TableHead>PRICE</TableHead>
                  <TableHead>PURCHASE DATE</TableHead>
                  <TableHead>TXN. NUMBER</TableHead>
                  <TableHead>BILLING CYCLE</TableHead>
                  <TableHead>EXPIRY DATE</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {subscriptionHistory?.length > 0 ? (
                  subscriptionHistory.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.packageName || "-"}</TableCell>

                      <TableCell>₹{item?.amount || 0}</TableCell>

                      <TableCell>
                        {item?.purchaseDate
                          ? new Date(item.purchaseDate).toLocaleDateString()
                          : "-"}
                      </TableCell>

                      <TableCell>{item?.transactionNumber || "-"}</TableCell>

                      <TableCell>{item?.billingCycle || "-"}</TableCell>

                      <TableCell>
                        {item?.expiryDate
                          ? new Date(item.expiryDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-gray-400"
                    >
                      No subscription history found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>

        {/* DETAILED PACKAGE LIST */}

        <section className="space-y-5">
          <h2 className="text-3xl font-bold text-[#0F172A]">
            Detailed Package List
          </h2>

          <div className="overflow-hidden rounded-2xl border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>PACKAGE NAME</TableHead>
                  <TableHead>PRICE</TableHead>
                  <TableHead>MAX STUDENTS</TableHead>
                  <TableHead>ACTIVE SUBSCRIPTION</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {detailedPackages?.length > 0 ? (
                  detailedPackages.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item?.packageName || "-"}</TableCell>

                      <TableCell>₹{item?.monthlyPrice || 0}</TableCell>

                      <TableCell>{item?.maxStudents || "Unlimited"}</TableCell>

                      <TableCell>
                        {item?.activeSubscriptionsCount || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-gray-400"
                    >
                      No package details found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
