import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentDashboardApi } from "../../../utils/utils";
import { Info } from "lucide-react";
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
  Wrench,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { toast } from "react-toastify";

export default function My_Dashboard() {
  const [loaderCheck, setLoaderCheck] = useState(false);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);

  // ================= API =================

  const StudentDashboardApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getStudentDashboardApi();

      console.log("student dashboard", response);

      if (response?.data?.status === "success") {
        setDashboardData(response?.data?.data);
      } else {
        toast.error(response?.data?.message || "Failed to fetch dashboard");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setLoaderCheck(false);
    }
  };
  useEffect(() => {
    StudentDashboardApi();
  }, []);

  if (loaderCheck) {
    return (
      <div className="p-6 text-muted-foreground">Loading dashboard...</div>
    );
  }

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Monthly Fee"
          value={dashboardData?.monthlyFee?.status || "N/A"}
          icon={CheckCircle}
        />
        <StatCard
          title="Room Occupancy"
          value={dashboardData?.roomOccupancy?.display || "N/A"}
          icon={Users}
        />

        {/* <StatCard
          title="Attendance"
          value={dashboardData?.attendance || "N/A"}
          icon={Calendar}
        /> */}
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

              <Button
                className="bg-primary text-primary-foreground cursor-pointer"
                onClick={() =>
                  navigate("/student/mess", {
                    state: { defaultTab: "week" },
                  })
                }
              >
                View Weekly Menu
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <MenuItem
                label="Breakfast"
                text={dashboardData?.todaysMenu?.breakfast || "Not available"}
              />

              <MenuItem
                label="Lunch"
                text={dashboardData?.todaysMenu?.lunch || "Not available"}
              />

              <MenuItem
                label="Dinner"
                text={dashboardData?.todaysMenu?.dinner || "Not available"}
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
                  {dashboardData?.nextPayment?.message || "No payment message"}
                </p>

                <h2 className="text-2xl font-bold">
                  {dashboardData?.nextPayment?.amount || "₹0"}
                </h2>

                <p className="text-red-500 text-sm">
                  Due: {dashboardData?.nextPayment?.dueDate || "N/A"}
                </p>

                <Button
                  className="cursor-pointer"
                  onClick={() => navigate("/student/fees/pay")}
                >
                  Pay Now
                </Button>
              </CardContent>
            </Card>

            {/* ROOM */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">
                  Room {dashboardData?.roomDetails?.roomNumber || "N/A"}
                </h3>

                <div className="flex flex-col gap-2 text-sm">
{dashboardData?.roomDetails?.amenities?.map((item, index) => (
  <div key={index} className="flex items-center gap-2">
    <img
      src={item?.amenityIcon}
      alt={item?.amenitiesName}
      className="w-5 h-5 object-contain"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />

    <span>{item?.amenitiesName || "N/A"}</span>
  </div>
))}
                </div>

                <p className="text-sm text-muted-foreground">
                  Roommate: {dashboardData?.roomDetails?.roommate || "N/A"}
                </p>

                <p className="text-sm text-muted-foreground">
                  Wing: {dashboardData?.roomDetails?.wing || "N/A"}
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

            <CardContent className="space-y-5">
              {dashboardData?.notices?.length > 0 ? (
                dashboardData.notices.map((notice, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between gap-3 pb-3 border-b last:border-none last:pb-0"
                  >
                    {/* LEFT CONTENT */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base leading-snug line-clamp-2">
                        {typeof notice?.title === "string" ? notice.title : ""}
                      </p>

                      <p className="text-sm text-muted-foreground mt-1">
                        Posted{" "}
                        {typeof notice?.timeAgo === "string"
                          ? notice.timeAgo
                          : ""}
                      </p>
                    </div>

                    {/* TOOLTIP ICON */}
                    <div className="relative group shrink-0 mt-1">
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-accent transition">
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </div>

                      {/* TOOLTIP */}
                      <div className="absolute bottom-8 right-0 z-50 hidden w-72 rounded-xl bg-black p-4 shadow-2xl group-hover:block">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm break-words text-white">
                            {typeof notice?.title === "string"
                              ? notice.title
                              : ""}
                          </p>

                          {notice?.description && (
                            <p className="text-sm text-gray-300 break-words">
                              {notice.description}
                            </p>
                          )}

                          <p className="text-xs text-gray-400 border-t border-gray-700 pt-2">
                            Posted {notice?.timeAgo || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
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
              <ActionBtn
                onClick={() => navigate("/student/support/add")}
                icon={Wrench}
                text="Request Maintenance"
              />

              <ActionBtn
                onClick={() => navigate("/student/fees")}
                icon={CreditCard}
                text="Pay Fees"
              />

              <ActionBtn
                onClick={() => navigate("/student/mess")}
                icon={MessageSquare}
                text="Give Feedback"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, icon }) => {
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

        {React.createElement(icon, { className: "w-6 h-6 text-primary" })}
      </CardContent>
    </Card>
  );
};

const MenuItem = ({ label, time, text }) => (
  <div className="flex gap-4">
    <div className="w-24 text-sm text-muted-foreground">
      <p className="font-medium">{label}</p>

      {time ? <p>{time}</p> : null}
    </div>

    <div className="flex-1 bg-muted p-3 rounded-md text-sm">{text}</div>
  </div>
);

const ActionBtn = ({ icon, text, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-accent transition"
  >
    {React.createElement(icon, { className: "w-5 h-5" })}

    <span>{text}</span>
  </div>
);
