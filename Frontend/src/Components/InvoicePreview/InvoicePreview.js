import React, { useEffect, useState } from "react";
import "./invoicePreview.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import PrintableInvoice from "./PrintableInvoice";


export default function InvoicePreview({ invoice, subTotal, total,company }) {

  const handleDownload = async()=>{
    try {
          const input = document.getElementById(
            `print-invoice-${invoice._id || invoice.invoiceNumber}`
           );
      if (!input) {
        alert("Invoice element not found");
        return;
      }
      
      // Make the hidden element visible for rendering
      const originalVisibility = input.style.visibility;
      const originalPosition = input.style.position;
      const originalLeft = input.style.left;
      
      input.style.visibility = "visible";
      input.style.position = "absolute";
      input.style.left = "-9999px";
      
      // Wait a moment for rendering
     await new Promise((resolve) => setTimeout(resolve, 1000));

      const canvas = await html2canvas(input, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      
      // Restore original styles
      input.style.visibility = originalVisibility;
      input.style.position = originalPosition;
      input.style.left = originalLeft;
      
      // Check if canvas has valid dimensions
      if (canvas.width === 0 || canvas.height === 0) {
        console.error("Canvas dimensions:", canvas.width, canvas.height);
        alert("Failed to render invoice content");
        return;
      }
      
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const fileName = `invoice-${invoice.invoiceNumber || "draft"}-${new Date().getTime()}.pdf`;
      pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
      pdf.save(fileName);
      console.log("PDF saved as:", fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to download PDF: " + error.message);
    }
  };
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

  const taxAmount = subTotal * (invoice.tax || 0) / 100;

  return (
    <div className="invoice-view" id="invoice-view">
      <div className="company-brand">
        {company?.logoUrl && (
          <img src={`${process.env.REACT_APP_API_URL}${company.logoUrl}`} alt="logo" className="company-logo" />
        )}
        <div className="company-text">
          <h2>{company?.companyName || "Company Name"}</h2>
          <p>{company?.email}</p>
          <p>{company?.phone}</p>
          <p>{company?.address}</p>
        </div>
      </div>
      <header className="invoice-header">
        <h1>Invoice {invoice.invoiceNumber ? `#${invoice.invoiceNumber}` : "Preview"}</h1>
        <div>
          <p>
            <strong>Status:</strong> <span className={`status-badge ${invoice.status?.toLowerCase()}`}>{invoice.status || "Unpaid"}</span>
          </p>
          <p>
            <strong>Issue Date:</strong> {formatDate(invoice.issueDate)}
          </p>
          <p>
            <strong>Due Date:</strong> {formatDate(invoice.dueDate)}
          </p>
        </div>
      </header>
      <section className="client-info">
        <div>
          <h3>Bill To</h3>
          <p>
            <strong>{invoice.client?.name || "Client Name"}</strong>
          </p>
          <p>{invoice.client?.email || "client@email.com"}</p>
        </div>
        <div>
          <h3>Created By</h3>
          <p>{invoice.createdBy?.name || "Admin"}</p>
        </div>
      </section>

      <table className="invoice-table">
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
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No items added</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="totals">
        <div className="total-row">
          <span><strong>Subtotal:</strong></span>
          <span>{formatCurrency(subTotal)}</span>
        </div>
        {invoice.tax > 0 && (
          <div className="total-row">
            <span><strong>Tax ({invoice.tax}%):</strong></span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
        )}
        <div className="total-row final-total">
          <strong>Total:</strong>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>
      {invoice.notes && (
        <div className="notes">
          <h4>Notes</h4>
          <p>{invoice.notes}</p>
        </div>
      )}
      <button onClick={handleDownload} className="download-btn">
        📥 Download PDF
      </button>
      
      {/* Hidden element for PDF generation */}
      {company && (
        <div
  id={`pdf-container-${invoice._id || invoice.invoiceNumber}`}
  style={{
    position: "fixed",
    top: "0",
    left: "0",
    width: "794px",
    background: "white",
    zIndex: "-1",
    opacity: "0",
  }}
>
  <PrintableInvoice
    invoice={invoice}
    subTotal={subTotal}
    total={total}
    company={company}
  />
</div>
      )}
    </div>
    
  );
}
