import React, { useState } from "react";
import { ArrowLeft, ChevronDown, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "../ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/DropdownMenu";
import { Button } from "../ui/button";


const mockNotifications = [
  {
    id: 1,
    title: "Exam Notice: Exam Scheduled: Arts (1-B)",
    body: "Exam for Arts is scheduled on 2026-05-13 from 09:00 to 10:00 in Room No: 1. Total Marks: 60, Passing Marks: 50.0. (Exam Time: 09:00 - 10:00)"
  },
  {
    id: 2,
    title: "Exam Notice: Exam Scheduled: Science (1-A)",
    body: "Exam for Science is scheduled on 2026-05-12 from 09:00 to 10:00 in Room No: 121. Total Marks: 50, Passing Marks: 40.0. (Exam Time: 09:00 - 10:00)"
  },
  {
    id: 3,
    title: "Exam Notice: Exam Scheduled: Arts (1-A)",
    body: "Exam for Arts is scheduled on 2026-05-12 from 09:22 to 11:22 in Room No: 304. Total Marks: 50, Passing Marks: 60.0. (Exam Time: 09:22 - 11:22)"
  },
  {
    id: 4,
    title: "Exam Notice: Exam Scheduled: Hindi (1-A)",
    body: "Exam for Hindi is scheduled on 2026-05-12 from 10:22 to 11:22 in Room No: 121. Total Marks: 40, Passing Marks: 50.0. (Exam Time: 10:22 - 11:22)"
  },
  {
    id: 5,
    title: "Exam Notice: Exam Scheduled: Science (1-A)",
    body: "Exam for Science is scheduled on 2026-05-14 from 10:41 to 11:41 in Room No: 100. Total Marks: 30, Passing Marks: 70.0. (Exam Time: 10:41 - 11:41)"
  },
  {
    id: 6,
    title: "Exam Notice: Exam Scheduled: Arts (1-A)",
    body: "Exam for Arts is scheduled on 2026-05-10 from 22:36 to 23:36 in Room No: 1. Total Marks: 70, Passing Marks: 30.0. (Exam Time: 22:36 - 23:36)"
  }
];

const Notification = () => {
  const [filter, setFilter] = useState("All");
  // Toggle this to empty array to see the empty state
  const [notifications, setNotifications] = useState(mockNotifications);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          style={{cursor:'pointer'}}
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          {/* Notification Dot */}
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-[400px] sm:w-[500px] p-0 flex flex-col bg-[#F9FAFB] dark:bg-card">
        <SheetHeader className="flex flex-row items-center justify-between p-4 bg-white dark:bg-card border-b border-border shadow-sm m-0">
          <SheetClose className="cursor-pointer flex items-center justify-center p-1 rounded-md hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-emerald-600" />
          </SheetClose>
          <div className="flex items-center gap-1 cursor-pointer">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-[15px] font-medium outline-none text-foreground hover:opacity-80 transition-opacity">
                All Notification <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 bg-white dark:bg-card shadow-md border rounded-xl">
                <DropdownMenuItem onClick={() => setFilter("All")} className="cursor-pointer">All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter("Unread")} className="cursor-pointer">Unread</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {notifications.length === 0 ? (
            <div className="flex justify-center items-center h-20 text-red-500 text-[15px]">
              No notifications available..
            </div>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="bg-white dark:bg-muted/40 p-4 rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-[14px] text-foreground font-medium">{notif.title}</p>
                <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">{notif.body}</p>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Notification;
