export default function StatCard({ title, value }) {
  return (
    <div className="bg-backgraound border rounded-xl p-4">
      <p className="text-xs text-slate-400 uppercase">{title}</p>
      <p className="text-xl sm:text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}
