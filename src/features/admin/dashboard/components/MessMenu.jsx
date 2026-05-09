import { Card, CardContent } from "../../../../../src/components/ui/Card";
import { Coffee, Sun, Moon, Utensils } from "lucide-react";

export default function MessMenu({ data }) {
  return (
    <Card className="rounded-2xl border shadow-sm">
      <CardContent className="p-5 space-y-5">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today's Mess Menu</h2>
          <Utensils className="w-5 h-5 text-slate-500" />
        </div>

        {/* ITEM */}
        <div className="flex items-center gap-4">
          {/* ICON BOX */}
          <div className="h-12 w-12 rounded-xl bg-blue-50 flex flex-col items-center justify-center text-blue-600 text-xs font-semibold">
            BRK
            <Coffee className="w-4 h-4 mt-1" />
          </div>

          {/* TEXT */}
          <div>
            <p className="font-semibold">Breakfast</p>
            <p className="text-sm text-slate-500">{data?.breakfast || "No breakfast"}</p>
          </div>
        </div>

        <div className="border-t" />

        {/* ITEM */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-yellow-50 flex flex-col items-center justify-center text-yellow-600 text-xs font-semibold">
            LUN
            <Sun className="w-4 h-4 mt-1" />
          </div>

          <div>
            <p className="font-semibold">Lunch</p>
            <p className="text-sm text-slate-500">
              {data?.lunch || "No lunch"}
            </p>
          </div>
        </div>

        <div className="border-t" />

        {/* ITEM */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 flex flex-col items-center justify-center text-indigo-600 text-xs font-semibold">
            DIN
            <Moon className="w-4 h-4 mt-1" />
          </div>

          <div>
            <p className="font-semibold">Dinner</p>
            <p className="text-sm text-slate-500">{data?.dinner || "No dinner"}</p>
          </div>
        </div>

        {/* BUTTON */}
        <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800 transition">
          Update Menu
        </button>
      </CardContent>
    </Card>
  );
}
