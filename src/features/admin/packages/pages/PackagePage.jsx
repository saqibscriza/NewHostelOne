import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CheckCircle2, FileText } from "lucide-react";
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

import { getAllPlansApi, getCurrentPlanApi, getPlanInvoiceApi } from "../../../../utils/utils";

// ================= PLAN CARD =================

const PlanCard = ({ plan, index, isYearly }) => {
  const navigate = useNavigate();
  const isPopular = plan.badge;
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_FEATURES = 4;
  const hasMore = (plan.features?.length > MAX_FEATURES) || (plan.bestFor?.length > 0) || plan.support;

  return (
    <Card
      className={`group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-primary flex flex-col ${
        isPopular
          ? "border-primary shadow-xl scale-[1.02]"
          : "border-border"
      }`}
    >
      {isPopular && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-sm">
          {plan.badge}
        </div>
      )}
      <CardContent className="flex h-full flex-col p-7">
        {/* PACKAGE NAME & DESCRIPTION */}
        <div>
          <h2 className="text-[28px] font-bold text-foreground">
            {plan.name}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

          {/* PRICE */}
          <div className="mt-4 flex items-end gap-2">
            <span className="text-4xl font-bold tracking-tight text-foreground">
              {isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price}
            </span>
            {plan.price !== "Custom Pricing" && (
              <span className="mb-1 text-[15px] text-muted-foreground">
                / {isYearly ? "Year" : "Month"}
              </span>
            )}
          </div>
        </div>

        <div className="mt-8 flex-1 space-y-6">
          {/* LIMITS / BUILT AROUND */}
          {(plan.limits?.length > 0 || plan.limitsSubtitle) && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                {plan.limitsSubtitle || "Limits"}
              </h3>
              {plan.limits?.length > 0 && (
                <ul className="space-y-2">
                  {plan.limits.map((limit, i) => (
                    <li key={i} className="flex items-center gap-2 text-[15px] text-muted-foreground">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"></div>
                      {limit}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* FEATURES */}
          {plan.features?.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                Included Features
              </h3>
              <ul className="space-y-3">
                {plan.features.slice(0, isExpanded ? plan.features.length : MAX_FEATURES).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-[15px] text-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isExpanded && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
              {/* BEST FOR */}
              {plan.bestFor?.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                    Best For
                  </h3>
                  <ul className="space-y-2">
                    {plan.bestFor.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-[15px] text-muted-foreground">
                        <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* SUPPORT */}
              {plan.support && (
                <div className="border-t border-border pt-4">
                  <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                    Support
                  </h3>
                  <p className="whitespace-pre-line text-[15px] text-muted-foreground">{plan.support}</p>
                </div>
              )}
            </div>
          )}

          {/* READ MORE TOGGLE */}
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              {isExpanded ? "Show Less -" : "Read More +"}
            </button>
          )}
        </div>

        {/* BUTTON */}
        <div className="mt-8 pt-4">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/packages/upgrade", { state: { plan, isYearly } });
            }}
            className={`h-12 w-full rounded-xl text-sm font-semibold transition-all duration-300 ${
              isPopular
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground"
            }`}
          >
            {plan.price === "Custom Pricing" ? "Contact Us" : "Upgrade Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// ================= STATIC PACKAGES DATA =================

const STATIC_PACKAGES = [
  {
    name: "Free Plan",
    price: "₹0",
    yearlyPrice: "₹0",
    description: "Perfect for exploring Hostelo",
    limits: ["Up to 10 Students", "1 Hostel", "1 Admin Account"],
    features: [
      "Dashboard Overview",
      "Room Management",
      "Student Management",
      "Fee Management",
      "Notices & Announcements",
      "Support Tickets",
    ],
    support: "Community Support",
  },
  {
    name: "Starter Plan",
    price: "₹299",
    yearlyPrice: "₹2,990",
    description: "Ideal for Small Hostels & PGs",
    limits: ["Up to 25 Students", "1 Hostel", "1 Admin Account"],
    features: [
      "Everything in Free",
      "Room Categories & Room Details",
      "Student Registration & Management",
      "Fee Collection & Tracking",
      "Query Management",
      "Student Dashboard",
      "Chef Dashboard",
      "Daily Mess Menu",
      "Support Management",
      "Basic Occupancy & Revenue Analytics",
    ],
    support: "Standard Email Support",
  },
  {
    name: "Professional Plan",
    badge: "⭐ Most Popular",
    price: "₹799",
    yearlyPrice: "₹7,990",
    description: "Built for Growing Hostel Businesses",
    limits: ["Up to 50 Students", "Up to 3 Hostels", "Up to 3 Admin Accounts"],
    features: [
      "Everything in Starter",
      "Multi-Hostel Management",
      "Hostel Switching",
      "Menu Planner",
      "Inventory Management",
      "Inventory Categories",
      "Food Feedback & Ratings",
      "Weekly Menu Planning",
      "Advanced Occupancy Analytics",
      "Revenue Insights & Reports",
      "Data Export",
    ],
    support: "Priority Support",
  },
  {
    name: "Enterprise Plan",
    price: "Custom Pricing",
    yearlyPrice: "Custom Pricing",
    description: "Tailored for Large Hostels, Hostel Chains & Institutions",
    limitsSubtitle: "Built Around Your Requirements",
    limits: [],
    features: [
      "Custom Student Capacity",
      "Custom Hostel Capacity",
      "Custom User Roles",
      "Custom Modules",
      "Custom Workflows",
      "Third-Party Integrations",
      "API Access",
      "White Label Branding (Optional)",
      "Dedicated Account Manager",
      "Advanced Reporting",
      "Priority Support",
    ],
    bestFor: [
      "Hostel Chains",
      "Universities & Colleges",
      "Franchise Networks",
      "Multi-Campus Accommodation Providers",
      "Organizations Requiring Custom Workflows",
    ],
    support: "Dedicated Success Manager\nSLA-Based Support",
  },
];

// ================= SUBSCRIPTION DETAILS =================

const SubscriptionDetails = ({ currentPlan }) => {
  if (!currentPlan) return null;

  const handleDownloadInvoice = async () => {
    if (!currentPlan.subscriptionId) {
      toast.error("Subscription ID not found");
      return;
    }

    try {
      const response = await getPlanInvoiceApi(currentPlan.subscriptionId);

      if (!response || !response.data) {
        toast.error("Failed to fetch invoice data");
        return;
      }

      const contentType = response.headers && response.headers['content-type'];

      if (contentType && contentType.includes('application/json')) {
        // If the backend returns JSON with a URL instead of the file itself
        const text = await response.data.text();
        const json = JSON.parse(text);
        const url = json?.invoiceUrl || json?.data?.invoiceUrl || json?.url || json?.data;
        const filename = json?.filename || json?.data?.filename || "invoice.pdf";

        if (url && typeof url === "string" && url.startsWith("http")) {
          const link = document.createElement("a");
          link.href = url;
          link.target = "_blank";
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
          link.remove();
          toast.success("Invoice downloaded successfully");
        } else {
          toast.error("Invoice URL not found or invalid in the response.");
        }
      } else {
        // The backend returns the file blob directly
        const blob = new Blob([response.data], { type: contentType || 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${currentPlan.subscriptionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Invoice downloaded successfully");
      }
    } catch (error) {
      console.error("Download Invoice Error:", error);
      toast.error("An error occurred during invoice download.");
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-foreground">
        Subscription Details
      </h2>
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary bg-card shadow-sm">
        {/* Active Banner */}
        <div className="absolute -right-12 top-6 w-40 rotate-45 bg-primary py-1 text-center text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
          {currentPlan.paymentStatus || "ACTIVE"}
        </div>

        <div className="p-6 md:p-8">
          {/* Header Row */}
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="text-base font-bold text-foreground">
              Current Plan
            </span>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground shadow-sm">
                {currentPlan.packageName || "N/A"}
              </span>
              <span className="flex items-center gap-1.5 rounded-lg bg-chart-2/20 px-3 py-1.5 text-sm font-semibold text-chart-2 uppercase">
                <CheckCircle2 className="h-4 w-4" strokeWidth={3} />
                {currentPlan.paymentStatus === "ACTIVE" ? "Active" : currentPlan.paymentStatus}
              </span>
            </div>
          </div>

          <div className="mb-6 h-px w-full bg-border"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-y-4 text-sm md:grid-cols-3 md:gap-x-12">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Subscription Start Date</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : {currentPlan.subscriptionStartDate || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Subscription End Date</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : {currentPlan.subscriptionEndDate || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Remaining Days</span>
                <span className="w-1/2 font-bold text-chart-2">
                  : {currentPlan.remainingDays ?? "N/A"} Days
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Amount</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : ₹ {currentPlan.amount || 0}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Billing Cycle</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : {currentPlan.billingCycle || "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">User Limit</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : {currentPlan.userLimit || "N/A"}
                </span>
              </div>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Payment Status</span>
                <span className="w-1/2 font-semibold text-chart-3 capitalize">
                  : {currentPlan.paymentStatus ? currentPlan.paymentStatus.toLowerCase() : "N/A"}
                </span>
              </div>
              <div className="flex">
                <span className="w-1/2 text-muted-foreground">Payment Method</span>
                <span className="w-1/2 font-semibold text-foreground">
                  : {currentPlan.paymentMethod || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-8">
            <Button 
              onClick={handleDownloadInvoice}
              className="flex h-11 items-center gap-2 rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer"
            >
              <FileText className="h-4 w-4" />
              Download Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ================= MAIN COMPONENT =================

export default function PackagePage() {
  const [plans, setPlans] = useState([]);
  const [subscriptionHistory, setSubscriptionHistory] = useState([]);
  const [detailedPackages, setDetailedPackages] = useState([]);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loaderCheck, setLoaderCheck] = useState(true);
  const [isYearly, setIsYearly] = useState(false);

  // ================= API FUNCTION =================

  const PackageGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getAllPlansApi();

      console.log("FULL PACKAGE RESPONSE =>", response);
      console.log("PACKAGE DATA =>", response?.allPackages || response?.data?.allPackages);

      // Depending on axios/API config, the data could be directly in response or response.data
      const packageData = response?.allPackages || response?.data?.allPackages || [];

      console.log("FINAL PACKAGE DATA =>", packageData);

      const formattedPackages = Array.isArray(packageData)
        ? packageData.map((item) => ({
            id: item?.id,
            packageId: item?.packageId,
            name: item?.packageName || "Package",
            
            // Map UI specific properties
            price: item?.monthlyPrice === null ? "Custom Pricing" : `₹${item?.monthlyPrice || 0}`,
            yearlyPrice: item?.annualPrice === null ? "Custom Pricing" : `₹${item?.annualPrice || 0}`,
            description: item?.packageName === "Free Plan" ? "Perfect for exploring Hostelo" :
                         item?.packageName === "Starter Plan" ? "Ideal for Small Hostels & PGs" :
                         item?.packageName === "Professional Plan" ? "Built for Growing Hostel Businesses" :
                         item?.packageName === "Enterprise Plan" ? "Tailored for Large Hostels, Hostel Chains & Institutions" : "",
            limits: item?.maxStudents === null ? [] : [
              `Up to ${item?.maxStudents} Students`, 
              item?.maxHostels === 1 ? "1 Hostel" : `Up to ${item?.maxHostels || 0} Hostels`, 
              item?.maxAdmins === 1 ? "1 Admin Account" : `Up to ${item?.maxAdmins || 0} Admin Accounts`
            ],
            limitsSubtitle: item?.packageName === "Enterprise Plan" ? "Built Around Your Requirements" : "Limits",
            badge: item?.packageName === "Professional Plan" ? "⭐ Most Popular" : undefined,
            bestFor: item?.packageName === "Enterprise Plan" ? [
              "Hostel Chains",
              "Universities & Colleges",
              "Franchise Networks",
              "Multi-Campus Accommodation Providers",
              "Organizations Requiring Custom Workflows",
            ] : [],
            support: item?.packageName === "Enterprise Plan" ? "Dedicated Success Manager\nSLA-Based Support" : 
                     item?.packageName === "Professional Plan" ? "Priority Support" :
                     item?.packageName === "Starter Plan" ? "Standard Email Support" : "Community Support",
            
            // Original properties
            monthlyPrice: item?.monthlyPrice || 0,
            annualPrice: item?.annualPrice || 0,
            yearlyDiscountPercentage: item?.yearlyDiscountPercentage || 0,
            maxBeds: item?.maxBeds || 0,
            maxStaff: item?.maxStaff || 0,
            maxStudents: item?.maxStudents || 0,
            maxRooms: item?.maxRooms || 0,
            active: item?.active || false,
            features: Array.isArray(item?.features) ? item.features.map(f => f.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase())) : [],
            createdAt: item?.createdAt || "",
            currentPlan: item?.activeSubscription || false,
          }))
        : [];

      console.log("FORMATTED PACKAGES =>", formattedPackages);

      setPlans(formattedPackages);
      setSubscriptionHistory(response?.subscriptionHistory || response?.data?.subscriptionHistory || []);

      setDetailedPackages(response?.detailedPackageList || response?.data?.detailedPackageList || []);
    } catch (error) {
      console.log("PACKAGE API ERROR =>", error);

      toast.error("Something went wrong");
    } finally {
      setLoaderCheck(false);
    }
  };

  const fetchCurrentPlan = async () => {
    try {
      const response = await getCurrentPlanApi();
      // Adjust if the structure differs, but using response.data or response directly
      setCurrentPlan(response?.data || response || null);
    } catch (error) {
      console.log("CURRENT PLAN API ERROR =>", error);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    PackageGetAllApi();
    fetchCurrentPlan();
  }, []);

  // ================= DUMMY TABLE DATA =================

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-10">
        {/* SUBSCRIPTION DETAILS */}
        <SubscriptionDetails currentPlan={currentPlan} />

        {/* HEADER */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">
              Subscription Plans
            </h1>

            <p className="mt-2 text-sm text-muted-foreground">
              Upgrade your plan to unlock advanced features, increase service
              limits, and manage your hostel more efficiently.
            </p>
          </div>

          <div className="flex w-fit items-center rounded-lg border bg-card p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`rounded-md px-6 py-2 text-sm font-semibold transition-colors ${
                !isYearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`rounded-md px-6 py-2 text-sm font-semibold transition-colors ${
                isYearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* PACKAGE CARDS */}

        {loaderCheck ? (
          <div className="flex items-center justify-center py-20 text-lg font-semibold text-foreground">
            Loading packages...
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard key={index} plan={plan} index={index} isYearly={isYearly} />
            ))}
          </div>
        )}

        {/* SUBSCRIPTION HISTORY */}

        <section className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-3xl font-bold text-foreground">
              Subscription History
            </h2>

            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input placeholder="Transaction ID" className="bg-card pl-10" />
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border bg-card">
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
                      className="text-center py-8 text-muted-foreground"
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
          <h2 className="text-3xl font-bold text-foreground">
            Detailed Package List
          </h2>

          <div className="overflow-hidden rounded-2xl border bg-card">
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
                      className="text-center py-8 text-muted-foreground"
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
