import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { getRoomAllData } from "../../../../utils/utils";
import {
  updateStudentApi,
  getAdminStudentByIdApi,
} from "../../../../utils/utils";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";

import {
  User,
  GraduationCap,
  Users,
  Bed,
  FileText,
  Camera,
} from "lucide-react";

const Label = ({ children }) => (
  <p className="text-xs text-muted-foreground mb-1">{children}</p>
);

const UploadBox = ({ title, subtitle }) => (
  <div className="space-y-2">
    <Label>{title}</Label>
    <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted transition">
      <FileText className="mx-auto mb-2" size={20} />
      <p>{subtitle}</p>
    </div>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <Card>
    <div className="flex items-center gap-2 px-6 py-4 border-b">
      <Icon size={18} />
      <h3 className="font-medium">{title}</h3>
    </div>
    <CardContent className="p-6">{children}</CardContent>
  </Card>
);

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({});
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchRooms = async () => {
    const res = await getRoomAllData();

    if (res?.data?.data?.content) {
      setRooms(res.data.data.content);
    }
  };

  useEffect(() => {
    fetchStudent();
    fetchRooms(); // ✅ added
  }, []);
  // ================= GET BY ID =================

  const fetchStudent = async () => {
    const res = await getAdminStudentByIdApi(id);

    if (res?.data?.status === "success") {
      const d = res.data.data;
      const formatted = {
        fullName: d.personalInformation?.fullName || "",
        dob: d.personalInformation?.dob || "",
        gender: d.personalInformation?.gender || "",
        bloodGroup: d.personalInformation?.bloodGroup || "",
        dateOfJoining: d.personalInformation?.dateOfJoining || "",

        studentId: d.personalInformation?.studentId || "",
        course: d.academicAndContactDetails?.course || "",
        year: d.academicAndContactDetails?.year || "",
        email: d.academicAndContactDetails?.email || "",
        phone: d.academicAndContactDetails?.phone || "",

        guardianName: d.guardianInformation?.guardianName || "",
        relation: d.guardianInformation?.relation || "",
        emergencyContact: d.guardianInformation?.emergencyContact || "",

        roomId: d.roomAssignment?.roomId || "",
        status: d.status || "active",
        block: d.roomAssignment?.roomDetails?.block || "",
        category: d.roomAssignment?.roomDetails?.category || "",
        roomType: d.roomAssignment?.roomDetails?.roomType || "",
      };

      setForm(formatted);
      setOriginalData(formatted); // ✅ ADD THIS
    }
  };

  // ================= HANDLE =================
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ================= PUT =================

  const handleUpdate = async () => {
    if (!form.roomId) {
      alert("Room is required");
      return;
    }

    // if (Object.keys(params).length === 0) {
    //   alert("No changes made");
    //   return;
    // }

    const formatDate = (date) => {
      if (!date) return null;
      if (date.includes("/")) {
        const [d, m, y] = date.split("/");
        return `${y}-${m}-${d}`;
      }
      return date;
    };

    // ONLY SEND CHANGED VALUES

    const allowedFields = [
      "fullName",
      "dob",
      "gender",
      "bloodGroup",
      "dateOfJoining",
      "course",
      "year",
      "email",
      "phone",
      "guardianName",
      "relation",
      "emergencyContact",
      "roomId",
    ];

    Object.keys(form).forEach((key) => {
      if (!allowedFields.includes(key)) return;

      if (
        form[key] !== originalData[key] &&
        form[key] !== "" &&
        form[key] !== null &&
        form[key] !== undefined
      ) {
        params[key] = form[key];
      }
    });

    // ✅ FIX DATE FORMAT
    if (params.dateOfJoining) {
      params.dateOfJoining = params.dateOfJoining.includes("/")
        ? params.dateOfJoining.split("/").reverse().join("-")
        : params.dateOfJoining;
    }

    // ✅ FIX YEAR TYPE
    if (params.year) {
      params.year = Number(params.year);
    }

    console.log("FINAL PARAMS 👉", params);

    const res = await updateStudentApi(id, params);

    if (res?.data?.status === "success") {
      navigate("/admin/students");
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Student Details</h2>
        <p className="text-sm text-muted-foreground">
          Total 1,248 residents across 4 blocks / Location
        </p>
      </div>

      {/* Personal Info */}
      <Section icon={User} title="Personal Information">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-3">
              <Camera />
            </div>
            <p className="text-sm font-medium">Upload Photo</p>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Full Name</Label>
              <Input
                value={form.fullName || ""}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <Input
                value={form.dob || ""}
                onChange={(e) => handleChange("dob", e.target.value)}
              />
            </div>

            <div>
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => handleChange("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Blood Group</Label>
              <Select
                value={form.bloodGroup}
                onValueChange={(v) => handleChange("bloodGroup", v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="O+">O+ Positive</SelectItem>
                  <SelectItem value="A+">A+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date of Joining</Label>
              <Input
                value={form.dateOfJoining || ""}
                onChange={(e) => handleChange("dateOfJoining", e.target.value)}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Academic */}
      <Section icon={GraduationCap} title="Academic & Contact Details">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Student ID / Roll No</Label>
            <Input value={form.studentId || ""} disabled />
          </div>

          <div>
            <Label>Course / Department</Label>
            <Input
              value={form.course || ""}
              onChange={(e) => handleChange("course", e.target.value)}
            />
          </div>

          <div>
            <Label>Year of Study</Label>
            <Select
              value={form.year}
              onValueChange={(v) => handleChange("year", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Email Address</Label>
            <Input
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <Label>Phone Number</Label>
            <Input
              value={form.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
        </div>
      </Section>

      {/* Guardian */}
      <Section icon={Users} title="Guardian Information">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Guardian Name</Label>
            <Input
              value={form.guardianName || ""}
              onChange={(e) => handleChange("guardianName", e.target.value)}
            />
          </div>

          <div>
            <Label>Relationship</Label>
            <Select
              value={form.relation}
              onValueChange={(v) => handleChange("relation", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Emergency Contact</Label>
            <Input
              value={form.emergencyContact || ""}
              onChange={(e) => handleChange("emergencyContact", e.target.value)}
            />
          </div>
        </div>
      </Section>

      <Section icon={Bed} title="Room Assignment">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Block / Wing</Label>
            <Select
              value={form.block}
              onValueChange={(v) => handleChange("block", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">Block A (Boys)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Room Type</Label>
            <Select
              value={form.roomType}
              onValueChange={(v) => handleChange("roomType", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single Bed">Single Bed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Available Room No.</Label>
            <Select
              value={form.roomId}
              onValueChange={(v) => handleChange("roomId", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.roomId} value={room.roomId}>
                    {room.roomNameNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      <Section icon={FileText} title="Document Uploads">
        <div className="grid grid-cols-2 gap-6">
          <UploadBox
            title="ID Proof (Aadhar / Passport)"
            subtitle="Click to upload or drag & drop PDF, JPG up to 5MB"
          />
          <UploadBox
            title="College Admission Letter"
            subtitle="Click to upload or drag & drop PDF only up to 10MB"
          />
        </div>
      </Section>
      <Section icon={User} title="Student Status">
        <div className="w-64">
          <Label>Status</Label>
          <Select
            value={form.status}
            onValueChange={(v) => handleChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
};

export default EditStudent;
