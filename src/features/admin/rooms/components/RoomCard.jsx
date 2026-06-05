import React from "react";
import {
  Wifi,
  Utensils,
  Sparkles,
  Snowflake,
  WashingMachine,
  Pencil,
  Trash2,
  AlertCircle,
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

flex flex-col
h-full
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
      <div className="mt-3 flex items-start gap-2 w-full">
        {/* DESCRIPTION */}
        <div className="flex-1 min-w-0">
          <p
            className="
      text-sm text-muted-foreground

      overflow-hidden
      text-ellipsis
      whitespace-nowrap
      "
          >
            {category.description}
          </p>
        </div>

        {/* TOOLTIP ICON */}
        <div className="relative group/tooltip shrink-0">
          <AlertCircle className="w-5 h-5 text-slate-700 cursor-pointer" />

          {/* TOOLTIP */}
          <div
            className="
absolute bottom-full right-0 mb-4
hidden group-hover/tooltip:block

w-[340px]
max-h-[260px]
overflow-y-auto

rounded-2xl
bg-black text-white

p-5

text-sm leading-7
break-all

shadow-2xl
z-[9999]
"
          >
            <p className="whitespace-pre-wrap">{category.description}</p>
          </div>
        </div>
      </div>
      {/* Amenities */}
      <div className="flex flex-wrap gap-2 mt-4 min-h-[48px]">
        {" "}
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
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-border">
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
  cursor-pointer
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
  cursor-pointer
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
