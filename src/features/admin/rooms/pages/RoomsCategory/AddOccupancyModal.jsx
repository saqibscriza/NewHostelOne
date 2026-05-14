import React, { useState, useEffect } from "react";
import { X, Pencil, Trash2 } from "lucide-react";
import {
  AddOccupancyApi,
  getAllOccupancyApi,
  updateOccupancyById,
  deleteOccupancyById,
} from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const AddOccupancyModal = ({ isOpen, onClose }) => {
  const [occupancyName, setOccupancyName] = useState("");
  const [occupancies, setOccupancies] = useState([]); // always array
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");

  const fetchOccupancy = async () => {
    try {
      const res = await getAllOccupancyApi();

      // ✅ safe assignment (prevents undefined crash)
      setOccupancies(res?.data?.Occupancy || []);

      console.log("API RESPONSE 👉", res.data);
    } catch (error) {
      console.log(error);
      setOccupancies([]); // fallback
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOccupancy();
    }
  }, [isOpen]);

  const handleAdd = async () => {
    if (!occupancyName.trim()) {
      setError("Occupancy name is required");
      return;
    }
    if (!/^[a-zA-Z0-9\s-]+$/.test(occupancyName)) {
      setError("Use only letters, numbers, spaces, and hyphens");
      return;
    }

    const formData = new FormData();
    formData.append("occupancyName", occupancyName);

    try {
      const res = await AddOccupancyApi(formData);

      if (res?.data?.status === "success") {
        toast.success(res.data.message);
        fetchOccupancy();
        setOccupancyName("");
      } else {
        toast.error(res?.data?.message || "Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const selectedItem = occupancies[index];

      const response = await deleteOccupancyById(selectedItem.id);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);
        fetchOccupancy();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditValue(occupancies[index].occupancyName);
  };

  const handleUpdate = async () => {
    if (!editValue.trim()) return;

    const formData = new FormData();
    formData.append("occupancyName", editValue);

    try {
      const selectedItem = occupancies[editIndex];

      const response = await updateOccupancyById(
        selectedItem.id,
        formData,
      );

      if (response?.data?.status === "success") {
        toast.success(response.data.message);
        fetchOccupancy();
        setEditIndex(null);
        setEditValue("");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-foreground">
          Add New Occupancy
        </h2>

        <div className="flex gap-3 mt-6">
          <input
            value={occupancyName}
            onChange={(e) => {
              setOccupancyName(e.target.value);
              setError("");
            }}
            placeholder="Enter Occupancy Name"
            className={`flex-1 rounded-md border bg-background px-3 py-2 ${
              error ? "border-destructive" : "border-border"
            }`}
          />

          <button
            onClick={handleAdd}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Add New Occupancy
          </button>

          <button
            onClick={onClose}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

        <div className="mt-6 border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-2 bg-muted px-4 py-2 text-xs font-semibold text-muted-foreground">
            <span>OCCUPANCY NAME</span>
            <span className="text-right">ACTIONS</span>
          </div>

          {/* ✅ safe map */}
          {(occupancies || []).map((item, index) => {
            const isEditing = editIndex === index;

            return (
              <div
                key={item.occupancyId}
                className="grid grid-cols-2 items-center px-4 py-3 border-t border-border"
              >
                {isEditing ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-border bg-background rounded-md px-2 py-1 w-64"
                  />
                ) : (
                  <span className="text-foreground">{item.occupancyName}</span>
                )}

                <div className="flex justify-end gap-3 text-muted-foreground">
                  {isEditing ? (
                    <button
                      onClick={handleUpdate}
                      className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
                    >
                      Update
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(index)}
                        className="hover:text-primary"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        className="hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AddOccupancyModal;
