import React, { useState } from "react";
import { AlertCircle, BadgeAlert, BellRing } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { toast } from "react-hot-toast";
import { createNoticeApi } from "../../../../utils/utils";

const categoryOptions = [
  {
    label: "HIGH",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  {
    label: "MEDIUM",
    icon: <BadgeAlert className="h-5 w-5" />,
  },
  {
    label: "LOW",
    icon: <BellRing className="h-5 w-5" />,
  },
];

const Label = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
    {children}
  </p>
);
export default function CreateNoticePage() {
  const navigate = useNavigate();
  const [loaderCheck, setLoaderCheck] = useState(false);
  const [form, setForm] = useState({
    title: "",
category: "MEDIUM",    priority: "MEDIUM",
    description: "",
    scheduleLater: false,
    scheduleDate: "",
    scheduleTime: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };


const CreateNoticeApi = async () => {

  const nextErrors = {};

  if (!form.title.trim()) {
    nextErrors.title = "Notice title is required";
  }

  if (!form.description.trim()) {
    nextErrors.description = "Notice description is required";
  }

  setErrors(nextErrors);

  if (Object.keys(nextErrors).length > 0) return;

  setLoaderCheck(true);

  try {
    const response = await createNoticeApi(form);

    console.log("CREATE NOTICE =>", response);

    if (response?.status === 200) {

      toast.success("Notice Created Successfully");

      setTimeout(() => {
        navigate("/admin/notices");
      }, 500);

    } else {
      toast.error("Failed to create notice");
    }

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  } finally {
    setLoaderCheck(false);
  }
};
  // const CreateNoticeApi = async () => {
  //   const nextErrors = {};
  //   if (!form.title.trim()) nextErrors.title = "Notice title is required";
  //   if (!form.description.trim()) {
  //     nextErrors.description = "Notice description is required";
  //   }

  //   setErrors(nextErrors);
  //   if (Object.keys(nextErrors).length > 0) return;

  //   setLoaderCheck(true);

  //   try {
  //     const response = await createNoticeApi(form);

  //     console.log("CREATE NOTICE =>", response);

  //     if (response?.status === 200) {
  //       toast.success("Notice Created Successfully");

  //       setLoaderCheck(false);

  //       setTimeout(() => {
  //         navigate("/admin/notices");
  //       }, 500);
  //     } else {
  //       toast.error("Failed to create notice");
  //       setLoaderCheck(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //     setLoaderCheck(false);
  //   }
  // };

  return (
    <div className="min-h-screen space-y-6 bg-background p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Notice
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Broadcast important updates to students.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <div className="space-y-3">
            <Label>Notice Title</Label>
            <Input
              value={form.title}
              placeholder="e.g. Annual Maintenance Scheduled"
              className={`h-12 ${errors.title ? "border-destructive" : ""}`}
              onChange={(e) => handleChange("title", e.target.value)}
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map(({ label, icon }) => {
                const active = form.category === label;

                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleChange("category", label)}
                    className={`flex h-24 w-28 flex-col items-center justify-center rounded-xl border transition ${
                      active
                        ? "border-foreground bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground hover:bg-muted/40"
                    }`}
                  >
                    {icon}
                    <span className="mt-2 text-sm font-medium">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <Label>Notice Description</Label>
            <textarea
              value={form.description}
              placeholder="Write the details of the notice here..."
              onChange={(e) => handleChange("description", e.target.value)}
              className={`min-h-[180px] w-full rounded-xl border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring ${
                errors.description ? "border-destructive" : "border-input"
              }`}
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description}</p>
            )}
          </div>

          {/*  Schedule card  */}

          {/* <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleChange("scheduleLater", !form.scheduleLater)
                  }
                  className={`relative h-7 w-14 rounded-full transition ${
                    form.scheduleLater ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-background shadow-sm transition ${
                      form.scheduleLater ? "left-8" : "left-1"
                    }`}
                  />
                </button>
                <div>
                  <p className="text-base font-semibold text-foreground">
                    Schedule for Later
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pick a future date and time for publication
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Input
                  type="date"
                  value={form.scheduleDate}
                  onChange={(e) => handleChange("scheduleDate", e.target.value)}
                  className="h-12 w-40"
                  disabled={!form.scheduleLater}
                />
                <Input
                  type="time"
                  value={form.scheduleTime}
                  onChange={(e) => handleChange("scheduleTime", e.target.value)}
                  className="h-12 w-32"
                  disabled={!form.scheduleLater}
                />
              </div>
            </div>
          </div> */}
        </CardContent>

        <div className="flex justify-end gap-4 border-t border-border bg-card px-6 py-5 sm:px-8">
          <Button variant="outline" onClick={() => navigate("/admin/notices")}>
            Cancel
          </Button>
          <Button disabled={loaderCheck} onClick={CreateNoticeApi}>
            {loaderCheck ? "Publishing..." : "Publish Notice"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
