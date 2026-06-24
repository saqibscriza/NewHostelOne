import React, { useState, useEffect } from 'react';
import { Pencil, User, UserCog, Shield, Bell, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { getChefProfileApi, changePasswordApi } from '../../../utils/utils';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Switch } from '../../../components/ui/switch';
import { Input } from '../../../components/ui/input';

export default function Profile() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await getChefProfileApi();
      if (res?.data?.status === 'success') {
        setProfileData(res.data.staff);
      }
    };
    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    
    const data = {
      oldPassword: oldPassword,
      password: newPassword
    };

    const res = await changePasswordApi(data);
    if (res?.data?.status === 'success' || res?.status === 200) {
      toast.success(res?.data?.message || 'Password changed successfully');
      setIsPasswordDialogOpen(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(res?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="w-full h-full p-8 bg-[#f9fafb]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Details</h1>
        <Button variant="outline" className="flex items-center gap-2 bg-[#eef2f6] hover:bg-gray-200 text-gray-700 border-0 rounded-md font-semibold px-4 h-10" onClick={() => navigate('/chef/profile/edit')}>
          <Pencil className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Profile Card */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center h-fit">
            <div className="w-32 h-32 bg-[#2b4041] rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                {profileData?.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" fill="#e8d3b9"/>
                    <path d="M18 19V21H6V19C6 16.7909 7.79086 15 10 15H14C16.2091 15 18 16.7909 18 19Z" fill="#e8d3b9"/>
                    <path d="M14 15L12 18L10 15H14Z" fill="#2b4041"/>
                    <path d="M12 18V21" stroke="#2b4041" strokeWidth="2"/>
                  </svg>
                )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{profileData?.fullName || "Loading..."}</h2>
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider mt-1">{profileData?.roleName || "CHEF HEAD"}</p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-8 text-gray-900">
              <User className="w-6 h-6" />
              <h3 className="text-xl font-bold">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">EMAIL ADDRESS</p>
                <p className="text-base text-gray-900 font-medium">{profileData?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">PHONE NUMBER</p>
                <p className="text-base text-gray-900 font-medium">{profileData?.phone || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">ADDRESS DETAILS</p>
                <p className="text-base text-gray-900 font-medium">{profileData?.currentAddress || "N/A"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">DATE OF JOINING</p>
                <p className="text-base text-gray-900 font-medium">{profileData?.joiningDate || "N/A"}</p>
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">EMPLOYEE ID</p>
                <p className="text-base text-gray-900 font-medium">{profileData?.employeeId || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6 text-gray-900">
              <UserCog className="w-6 h-6" />
              <h3 className="text-xl font-bold">Account Settings</h3>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                <div className="bg-[#f3f6f8] p-3 rounded-lg border border-gray-100 text-gray-800">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500 font-medium">Receive weekly reports and system alerts</p>
                </div>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6 text-gray-900">
              <Shield className="w-6 h-6" />
              <h3 className="text-xl font-bold">Security</h3>
            </div>
            
            <div className="bg-[#f4f5f5] rounded-xl p-5 flex items-center justify-between border border-transparent">
              <div>
                <p className="text-base font-bold text-gray-900">Password Management</p>
                <p className="text-sm text-gray-500 font-medium">Last changed 45 days ago</p>
              </div>
              
              <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="font-bold text-black hover:bg-gray-200/50 bg-transparent">
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[440px] p-8 bg-white border-0 shadow-2xl rounded-2xl">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-[22px] font-bold text-gray-900">Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CURRENT PASSWORD</label>
                      <div className="relative">
                        <Input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="********" 
                          className="pr-10 border-gray-200 bg-white h-12"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">NEW PASSWORD</label>
                      <div className="relative">
                        <Input 
                          type={showNewPassword ? "text" : "password"} 
                          placeholder="Enter new password" 
                          className="pr-10 border-gray-200 bg-white h-12"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-gray-500 font-medium">Password must be at least 8 characters long.</p>
                    </div>
                    <div className="flex flex-col gap-2 relative">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">CONFIRM NEW PASSWORD</label>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"} 
                          placeholder="Re-type new password" 
                          className="pr-10 border-gray-200 bg-white h-12"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button 
                          type="button" 
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-4 mt-8">
                    <Button 
                      variant="outline" 
                      className="w-1/2 border-gray-200 text-gray-700 font-bold h-12 rounded-lg hover:bg-gray-50 shadow-none"
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      className="w-1/2 bg-black text-white font-bold h-12 rounded-lg hover:bg-gray-900 shadow-none"
                      onClick={handleChangePassword}
                    >
                      Update Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
