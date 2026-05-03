import React from "react";
import { Check, MessageSquare, Paperclip, Send, Mail, Phone, Calendar } from "lucide-react";

export default function TicketViewPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">AC not working in Room No. 302</h1>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              High Priority
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              In Progress
            </span>
          </div>
        </div>
        <button className="flex items-center gap-2 h-11 px-6 rounded-lg bg-[#0a0a0a] hover:bg-[#171717] text-white font-semibold transition-colors dark:bg-white dark:hover:bg-slate-200 dark:text-black">
          <Check className="w-4 h-4" />
          Mark Resolved
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column: Conversation */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          {/* Box Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <MessageSquare className="w-5 h-5" />
              Conversation Details
            </div>
            <span className="text-sm text-muted-foreground">3 Messages</span>
          </div>

          {/* Chat Messages */}
          <div className="p-5 space-y-6 flex-1 max-h-[500px] overflow-y-auto">
            {/* Student Message */}
            <div className="flex gap-4">
              <img src="https://i.pravatar.cc/150?img=11" alt="Student" className="w-10 h-10 rounded-full bg-muted object-cover border border-border" />
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="font-semibold text-foreground">Sandeep Sharma</span>
                    <span className="ml-2 text-sm text-muted-foreground">(Student)</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Oct 24, 09:15 AM</span>
                </div>
                <div className="bg-muted text-foreground p-4 rounded-2xl rounded-tl-sm text-sm border border-border">
                  Hi, the AC in my room (402) has been making a grinding noise since last night and finally stopped blowing cold air this morning. It's quite hot here, could someone take a look?
                </div>
              </div>
            </div>

            {/* Support Message */}
            <div className="flex gap-4 flex-row-reverse">
              <div className="w-10 h-10 rounded-full bg-[#0a0a0a] dark:bg-white flex items-center justify-center text-white dark:text-black shrink-0 border border-border">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-baseline justify-between mb-2 flex-row-reverse">
                  <div>
                    <span className="font-semibold text-foreground">Rajesh Kumar</span>
                    <span className="mr-2 text-sm text-muted-foreground">(Support Staff)</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Oct 24, 10:30 AM</span>
                </div>
                <div className="bg-[#0a0a0a] text-white dark:bg-slate-800 dark:text-slate-100 p-4 rounded-2xl rounded-tr-sm text-sm">
                  Hello Sandeep, thanks for reporting this. I've assigned this to our maintenance team. They should be at your room within the next 2 hours to inspect the unit.
                </div>
              </div>
            </div>
          </div>

          {/* Input Box */}
          <div className="p-5 border-t border-border">
            <div className="relative flex items-center bg-muted p-2 rounded-xl border border-input">
              <input
                type="text"
                placeholder="Type your response to Sandeep..."
                className="flex-1 bg-transparent border-none focus:ring-0 px-3 py-2 text-sm placeholder:text-muted-foreground w-full focus:outline-none"
              />
              <div className="flex items-center gap-2 pr-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="bg-[#0a0a0a] hover:bg-[#171717] dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white p-2.5 rounded-lg transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6 space-y-6">
          <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Resident Details
          </h3>
          
          <div className="flex items-center gap-4">
            <img src="https://i.pravatar.cc/150?img=11" alt="Resident" className="w-14 h-14 rounded-full object-cover bg-muted border border-border" />
            <div>
              <div className="font-semibold text-lg text-foreground">Sandeep Sharma</div>
              <div className="text-sm font-medium text-muted-foreground">Room 402</div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail className="w-4 h-4 shrink-0" />
              <span className="truncate text-foreground font-medium">sandeep.sharma@gmail.com</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone className="w-4 h-4 shrink-0" />
              <span className="text-foreground font-medium">+91 9832564789</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 shrink-0" />
              <span className="text-foreground font-medium">Joined: Aug 15, 2023</span>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2.5 border border-input rounded-lg font-semibold text-sm hover:bg-muted/50 transition-colors text-foreground">
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
