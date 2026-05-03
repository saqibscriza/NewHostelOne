// import React, { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { editAmenityById } from "../../../../../utils/utils";
// import { toast } from "react-hot-toast";

// const UpdateAmenityModal = ({ isOpen, onClose, amenity, onUpdate }) => {
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (amenity) {
//       setName(amenity.name || "");
//     }
//   }, [amenity]);

//   if (!isOpen) return null;
//   const handleUpdateAmenity = (updated) => {
//     console.log("UPDATED RECEIVED 👉", updated);

//     setAmenitiesListState((prev) =>
//       prev.map((item) =>
//         item.id === updated.id
//           ? {
//               ...item,
//               name: updated.name, // ✅ FORCE STRING
//               icon: updated.icon,
//             }
//           : item,
//       ),
//     );
//   };
//   // const handleUpdate = async () => {
//   //   if (!name.trim()) return;

//   //   setLoading(true);

//   //   try {
//   //     console.log("SENDING 👉", name, typeof name); // DEBUG

//   //     // ✅ ONLY STRING PASS
//   //     const response = await editAmenityById(amenity.id, name);

//   //     if (response?.data?.status === "success") {
//   //       toast.success(response?.data?.message);
//   //       // onUpdate();
//   //       onUpdate({
//   //         id: amenity.id,
//   //         name: name,
//   //         icon: amenity.icon,
//   //       });
//   //       onClose();
//   //     } else {
//   //       toast.error(response?.data?.message);
//   //     }
//   //   } catch (error) {
//   //     console.log(error);
//   //   }

//   //   setLoading(false);
//   // };

//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-lg p-6 relative">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 text-muted-foreground"
//         >
//           <X />
//         </button>

//         <h2 className="text-xl font-semibold text-foreground">
//           Update Amenity
//         </h2>

//         <div className="mt-4">
//           <label className="text-sm text-muted-foreground">Amenity Name</label>
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
//           />
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button
//             onClick={handleUpdate}
//             disabled={loading}
//             className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
//           >
//             {loading ? "Updating..." : "Update"}
//           </button>

//           <button
//             onClick={onClose}
//             className="bg-muted text-muted-foreground px-4 py-2 rounded-lg"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateAmenityModal;



import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { editAmenityById } from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const UpdateAmenityModal = ({ isOpen, onClose, amenity, onUpdate }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (amenity) {
      setName(amenity.name || "");
    }
  }, [amenity]);

  if (!isOpen) return null;

  // ✅ RESTORE THIS (you removed it)
  const handleUpdate = async () => {
    if (!name.trim()) return;

    setLoading(true);

    try {
      console.log("SENDING 👉", name, typeof name);

      const response = await editAmenityById(amenity.id, name);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);

        // ✅ send correct data to parent
        onUpdate({
          id: amenity.id,
          name: String(name),
          icon: amenity.icon,
        });

        onClose();
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };
console.log("UTILS NAME 👉", name, typeof name);
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
          Update Amenity
        </h2>

        <div className="mt-4">
          <label className="text-sm text-muted-foreground">
            Amenity Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-border bg-background rounded-md px-3 py-2"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleUpdate} // ✅ NOW THIS WORKS
            disabled={loading}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            {loading ? "Updating..." : "Update"}
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

export default UpdateAmenityModal;