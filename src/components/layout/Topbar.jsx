import React from "react";
import { Menu, Bell, User, Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAuth } from "../../context/AuthContext";

import { ThemeToggle } from "../../theme/ThemeToggle";

const Topbar = ({ onMenuClick }) => {
  const { role } = useAuth(); // get role from context

  console.log("ROLE:", role);

  return (
    // <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">

    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      {/* LEFT */}

      {/* left Section */}

      <div className="flex items-center gap-3 w-full">
        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="pl-9 bg-muted border-none text-foreground"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5 text-slate-500" />
        </Button> */}

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {/* Notification Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>

        {/* TEXT */}
        <div className="text-right min-w-[120px]">
          <p className="text-sm font-semibold text-foreground leading-tight whitespace-nowrap">
            Rakesh Sharma
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide whitespace-nowrap">
            {role === "admin" ? "ADMIN" : "SUPER ADMIN"}
          </p>
        </div>

        {/* USER */}

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
