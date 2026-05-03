import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { menuConfig } from "./menu.config";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const role = "admin";

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
      {/* Sidebar */}
      <div className="hidden md:flex w-64">
        <Sidebar menu={menuConfig[role]} variant="admin" />
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="w-64 bg-backgraound">
            <Sidebar
              menu={menuConfig[role]}
              onItemClick={() => setIsOpen(false)}
              variant="admin"
            />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-1 flex-col">
        <Topbar onMenuClick={() => setIsOpen(true)} role="admin" />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
