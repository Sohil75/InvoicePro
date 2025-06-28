const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: Number, required: true },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    issueDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    items: [ItemSchema],
    subTotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Paid", "Unpaid", "Overdue"],
      default: "Unpaid",
    },
    notes: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
