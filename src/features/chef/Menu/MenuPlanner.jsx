// import React, { useEffect, useMemo, useState } from "react";
// import { CalendarDays, Coffee, Moon, Plus, Sun, Utensils } from "lucide-react";
// import toast from "react-hot-toast";

// import { Card, CardContent } from "../../../components/ui/Card";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";
// import { useForm } from "react-hook-form";

// import {
//   getMessMenuByDateApi,
//   getMessMenuFullWeekApi,
//   addMessPlannerApi,
//   updateMessPlannerApi,
// } from "../../../utils/utils";

// const defaultWeekDays = [
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
//   "Sunday",
// ];

// const mealConfig = [
//   { key: "breakfast", title: "BREAKFAST", icon: Coffee },
//   { key: "lunch", title: "LUNCH", icon: Sun },
//   { key: "dinner", title: "DINNER", icon: Moon },
// ];

// // ─── Timezone-safe "YYYY-MM-DD" from any date value ──────────────────────────
// // toISOString() shifts by UTC offset (India = +5:30), causing wrong date.
// // Reading local getFullYear/Month/Date avoids the offset entirely.
// const toLocalDateString = (value) => {
//   if (!value) return "";
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return "";
//   const year = d.getFullYear();
//   const month = String(d.getMonth() + 1).padStart(2, "0");
//   const day = String(d.getDate()).padStart(2, "0");
//   return `${year}-${month}-${day}`; // "2026-05-07"
// };

// // ─── Full readable label: "07 May 2026" ──────────────────────────────────────
// const formatDateLabel = (value) => {
//   if (!value) return "";
//   const d = new Date(value);
//   if (isNaN(d.getTime())) return String(value);
//   const day = String(d.getDate()).padStart(2, "0");
//   const month = d.toLocaleString("en-IN", { month: "long" });
//   const year = d.getFullYear();
//   return `${day} ${month} ${year}`; // "07 May 2026"
// };

// const getResponseData = (response) =>
//   response?.data?.menu || response?.data?.data || response?.data || {};

// // ─── Proper capitalise: "THURSDAY" → "Thursday" ──────────────────────────────
// const capitaliseDayName = (raw, fallback = "") => {
//   if (!raw) return fallback;
//   const s = String(raw).trim();
//   return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
// };

// const getValue = (item, keys, fallback = "") => {
//   for (const key of keys) {
//     const value = key.split(".").reduce((acc, part) => acc?.[part], item);
//     if (value !== undefined && value !== null && value !== "") {
//       return value;
//     }
//   }
//   return fallback;
// };

// const stringifyMeal = (value) => {
//   if (value === null || value === undefined || value === "") return "";
//   if (Array.isArray(value)) return value.join(", ");
//   if (typeof value === "object") {
//     return (
//       value.menu ||
//       value.items?.join?.(", ") ||
//       value.description ||
//       value.mainCourse ||
//       ""
//     );
//   }
//   return String(value);
// };

// // ─── normalizeDay: uses dayName FROM API, not index-based default ─────────────
// // API shape: { id, date, dayName: "THURSDAY", breakfast, lunch, dinner, ... }
// const normalizeDay = (item, index) => {
//   // Use API's own dayName if available, else fall back to week array
//   const rawDayName =
//     item?.dayName ||
//     item?.day ||
//     item?.name ||
//     defaultWeekDays[index];

//   const dayName = capitaliseDayName(rawDayName, defaultWeekDays[index]);

//   // Date field from API
//   const rawDate =
//     item?.date ||
//     item?.menuDate ||
//     item?.createdDate ||
//     toLocalDateString(new Date(Date.now() + index * 24 * 60 * 60 * 1000));

//   const localDate = toLocalDateString(rawDate) || String(rawDate);

//   return {
//     id: item?.id ?? item?.menuId ?? item?.dayId ?? `${dayName}-${index}`,
//     dayName,                        // e.g. "Thursday"
//     localDate,                      // e.g. "2026-05-07"
//     dateLabel: formatDateLabel(rawDate), // e.g. "07 May 2026"
//     original: item,
//   };
// };

// // ─── normalizeDayMenu: handles the exact API shape returned by getByDate ──────
// // API returns: { id, date, dayName, breakfast, breakfastTime, lunch, lunchTime, dinner, dinnerTime }
// // null values for lunch/dinner when not set.
// const normalizeDayMenu = (data) => {
//   console.log("normalizeDayMenu input 👉", data);

//   // Case 1: array of {mealType, mainCourse} entries
//   if (Array.isArray(data) && data.length > 0) {
//     // Sub-case: each item has a mealType key
//     if (data[0]?.mealType || data[0]?.meal_type || data[0]?.type) {
//       const result = { breakfast: "", lunch: "", dinner: "" };
//       data.forEach((entry) => {
//         const type = (
//           entry?.mealType || entry?.meal_type || entry?.type || ""
//         ).toUpperCase();
//         const course = stringifyMeal(
//           entry?.mainCourse || entry?.menu || entry?.description || "",
//         );
//         if (type === "BREAKFAST") result.breakfast = course;
//         if (type === "LUNCH") result.lunch = course;
//         if (type === "DINNER") result.dinner = course;
//       });
//       return result;
//     }
//     // Otherwise treat first item as the day object
//     return normalizeDayMenu(data[0]);
//   }

//   // Case 2: wrapped in content/menus array
//   if (data?.content && Array.isArray(data.content) && data.content.length > 0) {
//     return normalizeDayMenu(data.content);
//   }
//   if (data?.menus && Array.isArray(data.menus) && data.menus.length > 0) {
//     return normalizeDayMenu(data.menus);
//   }

//   // Case 3: single day object — the exact shape the API returns
//   // { breakfast: "Salad", lunch: null, dinner: "Chicken", ... }
//   // null values must be treated as empty, NOT as missing
//   const source = data || {};
//   return {
//     breakfast: stringifyMeal(
//       source.breakfast ?? source.breakFast ?? source.BREAKFAST ?? source.morningMenu ?? "",
//     ),
//     lunch: stringifyMeal(
//       source.lunch ?? source.LUNCH ?? source.afternoonMenu ?? "",
//     ),
//     dinner: stringifyMeal(
//       source.dinner ?? source.DINNER ?? source.nightMenu ?? "",
//     ),
//   };
// };

// const getWeekRange = (days) => {
//   const labels = days.map((d) => d.dateLabel).filter(Boolean);
//   if (labels.length >= 2) return `${labels[0]} - ${labels[labels.length - 1]}`;
//   return "Weekly Menu";
// };

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// export default function MenuPlanner() {
//   const [view, setView] = useState("planner");
//   const [weekDays, setWeekDays] = useState([]);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [dayMenu, setDayMenu] = useState({});
//   const [loadingWeek, setLoadingWeek] = useState(false);
//   const [loadingDay, setLoadingDay] = useState(false);

//   const fetchFullWeek = async () => {
//     setLoadingWeek(true);
//     try {
//       const response = await getMessMenuFullWeekApi();
//       console.log("Full week raw response 👉", response);

//       const data = getResponseData(response);
//       console.log("Full week extracted data 👉", data);

//       const list =
//         data?.content ||
//         data?.week ||
//         data?.menus ||
//         data?.menuList ||
//         data?.data ||
//         (Array.isArray(data) ? data : []);

//       console.log("Full week list 👉", list);

//       // normalizeDay uses item.dayName from API — correct day shown per date
//       const normalizedData = list.length
//         ? list.map(normalizeDay)
//         : defaultWeekDays.map((dayName, index) =>
//             normalizeDay({ dayName }, index),
//           );

//       // Sort by actual local date ascending
//       const sorted = normalizedData
//         .filter((item) => item.localDate)
//         .sort((a, b) => new Date(a.localDate) - new Date(b.localDate))
//         .slice(0, 7);

//       const finalWeek = sorted.length ? sorted : normalizedData.slice(0, 7);

//       console.log("Final weekDays 👉", finalWeek);
//       setWeekDays(finalWeek);

//       // Auto-select today's date if present, else first day
//       const todayLocal = toLocalDateString(new Date());
//       const todayInWeek = finalWeek.find((d) => d.localDate === todayLocal);
//       setSelectedDate(todayInWeek ? todayLocal : finalWeek[0]?.localDate || "");
//     } catch (error) {
//       console.log("fetchFullWeek error 👉", error);
//       toast.error("Failed to load weekly menu");
//       setWeekDays(
//         defaultWeekDays.map((dayName, index) =>
//           normalizeDay({ dayName }, index),
//         ),
//       );
//     } finally {
//       setLoadingWeek(false);
//     }
//   };

//   const fetchDayMenu = async (date) => {
//     if (!date) return;
//     setLoadingDay(true);
//     try {
//       console.log("Fetching menu for date 👉", date);
//       const response = await getMessMenuByDateApi(date);
//       console.log("getByDate raw response 👉", response);

//       const raw = getResponseData(response);
//       console.log("getByDate extracted raw 👉", raw);

//       setDayMenu(normalizeDayMenu(raw));
//     } catch (error) {
//       console.log("fetchDayMenu error 👉", error);
//       toast.error("Failed to load menu");
//       setDayMenu({});
//     } finally {
//       setLoadingDay(false);
//     }
//   };

//   useEffect(() => {
//     fetchFullWeek();
//   }, []);

//   useEffect(() => {
//     if (selectedDate) fetchDayMenu(selectedDate);
//   }, [selectedDate]);

//   const weekRange = useMemo(() => getWeekRange(weekDays), [weekDays]);

//   if (view === "add") {
//     return (
//       <AddMenuPlanner
//         onCancel={() => setView("planner")}
//         onSuccess={() => { setView("planner"); fetchFullWeek(); }}
//       />
//     );
//   }

//   if (view === "edit") {
//     return (
//       <EditMenuPlanner
//         selectedDate={selectedDate}
//         onCancel={() => setView("planner")}
//         onSuccess={() => { setView("planner"); fetchDayMenu(selectedDate); }}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background p-5">
//       <div className="mx-auto max-w-7xl space-y-6">

//         {/* ── Header ── */}
//         <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-foreground">
//               Menu Planner
//             </h1>
//             <p className="mt-1 text-sm text-muted-foreground">
//               {loadingWeek
//                 ? "Loading weekly dining schedule..."
//                 : "Configure the weekly dining schedule"}
//             </p>
//           </div>

//           <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//             <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold shadow-sm">
//               <CalendarDays className="h-4 w-4" />
//               {weekRange}
//             </div>

//             <Button
//               type="button"
//               variant="outline"
//               className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
//               onClick={() => setView("edit")}
//             >
//               <Utensils className="mr-2 h-4 w-4" />
//               Update Menu
//             </Button>

//             <Button
//               type="button"
//               className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
//               onClick={() => setView("add")}
//             >
//               <Plus className="mr-2 h-4 w-4" />
//               Add New Meals
//             </Button>
//           </div>
//         </div>

//         {/* ── Day selector ── */}
//         <Card className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50">
//           <CardContent className="p-4">
//             <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
//               {weekDays.map((item) => {
//                 const isActive = selectedDate === item.localDate;
//                 return (
//                   <button
//                     key={item.id}
//                     type="button"
//                     onClick={() => setSelectedDate(item.localDate)}
//                     className={`rounded-xl px-4 py-3 text-center transition-all ${
//                       isActive
//                         ? "bg-[#0f172a] text-white dark:bg-white dark:text-black"
//                         : "bg-muted text-foreground hover:bg-muted/80"
//                     }`}
//                   >
//                     <p className="text-sm font-bold">{item.dayName}</p>
//                     <p
//                       className={`mt-1 text-xs leading-snug ${
//                         isActive
//                           ? "text-white/80 dark:text-black/70"
//                           : "text-muted-foreground"
//                       }`}
//                     >
//                       {item.dateLabel}
//                     </p>
//                   </button>
//                 );
//               })}
//             </div>
//           </CardContent>
//         </Card>

//         {/* ── Meal cards ── */}
//         <div className="space-y-5">
//           {mealConfig.map((meal) => {
//             const Icon = meal.icon;
//             const menuText = dayMenu[meal.key] || "No menu available";

//             return (
//               <Card
//                 key={meal.key}
//                 className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50"
//               >
//                 <CardContent className="p-6">
//                   <div className="mb-4 flex items-center gap-2">
//                     <Icon className="h-4 w-4 text-foreground" />
//                     <h2 className="text-sm font-bold tracking-[0.12em] text-foreground">
//                       {meal.title}
//                     </h2>
//                   </div>
//                   <div className="rounded-2xl bg-muted px-4 py-4 text-sm font-medium leading-relaxed text-foreground">
//                     {loadingDay ? "Loading..." : menuText}
//                   </div>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//       </div>
//     </div>
//   );
// }

// // ─── ADD MENU ─────────────────────────────────────────────────────────────────
// function AddMenuPlanner({ onCancel, onSuccess }) {
//   const [loaderCheck, setLoaderCheck] = useState(false);
//   const { register, handleSubmit, reset, formState: { errors } } = useForm();

//   const handleAdd = async (data) => {
//     setLoaderCheck(true);
//     try {
//       const response = await addMessPlannerApi({
//         mainCourse: data.mainCourse,
//         date: data.date,
//         mealType: data.mealType,
//       });
//       if (response?.data?.status === "success") {
//         toast.success(response?.data?.message);
//         reset();
//         setTimeout(() => { setLoaderCheck(false); onSuccess?.(); }, 1500);
//       } else {
//         toast.error(response?.data?.message || "Failed to create menu");
//         setLoaderCheck(false);
//       }
//     } catch (error) {
//       console.log(error);
//       setLoaderCheck(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-5">
//       <form onSubmit={handleSubmit(handleAdd)} className="mx-auto max-w-7xl space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Add Menu Planner
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Create and manage menu items for system
//           </p>
//         </div>

//         <Card className="min-h-[620px] rounded-none border-0 bg-card shadow-sm">
//           <CardContent className="p-8">
//             <div className="mb-8 flex items-center gap-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
//                 <Utensils className="h-6 w-6" />
//               </div>
//               <h2 className="text-3xl font-bold">Add Menu</h2>
//             </div>

//             <div className="space-y-7">
//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Main Course
//                 </label>
//                 <Input
//                   className="h-14 rounded-xl"
//                   placeholder="Add Menu Details"
//                   {...register("mainCourse", { required: "Main course is required" })}
//                 />
//                 {errors.mainCourse && (
//                   <p className="text-xs text-red-500">{errors.mainCourse.message}</p>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Date
//                 </label>
//                 <div className="relative">
//                   <Input
//                     type="date"
//                     className="h-14 rounded-xl pr-12"
//                     {...register("date", { required: "Date is required" })}
//                   />
//                   <CalendarDays className="absolute right-4 top-4 h-5 w-5 text-foreground" />
//                 </div>
//                 {errors.date && (
//                   <p className="text-xs text-red-500">{errors.date.message}</p>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Meal Type
//                 </label>
//                 <select
//                   className="h-14 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
//                   {...register("mealType", { required: "Meal type is required" })}
//                 >
//                   <option value="">Select Meal Type</option>
//                   <option value="BREAKFAST">Breakfast</option>
//                   <option value="LUNCH">Lunch</option>
//                   <option value="DINNER">Dinner</option>
//                 </select>
//                 {errors.mealType && (
//                   <p className="text-xs text-red-500">{errors.mealType.message}</p>
//                 )}
//               </div>

//               <div className="flex gap-4 pt-2">
//                 <Button
//                   type="submit"
//                   disabled={loaderCheck}
//                   className="h-12 min-w-44 rounded-xl bg-black text-white hover:bg-black/90"
//                 >
//                   {loaderCheck ? "Creating..." : "Create Menu"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="h-12 min-w-32 rounded-xl"
//                   onClick={onCancel}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </div>
//   );
// }

// // ─── EDIT MENU ────────────────────────────────────────────────────────────────
// function EditMenuPlanner({ selectedDate, onCancel, onSuccess }) {
//   const [loaderCheck, setLoaderCheck] = useState(false);
//   const { register, handleSubmit, formState: { errors } } = useForm({
//     defaultValues: { date: selectedDate || "", mealType: "", mainCourse: "" },
//   });

//   const handleUpdate = async (data) => {
//     setLoaderCheck(true);
//     try {
//       const response = await updateMessPlannerApi({
//         mainCourse: data.mainCourse,
//         date: data.date,
//         mealType: data.mealType,
//       });
//       if (response?.data?.status === "success") {
//         toast.success(response?.data?.message || "Menu updated successfully");
//         setTimeout(() => { setLoaderCheck(false); onSuccess?.(); }, 1500);
//       } else {
//         toast.error(response?.data?.message || "Failed to update menu");
//         setLoaderCheck(false);
//       }
//     } catch (error) {
//       console.log(error);
//       setLoaderCheck(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background p-5">
//       <form onSubmit={handleSubmit(handleUpdate)} className="mx-auto max-w-7xl space-y-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-foreground">
//             Edit Menu Planner
//           </h1>
//           <p className="mt-1 text-sm text-muted-foreground">
//             Create and manage menu items for system
//           </p>
//         </div>

//         <Card className="min-h-[620px] rounded-none border-0 bg-card shadow-sm">
//           <CardContent className="p-8">
//             <div className="mb-8 flex items-center gap-4">
//               <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
//                 <Utensils className="h-6 w-6" />
//               </div>
//               <h2 className="text-3xl font-bold">Edit Menu</h2>
//             </div>

//             <div className="space-y-7">
//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Date
//                 </label>
//                 <div className="relative">
//                   <Input
//                     type="date"
//                     className="h-14 rounded-xl pr-12"
//                     {...register("date", { required: "Date is required" })}
//                   />
//                   <CalendarDays className="absolute right-4 top-4 h-5 w-5 text-foreground" />
//                 </div>
//                 {errors.date && (
//                   <p className="text-xs text-red-500">{errors.date.message}</p>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Meal Type
//                 </label>
//                 <select
//                   className="h-14 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
//                   {...register("mealType", { required: "Meal type is required" })}
//                 >
//                   <option value="">Select Meal Type</option>
//                   <option value="BREAKFAST">Breakfast</option>
//                   <option value="LUNCH">Lunch</option>
//                   <option value="DINNER">Dinner</option>
//                 </select>
//                 {errors.mealType && (
//                   <p className="text-xs text-red-500">{errors.mealType.message}</p>
//                 )}
//               </div>

//               <div className="space-y-3">
//                 <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
//                   Main Course
//                 </label>
//                 <Input
//                   className="h-14 rounded-xl"
//                   placeholder="Add Menu Details"
//                   {...register("mainCourse", { required: "Main course is required" })}
//                 />
//                 {errors.mainCourse && (
//                   <p className="text-xs text-red-500">{errors.mainCourse.message}</p>
//                 )}
//               </div>

//               <div className="flex gap-4 pt-2">
//                 <Button
//                   type="submit"
//                   disabled={loaderCheck}
//                   className="h-12 min-w-44 rounded-xl bg-black text-white hover:bg-black/90"
//                 >
//                   {loaderCheck ? "Updating..." : "Update"}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="secondary"
//                   className="h-12 min-w-32 rounded-xl"
//                   onClick={onCancel}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { CalendarDays, Coffee, Moon, Plus, Sun, Utensils } from "lucide-react";
import toast from "react-hot-toast";

import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useForm } from "react-hook-form";

import {
  getMessMenuByDateApi,
  getMessMenuFullWeekApi,
  addMessPlannerApi,
  updateMessPlannerApi,
} from "../../../utils/utils";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const mealConfig = [
  { key: "breakfast", title: "BREAKFAST", icon: Coffee },
  { key: "lunch", title: "LUNCH", icon: Sun },
  { key: "dinner", title: "DINNER", icon: Moon },
];

// ─── Timezone-safe "YYYY-MM-DD" ───────────────────────────────────────────────
const toLocalDateString = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// ─── Get real day name from actual date — 100% reliable ──────────────────────
// e.g. "2026-05-07" → Thursday (because JS Date.getDay() = 4)
const getDayNameFromDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return DAY_NAMES[d.getDay()]; // getDay() uses LOCAL time, not UTC
};

// ─── "07 May 2026" label ──────────────────────────────────────────────────────
const formatDateLabel = (value) => {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-IN", { month: "long" });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

const getResponseData = (response) =>
  response?.data?.menu || response?.data?.data || response?.data || {};

const stringifyMeal = (value) => {
  if (value === null || value === undefined || value === "") return "";
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object") {
    return (
      value.menu ||
      value.items?.join?.(", ") ||
      value.description ||
      value.mainCourse ||
      ""
    );
  }
  return String(value);
};

// ─── normalizeDay: dayName is ALWAYS derived from the actual date field ───────
// Reason: the full week API returns dayName like "MONDAY"/"TUESDAY" as a
// template label — it does NOT match the real calendar day. But the `date`
// field (e.g. "2026-05-07") is accurate. So we compute the real day name
// from the date using JS Date.getDay() which is timezone-local and reliable.
const normalizeDay = (item, index) => {
  const rawDate =
    item?.date ||
    item?.menuDate ||
    item?.createdDate ||
    toLocalDateString(new Date(Date.now() + index * 24 * 60 * 60 * 1000));

  const localDate = toLocalDateString(rawDate) || String(rawDate);

  // Derive day name from the actual date — ignore item.dayName from API
  const dayName = getDayNameFromDate(localDate) || `Day ${index + 1}`;

  return {
    id: item?.id ?? item?.menuId ?? item?.dayId ?? `day-${index}`,
    dayName,                           // e.g. "Thursday" — from real date
    localDate,                         // e.g. "2026-05-07"
    dateLabel: formatDateLabel(rawDate), // e.g. "07 May 2026"
    original: item,
  };
};

// ─── normalizeDayMenu: handles exact API shape from getByDate ─────────────────
// Shape: { id, date, dayName, breakfast, breakfastTime, lunch, lunchTime, dinner, dinnerTime }
// lunch: null / dinner: null when not set — use ?? not || to handle null
const normalizeDayMenu = (data) => {
  console.log("normalizeDayMenu input 👉", data);

  // Case 1: array of {mealType, mainCourse} entries
  if (Array.isArray(data) && data.length > 0) {
    if (data[0]?.mealType || data[0]?.meal_type || data[0]?.type) {
      const result = { breakfast: "", lunch: "", dinner: "" };
      data.forEach((entry) => {
        const type = (
          entry?.mealType || entry?.meal_type || entry?.type || ""
        ).toUpperCase();
        const course = stringifyMeal(
          entry?.mainCourse || entry?.menu || entry?.description || "",
        );
        if (type === "BREAKFAST") result.breakfast = course;
        if (type === "LUNCH") result.lunch = course;
        if (type === "DINNER") result.dinner = course;
      });
      return result;
    }
    return normalizeDayMenu(data[0]);
  }

  // Case 2: wrapped in content/menus array
  if (data?.content && Array.isArray(data.content) && data.content.length > 0)
    return normalizeDayMenu(data.content);
  if (data?.menus && Array.isArray(data.menus) && data.menus.length > 0)
    return normalizeDayMenu(data.menus);

  // Case 3: single day object — exact shape your API returns
  // Using ?? so that null values are treated as empty (not skipped like ||)
  const s = data || {};
  return {
    breakfast: stringifyMeal(s.breakfast ?? s.breakFast ?? s.BREAKFAST ?? s.morningMenu ?? ""),
    lunch:     stringifyMeal(s.lunch     ?? s.LUNCH     ?? s.afternoonMenu ?? ""),
    dinner:    stringifyMeal(s.dinner    ?? s.DINNER    ?? s.nightMenu ?? ""),
  };
};

const getWeekRange = (days) => {
  const labels = days.map((d) => d.dateLabel).filter(Boolean);
  if (labels.length >= 2) return `${labels[0]} - ${labels[labels.length - 1]}`;
  return "Weekly Menu";
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MenuPlanner() {
  const [view, setView] = useState("planner");
  const [weekDays, setWeekDays] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [dayMenu, setDayMenu] = useState({});
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  const fetchFullWeek = async () => {
    setLoadingWeek(true);
    try {
      const response = await getMessMenuFullWeekApi();
      console.log("Full week raw response 👉", response);

      const data = getResponseData(response);
      const list =
        data?.content ||
        data?.week ||
        data?.menus ||
        data?.menuList ||
        data?.data ||
        (Array.isArray(data) ? data : []);

      console.log("Full week list 👉", list);

      const normalizedData = list.length
        ? list.map(normalizeDay)
        : // fallback: generate 7 days starting from today
          Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const localDate = toLocalDateString(d);
            return {
              id: `fallback-${i}`,
              dayName: getDayNameFromDate(localDate),
              localDate,
              dateLabel: formatDateLabel(localDate),
              original: {},
            };
          });

      // Sort by real date ascending, keep max 7
      const sorted = normalizedData
        .filter((item) => item.localDate)
        .sort((a, b) => new Date(a.localDate) - new Date(b.localDate))
        .slice(0, 7);

      const finalWeek = sorted.length ? sorted : normalizedData.slice(0, 7);
      console.log("Final weekDays 👉", finalWeek);
      setWeekDays(finalWeek);

      // Auto-select today if in the week, else select first day
      const todayLocal = toLocalDateString(new Date());
      const todayInWeek = finalWeek.find((d) => d.localDate === todayLocal);
      setSelectedDate(todayInWeek ? todayLocal : finalWeek[0]?.localDate || "");
    } catch (error) {
      console.log("fetchFullWeek error 👉", error);
      toast.error("Failed to load weekly menu");
    } finally {
      setLoadingWeek(false);
    }
  };

  const fetchDayMenu = async (date) => {
    if (!date) return;
    setLoadingDay(true);
    try {
      console.log("Fetching menu for date 👉", date);
      const response = await getMessMenuByDateApi(date);
      console.log("getByDate raw response 👉", response);
      const raw = getResponseData(response);
      console.log("getByDate extracted raw 👉", raw);
      setDayMenu(normalizeDayMenu(raw));
    } catch (error) {
      console.log("fetchDayMenu error 👉", error);
      toast.error("Failed to load menu");
      setDayMenu({});
    } finally {
      setLoadingDay(false);
    }
  };

  useEffect(() => { fetchFullWeek(); }, []);
  useEffect(() => { if (selectedDate) fetchDayMenu(selectedDate); }, [selectedDate]);

  const weekRange = useMemo(() => getWeekRange(weekDays), [weekDays]);

  if (view === "add") {
    return (
      <AddMenuPlanner
        onCancel={() => setView("planner")}
        onSuccess={() => { setView("planner"); fetchFullWeek(); }}
      />
    );
  }

  if (view === "edit") {
    return (
      <EditMenuPlanner
        selectedDate={selectedDate}
        onCancel={() => setView("planner")}
        onSuccess={() => { setView("planner"); fetchDayMenu(selectedDate); }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background p-5">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Menu Planner
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {loadingWeek
                ? "Loading weekly dining schedule..."
                : "Configure the weekly dining schedule"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-semibold shadow-sm">
              <CalendarDays className="h-4 w-4" />
              {weekRange}
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
              onClick={() => setView("edit")}
            >
              <Utensils className="mr-2 h-4 w-4" />
              Update Menu
            </Button>

            <Button
              type="button"
              className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
              onClick={() => setView("add")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Meals
            </Button>
          </div>
        </div>

        {/* ── Day selector ── */}
        <Card className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
              {weekDays.map((item) => {
                const isActive = selectedDate === item.localDate;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedDate(item.localDate)}
                    className={`rounded-xl px-4 py-3 text-center transition-all ${
                      isActive
                        ? "bg-[#0f172a] text-white dark:bg-white dark:text-black"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    <p className="text-sm font-bold">{item.dayName}</p>
                    <p className={`mt-1 text-xs leading-snug ${
                      isActive
                        ? "text-white/80 dark:text-black/70"
                        : "text-muted-foreground"
                    }`}>
                      {item.dateLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Meal cards ── */}
        <div className="space-y-5">
          {mealConfig.map((meal) => {
            const Icon = meal.icon;
            const menuText = dayMenu[meal.key] || "No menu available";
            return (
              <Card
                key={meal.key}
                className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Icon className="h-4 w-4 text-foreground" />
                    <h2 className="text-sm font-bold tracking-[0.12em] text-foreground">
                      {meal.title}
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-muted px-4 py-4 text-sm font-medium leading-relaxed text-foreground">
                    {loadingDay ? "Loading..." : menuText}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

      </div>
    </div>
  );
}

// ─── ADD MENU ─────────────────────────────────────────────────────────────────
function AddMenuPlanner({ onCancel, onSuccess }) {
  const [loaderCheck, setLoaderCheck] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleAdd = async (data) => {
    setLoaderCheck(true);
    try {
      const response = await addMessPlannerApi({
        mainCourse: data.mainCourse,
        date: data.date,
        mealType: data.mealType,
      });
      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);
        reset();
        setTimeout(() => { setLoaderCheck(false); onSuccess?.(); }, 1500);
      } else {
        toast.error(response?.data?.message || "Failed to create menu");
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
      setLoaderCheck(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-5">
      <form onSubmit={handleSubmit(handleAdd)} className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Add Menu Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage menu items for system
          </p>
        </div>

        <Card className="min-h-[620px] rounded-none border-0 bg-card shadow-sm">
          <CardContent className="p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Utensils className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">Add Menu</h2>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Main Course
                </label>
                <Input
                  className="h-14 rounded-xl"
                  placeholder="Add Menu Details"
                  {...register("mainCourse", { required: "Main course is required" })}
                />
                {errors.mainCourse && (
                  <p className="text-xs text-red-500">{errors.mainCourse.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    className="h-14 rounded-xl pr-12"
                    {...register("date", { required: "Date is required" })}
                  />
                  <CalendarDays className="absolute right-4 top-4 h-5 w-5 text-foreground" />
                </div>
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Meal Type
                </label>
                <select
                  className="h-14 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
                  {...register("mealType", { required: "Meal type is required" })}
                >
                  <option value="">Select Meal Type</option>
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                </select>
                {errors.mealType && (
                  <p className="text-xs text-red-500">{errors.mealType.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={loaderCheck}
                  className="h-12 min-w-44 rounded-xl bg-black text-white hover:bg-black/90"
                >
                  {loaderCheck ? "Creating..." : "Create Menu"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 min-w-32 rounded-xl"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

// ─── EDIT MENU ────────────────────────────────────────────────────────────────
function EditMenuPlanner({ selectedDate, onCancel, onSuccess }) {
  const [loaderCheck, setLoaderCheck] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { date: selectedDate || "", mealType: "", mainCourse: "" },
  });

  const handleUpdate = async (data) => {
    setLoaderCheck(true);
    try {
      const response = await updateMessPlannerApi({
        mainCourse: data.mainCourse,
        date: data.date,
        mealType: data.mealType,
      });
      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Menu updated successfully");
        setTimeout(() => { setLoaderCheck(false); onSuccess?.(); }, 1500);
      } else {
        toast.error(response?.data?.message || "Failed to update menu");
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
      setLoaderCheck(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-5">
      <form onSubmit={handleSubmit(handleUpdate)} className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Menu Planner
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage menu items for system
          </p>
        </div>

        <Card className="min-h-[620px] rounded-none border-0 bg-card shadow-sm">
          <CardContent className="p-8">
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Utensils className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold">Edit Menu</h2>
            </div>

            <div className="space-y-7">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Date
                </label>
                <div className="relative">
                  <Input
                    type="date"
                    className="h-14 rounded-xl pr-12"
                    {...register("date", { required: "Date is required" })}
                  />
                  <CalendarDays className="absolute right-4 top-4 h-5 w-5 text-foreground" />
                </div>
                {errors.date && (
                  <p className="text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Meal Type
                </label>
                <select
                  className="h-14 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground"
                  {...register("mealType", { required: "Meal type is required" })}
                >
                  <option value="">Select Meal Type</option>
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                </select>
                {errors.mealType && (
                  <p className="text-xs text-red-500">{errors.mealType.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  Main Course
                </label>
                <Input
                  className="h-14 rounded-xl"
                  placeholder="Add Menu Details"
                  {...register("mainCourse", { required: "Main course is required" })}
                />
                {errors.mainCourse && (
                  <p className="text-xs text-red-500">{errors.mainCourse.message}</p>
                )}
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="submit"
                  disabled={loaderCheck}
                  className="h-12 min-w-44 rounded-xl bg-black text-white hover:bg-black/90"
                >
                  {loaderCheck ? "Updating..." : "Update"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="h-12 min-w-32 rounded-xl"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
