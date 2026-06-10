import { useEffect, useState } from "react";
import { getDashboardAdminApi } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
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
  const [filter, setFilter] = useState("7");
  const [selectedHostel, setSelectedHostel] = useState(
    sessionStorage.getItem("selectedHostel") || "",
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboard = async () => {
    setLoading(true);

    const res = await getDashboardAdminApi(filter);

    if (res?.data?.status === "success") {
      setDashboardData(res?.data?.data);
    } else {
      console.error(res?.data?.message || "Failed to load dashboard");
    }

    setLoading(false);
  };

  useEffect(() => {
    // selectedHostel change pe full dashboard refresh
    fetchDashboard();
  }, [selectedHostel]);

  useEffect(() => {
    const handleHostelChange = () => {
      setSelectedHostel(sessionStorage.getItem("selectedHostel") || "");
    };

    window.addEventListener("hostelChanged", handleHostelChange);

    return () => {
      window.removeEventListener("hostelChanged", handleHostelChange);
    };
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
        <div
          onClick={() => navigate("/admin/students")}
          className="cursor-pointer"
        >
          <StatCard
            title="Total Students"
            value={metrics.totalStudents || 0}
            icon={<Users />}
            badge={`${metrics.totalStudentsGrowth || 0}%`}
          />
        </div>

        <div
          onClick={() => navigate("/admin/rooms/details")}
          className="cursor-pointer"
        >
          <StatCard
            title="Available Beds"
            value={metrics.availableBeds || 0}
            icon={<BedDouble />}
          />
        </div>

        <div onClick={() => navigate("/admin/fees")} className="cursor-pointer">
          <StatCard
            title="Monthly Revenue"
            value={`₹${metrics.monthlyRevenue || 0}`}
            icon={<IndianRupee />}
          />
        </div>
        <div
          onClick={() => navigate("/admin/support")}
          className="cursor-pointer"
        >
          <StatCard
            title="Maintenance"
            value={metrics.maintenanceTickets || 0}
            icon={<Wrench />}
          />
        </div>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* OccupancyChart ke filter change pe sirf chart refresh ho */}
          <OccupancyChart
            data={stats.roomOccupancy}
            filter={filter}
            setFilter={setFilter}
          />{" "}
          <RecentApplicationsTable data={stats.recentApplications} />
        </div>

        <div className="space-y-4">
          <QuickActions />
          <MessMenu data={stats.todayMessMenu} />
          {/* <ActivityFeed data={stats.recentActivity} /> */}
        </div>
      </div>
    </div>
  );
}
