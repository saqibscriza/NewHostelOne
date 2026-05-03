import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { menuConfig } from "./menu.config";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminLayout() {
  const { role } = useAuth(); // ✅ dynamic role
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64">
        <Sidebar menu={menuConfig[role] || []} variant={role} />
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="w-64 bg-background">
            {" "}
            {/* ✅ fixed typo */}
            <Sidebar
              menu={menuConfig[role] || []}
              onItemClick={() => setIsOpen(false)}
              variant={role}
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <Topbar onMenuClick={() => setIsOpen(true)} role={role} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
