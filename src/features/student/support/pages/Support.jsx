import React from "react";
import {useState,useEffect} from "react";
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
} from "../../../../components/ui/Table";
import {getAllSupportTicketsApi} from "../../../../utils/utils"

export default function Support() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

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
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-6 py-4">
                  CREATED
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
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
                        <TableCell className="px-6 py-5 text-muted-foreground">
        {ticket.status}
      </TableCell>
                  <TableCell className="px-6 py-5 text-muted-foreground whitespace-nowrap">
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
