import React, { useEffect, useState } from "react";
import { Button } from "../../../../../src/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Wallet, Calendar, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, CalendarDays } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../src/components/ui/Card";
import { Eye, CreditCard, Banknote, Building, ChevronLeft, ChevronRight } from "lucide-react";
import { AlertCircle, Mail } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../../src/components/ui/pagination";
import {getFeeDashboard,getFeeCSV} from "../../../../utils/utils";
import toast from "react-hot-toast";

export default function FeesPage() {
const navigate = useNavigate();
const [dashboardData, setDashboardData] = useState(null);
const [filterStudent, setFilterStudent] = useState("All Student");
const [filterMethod, setFilterMethod] = useState("All Payment Method");
const [filterStatus, setFilterStatus] = useState("All Status");
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const clearFilters = () => {
  setFilterStudent("All Student");
  setFilterMethod("All Payment Method");
  setFilterStatus("All Status");
};

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



const handleExportCSV = async () => {
  try {
    const response = await getFeeCSV();

    if (!response) {
      toast.error("Failed to fetch CSV data.");
      return;
    }

    if (response?.data?.csvUrl) {
      const link = document.createElement("a");
      link.href = response.data.csvUrl;
      link.target = "_blank";
      link.setAttribute("download", response.data.filename || "fee-transactions.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(response.message || "CSV file downloaded successfully");
    } else {
      toast.error("CSV URL not found in the response.");
    }
  } catch (error) {
    console.error("CSV Export Error:", error);
    toast.error("An error occurred during CSV export.");
  }
};

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
    studentId: tx.studentId,
    name: tx.studentName,
    initials: tx.studentName?.slice(0, 2).toUpperCase(),
    amount: `₹${tx.amount}`,
    date: tx.paymentDate,
    method: tx.paymentMethod,
    methodIcon: tx.paymentMethod === "CASH" ? Banknote : CreditCard,
    status: "Success",
  })) || [];

const uniqueStudents = [...new Set(transactions.map(tx => tx.name).filter(Boolean))];
const uniqueMethods = [...new Set(transactions.map(tx => tx.method).filter(Boolean))];
const uniqueStatuses = [...new Set(transactions.map(tx => tx.status).filter(Boolean))];

const filteredTransactions = transactions.filter(tx => {
  const matchStudent = filterStudent === "All Student" || tx.name === filterStudent;
  const matchMethod = filterMethod === "All Payment Method" || tx.method === filterMethod;
  const matchStatus = filterStatus === "All Status" || tx.status === filterStatus;
  return matchStudent && matchMethod && matchStatus;
});

useEffect(() => {
  setCurrentPage(1);
}, [filterStudent, filterMethod, filterStatus]);

const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const currentItems = filteredTransactions.slice(startIndex, endIndex);
const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

const getPaginationItems = () => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      i === currentPage ||
      i === currentPage - 1 ||
      i === currentPage + 1
    ) {
      pages.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pages.push("...");
    }
  }
  return pages.filter(
    (item, index) => item !== "..." || pages[index - 1] !== "..."
  );
};


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
          <Button className="bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 cursor-pointer">
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
            <select 
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              className="appearance-none bg-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option value="All Student">All Student</option>
              {uniqueStudents.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="appearance-none bg-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option value="All Payment Method">All Payment Method</option>
              {uniqueMethods.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none bg-none bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent py-2 pl-3 pr-8 cursor-pointer">
              <option value="All Status">All Status</option>
              {uniqueStatuses.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button 
          onClick={clearFilters}
          className="text-sm font-medium text-slate-900 hover:underline whitespace-nowrap cursor-pointer">
          Clear all filters
        </button>
      </CardContent>
    </Card>

    {/* Recent Transactions */}
    <Card className="mb-6 border border-slate-100 shadow-sm rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-slate-100">
            <CardTitle className="text-lg font-bold text-slate-900">Recent Transactions</CardTitle>
            <div className="flex gap-2">
              {/* <Button variant="outline" className="text-sm border-slate-200 text-slate-600">Filter</Button> */}
              <Button onClick={handleExportCSV} variant="outline" className="text-sm border-slate-200 text-slate-600 cursor-pointer">Export CSV</Button>
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
               {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  currentItems.map((tx, index) => {
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
                        <button 
                        onClick={() =>
    navigate(`/admin/fees/history?studentId=${tx.studentId}`)
  }className="text-slate-400 hover:text-slate-600">
                          <Eye className="w-4 h-4 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-4">
              <span className="text-sm text-slate-500 hidden sm:block w-1/3">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </span>
              <div className="flex-1 flex justify-end">
                <Pagination className="w-auto mx-0">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    
                    {getPaginationItems().map((item, idx) => (
                      <PaginationItem key={idx} className="hidden sm:inline-block">
                        {item === "..." ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === item}
                            onClick={() => setCurrentPage(item)}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </Card>

      
       {/* Urgent Reminders and Payment Methods */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"> */}
{/* <Card className="border border-slate-100 shadow-sm rounded-xl h-full">
  <CardHeader className="p-6 pb-4">
    <CardTitle className="text-lg font-bold text-slate-900">
      Urgent Fee Reminders
    </CardTitle>
  </CardHeader> 

  <CardContent className="p-6 pt-0 space-y-4">

    
    {!dashboardData?.urgentReminders?.length && (
      <p className="text-sm text-slate-500">No urgent reminders</p>
    )}

  
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
</Card>  */}

        {/* Payment Methods  */}
         {/* <Card className="border border-slate-100 shadow-sm rounded-xl h-full">
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
             </Card> */}
      {/* </div> */}
    </div>
  );
}
