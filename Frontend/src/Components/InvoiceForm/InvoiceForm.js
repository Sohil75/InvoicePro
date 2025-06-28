import React, { useEffect, useState } from "react";
import InvoicePreview from "../InvoicePreview/InvoicePreview";
import "./invoiceform.css";
import { IoIosRemove } from "react-icons/io";
import API from "../../api/axios";

export default function InvoiceForm() {
  const [invoice, setInvoice] = useState({
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
  }, []);
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
      await API.post("/invoices", payload);
      console.log("invoice saved", payload);

      alert("Invoice saved success");
    } catch (error) {
      console.error("error saving invoices", error);
      alert("Failed to save invoice");
    }
  };

  return (
    <>
      <div className="invoice-form-container">
        <h2>Create Invoice</h2>
        <label>Select Existing Client</label>
        <select onChange={handleClientSelect} value={invoice.client._id || ""}>
          <option value="" disabled>
            Select Client
          </option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}({client.email})
            </option>
          ))}
        </select>
        <label htmlFor="ClientName">ClientName</label>
        <input
          name="ClientName"
          id="ClientName"
          placeholder="Client Name"
          onChange={(e) =>
            setInvoice({
              ...invoice,
              client: { ...invoice.client, name: e.target.value },
            })
          }
        />

        <label htmlFor="clientEmail">ClientEmail:</label>
        <input
          name="clientEmail"
          id="clientEmail"
          placeholder="Client Email"
          onChange={(e) =>
            setInvoice({
              ...invoice,
              client: { ...invoice.client, email: e.target.value },
            })
          }
        />

        <label htmlFor="issueDate">Issue Date:</label>
        <input
          type="date"
          id="issueDate"
          name="issueDate"
          onChange={handleChange}
        />

        <label htmlFor="dueDate">DueDate Date:</label>
        <input
          type="date"
          id="dueDate"
          name="dueDate"
          onChange={handleChange}
        />
        <br />
        <br />

        {invoice.items.map((item, idx) => (
          <div key={idx} className="item-row">
            <div className="form-group">
              <label>Description</label>
              <input
                placeholder="Item Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(idx, "description", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(idx, "quantity", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Rate</label>
              <input
                type="number"
                value={item.rate}
                onChange={(e) => handleItemChange(idx, "rate", e.target.value)}
              />
            </div>

            {invoice.items.length > 1 && (
              <button onClick={() => removeItem(idx)} className="remove-button">
                <IoIosRemove />
              </button>
            )}
          </div>
        ))}
        <button onClick={addItems} className="Add-button">
          Add Item
        </button>
        <br />
        <label htmlFor="tax">Tax %:</label>
        <input
          type="number"
          id="tax"
          placeholder="Tax %"
          value={invoice.tax}
          onChange={(e) =>
            setInvoice({ ...invoice, tax: Number(e.target.value) })
          }
          className="tax"
        />
        <label htmlFor="notes">Notes:</label>
        <textarea
          placeholder="Notes"
          id="notes"
          onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
          className="Notes-area"
        />
        <br />
        <label htmlFor="status" className="stat">
          Status:
        </label>
        <select
          id="status"
          value={invoice.status || "Unpaid"}
          onChange={(e) => setInvoice({ ...invoice, status: e.target.value })}
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
          <option value="Overdue">Overdue</option>
        </select>
        <button onClick={handleSaveInvoices} className="save-button">
          Save Invoice
        </button>
      </div>

      <div>
        <InvoicePreview
          invoice={invoice}
          subTotal={calculateSubtotal()}
          total={calculateTotal()}
        />
      </div>
    </>
  );
}
