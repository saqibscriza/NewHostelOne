import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import { useAuth } from "../../context/AuthContext";
import { menuConfig } from "./menu.config";

const MainLayout = () => {
  const { role, isReady, devLoginAsUser } = useAuth(); // ✅ include devLogin
  const [isOpen, setIsOpen] = useState(false);

  // ✅ expose to console safely
  useEffect(() => {
    window.devUser = devLoginAsUser;
  }, [devLoginAsUser]);

  if (!isReady) return null;

  if (!menuConfig[role]) {
    console.error("Invalid role:", role);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 h-full border-r border-border">
        <Sidebar menu={menuConfig[role]} variant={role} />
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 flex md:hidden transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

        <div
          className={`relative w-64 h-full transform transition-transform duration-300 border-r border-border bg-sidebar text-sidebar-foreground ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            menu={menuConfig[role]}
            onItemClick={() => setIsOpen(false)}
            variant={role}
          />
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setIsOpen(true)} role={role} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
