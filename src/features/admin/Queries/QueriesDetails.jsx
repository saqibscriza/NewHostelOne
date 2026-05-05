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
import { Input } from "../../../components/ui/input";
import { CheckCircle, XCircle, Clock, ClipboardList } from "lucide-react";

export default function QueriesDetails() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    hostelId: "",
    page: 0,
    size: 10,
  });

  // GET api

  const getQueriesData = async () => {
    setLoading(true);
    try {
      const response = await getAllQueriesApi(filters);

      if (response?.data?.status === "success") {
        setQueries(response?.data?.data?.content || []);
      } else {
        console.log("API FAILED");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // accept api

  const handleAccept = async (item) => {
    const res = await approveRequestApi(item?.requestId);

    if (res?.data?.status === "success") {
      getQueriesData(); // refresh list
    }
  };

  // Reject api

  const handleReject = async (item) => {
    const res = await rejectRequestApi(item?.requestId);

    if (res?.data?.status === "success") {
      getQueriesData(); // refresh list
    }
  };

  useEffect(() => {
    getQueriesData();
  }, [filters]);

  const total = queries.length;
  const pending = queries.filter((q) => q.status === "PENDING").length;
  const accepted = queries.filter((q) => q.status === "ACCEPTED").length;
  const rejected = queries.filter((q) => q.status === "REJECTED").length;
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
        <StatCard
          title="Total Queries"
          value={total}
          icon={<ClipboardList />}
        />
        <StatCard title="Pending" value={pending} icon={<Clock />} />
        <StatCard title="Accepted" value={accepted} icon={<CheckCircle />} />
        <StatCard title="Rejected" value={rejected} icon={<XCircle />} />
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
                    page: 0, // reset page
                  }))
                }
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) =>
                  setFilters((prev) => ({
                    ...prev,
                    hostelId: v === "all" ? "" : v,
                    page: 0,
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

            <p className="text-sm text-muted-foreground">
              Showing 1 - 10 of 1,284 results
            </p>
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
              <p className="text-center py-6 text-muted-foreground">
                No queries found
              </p>
            ) : (
              queries.map((item, i) => (
                <div
                  key={i}
                  className="grid grid-cols-6 items-center bg-muted/40 p-3 rounded-lg"
                >
                  {/* STUDENT */}
                  <div>
                    <p className="font-medium">{item?.studentName}</p>{" "}
                    <p className="text-xs text-muted-foreground">
                      Reg ID: {item?.studentId || "-"}
                    </p>
                  </div>

                  {/* ROOM */}
                  <p>{item?.roomType}</p>

                  {/* CONTACT */}
                  <div className="text-sm">
                    <p>{item?.phone}</p>
                    <p className="text-muted-foreground">{item?.email}</p>
                  </div>

                  {/* HOSTEL */}
                  <div>
                    <p>{item?.hostelName}</p>
                    <p className="text-xs text-muted-foreground">
                      Campus North
                    </p>
                  </div>

                  {/* STATUS */}
                  <Badge
                    variant={
                      item?.status === "REJECTED"
                        ? "destructive"
                        : item?.status === "ACCEPTED"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {item?.status}
                  </Badge>

                  {/* ACTIONS */}
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleAccept(item)}
                    >
                      Accept
                    </Button>

                    <Button
                      size="sm"
                      variant="destructive"
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
            <p className="text-sm text-muted-foreground">
              Showing 1 to 4 of 24 hostels
            </p>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={filters.page === 0}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page - 1,
                  }))
                }
              >
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
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
