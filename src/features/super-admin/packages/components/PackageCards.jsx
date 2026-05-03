import PackageCard from "./PackageCard";

export default function PackageCards({ data, loading }) {
  // Loading state
  if (loading) {
    return <p className="text-muted-foreground">Loading packages...</p>;
  }

  // Empty state
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-muted-foreground">No packages available</p>;
  }

  // Render cards from API
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((pkg) => (
        <PackageCard key={pkg.id} pkg={pkg} />
      ))}
    </div>
  );
}
