import React, { useCallback, useEffect, useState } from "react";
import {
  Edit3,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  Shield,
  KeyRound,
  User,
  Building2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { getAdminProfileApi, changePasswordApi } from "../../../../utils/utils";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../../context/AuthContext";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase() || "A";
};

const pickFirst = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ||
  "";

const normalizeAdminProfile = (data = {}) => {
  const admin = data?.data || data?.admin || data?.profile || data?.adminData || data;
  const personalDetails = data?.personalDetails || {};

  return {
    name: pickFirst(admin?.name, admin?.fullName, admin?.adminName),
    role: pickFirst(admin?.role, admin?.roleName, admin?.designation, "Admin"),
    photo: pickFirst(admin?.image, admin?.photo, admin?.profileImage),
    email: pickFirst(personalDetails?.email, admin?.email, admin?.adminEmail),
    phone: pickFirst(personalDetails?.phone, admin?.phone, admin?.adminPhone),
    address: pickFirst(
      personalDetails?.address,
      admin?.address,
      admin?.adminAddress,
    ),
    dateOfJoining: pickFirst(
      personalDetails?.dateOfJoining,
      admin?.dateOfJoining,
      admin?.joiningDate,
      admin?.dateOfBirth,
    ),
    adminId: pickFirst(personalDetails?.adminId, admin?.id, admin?.adminId, admin?._id),
    staffCount: pickFirst(admin?.staffCount, data?.profile?.staffCount, 0),
    studentsCount: pickFirst(
      admin?.studentsCount,
      data?.profile?.studentsCount,
      0,
    ),
    passwordLastChangedText: pickFirst(
      data?.security?.passwordLastChangedText,
      "Keep your password updated for better security.",
    ),
  };
};

const DetailItem = ({ icon, label, value }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {React.createElement(icon, { className: "h-3.5 w-3.5" })}
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
  const { userPhoto, updateUserProfile } = useAuth();

  const navigate = useNavigate();
  const [openPasswordModal, setOpenPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const AdminProfileApi = useCallback(async () => {
    setLoader(true);

    try {
      const response = await getAdminProfileApi();
      console.log('my profile update data by id0-0-0-0-0-',response)

      console.log("ADMIN PROFILE =>", response);

      if (response?.status === 200) {
        const adminProfile = normalizeAdminProfile(response?.data);

        setProfileData(response?.data);
        updateUserProfile({
          name: adminProfile.name,
          ...(adminProfile.photo ? { photo: adminProfile.photo } : {}),
        });
        setLoader(false);
      } else {
        setLoader(false);
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  }, [updateUserProfile]);

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (!passwordData.newPassword.trim()) {
      toast.error("New password is required");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await changePasswordApi({
        oldPassword: passwordData.currentPassword,
        password: passwordData.newPassword,
      });

      console.log("CHANGE PASSWORD RESPONSE =>", response);

      if (response?.status === 200) {
        toast.success(
          response?.data?.message || "Password updated successfully",
        );

        // CLOSE MODAL
        setOpenPasswordModal(false);

        // RESET FIELDS
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response?.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    queueMicrotask(AdminProfileApi);
  }, [AdminProfileApi]);

  if (loader) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }
  const adminProfile = normalizeAdminProfile(profileData);
  const profilePhoto = adminProfile.photo || userPhoto;

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
                <div className="mb-6 h-28 w-28 overflow-hidden rounded-full border border-border bg-muted">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-foreground">
                      {getInitials(adminProfile.name)}
                    </div>
                  )}
                </div>

                <h2 className="text-3xl font-semibold text-foreground">
                  {adminProfile.name || "Admin"}
                </h2>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                  {adminProfile.role}
                </p>

                <div className="mt-8 grid w-full grid-cols-2 divide-x divide-border rounded-2xl border border-border bg-muted/35">
                  <div className="px-4 py-5">
                    <p className="text-3xl font-bold text-foreground">
                      {adminProfile.staffCount}
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      Staff
                    </p>
                  </div>
                  <div className="px-4 py-5">
                    <p className="text-3xl font-bold text-foreground">
                      {adminProfile.studentsCount}
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
                  {profileData?.activityTimeline?.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-foreground" />
                        <span className="mt-2 h-full w-px bg-border" />
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-medium leading-6 text-foreground">
                          {item.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {item.timeAgo}
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
                    value={adminProfile.email || "Not Available"}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Phone Number"
                    value={adminProfile.phone || "Not Available"}
                  />
                  <div className="md:col-span-2">
                    <DetailItem
                      icon={MapPin}
                      label="Address Details"
                      value={adminProfile.address || "Not Available"}
                    />
                  </div>
                  <DetailItem
                    icon={CalendarDays}
                    label="Date Of Joining"
                    value={
                      adminProfile.dateOfJoining ||
                      "Not Available"
                    }
                  />
                  <DetailItem
                    icon={Building2}
                    label="Admin ID"
                    value={
                      adminProfile.adminId || "Not Available"
                    }
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
                        {adminProfile.passwordLastChangedText}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setOpenPasswordModal(true)}
                  >
                    Change Password
                  </Button>{" "}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Dialog open={openPasswordModal} onOpenChange={setOpenPasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Change Password
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>

              <Input
                type="password"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>

              <Input
                type="password"
                placeholder="Enter new password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
              />

              <p className="text-xs text-muted-foreground">
                Password must be at least 8 characters long.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Confirm New Password
              </label>

              <Input
                type="password"
                placeholder="Re-type new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setOpenPasswordModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleChangePassword}>
                Update Password
              </Button>{" "}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
