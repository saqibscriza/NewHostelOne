import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Info, Users, CheckSquare, Tag, ToggleRight } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
// import axios from "axios";
import { getPackageById, updatePackageApi } from "../../../../utils/utils";
import { ArrowLeft } from "lucide-react";

export default function EditnewPackage() {
  const { id } = useParams();
  console.log("package id", id);

  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [badge, setBadge] = useState("NONE");
  const [pkg, setPkg] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature],
    );
  };

  // get by id api

  const fetchPackageById = async () => {
    try {
      const data = await getPackageById(id);
      console.log(data, "this is getbyid");

      const pkgData = data;

      setPkg(pkgData);
      setSelectedFeatures(pkgData.features || []);
      setStatus(pkgData.active);
      setBadge(pkgData.badge || "NONE");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPackageById();
  }, [id]);

  // update package function

  const handleUpdatePackage = async () => {
    try {
      const formData = new FormData();

      formData.append("packageName", pkg.packageName);
      formData.append("monthlyPrice", Number(pkg.monthlyPrice));
      formData.append("annualPrice", Number(pkg.annualPrice));
      formData.append("maxBeds", Number(pkg.maxBeds));
      formData.append("maxStaff", Number(pkg.maxStaff));
      formData.append("active", status);
      formData.append("badge", badge);

      selectedFeatures.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });

      const res = await updatePackageApi(id, formData);

      if (res) {
        console.log("Update success:", res);
        navigate("/superadmin/packages");
      } else {
        console.error("Update failed: empty response");
      }

      // navigate("/superadmin/packages");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="p-6 bg-background min-h-screen space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Edit Package</h1>
          <p className="text-sm text-muted-foreground">
            Update package details
          </p>
        </div>
        {/* <Button onClick={() => navigate("/packages")}>Save Changes</Button> */}
        <Button
          onClick={() => navigate("/superadmin/packages")}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Package Details */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Info className="w-4 h-4" /> Package Details
          </h2>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Package Name</label>
            <Input
              value={pkg?.packageName || ""}
              onChange={(e) => setPkg({ ...pkg, packageName: e.target.value })}
            />
          </div>

          {/* Prices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Price (₹)</label>
              <Input
                type="number"
                value={pkg?.monthlyPrice || ""}
                onChange={(e) =>
                  setPkg({ ...pkg, monthlyPrice: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Annual Price (₹)</label>
              <Input
                type="number"
                value={pkg?.annualPrice || ""}
                onChange={(e) =>
                  setPkg({ ...pkg, annualPrice: e.target.value })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Limits */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <Users className="w-4 h-4" /> Limits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Max Beds</label>
              <Input
                type="number"
                value={pkg?.maxBeds || ""}
                onChange={(e) => setPkg({ ...pkg, maxBeds: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Max Staff</label>
              <Input
                type="number"
                value={pkg?.maxStaff || ""}
                onChange={(e) => setPkg({ ...pkg, maxStaff: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h2 className="flex items-center gap-2 text-sm font-semibold">
            <CheckSquare className="w-4 h-4" /> Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["MESS_MANAGEMENT", "INVENTORY_MANAGEMENT"].map((feature) => (
              <label
                key={feature}
                className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={() => handleFeatureChange(feature)}
                />
                <span className="text-sm">{feature}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge + Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold">Badge</h2>

            <div className="flex flex-wrap gap-2">
              {["NONE", "MOST POPULAR", "NEW"].map((b) => (
                <button
                  key={b}
                  onClick={() => setBadge(b)}
                  className={`px-3 py-1 text-xs rounded-full border transition ${
                    badge === b
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold">Status</h2>

            <Button
              variant={status ? "default" : "secondary"}
              onClick={() => setStatus(!status)}
            >
              {status ? "Active" : "Inactive"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex justify-end">
        <Button onClick={handleUpdatePackage}>Update Package</Button>
      </div>
    </div>
  );
}
