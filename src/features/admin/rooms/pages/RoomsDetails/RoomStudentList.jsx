import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/ui/button";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Badge } from "../../../../../components/ui/Badge";
import { getStudentsByRoomId } from "../../../../../utils/utils";
import { User, Phone, Mail, ArrowLeft } from "lucide-react";
 
const RoomStudentList = () => {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await getStudentsByRoomId(roomId);
      console.log("FETCH STUDENTS BY ROOM RESPONSE 👉", response);
      const list =
        response?.data?.data?.students ||
        response?.data?.students ||
        [];
      console.log("Students List 👉", list);
      setStudents(list);
    } catch (error) {
      console.log("FETCH STUDENTS BY ROOM ERROR 👉", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (roomId) fetchStudents();
  }, [roomId]);
 
  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
 
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Room Students</h1>
        <p className="text-muted-foreground text-sm">
          All students assigned to Room ID: <span className="font-medium text-foreground">{roomId}</span>
        </p>
      </div>
 
      {/* Loading */}
      {loading && (
        <div className="text-center py-10 text-muted-foreground">
          Loading students...
        </div>
      )}
 
      {/* Empty State */}
      {!loading && students.length === 0 && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <User className="w-10 h-10 opacity-30" />
            <p className="text-sm">No students found for this room.</p>
          </CardContent>
        </Card>
      )}
 
      {/* Students Grid */}
      {!loading && students.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map((student, index) => (
            <Card key={student?.studentId || student?.id || index}>
              <CardContent className="p-5 space-y-4">
                {/* Student Header */}
<div className="flex items-center gap-3">
  {student?.photo ? (
    <img
      src={student.photo}
      alt={student?.fullName || "Student"}
      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
      onError={(e) => {
        e.target.onerror = null;
        e.target.src =
          "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(student?.fullName || "Student");
      }}
    />
  ) : (
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
      <User className="w-5 h-5 text-muted-foreground" />
    </div>
  )}

  <div>
    <h4 className="font-semibold text-slate-800 text-sm">
      {student?.fullName || "N/A"}
    </h4>

    <p className="text-xs text-muted-foreground">
      {student?.room?.roomNameNumber
        ? `Room ${student.room.roomNameNumber}`
        : "Student"}
    </p>
  </div>
</div>
 
                {/* Details */}
<div className="space-y-3 border-t border-slate-100 pt-3 text-sm">
  {/* Email */}
  <div className="flex items-center gap-2 text-muted-foreground">
    <Mail className="w-3.5 h-3.5 shrink-0" />
    <span className="truncate text-xs">
      {student?.contact?.email || "N/A"}
    </span>
  </div>

  {/* Phone */}
  <div className="flex items-center gap-2 text-muted-foreground">
    <Phone className="w-3.5 h-3.5 shrink-0" />
    <span className="text-xs">
      {student?.contact?.phone || "N/A"}
    </span>
  </div>

  {/* Status */}
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400">Status</span>
    <Badge className="bg-emerald-50 text-emerald-700 border-none font-semibold text-[10px] px-2 py-0.5 rounded-full">
      {student?.occupancyStatus || "N/A"}
    </Badge>
  </div>

  {/* Payment */}
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400">Payment</span>
    <span className="text-xs font-semibold text-slate-700">
      {student?.paymentStatus || "N/A"}
    </span>
  </div>

  {/* Joining Date */}
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400">Joining Date</span>
    <span className="text-xs font-semibold text-slate-700">
      {student?.dateOfJoining || "N/A"}
    </span>
  </div>

  {/* Room */}
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400">Room</span>
    <span className="text-xs font-semibold text-slate-700">
      {student?.room?.roomNameNumber || "N/A"}
    </span>
  </div>

  {/* Block */}
  <div className="flex justify-between items-center">
    <span className="text-xs text-slate-400">Block</span>
    <span className="text-xs font-semibold text-slate-700">
      {student?.room?.blockFloor || "N/A"}
    </span>
  </div>
</div>
 
                {/* View Profile Button */}
                <Button
                  variant="secondary"
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm"
                  onClick={() =>
                    navigate(`/admin/students/view/${student?.studentId || student?.id}`)
                  }
                >
                  View Full Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default RoomStudentList;