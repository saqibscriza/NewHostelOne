import React, { useEffect, useMemo, useState } from "react";
import { Star, ShieldCheck, Truck, Headphones, X } from "lucide-react";
import { toast } from "react-hot-toast";
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

const dayFilterOptions = [1, 2, 3, 4, 5, 6, 7];
const localFeedbackKey = "studentMessLocalFeedbacks";

export default function Mess() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [activeTab, setActiveTab] = useState("today");
  const [menus, setMenus] = useState([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("7");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(false);

  const selectedDate = useMemo(() => {
    const date = new Date();
    if (activeTab === "tomorrow") date.setDate(date.getDate() + 1);
    return date;
  }, [activeTab]);

  const menuTitle = activeTab === "week" ? "Full Week Menu" : "Today's Menu";

  const getAllFeedbackApiData = async () => {
    try {
      const response = await getAllMessFeedbackApi();
      const localFeedbacks = getLocalFeedbacks();
      if (response?.data?.status === "success" || response?.status === 200) {
        setFeedbacks(mergeFeedbacks(localFeedbacks, normalizeFeedbacks(response.data)));
      } else {
        setFeedbacks(localFeedbacks);
      }
    } catch (error) {
      console.log(error);
      setFeedbacks(getLocalFeedbacks());
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
          response?.data?.menus ||
          response?.data?.data ||
          response?.data?.menu ||
          [];
        const normalizedList = Array.isArray(list)
          ? list
              .map((item, index) => {
                const date = new Date();
                date.setDate(date.getDate() + index);
                return normalizeMenu(item, date);
              })
              .filter(Boolean)
          : [];

        if (normalizedList.length > 0) {
          setMenus(normalizedList);
        } else {
          setMenus(await fetchNextSevenDaysByDate());
        }
      } else {
        setMenus(await fetchNextSevenDaysByDate());
      }
    } catch (error) {
      console.log(error);
      setMenus(await fetchNextSevenDaysByDate());
    } finally {
      setLoadingMenu(false);
    }
  };

  const fetchNextSevenDaysByDate = async () => {
    const requests = Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() + index);

      return getMessMenuByDateApi(toDateInputValue(date)).then((response) => {
        if (response?.data?.status !== "success") return null;

        return normalizeMenu(
          response.data.menu ||
            response.data.data ||
            response.data.planner ||
            response.data.messMenu,
          date,
        );
      });
    });

    const results = await Promise.all(requests);
    return results.filter(Boolean);
  };

  useEffect(() => {
    getMenuByOffset(0);
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

  const filteredFeedbacks = useMemo(() => {
    const days = Number(dayFilter);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (days - 1));

    return feedbacks.filter((item) => {
      const date = item.mealDate ? new Date(item.mealDate) : null;
      const matchesDate = !date || date >= start;
      const matchesStatus =
        statusFilter === "all" ||
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
    setOpenModal(true);
  };

  const handleSubmitRating = async () => {
    if (!selectedMeal) return;
    if (rating === 0) {
      toast.error("Please select rating");
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
        const localFeedback = buildFeedbackFromRating(payload);
        saveLocalFeedback(localFeedback);
        setFeedbacks((prev) => [localFeedback, ...prev]);
        await getAllFeedbackApiData();
        setOpenModal(false);
      } else if (response?.status === 404) {
        const localFeedback = buildFeedbackFromRating(payload);
        saveLocalFeedback(localFeedback);
        setFeedbacks((prev) => [localFeedback, ...prev]);
        toast.success("Meal rated successfully");
        setOpenModal(false);
      } else {
        toast.error(response?.data?.message || "Failed to submit rating");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
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
              className="absolute top-7 right-7 text-foreground hover:text-primary"
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
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter comment"
                  className="w-full h-24 rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none resize-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Rating
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
                  className="px-8 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90"
                >
                  Rate Meal
                </button>

                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-8 h-11 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-accent"
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
                    <button
                      type="button"
                      onClick={() => handleOpenModal(item)}
                      className="px-5 py-2 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold rounded-lg shadow-sm shrink-0 uppercase tracking-wide"
                    >
                      Rate Meal
                    </button>
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

        <div className="bg-card border border-border rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <p className="text-base font-semibold text-muted-foreground">
              Filter by:
            </p>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-12 rounded-xl border border-border bg-background px-5 text-sm text-foreground outline-none"
            >
              <option value="all">All Status</option>
              <option value="rated">Rated</option>
              <option value="unrated">Unrated</option>
            </select>
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="h-12 rounded-xl border border-border bg-background px-5 text-sm text-foreground outline-none"
            >
              {dayFilterOptions.map((day) => (
                <option key={day} value={day}>
                  Last {day} {day === 1 ? "Day" : "Days"}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setDayFilter("7");
            }}
            className="text-sm font-medium text-foreground hover:text-primary"
          >
            Clear all filters
          </button>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">
              Detailed Feedback
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-muted/60">
                <tr>
                  <TableHead>Student & Date</TableHead>
                  <TableHead>Meal Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comments</TableHead>
                </tr>
              </thead>
              <tbody>
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((item) => (
                    <tr key={item.id} className="border-t border-border">
                      <td className="px-6 py-6 text-foreground text-sm">
                        {formatDisplayDate(item.mealDate)}
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.timeAgo || ""}
                        </p>
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm text-foreground font-medium">
                          {item.mealName || "No Meal"}
                        </p>
                      </td>
                      <td className="px-6 py-6 text-sm text-foreground">
                        {titleCase(item.mealType || "No Category")}
                      </td>
                      <td className="px-6 py-6">
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
                      </td>
                      <td className="px-6 py-6">
                        <p className="text-sm text-muted-foreground">
                          {item.comment || "No Comment"}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-10 text-muted-foreground"
                    >
                      No feedback found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={ShieldCheck}
            title="Quality Certified"
            text="ISO 22000 Food Safety Standards"
          />
          <InfoCard
            icon={Truck}
            title="Supply Update"
            text="Fresh organic produce arriving daily at 05:00"
          />
          <InfoCard
            icon={Headphones}
            title="Support Desk"
            text="Immediate assistance"
          />
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

const buildFeedbackFromRating = (payload) => ({
  id: `local-${Date.now()}`,
  mealName: payload.mealName,
  mealType: payload.mealType,
  mealDate: payload.mealDate,
  mealTime: "",
  rating: payload.rating,
  comment: payload.comment,
  timeAgo: "Just now",
  isRated: true,
});

const getLocalFeedbacks = () => {
  try {
    return JSON.parse(sessionStorage.getItem(localFeedbackKey) || "[]");
  } catch {
    return [];
  }
};

const saveLocalFeedback = (feedback) => {
  const existing = getLocalFeedbacks();
  sessionStorage.setItem(
    localFeedbackKey,
    JSON.stringify([feedback, ...existing].slice(0, 50)),
  );
};

const mergeFeedbacks = (...groups) => {
  const seen = new Set();
  return groups.flat().filter((item) => {
    const key = [
      item.mealName,
      item.mealType,
      item.mealDate,
      item.rating,
      item.comment,
    ].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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
    className={`px-4 py-2 text-sm rounded-md transition-all ${
      active
        ? "bg-card shadow-sm text-primary font-semibold"
        : "text-muted-foreground hover:text-foreground"
    }`}
  >
    {label}
  </button>
);

const TableHead = ({ children }) => (
  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
    {children}
  </th>
);

const InfoCard = ({ icon: Icon, title, text }) => (
  <div className="bg-card p-5 rounded-xl shadow-sm border border-border flex items-start gap-4">
    <div className="bg-muted p-2.5 rounded-lg text-foreground">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="font-bold text-foreground text-[13px]">{title}</h4>
      <p className="text-muted-foreground text-xs mt-0.5">{text}</p>
    </div>
  </div>
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
