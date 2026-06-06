import React from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { useForm } from "react-hook-form";
import {createSupportTicketApi} from '../../../../utils/utils';
import { toast } from "react-hot-toast";

export default function AddRequest() {
const navigate = useNavigate();

const createSupportTicket = async (data) => {
  const payload = {
    subject: data.subject,
    // priority: "MEDIUM", // ya dropdown bana sakte ho
    RoomNo: data.room,
    description: data.description,
  };

  try {
    const res = await createSupportTicketApi(payload);

    if (res?.status === "success" || res?.statusCode === 200 || res?.status === 200) {
      toast.success(res?.message || "Ticket raised successfully");
      navigate("/student/support");
    } else {
      let errorMsg = res?.message || res?.data?.message || res?.data?.error || "Failed to create support ticket";
      if (errorMsg.includes("value too long for type character varying(255)")) {
        errorMsg = "Input is too long! Please keep it under 255 characters.";
      }
      toast.error(errorMsg);
    }
  } catch (error) {
    let errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "An error occurred";
    if (errorMsg.includes("value too long for type character varying(255)")) {
        errorMsg = "Input is too long! Please keep it under 255 characters.";
    }
    toast.error(errorMsg);
  }
};

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm();

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">Request Maintenance</h1>
        <p className="text-muted-foreground mt-1 text-sm">Report issues in your room or common areas. Our technical team usually responds within 24 hours.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
        <form onSubmit={handleSubmit(createSupportTicket)} className="space-y-6">
<div className="space-y-2">
  <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
    Room/Location <span className="text-destructive">*</span>
  </Label>

  <Input
    type="text"
    {...register("room", {
      required: "Room is required",
      maxLength: {
        value: 20,
        message: "Room/location must be under 50 characters",
      },
    })}
    placeholder="Enter Room/Location"
    className="w-full h-12 rounded-lg border-border focus-visible:ring-1 focus-visible:ring-ring"
  />

  {errors.room && (
    <p className="text-xs text-red-500 mt-1">
      {errors.room.message}
    </p>
  )}
</div>

<div className="space-y-2">
  <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
    Subject <span className="text-destructive">*</span>
  </Label>

  <Input
    type="text"
    {...register("subject", {
      required: "Subject is required",
      minLength: {
        value: 5,
        message: "Subject must be at least 5 characters",
      },
      maxLength: {
        value: 50,
        message: "Subject must be under 80 characters",
      },
    })}
    placeholder="Enter Subject Details"
    className="w-full h-12 rounded-lg border-border focus-visible:ring-1 focus-visible:ring-ring"
  />

  {errors.subject && (
    <p className="text-xs text-red-500 mt-1">
      {errors.subject.message}
    </p>
  )}
</div>

<div className="space-y-2">
  <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">
    Description <span className="text-destructive">*</span>
  </Label>

  <textarea
    rows={5}
    maxLength={255}
    {...register("description", {
      required: "Description is required",
      minLength: {
        value: 10,
        message: "Description must be at least 10 characters",
      },
      maxLength: {
        value: 255,
        message: "Description must be under 255 characters",
      },
    })}
    placeholder="Describe the issue in detail..."
    className="w-full p-4 rounded-lg border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
  ></textarea>

  {errors.description && (
    <p className="text-xs text-red-500 mt-1">
      {errors.description.message}
    </p>
  )}
</div>

          <Button type="submit" className="w-full bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-12 flex items-center justify-center gap-2 font-medium cursor-pointer">
            Submit Request <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
