import React from "react";
import "./printableInvoice.css";

export default function PrintableInvoice({ invoice, subTotal, total, company }) {
  // Safe formatting functions
  const formatDate = (date) => {
    if (!date) return "Not set";
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);
  };

const safeSubTotal = subTotal ?? invoice.subTotal ?? 0;
const safeTotal = total ?? invoice.total ?? 0;

const taxAmount = safeSubTotal * (invoice.tax || 0) / 100;

  return (
<div
  className="print-invoice"
  id={`print-invoice-${invoice._id || invoice.invoiceNumber}`}
>
<header className="print-header">
  
  <div className="company-block">
    {company?.logoUrl && (
      <img
       src={`${process.env.REACT_APP_API_URL || "http://localhost:5000"}${company.logoUrl}`}
        alt="logo"
        crossOrigin="anonymous"
        className="company-logo"
      />
    )}

    <h2>{company?.companyName}</h2>
    <p>{company?.email}</p>
    <p>{company?.phone}</p>
    <p>{company?.address}</p>
  </div>

  <div className="invoice-title">
    <h1>INVOICE</h1>
    <p>Invoice #: {invoice.invoiceNumber}</p>
  </div>

  <div className="invoice-meta">
    <p><strong>Status:</strong> {invoice.status}</p>
    <p><strong>Issue:</strong> {formatDate(invoice.issueDate)}</p>
    <p><strong>Due:</strong> {formatDate(invoice.dueDate)}</p>
  </div>

</header>

      <section className="print-client">
        <div>
          <h3>Bill To</h3>
          <p><strong>{invoice.client?.name || "Client Name"}</strong></p>
          <p>{invoice.client?.email || "client@email.com"}</p>
        </div>
      </section>

      <table className="print-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: "80px", textAlign: "center" }}>Qty</th>
            <th style={{ width: "100px", textAlign: "right" }}>Rate</th>
            <th style={{ width: "100px", textAlign: "right" }}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.map((item, i) => (
              <tr key={i}>
                <td>{item.description || "N/A"}</td>
                <td style={{ textAlign: "center" }}>{item.quantity || 0}</td>
                <td style={{ textAlign: "right" }}>{formatCurrency(item.rate)}</td>
                <td style={{ textAlign: "right" }}>
                  {formatCurrency((item.quantity || 0) * (item.rate || 0))}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No items</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="print-totals">
        <div className="total-row">
          <div>Subtotal:</div>
          <div>{formatCurrency(safeSubTotal )}</div>

        </div>
        {invoice.tax > 0 && (
          <div className="total-row">
            <div>Tax ({invoice.tax}%):</div>
            <div>{formatCurrency(taxAmount)}</div>
          </div>
        )}
        <div className="total-row final-total">
         <div> <strong>Total:</strong></div>
          <div><strong>{formatCurrency(safeTotal)}</strong></div>

        </div>
      </div>

      {invoice.notes && (
        <div className="print-notes">
          <h4>Notes</h4>
          <p>{invoice.notes}</p>
        </div>
      )}

      <footer className="print-footer">
        <p>Thank you for your business!</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Generated on {new Date().toLocaleDateString("en-IN")}
        </p>
      </footer>
    </div>
  );
}