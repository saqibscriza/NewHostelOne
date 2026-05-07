import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  ClipboardList,
  Mail,
  MoreHorizontal,
  Phone,
  Search,
  X,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  getAllSuperAdminQueriesApi,
  getSuperAdminQueryByIdApi,
  updateSuperAdminQueryStatusApi,
} from "../../../../utils/utils";

const queryStatusOptions = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CLOSED", label: "Closed" },
];

const issueStatusOptions = [
  { value: "OPEN", label: "Open" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
];

const statusStyles = {
  OPEN: "bg-blue-50 text-blue-700 border-blue-100",
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  ACCEPTED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  REJECTED: "bg-red-50 text-red-700 border-red-100",
};

const statIconStyles = {
  total: "bg-blue-50 text-blue-600",
  pending: "bg-amber-50 text-amber-600",
  accepted: "bg-emerald-50 text-emerald-600",
  rejected: "bg-red-50 text-red-600",
};

const getFirst = (item, keys, fallback = "-") => {
  for (const key of keys) {
    const value = key.split(".").reduce((acc, part) => acc?.[part], item);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
};

const normalizeQuery = (item, type) => {
  const rawStatus = String(
    getFirst(item, ["status", "requestStatus", "issueStatus"], "OPEN"),
  ).toUpperCase();
  const rawQueryStatus = String(
    getFirst(item, ["queryStatus", "leadStatus", "status"], "NEW"),
  ).toUpperCase();

  return {
    original: item,
    id: getFirst(item, ["id", "queryId", "requestId", "leadId"]),
    type,
    studentName: getFirst(item, [
      "studentName",
      "name",
      "student.name",
      "userName",
    ]),
    studentId: getFirst(item, ["studentId", "registrationId", "regId"]),
    roomType: getFirst(item, ["roomType", "roomCategory", "roomName"]),
    propertyName: getFirst(item, [
      "propertyName",
      "hostelName",
      "hostel.hostelName",
      "name",
    ]),
    ownerName: getFirst(item, ["ownerName", "adminName", "createdBy"], "-"),
    phone: getFirst(item, [
      "contactNumber",
      "phone",
      "mobileNumber",
      "studentPhone",
    ]),
    email: getFirst(item, ["email", "studentEmail", "ownerEmail"]),
    address: getFirst(item, ["address", "hostelAddress", "propertyAddress"]),
    message: getFirst(item, ["message", "description", "remarks"], "-"),
    queryStatus: rawQueryStatus,
    issueStatus:
      rawStatus === "NEW" ||
      rawStatus === "CONTACTED" ||
      rawStatus === "FOLLOW_UP" ||
      rawStatus === "CLOSED"
        ? "OPEN"
        : rawStatus,
  };
};

const toTitle = (value) =>
  String(value || "-")
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const getResponseRecord = (response) => {
  const data = response?.data?.data || response?.data || {};
  return data?.query || data?.details || data?.item || data;
};

const getStoredPropertyQueryEdits = () => {
  if (typeof window === "undefined") return {};

  try {
    return JSON.parse(
      window.localStorage.getItem("superAdminPropertyQueryEdits") || "{}",
    );
  } catch {
    return {};
  }
};

const saveStoredPropertyQueryEdit = (id, values) => {
  if (typeof window === "undefined" || !id) return;

  const edits = getStoredPropertyQueryEdits();
  edits[id] = values;
  window.localStorage.setItem(
    "superAdminPropertyQueryEdits",
    JSON.stringify(edits),
  );
};

const mergeStoredPropertyEdit = (item) => {
  const edits = getStoredPropertyQueryEdits();
  return edits[item.id] ? { ...item, ...edits[item.id] } : item;
};

export default function QueryDetails() {
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [queryStatus, setQueryStatus] = useState("");
  const [issueStatus, setIssueStatus] = useState("");
  const [page, setPage] = useState(1);
  const [editingQuery, setEditingQuery] = useState(null);
  const [editForm, setEditForm] = useState({
    primaryName: "",
    secondaryName: "",
    contactNumber: "",
    email: "",
    address: "",
    message: "",
    roomType: "",
    queryStatus: "NEW",
    issueStatus: "OPEN",
  });

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const response = await getAllSuperAdminQueriesApi({
        type: activeTab,
        searchKey,
        status: queryStatus,
        page,
        size: 50,
      });

      const data = response?.data?.data || response?.data || {};
      const list =
        data?.content ||
        data?.queries ||
        data?.queryList ||
        data?.items ||
        (Array.isArray(data) ? data : []);

      const normalized = list.map((item) => normalizeQuery(item, activeTab));

      setQueries(
        activeTab === "HOSTEL"
          ? normalized.map(mergeStoredPropertyEdit)
          : normalized,
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to load queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, [activeTab, queryStatus, page]);

  const filteredQueries = useMemo(() => {
    const term = searchKey.trim().toLowerCase();

    return queries.filter((item) => {
      const matchesIssueStatus =
        !issueStatus || item.issueStatus === issueStatus;
      const matchesSearch =
        !term ||
        [
          item.studentName,
          item.propertyName,
          item.ownerName,
          item.email,
          item.phone,
          item.message,
        ]
          .join(" ")
          .toLowerCase()
          .includes(term);

      return matchesIssueStatus && matchesSearch;
    });
  }, [queries, issueStatus, searchKey]);

  const stats = useMemo(() => {
    const total = filteredQueries.length;
    const pending = filteredQueries.filter(
      (item) => item.issueStatus === "OPEN" || item.issueStatus === "PENDING",
    ).length;
    const accepted = filteredQueries.filter(
      (item) => item.issueStatus === "ACCEPTED",
    ).length;
    const rejected = filteredQueries.filter(
      (item) => item.issueStatus === "REJECTED",
    ).length;

    return { total, pending, accepted, rejected };
  }, [filteredQueries]);

  const openEditModal = async (item) => {
    if (activeTab !== "HOSTEL") return;

    let queryItem = item;

    try {
      const response = await getSuperAdminQueryByIdApi({
        type: "HOSTEL",
        id: item.id,
      });
      const record = getResponseRecord(response);

      if (record && !Array.isArray(record)) {
        queryItem = mergeStoredPropertyEdit(normalizeQuery(record, "HOSTEL"));
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load latest query details");
    }

    setEditingQuery(queryItem);
    setEditForm({
      primaryName: queryItem.propertyName,
      secondaryName: queryItem.ownerName,
      contactNumber: queryItem.phone,
      email: queryItem.email,
      address: queryItem.address,
      message: queryItem.message,
      roomType: queryItem.roomType,
      queryStatus:
        queryStatusOptions.find((option) => option.value === queryItem.queryStatus)
          ?.value || "NEW",
      issueStatus:
        issueStatusOptions.find((option) => option.value === queryItem.issueStatus)
          ?.value || "OPEN",
    });
  };

  const handleUpdate = async () => {
    if (!editingQuery?.id) {
      toast.error("Query id not found");
      return;
    }

    if (activeTab !== "HOSTEL") {
      toast.error("Only property queries can be updated");
      return;
    }

    const response = await updateSuperAdminQueryStatusApi(editingQuery.id, {
      type: "HOSTEL",
      status: editForm.queryStatus,
      issueStatus: editForm.issueStatus,
      propertyName: editForm.primaryName,
      ownerName: editForm.secondaryName,
      hostelName: editForm.primaryName,
      contactNumber: editForm.contactNumber,
      email: editForm.email,
      address: editForm.address,
      message: editForm.message,
      roomType: editForm.roomType,
    });

    if (response?.data?.status === "success" || response?.status === 200) {
      saveStoredPropertyQueryEdit(editingQuery.id, {
        propertyName: editForm.primaryName,
        ownerName: editForm.secondaryName,
        phone: editForm.contactNumber,
        email: editForm.email,
        address: editForm.address,
        message: editForm.message,
        roomType: editForm.roomType,
        queryStatus: editForm.queryStatus,
        issueStatus: editForm.issueStatus,
      });
      toast.success("Query updated successfully");
      setEditingQuery(null);
      await fetchQueries();
    } else {
      toast.error(response?.data?.message || "Failed to update query");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setQueryStatus("");
    setIssueStatus("");
    setSearchKey("");
    setPage(1);
  };

  return (
    <div className="space-y-6 bg-background text-foreground">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Room Queries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and manage accommodation requests from prospective students.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Queries"
          value={stats.total}
          icon={<ClipboardList className="h-5 w-5" />}
          tone="total"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={<MoreHorizontal className="h-5 w-5" />}
          tone="pending"
        />
        <StatCard
          title="Accepted"
          value={stats.accepted}
          icon={<CheckCircle className="h-5 w-5" />}
          tone="accepted"
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<XCircle className="h-5 w-5" />}
          tone="rejected"
        />
      </div>

      <div className="border-b border-border">
        <button
          type="button"
          onClick={() => handleTabChange("STUDENT")}
          className={`px-5 py-3 text-sm transition ${
            activeTab === "STUDENT"
              ? "border-b-2 border-foreground bg-card font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Student Query
        </button>
        <button
          type="button"
          onClick={() => handleTabChange("HOSTEL")}
          className={`px-5 py-3 text-sm transition ${
            activeTab === "HOSTEL"
              ? "border-b-2 border-foreground bg-card font-medium text-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Property Query
        </button>
      </div>

      <Card className="overflow-hidden rounded-xl border border-border">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={issueStatus}
                onChange={(event) => setIssueStatus(event.target.value)}
                className="h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>

              {activeTab === "HOSTEL" && (
                <select
                  value={queryStatus}
                  onChange={(event) => {
                    setQueryStatus(event.target.value);
                    setPage(1);
                  }}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm"
                >
                  <option value="">All Query Status</option>
                  {queryStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              <select className="h-10 rounded-md border border-border bg-background px-3 text-sm">
                <option>All Hostels</option>
              </select>
            </div>

            <div className="relative w-full lg:w-64">
              <Input
                value={searchKey}
                onChange={(event) => setSearchKey(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setPage(1);
                    fetchQueries();
                  }
                }}
                placeholder="Search"
                className="h-10 pr-10"
              />
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  fetchQueries();
                }}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {activeTab === "STUDENT" ? (
            <StudentTable queries={filteredQueries} loading={loading} />
          ) : (
            <PropertyTable
              queries={filteredQueries}
              loading={loading}
              onEdit={openEditModal}
            />
          )}

          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <span className="text-sm text-muted-foreground">
              Showing {filteredQueries.length ? 1 : 0} to{" "}
              {filteredQueries.length} of {filteredQueries.length} queries
            </span>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <Button type="button" size="sm" className="h-8 w-8 p-0">
                {page}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {editingQuery && (
        <EditQueryModal
          form={editForm}
          setForm={setEditForm}
          onClose={() => setEditingQuery(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, tone }) {
  return (
    <Card className="rounded-xl border border-border shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${statIconStyles[tone]}`}
        >
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function StudentTable({ queries, loading }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-6 py-4">Student</th>
            <th className="px-6 py-4">Room Type</th>
            <th className="px-6 py-4">Contact Info</th>
            <th className="px-6 py-4">Hostel Applied</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <TableRows
            queries={queries}
            loading={loading}
            emptyText="No student queries found"
            colSpan={5}
            renderRow={(item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-6 py-5">
                  <p className="font-semibold">{item.studentName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Reg ID: {item.studentId}
                  </p>
                </td>
                <td className="px-6 py-5">{item.roomType}</td>
                <td className="px-6 py-5">
                  <ContactBlock item={item} />
                </td>
                <td className="px-6 py-5">
                  <p className="font-medium">{item.propertyName}</p>
                  <p className="mt-1 max-w-48 text-xs text-muted-foreground">
                    {item.address}
                  </p>
                </td>
                <td className="px-6 py-5">
                  <StatusBadge value={item.issueStatus} />
                </td>
              </tr>
            )}
          />
        </tbody>
      </table>
    </div>
  );
}

function PropertyTable({ queries, loading, onEdit }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-4">Property Name</th>
            <th className="px-5 py-4">Contact Info</th>
            <th className="px-5 py-4">Address</th>
            <th className="px-5 py-4">Message</th>
            <th className="px-5 py-4">Query Status</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          <TableRows
            queries={queries}
            loading={loading}
            emptyText="No property queries found"
            colSpan={7}
            renderRow={(item) => (
              <tr key={item.id} className="hover:bg-muted/20">
                <td className="px-5 py-4">
                  <p className="font-semibold">{item.propertyName}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Owner - {item.ownerName}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <ContactBlock item={item} />
                </td>
                <td className="px-5 py-4 max-w-52 text-muted-foreground">
                  {item.address}
                </td>
                <td className="px-5 py-4 max-w-48 text-muted-foreground">
                  {item.message}
                </td>
                <td className="px-5 py-4 font-medium">
                  {toTitle(item.queryStatus)}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge value={item.issueStatus} />
                </td>
                <td className="px-5 py-4 text-right">
                  <EditButton onClick={() => onEdit(item)} />
                </td>
              </tr>
            )}
          />
        </tbody>
      </table>
    </div>
  );
}

function TableRows({ queries, loading, emptyText, colSpan, renderRow }) {
  if (loading) {
    return (
      <tr>
        <td
          colSpan={colSpan}
          className="px-6 py-10 text-center text-muted-foreground"
        >
          Loading queries...
        </td>
      </tr>
    );
  }

  if (!queries.length) {
    return (
      <tr>
        <td
          colSpan={colSpan}
          className="px-6 py-10 text-center text-muted-foreground"
        >
          {emptyText}
        </td>
      </tr>
    );
  }

  return queries.map(renderRow);
}

function ContactBlock({ item }) {
  return (
    <div className="space-y-1 text-sm">
      <p className="flex items-center gap-2">
        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
        {item.phone}
      </p>
      <p className="flex items-center gap-2 text-muted-foreground">
        <Mail className="h-3.5 w-3.5" />
        {item.email}
      </p>
    </div>
  );
}

function StatusBadge({ value }) {
  const normalized = String(value || "OPEN").toUpperCase();
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
        statusStyles[normalized] || statusStyles.OPEN
      }`}
    >
      {toTitle(normalized)}
    </span>
  );
}

function EditButton({ onClick }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-8 border-blue-600 px-5 text-blue-700 hover:bg-blue-50"
      onClick={onClick}
    >
      Edit
    </Button>
  );
}

function EditQueryModal({ form, setForm, onClose, onUpdate }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-xl bg-background p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">Edit Property Query</h2>
          <button type="button" onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <EditableField
            label="Property Name"
            value={form.primaryName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, primaryName: value }))
            }
          />
          <EditableField
            label="Owner Name"
            value={form.secondaryName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, secondaryName: value }))
            }
          />
          <EditableField
            label="Contact Number"
            value={form.contactNumber}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, contactNumber: value }))
            }
          />
          <EditableField
            label="Email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
          />
          <EditableField
            label="Address"
            value={form.address}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, address: value }))
            }
            multiline
          />
          <EditableField
            label="Message"
            value={form.message}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, message: value }))
            }
            multiline
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Query Status</label>
            <select
              value={form.queryStatus}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  queryStatus: event.target.value,
                }))
              }
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {queryStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={form.issueStatus}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  issueStatus: event.target.value,
                }))
              }
              className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm"
            >
              {issueStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            type="button"
            className="h-11 min-w-28 bg-black text-white hover:bg-black/90"
            onClick={onUpdate}
          >
            Update
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-11 min-w-28"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange, multiline = false }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {multiline ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-20 w-full rounded-md border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <Input
          value={value || ""}
          onChange={(event) => onChange(event.target.value)}
          className="h-11"
        />
      )}
    </div>
  );
}
