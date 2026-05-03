import StatCard from "../components/StatCard";
import OccupancyChart from "../components/OccupancyChart";
import QuickActions from "../components/QuickActions";
import MessMenu from "../components/MessMenu";
import RecentApplicationsTable from "../components/RecentApplicationsTable";
import ActivityFeed from "../components/ActivityFeed";
import { CalendarDays, ChevronDown } from "lucide-react";

import { Users, BedDouble, IndianRupee, Wrench } from "lucide-react";

export default function DashboardPage() {
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

        <button className="flex items-center gap-2 border border-border px-4 py-2 rounded-md text-sm bg-card text-foreground hover:bg-accent transition">
          <CalendarDays className="w-4 h-4 text-muted-foreground" />
          Last 30 Days
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="842"
          icon={<Users />}
          badge="+12%"
        />
        <StatCard title="Available Beds" value="158" icon={<BedDouble />} />
        <StatCard
          title="Monthly Revenue"
          value="₹45,280"
          icon={<IndianRupee />}
        />
        <StatCard title="Maintenance" value="24" icon={<Wrench />} />
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          <OccupancyChart />
          <RecentApplicationsTable />
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          <QuickActions />
          <MessMenu />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
