export const getReportStats = () => {
  return Promise.resolve({
    stats: [
      { title: "TOTAL REVENUE", value: "₹248.5k", change: "+12%" },
      { title: "ACTIVE HOSTELS", value: "1,204", change: "+8%" },
      { title: "TOTAL BOOKINGS", value: "42.1k", change: "+18%" },
      { title: "OCCUPANCY RATE", value: "84.5%", change: "+2%" },
    ],
    chart: [
      { month: "Jan", revenue: 30, growth: 10 },
      { month: "Feb", revenue: 80, growth: 40 },
      { month: "Mar", revenue: 60, growth: 20 },
      { month: "Apr", revenue: 20, growth: 50 },
      { month: "May", revenue: 55, growth: 25 },
      { month: "Jun", revenue: 65, growth: 30 },
    ],
    performance: [
      {
        name: "Alpine Stay Hostel",
        region: "Switzerland",
        revenue: "₹42,500",
        occupancy: 92,
        status: "ACTIVE",
      },
      {
        name: "Ocean Breeze",
        region: "Australia",
        revenue: "₹12,200",
        occupancy: 12,
        status: "ACTIVE",
      },
    ],
  });
};
