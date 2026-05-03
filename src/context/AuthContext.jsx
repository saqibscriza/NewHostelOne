import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // ================= SESSION RESTORE =================
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const storedToken = sessionStorage.getItem("token");

    if (storedRole && storedToken) {
      setRole(storedRole);
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    setIsReady(true);
  }, []);

  // ================= DEV GLOBAL ACCESS =================
  useEffect(() => {
    window.devUser = () => login("user", "dummy-token");
    window.devAdmin = () => login("admin", "dummy-token");
    window.devSuper = () => login("superadmin", "dummy-token");
  }, []);

  // ================= LOGIN =================
  const login = (userRole, userToken) => {
    sessionStorage.setItem("role", userRole);
    sessionStorage.setItem("token", userToken);

    setRole(userRole);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  // ================= LOGOUT =================
  const logout = () => {
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");

    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // ================= DEV OVERRIDE =================
  const devLoginAsUser = () => {
    login("user", "dummy-token");
  };

  const devLoginAsAdmin = () => {
    login("admin", "dummy-token");
  };

  const devLoginAsSuperAdmin = () => {
    login("superadmin", "dummy-token");
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        isAuthenticated,
        login,
        logout,
        isReady,

        // DEV
        devLoginAsUser,
        devLoginAsAdmin,
        devLoginAsSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
