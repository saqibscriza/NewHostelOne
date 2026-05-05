import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // SESSION RESTORE
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

  // LOGIN
  const login = (userRole, userToken) => {
    if (!userRole || !userToken) {
      console.error("Invalid login data");
      return;
    }

    // safer clear
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");

    sessionStorage.setItem("role", userRole);
    sessionStorage.setItem("token", userToken);

    setRole(userRole);
    setToken(userToken);
    setIsAuthenticated(true);
  };

  // LOGOUT
  const logout = () => {
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("selectedHostel");
    sessionStorage.removeItem("hostelSelectionToken");

    setRole(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        isAuthenticated,
        isReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
