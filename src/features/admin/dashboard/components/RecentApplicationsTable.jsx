import { Card, CardContent } from "../../../../components/ui/Card";
import { Eye } from "lucide-react";

const data = [
  {
    name: "Sandeep",
    course: "Computer Science",
    room: "Double AC",
    status: "Pending",
  },
  {
    name: "Rakesh",
    course: "Business Management",
    room: "Single Non-AC",
    status: "Reviewing",
  },
  {
    name: "Amit",
    course: "Computer Science",
    room: "Double AC",
    status: "Pending",
  },
  {
    name: "Mukesh",
    course: "Business Management",
    room: "Single Non-AC",
    status: "Reviewing",
  },
];

export default function RecentApplicationsTable() {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-0">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Student Applications</h2>
          <button className="text-sm text-slate-500 hover:underline">
            View All
          </button>
        </div>

        {/* TABLE HEADER */}
        <div className="grid grid-cols-5 px-5 py-3 text-xs font-semibold text-slate-400 uppercase bg-slate-50">
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
            className="grid grid-cols-5 items-center px-5 py-4 border-t"
          >
            {/* NAME + AVATAR */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-200 overflow-hidden">
                <img
                  src="https://i.pravatar.cc/40"
                  alt="avatar"
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="font-medium">{item.name}</p>
            </div>

            {/* COURSE */}
            <p className="text-sm text-slate-600">{item.course}</p>

            {/* ROOM */}
            <p className="text-sm text-slate-600">{item.room}</p>

            {/* STATUS */}
            <div>
              <span
                className={`text-xs px-3 py-1 rounded-md font-medium ${
                  item.status === "Pending"
                    ? "bg-slate-200 text-slate-700"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {item.status.toUpperCase()}
              </span>
            </div>

            {/* ACTION */}
            <div className="flex justify-end">
              <Eye className="w-5 h-5 text-slate-500 cursor-pointer" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
