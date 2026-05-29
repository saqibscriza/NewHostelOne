import { Card, CardContent } from "../../../../components/ui/Card";

export default function OccupancyChart({ data = [], filter, setFilter }) {
  const colors = [
    "bg-slate-900",
    "bg-slate-950",
    "bg-slate-600",
    "bg-slate-400",
    "bg-slate-700",
    "bg-slate-600",
  ];

  const maxValue = Math.max(
    ...data.map((item) => item?.occupancyPercentage || 0),
    0,
  );

  return (
    <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold text-foreground">Room Occupancy</h2>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-input bg-background text-foreground px-3 pr-10 py-1.5 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring"
          >
            <option value="7">This Week</option>
            <option value="15">15 Days</option>
            <option value="30">30 Days</option>
          </select>
        </div>

        <div className="flex items-end justify-between h-60 gap-3 overflow-visible relative">
          {" "}
          {data?.map((value, i) => {
            const scaledHeight =
              maxValue > 0 ? (value?.occupancyPercentage / maxValue) * 180 : 0;

            return (
              <div
                key={i}
                className="flex flex-col items-center justify-end gap-2 flex-1 min-w-[70px]"
              >
                <div className="relative group flex flex-col items-center">
                  <div
                    className={`w-[60px] rounded-md transition-all duration-300 hover:opacity-80 hover:scale-105 cursor-pointer ${
                      colors[i % colors.length]
                    }`}
                    style={{
                      height: `${scaledHeight}px`,
                      minHeight: "12px",
                    }}
                  />

                  {/* CUSTOM TOOLTIP */}
                  <div className="absolute bottom-[115%] left-1/2 z-50 hidden w-56 -translate-x-1/2 rounded-xl border border-border bg-card/95 backdrop-blur p-3 shadow-2xl group-hover:block">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Month</span>
                        <span className="font-medium text-foreground">
                          {value?.month}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Occupied Beds
                        </span>
                        <span className="font-medium text-foreground">
                          {value?.occupiedBeds}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Beds
                        </span>
                        <span className="font-medium text-foreground">
                          {value?.totalBeds}
                        </span>
                      </div>

                      <div className="border-t border-border pt-2 flex justify-between">
                        <span className="text-muted-foreground">Occupancy</span>
                        <span className="font-semibold text-foreground">
                          {value?.occupancyPercentage}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground whitespace-nowrap mt-2">
                  {value?.month?.split(" ")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
