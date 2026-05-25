import React, { useEffect, useState } from "react";

import { Card, CardContent } from "../../components/ui/Card";

import { CalendarDays } from "lucide-react";

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
            className={`rounded-full border px-6 py-2 text-sm font-medium transition-all ${
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
              className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="space-y-5 p-6">
                {/* PRIORITY */}

                <div>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      (notice?.category || "LOW").toUpperCase() === "HIGH"
                        ? "bg-red-100 text-red-600"
                        : (notice?.category || "LOW").toUpperCase() === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {(notice?.category || "LOW").toUpperCase()}
                  </span>
                </div>

                {/* CONTENT */}

                <div className="relative group space-y-3 min-h-[140px]">
                  {" "}
                  {/* TITLE */}
                  <h2 className="text-2xl font-bold text-foreground line-clamp-2 cursor-pointer">
                    {notice?.title || notice?.noticeTitle || "No Title"}
                  </h2>
                  {/* DESCRIPTION */}
                  <p className="text-sm leading-7 text-muted-foreground line-clamp-3 cursor-pointer">
                    {notice?.description || notice?.message || "No Description"}
                  </p>
                  {/* TOOLTIP */}
                  {/* BEAUTIFUL INLINE EXPAND CARD */}
                  {/* MINI POP TOOLTIP */}
                  <div className="absolute inset-x-4 top-6 z-30 hidden group-hover:block">
                    {" "}
                    <div className="rounded-2xl border border-border/60 bg-background/95 p-4 shadow-2xl backdrop-blur-xl transition-all duration-200">
                      {" "}
                      {/* ARROW */}
                      <div className="relative flex h-full flex-col space-y-3">
                        {/* TITLE */}
                        <h3 className="text-sm font-semibold text-foreground break-words leading-5">
                          {notice?.title || notice?.noticeTitle || "No Title"}
                        </h3>

                        {/* DESCRIPTION */}
                        <div className="max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
                          <p className="text-xs leading-5 text-muted-foreground break-words">
                            {notice?.description ||
                              notice?.message ||
                              "No Description"}
                          </p>
                        </div>
                        {/* FOOTER */}
                        <div className="flex items-center justify-between border-t border-border/50 pt-2">
                          <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">
                            {(notice?.priority || "LOW").toUpperCase()}
                          </span>

                          <span className="text-[10px] text-muted-foreground">
                            {notice?.createdAt || notice?.date || "No Date"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* DATE */}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />

                  <span>{notice?.createdAt || notice?.date || "No Date"}</span>
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
