import React, { useEffect, useState } from "react";
import { ArrowLeft, ChevronDown, Bell } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "./ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Calendar } from "lucide-react";

import { getAllNotification, getAllNotificationCount, getAllNotificationReadPut, getAllNotificationGetById } from "../utils/utils";

// import {getAllNotification} from '../../src/utils/getAllNotification'
import { Button } from "./ui/button";


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
  const [filter, setFilter] = useState("ALL");
  // Toggle this to empty array to see the empty state
  const [notifications, setNotifications] = useState(mockNotifications);
  const [notificationsAllData, setNotificationsAllData] = useState([]);
  const [message, setMessage] = useState('');
  const [readAt, setReadAt] = useState('');
  const [title, setTitle] = useState('');
  // console.log('my notification all data',notificationsAllData)

  const [notificationCount, setNotificationCount] = useState('');
  console.log('my count', notificationCount)
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    myGetAllNotificationApi()
    myGetAllNotificationCountApi()
  }, [filter])

  // Notification get all api 
  const myGetAllNotificationApi = async () => {
    try {
      const response = await getAllNotification(filter);
      console.log('my get all api ---', response)
      if (response?.status === 200) {
        setNotificationsAllData(response?.data?.data || []);
      } else {
        // toast.error(response?.data?.message || 'Failed to fetch staff allowances');
      }
    } catch (error) {
      // toast.error('Error fetching staff allowances');
    } finally {
    }
  };
  // Notification count all api 
  const myGetAllNotificationCountApi = async () => {
    try {
      const response = await getAllNotificationCount();
      console.log('my notification count---', response)
      if (response?.status === 200) {
        setNotificationCount(response?.data?.count);
        myGetAllNotificationApi()
      } else {
        // toast.error(response?.data?.message || 'Failed to fetch staff allowances');
      }
    } catch (error) {
      // toast.error('Error fetching staff allowances');
    } finally {
    }
  };
  // Notification get by id api 
  const myGetAllNotificationGetByIdApi = async (id) => {
    try {
      const response = await getAllNotificationGetById(id);
      console.log('my notification get by api id---', response)
      if (response?.status === 200) {
        const dateOnly = response?.data?.readAt?.split("T")[0]
        setMessage(response?.data?.message);
        setTitle(response?.data?.title);
        setReadAt(dateOnly);
        myGetAllNotificationApi()
        myGetAllNotificationCountApi()
      } else {
        // toast.error(response?.data?.message || 'Failed to fetch staff allowances');
      }
    } catch (error) {
      // toast.error('Error fetching staff allowances');
    } finally {
    }
  };

  // Notification read put all api 
  const myGetAllNotificationReadPut = async (id) => {
    try {
      const response = await getAllNotificationReadPut(id);
      console.log('my notification read apiiiii', response)
      if (response?.status === 200) {
        myGetAllNotificationApi()
        myGetAllNotificationCountApi()
        // setNotificationCount(response?.data);
      } else {
        // toast.error(response?.data?.message || 'Failed to fetch staff allowances');
      }
    } catch (error) {
      // toast.error('Error fetching staff allowances');
    } finally {
    }
  };
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>

          <Button
            style={{ cursor: 'pointer' }}
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-white bg-red-500 rounded-full px-1.5 py-[1px] translate-x-2 -translate-y-2">
                {notificationCount ? notificationCount : '0'}
              </span>
            </span>
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
                  <DropdownMenuItem onClick={() => setFilter("ALL")} className="cursor-pointer">All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilter("UNREAD")} className="cursor-pointer">Unread</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {notifications?.length === 0 ? (
              <div className="flex justify-center items-center h-20 text-red-500 text-[15px]">
                No notifications available..
              </div>
            ) : (
              notificationsAllData?.map((data) => (
                // <div key={data.id} className="bg-white dark:bg-muted/40 p-4 rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <div

                  style={{ height: "123px",width:'350px' }}
                  key={data.id}
                  onClick={() => {
                    myGetAllNotificationReadPut(data?.id);
                    myGetAllNotificationGetByIdApi(data?.id);
                    setOpen(true);
                  }}


                  className={`p-4 rounded-xl border border-border/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer
    ${!data.isRead ? "bg-[#bfaeb1] !text-white" : "bg-white dark:bg-muted/40 text-foreground"}
  `}
                >
                  <p className="text-[16px] font-medium">{data?.title ? data?.title : 'Notification title'}</p>
                  {/* <p className="text-[13px] text-muted-foreground mt-1.5 leading-snug">{data?.message ? data?.message : 'Notification message'}</p> */}
                  <p className="text-[14px] mt-1.5 leading-snug">
                    {data?.message
                      ? data.message.split(" ").slice(0, 25).join(" ") +
                      (data.message.split(" ").length > 30 ? " ..." : "")
                      : "Notification message"}
                  </p>
                </div>
              ))
            )}
          </div>
        </SheetContent>
      </Sheet>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="!max-w-lg p-0 overflow-hidden border-0 rounded-2xl bg-white shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-[#bb0121] to-[#000000] px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-white" />
              <DialogTitle className="text-lg font-semibold text-white">
                Notification
              </DialogTitle>
            </div>

            {/* <button
        onClick={() => setOpen(false)}
        className="text-white/80 hover:text-white"
      >
        <X size={20} />
      </button> */}
          </div>

          {/* Body */}
          <div className="p-4 bg-[#fafafa]">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex">
                <div className="w-1.5 bg-[#bb0121]" />

                <div className="flex-1 p-4">
                  <h3 className="text-[#bb0121] text-base font-semibold mb-2 line-clamp-2">
                    {title ? title : 'Notification tite'}
                  </h3>

                  <p className="text-gray-600 text-sm leading-6">
                    {message ? message : 'Notification message'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-gray-500 text-xs">
                    <Calendar size={14} />
                    <span>
                      {readAt ? readAt : 'Date'}
                    </span>
                  </div>

                  {/* Optional */}
                  {/* <div className="mt-2 text-[10px] text-gray-400">
              ID: {selectedNotification?.id}
            </div> */}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setOpen(false)}
                className="
            px-5 py-2
            rounded-full
            text-white
            text-sm
            font-medium
            bg-gradient-to-r
            from-[#bb0121]
            to-[#000000]
            hover:opacity-90
            transition-all
          "
              >
                Close
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>

  );
};

export default Notification;
