import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";

import {
  Wifi,
  MapPin,
  Circle,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";

import { getStudentMyRoomApi } from "../../../utils/utils";

export default function MyRoom() {
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [loaderCheck, setLoaderCheck] = useState(false);

  const [roomData, setRoomData] = useState(null);

  const photos = roomData?.roomDetails?.photos || [];

  useEffect(() => {
    if (photos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % photos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [photos.length]);

  // ================= API CALL =================

  const StudentMyRoomApi = async () => {
    setLoaderCheck(true);

    try {
      const response = await getStudentMyRoomApi();

      console.log("student room data", response);

      if (response?.data?.status === "success") {
        setRoomData(response?.data?.data);

        setLoaderCheck(false);
      } else {
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);

      setLoaderCheck(false);
    }
  };

  useEffect(() => {
    StudentMyRoomApi();

    const handleRefresh = () => {
      if (!document.hidden) StudentMyRoomApi();
    };

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("storage", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("storage", handleRefresh);
    };
  }, []);

  // ================= LOADER =================

  if (loaderCheck) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading room details...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background text-foreground">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Room</h1>

          <p className="text-muted-foreground text-sm">
            Manage your living space and roommate details
          </p>
        </div>

        <Button
          onClick={() => navigate("/student/support/add")}
          className="bg-primary text-primary-foreground cursor-pointer hover:scale-105 transition-all duration-300"
        >
          Raise Ticket
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ROOM DETAILS CARD */}
        <Card className="lg:col-span-2 overflow-hidden rounded-xl border-border shadow-sm">
          <div className="relative h-80 overflow-hidden">
            <img
              src={
                photos[currentImage] ||
                "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80"
              }
              alt="Room"
              className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Left Arrow */}
            {photos.length > 1 && (
              <button
                onClick={() =>
                  setCurrentImage((prev) =>
                    prev === 0 ? photos.length - 1 : prev - 1,
                  )
                }
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}

            {/* Right Arrow */}
            {photos.length > 1 && (
              <button
                onClick={() =>
                  setCurrentImage((prev) => (prev + 1) % photos.length)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
            <div className="absolute left-6 top-5 rounded-full bg-slate-950 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Active Stay
            </div>

            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-4xl font-bold tracking-tight">
                {roomData?.roomDetails?.roomNumber || "Room N/A"}
              </h2>
              <p className="mt-2 flex items-center gap-1 text-sm font-medium text-white/90">
                <MapPin className="h-4 w-4" />
                {roomData?.roomDetails?.category || "Standard Room"}
                {roomData?.roomDetails?.blockFloor
                  ? `, ${roomData.roomDetails.blockFloor}`
                  : ""}
              </p>
            </div>
          </div>

          <CardContent className="grid grid-cols-2 gap-6 p-6 md:grid-cols-4">
            <Info
              label="Floor"
              value={roomData?.roomDetails?.blockFloor || "N/A"}
            />
            <Info
              label="Type"
              value={roomData?.roomDetails?.category || "N/A"}
            />
            <Info
              label="Check-in"
              value={formatDate(
                roomData?.student?.joiningDate ||
                  roomData?.student?.dateOfJoining ||
                  roomData?.joiningDate ||
                  roomData?.dateOfJoining,
              )}
            />
            <Info
              label="Status"
              value={
                <span className="inline-flex items-center gap-2">
                  <Circle
                    className={`h-2.5 w-2.5 ${
                      roomData?.roomDetails?.status === "AVAILABLE"
                        ? "fill-green-500 text-green-500"
                        : "fill-red-500 text-red-500"
                    }`}
                  />{" "}
                  {formatStatus(roomData?.roomDetails?.status)}
                </span>
              }
            />
          </CardContent>
        </Card>

        {/* STUDENT CARD */}
        <Card className="h-full rounded-[14px] border-white bg-white shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
          <CardContent className="flex h-full min-h-[25.5rem] flex-col p-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#94a0b7]">
              Roommate
            </p>

            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="rounded-full border-[4px] border-[#10182b] bg-white p-1">
                  <img
                    src={
                      roomData?.student?.photo ||
                      "https://randomuser.me/api/portraits/men/32.jpg"
                    }
                    alt={roomData?.student?.studentName || "Student"}
                    className="h-28 w-28 rounded-full object-cover"
                  />
                </div>
                <span className="absolute bottom-4 right-0 h-6 w-6 rounded-full border-[4px] border-white bg-[#10182b]" />
              </div>

              <h3 className="mt-8 text-2xl font-extrabold leading-tight tracking-normal text-[#171b22]">
                {roomData?.student?.studentName || "N/A"}
              </h3>

              <p className="mt-2 text-base font-semibold tracking-normal text-[#50515e]">
                {[roomData?.student?.course, roomData?.student?.year]
                  .filter(Boolean)
                  .join(", ") || "N/A"}
              </p>

              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/student/profile")}
                className="mt-8 h-12 w-full rounded-[10px] bg-[#eef0f2] text-base font-bold text-[#202124] hover:bg-[#e3e5e8] cursor-pointer"
              >
                <User className="mr-2 h-5 w-5" />
                View Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AMENITIES */}
      <div>
        <h2 className="font-semibold mb-3">Room Amenities</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {roomData?.amenities?.length > 0 ? (
            roomData.amenities.map((item, index) => (
              <Amenity key={index} icon={Wifi} text={item?.name || "N/A"} />
            ))
          ) : (
            <div className="col-span-full text-sm text-muted-foreground">
              N/A
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* MAINTENANCE */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Maintenance History</h3>

            {roomData?.maintenanceHistory?.length > 0 ? (
              roomData.maintenanceHistory.map((item, index) => (
                <Row
                  key={index}
                  title={item?.title || "Issue"}
                  status={item?.status || "Pending"}
                />
              ))
            ) : (
              <div className="rounded-lg border border-dashed border-border p-5 text-center">
                <p className="text-sm font-medium text-foreground">
                  No Maintenance Requests
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Your room maintenance history will appear here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RULES */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-semibold">Room Rules & Guidelines</h3>

            {roomData?.roomRules?.length > 0 ? (
              roomData.roomRules.map((rule, index) => (
                <Rule key={index} text={rule} />
              ))
            ) : (
              <p className="text-muted-foreground">No rules available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

const Info = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.16em]">
      {label}
    </p>

    <p className="mt-2 font-semibold text-foreground">{value}</p>
  </div>
);

const formatStatus = (status) => {
  if (!status) return "N/A";
  return String(status)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const Amenity = ({ icon, text }) => (
  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center gap-2">
    {React.createElement(icon, { className: "w-5 h-5" })}

    <p className="text-sm">{text}</p>
  </div>
);

const Row = ({ title, status }) => (
  <div className="flex justify-between text-sm">
    <span>{title}</span>

    <span className="text-muted-foreground">{status}</span>
  </div>
);

const Rule = ({ text }) => (
  <div className="bg-muted p-3 rounded-md text-sm">{text}</div>
);
