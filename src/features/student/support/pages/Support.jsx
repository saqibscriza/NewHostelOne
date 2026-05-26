import React from "react";
import {useState,useEffect} from "react";
import { Search, Ticket, AlertCircle } from "lucide-react";
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
} from "../../../../components/ui/Table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import {getAllSupportTicketsApi} from "../../../../utils/utils"

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [expandedTickets, setExpandedTickets] = useState({});

  const toggleExpand = (e, ticketId) => {
    e.stopPropagation();
    setExpandedTickets((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }));
  };

    // GET ALL TICKETS
  const fetchAllTickets = async () => {
    try {
      setLoading(true);

      const res = await getAllSupportTicketsApi();

      console.log("Support Tickets =>", res);

      // adjust according to your API response
      const data = res?.SupportTickets || [];

      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.log("FETCH TICKETS ERROR =>", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTickets();
  }, []);


    // SEARCH FILTER
  useEffect(() => {
    if (!search) {
      setFilteredTickets(tickets);
    } else {
      const filtered = tickets.filter((ticket) =>
        ticket?.subject
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );

      setFilteredTickets(filtered);
    }
  }, [search, tickets]);

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="pl-12 h-12 rounded-xl border-border bg-card text-foreground focus-visible:ring-1 focus-visible:ring-ring text-[15px]"
          />
        </div>
        <Button
          onClick={() => navigate("/student/support/add")}
          className="bg-[#0f1419] dark:bg-white dark:text-black hover:bg-[#272c30] dark:hover:bg-gray-100 text-white rounded-xl h-12 px-6 shadow-sm w-full sm:w-auto font-medium cursor-pointer"
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
                {/* <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  Status
                </TableHead> */}
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  CREATED
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket._id || ticket.id}
                  className="border-border hover:bg-muted/50 cursor-pointer transition-colors group"
                >
                  <TableCell className="px-6 py-5 font-medium text-foreground whitespace-nowrap">
                    {ticket.subject}
                  </TableCell>
{/* <TableCell className="px-6 py-5 text-muted-foreground align-top">
  <span className="inline-block max-w-[300px] break-words whitespace-normal">
    {ticket.description ? (
      <>
        {expandedTickets[ticket._id || ticket.id] || ticket.description.length <= 60
          ? ticket.description
          : `${ticket.description.slice(0, 60)}...`}

        {ticket.description.length > 60 && (
          <span 
            onClick={(e) => toggleExpand(e, ticket._id || ticket.id)}
            className="text-blue-500 font-medium hover:no-underline ml-1 cursor-pointer"
          >
            {expandedTickets[ticket._id || ticket.id] ? "Show less" : "Read more"}
          </span>
        )}
      </>
    ) : (
      "N/A"
    )}
  </span>
</TableCell> */}

<TableCell className="px-6 py-5 text-muted-foreground align-top">
  {ticket.description ? (
    <div className="flex items-start gap-2">
      {/* Short Description */}
      <span className="inline-block max-w-[300px] break-words whitespace-normal">
        {ticket.description.length > 60
          ? `${ticket.description.slice(0, 60)}...`
          : ticket.description}
      </span>

      {/* Tooltip Icon */}
      {ticket.description.length > 60 && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <AlertCircle className="w-5 h-5 text-slate-700 hover:text-slate-900 cursor-pointer flex-shrink-0" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="w-72 max-w-[300px] rounded-xl bg-black text-white text-xs p-4 shadow-2xl break-words whitespace-normal"
            >
              <p className="font-semibold mb-2 text-gray-300">
                Ticket Description
              </p>
              <p className="leading-relaxed break-words whitespace-pre-wrap">
                {ticket.description}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  ) : (
    "N/A"
  )}
</TableCell>

{/* <TableCell className="px-6 py-5 text-muted-foreground">
        {ticket.status}
      </TableCell> */}
      
            {/* Created */}
            <TableCell className="px-6 py-5 text-sm text-muted-foreground whitespace-nowrap">
              {new Date(ticket.createdAt).toLocaleDateString()}
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
