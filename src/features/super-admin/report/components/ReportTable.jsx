
import { Badge } from "../../../../components/ui/Badge";

const reports = [
  {
    hostel: "Green Valley",
    revenue: "₹12,000",
    students: 120,
    status: "ACTIVE",
  },
  {
    hostel: "Urban Stay",
    revenue: "₹8,500",
    students: 80,
    status: "ACTIVE",
  },
];

export default function ReportTable() {
  return (
    <div className="bg-card border border-border rounded-xl">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Report List</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="p-4 text-left text-xs text-muted-foreground">
                HOSTEL
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                REVENUE
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                STUDENTS
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                STATUS
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-4 text-foreground">{r.hostel}</td>
                <td className="p-4 text-foreground">{r.revenue}</td>
                <td className="p-4 text-foreground">{r.students}</td>
                <td className="p-4">
                  <Badge>{r.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
