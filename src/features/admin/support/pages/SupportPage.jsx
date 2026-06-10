import React, { useState, useEffect } from "react";
import { Search, Ticket, Edit2, Eye, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../../components/ui/dialog";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import DefaultTable from "../../../../components/DefaultTable/DefaultTable";
import { Label } from "../../../../components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../../components/ui/pagination";             // first step import karo
import {
  getAllSupportTicketsApi,
  updateSupportTicketApi,
} from "../../../../utils/utils"; 

export default function SupportPage() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedTickets, setExpandedTickets] = useState({});

//   const toggleExpand = (e, ticketId) => {
//   e.stopPropagation();

//   setExpandedTickets((prev) => ({
//     ...prev,
//     [ticketId]: !prev[ticketId],
//   }));
// };

const filteredTickets = tickets.filter((ticket) => {
  const name = ticket.studentName || ticket.userName || "";

  return name.toLowerCase().includes(searchTerm.toLowerCase());
});


  // Pagination states
  // // Second Step states add karo to panage
  // Uss component state mein current page aur per page records list ko track karne ka logic lagayein:
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;        // Aapko 8 dikhane hain ya 10? 

  // 3 
  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

//Step 4. 
//Apne Map Function Ko Update Karein
//HTML table mein apne mapping ko update kijiye.
//myOriginalDataArray.map(...) ki jagah ab naye cut/sliced items array set karein: -> currentItemsList.map(...)


const fetchSupportTickets = async () => {
  try {
    const response = await getAllSupportTicketsApi();
    console.log("getAllSupportTicketsApi response =>", response);

    const ticketList = Array.isArray(response?.SupportTickets)
      ? response.SupportTickets
      : [];

    setTickets(ticketList);
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    setTickets([]);
  }
};
  useEffect(() => {
    fetchSupportTickets();
  }, []);



  const handleEditClick = (ticket) => {
    setSelectedTicket({ ...ticket });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;

    const ticketId = selectedTicket.id || selectedTicket._id;
    const updated = await updateSupportTicketApi(ticketId, selectedTicket);

    if (updated !== null) {
      await fetchSupportTickets();
      setIsEditModalOpen(false);
      setSelectedTicket(null);
    }
  };


  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-background min-h-screen text-foreground">
      {/* Header Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support & Help Center</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage global inquiries and system documentation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-3xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
<input
  type="text"
  placeholder="Search by student name..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  className="w-full h-14 pl-12 pr-4 rounded-xl border border-input bg-card text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all placeholder:text-muted-foreground"
/>
        </div>
      </div>

      {/* Tickets Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 font-bold" />
            <h2 className="text-lg md:text-xl font-bold">Recent Support Tickets</h2>
          </div>
          {/* <button className="text-sm font-semibold hover:underline">
            View All Tickets
          </button> */}
        </div>

        {/* Table Container */}
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm text-left">
             <thead className="bg-muted/50 text-muted-foreground text-sm font-semibold border-b border-border">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Student Name</th>
                <th className="px-6 py-4 whitespace-nowrap">Room No.</th>
                <th className="px-6 py-4 whitespace-nowrap">Subject</th>
                <th className="px-6 py-4 whitespace-nowrap">Description</th>
                {/* <th className="px-6 py-4 whitespace-nowrap">Status</th> */}
                <th className="px-6 py-4 whitespace-nowrap">Created</th>
                {/* <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th> */}
              </tr>
            </thead>
<tbody className="divide-y divide-border text-sm">
  {currentTickets.length === 0 ? (
    <tr>
      <td colSpan={5}>
        <DefaultTable
          title="No Tickets Found"
          description="There are currently no support tickets available."
          height="400px"
        />
      </td>
    </tr>
  ) : (
    currentTickets.map((ticket) => (
      <tr
        key={ticket.id || ticket._id}
        className="hover:bg-muted/30 transition-colors"
      >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
{ticket.imagePath ? (
  <img
    src={ticket.imagePath}
    alt={ticket.studentName || ticket.userName}
    className="w-8 h-8 rounded-full border border-border object-cover"
  />
) : (
  <div className="w-8 h-8 rounded-full border border-border bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700 uppercase">
    {(ticket.studentName || ticket.userName || "N")
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)}
  </div>
)}
          <span className="font-medium text-foreground">
            {ticket.studentName || ticket.userName}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-foreground whitespace-nowrap">
        {ticket.roomNo}
      </td>

      <td className="px-6 py-4 text-foreground min-w-[250px]">
        {ticket.subject}
      </td>
      <td className="px-6 py-4 align-top">
        {ticket.description ? (
          <div className="flex items-start gap-2">
            {/* Short Description */}
            <span className="text-foreground font-medium inline-block max-w-[250px] break-words whitespace-normal">
              {ticket.description.length > 60
                ? `${ticket.description.slice(0, 60)}...`
                : ticket.description}
            </span>

            {/* Tooltip Icon */}
            {ticket.description.length > 60 && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertCircle className="w-5 h-5 text-slate-700 hover:text-slate-900 cursor-pointer flex-shrink-0 mt-0.5" />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    align="center"
                    className="z-[60] w-72 max-w-[300px] rounded-xl bg-black text-white text-xs p-4 shadow-2xl break-words whitespace-normal"
                  >
                    {/* <p className="font-semibold mb-2 text-gray-300">Ticket Description</p> */}
                    <div className="leading-relaxed break-words whitespace-pre-wrap max-h-56 overflow-auto pr-1">
                      {ticket.description}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        ) : (
          "N/A"
        )}
      </td>

      {/* <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-full">
          {ticket.status}
        </span>
      </td> */}

<td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
  {ticket.createdAt?.split("T")[0]}
</td>

      {/* <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center justify-end gap-4">
          <button
            onClick={() => handleEditClick(ticket)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate(`/admin/support/${ticket.id || ticket._id}`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td> */}
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      </div>


      {/* // Step 5 */}

      {/* Pagination UI */}
      {/* Pagination UI */}
      {totalPages > 1 && (
        <Pagination className="mt-4 flex justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(p => Math.max(1, p - 1));
                }} 
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === "..." ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink 
                    href="#"
                    isActive={currentPage === page}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(p => Math.min(totalPages, p + 1));
                }} 
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Edit Ticket Modal */}
      {/* <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-border bg-card text-card-foreground">
          <DialogHeader className="border-b border-border pb-4">
            <DialogTitle className="text-2xl font-semibold">Edit Support Ticket</DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6 py-2">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Student Name</Label>
                <Input
                  value={selectedTicket.studentName}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, studentName: e.target.value })}
                  className="h-12 rounded-lg border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Room No.</Label>
                <Input
                  value={selectedTicket.roomNo}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, roomNo: e.target.value })}
                  className="h-12 rounded-lg border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Subject</Label>
                <Input
                  value={selectedTicket.subject}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, subject: e.target.value })}
                  className="h-12 rounded-lg border-input bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground">Status</Label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => setSelectedTicket({ ...selectedTicket, status: e.target.value })}
                  className="flex h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Open">Open</option>
                  <option value="Pending">Pending</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <Button
                  onClick={handleUpdate}
                  className="h-11 px-8 rounded-lg bg-[#0a0a0a] hover:bg-[#171717] text-white font-semibold flex-1 dark:bg-white dark:hover:bg-slate-200 dark:text-black"
                >
                  Update
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  className="h-11 px-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex-1 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
