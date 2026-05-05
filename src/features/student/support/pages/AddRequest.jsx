import React from 'react';
import { Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { useForm } from "react-hook-form";
import {createSupportTicketApi} from '../../../../utils/utils';

export default function AddRequest() {
const navigate = useNavigate();

const createSupportTicket = async (data) => {
  const payload = {
    subject: data.subject,
    // priority: "MEDIUM", // ya dropdown bana sakte ho
    RoomNo: data.room,
    message: data.description,
  };

  const res = await createSupportTicketApi(payload);

  if (res?.status === "success") {
    
    navigate("/student/support");
  } else {
    
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
            <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Room/Location</Label>
            <Input 
              type="text" 
              {...register("room", { required: "Room is required" })}
              placeholder="Enter Room/Location"
              className="w-full h-12 rounded-lg border-border focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Subject</Label>
            <Input 
              type="text" 
              {...register("subject", { required: "Subject is required" })}
              placeholder="Enter Subject Details"
              className="w-full h-12 rounded-lg border-border focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold text-muted-foreground tracking-widest uppercase">Description</Label>
            <textarea 
              rows={5}
              {...register("description", { required: "Description is required" })}
              placeholder="Describe the issue in detail..."
              className="w-full p-4 rounded-lg border border-border bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            ></textarea>
          </div>

          <Button type="submit" className="w-full bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-12 flex items-center justify-center gap-2 font-medium">
            Submit Request <Send className="w-4 h-4 ml-2" />
          </Button>
        </form>
      </div>
    </div>
  );
}
