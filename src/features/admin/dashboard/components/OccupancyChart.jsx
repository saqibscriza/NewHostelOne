import { Card, CardContent } from "../../../../components/ui/Card";
import { ChevronDown } from "lucide-react";
import { getDashboardAdminApi } from "../../../../utils/utils";
import { useEffect, useState } from "react";

export default function OccupancyChart({ data = [] }) {
  const colors = [
    "bg-slate-900",
    "bg-slate-950",
    "bg-slate-600",
    "bg-slate-400",
    "bg-slate-700",
    "bg-slate-600",
  ];

  // console.log("my bar data in bar component------", barData);

  return (
    <Card className="rounded-xl">
      <CardContent className="p-4 ">
        <div className="flex justify-between mb-4">
          <h2 className="font-semibold">Room Occupancy</h2>
          <button className="flex items-center gap-2 border border-border px-3 py-1.5 rounded-lg text-sm bg-backgraound hover:bg-slate-50">
            This Week
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        <div className="flex items-end justify-between h-60">
          {data?.map((value, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-24 rounded-md ${colors[i]}`}
                style={{
                  height: `${value?.occupancyPercentage * 10}px`,
                }}
              />
              <p className="text-xs text-slate-500">{value?.month?.split(" ")[0]}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
