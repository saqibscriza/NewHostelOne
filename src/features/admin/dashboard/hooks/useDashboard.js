import { useEffect, useState } from "react";

export const useDashboard = () => {
  const [data, setData] = useState({
    stats: [],
    chartData: [],
    applications: [],
    activity: [],
    menu: [],
  });

  useEffect(() => {
    // temporary dummy data
    setData({
      stats: [
        { title: "Total Students", value: 842 },
        { title: "Available Beds", value: 158 },
        { title: "Revenue", value: "₹45,280" },
        { title: "Maintenance", value: 24 },
      ],
      chartData: [],
      applications: [],
      activity: [],
      menu: [],
    });
  }, []);

  return data;
};
