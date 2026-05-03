export default function EmptyState({ message = "No data found" }) {
  return (
    <div className="p-6 text-center text-slate-400 text-sm">
      {message}
    </div>
  );
}