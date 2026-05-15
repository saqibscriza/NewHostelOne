import { Card, CardContent } from "../../../../components/ui/Card";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecentApplicationsTable({ data = [] }) {
  const navigate = useNavigate();

  return (
    <Card className="rounded-2xl border bg-card text-card-foreground shadow-sm">
  <CardContent className="p-0">
    {/* HEADER */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground">
        Recent Student Applications
      </h2>

      <button
        onClick={() => navigate("/admin/students")}
        className="text-sm cursor-pointer text-muted-foreground hover:text-foreground hover:underline transition-colors"
      >
        View All
      </button>
    </div>

    {/* TABLE HEADER */}
    <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold text-muted-foreground uppercase bg-muted/40">
      <p>Student Name</p>
      <p>Course</p>
      <p>Room Pref.</p>
      <p>Status</p>
      <p className="text-right">Action</p>
    </div>

    {/* ROWS */}
    {data.map((item, i) => (
      <div
        key={i}
        className="grid grid-cols-5 items-center px-5 py-4 border-t border-border"
      >
        {/* NAME + AVATAR */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
            <img
              src="https://i.pravatar.cc/40"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <p className="font-medium text-foreground">
            {item.fullName}
          </p>
        </div>

        {/* COURSE */}
        <p className="text-sm text-muted-foreground">
          {item.course || "N/A"}
        </p>

        {/* ROOM */}
        <p className="text-sm text-muted-foreground">
          {item.roomPreference || "N/A"}
        </p>

        {/* STATUS */}
        <div>
          <span
            className={`text-xs px-3 py-1 rounded-md font-medium bg-muted text-foreground`}
          >
            {item.status.toUpperCase()}
          </span>
        </div>

        {/* ACTION */}
        <div className="flex justify-end">
          <Eye
            onClick={() =>
              navigate(`/admin/students/view/${item.studentId || item.id}`)
            }
            className="w-5 h-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
          />
        </div>
      </div>
    ))}
  </CardContent>
</Card>
  );
}
