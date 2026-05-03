

// import React, { useState, useEffect } from "react";
// import { Button } from "../../../../../components/ui/button";
// import { Plus } from "lucide-react";
// import RoomCard from "../../components/RoomCard";
// import RoomsAddCategoryModal from "./RoomsAddCategoryModal";
// import AddOccupancyModal from "./AddOccupancyModal";
// import EditCategoryModal from "./EditCategoryModal";
// import { getAllCategoryApi } from "../../../../../utils/utils";

// const Rooms = () => {
//   const [openModal, setOpenModal] = useState(false);
//   const [openOccupancyModal, setOpenOccupancyModal] = useState(false);
//   const [editModal, setEditModal] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const [categories, setCategories] = useState([]);

//   // ================= FETCH CATEGORY =================
//   const fetchCategories = async () => {
//     try {
//       const res = await getAllCategoryApi();

//       console.log("CATEGORY RAW 👉", res?.data);

//       const list = res?.data || [];

//       if (!Array.isArray(list)) {
//         setCategories([]);
//         return;
//       }

//       const formatted = list.map((item) => ({
//         id: item.id,
//         name: item.categoryName,
//         occupancyType: item.occupancyName || "N/A",
//         price: `₹${item.monthlyRentPerBed}`,
//         amenities:
//           item.amenities?.map((a) => a.amenitiesName) || [],
//         status: item.status ? "Active" : "Inactive",
//       }));

//       console.log("FORMATTED 👉", formatted);

//       setCategories(formatted);
//     } catch (error) {
//       console.log("CATEGORY ERROR 👉", error);
//       setCategories([]);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="max-w-7xl mx-auto space-y-8 pb-12 p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold">Room Category</h1>
//           <p className="text-muted-foreground">
//             Manage and configure all room categories
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <Button onClick={() => setOpenOccupancyModal(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Add Occupancy
//           </Button>

//           <Button onClick={() => setOpenModal(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Add Category
//           </Button>
//         </div>
//       </div>

//       {/* ✅ CARDS FROM API */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {categories.map((category) => (
//           <RoomCard
//             key={category.id}
//             category={category}
//             onEdit={() => {
//               setSelectedCategory(category);
//               setEditModal(true);
//             }}
//           />
//         ))}
//       </div>

//       {/* MODALS */}
//       <RoomsAddCategoryModal
//         isOpen={openModal}
//         onClose={() => setOpenModal(false)}
//       />

//       <AddOccupancyModal
//         isOpen={openOccupancyModal}
//         onClose={() => setOpenOccupancyModal(false)}
//       />

//       <EditCategoryModal
//         isOpen={editModal}
//         onClose={() => setEditModal(false)}
//         category={selectedCategory}
//       />
//     </div>
//   );
// };

// export default Rooms;





import React, { useState, useEffect } from "react";
import { Button } from "../../../../../components/ui/button";
import { Plus } from "lucide-react";
import RoomCard from "../../components/RoomCard";
import RoomsAddCategoryModal from "./RoomsAddCategoryModal";
import AddOccupancyModal from "./AddOccupancyModal";
import EditCategoryModal from "./EditCategoryModal";
import { getAllCategoryApi } from "../../../../../utils/utils";

const Rooms = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openOccupancyModal, setOpenOccupancyModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH CATEGORY =================
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getAllCategoryApi();

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
        occupancyType: item.occupancyId || "N/A",
        price: `₹${item.monthlyRentPerBed}`,

        // ✅ FIX: handle [object FormData]
        amenities:
          item.amenities?.map((a) =>
            a.amenitiesName === "[object FormData]"
              ? "Unknown"
              : a.amenitiesName
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

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Room Category</h1>
          <p className="text-muted-foreground">
            Manage and configure all room categories
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => setOpenOccupancyModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Occupancy
          </Button>

          <Button onClick={() => setOpenModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* ================= UI STATES ================= */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 🔄 LOADING */}
        {loading && (
          <div className="col-span-full text-center py-10 text-muted-foreground">
            Loading categories...
          </div>
        )}

        {/* ❌ NO DATA */}
        {!loading && categories.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-lg font-medium">
              No categories found
            </p>
            <p className="text-sm text-muted-foreground">
              Click "Add Category" to create one
            </p>
          </div>
        )}

        {/* ✅ DATA */}
        {!loading &&
          categories.length > 0 &&
          categories.map((category) => (
            <RoomCard
              key={category.id}
              category={category}
              onEdit={() => {
                setSelectedCategory(category);
                setEditModal(true);
              }}
            />
          ))}
      </div>

      {/* MODALS */}
      <RoomsAddCategoryModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />

      <AddOccupancyModal
        isOpen={openOccupancyModal}
        onClose={() => setOpenOccupancyModal(false)}
      />

      <EditCategoryModal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default Rooms;