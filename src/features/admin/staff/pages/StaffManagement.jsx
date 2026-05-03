import React, { useState, useEffect } from "react";
import { Search, Plus, Phone, Mail, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import AddRoleModal from "./AddRolePage";
import { useNavigate } from "react-router-dom";
import { getAllStaffApi } from "../../../../utils/utils";
import { deleteStaffApi } from "../../../../utils/utils";
import toast from "react-hot-toast";

export default function StaffManagement() {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [staffData, setStaffData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaderCheck, setLoaderCheck] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch Staff
useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const res = await getAllStaffApi();

        if (res?.data?.staff) {
          const formatted = res.data.staff.map((item) => ({
            id: item.id,
            staffId: item.staffId,
            fullName: item.fullName,
            roleName: item.roleName,
            phone: item.phone,
            email: item.email,
            employeeId: item.employeeId,
          }));

          setStaffData(formatted);
          setFilteredData(formatted);
        }
      } catch (error) {
        console.log("Error fetching staff:", error);
      }
      setLoading(false);
    };

    fetchStaff();
  }, []);

  // ✅ Search Filter
  useEffect(() => {
    const filtered = staffData.filter((staff) =>
      staff.fullName?.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filtered);
  }, [search, staffData]);

  // ✅ Initials helper
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };



  // delete staff Api
const MyDeleteStaffApi = async (id) => {
  setLoaderCheck(true);

  try {
    const response = await deleteStaffApi(id);
    console.log("delete response", response);

    if (response?.data?.status === "success") {
      toast.success(response?.data?.message);
      await fetchStaff();
    } else {
      toast.error(response?.data?.message || "Delete failed");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  } finally {
    setLoaderCheck(false);
  }
};

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Efficiently manage and monitor all hostel employees in one place.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setIsRoleModalOpen(true)}
            className="bg-[#0f172a] text-white hover:bg-slate-800 gap-2 h-10 px-4 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Role
          </Button>
          <Button 
            onClick={() => navigate("/admin/staff/add")}
            className="bg-[#0f172a] text-white hover:bg-slate-800 gap-2 h-10 px-4 rounded-lg"
          >
            <Plus className="w-4 h-4" /> Add Staff
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
              Total Staff
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">{staffData.length}</span>
              <span className="bg-muted text-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                +2 this month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
              Present Today
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">21</span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden mb-2">
                <div className="w-3/4 h-full bg-foreground rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
              On Leave
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">3</span>
              <span className="bg-muted text-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                Approved
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-border shadow-sm rounded-xl">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-3">
              New Applications
            </p>
            <div className="flex items-end justify-between">
              <span className="text-3xl font-bold text-foreground">12</span>
              <span className="bg-muted text-foreground text-xs font-bold px-2.5 py-1 rounded-full">
                Pending
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground">Staff Details</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-card border-border h-10 rounded-lg"
            />
          </div>
        </div>

        <Card className="border-border shadow-sm rounded-xl overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-card">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Staff Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Contact Details
                  </th>
                  {/* <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Attendance Status
                  </th> */}
                  <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
  {loading ? (
    <tr>
      <td colSpan="4" className="text-center py-10">
        Loading...
      </td>
    </tr>
  ) : filteredData.length === 0 ? (
    <tr>
      <td colSpan="4" className="text-center py-10">
        No staff found
      </td>
    </tr>
  ) : 
    filteredData.map((staff) => (
                  <tr key={staff.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground font-bold text-sm shrink-0">
                          {getInitials(staff.fullName)}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{staff.fullName}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Emp ID: {staff.employeeId}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-muted text-foreground text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
                        {staff.roleName}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        {staff.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3.5 h-3.5 shrink-0" />
                        {staff.email}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-foreground shrink-0"></span>
                        {staff.status}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-muted-foreground hover:text-foreground transition-colors"
                        onClick={() => navigate(`/admin/staff/edit/${staff.staffId}`)}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-muted-foreground hover:text-destructive transition-colors"
                        onClick={() => MyDeleteStaffApi(staff.staffId)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4">
            <span className="text-sm text-muted-foreground">
              Showing 1 to 4 of 24 hostels
            </span>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" className="h-8 w-8 bg-[#0f172a] text-white hover:bg-slate-800 hover:text-white">
                1
              </Button>
              <Button variant="ghost" className="h-8 w-8 text-foreground hover:bg-muted">
                2
              </Button>
              <Button variant="ghost" className="h-8 w-8 text-foreground hover:bg-muted">
                3
              </Button>
              <span className="px-2 text-muted-foreground">...</span>
              <Button variant="ghost" className="h-8 w-8 text-foreground hover:bg-muted">
                6
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <AddRoleModal 
        isOpen={isRoleModalOpen} 
        onClose={() => setIsRoleModalOpen(false)} 
      />
    </div>
  );
}


