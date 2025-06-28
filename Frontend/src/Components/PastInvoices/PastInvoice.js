import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import InvoicePreview from "../InvoicePreview/InvoicePreview";

export default function PastInvoice() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await API.get("/invoices");
        setInvoices(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching invoices", error);
      }
    };
    fetchInvoices();
  }, []);
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
            />
          </div>
        ))
      )}
    </div>
  );
}
