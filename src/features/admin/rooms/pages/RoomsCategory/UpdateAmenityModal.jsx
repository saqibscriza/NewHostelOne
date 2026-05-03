import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { editAmenityById } from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const UpdateAmenityModal = ({ isOpen, onClose, amenity }) => {
  const [amenityId, setAmenityId] = useState("");
  const [name, setName] = useState("");
  const [iconFile, setIconFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (amenity) {
      setAmenityId(amenity.id);
      setName(amenity.name);
      setPreview(amenity.icon);
    }
  }, [amenity]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIconFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    if (!name.trim()) return;

    const formData = new FormData();
    formData.append("amenityName", name);

    if (iconFile) {
      formData.append("icon", iconFile);
    }

    try {
      const response = await editAmenityById(amenityId, formData);

      if (response?.data?.status === "success") {
        toast.success(response.data.message);
        onClose();
      } else {
        toast.error(response?.message || "Update failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Update failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        style={{
          background: "var(--card)",
          color: "var(--card-foreground)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border)",
          width: "100%",
          maxWidth: "420px",
          padding: "24px",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            color: "var(--muted-foreground)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 style={{ fontSize: "20px", fontWeight: 600 }}>Update Amenities</h2>

        {/* Name */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
            Amenities Name
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              background: "var(--input)",
              color: "var(--foreground)",
            }}
          />
        </div>

        {/* File Upload */}
        <div style={{ marginTop: "20px" }}>
          <label style={{ fontSize: "14px", color: "var(--muted-foreground)" }}>
            Icon
          </label>

          <div
            style={{
              marginTop: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "10px",
              background: "var(--input)",
            }}
          >
            <input type="file" onChange={handleFileChange} />
            <Upload size={16} />
          </div>

          {preview && (
            <div style={{ marginTop: "12px" }}>
              <img
                src={preview}
                alt="preview"
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid var(--border)",
                }}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={handleUpdate}
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Update
          </button>

          <button
            onClick={onClose}
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
              padding: "10px 16px",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAmenityModal;
