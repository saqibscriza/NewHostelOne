export default function PageHeader({ title, desc, action }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      {action}
    </div>
  );
}
