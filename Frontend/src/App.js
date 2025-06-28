import { Route, Router, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Invoice from "./Components/InvoicePreview/InvoicePreview";
import InvoiceForm from "./Components/InvoiceForm/InvoiceForm";
import Dashboard from "./Components/Dashboard/Dashboard";
import Overview from "./Components/Overview/Overview";
import { useEffect, useState } from "react";
import InvoicePreview from "./Components/InvoicePreview/InvoicePreview";
import LandingPage from "./pages/LandingPage";
import PastInvoice from "./Components/PastInvoices/PastInvoice";

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      try {
        return JSON.parse(userData);
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        return null;
      }
    }
    return null;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/dashboard" /> : <LandingPage />}
      />
      <Route path="/login" element={<Auth setUser={setUser} />} />
      <Route
        path="/dashboard/*"
        element={
          user ? (
            <Dashboard user={user} setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      >
        <Route index element={<Overview />} />
        <Route path="create" element={<InvoiceForm />} />
        <Route path="invoices" element={<PastInvoice />} />
        <Route path="overview" element={<Overview />} />
      </Route>
    </Routes>
  );
}

export default App;
