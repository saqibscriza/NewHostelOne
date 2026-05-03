
import PageHeader from "../../../../shared/components/PageHeader";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/Badge";
import { Filter } from "lucide-react";
import { useFetch } from "../../../../shared/hooks/useFetch";
import { getReportStats } from "../services/reportService";

import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ReportPage() {
  const { data, loading } = useFetch(getReportStats);

  if (loading) {
    return <p className="p-6 text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <PageHeader
        title="Reports"
        desc="Comprehensive overview of revenue, growth, and performance across all hostels."
        action={
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>

            <Button className="bg-primary text-primary-foreground hover:opacity-90">
              Download All
            </Button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {data.stats.map((s) => (
          <Card key={s.title} className="bg-card border border-border">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">{s.title}</p>

              <div className="flex justify-between items-center mt-1">
                <p className="text-xl font-bold text-foreground">{s.value}</p>

                <span className="text-xs text-muted-foreground">
                  {s.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Right Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart */}
        <Card className="lg:col-span-2 bg-card border border-border">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="font-semibold text-foreground">Growth Trends</h3>

                <p className="text-xs text-muted-foreground">
                  Revenue and User Growth over the last 30 days
                </p>
              </div>

              <div className="flex gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  Revenue
                </span>

                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-muted rounded-full"></span>
                  Growth
                </span>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chart}>
                  <XAxis dataKey="month" />
                  <Tooltip />

                  <Bar
                    dataKey="revenue"
                    fill="var(--color-primary)"
                    radius={[6, 6, 0, 0]}
                  />

                  <Bar
                    dataKey="growth"
                    fill="var(--color-muted)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Hostel */}
        <Card className="bg-card border border-border">
          <CardContent className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">
                Revenue by Hostel
              </h3>

              <p className="text-xs text-muted-foreground">
                Monthly performance
              </p>
            </div>

            {data.performance.map((p) => (
              <div key={p.name}>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground">{p.name}</span>
                  <span className="font-medium text-foreground">
                    {p.revenue}
                  </span>
                </div>

                <div className="h-2 bg-muted rounded mt-1">
                  <div
                    className="h-2 bg-primary rounded"
                    style={{ width: `${p.occupancy}%` }}
                  />
                </div>
              </div>
            ))}

            <p className="text-xs text-muted-foreground mt-3 cursor-pointer hover:text-foreground">
              View Detailed Breakdown →
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card className="bg-card border border-border">
        <CardContent className="p-0">
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">
              Hostel Performance
            </h3>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Regions
              </Button>

              <Button variant="outline" size="sm">
                Premium Only
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="p-4 text-left">HOSTEL NAME</th>
                  <th className="p-4 text-left">REGION</th>
                  <th className="p-4 text-left">REVENUE</th>
                  <th className="p-4 text-left">OCCUPANCY</th>
                  <th className="p-4 text-left">STATUS</th>
                  <th className="p-4 text-left">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {data.performance.map((p) => (
                  <tr key={p.name} className="border-t border-border">
                    <td className="p-4 font-medium flex items-center gap-3 text-foreground">
                      <div className="w-8 h-8 bg-muted rounded"></div>
                      {p.name}
                    </td>

                    <td className="p-4 text-foreground">{p.region}</td>
                    <td className="p-4 text-foreground">{p.revenue}</td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{p.occupancy}%</span>

                        <div className="w-20 h-2 bg-muted rounded">
                          <div
                            className="h-2 bg-primary rounded"
                            style={{ width: `${p.occupancy}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <Badge>{p.status}</Badge>
                    </td>

                    <td className="p-4 text-muted-foreground">•••</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span>
              Showing <span className="font-medium text-foreground">1–4</span>{" "}
              of <span className="font-medium text-foreground">24</span> hostels
            </span>

            <div className="flex items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                ‹
              </button>

              <button className="w-8 h-8 rounded-md bg-primary text-primary-foreground text-sm">
                1
              </button>

              <button className="w-8 h-8 rounded-md text-muted-foreground hover:bg-muted text-sm">
                2
              </button>

              <button className="w-8 h-8 rounded-md text-muted-foreground hover:bg-muted text-sm">
                3
              </button>

              <span className="px-1 text-muted-foreground">...</span>

              <button className="w-8 h-8 rounded-md text-muted-foreground hover:bg-muted text-sm">
                6
              </button>

              <button className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted">
                ›
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
