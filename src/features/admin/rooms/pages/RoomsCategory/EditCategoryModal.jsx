import React, { useState, useEffect } from "react";
import { X, Pencil } from "lucide-react";
import AddAmenityModal from "./AddAmenityModal";
import UpdateAmenityModal from "./UpdateAmenityModal";
import {
  getAllOccupancyApi,
  getAllAmenitiesApi,
  deleteAmenityById,
  editCategoryById,
} from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const EditCategoryModal = ({
  isOpen,
  onClose,
  category,
  onCategoryUpdated,
}) => {
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

  // ================= PREFILL =================
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
      setOccupancyId(category.occupancyType || "");
      setMonthlyRent(category.price?.replace("₹", "") || "");
      setDescription(category.description || "");
      setSelectedAmenities(category.amenities || []);
    }
  }, [category]);

  // ================= OCCUPANCY =================
  const fetchOccupancy = async () => {
    try {
      const res = await getAllOccupancyApi();

      const list = res?.data?.Occupancy || [];

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

      if (res?.data?.status === "failure") {
        toast.error(res.data.message);
        setAmenitiesListState([]);
        return;
      }

      const list = Array.isArray(res.data) ? res.data : [];

      const formatted = list.map((item) => ({
        id: item.id,
        name: item.amenitiesName,
        icon: item.amenitiesIconUrl,
      }));

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

  // ================= DELETE AMENITY =================
  const handleDeleteAmenity = async (id) => {
    try {
      const res = await deleteAmenityById(id);

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

  // ================= UPDATE AMENITY =================
  const handleUpdateAmenity = (updatedAmenity) => {
    setAmenitiesListState((prev) =>
      prev.map((item) =>
        item.id === updatedAmenity.id
          ? {
              ...item,
              name: String(updatedAmenity.name),
              icon: updatedAmenity.icon,
            }
          : item,
      ),
    );
  };

  // ================= UPDATE CATEGORY =================
  const handleUpdateCategory = async () => {
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

    console.log("UPDATE PAYLOAD 👉", payload);

    try {
      const response = await editCategoryById(category.id, payload);

      console.log("UPDATE CATEGORY RESPONSE 👉", response);

      if (response?.data?.status === "success") {
        toast.success(response.data.message);

        if (onCategoryUpdated) {
          onCategoryUpdated();
        }

        onClose();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("UPDATE ERROR 👉", error);
      toast.error("Update category failed");
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-card w-full max-w-5xl rounded-xl border border-border shadow-lg p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground"
          >
            <X />
          </button>

          <h2 className="text-2xl font-bold text-foreground">
            Update Category
          </h2>

          <p className="text-muted-foreground mt-1">
            Update accommodation details for your hostel facility.
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="text-sm text-muted-foreground">
                Category Name
              </label>

              <input
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
                placeholder="e.g., Premium Single AC"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Occupancy Type
              </label>

              <select
                value={occupancyId}
                onChange={(e) => setOccupancyId(e.target.value)}
                className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
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

              <input
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
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

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAmenity(item.name)}
                    className={`cursor-pointer flex flex-col items-center justify-center w-28 h-20 rounded-xl transition relative
                    ${
                      isSelected
                        ? "bg-muted border-2 border-black"
                        : "bg-background border border-transparent hover:bg-muted"
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
                      <img
                        src={item.icon}
                        onError={(e) => (e.target.style.display = "none")}
                        className="w-5 h-5"
                      />
                    </div>

                    <span className="text-xs mt-1 text-muted-foreground">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-muted-foreground">Description</label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
              placeholder="Describe the room details..."
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleUpdateCategory}
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg"
            >
              Update Category
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

export default EditCategoryModal;
