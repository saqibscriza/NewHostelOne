import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { Upload, BedDouble, Info, Image, Settings } from "lucide-react";
import { addRoomApi, getAllCategoryApi } from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const numberOnlyMessage = "Only numbers are allowed";

const AddRoom = () => {
  const [roomNumber, setRoomNumber] = useState("");
  const [roomName, setRoomName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [block, setBlock] = useState("");
  const [totalBeds, setTotalBeds] = useState("");
  const [rentPerBed, setRentPerBed] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [errors, setErrors] = useState({});
  // const [selectedAmenities, setSelectedAmenities] = useState([]);

  // ✅ NEW STATE
  const [categoryList, setCategoryList] = useState([]);

  // ✅ FETCH CATEGORY

  const fetchCategories = async () => {
    try {
      const res = await getAllCategoryApi();

      console.log("CATEGORY API 👉", res?.data);

      // ✅ CORRECT KEY
      const list = res?.data?.Category || [];

      console.log("CATEGORY LIST 👉", list);

      setCategoryList(list);
    } catch (error) {
      console.log("CATEGORY ERROR 👉", error);
      setCategoryList([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const setNumberValue = (key, value, setter) => {
    setter(value);
    setErrors((prev) => ({
      ...prev,
      [key]: /^\d*$/.test(value) ? "" : numberOnlyMessage,
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!roomNumber.trim()) nextErrors.roomNumber = "Room number/name is required";
    if (!block.trim()) nextErrors.block = "Block/location is required";
    if (!categoryId) nextErrors.categoryId = "Please select a category";
    if (!totalBeds) nextErrors.totalBeds = "Number of beds is required";
    else if (!/^\d+$/.test(totalBeds)) nextErrors.totalBeds = numberOnlyMessage;
    else if (Number(totalBeds) <= 0) nextErrors.totalBeds = "Beds must be greater than 0";
    if (!rentPerBed) nextErrors.rentPerBed = "Rent per bed is required";
    else if (!/^\d+$/.test(rentPerBed)) nextErrors.rentPerBed = numberOnlyMessage;
    if (!securityDeposit) nextErrors.securityDeposit = "Security deposit is required";
    else if (!/^\d+$/.test(securityDeposit)) nextErrors.securityDeposit = numberOnlyMessage;

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleAddRoom = async () => {
    if (!validateForm()) return;

    try {
      const payload = {
        roomNameNumber: roomNumber,
        blockFloor: block,
        categoryId: Number(categoryId),
        availableBeds: Number(totalBeds),
        totalBeds: Number(totalBeds),
        totalRoomPrice: Number(rentPerBed),
        securityDeposit: Number(securityDeposit),
      };

      console.log("ROOM PAYLOAD 👉", payload);

      const response = await addRoomApi(payload);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message || "Failed to add room");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Add New Room</h1>
        <p className="text-muted-foreground">
          Create and manage a new room entry
        </p>
      </div>

      {/* Room Basic Info */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Info className="w-4 h-4" />
            Room Basic Information
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Room Number/ Room Name
              </label>
              <Input
                value={roomNumber}
                onChange={(e) => {
                  setRoomNumber(e.target.value);
                  setErrors((prev) => ({ ...prev, roomNumber: "" }));
                }}
                placeholder="e.g. 101, Deluxe Suite"
                className={`mt-1 ${errors.roomNumber ? "border-destructive" : ""}`}
              />
              {errors.roomNumber && (
                <p className="mt-1 text-xs text-destructive">{errors.roomNumber}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Block / Location
              </label>
              <Input
                value={block}
                onChange={(e) => {
                  setBlock(e.target.value);
                  setErrors((prev) => ({ ...prev, block: "" }));
                }}
                className={`mt-1 ${errors.block ? "border-destructive" : ""}`}
              />
              {errors.block && (
                <p className="mt-1 text-xs text-destructive">{errors.block}</p>
              )}
            </div>

            {/* ✅ ONLY CHANGE HERE */}
            <div className="col-span-2">
              <label className="text-sm text-muted-foreground">Category</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setErrors((prev) => ({ ...prev, categoryId: "" }));
                }}
                className={`mt-1 w-full rounded-md border px-3 py-2 bg-background ${
                  errors.categoryId ? "border-destructive" : "border-border"
                }`}
              >
                <option value="">Select Category</option>

                {categoryList?.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.categoryName}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="mt-1 text-xs text-destructive">{errors.categoryId}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ======================== */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <BedDouble className="w-4 h-4" />
            Capacity & Pricing
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">
                Number of Beds
              </label>
              <Input
                inputMode="numeric"
                value={totalBeds}
                onChange={(e) =>
                  setNumberValue("totalBeds", e.target.value, setTotalBeds)
                }
                className={`mt-1 ${errors.totalBeds ? "border-destructive" : ""}`}
              />
              {errors.totalBeds && (
                <p className="mt-1 text-xs text-destructive">{errors.totalBeds}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Base Rent per Bed (Monthly)
              </label>
              <Input
                inputMode="numeric"
                value={rentPerBed}
                onChange={(e) =>
                  setNumberValue("rentPerBed", e.target.value, setRentPerBed)
                }
                placeholder="₹ 0.00"
                className={`mt-1 ${errors.rentPerBed ? "border-destructive" : ""}`}
              />
              {errors.rentPerBed && (
                <p className="mt-1 text-xs text-destructive">{errors.rentPerBed}</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">
                Security Deposit
              </label>
              <Input
                inputMode="numeric"
                value={securityDeposit}
                onChange={(e) =>
                  setNumberValue(
                    "securityDeposit",
                    e.target.value,
                    setSecurityDeposit,
                  )
                }
                placeholder="₹ 0.00"
                className={`mt-1 ${
                  errors.securityDeposit ? "border-destructive" : ""
                }`}
              />
              {errors.securityDeposit && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.securityDeposit}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Room Description
            </label>
            <textarea
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Enter Room Description"
              className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background"
            />
          </div>
        </CardContent>
      </Card>

      {/* Room Photo */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Image className="w-4 h-4" />
            Room Photo
          </div>

          <div className="flex gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-40 h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-muted-foreground"
              >
                <Upload className="w-5 h-5 mb-2" />
                <span className="text-xs">UPLOAD LOGO</span>
              </div>
            ))}
          </div>

          <button className="text-primary text-sm">+ More Upload</button>
        </CardContent>
      </Card>

      {/* Room Status */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Settings className="w-4 h-4" />
            Room Status
          </div>

          <div>
            <label className="text-sm text-muted-foreground">
              Initial Availability Status
            </label>
            <select className="mt-1 w-full border border-border rounded-md px-3 py-2 bg-background">
              <option>Available</option>
            </select>

            <p className="text-xs text-muted-foreground mt-1">
              Sets the status of the room immediately after creation.
            </p>
          </div>
        </CardContent>
      </Card>
      {/* ======================== */}
      {/* REST OF YOUR UI — UNCHANGED */}
      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Cancel</Button>
        <Button
          onClick={handleAddRoom}
          className="bg-primary text-primary-foreground"
        >
          Add Room
        </Button>
      </div>
    </div>
  );
};

export default AddRoom;
