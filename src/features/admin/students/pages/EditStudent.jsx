import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";

import {
  updateStudentApi,
  getStudentByIdApi,
  getRoomAllData,
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

const UploadBox = ({ title, subtitle, file, onChange, accept }) => (
  <div className="space-y-2">
    <Label>{title}</Label>

    <label className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted transition block">
      <input
        type="file"
        className="hidden"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0])}
      />

      <FileText className="mx-auto mb-2" size={20} />

      <p>{file?.name || subtitle}</p>
    </label>
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
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [idProof, setIdProof] = useState(null);

  const [admissionLetter, setAdmissionLetter] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    const res = await getRoomAllData();

    if (res?.data?.data?.content) {
      setRooms(res.data.data.content);
    }
  }, []);

  const getPhoto = (data) =>
    data?.photo ||
    data?.profileImage ||
    data?.image ||
    data?.documentUploads?.photo ||
    data?.personalInformation?.photo ||
    "";

  // ================= GET BY ID =================
  const fetchStudent = useCallback(async () => {
    const res = await getStudentByIdApi(id);

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

        roomId:
          d.roomAssignment?.roomId ||
          d.roomAssignment?.roomDetails?.roomId ||
          "",
        status: d.status || "Active",
        block: d.roomAssignment?.roomDetails?.block || "",
        category: d.roomAssignment?.roomDetails?.category || "",
        roomType: d.roomAssignment?.roomDetails?.roomType || "",
      };

      setForm(formatted);
      setPhotoPreview(getPhoto(d));
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
    fetchRooms();
  }, [fetchStudent, fetchRooms]);

  // ================= HANDLE =================
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoChange = (file) => {
    if (!file) return;

    setSelectedPhoto(file);
    setPhotoPreview((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }
      return URL.createObjectURL(file);
    });
  };

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const withCurrentOption = (options, currentValue) => {
    const cleanOptions = options.filter(Boolean).map(String);
    const cleanCurrent = currentValue ? String(currentValue) : "";
    return cleanCurrent && !cleanOptions.includes(cleanCurrent)
      ? [cleanCurrent, ...cleanOptions]
      : cleanOptions;
  };

  const getRoomValue = (room) => String(room.roomId || room.id || "");
  const roomOptions = useMemo(() => {
    const mappedRooms = rooms
      .map((room) => ({
        value: getRoomValue(room),
        label:
          room.roomNameNumber ||
          room.roomNumber ||
          room.name ||
          getRoomValue(room),
      }))
      .filter((room) => room.value);

    if (
      form.roomId &&
      !mappedRooms.some((room) => room.value === form.roomId)
    ) {
      return [{ value: form.roomId, label: form.roomId }, ...mappedRooms];
    }

    return mappedRooms;
  }, [rooms, form.roomId]);

  const blockOptions = useMemo(
    () =>
      withCurrentOption(
        rooms.map((room) => room.block || room.blockFloor),
        form.block,
      ),
    [rooms, form.block],
  );

  const categoryOptions = useMemo(
    () =>
      withCurrentOption(
        rooms.map((room) => room.category || room.roomCategory),
        form.category,
      ),
    [rooms, form.category],
  );

  const roomTypeOptions = useMemo(
    () =>
      withCurrentOption(
        rooms.map((room) => room.roomType || room.type),
        form.roomType,
      ),
    [rooms, form.roomType],
  );

  // ================= PUT =================

  const handleUpdate = async () => {
    if (!form.roomId) {
      alert("Room is required");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // ================= FORMAT DATE =================

      const formatDate = (date) => {
        if (!date) return "";

        // already DD/MM/YYYY
        if (date.includes("/")) {
          return date;
        }

        const [year, month, day] = date.split("-");

        return `${day}/${month}/${year}`;
      };

      // ================= APPEND DATA =================

      formData.append("fullName", form.fullName || "");

      formData.append("dob", formatDate(form.dob));

      formData.append("gender", form.gender || "");

      formData.append("bloodGroup", form.bloodGroup || "");

      formData.append("dateOfJoining", formatDate(form.dateOfJoining));

      formData.append("course", form.course || "");

      formData.append("year", form.year || "");

      formData.append("email", form.email || "");

      formData.append("phone", form.phone || "");

      formData.append("guardianName", form.guardianName || "");

      formData.append("relation", form.relation || "");

      formData.append("emergencyContact", form.emergencyContact || "");

      formData.append("roomId", form.roomId || "");
      formData.append("status", form.status || "");

      if (selectedPhoto) {
        formData.append("photo", selectedPhoto);
      }

      if (idProof) {
        formData.append("idProof", idProof);
      }

      if (admissionLetter) {
        formData.append("admissionLetter", admissionLetter);
      }

      // ================= DEBUG =================

      console.log("UPDATE PAYLOAD 👉", Object.fromEntries(formData.entries()));

      // ================= API =================

      const response = await updateStudentApi(id, formData);

      console.log("UPDATE RESPONSE 👉", response);

      if (response?.data?.status === "success") {
        alert(response?.data?.message || "Student Updated Successfully");

        setTimeout(() => {
          navigate("/admin/students");
        }, 1000);
      } else {
        alert(response?.data?.message || "Failed to update student");
      }
    } catch (error) {
      console.log("UPDATE ERROR 👉", error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
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
            <input
              id="edit-student-photo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handlePhotoChange(e.target.files?.[0])}
            />
            <label
              htmlFor="edit-student-photo"
              className="flex w-full cursor-pointer flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-3 overflow-hidden">
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Student profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Camera />
                )}
              </div>
              <p className="text-sm font-medium">
                {selectedPhoto ? selectedPhoto.name : "Upload Photo"}
              </p>
            </label>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or WEBP. Max size 2MB
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
                value={form.gender || ""}
                onValueChange={(v) => handleChange("gender", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {withCurrentOption(
                    ["Male", "Female", "Other"],
                    form.gender,
                  ).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Blood Group</Label>
              <Select
                value={form.bloodGroup || ""}
                onValueChange={(v) => handleChange("bloodGroup", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {withCurrentOption(
                    ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-", "Other"],
                    form.bloodGroup,
                  ).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
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
              value={form.year || ""}
              onValueChange={(v) => handleChange("year", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {withCurrentOption(["1", "2", "3", "4", "5"], form.year).map(
                  (option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ),
                )}
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
              value={form.relation || ""}
              onValueChange={(v) => handleChange("relation", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                {withCurrentOption(
                  ["Father", "Mother", "Guardian", "Other"],
                  form.relation,
                ).map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
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
              value={form.block || ""}
              onValueChange={(v) => handleChange("block", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select block" />
              </SelectTrigger>
              <SelectContent>
                {blockOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={form.category || ""}
              onValueChange={(v) => handleChange("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Room Type</Label>
            <Select
              value={form.roomType || ""}
              onValueChange={(v) => handleChange("roomType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room type" />
              </SelectTrigger>
              <SelectContent>
                {roomTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Available Room No.</Label>
            <Select
              value={form.roomId || ""}
              onValueChange={(v) => handleChange("roomId", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {roomOptions.map((room) => (
                  <SelectItem key={room.value} value={room.value}>
                    {room.label}
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
            subtitle="Upload ID Proof"
            file={idProof}
            onChange={setIdProof}
            accept=".pdf,.jpg,.jpeg,.png"
          />

          <UploadBox
            title="College Admission Letter"
            subtitle="Upload Admission Letter"
            file={admissionLetter}
            onChange={setAdmissionLetter}
            accept=".pdf,.doc,.docx"
          />
        </div>
      </Section>
      <Section icon={User} title="Student Status">
        <div className="w-64">
          <Label>Status</Label>
                <Select
  value={
    form.status === true
      ? "Active"
      : form.status === false
        ? "Inactive"
        : ""
  }
  onValueChange={(v) =>
    handleChange("status", v === "Active")
  }
>
  <SelectTrigger className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm">
    <SelectValue placeholder="Select Status" />
  </SelectTrigger>

  <SelectContent>
    <SelectItem value="Active">Active</SelectItem>
    <SelectItem value="Inactive">Inactive</SelectItem>
  </SelectContent>
</Select>
          {/* <Select
            value={form.status || ""}
            onValueChange={(v) => handleChange("status", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {withCurrentOption(["Active", "Inactive"], form.status).map(
                (option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select> */}
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
