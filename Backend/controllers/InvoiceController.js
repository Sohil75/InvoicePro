const Invoice = require("../models/Invoice");
const Client = require("../models/Clients");

exports.createInvoice = async (req, res) => {
  try {
    const {client, issueDate, dueDate, items, tax, notes, status } = req.body;

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
    const lastInvoice = await Invoice.findOne({
      createdBy : req.user.id,
    }).sort({createdAt:-1});
    let nextNumber =1;
    if(lastInvoice?.invoiceNumber){
      const match = lastInvoice.invoiceNumber.match(/INV-(\d+)/);
      if(match){
        nextNumber = parseInt(match[1],10)+1;
      }
    }
    const invoiceNumber = `INV-${String(nextNumber).padStart(4,"0")}`;
    console.log("Generated invoiceNumber:", invoiceNumber);
    const subTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    const total = subTotal + (subTotal * tax || 0)/100;

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
      status :status || "Unpaid",
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
  const search = req.query.search || "";
  const invoices = await Invoice.aggregate([
    {
      $match:{
        createdBy :req.user._id,
      },
    },
    {
      $lookup:{
        from:"clients",
        localField:"client",
        foreignField:"_id",
        as:"client",
      },
    },
    {$unwind:"$client",

    },

    ...(search ?
    [
      {
        $match:{
          $or:[
            {
              invoiceNumber:{
                $regex:`^${search}`,
                $options:"i",
              },
            },
            {
              "client.name":{
                $regex:`^${search}`,
                $options:"i",
              },
            },
            {
              "client.email":{
                $regex:`^${search}`,
                $options:"i",
              },
            },
          ],
        },
      },
    ]:[]),
    {$sort:{createdAt:-1}},

  ]);
  const today = new Date();
  const updatedInvoice = invoices.map((inv)=>{
    if(
      inv.status !=="Paid" && 
      new Date(inv.dueDate)<today
    ){
      inv.status="Overdue";
    }
    return inv;
  });
  res.json(updatedInvoice);
 } catch (error) {
  console.error("search invoices error",error);
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
      { $match: { createdBy: userId,status:"Paid" } },
      {
        $group: {
          _id: { $month: "$issueDate" },
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
