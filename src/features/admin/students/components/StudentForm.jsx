
import { Input } from "../../../../components/ui/Input";

export default function StudentForm({ onSubmit, initialData = {} }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6"
    >
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4 text-slate-800">Personal Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Full Name" />
          <Input placeholder="Date of Birth" />
          <Input placeholder="Gender" />
          <Input placeholder="Blood Group" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4 text-slate-800">Academic & Contact Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Student ID" />
          <Input placeholder="Course" />
          <Input placeholder="Year" />
          <Input placeholder="Email" />
          <Input placeholder="Phone" className="col-span-2" />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="font-semibold text-lg mb-4 text-slate-800">Guardian Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <Input placeholder="Guardian Name" />
          <Input placeholder="Relationship" />
          <Input placeholder="Emergency Contact" className="col-span-2" />
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
          Save Student
        </button>
      </div>
    </form>
  );
}