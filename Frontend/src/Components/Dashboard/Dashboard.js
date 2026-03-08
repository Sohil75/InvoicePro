import React, { useState } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import "./dashboard.css";
import Overview from "../Overview/Overview";
import logo from "../../images/logo.jpg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaFileInvoice } from "react-icons/fa6";
import { MdOutlineContentPasteSearch } from "react-icons/md";
import { GrAnalytics } from "react-icons/gr";
import { AiTwotoneSetting } from "react-icons/ai";
import CompanyCheck from "../../hooks/CompanyCheck";

export default function Dashboard({ user, setUser }) {
    const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
    const loading = CompanyCheck();
  if(loading) return <div>loading...</div>

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
    <div className="brand">
      <img src={logo} alt="logo" className="brand-logo"/>
      <h2 className="brand-name">
        INVOICE <span>PRO</span>
      </h2>
    </div>

    <span 
      className="close-btn"
      onClick={() => setSidebarOpen(false)}
    >
      ✕
    </span>
  </div>
        <nav className="nav-links">
          <Link to="/dashboard/create" className={location.pathname.includes("create") ? "active": ""}><FaFileInvoice /> Create Invoice</Link>
          <Link to="/dashboard/invoices" className={location.pathname.includes("invoices") ? "active": ""}><MdOutlineContentPasteSearch />Past Invoices</Link>
          <Link to="/dashboard/overview" className={location.pathname.includes("overview") ? "active": ""}><GrAnalytics /> Overview</Link>
          <Link to="/dashboard/settings" className={location.pathname.includes("settings") ? "active" : ""}><AiTwotoneSetting /> Settings </Link>
        </nav>
      </aside>
      {sidebarOpen && (
  <div 
    className="overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}

      <div className="main-content">
    <header className="topbar">
  <div className="topbar-left">
    <div className="menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
      ☰
    </div>
    <h3>
      Hello, {user?.name?.split(" ")[0] || "User"} 👋
    </h3>
  </div>

  <div className="topbar-right">

    <div className="search-bar">
      <input type="text" placeholder="Search invoices..." 
      value={search} onChange={(e)=>setSearch(e.target.value)}      
      />
    </div>

    <div className="icon-button">
      🔔
      <span className="notification-dot"></span>
    </div>
    <div className="avatar-wrapper">
      <div
        className="avatar"
        onClick={() => setDropdownOpen(prev => !prev)}
      >
        {user?.name?.[0] || "U"}
      </div>

      {dropdownOpen && (
        <div className="dropdown">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>

  </div>
</header>
        <section className="content">
          <Outlet context={{search}}/>
        </section>
      </div>
    </div>
  );
}
