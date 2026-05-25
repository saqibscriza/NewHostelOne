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
import { getByIdCategory } from "../../../../utils/utils";

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
const RoomCard = ({ category, onEdit, onDelete, GetDataFromChild, index }) => {
  console.log("category all dataa is here", category);

  const MyGetCategoryById = async (id) => {
    // console.log('category by id======',id)
    try {
      const response = await getByIdCategory(id);
      console.log("get by id category apiiii", response);
      if (response?.data?.status === "success") {
        GetDataFromChild(response?.data?.Category);
        // toast.success(response?.data?.message);
        // refresh categories
      } else {
        // toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  console.log("data of category get all", category);
  return (
    <div
      className="
relative overflow-visible
rounded-2xl border border-border/50
bg-gradient-to-br from-background to-muted/30
p-6
shadow-sm
backdrop-blur
transition-all duration-300
hover:-translate-y-2
hover:shadow-2xl
hover:border-primary/30
group
"
    >
      {/* Top */}
      <div className="flex justify-between items-start">
        <span
          className="
px-3 py-1
text-[11px] font-semibold uppercase tracking-wider
rounded-full
bg-primary/10 text-primary
border border-primary/20
"
        >
          {category.occupancyType}
        </span>

        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {category.price}
          </p>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
            per month
          </p>
        </div>
      </div>
      {/* Title */}
      <h3 className="mt-5 text-xl font-bold tracking-tight text-foreground">
        {category.name}
      </h3>
      {/* Description (optional static) */}
      <div className="relative mt-2 group/tooltip">
        <p className="text-sm text-muted-foreground cursor-pointer">
          {category.description?.length > 37
            ? `${category.description.substring(0, 37)}.....`
            : category.description}
        </p>

        <div
          className="
absolute bottom-full left-1/2 -translate-x-1/2 mb-4
z-[9999] w-72 rounded-xl bg-black text-white
text-xs p-4 shadow-2xl
opacity-0 invisible
group-hover/tooltip:visible
group-hover/tooltip:opacity-100
transition-all duration-300
"
        >
          <p className="font-semibold mb-2 text-gray-300">Room Description</p>

          <p className="leading-relaxed break-words">{category.description}</p>
        </div>
      </div>
      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-4">
        {category.amenities.map((amenity, i) => (
          <span
            key={i}
            className="
flex items-center gap-1.5
rounded-full
border border-border/50
bg-background/80
px-3 py-1.5
text-xs font-medium
text-muted-foreground
transition-all duration-200
hover:border-primary/30
hover:bg-primary/5
hover:text-primary
"
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              MyGetCategoryById(category.id);
              onEdit();
            }}
            className="
  flex h-9 w-9 items-center justify-center
  rounded-full
  border border-border
  bg-background
  text-muted-foreground
  transition-all duration-200
  hover:border-primary/30
  hover:bg-primary/10
  hover:text-primary
  hover:scale-110
"
          >
            <Pencil
              className="w-4 h-4"
              // onClick={() => MyGetCategoryById(category.id)}
            />
          </button>
          <button
            onClick={onDelete}
            className="
  flex h-9 w-9 items-center justify-center
  rounded-full
  border border-border
  bg-background
  text-muted-foreground
  transition-all duration-200
  hover:border-red-500/30
  hover:bg-red-500/10
  hover:text-red-500
  hover:scale-110
"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
