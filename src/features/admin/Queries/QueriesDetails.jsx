import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/Badge";
import { useEffect, useState } from "react";
import {
  getAllQueriesApi,
  approveRequestApi,
  rejectRequestApi,
} from "../../../utils/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select";
import { CheckCircle, XCircle, Clock, ClipboardList } from "lucide-react";
import DefaultTable from "../../../components/DefaultTable/DefaultTable";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../../../components/ui/pagination";

export default function QueriesDetails() {
  const [queries, setQueries] = useState([]);
  const [summary, setSummary] = useState({
    totalQueries: 0,
    pendingQueries: 0,
    acceptedQueries: 0,
    rejectedQueries: 0,
  });

  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [successModal, setSuccessModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    hostelId: "",
    page: 1,
    size: 10,
  });

  const getQueriesData = async () => {
    setLoading(true);
    try {
      const response = await getAllQueriesApi(filters);
      console.log("API Response:", response); // Debug log

      if (response?.data) {
        setQueries(response?.data?.requests || []);
        setSummary(
          response?.data?.summary || {
            totalQueries: 0,
            pendingQueries: 0,
            acceptedQueries: 0,
            rejectedQueries: 0,
          },
        );
        setTotalPages(response?.data?.totalPages || 1);
        setTotalElements(response?.data?.totalElements || 0);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (item) => {
    try {
      const res = await approveRequestApi(item?.requestId);
      if (res?.status === 200 || res?.data?.status === "success") {
        setSelectedStudent(item);
        setSuccessModal(true);
        await getQueriesData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (item) => {
    try {
      const res = await rejectRequestApi(item?.requestId);
      if (res?.status === 200 || res?.data?.status === "success") {
        setSelectedStudent(item);
        setRejectModal(true);
        await getQueriesData();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getQueriesData();
  }, [filters.status, filters.hostelId, filters.page, filters.size]);

  // Pagination - Get Page Numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (filters.page > 3) {
        pages.push("...");
      }

      const start = Math.max(2, filters.page - 1);
      const end = Math.min(totalPages - 1, filters.page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (filters.page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Calculate showing range
  const getShowingRange = () => {
    if (totalElements === 0) return { start: 0, end: 0 };
    const start = (filters.page - 1) * filters.size + 1;
    const end = Math.min(filters.page * filters.size, totalElements);
    return { start, end };
  };

  const { start, end } = getShowingRange();

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Room Queries</h1>
        <p className="text-muted-foreground text-sm">
          Review and manage accommodation requests from prospective students.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {" "}
        <StatCard
          title="Total Queries"
          value={summary.totalQueries}
          icon={<ClipboardList />}
        />
        <StatCard
          title="Pending"
          value={summary.pendingQueries}
          icon={<Clock />}
        />
        <StatCard
          title="Accepted"
          value={summary.acceptedQueries}
          icon={<CheckCircle />}
        />
        <StatCard
          title="Rejected"
          value={summary.rejectedQueries}
          icon={<XCircle />}
        />
      </div>

      {/* TABLE CARD */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* FILTERS */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Select
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: v === "all" ? "" : v.toUpperCase(),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-full sm:w-[150px] px-4 pr-4">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    hostelId: v === "all" ? "" : v,
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-[150px] px-4 pr-4">
                  <SelectValue placeholder="All Hostels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hostels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[1100px]">
              {/* TABLE HEADER */}
              <div className="grid grid-cols-6 gap-6 text-sm font-medium text-muted-foreground px-2 pb-3">
                <span>STUDENT</span>
                <span>ROOM TYPE</span>
                <span>CONTACT INFO</span>
                <span>HOSTEL APPLIED</span>
                <span>STATUS</span>
                <span className="text-right">ACTIONS</span>
              </div>

              {/* ROWS */}
              <div className="space-y-2">
                {loading ? (
                  <p className="text-center py-6">Loading...</p>
                ) : queries.length === 0 ? (
                  <DefaultTable
                    title="No Queries Found"
                    description="There are currently no room queries available."
                    height="400px"
                  />
                ) : (
                  queries.map((item, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-6 gap-6 items-center bg-muted/40 p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{item?.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          Reg ID: {item?.userId || "-"}
                        </p>
                      </div>

                      <p>{item?.roomType || "-"}</p>

                      <div className="text-sm">
                        <p>{item?.phone}</p>
                        <p className="text-muted-foreground">{item?.email}</p>
                      </div>

                      <div>
                        <p>{item?.hostelName}</p>
                        <p className="text-xs text-muted-foreground">
                          Campus North
                        </p>
                      </div>

                      <Badge
                        variant={
                          item?.status === "REJECTED"
                            ? "destructive"
                            : item?.status === "APPROVED"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {item?.status}
                      </Badge>

                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          disabled={item?.status !== "PENDING"}
                          onClick={() => handleAccept(item)}
                        >
                          Accept
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={item?.status !== "PENDING"}
                          onClick={() => handleReject(item)}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          {/* PAGINATION - Always show when there's data */}
          {queries.length > 0 && (
            <div className="flex w-full justify-end mt-4 pt-4 border-t">
              {/* RIGHT SIDE - Pagination controls */}
              <Pagination className="!justify-end">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilters((prev) => ({
                          ...prev,
                          page: Math.max(1, prev.page - 1),
                        }));
                      }}
                      className={
                        filters.page === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {pageNumbers.map((page, index) => (
                    <PaginationItem key={index}>
                      {page === "..." ? (
                        <PaginationEllipsis />
                      ) : (
                        <PaginationLink
                          href="#"
                          isActive={filters.page === page}
                          onClick={(e) => {
                            e.preventDefault();
                            setFilters((prev) => ({
                              ...prev,
                              page,
                            }));
                          }}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      )}
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setFilters((prev) => ({
                          ...prev,
                          page: Math.min(totalPages, prev.page + 1),
                        }));
                      }}
                      className={
                        filters.page === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-5 sm:p-8 w-[95%] max-w-[500px] text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-3xl font-semibold mt-6">Booking Confirmed</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Success! The room for{" "}
              <span className="font-semibold">{selectedStudent?.fullName}</span>{" "}
              at{" "}
              <span className="font-semibold">
                {selectedStudent?.hostelName}
              </span>{" "}
              has been successfully confirmed.
            </p>
            <Button
              className="w-full mt-8 h-12 text-lg"
              onClick={() => setSuccessModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-[500px] text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-semibold mt-6">Booking Rejected</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Request for{" "}
              <span className="font-semibold">{selectedStudent?.fullName}</span>{" "}
              has been rejected.
            </p>
            <Button
              variant="destructive"
              className="w-full mt-8 h-12 text-lg"
              onClick={() => setRejectModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* STAT CARD */
function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
        <div className="p-2 bg-muted rounded-md">{icon}</div>
      </CardContent>
    </Card>
  );
}
