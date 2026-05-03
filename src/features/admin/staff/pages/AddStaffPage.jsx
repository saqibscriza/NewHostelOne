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
  } = useForm();
  const profileImage = watch("profileImage");
  const idProof = watch("idProof");
  const policeVerification = watch("policeVerification");

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
          navigate("/staff");
        }, 2000);
      } else {
        toast.error(res?.data?.message || "Something went wrong");
        setLoaderCheck(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Server Error");
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
                Full Name
              </Label>
              <Input
                className="h-11"
                name="fullName"
                {...register("fullName", { required: "Full name required" })}
                placeholder="Enter Full Name"
              />
            </div>

            {/* Profile Picture Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Profile Picture
              </Label>
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 border flex items-center justify-center overflow-hidden">
                  {profileImage && profileImage.length > 0 ? (
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
                  accept="image/*"
                  {...register("profileImage")}
                />
                <Button
                  className="h-11 bg-slate-100 hover:bg-slate-200 text-slate-700"
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
                Date of Birth
              </Label>
              <Input
                type="date"
                name="dob"
                {...register("dob")}
                className="h-11 text-slate-500"
              />
            </div>

            {/* Gender Field */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Gender
              </Label>
              <select
                name="gender"
                {...register("gender")}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <Label className="text-sm font-medium text-slate-700">Role</Label>
              <select
                {...register("roleId", { required: "Role is required" })}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                Employee ID
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
                Date of Joining
              </Label>
              <Input
                type="date"
                name="joiningDate"
                {...register("joiningDate")}
                className="h-11 text-slate-500"
              />
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
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="email"
                  {...register("email")}
                  placeholder="Enter Email"
                  className="h-11 pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Phone Number
              </Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  name="phone"
                  {...register("phone")}
                  placeholder="Enter Phone"
                  className="h-11 pl-9"
                />
              </div>
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
                Current Address
              </Label>
              <Input
                name="currentAddress"
                {...register("currentAddress")}
                placeholder="Street name, City, State, ZIP"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-slate-700">
                  Permanent Address
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
                {...register("permanentAddress")}
                placeholder="Street name, City, State, ZIP"
                className="h-11"
              />
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
                  accept=".pdf,.jpg,.png"
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
                  accept=".pdf,.jpg,.png"
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
              className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </Card>

        {/* 8. FOOTER BUTTONS */}
        <div className="flex items-center justify-end gap-4 pt-4 pb-10">
          <Button
            variant="secondary"
            className="h-11 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            onClick={() => navigate("/staff")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="h-11 px-8 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold"
          >
            Add New Staff
          </Button>
        </div>
      </div>
    </form>
  );
}
