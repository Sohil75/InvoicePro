import React, { useState } from "react";
import API from "../api/axios";
import "./auth.css";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleAuth}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="password"
            required
          />
          <button type="submit">{isLogin ? "Login" : "Register"}</button>
        </form>
        <p>
          {isLogin ? "Don't have an account?" : "Already registered?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register here" : " Login here"}{" "}
          </span>
        </p>
      </div>
    </div>
  );
}
