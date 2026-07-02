import { Plus, Search, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStudentsApi } from "../../../../utils/utils";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../components/ui/pagination";

export default function StudentList() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalElements] = useState(0);

  // ================= API =================

  const fetchStudents = async (params = {}, page = currentPage) => {
    setLoaderCheck(true);

    try {
      const finalParams = {
        page,
        size: pageSize,
        ...params,
      };

      const response = await getAllStudentsApi(finalParams);

      console.log("API RESPONSE 👉", response?.data);

      if (response?.data?.status === "success") {
        const data = response?.data?.data;

        setStudents(data?.content || []);
        setTotalPages(data?.totalPages || 1);
        setTotalElements(data?.totalItems || 0);
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

  useEffect(() => {
    fetchStudents({}, currentPage);
  }, [currentPage, pageSize]);

  const filteredStudents = students.filter((student) => {
    const query = search.toLowerCase();

    return (
      student?.fullName?.toLowerCase()?.includes(query) ||
      String(student?.studentId || student?.id || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.room?.roomNameNumber || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.room?.blockFloor || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.contact?.phone || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.contact?.email || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.paymentStatus || "")
        .toLowerCase()
        .includes(query) ||
      String(student?.occupancyStatus || "")
        .toLowerCase()
        .includes(query)
    );
  });

  const getPaginationItems = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        i === currentPage - 1 ||
        i === currentPage + 1
      ) {
        pages.push(i);
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pages.push("...");
      }
    }
    return pages.filter(
      (item, index) => item !== "..." || pages[index - 1] !== "..."
    );
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Student Details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total {totalItems} residents{" "}
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/students/add")}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>
      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <span className="text-sm text-muted-foreground">Filter by:</span>

        {/* SEARCH */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-9 w-full sm:w-64 pl-3 pr-9 rounded-md border border-border bg-background text-sm outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-muted-foreground" />
        </div>
      </div>
      {/* TABLE */}
      <StudentTable students={filteredStudents} />{" "}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-border bg-card px-6 py-4 rounded-b-xl shadow-sm">
          <span className="text-sm text-muted-foreground hidden sm:block w-1/3">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems} students
          </span>
          
          <div className="flex-1 flex justify-end">
            <Pagination className="w-auto mx-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.max(1, prev - 1));
                    }}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {getPaginationItems().map((item, idx) => (
                  <PaginationItem key={idx} className="hidden sm:inline-block">
                    {item === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        href="#"
                        isActive={currentPage === item}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(item);
                        }}
                        className="cursor-pointer"
                      >
                        {item}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= TABLE ================= */

function StudentTable({ students }) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* DESKTOP / TABLET LAYOUT */}
      <div className="overflow-x-auto w-full">
        <div className="min-w-[950px]">
          <div className="grid grid-cols-8 gap-4 px-6 py-3 text-xs font-medium text-muted-foreground bg-muted border-b border-border">
            <div className="col-span-2">STUDENT INFO</div>
            <div className="col-span-1">ROOM</div>
            <div className="col-span-2">CONTACT</div>
            <div className="col-span-1">PAYMENT</div>
            <div className="col-span-1 pl-2">STATUS</div>
            <div className="col-span-1 flex justify-end pr-2">ACTION</div>
          </div>

          <div className="divide-y divide-border">
            {students.length === 0 ? (
              <DefaultTable
                title="No Students Found"
                description="There are currently no students available. Add a new student to get started."
                buttonText="Add Student"
                onButtonClick={() => navigate("/admin/students/add")}
                height="400px"
              />
            ) : (
              students.map((s, i) => (
                <Row
                  key={s.studentId || s.id || i}
                  id={s.studentId || s.id}
                  name={s.fullName}
                  room={s?.room?.roomNameNumber || "-"}
                  block={s?.room?.blockFloor || "-"}
                  phone={s?.contact?.phone || "-"}
                  email={s?.contact?.email || "-"}
                  payment={s?.paymentStatus || "Pending"}
                  occupancy={s?.occupancyStatus || "Inactive"}
                  photo={s?.photo}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* MOBILE / CARDS LAYOUT */}
    </div>
  );
}

/* ================= DESKTOP ROW ================= */

function Row({
  name,
  id,
  photo,
  room,
  block,
  phone,
  email,
  payment,
  occupancy,
}) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-8 gap-4 px-6 py-4 items-center text-sm hover:bg-muted/30 transition-colors">
      <div className="col-span-2 flex items-center gap-3 min-w-0">
        <Avatar name={name} photo={photo} />
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate" title={name}>
            {name}
          </p>
          <p className="text-xs text-muted-foreground truncate">ID: {id}</p>
        </div>
      </div>

      <div className="col-span-1 min-w-0">
        <p className="font-medium text-foreground truncate">{room}</p>
        <p className="text-xs text-muted-foreground truncate">{block}</p>
      </div>

      <div className="col-span-2 min-w-0">
        <p className="text-foreground truncate">{phone}</p>
        <p className="text-xs text-muted-foreground truncate" title={email}>
          {email}
        </p>
      </div>

      <div className="col-span-1">
        <PaymentBadge value={payment} studentId={id} />
      </div>

      <div className="col-span-1 pl-2">
        <OccupancyStatus value={occupancy} />
      </div>

      <div className="col-span-1 flex justify-end pr-2">
        <div className="flex gap-4 text-muted-foreground">
          <Eye
            className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => navigate(`/admin/students/view/${id}`)}
          />
          <Pencil
            className="w-4 h-4 cursor-pointer hover:text-foreground transition-colors"
            onClick={() => navigate(`/admin/students/edit/${id}`)}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= MOBILE ROW (Was Missing Before) ================= */

function MobileRow({
  id,
  name,
  room,
  block,
  phone,
  email,
  payment,
  occupancy,
}) {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} />
          <div>
            <p className="font-medium text-foreground text-sm">{name}</p>
            <p className="text-xs text-muted-foreground">ID: {id}</p>
          </div>
        </div>

        <div className="flex gap-3 text-muted-foreground">
          <Eye
            className="w-4 h-4 cursor-pointer hover:text-foreground"
            onClick={() => navigate(`/admin/students/view/${id}`)}
          />
          <Pencil
            className="w-4 h-4 cursor-pointer hover:text-foreground"
            onClick={() => navigate(`/admin/students/edit/${id}`)}
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">ROOM</p>
          <p className="text-sm font-medium text-foreground">{room}</p>
          <p className="text-xs text-muted-foreground">{block}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">CONTACT</p>
          <p className="text-sm font-medium text-foreground">{phone}</p>
          <p className="text-xs text-muted-foreground break-words">{email}</p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <PaymentBadge value={payment} studentId={id} />
        <OccupancyStatus value={occupancy} />
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Avatar({ name, photo }) {
  const initials = name
    ?.split(" ")
    ?.map((n) => n[0])
    ?.join("");

  return photo ? (
    <img
      src={photo}
      alt={name}
      className="w-10 h-10 rounded-full object-cover"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-foreground">
      {initials}
    </div>
  );
}

function PaymentBadge({ value, studentId }) {
  const navigate = useNavigate();
  const isPaid = value?.toLowerCase() === "paid";
  return (
    <div className="flex items-center gap-2">
      <div
        onClick={() => {
            navigate(`/admin/fees/collect`);
        }}
        className={`h-6 w-[80px] rounded-full flex items-center justify-center px-3 text-xs font-medium transition-colors ${
          isPaid
            ? "bg-green-100 text-green-700"
            : "bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function OccupancyStatus({ value }) {
  const isActive = value?.toLowerCase() === "active";
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
