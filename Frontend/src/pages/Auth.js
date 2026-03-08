import React, { useState } from "react";
import API from "../api/axios";
import "./auth.css";
import { useNavigate } from "react-router-dom";
import logo from "../images/logo.jpg";
import Dashboard from "../Components/Dashboard/Dashboard";
import dash from "../images/dash.png";
export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        if (!formData.email || !formData.password) {
          alert("Please enter both email and password.");
          return;
        }
        console.log("Logging in with:", formData);
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/dashboard");
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          alert("Please fill in all fields for registration.");
          return;
        }
        const res = console.log("Registering with:", formData);
        await API.post("/auth/register", formData);
        alert("Registration successful Please login");
        setIsLogin(true);
      }
    } catch (err) {
      alert("somthing went wrong");
      console.log("Registering with:", formData);
      alert(
        err.response?.data?.message ||
          "Something went wrong. Check credentials."
      );
    }
  };
    const [showPassword, setShowPassword] = useState(false);
return (
  <div className="auth-container">
    {/* LEFT SIDE */}
    <div className="auth-left">
      <div className="brand-section">
        <div className="logo-section">
          <img src={logo} alt="logo" className="logo-img" />
          <h1 className="head">INVOICE <b>PRO</b></h1>
        </div>

        <h1>
          Smart Invoicing for <br />
          <span>Modern Businesses</span>
        </h1>

        <p>
          Create invoices, track payments, and manage clients —
          all from one powerful dashboard.
        </p>

        <div className="dashboard-preview floating-card">
          <div className="mock-card">
            <img src={dash} alt="Dashboard Preview" className="dash-img" />
          </div>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE */}
    <div className="auth-right">
      <div className="glass-card">
        <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>

        <p className="subtitle">
          {isLogin
            ? "Login to continue managing your invoices"
            : "Start managing your invoices today"}
        </p>

        <form onSubmit={handleAuth}>
          {/* Name field only for Register */}
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="show-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          <button type="submit" className="login-btn">
            {isLogin ? "Login" : "Create Free Account"}
          </button>
        </form>

        <p className="register-text">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? " Register" : " Login"}
          </span>
        </p>
      </div>
    </div>
  </div>
);
}
