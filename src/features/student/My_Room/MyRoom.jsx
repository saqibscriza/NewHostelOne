import React, { useEffect, useState } from "react";

import { Card, CardContent } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/button";

import { Wifi, Snowflake, Bath, WashingMachine, BookOpen } from "lucide-react";

import { getStudentMyRoomApi } from "../../../utils/utils";

export default function MyRoom() {
  const [loaderCheck, setLoaderCheck] = useState(false);

  const [roomData, setRoomData] = useState(null);

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
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">My Room</h1>

          <p className="text-muted-foreground text-sm">
            Manage your living space and roommate details
          </p>
        </div>

        <Button className="bg-primary text-primary-foreground">
          Raise Ticket
        </Button>
      </div>


{/* TOP GRID */}
<div className="grid lg:grid-cols-3 gap-6">
  {/* ROOM DETAILS CARD */}
  <Card className="lg:col-span-2 overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2"
      className="h-52 w-full object-cover"
    />

    <CardContent className="p-5 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">
            Room{" "}
            {roomData?.roomDetails?.roomNumber ||
              "N/A"}
          </h2>

          <p className="text-sm text-muted-foreground">
            Block / Floor:{" "}
            {roomData?.roomDetails?.blockFloor ||
              "N/A"}
          </p>
        </div>

        <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-medium">
          {roomData?.roomDetails?.status ||
            "N/A"}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <Info
          label="Category"
          value={
            roomData?.roomDetails?.category ||
            "N/A"
          }
        />

        <Info
          label="Available Beds"
          value={
            roomData?.roomDetails
              ?.availableBeds || 0
          }
        />

        <Info
          label="Total Beds"
          value={
            roomData?.roomDetails?.totalBeds ||
            0
          }
        />

        <Info
          label="Room ID"
          value={
            roomData?.roomDetails?.roomId ||
            "N/A"
          }
        />
      </div>
    </CardContent>
  </Card>

  {/* STUDENT CARD */}
  <Card>
    <CardContent className="p-5 flex flex-col items-center text-center gap-3">
      <img
        src={
          roomData?.student?.photo ||
          "https://randomuser.me/api/portraits/men/32.jpg"
        }
        className="w-20 h-20 rounded-full"
      />

      <h3 className="font-semibold">
        {roomData?.student?.studentName ||
          "N/A"}
      </h3>

      <p className="text-sm text-muted-foreground">
        {roomData?.student?.course || "N/A"}
      </p>

      <p className="text-sm text-muted-foreground">
        Year:{" "}
        {roomData?.student?.year || "N/A"}
      </p>

      <p className="text-sm text-muted-foreground">
        Phone:{" "}
        {roomData?.student?.phone || "N/A"}
      </p>

      <p className="text-xs text-muted-foreground">
        ID:{" "}
        {roomData?.student?.studentId ||
          "N/A"}
      </p>
    </CardContent>
  </Card>
</div>


      {/* TOP GRID */}
      <div className="grid lg:grid-cols-3 gap-6">
      

        {/* ROOMMATE */}
      </div>

      {/* AMENITIES */}
      <div>
        <h2 className="font-semibold mb-3">Room Amenities</h2>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {roomData?.amenities?.length > 0 ? (
            roomData.amenities.map((item, index) => (
              <Amenity key={index} icon={Wifi} text={item} />
            ))
          ) : (
            <p className="text-muted-foreground">No amenities available</p>
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
              <p className="text-muted-foreground">
                No maintenance history available
              </p>
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
    <p className="text-muted-foreground text-xs">{label}</p>

    <p className="font-medium">{value}</p>
  </div>
);

const Amenity = ({ icon: Icon, text }) => (
  <div className="bg-muted p-4 rounded-lg flex flex-col items-center text-center gap-2">
    <Icon className="w-5 h-5" />

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
