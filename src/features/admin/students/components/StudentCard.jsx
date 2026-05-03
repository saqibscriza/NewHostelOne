export default function StudentCard({ student }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 w-[300px] shadow-sm">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center text-xl font-bold text-slate-700">
          {student.name.slice(0, 2).toUpperCase()}
        </div>
        <h2 className="mt-4 font-semibold text-lg text-slate-800">
          {student.name}
        </h2>
        <p className="text-sm text-slate-400">Enrollment ID: {student.id}</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="border border-slate-200 rounded-lg p-2 text-center text-slate-600">
          Blood Group <br />
          <span className="font-semibold text-slate-800">O+</span>
        </div>
        <div className="border border-slate-200 rounded-lg p-2 text-center text-slate-600">
          Gender <br />
          <span className="font-semibold text-slate-800">Male</span>
        </div>
      </div>
    </div>
  );
}
