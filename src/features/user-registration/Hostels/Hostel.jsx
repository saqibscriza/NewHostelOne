import React from "react";
import HostelCard from "./HostelCard";

export default function Hostel() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Hostel Details</h1>
        <p className="text-muted-foreground text-sm">
          Check and book your listed hostel details
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">Filter by:</span>

          <button className="px-3 py-1.5 text-sm rounded-md bg-muted">
            All Location
          </button>

          <button className="px-3 py-1.5 text-sm rounded-md bg-muted">
            All Category
          </button>

          <button className="px-3 py-1.5 text-sm rounded-md bg-muted">
            Favorite
          </button>
        </div>

        <button className="text-sm text-muted-foreground">
          Clear all filters
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <HostelCard key={i} />
        ))}
      </div>
    </div>
  );
}
