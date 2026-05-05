import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Shield, Lock, Smartphone, Camera, Users, MonitorSmartphone, KeyRound } from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { getStudentProfileApi } from '../../../../utils/utils';

export default function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
  emergencyContacts: [],
  accountSecurity: {}
});

  const fetchProfile = async () => {
    setLoading(true);
    const res = await getStudentProfileApi();
    if (res?.status === "success") {
      setProfile(res.data);
    }
    setLoading(false);
  };

   useEffect(() => {
    fetchProfile();
  }, []);

  if (!profile) {
  return<div className="text-center py-10">Loading...</div>;
}

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Details</h1>
          <p className="text-gray-500 mt-1">View and update your personal information, contact details, and profile settings</p>
        </div>
        <Button onClick={() => navigate('/student/profile/edit')} className="bg-[#0f172a] hover:bg-[#1e293b] text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
          <Edit2 className="w-4 h-4" /> Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Avatar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sandeep&backgroundColor=0f172a" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-1 bg-slate-900 p-2 rounded-full border-2 border-white shadow-sm text-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
            <p className="text-xs font-bold text-gray-900 tracking-widest uppercase mt-1">{profile.course}</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide">
               {profile.status}
            </div>
          </div>
        </div>

        {/* Right Col - Details */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card: Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Personal Information</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date of Birth</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.dateOfBirth}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gender</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.gender}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Contact Number</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.contactNumber}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Address</p>
                <p className="font-semibold text-gray-900 mt-1 leading-relaxed">{profile.currentAddress}</p>
              </div>
            </div>
          </div>

          {/* Card: Academic Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
            <div className="flex items-center gap-2 mb-6 text-gray-400">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/></svg>
               <h3 className="text-xs font-bold tracking-widest uppercase text-gray-500">Academic Details</h3>
            </div>
            <div className="space-y-5">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Student ID</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.studentId}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">University Email</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.email}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Major Course</p>
                <p className="font-semibold text-gray-900 mt-1">{profile.course}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enrollment Date</p>
                <p className="font-semibold text-gray-900 mt-1"> {profile.joiningDate || "N/A"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
           <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6">Emergency Contacts</h3>
           
           <div className="space-y-4">
             {/* Contact 1 */}
             {profile.emergencyContacts?.map((contact, index) => (
             <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
               <div className="bg-gray-50 p-3 rounded-xl text-slate-800">
                 <Users className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-bold text-gray-900 text-[15px]">{contact.name}</p>
                 <p className="text-xs text-gray-500 mb-1">{contact.relationship}</p>
                 <p className="text-sm text-gray-500 font-medium">+91 {contact.contactNumber}</p>
               </div>
             </div>
))}
            {/* Contect 2 */}
             {/* <div className="flex items-center gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
               <div className="bg-gray-50 p-3 rounded-xl text-slate-800">
                 <Users className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-bold text-gray-900 text-[15px]">Abhishek Sharma</p>
                 <p className="text-xs text-gray-500 mb-1">Father</p>
                 <p className="text-sm text-gray-500 font-medium">+91 9856423654</p>
               </div>
             </div> */}
           </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
           <h3 className="text-xs font-bold tracking-widest uppercase text-gray-900 mb-6">Account Security</h3>
           
           <div className="space-y-6">
             {/* Option 1 */}
             <div className="flex items-center justify-between cursor-pointer group">
               <div className="flex items-center gap-4">
                 <div className="bg-gray-50 group-hover:bg-gray-100 transition-colors p-3 rounded-full text-slate-500">
                   <KeyRound className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 text-[14px]">Change Password</p>
                   <p className="text-xs text-gray-500 mt-0.5">Last updated {profile.accountSecurity?.passwordLastUpdated}</p>
                 </div>
               </div>
               <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </div>

             {/* Option 2 */}
             <div className="flex items-center justify-between cursor-pointer group">
               <div className="flex items-center gap-4">
                 <div className="bg-gray-50 group-hover:bg-gray-100 transition-colors p-3 rounded-full text-slate-500">
                   <Shield className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 text-[14px]">2FA Status</p>
                   <p className="text-[10px] font-bold text-slate-900 uppercase tracking-wide mt-1">Active - SMS/Email</p>
                 </div>
               </div>
               {/* Toggle Switch UI */}
               <div className="w-11 h-6 bg-slate-900 rounded-full relative cursor-pointer">
                 <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm"></div>
               </div>
             </div>

             {/* Option 3 */}
             <div className="flex items-center justify-between cursor-pointer group">
               <div className="flex items-center gap-4">
                 <div className="bg-gray-50 group-hover:bg-gray-100 transition-colors p-3 rounded-full text-slate-500">
                   <MonitorSmartphone className="w-5 h-5" />
                 </div>
                 <div>
                   <p className="font-bold text-gray-900 text-[14px]">Login Activity</p>
                   <p className="text-xs text-gray-500 mt-0.5">{profile.accountSecurity?.activeSessions} Active Sessions</p>
                 </div>
               </div>
               <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </div>

           </div>
        </div>
      </div>
    </div>
  );
}
