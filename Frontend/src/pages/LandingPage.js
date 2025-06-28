import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bgimage from "../images/in.jpg";
import "./landing.css";

export default function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const landingContainer = document.querySelector(".landing-container");
    landingContainer.classList.add("fade-in");
  }, []);
  return (
    <div className="landing-container">
      <div className="banner">
        <div className="banner-content">
          <h1>Welcome to InvoicePro</h1>
          <p>Create and manage your Invoices with ease.</p>
        </div>
      </div>
      <div className="button-container">
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    </div>
  );
}
