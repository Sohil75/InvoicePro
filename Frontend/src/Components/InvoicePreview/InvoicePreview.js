import React, { useEffect, useState } from "react";
import "./invoicePreview.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoicePreview({ invoice, subTotal, total }) {
  const handleDownload = () => {
    const input = document.getElementById("invoice-view");
    const button = input.querySelector("button");

    if (button) {
      button.style.display = "none"; // Hide the button before capturing
    }

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("invoice.pdf");

      if (button) {
        button.style.display = "block"; // Show the button again after capturing
      }
    });
  };
  return (
    <div className="invoice-view" id="invoice-view">
      <header className="invoice-header">
        <h1>Invoice #{invoice.invoiceNumber}</h1>
        <div>
          <p>
            <strong>Status:</strong>
            {invoice.status}
          </p>
          <p>
            <strong>IssueDate:</strong>
            {new Date(invoice.issueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Due Date:</strong>
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
      </header>
      <section className="client-info">
        <div>
          <h3>Client</h3>
          <p>
            <strong>Name:</strong>
            {invoice.client?.name}
          </p>
          <p>
            <strong>Email:</strong>
            {invoice.client?.email}
          </p>
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
            <th>Qty</th>
            <th>Rate</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i}>
              <td>{item.description}</td>
              <td>{item.quantity}</td>
              <td>${item.rate}</td>
              <td>${item.quantity * item.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="totals">
        <p>
          <strong>Subtotals: </strong>${subTotal}
        </p>
        <p>
          <strong>Tax: </strong> ${invoice.tax}%
        </p>
        <p className="total">
          {" "}
          <strong> Total: </strong>${total}
        </p>
      </div>
      {invoice.notes && (
        <div className="notes">
          <h4>Notes</h4>
          <p>{invoice.notes}</p>
        </div>
      )}
      <button onClick={handleDownload}>DownloadPdf</button>
    </div>
  );
}
