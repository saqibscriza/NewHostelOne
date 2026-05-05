import React, { useEffect, useState } from "react";
import { Button } from "../../../../../src/components/ui/button";
import { Link } from "react-router-dom";
import { Wallet, Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CalendarDays } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../src/components/ui/Card";
import { Eye, CreditCard, Banknote, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertCircle, Mail } from "lucide-react";
import {getFeeDashboard} from "../../../../utils/utils";

export default function FeesPage() {

const [dashboardData, setDashboardData] = useState(null);

const fetchDashboard = async () => {
  try {
    const response = await getFeeDashboard();
    console.log("FEE DASHBOARD =>", response);
    setDashboardData(response);
  } catch (error) {
    console.error("Error fetching fee dashboard:", error);
  }
};
  useEffect(() => {
  fetchDashboard();
}, []);

  const stats = [
    {
      title: "Total Collected",
      value: `₹${dashboardData?.totalCollected || 0}`,
      trend: "",
      trendIcon: null,
      icon: Wallet,
    },
    {
      title: "Pending Dues",
      value: `₹${dashboardData?.pendingDues || 0}`,
      trend: "",
      trendIcon: null,
      icon: Wallet, // The image has a clipboard icon for pending dues
    },
    {
      title: "Upcoming Deadline",
      value: dashboardData?.billingCycleOverview?.currentBillingCycle || "-",
      trend: `${dashboardData?.studentPaymentStatus?.completionRate || 0}% Completed`,
      trendIcon: null,
      icon: CalendarDays,
    },
  ];


const transactions =
  dashboardData?.recentTransactions?.map((tx) => ({
    id: tx.transactionId,
    name: tx.studentName,
    initials: tx.studentName?.slice(0, 2).toUpperCase(),
    amount: `₹${tx.amount}`,
    date: tx.paymentDate,
    method: tx.paymentMethod,
    methodIcon: tx.paymentMethod === "CASH" ? Banknote : CreditCard,
    status: "Success",
  })) || [];


const getStatusColor = (status) => {
  switch (status) {
    case "Success":
      return "bg-slate-100 text-slate-800";
    case "Processing":
      return "bg-slate-200 text-slate-600";
    case "Failed":
      return "bg-slate-200 text-slate-600";
    default:
      return "bg-slate-100 text-slate-600";
  }
};

const totalPayments =
  (dashboardData?.paymentMethodsDistribution?.CASH || 0) +
  (dashboardData?.paymentMethodsDistribution?.ONLINE || 0);

const methods = [
  {
    name: "Cash",
    percentage: totalPayments
      ? Math.round(
          (dashboardData?.paymentMethodsDistribution?.CASH / totalPayments) * 100
        )
      : 0,
  },
  {
    name: "Online",
    percentage: totalPayments
      ? Math.round(
          (dashboardData?.paymentMethodsDistribution?.ONLINE / totalPayments) * 100
        )
      : 0,
  },
];


  return (
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Fee Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitor and manage hostel fee collections for current semester.
          </p>
        </div>
        <Link to="/admin/fees/collect">
          <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Collect Fee
          </Button>
        </Link>
      </div>

    
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trendIcon;
              return (
                <Card key={index} className="border border-slate-100 shadow-sm rounded-xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-100 rounded-xl">
                        <Icon className="w-5 h-5 text-slate-700" />
                      </div>
                      <div className="px-2.5 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700 flex items-center gap-1">
                        {TrendIcon && <TrendIcon className="w-3.5 h-3.5" />}
                        {stat.trend}
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                      <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</h3>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

      {/* Filter */}
      <Card className="mb-6 border border-slate-100 shadow-sm rounded-xl">
      <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <span className="text-sm text-slate-500 font-medium mr-2">Filter by:</span>
          
          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option>All Student</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option>All Payment Method</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select className="appearance-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option>All Status</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button className="text-sm font-medium text-slate-900 hover:underline whitespace-nowrap">
          Clear all filters
        </button>
      </CardContent>
    </Card>

    {/* Recent Transactions */}
    <Card className="mb-6 border border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Transactions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" className="text-sm border-slate-200 text-slate-600">Filter</Button>
              <Button variant="outline" className="text-sm border-slate-200 text-slate-600">Export CSV</Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-foreground uppercase bg-background border-b ">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Payment Method</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions?.map((tx, index) => {
                  const MethodIcon = tx.methodIcon;
                  return (
                    <tr key={index} className="bg-white border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
                            {tx.initials}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{tx.name}</div>
                            <div className="text-xs text-slate-500">ID: {tx.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{tx.amount}</td>
                      <td className="px-6 py-4 text-slate-500">{tx.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MethodIcon className="w-4 h-4" />
                          {tx.method}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <span className="text-sm text-slate-500">Showing 1 to 4 of 24 hostels</span>
            <div className="flex items-center gap-1">
              <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-slate-900 text-white text-sm font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-sm font-medium">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-sm font-medium">3</button>
              <span className="text-slate-400 px-1">...</span>
              <button className="w-7 h-7 flex items-center justify-center rounded text-slate-600 hover:bg-slate-100 text-sm font-medium">6</button>
              <button className="p-1 text-slate-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </Card>

      
      {/* Urgent Reminders and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<Card className="border border-slate-100 shadow-sm rounded-xl h-full">
  <CardHeader className="p-6 pb-4">
    <CardTitle className="text-lg font-bold text-slate-900">
      Urgent Fee Reminders
    </CardTitle>
  </CardHeader>

  <CardContent className="p-6 pt-0 space-y-4">

    {/* Empty State */}
    {!dashboardData?.urgentReminders?.length && (
      <p className="text-sm text-slate-500">No urgent reminders</p>
    )}

    {/* Dynamic Data */}
    {dashboardData?.urgentReminders?.map((item, index) => {
      const Icon =
        item.type === "OVERDUE" ? AlertCircle : Mail;

      return (
        <div
          key={index}
          className="bg-slate-100 rounded-xl p-4 flex items-start justify-between gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 mt-0.5">
              <Icon className="w-4 h-4 text-white" />
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                {item.description}
              </p>
            </div>
          </div>

          <button className="text-xs font-bold text-slate-900 hover:underline whitespace-nowrap mt-1">
            {item.action || "VIEW"}
          </button>
        </div>
      );
    })}
  </CardContent>
</Card>

        {/* Payment Methods */}
         <Card className="border border-slate-100 shadow-sm rounded-xl h-full">
               <CardHeader className="p-6 pb-4">
                 <CardTitle className="text-lg font-bold text-slate-900">Payment Methods</CardTitle>
               </CardHeader>
               <CardContent className="p-6 pt-0 space-y-6">
                 {methods.map((method, index) => (
                   <div key={index}>
                     <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-medium text-slate-600">{method.name}</span>
                       <span className="text-sm font-medium text-slate-500">{method.percentage}%</span>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2">
                       <div
                         className="bg-slate-900 h-2 rounded-full"
                         style={{ width: `${method.percentage}%` }}
                       ></div>
                     </div>
                   </div>
                 ))}
               </CardContent>
             </Card>
         
      </div>
    </div>
  );
}
