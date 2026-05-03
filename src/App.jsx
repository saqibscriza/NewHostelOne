import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import MainLayout from "../src/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";

// AUTH
import Login from "../src/features/auth/pages/Login";
import SignUp from "../src/features/auth/pages/SignUp";
import SelectHostelForm from "../src/features/auth/pages/HostelLogin";

// ADMIN
import AdminDashboard from "../src/features/admin/dashboard/pages/DashboardPage";
import StudentList from "../src/features/admin/students/pages/StudentList";
import Rooms from "../src/features/admin/rooms/pages/RoomsCategory/Rooms";
import RoomDetails from "../src/features/admin/rooms/pages/RoomsDetails/RoomDetails";
import AddRoom from "../src/features/admin/rooms/pages/RoomsDetails/AddRoom";
import EditRoom from "../src/features/admin/rooms/pages/RoomsDetails/EditRoom";

import FeesPage from "../src/features/admin/fees/pages/FeesPage";
import CollectFeePage from "../src/features/admin/fees/pages/CollectFeePage";
import GenerateReceiptPage from "../src/features/admin/fees/pages/GenerateReceiptPage";
import PaymentHistoryPage from "../src/features/admin/fees/pages/PaymentHistoryPage";

import StaffManagement from "../src/features/admin/staff/pages/StaffManagement";
import AddStaffPage from "../src/features/admin/staff/pages/AddStaffPage";
import EditStaffPage from "../src/features/admin/staff/pages/EditStaffPage";

import AccountSettingPage from "../src/features/admin/setting/pages/AccountSettingPage";
import SupportPage from "../src/features/admin/support/pages/Supportpage";
import TicketViewPage from "../src/features/admin/support/pages/TicketViewPage";

// USER

// USER IMPORTS (FIXED)
import UserDashboard from "./features/user-registration/Dashboard/Dashboard";
import Hostels from "./features/user-registration/Hostels/Hostel";
import MyRoom from "./features/user-registration/MyRoom/MyRoom";
import Mess from "./features/user-registration/Mess/Mess";
import Fees from "./features/user-registration/Fees/Fees";
import Profile from "./features/user-registration/Profile/Profile";
import Support from "./features/user-registration/Support/Support";

// SUPER ADMIN
import SuperAdminDashboard from "../src/features/super-admin/dashboard/pages/Dashboard";
import Hostel from "../src/features/super-admin/hostels/pages/HostelList";
import HostelView from "../src/features/super-admin/hostels/pages/HostelView";
import AddHostel from "../src/features/super-admin/hostels/pages/AddHostel";
import UpdateHostel from "../src/features/super-admin/hostels/pages/UpdateHostel";

import PackageList from "../src/features/super-admin/packages/pages/PackageList";
import AddNewPackage from "../src/features/super-admin/packages/pages/AddnewPackage";
import EditnewPackage from "../src/features/super-admin/packages/pages/EditnewPackage";

import Report from "../src/features/super-admin/report/pages/ReportPage";
import Notifications from "../src/features/super-admin/settings/pages/SettingsPage";

export default function AppRoutes() {
  const { role } = useAuth();

  if (!role) {
    return (
      <Routes>
        <Route path="/select-hostel" element={<SelectHostelForm />} />
        <Route path="*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* ================= ADMIN ================= */}
        {role === "admin" && (
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="rooms/details" element={<RoomDetails />} />
            <Route path="rooms/add" element={<AddRoom />} />
            <Route path="rooms/edit/:id" element={<EditRoom />} />
            <Route path="fees" element={<FeesPage />} />
            <Route path="fees/collect" element={<CollectFeePage />} />
            <Route path="fees/receipt" element={<GenerateReceiptPage />} />
            <Route path="fees/history" element={<PaymentHistoryPage />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="staff/add" element={<AddStaffPage />} />
            <Route path="staff/edit/:id" element={<EditStaffPage />} />
            <Route path="settings" element={<AccountSettingPage />} />
            <Route path="support" element={<SupportPage />} />
            <Route path="support/:id" element={<TicketViewPage />} />
          </Route>
        )}

        {/* ================= SUPERADMIN ================= */}
        {role === "superadmin" && (
          <Route path="/superadmin" element={<MainLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="hostels" element={<Hostel />} />
            <Route path="hostels/:id" element={<HostelView />} />
            <Route path="hostels/add" element={<AddHostel />} />
            <Route path="hostels/update/:id" element={<UpdateHostel />} />
            <Route path="packages" element={<PackageList />} />
            <Route path="packages/add" element={<AddNewPackage />} />
            <Route path="packages/edit/:id" element={<EditnewPackage />} />
            <Route path="reports" element={<Report />} />
            <Route path="settings" element={<Notifications />} />
          </Route>
        )}

        {/* ================= USER ================= */}
        {role === "user" && (
          <Route path="/user" element={<MainLayout />}>
            <Route index element={<UserDashboard />} />
            <Route path="hostels" element={<Hostels />} /> {/* ✅ FIX */}
            <Route path="room" element={<MyRoom />} />
            <Route path="mess" element={<Mess />} />
            <Route path="fees" element={<Fees />} />
            <Route path="support" element={<Support />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        )}

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to={`/${role}`} replace />} />
      </Routes>
    </>
  );
}
