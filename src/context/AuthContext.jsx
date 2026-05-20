import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedRole = sessionStorage.getItem("role");
  const storedToken = sessionStorage.getItem("token");
  const storedName = sessionStorage.getItem("userName");
  const storedPhoto =
    sessionStorage.getItem("userPhoto") || localStorage.getItem("userPhoto");
  const hasSession = Boolean(storedRole && storedToken);

  const [role, setRole] = useState(hasSession ? storedRole : null);
  const [token, setToken] = useState(hasSession ? storedToken : null);
  const [userName, setUserName] = useState(hasSession ? storedName || "User" : null);
  const [userPhoto, setUserPhoto] = useState(hasSession ? storedPhoto || "" : null);
  const [isAuthenticated, setIsAuthenticated] = useState(hasSession);
  const [isReady] = useState(true);

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
    sessionStorage.removeItem("userPhoto");
    localStorage.removeItem("userPhoto");

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
    setUserPhoto("");
    setIsAuthenticated(true);
  };

  const updateUserName = useCallback((name) => {
    if (!name) return;
    sessionStorage.setItem("userName", name);
    setUserName(name);
  }, []);

  const updateUserPhoto = useCallback((photo = "") => {
    if (photo) {
      sessionStorage.setItem("userPhoto", photo);
      localStorage.setItem("userPhoto", photo);
    } else {
      sessionStorage.removeItem("userPhoto");
      localStorage.removeItem("userPhoto");
    }
    setUserPhoto(photo);
  }, []);

  const updateUserProfile = useCallback(
    ({ name, photo } = {}) => {
      if (name) updateUserName(name);
      if (photo !== undefined) updateUserPhoto(photo || "");
    },
    [updateUserName, updateUserPhoto],
  );

  // LOGOUT
  const logout = () => {
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userPhoto");
    localStorage.removeItem("userPhoto");

    setRole(null);
    setToken(null);
    setUserName(null);
    setUserPhoto(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        token,
        userName,
        userPhoto,
        isAuthenticated,
        isReady,
        login,
        logout,
        updateUserName,
        updateUserPhoto,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
