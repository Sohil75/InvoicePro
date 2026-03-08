import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../images/in.jpg";
import "./landing.css";
import invoiceImg from "../images/invoiceImg.png";
import logo from "../images/logo.jpg";
import { TbFileInvoice } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { MdOutlineManageAccounts } from "react-icons/md";
import { IoAnalyticsOutline } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
export default function LandingPage() {

  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="landing">
      <nav className="nav-bar">
        <div className="nav-left">
          <img src={logo} alt="logo"  className="logo"/>
          <h1 >INVOICE <span>PRO</span></h1>
        </div>
        <div className={`nav-right ${menuOpen ? "active" : ""}`}>
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="/login">Login</a>
          <a href="/login" className="btn btn-primary-s">Get Started</a>
        </div>
        <div className="humburger" onClick={()=>setMenuOpen(!menuOpen)}>☰</div>
      </nav>
      
      {/* Hero */}
      <section className="hero" id="Hero">
        <div className="hero-content">
          <h1>Smart Invoicing for <span>Modern Businesses</span></h1>
          <p>
            Create professional invoices, track payments, and manage clients - all fron one powerful dashboard.
          </p>
          <div className="hero-actions">
            <a href="/login" className="btn btn-primary">Get Started</a>
            <a href="/login" className="btn btn-secondary">Login</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup">
            <img src={invoiceImg} alt="invoice mockup" />
          </div>
        </div>
      </section>
      <section className="features" id="features">
        <h2>Everything You Need to <span>Manage Invoices</span></h2>
        <p className="head">Create professional invoices, track payments, and manage clients- all from one powerful dashboard.</p>
        <div className="features-grid">
          <div className="feature-card">
            <TbFileInvoice className="feature-icon" />
            <div className="feature-content">
            <h3>Create Invoices</h3>
            <p>Create clean, professional invoices in seconds.</p>
            </div>
          </div>

          <div className="feature-card">
            <MdOutlinePayments  className="feature-icon"/>
            <div className="feature-content">
            <h3>Track Payments</h3>
            <p>Monitor paid, unpaid, and overdue invoices easily.</p>
            </div>
          </div>

          <div className="feature-card">
            <MdOutlineManageAccounts className="feature-icon"/>
            <div className="feature-content">
            <h3>Client Management</h3>
            <p>Easily manage and update client information and contact details.</p>
            </div>
          </div>
          <div className="feature-card wide">
            <IoAnalyticsOutline className="feature-icon"/>
            <div className="feature-content">
            <h3>Dashboard Analytics</h3>
            <p>Get visual insights with charts for revenue and invoice status.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="how" id="how">
        <h2>How Invoice Pro Works</h2>
        <p className="subtitle">No credit card required. Get started in a seconds.</p>
        <div className="steps">
          <div className="step">
            <div className="steps-circle">1</div>
            <p>Sign up or log in</p>
          </div>
          <div className="step">
            <div className="steps-circle">2</div>
            <p>Create your invoices</p>
          </div>
          <div className="step">
            <div className="steps-circle">3</div>
            <p>Download & track payments</p>
          </div>
        </div>
      </section>
      <section className="cta" id="cta">
        <h2>Start Managing Your Invoices Today</h2>
        <p>No credit card required. Get started in seconds.</p>
        <div className="badges">
          <span><FaCheckCircle className="check-icon"/>  Built with MERN stack</span>
          <span><FaCheckCircle className="check-icon"/>  Secure authentication</span>
          <span><FaCheckCircle className="check-icon"/>  Real-world project</span>
        </div>
        <a href="/login" className="btn btn-primary big">Create Free Account</a>
      </section>
      <footer className="footer">
        <p>&copy; 2024 Invoice Pro. Built By Sohil </p>
      </footer>
      </div>
          
  );
}
