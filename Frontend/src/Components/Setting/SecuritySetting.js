import React, { useState } from "react";
import API from "../../api/axios";

export default function SecuritySettings() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      return alert("Passwords do not match");
    }

    setLoading(true);
    try {
      await API.put("/users/change-password", form);
      alert("Password changed successfully");
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      alert("Password change failed");
      console.log("error in changing",err);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="settings-card glass" onSubmit={handleSubmit}>
      <h3>Change Password</h3>

      <label>Current Password</label>
      <input
        type="password"
        name="currentPassword"
        value={form.currentPassword}
        onChange={handleChange}
        required
      />

      <label>New Password</label>
      <input
        type="password"
        name="newPassword"
        value={form.newPassword}
        onChange={handleChange}
        required
      />

      <label>Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        required
      />

      <button className="primary-btn" disabled={loading}>
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}