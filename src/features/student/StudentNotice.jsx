import React, { useEffect, useState } from "react";

import { Card, CardContent } from "../../components/ui/Card";

import { CalendarDays, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

import { getAllNoticesApi } from "../../utils/utils";

export default function StudentNotice() {
  const [loaderCheck, setLoaderCheck] = useState(false);

  const [noticeData, setNoticeData] = useState([]);

  const [activeFilter, setActiveFilter] = useState("ALL");

  // ================= API =================

  const NoticeGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getAllNoticesApi();

      console.log("notice response", response);

      if (response?.data?.status === "success") {
        setNoticeData(response?.data?.data || []);

        setLoaderCheck(false);
      } else {
        toast.error(response?.data?.message);

        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);

      setLoaderCheck(false);
    }
  };

  // ================= USE EFFECT =================

  useEffect(() => {
    NoticeGetAllApi();
  }, []);

  // ================= FILTER =================

  const filteredNotices =
    activeFilter === "ALL"
      ? noticeData
      : noticeData.filter(
          (item) => (item?.category || "LOW").toUpperCase() === activeFilter,
        );
  return (
    <div className="min-h-screen bg-background p-6">
      {/* HEADER */}

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Notice Details</h1>

        <p className="mt-2 text-muted-foreground">
          Don't miss out on important updates—find all your notices in one
          place.
        </p>
      </div>

      {/* FILTERS */}

      <div className="mb-8 flex flex-wrap gap-3">
        {["ALL", "HIGH", "MEDIUM", "LOW"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveFilter(item)}
            className={`rounded-full border px-6 py-2 text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 ${
              activeFilter === item
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:bg-muted"
            }`}
          >
            {item === "ALL"
              ? "All Notices"
              : item.charAt(0) + item.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* NOTICE GRID */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {loaderCheck ? (
          <div className="col-span-3 flex justify-center py-20 text-muted-foreground">
            Loading notices...
          </div>
        ) : filteredNotices?.length > 0 ? (
          filteredNotices.map((notice, index) => (
            <Card
              key={index}
              className="
relative rounded-3xl border border-border/50
bg-gradient-to-br from-background to-muted/30
shadow-sm
backdrop-blur
transition-all duration-300
hover:-translate-y-2
hover:shadow-2xl
hover:border-primary/30
group
cursor-pointer
"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* TOP */}
                <div className="flex items-start justify-between">
                  <span
                    className={`
px-3 py-1 rounded-full text-[11px]
font-semibold uppercase tracking-wider border
${
  (notice?.category || "LOW").toUpperCase() === "HIGH"
    ? "bg-red-500/10 text-red-500 border-red-500/20"
    : (notice?.category || "LOW").toUpperCase() === "MEDIUM"
      ? "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      : "bg-primary/10 text-primary border-primary/20"
}
`}
                  >
                    {(notice?.category || "LOW").toUpperCase()}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="mt-6 flex-1">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground line-clamp-2">
                    {notice?.title || notice?.noticeTitle || "No Title"}
                  </h2>

                  <div className="mt-3 flex items-start justify-between gap-2 w-full">
                    {/* DESCRIPTION */}
                    <div className="mt-3 flex items-start gap-2 w-full">
                      {/* DESCRIPTION */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="
      text-sm leading-7 text-muted-foreground

      overflow-hidden
      text-ellipsis
      whitespace-nowrap
      "
                        >
                          {notice?.description ||
                            notice?.message ||
                            "No Description"}
                        </p>
                      </div>

                      {/* TOOLTIP ICON */}
                      <div className="relative group/tooltip shrink-0 mt-1">
                        <AlertCircle className="w-5 h-5 text-slate-700 cursor-pointer" />

                        {/* TOOLTIP */}
                        <div
                          className="
                                        absolute bottom-full right-0 mb-4
                                        hidden group-hover/tooltip:block

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
                            {notice?.description ||
                              notice?.message ||
                              "No Description"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* TOOLTIP ICON */}
                  </div>
                  {/* DATE */}
                  <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
                    <CalendarDays className="w-4 h-4" />

                    <span>
                      {formatNoticeDate(notice?.createdAt || notice?.date)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-3 flex justify-center py-20 text-muted-foreground">
            No notices found
          </div>
        )}
      </div>
    </div>
  );
}

const formatNoticeDate = (date) => {
  if (!date) return "No Date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return String(date).slice(0, 12);
  }

  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
