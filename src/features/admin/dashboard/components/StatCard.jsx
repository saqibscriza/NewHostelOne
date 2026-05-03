import { Card, CardContent } from "../../../../components/ui/Card";

export default function StatCard({ title, value, icon, badge }) {
  return (
    <Card className="rounded-xl border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-slate-100 rounded-lg">{icon}</div>

          {badge && (
            <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-md">
              {badge}
            </span>
          )}
        </div>

        <div>
          <p className="text-xs text-slate-400 uppercase">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
