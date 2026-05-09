import { Card, CardContent } from "../../../../components/ui/Card";



export default function ActivityFeed({ data = [] }) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5 space-y-5">
        {/* HEADER */}
        <h2 className="text-lg font-semibold">Recent Activity</h2>

        {/* LIST */}
        <div className="space-y-5">
          {data.map((item, i) => (
            <div key={i} className="space-y-1">
              {/* TITLE */}
              <p className="text-sm font-semibold text-slate-800">
                {item.activityType?.replaceAll("_", " ")}
                <span className="font-normal text-slate-600">
                  {item.description}
                </span>
              </p>

              {/* TIME */}
              <p className="text-xs text-slate-400">{new Date(item.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
