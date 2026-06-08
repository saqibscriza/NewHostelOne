import { Plus, Search, Eye, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStudentsApi } from "../../../../utils/utils";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import {
  Pagination,
  PaginationContent,
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
  // const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex items-start justify-between">
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
      <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <span className="text-sm text-muted-foreground">Filter by:</span>

        {/* SEARCH */}
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-9 w-64 pl-3 pr-9 rounded-md border border-border bg-background text-sm outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-muted-foreground" />
        </div>

        {/* <button
          onClick={() => {
            setSearch("");
            setCurrentPage(1);
            setCurrentPage(1);
          }}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all filters
        </button> */}
      </div>
      {/* TABLE */}
      <StudentTable students={filteredStudents} />{" "}

      {totalItems > 0 && (
        <div className="flex justify-between items-center px-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Showing page {currentPage} of {totalPages}
          </span>

          <Pagination className="!justify-end">

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

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

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
      )}

    </div>
  );
}

/* ================= TABLE ================= */

function StudentTable({ students }) {
  const navigate = useNavigate();
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="grid grid-cols-7 gap-x-4 px-6 py-3 text-xs font-medium text-muted-foreground bg-muted">
        <div className="col-span-2">STUDENT INFO</div>
        <div>ROOM</div>
        <div>CONTACT</div>
        <div>PAYMENT</div>
        <div className="pl-6">STATUS</div>
        <div className="col-span-1 flex justify-end pr-2">ACTION</div>
      </div>

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
            key={i}
            id={s.studentId || s.id}
            name={s.fullName}
            room={s?.room?.roomNameNumber || "-"}
            block={s?.room?.blockFloor || "-"}
            phone={s?.contact?.phone || "-"}
            email={s?.contact?.email || "-"}
            payment={s?.paymentStatus || "Pending"}
            occupancy={s?.occupancyStatus || "Inactive"}
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
    <div className="grid grid-cols-7 gap-x-4 px-6 py-4 border-t border-border items-center text-sm">
      <div className="col-span-2 flex items-center gap-3">
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
      <div className="pl-6">
  <OccupancyStatus value={occupancy} />
</div>

      <div className="col-span-1 flex justify-end pr-2">
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
  const isPaid = value?.toLowerCase() === "paid";
  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-[80px] rounded-full flex items-center px-3 text-xs font-medium ${
          isPaid
            ? "bg-green-100 text-green-700"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {value}
      </div>
      {/* <span className="w-2 h-2 bg-muted-foreground rounded-full"></span> */}
    </div>
  );
}

function OccupancyStatus({ value }) {
const isActive =
  value?.toLowerCase() === "active";
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
