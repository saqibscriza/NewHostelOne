// import PackageCards from "../components/PackageCards";
// import PageHeader from "../../../../shared/components/PageHeader";
// import { Button } from "../../../../components/ui/button";
// import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import PackageTable from "../components/PackageTable";
// import { getPackages } from "../../../../utils/utils";

// import { useEffect, useState } from "react";

// export default function PackageList() {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalElements, setTotalElements] = useState(0);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//  const fetchPackages = async (
//   page = currentPage
// ) => {
//   try {
//     setLoading(true);

//     const params = {
//       page,
//       size: pageSize,
//     };

//     const res = await getPackages(params);

//     console.log("PACKAGES API 👉", res);

//     if (res?.data?.status === "success") {
//       const responseData = res?.data?.data;

//       setData(responseData?.content || []);

//       setTotalPages(
//         responseData?.totalPages || 1
//       );

//       setTotalElements(
//         responseData?.totalElements || 0
//       );
//     } else {
//       setData([]);
//     }
//   } catch (err) {
//     console.error("Fetch error:", err);

//     setError(err);
//   } finally {
//     setLoading(false);
//   }
// };

//  useEffect(() => {
//   fetchPackages(currentPage);
// }, [currentPage, pageSize]);

//   console.log("PACKAGES:", data);

//   return (
//     <div className="p-4 sm:p-6 space-y-8 bg-background">
//       <PageHeader
//         title="Subscription Package"
//         desc="Manage service tiers and pricing."
//         action={
//           <Button
//             onClick={() => navigate("/superadmin/packages/add")}
//             className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
//           >
//             <Plus className="w-4 h-4" />
//             Add Package
//           </Button>
//         }
//       />

//       <PackageCards data={data} loading={loading} />

//       <PackageTable
//         data={data}
//         setData={setData}
//         loading={loading}
//         error={error}
//       />

//     </div>
//   );
// }

import PackageCards from "../components/PackageCards";
import PageHeader from "../../../../shared/components/PageHeader";
import { Button } from "../../../../components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PackageTable from "../components/PackageTable";
import { getPackages } from "../../../../utils/utils";

import { useEffect, useState } from "react";

export default function PackageList() {
  const navigate = useNavigate();

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // DATA STATES
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FETCH PACKAGES
  const fetchPackages = async () => {
    try {
      setLoading(true);

      const res = await getPackages();

      console.log("PACKAGES API 👉", res);

      // DIRECT ARRAY
      if (Array.isArray(res)) {
        setData(res);

        setTotalElements(res.length);

        setTotalPages(Math.ceil(res.length / pageSize));
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);

      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // INITIAL FETCH
  useEffect(() => {
    fetchPackages();
  }, []);

  // FRONTEND PAGINATION
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;

    const endIndex = startIndex + pageSize;

    const slicedData = data.slice(startIndex, endIndex);

    setPaginatedData(slicedData);
  }, [data, currentPage, pageSize]);

  console.log("PACKAGES:", data);

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-background">
      <PageHeader
        title="Subscription Package"
        desc={`Total ${totalElements} packages available.`}
        action={
          <Button
            onClick={() => navigate("/superadmin/packages/add")}
            className="gap-2 bg-primary text-primary-foreground hover:opacity-90"
          >
            <Plus className="w-4 h-4" />
            Add Package
          </Button>
        }
      />

      <PackageCards data={data} loading={loading} />

      <PackageTable
        data={paginatedData}
        setData={setData}
        loading={loading}
        error={error}
      />

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="text-sm text-muted-foreground">
          Showing page {currentPage} of {totalPages}
        </span>

        <div className="flex gap-2 items-center flex-wrap">
          {/* PREV */}
          <button
            className="px-3 py-1 rounded border border-border disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {/* PAGE BUTTONS */}
          {Array.from(
            {
              length: Math.max(totalPages, 5),
            },
            (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-primary text-white"
                    : "bg-muted"
                }`}
              >
                {index + 1}
              </button>
            ),
          )}

          {/* NEXT */}
          <button
            className="px-3 py-1 rounded border border-border disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
