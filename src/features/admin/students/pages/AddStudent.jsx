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
import { ArrowLeft, Camera, FileText, Loader2, Upload, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import {
  addStudentApi,
  updateStudentApi,
  getStudentByIdApi,
  getRoomAllData,
} from "../../../../utils/utils";

const textOnlyFields = {
  fullName: "Only alphabets are allowed",
  course: "Only alphabets are allowed",
  guardianName: "Only alphabets are allowed",
  relation: "Only alphabets are allowed",
};

const numberOnlyFields = {
  year: "Only numbers are allowed",
  phone: "Only numbers are allowed",
  emergencyContact: "Only numbers are allowed",
};

const isTextOnly = (value) => /^[A-Za-z\s.]+$/.test(value);
const isNumberOnly = (value) => /^\d+$/.test(value);
const normalizeRoom = (room) => ({
  roomId: room?.roomId || room?.id || room?.room?.roomId || room?.room?.id || "",
  blockFloor: room?.blockFloor || room?.room?.blockFloor || "",
  categoryName:
    room?.categoryName ||
    room?.category?.categoryName ||
    room?.room?.categoryName ||
    "",
  occupancyName:
    room?.occupancyName ||
    room?.occupancy?.occupancyName ||
    room?.roomType ||
    room?.room?.occupancyName ||
    "",
  roomNameNumber: room?.roomNameNumber || room?.room?.roomNameNumber || "",
});

const getRoomListFromResponse = (response) => {
  const data = response?.data?.data || response?.data || {};
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.rooms)) return data.rooms;
  if (Array.isArray(data)) return data;
  return [];
};

export default function AddStudent() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ✅ added
  const [roomData, setRoomData] = useState([]);

  // ✅ added
  useEffect(() => {
    const initialize = async () => {
      await fetchRooms();
    };

    initialize();
  }, []);

  useEffect(() => {
    if (id && roomData.length > 0) {
      fetchStudentById();
    }
  }, [id, roomData]);

  const fetchRooms = async () => {
    try {
      const firstResponse = await getRoomAllData({ page: 1, size: 100 });
      const firstData = firstResponse?.data?.data || {};
      const totalPages = Number(firstData?.totalPages || 1);
      const rooms = [...getRoomListFromResponse(firstResponse)];

      if (totalPages > 1) {
        const rest = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            getRoomAllData({ page: index + 2, size: 100 }),
          ),
        );

        rest.forEach((response) => {
          rooms.push(...getRoomListFromResponse(response));
        });
      }

      const normalizedRooms = rooms
        .map(normalizeRoom)
        .filter((room) => room.roomId);

      setRoomData(normalizedRooms);
    } catch (err) {
      console.log(err);
      setRoomData([]);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(filePreviews).forEach((preview) => {
        if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
      });
    };
  }, [filePreviews]);

  const handleChange = (key, value) => {
    let message = "";

    if (value && textOnlyFields[key] && !isTextOnly(value)) {
      message = textOnlyFields[key];
    }

    if (value && numberOnlyFields[key] && !isNumberOnly(value)) {
      message = numberOnlyFields[key];
    }

    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const handleFile = (key, file) => {
    if (!file) return;

    const allowedTypesByKey = {
      photo: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
      idProof: ["application/pdf", "image/jpeg", "image/jpg", "image/png"],
      admissionLetter: ["application/pdf"],
    };

    const allowedTypes = allowedTypesByKey[key] || [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        [key]:
          key === "photo"
            ? "Only JPG, PNG and WEBP images are allowed"
            : key === "admissionLetter"
              ? "Only PDF files are allowed"
              : "Only PDF, JPG and PNG files are allowed",
      }));
      return;
    }

    const maxSize =
      key === "admissionLetter"
        ? 10 * 1024 * 1024
        : key === "photo"
          ? 2 * 1024 * 1024
          : 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        [key]: `File size exceeded ${key === "admissionLetter" ? "10MB" : key === "photo" ? "2MB" : "5MB"
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

    setFilePreviews((prev) => {
      if (prev[key]?.startsWith("blob:")) URL.revokeObjectURL(prev[key]);

      return {
        ...prev,
        [key]: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
      };
    });
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

        const selectedRoom = roomData.find(
          (room) => String(room.roomId) === String(student.roomId),
        );
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

          // IMPORTANT
          block: selectedRoom?.blockFloor || "",
          category: selectedRoom?.categoryName || "",
          roomType: selectedRoom?.occupancyName || "",
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
    // if (!form.relation?.trim()) {
    //   nextErrors.relation = "Relationship is required";
    // }
    if (!form.relation?.trim()) {
      nextErrors.relation = "Relationship is required";
    } else if (form.relation.trim().length < 3) {
      nextErrors.relation = "Minimum 3 characters required";
    } else if (!/^[A-Za-z\s.'-]+$/.test(form.relation)) {
      nextErrors.relation = "Invalid relationship";
    }
    if (!form.dateOfJoining) {
      nextErrors.dateOfJoining = "Date of joining is required";
    }

    if (!form.dob) nextErrors.dob = "Date of birth is required";
    if (!form.gender) nextErrors.gender = "Please select gender";
    if (!form.course?.trim()) nextErrors.course = "Course is required";
    if (!form.year) nextErrors.year = "Year is required";

    Object.entries(textOnlyFields).forEach(([key, message]) => {
      if (form[key]?.trim() && !isTextOnly(form[key].trim())) {
        nextErrors[key] = message;
      }
    });

    Object.entries(numberOnlyFields).forEach(([key, message]) => {
      if (form[key] && !isNumberOnly(form[key])) {
        nextErrors[key] = message;
      }
    });

    if (!form.email?.trim()) {
      nextErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!/^[6-9]\d{9}$/.test(form.phone || "")) {
      nextErrors.phone = "Phone number must start with 6, 7, 8 or 9";
    }
    // if (!form.guardianName?.trim()) {
    //   nextErrors.guardianName = "Guardian name is required";
    // }
    if (!form.guardianName?.trim()) {
      nextErrors.guardianName = "Guardian name is required";
    } else if (form.guardianName.trim().length < 3) {
      nextErrors.guardianName = "Minimum 3 characters required";
    } else if (!/^[A-Za-z\s.'-]+$/.test(form.guardianName)) {
      nextErrors.guardianName = "Invalid guardian name";
    }
    if (!/^[6-9]\d{9}$/.test(form.emergencyContact || "")) {
      nextErrors.emergencyContact =
        "Contact number must start with 6, 7, 8 or 9";
    }
    if (!form.block?.trim()) {
      nextErrors.block = "Block / Wing is required";
    }

    if (!form.category?.trim()) {
      nextErrors.category = "Category is required";
    }

    if (!form.roomType?.trim()) {
      nextErrors.roomType = "Room type is required";
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
    formData.append("status", form.status);

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
        console.log('add student console messageeeee====', res);
      }
      const isSuccess =
        res?.data?.status === "success" &&
        !res?.data?.message?.toLowerCase().includes("error");

      if (isSuccess) {
        toast.success(
          res?.data?.message
          // id ? res?.data?.message : "Student Added Successfully"
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
            {id ? "Edit Student" : "Add Student"}
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
            <p className="text-sm font-medium mb-3">Profile Photo</p>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              className="hidden"
              id="studentPhoto"
              onChange={(e) => handleFile("photo", e.target.files[0])}
            />
            <label
              htmlFor="studentPhoto"
              className="min-h-48 cursor-pointer rounded-lg bg-muted/30 flex flex-col items-center justify-center text-center overflow-hidden"
            >
              {filePreviews.photo ? (
                <img
                  src={filePreviews.photo}
                  alt="Selected student profile"
                  className="h-48 w-full rounded-lg object-cover"
                />
              ) : (
                <div className="px-4">
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-background border">
                    <Camera className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">Click to upload photo</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPG, PNG or WEBP up to 2MB
                  </p>
                </div>
              )}
            </label>
            {files.photo && (
              <p className="mt-2 flex items-center gap-1 text-xs text-green-600">
                <Upload className="h-3 w-3" />
                {files.photo.name}
              </p>
            )}
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
  <div className="relative">
    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />

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
      className={`h-11 w-full pl-10 text-slate-500 
        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:absolute
        [&::-webkit-calendar-picker-indicator]:left-0
        [&::-webkit-calendar-picker-indicator]:w-full
        [&::-webkit-calendar-picker-indicator]:h-full
        [&::-webkit-calendar-picker-indicator]:cursor-pointer
        ${errors.dob ? "border-destructive" : ""}
      `}
    />
  </div>

  {errors.dob && (
    <p className="text-xs text-destructive mt-1">
      {errors.dob}
    </p>
  )}
</Field>

              <Field label="Gender" required>
                {""}
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
  <div className="relative">
    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none z-10" />

    <Input
      type="date"
      value={form.dateOfJoining || ""}
      onChange={(e) =>
        handleChange("dateOfJoining", e.target.value)
      }
      className={`h-11 w-full pl-10 text-slate-500
        [&::-webkit-calendar-picker-indicator]:opacity-0
        [&::-webkit-calendar-picker-indicator]:absolute
        [&::-webkit-calendar-picker-indicator]:left-0
        [&::-webkit-calendar-picker-indicator]:w-full
        [&::-webkit-calendar-picker-indicator]:h-full
        [&::-webkit-calendar-picker-indicator]:cursor-pointer
        ${errors.dateOfJoining ? "border-destructive" : ""}
      `}
    />
  </div>

  {errors.dateOfJoining && (
    <p className="text-xs text-destructive mt-1">
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
              placeholder="Enter Course"
              onChange={(e) => handleChange("course", e.target.value)}
              className={errors.course ? "border-destructive" : ""}
            />{" "}
            {errors.course && (
              <p className="text-xs text-destructive">{errors.course}</p>
            )}
          </Field>

          {/* <Field label="Year" required>
            {" "}
            <Input
              type="text"
              inputMode="numeric"
              maxLength={1}
              placeholder="Enter Year (1-5)"
              value={form.year || ""}
              onChange={(e) => {
                let value = e.target.value;

                if (value && !isNumberOnly(value)) {
                  handleChange("year", value);
                  return;
                }

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
          </Field> */}
          <Field label="Year" required>
            <select
              value={form.year || ""}
              onChange={(e) => {
                let value = e.target.value;

                if (value && !isNumberOnly(value)) {
                  handleChange("year", value);
                  return;
                }

                if (Number(value) > 5) {
                  value = "5";
                }

                handleChange("year", value);
              }}
              className={`w-full rounded-md border px-3 py-2 ${errors.year ? "border-destructive" : ""
                }`}
            >
              <option value="">Select Year</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>

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
              inputMode="numeric"
              placeholder="Enter 10 digit phone number"
              value={form.phone || ""}
              onChange={(e) => {
                let value = e.target.value;

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
              onChange={(e) => handleChange("guardianName", e.target.value)}
              className={errors.guardianName ? "border-destructive" : ""}
            />
            {errors.guardianName && (
              <p className="text-xs text-destructive">{errors.guardianName}</p>
            )}
          </Field>

          <Field label="Relationship" required>
            <Input
              placeholder="Enter Relationship"
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
              inputMode="numeric"
              placeholder="Enter 10 digit emergency contact"
              value={form.emergencyContact || ""}
              onChange={(e) => {
                let value = e.target.value;

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
          <Field label="Block / Wing" required>
            <StyledSelect
              value={form.block}
              placeholder="Select Block"
              onValueChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  block: v,
                  category: "",
                  roomType: "",
                  roomId: "",
                }));
              }}
              options={[
                ...new Set(
                  roomData.map((room) => room.blockFloor).filter(Boolean),
                ),
              ]}
            />

            {errors.block && (
              <p className="text-xs text-destructive">{errors.block}</p>
            )}
          </Field>

          <Field label="Category" required>
            <StyledSelect
              value={form.category}
              placeholder="Select Category"
              onValueChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  category: v,
                  roomType: "",
                  roomId: "",
                }));
              }}
              options={[
                ...new Set(
                  roomData
                    .filter((room) => room.blockFloor === form.block)
                    .map((room) => room.categoryName)
                    .filter(Boolean),
                ),
              ]}
            />

            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </Field>

          <Field label="Room Type" required>
            <StyledSelect
              value={form.roomType}
              placeholder="Select Room Type"
              onValueChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  roomType: v,
                  roomId: "",
                }));
              }}
              options={[
                ...new Set(
                  roomData
                    .filter(
                      (room) =>
                        room.blockFloor === form.block &&
                        room.categoryName === form.category,
                    )
                    .map((room) => room.occupancyName)
                    .filter(Boolean),
                ),
              ]}
            />

            {errors.roomType && (
              <p className="text-xs text-destructive">{errors.roomType}</p>
            )}
          </Field>

          <Field label="Available Room No." required>
            <Select
              value={form.roomId || ""}
              onValueChange={(v) => handleChange("roomId", String(v))}
            >
              <SelectTrigger className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm shadow-sm">
                <SelectValue placeholder="Select Room" />
              </SelectTrigger>

              <SelectContent className="rounded-lg border border-border bg-popover p-2 shadow-md">
                {roomData
                  .filter(
                    (room) =>
                      room.blockFloor === form.block &&
                      room.categoryName === form.category &&
                      room.occupancyName === form.roomType,
                  )
                  .map((room) => (
                    <SelectItem
                      key={String(room.roomId)}
                      value={String(room.roomId)}
                      className="px-3 py-2 text-sm"
                    >
                      {room.roomNameNumber}
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
            <label className="text-sm text-muted-foreground">ID Proof</label>

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
                        src={filePreviews.idProof}
                        alt="preview"
                        className="w-32 h-32 object-cover rounded-lg mx-auto"
                      />
                    ) : (
                      <div>
                        <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {files.idProof.name}
                        </p>
                      </div>
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

          {/* Admission Letter */}
          <div>
            <label className="text-sm text-muted-foreground">
              College Admission Letter
            </label>

            <div className="mt-2 border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/30 transition">
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                id="admissionLetter"
                onChange={(e) =>
                  handleFile("admissionLetter", e.target.files[0])
                }
              />

              <label htmlFor="admissionLetter" className="cursor-pointer">
                {files.admissionLetter ? (
                  <div className="space-y-3">
                    <div>
                      <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        {files.admissionLetter.name}
                      </p>
                    </div>

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
        {errors.admissionLetter && (
          <p className="text-xs text-destructive mt-2">
            {errors.admissionLetter}
          </p>
        )}
      </Section>

      <Section title="Student Status">
        <div className="space-y-4 max-w-md">
          {/* <Field label="Initial Availability Status">
            <StyledSelect
              placeholder="Select Status"
              onValueChange={(v) => handleChange("status", v)}
              options={["true", "false"]}
            />
          </Field> */}
          <Select
            value={
              form.status === true
                ? "Active"
                : form.status === false
                  ? "Inactive"
                  : ""
            }
            onValueChange={(v) => handleChange("status", v === "Active")}
          >
            <SelectTrigger className="h-11 w-full rounded-lg border border-border bg-background px-4 text-sm">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

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
