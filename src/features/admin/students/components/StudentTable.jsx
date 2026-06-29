import { Eye, Pencil } from "lucide-react";

export default function StudentTable({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <TableHeader />

      {data.map((student) => (
        <TableRow key={student.id} student={student} />
      ))}
    </div>
  );
}

/* ---------------- HEADER ---------------- */

function TableHeader() {
  return (
<div className="grid grid-cols-[2.5fr_1.5fr_2.5fr_1.2fr_1fr_0.5fr] px-6 py-3 text-xs font-medium text-muted-foreground bg-muted">      <div>STUDENT INFO</div>
      <div>ROOM</div>
      <div>CONTACT</div>
      <div>PAYMENT</div>
   <div className="text-center">OCCUPANCY</div>
      <div div className="text-right pr-4" >ACTION</div>
    </div>
  );
}

/* ---------------- ROW ---------------- */

function TableRow({ student }) {
  return (
<div className="grid grid-cols-[2.5fr_1.5fr_2.5fr_1.2fr_1fr_0.5fr] px-6 py-4 border-t border-slate-200 items-center text-sm">      {/* Student Info */}
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

      {/* <span className="w-2 h-2 bg-slate-400 rounded-full"></span> */}
    </div>
  );
}

/* OCCUPANCY (DOT + TEXT EXACT MATCH) */
function OccupancyStatus({ value }) {
  const isActive = value === "Active";

  return (
    <div className="flex items-center justify-center gap-2">
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