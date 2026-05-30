import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Badge } from "../../../../components/ui/Badge";
import { ArrowLeft, Mail, Phone, FileText, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getStudentByIdApi } from "../../../../utils/utils";
const ViewStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [imagePopup, setImagePopup] = useState('');
  const [documentPopup, setDocumentPopup] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  console.log('id proof', documentPopup)
  console.log('phtoo', imagePopup)

  // ================= GET API =================
  useEffect(() => {
    fetchStudent();
  }, []);

  const fetchStudent = async () => {
    const res = await getStudentByIdApi(id);
    console.log('get data by id of student on view', res)
    if (res?.data?.status === "success") {
      const d = res.data.data;
      setImagePopup(res?.data.data?.documentUploads?.photo);
      setDocumentPopup(res?.data.data?.documentUploads?.idProof);
      setStudent({
        name: d.personalInformation?.fullName,
        enrollment: d.personalInformation?.studentId,
        blood: d.personalInformation?.bloodGroup,
        gender: d.personalInformation?.gender,
        photo:
          d.photo ||
          d.profileImage ||
          d.image ||
          d.documentUploads?.photo ||
          d.personalInformation?.photo,

        id: d.personalInformation?.studentId,
        course: d.academicAndContactDetails?.course,
        year: d.academicAndContactDetails?.year,
        email: d.academicAndContactDetails?.email,
        phone: d.academicAndContactDetails?.phone,
        dob: d.personalInformation?.dob,

        guardian: d.guardianInformation?.guardianName,
        relation: d.guardianInformation?.relation,
        emergency: d.guardianInformation?.emergencyContact,

        block: d.roomAssignment?.roomDetails?.block,
        category: d.roomAssignment?.roomDetails?.category,
        roomType: d.roomAssignment?.roomDetails?.roomType,
        room: d.roomAssignment?.roomDetails?.roomNameNumber,

        status: d.status || "Active",
      });
    }
  };

  if (!student) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Student Details</h2>
            <p className="text-sm text-muted-foreground">
              Student information overview
            </p>
          </div>

          <div className="flex gap-3">
            <Badge variant="secondary">{student.status}</Badge>
            {/* <Button >Edit Details</Button> */}
          </div>
        </div>
      </div>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile */}
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-24 h-24 mx-auto overflow-hidden rounded-xl bg-primary flex items-center justify-center text-white text-xl font-bold">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name || "Student"}
                  className="h-full w-full object-cover"
                />
              ) : (
                student.name?.charAt(0)
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold">{student.name}</h3>
              <p className="text-sm text-muted-foreground">
                Enrollment ID: {student.enrollment}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <div className="border px-4 py-2 rounded-lg text-sm">
                <p className="text-xs text-muted-foreground">Blood Group</p>
                <p>{student.blood}</p>
              </div>
              <div className="border px-4 py-2 rounded-lg text-sm">
                <p className="text-xs text-muted-foreground">Gender</p>
                <p>{student.gender}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic */}
        <Card className="md:col-span-2">
          <CardContent className="p-6 grid grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Student ID</p>
              <p className="font-medium">{student.id}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Course</p>
              <p className="font-medium">{student.course}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Year</p>
              <p className="font-medium">{student.year}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="flex items-center gap-2">
                <Mail size={14} /> {student.email}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="flex items-center gap-2">
                <Phone size={14} /> {student.phone}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">DOB</p>
              <p>{student.dob}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guardian */}
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h3 className="font-semibold">Guardian Information</h3>

            <div>
              <p className="text-xs text-muted-foreground">Guardian Name</p>
              <p>{student.guardian}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Relation</p>
              <p>{student.relation}</p>
            </div>

            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground">Emergency</p>
              <p className="font-medium">{student.emergency}</p>
            </div>
          </CardContent>
        </Card>

        {/* Room */}
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h3 className="font-semibold">Room Assignment</h3>

            <div>
              <p className="text-xs text-muted-foreground">Block</p>
              <p>{student.block}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p>{student.category}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Room Type</p>
              <p>{student.roomType}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Room</p>
              <p className="font-semibold text-primary">{student.room}</p>
            </div>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card>
          <CardContent className="p-6 space-y-4 text-sm">
            <h3 className="font-semibold">Document Uploads</h3>

            {/* {["ID Proof", "Admission Letter"].map((doc, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{doc}</span>
                </div>
                <Eye size={16} />
              </div>
            ))} */}
            {[
              {
                name: "ID Proof",
                image: imagePopup,
              },
              {
                name: "Admission Letter",
                image: documentPopup,
              },
            ].map((doc, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded-lg px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span>{doc.name}</span>
                </div>

                <Eye
                  size={16}
                  className="cursor-pointer"
                  onClick={() => setPreviewImage(doc.image)}
                />
              </div>
            ))}
            {previewImage && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="relative bg-white p-2 rounded-xl">
                  <button
                    className="absolute top-2 right-2 text-black"
                    onClick={() => setPreviewImage(null)}
                  >
                    ✕
                  </button>

                  <img
                    src={previewImage}
                    alt="preview"
                    className="max-w-[90vw] max-h-[80vh] rounded-lg"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ViewStudent;
