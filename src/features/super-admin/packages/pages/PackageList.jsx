// import PackageCards from "../components/PackageCards";
// import PageHeader from "../../../../shared/components/PageHeader";
// import { Button } from "../../../../components/ui/button";
// import { Plus } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import PackageTable from "../components/PackageTable";
// import { useFetch } from "../../../../../src/shared/hooks/useFetch";
// // import { getPackages } from "../services/PackageService";
// import { getPackages } from "../../../../utils/utils";

// export default function PackageList() {
//   const navigate = useNavigate();

//   const { data, loading, error } = useFetch(getPackages);

//   console.log("PACKAGES:", data); // DEBUG

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
//       <PackageTable data={data} loading={loading} error={error} />
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

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await getPackages();
      setData(res);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  console.log("PACKAGES:", data);

  return (
    <div className="p-4 sm:p-6 space-y-8 bg-background">
      <PageHeader
        title="Subscription Package"
        desc="Manage service tiers and pricing."
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
        data={data}
        setData={setData}
        loading={loading}
        error={error}
      />
    </div>
  );
}
