import React from "react";
import {
  Building2,
  Users,
  BarChart2,
  Archive,
  TrendingUp,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/DropdownMenu";

import { useState, useEffect } from "react";
import { getAllHostelDetailsApi } from "../../../../utils/utils";
import { deleteHostelById } from "../../../../utils/utils";

const StatusBadge = ({ status }) => {
  let dotColor = "bg-primary";
  let textColor = "text-foreground";
  let bgColor = "bg-muted";

  if (status === "Under Maintenance") {
    dotColor = "bg-primary";
    textColor = "text-foreground";
    bgColor = "bg-muted";
  } else if (status === "Pending") {
    dotColor = "bg-muted-foreground";
    textColor = "bg-primary";
    bgColor = "bg-muted";
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bgColor} ${textColor}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status}
    </span>
  );
};

export default function Hostel() {
  const navigate = useNavigate();
  const [hostelsData, setHostelsData] = useState([]);

  const [stats, setStats] = useState([]);

  // ******** Delete Hostel ********* //
  const handleDelete = async (hostelId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hostel?",
    );
    if (!confirmDelete) return;
    const res = await deleteHostelById(hostelId);
    if (res?.data?.status === "success") {
      // ✅ UI se remove karo (no reload)
      setHostelsData((prev) =>
        prev.filter((item) => item.hostelId !== hostelId),
      );
    } else {
      alert("Failed to delete hostel");
    }
  };

  //********* Get All Hostel ********* */
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await getAllHostelDetailsApi();

        // ✅ Hostels Mapping
        if (res?.data?.hostels) {
          const formattedData = res.data.hostels.map((item, index) => ({
            id: index,
            hostelId: item.hostelId,
            name: item.hostelName,
            location: item.address || "N/A",

            admin: item.adminInCharge
              ? {
                  name: item.adminInCharge.adminName,
                  avatar:
                    item.adminInCharge.adminPhoto ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.adminInCharge.adminName}`,
                }
              : null,

            students: item.totalStudents || 0,
            occupancy: item.occupancyPercentage || 0,
            status: item.status || "Inactive",
          }));

          setHostelsData(formattedData);
        }

        // ✅ Stats Mapping
        if (res?.data?.dashboardStats) {
          const statsData = res.data.dashboardStats;

          setStats([
            {
              title: "TOTAL HOSTELS",
              value: statsData.totalHostels,
              icon: Building2,
            },
            {
              title: "ACTIVE STUDENT",
              value: statsData.activeStudents,
              icon: Users,
            },
            {
              title: "AVERAGE OCCUPANCY",
              value: `${statsData.averageOccupancy}%`,
              icon: BarChart2,
            },
            {
              title: "PENDING ISSUES",
              value: statsData.pendingIssues,
              icon: Archive,
            },
          ]);
        }
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    // ✅ function call
    fetchHostels();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hostels</h1>
          <p className="mt-2 text-base text-foreground">
            Manage hostel entities and assign primary administrators.
          </p>
        </div>

        <Button
          className="gap-2"
          onClick={() => navigate("/superadmin/hostels/add")}
        >
          <Plus className="w-4 h-4" />
          Add Hostel
        </Button>
      </div>

      {/* Stats Row */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-none shadow-sm rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                    {stat.change}
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    {stat.title}
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    {stat.value}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Data Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-card">
              <tr>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Hostel Name
                </th>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Location
                </th>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Admin In-Charge
                </th>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Total Students
                </th>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Occupancy %
                </th>
                <th className="px-6 py-5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Status
                </th>
                <th className="px-6 py-5 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {hostelsData.map((hostel) => (
                <tr
                  key={hostel.id}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <span className="font-bold text-foreground">
                        {hostel.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-muted-foreground whitespace-pre-line leading-relaxed">
                    {hostel.location}
                  </td>
                  <td className="px-6 py-5">
                    {hostel.admin ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={hostel.admin.avatar}
                          alt={hostel.admin.name}
                          className="h-8 w-8 rounded-full border border-border object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-medium text-foreground">
                          {hostel.admin.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-5 font-medium text-foreground">
                    {hostel.students}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${hostel.occupancy}%` }}
                        />
                      </div>
                      <span className="font-bold text-foreground">
                        {hostel.occupancy}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={hostel.status} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 "
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-32 rounded-xl border-border shadow-sm bg-card"
                      >
                        <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                          onClick={() =>
                             navigate(`/superadmin/hostels/${hostel.hostelId}`)
                          }
                        >
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                          onClick={() =>
                            navigate(`/superadmin/hostels/update/${hostel.hostelId}`)
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer text-muted-foreground focus:bg-accent focus:text-foreground"
                          onClick={() => handleDelete(hostel.hostelId)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
          <span className="text-sm text-muted-foreground">
            Showing 1 to 4 of 24 hostels
          </span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-8 w-8  text-white  bg-muted">
              1
            </Button>
            <Button variant="ghost" className="h-8 w-8 text-muted-foreground">
              2
            </Button>
            <Button variant="ghost" className="h-8 w-8 text-muted-foreground">
              3
            </Button>
            <span className="px-2 ">...</span>
            <Button variant="ghost" className="h-8 w-8 text-muted-foreground">
              6
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 ">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
