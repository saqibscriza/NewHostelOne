import React from "react";
import {
  MapPin,
  Pencil,
  BedDouble,
  Award,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/Card";
import { Badge } from "../../../../components/ui/Badge";

import { useState, useEffect } from "react";
import { getHostelById } from "../../../../utils/utils";
import { useParams } from "react-router-dom";

export default function HostelView() {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    const fetchHostel = async () => {
      const res = await getHostelById(hostelId);

      if (res?.data) {
        const data = res.data;

        const formatted = {
          hostelId: data.hostelId,
          name: data.hostelName,
          address: data.address,
          status: data.status,
          image: data.hostelImages,
          type: data.hostelType,

          packageName: data.packageName,
          messEnabled: data.messEnabled,
          inventoryEnabled: data.inventoryEnabled,

          admin: data.adminDetails,

          staff: data.activeStaff,

          occupancy: data.occupancy,
        };

        setHostel(formatted);
      }
    };

    fetchHostel();
  }, [hostelId]);
  if (!hostel) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-8">
      {/* Header */}
      <Card className="mb-6 rounded-2xl">
        <CardContent className="p-6 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="relative h-24 w-24 rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
              {hostel.image ? (
                <img
                  src={hostel.image}
                  alt="hostel"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No Image</span>
              )}
              <CheckCircle2 className="h-5 w-5 text-primary absolute -bottom-2 -right-2" />
            </div>

            <div>
              <h1 className="text-2xl font-bold">{hostel.name}</h1>
              {/* Hostel Name */}
              <Badge>{hostel.status ? "Active" : "Inactive"}</Badge>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{hostel.address}</span> {/* Hostel Address */}
              </div>
            </div>
          </div>

          <Button
          onClick={() =>
          navigate(`/superadmin/hostels/update/${hostel.hostelId}`)
          }
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <BedDouble />
                  </div>

                  <span className="text-sm text-primary">+2.4%</span>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Occupancy Rate
                </p>

                <div className="flex items-center gap-2 mt-1">
                  <span className="text-4xl font-bold">
                    {hostel.occupancy?.occupancyPercentage || 0}%
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {hostel.occupancy?.occupiedBeds || 0}/
                    {hostel.occupancy?.totalBeds || 0} Beds
                  </span>
                </div>

                <div className="mt-4 h-2 bg-muted rounded-full">
                  <div
                    className="h-full bg-primary rounded-full w-[85%]"
                    style={{
                      width: `${hostel.occupancy?.occupancyPercentage || 0}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <Award />
                  </div>

                  <span className="text-sm text-muted-foreground">
                    Renewal in 45 days
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mt-4">
                  Active Package
                </p>

                <p className="text-3xl font-bold mt-1">
                  {hostel.packageName || "N/A"}
                </p>

                {/* <p className="text-sm text-muted-foreground mt-2">
                  Mess: {hostel.messEnabled ? "Yes" : "No"} | Inventory:{" "}
                  {hostel.inventoryEnabled ? "Yes" : "No"}
                </p> */}

                <p className="text-sm text-muted-foreground mt-2">
                  Enterprise access enabled
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Admin */}
          <Card>
            <CardHeader className="flex justify-between">
              <CardTitle>Primary Admin</CardTitle>

              <Button variant="ghost">Manage</Button>
            </CardHeader>

            <CardContent className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Name</p>
                <p>{hostel.admin?.adminName || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase">Email</p>
                <p>{hostel.admin?.adminEmail || "N/A"}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase">Phone</p>
                <p>{hostel.admin?.adminPhone || "N/A"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Staff */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              {["Anjali", "Priya", "Vikram"].map((name, i) => (
                <div
                  key={i}
                  className="flex justify-between p-4 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="text-sm text-muted-foreground">Staff</p>
                  </div>

                  <Badge>Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle>Staff Members</CardTitle>
            </CardHeader>

            <CardContent className="divide-y divide-border">
              {hostel.staff && hostel.staff.length > 0 ? (
                hostel.staff.map((staff, i) => (
                  <div
                    key={i}
                    className="flex justify-between p-4 hover:bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{staff.name || "No Name"}</p>
                      <p className="text-sm text-muted-foreground">
                        {staff.role || "Staff"}
                      </p>
                    </div>

                    <Badge>{staff.status ? "Active" : "Inactive"}</Badge>
                  </div>
                ))
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No Staff Available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* Map */}
          <Card>
            <CardHeader>
              <CardTitle>Location</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-40 bg-muted rounded-lg" />
              <Button className="w-full mt-4" variant="secondary">
                Open in Maps
              </Button>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Subscription renewed
              </p>
              <p className="text-muted-foreground text-sm">Staff added</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
