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
      // Handle both array response and nested data
      const list =
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data?.data?.content)
          ? response.data.data.content
          : [];
      setStudents(list);
    } catch (error) {
      console.log("FETCH STUDENTS BY ROOM ERROR 👉", error);
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
                  {student?.photo || student?.studentPhoto || student?.profileImage ? (
                    <img
                      src={student?.photo || student?.studentPhoto || student?.profileImage}
                      alt={student?.name || student?.studentName}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      {student?.name || student?.studentName || "—"}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {student?.role || student?.courseName || "Student"}
                    </p>
                  </div>
                </div>
 
                {/* Details */}
                <div className="space-y-2 border-t border-slate-100 pt-3 text-sm">
                  {(student?.email || student?.studentEmail) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate text-xs">
                        {student?.email || student?.studentEmail}
                      </span>
                    </div>
                  )}
                  {(student?.phone || student?.mobileNumber || student?.contactNumber) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-xs">
                        {student?.phone || student?.mobileNumber || student?.contactNumber}
                      </span>
                    </div>
                  )}
 
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-xs text-slate-400">Status</span>
                    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-none font-semibold text-[10px] px-2 py-0.5 rounded-full">
                      {student?.status || "Active"}
                    </Badge>
                  </div>
 
                  {(student?.moveInDate || student?.joiningDate) && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-400">Move-in</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {student?.moveInDate || student?.joiningDate}
                      </span>
                    </div>
                  )}
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