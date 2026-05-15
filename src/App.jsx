import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
// import { useSearchParams } from "react-router-dom";
// AUTH
import Login from "./features/auth/pages/Login";
import SignUp from "./features/auth/pages/SignUp";
import SelectHostelForm from "./features/auth/pages/HostelLogin";
import RegisterHostel from "./features/auth/pages/RegisterHostel";
import ForgotPassword from "./features/auth/pages/ForgotPassword";
import VerifyOTP from "./features/auth/pages/VerifyOTP";
import ResetPassword from "./features/auth/pages/ResetPassword";
import PasswordUpdated from "./features/auth/pages/PasswordUpdated";

// ADMIN 
import AdminDashboard from "./features/admin/dashboard/pages/DashboardPage";
import StudentList from "./features/admin/students/pages/StudentList";
import Rooms from "./features/admin/rooms/pages/RoomsCategory/Rooms";
import RoomDetails from "./features/admin/rooms/pages/RoomsDetails/RoomDetails";
import AddRoom from "./features/admin/rooms/pages/RoomsDetails/AddRoom";
import EditRoom from "./features/admin/rooms/pages/RoomsDetails/EditRoom";

import FeesPage from "./features/admin/fees/pages/FeesPage";
import CollectFeePage from "./features/admin/fees/pages/CollectFeePage";
import GenerateReceiptPage from "./features/admin/fees/pages/GenerateReceiptPage";
import PaymentHistoryPage from "./features/admin/fees/pages/PaymentHistoryPage";

import StaffManagement from "./features/admin/staff/pages/StaffManagement";
import AddStaffPage from "./features/admin/staff/pages/AddStaffPage";
import EditStaffPage from "./features/admin/staff/pages/EditStaffPage";

import AccountSettingPage from "./features/admin/setting/pages/AccountSettingPage";
import SupportPage from "./features/admin/support/pages/SupportPage";
import TicketViewPage from "./features/admin/support/pages/TicketViewPage";

import AddStudent from "./features/admin/students/pages/AddStudent";
import ViewStudent from "./features/admin/students/pages/ViewStudent";
import EditStudent from "./features/admin/students/pages/EditStudent";

import AdminProfilePage from "./features/admin/profile/pages/ProfilePage";
import AdminEditProfilePage from "./features/admin/profile/pages/EditProfilePage";

import AdminPackagePage from "./features/admin/packages/pages/PackagePage";

import AdminNoticesPage from "./features/admin/notices/pages/NoticesPage";
import AdminCreateNoticePage from "./features/admin/notices/pages/CreateNoticePage";
import AdminEditNoticePage from "./features/admin/notices/pages/EditNoticePage";
import AddNewHostel from "./features/admin/Hostel/AddNewHostel";
import QueriesDetails from "./features/admin/Queries/QueriesDetails";

// STUDENT IMPORTS
import MyDashboard from "./features/student/Dashboard/My_Dashboard";
import MyRoom from "./features/student/My_Room/MyRoom";
import StudentMess from "./features/student/mess/pages/Mess";
import StudentFees from "./features/student/fees/pages/Fees";
import StudentPayment from "./features/student/fees/pages/Payment";
import StudentSupport from "./features/student/support/pages/Support";
import StudentSupportAddRequest from "./features/student/support/pages/AddRequest";
import StudentSupportChat from "./features/student/support/pages/TicketChat";
import StudentProfile from "./features/student/profile/pages/Profile";
import StudentProfileEdit from "./features/student/profile/pages/ProfileEdit";
import StudentNotice from "./features/student/StudentNotice";
// SUPER ADMIN
import SuperAdminDashboard from "./features/super-admin/dashboard/pages/Dashboard";

import Hostel from "./features/super-admin/hostels/pages/HostelList";
import HostelView from "./features/super-admin/hostels/pages/HostelView";
import SuperAdminAddHostel from "./features/super-admin/hostels/pages/AddHostel";
import UpdateHostel from "./features/super-admin/hostels/pages/UpdateHostel";

import PackageList from "./features/super-admin/packages/pages/PackageList";
import AddNewPackage from "./features/super-admin/packages/pages/AddnewPackage";
import EditnewPackage from "./features/super-admin/packages/pages/EditnewPackage";

import Report from "./features/super-admin/report/pages/ReportPage";
import Notifications from "./features/super-admin/settings/pages/SettingsPage";
import SuperAdminQueryDetails from "./features/super-admin/queries/pages/QueryDetails";

// CHEF
import ChefDashboard from "./features/chef/dashboard/pages/Dashboard";
import MenuPlanner from "./features/chef/Menu/MenuPlanner";
import InventoryDetailsPage from "./features/chef/inventory/pages/inventoryDetails/InventoryDetailsPage";
import InventoryCategoryPage from "./features/chef/inventory/pages/inventoryCategory/InventoryCategoryPage";
import AddStockPage from "./features/chef/inventory/pages/inventoryDetails/AddStockPage";
import AddCategoryPage from "./features/chef/inventory/pages/inventoryCategory/AddCategoryPage";
import AddCategoryItemPage from "./features/chef/inventory/pages/inventoryCategory/AddCategoryItemPage";
import CategoryDetailsPage from "./features/chef/inventory/pages/inventoryCategory/CategoryDetailsPage";
import EditCategoryPage from "./features/chef/inventory/pages/inventoryCategory/EditCategoryPage";
import EditCategoryItemPage from "./features/chef/inventory/pages/inventoryCategory/EditCategoryItemPage";
import FeedbackPage from "./features/chef/feedback/pages/FeedbackPage";
import NoticesPage from "../src/features/chef/notices/pages/NoticesPage";

export default function AppRoutes() {

  const { role } = useAuth();
  // const [searchParams] = useSearchParams();
  // const showRegisterHostel = searchParams.get("register") === "true";

  return (
    <>
      {/* {showRegisterHostel && <RegisterHostel />} */}

      <Toaster position="top-right" />

      {!role ? (
        <Routes>
          <Route path="/select-hostel" element={<SelectHostelForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register-hostel" element={<RegisterHostel />} />
           <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/password-updated" element={<PasswordUpdated />} />
          <Route path="*" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          {/* ================= ADMIN ================= */}
          {role === "admin" && (
            <Route path="/admin" element={<MainLayout />}>
              <Route index element={<AdminDashboard />} />

              <Route path="students" element={<StudentList />} />
              <Route path="students/add" element={<AddStudent />} />
              <Route path="students/view/:id" element={<ViewStudent />} />
              <Route path="students/edit/:id" element={<EditStudent />} />

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

              <Route path="queries/details" element={<QueriesDetails />} />

              <Route path="profile" element={<AdminProfilePage />} />
              <Route path="profile/edit" element={<AdminEditProfilePage />} />

              <Route path="notices" element={<AdminNoticesPage />} />
              <Route
                path="notices/create"
                element={<AdminCreateNoticePage />}
              />
              <Route
                path="notices/edit/:id"
                element={<AdminEditNoticePage />}
              />

              <Route path="packages" element={<AdminPackagePage />} />
              <Route path="hostel/add" element={<AddNewHostel />} />
            </Route>
          )}

          {/* ================= SUPER ADMIN ================= */}
          {role === "superadmin" && (
            <Route path="/superadmin" element={<MainLayout />}>
              <Route index element={<SuperAdminDashboard />} />

              <Route path="hostels" element={<Hostel />} />
              <Route path="hostels/:hostelId" element={<HostelView />} />
              <Route path="hostels/add" element={<SuperAdminAddHostel />} />
              <Route path="hostels/update/:id" element={<UpdateHostel />} />

              <Route path="packages" element={<PackageList />} />
              <Route path="packages/add" element={<AddNewPackage />} />
              <Route path="packages/edit/:id" element={<EditnewPackage />} />

              <Route path="reports" element={<Report />} />
              <Route
                path="queries/details"
                element={<SuperAdminQueryDetails />}
              />
              <Route path="settings" element={<Notifications />} />
            </Route>
          )}

          {/* ================= STUDENT ================= */}
          {role === "student" && (
            <Route path="/student" element={<MainLayout />}>
              <Route index element={<MyDashboard />} />
              <Route path="room" element={<MyRoom />} />
              <Route path="mess" element={<StudentMess />} />
              <Route path="fees" element={<StudentFees />} />
              <Route path="fees/pay" element={<StudentPayment />} />
              <Route path="support" element={<StudentSupport />} />
              <Route
                path="support/add"
                element={<StudentSupportAddRequest />}
              />
              <Route path="support/:id" element={<StudentSupportChat />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="profile/edit" element={<StudentProfileEdit />} />
              <Route path="notices" element={<StudentNotice />} />{" "}
            </Route>
          )}

          {/* ================= CHEF ================= */}
          {role === "chef" && (
            <Route path="/chef" element={<MainLayout />}>
              <Route index element={<ChefDashboard />} />

              <Route
                path="inventory"
                element={<Navigate to="/chef/inventory/details" replace />}
              />

              <Route path="menu" element={<MenuPlanner />} />

              <Route
                path="inventory/details"
                element={<InventoryDetailsPage />}
              />

              <Route path="inventory/details/add" element={<AddStockPage />} />

              <Route
                path="inventory/category"
                element={<InventoryCategoryPage />}
              />

              <Route
                path="inventory/category/add"
                element={<AddCategoryPage />}
              />

              <Route
                path="inventory/category/:categoryId/item/add"
                element={<AddCategoryItemPage />}
              />

              <Route
                path="inventory/category/:id"
                element={<CategoryDetailsPage />}
              />

              <Route
                path="inventory/category/:id/edit"
                element={<EditCategoryPage />}
              />

              <Route
                path="inventory/category/:categoryId/item/:itemId/edit"
                element={<EditCategoryItemPage />}
              />
              <Route path="notices" element={<NoticesPage />} />

              <Route path="feedback" element={<FeedbackPage />} />
            </Route>
          )}

          {/* DEFAULT */}
          <Route path="*" element={<Navigate to={`/${role}`} replace />} />
        </Routes>
      )}
    </>
  );
}
