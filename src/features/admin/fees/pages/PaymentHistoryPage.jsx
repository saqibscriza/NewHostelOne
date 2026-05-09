import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";

import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Search } from "lucide-react";
import { getFeePaymentHistory } from "../../../../utils/utils";
import { useSearchParams } from "react-router-dom";

import {
  CreditCard,
  Banknote,
  Building,
  QrCode,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function PaymentHistoryPage() {
  const [feeHistory, setFeeHistory] = useState([]);
  const [method, setMethod] = useState("ALL");
  const [student, setStudent] = useState(null);
  const [balance, setBalance] = useState(null);
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get("studentId");
  const [searchTxn, setSearchTxn] = useState("");
  const [status, setStatus] = useState("ALL");

  const myFeeHistory = async () => {
    try {
      const res = await getFeePaymentHistory(studentId);

      console.log("FULL RESPONSE 👉", res);

      const data = res?.data;

      setFeeHistory(data?.paymentHistory?.content || []);
      setStudent(data?.studentDetails || null);
      setBalance(data?.balanceOverview || null);
    } catch (error) {
      console.error("Error fetching fee payment history:", error);
      setFeeHistory([]);
    }
  };
  useEffect(() => {
    if (studentId) {
      myFeeHistory();
    }
  }, [studentId]);

  const filteredHistory = useMemo(() => {
  return feeHistory.filter((tx) => {
    const matchesMethod =
      method === "ALL" || tx.paymentMethod === method;

    const matchesStatus =
      status === "ALL" || tx.status === status;

    const matchesTxn =
      tx.transactionId
        ?.toLowerCase()
        .includes(searchTxn.toLowerCase());

    return matchesMethod && matchesStatus && matchesTxn;
  });
}, [feeHistory, method, status, searchTxn]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Comprehensive log of all student transactions and financial records.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* StudentProfileCard */}
          <Card className="border-border shadow-sm rounded-xl bg-card h-full">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center gap-6 h-full">
             <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0">
  {student?.photo ? (
    <img
      src={student.photo}
      alt={student?.studentName}
      className="w-full h-full rounded-2xl object-cover"
    />
  ) : (
    <img
      src="https://i.pravatar.cc/150?img=11"
      alt="Default Student"
      className="w-full h-full rounded-2xl object-cover"
    />
  )}
</div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  {student?.studentName || "-"}
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-12">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Resident ID
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {student?.studentId}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Room Assigned
                    </p>
                    <p className="text-sm font-bold text-foreground">
                      {student?.roomAssigned}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          {/* BalanceOverviewCard */}
          <Card className="border-border shadow-sm rounded-xl bg-card h-full">
            <CardContent className="p-6 flex flex-col justify-center h-full">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-6">
                Balance Overview
              </h3>
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Total Paid
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {balance?.totalPaid || 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Pending
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {balance?.pending || 0}
                  </p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden flex">
                <div className="h-full bg-foreground w-[90%]"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* HistoryFilters */}
      {/* HistoryFilters */}
<Card className="border-border shadow-sm rounded-xl bg-card mb-6">
  <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
    <span className="text-sm font-medium text-foreground whitespace-nowrap">
      Filter by:
    </span>

    {/* Payment Method */}
    <Select value={method} onValueChange={setMethod}>
      <SelectTrigger className="w-full sm:w-[200px] bg-muted/30 border-border">
        <SelectValue placeholder="All Payment Method" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Payment Method</SelectItem>
        <SelectItem value="ONLINE">Online</SelectItem>
        <SelectItem value="UPI">UPI</SelectItem>
        <SelectItem value="CASH">Cash</SelectItem>
        <SelectItem value="BANK_TRANSFER">Bank Transfer</SelectItem>
      </SelectContent>
    </Select>

    {/* Status */}
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-full sm:w-[160px] bg-muted/30 border-border">
        <SelectValue placeholder="All Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">All Status</SelectItem>
        <SelectItem value="PAID">Paid</SelectItem>
        <SelectItem value="PENDING">Pending</SelectItem>
        <SelectItem value="FAILED">Failed</SelectItem>
      </SelectContent>
    </Select>

    {/* Search */}
    <div className="relative flex-1 w-full sm:max-w-xs">
      <Input
        value={searchTxn}
        onChange={(e) => setSearchTxn(e.target.value)}
        placeholder="Transaction ID"
        className="pl-4 pr-10 bg-muted/30 border-border"
      />

      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
    </div>

    {/* Clear */}
    <button
      onClick={() => {
        setMethod("ALL");
        setStatus("ALL");
        setSearchTxn("");
      }}
      className="text-sm font-medium text-foreground hover:underline sm:ml-auto mt-2 sm:mt-0"
    >
      Clear all filters
    </button>
  </CardContent>
</Card>

      {/* HistoryTransactions */}
      <Card className="border border-border shadow-sm rounded-xl overflow-hidden bg-card">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-border">
          <CardTitle className="text-lg font-bold text-foreground">
            Recent Transactions
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="text-sm border-border text-foreground"
            >
              Filter
            </Button>
            <Button
              variant="outline"
              className="text-sm border-border text-foreground"
            >
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-sm font-bold text-muted-foreground bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">TXN. ID</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((tx, index) => {
                const getMethodIcon = (method) => {
  switch (method) {
    case "CASH":
      return <Banknote className="w-4 h-4" />;
    case "UPI":
      return <QrCode className="w-4 h-4" />;
    case "ONLINE":
      return <CreditCard className="w-4 h-4" />;
    case "BANK_TRANSFER":
      return <Building className="w-4 h-4" />;
    default:
      return <CreditCard className="w-4 h-4" />;
  }
};

                return (
                  <tr
                    key={index}
                    className="bg-card border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-6 py-4 text-muted-foreground">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {tx.transactionId}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {tx.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        {getMethodIcon(tx.paymentMethod)}
                        {tx.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground">
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-foreground hover:text-foreground/80">
                        <Download className="w-5 h-5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <span className="text-sm text-muted-foreground">
            Showing 1 to 4 of 24 hostels
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded bg-foreground text-background text-sm font-bold">
              1
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-foreground hover:bg-muted text-sm font-bold">
              2
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded text-foreground hover:bg-muted text-sm font-bold">
              3
            </button>
            <span className="text-muted-foreground px-1">...</span>
            <button className="w-7 h-7 flex items-center justify-center rounded text-foreground hover:bg-muted text-sm font-bold">
              6
            </button>
            <button className="p-1 text-muted-foreground hover:text-foreground">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
