import React, { useState, useEffect, useRef } from 'react';
import { User, Calendar, Fingerprint, ShieldCheck, History, Pencil, Briefcase, Upload } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { getChefProfileApi, updateChefProfileApi, getLocationByPincodeApi } from '../../../utils/utils';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [staffId, setStaffId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [imageRemoved, setImageRemoved] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      pinCode: "",
      country: "",
      state: "",
      city: "",
      joiningDate: "",
      employeeId: "",
      status: "Active"
    }
  });

  const pinCode = watch("pinCode");
  const joiningDate = watch("joiningDate");
  const employeeId = watch("employeeId");
  const status = watch("status");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getChefProfileApi();
      if (res?.data?.status === 'success') {
        const staff = res.data.staff;
        setStaffId(staff.id);
        reset({
          fullName: staff.fullName || "",
          email: staff.email || "",
          phone: staff.phone || "",
          address: staff.currentAddress || "",
          pinCode: staff.pinCode || "",
          country: staff.country || "",
          state: staff.state || "",
          city: staff.city || "",
          joiningDate: staff.joiningDate || "",
          employeeId: staff.employeeId || "",
          status: staff.status ? "Active" : "Inactive"
        });
        setPreviewImage(staff.profileImage || "");
      }
    };
    fetchProfile();
  }, [reset]);

  useEffect(() => {
    const fetchLocation = async () => {
      if (!pinCode || pinCode.length !== 6) return;
      try {
        const res = await getLocationByPincodeApi(pinCode);
        const locationData = res?.data || res;
        if (!locationData || locationData?.status === "failure" || locationData?.statusCode === 400 || locationData?.statusCode === 404) {
          toast.error(locationData?.message || "Invalid PinCode");
          setValue("country", "");
          setValue("state", "");
          setValue("city", "");
          return;
        }
        setValue("country", locationData.country || "");
        setValue("state", locationData.state || "");
        setValue("city", locationData.district || locationData.city || locationData.region || "");
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid PinCode");
        setValue("country", "");
        setValue("state", "");
        setValue("city", "");
      }
    };
    fetchLocation();
  }, [pinCode, setValue]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file);
    setImageRemoved(false);
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result || "");
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage("");
    setImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Profile image removed");
  };

  const onSubmit = async (data) => {
    if (!staffId) return;
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("currentAddress", data.address);
      if (data.pinCode) formData.append("pinCode", data.pinCode);
      if (data.country) formData.append("country", data.country);
      if (data.state) formData.append("state", data.state);
      if (data.city) formData.append("city", data.city);

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }
      if (imageRemoved) {
        formData.append("removeProfileImage", "true");
      }

      const res = await updateChefProfileApi(formData);
      if (res?.data?.status === 'success') {
        toast.success("Profile updated successfully");
        setTimeout(() => navigate('/chef/profile'), 1500);
      } else {
        toast.error(res?.data?.message || "Failed to update profile");
      }
    } catch (e) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-8 bg-[#f9fafb] relative pb-32">
      <h1 className="text-[28px] font-bold text-gray-900 mb-8">Edit Chef Profile</h1>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 flex items-center gap-8">
        <div className="relative">
          <div className="w-32 h-32 bg-[#e86c60] rounded-2xl overflow-hidden flex items-end justify-center">
             {previewImage ? (
                 <img src={previewImage} alt="profile" className="w-full h-full object-cover" />
             ) : (
                 <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="translate-y-2">
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#fcdbb4"/>
                    <path d="M18 19V21H6V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19Z" fill="#2b2d42"/>
                 </svg>
             )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-black text-white p-2 rounded-full border-2 border-white hover:bg-gray-800"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Photo</h2>
          <p className="text-sm text-gray-500 font-medium mb-4">Update your profile image. Supported formats: JPG, PNG, GIF.</p>
          <div className="flex items-center gap-3">
            <Button 
              className="bg-black text-white hover:bg-gray-900 font-bold px-6 h-10 rounded-md gap-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4" />
              Upload New Photo
            </Button>
            <Button 
              variant="secondary" 
              className="bg-[#eef2f6] text-gray-800 hover:bg-gray-200 font-bold px-6 border-0 h-10 rounded-md"
              onClick={handleRemoveImage}
            >
              Remove
            </Button>
          </div>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Personal Details */}
        <div className="w-full lg:w-2/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 text-gray-900">
              <User className="w-5 h-5" />
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>
            
            <form id="profile-form" onSubmit={handleSubmit(onSubmit)} autoComplete="off" className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-6">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">FULL NAME</label>
                <Input 
                  {...register("fullName")}
                  autoComplete="new-password"
                  className="border-gray-200 bg-white h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">EMAIL ADDRESS</label>
                <Input 
                  {...register("email", {
                    pattern: {
                      value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|in)$/,
                      message: "Invalid email format (must end in .com or .in)"
                    }
                  })}
                  autoComplete="new-password"
                  className={`border-gray-200 bg-white h-12 shadow-sm focus-visible:ring-gray-200 ${errors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                />
                {errors.email && <span className="text-xs text-red-500">{errors.email.message}</span>}
              </div>
              
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">PHONE NUMBER</label>
                <Input 
                  {...register("phone", {
                    pattern: {
                      value: /^[6-9][0-9]{9}$/,
                      message: "Phone number must start with 6, 7, 8, or 9 and contain 10 digits"
                    },
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }
                  })}
                  maxLength={10}
                  autoComplete="new-password"
                  className={`border-gray-200 bg-white h-12 shadow-sm focus-visible:ring-gray-200 ${errors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                />
                {errors.phone && <span className="text-xs text-red-500">{errors.phone.message}</span>}
              </div>

              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-[11px] font-bold text-gray-600 tracking-wide">Address Details</label>
                <Input 
                  {...register("address")}
                  autoComplete="new-password"
                  className="border-gray-200 bg-white h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 tracking-wide">Pin Code</label>
                <Input 
                  {...register("pinCode", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "");
                    }
                  })}
                  maxLength={6} 
                  autoComplete="new-password"
                  placeholder="Enter Pin Code"
                  className="border-gray-200 bg-white h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 tracking-wide">Country</label>
                <Input 
                  {...register("country")}
                  readOnly 
                  placeholder="Country" 
                  className="border-gray-200 bg-gray-50 text-gray-500 h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 tracking-wide">State</label>
                <Input 
                  {...register("state")}
                  readOnly 
                  placeholder="State" 
                  className="border-gray-200 bg-gray-50 text-gray-500 h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-gray-600 tracking-wide">City</label>
                <Input 
                  {...register("city")}
                  readOnly 
                  placeholder="City" 
                  className="border-gray-200 bg-gray-50 text-gray-500 h-12 shadow-sm focus-visible:ring-gray-200" 
                />
              </div>
            </form>
          </div>
        </div>

        {/* Professional Info */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
            <div className="flex items-center gap-3 mb-10 text-gray-900">
              <Briefcase className="w-5 h-5" />
              <h3 className="text-xl font-bold">Professional Info</h3>
            </div>
            
            <div className="flex flex-col gap-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f4f6f8] flex items-center justify-center text-gray-800 border border-gray-100">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">DATE OF JOINING</p>
                  <p className="text-base text-gray-900 font-medium mb-0.5">{joiningDate || "N/A"}</p>
                  <p className="text-[11px] text-gray-500 font-medium">Non-editable field</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f4f6f8] flex items-center justify-center text-gray-800 border border-gray-100">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">EMPLOYEE ID</p>
                  <p className="text-base text-gray-900 font-medium mb-0.5">{employeeId || "N/A"}</p>
                  <p className="text-[11px] text-gray-500 font-medium">System generated</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#f4f6f8] flex items-center justify-center text-gray-800 border border-gray-100">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">ACCOUNT STATUS</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <p className="text-sm text-gray-900 font-bold">{status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="absolute bottom-8 left-8 right-8 bg-white border border-gray-100 p-5 px-8 flex justify-between items-center rounded-xl shadow-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <History className="w-4 h-4" />
          <span className="text-sm font-medium">Last updated recently</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="bg-[#eef2f6] hover:bg-gray-200 text-gray-800 font-bold border-0 px-8 h-12 rounded-lg" onClick={() => navigate('/chef/profile')}>
            Cancel
          </Button>
          <Button type="submit" form="profile-form" className="bg-black hover:bg-gray-900 text-white font-bold px-8 h-12 rounded-lg">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
