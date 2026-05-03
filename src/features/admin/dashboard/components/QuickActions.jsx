import { Card, CardContent } from "../../../../components/ui/Card";

export default function QuickActions() {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-4 space-y-3">
        <h2 className="font-semibold">Quick Actions</h2>

        <button className="w-full bg-slate-900 text-white py-2 rounded-md">
          Add Student
        </button>

        <button className="w-full border py-2 rounded-md">Collect Fee</button>

        <button className="w-full border py-2 rounded-md">
          Maintenance Ticket
        </button>
      </CardContent>
    </Card>
  );
}
