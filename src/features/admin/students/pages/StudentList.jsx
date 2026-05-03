import { Plus, Search } from "lucide-react";
import { Eye, Pencil } from "lucide-react";

export default function StudentList() {
  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Student Details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total 1,248 residents across 4 blocks / Location
          </p>
        </div>

        <button className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium">
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 shadow-sm">
        <span className="text-sm text-muted-foreground">Filter by:</span>

        <select className="h-9 px-3 rounded-md border border-border bg-background text-sm">
          <option>All Location</option>
        </select>

        <select className="h-9 px-3 rounded-md border border-border bg-background text-sm">
          <option>All Status</option>
        </select>

        {/* SEARCH */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="h-9 w-64 pl-3 pr-9 rounded-md border border-border bg-background text-sm outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-2.5 text-muted-foreground" />
        </div>

        {/* CLEAR */}
        <button className="ml-auto text-sm text-muted-foreground hover:text-foreground">
          Clear all filters
        </button>
      </div>

      {/* TABLE */}
      <StudentTable />
    </div>
  );
}

/* ================= TABLE ================= */

function StudentTable() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      {/* HEADER */}
      <div className="grid grid-cols-6 px-6 py-3 text-xs font-medium text-muted-foreground bg-muted">
        <div>STUDENT INFO</div>
        <div>ROOM</div>
        <div>CONTACT</div>
        <div>PAYMENT</div>
        <div>OCCUPANCY</div>
        <div>ACTION</div>
      </div>

      {/* ROWS */}
      <Row
        name="Amit Kumar"
        id="HST-2401"
        room="A-204"
        block="Block A, Floor 2"
        phone="+91 9012345678"
        email="amit_kumar@gmail.com"
        payment="Paid"
        occupancy="Active"
      />

      <Row
        name="Neha Gupta"
        id="HST-2405"
        room="B-102"
        block="Block B, Floor 1"
        phone="+91 8899776655"
        email="neha@gmail.com"
        payment="Pending"
        occupancy="Active"
      />

      <Row
        name="Sandeep Singh"
        id="HST-2389"
        room="A-410"
        block="Block A, Floor 4"
        phone="+91 9988776655"
        email="sandeep@gmail.com"
        payment="Paid"
        occupancy="Checked-out"
      />

      <Row
        name="Anjali Patel"
        id="HST-2412"
        room="C-305"
        block="Block C, Floor 3"
        phone="+91 9345678901"
        email="anjali@gmail.com"
        payment="Paid"
        occupancy="Active"
      />

      {/* PAGINATION */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border text-sm">
        <p className="text-muted-foreground">Showing 1 to 4 of 24 hostels</p>

        <div className="flex items-center gap-2">
          <button className="px-2 text-muted-foreground hover:text-foreground">
            {"<"}
          </button>

          <button className="w-8 h-8 rounded-md bg-foreground text-background">
            1
          </button>

          <button className="w-8 h-8 rounded-md hover:bg-muted">2</button>

          <button className="w-8 h-8 rounded-md hover:bg-muted">3</button>

          <span className="px-1 text-muted-foreground">...</span>

          <button className="w-8 h-8 rounded-md hover:bg-muted">6</button>

          <button className="px-2 text-muted-foreground hover:text-foreground">
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= ROW ================= */

function Row({ name, id, room, block, phone, email, payment, occupancy }) {
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
        <Eye className="w-4 h-4 cursor-pointer hover:text-foreground" />
        <Pencil className="w-4 h-4 cursor-pointer hover:text-foreground" />
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

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
