import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Star, X } from "lucide-react";
import { toast } from "react-hot-toast";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../components/ui/Table";
import {
  addMessFeedbackApi,
  getMessMenuByDateApi,
  getFullWeekMessMenuApi,
  getAllMessFeedbackApi,
} from "../../../../utils/utils";

const mealTypes = [
  { key: "breakfast", label: "BREAKFAST", timeKey: "breakfastTime" },
  { key: "lunch", label: "LUNCH", timeKey: "lunchTime" },
  { key: "dinner", label: "DINNER", timeKey: "dinnerTime" },
];

export default function Mess() {
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState(
    location.state?.defaultTab || "today",
  );
  const [menus, setMenus] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("7");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const selectedDate = useMemo(() => {
    const date = new Date();
    if (activeTab === "tomorrow") date.setDate(date.getDate() + 1);
    return date;
  }, [activeTab]);

const menuTitle =
  activeTab === "week"
    ? "Full Week Menu"
    : activeTab === "tomorrow"
    ? "Tomorrow's Menu"
    : "Today's Menu";

  const getAllFeedbackApiData = async () => {
    try {
      const response = await getAllMessFeedbackApi();

      if (response?.data?.status === "success" || response?.status === 200) {
        setFeedbacks(normalizeFeedbacks(response.data));
      } else {
        setFeedbacks([]);
      }
    } catch (error) {
      console.log(error);
      setFeedbacks([]);
    }
  };
  const getMenuByOffset = async (offset) => {
    setLoadingMenu(true);
    try {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const response = await getMessMenuByDateApi(toDateInputValue(date));

      if (response?.data?.status === "success") {
        setMenus([
          normalizeMenu(
            response.data.menu ||
              response.data.data ||
              response.data.planner ||
              response.data.messMenu,
            date,
          ),
        ]);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.log(error);
      setMenus([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  const getFullWeekMenuApi = async () => {
    setLoadingMenu(true);

    try {
      const response = await getFullWeekMessMenuApi();

      if (response?.data?.status === "success") {
        const list =
          response?.data?.weeklyMenu ||
          response?.data?.menus ||
          response?.data?.data ||
          response?.data?.menu ||
          [];

        const normalizedList = Array.isArray(list)
          ? list.map((item) => normalizeMenu(item)).filter(Boolean)
          : [];

        setMenus(normalizedList);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.log(error);
      setMenus([]);
    } finally {
      setLoadingMenu(false);
    }
  };

  useEffect(() => {
    if (activeTab === "week") {
      getFullWeekMenuApi();
    } else if (activeTab === "tomorrow") {
      getMenuByOffset(1);
    } else {
      getMenuByOffset(0);
    }

    getAllFeedbackApiData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      if (document.hidden) return;

      if (activeTab === "week") {
        getFullWeekMenuApi();
      } else {
        getMenuByOffset(activeTab === "tomorrow" ? 1 : 0);
      }

      getAllFeedbackApiData();
    };

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, [activeTab]);

  const isMealRated = (meal) => {
    return feedbacks.some(
      (item) =>
        item.mealName === meal.mealName &&
        item.mealType === meal.mealType &&
        item.mealDate === meal.mealDate &&
        item.isRated,
    );
  };

  const filteredFeedbacks = useMemo(() => {
    const days = dayFilter === "none" ? 7 : Number(dayFilter);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    return feedbacks.filter((item) => {
      const date = item.mealDate ? new Date(item.mealDate) : null;
      const matchesDate = !date || date >= start;
      const matchesStatus =
        statusFilter === "all" ||
        statusFilter === "none" ||
        (statusFilter === "rated" && item.isRated) ||
        (statusFilter === "unrated" && !item.isRated);

      return matchesDate && matchesStatus;
    });
  }, [feedbacks, statusFilter, dayFilter]);

  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
    setRating(0);
    setHoverRating(0);
    setComment("");
    setCommentError("");
    setOpenModal(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedMeal) return;
    if (rating === 0) {
      toast.error("Please select rating");
      return;
    }
    if (comment.trim().length > 0 && comment.trim().length < 3) {
      setCommentError("Comment must be at least 3 characters when provided");
      return;
    }

    const payload = {
      mealName: selectedMeal.mealName,
      mealType: selectedMeal.mealType,
      mealDate: selectedMeal.mealDate,
      rating,
      comment,
    };

    try {
      const response = await addMessFeedbackApi(payload);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Meal rated successfully");

        await getAllFeedbackApiData();
        setOpenModal(false);
      } else {
        toast.error(response?.data?.message || "Failed to submit rating");
      }
    } catch (error) {
      console.log("FULL ERROR 👉", error);
      console.log("ERROR RESPONSE 👉", error?.response);
      console.log("ERROR DATA 👉", error?.response?.data);

      return error?.response || null;
    }
  };

  const visibleMealRows =
    activeTab === "week" ? menus.flatMap(menuToRows) : menuToRows(menus[0]);

  return (
    <>
      {openModal && selectedMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-card border border-border shadow-2xl p-8 relative">
            <button
              type="button"
              onClick={() => setOpenModal(false)}
              className="absolute top-7 right-7 text-foreground hover:text-primary cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-3xl font-bold text-foreground mb-7">
              Rate Meal
            </h2>

            <div className="space-y-5">
              <ReadOnlyField
                label="Meal Details"
                value={selectedMeal.mealName}
              />
              <ReadOnlyField
                label="Date"
                value={formatDisplayDate(selectedMeal.mealDate)}
              />
              <ReadOnlyField
                label="Category"
                value={titleCase(selectedMeal.mealType)}
              />

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    setCommentError("");
                  }}
                  placeholder="Enter comment"
                  maxLength={255}
                  aria-invalid={Boolean(commentError)}
                  className="w-full h-24 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none resize-none focus:ring-2 focus:ring-ring"
                />
                {commentError && (
                  <p className="mt-1 text-xs text-destructive">
                    {commentError}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Rating <span className="text-destructive">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`w-9 h-9 cursor-pointer transition-all ${
                        star <= (hoverRating || rating)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={handleSubmitRating}
                  className="px-8 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 cursor-pointer"
                >
                  Rate Meal
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-8 h-11 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-accent cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6 bg-background text-foreground">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mess Details</h1>
          <p className="text-muted-foreground mt-1">
            View today's menu, upcoming meals, and mess schedule quickly
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border border-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {menuTitle}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {activeTab === "week"
                  ? "Next 7 days"
                  : formatHeaderDate(selectedDate)}
              </p>
            </div>

            <div className="flex bg-muted p-1 rounded-lg">
              <TabButton
                // className="cursor-pointer"
                active={activeTab === "today"}
                label="TODAY"
                onClick={() => {
                  setActiveTab("today");
                  getMenuByOffset(0);
                }}
              />
              <TabButton
                active={activeTab === "tomorrow"}
                label="TOMORROW"
                onClick={() => {
                  setActiveTab("tomorrow");
                  getMenuByOffset(1);
                }}
              />
              <TabButton
                active={activeTab === "week"}
                label="FULL WEEK"
                onClick={() => {
                  setActiveTab("week");
                  getFullWeekMenuApi();
                }}
              />
            </div>
          </div>

          <div
            className={
              activeTab === "week"
                ? "max-h-[520px] space-y-4 overflow-y-auto pr-2"
                : "space-y-4"
            }
          >
            {loadingMenu ? (
              <div className="bg-muted rounded-xl p-10 text-center text-muted-foreground">
                Loading menu...
              </div>
            ) : visibleMealRows.length > 0 ? (
              visibleMealRows.map((item, index) => (
                <div
                  key={`${item.mealDate}-${item.mealType}-${index}`}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-8"
                >
                  <div className="w-28 shrink-0">
                    <h3 className="font-bold text-foreground text-sm tracking-wider">
                      {item.mealType}
                    </h3>
                    <p className="text-muted-foreground text-xs mt-1">
                      {item.mealTime}
                    </p>
                    {activeTab === "week" && (
                      <p className="text-muted-foreground text-xs mt-1">
                        {formatDisplayDate(item.mealDate)}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-xl flex-1 flex items-center justify-between gap-4">
                    <p className="text-foreground text-[15px]">
                      {item.mealName}
                    </p>
                    {isMealRated(item) ? (
                      <div className="px-5 py-2 bg-green-100 text-green-700 text-xs font-bold rounded-lg shrink-0 uppercase tracking-wide">
                        Rated
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleOpenModal(item)}
                        className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg shadow-sm shrink-0 uppercase tracking-wide cursor-pointer"
                      >
                        Rate Meal
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-muted rounded-xl p-10 text-center">
                <p className="text-muted-foreground">No menu available</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 md:p-6 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-center gap-3 overflow-x-auto">
              <p className="text-sm font-semibold text-muted-foreground mr-1">
                Filter by:
              </p>

              {/* STATUS FILTER */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 min-w-[170px] rounded-xl px-4 pr-4">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="rated">Rated</SelectItem>
                  <SelectItem value="unrated">Unrated</SelectItem>
                </SelectContent>
              </Select>

              {/* DATE FILTER */}
              <Select value={dayFilter} onValueChange={setDayFilter}>
                <SelectTrigger className="h-12 min-w-[170px] rounded-xl px-4 pr-4">
                  <SelectValue placeholder="Full Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="1">Today</SelectItem>
                  <SelectItem value="2">Tomorrow</SelectItem>
                  <SelectItem value="7">Full Week</SelectItem>
                  <SelectItem value="5">Last 5 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CLEAR FILTER */}
            <button
              type="button"
              onClick={() => {
                setStatusFilter("all");
                setDayFilter("7");
              }}
              className="h-12 px-5 rounded-xl border border-border bg-background text-sm font-medium text-foreground cursor-pointer hover:border-primary hover:text-primary transition-all"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">
              Detailed Feedback
            </h2>
          </div>

          {filteredFeedbacks.length > 0 ? (
            <div className="overflow-x-auto">
              <Table className="min-w-[900px]">
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    <TableHead className="px-6 py-4">Student & Date</TableHead>
                    <TableHead className="px-6 py-4">Meal Details</TableHead>
                    <TableHead className="px-6 py-4">Category</TableHead>
                    <TableHead className="px-6 py-4">Rating</TableHead>
                    <TableHead className="px-6 py-4">Comments</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((item) => (
                    <TableRow key={item.id} className="border-t border-border">
                      <TableCell className="px-6 py-6 text-foreground text-sm">
                        {formatDisplayDate(item.mealDate)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.timeAgo || ""}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <p className="text-sm text-foreground font-medium">
                          {item.mealName || "No Meal"}
                        </p>
                      </TableCell>
                      <TableCell className="px-6 py-6 text-sm text-foreground">
                        {titleCase(item.mealType || "No Category")}
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= Number(item.rating)
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/50"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="mt-2 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">
                          {item.isRated ? "Positive" : "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-6">
                        <p className="text-sm text-muted-foreground">
                          {item.comment || "No Comment"}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <DefaultTable
              height="260px"
              title="No Feedback Found"
              description="Feedback records will appear here after students rate meals."
            />
          )}
        </div>
      </div>
    </>
  );
}

const normalizeMenu = (menu, fallbackDate = new Date()) => {
  if (!menu) return null;
  const date =
    menu.menuDate ||
    menu.date ||
    menu.menu_date ||
    menu.plannerDate ||
    toDateInputValue(fallbackDate);
  return {
    ...menu,
    menuDate: date,
    dayName:
      menu.dayName ||
      new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
  };
};

const menuToRows = (menu) => {
  if (!menu) return [];
  return mealTypes
    .map((meal) => ({
      mealType: meal.label,
      mealName: menu[meal.key],
      mealTime: menu[meal.timeKey] || "",
      mealDate: menu.menuDate || toDateInputValue(new Date()),
    }))
    .filter((meal) => meal.mealName);
};

const normalizeFeedbacks = (data) => {
  const list = data.feedbacks || data.data || [];
  return Array.isArray(list)
    ? list.map((item) => ({
        id: item.id || `${item.mealDate}-${item.mealType}-${item.mealName}`,
        mealName: item.mealName || item.meal || "No Meal",
        mealType: item.mealType || item.category || "",
        mealDate: item.mealDate || item.date || "",
        mealTime: item.mealTime || "",
        rating: item.rating || 0,
        comment: item.comment || "",
        timeAgo: item.timeAgo || "",
        isRated: Boolean(item.isRated ?? item.rating),
      }))
    : [];
};

const ReadOnlyField = ({ label, value }) => (
  <div>
    <label className="block text-sm font-semibold text-foreground mb-2">
      {label}
    </label>
    <input
      type="text"
      value={value || ""}
      disabled
      className="w-full h-12 rounded-lg border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
    />
  </div>
);

const TabButton = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-3 text-sm rounded-xl transition-all cursor-pointer ${
      active
        ? "bg-card shadow-sm text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

const formatHeaderDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

const formatDisplayDate = (date) => {
  if (!date) return "No Date";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const titleCase = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
