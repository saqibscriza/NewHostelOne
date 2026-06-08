import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../../../components/ui/Card";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../../components/ui/select";
import {
  ArrowLeft,
  BedDouble,
  Camera,
  Image,
  Info,
  Loader2,
  Settings,
} from "lucide-react";
import {
  addRoomApi,
  getAllActiveCategoryApi,
  getRoomById,
  updateRoomApi,
} from "../../../../../utils/utils";
import { toast } from "react-hot-toast";

const numberOnlyMessage = "Only numbers are allowed";
const textOnlyMessage = "Only alphabets and numbers are allowed";
const roomFieldLengthMessage =
  "Minimum 3 characters and maximum 25 characters allowed";

const getRoomFromResponse = (response) =>
  response?.data?.data?.Room ||
  response?.data?.data?.room ||
  response?.data?.Room ||
  response?.data?.room ||
  response?.data?.data ||
  {};

const initialForm = {
  roomNameNumber: "",
  blockFloor: "",
  categoryId: "",
  totalBeds: "",
  totalRoomPrice: "",
  securityDeposit: "",
  roomDescription: "",
  status: "AVAILABLE",
};

const AddRoom = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState(initialForm);
  const [categoryList, setCategoryList] = useState([]);
  const [roomImages, setRoomImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  const pageTitle = isEditMode ? "Edit Room" : "Add New Room";
  const submitText = isEditMode ? "Update Room" : "Add Room";

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchRoom();
    }
  }, [id]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview?.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  const fetchCategories = async () => {
    try {
      const res = await getAllActiveCategoryApi();
      const list = res?.data?.Category || res?.data?.data?.Category || [];
      setCategoryList(Array.isArray(list) ? list : []);
    } catch (error) {
      console.log("CATEGORY ERROR 👉", error);
      setCategoryList([]);
    }
  };

  const fetchRoom = async () => {
    setPageLoading(true);
    try {
      const response = await getRoomById(id);
      const room = getRoomFromResponse(response);

      setForm({
        roomNameNumber: room?.roomNameNumber || room?.roomNumber || "",
        blockFloor: room?.blockFloor || room?.block || "",
        categoryId: String(room?.categoryId || room?.category?.id || ""),
        totalBeds: String(room?.totalBeds || room?.availableBeds || ""),
        totalRoomPrice: String(room?.totalRoomPrice || room?.rentPerBed || ""),
        securityDeposit: String(room?.securityDeposit || ""),
        roomDescription: room?.roomDescription || room?.description || "",
        status: room?.status || "AVAILABLE",
      });

      setRoomImages([]);
    } catch (error) {
      console.log("ROOM BY ID ERROR 👉", error);
      toast.error("Failed to load room details");
    } finally {
      setPageLoading(false);
    }
  };

  const setField = (key, value) => {
    let message = "";

    if (["roomNameNumber", "blockFloor"].includes(key)) {
      if (value && !/^[A-Za-z0-9\s./-]+$/.test(value)) {
        message = textOnlyMessage;
      } else if (value.trim().length < 3) {
        message = "Minimum 3 characters required";
      } else if (value.trim().length > 25) {
        message = "Maximum 25 characters allowed";
      }
    }

    if (
      ["totalBeds", "totalRoomPrice", "securityDeposit"].includes(key) &&
      value &&
      !/^\d+$/.test(value)
    ) {
      message = numberOnlyMessage;
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: message }));
  };
  const handleImage = (files) => {
    if (!files?.length) return;

    const validFiles = [];
    const validPreviews = [];

    Array.from(files).forEach((file) => {
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type,
        )
      ) {
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        return;
      }

      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setRoomImages((prev) => [...prev, ...validFiles]);

    setImagePreviews((prev) =>
      prev.length ? [...prev, ...validPreviews] : validPreviews,
    );
    setErrors((prev) => ({
      ...prev,
      roomImage: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.roomNameNumber.trim()) {
      nextErrors.roomNameNumber = "Room number/name is required";
    } else if (!/^[A-Za-z0-9\s./-]+$/.test(form.roomNameNumber)) {
      nextErrors.roomNameNumber = textOnlyMessage;
    } else if (form.roomNameNumber.trim().length < 3) {
      nextErrors.roomNameNumber = "Minimum 3 characters required";
    } else if (form.roomNameNumber.trim().length > 25) {
      nextErrors.roomNameNumber = "Maximum 25 characters allowed";
    }

    if (!form.blockFloor.trim()) {
      nextErrors.blockFloor = "Block/location is required";
    } else if (!/^[A-Za-z0-9\s./-]+$/.test(form.blockFloor)) {
      nextErrors.blockFloor = textOnlyMessage;
    } else if (form.blockFloor.trim().length < 3) {
      nextErrors.blockFloor = "Minimum 3 characters required";
    } else if (form.blockFloor.trim().length > 25) {
      nextErrors.blockFloor = "Maximum 25 characters allowed";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildRoomFormData = () => {
    const formData = new FormData();

    formData.append("roomNameNumber", form.roomNameNumber.trim());
    formData.append("blockFloor", form.blockFloor.trim());
    formData.append("categoryId", Number(form.categoryId));
    formData.append("availableBeds", Number(form.totalBeds));
    formData.append("totalBeds", Number(form.totalBeds));
    formData.append("totalRoomPrice", Number(form.totalRoomPrice));
    formData.append("securityDeposit", Number(form.securityDeposit));
    formData.append("roomDescription", form.roomDescription.trim());
    formData.append("status", isEditMode ? form.status : "AVAILABLE");

    roomImages.forEach((image) => {
      formData.append("photos", image);
    });

    return formData;
  };

  const handleSubmit = async () => {
    if (!validateForm() || loading) return;

    setLoading(true);
    try {
      const payload = buildRoomFormData();
      const response = isEditMode
        ? await updateRoomApi(id, payload)
        : await addRoomApi(payload);

      if (response?.data?.status === "success") {
        toast.success(
          response?.data?.message ||
            (isEditMode
              ? "Room updated successfully"
              : "Room added successfully"),
        );
        navigate("/admin/rooms/details");
      } else {
        toast.error(
          response?.data?.message ||
            (isEditMode ? "Failed to update room" : "Failed to add room"),
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">Loading room...</div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen text-foreground">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground">
            {isEditMode
              ? "Update room information, pricing and image."
              : "Create and manage a new room entry."}
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
          className="cursor-pointer"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Info className="h-4 w-4" />
            Room Basic Information
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
            maxLength={25}
              label="Room Number / Room Name"
              error={errors.roomNameNumber}
              required
            >
              <Input
                value={form.roomNameNumber}
                onChange={(e) => setField("roomNameNumber", e.target.value)}
                placeholder="e.g. 101, Deluxe Suite"
                className={errors.roomNameNumber ? "border-destructive" : ""}
              />
            </Field>

            <Field label="Block / Location" error={errors.blockFloor} required>
              <Input
              maxLength={25}
                value={form.blockFloor}
                onChange={(e) => setField("blockFloor", e.target.value)}
                placeholder="e.g. Block A, First Floor"
                className={errors.blockFloor ? "border-destructive" : ""}
              />
            </Field>

            <Field label="Category" error={errors.categoryId} required>
              <Select
                value={form.categoryId}
                onValueChange={(value) => {
                  const selected = categoryList.find(
                    (item) => String(item.id) === String(value),
                  );

                  setForm((prev) => ({
                    ...prev,
                    categoryId: value,
                    totalRoomPrice: selected?.monthlyRentPerBed
                      ? String(selected.monthlyRentPerBed)
                      : "",
                  }));

                  setErrors((prev) => ({
                    ...prev,
                    categoryId: "",
                    totalRoomPrice: "",
                  }));
                }}
              >
                <SelectTrigger
                  className={`h-10 w-full cursor-pointer ${errors.categoryId ? "border-destructive" : ""}`}
                >
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.categoryName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* <Field label="Selected Category">
              <Input
                value={selectedCategory?.categoryName || "-"}
                disabled
                className="disabled:opacity-70"
              />
            </Field> */}
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <BedDouble className="h-4 w-4" />
            Capacity & Pricing
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Number of Beds" error={errors.totalBeds} required>
              <Input
                inputMode="numeric"
                value={form.totalBeds}
                onChange={(e) => setField("totalBeds", e.target.value)}
                placeholder="e.g. 4"
                className={errors.totalBeds ? "border-destructive" : ""}
              />
            </Field>

            <Field
              label="Base Rent per Bed (Monthly)"
              error={errors.totalRoomPrice}
              required
            >
              <Input
                inputMode="numeric"
                value={form.totalRoomPrice}
                disabled
                placeholder="Auto filled from category"
                className={`cursor-not-allowed bg-muted ${
                  errors.totalRoomPrice ? "border-destructive" : ""
                }`}
              />
            </Field>

            <Field
              label="Security Deposit"
              error={errors.securityDeposit}
              required
            >
              <Input
                inputMode="numeric"
                value={form.securityDeposit}
                onChange={(e) => setField("securityDeposit", e.target.value)}
                placeholder="₹ 0.00"
                className={errors.securityDeposit ? "border-destructive" : ""}
              />
            </Field>
          </div>

          <Field label="Room Description">
            <textarea
            maxLength={50}
              value={form.roomDescription}
              onChange={(e) => setField("roomDescription", e.target.value)}
              placeholder="Enter room description"
              className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </Field>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-5 space-y-6">
          <div className="flex items-center gap-2 font-medium">
            <Image className="h-4 w-4" />
            Room Photos
          </div>

          <input
            id="roomImages"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => handleImage(e.target.files)}
          />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((slot) => {
              const preview = imagePreviews[slot];

              return (
                <label
                  key={slot}
                  htmlFor="roomImages"
                  className="relative flex h-56 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt={`Room ${slot + 1}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-center px-4">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border bg-background">
                        <Camera className="h-6 w-6 text-muted-foreground" />
                      </div>

                      <p className="text-sm font-medium">Upload Photo</p>
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {imagePreviews.length >= 4 && (
            <div className="flex justify-end">
              <label
                htmlFor="roomImages"
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                + More Upload
              </label>
            </div>
          )}

          {errors.roomImage && (
            <p className="text-xs text-destructive">{errors.roomImage}</p>
          )}
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 font-medium">
            <Settings className="h-4 w-4" />
            Room Status
          </div>

          <Field label="Availability Status">
            <Select
              value={form.status}
              onValueChange={(value) => setField("status", value)}
              disabled={!isEditMode}
            >
              <SelectTrigger
                className={`h-10 w-full ${isEditMode ? "cursor-pointer" : "cursor-not-allowed bg-muted"}`}
              >
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AVAILABLE">Available</SelectItem>
                <SelectItem value="OCCUPIED">Occupied</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
          className="cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer min-w-36"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            submitText
          )}
        </Button>
      </div>
    </div>
  );
};

function Field({ label, children, error, required = false }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

export default AddRoom;
