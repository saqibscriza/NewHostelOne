import { useEffect, useState } from "react";
import { getDashboardAdminApi } from "../../../../utils/utils";

import StatCard from "../components/StatCard";
import OccupancyChart from "../components/OccupancyChart";
import QuickActions from "../components/QuickActions";
import MessMenu from "../components/MessMenu";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import ActivityFeed from "../components/ActivityFeed";

import {
  CalendarDays,
  ChevronDown,
  Users,
  BedDouble,
  IndianRupee,
  Wrench,
} from "lucide-react";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [barData, setBarData] = useState([]);
  // console.log("data my bar---", barData);
  // API CALL
  const fetchDashboard = async () => {
    setLoading(true);

    const res = await getDashboardAdminApi();

    // console.log("FULL RESPONSE ===========", res);

    if (res?.data?.status === "success") {
      setDashboardData(res?.data?.data);
      // setBarData(res?.data?.data?.roomOccupancy);
    } else {
      console.error(res?.data?.message || "Failed to load dashboard");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  // fallback safety

  const stats = dashboardData || {};
  const metrics = stats.keyMetrics || {};

  console.log("DASHBOARD DATA =====", dashboardData);

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Institutional performance overview
          </p>
        </div>

        {/* <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-md text-sm bg-card text-foreground hover:bg-accent transition">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          Last 30 Days
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button> */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={metrics.totalStudents || 0}
          icon={<Users />}
          badge={`${metrics.totalStudentsGrowth || 0}%`}
        />

        <StatCard
          title="Available Beds"
          value={metrics.availableBeds || 0}
          icon={<BedDouble />}
        />

        <StatCard
          title="Monthly Revenue"
          value={`₹${metrics.monthlyRevenue || 0}`}
          icon={<IndianRupee />}
        />

        <StatCard
          title="Maintenance"
          value={metrics.maintenanceTickets || 0}
          icon={<Wrench />}
        />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <OccupancyChart data={stats.roomOccupancy}  />
          <RecentApplicationsTable data={stats.recentApplications} />
        </div>

        <div className="space-y-4">
          <QuickActions />
          <MessMenu data={stats.todayMessMenu} />
          <ActivityFeed data={stats.recentActivity} />
        </div>
      </div>
    </div>
  );
}
