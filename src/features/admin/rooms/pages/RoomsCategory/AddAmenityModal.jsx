import React, { useState } from "react";
import { X, Upload } from "lucide-react";
import { addAmenityApi } from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const AddAmenityModal = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected)); // preview
  };

  const AddAmenityApiCall = async () => {
    setLoading(true);
    try {
      const response = await addAmenityApi({
        name,
        file,
      });

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);
        onAdd();
        setName("");
        setFile(null);
        setPreview(null);
        onClose();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!name.trim()) {
      toast.error("Amenity name required");
      return;
    }
    AddAmenityApiCall();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold text-foreground">
          Add New Amenity
        </h2>

        {/* Name */}
        <div className="mt-4">
          <label className="text-sm text-muted-foreground">Amenity Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
            placeholder="e.g. Swimming Pool"
          />
        </div>

        {/* Upload Box */}
        <div className="mt-5">
          <label className="text-sm text-muted-foreground">Upload Image</label>

          <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:bg-accent transition">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-20 h-20 object-contain mb-2"
              />
            ) : (
              <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
            )}

            <p className="text-sm text-muted-foreground">
              {preview
                ? "Click to change image"
                : "Image optional - click to upload"}
            </p>

            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg w-full"
          >
            {loading ? "Adding..." : "Add Amenity"}
          </button>

          <button
            onClick={onClose}
            className="bg-muted text-muted-foreground px-4 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAmenityModal;
