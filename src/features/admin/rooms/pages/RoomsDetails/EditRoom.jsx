// export default EditRoom;

import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { useParams } from "react-router-dom";
import { getRoomById, deleteRoomApi } from "../../../../../utils/utils";
import { DoorOpen, User, Wifi, Snowflake, Brush } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditRoom = () => {
  const [roomData, setRoomData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  console.log("PARAM ID -=-=-=-=", id);
  const RoomGetByIdApi = async () => {
    try {
      const response = await getRoomById(id);

      console.log("ROOM BY ID ===========", response);

      if (response?.data?.status === "success") {
        const room =
          response?.data?.data?.Room || // current structure
          response?.data?.Room || // fallback
          {};

        console.log("FINAL ROOM 👉", room);

        setRoomData(room);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this room?",
      );

      if (!confirmDelete) return;

      const response = await deleteRoomApi(id);

      console.log("DELETE RESPONSE =====>", response);

      if (response?.data?.status === "success") {
        alert("Room deleted successfully");

        navigate("/room");
      } else {
        alert("Failed to delete room");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    RoomGetByIdApi();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Room - {roomData?.roomNameNumber}
          </h1>
          <p className="text-muted-foreground text-sm">
            Access and update all room details easily
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDeleteRoom}>
            Delete Room
          </Button>{" "}
          <Button>Edit Room</Button>
        </div>
      </div>

      {/* Top Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-xs text-muted-foreground">STATUS</p>
            <Badge className="bg-muted text-foreground">
              {roomData?.status}
            </Badge>
            <p className="text-xs text-muted-foreground mt-4">CATEGORY</p>
            <h3 className="text-lg font-semibold">{roomData?.categoryName}</h3>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-3">
            <p className="text-xs text-muted-foreground">ROOM TYPE</p>
            <h3 className="text-lg font-semibold">
              {roomData?.roomNameNumber}
            </h3>{" "}
            <p className="text-sm text-muted-foreground">
              No guest restrictions applied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/avatar.jpg"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <h4 className="font-semibold">Resident</h4>
                <p className="text-xs text-muted-foreground">Resident - 01</p>
              </div>
            </div>

            <Button variant="secondary" className="w-full">
              View Full Profile
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">MONTHLY RENT</p>
            <h3 className="text-xl font-semibold">
              ₹{roomData?.totalRoomPrice}
            </h3>{" "}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">BLOCK / LOCATION</p>
            <h3 className="text-base font-semibold">
              {roomData?.blockFloor}
            </h3>{" "}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-muted-foreground">SECURITY AMOUNT</p>
            <h3 className="text-xl font-semibold">
              ₹{roomData?.securityDeposit}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="text-sm text-muted-foreground mb-3">ROOM AMENITIES</h3>

        <div className="flex gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-2">
              <Snowflake className="w-4 h-4" />
              AC
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-2">
              <Wifi className="w-4 h-4" />
              Wi-Fi
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-2">
              <Brush className="w-4 h-4" />
              Cleaning
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Gallery + Activity */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-3">
          <h3 className="text-sm text-muted-foreground">ROOM GALLERY</h3>

          <div className="grid grid-cols-2 gap-4">
            <img
              src="/room1.jpg"
              className="rounded-xl h-[250px] w-full object-cover"
            />

            <div className="grid gap-4">
              <img
                src="/room2.jpg"
                className="rounded-xl h-[120px] w-full object-cover"
              />
              <div className="relative">
                <img
                  src="/room3.jpg"
                  className="rounded-xl h-[120px] w-full object-cover brightness-75"
                />
                <span className="absolute inset-0 flex items-center justify-center text-white font-semibold">
                  +4 Photos
                </span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="text-sm text-muted-foreground">RECENT ACTIVITY</h3>

            <div className="space-y-3 text-sm">
              <p>AC Service Completed</p>
              <p>Rent Payment Received</p>
              <p>New Keys Issued</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditRoom;
