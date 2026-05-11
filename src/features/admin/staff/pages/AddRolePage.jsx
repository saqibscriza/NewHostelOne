import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Label } from "../../../../components/ui/label";
import {
  getAllRoleApi,
  addRoleApi,
  deleteRoleApi,
  updateRoleApi,
} from "../../../../utils/utils";

export default function AddRoleModal({ isOpen, onClose }) {
  const [roles, setRoles] = useState([]);
  const [editingRoleId, setEditingRoleId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm();

  const editRoleName = watch("editRoleName");

  // ✅ GET ALL ROLES
  const fetchRoles = async () => {
    const res = await getAllRoleApi();
    if (res?.data?.roles) {
      setRoles(res.data.roles);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchRoles();
    }
  }, [isOpen]);


  // ✅ ADD ROLE
  const onSubmit = async (data) => {
    const payload = {
      identityName: data.roleName.replace(/\s+/g, "_").toUpperCase(),
    roleName: data.roleName,
    };

    const res = await addRoleApi(payload);
    console.log("Add Role Response:", res);
    if (res?.status === 200) {
      fetchRoles(); // refresh list
      reset();
    }
  };

  // ✅ EDIT CLICK
  const handleEditClick = (role) => {
    setEditingRoleId(role.id);
    setValue("editRoleName", role.roleName);
  };

  // ✅ UPDATE ROLE
const handleUpdateRole = async (id) => {
  const payload = {
    identityName: editRoleName.replace(/\s+/g, "_").toUpperCase(),
    roleName: editRoleName,
  };

  const res = await updateRoleApi(id, payload);

  if (res?.status === 200) {
    setEditingRoleId(null);
    fetchRoles();
  }
};

  // ✅ DELETE ROLE
const handleDeleteRole = async (id) => {
  try {
    const res = await deleteRoleApi(id);

    if (res?.status === 200) {
      setRoles((prev) => prev.filter((r) => r.id !== id));
      toast.success("Role deleted successfully");
      fetchRoles();
    }
  } catch (error) {
    console.log("Delete role error:", error);
    toast.error("Failed to delete role");
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-8 rounded-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Add Role
          </DialogTitle>
        </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          {/* Add New Role Section */}
          <div className="space-y-2">
            <Label className="text-[15px] font-semibold text-slate-700">
              Role Name
            </Label>
            <div className="flex gap-4">
              <Input
                placeholder="Enter Role Name"
                  {...register("roleName", {
    required: "Role name is required",
    validate: (value) =>
      value.trim() !== "" || "Role name cannot be empty",
  })}
                className="h-12 flex-1 rounded-lg border-slate-200"
              />
              <Button
                type="submit"
                className="h-12 px-6 bg-black hover:bg-slate-800 text-white font-semibold rounded-lg"
              >
                Add New Role
              </Button>
              <Button
              type="button"
                variant="secondary"
                onClick={onClose}
                className="h-12 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Role Details Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Role Details</h3>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Role Name
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-slate-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roles.map((role) => (
                    <tr key={role.id} className="bg-white">
                      <td className="px-6 py-4">
                        {editingRoleId === role.id ? (
                          <Input
                            {...register("editRoleName")}
                            className="h-10 max-w-[250px] border-slate-200"
                            autoFocus
                          />
                        ) : (
                          <span className="text-[15px] font-medium text-slate-900">
                            {role.roleName}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {editingRoleId === role.id ? (
                          <Button
                            type="button"
                            onClick={() => handleUpdateRole(role.id)}
                            className="h-9 px-4 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-md uppercase tracking-wider"
                          >
                            Update
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end gap-4">
                            <button
                              onClick={() => handleEditClick(role)}
                              className="text-slate-400 hover:text-slate-900 transition-colors"
                            >
                              <Edit2 className="w-[18px] h-[18px]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-[18px] h-[18px]" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
