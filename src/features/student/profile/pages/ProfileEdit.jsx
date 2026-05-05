import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Switch } from '../../../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import { useAuth } from '../../../../context/AuthContext';
import { getStudentProfileByIdApi } from "../../../../utils/utils";

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { userName } = useAuth();

  const [twoFactor, setTwoFactor] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  const handleSave = () => {
    alert("Profile saved successfully");
    navigate('/student/profile');
  };


const fetchGetProfileById = async () => {
  try {
    const res = await getStudentProfileByIdApi();

    if (res?.status === "success") {
      setProfile(res.data);
    } else {
      console.error("Failed to fetch profile:", res?.message || "Unknown error");
    }

  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Profile</h1>
        <p className="text-gray-500 mt-1">Update your personal information and account preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Col - Forms */}
        <div className="w-full lg:w-2/3 space-y-6">
          
          {/* Profile Photo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm">
                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${userName || 'Sandeep'}&backgroundColor=0f172a`} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 bg-slate-900 p-1.5 rounded-full border-2 border-white shadow-sm text-white">
                <Camera className="w-3 h-3" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-[15px]">Profile Photo</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Upload a professional headshot. JPEG or PNG, max 2MB.<br/>This will be visible on your student ID and portal.</p>
              <div className="flex gap-4 items-center">
                <Button variant="outline" className="text-sm font-medium rounded-lg h-9">Upload New</Button>
                <button className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">Remove</button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</Label>
                <Input defaultValue={userName || "Sandeep Sharma"} className="h-11 rounded-lg border-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</Label>
                <Input defaultValue="14 May 2002" disabled className="h-11 rounded-lg border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed" />
                <p className="text-[10px] text-gray-400 mt-1">Restricted field. Contact registrar to change.</p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</Label>
                <Select defaultValue="Male">
                  <SelectTrigger className="w-full h-11 px-4 rounded-lg border-gray-200">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blood Group</Label>
                <Select defaultValue="O+">
                  <SelectTrigger className="w-full h-11 px-4 rounded-lg border-gray-200">
                    <SelectValue placeholder="Select Blood Group" />
                  </SelectTrigger>
                  <SelectContent>
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
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</Label>
                <Input defaultValue="House No. 45, Block A, Lajpat Nagar II, New Delhi, Delhi" className="h-11 rounded-lg border-gray-200" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
              <div className="flex items-center gap-2 mb-6 text-gray-400">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                 <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Contact Details</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</Label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm">
                      +91
                    </span>
                    <Input defaultValue="9658745215" className="h-11 rounded-none rounded-r-lg border-gray-200 flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Personal Email</Label>
                  <Input defaultValue="sandeep_sharma@gmail.com" type="email" className="h-11 rounded-lg border-gray-200" />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-gray-400">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Emergency Contact</h3>
                </div>
                <button className="text-[10px] font-bold text-gray-900 uppercase tracking-widest hover:underline">+ Add More</button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Name</Label>
                    <Input defaultValue="Rekha Sharma" className="h-11 rounded-lg border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Relationship</Label>
                    <Input defaultValue="Mother" className="h-11 rounded-lg border-gray-200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Emergency Phone</Label>
                  <Input defaultValue="+91 9856547623" className="h-11 rounded-lg border-gray-200" />
                </div>
              </div>
            </div>
          </div>

          {/* Account Preferences */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
               <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Account Preferences</h3>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900 text-[14px]">Two-Factor Authentication</h4>
                  <p className="text-xs text-gray-500 mt-1">Secure your account with a secondary login code.</p>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900 text-[14px]">Email Notifications</h4>
                  <p className="text-xs text-gray-500 mt-1">Receive academic alerts and mess menu updates.</p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <hr className="border-gray-100" />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-bold text-gray-900 text-[14px]">SMS Alerts</h4>
                  <p className="text-xs text-gray-500 mt-1">Get urgent campus notices directly to your phone.</p>
                </div>
                <Switch checked={smsNotif} onCheckedChange={setSmsNotif} />
              </div>
            </div>
          </div>

        </div>

        {/* Right Col - Admin Details */}
        <div className="w-full lg:w-1/3">
          <div className="bg-[#0f172a] rounded-2xl shadow-sm text-white p-8">
            <div className="flex items-center gap-2 mb-8 text-emerald-400">
               <CheckCircle2 className="w-5 h-5" />
               <h3 className="text-xs font-bold tracking-widest uppercase text-white">Academic Status</h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Student ID</p>
                <p className="font-bold text-lg mt-1">EZ-2023-9842</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Course</p>
                <p className="font-medium text-slate-200 mt-1">B.Sc. Computer Science</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year / Semester</p>
                <p className="font-medium text-slate-200 mt-1">2nd Year / Semester 3</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Date</p>
                <p className="font-medium text-slate-200 mt-1">August 12, 2025</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-4 mt-8">
        <Button variant="outline" onClick={() => navigate('/student/profile')} className="rounded-xl h-12 px-6">Cancel</Button>
        <Button onClick={handleSave} className="bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl h-12 px-8 shadow-sm">Save Changes</Button>
      </div>
    </div>
  );
}
