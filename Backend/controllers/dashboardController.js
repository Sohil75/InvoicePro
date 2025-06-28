const Invoice = require("../models/Invoice");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [paid, unpaid, overdue, totalInvoices, totalRevenue] =
      await Promise.all([
        Invoice.countDocuments({ createdBy: userId, status: "Paid" }),
        Invoice.countDocuments({ createdBy: userId, status: "Unpaid" }),
        Invoice.countDocuments({ createdBy: userId, status: "Overdue" }),
        Invoice.countDocuments({ createdBy: userId }),
        Invoice.aggregate([
          { $match: { createdBy: userId } },
          { $group: { _id: null, total: { $sum: "$total" } } },
        ]),
      ]);
    res.json({
      paid,
      unpaid,
      overdue,
      totalInvoices,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard stats failed" });
  }
};
