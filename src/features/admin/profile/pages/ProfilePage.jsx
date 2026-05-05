import React, { useEffect, useState } from "react";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Shield,
  BellRing,
  KeyRound,
  User,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Switch } from "../../../../components/ui/switch";
import { getAdminProfileApi } from "../../../../utils/utils";

const timelineItems = [
  {
    title: "Approved 5 new room bookings",
    time: "2 hours ago",
    tone: "bg-foreground",
  },
  {
    title: "Updated fee structure for E3",
    time: "Yesterday, 4:15 PM",
    tone: "bg-amber-500",
  },
  {
    title: "System backup successful",
    time: "Oct 12, 10:00 AM",
    tone: "bg-muted-foreground/40",
  },
];

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </div>
    <p className="text-sm font-medium leading-6 text-foreground sm:text-base">
      {value}
    </p>
  </div>
);

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [emailNotifications, setEmailNotifications] = useState(true);

  const AdminProfileApi = async () => {
    setLoader(true);

    try {
      const response = await getAdminProfileApi();

      console.log("ADMIN PROFILE =>", response);

      if (response?.status === 200) {
        setProfileData(response?.data);
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    AdminProfileApi();
  }, []);

  if (loader) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Profile Details
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              View and manage your account information, preferences, and
              security settings.
            </p>
          </div>

          <Button
            className="gap-2 self-start sm:self-auto"
            onClick={() => navigate("/admin/profile/edit")}
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground">
                  <User className="h-12 w-12" />
                </div>

                <h2 className="text-3xl font-semibold text-foreground">
                  {profileData?.profile?.name}
                </h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {profileData?.profile?.role}
                </p>

                <div className="mt-8 grid w-full grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-muted/35">
                  <div className="px-4 py-5">
                    <p className="text-3xl font-bold text-foreground">
                      {profileData?.profile?.staffCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Staff
                    </p>
                  </div>
                  <div className="px-4 py-5">
                    <p className="text-3xl font-bold text-foreground">
                      {profileData?.profile?.studentsCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  Activity Timeline
                </p>

                <div className="mt-6 space-y-6">
                  {timelineItems.map((item) => (
                    <div key={item.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`mt-1 h-2.5 w-2.5 rounded-full ${item.tone}`}
                        />
                        <span className="mt-2 h-full w-px bg-border" />
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-medium leading-6 text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Personal Details
                  </h3>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <DetailItem
                    icon={Mail}
                    label="Email Address"
                    value={profileData?.personalDetails?.email}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Phone Number"
                    value={profileData?.personalDetails?.phone}
                  />
                  <div className="md:col-span-2">
                    <DetailItem
                      icon={MapPin}
                      label="Address Details"
                      value={profileData?.personalDetails?.address}
                    />
                  </div>
                  <DetailItem
                    icon={CalendarDays}
                    label="Date Of Joining"
                    value={"Not Available"}
                  />
                  <DetailItem
                    icon={Building2}
                    label="Admin ID"
                    value={"Not Available"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <BellRing className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Account Settings
                  </h3>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-background p-3 text-muted-foreground shadow-sm">
                      <BellRing className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground">
                        Email Notifications
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Receive weekly reports and system alerts.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </CardContent>
            </Card> */}

            <Card className="border-border bg-card shadow-sm">
              <CardContent className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-2 text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">
                    Security
                  </h3>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/35 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-background p-3 text-muted-foreground shadow-sm">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-medium text-foreground">
                        Password Management
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {profileData?.security?.passwordLastChangedText}
                      </p>
                    </div>
                  </div>

                  <Button variant="outline">Change Password</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
