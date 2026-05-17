import React, { useEffect, useState } from "react";
import {
  Users,
  CircleCheck,
  ClipboardList,
  Star,
  TriangleAlert,
  Droplets,
  Sandwich,
  Wheat,
  Pencil,
  ChevronRight,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/Badge";
import { getChefDashboardApi } from "../../../../utils/utils";

const stats = [
  {
    title: "TODAY MEALS",
    value: "842",
    sub: "Meal count",
    icon: Users,
    topText: "TODAY",
  },
  {
    title: "BREAKFAST STATUS",
    value: "85%",
    progress: 85,
    icon: CircleCheck,
  },
  {
    title: "LOW STOCK ITEMS",
    value: "08",
    sub: "Requires attention",
    icon: ClipboardList,
    action: "View All",
  },
  {
    title: "AVERAGE STUDENT RATING",
    value: "4.2",
    icon: Star,
    topText: "NEW",
  },
];

const menuData = [
  {
    meal: "BREAKFAST",
    time: "8:00 - 10:00",
    menu: "Scrambled Eggs, Whole Wheat Toast, Coffee",
  },
  {
    meal: "LUNCH",
    time: "13:00 - 15:00",
    menu: "Grilled Lemon Chicken, Organic Quinoa, Seasonal Salad",
  },
  {
    meal: "DINNER",
    time: "20:00 - 22:00",
    menu: "Vegetable Lasagna, Roasted Garlic Bread",
  },
];

const inventoryData = [
  {
    name: "Potatoes",
    quantity: "10 kg left (Critical)",
    icon: TriangleAlert,
    urgent: true,
  },
  {
    name: "Fresh Milk",
    quantity: "5 Liters left (Low)",
    icon: Droplets,
  },
  {
    name: "Bread Loaves",
    quantity: "20 Loaves (Normal)",
    icon: Sandwich,
    checked: true,
  },
  {
    name: "Basmati Rice",
    quantity: "45 kg (Normal)",
    icon: Wheat,
    checked: true,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await getChefDashboardApi();
        setDashboardData(response?.data?.dashboard || null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const dashboardStats = [
    {
      title: "TODAY STUDENT",
      value: dashboardData?.todayStudent || 0,
      sub: "TODAY",
      icon: Users,
    },
    {
      title: "LOW STOCK ITEMS",
      value: dashboardData?.lowStockItems || 0,
      sub: "Requires attention",
      icon: ClipboardList,
      action: "View All",
    },
    {
      title: "AVERAGE STUDENT RATING",
      value: dashboardData?.averageStudentRating || 0,
      sub: "Rating",
      icon: Star,
    },
    {
      title: "TODAY MENU ITEMS",
      value: dashboardData?.todayMenuItems || 0,
      sub: "Meals",
      icon: Sandwich,
    },
  ];

  const todayMenuData = dashboardData?.todayMenu;

  const todayMenu = todayMenuData
    ? [
        {
          meal: "Breakfast",
          time: todayMenuData?.breakfastTime,
          menu: todayMenuData?.breakfast,
        },
        {
          meal: "Lunch",
          time: todayMenuData?.lunchTime,
          menu: todayMenuData?.lunch,
        },
        {
          meal: "Dinner",
          time: todayMenuData?.dinnerTime,
          menu: todayMenuData?.dinner,
        },
      ]
    : menuData;
  const inventoryAlertsSource =
    dashboardData?.inventoryAlerts ||
    dashboardData?.lowStockList ||
    dashboardData?.inventory;
  const inventoryAlerts = Array.isArray(inventoryAlertsSource)
    ? inventoryAlertsSource
    : inventoryData;

  return (
    <div className="min-h-screen bg-background p-5">
      <div className="mx-auto max-w-7xl space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Chef Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading kitchen details..."
              : "Kitchen efficiency and meal tracking for today."}
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {dashboardStats.map((item, index) => {
            const Icon = item.icon;

            return (
              <Card
                key={index}
                className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50"
              >
                <CardContent className="p-5">
                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>

                    {item.action ? (
                      <button className="text-xs font-semibold underline underline-offset-4 text-foreground">
                        {item.action}
                      </button>
                    ) : (
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                        TODAY
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-bold tracking-tight">
                        {item.value}
                      </h2>

                      {item.sub && (
                        <p className="text-sm font-semibold text-foreground">
                          {item.sub}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        {/* Bottom Grid */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
          {/* Menu Section */}
          <Card className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50">
            <CardContent className="p-6">
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Today's Menu</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {dashboardData?.todayMenu?.date
                      ? `${dashboardData.todayMenu.day
                          ?.charAt(0)
                          .toUpperCase()}${dashboardData.todayMenu.day
                          ?.slice(1)
                          .toLowerCase()}, ${new Date(
                          dashboardData.todayMenu.date,
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}`
                      : "Today's Menu"}
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/chef/menu")}
                  className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm"
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Update Menu
                </Button>
              </div>

              <div className="space-y-5">
                {todayMenu.map((item, index) => {
                  const mealName = item.meal || item.mealType || item.title;
                  const mealTime = item.time || item.mealTime || "";
                  const mealMenu =
                    item.menu ||
                    item.items ||
                    item.description ||
                    item.mainCourse ||
                    "-";

                  return (
                    <div
                      key={index}
                      className="grid grid-cols-1 gap-4 lg:grid-cols-[120px_1fr]"
                    >
                      <div className="pt-1">
                        <p className="text-sm font-bold tracking-[0.15em]">
                          {String(mealName || "").toUpperCase()}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {mealTime}
                        </p>
                      </div>

                      <div className="flex min-h-[72px] items-center rounded-2xl bg-muted px-5 py-4 text-base font-medium leading-relaxed text-foreground">
                        {Array.isArray(mealMenu)
                          ? mealMenu.join(", ")
                          : mealMenu}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Inventory Section */}
          <Card className="rounded-3xl border-0 bg-card shadow-sm ring-1 ring-border/50">
            <CardContent className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-3xl font-bold">Inventory Alerts</h2>

                <Badge className="rounded-lg bg-muted px-3 py-1 text-[10px] font-bold tracking-wide text-foreground">
                  {dashboardData?.inventoryAlerts?.length || 0} ALERTS
                </Badge>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {inventoryAlerts.map((item, index) => {
                  const Icon =
                    typeof item.icon === "function" ? item.icon : TriangleAlert;
                  const itemName = item.name || item.itemName || item.title;
                  const quantity = `${item.quantity || 0} ${item.unit || ""} (${item.status || "Normal"})`;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-2xl bg-muted px-4 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div>
                          <h3 className="text-base font-bold">{itemName}</h3>

                          <p className="text-xs font-medium text-muted-foreground">
                            {quantity}
                          </p>
                        </div>
                      </div>

                      {item.checked ? (
                        <Check className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={() => navigate("/chef/inventory/details/add")}
                className="mt-6 h-11 w-full rounded-xl text-sm font-semibold shadow-sm"
              >
                Add Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
