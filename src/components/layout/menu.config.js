// import {
//   LayoutDashboard,
//   Building2,
//   Package,
//   BarChart3,
//   BedDouble,
//   Users,
//   IndianRupee,
//   UserCog,
//   Settings,
//   HelpCircle,
//   User,
// } from "lucide-react";

// export const menuConfig = {
//   superadmin: [
//     { name: "Dashboard", path: "/", icon: LayoutDashboard },
//     { name: "Hostels", path: "/hostels", icon: Building2 },
//     { name: "Packages", path: "/packages", icon: Package },
//     { name: "Reports", path: "/reports", icon: BarChart3 },
//     { name: "Settings", path: "/settings", icon: Settings },
//   ],
//   admin: [
//     { name: "Dashboard", path: "/", icon: LayoutDashboard },

//     {
//       name: "Rooms",
//       path: "/rooms",
//       icon: BedDouble,
//       children: [
//         { name: "Room Category", path: "/rooms" },
//         { name: "Room Details", path: "/rooms/details" },
//       ],
//     },

//     { name: "Students", path: "/students", icon: Users },
//     { name: "Fees", path: "/fees", icon: IndianRupee },
//     { name: "Staff", path: "/staff", icon: UserCog },
//     { name: "Settings", path: "/settings", icon: Settings },
//     { name: "Support", path: "/support", icon: HelpCircle },
//   ],
//   user: [
//     { name: "Hostels", path: "/hostels", icon: Building2 },
//     { name: "My Dashboard", path: "/", icon: LayoutDashboard },
//     { name: "My Room", path: "/room", icon: BedDouble },
//     { name: "Mess", path: "/mess", icon: BedDouble }, // replace icon later
//     { name: "Fees", path: "/fees", icon: IndianRupee },
//     { name: "Support", path: "/support", icon: HelpCircle },
//     { name: "Profile", path: "/profile", icon: User },
//   ],
// };

import {
  LayoutDashboard,
  Building2,
  Package,
  BarChart3,
  BedDouble,
  Users,
  IndianRupee,
  UserCog,
  Settings,
  HelpCircle,
  User,
} from "lucide-react";

export const menuConfig = {
  superadmin: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Hostels", path: "/hostels", icon: Building2 },
    { name: "Packages", path: "/packages", icon: Package },
    { name: "Reports", path: "/reports", icon: BarChart3 },
    { name: "Settings", path: "/settings", icon: Settings },
  ],

  admin: [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },

    {
      name: "Rooms",
      path: "/rooms",
      icon: BedDouble,
      children: [
        { name: "Room Category", path: "/rooms" },
        { name: "Room Details", path: "/rooms/details" },
      ],
    },

    { name: "Students", path: "/students", icon: Users },
    { name: "Fees", path: "/fees", icon: IndianRupee },
    { name: "Staff", path: "/staff", icon: UserCog },
    { name: "Settings", path: "/settings", icon: Settings },
    { name: "Support", path: "/support", icon: HelpCircle },
  ],

  user: [
    { name: "Hostels", path: "/hostels", icon: Building2 },
    { name: "My Dashboard", path: "/", icon: LayoutDashboard },
    { name: "My Room", path: "/room", icon: BedDouble },
    { name: "Mess", path: "/mess", icon: BedDouble }, // can change icon later
    { name: "Fees", path: "/fees", icon: IndianRupee },
    { name: "Support", path: "/support", icon: HelpCircle },
    { name: "Profile", path: "/profile", icon: User },
  ],
};
