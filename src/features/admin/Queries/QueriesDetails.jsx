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
      if (response?.data) {
        setQueries(response?.data?.requests || []);
        setSummary(
          response?.data?.summary || {
            totalQueries: 0,
            pendingQueries: 0,
            acceptedQueries: 0,
            rejectedQueries: 0,
          }
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

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Room Queries</h1>
        <p className="text-muted-foreground text-sm">
          Review and manage accommodation requests from prospective students.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard title="Total Queries" value={summary.totalQueries} icon={<ClipboardList />} />
        <StatCard title="Pending" value={summary.pendingQueries} icon={<Clock />} />
        <StatCard title="Accepted" value={summary.acceptedQueries} icon={<CheckCircle />} />
        <StatCard title="Rejected" value={summary.rejectedQueries} icon={<XCircle />} />
      </div>

      {/* TABLE CARD */}
      <Card>
        <CardContent className="p-4 space-y-4">
          {/* FILTERS */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Select
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    status: v === "all" ? "" : v.toUpperCase(),
                    page: 1,
                  }))
                }
              >
                <SelectTrigger className="w-[150px]">
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
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Hostels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hostels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* TABLE HEADER */}
          <div className="grid grid-cols-6 text-sm font-medium text-muted-foreground px-2">
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
                  className="grid grid-cols-6 items-center bg-muted/40 p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item?.fullName}</p>
                    <p className="text-xs text-muted-foreground">
                      Reg ID: {item?.userId || "-"}
                    </p>
                  </div>

                  <p>{item?.roomType}</p>

                  <div className="text-sm">
                    <p>{item?.phone}</p>
                    <p className="text-muted-foreground">{item?.email}</p>
                  </div>

                  <div>
                    <p>{item?.hostelName}</p>
                    <p className="text-xs text-muted-foreground">Campus North</p>
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

          {/* PAGINATION */}
          <div className="flex justify-between items-center pt-4">
            <p className="text-sm text-muted-foreground"></p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 1}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .slice(0, 5)
                .map((pageNum) => (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={filters.page === pageNum ? "default" : "outline"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: pageNum }))
                    }
                  >
                    {pageNum}
                  </Button>
                ))}

              {totalPages > 5 && (
                <>
                  <span className="px-2">...</span>
                  <Button
                    size="sm"
                    variant={filters.page === totalPages ? "default" : "outline"}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: totalPages }))
                    }
                  >
                    {totalPages}
                  </Button>
                </>
              )}

              <Button
                variant="outline"
                size="sm"
                disabled={filters.page >= totalPages}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      {successModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-10 w-[500px] text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-black" />
            </div>
            <h2 className="text-3xl font-semibold mt-6">Booking Confirmed</h2>
            <p className="text-muted-foreground mt-4 text-lg">
              Success! The room for{" "}
              <span className="font-semibold">{selectedStudent?.fullName}</span>{" "}
              at{" "}
              <span className="font-semibold">{selectedStudent?.hostelName}</span>{" "}
              has been successfully confirmed.
            </p>
            <Button className="w-full mt-8 h-12 text-lg" onClick={() => setSuccessModal(false)}>
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