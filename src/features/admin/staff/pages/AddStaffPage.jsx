import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { addStaffApi } from "../../../../utils/utils";
import { getAllRoleApi } from "../../../../utils/utils";
import { getAllStaffEmployeeIdApi } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  PhoneCall,
  MapPin,
  FileText,
  ClipboardCheck,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Mail,
  CalendarDays,
  Smartphone,
} from "lucide-react";
import { Card } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";

export default function AddStaff() {
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(false);
  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [loaderCheck, setLoaderCheck] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAllRoleApi();
        if (res?.data?.roles) {
          setRoles(res.data.roles);
        }
      } catch (error) {
        console.log("Role fetch error:", error);
      }
    };

    fetchRoles();
    myEmployeeGenerateIdApi();
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
  defaultValues: {
    status: true,
  },
});
  const profileImage = watch("profileImage");
  const idProof = watch("idProof");
  const policeVerification = watch("policeVerification");

    const currentAddressValue = watch("currentAddress");

  useEffect(() => {
    if (sameAddress) {
      setValue("permanentAddress", currentAddressValue, { shouldValidate: true });
    }
  }, [currentAddressValue, sameAddress, setValue]);

  const myEmployeeGenerateIdApi = async () => {
    try {
      const res = await getAllStaffEmployeeIdApi();
      console.log("Employee ID response:", res);
      if (res?.data?.nextEmployeeId) {
        setEmployeeId(res.data.nextEmployeeId);
        const generatedId = res.data.nextEmployeeId;
        console.log("Generated Employee ID:", generatedId);
      }
    } catch (error) {
      console.log("Employee ID fetch error:", error);
    }
  };

  const MyAddStaffApi = async (data) => {
    const formData = new FormData();
    // Text fields
    formData.append("fullName", data.fullName);
    formData.append("dob", data.dob);
    formData.append("gender", data.gender);
    formData.append("roleId", data.roleId);
    formData.append("joiningDate", data.joiningDate);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("currentAddress", data.currentAddress);
    formData.append("permanentAddress", data.permanentAddress);
    formData.append("status", data.status);
    formData.append("profileImage", data.profileImage[0]);
    formData.append("idProof", data.idProof[0]);
    formData.append("policeVerification", data.policeVerification[0]);
    formData.append("employeeId", employeeId);

    try {
      setLoaderCheck(true); // loader start
      const res = await addStaffApi(formData);
      if (res?.data?.status === "success") {
        toast.success(res?.data?.message || "Staff added successfully");
        setLoaderCheck(false);
        setTimeout(() => {
          navigate("/admin/staff");
        }, 1500);
      } else {
        toast.error(res?.data?.message || "Something went wrong");
        setLoaderCheck(false);
      }
    } catch (error) {
    console.log("ADD STAFF ERROR 👉", error);

    toast.error(
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Server Error"
    );
  } finally {
    setLoaderCheck(false);
  }
};

  return (
    <form onSubmit={handleSubmit(MyAddStaffApi)}>
      <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/50 min-h-screen text-slate-900">
        {/* 1. HEADER SECTION */}
        {/* Yeh div page ka title aur subtitle hold karta hai */}
        <div>
          <h1 className="text-3xl font-bold">Add New Staff</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Add new staff member with role and details
          </p>
        </div>

        {/* 2. PERSONAL DETAILS CARD */}
        {/* Card ek white box hai jiske corners rounded hote hain aur thoda shadow hota hai */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          {/* Card Header */}
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <User className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              Personal Details
            </h2>
          </div>

          {/* Grid Layout: md:grid-cols-2 ka matlab hai medium screens par 2 columns banenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name Field */}
<div className="space-y-2">
  <Label className="text-sm font-medium text-slate-700">
    Full Name<span className="text-red-500">*</span>
  </Label>

  <Input
    className="h-11"
    type="text"
    placeholder="Enter Full Name"
    {...register("fullName", {
      required: "Full name is required",

      minLength: {
        value: 3,
        message: "Full name must be at least 3 characters",
      },

      maxLength: {
        value: 50,
        message: "Full name cannot exceed 50 characters",
      },

      pattern: {
        value: /^(?!\s)(?!.*\s$)[A-Za-z]+(?:\s[A-Za-z]+)*$/,
        message:
          "Only alphabets and single spaces are allowed",
      },

      validate: {
        notOnlySpaces: (value) =>
          value.trim().length > 0 ||
          "Full name cannot contain only spaces",
      },
    })}
    onInput={(e) => {
      // remove multiple spaces
      e.target.value = e.target.value.replace(/\s{2,}/g, " ");
    }}
  />

  {errors.fullName && (
    <span className="text-red-500 text-xs">
      {errors.fullName.message}
    </span>
  )}
</div>

            {/* Profile Picture Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Profile Picture
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border flex items-center justify-center overflow-hidden min-w-11">
                  {profileImage?.length > 0 ? (
                    <img
                      src={URL.createObjectURL(profileImage[0])}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-slate-400" />
                  )}
                </div>
                <input
                  id="profileUpload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                  {...register("profileImage")}
                />
                <span className="text-sm text-slate-500 truncate max-w-[200px]" title={profileImage?.length > 0 ? profileImage[0].name : "No file chosen"}>
                  {profileImage?.length > 0
                    ? profileImage[0].name
                    : "No file chosen"}
                </span>
                <Button
                  className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 whitespace-nowrap cursor-pointer"
                  type="button"
                  onClick={() =>
                    document.getElementById("profileUpload").click()
                  }
                >
                  Upload Photo
                </Button>
              </div>
            </div>

            {/* Date of Birth Field */}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Date of Birth<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  {...register("dob", {
                    required: "Date of birth is required",
                    validate: (value) =>
                      new Date(value) <= new Date() ||
                      "Future date not allowed",
                  })}
                  className="h-11 w-full pl-10 text-slate-500 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                />
              </div>
              {errors?.dob && (
                <p className="text-sm text-red-500">
                  {errors.dob.message}
                </p>
              )}
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Gender<span className="text-red-500">*</span>
              </Label>
              <select
                name="gender"
                {...register("gender",{
                  required: "Gender is required",
                })}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </Card>

        {/* 3. PROFESSIONAL INFORMATION CARD */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Briefcase className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              Professional Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Role<span className="text-red-500">*</span></Label>
              <select
                {...register("roleId", { required: "Role is required" })}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.roleName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Employee ID<span className="text-red-500">*</span>
              </Label>
              <Input
                name="employeeId"
                // {...register("employeeId")}
                // readOnly
                value={employeeId}
                className="h-11 bg-slate-50 text-slate-500"
                disabled
              />
            </div>

 <div className="space-y-2">
  <Label className="text-sm font-medium text-slate-700">
    Date of Joining<span className="text-red-500">*</span>
  </Label>

  <div className="relative">
    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />

    <Input
      type="date"
      name="joiningDate"
      {...register("joiningDate", {
        required: "Joining date is required",
      })}
      className="h-11 w-full pl-10 text-slate-500 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:left-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
    />
  </div>

  {errors?.joiningDate && (
    <p className="text-sm text-red-500">
      {errors.joiningDate.message}
    </p>
  )}
</div>
          </div>
        </Card>

       {/* 4. CONTACT INFORMATION CARD */}
<Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
  <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
    <PhoneCall className="w-5 h-5 text-slate-700" />
    <h2 className="text-lg font-semibold text-slate-800">
      Contact Information
    </h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* EMAIL */}
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        Email Address <span className="text-red-500">*</span>
      </Label>

      <div className="relative">
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

        <Input
          name="email"
          {...register("email", {
            required: "Email is required",
pattern: {
  value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in|org|net|co\.in)$/,
  message: "Please enter a valid email address",
},
          })}
          placeholder="Enter Email"
          className="h-11 pl-9"
        />
      </div>

      {errors.email && (
        <p className="text-sm text-red-500">
          {errors.email.message}
        </p>
      )}
    </div>

    {/* PHONE */}
    <div className="space-y-2">
      <Label className="text-sm font-medium text-slate-700">
        Phone Number <span className="text-red-500">*</span>
      </Label>

<div className="relative">
  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

  <Input
    type="tel"
    maxLength={10}
    inputMode="numeric"
    name="phone"
    {...register("phone", {
      required: "Phone number is required",
      pattern: {
        value: /^[6-9]\d{9}$/,
        message: "Enter a valid 10-digit phone number",
      },
      minLength: {
        value: 10,
        message: "Phone number must be 10 digits",
      },
      maxLength: {
        value: 10,
        message: "Phone number must be 10 digits",
      },
    })}
    onInput={(e) => {
      e.target.value = e.target.value
        .replace(/\D/g, "")
        .slice(0, 10);
    }}
    placeholder="Enter Phone"
    className="h-11 pl-9"
  />
</div>

      {errors.phone && (
        <p className="text-sm text-red-500">
          {errors.phone.message}
        </p>
      )}
    </div>
  </div>
</Card>

        {/* 5. ADDRESS DETAILS CARD */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <MapPin className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              Address Details
            </h2>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Current Address<span className="text-red-500">*</span>
              </Label>
              <Input
                name="currentAddress"
                {...register("currentAddress",{
                  required: "Current address is required",
                })}
                placeholder="Street name, City, State, ZIP"
                className="h-11"
              />
                {errors.currentAddress && (
    <p className="text-red-500 text-xs mt-1">
      {errors.currentAddress.message}
    </p>
  )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">
                  Permanent Address<span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setSameAddress(checked);

                      if (checked) {
                        setValue("permanentAddress", watch("currentAddress"));
                      } else {
                        setValue("permanentAddress", "");
                      }
                    }}
                    id="same-address"
                    className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                  />
                  <label
                    htmlFor="same-address"
                    className="text-xs text-slate-600 cursor-pointer"
                  >
                    Same as Current Address
                  </label>
                </div>
              </div>
              <Input
                name="permanentAddress"
                disabled={sameAddress}
                {...register("permanentAddress",{
                  required: "Permanent address is required",
                })}
                placeholder="Street name, City, State, ZIP"
                className={`h-11 ${sameAddress ? "bg-slate-100 cursor-not-allowed text-slate-500" : ""}`}
              />
                {errors.permanentAddress && (
    <p className="text-red-500 text-xs mt-1">
      {errors.permanentAddress.message}
    </p>
  )}
            </div>
          </div>
        </Card>

        {/* 6. DOCUMENTS & VERIFICATION CARD */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <FileText className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              Documents & Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Drag & Drop Zone 1 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                ID Proof (Aadhar/Voter ID)
              </Label>

              <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                {/* hidden input */}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  {...register("idProof")}
                />

                {/* preview or icon */}
                {idProof && idProof.length > 0 ? (
                  <img
                    src={URL.createObjectURL(idProof[0])}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                ) : (
                  <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                )}

                {/* text */}
                <p className="text-sm font-medium text-slate-700">
                  Click to upload or drag & drop
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, PNG up to 5MB
                </p>
              </label>
            </div>

            {/* Drag & Drop Zone 2 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Police Verification Report
              </Label>

              <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                {/* hidden input */}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  {...register("policeVerification")}
                />

                {/* preview or icon */}
                {policeVerification && policeVerification.length > 0 ? (
                  <img
                    src={URL.createObjectURL(policeVerification[0])}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-slate-400 mb-3" />
                )}

                {/* text */}
                <p className="text-sm font-medium text-slate-700">
                  Upload verification document
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Mandatory for all field staff
                </p>
              </label>
            </div>
          </div>
        </Card>

        {/* 7. STAFF STATUS CARD */}
        <Card className="p-6 rounded-xl border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <ClipboardCheck className="w-5 h-5 text-slate-700" />
            <h2 className="text-lg font-semibold text-slate-800">
              Staff Status
            </h2>
          </div>

          <div className="max-w-md space-y-2">
            <Label className="text-sm font-medium text-slate-700">Status</Label>
            <select
              {...register("status")}
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </Card>

        {/* 8. FOOTER BUTTONS */}
        <div className="flex items-center justify-end gap-4 pt-4 pb-10">
          <Button
          type="button"
            variant="secondary"
            className="h-11 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            onClick={() => navigate("/admin/staff")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 px-8 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold cursor-pointer"
          >
            Add New Staff
          </Button>
        </div>
      </div>
    </form>
  );
}

