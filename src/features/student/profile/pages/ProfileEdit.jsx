import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Camera, CheckCircle2, User, Contact2, Asterisk } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useAuth } from "../../../../context/AuthContext";
import {
  getStudentProfileByIdApi,
  getAdminProfileApi,
  updateStudentProfileApi,
  sendEmailOtpApi
} from "../../../../utils/utils";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { userName } = useAuth();
  const location = useLocation();
  const studentId = location.state?.studentId;

  const [loading, setLoading] = useState(false);

  const [imagePreview, setImagePreview] = useState(
    `https://api.dicebear.com/7.x/notionists/svg?seed=${userName || "Sandeep"}&backgroundColor=0f172a`,
  );
  const [selectedImage, setSelectedImage] = useState(null);
  const [isPhotoRemoved, setIsPhotoRemoved] = useState(false);

  // Email verification state
  const [initialEmail, setInitialEmail] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (studentId) {
      fetchGetProfileById();
    }
  }, [studentId]);

  const fetchGetProfileById = async () => {
    try {
      const res = await getStudentProfileByIdApi();

      if (res?.status === "success" && res?.data) {
        const data = res.data;

        setValue("fullName", data.personalInformation?.fullName || "");
        setValue("gender", data.personalInformation?.gender || "");
        setValue("bloodGroup", data.personalInformation?.bloodGroup || "");
        setValue("address", data.personalInformation?.address || "");
        setValue("phone", data.academicAndContactDetails?.phone || "");
        setValue("email", data.academicAndContactDetails?.email || "");
        setInitialEmail(data.academicAndContactDetails?.email || "");
        setValue("emergencyName", data.guardianInformation?.guardianName || "");
        setValue("emergencyRelation", data.guardianInformation?.relation || "");
        setValue(
          "emergencyPhone",
          data.guardianInformation?.emergencyContact || "",
        );

        setValue("studentId", data.personalInformation?.studentId || "");
        setValue("dateOfBirth", data.personalInformation?.dob || "");
        setValue(
          "dateOfJoining",
          data.personalInformation?.dateOfJoining || "",
        );
        setValue("year", data.academicAndContactDetails?.year || "");
        setValue("course", data.academicAndContactDetails?.course || "");

        if (data.documentUploads?.photo) {
          setImagePreview(data.documentUploads.photo);
        }
      } else {
        console.error("Failed to fetch profile:", res?.message);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setIsPhotoRemoved(false);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const currentEmail = watch("email");
  const isEmailChanged = currentEmail && currentEmail !== initialEmail;
  const isSubmitDisabled = loading;

  // If email changes back to initial, reset verification state
  useEffect(() => {
    if (!isEmailChanged) {
      setOtpRequested(false);
      setValue("otp", "");
      setOtpError("");
    }
  }, [isEmailChanged, setValue]);

  const handleSendOtp = async () => {
    if (errors.email || !currentEmail) return;
    setSendingOtp(true);
    setOtpError("");
    try {
      const otpFormData = new FormData();
      otpFormData.append("newEmail", currentEmail);
      const res = await sendEmailOtpApi(otpFormData);
      if (res?.data?.status === "success" || res?.status === 200 || res?.status === "success") {
        setOtpRequested(true);
        toast.success("OTP sent to your new email");
      } else {
        throw new Error(res?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      setOtpError(error.message || "Failed to send OTP");
      toast.error(error.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("fullName", data.fullName || "");
      formData.append("gender", data.gender || "");
      formData.append("bloodGroup", data.bloodGroup || "");
      formData.append("address", data.address || "");
      formData.append("phone", data.phone || "");
      formData.append("email", data.email || "");
      formData.append("guardianName", data.emergencyName || "");
      formData.append("relation", data.emergencyRelation || "");
      formData.append("emergencyContact", data.emergencyPhone || "");

      if (selectedImage) {
        formData.append("photo", selectedImage);
      } else if (isPhotoRemoved) {
        // Send an empty string or null to indicate photo removal
        formData.append("photo", "");
      }

      if (isEmailChanged) {
        formData.append("otp", data.otp || "");
      }

      // Call API with form data
      const res = await updateStudentProfileApi(formData);

      if (res?.status === "success") {
        toast.success(res?.message || "Profile updated successfully");
        
        if (isEmailChanged) {
          setInitialEmail(currentEmail);
          setOtpRequested(false);
          setValue("otp", "");
        }

        await getAdminProfileApi();
        window.location.reload();
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          "Update failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-[70rem] mx-auto space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Edit Profile
        </h1>
        <p className="text-gray-500 mt-1">
          Update your personal information and account preferences
        </p>
      </div>

      {/* Profile Photo */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-full overflow-hidden shadow-md border-4 border-white bg-slate-100">
            <img
              src={imagePreview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div
            className="absolute bottom-1 right-1 bg-gray-900 p-1.5 rounded-full shadow-sm text-white border-2 border-white cursor-pointer"
            onClick={() => document.getElementById("profileUpload").click()}
          >
            <Camera className="w-4 h-4" />
          </div>
        </div>
        <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
          <h3 className="text-lg font-bold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-500 mt-1 mb-5">
            Upload a professional headshot. JPEG or PNG, max 2MB.
            <br />
            This will be visible on your student ID and portal.
          </p>
          <div className="flex justify-center md:justify-start gap-4 items-center">
            <Button
              variant="outline"
              className="text-sm font-medium rounded-lg h-9 px-5 bg-gray-50 relative as-child"
            >
              Upload New
              <input
                id="profileUpload"
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                accept=".jpg,.jpeg,.png"
                onChange={handleImageChange}
              />
            </Button>
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setIsPhotoRemoved(true);
                setImagePreview(
                  `https://api.dicebear.com/7.x/notionists/svg?seed=${userName || "Sandeep"}&backgroundColor=0f172a`,
                );
              }}
              className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col - Personal Info (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
              <User className="w-5 h-5" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("fullName", {
                    required: "Full Name is required",
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets are allowed",
                    },
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters long",
                    },
                  })}
                  className={`h-11 rounded-lg bg-white border-gray-200 shadow-none ${errors.fullName ? "border-red-500 ring-1 ring-red-500" : ""}`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Date of Birth
                </Label>
                <Input
                  {...register("dateOfBirth")}
                  disabled
                  className="h-11 rounded-lg border-gray-200 bg-white shadow-none text-gray-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Restricted field. Contact registrar to change.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <input
                  type="hidden"
                  {...register("gender", {
                    validate: (value) =>
                      value && value !== "none" ? true : "Gender is required",
                  })}
                />
                <Select
                  onValueChange={(value) =>
                    setValue("gender", value, { shouldValidate: true })
                  }
                  value={watch("gender") || "none"}
                >
                  <SelectTrigger
                    aria-invalid={Boolean(errors.gender)}
                    className="w-full h-11 px-4 rounded-lg bg-white shadow-none border-gray-200"
                  >
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Blood Group <span className="text-destructive">*</span>
                </Label>
                <input
                  type="hidden"
                  {...register("bloodGroup", {
                    validate: (value) =>
                      value && value !== "none" ? true : "Blood group is required",
                  })}
                />
                <Select
                  onValueChange={(value) =>
                    setValue("bloodGroup", value, { shouldValidate: true })
                  }
                  value={watch("bloodGroup") || "none"}
                >
                  <SelectTrigger
                    aria-invalid={Boolean(errors.bloodGroup)}
                    className="w-full h-11 px-4 rounded-lg bg-white shadow-none border-gray-200"
                  >
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
                {errors.bloodGroup && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.bloodGroup.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("address", { required: "Address is required" })}
                  className={`h-11 rounded-lg bg-white shadow-none border-gray-200 ${errors.address ? "border-red-500" : ""}`}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Academic Status (1 Col) */}
        <div className="lg:col-span-1">
          <div className="bg-[#111827] rounded-xl shadow-sm text-white p-8 h-full">
            <div className="flex items-center gap-2 mb-8 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">
                Academic Status
              </h3>
            </div>

            <div className="space-y-6">
              <Input type="hidden" {...register("studentId")} />
              <Input type="hidden" {...register("course")} />
              <Input type="hidden" {...register("year")} />
              <Input type="hidden" {...register("dateOfJoining")} />

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Student ID
                </p>
                <div className="font-bold text-xl mt-1 text-white">
                  {watch("studentId") || "N/A"}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Course
                </p>
                <div className="text-[15px] text-white mt-1">
                  {watch("course") || "N/A"}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Year / Semester
                </p>
                <div className="text-[15px] text-white mt-1">
                  {watch("year") || "N/A"}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Enrollment Date
                </p>
                <div className="text-[15px] text-white mt-1">
                  {watch("dateOfJoining") || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
          <div className="flex items-center gap-2 mb-6 text-gray-400">
            <Contact2 className="w-5 h-5" />
            <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">
              Contact Details
            </h3>
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Phone Number <span className="text-destructive">*</span>
              </Label>

              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border-none bg-slate-50 text-gray-400 sm:text-sm">
                  +91
                </span>

                <Input
                  type="text"
                  maxLength={10}
                  inputMode="numeric"
                  {...register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message:
                        "Phone number must start with 6, 7, 8, or 9 and contain 10 digits",
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    },
                  })}
                  className={`h-11 rounded-none rounded-r-lg flex-1 bg-slate-50 border-none shadow-none text-gray-900 ${
                    errors.phone ? "ring-1 ring-red-500" : ""
                  }`}
                />
              </div>

              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone.message}</p>
              )}
            </div>

<div className="space-y-2">
  <div className="flex items-center justify-between">
    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
      Personal Email <span className="text-destructive">*</span>
    </Label>
    {isEmailChanged && !otpRequested && (
      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">
        Verification Required
      </span>
    )}
  </div>

  <div className="flex flex-col gap-2">
    <div className="flex gap-2 items-start">
      <div className="flex-1 space-y-1">
        <Input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in)$/,
              message: "Please enter a valid email address",
            },
            validate: {
              noDoubleDots: (value) =>
                !value.includes("..") || "Please enter a valid email address",
            },
          })}
          type="email"
          className={`h-11 rounded-lg bg-slate-50 border-none shadow-none text-gray-900 ${
            errors.email ? "ring-1 ring-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {isEmailChanged && !otpRequested && (
        <Button
          type="button"
          onClick={handleSendOtp}
          disabled={sendingOtp || !!errors.email}
          className="h-11 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg shrink-0 cursor-pointer"
        >
          {sendingOtp ? "Sending..." : "Verify Email"}
        </Button>
      )}
    </div>

    {/* OTP Panel */}
    {isEmailChanged && otpRequested && (
      <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-gray-200 flex flex-col gap-3 transition-all duration-300">
        <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          Enter 6-Digit OTP <span className="text-destructive">*</span>
        </Label>
        <div className="flex flex-col gap-1">
          <Input
            type="text"
            maxLength={6}
            inputMode="numeric"
            {...register("otp", {
              required: isEmailChanged ? "OTP is required to change email" : false,
              pattern: {
                value: /^[0-9]{6}$/,
                message: "OTP must be exactly 6 digits"
              },
              onChange: (e) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }
            })}
            placeholder="000000"
            className={`h-11 rounded-lg bg-white shadow-none border-gray-200 tracking-[0.5em] text-center font-bold text-lg max-w-[200px] ${
              errors.otp || otpError ? "border-red-500 ring-1 ring-red-500" : "focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
            }`}
          />
          {(errors.otp || otpError) && (
            <p className="text-xs text-red-500 mt-1">
              {errors.otp?.message || otpError}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Enter the OTP sent to your new email. It will be verified when you save changes.
          </p>
        </div>
      </div>
    )}
  </div>
</div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-gray-400">
              <Asterisk className="w-5 h-5" />
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">
                Emergency Contact
              </h3>
            </div>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("emergencyName", {
                    required: "Required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                    pattern: {
                      value: /^[A-Za-z\s]+$/,
                      message: "Only alphabets are allowed",
                    },
                  })}
                  className={`h-11 rounded-lg bg-slate-50 border-none shadow-none text-gray-900 ${
                    errors.emergencyName ? "ring-1 ring-red-500" : ""
                  }`}
                />

                {errors.emergencyName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.emergencyName.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Relationship <span className="text-destructive">*</span>
                </Label>
                <Input
                  {...register("emergencyRelation", { required: "Required" })}
                  className={`h-11 rounded-lg bg-slate-50 border-none shadow-none text-gray-900 ${errors.emergencyRelation ? "ring-1 ring-red-500" : ""}`}
                />
                {errors.emergencyRelation && (
                  <p className="text-xs text-red-500">
                    {errors.emergencyRelation.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Emergency Phone <span className="text-destructive">*</span>
              </Label>

              <div className="flex">
                <span className="inline-flex items-center px-4 rounded-l-lg border-none bg-slate-50 text-gray-400 sm:text-sm">
                  +91
                </span>

                <Input
                  maxLength={10}
                  inputMode="numeric"
                  {...register("emergencyPhone", {
                    required: "Required",
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message:
                        "Phone number must start with 6, 7, 8, or 9 and contain 10 digits",
                    },
                  })}
                  className={`h-11 rounded-none rounded-r-lg flex-1 bg-slate-50 border-none shadow-none text-gray-900 ${
                    errors.emergencyPhone ? "ring-1 ring-red-500" : ""
                  }`}
                />
              </div>

              {errors.emergencyPhone && (
                <p className="text-xs text-red-500">
                  {errors.emergencyPhone.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="rounded-xl h-11 px-8 font-semibold bg-white border-gray-200 cursor-pointer"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmitDisabled}
          type="submit"
          className="bg-[#111827] hover:bg-gray-800 text-white rounded-xl h-11 px-8 font-semibold shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}