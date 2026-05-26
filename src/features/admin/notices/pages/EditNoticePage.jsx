import { AlertCircle, BadgeAlert, BellRing } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/Card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAllNoticesApi, updateNoticeApi } from "../../../../utils/utils";

const categoryOptions = [
  { label: "HIGH", icon: AlertCircle },
  { label: "MEDIUM", icon: BadgeAlert },
  { label: "LOW", icon: BellRing },
];

const TITLE_MAX_WORDS = 5;
const TITLE_MAX_CHARS = 30;

const DESCRIPTION_MAX_WORDS = 50;
const DESCRIPTION_MAX_CHARS = 300;

const Label = ({ children }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
    {children}
  </p>
);

export default function EditNoticePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loaderCheck, setLoaderCheck] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "MEDIUM",
    priority: "MEDIUM",
    description: "",
    scheduleLater: false,
    scheduleDate: "",
    scheduleTime: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (key, value) => {
    // TITLE LIMIT
    if (key === "title") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

      if (wordCount > TITLE_MAX_WORDS || value.length > TITLE_MAX_CHARS) {
        return;
      }
    }

    // DESCRIPTION LIMIT
    if (key === "description") {
      const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

      if (
        wordCount > DESCRIPTION_MAX_WORDS ||
        value.length > DESCRIPTION_MAX_CHARS
      ) {
        return;
      }
    }

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const getNoticeDetails = async () => {
    try {
      const response = await getAllNoticesApi();

      if (response?.data?.status === "success") {
        const selectedNotice = response?.data?.data?.find(
          (item) => String(item.noticeId) === String(id),
        );

        if (selectedNotice) {
          setForm({
            title: selectedNotice.title || "",
            category: selectedNotice.category || "MEDIUM",
            priority: selectedNotice.priority || "MEDIUM",
            description: selectedNotice.description || "",
            scheduleLater: false,
            scheduleDate: "",
            scheduleTime: "",
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleUpdateNotice = async () => {
  //   setLoaderCheck(true);

  //   try {
  //     const response = await updateNoticeApi(id, form);

  //     if (response?.status === 200) {
  //       toast.success("Notice updated successfully");

  //       setTimeout(() => {
  //         navigate("/admin/notices");
  //       }, 1500);
  //     } else {
  //       toast.error("Failed to update notice");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Something went wrong");
  //   } finally {
  //     setLoaderCheck(false);
  //   }
  // }

  const handleUpdateNotice = async () => {
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
      const response = await updateNoticeApi(id, form);

      console.log("UPDATE NOTICE =>", response);

      if (response?.status === 200) {
        toast.success("Notice updated successfully");

        setTimeout(() => {
          navigate("/admin/notices");
        }, 1500);
      } else {
        toast.error("Failed to update notice");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoaderCheck(false);
    }
  };
  useEffect(() => {
    getNoticeDetails();
  }, []);

  return (
    <div className="min-h-screen space-y-6 bg-background p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Notice
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Edit important updates for students.
        </p>
      </div>

      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="space-y-8 p-6 sm:p-8">
          <div className="space-y-3">
            <Label>Notice Title</Label>
            <Input
              value={form.title}
              maxLength={TITLE_MAX_CHARS}
              placeholder="Max 5 words or 30 characters"
              className={`h-12 ${errors.title ? "border-destructive" : ""}`}
              onChange={(e) => handleChange("title", e.target.value)}
            />

            <p className="text-xs text-muted-foreground">
              {form.title.trim().split(/\s+/).filter(Boolean).length}
              /5 words • {form.title.length}/30 characters
            </p>
          </div>

          <div className="space-y-3">
            <Label>Category</Label>
            <div className="flex flex-wrap gap-3">
              {categoryOptions.map(({ label, icon: Icon }) => {
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
                    <Icon className="h-5 w-5" />
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
              maxLength={DESCRIPTION_MAX_CHARS}
              placeholder="Max 50 words or 300 characters"
              onChange={(e) => handleChange("description", e.target.value)}
              className="min-h-[180px] w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              {form.description.trim().split(/\s+/).filter(Boolean).length}
              /50 words • {form.description.length}/300 characters
            </p>
          </div>

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
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => navigate("/admin/notices")}
          >
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            disabled={loaderCheck}
            onClick={handleUpdateNotice}
          >
            {loaderCheck ? "Updating..." : "Update and Publish"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
