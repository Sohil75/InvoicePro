const mongoose = require("mongoose");

const ClientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    company: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    gstNumber: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Client", ClientSchema);
