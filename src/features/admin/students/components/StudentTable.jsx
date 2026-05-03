import { Eye, Pencil } from "lucide-react";

export default function StudentTable({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <TableHeader />

      {data.map((student) => (
        <TableRow key={student.id} student={student} />
      ))}

      <TablePagination />
    </div>
  );
}

/* ---------------- HEADER ---------------- */

function TableHeader() {
  return (
    <div className="grid grid-cols-6 px-6 py-3 text-xs font-medium text-slate-500 bg-slate-100">
      <div>STUDENT INFO</div>
      <div>ROOM</div>
      <div>CONTACT</div>
      <div>PAYMENT</div>
      <div>OCCUPANCY</div>
      <div>ACTION</div>
    </div>
  );
}

/* ---------------- ROW ---------------- */

function TableRow({ student }) {
  return (
    <div className="grid grid-cols-6 px-6 py-4 border-t border-slate-200 items-center text-sm">
      {/* Student Info */}
      <div className="flex items-center gap-3">
        <Avatar name={student.name} />
        <div>
          <p className="font-medium text-slate-900">{student.name}</p>
          <p className="text-xs text-slate-400">ID: {student.id}</p>
        </div>
      </div>

      {/* Room */}
      <div>
        <p className="font-medium text-slate-900">{student.room}</p>
        <p className="text-xs text-slate-400">{student.block}</p>
      </div>

      {/* Contact */}
      <div>
        <p className="text-slate-900">{student.phone}</p>
        <p className="text-xs text-slate-400">{student.email}</p>
      </div>

      {/* Payment */}
      <PaymentBadge value={student.payment} />

      {/* Occupancy */}
      <OccupancyStatus value={student.occupancy} />

      {/* Actions */}
      <div className="flex gap-4 text-slate-400">
        <Eye className="w-4 h-4 cursor-pointer hover:text-slate-900" />
        <Pencil className="w-4 h-4 cursor-pointer hover:text-slate-900" />
      </div>
    </div>
  );
}

/* ---------------- PAGINATION ---------------- */

function TablePagination() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 text-sm">
      <p className="text-slate-500">
        Showing 1 to 4 of 24 hostels
      </p>

      <div className="flex items-center gap-2">
        <button className="px-2 text-slate-400 hover:text-slate-900">
          {"<"}
        </button>

        <button className="w-8 h-8 rounded-md bg-slate-900 text-white text-sm">
          1
        </button>

        <button className="w-8 h-8 rounded-md hover:bg-slate-100">
          2
        </button>

        <button className="w-8 h-8 rounded-md hover:bg-slate-100">
          3
        </button>

        <span className="px-1 text-slate-400">...</span>

        <button className="w-8 h-8 rounded-md hover:bg-slate-100">
          6
        </button>

        <button className="px-2 text-slate-400 hover:text-slate-900">
          {">"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- REUSABLES ---------------- */

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-medium text-slate-700">
      {initials}
    </div>
  );
}

/* PAYMENT (BAR STYLE + DOT) */
function PaymentBadge({ value }) {
  const isPaid = value === "Paid";

  return (
    <div className="flex items-center gap-2">
      <div
        className={`h-6 w-[130px] rounded-full flex items-center px-3 text-xs font-medium ${
          isPaid
            ? "bg-green-100 text-green-700"
            : "bg-gray-200 text-gray-600"
        }`}
      >
        {value}
      </div>

      <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
    </div>
  );
}

/* OCCUPANCY (DOT + TEXT EXACT MATCH) */
function OccupancyStatus({ value }) {
  const isActive = value === "Active";

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${
          isActive ? "bg-slate-900" : "bg-slate-400"
        }`}
      />
      <span
        className={`text-sm ${
          isActive
            ? "text-slate-900 font-medium"
            : "text-slate-400"
        }`}
      >
        {value}
      </span>
    </div>
  );
}