import React, { useEffect, useState } from "react";
import { Star, ShieldCheck, Truck, Headphones, X } from "lucide-react";
import {
  getTodayMessMenuApi,
  getFullWeekMessMenuApi,
} from "../../../../utils/utils";
export default function Mess() {
  const [openModal, setOpenModal] = useState(false);

  const [selectedMeal, setSelectedMeal] = useState({
    name: "",
    category: "",
    meal: "",
  });
  const [activeTab, setActiveTab] = useState("today");
  const [meals, setMeals] = useState([]);
  const [rating, setRating] = useState(0);

  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  const getTodayMenuApi = async () => {
    try {
      const dayName = new Date().toLocaleDateString("en-US", {
        weekday: "long",
      });

      const response = await getTodayMessMenuApi(dayName);

      console.log("TODAY MENU RESPONSE 👉", response);

      if (response?.data?.status === "success") {
        setMeals(response?.data?.data || []);
      } else {
        setMeals([]);
      }
    } catch (error) {
      console.log(error);

      setMeals([]);
    }
  };

  const getTomorrowMenuApi = async () => {
    try {
      const tomorrow = new Date();

      tomorrow.setDate(tomorrow.getDate() + 1);

      const dayName = tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
      });

      const response = await getTodayMessMenuApi(dayName);

      if (response?.data?.status === "success") {
        setMeals(response?.data?.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getFullWeekMenuApi = async () => {
  try {
    const response =
      await getFullWeekMessMenuApi();

    console.log(
      "FULL WEEK RESPONSE 👉",
      response
    );

    if (
      response?.data?.status ===
      "success"
    ) {
      setMeals(
        response?.data?.data || []
      );
    } else {
      setMeals([]);
    }
  } catch (error) {
    console.log(error);

    setMeals([]);
  }
};
  useEffect(() => {
    getTodayMenuApi();
  }, []);

  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);

    setRating(0);

    setHoverRating(0);

    setComment("");

    setOpenModal(true);
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      alert("Please select rating");

      return;
    }

    const payload = {
      meal: selectedMeal?.meal,

      category: selectedMeal?.category,

      rating,

      comment,
    };

    console.log("RATING PAYLOAD 👉", payload);

    // CALL YOUR API HERE

    setOpenModal(false);
  };

  console.log("MEALS DATA 👉", meals);

  return (
    <>
      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Rate Meal
            </h2>

            {/* Form */}
            <div className="space-y-5">
              {/* Meal */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Meal Details
                </label>

                <input
                  type="text"
                  value={selectedMeal.meal}
                  disabled
                  className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Date
                </label>

                <input
                  type="text"
                  value="12 June 2026"
                  disabled
                  className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Category
                </label>

                <input
                  type="text"
                  value={selectedMeal.category}
                  disabled
                  className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm text-muted-foreground outline-none"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Comment
                </label>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter comment"
                  className="w-full h-24 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none resize-none"
                />
              </div>

              {/* Rating */}
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
                      className={`w-8 h-8 cursor-pointer transition-all ${
                        star <= (hoverRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-3 pt-5 border-t border-border">
                <button
                  onClick={handleSubmitRating}
                  className="px-6 h-11 rounded-xl bg-black text-white text-sm font-semibold hover:opacity-90"
                >
                  Rate Meal
                </button>

                <button
                  onClick={() => setOpenModal(false)}
                  className="px-6 h-11 rounded-xl bg-muted text-foreground text-sm font-semibold hover:opacity-90"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PAGE */}
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Mess Details
          </h1>

          <p className="text-muted-foreground mt-1">
            View today's menu, upcoming meals, and mess schedule quickly
          </p>
        </div>

        {/* MENU CARD */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Today's Menu
              </h2>

              <p className="text-muted-foreground text-sm mt-1">
                Wednesday, Oct 25th
              </p>
            </div>

            <div className="flex bg-muted p-1 rounded-lg">
              <button
                onClick={() => {
                  setActiveTab("today");
                  getTodayMenuApi();
                }}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeTab === "today"
                    ? "bg-card shadow-sm text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TODAY
              </button>

              <button
                onClick={() => {
                  setActiveTab("tomorrow");
                  getTomorrowMenuApi();
                }}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeTab === "tomorrow"
                    ? "bg-card shadow-sm text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                TOMORROW
              </button>

              <button
                onClick={() => {
                  setActiveTab("week");
                  getFullWeekMenuApi();
                }}
                className={`px-4 py-2 text-sm rounded-md transition-all ${
                  activeTab === "week"
                    ? "bg-card shadow-sm text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                FULL WEEK
              </button>
            </div>
          </div>

          {/* Meals */}
         <div className="space-y-4">
  {meals?.length > 0 ? (
    meals.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row gap-4 sm:gap-12"
              >
                <div className="w-24 shrink-0">
                  <h3 className="font-bold text-foreground text-sm tracking-wider">
                    {item.category}
                  </h3>

                  <p className="text-muted-foreground text-xs mt-1">
                    {item.time}
                  </p>
                </div>

                <div className="bg-muted p-4 rounded-xl flex-1 flex items-center justify-between gap-4">
                  <p className="text-foreground text-[15px]">{item.meal}</p>

                  <button
                    onClick={() => handleOpenModal(item)}
                    className="px-5 py-2 bg-primary hover:opacity-90 text-primary-foreground text-xs font-bold rounded-xl shadow-sm shrink-0 uppercase tracking-wide"
                  >
                    Rate Meal
                  </button>
                </div>
              </div>
             ))
              ) : (
                <div className="bg-muted rounded-xl p-10 text-center">
                  <p className="text-muted-foreground">
                    No menu available for this day
                  </p>
                </div>
              )}
            </div>
          </div>
      

        {/* FILTER BAR */}
        <div className="bg-card border border-border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <p className="text-sm font-medium text-muted-foreground">
              Filter by:
            </p>

            <select className="h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none">
              <option>All Rating</option>
              <option>5 Star</option>
              <option>4 Star</option>
              <option>3 Star</option>
            </select>

            <select className="h-10 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
            </select>
          </div>

          <button className="text-sm font-medium text-foreground hover:text-primary">
            Clear all filters
          </button>
        </div>

        {/* DETAILED FEEDBACK */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-border">
            <h2 className="text-2xl font-bold text-foreground">
              Detailed Feedback
            </h2>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Student & Date
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Meal Details
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Category
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Rating
                  </th>

                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">
                    Comments
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Row 1 */}
                <tr className="border-t border-border">
                  <td className="px-6 py-6 text-foreground text-sm">
                    12 June 2026
                  </td>

                  <td className="px-6 py-6">
                    <div>
                      <p className="text-sm text-foreground font-medium">
                        Grilled Salmon
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-sm text-foreground">Lunch</td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}

                        <Star className="w-4 h-4 text-muted-foreground" />
                      </div>

                      <span className="w-fit px-3 py-1 rounded-full bg-muted text-xs font-semibold text-foreground">
                        POSITIVE
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <p className="text-sm text-muted-foreground leading-7">
                      The salmon was perfectly cooked and season...
                      <button className="ml-1 text-primary hover:underline">
                        Read More
                      </button>
                    </p>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-t border-border">
                  <td className="px-6 py-6 text-foreground text-sm">
                    12 June 2026
                  </td>

                  <td className="px-6 py-6">
                    <div>
                      <p className="text-sm text-foreground font-medium">
                        Grilled Salmon
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-6 text-sm text-foreground">Dinner</td>

                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-primary text-primary"
                          />
                        ))}
                      </div>

                      <span className="w-fit px-3 py-1 rounded-full bg-muted text-xs font-semibold text-foreground">
                        POSITIVE
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-6">
                    <p className="text-sm text-muted-foreground leading-7">
                      The salmon was perfectly cooked and season...
                      <button className="ml-1 text-primary hover:underline">
                        Read More
                      </button>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-start gap-4">
            <div className="bg-muted p-2.5 rounded-lg text-foreground">
              <ShieldCheck className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-bold text-foreground text-[13px]">
                Quality Certified
              </h4>

              <p className="text-muted-foreground text-xs mt-0.5">
                ISO 22000 Food Safety Standards
              </p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-start gap-4">
            <div className="bg-muted p-2.5 rounded-lg text-foreground">
              <Truck className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-bold text-foreground text-[13px]">
                Supply Update
              </h4>

              <p className="text-muted-foreground text-xs mt-0.5">
                Fresh organic produce arriving daily at 05:00
              </p>
            </div>
          </div>

          <div className="bg-card p-5 rounded-2xl shadow-sm border border-border flex items-start gap-4">
            <div className="bg-muted p-2.5 rounded-lg text-foreground">
              <Headphones className="w-5 h-5" />
            </div>

            <div>
              <h4 className="font-bold text-foreground text-[13px]">
                Support Desk
              </h4>

              <p className="text-muted-foreground text-xs mt-0.5">
                Immediate assistance
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
