import { Card, CardContent } from "../../../../components/ui/Card";

const activities = [
  {
    title: "Fee Received",
    description: "from James Wilson",
    time: "15 minutes ago",
  },
  {
    title: "Student Check-in",
    description: "Room 402B",
    time: "1 hour ago",
  },
  {
    title: "New Complaint",
    description: "AC not working",
    time: "3 hours ago",
  },
];

export default function ActivityFeed() {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5 space-y-5">
        {/* HEADER */}
        <h2 className="text-lg font-semibold">Recent Activity</h2>

        {/* LIST */}
        <div className="space-y-5">
          {activities.map((item, i) => (
            <div key={i} className="space-y-1">
              {/* TITLE */}
              <p className="text-sm font-semibold text-slate-800">
                {item.title}{" "}
                <span className="font-normal text-slate-600">
                  {item.description}
                </span>
              </p>

              {/* TIME */}
              <p className="text-xs text-slate-400">{item.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
