import { Plus, Search, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStudentsApi } from "../../../../utils/utils";

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loaderCheck, setLoaderCheck] = useState(false);

  // ================= API =================
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async (params = {}) => {
    setLoaderCheck(true);

    try {
      const response = await getAllStudentsApi(params);

      console.log("API RESPONSE 👉", response?.data);

      if (response?.data?.status === "success") {
        setStudents(response?.data?.data?.content || []);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.log(err);
      setStudents([]);
    } finally {
      setLoaderCheck(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Student Details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total {students.length} residents
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/students/add")}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <span className="text-sm text-muted-foreground">Filter by:</span>

        {/* SEARCH */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && fetchStudents({ searchKey: search })
            }
            placeholder="Search"
            className="h-9 w-64 pl-3 pr-9 rounded-md border border-border bg-background text-sm outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-muted-foreground" />
        </div>

        <button
          onClick={() => {
            setSearch("");
            fetchStudents();
          }}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all filters
        </button>
      </div>

      {/* TABLE */}
      <StudentTable students={students} />
    </div>
  );
}

/* ================= TABLE ================= */

function StudentTable({ students }) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-6 px-6 py-3 text-xs font-medium text-muted-foreground bg-muted">
        <div>STUDENT INFO</div>
        <div>ROOM</div>
        <div>CONTACT</div>
        <div>PAYMENT</div>
        <div>OCCUPANCY</div>
        <div>ACTION</div>
      </div>

      {students.length === 0 ? (
        <div className="p-6 text-center text-muted-foreground text-sm">
          No students found
        </div>
      ) : (
        students.map((s, i) => (
          <Row
            key={i}
            id={s.studentId || s.id}
            name={s.fullName}
            room={s.roomNameNumber || s.roomId || "-"}
            block={s.blockFloor || "-"}
            phone={s.phone || "-"}
            email={s.email || "-"}
            payment={s.paymentStatus || "Pending"}
            occupancy={s.occupancyStatus || "Inactive"}
          />
        ))
      )}
    </div>
  );
}

/* ================= ROW ================= */

function Row({ name, id, room, block, phone, email, payment, occupancy }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-6 px-6 py-4 border-t border-border items-center text-sm">
      <div className="flex items-center gap-3">
        <Avatar name={name} />
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">ID: {id}</p>
        </div>
      </div>

      <div>
        <p className="font-medium text-foreground">{room}</p>
        <p className="text-xs text-muted-foreground">{block}</p>
      </div>

      <div>
        <p className="text-foreground">{phone}</p>
        <p className="text-xs text-muted-foreground">{email}</p>
      </div>

      <PaymentBadge value={payment} />
      <OccupancyStatus value={occupancy} />

      <div className="flex gap-4 text-muted-foreground">
        <Eye
          className="w-4 h-4 cursor-pointer hover:text-foreground"
          onClick={() => navigate(`/admin/students/view/${id}`)}
        />{" "}
        <Pencil
          className="w-4 h-4 cursor-pointer hover:text-foreground"
          onClick={() => navigate(`/admin/students/edit/${id}`)}
        />
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Avatar({ name }) {
  const initials = name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("");

  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
      {initials}
    </div>
  );
}

function PaymentBadge({ value }) {
  const isPaid = value === "Paid";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-[130px] rounded-full flex items-center px-3 text-xs font-medium ${
          isPaid
            ? "bg-green-100 text-green-700"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {value}
      </div>
      <span className="w-2 h-2 bg-muted-foreground rounded-full"></span>
    </div>
  );
}

function OccupancyStatus({ value }) {
  const isActive = value === "Active";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-foreground" : "bg-muted-foreground"
        }`}
      />
      <span
        className={`text-sm ${
          isActive ? "text-foreground font-medium" : "text-muted-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
