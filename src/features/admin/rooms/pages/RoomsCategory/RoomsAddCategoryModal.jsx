import React, { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import AddAmenityModal from "./AddAmenityModal";
import UpdateAmenityModal from "./UpdateAmenityModal";
import {
  getAllOccupancyApi,
  AddnewCategory,
  deleteAmenityById,
  getAllAmenitiesApi,
} from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const RoomsAddCategoryModal = ({ isOpen, onClose }) => {
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [openAmenityModal, setOpenAmenityModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [amenitiesListState, setAmenitiesListState] = useState([]);
  const [editingAmenity, setEditingAmenity] = useState(null);

  const [categoryName, setCategoryName] = useState("");
  const [occupancyId, setOccupancyId] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [description, setDescription] = useState("");
  const [occupancyList, setOccupancyList] = useState([]);
  const [errors, setErrors] = useState({
    categoryName: "",
    occupancyId: "",
    monthlyRent: "",
    description: "",
  });
  // ================= OCCUPANCY =================
  const fetchOccupancy = async () => {
    try {
      const res = await getAllOccupancyApi();

      console.log("OCCUPANCY RAW 👉", res?.data);

      const list = res?.data?.Occupancy || [];

      // console.log("OCCUPANCY LIST 👉", list);

      setOccupancyList(list);
    } catch (error) {
      console.log("OCCUPANCY ERROR 👉", error);
      setOccupancyList([]);
    }
  };

  // ================= AMENITIES =================
  const fetchAmenities = async () => {
    try {
      const res = await getAllAmenitiesApi();

      console.log("AMENITIES FULL 👉", res);
      console.log("AMENITIES DATA 👉", res?.data);

      // 🔴 STOP if API failed (YOUR CASE)
      if (res?.data?.status === "failure") {
        console.log("❌ API ERROR 👉", res.data.message);
        toast.error(res.data.message);
        setAmenitiesListState([]);
        return;
      }

      const list = Array.isArray(res.data) ? res.data : [];

      // console.log("FINAL LIST 👉", list);

      if (!Array.isArray(list)) {
        console.log("❌ Not array:", list);
        setAmenitiesListState([]);
        return;
      }

      const formatted = list.map((item) => ({
        id: item.id,
        name: item.amenitiesName,
        icon: item.amenitiesIconUrl,
      }));
      // console.log("FORMATTED 👉", formatted);

      setAmenitiesListState(formatted);
    } catch (error) {
      console.log("AMENITIES ERROR 👉", error);
      setAmenitiesListState([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAmenities();
      fetchOccupancy();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleAmenity = (name) => {
    setSelectedAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name],
    );
  };

  const handleDeleteAmenity = async (id) => {
    try {
      const res = await deleteAmenityById(id);

      console.log("DELETE RESPONSE 👉", res);

      if (res?.data?.status === "success") {
        toast.success(res.data.message);
        fetchAmenities();
      } else {
        toast.error(res?.data?.message);
      }
    } catch (error) {
      console.log("DELETE ERROR 👉", error);
      toast.error("Delete failed");
    }
  };

  const handleUpdateAmenity = (updatedAmenity) => {
    console.log("UPDATED RECEIVED 👉", updatedAmenity);

    setAmenitiesListState((prev) =>
      prev.map((item) =>
        item.id === updatedAmenity.id
          ? {
              ...item,
              name: String(updatedAmenity.name), // 🔒 FORCE CLEAN STRING
              icon: updatedAmenity.icon,
            }
          : item,
      ),
    );
  };

  const validateForm = () => {
    let newErrors = {};

    // Category Name
    if (!categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    }

    // Occupancy
    if (!occupancyId) {
      newErrors.occupancyId = "Please select occupancy";
    }

    // Monthly Rent
    if (!monthlyRent) {
      newErrors.monthlyRent = "Monthly rent is required";
    } else if (!/^\d+$/.test(monthlyRent)) {
      newErrors.monthlyRent = "Only numbers are allowed";
    }

    // Description
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCategory = async () => {
    if (!validateForm()) {
      return;
    }
    const payload = {
      categoryName: categoryName,
      occupancyId: Number(occupancyId),
      monthlyRentPerBed: Number(monthlyRent),
      description: description,
      status: true,

      amenitiesIds: selectedAmenities
        .map((name) => {
          const found = amenitiesListState.find((a) => a.name === name);
          return found?.id;
        })
        .filter(Boolean),
    };

    console.log("FINAL PAYLOAD 👉", payload);

    try {
      const response = await AddnewCategory(payload);

      console.log("CREATE CATEGORY 👉", response);

      if (response?.data?.status === "success") {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("CREATE ERROR 👉", error);
      toast.error("Create category failed");
    }
  };

  return (
    <>
      {/* UI unchanged */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-card w-full max-w-5xl rounded-xl border border-border shadow-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground"
          >
            <X />
          </button>

          <h2 className="text-2xl font-bold text-foreground">
            Add New Category
          </h2>
          <p className="text-muted-foreground mt-1">
            Define a new accommodation plan for your hostel facility.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm text-muted-foreground">
                Category Name
              </label>

              {errors.categoryName && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.categoryName}
                </p>
              )}

              <input
                value={categoryName}
                onChange={(e) => {
                  setCategoryName(e.target.value);
                  setErrors((prev) => ({
                    ...prev,
                    categoryName: "",
                  }));
                }}
                className={`mt-1 w-full rounded-md px-3 py-2 border ${
                  errors.categoryName ? "border-red-500" : "border-border"
                } bg-background`}
                placeholder="e.g. Deluxe Room"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Occupancy Type
              </label>

              {errors.occupancyId && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.occupancyId}
                </p>
              )}

              <select
                value={occupancyId}
                onChange={(e) => {
                  setOccupancyId(e.target.value);

                  setErrors((prev) => ({
                    ...prev,
                    occupancyId: "",
                  }));
                }}
                className={`mt-1 w-full rounded-md px-3 py-2 border ${
                  errors.occupancyId ? "border-red-500" : "border-border"
                } bg-background`}
              >
                <option value="">Select</option>

                {occupancyList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.occupancyName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Monthly Rent per Bed (₹)
              </label>

              {errors.monthlyRent && (
                <p className="text-red-500 text-xs mb-1">
                  {errors.monthlyRent}
                </p>
              )}

              <input
                value={monthlyRent}
                onChange={(e) => {
                  const value = e.target.value;

                  setMonthlyRent(value);

                  if (/^\d*$/.test(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      monthlyRent: "",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      monthlyRent: "Only numbers are allowed",
                    }));
                  }
                }}
                className={`mt-1 w-full rounded-md px-3 py-2 border ${
                  errors.monthlyRent ? "border-red-500" : "border-border"
                } bg-background`}
                placeholder="₹ 0.00"
              />
            </div>
            <div className="flex items-center gap-3 mt-6">
              <span className="text-sm text-muted-foreground">
                Active Status
              </span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between items-center">
              <p className="text-sm font-medium text-foreground">
                Included Amenities ({selectedAmenities.length} Selected)
              </p>

              <button
                onClick={() => {
                  setEditingAmenity(null);
                  setOpenAmenityModal(true);
                }}
                className="text-primary text-sm font-medium"
              >
                + Add Amenities
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              {amenitiesListState.map((item) => {
                const isSelected = selectedAmenities.includes(item.name);
                // const Icon = Icons[item.icon];

                return (
                  <div
                    key={item.id} // ✅ REQUIRED
                    onClick={() => toggleAmenity(item.name)}
                    className={`cursor-pointer flex flex-col items-center justify-center w-28 h-20 rounded-xl transition relative
                      ${
                        isSelected
                          ? "border border-primary bg-primary/10 text-primary"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAmenity(item.id);
                      }}
                      className="absolute top-1 right-1 text-xs m-2"
                    >
                      ✕
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingAmenity(item);
                        setOpenUpdateModal(true);
                      }}
                      className="absolute bottom-1 right-1 m-2"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    <div className="text-muted-foreground">
                      {/* {Icon && <Icon className="w-5 h-5" />} */}
                      {/* <img
                        src={item.icon}
                        alt={item.name}
                        className="w-5 h-5 object-contain"
                      /> */}
                      <img
                        src={item.icon}
                        onError={(e) => (e.target.style.display = "none")}
                        className="w-5 h-5"
                      />
                    </div>

                    <span className="text-xs mt-1">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-muted-foreground">Description</label>

            {errors.description && (
              <p className="text-red-500 text-xs mb-1">{errors.description}</p>
            )}

            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);

                setErrors((prev) => ({
                  ...prev,
                  description: "",
                }));
              }}
              className={`mt-1 w-full rounded-md px-3 py-2 border ${
                errors.description ? "border-red-500" : "border-border"
              } bg-background`}
              placeholder="Describe the room details..."
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCreateCategory}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg"
            >
              Create Category
            </button>

            <button
              onClick={onClose}
              className="bg-muted text-muted-foreground px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <AddAmenityModal
        isOpen={openAmenityModal}
        onClose={() => setOpenAmenityModal(false)}
        onAdd={fetchAmenities}
      />

      <UpdateAmenityModal
        isOpen={openUpdateModal}
        onClose={() => setOpenUpdateModal(false)}
        amenity={editingAmenity}
        onUpdate={handleUpdateAmenity}
      />
    </>
  );
};

export default RoomsAddCategoryModal;
