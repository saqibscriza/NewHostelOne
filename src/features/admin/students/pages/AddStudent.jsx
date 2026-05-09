import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import {
  addStudentApi,
  updateStudentApi,
  getStudentByIdApi,
  getRoomAllData,
} from "../../../../utils/utils";
export default function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);

  // ✅ added
  const [roomOptions, setRoomOptions] = useState([]);

  // ✅ added
  useEffect(() => {
    fetchRooms();

    if (id) {
      fetchStudentById();
    }
  }, [id]);
  const fetchRooms = async () => {
    try {
      const res = await getRoomAllData();

      if (res?.data?.status === "success") {
        // const rooms = res.data.rooms || res.data.data || res.data.content || [];
        const rooms = res?.data?.data?.content || [];

        const formatted = rooms.map((room) => ({
          label: room.roomNameNumber,
          value: room.roomId,
        }));

        setRoomOptions(formatted);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleFile = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  const fetchStudentById = async () => {
    try {
      const res = await getStudentByIdApi(id);

      console.log("STUDENT DATA 👉", res);

      if (res?.data?.status === "success") {
        const student = res?.data?.data || {};

        setForm({
          fullName: student.fullName || "",
          dob: student.dob || "",
          gender: student.gender || "",
          bloodGroup: student.bloodGroup || "",
          course: student.course || "",
          year: student.year || "",
          email: student.email || "",
          phone: student.phone || "",
          dateOfJoining: student.dateOfJoining || "",
          guardianName: student.guardianName || "",
          relation: student.relation || "",
          emergencyContact: student.emergencyContact || "",
          roomId: student.roomId || "",
          address: student.address || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    if (!date) return "";

    const [year, month, day] = date.split("-");

    return `${day}/${month}/${year}`;
  };

  const handleSubmit = async () => {
    setLoading(true);

    const formData = new FormData();

    formData.append("fullName", form.fullName);
    formData.append("dob", formatDateToDDMMYYYY(form.dob));

    formData.append("dateOfJoining", formatDateToDDMMYYYY(form.dateOfJoining));
    formData.append("gender", form.gender);
    formData.append("bloodGroup", form.bloodGroup);
    formData.append("course", form.course);
    formData.append("year", form.year);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("guardianName", form.guardianName);
    formData.append("relation", form.relation);
    formData.append("emergencyContact", form.emergencyContact);
    formData.append("roomId", form.roomId);

    if (files.photo) formData.append("photo", files.photo);
    if (files.idProof) formData.append("idProof", files.idProof);
    if (files.admissionLetter)
      formData.append("admissionLetter", files.admissionLetter);

    console.log("PAYLOAD 👉", Object.fromEntries(formData.entries()));

    try {
      let res;

      if (id) {
        // UPDATE
        const updatedPayload = {
          ...form,
          dob: formatDateToDDMMYYYY(form.dob),
          dateOfJoining: formatDateToDDMMYYYY(form.dateOfJoining),
        };

        res = await updateStudentApi(id, updatedPayload);
      } else {
        // ADD
        res = await addStudentApi(formData);
      }
      if (res?.data?.status === "success") {
        alert("Student Added Successfully");
        navigate(-1);
      } else {
        alert(res?.data?.message || "Failed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {id ? "Edit Student" : "Student Details"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Total 1,248 residents across 4 blocks / Location
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Section title="Personal Information">
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-dashed border-border rounded-xl p-6">
            <input
              type="file"
              onChange={(e) => handleFile("photo", e.target.files[0])}
            />
          </div>

          <div className="col-span-2 space-y-4">
            <Field label="Full Name">
              <Input
                placeholder="Enter Full Name"
                value={form.fullName || ""}
                onChange={(e) => {
                  let value = e.target.value;

                  // allow only letters and spaces
                  value = value.replace(/[^a-zA-Z\s]/g, "");

                  handleChange("fullName", value);
                }}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth">
                <Input
                  type="date"
                  onChange={(e) => handleChange("dob", e.target.value)}
                />
              </Field>

              <Field label="Gender">
                <StyledSelect
                  onValueChange={(v) => handleChange("gender", v)}
                  options={["Male", "Female", "Other"]}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood Group">
                <StyledSelect
                  onValueChange={(v) => handleChange("bloodGroup", v)}
                  options={["A+", "B+", "O+", "AB+"]}
                />
              </Field>

              <Field label="Date of Joining">
                <Input
                  type="date"
                  onChange={(e) =>
                    handleChange("dateOfJoining", e.target.value)
                  }
                />
              </Field>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Academic & Contact Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Course">
            <Input onChange={(e) => handleChange("course", e.target.value)} />
          </Field>

          <Field label="Year">
            <Input
              type="number"
              min="1"
              max="5"
              placeholder="Enter Year (1-5)"
              value={form.year || ""}
              onChange={(e) => {
                let value = e.target.value;

                // only allow numbers
                value = value.replace(/\D/g, "");

                // prevent values above 5
                if (Number(value) > 5) {
                  value = "5";
                }

                handleChange("year", value);
              }}
            />
          </Field>

          <Field label="Email">
            <Input
              type="email"
              placeholder="Enter Email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value.trim())}
            />
          </Field>

          <Field label="Phone">
            <Input
              type="tel"
              maxLength={10}
              placeholder="Enter 10 digit phone number"
              value={form.phone || ""}
              onChange={(e) => {
                let value = e.target.value;

                // allow only numbers
                value = value.replace(/\D/g, "");

                // limit to 10 digits
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }

                handleChange("phone", value);
              }}
            />
          </Field>
        </div>
      </Section>

      <Section title="Guardian Information">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Guardian Name">
            <Input
              placeholder="Enter Guardian Name"
              value={form.guardianName || ""}
              onChange={(e) => {
                let value = e.target.value;

                // allow only letters and spaces
                value = value.replace(/[^a-zA-Z\s]/g, "");

                handleChange("guardianName", value);
              }}
            />
          </Field>

          <Field label="Relationship">
            <Input onChange={(e) => handleChange("relation", e.target.value)} />
          </Field>

          <Field label="Emergency Contact">
            <Input
              type="tel"
              maxLength={10}
              placeholder="Enter 10 digit emergency contact"
              value={form.emergencyContact || ""}
              onChange={(e) => {
                let value = e.target.value;

                // allow only numbers
                value = value.replace(/\D/g, "");

                // limit to 10 digits
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }

                handleChange("emergencyContact", value);
              }}
            />
          </Field>
        </div>
      </Section>

      <Section title="Room Assignment">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Block / Wing">
            <StyledSelect
              placeholder="Select Block"
              onValueChange={(v) => handleChange("block", v)}
              options={["Block A (Boys)", "Block B (Girls)"]}
            />
          </Field>

          <Field label="Category">
            <StyledSelect
              placeholder="Select Category"
              onValueChange={(v) => handleChange("category", v)}
              options={["Deluxe", "Standard", "Premium"]}
            />
          </Field>

          <Field label="Room Type">
            <StyledSelect
              placeholder="Select Type"
              onValueChange={(v) => handleChange("roomType", v)}
              options={["Single Bed", "Double Sharing", "Triple Sharing"]}
            />
          </Field>

          <Field label="Available Room No." className="col-span-1">
            {/* <Select onValueChange={(v) => handleChange("roomId", v)}> */}
            <Select
              value={form.roomId || ""}
              onValueChange={(v) => handleChange("roomId", v)}
            >
              <SelectTrigger className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>

              <SelectContent>
                {roomOptions.map((room) => (
                  <SelectItem key={room.value} value={room.value}>
                    {room.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
      </Section>

      <Section title="Document Uploads">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="file"
            onChange={(e) => handleFile("idProof", e.target.files[0])}
          />
          <input
            type="file"
            onChange={(e) => handleFile("admissionLetter", e.target.files[0])}
          />
        </div>
      </Section>

      <Section title="Room Status">
        <div className="space-y-4 max-w-md">
          <Field label="Initial Availability Status">
            <StyledSelect
              placeholder="Select Status"
              onValueChange={(v) => handleChange("status", v)}
              options={["Available", "Occupied", "Maintenance"]}
            />
          </Field>

          <p className="text-xs text-muted-foreground">
            Sets the status of the room immediately after creation.
          </p>
        </div>
      </Section>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading
            ? id
              ? "Updating..."
              : "Adding..."
            : id
              ? "Update Student"
              : "Add Student"}
        </Button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <Card className="bg-card border border-border rounded-xl">
      <CardContent className="p-6 space-y-4">
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {children}
      </CardContent>
    </Card>
  );
}

function Field({ label, children, className = "" }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function StyledSelect({ placeholder, options = [], onValueChange }) {
  return (
    <Select onValueChange={onValueChange}>
      <SelectTrigger className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm flex items-center justify-between shadow-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="rounded-lg border border-border bg-popover p-2 shadow-md">
        {options.map((opt, i) => (
          <SelectItem key={i} value={opt} className="px-3 py-2 text-sm">
            {opt}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
