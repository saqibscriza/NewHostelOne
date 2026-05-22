import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Fingerprint,
  ShieldCheck,
  Upload,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { toast } from "react-hot-toast";
import {
  updateAdminPersonalDetailsApi,
  getAdminByIdApi,
} from "../../../../utils/utils";
import { useAuth } from "../../../../context/AuthContext";

const InfoBlock = ({ icon, label, value, helper, tone = "default" }) => (
  <div className="flex items-start gap-4">
    <div className="rounded-xl bg-muted p-3 text-muted-foreground">
      {React.createElement(icon, { className: "h-5 w-5" })}
    </div>
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-base font-semibold ${
          tone === "success"
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-foreground"
        }`}
      >
        {value}
      </p>
      {helper ? (
        <p className="mt-1 text-sm text-muted-foreground">{helper}</p>
      ) : null}
    </div>
  </div>
);

const Label = ({ children }) => (
  <label className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
    {children}
  </label>
);

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return `${first}${last}`.toUpperCase() || "A";
};

const pickFirst = (...values) =>
  values.find(
    (value) => value !== undefined && value !== null && value !== "",
  ) || "";

const EditProfilePage = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documentPreview, setDocumentPreview] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);
  const fileInputRef = useRef(null);
  const { updateUserProfile } = useAuth();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedImage(file);
    setImageRemoved(false);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result || "");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);

    setPreviewImage("");
    setImageRemoved(true);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    toast.success("Profile image removed");
  };

  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "Rakesh Sharma",
    email: "rakesh@gmail.com",
    phone: "+91 9856632564",
    address: "H.No. 45, Gali No. 3, Shiv Colony, Sector 16, Noida",
    pinCode: "203207",
    country: "India",
    state: "Uttar Pradesh",
    city: "Noida",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const AdminDataById = useCallback(async () => {
    try {
      const response = await getAdminByIdApi();

      console.log("ADMIN DATA BY ID =>", response);

      if (response?.status === 200) {
        const profile = response?.data?.profile || {};

        const personalDetails = response?.data?.personalDetails || {};

        const security = response?.data?.security || {};

        setForm({
          fullName: profile?.name || "",

          email: personalDetails?.email || "",

          phone: personalDetails?.phone || "",

          address: personalDetails?.address || "",

          pinCode: personalDetails?.pinCode || "",

          country: personalDetails?.country || "",

          state: personalDetails?.state || "",

          city: personalDetails?.city || "",

          dateOfJoining: personalDetails?.dateOfJoining
            ? personalDetails.dateOfJoining.split("T")[0]
            : "",
          adminId: personalDetails?.adminId || "",

          role: profile?.role || "",

          staffCount: profile?.staffCount || 0,

          studentsCount: profile?.studentsCount || 0,

          lastPasswordChange: security?.lastPasswordChange || "",

          daysSincePasswordChange: security?.daysSincePasswordChange || "",
        });

        setPreviewImage(profile?.photo || "");

        setImageRemoved(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(AdminDataById);
  }, [AdminDataById]);

  const UpdateAdminProfileApi = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("pinCode", form.pinCode);
      formData.append("country", form.country);
      formData.append("state", form.state);
      formData.append("city", form.city);

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
        formData.append("image", selectedImage);
        formData.append("photo", selectedImage);
      }

      if (imageRemoved) {
        formData.append("removeProfileImage", "true");
      }
      const response = await updateAdminPersonalDetailsApi(formData);

      console.log("UPDATE PROFILE =>", response);

      if (response?.status === 200) {
        const updatedPhoto =
          response?.data?.profile?.photo ||
          response?.data?.profile?.image ||
          response?.data?.data?.photo ||
          response?.data?.data?.image ||
          response?.data?.photo ||
          response?.data?.image ||
          previewImage;

        updateUserProfile({
          name: form.fullName,
          photo: imageRemoved ? "" : updatedPhoto || previewImage,
        });

        toast.success("Profile Updated Successfully");

        setTimeout(() => {
          navigate("/admin/profile");
        }, 1500);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Admin Profile
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your personal details and keep your admin information
            current.
          </p>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center">
            <div className="relative h-24 w-24 overflow-hidden rounded-2xl border border-border bg-muted">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-foreground">
                  {getInitials(form.fullName)}
                </div>
              )}
              {/* <button className="absolute bottom-2 right-2 rounded-full bg-foreground p-1.5 text-background">
                <Pencil className="h-3.5 w-3.5" />
              </button> */}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground">
                Profile Photo
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Update your profile image. Supported formats: JPG, PNG, GIF.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  Upload New Photo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>{" "}
              </div>
              <input
                type="file"
                accept="image/*"
                id="profile-upload"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="border-border bg-card shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Personal Details
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Phone Number</Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Address Details</Label>
                  <Input
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Pin Code</Label>
                  <Input
                    value={form.pinCode}
                    onChange={(e) => handleChange("pinCode", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select
                    value={form.country}
                    onValueChange={(value) => handleChange("country", value)}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="India">India</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>State</Label>
                  <Select
                    value={form.state}
                    onValueChange={(value) => handleChange("state", value)}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Uttar Pradesh">
                        Uttar Pradesh
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Select
                    value={form.city}
                    onValueChange={(value) => handleChange("city", value)}
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Noida">Noida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card shadow-sm">
            <CardContent className="space-y-8 p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Professional Info
                </h2>
              </div>

              <InfoBlock
                icon={CalendarDays}
                label="Date Of Joining"
                value={
                  form.dateOfJoining
                    ? form.dateOfJoining.split("T")[0]
                    : "Not Available"
                }
                helper="Non-editable field"
              />
              <InfoBlock
                icon={Fingerprint}
                label="Admin ID"
                value={form.adminId || "Not Available"}
                helper="System generated"
              />
              <InfoBlock
                icon={ShieldCheck}
                label="Account Status"
                value="Active"
                helper=""
                tone="success"
              />
            </CardContent>
          </Card>
        </div>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Last updated 12 days ago
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/profile")}
              >
                Cancel
              </Button>
              <Button onClick={UpdateAdminProfileApi}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditProfilePage;
