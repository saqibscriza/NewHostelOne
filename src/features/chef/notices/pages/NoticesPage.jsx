import { AlertCircle, CalendarDays, ChevronDown } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
// import { Button } from "../../../../components/ui/button";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getAllNoticesApi } from "../../../../utils/utils";

const filters = ["All Notices", "HIGH", "MEDIUM", "LOW"];

const badgeStyles = {
  HIGH: "bg-rose-50 text-rose-500",
  MEDIUM: "bg-amber-50 text-amber-500",
  LOW: "bg-slate-100 text-slate-500",
};

const getNoticePriority = (notice) =>
  (notice?.priority || notice?.category || "LOW").toUpperCase();

const getNoticeDateValue = (notice) =>
  notice?.createdAt || notice?.updatedAt || notice?.date || notice?.noticeDate;

const getNoticeTimestamp = (notice) => {
  const value = getNoticeDateValue(notice);
  const parsed = value ? new Date(value).getTime() : 0;
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatNoticeDateTime = (notice) => {
  const dateValue = getNoticeDateValue(notice);
  const explicitTime = notice?.time || notice?.noticeTime;

  if (!dateValue && !explicitTime) return "No Date";

  const parsed = dateValue ? new Date(dateValue) : null;

  if (!parsed || Number.isNaN(parsed.getTime())) {
    return [dateValue, explicitTime].filter(Boolean).join(" • ");
  }

  const formattedDate = parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const formattedTime =
    explicitTime ||
    parsed.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return `${formattedDate} • ${formattedTime}`;
};

export default function NoticesPage() {
  const [noticeData, setNoticeData] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);

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

  const [activeFilter, setActiveFilter] = useState("All Notices");
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredNotices = useMemo(() => {
    const priorityFiltered =
      activeFilter === "All Notices"
        ? noticeData
        : noticeData.filter(
            (notice) => getNoticePriority(notice) === activeFilter,
          );

    return [...priorityFiltered].sort((a, b) => {
      const first = getNoticeTimestamp(a);
      const second = getNoticeTimestamp(b);
      return sortOrder === "newest" ? second - first : first - second;
    });
  }, [activeFilter, noticeData, sortOrder]);

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

        {/* <Button onClick={() => navigate("/admin/notices/create")}>
          + Add New Notice
        </Button> */}
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
                {filter === "All Notices"
                  ? filter
                  : filter.charAt(0) + filter.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() =>
            setSortOrder((current) =>
              current === "newest" ? "oldest" : "newest",
            )
          }
          className="flex cursor-pointer items-center gap-2 self-start text-sm text-muted-foreground"
        >
          <span>Sort by:</span>
          <span className="font-semibold text-foreground">
            {sortOrder === "newest" ? "Newest First" : "Oldest First"}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loaderCheck ? (
          <div className="col-span-full flex justify-center py-16 text-muted-foreground">
            Loading notices...
          </div>
        ) : filteredNotices?.length > 0 ? (
          filteredNotices.map((notice) => {
            const priority = getNoticePriority(notice);
            const description =
              notice?.description || notice?.message || "No Description";

            return (
              <Card
                key={notice.noticeId || notice.id}
                className="overflow-visible rounded-2xl border-border bg-card shadow-sm"
              >
                <CardContent className="p-0">
                  <div className="space-y-4 p-5">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${badgeStyles[priority] || badgeStyles.LOW}`}
                    >
                      {priority}
                    </span>

                    <div>
                      <h2 className="text-2xl font-semibold leading-8 text-foreground">
                        {notice.title || notice.noticeTitle || "No Title"}
                      </h2>
                      <div className="mt-2 flex items-start gap-2">
                        <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>

                        <div className="group/tooltip relative shrink-0">
                          <AlertCircle className="h-5 w-5 cursor-pointer text-muted-foreground transition hover:text-foreground" />
                          <div className="absolute bottom-full right-0 z-50 mb-3 hidden max-h-64 w-[320px] overflow-y-auto rounded-2xl bg-black p-4 text-sm leading-6 text-white shadow-2xl group-hover/tooltip:block">
                            <p className="whitespace-pre-wrap break-words">
                              {description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatNoticeDateTime(notice)}</span>
                    </div>
                  </div>

                  {/* <div className="flex items-center gap-4 border-t border-border px-5 py-4 text-muted-foreground">
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
              </div> */}
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
            No notices found.
          </div>
        )}
      </div>
    </div>
  );
}
