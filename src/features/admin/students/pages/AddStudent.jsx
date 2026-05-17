import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import toast from "react-hot-toast";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
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
  const [errors, setErrors] = useState({});

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
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleFile = (key, file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]: "Only PDF, JPG and PNG files are allowed",
      }));
      return;
    }

    const maxSize =
      key === "admissionLetter" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: `File size exceeded ${
          key === "admissionLetter" ? "10MB" : "5MB"
        }`,
      }));
      return;
    }

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));

    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));
  };
  const formatDateForInput = (date) => {
    if (!date || !date.includes("/")) return date;

    const [day, month, year] = date.split("/");

    return `${year}-${month}-${day}`;
  };

  const fetchStudentById = async () => {
    try {
      const res = await getStudentByIdApi(id);

      console.log("STUDENT DATA 👉", res);

      if (res?.data?.status === "success") {
        const student = res?.data?.data || {};

        setForm({
          fullName: student.fullName || "",
          dob: formatDateForInput(student.dob) || "",
          gender: student.gender || "",
          bloodGroup: student.bloodGroup || "",
          course: student.course || "",
          year: student.year || "",
          email: student.email || "",
          phone: student.phone || "",
          dateOfJoining: formatDateForInput(student.dateOfJoining) || "",
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
    const nextErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (form.dob && new Date(form.dob) >= new Date(today)) {
      nextErrors.dob = "DOB must be a previous date";
    }
    if (!form.fullName?.trim()) nextErrors.fullName = "Full name is required";
    if (!form.relation?.trim()) {
      nextErrors.relation = "Relationship is required";
    }
    if (!form.dateOfJoining) {
      nextErrors.dateOfJoining = "Date of joining is required";
    }

    if (!files.idProof && !id) {
      nextErrors.idProof = "ID Proof is required";
    }

    if (!files.admissionLetter && !id) {
      nextErrors.admissionLetter = "Admission Letter is required";
    }
    if (!form.dob) nextErrors.dob = "Date of birth is required";
    if (!form.gender) nextErrors.gender = "Please select gender";
    if (!form.course?.trim()) nextErrors.course = "Course is required";
    if (!form.year) nextErrors.year = "Year is required";
    if (!form.email?.trim()) nextErrors.email = "Email is required";
    if (!files.photo && !id) {
      nextErrors.photo = "Photo is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!/^\d{10}$/.test(form.phone || "")) {
      nextErrors.phone = "Enter a valid 10 digit phone number";
    }
    if (!form.guardianName?.trim()) {
      nextErrors.guardianName = "Guardian name is required";
    }
    if (!/^\d{10}$/.test(form.emergencyContact || "")) {
      nextErrors.emergencyContact = "Enter a valid 10 digit contact number";
    }
    if (!form.roomId) nextErrors.roomId = "Please select room";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (loading) return;

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
    // formData.append("address", form.address || "");
    if (files.photo) formData.append("photo", files.photo);
    if (files.idProof) formData.append("idProof", files.idProof);
    if (files.admissionLetter)
      formData.append("admissionLetter", files.admissionLetter);

    console.log("PAYLOAD 👉", Object.fromEntries(formData.entries()));

    try {
      let res;

      if (id) {
        // UPDATE
        const updatedPayload = new FormData();

        updatedPayload.append("fullName", form.fullName);
        updatedPayload.append("dob", formatDateToDDMMYYYY(form.dob));
        updatedPayload.append(
          "dateOfJoining",
          formatDateToDDMMYYYY(form.dateOfJoining),
        );

        updatedPayload.append("gender", form.gender);
        updatedPayload.append("bloodGroup", form.bloodGroup);
        updatedPayload.append("course", form.course);
        updatedPayload.append("year", form.year);
        updatedPayload.append("email", form.email);
        updatedPayload.append("phone", form.phone);
        updatedPayload.append("guardianName", form.guardianName);
        updatedPayload.append("relation", form.relation);
        updatedPayload.append("emergencyContact", form.emergencyContact);
        updatedPayload.append("roomId", form.roomId);
        // updatedPayload.append("address", form.address || "");

        if (files.photo) updatedPayload.append("photo", files.photo);

        if (files.idProof) updatedPayload.append("idProof", files.idProof);

        if (files.admissionLetter)
          updatedPayload.append("admissionLetter", files.admissionLetter);
        res = await updateStudentApi(id, updatedPayload);
      } else {
        // ADD
        res = await addStudentApi(formData);
      }
      const isSuccess =
        res?.data?.status === "success" &&
        !res?.data?.message?.toLowerCase().includes("error");

      if (isSuccess) {
        toast.success(
          id ? "Student Updated Successfully" : "Student Added Successfully",
        );
        navigate("/admin/students");
      } else {
        toast.error(res?.data?.message || "Failed to add student");
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

        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          {" "}
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      <Section title="Personal Information">
        <div className="grid grid-cols-3 gap-6">
          <div className="border border-dashed border-border rounded-xl p-6">
            <p className="text-sm mb-3">
              Photo
              <span className="text-red-500 ml-1">*</span>
            </p>{" "}
            <input
              type="file"
              onChange={(e) => handleFile("photo", e.target.files[0])}
            />
            {errors.photo && (
              <p className="text-xs text-destructive mt-2">{errors.photo}</p>
            )}
          </div>

          <div className="col-span-2 space-y-4">
            <Field label="Full Name" required>
              {" "}
              <Input
                placeholder="Enter Full Name"
                value={form.fullName || ""}
                onChange={(e) => {
                  let value = e.target.value;

                  // allow only letters and spaces
                  if (/[^a-zA-Z\s]/.test(value)) {
                    setErrors((prev) => ({
                      ...prev,
                      fullName: "Only alphabets are allowed",
                    }));
                  } else {
                    setErrors((prev) => ({
                      ...prev,
                      fullName: "",
                    }));
                  }
                  handleChange("fullName", value);
                }}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName}</p>
              )}
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Date of Birth" required>
                {" "}
                <Input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  value={form.dob || ""}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const today = new Date().toISOString().split("T")[0];

                    if (new Date(selectedDate) >= new Date(today)) {
                      setErrors((prev) => ({
                        ...prev,
                        dob: "DOB must be a previous date",
                      }));

                      setForm((prev) => ({
                        ...prev,
                        dob: "",
                      }));

                      return;
                    }

                    setErrors((prev) => ({
                      ...prev,
                      dob: "",
                    }));

                    handleChange("dob", selectedDate);
                  }}
                  className={errors.dob ? "border-destructive" : ""}
                />
                {errors.dob && (
                  <p className="text-xs text-destructive">{errors.dob}</p>
                )}
              </Field>

              <Field label="Gender" required>
                {" "}
                <StyledSelect
                  value={form.gender}
                  onValueChange={(v) => handleChange("gender", v)}
                  options={["Male", "Female", "Other"]}
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Blood Group" required>
                {" "}
                <StyledSelect
                  value={form.bloodGroup}
                  onValueChange={(v) => handleChange("bloodGroup", v)}
                  options={[
                    "A+",
                    "A-",
                    "B+",
                    "B-",
                    "O+",
                    "O-",
                    "AB+",
                    "AB-",
                    "Other",
                  ]}
                />
              </Field>

              <Field label="Date of Joining" required>
                <Input
                  type="date"
                  value={form.dateOfJoining || ""}
                  onChange={(e) =>
                    handleChange("dateOfJoining", e.target.value)
                  }
                  className={errors.dateOfJoining ? "border-destructive" : ""}
                />

                {errors.dateOfJoining && (
                  <p className="text-xs text-destructive">
                    {errors.dateOfJoining}
                  </p>
                )}
              </Field>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Academic & Contact Details">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Course" required>
            {" "}
            <Input
              value={form.course || ""}
              onChange={(e) => handleChange("course", e.target.value)}
            />{" "}
            {errors.course && (
              <p className="text-xs text-destructive">{errors.course}</p>
            )}
          </Field>

          <Field label="Year" required>
            {" "}
            <Input
              type="number"
              min="1"
              max="5"
              placeholder="Enter Year (1-5)"
              value={form.year || ""}
              onChange={(e) => {
                let value = e.target.value;

                // only allow numbers
                if (/\D/.test(value)) {
                  setErrors((prev) => ({
                    ...prev,
                    year: "Only numbers are allowed",
                  }));
                }

                value = value.replace(/\D/g, "");
                // prevent values above 5
                if (Number(value) > 5) {
                  value = "5";
                }

                handleChange("year", value);
              }}
              className={errors.year ? "border-destructive" : ""}
            />
            {errors.year && (
              <p className="text-xs text-destructive">{errors.year}</p>
            )}
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              placeholder="Enter Email"
              value={form.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
            />

            {errors.email && (
              <p className="text-xs text-destructive">{errors.email}</p>
            )}
          </Field>

          <Field label="Phone" required>
            {" "}
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
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone}</p>
            )}
          </Field>
        </div>
      </Section>

      <Section title="Guardian Information">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Guardian Name" required>
            {" "}
            <Input
              placeholder="Enter Guardian Name"
              value={form.guardianName || ""}
              onChange={(e) => {
                let value = e.target.value;

                // allow only letters and spaces
                value = value.replace(/[^a-zA-Z\s]/g, "");

                handleChange("guardianName", value);
              }}
              className={errors.guardianName ? "border-destructive" : ""}
            />
            {errors.guardianName && (
              <p className="text-xs text-destructive">{errors.guardianName}</p>
            )}
          </Field>

          <Field label="Relationship" required>
            <Input
              value={form.relation || ""}
              onChange={(e) => handleChange("relation", e.target.value)}
              className={errors.relation ? "border-destructive" : ""}
            />

            {errors.relation && (
              <p className="text-xs text-destructive">{errors.relation}</p>
            )}
          </Field>

          <Field label="Emergency Contact" required>
            {" "}
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
              className={errors.emergencyContact ? "border-destructive" : ""}
            />
            {errors.emergencyContact && (
              <p className="text-xs text-destructive">
                {errors.emergencyContact}
              </p>
            )}
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

          <Field label="Available Room No." className="col-span-1" required>
            {" "}
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
            {errors.roomId && (
              <p className="text-xs text-destructive">{errors.roomId}</p>
            )}
          </Field>
        </div>
      </Section>
      <Section title="Document Uploads">
        <div className="grid grid-cols-2 gap-6">
          {/* ID Proof */}
          <div>
            <label className="text-sm text-muted-foreground">
              ID Proof
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="idProof"
                onChange={(e) => handleFile("idProof", e.target.files[0])}
              />

              <label htmlFor="idProof" className="cursor-pointer">
                {files.idProof ? (
                  <div className="space-y-3">
                    {files.idProof.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(files.idProof)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {files.idProof.name}
                      </p>
                    )}

                    <p className="text-xs text-green-600">
                      File selected successfully
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Click to upload or drag & drop
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG up to 5MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {errors.idProof && (
            <p className="text-xs text-destructive mt-2">{errors.idProof}</p>
          )}

          {/* Admission Letter */}
          <div>
            <label className="text-sm text-muted-foreground">
              College Admission Letter
              <span className="text-red-500 ml-1">*</span>
            </label>

            <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                id="admissionLetter"
                onChange={(e) =>
                  handleFile("admissionLetter", e.target.files[0])
                }
              />

              <label htmlFor="admissionLetter" className="cursor-pointer">
                {files.admissionLetter ? (
                  <div className="space-y-3">
                    {files.admissionLetter.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(files.admissionLetter)}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <p className="text-sm font-medium">
                        {files.admissionLetter.name}
                      </p>
                    )}

                    <p className="text-xs text-green-600">
                      File selected successfully
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm font-medium">
                      Click to upload or drag & drop
                    </p>

                    <p className="text-xs text-muted-foreground mt-1">
                      PDF only up to 10MB
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>
        </div>
        {errors.idProof && (
          <p className="text-xs text-destructive mt-2">{errors.idProof}</p>
        )}
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
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          {" "}
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="min-w-[170px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />

              {id ? "Updating..." : "Adding Student..."}
            </div>
          ) : id ? (
            "Update Student"
          ) : (
            "Add Student"
          )}
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

function Field({ label, children, className = "", required = false }) {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="text-xs font-medium text-muted-foreground">
        {label}

        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {children}
    </div>
  );
}

function StyledSelect({ placeholder, options = [], onValueChange, value }) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      {" "}
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
