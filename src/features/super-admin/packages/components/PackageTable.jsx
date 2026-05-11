import { Badge } from "../../../../components/ui/Badge";
import { Pencil, Trash2 } from "lucide-react";
import EmptyState from "../../../../../src/shared/components/EmptyState";
import { Link } from "react-router-dom";
import { deletePackageApi } from "../../../../utils/utils";

export default function PackageTable({ data, loading, error, setData }) {
  // Delete api

  // const MyPackageDeleteApi = async (id) => {
  //   // setLoader(true);
  //   try {
  //     const response = await deletePackageApi(id);
  //     if (response?.status === 200) {
  //       if (response?.data?.status === "success") {
  //         // toast.success(response?.data?.message);
  //         // setForDelete(false);
  //         // ClassRoomGetAllApi();
  //         // setLoader(false);
  //         // closeCanvas(offcanvasRef33);
  //       }
  //     } else {
  //       // toast.error(response?.data?.message);
  //       // setLoader(false);
  //     }
  //   } catch (error) {
  //     // setloaderState(false);
  //     // setLoader(false);
  //     console.log(error);
  //   }
  // };

  const MyPackageDeleteApi = async (id) => {
    try {
      const response = await deletePackageApi(id);

      if (response?.status === 200 && response?.data?.status === "success") {
        // remove deleted item instantly from UI
        setData((prev) => prev.filter((item) => item.packageId !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-card rounded-xl border border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">Detailed Package List</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="p-4 text-left text-xs text-muted-foreground">
                NAME
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                PRICE
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                MAX BEDS
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                STAFF
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                STATUS
              </th>
              <th className="p-4 text-left text-xs text-muted-foreground">
                ACTIONS
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-4 text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            )}

            {!loading && !error && data?.length === 0 && (
              <tr>
                <td colSpan="6">
                  <EmptyState message="No packages found" />
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data?.map((pkg) => (
                <tr key={pkg.packageId} className="border-t border-border">
                  <td className="p-4 text-foreground">{pkg.packageName}</td>
                  <td className="p-4 text-foreground">₹{pkg.monthlyPrice}</td>
                  <td className="p-4 text-foreground">{pkg.maxBeds}</td>
                  <td className="p-4 text-foreground">{pkg.maxStaff}</td>

                  <td className="p-4">
                    <Badge variant={pkg.active ? "default" : "secondary"}>
                      {pkg.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>

                  <td className="p-4 flex gap-2">
                    <Link to={`/packages/edit/${pkg.packageId}`}>
                      <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                    </Link>

                    <Trash2
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          "Are you sure you want to delete this package?",
                        );

                        if (confirmDelete) {
                          MyPackageDeleteApi(pkg.packageId);
                        }
                      }}
                      className="w-4 h-4 text-destructive cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
