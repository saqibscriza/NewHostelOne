import { useAuth } from "../../src/context/AuthContext";
import SuperAdminRoutes from "./SuperAdminRoutes";
import HostelAdminRoutes from "./HostelAdminRoutes";
import Login from "../../src/features/auth/pages/Login";

export default function AppRoutes() {
  const { role } = useAuth();

  if (!role) return <Login />;

  if (role === "superadmin") return <SuperAdminRoutes />;

  if (role === "admin") return <HostelAdminRoutes />;

  return <Login />;
}
