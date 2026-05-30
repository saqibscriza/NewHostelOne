import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { useParams } from "react-router-dom";
import { getRoomById, deleteRoomApi } from "../../../../../utils/utils";
import { Brush, Snowflake, Wifi, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
const defaultPhotos = [
  "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
];
 
const getRoomPhotos = (room) => {
  if (Array.isArray(room?.photos) && room.photos.length > 0) {
    return room.photos.map(p => typeof p === "string" ? p : p?.url || p?.imageUrl).filter(Boolean);
  }
  // Fallbacks
  const single = room?.roomImage || room?.roomImages || room?.image || room?.imageUrl || room?.photo;
  if (single) return [single];
  return [];
};
 
const EditRoom = () => {
  const [roomData, setRoomData] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
 
const RoomGetByIdApi = async () => {
  try {
    const response = await getRoomById(id);

    const room =
      response?.data?.data?.Room ||
      response?.data?.Room ||
      {};

    const students =
      response?.data?.data?.Students ||
      [];

    setRoomData(room);

    // First student only
    setStudentData(students?.[0] || null);

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
      if (response?.data?.status === "success") {
        // alert("Room deleted successfully");
        navigate("/admin/rooms/details");
      } else {
        // alert("Failed to delete room");
      }
    } catch (error) {
      console.log(error);
      // alert("Something went wrong");
    }
  };
 
  useEffect(() => {
    RoomGetByIdApi();
  }, []);
 
  const photosList = getRoomPhotos(roomData);
  const displayPhotos = photosList.length > 0 ? photosList : defaultPhotos;
 
  const openLightbox = (index) => {
    setActivePhotoIndex(index);
    setLightboxOpen(true);
  };
 
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
 
  const nextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev + 1) % displayPhotos.length);
  };
 
  const prevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
  };
 
  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setActivePhotoIndex((prev) => (prev + 1) % displayPhotos.length);
      } else if (e.key === "ArrowLeft") {
        setActivePhotoIndex((prev) => (prev - 1 + displayPhotos.length) % displayPhotos.length);
      } else if (e.key === "Escape") {
        setLightboxOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, displayPhotos.length]);


const resident = {
  name: studentData?.fullName || "No Student Assigned",
  role: studentData?.course || "Student",
  moveInDate: studentData?.dateOfJoining || "N/A",
  agreementTerm: studentData?.year
    ? `${studentData.year} Year`
    : "N/A",
  paymentStatus: studentData?.status ? "Active" : "Inactive",
  photo:
    studentData?.photo ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      studentData?.fullName || "Student"
    )}`,
};
 
  return (
    <div className="p-6 space-y-6">
      <div>
        <Button variant="outline" onClick={() => navigate(-1)} className="mb-2">
          ← Back
        </Button>
      </div>
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
          <Button
            onClick={() =>
              navigate(`/admin/rooms/edit/${roomData?.roomId || id}`)
            }
          >
            Edit Room
          </Button>{" "}
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
 
        {/* Student Details Card */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center gap-3">
<img
  src={resident.photo}
  alt={resident.name}
  className="w-10 h-10 rounded-xl object-cover border border-slate-100"
  onError={(e) => {
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      resident.name
    )}`;
  }}
/>
              <div>
                <h4 className="font-semibold text-slate-800">{resident.name}</h4>
                <p className="text-xs text-muted-foreground">{resident.role}</p>
              </div>
            </div>
 
            <div className="space-y-3 pt-2 border-t border-slate-100 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Move-in Date</span>
                <span className="font-bold text-slate-700 text-xs">{resident.moveInDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Agreement Term</span>
                <span className="font-bold text-slate-700 text-xs">{resident.agreementTerm}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-medium">Payment Status</span>
<Badge
  className={`border-none font-semibold text-[10px] px-2 py-0.5 rounded-full ${
    resident.paymentStatus === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-red-50 text-red-700"
  }`}
>
  {resident.paymentStatus}
</Badge>
              </div>
            </div>
 
            <Button 
              variant="secondary" 
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold"
              onClick={() => navigate(`/admin/rooms/${id}/students`)}
            >
              View All Students
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
            <h3 className="text-base font-semibold">{roomData?.blockFloor}</h3>
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
            {/* Main Image */}
            {displayPhotos[0] ? (
              <div 
                className="h-[250px] w-full rounded-xl overflow-hidden cursor-pointer relative group"
                onClick={() => openLightbox(0)}
              >
                <img
                  src={displayPhotos[0]}
                  alt="Room Main"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : (
              <div className="flex h-[250px] w-full items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                No room image uploaded
              </div>
            )}
 
            {/* Additional Images */}
            <div className="grid gap-4">
              {displayPhotos[1] ? (
                <div 
                  className="h-[120px] w-full rounded-xl overflow-hidden cursor-pointer relative group"
                  onClick={() => openLightbox(1)}
                >
                  <img
                    src={displayPhotos[1]}
                    alt="Room 2"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex h-[120px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                  No Image
                </div>
              )}
 
              {displayPhotos[2] ? (
                <div 
                  className="h-[120px] w-full rounded-xl overflow-hidden cursor-pointer relative group"
                  onClick={() => openLightbox(2)}
                >
                  <img
                    src={displayPhotos[2]}
                    alt="Room 3"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {displayPhotos.length > 3 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold">+{displayPhotos.length - 2} Photos</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex h-[120px] items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                  No Image
                </div>
              )}
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
 
      {/* Lightbox / Slider Pop-up Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
 
          {/* Left Navigation Arrow */}
          <button 
            onClick={prevPhoto}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
 
          {/* Active Image */}
          <div 
            className="max-w-4xl max-h-[85vh] w-full flex items-center justify-center relative z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={displayPhotos[activePhotoIndex]} 
              alt={`Room Photo ${activePhotoIndex + 1}`} 
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl selection:bg-transparent"
            />
            {/* Index indicator */}
            <div className="absolute bottom-[-40px] text-white/70 text-sm font-medium">
              Photo {activePhotoIndex + 1} of {displayPhotos.length}
            </div>
          </div>
 
          {/* Right Navigation Arrow */}
          <button 
            onClick={nextPhoto}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-50"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
};
 
export default EditRoom;