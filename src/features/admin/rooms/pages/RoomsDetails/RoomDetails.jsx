import React, { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { getRoomAllData } from "../../../../../utils/utils";
import DefaultTable from "../../../../../components/DefaultTable/DefaultTable";
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
  Pencil,
} from "lucide-react";

const DUMMY_ROOM_IMAGE =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";

const getRoomImage = (room) =>
  room?.photos?.[0]?.url ||
  room?.photos?.[0] ||
  room?.roomImage ||
  room?.roomImages ||
  room?.image ||
  room?.imageUrl ||
  room?.photo ||
  DUMMY_ROOM_IMAGE;

const RoomDetails = () => {
  const [roomData, setRoomData] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [dashboardStats, setDashboardStats] = useState({
    totalRooms: 0,
    occupied: 0,
    available: 0,
    maintenance: 0,
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const navigate = useNavigate();

  const RoomGetAllApi = async () => {
    setLoaderCheck(true);

    try {
      const params = {
        page: currentPage,
        size: pageSize,
      };

      const response = await getRoomAllData(params);

      console.log("ROOM API 👉", response?.data);
      console.log("ROOM response ", response);

      // ✅ FIX: handle both success + failure safely
      const list =
        response?.data?.data?.content &&
        Array.isArray(response?.data?.data?.content)
          ? response.data.data.content
          : [];

      setRoomData(list);

      setTotalPages(response?.data?.data?.totalPages || 1);

      setTotalElements(response?.data?.data?.totalElements || 0);
      setDashboardStats({
        totalRooms: response?.data?.data?.totalRooms || 0,
        occupied: response?.data?.data?.occupied || 0,
        available: response?.data?.data?.available || 0,
        maintenance: response?.data?.data?.maintenance || 0,
      });
    } catch (error) {
      console.log("ROOM FETCH ERROR =>", error);
    } finally {
      setLoaderCheck(false);
    }
  };

  useEffect(() => {
    RoomGetAllApi();
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, statusFilter, locationFilter, searchFilter]);

  const filteredRooms = roomData.filter((room) => {
    const matchesLocation =
      locationFilter === "all" ||
      room?.blockFloor === locationFilter ||
      room?.block === locationFilter;
    const matchesCategory =
      categoryFilter === "all" || room?.categoryName === categoryFilter;

    const matchesStatus =
      statusFilter === "all" || room?.status === statusFilter;

    const matchesSearch =
      room?.roomNameNumber
        ?.toLowerCase()
        ?.includes(searchFilter.toLowerCase()) ||
      room?.roomType?.toLowerCase()?.includes(searchFilter.toLowerCase()) ||
      room?.categoryName?.toLowerCase()?.includes(searchFilter.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch && matchesLocation;
  });

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
          onClick={() => {
            setCategoryFilter("all");
            setStatusFilter("all");
            setSearchFilter("");
            setLocationFilter("all");
            setCurrentPage(1);

            navigate("/admin/rooms/add");
          }}
          className="cursor-pointer bg-primary text-primary-foreground"
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
              <h3 className="text-xl font-semibold">
                {dashboardStats?.totalRooms}
              </h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <User className="w-6 h-6 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">OCCUPIED</p>
              <h3 className="text-xl font-semibold">
                {dashboardStats?.occupied}
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
                {dashboardStats?.available}
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
                {dashboardStats?.maintenance}
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

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              {" "}
              <SelectTrigger className="w-[160px] cursor-pointer">
                {" "}
                <SelectValue placeholder="All Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Location</SelectItem>

                {[
                  ...new Set(
                    roomData.map((room) => room?.blockFloor || room?.block),
                  ),
                ]
                  .filter(Boolean)
                  .map((location, index) => (
                    <SelectItem key={index} value={location}>
                      {location}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[160px] cursor-pointer">
                {" "}
                <SelectValue placeholder="All Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Category</SelectItem>

                {[...new Set(roomData.map((room) => room?.categoryName))].map(
                  (category, index) => (
                    <SelectItem key={index} value={category}>
                      {category}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] cursor-pointer">
                {" "}
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>

                <SelectItem value="AVAILABLE">AVAILABLE</SelectItem>

                <SelectItem value="OCCUPIED">OCCUPIED</SelectItem>

                <SelectItem value="MAINTENANCE">MAINTENANCE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* <input
            type="text"
            placeholder="Search room, type or category..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm w-[250px]"
          /> */}

          <button
            className="cursor-pointer text-sm text-muted-foreground hover:underline"
            onClick={() => {
              setCategoryFilter("all");
              setStatusFilter("all");
              setSearchFilter("");
              setLocationFilter("all");
            }}
          >
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
              {filteredRooms?.length === 0 && !loaderCheck && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <DefaultTable
                      height="320px"
                      title="No Rooms Found"
                      description="There are currently no rooms available. Add a new room to get started."
                      buttonText="Add Room"
                      onButtonClick={() => navigate("/admin/rooms/add")}
                    />
                  </TableCell>
                </TableRow>
              )}

              {/* ✅ FIX */}
              {filteredRooms?.map((room, index) => (
                <TableRow key={room?.id || index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={getRoomImage(room)}
                        alt={room?.roomNameNumber || "Room"}
                        className="h-12 w-14 rounded-md object-cover border border-border"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop";
                        }}
                      />
                      <div>
                        <p className="font-medium">
                          {room?.roomNameNumber || room?.roomNumber}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          Room Image
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {room?.occupancyName || room?.roomType || "-"}
                  </TableCell>
                  <TableCell>
                    {room?.categoryName || room?.categoryId || "-"}
                  </TableCell>

                  <TableCell>
                    {room?.blockFloor || room?.block || "-"}
                  </TableCell>

                  <TableCell>
                    <span className="text-muted-foreground">N/A</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-muted text-foreground">
                      {room?.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex gap-3 text-muted-foreground">
                      <button
                        type="button"
                        className="cursor-pointer rounded-md p-1 hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          navigate(`/admin/rooms/view/${room?.roomId}`)
                        }
                        aria-label="View room"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="cursor-pointer rounded-md p-1 hover:bg-muted hover:text-foreground"
                        onClick={() =>
                          navigate(`/admin/rooms/edit/${room?.roomId}`)
                        }
                        aria-label="Edit room"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-between items-center p-4 text-sm text-muted-foreground">
            <span>
              Showing page {currentPage} of {totalPages} ({totalElements} rooms)
            </span>

            <div className="flex gap-2 items-center">
              <button
                className="cursor-pointer px-2 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`cursor-pointer px-3 py-1 rounded transition-all ${
                    currentPage === index + 1
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="cursor-pointer px-2 disabled:opacity-50"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomDetails;
