import { Input } from "../../../../components/ui/input";

export default function StudentFilters() {
  return (
    <div className="flex items-center gap-3 bg-white border rounded-xl p-4">
      <span className="text-sm text-muted-foreground">Filter by:</span>

      <select className="h-9 px-3 rounded-md border text-sm">
        <option>All Location</option>
      </select>

      <select className="h-9 px-3 rounded-md border text-sm">
        <option>All Status</option>
      </select>

      <div className="relative">
        <Input placeholder="Search" className="pl-3 w-64" />
      </div>

      <button className="ml-auto text-sm text-muted-foreground hover:text-foreground">
        Clear all filters
      </button>
    </div>
  );
}
