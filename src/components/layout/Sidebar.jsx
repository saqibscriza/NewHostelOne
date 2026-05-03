import React, { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChevronDown } from "lucide-react";
import Logo from "../../assets/Logo.svg";
import { useAuth } from "../../context/AuthContext";

import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/button";

const Sidebar = ({ menu = [], onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, role } = useAuth();

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (name) => {
    setOpenMenu(openMenu === name ? null : name);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-4">
        <img src={Logo} alt="Logo" className="w-44 mt-3 object-contain" />
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          // const fullPath = `/${role}${item.path}`;
          const fullPath =
            item.path === "/" ? `/${role}` : `/${role}${item.path}`;
          const isActive = location.pathname === fullPath;
          const hasChildren = item.children;

          return (
            <div key={item.name}>
              {/* Parent Item */}
              <div
                onClick={() => {
                  if (hasChildren) {
                    toggleMenu(item.name);
                  }
                  navigate(fullPath);
                }}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium cursor-pointer transition
                  ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  {item.name}
                </div>

                {hasChildren && (
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      openMenu === item.name ? "rotate-180" : ""
                    }`}
                  />
                )}
              </div>

              {/* Submenu */}
              {hasChildren && openMenu === item.name && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => {
                    const childPath = `/${role}${child.path}`;
                    const isChildActive = location.pathname === childPath;

                    return (
                      <NavLink
                        key={child.name}
                        to={childPath}
                        className={`block text-sm px-3 py-2 rounded-md transition
                          ${
                            isChildActive
                              ? "text-primary font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                      >
                        • {child.name}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="py-4 px-1 mt-4 ">
        <Card className="bg-black text-white border-none rounded-2xl">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold">Register as Hostel</h3>

            <p className="text-xs text-gray-300 leading-relaxed">
              Start listing your hostel with us today
            </p>

            <Button className="w-full bg-white text-black hover:bg-gray-200">
              Register Hostel
            </Button>
          </CardContent>
        </Card>
      </div>
      {/* Logout */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
