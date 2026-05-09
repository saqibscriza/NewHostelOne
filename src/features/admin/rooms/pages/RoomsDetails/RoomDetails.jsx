import React, { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { getRoomAllData } from "../../../../../utils/utils";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../../components/ui/Table";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../../components/ui/select";

import {
  BedDouble,
  User,
  CheckCircle,
  Wrench,
  Eye,
  // Pencil,
} from "lucide-react";

const RoomDetails = () => {
  const [roomData, setRoomData] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [getAllData, setGetAllData] = useState([]);

  const navigate = useNavigate();

  const RoomGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const params = {
        page: 1,
        size: 10,
      };

      const response = await getRoomAllData(params);

      console.log("ROOM API 👉", response?.data);
      console.log("ROOM response ", response);

      // ✅ FIX: handle both success + failure safely
      const list = response?.data?.data?.content || [];

      if (Array.isArray(list)) {
        setRoomData(list);
      } else {
        setRoomData([]);
      }

      // optional error toast (kept logic)
      if (response?.data?.status !== "success") {
        toast.error(response?.data?.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("API Error");
    } finally {
      setLoaderCheck(false);
    }
  };

  useEffect(() => {
    RoomGetAllApi();
  }, []);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Room Details
          </h1>
          <p className="text-muted-foreground">
            Define a new accommodation plan for your hostel facility.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/rooms/add")}
          className="bg-primary text-primary-foreground"
        >
          + Add New Room
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <BedDouble className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">TOTAL ROOMS</p>
              <h3 className="text-xl font-semibold">{roomData.length}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <User className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">OCCUPIED</p>
              <h3 className="text-xl font-semibold">
                {roomData.filter((r) => r.status === "OCCUPIED").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">AVAILABLE</p>
              <h3 className="text-xl font-semibold">
                {roomData.filter((r) => r.status === "AVAILABLE").length}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <Wrench className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">MAINTENANCE</p>
              <h3 className="text-xl font-semibold">
                {roomData.filter((r) => r.status === "MAINTENANCE").length}
              </h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex gap-3 items-center">
            <span className="text-sm text-muted-foreground">Filter by:</span>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Location</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <button className="text-sm text-muted-foreground hover:underline">
            Clear all filters
          </button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loaderCheck && (
            <div className="text-center py-6 text-muted-foreground">
              Loading rooms...
            </div>
          )}

          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Room Details</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Occupants</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* ✅ FIX */}
              {roomData?.length === 0 && !loaderCheck && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No rooms found
                  </TableCell>
                </TableRow>
              )}

              {/* ✅ FIX */}
              {roomData?.map((room, index) => (
                <TableRow key={room?.id || index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {room?.roomNameNumber || room?.roomNumber}
                      </p>
                      <span className="text-xs text-primary cursor-pointer">
                        Room Image
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>{room?.roomType || "-"}</TableCell>

                  <TableCell>
                    {room?.categoryName || room?.categoryId || "-"}
                  </TableCell>

                  <TableCell>
                    {room?.blockFloor || room?.block || "-"}
                  </TableCell>

                  <TableCell>-</TableCell>

                  <TableCell>
                    <Badge className="bg-muted text-foreground">
                      {room?.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3 text-muted-foreground">
                      <Eye
                        className="w-4 h-4 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/rooms/edit/${room?.roomId}`)
                        }
                      />
                      {/* <Pencil
                        className="w-4 h-4 cursor-pointer"
                        onClick={() =>
                          navigate(`/admin/rooms/edit/${room?.roomId}`)
                        }
                      /> */}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
            <span>Showing rooms</span>

            <div className="flex gap-2 items-center">
              <button className="px-2">‹</button>
              <button className="px-3 py-1 bg-primary text-white rounded">
                1
              </button>
              <button className="px-2">›</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetails;
