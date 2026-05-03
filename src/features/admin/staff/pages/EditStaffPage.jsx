import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { updateStaffApi } from "../../../../utils/utils";
// import { getStaffByIdApi } from "../../../../utils/utils";
import { getAllRoleApi } from "../../../../utils/utils";

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

export default function UpdateStaff() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roles, setRoles] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [sameAddress, setSameAddress] = useState(false);
  const [profileImage, setProfileImage] = useState([]);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [loading, setLoading] = useState(false);




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
  
    }, []);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();


  // // get staff by id Api
  // const MyStaffDataById = async () => {
  //   setLoaderCheck(true);
  //   try {
  //     const response = await getStaffByIdApi(id);
  //     console.log("staff data by id", response.data);

  //     if (response?.data?.status === "success") {
  //       const staff = response?.data?.staff?.[0]; 

  //       setEmployeeId(staff.staffId);

  //       setLoaderCheck(false);
  //       // ⭐ FORM FILL
  //       reset({
  //         fullName: staff.fullName,
  //         dob: staff.dob?.slice(0, 10),
  //         gender: staff.gender,
  //         roleId: staff.roleId,
  //         joiningDate: staff.joiningDate?.slice(0, 10),
  //         email: staff.email,
  //         phone: staff.phone,
  //         currentAddress: staff.currentAddress,
  //         permanentAddress: staff.permanentAddress,
  //         status: staff.status === true ? "ACTIVE" : "INACTIVE",
  //         profileImage: staff.profileImage,
  //         idProof: staff.idProof,
  //         policeVerification: staff.policeVerification,
  //       });
  //     } else {
  //       toast.error(response?.data?.message);
  //       setLoaderCheck(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoaderCheck(false);
  //   }
  // };



  const MyStaffDataById = async () => {
  setLoaderCheck(true);
  try {
    const response = await getStaffByIdApi(id);

    console.log("API RESPONSE:", response.data);

    const staff = response.data; // ✅ FIX

    if (staff) {
      setEmployeeId(staff.staffId);

      reset({
        fullName: staff.fullName || "",
        dob: staff.dob?.slice(0, 10) || "",
        gender: staff.gender || "",
        roleId: staff.roleId || "",
        joiningDate: staff.joiningDate?.slice(0, 10) || "",
        email: staff.email || "",
        phone: staff.phone || "",
        currentAddress: staff.currentAddress || "",
        permanentAddress: staff.permanentAddress || "",
        status: staff.status ? "ACTIVE" : "INACTIVE",
      });
    } else {
      toast.error("Staff not found");
    }

  } catch (error) {
    console.log(error);
  } finally {
    setLoaderCheck(false);
  }
};
  // update Api
const MyUpdateStaffAPI = async (data) => {
  try {
    setLoading(true);

    const payload = {
      fullName: data.fullName,
      dob: data.dob,
      gender: data.gender,
      roleId: data.roleId,
      joiningDate: data.joiningDate,
      email: data.email,
      phone: data.phone,
      currentAddress: data.currentAddress,
      permanentAddress: data.permanentAddress,
      // ⚠️ status mismatch — backend uses attendanceStatus (check this!)
    };

    const response = await updateStaffApi(id, payload);

    if (response?.data?.status === "success") {
      toast.success(response?.data?.message);
      setTimeout(() => {
        navigate("/staff");
      }, 2000);
    } else {
      toast.error(response?.data?.message);
    }

  } catch (error) {
    console.log(error);
    toast.error("Update failed");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  MyStaffDataById();
}, [id]);


  return (
    <form onSubmit={handleSubmit(MyUpdateStaffAPI)}>
      <div className="p-8 max-w-5xl mx-auto space-y-6 bg-slate-50/50 min-h-screen text-slate-900">
        {/* 1. HEADER SECTION */}
        {/* Yeh div page ka title aur subtitle hold karta hai */}
        <div>
          <h1 className="text-3xl font-bold">Edit Staff</h1>
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
                name="fullName"
                {...register("fullName", { required: "Full name required" })}
                placeholder="Enter Full Name"
                className="h-11"
              />
               <small className="text-danger">{errors.fullName?.message}</small>

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
                  variant="secondary"
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
                // name="gender"
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
                  placeholder="Enter Email Address"
                  {...register("email")}
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
                  placeholder="Enter Phone Number"
                  {...register("phone")}
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
                placeholder="Current Address"
                {...register("currentAddress")}
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
                placeholder="Permanent Address"
                {...register("permanentAddress")}
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
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                <UploadCloud className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  Click to upload or drag & drop
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  {...register("idProof")}
                />
                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, PNG up to 5MB
                </p>
              </div>
            </div>

            {/* Drag & Drop Zone 2 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">
                Police Verification Report
              </Label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer bg-slate-50/50">
                <CheckCircle2 className="w-8 h-8 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  Upload verification document
                </p>
                <input
                  type="file"
                  accept=".pdf,.jpg,.png"
                  className="hidden"
                  {...register("policeVerification")}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Mandatory for all field staff
                </p>
              </div>
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
            type="button"
            onClick={() => navigate("/staff")}
            variant="secondary"
            className="h-11 px-8 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 px-8 bg-[#0f172a] hover:bg-slate-800 text-white font-semibold"
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </div>
      </div>
    </form>
  );
}
