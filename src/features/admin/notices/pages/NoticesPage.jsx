import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllNoticesApi, deleteNoticeApi } from "../../../../utils/utils";

const filters = ["All Notices", "HIGH", "MEDIUM", "LOW"];

const badgeStyles = {
  HIGH: "bg-rose-50 text-rose-500",
  MEDIUM: "bg-amber-50 text-amber-500",
  LOW: "bg-slate-100 text-slate-500",
};
const formatNoticeDateTime = (dateString) => {
  if (!dateString) {
    return {
      date: "No Date",
      time: "",
    };
  }

  const date = new Date(dateString);

  return {
    date: date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),

    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
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

    return noticeData.filter(
      (notice) => notice?.category?.toUpperCase() === activeFilter,
    );
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

        <Button
          className="cursor-pointer"
          onClick={() => navigate("/admin/notices/create")}
        >
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
                className={`cursor-pointer rounded-full border px-5 py-2 text-sm font-medium transition ${
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
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredNotices?.map((notice) => (
          <Card
            key={notice.noticeId}
            className="overflow-visible rounded-2xl border-border bg-card shadow-sm"
          >
            <CardContent className="p-0">
              <div className="space-y-4 p-5">
                <span
                  className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${badgeStyles[notice?.category?.toUpperCase()]}`}
                >
                  {notice?.category?.toUpperCase()}
                </span>

                <div>
                  <h2 className="text-2xl font-semibold leading-8 text-foreground">
                    {notice.title}
                  </h2>
                  <div className="mt-3 relative">
                    {/* DESCRIPTION */}
                    <p
                      className="
    text-sm leading-6 text-muted-foreground

    overflow-hidden
    pr-8

    [display:-webkit-box]
    [-webkit-line-clamp:3]
    [-webkit-box-orient:vertical]

    break-all
    "
                    >
                      {notice?.description || "No Description"}
                    </p>

                    {/* TOOLTIP ICON */}
                    <div className="absolute bottom-0 right-0 group/tooltip bg-card pl-1">
                      <AlertCircle className="w-5 h-5 text-slate-700 cursor-pointer" />

                      {/* TOOLTIP */}
                      <div
                        className="
absolute bottom-full right-0 mb-4

opacity-0 invisible
group-hover/tooltip:visible
group-hover/tooltip:opacity-100

transition-all duration-200

w-[340px]
max-h-[260px]
overflow-y-auto

rounded-2xl
bg-black text-white

p-5

text-sm leading-7
break-all

shadow-2xl
z-[9999]
"
                      >
                        <p className="whitespace-pre-wrap">
                          {notice?.description || "No Description"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {(() => {
                  const formatted = formatNoticeDateTime(notice?.createdAt);

                  return (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />

                      <span>
                        {formatted.date} • {formatted.time}
                      </span>
                    </div>
                  );
                })()}
              </div>

              <div className="flex items-center gap-4 border-t border-border px-5 py-4 text-muted-foreground">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/admin/notices/edit/${notice.noticeId}`)
                  }
                  className="cursor-pointer transition hover:text-foreground"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteNotice(notice.noticeId)}
                  className="cursor-pointer transition hover:text-red-500"
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
