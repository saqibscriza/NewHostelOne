// import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// import { useAuth } from "../src/context/AuthContext";
// import MainLayout from "../src/components/layout/MainLayout";
// import { Toaster } from "react-hot-toast";
// import { useSearchParams } from "react-router-dom";

// // AUTH
// import Login from "../src/features/auth/pages/Login";
// import SignUp from "../src/features/auth/pages/SignUp";
// import SelectHostelForm from "../src/features/auth/pages/HostelLogin";
// import RegisterHostel from "../src/features/auth/pages/RegisterHostel";

// // ADMIN
// import AdminDashboard from "../src/features/admin/dashboard/pages/DashboardPage";
// import StudentList from "../src/features/admin/students/pages/StudentList";
// import Rooms from "../src/features/admin/rooms/pages/RoomsCategory/Rooms";
// import RoomDetails from "../src/features/admin/rooms/pages/RoomsDetails/RoomDetails";
// import AddRoom from "../src/features/admin/rooms/pages/RoomsDetails/AddRoom";
// import EditRoom from "../src/features/admin/rooms/pages/RoomsDetails/EditRoom";

// import FeesPage from "../src/features/admin/fees/pages/FeesPage";
// import CollectFeePage from "../src/features/admin/fees/pages/CollectFeePage";
// import GenerateReceiptPage from "../src/features/admin/fees/pages/GenerateReceiptPage";
// import PaymentHistoryPage from "../src/features/admin/fees/pages/PaymentHistoryPage";

// import StaffManagement from "../src/features/admin/staff/pages/StaffManagement";
// import AddStaffPage from "../src/features/admin/staff/pages/AddStaffPage";
// import EditStaffPage from "../src/features/admin/staff/pages/EditStaffPage";

// import AccountSettingPage from "../src/features/admin/setting/pages/AccountSettingPage";
// import SupportPage from "../src/features/admin/support/pages/Supportpage";
// import TicketViewPage from "../src/features/admin/support/pages/TicketViewPage";

// import AddStudent from "../src/features/admin/students/pages/AddStudent";
// import ViewStudent from "../src/features/admin/students/pages/ViewStudent";
// import EditStudent from "../src/features/admin/students/pages/EditStudent";
// import AdminPackagePage from "../src/features/admin/packages/pages/PackagePage";
// import AdminNoticesPage from "../src/features/admin/notices/pages/NoticesPage";
// import AdminCreateNoticePage from "../src/features/admin/notices/pages/CreateNoticePage";
// import AdminEditNoticePage from "../src/features/admin/notices/pages/EditNoticePage";
// import QueriesDetails from "./features/admin/Queries/QueriesDetails";

// // USER
// // import UserDashboard from "./features/user-registration/Dashboard/Dashboard";
// // import Hostels from "./features/user-registration/Hostels/Hostel";
// // import HostelDetails from "./features/user-registration/Hostels/HostelDetails";
// // import MyRoom from "./features/user-registration/MyRoom/MyRoom";
// // import Mess from "./features/user-registration/Mess/Mess";
// // import Fees from "./features/user-registration/Fees/Fees";
// // import Profile from "./features/user-registration/Profile/Profile";
// // import Support from "./features/user-registration/Support/Support";
// // import BookingRequest from "./features/user-registration/Hostels/BookingRequest";
// // import RequestSuccess from "./features/user-registration/Hostels/RequestSuccess";

// // STUDENT IMPORTS
// import MyDashboard from "./features/student/dashboard/My_Dashboard";
// import MyRoom from "./features/student/My_Room/MyRoom";
// import StudentMess from "./features/student/mess/pages/Mess";
// import StudentFees from "./features/student/fees/pages/Fees";
// import StudentPayment from "./features/student/fees/pages/Payment";
// import StudentSupport from "./features/student/support/pages/Support";
// import StudentSupportAddRequest from "./features/student/support/pages/AddRequest";
// import StudentSupportChat from "./features/student/support/pages/TicketChat";
// import StudentProfile from "./features/student/profile/pages/Profile";
// import StudentProfileEdit from "./features/student/profile/pages/ProfileEdit";

// // SUPER ADMIN
// import SuperAdminDashboard from "../src/features/super-admin/dashboard/pages/Dashboard";
// import Hostel from "../src/features/super-admin/hostels/pages/HostelList";
// import HostelView from "../src/features/super-admin/hostels/pages/HostelView";
// import AddHostel from "../src/features/super-admin/hostels/pages/AddHostel";
// import UpdateHostel from "../src/features/super-admin/hostels/pages/UpdateHostel";

// import PackageList from "../src/features/super-admin/packages/pages/PackageList";
// import AddNewPackage from "../src/features/super-admin/packages/pages/AddnewPackage";
// import EditnewPackage from "../src/features/super-admin/packages/pages/EditnewPackage";

// import Report from "../src/features/super-admin/report/pages/ReportPage";
// import Notifications from "../src/features/super-admin/settings/pages/SettingsPage";

// // CHEF
// import ChefDashboard from "../src/features/chef/dashboard/pages/Dashboard";
// import InventoryDetailsPage from "../src/features/chef/inventory/pages/inventoryDetails/InventoryDetailsPage";
// import InventoryCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/InventoryCategoryPage";
// import AddStockPage from "../src/features/chef/inventory/pages/inventoryDetails/AddStockPage";
// import AddCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/AddCategoryPage";
// import CategoryDetailsPage from "../src/features/chef/inventory/pages/inventoryCategory/CategoryDetailsPage";
// import EditCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/EditCategoryPage";
// import EditCategoryItemPage from "../src/features/chef/inventory/pages/inventoryCategory/EditCategoryItemPage";
// import FeedbackPage from "../src/features/chef/feedback/pages/FeedbackPage";

// export default function AppRoutes() {
//   const { role } = useAuth();
//   const [searchParams] = useSearchParams();
//   const showRegisterHostel = searchParams.get("register") === "true";

//   return (
//     <>
//       {/* ✅ FIX: Always render modal */}
//       {showRegisterHostel && <RegisterHostel />}

//       <Toaster position="top-right" />

//       {!role ? (
//         <Routes>
//           <Route path="/select-hostel" element={<SelectHostelForm />} />
//           <Route path="*" element={<Login />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<SignUp />} />
//         </Routes>
//       ) : (
//         <Routes>
//           {/* ================= ADMIN ================= */}
//           {role === "admin" && (
//             <Route path="/admin" element={<MainLayout />}>
//               <Route index element={<AdminDashboard />} />
//               <Route path="students" element={<StudentList />} />
//               <Route path="rooms" element={<Rooms />} />
//               <Route path="rooms/details" element={<RoomDetails />} />
//               <Route path="rooms/add" element={<AddRoom />} />
//               <Route path="rooms/edit/:id" element={<EditRoom />} />
//               <Route path="fees" element={<FeesPage />} />
//               <Route path="fees/collect" element={<CollectFeePage />} />
//               <Route path="fees/receipt" element={<GenerateReceiptPage />} />
//               <Route path="fees/history" element={<PaymentHistoryPage />} />
//               <Route path="staff" element={<StaffManagement />} />
//               <Route path="staff/add" element={<AddStaffPage />} />
//               <Route path="staff/edit/:id" element={<EditStaffPage />} />
//               <Route path="settings" element={<AccountSettingPage />} />
//               <Route path="support" element={<SupportPage />} />
//               <Route path="support/:id" element={<TicketViewPage />} />
//               <Route path="students/add" element={<AddStudent />} />
//               <Route path="students/view/:id" element={<ViewStudent />} />
//               <Route path="students/edit/:id" element={<EditStudent />} />
//               <Route path="queries/details" element={<QueriesDetails />} />
//               <Route path="notices" element={<AdminNoticesPage />} />
//               <Route
//                 path="notices/create"
//                 element={<AdminCreateNoticePage />}
//               />
//               <Route
//                 path="notices/edit/:id"
//                 element={<AdminEditNoticePage />}
//               />
//               <Route path="packages" element={<AdminPackagePage />} />
//             </Route>
//           )}

//           {/* ================= SUPERADMIN ================= */}
//           {role === "superadmin" && (
//             <Route path="/superadmin" element={<MainLayout />}>
//               <Route index element={<SuperAdminDashboard />} />
//               <Route path="hostels" element={<Hostel />} />
//               <Route path="hostels/:id" element={<HostelView />} />
//               <Route path="hostels/add" element={<AddHostel />} />
//               <Route path="hostels/update/:id" element={<UpdateHostel />} />
//               <Route path="packages" element={<PackageList />} />
//               <Route path="packages/add" element={<AddNewPackage />} />
//               <Route path="packages/edit/:id" element={<EditnewPackage />} />
//               <Route path="reports" element={<Report />} />
//               <Route path="settings" element={<Notifications />} />
//             </Route>
//           )}

//           {/* ================= USER ================= */}
//           {/* {role === "user" && (
//             <Route path="/user" element={<MainLayout />}>
//               <Route index element={<UserDashboard />} />
//               <Route path="hostels" element={<Hostels />} />
//               <Route path="room" element={<MyRoom />} />
//               <Route path="mess" element={<Mess />} />
//               <Route path="fees" element={<Fees />} />
//               <Route path="support" element={<Support />} />
//               <Route path="profile" element={<Profile />} />
//               <Route path="/user/hostels/:id" element={<HostelDetails />} />
//               <Route
//                 path="/user/hostels/:id/request"
//                 element={<BookingRequest />}
//               />
//             </Route>
//           )} */}

//           {/* ================= STUDENT ================= */}
//           {role === "student" && (
//             <Route path="/student" element={<MainLayout />}>
//               <Route index element={<MyDashboard />} />
//               <Route path="room" element={<MyRoom />} />
//               <Route path="mess" element={<StudentMess />} />
//               <Route path="fees" element={<StudentFees />} />
//               <Route path="fees/pay" element={<StudentPayment />} />
//               <Route path="support" element={<StudentSupport />} />
//               <Route
//                 path="support/add"
//                 element={<StudentSupportAddRequest />}
//               />
//               <Route path="support/:id" element={<StudentSupportChat />} />
//               <Route path="profile" element={<StudentProfile />} />
//               <Route path="profile/edit" element={<StudentProfileEdit />} />
//             </Route>
//           )}

//           {/* ================= CHEF ================= */}
//           {role === "chef" && (
//             <Route path="/chef" element={<MainLayout />}>
//               <Route index element={<ChefDashboard />} />
//               <Route
//                 path="inventory"
//                 element={<Navigate to="/chef/inventory/details" replace />}
//               />
//               <Route
//                 path="inventory/details"
//                 element={<InventoryDetailsPage />}
//               />
//               <Route path="inventory/details/add" element={<AddStockPage />} />
//               <Route
//                 path="inventory/category"
//                 element={<InventoryCategoryPage />}
//               />
//               <Route
//                 path="inventory/category/add"
//                 element={<AddCategoryPage />}
//               />
//               <Route
//                 path="inventory/category/:id"
//                 element={<CategoryDetailsPage />}
//               />
//               <Route
//                 path="inventory/category/:id/edit"
//                 element={<EditCategoryPage />}
//               />
//               <Route
//                 path="inventory/category/:categoryId/item/:itemId/edit"
//                 element={<EditCategoryItemPage />}
//               />
//               <Route path="feedback" element={<FeedbackPage />} />
//             </Route>
//           )}

//           {/* DEFAULT */}
//           <Route path="*" element={<Navigate to={`/${role}`} replace />} />
//         </Routes>
//       )}
//     </>
//   );
// }

import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { useAuth } from "../src/context/AuthContext";
import MainLayout from "../src/components/layout/MainLayout";
import { Toaster } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

// AUTH
import Login from "../src/features/auth/pages/Login";
import SignUp from "../src/features/auth/pages/SignUp";
import SelectHostelForm from "../src/features/auth/pages/HostelLogin";
import RegisterHostel from "../src/features/auth/pages/RegisterHostel";

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

import AddStudent from "../src/features/admin/students/pages/AddStudent";
import ViewStudent from "../src/features/admin/students/pages/ViewStudent";
import EditStudent from "../src/features/admin/students/pages/EditStudent";

import AdminProfilePage from "../src/features/admin/profile/pages/ProfilePage";
import AdminEditProfilePage from "../src/features/admin/profile/pages/EditProfilePage";

import AdminPackagePage from "../src/features/admin/packages/pages/PackagePage";

import AdminNoticesPage from "../src/features/admin/notices/pages/NoticesPage";
import AdminCreateNoticePage from "../src/features/admin/notices/pages/CreateNoticePage";
import AdminEditNoticePage from "../src/features/admin/notices/pages/EditNoticePage";

import QueriesDetails from "./features/admin/Queries/QueriesDetails";

// STUDENT IMPORTS
import MyDashboard from "./features/student/dashboard/My_Dashboard";
import MyRoom from "./features/student/My_Room/MyRoom";
import StudentMess from "./features/student/mess/pages/Mess";
import StudentFees from "./features/student/fees/pages/Fees";
import StudentPayment from "./features/student/fees/pages/Payment";
import StudentSupport from "./features/student/support/pages/Support";
import StudentSupportAddRequest from "./features/student/support/pages/AddRequest";
import StudentSupportChat from "./features/student/support/pages/TicketChat";
import StudentProfile from "./features/student/profile/pages/Profile";
import StudentProfileEdit from "./features/student/profile/pages/ProfileEdit";

// SUPER ADMIN
import SuperAdminDashboard from "../src/features/super-admin/dashboard/pages/Dashboard";

import Hostel from "../src/features/super-admin/hostels/pages/HostelList";
import HostelView from "../src/features/super-admin/hostels/pages/HostelView";
import SuperAdminAddHostel from "../src/features/super-admin/hostels/pages/AddHostel";
import UpdateHostel from "../src/features/super-admin/hostels/pages/UpdateHostel";

import PackageList from "../src/features/super-admin/packages/pages/PackageList";
import AddNewPackage from "../src/features/super-admin/packages/pages/AddnewPackage";
import EditnewPackage from "../src/features/super-admin/packages/pages/EditnewPackage";

import Report from "../src/features/super-admin/report/pages/ReportPage";
import Notifications from "../src/features/super-admin/settings/pages/SettingsPage";

// CHEF
import ChefDashboard from "../src/features/chef/dashboard/pages/Dashboard";
import InventoryDetailsPage from "../src/features/chef/inventory/pages/inventoryDetails/InventoryDetailsPage";
import InventoryCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/InventoryCategoryPage";
import AddStockPage from "../src/features/chef/inventory/pages/inventoryDetails/AddStockPage";
import AddCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/AddCategoryPage";
import CategoryDetailsPage from "../src/features/chef/inventory/pages/inventoryCategory/CategoryDetailsPage";
import EditCategoryPage from "../src/features/chef/inventory/pages/inventoryCategory/EditCategoryPage";
import EditCategoryItemPage from "../src/features/chef/inventory/pages/inventoryCategory/EditCategoryItemPage";
import FeedbackPage from "../src/features/chef/feedback/pages/FeedbackPage";

export default function AppRoutes() {
  const { role } = useAuth();
  const [searchParams] = useSearchParams();

  const showRegisterHostel = searchParams.get("register") === "true";

  return (
    <>
      {showRegisterHostel && <RegisterHostel />}

      <Toaster position="top-right" />

      {!role ? (
        <Routes>
          <Route path="/select-hostel" element={<SelectHostelForm />} />
          <Route path="*" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
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
            </Route>
          )}

          {/* ================= SUPER ADMIN ================= */}
          {role === "superadmin" && (
            <Route path="/superadmin" element={<MainLayout />}>
              <Route index element={<SuperAdminDashboard />} />

              <Route path="hostels" element={<Hostel />} />
              <Route path="hostels/:id" element={<HostelView />} />
              <Route path="hostels/add" element={<SuperAdminAddHostel />} />
              <Route path="hostels/update/:id" element={<UpdateHostel />} />

              <Route path="packages" element={<PackageList />} />
              <Route path="packages/add" element={<AddNewPackage />} />
              <Route path="packages/edit/:id" element={<EditnewPackage />} />

              <Route path="reports" element={<Report />} />
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
