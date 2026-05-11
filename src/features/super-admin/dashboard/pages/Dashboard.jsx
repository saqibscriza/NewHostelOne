import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { getDashboardStatsApi } from "../../../../utils/utils";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Building2,
  Users,
  GraduationCap,
  DollarSign,
  TrendingUp,
  Filter,
  CalendarDays,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [dashboardStats, setDashboardStats] = useState(null);

  const navigate = useNavigate();

  const statsCards = [
    {
      label: "TOTAL HOSTELS",
      value: dashboardStats?.totalHostels || 0,
      change: `${dashboardStats?.totalHostelsVsLastMonth || 0}%`,
      icon: Building2,
    },

    {
      label: "TOTAL ADMINS",
      value: dashboardStats?.totalAdmins || 0,
      change: "+0%",
      icon: Users,
    },

    {
      label: "TOTAL STUDENTS",
      value: dashboardStats?.totalStudents || 0,
      change: `${dashboardStats?.activeStudentsVsLastMonth || 0}%`,
      icon: GraduationCap,
    },

    {
      label: "TOTAL REVENUE",
      value: `₹ ${dashboardStats?.totalRevenue || 0}`,
      change: `${dashboardStats?.averageOccupancyVsLastMonth || 0}%`,
      icon: DollarSign,
    },
  ];

  const chartData = [
    {
      month: "Occupancy",
      current: dashboardStats?.averageOccupancy || 0,
      previous: dashboardStats?.averageOccupancyVsLastMonth || 0,
    },

    {
      month: "Students",
      current: dashboardStats?.totalStudents || 0,
      previous: dashboardStats?.activeStudentsVsLastMonth || 0,
    },

    {
      month: "Issues",
      current: dashboardStats?.pendingIssues || 0,
      previous: dashboardStats?.pendingIssuesVsLastMonth || 0,
    },
  ];

  const recentAdditions = dashboardStats?.recentAdditions || [];
  const regions = dashboardStats?.topPerformingRegions || [];

  const DashboardStatsApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getDashboardStatsApi();

      console.log("DASHBOARD STATS 👉", response);

      if (response?.data?.status === "success") {
        setDashboardStats(response?.data);

        setLoaderCheck(false);
      } else {
        toast.error("Failed to fetch dashboard data");

        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    DashboardStatsApi();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background text-foreground min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Institutional performance overview for the global hostel network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <CalendarDays className="w-4 h-4" />
            Last 30 Days
          </Button>

          {/* ✅ FIX: removed custom slate button */}
          <Button
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate("/superadmin/hostels/add")}
          >
            <Building2 className="w-4 h-4" />
            Add Hostel
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between mb-3">
                  {/* ✅ FIX: icon color */}
                  <Icon className="w-7 h-7 text-muted-foreground" />

                  {/* ✅ FIX: growth color */}
                  <span className="text-xs text-primary flex items-center gap-1">
                    {stat.change} <TrendingUp className="w-3 h-3" />
                  </span>
                </div>

                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </p>

                <p className="text-xl sm:text-2xl font-bold mt-1">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Network Capacity</p>

              <h2 className="text-2xl font-bold">
                {dashboardStats?.networkCapacity?.utilizedPercentage}%
              </h2>

              <p className="text-sm text-muted-foreground">
                Total Beds: {dashboardStats?.networkCapacity?.totalBeds}
              </p>
            </div>

            <Building2 className="w-8 h-8 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm sm:text-base">
              Revenue Trends
            </CardTitle>
          </CardHeader>

          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="currentColor" />
                <YAxis hide />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="current"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm sm:text-base">
              Recent Additions
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {recentAdditions.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">{item?.hostelName}</p>

                    <p className="text-xs text-muted-foreground">
                      {item?.address}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={item?.status === "ACTIVE" ? "default" : "outline"}
                >
                  {item?.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle className="text-sm sm:text-base">
            Top Performing Regions
          </CardTitle>

          <Button variant="outline" size="sm" className="text-xs">
            <Filter className="w-3 h-3 mr-1" />
            Filter
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr>
                  {/* ✅ FIX: all headers */}
                  <th className="text-left text-xs text-muted-foreground pb-3">
                    REGION
                  </th>
                  <th className="text-left text-xs text-muted-foreground pb-3">
                    HOSTELS
                  </th>
                  <th className="text-left text-xs text-muted-foreground pb-3">
                    OCCUPANCY
                  </th>
                  <th className="text-left text-xs text-muted-foreground pb-3">
                    REVENUE
                  </th>
                  <th className="text-left text-xs text-muted-foreground pb-3">
                    GROWTH
                  </th>
                </tr>
              </thead>

              <tbody>
                {regions.map((region) => (
                  <tr key={region.region} className="border-t border-border">
                    <td className="py-3 text-sm">{region.region}</td>
                    <td className="py-3 text-sm">{region.hostels}</td>
                    <td className="py-3 text-sm">{region.occupancy}%</td>
                    <td className="py-3 text-sm">₹ {region.revenue}</td>
                    {/* ✅ FIX: growth color */}
                    <td className="py-3 text-primary text-sm">
                      {region.growth}%{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
