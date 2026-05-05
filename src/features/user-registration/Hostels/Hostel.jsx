import React, { useEffect, useState } from "react";
import HostelCard from "./HostelCard";
import { getHostelAllData } from "../../../utils/utils";
import { toast } from "sonner";

export default function Hostel() {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    city: "",
    location: "",
    category: "",
    favorite: "",
  });

  // 🔥 API CALL
  const fetchHostels = async () => {
    setLoading(true);
    try {
      const response = await getHostelAllData(filters);

      if (response?.data?.status === "success") {
        setHostels(response?.data?.hostels || []);
      } else {
        toast.error(response?.data?.message || "Failed to fetch");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  // 🔁 initial load + filter change
  useEffect(() => {
    fetchHostels();
  }, [filters]);

  // 🎯 filter handlers
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      location: "",
      category: "",
      favorite: "",
    });
  };

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

          <button
            onClick={() => handleFilterChange("location", "")}
            className="px-3 py-1.5 text-sm rounded-md bg-muted"
          >
            All Location
          </button>

          <button
            onClick={() => handleFilterChange("category", "")}
            className="px-3 py-1.5 text-sm rounded-md bg-muted"
          >
            All Category
          </button>

          <button
            onClick={() => handleFilterChange("favorite", true)}
            className="px-3 py-1.5 text-sm rounded-md bg-muted"
          >
            Favorite
          </button>
        </div>

        <button
          onClick={clearFilters}
          className="text-sm text-muted-foreground"
        >
          Clear all filters
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">
          Loading...
        </div>
      ) : hostels.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No hostels found
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hostels.map((hostel) => (
            <HostelCard
              key={hostel._id || hostel.id}
              hostel={{
                id: hostel._id || hostel.id,
                name: hostel.name || hostel.hostelName,
                image: hostel.image || hostel.hostelImage,
                price: hostel.price || "", // since not available
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
