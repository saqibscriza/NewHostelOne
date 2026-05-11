import React, { useEffect ,useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Upload, X } from "lucide-react";

import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/Card";
import { getAllPackageApi, addHostelRegisterApi } from "../../../utils/utils";

export default function RegisterHostel() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loaderCheck, setLoaderCheck] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("register");
    setSearchParams(newParams);
  };

  // For Fetch packages for dropdown
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await getAllPackageApi();
        console.log("API Response:", res);

        if (res?.data) {
          setPackages(res.data); // 👈 store packages
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPackages();
  }, []);


  const MyAddRegisterHostelApi = async (data) => {
  console.log("FORM DATA:", data);

  const formData = new FormData();
  formData.append("hostelName", data.hostelName);
  formData.append("hostelType", data.hostelType);
  formData.append("address", data.address);
  formData.append("contactNumber", data.contactNumber);
  formData.append("alternateContactNumber", data.alternateContactNumber);
  formData.append("package", data.package);
  formData.append("pinCode", data.pinCode);
  formData.append("country", data.country);
  formData.append("state", data.state);
  formData.append("city", data.city);

  if (data.hostelLogo && data.hostelLogo[0]) {
    formData.append("profilePhoto", data.hostelLogo[0]);
  }

  try {
    console.log("API CALLING...");
    setLoaderCheck(true);

    const res = await addHostelRegisterApi(formData);

    console.log("API RESPONSE:", res);

    if (res?.data?.status === "success") {
      handleClose();
      navigate("/login");
    } else {
      console.log("API ERROR RESPONSE");
    }
  } catch (error) {
    console.log("API ERROR:", error);
  } finally {
    setLoaderCheck(false);
  }
};

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-2xl shadow-xl flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-gray-600 hover:text-black transition-colors z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center py-8 flex-1 overflow-hidden">
          {/* Form Area */}
          <div className="flex justify-center w-full flex-1 min-h-0">
            <Card className="w-full max-w-[500px] border border-gray-200 rounded-[1.25rem] shadow-sm p-7 flex flex-col">
              <div className="mb-6 shrink-0">
                <h2 className="text-[32px] font-extrabold tracking-tight text-black leading-none">
                  Sign Up
                </h2>
                <p className="text-gray-500 text-[15px] mt-1.5">
                  Create your account to get started quickly and securely
                </p>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar">
                {/* Hostel Details */}
                <form onSubmit={handleSubmit(MyAddRegisterHostelApi)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Hostel Name
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Hostel Name"
                          {...register("hostelName", { required: "Hostel Name is required" })}
                          className={`w-full h-10 px-3 text-[14px] rounded-lg border ${errors.hostelName ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        />
                        {errors.hostelName && <span className="text-red-500 text-xs">{errors.hostelName.message}</span>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Hostel Type
                        </label>
                        <div className="relative">
                          <select
                            {...register("hostelType", { required: "Hostel Type is required" })}
                            className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.hostelType ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                            style={{
                              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 0.75rem center",
                              backgroundSize: "1em"
                            }}
                          >
                            <option value="">Select Hostel Type</option>
                            <option value="BOYS">BOYS</option>
                            <option value="GIRLS">GIRLS</option>
                            <option value="BOTH">BOTH</option>
                          </select>
                        </div>
                        {errors.hostelType && <span className="text-red-500 text-xs">{errors.hostelType.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black">
                        Package
                      </label>
                      <select
                        className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.package ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        {...register("package", { required: "Package is required" })}
                        style={{
                          backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 0.75rem center",
                          backgroundSize: "1em"
                        }}
                      >
                        <option value="">Select Package</option>
                        {packages.map((pkg) => (
                          <option key={pkg.id} value={pkg.packageId}>
                            {pkg.packageName}
                          </option>
                        ))}
                      </select>
                      {errors.package && <span className="text-red-500 text-xs">{errors.package.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Contact Number"
                          {...register("contactNumber", { 
                            required: "Contact Number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Invalid phone number, must be 10 digits"
                            }
                          })}
                          className={`w-full h-10 px-3 text-[14px] rounded-lg border ${errors.contactNumber ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        />
                        {errors.contactNumber && <span className="text-red-500 text-xs">{errors.contactNumber.message}</span>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Alternate Contact Number
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Alternate Number"
                          {...register("alternateContactNumber", {
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Invalid phone number, must be 10 digits"
                            }
                          })}
                          className={`w-full h-10 px-3 text-[14px] rounded-lg border ${errors.alternateContactNumber ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        />
                        {errors.alternateContactNumber && <span className="text-red-500 text-xs">{errors.alternateContactNumber.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black">
                        Address
                      </label>
                      <div className="relative">
                       
                        <input
                          type="text"
                          placeholder="Enter Full Address"
                          {...register("address", { required: "Address is required" })}
                          className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.address ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        />
                      </div>
                      {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Pin code
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Code"
                          {...register("hostelPincode", { required: "Pin code is required" })}
                          className={`w-full h-10 px-3 text-[14px] rounded-lg border ${errors.hostelPincode ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                        />
                        {errors.hostelPincode && <span className="text-red-500 text-xs">{errors.hostelPincode.message}</span>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          Country
                        </label>
                        <div className="relative">
                          <select
                            {...register("country", { required: "Country is required" })}
                            className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.country ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                            style={{
                              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 0.75rem center",
                              backgroundSize: "1em"
                            }}
                          >
                            <option value="">Select country</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                          </select>
                        </div>
                        {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          State
                        </label>
                        <div className="relative">
                          <select
                            {...register("state", { required: "State is required" })}
                            className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.state ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                            style={{
                              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 0.75rem center",
                              backgroundSize: "1em"
                            }}
                          >
                            <option value="">Select State</option>
                            <option value="Rajasthan">Rajasthan</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Delhi">Delhi</option>
                          </select>
                        </div>
                        {errors.state && <span className="text-red-500 text-xs">{errors.state.message}</span>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-black">
                          City
                        </label>
                        <div className="relative">
                          <select
                            {...register("city", { required: "City is required" })}
                            className={`w-full h-10 px-3 py-0 text-[14px] rounded-lg border ${errors.city ? "border-red-500" : "border-gray-200"} bg-white text-black focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none text-gray-500`}
                            style={{
                              backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "right 0.75rem center",
                              backgroundSize: "1em"
                            }}
                          >
                            <option value="">Select City</option>
                            <option value="Jaipur">Jaipur</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Ahmedabad">Ahmedabad</option>
                            <option value="Delhi">Delhi</option>
                          </select>
                        </div>
                        {errors.city && <span className="text-red-500 text-xs">{errors.city.message}</span>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-black">
                        Logo
                      </label>
                      <label className="flex items-center justify-between w-full h-10 px-3 rounded-lg border border-gray-200 bg-white cursor-pointer hover:bg-gray-50 text-gray-400 text-[14px]">
                        <span>Upload Logo</span>
                        <Upload className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          {...register("hostelLogo")}
                        />
                      </label>
                    </div>

                    <Button
                      type="submit"
                      disabled={loaderCheck}
                      className="w-full h-11 mt-4 bg-[#0b132b] hover:bg-[#1e293b] text-white rounded-lg text-[15px] font-medium transition-colors"
                    >
                      {loaderCheck ? "Submitting..." : "Sign Up"}
                    </Button>
                  </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}