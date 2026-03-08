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
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  // ===== Metrics =====
  const totalRevenue = invoices.reduce((acc, curr) => acc + curr.total, 0);
  const paidCount = invoices.filter((inv) => inv.status === "Paid").length;
  const unpaidCount = invoices.filter((inv) => inv.status === "Unpaid").length;
  const overdueCount = invoices.filter((inv) => inv.status === "Overdue").length;

  // ===== Growth Calculation =====
  const currentMonth = monthlyData[monthlyData.length - 1]?.total || 0;
  const prevMonth = monthlyData[monthlyData.length - 2]?.total || 0;
  const growth =
    prevMonth === 0 ? 0 : (((currentMonth - prevMonth) / prevMonth) * 100).toFixed(1);

  const chartData = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthlyData.map((d) => d.total),
        backgroundColor: "rgba(124, 58, 237, 0.7)",
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: { color: "#cbd5f5" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#94a3b8" },
        grid: { display: false },
      },
      y: {
        ticks: { color: "#94a3b8" },
        grid: { color: "rgba(255,255,255,0.05)" },
      },
    },
  };

  if (loading) {
    return <div className="overview-container">Loading dashboard...</div>;
  }

  return (
    <div className="overview-container">
      <h2 className="page-title">Overview</h2>

      {/* ===== Stats ===== */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <h4>Total Revenue</h4>
          <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
          <span className={`growth ${growth >= 0 ? "up" : "down"}`}>
            {growth}% this month
          </span>
        </div>

        <div className="stat-card glass">
          <h4>Paid Invoices</h4>
          <p className="stat-value">{paidCount}</p>
        </div>

        <div className="stat-card glass">
          <h4>Unpaid</h4>
          <p className="stat-value">{unpaidCount}</p>
        </div>

        <div className="stat-card glass">
          <h4>Overdue</h4>
          <p className="stat-value danger">{overdueCount}</p>
        </div>
      </div>

      {/* ===== Chart ===== */}
      <div className="chart-card glass">
        <div className="card-header">
          <h3>Revenue Analytics</h3>
          <span className="badge">Last 6 months</span>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* ===== Recent Clients ===== */}
      <div className="clients-card glass">
        <div className="card-header">
          <h3>Recent Clients</h3>
        </div>

        {recentClients.length === 0 ? (
          <p className="empty">No clients yet</p>
        ) : (
          <ul>
            {recentClients.map((client) => (
              <li key={client._id} className="client-row">
                <div className="avatar">
                  {client.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <strong>{client.name}</strong>
                  <p>{client.email}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}