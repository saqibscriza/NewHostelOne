import React from "react";
import {
  Wifi,
  Utensils,
  Sparkles,
  Snowflake,
  WashingMachine,
  Pencil,
  Trash2,
} from "lucide-react";

export const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case "WiFi":
      return <Wifi className="w-4 h-4" />;
    case "Meals":
      return <Utensils className="w-4 h-4" />;
    case "Cleaning":
      return <Sparkles className="w-4 h-4" />;
    case "AC":
      return <Snowflake className="w-4 h-4" />;
    case "Laundry":
      return <WashingMachine className="w-4 h-4" />;
    default:
      return null;
  }
};

// const RoomCard = ({ category }) => {
const RoomCard = ({ category, onEdit }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition">
      {/* Top */}
      <div className="flex justify-between items-start">
        <span className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground">
          {category.occupancyType}
        </span>

        <div className="text-right">
          <p className="text-lg font-semibold text-foreground">
            {category.price}
          </p>
          <p className="text-xs text-muted-foreground">per month</p>
        </div>
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-semibold text-foreground">
        {category.name}
      </h3>

      {/* Description (optional static) */}
      <p className="text-sm text-muted-foreground mt-2">
        Comfortable living space with essential amenities.
      </p>

      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-4">
        {category.amenities.map((amenity, i) => (
          <span
            key={i}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
          >
            {getAmenityIcon(amenity)}
            {amenity}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <span
            className={`w-2 h-2 rounded-full ${
              category.status === "Active" ? "bg-green-500" : "bg-gray-400"
            }`}
          ></span>
          {category.status}
        </span>

        <div className="flex gap-3 text-muted-foreground">
          <button onClick={onEdit} className="hover:text-primary text-sm">
            <Pencil className="w-4 h-4" />
          </button>
          <button className="hover:text-destructive text-sm">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
