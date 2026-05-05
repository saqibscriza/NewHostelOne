import React, { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Info,
  Receipt,
  Search,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import {
  getAllStudentApi,
  getStudentByIdApi,
  getFeeSummaryByIdApi,
  postCollectFeeApi
} from "../../../../utils/utils";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(Number(amount || 0));

  const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);

  return `${day}/${month}/${year}`;
};

export default function CollectFeePage() {
  const [studentAllData, setStudentAllData] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [amountPaid, setAmountPaid] = useState("0");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [feeSummary, setFeeSummary] = useState([]); 
  const [feeLoader, setFeeLoader] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);


  const navigate = useNavigate();

  const studentGetAllApi = async (page = 1, size = 10) => {
    setLoaderCheck(true);
    setErrorMessage("");

    try {
      const response = await getAllStudentApi({ page, size });

      if (response?.status === "success") {
        const content = response?.data?.content || [];

        setStudentAllData(content);
        setTotalPages(response?.data?.totalPages || 1);
        setCurrentPage(response?.data?.currentPage || 1);

        setSelectedStudent((prev) => {
          if (!content.length) return null;
          if (!prev) return content[0];
          return content.find((student) => student.id === prev.id) || content[0];
        });
      } else {
        setErrorMessage(response?.message || "Failed to fetch students.");
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Something went wrong while fetching students.");
    } finally {
      setLoaderCheck(false);
    }
  };

  const fetchFeeSummary = async (studentId) => {
  if (!studentId) return;

  setFeeLoader(true);

  try {
    const response = await getFeeSummaryByIdApi(studentId);

    console.log("FEE SUMMARY =>", response);

    if (response?.status === "success") {
      const summary = response?.data || null;

      setFeeSummary(summary);
      setTotalAmount(summary?.feeBreakdown?.totalPayable || 0);
      setAmountPaid(String(summary?.feeBreakdown?.totalPayable || 0));
    } else {
      setFeeSummary(null);
      setTotalAmount(0);
      setAmountPaid("0");
    }
  } catch (error) {
    console.log(error);
    setFeeSummary(null);
    setTotalAmount(0);
    setAmountPaid("0");
  } finally {
    setFeeLoader(false);
  }
};


  const handleSearch = async (value) => {
    setSearchTerm(value);
    setErrorMessage("");

    if (!value.trim()) {
      studentGetAllApi();
      return;
    }

    if (value.toUpperCase().startsWith("STU")) {
      setLoaderCheck(true);

      try {
        const response = await getStudentByIdApi(value.trim());

        if (response?.status === "success") {
          const student = response?.data;

          setSelectedStudent(student);
          setStudentAllData(student ? [student] : []);
        } else {
          setStudentAllData([]);
          setSelectedStudent(null);
          setErrorMessage("Student not found");
        }
      } catch (err) {
        console.log(err);
        setStudentAllData([]);
        setSelectedStudent(null);
        setErrorMessage("Something went wrong");
      } finally {
        setLoaderCheck(false);
      }
    }
  };

  useEffect(() => {
    studentGetAllApi();
  }, []);

  useEffect(() => {
    if (selectedStudent?.studentId) {
      fetchFeeSummary(selectedStudent.studentId);
    }
  }, [selectedStudent]);

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredStudents = studentAllData.filter((student) => {
    if (!normalizedSearch || normalizedSearch.toUpperCase().startsWith("STU")) {
      return true;
    }

    return [
      student?.fullName,
      student?.studentId,
      student?.email,
      student?.phone,
      student?.roomId,
    ]
      .filter(Boolean)
      .some((value) =>
        String(value).toLowerCase().includes(normalizedSearch)
      );
  });

  return (
    <div className="max-w-7xl mx-auto pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Collect Student Fee</h1>
        <p className="text-slate-500 text-base mt-2">
          Record and manage student fee payments with ease.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-slate-100 shadow-sm rounded-xl mb-6">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                1. Select Student
              </CardTitle>
              <p className="text-xs text-slate-500 mt-2">
                {loaderCheck
                  ? "Loading students..."
                  : `Page ${currentPage} of ${totalPages} • ${filteredStudents.length} student${filteredStudents.length === 1 ? "" : "s"}`}
              </p>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search student by name or ID..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {loaderCheck ? (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  Fetching students...
                </div>
              ) : filteredStudents.length ? (
                <div className="space-y-3">
                  {filteredStudents.map((student) => {
                    const isSelected = selectedStudent?.id === student.id;

                    return (
                      <button
                        type="button"
                        key={student.id}
                        onClick={() => setSelectedStudent(student)}
                        className={`w-full rounded-xl p-4 flex items-center justify-between gap-4 text-left border transition-colors ${
                          isSelected
                            ? "bg-slate-100 border-slate-900"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                            <User className="w-5 h-5 text-slate-600" />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-base font-bold text-slate-900 truncate">
                              {student.fullName || "Unnamed Student"}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 truncate">
                              ID: {student.studentId || "N/A"} • Room: {student.roomId || "Not assigned"}
                            </p>
                          </div>
                        </div>

                        <div
                          className={`px-3 py-1 text-[10px] font-bold rounded-full tracking-wider shrink-0 ${
                            isSelected
                              ? "bg-slate-900 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isSelected ? "SELECTED" : "SELECT"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                  No students found for this search.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-100 shadow-sm rounded-xl">
  <CardHeader className="p-6 pb-4">
    <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
      2. Fee Summary Breakdown
    </CardTitle>
    {feeSummary?.fullName ? (
      <p className="text-xs text-slate-500 mt-2">
        Fee summary for {feeSummary.fullName}
      </p>
    ) : null}
  </CardHeader>

  <CardContent className="p-6 pt-0">
    {feeLoader ? (
      <div className="text-sm text-slate-500">Loading fee summary...</div>
    ) : feeSummary?.feeBreakdown ? (
      <div className="space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-sm text-slate-600">Room Rent</span>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(feeSummary.feeBreakdown.roomRent)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-sm text-slate-600">Mess Charges</span>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(feeSummary.feeBreakdown.messCharges)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <span className="text-sm text-slate-600">Electricity Charges</span>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(feeSummary.feeBreakdown.electricityCharges)}
          </span>
        </div>

        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Late Fee</span>
            {Number(feeSummary.feeBreakdown.lateFee) > 0 && (
              <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-md tracking-wider">
                OVERDUE
              </span>
            )}
          </div>
          <span className="text-sm font-bold text-slate-900">
            {formatCurrency(feeSummary.feeBreakdown.lateFee)}
          </span>
        </div>

        <div className="pt-4 mt-2 flex justify-between items-center">
          <span className="text-lg font-bold text-slate-900">Total Payable</span>
          <span className="text-2xl font-bold text-slate-900">
            {formatCurrency(feeSummary.feeBreakdown.totalPayable)}
          </span>
        </div>
      </div>
    ) : (
      <div className="text-sm text-slate-500">
        Select a student to view fee summary.
      </div>
    )}
  </CardContent>
</Card>

        </div>

        <div className="lg:col-span-1">
          <Card className="border border-slate-100 shadow-sm rounded-xl h-full">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                3. Payment Details
              </CardTitle>
            </CardHeader>

            <CardContent className="p-6 pt-0 space-y-6">
              {selectedStudent && (
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-slate-500">
                    Selected Student
                  </p>
                  <p className="text-base font-bold text-slate-900 mt-1">
                    {selectedStudent.fullName || "Unnamed Student"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedStudent.studentId || "N/A"} • {selectedStudent.phone || "No phone number"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Amount Paid (₹)</label>
                <input
                  type="text"
                  value={amountPaid}
                  onChange={(event) => setAmountPaid(event.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-base font-bold text-slate-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Payment Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm text-slate-900"
                  />
                  <CalendarIcon className="w-5 h-5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Payment Method</label>
                <div className="grid grid-cols-2 gap-3">
                  {["ONLINE", "CASH", "CARD", "CHEQUE"].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2.5 rounded-lg text-xs font-bold tracking-wide border transition-colors ${
                        paymentMethod === method
                          ? "bg-slate-100 border-slate-900 text-slate-900"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* <Button
                  onClick={() =>
  navigate(`/admin/fees/receipt?transactionId=${selectedStudent?.transactionId}`)
}
                  disabled={!selectedStudent}
                  className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Receipt className="w-4 h-4" />
                  Generate Receipt
                </Button> */}
                <Button className="w-full bg-[#0f172a] hover:bg-[#1e293b] text-white h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                
onClick={async () => {
  const res = await postCollectFeeApi({
    studentId: selectedStudent.studentId,
    roomRent: totalAmount,
    paidAmount: amountPaid,
    paymentMethod,
    paymentDate: formatDate(paymentDate),
  });

  console.log("COLLECT RESPONSE =>", res);

  const txnId = res?.data?.data?.transactionId; // ✅ FIX

  if (txnId) {
    navigate(`/admin/fees/receipt?transactionId=${txnId}`);
  } else {
    console.log("Transaction ID not found ❌");
  }
}}
>
  Generate Receipt
</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 bg-slate-100 rounded-xl p-4 flex items-center gap-3">
        <Info className="w-5 h-5 text-slate-700 shrink-0" />
        <p className="text-sm text-slate-900 font-medium">
          Payment notification will be sent automatically to the student's registered mobile number and email upon confirmation.
        </p>
      </div>
    </div>
  );
}
