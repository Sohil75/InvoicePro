import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { Bar } from "react-chartjs-2";
import "./overview.css";
import {
  Chart as ChartJs,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Overview() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [recentClients, setRecentClients] = useState([]);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [invoiceRes, monthlyRes, clientRes] = await Promise.all([
          API.get("/invoices"),
          API.get("/invoices/monthly"),
          API.get("/clients/recent"),
        ]);

        setInvoices(invoiceRes.data);
        setMonthlyData(monthlyRes.data);
        setRecentClients(clientRes.data);
      } catch (error) {
        console.error("error loading overview data", error);
      }
    };
    fetchOverviewData();
  }, []);

  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const paidCount = invoices.filter((inv) => inv.status === "Paid").length;
  const unpaidCount = invoices.filter((inv) => inv.status === "Unpaid").length;

  const charData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyData.map((d) => d.total),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderRadius: 5,
      },
    ],
  };
  return (
    <div className="overview-container">
      <h2>Overview</h2>
      <div className="stats-grid">
        <div className="stats-card">
          <h4>Total Revenue</h4>
          <p>₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h4>Paid Invoices</h4>
          <p>{paidCount}</p>
        </div>
        <div className="stat-card">
          <h4>Unpaid Invoices</h4>
          <p>{unpaidCount}</p>
        </div>
      </div>
      <div className="chart-section">
        <h3>Monthly Revenue Chart</h3>
        <Bar data={charData} />
      </div>
      <div className="recent-clients">
        <h3>Recent Clients</h3>
        <ul>
          {recentClients.map((client) => (
            <li key={client._id}>
              <strong>{client.name}</strong> - {client.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
