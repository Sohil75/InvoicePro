const Invoice = require("../models/Invoice");
const Client = require("../models/Clients");

exports.createInvoice = async (req, res) => {
  try {
    const { client, issueDate, dueDate, items, tax, notes, status } = req.body;

    let existingClient = await Client.findOne({
      email: client.email,
      createdBy: req.user.id,
    });

    if (!existingClient) {
      existingClient = new Client({
        ...client,
        createdBy: req.user.id,
      });
      await existingClient.save();
    }
    const latestInvoice = await Invoice.findOne({
      createdBy: req.user.id,
    }).sort({ invoiceNumber: -1 });

    const invoiceNumber = latestInvoice ? latestInvoice.invoiceNumber + 1 : 1;

    const subTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const total = subTotal + (tax || 0);

    const invoice = new Invoice({
      invoiceNumber,
      client: existingClient._id,
      issueDate,
      dueDate,
      items: items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
      subTotal,
      tax,
      total,
      notes,
      status,
      createdBy: req.user.id,
    });

    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error("Error creating invoices:", error);

    res.status(500).json({ error: error.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ createdBy: req.user.id }).populate(
      "client"
    );
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getInvoicesById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    }).populate("client");
    if (!invoice) return res.status(404).json({ message: "Invoice not Found" });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Invoice not Found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!deleted) return res.status(404).json({ message: "Invoice not Found" });
    res.json({ message: "Invoice Deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMonthly = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await Invoice.aggregate([
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthNames = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const formatted = data.map((item) => ({
      month: monthNames[item._id],
      total: item.total,
      count: item.count,
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Error fetching monthly data", error);
    res.status(500).json({ error: "Failed to get monthly invoice data" });
  }
};
