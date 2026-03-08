import React, { useEffect, useState } from "react";
import InvoicePreview from "../InvoicePreview/InvoicePreview";
import "./invoiceform.css";
import { IoIosRemove } from "react-icons/io";
import API from "../../api/axios";

export default function InvoiceForm() {
  const [company,setCompany] = useState(null);
  const [savedInvoice, setSavedInvoice] = useState(null);

  const [invoice, setInvoice] = useState({
    invoiceNumber: "",
    client: { _id: "", name: "", email: "" },
    issueDate: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, rate: 0 }],
    tax: 0,
    status: "Unpaid",
    notes: "",
  });

  const [clients, setClients] = useState([]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await API.get("/clients");
        setClients(res.data);
      } catch (error) {
        console.error("failed to fetch clients", error);
      }
    };
    fetchClients();
  }, 
  []);
   useEffect(()=>{
      const fethCompany = async()=>{
        try {
          const res = await API.get("/company-profile");
          setCompany(res.data);
        } catch (error) {
          console.error("failed to fetch company",error);
        }
      };
      fethCompany();
    },[]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInvoice({ ...invoice, [name]: value });
  };
  const handleItemChange = (index, field, value) => {
    const items = [...invoice.items];
    items[index][field] = field === "description" ? value : Number(value);
    setInvoice({ ...invoice, items });
  };
  const addItems = () => {
    setInvoice({
      ...invoice,
      items: [...invoice.items, { description: "", quantity: 1, rate: 0 }],
    });
  };
  const calculateSubtotal = () =>
    invoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const calculateTotal = () =>
    calculateSubtotal() + (calculateSubtotal() * invoice.tax) / 100;

  const getDisplayInvoice = () => savedInvoice || invoice;

  const calculateDisplaySubtotal = () => {
    const displayInvoice = getDisplayInvoice();
    return displayInvoice.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  };

  const calculateDisplayTotal = () => {
    const displayInvoice = getDisplayInvoice();
    const subTotal = calculateDisplaySubtotal();
    return subTotal + (subTotal * (displayInvoice.tax || 0)) / 100;
  };

  const removeItem = (index) => {
    if (invoice.items.length <= 1) return;
    const items = [...invoice.items];
    items.splice(index, 1);
    setInvoice({ ...invoice, items });
  };
  const handleClientSelect = (e) => {
    const clientId = e.target.value;
    const selectedClient = clients.find((c) => c._id === clientId);
    if (selectedClient) {
      setInvoice({ ...invoice, client: selectedClient });
    }
  };
  const handleSaveInvoices = async () => {
    try {
      // Validation
      if (!invoice.client.name || !invoice.client.email) {
        alert("Please select or enter a client");
        return;
      }
      if (!invoice.issueDate || !invoice.dueDate) {
        alert("Please select both issue date and due date");
        return;
      }
      if (invoice.items.length === 0 || invoice.items.some(item => !item.description || item.rate === 0)) {
        alert("Please add at least one item with description and rate");
        return;
      }

      const payload = {
        ...invoice,
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
        },
        status: invoice.status?.trim(),
        subTotal: calculateSubtotal(),
        total: calculateTotal(),
      };
      console.log("Sending payload:", payload);
      const res = await API.post("/invoices", payload);
      console.log("Response received:", res.data);

      // Store the saved invoice
      setSavedInvoice(res.data);

      alert(`Invoice saved success! Invoice #${res.data.invoiceNumber}`);
      
      // Reset form for next invoice
      setInvoice({
        invoiceNumber: "",
        client: { _id: "", name: "", email: "" },
        issueDate: "",
        dueDate: "",
        items: [{ description: "", quantity: 1, rate: 0 }],
        tax: 0,
        status: "Unpaid",
        notes: "",
      });
    } catch (error) {
      console.error("error saving invoices", error);
      alert(`Failed to save invoice: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="invoice-page-layout">
      <div className="form-section-wrapper">
      <div className="create-invoice-card">
      <h2 className="form-title">Create Invoice</h2>

      {/* Invoice Number */}
      {invoice.invoiceNumber && (
        <div className="invoice-number-display">
          <label>Invoice Number</label>
          <input
            type="text"
            className="input-field"
            value={invoice.invoiceNumber}
            readOnly
            disabled
          />
        </div>
      )}

      {/* Client Section */}
      <div className="form-section">
        <label>Select Existing Client</label>
        <select
          className="input-field"
          onChange={handleClientSelect}
          value={invoice.client._id || ""}
        >
          <option value="" disabled>
            Select Client
          </option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name} ({client.email})
            </option>
          ))}
        </select>

        <label>Client Name</label>
        <input
          className="input-field"
          placeholder="Client Name"
          value={invoice.client.name}
          onChange={(e) =>
            setInvoice({
              ...invoice,
              client: { ...invoice.client, name: e.target.value },
            })
          }
        />

        <label>Client Email</label>
        <input
          className="input-field"
          placeholder="Client Email"
          value={invoice.client.email}
          onChange={(e) =>
            setInvoice({
              ...invoice,
              client: { ...invoice.client, email: e.target.value },
            })
          }
        />
      </div>

      {/* Date Section */}
      <div className="date-row">
        <div className="issue-date">
          <label>Issue Date</label>
          <input
            type="date"
            name="issueDate"
            value={invoice.issueDate}
            className="input-field issue-date"
            onChange={handleChange}
          />
        </div>

        <div className="due-date">
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={invoice.dueDate}
            className="input-field"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Items Section */}
      <h3 className="items-title">Items</h3>
      <div className="item-header">
      <span>Description</span>
      <span>Qty</span>
      <span>Rate</span>
      <span></span>
      </div>
      {invoice.items.map((item, idx) => (
        <div key={idx} className="item-row">

          <input
            className="input-field"
            placeholder="Description"
            value={item.description}
            onChange={(e) =>
              handleItemChange(idx, "description", e.target.value)
            }
          />

          <input
            type="number"
            className="input-field"
            value={item.quantity}
            onChange={(e) =>
              handleItemChange(idx, "quantity", e.target.value)
            }
          />

          <input
            type="number"
            className="input-field"
            value={item.rate}
            onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
          />

          {invoice.items.length > 1 && (
            <button
              onClick={() => removeItem(idx)}
              className="remove-btn"
            >
              <IoIosRemove />
            </button>
          )}
        </div>
      ))}

      <button onClick={addItems} className="add-btn">
        + Add Item
      </button>

      {/* Tax + Notes */}
      <div className="form-section">
        <label className="tax">Tax %</label>
        <input
          type="number"
          value={invoice.tax}
          className="input-field"
          onChange={(e) =>
            setInvoice({ ...invoice, tax: Number(e.target.value) })
          }
        />

        <label>Notes</label>
        <textarea
          className="input-field textarea"
          placeholder="Add notes..."
          onChange={(e) =>
            setInvoice({ ...invoice, notes: e.target.value })
          }
        />
      </div>

      {/* Totals */}
      <div className="summary-box">
        <div>
          <span>Subtotal</span>
          <span>₹ {calculateSubtotal().toFixed(2)}</span>
        </div>
        <div>
          <span>Tax</span>
          <span>₹ {(calculateSubtotal() * invoice.tax / 100).toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Total</span>
          <span>₹ {calculateTotal().toFixed(2)}</span>
        </div>
      </div>

      {/* Status */}
     
      <label>Status</label>
      <select
        className="input-field "
        value={invoice.status || "Unpaid"}
        onChange={(e) =>
          setInvoice({ ...invoice, status: e.target.value })
        }
      >
        <option  value="Unpaid">Unpaid</option>
        <option value="Paid">Paid</option>

      </select>

      {/* Buttons */}
      <div className="button-row">
        <button onClick={handleSaveInvoices} className="primary-btn">
          Create Invoice
        </button>
        <button className="secondary-btn">
          Cancel
        </button>
      </div>
      </div>

  </div>
  <div className="preview-section-wrapper">
    <InvoicePreview
  invoice={getDisplayInvoice()}
  subTotal={calculateDisplaySubtotal()}
  total={calculateDisplayTotal()}
  company={company}
/>
  </div>

</div>
);
}
