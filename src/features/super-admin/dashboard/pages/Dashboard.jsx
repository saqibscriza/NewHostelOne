import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
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

const statsCards = [
  { label: "TOTAL HOSTELS", value: "128", change: "+5.4%", icon: Building2 },
  { label: "TOTAL ADMINS", value: "42", change: "+2.1%", icon: Users },
  {
    label: "TOTAL STUDENTS",
    value: "3,450",
    change: "+12.8%",
    icon: GraduationCap,
  },
  {
    label: "TOTAL REVENUE",
    value: "₹ 1,20,000",
    change: "+8.2%",
    icon: DollarSign,
  },
];

const chartData = [
  { month: "Jan", current: 30, previous: 20 },
  { month: "Feb", current: 60, previous: 35 },
  { month: "Mar", current: 45, previous: 50 },
  { month: "Apr", current: 70, previous: 40 },
  { month: "May", current: 55, previous: 60 },
  { month: "Jun", current: 80, previous: 45 },
];

const recentAdditions = [
  {
    name: "Green Valley",
    location: "Noida (UP)",
    status: "ACTIVE",
    img: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=40&h=40&fit=crop",
  },
  {
    name: "Urban Living",
    location: "Ghaziabad (UP)",
    status: "ACTIVE",
    img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=40&h=40&fit=crop",
  },
  {
    name: "Nordic Heights",
    location: "New Delhi (Delhi)",
    status: "PENDING",
    img: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=40&h=40&fit=crop",
  },
  {
    name: "Alpine Lodge",
    location: "Mumbai (MH)",
    status: "ACTIVE",
    img: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=40&h=40&fit=crop",
  },
];

const regions = [
  {
    name: "North India",
    hostels: 54,
    occupancy: 92,
    revenue: "₹5,80,200",
    growth: "+12.4%",
  },
  {
    name: "South India",
    hostels: 32,
    occupancy: 88,
    revenue: "₹3,40,500",
    growth: "+8.1%",
  },
  {
    name: "East India",
    hostels: 28,
    occupancy: 76,
    revenue: "₹2,10,000",
    growth: "+4.2%",
  },
  {
    name: "Central India",
    hostels: 14,
    occupancy: 94,
    revenue: "₹1,20,400",
    growth: "+15.7%",
  },
];

export default function Dashboard() {
  const navigate = useNavigate();

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
            onClick={() => navigate("/hostels/add")}
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
            {recentAdditions.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={item.img}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.location}
                    </p>
                  </div>
                </div>

                <Badge
                  variant={item.status === "ACTIVE" ? "default" : "outline"}
                >
                  {item.status}
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
                  <tr key={region.name} className="border-t border-border">
                    <td className="py-3 text-sm">{region.name}</td>
                    <td className="py-3 text-sm">{region.hostels}</td>
                    <td className="py-3 text-sm">{region.occupancy}%</td>
                    <td className="py-3 text-sm">{region.revenue}</td>

                    {/* ✅ FIX: growth color */}
                    <td className="py-3 text-primary text-sm">
                      {region.growth}
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
