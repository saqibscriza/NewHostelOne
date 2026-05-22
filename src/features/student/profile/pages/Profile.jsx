import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Edit2,
  Shield,
  Lock,
  Smartphone,
  Camera,
  Users,
  MonitorSmartphone,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { getStudentProfileApi, changePasswordApi } from "../../../../utils/utils";

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    emergencyContacts: [],
    accountSecurity: {},
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }
    try {
      setPasswordLoading(true);
      const res = await changePasswordApi({
        oldPassword: passwordForm.oldPassword,
        password: passwordForm.password,
      });

      if (res?.data?.status === "success" || res?.status === 200) {
        toast.success(res?.data?.message || res?.data || "Password changed successfully");
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: "", password: "", confirmPassword: "" });
      } else {
        toast.error(res?.data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

    const contacts = Array.isArray(profile.emergencyContacts)
    ? profile.emergencyContacts
    : profile.emergencyContacts
    ? [profile.emergencyContacts]
    : [];

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getStudentProfileApi();
    if (res?.status === "success") {
      setProfile(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Profile Details
          </h1>
          <p className="text-gray-500 mt-1">
            View and update your personal information, contact details, and
            profile settings
          </p>
        </div>
        <Button
          onClick={() =>
            navigate("/student/profile/edit", {
              state: { studentId: profile.studentId },
            })
          }
          className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Edit2 className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
<img
  src={
    profile?.photo ||
    profile?.profileImage ||
    `https://api.dicebear.com/7.x/notionists/svg?seed=${profile?.name || "Student"}&backgroundColor=0f172a`
  }
  alt="Profile"
  className="w-full h-full object-cover"
/>
              </div>
              {/* <div className="absolute bottom-0 right-1 bg-slate-900 p-2 rounded-full border-2 border-white shadow-sm text-white">
                <Camera className="w-3.5 h-3.5" />
              </div> */}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.name}
            </h2>
            <p className="text-xs font-bold text-gray-900 tracking-widest uppercase mt-1">
              {profile.course}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
              {profile.status}
            </div>
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Personal Information
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Date of Birth
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.dateOfBirth}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Gender
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.gender}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Contact Number
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.contactNumber}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Current Address
                </p>
                <p className="font-semibold text-gray-900 mt-1 leading-relaxed">
                  {profile.currentAddress}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Academic Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                />
              </svg>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Academic Details
              </h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Student ID
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.studentId}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  University Email
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.email}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Major Course
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {profile.course}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Enrollment Date
                </p>
                <p className="font-semibold text-gray-900 mt-1">
                  {" "}
                  {profile.joiningDate || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6">
            Emergency Contacts
          </h3>

          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className="bg-gray-50 p-3 rounded-xl text-slate-800">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[15px]">
                    {contact.name}
                  </p>
                  <p className="text-xs text-gray-500 mb-1">
                    {contact.relationship}
                  </p>
                  <p className="text-sm text-gray-500 font-medium">
                    +91 {contact.contactNumber}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6">
            Account Security
          </h3>

          <div className="space-y-6">
            {/* Option 1 */}
            <div 
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => setIsPasswordModalOpen(true)}
            >
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 group-hover:bg-gray-100 transition-colors p-3 rounded-full text-slate-500">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[14px]">
                    Change Password
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Last updated {profile.accountSecurity?.passwordLastUpdated || "recently"}
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>

            {/* Option 2 */}
            <div className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="bg-gray-50 group-hover:bg-gray-100 transition-colors p-3 rounded-full text-slate-500">
                  <MonitorSmartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-[14px]">
                    Login Activity
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {profile.accountSecurity?.activeSessions} Active Sessions
                  </p>
                </div>
              </div>
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordChange} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="oldPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Password</Label>
              <div className="relative">
                <Input
                  id="oldPassword"
                  type={showOldPassword ? "text" : "password"}
                  required
                  value={passwordForm.oldPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      oldPassword: e.target.value,
                    }))
                  }
                  className="pr-10 h-11"
                  placeholder="Enter Current Password"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showOldPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={passwordForm.password}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  className="pr-10 h-11"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-gray-500 uppercase tracking-widest">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                  className="pr-10 h-11"
                  placeholder="Re-type new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-between gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={passwordLoading} className="flex-1 h-11 bg-black hover:bg-gray-900 text-white font-medium">
                {passwordLoading ? "Saving..." : "Update Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
