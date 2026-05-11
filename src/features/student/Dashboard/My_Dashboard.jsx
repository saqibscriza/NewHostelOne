import React, { useEffect, useState } from "react";
import { getStudentDashboardApi } from "../../../utils/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";
import {
  CheckCircle,
  Users,
  Calendar,
  Wifi,
  Snowflake,
  Wrench,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

export default function My_Dashboard() {
  const [loaderCheck, setLoaderCheck] = useState(false);

  const [dashboardData, setDashboardData] = useState(null);

  // ================= API =================

  const StudentDashboardApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getStudentDashboardApi();

      console.log("student dashboard", response);

      if (response?.data?.status === "success") {
        setDashboardData(response?.data);

        setLoaderCheck(false);
      } else {
        toast.error("Failed to fetch dashboard");

        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);

      setLoaderCheck(false);
    }
  };

  useEffect(() => {
    StudentDashboardApi();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {dashboardData?.studentName || "Student"}
        </h1>

        <p className="text-muted-foreground">
          Manage your dashboard and daily operations easily
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Monthly Fee"
          value={dashboardData?.monthlyFee?.status ?? "PAID"}
          icon={CheckCircle}
        />

        <StatCard
          title="Room Occupancy"
          value={dashboardData?.roomOccupancy?.display ?? "1/2"}
          icon={Users}
        />

        <StatCard
          title="Attendance"
          value={dashboardData?.attendance ?? "N/A"}
          icon={Calendar}
        />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* MENU */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Today's Menu</CardTitle>

                <p className="text-sm text-muted-foreground">
                  {dashboardData?.todaysMenu?.date || "Today"}
                </p>
              </div>

              <Button className="bg-primary text-primary-foreground">
                View Weekly Menu
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <MenuItem
                label="Breakfast"
                time="Morning"
                text={dashboardData?.todaysMenu?.breakfast || "N/A"}
              />

              <MenuItem
                label="Lunch"
                time="Afternoon"
                text={dashboardData?.todaysMenu?.lunch || "N/A"}
              />

              <MenuItem
                label="Dinner"
                time="Night"
                text={dashboardData?.todaysMenu?.dinner || "N/A"}
              />
            </CardContent>
          </Card>

          {/* BOTTOM CARDS */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* PAYMENT */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Next Payment Due</h3>

                <p className="text-muted-foreground text-sm">
                  {dashboardData?.nextPayment?.message ||
                    "Maintain your residency status."}
                </p>

                <h2 className="text-2xl font-bold">
                  {dashboardData?.nextPayment?.amount || "₹0"}
                </h2>

                <p className="text-red-500 text-sm">
                  Due: {dashboardData?.nextPayment?.dueDate || "N/A"}
                </p>

                <Button>Pay Now</Button>
              </CardContent>
            </Card>

            {/* ROOM */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">
                  {dashboardData?.roomDetails?.roomNumber || "Room"}
                </h3>

                <div className="flex items-center gap-2 text-sm">
                  <Wifi size={16} /> High-speed WiFi
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Snowflake size={16} /> Central AC
                </div>

                <p className="text-sm text-muted-foreground">
                  Roommate: {dashboardData?.roomDetails?.roommate || "Vacant"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          {/* NOTICES */}
          <Card>
            <CardHeader>
              <CardTitle>Notices</CardTitle>
            </CardHeader>

            {/* <CardContent className="space-y-3 text-sm">
              {dashboardData?.notices?.map((notice, index) => (
                <p key={index}>
                  {notice?.message ||
                    notice?.description ||
                    notice?.title ||
                    String(notice)}
                </p>
              ))}
            </CardContent> */}
            <CardContent className="space-y-3 text-sm">
              {dashboardData?.notices?.length > 0 ? (
                dashboardData.notices.map((notice, index) => (
                  <div key={index} className="border-b pb-2 last:border-0">
                    <p className="font-medium">
                      {typeof notice?.title === "string" ? notice.title : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {typeof notice?.description === "string"
                        ? notice.description
                        : ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {typeof notice?.timeAgo === "string"
                        ? notice.timeAgo
                        : ""}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">No notices available</p>
              )}
            </CardContent>
          </Card>

          {/* ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <ActionBtn icon={Wrench} text="Request Maintenance" />

              <ActionBtn icon={CreditCard} text="Pay Fees" />

              <ActionBtn icon={MessageSquare} text="Give Feedback" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon: Icon }) => {
  let formattedValue = value;

  if (value === null || value === undefined) {
    formattedValue = "N/A";
  } else if (typeof value === "object") {
    formattedValue =
      value.display || value.percentage || value.status || value.total || "N/A";
  } else {
    formattedValue = String(value);
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h2 className="text-xl font-bold">{formattedValue}</h2>
        </div>

        <Icon className="w-6 h-6 text-primary" />
      </CardContent>
    </Card>
  );
};

const MenuItem = ({ label, time, text }) => (
  <div className="flex gap-4">
    <div className="w-24 text-sm text-muted-foreground">
      <p className="font-medium">{label}</p>

      <p>{time}</p>
    </div>

    <div className="flex-1 bg-muted p-3 rounded-md text-sm">{text}</div>
  </div>
);

const ActionBtn = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition">
    <Icon className="w-5 h-5" />

    <span>{text}</span>
  </div>
);
