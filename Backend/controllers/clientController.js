const Client = require("../models/Clients");

exports.createClient = async (req, res) => {
  try {
    const client = new Client({ ...req.body, createdBy: req.user.id });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user.id });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      req.body,
      { new: true }
    );
    if (!client) return res.status(404).json({ message: "Client not found" });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!client) return res.status(404).json({ message: "client not found" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recentClients = async (req, res) => {
  try {
    const clients = await Client.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: "Failed to get monthly invoice data" });
  }
};
