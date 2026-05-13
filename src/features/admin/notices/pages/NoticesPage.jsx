import { CalendarDays, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllNoticesApi, deleteNoticeApi } from "../../../../utils/utils";

const filters = ["All Notices", "High", "Medium", "Low"];

const badgeStyles = {
  High: "bg-rose-50 text-rose-500",
  Medium: "bg-amber-50 text-amber-500",
  Low: "bg-slate-100 text-slate-500",
};

export default function NoticesPage() {
  const [noticeData, setNoticeData] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);

  const handleDeleteNotice = async (noticeId) => {
    try {
      const response = await deleteNoticeApi(noticeId);

      console.log("DELETE RESPONSE 👉", response);

      if (response?.status === 200) {
        toast.success("Notice deleted successfully");

        // refresh notices
        NoticeGetAllApi();
      } else {
        toast.error("Failed to delete notice");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const NoticeGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getAllNoticesApi();

      console.log("notice response", response);

      if (response?.data?.status === "success") {
        setNoticeData(response?.data?.data || []);
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch notices");
    } finally {
      setLoaderCheck(false);
    }
  };

  useEffect(() => {
    NoticeGetAllApi();
  }, []);

  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All Notices");

  const filteredNotices = useMemo(() => {
    if (activeFilter === "All Notices") return noticeData;

    return noticeData.filter((notice) => notice.category === activeFilter);
  }, [activeFilter, noticeData]);

  return (
    <div className="space-y-6 bg-background min-h-screen p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Notice Details
          </h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and broadcast Notice to students
          </p>
        </div>

        <Button onClick={() => navigate("/admin/notices/create")}>
          + Add New Notice
        </Button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3">
          {filters.map((filter) => {
            const active = activeFilter === filter;

            return (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
                  active
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-border bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* <button
          type="button"
          className="flex items-center gap-2 self-start text-sm text-muted-foreground"
        >
          <span>Sort by:</span>
          <span className="font-semibold text-foreground">Newest First</span>
          <ChevronDown className="h-4 w-4" />
        </button> */}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredNotices?.map((notice) => (
          <Card
            key={notice.noticeId}
            className="overflow-hidden rounded-2xl border-border bg-card shadow-sm"
          >
            <CardContent className="p-0">
              <div className="space-y-4 p-5">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${badgeStyles[notice.category]}`}
                >
                  {notice.category}
                </span>

                <div>
                  <h2 className="text-2xl font-semibold leading-8 text-foreground">
                    {notice.title}
                  </h2>
                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">
                    {notice.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    {notice.date} • {notice.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-border px-5 py-4 text-muted-foreground">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/notices/edit/${notice.noticeId}`)
                  }
                  className="transition hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNotice(notice.noticeId)}
                  className="transition hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
