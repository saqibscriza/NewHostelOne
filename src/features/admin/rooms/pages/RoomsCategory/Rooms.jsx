import React, { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Plus } from "lucide-react";
import RoomCard from "../../components/RoomCard";
import RoomsAddCategoryModal from "./RoomsAddCategoryModal";
import AddOccupancyModal from "./AddOccupancyModal";
import EditCategoryModal from "./EditCategoryModal";
import { toast } from "react-hot-toast";
import DefaultTable from "../../../../../components/DefaultTable/DefaultTable";
import {
  getAllActiveCategoryApi,
  deleteCategoryById,
  getAllOccupancyApi,
  getAllAmenitiesApi,
} from "../../../../../utils/utils";

const Rooms = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openOccupancyModal, setOpenOccupancyModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [occupancyList, setOccupancyList] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [updateCheck, setUpdateCheck] = useState();
  const [updateCategory, setUpdateCategory] = useState("");
  // console.log('my occupancy value-0', updateCheck)

  // ================= FETCH CATEGORY =================
  const fetchOccupancy = async () => {
    try {
      const res = await getAllOccupancyApi();
      // console.log('fetch occupancyyy listtt', res)
      setOccupancyList(res?.data?.Occupancy || []);
    } catch (error) {
      console.log(error);
      setOccupancyList([]);
    }
  };

  const fetchAmenities = async () => {
    try {
      const res = await getAllAmenitiesApi();
      console.log("my aminitess get all...........", res);
      const list = Array.isArray(res?.data) ? res.data : [];

      const formatted = list.map((item) => ({
        id: item.id,
        name: item.amenitiesName,
        icon: item.amenitiesIconUrl,
      }));

      setAmenitiesList(formatted);

      return formatted;
    } catch (error) {
      console.log(error);
      setAmenitiesList([]);

      return [];
    }
  };
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllActiveCategoryApi();
      console.log("CATEGORY RAW 👉", res?.data);

      // ✅ FIX: correct key from response
      const list = res?.data?.Category || [];

      if (!Array.isArray(list)) {
        setCategories([]);
        return;
      }

      const formatted = list.map((item) => ({
        id: item.id,

        name: item.categoryName,

        occupancyType: item.occupancyName || "N/A",

        price: `₹${item.monthlyRentPerBed}`,

        description: item.description || "No description available",

        amenities:
          item.amenities?.map((a) =>
            a.amenitiesName === "[object FormData]"
              ? "Unknown"
              : a.amenitiesName,
          ) || [],

        status: item.status ? "Active" : "Inactive",
      }));
      console.log("FORMATTED 👉", formatted);

      setCategories(formatted);
    } catch (error) {
      console.log("CATEGORY ERROR 👉", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const GetDataFromChild = (value) => {
    setUpdateCategory(value);
    console.log("value in data from childdd", value);
  };
  // delete

  const handleDeleteCategory = async (id) => {
    try {
      const response = await deleteCategoryById(id);

      console.log("DELETE CATEGORY RESPONSE 👉", response);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);

        // refresh categories
        fetchCategories();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  const UpdateOccupency = (value) => {
    setUpdateCheck(value);
  };

  useEffect(() => {
    fetchCategories();
    fetchOccupancy();
    fetchAmenities();
  }, [updateCheck]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        {" "}
        <div>
          <h1 className="text-3xl font-bold">Room Category</h1>
          <p className="text-muted-foreground">
            Manage and configure all room categories
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button
            onClick={() => setOpenOccupancyModal(true)}
            className="cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Occupancy
          </Button>

          <Button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* ================= UI STATES ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
        {" "}
        {/* 🔄 LOADING */}
        {loading && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            Loading categories...
          </div>
        )}
        {/* ❌ NO DATA */}
        {!loading && categories.length === 0 && (
          <div className="col-span-full">
            <DefaultTable
              height="400px"
              title="No Categories Found"
              description="There are currently no room categories available. Add a new category to get started."
              buttonText="Add Category"
              onButtonClick={() => setOpenModal(true)}
            />
          </div>
        )}
        {/* ✅ DATA */}
        {!loading &&
          categories.length > 0 &&
          categories.map((category, index) => (
            <RoomCard
              index={index}
              key={category.id}
              category={category}
              onEdit={() => {
                setSelectedCategory(category);
                setEditModal(true);
              }}
              onDelete={() => handleDeleteCategory(category.id)}
              GetDataFromChild={GetDataFromChild}
            />
          ))}
      </div>

      {/* MODALS */}
      <RoomsAddCategoryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCategoryAdded={fetchCategories}
        occupancyList={occupancyList}
        amenitiesList={amenitiesList}
        fetchAmenities={fetchAmenities}
      />

      <AddOccupancyModal
        isOpen={openOccupancyModal}
        onClose={() => setOpenOccupancyModal(false)}
        UpdateOccupency={UpdateOccupency}
      />

      <EditCategoryModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        category={selectedCategory}
        onCategoryUpdated={fetchCategories}
        occupancyList={occupancyList}
        amenitiesList={amenitiesList}
        fetchAmenities={fetchAmenities}
        updateCategory={updateCategory}
      />
    </div>
  );
};

export default Rooms;
