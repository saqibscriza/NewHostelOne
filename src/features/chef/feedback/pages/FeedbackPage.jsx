import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Smile,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { Badge } from "../../../../components/ui/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";
import {
  getFeedbackListApi,
  getFeedbackStatsApi,
} from "../../../../utils/utils";

const PAGE_SIZE = 10;
const DEFAULT_META = {
  totalItems: 0,
  totalPages: 1,
  pageSize: PAGE_SIZE,
  currentPage: 1,
};

const formatPercent = (value) => {
  const number = Number(value || 0);
  return Number.isInteger(number) ? number : number.toFixed(1);
};

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCategory = (value) => {
  if (!value) return "-";
  const text = String(value).toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

const isWithinDateFilter = (date, filter) => {
  if (filter === "all-time") return true;
  if (!date) return false;

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;

  const days = filter === "last-30-days" ? 30 : 7;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - days);

  return parsed >= start;
};

const getPaginationPages = (currentPage, totalPages) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, "...", totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "...", currentPage, "...", totalPages];
};

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [meta, setMeta] = useState(DEFAULT_META);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingList, setLoadingList] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("all-rating");
  const [categoryFilter, setCategoryFilter] = useState("all-category");
  const [dateFilter, setDateFilter] = useState("last-7-days");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedComments, setExpandedComments] = useState({});

  const fetchFeedbackStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const res = await getFeedbackStatsApi();

      if (res?.status === "success") {
        setStats(res?.stats || null);
      }
    } catch (error) {
      console.log("FEEDBACK STATS ERROR:", error);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  const fetchFeedbackList = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await getFeedbackListApi({
        page: currentPage,
        size: PAGE_SIZE,
        rating:
          ratingFilter === "all-rating"
            ? undefined
            : Number(ratingFilter.replace("-star", "")),
        category:
          categoryFilter === "all-category" ? undefined : categoryFilter,
        dateRange: dateFilter,
      });

      if (res?.status === "success") {
        const data = res?.data || {};
        setFeedbacks(data.feedbacks || []);
        setMeta({
          totalItems: data.totalItems || 0,
          totalPages: Math.max(1, data.totalPages || 1),
          pageSize: data.pageSize || PAGE_SIZE,
          currentPage: data.currentPage || currentPage,
        });
      }
    } catch (error) {
      console.log("FEEDBACK LIST ERROR:", error);
    } finally {
      setLoadingList(false);
    }
  }, [categoryFilter, currentPage, dateFilter, ratingFilter]);

  useEffect(() => {
    fetchFeedbackStats();
  }, [fetchFeedbackStats]);

  useEffect(() => {
    fetchFeedbackList();
  }, [fetchFeedbackList]);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      feedbacks.map((item) => item?.category).filter(Boolean),
    );

    return Array.from(uniqueCategories);
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const matchesRating =
        ratingFilter === "all-rating" ||
        Number(item?.rating) === Number(ratingFilter.replace("-star", ""));
      const matchesCategory =
        categoryFilter === "all-category" || item?.category === categoryFilter;
      const matchesDate = isWithinDateFilter(item?.date, dateFilter);

      return matchesRating && matchesCategory && matchesDate;
    });
  }, [categoryFilter, dateFilter, feedbacks, ratingFilter]);

  const hasActiveFilters =
    ratingFilter !== "all-rating" ||
    categoryFilter !== "all-category" ||
    dateFilter !== "last-7-days";
  const visibleTotalItems = hasActiveFilters
    ? filteredFeedbacks.length
    : meta.totalItems;
  const visibleTotalPages = Math.max(
    1,
    hasActiveFilters
      ? Math.ceil(filteredFeedbacks.length / meta.pageSize)
      : meta.totalPages,
  );
  const safeCurrentPage = Math.min(currentPage, visibleTotalPages);
  const pageStart =
    visibleTotalItems === 0 ? 0 : (safeCurrentPage - 1) * meta.pageSize + 1;
  const pageEnd =
    visibleTotalItems === 0
      ? 0
      : Math.min(pageStart + filteredFeedbacks.length - 1, visibleTotalItems);
  const paginationPages = getPaginationPages(
    safeCurrentPage,
    visibleTotalPages,
  );

  const handleFilterChange = (setter) => (value) => {
    setter(value);
    setCurrentPage(1);
    setExpandedComments({});
  };

  const clearFilters = () => {
    setRatingFilter("all-rating");
    setCategoryFilter("all-category");
    setDateFilter("last-7-days");
    setCurrentPage(1);
    setExpandedComments({});
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > visibleTotalPages || page === currentPage) return;
    setCurrentPage(page);
    setExpandedComments({});
  };

  const toggleComment = (id) => {
    setExpandedComments((current) => ({
      ...current,
      [id]: !current[id],
    }));
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Feedback Details
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Real-time sentiment and quality analysis from the dining hall.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Overall Rating
                </p>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">
                      {loadingStats
                        ? "-"
                        : Number(stats?.overallRating || 0).toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      / 5.0
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-green-600 dark:text-green-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>
                      {Number(stats?.ratingChange || 0) === 0
                        ? "No change from last week"
                        : `${Number(stats?.ratingChange || 0) > 0 ? "+" : ""}${stats?.ratingChange} from last week`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400">
                <Star className="h-5 w-5 fill-current" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Feedbacks
                </p>
                <div>
                  <div className="text-3xl font-bold text-foreground">
                    {loadingStats ? "-" : stats?.totalFeedbacks || 0}
                  </div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Last 30 days active response
                  </p>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-start justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Positive Sentiment
              </p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400">
                <Smile className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="mb-4 text-3xl font-bold text-foreground">
                {loadingStats
                  ? "-"
                  : `${formatPercent(stats?.positiveSentimentPercentage)}%`}
              </div>
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-[#0f1419] dark:bg-white"
                  style={{
                    width: `${Math.min(100, Number(stats?.positiveSentimentPercentage || 0))}%`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <p className="mb-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Rating Distribution
          </p>
          <div className="space-y-4">
            {(stats?.ratingDistribution || []).map((item) => (
              <div key={item.star} className="flex items-center gap-4">
                <span className="w-12 text-sm font-medium text-foreground">
                  {item.star} Star
                </span>
                <div className="h-2.5 flex-1 rounded-full bg-muted">
                  <div
                    className="h-2.5 rounded-full bg-slate-700 dark:bg-slate-300"
                    style={{
                      width: `${Math.min(100, Number(item.percentage || 0))}%`,
                    }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium text-muted-foreground">
                  {formatPercent(item.percentage)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="mr-2 shrink-0 text-sm font-semibold text-foreground">
            Filter by:
          </span>
          <Select
            value={ratingFilter}
            onValueChange={handleFilterChange(setRatingFilter)}
          >
            <SelectTrigger className="h-10 w-[150px] p-5 rounded-xl border-border bg-background">
              <SelectValue placeholder="All Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-rating">All Rating</SelectItem>
              <SelectItem value="5-star">5 Stars</SelectItem>
              <SelectItem value="4-star">4 Stars</SelectItem>
              <SelectItem value="3-star">3 Stars</SelectItem>
              <SelectItem value="2-star">2 Stars</SelectItem>
              <SelectItem value="1-star">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={categoryFilter}
            onValueChange={handleFilterChange(setCategoryFilter)}
          >
            <SelectTrigger className="h-10 w-[165px] rounded-xl border-border bg-background">
              <SelectValue placeholder="All Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-category">All Category</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {formatCategory(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={dateFilter}
            onValueChange={handleFilterChange(setDateFilter)}
          >
            <SelectTrigger className="h-10 w-[155px] rounded-xl border-border bg-background">
              <SelectValue placeholder="Last 7 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <button
          type="button"
          onClick={clearFilters}
          className="shrink-0 cursor-pointer text-sm font-bold text-foreground hover:underline"
        >
          Clear all filters
        </button>
      </div>

      <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <h2 className="text-xl font-bold text-foreground">
            Detailed Feedback
          </h2>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-border bg-muted/10">
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-14 pl-6 text-xs font-bold text-muted-foreground">
                  Student & Date
                </TableHead>
                <TableHead className="h-14 text-xs font-bold text-muted-foreground">
                  Meal Details
                </TableHead>
                <TableHead className="h-14 text-xs font-bold text-muted-foreground">
                  Rating
                </TableHead>
                <TableHead className="h-14 text-xs font-bold text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="h-14 pr-6 text-xs font-bold text-muted-foreground">
                  Comments
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingList ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Loading feedbacks...
                  </TableCell>
                </TableRow>
              ) : filteredFeedbacks.length > 0 ? (
                filteredFeedbacks.map((item) => {
                  const comment = item.comment?.trim() || "No comment";
                  const isExpanded = Boolean(expandedComments[item.id]);
                  const canExpand = comment.length > 80;

                  return (
                    <TableRow
                      key={item.id}
                      className="border-border transition-colors hover:bg-muted/30"
                    >
                      <TableCell className="py-5 pl-6">
                        <div className="text-[14px] font-bold text-foreground">
                          {item.studentName || "-"}
                        </div>
                        <div className="mt-1 text-xs text-muted-foreground">
                          {formatDate(item.date)}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="text-[14px] font-bold text-foreground">
                          {item.mealName || "-"}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < Number(item.rating || 0)
                                  ? "fill-foreground text-foreground"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <Badge
                          variant="secondary"
                          className="bg-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:bg-slate-700 dark:text-slate-200"
                        >
                          {formatCategory(item.category)}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[420px] py-5 pr-6">
                        <div className="flex min-w-[260px] items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <p
                              className={`text-sm leading-6 text-muted-foreground ${
                                isExpanded
                                  ? "whitespace-normal break-words"
                                  : "overflow-hidden text-ellipsis whitespace-nowrap"
                              }`}
                            >
                              {comment}
                            </p>
                            {canExpand && (
                              <button
                                type="button"
                                onClick={() => toggleComment(item.id)}
                                className="mt-1 cursor-pointer text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                              >
                                {isExpanded ? "Show Less" : "Read More"}
                              </button>
                            )}
                          </div>

                          <div className="group/tooltip relative mt-0.5 shrink-0">
                            <AlertCircle className="h-5 w-5 cursor-pointer text-muted-foreground transition hover:text-foreground" />
                            <div className="absolute bottom-full right-0 z-50 mb-3 hidden max-h-64 w-[320px] overflow-y-auto rounded-2xl bg-black p-4 text-sm leading-6 text-white shadow-2xl group-hover/tooltip:block">
                              <p className="whitespace-pre-wrap break-words">
                                {comment}
                              </p>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No feedbacks found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t border-border bg-transparent px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Showing {pageStart} to {pageEnd} of {visibleTotalItems} feedbacks
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={safeCurrentPage === 1}
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {paginationPages.map((page, index) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sm font-bold ${
                    safeCurrentPage === page
                      ? "bg-[#0f1419] text-white shadow-sm dark:bg-white dark:text-black"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              disabled={safeCurrentPage === visibleTotalPages}
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
