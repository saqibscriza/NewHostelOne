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
          (item) => (item?.priority || "LOW").toUpperCase() === activeFilter,
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
              className="rounded-3xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <CardContent className="space-y-5 p-6">
                {/* PRIORITY */}

                <div>
                  <span
                    className={`rounded-md px-3 py-1 text-xs font-semibold ${
                      (notice?.priority || "LOW").toUpperCase() === "HIGH"
                        ? "bg-red-100 text-red-600"
                        : (notice?.priority || "LOW").toUpperCase() === "MEDIUM"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {(notice?.priority || "LOW").toUpperCase()}
                  </span>
                </div>

                {/* CONTENT */}

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-foreground">
                    {notice?.title || notice?.noticeTitle || "No Title"}
                  </h2>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {notice?.description || notice?.message || "No Description"}
                  </p>
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
