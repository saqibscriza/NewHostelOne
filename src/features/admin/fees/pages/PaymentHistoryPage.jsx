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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Search } from "lucide-react";
import { getFeePaymentHistory, getFeeCSV } from "../../../../utils/utils";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

useEffect(() => {
    setCurrentPage(1);
  }, [method, status, searchTxn]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredHistory.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

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
      <SelectTrigger className="w-full sm:w-[200px] bg-muted/30 border-border cursor-pointer">
        <SelectValue placeholder="Payment Mode" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ALL">Payment Mode</SelectItem>
        <SelectItem value="ONLINE">Online</SelectItem>
        <SelectItem value="CARD">Card</SelectItem>
        <SelectItem value="CASH">Cash</SelectItem>
        <SelectItem value="CHEQUE">Cheque</SelectItem>
      </SelectContent>
    </Select>

    {/* Status */}
    <Select value={status} onValueChange={setStatus}>
      <SelectTrigger className="w-full sm:w-[160px] bg-muted/30 border-border cursor-pointer">
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
      className="text-sm font-medium text-foreground hover:underline sm:ml-auto mt-2 sm:mt-0 cursor-pointer"
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
            {/* <Button
              variant="outline"
              className="text-sm border-border text-foreground"
            >
              Filter
            </Button> */}
            <Button
            onClick={handleExportCSV}
              variant="outline"
              className="text-sm border-border text-foreground cursor-pointer"
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

              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-10">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentItems.map((tx, index) => {
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
              }))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
            <span className="text-sm text-muted-foreground hidden sm:block w-1/3">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredHistory.length)} of {filteredHistory.length} transactions
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
    </div>
  );
}
