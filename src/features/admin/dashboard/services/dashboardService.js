export const getDashboardData = async () => {
  return {
    stats: [
      { title: "Total Students", value: 842 },
      { title: "Available Beds", value: 158 },
      { title: "Monthly Revenue", value: "₹45,280" },
      { title: "Maintenance", value: 24 },
    ],

    chartData: [
      { name: "North", value: 80 },
      { name: "South", value: 60 },
      { name: "East", value: 90 },
      { name: "West", value: 40 },
    ],

    applications: [
      { name: "Sandeep", course: "CS", status: "Pending" },
      { name: "Rakesh", course: "BBA", status: "Reviewing" },
    ],

    activity: [
      { text: "Fee received", time: "15 min ago" },
      { text: "Student check-in", time: "1 hr ago" },
    ],

    menu: [
      { title: "Breakfast", desc: "Eggs & Toast" },
      { title: "Lunch", desc: "Chicken & Rice" },
    ],
  };
};
