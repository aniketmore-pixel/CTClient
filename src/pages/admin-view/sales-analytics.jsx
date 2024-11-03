// sales-analytics.jsx
import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample bogus sales data
  useEffect(() => {
    const fetchSalesData = async () => {
      // Simulating an API call with bogus data
      const bogusData = [
        { _id: { month: 1, year: 2024 }, totalSales: 2000, totalOrders: 100 },
        { _id: { month: 2, year: 2024 }, totalSales: 3000, totalOrders: 150 },
        { _id: { month: 3, year: 2024 }, totalSales: 2500, totalOrders: 120 },
        { _id: { month: 4, year: 2024 }, totalSales: 4000, totalOrders: 200 },
        { _id: { month: 5, year: 2024 }, totalSales: 4500, totalOrders: 180 },
        { _id: { month: 6, year: 2024 }, totalSales: 5000, totalOrders: 220 },
      ];

      setSalesData(bogusData);
      setLoading(false);
    };

    fetchSalesData();
  }, []);

  // Transform data for chart display
  const labels = salesData.map(item => `${item._id.month}/${item._id.year}`);
  const salesAmounts = salesData.map(item => item.totalSales);
  const ordersCounts = salesData.map(item => item.totalOrders);

  // Data for Line chart
  const lineData = {
    labels,
    datasets: [
      {
        label: "Monthly Sales ($)",
        data: salesAmounts,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.4, // Smooth line
        fill: true,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Data for Bar chart
  const barData = {
    labels,
    datasets: [
      {
        label: "Total Orders",
        data: ordersCounts,
        backgroundColor: "rgba(255,99,132,0.6)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ flex: 1, padding: "20px", margin: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", maxWidth: "100%" }}>
      <h2 style={{ textAlign: "center", color: "#333" }}>Sales Analytics Dashboard</h2>
      {loading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center", color: "#666" }}>Sales Over Time</h3>
            <Line 
              data={lineData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: true, // Set to true to maintain aspect ratio
                plugins: { 
                  title: { display: true, text: 'Sales Trends', font: { size: 16 } },
                  tooltip: { enabled: true },
                },
                animations: {
                  tension: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                    from: 0.1,
                    to: 0.4,
                    loop: true
                  }
                }
              }} 
              height={90} // Fixed height for the chart
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ textAlign: "center", color: "#666" }}>Orders Count</h3>
            <Bar 
              data={barData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: true, // Set to true to maintain aspect ratio
                plugins: { 
                  title: { display: true, text: 'Monthly Orders', font: { size: 16 } },
                  tooltip: { enabled: true },
                },
                animations: {
                  y: {
                    duration: 1000,
                    easing: 'easeInOutBounce'
                  }
                },
              }} 
              height={90} // Fixed height for the chart
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;
