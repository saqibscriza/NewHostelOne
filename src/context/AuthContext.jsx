import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // SESSION RESTORE
  useEffect(() => {
    const storedRole = sessionStorage.getItem("role");
    const storedToken = sessionStorage.getItem("token");
    const storedName = sessionStorage.getItem("userName");

    if (storedRole && storedToken) {
      setRole(storedRole);
      setToken(storedToken);
      setUserName(storedName || "User");
      setIsAuthenticated(true);
    }

    setIsReady(true);
  }, []);

  // LOGIN
  const login = (userRole, userToken, name = "") => {
    if (!userRole || !userToken) {
      console.error("Invalid login data");
      return;
    }

    // safer clear
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");

    let defaultName = name;
    if (!defaultName) {
      if (userRole === "student") defaultName = "Student User";
      else if (userRole === "admin") defaultName = "Admin User";
      else if (userRole === "superadmin") defaultName = "Super Admin";
      else if (userRole === "chef") defaultName = "Chef User";
      else defaultName = "User";
    }

    sessionStorage.setItem("role", userRole);
    sessionStorage.setItem("token", userToken);
    sessionStorage.setItem("userName", defaultName);

    setRole(userRole);
    setToken(userToken);
    setUserName(defaultName);
    setIsAuthenticated(true);
  };

  // LOGOUT
  const logout = () => {
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");

    setRole(null);
    setToken(null);
    setUserName(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        userName,
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
