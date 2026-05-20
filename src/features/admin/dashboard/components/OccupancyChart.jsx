// import { Card, CardContent } from "../../../../components/ui/Card";
// import { ChevronDown } from "lucide-react";
// import { getDashboardAdminApi } from "../../../../utils/utils";
// import { useEffect, useState } from "react";

// export default function OccupancyChart() {
//   const [filter, setFilter] = useState("7");
//   const [chartData, setChartData] = useState([]);

//   const colors = [
//     "bg-slate-900",
//     "bg-slate-950",
//     "bg-slate-600",
//     "bg-slate-400",
//     "bg-slate-700",
//     "bg-slate-600",
//   ];

//   const fetchChartData = async () => {
//     try {
//       const res = await getDashboardAdminApi(filter);

//       console.log("API RESPONSE", res);
//       console.log("ROOM DATA", res?.data?.roomOccupancy);

//       setChartData(res?.data?.data?.roomOccupancy || []);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchChartData();
//   }, [filter]);
//   // console.log("my bar data in bar component------", barData);

//   return (
//     <Card className="rounded-xl border bg-card text-card-foreground shadow-sm">
//       <CardContent className="p-4">
//         <div className="flex justify-between mb-4">
//           <h2 className="font-semibold text-foreground">Room Occupancy</h2>

//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="border border-input bg-background text-foreground px-3 py-1.5 rounded-lg text-sm outline-none cursor-pointer focus:ring-2 focus:ring-ring"
//           >
//             <option value="7">This Week</option>
//             <option value="15">15 Days</option>
//             <option value="30">30 Days</option>
//           </select>
//         </div>
// <div className="flex items-end justify-between h-60 gap-3 overflow-hidden">
//   {chartData?.map((value, i) => {
//     const maxValue = Math.max(
//       ...chartData.map((item) => item?.occupancyPercentage || 0)
//     );

//     // scale height relative to biggest bar
//     const scaledHeight =
//       maxValue > 0
//         ? (value?.occupancyPercentage / maxValue) * 180
//         : 0;

//     return (
//       <div
//         key={i}
//         className="flex flex-col items-center justify-end gap-2 flex-1"
//       >
//         <div
//           className={`w-full max-w-[60px] rounded-md transition-all duration-300 ${
//             colors[i % colors.length]
//           }`}
//           style={{
//             height: `${scaledHeight}px`,
//             minHeight: "12px",
//           }}
//         />

//         <p className="text-xs text-muted-foreground whitespace-nowrap">
//           {value?.month?.split(" ")[0]}
//         </p>
//       </div>
//     );
//   })}
// </div>
//       </CardContent>
//     </Card>
//   );
// }

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

        <div className="flex items-end justify-between h-60 gap-3 overflow-hidden">
          {data?.map((value, i) => {
            const scaledHeight =
              maxValue > 0 ? (value?.occupancyPercentage / maxValue) * 180 : 0;

            return (
              <div
                key={i}
                className="flex flex-col items-center justify-end gap-2 flex-1"
              >
                <div
                  className={`w-full max-w-[60px] rounded-md transition-all duration-300 ${
                    colors[i % colors.length]
                  }`}
                  style={{
                    height: `${scaledHeight}px`,
                    minHeight: "12px",
                  }}
                />

                <p className="text-xs text-muted-foreground whitespace-nowrap">
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
