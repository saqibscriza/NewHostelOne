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
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const response = await getChefDashboardApi();
        setDashboardData(response?.data?.data || response?.data || null);
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
      ...stats[0],
      value:
        dashboardData?.todayMeals ||
        dashboardData?.totalMeals ||
        dashboardData?.mealCount ||
        stats[0].value,
    },
    {
      ...stats[1],
      value:
        dashboardData?.breakfastStatus ||
        dashboardData?.breakfastPercentage ||
        stats[1].value,
      progress:
        Number.parseInt(
          dashboardData?.breakfastStatus || dashboardData?.breakfastPercentage,
          10,
        ) || stats[1].progress,
    },
    {
      ...stats[2],
      value:
        dashboardData?.lowStockItems ||
        dashboardData?.lowStockCount ||
        stats[2].value,
    },
    {
      ...stats[3],
      value:
        dashboardData?.averageStudentRating ||
        dashboardData?.averageRating ||
        stats[3].value,
    },
  ];

  const todayMenuSource =
    dashboardData?.todayMenu || dashboardData?.menus || dashboardData?.menu;
  const todayMenu = Array.isArray(todayMenuSource) ? todayMenuSource : menuData;

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

                    {item.topText && (
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                        {item.topText}
                      </span>
                    )}

                    {item.action && (
                      <button className="text-xs font-medium underline underline-offset-4">
                        {item.action}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-[0.15em] text-muted-foreground">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-bold tracking-tight">
                        {item.value}
                      </h2>

                      {item.sub && (
                        <p className="text-sm font-medium text-foreground">
                          {item.sub}
                        </p>
                      )}

                      {item.progress && (
                        <div className="h-2.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-foreground"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
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
                    Wednesday, Oct 25th
                  </p>
                </div>

                <Button className="h-11 rounded-xl px-5 text-sm font-semibold shadow-sm">
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
                  URGENT
                </Badge>
              </div>

              <div className="space-y-3">
                {inventoryAlerts.map((item, index) => {
                  const Icon =
                    typeof item.icon === "function" ? item.icon : TriangleAlert;
                  const itemName = item.name || item.itemName || item.title;
                  const quantity =
                    item.quantity ||
                    item.availableQuantity ||
                    item.stock ||
                    item.description;

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

              <Button className="mt-6 h-11 w-full rounded-xl text-sm font-semibold shadow-sm">
                Add Inventory
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
