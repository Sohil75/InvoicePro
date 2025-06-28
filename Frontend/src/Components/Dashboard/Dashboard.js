import React, { useState } from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import "./dashboard.css";
import Overview from "../Overview/Overview";

export default function Dashboard({ user, setUser }) {
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">InvoicePro</h2>
        <nav className="nav-links">
          <Link to="/dashboard/create">📝 Create Invoice</Link>
          <Link to="/dashboard/invoices">📂 Past Invoices</Link>
          <Link to="/dashboard/overview">📊 Overview</Link>
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <h3>Hello,{user?.name?.split(" ")[0] || "User"}👋</h3>
          <div className="topbar-actions">
            <div
              className="avatar"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
              {user?.name?.[0] || "U"}
            </div>
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </header>
        <section className="content">
          <Outlet />
        </section>
      </div>
    </div>
  );
}
