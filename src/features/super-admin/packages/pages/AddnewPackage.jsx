import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Info, Users, CheckSquare, Tag, ToggleRight } from "lucide-react";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { AddPackage } from "../../../../utils/utils";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AddNewPackage() {
  const navigate = useNavigate();

  const [status, setStatus] = useState(true);
  const [badge, setBadge] = useState("NONE");
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // feature toggle
  const handleFeatureChange = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((item) => item !== feature)
        : [...prev, feature],
    );
  };

  // ------------------- Post Api -------------------

  // Package post Api

  const MyAddPackage = async (data) => {
    console.log("FORM SUBMITTED");
    setLoading(true);
    const formData = new FormData();
    formData.append("packageName", data.packageName);
    formData.append("monthlyPrice", data.monthlyPrice);
    formData.append("annualPrice", data.annualPrice);
    formData.append("maxBeds", data.maxBeds);
    formData.append("maxStaff", data.maxStaff);
    selectedFeatures.forEach((feature) => {
      formData.append("features", feature);
    });
    try {
      const response = await AddPackage(formData);

      console.log("my post response is here...", response);

      if (response?.data?.status === "success") {
        toast.success(response?.data?.message || "Package created successfully");
        navigate("/superadmin/packages");
        // setLoaderCheck(false);
        // setTimeout(() => {
        //   navigate("/vendormanagement");
        // }, 2000);
      } else {
        toast.error(response?.data?.message);
        // setShow(true)
        // setLoaderCheck(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(MyAddPackage)}
      className="p-6 space-y-6 bg-background min-h-screen"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Add New Package
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure a new plan tier for your partner hostels.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => navigate("/superadmin/packages")}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Package Details */}
      <Card className="bg-card border border-border">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Info className="w-4 h-4" /> Package Details
          </h2>

          {/* Package Name */}

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Package Name
            </label>
            <Input
              placeholder="e.g. Enterprise Elite"
              {...register("packageName", {
                required: "Package name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
              className={errors.packageName ? "border-destructive" : ""}
            />
            {errors.packageName && (
              <p className="text-xs text-destructive">
                {errors.packageName.message}
              </p>
            )}
          </div>

          {/* Prices */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">
                Monthly Price (₹)
              </label>
            <Input
              inputMode="numeric"
              {...register("monthlyPrice", {
                required: "Monthly price required",
                pattern: {
                  value: /^\d+$/,
                  message: "Only numbers are allowed",
                },
                min: {
                  value: 0,
                  message: "Monthly price cannot be negative",
                },
              })}
              className={errors.monthlyPrice ? "border-destructive" : ""}
            />
              {errors.monthlyPrice && (
                <p className="text-xs text-destructive">
                  {errors.monthlyPrice.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground">
                Annual Price (₹)
              </label>
            <Input
                inputMode="numeric"
                {...register("annualPrice", {
                  required: "Annual price required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                  min: {
                    value: 0,
                    message: "Annual price cannot be negative",
                  },
                })}
                className={errors.annualPrice ? "border-destructive" : ""}
              />
              {errors.annualPrice && (
                <p className="text-xs text-destructive">
                  {errors.annualPrice.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Limits */}
      <Card className="bg-card border border-border">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" /> User Limits
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Max Beds</label>
              <Input
                inputMode="numeric"
                {...register("maxBeds", {
                  required: "Max beds required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                  min: {
                    value: 1,
                    message: "Max beds must be at least 1",
                  },
                })}
                className={errors.maxBeds ? "border-destructive" : ""}
              />
              {errors.maxBeds && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.maxBeds.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Max Staff</label>
              <Input
                inputMode="numeric"
                {...register("maxStaff", {
                  required: "Max staff required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Only numbers are allowed",
                  },
                  min: {
                    value: 1,
                    message: "Max staff must be at least 1",
                  },
                })}
                className={errors.maxStaff ? "border-destructive" : ""}
              />
              {errors.maxStaff && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.maxStaff.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-card border border-border">
        <CardContent className="pt-6 space-y-4">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4" /> Feature Checklist
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "MESS", label: "MESS" },
              { key: "CANTEEN", label: "CANTEEN" },
            ].map((feature) => (
              <label key={feature.key} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFeatures.includes(feature.key)}
                  onCheckedChange={() => handleFeatureChange(feature.key)}
                />
                <span className="text-sm">{feature.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Badge + Status */}
      <div className="grid grid-cols-2 gap-6">
        {/* Badge */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Tag className="w-4 h-4" /> Badge
            </h2>

            <div className="flex gap-2">
              {["NONE", "MOST POPULAR", "NEW"].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBadge(b)}
                  className={`px-3 py-1 text-xs border rounded-full ${
                    badge === b
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status */}
        <Card>
          <CardContent className="pt-6 space-y-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <ToggleRight className="w-4 h-4" /> Status
            </h2>

            <button
              type="button"
              onClick={() => setStatus(!status)}
              className={`w-12 h-6 rounded-full ${
                status ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`block w-5 h-5 bg-white rounded-full transition ${
                  status ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        {/* <Button variant="outline" onClick={() => navigate("/packages")}>
          Cancel
        </Button> */}

        <Button
          disabled={loading}
          type="submit"
          className="flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Confirm & Create Package
        </Button>
      </div>
    </form>
  );
}
