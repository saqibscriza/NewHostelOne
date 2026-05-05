import React from "react";
import { Search, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../admin/Table";

export default function Support() {
  const navigate = useNavigate();

  const tickets = [
    {
      id: 1,
      subject: "Issue with monthly billing automation",
      description:
        "Monthly billing automation is not working properly, causing...",
      created: "2 hours ago",
    },
    {
      id: 2,
      subject: "Room cleaning",
      description:
        "Room cleaning service is delayed and not meeting hygiene...",
      created: "Yesterday",
    },
    {
      id: 3,
      subject: "Wrong room assignment log",
      description: "Incorrect room assignment recorded in system, causing...",
      created: "2 days ago",
    },
    {
      id: 4,
      subject: "Food Related",
      description:
        "Food quality, taste, or hygiene issues reported; requires...",
      created: "4 hoursago",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Support & Help Center
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage global inquiries and system documentation.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search documentation, guides, and more..."
            className="pl-12 h-12 rounded-xl border-border bg-card text-foreground focus-visible:ring-1 focus-visible:ring-ring text-[15px]"
          />
        </div>
        <Button
          onClick={() => navigate("/student/support/add")}
          className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-12 px-6 shadow-sm w-full sm:w-auto font-medium"
        >
          + Add Request
        </Button>
      </div>

      <div className="bg-card rounded-2xl border border-border mt-6 overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-3">
          <Ticket className="w-6 h-6 text-foreground" />
          <h2 className="text-[19px] font-bold text-foreground tracking-tight">
            Recent Support Tickets
          </h2>
        </div>
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  SUBJECT
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  DESCRIPTION
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  CREATED
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow
                  key={ticket.id}
                  className="border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <TableCell className="px-6 py-5 font-medium text-foreground whitespace-nowrap">
                    {ticket.subject}
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground">
                    {ticket.description}{" "}
                    <span className="text-blue-500 font-medium group-hover:underline ml-1">
                      Read more
                    </span>
                  </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground whitespace-nowrap">
                    {ticket.created}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
