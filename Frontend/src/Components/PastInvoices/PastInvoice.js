import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import InvoicePreview from "../InvoicePreview/InvoicePreview";
import "./pastInvoice.css"; 
import { useOutletContext } from "react-router-dom";

export default function PastInvoice() {
    const [company ,setCompany] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const {search} = useOutletContext();

  const markAsPaid = async (id) =>{
    try {
      await API.put(`/invoices/${id}`,{status:"Paid"});

      const res = await API.get(`/invoices?search=${search}`);
      setInvoices(res.data);
    } catch (error) {
      console.error("Failed to update invoices",error);
      
    }
  };
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get(`/invoices?search=${search}`);
        setInvoices(res.data);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };
    const fetchCompany =async()=>{
      try {
        const companyRes = await API.get("/company-profile");
        setCompany(companyRes.data);
      } catch (error) {
        console.error("error fetching company",error);
        
      }
    };

    fetchInvoices();
    fetchCompany();
  }, [search]);
  return (
    <div className="past-invoices-container">
      <h2>Past Invoices</h2>
      {invoices.length === 0 ? (
        <p>No Invoices found.</p>
      ) : (
        invoices.map((inv) => (
          <div key={inv._id} className="invoice-wrapper">
            <InvoicePreview
              invoice={inv}
              subTotal={inv.subTotal}
              total={inv.total}
              company={company}
            />

            {inv.status !== "Paid" && (
              <button
                className="mark-paid-btn"
                onClick={() => markAsPaid(inv._id)}
              >
                Mark as Paid
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
