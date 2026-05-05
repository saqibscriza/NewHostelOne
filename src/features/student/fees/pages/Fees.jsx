import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, CreditCard, Download } from "lucide-react";
import {
  getFeeStudentDetails,
  getStudentTransectionsApi,
} from "../../../../utils/utils";

export default function Fees() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [feeData, setFeeData] = useState(null);

  const extractPayload = (response) => {
    if (response?.data?.data) return response.data.data;
    if (
      response?.data &&
      !response?.data?.content &&
      !response?.data?.currentDues
    ) {
      return response.data;
    }
    if (response?.data) return response.data;
    return response || {};
  };

  const fetchFeeDetails = async () => {
    try {
      const response = await getFeeStudentDetails();
      const payload = extractPayload(response);
      console.log("Fee details payload =>", payload);
      setFeeData(payload || null);
    } catch (error) {
      console.error("Error fetching student fee details:", error);
      setFeeData(null);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await getStudentTransectionsApi(1, 10);
      const responseData = extractPayload(res);
      const transactionList = responseData?.content || [];

      console.log("Transactions payload =>", responseData);
      setTransactions(transactionList);
      setTotalItems(responseData?.totalItems || transactionList.length);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      setTransactions([]);
      setTotalItems(0);
    }
  };

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchFeeDetails(), fetchTransactions()]);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "PAID":
        return "bg-gray-100 text-gray-600";
      case "FAILED":
        return "bg-red-50 text-red-600 border border-red-100";
      case "PENDING":
        return "bg-amber-50 text-amber-600 border border-amber-100";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const [day, month, year] = date.split("/");
    if (!day || !month || !year) return date;

    const fullYear = Number(year) < 100 ? `20${year}` : year;
    const parsedDate = new Date(`${fullYear}-${month}-${day}`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const totalOutstandingBalance =
    feeData?.totalOutstandingBalance ?? feeData?.currentDues?.grandTotal ?? 0;
  const currentBillingCycle = feeData?.currentDues?.billingCycle || "Current";
  const cycleStatus =
    totalOutstandingBalance > 0 ? "Action Required" : "No Dues";

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Fees & Billing
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your academic year finances and service dues.
          </p>
        </div>
        <div className="bg-[#e2e8f0] px-4 py-3 rounded-lg flex items-center gap-3 w-fit">
          <AlertCircle className="w-5 h-5 text-slate-700" />
          <div className="text-sm">
            <span className="font-bold text-slate-800">PAYMENT DEADLINE</span>
            <br />
            <span className="text-slate-600">
              Oct 30, 2025 • Late fee of ₹25 applies after.
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 col-span-1 lg:col-span-2 flex flex-col md:flex-row gap-8">
          <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-4">
              Total Outstanding Balance
            </h3>
            <div className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              ₹{totalOutstandingBalance}
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => navigate("/student/fees/pay")}
                className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-lg font-medium flex-1 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" /> Pay Now
              </button>
              <button className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-6 py-2.5 rounded-lg font-medium flex-1">
                View Full Invoice
              </button>
            </div>
          </div>
          <div className="md:w-48 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">
                Cycle Status
              </h3>
              <span className="bg-[#e2e8f0] text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md">
                {cycleStatus}
              </span>
            </div>
            <div className="mt-8 md:mt-0">
              <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-1">
                Due Date
              </h3>
              <p className="font-bold text-gray-900">30 October, 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">
            {currentBillingCycle} Dues Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-3 text-gray-600">
                <BedIcon /> Room Rent
              </div>
              <span className="font-bold text-gray-900">
                ₹{feeData?.currentDues?.roomRent || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-3 text-gray-600">
                <UtensilIcon /> Mess Fee
              </div>
              <span className="font-bold text-gray-900">
                ₹{feeData?.currentDues?.messFee || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-3 text-gray-600">
                <ZapIcon /> Electricity
              </div>
              <span className="font-bold text-gray-900">
                ₹{feeData?.currentDues?.electricity || 0}
              </span>
            </div>
            <div className="flex items-center justify-between text-[15px]">
              <div className="flex items-center gap-3 text-gray-600">
                <AlertTriangleIcon /> Late Fees
              </div>
              <span className="font-bold text-red-500">
                ₹{feeData?.currentDues?.lateFees || 0}
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="font-bold text-gray-900">TOTAL</span>
            <span className="text-xl font-bold text-gray-900">
              ₹{feeData?.currentDues?.grandTotal || 0}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Transaction History
          </h2>
          <div className="flex gap-3">
            <button className="text-xs font-bold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 uppercase tracking-wider text-gray-600">
              Filter
            </button>
            <button className="text-xs font-bold px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 uppercase tracking-wider text-gray-600">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Description</th>
                <th className="px-6 py-4 font-bold text-right">Amount</th>
                <th className="px-6 py-4 font-bold text-center">Status</th>
                <th className="px-6 py-4 font-bold text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <tr key={transaction.transactionId}>
                    <td className="px-6 py-4">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">
                        {transaction.description || transaction.billingCycle}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        TXN_ID: #{transaction.transactionId}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ₹{Number(transaction.amount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`${getStatusStyle(
                          transaction.status,
                        )} text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        type="button"
                        disabled={transaction.status !== "PAID"}
                        className={
                          transaction.status === "PAID"
                            ? "text-gray-400 hover:text-gray-900"
                            : "text-gray-300 cursor-not-allowed"
                        }
                      >
                        <Download className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm text-gray-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {transactions.length} of {totalItems} transactions
          </span>
          <div className="flex gap-1">
            <button className="p-1 rounded border border-gray-200 hover:bg-gray-50">
              &lt;
            </button>
            <button className="p-1 rounded border border-gray-200 hover:bg-gray-50">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 col-span-1 lg:col-span-2">
          <h3 className="font-bold text-gray-900 text-[15px] flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-400" /> Payment Guidelines
          </h3>
          <ul className="space-y-4 mt-6">
            <li className="flex gap-4">
              <span className="font-bold text-gray-900">01.</span>
              <span className="text-sm text-gray-500">
                Online payments may take up to 24 hours to reflect in the portal
                dashboard.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-gray-900">02.</span>
              <span className="text-sm text-gray-500">
                Late fees are calculated at 2% interest per week after the grace
                period.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="font-bold text-gray-900">03.</span>
              <span className="text-sm text-gray-500">
                Contact the accounts office for partial payment requests before
                the 20th of each month.
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-[#0f172a] rounded-2xl shadow-sm p-6 md:p-8 text-white flex flex-col justify-center">
          <h3 className="font-bold text-lg mb-2">Need Financial Assistance?</h3>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            If you&apos;re facing difficulties with payment or have
            discrepancies in your bill, our support desk is ready to help.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm">
              Raise Ticket
            </button>
            <button className="bg-white text-slate-900 px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm">
              Call Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BedIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}

function UtensilIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
      />
    </svg>
  );
}

function ZapIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  );
}

function AlertTriangleIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
